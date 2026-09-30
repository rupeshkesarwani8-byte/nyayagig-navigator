import { useState } from "react";
import axios from "axios";

const API = "http://127.0.0.1:8000";
const PLATFORMS = ["Zomato", "Swiggy", "Blinkit", "Zepto", "Uber", "Ola", "Rapido", "Urban Company", "Other"];
const STATES = [
  { value: "central", label: "Central Law (Default)" },
  { value: "karnataka", label: "Karnataka" },
];

function DeactivationHelper({ user }) {
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [platform, setPlatform] = useState("Zomato");
  const [state, setState] = useState("central");
  const [noticeText, setNoticeText] = useState("");
  const [screenshot, setScreenshot] = useState(null);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const analyze = async () => {
    setError("");
    setResult(null);
    if (!phone || !noticeText) {
      setError("Please enter phone number and the deactivation notice");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`${API}/deactivation/analyze`, {
        name,
        phone,
        platform,
        state,
        notice_text: noticeText,
      });
      setResult(res.data);
    } catch (e) {
      setError("Could not connect to the server. Is the backend running?");
    }
    setLoading(false);
  };

  const copyLetter = () => {
    navigator.clipboard.writeText(result.generated_letter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadLetter = () => {
    const blob = new Blob([result.generated_letter], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Appeal_Letter_${phone}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setScreenshot(file || null);
  };

  return (
    <main className="container">
      <section className="card form-card">
        <div className="card-strip strip-purple" />
        <h2>🚫 Deactivation Helper</h2>
        <p className="subtitle">
          Paste your account deactivation notice and we'll identify the reason and generate an appeal letter
        </p>

        <label>🙋 Full Name</label>
        <input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label>📱 Phone Number</label>
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

        <label>🏛️ Your State (determines applicable law)</label>
        <select value={state} onChange={(e) => setState(e.target.value)}>
          {STATES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>

        <label>📄 Deactivation Notice (the message the platform sent you)</label>
        <textarea
          rows="4"
          placeholder='e.g. "Your account has been deactivated due to policy violation"'
          value={noticeText}
          onChange={(e) => setNoticeText(e.target.value)}
        />

        <label>📷 Attach Screenshot (optional, for your records)</label>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        {screenshot && <p className="file-hint">📎 {screenshot.name} attached</p>}
        <p className="file-note">
          Note: the photo is currently saved for reference only. Automatic text extraction (OCR) from screenshots is coming soon — for now, please type the notice above.
        </p>

        <div className="buttons">
          <button className="primary" onClick={analyze} disabled={loading}>
            {loading && <span className="spinner" />}
            {loading ? "Analyzing..." : "Analyze Notice"}
          </button>
        </div>

        {error && <p className="error">⚠️ {error}</p>}
      </section>

      {!result && (
        <section className="card empty-card">
          <div className="empty-icon">📄</div>
          <h3>No analysis yet</h3>
          <p>Fill in the form above and click "Analyze Notice" to see your results here.</p>
        </section>
      )}

      {result && (
        <section className="card result-card">
          <div className="card-strip strip-green" />
          <h2>📋 Analysis Result</h2>

          <div className="reason-box">
            <strong>Detected Reason:</strong>
            <p>{result.detected_reason_text}</p>
          </div>

          <div className="law-box">
            <strong>Applicable Law:</strong>
            <p>{result.law_used.law_name} ({result.law_used.section})</p>
            <small>{result.law_used.requirement}</small>
          </div>

          <div className="stats-row">
            <div className="stat-box stat-purple">
              <span className="stat-number">{result.days_worked_logged}</span>
              <span className="stat-label">Days worked on this platform (from your records)</span>
            </div>
          </div>

          <h3>✍️ Generated Appeal Letter</h3>
          <pre className="letter-box">{result.generated_letter}</pre>

          <div className="buttons">
            <button className="secondary" onClick={copyLetter}>
              {copied ? "✅ Copied!" : "📋 Copy"}
            </button>
            <button className="primary" onClick={downloadLetter}>
              ⬇️ Download
            </button>
          </div>
        </section>
      )}
    </main>
  );
}

export default DeactivationHelper;