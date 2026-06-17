import React, { useEffect, useState } from 'react';
import api from '../api';

function formatDate(value) {
  if (!value) return 'Date pending';
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(value));
}

export default function FestPage({ festId, onNavigate }) {
  const [fest, setFest] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchFest() {
      try {
        const response = await api.get(`/api/fests/${festId}`);
        setFest(response.data);
      } catch (err) {
        setError('Could not load fest details.');
      } finally {
        setIsLoading(false);
      }
    }
    if (festId) fetchFest();
  }, [festId]);

  if (isLoading) return <div className="loading-state">Loading Fest...</div>;
  if (error || !fest) return <div className="error-state">{error || 'Fest not found.'}</div>;

  return (
    <div className="cp-page details-page">
      <header className="cp-header">
        <button className="cp-brand-btn" onClick={() => onNavigate('student')}>CampusPulse</button>
        <span className="header-separator">/</span>
        <span className="header-current">Fest Details</span>
      </header>

      <div className="details-banner" style={{ backgroundImage: `url(${fest.bannerImageUrl})` }}>
        <div className="banner-overlay">
          <h1>{fest.name}</h1>
          <p>{fest.ownerName}</p>
        </div>
      </div>

      <main className="details-content">
        <section className="details-main">
          <div className="info-card">
            <h2>About this Fest</h2>
            <p className="description-text">{fest.description || 'No description provided.'}</p>
            <div className="meta-grid">
              <div className="meta-item">
                <label>Date</label>
                <span>{formatDate(fest.festStartTime)} - {formatDate(fest.festEndTime)}</span>
              </div>
              <div className="meta-item">
                <label>Type</label>
                <span>{fest.type}</span>
              </div>
            </div>
          </div>

          <div className="events-section">
            <h2>Events in {fest.name}</h2>
            <div className="events-blobs">
              {(fest.events || []).length === 0 ? <p>No events listed for this fest.</p> : (
                fest.events.map(event => (
                  <div key={event.id} className="event-blob" onClick={() => onNavigate('event-details', event.id)}>
                    <div className="blob-banner" style={{ backgroundImage: `url(${event.eventBannerUrl || fest.bannerImageUrl})` }} />
                    <div className="blob-info">
                      <h3>{event.name}</h3>
                      <p>{event.venue}</p>
                      <span className="blob-tag">View Details</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

