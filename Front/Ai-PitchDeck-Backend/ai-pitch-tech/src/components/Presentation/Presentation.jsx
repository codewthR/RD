"use client"
import { useState, useRef, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import AuthModal from "./Modals/AuthModal"
import DownloadDropdown from "./Dropdowns/DownloadDropdown"
import "./Presentation.css"

const Presentation = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showDownloadDropdown, setShowDownloadDropdown] = useState(false)
  const [presentationData, setPresentationData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [imageLoadErrors, setImageLoadErrors] = useState({})
  const [downloadingPPT, setDownloadingPPT] = useState(false)
  const downloadButtonRef = useRef(null)

  // Get presentation data from location state
  useEffect(() => {
    const loadPresentationData = () => {
      console.log("🔄 Loading presentation data, location state:", location.state)

      if (location.state?.presentation) {
        console.log("✅ Found presentation in location state:", location.state.presentation)
        setPresentationData(location.state.presentation)
        setLoading(false)
        return
      }

      if (location.state?.generatedData) {
        console.log("✅ Found generatedData in location state:", location.state.generatedData)
        setPresentationData(location.state.generatedData)
        setLoading(false)
        return
      }

      console.log("⚠️ No presentation data found, using fallback")
      setFallbackData()
      setLoading(false)
    }

    loadPresentationData()
  }, [location])

  const setFallbackData = () => {
    setPresentationData({
      title: "🎯 Sample Presentation",
      theme: "business",
      slides: [
        {
          id: 1,
          title: "🚀 Welcome & Introduction",
          content:
            "🎯 Welcome to this presentation\n\n🔸 This is a sample slide\n🔸 Generated for demonstration\n🔸 Replace with your content",
          type: "intro",
          image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop",
          background_image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=800&fit=crop",
        },
      ],
    })
  }

  const getThemeColors = (theme) => {
    const themeColors = {
      mobile: {
        primary: "#667eea",
        secondary: "#764ba2",
        accent: "#4facfe",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      },
      automotive: {
        primary: "#2c3e50",
        secondary: "#34495e",
        accent: "#e74c3c",
        background: "linear-gradient(135deg, #2c3e50 0%, #34495e 100%)",
      },
      beauty: {
        primary: "#e83e8c",
        secondary: "#fd79a8",
        accent: "#f093fb",
        background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      },
      restaurant: {
        primary: "#fd7e14",
        secondary: "#e55353",
        accent: "#ffc107",
        background: "linear-gradient(135deg, #fd7e14 0%, #e55353 100%)",
      },
      business: {
        primary: "#667eea",
        secondary: "#764ba2",
        accent: "#4facfe",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      },
    }
    return themeColors[theme] || themeColors.business
  }

  const handleCreateNew = () => {
    navigate("/home")
  }

  const handleBackToPrompt = () => {
    // Navigate to prompt editor with current presentation data
    navigate("/prompt-editor", {
      state: {
        presentationData: presentationData,
        editMode: true,
      },
    })
  }

  const handleDownloadPPT = async () => {
    if (!presentationData?.id) {
      alert("Presentation ID not found. Please regenerate the presentation.")
      return
    }

    setDownloadingPPT(true)

    try {
      console.log("🔄 Downloading PPT for presentation ID:", presentationData.id)

      const response = await fetch("/api/generate-ppt/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          presentation_id: presentationData.id,
        }),
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `${presentationData.title || "presentation"}.pptx`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        console.log("✅ PPT downloaded successfully")
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to download presentation")
      }
    } catch (error) {
      console.error("❌ Error downloading PPT:", error)
      alert(`Failed to download presentation: ${error.message}`)
    } finally {
      setDownloadingPPT(false)
    }
  }

  const formatSlideContent = (content) => {
    if (!content) return []

    const lines = content.split("\n")
    const elements = []

    lines.forEach((line, index) => {
      const trimmedLine = line.trim()
      if (!trimmedLine) return

      if (trimmedLine.startsWith("🔸")) {
        // Enhanced bullet points with icons
        elements.push(
          <li key={index} className="slide-bullet-point enhanced">
            <span className="bullet-icon">🔸</span>
            <span className="bullet-text">{trimmedLine.substring(2).trim()}</span>
          </li>,
        )
      } else if (trimmedLine.startsWith("•")) {
        // Standard bullet points
        elements.push(
          <li key={index} className="slide-bullet-point standard">
            <span className="bullet-icon">•</span>
            <span className="bullet-text">{trimmedLine.substring(1).trim()}</span>
          </li>,
        )
      } else if (trimmedLine.startsWith("🎯")) {
        // Main headings with special styling
        elements.push(
          <h3 key={index} className="slide-main-heading">
            {trimmedLine}
          </h3>,
        )
      } else if (trimmedLine) {
        // Regular paragraphs
        elements.push(
          <p key={index} className="slide-paragraph">
            {trimmedLine}
          </p>,
        )
      }
    })

    return elements
  }

  const handleImageLoad = (slideId) => {
    console.log(`✅ Image loaded successfully for slide: ${slideId}`)
    setImageLoadErrors((prev) => {
      const newErrors = { ...prev }
      delete newErrors[slideId]
      return newErrors
    })
  }

  const handleImageError = (slideId, error) => {
    console.error(`❌ Image failed to load for slide ${slideId}:`, error)
    setImageLoadErrors((prev) => ({
      ...prev,
      [slideId]: true,
    }))
  }

  if (loading) {
    return (
      <div className="presentation-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading presentation...</p>
        </div>
      </div>
    )
  }

  if (!presentationData) {
    return (
      <div className="presentation-container">
        <div className="error-container">
          <h2>Presentation not found</h2>
          <button onClick={() => navigate("/home")}>Go back to home</button>
        </div>
      </div>
    )
  }

  const themeColors = getThemeColors(presentationData.theme || "business")

  return (
    <div
      className="presentation-container"
      style={{
        background: `linear-gradient(135deg, ${themeColors.primary}15 0%, ${themeColors.secondary}15 100%)`,
      }}
    >
      {/* Enhanced Header with Theme Colors */}
      <div className="presentation-header">
        <div className="header-content">
          <div className="logo" style={{ color: themeColors.primary }}>
            🎯 AI Pitch
          </div>
          <div className="header-actions">
            <button
              className="prompt-editor-btn"
              onClick={handleBackToPrompt}
              style={{
                borderColor: themeColors.primary,
                color: themeColors.primary,
              }}
            >
              ✏️ Edit Content
            </button>
            <div className="menu-dots">⋯</div>

            {/* Enhanced PPT Download Button with Theme Colors */}
            <button
              className={`ppt-download-btn ${downloadingPPT ? "downloading" : ""}`}
              onClick={handleDownloadPPT}
              disabled={downloadingPPT || !presentationData?.id}
              title="Download PowerPoint Presentation"
              style={{
                background: themeColors.background,
                boxShadow: `0 4px 16px ${themeColors.primary}40`,
              }}
            >
              {downloadingPPT ? (
                <>
                  <span className="download-spinner"></span>
                  Downloading...
                </>
              ) : (
                <>
                  <span className="download-icon">📄</span>
                  Download PPT
                </>
              )}
            </button>

            <div className="download-button-container" ref={downloadButtonRef}>
              <button
                className="download-btn"
                onClick={() => setShowDownloadDropdown(!showDownloadDropdown)}
                style={{
                  borderColor: themeColors.primary,
                  color: themeColors.primary,
                }}
              >
                📥 More Downloads
              </button>
              {showDownloadDropdown && (
                <DownloadDropdown
                  isOpen={showDownloadDropdown}
                  onClose={() => setShowDownloadDropdown(false)}
                  onAction={() => {}}
                />
              )}
            </div>
            <button
              className="login-btn"
              onClick={() => setShowAuthModal(true)}
              style={{
                borderColor: themeColors.primary,
                color: themeColors.primary,
              }}
            >
              👤 Log In
            </button>
          </div>
        </div>
      </div>

      {/* Main Presentation Content */}
      <div className="presentation-content">
        <div className="presentation-slides">
          {/* Enhanced Title Slide with Dynamic Background */}
          <div className="presentation-slide title-slide" id="slide-title">
            <div
              className="slide-card title-card"
              style={{
                background: themeColors.background,
                backgroundImage: presentationData.slides?.[0]?.background_image
                  ? `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${presentationData.slides[0].background_image})`
                  : themeColors.background,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="slide-background-overlay"></div>
              <div className="slide-text">
                <h1 style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.7)" }}>{presentationData.title}</h1>
                <h2 style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.7)" }}>✨ AI Generated Presentation</h2>
                <p style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.7)" }}>🚀 Created with AI Pitch Generator</p>
              </div>
              <div className="slide-decoration">
                <div className="decoration-circle pulse"></div>
                <div className="decoration-line animate"></div>
              </div>
            </div>
          </div>

          {/* Enhanced Dynamic Slides with Unique Images */}
          {presentationData.slides &&
            presentationData.slides.map((slide, index) => (
              <div key={slide.id} className="presentation-slide" id={`slide-${index}`}>
                <div
                  className={`slide-card ${slide.type}-card enhanced`}
                  style={{
                    backgroundImage: slide.background_image
                      ? `linear-gradient(rgba(255,255,255,0.9), rgba(255,255,255,0.9)), url(${slide.background_image})`
                      : "none",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div className="slide-content-wrapper">
                    <div className="slide-text">
                      <h2
                        style={{
                          color: themeColors.primary,
                          textShadow: "1px 1px 2px rgba(255,255,255,0.8)",
                        }}
                      >
                        {slide.title}
                      </h2>
                      <div className="slide-content">{formatSlideContent(slide.content)}</div>
                    </div>

                    {/* Enhanced Image Display with Unique Images */}
                    <div className="slide-image-container">
                      {slide.image_url && !imageLoadErrors[slide.id] ? (
                        <div className="slide-image real-image">
                          <img
                            src={slide.image_url || "/placeholder.svg"}
                            alt={slide.title}
                            onLoad={() => handleImageLoad(slide.id)}
                            onError={(e) => handleImageError(slide.id, e)}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              borderRadius: "16px",
                              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
                            }}
                          />
                        </div>
                      ) : slide.image && !imageLoadErrors[slide.id] ? (
                        <div className="slide-image generated-image">
                          <img
                            src={`data:image/png;base64,${slide.image}`}
                            alt={slide.title}
                            onLoad={() => handleImageLoad(slide.id)}
                            onError={(e) => handleImageError(slide.id, e)}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              borderRadius: "16px",
                              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
                            }}
                          />
                        </div>
                      ) : (
                        <div className="slide-decoration enhanced">
                          <div
                            className="decoration-shape animated"
                            style={{ background: themeColors.background }}
                          ></div>
                          <div className="image-placeholder-text">
                            <span className="placeholder-icon">🖼️</span>
                            <p>Visual Content</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* Enhanced Feedback Section with Theme Colors */}
        <div className="feedback-section enhanced">
          <div className="feedback-content">
            <h2 className="feedback-title" style={{ color: themeColors.primary }}>
              🌟 Like what you created?
            </h2>

            <div className="action-buttons">
              <button
                className="action-btn create-new"
                onClick={handleCreateNew}
                style={{ background: themeColors.background }}
              >
                <span className="btn-icon">➕</span>
                Create Something New
              </button>
              <button
                className="action-btn back-prompt"
                onClick={handleBackToPrompt}
                style={{ background: `linear-gradient(135deg, ${themeColors.secondary}, ${themeColors.accent})` }}
              >
                <span className="btn-icon">✏️</span>
                Edit Content
              </button>
            </div>

            <p className="help-text">Help us improve our AI presentation generator</p>

            <h3 className="satisfaction-title" style={{ color: themeColors.primary }}>
              How satisfied are you with the output?
            </h3>

            <div className="satisfaction-buttons">
              <button className="satisfaction-btn" onClick={() => console.log("Rating: sad")}>
                😞
              </button>
              <button className="satisfaction-btn" onClick={() => console.log("Rating: neutral")}>
                😐
              </button>
              <button className="satisfaction-btn" onClick={() => console.log("Rating: happy")}>
                😊
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onAuthSuccess={() => setShowAuthModal(false)}
        />
      )}
    </div>
  )
}

export default Presentation
