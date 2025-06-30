import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { getApiUrl } from "../config";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [nameFilter, setNameFilter] = useState("");
  const [emailFilter, setEmailFilter] = useState("");
  const navigate = useNavigate();

  const fetchUsers = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      if (!decoded.is_admin) {
        navigate("/login");
        return;
      }

      const params = {};
      if (nameFilter) params.name = nameFilter;
      if (emailFilter) params.email = emailFilter;

      axios.get(getApiUrl('/admin/users'), {
        headers: { Authorization: `Bearer ${token}` },
        params,
      })
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("Failed to load users", err));
    } catch (err) {
      console.error("Invalid token", err);
      navigate("/login");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []); // load once initially

  return (
    <div className="container mt-5">
      <h3>All Users</h3>

      {/* Filters */}
      <div className="row mb-4">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Filter by Name"
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Filter by Email"
            value={emailFilter}
            onChange={(e) => setEmailFilter(e.target.value)}
          />
        </div>
        <div className="col-md-2">
          <button className="btn btn-primary w-100" onClick={fetchUsers}>
            Apply Filters
          </button>
        </div>
        <div className="col-md-2">
          <button className="btn btn-secondary w-100" onClick={() => {
            setNameFilter("");
            setEmailFilter("");
            fetchUsers();
          }}>
            Clear
          </button>
        </div>
      </div>

      {/* Table */}
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th><th>Roll No</th><th>Name</th><th>Email</th><th>Admin</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.roll_no}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.is_admin ? "Yes" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminUsers;
