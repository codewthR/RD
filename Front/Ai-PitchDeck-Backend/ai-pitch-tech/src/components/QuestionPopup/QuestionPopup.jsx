import React, { useState, useRef } from 'react';
import './QuestionPopup.css';
import { FaTimes, FaPlus, FaChevronDown, FaChevronUp, FaUpload } from 'react-icons/fa';

const QuestionPopup = ({ onClose, onSubmit }) => {
  const [questions, setQuestions] = useState([
    { 
      id: 1, 
      text: 'What is your presentation topic?', 
      options: ['Business Idea', 'Educational Topic', 'Product Pitch', 'Personal Branding'], 
      answer: null, 
      expanded: true,
      companyName: '',
      logoOption: '',
      logoDescription: '',
      uploadedLogo: null
    },
    { 
      id: 2, 
      text: 'Tell me in detail about your presentation.', 
      description: 'Please describe the topic, purpose, goal and who is your target audience etc...', 
      answer: '', 
      expanded: false,
      team: '',
      teamMembers: []
    },
    { 
      id: 3, 
      text: 'Do you want to include any visuals or data?', 
      options: ['Visual (images, charts)', 'Text-heavy (explanations)', 'Balanced content', 'Key takeaways only'], 
      answer: null, 
      expanded: false,
      visualOption: '',
      visualDescription: '',
      uploadedVisual: null
    },
    { 
      id: 4, 
      text: 'How do you want the slides to flow?', 
      options: ['Intro – Content – Summary', 'Problem – Solution – Call to Action', 'Visual Storytelling', 'Chronological Order'], 
      answer: null, 
      expanded: false 
    },
    { 
      id: 5, 
      text: 'Any special instructions or inspiration?', 
      description: 'Is there anything specific you’d like us to include or avoid? Share references, tone suggestions, or personal notes you want our AI to consider....', 
      answer: '', 
      expanded: false 
    }
  ]);

  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customQuestion, setCustomQuestion] = useState('');
  const [customAnswer, setCustomAnswer] = useState('');
  const [newTeamMember, setNewTeamMember] = useState('');
  const [files, setFiles] = useState([]);
  
  const logoFileInputRef = useRef(null);
  const visualFileInputRef = useRef(null);

  const toggleQuestion = (id) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, expanded: !q.expanded } : { ...q, expanded: false }
    ));
  };

  const handleAnswerSelect = (questionId, answer) => {
    setQuestions(questions.map(q => 
      q.id === questionId ? { ...q, answer } : q
    ));
  };

  const handleInputChange = (questionId, field, value) => {
    setQuestions(questions.map(q => 
      q.id === questionId ? { ...q, [field]: value } : q
    ));
  };

  const handleLogoOptionSelect = (questionId, option) => {
    setQuestions(questions.map(q => 
      q.id === questionId ? { ...q, logoOption: option } : q
    ));
  };

  const handleVisualOptionSelect = (questionId, option) => {
    setQuestions(questions.map(q => 
      q.id === questionId ? { ...q, visualOption: option } : q
    ));
  };

  const handleAddTeamMember = (questionId) => {
    if (newTeamMember.trim()) {
      setQuestions(questions.map(q => {
        if (q.id === questionId) {
          return { 
            ...q, 
            teamMembers: [...q.teamMembers, newTeamMember],
            team: 'with team'
          };
        }
        return q;
      }));
      setNewTeamMember('');
    }
  };

  const handleRemoveTeamMember = (questionId, index) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        const updatedMembers = [...q.teamMembers];
        updatedMembers.splice(index, 1);
        return { 
          ...q, 
          teamMembers: updatedMembers,
          team: updatedMembers.length > 0 ? 'with team' : ''
        };
      }
      return q;
    }));
  };

  const handleSaveCustomQuestion = () => {
    if (customQuestion.trim() && customAnswer.trim()) {
      const newQ = {
        id: questions.length + 1,
        text: customQuestion,
        answer: customAnswer,
        expanded: false,
        isCustom: true
      };
      setQuestions([...questions, newQ]);
      setCustomQuestion('');
      setCustomAnswer('');
      setShowCustomForm(false);
    }
  };

  const handleFileChange = (e, questionId, field) => {
    const file = e.target.files[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      const fileObj = { file, url: fileUrl, id: Date.now() };
      setFiles(prev => [...prev, fileObj]);
      
      setQuestions(questions.map(q => 
        q.id === questionId ? { ...q, [field]: fileUrl } : q
      ));
    }
  };

  const triggerFileInput = (ref) => {
    ref.current.click();
  };

  const generatePromptFromAnswers = () => {
    let prompt = "Smart Prompt Answers:\n\n";
    
    questions.forEach(q => {
      prompt += `### ${q.text}\n`;
      
      if (q.id === 1) {
        prompt += `- Topic: ${q.answer}\n`;
        if (q.answer === 'Business Idea') {
          prompt += `- Company Name: ${q.companyName}\n`;
          if (q.logoOption === 'ai') {
            prompt += `- Logo: AI-generated with description: ${q.logoDescription}\n`;
          } else if (q.logoOption === 'upload') {
            prompt += `- Logo: Uploaded (see attachment)\n`;
          }
        }
      } 
      else if (q.id === 2) {
        prompt += `- Details: ${q.answer}\n`;
        prompt += `- Team: ${q.team}\n`;
        if (q.team === 'with team') {
          prompt += `- Team Members: ${q.teamMembers.join(', ')}\n`;
        }
      }
      else if (q.id === 3) {
        prompt += `- Visuals: ${q.answer}\n`;
        if (q.answer === 'Visual (images, charts)') {
          if (q.visualOption === 'ai') {
            prompt += `- Visual Description: ${q.visualDescription}\n`;
          } else if (q.visualOption === 'upload') {
            prompt += `- Visuals: Uploaded (see attachment)\n`;
          }
        }
      }
      else if (q.id === 4) {
        prompt += `- Slide Flow: ${q.answer}\n`;
      }
      else if (q.id === 5) {
        prompt += `- Special Instructions: ${q.answer}\n`;
      }
      else if (q.isCustom) {
        prompt += `- ${q.answer}\n`;
      }
      
      prompt += "\n";
    });
    
    return prompt;
  };

  const handleSubmit = () => {
    const generatedPrompt = generatePromptFromAnswers();
    onSubmit(generatedPrompt, files.map(f => f.file));
    onClose();
  };

  return (
    <div className="question-popup-overlay">
      <div className="question-popup">
        <div className="question-popup-header">
          <div>
            <h2 className="question-popup-title">Smart Prompt Module</h2>
            <p className="question-popup-subtitle">Input your vision. All safety your slides.</p>
          </div>
          <button 
            className="question-popup-close"
            onClick={onClose}
          >
            <FaTimes />
          </button>
        </div>
        
        <div className="question-popup-body">
          <div className="question-popup-section">
            <h3 className="question-section-title">Customize Your Presentation Data</h3>
            <p className="question-section-description">
              Answer a few quick questions to help generate a stunning, tailored presentation that fits your style, purpose, and audience.
            </p>
          </div>
          
          <div className="questions-container">
            {questions.map((question) => (
              <div key={question.id} className="question-item">
                <div 
                  className="question-header"
                  onClick={() => toggleQuestion(question.id)}
                >
                  <div className="question-number">{question.id}.</div>
                  <div className="question-text">{question.text}</div>
                 <div className="question-actions">
                    <button
                    className="expand-btn"
                    onClick={(e) => {
                    e.stopPropagation();
                     toggleQuestion(question.id);
                         }}
                       >
                     {question.expanded ? <FaChevronUp /> : <><FaChevronDown /> ↓</>}
                     </button>
                      </div>
                </div>
                
                <div className={`question-content ${question.expanded ? 'expanded' : ''}`}>
                  {question.id === 1 && (
                    <div className="answer-options">
                      {question.options.map((option, index) => (
                        <label key={index} className="answer-option">
                          <input
                            type="radio"
                            name={`question-${question.id}`}
                            checked={question.answer === option}
                            onChange={() => handleAnswerSelect(question.id, option)}
                          />
                          <span className="checkmark"></span>
                          <span className="option-text">{option}</span>
                        </label>
                      ))}
                      
                      {question.answer === 'Business Idea' && (
                        <div className="conditional-section">
                          <div className="input-group">
                            <div className="input-label">Your Company Name:</div>
                            <input
                              type="text"
                              className="custom-input"
                              value={question.companyName}
                              onChange={(e) => handleInputChange(question.id, 'companyName', e.target.value)}
                              placeholder="Enter company name"
                            />
                          </div>
                          
                          <div className="input-group">
                            <div className="input-label">Your Company Logo:</div>
                            <div className="answer-options">
                              <label className="answer-option">
                                <input
                                  type="radio"
                                  name={`logo-option-${question.id}`}
                                  checked={question.logoOption === 'ai'}
                                  onChange={() => handleLogoOptionSelect(question.id, 'ai')}
                                />
                                <span className="checkmark"></span>
                                <span className="option-text">Get an AI-generated logo</span>
                              </label>
                              
                              {question.logoOption === 'ai' && (
                                <div className="conditional-section">
                                  <div className="input-label">Describe the colors, style or mood of use...</div>
                                  <textarea
                                    className="textarea-input"
                                    value={question.logoDescription}
                                    onChange={(e) => handleInputChange(question.id, 'logoDescription', e.target.value)}
                                    placeholder="Describe your logo preferences..."
                                  />
                                </div>
                              )}
                              
                              <label className="answer-option">
                                <input
                                  type="radio"
                                  name={`logo-option-${question.id}`}
                                  checked={question.logoOption === 'upload'}
                                  onChange={() => handleLogoOptionSelect(question.id, 'upload')}
                                />
                                <span className="checkmark"></span>
                                <span className="option-text">Upload my own logo</span>
                              </label>
                              
                              {question.logoOption === 'upload' && (
                                <div className="conditional-section">
                                  <div 
                                    className="upload-area"
                                    onClick={() => triggerFileInput(logoFileInputRef)}
                                  >
                                    <div className="upload-icon"><FaUpload /></div>
                                    <div className="upload-text">Click to upload logo</div>
                                    <input
                                      type="file"
                                      ref={logoFileInputRef}
                                      style={{ display: 'none' }}
                                      onChange={(e) => handleFileChange(e, question.id, 'uploadedLogo')}
                                      accept="image/*"
                                    />
                                  </div>
                                  {question.uploadedLogo && (
                                    <div className="upload-preview">
                                      <img 
                                        src={question.uploadedLogo} 
                                        alt="Uploaded logo" 
                                        style={{ maxWidth: '100px', maxHeight: '100px' }}
                                      />
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {question.id === 2 && (
                    <>
                      <div className="input-label">{question.description}</div>
                      <textarea
                        className="textarea-input"
                        value={question.answer}
                        onChange={(e) => handleInputChange(question.id, 'answer', e.target.value)}
                        placeholder="Describe your presentation in detail..."
                      />
                      
                      <div className="team-label">Did you work on this presentation alone or with a team?</div>
                      <div className="answer-options">
                        <label className="answer-option">
                          <input
                            type="radio"
                            name={`team-option-${question.id}`}
                            checked={question.team === 'alone'}
                            onChange={() => handleInputChange(question.id, 'team', 'alone')}
                          />
                          <span className="checkmark"></span>
                          <span className="option-text">I worked alone</span>
                        </label>
                        
                        <label className="answer-option">
                          <input
                            type="radio"
                            name={`team-option-${question.id}`}
                            checked={question.team === 'with team'}
                            onChange={() => handleInputChange(question.id, 'team', 'with team')}
                          />
                          <span className="checkmark"></span>
                          <span className="option-text">I worked with a team</span>
                        </label>
                        
                        {question.team === 'with team' && (
                          <div className="conditional-section">
                            <div className="input-label">Team members:</div>
                            {question.teamMembers.map((member, index) => (
                              <div key={index} className="team-input-group">
                                <input
                                  type="text"
                                  className="team-input"
                                  value={member}
                                  readOnly
                                />
                                <button 
                                  className="remove-option-btn"
                                  onClick={() => handleRemoveTeamMember(question.id, index)}
                                >
                                  <FaTimes />
                                </button>
                              </div>
                            ))}
                            
                            <div className="team-input-group">
                              <input
                                type="text"
                                className="team-input"
                                value={newTeamMember}
                                onChange={(e) => setNewTeamMember(e.target.value)}
                                placeholder="Enter team member name"
                              />
                              <button 
                                className="add-option-btn"
                                onClick={() => handleAddTeamMember(question.id)}
                              >
                                <FaPlus /> Add
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                  
                  {question.id === 3 && (
                    <div className="answer-options">
                      {question.options.map((option, index) => (
                        <label key={index} className="answer-option">
                          <input
                            type="radio"
                            name={`question-${question.id}`}
                            checked={question.answer === option}
                            onChange={() => handleAnswerSelect(question.id, option)}
                          />
                          <span className="checkmark"></span>
                          <span className="option-text">{option}</span>
                        </label>
                      ))}
                      
                      {question.answer === 'Visual (images, charts)' && (
                        <div className="conditional-section">
                          <div className="input-label">Mention if you have any images, charts, or statistics you want to add. You can upload them or describe what kind of visuals you'd like....</div>
                          
                          <div className="answer-options">
                            <label className="answer-option">
                              <input
                                type="radio"
                                name={`visual-option-${question.id}`}
                                checked={question.visualOption === 'ai'}
                                onChange={() => handleVisualOptionSelect(question.id, 'ai')}
                              />
                              <span className="checkmark"></span>
                              <span className="option-text">Get an AI-generated image / Charts</span>
                            </label>
                            
                            {question.visualOption === 'ai' && (
                              <div className="conditional-section">
                                <div className="input-label">Describe the colors, style or mood of use...</div>
                                <textarea
                                  className="textarea-input"
                                  value={question.visualDescription}
                                  onChange={(e) => handleInputChange(question.id, 'visualDescription', e.target.value)}
                                  placeholder="Describe your visual preferences..."
                                />
                              </div>
                            )}
                            
                            <label className="answer-option">
                              <input
                                type="radio"
                                name={`visual-option-${question.id}`}
                                checked={question.visualOption === 'upload'}
                                onChange={() => handleVisualOptionSelect(question.id, 'upload')}
                              />
                              <span className="checkmark"></span>
                              <span className="option-text">Upload my own image / Charts</span>
                            </label>
                            
                            {question.visualOption === 'upload' && (
                              <div className="conditional-section">
                                <div 
                                  className="upload-area"
                                  onClick={() => triggerFileInput(visualFileInputRef)}
                                >
                                  <div className="upload-icon"><FaUpload /></div>
                                  <div className="upload-text">Click to upload visual</div>
                                  <input
                                    type="file"
                                    ref={visualFileInputRef}
                                    style={{ display: 'none' }}
                                    onChange={(e) => handleFileChange(e, question.id, 'uploadedVisual')}
                                    accept="image/*"
                                  />
                                </div>
                                {question.uploadedVisual && (
                                  <div className="upload-preview">
                                    <img 
                                      src={question.uploadedVisual} 
                                      alt="Uploaded visual" 
                                      style={{ maxWidth: '100px', maxHeight: '100px' }}
                                    />
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {question.id === 4 && (
                    <div className="answer-options">
                      {question.options.map((option, index) => (
                        <label key={index} className="answer-option">
                          <input
                            type="radio"
                            name={`question-${question.id}`}
                            checked={question.answer === option}
                            onChange={() => handleAnswerSelect(question.id, option)}
                          />
                          <span className="checkmark"></span>
                          <span className="option-text">{option}</span>
                        </label>
                      ))}
                    </div>
                  )}
                  
                  {question.id === 5 && (
                    <>
                      <div className="input-label">{question.description}</div>
                      <textarea
                        className="textarea-input"
                        value={question.answer}
                        onChange={(e) => handleInputChange(question.id, 'answer', e.target.value)}
                        placeholder="Enter any special instructions or inspiration..."
                      />
                    </>
                  )}
                  
                  {question.isCustom && (
                    <div className="input-group">
                      <textarea
                        className="textarea-input"
                        value={question.answer}
                        onChange={(e) => handleInputChange(question.id, 'answer', e.target.value)}
                        placeholder="Enter your answer..."
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            <div className="add-question-section">
              {!showCustomForm ? (
                <button 
                  className="add-question-btn"
                  onClick={() => setShowCustomForm(true)}
                >
                  <FaPlus /> Add Question & Answer
                </button>
              ) : (
                <div className="custom-form-popup">
                  <div className="input-group">
                    <label className="input-label">Question</label>
                    <input
                      type="text"
                      className="custom-input"
                      value={customQuestion}
                      onChange={(e) => setCustomQuestion(e.target.value)}
                      placeholder="Enter your question"
                    />
                  </div>
                  
                  <div className="input-group">
                    <label className="input-label">Answer</label>
                    <textarea
                      className="textarea-input"
                      value={customAnswer}
                      onChange={(e) => setCustomAnswer(e.target.value)}
                      placeholder="Enter your answer"
                    />
                  </div>
                  
                  <div className="form-actions">
                    <button 
                      className="cancel-btn"
                      onClick={() => setShowCustomForm(false)}
                    >
                      Cancel
                    </button>
                    <button 
                      className="save-custom-btn"
                      onClick={handleSaveCustomQuestion}
                    >
                      Save
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="question-popup-footer">
          <button className="footer-cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button className="footer-submit-btn" onClick={handleSubmit}>
            Submit & Generate
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionPopup;