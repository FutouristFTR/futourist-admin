const serviceAccount = require("../config/serviceAccount.json");
const PHOTO_SIZES = require("../constants/media").PHOTO_SIZES;

function makeImageUrl(mediaExtention, documentId, collection, width, type) {
  let { imgWidth, imgHeight } = getImageDimensions(collection, width, type);
  let projectId = serviceAccount.project_id;
  let imagePath = `${collection}/${documentId}/photos/${documentId}-${mediaExtention}-${imgWidth}x${imgHeight}.jpg`;
  return `https://firebasestorage.googleapis.com/v0/b/${projectId}.appspot.com/o/${encodeURIComponent(
    imagePath
  )}?alt=media&${new Date().getTime().toString(36)}`;
}

function getImageDimensions(collection, width, type) {
  let collectionKey = collection + "-" + type;
  let possibleDimensions = PHOTO_SIZES[collectionKey];
  let possibleWidths = possibleDimensions.map(dim => dim.w);
  let { imgWidth, index } = closestNumber(possibleWidths, width);
  let imgHeight = possibleDimensions[index].h;

  return { imgWidth, imgHeight };
}

function closestNumber(array, value) {
  let index = 0;
  let imgWidth = array[index];
  array.forEach((el, i) => {
    if (Math.abs(el - value) < Math.abs(el - imgWidth)) {
      imgWidth = el;
      index = i;
    }
  });
  return { imgWidth, index };
}

module.exports = {
  makeImageUrl,
};
