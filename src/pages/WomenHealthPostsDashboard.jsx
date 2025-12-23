import React, { useState, useEffect } from 'react';
import '../styles/womenpostsdb.css'; // Importing your existing stylesheet

const WomenHealthPostsDashboard = () => {
    const [data, setData] = useState({ last_updated: "", total: 0, discussions: [] });
    const [filteredData, setFilteredData] = useState([]);
    const [currentSort, setCurrentSort] = useState('date-desc');
    const [filters, setFilters] = useState({
        platform: 'all',
        category: 'all',
        search: ''
    });

    // Load JSON data from file automatically
    useEffect(() => {
        const loadData = async () => {
            try {
                const response = await fetch('complete_health_data.json');
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const jsonData = await response.json();
                setData(jsonData);
                setFilteredData(jsonData.discussions);
            } catch (error) {
                console.error('Error loading data:', error);
            }
        };
        loadData();
    }, []);

    // Effect to handle filtering and sorting whenever state changes
    useEffect(() => {
        let result = data.discussions.filter(post => {
            const matchesPlatform = filters.platform === 'all' || post.platform === filters.platform;
            const matchesCategory = filters.category === 'all' || post.category === filters.category;
            const matchesSearch = filters.search === '' || 
                post.title.toLowerCase().includes(filters.search.toLowerCase()) || 
                (post.content && post.content.toLowerCase().includes(filters.search.toLowerCase()));
            return matchesPlatform && matchesCategory && matchesSearch;
        });

        // Sorting logic
        const [field, direction] = currentSort.split('-');
        result.sort((a, b) => {
            let aVal, bVal;
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

    // Derived analytics
    const totalEngagement = filteredData.reduce((sum, d) => sum + (d.engagement_score || 0), 0);
    const avgEngagement = filteredData.length ? Math.round(totalEngagement / filteredData.length) : 0;
    const platformCount = new Set(filteredData.map(d => d.platform)).size;
    const categoryCount = new Set(filteredData.map(d => d.category)).size;

    return (
        <div className="container">
            <div className="header">
            <div className="hero-pill-dot">🌸 </div>
             <div className="hero-pill-text"> Navigating Support with Trusted Discussion Spaces</div>
                <h1 className="hero-title">
                Women's Health <span className="highlight"> Discussion Dashboard</span>
                </h1>
                <p className="last-updated">Last Updated: <span id="lastUpdated">{new Date(data.last_updated).toLocaleString()}</span></p>
                <p className="last-updated">Total Discussions: <span id="totalPosts">{data.total}</span></p>
            </div>

             <div className="stats">
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
            </div>

            <div className="filters">
                <h2 style={{ marginBottom: '20px', color: '#667eea' }}>Filters & Sorting</h2>
                
                <div className="filter-group">
                    <div className="filter-item">
                        <label>Platform</label>
                        <select 
                            value={filters.platform} 
                            onChange={(e) => setFilters({...filters, platform: e.target.value})}
                        >
                            <option value="all">All Platforms</option>
                            {[...new Set(data.discussions.map(d => d.platform))].sort().map(p => (
                                <option key={p} value={p}>{p}</option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-item">
                        <label>Health Category</label>
                        <select 
                            value={filters.category} 
                            onChange={(e) => setFilters({...filters, category: e.target.value})}
                        >
                            <option value="all">All Categories</option>
                            {[...new Set(data.discussions.map(d => d.category))].sort().map(c => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-item">
                        <label>Search Posts</label>
                        <input 
                            type="text" 
                            placeholder="Search by title or content..." 
                            value={filters.search}
                            onChange={(e) => setFilters({...filters, search: e.target.value})}
                        />
                    </div>
                </div>

                <div className="filter-item" style={{ marginBottom: '15px' }}>
                    <label>Sort By</label>
                    <div className="sort-buttons">
                        {[
                            { label: 'Newest First', val: 'date-desc' },
                            { label: 'Oldest First', val: 'date-asc' },
                            { label: 'Highest Engagement', val: 'engagement-desc' },
                            { label: 'Lowest Engagement', val: 'engagement-asc' }
                        ].map(btn => (
                            <button 
                                key={btn.val}
                                className={`sort-btn ${currentSort === btn.val ? 'active' : ''}`}
                                onClick={() => setCurrentSort(btn.val)}
                            >
                                {btn.label}
                            </button>
                        ))}
                    </div>
                </div>

                <button className="reset-btn" onClick={resetFilters}>Reset All Filters</button>
            </div>

            <div className="posts-container">
                {filteredData.length === 0 ? (
                    <div className="no-results">
                        <h2>No posts found</h2>
                        <p>Try adjusting your filters or search terms</p>
                    </div>
                ) : (
                    filteredData.map((post, idx) => (
                        <div className="post-card" key={idx}>
                            <div className="post-header">
                                <div className="post-title">{post.title}</div>
                            </div>
                            
                            <div className="post-meta">
                                <span className="badge platform-badge">{post.platform}</span>
                                <span className="badge category-badge">{post.category}</span>
                                {post.engagement_score && (
                                    <span className="badge engagement-badge">Engagement: {post.engagement_score.toLocaleString()}</span>
                                )}
                            </div>

                            <div className="post-content">
                                {post.content ? (post.content.length > 300 ? post.content.substring(0, 300) + '...' : post.content) : 'No content available'}
                            </div>

                            <div className="post-stats">
                                <div>📅 {new Date(post.created_utc || post.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                                {post.author && <div>👤 {post.author}</div>}
                                {post.score && <div>⬆️ {post.score}</div>}
                                {post.num_comments && <div>💬 {post.num_comments}</div>}
                                {post.views && <div>👁️ {post.views.toLocaleString()}</div>}
                            </div>

                            <a href={post.url} target="_blank" rel="noreferrer" className="post-link">View Full Discussion →</a>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};


export default WomenHealthPostsDashboard;