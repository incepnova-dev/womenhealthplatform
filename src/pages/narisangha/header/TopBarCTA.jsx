import React from "react";

const TopBarCTA = ({ setMode }) => {
  return (
    <div className="top-bar-cta">
      <div className="pill-tag">
        Agentic setup · Discord · Facebook · In-app
      </div>
      <button
        className="btn secondary"
        onClick={() => setMode("join")}
      >
        Join
      </button>
      <button
        className="btn primary"
        onClick={() => setMode("create")}
      >
        Create
      </button>
    </div>
  );
};

export default TopBarCTA;

