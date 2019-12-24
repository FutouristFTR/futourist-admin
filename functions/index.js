/*
Copyright (c) 2019 Futourist

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ origin: true }));

// FIREBASE INIT
const serviceAccount = require("./config/serviceAccount.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: serviceAccount.project_id + ".appspot.com",
});
const firestore = admin.firestore();
firestore.settings({ timestampsInSnapshots: true });

app.get("/getProjectId/", (req, res) => {
  return res.json({ projectId: serviceAccount.project_id });
});

app.post("/addPhotos/:collection/:documentId/:type?", (req, res) => {
  return require("./endpoints/addPhotos")(req, res);
});

app.get("/getFullCollection/:collectionId", (req, res) => {
  return require("./endpoints/getFullCollection")(req, res);
});

app.post("/getCollectionPage/", (req, res) => {
  return require("./endpoints/getCollectionPage")(req, res);
});

app.post("/getCollectionDocumentsByIds/", (req, res) => {
  return require("./endpoints/getCollectionDocumentsByIds")(req, res);
});

app.post("/createNewDocument/:collectionId/:documentId?", (req, res) => {
  return require("./endpoints/createNewDocument")(req, res);
});

app.post("/updateDocument/:collectionId/:documentId", (req, res) => {
  return require("./endpoints/updateDocument")(req, res);
});

app.delete("/deleteDocument/:collectionId/:documentId", (req, res) => {
  return require("./endpoints/deleteDocument")(req, res);
});

app.post("/setDocumentWithMerge/:collectionId/:documentId", (req, res) => {
  return require("./endpoints/setDocumentWithMerge")(req, res);
});

app.post("/getAuthUsersByIds", (req, res) => {
  return require("./endpoints/getAuthUsersByIds")(req, res);
});

app.post("/getAuthUsersByEmails", (req, res) => {
  return require("./endpoints/getAuthUsersByEmails")(req, res);
});

app.post("/getUsersPage", (req, res) => {
  return require("./endpoints/getUsersPage")(req, res);
});

app.post("/updateAuthUser", (req, res) => {
  return require("./endpoints/updateAuthUser")(req, res);
});

module.exports.af = functions.https.onRequest(app);
