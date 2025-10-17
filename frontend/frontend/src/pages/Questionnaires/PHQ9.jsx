// src/pages/Questionnaires/PHQ9.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
// TEMPORARILY COMMENTED OUT: Uncomment later for Firebase integration
// import { db } from "../../firebase/firebaseConfig"; 
// import { collection, addDoc } from "firebase/firestore"; 
import "./PHQ9.css"; 

// --- Questionnaire Data ---
const phq9Questions = [
  "Little interest or pleasure in doing things",
  "Feeling down, depressed, or hopeless",
  "Trouble falling or staying asleep, or sleeping too much",
  "Feeling tired or having little energy",
  "Poor appetite or overeating",
  "Feeling bad about yourself — or that you are a failure or have let yourself or your family down",
  "Trouble concentrating on things, such as reading the newspaper or watching television",
  "Moving or speaking so slowly that other people could have noticed. Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual",
  "Thoughts that you would be better off dead, or thoughts of hurting yourself in some way",
];

const options = [
  { value: 0, label: "Not at all" },
  { value: 1, label: "Several days" },
  { value: 2, label: "More than half the days" },
  { value: 3, label: "Nearly every day" },
];

export default function PHQ9() {
  const navigate = useNavigate();
  const [currentQ, setCurrentQ] = useState(0); 
  const [answers, setAnswers] = useState(Array(phq9Questions.length).fill(null));
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Logic: Allows selection and deselection
  const handleAnswer = (value) => {
    const updatedAnswers = [...answers];
    
    if (updatedAnswers[currentQ] === value) {
        // Deselect if already selected
        updatedAnswers[currentQ] = null;
    } else {
        // Select the new value
        updatedAnswers[currentQ] = value;
    }

    setAnswers(updatedAnswers);
    setError(null);
  };

  const handleNext = () => {
      if (answers[currentQ] === null) {
          setError("Please select an option before proceeding.");
          return;
      }
      setError(null);
      if (currentQ < phq9Questions.length - 1) {
          setCurrentQ(currentQ + 1);
      } 
  };

  const handleSubmit = async (finalAnswers) => {
    setLoading(true);
    setError(null);
    
    const totalScore = finalAnswers.reduce((sum, val) => sum + (val || 0), 0);
    console.log("PHQ-9 Answers:", finalAnswers);
    console.log("PHQ-9 Total Score:", totalScore);

    /* --- FIREBASE INTEGRATION POINT ---
    try {
      // await addDoc(collection(db, "phq9Responses"), { ... });
    } catch (err) {
      setError("Submission failed (Firebase not configured/error).");
    } 
    */
    
    await new Promise(resolve => setTimeout(resolve, 1000)); 

    setLoading(false);
    setSubmitted(true);
  };
  
  // --- Rendering Logic ---

  if (submitted) return (
    // Note: Using phq9-wrapper around the result box for consistency
    <div className="phq9-wrapper"> 
      <div className="phq9-container result-box success">
        <h2>Submission Complete! ✅</h2>
        <p>Thank you for completing the PHQ-9 Questionnaire. Your results are ready for storage.</p>
        <p>Total Score: **{answers.reduce((sum, val) => sum + (val || 0), 0)}**</p>
        <button className="submit-btn" onClick={() => navigate("/dashboard")}>Go to Dashboard</button>
      </div>
    </div>
  );

  return (
    // 🟢 CRITICAL STRUCTURAL FIX: Outer wrapper for centering and button flow 🟢
    <div className="phq9-wrapper"> 
      <div className="phq9-container">
        <h2>PHQ-9 Questionnaire</h2>
        
        <p className="intro-text">
          **Over the last 2 weeks, how often have you been bothered by any of the following problems?**
        </p>
        
        <p className="progress-tracker">
          Question {currentQ + 1} of {phq9Questions.length}
        </p>

        <div className="question-card single-question-view">
          <p className="question-text">
            {currentQ + 1}. {phq9Questions[currentQ]}
          </p>
          
          <div className="options">
            {options.map((opt) => (
              <button
                key={opt.value}
                className={`option-button ${answers[currentQ] === opt.value ? 'selected' : ''}`}
                onClick={() => handleAnswer(opt.value)}
                disabled={loading}
              >
                <span className="option-indicator"></span> 
                {opt.label}
              </button>
            ))}
          </div>
        </div>
        
        {error && <p className="error-message">🚨 {error}</p>}
      </div>
      
      {/* 🟢 NAVIGATION BUTTONS: Rendered OUTSIDE the main white card, but inside the wrapper 🟢 */}
      <div className="navigation-controls-outside">
        <button
          className="nav-btn prev"
          onClick={() => setCurrentQ(currentQ - 1)}
          disabled={currentQ === 0 || loading}
        >
          <span>&larr; Previous</span>
        </button>
        <button
          className="nav-btn next"
          onClick={() => currentQ === phq9Questions.length - 1 ? handleSubmit(answers) : handleNext()}
          disabled={loading} 
        >
          <span>
            {loading 
              ? 'Processing...' 
              : (currentQ === phq9Questions.length - 1 
                  ? 'Submit' 
                  : 'Next Question'
                )
            }
          </span>
        </button>
      </div>
    </div>
  );
}