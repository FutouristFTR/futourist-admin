const admin = require("firebase-admin");
const firestore = admin.firestore();
const prepareForUpload = require("../utils/prepareForUpload");

module.exports = function setDocumentWithMerge(req, res) {
  let { collectionId, documentId } = req.params;
  let documentData = prepareForUpload(req.body.params);

  var docRef = firestore.collection(collectionId).doc(documentId);
  docRef
    .set(documentData, { merge: true })
    .then(() => {
      console.log(`SET a document with merge: ${collectionId}/${documentId}:`, documentData);
      return res.json(documentId);
    })
    .catch(error => {
      console.error(error);
      res.status(400).send(error);
    });
};
