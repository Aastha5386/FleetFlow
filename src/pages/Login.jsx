import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFleet } from "../fleetStore.jsx";

export default function Login() {
  const { login } = useFleet();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = (e) => {
    e.preventDefault();
    const res = login(username, password);
    if (res.ok) navigate("/");
    else setError(res.message);
  };

  return (
    <div className="login-shell">
      <div className="login-card">
        <h2>FleetFlow Lite Login</h2>
        <details className="mt-10">
          <summary>Initial credentials</summary>
          <div className="mt-10" style={{ textAlign: "left" }}>
            <div><strong>Manager</strong></div>
            <div>Username: <code>manager</code></div>
            <div>Password: <code>manager123</code></div>
          </div>
        </details>
        {error && <div className="flash flash-error">{error}</div>}
        <form onSubmit={submit}>
          <div className="input-group"><label>Username</label><input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required /></div>
          <div className="input-group mt-10"><label>Password</label><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></div>
          <button type="submit" className="mt-14 w-full">Login</button>
        </form>
        <div className="mt-14" style={{ textAlign: "center" }}><a href="#">Forget Password</a></div>
        <div className="mt-14" style={{ textAlign: "center" }}><Link to="/register">Not registered? Request access</Link></div>
      </div>
    </div>
  );
}
