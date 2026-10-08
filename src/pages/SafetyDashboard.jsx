import { useState } from "react";
import { Link } from "react-router-dom";
import { useFleet } from "../fleetStore.jsx";

export default function SafetyDashboard() {
  const { state, updateDriverSafety } = useFleet();
  const [success, setSuccess] = useState("");

  const today = new Date();
  const expiredDrivers = state.drivers.filter((d) => new Date(d.license_expiry_date) < today);
  const expiringSoonDrivers = state.drivers.filter((d) => {
    const exp = new Date(d.license_expiry_date);
    const diffDays = Math.ceil((exp - today) / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 30;
  });
  const suspendedDrivers = state.drivers.filter((d) => d.status === "Suspended");
  const highRiskDrivers  = state.drivers.filter((d) => (d.safety_score || 0) < 70);

  const avgSafetyScore = state.drivers.length
    ? (state.drivers.reduce((s, d) => s + (d.safety_score || 0), 0) / state.drivers.length).toFixed(1)
    : 0;

  const handleQuickStatus = async (id, status) => {
    await updateDriverSafety(id, { status });
    setSuccess(`Driver status updated to ${status}.`);
    setTimeout(() => setSuccess(""), 3000);
  };

  const handleScoreUpdate = async (id, score) => {
    await updateDriverSafety(id, { safety_score: Number(score) });
    setSuccess(`Safety rating score adjusted to ${score}.`);
    setTimeout(() => setSuccess(""), 3000);
  };

  return (
    <>
      <div className="topbar">
        <div>
          <h1>Safety & Compliance Center</h1>
          <p className="page-subtitle">Monitor driver certifications, road safety compliance ratings, and license validity.</p>
        </div>
      </div>

      {success && <div className="flash flash-info mt-10">{success}</div>}

      {/* Safety KPIs */}
      <div className="grid-4">
        <div className="card metric-card">
          <div className="metric-head"><span>Average Safety Rating</span></div>
          <div className="metric-value" style={{ color: avgSafetyScore >= 80 ? "#16a34a" : "#dc2626" }}>
            {avgSafetyScore} / 100
          </div>
          <div style={{ marginTop: 6 }}>
            {avgSafetyScore >= 80 ? (
              <span className="badge status-high-safety-score">High Fleet Rating</span>
            ) : (
              <span className="badge status-low-safety-score">Needs Safety Intervention</span>
            )}
          </div>
        </div>

        <div className="card metric-card">
          <div className="metric-head"><span>Expired Licenses</span></div>
          <div className="metric-value" style={{ color: expiredDrivers.length > 0 ? "#dc2626" : "inherit" }}>
            {expiredDrivers.length}
          </div>
          <div style={{ marginTop: 6 }}>
            <span className={`badge ${expiredDrivers.length > 0 ? "status-expired" : "status-available"}`}>
              {expiredDrivers.length > 0 ? "Requires Immediate Renewal" : "All Compliant"}
            </span>
          </div>
        </div>

        <div className="card metric-card">
          <div className="metric-head"><span>Suspended / Inactive</span></div>
          <div className="metric-value">{suspendedDrivers.length}</div>
          <div style={{ marginTop: 6 }}>
            <span className="badge status-suspended">Grounding Orders Active</span>
          </div>
        </div>

        <div className="card metric-card">
          <div className="metric-head"><span>High-Risk Drivers (Score &lt; 70)</span></div>
          <div className="metric-value" style={{ color: highRiskDrivers.length > 0 ? "#dc2626" : "#16a34a" }}>
            {highRiskDrivers.length}
          </div>
          <div style={{ marginTop: 6 }}>
            <span className="badge status-low-safety-score">Coaching Scheduled</span>
          </div>
        </div>
      </div>

      {/* Urgent Compliance Alerts */}
      {(expiredDrivers.length > 0 || expiringSoonDrivers.length > 0) && (
        <div className="form-card mt-14" style={{ borderLeft: "4px solid #ef4444" }}>
          <h3 style={{ color: "#b91c1c" }}>Compliance Action Required</h3>
          <p className="page-subtitle" style={{ marginBottom: 10 }}>
            The following drivers have expired licenses or renewals due within 30 days. Disallowing dispatches is recommended.
          </p>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Driver Name</th>
                  <th>License Number</th>
                  <th>Expiry Date</th>
                  <th>Status</th>
                  <th>Quick Action</th>
                </tr>
              </thead>
              <tbody>
                {expiredDrivers.map((d) => (
                  <tr key={d._id}>
                    <td><strong>{d.name}</strong></td>
                    <td>{d.license_number}</td>
                    <td><span className="badge status-expired">Expired: {d.license_expiry_date}</span></td>
                    <td><span className={`badge status-${d.status.toLowerCase()}`}>{d.status}</span></td>
                    <td>
                      {d.status !== "Suspended" ? (
                        <button className="danger" onClick={() => handleQuickStatus(d._id, "Suspended")}>
                          Suspend Driver
                        </button>
                      ) : (
                        <span style={{ fontSize: "0.8rem", color: "#dc2626", fontWeight: 600 }}>Suspended</span>
                      )}
                    </td>
                  </tr>
                ))}
                {expiringSoonDrivers.map((d) => (
                  <tr key={d._id}>
                    <td><strong>{d.name}</strong></td>
                    <td>{d.license_number}</td>
                    <td><span className="badge badge-amber">Expiring Soon: {d.license_expiry_date}</span></td>
                    <td><span className={`badge status-${d.status.toLowerCase()}`}>{d.status}</span></td>
                    <td>
                      <span style={{ fontSize: "0.8rem", color: "#64748b" }}>Renewal Notice Sent</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Driver Safety Audit & Live Roster */}
      <div className="form-card mt-14">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h3>Driver Safety Audit & Performance Scores</h3>
            <p className="page-subtitle">Real-time safety ratings, license status, and instant compliance updates.</p>
          </div>
          <Link to="/safety/drivers">
            <button className="secondary">Open Detailed Compliance →</button>
          </Link>
        </div>

        <div className="table-wrap mt-10">
          <table>
            <thead>
              <tr>
                <th>Driver Name</th>
                <th>License #</th>
                <th>License Status</th>
                <th>Safety Score (0-100)</th>
                <th>Current Status</th>
                <th>Safety Controls</th>
              </tr>
            </thead>
            <tbody>
              {state.drivers.map((d) => {
                const expired = new Date(d.license_expiry_date) < today;
                return (
                  <tr key={d._id}>
                    <td><strong>{d.name}</strong></td>
                    <td>{d.license_number}</td>
                    <td>
                      {expired ? (
                        <span className="badge status-expired">Expired</span>
                      ) : (
                        <span className="badge status-available">Valid ({d.license_expiry_date})</span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontWeight: 600, minWidth: 32 }}>{d.safety_score}</span>
                        <div style={{ flex: 1, height: 8, background: "#e2e8f0", borderRadius: 4, minWidth: 80 }}>
                          <div
                            style={{
                              width: `${d.safety_score}%`,
                              height: "100%",
                              borderRadius: 4,
                              background: d.safety_score >= 80 ? "#16a34a" : d.safety_score >= 60 ? "#2563EB" : "#ef4444",
                            }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`badge status-${d.status.toLowerCase().replace(" ", "-")}`}>
                        {d.status}
                      </span>
                    </td>
                    <td>
                      <div className="inline-actions">
                        <select
                          defaultValue={d.status}
                          onChange={(e) => handleQuickStatus(d._id, e.target.value)}
                        >
                          <option value="Available">Available</option>
                          <option value="On Trip">On Trip</option>
                          <option value="Suspended">Suspended</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
