import { NavLink, Navigate, useNavigate } from "react-router-dom";
import { useFleet } from "./fleetStore.jsx";

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
        <div className="sidebar-brand"><span className="sidebar-brand-dot"></span><h2>FleetFlow</h2></div>
        <div className="role">{session?.username} · {role}</div>
        {role === "Manager" && <>
          {link("/dashboard", "Dashboard", "D")}
          {link("/vehicles", "Vehicles", "V")}
          {link("/drivers", "Drivers", "R")}
          {link("/maintenance", "Maintenance", "M")}
        </>}
        {role === "Dispatcher" && <>
          {link("/drivers", "Drivers", "R")}
          {link("/trips", "Trips", "T")}
        </>}
        {role === "Safety Officer" && <>
          {link("/drivers", "Drivers", "R")}
          {link("/safety/dashboard", "Safety Dashboard", "S")}
          {link("/safety/drivers", "Driver Compliance", "C")}
        </>}
        {role === "Financial Analyst" && <>
          {link("/drivers", "Drivers", "R")}
          {link("/financial/dashboard", "Financial Dashboard", "F")}
        </>}
        {link("/intelligence", "Intelligence Hub", "I")}
        <a className="nav-link" href="#/logout" onClick={(e) => { e.preventDefault(); logout(); navigate("/login"); }}><span className="nav-icon">L</span><span className="nav-text">Logout</span></a>
      </aside>
      <main className="content">
        <div className="content-topbar">
          <div className="content-topbar-left"><span>Dashboard Workspace</span></div>
          <div className="content-topbar-right">
            <div className="topbar-search-wrap"><input className="topbar-search" type="text" placeholder="Search anything..." /></div>
            <span className="role-badge">{role}</span>
            <span className="avatar-pill">{(session?.username || "U")[0].toUpperCase()}</span>
          </div>
        </div>
        {children}
      </main>
    </div>
  );
}

export function HomeRedirect() {
  const { session } = useFleet();
  const homeByRole = { Manager: "/dashboard", Dispatcher: "/trips", "Safety Officer": "/safety/dashboard", "Financial Analyst": "/financial/dashboard" };
  return <Navigate to={session ? homeByRole[session.role] : "/login"} replace />;
}
