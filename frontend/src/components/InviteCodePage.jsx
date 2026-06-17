import React, { useState } from 'react';
import api from '../api';

export default function InviteCodePage({ onNavigate }) {
  const [inviteCode, setInviteCode] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleJoin = async (e) => {
    e.preventDefault();
    if (!inviteCode.trim()) return;

    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      await api.post('/api/teams/join', { inviteCode: inviteCode.trim() });
      setStatus({ type: 'success', message: 'Successfully joined the team!' });
      setTimeout(() => onNavigate('student'), 2000);
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.response?.data?.message || 'Invalid or expired invite code.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="cp-page">
      <header className="cp-header">
        <button className="cp-brand-btn" onClick={() => onNavigate('student')}>CampusPulse</button>
        <span className="header-separator">/</span>
        <span className="header-current">Join Team</span>
      </header>

      <main className="cp-main">
        <div className="cp-card">
          <div className="cp-card-body">
            <h1 className="cp-title">Enter Invite Code</h1>
            <p style={{ fontSize: '15px', color: '#64748b', marginBottom: '20px' }}>
              Enter the unique code shared by your teammate to join their group.
            </p>

            <form className="cp-form" onSubmit={handleJoin}>
              <label className="cp-field">
                <span className="cp-label">Invite Code</span>
                <input 
                  type="text" 
                  className="cp-input" 
                  placeholder="e.g. TEAM-XXXX"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                  required
                />
              </label>

              {status.message && (
                <div style={{ marginTop: '12px', fontSize: '14px', color: status.type === 'error' ? '#ef4444' : '#10b981', textAlign: 'center' }}>
                  {status.message}
                </div>
              )}

              <button 
                type="submit" 
                className="cp-button" 
                disabled={isSubmitting || !inviteCode.trim()}
              >
                {isSubmitting ? 'Joining...' : 'Join Team'}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
