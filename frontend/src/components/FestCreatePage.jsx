import React, { useState } from 'react';
import api from '../api';
import CloudinaryUpload from './CloudinaryUpload';

export default function FestCreatePage({ onNavigate }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'CULTURAL',
    festStartTime: '',
    festEndTime: '',
    bannerImageUrl: ''
  });
  const [isDirty, setIsDirty] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setIsDirty(true);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUploadSuccess = (field, url) => {
    setIsDirty(true);
    setFormData({ ...formData, [field]: url });
  };

  const handleBack = () => {
    if (isDirty) {
      if (!window.confirm('You have unsaved changes. Are you sure you want to leave?')) {
        return;
      }
    }
    onNavigate('organizer-dashboard');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (new Date(formData.festStartTime) >= new Date(formData.festEndTime)) {
      setError('Fest start time must be before fest end time.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      const res = await api.post('/api/fests', formData);
      setIsDirty(false); // safe to navigate
      onNavigate('fest-manage', res.data.id);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create fest.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="cp-page">
      <header className="cp-header">
        <button 
          onClick={handleBack} 
          type="button"
          style={{ background: 'transparent', border: 'none', padding: '8px', fontSize: '15px', fontWeight: 600, color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', transition: 'color 0.2s' }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#1e293b'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#64748b'}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
          Back to Dashboard
        </button>
      </header>

      <main className="cp-main" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', padding: '40px 20px' }}>
        <div style={{
          background: '#fff', borderRadius: '16px', padding: '40px', width: '100%', maxWidth: '700px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0'
        }}>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#1e293b', marginBottom: '8px' }}>Create New Fest</h2>
          <p style={{ color: '#64748b', marginBottom: '32px' }}>Fill out the details below to initialize your festival.</p>

          {error && <div style={{ background: '#fef2f2', color: '#b91c1c', padding: '12px 16px', borderRadius: '8px', marginBottom: '24px', fontSize: '14px', fontWeight: 500 }}>{error}</div>}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label className="cp-label">Fest Name</label>
              <input type="text" className="cp-input" name="name" value={formData.name} onChange={handleChange} required placeholder="e.g. Mood Indigo 2026" />
            </div>

            <div>
              <label className="cp-label">Description</label>
              <textarea className="cp-input" name="description" value={formData.description} onChange={handleChange} required rows="4" placeholder="Describe your fest..."></textarea>
            </div>

            <div>
              <label className="cp-label">Fest Type</label>
              <select className="cp-input" name="type" value={formData.type} onChange={handleChange} required>
                <option value="CULTURAL">CULTURAL</option>
                <option value="TECHNICAL">TECHNICAL</option>
                <option value="SPORT">SPORT</option>
                <option value="OTHER">OTHER</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ flex: 1 }}>
                <label className="cp-label">Start Time</label>
                <input type="datetime-local" className="cp-input" name="festStartTime" value={formData.festStartTime} onChange={handleChange} required />
              </div>
              <div style={{ flex: 1 }}>
                <label className="cp-label">End Time</label>
                <input type="datetime-local" className="cp-input" name="festEndTime" value={formData.festEndTime} onChange={handleChange} required />
              </div>
            </div>

            <div>
              <CloudinaryUpload 
                label="Fest Banner" 
                currentUrl={formData.bannerImageUrl} 
                onUploadSuccess={(url) => handleUploadSuccess('bannerImageUrl', url)} 
              />
            </div>

            <div style={{ marginTop: '16px' }}>
              <button 
                type="submit" 
                className="cp-button" 
                disabled={isSubmitting} 
                style={{ width: '100%', padding: '14px', fontSize: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(83, 74, 183, 0.3)', transition: 'all 0.2s', borderRadius: '12px' }}
                onMouseEnter={(e) => { if(!isSubmitting) e.currentTarget.style.transform = 'translateY(-2px)' }}
                onMouseLeave={(e) => { if(!isSubmitting) e.currentTarget.style.transform = 'translateY(0)' }}
              >
                {isSubmitting ? 'Creating...' : (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
                    Initialize Fest
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
