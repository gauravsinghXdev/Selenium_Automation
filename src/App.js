import React, { useState, useEffect } from "react";
import CsvAutomation from "./CsvAutomation";
import SignInSignUp from "./SignInSignUp";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is authenticated on component mount
    const token = localStorage.getItem('token');
    if (token) {
      // Verify token with backend
      fetch('https://d10e-2405-201-3039-2809-6c6c-2295-945c-fe0e.ngrok-free.app/api/auth/verify', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          // If token is invalid, remove it
          localStorage.removeItem('token');
          setIsAuthenticated(false);
        }
      })
      .catch(() => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
      });
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  const handleAuthSuccess = (email) => {
    setIsAuthenticated(true);
  };

  return (
    <>
      {isAuthenticated ? (
        <CsvAutomation onLogout={handleLogout} />
      ) : (
        <SignInSignUp onAuthSuccess={handleAuthSuccess} />
      )}
    </>
  );
}
