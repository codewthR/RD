import React from 'react';
import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { FaArrowLeft, FaChevronDown, FaEdit, FaPlus } from "react-icons/fa"
import "./GeneratePrompt.css"

const GeneratePrompt = () => {
  const location = useLocation()
  const navigate = useNavigate()

  // Get data from previous page
  const { prompt, attachments, selectedOptions } = location.state || {}

  const [currentSettings, setCurrentSettings] = useState({
    model: selectedOptions?.Model || "GPT-4 Turbo",
    slides: selectedOptions?.Slides || "8 Slides",
    style: selectedOptions?.Style || "Default",
    content: selectedOptions?.Content || "Medium",
    font: selectedOptions?.Font || "Poppins",
  })

  const [dropdownStates, setDropdownStates] = useState({
    model: false,
    slides: false,
    style: false,
    content: false,
    font: false,
  })

  const [styleSubMenu, setStyleSubMenu] = useState({
    default: false,
    traditional: false,
    tall: false,
    chart: false,
  })

  const [presentationData, setPresentationData] = useState({
    title: "Generated Presentation",
    subtitle: "Based on your choices, this is the generated writing prompt",
    slides: [
      {
        id: 1,
        title: "Introduction",
        content:
          "Welcome to your AI-generated presentation. This slide introduces the main topic and sets the stage for your content.",
        color: "#C1E1C1",
      },
      {
        id: 2,
        title: "Problem Statement",
        content: [
          "Identify the core challenge or opportunity",
          "Explain why this matters to your audience",
          "Provide context and background information",
        ],
        color: "#FAE297",
      },
      {
        id: 3,
        title: "Solution Overview",
        content: [
          "Present your proposed solution or approach",
          "Highlight key features and benefits",
          "Explain how it addresses the problem",
        ],
        color: "#C1E1C1",
      },
      {
        id: 4,
        title: "Implementation Plan",
        content: ["Outline the steps for execution", "Define timeline and milestones", "Identify required resources"],
        color: "#FAE297",
      },
      {
        id: 5,
        title: "Expected Outcomes",
        content: [
          "Describe anticipated results and benefits",
          "Include measurable success metrics",
          "Address potential risks and mitigation strategies",
        ],
        color: "#C1E1C1",
      },
      {
        id: 6,
        title: "Next Steps",
        content: [
          "Define immediate action items",
          "Assign responsibilities and ownership",
          "Set follow-up meetings and checkpoints",
        ],
        color: "#FAE297",
      },
      {
        id: 7,
        title: "Questions & Discussion",
        content: "Open floor for questions, feedback, and collaborative discussion about the presented content.",
        color: "#C1E1C1",
      },
      {
        id: 8,
        title: "Thank You",
        content:
          "Thank you for your attention. We look forward to moving forward with this initiative and achieving our shared goals.",
        color: "#FAE297",
      },
    ],
  })

  const dropdownOptions = {
    model: ["GPT-4 Turbo", "Claude 3 Sonnet", "Gemini 1.5 Pro", "Mistral 7B"],
    slides: [
      "1 Slide",
      "2 Slides",
      "3 Slides",
      "4 Slides",
      "5 Slides",
      "6 Slides",
      "7 Slides",
      "8 Slides",
      "9 Slides",
      "10 Slides",
      "15 Slides",
      "20 Slides",
      "25 Slides",
      "30 Slides",
    ],
    style: {
      Default: ["Neutral", "Modern", "Light"],
      Traditional: ["Classic", "Corporate", "Doc Style"],
      Tall: ["Stacked", "Scrollable", "Padded"],
      Chart: ["Auto Select", "Bar Chart", "Pie Chart", "Line Chart"],
    },
    content: ["Brief", "Medium", "Detailed"],
    font: ["Inter", "Poppins", "Roboto", "Lateef", "Lato", "Inika", "Sofia Sans"],
  }

  useEffect(() => {
    // Generate presentation based on initial prompt
    if (prompt) {
      generatePresentationContent()
    }
  }, [prompt])

  const generatePresentationContent = async () => {
    try {
      const response = await fetch("/api/generate-presentation-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({
          prompt,
          attachments,
          settings: currentSettings,
          userId: localStorage.getItem("userId"),
          timestamp: new Date().toISOString(),
        }),
      })

      if (response.ok) {
        const result = await response.json()
        setPresentationData(result.presentation)
      }
    } catch (error) {
      console.error("Error generating presentation:", error)
    }
  }

  const handleDropdownToggle = (dropdown) => {
    setDropdownStates((prev) => ({
      ...prev,
      [dropdown]: !prev[dropdown],
    }))
  }

  const handleOptionSelect = async (dropdown, value) => {
    const newSettings = {
      ...currentSettings,
      [dropdown]: value,
    }

    setCurrentSettings(newSettings)
    setDropdownStates((prev) => ({
      ...prev,
      [dropdown]: false,
    }))

    // Update presentation based on new settings
    await updatePresentationStyle(dropdown, value)
  }

  const handleStyleSubMenu = (category) => {
    setStyleSubMenu((prev) => ({
      ...prev,
      [category.toLowerCase()]: !prev[category.toLowerCase()],
    }))
  }

  const updatePresentationStyle = async (settingType, value) => {
    try {
      const response = await fetch("/api/update-presentation-style", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({
          presentationId: presentationData.id,
          settingType,
          value,
          currentSettings,
          timestamp: new Date().toISOString(),
        }),
      })

      if (response.ok) {
        const result = await response.json()
        setPresentationData(result.presentation)
      }
    } catch (error) {
      console.error("Error updating presentation style:", error)
    }
  }

  const handleBack = () => {
    navigate(-1)
  }

  const handlePromptEditor = () => {
    navigate("/prompt-editor", {
      state: {
        presentationData,
        originalPrompt: prompt,
        settings: currentSettings,
      },
    })
  }

  const handleAdvanceSettings = () => {
    // Navigate to advanced settings or open modal
    console.log("Opening advance settings")
  }

  const handleAddSlide = () => {
    const newSlide = {
      id: presentationData.slides.length + 1,
      title: "New Slide",
      content: "Add your content here...",
      color: presentationData.slides.length % 2 === 0 ? "#C1E1C1" : "#FAE297",
    }

    setPresentationData((prev) => ({
      ...prev,
      slides: [...prev.slides, newSlide],
    }))
  }

  return (
    <div className="generate-prompt-page">
      {/* Navigation Buttons */}
      <button className="back-button" onClick={handleBack}>
        <FaArrowLeft />
        Back
      </button>

      <button className="prompt-editor-button" onClick={handlePromptEditor}>
        <FaEdit />
        Editor
      </button>

      <div className="main-card">
        {/* Header Section */}
        <div className="header-section">
          <h1 className="main-title">Generate Prompt</h1>
          <p className="subtitle">{presentationData.subtitle}</p>
        </div>

        {/* Prompt Controls */}
        <div className="prompt-controls-section">
          <div className="prompt-label-container">
            <span className="prompt-label">Prompt</span>
          </div>

          {/* Dropdown Controls Row */}
          <div className="dropdown-controls-row">
            {/* Model Dropdown */}
            <div className="control-dropdown">
              <button className="control-button" onClick={() => handleDropdownToggle("model")}>
                <span>Model</span>
                <FaChevronDown className={`dropdown-arrow ${dropdownStates.model ? "rotated" : ""}`} />
              </button>
              {dropdownStates.model && (
                <div className="control-dropdown-menu">
                  {dropdownOptions.model.map((option) => (
                    <div
                      key={option}
                      className="control-dropdown-item"
                      onClick={() => handleOptionSelect("model", option)}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Slides Dropdown */}
            <div className="control-dropdown">
              <button className="control-button" onClick={() => handleDropdownToggle("slides")}>
                <span>Slides</span>
                <FaChevronDown className={`dropdown-arrow ${dropdownStates.slides ? "rotated" : ""}`} />
              </button>
              {dropdownStates.slides && (
                <div className="control-dropdown-menu">
                  {dropdownOptions.slides.map((option) => (
                    <div
                      key={option}
                      className="control-dropdown-item"
                      onClick={() => handleOptionSelect("slides", option)}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Style Dropdown */}
            <div className="control-dropdown">
              <button className="control-button" onClick={() => handleDropdownToggle("style")}>
                <span>Style</span>
                <FaChevronDown className={`dropdown-arrow ${dropdownStates.style ? "rotated" : ""}`} />
              </button>
              {dropdownStates.style && (
                <div className="control-dropdown-menu style-menu">
                  {Object.keys(dropdownOptions.style).map((category) => (
                    <div key={category} className="style-category">
                      <div className="control-dropdown-item category-item" onClick={() => handleStyleSubMenu(category)}>
                        {category}
                        <FaChevronDown
                          className={`submenu-arrow ${styleSubMenu[category.toLowerCase()] ? "rotated" : ""}`}
                        />
                      </div>
                      {styleSubMenu[category.toLowerCase()] && (
                        <div className="style-submenu">
                          {dropdownOptions.style[category].map((subOption) => (
                            <div
                              key={subOption}
                              className="style-submenu-item"
                              onClick={() => handleOptionSelect("style", `${category}: ${subOption}`)}
                            >
                              {subOption}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Content Dropdown */}
            <div className="control-dropdown">
              <button className="control-button" onClick={() => handleDropdownToggle("content")}>
                <span>Content</span>
                <FaChevronDown className={`dropdown-arrow ${dropdownStates.content ? "rotated" : ""}`} />
              </button>
              {dropdownStates.content && (
                <div className="control-dropdown-menu">
                  {dropdownOptions.content.map((option) => (
                    <div
                      key={option}
                      className="control-dropdown-item"
                      onClick={() => handleOptionSelect("content", option)}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Font Dropdown */}
            <div className="control-dropdown">
              <button className="control-button" onClick={() => handleDropdownToggle("font")}>
                <span>Font</span>
                <FaChevronDown className={`dropdown-arrow ${dropdownStates.font ? "rotated" : ""}`} />
              </button>
              {dropdownStates.font && (
                <div className="control-dropdown-menu font-menu">
                  {dropdownOptions.font.map((option) => (
                    <div
                      key={option}
                      className="control-dropdown-item font-item"
                      onClick={() => handleOptionSelect("font", option)}
                      style={{ fontFamily: option }}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Topic Display */}
        <div className="topic-display-section">
          <div className="topic-display-container">
            <span className="topic-text">{prompt || "Your presentation topic"}</span>
            <button className="topic-edit-button">
              <FaEdit />
            </button>
          </div>
        </div>

        {/* Outline Section */}
        <div className="outline-section">
          <h2 className="outline-title">Outline</h2>

          {/* Presentation Preview */}
          <div className="presentation-preview">
            <div className="slides-container">
              {presentationData.slides.map((slide) => (
                <div key={slide.id} className="slide-preview-card" style={{ fontFamily: currentSettings.font }}>
                  <div className="slide-number-badge" style={{ backgroundColor: slide.color }}>
                    {slide.id}
                  </div>
                  <div className="slide-content-area">
                    <div className="slide-header">
                      <h3 className="slide-title">{slide.title}</h3>
                      <button className="slide-edit-btn">
                        <FaEdit />
                      </button>
                    </div>
                    <div className="slide-content-body">
                      {Array.isArray(slide.content) ? (
                        slide.content.map((item, idx) => (
                          <div key={idx} className="content-bullet">
                            <span className="bullet-point">●</span>
                            <span className="bullet-text">{item}</span>
                          </div>
                        ))
                      ) : (
                        <div className="content-bullet">
                          <span className="bullet-point">●</span>
                          <span className="bullet-text">{slide.content}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Add Slide Button */}
              <div className="add-slide-section">
                <button className="add-slide-btn" onClick={handleAddSlide}>
                  <FaPlus className="add-icon" />
                  <span>Add Slide</span>
                </button>
              </div>
            </div>

            {/* Bottom Status Bar */}
            <div className="status-bar">
              <div className="slide-count-info">
                <span>{presentationData.slides.length} Total Cards</span>
              </div>

              <div className="card-break-info">
                <span>Type --- for card breaks</span>
                <div className="card-break-demo">---</div>
              </div>

              <div className="token-usage">
                <div className="token-indicator">
                  <div className="token-circle"></div>
                  <div className="token-circle-active"></div>
                </div>
                <span>500/20000</span>
              </div>
            </div>
          </div>
        </div>

        {/* Advance Settings */}
        <div className="advance-settings-section">
          <button className="advance-settings-btn" onClick={handleAdvanceSettings}>
            <span>Advance Setting Mode</span>
            <div className="settings-icon">⚙️</div>
          </button>
        </div>
      </div>
    </div>
  )
}

export default GeneratePrompt
