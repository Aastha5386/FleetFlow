import { useEffect, useRef } from "react";
import { useFleet } from "../fleetStore.jsx";
import startIntelligence from "../intelLogic.js";
import LiveFleetMap from "../components/LiveFleetMap.jsx";
import RouteOptimizerMap from "../components/RouteOptimizerMap.jsx";

export default function Intelligence() {
  const { state } = useFleet();
  const ref = useRef(null);

  useEffect(() => {
    // Normalize records: flatten populated ObjectId references to plain id strings
    // so intelLogic.js can match vehicle_id/driver_id regardless of populate
    const normalizeId = (v) => (v && typeof v === "object" ? v._id || v.id : v);
    window.FLEET_DATA = {
      vehicles:    state.vehicles.map(v => ({ ...v, id: v._id || v.id })),
      drivers:     state.drivers.map(d => ({ ...d, id: d._id || d.id })),
      trips:       state.trips.map(t => ({ ...t, id: t._id || t.id, vehicle_id: normalizeId(t.vehicle_id), driver_id: normalizeId(t.driver_id) })),
      maintenance: state.maintenance.map(m => ({ ...m, id: m._id || m.id, vehicle_id: normalizeId(m.vehicle_id) })),
      fuel:        state.fuel.map(f => ({ ...f, id: f._id || f.id, vehicle_id: normalizeId(f.vehicle_id) })),
    };
    const cleanup = startIntelligence();
    return cleanup;
    // run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={ref}>
      <div className="topbar">
        <div>
          <h1>Fleet Intelligence Hub</h1>
          <p className="page-subtitle">Real-time tracking, predictive insights, and AI-assisted decisions powered by your fleet data.</p>
        </div>
      </div>

      <div className="grid-4" id="intelKpis"></div>

      <div className="intel-grid">
        <div className="card intel-card span-2">
          <h3>Live Vehicle Tracking <span className="live-dot"></span></h3>
          <div className="track-wrap">
            <div style={{ flex: 1, minWidth: 0 }}>
              <LiveFleetMap height="360px" mode="full" vehicles={state.vehicles} trips={state.trips} drivers={state.drivers} />
            </div>
            <div className="track-side"><div id="trackList"></div></div>
            <svg id="trackMap" style={{ display: "none" }}></svg>
          </div>
        </div>

        <div className="card intel-card span-2">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <h3 style={{ margin: 0 }}>
              Live Highway Route Optimization & Multi-Corridor Intelligence
            </h3>
            <span style={{ fontSize: "0.78rem", color: "#2563EB", fontWeight: 600, background: "#EFF6FF", padding: "4px 12px", borderRadius: 999, border: "1px solid #BFDBFE" }}>
              Interactive OpenStreetMap Engine
            </span>
          </div>
          <RouteOptimizerMap />
        </div>

        <div className="card intel-card">
          <h3>Fuel Efficiency Analysis</h3>
          <canvas id="fuelChart" height="220"></canvas>
          <div id="fuelInsights" className="mini-list"></div>
        </div>

        <div className="card intel-card">
          <h3>Predictive Maintenance</h3>
          <div id="predMaint"></div>
        </div>

        <div className="card intel-card">
          <h3>Driver Performance Scoring</h3>
          <div id="driverScores"></div>
        </div>

        <div className="card intel-card">
          <h3>Automated Compliance Alerts</h3>
          <div id="alerts"></div>
        </div>

        <div className="card intel-card">
          <h3>Trip Delay Prediction</h3>
          <div id="delayPred"></div>
        </div>

        <div className="card intel-card span-2">
          <h3>Operational Analytics</h3>
          <div className="analytics-row">
            <canvas id="tripsChart" height="220"></canvas>
            <canvas id="costChart" height="220"></canvas>
          </div>
        </div>

        <div className="card intel-card span-2">
          <h3>Fleet AI Assistant</h3>
          <p className="page-subtitle">Ask about your fleet: try "high-risk vehicles", "maintenance summary", "best vehicle for a trip", "expired licenses", "fuel efficiency leaders".</p>
          <div id="chatLog" className="chat-log"></div>
          <div className="form-row">
            <input id="chatInput" placeholder="Ask Fleet AI..." />
            <button className="btn" id="chatSend">Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}
