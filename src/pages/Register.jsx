import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFleet } from "../fleetStore.jsx";
import "../styles/auth.css";
import fleetHighwayImg from "../assets/fleet-highway.png";
import {
  FleetFlowLogo,
  UserIcon,
  MailIcon,
  BuildingIcon,
  LockIcon,
  EyeIcon,
  EyeOffIcon,
  TruckIcon,
  LightningIcon,
  ShieldIcon,
} from "../components/AuthIcons.jsx";

const ROLES = [
  "Manager",
  "Driver",
  "Dispatcher",
  "Safety Officer",
  "Financial Analyst",
];

export default function Register() {
  const { register } = useFleet();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    role: "",
    password: "",
    confirmPassword: "",
    agree: true,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);
  const [registeredUser, setRegisteredUser] = useState(null);

  // Calculate password strength
  const calculateStrength = (pass) => {
    if (!pass) return { score: 0, label: "" };
    let score = 0;
    if (pass.length >= 6) score++;
    if (pass.length >= 10) score++;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score++;
    if (/[0-9]/.test(pass) || /[^A-Za-z0-9]/.test(pass)) score++;

    const labels = ["Weak", "Fair", "Good", "Strong"];
    return { score, label: labels[score - 1] || "Weak" };
  };

  const strength = calculateStrength(form.password);

  const getTargetForRole = (role) => {
    switch (role) {
      case "Driver":
        return "/driver/dashboard";
      case "Dispatcher":
        return "/dispatcher/dashboard";
      case "Safety Officer":
        return "/safety/dashboard";
      case "Financial Analyst":
        return "/financial/dashboard";
      case "Manager":
      default:
        return "/dashboard";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg({ type: "", text: "" });

    const cleanPassword = (form.password || "").trim();
    const cleanConfirm = (form.confirmPassword || "").trim();

    if (cleanPassword !== cleanConfirm) {
      return setMsg({ type: "error", text: "Passwords do not match." });
    }

    if (cleanPassword.length < 6) {
      return setMsg({ type: "error", text: "Password must be at least 6 characters long." });
    }

    if (!form.role) {
      return setMsg({ type: "error", text: "Please select an operational role." });
    }

    if (!form.agree) {
      return setMsg({ type: "error", text: "Please accept the Terms of Service and Privacy Policy." });
    }

    setLoading(true);
    const cleanEmail = form.email.trim().toLowerCase();
    const cleanRole = form.role === "Fleet Manager" ? "Manager" : form.role;
    const username = cleanEmail.split("@")[0].replace(/[^a-z0-9_]/g, "") || "user";
    
    const res = await register({
      name: form.name.trim(),
      email: cleanEmail,
      password: cleanPassword,
      role: cleanRole,
      company: (form.company || "").trim(),
      username,
    });
    setLoading(false);

    setRegisteredUser({
      name: form.name.trim(),
      email: cleanEmail,
      role: cleanRole,
    });
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-container">
        {/* Left Column: Value Proposition & Illustration */}
        <div className="auth-hero-column">
          <FleetFlowLogo />

          <div className="auth-hero-content">
            <h2 className="auth-hero-title">
              Start Your<br />FleetFlow Journey
            </h2>
            <p className="auth-hero-subtitle">
              Create your account and take control of your fleet with powerful tools, real-time tracking and seamless management.
            </p>

            <div className="auth-feature-list">
              <div className="auth-feature-item">
                <div className="auth-feature-icon-box">
                  <TruckIcon />
                </div>
                <div className="auth-feature-text">
                  <span className="auth-feature-title">Manage Your Fleet</span>
                  <span className="auth-feature-desc">Vehicles, drivers, routes</span>
                </div>
              </div>

              <div className="auth-feature-item">
                <div className="auth-feature-icon-box">
                  <LightningIcon />
                </div>
                <div className="auth-feature-text">
                  <span className="auth-feature-title">Boost Efficiency</span>
                  <span className="auth-feature-desc">Save time & reduce costs</span>
                </div>
              </div>

              <div className="auth-feature-item">
                <div className="auth-feature-icon-box">
                  <ShieldIcon />
                </div>
                <div className="auth-feature-text">
                  <span className="auth-feature-title">Grow with Confidence</span>
                  <span className="auth-feature-desc">Built for every fleet size</span>
                </div>
              </div>
            </div>
          </div>

          <div className="auth-illustration-wrap">
            <img
              src={fleetHighwayImg}
              alt="Fleet vehicles on highway"
              className="auth-illustration-img"
            />
          </div>
        </div>

        {/* Right Column: Create Account Card or Sign-In Prompt */}
        <div className="auth-card-column">
          {registeredUser ? (
            <div className="auth-card" style={{ textAlign: "center", padding: "40px 28px" }}>
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  background: "#eff6ff",
                  border: "2px solid #bfdbfe",
                  color: "#2563eb",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px",
                }}
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>

              <h2 className="auth-card-title" style={{ fontSize: "1.45rem", marginBottom: 8, color: "#0f172a" }}>
                Account Created Successfully
              </h2>
              <p className="auth-card-subtitle" style={{ maxWidth: 360, margin: "0 auto 24px", lineHeight: 1.5, color: "#64748b" }}>
                Your FleetFlow account has been created. Please sign in with your email and password to enter your workspace.
              </p>

              <div
                style={{
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  borderRadius: 12,
                  padding: "16px 20px",
                  textAlign: "left",
                  marginBottom: 24,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, fontSize: "0.85rem" }}>
                  <span style={{ color: "#64748b" }}>Registered Email</span>
                  <strong style={{ color: "#0f172a" }}>{registeredUser.email}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, fontSize: "0.85rem" }}>
                  <span style={{ color: "#64748b" }}>Assigned Role</span>
                  <span
                    style={{
                      background: "#eff6ff",
                      color: "#2563eb",
                      padding: "2px 10px",
                      borderRadius: 999,
                      fontSize: "0.75rem",
                      fontWeight: 600,
                    }}
                  >
                    {registeredUser.role}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.85rem" }}>
                  <span style={{ color: "#64748b" }}>Account Status</span>
                  <span style={{ color: "#16a34a", fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#16a34a", display: "inline-block" }} />
                    Active & Ready
                  </span>
                </div>
              </div>

              <button
                type="button"
                className="auth-primary-btn"
                onClick={() =>
                  navigate("/login", {
                    state: {
                      registeredEmail: registeredUser.email,
                      message: "Account created successfully! Please sign in with your email and password to enter.",
                    },
                  })
                }
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}
              >
                <span>Proceed to Sign In</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>

              <div style={{ marginTop: 20 }}>
                <Link
                  to="/login"
                  state={{
                    registeredEmail: registeredUser.email,
                    message: "Account created successfully! Please sign in with your email and password to enter.",
                  }}
                  className="auth-switch-link"
                  style={{ fontSize: "0.88rem" }}
                >
                  Back to Sign In
                </Link>
              </div>
            </div>
          ) : (
            <div className="auth-card">
              <h2 className="auth-card-title">Create Your Account</h2>
              <p className="auth-card-subtitle">Get started with FleetFlow</p>

              {msg.text && (
                <div
                  className={`flash ${msg.type === "success" ? "flash-info" : "flash-error"}`}
                  style={{ marginBottom: 16 }}
                >
                  {msg.text}
                </div>
              )}

              <form onSubmit={handleSubmit} className="auth-form">
                {/* Full Name */}
                <div className="auth-field-group">
                  <label className="auth-field-label">Full Name</label>
                  <div className="auth-input-wrapper">
                    <span className="auth-input-icon">
                      <UserIcon />
                    </span>
                    <input
                      type="text"
                      required
                      className="auth-input-field"
                      placeholder="Enter your full name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  </div>
                </div>

                {/* Work / Company Email */}
                <div className="auth-field-group">
                  <label className="auth-field-label">Work / Company Email</label>
                  <div className="auth-input-wrapper">
                    <span className="auth-input-icon">
                      <MailIcon />
                    </span>
                    <input
                      type="email"
                      required
                      className="auth-input-field"
                      placeholder="you@company.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                  </div>
                </div>

                {/* Company / Fleet Name */}
                <div className="auth-field-group">
                  <label className="auth-field-label">Company / Fleet Name</label>
                  <div className="auth-input-wrapper">
                    <span className="auth-input-icon">
                      <BuildingIcon />
                    </span>
                    <input
                      type="text"
                      className="auth-input-field"
                      placeholder="e.g. ABC Logistics"
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                    />
                  </div>
                </div>

                {/* Role */}
                <div className="auth-field-group">
                  <label className="auth-field-label">Role</label>
                  <div className="auth-input-wrapper">
                    <span className="auth-input-icon">
                      <UserIcon />
                    </span>
                    <select
                      required
                      className="auth-input-field auth-select-field"
                      value={form.role}
                      onChange={(e) => setForm({ ...form, role: e.target.value })}
                    >
                      <option value="">Select your role</option>
                      {ROLES.map((r) => (
                        <option key={r} value={r}>
                          {r === "Manager" ? "Fleet Manager" : r}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Password */}
                <div className="auth-field-group">
                  <label className="auth-field-label">Password</label>
                  <div className="auth-input-wrapper">
                    <span className="auth-input-icon">
                      <LockIcon />
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      className="auth-input-field"
                      placeholder="Create a password"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                    />
                    <button
                      type="button"
                      className="auth-password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>

                  {/* Password Strength Indicator */}
                  {form.password && (
                    <div className="auth-strength-container">
                      <div className="auth-strength-bars">
                        <div className={`auth-strength-segment ${strength.score >= 1 ? `active-${strength.label.toLowerCase()}` : ""}`} />
                        <div className={`auth-strength-segment ${strength.score >= 2 ? `active-${strength.label.toLowerCase()}` : ""}`} />
                        <div className={`auth-strength-segment ${strength.score >= 3 ? `active-${strength.label.toLowerCase()}` : ""}`} />
                        <div className={`auth-strength-segment ${strength.score >= 4 ? `active-${strength.label.toLowerCase()}` : ""}`} />
                      </div>
                      <span className="auth-strength-label">
                        Password strength: <strong>{strength.label}</strong>
                      </span>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="auth-field-group">
                  <label className="auth-field-label">Confirm Password</label>
                  <div className="auth-input-wrapper">
                    <span className="auth-input-icon">
                      <LockIcon />
                    </span>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      className="auth-input-field"
                      placeholder="Confirm your password"
                      value={form.confirmPassword}
                      onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                    />
                    <button
                      type="button"
                      className="auth-password-toggle"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      tabIndex={-1}
                      aria-label="Toggle password visibility"
                    >
                      {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                </div>

                {/* Agreement checkbox */}
                <div className="auth-options-row" style={{ marginTop: 2 }}>
                  <label className="auth-checkbox-label">
                    <input
                      type="checkbox"
                      className="auth-checkbox"
                      checked={form.agree}
                      onChange={(e) => setForm({ ...form, agree: e.target.checked })}
                      required
                    />
                    <span style={{ fontSize: "0.8rem", color: "#64748b" }}>
                      I agree to the{" "}
                      <a href="#terms" onClick={(e) => e.preventDefault()} style={{ color: "#2563eb", textDecoration: "none", fontWeight: 500 }}>
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a href="#privacy" onClick={(e) => e.preventDefault()} style={{ color: "#2563eb", textDecoration: "none", fontWeight: 500 }}>
                        Privacy Policy
                      </a>
                    </span>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="auth-primary-btn"
                  disabled={loading}
                >
                  {loading ? "Creating Account..." : "Create FleetFlow Account  →"}
                </button>
              </form>

              {/* Bottom switcher to Login */}
              <div className="auth-bottom-switch">
                Already have an account?
                <Link to="/login" className="auth-switch-link">
                  Sign In
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Page Footer */}
      <footer className="auth-page-footer">
        <div>© 2025 FleetFlow. All rights reserved.</div>
        <div className="auth-footer-links">
          <a href="#privacy" className="auth-footer-link" onClick={(e) => e.preventDefault()}>Privacy Policy</a>
          <span>|</span>
          <a href="#terms" className="auth-footer-link" onClick={(e) => e.preventDefault()}>Terms of Service</a>
        </div>
      </footer>
    </div>
  );
}
