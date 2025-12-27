import React, { useState, useEffect } from 'react';
import { Search, Star, TrendingUp, ExternalLink, AlertCircle, Shield, CheckCircle, Filter, Layers, Globe } from 'lucide-react';
import '../styles/womeninsprods.css'; 
import insuranceData from "../data/womeninsurance.json";

const WomenInsuranceProductCatlg = () => {

  const { categories, products } = insuranceData;
  
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceFilter, setPriceFilter] = useState('all');

  const parsePremium = (premiumStr) => {
    if (!premiumStr || premiumStr.toLowerCase().includes('varies')) return 0;
    const clean = premiumStr.split('-')[0].replace(/[₹,\s/year]/g, '');
    const price = parseInt(clean);
    return isNaN(price) ? 0 : price;
  };

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (product.personalization && product.personalization.toLowerCase().includes(searchQuery.toLowerCase()));
    
    let matchesPrice = true;
    if (priceFilter !== 'all') {
      const premiumValue = parsePremium(product.avg_premium);
      if (priceFilter === 'budget') matchesPrice = premiumValue > 0 && premiumValue < 12000;
      if (priceFilter === 'mid') matchesPrice = premiumValue >= 12000 && premiumValue <= 22000;
      if (priceFilter === 'premium') matchesPrice = premiumValue > 22000;
      if (priceFilter === 'varies') matchesPrice = premiumValue === 0;
    }
    return matchesCategory && matchesSearch && matchesPrice;
  });

  return (
    <div className="page-shell">
      <header className="top-bar">
        <div className="top-bar-inner">
          <div className="brand-block">
            <div className="brand-logo">🌸</div>
            <div className="brand-text">
              <span className="brand-title">Nari Suraksha</span>
              <span className="brand-subtitle">Women's Insurance Directory</span>
            </div>
          </div>
        </div>
      </header>

      <main className="main">
        <div className="content-wrap" style={{ 
          gridTemplateColumns: '1fr', 
          maxWidth: '1400px', 
          padding: '22px 18px 40px', 
          margin: '0 auto',
          width: '100%'
        }}>
          {/* Hero Section */}
          <section className="hero-card" style={{ 
            background: 'linear-gradient(135deg, #E91E63 0%, #FF4081 100%)', 
            borderRadius: '24px', 
            padding: '40px 30px', 
            color: 'white',
            boxShadow: '0 20px 40px rgba(233, 30, 99, 0.2)',
            marginBottom: '32px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ flex: 1 }}>
              <div className="hero-badge-row">
                <div className="hero-chip" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)' }}>
                  <Shield size={14} style={{ marginRight: '6px' }} />
                  IRDAI Certified
                </div>
              </div>
              
              <h1 className="hero-title" style={{ color: '#ffffff', fontSize: '36px', fontWeight: '800', marginTop: '16px' }}>
                Secure Your Health & Future
              </h1>
              <p className="hero-subtitle" style={{ color: 'rgba(255,255,255,0.9)', maxWidth: '500px', lineHeight: '1.6' }}>
                Discover and connect with trusted insurance partners offering comprehensive coverage designed for women.
              </p>
            </div>

            {/* Icon on the extreme right */}
            <div style={{ marginLeft: '20px', opacity: 0.9 }}>
              <Shield size={80} strokeWidth={1.5} color="white" />
            </div>
          </section>

          {/* Search & Filters */}
          <div className="mode-toggle-row" style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '2px', width: '100%' }}>
            {/* Row 1: Search and Price Filter */}
            <div
              className="filter-row"
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr',
                gap: '12px',
                width: '100%',
                alignItems: 'flex-start',
              }}
            >
              {/* Search */}
              <div className="field">
                <label
                  style={{
                    fontSize: '11px',
                    fontWeight: '700',
                    color: '#E91E63',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    textTransform: 'uppercase',
                    marginBottom: '4px'
                  }}
                >
                  <Search size={12} /> Search Plans
                </label>
                <input
                  type="text"
                  placeholder="Search providers or coverage types..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ 
                    border: '1px solid #eee', 
                    borderRadius: '8px', 
                    padding: '10px',
                    width: '100%'
                  }}
                />
              </div>

              {/* Price Filter */}
              <div className="field">
                <label
                  style={{
                    fontSize: '11px',
                    fontWeight: '700',
                    color: '#E91E63',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    textTransform: 'uppercase',
                    marginBottom: '4px'
                  }}
                >
                  <Filter size={12} /> Annual Premium
                </label>
                <select 
                  value={priceFilter}
                  onChange={(e) => setPriceFilter(e.target.value)}
                  style={{ 
                    width: '100%', 
                    padding: '10px', 
                    borderRadius: '8px', 
                    border: '1px solid #eee' 
                  }}
                >
                  <option value="all">All Budgets</option>
                  <option value="budget">Budget (Under ₹12k)</option>
                  <option value="mid">Mid-Range (₹12k - ₹22k)</option>
                  <option value="premium">Premium (Above ₹22k)</option>
                  <option value="varies">Flexible/Varies</option>
                </select>
              </div>
            </div>

            {/* Row 2: Category Filters */}
            <div style={{ width: '100%' }}>
              <label
                style={{
                  fontSize: '11px',
                  fontWeight: '700',
                  color: '#E91E63',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  textTransform: 'uppercase',
                  marginBottom: '4px',
                  marginTop: '8px'
                }}
              >
                <Layers size={12} /> Filter By Category
              </label>
              <div className="mode-toggle-buttons" style={{ 
                display: 'flex', 
                flexWrap: 'wrap',
                gap: '6px',
                width: '100%'
              }}>
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`mode-toggle-button ${selectedCategory === cat.id ? 'active' : ''}`}
                    style={{
                      ...(selectedCategory === cat.id ? { background: '#E91E63', color: '#fff', border: 'none' } : {}),
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Alert Box */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            border: '1px solid rgba(233, 30, 99, 0.2)',
            borderLeft: '4px solid #E91E63',
            borderRadius: '16px',
            padding: '16px',
            marginTop: '24px',
            display: 'flex',
            gap: '12px',
            alignItems: 'flex-start',
            boxShadow: '0 4px 12px rgba(233, 30, 99, 0.1)'
          }}>
            <AlertCircle size={20} color="#E91E63" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#1a1a1a', marginBottom: '4px' }}>
                Insurance Advisory
              </h3>
              <p style={{ fontSize: '12px', color: '#555555', lineHeight: '1.5', margin: 0 }}>
                Premiums shown are indicative. Final costs depend on age, sum insured, and medical history. Compare plans carefully before purchasing.
              </p>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="stats-grid" style={{ display: 'flex', gap: '16px', marginTop: '24px', marginBottom: '24px', flexWrap: 'wrap' }}>
            {/* Plans Count */}
            <div className="stat-card" style={{ borderTop: '4px solid #E91E63', background: '#ffffff', flex: 1, minWidth: '150px', padding: '16px', position: 'relative', borderRadius: '16px', boxShadow: '0 4px 12px rgba(233, 30, 99, 0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h3 style={{ 
                  fontSize: '32px', 
                  fontWeight: '800', 
                  background: 'linear-gradient(135deg, #E91E63, #FF4081)', 
                  WebkitBackgroundClip: 'text', 
                  WebkitTextFillColor: 'transparent',
                  margin: 0
                }}>
                  {filteredProducts.length}
                </h3>
                <Shield size={20} color="#E91E63" style={{ opacity: 0.8 }} />
              </div>
              <p style={{ color: '#666', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600', marginTop: '4px' }}>
                Insurance Plans
              </p>
            </div>

            {/* Categories Count */}
            <div className="stat-card" style={{ borderTop: '4px solid #FFB300', background: '#ffffff', flex: 1, minWidth: '150px', padding: '16px', position: 'relative', borderRadius: '16px', boxShadow: '0 4px 12px rgba(233, 30, 99, 0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h3 style={{ 
                  fontSize: '32px', 
                  fontWeight: '800', 
                  background: 'linear-gradient(135deg, #FFB300, #F48116)', 
                  WebkitBackgroundClip: 'text', 
                  WebkitTextFillColor: 'transparent',
                  margin: 0
                }}>
                  {categories.length}
                </h3>
                <Layers size={20} color="#FFB300" style={{ opacity: 0.8 }} />
              </div>
              <p style={{ color: '#666', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600', marginTop: '4px' }}>
                Categories
              </p>
            </div>

            {/* Providers Count */}
            <div className="stat-card" style={{ borderTop: '4px solid #4DB6AC', background: '#ffffff', flex: 1, minWidth: '150px', padding: '16px', position: 'relative', borderRadius: '16px', boxShadow: '0 4px 12px rgba(233, 30, 99, 0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h3 style={{ 
                  fontSize: '32px', 
                  fontWeight: '800', 
                  background: 'linear-gradient(135deg, #4DB6AC, #26C6DA)', 
                  WebkitBackgroundClip: 'text', 
                  WebkitTextFillColor: 'transparent',
                  margin: 0
                }}>
                  {new Set(filteredProducts.flatMap(p => p.sites?.map(s => s.name) || [])).size}
                </h3>
                <Globe size={20} color="#4DB6AC" style={{ opacity: 0.8 }} />
              </div>
              <p style={{ color: '#666', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600', marginTop: '4px' }}>
                Providers
              </p>
            </div>
          </div>

          {/* Insurance Plans Grid - 2 Columns */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(2, 1fr)', 
            gap: '20px', 
            marginTop: '24px',
            width: '100%'
          }}>
            {filteredProducts.length === 0 ? (
              <div style={{ 
                gridColumn: '1 / -1', 
                textAlign: 'center', 
                padding: '40px', 
                background: '#f9fafb', 
                borderRadius: '12px' 
              }}>
                <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px', color: '#1a1a1a' }}>No insurance plans found</h2>
                <p style={{ color: '#666' }}>Try adjusting your search or filters.</p>
              </div>
            ) : (
              filteredProducts.map(product => (
                <div key={product.id} className="deck-card" style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  overflow: 'hidden'
                }}>
                  <div className="deck-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px', flexWrap: 'wrap' }}>
                    <h3 className="deck-title hero-gradient" style={{ 
                      flex: '1 1 100%',
                      marginBottom: '8px',
                      wordBreak: 'break-word',
                      overflowWrap: 'break-word'
                    }}>
                      {product.name}
                    </h3>
                    
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                      {/* Product Type */}
                      {product.type && (
                        <span style={{ 
                          background: '#1976D2',
                          color: '#ffffff', 
                          padding: '4px 10px', 
                          borderRadius: '6px', 
                          fontSize: '11px', 
                          fontWeight: '700',
                          textTransform: 'uppercase',
                          boxShadow: '0 2px 4px rgba(25, 118, 210, 0.2)'
                        }}>
                          {product.type}
                        </span>
                      )}
                      
                      {/* Premium */}
                      <span style={{ 
                        background: 'linear-gradient(135deg, #E91E63, #FF4081)',
                        color: '#ffffff', 
                        padding: '6px 12px', 
                        borderRadius: '8px', 
                        fontSize: '12px', 
                        fontWeight: '800',
                        boxShadow: '0 2px 8px rgba(233, 30, 99, 0.3)',
                        whiteSpace: 'nowrap'
                      }}>
                        {product.avg_premium}
                      </span>
                    </div>
                  </div>
                  
                  <p className="deck-subtitle" style={{ 
                    color: '#111827', 
                    fontSize: '0.9rem', 
                    marginTop: '12px', 
                    lineHeight: '1.5',
                    wordBreak: 'break-word',
                    overflowWrap: 'break-word'
                  }}>
                    {product.personalization}
                  </p>
                  
                  <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ 
                      fontSize: '11px', 
                      fontWeight: '700', 
                      color: '#555555',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      marginBottom: '4px'
                    }}>
                      Offered By ({product.sites?.length || 0} providers)
                    </div>
                    
                    {product.sites?.map((site, idx) => (
                      <div key={idx} style={{
                        borderRadius: '12px',
                        border: '1px solid rgba(233, 30, 99, 0.15)',
                        background: 'rgba(255, 245, 248, 0.5)',
                        padding: '12px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        transition: 'all 0.2s ease'
                      }}>
                        <span style={{ fontWeight: '600', color: '#1a1a1a', fontSize: '13px' }}>
                          {site.name}
                        </span>
                        
                        <a 
                          href={site.link} 
                          target="_blank" 
                          rel="noreferrer"
                          className="btn primary small" 
                          style={{ 
                            padding: '6px 12px', 
                            fontSize: '11px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          View Plan <ExternalLink size={10} />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

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
            <a href="#start">Start</a>
            <span>·</span>
            <a href="#forum">Live Q&A</a>
            <span>·</span>
            <a href="#safety">Safety</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default WomenInsuranceProductCatlg;