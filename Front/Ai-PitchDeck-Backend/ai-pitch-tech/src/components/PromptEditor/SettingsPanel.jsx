import React from 'react';
import { useState, useRef } from "react"
import { FaChevronUp, FaChevronDown, FaLightbulb, FaUpload, FaSearch } from "react-icons/fa"
import "./SettingsPanel.css"

const SettingsPanel = ({ settings, onChange }) => {
  const [expandedSections, setExpandedSections] = useState({
    textContent: true,
    images: true,
    format: false,
    content: false,
  })

  const [pageStyleExpanded, setPageStyleExpanded] = useState(false) // ✅ FIXED: Was 'False'
  const [subMenuExpanded, setSubMenuExpanded] = useState({
    traditional: false,
    tall: false,
    chart: false, // Added chart submenu
  })

  const [searchQuery, setSearchQuery] = useState("")

  const fileInputRef = useRef(null)

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const handleChange = (e) => {
    onChange({ ...settings, [e.target.name]: e.target.value })
  }

  const handleImageSourceChange = (source) => {
    onChange({ ...settings, imageSource: source })
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      console.log("File selected:", file.name)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current.click()
  }

  const handlePageStyleSelect = (style) => {
    if (style === "Traditional" || style === "Tall" || style === "Chart") {
      setSubMenuExpanded((prev) => ({
        ...prev,
        [style.toLowerCase()]: !prev[style.toLowerCase()],
      }))
    } else {
      onChange({ ...settings, pageStyle: style })
      setPageStyleExpanded(false)
      setSubMenuExpanded({ traditional: false, tall: false, chart: false })
    }
  }

  const handleSubStyleSelect = (style) => {
    onChange({ ...settings, pageStyle: style })
    setPageStyleExpanded(false)
    setSubMenuExpanded({ traditional: false, tall: false, chart: false })
  }

  const aiModelOptions = ["GPT-4 Turbo", "Claude 3 Sonnet", "Gemini 1.5 Pro", "Mistral 7B"]

  return (
    <div className="settings-panel">
      <h2 className="settings-title">Settings</h2>

      {/* Text Content Section */}
      <div className="setting-section">
        <div className="section-header" onClick={() => toggleSection("textContent")}>
          <h3 className="section-title">Text content</h3>
          <button className="expand-btn">{expandedSections.textContent ? <FaChevronUp /> : <FaChevronDown />}</button>
        </div>

        <div className={`section-content ${expandedSections.textContent ? "expanded" : "collapsed"}`}>
          <div className="setting-group">
            <label className="setting-label">Amount of text per card</label>
            <div className="option-buttons-row">
              {["Brief", "Medium", "Detailed"].map((option) => (
                <button
                  key={option}
                  className={`option-btn ${settings.amountPerCard === option ? "active" : ""}`}
                  onClick={() => onChange({ ...settings, amountPerCard: option })}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="setting-group">
            <label className="setting-label">Write For...</label>
            <div className="write-for-container">
              <div className="selected-tag">
                <span>{settings.writeFor}</span>
                <button className="remove-tag">×</button>
              </div>
            </div>
            <div className="button-grid">
              <div className="button-row">
                {["Business", "Creatives", "Analysts"].map((option) => (
                  <button
                    key={option}
                    className={`grid-btn ${settings.writeFor === option ? "active" : ""}`}
                    onClick={() => onChange({ ...settings, writeFor: option })}
                  >
                    {option}
                  </button>
                ))}
              </div>
              <div className="button-row">
                {["Tech & Digital", "Educational"].map((option) => (
                  <button
                    key={option}
                    className={`grid-btn ${settings.writeFor === option ? "active" : ""}`}
                    onClick={() => onChange({ ...settings, writeFor: option })}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="setting-group">
            <label className="setting-label">Tone</label>
            <div className="tone-container">
              <div className="selected-tag">
                <span>{settings.tone}</span>
                <button className="remove-tag">×</button>
              </div>
            </div>
            <div className="button-grid">
              <div className="button-row">
                {["Technical", "Academic", "Humorous"].map((option) => (
                  <button
                    key={option}
                    className={`grid-btn ${settings.tone === option ? "active" : ""}`}
                    onClick={() => onChange({ ...settings, tone: option })}
                  >
                    {option}
                  </button>
                ))}
              </div>
              <div className="button-row">
                {["Professional", "Inspirational", "Conversational"].map((option) => (
                  <button
                    key={option}
                    className={`grid-btn ${settings.tone === option ? "active" : ""}`}
                    onClick={() => onChange({ ...settings, tone: option })}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Images Section */}
      <div className="setting-section">
        <div className="section-header" onClick={() => toggleSection("images")}>
          <h3 className="section-title">Images</h3>
          <button className="expand-btn">{expandedSections.images ? <FaChevronUp /> : <FaChevronDown />}</button>
        </div>

        <div className={`section-content ${expandedSections.images ? "expanded" : "collapsed"}`}>
          <div className="setting-group">
            <div className="search-container">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search images..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
          </div>

          <div className="setting-group">
            <label className="setting-label">Image Source</label>
            <div className="image-source-tabs">
              <button
                className={`source-tab ${settings.imageSource !== "upload" ? "active" : ""}`}
                onClick={() => handleImageSourceChange("ai")}
              >
                AI Image
              </button>
              <button
                className={`source-tab ${settings.imageSource === "upload" ? "active" : ""}`}
                onClick={() => handleImageSourceChange("upload")}
              >
                Upload Image
              </button>
            </div>
          </div>

          {settings.imageSource === "upload" ? (
            <div className="setting-group">
              <div className="upload-container" onClick={triggerFileInput}>
                <div className="upload-icon">
                  <FaUpload />
                </div>
                <p>Drag a file or click to Upload</p>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  style={{ display: "none" }}
                  accept="image/*"
                />
              </div>
              <button className="mockup-btn">Create a Mockup</button>
            </div>
          ) : (
            <>
              <div className="setting-group">
                <label className="setting-label">Describe the colors, style or mood of use</label>
                <textarea
                  name="imageStyle"
                  value={settings.imageStyle || ""}
                  onChange={handleChange}
                  className="setting-textarea"
                  rows="3"
                />
              </div>

              <div className="setting-group">
                <label className="setting-label">AI Image Model</label>
                <select name="aiModel" value={settings.aiModel} onChange={handleChange} className="setting-select">
                  {aiModelOptions.map((model) => (
                    <option key={model} value={model}>
                      {model}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Format Section */}
      <div className="setting-section">
        <div className="section-header" onClick={() => toggleSection("format")}>
          <h3 className="section-title">Format</h3>
          <button className="expand-btn">{expandedSections.format ? <FaChevronUp /> : <FaChevronDown />}</button>
        </div>

        <div className={`section-content ${expandedSections.format ? "expanded" : "collapsed"}`}>
          <div className="setting-group">
            <label className="setting-label">Page Style</label>
            <div className="custom-dropdown">
              <button className="dropdown-trigger" onClick={() => setPageStyleExpanded(!pageStyleExpanded)}>
                {settings.pageStyle || "Default"}
                <FaChevronDown className={`dropdown-arrow ${pageStyleExpanded ? "rotated" : ""}`} />
              </button>

              {pageStyleExpanded && (
                <div className="dropdown-menu">
                  {["Neutral", "Modern", "Light"].map((option) => (
                    <div key={option} className="dropdown-item" onClick={() => handlePageStyleSelect(option)}>
                      {option}
                    </div>
                  ))}

                  <div className="dropdown-item-with-submenu">
                    <div className="dropdown-item" onClick={() => handlePageStyleSelect("Traditional")}>
                      Traditional
                      <FaChevronDown className={`submenu-arrow ${subMenuExpanded.traditional ? "rotated" : ""}`} />
                    </div>
                    {subMenuExpanded.traditional && (
                      <div className="submenu">
                        {["Classic", "Corporate", "Doc Style"].map((subOption) => (
                          <div key={subOption} className="submenu-item" onClick={() => handleSubStyleSelect(subOption)}>
                            {subOption}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="dropdown-item-with-submenu">
                    <div className="dropdown-item" onClick={() => handlePageStyleSelect("Tall")}>
                      Tall
                      <FaChevronDown className={`submenu-arrow ${subMenuExpanded.tall ? "rotated" : ""}`} />
                    </div>
                    {subMenuExpanded.tall && (
                      <div className="submenu">
                        {["Stacked", "Scrollable", "Padded"].map((subOption) => (
                          <div key={subOption} className="submenu-item" onClick={() => handleSubStyleSelect(subOption)}>
                            {subOption}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="dropdown-item-with-submenu">
                    <div className="dropdown-item" onClick={() => handlePageStyleSelect("Chart")}>
                      Chart
                      <FaChevronDown className={`submenu-arrow ${subMenuExpanded.chart ? "rotated" : ""}`} />
                    </div>
                    {subMenuExpanded.chart && (
                      <div className="submenu">
                        {["Auto Select", "Bar Chart", "Pie Chart", "Line Chart"].map((subOption) => (
                          <div key={subOption} className="submenu-item" onClick={() => handleSubStyleSelect(subOption)}>
                            {subOption}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="setting-group">
            <label className="setting-label">Font</label>
            <select name="font" value={settings.font || "Inter"} onChange={handleChange} className="setting-select">
              <option value="Inter">Inter</option>
              <option value="Poppins">Poppins</option>
              <option value="Roboto">Roboto</option>
              <option value="Lateef">Lateef</option>
              <option value="Lato">Lato</option>
              <option value="Inika">Inika</option>
              <option value="Sofia Sans">Sofia Sans</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="setting-section">
        <div className="section-header" onClick={() => toggleSection("content")}>
          <h3 className="section-title">Content</h3>
          <button className="expand-btn">{expandedSections.content ? <FaChevronUp /> : <FaChevronDown />}</button>
        </div>

        <div className={`section-content ${expandedSections.content ? "expanded" : "collapsed"}`}>
          <div className="setting-group">
            <label className="setting-label">Content Style</label>
            <select
              name="contentStyle"
              value={settings.contentStyle || "Default"}
              onChange={handleChange}
              className="setting-select"
            >
              <option>Default</option>
              <option>Freeform </option>
              <option>Card-by-Card </option>
              <option>Bullet Focused</option>
              <option>visual-Led</option>
            </select>
          </div>
        </div>
      </div>

      {/* Token Counter */}
      <div className="token-counter">
        <div className="token-circle"></div>
        <span>500/20000</span>
      </div>

      {/* Additional Instructions */}
      <div className="setting-section">
        <div className="section-header">
          <h3 className="section-title">Additional instructions</h3>
        </div>
        <div className="section-content expanded">
          <textarea
            name="additionalInstructions"
            value={settings.additionalInstructions}
            onChange={handleChange}
            className="instructions-textarea"
            placeholder="XXX - Beauty Introduction"
            rows="2"
          />
        </div>
      </div>

      {/* Tips Section */}
      <div className="setting-section">
        <div className="section-header">
          <h3 className="section-title">Tips</h3>
        </div>
        <div className="section-content expanded">
          <div className="tips-content">
            <div className="tip-item">
              <div className="tip-header">
                <FaLightbulb className="tip-icon" />
                <span>Card-by-Card</span>
              </div>
              <p>
                Card-by-card lets you specify exactly where card breaks should go, so you can outline your content card
                by card.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsPanel
