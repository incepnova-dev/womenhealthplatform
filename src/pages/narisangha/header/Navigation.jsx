import React from "react";

const Navigation = ({ setViewMode }) => {
  return (
    <nav className="nav-links">
      <a href="#start">Start</a>
      <a href="#mygroups" onClick={() => setViewMode("mygroups")}>My Groups</a>
      <a href="#forum">Live Q&amp;A</a>
      <a href="#safety">Safety</a>
      <a href="#external">External</a>
    </nav>
  );
};

export default Navigation;

