import React, { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { FaArrowLeft, FaAngleDoubleRight } from "react-icons/fa"
import SettingsPanel from "./SettingsPanel"
import ContentPanel from "./ContentPanel"
import "./PromptEditor.css"

const PromptEditor = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const [settings, setSettings] = useState({
    amountPerCard: "Medium",
    writeFor: "Business",
    tone: "Professional",
    outputLanguage: "English (US)",
    imageSource: "ai",
    aiModel: "GPT-4 Turbo",
    format: "Default",
    contentStyle: "Default",
    pageStyle: "Default",
    additionalInstructions: "XXX - Beauty Introduction",
  })

  const [cards, setCards] = useState([])

  useEffect(() => {
    if (location.state && location.state.generatedData) {
      try {
        const generatedSlides = location.state.generatedData.slides || []

        console.log("Received generated data:", location.state.generatedData)
        console.log("Generated slides:", generatedSlides)

        if (generatedSlides.length > 0) {
          const newCards = generatedSlides.map((slide, index) => {
            let content = {}
            if (typeof slide.content === "object") {
              content = slide.content
            } else if (typeof slide.content === "string") {
              try {
                content = JSON.parse(slide.content)
              } catch {
                content = { paragraph: slide.content }
              }
            }

            return {
              id: slide.id || index + 1,
              title: slide.title || slide.name || `Slide ${index + 1}`,
              contentType: slide.contentType || guessContentType(content),
              content: content,
            }
          })

          console.log("Converted cards:", newCards)
          setCards(newCards)

          if (location.state.generatedData.metadata) {
            const metadata = location.state.generatedData.metadata
            setSettings((prev) => ({
              ...prev,
              tone: metadata.Style || prev.tone,
              aiModel: metadata.Model || prev.aiModel,
            }))
          }
        } else {
          console.warn("No slides found in generated data")
        }
      } catch (error) {
        console.error("Error processing generated data:", error)
      }
    } else {
      console.log("No generated data found in location state")
    }
  }, [location.state])

  const guessContentType = (content) => {
    if (content.bullets) return "bullets"
    if (content.paragraph) return "paragraph"
    if (content.numbered) return "numbered"
    if (content.analytics) return "analytics"
    return "paragraph"
  }

  const handleBack = () => {
    window.history.back()
  }

  const handleContinue = () => {
    const navigationData = {
      cards: cards,
      settings: settings,
      presentationId: location.state?.presentationId || null,
    }

    console.log("Navigating to presentation with data:", navigationData)
    navigate("/presentation", {
      state: navigationData,
    })
  }

  return (
    <div className="prompt-editor-page">
      <div className="prompt-editor-container">
        <button className="back-button" onClick={handleBack}>
          <FaArrowLeft />
          Back
        </button>

        <div className="editor-grid">
          <div className="settings-column">
            <SettingsPanel settings={settings} onChange={setSettings} />
          </div>
          <div className="content-column">
            <ContentPanel cards={cards} onChange={setCards} />
          </div>
        </div>

        <div className="continue-footer">
          <div className="slide-count">{cards.length} Cards Total</div>
          <div className="continue-box" onClick={handleContinue}>
            <div className="continue-content">
              <span className="continue-text">Continue</span>
              <FaAngleDoubleRight className="continue-icon" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PromptEditor
