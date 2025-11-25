import React, { useState } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import axios from "axios";

// ⬇️ PASTE YOUR CLIENT ID HERE ⬇️
const GOOGLE_CLIENT_ID =
  "121812187178-4k45pug4c44k3aequo6gqgl1f2tbfd71.apps.googleusercontent.com";
const BACKEND_URL = "http://localhost:5000";

function App() {
  const [token, setToken] = useState(null);
  const [logs, setLogs] = useState([]);

  const addLog = (title, data) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [
      `[${timestamp}] ${title}: ${JSON.stringify(data, null, 2)}`,
      ...prev,
    ]);
  };

  const handleLoginSuccess = (credentialResponse) => {
    const idToken = credentialResponse.credential;
    setToken(idToken);
    addLog(
      "✅ Login Success",
      "Token received: " + idToken.substring(0, 15) + "..."
    );
  };

  // Helper for authenticated requests
  const apiRequest = async (method, endpoint, data = null) => {
    if (!token) return alert("Please login first!");

    try {
      const res = await axios({
        method,
        url: `${BACKEND_URL}${endpoint}`,
        headers: { Authorization: `Bearer ${token}` },
        data,
      });
      addLog(`🟢 SUCCESS: ${method} ${endpoint}`, res.data);
    } catch (err) {
      addLog(
        `🔴 ERROR: ${method} ${endpoint}`,
        err.response?.data || err.message
      );
    }
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div
        style={{
          padding: 20,
          maxWidth: 800,
          margin: "0 auto",
          fontFamily: "monospace",
        }}
      >
        <h1>🛠️ Backend Tester</h1>

        {/* 1. Login Area */}
        <div
          style={{
            marginBottom: 20,
            padding: 15,
            border: "1px solid #ccc",
            borderRadius: 8,
          }}
        >
          <h3>Step 1: Authentication</h3>
          {!token ? (
            <GoogleLogin
              onSuccess={handleLoginSuccess}
              onError={() => alert("Login Failed")}
            />
          ) : (
            <div style={{ color: "green", fontWeight: "bold" }}>
              Token Active! You can now test routes.
            </div>
          )}
        </div>

        {/* 2. Route Testing Buttons */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 10,
            marginBottom: 20,
          }}
        >
          <button onClick={() => apiRequest("GET", "/user/me")}>
            👤 Get My Profile
          </button>

          <button
            onClick={() => {
              const name = prompt("Group Name?");
              if (name) apiRequest("POST", "/groups", { name });
            }}
          >
            👥 Create Group
          </button>

          <button onClick={() => apiRequest("GET", "/groups/my")}>
            📜 My Groups
          </button>

          <button
            onClick={() => {
              const code = prompt("Enter Group Code to Join:");
              if (code) apiRequest("POST", "/groups/join", { groupCode: code });
            }}
          >
            🔗 Join Group (by Code)
          </button>

          <button
            onClick={() =>
              apiRequest("POST", "/transactions", {
                amount: 100,
                type: "EXPENSE",
                category: "Food",
                merchant: "Test Burger",
              })
            }
          >
            🍔 Add Fake Expense (100)
          </button>

          <button onClick={() => apiRequest("GET", "/transactions/my")}>
            💰 Get Transactions
          </button>
        </div>

        {/* 3. Logs */}
        <div
          style={{
            background: "#eee",
            padding: 10,
            height: 300,
            overflowY: "auto",
            borderRadius: 5,
          }}
        >
          <h3>Console Logs:</h3>
          {logs.map((l, i) => (
            <pre key={i} style={{ borderBottom: "1px solid #ddd", padding: 5 }}>
              {l}
            </pre>
          ))}
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;
