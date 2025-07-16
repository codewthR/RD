import React, { useState, useRef } from "react";
import "./QuestionPage.css";
import {
  FaRegQuestionCircle, FaSmile, FaUsers, FaBullseye, FaPalette,
  FaDesktop, FaListOl, FaStream, FaClipboardCheck, FaFont,
  FaIcons, FaMagic, FaShareAlt, FaLightbulb, FaHandshake,
  FaHashtag, FaAlignLeft, FaFileAlt,
} from "react-icons/fa";

const questions = [
  "What is your presentation topic?",
  "What is the tone you want in your presentation?",
  "Who is your target audience?",
  "What is the purpose of your presentation?",
  "What design style do you prefer?",
  "What slide format do you want?",
  "How many slides do you want?",
  "Which content type should be prioritized?",
  "Do you want a summary slide at the end?",
  "What kind of fonts do you prefer?",
  "Should AI include icons and illustrations?",
  "Should the presentation include animations?",
  "How do you want the slides to flow?",
  "What should the AI focus more on?",
  'Do you need a "Thank You" or contact slide?',
  "Do you want slide numbers displayed?",
  "How detailed should the content be?",
  "What kind of content do you prefer?",
];

const icons = [
  <FaRegQuestionCircle />, <FaSmile />, <FaUsers />, <FaBullseye />, <FaPalette />,
  <FaDesktop />, <FaListOl />, <FaStream />, <FaClipboardCheck />, <FaFont />,
  <FaIcons />, <FaMagic />, <FaShareAlt />, <FaLightbulb />, <FaHandshake />,
  <FaHashtag />, <FaAlignLeft />, <FaFileAlt />,
];

const themes = [
  {
    name: "Blobs (Light)",
    url: "https://www.svgbackgrounds.com/wp-content/uploads/2021/05/blob-scene-haikei.svg",
    mode: "light",
  },
  {
    name: "Waves (Light)",
    url: "https://www.svgbackgrounds.com/wp-content/uploads/2021/05/wave-haikei-2.svg",
    mode: "light",
  },
  {
    name: "Mountains (Pastel)",
    url: "https://www.svgbackgrounds.com/wp-content/uploads/2021/05/mountains-haikei.svg",
    mode: "light",
  },
  {
    name: "Lines (ZigZag)",
    url: "https://www.svgbackgrounds.com/wp-content/uploads/2021/05/wave-zigzag.svg",
    mode: "light",
  },
  {
    name: "Blobs (Dark)",
    url: "https://www.svgbackgrounds.com/wp-content/uploads/2021/05/blob-haikei-dark.svg",
    mode: "dark",
  },
  {
    name: "Waves (Dark)",
    url: "https://www.svgbackgrounds.com/wp-content/uploads/2021/05/wave-dark-haikei.svg",
    mode: "dark",
  },
];

function QuestionPage() {
  const [answers, setAnswers] = useState(Array(questions.length).fill(""));
  const [submitted, setSubmitted] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(themes[0]);
  const inputRefs = useRef([]);

  const handleInputChange = (index, value) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = value;
    setAnswers(updatedAnswers);
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const allAnswered = answers.every((ans) => ans.trim() !== "");

  const handleFocus = (index) => {
    if (inputRefs.current[index]) {
      inputRefs.current[index].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  const handleThemeChange = (e) => {
    const themeObj = themes.find((t) => t.name === e.target.value);
    setSelectedTheme(themeObj);
  };

  return (
    <div
      className={`question-page theme-${selectedTheme.mode}`}
      style={{
        backgroundImage: `url(${selectedTheme.url})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="theme-selector">
        <label>Select Theme:</label>
        <select value={selectedTheme.name} onChange={handleThemeChange}>
          {themes.map((theme, idx) => (
            <option key={idx} value={theme.name}>
              {theme.name}
            </option>
          ))}
        </select>
      </div>

      <h2 className="question-title">🎯 AI Presentation Assistant</h2>

      {!submitted ? (
        <>
          <div className="question-grid">
            {questions.map((question, index) => (
              <div
                key={index}
                style={{ animationDelay: `${index * 100}ms` }}
                className={`question-card ${
                  index % 2 === 0 ? "zig-left" : "zig-right"
                } fade-in`}
              >
                <div className="question-icon">{icons[index]}</div>
                <div className="question-text">{question}</div>
                <input
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  className="popup-input"
                  placeholder="Type your answer..."
                  value={answers[index]}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onFocus={() => handleFocus(index)}
                />
              </div>
            ))}
          </div>

          <button
            className="submit-btn"
            onClick={handleSubmit}
            disabled={!allAnswered}
          >
            ✅ Submit Answers
          </button>
        </>
      ) : (
        <div className="summary-box">
          <h3>📝 Summary of Your Answers</h3>
          <ul>
            {questions.map((q, i) => (
              <li key={i}>
                <strong>{q}</strong> — {answers[i]}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default QuestionPage;
