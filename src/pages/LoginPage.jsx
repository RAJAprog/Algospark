import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createUserDocument } from '../api/userService';


const LoginPage = () => {
    // 'student' | 'college'
    const [portalMode, setPortalMode] = useState('student');

    // student state
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    // college state
    const [regNo, setRegNo] = useState('');
    const [collegePassword, setCollegePassword] = useState('');

    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [focusedField, setFocusedField] = useState(null);
    const [showContact, setShowContact] = useState(false);

    const history = useHistory();
    const { studentEmailLogin, studentEmailSignup, studentGoogleLogin, collegeLogin } = useAuth();

    /* ── Student email auth ── */
    const handleEmailAuth = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            if (isLoginMode) {
                await studentEmailLogin(email, password);
                localStorage.setItem('userRole', 'student');
                history.push('/dashboard', { role: 'student' });
            } else {
                if (!name) { setError('Name is required for registration.'); setIsLoading(false); return; }
                const userCredential = await studentEmailSignup(email, password);
                await createUserDocument(userCredential.user.uid, {
                    email,
                    name,
                    role: 'student',
                    userType: 'general'
                });
                localStorage.setItem('userRole', 'student');
                history.push('/dashboard', { role: 'student' });
            }
        } catch (err) {
            setError(err.message || 'Authentication failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    /* ── Google sign-in ── */
    const handleGoogleSignIn = async () => {
        setError('');
        setIsLoading(true);
        try {
            const userCredential = await studentGoogleLogin();
            await createUserDocument(userCredential.user.uid, {
                email: userCredential.user.email,
                name: userCredential.user.displayName,
                role: 'student',
                userType: 'general'
            });
            localStorage.setItem('userRole', 'student');
            history.push('/dashboard', { role: 'student' });
        } catch (err) {
            setError('Google sign-in failed.');
        } finally {
            setIsLoading(false);
        }
    };

    /* ── College login ── */
    const handleCollegeLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            await collegeLogin(regNo, collegePassword);
            localStorage.setItem('userRole', 'student');
            localStorage.setItem('userType', 'college');
            history.push('/dashboard');
        } catch (err) {
            console.error('Auth Error:', err);
            setError('Login failed. Invalid Registration Number or Password.');
        } finally {
            setIsLoading(false);
        }
    };

    const switchPortal = (mode) => {
        setPortalMode(mode);
        setError('');
        setIsLoginMode(true);
    };

    const isStudent = portalMode === 'student';

    /* ── Input style ── */
    const inputStyle = (field) => ({
        width: '100%',
        background: '#f8fafc',
        border: `1.5px solid ${focusedField === field ? '#ff6b35' : '#e2e8f0'}`,
        borderRadius: '10px',
        padding: '0.65rem 0.875rem 0.65rem 2.75rem',
        fontSize: '0.85rem',
        color: '#1a1a2e',
        outline: 'none',
        fontFamily: 'Inter, sans-serif',
        transition: 'border-color 0.2s, box-shadow 0.2s',
        boxSizing: 'border-box',
        boxShadow: focusedField === field ? '0 0 0 3px rgba(255,107,53,0.12)' : 'none',
    });

    const iconWrap = {
        position: 'absolute',
        left: '0.85rem',
        top: '50%',
        transform: 'translateY(-50%)',
        color: focusedField ? '#ff6b35' : '#94a3b8',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
    };

    return (
        <div style={{
            minHeight: '100vh',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
            fontFamily: 'Inter, sans-serif',
            padding: '1rem',
        }}>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
            <style>{`
                @keyframes fadeSlideUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes panelSlide {
                    from { opacity: 0; transform: translateX(12px); }
                    to   { opacity: 1; transform: translateX(0); }
                }
                @keyframes pulseGlow {
                    0%, 100% { box-shadow: 0 0 20px rgba(255,107,53,0.3); }
                    50%       { box-shadow: 0 0 40px rgba(255,107,53,0.6); }
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50%       { transform: translateY(-8px); }
                }
                @keyframes shimmer {
                    0% { background-position: -200% center; }
                    100% { background-position: 200% center; }
                }
                .login-wrapper { animation: fadeSlideUp 0.5s cubic-bezier(.22,1,.36,1) both; }
                .form-panel    { animation: panelSlide 0.4s cubic-bezier(.22,1,.36,1) both; }
                input::placeholder { color: #94a3b8; }
                input:-webkit-autofill {
                    -webkit-box-shadow: 0 0 0 100px #f8fafc inset !important;
                    -webkit-text-fill-color: #1a1a2e !important;
                }
                /* ── Contact modal ── */
                @keyframes modalIn {
                    from { opacity: 0; transform: translateY(32px) scale(0.96); }
                    to   { opacity: 1; transform: translateY(0)  scale(1); }
                }
                .contact-modal {
                    animation: modalIn 0.35s cubic-bezier(.22,1,.36,1) both;
                }
                .contact-overlay {
                    position: fixed; inset: 0; z-index: 1000;
                    background: rgba(10,12,30,0.72);
                    backdrop-filter: blur(6px);
                    display: flex; align-items: center; justify-content: center;
                    padding: 1rem;
                }
                .dev-card-item {
                    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
                    border: 1px solid rgba(99,102,241,0.25);
                    border-left: 3px solid #6366f1;
                    border-radius: 12px;
                    padding: 1.1rem 1.25rem;
                    display: flex; flex-direction: column; gap: 0.55rem;
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                }
                .dev-card-item:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 12px 32px rgba(99,102,241,0.25);
                }
                .contact-btn {
                    background: none;
                    border: none;
                    cursor: pointer;
                    font-family: 'Inter', sans-serif;
                    font-size: 0.72rem;
                    font-weight: 600;
                    color: #94a3b8;
                    display: flex;
                    align-items: center;
                    gap: 0.35rem;
                    transition: color 0.2s;
                    padding: 0;
                }
                .contact-btn:hover { color: #ff6b35; }
                .dev-link-small {
                    color: #94a3b8; text-decoration: none;
                    font-size: 0.75rem; font-weight: 500;
                    transition: color 0.15s;
                }
                .dev-link-small:hover { color: #a78bfa; }
                .portal-btn {
                    flex: 1;
                    border: none;
                    cursor: pointer;
                    border-radius: 10px;
                    padding: 0.6rem 0;
                    font-size: 0.8rem;
                    font-weight: 700;
                    font-family: 'Inter', sans-serif;
                    transition: all 0.25s ease;
                    letter-spacing: 0.02em;
                }
                .portal-btn:hover { transform: translateY(-1px); }
                .submit-btn {
                    width: 100%;
                    background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
                    border: none;
                    border-radius: 10px;
                    padding: 0.72rem;
                    color: #fff;
                    font-weight: 700;
                    font-size: 0.875rem;
                    font-family: 'Inter', sans-serif;
                    cursor: pointer;
                    letter-spacing: 0.04em;
                    text-transform: uppercase;
                    transition: all 0.2s ease;
                    box-shadow: 0 4px 15px rgba(255,107,53,0.35);
                }
                .submit-btn:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(255,107,53,0.5);
                }
                .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }
                .google-btn {
                    width: 100%;
                    background: #ffffff;
                    border: 1.5px solid #e2e8f0;
                    border-radius: 10px;
                    padding: 0.6rem;
                    font-weight: 600;
                    font-size: 0.85rem;
                    font-family: 'Inter', sans-serif;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    transition: all 0.2s ease;
                    color: #374151;
                }
                .google-btn:hover { background: #f9fafb; border-color: #cbd5e1; transform: translateY(-1px); }
                .icon-circle {
                    width: 70px; height: 70px;
                    border-radius: 50%;
                    display: flex; align-items: center; justify-content: center;
                    animation: float 3s ease-in-out infinite;
                }
                .divider { display: flex; align-items: center; gap: 0.75rem; margin: 0.25rem 0; }
                .divider::before, .divider::after {
                    content: ''; flex: 1;
                    height: 1px; background: #e2e8f0;
                }
                .divider span { font-size: 0.72rem; color: #94a3b8; font-weight: 500; white-space: nowrap; }
                .switch-link {
                    background: none; border: none;
                    color: #ff6b35; font-weight: 700;
                    cursor: pointer; font-size: 0.82rem;
                    font-family: 'Inter', sans-serif;
                    text-decoration: underline;
                    transition: color 0.15s;
                }
                .switch-link:hover { color: #e85d1e; }
                .badge {
                    display: inline-flex; align-items: center; gap: 0.3rem;
                    background: rgba(255,255,255,0.15);
                    border-radius: 999px;
                    padding: 0.25rem 0.75rem;
                    font-size: 0.7rem;
                    font-weight: 600;
                    color: rgba(255,255,255,0.9);
                    backdrop-filter: blur(4px);
                    margin-bottom: 1rem;
                }
                .fade-in-label {
                    font-size: 0.72rem;
                    font-weight: 600;
                    color: #64748b;
                    margin-bottom: 0.35rem;
                    display: block;
                    letter-spacing: 0.03em;
                    text-transform: uppercase;
                }
                .error-box {
                    background: #fff5f5;
                    border: 1px solid #fecaca;
                    border-radius: 8px;
                    padding: 0.6rem 0.875rem;
                    display: flex; align-items: center; gap: 0.5rem;
                    font-size: 0.78rem; color: #dc2626;
                }
            `}</style>

            {/* ── Main Card ── */}
            <div className="login-wrapper" style={{
                width: '100%',
                maxWidth: 880,
                borderRadius: '20px',
                overflow: 'hidden',
                display: 'flex',
                height: 'auto',
                minHeight: 0,
                boxShadow: '0 30px 80px rgba(0,0,0,0.5)',
            }}>

                {/* ════ LEFT PANEL ════ */}
                <div style={{
                    width: '38%',
                    flexShrink: 0,
                    background: isStudent
                        ? 'linear-gradient(160deg, #ff6b35 0%, #e8441a 60%, #c13010 100%)'
                        : 'linear-gradient(160deg, #4f46e5 0%, #7c3aed 60%, #5b21b6 100%)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '2.5rem 1.75rem',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'background 0.5s ease',
                }}>
                    {/* Decorative circles */}
                    <div style={{
                        position: 'absolute', top: -60, right: -60,
                        width: 220, height: 220,
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.08)',
                        pointerEvents: 'none',
                    }} />
                    <div style={{
                        position: 'absolute', bottom: -80, left: -50,
                        width: 260, height: 260,
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.06)',
                        pointerEvents: 'none',
                    }} />
                    <div style={{
                        position: 'absolute', top: '40%', left: -40,
                        width: 120, height: 120,
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.05)',
                        pointerEvents: 'none',
                    }} />

                    {/* Content */}
                    <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                        {/* Icon */}
                        <div className="icon-circle" style={{
                            background: 'rgba(255,255,255,0.2)',
                            backdropFilter: 'blur(8px)',
                            margin: '0 auto 1.5rem',
                            border: '2px solid rgba(255,255,255,0.3)',
                        }}>
                            {isStudent ? (
                                <svg width="32" height="32" fill="none" stroke="white" strokeWidth="1.8" viewBox="0 0 24 24">
                                    <path d="M12 14l9-5-9-5-9 5 9 5z" />
                                    <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                                </svg>
                            ) : (
                                <svg width="32" height="32" fill="none" stroke="white" strokeWidth="1.8" viewBox="0 0 24 24">
                                    <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0H3m2 0h2M9 7h1m-1 4h1m4-4h1m-1 4h1M9 16h6" />
                                </svg>
                            )}
                        </div>

                        <div className="badge">
                            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff', display: 'inline-block', flexShrink: 0 }} />
                            {isStudent ? 'Student Portal' : 'College Portal'}
                        </div>

                        <h1 style={{
                            color: '#ffffff',
                            fontSize: '1.9rem',
                            fontWeight: 900,
                            lineHeight: 1.2,
                            margin: '0 0 0.75rem',
                            letterSpacing: '-0.02em',
                        }}>
                            {isStudent ? 'Welcome\nBack!' : 'Institution\nPortal'}
                        </h1>

                        <p style={{
                            color: 'rgba(255,255,255,0.8)',
                            fontSize: '0.85rem',
                            lineHeight: 1.6,
                            marginBottom: '2rem',
                            fontWeight: 400,
                        }}>
                            {isStudent
                                ? 'Sign in with your email & password or continue with Google.'
                                : 'Sign in using your College Registration Number and portal password.'}
                        </p>

                        {/* Switch trigger on left side */}
                        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.78rem', marginBottom: '0.6rem' }}>
                            {isStudent ? 'Are you a college?' : 'Are you a student?'}
                        </p>
                        <button
                            onClick={() => switchPortal(isStudent ? 'college' : 'student')}
                            style={{
                                background: 'transparent',
                                border: '2px solid rgba(255,255,255,0.7)',
                                borderRadius: '8px',
                                padding: '0.55rem 1.5rem',
                                color: '#ffffff',
                                fontWeight: 700,
                                fontSize: '0.8rem',
                                fontFamily: 'Inter, sans-serif',
                                cursor: 'pointer',
                                letterSpacing: '0.06em',
                                textTransform: 'uppercase',
                                transition: 'all 0.2s ease',
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                                e.currentTarget.style.transform = 'translateY(-2px)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.transform = 'none';
                            }}
                        >
                            {isStudent ? 'College Login' : 'Student Login'}
                        </button>
                    </div>
                </div>

                {/* ════ RIGHT PANEL ════ */}
                <div style={{
                    flex: 1,
                    minWidth: 0,
                    background: '#ffffff',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    padding: '2rem 2.25rem',
                }}>
                    {/* Top logo row */}
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.25rem' }}>
                        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <img 
                                src="/logo.png" 
                                alt="Logo"
                                style={{
                                    width: 34, height: 34, 
                                    borderRadius: '8px',
                                    display: 'block',
                                    boxShadow: '0 4px 10px rgba(255,107,53,0.3)',
                                }} 
                            />
                            <div>
                                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#1a1a2e', lineHeight: 1.1 }}>ALGOSPARK</div>
                                <div style={{ fontSize: '0.5rem', color: '#94a3b8', letterSpacing: '0.14em', textTransform: 'uppercase' }}>Portal</div>
                            </div>
                        </Link>
                    </div>

                    {/* Toggle tabs */}
                    <div style={{
                        display: 'flex',
                        background: '#f1f5f9',
                        borderRadius: '12px',
                        padding: '4px',
                        marginBottom: '1.25rem',
                        gap: '4px',
                    }}>
                        <button
                            className="portal-btn"
                            onClick={() => switchPortal('student')}
                            style={{
                                background: isStudent ? '#ffffff' : 'transparent',
                                color: isStudent ? '#ff6b35' : '#64748b',
                                boxShadow: isStudent ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
                            }}
                        >
                            🎓 Student Login
                        </button>
                        <button
                            className="portal-btn"
                            onClick={() => switchPortal('college')}
                            style={{
                                background: !isStudent ? '#ffffff' : 'transparent',
                                color: !isStudent ? '#4f46e5' : '#64748b',
                                boxShadow: !isStudent ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
                            }}
                        >
                            🏛️ College Login
                        </button>
                    </div>

                    {/* ── Heading ── */}
                    <h2 style={{
                        fontSize: '1.35rem',
                        fontWeight: 800,
                        color: '#0f172a',
                        margin: '0 0 0.2rem',
                        letterSpacing: '-0.02em',
                    }}>
                        {isStudent
                            ? (isLoginMode ? 'Student Sign In' : 'Create Account')
                            : 'College Sign In'}
                    </h2>
                    <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '1rem', fontWeight: 400 }}>
                        {isStudent
                            ? (isLoginMode ? 'Welcome back! Enter your credentials below.' : 'Create your student account today.')
                            : 'Enter your institution Registration Number to continue.'}
                    </p>

                    {/* ────── STUDENT FORM ────── */}
                    {isStudent ? (
                        <form key={`student-${isLoginMode}`} className="form-panel" onSubmit={handleEmailAuth} style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                            {/* Google Sign In */}
                            <button type="button" className="google-btn" onClick={handleGoogleSignIn}>
                                <svg width="18" height="18" viewBox="0 0 48 48">
                                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                                </svg>
                                Continue with Google
                            </button>

                            <div className="divider"><span>or sign in with email</span></div>

                            {!isLoginMode && (
                                <div>
                                    <label className="fade-in-label">Full Name</label>
                                    <div style={{ position: 'relative' }}>
                                        <span style={{ ...iconWrap, color: focusedField === 'name' ? '#ff6b35' : '#94a3b8' }}>
                                            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                        </span>
                                        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Full Name" style={inputStyle('name')} onFocus={() => setFocusedField('name')} onBlur={() => setFocusedField(null)} />
                                    </div>
                                </div>
                            )}
                            <div>
                                <label className="fade-in-label">Email</label>
                                <div style={{ position: 'relative' }}>
                                    <span style={{ ...iconWrap, color: focusedField === 'email' ? '#ff6b35' : '#94a3b8' }}>
                                        <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                    </span>
                                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" style={inputStyle('email')} onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField(null)} />
                                </div>
                            </div>
                            <div>
                                <label className="fade-in-label">Password</label>
                                <div style={{ position: 'relative' }}>
                                    <span style={{ ...iconWrap, color: focusedField === 'password' ? '#ff6b35' : '#94a3b8' }}>
                                        <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                    </span>
                                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" style={inputStyle('password')} onFocus={() => setFocusedField('password')} onBlur={() => setFocusedField(null)} />
                                </div>
                            </div>

                            {error && (
                                <div className="error-box">
                                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 8v4m0 4h.01" /></svg>
                                    {error}
                                </div>
                            )}

                            <button type="submit" className="submit-btn" disabled={isLoading}>
                                {isLoading ? 'Processing...' : (isLoginMode ? 'Sign In' : 'Create Account')}
                            </button>

                            <p style={{ textAlign: 'center', fontSize: '0.8rem', color: '#64748b', margin: 0 }}>
                                {isLoginMode ? "Don't have an account? " : 'Already have an account? '}
                                <button type="button" className="switch-link" onClick={() => { setIsLoginMode(!isLoginMode); setError(''); }}>
                                    {isLoginMode ? 'Sign Up' : 'Log In'}
                                </button>
                            </p>
                        </form>
                    ) : (
                        /* ────── COLLEGE FORM ────── */
                        <form key="college" className="form-panel" onSubmit={handleCollegeLogin} style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                            {/* College info banner */}
                            <div style={{
                                background: 'linear-gradient(135deg, #eef2ff 0%, #f5f3ff 100%)',
                                border: '1px solid #c7d2fe',
                                borderRadius: '10px',
                                padding: '0.75rem 1rem',
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '0.5rem',
                                marginBottom: '0.25rem',
                            }}>
                                <svg width="16" height="16" fill="none" stroke="#4f46e5" strokeWidth="2" viewBox="0 0 24 24" style={{ flexShrink: 0, marginTop: 2 }}><circle cx="12" cy="12" r="10" /><path d="M12 16v-4m0-4h.01" /></svg>
                                <span style={{ fontSize: '0.75rem', color: '#4338ca', lineHeight: 1.5, fontWeight: 500 }}>
                                    Use your official <strong>College Registration Number</strong> and the institution-provided password to sign in.
                                </span>
                            </div>

                            <div>
                                <label className="fade-in-label">Registration Number</label>
                                <div style={{ position: 'relative' }}>
                                    <span style={{ ...iconWrap, color: focusedField === 'regNo' ? '#4f46e5' : '#94a3b8' }}>
                                        <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1" /></svg>
                                    </span>
                                    <input
                                        type="text"
                                        value={regNo}
                                        onChange={e => setRegNo(e.target.value)}
                                        placeholder="e.g. 21BCE1234"
                                        style={{
                                            ...inputStyle('regNo'),
                                            border: `1.5px solid ${focusedField === 'regNo' ? '#4f46e5' : '#e2e8f0'}`,
                                            boxShadow: focusedField === 'regNo' ? '0 0 0 3px rgba(79,70,229,0.12)' : 'none',
                                        }}
                                        onFocus={() => setFocusedField('regNo')}
                                        onBlur={() => setFocusedField(null)}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="fade-in-label">Portal Password</label>
                                <div style={{ position: 'relative' }}>
                                    <span style={{ ...iconWrap, color: focusedField === 'collegePassword' ? '#4f46e5' : '#94a3b8' }}>
                                        <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                    </span>
                                    <input
                                        type="password"
                                        value={collegePassword}
                                        onChange={e => setCollegePassword(e.target.value)}
                                        placeholder="••••••••"
                                        style={{
                                            ...inputStyle('collegePassword'),
                                            border: `1.5px solid ${focusedField === 'collegePassword' ? '#4f46e5' : '#e2e8f0'}`,
                                            boxShadow: focusedField === 'collegePassword' ? '0 0 0 3px rgba(79,70,229,0.12)' : 'none',
                                        }}
                                        onFocus={() => setFocusedField('collegePassword')}
                                        onBlur={() => setFocusedField(null)}
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="error-box">
                                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 8v4m0 4h.01" /></svg>
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                className="submit-btn"
                                disabled={isLoading}
                                style={{
                                    background: isLoading ? '#6366f1' : 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                                    boxShadow: '0 4px 15px rgba(79,70,229,0.35)',
                                }}
                            >
                                {isLoading ? 'Authenticating...' : 'College Sign In'}
                            </button>
                        </form>
                    )}

                    {/* Footer with Back to Home + Contact Us */}
                    <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <p style={{ fontSize: '0.65rem', color: '#cbd5e1', margin: 0 }}>
                            © 2026 Mind Code · All rights reserved
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                            <Link
                                to="/"
                                className="contact-btn"
                                style={{ textDecoration: 'none' }}
                            >
                                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path d="M19 12H5M12 5l-7 7 7 7" />
                                </svg>
                                Back to Home
                            </Link>
                            <span style={{ width: 1, height: 12, background: '#e2e8f0', display: 'inline-block' }} />
                            <button
                                className="contact-btn"
                                onClick={() => setShowContact(true)}
                            >
                                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                       
                            </button>
                        </div>
                    </div>

                    {/* ── Developer Modal ── */}
                    {showContact && (
                        <div className="contact-overlay" onClick={() => setShowContact(false)}>
                            <div
                                className="contact-modal"
                                onClick={e => e.stopPropagation()}
                                style={{
                                    width: '100%',
                                    maxWidth: 540,
                                    background: 'linear-gradient(160deg, #0b1120 0%, #111827 100%)',
                                    borderRadius: '20px',
                                    border: '1px solid rgba(99,102,241,0.2)',
                                    boxShadow: '0 40px 100px rgba(0,0,0,0.7)',
                                    overflow: 'hidden',
                                }}
                            >
                                {/* Modal header */}
                                <div style={{
                                    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                                    padding: '1.5rem 1.75rem 1.25rem',
                                    position: 'relative',
                                }}>
                                    {/* Close button */}
                                    <button
                                        onClick={() => setShowContact(false)}
                                        style={{
                                            position: 'absolute', top: '1rem', right: '1rem',
                                            background: 'rgba(255,255,255,0.15)',
                                            border: 'none', borderRadius: '50%',
                                            width: 30, height: 30,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            cursor: 'pointer', color: '#fff', fontSize: '1rem',
                                            transition: 'background 0.2s',
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
                                    >✕</button>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <div style={{
                                            width: 44, height: 44, borderRadius: '12px',
                                            background: 'rgba(255,255,255,0.2)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: '1.3rem',
                                        }}>👋</div>
                                        <div>
                                            <h3 style={{ color: '#fff', fontWeight: 800, fontSize: '1.1rem', margin: 0 }}>Meet the Team</h3>
                                            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem', margin: '0.2rem 0 0' }}>
                                                Built with ❤️ by the Mind Code developers
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Dev cards */}
                                <div style={{ padding: '1.25rem 1.5rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                                    {DEVS.map((dev, i) => (
                                        <div key={i} className="dev-card-item">
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                {/* Avatar */}
                                                <div style={{
                                                    width: 38, height: 38, borderRadius: '10px', flexShrink: 0,
                                                    background: `linear-gradient(135deg, ${['#4f46e5', '#7c3aed', '#2563eb'][i]} 0%, ${['#7c3aed', '#db2777', '#4f46e5'][i]} 100%)`,
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    fontWeight: 800, fontSize: '1rem', color: '#fff',
                                                }}>{dev.avatar}</div>
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <div style={{ color: '#f1f5f9', fontWeight: 700, fontSize: '0.875rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{dev.name}</div>
                                                    <div style={{ color: '#6366f1', fontSize: '0.7rem', fontWeight: 600, marginTop: '0.1rem' }}>{dev.role}</div>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', paddingLeft: '0.25rem' }}>
                                                {/* Phone */}
                                                <a href={`tel:${dev.contact.replace(/\s+/g, '')}`} className="dev-link-small" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                                    <svg width="12" height="12" fill="none" stroke="#60a5fa" strokeWidth="2" viewBox="0 0 24 24">
                                                        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.63A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                                                    </svg>
                                                    {dev.contact}
                                                </a>
                                                {/* GitHub */}
                                                <a href={`https://github.com/${dev.github}`} target="_blank" rel="noopener noreferrer" className="dev-link-small" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="#a78bfa">
                                                        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                                                    </svg>
                                                    {dev.github}
                                                </a>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Bottom note */}
                                    <p style={{ textAlign: 'center', fontSize: '0.68rem', color: '#475569', marginTop: '0.25rem' }}>
                                        © 2026 Mind Code · Powered by Mind Spark
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
