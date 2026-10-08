/**
 * Comprehensive API Test Suite
 * Tests all Auth, CRUD, Aggregation, and External Free APIs
 */
const BASE = "http://localhost:5000/api";

const colors = {
  green: "\x1b[32m",
  red:   "\x1b[31m",
  cyan:  "\x1b[36m",
  reset: "\x1b[0m",
  bold:  "\x1b[1m",
};

let passed = 0;
let failed = 0;

function assert(condition, testName, extra = "") {
  if (condition) {
    console.log(`  ${colors.green}✓ PASS${colors.reset} ${testName} ${extra}`);
    passed++;
  } else {
    console.error(`  ${colors.red}✗ FAIL${colors.reset} ${testName} ${extra}`);
    failed++;
  }
}

async function run() {
  console.log(`\n${colors.bold}${colors.cyan}========================================${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}  FLEETFLOW COMPLETE API TEST SUITE    ${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}========================================${colors.reset}\n`);

  // 1. Health check
  console.log(`${colors.bold}1. Health & DB Check${colors.reset}`);
  const healthRes = await fetch(`${BASE}/health`).then(r => r.json());
  assert(healthRes.status === "ok", "GET /api/health", `(dbState: ${healthRes.dbState}, database: ${healthRes.database})`);

  // 2. Auth: Login Manager
  console.log(`\n${colors.bold}2. Authentication & JWT Token Verification${colors.reset}`);
  const loginRes = await fetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: "manager", password: "manager123" }),
  }).then(r => r.json());

  assert(loginRes.token && loginRes.user?.role === "Manager", "POST /api/auth/login (Manager)", `User: ${loginRes.user?.username}, Role: ${loginRes.user?.role}`);
  const token = loginRes.token;
  const authHeaders = { "Content-Type": "application/json", "Authorization": `Bearer ${token}` };

  // Verify other role logins
  for (const [user, pw, expectedRole] of [
    ["driver", "driver123", "Driver"],
    ["safety", "safety123", "Safety Officer"],
    ["dispatcher", "dispatcher123", "Dispatcher"],
    ["finance", "finance123", "Financial Analyst"],
  ]) {
    const res = await fetch(`${BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: user, password: pw }),
    }).then(r => r.json());
    assert(res.token && res.user?.role === expectedRole, `POST /api/auth/login (${expectedRole})`, `Token received for ${user}`);
  }

  // GET /api/auth/me
  const meRes = await fetch(`${BASE}/auth/me`, { headers: authHeaders }).then(r => r.json());
  assert(meRes.username === "manager", "GET /api/auth/me", `Identified as ${meRes.name} (${meRes.role})`);

  // Register a new test user & approval lifecycle
  const testUsername = "tester_" + Date.now();
  const regRes = await fetch(`${BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: testUsername,
      name: "Test Driver",
      email: `${testUsername}@test.com`,
      password: "pass123",
      role: "Driver",
    }),
  }).then(r => r.json());
  assert(regRes.userId, "POST /api/auth/register", `Created pending user: ${testUsername}`);

  const usersList = await fetch(`${BASE}/auth/users`, { headers: authHeaders }).then(r => r.json());
  assert(Array.isArray(usersList), "GET /api/auth/users", `Found ${usersList.length} users`);

  if (regRes.userId) {
    const approveRes = await fetch(`${BASE}/auth/users/${regRes.userId}/approve`, { method: "PATCH", headers: authHeaders }).then(r => r.json());
    assert(approveRes.status === "approved", "PATCH /api/auth/users/:id/approve", `Status: ${approveRes.status}`);

    const delUserRes = await fetch(`${BASE}/auth/users/${regRes.userId}`, { method: "DELETE", headers: authHeaders }).then(r => r.json());
    assert(delUserRes.message === "User deleted", "DELETE /api/auth/users/:id", "Cleaned up test user");
  }

  // 3. Vehicles API
  console.log(`\n${colors.bold}3. Vehicles CRUD APIs${colors.reset}`);
  const vehicles = await fetch(`${BASE}/vehicles`, { headers: authHeaders }).then(r => r.json());
  assert(Array.isArray(vehicles) && vehicles.length > 0, "GET /api/vehicles", `Fetched ${vehicles.length} vehicles`);

  const newVehicle = await fetch(`${BASE}/vehicles`, {
    method: "POST",
    headers: authHeaders,
    body: JSON.stringify({
      model_name: "BharatBenz 1617R",
      license_plate: "DL-01-TEST-" + Math.floor(Math.random() * 8999 + 1000),
      max_capacity_kg: 9500,
      odometer: 14200,
      status: "Available",
    }),
  }).then(r => r.json());
  assert(newVehicle._id && newVehicle.model_name === "BharatBenz 1617R", "POST /api/vehicles", `Created vehicle: ${newVehicle.license_plate}`);

  const getVehicle = await fetch(`${BASE}/vehicles/${newVehicle._id}`, { headers: authHeaders }).then(r => r.json());
  assert(getVehicle.license_plate === newVehicle.license_plate, "GET /api/vehicles/:id", `Fetched vehicle ${getVehicle.license_plate}`);

  const updatedVehicle = await fetch(`${BASE}/vehicles/${newVehicle._id}`, {
    method: "PUT",
    headers: authHeaders,
    body: JSON.stringify({ odometer: 15000, status: "Available" }),
  }).then(r => r.json());
  assert(updatedVehicle.odometer === 15000, "PUT /api/vehicles/:id", `Updated odometer to ${updatedVehicle.odometer}`);

  const delVehicle = await fetch(`${BASE}/vehicles/${newVehicle._id}`, { method: "DELETE", headers: authHeaders }).then(r => r.json());
  assert(delVehicle.message === "Vehicle deleted", "DELETE /api/vehicles/:id", "Cleaned up test vehicle");

  // 4. Drivers API
  console.log(`\n${colors.bold}4. Drivers CRUD & Safety APIs${colors.reset}`);
  const drivers = await fetch(`${BASE}/drivers`, { headers: authHeaders }).then(r => r.json());
  assert(Array.isArray(drivers) && drivers.length > 0, "GET /api/drivers", `Fetched ${drivers.length} drivers`);

  const newDriver = await fetch(`${BASE}/drivers`, {
    method: "POST",
    headers: authHeaders,
    body: JSON.stringify({
      name: "Harish Patel",
      license_number: "DL-2024-TEST-" + Math.floor(Math.random() * 8999 + 1000),
      license_expiry_date: "2029-05-15",
      status: "Available",
      safety_score: 84,
    }),
  }).then(r => r.json());
  assert(newDriver._id && newDriver.name === "Harish Patel", "POST /api/drivers", `Created driver: ${newDriver.name}`);

  const getDriver = await fetch(`${BASE}/drivers/${newDriver._id}`, { headers: authHeaders }).then(r => r.json());
  assert(getDriver.name === "Harish Patel", "GET /api/drivers/:id", `Fetched driver ${getDriver.name}`);

  const patchSafety = await fetch(`${BASE}/drivers/${newDriver._id}/safety`, {
    method: "PATCH",
    headers: authHeaders,
    body: JSON.stringify({ safety_score: 92, status: "Available" }),
  }).then(r => r.json());
  assert(patchSafety.safety_score === 92, "PATCH /api/drivers/:id/safety", `Safety score updated to ${patchSafety.safety_score}`);

  const delDriver = await fetch(`${BASE}/drivers/${newDriver._id}`, { method: "DELETE", headers: authHeaders }).then(r => r.json());
  assert(delDriver.message === "Driver deleted", "DELETE /api/drivers/:id", "Cleaned up test driver");

  // 5. Trips API
  console.log(`\n${colors.bold}5. Trips & Dispatch APIs${colors.reset}`);
  const trips = await fetch(`${BASE}/trips`, { headers: authHeaders }).then(r => r.json());
  assert(Array.isArray(trips) && trips.length > 0, "GET /api/trips", `Fetched ${trips.length} trips`);

  // Create a trip with available vehicle and driver
  const availVehicle = vehicles.find(v => v.status === "Available") || vehicles[0];
  const availDriver = drivers.find(d => d.status === "Available") || drivers[0];

  const newTrip = await fetch(`${BASE}/trips`, {
    method: "POST",
    headers: authHeaders,
    body: JSON.stringify({
      vehicle_id: availVehicle._id,
      driver_id: availDriver._id,
      cargo_weight: 450,
      origin: "Delhi Central",
      destination: "Agra Logistics Hub",
      status: "Dispatched",
    }),
  }).then(r => r.json());
  assert(newTrip._id && newTrip.status === "Dispatched", "POST /api/trips", `Created trip ${newTrip.origin} -> ${newTrip.destination}`);

  const updateStatus = await fetch(`${BASE}/trips/${newTrip._id}/status`, {
    method: "PATCH",
    headers: authHeaders,
    body: JSON.stringify({ status: "Completed" }),
  }).then(r => r.json());
  assert(updateStatus.status === "Completed", "PATCH /api/trips/:id/status", `Status updated to ${updateStatus.status}`);

  const delTrip = await fetch(`${BASE}/trips/${newTrip._id}`, { method: "DELETE", headers: authHeaders }).then(r => r.json());
  assert(delTrip.message === "Trip deleted", "DELETE /api/trips/:id", "Cleaned up test trip");

  // 6. Maintenance API
  console.log(`\n${colors.bold}6. Maintenance Module APIs${colors.reset}`);
  const maintenance = await fetch(`${BASE}/maintenance`, { headers: authHeaders }).then(r => r.json());
  assert(Array.isArray(maintenance), "GET /api/maintenance", `Fetched ${maintenance.length} maintenance records`);

  const newMaint = await fetch(`${BASE}/maintenance`, {
    method: "POST",
    headers: authHeaders,
    body: JSON.stringify({
      vehicle_id: availVehicle._id,
      description: "Routine scheduled service inspection",
      cost: 2400,
      date: "2026-10-06",
    }),
  }).then(r => r.json());
  assert(newMaint._id && newMaint.cost === 2400, "POST /api/maintenance", `Logged repair: ₹${newMaint.cost}`);

  const delMaint = await fetch(`${BASE}/maintenance/${newMaint._id}`, { method: "DELETE", headers: authHeaders }).then(r => r.json());
  assert(delMaint.message === "Maintenance log deleted", "DELETE /api/maintenance/:id", "Cleaned up maintenance log");

  // 7. Fuel API
  console.log(`\n${colors.bold}7. Fuel & Expenditure APIs${colors.reset}`);
  const fuelLogs = await fetch(`${BASE}/fuel`, { headers: authHeaders }).then(r => r.json());
  assert(Array.isArray(fuelLogs), "GET /api/fuel", `Fetched ${fuelLogs.length} fuel logs`);

  const newFuel = await fetch(`${BASE}/fuel`, {
    method: "POST",
    headers: authHeaders,
    body: JSON.stringify({
      vehicle_id: availVehicle._id,
      liters: 42.5,
      cost: 4037,
      date: "2026-10-06",
    }),
  }).then(r => r.json());
  assert(newFuel._id && newFuel.liters === 42.5, "POST /api/fuel", `Logged fuel: ${newFuel.liters} L, ₹${newFuel.cost}`);

  const delFuel = await fetch(`${BASE}/fuel/${newFuel._id}`, { method: "DELETE", headers: authHeaders }).then(r => r.json());
  assert(delFuel.message === "Fuel log deleted", "DELETE /api/fuel/:id", "Cleaned up fuel log");

  // 8. Fleet Analytics & Aggregate Data
  console.log(`\n${colors.bold}8. Fleet Intelligence & Stats APIs${colors.reset}`);
  const stats = await fetch(`${BASE}/fleet/stats`, { headers: authHeaders }).then(r => r.json());
  assert(stats.activeFleet !== undefined && stats.totalOperationalCost !== undefined, "GET /api/fleet/stats", `Active fleet: ${stats.activeFleet}, Operational cost: ₹${stats.totalOperationalCost}`);

  const fleetData = await fetch(`${BASE}/fleet/data`, { headers: authHeaders }).then(r => r.json());
  assert(Array.isArray(fleetData.vehicles) && Array.isArray(fleetData.trips), "GET /api/fleet/data", `Vehicles: ${fleetData.vehicles.length}, Trips: ${fleetData.trips.length}, Drivers: ${fleetData.drivers.length}`);

  // 9. External Free APIs (Open-Meteo, OSRM, Nominatim)
  console.log(`\n${colors.bold}9. External Free APIs Integration${colors.reset}`);
  
  // Geocoding (Nominatim)
  const geocode = await fetch(`${BASE}/external/geocode?city=Delhi`, { headers: authHeaders }).then(r => r.json());
  assert(geocode.lat && geocode.lon, "GET /api/external/geocode?city=Delhi", `Lat: ${geocode.lat}, Lon: ${geocode.lon}`);

  // Live Weather (Open-Meteo)
  const weather = await fetch(`${BASE}/external/weather?city=Delhi`, { headers: authHeaders }).then(r => r.json());
  assert(weather.temperature_c !== undefined && weather.condition, "GET /api/external/weather?city=Delhi", `Temp: ${weather.temperature_c}°C, Condition: ${weather.condition}, Road Risk: ${weather.road_risk}`);

  // Routing (OSRM)
  const route = await fetch(`${BASE}/external/route?from=Delhi&to=Jaipur`, { headers: authHeaders }).then(r => r.json());
  assert(route.distance_km > 0 && route.duration_hours > 0, "GET /api/external/route?from=Delhi&to=Jaipur", `Distance: ${route.distance_km} km, Duration: ${route.duration_hours} hrs, Est Fuel: ${route.estimated_fuel_liters} L`);

  // Trip Road Advisory (OSRM + Open-Meteo combined)
  const advisory = await fetch(`${BASE}/external/trip-advisory?origin=Delhi&destination=Jaipur`, { headers: authHeaders }).then(r => r.json());
  assert(advisory.origin && advisory.destination && advisory.route && advisory.safety_advisory, "GET /api/external/trip-advisory", `Risk: ${advisory.safety_advisory?.overall_risk}, Advice: ${advisory.safety_advisory?.advice.slice(0, 40)}...`);

  // Summary
  console.log(`\n${colors.bold}${colors.cyan}========================================${colors.reset}`);
  console.log(`${colors.bold}TEST RESULTS: ${colors.green}${passed} PASSED${colors.reset}, ${failed === 0 ? colors.green : colors.red}${failed} FAILED${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}========================================${colors.reset}\n`);

  if (failed > 0) process.exit(1);
}

run().catch(err => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
