import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// ─── Real Freight Corridors with Genuine Highway Coordinates (NH 48) ────────
const CORRIDORS = {
  delhi_jaipur: {
    id: "delhi_jaipur",
    name: "Delhi → Jaipur Express Corridor (NH 48)",
    origin: { name: "New Delhi Central Yard", coords: [28.6139, 77.2090] },
    destination: { name: "Jaipur Freight Terminal", coords: [26.9124, 75.7873] },
    waypoints: [
      [28.6139, 77.2090], // Connaught Place / Delhi
      [28.4595, 77.0266], // Gurugram
      [28.3495, 76.9280], // Manesar
      [28.2045, 76.7980], // Dharuhera
      [28.0034, 76.3862], // Neemrana
      [27.8860, 76.2825], // Behror
      [27.5256, 76.1554], // Kotputli
      [27.3820, 75.9621], // Shahpura
      [27.1420, 75.9080], // Chandwaji
      [26.9124, 75.7873], // Jaipur
    ],
    totalKm: 268,
  },
  mumbai_pune: {
    id: "mumbai_pune",
    name: "Mumbai → Pune Expressway",
    origin: { name: "Navi Mumbai JNPT Yard", coords: [19.0176, 72.9644] },
    destination: { name: "Pune Logistics Hub", coords: [18.5204, 73.8567] },
    waypoints: [
      [19.0176, 72.9644], // Navi Mumbai
      [18.9894, 73.1175], // Panvel
      [18.7557, 73.4091], // Khandala / Lonavala
      [18.7231, 73.6792], // Talegaon
      [18.5204, 73.8567], // Pune
    ],
    totalKm: 148,
  },
};

// Available 100% Free Public Map Tile Providers (Zero API Key, Zero Watermark)
const TILE_LAYERS = {
  osm: {
    name: "Street Map",
    url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    options: {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    },
  },
  satellite: {
    name: "Satellite",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    options: {
      maxZoom: 18,
      attribution: "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye",
    },
  },
  expressway: {
    name: "Highways",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
    options: {
      maxZoom: 19,
      attribution: "Tiles &copy; Esri",
    },
  },
};

// Interpolate between waypoints given progress ratio in [0, 1]
function getInterpolatedPosition(waypoints, progressRatio) {
  if (!waypoints || waypoints.length < 2) return waypoints ? waypoints[0] : [28.6139, 77.2090];
  const totalSegments = waypoints.length - 1;
  const scaled = Math.max(0, Math.min(progressRatio, 1)) * totalSegments;
  const index = Math.min(Math.floor(scaled), totalSegments - 1);
  const frac = scaled - index;

  const [lat1, lng1] = waypoints[index];
  const [lat2, lng2] = waypoints[index + 1];

  const lat = lat1 + (lat2 - lat1) * frac;
  const lng = lng1 + (lng2 - lng1) * frac;
  return [lat, lng];
}

export default function LiveFleetMap({
  height = "260px",
  mode = "hero", // 'hero' for landing page preview, 'full' for intelligence dashboard
  activeCorridorKey = "delhi_jaipur",
  vehicles = [],
  trips = [],
  drivers = [],
  selectedVehicleId = null,
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const tileLayerRef = useRef(null);
  const liveTruckMarkerRef = useRef(null);
  const routePolylineRef = useRef(null);
  const fleetMarkersRef = useRef({});

  const [activeLayer, setActiveLayer] = useState("osm"); // 'osm', 'satellite', 'expressway'
  const [telemetry, setTelemetry] = useState({
    speedKmh: 64,
    distanceKm: 82.4,
    eta: "1h 38m",
    vehiclePlate: "DL-01-AB-1204",
    driverName: "Enrico Octaviano",
    status: "Delivering",
  });

  const corridor = CORRIDORS[activeCorridorKey] || CORRIDORS.delhi_jaipur;

  // ─── 1. Initialize Leaflet Map ─────────────────────────────────────────────
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const initialCenter = mode === "hero" ? [27.75, 76.5] : [24.0, 78.5];
    const initialZoom = mode === "hero" ? 7 : 5;

    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: initialZoom,
      zoomControl: mode === "full",
      attributionControl: false,
      scrollWheelZoom: mode === "full",
      doubleClickZoom: mode === "full",
      dragging: true,
    });

    mapInstanceRef.current = map;

    // Apply selected tile layer (Default: Real OpenStreetMap full-color street tiles)
    const layerCfg = TILE_LAYERS[activeLayer] || TILE_LAYERS.osm;
    const tileL = L.tileLayer(layerCfg.url, layerCfg.options).addTo(map);
    tileLayerRef.current = tileL;

    // Route Polyline (NH 48)
    const routeLine = L.polyline(corridor.waypoints, {
      color: "#2563EB",
      weight: 5,
      opacity: 0.9,
      lineCap: "round",
      lineJoin: "round",
    }).addTo(map);
    routePolylineRef.current = routeLine;

    // Decorative Route Glow
    L.polyline(corridor.waypoints, {
      color: "#60A5FA",
      weight: 10,
      opacity: 0.3,
      lineCap: "round",
    }).addTo(map);

    // Origin Pin (Delhi)
    const originIcon = L.divIcon({
      className: "corridor-pin-origin",
      html: `
        <div style="display:flex; align-items:center; gap:6px; transform:translate(-7px, -7px);">
          <div style="background:#2563EB; width:14px; height:14px; border-radius:50%; border:3px solid #ffffff; box-shadow:0 2px 8px rgba(37,99,235,0.6);"></div>
          <span style="background:rgba(255,255,255,0.92); border:1px solid #CBD5E1; padding:2px 6px; border-radius:4px; font-size:10px; font-weight:700; color:#0F172A; white-space:nowrap; box-shadow:0 1px 3px rgba(0,0,0,0.1);">Delhi Hub</span>
        </div>
      `,
      iconSize: [14, 14],
      iconAnchor: [7, 7],
    });
    L.marker(corridor.origin.coords, { icon: originIcon })
      .bindPopup(`<strong>Origin:</strong> ${corridor.origin.name}`)
      .addTo(map);

    // Destination Pin (Jaipur)
    const destIcon = L.divIcon({
      className: "corridor-pin-dest",
      html: `
        <div style="display:flex; align-items:center; gap:6px; transform:translate(-7px, -7px);">
          <div style="background:#10B981; width:14px; height:14px; border-radius:50%; border:3px solid #ffffff; box-shadow:0 2px 8px rgba(16,185,129,0.6);"></div>
          <span style="background:rgba(255,255,255,0.92); border:1px solid #CBD5E1; padding:2px 6px; border-radius:4px; font-size:10px; font-weight:700; color:#0F172A; white-space:nowrap; box-shadow:0 1px 3px rgba(0,0,0,0.1);">Jaipur Terminal</span>
        </div>
      `,
      iconSize: [14, 14],
      iconAnchor: [7, 7],
    });
    L.marker(corridor.destination.coords, { icon: destIcon })
      .bindPopup(`<strong>Destination:</strong> ${corridor.destination.name}`)
      .addTo(map);

    // Live Moving Truck Marker with Real Radar Ping
    const truckIcon = L.divIcon({
      className: "live-moving-truck",
      html: `
        <div style="position:relative; width:48px; height:48px; display:flex; align-items:center; justify-content:center;">
          <div class="radar-ping" style="position:absolute; width:48px; height:48px; border-radius:50%; background:rgba(37,99,235,0.28); animation:liveRadarPulse 2s cubic-bezier(0,0,0.2,1) infinite;"></div>
          <div style="position:relative; width:30px; height:30px; background:#2563EB; border:2.5px solid #ffffff; border-radius:50%; box-shadow:0 4px 14px rgba(37,99,235,0.5); display:flex; align-items:center; justify-content:center;">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
              <rect x="1" y="3" width="15" height="13" rx="2" />
              <polygon points="16 8 20 8 23 11 23 16 16 16 8" />
              <circle cx="5.5" cy="18.5" r="2.5" />
              <circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
          </div>
        </div>
      `,
      iconSize: [48, 48],
      iconAnchor: [24, 24],
    });

    const startPos = getInterpolatedPosition(corridor.waypoints, 0.44);
    const truckMarker = L.marker(startPos, {
      icon: truckIcon,
      zIndexOffset: 1500,
    }).addTo(map);

    truckMarker.bindPopup(`
      <div style="font-family: system-ui; padding: 4px;">
        <div style="font-weight: 800; font-size: 0.94rem; color: #0F172A;">DL-01-AB-1204</div>
        <div style="color: #2563EB; font-weight: 700; font-size: 0.8rem; margin: 3px 0;">Status: Active Transit · Speed: 64 km/h</div>
        <div style="color: #475569; font-size: 0.78rem;">Route: Delhi → Jaipur (NH 48)</div>
        <div style="color: #475569; font-size: 0.78rem;">Driver: Enrico Octaviano</div>
        <div style="color: #059669; font-size: 0.76rem; font-weight: 600; margin-top: 4px;">GPS Telematics: High Precision · 4G Active</div>
      </div>
    `);
    liveTruckMarkerRef.current = truckMarker;

    // ─── 2. If in Full Hub Mode, plot active fleet across real Indian hubs ──────
    if (mode === "full" && vehicles.length > 0) {
      const cityHubs = [
        { name: "Delhi", coords: [28.6139, 77.2090] },
        { name: "Gurugram", coords: [28.4595, 77.0266] },
        { name: "Jaipur", coords: [26.9124, 75.7873] },
        { name: "Mumbai", coords: [19.0760, 72.8777] },
        { name: "Pune", coords: [18.5204, 73.8567] },
        { name: "Ahmedabad", coords: [23.0225, 72.5714] },
        { name: "Bengaluru", coords: [12.9716, 77.5946] },
        { name: "Chennai", coords: [13.0827, 80.2707] },
        { name: "Kolkata", coords: [22.5726, 88.3639] },
      ];

      fleetMarkersRef.current = {};

      vehicles.forEach((v, idx) => {
        const hub = cityHubs[idx % cityHubs.length];
        const lat = hub.coords[0] + Math.sin(idx * 2) * 0.28;
        const lng = hub.coords[1] + Math.cos(idx * 2) * 0.28;

        const color =
          v.status === "On Trip"
            ? "#2563EB"
            : v.status === "In Shop"
            ? "#6366F1"
            : "#10B981";

        const iconHtml = `
          <div style="display:flex; align-items:center; gap:5px; transform:translate(-14px, -14px);">
            <div style="width:28px; height:28px; border-radius:50%; background:${color}; border:2.5px solid #ffffff; box-shadow:0 3px 10px rgba(0,0,0,0.22); display:flex; align-items:center; justify-content:center;">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.3">
                <rect x="1" y="3" width="15" height="13" rx="2" />
                <polygon points="16 8 20 8 23 11 23 16 16 16 8" />
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
            </div>
            <span style="background:rgba(255,255,255,0.92); border:1px solid #E2E8F0; padding:1px 5px; border-radius:4px; font-size:9px; font-weight:700; color:#0F172A; white-space:nowrap; box-shadow:0 1px 3px rgba(0,0,0,0.08);">
              ${v.license_plate}
            </span>
          </div>
        `;

        const fIcon = L.divIcon({
          className: "fleet-live-pin",
          html: iconHtml,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });

        const m = L.marker([lat, lng], { icon: fIcon }).addTo(map);
        m.bindPopup(`
          <div style="font-family: system-ui; padding: 4px;">
            <div style="font-weight: 700; font-size: 0.9rem; color: #0F172A;">${v.license_plate} · ${v.model_name}</div>
            <div style="font-size: 0.78rem; font-weight: 600; color: ${color}; margin: 2px 0;">Status: ${v.status}</div>
            <div style="font-size: 0.75rem; color: #64748B;">Payload: ${v.max_capacity_kg} kg · Odometer: ${v.odometer} km</div>
            <div style="font-size: 0.74rem; color: #2563EB; margin-top: 4px;">Location: Near ${hub.name} Corridor</div>
          </div>
        `);
        fleetMarkersRef.current[v._id || v.id] = m;
      });
    }

    // Fit map bounds cleanly to the route
    if (mode === "hero") {
      map.fitBounds(routeLine.getBounds(), { padding: [35, 35] });
    }

    // ─── 3. Continuous Real-Time Physical Vehicle Movement ───────────────────
    let progress = 0.44;
    const interval = setInterval(() => {
      progress += 0.003;
      if (progress > 0.98) progress = 0.05;

      const pos = getInterpolatedPosition(corridor.waypoints, progress);
      if (liveTruckMarkerRef.current) {
        liveTruckMarkerRef.current.setLatLng(pos);
      }

      const randomSpeed = Math.floor(60 + Math.random() * 7); // 60-66 km/h
      const remainingKm = Math.max(
        8,
        Math.round(corridor.totalKm * (1 - progress) * 10) / 10
      );
      const estHours = Math.floor(remainingKm / 58);
      const estMins = Math.round(((remainingKm / 58) - estHours) * 60);

      setTelemetry((prev) => ({
        ...prev,
        speedKmh: randomSpeed,
        distanceKm: remainingKm,
        eta: `${estHours > 0 ? `${estHours}h ` : ""}${estMins}m`,
      }));
    }, 1500);

    return () => {
      clearInterval(interval);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [mode, activeCorridorKey, vehicles.length, activeLayer]);

  // Recenter map camera to corridor route
  const handleRecenter = () => {
    if (mapInstanceRef.current && routePolylineRef.current) {
      mapInstanceRef.current.fitBounds(routePolylineRef.current.getBounds(), {
        padding: [35, 35],
      });
    }
  };

  // Switch between Streets, Satellite, and Highway layer
  const handleLayerSwitch = (layerKey) => {
    setActiveLayer(layerKey);
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: height,
        borderRadius: mode === "hero" ? "12px" : "14px",
        overflow: "hidden",
        border: "1px solid #CBD5E1",
        background: "#F1F5F9",
        boxShadow: "0 4px 16px rgba(15, 23, 42, 0.06)",
      }}
    >
      <style>{`
        @keyframes liveRadarPulse {
          0% { transform: scale(0.6); opacity: 0.9; }
          70% { transform: scale(1.9); opacity: 0; }
          100% { transform: scale(2.3); opacity: 0; }
        }
        .leaflet-container {
          width: 100%;
          height: 100%;
          font-family: inherit;
        }
        .leaflet-tile {
          filter: contrast(1.02);
        }
      `}</style>

      {/* Real Map Canvas */}
      <div ref={mapContainerRef} style={{ width: "100%", height: "100%" }} />

      {/* Top Left: Live Status Pill */}
      <div
        style={{
          position: "absolute",
          top: 10,
          left: 10,
          zIndex: 400,
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          border: "1px solid #CBD5E1",
          borderRadius: 8,
          padding: "5px 10px",
          display: "flex",
          alignItems: "center",
          gap: 8,
          boxShadow: "0 2px 8px rgba(15, 23, 42, 0.1)",
          fontSize: "0.75rem",
          fontWeight: 600,
          color: "#0F172A",
        }}
      >
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "#16A34A",
            boxShadow: "0 0 8px rgba(22, 163, 74, 0.8)",
            display: "inline-block",
          }}
        />
        <span>Live Real Map · OpenStreetMap</span>
        <span style={{ color: "#94A3B8" }}>·</span>
        <span style={{ color: "#2563EB" }}>NH 48 Expressway</span>
      </div>

      {/* Top Right: Layer Switcher & Recenter Controls */}
      <div
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          zIndex: 400,
          display: "flex",
          gap: 6,
          alignItems: "center",
        }}
      >
        {/* Layer Switcher Buttons */}
        <div
          style={{
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            border: "1px solid #CBD5E1",
            borderRadius: 8,
            padding: 2,
            display: "flex",
            boxShadow: "0 2px 8px rgba(15, 23, 42, 0.1)",
          }}
        >
          {Object.entries(TILE_LAYERS).map(([key, cfg]) => (
            <button
              key={key}
              type="button"
              onClick={() => handleLayerSwitch(key)}
              style={{
                border: "none",
                background: activeLayer === key ? "#2563EB" : "transparent",
                color: activeLayer === key ? "#ffffff" : "#475569",
                fontSize: "0.7rem",
                fontWeight: 600,
                padding: "4px 8px",
                borderRadius: 6,
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              {cfg.name}
            </button>
          ))}
        </div>

        {/* Recenter Button */}
        <button
          type="button"
          onClick={handleRecenter}
          title="Recenter Route"
          style={{
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            border: "1px solid #CBD5E1",
            borderRadius: 8,
            padding: "5px 8px",
            fontSize: "0.72rem",
            fontWeight: 600,
            color: "#1E293B",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 4,
            boxShadow: "0 2px 8px rgba(15, 23, 42, 0.1)",
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10" />
            <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
          </svg>
          <span>Recenter</span>
        </button>
      </div>

      {/* Bottom: Real-Time Telemetry Metrics Footer */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 400,
          background: "rgba(255, 255, 255, 0.96)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderTop: "1px solid #CBD5E1",
          padding: "8px 14px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", gap: 18 }}>
          <div>
            <div style={{ fontSize: "0.68rem", color: "#64748B", fontWeight: 600, textTransform: "uppercase" }}>
              Speed
            </div>
            <div style={{ fontSize: "0.86rem", fontWeight: 800, color: "#0F172A" }}>
              {telemetry.speedKmh} km/h
            </div>
          </div>
          <div>
            <div style={{ fontSize: "0.68rem", color: "#64748B", fontWeight: 600, textTransform: "uppercase" }}>
              Remaining
            </div>
            <div style={{ fontSize: "0.86rem", fontWeight: 800, color: "#2563EB" }}>
              {telemetry.distanceKm} km
            </div>
          </div>
          <div>
            <div style={{ fontSize: "0.68rem", color: "#64748B", fontWeight: 600, textTransform: "uppercase" }}>
              Est. ETA
            </div>
            <div style={{ fontSize: "0.86rem", fontWeight: 800, color: "#0F172A" }}>
              {telemetry.eta}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span
            style={{
              padding: "3px 9px",
              borderRadius: 999,
              fontSize: "0.7rem",
              fontWeight: 700,
              background: "#EFF6FF",
              color: "#2563EB",
              border: "1px solid #BFDBFE",
            }}
          >
            Delivering · DL-01-AB-1204
          </span>
        </div>
      </div>
    </div>
  );
}
