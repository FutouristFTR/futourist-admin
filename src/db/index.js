import { addPhotos } from "./media";

import {
  getPaginatedCollectionFromDb,
  getFullCollectionFromDb,
  getDocumentsByIdsFromDb,
  getAuthUsersByIdsFromDb,
  getAuthUsersByEmailsFromDb,
  createNewDocumentInDb,
  setDocumentWithMergeInDb,
  updateDocumentInDb,
  deleteDocumentFromDb,
  getFullSubcollectionFromDb,
  removeDocFromSubcollectionInDb,
  setSubcollectionDocumentWithMergeInDb,
} from "./admin";

export {
  // storage related
  addPhotos,
  // admin sdk related
  getPaginatedCollectionFromDb,
  getFullCollectionFromDb,
  getDocumentsByIdsFromDb,
  getAuthUsersByIdsFromDb,
  getAuthUsersByEmailsFromDb,
  createNewDocumentInDb,
  setDocumentWithMergeInDb,
  updateDocumentInDb,
  deleteDocumentFromDb,
  getFullSubcollectionFromDb,
  removeDocFromSubcollectionInDb,
  setSubcollectionDocumentWithMergeInDb,
};
