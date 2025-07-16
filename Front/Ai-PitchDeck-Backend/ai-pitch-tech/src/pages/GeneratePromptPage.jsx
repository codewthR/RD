import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './GeneratePromptPage.css'; // Optional CSS if needed

const GeneratePromptPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Access data passed via navigation (optional)
  const passedData = location.state || {};
  const { prompt, settings } = passedData;

  const handleBack = () => {
    navigate(-1); // Navigate back to previous page
  };

  return (
    <div className="generate-prompt-page-container">
      <button className="back-button" onClick={handleBack}>← Back</button>

      <h1>Generate Prompt Page</h1>
      <p>This is the target page for prompt generation.</p>

      {/* Display passed prompt if available */}
      {prompt && (
        <div className="prompt-section">
          <h2>Prompt:</h2>
          <p>{prompt}</p>
        </div>
      )}

      {/* Display settings if available */}
      {settings && (
        <div className="settings-section">
          <h2>Settings:</h2>
          <pre>{JSON.stringify(settings, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default GeneratePromptPage;
