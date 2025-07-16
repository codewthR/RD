import React from "react"
import { Routes, Route } from "react-router-dom";
import PromptEditor from "../components/PromptEditor/PromptEditor"
import Presentation from "../components/Presentation/Presentation";
import "./PromptEditorPage.css"

function PromptEditorPage() {
  return (
    <div className="prompt-editor-page">
       <Routes>
          <Route path="/" element={<PromptEditor />} />
          <Route path="/presentation" element={<Presentation />} />
        </Routes>
    </div>
  )
}

export default PromptEditorPage
