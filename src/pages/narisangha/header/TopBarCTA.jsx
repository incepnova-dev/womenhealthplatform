import React, { useState, useEffect } from "react";
import SignUpModal from "../../auth/SignUpModal";
import SignInModal from "../../auth/SignInModal";
import { getProperty } from "../../../languages";

const TopBarCTA = ({
  setMode,
  language = "en",
  currentUser,
  onSignInSuccess,
  onLogout,
}) => {
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);

  useEffect(() => {
    if (isSignUpModalOpen || isSignInModalOpen) {
      document.body.classList.add("signup-modal-open");
    } else {
      document.body.classList.remove("signup-modal-open");
    }
    // Cleanup on unmount
    return () => {
      document.body.classList.remove("signup-modal-open");
    };
  }, [isSignUpModalOpen, isSignInModalOpen]);

  const handleSignUpClick = () => {
    setIsSignUpModalOpen(true);
  };

  const handleSignInClick = () => {
    setIsSignInModalOpen(true);
  };

  const handleCloseSignUpModal = () => {
    setIsSignUpModalOpen(false);
  };

  const handleCloseSignInModal = () => {
    setIsSignInModalOpen(false);
  };

  const handleLogoutClick = () => {
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <>
      <div className="top-bar-cta">
        {/* <div className="pill-tag"> Agentic setup · Discord · Facebook · In-app </div> */}
        {currentUser ? (
          <button
            className="btn secondary"
            onClick={handleLogoutClick}
          >
            {getProperty("button.logout", language)}
          </button>
        ) : (
          <>
            <button
              className="btn secondary"
              onClick={handleSignInClick}
            >
              {getProperty("button.signin", language)}
            </button>
            <button
              className="btn primary"
              onClick={handleSignUpClick}
            >
              {getProperty("button.signup", language)}
            </button>
          </>
        )}
      </div>
      {!currentUser && (
        <>
          <SignInModal
            isOpen={isSignInModalOpen}
            onClose={handleCloseSignInModal}
            language={language}
            onSignInSuccess={onSignInSuccess}
          />
          <SignUpModal
            isOpen={isSignUpModalOpen}
            onClose={handleCloseSignUpModal}
            language={language}
          />
        </>
      )}
    </>
  );
};

export default TopBarCTA;

