"use client"
import { useState } from "react"
import { X } from "lucide-react"
import "./AuthModal.css"
import React from "react"

const ForgotPassword = ({ formData, handleInputChange, handleSendOTP, handleGoogleAuth }) => (
  <>
    <h1 className="auth-modal-title">Forgot Password</h1>
    <div className="auth-modal-divider"></div>
    <h2 className="auth-modal-subtitle-large">Forgot Your Password?</h2>
    <p className="auth-modal-description">Enter your email below to recover your password</p>

    <form onSubmit={(e) => { e.preventDefault(); handleSendOTP() }} className="auth-form">
      <div className="form-group">
        <label>Email Address</label>
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
      </div>

      <button type="submit" className="auth-submit-btn">Send OTP</button>
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
)

export default ForgotPassword
