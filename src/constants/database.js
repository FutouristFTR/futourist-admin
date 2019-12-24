const firebaseCollections = {
  REVIEWS: "reviews",
  VOTES: "votes",
  USERS: "users",
  USERS_EXTRAS: "usersExtras",
  PLACES: "places",
  PLACES_EXTRAS: "placesExtras",
  CATEGORIES: "categories",
  BUNDLES: "bundles",
  OUTFITS: "outfits",
};

const firebaseCollectionConnections = {
  [firebaseCollections.PLACES]: {
    [firebaseCollections.PLACES_EXTRAS]: "id",
  },
  [firebaseCollections.USERS]: {
    [firebaseCollections.USERS_EXTRAS]: "id",
  },
};

const firebaseEditableFields = {
  PLACES: [
    "name",
    "lat",
    "lng",
    "mainPhoto",
    "categories",
    "tags",
    "pitch",
    "gsm",
    "email",
    "roles",
  ],
};

const managementRoles = {
  OWNER: "owner",
  MANAGER: "manager",
};

const paginatedBatchSize = 25;
const maximumBatchSize = 100000;

export {
  firebaseCollections,
  firebaseCollectionConnections,
  firebaseEditableFields,
  paginatedBatchSize,
  maximumBatchSize,
  managementRoles,
};
