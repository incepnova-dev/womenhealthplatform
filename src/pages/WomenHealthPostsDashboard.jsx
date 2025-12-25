import React, { useState, useEffect } from 'react';
import { Search, Filter, ExternalLink, Calendar, User, MessageCircle, Eye, ArrowUp } from 'lucide-react';
import '../styles/womenpostsdb.css';

const WomenHealthPostsDashboard = () => {
  const [data, setData] = useState({
    last_updated: '',
    total: 0,
    discussions: [],
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
        setData(jsonData || { last_updated: '', total: 0, discussions: [] });
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
        <div className="content-wrap" style={{ gridTemplateColumns: '1fr' }}>
          {/* Hero Section */}
          <section className="hero-card">
            <div className="hero-badge-row">
              <div className="hero-chip">
                <span className="dot"></span> {filteredData.length} Active Discussions
              </div>
              {data.last_updated && (
                <div className="hero-chip">
                  Last Updated: {new Date(data.last_updated).toLocaleDateString()}
                </div>
              )}
            </div>
            <h1 className="hero-title">
             Find and Learn <span className="highlight-soft"> From <span className="hero-gradient"><span className="highlight"> Others Lived Experiences </span></span></span>
            </h1>
            <p className="hero-subtitle">
              Explore real conversations, lived experiences, and community wisdom across the world from healthcare‑focused communities – spanning platforms - from Patient.info threads to Inspire answers.
            </p>

            {/* Search & Filters */}
            <div className="mode-toggle-row" style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '24px', width: '100%' }}>
              {/* Search, Platform & Category in one row */}
              <div
                className="filter-row"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr) minmax(0, 1fr)',
                  gap: '12px',
                  width: '100%',
                  alignItems: 'flex-start',
                }}
              >
                {/* Search */}
                <div className="field">
                  <label>Search</label>
                  <input
                    type="text"
                    placeholder="Search posts by title or content..."
                    value={filters.search}
                    onChange={e =>
                      setFilters(prev => ({ ...prev, search: e.target.value }))
                    }
                  />
                </div>

                {/* Platform */}
                <div className="field">
                  <label>Platform</label>
                  <select
                    value={filters.platform}
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
                  <label>Category</label>
                  <select
                    value={filters.category}
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

              {/* Sort + Reset in same row */}
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
                    fontWeight: 'bold',
                    color: 'var(--text-muted)',
                  }}
                >
                  Sort By
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
                      className={`mode-toggle-button ${
                        currentSort === 'date-desc' ? 'active' : ''
                      }`}
                      onClick={() => setCurrentSort('date-desc')}
                    >
                      Newest First
                    </button>
                    <button
                      className={`mode-toggle-button ${
                        currentSort === 'date-asc' ? 'active' : ''
                      }`}
                      onClick={() => setCurrentSort('date-asc')}
                    >
                      Oldest First
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

                  {/* reset button */}
                  <button
                    className="btn secondary small"
                    onClick={resetFilters}
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    Reset All Filters
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Stats Overview */}
          <div className="stats-grid">
            <div className="stat-card">
              <h3>{filteredData.length}</h3>
              <p>Discussions</p>
            </div>
            <div className="stat-card">
              <h3>{platformCount}</h3>
              <p>Platforms</p>
            </div>
            <div className="stat-card">
              <h3>{categoryCount}</h3>
              <p>Categories</p>
            </div>
            <div className="stat-card">
              <h3>{avgEngagement.toLocaleString()}</h3>
              <p>Avg Engagement</p>
            </div>
          </div>

          {/* Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {filteredData.length === 0 ? (
              <div className="no-results">
                <h2>No discussions found</h2>
                <p>Try adjusting your filters or search terms.</p>
              </div>
            ) : (
              filteredData.map((post, idx) => {
                const platformClass = `platform-${post.platform.toLowerCase().replace('/', '-').replace(' ', '-')}`;
                
                return (
                  <div key={idx} className="deck-card">
                    <div className="deck-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                      <h3 className="deck-title hero-gradient" style={{ flex: 1 }}>
                        {post.title}
                      </h3>
                      
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <span className={`platform-badge ${platformClass}`}>
                          {post.platform}
                        </span>
                        {post.engagement_score && (
                        <span className="engagement-badge">
                          Engagement: {post.engagement_score}
                        </span>
                        )}
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                      <span className="category-tag">{post.category}</span>
                    </div>
                    
                    <p className="deck-subtitle" style={{ color: 'var(--text-soft)', fontSize: '0.9rem', marginTop: '12px', lineHeight: '1.5' }}>
                      {post.content
                        ? post.content.length > 280
                          ? `${post.content.substring(0, 280)}…`
                          : post.content
                        : 'No content available'}
                    </p>

                    {/* Post Stats */}
                    <div className="post-meta-stats" style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '12px', fontSize: '12px', color: 'var(--text-muted)' }}>
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

                    <div className="deck-footer" style={{ marginTop: '16px' }}>
                      {post.url && (
                        <a href={post.url} target="_blank" rel="noreferrer" className="btn primary small" style={{ marginLeft: 'auto' }}>
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
          </div>
        </div>
      </footer>
    </div>
  );
};

export default WomenHealthPostsDashboard;