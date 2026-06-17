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
      const uniqueRegs = [];
      const seen = new Set();
      for (const r of response.data || []) {
        if (!seen.has(r.eventId)) {
          seen.add(r.eventId);
          uniqueRegs.push(r);
        }
      }
      setRegistrations(uniqueRegs);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="cp-page">
      <header className="cp-header">
        <button className="cp-brand-btn" onClick={() => onNavigate('student')}>CampusPulse</button>
        <span className="header-separator">/</span>
        <span className="header-current">Registered Events</span>
      </header>

      <main className="details-content">
        <h1 className="cp-title" style={{ fontSize: '24px', marginBottom: '32px' }}>My Registrations</h1>
        <div className="events-blobs">
          {isLoading ? <p>Loading registrations...</p> : (
            registrations.length === 0 ? <p className="empty-copy">You haven't registered for any events yet.</p> : (
              registrations.map((reg) => {
                return (
                  <div 
                    key={reg.id} 
                    className="event-blob" 
                    onClick={() => onNavigate('registration-details', reg.id)}
                    style={{ padding: '16px', gap: '16px' }}
                  >
                    <div className="blob-banner" style={{ background: '#f1f5f9', backgroundImage: reg.eventBannerUrl ? `url(${reg.eventBannerUrl})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center', width: '80px', height: '80px', flexShrink: 0, borderRadius: '12px' }} />
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <h3 style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '16px', color: '#1e293b', margin: '0 0 4px' }}>{reg.eventName}</h3>
                      <p style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '13px', color: '#64748b', margin: '0 0 4px' }}>{reg.festName}</p>
                      <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>Deadline: {formatDate(reg.registrationEnd)}</span>
                    </div>
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


