import React, { useState, useEffect } from 'react';
import api from '../api';
import { QRCodeCanvas } from 'qrcode.react';

export default function StudentWallet({ auth, onNavigate }) {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPass, setSelectedPass] = useState(null);

  useEffect(() => {
    fetchMyPasses();
  }, []);

  const fetchMyPasses = async () => {
    try {
      const res = await api.get('/api/teams/my');
      setTeams(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading your wallet...</div>;

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#1e293b' }}>
      <header style={{ padding: '20px 40px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff' }}>
        <button onClick={() => onNavigate('student')} style={{ background: '#f1f5f9', border: 'none', color: '#64748b', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>
          ‹ Back to Dashboard
        </button>
        <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#534AB7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
          My Digital Wallet
        </h1>
        <div style={{ width: '130px' }}></div> {/* Spacer */}
      </header>

      <main style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px' }}>
        <p style={{ color: '#64748b', fontSize: '16px', marginBottom: '32px' }}>Your secured passes for upcoming events.</p>

        {teams.length === 0 ? (
          <div style={{ background: '#fff', border: '1px dashed #cbd5e1', borderRadius: '16px', padding: '60px 40px', textAlign: 'center' }}>
            <p style={{ color: '#64748b', fontSize: '18px', margin: 0 }}>Your wallet is empty.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {teams.map(team => {
              const myMember = team.members.find(m => m.email === auth.email);
              const now = new Date();
              const regEnd = new Date(team.registrationEnd);
              const isLocked = now < regEnd;
              const hasToken = myMember && myMember.qrToken;

              return (
                <div key={team.id} style={{
                  background: '#fff',
                  border: `1px solid ${isLocked ? '#e2e8f0' : '#c7d2fe'}`,
                  borderRadius: '16px', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  opacity: isLocked ? 0.8 : 1, transition: 'all 0.3s',
                  boxShadow: isLocked ? 'none' : '0 4px 12px rgba(83, 74, 183, 0.05)'
                }}>
                  <div>
                    <h3 style={{ margin: '0 0 4px', fontSize: '20px', fontWeight: 800, color: '#1e293b' }}>{team.eventName}</h3>
                    <p style={{ margin: '0 0 12px', color: '#64748b', fontSize: '14px' }}>{team.festName} • Team: {team.teamName}</p>
                    
                    {isLocked ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '13px', background: '#f1f5f9', padding: '8px 12px', borderRadius: '8px', width: 'fit-content' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0110 0v4"></path></svg>
                        Your secure pass will unlock automatically when registration closes on {regEnd.toLocaleDateString()}
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#16a34a', fontSize: '13px', fontWeight: 600, background: '#f0fdf4', padding: '4px 10px', borderRadius: '8px', width: 'fit-content' }}>
                        <span style={{ width: '8px', height: '8px', background: '#16a34a', borderRadius: '50%', display: 'inline-block' }}></span> Ticket Generated
                      </div>
                    )}
                  </div>

                  {!isLocked && hasToken && (
                    <button 
                      onClick={() => setSelectedPass({ team, member: myMember })}
                      style={{
                        background: '#534AB7', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '12px',
                        fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(83, 74, 183, 0.4)', transition: 'transform 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                      View Digital Pass
                    </button>
                  )}
                  {!isLocked && !hasToken && (
                    <div style={{ color: '#ef4444', fontSize: '13px', fontWeight: 600 }}>Processing...</div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* QR Code Modal */}
      {selectedPass && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.9)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px'
        }}>
          <div style={{ background: '#fff', borderRadius: '24px', padding: '40px', width: '100%', maxWidth: '400px', textAlign: 'center', position: 'relative' }}>
            <button 
              onClick={() => setSelectedPass(null)}
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', fontSize: '24px', color: '#64748b', cursor: 'pointer' }}
            >×</button>
            <h2 style={{ margin: '0 0 8px', color: '#1e293b', fontSize: '24px', fontWeight: 800 }}>{selectedPass.team.eventName}</h2>
            <p style={{ margin: '0 0 32px', color: '#64748b', fontSize: '14px' }}>Admit One • {selectedPass.team.festName}</p>
            
            <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '16px', display: 'inline-block', marginBottom: '24px' }}>
              <QRCodeCanvas value={selectedPass.member.qrToken} size={256} level="H" />
            </div>

            <div style={{ borderTop: '1px dashed #cbd5e1', paddingTop: '24px' }}>
              <p style={{ margin: '0 0 4px', color: '#94a3b8', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Verified Student</p>
              <p style={{ margin: 0, color: '#1e293b', fontSize: '18px', fontWeight: 700 }}>{selectedPass.member.email}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
