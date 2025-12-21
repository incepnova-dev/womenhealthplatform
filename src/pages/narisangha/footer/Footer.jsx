import React from "react";
import FooterCopyright from "./FooterCopyright";
import FooterLinks from "./FooterLinks";

const Footer = ({ setViewMode }) => {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <FooterCopyright />
        <FooterLinks setViewMode={setViewMode} />
      </div>
    </footer>
  );
};

export default Footer;

