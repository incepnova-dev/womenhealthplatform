import React from "react";

const LiveConversations = ({ stage, setStage, loadingFeeds, externalFeeds }) => {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <div>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "0.25rem" }}>Live Web Conversations</h2>
          <p style={{ opacity: 0.7 }}>
            Curated discussions from connected platforms
          </p>
        </div>
        <select 
          value={stage} 
          onChange={(e) => setStage(e.target.value)}
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "8px",
            border: "1px solid rgba(255,255,255,0.2)",
            background: "rgba(255,255,255,0.05)",
            color: "inherit"
          }}
        >
          <option value="maternal">Baby & Maternal</option>
          <option value="adolescent">Adolescent & Young</option>
          <option value="reproductive">Reproductive</option>
          <option value="menopause">Perimenopause & Elderly</option>
          <option value="cross">Cross-age & Cancer</option>
        </select>
      </div>

      {loadingFeeds ? (
        <div style={{ 
          textAlign: "center", 
          padding: "3rem", 
          opacity: 0.7,
          background: "rgba(255,255,255,0.02)",
          borderRadius: "12px"
        }}>
          Loading external conversations…
        </div>
      ) : externalFeeds.length === 0 ? (
        <div style={{ 
          padding: "3rem", 
          textAlign: "center", 
          background: "rgba(255,255,255,0.02)",
          borderRadius: "12px",
          border: "1px dashed rgba(255,255,255,0.1)"
        }}>
          <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🔍</div>
          <div style={{ marginBottom: "0.5rem" }}>No conversations found for this stage</div>
          <div style={{ fontSize: "0.875rem", opacity: 0.7 }}>
            Try connecting more accounts or selecting a different life stage
          </div>
        </div>
      ) : (
        <div style={{ display: "grid", gap: "1rem" }}>
          {externalFeeds.map((item) => (
            <div key={item.id} className="deck-card">
              <div className="deck-header">
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                    <span className="feed-tag">{item.source.toUpperCase()}</span>
                    <span style={{ fontSize: "0.875rem", opacity: 0.6 }}>
                      {item.score} upvotes · {item.ageLabel}
                    </span>
                  </div>
                  <div className="deck-title" style={{ fontSize: "1.125rem" }}>{item.title}</div>
                </div>
              </div>
              <div style={{ padding: "1rem 1.5rem" }}>
                <div className="deck-subtitle">{item.snippet}</div>
              </div>
              <div className="deck-footer">
                <div className="deck-footer-actions">
                  <a 
                    href={item.url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="btn small secondary"
                    style={{ textDecoration: "none" }}
                  >
                    Open on {item.source}
                  </a>
                  <button className="btn small primary">
                    Discuss in NariSangha
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LiveConversations;

