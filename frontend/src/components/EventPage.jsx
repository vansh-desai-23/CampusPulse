import React, { useEffect, useState } from 'react';
import api from '../api';

function formatDate(value) {
  if (!value) return 'Date pending';
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(value));
}

export default function EventPage({ eventId, onNavigate }) {
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [regError, setRegError] = useState('');

  useEffect(() => {
    async function fetchEvent() {
      try {
        const response = await api.get(`/api/events/${eventId}`);
        setEvent(response.data);
      } catch (err) {
        setError('Could not load event details.');
      } finally {
        setIsLoading(false);
      }
    }
    if (eventId) fetchEvent();
  }, [eventId]);

  const initiateRegistration = () => {
    setRegError('');
    if (event.maxTeamSize > 1) {
      setShowModal(true);
    } else {
      performRegistration(null);
    }
  };

  const performRegistration = async (nameToUse) => {
    setIsRegistering(true);
    setRegError('');
    try {
      await api.post(`/api/events/${eventId}/teams`, { teamName: nameToUse });
      setShowModal(false);
      onNavigate('view-all-registered');
    } catch (err) {
      setRegError(err.response?.data?.message || err.response?.data?.error || "Failed to register for the event.");
    } finally {
      setIsRegistering(false);
    }
  };

  if (isLoading) return <div className="loading-state">Loading Event...</div>;
  if (error || !event) return <div className="error-state">{error || 'Event not found.'}</div>;

  return (
    <div className="cp-page details-page">
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Create a Team</h2>
            <p>This event allows teams up to {event.maxTeamSize} members. You can optionally name your team, or leave it blank.</p>
            <input 
              type="text" 
              placeholder="Team Name (Optional)" 
              value={teamName}
              onChange={e => setTeamName(e.target.value)}
              autoFocus
            />
            {regError && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '-12px' }}>{regError}</p>}
            <div className="modal-actions">
              <button className="modal-cancel" onClick={() => setShowModal(false)} disabled={isRegistering}>Cancel</button>
              <button className="modal-confirm" onClick={() => performRegistration(teamName)} disabled={isRegistering}>
                {isRegistering ? 'Registering...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

      <header className="cp-header">
        <button className="cp-brand-btn" onClick={() => onNavigate('student')}>CampusPulse</button>
        <span className="header-separator">/</span>
        <button className="cp-brand-btn" onClick={() => onNavigate('fest-details', event.festId)}>{event.festName}</button>
        <span className="header-separator">/</span>
        <span className="header-current">Event</span>
      </header>

      <div className="details-banner event-banner" style={{ backgroundImage: `url(${event.eventBannerUrl})` }}>
        <div className="banner-overlay">
          <span className="category-pill">{event.festType}</span>
          <h1>{event.name}</h1>
          <p>{event.venue}</p>
        </div>
      </div>

      <main className="details-content">
        <section className="details-main">
          <div className="info-card">
            <h2>Event Details</h2>
            <p className="description-text">{event.description || 'No description provided.'}</p>
            
            <div className="capacity-bar-container">
              <div className="capacity-label">
                <span>Capacity</span>
                <span>{event.currentBookings} / {event.maxCapacity} spots filled</span>
              </div>
              <div className="capacity-bar">
                <div className="capacity-fill" style={{ width: `${Math.min(100, (event.currentBookings / event.maxCapacity) * 100)}%` }} />
              </div>
            </div>

            <div className="meta-grid">
              <div className="meta-item">
                <label>Physical Event</label>
                <span>{formatDate(event.physicalEventStart)}</span>
              </div>
              <div className="meta-item">
                <label>Registration Closes</label>
                <span>{formatDate(event.registrationEnd)}</span>
              </div>
              <div className="meta-item">
                <label>Max Team Size</label>
                <span>{event.maxTeamSize} Members</span>
              </div>
            </div>

            <div className="action-row" style={{ marginTop: '24px' }}>
              {regError && !showModal && <div style={{ color: '#ef4444', fontSize: '13px', fontWeight: 600, marginBottom: '12px' }}>{regError}</div>}
              <button 
                className="cp-button primary-action-btn" 
                onClick={initiateRegistration} 
                disabled={isRegistering}
              >
                {isRegistering ? 'Registering...' : 'Register for Event'}
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
