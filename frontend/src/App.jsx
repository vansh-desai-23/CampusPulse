import React, { useEffect, useState } from 'react';
import api from './api';
import landingBg from './assets/landingpage_bg.svg';
import './App.css';

import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import StudentHome from './components/StudentHome';
import FestPage from './components/FestPage';
import EventPage from './components/EventPage';
import AllFestsPage from './components/AllFestsPage';
import InviteCodePage from './components/InviteCodePage';

const initialAuthState = {
  name: '',
  email: '',
  password: '',
  role: 'STUDENT',
};

function getStoredAuth() {
  const saved =
    localStorage.getItem('campuspulseAuth') ||
    sessionStorage.getItem('campuspulseAuth');

  if (!saved) return null;

  try {
    return JSON.parse(saved);
  } catch {
    localStorage.removeItem('campuspulseAuth');
    sessionStorage.removeItem('campuspulseAuth');
    return null;
  }
}

export default function App() {
  const [view, setView] = useState('loading');
  const [auth, setAuth] = useState(null);
  const [form, setForm] = useState(initialAuthState);
  const [rememberMe, setRememberMe] = useState(true);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Navigation Params
  const [selectedId, setSelectedId] = useState(null);

  // JWT Token Verification on Load
  useEffect(() => {
    let isMounted = true;

    async function verifyToken() {
      const savedAuth = getStoredAuth();
      if (!savedAuth || !savedAuth.token) {
        if (isMounted) setView('landing');
        return;
      }

      try {
        await api.get('/api/fests/published/recent');
        if (isMounted) {
          setAuth(savedAuth);
          setView(savedAuth.role === 'STUDENT' ? 'student' : 'landing');
        }
      } catch (error) {
        localStorage.removeItem('campuspulseAuth');
        sessionStorage.removeItem('campuspulseAuth');
        if (isMounted) setView('landing');
      }
    }

    verifyToken();

    return () => {
      isMounted = false;
    };
  }, []);

  const navigate = (nextView, id = null) => {
    setView(nextView);
    setSelectedId(id);
    setStatus({ type: '', message: '' });
    if (nextView === 'signin' || nextView === 'signup') {
      setForm(initialAuthState);
    }
  };

  const logout = () => {
    localStorage.removeItem('campuspulseAuth');
    sessionStorage.removeItem('campuspulseAuth');
    setAuth(null);
    setView('landing');
  };

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const submitAuth = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    const isSignup = view === 'signup';
    const payload = {
      email: form.email,
      password: form.password,
      ...(isSignup ? { name: form.name, role: form.role } : {}),
    };

    try {
      const response = await api.post(
        `/api/auth/${isSignup ? 'signup' : 'login'}`,
        payload
      );
      const data = response.data;
      const storage = rememberMe ? localStorage : sessionStorage;

      storage.setItem('campuspulseAuth', JSON.stringify(data));
      setAuth(data);

      if (data.role === 'STUDENT') {
        setView('student');
      } else {
        setStatus({
          type: 'success',
          message: 'Organizer dashboard will be added next.',
        });
      }
    } catch (error) {
      setStatus({
        type: 'error',
        message:
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          'Unable to reach CampusPulse right now.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // View Router logic
  const renderView = () => {
    if (view === 'loading') {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif' }}>
          <p>Loading CampusPulse...</p>
        </div>
      );
    }

    if (view === 'signin') {
      const canSubmit = isValidEmail(form.email) && form.password.trim() !== '';
      return (
        <LoginPage
          canSubmit={canSubmit}
          form={form}
          isSubmitting={isSubmitting}
          landingBg={landingBg}
          onNavigate={navigate}
          onRememberChange={setRememberMe}
          onSubmit={submitAuth}
          onUpdateField={updateField}
          rememberMe={rememberMe}
          status={status}
        />
      );
    }

    if (view === 'signup') {
      const canSubmit = isValidEmail(form.email) && form.password.trim() !== '' && form.name.trim() !== '';
      return (
        <SignupPage
          canSubmit={canSubmit}
          form={form}
          isSubmitting={isSubmitting}
          landingBg={landingBg}
          onNavigate={navigate}
          onRememberChange={setRememberMe}
          onSubmit={submitAuth}
          onUpdateField={updateField}
          rememberMe={rememberMe}
          status={status}
        />
      );
    }

    if (view === 'landing') {
      return <LandingPage landingBg={landingBg} onNavigate={navigate} />;
    }

    // Authenticated Layout
    return (
      <div className="authenticated-layout">
        {view === 'student' && <StudentHome auth={auth} onNavigate={navigate} onLogout={logout} />}
        {view === 'all-fests' && <AllFestsPage onNavigate={navigate} />}
        {view === 'fest-details' && <FestPage festId={selectedId} onNavigate={navigate} />}
        {view === 'event-details' && <EventPage eventId={selectedId} onNavigate={navigate} />}
        {view === 'invite-code' && <InviteCodePage onNavigate={navigate} />}
        {view === 'view-all-registered' && <RegisteredPage onNavigate={navigate} />}
      </div>
    );
  };

  return <>{renderView()}</>;
}
