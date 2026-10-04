import { useFleet } from "../fleetStore.jsx";

export default function SafetyDashboard() {
  const { state } = useFleet();
  const expiredLicenses = state.drivers.filter((d) => new Date(d.license_expiry_date) < new Date()).length;
  const suspendedDrivers = state.drivers.filter((d) => d.status === "Suspended").length;
  const avgSafetyScore = state.drivers.length ? (state.drivers.reduce((s, d) => s + d.safety_score, 0) / state.drivers.length).toFixed(1) : 0;

  return (
    <>
      <div className="topbar"><h1>Safety Dashboard</h1></div>
      <div className="grid-4">
        <div className="card"><div>Expired Licenses</div><div className="metric-value">{expiredLicenses}</div><span className="badge status-expired">Expired</span></div>
        <div className="card"><div>Suspended Drivers</div><div className="metric-value">{suspendedDrivers}</div><span className="badge status-suspended">Suspended</span></div>
        <div className="card"><div>Average Safety Score</div><div className="metric-value">{avgSafetyScore}</div>
          {avgSafetyScore >= 80 ? <span className="badge status-high-safety-score">High Safety Score</span> : <span className="badge status-low-safety-score">Low Safety Score</span>}
        </div>
      </div>
    </>
  );
}
