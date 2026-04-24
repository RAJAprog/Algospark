// import React, { useState, useEffect, useMemo } from 'react';
// import { collection, query, where, getDocs, getDoc, doc, orderBy } from 'firebase/firestore';
// import { db } from '../../firebase/config';
// import * as XLSX from 'xlsx';
// import { generateOverallReport, generateStudentWiseReport } from '../../utils/reportGenerator';

// // ─────────────────────────────────────────────────────────────────────────────
// // Excel export
// // ─────────────────────────────────────────────────────────────────────────────
// function exportToExcel(data, filename) {
//   const ws = XLSX.utils.json_to_sheet(data.map((s, i) => ({
//     '#':            i + 1,
//     'Reg No':       s.studentRegNo || s.studentId || '-',
//     'Name':         s.studentName  || '-',
//     'MCQ Score':    s.mcqScore     ?? 0,
//     'Coding Score': s.codingScore  ?? 0,
//     'Total Score':  s.totalScore   ?? 0,
//     'Status':       s.status       || 'completed',
//     'Submitted':    s.submittedAt?.toDate?.()?.toLocaleString() || s.submittedAt || '-',
//     'Violations':   s.violations   ?? 0,
//   })));
//   const wb = XLSX.utils.book_new();
//   XLSX.utils.book_append_sheet(wb, ws, 'Results');
//   XLSX.writeFile(wb, `${filename}_${new Date().toLocaleDateString('en-IN').replace(/\//g, '-')}.xlsx`);
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // Score bar
// // ─────────────────────────────────────────────────────────────────────────────
// function ScoreBar({ score, max }) {
//   const pct   = max > 0 ? Math.min(100, (score / max) * 100) : 0;
//   const color = pct >= 80 ? '#3fb950' : pct >= 50 ? '#f0883e' : '#f85149';
//   return (
//     <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
//       <div style={{ flex: 1, height: 5, background: '#21262d', borderRadius: 3, overflow: 'hidden' }}>
//         <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 3, transition: 'width 0.6s ease' }} />
//       </div>
//       <span style={{ fontSize: 13, fontWeight: 700, color, minWidth: 30, textAlign: 'right' }}>{score}</span>
//     </div>
//   );
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // Convert a logo URL to base64
// // Strategy 1: fetch()  — works when Firebase Storage CORS is configured
// // Strategy 2: Image + Canvas — works when the bucket allows cross-origin img
// // ─────────────────────────────────────────────────────────────────────────────
// async function logoUrlToBase64(url) {
//   if (!url || typeof url !== 'string') return null;

//   // Strategy 1: fetch
//   try {
//     const res = await fetch(url);
//     if (res.ok) {
//       const blob = await res.blob();
//       return await new Promise((resolve, reject) => {
//         const r   = new FileReader();
//         r.onload  = () => resolve(r.result);
//         r.onerror = reject;
//         r.readAsDataURL(blob);
//       });
//     }
//   } catch (_) { /* fall through */ }

//   // Strategy 2: Image + Canvas
//   return new Promise((resolve) => {
//     const img       = new Image();
//     img.crossOrigin = 'anonymous';
//     img.onload = () => {
//       try {
//         const canvas  = document.createElement('canvas');
//         canvas.width  = img.naturalWidth  || 64;
//         canvas.height = img.naturalHeight || 64;
//         canvas.getContext('2d').drawImage(img, 0, 0);
//         resolve(canvas.toDataURL('image/png'));
//       } catch {
//         resolve(null); // canvas tainted by cross-origin — cannot export
//       }
//     };
//     img.onerror = () => resolve(null);
//     img.src = url; // never modify Firebase Storage URLs — the token will break
//   });
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // THE CORRECT APPROACH — same logic as StudentDashboard
// //
// // StudentDashboard does:
// //   1. Get user doc  →  read uData.collegeId  (stores the college NAME, e.g. "VFSTR")
// //   2. Try getDoc(doc(db, 'colleges', collegeId))  — works if docId = name
// //   3. Fallback: query where('name', '==', collegeId)  — works with auto-IDs
// //   4. Read logoUrl from the college doc
// //
// // We do exactly the same here, but we get the studentId from the submissions.
// // ─────────────────────────────────────────────────────────────────────────────
// async function fetchCollegeLogoForSubmissions(submissions) {
//   // Need at least one submission to find a student
//   if (!submissions || submissions.length === 0) return { logoBase64: null, collegeName: null };

//   // Take the first submission's studentId
//   const studentId = submissions[0].studentId;
//   if (!studentId) return { logoBase64: null, collegeName: null };

//   let collegeId   = null; // this is the college NAME string e.g. "VFSTR"
//   let logoUrl     = null;
//   let collegeName = null;

//   // ── Step 1: Get the student's user document to read collegeId ────────────
//   try {
//     const userSnap = await getDoc(doc(db, 'users', studentId));
//     if (userSnap.exists()) {
//       collegeId = userSnap.data().collegeId || null;
//     }
//   } catch (e) {
//     console.warn('[CollegeLogo] Failed to fetch user doc for', studentId, e.message);
//   }

//   if (!collegeId) {
//     console.warn('[CollegeLogo] No collegeId found on user doc for studentId:', studentId);
//     return { logoBase64: null, collegeName: null };
//   }

//   // ── Step 2: Try direct doc lookup (docId = collegeId/name) ──────────────
//   // This matches the exact same logic in StudentDashboard
//   try {
//     const colSnap = await getDoc(doc(db, 'colleges', collegeId));
//     if (colSnap.exists()) {
//       const d = colSnap.data();
//       logoUrl     = d.logoUrl  || null;
//       collegeName = d.name     || collegeId;
//       console.log('[CollegeLogo] Found via direct doc lookup:', collegeName);
//     }
//   } catch (e) {
//     console.warn('[CollegeLogo] Direct doc lookup failed:', e.message);
//   }

//   // ── Step 3: Fallback — query by name field (auto-generated doc IDs) ──────
//   // This is the case for colleges created with addDoc()
//   if (!logoUrl) {
//     try {
//       const q    = query(collection(db, 'colleges'), where('name', '==', collegeId));
//       const snap = await getDocs(q);
//       if (!snap.empty) {
//         const d = snap.docs[0].data();
//         logoUrl     = d.logoUrl || null;
//         collegeName = d.name    || collegeId;
//         console.log('[CollegeLogo] Found via name query:', collegeName);
//       }
//     } catch (e) {
//       console.warn('[CollegeLogo] name query failed:', e.message);
//     }
//   }

//   if (!logoUrl) {
//     console.warn('[CollegeLogo] No logoUrl found for college:', collegeId);
//     return { logoBase64: null, collegeName: collegeName || collegeId };
//   }

//   // ── Step 4: Convert the logoUrl to base64 ───────────────────────────────
//   const logoBase64 = await logoUrlToBase64(logoUrl);
//   if (!logoBase64) {
//     console.warn('[CollegeLogo] logoUrlToBase64 failed for URL:', logoUrl.slice(0, 80));
//   }

//   return { logoBase64, collegeName: collegeName || collegeId };
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // ResultsTable component
// // ─────────────────────────────────────────────────────────────────────────────
// const ResultsTable = ({ examTitle, examId, exam }) => {
//   const [submissions, setSubmissions] = useState([]);
//   const [questions,   setQuestions]   = useState([]);
//   const [loading,     setLoading]     = useState(true);
//   const [pdfLoading,  setPdfLoading]  = useState(null);
//   const [error,       setError]       = useState(null);
//   const [search,      setSearch]      = useState('');
//   const [sortKey,     setSortKey]     = useState('totalScore');
//   const [sortDir,     setSortDir]     = useState('desc');

//   useEffect(() => {
//     const fetchAll = async () => {
//       if (!examId) { setLoading(false); return; }
//       try {
//         let snap;
//         try {
//           snap = await getDocs(query(
//             collection(db, 'submissions'),
//             where('examId', '==', examId),
//             orderBy('totalScore', 'desc'),
//           ));
//         } catch {
//           snap = await getDocs(query(
//             collection(db, 'submissions'),
//             where('examId', '==', examId),
//           ));
//         }
//         setSubmissions(snap.docs.map(d => ({ id: d.id, ...d.data() })));

//         if (exam?.questionIds?.length) {
//           const qDocs = await Promise.all(
//             exam.questionIds.map(qId => getDoc(doc(db, 'questions', qId)))
//           );
//           setQuestions(qDocs.filter(d => d.exists()).map(d => ({ id: d.id, ...d.data() })));
//         }
//       } catch (err) {
//         setError('Failed to load results: ' + err.message);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchAll();
//   }, [examId, exam]);

//   const maxScore = useMemo(
//     () => Math.max(1, ...submissions.map(s => s.totalScore ?? 0)),
//     [submissions]
//   );

//   const sorted = useMemo(() => {
//     let list = [...submissions];
//     if (search.trim()) {
//       const q = search.toLowerCase();
//       list = list.filter(s =>
//         (s.studentName  || '').toLowerCase().includes(q) ||
//         (s.studentRegNo || '').toLowerCase().includes(q) ||
//         (s.studentId    || '').toLowerCase().includes(q)
//       );
//     }
//     list.sort((a, b) => {
//       let va = a[sortKey] ?? 0, vb = b[sortKey] ?? 0;
//       if (typeof va === 'string') va = va.toLowerCase();
//       if (typeof vb === 'string') vb = vb.toLowerCase();
//       return sortDir === 'asc' ? (va > vb ? 1 : -1) : (va < vb ? 1 : -1);
//     });
//     return list;
//   }, [submissions, search, sortKey, sortDir]);

//   const avgScore = submissions.length
//     ? Math.round(submissions.reduce((a, s) => a + (s.totalScore ?? 0), 0) / submissions.length)
//     : 0;
//   const passRate = submissions.length
//     ? Math.round(
//         submissions.filter(s => (s.totalScore ?? 0) >= maxScore * 0.4).length /
//         submissions.length * 100
//       )
//     : 0;

//   const toggleSort = key => {
//     if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
//     else { setSortKey(key); setSortDir('desc'); }
//   };
//   const SortIcon = ({ k }) => (
//     <span style={{ fontSize: 10, color: sortKey === k ? '#f0883e' : '#6e7681', marginLeft: 4 }}>
//       {sortKey === k ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}
//     </span>
//   );

//   // ── PDF handlers ───────────────────────────────────────────────────────────
//   const handleOverallPDF = async () => {
//     if (!submissions.length) { alert('No submissions yet.'); return; }
//     setPdfLoading('overall');
//     try {
//       // Fetch logo + college name by looking up the student's user document
//       // — exactly the same way StudentDashboard does it
//       const { logoBase64, collegeName } = await fetchCollegeLogoForSubmissions(submissions);
//       generateOverallReport({
//         examTitle:          examTitle || 'Exam',
//         exam,
//         submissions,
//         questions,
//         collegeName:        collegeName || exam?.assignedColleges?.[0] || 'Institution',
//         collegeLogoDataUrl: logoBase64,
//       });
//     } catch (e) {
//       console.error(e);
//       alert('PDF generation failed: ' + e.message);
//     }
//     setPdfLoading(null);
//   };

//   const handleStudentWisePDF = async () => {
//     if (!submissions.length) { alert('No submissions yet.'); return; }
//     if (submissions.length > 200 &&
//         !window.confirm(`Generating ${submissions.length} pages. Continue?`)) return;
//     setPdfLoading('student');
//     try {
//       const { logoBase64, collegeName } = await fetchCollegeLogoForSubmissions(submissions);
//       generateStudentWiseReport({
//         examTitle:          examTitle || 'Exam',
//         exam,
//         submissions,
//         questions,
//         collegeName:        collegeName || exam?.assignedColleges?.[0] || 'Institution',
//         collegeLogoDataUrl: logoBase64,
//       });
//     } catch (e) {
//       console.error(e);
//       alert('PDF generation failed: ' + e.message);
//     }
//     setPdfLoading(null);
//   };

//   // ── Render ─────────────────────────────────────────────────────────────────
//   if (loading) return (
//     <div style={{ padding: '3rem', textAlign: 'center' }}>
//       <div style={{ width: 36, height: 36, border: '3px solid #30363d', borderTopColor: '#58a6ff', borderRadius: '50%', animation: 'spin .8s linear infinite', margin: '0 auto' }} />
//       <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
//       <p style={{ color: '#8b949e', marginTop: 12, fontSize: 14 }}>Loading results...</p>
//     </div>
//   );

//   return (
//     <div style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>

//       {/* ── Header ── */}
//       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
//         <div>
//           <h2 style={{ fontSize: 22, fontWeight: 800, color: '#e6edf3', marginBottom: 4 }}>Exam Results</h2>
//           <p style={{ fontSize: 14, color: '#8b949e' }}>
//             {examTitle} · {submissions.length} submission{submissions.length !== 1 ? 's' : ''}
//           </p>
//         </div>

//         <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
//           <button
//             onClick={handleOverallPDF}
//             disabled={!!pdfLoading || submissions.length === 0}
//             style={{ padding: '8px 16px', background: pdfLoading === 'overall' ? 'rgba(59,130,246,0.08)' : 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 8, color: '#60a5fa', fontSize: 13, fontWeight: 700, cursor: pdfLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 6, opacity: pdfLoading ? 0.7 : 1 }}>
//             {pdfLoading === 'overall' ? 'Generating...' : 'Overall Report (PDF)'}
//           </button>

//           <button
//             onClick={handleStudentWisePDF}
//             disabled={!!pdfLoading || submissions.length === 0}
//             style={{ padding: '8px 16px', background: pdfLoading === 'student' ? 'rgba(124,77,255,0.08)' : 'rgba(124,77,255,0.12)', border: '1px solid rgba(124,77,255,0.3)', borderRadius: 8, color: '#a78bfa', fontSize: 13, fontWeight: 700, cursor: pdfLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 6, opacity: pdfLoading ? 0.7 : 1 }}>
//             {pdfLoading === 'student' ? 'Generating...' : 'Student Wise Report (PDF)'}
//           </button>

//           <button
//             onClick={() => exportToExcel(sorted, (examTitle || 'exam').replace(/\s+/g, '_').toLowerCase())}
//             disabled={submissions.length === 0}
//             style={{ padding: '8px 16px', background: 'rgba(63,185,80,0.1)', border: '1px solid rgba(63,185,80,0.3)', borderRadius: 8, color: '#3fb950', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
//             Export XLSX
//           </button>
//         </div>
//       </div>

//       {/* ── Info banner ── */}
//       <div style={{ marginBottom: 16, padding: '10px 14px', background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)', borderRadius: 8 }}>
//         <p style={{ fontSize: 12, color: '#8b949e', margin: 0 }}>
//           PDFs fetch the college logo from the student's profile (same as the student dashboard) and show AlgoSpark branding on every page.
//         </p>
//       </div>

//       {/* ── Stats ── */}
//       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
//         {[
//           { label: 'Total Submissions', val: submissions.length,                                       color: '#58a6ff' },
//           { label: 'Average Score',     val: avgScore,                                                 color: '#f0883e' },
//           { label: 'Highest Score',     val: Math.max(0, ...submissions.map(s => s.totalScore ?? 0)), color: '#3fb950' },
//           { label: 'Pass Rate (>=40%)', val: `${passRate}%`,                                          color: '#bc8cff' },
//         ].map(({ label, val, color }) => (
//           <div key={label} style={{ background: '#161b22', border: '1px solid #21262d', borderRadius: 12, padding: '16px 18px' }}>
//             <p style={{ fontSize: 11, fontWeight: 700, color: '#8b949e', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>{label}</p>
//             <p style={{ fontSize: 28, fontWeight: 800, color, lineHeight: 1 }}>{val}</p>
//           </div>
//         ))}
//       </div>

//       {/* ── Search ── */}
//       <div style={{ marginBottom: 16 }}>
//         <div style={{ position: 'relative', maxWidth: 360 }}>
//           <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#8b949e', fontSize: 14 }}>🔍</span>
//           <input
//             value={search}
//             onChange={e => setSearch(e.target.value)}
//             placeholder="Search by name or reg number..."
//             style={{ width: '100%', background: '#161b22', border: '1px solid #30363d', borderRadius: 8, padding: '9px 14px 9px 36px', color: '#e6edf3', fontSize: 14, outline: 'none' }}
//           />
//         </div>
//       </div>

//       {error && (
//         <div style={{ padding: 16, background: 'rgba(248,81,73,0.1)', border: '1px solid rgba(248,81,73,0.3)', borderRadius: 8, color: '#f85149', fontSize: 14, marginBottom: 16 }}>
//           {error}
//         </div>
//       )}

//       {/* ── Results table ── */}
//       <div style={{ background: '#161b22', border: '1px solid #21262d', borderRadius: 12, overflow: 'hidden' }}>
//         {/* Table header */}
//         <div style={{ display: 'grid', gridTemplateColumns: '48px 70px 1fr 1fr 90px 90px 160px 80px 80px', background: '#0d1117', borderBottom: '1px solid #21262d' }}>
//           {[
//             { label: '#',           k: null           },
//             { label: 'Rank',        k: 'totalScore'   },
//             { label: 'Name',        k: 'studentName'  },
//             { label: 'Reg No',      k: 'studentRegNo' },
//             { label: 'MCQ',         k: 'mcqScore'     },
//             { label: 'Coding',      k: 'codingScore'  },
//             { label: 'Total Score', k: 'totalScore'   },
//             { label: 'Status',      k: 'status'       },
//             { label: 'Violations',  k: 'violations'   },
//           ].map(({ label, k }) => (
//             <div key={label} onClick={() => k && toggleSort(k)}
//               style={{ padding: '10px 12px', fontSize: 11, fontWeight: 700, color: k === sortKey ? '#f0883e' : '#8b949e', textTransform: 'uppercase', letterSpacing: '0.08em', cursor: k ? 'pointer' : 'default', userSelect: 'none', display: 'flex', alignItems: 'center' }}>
//               {label}{k && <SortIcon k={k} />}
//             </div>
//           ))}
//         </div>

//         {/* Table rows */}
//         {sorted.length === 0 ? (
//           <div style={{ padding: '3rem', textAlign: 'center' }}>
//             <p style={{ fontSize: 40, marginBottom: 12 }}>📭</p>
//             <p style={{ color: '#8b949e', fontSize: 15 }}>{search ? 'No results match your search.' : 'No submissions yet.'}</p>
//           </div>
//         ) : sorted.map((sub, i) => {
//           const rankInAll = submissions.findIndex(s => s.id === sub.id);
//           const medal     = rankInAll === 0 ? '🥇' : rankInAll === 1 ? '🥈' : rankInAll === 2 ? '🥉' : null;
//           return (
//             <div key={sub.id}
//               style={{ display: 'grid', gridTemplateColumns: '48px 70px 1fr 1fr 90px 90px 160px 80px 80px', borderBottom: '1px solid #21262d', transition: 'background .1s' }}
//               onMouseEnter={e => e.currentTarget.style.background = '#21262d'}
//               onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
//               <div style={{ padding: '12px', fontSize: 13, color: '#8b949e', display: 'flex', alignItems: 'center' }}>{i + 1}</div>
//               <div style={{ padding: '12px', fontSize: 16, display: 'flex', alignItems: 'center' }}>
//                 {medal || <span style={{ fontSize: 12, color: '#8b949e', fontWeight: 700 }}>#{rankInAll + 1}</span>}
//               </div>
//               <div style={{ padding: '12px', display: 'flex', alignItems: 'center', gap: 10 }}>
//                 <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg,#f0883e,#bc8cff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
//                   {(sub.studentName || '?').charAt(0).toUpperCase()}
//                 </div>
//                 <span style={{ fontSize: 14, fontWeight: 600, color: '#e6edf3' }}>{sub.studentName || '-'}</span>
//               </div>
//               <div style={{ padding: '12px', display: 'flex', alignItems: 'center' }}>
//                 <span style={{ fontSize: 12, fontFamily: 'monospace', color: '#8b949e' }}>{sub.studentRegNo || sub.studentId || '-'}</span>
//               </div>
//               <div style={{ padding: '12px', display: 'flex', alignItems: 'center' }}>
//                 <span style={{ fontSize: 13, fontWeight: 600, color: '#58a6ff' }}>{sub.mcqScore ?? '-'}</span>
//               </div>
//               <div style={{ padding: '12px', display: 'flex', alignItems: 'center' }}>
//                 <span style={{ fontSize: 13, fontWeight: 600, color: '#f0883e' }}>{sub.codingScore ?? '-'}</span>
//               </div>
//               <div style={{ padding: '12px', display: 'flex', alignItems: 'center' }}>
//                 <ScoreBar score={sub.totalScore ?? 0} max={maxScore} />
//               </div>
//               <div style={{ padding: '12px', display: 'flex', alignItems: 'center' }}>
//                 <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 6, background: sub.status === 'completed' ? 'rgba(63,185,80,0.1)' : 'rgba(88,166,255,0.1)', color: sub.status === 'completed' ? '#3fb950' : '#58a6ff', border: `1px solid ${sub.status === 'completed' ? 'rgba(63,185,80,0.3)' : 'rgba(88,166,255,0.3)'}` }}>
//                   {sub.status || 'done'}
//                 </span>
//               </div>
//               <div style={{ padding: '12px', display: 'flex', alignItems: 'center' }}>
//                 <span style={{ fontSize: 13, fontWeight: 600, color: (sub.violations ?? 0) > 0 ? '#f85149' : '#8b949e' }}>
//                   {(sub.violations ?? 0) > 0 ? `${sub.violations} !` : '-'}
//                 </span>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       <p style={{ fontSize: 12, color: '#8b949e', marginTop: 12, textAlign: 'right' }}>
//         Showing {sorted.length} of {submissions.length} submissions
//       </p>
//     </div>
//   );
// };

// export default ResultsTable;





























import React, { useState, useEffect, useMemo } from 'react';
import { collection, query, where, getDocs, getDoc, doc, orderBy } from 'firebase/firestore';
import { db } from '../../firebase/config';
import * as XLSX from 'xlsx';
import { generateOverallReport, generateStudentWiseReport } from '../../utils/reportGenerator';

// ─────────────────────────────────────────────────────────────────────────────
// Excel export
// ─────────────────────────────────────────────────────────────────────────────
function exportToExcel(data, filename) {
  const ws = XLSX.utils.json_to_sheet(data.map((s, i) => ({
    '#':            i + 1,
    'Reg No':       s.studentRegNo || s.studentId || '-',
    'Name':         s.studentName  || '-',
    'MCQ Score':    s.mcqScore     ?? 0,
    'Coding Score': s.codingScore  ?? 0,
    'Total Score':  s.totalScore   ?? 0,
    'Status':       s.status       || 'completed',
    'Submitted':    s.submittedAt?.toDate?.()?.toLocaleString() || s.submittedAt || '-',
    'Violations':   s.violations   ?? 0,
  })));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Results');
  XLSX.writeFile(wb, `${filename}_${new Date().toLocaleDateString('en-IN').replace(/\//g, '-')}.xlsx`);
}

// ─────────────────────────────────────────────────────────────────────────────
// Score bar
// ─────────────────────────────────────────────────────────────────────────────
function ScoreBar({ score, max }) {
  const pct   = max > 0 ? Math.min(100, (score / max) * 100) : 0;
  const color = pct >= 80 ? '#3fb950' : pct >= 50 ? '#f0883e' : '#f85149';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ flex: 1, height: 5, background: '#21262d', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 3, transition: 'width 0.6s ease' }} />
      </div>
      <span style={{ fontSize: 13, fontWeight: 700, color, minWidth: 30, textAlign: 'right' }}>{score}</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 3 FIX — Convert logo URL to Base64 (CORS-safe, aggressive strategy)
//
// Strategy 1: fetch() with explicit CORS mode + cache-busting timestamp.
//   This works AFTER you have applied the cors.json to your Firebase Storage
//   bucket via: gsutil cors set cors.json gs://YOUR_BUCKET_NAME
//
// Strategy 2: Image + Canvas fallback.
//   Works when the storage bucket allows cross-origin image loading.
//   Note: canvas.toDataURL() will throw a SecurityError if CORS is not
//   configured, so we catch that and resolve null.
//
// If BOTH fail, we return null and the PDF uses the letter placeholder.
// ─────────────────────────────────────────────────────────────────────────────
async function logoUrlToBase64(url) {
  if (!url || typeof url !== 'string') return null;

  // ── Strategy 1: fetch() with CORS mode + cache-bust ──────────────────────
  // Adding a timestamp param forces the browser to make a fresh network
  // request instead of serving a stale cached response that may lack the
  // CORS headers added by your new cors.json rule.
  try {
    const bustUrl  = url.includes('?') ? `${url}&_cb=${Date.now()}` : `${url}?_cb=${Date.now()}`;
    const response = await fetch(bustUrl, {
      method: 'GET',
      mode:   'cors',       // explicitly request cross-origin
      cache:  'no-cache',   // bypass browser cache so new CORS headers are seen
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const blob = await response.blob();
    return await new Promise((resolve, reject) => {
      const reader   = new FileReader();
      reader.onloadend = () => resolve(reader.result);   // "data:image/...;base64,..."
      reader.onerror   = () => reject(new Error('FileReader failed'));
      reader.readAsDataURL(blob);
    });
  } catch (err) {
    console.warn('[logoUrlToBase64] Strategy 1 (fetch) failed:', err.message);
  }

  // ── Strategy 2: Image + Canvas ────────────────────────────────────────────
  // We load the image via an <img> tag (browser handles auth tokens in the
  // URL) then draw it on an off-screen canvas and export to data URL.
  // This still requires proper CORS headers on the bucket.
  return new Promise((resolve) => {
    const img       = new Image();
    img.crossOrigin = 'anonymous';  // request CORS-capable response

    img.onload = () => {
      try {
        const canvas  = document.createElement('canvas');
        canvas.width  = img.naturalWidth  || 128;
        canvas.height = img.naturalHeight || 128;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        // toDataURL throws SecurityError if canvas is tainted (CORS missing)
        resolve(canvas.toDataURL('image/png'));
      } catch (secErr) {
        console.warn('[logoUrlToBase64] Strategy 2 canvas tainted (CORS not set on bucket):', secErr.message);
        resolve(null);
      }
    };

    img.onerror = (e) => {
      console.warn('[logoUrlToBase64] Strategy 2 image load failed:', e);
      resolve(null);
    };

    // Do NOT modify the Firebase Storage URL — the token embedded in it is
    // position-sensitive. Changing query params will break authentication.
    img.src = url;
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 2 FIX — Fetch college logo for the given submissions list.
//
// This mirrors EXACTLY what StudentDashboard does:
//   1. Read the student's user doc  →  get collegeId  (stores the NAME string)
//   2. Try direct getDoc(colleges/<collegeId>)  — works if docId === name
//   3. Fallback: query where('name', '==', collegeId)  — works with auto-IDs
//   4. Convert logoUrl → base64
//
// Additionally we also check exam.assignedColleges[0] as a second identity
// source so faculty-created exams with no individual student docs still work.
// ─────────────────────────────────────────────────────────────────────────────
async function fetchCollegeLogoForSubmissions(submissions, exam) {
  let collegeId   = null;   // the NAME string stored in users.collegeId
  let logoUrl     = null;
  let collegeName = null;

  // ── Source A: exam's assignedColleges field (most reliable for faculty) ──
  if (exam?.assignedColleges?.length) {
    collegeId = exam.assignedColleges[0];
    console.log('[CollegeLogo] Source A — exam.assignedColleges[0]:', collegeId);
  }

  // ── Source B: first submission's studentId → user doc → collegeId ────────
  if (!collegeId && submissions?.length) {
    const studentId = submissions[0]?.studentId;
    if (studentId) {
      try {
        const userSnap = await getDoc(doc(db, 'users', studentId));
        if (userSnap.exists()) {
          collegeId = userSnap.data().collegeId || null;
          console.log('[CollegeLogo] Source B — user.collegeId:', collegeId);
        }
      } catch (e) {
        console.warn('[CollegeLogo] Failed to read user doc for', studentId, e.message);
      }
    }
  }

  if (!collegeId) {
    console.warn('[CollegeLogo] No collegeId found — report will use letter placeholder.');
    return { logoBase64: null, collegeName: null };
  }

  // ── Lookup 1: Direct document — docId === collegeId / name ───────────────
  try {
    const snap = await getDoc(doc(db, 'colleges', collegeId));
    if (snap.exists()) {
      const d  = snap.data();
      logoUrl     = d.logoUrl || null;
      collegeName = d.name    || collegeId;
      console.log('[CollegeLogo] Lookup 1 (direct doc) succeeded:', collegeName, '| hasLogo:', !!logoUrl);
    }
  } catch (e) {
    console.warn('[CollegeLogo] Lookup 1 failed:', e.message);
  }

  // ── Lookup 2: Query by name field (for auto-generated doc IDs) ────────────
  if (!logoUrl && !collegeName) {
    try {
      const q    = query(collection(db, 'colleges'), where('name', '==', collegeId));
      const snap = await getDocs(q);
      if (!snap.empty) {
        const d  = snap.docs[0].data();
        logoUrl     = d.logoUrl || null;
        collegeName = d.name    || collegeId;
        console.log('[CollegeLogo] Lookup 2 (name query) succeeded:', collegeName, '| hasLogo:', !!logoUrl);
      }
    } catch (e) {
      console.warn('[CollegeLogo] Lookup 2 failed:', e.message);
    }
  }

  // Set collegeName even if no logo was found
  if (!collegeName) collegeName = collegeId;

  if (!logoUrl) {
    console.warn('[CollegeLogo] No logoUrl in Firestore for:', collegeId,
      '— check TenantManager: was a logo uploaded for this college?');
    return { logoBase64: null, collegeName };
  }

  console.log('[CollegeLogo] Converting logoUrl to base64…');
  const logoBase64 = await logoUrlToBase64(logoUrl);

  if (logoBase64) {
    console.log('[CollegeLogo] ✅ base64 conversion succeeded — logo will appear in PDF.');
  } else {
    console.warn('[CollegeLogo] ❌ base64 conversion failed.',
      'Apply cors.json to your Firebase Storage bucket then retry.',
      '\nURL preview:', logoUrl.slice(0, 100));
  }

  return { logoBase64, collegeName };
}

// ─────────────────────────────────────────────────────────────────────────────
// ResultsTable component
// ─────────────────────────────────────────────────────────────────────────────
const ResultsTable = ({ examTitle, examId, exam }) => {
  const [submissions, setSubmissions] = useState([]);
  const [questions,   setQuestions]   = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [pdfLoading,  setPdfLoading]  = useState(null);
  const [error,       setError]       = useState(null);
  const [search,      setSearch]      = useState('');
  const [sortKey,     setSortKey]     = useState('totalScore');
  const [sortDir,     setSortDir]     = useState('desc');

  useEffect(() => {
    const fetchAll = async () => {
      if (!examId) { setLoading(false); return; }
      try {
        let snap;
        try {
          snap = await getDocs(query(
            collection(db, 'submissions'),
            where('examId', '==', examId),
            orderBy('totalScore', 'desc'),
          ));
        } catch {
          snap = await getDocs(query(
            collection(db, 'submissions'),
            where('examId', '==', examId),
          ));
        }
        setSubmissions(snap.docs.map(d => ({ id: d.id, ...d.data() })));

        if (exam?.questionIds?.length) {
          const qDocs = await Promise.all(
            exam.questionIds.map(qId => getDoc(doc(db, 'questions', qId)))
          );
          setQuestions(qDocs.filter(d => d.exists()).map(d => ({ id: d.id, ...d.data() })));
        }
      } catch (err) {
        setError('Failed to load results: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [examId, exam]);

  const maxScore = useMemo(
    () => Math.max(1, ...submissions.map(s => s.totalScore ?? 0)),
    [submissions]
  );

  const sorted = useMemo(() => {
    let list = [...submissions];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(s =>
        (s.studentName  || '').toLowerCase().includes(q) ||
        (s.studentRegNo || '').toLowerCase().includes(q) ||
        (s.studentId    || '').toLowerCase().includes(q)
      );
    }
    list.sort((a, b) => {
      let va = a[sortKey] ?? 0, vb = b[sortKey] ?? 0;
      if (typeof va === 'string') va = va.toLowerCase();
      if (typeof vb === 'string') vb = vb.toLowerCase();
      return sortDir === 'asc' ? (va > vb ? 1 : -1) : (va < vb ? 1 : -1);
    });
    return list;
  }, [submissions, search, sortKey, sortDir]);

  const avgScore = submissions.length
    ? Math.round(submissions.reduce((a, s) => a + (s.totalScore ?? 0), 0) / submissions.length)
    : 0;
  const passRate = submissions.length
    ? Math.round(
        submissions.filter(s => (s.totalScore ?? 0) >= maxScore * 0.4).length /
        submissions.length * 100
      )
    : 0;

  const toggleSort = key => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
  };
  const SortIcon = ({ k }) => (
    <span style={{ fontSize: 10, color: sortKey === k ? '#f0883e' : '#6e7681', marginLeft: 4 }}>
      {sortKey === k ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}
    </span>
  );

  // ── PDF handlers ───────────────────────────────────────────────────────────
  const handleOverallPDF = async () => {
    if (!submissions.length) { alert('No submissions yet.'); return; }
    setPdfLoading('overall');
    try {
      // Pass exam object so fetchCollegeLogoForSubmissions can use
      // exam.assignedColleges as the primary source (more reliable than
      // looking up each student's user doc on the faculty side).
      const { logoBase64, collegeName } = await fetchCollegeLogoForSubmissions(submissions, exam);

      generateOverallReport({
        examTitle:          examTitle || 'Exam',
        exam,
        submissions,
        questions,
        collegeName:        collegeName || exam?.assignedColleges?.[0] || 'Institution',
        collegeLogoDataUrl: logoBase64,   // null → letter placeholder; base64 → real logo
      });
    } catch (e) {
      console.error('[handleOverallPDF]', e);
      alert('PDF generation failed: ' + e.message);
    }
    setPdfLoading(null);
  };

  const handleStudentWisePDF = async () => {
    if (!submissions.length) { alert('No submissions yet.'); return; }
    if (submissions.length > 200 &&
        !window.confirm(`Generating ${submissions.length} pages. Continue?`)) return;
    setPdfLoading('student');
    try {
      const { logoBase64, collegeName } = await fetchCollegeLogoForSubmissions(submissions, exam);

      generateStudentWiseReport({
        examTitle:          examTitle || 'Exam',
        exam,
        submissions,
        questions,
        collegeName:        collegeName || exam?.assignedColleges?.[0] || 'Institution',
        collegeLogoDataUrl: logoBase64,
      });
    } catch (e) {
      console.error('[handleStudentWisePDF]', e);
      alert('PDF generation failed: ' + e.message);
    }
    setPdfLoading(null);
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  if (loading) return (
    <div style={{ padding: '3rem', textAlign: 'center' }}>
      <div style={{ width: 36, height: 36, border: '3px solid #30363d', borderTopColor: '#58a6ff', borderRadius: '50%', animation: 'spin .8s linear infinite', margin: '0 auto' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <p style={{ color: '#8b949e', marginTop: 12, fontSize: 14 }}>Loading results...</p>
    </div>
  );

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#e6edf3', marginBottom: 4 }}>Exam Results</h2>
          <p style={{ fontSize: 14, color: '#8b949e' }}>
            {examTitle} · {submissions.length} submission{submissions.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button
            onClick={handleOverallPDF}
            disabled={!!pdfLoading || submissions.length === 0}
            style={{ padding: '8px 16px', background: pdfLoading === 'overall' ? 'rgba(59,130,246,0.08)' : 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 8, color: '#60a5fa', fontSize: 13, fontWeight: 700, cursor: pdfLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 6, opacity: pdfLoading ? 0.7 : 1 }}>
            {pdfLoading === 'overall' ? '⏳ Generating...' : '📄 Overall Report (PDF)'}
          </button>

          <button
            onClick={handleStudentWisePDF}
            disabled={!!pdfLoading || submissions.length === 0}
            style={{ padding: '8px 16px', background: pdfLoading === 'student' ? 'rgba(124,77,255,0.08)' : 'rgba(124,77,255,0.12)', border: '1px solid rgba(124,77,255,0.3)', borderRadius: 8, color: '#a78bfa', fontSize: 13, fontWeight: 700, cursor: pdfLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 6, opacity: pdfLoading ? 0.7 : 1 }}>
            {pdfLoading === 'student' ? '⏳ Generating...' : '📋 Student Wise Report (PDF)'}
          </button>

          <button
            onClick={() => exportToExcel(sorted, (examTitle || 'exam').replace(/\s+/g, '_').toLowerCase())}
            disabled={submissions.length === 0}
            style={{ padding: '8px 16px', background: 'rgba(63,185,80,0.1)', border: '1px solid rgba(63,185,80,0.3)', borderRadius: 8, color: '#3fb950', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
            📊 Export XLSX
          </button>
        </div>
      </div>

      {/* ── CORS reminder banner (shown only in development) ── */}
      {process.env.NODE_ENV === 'development' && (
        <div style={{ marginBottom: 16, padding: '10px 14px', background: 'rgba(240,136,62,0.06)', border: '1px solid rgba(240,136,62,0.2)', borderRadius: 8 }}>
          <p style={{ fontSize: 12, color: '#8b949e', margin: 0 }}>
            <strong style={{ color: '#f0883e' }}>Dev reminder:</strong> If the college logo appears as a letter placeholder in PDFs,
            apply <code style={{ background: '#21262d', padding: '1px 5px', borderRadius: 4 }}>cors.json</code> to your Firebase Storage bucket.
            Run: <code style={{ background: '#21262d', padding: '1px 5px', borderRadius: 4 }}>gsutil cors set cors.json gs://YOUR_BUCKET</code>
          </p>
        </div>
      )}

      {/* ── Stats ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Total Submissions', val: submissions.length,                                       color: '#58a6ff' },
          { label: 'Average Score',     val: avgScore,                                                 color: '#f0883e' },
          { label: 'Highest Score',     val: Math.max(0, ...submissions.map(s => s.totalScore ?? 0)), color: '#3fb950' },
          { label: 'Pass Rate (>=40%)', val: `${passRate}%`,                                          color: '#bc8cff' },
        ].map(({ label, val, color }) => (
          <div key={label} style={{ background: '#161b22', border: '1px solid #21262d', borderRadius: 12, padding: '16px 18px' }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#8b949e', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>{label}</p>
            <p style={{ fontSize: 28, fontWeight: 800, color, lineHeight: 1 }}>{val}</p>
          </div>
        ))}
      </div>

      {/* ── Search ── */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ position: 'relative', maxWidth: 360 }}>
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#8b949e', fontSize: 14 }}>🔍</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or reg number..."
            style={{ width: '100%', background: '#161b22', border: '1px solid #30363d', borderRadius: 8, padding: '9px 14px 9px 36px', color: '#e6edf3', fontSize: 14, outline: 'none' }}
          />
        </div>
      </div>

      {error && (
        <div style={{ padding: 16, background: 'rgba(248,81,73,0.1)', border: '1px solid rgba(248,81,73,0.3)', borderRadius: 8, color: '#f85149', fontSize: 14, marginBottom: 16 }}>
          {error}
        </div>
      )}

      {/* ── Results table ── */}
      <div style={{ background: '#161b22', border: '1px solid #21262d', borderRadius: 12, overflow: 'hidden' }}>
        {/* Table header */}
        <div style={{ display: 'grid', gridTemplateColumns: '48px 70px 1fr 1fr 90px 90px 160px 80px 80px', background: '#0d1117', borderBottom: '1px solid #21262d' }}>
          {[
            { label: '#',           k: null           },
            { label: 'Rank',        k: 'totalScore'   },
            { label: 'Name',        k: 'studentName'  },
            { label: 'Reg No',      k: 'studentRegNo' },
            { label: 'MCQ',         k: 'mcqScore'     },
            { label: 'Coding',      k: 'codingScore'  },
            { label: 'Total Score', k: 'totalScore'   },
            { label: 'Status',      k: 'status'       },
            { label: 'Violations',  k: 'violations'   },
          ].map(({ label, k }) => (
            <div key={label} onClick={() => k && toggleSort(k)}
              style={{ padding: '10px 12px', fontSize: 11, fontWeight: 700, color: k === sortKey ? '#f0883e' : '#8b949e', textTransform: 'uppercase', letterSpacing: '0.08em', cursor: k ? 'pointer' : 'default', userSelect: 'none', display: 'flex', alignItems: 'center' }}>
              {label}{k && <SortIcon k={k} />}
            </div>
          ))}
        </div>

        {/* Table rows */}
        {sorted.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center' }}>
            <p style={{ fontSize: 40, marginBottom: 12 }}>📭</p>
            <p style={{ color: '#8b949e', fontSize: 15 }}>{search ? 'No results match your search.' : 'No submissions yet.'}</p>
          </div>
        ) : sorted.map((sub, i) => {
          const rankInAll = submissions.findIndex(s => s.id === sub.id);
          const medal     = rankInAll === 0 ? '🥇' : rankInAll === 1 ? '🥈' : rankInAll === 2 ? '🥉' : null;
          return (
            <div key={sub.id}
              style={{ display: 'grid', gridTemplateColumns: '48px 70px 1fr 1fr 90px 90px 160px 80px 80px', borderBottom: '1px solid #21262d', transition: 'background .1s' }}
              onMouseEnter={e => e.currentTarget.style.background = '#21262d'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <div style={{ padding: '12px', fontSize: 13, color: '#8b949e', display: 'flex', alignItems: 'center' }}>{i + 1}</div>
              <div style={{ padding: '12px', fontSize: 16, display: 'flex', alignItems: 'center' }}>
                {medal || <span style={{ fontSize: 12, color: '#8b949e', fontWeight: 700 }}>#{rankInAll + 1}</span>}
              </div>
              <div style={{ padding: '12px', display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg,#f0883e,#bc8cff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                  {(sub.studentName || '?').charAt(0).toUpperCase()}
                </div>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#e6edf3' }}>{sub.studentName || '-'}</span>
              </div>
              <div style={{ padding: '12px', display: 'flex', alignItems: 'center' }}>
                <span style={{ fontSize: 12, fontFamily: 'monospace', color: '#8b949e' }}>{sub.studentRegNo || sub.studentId || '-'}</span>
              </div>
              <div style={{ padding: '12px', display: 'flex', alignItems: 'center' }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#58a6ff' }}>{sub.mcqScore ?? '-'}</span>
              </div>
              <div style={{ padding: '12px', display: 'flex', alignItems: 'center' }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#f0883e' }}>{sub.codingScore ?? '-'}</span>
              </div>
              <div style={{ padding: '12px', display: 'flex', alignItems: 'center' }}>
                <ScoreBar score={sub.totalScore ?? 0} max={maxScore} />
              </div>
              <div style={{ padding: '12px', display: 'flex', alignItems: 'center' }}>
                <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 6, background: sub.status === 'completed' ? 'rgba(63,185,80,0.1)' : 'rgba(88,166,255,0.1)', color: sub.status === 'completed' ? '#3fb950' : '#58a6ff', border: `1px solid ${sub.status === 'completed' ? 'rgba(63,185,80,0.3)' : 'rgba(88,166,255,0.3)'}` }}>
                  {sub.status || 'done'}
                </span>
              </div>
              <div style={{ padding: '12px', display: 'flex', alignItems: 'center' }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: (sub.violations ?? 0) > 0 ? '#f85149' : '#8b949e' }}>
                  {(sub.violations ?? 0) > 0 ? `${sub.violations} !` : '-'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <p style={{ fontSize: 12, color: '#8b949e', marginTop: 12, textAlign: 'right' }}>
        Showing {sorted.length} of {submissions.length} submissions
      </p>
    </div>
  );
};

export default ResultsTable;
