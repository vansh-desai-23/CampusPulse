import React, { useState, useRef } from 'react';

export default function CloudinaryUpload({ label, onUploadSuccess, currentUrl }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('Image upload failed. Please try a file under 5MB.');
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'campus_pulse_preset');

    try {
      const response = await fetch('https://api.cloudinary.com/v1_1/dclqggg1d/image/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      onUploadSuccess(data.secure_url);
    } catch (err) {
      setError('Image upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginBottom: '16px' }}>
      <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>
        {label}
      </label>
      
      {error && <div style={{ color: '#ef4444', fontSize: '13px', marginBottom: '8px' }}>{error}</div>}
      
      <div 
        onClick={() => fileInputRef.current.click()}
        style={{
          border: '2px dashed #cbd5e1',
          borderRadius: '12px',
          padding: currentUrl ? '0' : '32px',
          textAlign: 'center',
          cursor: 'pointer',
          background: '#f8fafc',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '120px'
        }}
      >
        <input 
          type="file" 
          accept="image/*" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          style={{ display: 'none' }} 
        />
        
        {loading ? (
          <div style={{ color: '#534AB7', fontWeight: 600 }}>Uploading...</div>
        ) : currentUrl ? (
          <img src={currentUrl} alt="Uploaded" style={{ width: '100%', height: 'auto', maxHeight: '200px', objectFit: 'contain' }} />
        ) : (
          <div style={{ color: '#64748b', fontSize: '14px' }}>
            <p style={{ margin: '0 0 4px', fontWeight: 600, color: '#534AB7' }}>Click to upload</p>
            <p style={{ margin: 0 }}>SVG, PNG, JPG or GIF (max. 5MB)</p>
          </div>
        )}
      </div>
    </div>
  );
}
