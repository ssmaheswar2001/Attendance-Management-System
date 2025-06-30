import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getApiUrl } from "../config";

function PunchAttendance() {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() =>{
    const token = localStorage.getItem("token");
    if (!token) {
        navigate("/login");
    }
  }, [navigate]);

  const handlePunch = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        getApiUrl('/attendance/punch'),
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(`Success! Punched at ${response.data.punch_time}`);
    } catch (error) {
      if (error.response && error.response.data.detail) {
        setMessage(`Error: ${error.response.data.detail}`);
      } else {
        setMessage("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="container mt-5">
      <h3>Punch Attendance</h3>
      <button className="btn btn-primary" onClick={handlePunch}>
        Punch
      </button>
      {message && <div className="alert alert-info mt-3">{message}</div>}
    </div>
  );
}

export default PunchAttendance;