CampusCare — Complaint Management Platform

Overview
CampusCare is a full‑stack complaint management platform for campuses. Students can file complaints (with media/voice), track status, and receive updates. Admins, department heads, and faculty can triage, assign, and resolve issues with role‑based access. The project includes rich analytics, export tools (CSV, PDF, DOCX, Image), and secure authentication.

Key Features
- Authentication with JWT (students, faculty, heads, admins)
- Role‑based access control for complaints and departments
- Complaint submission with media and voice notes
- SLA, urgency, and priority tracking with escalation fields
- Dashboard with KPIs and charts for admins
- Export center:
  - CSV (server‑side, filter‑aware, large datasets)
  - PDF (text‑based report with KPIs and table)
  - DOCX and Image (dashboard snapshot)
- Password reset via email (Nodemailer)
- Admin seeding/management scripts

Tech Stack
- Backend: Node.js, Express, MongoDB (Mongoose)
- Auth: JWT
- Mailer: Nodemailer (Gmail or SMTP)
- Frontend: React (Vite), TailwindCSS, DaisyUI, Recharts
- Exports: jsPDF + autoTable, PapaParse, html-to-image, docx

Monorepo Structure
```
E:/CampusCare
├─ backend/           # Express API
│  ├─ config/         # DB connection
│  ├─ controllers/    # Auth & complaints
│  ├─ middleware/     # JWT protect
│  ├─ models/         # Mongoose schemas
│  ├─ routes/         # API routes
│  └─ uploads/        # User uploads & exports
└─ frontend/          # React app (Vite)
   └─ src/            # Pages, components, utils
```

Requirements
- Node.js ≥ 18 (tested on 22.x)
- MongoDB (Atlas or local)

Environment Variables
Create a `.env` file in `backend/` with:
```
PORT=5000
MONGO_URI="mongodb://localhost:27017/campuscare"
# or use MONGODB_URI
MONGODB_URI="mongodb://localhost:27017/campuscare"

# JWT secret
JWT_SECRET="a-strong-random-secret"

# Nodemailer (example for Gmail; consider App Passwords)
EMAIL_USER="youremail@example.com"
EMAIL_PASS="your-app-password"
```

Quick Start
1) Install dependencies
```
# From repo root
cd backend && npm install
cd ../frontend && npm install
```

2) Seed / update admin user (optional)
```
cd backend
# Seed default admin (admin@famt.ac.in / admin@123)
npm run seed:admin
# Or update/create via manager
npm run update:admin
npm run admin list
```

3) Run the apps
```
# Terminal A
cd backend
npm run dev   # or: node server.js

# Terminal B
cd frontend
npm run dev   # Vite dev server
```
Backend will start at `http://localhost:5000`, frontend at the Vite URL (e.g., `http://localhost:5173`).

Core API Endpoints (selection)
- Auth
  - POST `/api/auth/register` — student registration (only `@famt.ac.in`)
  - POST `/api/auth/login` — login (all roles)
  - POST `/api/auth/admin-login` — admin login
  - POST `/api/auth/forgot` — send password reset link
  - POST `/api/auth/reset` — reset with token
  - GET  `/api/auth/profile` — current user
  - Note: Single active session per user is enforced. A new login invalidates old tokens; old sessions will receive 401 with message "Session invalidated. Please log in again."
- Complaints
  - POST `/api/complaints` — create (supports media/voice; token optional for anonymous)
  - GET  `/api/complaints` — list with filters (auth required; role‑filtered)
    - Query params: `id, from, to, dept, status, urgency, assigned, priority, limit`
  - GET  `/api/complaints/:id` — get single (auth + role‑guarded)
  - PATCH `/api/complaints/:id` — update (role‑based fields)
  - GET  `/api/complaints/export/csv` — admin CSV export (honors filters). Add `save=true` to persist to server and return a URL.
- Health
  - GET `/api/health` — returns status, uptime, timestamp, app version, and DB connectivity state
  - GET `/api/ready` — returns 200 when DB is connected, otherwise 503

Frontend Highlights
- `src/pages/AdminDashboard.jsx` — Admin views, filters, actions, and export dropdown
- `src/utils/exportUtils.js` — CSV, PDF, DOCX, Image exports
- `src/contexts/AuthContext.jsx` — session handling, login/logout flows
- `src/components/Charts.jsx` — overview charts

Export Guide
- CSV (recommended for raw data)
  - Uses server endpoint `/api/complaints/export/csv` to handle large datasets
  - With `save=true`, CSV is stored at `backend/uploads/exports/complaints-report-<timestamp>.csv` and accessible at `/uploads/exports/<filename>`
- PDF (text‑first)
  - jsPDF + autoTable: includes KPIs and a paginated table of complaints
- DOCX & Image
  - Snapshot‑style exports useful for sharing a visual dashboard summary

Admin & Roles
- Roles: `student`, `faculty`, `head`, `admin`
- Access rules are enforced on the server
  - Admin: full access
  - Head/Faculty: department‑scoped
  - Student: own complaints
- Admin scripts in `backend/ADMIN_SETUP.md` and `backend/adminManager.js`

Security Notes
- JWT is required for protected routes — set `Authorization: Bearer <token>`
- Registration restricted to `@famt.ac.in` domain
- Passwords hashed with bcrypt
- Uploaded files served from `/uploads` path; ensure appropriate hosting controls in production

Deployment Tips
- Serve frontend as static assets (Vite build) behind a reverse proxy
- Run backend with a process manager (PM2) or containerize
- Configure environment variables securely (no hardcoded secrets)
- Use a production mail transport (or transactional email provider)

Troubleshooting
- “Cannot find module …”: run `npm install` in both `backend/` and `frontend/`
- MongoDB connection errors: verify `MONGO_URI`/`MONGODB_URI`
- Email not sending: verify `EMAIL_USER`/`EMAIL_PASS` and provider restrictions
- CSV not downloading: confirm you are logged in as admin and backend is running
- PDF color issues: we use a text‑based PDF; for dashboard snapshots, DOCX/Image use `html-to-image`

Scripts Reference
Backend `package.json` (selected):
- `npm run dev` — start with nodemon
- `npm run seed:admin` — create default admin
- `npm run update:admin` — reset admin password
- `npm run admin` — admin manager (create/update/list/delete)

Frontend `package.json` (selected):
- `npm run dev` — Vite dev server
- `npm run build` — production build
- `npm run preview` — preview build locally

License
MIT (or your preferred license). Update this section if needed.


