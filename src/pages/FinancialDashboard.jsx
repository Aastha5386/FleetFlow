import { useState } from "react";
import { useFleet } from "../fleetStore.jsx";

export default function FinancialDashboard() {
  const { state, addFuel } = useFleet();
  const [form, setForm] = useState({ vehicle_id: "", liters: "", cost: "", date: "" });
  const [error, setError] = useState("");

  const totalFuelCost        = state.fuel.reduce((s, f) => s + Number(f.cost), 0);
  const totalMaintenanceCost = state.maintenance.reduce((s, m) => s + Number(m.cost), 0);
  const completedTripCount   = state.trips.filter((t) => t.status === "Completed").length;

  const getVehicleId = (record) =>
    typeof record.vehicle_id === "object" ? record.vehicle_id._id : String(record.vehicle_id);

  const costRows = state.vehicles.map((v) => {
    const vId = v._id;
    const fuelCost  = state.fuel.filter((f) => getVehicleId(f) === vId).reduce((s, f) => s + Number(f.cost), 0);
    const mntCost   = state.maintenance.filter((m) => getVehicleId(m) === vId).reduce((s, m) => s + Number(m.cost), 0);
    const completed = state.trips.filter((t) => {
      const tripVId = typeof t.vehicle_id === "object" ? t.vehicle_id._id : String(t.vehicle_id);
      return tripVId === vId && t.status === "Completed";
    }).length;
    const total = fuelCost + mntCost;
    return { ...v, fuelCost, mntCost, total, completed, costPerTrip: completed ? (total / completed).toFixed(0) : null };
  });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await addFuel({ ...form, liters: Number(form.liters), cost: Number(form.cost) });
      setForm({ vehicle_id: "", liters: "", cost: "", date: "" });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <div className="topbar"><h1>Financial Dashboard</h1></div>
      {error && <div className="flash flash-error">{error}</div>}
      <div className="grid-4">
        <div className="card"><div>Total Fuel Cost</div><div className="metric-value">₹{Math.round(totalFuelCost).toLocaleString("en-IN")}</div></div>
        <div className="card"><div>Total Maintenance Cost</div><div className="metric-value">₹{Math.round(totalMaintenanceCost).toLocaleString("en-IN")}</div></div>
        <div className="card"><div>Total Operational Cost</div><div className="metric-value">₹{Math.round(totalFuelCost + totalMaintenanceCost).toLocaleString("en-IN")}</div></div>
        <div className="card"><div>Completed Trips</div><div className="metric-value">{completedTripCount.toLocaleString("en-IN")}</div></div>
      </div>
      <div className="form-card mt-14">
        <h3>Add Fuel Log</h3>
        <form onSubmit={submit} className="form-grid mt-10">
          <div className="input-group"><label>Vehicle</label>
            <select required value={form.vehicle_id} onChange={(e) => setForm({ ...form, vehicle_id: e.target.value })}>
              <option value="">Select vehicle</option>
              {state.vehicles.map((v) => <option key={v._id} value={v._id}>{v.license_plate}</option>)}
            </select>
          </div>
          <div className="input-group"><label>Liters</label><input type="number" step="0.01" min="0.01" value={form.liters} required onChange={(e) => setForm({ ...form, liters: e.target.value })} /></div>
          <div className="input-group"><label>Cost</label><input type="number" step="0.01" min="0" value={form.cost} required onChange={(e) => setForm({ ...form, cost: e.target.value })} /></div>
          <div className="input-group"><label>Date</label><input type="date" value={form.date} required onChange={(e) => setForm({ ...form, date: e.target.value })} /></div>
          <div className="input-group justify-end"><label>&nbsp;</label><button type="submit">Add Fuel Log</button></div>
        </form>
      </div>
      {/* Visual Operational Cost Comparison Graph */}
      <div className="card mt-14" style={{ padding: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
          <h3 style={{ margin: 0, color: "var(--text, #0F172A)" }}>Vehicle Operational Expense Graph</h3>
          <div style={{ display: "flex", gap: 16, fontSize: "0.85rem", fontWeight: 600 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#1D4ED8" }}>
              <span style={{ width: 14, height: 14, borderRadius: 4, background: "#2563EB" }}></span>
              Fuel Spend
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#4338CA" }}>
              <span style={{ width: 14, height: 14, borderRadius: 4, background: "#6366F1" }}></span>
              Maintenance Spend
            </span>
          </div>
        </div>

        <div style={{ display: "grid", gap: 12 }}>
          {costRows.slice(0, 8).map((r) => {
            const maxCost = Math.max(...costRows.map(x => x.total), 1);
            const fuelPct = Math.round((r.fuelCost / maxCost) * 100);
            const mntPct = Math.round((r.mntCost / maxCost) * 100);
            return (
              <div key={r._id} style={{ display: "grid", gridTemplateColumns: "140px 1fr 110px", alignItems: "center", gap: 12 }}>
                <span style={{ fontWeight: 600, fontSize: "0.88rem", color: "var(--text, #0F172A)" }}>{r.license_plate}</span>
                <div style={{ display: "flex", height: 16, background: "#F1F5F9", borderRadius: 999, overflow: "hidden", border: "1px solid #E2E8F0" }}>
                  <div style={{ width: `${fuelPct}%`, background: "linear-gradient(90deg, #3B82F6, #2563EB)", transition: "width 0.4s" }} title={`Fuel: ₹${Math.round(r.fuelCost).toLocaleString("en-IN")}`}></div>
                  <div style={{ width: `${mntPct}%`, background: "linear-gradient(90deg, #818CF8, #6366F1)", transition: "width 0.4s" }} title={`Maintenance: ₹${Math.round(r.mntCost).toLocaleString("en-IN")}`}></div>
                </div>
                <span style={{ fontWeight: 800, fontSize: "0.88rem", textAlign: "right", color: "var(--text, #0F172A)" }}>₹{Math.round(r.total).toLocaleString("en-IN")}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="table-wrap mt-14">
        <table>
          <thead><tr><th>Vehicle</th><th>Model</th><th>Fuel Cost</th><th>Maintenance Cost</th><th>Operational Cost</th><th>Completed Trips</th><th>Cost per Trip</th></tr></thead>
          <tbody>
            {costRows.map((r) => (
              <tr key={r._id}><td>{r.license_plate}</td><td>{r.model_name}</td><td>₹{Math.round(r.fuelCost)}</td><td>₹{Math.round(r.mntCost)}</td><td>₹{Math.round(r.total)}</td><td>{r.completed}</td><td>{r.costPerTrip ? `₹${r.costPerTrip}` : "N/A"}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
