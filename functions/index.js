const functions = require("firebase-functions");
const express = require("express");
const app = express();

app.use(express.json());

// In-memory device state (reset on each deploy)
let deviceState = {
  ledState: false,
  dataSent: false,
  timeCalibrated: false,
};

app.post("/api/toggle-led", (req, res) => {
  deviceState.ledState = !deviceState.ledState;
  res.json({ ledState: deviceState.ledState });
});

app.post("/api/send-data", (req, res) => {
  deviceState.dataSent = true;
  res.json({ dataSent: deviceState.dataSent });
});

app.post("/api/recalibrate-time", (req, res) => {
  deviceState.timeCalibrated = true;
  res.json({ timeCalibrated: deviceState.timeCalibrated });
});

app.get("/api/device-state", (req, res) => {
  res.json(deviceState);
});

exports.api = functions.https.onRequest(app);
