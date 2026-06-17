import React, { useEffect, useState } from 'react';
import api from '../api';

function formatDate(value) {
  if (!value) return 'Date pending';
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(value));
}

export default function AllFestsPage({ onNavigate }) {
  const [fests, setFests] = useState([]);
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchAll() {
      try {
        const response = await api.get('/api/fests/published');
        setFests(response.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchAll();
  }, []);

  const filteredFests = fests.filter(f => {
    if (activeFilter === 'ALL') return true;
    return f.type === activeFilter;
  });

  return (
    <div className="cp-page">
      <header className="cp-header">
        <button className="cp-brand-btn" onClick={() => onNavigate('student')}>CampusPulse</button>
        <span className="header-separator">/</span>
        <span className="header-current">All Fests</span>
      </header>

      <main className="details-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h1 className="cp-title" style={{ fontSize: '24px', margin: 0 }}>Explore Fests</h1>
          <div className="fest-filter-group">
            {['ALL', 'TECHNICAL', 'CULTURAL', 'SPORT', 'OTHER'].map((f) => (
              <button
                key={f}
                className={activeFilter === f ? 'is-active' : ''}
                onClick={() => setActiveFilter(f)}
              >
                {f.charAt(0) + f.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>
        
        <div className="fest-grid">
          {isLoading ? <p>Loading fests...</p> : (
            filteredFests.length === 0 ? <p className="empty-copy">No fests found for this category.</p> : (
              filteredFests.map((fest) => (
                <article className="fest-card" key={fest.id} onClick={() => onNavigate('fest-details', fest.id)}>
                  <div className="fest-banner" style={{ backgroundImage: `url(${fest.bannerImageUrl || '/assets/default-fest.png'})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                    <span>{fest.type}</span>
                  </div>
                  <div className="fest-body">
                    <h3>{fest.name}</h3>
                    <p>{fest.ownerName}</p>
                    <div className="fest-meta">
                      <span>{formatDate(fest.festStartTime)}</span>
                    </div>
                  </div>
                </article>
              ))
            )
          )}
        </div>
      </main>
    </div>
  );
}
