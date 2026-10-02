import { useState, useEffect } from "react";
import axios from "axios";

const API = "https://nyayagig-navigator.onrender.com";

function ProfilePage({ user, onProfileUpdate, t }) {
  const [profile, setProfile] = useState(null);
  const [name, setName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const loadProfile = async () => {
    try {
      const res = await axios.get(`${API}/auth/profile/${user.phone}`);
      setProfile(res.data);
      setName(res.data.name);
    } catch (e) {
      setError("Could not load profile.");
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const saveChanges = async () => {
    setError("");
    setMessage("");
    if (!currentPassword) {
      setError("Please enter your current password to save changes");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.put(`${API}/auth/profile`, {
        phone: user.phone,
        name,
        current_password: currentPassword,
        new_password: newPassword || null,
      });
      setMessage("Profile updated successfully");
      setCurrentPassword("");
      setNewPassword("");

      const updatedUser = { ...user, name: res.data.name };
      localStorage.setItem("nyayagig_user", JSON.stringify(updatedUser));
      onProfileUpdate(updatedUser);
      loadProfile();
    } catch (e) {
      setError(e.response?.data?.detail || "Could not update profile");
    }
    setLoading(false);
  };

  const formatDate = (isoString) => {
    if (!isoString) return "—";
    return new Date(isoString).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <main className="container">
      <section className="card form-card">
        <div className="card-strip strip-purple" />
        <h2>{t.profile.title}</h2>

        {profile && (
          <div className="profile-meta">
            <p><strong>{t.profile.phone}</strong> {profile.phone}</p>
            <p><strong>{t.profile.memberSince}</strong> {formatDate(profile.created_at)}</p>
            <p><strong>{t.profile.lastLogin}</strong> {formatDate(profile.last_login)}</p>
          </div>
        )}

        <label>{t.profile.fullName}</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label>{t.profile.currentPassword}</label>
        <input
          type="password"
          placeholder="Enter your current password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />

        <label>{t.profile.newPassword}</label>
        <input
          type="password"
          placeholder="At least 6 characters"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <div className="buttons">
          <button className="primary" onClick={saveChanges} disabled={loading}>
            {loading && <span className="spinner" />}
            {loading ? t.profile.saving : t.profile.save}
          </button>
        </div>

        {message && <p className="success">✅ {message}</p>}
        {error && <p className="error">⚠️ {error}</p>}
      </section>
    </main>
  );
}

export default ProfilePage;