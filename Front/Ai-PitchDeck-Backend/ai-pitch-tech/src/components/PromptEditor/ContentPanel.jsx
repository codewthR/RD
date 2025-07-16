import React from "react"
import "./ContentPanel.css"
import { FaTrash } from "react-icons/fa"

const getCardColor = (index) => {
  return index % 2 === 0 ? "green" : "yellow"
}

const cleanText = (text) => {
  return text.replace(/\*\*/g, '').trim()
}

const hasUsableContent = (card) => {
  const { contentType, content } = card
  if (!contentType || !content) return false

  if (contentType === "paragraph" && content.paragraph?.trim()) return true
  if (contentType === "bullets" && Array.isArray(content.bullets) && content.bullets.length > 0) return true
  if (contentType === "numbered" && Array.isArray(content.numbered) && content.numbered.length > 0) return true
  if (contentType === "analytics" && Array.isArray(content.analytics) && content.analytics.length > 0) return true

  return false
}

const renderContent = (card) => {
  const { contentType, content } = card

  if (contentType === "paragraph" && content.paragraph) {
    return <p>{cleanText(content.paragraph)}</p>
  }

  if (contentType === "bullets" && Array.isArray(content.bullets)) {
    return (
      <ul>
        {content.bullets.map((item) => (
          <li>{cleanText(item)}</li>
        ))}
      </ul>
    )
  }

  if (contentType === "numbered" && Array.isArray(content.numbered)) {
    return (
      <ol>
        {content.numbered.map((item) => (
          <li>{cleanText(item)}</li>
        ))}
      </ol>
    )
  }

  if (contentType === "analytics" && Array.isArray(content.analytics)) {
    return (
      <ul>
        {content.analytics.map((item) => (
          <li>
            <strong>{cleanText(item.label)}</strong>: {cleanText(item.value)} ({cleanText(item.trend)})
          </li>
        ))}
      </ul>
    )
  }

  return null
}

const ContentPanel = ({ cards }) => {
  const filteredCards = cards.filter(hasUsableContent)

  return (
    <div className="content-panel">
      {filteredCards.map((card, index) => (
        <div key={index} className={`slide-card ${getCardColor(index)}`}>
          <div className={`slide-number ${getCardColor(index)}`}>{index + 1}</div>
          <div className="slide-content">
            <h3 className="slide-title">{card.title || "Untitled"}</h3>
            <div className="slide-body">{renderContent(card)}</div>
          </div>
          <button className="delete-slide-btn" disabled>
            <FaTrash />
          </button>
        </div>
      ))}
    </div>
  )
}

// <div className={`slide-card ${getCardColor(index)}`}>
//   <div className="slide-number">{index + 1}</div>

export default ContentPanel
