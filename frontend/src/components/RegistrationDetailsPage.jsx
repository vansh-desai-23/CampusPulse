import React, { useEffect, useState } from 'react';
import api from '../api';

function formatDate(value) {
  if (!value) return 'Date pending';
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(value));
}

export default function RegistrationDetailsPage({ teamId, onNavigate }) {
  const [team, setTeam] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [showModal, setShowModal] = useState(false);
  const [isUnregistering, setIsUnregistering] = useState(false);
  const [unregError, setUnregError] = useState('');

  useEffect(() => {
    async function fetchTeam() {
      try {
        const response = await api.get(`/api/teams/${teamId}`);
        setTeam(response.data);
      } catch (err) {
        setError('Could not load registration details.');
      } finally {
        setIsLoading(false);
      }
    }
    if (teamId) fetchTeam();
  }, [teamId]);

  const confirmUnregister = async () => {
    setIsUnregistering(true);
    setUnregError('');
    try {
      await api.post(`/api/teams/${teamId}/leave`);
      setShowModal(false);
      alert("Successfully unregistered.");
      onNavigate('view-all-registered');
    } catch (err) {
      setUnregError(err.response?.data?.message || err.response?.data?.error || "Failed to unregister.");
    } finally {
      setIsUnregistering(false);
    }
  };

  const initiateUnregister = () => {
    const now = new Date();
    const deadline = new Date(team.registrationEnd);
    if (now >= deadline) {
      alert("Cannot unregister. The registration window for this event has closed.");
      return;
    }
    setUnregError('');
    setShowModal(true);
  };

  if (isLoading) return <div className="loading-state">Loading details...</div>;
  if (error || !team) return <div className="error-state">{error || 'Registration not found.'}</div>;

  const isClosed = new Date() >= new Date(team.registrationEnd);

  return (
    <div className="cp-page details-page">
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Unregister from Event</h2>
            <p>
              Are you sure you want to unregister from <strong>{team.eventName}</strong>? 
              If you are the last person in the team, the team will be permanently dissolved.
            </p>
            {unregError && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '-12px' }}>{unregError}</p>}
            <div className="modal-actions">
              <button className="modal-cancel" onClick={() => setShowModal(false)} disabled={isUnregistering}>Cancel</button>
              <button className="modal-confirm" onClick={confirmUnregister} disabled={isUnregistering} style={{ background: '#ef4444' }}>
                {isUnregistering ? 'Processing...' : 'Yes, Unregister'}
              </button>
            </div>
          </div>
        </div>
      )}

      <header className="cp-header">
        <button className="cp-brand-btn" onClick={() => onNavigate('student')}>CampusPulse</button>
        <span className="header-separator">/</span>
        <button className="cp-brand-btn" onClick={() => onNavigate('view-all-registered')}>My Registrations</button>
        <span className="header-separator">/</span>
        <span className="header-current">Team Details</span>
      </header>

      <main className="details-content">
        <div className="info-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <span className="category-pill" style={{ background: '#10b981' }}>Confirmed</span>
              <h1 style={{ fontSize: '28px', margin: '8px 0', color: '#1e293b' }}>{team.eventName}</h1>
              <p style={{ color: '#64748b', fontSize: '16px', margin: '0 0 8px' }}>{team.festName}</p>
              {team.teamName && <p style={{ fontWeight: 800, fontSize: '18px', color: '#534AB7', margin: 0 }}>Team: {team.teamName}</p>}
            </div>
            
            <div style={{ textAlign: 'right', background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>Share Invite Code</label>
              <code style={{ fontSize: '24px', fontWeight: 800, color: '#1e293b', letterSpacing: '2px' }}>
                {team.inviteCode}
              </code>
              <p style={{ fontSize: '12px', color: '#94a3b8', margin: '8px 0 0' }}>Registration closes: {formatDate(team.registrationEnd)}</p>
            </div>
          </div>

          <div style={{ marginTop: '40px' }}>
            <h2 style={{ fontSize: '18px', marginBottom: '16px', color: '#1e293b' }}>Team Members ({team.memberCount} / {team.maxTeamSize})</h2>
            <div style={{ display: 'grid', gap: '12px' }}>
              {team.members.map(member => (
                <div key={member.userId} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', background: '#ffffff', borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#eef2ff', color: '#534AB7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: 800 }}>
                    {member.name.charAt(0)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 2px', color: '#1e293b' }}>{member.name}</p>
                    <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>{member.email}</p>
                  </div>
                  {member.userId === team.leaderId && (
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#534AB7', background: '#e0e7ff', padding: '4px 10px', borderRadius: '6px' }}>Leader</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: '48px', paddingTop: '24px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
            <p style={{ fontSize: '14px', color: '#64748b', margin: 0, flex: 1, minWidth: '280px' }}>
              Need to leave this team? You can unregister until the deadline passes.
            </p>
            <button 
              className="cp-button" 
              onClick={initiateUnregister} 
              disabled={isClosed}
              style={{ 
                width: 'auto', 
                padding: '0 24px', 
                background: isClosed ? '#cbd5e1' : '#ffffff', 
                color: isClosed ? '#94a3b8' : '#ef4444', 
                border: isClosed ? '1.5px solid #cbd5e1' : '1.5px solid #ef4444', 
                borderRadius: '8px', 
                boxShadow: 'none' 
              }}
            >
              {isClosed ? 'Registration Closed' : 'Unregister from Event'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}