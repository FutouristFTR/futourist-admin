const admin = require("firebase-admin");
const firestore = admin.firestore();
const prepareForUpload = require("../utils/prepareForUpload");

module.exports = function updateDocuments(req, res) {
  let { collectionId, documentId } = req.params;
  let documentData = prepareForUpload(req.body.params);

  var docRef = firestore.collection(collectionId).doc(documentId);
  docRef
    .update(documentData)
    .then(() => {
      console.log(`UPDATED a document: ${collectionId}/${documentId}:`, documentData);
      return res.json(documentId);
    })
    .catch(error => {
      console.error(error);
      res.status(400).send(error);
    });
};
