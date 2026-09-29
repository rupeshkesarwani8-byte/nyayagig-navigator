import { useState } from "react";
import axios from "axios";

const API = "http://127.0.0.1:8000";
const PLATFORMS = ["Zomato", "Swiggy", "Blinkit", "Zepto", "Uber", "Ola", "Rapido", "Urban Company", "Other"];
const STATES = [
  { value: "central", label: "Central Law (Default)" },
  { value: "karnataka", label: "Karnataka" },
];

function DeactivationHelper() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
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
      setError("Phone number aur deactivation notice dono bhariye");
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
      setError("Backend se connect nahi ho paya. Backend chal raha hai na?");
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
          Apna account deactivation notice paste karein, hum reason samjhenge aur appeal letter bana denge
        </p>

        <label>🙋 Naam (optional)</label>
        <input
          type="text"
          placeholder="Aapka naam"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

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

        <label>🏛️ Aapka state (kaunsa law lagana hai)</label>
        <select value={state} onChange={(e) => setState(e.target.value)}>
          {STATES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>

        <label>📄 Deactivation notice (jo message platform ne bheja)</label>
        <textarea
          rows="4"
          placeholder='Jaise: "Your account has been deactivated due to policy violation"'
          value={noticeText}
          onChange={(e) => setNoticeText(e.target.value)}
        />

        <label>📷 Screenshot attach karein (evidence ke liye, optional)</label>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        {screenshot && <p className="file-hint">📎 {screenshot.name} attach ho gaya</p>}
        <p className="file-note">
          Note: abhi photo sirf record ke liye save hoti hai. Photo se text automatically padhna (OCR) aage jodenge — abhi upar wale box me khud type karein.
        </p>

        <div className="buttons">
          <button className="primary" onClick={analyze} disabled={loading}>
            {loading ? "Analyze ho raha hai..." : "Notice Analyze Karein"}
          </button>
        </div>

        {error && <p className="error">⚠️ {error}</p>}
      </section>

      {result && (
        <section className="card result-card">
          <div className="card-strip strip-green" />
          <h2>📋 Analysis Result</h2>

          <div className="reason-box">
            <strong>Pehchana Gaya Reason:</strong>
            <p>{result.detected_reason_text}</p>
          </div>

          <div className="law-box">
            <strong>Lagu Kanoon:</strong>
            <p>{result.law_used.law_name} ({result.law_used.section})</p>
            <small>{result.law_used.requirement}</small>
          </div>

          <div className="stats-row">
            <div className="stat-box stat-purple">
              <span className="stat-number">{result.days_worked_logged}</span>
              <span className="stat-label">Din (is platform pe, aapke record se)</span>
            </div>
          </div>

          <h3>✍️ Generated Appeal Letter</h3>
          <pre className="letter-box">{result.generated_letter}</pre>

          <div className="buttons">
            <button className="secondary" onClick={copyLetter}>
              {copied ? "✅ Copy ho gaya!" : "📋 Copy Karein"}
            </button>
            <button className="primary" onClick={downloadLetter}>
              ⬇️ Download Karein
            </button>
          </div>
        </section>
      )}
    </main>
  );
}

export default DeactivationHelper;