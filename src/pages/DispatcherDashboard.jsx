import { useState } from "react";
import { Link } from "react-router-dom";
import { useFleet } from "../fleetStore.jsx";
import { api } from "../api.js";

export default function DispatcherDashboard() {
  const { state, addTrip, updateTripStatus, deleteTrip } = useFleet();

  const [form, setForm] = useState({
    vehicle_id: "",
    driver_id: "",
    cargo_weight: "",
    origin: "",
    destination: "",
    status: "Dispatched",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [advisory, setAdvisory] = useState(null);
  const [loadingAdvisory, setLoadingAdvisory] = useState(false);

  const availableVehicles = state.vehicles.filter((v) => v.status === "Available");
  const availableDrivers  = state.drivers.filter((d) => d.status === "Available");
  const dispatchedTrips   = state.trips.filter((t) => t.status === "Dispatched");
  const draftTrips        = state.trips.filter((t) => t.status === "Draft");

  const selectedVehicle = state.vehicles.find((v) => v._id === form.vehicle_id);
  const selectedDriver  = state.drivers.find((d) => d._id === form.driver_id);

  const isOverweight =
    selectedVehicle && form.cargo_weight && Number(form.cargo_weight) > selectedVehicle.max_capacity_kg;

  const handleDispatch = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!selectedVehicle || !selectedDriver) {
      return setError("Please select both a vehicle and driver.");
    }
    if (Number(form.cargo_weight) > selectedVehicle.max_capacity_kg) {
      return setError(`Cargo weight (${form.cargo_weight} kg) exceeds ${selectedVehicle.model_name} capacity (${selectedVehicle.max_capacity_kg} kg)!`);
    }
    if (selectedDriver.status === "Suspended") {
      return setError("Suspended driver cannot be dispatched.");
    }
    if (new Date(selectedDriver.license_expiry_date) < new Date()) {
      return setError("Cannot assign driver with expired license.");
    }
    if (selectedVehicle.status === "In Shop") {
      return setError("Selected vehicle is undergoing maintenance (In Shop).");
    }

    try {
      await addTrip({
        vehicle_id: form.vehicle_id,
        driver_id: form.driver_id,
        cargo_weight: Number(form.cargo_weight),
        origin: form.origin,
        destination: form.destination,
        status: form.status,
      });
      setSuccess(`Trip successfully created & dispatched to ${selectedDriver.name}!`);
      setForm({
        vehicle_id: "",
        driver_id: "",
        cargo_weight: "",
        origin: "",
        destination: "",
        status: "Dispatched",
      });
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      setError(err.message);
    }
  };

  const checkAdvisory = async () => {
    if (!form.origin || !form.destination) {
      return setError("Please enter both Origin and Destination to analyze road & weather conditions.");
    }
    setError("");
    setLoadingAdvisory(true);
    try {
      const adv = await api.getTripAdvisory(form.origin, form.destination);
      setAdvisory(adv);
    } catch (err) {
      setError("Failed to fetch route advisory: " + err.message);
    } finally {
      setLoadingAdvisory(false);
    }
  };

  const vehicleOf = (t) =>
    typeof t.vehicle_id === "object" ? t.vehicle_id : state.vehicles.find((v) => v._id === t.vehicle_id);
  const driverOf = (t) =>
    typeof t.driver_id === "object" ? t.driver_id : state.drivers.find((d) => d._id === t.driver_id);

  return (
    <>
      <div className="topbar">
        <div>
          <h1>Dispatcher Control Board</h1>
          <p className="page-subtitle">Schedule, assign drivers to vehicles, and monitor live dispatches in real-time.</p>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid-4">
        <div className="card metric-card metric-card-highlight">
          <div className="metric-head"><span>Active Dispatches</span></div>
          <div className="metric-value">{dispatchedTrips.length}</div>
          <div style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: 4 }}>Vehicles currently in transit</div>
        </div>
        <div className="card metric-card">
          <div className="metric-head"><span>Draft / Pending Trips</span></div>
          <div className="metric-value">{draftTrips.length}</div>
          <div style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: 4 }}>Awaiting driver assignment</div>
        </div>
        <div className="card metric-card">
          <div className="metric-head"><span>Ready Vehicles</span></div>
          <div className="metric-value" style={{ color: "#16a34a" }}>{availableVehicles.length}</div>
          <div style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: 4 }}>Available for dispatch</div>
        </div>
        <div className="card metric-card">
          <div className="metric-head"><span>Ready Drivers</span></div>
          <div className="metric-value" style={{ color: "#16a34a" }}>{availableDrivers.length}</div>
          <div style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: 4 }}>Active & compliant drivers</div>
        </div>
      </div>

      {error && <div className="flash flash-error mt-14">{error}</div>}
      {success && <div className="flash flash-info mt-14">{success}</div>}

      {/* Rapid Dispatch Form */}
      <div className="form-card mt-14">
        <h3>Rapid Trip Dispatch Wizard</h3>
        <p className="page-subtitle" style={{ marginBottom: 14 }}>
          Pair an available truck with a qualified driver and dispatch on route.
        </p>
        <form onSubmit={handleDispatch} className="form-grid">
          <div className="input-group">
            <label>Select Vehicle</label>
            <select
              required
              value={form.vehicle_id}
              onChange={(e) => setForm({ ...form, vehicle_id: e.target.value })}
            >
              <option value="">-- Choose Available Vehicle --</option>
              {state.vehicles.map((v) => (
                <option key={v._id} value={v._id} disabled={v.status === "In Shop"}>
                  {v.license_plate} - {v.model_name} ({v.max_capacity_kg} kg) [{v.status}]
                </option>
              ))}
            </select>
            {selectedVehicle && (
              <span style={{ fontSize: "0.78rem", color: "var(--muted)", marginTop: 3 }}>
                Max capacity: {selectedVehicle.max_capacity_kg} kg · Odo: {selectedVehicle.odometer?.toLocaleString()} km
              </span>
            )}
          </div>

          <div className="input-group">
            <label>Select Driver</label>
            <select
              required
              value={form.driver_id}
              onChange={(e) => setForm({ ...form, driver_id: e.target.value })}
            >
              <option value="">-- Choose Qualified Driver --</option>
              {state.drivers.map((d) => {
                const expired = new Date(d.license_expiry_date) < new Date();
                return (
                  <option key={d._id} value={d._id} disabled={d.status === "Suspended" || expired}>
                    {d.name} (Score: {d.safety_score}) [{d.status}] {expired ? "- EXPIRED" : ""}
                  </option>
                );
              })}
            </select>
            {selectedDriver && (
              <span style={{ fontSize: "0.78rem", color: "var(--muted)", marginTop: 3 }}>
                Safety rating: {selectedDriver.safety_score}/100 · License: {selectedDriver.license_number}
              </span>
            )}
          </div>

          <div className="input-group">
            <label>Cargo Weight (kg)</label>
            <input
              type="number"
              step="1"
              min="1"
              required
              value={form.cargo_weight}
              onChange={(e) => setForm({ ...form, cargo_weight: e.target.value })}
              placeholder="e.g. 750"
            />
            {isOverweight && (
              <span style={{ fontSize: "0.78rem", color: "#dc2626", fontWeight: 600, marginTop: 4, display: "inline-flex", alignItems: "center", gap: 5 }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                Exceeds max payload ({selectedVehicle.max_capacity_kg} kg)
              </span>
            )}
          </div>

          <div className="input-group">
            <label>Origin Location</label>
            <input
              type="text"
              required
              value={form.origin}
              onChange={(e) => setForm({ ...form, origin: e.target.value })}
              placeholder="e.g. Delhi Central Hub"
            />
          </div>

          <div className="input-group">
            <label>Destination Location</label>
            <input
              type="text"
              required
              value={form.destination}
              onChange={(e) => setForm({ ...form, destination: e.target.value })}
              placeholder="e.g. Jaipur Warehouse 4"
            />
          </div>

          <div className="input-group">
            <label>Initial Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option value="Dispatched">Dispatched (Immediate departure)</option>
              <option value="Draft">Draft (Save for later)</option>
            </select>
          </div>

          {advisory && (
            <div
              className="col-span-full"
              style={{
                background: "#f0fdf4",
                border: "1px solid #bbf7d0",
                borderRadius: "10px",
                padding: "14px 16px",
                marginTop: "10px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <strong style={{ color: "#166534", fontSize: "0.95rem" }}>
                  Live Route & Weather Intelligence (OSRM + Open-Meteo)
                </strong>
                <span
                  className={`badge ${
                    advisory.safety_advisory?.overall_risk === "High"
                      ? "badge-red"
                      : advisory.safety_advisory?.overall_risk === "Medium"
                      ? "badge-amber"
                      : "badge-green"
                  }`}
                >
                  Road Risk: {advisory.safety_advisory?.overall_risk}
                </span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
                <div style={{ background: "#ffffff", padding: "10px 12px", borderRadius: 8, border: "1px solid var(--border-color, #E2E8F0)", borderTop: "3px solid #2563EB" }}>
                  <div style={{ fontSize: "0.78rem", color: "var(--muted, #64748B)", fontWeight: 500 }}>Origin Weather ({advisory.origin?.city?.split(",")[0]})</div>
                  <div style={{ fontWeight: 700, fontSize: "1rem", marginTop: 2, color: "var(--text, #0F172A)" }}>
                    {advisory.origin?.temperature_c}°C · {advisory.origin?.condition}
                  </div>
                </div>

                <div style={{ background: "#ffffff", padding: "10px 12px", borderRadius: 8, border: "1px solid var(--border-color, #E2E8F0)", borderTop: "3px solid #10B981" }}>
                  <div style={{ fontSize: "0.78rem", color: "var(--muted, #64748B)", fontWeight: 500 }}>Destination Weather ({advisory.destination?.city?.split(",")[0]})</div>
                  <div style={{ fontWeight: 700, fontSize: "1rem", marginTop: 2, color: "var(--text, #0F172A)" }}>
                    {advisory.destination?.temperature_c}°C · {advisory.destination?.condition}
                  </div>
                </div>

                <div style={{ background: "#ffffff", padding: "10px 12px", borderRadius: 8, border: "1px solid var(--border-color, #E2E8F0)", borderTop: "3px solid #4F46E5" }}>
                  <div style={{ fontSize: "0.78rem", color: "var(--muted, #64748B)", fontWeight: 500 }}>Real Road Distance & Duration</div>
                  <div style={{ fontWeight: 700, fontSize: "1rem", marginTop: 2, color: "var(--text, #0F172A)" }}>
                    {advisory.route?.distance_km} km · ~{advisory.route?.duration_hours} hrs
                  </div>
                </div>

                <div style={{ background: "#ffffff", padding: "10px 12px", borderRadius: 8, border: "1px solid var(--border-color, #E2E8F0)", borderTop: "3px solid #6366F1" }}>
                  <div style={{ fontSize: "0.78rem", color: "var(--muted, #64748B)", fontWeight: 500 }}>Est. Fuel & Expense</div>
                  <div style={{ fontWeight: 700, fontSize: "1rem", marginTop: 2, color: "var(--text, #0F172A)" }}>
                    ~{advisory.route?.est_liters} L · ₹{advisory.route?.est_cost_inr?.toLocaleString()}
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 10, fontSize: "0.82rem", color: "#15803d", fontWeight: 500 }}>
                {advisory.safety_advisory?.advice}
              </div>
            </div>
          )}

          <div className="input-group justify-end col-span-full" style={{ display: "flex", gap: 10 }}>
            <button
              type="button"
              className="secondary"
              onClick={checkAdvisory}
              disabled={loadingAdvisory}
              style={{ minWidth: 200 }}
            >
              {loadingAdvisory ? "Analyzing Weather & Route..." : "Check Route & Weather Advisory"}
            </button>
            <button type="submit" disabled={Boolean(isOverweight)} style={{ minWidth: 160 }}>
              Dispatch Trip
            </button>
          </div>
        </form>
      </div>

      {/* Live Active Dispatches */}
      <div className="form-card mt-14">
        <h3>Live Active Dispatches & Trips</h3>
        <div className="table-wrap mt-10">
          <table>
            <thead>
              <tr>
                <th>Route</th>
                <th>Vehicle Plate</th>
                <th>Driver Assigned</th>
                <th>Cargo Load</th>
                <th>Status</th>
                <th>Quick Status Update</th>
              </tr>
            </thead>
            <tbody>
              {state.trips.length === 0 && (
                <tr>
                  <td colSpan="6">No trips found in dispatch system.</td>
                </tr>
              )}
              {state.trips.map((t) => {
                const v = vehicleOf(t);
                const d = driverOf(t);
                return (
                  <tr key={t._id}>
                    <td>
                      <strong>{t.origin}</strong> → <strong>{t.destination}</strong>
                    </td>
                    <td>{v?.license_plate || "-"} ({v?.model_name || ""})</td>
                    <td>{d?.name || "-"}</td>
                    <td>{t.cargo_weight} kg</td>
                    <td>
                      <span className={`badge status-${t.status.toLowerCase()}`}>{t.status}</span>
                    </td>
                    <td>
                      <div className="inline-actions">
                        <select
                          defaultValue={t.status}
                          onChange={(e) => updateTripStatus(t._id, e.target.value)}
                        >
                          <option value="Draft">Draft</option>
                          <option value="Dispatched">Dispatched</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
