import internalServer from "./servers/internalServer";

export {
  getPaginatedCollectionFromDb,
  getFullCollectionFromDb,
  getCollectionPage,
  getDocumentsByIdsFromDb,
  getFullSubcollectionFromDb,
  getAuthUsersPage,
  updateAuthUser,
  getAuthUsersByIdsFromDb,
  getAuthUsersByEmailsFromDb,
  setDocumentWithMergeInDb,
  createNewDocumentInDb,
  updateDocumentInDb,
  deleteDocumentFromDb,
  setSubcollectionDocumentWithMergeInDb,
  removeDocFromSubcollectionInDb,
};

function getPaginatedCollectionFromDb(collectionName, limit, orderFieldValueOfLastDoc) {
  return internalServer
    .post("/getPaginatedCollection/", {
      params: {
        collectionName, // collection to get from
        limit, // document batch size
        orderFieldValueOfLastDoc: orderFieldValueOfLastDoc || undefined, // value of the orderBy field of the last document retrieved (used to get the next batch of docs)
      },
    })
    .then(response => {
      return response.data;
    });
}

function getFullCollectionFromDb(collectionName) {
  return internalServer.get("/getFullCollection/" + collectionName).then(response => {
    return response.data;
  });
}

function getCollectionPage(query) {
  if (!query.collectionName) throw new Error("Error: query.collectioName undefined");
  return internalServer
    .post("/getCollectionPage/", {
      params: {
        collectionName: query.collectionName,
        where: query.where && query.where.length === 3 ? query.where : null,
        orderBy: query.orderBy || "created",
        orderDirection: query.orderDirection || "DESC",
        start: query.start || 0,
        limit: query.limit || 50,
      },
    })
    .then(response => {
      if (response.data && response.data.length) {
        response.data = response.data.map(document => {
          if (document.created) document.created = new Date(document.created);
          if (document.updated) document.updated = new Date(document.updated);
          return document;
        });
      }
      return response.data;
    });
}

function getDocumentsByIdsFromDb(collectionName, ids) {
  return internalServer
    .post("/getCollectionDocumentsByIds/", {
      params: {
        collectionName,
        ids,
      },
    })
    .then(response => {
      return response.data;
    });
}

function getFullSubcollectionFromDb(collectionName, docId, subcollectionName) {
  return internalServer
    .get(`/getSubcollection/${collectionName}/${docId}/${subcollectionName}`)
    .then(response => {
      return response.data;
    });
}

function getAuthUsersPage(pageSize, nextPageToken = undefined) {
  return internalServer
    .post("/getUsersPage/", {
      params: {
        pageSize,
        nextPageToken,
      },
    })
    .then(response => {
      return response.data;
    });
}

function updateAuthUser(uid, data) {
  return internalServer
    .post("/updateAuthUser/", {
      params: {
        uid,
        data,
      },
    })
    .then(response => {
      return response.data;
    });
}

function getAuthUsersByIdsFromDb(ids) {
  return internalServer
    .post("/getAuthUsersByIds/", {
      params: {
        ids,
      },
    })
    .then(response => {
      return response.data;
    });
}

function getAuthUsersByEmailsFromDb(emails) {
  return internalServer
    .post("/getAuthUsersByEmails/", {
      params: {
        emails,
      },
    })
    .then(response => {
      return response.data;
    });
}

function createNewDocumentInDb(docId, doc, collectionName) {
  docId = docId || "";
  delete doc.id;
  return internalServer
    .post(`/createNewDocument/${collectionName}/${docId}`, {
      params: doc,
    })
    .then(response => {
      return response.data;
    });
}

function setDocumentWithMergeInDb(docId, doc, collectionName) {
  return internalServer
    .post(`/setDocumentWithMerge/${collectionName}/${docId}`, {
      params: doc,
    })
    .then(response => {
      return response.data;
    });
}

function updateDocumentInDb(docId, doc, collectionName) {
  delete doc.id;
  return internalServer
    .post(`/updateDocument/${collectionName}/${docId}`, {
      params: doc,
    })
    .then(response => {
      return response.data;
    });
}

function deleteDocumentFromDb(docId, collectionName) {
  return internalServer.delete(`/deleteDocument/${collectionName}/${docId}`);
}

function setSubcollectionDocumentWithMergeInDb(
  collectionName,
  documentId,
  subcollectionName,
  subdocumentId,
  doc
) {
  return internalServer
    .post(
      `/setSubcollectionDocumentWithMerge/${collectionName}/${documentId}/${subcollectionName}/${subdocumentId}`,
      {
        params: doc,
      }
    )
    .then(response => {
      return response.data;
    });
}

function removeDocFromSubcollectionInDb(
  collectionName,
  documentId,
  subcollectionName,
  subdocumentId
) {
  return internalServer
    .delete(
      `/removeDocFromSubcollection/${collectionName}/${documentId}/${subcollectionName}/${subdocumentId}`
    )
    .then(response => {
      return response.data;
    });
}
