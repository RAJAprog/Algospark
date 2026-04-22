// import React, { useState, useEffect, useRef } from 'react';
// import { Link } from 'react-router-dom';
// import { Github, Phone, Code2, ChevronDown, Zap, Target, Trophy, Users, BookOpen, Star } from 'lucide-react';

// const FEATURES = [
//   { icon: <Code2 size={24} />, color: '#3b82f6', title: 'Live Coding',    desc: 'Solve problems in a real-time judge with instant feedback.' },
//   { icon: <Trophy size={24} />, color: '#f5a623', title: 'Competitions',   desc: 'Compete college-wide in timed coding contests.' },
//   { icon: <Target size={24} />, color: '#10b981', title: 'Skill Tracking', desc: 'Track your progress across topics and difficulty levels.' },
//   { icon: <BookOpen size={24} />,color: '#a855f7', title: 'Learning Modules', desc: 'Guided curriculum built for engineering exam prep.' },
//   { icon: <Zap size={24} />,    color: '#ef4444', title: 'Instant Results', desc: 'See your score and detailed test-case output immediately.' },
//   { icon: <Users size={24} />,  color: '#ec4899', title: 'Faculty Tools',  desc: 'Faculty can create, manage, and evaluate assessments.' },
// ];

// const HomePage = () => {
//   const [scrollY, setScrollY] = useState(0);
//   const [navSolid, setNavSolid] = useState(false);
//   const aboutRef = useRef(null);

//   useEffect(() => {
//     const onScroll = () => {
//       setScrollY(window.scrollY);
//       setNavSolid(window.scrollY > 60);
//     };
//     window.addEventListener('scroll', onScroll, { passive: true });
//     return () => window.removeEventListener('scroll', onScroll);
//   }, []);

//   const scrollToAbout = () => {
//     aboutRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   return (
//     <div style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif", background: '#f8faff', minHeight: '100vh' }}>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

//         *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

//         html { scroll-behavior: smooth; }

//         /* ── Keyframes ── */
//         @keyframes fadeUp {
//           from { opacity: 0; transform: translateY(28px); }
//           to   { opacity: 1; transform: translateY(0); }
//         }
//         @keyframes fadeIn {
//           from { opacity: 0; }
//           to   { opacity: 1; }
//         }
//         @keyframes gradientShift {
//           0%   { background-position: 0% 50%; }
//           50%  { background-position: 100% 50%; }
//           100% { background-position: 0% 50%; }
//         }
//         @keyframes kenBurns {
//           from { transform: scale(1); }
//           to   { transform: scale(1.06); }
//         }
//         @keyframes floatUp {
//           0%, 100% { transform: translateY(0px); }
//           50%       { transform: translateY(-8px); }
//         }
//         @keyframes pulse-ring {
//           0%   { box-shadow: 0 0 0 0 rgba(124, 77, 255, 0.35); }
//           70%  { box-shadow: 0 0 0 14px rgba(124, 77, 255, 0); }
//           100% { box-shadow: 0 0 0 0 rgba(124, 77, 255, 0); }
//         }
//         @keyframes shimmer {
//           0%   { background-position: -200% center; }
//           100% { background-position: 200% center; }
//         }
//         @keyframes spin-slow {
//           from { transform: rotate(0deg); }
//           to   { transform: rotate(360deg); }
//         }

//         /* ── Navbar ── */
//         .mc-nav {
//           position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
//           display: flex; align-items: center; justify-content: space-between;
//           padding: 0 40px; height: 72px;
//           transition: background 0.35s ease, box-shadow 0.35s ease, backdrop-filter 0.35s ease;
//         }
//         .mc-nav.solid {
//           background: rgba(255, 255, 255, 0.95);
//           backdrop-filter: blur(20px);
//           box-shadow: 0 2px 20px rgba(0, 0, 0, 0.08);
//         }
//         .mc-nav.transparent {
//           background: linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, transparent 100%);
//         }

//         /* ── Faculty Login Btn ── */
//         .faculty-btn {
//           padding: 9px 22px;
//           border-radius: 40px;
//           border: 1.5px solid rgba(255,255,255,0.7);
//           background: rgba(255,255,255,0.12);
//           backdrop-filter: blur(8px);
//           color: #fff;
//           font-size: 13.5px;
//           font-weight: 600;
//           text-decoration: none;
//           letter-spacing: 0.3px;
//           transition: all 0.25s ease;
//         }
//         .faculty-btn:hover {
//           background: rgba(255,255,255,0.28);
//           border-color: #fff;
//           transform: translateY(-1px);
//           box-shadow: 0 6px 20px rgba(0,0,0,0.18);
//         }
//         .faculty-btn.dark {
//           border-color: rgba(124,77,255,0.5);
//           background: transparent;
//           color: #7c4dff;
//         }
//         .faculty-btn.dark:hover {
//           background: linear-gradient(135deg, #7c4dff, #1a73e8);
//           color: #fff;
//           border-color: transparent;
//           box-shadow: 0 6px 20px rgba(124,77,255,0.3);
//         }

//         /* ── Hero ── */
//         .hero-bg {
//           position: absolute; inset: 0;
//           width: 100%; height: 100%;
//           object-fit: cover; object-position: center;
//           animation: kenBurns 12s ease forwards;
//         }
//         .hero-badge {
//           display: inline-flex; align-items: center; gap: 8px;
//           padding: 6px 18px;
//           border-radius: 40px;
//           background: rgba(255,255,255,0.12);
//           border: 1px solid rgba(255,255,255,0.3);
//           backdrop-filter: blur(10px);
//           color: #e0e7ff;
//           font-size: 12.5px;
//           font-weight: 600;
//           letter-spacing: 0.5px;
//           margin-bottom: 24px;
//           animation: fadeUp 0.6s ease 0.1s both;
//         }
//         .hero-title {
//           font-size: clamp(48px, 7vw, 88px);
//           font-weight: 900;
//           line-height: 1;
//           letter-spacing: -0.03em;
//           background: linear-gradient(135deg, #ffffff 0%, #c4d4ff 50%, #a78bfa 100%);
//           background-size: 200% 200%;
//           -webkit-background-clip: text;
//           -webkit-text-fill-color: transparent;
//           background-clip: text;
//           color: transparent;
//           animation: fadeUp 0.6s ease 0.25s both, gradientShift 5s ease infinite;
//         }
//         .hero-sub {
//           font-size: clamp(16px, 2vw, 20px);
//           color: rgba(255,255,255,0.78);
//           font-weight: 400;
//           line-height: 1.6;
//           max-width: 540px;
//           margin: 20px auto 0;
//           animation: fadeUp 0.6s ease 0.4s both;
//         }
//         .hero-cta-wrap {
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           gap: 16px;
//           margin-top: 40px;
//           flex-wrap: wrap;
//           animation: fadeUp 0.6s ease 0.55s both;
//         }
//         .btn-primary {
//           display: inline-flex; align-items: center; gap: 8px;
//           padding: 15px 36px;
//           border-radius: 50px;
//           background: linear-gradient(135deg, #7c4dff, #1a73e8);
//           color: #fff;
//           font-size: 15px;
//           font-weight: 700;
//           text-decoration: none;
//           letter-spacing: 0.3px;
//           box-shadow: 0 8px 30px rgba(124,77,255,0.5);
//           transition: all 0.25s ease;
//           animation: pulse-ring 2.5s ease infinite;
//         }
//         .btn-primary:hover {
//           transform: translateY(-3px);
//           box-shadow: 0 14px 40px rgba(124,77,255,0.6);
//           background: linear-gradient(135deg, #6a2fff, #1565c0);
//         }
//         .btn-ghost {
//           display: inline-flex; align-items: center; gap: 8px;
//           padding: 14px 30px;
//           border-radius: 50px;
//           border: 1.5px solid rgba(255,255,255,0.4);
//           background: rgba(255,255,255,0.1);
//           backdrop-filter: blur(10px);
//           color: #fff;
//           font-size: 15px;
//           font-weight: 600;
//           text-decoration: none;
//           letter-spacing: 0.3px;
//           transition: all 0.25s ease;
//           cursor: pointer;
//         }
//         .btn-ghost:hover {
//           background: rgba(255,255,255,0.2);
//           border-color: rgba(255,255,255,0.7);
//           transform: translateY(-2px);
//         }
//         .scroll-indicator {
//           animation: floatUp 2s ease-in-out infinite;
//           cursor: pointer;
//         }

//         /* ── Info Section ── */
//         .info-card {
//           background: #fff;
//           border-radius: 20px;
//           padding: 48px;
//           box-shadow: 0 4px 40px rgba(0,0,0,0.07);
//           transition: transform 0.3s ease, box-shadow 0.3s ease;
//         }
//         .info-card:hover {
//           transform: translateY(-4px);
//           box-shadow: 0 12px 50px rgba(0,0,0,0.12);
//         }

//         /* ── Feature Cards ── */
//         .feature-card {
//           background: #0f172a;
//           border-radius: 16px;
//           padding: 36px 30px;
//           box-shadow: 0 10px 30px rgba(0,0,0,0.25);
//           border: 1px solid rgba(255,255,255,0.06);
//           border-bottom: 4px solid transparent;
//           transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
//           position: relative;
//           overflow: hidden;
//           z-index: 1;
//         }
//         .feature-card::before {
//           content: '';
//           position: absolute; inset: 0; z-index: -1;
//           background: radial-gradient(400px circle at 50% 0%, rgba(255,255,255,0.04), transparent 60%);
//           opacity: 0; transition: opacity 0.4s ease;
//         }
//         .feature-card:hover {
//           transform: translateY(-8px);
//           background: #1e293b;
//           box-shadow: 0 20px 40px rgba(0,0,0,0.4);
//         }
//         .feature-card:hover::before { opacity: 1; }
        
//         .feature-icon-wrap {
//           width: 56px; height: 56px;
//           border-radius: 14px;
//           display: flex; align-items: center; justify-content: center;
//           margin-bottom: 24px;
//           transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease;
//         }
//         .feature-card:hover .feature-icon-wrap { 
//           transform: scale(1.1) translateY(-3px); 
//         }

//         /* ── Section heading ── */
//         .section-label {
//           display: inline-block;
//           font-size: 11px;
//           font-weight: 700;
//           letter-spacing: 0.4em;
//           text-transform: uppercase;
//           background: linear-gradient(90deg, #7c4dff, #1a73e8);
//           -webkit-background-clip: text;
//           -webkit-text-fill-color: transparent;
//           background-clip: text;
//           color: transparent;
//           margin-bottom: 12px;
//         }
//         .section-title {
//           font-size: clamp(28px, 4vw, 40px);
//           font-weight: 800;
//           color: #0f172a;
//           line-height: 1.15;
//           letter-spacing: -0.02em;
//         }
//         .grad-text {
//           background: linear-gradient(135deg, #7c4dff, #1a73e8);
//           -webkit-background-clip: text;
//           -webkit-text-fill-color: transparent;
//           background-clip: text;
//           color: transparent;
//         }

//         @keyframes colorPulse {
//           0% { color: #1a73e8; }
//           33% { color: #7c4dff; }
//           66% { color: #ec4899; }
//           100% { color: #1a73e8; }
//         }
//         @keyframes subColorPulse {
//           0% { color: #f5a623; }
//           50% { color: #ef4444; }
//           100% { color: #f5a623; }
//         }
//         .anim-title {
//           font-weight: 900;
//           font-size: 22px;
//           letter-spacing: 0.5px;
//           animation: colorPulse 4s ease-in-out infinite;
//         }
//         .anim-sub {
//           font-size: 11px;
//           font-weight: 700;
//           letter-spacing: 0.5px;
//           animation: subColorPulse 3s ease-in-out infinite;
//           margin-top: 2px;
//         }
//         .white-brand-pill {
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           line-height: 1.1;
//           background: #ffffff;
//           padding: 8px 20px 10px;
//           border-radius: 12px;
//           box-shadow: 0 4px 20px rgba(0,0,0,0.15);
//           transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
//           cursor: default;
//         }
//         .white-brand-pill:hover {
//           transform: translateY(-2px) scale(1.02);
//           box-shadow: 0 8px 25px rgba(0,0,0,0.2);
//         }

//         /* ── Logo box ── */
//         .logo-glow {
//           animation: floatUp 4s ease-in-out infinite;
//           filter: drop-shadow(0 12px 30px rgba(124,77,255,0.35));
//         }

//         /* ── Stat pill ── */
//         .stat-pill {
//           display: flex; flex-direction: column; align-items: center;
//           padding: 20px 32px;
//           background: #fff;
//           border-radius: 16px;
//           box-shadow: 0 4px 24px rgba(0,0,0,0.06);
//         }

//         /* ── Footer ── */
//         .footer-bg {
//           background: linear-gradient(135deg, #080d1e 0%, #0d1635 50%, #0a0e20 100%);
//         }

//         @media (max-width: 768px) {
//           .mc-nav { padding: 0 20px; }
//           .info-grid { flex-direction: column !important; }
//           .feature-grid { grid-template-columns: 1fr 1fr !important; }
//           .dev-row { flex-direction: column !important; }
//           .stat-row { flex-direction: column !important; }
//         }
//         @media (max-width: 500px) {
//           .feature-grid { grid-template-columns: 1fr !important; }
//         }
//       `}</style>

//       {/* ══════════════════════════════════════
//           NAVBAR
//       ══════════════════════════════════════ */}
//       <nav className={`mc-nav ${navSolid ? 'solid' : 'transparent'}`}>
//         {/* Logo */}
//         <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
//           <img
//             src="/logo.png"
//             alt="MindSpark Logo"
//             style={{ height: 42, width: 'auto', objectFit: 'contain', filter: navSolid ? 'none' : 'brightness(1.2)' }}
//           />
//         </div>

//         {/* Center Brand */}
//         <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
//           <div className="white-brand-pill" style={{ opacity: navSolid ? 1 : 0.95 }}>
//             <span className="anim-title">MIND CODE</span>
//             <span className="anim-sub">Powered by MindSpark</span>
//           </div>
//         </div>

//         {/* Faculty Login */}
//         <Link
//           to="/faculty-login"
//           id="faculty-login-btn"
//           className={`faculty-btn ${navSolid ? 'dark' : ''}`}
//         >
//           Faculty Login
//         </Link>
//       </nav>

//       {/* ══════════════════════════════════════
//           HERO / COVER PAGE
//       ══════════════════════════════════════ */}
//       <section style={{
//         position: 'relative',
//         height: '100vh',
//         minHeight: 600,
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         justifyContent: 'center',
//         textAlign: 'center',
//         overflow: 'hidden',
//       }}>
//         {/* Background image */}
//         <img src="/cover.png" alt="MindCode Cover" className="hero-bg" />

//         {/* Overlay */}
//         <div style={{
//           position: 'absolute', inset: 0, zIndex: 1,
//           background: 'linear-gradient(to bottom, rgba(5,8,22,0.62) 0%, rgba(5,8,22,0.45) 50%, rgba(5,8,22,0.80) 100%)',
//         }} />

//         {/* Content */}
//         <div style={{ position: 'relative', zIndex: 2, padding: '0 24px', maxWidth: 800, width: '100%' }}>
//           <div className="hero-badge">
//             <Star size={13} style={{ color: '#f5a623' }} />
//             <span> Powered by MindSpark </span>
//           </div>

//           <h1 className="hero-title">Mind Code</h1>

//           <p className="hero-sub">
//             The Ultimate Coding Platform for Engineering Students. Practice, Compete, and Excel in Programming Contests and Academic Assessments — All in One Place.
//           </p>

//           <div className="hero-cta-wrap">
//             <Link to="/login" id="student-login-hero-btn" className="btn-primary">
//               Student Login
//             </Link>
//             <button className="btn-ghost" onClick={scrollToAbout}>
//               Learn More
//               <ChevronDown size={16} />
//             </button>
//           </div>
//         </div>

//         {/* Scroll indicator */}
//         <div
//           className="scroll-indicator"
//           onClick={scrollToAbout}
//           style={{
//             position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)',
//             zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
//             color: 'rgba(255,255,255,0.55)', fontSize: 11, fontWeight: 500, letterSpacing: '0.2em',
//             cursor: 'pointer',
//           }}
//         >
//           <span>SCROLL</span>
//           <ChevronDown size={18} />
//         </div>
//       </section>

//       {/* ══════════════════════════════════════
//           STATS BAR
//       ══════════════════════════════════════ */}
//       <div style={{
//         background: 'linear-gradient(135deg, #7c4dff, #1a73e8)',
//         padding: '28px 40px',
//       }}>
//         <div className="stat-row" style={{
//           maxWidth: 900, margin: '0 auto',
//           display: 'flex', alignItems: 'center', justifyContent: 'space-around',
//           gap: 24, flexWrap: 'wrap',
//         }}>
//           {[
//             { value: '10,000+', label: 'Problems Solved' },
//             { value: '500+',    label: 'Students Active' },
//             { value: '50+',     label: 'College Contests' },
//             { value: '98%',     label: 'Satisfaction Rate' },
//           ].map((s, i) => (
//             <div key={i} style={{ textAlign: 'center', color: '#fff' }}>
//               <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: '-0.02em' }}>{s.value}</div>
//               <div style={{ fontSize: 12, fontWeight: 500, opacity: 0.75, letterSpacing: '0.05em', marginTop: 4 }}>{s.label}</div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* ══════════════════════════════════════
//           INFO SECTION — About + Logo
//       ══════════════════════════════════════ */}
//       <section ref={aboutRef} style={{ padding: '96px 40px', background: '#f0f4ff' }}>
//         <div className="info-grid" style={{
//           maxWidth: 1100, margin: '0 auto',
//           display: 'flex', gap: 32, alignItems: 'stretch',
//         }}>

//           {/* Left — About + Student Login */}
//           <div className="info-card" style={{ flex: 1.4 }}>
//             <span className="section-label">About Mind Code</span>
//             <h2 className="section-title" style={{ marginBottom: 20 }}>
//               Code Smarter. <span className="grad-text">Compete Better.</span>
//             </h2>
//             <p style={{ color: '#475569', lineHeight: 1.8, fontSize: 15.5, marginBottom: 16 }}>
//               <strong style={{ color: '#0f172a' }}>Mind Code</strong> is MindSpark's flagship platform
//               designed to transform the way engineering students learn and practice programming.
//               With a powerful in-browser code editor, automated test cases, and a real-time leaderboard —
//               it's everything you need to go from beginner to competition-ready.
//             </p>
//             <p style={{ color: '#64748b', lineHeight: 1.8, fontSize: 14.5, marginBottom: 36 }}>
//               Faculty can design and launch assessments, track student performance, and create structured
//               learning modules — all within a single, unified dashboard.
//             </p>

//             <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
//               <Link
//                 to="/login"
//                 id="student-login-info-btn"
//                 style={{
//                   display: 'inline-flex', alignItems: 'center', gap: 8,
//                   padding: '13px 32px',
//                   borderRadius: 50,
//                   background: 'linear-gradient(135deg, #7c4dff, #1a73e8)',
//                   color: '#fff',
//                   fontWeight: 700, fontSize: 14.5,
//                   textDecoration: 'none',
//                   boxShadow: '0 6px 24px rgba(124,77,255,0.35)',
//                   transition: 'all 0.25s ease',
//                 }}
//                 onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(124,77,255,0.5)'; }}
//                 onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 6px 24px rgba(124,77,255,0.35)'; }}
//               >
//                 Student Login
//               </Link>
//               <a
//                 href="#features"
//                 style={{
//                   display: 'inline-flex', alignItems: 'center', gap: 8,
//                   padding: '12px 28px',
//                   borderRadius: 50,
//                   border: '1.5px solid rgba(124,77,255,0.35)',
//                   color: '#7c4dff',
//                   fontWeight: 600, fontSize: 14.5,
//                   textDecoration: 'none',
//                   transition: 'all 0.25s ease',
//                   background: 'transparent',
//                 }}
//                 onMouseEnter={e => { e.currentTarget.style.background = 'rgba(124,77,255,0.06)'; }}
//                 onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
//               >
//                 Explore Features
//               </a>
//             </div>
//           </div>

//           {/* Right — Our Logo */}
//           <div className="info-card" style={{
//             flex: 0.8, display: 'flex', flexDirection: 'column',
//             alignItems: 'center', justifyContent: 'center',
//             background: 'linear-gradient(135deg, #0f172a 0%, #1a1040 50%, #0f172a 100%)',
//             padding: '56px 40px', gap: 24,
//           }}>
//             {/* Rotating ring */}
//             <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 180, height: 180 }}>
//               <div style={{
//                 position: 'absolute', inset: 0,
//                 borderRadius: '50%',
//                 border: '2px dashed rgba(124,77,255,0.3)',
//                 animation: 'spin-slow 18s linear infinite',
//               }} />
//               <div style={{
//                 position: 'absolute', inset: 10,
//                 borderRadius: '50%',
//                 border: '1.5px dashed rgba(26,115,232,0.2)',
//                 animation: 'spin-slow 12s linear infinite reverse',
//               }} />
//               <div className="logo-glow">
//                 <img
//                   src="/logo.png"
//                   alt="MindSpark Logo"
//                   style={{ width: 110, height: 110, objectFit: 'contain' }}
//                 />
//               </div>
//             </div>

//             <div className="white-brand-pill" style={{ marginTop: 16 }}>
//               <span className="anim-title" style={{ fontSize: 24 }}>MIND CODE</span>
//               <span className="anim-sub" style={{ fontSize: 12 }}>Powered by MindSpark</span>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* ══════════════════════════════════════
//           FEATURES SECTION
//       ══════════════════════════════════════ */}
//       <section id="features" style={{ padding: '96px 40px', background: '#050810' }}>
//         <div style={{ maxWidth: 1100, margin: '0 auto' }}>
//           <div style={{ textAlign: 'center', marginBottom: 64 }}>
//             <span className="section-label">What We Offer</span>
//             <h2 className="section-title" style={{ color: '#fff' }}>
//               Everything You Need to <span className="grad-text">Excel</span>
//             </h2>
//             <p style={{ color: '#94a3b8', marginTop: 16, fontSize: 16, maxWidth: 540, margin: '16px auto 0' }}>
//               A complete ecosystem for coding practice, competitive programming, and academic assessments.
//             </p>
//           </div>

//           <div className="feature-grid" style={{
//             display: 'grid',
//             gridTemplateColumns: 'repeat(3, 1fr)',
//             gap: 28,
//           }}>
//             {FEATURES.map((f, i) => (
//               <div 
//                 key={i} 
//                 className="feature-card"
//                 style={{
//                   borderBottomColor: f.color
//                 }}
//               >
//                 <div 
//                   className="feature-icon-wrap" 
//                   style={{
//                     background: `${f.color}15`, // 15% opacity hex
//                     color: f.color,
//                     boxShadow: `0 8px 24px ${f.color}35` // 35% opacity hex
//                   }}
//                 >
//                   {f.icon}
//                 </div>
//                 <h3 style={{ fontSize: 18, fontWeight: 700, color: '#f8fafc', marginBottom: 12 }}>{f.title}</h3>
//                 <p style={{ fontSize: 14.5, color: '#94a3b8', lineHeight: 1.65 }}>{f.desc}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ══════════════════════════════════════
//           FOOTER
//       ══════════════════════════════════════ */}
//       <footer className="footer-bg" style={{ padding: '64px 40px 40px' }}>
//         <div style={{ maxWidth: 1100, margin: '0 auto' }}>

//           {/* Footer top */}
//           <div style={{
//             display: 'flex', alignItems: 'center', justifyContent: 'space-between',
//             flexWrap: 'wrap', gap: 24, marginBottom: 48,
//             paddingBottom: 40,
//             borderBottom: '1px solid rgba(255,255,255,0.07)',
//           }}>
//             <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
//               <img src="/logo.png" alt="Logo" style={{ height: 44, objectFit: 'contain' }} />
//               <div>
//                 <div style={{
//                   fontWeight: 900, fontSize: 20, letterSpacing: '0.5px',
//                   background: 'linear-gradient(90deg, #a78bfa, #60a5fa)',
//                   WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
//                 }}>MIND CODE</div>
//                 <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: 500, marginTop: 2 }}>
//                   Powered by MindSpark
//                 </div>
//               </div>
//             </div>
//             <div style={{ textAlign: 'right' }}>
//               <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', lineHeight: 1.8 }}>
//                 <div>Practice · Compete · Excel</div>
//                 <div>Built for Engineering Students</div>
//               </div>
//             </div>
//           </div>



//           {/* Copyright */}
//           <div style={{
//             borderTop: '1px solid rgba(255,255,255,0.06)',
//             paddingTop: 28,
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             flexWrap: 'wrap',
//             gap: 8,
//           }}>
//             <span style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.3)' }}>
//               © {new Date().getFullYear()} Mind Code · Powered by MindSpark. All rights reserved.
//             </span>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default HomePage; 


// import React, { useState, useEffect, useRef } from 'react';
// import { Link } from 'react-router-dom';
// import { Github, Phone, Code2, ChevronDown, Zap, Target, Trophy, Users, BookOpen, Star, Terminal } from 'lucide-react';

// const FEATURES = [
//   { icon: <Code2 size={24} />, color: '#3b82f6', title: 'Live Coding',    desc: 'Solve problems in a real-time judge with instant feedback.' },
//   { icon: <Trophy size={24} />, color: '#f5a623', title: 'Competitions',   desc: 'Compete college-wide in timed coding contests.' },
//   { icon: <Target size={24} />, color: '#10b981', title: 'Skill Tracking', desc: 'Track your progress across topics and difficulty levels.' },
//   { icon: <BookOpen size={24} />,color: '#a855f7', title: 'Learning Modules', desc: 'Guided curriculum built for engineering exam prep.' },
//   { icon: <Zap size={24} />,    color: '#ef4444', title: 'Instant Results', desc: 'See your score and detailed test-case output immediately.' },
//   { icon: <Users size={24} />,  color: '#ec4899', title: 'Faculty Tools',  desc: 'Faculty can create, manage, and evaluate assessments.' },
// ];

// const HomePage = () => {
//   const [scrollY, setScrollY] = useState(0);
//   const [navSolid, setNavSolid] = useState(false);
//   const aboutRef = useRef(null);

//   useEffect(() => {
//     const onScroll = () => {
//       setScrollY(window.scrollY);
//       setNavSolid(window.scrollY > 60);
//     };
//     window.addEventListener('scroll', onScroll, { passive: true });
//     return () => window.removeEventListener('scroll', onScroll);
//   }, []);

//   const scrollToAbout = () => {
//     aboutRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   return (
//     <div style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif", background: '#f8faff', minHeight: '100vh' }}>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

//         *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

//         html { scroll-behavior: smooth; }

//         /* ── Keyframes ── */
//         @keyframes fadeUp {
//           from { opacity: 0; transform: translateY(28px); }
//           to   { opacity: 1; transform: translateY(0); }
//         }
//         @keyframes fadeIn {
//           from { opacity: 0; }
//           to   { opacity: 1; }
//         }
//         @keyframes gradientShift {
//           0%   { background-position: 0% 50%; }
//           50%  { background-position: 100% 50%; }
//           100% { background-position: 0% 50%; }
//         }
//         @keyframes kenBurns {
//           from { transform: scale(1); }
//           to   { transform: scale(1.06); }
//         }
//         @keyframes floatUp {
//           0%, 100% { transform: translateY(0px); }
//           50%       { transform: translateY(-8px); }
//         }
//         @keyframes pulse-ring {
//           0%   { box-shadow: 0 0 0 0 rgba(124, 77, 255, 0.35); }
//           70%  { box-shadow: 0 0 0 14px rgba(124, 77, 255, 0); }
//           100% { box-shadow: 0 0 0 0 rgba(124, 77, 255, 0); }
//         }
//         @keyframes terminal-pulse {
//           0%   { box-shadow: 0 0 0 0 rgba(255, 161, 22, 0.35); }
//           70%  { box-shadow: 0 0 0 10px rgba(255, 161, 22, 0); }
//           100% { box-shadow: 0 0 0 0 rgba(255, 161, 22, 0); }
//         }
//         @keyframes shimmer {
//           0%   { background-position: -200% center; }
//           100% { background-position: 200% center; }
//         }
//         @keyframes spin-slow {
//           from { transform: rotate(0deg); }
//           to   { transform: rotate(360deg); }
//         }

//         /* ── Navbar ── */
//         .mc-nav {
//           position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
//           display: flex; align-items: center; justify-content: space-between;
//           padding: 0 40px; height: 72px;
//           transition: background 0.35s ease, box-shadow 0.35s ease, backdrop-filter 0.35s ease;
//         }
//         .mc-nav.solid {
//           background: rgba(255, 255, 255, 0.95);
//           backdrop-filter: blur(20px);
//           box-shadow: 0 2px 20px rgba(0, 0, 0, 0.08);
//         }
//         .mc-nav.transparent {
//           background: linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, transparent 100%);
//         }

//         /* ── Faculty Login Btn ── */
//         .faculty-btn {
//           padding: 9px 22px;
//           border-radius: 40px;
//           border: 1.5px solid rgba(255,255,255,0.7);
//           background: rgba(255,255,255,0.12);
//           backdrop-filter: blur(8px);
//           color: #fff;
//           font-size: 13.5px;
//           font-weight: 600;
//           text-decoration: none;
//           letter-spacing: 0.3px;
//           transition: all 0.25s ease;
//         }
//         .faculty-btn:hover {
//           background: rgba(255,255,255,0.28);
//           border-color: #fff;
//           transform: translateY(-1px);
//           box-shadow: 0 6px 20px rgba(0,0,0,0.18);
//         }
//         .faculty-btn.dark {
//           border-color: rgba(124,77,255,0.5);
//           background: transparent;
//           color: #7c4dff;
//         }
//         .faculty-btn.dark:hover {
//           background: linear-gradient(135deg, #7c4dff, #1a73e8);
//           color: #fff;
//           border-color: transparent;
//           box-shadow: 0 6px 20px rgba(124,77,255,0.3);
//         }

//         /* ── Hero ── */
//         .hero-bg {
//           position: absolute; inset: 0;
//           width: 100%; height: 100%;
//           object-fit: cover; object-position: center;
//           animation: kenBurns 12s ease forwards;
//         }
//         .hero-badge {
//           display: inline-flex; align-items: center; gap: 8px;
//           padding: 6px 18px;
//           border-radius: 40px;
//           background: rgba(255,255,255,0.12);
//           border: 1px solid rgba(255,255,255,0.3);
//           backdrop-filter: blur(10px);
//           color: #e0e7ff;
//           font-size: 12.5px;
//           font-weight: 600;
//           letter-spacing: 0.5px;
//           margin-bottom: 24px;
//           animation: fadeUp 0.6s ease 0.1s both;
//         }
//         .hero-title {
//           font-size: clamp(48px, 7vw, 88px);
//           font-weight: 900;
//           line-height: 1;
//           letter-spacing: -0.03em;
//           background: linear-gradient(135deg, #ffffff 0%, #c4d4ff 50%, #a78bfa 100%);
//           background-size: 200% 200%;
//           -webkit-background-clip: text;
//           -webkit-text-fill-color: transparent;
//           background-clip: text;
//           color: transparent;
//           animation: fadeUp 0.6s ease 0.25s both, gradientShift 5s ease infinite;
//         }
//         .hero-sub {
//           font-size: clamp(16px, 2vw, 20px);
//           color: rgba(255,255,255,0.78);
//           font-weight: 400;
//           line-height: 1.6;
//           max-width: 540px;
//           margin: 20px auto 0;
//           animation: fadeUp 0.6s ease 0.4s both;
//         }
//         .hero-cta-wrap {
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           gap: 16px;
//           margin-top: 40px;
//           flex-wrap: wrap;
//           animation: fadeUp 0.6s ease 0.55s both;
//         }
//         .btn-primary {
//           display: inline-flex; align-items: center; gap: 8px;
//           padding: 15px 36px;
//           border-radius: 50px;
//           background: linear-gradient(135deg, #7c4dff, #1a73e8);
//           color: #fff;
//           font-size: 15px;
//           font-weight: 700;
//           text-decoration: none;
//           letter-spacing: 0.3px;
//           box-shadow: 0 8px 30px rgba(124,77,255,0.5);
//           transition: all 0.25s ease;
//           animation: pulse-ring 2.5s ease infinite;
//         }
//         .btn-primary:hover {
//           transform: translateY(-3px);
//           box-shadow: 0 14px 40px rgba(124,77,255,0.6);
//           background: linear-gradient(135deg, #6a2fff, #1565c0);
//         }
//         .btn-terminal {
//           display: inline-flex; align-items: center; gap: 8px;
//           padding: 14px 28px;
//           border-radius: 50px;
//           border: 1.5px solid rgba(255, 161, 22, 0.6);
//           background: rgba(255, 161, 22, 0.1);
//           backdrop-filter: blur(10px);
//           color: #ffa116;
//           font-size: 15px;
//           font-weight: 700;
//           text-decoration: none;
//           letter-spacing: 0.3px;
//           transition: all 0.25s ease;
//           animation: terminal-pulse 3s ease infinite;
//         }
//         .btn-terminal:hover {
//           background: rgba(255, 161, 22, 0.22);
//           border-color: #ffa116;
//           transform: translateY(-2px);
//           box-shadow: 0 10px 28px rgba(255, 161, 22, 0.35);
//           color: #ffb733;
//         }
//         .btn-ghost {
//           display: inline-flex; align-items: center; gap: 8px;
//           padding: 14px 30px;
//           border-radius: 50px;
//           border: 1.5px solid rgba(255,255,255,0.4);
//           background: rgba(255,255,255,0.1);
//           backdrop-filter: blur(10px);
//           color: #fff;
//           font-size: 15px;
//           font-weight: 600;
//           text-decoration: none;
//           letter-spacing: 0.3px;
//           transition: all 0.25s ease;
//           cursor: pointer;
//         }
//         .btn-ghost:hover {
//           background: rgba(255,255,255,0.2);
//           border-color: rgba(255,255,255,0.7);
//           transform: translateY(-2px);
//         }
//         .scroll-indicator {
//           animation: floatUp 2s ease-in-out infinite;
//           cursor: pointer;
//         }

//         /* ── Info Section ── */
//         .info-card {
//           background: #fff;
//           border-radius: 20px;
//           padding: 48px;
//           box-shadow: 0 4px 40px rgba(0,0,0,0.07);
//           transition: transform 0.3s ease, box-shadow 0.3s ease;
//         }
//         .info-card:hover {
//           transform: translateY(-4px);
//           box-shadow: 0 12px 50px rgba(0,0,0,0.12);
//         }

//         /* ── Feature Cards ── */
//         .feature-card {
//           background: #0f172a;
//           border-radius: 16px;
//           padding: 36px 30px;
//           box-shadow: 0 10px 30px rgba(0,0,0,0.25);
//           border: 1px solid rgba(255,255,255,0.06);
//           border-bottom: 4px solid transparent;
//           transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
//           position: relative;
//           overflow: hidden;
//           z-index: 1;
//         }
//         .feature-card::before {
//           content: '';
//           position: absolute; inset: 0; z-index: -1;
//           background: radial-gradient(400px circle at 50% 0%, rgba(255,255,255,0.04), transparent 60%);
//           opacity: 0; transition: opacity 0.4s ease;
//         }
//         .feature-card:hover {
//           transform: translateY(-8px);
//           background: #1e293b;
//           box-shadow: 0 20px 40px rgba(0,0,0,0.4);
//         }
//         .feature-card:hover::before { opacity: 1; }
        
//         .feature-icon-wrap {
//           width: 56px; height: 56px;
//           border-radius: 14px;
//           display: flex; align-items: center; justify-content: center;
//           margin-bottom: 24px;
//           transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease;
//         }
//         .feature-card:hover .feature-icon-wrap { 
//           transform: scale(1.1) translateY(-3px); 
//         }

//         /* ── Section heading ── */
//         .section-label {
//           display: inline-block;
//           font-size: 11px;
//           font-weight: 700;
//           letter-spacing: 0.4em;
//           text-transform: uppercase;
//           background: linear-gradient(90deg, #7c4dff, #1a73e8);
//           -webkit-background-clip: text;
//           -webkit-text-fill-color: transparent;
//           background-clip: text;
//           color: transparent;
//           margin-bottom: 12px;
//         }
//         .section-title {
//           font-size: clamp(28px, 4vw, 40px);
//           font-weight: 800;
//           color: #0f172a;
//           line-height: 1.15;
//           letter-spacing: -0.02em;
//         }
//         .grad-text {
//           background: linear-gradient(135deg, #7c4dff, #1a73e8);
//           -webkit-background-clip: text;
//           -webkit-text-fill-color: transparent;
//           background-clip: text;
//           color: transparent;
//         }

//         @keyframes colorPulse {
//           0% { color: #1a73e8; }
//           33% { color: #7c4dff; }
//           66% { color: #ec4899; }
//           100% { color: #1a73e8; }
//         }
//         @keyframes subColorPulse {
//           0% { color: #f5a623; }
//           50% { color: #ef4444; }
//           100% { color: #f5a623; }
//         }
//         .anim-title {
//           font-weight: 900;
//           font-size: 22px;
//           letter-spacing: 0.5px;
//           animation: colorPulse 4s ease-in-out infinite;
//         }
//         .anim-sub {
//           font-size: 11px;
//           font-weight: 700;
//           letter-spacing: 0.5px;
//           animation: subColorPulse 3s ease-in-out infinite;
//           margin-top: 2px;
//         }
//         .white-brand-pill {
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           line-height: 1.1;
//           background: #ffffff;
//           padding: 8px 20px 10px;
//           border-radius: 12px;
//           box-shadow: 0 4px 20px rgba(0,0,0,0.15);
//           transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
//           cursor: default;
//         }
//         .white-brand-pill:hover {
//           transform: translateY(-2px) scale(1.02);
//           box-shadow: 0 8px 25px rgba(0,0,0,0.2);
//         }

//         /* ── Logo box ── */
//         .logo-glow {
//           animation: floatUp 4s ease-in-out infinite;
//           filter: drop-shadow(0 12px 30px rgba(124,77,255,0.35));
//         }

//         /* ── Stat pill ── */
//         .stat-pill {
//           display: flex; flex-direction: column; align-items: center;
//           padding: 20px 32px;
//           background: #fff;
//           border-radius: 16px;
//           box-shadow: 0 4px 24px rgba(0,0,0,0.06);
//         }

//         /* ── Footer ── */
//         .footer-bg {
//           background: linear-gradient(135deg, #080d1e 0%, #0d1635 50%, #0a0e20 100%);
//         }

//         @media (max-width: 768px) {
//           .mc-nav { padding: 0 20px; }
//           .info-grid { flex-direction: column !important; }
//           .feature-grid { grid-template-columns: 1fr 1fr !important; }
//           .dev-row { flex-direction: column !important; }
//           .stat-row { flex-direction: column !important; }
//         }
//         @media (max-width: 500px) {
//           .feature-grid { grid-template-columns: 1fr !important; }
//         }
//       `}</style>

//       {/* ══════════════════════════════════════
//           NAVBAR
//       ══════════════════════════════════════ */}
//       <nav className={`mc-nav ${navSolid ? 'solid' : 'transparent'}`}>
//         {/* Logo */}
//         <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
//           <img
//             src="/logo.png"
//             alt="MindSpark Logo"
//             style={{ height: 42, width: 'auto', objectFit: 'contain', filter: navSolid ? 'none' : 'brightness(1.2)' }}
//           />
//         </div>

//         {/* Center Brand */}
//         <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
//           <div className="white-brand-pill" style={{ opacity: navSolid ? 1 : 0.95 }}>
//             <span className="anim-title">MIND CODE</span>
//             <span className="anim-sub">Powered by MindSpark</span>
//           </div>
//         </div>

//         {/* Faculty Login */}
//         <Link
//           to="/faculty-login"
//           id="faculty-login-btn"
//           className={`faculty-btn ${navSolid ? 'dark' : ''}`}
//         >
//           Faculty Login
//         </Link>
//       </nav>

//       {/* ══════════════════════════════════════
//           HERO / COVER PAGE
//       ══════════════════════════════════════ */}
//       <section style={{
//         position: 'relative',
//         height: '100vh',
//         minHeight: 600,
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         justifyContent: 'center',
//         textAlign: 'center',
//         overflow: 'hidden',
//       }}>
//         {/* Background image */}
//         <img src="/cover.png" alt="MindCode Cover" className="hero-bg" />

//         {/* Overlay */}
//         <div style={{
//           position: 'absolute', inset: 0, zIndex: 1,
//           background: 'linear-gradient(to bottom, rgba(5,8,22,0.62) 0%, rgba(5,8,22,0.45) 50%, rgba(5,8,22,0.80) 100%)',
//         }} />

//         {/* Content */}
//         <div style={{ position: 'relative', zIndex: 2, padding: '0 24px', maxWidth: 800, width: '100%' }}>
//           <div className="hero-badge">
//             <Star size={13} style={{ color: '#f5a623' }} />
//             <span> Powered by MindSpark </span>
//           </div>

//           <h1 className="hero-title">Mind Code</h1>

//           <p className="hero-sub">
//             The Ultimate Coding Platform for Engineering Students. Practice, Compete, and Excel in Programming Contests and Academic Assessments — All in One Place.
//           </p>

//           <div className="hero-cta-wrap">
//             <Link to="/login" id="student-login-hero-btn" className="btn-primary">
//               Student Login
//             </Link>

//             {/* ── Terminal Button ── */}
//             <Link to="/sandbox" className="btn-terminal">
//               <Terminal size={16} />
//               Practice
//             </Link>

//             <button className="btn-ghost" onClick={scrollToAbout}>
//               Learn More
//               <ChevronDown size={16} />
//             </button>
//           </div>
//         </div>

//         {/* Scroll indicator */}
//         <div
//           className="scroll-indicator"
//           onClick={scrollToAbout}
//           style={{
//             position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)',
//             zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
//             color: 'rgba(255,255,255,0.55)', fontSize: 11, fontWeight: 500, letterSpacing: '0.2em',
//             cursor: 'pointer',
//           }}
//         >
//           <span>SCROLL</span>
//           <ChevronDown size={18} />
//         </div>
//       </section>

//       {/* ══════════════════════════════════════
//           STATS BAR
//       ══════════════════════════════════════ */}
//       <div style={{
//         background: 'linear-gradient(135deg, #7c4dff, #1a73e8)',
//         padding: '28px 40px',
//       }}>
//         <div className="stat-row" style={{
//           maxWidth: 900, margin: '0 auto',
//           display: 'flex', alignItems: 'center', justifyContent: 'space-around',
//           gap: 24, flexWrap: 'wrap',
//         }}>
//           {[
//             { value: '10,000+', label: 'Problems Solved' },
//             { value: '500+',    label: 'Students Active' },
//             { value: '50+',     label: 'College Contests' },
//             { value: '98%',     label: 'Satisfaction Rate' },
//           ].map((s, i) => (
//             <div key={i} style={{ textAlign: 'center', color: '#fff' }}>
//               <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: '-0.02em' }}>{s.value}</div>
//               <div style={{ fontSize: 12, fontWeight: 500, opacity: 0.75, letterSpacing: '0.05em', marginTop: 4 }}>{s.label}</div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* ══════════════════════════════════════
//           INFO SECTION — About + Logo
//       ══════════════════════════════════════ */}
//       <section ref={aboutRef} style={{ padding: '96px 40px', background: '#f0f4ff' }}>
//         <div className="info-grid" style={{
//           maxWidth: 1100, margin: '0 auto',
//           display: 'flex', gap: 32, alignItems: 'stretch',
//         }}>

//           {/* Left — About + Student Login */}
//           <div className="info-card" style={{ flex: 1.4 }}>
//             <span className="section-label">About Mind Code</span>
//             <h2 className="section-title" style={{ marginBottom: 20 }}>
//               Code Smarter. <span className="grad-text">Compete Better.</span>
//             </h2>
//             <p style={{ color: '#475569', lineHeight: 1.8, fontSize: 15.5, marginBottom: 16 }}>
//               <strong style={{ color: '#0f172a' }}>Mind Code</strong> is MindSpark's flagship platform
//               designed to transform the way engineering students learn and practice programming.
//               With a powerful in-browser code editor, automated test cases, and a real-time leaderboard —
//               it's everything you need to go from beginner to competition-ready.
//             </p>
//             <p style={{ color: '#64748b', lineHeight: 1.8, fontSize: 14.5, marginBottom: 36 }}>
//               Faculty can design and launch assessments, track student performance, and create structured
//               learning modules — all within a single, unified dashboard.
//             </p>

//             <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
//               <Link
//                 to="/login"
//                 id="student-login-info-btn"
//                 style={{
//                   display: 'inline-flex', alignItems: 'center', gap: 8,
//                   padding: '13px 32px',
//                   borderRadius: 50,
//                   background: 'linear-gradient(135deg, #7c4dff, #1a73e8)',
//                   color: '#fff',
//                   fontWeight: 700, fontSize: 14.5,
//                   textDecoration: 'none',
//                   boxShadow: '0 6px 24px rgba(124,77,255,0.35)',
//                   transition: 'all 0.25s ease',
//                 }}
//                 onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(124,77,255,0.5)'; }}
//                 onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 6px 24px rgba(124,77,255,0.35)'; }}
//               >
//                 Student Login
//               </Link>
//               <a
//                 href="#features"
//                 style={{
//                   display: 'inline-flex', alignItems: 'center', gap: 8,
//                   padding: '12px 28px',
//                   borderRadius: 50,
//                   border: '1.5px solid rgba(124,77,255,0.35)',
//                   color: '#7c4dff',
//                   fontWeight: 600, fontSize: 14.5,
//                   textDecoration: 'none',
//                   transition: 'all 0.25s ease',
//                   background: 'transparent',
//                 }}
//                 onMouseEnter={e => { e.currentTarget.style.background = 'rgba(124,77,255,0.06)'; }}
//                 onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
//               >
//                 Explore Features
//               </a>
//             </div>
//           </div>

//           {/* Right — Our Logo */}
//           <div className="info-card" style={{
//             flex: 0.8, display: 'flex', flexDirection: 'column',
//             alignItems: 'center', justifyContent: 'center',
//             background: 'linear-gradient(135deg, #0f172a 0%, #1a1040 50%, #0f172a 100%)',
//             padding: '56px 40px', gap: 24,
//           }}>
//             {/* Rotating ring */}
//             <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 180, height: 180 }}>
//               <div style={{
//                 position: 'absolute', inset: 0,
//                 borderRadius: '50%',
//                 border: '2px dashed rgba(124,77,255,0.3)',
//                 animation: 'spin-slow 18s linear infinite',
//               }} />
//               <div style={{
//                 position: 'absolute', inset: 10,
//                 borderRadius: '50%',
//                 border: '1.5px dashed rgba(26,115,232,0.2)',
//                 animation: 'spin-slow 12s linear infinite reverse',
//               }} />
//               <div className="logo-glow">
//                 <img
//                   src="/logo.png"
//                   alt="MindSpark Logo"
//                   style={{ width: 110, height: 110, objectFit: 'contain' }}
//                 />
//               </div>
//             </div>

//             <div className="white-brand-pill" style={{ marginTop: 16 }}>
//               <span className="anim-title" style={{ fontSize: 24 }}>MIND CODE</span>
//               <span className="anim-sub" style={{ fontSize: 12 }}>Powered by MindSpark</span>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* ══════════════════════════════════════
//           FEATURES SECTION
//       ══════════════════════════════════════ */}
//       <section id="features" style={{ padding: '96px 40px', background: '#050810' }}>
//         <div style={{ maxWidth: 1100, margin: '0 auto' }}>
//           <div style={{ textAlign: 'center', marginBottom: 64 }}>
//             <span className="section-label">What We Offer</span>
//             <h2 className="section-title" style={{ color: '#fff' }}>
//               Everything You Need to <span className="grad-text">Excel</span>
//             </h2>
//             <p style={{ color: '#94a3b8', marginTop: 16, fontSize: 16, maxWidth: 540, margin: '16px auto 0' }}>
//               A complete ecosystem for coding practice, competitive programming, and academic assessments.
//             </p>
//           </div>

//           <div className="feature-grid" style={{
//             display: 'grid',
//             gridTemplateColumns: 'repeat(3, 1fr)',
//             gap: 28,
//           }}>
//             {FEATURES.map((f, i) => (
//               <div 
//                 key={i} 
//                 className="feature-card"
//                 style={{
//                   borderBottomColor: f.color
//                 }}
//               >
//                 <div 
//                   className="feature-icon-wrap" 
//                   style={{
//                     background: `${f.color}15`,
//                     color: f.color,
//                     boxShadow: `0 8px 24px ${f.color}35`
//                   }}
//                 >
//                   {f.icon}
//                 </div>
//                 <h3 style={{ fontSize: 18, fontWeight: 700, color: '#f8fafc', marginBottom: 12 }}>{f.title}</h3>
//                 <p style={{ fontSize: 14.5, color: '#94a3b8', lineHeight: 1.65 }}>{f.desc}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ══════════════════════════════════════
//           FOOTER
//       ══════════════════════════════════════ */}
//       <footer className="footer-bg" style={{ padding: '64px 40px 40px' }}>
//         <div style={{ maxWidth: 1100, margin: '0 auto' }}>

//           {/* Footer top */}
//           <div style={{
//             display: 'flex', alignItems: 'center', justifyContent: 'space-between',
//             flexWrap: 'wrap', gap: 24, marginBottom: 48,
//             paddingBottom: 40,
//             borderBottom: '1px solid rgba(255,255,255,0.07)',
//           }}>
//             <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
//               <img src="/logo.png" alt="Logo" style={{ height: 44, objectFit: 'contain' }} />
//               <div>
//                 <div style={{
//                   fontWeight: 900, fontSize: 20, letterSpacing: '0.5px',
//                   background: 'linear-gradient(90deg, #a78bfa, #60a5fa)',
//                   WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
//                 }}>MIND CODE</div>
//                 <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: 500, marginTop: 2 }}>
//                   Powered by MindSpark
//                 </div>
//               </div>
//             </div>
//             <div style={{ textAlign: 'right' }}>
//               <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', lineHeight: 1.8 }}>
//                 <div>Practice · Compete · Excel</div>
//                 <div>Built for Engineering Students</div>
//               </div>
//             </div>
//           </div>

//           {/* Copyright */}
//           <div style={{
//             borderTop: '1px solid rgba(255,255,255,0.06)',
//             paddingTop: 28,
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             flexWrap: 'wrap',
//             gap: 8,
//           }}>
//             <span style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.3)' }}>
//               © {new Date().getFullYear()} Mind Code · Powered by MindSpark. All rights reserved.
//             </span>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default HomePage;  


// import React, { useState, useEffect, useRef } from 'react';
// import { Link } from 'react-router-dom';
// import { Github, Phone, Code2, ChevronDown, Zap, Target, Trophy, Users, BookOpen, Star, Terminal } from 'lucide-react';

// const FEATURES = [
//   { icon: <Code2 size={24} />, color: '#3b82f6', title: 'Live Coding',    desc: 'Solve problems in a real-time judge with instant feedback.' },
//   { icon: <Trophy size={24} />, color: '#f5a623', title: 'Competitions',   desc: 'Compete college-wide in timed coding contests.' },
//   { icon: <Target size={24} />, color: '#10b981', title: 'Skill Tracking', desc: 'Track your progress across topics and difficulty levels.' },
//   { icon: <BookOpen size={24} />,color: '#a855f7', title: 'Learning Modules', desc: 'Guided curriculum built for engineering exam prep.' },
//   { icon: <Zap size={24} />,    color: '#ef4444', title: 'Instant Results', desc: 'See your score and detailed test-case output immediately.' },
//   { icon: <Users size={24} />,  color: '#ec4899', title: 'Faculty Tools',  desc: 'Faculty can create, manage, and evaluate assessments.' },
// ];

// const DEVELOPERS = [
//   { initials: 'AG', name: 'Aravindaswamy Gunturu', role: 'Developer 1', github: 'iarvindswamy',      grad: 'linear-gradient(135deg,#7c4dff,#1a73e8)' },
//   { initials: 'PP', name: 'Paara Poojan Sri',      role: 'Developer 2', github: 'parapoojansri-hue', grad: 'linear-gradient(135deg,#10b981,#1a73e8)' },
//   { initials: 'PG', name: 'Pavan Kumar Gade',      role: 'Developer 3', github: 'pavankumargade09', grad: 'linear-gradient(135deg,#f5a623,#ef4444)' },
// ];

// const HomePage = () => {
//   const [scrollY, setScrollY]         = useState(0);
//   const [navSolid, setNavSolid]       = useState(false);
//   const [showDevModal, setShowDevModal] = useState(false);
//   const aboutRef = useRef(null);

//   useEffect(() => {
//     const onScroll = () => {
//       setScrollY(window.scrollY);
//       setNavSolid(window.scrollY > 60);
//     };
//     window.addEventListener('scroll', onScroll, { passive: true });
//     return () => window.removeEventListener('scroll', onScroll);
//   }, []);

//   const scrollToAbout = () => {
//     aboutRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   return (
//     <div style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif", background: '#f8faff', minHeight: '100vh' }}>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

//         *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

//         html { scroll-behavior: smooth; }

//         @keyframes fadeUp {
//           from { opacity: 0; transform: translateY(28px); }
//           to   { opacity: 1; transform: translateY(0); }
//         }
//         @keyframes fadeIn {
//           from { opacity: 0; }
//           to   { opacity: 1; }
//         }
//         @keyframes gradientShift {
//           0%   { background-position: 0% 50%; }
//           50%  { background-position: 100% 50%; }
//           100% { background-position: 0% 50%; }
//         }
//         @keyframes kenBurns {
//           from { transform: scale(1); }
//           to   { transform: scale(1.06); }
//         }
//         @keyframes floatUp {
//           0%, 100% { transform: translateY(0px); }
//           50%       { transform: translateY(-8px); }
//         }
//         @keyframes pulse-ring {
//           0%   { box-shadow: 0 0 0 0 rgba(124, 77, 255, 0.35); }
//           70%  { box-shadow: 0 0 0 14px rgba(124, 77, 255, 0); }
//           100% { box-shadow: 0 0 0 0 rgba(124, 77, 255, 0); }
//         }
//         @keyframes terminal-pulse {
//           0%   { box-shadow: 0 0 0 0 rgba(255, 161, 22, 0.35); }
//           70%  { box-shadow: 0 0 0 10px rgba(255, 161, 22, 0); }
//           100% { box-shadow: 0 0 0 0 rgba(255, 161, 22, 0); }
//         }
//         @keyframes shimmer {
//           0%   { background-position: -200% center; }
//           100% { background-position: 200% center; }
//         }
//         @keyframes spin-slow {
//           from { transform: rotate(0deg); }
//           to   { transform: rotate(360deg); }
//         }

//         .mc-nav {
//           position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
//           display: flex; align-items: center; justify-content: space-between;
//           padding: 0 40px; height: 72px;
//           transition: background 0.35s ease, box-shadow 0.35s ease, backdrop-filter 0.35s ease;
//         }
//         .mc-nav.solid {
//           background: rgba(255, 255, 255, 0.95);
//           backdrop-filter: blur(20px);
//           box-shadow: 0 2px 20px rgba(0, 0, 0, 0.08);
//         }
//         .mc-nav.transparent {
//           background: linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, transparent 100%);
//         }

//         .faculty-btn {
//           padding: 9px 22px;
//           border-radius: 40px;
//           border: 1.5px solid rgba(255,255,255,0.7);
//           background: rgba(255,255,255,0.12);
//           backdrop-filter: blur(8px);
//           color: #fff;
//           font-size: 13.5px;
//           font-weight: 600;
//           text-decoration: none;
//           letter-spacing: 0.3px;
//           transition: all 0.25s ease;
//         }
//         .faculty-btn:hover {
//           background: rgba(255,255,255,0.28);
//           border-color: #fff;
//           transform: translateY(-1px);
//           box-shadow: 0 6px 20px rgba(0,0,0,0.18);
//         }
//         .faculty-btn.dark {
//           border-color: rgba(124,77,255,0.5);
//           background: transparent;
//           color: #7c4dff;
//         }
//         .faculty-btn.dark:hover {
//           background: linear-gradient(135deg, #7c4dff, #1a73e8);
//           color: #fff;
//           border-color: transparent;
//           box-shadow: 0 6px 20px rgba(124,77,255,0.3);
//         }

//         .hero-bg {
//           position: absolute; inset: 0;
//           width: 100%; height: 100%;
//           object-fit: cover; object-position: center;
//           animation: kenBurns 12s ease forwards;
//         }
//         .hero-badge {
//           display: inline-flex; align-items: center; gap: 8px;
//           padding: 6px 18px;
//           border-radius: 40px;
//           background: rgba(255,255,255,0.12);
//           border: 1px solid rgba(255,255,255,0.3);
//           backdrop-filter: blur(10px);
//           color: #e0e7ff;
//           font-size: 12.5px;
//           font-weight: 600;
//           letter-spacing: 0.5px;
//           margin-bottom: 24px;
//           animation: fadeUp 0.6s ease 0.1s both;
//         }
//         .hero-title {
//           font-size: clamp(48px, 7vw, 88px);
//           font-weight: 900;
//           line-height: 1;
//           letter-spacing: -0.03em;
//           background: linear-gradient(135deg, #ffffff 0%, #c4d4ff 50%, #a78bfa 100%);
//           background-size: 200% 200%;
//           -webkit-background-clip: text;
//           -webkit-text-fill-color: transparent;
//           background-clip: text;
//           color: transparent;
//           animation: fadeUp 0.6s ease 0.25s both, gradientShift 5s ease infinite;
//         }
//         .hero-sub {
//           font-size: clamp(16px, 2vw, 20px);
//           color: rgba(255,255,255,0.78);
//           font-weight: 400;
//           line-height: 1.6;
//           max-width: 540px;
//           margin: 20px auto 0;
//           animation: fadeUp 0.6s ease 0.4s both;
//         }
//         .hero-cta-wrap {
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           gap: 16px;
//           margin-top: 40px;
//           flex-wrap: wrap;
//           animation: fadeUp 0.6s ease 0.55s both;
//         }
//         .btn-primary {
//           display: inline-flex; align-items: center; gap: 8px;
//           padding: 15px 36px;
//           border-radius: 50px;
//           background: linear-gradient(135deg, #7c4dff, #1a73e8);
//           color: #fff;
//           font-size: 15px;
//           font-weight: 700;
//           text-decoration: none;
//           letter-spacing: 0.3px;
//           box-shadow: 0 8px 30px rgba(124,77,255,0.5);
//           transition: all 0.25s ease;
//           animation: pulse-ring 2.5s ease infinite;
//         }
//         .btn-primary:hover {
//           transform: translateY(-3px);
//           box-shadow: 0 14px 40px rgba(124,77,255,0.6);
//           background: linear-gradient(135deg, #6a2fff, #1565c0);
//         }
//         .btn-terminal {
//           display: inline-flex; align-items: center; gap: 8px;
//           padding: 14px 28px;
//           border-radius: 50px;
//           border: 1.5px solid rgba(255, 161, 22, 0.6);
//           background: rgba(255, 161, 22, 0.1);
//           backdrop-filter: blur(10px);
//           color: #ffa116;
//           font-size: 15px;
//           font-weight: 700;
//           text-decoration: none;
//           letter-spacing: 0.3px;
//           transition: all 0.25s ease;
//           animation: terminal-pulse 3s ease infinite;
//         }
//         .btn-terminal:hover {
//           background: rgba(255, 161, 22, 0.22);
//           border-color: #ffa116;
//           transform: translateY(-2px);
//           box-shadow: 0 10px 28px rgba(255, 161, 22, 0.35);
//           color: #ffb733;
//         }
//         .btn-ghost {
//           display: inline-flex; align-items: center; gap: 8px;
//           padding: 14px 30px;
//           border-radius: 50px;
//           border: 1.5px solid rgba(255,255,255,0.4);
//           background: rgba(255,255,255,0.1);
//           backdrop-filter: blur(10px);
//           color: #fff;
//           font-size: 15px;
//           font-weight: 600;
//           text-decoration: none;
//           letter-spacing: 0.3px;
//           transition: all 0.25s ease;
//           cursor: pointer;
//         }
//         .btn-ghost:hover {
//           background: rgba(255,255,255,0.2);
//           border-color: rgba(255,255,255,0.7);
//           transform: translateY(-2px);
//         }
//         .scroll-indicator {
//           animation: floatUp 2s ease-in-out infinite;
//           cursor: pointer;
//         }

//         .info-card {
//           background: #fff;
//           border-radius: 20px;
//           padding: 48px;
//           box-shadow: 0 4px 40px rgba(0,0,0,0.07);
//           transition: transform 0.3s ease, box-shadow 0.3s ease;
//         }
//         .info-card:hover {
//           transform: translateY(-4px);
//           box-shadow: 0 12px 50px rgba(0,0,0,0.12);
//         }

//         .feature-card {
//           background: #0f172a;
//           border-radius: 16px;
//           padding: 36px 30px;
//           box-shadow: 0 10px 30px rgba(0,0,0,0.25);
//           border: 1px solid rgba(255,255,255,0.06);
//           border-bottom: 4px solid transparent;
//           transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
//           position: relative;
//           overflow: hidden;
//           z-index: 1;
//         }
//         .feature-card::before {
//           content: '';
//           position: absolute; inset: 0; z-index: -1;
//           background: radial-gradient(400px circle at 50% 0%, rgba(255,255,255,0.04), transparent 60%);
//           opacity: 0; transition: opacity 0.4s ease;
//         }
//         .feature-card:hover {
//           transform: translateY(-8px);
//           background: #1e293b;
//           box-shadow: 0 20px 40px rgba(0,0,0,0.4);
//         }
//         .feature-card:hover::before { opacity: 1; }

//         .feature-icon-wrap {
//           width: 56px; height: 56px;
//           border-radius: 14px;
//           display: flex; align-items: center; justify-content: center;
//           margin-bottom: 24px;
//           transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease;
//         }
//         .feature-card:hover .feature-icon-wrap {
//           transform: scale(1.1) translateY(-3px);
//         }

//         .section-label {
//           display: inline-block;
//           font-size: 11px;
//           font-weight: 700;
//           letter-spacing: 0.4em;
//           text-transform: uppercase;
//           background: linear-gradient(90deg, #7c4dff, #1a73e8);
//           -webkit-background-clip: text;
//           -webkit-text-fill-color: transparent;
//           background-clip: text;
//           color: transparent;
//           margin-bottom: 12px;
//         }
//         .section-title {
//           font-size: clamp(28px, 4vw, 40px);
//           font-weight: 800;
//           color: #0f172a;
//           line-height: 1.15;
//           letter-spacing: -0.02em;
//         }
//         .grad-text {
//           background: linear-gradient(135deg, #7c4dff, #1a73e8);
//           -webkit-background-clip: text;
//           -webkit-text-fill-color: transparent;
//           background-clip: text;
//           color: transparent;
//         }

//         @keyframes colorPulse {
//           0% { color: #1a73e8; }
//           33% { color: #7c4dff; }
//           66% { color: #ec4899; }
//           100% { color: #1a73e8; }
//         }
//         @keyframes subColorPulse {
//           0% { color: #f5a623; }
//           50% { color: #ef4444; }
//           100% { color: #f5a623; }
//         }
//         .anim-title {
//           font-weight: 900;
//           font-size: 22px;
//           letter-spacing: 0.5px;
//           animation: colorPulse 4s ease-in-out infinite;
//         }
//         .anim-sub {
//           font-size: 11px;
//           font-weight: 700;
//           letter-spacing: 0.5px;
//           animation: subColorPulse 3s ease-in-out infinite;
//           margin-top: 2px;
//         }
//         .white-brand-pill {
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           line-height: 1.1;
//           background: #ffffff;
//           padding: 8px 20px 10px;
//           border-radius: 12px;
//           box-shadow: 0 4px 20px rgba(0,0,0,0.15);
//           transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
//           cursor: default;
//         }
//         .white-brand-pill:hover {
//           transform: translateY(-2px) scale(1.02);
//           box-shadow: 0 8px 25px rgba(0,0,0,0.2);
//         }

//         .logo-glow {
//           animation: floatUp 4s ease-in-out infinite;
//           filter: drop-shadow(0 12px 30px rgba(124,77,255,0.35));
//         }

//         .stat-pill {
//           display: flex; flex-direction: column; align-items: center;
//           padding: 20px 32px;
//           background: #fff;
//           border-radius: 16px;
//           box-shadow: 0 4px 24px rgba(0,0,0,0.06);
//         }

//         .footer-bg {
//           background: linear-gradient(135deg, #080d1e 0%, #0d1635 50%, #0a0e20 100%);
//         }

//         /* ── Footer logo hover ── */
//         .footer-logo-btn {
//           cursor: pointer;
//           transition: transform 0.25s ease, filter 0.25s ease;
//           border: none; background: transparent; padding: 0;
//         }
//         .footer-logo-btn:hover {
//           transform: scale(1.08);
//           filter: drop-shadow(0 0 12px rgba(124,77,255,0.6));
//         }

//         /* ── Dev Modal ── */
//         .dev-modal-overlay {
//           position: fixed; inset: 0; z-index: 9999;
//           background: rgba(5,8,22,0.80);
//           display: flex; align-items: center; justify-content: center;
//           animation: fadeIn 0.2s ease;
//         }
//         .dev-modal {
//           background: #fff;
//           border-radius: 20px;
//           padding: 40px 36px;
//           max-width: 480px; width: 90%;
//           position: relative;
//           animation: fadeUp 0.3s ease;
//           box-shadow: 0 24px 60px rgba(0,0,0,0.4);
//         }
//         .dev-close-btn {
//           position: absolute; top: 16px; right: 16px;
//           width: 32px; height: 32px; border-radius: 50%;
//           border: 1px solid #e2e8f0; background: #f8fafc;
//           cursor: pointer; font-size: 15px; color: #64748b;
//           display: flex; align-items: center; justify-content: center;
//           transition: background 0.2s ease;
//         }
//         .dev-close-btn:hover { background: #f1f5f9; }
//         .dev-card-row {
//           display: flex; align-items: center; gap: 16px;
//           padding: 16px 0;
//         }
//         .dev-avatar {
//           width: 48px; height: 48px; border-radius: 50%;
//           display: flex; align-items: center; justify-content: center;
//           color: #fff; font-weight: 700; font-size: 15px; flex-shrink: 0;
//         }
//         .dev-gh-link {
//           display: inline-flex; align-items: center; gap: 5px;
//           font-size: 12px; font-weight: 600; color: #7c4dff;
//           padding: 3px 10px; border-radius: 20px;
//           background: rgba(124,77,255,0.08);
//           text-decoration: none;
//           transition: background 0.2s ease;
//         }
//         .dev-gh-link:hover { background: rgba(124,77,255,0.18); }

//         @media (max-width: 768px) {
//           .mc-nav { padding: 0 20px; }
//           .info-grid { flex-direction: column !important; }
//           .feature-grid { grid-template-columns: 1fr 1fr !important; }
//           .dev-row { flex-direction: column !important; }
//           .stat-row { flex-direction: column !important; }
//         }
//         @media (max-width: 500px) {
//           .feature-grid { grid-template-columns: 1fr !important; }
//         }
//       `}</style>

//       {/* ══════════════════════════════════════
//           NAVBAR
//       ══════════════════════════════════════ */}
//       <nav className={`mc-nav ${navSolid ? 'solid' : 'transparent'}`}>
//         <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
//           <img
//             src="/logo.png"
//             alt="MindSpark Logo"
//             style={{ height: 42, width: 'auto', objectFit: 'contain', filter: navSolid ? 'none' : 'brightness(1.2)' }}
//           />
//         </div>

//         <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
//           <div className="white-brand-pill" style={{ opacity: navSolid ? 1 : 0.95 }}>
//             <span className="anim-title">MIND CODE</span>
//             <span className="anim-sub">Powered by MindSpark</span>
//           </div>
//         </div>

//         <Link
//           to="/faculty-login"
//           id="faculty-login-btn"
//           className={`faculty-btn ${navSolid ? 'dark' : ''}`}
//         >
//           Faculty Login
//         </Link>
//       </nav>

//       {/* ══════════════════════════════════════
//           HERO
//       ══════════════════════════════════════ */}
//       <section style={{
//         position: 'relative',
//         height: '100vh',
//         minHeight: 600,
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         justifyContent: 'center',
//         textAlign: 'center',
//         overflow: 'hidden',
//       }}>
//         <img src="/cover.png" alt="MindCode Cover" className="hero-bg" />

//         <div style={{
//           position: 'absolute', inset: 0, zIndex: 1,
//           background: 'linear-gradient(to bottom, rgba(5,8,22,0.62) 0%, rgba(5,8,22,0.45) 50%, rgba(5,8,22,0.80) 100%)',
//         }} />

//         <div style={{ position: 'relative', zIndex: 2, padding: '0 24px', maxWidth: 800, width: '100%' }}>
//           <div className="hero-badge">
//             <Star size={13} style={{ color: '#f5a623' }} />
//             <span> Powered by MindSpark </span>
//           </div>

//           <h1 className="hero-title">Mind Code</h1>

//           <p className="hero-sub">
//             The Ultimate Coding Platform for Engineering Students. Practice, Compete, and Excel in Programming Contests and Academic Assessments — All in One Place.
//           </p>

//           <div className="hero-cta-wrap">
//             <Link to="/login" id="student-login-hero-btn" className="btn-primary">
//               Student Login
//             </Link>

//             <Link to="/sandbox" className="btn-terminal">
//               <Terminal size={16} />
//               Practice
//             </Link>

//             <button className="btn-ghost" onClick={scrollToAbout}>
//               Learn More
//               <ChevronDown size={16} />
//             </button>
//           </div>
//         </div>

//         <div
//           className="scroll-indicator"
//           onClick={scrollToAbout}
//           style={{
//             position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)',
//             zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
//             color: 'rgba(255,255,255,0.55)', fontSize: 11, fontWeight: 500, letterSpacing: '0.2em',
//             cursor: 'pointer',
//           }}
//         >
//           <span>SCROLL</span>
//           <ChevronDown size={18} />
//         </div>
//       </section>

//       {/* ══════════════════════════════════════
//           STATS BAR
//       ══════════════════════════════════════ */}
//       <div style={{
//         background: 'linear-gradient(135deg, #7c4dff, #1a73e8)',
//         padding: '28px 40px',
//       }}>
//         <div className="stat-row" style={{
//           maxWidth: 900, margin: '0 auto',
//           display: 'flex', alignItems: 'center', justifyContent: 'space-around',
//           gap: 24, flexWrap: 'wrap',
//         }}>
//           {[
//             { value: '10,000+', label: 'Problems Solved' },
//             { value: '500+',    label: 'Students Active' },
//             { value: '50+',     label: 'College Contests' },
//             { value: '98%',     label: 'Satisfaction Rate' },
//           ].map((s, i) => (
//             <div key={i} style={{ textAlign: 'center', color: '#fff' }}>
//               <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: '-0.02em' }}>{s.value}</div>
//               <div style={{ fontSize: 12, fontWeight: 500, opacity: 0.75, letterSpacing: '0.05em', marginTop: 4 }}>{s.label}</div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* ══════════════════════════════════════
//           INFO SECTION
//       ══════════════════════════════════════ */}
//       <section ref={aboutRef} style={{ padding: '96px 40px', background: '#f0f4ff' }}>
//         <div className="info-grid" style={{
//           maxWidth: 1100, margin: '0 auto',
//           display: 'flex', gap: 32, alignItems: 'stretch',
//         }}>
//           <div className="info-card" style={{ flex: 1.4 }}>
//             <span className="section-label">About Mind Code</span>
//             <h2 className="section-title" style={{ marginBottom: 20 }}>
//               Code Smarter. <span className="grad-text">Compete Better.</span>
//             </h2>
//             <p style={{ color: '#475569', lineHeight: 1.8, fontSize: 15.5, marginBottom: 16 }}>
//               <strong style={{ color: '#0f172a' }}>Mind Code</strong> is MindSpark's flagship platform
//               designed to transform the way engineering students learn and practice programming.
//               With a powerful in-browser code editor, automated test cases, and a real-time leaderboard —
//               it's everything you need to go from beginner to competition-ready.
//             </p>
//             <p style={{ color: '#64748b', lineHeight: 1.8, fontSize: 14.5, marginBottom: 36 }}>
//               Faculty can design and launch assessments, track student performance, and create structured
//               learning modules — all within a single, unified dashboard.
//             </p>

//             <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
//               <Link
//                 to="/login"
//                 id="student-login-info-btn"
//                 style={{
//                   display: 'inline-flex', alignItems: 'center', gap: 8,
//                   padding: '13px 32px',
//                   borderRadius: 50,
//                   background: 'linear-gradient(135deg, #7c4dff, #1a73e8)',
//                   color: '#fff',
//                   fontWeight: 700, fontSize: 14.5,
//                   textDecoration: 'none',
//                   boxShadow: '0 6px 24px rgba(124,77,255,0.35)',
//                   transition: 'all 0.25s ease',
//                 }}
//                 onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(124,77,255,0.5)'; }}
//                 onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 6px 24px rgba(124,77,255,0.35)'; }}
//               >
//                 Student Login
//               </Link>
//               <a
//                 href="#features"
//                 style={{
//                   display: 'inline-flex', alignItems: 'center', gap: 8,
//                   padding: '12px 28px',
//                   borderRadius: 50,
//                   border: '1.5px solid rgba(124,77,255,0.35)',
//                   color: '#7c4dff',
//                   fontWeight: 600, fontSize: 14.5,
//                   textDecoration: 'none',
//                   transition: 'all 0.25s ease',
//                   background: 'transparent',
//                 }}
//                 onMouseEnter={e => { e.currentTarget.style.background = 'rgba(124,77,255,0.06)'; }}
//                 onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
//               >
//                 Explore Features
//               </a>
//             </div>
//           </div>

//           <div className="info-card" style={{
//             flex: 0.8, display: 'flex', flexDirection: 'column',
//             alignItems: 'center', justifyContent: 'center',
//             background: 'linear-gradient(135deg, #0f172a 0%, #1a1040 50%, #0f172a 100%)',
//             padding: '56px 40px', gap: 24,
//           }}>
//             <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 180, height: 180 }}>
//               <div style={{
//                 position: 'absolute', inset: 0,
//                 borderRadius: '50%',
//                 border: '2px dashed rgba(124,77,255,0.3)',
//                 animation: 'spin-slow 18s linear infinite',
//               }} />
//               <div style={{
//                 position: 'absolute', inset: 10,
//                 borderRadius: '50%',
//                 border: '1.5px dashed rgba(26,115,232,0.2)',
//                 animation: 'spin-slow 12s linear infinite reverse',
//               }} />
//               <div className="logo-glow">
//                 <img
//                   src="/logo.png"
//                   alt="MindSpark Logo"
//                   style={{ width: 110, height: 110, objectFit: 'contain' }}
//                 />
//               </div>
//             </div>

//             <div className="white-brand-pill" style={{ marginTop: 16 }}>
//               <span className="anim-title" style={{ fontSize: 24 }}>MIND CODE</span>
//               <span className="anim-sub" style={{ fontSize: 12 }}>Powered by MindSpark</span>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* ══════════════════════════════════════
//           FEATURES SECTION
//       ══════════════════════════════════════ */}
//       <section id="features" style={{ padding: '96px 40px', background: '#050810' }}>
//         <div style={{ maxWidth: 1100, margin: '0 auto' }}>
//           <div style={{ textAlign: 'center', marginBottom: 64 }}>
//             <span className="section-label">What We Offer</span>
//             <h2 className="section-title" style={{ color: '#fff' }}>
//               Everything You Need to <span className="grad-text">Excel</span>
//             </h2>
//             <p style={{ color: '#94a3b8', marginTop: 16, fontSize: 16, maxWidth: 540, margin: '16px auto 0' }}>
//               A complete ecosystem for coding practice, competitive programming, and academic assessments.
//             </p>
//           </div>

//           <div className="feature-grid" style={{
//             display: 'grid',
//             gridTemplateColumns: 'repeat(3, 1fr)',
//             gap: 28,
//           }}>
//             {FEATURES.map((f, i) => (
//               <div
//                 key={i}
//                 className="feature-card"
//                 style={{ borderBottomColor: f.color }}
//               >
//                 <div
//                   className="feature-icon-wrap"
//                   style={{
//                     background: `${f.color}15`,
//                     color: f.color,
//                     boxShadow: `0 8px 24px ${f.color}35`,
//                   }}
//                 >
//                   {f.icon}
//                 </div>
//                 <h3 style={{ fontSize: 18, fontWeight: 700, color: '#f8fafc', marginBottom: 12 }}>{f.title}</h3>
//                 <p style={{ fontSize: 14.5, color: '#94a3b8', lineHeight: 1.65 }}>{f.desc}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ══════════════════════════════════════
//           FOOTER
//       ══════════════════════════════════════ */}
//       <footer className="footer-bg" style={{ padding: '64px 40px 40px' }}>
//         <div style={{ maxWidth: 1100, margin: '0 auto' }}>

//           <div style={{
//             display: 'flex', alignItems: 'center', justifyContent: 'space-between',
//             flexWrap: 'wrap', gap: 24, marginBottom: 48,
//             paddingBottom: 40,
//             borderBottom: '1px solid rgba(255,255,255,0.07)',
//           }}>
//             <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>

//               {/* ── Footer logo — click to show developer modal ── */}
//               <button
//                 className="footer-logo-btn"
//                 onClick={() => setShowDevModal(true)}
//                 title="Meet the developers"
//               >
//                 <img src="/logo.png" alt="MindSpark Logo" style={{ height: 44, objectFit: 'contain' }} />
//               </button>

//               <div>
//                 <div style={{
//                   fontWeight: 900, fontSize: 20, letterSpacing: '0.5px',
//                   background: 'linear-gradient(90deg, #a78bfa, #60a5fa)',
//                   WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
//                 }}>MIND CODE</div>
//                 <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: 500, marginTop: 2 }}>
//                   Powered by MindSpark
//                 </div>
//               </div>
//             </div>

//             <div style={{ textAlign: 'right' }}>
//               <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', lineHeight: 1.8 }}>
//                 <div>Practice · Compete · Excel</div>
//                 <div>Built for Engineering Students</div>
//               </div>
//             </div>
//           </div>

//           <div style={{
//             borderTop: '1px solid rgba(255,255,255,0.06)',
//             paddingTop: 28,
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             flexWrap: 'wrap',
//             gap: 8,
//           }}>
//             <span style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.3)' }}>
//               © {new Date().getFullYear()} Mind Code · Powered by MindSpark. All rights reserved.
//             </span>
//           </div>
//         </div>
//       </footer>

//       {/* ══════════════════════════════════════
//           DEVELOPER MODAL (footer logo click)
//       ══════════════════════════════════════ */}
//       {showDevModal && (
//         <div
//           className="dev-modal-overlay"
//           onClick={() => setShowDevModal(false)}
//         >
//           <div
//             className="dev-modal"
//             onClick={e => e.stopPropagation()}
//           >
//             <button
//               className="dev-close-btn"
//               onClick={() => setShowDevModal(false)}
//             >✕</button>

//             <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.4em', textTransform: 'uppercase', color: '#7c4dff', marginBottom: 4 }}>
//               Our Team
//             </div>
//             <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', marginBottom: 28 }}>
//               Meet the Developers
//             </h2>

//             {DEVELOPERS.map((dev, i) => (
//               <div
//                 key={i}
//                 className="dev-card-row"
//                 style={{ borderBottom: i < DEVELOPERS.length - 1 ? '1px solid #f1f5f9' : 'none' }}
//               >
//                 <div className="dev-avatar" style={{ background: dev.grad }}>
//                   {dev.initials}
//                 </div>
//                 <div>
//                   <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 2 }}>
//                     {dev.name}
//                   </div>
//                   <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 8 }}>
//                     {dev.role}
//                   </div>
//                   <a
//                     className="dev-gh-link"
//                     href={`https://github.com/${dev.github}`}
//                     target="_blank"
//                     rel="noreferrer"
//                   >
//                     <Github size={12} />
//                     {dev.github}
//                   </a>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//     </div>
//   );
// };

// export default HomePage;























import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Github, Phone, Code2, ChevronDown, Zap, Target, Trophy, Users, BookOpen, Star, Terminal } from 'lucide-react';

const FEATURES = [
  { icon: <Code2 size={24} />, color: '#3b82f6', title: 'Live Coding',    desc: 'Solve problems in a real-time judge with instant feedback.' },
  { icon: <Trophy size={24} />, color: '#f5a623', title: 'Competitions',   desc: 'Compete college-wide in timed coding contests.' },
  { icon: <Target size={24} />, color: '#10b981', title: 'Skill Tracking', desc: 'Track your progress across topics and difficulty levels.' },
  { icon: <BookOpen size={24} />,color: '#a855f7', title: 'Learning Modules', desc: 'Guided curriculum built for engineering exam prep.' },
  { icon: <Zap size={24} />,    color: '#ef4444', title: 'Instant Results', desc: 'See your score and detailed test-case output immediately.' },
  { icon: <Users size={24} />,  color: '#ec4899', title: 'Faculty Tools',  desc: 'Faculty can create, manage, and evaluate assessments.' },
];

const DEVELOPERS = [
  { initials: 'AG', name: 'Aravindaswamy Gunturu', role: 'Developer 1', github: 'iarvindswamy',      grad: 'linear-gradient(135deg,#7c4dff,#1a73e8)' },
  { initials: 'PP', name: 'Paara Poojan Sri',      role: 'Developer 2', github: 'parapoojansri-hue', grad: 'linear-gradient(135deg,#10b981,#1a73e8)' },
  { initials: 'PG', name: 'Pavan Kumar Gade',      role: 'Developer 3', github: 'pavankumargade09', grad: 'linear-gradient(135deg,#f5a623,#ef4444)' },
];

const HomePage = () => {
  const [scrollY, setScrollY]         = useState(0);
  const [navSolid, setNavSolid]       = useState(false);
  const [showDevModal, setShowDevModal] = useState(false);
  const aboutRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      setScrollY(window.scrollY);
      setNavSolid(window.scrollY > 60);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToAbout = () => {
    aboutRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif", background: '#f8faff', minHeight: '100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        html { scroll-behavior: smooth; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes gradientShift {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes kenBurns {
          from { transform: scale(1); }
          to   { transform: scale(1.06); }
        }
        @keyframes floatUp {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-8px); }
        }
        @keyframes pulse-ring {
          0%   { box-shadow: 0 0 0 0 rgba(124, 77, 255, 0.35); }
          70%  { box-shadow: 0 0 0 14px rgba(124, 77, 255, 0); }
          100% { box-shadow: 0 0 0 0 rgba(124, 77, 255, 0); }
        }
        @keyframes terminal-pulse {
          0%   { box-shadow: 0 0 0 0 rgba(255, 161, 22, 0.35); }
          70%  { box-shadow: 0 0 0 10px rgba(255, 161, 22, 0); }
          100% { box-shadow: 0 0 0 0 rgba(255, 161, 22, 0); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }

        .mc-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 40px; height: 72px;
          transition: background 0.35s ease, box-shadow 0.35s ease, backdrop-filter 0.35s ease;
        }
        .mc-nav.solid {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          box-shadow: 0 2px 20px rgba(0, 0, 0, 0.08);
        }
        .mc-nav.transparent {
          background: linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, transparent 100%);
        }

        .faculty-btn {
          padding: 9px 22px;
          border-radius: 40px;
          border: 1.5px solid rgba(255,255,255,0.7);
          background: rgba(255,255,255,0.12);
          backdrop-filter: blur(8px);
          color: #fff;
          font-size: 13.5px;
          font-weight: 600;
          text-decoration: none;
          letter-spacing: 0.3px;
          transition: all 0.25s ease;
        }
        .faculty-btn:hover {
          background: rgba(255,255,255,0.28);
          border-color: #fff;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(0,0,0,0.18);
        }
        .faculty-btn.dark {
          border-color: rgba(124,77,255,0.5);
          background: transparent;
          color: #7c4dff;
        }
        .faculty-btn.dark:hover {
          background: linear-gradient(135deg, #7c4dff, #1a73e8);
          color: #fff;
          border-color: transparent;
          box-shadow: 0 6px 20px rgba(124,77,255,0.3);
        }

        .hero-bg {
          position: absolute; inset: 0;
          width: 100%; height: 100%;
          object-fit: cover; object-position: center;
          animation: kenBurns 12s ease forwards;
        }
        .hero-badge {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 6px 18px;
          border-radius: 40px;
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.3);
          backdrop-filter: blur(10px);
          color: #e0e7ff;
          font-size: 12.5px;
          font-weight: 600;
          letter-spacing: 0.5px;
          margin-bottom: 24px;
          animation: fadeUp 0.6s ease 0.1s both;
        }
        .hero-title {
          font-size: clamp(48px, 7vw, 88px);
          font-weight: 900;
          line-height: 1;
          letter-spacing: -0.03em;
          background: linear-gradient(135deg, #ffffff 0%, #c4d4ff 50%, #a78bfa 100%);
          background-size: 200% 200%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          color: transparent;
          animation: fadeUp 0.6s ease 0.25s both, gradientShift 5s ease infinite;
        }
        .hero-sub {
          font-size: clamp(16px, 2vw, 20px);
          color: rgba(255,255,255,0.78);
          font-weight: 400;
          line-height: 1.6;
          max-width: 540px;
          margin: 20px auto 0;
          animation: fadeUp 0.6s ease 0.4s both;
        }
        .hero-cta-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          margin-top: 40px;
          flex-wrap: wrap;
          animation: fadeUp 0.6s ease 0.55s both;
        }
        .btn-primary {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 15px 36px;
          border-radius: 50px;
          background: linear-gradient(135deg, #7c4dff, #1a73e8);
          color: #fff;
          font-size: 15px;
          font-weight: 700;
          text-decoration: none;
          letter-spacing: 0.3px;
          box-shadow: 0 8px 30px rgba(124,77,255,0.5);
          transition: all 0.25s ease;
          animation: pulse-ring 2.5s ease infinite;
        }
        .btn-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 14px 40px rgba(124,77,255,0.6);
          background: linear-gradient(135deg, #6a2fff, #1565c0);
        }
        .btn-terminal {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 14px 28px;
          border-radius: 50px;
          border: 1.5px solid rgba(255, 161, 22, 0.6);
          background: rgba(255, 161, 22, 0.1);
          backdrop-filter: blur(10px);
          color: #ffa116;
          font-size: 15px;
          font-weight: 700;
          text-decoration: none;
          letter-spacing: 0.3px;
          transition: all 0.25s ease;
          animation: terminal-pulse 3s ease infinite;
        }
        .btn-terminal:hover {
          background: rgba(255, 161, 22, 0.22);
          border-color: #ffa116;
          transform: translateY(-2px);
          box-shadow: 0 10px 28px rgba(255, 161, 22, 0.35);
          color: #ffb733;
        }
        .btn-ghost {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 14px 30px;
          border-radius: 50px;
          border: 1.5px solid rgba(255,255,255,0.4);
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(10px);
          color: #fff;
          font-size: 15px;
          font-weight: 600;
          text-decoration: none;
          letter-spacing: 0.3px;
          transition: all 0.25s ease;
          cursor: pointer;
        }
        .btn-ghost:hover {
          background: rgba(255,255,255,0.2);
          border-color: rgba(255,255,255,0.7);
          transform: translateY(-2px);
        }
        .scroll-indicator {
          animation: floatUp 2s ease-in-out infinite;
          cursor: pointer;
        }

        .info-card {
          background: #fff;
          border-radius: 20px;
          padding: 48px;
          box-shadow: 0 4px 40px rgba(0,0,0,0.07);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .info-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 50px rgba(0,0,0,0.12);
        }

        .feature-card {
          background: #0f172a;
          border-radius: 16px;
          padding: 36px 30px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.25);
          border: 1px solid rgba(255,255,255,0.06);
          border-bottom: 4px solid transparent;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          z-index: 1;
        }
        .feature-card::before {
          content: '';
          position: absolute; inset: 0; z-index: -1;
          background: radial-gradient(400px circle at 50% 0%, rgba(255,255,255,0.04), transparent 60%);
          opacity: 0; transition: opacity 0.4s ease;
        }
        .feature-card:hover {
          transform: translateY(-8px);
          background: #1e293b;
          box-shadow: 0 20px 40px rgba(0,0,0,0.4);
        }
        .feature-card:hover::before { opacity: 1; }

        .feature-icon-wrap {
          width: 56px; height: 56px;
          border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 24px;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease;
        }
        .feature-card:hover .feature-icon-wrap {
          transform: scale(1.1) translateY(-3px);
        }

        .section-label {
          display: inline-block;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.4em;
          text-transform: uppercase;
          background: linear-gradient(90deg, #7c4dff, #1a73e8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          color: transparent;
          margin-bottom: 12px;
        }
        .section-title {
          font-size: clamp(28px, 4vw, 40px);
          font-weight: 800;
          color: #0f172a;
          line-height: 1.15;
          letter-spacing: -0.02em;
        }
        .grad-text {
          background: linear-gradient(135deg, #7c4dff, #1a73e8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          color: transparent;
        }

        @keyframes colorPulse {
          0% { color: #1a73e8; }
          33% { color: #7c4dff; }
          66% { color: #ec4899; }
          100% { color: #1a73e8; }
        }
        @keyframes subColorPulse {
          0% { color: #f5a623; }
          50% { color: #ef4444; }
          100% { color: #f5a623; }
        }
        .anim-title {
          font-weight: 900;
          font-size: 22px;
          letter-spacing: 0.5px;
          animation: colorPulse 4s ease-in-out infinite;
        }
        .anim-sub {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.5px;
          animation: subColorPulse 3s ease-in-out infinite;
          margin-top: 2px;
        }
        .white-brand-pill {
          display: flex;
          flex-direction: column;
          align-items: center;
          line-height: 1.1;
          background: #ffffff;
          padding: 8px 20px 10px;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: default;
        }
        .white-brand-pill:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 8px 25px rgba(0,0,0,0.2);
        }

        .logo-glow {
          animation: floatUp 4s ease-in-out infinite;
          filter: drop-shadow(0 12px 30px rgba(124,77,255,0.35));
        }

        .stat-pill {
          display: flex; flex-direction: column; align-items: center;
          padding: 20px 32px;
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.06);
        }

        .footer-bg {
          background: linear-gradient(135deg, #080d1e 0%, #0d1635 50%, #0a0e20 100%);
        }

        /* ── Footer logo hover ── */
        .footer-logo-btn {
          cursor: pointer;
          transition: transform 0.25s ease, filter 0.25s ease;
          border: none; background: transparent; padding: 0;
        }
        .footer-logo-btn:hover {
          transform: scale(1.08);
          filter: drop-shadow(0 0 12px rgba(124,77,255,0.6));
        }

        /* ── Dev Modal ── */
        .dev-modal-overlay {
          position: fixed; inset: 0; z-index: 9999;
          background: rgba(5,8,22,0.80);
          display: flex; align-items: center; justify-content: center;
          animation: fadeIn 0.2s ease;
        }
        .dev-modal {
          background: #fff;
          border-radius: 20px;
          padding: 40px 36px;
          max-width: 480px; width: 90%;
          position: relative;
          animation: fadeUp 0.3s ease;
          box-shadow: 0 24px 60px rgba(0,0,0,0.4);
        }
        .dev-close-btn {
          position: absolute; top: 16px; right: 16px;
          width: 32px; height: 32px; border-radius: 50%;
          border: 1px solid #e2e8f0; background: #f8fafc;
          cursor: pointer; font-size: 15px; color: #64748b;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.2s ease;
        }
        .dev-close-btn:hover { background: #f1f5f9; }
        .dev-card-row {
          display: flex; align-items: center; gap: 16px;
          padding: 16px 0;
        }
        .dev-avatar {
          width: 48px; height: 48px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          color: #fff; font-weight: 700; font-size: 15px; flex-shrink: 0;
        }
        .dev-gh-link {
          display: inline-flex; align-items: center; gap: 5px;
          font-size: 12px; font-weight: 600; color: #7c4dff;
          padding: 3px 10px; border-radius: 20px;
          background: rgba(124,77,255,0.08);
          text-decoration: none;
          transition: background 0.2s ease;
        }
        .dev-gh-link:hover { background: rgba(124,77,255,0.18); }

        @media (max-width: 768px) {
          .mc-nav { padding: 0 20px; }
          .info-grid { flex-direction: column !important; }
          .feature-grid { grid-template-columns: 1fr 1fr !important; }
          .dev-row { flex-direction: column !important; }
          .stat-row { flex-direction: column !important; }
        }
        @media (max-width: 500px) {
          .feature-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ══════════════════════════════════════
          NAVBAR
      ══════════════════════════════════════ */}
      <nav className={`mc-nav ${navSolid ? 'solid' : 'transparent'}`}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img
            src="/logo.png"
            alt="MindSpark Logo"
            style={{ height: 42, width: 'auto', objectFit: 'contain', filter: navSolid ? 'none' : 'brightness(1.2)' }}
          />
        </div>

        <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
          <div className="white-brand-pill" style={{ opacity: navSolid ? 1 : 0.95 }}>
            <span className="anim-title">ALGO SPARK</span>
            <span className="anim-sub">Powered by MindSpark</span>
          </div>
        </div>

        <Link
          to="/faculty-login"
          id="faculty-login-btn"
          className={`faculty-btn ${navSolid ? 'dark' : ''}`}
        >
          Faculty Login
        </Link>
      </nav>

      {/* ══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}
      <section style={{
        position: 'relative',
        height: '100vh',
        minHeight: 600,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        overflow: 'hidden',
      }}>
        <img src="/cover.png" alt="Algo Spark Cover" className="hero-bg" />

        <div style={{
          position: 'absolute', inset: 0, zIndex: 1,
          background: 'linear-gradient(to bottom, rgba(5,8,22,0.62) 0%, rgba(5,8,22,0.45) 50%, rgba(5,8,22,0.80) 100%)',
        }} />

        <div style={{ position: 'relative', zIndex: 2, padding: '0 24px', maxWidth: 800, width: '100%' }}>
          <div className="hero-badge">
            <Star size={13} style={{ color: '#f5a623' }} />
            <span> Powered by MindSpark </span>
          </div>

          <h1 className="hero-title">Algo Spark</h1>

          <p className="hero-sub">
            The Ultimate Coding Platform for Engineering Students. Practice, Compete, and Excel in Programming Contests and Academic Assessments — All in One Place.
          </p>

          <div className="hero-cta-wrap">
            <Link to="/login" id="student-login-hero-btn" className="btn-primary">
              Student Login
            </Link>

            <Link to="/sandbox" className="btn-terminal">
              <Terminal size={16} />
              Practice
            </Link>

            <button className="btn-ghost" onClick={scrollToAbout}>
              Learn More
              <ChevronDown size={16} />
            </button>
          </div>
        </div>

        <div
          className="scroll-indicator"
          onClick={scrollToAbout}
          style={{
            position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)',
            zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
            color: 'rgba(255,255,255,0.55)', fontSize: 11, fontWeight: 500, letterSpacing: '0.2em',
            cursor: 'pointer',
          }}
        >
          <span>SCROLL</span>
          <ChevronDown size={18} />
        </div>
      </section>

      {/* ══════════════════════════════════════
          STATS BAR
      ══════════════════════════════════════ */}
      <div style={{
        background: 'linear-gradient(135deg, #7c4dff, #1a73e8)',
        padding: '28px 40px',
      }}>
        <div className="stat-row" style={{
          maxWidth: 900, margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'space-around',
          gap: 24, flexWrap: 'wrap',
        }}>
          {[
            { value: '10,000+', label: 'Problems Solved' },
            { value: '500+',    label: 'Students Active' },
            { value: '50+',     label: 'College Contests' },
            { value: '98%',     label: 'Satisfaction Rate' },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: 'center', color: '#fff' }}>
              <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: '-0.02em' }}>{s.value}</div>
              <div style={{ fontSize: 12, fontWeight: 500, opacity: 0.75, letterSpacing: '0.05em', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════
          INFO SECTION
      ══════════════════════════════════════ */}
      <section ref={aboutRef} style={{ padding: '96px 40px', background: '#f0f4ff' }}>
        <div className="info-grid" style={{
          maxWidth: 1100, margin: '0 auto',
          display: 'flex', gap: 32, alignItems: 'stretch',
        }}>
          <div className="info-card" style={{ flex: 1.4 }}>
            <span className="section-label">About Algo Spark</span>
            <h2 className="section-title" style={{ marginBottom: 20 }}>
              Code Smarter. <span className="grad-text">Compete Better.</span>
            </h2>
            <p style={{ color: '#475569', lineHeight: 1.8, fontSize: 15.5, marginBottom: 16 }}>
              <strong style={{ color: '#0f172a' }}>Algo Spark</strong> is MindSpark's flagship platform
              designed to transform the way engineering students learn and practice programming.
              With a powerful in-browser code editor, automated test cases, and a real-time leaderboard —
              it's everything you need to go from beginner to competition-ready.
            </p>
            <p style={{ color: '#64748b', lineHeight: 1.8, fontSize: 14.5, marginBottom: 36 }}>
              Faculty can design and launch assessments, track student performance, and create structured
              learning modules — all within a single, unified dashboard.
            </p>

            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <Link
                to="/login"
                id="student-login-info-btn"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '13px 32px',
                  borderRadius: 50,
                  background: 'linear-gradient(135deg, #7c4dff, #1a73e8)',
                  color: '#fff',
                  fontWeight: 700, fontSize: 14.5,
                  textDecoration: 'none',
                  boxShadow: '0 6px 24px rgba(124,77,255,0.35)',
                  transition: 'all 0.25s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(124,77,255,0.5)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 6px 24px rgba(124,77,255,0.35)'; }}
              >
                Student Login
              </Link>
              <a
                href="#features"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '12px 28px',
                  borderRadius: 50,
                  border: '1.5px solid rgba(124,77,255,0.35)',
                  color: '#7c4dff',
                  fontWeight: 600, fontSize: 14.5,
                  textDecoration: 'none',
                  transition: 'all 0.25s ease',
                  background: 'transparent',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(124,77,255,0.06)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
              >
                Explore Features
              </a>
            </div>
          </div>

          <div className="info-card" style={{
            flex: 0.8, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            background: 'linear-gradient(135deg, #0f172a 0%, #1a1040 50%, #0f172a 100%)',
            padding: '56px 40px', gap: 24,
          }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 180, height: 180 }}>
              <div style={{
                position: 'absolute', inset: 0,
                borderRadius: '50%',
                border: '2px dashed rgba(124,77,255,0.3)',
                animation: 'spin-slow 18s linear infinite',
              }} />
              <div style={{
                position: 'absolute', inset: 10,
                borderRadius: '50%',
                border: '1.5px dashed rgba(26,115,232,0.2)',
                animation: 'spin-slow 12s linear infinite reverse',
              }} />
              <div className="logo-glow">
                <img
                  src="/logo.png"
                  alt="MindSpark Logo"
                  style={{ width: 110, height: 110, objectFit: 'contain' }}
                />
              </div>
            </div>

            <div className="white-brand-pill" style={{ marginTop: 16 }}>
              <span className="anim-title" style={{ fontSize: 24 }}>ALGO SPARK</span>
              <span className="anim-sub" style={{ fontSize: 12 }}>Powered by MindSpark</span>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FEATURES SECTION
      ══════════════════════════════════════ */}
      <section id="features" style={{ padding: '96px 40px', background: '#050810' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <span className="section-label">What We Offer</span>
            <h2 className="section-title" style={{ color: '#fff' }}>
              Everything You Need to <span className="grad-text">Excel</span>
            </h2>
            <p style={{ color: '#94a3b8', marginTop: 16, fontSize: 16, maxWidth: 540, margin: '16px auto 0' }}>
              A complete ecosystem for coding practice, competitive programming, and academic assessments.
            </p>
          </div>

          <div className="feature-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 28,
          }}>
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className="feature-card"
                style={{ borderBottomColor: f.color }}
              >
                <div
                  className="feature-icon-wrap"
                  style={{
                    background: `${f.color}15`,
                    color: f.color,
                    boxShadow: `0 8px 24px ${f.color}35`,
                  }}
                >
                  {f.icon}
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#f8fafc', marginBottom: 12 }}>{f.title}</h3>
                <p style={{ fontSize: 14.5, color: '#94a3b8', lineHeight: 1.65 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FOOTER
      ══════════════════════════════════════ */}
      <footer className="footer-bg" style={{ padding: '64px 40px 40px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>

          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: 24, marginBottom: 48,
            paddingBottom: 40,
            borderBottom: '1px solid rgba(255,255,255,0.07)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>

              {/* ── Footer logo — click to show developer modal ── */}
              <button
                className="footer-logo-btn"
                onClick={() => setShowDevModal(true)}
                title="Meet the developers"
              >
                <img src="/logo.png" alt="MindSpark Logo" style={{ height: 44, objectFit: 'contain' }} />
              </button>

              <div>
                <div style={{
                  fontWeight: 900, fontSize: 20, letterSpacing: '0.5px',
                  background: 'linear-gradient(90deg, #a78bfa, #60a5fa)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                }}>ALGO SPARK</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: 500, marginTop: 2 }}>
                  Powered by MindSpark
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', lineHeight: 1.8 }}>
                <div>Practice · Compete · Excel</div>
                <div>Built for Engineering Students</div>
              </div>
            </div>
          </div>

          <div style={{
            borderTop: '1px solid rgba(255,255,255,0.06)',
            paddingTop: 28,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: 8,
          }}>
            <span style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.3)' }}>
              © {new Date().getFullYear()} Algo Spark · Powered by MindSpark. All rights reserved.
            </span>
          </div>
        </div>
      </footer>

      {/* ══════════════════════════════════════
          DEVELOPER MODAL (footer logo click)
      ══════════════════════════════════════ */}
      {showDevModal && (
        <div
          className="dev-modal-overlay"
          onClick={() => setShowDevModal(false)}
        >
          <div
            className="dev-modal"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="dev-close-btn"
              onClick={() => setShowDevModal(false)}
            >✕</button>

            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.4em', textTransform: 'uppercase', color: '#7c4dff', marginBottom: 4 }}>
              Our Team
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', marginBottom: 28 }}>
              Meet the Developers
            </h2>

            {DEVELOPERS.map((dev, i) => (
              <div
                key={i}
                className="dev-card-row"
                style={{ borderBottom: i < DEVELOPERS.length - 1 ? '1px solid #f1f5f9' : 'none' }}
              >
                <div className="dev-avatar" style={{ background: dev.grad }}>
                  {dev.initials}
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 2 }}>
                    {dev.name}
                  </div>
                  <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 8 }}>
                    {dev.role}
                  </div>
                  <a
                    className="dev-gh-link"
                    href={`https://github.com/${dev.github}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Github size={12} />
                    {dev.github}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default HomePage;
