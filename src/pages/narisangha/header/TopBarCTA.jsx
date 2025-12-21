import React, { useState, useEffect } from "react";
import SignUpModal from "../../auth/SignUpModal";
import SignInModal from "../../auth/SignInModal";

const TopBarCTA = ({ setMode }) => {
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

  return (
    <>
      <div className="top-bar-cta">
        {/* <div className="pill-tag"> Agentic setup · Discord · Facebook · In-app </div> */}
        <button
          className="btn secondary"
          onClick={handleSignInClick}
        >
          Sign In
        </button>
        <button
          className="btn primary"
          onClick={handleSignUpClick}
        >
          Sign UP
        </button>
      </div>
      <SignInModal isOpen={isSignInModalOpen} onClose={handleCloseSignInModal} />
      <SignUpModal isOpen={isSignUpModalOpen} onClose={handleCloseSignUpModal} />
    </>
  );
};

export default TopBarCTA;

