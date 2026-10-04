import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Layout, { HomeRedirect } from "./Layout.jsx";
import { FleetProvider, useFleet } from "./fleetStore.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ManagerDashboard from "./pages/ManagerDashboard.jsx";
import Vehicles from "./pages/Vehicles.jsx";
import VehicleEdit from "./pages/VehicleEdit.jsx";
import Drivers from "./pages/Drivers.jsx";
import DriverEdit from "./pages/DriverEdit.jsx";
import Trips from "./pages/Trips.jsx";
import Maintenance from "./pages/Maintenance.jsx";
import SafetyDashboard from "./pages/SafetyDashboard.jsx";
import DriverCompliance from "./pages/DriverCompliance.jsx";
import FinancialDashboard from "./pages/FinancialDashboard.jsx";
import Intelligence from "./pages/Intelligence.jsx";

function Protected({ children }) {
  const { session } = useFleet();
  if (!session) return <Navigate to="/login" replace />;
  return <Layout>{children}</Layout>;
}

export default function App() {
  return (
    <FleetProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<HomeRedirect />} />
          <Route path="/dashboard" element={<Protected><ManagerDashboard /></Protected>} />
          <Route path="/vehicles" element={<Protected><Vehicles /></Protected>} />
          <Route path="/vehicles/:id/edit" element={<Protected><VehicleEdit /></Protected>} />
          <Route path="/drivers" element={<Protected><Drivers /></Protected>} />
          <Route path="/drivers/:id/edit" element={<Protected><DriverEdit /></Protected>} />
          <Route path="/trips" element={<Protected><Trips /></Protected>} />
          <Route path="/maintenance" element={<Protected><Maintenance /></Protected>} />
          <Route path="/safety/dashboard" element={<Protected><SafetyDashboard /></Protected>} />
          <Route path="/safety/drivers" element={<Protected><DriverCompliance /></Protected>} />
          <Route path="/financial/dashboard" element={<Protected><FinancialDashboard /></Protected>} />
          <Route path="/intelligence" element={<Protected><Intelligence /></Protected>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </FleetProvider>
  );
}
