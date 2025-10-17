// src/pages/Questionnaires/GAD7.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { useAuth } from '../../context/AuthContext'; 
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
  const { currentUser } = useAuth();
  const [currentQ, setCurrentQ] = useState(0); 
  const [answers, setAnswers] = useState(Array(gad7Questions.length).fill(null));
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Logic: Allows selection and deselection
  const handleAnswer = (value) => {
    const updatedAnswers = [...answers];
    if (updatedAnswers[currentQ] === value) {
        updatedAnswers[currentQ] = null;
    } else {
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
    
    if (!currentUser) { 
        setError("You must be logged in to submit results.");
        setLoading(false);
        return;
    }

    try {
        const idToken = await currentUser.getIdToken(); 
        const totalScore = finalAnswers.reduce((sum, val) => sum + (val || 0), 0);
        
        // 🟢 Extract user details
        const userName = currentUser.displayName;
        const userEmail = currentUser.email;

        // API Submission to secure Node.js Backend
        const response = await fetch('http://localhost:3001/api/results/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}` 
            },
            body: JSON.stringify({
                questionnaireType: 'GAD-7', 
                totalScore: totalScore,
                userName: userName, // 🟢 Added for MongoDB
                userEmail: userEmail, // 🟢 Added for MongoDB
                firebaseUid: currentUser.uid
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to save result.');
        }

        setLoading(false);
        // 🟢 FIX: Show success screen instead of navigating immediately
        setSubmitted(true);
        
    } catch (err) {
        console.error("Submission error:", err);
        setError(err.message || "Submission failed. Please check server.");
        setLoading(false);
    }
  };
  
  // 🟢 Rendering Logic for the Success Screen
  if (submitted) {
    const totalScore = answers.reduce((sum, val) => sum + (val || 0), 0);
    return (
        <div className="phq9-wrapper"> 
            <div className="phq9-container result-box success">
                <h2>GAD-7 Complete!</h2>
                <p>Your Anxiety Score is: **{totalScore}**</p>
                <p>All assessments complete. View your personalized dashboard.</p>
                <button 
                    className="submit-btn" 
                    onClick={() => navigate("/dashboard")}
                    style={{ marginTop: '20px' }}
                >
                    View Dashboard →
                </button>
            </div>
        </div>
    );
  }

  return (
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