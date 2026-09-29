import { useState } from "react";

function Navbar({ activePage, onNavigate }) {
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
        <li
          className={activePage === "dashboard" ? "active" : ""}
          onClick={() => go("dashboard")}
        >
          Dashboard
        </li>
        <li
          className={activePage === "deactivation" ? "active" : ""}
          onClick={() => go("deactivation")}
        >
          Deactivation Helper
        </li>
        <li
          className={activePage === "escalation" ? "active" : ""}
          onClick={() => go("escalation")}
        >
          Escalation Guide
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;