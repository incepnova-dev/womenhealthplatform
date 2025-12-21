import React from "react";

const CommunityOverview = ({ myCreatedGroups, myExternalGroups, connections, externalFeeds }) => {
  return (
    <section className="forum-card" style={{ marginTop: "2rem" }}>
      <header>
        <div>
          <h2>Your Community Overview</h2>
          <p>Quick snapshot of your activity across platforms</p>
        </div>
      </header>
      <div style={{ padding: "1rem 0" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem" }}>
          <div style={{ 
            padding: "1rem", 
            background: "rgba(99, 102, 241, 0.1)",
            borderRadius: "8px",
            border: "1px solid rgba(99, 102, 241, 0.2)"
          }}>
            <div style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "0.25rem" }}>
              {myCreatedGroups.length}
            </div>
            <div style={{ fontSize: "0.875rem", opacity: 0.8 }}>Created Groups</div>
          </div>
          <div style={{ 
            padding: "1rem", 
            background: "rgba(236, 72, 153, 0.1)",
            borderRadius: "8px",
            border: "1px solid rgba(236, 72, 153, 0.2)"
          }}>
            <div style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "0.25rem" }}>
              {myExternalGroups.length}
            </div>
            <div style={{ fontSize: "0.875rem", opacity: 0.8 }}>Joined Groups</div>
          </div>
          <div style={{ 
            padding: "1rem", 
            background: "rgba(34, 197, 94, 0.1)",
            borderRadius: "8px",
            border: "1px solid rgba(34, 197, 94, 0.2)"
          }}>
            <div style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "0.25rem" }}>
              {Object.values(connections).filter(Boolean).length}
            </div>
            <div style={{ fontSize: "0.875rem", opacity: 0.8 }}>Connected Platforms</div>
          </div>
          <div style={{ 
            padding: "1rem", 
            background: "rgba(251, 146, 60, 0.1)",
            borderRadius: "8px",
            border: "1px solid rgba(251, 146, 60, 0.2)"
          }}>
            <div style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "0.25rem" }}>
              {externalFeeds.length}
            </div>
            <div style={{ fontSize: "0.875rem", opacity: 0.8 }}>Active Conversations</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunityOverview;

