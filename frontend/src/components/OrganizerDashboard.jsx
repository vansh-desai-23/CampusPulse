import React, { useState, useEffect } from 'react';
import api from '../api';
import landingBg from '../assets/landingpage_bg.svg';

function formatDate(value) {
  if (!value) return 'Date pending';
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(value));
}

function formatFestType(type) {
  if (!type) return 'Fest';
  return type.charAt(0) + type.slice(1).toLowerCase();
}

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
    <div className="student-shell">
      <header className="dashboard-nav" style={{ width: '100%', paddingLeft: '40px', paddingRight: '40px' }}>
        <button className="nav-brand" type="button" style={{ cursor: 'default' }}>
          CampusPulse <span style={{ color: '#534AB7', fontSize: '18px', marginLeft: '8px' }}>Organizer</span>
        </button>
        
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginLeft: 'auto' }}>
          <span style={{ fontSize: '14px', fontWeight: 600, color: '#64748b' }}>
            {auth.name}
          </span>
          <button 
            onClick={() => onNavigate('fest-create')}
            style={{ 
              marginLeft: 0, 
              border: '1.5px solid #111827', 
              background: '#fff', 
              color: '#111827', 
              borderRadius: '8px', 
              padding: '8px 20px', 
              fontSize: '14px', 
              fontWeight: '600', 
              cursor: 'pointer', 
              boxShadow: 'none',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#f8fafc'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; }}
          >
            Create New Fest
          </button>
        </div>
      </header>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <section className="student-workspace" style={{ overflowY: 'auto', width: '100%', paddingLeft: 0 }}>
          <div className="dashboard-content">
            <section className="dashboard-section">
              <div className="section-heading">
                <div className="section-title-row">
                  <h2>Your Festivals</h2>
                  <p>Manage your college fests and events.</p>
                </div>
              </div>

              {loading ? (
                <div className="fest-grid">
                  {Array(4).fill(0).map((_, i) => <div key={i} className="fest-card loading" />)}
                </div>
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
                    onClick={() => onNavigate('fest-create')}
                    style={{ 
                      border: '1.5px solid #111827', 
                      background: '#fff', 
                      color: '#111827', 
                      borderRadius: '8px', 
                      padding: '8px 20px', 
                      fontSize: '14px', 
                      fontWeight: '600', 
                      cursor: 'pointer', 
                      boxShadow: 'none',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#f8fafc'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; }}
                  >
                    Create Your First Fest
                  </button>
                </div>
              ) : (
                <div className="fest-grid">
                  {fests.map(fest => (
                    <article className="fest-card" key={fest.id} onClick={() => onNavigate('fest-manage', fest.id)} style={{ cursor: 'pointer' }}>
                      <div className="fest-banner" style={{ backgroundImage: `url(${fest.bannerImageUrl || '/assets/default-fest.png'})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                        <span>{formatFestType(fest.type)}</span>
                      </div>
                      <div className="fest-body">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                          <h3>{fest.name}</h3>
                          <span style={{
                            fontSize: '10px', fontWeight: 800, padding: '4px 8px', borderRadius: '12px',
                            background: fest.status === 'PUBLISHED' ? '#dcfce7' : '#f1f5f9',
                            color: fest.status === 'PUBLISHED' ? '#166534' : '#64748b',
                            textTransform: 'uppercase'
                          }}>
                            {fest.status}
                          </span>
                        </div>
                        <p>{fest.ownerName || 'Campus Organizer'}</p>
                        <div className="fest-meta">
                          <span>{formatDate(fest.festStartTime)} - {formatDate(fest.festEndTime)}</span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </div>
        </section>
      </div>

      <button 
        className="cp-button" 
        onClick={onLogout} 
        style={{ position: 'fixed', bottom: '24px', left: '24px', fontSize: '12px', width: 'auto', padding: '6px 16px', background: '#fff', color: '#ef4444', border: '1px solid #ef4444', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', zIndex: 1000 }}
      >
        Logout
      </button>
    </div>
  );
}

