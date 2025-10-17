// src/pages/Questionnaires/GAD7.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
// TEMPORARILY COMMENTED OUT: Uncomment later for Firebase integration
// import { db } from "../../firebase/firebaseConfig"; 
// import { collection, addDoc } from "firebase/firestore"; 
// We reuse PHQ9's CSS for a consistent look
import "./PHQ9.css"; 

// --- GAD-7 Questionnaire Data ---
const gad7Questions = [
  "Feeling nervous, anxious, or on edge",
  "Not being able to stop or control worrying",
  "Worrying too much about different things",
  "Trouble relaxing",
  "Being so restless that it's hard to sit still",
  "Becoming easily annoyed or irritable",
  "Feeling afraid as if something awful might happen",
];
const options = [
  { value: 0, label: "Not at all" },
  { value: 1, label: "Several days" },
  { value: 2, label: "More than half the days" },
  { value: 3, label: "Nearly every day" },
];

export default function GAD7() {
  const navigate = useNavigate();
  const [currentQ, setCurrentQ] = useState(0); 
  const [answers, setAnswers] = useState(Array(gad7Questions.length).fill(null));
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
      if (currentQ < gad7Questions.length - 1) {
          setCurrentQ(currentQ + 1);
      } 
  };

  const handleSubmit = async (finalAnswers) => {
    setLoading(true);
    setError(null);
    
    const totalScore = finalAnswers.reduce((sum, val) => sum + (val || 0), 0);
    console.log("GAD-7 Answers:", finalAnswers);
    console.log("GAD-7 Total Score:", totalScore);

    /* --- FIREBASE INTEGRATION POINT ---
    try {
      // await addDoc(collection(db, "gad7Responses"), { ... });
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
    <div className="phq9-wrapper"> 
      <div className="phq9-container result-box success">
        <h2>Submission Complete! ✅</h2>
        <p>Thank you for completing the GAD-7 Questionnaire. Your results are ready for storage.</p>
        <p>Total Score: **{answers.reduce((sum, val) => sum + (val || 0), 0)}**</p>
        <button className="submit-btn" onClick={() => navigate("/dashboard")}>Go to Dashboard</button>
      </div>
    </div>
  );

  return (
    // 🟢 CRITICAL STRUCTURAL FIX: Outer wrapper for centering and button flow 🟢
    <div className="phq9-wrapper"> 
      <div className="phq9-container">
        <h2>GAD-7 Questionnaire</h2>
        
        <p className="intro-text">
          **Over the last 2 weeks, how often have you been bothered by any of the following problems?**
        </p>
        
        <p className="progress-tracker">
          Question {currentQ + 1} of {gad7Questions.length}
        </p>

        <div className="question-card single-question-view">
          <p className="question-text">
            {currentQ + 1}. {gad7Questions[currentQ]}
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
          onClick={() => currentQ === gad7Questions.length - 1 ? handleSubmit(answers) : handleNext()}
          disabled={loading} 
        >
          <span>
            {loading 
              ? 'Processing...' 
              : (currentQ === gad7Questions.length - 1 
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