const admin = require("firebase-admin");
const firestore = admin.firestore();

module.exports = function getFullCollection(req, res) {
  var { collectionId } = req.params; // request data
  console.log("REQUEST:", collectionId);
  var collectionRef = firestore.collection(collectionId); // firebase reference to the wanted collection
  const timestampsToDates = require("../utils/timestamps");

  return collectionRef
    .get() //get collection from firebase
    .then(snapshot => {
      let parsedDocuments = {};
      snapshot.forEach(doc => {
        let retrievedDocument = doc.data();
        retrievedDocument = timestampsToDates(retrievedDocument);
        retrievedDocument.id = doc.id;
        parsedDocuments[doc.id] = retrievedDocument;
      });
      console.log(
        `RETRIEVED full collection /${collectionId}, (size: ${parsedDocuments &&
          Object.keys(parsedDocuments).length}) sending to front...`
      );
      return res.json(parsedDocuments);
    })
    .catch(error => {
      res.status(400).json(error);
      console.error("ERROR getFullCollection: Error retrieving collection /" + collectionId, error);
    });
};
