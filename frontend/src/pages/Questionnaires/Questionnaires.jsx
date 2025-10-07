import React from "react";
import { useNavigate } from "react-router-dom";
import "./Questionnaires.css";

export default function Questionnaires() {
  const navigate = useNavigate();

  return (
    <div className="questionnaires-container">
      <h1>Select a Questionnaire</h1>
      <div className="cards">
        <div className="card" onClick={() => navigate("/phq9")}>
          <h2>PHQ-9</h2>
          <p>Depression Screening Questionnaire</p>
        </div>
        <div className="card" onClick={() => navigate("/gad7")}>
          <h2>GAD-7</h2>
          <p>Anxiety Screening Questionnaire</p>
        </div>
      </div>
    </div>
  );
}
