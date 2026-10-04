import { createContext, useContext, useEffect, useState } from "react";

const FleetContext = createContext(null);

const demoData = {
  users: [{ id: 1, username: "manager", name: "Fleet Manager", email: "manager@fleetflow.local", role: "Manager", status: "approved", password: "manager123" }],
  vehicles: [
    { id: 1, model_name: "Tata Ace Gold", license_plate: "DL-01-AB-1001", max_capacity_kg: 750, odometer: 42000, status: "On Trip" },
    { id: 2, model_name: "Eicher Pro 2049", license_plate: "DL-01-AB-1002", max_capacity_kg: 4800, odometer: 96500, status: "On Trip" },
    { id: 3, model_name: "Mahindra Bolero Pickup", license_plate: "DL-01-AB-1003", max_capacity_kg: 1000, odometer: 61000, status: "Available" },
    { id: 4, model_name: "Ashok Leyland Dost", license_plate: "DL-01-AB-1004", max_capacity_kg: 1500, odometer: 128000, status: "In Shop" },
    { id: 5, model_name: "Tata 407", license_plate: "DL-01-AB-1005", max_capacity_kg: 2500, odometer: 153000, status: "Available" },
  ],
  drivers: [
    { id: 1, name: "Ravi Kumar", license_number: "DL-2019-101", license_expiry_date: "2027-11-09", status: "On Trip", safety_score: 88 },
    { id: 2, name: "Suresh Singh", license_number: "DL-2018-202", license_expiry_date: "2026-10-24", status: "On Trip", safety_score: 64 },
    { id: 3, name: "Amit Verma", license_number: "DL-2020-303", license_expiry_date: "2028-06-01", status: "Available", safety_score: 91 },
    { id: 4, name: "Deepak Yadav", license_number: "DL-2017-404", license_expiry_date: "2026-09-19", status: "Suspended", safety_score: 42 },
    { id: 5, name: "Mohit Sharma", license_number: "DL-2021-505", license_expiry_date: "2028-11-24", status: "Available", safety_score: 79 },
  ],
  trips: [
    { id: 1, vehicle_id: 1, driver_id: 1, cargo_weight: 600, origin: "Delhi", destination: "Jaipur", status: "Dispatched", created_at: "2026-10-03" },
    { id: 2, vehicle_id: 2, driver_id: 2, cargo_weight: 4200, origin: "Mumbai", destination: "Pune", status: "Dispatched", created_at: "2026-10-02" },
    { id: 3, vehicle_id: 3, driver_id: 3, cargo_weight: 850, origin: "Gurgaon", destination: "Agra", status: "Draft", created_at: "2026-10-04" },
    { id: 4, vehicle_id: 1, driver_id: 1, cargo_weight: 700, origin: "Delhi", destination: "Lucknow", status: "Completed", created_at: "2026-09-29" },
    { id: 5, vehicle_id: 5, driver_id: 5, cargo_weight: 2300, origin: "Noida", destination: "Kanpur", status: "Completed", created_at: "2026-09-27" },
    { id: 6, vehicle_id: 4, driver_id: 4, cargo_weight: 1400, origin: "Faridabad", destination: "Chandigarh", status: "Cancelled", created_at: "2026-09-25" },
  ],
  maintenance: [
    { id: 1, vehicle_id: 4, description: "Engine overhaul", cost: 28000, date: "2026-10-02" },
    { id: 2, vehicle_id: 2, description: "Brake pad replacement", cost: 6400, date: "2026-09-24" },
    { id: 3, vehicle_id: 1, description: "Oil change", cost: 3200, date: "2026-09-14" },
    { id: 4, vehicle_id: 5, description: "Tyre rotation", cost: 1800, date: "2026-08-20" },
    { id: 5, vehicle_id: 3, description: "AC service", cost: 4500, date: "2026-07-21" },
  ],
  fuel: [
    { id: 1, vehicle_id: 1, liters: 28.5, cost: 2720, date: "2026-10-03" },
    { id: 2, vehicle_id: 2, liters: 145.0, cost: 13800, date: "2026-10-02" },
    { id: 3, vehicle_id: 3, liters: 34.0, cost: 3200, date: "2026-09-30" },
    { id: 4, vehicle_id: 5, liters: 68.0, cost: 6450, date: "2026-09-28" },
    { id: 5, vehicle_id: 1, liters: 25.0, cost: 2380, date: "2026-09-26" },
    { id: 6, vehicle_id: 4, liters: 30.0, cost: 2850, date: "2026-09-22" },
  ],
};

const KEY = "fleetflow-state-v1";

function loadState() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) { /* ignore */ }
  return { ...demoData };
}

let idSeq = 100;
const nextId = () => ++idSeq;

export function FleetProvider({ children }) {
  const [state, setState] = useState(loadState);
  const [session, setSession] = useState(() => {
    try { return JSON.parse(localStorage.getItem("fleetflow-session")); } catch { return null; }
  });

  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(state)); }, [state]);
  useEffect(() => { localStorage.setItem("fleetflow-session", JSON.stringify(session)); }, [session]);

  const update = (fn) => setState((s) => fn({ ...s }));

  const login = (username, password) => {
    const u = state.users.find((x) => x.username === username && x.password === password);
    if (!u) return { ok: false, message: "Invalid credentials" };
    if (u.status !== "approved") return { ok: false, message: "Account is not approved yet" };
    setSession(u);
    return { ok: true, user: u };
  };
  const logout = () => setSession(null);
  const register = (data) => {
    if (state.users.some((u) => u.username === data.username)) return { ok: false, message: "Username taken" };
    update((s) => { s.users = [...s.users, { ...data, id: nextId(), status: "pending" }]; return s; });
    return { ok: true };
  };
  const approveUser = (id) => update((s) => { s.users = s.users.map((u) => (u.id === id ? { ...u, status: "approved" } : u)); return s; });
  const rejectUser = (id) => update((s) => { s.users = s.users.map((u) => (u.id === id ? { ...u, status: "rejected" } : u)); return s; });
  const deleteUser = (id) => update((s) => { s.users = s.users.filter((u) => u.id !== id); return s; });

  const addVehicle = (v) => update((s) => { s.vehicles = [...s.vehicles, { ...v, id: nextId() }]; return s; });
  const editVehicle = (id, v) => update((s) => { s.vehicles = s.vehicles.map((x) => (x.id === id ? { ...x, ...v } : x)); return s; });
  const deleteVehicle = (id) => update((s) => { s.vehicles = s.vehicles.filter((x) => x.id !== id); return s; });

  const addDriver = (d) => update((s) => { s.drivers = [...s.drivers, { ...d, id: nextId(), safety_score: d.safety_score ?? 75 }]; return s; });
  const editDriver = (id, d) => update((s) => { s.drivers = s.drivers.map((x) => (x.id === id ? { ...x, ...d } : x)); return s; });
  const deleteDriver = (id) => update((s) => { s.drivers = s.drivers.filter((x) => x.id !== id); return s; });

  const addTrip = (t) => update((s) => {
    s.trips = [...s.trips, { ...t, id: nextId(), created_at: new Date().toISOString().slice(0, 10) }];
    const v = s.vehicles.find((x) => x.id === Number(t.vehicle_id));
    if (v && t.status === "Dispatched") v.status = "On Trip";
    return s;
  });
  const updateTripStatus = (id, status) => update((s) => {
    s.trips = s.trips.map((t) => {
      if (t.id !== id) return t;
      const v = s.vehicles.find((x) => x.id === Number(t.vehicle_id));
      if (v) {
        if (status === "Dispatched") v.status = "On Trip";
        else if (status === "Completed" || status === "Cancelled") v.status = v.status === "On Trip" ? "Available" : v.status;
      }
      return { ...t, status };
    });
    return s;
  });
  const deleteTrip = (id) => update((s) => { s.trips = s.trips.filter((t) => t.id !== id); return s; });

  const addMaintenance = (m) => update((s) => {
    s.maintenance = [...s.maintenance, { ...m, id: nextId() }];
    const v = s.vehicles.find((x) => x.id === Number(m.vehicle_id));
    if (v) v.status = "In Shop";
    return s;
  });
  const addFuel = (f) => update((s) => { s.fuel = [...s.fuel, { ...f, id: nextId() }]; return s; });
  const updateDriverSafety = (id, patch) => update((s) => { s.drivers = s.drivers.map((d) => (d.id === id ? { ...d, ...patch } : d)); return s; });

  const reset = () => { localStorage.removeItem(KEY); setState({ ...demoData }); setSession(null); };

  return (
    <FleetContext.Provider value={{ state, session, login, logout, register, approveUser, rejectUser, deleteUser, addVehicle, editVehicle, deleteVehicle, addDriver, editDriver, deleteDriver, addTrip, updateTripStatus, deleteTrip, addMaintenance, addFuel, updateDriverSafety, reset }}>
      {children}
    </FleetContext.Provider>
  );
}

export function useFleet() { return useContext(FleetContext); }
