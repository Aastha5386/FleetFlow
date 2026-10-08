import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useFleet } from "../fleetStore.jsx";
import "../styles/auth.css";
import fleetHighwayImg from "../assets/fleet-highway.png";
import {
  FleetFlowLogo,
  MailIcon,
  LockIcon,
  EyeIcon,
  EyeOffIcon,
  PinIcon,
  TruckIcon,
  AnalyticsIcon,
  GoogleIcon,
} from "../components/AuthIcons.jsx";

const GOOGLE_ACCOUNTS = [
  { name: "Alex Mercer", email: "alex.manager@gmail.com", role: "Manager", avatar: "A", badge: "Fleet Manager" },
  { name: "Ravi Kumar", email: "ravi.driver@gmail.com", role: "Driver", avatar: "R", badge: "Driver" },
  { name: "Dave Clark", email: "dave.dispatcher@gmail.com", role: "Dispatcher", avatar: "D", badge: "Dispatcher" },
  { name: "Sarah Connor", email: "sarah.safety@gmail.com", role: "Safety Officer", avatar: "S", badge: "Safety Officer" },
  { name: "Fiona Banks", email: "fiona.finance@gmail.com", role: "Financial Analyst", avatar: "F", badge: "Financial Analyst" },
];

export default function Login() {
  const { login, googleLogin, resetPassword } = useFleet();
  const navigate = useNavigate();
  const location = useLocation();

  const [emailOrUser, setEmailOrUser] = useState(location.state?.registeredEmail || "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState(location.state?.message || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location.state?.registeredEmail) {
      setEmailOrUser(location.state.registeredEmail);
    }
    if (location.state?.message) {
      setSuccessMsg(location.state.message);
    }
  }, [location.state]);

  // Google Sign-In Modal state
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [customEmail, setCustomEmail] = useState("");
  const [customName, setCustomName] = useState("");
  const [customRole, setCustomRole] = useState("Manager");
  const [showCustomInput, setShowCustomInput] = useState(false);

  // Forgot Password Modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotNewPass, setForgotNewPass] = useState("");
  const [forgotMsg, setForgotMsg] = useState({ type: "", text: "" });
  const [forgotLoading, setForgotLoading] = useState(false);

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

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setError("");

    const cleanEmail = emailOrUser.trim();
    const cleanPass = password.trim();

    if (!cleanEmail || !cleanPass) {
      setError("Please enter both your email address and password.");
      return;
    }

    setLoading(true);
    const res = await login(cleanEmail, cleanPass);
    setLoading(false);
    if (res.ok) {
      const destination = getTargetForRole(res.user?.role);
      navigate(destination);
    } else {
      setError(res.message || "Invalid credentials.");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setForgotMsg({ type: "", text: "" });
    const cleanMail = forgotEmail.trim().toLowerCase();
    const cleanNewPass = forgotNewPass.trim();

    if (!cleanMail || !cleanNewPass) {
      setForgotMsg({ type: "error", text: "Please enter your email and a new password." });
      return;
    }
    if (cleanNewPass.length < 6) {
      setForgotMsg({ type: "error", text: "Password must be at least 6 characters long." });
      return;
    }

    setForgotLoading(true);
    const res = await resetPassword({ email: cleanMail, newPassword: cleanNewPass });
    setForgotLoading(false);

    if (res.ok) {
      setForgotMsg({ type: "success", text: "Password updated successfully! Redirecting to sign in..." });
      setEmailOrUser(cleanMail);
      setPassword(cleanNewPass);
      setTimeout(() => {
        setShowForgotModal(false);
        setForgotMsg({ type: "", text: "" });
      }, 1500);
    } else {
      setForgotMsg({ type: "error", text: res.message || "Unable to reset password." });
    }
  };

  const handleGoogleSelect = async (account) => {
    setError("");
    setLoading(true);
    setShowGoogleModal(false);
    const res = await googleLogin({
      email: account.email,
      name: account.name,
      role: account.role,
    });
    setLoading(false);
    if (res.ok) {
      navigate(getTargetForRole(res.user?.role));
    } else {
      setError(res.message || "Google authentication failed.");
    }
  };

  const handleCustomGoogleSubmit = async (e) => {
    e.preventDefault();
    if (!customEmail) return;
    await handleGoogleSelect({
      email: customEmail,
      name: customName || customEmail.split("@")[0],
      role: customRole,
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
              Keep Your Fleet<br />Moving Forward
            </h2>
            <p className="auth-hero-subtitle">
              Track vehicles, manage drivers, optimize routes and get real-time insights — all in one place.
            </p>

            <div className="auth-feature-list">
              <div className="auth-feature-item">
                <div className="auth-feature-icon-box">
                  <PinIcon />
                </div>
                <div className="auth-feature-text">
                  <span className="auth-feature-title">Real-time Tracking</span>
                  <span className="auth-feature-desc">Live location & status</span>
                </div>
              </div>

              <div className="auth-feature-item">
                <div className="auth-feature-icon-box">
                  <TruckIcon />
                </div>
                <div className="auth-feature-text">
                  <span className="auth-feature-title">Fleet Management</span>
                  <span className="auth-feature-desc">Vehicles, drivers, maintenance</span>
                </div>
              </div>

              <div className="auth-feature-item">
                <div className="auth-feature-icon-box">
                  <AnalyticsIcon />
                </div>
                <div className="auth-feature-text">
                  <span className="auth-feature-title">Smarter Decisions</span>
                  <span className="auth-feature-desc">Data-driven insights</span>
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

        {/* Right Column: Sign In Card */}
        <div className="auth-card-column">
          <div className="auth-card">
            <h2 className="auth-card-title">Welcome Back</h2>
            <p className="auth-card-subtitle">Sign in to your FleetFlow account</p>

            {successMsg && !error && (
              <div className="flash flash-info" style={{ marginBottom: 16 }}>
                {successMsg}
              </div>
            )}

            {error && (
              <div className="flash flash-error" style={{ marginBottom: 16 }}>
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="auth-form">
              {/* Email / Username field */}
              <div className="auth-field-group">
                <label className="auth-field-label">Email Address</label>
                <div className="auth-input-wrapper">
                  <span className="auth-input-icon">
                    <MailIcon />
                  </span>
                  <input
                    type="text"
                    required
                    className="auth-input-field"
                    placeholder="you@company.com"
                    value={emailOrUser}
                    onChange={(e) => setEmailOrUser(e.target.value)}
                  />
                </div>
              </div>

              {/* Password field */}
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
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
              </div>

              {/* Options Row: Remember Me & Forgot Password */}
              <div className="auth-options-row">
                <label className="auth-checkbox-label">
                  <input
                    type="checkbox"
                    className="auth-checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>Remember me</span>
                </label>
                <a
                  href="#forgot"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowForgotModal(true);
                    setForgotEmail(emailOrUser.trim());
                  }}
                  className="auth-forgot-link"
                >
                  Forgot password?
                </a>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="auth-primary-btn"
                disabled={loading}
              >
                {loading ? "Signing In..." : "Sign In  →"}
              </button>

              {/* Divider */}
              <div className="auth-divider">
                <div className="auth-divider-line"></div>
                <span className="auth-divider-text">OR</span>
                <div className="auth-divider-line"></div>
              </div>

              {/* Functional Google Sign-In Button */}
              <button
                type="button"
                className="auth-google-btn"
                onClick={() => setShowGoogleModal(true)}
              >
                <GoogleIcon />
                <span>Continue with Google</span>
              </button>
            </form>

            {/* Bottom switcher to Register */}
            <div className="auth-bottom-switch">
              Don't have an account?
              <Link to="/register" className="auth-switch-link">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Official Google Account Picker Modal */}
      {showGoogleModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.65)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: 16,
          }}
          onClick={() => setShowGoogleModal(false)}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: "20px",
              maxWidth: 440,
              width: "100%",
              boxShadow: "0 25px 60px rgba(0,0,0,0.35)",
              border: "1px solid #e2e8f0",
              overflow: "hidden",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ padding: "26px 28px 18px", textAlign: "center", borderBottom: "1px solid #f1f5f9" }}>
              <div style={{ display: "inline-flex", marginBottom: 12 }}>
                <GoogleIcon />
              </div>
              <h3 style={{ margin: "0 0 6px", fontSize: "1.28rem", fontWeight: 700, color: "#1e293b" }}>
                Choose an account
              </h3>
              <p style={{ margin: 0, fontSize: "0.86rem", color: "#64748b" }}>
                to continue to <strong style={{ color: "#1d4ed8" }}>FleetFlow</strong>
              </p>
            </div>

            {/* Account List */}
            <div style={{ padding: "12px 16px", maxHeight: 340, overflowY: "auto" }}>
              {GOOGLE_ACCOUNTS.map((acc) => (
                <div
                  key={acc.email}
                  onClick={() => handleGoogleSelect(acc)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: "12px 14px",
                    borderRadius: "12px",
                    cursor: "pointer",
                    transition: "background 0.15s ease",
                    marginBottom: 4,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#f8fafc")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                      color: "#ffffff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                      fontSize: "1rem",
                      flexShrink: 0,
                    }}
                  >
                    {acc.avatar}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <strong style={{ fontSize: "0.92rem", color: "#1e293b" }}>{acc.name}</strong>
                      <span
                        style={{
                          fontSize: "0.7rem",
                          background: "#eff6ff",
                          color: "#2563eb",
                          padding: "2px 7px",
                          borderRadius: "999px",
                          fontWeight: 600,
                        }}
                      >
                        {acc.badge}
                      </span>
                    </div>
                    <div style={{ fontSize: "0.82rem", color: "#64748b", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {acc.email}
                    </div>
                  </div>
                </div>
              ))}

              {/* Custom Google Account Section */}
              {!showCustomInput ? (
                <div
                  onClick={() => setShowCustomInput(true)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: "12px 14px",
                    borderRadius: "12px",
                    cursor: "pointer",
                    borderTop: "1px dashed #e2e8f0",
                    marginTop: 6,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#f8fafc")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      background: "#f1f5f9",
                      color: "#64748b",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 600,
                      fontSize: "1.2rem",
                    }}
                  >
                    +
                  </div>
                  <div>
                    <strong style={{ fontSize: "0.9rem", color: "#334155" }}>Use another Google account</strong>
                    <div style={{ fontSize: "0.8rem", color: "#94a3b8" }}>Sign in with any custom email</div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleCustomGoogleSubmit} style={{ padding: "12px 6px", borderTop: "1px dashed #e2e8f0" }}>
                  <div className="input-group" style={{ marginBottom: 10 }}>
                    <label style={{ fontSize: "0.8rem" }}>Google Email</label>
                    <input
                      type="email"
                      required
                      className="auth-input-field"
                      style={{ paddingLeft: 12 }}
                      placeholder="your.email@gmail.com"
                      value={customEmail}
                      onChange={(e) => setCustomEmail(e.target.value)}
                      autoFocus
                    />
                  </div>
                  <div className="input-group" style={{ marginBottom: 10 }}>
                    <label style={{ fontSize: "0.8rem" }}>Full Name (Optional)</label>
                    <input
                      type="text"
                      className="auth-input-field"
                      style={{ paddingLeft: 12 }}
                      placeholder="Your Name"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                    />
                  </div>
                  <div className="input-group" style={{ marginBottom: 12 }}>
                    <label style={{ fontSize: "0.8rem" }}>Workspace Role</label>
                    <select
                      className="auth-input-field auth-select-field"
                      value={customRole}
                      onChange={(e) => setCustomRole(e.target.value)}
                    >
                      <option value="Manager">Fleet Manager</option>
                      <option value="Driver">Driver</option>
                      <option value="Dispatcher">Dispatcher</option>
                      <option value="Safety Officer">Safety Officer</option>
                      <option value="Financial Analyst">Financial Analyst</option>
                    </select>
                  </div>
                  <button type="submit" className="auth-primary-btn">
                    Continue with this Google Account
                  </button>
                </form>
              )}
            </div>

            {/* Modal Footer */}
            <div style={{ padding: "14px 20px", background: "#f8fafc", textAlign: "right", borderTop: "1px solid #f1f5f9" }}>
              <button
                type="button"
                className="secondary"
                onClick={() => setShowGoogleModal(false)}
                style={{ padding: "6px 16px", fontSize: "0.85rem" }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Forgot Password Reset Modal */}
      {showForgotModal && (
        <div
          className="modal-backdrop"
          onClick={() => setShowForgotModal(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.65)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: 16,
          }}
        >
          <div
            className="modal"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: 440,
              background: "#ffffff",
              borderRadius: "16px",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              overflow: "hidden",
            }}
          >
            <div style={{ padding: "20px 24px", borderBottom: "1px solid #f1f5f9" }}>
              <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 700, color: "#0f172a" }}>
                Reset Account Password
              </h3>
              <p style={{ margin: "4px 0 0", fontSize: "0.85rem", color: "#64748b" }}>
                Enter your registered email and choose a new secure password.
              </p>
            </div>

            <div style={{ padding: "20px 24px" }}>
              {forgotMsg.text && (
                <div
                  className={`flash ${forgotMsg.type === "success" ? "flash-info" : "flash-error"}`}
                  style={{ marginBottom: 16 }}
                >
                  {forgotMsg.text}
                </div>
              )}

              <form onSubmit={handleResetPassword}>
                <div className="auth-field-group" style={{ marginBottom: 14 }}>
                  <label className="auth-field-label">Registered Email</label>
                  <div className="auth-input-wrapper">
                    <span className="auth-input-icon">
                      <MailIcon />
                    </span>
                    <input
                      type="email"
                      required
                      className="auth-input-field"
                      placeholder="you@company.com"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="auth-field-group" style={{ marginBottom: 18 }}>
                  <label className="auth-field-label">New Password</label>
                  <div className="auth-input-wrapper">
                    <span className="auth-input-icon">
                      <LockIcon />
                    </span>
                    <input
                      type="password"
                      required
                      minLength={6}
                      className="auth-input-field"
                      placeholder="Min 6 characters"
                      value={forgotNewPass}
                      onChange={(e) => setForgotNewPass(e.target.value)}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="auth-primary-btn"
                  disabled={forgotLoading}
                >
                  {forgotLoading ? "Resetting Password..." : "Update Password & Sign In"}
                </button>
              </form>
            </div>

            <div style={{ padding: "14px 20px", background: "#f8fafc", textAlign: "right", borderTop: "1px solid #f1f5f9" }}>
              <button
                type="button"
                className="secondary"
                onClick={() => setShowForgotModal(false)}
                style={{ padding: "6px 16px", fontSize: "0.85rem" }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
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
