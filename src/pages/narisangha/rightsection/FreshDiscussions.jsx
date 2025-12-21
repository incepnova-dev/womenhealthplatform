import React from "react";

const FreshDiscussions = ({ stage, setStage, loadingFeeds, externalFeeds, fetchExternalFeeds, setViewMode }) => {
  return (
    <section className="forum-card" style={{ marginTop: "2rem" }}>
      <header>
        <div>
          <h2>Fresh Community Discussions</h2>
          <p>Latest posts from Reddit, Quora, Instagram, Facebook & Discord</p>
        </div>
      </header>
      
      <div className="feed-filters" style={{ marginBottom: "1rem" }}>
        <select 
          value={stage} 
          onChange={(e) => setStage(e.target.value)}
          style={{ flex: 1 }}
        >
          <option value="maternal">Baby & Maternal</option>
          <option value="adolescent">Adolescent & Young</option>
          <option value="reproductive">Reproductive</option>
          <option value="menopause">Perimenopause & Elderly</option>
          <option value="cross">Cross-age & Cancer</option>
        </select>
        <button 
          className="btn small secondary"
          onClick={() => fetchExternalFeeds(stage)}
        >
          Refresh
        </button>
      </div>

      {loadingFeeds ? (
        <div style={{ textAlign: "center", padding: "2rem", opacity: 0.7 }}>
          Loading fresh discussions…
        </div>
      ) : externalFeeds.length === 0 ? (
        <div style={{ 
          padding: "2rem", 
          textAlign: "center", 
          background: "rgba(255,255,255,0.02)",
          borderRadius: "8px",
          border: "1px dashed rgba(255,255,255,0.1)"
        }}>
          <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>💬</div>
          <div style={{ fontSize: "0.875rem", opacity: 0.7 }}>
            No discussions found. Try connecting more platforms in Discover tab.
          </div>
        </div>
      ) : (
        <div className="feed-items">
          {externalFeeds.slice(0, 5).map((item) => (
            <article key={item.id} className="feed-item">
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                <span className="feed-tag">{item.source}</span>
                <span style={{ fontSize: "0.75rem", opacity: 0.6 }}>
                  {item.ageLabel}
                </span>
              </div>
              <div className="feed-item-title">{item.title}</div>
              <div className="feed-item-snippet">{item.snippet}</div>
              <div className="feed-item-meta">
                <span>{item.score || 0} upvotes</span>
                <a href={item.url} target="_blank" rel="noreferrer" className="feed-link">
                  Open discussion
                </a>
              </div>
            </article>
          ))}
          
          {externalFeeds.length > 5 && (
            <button 
              className="btn small secondary" 
              style={{ width: "100%", marginTop: "0.5rem" }}
              onClick={() => setViewMode("discover")}
            >
              View all {externalFeeds.length} discussions
            </button>
          )}
        </div>
      )}
    </section>
  );
};

export default FreshDiscussions;

