import React, { useState, useEffect } from "react";

function App() {
  const [ledState, setLedState] = useState(false);
  const [dataSent, setDataSent] = useState(false);
  const [timeCalibrated, setTimeCalibrated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Poll backend state every 5 seconds
  useEffect(() => {
    const fetchState = async () => {
      try {
        const response = await fetch("/api/device-state");
        if (response.ok) {
          const data = await response.json();
          setLedState(data.ledState);
          setDataSent(data.dataSent);
          setTimeCalibrated(data.timeCalibrated);
        }
      } catch (error) {
        console.error("Failed to fetch state:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchState();
    const intervalId = setInterval(fetchState, 5000);
    return () => clearInterval(intervalId);
  }, []);

  // API call helpers for buttons
  const callApi = async (endpoint) => {
    try {
      const res = await fetch(endpoint, { method: "POST" });
      if (res.ok) {
        const json = await res.json();
        return json;
      }
    } catch (e) {
      console.error("API call error:", e);
    }
  };

  const toggleLed = async () => {
    const result = await callApi("/api/toggle-led");
    if (result?.ledState !== undefined) setLedState(result.ledState);
  };

  const sendData = async () => {
    const result = await callApi("/api/send-data");
    if (result?.dataSent !== undefined) setDataSent(result.dataSent);
  };

  const recalibrateTime = async () => {
    const result = await callApi("/api/recalibrate-time");
    if (result?.timeCalibrated !== undefined) setTimeCalibrated(result.timeCalibrated);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={styles.container}>
      <h1>ESP32 Device Dashboard</h1>

      <div style={styles.status}>
        <strong>LED State:</strong> {ledState ? "ON" : "OFF"}
      </div>
      <button onClick={toggleLed} style={styles.button}>Led Toggle</button>

      <div style={styles.status}>
        <strong>Data Sent:</strong> {dataSent ? "Yes" : "No"}
      </div>
      <button onClick={sendData} style={styles.button}>Send Data</button>

      <div style={styles.status}>
        <strong>Time Calibrated:</strong> {timeCalibrated ? "Yes" : "No"}
      </div>
      <button onClick={recalibrateTime} style={styles.button}>Recalibrate Time</button>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    maxWidth: 400,
    margin: "50px auto",
    padding: 20,
    border: "1px solid #ccc",
    borderRadius: 8,
  },
  button: {
    margin: "10px 0 30px 0",
    padding: "10px 20px",
    fontSize: 16,
    cursor: "pointer",
  },
  status: {
    marginBottom: 5,
  },
};

export default App;
