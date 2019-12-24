import { firebaseCollections } from "constants/database";

const collectionsState = {};

Object.keys(firebaseCollections).forEach(collection => {
  collectionsState[firebaseCollections[collection]] = {};
});

const initialState = Object.assign({}, collectionsState);

export default function collectionReducer(state, action) {
  if (state === undefined) {
    return initialState;
  }
  var newState = Object.assign({}, state);

  switch (action.type) {
    case "ADD_DOCUMENTS_TO_COLLECTION": {
      newState[action.collectionName] = Object.assign({}, state[action.collectionName]);
      newState[action.collectionName] = { ...newState[action.collectionName], ...action.documents };
      break;
    }
    case "UPDATE_DOCUMENT_IN_COLLECTION": {
      newState[action.collectionName] = Object.assign({}, state[action.collectionName]);
      newState[action.collectionName][action.docId] = Object.assign(
        {},
        state[action.collectionName][action.docId]
      );
      newState[action.collectionName][action.docId] = {
        ...newState[action.collectionName][action.docId],
        ...action.updatedDocument,
      };
      break;
    }

    case "DELETE_DOCUMENT_FROM_COLLECTION": {
      newState[action.collectionName] = Object.assign({}, state[action.collectionName]);
      delete newState[action.collectionName][action.docId];
      break;
    }

    case "UPDATE_OBJECT_FIELD_IN_DOCUMENT": {
      newState[action.collectionName] = Object.assign({}, state[action.collectionName]);
      newState[action.collectionName][action.docId] = Object.assign(
        {},
        newState[action.collectionName][action.docId]
      );
      newState[action.collectionName][action.docId][action.fieldName] = Object.assign(
        {},
        newState[action.collectionName][action.docId][action.fieldName]
      );

      if (action.fieldValue === null) {
        delete newState[action.collectionName][action.docId][action.fieldName][action.fieldKey];
      } else {
        newState[action.collectionName][action.docId][action.fieldName][action.fieldKey] =
          action.fieldValue;
      }
      break;
    }

    // case "DELETE_OBJECT_KEY_FROM_DOCUMENT": {
    //   newState[action.collectionName] = Object.assign({}, state[action.collectionName]);
    //   newState[action.collectionName][action.docId] = Object.assign(
    //     {},
    //     newState[action.collectionName][action.docId]
    //   );
    //   newState[action.collectionName][action.docId][action.fieldName] = Object.assign(
    //     {},
    //     newState[action.collectionName][action.docId][action.fieldName]
    //   );

    //   delete newState[action.collectionName][action.docId][action.fieldName][action.fieldKey];
    //   break;
    // }

    case "RESET_STORE":
      newState = initialState;
      break;

    default:
      break;
  }
  return newState;
}
