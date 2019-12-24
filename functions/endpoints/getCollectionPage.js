const admin = require("firebase-admin");
const firestore = admin.firestore();
const timestampsToDates = require("../utils/timestamps");

module.exports = function getCollectionPage(req, res) {
  if (["created", "updated"].indexOf(req.body.params.orderBy) >= 0) {
    req.body.params.start = new Date(req.body.params.start);
  }

  const {
    collectionName,
    where = null,
    orderBy = "created",
    orderDirection = "desc",
    start = new Date(),
    limit = 50,
  } = req.body.params;

  if (!collectionName) return res.status(400).send("Error: collectionName undefined");

  let queryPromise = firestore.collection(collectionName);

  if (where && where.length === 3) {
    queryPromise = queryPromise.where(...where);
  }
  return queryPromise
    .orderBy(orderBy, orderDirection.toLowerCase())
    .startAt(start)
    .limit(limit)
    .get()
    .then(snapshot => {
      let parsedDocuments = [];
      snapshot.forEach(doc => {
        let retrievedDocument = doc.data();
        retrievedDocument = timestampsToDates(retrievedDocument);
        retrievedDocument.id = doc.id;
        parsedDocuments.push(retrievedDocument);
      });
      console.log(
        `RETRIEVED paginated docs from collection /${collectionName} (batch size: ${parsedDocuments.length}), sending to front...`
      );
      return res.json(parsedDocuments);
    })
    .catch(error => {
      res.status(400).json(error);
      console.error(
        "getPaginatedCollection: Error retrieving collection /" + collectionName,
        error
      );
    });
};
