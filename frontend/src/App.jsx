import { useEffect, useMemo, useState } from 'react'
import api from './api'
import landingBg from './assets/landingpage_bg.svg'
import './App.css'

const initialAuthState = {
  name: '',
  email: '',
  password: '',
  role: 'STUDENT',
}

const demoFests = [
  {
    id: 'demo-1',
    name: 'Inspire Optimization Contest',
    ownerName: 'Dr. Mahalingam College of Engineering',
    type: 'TECHNICAL',
    festStartTime: addDays(15),
    festEndTime: addDays(17),
    events: [
      {
        id: 'demo-event-1',
        name: 'Linear Models Sprint',
        festName: 'Inspire Optimization Contest',
        registrationEnd: addDays(3),
      },
    ],
  },
  {
    id: 'demo-2',
    name: 'Tarang Cultural Extravaganza',
    ownerName: 'NIT Trichy',
    type: 'CULTURAL',
    festStartTime: addDays(22),
    festEndTime: addDays(25),
    events: [],
  },
  {
    id: 'demo-3',
    name: 'Meraki Bits Goa',
    ownerName: 'BITS Pilani Goa Campus',
    type: 'CULTURAL',
    festStartTime: addDays(31),
    festEndTime: addDays(33),
    events: [
      {
        id: 'demo-event-2',
        name: 'Stage Design Challenge',
        festName: 'Meraki Bits Goa',
        registrationEnd: addDays(6),
      },
    ],
  },
  {
    id: 'demo-4',
    name: 'CodeRush National Hackathon',
    ownerName: 'IIIT Hyderabad',
    type: 'TECHNICAL',
    festStartTime: addDays(39),
    festEndTime: addDays(41),
    events: [],
  },
]

function App() {
  const [view, setView] = useState(() => {
    const savedAuth = getStoredAuth()
    return savedAuth?.role === 'STUDENT' ? 'student' : 'landing'
  })
  const [auth, setAuth] = useState(() => getStoredAuth())
  const [form, setForm] = useState(initialAuthState)
  const [rememberMe, setRememberMe] = useState(true)
  const [status, setStatus] = useState({ type: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const navigate = (nextView) => {
    setView(nextView)
    setStatus({ type: '', message: '' })
    setForm(initialAuthState)
  }

  const updateField = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const submitAuth = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)
    setStatus({ type: '', message: '' })

    const isSignup = view === 'signup'
    const payload = {
      email: form.email,
      password: form.password,
      ...(isSignup ? { name: form.name, role: form.role } : {}),
    }

    try {
      const response = await api.post(
        `/api/auth/${isSignup ? 'signup' : 'login'}`,
        payload,
      )
      const data = response.data
      const storage = rememberMe ? localStorage : sessionStorage

      storage.setItem('campuspulseAuth', JSON.stringify(data))
      setAuth(data)

      if (data.role === 'STUDENT') {
        setView('student')
      } else {
        setStatus({
          type: 'success',
          message: 'Organizer dashboard will be added next.',
        })
      }
    } catch (error) {
      setStatus({
        type: 'error',
        message:
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          'Unable to reach CampusPulse right now.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (view === 'student') {
    return <StudentHome auth={auth} />
  }

  if (view === 'signin' || view === 'signup') {
    const canSubmit =
      form.email.trim() !== '' &&
      form.password !== '' &&
      (view !== 'signup' || form.name.trim() !== '')

    return (
      <AuthPage
        canSubmit={canSubmit}
        form={form}
        isSubmitting={isSubmitting}
        isSignup={view === 'signup'}
        landingBg={landingBg}
        onNavigate={navigate}
        onRememberChange={setRememberMe}
        onSubmit={submitAuth}
        onUpdateField={updateField}
        rememberMe={rememberMe}
        status={status}
      />
    )
  }

  return <LandingPage landingBg={landingBg} onNavigate={navigate} />
}

function StudentHome({ auth }) {
  const [activeFestFilter, setActiveFestFilter] = useState('ALL')
  const [fests, setFests] = useState([])
  const [activity, setActivity] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [dashboardError, setDashboardError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadDashboard() {
      setIsLoading(true)
      setDashboardError('')

      try {
        const [festsResponse, teamsResponse] = await Promise.all([
          api.get('/api/fests/published/recent'),
          api.get('/api/teams/my'),
        ])

        if (!isMounted) {
          return
        }

        setFests(festsResponse.data || [])
        setActivity(teamsResponse.data || [])
      } catch (error) {
        if (!isMounted) {
          return
        }

        setFests([])
        setActivity([])
        setDashboardError(
          error.response?.data?.message ||
            error.response?.data?.error ||
            'Dashboard data is unavailable right now.',
        )
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadDashboard()

    return () => {
      isMounted = false
    }
  }, [])

  const visibleFests = useMemo(() => {
    const source = fests.length > 0 ? fests : demoFests
    const now = new Date()

    return source
      .filter((fest) => {
        if (activeFestFilter === 'ALL') {
          return true
        }
        if (activeFestFilter === 'UPCOMING') {
          return new Date(fest.festStartTime) >= now
        }
        return fest.type === activeFestFilter
      })
      .slice(0, 4)
  }, [activeFestFilter, fests])

  const deadlines = useMemo(() => {
    const now = new Date()
    const weekFromNow = new Date(now)
    weekFromNow.setDate(now.getDate() + 7)

    return (fests.length > 0 ? fests : demoFests)
      .flatMap((fest) =>
        (fest.events || []).map((event) => ({
          ...event,
          festName: event.festName || fest.name,
          ownerName: fest.ownerName,
        })),
      )
      .filter((event) => {
        const closesAt = new Date(event.registrationEnd)
        return closesAt >= now && closesAt <= weekFromNow
      })
      .sort(
        (first, second) =>
          new Date(first.registrationEnd) - new Date(second.registrationEnd),
      )
      .slice(0, 4)
  }, [fests])

  return (
    <main className="student-shell">
      <StudentRail />
      <section className="student-workspace">
        <DashboardTopNav
          activeFestFilter={activeFestFilter}
          onFilterChange={setActiveFestFilter}
        />

        <div className="dashboard-content">
          {dashboardError && (
            <p className="dashboard-notice" role="status">
              {dashboardError}
            </p>
          )}

          <section className="dashboard-section" aria-labelledby="activity-title">
            <SectionHeading
              eyebrow={auth?.name ? `Hi, ${auth.name}` : 'Student Home'}
              id="activity-title"
              title="My Activity"
            />
            <ActivityPanel
              activity={activity}
              currentUserId={auth?.userId}
              isLoading={isLoading}
            />
          </section>

          <section className="dashboard-section" aria-labelledby="fests-title">
            <SectionHeading
              actionLabel="View all"
              actionTitle="View all fests"
              id="fests-title"
              subtitle="Uncover the most talked-about fests today."
              title="Fests"
            />
            <FestGrid fests={visibleFests} />
          </section>

          <section className="dashboard-section" aria-labelledby="deadlines-title">
            <SectionHeading id="deadlines-title" title="Upcoming Deadlines" />
            <DeadlineList deadlines={deadlines} />
          </section>
        </div>
      </section>
    </main>
  )
}

function DashboardTopNav({ activeFestFilter, onFilterChange }) {
  const filters = [
    ['ALL', 'All'],
    ['TECHNICAL', 'Technical'],
    ['CULTURAL', 'Cultural'],
    ['UPCOMING', 'Upcoming'],
  ]

  return (
    <header className="dashboard-nav">
      <button className="nav-brand" type="button">
        CampusPulse
      </button>
      <div className="nav-search" aria-hidden="true">
        <span className="search-glyph" />
        <input
          disabled
          placeholder="Search fests, colleges, events..."
          type="search"
        />
      </div>
      <div className="fest-filter-group" aria-label="Fest filters">
        {filters.map(([value, label]) => (
          <button
            className={activeFestFilter === value ? 'is-active' : ''}
            key={value}
            onClick={() => onFilterChange(value)}
            type="button"
          >
            {label}
          </button>
        ))}
      </div>
      <button className="invite-button" type="button">
        Use invite code
      </button>
    </header>
  )
}

function StudentRail() {
  return (
    <aside className="student-rail" aria-label="Student navigation">
      <button className="rail-button is-active" type="button">
        <span className="rail-glyph profile-glyph" aria-hidden="true" />
        <span>Profile</span>
      </button>
      <button className="rail-button" type="button">
        <span className="rail-glyph message-glyph" aria-hidden="true" />
        <span>Messages</span>
      </button>
    </aside>
  )
}

function SectionHeading({ actionLabel, actionTitle, eyebrow, id, subtitle, title }) {
  return (
    <div className="section-heading">
      <div className="section-title-row">
        <h2 id={id}>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {eyebrow && <span className="section-eyebrow">{eyebrow}</span>}
      {actionLabel && (
        <button title={actionTitle} type="button">
          {actionLabel}
        </button>
      )}
    </div>
  )
}

function ActivityPanel({ activity, currentUserId, isLoading }) {
  if (isLoading) {
    return (
      <div className="activity-panel">
        <p className="empty-copy">Loading your registrations.</p>
      </div>
    )
  }

  return (
    <div className="activity-panel">
      <div className="activity-list">
        {activity.length === 0 ? (
          <p className="empty-copy">No registrations yet.</p>
        ) : (
          activity.slice(0, 3).map((team) => {
            const isLeader = team.leaderId === currentUserId

            return (
              <article className="activity-card" key={team.id}>
                <span className="activity-mark" aria-hidden="true" />
                <div>
                  <h3>{team.eventName}</h3>
                  <p>{team.festName}</p>
                </div>
                <strong>{isLeader ? 'Registration' : 'Participation'}</strong>
              </article>
            )
          })
        )}
      </div>
      <button className="view-all-button" type="button">
        View all
      </button>
    </div>
  )
}

function FestGrid({ fests }) {
  return (
    <div className="fest-grid">
      {fests.map((fest) => (
        <article className="fest-card" key={fest.id}>
          <div className="fest-banner">
            <span>{formatFestType(fest.type)}</span>
          </div>
          <div className="fest-body">
            <h3 title={fest.name}>{fest.name}</h3>
            <p title={fest.ownerName || fest.ownerEmail || 'Campus organizer'}>
              {fest.ownerName || fest.ownerEmail || 'Campus organizer'}
            </p>
            <div className="fest-meta">
              <span>{formatDate(fest.festStartTime)}</span>
              <span>{formatMode(fest.type)}</span>
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}

function DeadlineList({ deadlines }) {
  return (
    <div className="deadline-list">
      {deadlines.length === 0 ? (
        <p className="empty-copy">No event registration deadlines in the next week.</p>
      ) : (
        deadlines.map((event) => (
          <article className="deadline-row" key={event.id}>
            <span className="deadline-mark" aria-hidden="true" />
            <div>
              <h3 title={`${event.name} registration closes`}>
                {event.name} registration closes
              </h3>
              <p>{event.festName || event.ownerName || 'Campus event'}</p>
            </div>
            <time dateTime={event.registrationEnd}>
              <strong>{daysLeft(event.registrationEnd)}</strong>
              <span>{formatDate(event.registrationEnd)}</span>
            </time>
          </article>
        ))
      )}
    </div>
  )
}

function LandingPage({ landingBg, onNavigate }) {
  return (
    <main className="landing-shell">
      <header className="landing-header">
        <button
          type="button"
          className="landing-brand"
          onClick={() => onNavigate('landing')}
        >
          CampusPulse
        </button>
      </header>
      <img className="landing-art" src={landingBg} alt="" aria-hidden="true" />
      <section className="landing-content" aria-labelledby="landing-title">
        <h1 id="landing-title">
          Event infrastructure to power your <span>campus.</span>
        </h1>
        <p>
          Manage live capacities, issue secure tickets, and organize high-demand
          cultural and technical fests - from the first registration to the final
          entry.
        </p>
        <div className="landing-actions">
          <button type="button" onClick={() => onNavigate('signup')}>
            Create an account
            <span aria-hidden="true">›</span>
          </button>
          <button
            type="button"
            className="secondary-action"
            onClick={() => onNavigate('signin')}
          >
            Sign in
          </button>
        </div>
      </section>
    </main>
  )
}

function AuthPage({
  canSubmit,
  form,
  isSubmitting,
  isSignup,
  landingBg,
  onNavigate,
  onRememberChange,
  onSubmit,
  onUpdateField,
  rememberMe,
  status,
}) {
  return (
    <main className="auth-shell">
      <header className="auth-header">
        <button type="button" onClick={() => onNavigate('landing')}>
          CampusPulse
        </button>
      </header>
      <img className="auth-art" src={landingBg} alt="" aria-hidden="true" />
      <section className="auth-panel" aria-labelledby="auth-title">
        <form className="auth-form" onSubmit={onSubmit}>
          <h1 id="auth-title">
            {isSignup ? 'Create your CampusPulse account' : 'Sign in to CampusPulse'}
          </h1>

          {isSignup && (
            <label>
              Name
              <input
                autoComplete="name"
                name="name"
                onChange={onUpdateField}
                required
                type="text"
                value={form.name}
              />
            </label>
          )}

          <label>
            Email address
            <input
              autoComplete="email"
              name="email"
              onChange={onUpdateField}
              required
              type="email"
              value={form.email}
            />
          </label>

          <label>
            <span className="label-row">
              Password
              {!isSignup && <a href="#forgot-password">Forgot your password?</a>}
            </span>
            <input
              autoComplete={isSignup ? 'new-password' : 'current-password'}
              minLength="6"
              name="password"
              onChange={onUpdateField}
              required
              type="password"
              value={form.password}
            />
          </label>

          {isSignup && (
            <label>
              Role
              <select name="role" onChange={onUpdateField} value={form.role}>
                <option value="STUDENT">Student</option>
                <option value="ORGANIZER">Organizer</option>
              </select>
            </label>
          )}

          <label className="remember-row">
            <input
              checked={rememberMe}
              onChange={(event) => onRememberChange(event.target.checked)}
              type="checkbox"
            />
            Remember me on this device
          </label>

          <button
            className={`submit-button ${canSubmit ? 'is-ready' : ''}`}
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting
              ? isSignup
                ? 'Creating account...'
                : 'Signing in...'
              : isSignup
                ? 'Create account'
                : 'Sign in'}
          </button>

          {status.message && (
            <p className={`status-message ${status.type}`} role="status">
              {status.message}
            </p>
          )}
        </form>

        <div className="auth-footer">
          {isSignup ? 'Already have an account?' : 'New to CampusPulse?'}
          <button
            type="button"
            onClick={() => onNavigate(isSignup ? 'signin' : 'signup')}
          >
            {isSignup ? 'Sign in' : 'Create account'}
          </button>
        </div>
      </section>
    </main>
  )
}

function getStoredAuth() {
  const saved =
    localStorage.getItem('campuspulseAuth') ||
    sessionStorage.getItem('campuspulseAuth')

  if (!saved) {
    return null
  }

  try {
    return JSON.parse(saved)
  } catch {
    localStorage.removeItem('campuspulseAuth')
    sessionStorage.removeItem('campuspulseAuth')
    return null
  }
}

function addDays(days) {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date.toISOString()
}

function formatDate(value) {
  if (!value) {
    return 'Date pending'
  }

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value))
}

function daysLeft(value) {
  const today = new Date()
  const deadline = new Date(value)
  const difference = Math.max(0, deadline - today)
  const days = Math.ceil(difference / (1000 * 60 * 60 * 24))

  return days === 1 ? '1 day left' : `${days} days left`
}

function formatFestType(type) {
  if (!type) {
    return 'Fest'
  }

  return type.charAt(0) + type.slice(1).toLowerCase()
}

function formatMode(type) {
  return type === 'TECHNICAL' ? 'Online' : 'On campus'
}

export default App
