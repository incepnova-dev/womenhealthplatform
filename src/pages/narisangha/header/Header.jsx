import React from "react";
import BrandBlock from "./BrandBlock";
import Navigation from "./Navigation";
import TopBarCTA from "./TopBarCTA";
import LanguageSwitcher from "./LanguageSwitcher";
import { getProperty } from "../../../languages";
import { signOut } from "../../../services/api";

const Header = ({ mode, setMode, language, setLanguage, setViewMode, currentUser, setCurrentUser }) => {
  const handleLogout = async () => {
    await signOut();
    setCurrentUser(null);
  };

  const userName = currentUser?.user?.name || currentUser?.name || "";

  return (
    <header className="top-bar">
      <div className="top-bar-inner">
        <BrandBlock language={language} />
        <Navigation setViewMode={setViewMode} language={language} />

        {currentUser && (
          <div className="header-welcome" style={{ marginRight: "12px", fontSize: "13px", color: "var(--text-soft)" }}>
            {getProperty("header.welcome", language)},{" "}
            <span style={{ color: "var(--text-main)", fontWeight: 500 }}>
              {userName}
            </span>
          </div>
        )}

        <TopBarCTA
          setMode={setMode}
          language={language}
          currentUser={currentUser}
          onSignInSuccess={setCurrentUser}
          onLogout={handleLogout}
        />

        <LanguageSwitcher language={language} setLanguage={setLanguage} />
      </div>
    </header>
  );
};

export default Header;

