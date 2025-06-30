import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom";
import { getApiUrl } from "../config";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post(getApiUrl('/users/login'), {
        email,
        password,
      });

      // SET TOKEN AND FORCE RELOAD TO UPDATE NAVBAR
      localStorage.setItem("token", response.data.access_token);
      setMessage("Login successful!");
      navigate("/profile");
      window.location.reload();
    } catch (error) {
      console.error("Login error:", error);
      console.error("Full error response:", error.response);
      setMessage(error.response?.data?.detail || "Login failed");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "500px" }}>
      <h3>Login</h3>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          className="form-control mb-2"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="form-control mb-2"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="btn btn-primary w-100" type="submit">
          Login
        </button>
      </form>

      {message && <div className="alert alert-info mt-3">{message}</div>}


      {/* Register link */}
      <p className="mt-3 text-center">
        Don't have an account?{" "}
        <Link to="/register">Register now</Link>
      </p>

    </div>
  );
}

export default Login;