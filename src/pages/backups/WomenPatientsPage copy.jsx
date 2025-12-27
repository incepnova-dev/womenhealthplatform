import React, { useState } from "react";
import patientData from "../data/womenpatients.json";
import "../styles/womenpatients.css";

export default function WomenPatients() {
  // 1. State management for Tabs and Modals
  const [activeTab, setActiveTab] = useState("pt-health-conditions");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCondition, setSelectedCondition] = useState(null);

  // 2. Handlers
  const handleOpenModal = (condition) => {
    setSelectedCondition(condition);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCondition(null);
  };

  return (
    <div className="page">
      {/* HEADER */}
      <header className="nav">
        <div className="nav-inner">
          <div className="nav-brand">
            <div className="nav-logo">S</div>
            <div className="nav-title">
              <span className="nav-title-main">
                Narishakti - Women & Child Seva Health Network
              </span>
              <span className="nav-title-sub">
                Continuity of care for India
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="sections">
        <section>
          <div className="section-header">
            <div className="section-title">For Patients</div>
            <div className="section-subtitle">
              Guidance on when to see a gynecologist, what symptoms to watch for,
              and how to prepare for visits and preventive care.
            </div>
          </div>

          <div className="patient-tabs">
            {/* TAB BUTTONS */}
            <div className="patient-tab-list">
              {[
                { id: "pt-health-conditions", label: "Health Conditions" },
                { id: "pt-when-see-gyn", label: "When to See a Gynecologist" },
                { id: "pt-find-gyn", label: "Find a Gynecologist" },
                { id: "pt-prevention-care", label: "Prevention & Care" },
                { id: "pt-faq", label: "FAQs" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  className={`patient-tab ${activeTab === tab.id ? "active" : ""}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* TAB CONTENT PANELS */}
            <div className="tab-content-container">
              
              {/* HEALTH CONDITIONS TAB */}
              {activeTab === "pt-health-conditions" && (
                <div className="patient-tab-panel active">
                  <div className="patient-grid">
                    {patientData.healthConditions?.map((condition, index) => (
                      <article className="patient-card" key={index}>
                        <h3>{condition.name || condition.title}</h3>
                        {condition.category && <p className="patient-card-category">{condition.category}</p>}
                        <p className="patient-card-snippet">
                          {condition.shortDescription || condition.description}
                        </p>
                        <button 
                          className="nav-button" 
                          style={{ marginTop: "10px" }}
                          onClick={() => handleOpenModal(condition)}
                        >
                          <span className="icon">➜</span> View full details
                        </button>
                      </article>
                    ))}
                  </div>
                </div>
              )}

              {/* WHEN TO SEE GYNECOLOGIST TAB */}
              {activeTab === "pt-when-see-gyn" && (
                <div className="patient-tab-panel active">
                  <div className="patient-grid">
                    {patientData.whenToSeeGynecologist?.map((card, index) => (
                      <div className="patient-card" key={index}>
                        <h3>{card.title}</h3>
                        {card.description && <p>{card.description}</p>}
                        {card.items && (
                          <ul>
                            {card.items.map((item, i) => (
                              <li key={i}>{item}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* FIND GYNECOLOGIST TAB */}
              {activeTab === "pt-find-gyn" && (
                <div className="patient-tab-panel active">
                  <div className="patient-two-column">
                    {patientData.findGynecologist?.map((card, index) => (
                      <div className="patient-card" key={index}>
                        <h3>{card.title}</h3>
                        {card.description && <p>{card.description}</p>}
                        {card.items && (
                          <ul>
                            {card.items.map((item, i) => (
                              <li key={i}>{item}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* PREVENTION & CARE TAB */}
              {activeTab === "pt-prevention-care" && (
                <div className="patient-tab-panel active">
                  <div className="patient-grid">
                    {patientData.preventionCare?.map((card, index) => (
                      <div className="patient-card" key={index}>
                        <h3>{card.title}</h3>
                        {card.description && <p>{card.description}</p>}
                        {card.items && (
                          <ul>
                            {card.items.map((item, i) => (
                              <li key={i}>{item}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* FAQS TAB */}
              {activeTab === "pt-faq" && (
                <div className="patient-tab-panel active">
                  <div className="patient-faq-list">
                    {patientData.faqs?.map((faq, index) => (
                      <details className="patient-card" key={index}>
                        <summary>{faq.question}</summary>
                        <p style={{ marginTop: "10px" }}>{faq.answer}</p>
                      </details>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* MODAL - Conditional Rendering */}
      {isModalOpen && selectedCondition && (
        <div className="modal-overlay visible" onClick={handleCloseModal}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedCondition.name || selectedCondition.title}</h2>
            <div className="modal-body" style={{ marginTop: '15px', fontSize: '13px' }}>
              <p className="patient-card-category">
                <em>A detailed overview of {selectedCondition.name} and how it affects women's health.</em>
              </p>

              {selectedCondition.symptoms && (
                <div className="patient-card-section">
                  <h4>Symptoms</h4>
                  <ul>
                    {(Array.isArray(selectedCondition.symptoms) ? selectedCondition.symptoms : [selectedCondition.symptoms]).map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedCondition.causes && (
                <div className="patient-card-section">
                  <h4>Causes</h4>
                  <ul>
                    {(Array.isArray(selectedCondition.causes) ? selectedCondition.causes : [selectedCondition.causes]).map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedCondition.treatment && (
                <div className="patient-card-section">
                  <h4>Treatment options</h4>
                  <ul>
                    {(Array.isArray(selectedCondition.treatment) ? selectedCondition.treatment : [selectedCondition.treatment]).map((t, i) => (
                      <li key={i}>{t}</li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedCondition.citation && (
                <div style={{
                  background: '#e8f4f8',
                  borderLeft: '3px solid #2196f3',
                  padding: '0.75rem',
                  marginTop: '1.5rem',
                  borderRadius: '4px',
                  fontSize: '0.85rem'
                }}>
                  <strong style={{ color: '#2196f3' }}>Research Sources</strong><br />
                  {selectedCondition.citation}
                </div>
              )}
            </div>
            <button
              className="nav-button"
              onClick={handleCloseModal}
              style={{ marginTop: '20px' }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}