# FleetFlow — Smart Fleet Management & Logistics ERP

[![Vite](https://img.shields.io/badge/Vite-8.3.0-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19.2.8-20232A?style=flat&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.19-000000?style=flat&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas%20%2F%20Local-47A248?style=flat&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9.4-199900?style=flat&logo=leaflet&logoColor=white)](https://leafletjs.com/)
[![Deployment](https://img.shields.io/badge/Deployment-Render-46E3B7?style=flat&logo=render&logoColor=white)](https://fleetflow-y2lc.onrender.com)

> **FleetFlow** is an enterprise-grade fleet management and logistics intelligence platform built on the MERN stack. It unifies real-time vehicle telemetry, multi-stop route optimization, driver compliance auditing, maintenance schedules, and fuel analytics into a centralized operational command center.

---

## Live Deployment & Repository

- **Live Application:** [https://fleetflow-y2lc.onrender.com](https://fleetflow-y2lc.onrender.com)
- **GitHub Repository:** [https://github.com/Aastha5386/FleetFlow](https://github.com/Aastha5386/FleetFlow)

---

## Table of Contents

1. [Executive Overview](#executive-overview)
2. [Key Capabilities](#key-capabilities)
3. [Role-Based Access Control (RBAC)](#role-based-access-control-rbac)
4. [Demo Accounts & Credentials](#demo-accounts--credentials)
5. [System Architecture](#system-architecture)
6. [Technology Stack](#technology-stack)
7. [Project Directory Structure](#project-directory-structure)
8. [Getting Started (Local Development)](#getting-started-local-development)
9. [Environment Configuration](#environment-configuration)
10. [REST API Documentation](#rest-api-documentation)
11. [Deployment & Production Build](#deployment--production-build)
12. [Authors & Acknowledgments](#authors--acknowledgments)

---

## Executive Overview

Managing commercial logistics fleets across disparate systems creates operational blind spots: unpredictable fuel consumption, route inefficiencies, delayed maintenance, and license compliance risks.

FleetFlow solves these challenges with an integrated operational command center featuring:
- **Intelligent Dispatch & Routing:** Balance transit time, distance, and fuel economy.
- **Continuous Vehicle Monitoring:** Real-time status tracking (`Available`, `On Trip`, `In Shop`, `Out of Service`).
- **Driver Performance & Compliance:** Safety indices and proactive driver license expiration radar.
- **Predictive Maintenance:** Vehicle service schedules, shop cost logs, and odometer wear analytics.
- **Fuel Intelligence:** Liters-per-kilometer auditing and fuel cost trend analysis.
- **Zero-Downtime Architecture:** Dual-engine data layer that connects to live Express/MongoDB APIs while preserving seamless client-side fallbacks for uninterrupted evaluations.

---

## Key Capabilities

### 1. Operations Command Center (Landing Page)
- **Logistics Visuals:** Interactive telemetry display with live corridor simulation (Delhi NH 48 -> Jaipur) showing transponder tracking (`DL-01-AB-1001`, `HR-26-CD-4092`).
- **Auth-Aware Navigation:** Dynamic header displaying *Sign In* / *Get Started* for guests and switching automatically to *Dashboard* / *Logout* for authenticated team members.
- **Route Optimization Engine:** Strategy explorer comparing *Shortest*, *Balanced*, and *Fuel Saver* delivery corridors.
- **Telemetry Charts:** SVG analytics previewing fuel efficiency curves, vehicle utilization gauges, and maintenance expenditures.

### 2. Live Fleet Tracking & Geolocation
- Embedded **Leaflet** map engine rendering vehicle markers, trip waypoints, and corridor paths.
- Instant lookup by license plate, model, or driver assignment.

### 3. Trip Dispatch Management
- Create, dispatch, complete, or cancel freight trips.
- Automatic payload capacity validation preventing vehicle overload violations.

### 4. Safety & Driver Compliance Radar
- Tracks commercial driving license expiration dates with visual urgency alerts (Expired, Expiring Soon, Valid).
- Driver safety scores derived from incident histories and on-time performance.

### 5. Maintenance Tracking & Shop Logs
- Service logging: Engine overhauls, brake pad replacements, oil changes, and tire rotation.
- Automatic status toggling: moving vehicles into `In Shop` during repairs and returning them to `Available` upon completion.

### 6. PWA & Mobile Ready
- Web app manifest and service worker integration for mobile homescreen installation on iOS and Android devices.

---

## Role-Based Access Control (RBAC)

FleetFlow enforces role-based workflows across 5 distinct operational personas:

| Role | Primary Route | Scope & Responsibilities |
| :--- | :--- | :--- |
| **Fleet Manager** | `/dashboard` | System-wide command, vehicle/driver lifecycle, user approvals, overall fleet health. |
| **Dispatcher** | `/dispatcher/dashboard` | Route planning, cargo payload assignments, active dispatch board, trip completion. |
| **Driver** | `/driver/dashboard` | Assigned trip manifest, trip status updates, fuel expense logging, maintenance reporting. |
| **Safety Officer** | `/safety/dashboard` | Driver license compliance radar, safety performance scoring, incident risk reviews. |
| **Financial Analyst** | `/financial/dashboard` | Fuel cost audits, maintenance ROI analysis, trip expense breakdowns. |

---

## Demo Accounts & Credentials

The application includes pre-seeded accounts for instant evaluation across both live MongoDB environments and offline demonstration modes:

| Role | Username | Email | Password |
| :--- | :--- | :--- | :--- |
| **Fleet Manager** | `manager` | `manager@fleetflow.local` | `manager123` |
| **Driver** | `driver` | `ravi.driver@fleetflow.local` | `driver123` |
| **Dispatcher** | `dispatcher` | `dispatcher@fleetflow.local` | `dispatcher123` |
| **Safety Officer** | `safety` | `safety@fleetflow.local` | `safety123` |
| **Financial Analyst** | `finance` | `finance@fleetflow.local` | `finance123` |

*Note: The login screen also supports one-click Quick Sign-In profiles for rapid role switching.*

---

## System Architecture

```
                  +----------------------------------------------+
                  |           Client (React 19 + Vite)           |
                  |  - Role Dashboards   - Leaflet Map Engine    |
                  |  - Intelligence Hub  - PWA Offline Support   |
                  +----------------------+-----------------------+
                                         |
                                  HTTPS / REST API
                                         |
                                         v
                  +----------------------------------------------+
                  |         Backend Server (Node.js/Express)     |
                  |  - JWT Authentication Middleware             |
                  |  - RBAC Route Protection                     |
                  |  - Capacity & Compliance Validation Rules    |
                  +----------------------+-----------------------+
                                         |
                                  Mongoose ODM
                                         |
                                         v
                  +----------------------------------------------+
                  |             MongoDB Database                 |
                  |  - Users     - Vehicles   - Drivers          |
                  |  - Trips     - Fuel Logs  - Maintenance      |
                  +----------------------------------------------+
```

---

## Technology Stack

### Frontend
- **Framework:** React 19 (`react`, `react-dom`)
- **Build Tool:** Vite 8.3
- **Routing:** React Router v7 (`react-router-dom`)
- **Mapping & GIS:** Leaflet 1.9
- **Design & Layout:** Enterprise CSS Variables, responsive grid layouts, custom SVG iconography (Cobalt `#2563EB`, Slate `#0F172A`, Emerald `#10B981`)
- **Linter:** Oxlint

### Backend
- **Runtime:** Node.js (ES Modules)
- **Web Framework:** Express.js 4.19
- **Database ODM:** Mongoose 8.5
- **Authentication:** JSON Web Tokens (`jsonwebtoken`) & `bcryptjs`
- **CORS & Environment:** `cors`, `dotenv`

### Database & Deployment
- **Database:** MongoDB (Local or MongoDB Atlas)
- **Deployment Platform:** Render (Web Service)
- **Static Delivery:** Express static client middleware

---

## Project Directory Structure

```
fleetflow-mern-latest/
├── dist/                          # Production client build artifacts
├── public/                        # Static assets, icons, and PWA manifest
│   ├── favicon.svg
│   ├── manifest.webmanifest
│   └── icons/
├── server/                        # Express backend API
│   ├── middleware/                # JWT verification & role authorization
│   │   └── auth.js
│   ├── models/                    # Mongoose database schemas
│   │   ├── Driver.js
│   │   ├── Fuel.js
│   │   ├── Maintenance.js
│   │   ├── Trip.js
│   │   ├── User.js
│   │   └── Vehicle.js
│   ├── routes/                    # REST API route handlers
│   │   ├── auth.js                # Login, register, Google OAuth, password reset
│   │   ├── drivers.js             # Driver CRUD & compliance
│   │   ├── external.js            # External webhook / simulator endpoints
│   │   ├── fleet.js               # Aggregate fleet statistics
│   │   ├── fuel.js                # Fuel logs & consumption metrics
│   │   ├── maintenance.js         # Service logs & repair tickets
│   │   ├── trips.js               # Dispatch operations & status tracking
│   │   └── vehicles.js            # Vehicle registry & status updates
│   ├── .env.example               # Server environment variables reference
│   ├── index.js                   # Express server entry point
│   └── seed.js                    # Database population script
├── src/                           # React frontend source
│   ├── assets/                    # Project graphics & road visuals
│   ├── components/                # Reusable UI & visual modules
│   │   ├── AuthIcons.jsx          # SVG icon library for auth & navigation
│   │   ├── LiveFleetMap.jsx       # Interactive Leaflet live tracking map
│   │   ├── PWAInstallBanner.jsx   # Mobile installation prompt
│   │   └── RouteOptimizerMap.jsx  # Multi-strategy corridor visualizer
│   ├── pages/                     # Primary application views
│   │   ├── DispatcherDashboard.jsx
│   │   ├── DriverCompliance.jsx
│   │   ├── DriverDashboard.jsx
│   │   ├── FinancialDashboard.jsx
│   │   ├── Intelligence.jsx       # Central Intelligence Hub
│   │   ├── LandingPage.jsx        # Commercial SaaS landing page
│   │   ├── Login.jsx              # Role-aware authentication page
│   │   ├── ManagerDashboard.jsx
│   │   ├── Maintenance.jsx
│   │   ├── Register.jsx
│   │   ├── SafetyDashboard.jsx
│   │   ├── Trips.jsx
│   │   └── Vehicles.jsx
│   ├── styles/                    # Modular stylesheets
│   │   ├── auth.css
│   │   ├── landing.css            # Landing page design system
│   │   └── index.css
│   ├── api.js                     # Centralized API client & offline fallback
│   ├── App.jsx                    # Route registry & protected routes
│   ├── fleetStore.jsx             # React Context global state store
│   └── main.jsx                   # Vite entry point
├── package.json
└── vite.config.js
```

---

## Getting Started (Local Development)

### Prerequisites
- [Node.js](https://nodejs.org/) v18.0.0 or higher
- [npm](https://www.npmjs.com/) v9.0.0 or higher
- [MongoDB](https://www.mongodb.com/) (Local Community Server or a free MongoDB Atlas URI)

### 1. Clone the Repository
```bash
git clone https://github.com/Aastha5386/FleetFlow.git
cd FleetFlow
```

### 2. Install Dependencies
Install dependencies for both the root (frontend) and server (backend):
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
npm run install:server
```

### 3. Configure Server Environment
Create a `.env` file in the `server` directory:
```bash
cp server/.env.example server/.env
```
Update the settings in `server/.env`:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/fleetflow
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=development
```

### 4. Seed the Database
Populate your database with the initial demo accounts, vehicles, drivers, trips, maintenance tickets, and fuel logs:
```bash
npm run seed
```

### 5. Start the Application
Run the backend and frontend concurrently:

**Terminal 1 — Backend API:**
```bash
npm run server:dev
```
*API runs at `http://localhost:5000`*

**Terminal 2 — Frontend Client:**
```bash
npm run dev
```
*Client runs at `http://localhost:5173`*

---

## Environment Configuration

| Variable | Scope | Description | Default / Example |
| :--- | :--- | :--- | :--- |
| `PORT` | Backend | Port number for Express server | `5000` |
| `MONGO_URI` | Backend | MongoDB connection string | `mongodb://127.0.0.1:27017/fleetflow` |
| `JWT_SECRET` | Backend | Cryptographic secret for signing tokens | `secure_random_string` |
| `NODE_ENV` | Backend | Execution environment | `development` or `production` |
| `VITE_API_URL` | Frontend | Target backend API base URL | `http://localhost:5000` (or leave empty if reverse-proxied) |

---

## REST API Documentation

All protected endpoints require an `Authorization` header formatted as `Bearer <token>`.

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Register a new account (pending Manager approval if configured).
- `POST /api/auth/login` — Sign in with username/email and password; returns JWT token and user profile.
- `POST /api/auth/google` — Sign in with Google authentication payload.
- `POST /api/auth/reset-password` — Password reset endpoint.

### Vehicles (`/api/vehicles`)
- `GET /api/vehicles` — Retrieve all vehicles with status and odometer metrics.
- `POST /api/vehicles` — Add a new vehicle to the registry.
- `PUT /api/vehicles/:id` — Update vehicle details or status (`Available`, `On Trip`, `In Shop`).
- `DELETE /api/vehicles/:id` — Remove vehicle from the registry.

### Drivers (`/api/drivers`)
- `GET /api/drivers` — Retrieve all drivers and safety metrics.
- `POST /api/drivers` — Add a new driver record.
- `PUT /api/drivers/:id` — Update driver record or safety index.
- `DELETE /api/drivers/:id` — Remove driver record.

### Trips & Dispatch (`/api/trips`)
- `GET /api/trips` — Fetch all trips and active manifests.
- `POST /api/trips` — Create and dispatch a new trip (validates cargo capacity).
- `PUT /api/trips/:id` — Update trip status (`Draft`, `Dispatched`, `Completed`, `Cancelled`).

### Maintenance (`/api/maintenance`)
- `GET /api/maintenance` — Retrieve maintenance history and open shop orders.
- `POST /api/maintenance` — Create a new service ticket (sets vehicle to `In Shop`).

### Fuel Logs (`/api/fuel`)
- `GET /api/fuel` — Retrieve fuel logs and expenditure records.
- `POST /api/fuel` — Submit a fuel purchase entry.

---

## Deployment & Production Build

### Building the Production Bundle
To compile the production-ready React client:
```bash
npm run build
```
The compiled static assets will be output to the `dist/` directory.

### Running in Production
In production, Express serves the compiled Vite frontend directly from `dist/`:
```bash
npm run build
npm start
```

### Deploying to Render
1. Push your repository to GitHub.
2. In the [Render Dashboard](https://dashboard.render.com/), create a new **Web Service**.
3. Connect your repository.
4. Set the following build and start commands:
   - **Build Command:** `npm install && npm run build:all`
   - **Start Command:** `npm start`
5. Add your environment variables:
   - `MONGO_URI`: *Your MongoDB Atlas connection URI*
   - `JWT_SECRET`: *A secure random string*
   - `NODE_ENV`: `production`

---

## Authors & Acknowledgments

Developed by **Aastha** for modern, data-driven logistics and intelligent fleet management operations. All rights reserved.
