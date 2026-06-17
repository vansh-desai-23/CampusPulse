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
    <div className="student-shell">
      <header className="dashboard-nav" style={{ width: '100%', paddingLeft: '40px', paddingRight: '40px', borderBottom: '1px solid #e2e8f0' }}>
        <button className="nav-brand" type="button" onClick={handleBack}>
          CampusPulse <span style={{ color: '#534AB7', fontSize: '18px', marginLeft: '8px' }}>Organizer</span>
        </button>
        <div style={{ marginLeft: 'auto' }}>
          <button 
            onClick={handleBack} 
            style={{ background: 'transparent', border: '1px solid #e2e8f0', padding: '8px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#1e293b'; e.currentTarget.style.borderColor = '#cbd5e1'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
            Cancel
          </button>
        </div>
      </header>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <section className="student-workspace" style={{ overflowY: 'auto', width: '100%', paddingLeft: 0 }}>
          <div className="dashboard-content" style={{ maxWidth: '800px', margin: '0 auto', paddingTop: '40px', paddingBottom: '80px' }}>
            
            <div style={{ marginBottom: '40px' }}>
              <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#0f172a', marginBottom: '8px', letterSpacing: '-0.02em' }}>Launch a New Fest</h1>
              <p style={{ color: '#64748b', fontSize: '16px' }}>Configure the core details of your festival. You can add specific events later.</p>
            </div>

            {error && (
              <div style={{ background: '#fef2f2', borderLeft: '4px solid #ef4444', color: '#b91c1c', padding: '16px 20px', borderRadius: '0 8px 8px 0', marginBottom: '32px', fontSize: '15px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '12px' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '32px', background: '#fff', padding: '40px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
              
              {/* Basic Info Section */}
              <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '32px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b', marginBottom: '24px' }}>Basic Information</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div>
                    <label className="cp-label">Fest Name <span style={{color: '#ef4444'}}>*</span></label>
                    <input type="text" className="cp-input" name="name" value={formData.name} onChange={handleChange} required placeholder="e.g. Mood Indigo 2026" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }} />
                  </div>

                  <div>
                    <label className="cp-label">Description <span style={{color: '#ef4444'}}>*</span></label>
                    <textarea className="cp-input" name="description" value={formData.description} onChange={handleChange} required placeholder="What makes this fest special? Give an exciting overview..." style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}></textarea>
                    <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '8px' }}>This will be displayed on the fest's main landing page.</p>
                  </div>

                  <div>
                    <label className="cp-label">Fest Category</label>
                    <div className="cp-select-wrap">
                      <select className="cp-input" name="type" value={formData.type} onChange={handleChange} required style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                        <option value="CULTURAL">Cultural</option>
                        <option value="TECHNICAL">Technical</option>
                        <option value="SPORT">Sports & Athletics</option>
                        <option value="OTHER">Other</option>
                      </select>
                      <svg className="cp-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Schedule Section */}
              <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '32px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b', marginBottom: '24px' }}>Schedule</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  <div>
                    <label className="cp-label">Starts On <span style={{color: '#ef4444'}}>*</span></label>
                    <input type="datetime-local" className="cp-input" name="festStartTime" value={formData.festStartTime} onChange={handleChange} required style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }} />
                  </div>
                  <div>
                    <label className="cp-label">Ends On <span style={{color: '#ef4444'}}>*</span></label>
                    <input type="datetime-local" className="cp-input" name="festEndTime" value={formData.festEndTime} onChange={handleChange} required style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }} />
                  </div>
                </div>
              </div>

              {/* Branding Section */}
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b', marginBottom: '24px' }}>Branding</h3>
                <div style={{ padding: '24px', background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '12px' }}>
                  <CloudinaryUpload 
                    label="Cover Image Banner" 
                    currentUrl={formData.bannerImageUrl} 
                    onUploadSuccess={(url) => handleUploadSuccess('bannerImageUrl', url)} 
                  />
                  <p style={{ fontSize: '13px', color: '#64748b', marginTop: '16px', textAlign: 'center' }}>Recommended ratio is 16:9. High quality images work best.</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '16px' }}>
                <button 
                  type="button"
                  onClick={handleBack}
                  style={{ padding: '12px 24px', background: 'transparent', color: '#64748b', border: 'none', fontWeight: 600, fontSize: '15px', cursor: 'pointer', borderRadius: '8px' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting} 
                  style={{ 
                    padding: '12px 32px', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px', 
                    borderRadius: '8px', background: '#111827', color: '#fff', border: 'none', cursor: 'pointer',
                    boxShadow: 'none', fontWeight: 600, transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => { if(!isSubmitting) e.currentTarget.style.background = '#1f2937'; }}
                  onMouseLeave={(e) => { if(!isSubmitting) e.currentTarget.style.background = '#111827'; }}
                >
                  {isSubmitting ? 'Creating...' : (
                    <>
                      Initialize Fest
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </section>
      </div>
    </div>
  );
}

