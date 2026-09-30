import { useState } from "react";
import axios from "axios";

const API = "http://127.0.0.1:8000";

const STATES = [
  { value: "uttar_pradesh", label: "Uttar Pradesh" },
  { value: "karnataka", label: "Karnataka" },
  { value: "maharashtra", label: "Maharashtra" },
  { value: "delhi", label: "Delhi" },
  { value: "other", label: "Other State" },
];

const PROBLEMS = [
  { value: "deactivation", label: "No response to deactivation appeal" },
  { value: "payment", label: "Payment not received" },
  { value: "benefits", label: "Social security benefit not received" },
];

function EscalationGuide() {
  const [state, setState] = useState("uttar_pradesh");
  const [problem, setProblem] = useState("deactivation");
  const [guide, setGuide] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const findGuide = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await axios.get(`${API}/escalation/guide`, {
        params: { state, problem },
      });
      setGuide(res.data);
    } catch (e) {
      setError("Could not connect to the server. Is the backend running?");
    }
    setLoading(false);
  };

  return (
    <main className="container">
      <section className="card form-card">
        <div className="card-strip strip-purple" />
        <h2>🧭 Escalation Guide</h2>
        <p className="subtitle">
          If the platform hasn't responded, find out where to go next
        </p>

        <label>🏛️ Your State</label>
        <select value={state} onChange={(e) => setState(e.target.value)}>
          {STATES.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>

        <label>❓ Your Issue</label>
        <select value={problem} onChange={(e) => setProblem(e.target.value)}>
          {PROBLEMS.map((p) => (
            <option key={p.value} value={p.value}>{p.label}</option>
          ))}
        </select>

        <div className="buttons">
          <button className="primary" onClick={findGuide} disabled={loading}>
            {loading && <span className="spinner" />}
            {loading ? "Finding..." : "Show Guide"}
          </button>
        </div>

        {error && <p className="error">⚠️ {error}</p>}
      </section>

      {!guide && (
        <section className="card empty-card">
          <div className="empty-icon">🧭</div>
          <h3>No guide selected yet</h3>
          <p>Choose your state and issue above, then click "Show Guide".</p>
        </section>
      )}

      {guide && (
        <section className="card result-card">
          <div className="card-strip strip-green" />
          <h2>📍 Your Guide</h2>

          <div className="law-box">
            <strong>Where to Go:</strong>
            <p>{guide.authority}</p>
          </div>

          <div className="stats-row">
            <div className="stat-box stat-purple">
              <span className="stat-label" style={{ fontSize: "0.9rem", fontWeight: 700, color: "#4c1d95" }}>
                📞 {guide.contact}
              </span>
            </div>
          </div>

          <a href={guide.website} target="_blank" rel="noreferrer" className="website-link">
            🔗 {guide.website}
          </a>

          <h3>Steps to Follow</h3>
          <ul className="steps-list">
            {guide.steps.map((step, i) => (
              <li key={i}>
                <span className="step-number">{i + 1}</span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}

export default EscalationGuide;