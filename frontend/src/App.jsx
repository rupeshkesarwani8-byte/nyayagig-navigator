import { useState } from "react";
import axios from "axios";
import Navbar from "./components/Navbar";
import DeactivationHelper from "./components/DeactivationHelper";
import EscalationGuide from "./components/EscalationGuide";
import "./App.css";

const API = "http://127.0.0.1:8000";
const PLATFORMS = ["Zomato", "Swiggy", "Blinkit", "Zepto", "Uber", "Ola", "Rapido", "Urban Company", "Other"];

function Dashboard() {
  const [phone, setPhone] = useState("");
  const [platform, setPlatform] = useState("Zomato");
  const [workDate, setWorkDate] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const saveDay = async () => {
    setError("");
    setMessage("");
    if (!phone || !workDate) {
      setError("Phone number aur date dono bhariye");
      return;
    }
    try {
      const res = await axios.post(`${API}/eligibility/log`, {
        phone,
        platform,
        work_date: workDate,
      });
      setMessage(res.data.message);
      checkStatus();
    } catch (e) {
      setError("Backend se connect nahi ho paya. Backend chal raha hai na?");
    }
  };

  const checkStatus = async () => {
    setError("");
    if (!phone) {
      setError("Pehle phone number bhariye");
      return;
    }
    try {
      const res = await axios.get(`${API}/eligibility/${phone}`);
      setResult(res.data);
    } catch (e) {
      setError("Backend se connect nahi ho paya. Backend chal raha hai na?");
    }
  };

  const singleDone = result ? 90 - result.days_left_single_platform : 0;
  const multiDone = result ? result.total_days : 0;

  return (
    <main className="container">
      <section className="card form-card">
        <div className="card-strip strip-purple" />
        <h2>📝 Aaj ka kaam darj karein</h2>

        <label>📱 Phone number</label>
        <input
          type="tel"
          placeholder="9999999999"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <label>🛵 Platform</label>
        <select value={platform} onChange={(e) => setPlatform(e.target.value)}>
          {PLATFORMS.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>

        <label>📅 Kaam ki date</label>
        <input
          type="date"
          value={workDate}
          onChange={(e) => setWorkDate(e.target.value)}
        />

        <div className="buttons">
          <button className="primary" onClick={saveDay}>Din save karein</button>
          <button className="secondary" onClick={checkStatus}>Meri eligibility dekhein</button>
        </div>

        {message && <p className="success">✅ {message}</p>}
        {error && <p className="error">⚠️ {error}</p>}
      </section>

      {result && (
        <section className="card result-card">
          <div className="card-strip strip-green" />
          <h2>📈 Aapki Eligibility</h2>

          <div className={result.eligible ? "badge yes" : "badge no"}>
            {result.eligible ? "✅ Aap eligible hain" : "⏳ Abhi eligible nahi"}
          </div>
          <p className="reason">{result.reason}</p>

          <div className="stats-row">
            <div className="stat-box stat-purple">
              <span className="stat-number">{singleDone}</span>
              <span className="stat-label">Din (single platform)</span>
            </div>
            <div className="stat-box stat-green">
              <span className="stat-number">{multiDone}</span>
              <span className="stat-label">Din (sab platforms)</span>
            </div>
          </div>

          <div className="progress-block">
            <div className="progress-label">
              <span>Ek platform pe (90 din)</span>
              <span>{singleDone} / 90</span>
            </div>
            <div className="bar">
              <div className="fill" style={{ width: `${Math.min(100, (singleDone / 90) * 100)}%` }} />
            </div>
            <small>{result.days_left_single_platform} din baaki</small>
          </div>

          <div className="progress-block">
            <div className="progress-label">
              <span>Sab platforms milake (120 din)</span>
              <span>{multiDone} / 120</span>
            </div>
            <div className="bar">
              <div className="fill green" style={{ width: `${Math.min(100, (multiDone / 120) * 100)}%` }} />
            </div>
            <small>{result.days_left_multi_platform} din baaki</small>
          </div>

          <h3>Platform ke hisaab se din</h3>
          <ul className="platform-list">
            {Object.entries(result.days_per_platform).map(([name, days]) => (
              <li key={name}>
                <span>{name}</span>
                <strong>{days} din</strong>
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

  return (
    <div className="page">
      <Navbar activePage={page} onNavigate={setPage} />

      <header className="header">
        <h1>NyayaGig Navigator</h1>
        <p>Aapke kaam ke din, aapka haq</p>
      </header>

      {page === "dashboard" && <Dashboard />}
      {page === "deactivation" && <DeactivationHelper />}
      {page === "escalation" && <EscalationGuide />}
    </div>
  );
}

export default App;