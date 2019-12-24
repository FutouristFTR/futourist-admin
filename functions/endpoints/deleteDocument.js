const admin = require("firebase-admin");
const firestore = admin.firestore();

module.exports = function deleteDocuments(req, res) {
  let { collectionId, documentId } = req.params;

  var docRef = firestore.collection(collectionId).doc(documentId);
  docRef
    .delete()
    .then(() => {
      console.log(`DELETED a document: ${collectionId}/${documentId}`);
      return res.json(documentId);
    })
    .catch(error => {
      console.error(error);
      res.status(400).send(error);
    });
};
