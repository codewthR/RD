import React from "react"
import { Share, Users, Save, Trash2 } from "lucide-react"
import "./DownloadDropdown.css"

const DownloadDropdown = ({ isOpen, onClose, onAction }) => {
  if (!isOpen) return null

  const handleAction = (action) => {
    onAction(action)
    onClose()
  }

  return (
    <div className="download-dropdown">
      <div className="dropdown-item" onClick={() => handleAction("share")}>
        <Share size={20} />
        <span>Share</span>
      </div>
      <div className="dropdown-item" onClick={() => handleAction("collaboration")}>
        <Users size={24} />
        <span>Collaboration</span>
      </div>
      <div className="dropdown-item" onClick={() => handleAction("save")}>
        <Save size={20} />
        <span>Save</span>
      </div>
      <div className="dropdown-item" onClick={() => handleAction("delete")}>
        <Trash2 size={24} />
        <span>Delete</span>
      </div>
    </div>
  )
}

export default DownloadDropdown
