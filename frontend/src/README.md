# ⚖️ NyayaGig Navigator

**A rights, eligibility, and support platform for India's gig economy workers.**

🔗 **Live Website:** https://nyayagig-navigator.vercel.app
🔗 **Backend API:** https://nyayagig-navigator.onrender.com/docs

---

## 📖 About

India has an estimated **1.2 crore gig workers** today (NITI Aayog), projected to reach **2.3 crore by 2029–30**. Under the Code on Social Security, 2020, workers become eligible for health insurance and pension benefits after completing **90 days on a single platform or 120 days across multiple platforms** — but no platform shows this combined total, so most workers never realize they're eligible.

NyayaGig Navigator solves three connected problems these workers face:

1. **Invisible eligibility** — no way to track combined working days across platforms
2. **Sudden, unexplained deactivation** — no clear reason, no structured way to appeal
3. **No escalation path** — no clarity on which government authority to approach

---

## Features

### Module 1 — Eligibility Tracker
- Log daily work (platform, date, earnings) with optional screenshot proof
- Automatic 90/120-day eligibility calculation
- Evidence-backed vs. self-declared day tracking
- Downloadable work certificate and JSON data export

### Module 2 — Deactivation Helper
- Paste a deactivation notice, get an automatic reason analysis
- Auto-generated legal appeal letter citing central or state law
- Full case history with copy/download for every past case

### Module 3 — Escalation Guide
- State-wise authority lookup (10 states covered, incl. Karnataka's official IPGRS portal)
- Step-by-step guidance for deactivation, payment, and benefit issues

### Also Includes
- Secure login/signup (bcrypt password hashing)
- Editable profile page
- Dark mode
- English / Hindi language toggle

---

## Tech Stack

**Frontend:** React, Vite, Axios, custom CSS
**Backend:** Python, FastAPI, SQLAlchemy, SQLite, Passlib (bcrypt)
**Deployment:** Vercel (frontend) + Render (backend)

---

## Project Structure

nyayagig-navigator/
- backend/  -> FastAPI backend (API, database, business logic)
- frontend/ -> React frontend (UI)

---

## Legal Basis

- Code on Social Security, 2020 (rules notified 2025–2026)
- Karnataka Platform-Based Gig Workers Act, 2025
- Karnataka IPGRS (Integrated Public Grievance Redressal System), launched May 2026

---

## Running Locally

**Backend:**

cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload

**Frontend (separate terminal):**

cd frontend
npm install
npm run dev

---

## Future Scope

- OCR integration for automatic screenshot text extraction
- Real NLP model for deactivation reason detection
- Browser push notifications for eligibility milestones
- Broader state coverage
- Government/union licensing

---

*Built as an independent tool to stand on the worker's side — not the platform's.*


