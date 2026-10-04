import { useState } from "react";
import { useFleet } from "../fleetStore.jsx";

export default function FinancialDashboard() {
  const { state, addFuel } = useFleet();
  const [form, setForm] = useState({ vehicle_id: "", liters: "", cost: "", date: "" });

  const totalFuelCost = state.fuel.reduce((s, f) => s + Number(f.cost), 0);
  const totalMaintenanceCost = state.maintenance.reduce((s, m) => s + Number(m.cost), 0);
  const completedTripCount = state.trips.filter((t) => t.status === "Completed").length;

  const costRows = state.vehicles.map((v) => {
    const fuelCost = state.fuel.filter((f) => String(f.vehicle_id) === String(v.id)).reduce((s, f) => s + Number(f.cost), 0);
    const mntCost = state.maintenance.filter((m) => String(m.vehicle_id) === String(v.id)).reduce((s, m) => s + Number(m.cost), 0);
    const completed = state.trips.filter((t) => String(t.vehicle_id) === String(v.id) && t.status === "Completed").length;
    const total = fuelCost + mntCost;
    return { ...v, fuelCost, mntCost, total, completed, costPerTrip: completed ? (total / completed).toFixed(0) : null };
  });

  const submit = (e) => {
    e.preventDefault();
    addFuel({ ...form, vehicle_id: Number(form.vehicle_id), liters: Number(form.liters), cost: Number(form.cost) });
    setForm({ vehicle_id: "", liters: "", cost: "", date: "" });
  };

  return (
    <>
      <div className="topbar"><h1>Financial Dashboard</h1></div>
      <div className="grid-4">
        <div className="card"><div>Total Fuel Cost</div><div className="metric-value">₹{Math.round(totalFuelCost)}</div></div>
        <div className="card"><div>Total Maintenance Cost</div><div className="metric-value">₹{Math.round(totalMaintenanceCost)}</div></div>
        <div className="card"><div>Total Operational Cost</div><div className="metric-value">₹{Math.round(totalFuelCost + totalMaintenanceCost)}</div></div>
        <div className="card"><div>Completed Trips</div><div className="metric-value">{completedTripCount}</div></div>
      </div>
      <div className="form-card mt-14">
        <h3>Add Fuel Log</h3>
        <form onSubmit={submit} className="form-grid mt-10">
          <div className="input-group"><label>Vehicle</label>
            <select required value={form.vehicle_id} onChange={(e) => setForm({ ...form, vehicle_id: e.target.value })}>
              <option value="">Select vehicle</option>
              {state.vehicles.map((v) => <option key={v.id} value={v.id}>{v.license_plate}</option>)}
            </select>
          </div>
          <div className="input-group"><label>Liters</label><input type="number" step="0.01" min="0.01" value={form.liters} required onChange={(e) => setForm({ ...form, liters: e.target.value })} /></div>
          <div className="input-group"><label>Cost</label><input type="number" step="0.01" min="0" value={form.cost} required onChange={(e) => setForm({ ...form, cost: e.target.value })} /></div>
          <div className="input-group"><label>Date</label><input type="date" value={form.date} required onChange={(e) => setForm({ ...form, date: e.target.value })} /></div>
          <div className="input-group justify-end"><label>&nbsp;</label><button type="submit">Add Fuel Log</button></div>
        </form>
      </div>
      <div className="table-wrap mt-14">
        <table>
          <thead><tr><th>Vehicle</th><th>Model</th><th>Fuel Cost</th><th>Maintenance Cost</th><th>Operational Cost</th><th>Completed Trips</th><th>Cost per Trip</th></tr></thead>
          <tbody>
            {costRows.map((r) => (
              <tr key={r.id}><td>{r.license_plate}</td><td>{r.model_name}</td><td>₹{Math.round(r.fuelCost)}</td><td>₹{Math.round(r.mntCost)}</td><td>₹{Math.round(r.total)}</td><td>{r.completed}</td><td>{r.costPerTrip ? `₹${r.costPerTrip}` : "N/A"}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
