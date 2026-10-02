import { useState } from "react";
import axios from "axios";

const API = "http://127.0.0.1:8000";

function AuthPage({ onLoginSuccess, t }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    setError("");
    if (!name || !phone || !password) {
      setError("Please fill in all fields");
      return;
    }
    if (!agreed) {
      setError("Please confirm that the information you provide will be accurate");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API}/auth/signup`, { name, phone, password });
      setMode("login");
      setError("");
      setPassword("");
    } catch (e) {
      setError(e.response?.data?.detail || "Something went wrong during signup");
    }
    setLoading(false);
  };

  const handleLogin = async () => {
    setError("");
    if (!phone || !password) {
      setError("Please enter phone number and password");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`${API}/auth/login`, { phone, password });
      localStorage.setItem("nyayagig_user", JSON.stringify(res.data));
      onLoginSuccess(res.data);
    } catch (e) {
      setError(e.response?.data?.detail || "Something went wrong during login");
    }
    setLoading(false);
  };

  return (
    <main className="container">
      <section className="card form-card">
        <div className="card-strip strip-purple" />
        <h2>{mode === "login" ? t.auth.loginTitle : t.auth.signupTitle}</h2>

        {mode === "signup" && (
          <>
            <label>{t.auth.fullName}</label>
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </>
        )}

        <label>{t.auth.phone}</label>
        <input
          type="tel"
          placeholder="9999999999"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <label>{t.auth.password}</label>
        <input
          type="password"
          placeholder="At least 6 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {mode === "signup" && (
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            <span>{t.auth.confirm}</span>
          </label>
        )}

        <div className="buttons">
          {mode === "login" ? (
            <button className="primary" onClick={handleLogin} disabled={loading}>
              {loading && <span className="spinner" />}
              {loading ? t.auth.loggingIn : t.auth.login}
            </button>
          ) : (
            <button className="primary" onClick={handleSignup} disabled={loading}>
              {loading && <span className="spinner" />}
              {loading ? t.auth.creating : t.auth.signup}
            </button>
          )}
        </div>

        {error && <p className="error">⚠️ {error}</p>}

        <p className="switch-mode">
          {mode === "login" ? (
            <>
              {t.auth.noAccount}{" "}
              <span onClick={() => { setMode("signup"); setError(""); }}>{t.auth.signUpLink}</span>
            </>
          ) : (
            <>
              {t.auth.haveAccount}{" "}
              <span onClick={() => { setMode("login"); setError(""); }}>{t.auth.logInLink}</span>
            </>
          )}
        </p>
      </section>
    </main>
  );
}

export default AuthPage;