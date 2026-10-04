import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFleet } from "../fleetStore.jsx";

const ROLES = ["Dispatcher", "Safety Officer", "Financial Analyst"];

export default function Register() {
  const { register, state } = useFleet();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "" });
  const [msg, setMsg] = useState("");

  const takenRoles = new Set(state.users.filter((u) => u.status !== "rejected" && u.role !== "Manager").map((u) => u.role));
  const available = ROLES.filter((r) => !takenRoles.has(r));

  const submit = (e) => {
    e.preventDefault();
    const username = form.email.split("@")[0] || form.name.replace(/\s+/g, "").toLowerCase();
    const res = register({ ...form, username });
    setMsg(res.ok ? "Request submitted. Wait for manager approval." : res.message);
    if (res.ok) setTimeout(() => navigate("/login"), 1200);
  };

  return (
    <div className="login-shell">
      <div className="login-card">
        <h2>Request Access</h2>
        {msg && <div className="flash flash-info">{msg}</div>}
        {available.length === 0 ? <p className="role">All roles assigned</p> : (
          <form onSubmit={submit}>
            <div className="input-group"><label>Name</label><input type="text" value={form.name} required onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div className="input-group mt-10"><label>Email</label><input type="email" value={form.email} required onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
            <div className="input-group mt-10"><label>Password</label><input type="password" value={form.password} required onChange={(e) => setForm({ ...form, password: e.target.value })} /></div>
            <div className="input-group mt-10"><label>Role</label>
              <select required value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                <option value="">Select role</option>
                {available.map((r) => <option key={r}>{r}</option>)}
              </select>
            </div>
            <button type="submit" className="mt-14 w-full">Submit</button>
          </form>
        )}
        <div className="mt-14" style={{ textAlign: "center" }}><Link to="/login">Back to login</Link></div>
      </div>
    </div>
  );
}
