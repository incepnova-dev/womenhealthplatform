import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  ExternalLink, 
  Users, 
  Globe, 
  Layers, 
  TrendingUp, 
  Hash, 
  ArrowUpDown, 
  LayoutGrid, 
  RotateCcw,
} from 'lucide-react';

import { 
  HeartPulse, Baby, Activity, Brain, Sparkles, Flower2, 
  Stethoscope, ShieldCheck, Zap, Thermometer, Apple, 
  Scale, Moon, Syringe, Heart, Pill, Microscope,
  Instagram, Facebook, Twitter, MessageSquare, HelpCircle, Share2
} from 'lucide-react';


const WomenHealthCommunitiesDashboard = () => {
  const [data, setData] = useState({
    metadata: { generated_at: '', total_communities: 0, total_hashtags: 0, platforms: [], categories: [], total_members: 0 },
    communities: []
  });

  const [filteredCommunities, setFilteredCommunities] = useState([]);
  const totalMembers = data.metadata?.total_members || 0;
  const [currentSort, setCurrentSort] = useState('members-desc');
  const [filters, setFilters] = useState({ platform: 'all', category: 'all', search: '', tag: '' });


  const formatMillions = (num) => {
  const n = parseInt(num) || 0;
  if (n >= 1_000_000) {
    return (n / 1_000_000).toLocaleString(undefined, {
      maximumFractionDigits: 1,
    }) + 'M';
  }
  if (n >= 1_000) {
    return (n / 1_000).toLocaleString(undefined, {
      maximumFractionDigits: 1,
    }) + 'K';
  }
  return n.toString();
};


  const getCategoryIcon = (category) => {
  const cat = category?.toLowerCase() || '';
  
  // 1. Reproductive & Maternal
  if (cat.includes('pregnancy') || cat.includes('maternal') || cat.includes('birth')) return <Baby size={12} strokeWidth={2.5} />;
  if (cat.includes('period') || cat.includes('menstruation') || cat.includes('cycle')) return <Flower2 size={12} strokeWidth={2.5} />;
  if (cat.includes('fertility') || cat.includes('ivf') || cat.includes('conception')) return <Zap size={12} strokeWidth={2.5} />;
  
  // 2. Chronic & Hormonal
  if (cat.includes('pcos') || cat.includes('hormonal') || cat.includes('endocrine')) return <Activity size={12} strokeWidth={2.5} />;
  if (cat.includes('menopause') || cat.includes('hot flash')) return <Thermometer size={12} strokeWidth={2.5} />;
  if (cat.includes('endometriosis') || cat.includes('fibroids')) return <ShieldCheck size={12} strokeWidth={2.5} />;
  
  // 3. Mental & Emotional
  if (cat.includes('mental') || cat.includes('mind') || cat.includes('anxiety')) return <Brain size={12} strokeWidth={2.5} />;
  if (cat.includes('postpartum')) return <Heart size={12} strokeWidth={2.5} />;
  if (cat.includes('sleep') || cat.includes('insomnia')) return <Moon size={12} strokeWidth={2.5} />;

  // 4. Wellness & Lifestyle
  if (cat.includes('wellness') || cat.includes('lifestyle') || cat.includes('self-care')) return <Sparkles size={12} strokeWidth={2.5} />;
  if (cat.includes('nutrition') || cat.includes('diet') || cat.includes('eating')) return <Apple size={12} strokeWidth={2.5} />;
  if (cat.includes('fitness') || cat.includes('exercise') || cat.includes('yoga')) return <Scale size={12} strokeWidth={2.5} />;

  // 5. Medical & Specialty
  if (cat.includes('cancer') || cat.includes('oncology')) return <Microscope size={12} strokeWidth={2.5} />;
  if (cat.includes('surgery') || cat.includes('recovery')) return <Pill size={12} strokeWidth={2.5} />;
  if (cat.includes('sexual') || cat.includes('sti') || cat.includes('prevention')) return <Syringe size={12} strokeWidth={2.5} />;
  if (cat.includes('doctor') || cat.includes('clinical')) return <Stethoscope size={12} strokeWidth={2.5} />;
  if (cat.includes('support') || cat.includes('community')) return <Users size={12} strokeWidth={2.5} />;

  // Default Fallback
  return <HeartPulse size={12} strokeWidth={2.5} />;
};

 const getPlatformIcon = (platform) => {
    const p = platform.toLowerCase();
    if (p === 'all') return <Globe size={14} />;
    if (p.includes('instagram')) return <Instagram size={14} />;
    if (p.includes('facebook')) return <Facebook size={14} />;
    if (p.includes('twitter') || p.includes('x')) return <Twitter size={14} />;
    if (p.includes('reddit')) return <MessageSquare size={14} />;
    if (p.includes('discord')) return <MessageSquare size={14} />;
    if (p.includes('quora')) return <HelpCircle size={14} />;
    return <Share2 size={14} />;
  };

const formatMembersLabel = (num) => {
  const n = parseInt(num) || 0;
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  return n.toString();
};


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
        <div className="content-wrap" style={{ gridTemplateColumns: '1fr', padding: '0 20px' }}>
         {/* Hero Section - Matching HTML Background & Text */}
           <section className="hero-card" style={{ 
  background: 'linear-gradient(135deg, #E91E63 0%, #FF4081 100%)', 
  borderRadius: '24px', 
  padding: '40px 30px', 
  color: 'white',
  boxShadow: '0 20px 40px rgba(233, 30, 99, 0.2)',
  marginBottom: '32px',
  display: 'flex',               /* Added Flex */
  justifyContent: 'space-between', /* Pushes content to edges */
  alignItems: 'center'           /* Centers icon vertically */
}}>
  <div style={{ flex: 1 }}>
    <div className="hero-badge-row">
      <div className="hero-chip" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)' }}>
        <span className="dot" style={{ backgroundColor: '#fff' }}></span> 
        {filteredCommunities.length} Active Communities
      </div>
    </div>
    
    <h1 className="hero-title" style={{ color: '#ffffff', fontSize: '36px', fontWeight: '800', marginTop: '16px' }}>
      Discover Your Support Community
    </h1>
    <p className="hero-subtitle" style={{ color: 'rgba(255,255,255,0.9)', maxWidth: '500px', lineHeight: '1.6' }}>
      Connect with supportive communities across all platforms - from Reddit and Facebook to Instagram and Quora.
    </p>
  </div>

  {/* Icon on the extreme right */}
  <div style={{ marginLeft: '20px', opacity: 0.9 }}>
    <Users size={80} strokeWidth={1.5} color="white" />
  </div>
</section>


      {/* Search & Filters */}
      <div className="mode-toggle-row" style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '2px', width: '100%' }}>
        {/* Row 1: Search, Tags & Platform in one row */}
        <div
          className="filter-row"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 180px 3fr',
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
        placeholder="Search communities or topics..."
        value={filters.search}
        style={{ border: '1px solid #eee', borderRadius: '8px', padding: '10px' }}
        onChange={e =>
          setFilters(prev => ({ ...prev, search: e.target.value }))
        }
      />
    </div>

    {/* Tags */}
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
        <Hash size={12} /> Tags
      </label>
      <input
        type="text"
        placeholder="#pcos, #health..."
        value={filters.tag}
        style={{ border: '1px solid #eee', borderRadius: '8px', padding: '10px' }}
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
          fontWeight: '700',
          color: '#E91E63',
          marginBottom: '4px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}
      >
        <Globe size={12} /> FILTER BY PLATFORM
      </p>
      {/* Replace the platform button section around Line 275 */}
          <div className="mode-toggle-buttons" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            <button
              onClick={() => setFilters(prev => ({ ...prev, platform: 'all' }))}
              className={`mode-toggle-button ${filters.platform === 'all' ? 'active' : ''}`}
              style={{
                ...(filters.platform === 'all' ? { background: '#E91E63', color: '#fff', border: 'none' } : {}),
                display: 'inline-flex', alignItems: 'center', gap: '8px'
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', color: filters.platform === 'all' ? '#ffffff' : '#F59E0B' }}>
                {getPlatformIcon('all')}
              </span>
              All Platforms
            </button>

            {data.metadata.platforms.map(p => (
              <button
                key={p}
                onClick={() => setFilters(prev => ({ ...prev, platform: p }))}
                className={`mode-toggle-button ${filters.platform === p ? 'active' : ''}`}
                style={{
                  ...(filters.platform === p ? { background: '#E91E63', color: '#fff', border: 'none' } : {}),
                  display: 'inline-flex', alignItems: 'center', gap: '8px'
                }}
              >
                <span style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  color: filters.platform === p ? '#ffffff' : '#F59E0B' 
                }}>
                  {getPlatformIcon(p)}
                </span>
                {p}
              </button>
            ))}
          </div>

    </div>
  </div>

  {/* Row 2: Sort + Category + Reset */}
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
    transform: 'translateY(2px)', /* Moves the label and icon down by 2px */
    marginTop: '2px'           /* Maintains spacing from the buttons below */
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
          className={`mode-toggle-button ${currentSort === 'members-desc' ? 'active' : ''}`}
          style={currentSort === 'members-desc' ? { background: '#E91E63', color: '#fff', border: 'none' } : {}}
          onClick={() => setCurrentSort('members-desc')}
        >
          Highest Members
        </button>

        <button
          className={`mode-toggle-button ${currentSort === 'members-asc' ? 'active' : ''}`}
          style={currentSort === 'members-asc' ? { background: '#E91E63', color: '#fff', border: 'none' } : {}}
          onClick={() => setCurrentSort('members-asc')}
        >
          Lowest Members
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

      {/* Category */}
      <div className="field" style={{ maxWidth: '160px' }}>
        <label style={{ fontSize: '11px', fontWeight: '700', color: '#E91E63', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
          <LayoutGrid size={12} /> Category
        </label>
        <select
          value={filters.category}
          style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #eee' }}
          onChange={e =>
            setFilters(prev => ({
              ...prev,
              category: e.target.value,
            }))
          }
        >
          <option value="all">All Categories</option>
          {data.metadata.categories.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
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
          <div className="stats-grid" style={{gap: '32px', marginBottom: '24px', flexWrap: 'wrap' }}>
           {/* 1. Communities Card - Pink */}
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
                {filteredCommunities.length}
              </h3>
              <Users size={20} color="#E91E63" style={{ opacity: 0.8 }} />
            </div>
            <p style={{ color: '#666', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600', marginTop: '4px' }}>
              Communities
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
                {new Set(filteredCommunities.map(c => c.platform)).size}
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
                {new Set(filteredCommunities.map(c => c.category)).size}
              </h3>
              <Layers size={20} color="#FFB300" style={{ opacity: 0.8 }} />
            </div>
            <p style={{ color: '#666', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600', marginTop: '4px' }}>
              Categories
            </p>
          </div>

          {/* 4. Total Members Card - Teal */}
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
            {formatMillions(totalMembers)}
          </h3>
          <TrendingUp size={20} color="#4DB6AC" style={{ opacity: 0.8 }} />
        </div>
        <p style={{ color: '#666', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600', marginTop: '4px' }}>
          Total Members
        </p>
      </div>
    </div>

          {/* Communities Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {filteredCommunities.map(comm => {
             const membersLabel = formatMembersLabel(comm.number_members);
              const platformClass = `platform-${comm.platform.toLowerCase().replace('/', '-').replace(' ', '-')}`;
              
              return (
                <div key={comm.id} className="deck-card">
                  <div className="deck-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                    <h3 className="deck-title hero-gradient" style={{ flex: 1 }}>{comm.community_name}</h3>
                    
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <span style={{ 
                      background: '#26A69A', /* Success Green / Teal shade matching Members theme */
                      color: '#ffffff', 
                      padding: '4px 12px', 
                      borderRadius: '6px', 
                      fontSize: '11px', 
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      boxShadow: '0 2px 4px rgba(38, 166, 154, 0.2)', /* Subtle green shadow */
                      display: 'inline-flex',
                      alignItems: 'center'
                    }}>
                        {comm.platform}
                      </span>

                      {comm.engagement_score && (
                      <span style={{ 
                            background: '#4A5568', /* Muted Dark Blue/Gray */
                            color: '#ffffff', 
                            padding: '4px 10px', 
                            borderRadius: '6px', 
                            fontSize: '11px', 
                            fontWeight: '700',
                            textTransform: 'uppercase'
                          }}>
                          Engagement: {comm.engagement_score}
                          <TrendingUp size={10} /> TRENDING
                        </span>
                      )}
                    </div>
                  </div>
                  
                 <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>

              {/* The Category Tag - Blue Shade */}
            <span className="category-tag" style={{ 
              background: '#1976D2', /* Professional Blue matching Platforms */
              color: '#ffffff', 
              padding: '4px 10px', 
              borderRadius: '6px', 
              fontSize: '11px', 
              fontWeight: '700',
              textTransform: 'uppercase',
              boxShadow: '0 2px 4px rgba(25, 118, 210, 0.2)',
              letterSpacing: '0.5px',
              display: 'inline-flex',   /* Added for alignment */
              alignItems: 'center',      /* Added for alignment */
              gap: '6px'                 /* Space between icon and text */
            }}>
              {getCategoryIcon(comm.category)}
                {comm.category}
              </span>
            </div>
          

           <p className="deck-subtitle" style={{ color: '#111827', fontSize: '0.9rem', marginTop: '12px', lineHeight: '1.5' }}>
                    {comm.content || comm.title}
                  </p>


                  <div className="deck-footer" style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

                    <span style={{ 
                         background: '#FFD54F',
                          color: '#000000', /* Changed to Black for better readability on yellow */
                          padding: '6px 12px', 
                          borderRadius: '6px', 
                          fontSize: '11px', 
                          fontWeight: '800',
                          textTransform: 'uppercase',
                          boxShadow: '0 2px 4px rgba(255, 179, 0, 0.4)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          lineHeight: '1'
                        }}>
                    <Users size={12} strokeWidth={2.5} />
                    {membersLabel} members
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