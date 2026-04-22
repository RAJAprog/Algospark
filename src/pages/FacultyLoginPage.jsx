import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { createUserDocument } from '../api/userService';

const getFriendlyError = (error) => {
  switch (error?.code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'No account found with these credentials. Check your email and password, or sign up first.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists. Please log in instead.';
    case 'auth/weak-password':
      return 'Password must be at least 6 characters.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please wait a few minutes and try again.';
    case 'auth/network-request-failed':
      return 'Network error. Check your internet connection.';
    default:
      return error?.message || 'Authentication failed. Please try again.';
  }
};

export default function FacultyLoginPage() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [name, setName]         = useState('');
  const [facultyId, setFacultyId] = useState('');
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState('');
  const [loading, setLoading]   = useState(false);

  const history = useHistory();
  const { studentEmailLogin, studentEmailSignup } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');

    if (!email.endsWith('@vignan.ac.in') && !email.endsWith('@gmail.com')) {
      setError('Please use your official @vignan.ac.in email address.');
      return;
    }

    setLoading(true);
    try {
      if (isLoginMode) {
        await studentEmailLogin(email, password);
        history.push('/faculty-dashboard');
      } else {
        const cred = await studentEmailSignup(email, password);
        await createUserDocument(cred.user.uid, { email, name, facultyId }, 'faculty');
        setSuccess('Account created! Redirecting...');
        setTimeout(() => history.push('/faculty-dashboard'), 1200);
      }
    } catch (err) {
      setError(getFriendlyError(err));
    }
    setLoading(false);
  };

  const switchMode = () => { setIsLoginMode(p => !p); setError(''); setSuccess(''); };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#ffffff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
        padding: '2.5rem',
        background: '#ffffff',
        borderRadius: '1.25rem',
        border: '1px solid #e5e7eb',
        boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <span style={{
            fontSize: '1.6rem', fontWeight: 900, letterSpacing: '-0.04em',
            background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>MIND CODE</span>
          <p style={{ fontSize: '0.8rem', color: '#9ca3af', marginTop: '0.3rem', fontWeight: 500 }}>
            Faculty Portal
          </p>
        </div>

        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#111827', textAlign: 'center', marginBottom: '1.75rem' }}>
          {isLoginMode ? 'Sign In' : 'Create Account'}
        </h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {!isLoginMode && (
            <>
              <div>
                <label style={lbl}>Full Name</label>
                <input style={inp} type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="Dr. John Smith" />
              </div>
              <div>
                <label style={lbl}>Employee ID</label>
                <input style={inp} type="text" value={facultyId} onChange={e => setFacultyId(e.target.value)} required placeholder="e.g., 02921" />
              </div>
            </>
          )}

          <div>
            <label style={lbl}>Official Email</label>
            <input style={inp} type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="yourname@vignan.ac.in" />
          </div>

          <div>
            <label style={lbl}>Password</label>
            <input style={inp} type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder={isLoginMode ? 'Enter your password' : 'Min. 6 characters'} />
          </div>

          {isLoginMode && (
            <div style={{ textAlign: 'right', marginTop: '-0.5rem' }}>
              <Link to="/faculty-forgot-password" style={{ fontSize: '0.78rem', color: '#6366f1', textDecoration: 'none', fontWeight: 600 }}>
                Forgot password?
              </Link>
            </div>
          )}

          <button type="submit" disabled={loading} style={{
            padding: '0.75rem', borderRadius: '0.75rem',
            background: loading ? '#a5b4fc' : 'linear-gradient(135deg,#3b82f6,#6366f1)',
            color: '#fff', fontWeight: 800, fontSize: '0.9rem',
            border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s', marginTop: '0.25rem',
          }}>
            {loading ? 'Processing...' : isLoginMode ? 'Login' : 'Create Account'}
          </button>
        </form>

        {/* Error */}
        {error && (
          <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '0.6rem' }}>
            <p style={{ fontSize: '0.8rem', color: '#dc2626', margin: 0 }}>{error}</p>
            {isLoginMode && error.includes('No account') && (
              <button onClick={switchMode} style={{ fontSize: '0.75rem', color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer', marginTop: '0.3rem', padding: 0, fontWeight: 700 }}>
                → Create an account instead
              </button>
            )}
          </div>
        )}

        {/* Success */}
        {success && (
          <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '0.6rem' }}>
            <p style={{ fontSize: '0.8rem', color: '#16a34a', margin: 0 }}>{success}</p>
          </div>
        )}

        {/* Switch mode */}
        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.82rem', color: '#6b7280' }}>
          {isLoginMode ? "Need a faculty account? " : "Already have an account? "}
          <button onClick={switchMode} style={{ color: '#6366f1', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.82rem' }}>
            {isLoginMode ? 'Sign Up' : 'Log In'}
          </button>
        </p>

        <div style={{ textAlign: 'center', marginTop: '0.75rem' }}>
          <Link to="/login" style={{ fontSize: '0.75rem', color: '#9ca3af', textDecoration: 'none' }}>
            Switch to Student Portal
          </Link>
        </div>
      </div>
    </div>
  );
}

// Shared input styles
const lbl = { display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' };
const inp = { width: '100%', padding: '0.65rem 0.9rem', borderRadius: '0.6rem', border: '1px solid #d1d5db', fontSize: '0.88rem', color: '#111827', outline: 'none', background: '#f9fafb', boxSizing: 'border-box', transition: 'border-color 0.2s' };
