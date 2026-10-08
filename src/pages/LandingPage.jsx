import { Link } from "react-router-dom";
import LiveFleetMap from "../components/LiveFleetMap.jsx";
import "../styles/landing.css";

export default function LandingPage() {
  return (
    <div className="landing-shell">
      {/* Ambient Lighting Blurs (Left Blue, Right Lime/Green) */}
      <div className="landing-ambient-bg">
        <div className="ambient-orb-blue" />
        <div className="ambient-orb-green" />
      </div>

      {/* Top Navigation */}
      <header className="landing-nav">
        <Link to="/" className="landing-brand">
          <div className="landing-brand-logo">
            <span style={{ width: 14 }} />
            <span style={{ width: 22 }} />
            <span style={{ width: 18 }} />
          </div>
          <span className="landing-brand-name">FleetFlow</span>
        </Link>

        <nav className="landing-nav-center">
          <a href="#tracking" className="landing-nav-link">Tracking</a>
          <a href="#shipments" className="landing-nav-link">Shipments</a>
          <a href="#reports" className="landing-nav-link">Reports</a>
          <a href="#support" className="landing-nav-link">Support</a>
        </nav>

        <div className="landing-nav-right">
          <div className="landing-lang-pill">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            <span>ENG</span>
          </div>
          <Link to="/login" className="btn-nav-login">Log In</Link>
          <Link to="/register" className="btn-nav-primary">Get Started</Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="landing-hero">


        {/* Main Title */}
        <h1 className="hero-title">
          Smart Fleet Management<br />Made Simple
        </h1>

        {/* Subtitle */}
        <p className="hero-subtitle">
          Monitor every vehicle, track shipments in real-time, and optimize your logistics all in one intuitive dashboard.
        </p>

        {/* Action CTAs */}
        <div className="hero-cta-row">
          <Link to="/register" className="hero-btn-primary">
            Get Started
          </Link>
          <Link to="/login" className="hero-btn-secondary">
            Watch a Demo
          </Link>
        </div>

        {/* Floating Dashboard Preview Window (Direct Drivex Inspiration) */}
        <div className="dashboard-preview-window">
          {/* macOS Browser Header */}
          <div className="browser-header-bar">
            <div className="window-dots">
              <span className="dot dot-red" />
              <span className="dot dot-yellow" />
              <span className="dot dot-green" />
            </div>

            <div className="browser-url-pill">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span>fleetflow.io/dashboard</span>
            </div>

            <div className="browser-header-icons">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3" /></svg>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4" /></svg>
            </div>
          </div>

          {/* Inner Application Body */}
          <div className="mockup-app-body">
            {/* Left Mini Sidebar */}
            <aside className="mockup-sidebar">
              <div className="mockup-side-icon active">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="9" rx="1.5" /><rect x="14" y="3" width="7" height="5" rx="1.5" />
                  <rect x="14" y="12" width="7" height="9" rx="1.5" /><rect x="3" y="16" width="7" height="5" rx="1.5" />
                </svg>
              </div>
              <div className="mockup-side-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" /><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
                </svg>
              </div>
              <div className="mockup-side-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="1" y="3" width="15" height="13" rx="2" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                  <circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
                </svg>
              </div>
              <div className="mockup-side-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
                </svg>
              </div>
              <div className="mockup-side-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
                </svg>
              </div>
              <div className="mockup-side-icon" style={{ marginTop: "auto" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
              </div>
            </aside>

            {/* Main Mockup Dashboard Canvas */}
            <div className="mockup-main-area">
              {/* Inner Top Bar */}
              <div className="mockup-top-nav">
                <div className="mockup-title-area">
                  <h2>Dashboard</h2>
                  <p>Here's a detailed overview of your dashboard fleet tracking.</p>
                </div>
                <div className="mockup-top-actions">
                  <input
                    type="text"
                    className="mockup-search-input"
                    placeholder="Search tracking, driver..."
                    readOnly
                  />
                  <div className="landing-lang-pill" style={{ padding: "5px 10px", fontSize: "0.75rem" }}>
                    <span>English</span>
                  </div>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center", color: "#2563EB" }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
                  </div>
                </div>
              </div>

              {/* Metric Cards Row */}
              <div className="mockup-metric-grid">
                {/* 1. Total Vehicles */}
                <div className="mockup-metric-card">
                  <div className="metric-card-top">
                    <span>Total Vehicles</span>
                    <div className="metric-card-icon-wrap" style={{ background: "#EFF6FF", color: "#2563EB" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13" rx="2" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /></svg>
                    </div>
                  </div>
                  <div className="mockup-metric-value">12.340</div>
                  <span className="mockup-metric-link">View Details →</span>
                </div>

                {/* 2. Not Available / In Transit */}
                <div className="mockup-metric-card">
                  <div className="metric-card-top">
                    <span>Not Available</span>
                    <div className="metric-card-icon-wrap" style={{ background: "#FEF2F2", color: "#EF4444" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="4.93" y1="4.93" x2="19.07" y2="19.07" /></svg>
                    </div>
                  </div>
                  <div className="mockup-metric-value">5.000</div>
                  <span className="mockup-metric-link">View Details →</span>
                </div>

                {/* 3. In Repair */}
                <div className="mockup-metric-card">
                  <div className="metric-card-top">
                    <span>In repair</span>
                    <div className="metric-card-icon-wrap" style={{ background: "#ECFDF5", color: "#10B981" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg>
                    </div>
                  </div>
                  <div className="mockup-metric-value">3.140</div>
                  <span className="mockup-metric-link">View Details →</span>
                </div>

                {/* 4. Reserved / Available */}
                <div className="mockup-metric-card">
                  <div className="metric-card-top">
                    <span>Reserved</span>
                    <div className="metric-card-icon-wrap" style={{ background: "#EEF2FF", color: "#4F46E5" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                    </div>
                  </div>
                  <div className="mockup-metric-value">4.200</div>
                  <span className="mockup-metric-link">View Details →</span>
                </div>
              </div>

              {/* Split Content (Map Overview & Ongoing Delivery) */}
              <div className="mockup-split-row">
                {/* Left: Map Overview */}
                <div className="mockup-panel-card">
                  <div className="panel-header">
                    <h3>Map Overview</h3>
                    <div style={{ display: "flex", gap: 6, fontSize: "0.75rem", color: "#64748B" }}>
                      <span>Live GPS Telematics</span>
                    </div>
                  </div>

                  <div style={{ marginTop: 12 }}>
                    <LiveFleetMap height="240px" mode="hero" activeCorridorKey="delhi_jaipur" />
                  </div>
                </div>

                {/* Right: Ongoing Delivery */}
                <div className="mockup-panel-card">
                  <div className="panel-header">
                    <h3>Ongoing Delivery</h3>
                    <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.74rem", color: "#64748B", cursor: "pointer" }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>
                      <span>Filter</span>
                    </div>
                  </div>

                  <div className="delivery-list">
                    {/* Item 1 */}
                    <div className="delivery-item">
                      <div className="delivery-left">
                        <div className="driver-row">
                          <span className="driver-name">Enrico Octaviano</span>
                          <span className="delivery-badge badge-delivering">Delivering</span>
                        </div>
                        <div className="delivery-vehicle-meta">
                          <span>Zenith UG-472</span>
                          <span>·</span>
                          <span>AS78120</span>
                          <span>·</span>
                          <span>DA 9866 HK</span>
                        </div>
                      </div>
                      <div className="delivery-truck-graphic">
                        <svg width="34" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="1" y="3" width="15" height="13" rx="2" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                          <circle cx="5.5" cy="18.5" r="2.5" fill="#0F172A" /><circle cx="18.5" cy="18.5" r="2.5" fill="#0F172A" />
                        </svg>
                      </div>
                    </div>

                    {/* Item 2 */}
                    <div className="delivery-item">
                      <div className="delivery-left">
                        <div className="driver-row">
                          <span className="driver-name">Adam Adenan</span>
                          <span className="delivery-badge badge-transit">In Transit</span>
                        </div>
                        <div className="delivery-vehicle-meta">
                          <span>Prime HB-450</span>
                          <span>·</span>
                          <span>BG39088</span>
                          <span>·</span>
                          <span>AA 8903 AF</span>
                        </div>
                      </div>
                      <div className="delivery-truck-graphic">
                        <svg width="34" height="20" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="1" y="3" width="15" height="13" rx="2" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                          <circle cx="5.5" cy="18.5" r="2.5" fill="#0F172A" /><circle cx="18.5" cy="18.5" r="2.5" fill="#0F172A" />
                        </svg>
                      </div>
                    </div>

                    {/* Item 3 */}
                    <div className="delivery-item">
                      <div className="delivery-left">
                        <div className="driver-row">
                          <span className="driver-name">Marcelino</span>
                          <span className="delivery-badge badge-transit">In Transit</span>
                        </div>
                        <div className="delivery-vehicle-meta">
                          <span>Freightliner X</span>
                          <span>·</span>
                          <span>MH4921</span>
                          <span>·</span>
                          <span>DL 04 KK</span>
                        </div>
                      </div>
                      <div className="delivery-truck-graphic">
                        <svg width="34" height="20" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="1" y="3" width="15" height="13" rx="2" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                          <circle cx="5.5" cy="18.5" r="2.5" fill="#0F172A" /><circle cx="18.5" cy="18.5" r="2.5" fill="#0F172A" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>



      {/* Section: Powerful Tools To Optimize Your Fleet Operations */}
      <section className="powerful-tools-section" id="shipments">
        <div className="section-eyebrow">Enterprise Features</div>
        <h2 className="section-heading">Powerful Tools To Optimize<br />Your Fleet Operations</h2>
        <p className="section-desc">
          Gain complete visibility and control over your vehicles with advanced tracking, real-time analytics, and automated reporting.
        </p>

        <div className="tools-grid">
          {/* Tool Card 1: Real-Time Alerts Stream */}
          <div className="tool-card">
            <div className="tool-mockup-display">
              <div className="notif-bubble">
                <span className="notif-dot" style={{ background: "#2563EB" }} />
                <span>Vehicle 12 has entered the logistics hub area</span>
              </div>
              <div className="notif-bubble" style={{ transform: "translateX(16px)" }}>
                <span className="notif-dot" style={{ background: "#EF4444" }} />
                <span>Real-time location update received: route deviation detected</span>
              </div>
              <div className="notif-bubble" style={{ transform: "translateX(8px)" }}>
                <span className="notif-dot" style={{ background: "#10B981" }} />
                <span>Fuel usage data synchronized. Efficiency report is ready to view</span>
              </div>
            </div>
            <div className="tool-card-info">
              <h3>Live Telemetry & Geofence Alerts</h3>
              <p>
                Our system continuously provides real-time data from every vehicle in your fleet from location updates and route changes to performance alerts. Stay informed instantly and make data-driven decisions.
              </p>
            </div>
          </div>

          {/* Tool Card 2: Mission Delivery Status */}
          <div className="tool-card">
            <div className="tool-mockup-display" style={{ padding: "16px" }}>
              <div className="delivery-item" style={{ marginBottom: 12 }}>
                <div className="delivery-left">
                  <div className="driver-row">
                    <span className="driver-name">Enrico Octaviano</span>
                    <span className="delivery-badge badge-delivering">Delivering</span>
                  </div>
                  <div className="delivery-vehicle-meta">Zenith UG-472 · DA 9866 HK</div>
                </div>
                <svg width="28" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2"><rect x="1" y="3" width="15" height="13" rx="2" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /></svg>
              </div>

              <div className="delivery-item">
                <div className="delivery-left">
                  <div className="driver-row">
                    <span className="driver-name">Adam Adenan</span>
                    <span className="delivery-badge badge-transit">In Transit</span>
                  </div>
                  <div className="delivery-vehicle-meta">Prime HB-450 · AA 8903 AF</div>
                </div>
                <svg width="28" height="18" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2"><rect x="1" y="3" width="15" height="13" rx="2" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /></svg>
              </div>
            </div>
            <div className="tool-card-info">
              <h3>Real-Time Dispatch & Driver Tracking</h3>
              <p>
                Keep track of active deliveries with live status updates, vehicle information, and driver details. This feature allows you to monitor delivery progress, ensure on-time arrivals, and prevent delays.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div>© 2026 FleetFlow Logistics Intelligence ERP. All rights reserved. Built for modern transport enterprises.</div>
      </footer>
    </div>
  );
}
