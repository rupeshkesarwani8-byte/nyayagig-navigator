import { useState } from "react";
import axios from "axios";

const API = "http://127.0.0.1:8000";

function AuthPage({ onLoginSuccess }) {
  const [mode, setMode] = useState("login"); // "login" ya "signup"
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    setError("");
    if (!name || !phone || !password) {
      setError("Sab fields bharein");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API}/auth/signup`, { name, phone, password });
      setMode("login");
      setError("");
      setPassword("");
    } catch (e) {
      setError(e.response?.data?.detail || "Signup me error aaya");
    }
    setLoading(false);
  };

  const handleLogin = async () => {
    setError("");
    if (!phone || !password) {
      setError("Phone aur password bharein");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`${API}/auth/login`, { phone, password });
      localStorage.setItem("nyayagig_user", JSON.stringify(res.data));
      onLoginSuccess(res.data);
    } catch (e) {
      setError(e.response?.data?.detail || "Login me error aaya");
    }
    setLoading(false);
  };

  return (
    <main className="container">
      <section className="card form-card">
        <div className="card-strip strip-purple" />
        <h2>{mode === "login" ? "🔐 Login Karein" : "🙋 Naya Account Banayein"}</h2>

        {mode === "signup" && (
          <>
            <label>🙋 Naam</label>
            <input
              type="text"
              placeholder="Aapka naam"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </>
        )}

        <label>📱 Phone number</label>
        <input
          type="tel"
          placeholder="9999999999"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <label>🔑 Password</label>
        <input
          type="password"
          placeholder="Kam se kam 6 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="buttons">
          {mode === "login" ? (
            <button className="primary" onClick={handleLogin} disabled={loading}>
              {loading ? "Login ho raha hai..." : "Login Karein"}
            </button>
          ) : (
            <button className="primary" onClick={handleSignup} disabled={loading}>
              {loading ? "Account ban raha hai..." : "Account Banayein"}
            </button>
          )}
        </div>

        {error && <p className="error">⚠️ {error}</p>}

        <p className="switch-mode">
          {mode === "login" ? (
            <>
              Account nahi hai?{" "}
              <span onClick={() => { setMode("signup"); setError(""); }}>Signup karein</span>
            </>
          ) : (
            <>
              Pehle se account hai?{" "}
              <span onClick={() => { setMode("login"); setError(""); }}>Login karein</span>
            </>
          )}
        </p>
      </section>
    </main>
  );
}

export default AuthPage;