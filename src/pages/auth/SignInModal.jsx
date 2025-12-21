import React, { useState } from "react";
import "../../styles/auth/SignUpModal.css";
import { getProperty } from "../../language/english";
import wmhealthpic from "../../images/wmhealthpic.png";

const SignInModal = ({ isOpen, onClose }) => {
  const [signInForm, setSignInForm] = useState({
    email: "",
    password: ""
  });

  const handleSignInChange = (field) => (e) => {
    setSignInForm({ ...signInForm, [field]: e.target.value });
  };

  const handleSignInSubmit = (e) => {
    e.preventDefault();
    // Handle sign in logic here
    console.log("Sign in form submitted:", signInForm);
    onClose();
    // Reset form
    setSignInForm({ email: "", password: "" });
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
              {getProperty("signin.title")}
            </h2>

            <form onSubmit={handleSignInSubmit} className="signup-modal-form">
              <div className="field signup-modal-field">
                <label className="signup-modal-label">{getProperty("signin.email.label")}</label>
                <input
                  type="email"
                  value={signInForm.email}
                  onChange={handleSignInChange("email")}
                  placeholder={getProperty("signin.email.placeholder")}
                  required
                  className="signup-modal-input"
                />
              </div>

              <div className="field signup-modal-field">
                <label className="signup-modal-label">{getProperty("signin.password.label")}</label>
                <input
                  type="password"
                  value={signInForm.password}
                  onChange={handleSignInChange("password")}
                  placeholder={getProperty("signin.password.placeholder")}
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
                  {getProperty("signin.button.cancel")}
                </button>
                <button
                  type="submit"
                  className="btn primary small signup-modal-button-submit"
                >
                  {getProperty("signin.button.submit")}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInModal;

