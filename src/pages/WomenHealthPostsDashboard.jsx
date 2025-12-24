import React, { useState, useEffect } from 'react';
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
      <main className="main">
        <div className="page-root">
          <div className="page-shell-inner">
            <div className="container">
              {/* HERO / HEADER */}
              <header className="header">
                <div className="hero-eyebrow">
                  <div className="hero-pill-dot">🌸</div>
                  <div className="hero-pill-text">
                    Navigating Support with Trusted Discussion Spaces
                  </div>
                </div>

                <h1 className="hero-title">
                  Women&apos;s Health{' '}
                  <span className="highlight">Discussion Dashboard</span>
                </h1>

                <p className="hero-subtitle">
                  Explore real conversations, lived experiences, and community wisdom
                  across platforms.
                </p>

                <p className="last-updated">
                  Last Updated:{' '}
                  <span id="lastUpdated">
                    {data.last_updated
                      ? new Date(data.last_updated).toLocaleString()
                      : '—'}
                  </span>
                </p>
                <p className="last-updated">
                  Total Discussions:{' '}
                  <span id="totalPosts">{data.total?.toLocaleString?.() || 0}</span>
                </p>
              </header>

              {/* STATS STRIP (matching communities look) */}
              <section className="stats">
                <div className="stat-box">
                  <h3>{filteredData.length}</h3>
                  <p>Total Posts</p>
                </div>
                <div className="stat-box">
                  <h3>{platformCount}</h3>
                  <p>Platforms</p>
                </div>
                <div className="stat-box">
                  <h3>{categoryCount}</h3>
                  <p>Categories</p>
                </div>
                <div className="stat-box">
                  <h3>{avgEngagement.toLocaleString()}</h3>
                  <p>Avg Engagement</p>
                </div>
              </section>

              {/* FILTERS & SORTING (same layout as womencommdb) */}
              <section className="filters">
                <h2>Filters &amp; Sorting</h2>

                <div className="filter-group">
                  <div className="filter-item">
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

                  <div className="filter-item">
                    <label>Health Category</label>
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

                  <div className="filter-item">
                    <label>Search Posts</label>
                    <input
                      type="text"
                      placeholder="Search by title or content..."
                      value={filters.search}
                      onChange={e =>
                        setFilters(prev => ({
                          ...prev,
                          search: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="filter-item" style={{ marginBottom: 15 }}>
                  <label>Sort By</label>
                  <div className="sort-buttons">
                    {[
                      { label: 'Newest First', val: 'date-desc' },
                      { label: 'Oldest First', val: 'date-asc' },
                      { label: 'Highest Engagement', val: 'engagement-desc' },
                      { label: 'Lowest Engagement', val: 'engagement-asc' },
                    ].map(btn => (
                      <button
                        key={btn.val}
                        className={`sort-btn ${
                          currentSort === btn.val ? 'active' : ''
                        }`}
                        onClick={() => setCurrentSort(btn.val)}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                </div>

                <button className="reset-btn" onClick={resetFilters}>
                  Reset All Filters
                </button>
              </section>

              {/* POSTS GRID (styled like communities-grid) */}
              <section className="posts-grid">
                {filteredData.length === 0 ? (
                  <div className="no-results">
                    <h2>No posts found</h2>
                    <p>Try adjusting your filters or search terms.</p>
                  </div>
                ) : (
                  filteredData.map((post, idx) => (
                    <article className="post-card" key={idx}>
                      <div className="post-meta">
                        <span className="badge platform-badge">
                          {post.platform}
                        </span>
                        <span className="badge category-badge">
                          {post.category}
                        </span>
                        {post.engagement_score && (
                          <span className="badge engagement-badge">
                            Engagement: {post.engagement_score.toLocaleString()}
                          </span>
                        )}
                      </div>

                      <h3 className="post-title">{post.title}</h3>

                      <p className="post-content">
                        {post.content
                          ? post.content.length > 300
                            ? `${post.content.substring(0, 300)}…`
                            : post.content
                          : 'No content available'}
                      </p>

                      <div className="post-stats">
                        <div>
                          📅{' '}
                          {new Date(
                            post.created_utc || post.published_at || 0
                          ).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </div>
                        {post.author && <div>👤 {post.author}</div>}
                        {post.score && <div>⬆️ {post.score}</div>}
                        {post.num_comments && (
                          <div>💬 {post.num_comments}</div>
                        )}
                        {post.views && (
                          <div>👁️ {post.views.toLocaleString()}</div>
                        )}
                      </div>

                      {post.url && (
                        <a
                          href={post.url}
                          target="_blank"
                          rel="noreferrer"
                          className="post-link"
                        >
                          View Full Discussion →
                        </a>
                      )}
                    </article>
                  ))
                )}
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default WomenHealthPostsDashboard;