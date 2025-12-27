import React, { useState, useMemo } from "react";

import chatConfig from "../data/womenchatbot.json";
import patientData from "../data/womenpatients.json";

import "../styles/womenpatients.css";
import gynaeImg from "../images/gynaeo.png";
import wmHealthImg from "../images/wmhealthpic.png";

/**
 * WomenPatientsPage
 * A cleaned‑up, fully valid version without stray markdown or bullets.
 * Assumes a patientData object is either passed as prop or imported.
 */

const TABS = [
  "Overview",
  "Symptoms & Conditions",
  "When to See a Doctor",
  "Find Doctors",
  "Prevention & Self‑Care",
  "Government Programs",
  "Wellness For Her",
  "FAQs",
];

const WomenPatientsPage = ({ patientData, assistantGreeting }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("Overview");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedCondition, setSelectedCondition] = useState(null);

  const normalizedQuery = searchQuery.trim().toLowerCase();

  // --- DERIVED DATA / FILTERS ---

  // 1) Condition summaries
  const filteredHealthSummaries = useMemo(() => {
    const items = patientData?.healthSummaries || [];
    if (!normalizedQuery) return items;
    return items.filter((condition) => {
      const name = (
        condition.name ||
        condition.title ||
        ""
      ).toLowerCase();
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
  }, [patientData, normalizedQuery]);

  // 2) Detailed conditions
  const filteredHealthConditions = useMemo(() => {
    const items = patientData?.conditions || [];
    if (!normalizedQuery) return items;
    return items.filter((condition) => {
      const name = (condition.name || "").toLowerCase();
      const category = (condition.category || "").toLowerCase();
      const symptoms = Array.isArray(condition.symptoms)
        ? condition.symptoms.join(" ").toLowerCase()
        : "";
      const causes = Array.isArray(condition.causes)
        ? condition.causes.join(" ").toLowerCase()
        : "";
      const treatment = Array.isArray(condition.treatment)
        ? condition.treatment.join(" ").toLowerCase()
        : "";
      const desc = (
        condition.shortDescription ||
        condition.description ||
        ""
      ).toLowerCase();
      return (
        name.includes(normalizedQuery) ||
        category.includes(normalizedQuery) ||
        symptoms.includes(normalizedQuery) ||
        causes.includes(normalizedQuery) ||
        treatment.includes(normalizedQuery) ||
        desc.includes(normalizedQuery)
      );
    });
  }, [patientData, normalizedQuery]);

  // 3) When to see a doctor
  const filteredWhenToSee = useMemo(() => {
    const items = patientData?.whenToSee || [];
    if (!normalizedQuery) return items;
    return items.filter((card) => {
      const title = (card.title || "").toLowerCase();
      const desc = (card.description || "").toLowerCase();
      const itemsStr = Array.isArray(card.items)
        ? card.items.join(" ").toLowerCase()
        : "";
      return (
        title.includes(normalizedQuery) ||
        desc.includes(normalizedQuery) ||
        itemsStr.includes(normalizedQuery)
      );
    });
  }, [patientData, normalizedQuery]);

  // 4) Doctor guidance / city wise doctors
  const filteredFindGynecologist = useMemo(() => {
    const items = patientData?.findGynecologist || [];
    if (!normalizedQuery) return items;
    return items.filter((card) => {
      const title = (card.title || "").toLowerCase();
      const desc = (card.description || "").toLowerCase();
      const itemsStr = Array.isArray(card.items)
        ? card.items.join(" ").toLowerCase()
        : "";
      return (
        title.includes(normalizedQuery) ||
        desc.includes(normalizedQuery) ||
        itemsStr.includes(normalizedQuery)
      );
    });
  }, [patientData, normalizedQuery]);

  const doctorsByCity = useMemo(() => {
    const doctors = patientData?.doctors || [];
    return doctors.reduce((acc, doc) => {
      const city = (doc.city || "").trim();
      if (!city) return acc;
      if (!acc[city]) acc[city] = [];
      acc[city].push(doc);
      return acc;
    }, {});
  }, [patientData]);

  const filteredDoctorsByCity = useMemo(() => {
    if (!selectedCity) return {};
    const cityDocs = doctorsByCity[selectedCity] || [];
    if (!normalizedQuery) return { [selectedCity]: cityDocs };
    const filtered = cityDocs.filter((doc) => {
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
        specs.includes(normalizedQuery)
      );
    });
    return { [selectedCity]: filtered };
  }, [doctorsByCity, selectedCity, normalizedQuery]);

  // 5) Prevention & self‑care
  const filteredPreventionCare = useMemo(() => {
    const cards = patientData?.preventionCare || [];
    if (!normalizedQuery) return cards;
    return cards.filter((card) => {
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
  }, [patientData, normalizedQuery]);

  const filteredPreventionCareQA = useMemo(() => {
    const qa = patientData?.preventionCareQA || [];
    if (!normalizedQuery) return qa;
    return qa.filter((item) => {
      const headline = (item.headline || "").toLowerCase();
      const text = (item.text || "").toLowerCase();
      return (
        headline.includes(normalizedQuery) || text.includes(normalizedQuery)
      );
    });
  }, [patientData, normalizedQuery]);

  // 6) Government initiatives
  const filteredGovernmentInitiatives = useMemo(() => {
    const cards = patientData?.governmentInitiatives || [];
    if (!normalizedQuery) return cards;
    return cards.filter((card) => {
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
  }, [patientData, normalizedQuery]);

  // 7) District programs
  const allDistrictItems = patientData?.districtPrograms?.items || [];
  const filteredDistrictItems = useMemo(() => {
    if (!normalizedQuery) return allDistrictItems;
    return allDistrictItems.filter((item) => {
      const district = (item.district || "").toLowerCase();
      const centers = Array.isArray(item.centers)
        ? item.centers.join(" ").toLowerCase()
        : "";
      return (
        district.includes(normalizedQuery) ||
        centers.includes(normalizedQuery)
      );
    });
  }, [allDistrictItems, normalizedQuery]);

  // 8) Wellness: packages, schools, colleges, corporate
  const filteredWellnessPackages = useMemo(() => {
    const pkgs = patientData?.wellnessForHer?.packages || [];
    if (!normalizedQuery) return pkgs;
    return pkgs.filter((pkg) => {
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
  }, [patientData, normalizedQuery]);

  const filteredWellnessSchools = useMemo(() => {
    const schools = patientData?.wellnessForHer?.schools || [];
    if (!normalizedQuery) return schools;
    return schools.filter((s) => {
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
  }, [patientData, normalizedQuery]);

  const filteredWellnessColleges = useMemo(() => {
    const colleges = patientData?.wellnessForHer?.colleges || [];
    if (!normalizedQuery) return colleges;
    return colleges.filter((c) => {
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
  }, [patientData, normalizedQuery]);

  const filteredWellnessCorporate = useMemo(() => {
    const corps =
      patientData?.wellnessForHer?.corporateWellnessPartners || [];
    if (!normalizedQuery) return corps;
    return corps.filter((corp) => {
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
    });
  }, [patientData, normalizedQuery]);

  // 9) FAQs
  const filteredFaqs = useMemo(() => {
    const faqs = patientData?.faqs || [];
    if (!normalizedQuery) return faqs;
    return faqs.filter((faq) => {
      const q = (faq.question || "").toLowerCase();
      const a = (faq.answer || "").toLowerCase();
      return q.includes(normalizedQuery) || a.includes(normalizedQuery);
    });
  }, [patientData, normalizedQuery]);

  // --- RENDER HELPERS ---

  const handleConditionClick = (condition) => {
    setSelectedCondition(condition);
    setActiveTab("Overview");
  };

  const assistantText =
    assistantGreeting?.text ||
    "Ask questions about menstrual health, reproductive concerns, PCOS, pregnancy and other women’s health topics.";

  // --- MAIN RENDER ---

  return (
    <div className="women-patients-page">
      <header className="hero">
        <h1>Women&apos;s Health Navigator</h1>
        <p>
          Transforming Indian women&apos;s health through accessible education
          and empowered healthcare decisions—one woman, one community at a
          time, to empower 700+ million Indian women towards healthier, informed
          futures.
        </p>
      </header>

      {/* SEARCH BAR */}
      <section className="search-bar-section">
        <p>
          <strong>For Patients:</strong> Search from the information given below
          in the tabs. You can search by symptom (e.g. "heavy menstrual
          bleeding"), condition name, life stage, city, or doctor/hospital.
        </p>
        <input
          type="text"
          placeholder="Search by symptom, condition, city, or doctor..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </section>

      {/* TABS */}
      <nav className="tab-nav">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            className={tab === activeTab ? "tab active" : "tab"}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </nav>

      {/* TAB CONTENT */}
      <section className="tab-content">
        {/* Overview: summaries + AI assistant + detailed condition */}
        {activeTab === "Overview" && (
          <div className="overview-tab">
            {/* Condition summaries */}
            <section>
              <h2>Common conditions & summaries</h2>
              {filteredHealthSummaries.length === 0 ? (
                <p>
                  No matching health conditions found for "{searchQuery}". Try
                  another symptom, disease name, or body area.
                </p>
              ) : (
                filteredHealthSummaries.map((condition, index) => (
                  <article
                    key={index}
                    className="condition-summary"
                    onClick={() => handleConditionClick(condition)}
                    style={{ cursor: "pointer" }}
                  >
                    <h3>
                      {condition.name || condition.title}
                      {condition.category && (
                        <span className="condition-category">
                          {" "}
                          ({condition.category})
                        </span>
                      )}
                    </h3>
                    <p>
                      {condition.shortDescription || condition.description}
                    </p>
                  </article>
                ))
              )}
            </section>

            {/* Selected condition detailed view */}
            {selectedCondition && (
              <section className="selected-condition">
                <h2>
                  {selectedCondition.name || selectedCondition.title}{" "}
                  {selectedCondition.category && (
                    <span>({selectedCondition.category})</span>
                  )}
                </h2>

                <p>
                  {selectedCondition.introText ||
                    selectedCondition.overview ||
                    `An overview of ${
                      selectedCondition.name || selectedCondition.title
                    } and why early care matters.`}
                </p>

                {selectedCondition.longDescription ||
                selectedCondition.description ||
                selectedCondition.shortDescription ? (
                  <p>
                    {selectedCondition.longDescription ||
                      selectedCondition.description ||
                      selectedCondition.shortDescription}
                  </p>
                ) : null}

                {Array.isArray(selectedCondition.symptoms) &&
                  selectedCondition.symptoms.length > 0 && (
                    <section>
                      <h3>Symptoms</h3>
                      <ul>
                        {selectedCondition.symptoms.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </section>
                  )}

                {Array.isArray(selectedCondition.tests) &&
                  selectedCondition.tests.length > 0 && (
                    <section>
                      <h3>Tests & evaluations</h3>
                      <ul>
                        {selectedCondition.tests.map((t, i) => (
                          <li key={i}>{t}</li>
                        ))}
                      </ul>
                    </section>
                  )}

                {Array.isArray(selectedCondition.causes) &&
                  selectedCondition.causes.length > 0 && (
                    <section>
                      <h3>Causes</h3>
                      <ul>
                        {selectedCondition.causes.map((c, i) => (
                          <li key={i}>{c}</li>
                        ))}
                      </ul>
                    </section>
                  )}

                {Array.isArray(selectedCondition.treatment) &&
                  selectedCondition.treatment.length > 0 && (
                    <section>
                      <h3>Treatment options</h3>
                      <ul>
                        {selectedCondition.treatment.map((t, i) => (
                          <li key={i}>{t}</li>
                        ))}
                      </ul>
                    </section>
                  )}

                {selectedCondition.prevention && (
                  <p>
                    <strong>Prevention: </strong>
                    {selectedCondition.prevention}
                  </p>
                )}

                {selectedCondition.citation && (
                  <p>
                    <strong>Sources: </strong>
                    {selectedCondition.citation}
                  </p>
                )}
              </section>
            )}

            {/* AI Assistant block */}
            <section className="ai-assistant">
              <h2>🤖 AI Health Assistant</h2>
              <p>Get personalized health guidance.</p>
              <h3>{assistantGreeting?.title || "Chat with our AI Health Advisor"}</h3>
              <p>{assistantText}</p>
            </section>
          </div>
        )}

        {/* Symptoms & Conditions tab */}
        {activeTab === "Symptoms & Conditions" && (
          <section>
            <h2>Symptoms & detailed conditions</h2>
            {filteredHealthConditions.length === 0 ? (
              <p>
                No conditions found for "{searchQuery}". Try another symptom,
                disease name, or body area.
              </p>
            ) : (
              filteredHealthConditions.map((condition, index) => (
                <article
                  key={index}
                  className="condition-card"
                  onClick={() => handleConditionClick(condition)}
                  style={{ cursor: "pointer" }}
                >
                  <h3>
                    {condition.name}
                    {condition.category && (
                      <span className="condition-category">
                        {" "}
                        ({condition.category})
                      </span>
                    )}
                  </h3>

                  {(condition.shortDescription || condition.description) && (
                    <p>
                      {condition.shortDescription || condition.description}
                    </p>
                  )}

                  {Array.isArray(condition.symptoms) &&
                    condition.symptoms.length > 0 && (
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

                  {Array.isArray(condition.causes) &&
                    condition.causes.length > 0 && (
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

                  {Array.isArray(condition.treatment) &&
                    condition.treatment.length > 0 && (
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

                  {condition.citation && (
                    <p>
                      <strong>Research: </strong>
                      {condition.citation}
                    </p>
                  )}
                </article>
              ))
            )}
          </section>
        )}

        {/* When to See a Doctor */}
        {activeTab === "When to See a Doctor" && (
          <section>
            <h2>When to see a doctor</h2>
            {filteredWhenToSee.length === 0 ? (
              <p>No matching reasons found for "{searchQuery}".</p>
            ) : (
              filteredWhenToSee.map((card, index) => (
                <article key={index} className="when-to-see-card">
                  <h3>{card.title}</h3>
                  {card.description && <p>{card.description}</p>}
                  {card.items && Array.isArray(card.items) && (
                    <ul>
                      {card.items.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  )}
                </article>
              ))
            )}
          </section>
        )}

        {/* Find Doctors */}
        {activeTab === "Find Doctors" && (
          <section>
            <h2>Find gynecologists & women’s health doctors</h2>

            {/* Guidance cards */}
            {filteredFindGynecologist.length === 0 ? (
              <p>No guidance cards matched "{searchQuery}".</p>
            ) : (
              filteredFindGynecologist.map((card, index) => (
                <article key={index} className="gyne-card">
                  <h3>{card.title}</h3>
                  {card.description && <p>{card.description}</p>}
                  {card.items && Array.isArray(card.items) && (
                    <ul>
                      {card.items.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  )}
                </article>
              ))
            )}

            {/* Doctor list by city */}
            <div className="doctor-search">
              <label>
                Select city:{" "}
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                >
                  <option value="">Choose city</option>
                  {Object.keys(doctorsByCity).map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </label>

              {selectedCity && (
                <div className="doctor-results">
                  <h3>Doctors in {selectedCity}</h3>
                  {(filteredDoctorsByCity[selectedCity] || []).length === 0 ? (
                    <p>
                      No doctors found in {selectedCity} for "{searchQuery}".
                    </p>
                  ) : (
                    (filteredDoctorsByCity[selectedCity] || []).map(
                      (doc, index) => (
                        <article key={index} className="doctor-card">
                          <h4>
                            {doc.name}
                            {doc.credentials && (
                              <span> ({doc.credentials})</span>
                            )}
                          </h4>
                          {doc.hospital && <p>{doc.hospital}</p>}
                          {doc.address && <p>{doc.address}</p>}
                          {doc.specializations && (
                            <p>{doc.specializations.join(", ")}</p>
                          )}
                          {doc.phone && <p>📞 {doc.phone}</p>}
                          {doc.email && <p>✉️ {doc.email}</p>}
                        </article>
                      )
                    )
                  )}
                </div>
              )}
            </div>
          </section>
        )}

        {/* Prevention & Self‑Care */}
        {activeTab === "Prevention & Self‑Care" && (
          <section>
            <h2>Prevention & self‑care</h2>

            {filteredPreventionCare.length === 0 ? (
              <p>No prevention topics matched "{searchQuery}".</p>
            ) : (
              filteredPreventionCare.map((card, index) => (
                <article key={index} className="prevention-card">
                  <h3>{card.title}</h3>
                  {card.description && <p>{card.description}</p>}
                  {card.items && Array.isArray(card.items) && (
                    <ul>
                      {card.items.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  )}
                </article>
              ))
            )}

            {filteredPreventionCareQA.length > 0 && (
              <section className="prevention-qa">
                <h3>Prevention & self‑care tips</h3>
                {filteredPreventionCareQA.map((item, i) => (
                  <article key={i}>
                    <h4>{item.headline}</h4>
                    {item.text && <p>{item.text}</p>}
                    {item.citation && <p>{item.citation}</p>}
                  </article>
                ))}
              </section>
            )}
          </section>
        )}

        {/* Government Programs */}
        {activeTab === "Government Programs" && (
          <section>
            <h2>Government initiatives & district programs</h2>

            <section>
              <h3>Government initiatives</h3>
              {filteredGovernmentInitiatives.length === 0 ? (
                <p>No initiatives matched "{searchQuery}".</p>
              ) : (
                filteredGovernmentInitiatives.map((card, index) => (
                  <article key={index} className="govt-card">
                    <h4>{card.title}</h4>
                    {card.description && <p>{card.description}</p>}
                    {card.items && Array.isArray(card.items) && (
                      <ul>
                        {card.items.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    )}
                  </article>
                ))
              )}
            </section>

            {patientData?.districtPrograms && (
              <section>
                <h3>{patientData.districtPrograms.title}</h3>
                {patientData.districtPrograms.description && (
                  <p>{patientData.districtPrograms.description}</p>
                )}
                {filteredDistrictItems.length === 0 ? (
                  <p>No districts matched "{searchQuery}".</p>
                ) : (
                  filteredDistrictItems.map((district, idx) => (
                    <article key={idx} className="district-block">
                      <h4>{district.district}</h4>
                      {district.centers && Array.isArray(district.centers) && (
                        <ul>
                          {district.centers.map((center, j) => (
                            <li key={j}>📍 {center}</li>
                          ))}
                        </ul>
                      )}
                    </article>
                  ))
                )}
              </section>
            )}
          </section>
        )}

        {/* Wellness For Her */}
        {activeTab === "Wellness For Her" && (
          <section>
            <h2>Wellness For Her</h2>

            {/* Packages */}
            <section>
              <h3>Packages</h3>
              {filteredWellnessPackages.length === 0 ? (
                <p>No wellness packages matched "{searchQuery}".</p>
              ) : (
                filteredWellnessPackages.map((pkg, index) => (
                  <article
                    key={index}
                    className="wellness-package-card"
                  >
                    <h4>{pkg.title}</h4>
                    {pkg.subtitle && <p>{pkg.subtitle}</p>}
                    {pkg.city && (
                      <p>
                        <strong>City:</strong> {pkg.city}
                      </p>
                    )}
                    {pkg.details && Array.isArray(pkg.details) && (
                      <ul>
                        {pkg.details.map((d, i) => (
                          <li key={i}>{d}</li>
                        ))}
                      </ul>
                    )}
                    {pkg.priceApproxINR && (
                      <p>Approx. price: ₹{pkg.priceApproxINR}</p>
                    )}
                    {pkg.link && (
                      <p>
                        <a
                          href={pkg.link}
                          target="_blank"
                          rel="noreferrer"
                        >
                          View package
                        </a>
                      </p>
                    )}
                  </article>
                ))
              )}
            </section>

            {/* Schools */}
            <section>
              <h3>Schools & Early Programs</h3>
              {filteredWellnessSchools.length === 0 ? (
                <p>No schools matched "{searchQuery}".</p>
              ) : (
                filteredWellnessSchools.map((s, index) => (
                  <article key={index} className="school-card">
                    <h4>{s.name}</h4>
                    {s.location && <p>{s.location}</p>}
                    {s.highlights && Array.isArray(s.highlights) && (
                      <ul>
                        {s.highlights.map((h, i) => (
                          <li key={i}>{h}</li>
                        ))}
                      </ul>
                    )}
                  </article>
                ))
              )}
            </section>

            {/* Colleges */}
            <section>
              <h3>Colleges & Youth Wellness</h3>
              {filteredWellnessColleges.length === 0 ? (
                <p>No colleges matched "{searchQuery}".</p>
              ) : (
                filteredWellnessColleges.map((c, index) => (
                  <article key={index} className="college-card">
                    <h4>{c.name}</h4>
                    {c.location && <p>{c.location}</p>}
                    {c.highlights && Array.isArray(c.highlights) && (
                      <ul>
                        {c.highlights.map((h, i) => (
                          <li key={i}>{h}</li>
                        ))}
                      </ul>
                    )}
                  </article>
                ))
              )}
            </section>

            {/* Corporate partners */}
            <section>
              <h3>Corporate wellness partners</h3>
              {filteredWellnessCorporate.length === 0 ? (
                <p>No corporate partners matched "{searchQuery}".</p>
              ) : (
                filteredWellnessCorporate.map((corp, index) => (
                  <article key={index} className="corporate-card">
                    <h4>
                      {corp.icon && <span>{corp.icon} </span>}
                      {corp.name}
                    </h4>
                    {corp.tagline && <p>{corp.tagline}</p>}
                    {corp.location && <p>{corp.location}</p>}
                    {corp.focus && <p>{corp.focus}</p>}

                    {corp.services && corp.services.length > 0 && (
                      <>
                        <h5>Services</h5>
                        <ul>
                          {corp.services.map((s, i) => (
                            <li key={i}>{s}</li>
                          ))}
                        </ul>
                      </>
                    )}

                    {corp.features && corp.features.length > 0 && (
                      <>
                        <h5>Features</h5>
                        <ul>
                          {corp.features.map((f, i) => (
                            <li key={i}>{f}</li>
                          ))}
                        </ul>
                      </>
                    )}

                    {corp.impact && corp.impact.length > 0 && (
                      <>
                        <h5>Impact</h5>
                        <ul>
                          {corp.impact.map((imp, i) => (
                            <li key={i}>{imp}</li>
                          ))}
                        </ul>
                      </>
                    )}

                    {corp.programs && corp.programs.length > 0 && (
                      <>
                        <h5>Key Programs</h5>
                        <ul>
                          {corp.programs.map((p, i) => (
                            <li key={i}>{p}</li>
                          ))}
                        </ul>
                      </>
                    )}
                  </article>
                ))
              )}
            </section>
          </section>
        )}

        {/* FAQs */}
        {activeTab === "FAQs" && (
          <section>
            <h2>FAQs</h2>
            {filteredFaqs.length === 0 ? (
              <p>No FAQs matched "{searchQuery}".</p>
            ) : (
              filteredFaqs.map((faq, index) => (
                <article key={index} className="faq-item">
                  <h3>{faq.question}</h3>
                  <p>{faq.answer}</p>
                </article>
              ))
            )}
          </section>
        )}
      </section>
    </div>
  );
};

export default WomenPatientsPage;