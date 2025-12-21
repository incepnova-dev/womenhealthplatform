import React from "react";
import { Link } from "react-router-dom";
import { getProperty } from "../../../languages";

const BrandBlock = ({ language = "en" }) => {
  return (
    <div className="brand-block">
      <Link to="/narisangha" className="brand-logo-link">
        <div className="brand-logo">NS</div>
      </Link>
      <div className="brand-text">
        <Link to="/narisangha" className="brand-title-link">
          <div className="brand-title">{getProperty("brand.title", language)}</div>
        </Link>
        <div className="brand-subtitle">
          {getProperty("brand.subtitle", language)}
        </div>
      </div>
    </div>
  );
};

export default BrandBlock;

