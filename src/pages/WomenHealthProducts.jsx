import React, { useState, useEffect } from 'react';
import { Search, Star, TrendingUp, ExternalLink, AlertCircle, Pill, Heart, Activity, ShoppingBag } from 'lucide-react';
import healthData from "../data/womenhealthproducts.json";

const WomenHealthProducts = () => {
  const [healthData, setHealthData] = useState({ categories: [], products: [] });
  
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('womenhealthproducts.json');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const jsonData = await response.json();
        setHealthData(jsonData);
      } catch (error) {
        console.error('Error loading products data:', error);
      }
    };
    loadData();
  }, []);

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
        return isNaN(price) ? 0 : price;
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
                  <span className="dot" style={{ backgroundColor: '#fff' }}></span> 
                  24/7 Price Tracking
                </div>
                <div className="hero-chip" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)' }}>
                  Certified Retailers Only
                </div>
              </div>
              
              <h1 className="hero-title" style={{ color: '#ffffff', fontSize: '36px', fontWeight: '800', marginTop: '16px' }}>
                Find the Best Care For Less
              </h1>
              <p className="hero-subtitle" style={{ color: 'rgba(255,255,255,0.9)', maxWidth: '500px', lineHeight: '1.6' }}>
                Compare prices for essential women's health products across India's top pharmacies. Real-time updates for contraceptives, prenatal care, and daily wellness.
              </p>
            </div>

            {/* Icon on the extreme right */}
            <div style={{ marginLeft: '20px', opacity: 0.9 }}>
              <ShoppingBag size={80} strokeWidth={1.5} color="white" />
            </div>
          </section>

          {/* Search & Filters */}
          <div className="mode-toggle-row" style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '2px', width: '100%' }}>
            {/* Search Field */}
            <div className="field" style={{ width: '100%' }}>
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
                <Search size={12} /> Search Products
              </label>
              <input
                type="text"
                placeholder="Search medicines, brands, or symptoms..."
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

            {/* Category Filters */}
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
                <Pill size={12} /> Filter By Category
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
                    {cat.icon} {cat.name}
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
                Pharmacist's Note
              </h3>
              <p style={{ fontSize: '12px', color: '#555555', lineHeight: '1.5', margin: 0 }}>
                Prices are illustrative. Click "View" for the final checkout value including shipping.
              </p>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="stats-grid" style={{ display: 'flex', gap: '16px', marginTop: '24px', marginBottom: '24px', flexWrap: 'wrap' }}>
            {/* Products Count */}
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
                <ShoppingBag size={20} color="#E91E63" style={{ opacity: 0.8 }} />
              </div>
              <p style={{ color: '#666', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600', marginTop: '4px' }}>
                Products
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
                <Pill size={20} color="#FFB300" style={{ opacity: 0.8 }} />
              </div>
              <p style={{ color: '#666', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600', marginTop: '4px' }}>
                Categories
              </p>
            </div>

            {/* Retailers Count */}
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
                  {new Set(filteredProducts.flatMap(p => p.sites.map(s => s.name))).size}
                </h3>
                <Star size={20} color="#4DB6AC" style={{ opacity: 0.8 }} />
              </div>
              <p style={{ color: '#666', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600', marginTop: '4px' }}>
                Retailers
              </p>
            </div>
          </div>

          {/* Product Grid - 2 Columns */}
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
                <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px', color: '#1a1a1a' }}>No products found</h2>
                <p style={{ color: '#666' }}>Try adjusting your search or filters.</p>
              </div>
            ) : (
              filteredProducts.map(product => {
                const bestDeal = getBestDeal(product.sites);
                return (
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
                        <span style={{ 
                          background: 'linear-gradient(135deg, #E91E63, #FF4081)',
                          color: '#ffffff', 
                          padding: '6px 12px', 
                          borderRadius: '8px', 
                          fontSize: '12px', 
                          fontWeight: '800',
                          boxShadow: '0 2px 8px rgba(233, 30, 99, 0.3)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          From {bestDeal.priceRange.split('-')[0]}
                        </span>
                        
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
                          {product.category}
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
                      {product.description}
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
                        Available At ({product.sites.length} retailers)
                      </div>
                      
                      {product.sites.map((site, idx) => (
                        <div key={idx} style={{
                          borderRadius: '12px',
                          border: site.name === bestDeal.name ? '2px solid #E91E63' : '1px solid rgba(233, 30, 99, 0.15)',
                          background: site.name === bestDeal.name ? 'rgba(233, 30, 99, 0.05)' : 'rgba(255, 245, 248, 0.5)',
                          padding: '12px',
                          transition: 'all 0.2s ease'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ fontSize: '18px' }}>{site.logo}</span>
                              <span style={{ fontWeight: '600', color: '#1a1a1a', fontSize: '13px' }}>{site.name}</span>
                              {site.name === bestDeal.name && (
                                <span style={{
                                  background: '#22c55e',
                                  color: 'white',
                                  padding: '2px 6px',
                                  borderRadius: '4px',
                                  fontSize: '9px',
                                  fontWeight: '700',
                                  textTransform: 'uppercase'
                                }}>
                                  Best Price
                                </span>
                              )}
                            </div>
                            <span style={{ fontWeight: '800', color: '#E91E63', fontSize: '14px' }}>
                              {site.priceRange}
                            </span>
                          </div>
                          
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '11px', color: '#666' }}>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Star size={12} fill="#FFB300" stroke="none"/> 
                                <span style={{ fontWeight: '600' }}>{site.rating}</span>
                              </span>
                              <span style={{
                                padding: '3px 8px',
                                borderRadius: '6px',
                                background: 'rgba(233, 30, 99, 0.08)',
                                border: '1px solid rgba(233, 30, 99, 0.2)',
                                fontSize: '10px',
                                fontWeight: '600',
                                color: '#333333'
                              }}>
                                {site.delivery}
                              </span>
                            </div>
                            
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
                              View <ExternalLink size={10} />
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })
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

export default WomenHealthProducts;