import { firebaseCollections } from "constants/database";

const collectionsState = {};

Object.keys(firebaseCollections).forEach(collection => {
  collectionsState[firebaseCollections[collection]] = {
    size: null,
    lastPaginationValue: null,
    loadedAll: false,
  };
});

const initialState = Object.assign({}, collectionsState);

export default function databaseReducer(state, action) {
  if (state === undefined) {
    return initialState;
  }
  var newState = Object.assign({}, state);

  switch (action.type) {
    case "MARK_LOADED_ALL": {
      newState[action.collectionName].loadedAll = true;
      break;
    }

    case "RESET_STORE":
      newState = initialState;
      break;

    default:
      break;
  }
  return newState;
}
