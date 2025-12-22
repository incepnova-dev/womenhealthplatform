import React, { useState } from "react";
import "../../styles/auth/SignUpModal.css";
import { getProperty } from "../../languages";
import wmhealthpic from "../../images/wmhealthpic.png";
import { signIn } from "../../services/api";

const SignInModal = ({ isOpen, onClose, language = "en", onSignInSuccess }) => {
  const [signInForm, setSignInForm] = useState({
    email: "",
    password: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignInChange = (field) => (e) => {
    setSignInForm({ ...signInForm, [field]: e.target.value });
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn({
        email: signInForm.email.trim(),
        password: signInForm.password
      });

      if (result.success) {
        // Store token if provided
        if (result.data?.token) {
          localStorage.setItem('authToken', result.data.token);
        }
        if (result.data?.refreshToken) {
          localStorage.setItem('refreshToken', result.data.refreshToken);
        }

        // Call success callback if provided
        if (onSignInSuccess) {
          onSignInSuccess(result.data);
        }

        // Reset form and close modal
        setSignInForm({ email: "", password: "" });
        onClose();
      } else {
        setError(result.error || "Sign in failed. Please try again.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Sign in error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setError("");
      setSignInForm({ email: "", password: "" });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="wp-modal-backdrop" onClick={handleClose}>
      <div className="wp-modal signup-modal-container" onClick={(e) => e.stopPropagation()}>
        <button 
          className="wp-modal-close" 
          onClick={handleClose}
          disabled={isLoading}
        >
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
              {getProperty("signin.title", language)}
            </h2>

            {error && (
              <div className="signup-modal-error" style={{
                padding: "10px",
                marginBottom: "16px",
                backgroundColor: "rgba(239, 68, 68, 0.1)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                borderRadius: "8px",
                color: "#ef4444",
                fontSize: "13px"
              }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSignInSubmit} className="signup-modal-form">
              <div className="field signup-modal-field">
                <label className="signup-modal-label">{getProperty("signin.email.label", language)}</label>
                <input
                  type="email"
                  value={signInForm.email}
                  onChange={handleSignInChange("email")}
                  placeholder={getProperty("signin.email.placeholder", language)}
                  required
                  disabled={isLoading}
                  className="signup-modal-input"
                />
              </div>

              <div className="field signup-modal-field">
                <label className="signup-modal-label">{getProperty("signin.password.label", language)}</label>
                <input
                  type="password"
                  value={signInForm.password}
                  onChange={handleSignInChange("password")}
                  placeholder={getProperty("signin.password.placeholder", language)}
                  required
                  disabled={isLoading}
                  className="signup-modal-input"
                />
              </div>

              <div className="signup-modal-button-container">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isLoading}
                  className="btn secondary small signup-modal-button-cancel"
                >
                  {getProperty("signin.button.cancel", language)}
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn primary small signup-modal-button-submit"
                >
                  {isLoading ? (
                    <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span style={{
                        width: "14px",
                        height: "14px",
                        border: "2px solid rgba(255,255,255,0.3)",
                        borderTop: "2px solid white",
                        borderRadius: "50%",
                        animation: "spin 0.6s linear infinite",
                        display: "inline-block"
                      }}></span>
                      {getProperty("signin.button.submitting", language) || "Signing in..."}
                    </span>
                  ) : (
                    getProperty("signin.button.submit", language)
                  )}
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

