import React from "react";

const HeroCard = ({ setMode }) => {
  return (
    <div className="hero-card">
      <div className="hero-badge-row">
        <div className="hero-badge-left">
          <div className="hero-chip">
            <span className="dot"></span>
            Women-only communities
          </div>
          <div className="hero-chip">Discord, Facebook &amp; in-app spaces</div>
          <div className="hero-chip">Agentic onboarding &amp; moderation</div>
        </div>
        <div className="hero-chip">Instagram + StackOverflow + Quora streams</div>
      </div>

      <h1 className="hero-title">
        <span className="hero-gradient">Find or build your safe circle</span>
      </h1>
      <p className="hero-subtitle">
        Create your own women's community or join trusted circles already
        running on Discord, Facebook Groups or this platform – with an AI
        agent handling flows, invites, and moderation journeys end-to-end.
      </p>

      <div className="hero-actions">
        <button
          className="btn primary"
          onClick={() => setMode("create")}
        >
          Create a women's community
        </button>
        <button
          className="btn secondary"
          onClick={() => setMode("join")}
        >
          Join existing communities
        </button>
        <div className="hero-mini-hints">
          One surface; the agent talks to all connected platforms for you.
        </div>
      </div>

      <div className="hero-footnote">
        <strong>Examples:</strong> PCOS support circles, postpartum peer groups,
        women in AI/tech cohorts, cancer survivorship communities.
      </div>
    </div>
  );
};

export default HeroCard;

