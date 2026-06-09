import React, { useState, useEffect } from 'react';
import api from '../api';

export default function SuperAdminDashboard({ auth, onLogout }) {
  const [activeTab, setActiveTab] = useState('approve');
  const [pendingOrganizers, setPendingOrganizers] = useState([]);
  const [activeOrganizers, setActiveOrganizers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    setSuccessMsg(null);
    try {
      if (activeTab === 'approve') {
        const res = await api.get('/api/admin/users/pending');
        setPendingOrganizers(res.data);
      } else {
        const res = await api.get('/api/admin/users/active-organizers');
        setActiveOrganizers(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    setError(null);
    setSuccessMsg(null);
    try {
      await api.patch(`/api/admin/users/${id}/approve`);
      setSuccessMsg('Organizer approved successfully!');
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error approving organizer');
    }
  };

  const handleDeregister = async (id) => {
    if (!window.confirm("Are you sure you want to deregister this organizer?")) return;
    setError(null);
    setSuccessMsg(null);
    try {
      await api.patch(`/api/admin/users/${id}/deregister`);
      setSuccessMsg('Organizer deregistered successfully!');
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error deregistering organizer');
    }
  };

  return (
    <div className="student-home">
      <main className="dashboard-main" style={{ marginLeft: 0 }}>
        <header className="dashboard-nav" style={{ padding: '0 40px' }}>
          <button className="nav-brand" type="button" style={{ cursor: 'default' }}>
            CampusPulse <span style={{ color: '#534AB7' }}>Admin</span>
          </button>
          
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#64748b' }}>
              {auth.name}
            </span>
          </div>
        </header>

        <div className="dashboard-content" style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div className="section-header" style={{ marginBottom: '32px' }}>
            <h2 className="section-title">Super Admin Control Panel</h2>
            <p className="section-subtitle">Manage platform access for organizers.</p>
          </div>

          {error && <div style={{ background: '#fef2f2', color: '#b91c1c', padding: '12px 16px', borderRadius: '8px', marginBottom: '24px', fontSize: '14px', fontWeight: 500 }}>{error}</div>}
          {successMsg && <div style={{ background: '#f0fdf4', color: '#15803d', padding: '12px 16px', borderRadius: '8px', marginBottom: '24px', fontSize: '14px', fontWeight: 500 }}>{successMsg}</div>}

          <div style={{ display: 'flex', gap: '16px', marginBottom: '32px', borderBottom: '2px solid #e2e8f0', paddingBottom: '16px' }}>
            <button 
              onClick={() => setActiveTab('approve')}
              style={{
                background: 'none', border: 'none', padding: '8px 16px', fontSize: '15px', fontWeight: 600, cursor: 'pointer',
                color: activeTab === 'approve' ? '#534AB7' : '#64748b',
                borderBottom: activeTab === 'approve' ? '3px solid #534AB7' : '3px solid transparent',
                marginBottom: '-19px'
              }}
            >
              Approve Organizers
            </button>
            <button 
              onClick={() => setActiveTab('manage')}
              style={{
                background: 'none', border: 'none', padding: '8px 16px', fontSize: '15px', fontWeight: 600, cursor: 'pointer',
                color: activeTab === 'manage' ? '#534AB7' : '#64748b',
                borderBottom: activeTab === 'manage' ? '3px solid #534AB7' : '3px solid transparent',
                marginBottom: '-19px'
              }}
            >
              Manage Active Organizers
            </button>
          </div>

          {loading ? (
            <p style={{ color: '#64748b' }}>Loading...</p>
          ) : (
            <div>
              {activeTab === 'approve' && (
                <div>
                  {pendingOrganizers.length === 0 ? (
                    <p className="empty-copy">No organizers pending approval.</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {pendingOrganizers.map(org => (
                        <div key={org.id} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <h3 style={{ margin: '0 0 4px', fontSize: '16px', color: '#1e293b' }}>{org.name}</h3>
                            <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>{org.email}</p>
                          </div>
                          <button 
                            className="cp-button"
                            onClick={() => handleApprove(org.id)}
                            style={{ width: 'auto', padding: '8px 24px' }}
                          >
                            Approve
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'manage' && (
                <div>
                  {activeOrganizers.length === 0 ? (
                    <p className="empty-copy">No active organizers found.</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {activeOrganizers.map(org => (
                        <div key={org.id} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <h3 style={{ margin: '0 0 4px', fontSize: '16px', color: '#1e293b' }}>{org.name}</h3>
                            <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>{org.email}</p>
                          </div>
                          <button 
                            className="cp-button"
                            onClick={() => handleDeregister(org.id)}
                            style={{ width: 'auto', padding: '8px 24px', background: '#fff', color: '#ef4444', border: '1.5px solid #ef4444', boxShadow: 'none' }}
                          >
                            Deregister
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <button 
        onClick={onLogout}
        style={{
          position: 'fixed',
          bottom: '32px',
          left: '32px',
          background: '#fff',
          border: '1px solid #e2e8f0',
          padding: '10px 20px',
          borderRadius: '8px',
          color: '#64748b',
          fontWeight: 600,
          cursor: 'pointer',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          zIndex: 100
        }}
      >
        Logout
      </button>
    </div>
  );
}
