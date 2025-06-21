import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function AdminAttendance() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userIdFilter, setUserIdFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const navigate = useNavigate();

  const fetchLogs = () => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    try {
      const decoded = jwtDecode(token);
      if (!decoded.is_admin) return navigate("/login");

      const params = {};
      if (userIdFilter) params.user_id = userIdFilter;
      if (dateFilter) params.punch_date = dateFilter;

      setLoading(true);
      axios.get("http://localhost:8000/admin/attendance", {
        headers: { Authorization: `Bearer ${token}` },
        params,
      })
      .then((res) => setLogs(res.data))
      .catch((err) => {
        if (err.response?.status === 403) navigate("/login");
        else console.error("Failed to load attendance", err);
      })
      .finally(() => setLoading(false));

    } catch (err) {
      console.error("Invalid token", err);
      navigate("/login");
    }
  };

  useEffect(() => {
    fetchLogs(); // load initially
  },[]);

  return (
    <div className="container mt-5">
      <h3>All Attendance Logs</h3>

      {/* Filters */}
      <div className="row mb-4">
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            placeholder="Filter by User ID"
            value={userIdFilter}
            onChange={(e) => setUserIdFilter(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <input
            type="date"
            className="form-control"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
        </div>
        <div className="col-md-2">
          <button className="btn btn-primary w-100" onClick={fetchLogs}>Apply Filter</button>
        </div>
        <div className="col-md-2">
          <button className="btn btn-secondary w-100" onClick={() => {
            setUserIdFilter("");
            setDateFilter("");
            fetchLogs();
          }}>Clear</button>
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>ID</th><th>User ID</th><th>Date</th><th>Time</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id}>
                <td>{log.id}</td>
                <td>{log.user_id}</td>
                <td>{log.punch_date}</td>
                <td>{log.punch_time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminAttendance;
