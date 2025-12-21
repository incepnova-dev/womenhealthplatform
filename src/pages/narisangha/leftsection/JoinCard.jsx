import React from "react";

const JoinCard = ({ joinForm, handleJoinChange, previewJoin, continueJoin }) => {
  return (
    <div className="deck-card">
      <div className="deck-header">
        <div>
          <div className="deck-title">Join existing communities</div>
          <div className="deck-subtitle">
            Tell the agent what you're looking for; it searches Discord, FB
            &amp; in-app.
          </div>
        </div>
        <span className="deck-pill">Recommendations</span>
      </div>

      <div className="deck-fields">
        <div className="field-inline-two">
          <div className="field">
            <label>Age range</label>
            <select
              value={joinForm.ageRange}
              onChange={handleJoinChange("ageRange")}
            >
              <option value="">Any</option>
              <option value="18-24">18–24</option>
              <option value="25-34">25–34</option>
              <option value="35-44">35–44</option>
              <option value="45+">45+</option>
            </select>
          </div>
          <div className="field">
            <label>Languages</label>
            <input
              value={joinForm.languages}
              onChange={handleJoinChange("languages")}
              placeholder="English, Hindi, Bengali…"
            />
          </div>
        </div>
        <div className="field">
          <label>What are you seeking?</label>
          <input
            value={joinForm.topics}
            onChange={handleJoinChange("topics")}
            placeholder="Cancer survivors women, PCOS support, postpartum…"
          />
        </div>
        <div className="field-inline-two">
          <div className="field">
            <label>Preferred platform</label>
            <select
              value={joinForm.platformPreference}
              onChange={handleJoinChange("platformPreference")}
            >
              <option value="">Any</option>
              <option value="internal">In-app</option>
              <option value="discord">Discord</option>
              <option value="facebook">Facebook Groups</option>
            </select>
          </div>
          <div className="field">
            <label>Anonymity</label>
            <select
              value={joinForm.anonymity}
              onChange={handleJoinChange("anonymity")}
            >
              <option value="ok">Ok with name visible</option>
              <option value="pseudonymous">Prefer pseudonymous</option>
            </select>
          </div>
        </div>
      </div>

      <div className="deck-footer">
        <div className="deck-footer-caption">
          The agent calls social APIs + your curated registry and returns
          matches.
        </div>
        <div className="deck-footer-actions">
          <button
            className="btn small secondary"
            onClick={previewJoin}
          >
            View sample matches
          </button>
          <button
            className="btn small primary"
            onClick={continueJoin}
          >
            Ask agent to search
          </button>
        </div>
      </div>
    </div>
  );
};

export default JoinCard;

