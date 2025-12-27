import React, { useEffect, useState } from "react";
import "../styles/womencommunity.css"; // this file exists

const WomenCommunityPage1 = () => {
  const [stage, setStage] = useState("maternal");
  const [connections, setConnections] = useState({
    discord: false,
    facebook: false,
    reddit: false,
  });
  const [externalFeeds, setExternalFeeds] = useState([]);
  const [myExternalGroups, setMyExternalGroups] = useState([]);
  const [loadingFeeds, setLoadingFeeds] = useState(false);
  const [connectingProvider, setConnectingProvider] = useState(null);

  useEffect(() => {
    fetchConnections();
    fetchExternalFeeds(stage);
    fetchMyExternalGroups();
  }, [stage]);

  const fetchConnections = async () => {
    try {
      const res = await fetch("/api/community/connections");
      const data = await res.json();
      setConnections(data);
    } catch (e) {
      console.error("Error fetching connections", e);
    }
  };

  const fetchExternalFeeds = async (lifeStage) => {
    setLoadingFeeds(true);
    try {
      const res = await fetch(`/api/community/external/feeds?stage=${lifeStage}`);
      const data = await res.json();
      setExternalFeeds(data.items || []);
    } catch (e) {
      console.error("Error fetching feeds", e);
    } finally {
      setLoadingFeeds(false);
    }
  };

  const fetchMyExternalGroups = async () => {
    try {
      const res = await fetch("/api/community/external/my-groups");
      const data = await res.json();
      setMyExternalGroups(data.groups || []);
    } catch (e) {
      console.error("Error fetching external groups", e);
    }
  };

  const handleConnectProvider = async (provider) => {
    setConnectingProvider(provider);
    try {
      const res = await fetch(`/api/community/connect/${provider}`, {
        method: "POST",
      });
      const data = await res.json();
      if (data.authUrl) {
        window.location.href = data.authUrl; // Redirect to OAuth [web:69]
      }
    } catch (e) {
      console.error("Error connecting provider", e);
    } finally {
      setConnectingProvider(null);
    }
  };

  const handleFollowExternalGroup = async (group) => {
    try {
      await fetch("/api/community/sync-group", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: group.provider,
          externalId: group.id,
        }),
      });
      // Optionally refresh feeds
      fetchExternalFeeds(stage);
    } catch (e) {
      console.error("Error syncing group", e);
    }
  };

  return (
    <div className="wc-page">
      {/* Top header */}
      <header className="wc-header">
        <div>
          <h1>Find or build your safe circle</h1>
          <p>
            Create your own community or join trusted circles on this platform, Discord, Facebook Groups and Reddit – with an AI agent quietly managing invites, safety and moderation.
          </p>
        </div>
        <div className="wc-stage-selector">
          <label>Life stage focus:</label>
          <select
            value={stage}
            onChange={(e) => setStage(e.target.value)}
          >
            <option value="maternal">Baby & Maternal</option>
            <option value="adolescent">Adolescent & Young</option>
            <option value="reproductive">Reproductive</option>
            <option value="menopause">Perimenopause & Elderly</option>
            <option value="cross">Cross-age & Cancer Survivorship</option>
          </select>
        </div>
      </header>

      <main className="wc-layout">
        {/* Left column: internal communities */}
        <section className="wc-column wc-column--internal">
          <h2>Your Narishakti circles</h2>
          <p>
            Join or create women-only communities hosted directly on this platform. Posts are vetted by gynecologists and ASHA moderators.
          </p>

          <button className="wc-btn wc-btn-primary">
            + Create a new circle
          </button>

          <div className="wc-internal-list">
            {/* Map your existing internal communities here */}
            {/* ... */}
          </div>
        </section>

        {/* Center column: external feeds */}
        <section className="wc-column wc-column--feeds">
          <div className="wc-feeds-header">
            <h2>Live conversations from the web</h2>
            <p>
              Curated discussions from Reddit, StackExchange and public Facebook / Discord channels related to women’s health.
            </p>
          </div>

          {loadingFeeds ? (
            <div className="wc-loader">Loading conversations…</div>
          ) : (
            <div className="wc-feed-grid">
              {externalFeeds.map((item) => (
                <article key={item.id} className="wc-feed-card">
                  <div className="wc-feed-badge wc-feed-badge--source">
                    {item.source.toUpperCase()}
                  </div>
                  <h3 className="wc-feed-title">{item.title}</h3>
                  <p className="wc-feed-snippet">{item.snippet}</p>
                  <div className="wc-feed-meta">
                    <span>{item.score} upvotes</span>
                    <span>{item.ageLabel}</span>
                  </div>
                  <div className="wc-feed-actions">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="wc-link"
                    >
                      Open on {item.source}
                    </a>
                    <button
                      className="wc-btn wc-btn-outline"
                      onClick={() => {
                        // Pre-fill a local discussion thread
                        // e.g., open a modal to discuss on Narishakti
                      }}
                    >
                      Discuss in Narishakti
                    </button>
                  </div>
                </article>
              ))}

              {externalFeeds.length === 0 && !loadingFeeds && (
                <p className="wc-empty-state">
                  No external conversations found yet for this life stage. Try a different filter or connect more accounts.
                </p>
              )}
            </div>
          )}
        </section>

        {/* Right column: connections + external groups */}
        <aside className="wc-column wc-column--connections">
          <h2>Connected accounts</h2>
          <p>
            Link your Discord, Facebook or Reddit so agents can surface your own groups and let you cross-post safely.
          </p>

          <div className="wc-connections-list">
            {["discord", "facebook", "reddit"].map((provider) => (
              <div key={provider} className="wc-connection-item">
                <div className={`wc-connection-icon wc-connection-icon--${provider}`} />
                <div className="wc-connection-body">
                  <h3>{provider.charAt(0).toUpperCase() + provider.slice(1)}</h3>
                  <p>
                    {connections[provider]
                      ? "Connected. We can see your communities and suggest relevant ones."
                      : "Not connected. Connect to discover and sync your groups."}
                  </p>
                </div>
                <div className="wc-connection-action">
                  <button
                    className="wc-btn wc-btn-small"
                    disabled={connections[provider] || connectingProvider === provider}
                    onClick={() => handleConnectProvider(provider)}
                  >
                    {connections[provider]
                      ? "Connected"
                      : connectingProvider === provider
                      ? "Connecting…"
                      : `Connect ${provider}`}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <h2 className="wc-groups-heading">Your external groups</h2>
          <p className="wc-groups-sub">
            Select which groups you want Narishakti to follow and show in your feed.
          </p>

          <div className="wc-external-groups">
            {myExternalGroups.map((group) => (
              <div key={group.id} className="wc-group-row">
                <div className="wc-group-meta">
                  <span className={`wc-group-badge wc-group-badge--${group.provider}`}>
                    {group.provider}
                  </span>
                  <span className="wc-group-name">{group.name}</span>
                </div>
                <button
                  className="wc-btn wc-btn-outline wc-btn-small"
                  onClick={() => handleFollowExternalGroup(group)}
                >
                  Follow in feed
                </button>
              </div>
            ))}

            {myExternalGroups.length === 0 && (
              <p className="wc-empty-state">
                Connect an account to load your Discord servers or Facebook/Reddit groups.
              </p>
            )}
          </div>
        </aside>
      </main>
    </div>
  );
};

export default WomenCommunityPage1;