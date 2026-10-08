import { useState } from "react";
import { Link } from "react-router-dom";
import { useFleet } from "../fleetStore.jsx";
import { PencilIcon, TrashIcon } from "../components/Icons.jsx";

export default function Vehicles() {
  const { state, session, addVehicle, deleteVehicle } = useFleet();
  const isManager = session?.role === "Manager";
  const [form, setForm] = useState({ model_name: "", license_plate: "", max_capacity_kg: "", odometer: "", status: "Available" });
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await addVehicle({ ...form, max_capacity_kg: Number(form.max_capacity_kg), odometer: Number(form.odometer) });
      setForm({ model_name: "", license_plate: "", max_capacity_kg: "", odometer: "", status: "Available" });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <div className="topbar"><h1>Vehicle Management</h1></div>
      {error && <div className="flash flash-error">{error}</div>}
      {isManager && (
        <div className="form-card">
          <h3>Add Vehicle</h3>
          <form onSubmit={submit} className="form-grid mt-10">
            <div className="input-group"><label>Model Name</label><input type="text" value={form.model_name} required onChange={(e) => setForm({ ...form, model_name: e.target.value })} /></div>
            <div className="input-group"><label>License Plate</label><input type="text" value={form.license_plate} required onChange={(e) => setForm({ ...form, license_plate: e.target.value })} /></div>
            <div className="input-group"><label>Max Capacity (kg)</label><input type="number" step="0.01" value={form.max_capacity_kg} required onChange={(e) => setForm({ ...form, max_capacity_kg: e.target.value })} /></div>
            <div className="input-group"><label>Odometer</label><input type="number" value={form.odometer} required onChange={(e) => setForm({ ...form, odometer: e.target.value })} /></div>
            <div className="input-group"><label>Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option>Available</option><option>On Trip</option><option>In Shop</option>
              </select>
            </div>
            <div className="input-group justify-end"><label>&nbsp;</label><button type="submit">Create Vehicle</button></div>
          </form>
        </div>
      )}
      <div className="table-wrap">
        <table>
          <thead><tr><th>Model</th><th>Plate</th><th>Capacity (kg)</th><th>Odometer</th><th>Status</th>{isManager && <th>Actions</th>}</tr></thead>
          <tbody>
            {state.vehicles.length === 0 && <tr><td colSpan="6">No vehicles found.</td></tr>}
            {state.vehicles.map((v) => (
              <tr key={v._id}>
                <td>{v.model_name}</td><td>{v.license_plate}</td><td>{v.max_capacity_kg}</td><td>{v.odometer}</td>
                <td><span className={`badge status-${v.status.toLowerCase().replace(" ", "-")}`}>{v.status}</span></td>
                {isManager && (
                  <td><div className="inline-actions">
                    <Link to={`/vehicles/${v._id}/edit`} className="btn-action-symbol btn-action-edit" title="Edit Vehicle">
                      <PencilIcon size={16} />
                    </Link>
                    <button
                      type="button"
                      className="btn-action-symbol btn-action-delete"
                      title="Delete Vehicle"
                      onClick={() => window.confirm("Delete vehicle record?") && deleteVehicle(v._id)}
                    >
                      <TrashIcon size={16} />
                    </button>
                  </div></td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
