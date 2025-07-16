"use client"
import React, { useState, useEffect } from "react"
import { X } from "lucide-react"
import "./AuthModal.css"

// Import separated view components
import Login from "./Login"
import Signup from "./Signup"
import ForgotPassword from "./Forgot_password"
// import OTPVerification from "./OTPVerification"
// import ResetPassword from "./ResetPassword"

const AuthModal = ({ isOpen, onClose, onAuthSuccess, defaultTab = "login" }) => {
  const [currentView, setCurrentView] = useState("main") // main, forgotPassword, verifyCode, confirmOTP, createPassword
  const [activeTab, setActiveTab] = useState(defaultTab)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
    otpCode: "",
    newPassword: "",
    confirmPassword: "",
  })

  // Set tab to prop value on open
  useEffect(() => {
    if (isOpen) {
      setActiveTab(defaultTab)
      setCurrentView("main")
    }
  }, [defaultTab, isOpen])

  if (!isOpen) return null

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (activeTab === "signup") {
      setCurrentView("confirmOTP")
    } else {
      console.log("Login submitted:", formData)
      onAuthSuccess()
    }
  }

  const handleForgotPassword = () => setCurrentView("forgotPassword")
  const handleSendOTP = () => setCurrentView("verifyCode")
  const handleVerifyCode = () => setCurrentView("createPassword")
  const handleConfirmOTP = () => {
    console.log("Account created successfully")
    onAuthSuccess()
  }
  const handleCreatePassword = () => {
    console.log("Password created successfully")
    onAuthSuccess()
  }
  const handleGoogleAuth = () => {
    console.log("Google auth clicked")
    onAuthSuccess()
  }

  return (
    <div className="auth-modal-overlay">
      <div className="auth-modal">
        <button className="auth-modal-close" onClick={onClose}>
          <X size={20} />
        </button>

        {currentView === "main" && (
          <>
            <h1 className="auth-modal-title">Authentication Required</h1>
            <div className="auth-modal-divider"></div>
            {/* <p className="auth-modal-subtitle">Please login or create an account to export</p> */}
            <p className="auth-modal-subtitle"><b>Don't have an account? 👉 Sign Up</b></p>

            <div className="auth-tabs">
              <button
                className={`auth-tab ${activeTab === "login" ? "active" : ""}`}
                onClick={() => setActiveTab("login")}
              >
                Login
              </button>
              <button
                className={`auth-tab ${activeTab === "signup" ? "active" : ""}`}
                onClick={() => setActiveTab("signup")}
              >
                Sign Up
              </button>
            </div>

            {activeTab === "login" ? (
              <Login
                formData={formData}
                handleInputChange={handleInputChange}
                handleSubmit={handleSubmit}
                handleForgotPassword={handleForgotPassword}
                handleGoogleAuth={handleGoogleAuth}
              />
            ) : (
              <Signup
                formData={formData}
                handleInputChange={handleInputChange}
                handleSubmit={handleSubmit}
                handleGoogleAuth={handleGoogleAuth}
              />
            )}
          </>
        )}

        {currentView === "forgotPassword" && (
          <ForgotPassword
            formData={formData}
            handleInputChange={handleInputChange}
            handleSendOTP={handleSendOTP}
            handleGoogleAuth={handleGoogleAuth}
          />
        )}

        {currentView === "verifyCode" && (
          <OTPVerification
            title="Verify Code"
            subtitle="Verify Your Code"
            description="An authentication code has been sent to your email."
            formData={formData}
            handleInputChange={handleInputChange}
            onSubmit={handleVerifyCode}
            buttonLabel="Verify"
          />
        )}

        {currentView === "confirmOTP" && (
          <OTPVerification
            title="Confirmation OTP"
            subtitle="Confirm Your OTP"
            description="A confirmation OTP has been sent to your email."
            formData={formData}
            handleInputChange={handleInputChange}
            onSubmit={handleConfirmOTP}
            buttonLabel="Confirm & Create Account"
          />
        )}

        {currentView === "createPassword" && (
          <ResetPassword
            formData={formData}
            handleInputChange={handleInputChange}
            onSubmit={handleCreatePassword}
          />
        )}
      </div>
    </div>
  )
}

export default AuthModal
