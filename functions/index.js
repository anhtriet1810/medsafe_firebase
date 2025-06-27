const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

// Simple HTTP function to test deployment
exports.ping = functions.https.onRequest((req, res) => {
  res.status(200).send("Ping received! 🎯 Function is working.");
});
