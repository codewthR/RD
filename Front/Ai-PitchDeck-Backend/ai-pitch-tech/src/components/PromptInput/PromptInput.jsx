import React from "react"
import { useState, useRef, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import "./PromptInput.css"

import { FaLink, FaPaperclip, FaMagic, FaRegImage, FaPlus, FaTimes, FaChevronDown } from "react-icons/fa"
import QuestionPopup from "../QuestionPopup/QuestionPopup"

const PromptInput = ({ onGenerate, isGenerating, onSmartPromptSubmit, smartPromptData, setSmartPromptData }) => {
  const navigate = useNavigate()

  const optionsData = [
    { name: "Model", values: ["OpenAI", "Gemini", "Claude", "GPT-4", "GPT-3.5", "Llama"] },
    {
      name: "Slides",
      values: [
        " 1",
        " 2",
        " 3",
        " 4",
        " 5",
        " 6",
        " 7",
        " 8",
        " 9",
        " 10",
      ],
    },
    {
      name: "Font",
      values: [
        "Arial",
        "Calibri",
        "Verdana",
        "Tahoma",
        "Trebuchet MS",
        "Century Gothic",
        "Segoe UI",
        "Helvetica",
        "Lato",
        "Montserrat",
        "Roboto",
        "Open Sans",
        "Poppins",
        "Inter",
        "Nunito",
        "Raleway",
        "Ubuntu",
        "Work Sans",
        "DM Sans",
        "Times New Roman",
        "Georgia",
        "Garamond",
        "Merriweather",
        "Comic Sans MS",
        "Papyrus",
        "Curlz MT",
        "Courier New",
        "Gill Sans",
        "Futura",
      ],
    },
    { name: "Style", values: ["Professional", "Casual", "Modern", "Creative", "Minimalist", "Corporate"] },
    { name: "Content", values: ["Brief", "Medium", "Detailed", "Comprehensive"] },
  ]

  const [prompt, setPrompt] = useState(smartPromptData.prompt || "")
  const [attachments, setAttachments] = useState(smartPromptData.attachments || [])
  const [showQuestionPopup, setShowQuestionPopup] = useState(false)
  const [showAttachmentOptions, setShowAttachmentOptions] = useState(false)
  const [selectedOptions, setSelectedOptions] = useState(smartPromptData.selectedOptions || {
    Model: "OpenAI",
    Slides: "5",
    Font: "Arial",
    Style: "Professional",
    Content: "Medium",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState({})

  const fileInputRef = useRef(null)
  const companyInputRef = useRef(null)

  useEffect(() => {
    const loadUserData = async () => {
      setIsLoading(true)
      try {
        const response = await fetch("/api/user/preferences/", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken") || ""}`,
            "Content-Type": "application/json",
          },
        })

        if (response.ok) {
          const userData = await response.json()
          if (userData.lastSelectedOptions) {
            const newOptions = { ...selectedOptions, ...userData.lastSelectedOptions }
            setSelectedOptions(newOptions)
            updateSmartPromptData({ selectedOptions: newOptions })
          }
          if (userData.lastPrompt) {
            setPrompt(userData.lastPrompt)
            updateSmartPromptData({ prompt: userData.lastPrompt })
          }
          if (userData.savedAttachments && Array.isArray(userData.savedAttachments)) {
            setAttachments(userData.savedAttachments)
            updateSmartPromptData({ attachments: userData.savedAttachments })
          }
        } else {
          console.warn("Failed to load user preferences:", response.status)
        }
      } catch (error) {
        console.error("Error loading user data:", error)

        // Log error to backend
        try {
          await fetch("/api/analytics/log-error/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              error: `Failed to load user data: ${error.message}`,
              userId: localStorage.getItem("userId") || "anonymous",
              timestamp: new Date().toISOString(),
            }),
          })
        } catch (logError) {
          console.error("Failed to log error:", logError)
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadUserData()
  }, [])

  const updateSmartPromptData = (updates) => {
    setSmartPromptData(prev => ({
      ...prev,
      ...updates
    }))
  }

  const handleOptionChange = async (optionName, value) => {
    const newOptions = { ...selectedOptions, [optionName]: value }
    setSelectedOptions(newOptions)
    updateSmartPromptData({ selectedOptions: newOptions })

    try {
      // Save preferences to backend
      await fetch("/api/user/save-preferences/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken") || ""}`,
        },
        body: JSON.stringify({
          userId: localStorage.getItem("userId") || "anonymous",
          selectedOptions: newOptions,
          timestamp: new Date().toISOString(),
        }),
      })

      // Track option usage
      await fetch("/api/analytics/track-option-usage/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          optionType: optionName,
          selectedValue: value,
          userId: localStorage.getItem("userId") || "anonymous",
          sessionId: sessionStorage.getItem("sessionId") || "",
          timestamp: new Date().toISOString(),
        }),
      })
    } catch (error) {
      console.error("Error saving preferences:", error)
    }
  }

  useEffect(() => {
    const savePromptDebounced = async () => {
      if (prompt.length > 5) {
        try {
          await fetch("/api/user/auto-save-prompt/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("authToken") || ""}`,
            },
            body: JSON.stringify({
              userId: localStorage.getItem("userId") || "anonymous",
              prompt,
              timestamp: new Date().toISOString(),
            }),
          })
          updateSmartPromptData({ prompt })
        } catch (error) {
          console.error("Error auto-saving prompt:", error)
        }
      }
    }

    const debounceTimer = setTimeout(savePromptDebounced, 2000)
    return () => clearTimeout(debounceTimer)
  }, [prompt])

  const handleSmartPrompt = async () => {
    setShowQuestionPopup(true)

    try {
      await fetch("/api/analytics/track-feature-usage/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          feature: "smart_prompt",
          userId: localStorage.getItem("userId") || "anonymous",
          timestamp: new Date().toISOString(),
        }),
      })
    } catch (err) {
      console.error("Feature tracking failed:", err)
    }
  }

  const handleAttachFile = () => {
    fileInputRef.current?.click()
    setShowAttachmentOptions(false)
  }

  const handleAttachLink = () => {
    const link = prompt("Enter URL:")
    if (link && isValidUrl(link)) {
      addAttachment({ type: "link", content: link, name: "Link" })
    } else if (link) {
      alert("Please enter a valid URL")
    }
    setShowAttachmentOptions(false)
  }

  const handleAttachCompany = () => {
    companyInputRef.current?.click()
    setShowAttachmentOptions(false)
  }

  const isValidUrl = (string) => {
    try {
      new URL(string)
      return true
    } catch (_) {
      return false
    }
  }

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      alert("File size must be less than 10MB")
      return
    }

    // Validate file type
    const allowedTypes = [
      // "application/pdf",
      // "application/msword",
      // "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      // "application/vnd.ms-powerpoint",
      // "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/svg+xml",
    ]

    if (!allowedTypes.includes(file.type)) {
      alert("File type not supported. Please upload image files.")
      return
    }

    const formData = new FormData()
    formData.append("file", file)
    formData.append("userId", localStorage.getItem("userId") || "anonymous")
    formData.append("uploadType", e.target === companyInputRef.current ? "company_logo" : "general_file")

    const fileId = Date.now().toString()
    setUploadProgress((prev) => ({ ...prev, [fileId]: 0 }))

    try {
      const response = await fetch("/api/upload-file/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken") || ""}`,
        },
        body: formData,
      })

      if (response.ok) {
        const uploadResult = await response.json()
        const newAttachment = {
          type: "file",
          name: file.name,
          url: uploadResult.fileUrl,
          id: uploadResult.fileId,
          size: file.size,
          mimeType: file.type,
        }
        
        addAttachment(newAttachment)
        updateSmartPromptData({ attachments: [...attachments, newAttachment] })

        setUploadProgress((prev) => {
          const newProgress = { ...prev }
          delete newProgress[fileId]
          return newProgress
        })
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || "File upload failed")
      }
    } catch (error) {
      console.error("Error uploading file:", error)
      alert(`Failed to upload file: ${error.message}`)

      setUploadProgress((prev) => {
        const newProgress = { ...prev }
        delete newProgress[fileId]
        return newProgress
      })

      // Log upload error
      try {
        await fetch("/api/analytics/log-error/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            error: `File upload failed: ${error.message}`,
            userId: localStorage.getItem("userId") || "anonymous",
            timestamp: new Date().toISOString(),
          }),
        })
      } catch (logError) {
        console.error("Failed to log upload error:", logError)
      }
    }
  }

  const addAttachment = async (attachment) => {
    const newAttachment = { ...attachment, id: attachment.id || Date.now().toString() }
    const newAttachments = [...attachments, newAttachment]
    setAttachments(newAttachments)
    updateSmartPromptData({ attachments: newAttachments })
  }

  const removeAttachment = async (attachmentId) => {
    const newAttachments = attachments.filter((att) => att.id !== attachmentId)
    setAttachments(newAttachments)
    updateSmartPromptData({ attachments: newAttachments })

    try {
      await fetch(`/api/user/remove-attachment/${attachmentId}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken") || ""}`,
        },
      })
    } catch (error) {
      console.error("Error removing attachment:", error)
    }
  }

  const handleGenerate = () => {
    if (!prompt.trim()) {
      alert("Please enter a prompt before generating.")
      return
    }

    const promptData = {
      prompt,
      attachments,
      selectedOptions,
    }

    onGenerate(promptData)
  }

  const handleNavigateToGeneratePrompt = () => {
    navigate("/generate-prompt-page")
  }

  return (
    <div className="prompt-input-container">
      
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner">Loading preferences...</div>
        </div>
      )}

      <div className="deck-options">
        {optionsData.map((option, idx) => (
          <div key={idx} className="dropdown-wrapper">
            <select
              value={selectedOptions[option.name]}
              onChange={(e) => handleOptionChange(option.name, e.target.value)}
              className="custom-dropdown"
              disabled={isGenerating}
            >
              <option value="" disabled>
                {option.name}
              </option>
              {option.values.map((value, valueIdx) => (
                <option key={valueIdx} value={value}>
                  {value}
                </option>
              ))}
            </select>
            <div className="dropdown-display">
              <span className="dropdown-text">{selectedOptions[option.name] || option.name}</span>
              <FaChevronDown className="dropdown-arrow" />
            </div>
          </div>
        ))}
      </div>

      <div className="prompt-box">
        <textarea
          placeholder="Describe what you want to create"
          className="prompt-textarea"
          value={prompt}
          onChange={(e) => {
            setPrompt(e.target.value)
            updateSmartPromptData({ prompt: e.target.value })
          }}
          rows={4}
          disabled={isGenerating}
        />

        {attachments.length > 0 && (
          <div className="attachments-list">
            {attachments.map((attachment) => (
              <div key={attachment.id} className="attachment-item">
                <span title={attachment.name}>
                  {attachment.name.length > 30 ? `${attachment.name.substring(0, 30)}...` : attachment.name}
                </span>
                <button
                  onClick={() => removeAttachment(attachment.id)}
                  className="remove-attachment"
                  disabled={isGenerating}
                  title="Remove attachment"
                >
                  <FaTimes />
                </button>
              </div>
            ))}
          </div>
        )}

        {Object.keys(uploadProgress).length > 0 && (
          <div className="upload-progress">
            {Object.entries(uploadProgress).map(([fileId, progress]) => (
              <div key={fileId} className="progress-item">
                <span>Uploading...</span>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="prompt-footer">
          <div className="prompt-icons">
            <div className="attachment-dropdown">
              <FaPlus
                className={`icon plus-icon ${isGenerating ? "disabled" : ""}`}
                title="Add Attachment"
                onClick={() => !isGenerating && setShowAttachmentOptions(!showAttachmentOptions)}
              />

              {showAttachmentOptions && !isGenerating && (
                <div className="attachment-options">
                  <button onClick={handleAttachLink} className="attachment-option">
                    <FaLink /> Link
                  </button>
                  <button onClick={handleAttachFile} className="attachment-option">
                    <FaPaperclip /> File
                  </button>
                  <button onClick={handleAttachCompany} className="attachment-option">
                    <FaRegImage /> Company
                  </button>
                </div>
              )}
            </div>

            <button
              className={`smart-prompt-btn ${isGenerating ? "disabled" : ""}`}
              onClick={handleSmartPrompt}
              title="Smart Prompt Assistant"
              disabled={isGenerating}
            >
              Smart Prompt
            </button>
          </div>

          <button
            className={`generate-btn ${!prompt.trim() || isGenerating ? "disabled" : ""}`}
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
          >
            <FaMagic /> {isGenerating ? "Generating..." : "Generate"}
          </button>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
          accept=".jpg,.jpeg,.png,.gif"
          disabled={isGenerating}
        />
        <input
          type="file"
          ref={companyInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
          accept=".jpg,.jpeg,.png,.gif,.svg"
          disabled={isGenerating}
        />
      </div>

      {showQuestionPopup && (
        <div className="question-popup-container">
          <QuestionPopup 
            onClose={() => setShowQuestionPopup(false)} 
            onSubmit={onSmartPromptSubmit}
          />
        </div>
      )}
    </div>
  )
}

export default PromptInput