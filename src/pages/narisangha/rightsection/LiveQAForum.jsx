import React from "react";

const LiveQAForum = () => {
  return (
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
  );
};

export default LiveQAForum;

