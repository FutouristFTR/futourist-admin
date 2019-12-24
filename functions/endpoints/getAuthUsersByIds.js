const admin = require("firebase-admin");
const getUsersFromFirestore = require("../utils/getUsersFromFirestore");

module.exports = function getAuthUsersByIds(req, res) {
  const { ids } = req.body.params;

  let getUsersPromises = [];
  ids.forEach(id => {
    getUsersPromises.push(admin.auth().getUser(id));
  });

  let users = [];
  return Promise.all(getUsersPromises)
    .then(authUsers => {
      users = authUsers;
      return getUsersFromFirestore(authUsers);
    })
    .then(firestoreUsers => {
      users = firestoreUsers.map((firestoreUser, index) =>
        Object.assign(firestoreUser || {}, users[index] || {})
      );

      console.log(`RETRIEVED users by id from auth (size: ${users.length})`);
      return res.json(users);
    })
    .catch(error => {
      res.json([]);
      console.log("Error fetching user data:", error);
    });
};
