import React from "react";

const ExternalGroupsList = ({ myExternalGroups, setViewMode }) => {
  return (
    <div>
      <h2 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>External Communities You Joined</h2>
      <p style={{ opacity: 0.7, marginBottom: "1.5rem" }}>
        Discord, Facebook, and Reddit groups you're part of
      </p>
      
      {myExternalGroups.length === 0 ? (
        <div style={{ 
          padding: "2rem", 
          textAlign: "center", 
          background: "rgba(255,255,255,0.02)",
          borderRadius: "12px",
          border: "1px dashed rgba(255,255,255,0.1)"
        }}>
          <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🔗</div>
          <div style={{ marginBottom: "0.5rem" }}>No external groups connected</div>
          <button 
            className="btn primary" 
            style={{ marginTop: "1rem" }}
            onClick={() => setViewMode("discover")}
          >
            Connect your accounts
          </button>
        </div>
      ) : (
        <div style={{ display: "grid", gap: "1rem" }}>
          {myExternalGroups.map((group) => (
            <div key={group.id} className="deck-card">
              <div className="deck-header">
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
                    <div className="deck-title">{group.name}</div>
                    <span className={`feed-tag`} style={{ textTransform: "uppercase" }}>
                      {group.provider}
                    </span>
                  </div>
                  <div className="deck-subtitle">{group.description || "External community"}</div>
                </div>
              </div>
              <div style={{ padding: "1rem 1.5rem" }}>
                <div style={{ display: "flex", gap: "1.5rem", fontSize: "0.875rem", opacity: 0.7 }}>
                  <div>👥 {group.memberCount || "N/A"} members</div>
                  <div>📊 {group.activityLevel || "Active"}</div>
                  <div>🔔 Synced to feed</div>
                </div>
              </div>
              <div className="deck-footer">
                <div className="deck-footer-actions">
                  <button className="btn small secondary">View on {group.provider}</button>
                  <button className="btn small secondary">Sync Settings</button>
                  <button className="btn small primary">Open Feed</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExternalGroupsList;

