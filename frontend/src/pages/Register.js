import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import Webcam from "react-webcam"
import axios from "axios";
import { getApiUrl } from "../config";


function Register() {
  const [formData, setFormData] = useState({
    name: "",
    roll_no: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [images, setImages] = useState([]);
  const webcamRef = useRef(null);
  const [message, setMessage] = useState(null);


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const capture = () => {
    if (images.length >= 24) {
      setMessage("You've already captured 24 images.");
      return;
    }

    const imageSrc = webcamRef.current.getScreenshot();
    setImages([...images, imageSrc]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match. Please try again.");
      return;
    }

    if (images.length < 24) {
      setMessage("Please Upload at least 24 face images");
      return;
    }

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("roll_no", formData.roll_no);
      data.append("email", formData.email);
      data.append("password", formData.password);

      images.forEach((img, idx) => {
        const blob = dataURLtoBlob(img);
        data.append("files", blob, `image${idx}.png`);
      });

      const response = await axios.post(getApiUrl('/users/register-with-face'), data, { 
        headers: { 'Content-Type':  "multipart/form-data"},
      });

      setMessage(`Registration successful! Login Now. Your user ID: ${response.data.id}`);
    } 
    catch (error) {
      setMessage(error.response?.data?.detail || "Registration failed.");
    }
  };

  // Convert base64 to Blob
  const dataURLtoBlob = (dataurl) => {
    const arr = dataurl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new Blob([u8arr], { type: mime });
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "550px" }}>
      <h3>Register</h3>

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input 
          type="text" 
          name="name" 
          placeholder="Name" 
          className="form-control mb-2" 
          value={formData.name}
          onChange={handleChange} 
          required 
        />
        <input 
          type="text" 
          name="roll_no" 
          placeholder="Roll Number" 
          className="form-control mb-2" 
          value={formData.roll_no}
          onChange={handleChange} 
          required 
        />
        <input 
          type="email" 
          name="email" 
          placeholder="Email" 
          className="form-control mb-2" 
          value={formData.email}
          onChange={handleChange} 
          required 
        />
        <input 
          type="password" 
          name="password" 
          placeholder="Password" 
          className="form-control mb-2" 
          value={formData.password}
          onChange={handleChange} 
          required 
        />
        <input 
          type="password" 
          name="confirmPassword" 
          placeholder="Re-enter Password" 
          className="form-control mb-2" 
          value={formData.confirmPassword}
          onChange={handleChange} 
          required 
        />

        {/* WebCam */}
        <div className="mb-3 text-center">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/png"
            width={520}
            height={420}
            style={{ borderRadius: "8px" }}
          />
          <br />
          <button type="button" className="btn btn-primary mt-2" onClick={capture}>
            Capture Image ({images.length}/24)
          </button>
        </div>

        {/* Previews */}
        {images.length > 0 && (
          <div className="d-flex flex-wrap gap-2 mb-3">
            {images.map((img, idx) => (
              <img key={idx} src={img} alt={`Captured ${idx}`} width="80" height="80" style={{ borderRadius: "4px", objectFit: "cover" }} />
            ))}
          </div>
        )}

        <button className="btn btn-primary w-100" type="submit"  disabled={images.length < 24 || formData.password !== formData.confirmPassword}>
          Register
        </button>
      </form>

      {message && <div className="alert alert-info mt-3">{message}</div>}

      {/* Login link */}
      <p className="mt-3 text-center">
        Already have an account?{" "}
        <Link to="/login">Login</Link>
      </p>

    </div>
  );
}

export default Register;