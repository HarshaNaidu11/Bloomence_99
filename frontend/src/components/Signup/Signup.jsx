// src/pages/Signup/Signup.jsx 
import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // 🟢 CRITICAL: Import useNavigate
import "./Signup.css";
import { auth, googleProvider } from "../../firebaseConfig"; // NOTE: Path assumption
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";

// Google Icon (Unchanged)
const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 533.5 544.3">
    <path
      fill="#4285F4"
      d="M533.5 278.4c0-17.6-1.6-34.5-4.6-50.9H272v96.4h147.1c-6.4 34.5-25.6 63.8-54.7 83.4v69.3h88.7c52-47.8 82.4-118.5 82.4-198.2z"
    />
    <path
      fill="#34A853"
      d="M272 544.3c73.7 0 135.7-24.3 180.9-65.8l-88.7-69.3c-24.5 16.4-56 26-92.3 26-70.9 0-131-47.9-152.4-112.6H27.1v70.8C72.4 488.2 166.9 544.3 272 544.3z"
    />
    <path
      fill="#FBBC05"
      d="M119.6 323.7c-11.2-33.5-11.2-69.6 0-103.1V150H27.1c-37.1 72-37.1 158.5 0 230.5l92.5-56.8z"
    />
    <path
      fill="#EA4335"
      d="M272 107.7c39.8 0 75.7 13.7 103.9 40.7l77.7-77.7C406.7 24.3 344.7 0 272 0 166.9 0 72.4 56.2 27.1 150l92.5 56.8C141 155.6 201.1 107.7 272 107.7z"
    />
  </svg>
);

// Eye Icon (Unchanged)
const EyeIcon = ({ visible }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    {visible ? (
      <path d="M12 5c-7 0-11 7-11 7s4 7 11 7 11-7 11-7-4-7-11-7zm0 12c-2.8 0-5-2.2-5-5s2.2-5 
      5-5 5 2.2 5 5-2.2 5-5 5z" />
    ) : (
      <path d="M12 5c-7 0-11 7-11 7s2.3 4 6.7 6.3L3 20l1.5 1.5 17-17L20 3l-4.2 4.2C14.7 
      6.5 13.4 6 12 6c-2.8 0-5 2.2-5 5 0 1.4.6 2.7 1.5 3.6l-1.6 
      1.6C4.3 13 2 12 2 12s4-7 10-7c1.4 0 2.7.5 3.8 1.2L12 
      10.9c-.3-.1-.6-.1-.9-.1-1.1 0-2 .9-2 2 0 
      .3.1.6.2.9l-1.5 1.5C7 14 7 13.5 7 13c0-2.8 
      2.2-5 5-5 .5 0 1 .1 1.5.3L16.1 7C14.8 
      5.7 13.4 5 12 5z" />
    )}
  </svg>
);

export default function SignupLogin() {
    const navigate = useNavigate(); // 🟢 CRITICAL: Initialize useNavigate
    const [showEmailForm, setShowEmailForm] = useState(false);
    const [isLogin, setIsLogin] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [form, setForm] = useState({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, form.email, form.password);
        alert("✅ Logged in successfully!");
      } else {
        if (form.password !== form.confirmPassword) {
          alert("⚠️ Passwords do not match!");
          return;
        }
        await createUserWithEmailAndPassword(auth, form.email, form.password);
        alert("🎉 Signed up successfully!");
      }
      
      // 🟢 ACTION: Navigate to home after successful email/password login
      navigate('/'); 

    } catch (error) {
      alert("❌ " + error.message);
    }
  };

  const handleSocialClick = async (provider) => {
    try {
      if (provider === "Google") {
        await signInWithPopup(auth, googleProvider);
        // 🟢 CRITICAL FIX: Removed alert and added immediate navigation
        navigate('/'); 
      } else {
        alert(`Provider ${provider} not implemented yet`);
      }
    } catch (error) {
      alert("❌ " + error.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>{isLogin ? "Log in" : "Sign up"}</h2>
        <p>
          You’ll get smarter responses and can upload files, images, and more.
        </p>

        {!showEmailForm ? (
          <>
            <button
              className="social-btn google"
              onClick={() => handleSocialClick("Google")}
            >
              <GoogleIcon /> Continue with Google
            </button>
            <button
              className="social-btn microsoft"
              onClick={() => handleSocialClick("Microsoft")}
            >
              Microsoft Account
            </button>
            <button
              className="social-btn apple"
              onClick={() => handleSocialClick("Apple")}
            >
              Apple
            </button>
            <button
              className="social-btn email"
              onClick={() => setShowEmailForm(true)}
            >
              Continue with Email
            </button>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="auth-form">
            {!isLogin && (
              <label>
                Name
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </label>
            )}
            <label>
              Email
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </label>
            <label className="password-field">
              Password
              <div className="password-wrapper">
                <input
                  type={passwordVisible ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
                <span
                  className="eye-icon"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                >
                  <EyeIcon visible={passwordVisible} />
                </span>
              </div>
            </label>
            {!isLogin && (
              <label>
                Confirm Password
                <input
                  type={passwordVisible ? "text" : "password"}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </label>
            )}
            <button type="submit" className="btn-primary">
              {isLogin ? "Log In" : "Sign Up"}
            </button>
          </form>
        )}

        <div className="toggle-text">
          {isLogin ? (
            <>
              Don’t have an account?{" "}
              <button
                onClick={() => {
                  setIsLogin(false);
                  setShowEmailForm(false); // 👈 Reset to social login first
                }}
                className="toggle-btn"
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                onClick={() => {
                  setIsLogin(true);
                  setShowEmailForm(false); // 👈 Reset to social login first
                }}
                className="toggle-btn"
              >
                Log in
              </button>
            </>
          )}
        </div>

        <div className="footer-links">
          <a href="#">Terms of Use</a> | <a href="#">Privacy Policy</a>
        </div>
      </div>
    </div>
  );
}