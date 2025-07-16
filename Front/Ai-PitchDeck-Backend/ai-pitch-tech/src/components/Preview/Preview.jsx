import React from 'react'
import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { FaArrowLeft } from "react-icons/fa"
import "./Preview.css"

const Preview = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [presentationData, setPresentationData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadPresentationData = async () => {
      try {
        // Backend Logic: Load data passed via navigation or from backend API using presentation ID
        if (location.state?.generatedData) {
          setPresentationData(location.state.generatedData)
          setIsLoading(false)
        } else if (location.state?.presentationId) {
          const response = await fetch(`/api/presentation/${location.state.presentationId}/`)
          if (response.ok) {
            const result = await response.json()
            setPresentationData(result.presentation) // Backend response structure should match
          } else {
            throw new Error("Failed to load presentation")
          }
          setIsLoading(false)
        } else {
          throw new Error("No presentation data available")
        }
      } catch (err) {
        setError(err.message)
        setIsLoading(false)
      }
    }

    loadPresentationData()
  }, [location.state])

  const handlePromptEditor = async () => {
    try {
      // Backend API Call: Track navigation from Preview to Prompt Editor
      await fetch("/api/track-navigation/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "prompt_editor_from_preview",
          timestamp: new Date().toISOString(),
          userId: localStorage.getItem("userId") || "anonymous",
        }),
      })
    } catch (err) {
      console.error("Navigation tracking failed:", err)
    }

    navigate("/")
  }

  const handleCreateNew = async () => {
    try {
      // Backend API Call: Track new creation started from preview page
      await fetch("/api/track-navigation/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create_new_from_preview",
          timestamp: new Date().toISOString(),
          userId: localStorage.getItem("userId") || "anonymous",
        }),
      })
    } catch (err) {
      console.error("Navigation tracking failed:", err)
    }

    navigate("/")
  }

  const handleBackToPrompt = async () => {
    try {
      // Backend API Call: Track when user navigates back to Prompt Editor
      await fetch("/api/track-navigation/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "back_to_prompt_from_preview",
          timestamp: new Date().toISOString(),
          userId: localStorage.getItem("userId") || "anonymous",
        }),
      })
    } catch (err) {
      console.error("Navigation tracking failed:", err)
    }

    navigate("/")
  }

  if (isLoading) {
    return (
      <div className="preview-container">
        <div className="loading-container">
          <div className="loading-spinner">Loading presentation...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="preview-container">
        <div className="error-container">
          <h2>Error Loading Presentation</h2>
          <p>{error}</p>
          <button onClick={() => navigate("/")} className="back-button">
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="preview-container">
      {/* Header with Prompt Editor button */}
      <div className="preview-header">
        <button className="prompt-editor-button" onClick={handlePromptEditor}>
          <FaArrowLeft />
          Prompt Editor
        </button>
        <div className="header-info">
          <h1>Vault 42</h1>
          {/* Backend Provision: Add download functionality here if needed */}
          <button className="download-button">Download</button>
          {/* Backend Provision: Hook this into login auth API later */}
          <button className="login-button">Log In</button>
        </div>
      </div>

      {/* Main preview content */}
      <div className="preview-main">
        <div className="preview-image-container">
          {presentationData?.preview_image ? (
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Frame%2048096996.png-nBihYgLJBkXoRNzsQOKSULPJTrmbM8.jpeg"
              alt="Presentation Preview"
              className="preview-image"
            />
          ) : (
            <div className="placeholder-image">
              <p>Preview image not available</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer with action buttons */}
      <div className="preview-footer">
        <div className="footer-content">
          <h2>Like what you created?</h2>

          <div className="action-buttons">
            <button className="action-button primary" onClick={handleCreateNew}>
              <span className="button-icon">+</span>
              Create Something New
            </button>

            <button className="action-button secondary" onClick={handleBackToPrompt}>
              <span className="button-icon">←</span>
              Back to Prompt
            </button>
          </div>

          <div className="feedback-section">
            <p className="feedback-title">Help refine our product</p>
            <p className="satisfaction-question">How satisfied are you with the output?</p>

            <div className="rating-buttons">
              {/* Backend Provision: Hook these buttons to feedback submission API */}
              <button className="rating-button">😞</button>
              <button className="rating-button">😐</button>
              <button className="rating-button">😊</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Preview
