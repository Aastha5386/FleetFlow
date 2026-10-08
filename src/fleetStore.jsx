import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { api } from "./api.js";

const FleetContext = createContext(null);

const SESSION_KEY = "fleetflow-session";

function loadSession() {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY)); } catch { return null; }
}

export function FleetProvider({ children }) {
  const [session, setSession]         = useState(loadSession);
  const [state, setState]             = useState({ vehicles: [], drivers: [], trips: [], maintenance: [], fuel: [], users: [] });
  const [loading, setLoading]         = useState(false);
  const [apiError, setApiError]       = useState(null);

  // ── Persist session token ─────────────────────────────────────────────────
  useEffect(() => {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }, [session]);

  // ── Fetch helpers ─────────────────────────────────────────────────────────
  const fetchAll = useCallback(async () => {
    if (!session) return;
    setLoading(true);
    try {
      const [vehicles, drivers, trips, maintenance, fuel] = await Promise.all([
        api.getVehicles(),
        api.getDrivers(),
        api.getTrips(),
        api.getMaintenance(),
        api.getFuel(),
      ]);
      let users = [];
      if (session.role === "Manager") {
        users = await api.getUsers().catch(() => []);
      }
      setState({ vehicles, drivers, trips, maintenance, fuel, users });
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // ── Auth ──────────────────────────────────────────────────────────────────
  const login = async (username, password) => {
    try {
      const data = await api.login({ username, password });
      // Store full session including token immediately
      const sessionData = { ...data.user, token: data.token };
      localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
      setSession(sessionData);
      return { ok: true, user: data.user };
    } catch (err) {
      return { ok: false, message: err.message };
    }
  };

  const googleLogin = async (payload) => {
    try {
      const data = await api.googleLogin(payload);
      const sessionData = { ...data.user, token: data.token };
      localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
      setSession(sessionData);
      return { ok: true, user: data.user };
    } catch (err) {
      return { ok: false, message: err.message };
    }
  };

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    setSession(null);
    setState({ vehicles: [], drivers: [], trips: [], maintenance: [], fuel: [], users: [] });
  };

  const register = async (data) => {
    try {
      const res = await api.register(data);
      // Account created; do not auto-login so user signs in explicitly
      return { ok: true, user: res.user, message: res.message };
    } catch (err) {
      return { ok: false, message: err.message };
    }
  };

  const resetPassword = async (payload) => {
    try {
      const res = await api.resetPassword(payload);
      return { ok: true, message: res.message };
    } catch (err) {
      return { ok: false, message: err.message };
    }
  };

  const updateProfile = async (formData) => {
    try {
      const res = await api.updateProfile(formData);
      if (res.user) {
        const updatedSession = { ...session, ...res.user, token: res.token || session?.token };
        setSession(updatedSession);
        localStorage.setItem(SESSION_KEY, JSON.stringify(updatedSession));
      }
      return { ok: true, message: res.message, user: res.user };
    } catch (err) {
      return { ok: false, message: err.message };
    }
  };

  const updateSettings = async (settingsData) => {
    try {
      const res = await api.updateSettings(settingsData);
      if (res.user) {
        const updatedSession = { ...session, ...res.user, settings: res.settings };
        setSession(updatedSession);
        localStorage.setItem(SESSION_KEY, JSON.stringify(updatedSession));
      }
      return { ok: true, message: res.message, settings: res.settings };
    } catch (err) {
      return { ok: false, message: err.message };
    }
  };

  // ── Users (Manager) ───────────────────────────────────────────────────────
  const approveUser = async (id) => {
    await api.approveUser(id);
    setState(s => ({ ...s, users: s.users.map(u => u._id === id ? { ...u, status: "approved" } : u) }));
  };

  const rejectUser = async (id) => {
    await api.rejectUser(id);
    setState(s => ({ ...s, users: s.users.map(u => u._id === id ? { ...u, status: "rejected" } : u) }));
  };

  const deleteUser = async (id) => {
    await api.deleteUser(id);
    setState(s => ({ ...s, users: s.users.filter(u => u._id !== id) }));
  };

  // ── Vehicles ──────────────────────────────────────────────────────────────
  const addVehicle = async (v) => {
    const created = await api.createVehicle(v);
    setState(s => ({ ...s, vehicles: [created, ...s.vehicles] }));
  };

  const editVehicle = async (id, v) => {
    const updated = await api.updateVehicle(id, v);
    setState(s => ({ ...s, vehicles: s.vehicles.map(x => x._id === id ? updated : x) }));
  };

  const deleteVehicle = async (id) => {
    await api.deleteVehicle(id);
    setState(s => ({ ...s, vehicles: s.vehicles.filter(x => x._id !== id) }));
  };

  // ── Drivers ───────────────────────────────────────────────────────────────
  const addDriver = async (d) => {
    const created = await api.createDriver(d);
    setState(s => ({ ...s, drivers: [created, ...s.drivers] }));
  };

  const editDriver = async (id, d) => {
    const updated = await api.updateDriver(id, d);
    setState(s => ({ ...s, drivers: s.drivers.map(x => x._id === id ? updated : x) }));
  };

  const deleteDriver = async (id) => {
    await api.deleteDriver(id);
    setState(s => ({ ...s, drivers: s.drivers.filter(x => x._id !== id) }));
  };

  // ── Trips ─────────────────────────────────────────────────────────────────
  const addTrip = async (t) => {
    const created = await api.createTrip(t);
    setState(s => {
      const vehicles = s.vehicles.map(v =>
        v._id === String(t.vehicle_id) && t.status === "Dispatched"
          ? { ...v, status: "On Trip" }
          : v
      );
      return { ...s, trips: [created, ...s.trips], vehicles };
    });
    return created;
  };

  const updateTripStatus = async (id, status) => {
    const updated = await api.updateTripStatus(id, status);
    setState(s => {
      // Sync vehicle status from populated trip data
      const vId = updated.vehicle_id?._id || updated.vehicle_id;
      let vehicles = s.vehicles;
      if (status === "Dispatched") {
        vehicles = s.vehicles.map(v => v._id === vId ? { ...v, status: "On Trip" } : v);
      } else if (status === "Completed" || status === "Cancelled") {
        vehicles = s.vehicles.map(v => v._id === vId && v.status === "On Trip" ? { ...v, status: "Available" } : v);
      }
      return { ...s, trips: s.trips.map(t => t._id === id ? updated : t), vehicles };
    });
  };

  const deleteTrip = async (id) => {
    await api.deleteTrip(id);
    setState(s => ({ ...s, trips: s.trips.filter(t => t._id !== id) }));
  };

  // ── Maintenance ───────────────────────────────────────────────────────────
  const addMaintenance = async (m) => {
    const created = await api.createMaintenance(m);
    setState(s => ({
      ...s,
      maintenance: [created, ...s.maintenance],
      vehicles: s.vehicles.map(v => v._id === String(m.vehicle_id) ? { ...v, status: "In Shop" } : v),
    }));
  };

  // ── Fuel ──────────────────────────────────────────────────────────────────
  const addFuel = async (f) => {
    const created = await api.createFuel(f);
    setState(s => ({ ...s, fuel: [created, ...s.fuel] }));
  };

  // ── Safety ────────────────────────────────────────────────────────────────
  const updateDriverSafety = async (id, patch) => {
    const updated = await api.updateDriverSafety(id, patch);
    setState(s => ({ ...s, drivers: s.drivers.map(d => d._id === id ? updated : d) }));
  };

  // ── Reset (dev helper) ────────────────────────────────────────────────────
  const reset = () => {
    logout();
  };

  return (
    <FleetContext.Provider value={{
      state, session, loading, apiError,
      login, googleLogin, logout, register, resetPassword,
      updateProfile, updateSettings,
      approveUser, rejectUser, deleteUser,
      addVehicle, editVehicle, deleteVehicle,
      addDriver, editDriver, deleteDriver,
      addTrip, updateTripStatus, deleteTrip,
      addMaintenance,
      addFuel,
      updateDriverSafety,
      reset,
      refetch: fetchAll,
    }}>
      {children}
    </FleetContext.Provider>
  );
}

export function useFleet() { return useContext(FleetContext); }
