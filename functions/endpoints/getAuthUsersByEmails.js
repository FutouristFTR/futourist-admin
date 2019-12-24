const admin = require("firebase-admin");
const getUsersFromFirestore = require("../utils/getUsersFromFirestore");

module.exports = function getAuthUsersByEmails(req, res) {
  const { emails } = req.body.params;

  let getUsersPromises = [];
  emails.forEach(email => {
    getUsersPromises.push(admin.auth().getUserByEmail(email));
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
      console.log(`RETRIEVED users by emails from auth (size: ${users.length})`);
      return res.json(users);
    })
    .catch(error => {
      res.json([]);
      console.log("Error fetching user data:", error);
    });
};
