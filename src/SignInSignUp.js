import React, { useState } from "react";

export default function SignInSignUp({ onAuthSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  }

  function handleSubmit(e) {
    e.preventDefault();

    // Basic validation
    if (!form.email || !form.password || (isSignUp && !form.confirmPassword)) {
      setError("Please fill all fields");
      return;
    }

    if (isSignUp && form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // TODO: call your backend API for sign in / sign up here
    // For now, simulate success:
    console.log(isSignUp ? "Signing Up" : "Signing In", form);

    onAuthSuccess && onAuthSuccess(form.email);
  }

  return (
    <div
      style={{
        height: "100vh",         // full viewport height
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

        {error && <p style={{ color: "#FF5252" }}>{error}</p>}

        <form onSubmit={handleSubmit}>
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
              cursor: "pointer",
            }}
          >
            {isSignUp ? "Sign Up" : "Sign In"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "1rem", cursor: "pointer" }}>
          {isSignUp ? "Already have an account? " : "Don't have an account? "}
          <span
            style={{ textDecoration: "underline", fontWeight: "700" }}
            onClick={() => {
              setError("");
              setIsSignUp(!isSignUp);
              setForm({ email: "", password: "", confirmPassword: "" });
            }}
          >
            {isSignUp ? "Sign In" : "Sign Up"}
          </span>
        </p>
      </div>
    </div>
  );
}
