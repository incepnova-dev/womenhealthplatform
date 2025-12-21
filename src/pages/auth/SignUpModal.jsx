import React, { useState } from "react";
import "../../styles/auth/SignUpModal.css";
import { getProperty } from "../../languages";
import wmhealthpic from "../../images/wmhealthpic.png";

const SignUpModal = ({ isOpen, onClose, language = "en" }) => {
  const [signUpForm, setSignUpForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleSignUpChange = (field) => (e) => {
    setSignUpForm({ ...signUpForm, [field]: e.target.value });
  };

  const handleSignUpSubmit = (e) => {
    e.preventDefault();
    // Handle sign up logic here
    console.log("Sign up form submitted:", signUpForm);
    onClose();
    // Reset form
    setSignUpForm({ name: "", email: "", password: "", confirmPassword: "" });
  };

  if (!isOpen) return null;

  return (
    <div className="wp-modal-backdrop" onClick={onClose}>
      <div className="wp-modal signup-modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="wp-modal-close" onClick={onClose}>
          ✕
        </button>

        <div className="signup-modal-content">
          {/* Image Section - Left Half */}
          <div className="signup-modal-image-section">
            <div className="signup-modal-image-container">
              <img 
                src={wmhealthpic} 
                alt="Women's Health" 
                className="signup-modal-image-preview" 
              />
            </div>
          </div>

          {/* Form Section - Right Half */}
          <div className="signup-modal-form-section">
            <h2 className="wp-modal-title signup-modal-title">
              {getProperty("signup.title", language)}
            </h2>

            <form onSubmit={handleSignUpSubmit} className="signup-modal-form">
          <div className="field signup-modal-field">
            <label className="signup-modal-label">{getProperty("signup.fullName.label", language)}</label>
            <input
              type="text"
              value={signUpForm.name}
              onChange={handleSignUpChange("name")}
              placeholder={getProperty("signup.fullName.placeholder", language)}
              required
              className="signup-modal-input"
            />
          </div>

          <div className="field signup-modal-field">
            <label className="signup-modal-label">{getProperty("signup.email.label", language)}</label>
            <input
              type="email"
              value={signUpForm.email}
              onChange={handleSignUpChange("email")}
              placeholder={getProperty("signup.email.placeholder", language)}
              required
              className="signup-modal-input"
            />
          </div>

          <div className="field signup-modal-field">
            <label className="signup-modal-label">{getProperty("signup.password.label", language)}</label>
            <input
              type="password"
              value={signUpForm.password}
              onChange={handleSignUpChange("password")}
              placeholder={getProperty("signup.password.placeholder", language)}
              required
              className="signup-modal-input"
            />
          </div>

          <div className="field signup-modal-field">
            <label className="signup-modal-label">{getProperty("signup.confirmPassword.label", language)}</label>
            <input
              type="password"
              value={signUpForm.confirmPassword}
              onChange={handleSignUpChange("confirmPassword")}
              placeholder={getProperty("signup.confirmPassword.placeholder", language)}
              required
              className="signup-modal-input"
            />
          </div>

          <div className="signup-modal-button-container">
            <button
              type="button"
              onClick={onClose}
              className="btn secondary small signup-modal-button-cancel"
            >
              {getProperty("signup.button.cancel", language)}
            </button>
            <button
              type="submit"
              className="btn primary small signup-modal-button-submit"
            >
              {getProperty("signup.button.submit", language)}
            </button>
          </div>
        </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpModal;

