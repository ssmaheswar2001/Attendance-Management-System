import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


function Profile() {
  const [profile, setProfile] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({name: "", roll_no: "", email: ""});

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      return navigate("/login");
    }

    const fetchData = async () => {
      try {
        const userRes = await axios.get("http://localhost:8000/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setProfile(userRes.data);
        setEditForm({
          name: userRes.data.name,
          roll_no: userRes.data.roll_no,
          email: userRes.data.email,
        });

        setImageUrl(`http://localhost:8000${userRes.data.profile_pic}`);

        const attendanceRes = await axios.get("http://localhost:8000/attendance/history", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAttendance(attendanceRes.data);
        
      } catch (error) {
        console.error("Error fetching profile or attendance", error);
        navigate("/login");
      }
    };

    fetchData();
  }, [navigate]);

  
  // Handle form input changes
  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  // Submit updated name, email, roll no
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const res = await axios.patch("http://localhost:8000/users/me", editForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(res.data);
      setEditForm({
        name: res.data.name,
        roll_no: res.data.roll_no,
        email: res.data.email,
      });
      setEditMode(false);
    }
    catch (error){
      console.error("Error Updating profile", error);
    }
  };


  // Upload Profile picture
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://localhost:8000/users/upload-profile-pic", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setImageUrl(`http://localhost:8000${response.data.profile_pic_url}`);
    } catch (error) {
      console.error("Error uploading profile picture", error);
    }
  };

  return (
    <div className="container mt-5">
      <h3>Profile</h3>
      {profile && (
        <div className="card mb-3 p-3">
          {/* Profile Picture */}
          <img
            src={imageUrl || "https://via.placeholder.com/150"}
            alt="Profile"
            className="mb-3"
            style={{ width: "150px", height: "150px", borderRadius: "50%", objectFit: "cover" }}
          />

          {/* Edit Mode */}
          {!editMode ? (
            <>
              <p><strong>ID:</strong> {profile.id}</p>
              <p><strong>Name:</strong> {profile.name}</p>
              <p><strong>Roll No:</strong> {profile.roll_no}</p>
              <p><strong>Email:</strong> {profile.email}</p> 
              <button className="btn btn-outline-primary mt-2" onClick={() => setEditMode(true)}>
                Edit Profile
              </button>  
            </>
          ) : (
            <form onSubmit={handleEditSubmit}>
              <div className="form-group mb-2">
                <label>Name</label>
                <input type="text" name="name" value={editForm.name} onChange={handleEditChange} className="form-control" />
              </div>
              <div className="form-group mb-2">
                <label>Roll No</label>
                <input type="text" name="roll_no" value={editForm.roll_no} onChange={handleEditChange} className="form-control" />
              </div>
              <div className="form-group mb-2">
                <label>Email</label>
                <input type="email" name="email" value={editForm.email} onChange={handleEditChange} className="form-control" />
              </div>
              <button type="submit" className="btn btn-success me-2">Save</button>
              <button className="btn btn-secondary" onClick={() => setEditMode(false)}>Cancel</button>
            </form>
          )
          }

          {/* Upload Profile Picture */}
          <form onSubmit={handleUpload} className="mt-3">
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="form-control mb-2"
              accept="image/*"
              required
            />
            <button className="btn btn-primary" type="submit">
              Upload/Update Profile Picture
            </button>
          </form>
        </div>
      )}

      {/* Attendance list */}
      <h4>Attendance History</h4>
      <div className="card mb-3 p-3">
      </div>
      <ul className="list-group">
        {attendance.map((item) => (
          <li key={item.id} className="list-group-item">
            {item.punch_date} at {item.punch_time}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Profile;
