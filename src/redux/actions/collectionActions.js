export function addDocumentsToCollection(documents, collectionName, dispatch) {
  dispatch({
    type: "ADD_DOCUMENTS_TO_COLLECTION",
    documents,
    collectionName,
  });
}

export function updateDocumentInCollection(docId, updatedDocument, collectionName, dispatch) {
  dispatch({
    type: "UPDATE_DOCUMENT_IN_COLLECTION",
    docId,
    updatedDocument,
    collectionName,
  });
}

export function deleteDocumentFromCollection(docId, collectionName, dispatch) {
  dispatch({
    type: "DELETE_DOCUMENT_FROM_COLLECTION",
    docId,
    collectionName,
  });
}

export function updateObjectKeyInDocument(
  fieldName,
  fieldKey,
  fieldValue,
  docId,
  collectionName,
  dispatch
) {
  dispatch({
    type: "UPDATE_OBJECT_FIELD_IN_DOCUMENT",
    fieldName,
    fieldKey,
    fieldValue,
    docId,
    collectionName,
  });
}

export function deleteObjectKeyFromDocument(fieldName, fieldKey, docId, collectionName, dispatch) {
  dispatch({
    type: "DELETE_OBJECT_KEY_FROM_DOCUMENT",
    fieldName,
    fieldKey,
    docId,
    collectionName,
  });
}
