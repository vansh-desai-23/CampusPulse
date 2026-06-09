import React from 'react';

export default function LandingPage({ landingBg, onNavigate }) {
  return (
    <div className="cp-page">
      <header className="cp-header">
        <button className="cp-brand-btn" onClick={() => onNavigate('landing')} type="button">
          CampusPulse
        </button>
      </header>

      <img src={landingBg} alt="" className="cp-bg" aria-hidden="true" />

      <main className="cp-main" style={{ justifyContent: 'flex-start', padding: '0 max(5vw, 40px)' }}>
        <div style={{
          maxWidth: "640px",
          textAlign: "left",
          position: "relative",
          zIndex: 10
        }}>
          <h1 style={{
            fontSize: "clamp(36px, 4.5vw, 56px)",
            fontWeight: 800,
            lineHeight: 1.12,
            color: "#1a1a2e",
            margin: "0 0 24px",
          }}>
            Event infrastructure to power your{" "}
            <span style={{ color: "#534AB7" }}> campus.</span>
          </h1>

          <p style={{
            fontSize: "clamp(16px, 1.5vw, 22px)",
            color: "#888780",
            lineHeight: 1.6,
            margin: "0 0 44px",
            maxWidth: 560,
          }}>
            Manage live capacities, issue secure tickets, and organize
            high-demand cultural and technical fests — from the first
            registration to the final entry.
          </p>

          <div style={{ display: "flex", gap: 16 }}>
            <button
              onClick={() => onNavigate('signup')}
              style={{
                padding: "14px 28px", background: "#534AB7", color: "#fff",
                border: "none", borderRadius: 8, fontSize: 16, fontWeight: 600, cursor: "pointer",
              }}
            >
              Create an account ›
            </button>
            <button
              onClick={() => onNavigate('signin')}
              style={{
                padding: "14px 28px", background: "transparent", color: "#534AB7",
                border: "1.5px solid #534AB7", borderRadius: 8, fontSize: 16, fontWeight: 600, cursor: "pointer",
              }}
            >
              Sign in
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
