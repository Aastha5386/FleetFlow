import express from "express";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// Known city coordinates cache / fallback for fast lookup
const CITY_CACHE = {
  delhi:      { lat: 28.6139, lon: 77.2090, name: "Delhi, India" },
  jaipur:     { lat: 26.9124, lon: 75.7873, name: "Jaipur, Rajasthan, India" },
  mumbai:     { lat: 19.0760, lon: 72.8777, name: "Mumbai, Maharashtra, India" },
  pune:       { lat: 18.5204, lon: 73.8567, name: "Pune, Maharashtra, India" },
  gurgaon:    { lat: 28.4595, lon: 77.0266, name: "Gurgaon, Haryana, India" },
  agra:       { lat: 27.1767, lon: 78.0081, name: "Agra, Uttar Pradesh, India" },
  noida:      { lat: 28.5355, lon: 77.3910, name: "Noida, Uttar Pradesh, India" },
  kanpur:     { lat: 26.4499, lon: 80.3319, name: "Kanpur, Uttar Pradesh, India" },
  faridabad:  { lat: 28.4089, lon: 77.3178, name: "Faridabad, Haryana, India" },
  chandigarh: { lat: 30.7333, lon: 76.7794, name: "Chandigarh, India" },
  lucknow:    { lat: 26.8467, lon: 80.9462, name: "Lucknow, Uttar Pradesh, India" },
  bangalore:  { lat: 12.9716, lon: 77.5946, name: "Bangalore, Karnataka, India" },
  hyderabad:  { lat: 17.3850, lon: 78.4867, name: "Hyderabad, Telangana, India" },
  chennai:    { lat: 13.0827, lon: 80.2707, name: "Chennai, Tamil Nadu, India" },
  kolkata:    { lat: 22.5726, lon: 88.3639, name: "Kolkata, West Bengal, India" },
  ahmedabad:  { lat: 23.0225, lon: 72.5714, name: "Ahmedabad, Gujarat, India" },
};

// Helper: Geocode city using Nominatim OpenStreetMap API
async function geocodeCity(cityName) {
  const normalized = cityName.trim().toLowerCase();
  if (CITY_CACHE[normalized]) return CITY_CACHE[normalized];

  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cityName)}&format=json&limit=1`;
    const res = await fetch(url, { headers: { "User-Agent": "FleetFlow-App/1.0" } });
    if (res.ok) {
      const data = await res.json();
      if (data && data.length > 0) {
        const result = {
          lat: parseFloat(data[0].lat),
          lon: parseFloat(data[0].lon),
          name: data[0].display_name,
        };
        CITY_CACHE[normalized] = result;
        return result;
      }
    }
  } catch (err) {
    console.warn("Nominatim geocode failed:", err.message);
  }

  // Fallback approximate coordinate
  return { lat: 28.6139, lon: 77.2090, name: cityName };
}

// Helper: Weather code interpreter (WMO standard)
function interpretWeather(code) {
  if (code === 0) return { condition: "Clear Sky", icon: "sunny", risk: "Low", advice: "Ideal driving conditions" };
  if (code <= 3) return { condition: "Partly Cloudy", icon: "cloudy", risk: "Low", advice: "Good visibility" };
  if (code <= 48) return { condition: "Fog / Mist", icon: "fog", risk: "Medium", advice: "Reduced visibility; reduce speed and use fog lights" };
  if (code <= 55) return { condition: "Drizzle", icon: "rain", risk: "Low", advice: "Slightly wet roads; keep safe distance" };
  if (code <= 65) return { condition: "Rain", icon: "rain", risk: "Medium", advice: "Wet roads & stopping distance increased" };
  if (code <= 82) return { condition: "Heavy Rain / Showers", icon: "rain", risk: "High", advice: "Hazardous; caution against aquaplaning" };
  if (code >= 95) return { condition: "Thunderstorm", icon: "thunder", risk: "High", advice: "Severe hazard; consider delaying dispatch" };
  return { condition: "Moderate Weather", icon: "cloudy", risk: "Low", advice: "Normal driving conditions" };
}

// ─── GET /api/external/geocode ────────────────────────────────────────────────
router.get("/geocode", auth, async (req, res) => {
  try {
    const city = req.query.city;
    if (!city) return res.status(400).json({ message: "City parameter required" });
    const location = await geocodeCity(city);
    res.json(location);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── GET /api/external/weather ────────────────────────────────────────────────
// Real-time weather and road safety risk via Open-Meteo Free API
router.get("/weather", auth, async (req, res) => {
  try {
    const city = req.query.city || "Delhi";
    const loc = await geocodeCity(city);

    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${loc.lat}&longitude=${loc.lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,precipitation&timezone=auto`;
    const response = await fetch(weatherUrl);
    if (!response.ok) throw new Error("Failed to fetch weather data");
    const data = await response.json();

    const curr = data.current || {};
    const weatherInfo = interpretWeather(curr.weather_code || 0);

    res.json({
      city: loc.name,
      temperature_c: curr.temperature_2m,
      humidity_pct: curr.relative_humidity_2m,
      wind_speed_kmh: curr.wind_speed_10m,
      precipitation_mm: curr.precipitation || 0,
      condition: weatherInfo.condition,
      icon: weatherInfo.icon,
      road_risk: weatherInfo.risk,
      driving_advice: weatherInfo.advice,
      source: "Open-Meteo Free API",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── GET /api/external/route ──────────────────────────────────────────────────
// Real driving distance, duration, and turn routes via OSRM Free Routing API
router.get("/route", auth, async (req, res) => {
  try {
    const { from, to } = req.query;
    if (!from || !to) return res.status(400).json({ message: "from and to query parameters required" });

    const [start, end] = await Promise.all([geocodeCity(from), geocodeCity(to)]);

    const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${start.lon},${start.lat};${end.lon},${end.lat}?overview=false`;
    const response = await fetch(osrmUrl);
    if (!response.ok) throw new Error("OSRM routing request failed");
    const data = await response.json();

    if (!data.routes || data.routes.length === 0) {
      throw new Error("No driving route found between these locations");
    }

    const route = data.routes[0];
    const distanceKm = Math.round((route.distance / 1000) * 10) / 10;
    const durationHours = Math.round((route.duration / 3600) * 10) / 10;
    const estLiters = Math.round((distanceKm / 4.2) * 10) / 10; // Commercial truck ~4.2 km/L
    const estFuelCost = Math.round(estLiters * 95); // ~₹95 / liter

    res.json({
      from: start.name,
      to: end.name,
      distance_km: distanceKm,
      duration_hours: durationHours,
      estimated_fuel_liters: estLiters,
      estimated_fuel_cost_inr: estFuelCost,
      source: "OSRM Public Routing API",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── GET /api/external/trip-advisory ──────────────────────────────────────────
// Complete Route + Weather + Road Safety Advisory for Dispatches
router.get("/trip-advisory", auth, async (req, res) => {
  try {
    const { origin, destination } = req.query;
    if (!origin || !destination) return res.status(400).json({ message: "origin and destination required" });

    const [start, end] = await Promise.all([geocodeCity(origin), geocodeCity(destination)]);

    // Fetch Route + Weather at origin + Weather at destination in parallel
    const [osrmRes, weatherStartRes, weatherEndRes] = await Promise.all([
      fetch(`https://router.project-osrm.org/route/v1/driving/${start.lon},${start.lat};${end.lon},${end.lat}?overview=false`).then(r => r.json()).catch(() => null),
      fetch(`https://api.open-meteo.com/v1/forecast?latitude=${start.lat}&longitude=${start.lon}&current=temperature_2m,weather_code,wind_speed_10m`).then(r => r.json()).catch(() => null),
      fetch(`https://api.open-meteo.com/v1/forecast?latitude=${end.lat}&longitude=${end.lon}&current=temperature_2m,weather_code,wind_speed_10m`).then(r => r.json()).catch(() => null),
    ]);

    const route = osrmRes?.routes?.[0];
    const distanceKm = route ? Math.round((route.distance / 1000) * 10) / 10 : 250;
    const durationHours = route ? Math.round((route.duration / 3600) * 10) / 10 : 4.5;

    const weatherStart = interpretWeather(weatherStartRes?.current?.weather_code || 0);
    const weatherEnd = interpretWeather(weatherEndRes?.current?.weather_code || 0);

    const overallRisk = (weatherStart.risk === "High" || weatherEnd.risk === "High")
      ? "High"
      : (weatherStart.risk === "Medium" || weatherEnd.risk === "Medium")
      ? "Medium"
      : "Low";

    res.json({
      origin: {
        city: start.name,
        temperature_c: weatherStartRes?.current?.temperature_2m,
        condition: weatherStart.condition,
        icon: weatherStart.icon,
        risk: weatherStart.risk,
      },
      destination: {
        city: end.name,
        temperature_c: weatherEndRes?.current?.temperature_2m,
        condition: weatherEnd.condition,
        icon: weatherEnd.icon,
        risk: weatherEnd.risk,
      },
      route: {
        distance_km: distanceKm,
        duration_hours: durationHours,
        est_liters: Math.round((distanceKm / 4.2) * 10) / 10,
        est_cost_inr: Math.round((distanceKm / 4.2) * 95),
      },
      safety_advisory: {
        overall_risk: overallRisk,
        advice: overallRisk === "High"
          ? "Heavy weather conditions detected along the route. Review safety protocols before dispatch."
          : overallRisk === "Medium"
          ? "Moderate weather / wet roads anticipated. Advise driver to maintain safe following distance."
          : "Clear skies and favorable road conditions for immediate dispatch.",
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
