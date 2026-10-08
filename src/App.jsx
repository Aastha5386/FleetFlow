import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Layout, { HomeRedirect } from "./Layout.jsx";
import { FleetProvider, useFleet } from "./fleetStore.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ManagerDashboard from "./pages/ManagerDashboard.jsx";
import DriverDashboard from "./pages/DriverDashboard.jsx";
import DispatcherDashboard from "./pages/DispatcherDashboard.jsx";
import SafetyDashboard from "./pages/SafetyDashboard.jsx";
import DriverCompliance from "./pages/DriverCompliance.jsx";
import FinancialDashboard from "./pages/FinancialDashboard.jsx";
import Vehicles from "./pages/Vehicles.jsx";
import VehicleEdit from "./pages/VehicleEdit.jsx";
import Drivers from "./pages/Drivers.jsx";
import DriverEdit from "./pages/DriverEdit.jsx";
import Trips from "./pages/Trips.jsx";
import Maintenance from "./pages/Maintenance.jsx";
import Intelligence from "./pages/Intelligence.jsx";
import Settings from "./pages/Settings.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import PWAInstallBanner from "./components/PWAInstallBanner.jsx";

function Protected({ children, allowedRoles }) {
  const { session } = useFleet();
  if (!session) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(session.role) && session.role !== "Manager") {
    return <Navigate to="/" replace />;
  }
  return <Layout>{children}</Layout>;
}

export default function App() {
  return (
    <FleetProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Role-Specific Home Dashboards */}
          <Route
            path="/dashboard"
            element={
              <Protected allowedRoles={["Manager"]}>
                <ManagerDashboard />
              </Protected>
            }
          />
          <Route
            path="/driver/dashboard"
            element={
              <Protected allowedRoles={["Driver"]}>
                <DriverDashboard />
              </Protected>
            }
          />
          <Route
            path="/dispatcher/dashboard"
            element={
              <Protected allowedRoles={["Dispatcher"]}>
                <DispatcherDashboard />
              </Protected>
            }
          />
          <Route
            path="/safety/dashboard"
            element={
              <Protected allowedRoles={["Safety Officer"]}>
                <SafetyDashboard />
              </Protected>
            }
          />
          <Route
            path="/safety/drivers"
            element={
              <Protected allowedRoles={["Safety Officer"]}>
                <DriverCompliance />
              </Protected>
            }
          />
          <Route
            path="/financial/dashboard"
            element={
              <Protected allowedRoles={["Financial Analyst"]}>
                <FinancialDashboard />
              </Protected>
            }
          />

          {/* Operational Modules */}
          <Route
            path="/vehicles"
            element={
              <Protected>
                <Vehicles />
              </Protected>
            }
          />
          <Route
            path="/vehicles/:id/edit"
            element={
              <Protected allowedRoles={["Manager"]}>
                <VehicleEdit />
              </Protected>
            }
          />
          <Route
            path="/drivers"
            element={
              <Protected>
                <Drivers />
              </Protected>
            }
          />
          <Route
            path="/drivers/:id/edit"
            element={
              <Protected allowedRoles={["Manager", "Safety Officer"]}>
                <DriverEdit />
              </Protected>
            }
          />
          <Route
            path="/trips"
            element={
              <Protected>
                <Trips />
              </Protected>
            }
          />
          <Route
            path="/maintenance"
            element={
              <Protected>
                <Maintenance />
              </Protected>
            }
          />
          <Route
            path="/intelligence"
            element={
              <Protected>
                <Intelligence />
              </Protected>
            }
          />
          <Route
            path="/settings"
            element={
              <Protected>
                <Settings />
              </Protected>
            }
          />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <PWAInstallBanner />
      </BrowserRouter>
    </FleetProvider>
  );
}
