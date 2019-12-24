const admin = require("firebase-admin");
const firestore = admin.firestore();
const prepareForUpload = require("../utils/prepareForUpload");

module.exports = function createNewDocument(req, res) {
  let { collectionId, documentId } = req.params;
  let documentData = prepareForUpload(req.body.params);

  let writePromise = documentId
    ? firestore
        .collection(collectionId)
        .doc(documentId)
        .set(documentData)
    : firestore.collection(collectionId).add(documentData);

  return writePromise
    .then(ref => {
      let id = ref && ref.id ? ref.id : documentId;
      console.log(`CREATED a document in ${collectionId}/${id}:`, documentData);
      return res.json({ documentId: id });
    })
    .catch(error => {
      console.error(error);
      res.status(400).send(error);
    });
};
