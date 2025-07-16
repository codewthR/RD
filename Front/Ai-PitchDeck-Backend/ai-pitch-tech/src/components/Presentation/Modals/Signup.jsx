"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import "./AuthModal.css";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Registration failed");
      }

      // Success: Redirect or update UI
      alert("Registration successful!");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    // Redirect to your Django Google OAuth endpoint
    window.location.href = "/accounts/google/login/";
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label>User Name</label>
          <input
            type="text"
            name="username"
            placeholder="Enter a unique username"
            value={formData.username}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email address"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Create a password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </div>

        {error && <p className="error-text">{error}</p>}

        <button type="submit" className="auth-submit-btn" disabled={loading}>
          {loading ? "Submitting..." : "Sign Up"}
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
        Continue with Google
      </button>
    </>
  );
};

export default Signup;
