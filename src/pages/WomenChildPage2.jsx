import React, { useState, useEffect } from 'react';
import "../styles/womenchild.css";

const WomenChildPage2 = () => {
  // --- STATE MANAGEMENT ---
  const [activeModal, setActiveModal] = useState(null); // 'child', 'women', 'bone', 'oncology'
  const [activePatientTab, setActivePatientTab] = useState('upcoming-care');
  const [activeMetricPanel, setActiveMetricPanel] = useState(null); // 'child-panel', 'women-panel', 'chronic-panel'
  
  // Child Growth State
  const [cgQuestion, setCgQuestion] = useState("");
  const [cgNBAFeedback, setCgNBAFeedback] = useState("MMR1 is due in the next 7 days. Book a vaccination visit or mark it as already taken.");
  const [cgRole, setCgRole] = useState('parent');
  
  // Women's Health State
  const [womensQuestion, setWomensQuestion] = useState("");
  const [womensNBAFeedback, setWomensNBAFeedback] = useState("2nd trimester ANC visit due this week. Confirm blood tests and blood pressure check.");
  const [womensRole, setWomensRole] = useState('client');
  
  // Bone Health State
  const [boneQuestion, setBoneQuestion] = useState("");
  const [boneNBAFeedback, setBoneNBAFeedback] = useState("Home exercise review and wound check due in 2 days. Confirm visit or tele-review.");
  const [boneRole, setBoneRole] = useState('patient');
  
  // Oncology State
  const [oncQuestion, setOncQuestion] = useState("");
  const [oncNBAFeedback, setOncNBAFeedback] = useState("Choose a cancer or cardio/neuro focus above to see tailored next steps and registry prompts.");
  const [oncDomain, setOncDomain] = useState('cancer');

  // --- CHILD GROWTH HANDLERS ---
  const prefillCGQuestion = (text) => setCgQuestion(text);
  
  const submitCGQuestion = () => {
    if (!cgQuestion.trim()) return;
    setCgNBAFeedback(`Your question: "${cgQuestion}". The assistant can now suggest the most relevant next step (visit, home care, or follow-up).`);
  };

  const openVaccinationCard = () => {
    const el = document.querySelector('#child-growth-vaccination-agent');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const openGrowthUpdateForm = () => alert("Open quick form to update weight, height, MUAC and head circumference.");
  const bookVaccinationVisit = () => alert('Open slot finder / WhatsApp / phone call for nearest clinic.');
  const downloadVaccinationCard = () => alert('Generate PDF/QR and allow share via WhatsApp/SMS/email.');
  const openVaccineFAQ = () => alert("Show simple, vernacular explanation of why delay matters and what to do now.");
  const openGrowthChart = () => alert('Open full growth chart with WHO curves.');
  const openNutritionPlanFlow = () => alert('Start Q&A to generate a 2-week nutrition plan with reminders.');
  const talkToPaediatrician = () => alert("Open chat or appointment booking with childs paediatrician.");
  const setReweighReminder = () => alert('Set reminder to re-check weight in 4 weeks and log 3-day diet before visit.');
  const markDoseTaken = () => alert('Mark vaccine dose as taken elsewhere.');

  const handleSetCGRole = (role) => setCgRole(role);

  // --- WOMEN'S HEALTH HANDLERS ---
  const prefillWomensQuestion = (text) => setWomensQuestion(text);
  
  const submitWomensQuestion = () => {
    if (!womensQuestion.trim()) return;
    setWomensNBAFeedback(`Your question: "${womensQuestion}". The assistant can now suggest the most relevant next step (self-care, visit, or follow-up).`);
  };

  const openWomensJourneyPlanner = () => alert('Open lifecycle planner across adolescence, fertility, pregnancy and menopause.');
  const openWomensVitalsForm = () => alert('Open quick form to update BP, weight, cycle details and key labs.');
  const bookWomensVisit = () => alert('Open slot finder / WhatsApp / phone call for women\'s health visit.');
  const logHomeReadings = () => alert('Capture home BP, blood sugar or symptom log before next visit.');
  const startCycleTracking = () => alert('Start menstrual cycle and symptom tracking journey.');
  const screenPCOS = () => alert('Run PCOS / anaemia screening questionnaire.');
  const openPreconceptionPlan = () => alert('Open pre-conception checklist and risk assessment.');
  const shareFertilityTips = () => alert('Share fertility tips via SMS / WhatsApp.');
  const openPregnancyTimeline = () => alert('Show pregnancy timeline with trimester tasks and visit plan.');
  const screenPostpartumDepression = () => alert('Run postpartum depression screening tool (e.g., EPDS stub).');
  const startMenopauseDiary = () => alert('Open menopause symptom diary with daily check-ins.');
  const assessLongTermRisk = () => alert('Assess long-term cardio-metabolic and bone health risk.');

  const handleSetWomensRole = (role) => setWomensRole(role);

  // --- BONE HEALTH HANDLERS ---
  const prefillBoneQuestion = (text) => setBoneQuestion(text);
  
  const submitBoneQuestion = () => {
    if (!boneQuestion.trim()) return;
    setBoneNBAFeedback(`Your question: "${boneQuestion}". The assistant can now suggest the most relevant next step (home rehab, visit, or escalation).`);
  };

  const openRehabPlan = () => alert('Open phase-wise bone & joint rehab plan.');
  const openBoneVitalsForm = () => alert('Open form to capture pain score, mobility and assistive devices.');
  const bookRehabVisit = () => alert('Book in-person or tele-rehab review with ortho / physio.');
  const logHomeExercises = () => alert('Log completed home exercises and walking distance for today.');
  const openFractureChecklist = () => alert('Show fracture-specific home-care and red-flag checklist.');
  const sendAcuteCareTips = () => alert('Send plaster/splint care tips to caregiver via WhatsApp/SMS.');
  const openJointRehabPlan = () => alert('Show joint replacement rehab phases with goals.');
  const trackJointProgress = () => alert('Track pain, ROM and gait milestones across phases.');
  const runOsteoporosisRisk = () => alert('Run osteoporosis risk scoring and suggest screening tests.');
  const openFallChecklist = () => alert('Open home fall-prevention checklist.');
  const startPainDiary = () => alert('Start daily pain and function diary for joint/spine issues.');
  const openSpineExercisePlan = () => alert('Show spine and joint exercise modules.');

  const handleSetBoneRole = (role) => setBoneRole(role);

  // --- ONCOLOGY HANDLERS ---
  const prefillOncQuestion = (text) => setOncQuestion(text);
  
  const submitOncQuestion = () => {
    if (!oncQuestion.trim()) return;
    setOncNBAFeedback(`Your question: "${oncQuestion}". The assistant can now suggest the right registry updates, tests or follow-up plan.`);
  };

  const handleSetOncDomain = (domain) => {
    setOncDomain(domain);
    const nbaTexts = {
      cancer: 'Pick a cancer panel to record staging, treatment milestones and survivorship follow-up for this woman.',
      cardio: 'Log heart tests and symptoms to track cardio-oncology and heart-disease risk in women.',
      neuro: 'Track stroke risk, neuro symptoms and rehab progress for women living with or beyond cancer.'
    };
    setOncNBAFeedback(nbaTexts[domain] || nbaTexts.cancer);
  };

  // Registry / combined flows
  const openOncRegistrySummary = () => alert('Open combined oncology + cardio + neuro registry summary for this woman.');
  const openOncVisitPlanner = () => alert('Plan upcoming oncology, cardiac and neuro visits and investigations.');
  const openOncChecklist = () => alert('Show unified checklist for cancer, heart and brain follow-up.');
  const downloadOncSummary = () => alert('Generate and share a PDF/registry summary for tumour board or referral.');

  // Per-cancer flows
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

  // Cardio flows
  const openCardioOncFlow = () => alert('Start cardio-oncology tracking: baseline and periodic echo/ECG/BP/labs.');
  const logCardioTest = () => alert('Log echo / ECG / BP / lipid or other cardiac test result.');
  const openWomenHeartRisk = () => alert('Run heart-disease risk assessment tuned for women, including pregnancy history.');
  const openCardiacRehabPlan = () => alert('Show cardiac rehab phases, tasks and adherence tracker.');

  // Neuro flows
  const openStrokeRiskFlow = () => alert('Run stroke-risk scoring with women-specific factors (pregnancy, HRT, migraine, AFib).');
  const openNeuroRehabPlan = () => alert('Show neuro-rehab journey after stroke or brain injury.');
  const startBrainHealthDiary = () => alert('Start brain-health diary for cognition, mood and seizures.');
  const shareNeuroSummary = () => alert('Share neuro and brain-health summary with specialists.');

  // --- NAVIGATION & UI HELPERS ---
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleMetricPillClick = (panelId) => {
    setActiveMetricPanel(panelId);
  };

  const closeMetricPanel = () => {
    setActiveMetricPanel(null);
  };

  // Close modal/panel on Escape
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        setActiveModal(null);
        setActiveMetricPanel(null);
      }
    };
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
            <a className="nav-link" href="/patients">For Patients</a>
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
              <div className="hero-pill-text">Integrated care journeys across life, not one-off visits</div>
            </div>
            <h1 className="hero-title">
              A unified digital front-door for <span className="highlight">women and child care</span>.
            </h1>
            <p className="hero-subtitle">
              Seva Health Network connects families in India to trusted paediatric, women's, bone, cancer,
              cardiac and neuro services with proactive follow-up, vernacular education and remote guidance.
            </p>

            <div className="hero-metrics">
              <div className="metric-pill" onClick={() => handleMetricPillClick('child-panel')}>
                <strong>Child & adolescent</strong> growth, vaccines, nutrition
              </div>
              <div className="metric-pill" onClick={() => handleMetricPillClick('women-panel')}>
                <strong>Women's lifecycle</strong> reproductive to menopause
              </div>
              <div className="metric-pill" onClick={() => handleMetricPillClick('chronic-panel')}>
                <strong>Chronic & cancer</strong> long-term navigation
              </div>
            </div>

            <div className="hero-actions">
              <button className="btn-primary">Get started with Seva <span>→</span></button>
              <button className="btn-ghost" onClick={() => scrollToSection('specialties')}>Explore specialties <span>↗</span></button>
            </div>
            
            <p className="hero-footnote">
              Built for India with multilingual content, EMR integration options and care-team workflows.
            </p>
          </div>

          <aside className="hero-card">
            <div className="hero-card-inner">
              <div className="hero-card-header">
                <div>
                  <div className="hero-card-title">Care bundles we orchestrate</div>
                </div>
                <div className="hero-card-tag">Hospital & clinic ready</div>
              </div>

              <div className="specialties-grid">
                <div className="chip-column">
                  <div className="chip accent">
                    <div className="chip-icon">C</div>
                    <div>
                      <span className="chip-label">Child Health</span>
                      <span className="chip-sub">Growth charts, vaccines, sick visits</span>
                    </div>
                  </div>
                  <div className="chip">
                    <div className="chip-icon">B</div>
                    <div>
                      <span className="chip-label">Bone & Ortho</span>
                      <span className="chip-sub">Fractures, rehab, fall-risk</span>
                    </div>
                  </div>
                  <div className="chip">
                    <div className="chip-icon">N</div>
                    <div>
                      <span className="chip-label">Neuro</span>
                      <span className="chip-sub">Stroke, dementia, tele-neuro</span>
                    </div>
                  </div>
                </div>

                <div className="chip-column">
                  <div className="chip accent">
                    <div className="chip-icon">W</div>
                    <div>
                      <span className="chip-label">Women's Health</span>
                      <span className="chip-sub">Puberty to menopause, mental health</span>
                    </div>
                  </div>
                  <div className="chip">
                    <div className="chip-icon">K</div>
                    <div>
                      <span className="chip-label">Cardiac</span>
                      <span className="chip-sub">Risk screening, rehab, coaching</span>
                    </div>
                  </div>
                  <div className="chip">
                    <div className="chip-icon">Ca</div>
                    <div>
                      <span className="chip-label">Cancer</span>
                      <span className="chip-sub">Screening, navigation, survivorship</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="hero-card-footer">
                <div className="hero-card-status">
                  <span className="status-dot"></span>
                  <span>Live care pathways & AI triage</span>
                </div>
                <div>Integrates with hospital EMR & RPM tools</div>
              </div>
            </div>
          </aside>
        </section>

        {/* SPECIALTIES */}
        <section className="sections" id="specialties">
          <div className="section-header">
            <div className="section-title">Specialties built into one experience</div>
            <p className="section-subtitle">
              Patients see one simple interface. Care teams get structured workflows, alerts and longitudinal records
              across child health, women's care, bone, cancer, cardiac and neuro services.
            </p>
          </div>

          <div className="service-grid">
            <div className="service-card" onClick={() => setActiveModal('child')}>
              <div className="service-card-inner">
                <div className="service-tag">Paediatrics</div>
                <div className="service-title-row">
                  <h2 className="service-title">Child Growth & Vaccination</h2>
                  <div className="service-pill">Parents & paediatricians</div>
                </div>
                <p className="service-body">
                  Track growth, vaccines, milestones and acute illnesses in one shared record, with reminders and vernacular
                  nudges for nutrition and development.
                </p>
                <div className="service-meta">
                  <span>✓ Digital vaccination card</span>
                  <span>✓ Growth risk flags</span>
                </div>
              </div>
            </div>

            <div className="service-card" onClick={() => setActiveModal('women')}>
              <div className="service-card-inner">
                <div className="service-tag">Women's Health</div>
                <div className="service-title-row">
                  <h2 className="service-title">Lifecycle Women's Care</h2>
                  <div className="service-pill">Adolescent to menopause</div>
                </div>
                <p className="service-body">
                  Menstrual health, fertility, pregnancy, postpartum, menopause and mental health support — with guided
                  pathways, red-flag alerts and partner education.
                </p>
                <div className="service-meta">
                  <span>✓ Multilingual content</span>
                  <span>✓ IPV & mental health flows</span>
                </div>
              </div>
            </div>

            <div className="service-card" onClick={() => setActiveModal('bone')}>
              <div className="service-card-inner">
                <div className="service-tag">Ortho & Bone</div>
                <div className="service-title-row">
                  <h2 className="service-title">Bone Health & Rehab</h2>
                  <div className="service-pill">OPD & post-discharge</div>
                </div>
                <p className="service-body">
                  Standardised protocols for fractures, falls, osteoporosis and joint replacement with home-exercise plans,
                  progress tracking and escalation rules.
                </p>
                <div className="service-meta">
                  <span>✓ Rehab adherence</span>
                  <span>✓ Elderly fall-risk tools</span>
                </div>
              </div>
            </div>

            <div className="service-card" onClick={() => setActiveModal('oncology')}>
              <div className="service-card-inner">
                <div className="service-tag">Cancer & Chronic</div>
                <div className="service-title-row">
                  <h2 className="service-title">Cancer & Cardio-Neuro Navigation</h2>
                  <div className="service-pill">Hospitals & programmes</div>
                </div>
                <p className="service-body">
                  Structured screening, triage and follow-up journeys for breast and other cancers, cardiac risk and stroke
                  with reminders, symptom logs and survivor support.
                </p>
                <div className="service-meta">
                  <span>✓ Pathway templates</span>
                  <span>✓ Team dashboards</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* --- METRIC DETAIL PANELS --- */}
      {/* Child & adolescent panel */}
      <div className={`metric-panel-backdrop ${activeMetricPanel === 'child-panel' ? 'active' : ''}`} 
           onClick={(e) => e.target.className.includes('metric-panel-backdrop') && closeMetricPanel()}>
        <div className="metric-panel">
          <div className="metric-panel-header">
            <div>
              <div className="metric-panel-title">Child & Adolescent Care Journey</div>
              <div className="metric-panel-pill">Growth · Vaccines · Nutrition</div>
            </div>
            <button className="metric-panel-close" onClick={closeMetricPanel}>&times;</button>
          </div>
          <p className="metric-panel-subtitle">
            Longitudinal child records for growth, immunisation and everyday nutrition — with reminders, risk flags and
            paediatric-friendly summaries.
          </p>

          <div className="metric-panel-grid">
            <div className="metric-panel-block">
              <h3>Growth tracking</h3>
              <p>
                Percentile-based growth charts, milestone checklists and under/over-nutrition risk flags, ready to share with
                paediatricians or school health programmes.
              </p>
              <div className="metric-panel-actions">
                <button className="metric-chip-cta primary">Add child profile</button>
                <button className="metric-chip-cta">Log clinic visit</button>
                <button className="metric-chip-cta">Download growth summary</button>
              </div>
            </div>

            <div className="metric-panel-block">
              <h3>Smart vaccination calendar</h3>
              <p>
                Auto-generated vaccine schedules by DOB with due and overdue labels, SMS/WhatsApp reminders and a sharable
                digital vaccination card for every child.
              </p>
              <div className="metric-panel-actions">
                <button className="metric-chip-cta primary">Create vaccine calendar</button>
                <button className="metric-chip-cta">Mark dose given</button>
                <button className="metric-chip-cta">Share vaccine card</button>
              </div>
            </div>

            <div className="metric-panel-block">
              <h3>Everyday nutrition nudges</h3>
              <p>
                Age-banded meal guidance, anaemia and obesity tips, and bite-sized vernacular nudges that help caregivers
                build healthier habits over time.
              </p>
              <div className="metric-panel-actions">
                <button className="metric-chip-cta primary">Start nutrition plan</button>
                <button className="metric-chip-cta">Track weekly habits</button>
                <button className="metric-chip-cta">Flag nutrition concern</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    
    

      <div className={`metric-panel-backdrop ${activeMetricPanel === 'women-panel' ? 'active' : ''}`}
           onClick={(e) => e.target.className.includes('metric-panel-backdrop') && closeMetricPanel()}>
        <div className="metric-panel">
          <div className="metric-panel-header">
            <div>
              <div className="metric-panel-title">Women's Health Across the Lifespan</div>
              <div className="metric-panel-pill">Adolescent · Reproductive · Menopause</div>
            </div>
            <button className="metric-panel-close" onClick={closeMetricPanel}>&times;</button>
          </div>
          <p className="metric-panel-subtitle">
            Stage-wise journeys from puberty through pregnancy and postpartum to perimenopause and menopause, with red-flag
            alerts and mental health support.
          </p>

          <div className="metric-panel-grid">
            <div className="metric-panel-block">
              <h3>Adolescent & cycle health</h3>
              <p>
                Menstrual tracking, PCOS and dysmenorrhoea prompts, plus body-image and mood check-ins designed for
                adolescents and young adults.
              </p>
              <div className="metric-panel-actions">
                <button className="metric-chip-cta primary">Start cycle tracking</button>
                <button className="metric-chip-cta">Screen for PCOS/PMS</button>
                <button className="metric-chip-cta">View teen education content</button>
              </div>
            </div>

            <div className="metric-panel-block">
              <h3>Pre-conception & pregnancy</h3>
              <p>
                Pre-conception checklist, trimester-wise tasks, maternal-risk prompts and partner education linked with
                hospital antenatal visit plans.
              </p>
              <div className="metric-panel-actions">
                <button className="metric-chip-cta primary">Plan pregnancy journey</button>
                <button className="metric-chip-cta">View trimester milestones</button>
                <button className="metric-chip-cta">Check red-flag symptoms</button>
              </div>
            </div>

            <div className="metric-panel-block">
              <h3>Postpartum & early parenting</h3>
              <p>
                Recovery tracking, breastfeeding support, postpartum depression screening and structured follow-ups for both
                mother and baby.
              </p>
              <div className="metric-panel-actions">
                <button className="metric-chip-cta primary">Track postpartum recovery</button>
                <button className="metric-chip-cta">Screen mood & wellbeing</button>
                <button className="metric-chip-cta">Book lactation / counsellor</button>
              </div>
            </div>

            <div className="metric-panel-block">
              <h3>Perimenopause & menopause</h3>
              <p>
                Symptom diary, cardio-metabolic and bone health prompts, exercise modules and decision-support to discuss HRT
                and other options with clinicians.
              </p>
              <div className="metric-panel-actions">
                <button className="metric-chip-cta primary">Log menopause symptoms</button>
                <button className="metric-chip-cta">Assess long-term risks</button>
                <button className="metric-chip-cta">Plan specialist consult</button>
              </div>
            </div>
          </div>
        </div>
      </div>



      {/* Chronic & cancer panel */}
      <div className={`metric-panel-backdrop ${activeMetricPanel === 'chronic-panel' ? 'active' : ''}`}
           onClick={(e) => e.target.className.includes('metric-panel-backdrop') && closeMetricPanel()}>
        <div className="metric-panel">
          <div className="metric-panel-header">
            <div>
              <div className="metric-panel-title">Chronic & Cancer Care Navigation</div>
              <div className="metric-panel-pill">Screening · Treatment · Survivorship</div>
            </div>
            <button className="metric-panel-close" onClick={closeMetricPanel}>&times;</button>
          </div>
          <p className="metric-panel-subtitle">
            Connected journeys for cancer, cardiac and neuro care — from risk assessment and screening to treatment
            coordination, remote monitoring and survivorship.
          </p>

          <div className="metric-panel-grid">
            <div className="metric-panel-block">
              <h3>Screening & early detection</h3>
              <p>
                Cardiac, diabetes and cancer risk tools that personalise screening recommendations and schedule reminders for
                hospital or camp-based check-ups.
              </p>
              <div className="metric-panel-actions">
                <button className="metric-chip-cta primary">Check my risk</button>
                <button className="metric-chip-cta">Book screening visit</button>
                <button className="metric-chip-cta">Share risk report</button>
              </div>
            </div>

            <div className="metric-panel-block">
              <h3>Active treatment coordination</h3>
              <p>
                Treatment plan timelines for chemo cycles, cardiac rehab phases or neuro follow-ups with appointment lists,
                lab calendars and tele-consult links.
              </p>
              <div className="metric-panel-actions">
                <button className="metric-chip-cta primary">View today's tasks</button>
                <button className="metric-chip-cta">Sync upcoming visits</button>
                <button className="metric-chip-cta">Message care navigator</button>
              </div>
            </div>

            <div className="metric-panel-block">
              <h3>Remote monitoring & self-management</h3>
              <p>
                Symptom logs, vitals upload and medication adherence tracking that raise alerts to care teams when thresholds
                are crossed or patterns worsen.
              </p>
              <div className="metric-panel-actions">
                <button className="metric-chip-cta primary">Update today's symptoms</button>
                <button className="metric-chip-cta">Set medication reminders</button>
                <button className="metric-chip-cta">Review escalation rules</button>
              </div>
            </div>

            <div className="metric-panel-block">
              <h3>Survivorship & long-term support</h3>
              <p>
                Structured survivorship plans, rehab and psychosocial support, with guidance on work, family and long-term
                follow-up for cancer and chronic conditions.
              </p>
              <div className="metric-panel-actions">
                <button className="metric-chip-cta primary">Open survivorship plan</button>
                <button className="metric-chip-cta">Set follow-up schedule</button>
                <button className="metric-chip-cta">Explore support resources</button>
              </div>
            </div>

            </div>
          
        </div>
      </div>
      {/* --- CHILD GROWTH MODAL --- */}
      {activeModal === 'child' && (
        <div className="modal-overlay visible" onClick={() => setActiveModal(null)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Paediatrics · Child Growth & Vaccination</div>
              <button className="modal-close" onClick={() => setActiveModal(null)}>&times;</button>
            </div>

            <section id="child-growth-vaccination-agent" className="feature-block">
              <div className="cg-top-strip">
                <div className="cg-child-info">
                  <img src="child-avatar.png" alt="Child avatar" className="cg-child-avatar" />
                  <div>
                    <div className="cg-child-name">Aarav Sharma</div>
                    <div className="cg-child-meta">14 months · Male</div>
                  </div>
                </div>
                <div className="cg-status-pills">
                  <div className="cg-pill cg-pill-growth cg-pill-ok">Growth: On track</div>
                  <div className="cg-pill cg-pill-vaccine cg-pill-alert">Vaccines: 1 dose overdue</div>
                </div>
                <div className="cg-strip-actions">
                  <button className="btn-primary" onClick={openVaccinationCard}>Digital vaccination card</button>
                  <button className="btn-secondary" onClick={openGrowthUpdateForm}>Update growth & vitals</button>
                </div>
              </div>

              <div className="cg-question-bar">
                <input 
                  type="text"
                  value={cgQuestion}
                  onChange={(e) => setCgQuestion(e.target.value)}
                  placeholder="Ask about your child's growth, vaccines or feeding…"
                />
                <button className="btn-primary" onClick={submitCGQuestion}>Ask</button>
                <div className="cg-question-chips">
                  <button onClick={() => prefillCGQuestion('Is my child\'s growth normal?')}>Growth</button>
                  <button onClick={() => prefillCGQuestion('Which vaccines are next and when?')}>Vaccines</button>
                  <button onClick={() => prefillCGQuestion('What should I feed my child this week?')}>Feeding</button>
                  <button onClick={() => prefillCGQuestion('My child has fever, what should I do?')}>Illness</button>
                </div>
              </div>

              <div className="cg-nba-card">
                <h4>Next best action</h4>
                <p>{cgNBAFeedback}</p>
                <div className="cg-nba-actions">
                  <button className="btn-primary" onClick={bookVaccinationVisit}>Book vaccination visit</button>
                  <button className="btn-secondary" onClick={markDoseTaken}>I took this dose elsewhere</button>
                </div>
              </div>

              <div className="cg-grid">
                <div className="cg-panel">
                  <h3>Digital vaccination card</h3>
                  <p className="cg-panel-sub">
                    Complete, shareable record of all vaccines with due and overdue doses highlighted.
                  </p>

                  <div className="cg-vaccine-timeline">
                    <div className="cg-vaccine-row done">
                      <div>
                        <strong>BCG</strong> · At birth
                        <div className="cg-vaccine-meta">Done on 05 Jan 2025 at Seva Children's Clinic</div>
                      </div>
                      <span className="cg-tag cg-tag-done">Done</span>
                    </div>

                    <div className="cg-vaccine-row done">
                      <div>
                        <strong>DPT / Hep B / Hib (Pentavalent 1)</strong> · 6 weeks
                        <div className="cg-vaccine-meta">Done on 20 Feb 2025</div>
                      </div>
                      <span className="cg-tag cg-tag-done">Done</span>
                    </div>

                    <div className="cg-vaccine-row due">
                      <div>
                        <strong>MMR1</strong> · 9–12 months
                        <div className="cg-vaccine-meta">
                          Due by 15 Dec 2025 · <span className="cg-overdue-text">Overdue by 3 days</span>
                        </div>
                      </div>
                      <span className="cg-tag cg-tag-overdue">Overdue</span>
                    </div>

                    <div className="cg-vaccine-row upcoming">
                      <div>
                        <strong>Booster DPT</strong> · 16–24 months
                        <div className="cg-vaccine-meta">Upcoming · Expected around Aug 2026</div>
                      </div>
                      <span className="cg-tag cg-tag-upcoming">Upcoming</span>
                    </div>
                  </div>

                  <div className="cg-panel-actions">
                    <button className="btn-primary" onClick={bookVaccinationVisit}>Book vaccination visit</button>
                    <button className="btn-secondary" onClick={downloadVaccinationCard}>Download / share card (PDF/QR)</button>
                    <button className="btn-ghost" onClick={openVaccineFAQ}>Explain risk of delay</button>
                  </div>
                </div>

                <div className="cg-panel">
                  <h3>Growth risk flags</h3>
                  <p className="cg-panel-sub">
                    Automated flags from latest height, weight and head circumference with simple next steps.
                  </p>

                  <div className="cg-growth-summary">
                    <div>
                      <div className="cg-growth-metric">Weight: 8.6 kg · Weight-for-age −1.3 z (normal)</div>
                      <div className="cg-growth-metric">Length: 73 cm · Height-for-age −2.2 z (borderline stunting)</div>
                      <div className="cg-growth-metric">Head circumference: 45 cm · Normal</div>
                    </div>
                    <button className="btn-secondary" onClick={openGrowthChart}>View growth chart</button>
                  </div>

                  <div className="cg-flag-list">
                    <div className="cg-flag-item cg-flag-alert">
                      <div className="cg-flag-title">Borderline stunting</div>
                      <div className="cg-flag-text">
                        Height is a little lower than expected for age. This usually relates to long-term nutrition and illness.
                      </div>
                      <div className="cg-flag-actions">
                        <button className="btn-primary" onClick={openNutritionPlanFlow}>Create 2-week nutrition plan</button>
                        <button className="btn-secondary" onClick={talkToPaediatrician}>Talk to paediatrician</button>
                      </div>
                    </div>

                    <div className="cg-flag-item cg-flag-watch">
                      <div className="cg-flag-title">Weight trending down</div>
                      <div className="cg-flag-text">
                        Weight has dropped across one percentile band in the last 2 months. Needs watchful waiting and repeat weighing.
                      </div>
                      <div className="cg-flag-actions">
                        <button className="btn-secondary" onClick={setReweighReminder}>Set reminder to re-check in 4 weeks</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="cg-role-toggle">
                <span>View as:</span>
                <button className={`btn-chip ${cgRole === 'parent' ? 'btn-chip-active' : ''}`} onClick={() => handleSetCGRole('parent')}>Parent</button>
                <button className={`btn-chip ${cgRole === 'doctor' ? 'btn-chip-active' : ''}`} onClick={() => handleSetCGRole('doctor')}>Paediatrician</button>
              </div>

              {cgRole === 'parent' && (
                <div className="cg-role-view">
                  <h4>For parents</h4>
                  <ul className="cg-role-list">
                    <li>Understand if your child's growth is normal with simple colour-coded flags.</li>
                    <li>See exactly which vaccines are due, overdue or coming up, and get reminders.</li>
                    <li>Log illnesses, feeding patterns and milestones in one shared record.</li>
                    <li>Download a one-page summary to show at any clinic in the Seva network.</li>
                  </ul>
                </div>
              )}

              {cgRole === 'doctor' && (
                <div className="cg-role-view">
                  <h4>For paediatricians</h4>
                  <ul className="cg-role-list">
                    <li>View longitudinal growth charts, vaccine history and risk flags at a glance.</li>
                    <li>Identify high-risk children (z &lt; −3 or rapid crossing of percentiles) for proactive follow-up.</li>
                    <li>Send vernacular nudges to families about upcoming vaccine days and growth monitoring camps.</li>
                    <li>Sync structured notes to EMR with standard codes and planned follow-up dates.</li>
                  </ul>
                </div>
              )}
            </section>
          </div>
        </div>
      )}

      {/* --- WOMEN'S LIFECYCLE MODAL --- */}
      {activeModal === 'women' && (
        <div className="modal-overlay visible" onClick={() => setActiveModal(null)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Women's Health · Lifecycle Women's Care</div>
              <button className="modal-close" onClick={() => setActiveModal(null)}>&times;</button>
            </div>

            <section id="womens-lifecycle-agent" className="feature-block">
              <div className="cg-top-strip">
                <div className="cg-child-info">
                  <img src="women-avatar.png" alt="Woman avatar" className="cg-child-avatar" />
                  <div>
                    <div className="cg-child-name">Ananya Rao</div>
                    <div className="cg-child-meta">29 years · G1P0 · 18 weeks pregnant</div>
                  </div>
                </div>
                <div className="cg-status-pills">
                  <div className="cg-pill cg-pill-growth">Pregnancy · 2nd trimester</div>
                  <div className="cg-pill cg-pill-vaccine">Anaemia risk borderline</div>
                </div>
                <div className="cg-strip-actions">
                  <button className="btn-primary" onClick={openWomensJourneyPlanner}>Open journey planner</button>
                  <button className="btn-secondary" onClick={openWomensVitalsForm}>Update vitals & labs</button>
                </div>
              </div>

              <div className="cg-question-bar">
                <input 
                  type="text"
                  value={womensQuestion}
                  onChange={(e) => setWomensQuestion(e.target.value)}
                  placeholder="Ask about periods, fertility, pregnancy, postpartum or menopause"
                />
                <button className="btn-primary" onClick={submitWomensQuestion}>Ask</button>

                <div className="cg-question-chips">
                  <button onClick={() => prefillWomensQuestion('My periods are very painful. Is this normal?')}>Painful periods</button>
                  <button onClick={() => prefillWomensQuestion('We are trying to conceive. What should we check?')}>Trying to conceive</button>
                  <button onClick={() => prefillWomensQuestion('What should I monitor in 2nd trimester?')}>Pregnancy trimester</button>
                  <button onClick={() => prefillWomensQuestion('Hot flashes and sleep issues after 45. What to do?')}>Perimenopause</button>
                </div>
              </div>

              <div className="cg-nba-card">
                <h4>Next best action</h4>
                <p>{womensNBAFeedback}</p>
                <div className="cg-nba-actions">
                  <button className="btn-primary" onClick={bookWomensVisit}>Book hospital visit</button>
                  <button className="btn-secondary" onClick={logHomeReadings}>Log home BP & symptoms</button>
                </div>
              </div>

              <div className="cg-grid">
                <div className="cg-panel">
                  <h3>Adolescent & cycle health</h3>
                  <p className="cg-panel-sub">
                    Track cycles, pain and mood; screen for PCOS and anaemia with simple prompts.
                  </p>
                  <ul className="cg-role-list">
                    <li>Cycle and symptom tracker with dysmenorrhoea and flow flags.</li>
                    <li>PCOS / anaemia screening questions to decide when to see a doctor.</li>
                    <li>Body-image and mood check-ins for teens and young adults.</li>
                  </ul>
                  <div className="cg-panel-actions">
                    <button className="btn-primary" onClick={startCycleTracking}>Start cycle tracking</button>
                    <button className="btn-secondary" onClick={screenPCOS}>Screen for PCOS / anaemia</button>
                  </div>
                </div>

                <div className="cg-panel">
                  <h3>Fertility & pre-conception</h3>
                  <p className="cg-panel-sub">
                    Pre-conception checklist, fertility red flags and partner education.
                  </p>
                  <ul className="cg-role-list">
                    <li>Basic fertility questionnaire and "try at home" checklist.</li>
                    <li>Pre-conception labs and vaccination prompts.</li>
                    <li>Partner education on shared lifestyle changes.</li>
                  </ul>
                  <div className="cg-panel-actions">
                    <button className="btn-primary" onClick={openPreconceptionPlan}>Plan pregnancy journey</button>
                    <button className="btn-secondary" onClick={shareFertilityTips}>Share fertility tips</button>
                  </div>
                </div>

                <div className="cg-panel">
                  <h3>Pregnancy & postpartum</h3>
                  <p className="cg-panel-sub">
                    Trimester-wise tasks, danger-sign alerts and postpartum recovery tracking.
                  </p>
                  <ul className="cg-role-list">
                    <li>Trimester task list linked with hospital ANC plan.</li>
                    <li>Red-flag symptom prompts with "go to emergency" guidance.</li>
                    <li>Postpartum mood, lactation and wound-healing checklists.</li>
                  </ul>
                  <div className="cg-panel-actions">
                    <button className="btn-primary" onClick={openPregnancyTimeline}>View pregnancy timeline</button>
                    <button className="btn-secondary" onClick={screenPostpartumDepression}>Screen postpartum mood</button>
                  </div>
                </div>

                <div className="cg-panel">
                  <h3>Perimenopause & menopause</h3>
                  <p className="cg-panel-sub">
                    Symptom diary, cardio-metabolic and bone-health prompts, and HRT discussion support.
                  </p>
                  <ul className="cg-role-list">
                    <li>Hot-flashes, sleep and mood symptom diary.</li>
                    <li>Heart, bone and metabolic risk nudges mapped to age.</li>
                    <li>Structured questions to discuss HRT and alternatives.</li>
                  </ul>
                  <div className="cg-panel-actions">
                    <button className="btn-primary" onClick={startMenopauseDiary}>Start menopause diary</button>
                    <button className="btn-secondary" onClick={assessLongTermRisk}>Assess long-term risk</button>
                  </div>
                </div>
              </div>

              <div className="cg-role-toggle">
                <span>View as</span>
                <button className={`btn-chip ${womensRole === 'client' ? 'btn-chip-active' : ''}`} onClick={() => handleSetWomensRole('client')}>Woman / couple</button>
                <button className={`btn-chip ${womensRole === 'doctor' ? 'btn-chip-active' : ''}`} onClick={() => handleSetWomensRole('doctor')}>Clinician</button>
              </div>

              {womensRole === 'client' && (
                <div className="cg-role-view">
                  <h4>For women & couples</h4>
                  <ul className="cg-role-list">
                    <li>Understand what is normal and what needs a doctor visit, at each life stage.</li>
                    <li>Get checklists and reminders instead of scattered advice.</li>
                    <li>Carry one digital summary across clinics and tele-consults.</li>
                  </ul>
                </div>
              )}

              {womensRole === 'doctor' && (
                <div className="cg-role-view">
                  <h4>For clinicians</h4>
                  <ul className="cg-role-list">
                    <li>Structured lifecourse history: menarche to menopause in one view.</li>
                    <li>Risk-stratified prompts for PCOS, high-risk pregnancy and menopause care.</li>
                    <li>Templates that sync to EMR and structured registries.</li>
                  </ul>
                </div>
              )}
            </section>
          </div>
        </div>
      )}

      {/* --- BONE HEALTH MODAL --- */}
      {activeModal === 'bone' && (
        <div className="modal-overlay visible" onClick={() => setActiveModal(null)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Ortho & Bone · Bone Health & Rehab</div>
              <button className="modal-close" onClick={() => setActiveModal(null)}>&times;</button>
            </div>

            <section id="bone-health-agent" className="feature-block">
              <div className="cg-top-strip">
                <div className="cg-child-info">
                  <img src="bone-avatar.png" alt="Patient avatar" className="cg-child-avatar" />
                  <div>
                    <div className="cg-child-name">Suresh Patel</div>
                    <div className="cg-child-meta">68 years · Post hip-replacement · Week 3</div>
                  </div>
                </div>
                <div className="cg-status-pills">
                  <div className="cg-pill cg-pill-growth">Rehab · Week 3 of 12</div>
                  <div className="cg-pill cg-pill-vaccine">Fall-risk: High · Home support needed</div>
                </div>
                <div className="cg-strip-actions">
                  <button className="btn-primary" onClick={openRehabPlan}>Open rehab plan</button>
                  <button className="btn-secondary" onClick={openBoneVitalsForm}>Update pain & mobility</button>
                </div>
              </div>

              <div className="cg-question-bar">
                <input 
                  type="text"
                  value={boneQuestion}
                  onChange={(e) => setBoneQuestion(e.target.value)}
                  placeholder="Ask about fractures, joint replacement, osteoporosis or rehab"
                />
                <button className="btn-primary" onClick={submitBoneQuestion}>Ask</button>

                <div className="cg-question-chips">
                  <button onClick={() => prefillBoneQuestion('How much should I walk after hip replacement?')}>Walking after surgery</button>
                  <button onClick={() => prefillBoneQuestion('My parent keeps falling at home. What should we change?')}>Falls at home</button>
                  <button onClick={() => prefillBoneQuestion('I have knee pain. Do I need surgery now?')}>Knee pain & surgery</button>
                  <button onClick={() => prefillBoneQuestion('How do I prevent osteoporosis as I age?')}>Prevent osteoporosis</button>
                </div>
              </div>

              <div className="cg-nba-card">
                <h4>Next best action</h4>
                <p>{boneNBAFeedback}</p>
                <div className="cg-nba-actions">
                  <button className="btn-primary" onClick={bookRehabVisit}>Book rehab review</button>
                  <button className="btn-secondary" onClick={logHomeExercises}>Log home exercises</button>
                </div>
              </div>

              <div className="cg-grid">
                <div className="cg-panel">
                  <h3>Fracture & acute ortho</h3>
                  <p className="cg-panel-sub">
                    From emergency stabilisation to first follow-up, with clear do's and don'ts for home.
                  </p>
                  <ul className="cg-role-list">
                    <li>Checklists for plaster/splint care and red-flag symptoms.</li>
                    <li>Weight-bearing and movement guidance per fracture type.</li>
                    <li>Reminders for first X-ray / clinic review after discharge.</li>
                  </ul>
                  <div className="cg-panel-actions">
                    <button className="btn-primary" onClick={openFractureChecklist}>Open fracture checklist</button>
                    <button className="btn-secondary" onClick={sendAcuteCareTips}>Send home-care tips</button>
                  </div>
                </div>

                <div className="cg-panel">
                  <h3>Joint-replacement rehab</h3>
                  <p className="cg-panel-sub">
                    Phase-wise exercises, pain tracking and gait goals after knee / hip replacement.
                  </p>
                  <ul className="cg-role-list">
                    <li>Daily and weekly exercise plan with videos / illustrations.</li>
                    <li>Pain, swelling and range-of-motion logs for each phase.</li>
                    <li>Escalation rules if recovery is slower than expected.</li>
                  </ul>
                  <div className="cg-panel-actions">
                    <button className="btn-primary" onClick={openJointRehabPlan}>View rehab phases</button>
                    <button className="btn-secondary" onClick={trackJointProgress}>Track progress</button>
                  </div>
                </div>

                <div className="cg-panel">
                  <h3>Osteoporosis & falls</h3>
                  <p className="cg-panel-sub">
                    Risk scoring, bone-health nudges and home fall-proofing for elders.
                  </p>
                  <ul className="cg-role-list">
                    <li>Osteoporosis risk assessment and screening reminders.</li>
                    <li>Medication, calcium/vitamin D and exercise prompts.</li>
                    <li>Room-by-room home safety and assistive-device checklist.</li>
                  </ul>
                  <div className="cg-panel-actions">
                    <button className="btn-primary" onClick={runOsteoporosisRisk}>Check bone-health risk</button>
                    <button className="btn-secondary" onClick={openFallChecklist}>Make home fall-safe</button>
                  </div>
                </div>

                <div className="cg-panel">
                  <h3>Chronic joint & spine</h3>
                  <p className="cg-panel-sub">
                    Long-term knee, back and neck pain pathways with flare-up rules.
                  </p>
                  <ul className="cg-role-list">
                    <li>Baseline functional score and pain diary.</li>
                    <li>Exercise and posture modules tailored to daily routine.</li>
                    <li>When to escalate from conservative care to specialist review.</li>
                  </ul>
                  <div className="cg-panel-actions">
                    <button className="btn-primary" onClick={startPainDiary}>Start pain diary</button>
                    <button className="btn-secondary" onClick={openSpineExercisePlan}>View spine & joint plan</button>
                  </div>
                </div>
              </div>

              <div className="cg-role-toggle">
                <span>View as</span>
                <button className={`btn-chip ${boneRole === 'patient' ? 'btn-chip-active' : ''}`} onClick={() => handleSetBoneRole('patient')}>Patient / caregiver</button>
                <button className={`btn-chip ${boneRole === 'doctor' ? 'btn-chip-active' : ''}`} onClick={() => handleSetBoneRole('doctor')}>Ortho / rehab team</button>
              </div>

              {boneRole === 'patient' && (
                <div className="cg-role-view">
                  <h4>For patients & families</h4>
                  <ul className="cg-role-list">
                    <li>Know exactly what to do each week after injury or surgery.</li>
                    <li>Get reminders for exercises, medications and follow-up visits.</li>
                    <li>Share one structured summary with every clinic you visit.</li>
                  </ul>
                </div>
              )}

              {boneRole === 'doctor' && (
                <div className="cg-role-view">
                  <h4>For ortho & rehab teams</h4>
                  <ul className="cg-role-list">
                    <li>Standardised fracture and joint-replacement protocols.</li>
                    <li>Adherence and outcome tracking across home-based rehab.</li>
                    <li>Flags for high-risk elders needing extra fall-prevention support.</li>
                  </ul>
                </div>
              )}
            </section>
          </div>
        </div>
      )}

      {/* --- ONCOLOGY / CANCER / CARDIO / NEURO MODAL --- */}
      {activeModal === 'oncology' && (
        <div className="modal-overlay visible" onClick={() => setActiveModal(null)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Cancer, Cardiac & Neuro Integrated Registry</div>
              <button className="modal-close" onClick={() => setActiveModal(null)}>&times;</button>
            </div>

            <div className="modal-body">
              <section id="cancer-cardio-neuro-agent" className="feature-block">
                <div className="cg-top-strip">
                  <div className="cg-child-info">
                    <img src="onc-avatar.png" alt="Woman avatar" className="cg-child-avatar" />
                    <div>
                      <div className="cg-child-name">Sunita Menon</div>
                      <div className="cg-child-meta">52 years · Breast cancer survivor · Year 3 follow-up</div>
                    </div>
                  </div>
                  <div className="cg-status-pills">
                    <div className="cg-pill cg-pill-growth">Oncology registry: Active follow-up</div>
                    <div className="cg-pill cg-pill-vaccine">Cardio-metabolic risk: Moderate</div>
                  </div>
                  <div className="cg-strip-actions">
                    <button className="btn-primary" onClick={openOncRegistrySummary}>Open oncology registry summary</button>
                    <button className="btn-secondary" onClick={openOncVisitPlanner}>Plan next visits & tests</button>
                  </div>
                </div>

                <div className="cg-question-bar">
                  <input 
                    type="text"
                    value={oncQuestion}
                    onChange={(e) => setOncQuestion(e.target.value)}
                    placeholder="Ask about specific cancers, heart, or brain health in women"
                  />
                  <button className="btn-primary" onClick={submitOncQuestion}>Ask</button>

                  <div className="cg-question-chips">
                    <button onClick={() => prefillOncQuestion('What follow-up tests do I need after breast cancer treatment?')}>Breast follow-up</button>
                    <button onClick={() => prefillOncQuestion('How often should I be screened for cervical cancer?')}>Cervical screening</button>
                    <button onClick={() => prefillOncQuestion('I had chemo. How do I monitor my heart?')}>Cardio-oncology</button>
                    <button onClick={() => prefillOncQuestion('What stroke warning signs are different in women?')}>Neuro red flags</button>
                  </div>
                </div>

                <div className="cg-role-toggle" id="onc-domain-tabs">
                  <span>Focus</span>
                  <button className={`btn-chip ${oncDomain === 'cancer' ? 'btn-chip-active' : ''}`} onClick={() => handleSetOncDomain('cancer')}>Cancers</button>
                  <button className={`btn-chip ${oncDomain === 'cardio' ? 'btn-chip-active' : ''}`} onClick={() => handleSetOncDomain('cardio')}>Cardio</button>
                  <button className={`btn-chip ${oncDomain === 'neuro' ? 'btn-chip-active' : ''}`} onClick={() => handleSetOncDomain('neuro')}>Neuro</button>
                </div>

                <div className="cg-nba-card">
                  <h4>Next best action</h4>
                  <p>{oncNBAFeedback}</p>
                  <div className="cg-nba-actions">
                    <button className="btn-primary" onClick={openOncChecklist}>Open combined checklist</button>
                    <button className="btn-secondary" onClick={downloadOncSummary}>Download / share summary</button>
                  </div>
                </div>

                {/* CANCER TAB */}
                {oncDomain === 'cancer' && (
                  <div className="onc-domain-view">
                    <div className="cg-grid">
                      <div className="cg-panel">
                        <h3>Breast cancer</h3>
                        <p className="cg-panel-sub">
                          Screening, structured staging, treatment timeline and survivorship tracking for women.
                        </p>
                        <ul className="cg-role-list">
                          <li>Risk- and age-based mammography/USG prompts with due/overdue flags and SMS reminders.</li>
                          <li>Structured capture of tumour size, nodes, metastasis and receptor status (ER/PR/HER2) for registry reporting.</li>
                          <li>Treatment timeline (surgery, chemo, radiation, endocrine therapy) with late-effect and recurrence checklists.</li>
                          <li>Survivorship plan covering lymphedema, fertility, bone health and mental health follow-up.</li>
                        </ul>
                        <div className="cg-panel-actions">
                          <button className="btn-primary" onClick={openBreastPathway}>Open breast cancer pathway</button>
                          <button className="btn-secondary" onClick={recordBreastMilestone}>Record treatment / follow-up event</button>
                        </div>
                      </div>

                      <div className="cg-panel">
                        <h3>Cervical cancer</h3>
                        <p className="cg-panel-sub">
                          HPV/Pap screening registry, precancer tracking and post-treatment surveillance.
                        </p>
                        <ul className="cg-role-list">
                          <li>HPV and Pap test registry with due/overdue flags and recall reminders.</li>
                          <li>Colposcopy and biopsy results structured for staging and treatment pathways.</li>
                          <li>Long-term surveillance calendar (pelvic exams, cytology, HPV tests) with adherence tracking.</li>
                        </ul>
                        <div className="cg-panel-actions">
                          <button className="btn-primary" onClick={openCervicalScreening}>Plan cervical screening</button>
                          <button className="btn-secondary" onClick={logCervicalResult}>Log HPV / Pap / biopsy result</button>
                        </div>
                      </div>

                      <div className="cg-panel">
                        <h3>Ovarian cancer</h3>
                        <p className="cg-panel-sub">
                          Symptom diary, genetic risk flags and high-risk follow-up for women.
                        </p>
                        <ul className="cg-role-list">
                          <li>Family history and genetic-risk prompts (BRCA, Lynch) with counselling and testing flags.</li>
                          <li>Non-specific symptom diary (bloating, pain, appetite, urinary changes) linked to escalation rules.</li>
                          <li>Post-surgery and chemo follow-up with CA-125, imaging schedules and recurrence alerts.</li>
                        </ul>
                        <div className="cg-panel-actions">
                          <button className="btn-primary" onClick={openOvarianRiskFlow}>Assess ovarian cancer risk</button>
                          <button className="btn-secondary" onClick={logOvarianSymptoms}>Log ovarian symptoms & markers</button>
                        </div>
                      </div>

                      <div className="cg-panel">
                        <h3>Uterine (endometrial) cancer</h3>
                        <p className="cg-panel-sub">
                          Abnormal bleeding prompts, metabolic risk factors and survivorship plans.
                        </p>
                        <ul className="cg-role-list">
                          <li>Abnormal-bleeding symptom checker with "urgent vs routine" visit guidance.</li>
                          <li>Obesity, diabetes and hormone-therapy risk capture for registry analytics and prevention.</li>
                          <li>Post-treatment follow-up (pelvic exams, imaging) with adherence and recurrence tracking.</li>
                        </ul>
                        <div className="cg-panel-actions">
                          <button className="btn-primary" onClick={openEndometrialFlow}>Check abnormal bleeding</button>
                          <button className="btn-secondary" onClick={openEndometrialSurvivorship}>View endometrial survivorship plan</button>
                        </div>
                      </div>

                      <div className="cg-panel">
                        <h3>Vaginal & vulvar cancers</h3>
                        <p className="cg-panel-sub">
                          Symptom prompts, HPV linkage and sensitive survivorship support for intimate cancers.
                        </p>
                        <ul className="cg-role-list">
                          <li>Symptom prompts (itching, pain, lesions, bleeding, discharge) with privacy-sensitive language.</li>
                          <li>Links to HPV status and lower-genital-tract disease history in the registry.</li>
                          <li>Post-treatment exams, sexual-health, body-image and pain-management support tracking.</li>
                        </ul>
                        <div className="cg-panel-actions">
                          <button className="btn-primary" onClick={openVaginalVulvarFlow}>Document symptoms & exams</button>
                          <button className="btn-secondary" onClick={openIntimacySupport}>Open intimacy & psychosocial support</button>
                        </div>
                      </div>

                      <div className="cg-panel">
                        <h3>Fallopian tube & other gyn cancers</h3>
                        <p className="cg-panel-sub">
                          Rare gynaecological cancers recorded with clear referral and trial-matching options.
                        </p>
                        <ul className="cg-role-list">
                          <li>Structured staging and histology capture for rare gyn cancers.</li>
                          <li>Genetic-risk and family-screening prompts for relatives.</li>
                          <li>Referral, trial-matching and tumour-board case summaries exported from registry.</li>
                        </ul>
                        <div className="cg-panel-actions">
                          <button className="btn-primary" onClick={openRareGynRegistry}>Open rare-cancer registry card</button>
                          <button className="btn-secondary" onClick={shareTumorBoardSummary}>Share tumour-board summary</button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* CARDIO TAB */}
                {oncDomain === 'cardio' && (
                  <div className="onc-domain-view">
                    <div className="cg-grid">
                      <div className="cg-panel">
                        <h3>Cardio-oncology in women</h3>
                        <p className="cg-panel-sub">
                          Heart-risk tracking for women on or after chemo, radiation or hormone therapy.
                        </p>
                        <ul className="cg-role-list">
                          <li>Baseline and on-treatment BP, lipids, echo and ECG registry for at-risk women.</li>
                          <li>Chemo agents and chest-radiation fields mapped to cardiotoxicity risk and monitoring intervals.</li>
                          <li>Alerts when tests are overdue or symptoms (dyspnoea, chest pain, palpitations) are logged.</li>
                        </ul>
                        <div className="cg-panel-actions">
                          <button className="btn-primary" onClick={openCardioOncFlow}>Start cardio-oncology tracking</button>
                          <button className="btn-secondary" onClick={logCardioTest}>Log echo / ECG / BP result</button>
                        </div>
                      </div>

                      <div className="cg-panel">
                        <h3>Heart-disease pathways in women</h3>
                        <p className="cg-panel-sub">
                          Sex-specific risk factors, atypical symptoms and rehab for women.
                        </p>
                        <ul className="cg-role-list">
                          <li>Risk scoring that includes pregnancy-related and autoimmune factors specific to women.</li>
                          <li>Symptom diary with women-specific heart-attack presentations (fatigue, breathlessness, jaw/back pain).</li>
                          <li>Post-MI/PCI rehab tracking, medication adherence and lifestyle changes with nudges.</li>
                        </ul>
                        <div className="cg-panel-actions">
                          <button className="btn-primary" onClick={openWomenHeartRisk}>Check heart risk in women</button>
                          <button className="btn-secondary" onClick={openCardiacRehabPlan}>Open cardiac rehab plan</button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* NEURO TAB */}
                {oncDomain === 'neuro' && (
                  <div className="onc-domain-view">
                    <div className="cg-grid">
                      <div className="cg-panel">
                        <h3>Stroke & neurovascular in women</h3>
                        <p className="cg-panel-sub">
                          Stroke risk, pregnancy-related factors and sex-specific warning signs.
                        </p>
                        <ul className="cg-role-list">
                          <li>Stroke-risk profile including pregnancy, migraine with aura, HRT and AFib.</li>
                          <li>Women-specific early warning signs education and F.A.S.T-style prompts adapted for women.</li>
                          <li>Post-stroke rehab steps and cognitive/emotional-health follow-up planner.</li>
                        </ul>
                        <div className="cg-panel-actions">
                          <button className="btn-primary" onClick={openStrokeRiskFlow}>Check stroke risk</button>
                          <button className="btn-secondary" onClick={openNeuroRehabPlan}>Open neuro-rehab plan</button>
                        </div>
                      </div>

                      <div className="cg-panel">
                        <h3>Brain health & survivorship</h3>
                        <p className="cg-panel-sub">
                          Cognitive, mood and seizure tracking for women living with or beyond cancer.
                        </p>
                        <ul className="cg-role-list">
                          <li>Cognitive and memory check-ins during and after chemo/radiation.</li>
                          <li>Mood and seizure diaries with escalation and referral triggers.</li>
                          <li>Return-to-work, driving and caregiving readiness prompts.</li>
                        </ul>
                        <div className="cg-panel-actions">
                          <button className="btn-primary" onClick={startBrainHealthDiary}>Start brain-health diary</button>
                          <button className="btn-secondary" onClick={shareNeuroSummary}>Share neuro summary</button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </section>
            </div>
          </div>
        </div>
      
      )}

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <div className="footer-dot"></div>
            <span>Seva Health Network · Built for India's families and health systems</span>
          </div>
          <div className="footer-links">
            <a>Product overview</a>
            <a>Partner with us</a>
            <a>Privacy & data security</a>
          </div>
        </div>
      </footer>
    </div>
  );
};


export default WomenChildPage2;
                

      
