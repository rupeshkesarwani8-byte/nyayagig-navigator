import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./components/Navbar";
import DeactivationHelper from "./components/DeactivationHelper";
import EscalationGuide from "./components/EscalationGuide";
import AuthPage from "./components/AuthPage";
import ProfilePage from "./components/ProfilePage";
import { translations } from "./translations";
import "./App.css";

const API = "http://127.0.0.1:8000";
const PLATFORMS = ["Zomato", "Swiggy", "Blinkit", "Zepto", "Uber", "Ola", "Rapido", "Urban Company", "Other"];

function SummaryBanner({ result, t }) {
  if (!result) return null;

  const singleDone = 90 - result.days_left_single_platform;
  const multiDone = result.total_days;

  let message = "";
  let icon = "📊";

  if (result.eligible) {
    icon = "🎉";
    message = "Congratulations! You are eligible for social security benefits. Apply now using your work certificate.";
  } else if (result.days_left_single_platform <= 10 && result.days_left_single_platform > 0) {
    icon = "🔥";
    message = `You're almost there! Just ${result.days_left_single_platform} more day(s) on a single platform to become eligible.`;
  } else if (result.days_left_multi_platform <= 15 && result.days_left_multi_platform > 0) {
    icon = "⏳";
    message = `Keep going! ${result.days_left_multi_platform} more day(s) across platforms to reach eligibility.`;
  } else {
    icon = "💪";
    message = `You've logged ${multiDone} working day(s) so far. Keep logging daily to track your progress toward benefits.`;
  }

  return (
    <div className={`summary-banner ${result.eligible ? "banner-success" : "banner-progress"}`}>
      <span className="banner-icon">{icon}</span>
      <p>{message}</p>
    </div>
  );
}

function Dashboard({ user, t }) {
  const [platform, setPlatform] = useState("Zomato");
  const [workDate, setWorkDate] = useState("");
  const [earnings, setEarnings] = useState("");
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
        earnings: earnings ? parseFloat(earnings) : 0,
      });
      setMessage(res.data.message);
      setScreenshot(null);
      setEarnings("");
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

  const downloadCertificate = async () => {
    setError("");
    try {
      const res = await axios.get(`${API}/eligibility/${phone}/certificate`);
      const blob = new Blob([res.data.certificate_text], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Work_Certificate_${phone}.txt`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      setError("Could not generate certificate.");
    }
  };

  const exportData = async () => {
    setError("");
    try {
      const res = await axios.get(`${API}/eligibility/${phone}/export`);
      const blob = new Blob([JSON.stringify(res.data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `NyayaGig_Data_${phone}.json`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      setError("Could not export data.");
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  const singleDone = result ? 90 - result.days_left_single_platform : 0;
  const multiDone = result ? result.total_days : 0;

  return (
    <main className="container">
      <SummaryBanner result={result} t={t} />

      <section className="card form-card">
        <div className="card-strip strip-purple" />
        <h2>{t.dashboard.logTitle}</h2>
        <p className="subtitle">{t.dashboard.loggedInAs}: {user.name} ({user.phone})</p>

        <label>{t.dashboard.platform}</label>
        <select value={platform} onChange={(e) => setPlatform(e.target.value)}>
          {PLATFORMS.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>

        <label>{t.dashboard.workDate}</label>
        <input
          type="date"
          value={workDate}
          onChange={(e) => setWorkDate(e.target.value)}
        />

        <label>{t.dashboard.earnings}</label>
        <input
          type="number"
          placeholder="e.g. 850"
          value={earnings}
          onChange={(e) => setEarnings(e.target.value)}
        />

        <label>{t.dashboard.screenshot}</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setScreenshot(e.target.files[0] || null)}
        />
        {screenshot && <p className="file-hint">📎 {screenshot.name} attached</p>}
        <p className="file-note">{t.dashboard.fileNote}</p>

        <div className="buttons">
          <button className="primary" onClick={saveDay}>{t.dashboard.saveDay}</button>
          <button className="secondary" onClick={checkStatus}>{t.dashboard.refresh}</button>
        </div>

        {message && <p className="success">✅ {message}</p>}
        {error && <p className="error">⚠️ {error}</p>}
      </section>

      {!result && (
        <section className="card empty-card">
          <div className="empty-icon">📊</div>
          <h3>{t.dashboard.emptyTitle}</h3>
          <p>{t.dashboard.emptyText}</p>
        </section>
      )}

      {result && (
        <section className="card result-card">
          <div className="card-strip strip-green" />
          <h2>{t.dashboard.eligTitle}</h2>

          <div className={result.eligible ? "badge yes" : "badge no"}>
            {result.eligible ? t.dashboard.eligibleYes : t.dashboard.eligibleNo}
          </div>
          <p className="reason">{result.reason}</p>

          <div className="stats-row">
            <div className="stat-box stat-purple">
              <span className="stat-number">{singleDone}</span>
              <span className="stat-label">{t.dashboard.statSingle}</span>
            </div>
            <div className="stat-box stat-green">
              <span className="stat-number">{multiDone}</span>
              <span className="stat-label">{t.dashboard.statAll}</span>
            </div>
          </div>

          <div className="stats-row">
            <div className="stat-box stat-earning">
              <span className="stat-number">₹{result.total_earnings.toLocaleString("en-IN")}</span>
              <span className="stat-label">{t.dashboard.totalEarnings}</span>
            </div>
            <div className="stat-box stat-earning-alt">
              <span className="stat-number">₹{result.average_daily_earning.toLocaleString("en-IN")}</span>
              <span className="stat-label">{t.dashboard.avgPerDay}</span>
            </div>
          </div>

          <div className="evidence-split">
            <div className="evidence-chip verified">
              ✅ {result.evidence_backed_days} {t.dashboard.evidenceBacked}
            </div>
            <div className="evidence-chip unverified">
              📝 {result.self_declared_days} {t.dashboard.selfDeclared}
            </div>
          </div>

          <div className="progress-block">
            <div className="progress-label">
              <span>{t.dashboard.singlePlatform}</span>
              <span>{singleDone} / 90</span>
            </div>
            <div className="bar">
              <div className="fill" style={{ width: `${Math.min(100, (singleDone / 90) * 100)}%` }} />
            </div>
            <small>{result.days_left_single_platform} {t.dashboard.daysRemaining}</small>
          </div>

          <div className="progress-block">
            <div className="progress-label">
              <span>{t.dashboard.allPlatforms}</span>
              <span>{multiDone} / 120</span>
            </div>
            <div className="bar">
              <div className="fill green" style={{ width: `${Math.min(100, (multiDone / 120) * 100)}%` }} />
            </div>
            <small>{result.days_left_multi_platform} {t.dashboard.daysRemaining}</small>
          </div>

          <h3>{t.dashboard.daysByPlatform}</h3>
          <ul className="platform-list">
            {Object.entries(result.days_per_platform).map(([name, days]) => (
              <li key={name}>
                <span>{name}</span>
                <span className="platform-right">
                  <strong>{days} days</strong>
                  <small className="earning-small">₹{(result.earnings_per_platform[name] || 0).toLocaleString("en-IN")}</small>
                </span>
              </li>
            ))}
          </ul>

          <button className="secondary full-width" onClick={downloadCertificate} style={{ marginTop: "20px" }}>
            {t.dashboard.downloadCert}
          </button>
          <button className="secondary full-width" onClick={exportData} style={{ marginTop: "10px" }}>
            {t.dashboard.exportData}
          </button>
        </section>
      )}
    </main>
  );
}

function App() {
  const [page, setPage] = useState("dashboard");
  const [user, setUser] = useState(null);
  const [checkedStorage, setCheckedStorage] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem("nyayagig_theme") || "light");
  const [lang, setLang] = useState(() => localStorage.getItem("nyayagig_lang") || "en");

  const t = translations[lang];

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("nyayagig_theme", newTheme);
  };

  const toggleLang = () => {
    const newLang = lang === "en" ? "hi" : "en";
    setLang(newLang);
    localStorage.setItem("nyayagig_lang", newLang);
  };

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
    <div className={`page ${theme === "dark" ? "dark-theme" : ""}`}>
      <Navbar
        activePage={page}
        onNavigate={setPage}
        user={user}
        onLogout={handleLogout}
        theme={theme}
        onToggleTheme={toggleTheme}
        lang={lang}
        onToggleLang={toggleLang}
        t={t}
      />

      <header className="header">
        <h1>{t.header.title}</h1>
        <p>{t.header.subtitle}</p>
      </header>

      {!user ? (
        <AuthPage onLoginSuccess={handleLoginSuccess} t={t} />
      ) : (
        <>
          {page === "dashboard" && <Dashboard user={user} t={t} />}
          {page === "deactivation" && <DeactivationHelper user={user} t={t} />}
          {page === "escalation" && <EscalationGuide t={t} />}
          {page === "profile" && <ProfilePage user={user} onProfileUpdate={setUser} t={t} />}
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