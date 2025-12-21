import React from "react";

const SafetyCard = () => {
  return (
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
  );
};

export default SafetyCard;

