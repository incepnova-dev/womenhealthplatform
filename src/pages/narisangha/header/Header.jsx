import React from "react";
import BrandBlock from "./BrandBlock";
import Navigation from "./Navigation";
import TopBarCTA from "./TopBarCTA";
import LanguageSwitcher from "./LanguageSwitcher";

const Header = ({ mode, setMode, language, setLanguage, setViewMode }) => {
  return (
    <header className="top-bar">
      <div className="top-bar-inner">
        <BrandBlock language={language} />
        <Navigation setViewMode={setViewMode} language={language} />
        <TopBarCTA setMode={setMode} language={language} />
        <LanguageSwitcher language={language} setLanguage={setLanguage} />
      </div>
    </header>
  );
};

export default Header;

