import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css"; // Ensure your custom CSS is imported

const Navigation = () => {
    const navigate = useNavigate();
    const backgroundRef = useRef(null); // Reference for Vanta effect
    // eslint-disable-next-line no-empty-pattern
    const [] = useState(false); // Track if user is admin

    useEffect(() => {
        // Initialize the Vanta effect when the component mounts
        if (!window.VANTA) return;

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
            // Clean up the Vanta effect when the component unmounts
            if (vantaEffect) {
                vantaEffect.destroy();
            }
        };
    }, []);

    const handleLogin = () => {
        // Navigate to login page for Admin
        navigate("/loginadmin");
    };

    const handleUserPage = () => {
        // Navigate to the User page
        navigate("/user");
    };

    return (
        <div className="navigation-container" ref={backgroundRef}>
            <div className="box-container">
                <h2>Water Bill Management</h2>
                <div>
                    <button onClick={handleLogin}>Login as Admin</button>
                    <button onClick={handleUserPage}>Proceed as User</button>
                    <div className="powered-by">
          Powered by Ethereum Blockchain
        </div>
                </div>
            </div>
        </div>
    );
};

export default Navigation;
