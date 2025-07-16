import React from "react"
import { useState, useEffect } from "react"
import { Routes, Route, Link, useNavigate } from "react-router-dom"
import MainHomePage from "./components/MainHomePage/MainHomePage"
import TemplateGallery from "./components/TemplateGallery"
import PromptEditorPage from "./pages/PromptEditorPage"
import PromptInput from "./components/PromptInput/PromptInput"
import Preview from "./components/Preview/Preview"
import Presentation from "./components/Presentation/Presentation"
import { FaArrowLeft, FaEdit } from "react-icons/fa"
import "bootstrap/dist/css/bootstrap.min.css"
import GeneratePromptPage from "./pages/GeneratePromptPage"

function Home() {
  const navigate = useNavigate()
  const [isGenerating, setIsGenerating] = useState(false)
  const [smartPromptData, setSmartPromptData] = useState({
    prompt: "",
    attachments: [],
    selectedOptions: {
      Model: "Gemini",
      Slides: "5",
      Font: "Arial",
      Style: "Professional",
      Content: "Medium",
    }
  })

  const handleGenerate = async (promptData) => {
    setIsGenerating(true)
    try {
      const response = await fetch("/api/generate-presentation/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken") || ""}`,
        },
        body: JSON.stringify({
          prompt: promptData.prompt,
          attachments: promptData.attachments || [],
          selectedOptions: promptData.selectedOptions || {},
          timestamp: new Date().toISOString(),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to generate presentation")
      }

      const result = await response.json()
      console.log("Generation successful:", result)

      // Track successful generation
      await fetch("/api/analytics/track-feature-usage/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          feature: "presentation_generated",
          userId: localStorage.getItem("userId") || "anonymous",
          timestamp: new Date().toISOString(),
        }),
      }).catch((err) => console.error("Analytics tracking failed:", err))

      // Navigate to editor page with generated data
      navigate("/prompt-editor", {
        state: {
          presentationId: result.presentation.id,
          generatedData: result.presentation,
          success: true,
          message: result.message,
          promptData: promptData,
        },
      })
    } catch (error) {
      console.error("Error generating presentation:", error)

      // Log error to analytics
      await fetch("/api/analytics/log-error/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          error: `Presentation generation failed: ${error.message}`,
          userId: localStorage.getItem("userId") || "anonymous",
          timestamp: new Date().toISOString(),
        }),
      }).catch((err) => console.error("Error logging failed:", err))

      // Show user-friendly error message
      alert(`Failed to generate presentation: ${error.message}`)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSmartPromptSubmit = (generatedPrompt, files) => {
    const promptData = {
      prompt: generatedPrompt,
      attachments: [...smartPromptData.attachments, ...files],
      selectedOptions: smartPromptData.selectedOptions
    }
    
    handleGenerate(promptData)
  };

  const handleBack = async () => {
    try {
      await fetch("/api/track-navigation/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "back_button_clicked",
          timestamp: new Date().toISOString(),
          userId: localStorage.getItem("userId") || "anonymous",
        }),
      })
    } catch (err) {
      console.error("Navigation tracking failed:", err)
    }

    window.history.back()
  }

  const handlePromptEditor = async () => {
    try {
      await fetch("/api/track-navigation/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "prompt_editor_clicked",
          timestamp: new Date().toISOString(),
          userId: localStorage.getItem("userId") || "anonymous",
        }),
      })
    } catch (err) {
      console.error("Navigation tracking failed:", err)
    }

    navigate("/prompt-editor")
  }

  const handleGeneratePrompt = async () => {
    try {
      await fetch("/api/track-navigation/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "generate_prompt_clicked",
          timestamp: new Date().toISOString(),
          userId: localStorage.getItem("userId") || "anonymous",
        }),
      })
    } catch (err) {
      console.error("Navigation tracking failed:", err)
    }

    navigate("/generate-prompt-container")
  }

  return (
    <div className="app-wrapper">
      <button className="back-button" onClick={handleBack}>
        <FaArrowLeft />
        Back
      </button>

      <button className="prompt-editor-button" onClick={handlePromptEditor}>
        <FaEdit />
        Editor
      </button>

      <div className="main-card">
        <div className="split-back1">
          <h1 className="presentation-title">Presentation</h1>
          <p className="subtitle">Create Like a Pro — Powered by AI</p>
          <h2 className="ai-presentation-title">AI PPT Presentation</h2>

          <div className="section-box">
            <PromptInput 
              onGenerate={handleGenerate} 
              isGenerating={isGenerating}
              onSmartPromptSubmit={handleSmartPromptSubmit}
              smartPromptData={smartPromptData}
              setSmartPromptData={setSmartPromptData}
            />
          </div>
        </div>
        <div className="split-back2">
          <div className="section-box">
            <TemplateGallery />
          </div>
        </div>
      </div>
    </div>
  )
}

function GeneratePrompt() {
  const [pitchDetails, setPitchDetails] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationResult, setGenerationResult] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsGenerating(true)
    setGenerationResult(null)

    try {
      console.log("Submitting pitch details:", pitchDetails)

      const response = await fetch("/api/generate-presentation/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken") || ""}`,
        },
        body: JSON.stringify({
          prompt: pitchDetails,
          selectedOptions: {
            Model: "Gemini",
            Slides: "10",
            Font: "Arial",
            Style: "Professional",
            Content: "Comprehensive",
          },
          timestamp: new Date().toISOString(),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to generate pitch deck")
      }

      const result = await response.json()
      setGenerationResult(result)

      // Track successful pitch generation
      await fetch("/api/analytics/track-feature-usage/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          feature: "pitch_deck_generated",
          userId: localStorage.getItem("userId") || "anonymous",
          timestamp: new Date().toISOString(),
        }),
      }).catch((err) => console.error("Analytics tracking failed:", err))
    } catch (error) {
      console.error("Error generating pitch deck:", error)
      setGenerationResult({
        success: false,
        error: error.message,
      })

      // Log error
      await fetch("/api/analytics/log-error/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          error: `Pitch deck generation failed: ${error.message}`,
          userId: localStorage.getItem("userId") || "anonymous",
          timestamp: new Date().toISOString(),
        }),
      }).catch((err) => console.error("Error logging failed:", err))
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="generate-prompt-container">
      <div className="background-overlay">
        <div className="gradient-top"></div>
        <div className="gradient-bottom"></div>
        <div className="angular-gradient"></div>
      </div>

      <div className="main-card">
        <div className="card-header">
          <button className="back-button" onClick={() => window.history.back()}>
            <FaArrowLeft style={{ marginRight: "6px" }} />
            <span>Back</span>
          </button>
          <h1>Generate Your Pitch Deck</h1>
        </div>

        <div className="content-section">
          <div className="input-container">
            <h2>Enter Your Company Details</h2>
            <p>
              Provide information about your company, product, target market, and unique value proposition to generate a
              customized pitch deck.
            </p>

            <form onSubmit={handleSubmit}>
              <textarea
                value={pitchDetails}
                onChange={(e) => setPitchDetails(e.target.value)}
                placeholder="Describe your business, product, target audience, competitive advantage, and financial projections..."
                rows={8}
                required
              />

              <button type="submit" className="generate-button" disabled={isGenerating || !pitchDetails.trim()}>
                {isGenerating ? "Generating..." : "Generate Pitch Deck"}
              </button>
            </form>

            {generationResult && (
              <div className={`generation-result ${generationResult.success ? "success" : "error"}`}>
                {generationResult.success ? (
                  <div>
                    <h3>✅ Pitch Deck Generated Successfully!</h3>
                    <p>
                      Your presentation has been created with {generationResult.presentation?.slides?.length || 0}{" "}
                      slides.
                    </p>
                    <p>
                      <strong>Title:</strong> {generationResult.presentation?.title}
                    </p>
                  </div>
                ) : (
                  <div>
                    <h3>❌ Generation Failed</h3>
                    <p>{generationResult.error}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="features-section">
            <div className="feature">
              <h3>AI-Powered Content</h3>
              <p>Automatically generates compelling pitch content</p>
            </div>
            <div className="feature">
              <h3>Professional Templates</h3>
              <p>Uses investor-approved deck structures</p>
            </div>
            <div className="feature">
              <h3>Data-Driven Insights</h3>
              <p>Incorporates market data and financial best practices</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function MainPage() {
  return (
    <div className="main-page">
      <h1>AI Presentation Generator</h1>

      <div className="temp-nav-section">
        <h2>Customize Your Theme</h2>
        <Link to="/customize/color" className="temp-nav-button">
          Go to Customization Pages
        </Link>
      </div>

      <div className="main-nav">
        <Link to="/prompt" className="nav-button">
          Create Presentation
        </Link>
        <Link to="/templates" className="nav-button">
          Browse Templates
        </Link>
      </div>
    </div>
  )
}

function App() {
  // Initialize user session
  useEffect(() => {
    if (!localStorage.getItem("userId")) {
      localStorage.setItem("userId", `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`)
    }
    if (!sessionStorage.getItem("sessionId")) {
      sessionStorage.setItem("sessionId", `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`)
    }
  }, [])

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<MainHomePage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/prompt" element={<PromptInput onGenerate={() => {}} />} />
        <Route path="/templates" element={<TemplateGallery />} />
        <Route path="/preview/:id" element={<Preview />} />
        <Route path="/presentation" element={<Presentation />} />
        <Route path="/prompt-editor" element={<PromptEditorPage />} />
        <Route path="/generate-prompt-page" element={<GeneratePromptPage />} />
        <Route path="/generate" element={<GeneratePrompt />} />
        <Route path="/preview" element={<Preview />} />
      </Routes>
    </div>
  )
}

export default App