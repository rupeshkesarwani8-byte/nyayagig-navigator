import { useState } from "react";
import axios from "axios";

const API = "https://nyayagig-navigator.onrender.com";

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

function EscalationGuide({ t }) {
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
        <h2>{t.escalation.title}</h2>
        <p className="subtitle">{t.escalation.subtitle}</p>

        <label>{t.escalation.state}</label>
        <select value={state} onChange={(e) => setState(e.target.value)}>
          {STATES.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>

        <label>{t.escalation.issue}</label>
        <select value={problem} onChange={(e) => setProblem(e.target.value)}>
          {PROBLEMS.map((p) => (
            <option key={p.value} value={p.value}>{p.label}</option>
          ))}
        </select>

        <div className="buttons">
          <button className="primary" onClick={findGuide} disabled={loading}>
            {loading && <span className="spinner" />}
            {loading ? t.escalation.finding : t.escalation.showGuide}
          </button>
        </div>

        {error && <p className="error">⚠️ {error}</p>}
      </section>

      {!guide && (
        <section className="card empty-card">
          <div className="empty-icon">🧭</div>
          <h3>{t.escalation.emptyTitle}</h3>
          <p>{t.escalation.emptyText}</p>
        </section>
      )}

      {guide && (
        <section className="card result-card">
          <div className="card-strip strip-green" />
          <h2>{t.escalation.resultTitle}</h2>

          <div className="law-box">
            <strong>{t.escalation.whereToGo}</strong>
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

          <h3>{t.escalation.steps}</h3>
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