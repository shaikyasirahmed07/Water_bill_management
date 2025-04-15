import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const WelcomePage = () => {
  const navigate = useNavigate();
  const backgroundRef = useRef(null);
  const vantaEffectRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!vantaEffectRef.current && window.VANTA && window.VANTA.WAVES && backgroundRef.current) {
      vantaEffectRef.current = window.VANTA.WAVES({
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
        zoom: 0.9
      });

      setTimeout(() => {
        setLoaded(true);
      }, 300);
    }

    return () => {
      if (vantaEffectRef.current) {
        vantaEffectRef.current.destroy();
        vantaEffectRef.current = null;
      }
    };
  }, []);

  const handleContinue = () => {
    navigate('/navigation');
  };

  return (
    <div ref={backgroundRef} className="homepage-container">
      <div className={`content-container ${loaded ? 'loaded' : ''}`}>
      <div className="logo-container">
  <div className="logo-icon">
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.001 2.163C12.001 2.163 5 10.025 5 15.001C5 19.419 8.582 23 13 23C17.418 23 21 19.419 21 15.001C21 10.023 12.001 2.163 12.001 2.163ZM13 21C9.686 21 7 18.314 7 15.001C7 12.017 10.403 7.917 12.001 6.163C13.598 7.917 17 12.017 17 15.001C17 18.314 14.314 21 13 21Z"/>
    </svg>
  </div>
  <h1 className="project-title">WaterBillPay</h1>
</div>


        <h2 className="welcome-text">Smart Water Bill Payment System</h2>

        <p className="description">
          Effortless, secure, and transparent billing powered by blockchain technology.
          Pay your water bills with ease and confidence.
        </p>

        <div className="features">
          <div className="feature-item">
            <span className="feature-icon">🔒</span>
            <span>Secure Payments</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">📱</span>
            <span>Online Access</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">⚙️</span>
            <span>Automated Billing</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">📊</span>
            <span>Usage Tracking</span>
          </div>
        </div>

        <button onClick={handleContinue} className="get-started-btn">
          <span>Get Started</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </button>

        <div className="powered-by">
          Powered by Ethereum Blockchain
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
