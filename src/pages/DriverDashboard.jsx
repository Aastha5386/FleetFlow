import { useState } from "react";
import { useFleet } from "../fleetStore.jsx";

export default function DriverDashboard() {
  const { state, session, updateTripStatus, updateDriverSafety, addFuel, addMaintenance } = useFleet();

  // Find this driver's record
  const currentDriver = state.drivers.find(
    (d) =>
      d._id === session?.driver_id ||
      d.name?.toLowerCase().includes(session?.name?.toLowerCase() || "") ||
      d.name?.toLowerCase().includes(session?.username?.toLowerCase() || "")
  ) || state.drivers[0] || { name: session?.name || "Driver", license_number: "DL-2024-001", license_expiry_date: "2028-12-31", status: "Available", safety_score: 85 };

  // Filter trips for this driver
  const myTrips = state.trips.filter((t) => {
    const dId = typeof t.driver_id === "object" ? t.driver_id._id : t.driver_id;
    return dId === currentDriver._id || dId === session?.driver_id;
  });

  const activeTrip = myTrips.find((t) => t.status === "Dispatched" || t.status === "Draft");
  
  // Find vehicle currently assigned to active trip or default
  const assignedVehicle = activeTrip
    ? (typeof activeTrip.vehicle_id === "object" ? activeTrip.vehicle_id : state.vehicles.find(v => v._id === activeTrip.vehicle_id))
    : state.vehicles.find(v => v.status === "On Trip" || v.status === "Available");

  // Local state for actions
  const [dutyStatus, setDutyStatus] = useState(currentDriver.status || "Available");
  const [fuelForm, setFuelForm] = useState({ liters: "", cost: "", date: new Date().toISOString().slice(0, 10) });
  const [fuelMsg, setFuelMsg] = useState("");
  const [maintForm, setMaintForm] = useState({ description: "", cost: "", date: new Date().toISOString().slice(0, 10) });
  const [maintMsg, setMaintMsg] = useState("");

  const handleStatusChange = async (newStatus) => {
    setDutyStatus(newStatus);
    if (currentDriver._id) {
      await updateDriverSafety(currentDriver._id, { status: newStatus });
    }
  };

  const handleFuelSubmit = async (e) => {
    e.preventDefault();
    if (!assignedVehicle) return;
    try {
      await addFuel({
        vehicle_id: assignedVehicle._id,
        liters: Number(fuelForm.liters),
        cost: Number(fuelForm.cost),
        date: fuelForm.date,
      });
      setFuelMsg("Fuel expense logged successfully!");
      setFuelForm({ liters: "", cost: "", date: new Date().toISOString().slice(0, 10) });
      setTimeout(() => setFuelMsg(""), 3000);
    } catch (err) {
      setFuelMsg("Error: " + err.message);
    }
  };

  const handleMaintSubmit = async (e) => {
    e.preventDefault();
    if (!assignedVehicle) return;
    try {
      await addMaintenance({
        vehicle_id: assignedVehicle._id,
        description: maintForm.description,
        cost: Number(maintForm.cost || 0),
        date: maintForm.date,
      });
      setMaintMsg("Maintenance issue reported! Vehicle marked In Shop.");
      setMaintForm({ description: "", cost: "", date: new Date().toISOString().slice(0, 10) });
      setTimeout(() => setMaintMsg(""), 3000);
    } catch (err) {
      setMaintMsg("Error: " + err.message);
    }
  };

  const isExpired = new Date(currentDriver.license_expiry_date) < new Date();

  return (
    <>
      <div className="topbar">
        <div>
          <h1>Driver Operations Portal</h1>
          <p className="page-subtitle">Welcome back, {currentDriver.name}. View assigned routes, trip schedules, vehicle health, and log on-road expenses.</p>
        </div>
      </div>

      {/* Driver Status & KPI Strip */}
      <div className="grid-4">
        <div className="card metric-card metric-card-highlight">
          <div className="metric-head"><span>Duty Status</span></div>
          <div className="metric-value" style={{ fontSize: "1.3rem", marginTop: 4 }}>
            <span className={`badge status-${(dutyStatus || "Available").toLowerCase().replace(" ", "-")}`}>
              {dutyStatus}
            </span>
          </div>
          <div className="mt-10" style={{ display: "flex", gap: 6 }}>
            <button
              className={dutyStatus === "Available" ? "" : "secondary"}
              style={{ fontSize: "0.78rem", padding: "4px 8px" }}
              onClick={() => handleStatusChange("Available")}
            >
              Available
            </button>
            <button
              className={dutyStatus === "On Trip" ? "" : "secondary"}
              style={{ fontSize: "0.78rem", padding: "4px 8px" }}
              onClick={() => handleStatusChange("On Trip")}
            >
              On Trip
            </button>
            <button
              className={dutyStatus === "Suspended" ? "danger" : "secondary"}
              style={{ fontSize: "0.78rem", padding: "4px 8px" }}
              onClick={() => handleStatusChange("Suspended")}
            >
              Off Duty
            </button>
          </div>
        </div>

        <div className="card metric-card">
          <div className="metric-head"><span>Safety Score</span></div>
          <div className="metric-value" style={{ color: currentDriver.safety_score >= 80 ? "#16a34a" : "#2563EB" }}>
            {currentDriver.safety_score || 75} / 100
          </div>
          <div style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: 6 }}>
            {currentDriver.safety_score >= 80 ? "Certified Safe Driver" : "Safety review suggested"}
          </div>
        </div>

        <div className="card metric-card">
          <div className="metric-head"><span>License Compliance</span></div>
          <div className="metric-value" style={{ fontSize: "1.1rem", marginTop: 4 }}>
            {currentDriver.license_number}
          </div>
          <div style={{ fontSize: "0.8rem", marginTop: 6 }}>
            {isExpired ? (
              <span className="badge status-expired">Expired: {currentDriver.license_expiry_date}</span>
            ) : (
              <span className="badge status-available">Valid until {currentDriver.license_expiry_date}</span>
            )}
          </div>
        </div>

        <div className="card metric-card">
          <div className="metric-head"><span>Completed Trips</span></div>
          <div className="metric-value">
            {myTrips.filter((t) => t.status === "Completed").length}
          </div>
          <div style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: 6 }}>
            Total missions completed
          </div>
        </div>
      </div>

      {/* Assigned Vehicle Card */}
      <div className="form-card mt-14">
        <h3>Currently Assigned Vehicle</h3>
        {assignedVehicle ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginTop: 12 }}>
            <div style={{ padding: "12px", background: "#ffffff", borderRadius: "10px", border: "1px solid var(--border-color, #E2E8F0)", borderTop: "3px solid #2563EB" }}>
              <div style={{ fontSize: "0.8rem", color: "var(--muted, #64748B)", fontWeight: 500 }}>Vehicle Model</div>
              <div style={{ fontWeight: 700, fontSize: "1.1rem", marginTop: 2, color: "var(--text, #0F172A)" }}>{assignedVehicle.model_name}</div>
            </div>
            <div style={{ padding: "12px", background: "#ffffff", borderRadius: "10px", border: "1px solid var(--border-color, #E2E8F0)", borderTop: "3px solid #10B981" }}>
              <div style={{ fontSize: "0.8rem", color: "var(--muted, #64748B)", fontWeight: 500 }}>License Plate</div>
              <div style={{ fontWeight: 700, fontSize: "1.1rem", marginTop: 2, color: "var(--text, #0F172A)" }}>{assignedVehicle.license_plate}</div>
            </div>
            <div style={{ padding: "12px", background: "#ffffff", borderRadius: "10px", border: "1px solid var(--border-color, #E2E8F0)", borderTop: "3px solid #4F46E5" }}>
              <div style={{ fontSize: "0.8rem", color: "var(--muted, #64748B)", fontWeight: 500 }}>Max Payload Capacity</div>
              <div style={{ fontWeight: 700, fontSize: "1.1rem", marginTop: 2, color: "var(--text, #0F172A)" }}>{assignedVehicle.max_capacity_kg} kg</div>
            </div>
            <div style={{ padding: "12px", background: "#ffffff", borderRadius: "10px", border: "1px solid var(--border-color, #E2E8F0)", borderTop: "3px solid #6366F1" }}>
              <div style={{ fontSize: "0.8rem", color: "var(--muted, #64748B)", fontWeight: 500 }}>Odometer</div>
              <div style={{ fontWeight: 700, fontSize: "1.1rem", marginTop: 2, color: "var(--text, #0F172A)" }}>{assignedVehicle.odometer?.toLocaleString()} km</div>
            </div>
          </div>
        ) : (
          <p style={{ color: "var(--muted)", marginTop: 8 }}>No vehicle currently dispatched to your account.</p>
        )}
      </div>

      {/* My Trips List */}
      <div className="form-card mt-14">
        <h3>My Assigned Trips & Missions</h3>
        <div className="table-wrap mt-10">
          <table>
            <thead>
              <tr>
                <th>Route</th>
                <th>Vehicle</th>
                <th>Cargo (kg)</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {myTrips.length === 0 && (
                <tr>
                  <td colSpan="5">No trips currently assigned to your driver profile.</td>
                </tr>
              )}
              {myTrips.map((t) => {
                const v = typeof t.vehicle_id === "object" ? t.vehicle_id : state.vehicles.find((x) => x._id === t.vehicle_id);
                return (
                  <tr key={t._id}>
                    <td>
                      <strong>{t.origin}</strong> → <strong>{t.destination}</strong>
                    </td>
                    <td>{v?.license_plate || "-"} ({v?.model_name || ""})</td>
                    <td>{t.cargo_weight} kg</td>
                    <td>
                      <span className={`badge status-${t.status.toLowerCase()}`}>{t.status}</span>
                    </td>
                    <td>
                      <div className="inline-actions">
                        {t.status === "Draft" && (
                          <button
                            type="button"
                            onClick={() => updateTripStatus(t._id, "Dispatched")}
                          >
                            Start Trip
                          </button>
                        )}
                        {t.status === "Dispatched" && (
                          <button
                            type="button"
                            className="secondary"
                            onClick={() => updateTripStatus(t._id, "Completed")}
                          >
                            Mark Completed
                          </button>
                        )}
                        {t.status === "Completed" && (
                          <span style={{ fontSize: "0.82rem", color: "#16a34a", fontWeight: 600 }}>Completed</span>
                        )}
                        {t.status === "Cancelled" && (
                          <span style={{ fontSize: "0.82rem", color: "#dc2626" }}>Cancelled</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Action Forms: Fuel & Report Issue */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16, marginTop: 16 }}>
        {/* Log Fuel */}
        <div className="form-card">
          <h3>Log Fuel Fill-up</h3>
          <p className="page-subtitle" style={{ marginBottom: 12 }}>Record fuel purchase on the road for your assigned vehicle.</p>
          {fuelMsg && <div className={`flash ${fuelMsg.includes("Error") ? "flash-error" : "flash-info"}`}>{fuelMsg}</div>}
          <form onSubmit={handleFuelSubmit}>
            <div className="input-group">
              <label>Liters Added</label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                required
                value={fuelForm.liters}
                onChange={(e) => setFuelForm({ ...fuelForm, liters: e.target.value })}
                placeholder="e.g. 35.5"
              />
            </div>
            <div className="input-group mt-10">
              <label>Total Cost (₹)</label>
              <input
                type="number"
                step="1"
                min="1"
                required
                value={fuelForm.cost}
                onChange={(e) => setFuelForm({ ...fuelForm, cost: e.target.value })}
                placeholder="e.g. 3400"
              />
            </div>
            <div className="input-group mt-10">
              <label>Date</label>
              <input
                type="date"
                required
                value={fuelForm.date}
                onChange={(e) => setFuelForm({ ...fuelForm, date: e.target.value })}
              />
            </div>
            <button type="submit" className="mt-14 w-full">Submit Fuel Receipt</button>
          </form>
        </div>

        {/* Report Maintenance Issue */}
        <div className="form-card">
          <h3>Report Vehicle Issue / Maintenance</h3>
          <p className="page-subtitle" style={{ marginBottom: 12 }}>Flag a mechanical fault, tire issue, or scheduled service request.</p>
          {maintMsg && <div className={`flash ${maintMsg.includes("Error") ? "flash-error" : "flash-info"}`}>{maintMsg}</div>}
          <form onSubmit={handleMaintSubmit}>
            <div className="input-group">
              <label>Issue Description</label>
              <textarea
                required
                rows="3"
                value={maintForm.description}
                onChange={(e) => setMaintForm({ ...maintForm, description: e.target.value })}
                placeholder="e.g. Unusual brake noise, coolant temperature high..."
              ></textarea>
            </div>
            <div className="input-group mt-10">
              <label>Estimated Repair Cost (₹) (Optional)</label>
              <input
                type="number"
                min="0"
                value={maintForm.cost}
                onChange={(e) => setMaintForm({ ...maintForm, cost: e.target.value })}
                placeholder="0"
              />
            </div>
            <div className="input-group mt-10">
              <label>Date</label>
              <input
                type="date"
                required
                value={maintForm.date}
                onChange={(e) => setMaintForm({ ...maintForm, date: e.target.value })}
              />
            </div>
            <button type="submit" className="mt-14 w-full danger">Report & Send to Shop</button>
          </form>
        </div>
      </div>
    </>
  );
}
