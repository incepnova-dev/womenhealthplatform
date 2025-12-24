import React, { useState, useEffect } from 'react';
import { Search, Filter, ExternalLink } from 'lucide-react';
import '../styles/womencommdb.css';

const WomenHealthCommunitiesDashboard = () => {
  const [data, setData] = useState({
    metadata: { generated_at: '', total_communities: 0, total_hashtags: 0, platforms: [], categories: [], total_members: 0 },
    communities: []
  });

  const [filteredCommunities, setFilteredCommunities] = useState([]);
  const totalMembers = data.metadata?.total_members || 0;
  const [currentSort, setCurrentSort] = useState('members-desc');
  const [filters, setFilters] = useState({ platform: 'all', category: 'all', search: '', tag: '' });

  const formatMillions = (num) =>
    (num / 1_000_000).toLocaleString(undefined, {
      maximumFractionDigits: 1,
    }) + 'M';


  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('communities_directory.json');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const jsonData = await response.json();
        setData(jsonData);
        setFilteredCommunities(jsonData.communities || []);
      } catch (error) {
        console.error('Error loading communities data:', error);
      }
    };
    loadData();
  }, []);

  // STRICT FILTERING & SORTING LOGIC
  useEffect(() => {
    let result = [...(data.communities || [])];

    // 1. Filter by Platform (Strict - Case Insensitive)
    if (filters.platform !== 'all') {
      result = result.filter(comm => {
        if (!comm.platform) return false;
        
        const platformMatch = comm.platform.toLowerCase() === filters.platform.toLowerCase();
        
        // Extra check: Exclude Reddit communities by checking community name pattern
        const isReddit = comm.community_name && (
          comm.community_name.startsWith('r/') || 
          comm.url && comm.url.includes('reddit.com')
        );
        
        // If filtering for non-Reddit platforms, exclude Reddit communities
        if (filters.platform.toLowerCase() !== 'reddit' && isReddit) {
          return false;
        }
        
        return platformMatch;
      });
    }

    // 2. Filter by Category
    if (filters.category !== 'all') {
      result = result.filter(comm => comm.category === filters.category);
    }

    // 3. Filter by Search
    const searchTerm = filters.search.trim().toLowerCase();
    if (searchTerm) {
      result = result.filter(comm => 
        (comm.community_name && comm.community_name.toLowerCase().includes(searchTerm)) ||
        (comm.content && comm.content.toLowerCase().includes(searchTerm))
      );
    }

    // 4. Filter by Tag
    const tagInput = filters.tag.trim().toLowerCase();
    if (tagInput) {
      const tokens = tagInput.split(',').map(t => t.trim().replace(/^#/, ''));
      result = result.filter(comm => {
        const sourceVal = (comm.source || '').toLowerCase();
        return tokens.some(t => sourceVal.includes(t));
      });
    }

    // 5. Sort ONLY the filtered results
    const [field, direction] = currentSort.split('-');
    result.sort((a, b) => {
      let aVal = 0, bVal = 0;
      if (field === 'members') {
        aVal = parseInt(a.number_members) || 0;
        bVal = parseInt(b.number_members) || 0;
      } else if (field === 'engagement') {
        aVal = parseFloat(a.engagement_score) || 0;
        bVal = parseFloat(b.engagement_score) || 0;
      }
      return direction === 'desc' ? bVal - aVal : aVal - bVal;
    });

    setFilteredCommunities(result);
  }, [filters, currentSort, data]);

  const resetFilters = () => {
    setFilters({ platform: 'all', category: 'all', search: '', tag: '' });
    setCurrentSort('members-desc');
  };

  return (
    <div className="page-shell">
      <header className="top-bar">
        <div className="top-bar-inner">
          <div className="brand-block">
          <div className="brand-logo">🌸</div>
            <div className="brand-text">
              <span className="brand-title">Nari Swasthya Samuday Samooh</span>
              <span className="brand-subtitle">Connect & Support Network</span>
            </div>
          </div>
        </div>
      </header>

      <main className="main">
        <div className="content-wrap" style={{ gridTemplateColumns: '1fr' }}>
          {/* Hero Section */}
          <section className="hero-card">
            <div className="hero-badge-row">
              <div className="hero-chip">
                <span className="dot"></span> {filteredCommunities.length} Active Communities
              </div>
            </div>
            <h1 className="hero-title">
              Discover <span className="highlight-soft"> Your <span className="hero-gradient"><span className="highlight"> Support Community</span></span></span>
            </h1>
            <p className="hero-subtitle">
              Connect with supportive communities across all platforms - from Reddit and Facebook to Instagram and Quora.
            </p>


            {/* Search & Filters */}
           {/* Search & Filters */}
<div className="mode-toggle-row" style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '24px', width: '100%' }}>
  {/* Row 1: Search (left) + Platform (right) */}
  {/* Search, Tags & Platform in one row */}
<div
  className="filter-row"
  style={{
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 2fr) 180px minmax(0, 3fr)',
    gap: '12px',
    width: '100%',
    alignItems: 'flex-start',
    marginTop: '24px',
  }}
>
  {/* Search */}
  <div className="field">
    <label
      style={{
        fontSize: '11px',
        color: 'var(--text-soft)',
        display: 'block',
      }}
    >
      Search
    </label>
    <input
      type="text"
      placeholder="Search communities or topics..."
      value={filters.search}
      onChange={e =>
        setFilters(prev => ({ ...prev, search: e.target.value }))
      }
    />
  </div>

    {/* Tags */}
    <div className="field">
      <label>Tags</label>
      <input
        type="text"
        placeholder="#pcos, #endometriosis..."
        value={filters.tag}
        onChange={e =>
          setFilters(prev => ({ ...prev, tag: e.target.value }))
        }
      />
    </div>

    {/* Platform filter buttons */}
    <div style={{ width: '100%' }}>
      <p
        style={{
          fontSize: '11px',
          fontWeight: 'bold',
          color: 'var(--text-muted)',
          marginBottom: '2px',
        }}
      >
        FILTER BY PLATFORM
      </p>
      <div
        className="mode-toggle-buttons"
        style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}
      >
        <button
          onClick={() =>
            setFilters(prev => ({ ...prev, platform: 'all' }))
          }
          className={`mode-toggle-button ${
            filters.platform === 'all' ? 'active' : ''
          }`}
        >
          All Platforms
        </button>
        {data.metadata.platforms.map(p => (
          <button
            key={p}
            onClick={() =>
              setFilters(prev => ({ ...prev, platform: p }))
            }
            className={`mode-toggle-button ${
              filters.platform === p ? 'active' : ''
            }`}
          >
            {p}
          </button>
        ))}
      </div>
    </div>
</div>

{/* Sort + Reset in same row */}
<div
  style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    marginBottom: '2px',
    width: '100%',
  }}
>
  <label
    style={{
      fontSize: '11px',
      fontWeight: 'bold',
      color: 'var(--text-muted)',
    }}
  >
    Sort By
  </label>

  <div
    style={{
      display: 'flex',
      alignItems: 'flex-end',   // reset aligns with bottom of buttons
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
        className={`mode-toggle-button ${
          currentSort === 'members-desc' ? 'active' : ''
        }`}
        onClick={() => setCurrentSort('members-desc')}
      >
        Highest Members
      </button>
      <button
        className={`mode-toggle-button ${
          currentSort === 'members-asc' ? 'active' : ''
        }`}
        onClick={() => setCurrentSort('members-asc')}
      >
        Lowest Members
      </button>
      <button
        className={`mode-toggle-button ${
          currentSort === 'engagement-desc' ? 'active' : ''
        }`}
        onClick={() => setCurrentSort('engagement-desc')}
      >
        Highest Engagement
      </button>
      <button
        className={`mode-toggle-button ${
          currentSort === 'engagement-asc' ? 'active' : ''
        }`}
        onClick={() => setCurrentSort('engagement-asc')}
      >
        Lowest Engagement
      </button>
    </div>

    {/* reset, same row, slightly lower via alignItems:flex-end */}
    <button
      className="btn secondary small"
      onClick={resetFilters}
      style={{ whiteSpace: 'nowrap' }}
    >
      Reset All Filters
    </button>
  </div>
</div></div>

          </section>

          {/* Stats Overview */}
          <div className="stats-grid">
            <div className="stat-card">
              <h3>{filteredCommunities.length}</h3>
              <p>Communities</p>
            </div>
            <div className="stat-card">
              <h3>{new Set(filteredCommunities.map(c => c.platform)).size}</h3>
              <p>Platforms</p>
            </div>
            <div className="stat-card">
              <h3>{new Set(filteredCommunities.map(c => c.category)).size}</h3>
              <p>Categories</p>
            </div>
            <div className="stat-card">
                <h3>{formatMillions(totalMembers)}</h3>
              <p>Total Members</p>
            </div>
          </div>

          {/* Communities Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {filteredCommunities.map(comm => {
              const platformClass = `platform-${comm.platform.toLowerCase().replace('/', '-').replace(' ', '-')}`;
              
              return (
                <div key={comm.id} className="deck-card">
                  <div className="deck-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                    <h3 className="deck-title hero-gradient" style={{ flex: 1 }}>{comm.community_name}</h3>
                    
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
                      <span className={`platform-badge ${platformClass}`}>
                        {comm.platform}
                      </span>
                      {comm.engagement_score && (
                        <span className="engagement-badge">
                          Engagement: {comm.engagement_score}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                    <span style={{ fontSize: '10px', fontWeight: 'bold', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    </span>
                    <span className="category-tag">{comm.category}</span>
                  </div>
                  
                  <p className="deck-subtitle" style={{ color: 'var(--text-soft)', fontSize: '0.9rem', marginTop: '12px', lineHeight: '1.5' }}>
                    {comm.content || comm.title}
                  </p>

                  <div className="deck-footer" style={{ marginTop: '16px' }}>
                    <span className="members-count">
                      👥 {(comm.number_members || 0).toLocaleString()} members
                    </span>
                    <a href={comm.url} target="_blank" rel="noreferrer" className="btn primary small">
                      View Community <ExternalLink size={12} style={{ marginLeft: '4px' }} />
                    </a>
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

export default WomenHealthCommunitiesDashboard;