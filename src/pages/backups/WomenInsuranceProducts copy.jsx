import React, { useState } from 'react';
import { Search, Star, TrendingUp, ExternalLink, AlertCircle, Shield, CheckCircle, Filter } from 'lucide-react';
import '../styles/womeninsprods.css'; 
import insuranceData from "../data/womeninsurance.json";

const WomenInsuranceProducts = () => {
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
        <div className="content-wrap" style={{ gridTemplateColumns: '1fr' }}>
          {/* ... Hero Section remains the same ... */}
          <section className="hero-card">
            <div className="hero-badge-row">
              <div className="hero-chip"><Shield size={14} /> IRDAI Certified</div>
            </div>
            <h1>
            Secure <span className="highlight-soft"> Your <span className="hero-gradient"> <span className="highlight">Health & Future</span></span></span>
            </h1>

            <p className="hero-subtitle">
             Discover and connect with trusted insurance partners.
            </p>
            
            <div className="mode-toggle-row" style={{ flexDirection: 'column', gap: '20px' }}>
              <div className="field" style={{ width: '100%' }}>
                <input
                  type="text"
                  placeholder="Search providers or coverage types..."
                  className="w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="filter-row" style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-soft)' }}>
                   <Filter size={14} style={{ display: 'inline', marginRight: '5px' }} /> ANNUAL PREMIUM:
                </span>
                <select 
                  className="mode-toggle-button" 
                  style={{ background: 'var(--bg-soft)', color: 'white', border: '1px solid var(--border-subtle)', padding: '5px 15px' }}
                  value={priceFilter}
                  onChange={(e) => setPriceFilter(e.target.value)}
                >
                  <option value="all">All Budgets</option>
                  <option value="budget">Budget (Under ₹12k)</option>
                  <option value="mid">Mid-Range (₹12k - ₹22k)</option>
                  <option value="premium">Premium (Above ₹22k)</option>
                  <option value="varies">Flexible/Varies</option>
                </select>
              </div>

              <div className="mode-toggle-buttons" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                <button onClick={() => setSelectedCategory('all')} className={`mode-toggle-button ${selectedCategory === 'all' ? 'active' : ''}`}>All</button>
                {categories.map(cat => (
                  <button key={cat.id} onClick={() => setSelectedCategory(cat.id)} className={`mode-toggle-button ${selectedCategory === cat.id ? 'active' : ''}`}>
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {filteredProducts.map(product => (
              <div key={product.id} className="deck-card">
                <div className="deck-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                  <h3 className="deck-title hero-gradient" style={{ flex: 1 }}>{product.name}</h3>
                  
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    {/* NEW: Product Type Label */}
                    {product.type && (
                      <span className="product-type-label">
                        {product.type}
                      </span>
                    )}
                    
                    {/* Premium Cost */}
                    <span className="deck-pill" style={{ background: '#ffffff', color: '#000000', fontWeight: '800', whiteSpace: 'nowrap' }}>
                    {product.avg_premium}
                          </span>
                        </div>
                    </div>
                
                <p className="deck-subtitle" style={{ color: 'var(--text-main)', fontSize: '0.95rem', marginTop: '12px' }}>
                  {product.personalization}
                </p>

                <div className="deck-fields mt-4">
                  <p style={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--text-muted)', marginBottom: '10px' }}>OFFERED BY</p>
                  {product.sites?.map((site, idx) => (
                    <div key={idx} className="feed-item" style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      background: 'rgba(255,255,255,0.03)',
                      marginBottom: '8px'
                    }}>
                      <span className="feed-item-title">{site.name}</span>
                      <a href={site.link} target="_blank" rel="noreferrer" className="btn primary small" style={{ margin: 0 }}>
                        View Plan <ExternalLink size={12} style={{ marginLeft: '4px' }} />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            ))}
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
            <a href="#forum">Live Q&amp;A</a>
            <span>·</span>
            <a href="#safety">Safety</a>

          </div>
        </div>
      </footer>
    </div>
  );
};

export default WomenInsuranceProducts;