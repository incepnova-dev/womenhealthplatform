import React, { useState, useEffect } from 'react';
import "../styles/womenchild.css";

const NarishaktiSeva = () => {
  // --- STATE MANAGEMENT ---
  const [activeModal, setActiveModal] = useState(null); // 'child', 'women', 'bone', 'oncology'
  const [activePatientTab, setActivePatientTab] = useState('upcoming-care');
  const [oncQuestion, setOncQuestion] = useState("");
  const [oncNBAFeedback, setOncNBAFeedback] = useState("");

  // --- GLOBAL QUESTION HELPERS ---
  const prefillOncQuestion = (text) => {
    setOncQuestion(text);
  };

  const submitOncQuestion = () => {
    if (!oncQuestion.trim()) return;
    setOncNBAFeedback(
      `Your question: "${oncQuestion}". The assistant can now suggest the right registry updates, tests or follow-up plan.`
    );
  };

  // --- REGISTRY / COMBINED FLOWS ---
  const openOncRegistrySummary = () => alert('Open combined oncology + cardio + neuro registry summary for this woman.');
  const openOncVisitPlanner = () => alert('Plan upcoming oncology, cardiac and neuro visits and investigations.');
  const openOncChecklist = () => alert('Show unified checklist for cancer, heart and brain follow-up.');
  const downloadOncSummary = () => alert('Generate and share a PDF/registry summary for tumour board or referral.');

  // --- PER-CANCER FLOWS ---
  const openBreastPathway = () => alert('Open structured breast cancer pathway: risk, staging, treatment and survivorship.');
  const recordBreastMilestone = () => alert('Record a breast cancer event (screen, diagnosis, surgery, chemo, radiation, endocrine follow-up).');
  const openCervicalScreening = () => alert('Open HPV/Pap screening scheduler and registry card.');
  const logCervicalResult = () => alert('Log HPV / Pap / colposcopy / biopsy result with date and classification.');
  const openOvarianRiskFlow = () => alert('Run ovarian risk assessment and genetic counselling prompts (BRCA / Lynch).');
  const logOvarianSymptoms = () => alert('Record ovarian symptoms and CA-125 / imaging results over time.');
  const openEndometrialFlow = () => alert('Guide through abnormal bleeding triage and referral for endometrial cancer risk.');
  const openEndometrialSurvivorship = () => alert('Open endometrial cancer survivorship follow-up schedule.');
  const openVaginalVulvarFlow = () => alert('Document vaginal/vulvar symptoms, exam findings and biopsies with privacy safeguards.');
  const openIntimacySupport = () => alert('Show intimacy, sexual-health and psychosocial support resources.');
  const openRareGynRegistry = () => alert('Open rare gynaecological cancer registry entry and family screening prompts.');
  const shareTumorBoardSummary = () => alert('Share tumour-board summary with treating teams and referrals.');

  // --- CARDIO FLOWS ---
  const openCardioOncFlow = () => alert('Start cardio-oncology tracking: baseline and periodic echo/ECG/BP/labs.');
  const logCardioTest = () => alert('Log echo / ECG / BP / lipid or other cardiac test result.');
  const openWomenHeartRisk = () => alert('Run heart-disease risk assessment tuned for women, including pregnancy history.');
  const openCardiacRehabPlan = () => alert('Show cardiac rehab phases, tasks and adherence tracker.');

  // --- NEURO FLOWS ---
  const openStrokeRiskFlow = () => alert('Run stroke-risk scoring with women-specific factors (pregnancy, HRT, migraine, AFib).');
  const openNeuroRehabPlan = () => alert('Show neuro-rehab journey after stroke or brain injury.');
  const startBrainHealthDiary = () => alert('Start brain-health diary for cognition, mood and seizures.');
  const shareNeuroSummary = () => alert('Share neuro and brain-health summary with specialists.');

  // --- NAVIGATION & UI HELPERS ---
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Close modal on Escape
  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') setActiveModal(null); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <div className="page">
      {/* NAV */}
      <header className="nav">
        <div className="nav-inner">
          <div className="nav-brand">
            <div className="nav-logo">S</div>
            <div className="nav-title">
              <span className="nav-title-main">Narishakti - Women & Child Seva Health Network</span>
              <span className="nav-title-sub">Continuity of care for India</span>
            </div>
          </div>
          <div className="nav-cta">
            <div className="nav-link" onClick={() => scrollToSection('specialties')}>Specialties</div>
            <a className="nav-link" href="#patients">For Patients</a>
            <div className="nav-link">For Hospitals</div>
            <div className="nav-link">For Insurers</div>
            <button className="nav-button">
              <span className="icon">⟶</span>
              Book a care pathway
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section className="hero">
          <div>
            <div className="hero-eyebrow">
              <div className="hero-pill-dot">★</div>
              <div className="hero-pill-text">Integrated care journeys across life, not one‑off visits</div>
            </div>
            <h1 className="hero-title">
              A unified digital front‑door for <span className="highlight">women and child care</span>.
            </h1>
            <p className="hero-subtitle">
              Seva Health Network connects families in India to trusted paediatric, women’s, bone, cancer,
              cardiac and neuro services with proactive follow‑up and remote guidance.
            </p>

            <div className="hero-actions">
              <button className="btn-primary">Get started with Seva <span>→</span></button>
              <button className="btn-ghost" onClick={() => scrollToSection('specialties')}>Explore specialties <span>↗</span></button>
            </div>
          </div>

          <aside className="hero-card">
            <div className="hero-card-inner">
              <div className="hero-card-header">
                <div className="hero-card-title">Care bundles</div>
                <div className="hero-card-tag">Hospital & clinic ready</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '15px' }}>
                <div className="chip">Child Health</div>
                <div className="chip">Women's Health</div>
                <div className="chip">Bone & Ortho</div>
                <div className="chip">Cardiac-Onco</div>
              </div>
            </div>
          </aside>
        </section>

        {/* SPECIALTIES */}
        <section className="sections" id="specialties">
          <div className="service-grid">
            <div className="service-card" onClick={() => setActiveModal('child')}>
              <div className="service-tag">Paediatrics</div>
              <h2 className="service-title">Child Growth & Vaccination</h2>
              <p className="service-body">Track growth and vaccines in one shared record.</p>
            </div>
            <div className="service-card" onClick={() => setActiveModal('women')}>
              <div className="service-tag">Women’s Health</div>
              <h2 className="service-title">Lifecycle Women’s Care</h2>
              <p className="service-body">Fertility, pregnancy, and menopause support.</p>
            </div>
            <div className="service-card" onClick={() => setActiveModal('bone')}>
              <div className="service-tag">Ortho & Bone</div>
              <h2 className="service-title">Bone Health & Rehab</h2>
              <p className="service-body">Standardised protocols for fractures and recovery.</p>
            </div>
            <div className="service-card" onClick={() => setActiveModal('oncology')}>
              <div className="service-tag">Cancer & Chronic</div>
              <h2 className="service-title">Cancer & Cardio‑Neuro</h2>
              <p className="service-body">Structured screening and long‑term follow‑up.</p>
            </div>
          </div>
        </section>
      </main>

      {/* --- ONCOLOGY / CANCER / CARDIO / NEURO MODAL --- */}
      {activeModal === 'oncology' && (
        <div className="modal-overlay visible" onClick={() => setActiveModal(null)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Cancer, Cardiac & Neuro Integrated Registry</div>
              <button className="modal-close" onClick={() => setActiveModal(null)}>&times;</button>
            </div>

            <div className="modal-body">
              {/* Question Bar */}
              <div className="cg-question-bar">
                <input 
                  type="text" 
                  className="cg-question-input"
                  value={oncQuestion}
                  onChange={(e) => setOncQuestion(e.target.value)}
                  placeholder="Ask a question about cancer or heart care..."
                />
                <button className="btn-primary" onClick={submitOncQuestion}>Ask Assistant</button>
              </div>
              
              {oncNBAFeedback && (
                <div className="cg-nba-card" style={{ marginTop: '10px', padding: '10px', background: 'var(--accent-soft)', borderRadius: '8px' }}>
                  <p id="onc-nba-text" style={{ fontSize: '13px' }}>{oncNBAFeedback}</p>
                </div>
              )}

              {/* TABS */}
              <div className="patient-tabs" style={{ marginTop: '20px' }}>
                <button 
                  className={`patient-tab ${activePatientTab === 'upcoming-care' ? 'active' : ''}`}
                  onClick={() => setActivePatientTab('upcoming-care')}
                >
                  Care Pathways
                </button>
                <button 
                  className={`patient-tab ${activePatientTab === 'registry-controls' ? 'active' : ''}`}
                  onClick={() => setActivePatientTab('registry-controls')}
                >
                  Registry & Tools
                </button>
              </div>

              {/* TAB CONTENT: PATHWAYS */}
              {activePatientTab === 'upcoming-care' && (
                <div className="patient-tab-panel active" style={{ marginTop: '15px' }}>
                  <div className="patient-two-column">
                    <div className="patient-card">
                      <h3>Gynaecological Oncology</h3>
                      <button className="btn-ghost" style={{width:'100%', marginBottom:'5px'}} onClick={openBreastPathway}>Breast Pathway</button>
                      <button className="btn-ghost" style={{width:'100%', marginBottom:'5px'}} onClick={openCervicalScreening}>Cervical Screening</button>
                      <button className="btn-ghost" style={{width:'100%'}} onClick={openOvarianRiskFlow}>Ovarian Risk</button>
                    </div>
                    <div className="patient-card">
                      <h3>Cardio & Neuro</h3>
                      <button className="btn-ghost" style={{width:'100%', marginBottom:'5px'}} onClick={openCardioOncFlow}>Cardio-Onco Tracker</button>
                      <button className="btn-ghost" style={{width:'100%', marginBottom:'5px'}} onClick={openStrokeRiskFlow}>Stroke Risk Assessment</button>
                      <button className="btn-ghost" style={{width:'100%'}} onClick={startBrainHealthDiary}>Brain Health Diary</button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB CONTENT: REGISTRY */}
              {activePatientTab === 'registry-controls' && (
                <div className="patient-tab-panel active" style={{ marginTop: '15px' }}>
                   <div className="patient-card">
                      <h3>Unified Registry Controls</h3>
                      <div style={{display:'flex', gap:'10px', flexWrap:'wrap'}}>
                        <button className="btn-primary" onClick={openOncRegistrySummary}>Summary</button>
                        <button className="btn-primary" onClick={openOncVisitPlanner}>Planner</button>
                        <button className="btn-primary" onClick={downloadOncSummary}>Download PDF</button>
                        <button className="btn-ghost" onClick={shareTumorBoardSummary}>Share with Board</button>
                      </div>
                   </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer style={{ padding: '40px 20px', textAlign: 'center', borderTop: '1px solid var(--border)', marginTop: 'auto' }}>
        <p style={{ color: 'var(--muted)', fontSize: '12px' }}>© 2024 Narishakti Seva Health Network. India's integrated care model.</p>
      </footer>
    </div>
  );
};

export default NarishaktiSeva;