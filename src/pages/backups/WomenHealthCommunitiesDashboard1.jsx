import React, { useState, useEffect } from 'react';
import { Search, Filter, ExternalLink } from 'lucide-react';
import '../styles/womencommdb1.css';

const WomenHealthCommunitiesDashboard1 = () => {
  const [data, setData] = useState({
    metadata: {
      generated_at: '',
      total_communities: 0,
      total_hashtags: 0,
      platforms: [],
      categories: [],
      total_members: 0,
    },
    communities: [],
  });

  const [filteredCommunities, setFilteredCommunities] = useState([]);
  const totalMembers = data.metadata?.total_members || 0;

  const [currentSort, setCurrentSort] = useState('members-desc');
  const [filters, setFilters] = useState({
    platform: 'all',
    category: 'all',
    search: '',
    tag: '',
  });

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

  useEffect(() => {
    let result = [...(data.communities || [])];

    // 1. Platform filter
    if (filters.platform !== 'all') {
      result = result.filter((comm) => {
        if (!comm.platform) return false;
        const platformMatch =
          comm.platform.toLowerCase() === filters.platform.toLowerCase();

        const isReddit =
          comm.community_name &&
          (comm.community_name.startsWith('r/') ||
            (comm.url && comm.url.includes('reddit.com')));

        if (filters.platform.toLowerCase() !== 'reddit' && isReddit) {
          return false;
        }
        return platformMatch;
      });
    }

    // 2. Category filter
    if (filters.category !== 'all') {
      result = result.filter((comm) => comm.category === filters.category);
    }

    // 3. Search filter
    const searchTerm = filters.search.trim().toLowerCase();
    if (searchTerm) {
      result = result.filter(
        (comm) =>
          (comm.community_name &&
            comm.community_name.toLowerCase().includes(searchTerm)) ||
          (comm.content && comm.content.toLowerCase().includes(searchTerm))
      );
    }

    // 4. Tag / hashtag filter (maps to source)
    const tagInput = filters.tag.trim().toLowerCase();
    if (tagInput) {
      const tokens = tagInput
        .split(',')
        .map((t) => t.trim().replace(/^#/, ''));
      result = result.filter((comm) => {
        const sourceVal = (comm.source || '').toLowerCase();
        return tokens.some((t) => sourceVal.includes(t));
      });
    }

    // 5. Sorting
    const [field, direction] = currentSort.split('-');
    result.sort((a, b) => {
      let aVal = 0;
      let bVal = 0;

      if (field === 'members') {
        aVal = parseInt(a.number_members) || 0;
        bVal = parseInt(b.number_members) || 0;
      } else if (field === 'engagement') {
        aVal = parseFloat(a.engagement_score) || 0;
        bVal = parseFloat(b.engagement_score) || 0;
      } else if (field === 'newest') {
        // optional: if you have created_at
        aVal = new Date(a.created_at || 0).getTime();
        bVal = new Date(b.created_at || 0).getTime();
      }

      return direction === 'desc' ? bVal - aVal : aVal - bVal;
    });

    setFilteredCommunities(result);
  }, [filters, currentSort, data]);

  const resetFilters = () => {
    setFilters({
      platform: 'all',
      category: 'all',
      search: '',
      tag: '',
    });
    setCurrentSort('members-desc');
  };

  const handlePlatformClick = (platform) => {
    setFilters((prev) => ({ ...prev, platform }));
  };

  const handleCategoryClick = (category) => {
    setFilters((prev) => ({ ...prev, category }));
  };

  const handleTagClick = (tag) => {
    setFilters((prev) => ({ ...prev, tag }));
  };

  const getCategoryClass = (category) => {
    switch (category) {
      case 'Mental Health':
        return 'community-category category-mental';
      case 'Breast Cancer':
        return 'community-category category-cancer';
      case 'Pregnancy':
      case 'Pregnancy & Fertility':
        return 'community-category category-pregnancy';
      default:
        return 'community-category category-general';
    }
  };

  const formatMembersLabel = (num) => {
    const n = parseInt(num) || 0;
    if (n >= 1_000_000) return formatMillions(n);
    if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
    return n.toString();
  };

  return (
    <div className="community-page">
      {/* STATUS BAR */}
    

      {/* APP HEADER */}
      <header className="app-header">
        <div className="app-title">Nari Swasthya Samuday</div>
        <div className="header-icons">
          <span>🔔</span>
          <span>⚙️</span>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="content-area">
        {/* HERO */}
        <section className="hero-section">
          <h1 className="hero-title">Discover Your Support Community</h1>
          <p className="hero-subtitle">
            Connect with supportive communities across all platforms - from Reddit and Facebook
            to Instagram and Quora
          </p>
          <div className="stats-badge">
            45 Active Communities
          </div>
        </section>

        {/* SEARCH + FILTERS */}
        <section className="search-section">
          <div className="search-bar">
            <Search className="search-icon" size={18} />
            <input
              className="search-input"
              type="text"
              placeholder="Search communities, topics, or hashtags"
              value={filters.search}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, search: e.target.value }))
              }
            />
            <button className="filter-button" onClick={resetFilters}>
              <Filter size={16} />
              <span>Reset</span>
            </button>
          </div>

          {/* Hashtag tags */}
          <div className="filter-tags">
            {['#mentalhealth', '#pregnancy', '#breastcancer', '#womenshealth'].map(
              (tag) => (
                <button
                  key={tag}
                  className={
                    filters.tag.toLowerCase().includes(tag.replace('#', ''))
                      ? 'tag active'
                      : 'tag'
                  }
                  onClick={() => handleTagClick(tag)}
                >
                  {tag}
                </button>
              )
            )}
          </div>

          {/* Platform chips */}
          <div className="platform-filter">
            {[
              { key: 'all', label: '🌐 All Platforms' },
              { key: 'instagram', label: '📱 Instagram' },
              { key: 'facebook', label: '👥 Facebook' },
              { key: 'reddit', label: '🟥 Reddit' },
              { key: 'twitter', label: '🐦 Twitter/X' },
              { key: 'discord', label: '💬 Discord' },
              { key: 'quora', label: '❓ Quora' },
            ].map((p) => (
              <button
                key={p.key}
                className={
                  filters.platform === p.key ? 'platform-chip active' : 'platform-chip'
                }
                onClick={() => handlePlatformClick(p.key)}
              >
                <span className="platform-icon">{p.label.split(' ')[0]}</span>
                <span>{p.label.split(' ').slice(1).join(' ')}</span>
              </button>
            ))}
          </div>
        </section>

        {/* ANALYTICS CARDS */}
        <section className="analytics-section">
          <div className="analytics-card">
            <div className="analytics-number">
              {data.metadata.total_communities || 45}
            </div>
            <div className="analytics-label">Active Communities</div>
          </div>

          <div className="analytics-card">
            <div className="analytics-number">🔥 Trending</div>
            <div className="analytics-label">
              {data.metadata.platforms?.length || 6} Platforms
            </div>
          </div>

          <div className="analytics-card">
            <div className="analytics-number">
              {totalMembers ? formatMillions(totalMembers) : '69.7M'}
            </div>
            <div className="analytics-label">Total Members</div>
          </div>
        </section>

        {/* CATEGORY FILTERS */}
        <div className="category-filters">
          {['All Categories', 'Mental Health', 'Breast Cancer', 'Pregnancy', 'General Health'].map(
            (cat) => {
              const key =
                cat === 'All Categories'
                  ? 'all'
                  : cat; // categories in data should match text
              return (
                <button
                  key={cat}
                  className={
                    filters.category === key ? 'category-filter active' : 'category-filter'
                  }
                  onClick={() => handleCategoryClick(key)}
                >
                  {cat}
                </button>
              );
            }
          )}
        </div>

        {/* SECTION TITLE + SORT */}
        <div className="section-title">
          <h2>🏆 Top Communities</h2>
          <select
            className="sort-dropdown"
            value={currentSort}
            onChange={(e) => setCurrentSort(e.target.value)}
          >
            <option value="members-desc">Highest Members</option>
            <option value="engagement-desc">Highest Engagement</option>
            <option value="newest-desc">Newest</option>
          </select>
        </div>

        {/* COMMUNITIES GRID */}
        <div className="communities-grid">
          {filteredCommunities.map((comm, idx) => {
            const joined = comm.joined === true || comm.status === 'joined';
            let badgeText = comm.badge || '';
            if (!badgeText && joined) badgeText = '✓ Joined';
            if (!badgeText && comm.is_new) badgeText = 'NEW';
            if (!badgeText && comm.is_hot) badgeText = 'HOT';

            return (
              <div
                key={comm.id || comm.community_name || idx}
                className="community-card"
                onClick={() => {
                  if (comm.url) {
                    window.open(comm.url, '_blank', 'noopener,noreferrer');
                  }
                }}
              >
                <div className="community-header">
                  <div className={getCategoryClass(comm.category)}>
                    {comm.category || 'General Women\'s Health'}
                  </div>
                  {badgeText && (
                    <div className="community-badge">
                      {badgeText}
                    </div>
                  )}
                </div>

                <div className="community-title">
                  {comm.community_name || 'Community Name'}
                </div>

                <div className="community-description">
                  {comm.content ||
                    comm.title ||
                    'Description not available for this community yet.'}
                </div>

                <div className="community-stats">
                  <div>
                    <div className="members-count">
                      {formatMembersLabel(comm.number_members)}
                    </div>
                    <div className="members-label">Members</div>
                  </div>
                  <button
                    className={
                      joined ? 'join-button joined' : 'join-button'
                    }
                    onClick={(e) => {
                      e.stopPropagation();
                      if (comm.url) {
                        window.open(comm.url, '_blank', 'noopener,noreferrer');
                      }
                    }}
                  >
                    {joined ? '✓ Joined' : 'Join Community'}
                    <ExternalLink size={16} style={{ marginLeft: 8 }} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* FLOATING BUTTON */}
      <button className="floating-button">+</button>

      {/* BOTTOM NAV */}
      <nav className="bottom-nav">
        <a href="#" className="nav-item">
          <span className="nav-icon">🏠</span>
          <span className="nav-label">Home</span>
        </a>
        <a href="#" className="nav-item active">
          <span className="nav-icon">👥</span>
          <span className="nav-label">Communities</span>
        </a>
        <a href="#" className="nav-item">
          <span className="nav-icon">🔍</span>
          <span className="nav-label">Discover</span>
        </a>
        <a href="#" className="nav-item">
          <span className="nav-icon">💬</span>
          <span className="nav-label">Chat</span>
        </a>
        <a href="#" className="nav-item">
          <span className="nav-icon">👤</span>
          <span className="nav-label">Profile</span>
        </a>
      </nav>
    </div>
  );
};

export default WomenHealthCommunitiesDashboard1;