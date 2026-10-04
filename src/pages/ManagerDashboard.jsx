import { useFleet } from "../fleetStore.jsx";

export default function ManagerDashboard() {
  const { state, approveUser, rejectUser, deleteUser } = useFleet();
  const vehicles = state.vehicles;
  const activeFleet = vehicles.filter((v) => v.status === "On Trip").length;
  const inMaintenance = vehicles.filter((v) => v.status === "In Shop").length;
  const availableVehicles = vehicles.filter((v) => v.status === "Available").length;
  const pendingTrips = state.trips.filter((t) => t.status === "Draft").length;
  const expiredLicenses = state.drivers.filter((d) => new Date(d.license_expiry_date) < new Date()).length;
  const avgSafetyScore = state.drivers.length ? (state.drivers.reduce((s, d) => s + d.safety_score, 0) / state.drivers.length).toFixed(1) : 0;
  const totalOperationalCost = [...state.maintenance.map((m) => m.cost), ...state.fuel.map((f) => f.cost)].reduce((a, b) => a + Number(b), 0);
  const recentTrips = [...state.trips].sort((a, b) => b.id - a.id).slice(0, 8);
  const pendingRoleRequests = state.users.filter((u) => u.status === "pending" && u.role !== "Manager");
  const approvedRoleUsers = state.users.filter((u) => u.status === "approved" && u.role !== "Manager");

  const vehicleOf = (t) => vehicles.find((v) => v.id === Number(t.vehicle_id));
  const driverOf = (t) => state.drivers.find((d) => d.id === Number(t.driver_id));

  return (
    <>
      <div className="topbar">
        <div>
          <h1>Fleet Overview</h1>
          <p className="page-subtitle">Monitor operations, compliance, and dispatch health in one place.</p>
        </div>
      </div>
      <div className="grid-4">
        {[["Active Fleet", activeFleet], ["Vehicles In Maintenance", inMaintenance], ["Available Vehicles", availableVehicles], ["Pending Trips", pendingTrips], ["Expired Licenses", expiredLicenses], ["Average Safety Score", avgSafetyScore], ["Total Operational Cost", `₹${Math.round(totalOperationalCost)}`]].map(([label, value], i) => (
          <div className={`card metric-card${i === 0 ? " metric-card-highlight" : ""}`} key={label}>
            <div className="metric-head"><span>{label}</span></div>
            <div className="metric-value">{value}</div>
          </div>
        ))}
      </div>

      <div className="form-card mt-14">
        <h3>Role Requests</h3>
        <div className="table-wrap mt-10">
          <table>
            <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Actions</th></tr></thead>
            <tbody>
              {pendingRoleRequests.length === 0 && <tr><td colSpan="5">No pending requests.</td></tr>}
              {pendingRoleRequests.map((u) => (
                <tr key={u.id}>
                  <td>#{u.id}</td><td>{u.name || "-"}</td><td>{u.email || "-"}</td><td>{u.role}</td>
                  <td><div className="inline-actions">
                    <button className="secondary" onClick={() => approveUser(u.id)}>Approve</button>
                    <button className="danger" onClick={() => rejectUser(u.id)}>Reject</button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="form-card mt-14">
        <h3>Approved Role Users</h3>
        <div className="table-wrap mt-10">
          <table>
            <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Actions</th></tr></thead>
            <tbody>
              {approvedRoleUsers.length === 0 && <tr><td colSpan="5">None.</td></tr>}
              {approvedRoleUsers.map((u) => (
                <tr key={u.id}>
                  <td>#{u.id}</td><td>{u.name || "-"}</td><td>{u.email || "-"}</td><td>{u.role}</td>
                  <td><button className="danger" onClick={() => window.confirm("Remove user?") && deleteUser(u.id)}>Remove</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="form-card mt-14">
        <h3>Recent Trips</h3>
        <div className="table-wrap mt-10">
          <table>
            <thead><tr><th>ID</th><th>Route</th><th>Status</th><th>Vehicle</th><th>Driver</th></tr></thead>
            <tbody>
              {recentTrips.map((t) => (
                <tr key={t.id}>
                  <td>#{t.id}</td><td>{t.origin} → {t.destination}</td><td><span className={`badge status-${t.status.toLowerCase()}`}>{t.status}</span></td>
                  <td>{vehicleOf(t)?.license_plate || "-"}</td><td>{driverOf(t)?.name || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
