import React from 'react';

export default function LoginPage({
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
            <h1 className="cp-title">Sign in to CampusPulse</h1>

            <form className="cp-form" onSubmit={onSubmit}>
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
                <span className="cp-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  Password
                  <a href="#forgot" className="cp-link" style={{ fontWeight: 'normal' }}>Forgot?</a>
                </span>
                <input 
                  type="password" 
                  className="cp-input" 
                  name="password"
                  value={form.password}
                  onChange={onUpdateField}
                  required
                  minLength="6"
                  autoComplete="current-password"
                />
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
                {isSubmitting ? 'Processing...' : 'Sign in'}
              </button>
            </form>
          </div>

          <div className="cp-footer">
            <p className="cp-footer-text">
              New to CampusPulse? {' '}
              <button 
                type="button" 
                className="cp-link-btn" 
                onClick={() => onNavigate('signup')}
              >
                Create account
              </button>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

