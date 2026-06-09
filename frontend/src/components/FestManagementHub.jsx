import React, { useState, useEffect } from 'react';
import api from '../api';
import CloudinaryUpload from './CloudinaryUpload';

export default function FestManagementHub({ festId, onNavigate }) {
  const [fest, setFest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Event Modal State
  const [showEventModal, setShowEventModal] = useState(false);
  const [eventData, setEventData] = useState({
    name: '',
    description: '',
    venue: '',
    maxCapacity: 1,
    maxTeamSize: 1,
    registrationStart: '',
    registrationEnd: '',
    physicalEventStart: '',
    physicalEventEnd: '',
    eventBannerUrl: '',
    eventLogoUrl: ''
  });
  const [isEventDirty, setIsEventDirty] = useState(false);
  const [eventError, setEventError] = useState(null);
  const [submittingEvent, setSubmittingEvent] = useState(false);

  useEffect(() => {
    fetchFest();
  }, [festId]);

  const fetchFest = async () => {
    try {
      const res = await api.get(`/api/fests/${festId}`);
      setFest(res.data);
    } catch (err) {
      setError('Unable to load fest details.');
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    if (fest.events.length === 0) {
      alert('You cannot publish an empty festival. Please add at least one event before going live.');
      return;
    }
    try {
      await api.patch(`/api/fests/${festId}/publish`);
      fetchFest();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to publish fest.');
    }
  };

  const openEventModal = () => {
    setEventData({
      name: '', description: '', venue: '', maxCapacity: 1, maxTeamSize: 1,
      registrationStart: '', registrationEnd: '', physicalEventStart: '', physicalEventEnd: '',
      eventBannerUrl: '', eventLogoUrl: ''
    });
    setIsEventDirty(false);
    setEventError(null);
    setShowEventModal(true);
  };

  const closeEventModal = () => {
    if (isEventDirty) {
      if (!window.confirm('You have unsaved changes. Are you sure you want to leave?')) {
        return;
      }
    }
    setShowEventModal(false);
  };

  const handleEventChange = (e) => {
    setIsEventDirty(true);
    const { name, value } = e.target;
    // Prevent negative numbers for capacity
    if ((name === 'maxCapacity' || name === 'maxTeamSize') && Number(value) < 1) {
      return;
    }
    setEventData({ ...eventData, [name]: value });
  };

  const handleEventUpload = (field, url) => {
    setIsEventDirty(true);
    setEventData({ ...eventData, [field]: url });
  };

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    setEventError(null);
    
    const rs = new Date(eventData.registrationStart);
    const re = new Date(eventData.registrationEnd);
    const ps = new Date(eventData.physicalEventStart);
    const pe = new Date(eventData.physicalEventEnd);

    if (!(rs < re && re < ps && ps < pe)) {
      setEventError('Timeline Error: Registration must start before it ends, end before the event starts, and the event must start before it ends.');
      return;
    }

    setSubmittingEvent(true);
    try {
      await api.post(`/api/fests/${festId}/events`, eventData);
      setIsEventDirty(false);
      setShowEventModal(false);
      fetchFest();
    } catch (err) {
      setEventError(err.response?.data?.message || 'Failed to create event.');
    } finally {
      setSubmittingEvent(false);
    }
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading Fest Hub...</div>;
  if (error || !fest) return <div style={{ padding: '40px', textAlign: 'center', color: '#ef4444' }}>{error}</div>;

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', paddingBottom: '60px' }}>
      <header style={{ 
        height: '280px', background: '#1e293b', backgroundImage: `url(${fest.bannerImageUrl})`, 
        backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative'
      }}>
        {/* Dark overlay to ensure text is ALWAYS readable regardless of banner image */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(15,23,42,0.8) 0%, rgba(15,23,42,0.4) 50%, rgba(15,23,42,0.1) 100%)' }} />

        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '20px', display: 'flex', justifyContent: 'space-between', zIndex: 10 }}>
          <button onClick={() => onNavigate('organizer-dashboard')} style={{ background: 'rgba(255,255,255,0.9)', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }} onMouseEnter={(e) => e.currentTarget.style.background = '#fff'} onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.9)'}>
            ‹ Back to Dashboard
          </button>
          
          {fest.status === 'PUBLISHED' ? (
            <span style={{ background: '#22c55e', color: '#fff', padding: '8px 20px', borderRadius: '8px', fontWeight: 700, boxShadow: '0 4px 12px rgba(34,197,94,0.3)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', background: '#fff', borderRadius: '50%', display: 'inline-block' }}></span> LIVE
            </span>
          ) : (
            <button 
              className="cp-button" 
              onClick={handlePublish} 
              style={{ width: 'auto', padding: '10px 24px', background: '#534AB7', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(83, 74, 183, 0.4)', transition: 'all 0.2s', borderRadius: '10px' }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21.2 15c.7-1.2 1-2.5.7-3.9-.6-2-2.4-3.5-4.4-3.5h-1.2c-.7-3-3.2-5.2-6.2-5.6-3-.3-5.9 1.3-7.3 4-1.2 2.5-1 6.5.5 8.8m8.7-1.6V21"/><path d="M16 16l-4-4-4 4"/></svg>
              Publish Fest
            </button>
          )}
        </div>
        
        <div style={{ position: 'absolute', bottom: '30px', left: '40px', display: 'flex', alignItems: 'center', gap: '24px', zIndex: 10 }}>
          {fest.logoImageUrl && (
            <img src={fest.logoImageUrl} alt="Logo" style={{ width: '120px', height: '120px', borderRadius: '20px', border: '4px solid rgba(255,255,255,0.2)', background: '#fff', objectFit: 'cover', boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }} />
          )}
          <div style={{ background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(12px)', padding: '20px 28px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
            <h1 style={{ color: '#fff', margin: '0 0 8px', fontSize: '36px', fontWeight: 800, textShadow: '0 2px 4px rgba(0,0,0,0.4)', letterSpacing: '-0.5px' }}>{fest.name}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ background: fest.status === 'PUBLISHED' ? '#22c55e' : 'rgba(255,255,255,0.15)', color: '#fff', fontSize: '12px', fontWeight: 700, padding: '4px 12px', borderRadius: '12px', border: fest.status === 'PUBLISHED' ? 'none' : '1px solid rgba(255,255,255,0.2)' }}>{fest.status}</span>
              <span style={{ color: '#cbd5e1', fontSize: '14px', fontWeight: 600 }}>•</span>
              <span style={{ color: '#e2e8f0', fontSize: '14px', fontWeight: 600, letterSpacing: '0.5px' }}>{fest.type}</span>
            </div>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: '1000px', margin: '40px auto 0', padding: '0 40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#1e293b', margin: 0 }}>Events</h2>
          <button 
            className="cp-button" 
            onClick={openEventModal} 
            style={{ width: 'auto', padding: '10px 20px', background: '#fff', color: '#534AB7', border: '2px solid #e0e7ff', boxShadow: '0 4px 6px rgba(83,74,183,0.05)', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s', borderRadius: '10px' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = '#c7d2fe'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#e0e7ff'; }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Add Event
          </button>
        </div>

        {fest.events.length === 0 ? (
          <div style={{ background: '#fff', padding: '60px', textAlign: 'center', borderRadius: '16px', border: '1px dashed #cbd5e1' }}>
            <p style={{ color: '#64748b', fontSize: '16px', margin: '0 0 20px' }}>No events added yet.</p>
            <button className="cp-button" onClick={openEventModal} style={{ width: 'auto', padding: '10px 24px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              Create First Event
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
            {fest.events.map(ev => (
              <div key={ev.id} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
                <div style={{ height: '120px', background: '#f1f5f9', backgroundImage: `url(${ev.eventBannerUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                <div style={{ padding: '20px' }}>
                  <h3 style={{ margin: '0 0 8px', fontSize: '18px', color: '#1e293b' }}>{ev.name}</h3>
                  <p style={{ margin: '0 0 12px', fontSize: '13px', color: '#64748b' }}>Venue: {ev.venue}</p>
                  <p style={{ margin: 0, fontSize: '12px', color: '#534AB7', fontWeight: 600 }}>{new Date(ev.physicalEventStart).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Event Creation Modal */}
      {showEventModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15,23,42,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto', padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 800 }}>Create Event</h2>
              <button onClick={closeEventModal} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#64748b' }}>×</button>
            </div>

            {eventError && <div style={{ background: '#fef2f2', color: '#b91c1c', padding: '12px 16px', borderRadius: '8px', marginBottom: '24px', fontSize: '14px', fontWeight: 500 }}>{eventError}</div>}

            <form onSubmit={handleEventSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label className="cp-label">Event Name</label>
                <input type="text" className="cp-input" name="name" value={eventData.name} onChange={handleEventChange} required />
              </div>
              <div>
                <label className="cp-label">Description</label>
                <textarea className="cp-input" name="description" value={eventData.description} onChange={handleEventChange} required rows="3"></textarea>
              </div>
              <div>
                <label className="cp-label">Venue</label>
                <input type="text" className="cp-input" name="venue" value={eventData.venue} onChange={handleEventChange} required />
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label className="cp-label">Maximum Number of Teams</label>
                  <input type="number" className="cp-input" name="maxCapacity" value={eventData.maxCapacity} onChange={handleEventChange} min="1" required />
                </div>
                <div style={{ flex: 1 }}>
                  <label className="cp-label">Max Members per Team</label>
                  <input type="number" className="cp-input" name="maxTeamSize" value={eventData.maxTeamSize} onChange={handleEventChange} min="1" required />
                </div>
              </div>

              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <h4 style={{ margin: '0 0 16px', color: '#1e293b' }}>Timeline (Must fit within {new Date(fest.festStartTime).toLocaleDateString()} - {new Date(fest.festEndTime).toLocaleDateString()})</h4>
                <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                  <div style={{ flex: 1 }}>
                    <label className="cp-label">Registration Start</label>
                    <input type="datetime-local" className="cp-input" name="registrationStart" value={eventData.registrationStart} onChange={handleEventChange} required />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label className="cp-label">Registration End</label>
                    <input type="datetime-local" className="cp-input" name="registrationEnd" value={eventData.registrationEnd} onChange={handleEventChange} required />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ flex: 1 }}>
                    <label className="cp-label">Physical Event Start</label>
                    <input type="datetime-local" className="cp-input" name="physicalEventStart" value={eventData.physicalEventStart} onChange={handleEventChange} min={fest.festStartTime.slice(0, 16)} max={fest.festEndTime.slice(0, 16)} required />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label className="cp-label">Physical Event End</label>
                    <input type="datetime-local" className="cp-input" name="physicalEventEnd" value={eventData.physicalEventEnd} onChange={handleEventChange} min={fest.festStartTime.slice(0, 16)} max={fest.festEndTime.slice(0, 16)} required />
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <CloudinaryUpload label="Event Banner" currentUrl={eventData.eventBannerUrl} onUploadSuccess={(url) => handleEventUpload('eventBannerUrl', url)} />
                </div>
                <div style={{ flex: 1 }}>
                  <CloudinaryUpload label="Event Logo" currentUrl={eventData.eventLogoUrl} onUploadSuccess={(url) => handleEventUpload('eventLogoUrl', url)} />
                </div>
              </div>

              <button type="submit" className="cp-button" disabled={submittingEvent} style={{ width: '100%', marginTop: '8px' }}>
                {submittingEvent ? 'Saving...' : 'Save Event'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
