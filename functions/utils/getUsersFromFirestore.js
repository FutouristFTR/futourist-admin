const admin = require("firebase-admin");
const firestore = admin.firestore();
const collections = require("../constants/collections");
const timestampsToDates = require("../utils/timestamps");

module.exports = function getUsersFromFirestore(authUsers) {
  let firestorePromises = authUsers.map(user => {
    let usersPromise = firestore
      .collection(collections.USERS)
      .doc(user.uid)
      .get()
      .then(userDoc => {
        if (!userDoc.exists) {
          return null;
        }
        return userDoc.data();
      });

    let usersExtrasPromise = firestore
      .collection(collections.USERS_EXTRAS)
      .doc(user.uid)
      .get()
      .then(userDoc => {
        if (!userDoc.exists) {
          return null;
        }
        return userDoc.data();
      });
    return [usersPromise, usersExtrasPromise];
  });

  firestorePromises = [].concat.apply([], firestorePromises);

  return Promise.all(firestorePromises).then(firestoreUsers => {
    let users = [];

    for (let i = 0; i < firestoreUsers.length / 2; i++) {
      users[i] = Object.assign(
        timestampsToDates(firestoreUsers[i * 2 + 1] || {}),
        timestampsToDates(firestoreUsers[i * 2]) || {}
      );
    }
    return users;
  });
};
