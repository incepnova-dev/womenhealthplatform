import React from "react";

const ProviderConnections = ({ connections, connectingProvider, handleConnectProvider, myExternalGroups }) => {
  return (
    <div style={{ marginBottom: "2rem" }}>
      <h2 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>Connect Your Accounts</h2>
      <p style={{ opacity: 0.7, marginBottom: "1.5rem" }}>
        Link Discord, Facebook or Reddit to discover and sync your existing groups
      </p>
      
      <div style={{ display: "grid", gap: "1rem" }}>
        {["discord", "facebook", "reddit"].map((provider) => (
          <div key={provider} className="deck-card">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.5rem" }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "0.5rem" }}>
                  {provider.charAt(0).toUpperCase() + provider.slice(1)}
                </div>
                <div style={{ fontSize: "0.875rem", opacity: 0.7, marginBottom: "1rem" }}>
                  {connections[provider]
                    ? "✓ Connected - We can see your communities and suggest relevant ones"
                    : "Connect to discover and sync your groups automatically"}
                </div>
                {connections[provider] && (
                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                    <div className="hero-chip" style={{ fontSize: "0.75rem" }}>
                      {myExternalGroups.filter(g => g.provider === provider).length} groups found
                    </div>
                  </div>
                )}
              </div>
              <button
                className={connections[provider] ? "btn small secondary" : "btn primary"}
                disabled={connectingProvider === provider}
                onClick={() => handleConnectProvider(provider)}
                style={{ minWidth: "120px" }}
              >
                {connections[provider]
                  ? "✓ Connected"
                  : connectingProvider === provider
                  ? "Connecting…"
                  : `Connect ${provider}`}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProviderConnections;

