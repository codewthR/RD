import React from "react"
import { useState } from "react"
import "./SlideNavigation.css"

const SlideNavigation = ({ slides, currentSlide, onSlideChange }) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleSlideClick = (index) => {
    onSlideChange(index)
    setIsOpen(false)
  }

  return (
    <div className="slide-navigation">
      <button className="slide-nav-toggle" onClick={() => setIsOpen(!isOpen)}>
        Slides ({slides.length})
      </button>

      {isOpen && (
        <div className="slide-nav-dropdown">
          <div className="slide-nav-header">
            <h3>Presentation Slides</h3>
            <button className="slide-nav-close" onClick={() => setIsOpen(false)}>
              ×
            </button>
          </div>

          <div className="slide-nav-list">
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className={`slide-nav-item ${index === currentSlide ? "active" : ""}`}
                onClick={() => handleSlideClick(index)}
              >
                <div className="slide-nav-number">{index + 1}</div>
                <div className="slide-nav-content">
                  <h4>{slide.title}</h4>
                  <p>{slide.type}</p>
                </div>
                <div className="slide-nav-preview">
                  {slide.image && <img src={slide.image || "/placeholder.svg"} alt={slide.title} />}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default SlideNavigation
