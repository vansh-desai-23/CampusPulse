import React, { useEffect, useState } from 'react';
import api from '../api';

function formatDate(value) {
  if (!value) return 'Date pending';
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(value));
}

export default function RegisteredPage({ onNavigate }) {
  const [registrations, setRegistrations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [teamToUnregister, setTeamToUnregister] = useState(null);

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

  const handleUnregisterClick = (reg, e) => {
    e.stopPropagation();
    const now = new Date();
    const deadline = new Date(reg.registrationEnd);
    if (now >= deadline) {
      alert("Cannot unregister. The registration window for this event has closed.");
      return;
    }
    setTeamToUnregister(reg);
    setShowModal(true);
  };

  const confirmUnregister = async () => {
    if (!teamToUnregister) return;
    try {
      await api.post(`/api/teams/${teamToUnregister.id}/leave`);
      setShowModal(false);
      setTeamToUnregister(null);
      fetchRegistrations();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to unregister.");
    }
  };

  return (
    <div className="cp-page">
      {showModal && teamToUnregister && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Unregister from Event</h2>
            <p>Are you sure you want to unregister from <strong>{teamToUnregister.eventName}</strong>?</p>
            <div className="modal-actions">
              <button className="modal-cancel" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="modal-confirm" onClick={confirmUnregister} style={{ background: '#ef4444' }}>
                Yes, Unregister
              </button>
            </div>
          </div>
        </div>
      )}

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
                  <div key={reg.id} className="event-blob" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minWidth: 0, padding: '16px', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center', minWidth: 0, width: '100%', cursor: 'pointer' }} onClick={() => onNavigate('registration-details', reg.id)}>
                      <div className="blob-banner" style={{ background: '#f1f5f9', backgroundImage: reg.eventBannerUrl ? `url(${reg.eventBannerUrl})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center', width: '80px', height: '80px', flexShrink: 0, borderRadius: '12px' }} />
                      <div style={{ minWidth: 0, flex: 1, paddingRight: '16px' }}>
                        <h3 style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '16px', color: '#1e293b', margin: '0 0 4px' }}>{reg.eventName}</h3>
                        <p style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '13px', color: '#64748b', margin: '0 0 4px' }}>{reg.festName}</p>
                        <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>Deadline: {formatDate(reg.registrationEnd)}</span>
                      </div>
                    </div>
                    <button 
                      className="cp-button" 
                      onClick={(e) => handleUnregisterClick(reg, e)}
                      disabled={isClosed}
                      style={{ background: isClosed ? '#cbd5e1' : '#ef4444', width: '100%', marginTop: 'auto', boxShadow: isClosed ? 'none' : '0 2px 4px rgba(239, 68, 68, 0.1)' }}
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
