import { useState } from "react";
import { useFleet } from "../fleetStore.jsx";

export default function Trips() {
  const { state, session, addTrip, updateTripStatus, deleteTrip } = useFleet();
  const [form, setForm] = useState({ vehicle_id: "", driver_id: "", cargo_weight: "", origin: "", destination: "", status: "Draft" });
  const [error, setError] = useState("");

  const submit = (e) => {
    e.preventDefault();
    setError("");
    const vehicle = state.vehicles.find((v) => v.id === Number(form.vehicle_id));
    const driver = state.drivers.find((d) => d.id === Number(form.driver_id));
    if (!vehicle || !driver) return setError("Select vehicle and driver");
    if (Number(form.cargo_weight) > vehicle.max_capacity_kg) return setError(`Cargo exceeds vehicle capacity (${vehicle.max_capacity_kg} kg)`);
    if (driver.status === "Suspended") return setError("Suspended driver cannot be assigned");
    if (new Date(driver.license_expiry_date) < new Date()) return setError("Driver license is expired");
    if (vehicle.status === "In Shop") return setError("Vehicle is in maintenance");
    addTrip({ ...form, vehicle_id: Number(form.vehicle_id), driver_id: Number(form.driver_id), cargo_weight: Number(form.cargo_weight) });
    setForm({ vehicle_id: "", driver_id: "", cargo_weight: "", origin: "", destination: "", status: "Draft" });
  };

  return (
    <>
      <div className="topbar"><h1>Trip Management</h1></div>
      {error && <div className="flash flash-error">{error}</div>}
      <div className="form-card">
        <h3>Create Trip</h3>
        <form onSubmit={submit} className="form-grid mt-10">
          <div className="input-group"><label>Vehicle</label>
            <select required value={form.vehicle_id} onChange={(e) => setForm({ ...form, vehicle_id: e.target.value })}>
              <option value="">Select vehicle</option>
              {state.vehicles.map((v) => <option key={v.id} value={v.id}>{v.license_plate} ({v.status})</option>)}
            </select>
          </div>
          <div className="input-group"><label>Driver</label>
            <select required value={form.driver_id} onChange={(e) => setForm({ ...form, driver_id: e.target.value })}>
              <option value="">Select driver</option>
              {state.drivers.map((d) => <option key={d.id} value={d.id}>{d.name} ({d.status})</option>)}
            </select>
          </div>
          <div className="input-group"><label>Cargo Weight (kg)</label><input type="number" step="0.01" value={form.cargo_weight} required onChange={(e) => setForm({ ...form, cargo_weight: e.target.value })} /></div>
          <div className="input-group"><label>Origin</label><input type="text" value={form.origin} required onChange={(e) => setForm({ ...form, origin: e.target.value })} /></div>
          <div className="input-group"><label>Destination</label><input type="text" value={form.destination} required onChange={(e) => setForm({ ...form, destination: e.target.value })} /></div>
          <div className="input-group"><label>Status</label>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option>Draft</option><option>Dispatched</option><option>Completed</option><option>Cancelled</option>
            </select>
          </div>
          <div className="input-group justify-end"><label>&nbsp;</label><button type="submit">Create Trip</button></div>
        </form>
      </div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>ID</th><th>Vehicle</th><th>Driver</th><th>Cargo</th><th>Route</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {state.trips.length === 0 && <tr><td colSpan="7">No trips found.</td></tr>}
            {state.trips.map((t) => {
              const v = state.vehicles.find((x) => x.id === Number(t.vehicle_id));
              const d = state.drivers.find((x) => x.id === Number(t.driver_id));
              return (
                <tr key={t.id}>
                  <td>#{t.id}</td><td>{v?.license_plate}</td><td>{d?.name}</td><td>{t.cargo_weight} kg</td>
                  <td>{t.origin} → {t.destination}</td>
                  <td><span className={`badge status-${t.status.toLowerCase()}`}>{t.status}</span></td>
                  <td><div className="inline-actions">
                    <select defaultValue={t.status} onChange={(e) => updateTripStatus(t.id, e.target.value)}>
                      <option>Draft</option><option>Dispatched</option><option>Completed</option><option>Cancelled</option>
                    </select>
                    {session?.role === "Manager" && <button className="danger" onClick={() => window.confirm("Delete?") && deleteTrip(t.id)}>Delete</button>}
                  </div></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
