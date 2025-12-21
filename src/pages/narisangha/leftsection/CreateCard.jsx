import React from "react";

const CreateCard = ({ createForm, handleCreateChange, previewCreate, continueCreate }) => {
  return (
    <div className="deck-card">
      <div className="deck-header">
        <div>
          <div className="deck-title">Create a women's community</div>
          <div className="deck-subtitle">
            Configure basics; the agent builds Discord, Facebook or in-app
            spaces.
          </div>
        </div>
        <span className="deck-pill">New space</span>
      </div>

      <div className="deck-fields">
        <div className="field">
          <label>Community name</label>
          <input
            value={createForm.name}
            onChange={handleCreateChange("name")}
            placeholder="PCOS Sisters Kolkata, Safe Period Talk…"
          />
        </div>
        <div className="field">
          <label>What is this space for?</label>
          <textarea
            value={createForm.description}
            onChange={handleCreateChange("description")}
            placeholder="Who is this for? What support do you want to offer?"
          />
        </div>
        <div className="field-inline-two">
          <div className="field">
            <label>Topics</label>
            <input
              value={createForm.topics}
              onChange={handleCreateChange("topics")}
              placeholder="PCOS, postpartum, women in AI…"
            />
          </div>
          <div className="field">
            <label>Languages</label>
            <input
              value={createForm.languages}
              onChange={handleCreateChange("languages")}
              placeholder="English, Hindi, Bengali…"
            />
          </div>
        </div>
        <div className="field-inline-two">
          <div className="field">
            <label>City / region (optional)</label>
            <input
              value={createForm.location}
              onChange={handleCreateChange("location")}
              placeholder="Kolkata, Mumbai, Delhi…"
            />
          </div>
          <div className="field">
            <label>Privacy</label>
            <select
              value={createForm.privacy}
              onChange={handleCreateChange("privacy")}
            >
              <option value="public">Public (searchable)</option>
              <option value="private">Private (invite-only)</option>
            </select>
          </div>
        </div>
        <div className="field">
          <label>Platforms</label>
          <select
            value={createForm.platforms}
            onChange={handleCreateChange("platforms")}
          >
            <option value="internal">In-app only</option>
            <option value="discord">Discord server + In-app</option>
            <option value="facebook">Facebook Group + In-app</option>
            <option value="all">Discord + Facebook + In-app</option>
          </select>
        </div>
      </div>

      <div className="deck-footer">
        <div className="deck-footer-caption">
          The agent will generate rules, channels and moderator roles based
          on this.
        </div>
        <div className="deck-footer-actions">
          <button
            className="btn small secondary"
            onClick={previewCreate}
          >
            Preview structure
          </button>
          <button
            className="btn small primary"
            onClick={continueCreate}
          >
            Ask agent to continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateCard;

