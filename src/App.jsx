import React, { useState } from 'react';
import axios from 'axios'; // Import axios for API calls
import './App.css'; // Custom CSS for styling

function App() {
  const [testCase, setTestCase] = useState(''); // State for test case input
  const [selectedTool, setSelectedTool] = useState('Python'); // State for selected language
  const [generatedCode, setGeneratedCode] = useState(''); // State for generated code
  const [loading, setLoading] = useState(false); // State to show loading during API call
  const [error, setError] = useState(null); // State to store any error

  // Function to generate code using the API
  const generateCode = async () => {
    setLoading(true);
    setError(null); // Reset error state

    try {
      const response = await axios({
        url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent",
        method: "post",
        params: {
          key: 'AIzaSyCuMZfEfAT-u_cq0tFL5U-Afc1Ggc10AlY' // Use environment variable for API key
        },
        data: {
          contents: [
            {
              parts: [{ text: `I'm using this for generating code for various testing purposes on different tools in python language. Generate a ${selectedTool} code snippet that performs the following task: "${testCase}". Provide only the code without any explanations. Provide the code only without any language labels or markdown formatting. ` }]
            },
          ],
        },
      });

      // Set the generated code from the API response
      const generatedText = response.data.candidates[0].content.parts[0].text;
    // Optionally, remove any unwanted characters or text
    const cleanCode = generatedText.replace(/^\s*```\s*\w+\s*\n/, '').replace(/```\s*$/, '').trim();
    
    // Set the cleaned generated code
    setGeneratedCode(cleanCode);
    } catch (err) {
      // Handle error
      setError("Error generating code. Please try again.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Function to copy the generated code to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCode).then(() => {
      alert('Code copied to clipboard!');
    }).catch(() => {
      alert('Failed to copy code to clipboard.');
    });
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Test Case Generator</h1>
      </header>

      <div className="main-content">
        {/* Left section: Input form */}
        <div className="input-section">
          <div className="input-instructions">
            <p>To use this tool, take the following steps —</p>
            <ol>
              <li>Select the tool</li>
              <li>Describe your test case</li>
              <li>Click Generate</li>
            </ol>
          </div>

          {/* Dropdown for language selection */}
          <select
            value={selectedTool}
            onChange={(e) => setSelectedTool(e.target.value)}
            className="language-dropdown"
          >
            <option value="Selenium">Selenium</option>
            <option value="Katalon">Katalon</option>
            <option value="Cypress">Cypress</option>
            <option value="Appium">Appium</option>

          </select>

          {/* Textarea for test case input */}
          <textarea
            value={testCase}
            onChange={(e) => setTestCase(e.target.value)}
            placeholder="Describe the code you want to generate..."
            className="test-case-input"
          ></textarea>

          {/* Generate button */}
          <button onClick={generateCode} disabled={loading} className="generate-btn">
            {loading ? 'Generating...' : 'Generate'}
          </button>

          {/* Display error message if any */}
          {error && <p className="error-message">{error}</p>}
        </div>

        {/* Right section: Output */}
        <div className="output-section">
          <h2>Generated Code</h2>

          <div className="code-output">
            <pre>{generatedCode || 'The generated code will be displayed here'}</pre>
          </div>

          {generatedCode && (
            <div className="code-controls">
              <button onClick={copyToClipboard} className="copy-btn">Copy</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
