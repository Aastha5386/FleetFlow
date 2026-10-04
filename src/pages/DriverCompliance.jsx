import { useFleet } from "../fleetStore.jsx";

export default function DriverCompliance() {
  const { state, updateDriverSafety } = useFleet();

  return (
    <>
      <div className="topbar"><h1>Driver Compliance Management</h1></div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>ID</th><th>Name</th><th>License #</th><th>License Status</th><th>Completed Trips</th><th>Safety Score</th><th>Driver Status</th><th>Update</th></tr></thead>
          <tbody>
            {state.drivers.length === 0 && <tr><td colSpan="8">No drivers found.</td></tr>}
            {state.drivers.map((d) => {
              const expired = new Date(d.license_expiry_date) < new Date();
              const completed = state.trips.filter((t) => String(t.driver_id) === String(d.id) && t.status === "Completed").length;
              return (
                <tr key={d.id}>
                  <td>#{d.id}</td><td>{d.name}</td><td>{d.license_number}</td>
                  <td>{expired ? <span className="badge status-expired">Expired</span> : <span className="badge status-available">Valid</span>}</td>
                  <td>{completed}</td>
                  <td>{d.safety_score >= 80 ? <span className="badge status-high-safety-score">{d.safety_score} · High Safety Score</span> : <span className="badge status-low-safety-score">{d.safety_score} · Low Safety Score</span>}</td>
                  <td><span className={`badge status-${d.status.toLowerCase().replace(" ", "-")}`}>{d.status}</span></td>
                  <td>
                    <form className="inline-actions" onSubmit={(e) => {
                      e.preventDefault();
                      const fd = new FormData(e.target);
                      updateDriverSafety(d.id, { safety_score: Number(fd.get("safety_score")), status: fd.get("status") });
                    }}>
                      <input type="number" name="safety_score" min="0" max="100" defaultValue={d.safety_score} required className="w-88" />
                      <select name="status" defaultValue={d.status}>
                        <option>Available</option><option>Suspended</option>
                      </select>
                      <button type="submit" className="secondary">Save</button>
                    </form>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
