import React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import AuthModal from "../Presentation/Modals/AuthModal";
import "./MainHomePage.css"

const MainHomePage = () => {
  const navigate = useNavigate()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [authTab, setAuthTab] = useState("login")  // <-- new state

  const contentTypes = [
    {
      id: "presentation",
      title: "Presentation",
      image: "/Presentation.png",
      path: "/home",
    },
    {
      id: "create-image",
      title: "Create an image",
      image: "/Createimage.png",
      path: "/create-image",
    },
    {
      id: "pitch-deck",
      title: "Pitch Deck",
      image: "/Pitchtech.png",
      path: "/generate",
    },
    {
      id: "document",
      title: "Document",
      image: "/Docments.png",
      path: "/document",
    },
    {
      id: "url",
      title: "URL",
      image: "/urlsa.png",
      path: "/url",
    },
    {
      id: "magazine",
      title: "Magazine",
      image: "/magzine.png",
      path: "/magazine",
    },
  ]

  const recentPrompts = [
    {
      id: 1,
      title: "Business plan",
      type: "Generate",
      time: "1minute ago",
      status: "Draft",
    },
    {
      id: 2,
      title: "Business plan",
      type: "Generate",
      time: "6 Hours Ago",
      status: null,
    },
    {
      id: 3,
      title: "Business plan",
      type: "Generate",
      time: "6 Hours Ago",
      status: null,
    },
    {
      id: 4,
      title: "Business plan",
      type: "Generate",
      time: "6 Hours Ago",
      status: null,
    },
  ]
  const handleLogin = () => {
    setAuthTab("login")
    setShowAuthModal(true)
  }

  const handleSignUp = () => {
    setAuthTab("signup")
    setShowAuthModal(true)
  }
  const handleAuthSuccess = () => {
    setShowAuthModal(false)
    console.log("Authentication successful")
  }

  const handleContentTypeClick = (contentType) => {
    navigate(contentType.path)
  }

  const handlePromptClick = (prompt) => {
    console.log("Opening prompt:", prompt.title)
    navigate("/presentation")
  }

  const handleLoadMore = () => {
    console.log("Load more prompts")
  }
  <AuthModal
  isOpen={showAuthModal}
  onClose={() => setShowAuthModal(false)}
  onAuthSuccess={handleAuthSuccess}
  defaultTab={authTab}
  />


  return (
    <div className="main-home-container">
      {/* Background Image */}
      <div className="background-watercolor-top"></div>
      <div className="background-watercolor-bottom"></div>

      {/* Main Content Card */}
      <div className="main-content-card">
        {/* Header */}
        <header className="main-header">
          <div className="header-content">
            <div className="logo-section">
              <h1 className="logo-text">Vault 42</h1>
            </div>
            <div className="auth-buttons">
              <button className="auth-btn signup-btn" onClick={handleSignUp}>
                Log In 
              </button>
            </div>
          </div>
        </header>

        {/* Main Title Section */}
        <div className="title-section">
          <h1 className="main-title">Vault 42</h1>
          <p className="main-subtitle">Create Like a Pro — Powered by AI</p>
          <h2 className="ai-generator-title">AI GENERATORE</h2>
          <p className="main-description">Generate Presentations, Documents, Designs and More — All in One Place —</p>
        </div>

        {/* Content Types Grid */}
        <div className="content-types-section">
          <div className="content-types-grid">
            {contentTypes.map((contentType) => (
              <div
                key={contentType.id}
                className="content-type-card"
                onClick={() => handleContentTypeClick(contentType)}
              >
                <div className="card-image">
                  <img
                    src={contentType.image || "/placeholder.svg"}
                    alt={contentType.title}
                    onError={(e) => {
                      e.target.src = "/placeholder.svg?height=180&width=260"
                    }}
                  />
                </div>
                <div className="card-content">
                  <div className="card-divider"></div>
                  <div className="card-footer">
                    <h3 className="card-title">{contentType.title}</h3>
                    <div className="card-action-btn">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M12 4L20 12L12 20M20 12H4" stroke="#343E34" strokeWidth="2" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Terms Acceptance */}
        <div className="terms-section">
          <div className="terms-checkbox">
            <input
              type="checkbox"
              id="terms"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
            />
            <label htmlFor="terms">i accept The TERMS and Condition AND privacy policy</label>
          </div>
        </div>

        {/* Recent Prompts Section */}
        <div className="recent-prompts-section">
          <h2 className="section-title">Your Recent Prompts</h2>
          <div className="prompts-list">
            {recentPrompts.map((prompt) => (
              <div key={prompt.id} className="prompt-item" onClick={() => handlePromptClick(prompt)}>
                <div className="prompt-content">
                  <h3 className="prompt-title">{prompt.title}</h3>
                  <div className="prompt-meta">
                    <span className="prompt-type">{prompt.type}</span>
                    <span className="prompt-separator">•</span>
                    <span className="prompt-time">{prompt.time}</span>
                    {prompt.status && (
                      <>
                        <span className="prompt-separator">•</span>
                        <span className="prompt-status">{prompt.status}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="prompt-action">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M9 6L15 12L9 18" stroke="#000000" strokeWidth="2" />
                  </svg>
                </div>
              </div>
            ))}
          </div>

          {/* Load More Button */}
          <button className="load-more-btn" onClick={handleLoadMore}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 5V19M5 12L19 12" stroke="#898989" strokeWidth="3" />
            </svg>
            Load More
          </button>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} onAuthSuccess={handleAuthSuccess} />
    </div>
  )
}

export default MainHomePage
