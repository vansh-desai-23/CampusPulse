import React, { useEffect, useState } from 'react';
import api from '../api';

function formatDate(value) {
  if (!value) return 'Date pending';
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(value));
}

export default function RegisteredPage({ onNavigate }) {
  const [registrations, setRegistrations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  async function fetchRegistrations() {
    setIsLoading(true);
    try {
      const response = await api.get('/api/teams/my');
      setRegistrations(response.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleUnregister(teamId, registrationEnd) {
    const now = new Date();
    const deadline = new Date(registrationEnd);
    
    if (now >= deadline) {
      alert("Cannot unregister. The registration window for this event has closed.");
      return;
    }

    if (!window.confirm("Are you sure you want to unregister from this event?")) {
      return;
    }

    try {
      await api.post(`/api/teams/${teamId}/leave`);
      fetchRegistrations();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to unregister.");
    }
  }

  return (
    <div className="cp-page">
      <header className="cp-header">
        <button className="cp-brand-btn" onClick={() => onNavigate('student')}>CampusPulse</button>
        <span className="header-separator">/</span>
        <span className="header-current">Registered Events</span>
      </header>

      <main style={{ padding: '40px max(5vw, 20px)' }}>
        <h1 className="cp-title" style={{ fontSize: '24px', marginBottom: '32px' }}>My Registrations</h1>
        <div className="events-blobs">
          {isLoading ? <p>Loading registrations...</p> : (
            registrations.length === 0 ? <p className="empty-copy">You haven't registered for any events yet.</p> : (
              registrations.map((reg) => {
                const isClosed = new Date() >= new Date(reg.registrationEnd);
                return (
                  <div key={reg.id} className="event-blob" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }} onClick={() => onNavigate('event-details', reg.eventId)}>
                      <div className="blob-banner" style={{ background: '#f1f5f9' }} />
                      <div>
                        <h3>{reg.eventName}</h3>
                        <p>{reg.festName}</p>
                        <span style={{ fontSize: '11px', color: '#94a3b8' }}>Deadline: {formatDate(reg.registrationEnd)}</span>
                      </div>
                    </div>
                    <button 
                      className="cp-link-btn" 
                      onClick={() => handleUnregister(reg.id, reg.registrationEnd)}
                      disabled={isClosed}
                      style={{ color: isClosed ? '#cbd5e1' : '#ef4444', fontWeight: 600, fontSize: '12px' }}
                    >
                      {isClosed ? 'Closed' : 'Unregister'}
                    </button>
                  </div>
                );
              })
            )
          )}
        </div>
      </main>
    </div>
  );
}
