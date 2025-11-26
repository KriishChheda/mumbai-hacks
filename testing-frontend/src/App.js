import React, { useState, useEffect } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import "./App.css";

// --- CONFIG ---
const GOOGLE_CLIENT_ID =
  "121812187178-4k45pug4c44k3aequo6gqgl1f2tbfd71.apps.googleusercontent.com";
const BACKEND_URL = "http://localhost:5000";

function App() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [aiAdvice, setAiAdvice] = useState(null);

  // Data States
  const [goals, setGoals] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [groups, setGroups] = useState([]);

  // Form States
  const [newGoal, setNewGoal] = useState({ title: "", target: "" });
  const [newTx, setNewTx] = useState({
    amount: "",
    category: "Food",
    merchant: "",
  });
  const [newGroup, setNewGroup] = useState("");
  const [joinCode, setJoinCode] = useState("");

  // --- AUTH ---
  const handleLogin = (response) => {
    setToken(response.credential);
    fetchUser(response.credential);
  };

  // --- API CALLS ---
  const api = axios.create({
    baseURL: BACKEND_URL,
    headers: { Authorization: `Bearer ${token}` },
  });

  const fetchUser = async (t = token) => {
    try {
      const res = await axios.get(`${BACKEND_URL}/user/me`, {
        headers: { Authorization: `Bearer ${t}` },
      });
      setUser(res.data);
      fetchDashboard(t);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchDashboard = (t) => {
    const headers = { Authorization: `Bearer ${t}` };
    axios
      .get(`${BACKEND_URL}/goals`, { headers })
      .then((r) => setGoals(r.data));
    axios
      .get(`${BACKEND_URL}/transactions/my`, { headers })
      .then((r) => setTransactions(r.data));
    axios
      .get(`${BACKEND_URL}/groups/my`, { headers })
      .then((r) => setGroups(r.data));
  };

  // --- ACTIONS ---

  // 1. AI Agent
  const askAI = async () => {
    const res = await api.get("/ai/recommend");
    setAiAdvice(res.data);
  };

  // 2. Goals
  const addGoal = async () => {
    await api.post("/goals", newGoal);
    fetchDashboard(token);
    setNewGoal({ title: "", target: "" });
  };

  const addProgress = async (id) => {
    const amount = prompt("How much did you save?");
    if (amount) {
      await api.patch(`/goals/${id}/progress`, { amount });
      fetchDashboard(token);
    }
  };

  // 3. Transactions
  const addTransaction = async () => {
    await api.post("/transactions", {
      ...newTx,
      type: "EXPENSE",
      amount: parseFloat(newTx.amount),
    });
    fetchDashboard(token);
    setNewTx({ amount: "", category: "Food", merchant: "" });
    // Auto-refresh AI after spending
    setTimeout(askAI, 500);
  };

  // 4. Groups
  const createGroup = async () => {
    await api.post("/groups", { name: newGroup });
    fetchDashboard(token);
  };

  const joinGroup = async () => {
    await api.post("/groups/join", { groupCode: joinCode });
    fetchDashboard(token);
  };

  if (!token) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
          gap: 20,
        }}
      >
        <h1>🤖 Arth-Sarthi Login</h1>
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          <GoogleLogin
            onSuccess={handleLogin}
            onError={() => alert("Login Failed")}
          />
        </GoogleOAuthProvider>
      </div>
    );
  }

  return (
    <div className="container">
      <header>
        <h1>Arth-Sarthi Dashboard</h1>
        <div style={{ textAlign: "right" }}>
          <strong>{user?.name}</strong>
          <br />
          <small>
            Mood: {user?.mood || "Neutral"} (Score: {user?.score})
          </small>
        </div>
      </header>

      <div className="dashboard">
        {/* 🧠 AI AGENT SECTION */}
        <div className="card ai-box full-width">
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h2>🤖 Agentic AI Advisor</h2>
            <button
              onClick={askAI}
              className="secondary"
              style={{ background: "white", color: "#2563eb" }}
            >
              🔄 Analyze Now
            </button>
          </div>

          {aiAdvice ? (
            <div className="recommendation">
              <strong>💡 Suggestion ({aiAdvice.type})</strong>
              <p style={{ fontSize: "1.1rem", margin: "10px 0" }}>
                {aiAdvice.message}
              </p>
              <small>Confidence Score: {aiAdvice.score}/100</small>
            </div>
          ) : (
            <p>
              Click analyze to get agentic insights based on your spending...
            </p>
          )}
        </div>

        {/* 💰 TRANSACTIONS */}
        <div className="card">
          <h2>💸 Add Expense</h2>
          <div className="flex-row">
            <input
              placeholder="Amount"
              type="number"
              value={newTx.amount}
              onChange={(e) => setNewTx({ ...newTx, amount: e.target.value })}
            />
            <input
              placeholder="Merchant (e.g. Swiggy)"
              value={newTx.merchant}
              onChange={(e) => setNewTx({ ...newTx, merchant: e.target.value })}
            />
          </div>
          <select
            value={newTx.category}
            onChange={(e) => setNewTx({ ...newTx, category: e.target.value })}
          >
            <option value="Food">Food</option>
            <option value="Travel">Travel</option>
            <option value="Shopping">Shopping</option>
            <option value="Impulse">Impulse (AI Test)</option>
          </select>
          <button onClick={addTransaction} className="full-width">
            Add Transaction
          </button>

          <h3 style={{ marginTop: 20 }}>Recent Activity</h3>
          <ul>
            {transactions.slice(0, 3).map((t) => (
              <li key={t.id}>
                <span>
                  {t.merchant} ({t.category})
                </span>
                <span className="tag">₹{t.amount}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 🎯 GOALS */}
        <div className="card">
          <h2>🎯 Personal Goals</h2>
          <div className="flex-row">
            <input
              placeholder="Goal Name"
              value={newGoal.title}
              onChange={(e) =>
                setNewGoal({ ...newGoal, title: e.target.value })
              }
            />
            <input
              placeholder="Target ₹"
              type="number"
              value={newGoal.target}
              onChange={(e) =>
                setNewGoal({ ...newGoal, target: e.target.value })
              }
            />
          </div>
          <button onClick={addGoal} className="success">
            Set Goal
          </button>

          <div style={{ marginTop: 20 }}>
            {goals.map((g) => (
              <div
                key={g.id}
                style={{
                  marginBottom: 10,
                  padding: 10,
                  background: "#f1f5f9",
                  borderRadius: 6,
                }}
              >
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <strong>{g.title}</strong>
                  <span>
                    {g.progress} / {g.target}
                  </span>
                </div>
                <div
                  style={{
                    width: "100%",
                    background: "#cbd5e1",
                    height: 6,
                    borderRadius: 3,
                    marginTop: 5,
                  }}
                >
                  <div
                    style={{
                      width: `${(g.progress / g.target) * 100}%`,
                      background: "#16a34a",
                      height: "100%",
                      borderRadius: 3,
                    }}
                  ></div>
                </div>
                <button
                  onClick={() => addProgress(g.id)}
                  style={{
                    marginTop: 5,
                    padding: "4px 8px",
                    fontSize: "0.8rem",
                  }}
                >
                  + Add Savings
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 👥 GROUPS */}
        <div className="card full-width">
          <h2>👥 Community & Groups</h2>
          <div className="flex-row">
            <input
              placeholder="New Group Name"
              value={newGroup}
              onChange={(e) => setNewGroup(e.target.value)}
            />
            <button onClick={createGroup}>Create</button>
            <span style={{ margin: "0 10px" }}>OR</span>
            <input
              placeholder="Enter Group Code"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
            />
            <button onClick={joinGroup} className="secondary">
              Join
            </button>
          </div>

          <div
            style={{
              display: "flex",
              gap: 10,
              marginTop: 15,
              flexWrap: "wrap",
            }}
          >
            {groups.map((g) => (
              <div
                key={g.id}
                style={{
                  padding: 10,
                  border: "1px solid #ddd",
                  borderRadius: 6,
                  minWidth: 150,
                }}
              >
                <strong>{g.name}</strong>
                <br />
                <small>
                  Code:{" "}
                  <span style={{ background: "#eee", padding: 2 }}>
                    {g.groupCode}
                  </span>
                </small>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
