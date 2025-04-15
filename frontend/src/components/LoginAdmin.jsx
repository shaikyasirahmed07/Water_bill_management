import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css"; // Using the same CSS

const LoginAdmin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const backgroundRef = useRef(null); // Reference for Vanta effect

  useEffect(() => {
    // Ensure VANTA and WAVES effect is available
    if (!window.VANTA || !window.VANTA.WAVES) return;

    const vantaEffect = window.VANTA.WAVES({
      el: backgroundRef.current,
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.0,
      minWidth: 200.0,
      scale: 1.0,
      scaleMobile: 1.0,
      color: 0x5a4ff,
      shininess: 60,
      waveHeight: 20,
      waveSpeed: 0.65,
      zoom: 0.9,
    });

    return () => {
      // Clean up Vanta effect
      if (vantaEffect) vantaEffect.destroy();
    };
  }, []);

  const handleLogin = () => {
    const adminUsername = "admin";
    const adminPassword = "admin@123";

    if (username === adminUsername && password === adminPassword) {
      navigate("/admin");
    } else {
      setErrorMessage("Invalid credentials. Please try again.");
      setUsername("");
      setPassword("");
    }
  };

  return (
    <div className="login-container" ref={backgroundRef}>
      <div className="box-container">
        <h2>Login as Admin</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>
        {errorMessage && <p className="error">{errorMessage}</p>}
        <div className="powered-by">
          Powered by Ethereum Blockchain
        </div>
      </div>
    </div>
  );
};

export default LoginAdmin;
