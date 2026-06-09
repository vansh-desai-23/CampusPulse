import React from 'react';
import { ChevronDown } from "lucide-react";

export default function SignupPage({
  canSubmit,
  form,
  isSubmitting,
  landingBg,
  onNavigate,
  onRememberChange,
  onSubmit,
  onUpdateField,
  rememberMe,
  status,
}) {
  return (
    <div className="cp-page">
      <header className="cp-header">
        <button className="cp-brand-btn" onClick={() => onNavigate('landing')} type="button">
          CampusPulse
        </button>
      </header>

      <img src={landingBg} alt="" className="cp-bg" aria-hidden="true" />

      <main className="cp-main">
        <div className="cp-card">
          <div className="cp-card-body">
            <h1 className="cp-title">Create your CampusPulse account</h1>

            <form className="cp-form" onSubmit={onSubmit}>
              <label className="cp-field">
                <span className="cp-label">Full name</span>
                <input 
                  type="text" 
                  className="cp-input" 
                  name="name"
                  value={form.name}
                  onChange={onUpdateField}
                  required
                  autoComplete="name"
                />
              </label>

              <label className="cp-field">
                <span className="cp-label">Email address</span>
                <input 
                  type="email" 
                  className="cp-input" 
                  name="email"
                  value={form.email}
                  onChange={onUpdateField}
                  required
                  autoComplete="email"
                />
              </label>

              <label className="cp-field">
                <span className="cp-label">Password</span>
                <input 
                  type="password" 
                  className="cp-input" 
                  name="password"
                  value={form.password}
                  onChange={onUpdateField}
                  required
                  minLength="6"
                  autoComplete="new-password"
                />
              </label>

              <label className="cp-field">
                <span className="cp-label">Role</span>
                <div className="cp-select-wrap">
                  <select 
                    className="cp-select" 
                    name="role" 
                    value={form.role} 
                    onChange={onUpdateField}
                  >
                    <option value="STUDENT">Student</option>
                    <option value="ORGANIZER">Organizer</option>
                  </select>
                  <ChevronDown className="cp-chevron" />
                </div>
              </label>

              <label className="cp-remember">
                <input 
                  type="checkbox" 
                  checked={rememberMe} 
                  onChange={(e) => onRememberChange(e.target.checked)} 
                  className="cp-checkbox" 
                />
                <span className="cp-remember-text">Remember me on this device</span>
              </label>

              {status.message && (
                <div style={{ marginTop: '8px', fontSize: '10px', color: status.type === 'error' ? '#ef4444' : '#10b981', textAlign: 'center' }}>
                  {status.message}
                </div>
              )}

              <button 
                type="submit" 
                className="cp-button" 
                disabled={!canSubmit || isSubmitting}
              >
                {isSubmitting ? 'Processing...' : 'Create account'}
              </button>
            </form>
          </div>

          <div className="cp-footer">
            <p className="cp-footer-text">
              Already have an account? {' '}
              <button 
                type="button" 
                className="cp-link-btn" 
                onClick={() => onNavigate('signin')}
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
