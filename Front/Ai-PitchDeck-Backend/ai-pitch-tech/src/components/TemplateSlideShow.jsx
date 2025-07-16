import React, { useState } from 'react';
import './TemplateSlideShow.css';

const TemplateSlideShow = ({ template, onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Theme-specific slide content
  const getSlideContent = (templateName, slideIndex) => {
    // Use the topics array as slide titles
    if (template.topics && template.topics[slideIndex]) {
      return {
        title: template.topics[slideIndex],
        content: `Content for ${template.topics[slideIndex]} slide`
      };
    }
    
    // Fallback if topics aren't defined
    return {
      title: `${template.name} - Slide ${slideIndex + 1}`,
      content: `Content for ${template.name} presentation slide ${slideIndex + 1}`
    };
  };

  const slides = Array(template.slides).fill().map((_, i) => 
    getSlideContent(template.name, i)
  );

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  return (
    <div className="slideshow-modal">
      <div className="slideshow-content">
        <button className="close-btn" onClick={onClose}>✕</button>
        <h3>{template.name} Presentation</h3>
        
        <div className="slide-topics">
          {template.topics && template.topics.map((topic, index) => (
            <span 
              key={index} 
              className={`topic-tag ${index === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
            >
              {topic}
            </span>
          ))}
        </div>
        
        <div className="slide-container">
          <button className="nav-btn prev-btn" onClick={prevSlide}>‹</button>
          
          <div className="slide">
            <div className="slide-preview"></div>
            <div className="slide-info">
              <h4>{slides[currentSlide].title}</h4>
              <p>{slides[currentSlide].content}</p>
            </div>
          </div>
          
          <button className="nav-btn next-btn" onClick={nextSlide}>›</button>
        </div>
        
        <div className="slide-indicators">
          {slides.map((_, index) => (
            <span 
              key={index} 
              className={`indicator ${index === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
        
        <div className="theme-select-btn-container">
          <button className="theme-select-btn">{template.style}</button>
        </div>
      </div>
    </div>
  );
};

export default TemplateSlideShow;