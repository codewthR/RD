// Card.jsx
import React, { useState, useEffect } from "react"
import { FaGripVertical, FaTrash } from "react-icons/fa"

const Card = ({ card, onChange, onDelete }) => {
  const [contentType, setContentType] = useState(card.contentType || "paragraph")

  useEffect(() => {
    if (!card.contentType) {
      onChange({
        ...card,
        contentType: "paragraph",
        content: { paragraph: card.content || "" },
      })
    }
  }, [])

  const handleTitleChange = (e) => {
    onChange({ ...card, title: e.target.value })
  }

  const handleContentChange = (e, index = null) => {
    const value = e.target.value
    let updatedContent = {}

    switch (contentType) {
      case "paragraph":
        updatedContent = { paragraph: value }
        break
      case "bullets":
        updatedContent = { bullets: [...(card.content?.bullets || [])] }
        updatedContent.bullets[index] = value
        break
      case "numbered":
        updatedContent = { numbered: [...(card.content?.numbered || [])] }
        updatedContent.numbered[index] = value
        break
      default:
        updatedContent = {}
    }

    onChange({ ...card, content: updatedContent, contentType })
  }

  const handleAddItem = () => {
    const current = card.content?.[contentType] || []
    const updated = [...current, ""]
    onChange({
      ...card,
      content: { [contentType]: updated },
      contentType,
    })
  }

  const renderEditor = () => {
    switch (contentType) {
      case "paragraph":
        return (
          <textarea
            value={card.content?.paragraph || ""}
            onChange={(e) => handleContentChange(e)}
            placeholder="Enter paragraph content"
            className="card-content-input"
          />
        )
      case "bullets":
      case "numbered":
        const listItems = card.content?.[contentType] || []
        return (
          <>
            {listItems.map((item, idx) => (
              <input
                key={idx}
                type="text"
                value={item}
                onChange={(e) => handleContentChange(e, idx)}
                placeholder={`Item ${idx + 1}`}
                className="card-content-input"
              />
            ))}
            <button onClick={handleAddItem}>Add Item</button>
          </>
        )
      default:
        return <p>Unsupported content type</p>
    }
  }

  return (
    <div className="card">
      <div className="card-header">
        <div className="drag-handle">
          <FaGripVertical />
        </div>
        <input
          type="text"
          value={card.title}
          onChange={handleTitleChange}
          placeholder="Card title"
          className="card-title-input"
        />
        <select
          value={contentType}
          onChange={(e) => {
            setContentType(e.target.value)
            onChange({ ...card, contentType: e.target.value, content: {} })
          }}
        >
          <option value="paragraph">Paragraph</option>
          <option value="bullets">Bullets</option>
          <option value="numbered">Numbered</option>
        </select>
        <button className="delete-card-btn" onClick={onDelete}>
          <FaTrash />
        </button>
      </div>
      <div className="card-body">{renderEditor()}</div>
    </div>
  )
}

export default Card
