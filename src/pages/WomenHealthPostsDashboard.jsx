import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  ExternalLink, 
  Calendar, 
  User, 
  MessageCircle, 
  Eye, 
  ArrowUp,
  Globe,
  Layers,
  TrendingUp,
  ArrowUpDown,
  LayoutGrid,
  RotateCcw,
  MessageSquare
} from 'lucide-react';

const WomenHealthPostsDashboard = () => {
  const [data, setData] = useState({
    last_updated: '',
    total: 0,
    discussions: [],
    metadata: []
  });
  const [filteredData, setFilteredData] = useState([]);
  const [currentSort, setCurrentSort] = useState('date-desc');
  const [filters, setFilters] = useState({
    platform: 'all',
    category: 'all',
    search: '',
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('complete_health_data.json');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const jsonData = await response.json();
        setData(jsonData || { last_updated: '', total: 0, discussions: [], metadata: [] });
        setFilteredData(jsonData?.discussions || []);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const discussions = data.discussions || [];

    let result = discussions.filter(post => {
      const matchesPlatform =
        filters.platform === 'all' || post.platform === filters.platform;
      const matchesCategory =
        filters.category === 'all' || post.category === filters.category;
      const search = filters.search.trim().toLowerCase();
      const matchesSearch =
        !search ||
        post.title?.toLowerCase().includes(search) ||
        post.content?.toLowerCase().includes(search);
      return matchesPlatform && matchesCategory && matchesSearch;
    });

    const [field, direction] = currentSort.split('-');
    result.sort((a, b) => {
      let aVal;
      let bVal;
      if (field === 'date') {
        aVal = new Date(a.created_utc || a.published_at || 0).getTime();
        bVal = new Date(b.created_utc || b.published_at || 0).getTime();
      } else {
        aVal = a.engagement_score || 0;
        bVal = b.engagement_score || 0;
      }
      return direction === 'desc' ? bVal - aVal : aVal - bVal;
    });

    setFilteredData(result);
  }, [filters, currentSort, data]);

  const resetFilters = () => {
    setFilters({ platform: 'all', category: 'all', search: '' });
    setCurrentSort('date-desc');
  };

  const totalEngagement = filteredData.reduce(
    (sum, d) => sum + (d.engagement_score || 0),
    0
  );
  const avgEngagement = filteredData.length
    ? Math.round(totalEngagement / filteredData.length)
    : 0;
  const platformCount = new Set(filteredData.map(d => d.platform)).size;
  const categoryCount = new Set(filteredData.map(d => d.category)).size;
  const discussions = data.discussions || [];
  const platforms = [...new Set(discussions.map(d => d.platform))].sort();
  const categories = [...new Set(discussions.map(d => d.category))].sort();

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <div className="page-shell">
      <header className="top-bar">
        <div className="top-bar-inner">
          <div className="brand-block">
            <div className="brand-logo">💬</div>
            <div className="brand-text">
              <span className="brand-title">Nari Swasthya Charcha</span>
              <span className="brand-subtitle">Real Stories & Experiences</span>
            </div>
          </div>
        </div>
      </header>

      <main className="main">
        <div className="content-wrap" style={{ 
          gridTemplateColumns: '1fr', 
          padding: '0 20px',
          maxWidth: '1400px',
          margin: '0 auto',
          width: '100%'
        }}>
          {/* Hero Section - Matching Communities Dashboard */}
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
                  {filteredData.length} Active Discussions
                </div>
                {data.last_updated && (
                  <div className="hero-chip" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)' }}>
                    Last Updated: {new Date(data.last_updated).toLocaleDateString()}
                  </div>
                )}
              </div>
              
              <h1 className="hero-title" style={{ color: '#ffffff', fontSize: '36px', fontWeight: '800', marginTop: '16px' }}>
                Discover Real Health Stories
              </h1>
              <p className="hero-subtitle" style={{ color: 'rgba(255,255,255,0.9)', maxWidth: '500px', lineHeight: '1.6' }}>
                Explore authentic conversations and lived experiences from healthcare-focused communities across the world.
              </p>
            </div>

            {/* Icon on the extreme right */}
            <div style={{ marginLeft: '20px', opacity: 0.9 }}>
              <MessageSquare size={80} strokeWidth={1.5} color="white" />
            </div>
          </section>

          {/* Search & Filters */}
          <div className="mode-toggle-row" style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '2px', width: '100%' }}>
            {/* Row 1: Search, Platform & Category */}
            <div
              className="filter-row"
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr',
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
                  <Search size={12} /> Search
                </label>
                <input
                  type="text"
                  placeholder="Search posts by title or content..."
                  value={filters.search}
                  style={{ border: '1px solid #eee', borderRadius: '8px', padding: '10px' }}
                  onChange={e =>
                    setFilters(prev => ({ ...prev, search: e.target.value }))
                  }
                />
              </div>

              {/* Platform */}
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
                  <Globe size={12} /> Platform
                </label>
                <select
                  value={filters.platform}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #eee' }}
                  onChange={e =>
                    setFilters(prev => ({
                      ...prev,
                      platform: e.target.value,
                    }))
                  }
                >
                  <option value="all">All Platforms</option>
                  {platforms.map(p => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category */}
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
                  <LayoutGrid size={12} /> Category
                </label>
                <select
                  value={filters.category}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #eee' }}
                  onChange={e =>
                    setFilters(prev => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                >
                  <option value="all">All Categories</option>
                  {categories.map(c => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 2: Sort + Reset */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                width: '100%',
              }}
            >
              <label
                style={{
                  fontSize: '11px',
                  fontWeight: '700',
                  color: '#E91E63',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  transform: 'translateY(2px)',
                  marginTop: '2px'
                }}
              >
                <ArrowUpDown size={12} /> SORT BY
              </label>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-end',
                  gap: '8px',
                  width: '100%',
                }}
              >
                {/* sorting buttons row */}
                <div
                  className="mode-toggle-buttons"
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '6px',
                    flex: 1,
                  }}
                >
                  <button
                    className={`mode-toggle-button ${currentSort === 'date-desc' ? 'active' : ''}`}
                    style={currentSort === 'date-desc' ? { background: '#E91E63', color: '#fff', border: 'none' } : {}}
                    onClick={() => setCurrentSort('date-desc')}
                  >
                    Newest First
                  </button>

                  <button
                    className={`mode-toggle-button ${currentSort === 'date-asc' ? 'active' : ''}`}
                    style={currentSort === 'date-asc' ? { background: '#E91E63', color: '#fff', border: 'none' } : {}}
                    onClick={() => setCurrentSort('date-asc')}
                  >
                    Oldest First
                  </button>

                  <button
                    className={`mode-toggle-button ${currentSort === 'engagement-desc' ? 'active' : ''}`}
                    style={currentSort === 'engagement-desc' ? { background: '#E91E63', color: '#fff', border: 'none' } : {}}
                    onClick={() => setCurrentSort('engagement-desc')}
                  >
                    Highest Engagement
                  </button>

                  <button
                    className={`mode-toggle-button ${currentSort === 'engagement-asc' ? 'active' : ''}`}
                    style={currentSort === 'engagement-asc' ? { background: '#E91E63', color: '#fff', border: 'none' } : {}}
                    onClick={() => setCurrentSort('engagement-asc')}
                  >
                    Lowest Engagement
                  </button>
                </div>

                {/* reset */}
                <button
                  className="btn secondary small"
                  onClick={resetFilters}
                  style={{ 
                    whiteSpace: 'nowrap', 
                    borderColor: '#E91E63', 
                    color: '#E91E63', 
                    background: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '8px 16px',
                    height: '38px'
                  }}
                >
                  <RotateCcw size={14} /> Reset Filters
                </button>
              </div>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="stats-grid" style={{ gap: '32px', marginBottom: '24px', flexWrap: 'wrap' }}>
            {/* 1. Discussions Card - Pink */}
            <div className="stat-card" style={{ borderTop: '4px solid #E91E63', background: '#ffffff', flex: 1, minWidth: '150px', padding: '16px', position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h3 style={{ 
                  fontSize: '32px', 
                  fontWeight: '800', 
                  background: 'linear-gradient(135deg, #E91E63, #FF4081)', 
                  WebkitBackgroundClip: 'text', 
                  WebkitTextFillColor: 'transparent',
                  margin: 0
                }}>
                  {filteredData.length}
                </h3>
                <MessageCircle size={20} color="#E91E63" style={{ opacity: 0.8 }} />
              </div>
              <p style={{ color: '#666', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600', marginTop: '4px' }}>
                Discussions
              </p>
            </div>

            {/* 2. Platforms Card - Blue */}
            <div className="stat-card" style={{ borderTop: '4px solid #2196F3', background: '#ffffff', flex: 1, minWidth: '150px', padding: '16px', position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h3 style={{ 
                  fontSize: '32px', 
                  fontWeight: '800', 
                  background: 'linear-gradient(135deg, #2196F3, #21CBF3)', 
                  WebkitBackgroundClip: 'text', 
                  WebkitTextFillColor: 'transparent',
                  margin: 0
                }}>
                  {platformCount}
                </h3>
                <Globe size={20} color="#2196F3" style={{ opacity: 0.8 }} />
              </div>
              <p style={{ color: '#666', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600', marginTop: '4px' }}>
                Platforms
              </p>
            </div>

            {/* 3. Categories Card - Deep Yellow */}
            <div className="stat-card" style={{ borderTop: '4px solid #FFB300', background: '#ffffff', flex: 1, minWidth: '150px', padding: '16px', position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h3 style={{ 
                  fontSize: '32px', 
                  fontWeight: '800', 
                  background: 'linear-gradient(135deg, #FFB300, #F48116)', 
                  WebkitBackgroundClip: 'text', 
                  WebkitTextFillColor: 'transparent',
                  margin: 0
                }}>
                  {categoryCount}
                </h3>
                <Layers size={20} color="#FFB300" style={{ opacity: 0.8 }} />
              </div>
              <p style={{ color: '#666', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600', marginTop: '4px' }}>
                Categories
              </p>
            </div>

            {/* 4. Avg Engagement Card - Teal */}
            <div className="stat-card" style={{ borderTop: '4px solid #4DB6AC', background: '#ffffff', flex: 1, minWidth: '150px', padding: '16px', position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h3 style={{ 
                  fontSize: '32px', 
                  fontWeight: '800', 
                  background: 'linear-gradient(135deg, #4DB6AC, #26C6DA)', 
                  WebkitBackgroundClip: 'text', 
                  WebkitTextFillColor: 'transparent',
                  margin: 0
                }}>
                  {formatNumber(avgEngagement)}
                </h3>
                <TrendingUp size={20} color="#4DB6AC" style={{ opacity: 0.8 }} />
              </div>
              <p style={{ color: '#666', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600', marginTop: '4px' }}>
                Avg Engagement
              </p>
            </div>
          </div>

          {/* Posts Grid */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(2, 1fr)', 
            gap: '20px', 
            marginTop: '24px',
            width: '100%'
          }}>
            {filteredData.length === 0 ? (
              <div style={{ 
                gridColumn: '1 / -1', 
                textAlign: 'center', 
                padding: '40px', 
                background: '#f9fafb', 
                borderRadius: '12px' 
              }}>
                <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>No discussions found</h2>
                <p style={{ color: '#666' }}>Try adjusting your filters or search terms.</p>
              </div>
            ) : (
              filteredData.map((post, idx) => {
                const platformClass = `platform-${post.platform.toLowerCase().replace('/', '-').replace(' ', '-')}`;
                
                return (
                  <div key={idx} className="deck-card" style={{
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
                        {post.title}
                      </h3>
                      
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap', width: '100%' }}>
                        <span style={{ 
                          background: '#26A69A',
                          color: '#ffffff', 
                          padding: '4px 12px', 
                          borderRadius: '6px', 
                          fontSize: '11px', 
                          fontWeight: '700',
                          textTransform: 'uppercase',
                          boxShadow: '0 2px 4px rgba(38, 166, 154, 0.2)',
                          display: 'inline-flex',
                          alignItems: 'center'
                        }}>
                          {post.platform}
                        </span>

                        {post.engagement_score && (
                          <span style={{ 
                            background: '#4A5568',
                            color: '#ffffff', 
                            padding: '4px 10px', 
                            borderRadius: '6px', 
                            fontSize: '11px', 
                            fontWeight: '700',
                            textTransform: 'uppercase'
                          }}>
                            Engagement: {post.engagement_score}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                      <span className="category-tag" style={{ 
                        background: '#1976D2',
                        color: '#ffffff', 
                        padding: '4px 10px', 
                        borderRadius: '6px', 
                        fontSize: '11px', 
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        boxShadow: '0 2px 4px rgba(25, 118, 210, 0.2)',
                        letterSpacing: '0.5px'
                      }}>
                        {post.category}
                      </span>
                    </div>
                    
                    <p className="deck-subtitle" style={{ 
                      color: '#111827', 
                      fontSize: '0.9rem', 
                      marginTop: '12px', 
                      lineHeight: '1.5',
                      wordBreak: 'break-word',
                      overflowWrap: 'break-word'
                    }}>
                      {post.content
                        ? post.content.length > 280
                          ? `${post.content.substring(0, 280)}…`
                          : post.content
                        : 'No content available'}
                    </p>

                    {/* Post Stats */}
                    <div className="post-meta-stats" style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '12px', fontSize: '12px', color: '#666' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar size={14} />
                        {new Date(post.created_utc || post.published_at || 0).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                      {post.author && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <User size={14} />
                          {post.author}
                        </span>
                      )}
                      {post.score && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <ArrowUp size={14} />
                          {post.score}
                        </span>
                      )}
                      {post.num_comments && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <MessageCircle size={14} />
                          {post.num_comments}
                        </span>
                      )}
                      {post.views && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Eye size={14} />
                          {post.views.toLocaleString()}
                        </span>
                      )}
                    </div>

                    <div className="deck-footer" style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                      {post.url && (
                        <a href={post.url} target="_blank" rel="noreferrer" className="btn primary small">
                          View Discussion <ExternalLink size={12} style={{ marginLeft: '4px' }} />
                        </a>
                      )}
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

export default WomenHealthPostsDashboard;