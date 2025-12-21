import React, { useState } from "react";
import "../../styles/auth/SignUpModal.css";
import { getProperty } from "../../language/english";

const SignUpModal = ({ isOpen, onClose }) => {
  const [signUpForm, setSignUpForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

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
    setImagePreview(null);
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
              {imagePreview ? (
                <img src={imagePreview} alt="Profile preview" className="signup-modal-image-preview" />
              ) : (
                <div className="signup-modal-image-placeholder">
                  <label htmlFor="signup-image-upload" className="signup-modal-image-upload-label">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="17 8 12 3 7 8"></polyline>
                      <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                    <span>Add Image</span>
                  </label>
                </div>
              )}
              <input
                type="file"
                id="signup-image-upload"
                accept="image/*"
                onChange={handleImageChange}
                className="signup-modal-image-input"
              />
              {imagePreview && (
                <button
                  type="button"
                  onClick={() => setImagePreview(null)}
                  className="signup-modal-image-remove"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Form Section - Right Half */}
          <div className="signup-modal-form-section">
            <h2 className="wp-modal-title signup-modal-title">
              {getProperty("signup.title")}
            </h2>

            <form onSubmit={handleSignUpSubmit} className="signup-modal-form">
          <div className="field signup-modal-field">
            <label className="signup-modal-label">{getProperty("signup.fullName.label")}</label>
            <input
              type="text"
              value={signUpForm.name}
              onChange={handleSignUpChange("name")}
              placeholder={getProperty("signup.fullName.placeholder")}
              required
              className="signup-modal-input"
            />
          </div>

          <div className="field signup-modal-field">
            <label className="signup-modal-label">{getProperty("signup.email.label")}</label>
            <input
              type="email"
              value={signUpForm.email}
              onChange={handleSignUpChange("email")}
              placeholder={getProperty("signup.email.placeholder")}
              required
              className="signup-modal-input"
            />
          </div>

          <div className="field signup-modal-field">
            <label className="signup-modal-label">{getProperty("signup.password.label")}</label>
            <input
              type="password"
              value={signUpForm.password}
              onChange={handleSignUpChange("password")}
              placeholder={getProperty("signup.password.placeholder")}
              required
              className="signup-modal-input"
            />
          </div>

          <div className="field signup-modal-field">
            <label className="signup-modal-label">{getProperty("signup.confirmPassword.label")}</label>
            <input
              type="password"
              value={signUpForm.confirmPassword}
              onChange={handleSignUpChange("confirmPassword")}
              placeholder={getProperty("signup.confirmPassword.placeholder")}
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
              {getProperty("signup.button.cancel")}
            </button>
            <button
              type="submit"
              className="btn primary small signup-modal-button-submit"
            >
              {getProperty("signup.button.submit")}
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

