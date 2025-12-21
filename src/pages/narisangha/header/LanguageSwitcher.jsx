import React from "react";

const LanguageSwitcher = ({ language, setLanguage }) => {
  return (
    <div style={{ marginLeft: "auto" }}>
      <div className="wp-language-switcher">
        <label htmlFor="wp-language-select">Language:</label>
        <select
          id="wp-language-select"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="en">English</option>
          <option value="hi">हिन्दी</option>
          <option value="kn">ಕನ್ನಡ</option>
          <option value="bn">বাংলা</option>
        </select>
      </div>
    </div>
  );
};

export default LanguageSwitcher;

