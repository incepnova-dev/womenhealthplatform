import React, { useState } from "react";

import patientData from "../data/womenpatients.json";
import "../styles/womencommunity.css"; // this file exists


export default function WomenCommunityPage() {
  const [mode, setMode] = useState("create");
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

  const handleCreateChange = (field) => (e) => {
    setCreateForm({ ...createForm, [field]: e.target.value });
  };

  const handleJoinChange = (field) => (e) => {
    setJoinForm({ ...joinForm, [field]: e.target.value });
  };

  const [language, setLanguage] = useState("en"); // en, hi, kn, bn

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
    await callAgent("/agent/createCommunity", { mode: "create", ...payload });
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
      ? "You’re in create mode; the agent will focus on setting up a new space."
      : "You’re in join mode; the agent will search and curate existing communities.";

  return (
    <>
      {/* inject styles once */}


      <div className="page-shell">
        <header className="top-bar">
          <div className="top-bar-inner">
            <div className="brand-block">
              <div className="brand-logo">N</div>
              <div className="brand-text">
                <div className="brand-title">NariSangha</div>
                <div className="brand-subtitle">
                  Women’s communities &amp; care journeys
                </div>
              </div>
            </div>
            <nav className="nav-links">
              <a href="#start">Start</a>
              <a href="#forum">Live Q&amp;A</a>
              <a href="#safety">Safety</a>
            </nav>
            <div className="top-bar-cta">
              <div className="pill-tag">
                Agentic setup · Discord · Facebook · In‑app
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
                    <div className="hero-chip">Discord, Facebook &amp; in‑app spaces</div>
                    <div className="hero-chip">Agentic onboarding &amp; moderation</div>
                  </div>
                  <div className="hero-chip">StackOverflow + Quora streams</div>
                </div>

                <h1 className="hero-title">
                  <span className="hero-gradient">Find or build your safe circle</span>
                </h1>
                <p className="hero-subtitle">
                  Create your own women’s community or join trusted circles already
                  running on Discord, Facebook Groups or this platform – with an AI
                  agent handling flows, invites, and moderation journeys end‑to‑end.
                </p>

                <div className="hero-actions">
                  <button
                    className="btn primary"
                    onClick={() => setMode("create")}
                  >
                    Create a women’s community
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
                        (mode === "create" ? " active" : "")
                      }
                      data-mode="create"
                      onClick={() => setMode("create")}
                    >
                      <span className="dot-small"></span>
                      Create community
                    </button>
                    <button
                      className={
                        "mode-toggle-button" + (mode === "join" ? " active" : "")
                      }
                      data-mode="join"
                      onClick={() => setMode("join")}
                    >
                      Join communities
                    </button>
                  </div>
                  <div
                    className="mode-toggle-caption"
                    dangerouslySetInnerHTML={{
                      __html: currentModeText.replace(
                        mode,
                        `<strong>${mode}</strong>`
                      )
                    }}
                  />
                </div>

                <div className="deck-shell">
                  {/* Create card */}
                  <div className="deck-card">
                    <div className="deck-header">
                      <div>
                        <div className="deck-title">Create a women’s community</div>
                        <div className="deck-subtitle">
                          Configure basics; the agent builds Discord, Facebook or in‑app
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
                          <option value="internal">In‑app only</option>
                          <option value="discord">Discord server + In‑app</option>
                          <option value="facebook">Facebook Group + In‑app</option>
                          <option value="all">Discord + Facebook + In‑app</option>
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
                          Tell the agent what you’re looking for; it searches Discord, FB
                          &amp; in‑app.
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
                            <option value="internal">In‑app</option>
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
                    <option value="women-in-tech">Women in tech</option>
                    <option value="healthtech">Healthtech &amp; AI</option>
                    <option value="pcos">PCOS &amp; women’s health</option>
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
                      Handling on‑call rotations as a woman in healthtech
                    </div>
                    <div className="feed-item-snippet">
                      Discussion on balancing clinical duties, startup sprints and mental
                      health, with tips on boundaries and escalation.
                    </div>
                    <div className="feed-item-meta">
                      <span className="feed-tag">Quora · Women in Tech</span>
                      <a href="#" className="feed-link">
                        Open thread
                      </a>
                    </div>
                  </article>

                  <article className="feed-item">
                    <div className="feed-item-title">
                      Designing secure, privacy‑preserving women’s health platforms
                    </div>
                    <div className="feed-item-snippet">
                      Practical answers on data models, encryption and consent flows for
                      menstrual, pregnancy and cancer‑care data.
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
                  Every community – whether on Discord, Facebook or in‑app – is built
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
            </aside>
          </div>
        </main>

        <footer className="site-footer">
          <div className="footer-inner">
            <div>
              &copy; 2025 NariSangha · Women’s communities &amp; care journeys
            </div>
            <div className="footer-links">
              <a href="#start">Start</a>
              <span>·</span>
              <a href="#forum">Live Q&amp;A</a>
              <span>·</span>
              <a href="#safety">Safety</a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
