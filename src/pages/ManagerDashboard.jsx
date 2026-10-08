import { useFleet } from "../fleetStore.jsx";
import { CheckIcon, XMarkIcon, TrashIcon } from "../components/Icons.jsx";

export default function ManagerDashboard() {
  const { state, approveUser, rejectUser, deleteUser } = useFleet();
  const vehicles = state.vehicles;
  const activeFleet        = vehicles.filter((v) => v.status === "On Trip").length;
  const inMaintenance      = vehicles.filter((v) => v.status === "In Shop").length;
  const availableVehicles  = vehicles.filter((v) => v.status === "Available").length;
  const pendingTrips       = state.trips.filter((t) => t.status === "Draft").length;
  const expiredLicenses    = state.drivers.filter((d) => new Date(d.license_expiry_date) < new Date()).length;
  const avgSafetyScore     = state.drivers.length
    ? (state.drivers.reduce((s, d) => s + (d.safety_score || 0), 0) / state.drivers.length).toFixed(1)
    : 0;
  const totalOperationalCost = [
    ...state.maintenance.map((m) => Number(m.cost)),
    ...state.fuel.map((f) => Number(f.cost)),
  ].reduce((a, b) => a + b, 0);

  const recentTrips        = [...state.trips].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 8);
  const pendingRoleRequests = state.users.filter((u) => u.status === "pending");
  const approvedRoleUsers   = state.users.filter((u) => u.status === "approved");

  // trips now have vehicle_id and driver_id populated as objects
  const vehicleOf = (t) => typeof t.vehicle_id === "object" ? t.vehicle_id : vehicles.find((v) => v._id === String(t.vehicle_id));
  const driverOf  = (t) => typeof t.driver_id  === "object" ? t.driver_id  : state.drivers.find((d) => d._id === String(t.driver_id));

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
            <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Actions</th></tr></thead>
            <tbody>
              {pendingRoleRequests.length === 0 && <tr><td colSpan="4">No pending requests.</td></tr>}
              {pendingRoleRequests.map((u) => (
                <tr key={u._id}>
                  <td>{u.name || "-"}</td><td>{u.email || "-"}</td><td>{u.role}</td>
                  <td><div className="inline-actions">
                    <button className="btn-action-symbol btn-action-check" title="Approve Request" onClick={() => approveUser(u._id)}><CheckIcon size={15} /></button>
                    <button className="btn-action-symbol btn-action-cancel" title="Reject Request" onClick={() => rejectUser(u._id)}><XMarkIcon size={15} /></button>
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
            <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Actions</th></tr></thead>
            <tbody>
              {approvedRoleUsers.length === 0 && <tr><td colSpan="4">None.</td></tr>}
              {approvedRoleUsers.map((u) => (
                <tr key={u._id}>
                  <td>{u.name || "-"}</td><td>{u.email || "-"}</td><td>{u.role}</td>
                  <td>
                    <button className="btn-action-symbol btn-action-delete" title="Remove User" onClick={() => window.confirm("Remove user?") && deleteUser(u._id)}>
                      <TrashIcon size={15} />
                    </button>
                  </td>
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
            <thead><tr><th>Route</th><th>Status</th><th>Vehicle</th><th>Driver</th></tr></thead>
            <tbody>
              {recentTrips.map((t) => (
                <tr key={t._id}>
                  <td>{t.origin} → {t.destination}</td>
                  <td><span className={`badge status-${t.status.toLowerCase()}`}>{t.status}</span></td>
                  <td>{vehicleOf(t)?.license_plate || "-"}</td>
                  <td>{driverOf(t)?.name || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
