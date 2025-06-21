import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Clear JWT token
    localStorage.removeItem("token");
    window.location.reload();

    // 2. Redirect to home or login after short delay
    
  //   setTimeout(() => {
  //     navigate("/login");
  //   }, 10);
  // }, [navigate]);

      navigate("/login");
  }, [navigate]);

  return (
    <div className="container mt-5">
      <h3>Logging out...</h3>
    </div>
  );
}

export default Logout;