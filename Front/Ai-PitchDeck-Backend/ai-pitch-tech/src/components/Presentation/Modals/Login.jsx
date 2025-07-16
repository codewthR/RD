"use client";

import React, { useState } from "react";
import "./AuthModal.css";

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include", // Needed for cookie-based sessions
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Login failed");
      }

      alert("Login successful!");
      // Optionally redirect or handle session/token
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    window.location.href = "/forgot-password/";
  };

  const handleGoogleAuth = () => {
    window.location.href = "/accounts/google/login/";
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            name="username"
            placeholder="Enter your username"
            value={formData.username}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
          <button
            type="button"
            className="forgot-password"
            onClick={handleForgotPassword}
          >
            Forgot Password
          </button>
        </div>

        {error && <p className="error-text">{error}</p>}

        <button type="submit" className="auth-submit-btn" disabled={loading}>
          {loading ? "Logging in..." : "Login to Account"}
        </button>
      </form>

      <p className="auth-divider-text">or continue with</p>

      <button className="google-auth-btn" onClick={handleGoogleAuth}>
        <div className="google-icon">
          <div className="google-icon-blue"></div>
          <div className="google-icon-green"></div>
          <div className="google-icon-yellow"></div>
          <div className="google-icon-red"></div>
        </div>
        Login with Google
      </button>
    </>
  );
};

export default Login;
