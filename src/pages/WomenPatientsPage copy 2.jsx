import React, { useState } from "react";
import chatConfig from "../data/womenchatbot.json";
import patientData from "../data/womenpatients.json";

import "../styles/womenpatients.css";
import gynaeImg from "../images/gynaeo.png";
import wmHealthImg from "../images/wmhealthpic.png";

export default function WomenPatients() {
  // 1. State management for Tabs and Modals
  const [activeTab, setActiveTab] = useState("pt-health-conditions");
  const [language, setLanguage] = useState("en"); // en, hi, kn, bn


  const aiAssistantConfig = {
  title: "AI Women’s Health Assistant",
  subtitle: "Ask private questions about periods, fertility, pregnancy, menopause and more.",
  bulletPoints: [
    "24×7 confidential answers trained on reputable women’s health sources.",
    "Helps you understand symptoms, screening tests and next steps.",
    "Not a replacement for a doctor – gives safe, triage-style guidance."
  ],
  disclaimer:
    "This assistant does not provide a diagnosis, treatment or prescription. Always consult a qualified clinician for medical decisions."
};

  // ADD THE LOG HERE:
  console.log("Detailed Data:", patientData.healthConditionsDetailed);


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCondition, setSelectedCondition] = useState(null);

  // NEW: search bar state
  const [searchQuery, setSearchQuery] = useState(""); // NEW

  const getAssistantGreeting = () => {
  switch (language) {
    case "hi":
      return {
        title: "🌸 Health Assistant:",
        text:
          "नमस्कार! मैं आपकी महिला स्वास्थ्य सहायक हूँ। आज मैं आपकी किस तरह मदद कर सकती हूँ?\n\n" +
          "आप किस प्रकार की स्वास्थ्य समस्या के बारे में बात करना चाहेंगी?"
      };
    case "bn":
      return {
        title: "🌸 Health Assistant:",
        text:
          "নমস্কার! আমি আপনার নারী স্বাস্থ্য সহায়ক। আজ আপনাকে কীভাবে সাহায্য করতে পারি?\n\n" +
          "আপনি কোন ধরনের স্বাস্থ্য সমস্যা নিয়ে কথা বলতে চান?"
      };
    case "kn":
      return {
        title: "🌸 Health Assistant:",
        text:
          "ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ ಮಹಿಳಾ ಆರೋಗ್ಯ ಸಹಾಯಕ. ಇಂದು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?\n\n" +
          "ನೀವು ಯಾವ ರೀತಿಯ ಆರೋಗ್ಯ ಸಮಸ್ಯೆ ಬಗ್ಗೆ ಮಾತನಾಡಲು ಬಯಸುತ್ತೀರಿ?"
      };
    case "en":
    default:
      return {
        title: "🌸 Health Assistant:",
        text:
          "Hello! I'm your women's health assistant. How can I help you today?\n\n" +
          "What kind of health concern would you like to talk about?"
      };
  }
};

const assistantGreeting = getAssistantGreeting();

  // NEW: search submit handler
  const handleSearchSubmit = (e) => { // NEW
    e.preventDefault();               // NEW
    // For now, just log; you can later hook this to filter conditions/doctors. // NEW
    console.log("Patients page searching for:", searchQuery); // NEW
  }; // NEW


  // 2. Handlers
  const handleOpenModal = (condition) => {
    setSelectedCondition(condition);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCondition(null);
  };

// at top of component, after other hooks
const [selectedCity, setSelectedCity] = useState("Delhi");
const doctorCities = Object.keys(patientData.doctorsData || {});

const normalizedQuery = searchQuery.trim().toLowerCase();

// Summary health conditions (top tab)
const filteredHealthSummaries =
  !normalizedQuery
    ? patientData.healthConditions || []
    : (patientData.healthConditions || []).filter((condition) => {
        const name = (condition.name || condition.title || "").toLowerCase();
        const category = (condition.category || "").toLowerCase();
        const desc = (
          condition.shortDescription ||
          condition.description ||
          ""
        ).toLowerCase();

        return (
          name.includes(normalizedQuery) ||
          category.includes(normalizedQuery) ||
          desc.includes(normalizedQuery)
        );
      });

  const filteredHealthConditions =
    !normalizedQuery
      ? patientData.healthConditionsDetailed || []
      : (patientData.healthConditionsDetailed || []).filter((condition) => {
          const name = (condition.name || "").toLowerCase();
          const category = (condition.category || "").toLowerCase();
          const symptoms = Array.isArray(condition.symptoms)
            ? condition.symptoms.join(" ").toLowerCase()
            : "";
          const description = (
            condition.longDescription ||
            condition.description ||
            condition.shortDescription ||
            ""
          ).toLowerCase();

          return (
            name.includes(normalizedQuery) ||
            category.includes(normalizedQuery) ||
            symptoms.includes(normalizedQuery) ||
            description.includes(normalizedQuery)
          );
        });

      // 2) "When to see gynecologist" summary cards
    const filteredWhenToSee =
      !normalizedQuery
        ? patientData.whenToSeeGynecologist || []
        : (patientData.whenToSeeGynecologist || []).filter((block) => {
            const title = (block.title || "").toLowerCase();
            const items = Array.isArray(block.items)
              ? block.items.join(" ").toLowerCase()
              : "";
            return (
              title.includes(normalizedQuery) ||
              items.includes(normalizedQuery)
            );
          });

  // 3) Doctors (filter by name, hospital, city, specialization)
  const allDoctorsEntries = Object.entries(patientData.doctorsData || {});
  const filteredDoctorsByCity = allDoctorsEntries.reduce(
    (acc, [city, doctors]) => {
      const list = Array.isArray(doctors) ? doctors : [];
      acc[city] = !normalizedQuery
        ? list
        : list.filter((doc) => {
            const name = (doc.name || "").toLowerCase();
            const hospital = (doc.hospital || "").toLowerCase();
            const address = (doc.address || "").toLowerCase();
            const specs = Array.isArray(doc.specializations)
              ? doc.specializations.join(" ").toLowerCase()
              : "";
            return (
              name.includes(normalizedQuery) ||
              hospital.includes(normalizedQuery) ||
              address.includes(normalizedQuery) ||
              specs.includes(normalizedQuery) ||
              city.toLowerCase().includes(normalizedQuery)
            );
          });
      return acc;
    },
    {}
  );

//4 AFTER filteredGovernmentInitiatives, BEFORE return
const filteredFindGynecologist =
  !normalizedQuery
    ? patientData.findGynecologist || []
    : (patientData.findGynecologist || []).filter((card) => {
        const title = (card.title || "").toLowerCase();
        const desc = (card.description || "").toLowerCase();
        const items = Array.isArray(card.items)
          ? card.items.join(" ").toLowerCase()
          : "";
        return (
          title.includes(normalizedQuery) ||
          desc.includes(normalizedQuery) ||
          items.includes(normalizedQuery)
        );
      });


// 5)
const filteredPreventionCare =
  !normalizedQuery
    ? patientData.preventionCare || []
    : (patientData.preventionCare || []).filter((card) => {
        const title = (card.title || "").toLowerCase();
        const desc = (card.description || "").toLowerCase();
        const items = Array.isArray(card.items)
          ? card.items.join(" ").toLowerCase()
          : "";
        return (
          title.includes(normalizedQuery) ||
          desc.includes(normalizedQuery) ||
          items.includes(normalizedQuery)
        );
      });

const filteredPreventionCareQA =
  !normalizedQuery
    ? patientData.preventionCareQA || []
    : (patientData.preventionCareQA || []).filter((item) => {
        const headline = (item.headline || "").toLowerCase();
        const text = (item.text || "").toLowerCase();
        return (
          headline.includes(normalizedQuery) ||
          text.includes(normalizedQuery)
        );
      });


// 6) Government initiatives / district programs (optional)
const filteredGovernmentInitiatives =
  !normalizedQuery
    ? patientData.governmentInitiatives || []
    : (patientData.governmentInitiatives || []).filter((card) => {
        const title = (card.title || "").toLowerCase();
        const desc = (card.description || "").toLowerCase();
        const items = Array.isArray(card.items)
          ? card.items.join(" ").toLowerCase()
          : "";
        return (
          title.includes(normalizedQuery) ||
          desc.includes(normalizedQuery) ||
          items.includes(normalizedQuery)
        );
      });



  //7) District programs (sidebar + blocks)
  const allDistrictItems = patientData.districtPrograms?.items || [];
  const filteredDistrictItems =
  !normalizedQuery
    ? allDistrictItems
    : allDistrictItems.filter((item) => {
        const district = (item.district || "").toLowerCase();
        const centers = Array.isArray(item.centers)
          ? item.centers.join(" ").toLowerCase()
          : "";
        return (
          district.includes(normalizedQuery) ||
          centers.includes(normalizedQuery)
        );
      });

      // Wellness For Her – Packages
      const filteredWellnessPackages =
        !normalizedQuery
          ? patientData.wellnessForHer?.packages || []
          : (patientData.wellnessForHer?.packages || []).filter((pkg) => {
              const title = (pkg.title || "").toLowerCase();
              const subtitle = (pkg.subtitle || "").toLowerCase();
              const city = (pkg.city || "").toLowerCase();
              const details = Array.isArray(pkg.details)
                ? pkg.details.join(" ").toLowerCase()
                : "";

              return (
                title.includes(normalizedQuery) ||
                subtitle.includes(normalizedQuery) ||
                city.includes(normalizedQuery) ||
                details.includes(normalizedQuery)
              );
            });


      // Wellness For Her – Schools
      const filteredWellnessSchools =
        !normalizedQuery
          ? patientData.wellnessForHer?.schools || []
          : (patientData.wellnessForHer?.schools || []).filter((s) => {
              const name = (s.name || "").toLowerCase();
              const location = (s.location || "").toLowerCase();
              const highlights = Array.isArray(s.highlights)
                ? s.highlights.join(" ").toLowerCase()
                : "";
              return (
                name.includes(normalizedQuery) ||
                location.includes(normalizedQuery) ||
                highlights.includes(normalizedQuery)
              );
            });

      // FAQs – filter by question or answer
      const filteredFaqs =
        !normalizedQuery
          ? patientData.faqs || []
          : (patientData.faqs || []).filter((faq) => {
              const q = (faq.question || "").toLowerCase();
              const a = (faq.answer || "").toLowerCase();
              return q.includes(normalizedQuery) || a.includes(normalizedQuery);
            });

      // Wellness For Her – Colleges
      const filteredWellnessColleges =
        !normalizedQuery
          ? patientData.wellnessForHer?.colleges || []
          : (patientData.wellnessForHer?.colleges || []).filter((c) => {
              const name = (c.name || "").toLowerCase();
              const location = (c.location || "").toLowerCase();
              const highlights = Array.isArray(c.highlights)
                ? c.highlights.join(" ").toLowerCase()
                : "";
              return (
                name.includes(normalizedQuery) ||
                location.includes(normalizedQuery) ||
                highlights.includes(normalizedQuery)
              );
            });

      const filteredWellnessCorporate =
      !normalizedQuery
        ? patientData.wellnessForHer?.corporateWellnessPartners || []
        : (patientData.wellnessForHer?.corporateWellnessPartners || []).filter(
            (corp) => {
              const name = (corp.name || "").toLowerCase();
              const tagline = (corp.tagline || "").toLowerCase();
              const location = (corp.location || "").toLowerCase();
              const focus = (corp.focus || "").toLowerCase();
              const services = Array.isArray(corp.services)
                ? corp.services.join(" ").toLowerCase()
                : "";
              const features = Array.isArray(corp.features)
                ? corp.features.join(" ").toLowerCase()
                : "";
              const impact = Array.isArray(corp.impact)
                ? corp.impact.join(" ").toLowerCase()
                : "";
              const programs = Array.isArray(corp.programs)
                ? corp.programs.join(" ").toLowerCase()
                : "";

              return (
                name.includes(normalizedQuery) ||
                tagline.includes(normalizedQuery) ||
                location.includes(normalizedQuery) ||
                focus.includes(normalizedQuery) ||
                services.includes(normalizedQuery) ||
                features.includes(normalizedQuery) ||
                impact.includes(normalizedQuery) ||
                programs.includes(normalizedQuery)
              );
            }
          );

  return (
    <div className="page">

{/* Brand strip ABOVE hero */}
<header className="ns-top-strip">
  <div className="top-bar-inner">
    <div className="brand-block">
      <div className="brand-logo">N</div>
      <div className="brand-text">
        <div className="brand-title">Nari Gyan Kendra</div>
        <div className="brand-subtitle">Women’s health information and awareness
        </div>
      </div>
    </div>
 


    {/* RIGHT: language selector */}
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

{/* PAGE HERO + SEARCH */}
<div className="patient-hero">
  {/* Left image */}
  <div className="patient-hero-image patient-hero-image-left">
    <img src={gynaeImg} alt="Gynecology care illustration" />
  </div>

  {/* Center: title, mission, search, patient blurb */}
  <div className="patient-hero-main">
    <h1 className="patient-hero-title">Women’s Health Navigator</h1>

    <p className="patient-hero-mission">
      Transforming Indian women&apos;s health through accessible education and
      empowered healthcare decisions—one woman, one community at a time, to
      empower <span>700+ million</span> Indian women towards healthier,
      informed futures.
    </p>

    <form className="patient-search-bar" onSubmit={handleSearchSubmit}>
      <input
        type="text"
        className="search-input"
        placeholder="Search by symptom, condition, life stage, or city..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button type="submit" className="nav-button">
        Search
      </button>
    </form>

    <p className="patient-hero-subtext">
      <strong>For Patients:</strong> Search from the information given below in the tabs.
    </p>
    <span style={{ color: "var(--text-soft)", fontSize: "0.68rem" }}>
      You can search above by symptom (e.g. “heavy menstrual bleeding”),
      condition name, life stage, city, or doctor / hospital.
    </span>
  </div>

  {/* Right image */}
  <div className="patient-hero-image patient-hero-image-right">
    <img src={wmHealthImg} alt="Women&apos;s health empowerment" />
  </div>
</div>
    


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
          { id: "pt-health-conditions",        label: "Health Conditions" },
          { id: "pt-health-conditions-detailed", label: "Conditions (Detailed)" },
          { id: "pt-when-see-gyn",            label: "When to See a Gynecologist" },
          { id: "pt-find-gyn",                label: "Find a Gynecologist" },
          { id: "pt-prevention-care",         label: "Prevention & Care" },
          { id: "pt-doctors",                 label: "Doctors Directory" },
          { id: "pt-govt-initiatives",        label: "Government Initiatives" },
          { id: "pt-wellness-packages",       label: "Wellness Packages" },
          { id: "pt-wellness-education",      label: "Schools & Colleges" },
          { id: "pt-wellness-corporate",      label: "Corporate Wellness" },
          { id: "pt-ai-assistant",            label: "AI Health Assistant" },
          { id: "pt-faq",                     label: "FAQs" },
        ].map((tab) => (
          <button
            key={tab.id}
            className={`patient-tab ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}

        {/* Optional: show city selector only on doctors tab */}
        {activeTab === "pt-doctors" && doctorCities.length > 0 && (
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            style={{ marginLeft: "1rem" }}
          >
            {doctorCities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* TAB CONTENT PANELS */}
<div className="tab-content-container">
  {/* HEALTH CONDITIONS TAB */}
  {activeTab === "pt-health-conditions" && (
    <div className="patient-tab-panel active">
      <div className="patient-grid">
        {filteredHealthSummaries.length === 0 ? (
          <p>No matching health conditions found.</p>
        ) : (
          filteredHealthSummaries.map((condition, index) => (
            <article className="patient-card" key={index}>
              <h3>{condition.name || condition.title}</h3>
              {condition.category && (
                <p className="patient-card-category">
                  {condition.category}
                </p>
              )}
              <p className="patient-card-snippet">
                {condition.shortDescription || condition.description}
              </p>
              <button
                className="nav-button"
                style={{ marginTop: "10px" }}
                onClick={() => handleOpenModal(condition)}
              >
                <span className="icon">➜</span> Learn symptoms, tests & treatment
              </button>
            </article>
          ))
        )}
      </div>
    </div>
      )}


        {activeTab === "pt-health-conditions-detailed" && (
        <div className="patient-tab-panel active">
          <div className="patient-grid">
            {filteredHealthConditions.length === 0 ? (
              <p style={{ color: "var(--muted)", padding: "0.75rem" }}>
                No conditions found for “{searchQuery}”. Try another symptom, disease
                name, or body area.
              </p>
            ) : (
              filteredHealthConditions.map((condition, index) => (
               <article className="patient-card" key={index}>
                  {/* Name + category */}
                  <h3>{condition.name}</h3>
                  {condition.category && (
                    <p className="patient-card-category">{condition.category}</p>
                  )}

                  {/* 2–3 symptoms */}
                  {Array.isArray(condition.symptoms) && condition.symptoms.length > 0 && (
                    <>
                      <h4>Key symptoms</h4>
                      <ul>
                        {condition.symptoms.slice(0, 3).map((symptom, i) => (
                          <li key={i}>{symptom}</li>
                        ))}
                        {condition.symptoms.length > 3 && <li>…</li>}
                      </ul>
                    </>
                  )}

                  {/* 2–3 causes */}
                  {Array.isArray(condition.causes) && condition.causes.length > 0 && (
                    <>
                      <h4>Key causes</h4>
                      <ul>
                        {condition.causes.slice(0, 3).map((cause, i) => (
                          <li key={i}>{cause}</li>
                        ))}
                        {condition.causes.length > 3 && <li>…</li>}
                      </ul>
                    </>
                  )}

                  {/* 2–3 treatments */}
                  {Array.isArray(condition.treatment) && condition.treatment.length > 0 && (
                    <>
                      <h4>Treatment options</h4>
                      <ul>
                        {condition.treatment.slice(0, 3).map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                        {condition.treatment.length > 3 && <li>…</li>}
                      </ul>
                    </>
                  )}

                  {/* Citation */}
                  {condition.citation && (
                    <p className="patient-card-citation" style={{ marginTop: "8px" }}>
                      <strong>Research:</strong> {condition.citation}
                    </p>
                  )}
                <button
                  className="nav-button"
                  style={{ marginTop: "10px" }}
                  onClick={() => handleOpenModal(condition)}
                >
                  <span className="icon">➜</span> View full details
                </button>
              </article>
            ))
            )}
          </div>
        </div>
      )}

       {/* WHEN TO SEE GYNECOLOGIST TAB */}
      {activeTab === "pt-when-see-gyn" && (
        <div className="patient-tab-panel active">
          <div className="patient-grid">
            {filteredWhenToSee.length === 0 ? (
              <p style={{ color: "var(--muted)", padding: "0.75rem" }}>
                No matching reasons found for “{searchQuery}”.
              </p>
            ) : (
              filteredWhenToSee.map((card, index) => (
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
              ))
            )}
          </div>
        </div>
      )}

       {/* FIND GYNECOLOGIST – GUIDANCE TAB */}
        {activeTab === "pt-find-gyn" && (
          <div className="patient-tab-panel active">
            <div className="patient-two-column">
              {filteredFindGynecologist.length === 0 ? (
                <p style={{ color: "var(--muted)", padding: "0.75rem" }}>
                  No guidance cards matched “{searchQuery}”.
                </p>
              ) : (
                filteredFindGynecologist.map((card, index) => (
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
                ))
              )}
            </div>
          </div>
        )}
        
        {/* DOCTORS DIRECTORY TAB (from doctorsData) */}
        {activeTab === "pt-doctors" && (
          <div className="patient-tab-panel active">
            <div className="patient-grid">
              {(filteredDoctorsByCity[selectedCity] || []).length === 0 ? (
                <p style={{ color: "var(--muted)", padding: "0.75rem" }}>
                  No doctors found in {selectedCity} for “{searchQuery}”.
                </p>
              ) : (
                (filteredDoctorsByCity[selectedCity] || []).map((doc, index) => (
                  <article className="patient-card" key={index}>
                    <h3>{doc.name}</h3>
                    {doc.credentials && (
                      <p className="patient-card-category">{doc.credentials}</p>
                    )}
                    <p>{doc.hospital}</p>
                    <p>{doc.address}</p>
                    {doc.specializations && (
                      <p style={{ marginTop: "6px" }}>{doc.specializations}</p>
                    )}
                    <p style={{ marginTop: "6px" }}>
                      {doc.phone && <>📞 {doc.phone}</>}
                      {doc.email && (
                        <>
                          <br />✉️ {doc.email}
                        </>
                      )}
                    </p>
                    {doc.bookingLink && (
                      <a
                        href={doc.bookingLink}
                        target="_blank"
                        rel="noreferrer"
                        className="nav-button"
                        style={{ marginTop: "10px", display: "inline-block" }}
                      >
                        Book appointment
                      </a>
                    )}
                  </article>
                ))
              )}
            </div>
          </div>
        )}

          {/* PREVENTION & CARE TAB */}
          {activeTab === "pt-prevention-care" && (
            <div className="patient-tab-panel active">
              {/* Block 1: Main Prevention Cards */}
              <div className="patient-grid">
                {filteredPreventionCare.length === 0 ? (
                  <p style={{ color: "var(--muted)", padding: "0.75rem" }}>
                    No prevention topics matched “{searchQuery}”.
                  </p>
                ) : (
                  filteredPreventionCare.map((card, index) => (
                    <div className="patient-card" key={`prev-${index}`}>
                      {card.icon && (
                        <div
                          className="patient-card-icon"
                          style={{ fontSize: "22px", marginBottom: "6px" }}
                        >
                          {card.icon}
                        </div>
                      )}

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
                ))
              )}
            </div>

 {/* Block 2: Q&A Section */}
{filteredPreventionCareQA.length > 0 && (
  <div className="patient-prevention-qa" style={{ marginTop: "30px" }}>
    <h2
      className="patient-section-title-small"
      style={{ marginBottom: "15px" }}
    >
      Prevention &amp; Self‑Care Tips
    </h2>

        <div className="patient-grid">
          {filteredPreventionCareQA.map((item, index) => (
            <div className="patient-card" key={`qa-${index}`}>
              {item.icon && (
                <div
                  className="patient-card-icon"
                  style={{ fontSize: "24px", marginBottom: "8px" }}
                >
                  {item.icon}
                </div>
              )}

              <h3>{item.headline}</h3>

              {item.text && (
                <div
                  className="patient-card-snippet"
                  dangerouslySetInnerHTML={{ __html: item.text }}
                />
              )}

              {item.citation && (
                <p className="patient-card-citation">{item.citation}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    )}
    </div>
    )}

    {activeTab === "pt-govt-initiatives" && (
      <div className="patient-tab-panel active">
        {/* Block 1: Government Initiatives Cards */}
        <div className="patient-grid">
          {filteredGovernmentInitiatives.length === 0 ? (
            <p style={{ color: "var(--muted)", padding: "0.75rem" }}>
              No initiatives matched “{searchQuery}”.
            </p>
          ) : (
            filteredGovernmentInitiatives.map((card, index) => (
              <div className="patient-card" key={`gov-${index}`}>
                <h3>{card.title}</h3>
                {card.description && <p>{card.description}</p>}
              </div>
            ))
          )}
        </div>

        {/* MAP SECTION WITH DISTRICTS SIDEBAR */}
        <div
          className="patient-map-container"
          style={{ display: "flex", gap: "20px", marginTop: "30px" }}
        >
          {/* Sidebar: Districts List */}
          <div
            className="districts-sidebar"
            style={{ flex: "1", maxHeight: "500px", overflowY: "auto" }}
          >
            <h2 className="patient-section-title-small">
              {patientData.districtPrograms?.title}
            </h2>
            <p
              className="section-subtitle"
              style={{ marginBottom: "15px" }}
            >
              {patientData.districtPrograms?.description}
            </p>

            {filteredDistrictItems.length === 0 ? (
              <p style={{ color: "var(--muted)", padding: "0.5rem 0" }}>
                No districts matched “{searchQuery}”.
              </p>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                {filteredDistrictItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="patient-card district-item"
                    style={{ cursor: "pointer" }}
                  >
                    <h4
                      style={{
                        color: "var(--accent)",
                        marginBottom: "5px",
                      }}
                    >
                      {item.district}
                    </h4>
                    <ul
                      style={{
                        fontSize: "11px",
                        listStyle: "none",
                        padding: 0,
                      }}
                    >
                      {item.centers.map((center, cIdx) => (
                        <li key={cIdx} style={{ marginBottom: "3px" }}>
                          📍 {center}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* The Map */}
          <div className="patient-map-section" style={{ flex: "2" }}>
            <div
              className="patient-map-wrapper"
              style={{
                borderRadius: "18px",
                overflow: "hidden",
                border: "1px solid var(--border)",
                height: "100%",
              }}
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d1885945.7460670879!2d86.5!3d23.5!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1swomen%20health%20centers%20west%20bengal!5e0!3m2!1sen!2sin!4v1710000000000"
                width="100%"
                height="500"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                title="District Health Centers Map"
              ></iframe>
            </div>
          </div>
        </div>

        {/* Block 2: District Programs grid */}
        {patientData.districtPrograms && (
          <div className="patient-district-programs" style={{ marginTop: "30px" }}>
            <h2 className="patient-section-title-small">
              {patientData.districtPrograms.title}
            </h2>
            {patientData.districtPrograms.description && (
              <p>{patientData.districtPrograms.description}</p>
            )}

            <div className="patient-grid">
              {filteredDistrictItems.length === 0 ? (
                <p style={{ color: "var(--muted)", padding: "0.75rem" }}>
                  No districts matched “{searchQuery}”.
                </p>
              ) : (
                filteredDistrictItems.map((district, idx) => (
                  <div className="patient-card" key={`district-${idx}`}>
                    <h3>{district.district}</h3>
                    {district.centers &&
                      Array.isArray(district.centers) && (
                        <ul>
                          {district.centers.map((center, j) => (
                            <li key={j}>{center}</li>
                          ))}
                        </ul>
                      )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    )}

           {/* WELLNESS FOR HER – PACKAGES TAB */}
            {activeTab === "pt-wellness-packages" && (
              <div className="patient-tab-panel active">
                <div className="patient-grid">
                  {filteredWellnessPackages.length === 0 ? (
                    <p style={{ color: "var(--muted)", padding: "0.75rem" }}>
                      No wellness packages matched “{searchQuery}”.
                    </p>
                  ) : (
                    filteredWellnessPackages.map((pkg, index) => (
                      <article className="patient-card" key={index}>
                        <h3>{pkg.title}</h3>
                        {pkg.subtitle && (
                          <p className="patient-card-category">{pkg.subtitle}</p>
                        )}
                        <p>
                          <strong>City:</strong> {pkg.city}
                        </p>
                        {pkg.details && (
                          <ul>
                            {pkg.details.map((d, i) => (
                              <li key={i}>{d}</li>
                            ))}
                          </ul>
                        )}
                        {typeof pkg.priceApproxINR === "number" && (
                          <p style={{ marginTop: "6px" }}>
                            Approx. price: ₹{pkg.priceApproxINR}
                          </p>
                        )}
                        {pkg.link && (
                          <a
                            href={pkg.link}
                            target="_blank"
                            rel="noreferrer"
                            className="nav-button"
                            style={{ marginTop: "10px", display: "inline-block" }}
                          >
                            View package
                          </a>
                        )}
                      </article>
                    ))
                  )}
                </div>
              </div>
            )}

          {/* WELLNESS FOR HER – SCHOOLS & COLLEGES TAB */}
          {activeTab === "pt-wellness-education" && (
            <div className="patient-tab-panel active">
              <div className="patient-two-column">
                <section>
                  <h3>Schools & Early Programs</h3>
                  {filteredWellnessSchools.length === 0 ? (
                    <p style={{ color: "var(--muted)", padding: "0.75rem 0" }}>
                      No schools matched “{searchQuery}”.
                    </p>
                  ) : (
                    filteredWellnessSchools.map((s, index) => (
                      <div className="patient-card" key={index}>
                        <h4>{s.name}</h4>
                        <p>{s.location}</p>
                        {s.highlights && (
                          <ul>
                            {s.highlights.map((h, i) => (
                              <li key={i}>{h}</li>
                            ))}
                          </ul>
                        )}
                        {s.link && (
                          <a
                            href={s.link}
                            target="_blank"
                            rel="noreferrer"
                            className="nav-button"
                            style={{
                              marginTop: "8px",
                              display: "inline-block",
                            }}
                          >
                            Learn more
                          </a>
                        )}
                      </div>
                    ))
                  )}
                </section>

                <section>
                  <h3>Colleges & Youth Wellness</h3>
                  {filteredWellnessColleges.length === 0 ? (
                    <p style={{ color: "var(--muted)", padding: "0.75rem 0" }}>
                      No colleges matched “{searchQuery}”.
                    </p>
                  ) : (
                    filteredWellnessColleges.map((c, index) => (
                      <div className="patient-card" key={index}>
                        <h4>{c.name}</h4>
                        <p>{c.location}</p>
                        {c.highlights && (
                          <ul>
                            {c.highlights.map((h, i) => (
                              <li key={i}>{h}</li>
                            ))}
                          </ul>
                        )}
                        {c.link && (
                          <a
                            href={c.link}
                            target="_blank"
                            rel="noreferrer"
                            className="nav-button"
                            style={{
                              marginTop: "8px",
                              display: "inline-block",
                            }}
                          >
                            Learn more
                          </a>
                        )}
                      </div>
                    ))
                  )}
                </section>
              </div>
            </div>
          )}

        {/* WELLNESS FOR HER – CORPORATE PARTNERS TAB */}
        {activeTab === "pt-wellness-corporate" && (
          <div className="patient-tab-panel active">
            <div className="patient-grid">
              {filteredWellnessCorporate.length === 0 ? (
                <p style={{ color: "var(--muted)", padding: "0.75rem" }}>
                  No corporate partners matched “{searchQuery}”.
                </p>
              ) : (
                filteredWellnessCorporate.map((corp, index) => (
                  <div className="patient-card" key={index}>
                    <h3>
                      {corp.icon && (
                        <span style={{ marginRight: "6px" }}>{corp.icon}</span>
                      )}
                      {corp.name}
                    </h3>

                    {corp.tagline && (
                      <p className="patient-card-category">{corp.tagline}</p>
                    )}

                    {corp.location && <p>{corp.location}</p>}

                    {corp.focus && (
                      <p style={{ marginTop: "6px" }}>{corp.focus}</p>
                    )}

                    {corp.services && corp.services.length > 0 && (
                      <>
                        <h4 style={{ marginTop: "10px" }}>Services</h4>
                        <ul>
                          {corp.services.map((s, i) => (
                            <li key={i}>{s}</li>
                          ))}
                        </ul>
                      </>
                    )}

                    {corp.features && corp.features.length > 0 && (
                      <>
                        <h4 style={{ marginTop: "10px" }}>Features</h4>
                        <ul>
                          {corp.features.map((f, i) => (
                            <li key={i}>{f}</li>
                          ))}
                        </ul>
                      </>
                    )}

                    {corp.impact && corp.impact.length > 0 && (
                      <>
                        <h4 style={{ marginTop: "10px" }}>Impact</h4>
                        <ul>
                          {corp.impact.map((imp, i) => (
                            <li key={i}>{imp}</li>
                          ))}
                        </ul>
                      </>
                    )}

                    {corp.programs && corp.programs.length > 0 && (
                      <>
                        <h4 style={{ marginTop: "10px" }}>Key Programs</h4>
                        <ul>
                          {corp.programs.map((p, i) => (
                            <li key={i}>{p}</li>
                          ))}
                        </ul>
                      </>
                    )}

                    {corp.link && (
                      <a
                        href={corp.link}
                        target="_blank"
                        rel="noreferrer"
                        className="nav-button"
                        style={{ marginTop: "10px", display: "inline-block" }}
                      >
                        Partner details
                      </a>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* AI HEALTH ASSISTANT TAB */}
{activeTab === "pt-ai-assistant" && (
  <div className="patient-tab-panel active">
    <div className="patient-two-column">
      {/* LEFT: Sidebar (stats + helplines + reset) */}
      <aside className="chatbot-sidebar">
        {/* Conversation Stats */}
        <div className="sidebar-card stats-card">
          <h3>📊 Conversation Stats</h3>

          <div className="stat-row">
            <span className="stat-icon">💬</span>
            <div className="stat-content">
              <span className="stat-label">Total Messages</span>
              <span className="stat-value" id="totalMessages">0</span>
            </div>
          </div>

          <div className="stat-row">
            <span className="stat-icon">✅</span>
            <div className="stat-content">
              <span className="stat-label">Bot Responses</span>
              <span className="stat-value" id="botResponses">0</span>
            </div>
          </div>

          <div className="stat-row">
            <span className="stat-icon">🔘</span>
            <div className="stat-content">
              <span className="stat-label">Button Selections</span>
              <span className="stat-value" id="buttonClicks">0</span>
            </div>
          </div>

          <div className="stat-row">
            <span className="stat-icon">⌨️</span>
            <div className="stat-content">
              <span className="stat-label">Typed Messages</span>
              <span className="stat-value" id="typedMessages">0</span>
            </div>
          </div>

          <div className="stat-row">
            <span className="stat-icon">🔗</span>
            <div className="stat-content">
              <span className="stat-label">Conversation Chain</span>
              <span className="stat-value" id="conversationChain">1</span>
            </div>
          </div>
        </div>

        {/* Emergency Helplines */}
        <div className="sidebar-card helpline-card">
          <h3>🆘 Emergency Helplines</h3>

          <div className="helpline-row">
            <span className="helpline-icon">📞</span>
            <div className="helpline-content">
              <div className="helpline-name">Women Helpline</div>
              <div className="helpline-number">181</div>
            </div>
          </div>

          <div className="helpline-row">
            <span className="helpline-icon">🏥</span>
            <div className="helpline-content">
              <div className="helpline-name">National Health</div>
              <div className="helpline-number">104</div>
            </div>
          </div>

          <div className="helpline-row">
            <span className="helpline-icon">💚</span>
            <div className="helpline-content">
              <div className="helpline-name">Tele‑MANAS</div>
              <div className="helpline-number">14416</div>
            </div>
          </div>

          <div className="helpline-row">
            <span className="helpline-icon">🚨</span>
            <div className="helpline-content">
              <div className="helpline-name">Emergency</div>
              <div className="helpline-number">112</div>
            </div>
          </div>

          <div className="helpline-row">
            <span className="helpline-icon">👮</span>
            <div className="helpline-content">
              <div className="helpline-name">Women Safety</div>
              <div className="helpline-number">1091</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="sidebar-card actions-card">
          <button
            className="action-btn reset-btn"
            // onClick={resetChatbot}
          >
            <span>🔄</span> Reset Chat
          </button>
        </div>
      </aside>

      {/* RIGHT: Main Chat Area */}
      <div className="chatbot-main">
          {/* Top banner styled like other condition cards (e.g. PCOS) */}
          <div className="patient-card" style={{ marginBottom: "12px" }}>
            <h3 className="patient-section-title-small" style={{ marginBottom: "6px" }}>
              💬 Chat with our AI Health Advisor
            </h3>
            <p className="patient-card-snippet">
              Get personalized health guidance through our intelligent chatbot. Ask questions
              about menstrual health, reproductive concerns, PCOS, pregnancy and other women’s
              health topics in English, Hindi or Bengali.
            </p>
          </div>

          <div className="chat-header">
            <h2>🤖 AI Health Assistant</h2>
            <p>Get personalized health guidance</p>
          </div>


        <div
          id="chatContainer"
          style={{
            background: "var(--surface-elevated)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-lg)",
            height: "420px",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            boxShadow: "var(--shadow-subtle)"
          }}
        >
          <div
            id="chatMessages"
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "1.25rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem"
            }}
          >
            <div className="bot-message">
            <div
              style={{
                background: "var(--accent-soft)",
                color: "var(--text-main)",
                padding: "0.9rem",
                borderRadius: "var(--radius-md)",
                maxWidth: "80%",
                fontSize: "12px",
                lineHeight: 1.5,
                whiteSpace: "pre-line"
              }}
            >
              <strong>{assistantGreeting.title}</strong>
              <br />
              {assistantGreeting.text}
            </div>
          </div>

          {/* TODO: mapped chatMessages go here */}
        </div>

          <div
            style={{
              borderTop: "1px solid var(--border-subtle)",
              padding: "0.9rem",
              background: "var(--bg-elevated)"
            }}
          >
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <input
                type="text"
                id="chatInput"
                className="patient-input"
                placeholder="Type your question here... / আপনার প্রশ্ন লিখুন..."
                // value={chatInput}
                // onChange={(e) => setChatInput(e.target.value)}
                style={{ flex: 1 }}
              />
              <button
                id="chatSendBtn"
                className="nav-button"
                style={{ whiteSpace: "nowrap" }}
                // onClick={handleChatbot}
              >
                Send 🚀
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)}
       {/* FAQS TAB */}
      {activeTab === "pt-faq" && (
        <div className="patient-tab-panel active">
          <div className="patient-faq-list">
            {filteredFaqs.length === 0 ? (
              <p style={{ color: "var(--muted)", padding: "0.75rem" }}>
                No FAQs matched “{searchQuery}”.
              </p>
            ) : (
              filteredFaqs.map((faq, index) => (
                <details className="patient-card" key={index}>
                  <summary>{faq.question}</summary>
                  <p style={{ marginTop: "10px" }}>{faq.answer}</p>
                </details>
              ))
            )}
          </div>
        </div>
      )}
      </div>
    </div>
  </section>
</main>

     {isModalOpen && selectedCondition && (
        <div className="wp-modal-backdrop" onClick={handleCloseModal}>
          <div
            className="wp-modal"
            onClick={(e) => e.stopPropagation()} // keep clicks inside from closing
          >
            <button className="wp-modal-close" onClick={handleCloseModal}>
              ✕
            </button>

            <h2 className="wp-modal-title">
              {selectedCondition.name || selectedCondition.title}
              {selectedCondition.category && (
                <span className="wp-condition-chip">
                  {selectedCondition.category}
                </span>
              )}
            </h2>

          <p className="wp-modal-disease-intro">
            <em>
              {selectedCondition.introText ||
                selectedCondition.overview ||
                `An overview of ${selectedCondition.name || selectedCondition.title} and why early care matters.`}
            </em>
          </p>

            {(selectedCondition.longDescription ||
              selectedCondition.description ||
              selectedCondition.shortDescription) && (
              <p className="wp-modal-intro wp-modal-disease-intro">
                {selectedCondition.longDescription ||
                  selectedCondition.description ||
                  selectedCondition.shortDescription}
              </p>
            )}

            {Array.isArray(selectedCondition.symptoms) &&
              selectedCondition.symptoms.length > 0 && (
                <>
                  <h3>Symptoms</h3>
                  <ul>
                    {selectedCondition.symptoms.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </>
              )}

            {Array.isArray(selectedCondition.tests) &&
              selectedCondition.tests.length > 0 && (
                <>
                  <h3>Treatment options</h3>
                  <ul>

                    {selectedCondition.tests.map((t, i) => (
                      <li key={i}>{t}</li>
                    ))}
                  </ul>
                </>
              )}

            {Array.isArray(selectedCondition.causes) &&
              selectedCondition.causes.length > 0 && (
                <>
                  <h3>Causes</h3>
                  <ul>
                    {selectedCondition.causes.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </>
              )}

            {Array.isArray(selectedCondition.treatment) &&
              selectedCondition.treatment.length > 0 && (
                <>
                  <h3>Treatment options</h3>
                  <ul>
                    {selectedCondition.treatment.map((t, i) => (
                      <li key={i}>{t}</li>
                    ))}
                  </ul>
                </>
              )}

            {selectedCondition.prevention && (
              <p className="wp-modal-prevention">
                <strong>Prevention: </strong>
                {selectedCondition.prevention}
              </p>
            )}

            {selectedCondition.citation && (
              <p className="wp-modal-citation">
                <strong>Sources: </strong>
                {selectedCondition.citation}
              </p>
            )}
          </div>
        </div>
      )}
 
    </div>
  );
}