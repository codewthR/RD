import React from 'react'; 
"use client"

import { useState, useEffect } from "react"
import "./TemplateGallery.css"
import { FaCheck, FaShuffle } from "react-icons/fa6"

const TemplateGallery = () => {
  const [selectedStyle, setSelectedStyle] = useState("All")
  const [selectedColor, setSelectedColor] = useState("all")
  const [selectedTheme, setSelectedTheme] = useState("All")
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [templates, setTemplates] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [analytics, setAnalytics] = useState({
    totalViews: 0,
    popularTemplates: [],
    userPreferences: {},
  })

  const styles = ["All", "Artistic", "Creative"," Professional ", "Trendy & Modern", "Customize Theme"]
  const colors = [
    { name: "all", label: "All", class: "all" },
    { name: "red", label: "Red", class: "red" },
    { name: "green", label: "Green", class: "green" },
    { name: "blue", label: "Blue", class: "blue" },
    { name: "magenta", label: "Magenta", class: "magenta" },
    { name: "cyan", label: "Cyan", class: "cyan" },
    { name: "yellow", label: "Yellow", class: "yellow" },
  ]

  const themes = [
    "New","Standard","Custom"
  ]

  const sampleTemplates = [
    {
      id: 1,
      title: "Business Proposal",
      description: "Professional business presentation template",
      // // style: "Professional",
      // color: "blue",
      image: "/placeholder.svg?height=180&width=280",
      slides: 12,
      category: "Business",
      popularity: 95,
      theme: "Standard",

      
    },
    {
      id: 2,
      title: "Creative Portfolio",
      description: "Showcase your creative work",
      // style: "Creative",
      // color: "magenta",
      image: "/placeholder.svg?height=180&width=280",
      slides: 8,
      category: "Portfolio",
      // popularity: 87,
      // theme: "Standard",

    },
    {
      id: 3,
      title: "Modern Startup",
      description: "Clean and modern startup pitch",
      style: "Modern",
      color: "green",
      image: "/placeholder.svg?height=180&width=280",
      slides: 15,
      category: "Startup",
      popularity: 92,
      theme: "Standard",
    },
    {
      id: 4,
      title: "Corporate Report",
      description: "Professional corporate presentation",
      style: "Corporate",
      color: "blue",
      image: "/placeholder.svg?height=180&width=280",
      slides: 20,
      category: "Corporate",
      popularity: 89,
      theme: "Standard",
    },
    {
      id: 5,
      title: "Minimalist Design",
      description: "Clean and simple design approach",
      style: "Minimalist",
      color: "cyan",
      image: "/placeholder.svg?height=180&width=280",
      slides: 10,
      category: "Design",
      popularity: 78,
      theme: "Standard",
    },
    {
      id: 6,
      title: "Creative Agency",
      description: "Bold and creative agency presentation",
      style: "Creative",
      color: "red",
      image: "/placeholder.svg?height=180&width=280",
      slides: 14,
      category: "Agency",
      popularity: 84,
      theme: "Standard",
    },
    {
      id: 7,
      title: "Tech Innovation",
      description: "Technology and innovation focused",
      style: "Modern",
      color: "blue",
      image: "/placeholder.svg?height=180&width=280",
      slides: 18,
      category: "Technology",
      popularity: 91,
      theme: "Standard",

    },
    {
      id: 8,
      title: "Marketing Strategy",
      description: "Comprehensive marketing presentation",
      style: "Professional",
      color: "green",
      image: "/placeholder.svg?height=180&width=280",
      slides: 16,
      category: "Marketing",
      popularity: 86,
      theme: "Standard",
    },
  ]

  useEffect(() => {
    loadTemplates()
    loadAnalytics()
  }, [])

  const loadTemplates = async () => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      setTemplates(sampleTemplates)

      await fetch("/api/analytics/track-feature-usage/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          feature: "template_gallery_viewed",
          userId: localStorage.getItem("userId") || "anonymous",
          timestamp: new Date().toISOString(),
        }),
      }).catch((err) => console.error("Analytics tracking failed:", err))
    } catch (error) {
      console.error("Error loading templates:", error)
      await fetch("/api/analytics/log-error/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          error: `Failed to load templates: ${error.message}`,
          userId: localStorage.getItem("userId") || "anonymous",
          timestamp: new Date().toISOString(),
        }),
      }).catch((err) => console.error("Error logging failed:", err))
    } finally {
      setIsLoading(false)
    }
  }

  const loadAnalytics = async () => {
    try {
      const response = await fetch("/api/analytics/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken") || ""}`,
        },
      })

      if (response.ok) {
        const analyticsData = await response.json()
        setAnalytics({
          totalViews: analyticsData.total_events || 0,
          popularTemplates: analyticsData.popular_templates || [],
          userPreferences: analyticsData.user_preferences || {},
        })
      }
    } catch (error) {
      console.error("Error loading analytics:", error)
    }
  }

  const handleStyleFilter = async (style) => {
    setSelectedStyle(style)
    try {
      await fetch("/api/analytics/track-option-usage/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          optionType: "template_style_filter",
          selectedValue: style,
          userId: localStorage.getItem("userId") || "anonymous",
          sessionId: sessionStorage.getItem("sessionId") || "",
          timestamp: new Date().toISOString(),
        }),
      })
    } catch (error) {
      console.error("Error tracking style filter:", error)
    }
  }

  const handleColorFilter = async (color) => {
    setSelectedColor(color)
    try {
      await fetch("/api/analytics/track-option-usage/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          optionType: "template_color_filter",
          selectedValue: color,
          userId: localStorage.getItem("userId") || "anonymous",
          sessionId: sessionStorage.getItem("sessionId") || "",
          timestamp: new Date().toISOString(),
        }),
      })
    } catch (error) {
      console.error("Error tracking color filter:", error)
    }
  }

  const handleThemeFilter = async (theme) => {
    setSelectedTheme(theme)
    try {
      await fetch("/api/analytics/track-option-usage/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          optionType: "template_theme_filter",
          selectedValue: theme,
          userId: localStorage.getItem("userId") || "anonymous",
          sessionId: sessionStorage.getItem("sessionId") || "",
          timestamp: new Date().toISOString(),
        }),
      })
    } catch (error) {
      console.error("Error tracking theme filter:", error)
    }
  }

  const handleTemplateSelect = async (template) => {
    setSelectedTemplate(template.id)
    try {
      await fetch("/api/analytics/track-feature-usage/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          feature: "template_selected",
          userId: localStorage.getItem("userId") || "anonymous",
          metadata: {
            templateId: template.id,
            templateTitle: template.title,
            templateStyle: template.style,
            templateColor: template.color,
            templateTheme: template.theme,
          },
          timestamp: new Date().toISOString(),
        }),
      })
    } catch (error) {
      console.error("Error tracking template selection:", error)
    }
  }

  const handleShuffle = async () => {
    setIsLoading(true)
    try {
      const shuffled = [...templates].sort(() => Math.random() - 0.5)
      setTemplates(shuffled)
      await fetch("/api/analytics/track-feature-usage/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          feature: "templates_shuffled",
          userId: localStorage.getItem("userId") || "anonymous",
          timestamp: new Date().toISOString(),
        }),
      })
    } catch (error) {
      console.error("Error shuffling templates:", error)
    } finally {
      setTimeout(() => setIsLoading(false), 300)
    }
  }

  const filteredTemplates = templates.filter((template) => {
    const styleMatch = selectedStyle === "All" || template.style === selectedStyle
    const colorMatch = selectedColor === "all" || template.color === selectedColor
    const themeMatch = selectedTheme === "All" || template.theme === selectedTheme
    return styleMatch && colorMatch && themeMatch
  })

  return (
    <div className="template-gallery">
      <div className="section-divider">
        <hr />
        <h2 className="template-heading">Choose Template</h2>
        <hr />
      </div>

      <div className="filters">
        <div className="filter-group">
          <span className="filter-label">Style:</span>
          <div className="style-filter">
            {styles.map((style) => (
              <button
                key={style}
                className={`style-button ${selectedStyle === style ? "active" : ""}`}
                onClick={() => handleStyleFilter(style)}
                disabled={isLoading}
              >
                {style}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <span className="filter-label">Color:</span>
          <div className="color-filter">
            {colors.map((color) => (
              <div key={color.name} className="color-label-wrapper">
                <button
                  className={`color-btn ${color.class} ${selectedColor === color.name ? "active" : ""}`}
                  onClick={() => handleColorFilter(color.name)}
                  disabled={isLoading}
                  title={color.label}
                />
                <span className="color-label">{color.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <span className="filter-label">Theme:</span>
          <div className="style-filter">
            {themes.map((theme) => (
              <button
                key={theme}
                className={`style-button ${selectedTheme === theme ? "active" : ""}`}
                onClick={() => handleThemeFilter(theme)}
                disabled={isLoading}
              >
                {theme}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="template-types">
        <button className="shuffle-button" onClick={handleShuffle} disabled={isLoading} title="Shuffle templates">
          <FaShuffle />
          {isLoading ? "Shuffling..." : "Shuffle"}
        </button>
      </div>

      {isLoading ? (
        <div className="loading-container">
          <div className="loading-spinner">Loading templates...</div>
        </div>
      ) : (
        <>
          <div className="template-grid">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className={`template-card ${selectedTemplate === template.id ? "selected" : ""}`}
                onClick={() => handleTemplateSelect(template)}
              >
                <div className="template-image" style={{ backgroundImage: `url(${template.image})` }}>
                  <div className="template-content">
                    <div className="content-title">{template.title}</div>
                    <div className="content-body">{template.description}</div>
                  </div>
                </div>
                <div className="content-list">
                  <div>
                    <strong>{template.category}</strong>
                    <br />
                    {template.slides} slides • {template.style} • {template.theme}
                    <br />
                    <small>Popularity: {template.popularity}%</small>
                  </div>
                </div>
                {selectedTemplate === template.id && (
                  <div className="selected-check">
                    <FaCheck />
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="no-templates">
              <p>No templates found matching your criteria.</p>
              <button
                className="style-button"
                onClick={() => {
                  setSelectedStyle("All")
                  setSelectedColor("all")
                  setSelectedTheme("All")
                }}
              >
                Clear Filters
              </button>
            </div>
          )}
        </>
      )}

      <div className="template-footer">
        <button className="footer-btn" disabled={!selectedTemplate}>
          Use Selected Template
        </button>
      </div>

      {analytics.totalViews > 0 && (
        <div className="analytics-info">
          <small>
            Gallery viewed {analytics.totalViews} times •{filteredTemplates.length} templates available
          </small>
        </div>
      )}
    </div>
  )
}

export default TemplateGallery
