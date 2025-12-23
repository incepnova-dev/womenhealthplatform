import React, { useState, useEffect } from "react";
import patientData from "../data/womenpatients.json";
import "../styles/womencommunity.css";

export default function WomenCommunityPage() {
  const [mode, setMode] = useState("create");
  const [language, setLanguage] = useState("en");
  
  // External connections and feeds state
  const [connections, setConnections] = useState({
    discord: false,
    facebook: false,
    reddit: false,
  });
  const [externalFeeds, setExternalFeeds] = useState([]);
  const [myExternalGroups, setMyExternalGroups] = useState([]);
  const [loadingFeeds, setLoadingFeeds] = useState(false);
  const [connectingProvider, setConnectingProvider] = useState(null);
  const [stage, setStage] = useState("maternal");
  const [myCreatedGroups, setMyCreatedGroups] = useState([]);
  const [viewMode, setViewMode] = useState("setup"); // setup, mygroups, discover

  const [createForm, setCreateForm] = useState({
    name: "",
    description: "",
    topics: "",
    languages: "",
    location: "",
    privacy: "public",
    platforms: "internal"
  });
  
  const [joinForm, setJoinForm] = useState({
    topics: "",
    ageRange: "",
    languages: "",
    platformPreference: "",
    anonymity: "ok"
  });

  // Fetch external data on mount and stage change
  useEffect(() => {
    fetchConnections();
    fetchExternalFeeds(stage);
    fetchMyExternalGroups();
    fetchMyCreatedGroups();
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

  const fetchMyCreatedGroups = async () => {
    try {
      const res = await fetch("/api/community/my-created-groups");
      const data = await res.json();
      setMyCreatedGroups(data.groups || []);
    } catch (e) {
      console.error("Error fetching created groups", e);
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
        window.location.href = data.authUrl;
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
      fetchExternalFeeds(stage);
    } catch (e) {
      console.error("Error syncing group", e);
    }
  };

  const handleCreateChange = (field) => (e) => {
    setCreateForm({ ...createForm, [field]: e.target.value });
  };

  const handleJoinChange = (field) => (e) => {
    setJoinForm({ ...joinForm, [field]: e.target.value });
  };

  const callAgent = async (path, body) => {
    try {
      const res = await fetch(path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error("[agent] error:", err);
      alert("Agent service unavailable. Wire this to your backend.");
      throw err;
    }
  };

  const previewCreate = async () => {
    const payload = createForm;
    console.log("[agent] preview create:", payload);
    await callAgent("/agent/previewCommunity", { mode: "create", ...payload });
  };

  const continueCreate = async () => {
    const payload = createForm;
    console.log("[agent] create community:", payload);
    const result = await callAgent("/agent/createCommunity", { mode: "create", ...payload });
    // Refresh created groups after successful creation
    if (result) {
      fetchMyCreatedGroups();
      setViewMode("mygroups");
    }
  };

  const previewJoin = async () => {
    const payload = joinForm;
    console.log("[agent] preview join:", payload);
    await callAgent("/agent/previewCommunities", { mode: "join", ...payload });
  };

  const continueJoin = async () => {
    const payload = joinForm;
    console.log("[agent] search communities:", payload);
    const data = await callAgent("/agent/searchCommunities", {
      mode: "join",
      ...payload
    });
    console.log("[agent] searchCommunities response:", data);
  };

  const currentModeText =
    mode === "create"
      ? "You're in create mode; the agent will focus on setting up a new space."
      : "You're in join mode; the agent will search and curate existing communities.";

  return (
    <div className="page-shell">
      <header className="top-bar">
        <div className="top-bar-inner">
          <div className="brand-block">
            <div className="brand-logo">N</div>
            <div className="brand-text">
              <div className="brand-title">NariSangha</div>
              <div className="brand-subtitle">
                Women's communities &amp; care journeys
              </div>
            </div>
          </div>
          <nav className="nav-links">
            <a href="#start">Start</a>
            <a href="#mygroups" onClick={() => setViewMode("mygroups")}>My Groups</a>
            <a href="#forum">Live Q&amp;A</a>
            <a href="#safety">Safety</a>
            <a href="#external">External</a>
          </nav>
          <div className="top-bar-cta">
            <div className="pill-tag">
              Agentic setup · Discord · Facebook · In-app
            </div>
            <button
              className="btn secondary"
              onClick={() => setMode("join")}
            >
              Join
            </button>
            <button
              className="btn primary"
              onClick={() => setMode("create")}
            >
              Create
            </button>
          </div>

          <div style={{ marginLeft: "auto" }}>
            <div className="wp-language-switcher">
              <label htmlFor="wp-language-select">Language:</label>
              <select
                id="wp-language-select"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="en">English</option>
                <option value="hi">हिन्दी</option>
                <option value="kn">ಕನ್ನಡ</option>
                <option value="bn">বাংলা</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      <main className="main">
        <div className="content-wrap" id="start">
          {/* LEFT */}
          <section>
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

              <div className="mode-toggle-row">
                <div className="mode-toggle-buttons">
                  <button
                    className={
                      "mode-toggle-button" +
                      (viewMode === "setup" ? " active" : "")
                    }
                    onClick={() => setViewMode("setup")}
                  >
                    <span className="dot-small"></span>
                    Setup
                  </button>
                  <button
                    className={
                      "mode-toggle-button" +
                      (viewMode === "mygroups" ? " active" : "")
                    }
                    onClick={() => setViewMode("mygroups")}
                  >
                    My Groups
                  </button>
                  <button
                    className={
                      "mode-toggle-button" +
                      (viewMode === "discover" ? " active" : "")
                    }
                    onClick={() => setViewMode("discover")}
                  >
                    Discover
                  </button>
                </div>
                <div className="mode-toggle-caption">
                  {viewMode === "setup" && "Create new communities or search for existing ones to join"}
                  {viewMode === "mygroups" && "View and manage your communities across all platforms"}
                  {viewMode === "discover" && "Explore external conversations and groups"}
                </div>
              </div>

              {viewMode === "setup" && (
              <div className="deck-shell">
                {/* Create card */}
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

                {/* Join card */}
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
              </div>
              )}

              {viewMode === "mygroups" && (
                <div style={{ marginTop: "2rem" }}>
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
                </div>
              )}

              {viewMode === "discover" && (
                <div style={{ marginTop: "2rem" }}>
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
                </div>
              )}
            </div>
          </section>

          {/* RIGHT */}
          <aside className="right-column">
            <section className="forum-card" id="forum">
              <header>
                <div>
                  <h2>Live questions &amp; answers</h2>
                  <p>
                    Agent-curated threads from StackOverflow, Quora and other forums
                    for women in health, tech and care.
                  </p>
                </div>
              </header>
              <div className="feed-filters">
                <select id="feed-topic">
                  <option value="instagram-healthtech">Instagram-Healthtech</option>
                  <option value="healthtech">Healthtech &amp; AI</option>
                  <option value="pcos">PCOS &amp; women's health</option>
                  <option value="cancer-care">Cancer survivorship</option>
                </select>
                <button
                  className="btn small secondary"
                  onClick={() =>
                    alert(
                      "Wire this to backend: /agent/forumFeed?topic=" +
                        document.getElementById("feed-topic").value
                    )
                  }
                >
                  Refresh
                </button>
              </div>

              <div className="feed-items">
                <article className="feed-item">
                  <div className="feed-item-title">
                    Handling on-call rotations as a woman in healthtech
                  </div>
                  <div className="feed-item-snippet">
                    Discussion on balancing clinical duties, startup sprints and mental
                    health, with tips on boundaries and escalation.
                  </div>
                  <div className="feed-item-meta">
                    <span className="feed-tag">Quora · Women Health Topics</span>
                    <a href="#" className="feed-link">
                      Open thread
                    </a>
                  </div>
                </article>

                <article className="feed-item">
                  <div className="feed-item-title">
                    Designing secure, privacy-preserving women's health platforms
                  </div>
                  <div className="feed-item-snippet">
                    Practical answers on data models, encryption and consent flows for
                    menstrual, pregnancy and cancer-care data.
                  </div>
                  <div className="feed-item-meta">
                    <span className="feed-tag">StackOverflow · Healthtech</span>
                    <a href="#" className="feed-link">
                      Open thread
                    </a>
                  </div>
                </article>
              </div>
            </section>

            <section className="safety-card" id="safety">
              <h2>Safety, privacy &amp; escalation</h2>
              <div className="safety-tagline">
                Every community – whether on Discord, Facebook or in-app – is built
                around confidentiality, consent and clear escalation for distress.
              </div>
              <ul className="safety-list">
                <li>
                  <div className="safety-dot"></div>
                  <div>
                    Pseudonymous profiles are allowed; only moderators and
                    gynaecologists see your verified details where needed.
                  </div>
                </li>
                <li>
                  <div className="safety-dot"></div>
                  <div>
                    Standardised rules are posted and pinned on all connected
                    platforms, and agents watch for patterns of abuse or distress.
                  </div>
                </li>
                <li>
                  <div className="safety-dot"></div>
                  <div>
                    Clear links for crisis support, local helplines and hospital
                    contacts for situations where online support is not enough.
                  </div>
                </li>
              </ul>
            </section>

            {/* Quick Stats Card */}
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

            {/* Platform Status */}
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

            {/* NEW: External connections section - Removed as functionality moved to Discover tab */}
          </aside>
        </div>
      </main>

      <footer className="site-footer">
        <div className="footer-inner">
          <div>
            &copy; 2025 NariSangha · Women's communities &amp; care journeys
          </div>
          <div className="footer-links">
            <a href="#start">Start</a>
            <span>·</span>
            <a href="#mygroups" onClick={() => setViewMode("mygroups")}>My Groups</a>
            <span>·</span>
            <a href="#forum">Live Q&amp;A</a>
            <span>·</span>
            <a href="#safety">Safety</a>
          </div>
        </div>
      </footer>
    </div>
  );
}