import React from "react";

const ModeToggle = ({ viewMode, setViewMode }) => {
  return (
    <div className="mode-toggle-row">
      <div className="mode-toggle-buttons">
        <button
          className={
            "mode-toggle-button" +
            (viewMode === "setup" ? " active" : "")
          }
          onClick={() => setViewMode("setup")}
        >
          <span className="dot-small"></span>
          Setup
        </button>
        <button
          className={
            "mode-toggle-button" +
            (viewMode === "mygroups" ? " active" : "")
          }
          onClick={() => setViewMode("mygroups")}
        >
          My Groups
        </button>
        <button
          className={
            "mode-toggle-button" +
            (viewMode === "discover" ? " active" : "")
          }
          onClick={() => setViewMode("discover")}
        >
          Discover
        </button>
      </div>
      <div className="mode-toggle-caption">
        {viewMode === "setup" && "Create new communities or search for existing ones to join"}
        {viewMode === "mygroups" && "View and manage your communities across all platforms"}
        {viewMode === "discover" && "Explore external conversations and groups"}
      </div>
    </div>
  );
};

export default ModeToggle;

