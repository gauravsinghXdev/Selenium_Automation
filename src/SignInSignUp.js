import React, { useState } from "react";

export default function SignInSignUp({ onAuthSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    console.log('Form submitted');
    setIsLoading(true);
    setError("");

    // Basic validation
    if (!form.email || !form.password || (isSignUp && !form.confirmPassword)) {
      setError("Please fill all fields");
      setIsLoading(false);
      return;
    }

    if (isSignUp && form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const endpoint = isSignUp ? '/api/auth/register' : '/api/auth/login';
      const url = `https://d10e-2405-201-3039-2809-6c6c-2295-945c-fe0e.ngrok-free.app${endpoint}`;
      console.log('Making request to:', url);
      
      const requestBody = {
        email: form.email,
        password: form.password,
      };
      console.log('Request body:', requestBody);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Origin': ['*', 'https://f5b1-2402-8100-2704-8b51-a8a1-98a1-b7ec-a662.ngrok-free.app'],
          'Access-Control-Allow-Methods': 'POST, OPTIONS, GET',
          'Access-Control-Allow-Headers': 'Content-Type'
        },
        mode: 'cors',
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Server error: ${response.status}`);
      }

      const data = await response.json();
      console.log('Response data:', data);

      // Store the token in localStorage
      if (data.token) {
        localStorage.setItem('token', data.token);
        onAuthSuccess && onAuthSuccess(form.email);
      } else {
        throw new Error('No token received from server');
      }
    } catch (err) {
      console.error('Authentication error:', err);
      if (err.message.includes('Failed to fetch')) {
        setError('Unable to connect to the server. Please make sure the server is running at http://localhost:5001');
      } else {
        setError(err.message || 'An error occurred during authentication');
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        margin: 0,
      }}
    >
      <div
        style={{
          maxWidth: 400,
          width: "100%",
          padding: "2rem",
          border: "1px solid #6A0DAD",
          borderRadius: 8,
          backgroundColor: "#6A0DAD",
          color: "#FFEB3B",
          boxShadow: "0 4px 10px rgba(106, 13, 173, 0.6)",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>
          {isSignUp ? "Sign Up" : "Sign In"}
        </h2>

        {error && (
          <p style={{ 
            color: "#FF5252",
            backgroundColor: "rgba(255, 82, 82, 0.1)",
            padding: "8px",
            borderRadius: "4px",
            marginBottom: "1rem"
          }}>
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <label style={{ display: "block", marginBottom: 6 }}>
            Email:
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "8px",
                marginTop: 4,
                marginBottom: 12,
                borderRadius: 4,
                border: "none",
              }}
              required
              disabled={isLoading}
            />
          </label>

          <label style={{ display: "block", marginBottom: 6 }}>
            Password:
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "8px",
                marginTop: 4,
                marginBottom: 12,
                borderRadius: 4,
                border: "none",
              }}
              required
              disabled={isLoading}
            />
          </label>

          {isSignUp && (
            <label style={{ display: "block", marginBottom: 6 }}>
              Confirm Password:
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "8px",
                  marginTop: 4,
                  marginBottom: 12,
                  borderRadius: 4,
                  border: "none",
                }}
                required
                disabled={isLoading}
              />
            </label>
          )}

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: "#FFEB3B",
              color: "#6A0DAD",
              fontWeight: "700",
              border: "none",
              borderRadius: 4,
              cursor: isLoading ? "not-allowed" : "pointer",
              opacity: isLoading ? 0.7 : 1,
            }}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : (isSignUp ? "Sign Up" : "Sign In")}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "1rem", cursor: "pointer" }}>
          {isSignUp ? "Already have an account? " : "Don't have an account? "}
          <span
            style={{ textDecoration: "underline", fontWeight: "700" }}
            onClick={() => {
              if (!isLoading) {
                setError("");
                setIsSignUp(!isSignUp);
                setForm({ email: "", password: "", confirmPassword: "" });
              }
            }}
          >
            {isSignUp ? "Sign In" : "Sign Up"}
          </span>
        </p>
      </div>
    </div>
  );
}
