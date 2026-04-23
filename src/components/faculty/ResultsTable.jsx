// // // src/components/exam/faculty/ResultsTable.jsx

// // import React, { useState, useMemo } from 'react';
// // import { exportToExcel } from '../../utils/fileExporter';

// // const ResultsTable = ({ submissions, examTitle }) => {
// //     const [filterBranch, setFilterBranch] = useState('all');
// //     const [filterSection, setFilterSection] = useState('all');

// //     // useMemo will cache these expensive calculations, preventing re-runs on every render.
// //     const uniqueBranches = useMemo(() => ['all', ...new Set(submissions.map(s => s.branch))], [submissions]);
// //     const uniqueSections = useMemo(() => ['all', ...new Set(submissions.map(s => s.section))], [submissions]);

// //     const filteredAndSortedSubmissions = useMemo(() => {
// //         return submissions
// //             .filter(s => filterBranch === 'all' || s.branch === filterBranch)
// //             .filter(s => filterSection === 'all' || s.section === filterSection)
// //             .sort((a, b) => a.regd_no.localeCompare(b.regd_no)); // Sort by registration number
// //     }, [submissions, filterBranch, filterSection]);

// //     const handleExport = () => {
// //         if (filteredAndSortedSubmissions.length === 0) {
// //             alert("There is no data to export.");
// //             return;
// //         }
// //         // Sanitize the title to be a valid filename
// //         const safeFileName = examTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase();
// //         exportToExcel(filteredAndSortedSubmissions, `${safeFileName}_results`);
// //     };

// //     if (submissions.length === 0) {
// //         return <div className="bg-gray-800 p-8 rounded-lg text-center text-gray-400">No submissions found for this exam yet.</div>;
// //     }

// //     return (
// //         <div className="bg-gray-800 p-8 rounded-lg">
// //             <div className="flex justify-between items-center mb-6">
// //                 <h2 className="text-2xl font-bold text-white">Results for "{examTitle}"</h2>
// //                 <button
// //                     onClick={handleExport}
// //                     className="bg-green-600 hover:bg-green-500 text-white font-semibold py-2 px-4 rounded-lg"
// //                 >
// //                     Export to Excel
// //                 </button>
// //             </div>

// //             {/* Filter Controls */}
// //             <div className="flex gap-4 mb-4">
// //                 <div>
// //                     <label className="block text-sm font-medium text-gray-400">Filter by Branch</label>
// //                     <select
// //                         value={filterBranch}
// //                         onChange={e => setFilterBranch(e.target.value)}
// //                         className="mt-1 bg-gray-700 border-gray-600 rounded-md py-2 px-3 text-white"
// //                     >
// //                         {uniqueBranches.map(branch => <option key={branch} value={branch}>{branch}</option>)}
// //                     </select>
// //                 </div>
// //                 <div>
// //                     <label className="block text-sm font-medium text-gray-400">Filter by Section</label>
// //                     <select
// //                         value={filterSection}
// //                         onChange={e => setFilterSection(e.target.value)}
// //                         className="mt-1 bg-gray-700 border-gray-600 rounded-md py-2 px-3 text-white"
// //                     >
// //                         {uniqueSections.map(section => <option key={section} value={section}>{section}</option>)}
// //                     </select>
// //                 </div>
// //             </div>

// //             {/* Results Table */}
// //             <div className="overflow-x-auto">
// //                 <table className="min-w-full divide-y divide-gray-700">
// //                     <thead className="bg-gray-700">
// //                         <tr>
// //                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">S.No</th>
// //                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Regd No</th>
// //                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
// //                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Branch</th>
// //                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Section</th>
// //                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Score</th>
// //                         </tr>
// //                     </thead>
// //                     <tbody className="bg-gray-800 divide-y divide-gray-700">
// //                         {filteredAndSortedSubmissions.map((sub, index) => (
// //                             <tr key={sub.id}>
// //                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{index + 1}</td>
// //                                 <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-white">{sub.regd_no}</td>
// //                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{sub.student_name}</td>
// //                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{sub.branch}</td>
// //                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{sub.section}</td>
// //                                 <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-400">{sub.totalScore || 0}</td>
// //                             </tr>
// //                         ))}
// //                     </tbody>
// //                 </table>
// //                  {filteredAndSortedSubmissions.length === 0 && (
// //                     <div className="text-center py-8 text-gray-500">
// //                         No results match the current filters.
// //                     </div>
// //                 )}
// //             </div>
// //         </div>
// //     );
// // };

// // export default ResultsTable; 

// // import React, { useState, useEffect, useMemo } from 'react';
// // import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
// // import { db } from '../../firebase/config';
// // import * as XLSX from 'xlsx';

// // /* ─── Helpers ─────────────────────────────────────────────────────────── */
// // function exportToExcel(data, filename) {
// //   const ws = XLSX.utils.json_to_sheet(data.map((s, i) => ({
// //     '#': i + 1,
// //     'Reg No': s.studentRegNo || s.studentId || '—',
// //     'Name': s.studentName || '—',
// //     'Score': s.totalScore ?? 0,
// //     'Status': s.status || 'completed',
// //     'Submitted At': s.submittedAt?.toDate?.()?.toLocaleString() || s.submittedAt || '—',
// //     'Violations': s.violations ?? 0,
// //   })));
// //   const wb = XLSX.utils.book_new();
// //   XLSX.utils.book_append_sheet(wb, ws, 'Results');
// //   XLSX.writeFile(wb, `${filename}_${new Date().toLocaleDateString().replace(/\//g,'-')}.xlsx`);
// // }

// // /* ─── Score bar ── */
// // function ScoreBar({ score, max }) {
// //   const pct = max > 0 ? Math.min(100, (score / max) * 100) : 0;
// //   const color = pct >= 80 ? '#3fb950' : pct >= 50 ? '#f0883e' : '#f85149';
// //   return (
// //     <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
// //       <div style={{ flex: 1, height: 5, background: '#21262d', borderRadius: 3, overflow: 'hidden' }}>
// //         <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 3, transition: 'width 0.6s ease' }} />
// //       </div>
// //       <span style={{ fontSize: 13, fontWeight: 700, color, minWidth: 30, textAlign: 'right' }}>{score}</span>
// //     </div>
// //   );
// // }

// // /* ─── Main Component ─────────────────────────────────────────────────── */
// // const ResultsTable = ({ examTitle, examId }) => {
// //   const [submissions, setSubmissions] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);
// //   const [search, setSearch] = useState('');
// //   const [sortKey, setSortKey] = useState('totalScore');
// //   const [sortDir, setSortDir] = useState('desc');

// //   useEffect(() => {
// //     const fetchSubmissions = async () => {
// //       if (!examId) { setLoading(false); return; }
// //       try {
// //         const q = query(
// //           collection(db, 'submissions'),
// //           where('examId', '==', examId),
// //           orderBy('totalScore', 'desc')
// //         );
// //         const snap = await getDocs(q);
// //         setSubmissions(snap.docs.map(d => ({ id: d.id, ...d.data() })));
// //       } catch (err) {
// //         // Fallback without orderBy if index not yet built
// //         try {
// //           const q2 = query(collection(db, 'submissions'), where('examId', '==', examId));
// //           const snap2 = await getDocs(q2);
// //           setSubmissions(snap2.docs.map(d => ({ id: d.id, ...d.data() })));
// //         } catch (err2) {
// //           setError('Failed to load results: ' + err2.message);
// //         }
// //       } finally {
// //         setLoading(false);
// //       }
// //     };
// //     fetchSubmissions();
// //   }, [examId]);

// //   const maxScore = useMemo(() => Math.max(1, ...submissions.map(s => s.totalScore ?? 0)), [submissions]);

// //   const sorted = useMemo(() => {
// //     let list = [...submissions];
// //     if (search.trim()) {
// //       const q = search.toLowerCase();
// //       list = list.filter(s =>
// //         (s.studentName || '').toLowerCase().includes(q) ||
// //         (s.studentRegNo || '').toLowerCase().includes(q) ||
// //         (s.studentId || '').toLowerCase().includes(q)
// //       );
// //     }
// //     list.sort((a, b) => {
// //       let va = a[sortKey] ?? 0, vb = b[sortKey] ?? 0;
// //       if (typeof va === 'string') va = va.toLowerCase();
// //       if (typeof vb === 'string') vb = vb.toLowerCase();
// //       return sortDir === 'asc' ? (va > vb ? 1 : -1) : (va < vb ? 1 : -1);
// //     });
// //     return list;
// //   }, [submissions, search, sortKey, sortDir]);

// //   const avgScore = submissions.length ? Math.round(submissions.reduce((a, s) => a + (s.totalScore ?? 0), 0) / submissions.length) : 0;
// //   const passRate = submissions.length ? Math.round(submissions.filter(s => (s.totalScore ?? 0) >= maxScore * 0.5).length / submissions.length * 100) : 0;

// //   const toggleSort = key => {
// //     if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
// //     else { setSortKey(key); setSortDir('desc'); }
// //   };

// //   const SortIcon = ({ k }) => (
// //     <span style={{ fontSize: 10, color: sortKey === k ? '#f0883e' : '#6e7681', marginLeft: 4 }}>
// //       {sortKey === k ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}
// //     </span>
// //   );

// //   if (loading) return (
// //     <div style={{ padding: '3rem', textAlign: 'center' }}>
// //       <div style={{ width: 36, height: 36, border: '3px solid #30363d', borderTopColor: '#58a6ff', borderRadius: '50%', animation: 'spin .8s linear infinite', margin: '0 auto' }} />
// //       <p style={{ color: '#8b949e', marginTop: 12, fontSize: 14 }}>Loading results...</p>
// //       <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
// //     </div>
// //   );

// //   return (
// //     <div style={{ fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif" }}>
// //       {/* Header */}
// //       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
// //         <div>
// //           <h2 style={{ fontSize: 22, fontWeight: 800, color: '#e6edf3', marginBottom: 4 }}>
// //             📊 Results
// //           </h2>
// //           <p style={{ fontSize: 14, color: '#8b949e' }}>
// //             {examTitle} · {submissions.length} submission{submissions.length !== 1 ? 's' : ''}
// //           </p>
// //         </div>
// //         <button
// //           onClick={() => exportToExcel(sorted, (examTitle || 'exam').replace(/\s+/g,'_').toLowerCase())}
// //           disabled={submissions.length === 0}
// //           style={{ padding: '8px 18px', background: 'rgba(63,185,80,0.1)', border: '1px solid rgba(63,185,80,0.3)', borderRadius: 8, color: '#3fb950', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
// //           ⬇ Export XLSX
// //         </button>
// //       </div>

// //       {/* Stats row */}
// //       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
// //         {[
// //           { label: 'Total Submissions', val: submissions.length, color: '#58a6ff', icon: '👥' },
// //           { label: 'Average Score', val: avgScore, color: '#f0883e', icon: '📈' },
// //           { label: 'Highest Score', val: Math.max(0, ...submissions.map(s => s.totalScore ?? 0)), color: '#3fb950', icon: '🏆' },
// //           { label: 'Pass Rate', val: `${passRate}%`, color: '#bc8cff', icon: '✅' },
// //         ].map(({ label, val, color, icon }) => (
// //           <div key={label} style={{ background: '#161b22', border: '1px solid #21262d', borderRadius: 12, padding: '16px 18px' }}>
// //             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
// //               <p style={{ fontSize: 11, fontWeight: 700, color: '#8b949e', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</p>
// //               <span style={{ fontSize: 16 }}>{icon}</span>
// //             </div>
// //             <p style={{ fontSize: 28, fontWeight: 800, color, lineHeight: 1 }}>{val}</p>
// //           </div>
// //         ))}
// //       </div>

// //       {/* Search */}
// //       <div style={{ marginBottom: 16 }}>
// //         <div style={{ position: 'relative', maxWidth: 360 }}>
// //           <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#8b949e', fontSize: 14 }}>🔍</span>
// //           <input
// //             value={search}
// //             onChange={e => setSearch(e.target.value)}
// //             placeholder="Search by name or reg number..."
// //             style={{ width: '100%', background: '#161b22', border: '1px solid #30363d', borderRadius: 8, padding: '9px 14px 9px 36px', color: '#e6edf3', fontSize: 14, outline: 'none' }}
// //           />
// //         </div>
// //       </div>

// //       {error && (
// //         <div style={{ padding: 16, background: 'rgba(248,81,73,0.1)', border: '1px solid rgba(248,81,73,0.3)', borderRadius: 8, color: '#f85149', fontSize: 14, marginBottom: 16 }}>
// //           {error}
// //         </div>
// //       )}

// //       {/* Table */}
// //       <div style={{ background: '#161b22', border: '1px solid #21262d', borderRadius: 12, overflow: 'hidden' }}>
// //         {/* Header row */}
// //         <div style={{ display: 'grid', gridTemplateColumns: '48px 80px 1fr 1fr 180px 100px 80px', gap: 0, background: '#0d1117', borderBottom: '1px solid #21262d' }}>
// //           {[
// //             { label: '#', k: null },
// //             { label: 'Rank', k: 'totalScore' },
// //             { label: 'Name', k: 'studentName' },
// //             { label: 'Reg No', k: 'studentRegNo' },
// //             { label: 'Score', k: 'totalScore' },
// //             { label: 'Status', k: 'status' },
// //             { label: 'Violations', k: 'violations' },
// //           ].map(({ label, k }) => (
// //             <div key={label}
// //               onClick={() => k && toggleSort(k)}
// //               style={{ padding: '10px 14px', fontSize: 11, fontWeight: 700, color: k === sortKey ? '#f0883e' : '#8b949e', textTransform: 'uppercase', letterSpacing: '0.08em', cursor: k ? 'pointer' : 'default', userSelect: 'none', display: 'flex', alignItems: 'center' }}>
// //               {label}
// //               {k && <SortIcon k={k} />}
// //             </div>
// //           ))}
// //         </div>

// //         {/* Rows */}
// //         {sorted.length === 0 ? (
// //           <div style={{ padding: '3rem', textAlign: 'center' }}>
// //             <p style={{ fontSize: 40, marginBottom: 12 }}>📭</p>
// //             <p style={{ color: '#8b949e', fontSize: 15 }}>{search ? 'No results match your search.' : 'No submissions yet.'}</p>
// //           </div>
// //         ) : sorted.map((sub, i) => {
// //           const rankInAll = submissions.findIndex(s => s.id === sub.id);
// //           const rankMedal = rankInAll === 0 ? '🥇' : rankInAll === 1 ? '🥈' : rankInAll === 2 ? '🥉' : null;
// //           return (
// //             <div key={sub.id}
// //               style={{ display: 'grid', gridTemplateColumns: '48px 80px 1fr 1fr 180px 100px 80px', gap: 0, borderBottom: '1px solid #21262d', transition: 'background .1s' }}
// //               onMouseEnter={e => e.currentTarget.style.background = '#21262d'}
// //               onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
// //               <div style={{ padding: '12px 14px', fontSize: 13, color: '#8b949e', display: 'flex', alignItems: 'center' }}>{i + 1}</div>
// //               <div style={{ padding: '12px 14px', fontSize: 16, display: 'flex', alignItems: 'center' }}>{rankMedal || <span style={{ fontSize: 12, color: '#8b949e', fontWeight: 700 }}>#{rankInAll + 1}</span>}</div>
// //               <div style={{ padding: '12px 14px', display: 'flex', alignItems: 'center' }}>
// //                 <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#f0883e,#bc8cff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#fff', marginRight: 10, flexShrink: 0 }}>
// //                   {(sub.studentName || '?').charAt(0).toUpperCase()}
// //                 </div>
// //                 <span style={{ fontSize: 14, fontWeight: 600, color: '#e6edf3' }}>{sub.studentName || '—'}</span>
// //               </div>
// //               <div style={{ padding: '12px 14px', display: 'flex', alignItems: 'center' }}>
// //                 <span style={{ fontSize: 13, fontFamily: 'monospace', color: '#8b949e' }}>{sub.studentRegNo || sub.studentId || '—'}</span>
// //               </div>
// //               <div style={{ padding: '12px 14px', display: 'flex', alignItems: 'center' }}>
// //                 <ScoreBar score={sub.totalScore ?? 0} max={maxScore} />
// //               </div>
// //               <div style={{ padding: '12px 14px', display: 'flex', alignItems: 'center' }}>
// //                 <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 6, background: sub.status === 'completed' ? 'rgba(63,185,80,0.1)' : 'rgba(88,166,255,0.1)', color: sub.status === 'completed' ? '#3fb950' : '#58a6ff', border: `1px solid ${sub.status === 'completed' ? 'rgba(63,185,80,0.3)' : 'rgba(88,166,255,0.3)'}` }}>
// //                   {sub.status || 'done'}
// //                 </span>
// //               </div>
// //               <div style={{ padding: '12px 14px', display: 'flex', alignItems: 'center' }}>
// //                 <span style={{ fontSize: 13, fontWeight: 600, color: (sub.violations ?? 0) > 0 ? '#f85149' : '#8b949e' }}>
// //                   {(sub.violations ?? 0) > 0 ? `⚠️ ${sub.violations}` : '—'}
// //                 </span>
// //               </div>
// //             </div>
// //           );
// //         })}
// //       </div>

// //       <p style={{ fontSize: 12, color: '#8b949e', marginTop: 12, textAlign: 'right' }}>
// //         Showing {sorted.length} of {submissions.length} submissions
// //       </p>
// //     </div>
// //   );
// // };

// // export default ResultsTable;




















// // ============================================================
// // ResultsTable.jsx  –  Mind Code Platform
// // KEY ADDITIONS:
// //   1. "Overall Report" button → downloads overall PDF
// //   2. "Student Wise Report" button → downloads per-student PDF
// //   3. Score column shows MCQ + Coding breakdown
// //   4. College logo is fetched from Firestore for the PDF header
// //   5. Questions are fetched here so the PDF has full context
// // ============================================================

// import React, { useState, useEffect, useMemo } from 'react';
// import { collection, query, where, getDocs, getDoc, doc, orderBy } from 'firebase/firestore';
// import { db } from '../../firebase/config';
// import * as XLSX from 'xlsx';
// import { generateOverallReport, generateStudentWiseReport } from '../../utils/reportGenerator';

// // ── Excel export (unchanged) ──────────────────────────────────
// function exportToExcel(data, filename) {
//   const ws = XLSX.utils.json_to_sheet(data.map((s, i) => ({
//     '#':          i + 1,
//     'Reg No':     s.studentRegNo || s.studentId || '—',
//     'Name':       s.studentName  || '—',
//     'MCQ Score':  s.mcqScore     ?? 0,
//     'Coding Score': s.codingScore ?? 0,
//     'Total Score':  s.totalScore  ?? 0,
//     'Status':     s.status || 'completed',
//     'Submitted':  s.submittedAt?.toDate?.()?.toLocaleString() || s.submittedAt || '—',
//     'Violations': s.violations   ?? 0,
//   })));
//   const wb = XLSX.utils.book_new();
//   XLSX.utils.book_append_sheet(wb, ws, 'Results');
//   XLSX.writeFile(wb, `${filename}_${new Date().toLocaleDateString('en-IN').replace(/\//g,'-')}.xlsx`);
// }

// // ── Score bar ─────────────────────────────────────────────────
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

// // ── Main component ────────────────────────────────────────────
// const ResultsTable = ({ examTitle, examId, exam, collegeName }) => {
//   const [submissions, setSubmissions] = useState([]);
//   const [questions,   setQuestions]   = useState([]);
//   const [loading,     setLoading]     = useState(true);
//   const [pdfLoading,  setPdfLoading]  = useState(null);   // 'overall' | 'student'
//   const [error,       setError]       = useState(null);
//   const [search,      setSearch]      = useState('');
//   const [sortKey,     setSortKey]     = useState('totalScore');
//   const [sortDir,     setSortDir]     = useState('desc');

//   // ── Fetch submissions + questions ─────────────────────────────
//   useEffect(() => {
//     const fetchAll = async () => {
//       if (!examId) { setLoading(false); return; }
//       try {
//         // Submissions
//         const q = query(
//           collection(db, 'submissions'),
//           where('examId', '==', examId),
//           orderBy('totalScore', 'desc'),
//         );
//         let snap;
//         try {
//           snap = await getDocs(q);
//         } catch {
//           // index not built yet, fall back without orderBy
//           snap = await getDocs(query(collection(db, 'submissions'), where('examId', '==', examId)));
//         }
//         setSubmissions(snap.docs.map(d => ({ id: d.id, ...d.data() })));

//         // Questions (for PDF breakdown)
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

//   const maxScore = useMemo(() => Math.max(1, ...submissions.map(s => s.totalScore ?? 0)), [submissions]);

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

//   const avgScore  = submissions.length ? Math.round(submissions.reduce((a, s) => a + (s.totalScore ?? 0), 0) / submissions.length) : 0;
//   const passRate  = submissions.length ? Math.round(submissions.filter(s => (s.totalScore ?? 0) >= maxScore * 0.4).length / submissions.length * 100) : 0;

//   const toggleSort = key => {
//     if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
//     else { setSortKey(key); setSortDir('desc'); }
//   };
//   const SortIcon = ({ k }) => (
//     <span style={{ fontSize: 10, color: sortKey === k ? '#f0883e' : '#6e7681', marginLeft: 4 }}>
//       {sortKey === k ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}
//     </span>
//   );

//   // ── College logo helper ───────────────────────────────────────
//   const getCollegeLogo = async () => {
//     if (!exam?.assignedColleges?.length) return null;
//     try {
//       // Try to find the college document by name
//       const snap = await getDocs(
//         query(collection(db, 'colleges'), where('name', '==', exam.assignedColleges[0]))
//       );
//       if (!snap.empty) return snap.docs[0].data().logoUrl || null;
//     } catch {}
//     return null;
//   };

//   // ── PDF handlers ──────────────────────────────────────────────
//   const handleOverallPDF = async () => {
//     if (!submissions.length) { alert('No submissions yet.'); return; }
//     setPdfLoading('overall');
//     try {
//       const logoUrl = await getCollegeLogo();
//       let logoDataUrl = null;
//       if (logoUrl) {
//         // Convert URL to base64 for jsPDF
//         try {
//           const res  = await fetch(logoUrl);
//           const blob = await res.blob();
//           logoDataUrl = await new Promise((res) => {
//             const r = new FileReader();
//             r.onload = () => res(r.result);
//             r.readAsDataURL(blob);
//           });
//         } catch {}
//       }

//       generateOverallReport({
//         examTitle:          examTitle || 'Exam',
//         exam,
//         submissions,
//         questions,
//         collegeName:        collegeName || exam?.assignedColleges?.join(', ') || 'All Colleges',
//         collegeLogoDataUrl: logoDataUrl,
//       });
//     } catch (e) {
//       console.error(e);
//       alert('PDF generation failed: ' + e.message + '\n\nMake sure jspdf and jspdf-autotable are installed:\nnpm install jspdf jspdf-autotable');
//     }
//     setPdfLoading(null);
//   };

//   const handleStudentWisePDF = async () => {
//     if (!submissions.length) { alert('No submissions yet.'); return; }
//     if (submissions.length > 200) {
//       if (!window.confirm(`Generating ${submissions.length} pages. This may take a few seconds. Continue?`)) return;
//     }
//     setPdfLoading('student');
//     try {
//       const logoUrl = await getCollegeLogo();
//       let logoDataUrl = null;
//       if (logoUrl) {
//         try {
//           const res  = await fetch(logoUrl);
//           const blob = await res.blob();
//           logoDataUrl = await new Promise((res) => {
//             const r = new FileReader();
//             r.onload = () => res(r.result);
//             r.readAsDataURL(blob);
//           });
//         } catch {}
//       }

//       generateStudentWiseReport({
//         examTitle:          examTitle || 'Exam',
//         exam,
//         submissions,
//         questions,
//         collegeName:        collegeName || exam?.assignedColleges?.join(', ') || 'All Colleges',
//         collegeLogoDataUrl: logoDataUrl,
//       });
//     } catch (e) {
//       console.error(e);
//       alert('PDF generation failed: ' + e.message + '\n\nMake sure jspdf and jspdf-autotable are installed:\nnpm install jspdf jspdf-autotable');
//     }
//     setPdfLoading(null);
//   };

//   // ── Loading ───────────────────────────────────────────────────
//   if (loading) return (
//     <div style={{ padding: '3rem', textAlign: 'center' }}>
//       <div style={{ width: 36, height: 36, border: '3px solid #30363d', borderTopColor: '#58a6ff', borderRadius: '50%', animation: 'spin .8s linear infinite', margin: '0 auto' }} />
//       <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
//       <p style={{ color: '#8b949e', marginTop: 12, fontSize: 14 }}>Loading results...</p>
//     </div>
//   );

//   // ── Main render ───────────────────────────────────────────────
//   return (
//     <div style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>

//       {/* ── Header row ── */}
//       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
//         <div>
//           <h2 style={{ fontSize: 22, fontWeight: 800, color: '#e6edf3', marginBottom: 4 }}>
//             📊 Exam Results
//           </h2>
//           <p style={{ fontSize: 14, color: '#8b949e' }}>
//             {examTitle} · {submissions.length} submission{submissions.length !== 1 ? 's' : ''}
//           </p>
//         </div>

//         {/* Action buttons */}
//         <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
//           {/* Overall Report PDF */}
//           <button
//             onClick={handleOverallPDF}
//             disabled={!!pdfLoading || submissions.length === 0}
//             style={{
//               padding: '8px 16px',
//               background: pdfLoading === 'overall' ? 'rgba(59,130,246,0.08)' : 'rgba(59,130,246,0.12)',
//               border: '1px solid rgba(59,130,246,0.3)',
//               borderRadius: 8, color: '#60a5fa', fontSize: 13, fontWeight: 700,
//               cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
//               opacity: pdfLoading ? 0.7 : 1,
//             }}
//           >
//             {pdfLoading === 'overall' ? '⏳ Generating...' : '📄 Overall Report'}
//           </button>

//           {/* Student-Wise PDF */}
//           <button
//             onClick={handleStudentWisePDF}
//             disabled={!!pdfLoading || submissions.length === 0}
//             style={{
//               padding: '8px 16px',
//               background: pdfLoading === 'student' ? 'rgba(124,77,255,0.08)' : 'rgba(124,77,255,0.12)',
//               border: '1px solid rgba(124,77,255,0.3)',
//               borderRadius: 8, color: '#a78bfa', fontSize: 13, fontWeight: 700,
//               cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
//               opacity: pdfLoading ? 0.7 : 1,
//             }}
//           >
//             {pdfLoading === 'student' ? '⏳ Generating...' : '👤 Student Wise Report'}
//           </button>

//           {/* Excel export */}
//           <button
//             onClick={() => exportToExcel(sorted, (examTitle || 'exam').replace(/\s+/g,'_').toLowerCase())}
//             disabled={submissions.length === 0}
//             style={{
//               padding: '8px 16px',
//               background: 'rgba(63,185,80,0.1)',
//               border: '1px solid rgba(63,185,80,0.3)',
//               borderRadius: 8, color: '#3fb950', fontSize: 13, fontWeight: 700,
//               cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
//             }}
//           >
//             ⬇ Export XLSX
//           </button>
//         </div>
//       </div>

//       {/* PDF note */}
//       <div style={{ marginBottom: 16, padding: '10px 14px', background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)', borderRadius: 8 }}>
//         <p style={{ fontSize: 12, color: '#8b949e', margin: 0 }}>
//           📌 PDFs include college logo (fetched from DB) + "Mind Code | Powered by Mind Spark" branding on every page.
//           Requires <code style={{ background: '#21262d', padding: '1px 5px', borderRadius: 3 }}>npm install jspdf jspdf-autotable</code>
//         </p>
//       </div>

//       {/* ── Stat boxes ── */}
//       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
//         {[
//           { label: 'Total Submissions', val: submissions.length,                           color: '#58a6ff', icon: '👥' },
//           { label: 'Average Score',     val: avgScore,                                     color: '#f0883e', icon: '📈' },
//           { label: 'Highest Score',     val: Math.max(0, ...submissions.map(s => s.totalScore ?? 0)), color: '#3fb950', icon: '🏆' },
//           { label: 'Pass Rate (≥40%)',  val: `${passRate}%`,                               color: '#bc8cff', icon: '✅' },
//         ].map(({ label, val, color, icon }) => (
//           <div key={label} style={{ background: '#161b22', border: '1px solid #21262d', borderRadius: 12, padding: '16px 18px' }}>
//             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
//               <p style={{ fontSize: 11, fontWeight: 700, color: '#8b949e', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</p>
//               <span style={{ fontSize: 16 }}>{icon}</span>
//             </div>
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

//       {/* ── Table ── */}
//       <div style={{ background: '#161b22', border: '1px solid #21262d', borderRadius: 12, overflow: 'hidden' }}>

//         {/* Table header */}
//         <div style={{ display: 'grid', gridTemplateColumns: '48px 70px 1fr 1fr 90px 90px 160px 80px 80px', background: '#0d1117', borderBottom: '1px solid #21262d' }}>
//           {[
//             { label: '#',          k: null         },
//             { label: 'Rank',       k: 'totalScore' },
//             { label: 'Name',       k: 'studentName'},
//             { label: 'Reg No',     k: 'studentRegNo'},
//             { label: 'MCQ',        k: 'mcqScore'   },
//             { label: 'Coding',     k: 'codingScore'},
//             { label: 'Total Score',k: 'totalScore' },
//             { label: 'Status',     k: 'status'     },
//             { label: 'Violations', k: 'violations' },
//           ].map(({ label, k }) => (
//             <div key={label}
//               onClick={() => k && toggleSort(k)}
//               style={{ padding: '10px 12px', fontSize: 11, fontWeight: 700, color: k === sortKey ? '#f0883e' : '#8b949e', textTransform: 'uppercase', letterSpacing: '0.08em', cursor: k ? 'pointer' : 'default', userSelect: 'none', display: 'flex', alignItems: 'center' }}>
//               {label}{k && <SortIcon k={k} />}
//             </div>
//           ))}
//         </div>

//         {/* Rows */}
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

//               {/* # */}
//               <div style={{ padding: '12px', fontSize: 13, color: '#8b949e', display: 'flex', alignItems: 'center' }}>{i + 1}</div>

//               {/* Rank */}
//               <div style={{ padding: '12px', fontSize: 16, display: 'flex', alignItems: 'center' }}>
//                 {medal || <span style={{ fontSize: 12, color: '#8b949e', fontWeight: 700 }}>#{rankInAll + 1}</span>}
//               </div>

//               {/* Name */}
//               <div style={{ padding: '12px', display: 'flex', alignItems: 'center', gap: 10 }}>
//                 <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg,#f0883e,#bc8cff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
//                   {(sub.studentName || '?').charAt(0).toUpperCase()}
//                 </div>
//                 <span style={{ fontSize: 14, fontWeight: 600, color: '#e6edf3' }}>{sub.studentName || '—'}</span>
//               </div>

//               {/* Reg No */}
//               <div style={{ padding: '12px', display: 'flex', alignItems: 'center' }}>
//                 <span style={{ fontSize: 12, fontFamily: 'monospace', color: '#8b949e' }}>{sub.studentRegNo || sub.studentId || '—'}</span>
//               </div>

//               {/* MCQ score */}
//               <div style={{ padding: '12px', display: 'flex', alignItems: 'center' }}>
//                 <span style={{ fontSize: 13, fontWeight: 600, color: '#58a6ff' }}>{sub.mcqScore ?? '—'}</span>
//               </div>

//               {/* Coding score */}
//               <div style={{ padding: '12px', display: 'flex', alignItems: 'center' }}>
//                 <span style={{ fontSize: 13, fontWeight: 600, color: '#f0883e' }}>{sub.codingScore ?? '—'}</span>
//               </div>

//               {/* Total score bar */}
//               <div style={{ padding: '12px', display: 'flex', alignItems: 'center' }}>
//                 <ScoreBar score={sub.totalScore ?? 0} max={maxScore} />
//               </div>

//               {/* Status */}
//               <div style={{ padding: '12px', display: 'flex', alignItems: 'center' }}>
//                 <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 6, background: sub.status === 'completed' ? 'rgba(63,185,80,0.1)' : 'rgba(88,166,255,0.1)', color: sub.status === 'completed' ? '#3fb950' : '#58a6ff', border: `1px solid ${sub.status === 'completed' ? 'rgba(63,185,80,0.3)' : 'rgba(88,166,255,0.3)'}` }}>
//                   {sub.status || 'done'}
//                 </span>
//               </div>

//               {/* Violations */}
//               <div style={{ padding: '12px', display: 'flex', alignItems: 'center' }}>
//                 <span style={{ fontSize: 13, fontWeight: 600, color: (sub.violations ?? 0) > 0 ? '#f85149' : '#8b949e' }}>
//                   {(sub.violations ?? 0) > 0 ? `⚠️ ${sub.violations}` : '—'}
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

function exportToExcel(data, filename) {
  const ws = XLSX.utils.json_to_sheet(data.map((s, i) => ({
    '#':            i + 1,
    'Reg No':       s.studentRegNo || s.studentId || '-',
    'Name':         s.studentName  || '-',
    'MCQ Score':    s.mcqScore     ?? 0,
    'Coding Score': s.codingScore  ?? 0,
    'Total Score':  s.totalScore   ?? 0,
    'Status':       s.status || 'completed',
    'Submitted':    s.submittedAt?.toDate?.()?.toLocaleString() || s.submittedAt || '-',
    'Violations':   s.violations   ?? 0,
  })));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Results');
  XLSX.writeFile(wb, `${filename}_${new Date().toLocaleDateString('en-IN').replace(/\//g, '-')}.xlsx`);
}

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
// Convert a Firebase Storage download URL → base64 data-URL.
//
// Firebase Storage download URLs include an access token and load fine in
// <img> tags. The problem is that canvas.toDataURL() throws SecurityError
// for cross-origin images. We use two strategies:
//   1. fetch()            — works when the bucket has CORS configured
//   2. Image + Canvas     — works when crossOrigin is allowed
// If both fail we return null and the header shows a letter placeholder.
// ─────────────────────────────────────────────────────────────────────────────
async function logoUrlToBase64(url) {
  if (!url || typeof url !== 'string') return null;

  // Strategy 1: fetch()
  try {
    const res = await fetch(url);
    if (res.ok) {
      const blob = await res.blob();
      return await new Promise((resolve, reject) => {
        const r   = new FileReader();
        r.onload  = () => resolve(r.result);
        r.onerror = reject;
        r.readAsDataURL(blob);
      });
    }
  } catch (_) { /* fall through to strategy 2 */ }

  // Strategy 2: Image + Canvas
  return new Promise((resolve) => {
    const img       = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas  = document.createElement('canvas');
        canvas.width  = img.naturalWidth  || 64;
        canvas.height = img.naturalHeight || 64;
        canvas.getContext('2d').drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      } catch {
        resolve(null); // canvas tainted
      }
    };
    img.onerror = () => resolve(null);
    // Do NOT append cache-bust params — they invalidate the Firebase auth token
    img.src = url;
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Resolve the college logo for a given exam.
//
// Key facts about this codebase's Firestore structure:
//   • Colleges use AUTO-GENERATED document IDs (created with addDoc)
//   • Each college document has a  `name`    field  (e.g. "VFSTR")
//   • Each college document has a  `logoUrl` field  (Firebase Storage URL)
//   • exam.assignedColleges  stores an array of NAME strings  (e.g. ["VFSTR"])
//
// The faculty dashboard already fetches all tenants → we receive them via
// the `tenants` prop and match by name first (zero extra network calls).
// Only if that fails do we fall back to a Firestore query.
// ─────────────────────────────────────────────────────────────────────────────
async function resolveCollegeLogoBase64(exam, tenants) {
  if (!exam?.assignedColleges?.length) return null;

  const targetName = exam.assignedColleges[0]; // e.g. "VFSTR"
  let logoUrl = null;

  // ── 1. Use tenants already in memory (fastest, no network) ──────────────
  if (Array.isArray(tenants) && tenants.length > 0) {
    const match = tenants.find(t => t.name === targetName || t.id === targetName);
    if (match?.logoUrl) {
      logoUrl = match.logoUrl;
      console.log('[CollegeLogo] resolved from tenants prop:', targetName, '->', logoUrl.slice(0, 60));
    }
  }

  // ── 2. Firestore: query by name field ────────────────────────────────────
  if (!logoUrl) {
    try {
      const snap = await getDocs(
        query(collection(db, 'colleges'), where('name', '==', targetName))
      );
      if (!snap.empty) {
        logoUrl = snap.docs[0].data().logoUrl || null;
        console.log('[CollegeLogo] resolved via name query:', targetName);
      }
    } catch (e) {
      console.warn('[CollegeLogo] name query error:', e.message);
    }
  }

  // ── 3. Firestore: try doc ID = college name (legacy support) ────────────
  if (!logoUrl) {
    try {
      const snap = await getDoc(doc(db, 'colleges', targetName));
      if (snap.exists()) {
        logoUrl = snap.data().logoUrl || null;
        console.log('[CollegeLogo] resolved via doc ID:', targetName);
      }
    } catch (e) {
      console.warn('[CollegeLogo] doc ID lookup error:', e.message);
    }
  }

  if (!logoUrl) {
    console.warn('[CollegeLogo] No logoUrl found for:', targetName);
    return null;
  }

  const base64 = await logoUrlToBase64(logoUrl);
  if (!base64) {
    console.warn('[CollegeLogo] logoUrlToBase64 failed for:', logoUrl.slice(0, 80));
  }
  return base64;
}

// ─────────────────────────────────────────────────────────────────────────────
// ResultsTable
//
// Props:
//   examTitle  – string
//   examId     – Firestore exam document ID
//   exam       – full exam object (must include assignedColleges[])
//   collegeName – display name string (from parent)
//   tenants    – NEW: array of college objects loaded by the faculty dashboard
//                { id, name, logoUrl, ... }
//                Pass this so logo resolution happens without extra DB calls.
// ─────────────────────────────────────────────────────────────────────────────
const ResultsTable = ({ examTitle, examId, exam, collegeName, tenants = [] }) => {
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
        const q = query(
          collection(db, 'submissions'),
          where('examId', '==', examId),
          orderBy('totalScore', 'desc'),
        );
        let snap;
        try {
          snap = await getDocs(q);
        } catch {
          snap = await getDocs(query(collection(db, 'submissions'), where('examId', '==', examId)));
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

  const getLogoAndName = async () => {
    const logoDataUrl = await resolveCollegeLogoBase64(exam, tenants);
    const name        = collegeName || exam?.assignedColleges?.join(', ') || 'All Colleges';
    return { logoDataUrl, name };
  };

  const handleOverallPDF = async () => {
    if (!submissions.length) { alert('No submissions yet.'); return; }
    setPdfLoading('overall');
    try {
      const { logoDataUrl, name } = await getLogoAndName();
      generateOverallReport({ examTitle: examTitle || 'Exam', exam, submissions, questions, collegeName: name, collegeLogoDataUrl: logoDataUrl });
    } catch (e) {
      console.error(e);
      alert('PDF generation failed: ' + e.message);
    }
    setPdfLoading(null);
  };

  const handleStudentWisePDF = async () => {
    if (!submissions.length) { alert('No submissions yet.'); return; }
    if (submissions.length > 200 && !window.confirm(`Generating ${submissions.length} pages. Continue?`)) return;
    setPdfLoading('student');
    try {
      const { logoDataUrl, name } = await getLogoAndName();
      generateStudentWiseReport({ examTitle: examTitle || 'Exam', exam, submissions, questions, collegeName: name, collegeLogoDataUrl: logoDataUrl });
    } catch (e) {
      console.error(e);
      alert('PDF generation failed: ' + e.message);
    }
    setPdfLoading(null);
  };

  if (loading) return (
    <div style={{ padding: '3rem', textAlign: 'center' }}>
      <div style={{ width: 36, height: 36, border: '3px solid #30363d', borderTopColor: '#58a6ff', borderRadius: '50%', animation: 'spin .8s linear infinite', margin: '0 auto' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <p style={{ color: '#8b949e', marginTop: 12, fontSize: 14 }}>Loading results...</p>
    </div>
  );

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#e6edf3', marginBottom: 4 }}>Exam Results</h2>
          <p style={{ fontSize: 14, color: '#8b949e' }}>
            {examTitle} · {submissions.length} submission{submissions.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button onClick={handleOverallPDF} disabled={!!pdfLoading || submissions.length === 0}
            style={{ padding: '8px 16px', background: pdfLoading === 'overall' ? 'rgba(59,130,246,0.08)' : 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 8, color: '#60a5fa', fontSize: 13, fontWeight: 700, cursor: pdfLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 6, opacity: pdfLoading ? 0.7 : 1 }}>
            {pdfLoading === 'overall' ? 'Generating...' : 'Overall Report (PDF)'}
          </button>
          <button onClick={handleStudentWisePDF} disabled={!!pdfLoading || submissions.length === 0}
            style={{ padding: '8px 16px', background: pdfLoading === 'student' ? 'rgba(124,77,255,0.08)' : 'rgba(124,77,255,0.12)', border: '1px solid rgba(124,77,255,0.3)', borderRadius: 8, color: '#a78bfa', fontSize: 13, fontWeight: 700, cursor: pdfLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 6, opacity: pdfLoading ? 0.7 : 1 }}>
            {pdfLoading === 'student' ? 'Generating...' : 'Student Wise Report (PDF)'}
          </button>
          <button onClick={() => exportToExcel(sorted, (examTitle || 'exam').replace(/\s+/g, '_').toLowerCase())} disabled={submissions.length === 0}
            style={{ padding: '8px 16px', background: 'rgba(63,185,80,0.1)', border: '1px solid rgba(63,185,80,0.3)', borderRadius: 8, color: '#3fb950', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
            Export XLSX
          </button>
        </div>
      </div>

      {/* Info */}
      <div style={{ marginBottom: 16, padding: '10px 14px', background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)', borderRadius: 8 }}>
        <p style={{ fontSize: 12, color: '#8b949e', margin: 0 }}>
          PDFs include the college logo from the exam roster and AlgoSpark branding on every page.
          Requires <code style={{ background: '#21262d', padding: '1px 5px', borderRadius: 3 }}>npm install jspdf jspdf-autotable</code>
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Total Submissions', val: submissions.length, color: '#58a6ff' },
          { label: 'Average Score', val: avgScore, color: '#f0883e' },
          { label: 'Highest Score', val: Math.max(0, ...submissions.map(s => s.totalScore ?? 0)), color: '#3fb950' },
          { label: 'Pass Rate (>=40%)', val: `${passRate}%`, color: '#bc8cff' },
        ].map(({ label, val, color }) => (
          <div key={label} style={{ background: '#161b22', border: '1px solid #21262d', borderRadius: 12, padding: '16px 18px' }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#8b949e', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>{label}</p>
            <p style={{ fontSize: 28, fontWeight: 800, color, lineHeight: 1 }}>{val}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ position: 'relative', maxWidth: 360 }}>
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#8b949e', fontSize: 14 }}>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or reg number..."
            style={{ width: '100%', background: '#161b22', border: '1px solid #30363d', borderRadius: 8, padding: '9px 14px 9px 36px', color: '#e6edf3', fontSize: 14, outline: 'none' }} />
        </div>
      </div>

      {error && (
        <div style={{ padding: 16, background: 'rgba(248,81,73,0.1)', border: '1px solid rgba(248,81,73,0.3)', borderRadius: 8, color: '#f85149', fontSize: 14, marginBottom: 16 }}>
          {error}
        </div>
      )}

      {/* Table */}
      <div style={{ background: '#161b22', border: '1px solid #21262d', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '48px 70px 1fr 1fr 90px 90px 160px 80px 80px', background: '#0d1117', borderBottom: '1px solid #21262d' }}>
          {[
            { label: '#', k: null }, { label: 'Rank', k: 'totalScore' }, { label: 'Name', k: 'studentName' },
            { label: 'Reg No', k: 'studentRegNo' }, { label: 'MCQ', k: 'mcqScore' }, { label: 'Coding', k: 'codingScore' },
            { label: 'Total Score', k: 'totalScore' }, { label: 'Status', k: 'status' }, { label: 'Violations', k: 'violations' },
          ].map(({ label, k }) => (
            <div key={label} onClick={() => k && toggleSort(k)}
              style={{ padding: '10px 12px', fontSize: 11, fontWeight: 700, color: k === sortKey ? '#f0883e' : '#8b949e', textTransform: 'uppercase', letterSpacing: '0.08em', cursor: k ? 'pointer' : 'default', userSelect: 'none', display: 'flex', alignItems: 'center' }}>
              {label}{k && <SortIcon k={k} />}
            </div>
          ))}
        </div>

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
