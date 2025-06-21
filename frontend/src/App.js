import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import {jwtDecode} from "jwt-decode";

import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import PunchAttendance from "./pages/PunchAttendance";
import Logout from "./pages/Logout";
import Profile from "./pages/Profile";
import AdminUsers from "./pages/AdminUsers";
import AdminAttendance from "./pages/AdminAttendance";

function App() {
  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;

  // Decode the token and get is_admin if available
  let isAdmin = false;
  if (token) {
    try {
      const decoded = jwtDecode(token);
      console.log("Decoded JWT:", decoded);
      isAdmin = decoded.is_admin || false; // JWT must include is_admin field
    } catch (e) {
      console.error("Invalid token", e);
    }
  }

  return (
    <Router>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container">
          <Link className="navbar-brand" to="/">Attendance</Link>
          <div className="collapse navbar-collapse">

            {isLoggedIn ? (
              <>
                <ul className="navbar-nav">
                  <li className="nav-item">
                    <Link className="nav-link" to="/profile">Profile</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/punch">Punch</Link>
                  </li>

                  {isAdmin && (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/admin/users">All Users</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/admin/attendance">Attedance Logs</Link>
                    </li>
                  </>
                  )}

                </ul>

                <ul className="navbar-nav ms-auto">
                  <li className="nav-item">
                    <Link className="nav-link" to="/logout">Logout</Link>
                  </li>
                </ul>

              </>
            ):(
              <>
                <ul className="navbar-nav ms-auto">
                    <li className="nav-item">
                      <Link className="nav-link" to="/login">Login</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/register">Register</Link>
                    </li>
                </ul>
              </>
            )}

          </div>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/punch" element={<PunchAttendance />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/attendance" element={<AdminAttendance />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </Router>
  );
}

export default App;