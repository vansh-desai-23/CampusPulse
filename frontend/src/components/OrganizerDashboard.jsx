import React, { useState, useEffect } from 'react';
import api from '../api';
import landingBg from '../assets/landingpage_bg.svg';

export default function OrganizerDashboard({ auth, onNavigate, onLogout }) {
  const [fests, setFests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFests();
  }, []);

  const fetchFests = async () => {
    try {
      const res = await api.get('/api/fests/my-fests');
      setFests(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="student-home">
      <main className="dashboard-main" style={{ marginLeft: 0 }}>
        <header className="dashboard-nav" style={{ padding: '0 40px' }}>
          <button className="nav-brand" type="button" style={{ cursor: 'default' }}>
            CampusPulse <span style={{ color: '#534AB7' }}>Organizer</span>
          </button>
          
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#64748b' }}>
              {auth.name}
            </span>
            <button 
              className="cp-button"
              onClick={() => onNavigate('fest-create')}
              style={{ 
                width: 'auto', padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '8px', 
                boxShadow: '0 4px 12px rgba(83, 74, 183, 0.25)', transition: 'all 0.2s', borderRadius: '10px'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              Create New Fest
            </button>
          </div>
        </header>

        <div className="dashboard-content" style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div className="section-header" style={{ marginBottom: '32px' }}>
            <h2 className="section-title">Your Festivals</h2>
            <p className="section-subtitle">Manage your college fests and events.</p>
          </div>

          {loading ? (
            <p style={{ color: '#64748b' }}>Loading fests...</p>
          ) : fests.length === 0 ? (
            <div style={{
              background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '60px 40px',
              textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
            }}>
              <img src={landingBg} alt="" style={{ width: '200px', opacity: 0.8, marginBottom: '24px' }} />
              <h3 style={{ fontSize: '20px', color: '#1e293b', marginBottom: '12px' }}>No festivals yet</h3>
              <p style={{ color: '#64748b', marginBottom: '24px', maxWidth: '400px', margin: '0 auto 24px' }}>
                Start planning your first big event! Create a fest to manage registrations, teams, and live capacities.
              </p>
              <button 
                className="cp-button"
                onClick={() => onNavigate('fest-create')}
                style={{ 
                  width: 'auto', padding: '12px 32px', display: 'inline-flex', alignItems: 'center', gap: '8px',
                  boxShadow: '0 6px 16px rgba(83, 74, 183, 0.25)', borderRadius: '12px', fontSize: '16px', transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                Create Your First Fest
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
              {fests.map(fest => (
                <div 
                  key={fest.id} 
                  onClick={() => onNavigate('fest-manage', fest.id)}
                  style={{
                    background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden',
                    cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s', boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.08)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'; }}
                >
                  <div style={{ height: '140px', background: '#f1f5f9', backgroundImage: `url(${fest.bannerImageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                  <div style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <h3 style={{ margin: 0, fontSize: '18px', color: '#1e293b', fontWeight: 700 }}>{fest.name}</h3>
                      <span style={{
                        fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '12px',
                        background: fest.status === 'PUBLISHED' ? '#dcfce7' : '#f1f5f9',
                        color: fest.status === 'PUBLISHED' ? '#166534' : '#64748b'
                      }}>
                        {fest.status}
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
                      {new Date(fest.festStartTime).toLocaleDateString()} - {new Date(fest.festEndTime).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <button 
        onClick={onLogout}
        style={{
          position: 'fixed', bottom: '32px', left: '32px', background: '#fff', border: '1px solid #e2e8f0',
          padding: '10px 20px', borderRadius: '8px', color: '#64748b', fontWeight: 600, cursor: 'pointer',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)', zIndex: 100
        }}
      >
        Logout
      </button>
    </div>
  );
}
