const admin = require("firebase-admin");
const firebaseCollections = require("../constants/collections");
const PHOTO_SIZES = require("../constants/media").PHOTO_SIZES;
const imageUrls = require("../utils/imageUrls");
const firestoreCollections = require("../constants/collections");

module.exports = function addPhotos(req, res) {
  const path = require("path");
  const os = require("os");
  const fs = require("fs-extra");
  const Busboy = require("busboy");
  const busboy = new Busboy({ headers: req.headers });
  const tmpdir = os.tmpdir();
  const bucket = admin.storage().bucket();

  let { collection, documentId, type } = req.params;
  if (collection === firebaseCollections.PLACES && !type) type = "photo";
  const uploads = {};
  const fileWrites = [];

  busboy.on("file", (fieldname, file, filename) => {
    const filepath = path.join(tmpdir, filename);
    uploads[fieldname] = filepath;

    const writeStream = fs.createWriteStream(filepath);
    file.pipe(writeStream);

    const promise = new Promise((resolve, reject) => {
      file.on("end", () => {
        writeStream.end();
      });
      writeStream.on("finish", resolve);
      writeStream.on("error", reject);
    });
    fileWrites.push(promise);
  });

  busboy.on("finish", () => {
    let originalPhotoPlaceholders;
    let thumbPhotoPlaceholders;
    return Promise.all(fileWrites)
      .then(() => {
        return makePhotoPlaceholders(collection, documentId, uploads, type);
      })
      .then(photoPlaceholders => {
        originalPhotoPlaceholders = photoPlaceholders;
        return makeResizedPhotos(photoPlaceholders, collection);
      })
      .then(photoPlaceholders => {
        thumbPhotoPlaceholders = photoPlaceholders;
        let bucketPromises = [];
        const allPlaceholders = [...originalPhotoPlaceholders, ...thumbPhotoPlaceholders];
        allPlaceholders.forEach(placeholder => {
          bucketPromises.push(
            bucket.upload(placeholder.filePath, {
              destination: placeholder.storagePath,
              contentType: "image/jpeg",
            })
          );
        });
        return Promise.all(bucketPromises);
      })
      .then(writeReturns => {
        console.log(
          `addPhoto: uploaded ${writeReturns.length} photos for document ${collection}/${documentId}`
        );
        for (const photo of originalPhotoPlaceholders) {
          fs.unlinkSync(photo.filePath);
        }
        for (const photo of thumbPhotoPlaceholders) {
          fs.unlinkSync(photo.filePath);
        }
        let photosToReturn = makePhotosForFirestore(originalPhotoPlaceholders, documentId);
        return res.json(photosToReturn);
      })
      .catch(err => {
        console.error(err);
        try {
          for (const name in uploads) {
            const file = uploads[name];
            fs.unlinkSync(file);
          }
          for (const photo of thumbPhotoPlaceholders) {
            fs.unlinkSync(photo.filePath);
          }
          res.status(500).send(err);
        } catch (error) {
          res.status(500).send(err);
        }
      });
  });
  busboy.end(req.rawBody);
};

async function makePhotoPlaceholders(collection, documentId, uploads, type) {
  const randomString = require("../utils/randomString");
  switch (collection) {
    case firestoreCollections.BUNDLES:
    case firestoreCollections.OUTFITS:
    case firestoreCollections.PLACES: {
      document = await admin
        .firestore()
        .collection(collection)
        .doc(documentId)
        .get();

      if (!collection || !documentId || !document.exists)
        throw new Error(`Document ${collection}/${documentId} does not exist!`);
      const documentData = document.data();
      const photoIds = getPhotoIds(documentData, collection, type);

      let placeholders = [];
      Object.keys(uploads).forEach(name => {
        let newPhotoIds = placeholders.map(placeholder => placeholder.photoId);
        let newPhotoId = randomString(5);
        while (photoIds.indexOf(newPhotoId) > 0 || newPhotoIds.indexOf(newPhotoId) > 0)
          newPhotoId = randomString(5);
        const mediaExtention = `${collection.charAt(0)}${type.charAt(0)}-${newPhotoId}`;
        const storageName = `${documentId}-${mediaExtention}`;
        const storageFolder = `/${collection}/${documentId}/photos`;
        const storagePath = `${storageFolder}/${storageName}.jpg`;

        placeholders.push({
          filePath: uploads[name],
          storagePath: storagePath,
          collection,
          type: type,
          mediaId: newPhotoId,
          mediaExtention: mediaExtention,
          storageFolder,
          storageName,
        });
      });

      return placeholders;
    }
    default: {
      throw new Error(`'${collection}' not a collection you can upload photo to.`);
    }
  }
}

function makeResizedPhotos(photoPlaceholders, collection) {
  const sharp = require("sharp");
  const resizePromises = [];

  photoPlaceholders.forEach(photo => {
    const originalFilePath = photo.filePath;
    PHOTO_SIZES[`${collection}-${photo.type}`].forEach(size => {
      const resizedPath = `${photo.filePath}-${size.w}x${size.h}`;
      const resizedStorageName = `${photo.storageName}-${size.w}x${size.h}`;

      let resizePromise = sharp(originalFilePath)
        .resize(size.w, size.h)
        .toFile(resizedPath)
        .then(() => {
          return {
            filePath: resizedPath,
            storagePath: `${photo.storageFolder}/${resizedStorageName}.jpg`,
          };
        });
      resizePromises.push(resizePromise);
    });
  });

  return Promise.all(resizePromises);
}

function makePhotosForFirestore(originalPhotoPlaceholders, documentId) {
  return originalPhotoPlaceholders.map(placeholder => {
    let links = {};
    let sizes = PHOTO_SIZES[placeholder.collection + "-" + placeholder.type];

    sizes.forEach(size => {
      links[`${size.w}x${size.h}`] = imageUrls.makeImageUrl(
        placeholder.mediaExtention,
        documentId,
        placeholder.collection,
        size.w,
        placeholder.type
      );
    });
    return {
      id: placeholder.mediaId,
      path: placeholder.storageFolder,
      links,
    };
  });
}

function getPhotoIds(documentData, collection, type = null) {
  if (!documentData || !collection) return null;
  switch (collection) {
    case firebaseCollections.PLACES: {
      return !documentData.photos || !documentData.photos.length
        ? []
        : documentData.photos.map(photo => photo.id);
    }
    case firebaseCollections.OUTFITS: {
      if (type === "thumb" && documentData.thumbPhoto && documentData.thumbPhoto.id)
        return [documentData.thumbPhoto.id];
      else if (type === "cover" && documentData.coverPhoto && documentData.coverPhoto.id)
        return [documentData.coverPhoto.id];
      break;
    }
  }
  return [];
}
