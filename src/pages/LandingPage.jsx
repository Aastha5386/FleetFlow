import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFleet } from "../fleetStore.jsx";
import "../styles/landing.css";

export default function LandingPage() {
  const { session, logout } = useFleet();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeRouteTab, setActiveRouteTab] = useState("fuel");
  const [activeDashboardTab, setActiveDashboardTab] = useState("overview");

  const homeByRole = {
    Manager: "/dashboard",
    Driver: "/driver/dashboard",
    Dispatcher: "/dispatcher/dashboard",
    "Safety Officer": "/safety/dashboard",
    "Financial Analyst": "/financial/dashboard",
  };
  const dashboardLink = session ? homeByRole[session.role] || "/dashboard" : "/dashboard";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="landing-shell">
      {/* ── 1. Sticky Professional Navbar ── */}
      <header className="landing-nav-header">
        <div className="landing-nav-container">
          <Link to="/" className="landing-brand-logo-wrap">
            <div className="brand-symbol">
              <span className="symbol-bar symbol-bar-1" />
              <span className="symbol-bar symbol-bar-2" />
              <span className="symbol-bar symbol-bar-3" />
            </div>
            <span className="brand-title">FleetFlow</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="landing-nav-links">
            <button type="button" onClick={() => scrollToSection("hero")} className="nav-item-btn">
              Home
            </button>
            <button type="button" onClick={() => scrollToSection("features")} className="nav-item-btn">
              Features
            </button>
            <button type="button" onClick={() => scrollToSection("intelligence")} className="nav-item-btn">
              Intelligence
            </button>
            <button type="button" onClick={() => scrollToSection("how-it-works")} className="nav-item-btn">
              How It Works
            </button>
            <button type="button" onClick={() => scrollToSection("about")} className="nav-item-btn">
              About
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="landing-nav-auth-desktop">
            {session ? (
              <>
                <Link to={dashboardLink} className="btn-nav-primary">
                  Dashboard
                </Link>
                <button type="button" onClick={handleLogout} className="btn-nav-secondary">
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-nav-ghost">
                  Sign In
                </Link>
                <Link to="/register" className="btn-nav-primary">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            className="mobile-hamburger-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {mobileMenuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="mobile-nav-drawer">
            <div className="mobile-nav-links-list">
              <button type="button" onClick={() => scrollToSection("hero")} className="mobile-nav-link">
                Home
              </button>
              <button type="button" onClick={() => scrollToSection("features")} className="mobile-nav-link">
                Features
              </button>
              <button type="button" onClick={() => scrollToSection("intelligence")} className="mobile-nav-link">
                Intelligence
              </button>
              <button type="button" onClick={() => scrollToSection("how-it-works")} className="mobile-nav-link">
                How It Works
              </button>
              <button type="button" onClick={() => scrollToSection("about")} className="mobile-nav-link">
                About
              </button>
            </div>
            <div className="mobile-nav-auth-row">
              {session ? (
                <>
                  <Link to={dashboardLink} onClick={() => setMobileMenuOpen(false)} className="btn-nav-primary mobile-btn">
                    Dashboard
                  </Link>
                  <button type="button" onClick={handleLogout} className="btn-nav-secondary mobile-btn">
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="btn-nav-ghost mobile-btn">
                    Sign In
                  </Link>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="btn-nav-primary mobile-btn">
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* ── 2. Hero Section ── */}
      <section className="landing-hero-section" id="hero">
        <div className="hero-content-wrapper">
          <div className="hero-badge-tag">
            <span className="hero-badge-bullet" />
            <span>SMART FLEET MANAGEMENT PLATFORM</span>
          </div>

          <h1 className="hero-headline">
            Move Smarter.<br />Manage Every Mile.
          </h1>

          <p className="hero-description">
            FleetFlow brings vehicles, drivers, trips, fuel, maintenance and operational intelligence together in one powerful platform.
          </p>

          <div className="hero-cta-group">
            <Link to={session ? dashboardLink : "/register"} className="hero-cta-primary">
              {session ? "Go to Dashboard" : "Get Started"}
            </Link>
            <Link to="/intelligence" className="hero-cta-secondary">
              Explore Intelligence
            </Link>
          </div>

          <div className="hero-trust-indicator">
            <span>Real-Time Tracking</span>
            <span className="trust-dot">•</span>
            <span>Route Optimization</span>
            <span className="trust-dot">•</span>
            <span>Fuel Intelligence</span>
          </div>
        </div>

        {/* ── 3. Hero Visual (Realistic Operations Command Center) ── */}
        <div className="hero-visual-container">
          <div className="command-center-frame">
            {/* Top Browser Header */}
            <div className="command-center-topbar">
              <div className="mac-dots">
                <span className="dot dot-red" />
                <span className="dot dot-amber" />
                <span className="dot dot-green" />
              </div>
              <div className="command-url-badge">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <span>fleetflow.io/command-center</span>
              </div>
              <div className="telemetry-live-pill">
                <span className="live-telemetry-dot" />
                <span>LIVE TELEMETRY STREAM</span>
              </div>
            </div>

            {/* Metric KPI Banner */}
            <div className="command-kpi-strip">
              <div className="kpi-mini-card">
                <span className="kpi-label">Active Vehicles</span>
                <span className="kpi-value">24 Active</span>
                <span className="kpi-sub">87% Capacity Deployed</span>
              </div>
              <div className="kpi-mini-card">
                <span className="kpi-label">Dispatched Trips</span>
                <span className="kpi-value">18 On Route</span>
                <span className="kpi-sub">94.2% On-Time Index</span>
              </div>
              <div className="kpi-mini-card">
                <span className="kpi-label">Fleet Fuel Economy</span>
                <span className="kpi-value">8.6 km/L</span>
                <span className="kpi-sub">+12% vs Highway Avg</span>
              </div>
              <div className="kpi-mini-card">
                <span className="kpi-label">Maintenance Health</span>
                <span className="kpi-value">Optimal</span>
                <span className="kpi-sub">3 Preventive Services Due</span>
              </div>
            </div>

            {/* Central Operations Workspace */}
            <div className="command-workspace-grid">
              {/* Map & Corridor Canvas */}
              <div className="command-map-canvas">
                <div className="canvas-header-row">
                  <div>
                    <h3 className="canvas-title">Interstate Freight Corridors</h3>
                    <p className="canvas-subtitle">NH 48 (Delhi → Jaipur) & Expressway (Mumbai → Pune)</p>
                  </div>
                  <span className="status-live-chip">Live GPS Feed</span>
                </div>

                {/* Highway Corridor Schematic */}
                <div className="schematic-corridor-box">
                  <div className="corridor-path-line" />

                  {/* Waypoint 1: Delhi */}
                  <div className="waypoint-marker wp-delhi">
                    <div className="marker-pin pin-active" />
                    <span className="wp-name">Delhi Central Yard</span>
                    <span className="wp-coord">Origin Hub</span>
                  </div>

                  {/* Moving Vehicle 1 on Corridor */}
                  <div className="vehicle-carrier carrier-1">
                    <div className="carrier-badge">
                      <span className="carrier-pulse" />
                      <span className="carrier-plate">DL-01-AB-1001</span>
                    </div>
                    <div className="carrier-meta">Tata Ace Gold · 64 km/h</div>
                  </div>

                  {/* Waypoint 2: Midpoint */}
                  <div className="waypoint-marker wp-mid">
                    <div className="marker-pin pin-waypoint" />
                    <span className="wp-name">Behror Toll Plaza</span>
                    <span className="wp-coord">KM 142 · Clear</span>
                  </div>

                  {/* Moving Vehicle 2 on Corridor */}
                  <div className="vehicle-carrier carrier-2">
                    <div className="carrier-badge">
                      <span className="carrier-pulse pulse-green" />
                      <span className="carrier-plate">DL-01-AB-1002</span>
                    </div>
                    <div className="carrier-meta">Eicher Pro 2049 · 58 km/h</div>
                  </div>

                  {/* Waypoint 3: Jaipur */}
                  <div className="waypoint-marker wp-jaipur">
                    <div className="marker-pin pin-dest" />
                    <span className="wp-name">Jaipur Terminal</span>
                    <span className="wp-coord">Destination</span>
                  </div>
                </div>

                {/* Corridor Status Bar */}
                <div className="corridor-status-strip">
                  <div className="corridor-stat">
                    <span className="c-label">Corridor Distance:</span>
                    <span className="c-val">268 km</span>
                  </div>
                  <div className="corridor-stat">
                    <span className="c-label">Average Transit Time:</span>
                    <span className="c-val">4.9 Hours</span>
                  </div>
                  <div className="corridor-stat">
                    <span className="c-label">Road Weather Risk:</span>
                    <span className="c-val c-safe">Low · Clear Sky</span>
                  </div>
                  <div className="corridor-stat">
                    <span className="c-label">Fuel Saver Strategy:</span>
                    <span className="c-val c-highlight">Active (-18.2 L)</span>
                  </div>
                </div>
              </div>

              {/* Real-Time Telemetry Side Panel */}
              <div className="command-side-telemetry">
                <div className="side-panel-header">
                  <h4>Active Vehicle Registry</h4>
                  <span>4 Live Units</span>
                </div>

                <div className="telemetry-items-list">
                  <div className="telemetry-item-card active-card">
                    <div className="item-row-top">
                      <span className="item-plate">DL-01-AB-1001</span>
                      <span className="item-badge badge-blue">On Trip</span>
                    </div>
                    <div className="item-model">Tata Ace Gold · 750 kg Capacity</div>
                    <div className="item-route-info">
                      <span>Delhi Central</span> → <span>Jaipur Terminal</span>
                    </div>
                    <div className="item-footer-stats">
                      <span>Driver: Ravi Kumar</span>
                      <span>Speed: 64 km/h</span>
                    </div>
                  </div>

                  <div className="telemetry-item-card">
                    <div className="item-row-top">
                      <span className="item-plate">DL-01-AB-1002</span>
                      <span className="item-badge badge-blue">On Trip</span>
                    </div>
                    <div className="item-model">Eicher Pro 2049 · 4,800 kg Capacity</div>
                    <div className="item-route-info">
                      <span>Mumbai JNPT</span> → <span>Pune Logistics</span>
                    </div>
                    <div className="item-footer-stats">
                      <span>Driver: Suresh Singh</span>
                      <span>Speed: 58 km/h</span>
                    </div>
                  </div>

                  <div className="telemetry-item-card">
                    <div className="item-row-top">
                      <span className="item-plate">DL-01-AB-1003</span>
                      <span className="item-badge badge-green">Available</span>
                    </div>
                    <div className="item-model">Mahindra Bolero · 1,000 kg Capacity</div>
                    <div className="item-route-info">
                      <span>Standby</span> · Gurgaon Hub
                    </div>
                    <div className="item-footer-stats">
                      <span>Driver: Amit Verma</span>
                      <span>Odo: 61,000 km</span>
                    </div>
                  </div>

                  <div className="telemetry-item-card">
                    <div className="item-row-top">
                      <span className="item-plate">DL-01-AB-1004</span>
                      <span className="item-badge badge-indigo">In Shop</span>
                    </div>
                    <div className="item-model">Ashok Leyland Dost · 1,500 kg</div>
                    <div className="item-route-info">
                      <span>Scheduled Brake Pad Service</span>
                    </div>
                    <div className="item-footer-stats">
                      <span>Workshop Yard</span>
                      <span>Est: 4 Hours</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. Problem Section ── */}
      <section className="landing-problem-section" id="about">
        <div className="section-container">
          <div className="section-header-centered">
            <span className="section-kicker">Industry Realities</span>
            <h2 className="section-main-heading">Fleet Operations Get Complicated Fast.</h2>
            <p className="section-lead-text">
              Traditional commercial fleets struggle with fragmented spreadsheets, disconnected dispatchers, and blind spots that inflate operational costs every month.
            </p>
          </div>

          <div className="problem-cards-grid">
            <div className="problem-card">
              <div className="problem-icon-wrap">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="9" y1="15" x2="15" y2="15" />
                </svg>
              </div>
              <h3>Too Much Manual Tracking</h3>
              <p>Managing vehicles, drivers and trips across separate systems wastes time.</p>
              <div className="problem-detail">
                Disjointed spreadsheets lead to missed maintenance cycles, unverified licenses, and delayed shipment confirmations.
              </div>
            </div>

            <div className="problem-card">
              <div className="problem-icon-wrap">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 2v6h6" />
                  <path d="M21 12A9 9 0 0 0 6 5.3L3 8" />
                  <path d="M21 22v-6h-6" />
                  <path d="M3 12a9 9 0 0 0 15 6.7l3-2.7" />
                </svg>
              </div>
              <h3>Rising Fuel Costs</h3>
              <p>Without visibility into fuel efficiency, unnecessary costs are difficult to identify.</p>
              <div className="problem-detail">
                Excessive idle times, inefficient engine speeds, and unmonitored consumption erode delivery margins rapidly.
              </div>
            </div>

            <div className="problem-card">
              <div className="problem-icon-wrap">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="6" cy="19" r="3" />
                  <path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15" />
                  <circle cx="18" cy="5" r="3" />
                </svg>
              </div>
              <h3>Poor Route Visibility</h3>
              <p>Unoptimized routes can increase travel time, fuel consumption and operational costs.</p>
              <div className="problem-detail">
                Drivers encounter preventable bottlenecks and toll delays without multi-corridor route prioritization.
              </div>
            </div>
          </div>

          {/* Bridge Solution Banner */}
          <div className="solution-bridge-banner">
            <div className="solution-bridge-content">
              <div className="solution-bridge-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </div>
              <div>
                <h4 className="solution-bridge-title">One platform to monitor, optimize and manage your fleet.</h4>
                <p className="solution-bridge-sub">
                  FleetFlow bridges telemetry, compliance, fuel intelligence, and maintenance into one cohesive operational cockpit.
                </p>
              </div>
            </div>
            <Link to={session ? dashboardLink : "/register"} className="solution-bridge-btn">
              Get Started Now →
            </Link>
          </div>
        </div>
      </section>

      {/* ── 5. Core Features Grid ── */}
      <section className="landing-features-section" id="features">
        <div className="section-container">
          <div className="section-header-centered">
            <span className="section-kicker">Core Capabilities</span>
            <h2 className="section-main-heading">Engineered for Complete Fleet Oversight</h2>
            <p className="section-lead-text">
              Every tool your dispatchers, safety coordinators, and operations managers need to maintain continuous velocity.
            </p>
          </div>

          <div className="core-features-grid">
            {/* Feature 1 */}
            <div className="feature-card">
              <div className="feature-card-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
                </svg>
              </div>
              <h3 className="feature-title">Live Fleet Tracking</h3>
              <p className="feature-desc">Monitor vehicle locations and trip status in real time across interstate freight corridors.</p>
            </div>

            {/* Feature 2 */}
            <div className="feature-card">
              <div className="feature-card-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="6" cy="19" r="3" />
                  <path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15" />
                  <circle cx="18" cy="5" r="3" />
                </svg>
              </div>
              <h3 className="feature-title">Route Optimization</h3>
              <p className="feature-desc">Choose optimized routes based on different operational priorities: Shortest, Balanced, or Fuel Saver.</p>
            </div>

            {/* Feature 3 */}
            <div className="feature-card">
              <div className="feature-card-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="20" x2="18" y2="10" />
                  <line x1="12" y1="20" x2="12" y2="4" />
                  <line x1="6" y1="20" x2="6" y2="14" />
                </svg>
              </div>
              <h3 className="feature-title">Fuel Intelligence</h3>
              <p className="feature-desc">Analyze fuel consumption, track km/L efficiency curves, and identify fuel-saving vehicle leaders.</p>
            </div>

            {/* Feature 4 */}
            <div className="feature-card">
              <div className="feature-card-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <h3 className="feature-title">Driver Management</h3>
              <p className="feature-desc">Manage driver assignments, commercial licensing expiration dates, and safety scoring profiles.</p>
            </div>

            {/* Feature 5 */}
            <div className="feature-card">
              <div className="feature-card-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
                  <path d="M15 18H9" />
                  <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62l-3.24-4.05A2 2 0 0 0 17.1 8H14v10" />
                  <circle cx="7" cy="18.5" r="2.5" />
                  <circle cx="17" cy="18.5" r="2.5" />
                </svg>
              </div>
              <h3 className="feature-title">Vehicle Management</h3>
              <p className="feature-desc">Track vehicle specifications, cargo capacities, odometer history, and real-time operational availability.</p>
            </div>

            {/* Feature 6 */}
            <div className="feature-card">
              <div className="feature-card-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                </svg>
              </div>
              <h3 className="feature-title">Maintenance Tracking</h3>
              <p className="feature-desc">Monitor preventive service logs, repair work orders, and upcoming workshop maintenance deadlines.</p>
            </div>

            {/* Feature 7 */}
            <div className="feature-card">
              <div className="feature-card-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
              </div>
              <h3 className="feature-title">Trip Management</h3>
              <p className="feature-desc">Create and monitor dispatch orders, assigned vehicles, cargo weights, and trip progress statuses.</p>
            </div>

            {/* Feature 8 */}
            <div className="feature-card">
              <div className="feature-card-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
              </div>
              <h3 className="feature-title">Intelligence Hub</h3>
              <p className="feature-desc">Bring fleet data together into a centralized operational intelligence view with AI-assisted decision making.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. Intelligence Hub Section ── */}
      <section className="landing-intelligence-section" id="intelligence">
        <div className="section-container">
          <div className="section-header-centered">
            <span className="section-kicker">Unified Operations Engine</span>
            <h2 className="section-main-heading">Your Fleet. One Intelligent Command Center.</h2>
            <p className="section-lead-text">
              FleetFlow continuously correlates vehicle telemetry, maintenance urgencies, licensing compliance, and fuel consumption to deliver real-time operational clarity.
            </p>
          </div>

          <div className="intelligence-command-center-box">
            <div className="intel-box-topbar">
              <div className="intel-status-left">
                <span className="intel-pulse-indicator" />
                <span>INTELLIGENCE RADAR · ACTIVE DATA STREAM</span>
              </div>
              <Link to="/intelligence" className="btn-intel-explore">
                Open Full Hub →
              </Link>
            </div>

            <div className="intel-cards-grid">
              {/* Card 1 */}
              <div className="intel-metric-card">
                <div className="intel-badge-label">LIVE FLEET</div>
                <div className="intel-stat-num">24 Active Vehicles</div>
                <div className="intel-stat-bar">
                  <div className="bar-fill fill-blue" style={{ width: "75%" }} />
                </div>
                <p className="intel-card-desc">16 On Trip · 5 Available · 3 In Shop</p>
              </div>

              {/* Card 2 */}
              <div className="intel-metric-card">
                <div className="intel-badge-label">ROUTE OPTIMIZATION</div>
                <div className="intel-stat-num">Fuel Saver Recommended</div>
                <div className="intel-stat-bar">
                  <div className="bar-fill fill-green" style={{ width: "88%" }} />
                </div>
                <p className="intel-card-desc">18.5 L Estimated Diesel Savings on NH 48</p>
              </div>

              {/* Card 3 */}
              <div className="intel-metric-card">
                <div className="intel-badge-label">FUEL EFFICIENCY</div>
                <div className="intel-stat-num">↑ 12% Efficiency</div>
                <div className="intel-stat-bar">
                  <div className="bar-fill fill-green" style={{ width: "65%" }} />
                </div>
                <p className="intel-card-desc">8.6 km/L Fleet Average Across Long-Haul</p>
              </div>

              {/* Card 4 */}
              <div className="intel-metric-card">
                <div className="intel-badge-label">TRIP STATUS</div>
                <div className="intel-stat-num">18 On Route</div>
                <div className="intel-stat-bar">
                  <div className="bar-fill fill-blue" style={{ width: "94%" }} />
                </div>
                <p className="intel-card-desc">94.2% On-Time Delivery Index</p>
              </div>

              {/* Card 5 */}
              <div className="intel-metric-card">
                <div className="intel-badge-label">MAINTENANCE</div>
                <div className="intel-stat-num">3 Services Due</div>
                <div className="intel-stat-bar">
                  <div className="bar-fill fill-indigo" style={{ width: "40%" }} />
                </div>
                <p className="intel-card-desc">Preventive Brake & Oil Inspections Logged</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. Route Optimization Section ── */}
      <section className="landing-route-section" id="routes">
        <div className="section-container">
          <div className="section-header-centered">
            <span className="section-kicker">Multi-Corridor Engine</span>
            <h2 className="section-main-heading">Choose the Route That Fits Your Goal.</h2>
            <p className="section-lead-text">
              Multi-corridor logistics routing engineered to match your operational schedule, cargo priority, and fuel budget.
            </p>
          </div>

          {/* Interactive Strategy Selector */}
          <div className="route-strategies-grid">
            {/* Strategy 1: Shortest */}
            <div
              className={`strategy-card ${activeRouteTab === "shortest" ? "strategy-active" : ""}`}
              onClick={() => setActiveRouteTab("shortest")}
            >
              <div className="strategy-header">
                <span className="strategy-badge">Minimum Distance</span>
                <h3>Shortest</h3>
              </div>
              <p className="strategy-desc">
                Optimize for minimum distance. Best for rapid rush shipments with strict delivery SLA deadlines.
              </p>
              <div className="strategy-metrics">
                <div className="s-metric">
                  <span className="s-val">246 km</span>
                  <span className="s-lbl">Distance</span>
                </div>
                <div className="s-metric">
                  <span className="s-val">4.8 hrs</span>
                  <span className="s-lbl">Est. Time</span>
                </div>
                <div className="s-metric">
                  <span className="s-val">22.4 L</span>
                  <span className="s-lbl">Fuel Consumption</span>
                </div>
              </div>
            </div>

            {/* Strategy 2: Balanced */}
            <div
              className={`strategy-card ${activeRouteTab === "balanced" ? "strategy-active" : ""}`}
              onClick={() => setActiveRouteTab("balanced")}
            >
              <div className="strategy-header">
                <span className="strategy-badge">Optimal Balance</span>
                <h3>Balanced</h3>
              </div>
              <p className="strategy-desc">
                Balance distance, time and operational efficiency for standard daily long-haul commercial freight.
              </p>
              <div className="strategy-metrics">
                <div className="s-metric">
                  <span className="s-val">268 km</span>
                  <span className="s-lbl">Distance</span>
                </div>
                <div className="s-metric">
                  <span className="s-val">4.9 hrs</span>
                  <span className="s-lbl">Est. Time</span>
                </div>
                <div className="s-metric">
                  <span className="s-val">21.0 L</span>
                  <span className="s-lbl">Fuel Consumption</span>
                </div>
              </div>
            </div>

            {/* Strategy 3: Fuel Saver */}
            <div
              className={`strategy-card ${activeRouteTab === "fuel" ? "strategy-active" : ""}`}
              onClick={() => setActiveRouteTab("fuel")}
            >
              <div className="strategy-header">
                <span className="strategy-badge badge-recom">Recommended</span>
                <h3>Fuel Saver</h3>
              </div>
              <p className="strategy-desc">
                Prioritize fuel-efficient routing. Sustained cruising speeds on bypass highways to minimize consumption.
              </p>
              <div className="strategy-metrics">
                <div className="s-metric">
                  <span className="s-val">282 km</span>
                  <span className="s-lbl">Distance</span>
                </div>
                <div className="s-metric">
                  <span className="s-val">5.1 hrs</span>
                  <span className="s-lbl">Est. Time</span>
                </div>
                <div className="s-metric">
                  <span className="s-val highlight-green">18.2 L</span>
                  <span className="s-lbl">15% Fuel Saved</span>
                </div>
              </div>
            </div>
          </div>

          {/* Simple Route Visualization: Origin → Stops → Destination */}
          <div className="route-schematic-display">
            <div className="route-flow-step origin-step">
              <span className="step-indicator" />
              <div>
                <span className="step-tag">Origin</span>
                <span className="step-name">New Delhi Central Yard</span>
              </div>
            </div>

            <div className="route-connector-line">
              <div className="flow-dash-anim" />
            </div>

            <div className="route-flow-step waypoint-step">
              <span className="step-indicator wp-indicator" />
              <div>
                <span className="step-tag">Highway Corridor Stops</span>
                <span className="step-name">Gurugram • Manesar • Behror</span>
              </div>
            </div>

            <div className="route-connector-line">
              <div className="flow-dash-anim" />
            </div>

            <div className="route-flow-step dest-step">
              <span className="step-indicator dest-indicator" />
              <div>
                <span className="step-tag">Destination</span>
                <span className="step-name">Jaipur Freight Hub</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 8. Fleet Analytics Section ── */}
      <section className="landing-analytics-section" id="analytics">
        <div className="section-container">
          <div className="section-header-centered">
            <span className="section-kicker">Data-Driven Management</span>
            <h2 className="section-main-heading">Turn Fleet Data Into Better Decisions.</h2>
            <p className="section-lead-text">
              Transform raw odometer readings, fuel slips, and workshop invoices into clear actionable operational indicators.
            </p>
          </div>

          <div className="analytics-cards-grid">
            {/* Card 1: Fuel Consumption */}
            <div className="analytics-card">
              <div className="analytics-card-header">
                <div>
                  <h4>Fuel Consumption</h4>
                  <p>Efficiency by Vehicle Model (km/L)</p>
                </div>
                <span className="analytics-pill">Diesel</span>
              </div>
              <div className="analytics-chart-mockup">
                <div className="bar-metric-row">
                  <span className="bar-label">Tata Ace Gold</span>
                  <div className="bar-track"><div className="bar-value-fill" style={{ width: "85%" }} /></div>
                  <span className="bar-num">14.7 km/L</span>
                </div>
                <div className="bar-metric-row">
                  <span className="bar-label">Mahindra Bolero</span>
                  <div className="bar-track"><div className="bar-value-fill" style={{ width: "68%" }} /></div>
                  <span className="bar-num">11.8 km/L</span>
                </div>
                <div className="bar-metric-row">
                  <span className="bar-label">Eicher Pro 2049</span>
                  <div className="bar-track"><div className="bar-value-fill" style={{ width: "45%" }} /></div>
                  <span className="bar-num">7.8 km/L</span>
                </div>
                <div className="bar-metric-row">
                  <span className="bar-label">Tata 407</span>
                  <div className="bar-track"><div className="bar-value-fill" style={{ width: "52%" }} /></div>
                  <span className="bar-num">9.0 km/L</span>
                </div>
              </div>
            </div>

            {/* Card 2: Vehicle Utilization */}
            <div className="analytics-card">
              <div className="analytics-card-header">
                <div>
                  <h4>Vehicle Utilization</h4>
                  <p>Capacity Deployment Index</p>
                </div>
                <span className="analytics-pill">87% Active</span>
              </div>
              <div className="analytics-chart-mockup">
                <div className="utilization-donut-row">
                  <div className="donut-stat-center">
                    <span className="donut-num">87%</span>
                    <span className="donut-lbl">Fleet Deployed</span>
                  </div>
                  <div className="donut-legend-list">
                    <div className="legend-item"><span className="legend-dot dot-blue" /><span>On Trip (68%)</span></div>
                    <div className="legend-item"><span className="legend-dot dot-green" /><span>Available (19%)</span></div>
                    <div className="legend-item"><span className="legend-dot dot-indigo" /><span>In Shop (13%)</span></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3: Trip Performance */}
            <div className="analytics-card">
              <div className="analytics-card-header">
                <div>
                  <h4>Trip Performance</h4>
                  <p>On-Time Arrival Trends</p>
                </div>
                <span className="analytics-pill">94.2% SLA</span>
              </div>
              <div className="analytics-chart-mockup">
                <div className="trend-curve-container">
                  <svg viewBox="0 0 300 80" className="trend-svg">
                    <path d="M 0 65 Q 50 40 100 48 T 200 25 T 300 15" fill="none" stroke="#2563EB" strokeWidth="3" />
                    <circle cx="100" cy="48" r="4" fill="#2563EB" />
                    <circle cx="200" cy="25" r="4" fill="#2563EB" />
                    <circle cx="300" cy="15" r="5" fill="#10B981" />
                  </svg>
                  <div className="trend-axis-labels">
                    <span>Week 1</span>
                    <span>Week 2</span>
                    <span>Week 3</span>
                    <span>Week 4 (Current)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 4: Maintenance Costs */}
            <div className="analytics-card">
              <div className="analytics-card-header">
                <div>
                  <h4>Maintenance Costs</h4>
                  <p>Preventive vs Repair Spend</p>
                </div>
                <span className="analytics-pill">₹43,900 Total</span>
              </div>
              <div className="analytics-chart-mockup">
                <div className="split-spend-bar">
                  <div className="split-portion portion-preventive" style={{ width: "72%" }}>
                    <span>72% Preventive</span>
                  </div>
                  <div className="split-portion portion-repair" style={{ width: "28%" }}>
                    <span>28% Repair</span>
                  </div>
                </div>
                <p className="split-caption">High preventive maintenance ratio reduces road breakdown downtime by 40%.</p>
              </div>
            </div>

            {/* Card 5: Fleet Activity */}
            <div className="analytics-card">
              <div className="analytics-card-header">
                <div>
                  <h4>Fleet Activity</h4>
                  <p>Daily Distance Logged (KM)</p>
                </div>
                <span className="analytics-pill">Telemetry</span>
              </div>
              <div className="analytics-chart-mockup">
                <div className="spark-bars-row">
                  <div className="spark-col"><div className="spark-bar" style={{ height: "45%" }} /><span>Mon</span></div>
                  <div className="spark-col"><div className="spark-bar" style={{ height: "65%" }} /><span>Tue</span></div>
                  <div className="spark-col"><div className="spark-bar" style={{ height: "82%" }} /><span>Wed</span></div>
                  <div className="spark-col"><div className="spark-bar" style={{ height: "74%" }} /><span>Thu</span></div>
                  <div className="spark-col"><div className="spark-bar" style={{ height: "92%" }} /><span>Fri</span></div>
                  <div className="spark-col"><div className="spark-bar" style={{ height: "88%" }} /><span>Sat</span></div>
                  <div className="spark-col"><div className="spark-bar" style={{ height: "50%" }} /><span>Sun</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 9. How It Works (4-Step Timeline) ── */}
      <section className="landing-timeline-section" id="how-it-works">
        <div className="section-container">
          <div className="section-header-centered">
            <span className="section-kicker">Deployment Flow</span>
            <h2 className="section-main-heading">How FleetFlow Works</h2>
            <p className="section-lead-text">
              A simple, four-step journey from onboarding your vehicles to continuous operational intelligence.
            </p>
          </div>

          <div className="process-timeline-grid">
            {/* Step 1 */}
            <div className="timeline-step-card">
              <div className="step-num-pill">01</div>
              <h3>Connect Your Fleet</h3>
              <p>Add vehicles, drivers and operational information.</p>
              <div className="step-note">
                Input vehicle models, registration plates, maximum payload limits, driver license details, and workshop contacts.
              </div>
            </div>

            {/* Step 2 */}
            <div className="timeline-step-card">
              <div className="step-num-pill">02</div>
              <h3>Plan</h3>
              <p>Create trips and optimize routes.</p>
              <div className="step-note">
                Pair verified drivers with available vehicles, assign destination hubs, and choose between Shortest, Balanced, or Fuel Saver routes.
              </div>
            </div>

            {/* Step 3 */}
            <div className="timeline-step-card">
              <div className="step-num-pill">03</div>
              <h3>Monitor</h3>
              <p>Track fleet activity and operational status.</p>
              <div className="step-note">
                Follow real-time GPS telemetry, monitor trip progress, verify road conditions, and receive automated compliance alerts.
              </div>
            </div>

            {/* Step 4 */}
            <div className="timeline-step-card">
              <div className="step-num-pill">04</div>
              <h3>Optimize</h3>
              <p>Use intelligence and analytics to improve fleet performance.</p>
              <div className="step-note">
                Leverage the Intelligence Hub to lower fuel waste, reduce unplanned shop downtime, and reward top safety scoring drivers.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 10. Role-Based Access ── */}
      <section className="landing-roles-section">
        <div className="section-container">
          <div className="section-header-centered">
            <span className="section-kicker">Multi-Stakeholder Architecture</span>
            <h2 className="section-main-heading">Dedicated Portals for Every Fleet Role</h2>
            <p className="section-lead-text">
              FleetFlow provides role-tailored workspaces so every team member has the exact operational tools they require.
            </p>
          </div>

          <div className="roles-cards-grid">
            {/* Role 1: Manager */}
            <div className="role-showcase-card">
              <div className="role-icon-box">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="9" rx="1.5" />
                  <rect x="14" y="3" width="7" height="5" rx="1.5" />
                  <rect x="14" y="12" width="7" height="9" rx="1.5" />
                  <rect x="3" y="16" width="7" height="5" rx="1.5" />
                </svg>
              </div>
              <h3>Manager</h3>
              <p>Monitor overall fleet operations and performance.</p>
              <ul className="role-bullet-list">
                <li>Complete operational KPIs & fleet status</li>
                <li>Approve or reject new team role requests</li>
                <li>Comprehensive registry of vehicles & drivers</li>
              </ul>
            </div>

            {/* Role 2: Dispatcher */}
            <div className="role-showcase-card">
              <div className="role-icon-box">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
                  <path d="M15 18H9" />
                  <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62l-3.24-4.05A2 2 0 0 0 17.1 8H14v10" />
                  <circle cx="7" cy="18.5" r="2.5" />
                  <circle cx="17" cy="18.5" r="2.5" />
                </svg>
              </div>
              <h3>Dispatcher</h3>
              <p>Manage trips, assignments and fleet movement.</p>
              <ul className="role-bullet-list">
                <li>Fast trip dispatch & cargo manifest logging</li>
                <li>Live vehicle capacity & availability verification</li>
                <li>Corridor assignment & ETA monitoring</li>
              </ul>
            </div>

            {/* Role 3: Safety Officer */}
            <div className="role-showcase-card">
              <div className="role-icon-box">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <h3>Safety Officer</h3>
              <p>Monitor safety-related information and operational risks.</p>
              <ul className="role-bullet-list">
                <li>Driver safety scoring (0-100 scale)</li>
                <li>Automated commercial license expiration alerts</li>
                <li>Vehicle roadworthiness & incident audits</li>
              </ul>
            </div>

            {/* Role 4: Financial Analyst */}
            <div className="role-showcase-card">
              <div className="role-icon-box">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="1" x2="12" y2="23" />
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
              <h3>Financial Analyst</h3>
              <p>Analyze fuel, maintenance and fleet-related costs.</p>
              <ul className="role-bullet-list">
                <li>Total operational expenditure breakdowns</li>
                <li>Cost per kilometer calculations</li>
                <li>Fuel expense audits & workshop invoice logs</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── 11. Dashboard Preview Component ── */}
      <section className="landing-preview-section">
        <div className="section-container">
          <div className="section-header-centered">
            <span className="section-kicker">Unified Interface</span>
            <h2 className="section-main-heading">Everything Your Fleet Team Needs.</h2>
            <p className="section-lead-text">
              Explore purpose-built modules that eliminate tool-switching and keep entire logistics organizations synchronized.
            </p>
          </div>

          {/* Interactive Module Tabs */}
          <div className="preview-nav-tabs">
            <button
              type="button"
              className={`preview-tab-btn ${activeDashboardTab === "overview" ? "tab-active" : ""}`}
              onClick={() => setActiveDashboardTab("overview")}
            >
              Manager Dashboard
            </button>
            <button
              type="button"
              className={`preview-tab-btn ${activeDashboardTab === "tracking" ? "tab-active" : ""}`}
              onClick={() => setActiveDashboardTab("tracking")}
            >
              Live Fleet Tracking
            </button>
            <button
              type="button"
              className={`preview-tab-btn ${activeDashboardTab === "trips" ? "tab-active" : ""}`}
              onClick={() => setActiveDashboardTab("trips")}
            >
              Trip Management
            </button>
            <button
              type="button"
              className={`preview-tab-btn ${activeDashboardTab === "fuel" ? "tab-active" : ""}`}
              onClick={() => setActiveDashboardTab("fuel")}
            >
              Fuel Analytics
            </button>
            <button
              type="button"
              className={`preview-tab-btn ${activeDashboardTab === "maintenance" ? "tab-active" : ""}`}
              onClick={() => setActiveDashboardTab("maintenance")}
            >
              Maintenance
            </button>
            <button
              type="button"
              className={`preview-tab-btn ${activeDashboardTab === "intelligence" ? "tab-active" : ""}`}
              onClick={() => setActiveDashboardTab("intelligence")}
            >
              Intelligence Hub
            </button>
          </div>

          {/* Module Content View */}
          <div className="preview-mockup-frame">
            {activeDashboardTab === "overview" && (
              <div className="mockup-tab-content">
                <div className="tab-header-strip">
                  <h4>Fleet Operations Overview</h4>
                  <span className="badge-live">Live Sync</span>
                </div>
                <div className="mockup-kpi-row">
                  <div className="m-kpi"><span>Active Fleet</span><strong>24 Vehicles</strong></div>
                  <div className="m-kpi"><span>Dispatched Trips</span><strong>18 On Route</strong></div>
                  <div className="m-kpi"><span>In Maintenance</span><strong>3 Units</strong></div>
                  <div className="m-kpi"><span>Avg Safety Score</span><strong>88 / 100</strong></div>
                </div>
                <div className="mockup-table-preview">
                  <div className="table-row-head">
                    <span>Vehicle</span><span>Driver</span><span>Route</span><span>Status</span>
                  </div>
                  <div className="table-row-item">
                    <span>DL-01-AB-1001</span><span>Ravi Kumar</span><span>Delhi → Jaipur</span><span className="badge-blue">On Trip</span>
                  </div>
                  <div className="table-row-item">
                    <span>DL-01-AB-1002</span><span>Suresh Singh</span><span>Mumbai → Pune</span><span className="badge-blue">On Trip</span>
                  </div>
                  <div className="table-row-item">
                    <span>DL-01-AB-1003</span><span>Amit Verma</span><span>Standby (Gurgaon)</span><span className="badge-green">Available</span>
                  </div>
                </div>
              </div>
            )}

            {activeDashboardTab === "tracking" && (
              <div className="mockup-tab-content">
                <div className="tab-header-strip">
                  <h4>Live Vehicle Telemetry & Radar</h4>
                  <span className="badge-live">OpenStreetMap Engine</span>
                </div>
                <div className="tracking-mockup-view">
                  <div className="map-radar-box">
                    <div className="radar-grid-lines" />
                    <div className="radar-corridor-line" />
                    <div className="radar-ping ping-1"><span>Tata Ace Gold (DL-01)</span></div>
                    <div className="radar-ping ping-2"><span>Eicher Pro (DL-02)</span></div>
                  </div>
                  <div className="radar-telemetry-meta">
                    <div className="meta-point"><span>Active Corridor:</span><strong>NH 48 Freight Expressway</strong></div>
                    <div className="meta-point"><span>Tracked Units:</span><strong>24 Live Transponders</strong></div>
                    <div className="meta-point"><span>Sampling Rate:</span><strong>Every 3 Seconds</strong></div>
                  </div>
                </div>
              </div>
            )}

            {activeDashboardTab === "trips" && (
              <div className="mockup-tab-content">
                <div className="tab-header-strip">
                  <h4>Trip Registry & Dispatch Manifests</h4>
                  <span className="badge-live">Automated Status</span>
                </div>
                <div className="mockup-table-preview">
                  <div className="table-row-head">
                    <span>Trip ID</span><span>Vehicle</span><span>Driver</span><span>Cargo</span><span>Status</span>
                  </div>
                  <div className="table-row-item">
                    <span>TRP-9041</span><span>DL-01-AB-1001</span><span>Ravi Kumar</span><span>600 kg</span><span className="badge-blue">Dispatched</span>
                  </div>
                  <div className="table-row-item">
                    <span>TRP-9042</span><span>DL-01-AB-1002</span><span>Suresh Singh</span><span>4,200 kg</span><span className="badge-blue">Dispatched</span>
                  </div>
                  <div className="table-row-item">
                    <span>TRP-9043</span><span>DL-01-AB-1005</span><span>Mohit Sharma</span><span>2,300 kg</span><span className="badge-green">Completed</span>
                  </div>
                </div>
              </div>
            )}

            {activeDashboardTab === "fuel" && (
              <div className="mockup-tab-content">
                <div className="tab-header-strip">
                  <h4>Fuel Intelligence & Expenditure</h4>
                  <span className="badge-live">Consumption Engine</span>
                </div>
                <div className="mockup-kpi-row">
                  <div className="m-kpi"><span>Total Spend</span><strong>₹31,400</strong></div>
                  <div className="m-kpi"><span>Diesel Logged</span><strong>330.5 Liters</strong></div>
                  <div className="m-kpi"><span>Fleet Avg</span><strong>8.6 km/L</strong></div>
                  <div className="m-kpi"><span>Top Vehicle</span><strong>Tata Ace Gold</strong></div>
                </div>
              </div>
            )}

            {activeDashboardTab === "maintenance" && (
              <div className="mockup-tab-content">
                <div className="tab-header-strip">
                  <h4>Preventive Maintenance & Workshop Logs</h4>
                  <span className="badge-live">Zero Breakdown Target</span>
                </div>
                <div className="mockup-table-preview">
                  <div className="table-row-head">
                    <span>Work Order</span><span>Vehicle</span><span>Service</span><span>Cost</span><span>Status</span>
                  </div>
                  <div className="table-row-item">
                    <span>WO-412</span><span>DL-01-AB-1004</span><span>Engine Overhaul</span><span>₹28,000</span><span className="badge-indigo">In Shop</span>
                  </div>
                  <div className="table-row-item">
                    <span>WO-413</span><span>DL-01-AB-1002</span><span>Brake Pad Replacement</span><span>₹6,400</span><span className="badge-green">Completed</span>
                  </div>
                </div>
              </div>
            )}

            {activeDashboardTab === "intelligence" && (
              <div className="mockup-tab-content">
                <div className="tab-header-strip">
                  <h4>Fleet AI Assistant & Operational Radar</h4>
                  <Link to="/intelligence" className="badge-live" style={{ textDecoration: "none" }}>Open Live View →</Link>
                </div>
                <div className="ai-chat-preview-box">
                  <div className="chat-bubble-bot">
                    "I analyze your live fleet data. High-risk vehicles: DL-01-AB-1004 (brake service required). Recommended dispatch: DL-01-AB-1003 is available with optimal fuel efficiency."
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── 12. Benefits Section ── */}
      <section className="landing-benefits-section">
        <div className="section-container">
          <div className="section-header-centered">
            <span className="section-kicker">Operational Advantage</span>
            <h2 className="section-main-heading">Built for Smarter Fleet Operations.</h2>
            <p className="section-lead-text">
              Eliminate administrative bottlenecks and empower your team with automated tracking and intelligent dispatch tools.
            </p>
          </div>

          <div className="benefits-checklist-grid">
            <div className="benefit-item">
              <div className="benefit-check-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <div>
                <h4>Better fleet visibility</h4>
                <p>Know exact vehicle statuses, ongoing missions, and driver assignments across your entire network.</p>
              </div>
            </div>

            <div className="benefit-item">
              <div className="benefit-check-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <div>
                <h4>Smarter route planning</h4>
                <p>Prioritize routes based on operational urgency, fuel economy, or transit velocity.</p>
              </div>
            </div>

            <div className="benefit-item">
              <div className="benefit-check-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <div>
                <h4>Improved fuel awareness</h4>
                <p>Track consumption metrics per vehicle and eliminate unmonitored idle waste.</p>
              </div>
            </div>

            <div className="benefit-item">
              <div className="benefit-check-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <div>
                <h4>Centralized vehicle and driver management</h4>
                <p>Consolidate vehicle registries, payload limits, and commercial license documentation.</p>
              </div>
            </div>

            <div className="benefit-item">
              <div className="benefit-check-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <div>
                <h4>Faster operational decisions</h4>
                <p>Receive real-time alerts for expiring licenses, maintenance urgencies, and trip statuses.</p>
              </div>
            </div>

            <div className="benefit-item">
              <div className="benefit-check-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <div>
                <h4>Data-driven fleet management</h4>
                <p>Base business choices on telemetry data, driver safety indices, and historical expenditures.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 13. Final CTA ── */}
      <section className="landing-final-cta-section" id="cta">
        <div className="final-cta-card">
          <h2 className="final-cta-heading">Ready to Take Control of Your Fleet?</h2>
          <p className="final-cta-sub">
            Manage every vehicle, trip and operational decision from one intelligent platform.
          </p>

          <div className="final-cta-btn-row">
            <Link to={session ? dashboardLink : "/register"} className="btn-cta-white">
              {session ? "Open Dashboard" : "Get Started"}
            </Link>
            <Link to={session ? "/intelligence" : "/login"} className="btn-cta-outline">
              {session ? "Explore Intelligence" : "Sign In"}
            </Link>
          </div>
        </div>
      </section>

      {/* ── 14. Professional Footer ── */}
      <footer className="landing-footer">
        <div className="section-container">
          <div className="footer-columns-grid">
            <div className="footer-brand-col">
              <Link to="/" className="landing-brand-logo-wrap">
                <div className="brand-symbol">
                  <span className="symbol-bar symbol-bar-1" />
                  <span className="symbol-bar symbol-bar-2" />
                  <span className="symbol-bar symbol-bar-3" />
                </div>
                <span className="brand-title">FleetFlow</span>
              </Link>
              <p className="footer-tagline">
                Intelligent fleet management for modern logistics operations.
              </p>
            </div>

            <div className="footer-nav-col">
              <h5>Product</h5>
              <button type="button" onClick={() => scrollToSection("features")} className="footer-link-btn">Features</button>
              <Link to="/intelligence" className="footer-link">Intelligence</Link>
              <button type="button" onClick={() => scrollToSection("hero")} className="footer-link-btn">Tracking</button>
              <button type="button" onClick={() => scrollToSection("routes")} className="footer-link-btn">Route Optimization</button>
            </div>

            <div className="footer-nav-col">
              <h5>Company</h5>
              <button type="button" onClick={() => scrollToSection("about")} className="footer-link-btn">About</button>
              <button type="button" onClick={() => scrollToSection("cta")} className="footer-link-btn">Contact</button>
            </div>

            <div className="footer-nav-col">
              <h5>Account</h5>
              <Link to="/login" className="footer-link">Sign In</Link>
              <Link to="/register" className="footer-link">Get Started</Link>
            </div>
          </div>

          <div className="footer-bottom-bar">
            <span>© 2026 FleetFlow. All rights reserved.</span>
            <span>Commercial Fleet & Logistics Technology</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
