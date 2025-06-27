const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.ping = functions.https.onRequest((req, res) => {
  res.send("Ping OK");
});