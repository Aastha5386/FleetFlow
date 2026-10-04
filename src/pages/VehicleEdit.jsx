import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFleet } from "../fleetStore.jsx";

export default function VehicleEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, editVehicle } = useFleet();
  const vehicle = state.vehicles.find((v) => v.id === Number(id));
  const [form, setForm] = useState({});
  useEffect(() => { if (vehicle) setForm({ ...vehicle }); }, [vehicle]);
  if (!vehicle) return <p>Not found.</p>;
  return (
    <div className="form-card">
      <h3>Edit Vehicle</h3>
      <form onSubmit={(e) => { e.preventDefault(); editVehicle(vehicle.id, { ...form, max_capacity_kg: Number(form.max_capacity_kg), odometer: Number(form.odometer) }); navigate("/vehicles"); }} className="form-grid mt-10">
        <div className="input-group"><label>Model Name</label><input type="text" value={form.model_name || ""} onChange={(e) => setForm({ ...form, model_name: e.target.value })} /></div>
        <div className="input-group"><label>License Plate</label><input type="text" value={form.license_plate || ""} onChange={(e) => setForm({ ...form, license_plate: e.target.value })} /></div>
        <div className="input-group"><label>Max Capacity (kg)</label><input type="number" step="0.01" value={form.max_capacity_kg ?? ""} onChange={(e) => setForm({ ...form, max_capacity_kg: e.target.value })} /></div>
        <div className="input-group"><label>Odometer</label><input type="number" value={form.odometer ?? ""} onChange={(e) => setForm({ ...form, odometer: e.target.value })} /></div>
        <div className="input-group"><label>Status</label>
          <select value={form.status || "Available"} onChange={(e) => setForm({ ...form, status: e.target.value })}>
            <option>Available</option><option>On Trip</option><option>In Shop</option>
          </select>
        </div>
        <div className="input-group justify-end"><label>&nbsp;</label><button type="submit">Save</button></div>
      </form>
    </div>
  );
}
