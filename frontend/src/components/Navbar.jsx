import { useState } from "react";

function Navbar({ activePage, onNavigate, user, onLogout, theme, onToggleTheme, lang, onToggleLang, t }) {
  const [open, setOpen] = useState(false);

  const go = (page) => {
    onNavigate(page);
    setOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <span className="logo-icon">⚖️</span>
        <span className="logo-text">NyayaGig</span>
      </div>

      <button className="menu-toggle" onClick={() => setOpen(!open)}>
        ☰
      </button>

      <ul className={`navbar-links ${open ? "show" : ""}`}>
        {user && (
          <>
            <li
              className={activePage === "dashboard" ? "active" : ""}
              onClick={() => go("dashboard")}
            >
              {t.nav.dashboard}
            </li>
            <li
              className={activePage === "deactivation" ? "active" : ""}
              onClick={() => go("deactivation")}
            >
              {t.nav.deactivation}
            </li>
            <li
              className={activePage === "escalation" ? "active" : ""}
              onClick={() => go("escalation")}
            >
              {t.nav.escalation}
            </li>
            <li
              className={activePage === "profile" ? "active" : ""}
              onClick={() => go("profile")}
            >
              {t.nav.profile}
            </li>
            <li onClick={onLogout} className="logout-link">
              {t.nav.logout} ({user.name})
            </li>
          </>
        )}
        <li onClick={onToggleLang} className="lang-toggle-link">
          {lang === "en" ? "🇮🇳 हिंदी" : "🇬🇧 English"}
        </li>
        <li onClick={onToggleTheme} className="theme-toggle-link">
          {theme === "light" ? t.nav.dark : t.nav.light}
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;