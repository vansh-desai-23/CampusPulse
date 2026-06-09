import React from 'react';

export default function WaitingApprovalPage({ onNavigate }) {
  return (
    <div className="cp-page">
      <header className="cp-header">
        <button className="cp-brand-btn" onClick={() => onNavigate('landing')} type="button">
          CampusPulse
        </button>
      </header>

      <main className="cp-main" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'url(/assets/landingpage_bg.svg) center / cover no-repeat fixed #f8fafc' }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          borderRadius: '16px',
          padding: '40px',
          maxWidth: '500px',
          textAlign: 'center',
          boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15)'
        }}>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#1e293b', marginBottom: '16px' }}>Registration Received</h2>
          <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.6, marginBottom: '32px' }}>
            Your organizer registration has been received. Access will be unlocked once campus gymkhana validates your club credentials.
          </p>
          <button 
            className="cp-button" 
            onClick={() => onNavigate('landing')}
            style={{ width: 'auto', padding: '10px 24px', fontSize: '14px', margin: '0 auto', display: 'inline-block', textAlign: 'center' }}
          >
            Return to Home
          </button>
        </div>
      </main>
    </div>
  );
}
