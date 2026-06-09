import React, { useEffect, useState } from 'react';
import api from '../api';

function formatDate(value) {
  if (!value) return 'Date pending';
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(value));
}

export default function EventPage({ eventId, onNavigate }) {
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

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

  if (isLoading) return <div className="loading-state">Loading Event...</div>;
  if (error || !event) return <div className="error-state">{error || 'Event not found.'}</div>;

  return (
    <div className="cp-page details-page">
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
              <button className="cp-button primary-action-btn">Register for Event</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
