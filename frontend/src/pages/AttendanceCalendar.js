import React, { useEffect, useState } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

function AttendanceCalendar() {
  const [attendanceDates, setAttendanceDates] = useState([]);
  const [value, setValue] = useState(new Date());

  useEffect(() => {
    const fetchAttendance = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get("http://localhost:8000/attendance/history", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const dates = res.data.map((entry) => new Date(entry.punch_date));
        setAttendanceDates(dates);
      } catch (error) {
        console.error("Failed to load attendance data", error);
      }
    };

    fetchAttendance();
  }, []);

  // Highlight attendance days
  const tileClassName = ({ date, view }) => {
    if (
      view === "month" &&
      attendanceDates.some((d) =>
        d.getDate() === date.getDate() &&
        d.getMonth() === date.getMonth() &&
        d.getFullYear() === date.getFullYear()
      )
    ) {
      return "bg-success text-white";
    }
  };

  return (
    <div className="container mt-5">
      <h3>Attendance Calendar</h3>
      <Calendar
        onChange={setValue}
        value={value}
        tileClassName={tileClassName}
      />
    </div>
  );
}

export default AttendanceCalendar;