const admin = require("firebase-admin");
const getUsersFromFirestore = require("../utils/getUsersFromFirestore");

module.exports = function getUsersPage(req, res) {
  const { pageSize, nextPageToken } = req.body.params;

  let response = {
    users: [],
    nextPageToken: "",
  };

  return admin
    .auth()
    .listUsers(pageSize, nextPageToken)
    .then(listUsersResult => {
      if (listUsersResult.pageToken) response.nextPageToken = listUsersResult.pageToken;
      else response.nextPageToken = "";

      console.log("listUsersResult.pageToken", listUsersResult.pageToken);
      let users = [];
      listUsersResult.users.forEach(userRecord => {
        let user = userRecord.toJSON();
        delete user.passwordHash;
        delete user.passwordSalt;
        users.push(user);
      });
      response.users = users;
      console.log("users", users);
      return users;
    })
    .then(authUsers => {
      return getUsersFromFirestore(authUsers);
    })
    .then(firestoreUsers => {
      console.log("firestoreUsers", firestoreUsers);
      firestoreUsers.forEach((user, index) => {
        if (user) {
          Object.keys(user).forEach(fieldName => {
            response.users[index][fieldName] = user[fieldName];
          });
        }
      });
      console.log("response", response);
      return res.json(response);
    })
    .catch(error => {
      console.error(error);
      return res
        .status(400)
        .json(
          error.response
            ? error.response.data
              ? error.reponse.data
              : error.response
            : error.data
            ? error.data
            : error
        );
    });
};
