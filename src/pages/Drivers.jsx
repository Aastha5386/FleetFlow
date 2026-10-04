import { useState } from "react";
import { Link } from "react-router-dom";
import { useFleet } from "../fleetStore.jsx";

export default function Drivers() {
  const { state, session, addDriver, deleteDriver } = useFleet();
  const isManager = session?.role === "Manager";
  const [form, setForm] = useState({ name: "", license_number: "", license_expiry_date: "", status: "Available" });

  const submit = (e) => {
    e.preventDefault();
    addDriver({ ...form, safety_score: 75 });
    setForm({ name: "", license_number: "", license_expiry_date: "", status: "Available" });
  };

  return (
    <>
      <div className="topbar"><h1>Driver Management</h1></div>
      {isManager && (
        <div className="form-card">
          <h3>Add Driver</h3>
          <form onSubmit={submit} className="form-grid mt-10">
            <div className="input-group"><label>Name</label><input type="text" value={form.name} required onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div className="input-group"><label>License Number</label><input type="text" value={form.license_number} required onChange={(e) => setForm({ ...form, license_number: e.target.value })} /></div>
            <div className="input-group"><label>License Expiry Date</label><input type="date" value={form.license_expiry_date} required onChange={(e) => setForm({ ...form, license_expiry_date: e.target.value })} /></div>
            <div className="input-group"><label>Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option>Available</option><option>On Trip</option><option>Suspended</option>
              </select>
            </div>
            <div className="input-group justify-end"><label>&nbsp;</label><button type="submit">Create Driver</button></div>
          </form>
        </div>
      )}
      <div className="table-wrap">
        <table>
          <thead><tr><th>ID</th><th>Name</th><th>License #</th><th>Expiry</th><th>Status</th>{isManager && <th>Actions</th>}</tr></thead>
          <tbody>
            {state.drivers.length === 0 && <tr><td colSpan="6">No drivers found.</td></tr>}
            {state.drivers.map((d) => (
              <tr key={d.id}>
                <td>#{d.id}</td><td>{d.name}</td><td>{d.license_number}</td><td>{d.license_expiry_date}</td>
                <td><span className={`badge status-${d.status.toLowerCase().replace(" ", "-")}`}>{d.status}</span></td>
                {isManager && (
                  <td><div className="inline-actions">
                    <Link to={`/drivers/${d.id}/edit`}><button type="button" className="secondary">Edit</button></Link>
                    <button className="danger" onClick={() => window.confirm("Delete?") && deleteDriver(d.id)}>Delete</button>
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
