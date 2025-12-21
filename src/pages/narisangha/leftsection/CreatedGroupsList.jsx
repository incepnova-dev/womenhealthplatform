import React from "react";

const CreatedGroupsList = ({ myCreatedGroups, setViewMode, setMode }) => {
  return (
    <div style={{ marginBottom: "2rem" }}>
      <h2 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>Communities You Created</h2>
      <p style={{ opacity: 0.7, marginBottom: "1.5rem" }}>
        Communities you've built across platforms
      </p>
      
      {myCreatedGroups.length === 0 ? (
        <div style={{ 
          padding: "2rem", 
          textAlign: "center", 
          background: "rgba(255,255,255,0.02)",
          borderRadius: "12px",
          border: "1px dashed rgba(255,255,255,0.1)"
        }}>
          <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🌱</div>
          <div style={{ marginBottom: "0.5rem" }}>No communities created yet</div>
          <button 
            className="btn primary" 
            style={{ marginTop: "1rem" }}
            onClick={() => { setViewMode("setup"); setMode("create"); }}
          >
            Create your first community
          </button>
        </div>
      ) : (
        <div style={{ display: "grid", gap: "1rem" }}>
          {myCreatedGroups.map((group) => (
            <div key={group.id} className="deck-card">
              <div className="deck-header">
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
                    <div className="deck-title">{group.name}</div>
                    <span className="deck-pill">{group.privacy}</span>
                  </div>
                  <div className="deck-subtitle">{group.description}</div>
                </div>
              </div>
              <div style={{ padding: "1rem 1.5rem" }}>
                <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "1rem" }}>
                  {group.platforms?.split(",").map((platform) => (
                    <div key={platform} className="hero-chip" style={{ fontSize: "0.875rem" }}>
                      {platform.trim()}
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", gap: "1.5rem", fontSize: "0.875rem", opacity: 0.7 }}>
                  <div>📍 {group.location || "Global"}</div>
                  <div>👥 {group.memberCount || 0} members</div>
                  <div>💬 {group.topics}</div>
                </div>
              </div>
              <div className="deck-footer">
                <div className="deck-footer-actions">
                  <button className="btn small secondary">View Dashboard</button>
                  <button className="btn small secondary">Manage Settings</button>
                  <button className="btn small primary">Open Community</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CreatedGroupsList;

