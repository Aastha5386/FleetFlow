import { useEffect, useRef } from "react";
import { useFleet } from "../fleetStore.jsx";
import startIntelligence from "../intelLogic.js";

export default function Intelligence() {
  const { state } = useFleet();
  const ref = useRef(null);

  useEffect(() => {
    window.FLEET_DATA = {
      vehicles: state.vehicles,
      drivers: state.drivers,
      trips: state.trips,
      maintenance: state.maintenance,
      fuel: state.fuel,
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
            <svg id="trackMap" viewBox="0 0 640 360" preserveAspectRatio="xMidYMid meet"></svg>
            <div className="track-side"><div id="trackList"></div></div>
          </div>
        </div>

        <div className="card intel-card">
          <h3>Route Optimization</h3>
          <div className="form-row">
            <input id="routeFrom" list="cityList" placeholder="Origin" />
            <input id="routeTo" list="cityList" placeholder="Destination" />
            <datalist id="cityList"></datalist>
            <button className="btn" id="routeBtn">Optimize</button>
          </div>
          <svg id="routeMap" viewBox="0 0 640 220"></svg>
          <div id="routeResult" className="mini-list"></div>
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
