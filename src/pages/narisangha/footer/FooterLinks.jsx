import React from "react";

const FooterLinks = ({ setViewMode }) => {
  return (
    <div className="footer-links">
      <a href="#start">Start</a>
      <span>·</span>
      <a href="#mygroups" onClick={() => setViewMode("mygroups")}>My Groups</a>
      <span>·</span>
      <a href="#forum">Live Q&amp;A</a>
      <span>·</span>
      <a href="#safety">Safety</a>
    </div>
  );
};

export default FooterLinks;

