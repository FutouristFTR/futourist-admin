const admin = require("firebase-admin");

module.exports = function updateAuthUser(req, res) {
  const { uid, data } = req.body.params;

  return admin
    .auth()
    .updateUser(uid, data)
    .then(() => {
      console.log(`USER successfully updated`, uid, data);
      return res.send();
    })
    .catch(error => {
      res.status(400).json(error);
      console.log("Error updating user", error);
    });
};
