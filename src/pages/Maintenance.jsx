import { useState } from "react";
import { useFleet } from "../fleetStore.jsx";

export default function Maintenance() {
  const { state, addMaintenance } = useFleet();
  const [form, setForm] = useState({ vehicle_id: "", cost: "", date: "", description: "" });
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await addMaintenance({ ...form, cost: Number(form.cost) });
      setForm({ vehicle_id: "", cost: "", date: "", description: "" });
    } catch (err) {
      setError(err.message);
    }
  };

  // vehicle_id on maintenance records is a populated object or id string
  const vehicleOf = (m) => typeof m.vehicle_id === "object" ? m.vehicle_id : state.vehicles.find((v) => v._id === String(m.vehicle_id));

  return (
    <>
      <div className="topbar"><h1>Maintenance Module</h1></div>
      {error && <div className="flash flash-error">{error}</div>}
      <div className="form-card">
        <h3>Create Maintenance Log</h3>
        <form onSubmit={submit} className="form-grid mt-10">
          <div className="input-group"><label>Vehicle</label>
            <select required value={form.vehicle_id} onChange={(e) => setForm({ ...form, vehicle_id: e.target.value })}>
              <option value="">Select vehicle</option>
              {state.vehicles.map((v) => <option key={v._id} value={v._id}>{v.license_plate} ({v.status})</option>)}
            </select>
          </div>
          <div className="input-group"><label>Cost</label><input type="number" step="0.01" value={form.cost} required onChange={(e) => setForm({ ...form, cost: e.target.value })} /></div>
          <div className="input-group"><label>Date</label><input type="date" value={form.date} required onChange={(e) => setForm({ ...form, date: e.target.value })} /></div>
          <div className="input-group col-span-full"><label>Description</label><textarea value={form.description} required onChange={(e) => setForm({ ...form, description: e.target.value })}></textarea></div>
          <div className="input-group justify-end"><label>&nbsp;</label><button type="submit">Create Log</button></div>
        </form>
      </div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Vehicle</th><th>Description</th><th>Cost</th><th>Date</th></tr></thead>
          <tbody>
            {state.maintenance.length === 0 && <tr><td colSpan="4">No maintenance logs found.</td></tr>}
            {state.maintenance.map((m) => {
              const v = vehicleOf(m);
              return <tr key={m._id}><td>{v?.license_plate}</td><td>{m.description}</td><td>₹{m.cost}</td><td>{m.date}</td></tr>;
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
