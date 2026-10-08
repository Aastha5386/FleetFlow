import { NavLink, Link, Navigate, useNavigate } from "react-router-dom";
import { useFleet } from "./fleetStore.jsx";
import {
  DashboardIcon,
  TruckIcon,
  UserIcon,
  RouteIcon,
  WrenchIcon,
  ShieldIcon,
  ChartIcon,
  ZapIcon,
  SettingsIcon,
  SignOutIcon
} from "./components/Icons.jsx";

export default function Layout({ children }) {
  const { session, logout } = useFleet();
  const navigate = useNavigate();
  const role = session?.role;

  const link = (to, label, icon) => (
    <NavLink key={to} to={to} className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}>
      <span className="nav-icon">{icon}</span><span className="nav-text">{label}</span>
    </NavLink>
  );

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="sidebar-brand-dot"></span>
          <h2>FleetFlow</h2>
        </div>
        <div className="role">
          {session?.name || session?.username} · <strong>{role}</strong>
        </div>

        {/* Manager Links */}
        {role === "Manager" && (
          <>
            {link("/dashboard", "Fleet Overview", <DashboardIcon />)}
            {link("/vehicles", "Vehicles", <TruckIcon />)}
            {link("/drivers", "Drivers", <UserIcon />)}
            {link("/trips", "Trip Registry", <RouteIcon />)}
            {link("/maintenance", "Maintenance", <WrenchIcon />)}
            {link("/safety/dashboard", "Safety Center", <ShieldIcon />)}
            {link("/financial/dashboard", "Financials", <ChartIcon />)}
          </>
        )}

        {/* Driver Links */}
        {role === "Driver" && (
          <>
            {link("/driver/dashboard", "Driver Portal", <DashboardIcon />)}
            {link("/trips", "My Trips", <RouteIcon />)}
          </>
        )}

        {/* Dispatcher Links */}
        {role === "Dispatcher" && (
          <>
            {link("/dispatcher/dashboard", "Dispatch Board", <DashboardIcon />)}
            {link("/trips", "Trips", <RouteIcon />)}
            {link("/vehicles", "Fleet Vehicles", <TruckIcon />)}
            {link("/drivers", "Drivers", <UserIcon />)}
          </>
        )}

        {/* Safety Officer Links */}
        {role === "Safety Officer" && (
          <>
            {link("/safety/dashboard", "Safety Overview", <ShieldIcon />)}
            {link("/safety/drivers", "Driver Compliance", <ShieldIcon />)}
            {link("/drivers", "Driver Roster", <UserIcon />)}
          </>
        )}

        {/* Financial Analyst Links */}
        {role === "Financial Analyst" && (
          <>
            {link("/financial/dashboard", "Cost Dashboard", <ChartIcon />)}
            {link("/vehicles", "Vehicle Efficiency", <TruckIcon />)}
            {link("/maintenance", "Maintenance Logs", <WrenchIcon />)}
          </>
        )}

        {/* Common Modules */}
        {link("/intelligence", "Intelligence Hub", <ZapIcon />)}
        {link("/settings", "Profile & Settings", <SettingsIcon />)}

        <a
          className="nav-link nav-signout mt-14"
          href="#/logout"
          onClick={(e) => {
            e.preventDefault();
            logout();
            navigate("/login");
          }}
        >
          <span className="nav-icon" style={{ background: "#FEE2E2", color: "#DC2626" }}>
            <SignOutIcon size={16} color="#DC2626" />
          </span>
          <span className="nav-text">Sign Out</span>
        </a>
      </aside>

      <main className="content">
        <div className="content-topbar">
          <div className="content-topbar-left">
            <span>Workspace: <strong>{role} Portal</strong></span>
          </div>
          <div className="content-topbar-right">
            <div className="system-status-pill">
              <span className="live-pulse"></span>
              <span>Fleet Telemetry • Active</span>
            </div>
            <span className="role-badge">
              {role}
            </span>
            <Link
              to="/settings"
              className="avatar-pill"
              title={`${session?.name || session?.username} (${session?.email}) — Click for Profile & Settings`}
              style={{ textDecoration: "none", cursor: "pointer", transition: "transform 0.2s ease" }}
            >
              {(session?.name || session?.username || "U")[0].toUpperCase()}
            </Link>
          </div>
        </div>
        {children}
      </main>
    </div>
  );
}

export function HomeRedirect() {
  const { session } = useFleet();
  const homeByRole = {
    Manager: "/dashboard",
    Driver: "/driver/dashboard",
    Dispatcher: "/dispatcher/dashboard",
    "Safety Officer": "/safety/dashboard",
    "Financial Analyst": "/financial/dashboard",
  };
  return <Navigate to={session ? (homeByRole[session.role] || "/dashboard") : "/login"} replace />;
}
