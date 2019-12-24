const admin = require("firebase-admin");
const firestore = admin.firestore();

module.exports = function getCollectionDocumentsByIds(req, res) {
  const { collectionName, ids } = req.body.params;

  let docRefs = ids.map(id => {
    return firestore.collection(collectionName).doc(id);
  });

  return firestore
    .getAll(docRefs)
    .then(snapshot => {
      let parsedDocuments = {};
      snapshot.forEach(doc => {
        if (doc.exists) {
          let retrievedDocument = doc.data();
          retrievedDocument.id = doc.id;
          parsedDocuments[doc.id] = retrievedDocument;
        }
      });
      console.log(
        `RETRIEVED docs by id from collection /${collectionName} (size: ${parsedDocuments.length})`
      );
      return res.json(parsedDocuments);
    })
    .catch(error => {
      res.status(400).json(error);
      console.error(
        `getDocuments: Error retrieving documents from ${collectionName}. Tried to trieve these ids:`,
        ids,
        error
      );
    });
};
