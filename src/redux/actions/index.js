import { setAuthUser } from "./authActions";

import {
  startLoader,
  stopLoader,
  showNotification,
  closeNotification,
  closePrompt,
  showPrompt,
  resetStore,
} from "./pageActions";

import {
  addDocumentsToCollection,
  updateDocumentInCollection,
  deleteDocumentFromCollection,
  updateObjectKeyInDocument,
  deleteObjectKeyFromDocument,
} from "./collectionActions";

import { markLoadedAll } from "./databaseActions";

export {
  // auth state
  setAuthUser,
  // page state
  startLoader,
  stopLoader,
  showNotification,
  closeNotification,
  closePrompt,
  showPrompt,
  resetStore,
  // collection state
  addDocumentsToCollection,
  updateDocumentInCollection,
  deleteDocumentFromCollection,
  updateObjectKeyInDocument,
  deleteObjectKeyFromDocument,
  // database state
  markLoadedAll,
};
