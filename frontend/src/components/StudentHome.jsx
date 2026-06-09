import React, { useEffect, useMemo, useState } from 'react';
import api from '../api';

function formatDate(value) {
  if (!value) return 'Date pending';
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(value));
}

function daysLeft(value) {
  const today = new Date();
  const deadline = new Date(value);
  const difference = Math.max(0, deadline - today);
  const days = Math.ceil(difference / (1000 * 60 * 60 * 24));
  return days === 1 ? '1 day left' : `${days} days left`;
}

function formatFestType(type) {
  if (!type) return 'Fest';
  return type.charAt(0) + type.slice(1).toLowerCase();
}

function formatMode(type) {
  return type === 'TECHNICAL' ? 'Online' : 'On campus';
}

export default function StudentHome({ auth, onNavigate, onLogout }) {
  const [activeFestFilter, setActiveFestFilter] = useState('ALL');
  const [fests, setFests] = useState([]);
  const [activity, setActivity] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState('');

  useEffect(() => {
    let isMounted = true;
    async function loadDashboard() {
      setIsLoading(true);
      setDashboardError('');
      try {
        const [festsResponse, teamsResponse] = await Promise.all([
          api.get('/api/fests/published/recent'),
          api.get('/api/teams/my'),
        ]);
        if (!isMounted) return;
        setFests(festsResponse.data || []);
        const uniqueActivity = [];
        const seenActivity = new Set();
        for (const team of teamsResponse.data || []) {
          if (!seenActivity.has(team.eventId)) {
            seenActivity.add(team.eventId);
            uniqueActivity.push(team);
          }
        }
        setActivity(uniqueActivity);
      } catch (error) {
        if (!isMounted) return;
        setDashboardError('Unable to load dashboard data.');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadDashboard();
    return () => { isMounted = false; };
  }, []);

  const visibleFests = useMemo(() => {
    return fests
      .filter((fest) => {
        if (activeFestFilter === 'ALL') return true;
        if (activeFestFilter === 'UPCOMING') return new Date(fest.festStartTime) >= new Date();
        return fest.type === activeFestFilter;
      })
      .slice(0, 4);
  }, [activeFestFilter, fests]);

  const eventDeadlines = useMemo(() => {
    const now = new Date();
    const weekFromNow = new Date(now);
    weekFromNow.setDate(now.getDate() + 7);

    return fests
      .flatMap((fest) => (fest.events || []))
      .filter((event) => {
        const closesAt = new Date(event.registrationEnd);
        return closesAt >= now && closesAt <= weekFromNow;
      })
      .sort((a, b) => new Date(a.registrationEnd) - new Date(b.registrationEnd))
      .slice(0, 4);
  }, [fests]);

  return (
    <div className="student-shell">
      <header className="dashboard-nav" style={{ width: '100%' }}>
        <button className="nav-brand" type="button" onClick={() => onNavigate('student')}>CampusPulse</button>
        <div className="fest-filter-group" style={{ margin: '0 auto' }}>
          {['ALL', 'TECHNICAL', 'CULTURAL', 'SPORT', 'UPCOMING'].map((f) => (
            <button
              key={f}
              className={activeFestFilter === f ? 'is-active' : ''}
              onClick={() => setActiveFestFilter(f)}
            >
              {f.charAt(0) + f.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
        <button className="invite-button" onClick={() => onNavigate('invite-code')} style={{ marginLeft: 0 }}>Use invite code</button>
      </header>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <section className="student-workspace" style={{ overflowY: 'auto', width: '100%' }}>
          <div className="dashboard-content">
          {dashboardError && <p className="dashboard-notice">{dashboardError}</p>}

          <section className="dashboard-section">
            <div className="section-heading">
              <div className="section-title-row">
                <h2>My Activity</h2>
              </div>
              <span className="section-eyebrow" style={{ color: '#1e293b' }}>Hi, {auth?.name}</span>
            </div>
            
            <div className="activity-panel">
              {isLoading ? <p className="empty-copy">Loading activity...</p> : (
                <>
                <div className="activity-list">
                  {activity.length === 0 ? <p className="empty-copy">No registrations yet.</p> : (
                    activity.slice(0, 3).map((team) => (
                      <article className="activity-card" key={team.id}>
                        <span className="activity-mark" />
                        <div>
                          <h3>{team.eventName}</h3>
                          <p>{team.festName}</p>
                        </div>
                        <strong>{team.leaderId === auth?.userId ? 'Leader' : 'Member'}</strong>
                      </article>
                    ))
                  )}
                </div>
                {activity.length > 0 && (
                  <button className="view-all-btn" onClick={() => onNavigate('view-all-registered')} style={{ marginTop: '16px', width: '100%', textAlign: 'center' }}>
                    View all registrations
                  </button>
                )}
                </>
              )}
            </div>
          </section>

          <section className="dashboard-section">
            <div className="section-heading">
              <div className="section-title-row">
                <h2>Recent Fests</h2>
                <p>Discover the latest fests on campus.</p>
              </div>
              <button className="view-all-btn" onClick={() => onNavigate('all-fests')}>View all</button>
            </div>
            
            <div className="fest-grid">
              {isLoading ? Array(4).fill(0).map((_, i) => <div key={i} className="fest-card loading" />) : (
                visibleFests.map((fest) => (
                  <article className="fest-card" key={fest.id} onClick={() => onNavigate('fest-details', fest.id)}>
                    <div className="fest-banner" style={{ backgroundImage: `url(${fest.bannerImageUrl || '/assets/default-fest.png'})` }}>
                      <span>{formatFestType(fest.type)}</span>
                    </div>
                    <div className="fest-body">
                      <h3>{fest.name}</h3>
                      <p>{fest.ownerName || 'Campus Organizer'}</p>
                      <div className="fest-meta">
                        <span>{formatDate(fest.festStartTime)}</span>
                        <span>{formatMode(fest.type)}</span>
                      </div>
                    </div>
                  </article>
                ))
              )}
              {!isLoading && visibleFests.length === 0 && <p className="empty-copy">No fests found.</p>}
            </div>
          </section>

          <section className="dashboard-section">
            <div className="section-heading">
              <div className="section-title-row">
                <h2>Upcoming Deadlines</h2>
              </div>
            </div>
            <div className="deadline-list">
              {isLoading ? <p className="empty-copy">Checking deadlines...</p> : (
                eventDeadlines.length === 0 ? <p className="empty-copy">No deadlines this week.</p> : (
                  eventDeadlines.map((event) => (
                    <article className="deadline-row" key={event.id} onClick={() => onNavigate('event-details', event.id)}>
                      <span className="deadline-mark" />
                      <div>
                        <h3>{event.name} registration closes</h3>
                        <p>{event.festName}</p>
                      </div>
                      <time>
                        <strong>{daysLeft(event.registrationEnd)}</strong>
                        <span>{formatDate(event.registrationEnd)}</span>
                      </time>
                    </article>
                  ))
                )
              )}
            </div>
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
