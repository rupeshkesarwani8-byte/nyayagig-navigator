import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./components/Navbar";
import DeactivationHelper from "./components/DeactivationHelper";
import EscalationGuide from "./components/EscalationGuide";
import AuthPage from "./components/AuthPage";
import "./App.css";

const API = "http://127.0.0.1:8000";
const PLATFORMS = ["Zomato", "Swiggy", "Blinkit", "Zepto", "Uber", "Ola", "Rapido", "Urban Company", "Other"];

function Dashboard({ user }) {
  const [platform, setPlatform] = useState("Zomato");
  const [workDate, setWorkDate] = useState("");
  const [screenshot, setScreenshot] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const phone = user.phone;

  const saveDay = async () => {
    setError("");
    setMessage("");
    if (!workDate) {
      setError("Please select a date");
      return;
    }
    try {
      const res = await axios.post(`${API}/eligibility/log`, {
        phone,
        platform,
        work_date: workDate,
        has_evidence: !!screenshot,
      });
      setMessage(res.data.message);
      setScreenshot(null);
      checkStatus();
    } catch (e) {
      setError("Could not connect to the server. Is the backend running?");
    }
  };

  const checkStatus = async () => {
    setError("");
    try {
      const res = await axios.get(`${API}/eligibility/${phone}`);
      setResult(res.data);
    } catch (e) {
      setError("Could not connect to the server. Is the backend running?");
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  const singleDone = result ? 90 - result.days_left_single_platform : 0;
  const multiDone = result ? result.total_days : 0;

  return (
    <main className="container">
      <section className="card form-card">
        <div className="card-strip strip-purple" />
        <h2>📝 Log Today's Work</h2>
        <p className="subtitle">Logged in as: {user.name} ({user.phone})</p>

        <label>🛵 Platform</label>
        <select value={platform} onChange={(e) => setPlatform(e.target.value)}>
          {PLATFORMS.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>

        <label>📅 Work Date</label>
        <input
          type="date"
          value={workDate}
          onChange={(e) => setWorkDate(e.target.value)}
        />

        <label>📷 Proof Screenshot (optional but recommended)</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setScreenshot(e.target.files[0] || null)}
        />
        {screenshot && <p className="file-hint">📎 {screenshot.name} attached</p>}
        <p className="file-note">
          Days with a screenshot are marked as "evidence-backed" — stronger proof for appeals and applications.
        </p>

        <div className="buttons">
          <button className="primary" onClick={saveDay}>Save Day</button>
          <button className="secondary" onClick={checkStatus}>Refresh</button>
        </div>

        {message && <p className="success">✅ {message}</p>}
        {error && <p className="error">⚠️ {error}</p>}
      </section>

      {!result && (
        <section className="card empty-card">
          <div className="empty-icon">📊</div>
          <h3>No data yet</h3>
          <p>Log your first work day above to see your eligibility progress here.</p>
        </section>
      )}

      {result && (
        <section className="card result-card">
          <div className="card-strip strip-green" />
          <h2>📈 Your Eligibility</h2>

          <div className={result.eligible ? "badge yes" : "badge no"}>
            {result.eligible ? "✅ You are eligible" : "⏳ Not yet eligible"}
          </div>
          <p className="reason">{result.reason}</p>

          <div className="stats-row">
            <div className="stat-box stat-purple">
              <span className="stat-number">{singleDone}</span>
              <span className="stat-label">Days (single platform)</span>
            </div>
            <div className="stat-box stat-green">
              <span className="stat-number">{multiDone}</span>
              <span className="stat-label">Days (all platforms)</span>
            </div>
          </div>

          <div className="evidence-split">
            <div className="evidence-chip verified">
              ✅ {result.evidence_backed_days} evidence-backed
            </div>
            <div className="evidence-chip unverified">
              📝 {result.self_declared_days} self-declared
            </div>
          </div>

          <div className="progress-block">
            <div className="progress-label">
              <span>Single platform (90 days)</span>
              <span>{singleDone} / 90</span>
            </div>
            <div className="bar">
              <div className="fill" style={{ width: `${Math.min(100, (singleDone / 90) * 100)}%` }} />
            </div>
            <small>{result.days_left_single_platform} days remaining</small>
          </div>

          <div className="progress-block">
            <div className="progress-label">
              <span>All platforms combined (120 days)</span>
              <span>{multiDone} / 120</span>
            </div>
            <div className="bar">
              <div className="fill green" style={{ width: `${Math.min(100, (multiDone / 120) * 100)}%` }} />
            </div>
            <small>{result.days_left_multi_platform} days remaining</small>
          </div>

          <h3>Days by Platform</h3>
          <ul className="platform-list">
            {Object.entries(result.days_per_platform).map(([name, days]) => (
              <li key={name}>
                <span>{name}</span>
                <strong>{days} days</strong>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}

function App() {
  const [page, setPage] = useState("dashboard");
  const [user, setUser] = useState(null);
  const [checkedStorage, setCheckedStorage] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("nyayagig_user");
    if (saved) {
      setUser(JSON.parse(saved));
    }
    setCheckedStorage(true);
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("nyayagig_user");
    setUser(null);
    setPage("dashboard");
  };

  if (!checkedStorage) {
    return null;
  }

  return (
    <div className="page">
      <Navbar activePage={page} onNavigate={setPage} user={user} onLogout={handleLogout} />

      <header className="header">
        <h1>NyayaGig Navigator</h1>
        <p>Your working days, your rights</p>
      </header>

      {!user ? (
        <AuthPage onLoginSuccess={handleLoginSuccess} />
      ) : (
        <>
          {page === "dashboard" && <Dashboard user={user} />}
          {page === "deactivation" && <DeactivationHelper user={user} />}
          {page === "escalation" && <EscalationGuide user={user} />}
        </>
      )}

      <footer className="footer">
        <p>⚖️ NyayaGig Navigator — Built for gig workers, by a gig worker's ally</p>
        <p className="footer-small">Based on the Code on Social Security, 2020 and state gig worker laws</p>
      </footer>
    </div>
  );
}

export default App;