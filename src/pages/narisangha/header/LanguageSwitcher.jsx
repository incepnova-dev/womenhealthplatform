import React from "react";
import { languageOptions } from "../../../languages";

const LanguageSwitcher = ({ language, setLanguage }) => {
  return (
    <div style={{ marginLeft: "auto" }}>
      <div className="wp-language-switcher">
        {/* <label htmlFor="wp-language-select">Language:</label> */}
        <select
          id="wp-language-select"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          {languageOptions.map((option) => (
            <option key={option.code} value={option.code}>
              {option.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default LanguageSwitcher;

