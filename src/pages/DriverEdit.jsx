import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFleet } from "../fleetStore.jsx";

export default function DriverEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, editDriver } = useFleet();
  const driver = state.drivers.find((d) => d._id === id);
  const [form, setForm] = useState({});
  const [error, setError] = useState("");

  useEffect(() => { if (driver) setForm({ ...driver }); }, [driver]);
  if (!driver) return <p>Not found.</p>;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await editDriver(driver._id, form);
      navigate("/drivers");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="form-card">
      <h3>Edit Driver</h3>
      {error && <div className="flash flash-error">{error}</div>}
      <form onSubmit={handleSubmit} className="form-grid mt-10">
        <div className="input-group"><label>Name</label><input type="text" value={form.name || ""} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
        <div className="input-group"><label>License Number</label><input type="text" value={form.license_number || ""} onChange={(e) => setForm({ ...form, license_number: e.target.value })} /></div>
        <div className="input-group"><label>License Expiry Date</label><input type="date" value={form.license_expiry_date || ""} onChange={(e) => setForm({ ...form, license_expiry_date: e.target.value })} /></div>
        <div className="input-group"><label>Status</label>
          <select value={form.status || "Available"} onChange={(e) => setForm({ ...form, status: e.target.value })}>
            <option>Available</option><option>On Trip</option><option>Suspended</option>
          </select>
        </div>
        <div className="input-group justify-end"><label>&nbsp;</label><button type="submit">Save</button></div>
      </form>
    </div>
  );
}
