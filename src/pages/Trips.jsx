import { useState } from "react";
import { useFleet } from "../fleetStore.jsx";
import { TrashIcon } from "../components/Icons.jsx";

export default function Trips() {
  const { state, session, addTrip, updateTripStatus, deleteTrip } = useFleet();
  const [form, setForm] = useState({ vehicle_id: "", driver_id: "", cargo_weight: "", origin: "", destination: "", status: "Draft" });
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await addTrip({ ...form, cargo_weight: Number(form.cargo_weight) });
      setForm({ vehicle_id: "", driver_id: "", cargo_weight: "", origin: "", destination: "", status: "Draft" });
    } catch (err) {
      setError(err.message);
    }
  };

  // Helper: get vehicle/driver from trip (populated objects or IDs)
  const vehicleOf = (t) => typeof t.vehicle_id === "object" ? t.vehicle_id : state.vehicles.find((v) => v._id === String(t.vehicle_id));
  const driverOf  = (t) => typeof t.driver_id  === "object" ? t.driver_id  : state.drivers.find((d)  => d._id === String(t.driver_id));

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
              {state.vehicles.map((v) => <option key={v._id} value={v._id}>{v.license_plate} ({v.status})</option>)}
            </select>
          </div>
          <div className="input-group"><label>Driver</label>
            <select required value={form.driver_id} onChange={(e) => setForm({ ...form, driver_id: e.target.value })}>
              <option value="">Select driver</option>
              {state.drivers.map((d) => <option key={d._id} value={d._id}>{d.name} ({d.status})</option>)}
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
          <thead><tr><th>Vehicle</th><th>Driver</th><th>Cargo</th><th>Route</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {state.trips.length === 0 && <tr><td colSpan="6">No trips found.</td></tr>}
            {state.trips.map((t) => {
              const v = vehicleOf(t);
              const d = driverOf(t);
              return (
                <tr key={t._id}>
                  <td>{v?.license_plate}</td><td>{d?.name}</td><td>{t.cargo_weight} kg</td>
                  <td>{t.origin} → {t.destination}</td>
                  <td><span className={`badge status-${t.status.toLowerCase()}`}>{t.status}</span></td>
                  <td><div className="inline-actions">
                    <select defaultValue={t.status} onChange={(e) => updateTripStatus(t._id, e.target.value)}>
                      <option>Draft</option><option>Dispatched</option><option>Completed</option><option>Cancelled</option>
                    </select>
                    {session?.role === "Manager" && (
                      <button
                        type="button"
                        className="btn-action-symbol btn-action-delete"
                        title="Delete Trip"
                        onClick={() => window.confirm("Delete trip record?") && deleteTrip(t._id)}
                      >
                        <TrashIcon size={16} />
                      </button>
                    )}
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
