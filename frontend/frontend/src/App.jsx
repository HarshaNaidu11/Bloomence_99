// src/App.jsx
import React from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Signup from "./components/Signup/Signup";
import Dashboard from "./pages/Dashboard/Dashboard";
import Questionnaires from "./pages/Questionnaires/Questionnaires";
import AIRecommendation from "./pages/AIRecommendation/AIRecommendation";
 import EmergencyContact from "./pages/EmergencyContact/EmergencyContact";
import PHQ9 from "./pages/Questionnaires/PHQ9";
import GAD7 from "./pages/Questionnaires/GAD7";
import "./App.css";

// Try-catch wrappers for optional components
let SplitText, TextType;
try {
  SplitText = require("./components/SplitText/SplitText").default;
} catch (e) {
  SplitText = ({ text }) => <h1>{text}</h1>;
}
try {
  TextType = require("./components/TextType/TextType").default;
} catch (e) {
  TextType = ({ text }) => <p>{text}</p>;
}

// HoverButton component
function HoverButton({ children, onClick }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        border: "none",
        background: hover ? "rgba(0, 200, 83, 0.1)" : "none",
        color: hover ? "#00c853" : "inherit",
        cursor: "pointer",
        padding: "8px 12px",
        borderRadius: "5px",
        transition: "color 0.3s ease, background 0.3s ease",
      }}
    >
      {children}
    </button>
  );
}

// HomePage Component
function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="homepage-body">
      {/* Header */}
      <header className="header">
        <nav className="navbar">
          <div
            className="logo"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            BLOOMENCE
          </div>
          <ul className="nav-menu">
            <li>
              <HoverButton onClick={() => navigate("/dashboard")}>
                Dashboard
              </HoverButton>
            </li>
            <li>
              <HoverButton onClick={() => navigate("/questionnaires")}>
                Questionnaires
              </HoverButton>
            </li>
            <li>
              <HoverButton onClick={() => navigate("/ai-recommendation")}>
                AI Recommendation
              </HoverButton>
            </li>
            <li>
              <HoverButton onClick={() => navigate("/emergency-contact")}>
                Emergency Contact
              </HoverButton>
            </li>
          </ul>
          <HoverButton onClick={() => navigate("/signup")}>
            Get Started
          </HoverButton>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="hero-section">
        <div className="hero-content">
          <SplitText text="MASTER YOUR MIND, TRANSFORM YOUR LIFE" />
          <TextType
            text="Discover your mental health score, track your growth, and take control of your emotional well-being."
            typingSpeed={50}
            deletingSpeed={30}
            pauseDuration={2000}
            loop={true}
          />
        </div>
      </main>
    </div>
  );
}

// App Routes
function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/questionnaires" element={<Questionnaires />} />
      <Route path="/ai-recommendation" element={<AIRecommendation />} />
      <Route path="/emergency-contact" element={<EmergencyContact />} />
      <Route path="/phq9" element={<PHQ9 />} />
      <Route path="/gad7" element={<GAD7 />} />
    </Routes>
  );
}

export default App;
