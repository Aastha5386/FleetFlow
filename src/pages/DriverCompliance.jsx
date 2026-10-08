import { useFleet } from "../fleetStore.jsx";
import { CheckIcon } from "../components/Icons.jsx";

export default function DriverCompliance() {
  const { state, updateDriverSafety } = useFleet();

  return (
    <>
      <div className="topbar"><h1>Driver Compliance Management</h1></div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Name</th><th>License #</th><th>License Status</th><th>Completed Trips</th><th>Safety Score</th><th>Driver Status</th><th>Update</th></tr></thead>
          <tbody>
            {state.drivers.length === 0 && <tr><td colSpan="7">No drivers found.</td></tr>}
            {state.drivers.map((d) => {
              const expired = new Date(d.license_expiry_date) < new Date();
              const completed = state.trips.filter((t) => {
                const dId = typeof t.driver_id === "object" ? t.driver_id._id : String(t.driver_id);
                return dId === d._id && t.status === "Completed";
              }).length;
              return (
                <tr key={d._id}>
                  <td>{d.name}</td><td>{d.license_number}</td>
                  <td>{expired ? <span className="badge status-expired">Expired</span> : <span className="badge status-available">Valid</span>}</td>
                  <td>{completed}</td>
                  <td>{d.safety_score >= 80 ? <span className="badge status-high-safety-score">{d.safety_score} · High</span> : <span className="badge status-low-safety-score">{d.safety_score} · Low</span>}</td>
                  <td><span className={`badge status-${d.status.toLowerCase().replace(" ", "-")}`}>{d.status}</span></td>
                  <td>
                    <form className="inline-actions" onSubmit={(e) => {
                      e.preventDefault();
                      const fd = new FormData(e.target);
                      updateDriverSafety(d._id, { safety_score: Number(fd.get("safety_score")), status: fd.get("status") });
                    }}>
                      <input type="number" name="safety_score" min="0" max="100" defaultValue={d.safety_score} required className="w-88" />
                      <select name="status" defaultValue={d.status}>
                        <option>Available</option><option>Suspended</option>
                      </select>
                      <button type="submit" className="btn-action-symbol btn-action-check" title="Save Compliance Updates">
                        <CheckIcon size={16} />
                      </button>
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
