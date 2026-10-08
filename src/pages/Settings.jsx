import { useState } from "react";
import { useFleet } from "../fleetStore.jsx";
import {
  UserIcon,
  LockIcon,
  GlobeIcon,
  BellIcon,
  CheckIcon,
  ShieldIcon,
  ZapIcon
} from "../components/Icons.jsx";

export default function Settings() {
  const { session, updateProfile, updateSettings } = useFleet();

  const [activeTab, setActiveTab] = useState("profile"); // 'profile' | 'security' | 'preferences'
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    name: session?.name || "",
    email: session?.email || "",
    phone: session?.phone || "",
    department: session?.department || "Fleet Operations",
  });

  // Password Form State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Preferences Form State
  const [settingsForm, setSettingsForm] = useState({
    speed_unit: session?.settings?.speed_unit || "km/h",
    distance_unit: session?.settings?.distance_unit || "km",
    currency: session?.settings?.currency || "INR",
    auto_refresh_sec: session?.settings?.auto_refresh_sec || 30,
    email_alerts: session?.settings?.email_alerts ?? true,
    telemetry_sound: session?.settings?.telemetry_sound ?? false,
  });

  // ── 1. Handle Profile Update ──────────────────────────────────────────────
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const res = await updateProfile({
      name: profileForm.name,
      email: profileForm.email,
      phone: profileForm.phone,
      department: profileForm.department,
    });

    setLoading(false);
    if (res.ok) {
      setSuccess("Profile details updated successfully!");
    } else {
      setError(res.message || "Failed to update profile.");
    }
  };

  // ── 2. Handle Password Change ─────────────────────────────────────────────
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return setError("New password and confirm password do not match.");
    }
    if (passwordForm.newPassword.length < 6) {
      return setError("New password must be at least 6 characters.");
    }

    setLoading(true);
    const res = await updateProfile({
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword,
    });

    setLoading(false);
    if (res.ok) {
      setSuccess("Password changed successfully!");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } else {
      setError(res.message || "Failed to update password.");
    }
  };

  // ── 3. Handle Preferences Save ────────────────────────────────────────────
  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const res = await updateSettings(settingsForm);
    setLoading(false);
    if (res.ok) {
      setSuccess("System preferences saved successfully!");
    } else {
      setError(res.message || "Failed to save preferences.");
    }
  };

  const userInitial = (session?.name || session?.username || "U")[0].toUpperCase();

  return (
    <div style={{ maxWidth: 980, margin: "0 auto", paddingBottom: 40 }}>
      {/* Top Header */}
      <div className="topbar">
        <div>
          <h1>Account & System Settings</h1>
          <p className="page-subtitle">
            Manage your personal profile, credentials, enterprise permissions, and fleet interface preferences.
          </p>
        </div>
      </div>

      {/* Feedback Alerts */}
      {success && (
        <div className="flash flash-success mt-10" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <CheckIcon size={16} color="#16A34A" />
          <span>{success}</span>
        </div>
      )}
      {error && (
        <div className="flash flash-error mt-10">
          <span>{error}</span>
        </div>
      )}

      {/* Profile Overview Banner */}
      <div
        className="card mt-14"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 20,
          padding: 24,
          background: "linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          {/* Large Avatar Badge */}
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)",
              color: "#ffffff",
              fontSize: "1.75rem",
              fontWeight: 800,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 8px 20px rgba(37, 99, 235, 0.28)",
              border: "3px solid #EFF6FF",
            }}
          >
            {userInitial}
          </div>

          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <h2 style={{ margin: 0, fontSize: "1.35rem", fontWeight: 800, color: "var(--text)" }}>
                {session?.name || session?.username}
              </h2>
              <span
                style={{
                  background: "#EFF6FF",
                  border: "1px solid #BFDBFE",
                  color: "#1D4ED8",
                  padding: "3px 10px",
                  borderRadius: 999,
                  fontSize: "0.74rem",
                  fontWeight: 700,
                }}
              >
                {session?.role}
              </span>
            </div>
            <div style={{ fontSize: "0.86rem", color: "var(--muted)", marginTop: 4 }}>
              {session?.email} · Username: <strong style={{ color: "#334155" }}>@{session?.username}</strong>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div style={{ textAlign: "right", fontSize: "0.82rem", color: "var(--muted)" }}>
            <div>Account Status</div>
            <strong style={{ color: "#16A34A" }}>Verified & Active</strong>
          </div>
        </div>
      </div>

      {/* Tab Navigation Pill Bar */}
      <div
        style={{
          display: "flex",
          gap: 8,
          marginTop: 20,
          borderBottom: "1px solid var(--border-color)",
          paddingBottom: 10,
        }}
      >
        <button
          type="button"
          onClick={() => { setActiveTab("profile"); setSuccess(""); setError(""); }}
          style={{
            border: "none",
            background: activeTab === "profile" ? "#2563EB" : "transparent",
            color: activeTab === "profile" ? "#ffffff" : "var(--text-secondary)",
            padding: "8px 16px",
            borderRadius: 8,
            fontSize: "0.88rem",
            fontWeight: 600,
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: 7,
            transition: "all 0.15s ease",
          }}
        >
          <UserIcon size={16} />
          <span>Profile Info</span>
        </button>

        <button
          type="button"
          onClick={() => { setActiveTab("security"); setSuccess(""); setError(""); }}
          style={{
            border: "none",
            background: activeTab === "security" ? "#2563EB" : "transparent",
            color: activeTab === "security" ? "#ffffff" : "var(--text-secondary)",
            padding: "8px 16px",
            borderRadius: 8,
            fontSize: "0.88rem",
            fontWeight: 600,
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: 7,
            transition: "all 0.15s ease",
          }}
        >
          <LockIcon size={16} />
          <span>Security & Password</span>
        </button>

        <button
          type="button"
          onClick={() => { setActiveTab("preferences"); setSuccess(""); setError(""); }}
          style={{
            border: "none",
            background: activeTab === "preferences" ? "#2563EB" : "transparent",
            color: activeTab === "preferences" ? "#ffffff" : "var(--text-secondary)",
            padding: "8px 16px",
            borderRadius: 8,
            fontSize: "0.88rem",
            fontWeight: 600,
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: 7,
            transition: "all 0.15s ease",
          }}
        >
          <GlobeIcon size={16} />
          <span>Fleet & System Preferences</span>
        </button>
      </div>

      {/* ── TAB 1: Profile Info Form ── */}
      {activeTab === "profile" && (
        <div className="form-card mt-14">
          <div style={{ marginBottom: 16 }}>
            <h3 style={{ margin: 0, fontSize: "1.1rem" }}>Edit Profile Information</h3>
            <p style={{ margin: "4px 0 0", fontSize: "0.84rem", color: "var(--muted)" }}>
              Update your account details and display information.
            </p>
          </div>

          <form onSubmit={handleProfileSubmit} className="form-grid">
            <div className="input-group">
              <label>Full Name</label>
              <input
                type="text"
                required
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                placeholder="e.g. John Doe"
              />
            </div>

            <div className="input-group">
              <label>Email Address</label>
              <input
                type="email"
                required
                value={profileForm.email}
                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                placeholder="e.g. user@fleetflow.io"
              />
            </div>

            <div className="input-group">
              <label>Contact Phone Number</label>
              <input
                type="text"
                value={profileForm.phone}
                onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                placeholder="e.g. +91 98765 43210"
              />
            </div>

            <div className="input-group">
              <label>Operational Department</label>
              <input
                type="text"
                value={profileForm.department}
                onChange={(e) => setProfileForm({ ...profileForm, department: e.target.value })}
                placeholder="e.g. North Freight Corridor Operations"
              />
            </div>

            <div className="input-group">
              <label>Assigned Enterprise Role</label>
              <input
                type="text"
                value={session?.role || "Fleet Member"}
                disabled
                style={{ background: "#F1F5F9", cursor: "not-allowed", color: "#64748B" }}
              />
              <span style={{ fontSize: "0.76rem", color: "var(--muted)", marginTop: 4 }}>
                Role is assigned by your Fleet Manager.
              </span>
            </div>

            <div className="input-group">
              <label>Account Username</label>
              <input
                type="text"
                value={session?.username || ""}
                disabled
                style={{ background: "#F1F5F9", cursor: "not-allowed", color: "#64748B" }}
              />
            </div>

            <div className="input-group col-span-full justify-end mt-10">
              <button type="submit" disabled={loading} style={{ minWidth: 150 }}>
                {loading ? "Saving Profile..." : "Save Profile Changes"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── TAB 2: Security & Password Form ── */}
      {activeTab === "security" && (
        <div className="form-card mt-14">
          <div style={{ marginBottom: 16 }}>
            <h3 style={{ margin: 0, fontSize: "1.1rem" }}>Update Account Password</h3>
            <p style={{ margin: "4px 0 0", fontSize: "0.84rem", color: "var(--muted)" }}>
              Ensure your account is protected with a strong, distinct password.
            </p>
          </div>

          <form onSubmit={handlePasswordSubmit} className="form-grid">
            <div className="input-group col-span-full">
              <label>Current Password</label>
              <input
                type="password"
                required
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                placeholder="Enter your current password"
              />
            </div>

            <div className="input-group">
              <label>New Password (min. 6 characters)</label>
              <input
                type="password"
                required
                minLength={6}
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                placeholder="Enter new secure password"
              />
            </div>

            <div className="input-group">
              <label>Confirm New Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                placeholder="Re-enter new secure password"
              />
            </div>

            <div className="input-group col-span-full justify-end mt-10">
              <button type="submit" disabled={loading} style={{ minWidth: 160 }}>
                {loading ? "Updating..." : "Update Password"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── TAB 3: Fleet & System Preferences ── */}
      {activeTab === "preferences" && (
        <div className="form-card mt-14">
          <div style={{ marginBottom: 16 }}>
            <h3 style={{ margin: 0, fontSize: "1.1rem" }}>Fleet & System Preferences</h3>
            <p style={{ margin: "4px 0 0", fontSize: "0.84rem", color: "var(--muted)" }}>
              Customize measurement metrics, currency indicators, and telemetry alerts.
            </p>
          </div>

          <form onSubmit={handleSettingsSubmit} className="form-grid">
            <div className="input-group">
              <label>Speed Unit</label>
              <select
                value={settingsForm.speed_unit}
                onChange={(e) => setSettingsForm({ ...settingsForm, speed_unit: e.target.value })}
              >
                <option value="km/h">Kilometers per hour (km/h)</option>
                <option value="mph">Miles per hour (mph)</option>
              </select>
            </div>

            <div className="input-group">
              <label>Distance Unit</label>
              <select
                value={settingsForm.distance_unit}
                onChange={(e) => setSettingsForm({ ...settingsForm, distance_unit: e.target.value })}
              >
                <option value="km">Kilometers (km)</option>
                <option value="miles">Miles (mi)</option>
              </select>
            </div>

            <div className="input-group">
              <label>Currency Symbol</label>
              <select
                value={settingsForm.currency}
                onChange={(e) => setSettingsForm({ ...settingsForm, currency: e.target.value })}
              >
                <option value="INR">Indian Rupee (₹)</option>
                <option value="USD">US Dollar ($)</option>
                <option value="EUR">Euro (€)</option>
              </select>
            </div>

            <div className="input-group">
              <label>Live Telemetry Refresh Rate</label>
              <select
                value={settingsForm.auto_refresh_sec}
                onChange={(e) => setSettingsForm({ ...settingsForm, auto_refresh_sec: Number(e.target.value) })}
              >
                <option value={15}>Every 15 Seconds (High Frequency)</option>
                <option value={30}>Every 30 Seconds (Recommended)</option>
                <option value={60}>Every 60 Seconds (Standard)</option>
              </select>
            </div>

            {/* Notification & Audio Toggles */}
            <div className="input-group col-span-full">
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 8 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontWeight: 500 }}>
                  <input
                    type="checkbox"
                    checked={settingsForm.email_alerts}
                    onChange={(e) => setSettingsForm({ ...settingsForm, email_alerts: e.target.checked })}
                    style={{ width: 18, height: 18, accentColor: "#2563EB" }}
                  />
                  <span>Receive Critical Road Hazard & Overweight Payload Email Alerts</span>
                </label>

                <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontWeight: 500 }}>
                  <input
                    type="checkbox"
                    checked={settingsForm.telemetry_sound}
                    onChange={(e) => setSettingsForm({ ...settingsForm, telemetry_sound: e.target.checked })}
                    style={{ width: 18, height: 18, accentColor: "#2563EB" }}
                  />
                  <span>Play Chime on Live Geofence Arrival / Deviation</span>
                </label>
              </div>
            </div>

            <div className="input-group col-span-full justify-end mt-10">
              <button type="submit" disabled={loading} style={{ minWidth: 160 }}>
                {loading ? "Saving..." : "Save Preferences"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
