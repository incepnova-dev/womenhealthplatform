import React, { useState } from 'react';
import { Search, Star, TrendingUp, ExternalLink, AlertCircle, Pill, Heart, Activity } from 'lucide-react';
import '../styles/womenhealthprods.css'; // Importing your CSS file
import healthData from "../data/womenhealthproducts.json";

const WomenHealthProducts = () => {

   //Destructure the data for use in the component
   const { categories, products } = healthData;

   const [selectedCategory, setSelectedCategory] = useState('all');
   const [searchQuery, setSearchQuery] = useState('');
   const [selectedProduct, setSelectedProduct] = useState(null);
   const [priceFilter, setPriceFilter] = useState('all');

   

   const filteredProducts = products.filter(product => {
   const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
   const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesPrice = true;
    if (priceFilter !== 'all') {
        const lowestPrice = Math.min(...product.sites.map(s => {
          const price = parseInt(s.priceRange.replace(/[₹,\-]/g, '').split(' ')[0]);
          return isNaN(price) ? 0 : price; // Fallback to 0 if parsing fails
        }));      
      if (priceFilter === 'under200') matchesPrice = lowestPrice < 200;
      if (priceFilter === '200to500') matchesPrice = lowestPrice >= 200 && lowestPrice <= 500;
      if (priceFilter === 'over500') matchesPrice = lowestPrice > 500;
    }
    
    return matchesCategory && matchesSearch && matchesPrice;
  });

  const getBestPriceRange = (sites) => {
    const prices = sites.map(s => {
      const match = s.priceRange.match(/₹(\d+,?\d*)/);
      return match ? parseInt(match[1].replace(',', '')) : 999999;
    });
    return Math.min(...prices);
  };

  const getBestDeal = (sites) => {
    return sites.reduce((best, current) => {
      const bestPrice = parseInt(best.priceRange.replace(/[₹,\-]/g, '').split(' ')[0]);
      const currentPrice = parseInt(current.priceRange.replace(/[₹,\-]/g, '').split(' ')[0]);
      return currentPrice < bestPrice ? current : best;
    });
  };

  return (
    <div className="page-shell">
      {/* Top Navigation Bar */}
      <header className="top-bar">
        <div className="top-bar-inner">
          <div className="brand-block">
            <div className="brand-logo">🌸</div>
            <div className="brand-text">
              <span className="brand-title">Nari Swasthya Mukabala</span>
              <span className="brand-subtitle">Women's Wellness Directory</span>
            </div>
          </div>
          <nav className="nav-links">
            <a href="#">Products</a>
            <a href="#">Community</a>
            <a href="#">Resources</a>
          </nav>
          <div className="top-bar-cta">
            <span className="pill-tag">Live Prices</span>
            <button className="btn primary small">Sign In</button>
          </div>
        </div>
      </header>

      <main className="main">
        <div className="content-wrap" style={{ gridTemplateColumns: '1fr' }}>
          {/* Hero Section - Search & Stats */}
          <section className="hero-card">
            <div className="hero-badge-row">
              <div className="hero-badge-left">
                <div className="hero-chip">
                  <span className="dot"></span> 24/7 Price Tracking
                </div>
                <div className="hero-chip">Certified Retailers Only</div>
              </div>
            </div>
            
            <h1 className="hero-title">
               Find the <span className="highlight-soft"> Best <span className="hero-gradient">  <span className="highlight">Care For Less</span></span></span>
            </h1>
            <p className="hero-subtitle">
              Compare prices for essential women's health products across India's top pharmacies. 
              Real-time updates for contraceptives, prenatal care, and daily wellness.
            </p>

           <div className="mode-toggle-row" style={{ flexDirection: 'column', gap: '20px' }}>
              <div className="field" style={{ width: '100%' }}>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search medicines, brands, or symptoms..."
                    className="w-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
                <div className="mode-toggle-buttons" style={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', // This allows buttons to drop to the next line
                  gap: '10px', 
                  justifyContent: 'center', 
                  padding: '15px' 
                }}>
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`mode-toggle-button ${selectedCategory === cat.id ? 'active' : ''}`}
                      style={{ whiteSpace: 'nowrap' }}
                    >
                      {cat.icon} {cat.name}
                    </button>
                  ))}
                </div>
            </div>
          </section>

          {/* Alert Box using CSS style */}
          <div className="safety-card" style={{ borderLeft: '4px solid var(--primary)', marginTop: '20px' }}>
            <div className="flex gap-3">
              <AlertCircle size={18} className="text-primary" />
              <div>
                <h2 style={{ marginBottom: '2px' }}>Pharmacist's Note</h2>
                <p className="safety-tagline">Prices are illustrative. Click "Check Price" for the final checkout value including shipping.</p>
              </div>
            </div>
          </div>

          {/* Product Grid - Using Deck Shell Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {filteredProducts.map(product => {
              const bestDeal = getBestDeal(product.sites);
              return (
                <div key={product.id} className="deck-card">
                  <div className="deck-header">
                    <h3 className="deck-title hero-gradient">{product.name}</h3>
                    <span className="deck-pill">₹{bestDeal.priceRange.split('-')[0]} min</span>
                  </div>
                  <p className="deck-subtitle">{product.description}</p>
                  
                  <div className="deck-fields mt-2">
                    {product.sites.map((site, idx) => (
                      <div key={idx} className="feed-item" style={{ 
                        borderColor: site.name === bestDeal.name ? 'var(--primary)' : 'var(--border-subtle)',
                        background: site.name === bestDeal.name ? 'var(--primary-soft)' : ''
                      }}>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <span>{site.logo}</span>
                            <span className="feed-item-title">{site.name}</span>
                            {site.name === bestDeal.name && <TrendingUp size={12} color="#22c55e" />}
                          </div>
                          <span className="font-bold">{site.priceRange}</span>
                        </div>
                        <div className="feed-item-meta mt-1">
                          <div className="flex items-center gap-2">
                            <span className="flex items-center gap-1"><Star size={10} fill="gold" stroke="none"/> {site.rating}</span>
                            <span className="feed-tag">{site.delivery}</span>
                          </div>
                          <a href={site.link} target="_blank" className="btn primary small" style={{ padding: '2px 8px', fontSize: '10px' }}>
                            View <ExternalLink size={10} />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
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

export default WomenHealthProducts;