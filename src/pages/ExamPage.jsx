
// import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
// import { useParams, useHistory } from 'react-router-dom';
// import { doc, getDoc } from 'firebase/firestore';
// import { db } from '../firebase/config';
// import { useAuth } from '../context/AuthContext';
// import { startSubmission, updateSubmission } from '../api/examService';
// import CodingWorkspace from '../components/workspace/CodingWorkspace';

// /* ─── Timer Hook ─────────────────────────────────────────────────────────── */
// function useTimer(totalSecs, onEnd) {
//   const [rem, setRem] = useState(totalSecs);
//   const startRef = useRef(Date.now());
//   const firedRef = useRef(false);

//   useEffect(() => {
//     startRef.current = Date.now();
//     setRem(totalSecs);
//     firedRef.current = false;
//   }, [totalSecs]);

//   useEffect(() => {
//     const t = setInterval(() => {
//       const elapsed = Math.floor((Date.now() - startRef.current) / 1000);
//       const left = Math.max(0, totalSecs - elapsed);
//       setRem(left);
//       if (left === 0 && !firedRef.current) {
//         firedRef.current = true;
//         onEnd?.();
//       }
//     }, 1000);
//     return () => clearInterval(t);
//   }, [totalSecs, onEnd]);

//   return {
//     h: Math.floor(rem / 3600),
//     m: Math.floor((rem % 3600) / 60),
//     s: rem % 60,
//     remaining: rem,
//     urgent: rem < 300,
//     pct: (rem / totalSecs) * 100,
//   };
// }

// /* ─── Question Status Colors ─────────────────────────────────────────────── */
// const Q_STATUS = {
//   unanswered: { bg: "#21262d", border: "#30363d", color: "#8b949e" },
//   answered:   { bg: "rgba(63,185,80,0.15)", border: "rgba(63,185,80,0.4)", color: "#3fb950" },
//   marked:     { bg: "rgba(88,166,255,0.15)", border: "rgba(88,166,255,0.4)", color: "#58a6ff" },
//   current:    { bg: "#f0883e", border: "#f0883e", color: "#fff" },
// };

// export default function ExamPage() {
//   const { examId, submissionId: urlSubmissionId } = useParams();
//   const { currentUser } = useAuth();
//   const history = useHistory();

//   const [exam, setExam] = useState(null);
//   const [questions, setQuestions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [submissionId, setSubmissionId] = useState(urlSubmissionId || null);

//   /* ── Exam flow state ── */
//   const [phase, setPhase] = useState("mcq"); // "mcq" | "coding" | "submitted"
//   const [currentIdx, setCurrentIdx] = useState(0);
//   const [answers, setAnswers] = useState({});
//   const [marked, setMarked] = useState(new Set());
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [showPalette, setShowPalette] = useState(true);
//   const [confirmSubmit, setConfirmSubmit] = useState(false);
//   const [violations, setViolations] = useState(0);
//   const [showViolationWarning, setShowViolationWarning] = useState(false);

//   /* ── Separate question lists using useMemo ── */
//   const mcqQuestions = useMemo(() => questions.filter(q => q.type === "MCQ"), [questions]);
//   const codingQuestions = useMemo(() => questions.filter(q => (q.type || "").toUpperCase() === "CODING"), [questions]);
  
//   const currentQuestions = phase === "mcq" ? mcqQuestions : codingQuestions;
//   const currentQ = currentQuestions[currentIdx];

//   const totalDuration = (exam?.durationMinutes ?? 60) * 60;

//   const handleFinalSubmitRef = useRef(null);
//   const timer = useTimer(
//     totalDuration,
//     useCallback(() => handleFinalSubmitRef.current?.(true), [])
//   );

//   /* ── Fetch exam ── */
//   useEffect(() => {
//     const fetchExam = async () => {
//       try {
//         const examSnap = await getDoc(doc(db, "exams", examId));
//         if (!examSnap.exists()) { setError("Exam not found."); return; }
//         const examData = { id: examSnap.id, ...examSnap.data() };
//         setExam(examData);

//         const qDocs = await Promise.all(
//           (examData.questionIds || []).map(qId => getDoc(doc(db, "questions", qId)))
//         );
//         const qs = qDocs.filter(d => d.exists()).map(d => ({ id: d.id, ...d.data() }));
//         setQuestions(qs);

//         if (!urlSubmissionId && currentUser) {
//           const sid = await startSubmission({
//             examId,
//             examTitle: examData.title,
//             studentId: currentUser.uid,
//             studentName: currentUser.displayName || currentUser.email,
//           });
//           setSubmissionId(sid);
//         }

//         const hasMCQ = qs.some(q => q.type === "MCQ");
//         if (!hasMCQ) setPhase("coding");

//       } catch (err) {
//         console.error(err);
//         setError("Failed to load exam. Please refresh.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     if (examId) fetchExam();
//   }, [examId, currentUser, urlSubmissionId]);

//   /* ── Proctoring ── */
//   useEffect(() => {
//     const enterFS = async () => {
//       try { await document.documentElement.requestFullscreen?.(); } catch {}
//     };
//     enterFS();

//     const onFSChange = () => {
//       if (!document.fullscreenElement) {
//         setViolations(v => {
//           const nv = v + 1;
//           if (nv >= 3) handleFinalSubmitRef.current?.(true);
//           return nv;
//         });
//         setShowViolationWarning(true);
//       }
//     };
//     const onVis = () => { if (document.hidden) setViolations(v => v + 1); };
//     const blockKeys = e => {
//       if (e.key === "F12" || (e.ctrlKey && e.shiftKey) || (e.ctrlKey && e.key === "u"))
//         e.preventDefault();
//     };
//     const block = e => e.preventDefault();

//     document.addEventListener("fullscreenchange", onFSChange);
//     document.addEventListener("visibilitychange", onVis);
//     document.addEventListener("keydown", blockKeys);
//     document.addEventListener("contextmenu", block);
//     document.addEventListener("copy", block);

//     return () => {
//       document.removeEventListener("fullscreenchange", onFSChange);
//       document.removeEventListener("visibilitychange", onVis);
//       document.removeEventListener("keydown", blockKeys);
//       document.removeEventListener("contextmenu", block);
//       document.removeEventListener("copy", block);
//     };
//   }, []);

//   /* ── Final Submit ── */
//   const handleFinalSubmit = async (forced = false) => {
//     if (isSubmitting) return;
//     setConfirmSubmit(false);
//     setIsSubmitting(true);
//     setPhase("submitted");

//     try {
//       if (submissionId) {
//         await updateSubmission(submissionId, {
//           status: "completed",
//           answers: Object.entries(answers).map(([qId, ans]) => ({ questionId: qId, answer: ans })),
//           submittedAt: new Date(),
//           forcedSubmit: forced,
//           violations,
//         });
//       }
//     } catch (err) {
//       console.error("Submit error:", err);
//     }
//     setIsSubmitting(false);
//   };

//   handleFinalSubmitRef.current = handleFinalSubmit;

//   const handleMCQAnswer = (questionId, option) => {
//     setAnswers(p => ({ ...p, [questionId]: option }));
//   };

//   const toggleMark = (qId) => {
//     setMarked(prev => {
//       const n = new Set(prev);
//       n.has(qId) ? n.delete(qId) : n.add(qId);
//       return n;
//     });
//   };

//   const proceedToCoding = () => {
//     const unanswered = mcqQuestions.filter(q => !answers[q.id]);
//     if (unanswered.length > 0) {
//       if (!window.confirm(`You have ${unanswered.length} unanswered MCQ(s). Proceed to Coding section?`)) return;
//     }
//     setPhase("coding");
//     setCurrentIdx(0);
//   };

//   const handleCodingSaveNext = async (code, language) => {
//     const q = codingQuestions[currentIdx];
//     if (q) {
//       const newAnswers = { ...answers, [q.id]: { code, language } };
//       setAnswers(newAnswers);
//       if (submissionId) {
//         await updateSubmission(submissionId, {
//           answers: Object.entries(newAnswers).map(([id, ans]) => ({ questionId: id, answer: ans })),
//         });
//       }
//     }
//     if (currentIdx < codingQuestions.length - 1) setCurrentIdx(i => i + 1);
//   };

//   const handleCodingSubmit = async (code, language, passedCount) => {
//     const q = codingQuestions[currentIdx];
//     if (q) setAnswers(p => ({ ...p, [q.id]: { code, language, passedCount } }));
//     await handleFinalSubmit(false);
//   };

//   const getQStatus = (q, idx) => {
//     if (currentIdx === idx) return "current";
//     if (marked.has(q.id)) return "marked";
//     if (answers[q.id]) return "answered";
//     return "unanswered";
//   };

//   const answeredCount = mcqQuestions.filter(q => answers[q.id]).length;
//   const markedCount = mcqQuestions.filter(q => marked.has(q.id)).length;

//   if (loading) return (
//     <div style={{ minHeight: "100vh", background: "#0d1117", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
//       <div style={{ width: 40, height: 40, border: "3px solid #30363d", borderTopColor: "#58a6ff", borderRadius: "50%", animation: "spin .8s linear infinite" }} />
//       <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
//     </div>
//   );

//   if (error) return (
//     <div style={{ minHeight: "100vh", background: "#0d1117", display: "flex", alignItems: "center", justifyContent: "center" }}>
//       <div style={{ background: "#161b22", border: "1px solid rgba(248,81,73,0.3)", borderRadius: 12, padding: 32, textAlign: "center" }}>
//         <p style={{ color: "#f85149" }}>{error}</p>
//         <button onClick={() => history.push("/dashboard")} style={{ marginTop: 20, padding: "10px 24px", background: "#21262d", border: "none", color: "#fff", cursor: "pointer" }}>Return Dashboard</button>
//       </div>
//     </div>
//   );

//   if (phase === "submitted") return (
//     <div style={{ minHeight: "100vh", background: "#0d1117", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "system-ui" }}>
//       <div style={{ background: "#161b22", border: "1px solid #30363d", borderRadius: 20, padding: 48, textAlign: "center", maxWidth: 500 }}>
//         <h2 style={{ color: "#3fb950" }}>Exam Submitted!</h2>
//         <button onClick={() => history.push("/dashboard")} style={{ width: "100%", padding: "14px", background: "#58a6ff", border: "none", borderRadius: 10, color: "#fff", cursor: "pointer", marginTop: 20 }}>Exit</button>
//       </div>
//     </div>
//   );

//   if (phase === "coding") {
//     return (
//       <CodingWorkspace
//         mode="exam"
//         question={codingQuestions[currentIdx]}
//         examMeta={{
//           duration: timer.remaining,
//           onTimerEnd: () => handleFinalSubmitRef.current?.(true),
//           title: exam?.title,
//           totalQuestions: codingQuestions.length,
//           currentIndex: currentIdx,
//         }}
//         onSubmit={handleCodingSubmit}
//         onSaveAndNext={handleCodingSaveNext}
//         isLastQuestion={currentIdx === codingQuestions.length - 1}
//         isSaving={isSubmitting}
//         violationCount={violations}
//         onBack={() => { setPhase("mcq"); setCurrentIdx(mcqQuestions.length - 1); }}
//       />
//     );
//   }

//   return (
//     <div style={{ minHeight: "100vh", background: "#0d1117", color: "#e6edf3", display: "flex", flexDirection: "column" }}>
//       <header style={{ background: "#161b22", borderBottom: "1px solid #21262d", padding: "0 24px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//         <span style={{ fontWeight: 700 }}>{exam?.title}</span>
//         <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//           <span style={{ fontFamily: "monospace", fontSize: 18, color: timer.urgent ? "#f85149" : "#58a6ff" }}>
//             {String(timer.h).padStart(2, "0")}:{String(timer.m).padStart(2, "0")}:{String(timer.s).padStart(2, "0")}
//           </span>
//         </div>
//         <button onClick={proceedToCoding} style={{ padding: "8px 20px", background: "#f0883e", border: "none", borderRadius: 8, color: "#fff", fontWeight: 700, cursor: "pointer" }}>
//           Next Phase →
//         </button>
//       </header>

//       <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
//         <div style={{ flex: 1, overflowY: "auto", padding: "32px 40px" }}>
//           <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
//             <span style={{ fontSize: 13, color: "#8b949e" }}>Question {currentIdx + 1} of {mcqQuestions.length}</span>
//             <button onClick={() => toggleMark(currentQ.id)} style={{ padding: "4px 12px", background: "#21262d", border: "1px solid #30363d", borderRadius: 6, color: marked.has(currentQ.id) ? "#58a6ff" : "#8b949e", cursor: "pointer" }}>
//               🔖 Mark for Review
//             </button>
//           </div>

//           <div style={{ fontSize: 18, marginBottom: 32 }} dangerouslySetInnerHTML={{ __html: currentQ?.description || currentQ?.question }} />

//           <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
//             {(currentQ?.options || []).map((opt, i) => (
//               <button key={i} onClick={() => handleMCQAnswer(currentQ.id, opt)} style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 20px", background: answers[currentQ.id] === opt ? "rgba(88,166,255,0.1)" : "#161b22", border: `2px solid ${answers[currentQ.id] === opt ? "#58a6ff" : "#21262d"}`, borderRadius: 12, cursor: "pointer", textAlign: "left" }}>
//                 <span style={{ fontSize: 16 }}>{opt}</span>
//               </button>
//             ))}
//           </div>

//           <div style={{ display: "flex", justifyContent: "space-between", marginTop: 40 }}>
//             <button onClick={() => setCurrentIdx(i => Math.max(0, i - 1))} disabled={currentIdx === 0} style={{ padding: "10px 24px", background: "#21262d", borderRadius: 8, color: "#fff", cursor: "pointer" }}>← Prev</button>
//             {currentIdx < mcqQuestions.length - 1 ? (
//               <button onClick={() => setCurrentIdx(i => i + 1)} style={{ padding: "10px 24px", background: "#21262d", borderRadius: 8, color: "#fff", cursor: "pointer" }}>Next →</button>
//             ) : (
//               <button onClick={proceedToCoding} style={{ padding: "10px 24px", background: "#3fb950", border: "none", borderRadius: 8, color: "#fff", fontWeight: 700, cursor: "pointer" }}>Coding Phase ✓</button>
//             )}
//           </div>
//         </div>

//         {showPalette && (
//           <div style={{ width: 260, background: "#161b22", borderLeft: "1px solid #21262d", padding: 16 }}>
//             <p style={{ fontSize: 12, fontWeight: 700, marginBottom: 12 }}>PALETTE</p>
//             <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 6 }}>
//               {mcqQuestions.map((q, i) => {
//                 const s = Q_STATUS[getQStatus(q, i)];
//                 return (
//                   <button key={q.id} onClick={() => setCurrentIdx(i)} style={{ width: "100%", aspectRatio: "1", borderRadius: 6, background: s.bg, border: `1px solid ${s.border}`, color: s.color, fontWeight: 700, cursor: "pointer" }}>{i + 1}</button>
//                 );
//               })}
//             </div>
//           </div>
//         )}
//       </div>

//       {showViolationWarning && (
//         <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000 }}>
//           <div style={{ background: "#161b22", borderRadius: 16, padding: 36, textAlign: "center", maxWidth: 440 }}>
//             <h3 style={{ color: "#f85149" }}>Proctoring Violation</h3>
//             <p>Fullscreen exit detected. {violations}/3 violations.</p>
//             <button onClick={() => setShowViolationWarning(false)} style={{ padding: "10px 20px", background: "#58a6ff", border: "none", borderRadius: 8, color: "#fff", cursor: "pointer", marginTop: 20 }}>Return to Exam</button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
















// // ============================================================
// // ExamPage.jsx  –  Mind Code Platform
// // KEY FIXES:
// //   1. Proctoring (fullscreen + violations) starts immediately
// //      when the page loads – covering BOTH the MCQ phase AND
// //      the Coding phase (CodingWorkspace already has its own
// //      proctoring, but the MCQ phase did not – now fixed).
// //   2. On final submit, calculateAndSaveScore() is called so
// //      totalScore = MCQ score + Coding score.
// //   3. No longer tries to set phase="coding" if there are
// //      no coding questions (edge-case crash fix).
// //   4. vite.svg 404 fixed note: add a real favicon or change
// //      index.html href="/favicon.ico".
// // ============================================================

// import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
// import { useParams, useHistory } from 'react-router-dom';
// import { doc, getDoc } from 'firebase/firestore';
// import { db } from '../firebase/config';
// import { useAuth } from '../context/AuthContext';
// import { startSubmission, updateSubmission, calculateAndSaveScore } from '../api/examService';
// import CodingWorkspace from '../components/workspace/CodingWorkspace';

// // ── Local timer hook ─────────────────────────────────────────
// function useTimer(totalSecs, onEnd) {
//   const [rem, setRem]   = useState(totalSecs);
//   const startRef        = useRef(Date.now());
//   const firedRef        = useRef(false);
//   useEffect(() => { startRef.current = Date.now(); setRem(totalSecs); firedRef.current = false; }, [totalSecs]);
//   useEffect(() => {
//     const t = setInterval(() => {
//       const left = Math.max(0, totalSecs - Math.floor((Date.now() - startRef.current) / 1000));
//       setRem(left);
//       if (left === 0 && !firedRef.current) { firedRef.current = true; onEnd?.(); }
//     }, 1000);
//     return () => clearInterval(t);
//   }, [totalSecs, onEnd]);
//   return {
//     h: Math.floor(rem / 3600),
//     m: Math.floor((rem % 3600) / 60),
//     s: rem % 60,
//     remaining: rem,
//     urgent: rem < 300,
//     pct: (rem / totalSecs) * 100,
//   };
// }

// const Q_STATUS = {
//   unanswered: { bg: '#21262d', border: '#30363d', color: '#8b949e' },
//   answered:   { bg: 'rgba(63,185,80,0.15)', border: 'rgba(63,185,80,0.4)', color: '#3fb950' },
//   marked:     { bg: 'rgba(88,166,255,0.15)', border: 'rgba(88,166,255,0.4)', color: '#58a6ff' },
//   current:    { bg: '#f0883e', border: '#f0883e', color: '#fff' },
// };

// export default function ExamPage() {
//   const { examId, submissionId: urlSubmissionId } = useParams();
//   const { currentUser }  = useAuth();
//   const history          = useHistory();

//   const [exam, setExam]                           = useState(null);
//   const [questions, setQuestions]                 = useState([]);
//   const [loading, setLoading]                     = useState(true);
//   const [error, setError]                         = useState(null);
//   const [submissionId, setSubmissionId]           = useState(urlSubmissionId || null);

//   // MCQ phase state
//   const [phase, setPhase]                         = useState('mcq');
//   const [currentIdx, setCurrentIdx]               = useState(0);
//   const [answers, setAnswers]                     = useState({});
//   const [marked, setMarked]                       = useState(new Set());

//   // Submission state
//   const [isSubmitting, setIsSubmitting]           = useState(false);
//   const [confirmSubmit, setConfirmSubmit]         = useState(false);

//   // Proctoring
//   const [violations, setViolations]               = useState(0);
//   const [showViolation, setShowViolation]         = useState(false);

//   // Derived
//   const mcqQuestions    = useMemo(() => questions.filter(q => q.type === 'MCQ'), [questions]);
//   const codingQuestions = useMemo(() => questions.filter(q => (q.type || '').toUpperCase() === 'CODING'), [questions]);
//   const currentQuestions= phase === 'mcq' ? mcqQuestions : codingQuestions;
//   const currentQ        = currentQuestions[currentIdx];
//   const totalDuration   = (exam?.durationMinutes ?? 60) * 60;

//   const handleFinalSubmitRef = useRef(null);

//   const timer = useTimer(
//     totalDuration,
//     useCallback(() => handleFinalSubmitRef.current?.(true), []),
//   );

//   // ── Fetch exam data ──────────────────────────────────────────
//   useEffect(() => {
//     const fetchExam = async () => {
//       try {
//         const examSnap = await getDoc(doc(db, 'exams', examId));
//         if (!examSnap.exists()) { setError('Exam not found.'); return; }
//         const examData = { id: examSnap.id, ...examSnap.data() };
//         setExam(examData);

//         const qDocs = await Promise.all(
//           (examData.questionIds || []).map(qId => getDoc(doc(db, 'questions', qId))),
//         );
//         const qs = qDocs.filter(d => d.exists()).map(d => ({ id: d.id, ...d.data() }));
//         setQuestions(qs);

//         // Create submission record
//         if (!urlSubmissionId && currentUser) {
//           const sid = await startSubmission({
//             examId,
//             examTitle:   examData.title,
//             studentId:   currentUser.uid,
//             studentEmail:currentUser.email,
//             studentName: currentUser.displayName || currentUser.email,
//           });
//           setSubmissionId(sid);
//         }

//         // If no MCQ questions, jump straight to coding
//         const hasMCQ = qs.some(q => q.type === 'MCQ');
//         if (!hasMCQ) setPhase('coding');
//       } catch (err) {
//         console.error(err);
//         setError('Failed to load exam. Please refresh.');
//       } finally {
//         setLoading(false);
//       }
//     };
//     if (examId) fetchExam();
//   }, [examId, currentUser, urlSubmissionId]);

//   // ── PROCTORING – applies to ENTIRE exam (MCQ + Coding) ──────
//   // CodingWorkspace has its own proctoring too, so during coding
//   // phase there are two layers (belt + braces = safer).
//   useEffect(() => {
//     const enterFS = async () => {
//       try { await document.documentElement.requestFullscreen?.(); } catch {}
//     };
//     enterFS();

//     const onFSChange = () => {
//       if (!document.fullscreenElement) {
//         setViolations(v => {
//           const nv = v + 1;
//           if (nv >= 3) handleFinalSubmitRef.current?.(true);
//           return nv;
//         });
//         setShowViolation(true);
//       }
//     };
//     const onVis      = () => { if (document.hidden) setViolations(v => v + 1); };
//     const blockKeys  = e => {
//       if (e.key === 'F12' || (e.ctrlKey && e.shiftKey) || (e.ctrlKey && e.key === 'u'))
//         e.preventDefault();
//     };
//     const blockCtxMenu = e => e.preventDefault();

//     document.addEventListener('fullscreenchange', onFSChange);
//     document.addEventListener('visibilitychange', onVis);
//     document.addEventListener('keydown', blockKeys);
//     document.addEventListener('contextmenu', blockCtxMenu);
//     document.addEventListener('copy', blockCtxMenu);

//     return () => {
//       document.removeEventListener('fullscreenchange', onFSChange);
//       document.removeEventListener('visibilitychange', onVis);
//       document.removeEventListener('keydown', blockKeys);
//       document.removeEventListener('contextmenu', blockCtxMenu);
//       document.removeEventListener('copy', blockCtxMenu);
//     };
//   }, []);

//   // ── Final submit ─────────────────────────────────────────────
//   const handleFinalSubmit = useCallback(async (forced = false) => {
//     if (isSubmitting) return;
//     setConfirmSubmit(false);
//     setIsSubmitting(true);
//     setPhase('submitted');

//     try {
//       if (submissionId) {
//         // 1. Persist all answers first
//         await updateSubmission(submissionId, {
//           answers: Object.entries(answers).map(([qId, ans]) => ({ questionId: qId, answer: ans })),
//           submittedAt:  new Date(),
//           forcedSubmit: forced,
//           violations,
//         });

//         // 2. Calculate combined MCQ + Coding score
//         await calculateAndSaveScore(submissionId, answers, questions);
//       }
//     } catch (err) {
//       console.error('Submit error:', err);
//     }
//     setIsSubmitting(false);
//   }, [isSubmitting, submissionId, answers, violations, questions]);

//   handleFinalSubmitRef.current = handleFinalSubmit;

//   // ── MCQ handlers ─────────────────────────────────────────────
//   const handleMCQAnswer = (questionId, option) =>
//     setAnswers(p => ({ ...p, [questionId]: option }));

//   const toggleMark = (qId) =>
//     setMarked(prev => { const n = new Set(prev); n.has(qId) ? n.delete(qId) : n.add(qId); return n; });

//   const proceedToCoding = () => {
//     const unanswered = mcqQuestions.filter(q => !answers[q.id]);
//     if (unanswered.length > 0) {
//       if (!window.confirm(`You have ${unanswered.length} unanswered MCQ(s). Proceed to Coding section?`)) return;
//     }
//     if (codingQuestions.length === 0) {
//       setConfirmSubmit(true);
//       return;
//     }
//     setPhase('coding');
//     setCurrentIdx(0);
//   };

//   // ── Coding phase handlers ────────────────────────────────────
//   const handleCodingSaveNext = async (code, language) => {
//     const q = codingQuestions[currentIdx];
//     if (q) {
//       const newAnswers = { ...answers, [q.id]: { code, language } };
//       setAnswers(newAnswers);
//       if (submissionId) {
//         await updateSubmission(submissionId, {
//           answers: Object.entries(newAnswers).map(([id, ans]) => ({ questionId: id, answer: ans })),
//         });
//       }
//     }
//     if (currentIdx < codingQuestions.length - 1) setCurrentIdx(i => i + 1);
//   };

//   const handleCodingSubmit = async (code, language, passedCount) => {
//     const q = codingQuestions[currentIdx];
//     if (q) setAnswers(p => ({ ...p, [q.id]: { code, language, passedCount } }));
//     await handleFinalSubmit(false);
//   };

//   // ── Helper: question palette status ─────────────────────────
//   const getQStatus = (q, idx) => {
//     if (currentIdx === idx) return 'current';
//     if (marked.has(q.id))  return 'marked';
//     if (answers[q.id])     return 'answered';
//     return 'unanswered';
//   };

//   // ── Loading / Error screens ──────────────────────────────────
//   if (loading) return (
//     <div style={{ minHeight: '100vh', background: '#0d1117', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
//       <div style={{ width: 40, height: 40, border: '3px solid #30363d', borderTopColor: '#58a6ff', borderRadius: '50%', animation: 'spin .8s linear infinite' }} />
//       <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
//       <p style={{ color: '#8b949e', marginTop: 16, fontSize: 14 }}>Loading exam...</p>
//     </div>
//   );

//   if (error) return (
//     <div style={{ minHeight: '100vh', background: '#0d1117', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//       <div style={{ background: '#161b22', border: '1px solid rgba(248,81,73,0.3)', borderRadius: 12, padding: 32, textAlign: 'center' }}>
//         <p style={{ color: '#f85149' }}>{error}</p>
//         <button onClick={() => history.push('/dashboard')} style={{ marginTop: 20, padding: '10px 24px', background: '#21262d', border: 'none', color: '#fff', borderRadius: 8, cursor: 'pointer' }}>
//           Return to Dashboard
//         </button>
//       </div>
//     </div>
//   );

//   // ── Submitted screen ─────────────────────────────────────────
//   if (phase === 'submitted') return (
//     <div style={{ minHeight: '100vh', background: '#0d1117', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui' }}>
//       <div style={{ background: '#161b22', border: '1px solid #30363d', borderRadius: 20, padding: 48, textAlign: 'center', maxWidth: 500 }}>
//         <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
//         <h2 style={{ color: '#3fb950', fontSize: 24, marginBottom: 12 }}>Exam Submitted!</h2>
//         <p style={{ color: '#8b949e', fontSize: 14, lineHeight: 1.6, marginBottom: 28 }}>
//           Your answers have been recorded. Your faculty will review the results.
//         </p>
//         <button onClick={() => history.push('/dashboard')} style={{ width: '100%', padding: '14px', background: '#58a6ff', border: 'none', borderRadius: 10, color: '#fff', cursor: 'pointer', fontWeight: 700, fontSize: 15 }}>
//           Exit to Dashboard
//         </button>
//       </div>
//     </div>
//   );

//   // ── Coding phase → hand off to CodingWorkspace ───────────────
//   if (phase === 'coding') {
//     return (
//       <CodingWorkspace
//         mode="exam"
//         question={codingQuestions[currentIdx]}
//         examMeta={{
//           duration:       timer.remaining,
//           onTimerEnd:     () => handleFinalSubmitRef.current?.(true),
//           title:          exam?.title,
//           totalQuestions: codingQuestions.length,
//           currentIndex:   currentIdx,
//         }}
//         onSubmit={handleCodingSubmit}
//         onSaveAndNext={handleCodingSaveNext}
//         isLastQuestion={currentIdx === codingQuestions.length - 1}
//         isSaving={isSubmitting}
//         violationCount={violations}
//         onBack={() => { setPhase('mcq'); setCurrentIdx(mcqQuestions.length - 1); }}
//       />
//     );
//   }

//   // ── Confirm submit dialog (if no coding questions) ───────────
//   if (confirmSubmit) return (
//     <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
//       <div style={{ background: '#161b22', border: '1px solid #30363d', borderRadius: 16, padding: 36, textAlign: 'center', maxWidth: 440 }}>
//         <h3 style={{ color: '#e6edf3', marginBottom: 12 }}>Submit Exam?</h3>
//         <p style={{ color: '#8b949e', marginBottom: 24, lineHeight: 1.6 }}>
//           You have answered {Object.keys(answers).length} of {mcqQuestions.length} MCQ questions.
//           Once submitted you cannot change your answers.
//         </p>
//         <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
//           <button onClick={() => setConfirmSubmit(false)} style={{ padding: '10px 20px', background: '#21262d', border: '1px solid #30363d', borderRadius: 8, color: '#8b949e', cursor: 'pointer', fontWeight: 700 }}>
//             Go Back
//           </button>
//           <button onClick={() => handleFinalSubmit(false)} style={{ padding: '10px 20px', background: '#3fb950', border: 'none', borderRadius: 8, color: '#fff', cursor: 'pointer', fontWeight: 700 }}>
//             Submit Exam
//           </button>
//         </div>
//       </div>
//     </div>
//   );

//   // ── MCQ Phase UI ─────────────────────────────────────────────
//   return (
//     <div style={{ minHeight: '100vh', background: '#0d1117', color: '#e6edf3', display: 'flex', flexDirection: 'column', fontFamily: 'system-ui' }}>

//       {/* ── Header ── */}
//       <header style={{ background: '#161b22', borderBottom: '1px solid #21262d', padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, zIndex: 10 }}>
//         <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
//           <span style={{ fontWeight: 700, fontSize: 15 }}>{exam?.title}</span>
//           {violations > 0 && (
//             <span style={{ background: 'rgba(248,81,73,0.15)', border: '1px solid rgba(248,81,73,0.3)', color: '#f85149', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 6 }}>
//               ⚠️ {violations}/3 Violations
//             </span>
//           )}
//         </div>

//         {/* Timer */}
//         <span style={{ fontFamily: 'monospace', fontSize: 20, fontWeight: 700, color: timer.urgent ? '#f85149' : '#58a6ff' }}>
//           {String(timer.h).padStart(2,'0')}:{String(timer.m).padStart(2,'0')}:{String(timer.s).padStart(2,'0')}
//         </span>

//         <button
//           onClick={proceedToCoding}
//           style={{ padding: '8px 20px', background: '#f0883e', border: 'none', borderRadius: 8, color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}
//         >
//           {codingQuestions.length > 0 ? 'Next Phase →' : 'Submit Exam ✓'}
//         </button>
//       </header>

//       {/* ── Body ── */}
//       <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

//         {/* Question area */}
//         <div style={{ flex: 1, overflowY: 'auto', padding: '32px 40px' }}>
//           {!currentQ ? (
//             <p style={{ color: '#8b949e' }}>No MCQ questions in this exam.</p>
//           ) : (
//             <>
//               <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
//                 <span style={{ fontSize: 13, color: '#8b949e' }}>
//                   Question {currentIdx + 1} of {mcqQuestions.length}
//                 </span>
//                 <button
//                   onClick={() => toggleMark(currentQ.id)}
//                   style={{ padding: '4px 12px', background: '#21262d', border: '1px solid #30363d', borderRadius: 6, color: marked.has(currentQ.id) ? '#58a6ff' : '#8b949e', cursor: 'pointer', fontSize: 12 }}
//                 >
//                   🔖 {marked.has(currentQ.id) ? 'Marked' : 'Mark for Review'}
//                 </button>
//               </div>

//               <div style={{ fontSize: 18, lineHeight: 1.7, marginBottom: 32 }}
//                 dangerouslySetInnerHTML={{ __html: currentQ.description || currentQ.question }} />

//               <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
//                 {(currentQ.options || []).map((opt, i) => (
//                   <button key={i}
//                     onClick={() => handleMCQAnswer(currentQ.id, opt)}
//                     style={{
//                       display: 'flex', alignItems: 'center', gap: 16,
//                       padding: '16px 20px',
//                       background: answers[currentQ.id] === opt ? 'rgba(88,166,255,0.1)' : '#161b22',
//                       border: `2px solid ${answers[currentQ.id] === opt ? '#58a6ff' : '#21262d'}`,
//                       borderRadius: 12, cursor: 'pointer', textAlign: 'left', width: '100%',
//                       color: '#e6edf3', fontSize: 15, transition: 'all 0.15s',
//                     }}>
//                     <span style={{ width: 28, height: 28, borderRadius: '50%', background: answers[currentQ.id] === opt ? '#58a6ff' : '#21262d', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
//                       {['A','B','C','D','E'][i]}
//                     </span>
//                     {opt}
//                   </button>
//                 ))}
//               </div>

//               <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 40 }}>
//                 <button onClick={() => setCurrentIdx(i => Math.max(0, i - 1))} disabled={currentIdx === 0}
//                   style={{ padding: '10px 24px', background: '#21262d', border: 'none', borderRadius: 8, color: '#fff', cursor: 'pointer', opacity: currentIdx === 0 ? 0.4 : 1 }}>
//                   ← Prev
//                 </button>
//                 {currentIdx < mcqQuestions.length - 1 ? (
//                   <button onClick={() => setCurrentIdx(i => i + 1)}
//                     style={{ padding: '10px 24px', background: '#21262d', border: 'none', borderRadius: 8, color: '#fff', cursor: 'pointer' }}>
//                     Next →
//                   </button>
//                 ) : (
//                   <button onClick={proceedToCoding}
//                     style={{ padding: '10px 24px', background: '#3fb950', border: 'none', borderRadius: 8, color: '#fff', fontWeight: 700, cursor: 'pointer' }}>
//                     {codingQuestions.length > 0 ? 'Coding Phase ✓' : 'Submit Exam ✓'}
//                   </button>
//                 )}
//               </div>
//             </>
//           )}
//         </div>

//         {/* Question palette */}
//         <div style={{ width: 260, background: '#161b22', borderLeft: '1px solid #21262d', padding: 16, overflowY: 'auto' }}>
//           <p style={{ fontSize: 11, fontWeight: 700, color: '#8b949e', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.08em' }}>MCQ Palette</p>
//           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6, marginBottom: 20 }}>
//             {mcqQuestions.map((q, i) => {
//               const s = Q_STATUS[getQStatus(q, i)];
//               return (
//                 <button key={q.id} onClick={() => setCurrentIdx(i)}
//                   style={{ aspectRatio: '1', borderRadius: 6, background: s.bg, border: `1px solid ${s.border}`, color: s.color, fontWeight: 700, cursor: 'pointer', fontSize: 12 }}>
//                   {i + 1}
//                 </button>
//               );
//             })}
//           </div>

//           {/* Legend */}
//           {[
//             { key: 'answered',   label: 'Answered' },
//             { key: 'marked',     label: 'Marked' },
//             { key: 'unanswered', label: 'Not Answered' },
//           ].map(({ key, label }) => (
//             <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
//               <div style={{ width: 12, height: 12, borderRadius: 3, background: Q_STATUS[key].bg, border: `1px solid ${Q_STATUS[key].border}` }} />
//               <span style={{ fontSize: 11, color: '#8b949e' }}>{label}</span>
//             </div>
//           ))}

//           <div style={{ marginTop: 20, padding: '12px', background: 'rgba(88,166,255,0.06)', border: '1px solid rgba(88,166,255,0.15)', borderRadius: 8 }}>
//             <p style={{ fontSize: 11, color: '#8b949e', lineHeight: 1.5 }}>
//               Answered: <strong style={{ color: '#3fb950' }}>{Object.keys(answers).filter(id => mcqQuestions.some(q => q.id === id)).length}</strong> / {mcqQuestions.length}
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Violation warning overlay */}
//       {showViolation && (
//         <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
//           <div style={{ background: '#161b22', border: '2px solid rgba(248,81,73,0.4)', borderRadius: 16, padding: 36, textAlign: 'center', maxWidth: 440 }}>
//             <div style={{ fontSize: 48, marginBottom: 12 }}>🚨</div>
//             <h3 style={{ color: '#f85149', marginBottom: 12 }}>Proctoring Violation</h3>
//             <p style={{ color: '#c9d1d9', lineHeight: 1.6, marginBottom: 8 }}>
//               Fullscreen exit detected. <strong>{violations}/3</strong> violations recorded.
//               At 3 violations your exam is automatically submitted.
//             </p>
//             <button
//               onClick={async () => {
//                 setShowViolation(false);
//                 try { await document.documentElement.requestFullscreen?.(); } catch {}
//               }}
//               style={{ padding: '10px 24px', background: '#58a6ff', border: 'none', borderRadius: 8, color: '#fff', cursor: 'pointer', fontWeight: 700, marginTop: 16 }}
//             >
//               Return to Exam
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
























// // FILE PATH: src/pages/ExamPage.jsx
// // FIXES:
// // 1. ONE-ATTEMPT enforcement: checks Firestore before creating submission
// // 2. Coding results (passedCount, scoreBreakdown) properly saved to submission
// // 3. Coding workspace identical to practice page
// // 4. Submission ID always passed via URL from dashboard (no double-create)

// import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
// import { useParams, useHistory } from 'react-router-dom';
// import { doc, getDoc, getDocs, collection, query, where } from 'firebase/firestore';
// import { db } from '../firebase/config';
// import { useAuth } from '../context/AuthContext';
// import { startSubmission, updateSubmission, calculateAndSaveScore } from '../api/examService';
// import CodingWorkspace from '../components/workspace/CodingWorkspace';

// function useTimer(totalSecs, onEnd) {
//   const [rem, setRem]   = useState(totalSecs);
//   const startRef        = useRef(Date.now());
//   const firedRef        = useRef(false);
//   useEffect(() => { startRef.current = Date.now(); setRem(totalSecs); firedRef.current = false; }, [totalSecs]);
//   useEffect(() => {
//     const t = setInterval(() => {
//       const left = Math.max(0, totalSecs - Math.floor((Date.now() - startRef.current) / 1000));
//       setRem(left);
//       if (left === 0 && !firedRef.current) { firedRef.current = true; onEnd?.(); }
//     }, 1000);
//     return () => clearInterval(t);
//   }, [totalSecs, onEnd]);
//   return {
//     h: Math.floor(rem / 3600),
//     m: Math.floor((rem % 3600) / 60),
//     s: rem % 60,
//     remaining: rem,
//     urgent: rem < 300,
//     pct: (rem / totalSecs) * 100,
//   };
// }

// const Q_STATUS = {
//   unanswered: { bg: '#21262d', border: '#30363d', color: '#8b949e' },
//   answered:   { bg: 'rgba(63,185,80,0.15)', border: 'rgba(63,185,80,0.4)', color: '#3fb950' },
//   marked:     { bg: 'rgba(88,166,255,0.15)', border: 'rgba(88,166,255,0.4)', color: '#58a6ff' },
//   current:    { bg: '#f0883e', border: '#f0883e', color: '#fff' },
// };

// export default function ExamPage() {
//   const { examId, submissionId: urlSubmissionId } = useParams();
//   const { currentUser }  = useAuth();
//   const history          = useHistory();

//   const [exam, setExam]                           = useState(null);
//   const [questions, setQuestions]                 = useState([]);
//   const [loading, setLoading]                     = useState(true);
//   const [error, setError]                         = useState(null);
//   const [submissionId, setSubmissionId]           = useState(urlSubmissionId || null);
//   const [phase, setPhase]                         = useState('mcq');
//   const [currentIdx, setCurrentIdx]               = useState(0);
//   const [answers, setAnswers]                     = useState({});
//   const [marked, setMarked]                       = useState(new Set());
//   const [isSubmitting, setIsSubmitting]           = useState(false);
//   const [confirmSubmit, setConfirmSubmit]         = useState(false);
//   const [violations, setViolations]               = useState(0);
//   const [showViolation, setShowViolation]         = useState(false);
//   const [alreadySubmitted, setAlreadySubmitted]   = useState(false);

//   const mcqQuestions    = useMemo(() => questions.filter(q => q.type === 'MCQ'), [questions]);
//   const codingQuestions = useMemo(() => questions.filter(q => (q.type || '').toUpperCase() === 'CODING'), [questions]);
//   const currentQuestions= phase === 'mcq' ? mcqQuestions : codingQuestions;
//   const currentQ        = currentQuestions[currentIdx];
//   const totalDuration   = (exam?.durationMinutes ?? 60) * 60;
//   const handleFinalSubmitRef = useRef(null);

//   const timer = useTimer(
//     totalDuration,
//     useCallback(() => handleFinalSubmitRef.current?.(true), []),
//   );

//   useEffect(() => {
//     const fetchExam = async () => {
//       try {
//         // ── ONE-ATTEMPT CHECK ──────────────────────────────────────────
//         if (currentUser && examId) {
//           const existingSubs = await getDocs(
//             query(
//               collection(db, 'submissions'),
//               where('examId', '==', examId),
//               where('studentId', '==', currentUser.uid),
//               where('status', '==', 'completed'),
//             )
//           );
//           if (!existingSubs.empty) {
//             setAlreadySubmitted(true);
//             setLoading(false);
//             return;
//           }
//         }
//         // ──────────────────────────────────────────────────────────────

//         const examSnap = await getDoc(doc(db, 'exams', examId));
//         if (!examSnap.exists()) { setError('Exam not found.'); return; }
//         const examData = { id: examSnap.id, ...examSnap.data() };
//         setExam(examData);

//         const qDocs = await Promise.all(
//           (examData.questionIds || []).map(qId => getDoc(doc(db, 'questions', qId))),
//         );
//         const qs = qDocs.filter(d => d.exists()).map(d => ({ id: d.id, ...d.data() }));
//         setQuestions(qs);

//         // Use existing submission ID from URL, or create a new one
//         if (!urlSubmissionId && currentUser) {
//           // Check for in-progress submission first
//           const inProgressSubs = await getDocs(
//             query(
//               collection(db, 'submissions'),
//               where('examId', '==', examId),
//               where('studentId', '==', currentUser.uid),
//             )
//           );
//           if (!inProgressSubs.empty) {
//             // Resume existing submission
//             const existingSub = inProgressSubs.docs[0];
//             setSubmissionId(existingSub.id);
//             // Restore saved answers
//             const existingData = existingSub.data();
//             if (existingData.answers?.length) {
//               const restored = {};
//               existingData.answers.forEach(a => { restored[a.questionId] = a.answer; });
//               setAnswers(restored);
//             }
//           } else {
//             // Create new submission
//             const sid = await startSubmission({
//               examId,
//               examTitle:    examData.title,
//               studentId:    currentUser.uid,
//               studentEmail: currentUser.email,
//               studentName:  currentUser.displayName || currentUser.email,
//               studentRegNo: currentUser.regNo || '',
//             });
//             setSubmissionId(sid);
//           }
//         } else if (urlSubmissionId) {
//           // Restore saved answers from existing submission
//           try {
//             const subSnap = await getDoc(doc(db, 'submissions', urlSubmissionId));
//             if (subSnap.exists()) {
//               const existingData = subSnap.data();
//               if (existingData.answers?.length) {
//                 const restored = {};
//                 existingData.answers.forEach(a => { restored[a.questionId] = a.answer; });
//                 setAnswers(restored);
//               }
//             }
//           } catch {}
//         }

//         const hasMCQ = qs.some(q => q.type === 'MCQ');
//         if (!hasMCQ) setPhase('coding');
//       } catch (err) {
//         console.error(err);
//         setError('Failed to load exam. Please refresh.');
//       } finally {
//         setLoading(false);
//       }
//     };
//     if (examId) fetchExam();
//   }, [examId, currentUser, urlSubmissionId]);

//   // Proctoring
//   useEffect(() => {
//     const enterFS = async () => {
//       try { await document.documentElement.requestFullscreen?.(); } catch {}
//     };
//     enterFS();
//     const onFSChange = () => {
//       if (!document.fullscreenElement) {
//         setViolations(v => {
//           const nv = v + 1;
//           if (nv >= 3) handleFinalSubmitRef.current?.(true);
//           return nv;
//         });
//         setShowViolation(true);
//       }
//     };
//     const onVis      = () => { if (document.hidden) setViolations(v => v + 1); };
//     const blockKeys  = e => {
//       if (e.key === 'F12' || (e.ctrlKey && e.shiftKey) || (e.ctrlKey && e.key === 'u'))
//         e.preventDefault();
//     };
//     const blockCtxMenu = e => e.preventDefault();
//     document.addEventListener('fullscreenchange', onFSChange);
//     document.addEventListener('visibilitychange', onVis);
//     document.addEventListener('keydown', blockKeys);
//     document.addEventListener('contextmenu', blockCtxMenu);
//     document.addEventListener('copy', blockCtxMenu);
//     return () => {
//       document.removeEventListener('fullscreenchange', onFSChange);
//       document.removeEventListener('visibilitychange', onVis);
//       document.removeEventListener('keydown', blockKeys);
//       document.removeEventListener('contextmenu', blockCtxMenu);
//       document.removeEventListener('copy', blockCtxMenu);
//     };
//   }, []);

//   const handleFinalSubmit = useCallback(async (forced = false, finalAnswers = null) => {
//     if (isSubmitting) return;
//     setConfirmSubmit(false);
//     setIsSubmitting(true);
//     setPhase('submitted');
//     try {
//       if (submissionId) {
//         const answersToSave = finalAnswers || answers;
//         await updateSubmission(submissionId, {
//           answers: Object.entries(answersToSave).map(([qId, ans]) => ({ questionId: qId, answer: ans })),
//           submittedAt:  new Date(),
//           forcedSubmit: forced,
//           violations,
//         });
//         await calculateAndSaveScore(submissionId, answersToSave, questions);
//       }
//     } catch (err) {
//       console.error('Submit error:', err);
//     }
//     setIsSubmitting(false);
//   }, [isSubmitting, submissionId, answers, violations, questions]);

//   handleFinalSubmitRef.current = handleFinalSubmit;

//   const handleMCQAnswer = (questionId, option) =>
//     setAnswers(p => ({ ...p, [questionId]: option }));

//   const toggleMark = (qId) =>
//     setMarked(prev => { const n = new Set(prev); n.has(qId) ? n.delete(qId) : n.add(qId); return n; });

//   const proceedToCoding = () => {
//     const unanswered = mcqQuestions.filter(q => !answers[q.id]);
//     if (unanswered.length > 0) {
//       if (!window.confirm(`You have ${unanswered.length} unanswered MCQ(s). Proceed to Coding section?`)) return;
//     }
//     if (codingQuestions.length === 0) {
//       setConfirmSubmit(true);
//       return;
//     }
//     setPhase('coding');
//     setCurrentIdx(0);
//   };

//   const handleCodingSaveNext = async (code, language) => {
//     const q = codingQuestions[currentIdx];
//     if (q) {
//       const newAnswers = { ...answers, [q.id]: { code, language } };
//       setAnswers(newAnswers);
//       if (submissionId) {
//         await updateSubmission(submissionId, {
//           answers: Object.entries(newAnswers).map(([id, ans]) => ({ questionId: id, answer: ans })),
//         });
//       }
//     }
//     if (currentIdx < codingQuestions.length - 1) setCurrentIdx(i => i + 1);
//   };

//   // ── CRITICAL FIX: save passedCount + scoreBreakdown to answers ──────────
//   const handleCodingSubmit = async (code, language, passedCount, tcResult) => {
//     const q = codingQuestions[currentIdx];
//     const scoreBreakdown = tcResult ? {
//       passedCount: tcResult.passedCount ?? 0,
//       totalCount:  tcResult.totalCount  ?? 0,
//       allPassed:   tcResult.allPassed   ?? false,
//     } : null;

//     const newAnswers = {
//       ...answers,
//       [q.id]: { code, language, passedCount: passedCount ?? 0, scoreBreakdown },
//     };
//     setAnswers(newAnswers);
//     await handleFinalSubmit(false, newAnswers);
//   };
//   // ────────────────────────────────────────────────────────────────────────

//   const getQStatus = (q, idx) => {
//     if (currentIdx === idx) return 'current';
//     if (marked.has(q.id))  return 'marked';
//     if (answers[q.id])     return 'answered';
//     return 'unanswered';
//   };

//   // ── Already Submitted Screen ──────────────────────────────────────────
//   if (alreadySubmitted) return (
//     <div style={{ minHeight: '100vh', background: '#0d1117', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui' }}>
//       <div style={{ background: '#161b22', border: '2px solid rgba(88,166,255,0.3)', borderRadius: 20, padding: 48, textAlign: 'center', maxWidth: 500 }}>
//         <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
//         <h2 style={{ color: '#58a6ff', fontSize: 22, marginBottom: 12 }}>Already Submitted</h2>
//         <p style={{ color: '#8b949e', fontSize: 14, lineHeight: 1.6, marginBottom: 28 }}>
//           You have already completed this exam. Only one attempt is allowed per student.
//           Your submission has been recorded.
//         </p>
//         <button onClick={() => history.push('/dashboard')}
//           style={{ width: '100%', padding: '14px', background: '#58a6ff', border: 'none', borderRadius: 10, color: '#fff', cursor: 'pointer', fontWeight: 700, fontSize: 15 }}>
//           Back to Dashboard
//         </button>
//       </div>
//     </div>
//   );

//   if (loading) return (
//     <div style={{ minHeight: '100vh', background: '#0d1117', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
//       <div style={{ width: 40, height: 40, border: '3px solid #30363d', borderTopColor: '#58a6ff', borderRadius: '50%', animation: 'spin .8s linear infinite' }} />
//       <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
//       <p style={{ color: '#8b949e', marginTop: 16, fontSize: 14 }}>Loading exam...</p>
//     </div>
//   );

//   if (error) return (
//     <div style={{ minHeight: '100vh', background: '#0d1117', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//       <div style={{ background: '#161b22', border: '1px solid rgba(248,81,73,0.3)', borderRadius: 12, padding: 32, textAlign: 'center' }}>
//         <p style={{ color: '#f85149' }}>{error}</p>
//         <button onClick={() => history.push('/dashboard')} style={{ marginTop: 20, padding: '10px 24px', background: '#21262d', border: 'none', color: '#fff', borderRadius: 8, cursor: 'pointer' }}>
//           Return to Dashboard
//         </button>
//       </div>
//     </div>
//   );

//   if (phase === 'submitted') return (
//     <div style={{ minHeight: '100vh', background: '#0d1117', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui' }}>
//       <div style={{ background: '#161b22', border: '1px solid #30363d', borderRadius: 20, padding: 48, textAlign: 'center', maxWidth: 500 }}>
//         <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
//         <h2 style={{ color: '#3fb950', fontSize: 24, marginBottom: 12 }}>Exam Submitted!</h2>
//         <p style={{ color: '#8b949e', fontSize: 14, lineHeight: 1.6, marginBottom: 28 }}>
//           Your answers have been recorded and scored. Your faculty will review the results.
//         </p>
//         <button onClick={() => history.push('/dashboard')}
//           style={{ width: '100%', padding: '14px', background: '#58a6ff', border: 'none', borderRadius: 10, color: '#fff', cursor: 'pointer', fontWeight: 700, fontSize: 15 }}>
//           Exit to Dashboard
//         </button>
//       </div>
//     </div>
//   );

//   if (phase === 'coding') {
//     return (
//       <CodingWorkspace
//         mode="exam"
//         question={codingQuestions[currentIdx]}
//         examMeta={{
//           duration:       timer.remaining,
//           onTimerEnd:     () => handleFinalSubmitRef.current?.(true),
//           title:          exam?.title,
//           totalQuestions: codingQuestions.length,
//           currentIndex:   currentIdx,
//         }}
//         onSubmit={handleCodingSubmit}
//         onSaveAndNext={handleCodingSaveNext}
//         isLastQuestion={currentIdx === codingQuestions.length - 1}
//         isSaving={isSubmitting}
//         violationCount={violations}
//         onBack={() => { setPhase('mcq'); setCurrentIdx(mcqQuestions.length - 1); }}
//       />
//     );
//   }

//   if (confirmSubmit) return (
//     <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
//       <div style={{ background: '#161b22', border: '1px solid #30363d', borderRadius: 16, padding: 36, textAlign: 'center', maxWidth: 440 }}>
//         <h3 style={{ color: '#e6edf3', marginBottom: 12 }}>Submit Exam?</h3>
//         <p style={{ color: '#8b949e', marginBottom: 24, lineHeight: 1.6 }}>
//           You have answered {Object.keys(answers).filter(id => mcqQuestions.some(q => q.id === id)).length} of {mcqQuestions.length} MCQ questions.
//           Once submitted you cannot change your answers.
//         </p>
//         <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
//           <button onClick={() => setConfirmSubmit(false)} style={{ padding: '10px 20px', background: '#21262d', border: '1px solid #30363d', borderRadius: 8, color: '#8b949e', cursor: 'pointer', fontWeight: 700 }}>
//             Go Back
//           </button>
//           <button onClick={() => handleFinalSubmit(false)} style={{ padding: '10px 20px', background: '#3fb950', border: 'none', borderRadius: 8, color: '#fff', cursor: 'pointer', fontWeight: 700 }}>
//             Submit Exam
//           </button>
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     <div style={{ minHeight: '100vh', background: '#0d1117', color: '#e6edf3', display: 'flex', flexDirection: 'column', fontFamily: 'system-ui' }}>
//       {/* Header */}
//       <header style={{ background: '#161b22', borderBottom: '1px solid #21262d', padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, zIndex: 10 }}>
//         <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
//           <span style={{ fontWeight: 700, fontSize: 15 }}>{exam?.title}</span>
//           <span style={{ fontSize: 12, color: '#8b949e', background: '#21262d', border: '1px solid #30363d', padding: '2px 8px', borderRadius: 6 }}>
//             MCQ Phase — {mcqQuestions.length} questions
//           </span>
//           {violations > 0 && (
//             <span style={{ background: 'rgba(248,81,73,0.15)', border: '1px solid rgba(248,81,73,0.3)', color: '#f85149', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 6 }}>
//               ⚠️ {violations}/3 Violations
//             </span>
//           )}
//         </div>
//         <span style={{ fontFamily: 'monospace', fontSize: 20, fontWeight: 700, color: timer.urgent ? '#f85149' : '#58a6ff' }}>
//           {String(timer.h).padStart(2,'0')}:{String(timer.m).padStart(2,'0')}:{String(timer.s).padStart(2,'0')}
//         </span>
//         <button
//           onClick={proceedToCoding}
//           style={{ padding: '8px 20px', background: '#f0883e', border: 'none', borderRadius: 8, color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}
//         >
//           {codingQuestions.length > 0 ? 'Next Phase →' : 'Submit Exam ✓'}
//         </button>
//       </header>

//       {/* Body */}
//       <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
//         {/* Question area */}
//         <div style={{ flex: 1, overflowY: 'auto', padding: '32px 40px' }}>
//           {!currentQ ? (
//             <p style={{ color: '#8b949e' }}>No MCQ questions in this exam.</p>
//           ) : (
//             <>
//               <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
//                 <span style={{ fontSize: 13, color: '#8b949e' }}>
//                   Question {currentIdx + 1} of {mcqQuestions.length}
//                 </span>
//                 {currentQ.marks && (
//                   <span style={{ fontSize: 11, background: 'rgba(88,166,255,.1)', color: '#58a6ff', border: '1px solid rgba(88,166,255,.2)', borderRadius: 6, padding: '2px 8px' }}>
//                     {currentQ.marks} pts
//                   </span>
//                 )}
//                 <button
//                   onClick={() => toggleMark(currentQ.id)}
//                   style={{ padding: '4px 12px', background: '#21262d', border: '1px solid #30363d', borderRadius: 6, color: marked.has(currentQ.id) ? '#58a6ff' : '#8b949e', cursor: 'pointer', fontSize: 12 }}
//                 >
//                   🔖 {marked.has(currentQ.id) ? 'Marked' : 'Mark for Review'}
//                 </button>
//               </div>
//               <div style={{ fontSize: 18, lineHeight: 1.7, marginBottom: 32 }}
//                 dangerouslySetInnerHTML={{ __html: currentQ.description || currentQ.question }} />
//               <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
//                 {(currentQ.options || []).map((opt, i) => (
//                   <button key={i}
//                     onClick={() => handleMCQAnswer(currentQ.id, opt)}
//                     style={{
//                       display: 'flex', alignItems: 'center', gap: 16,
//                       padding: '16px 20px',
//                       background: answers[currentQ.id] === opt ? 'rgba(88,166,255,0.1)' : '#161b22',
//                       border: `2px solid ${answers[currentQ.id] === opt ? '#58a6ff' : '#21262d'}`,
//                       borderRadius: 12, cursor: 'pointer', textAlign: 'left', width: '100%',
//                       color: '#e6edf3', fontSize: 15, transition: 'all 0.15s',
//                     }}>
//                     <span style={{ width: 28, height: 28, borderRadius: '50%', background: answers[currentQ.id] === opt ? '#58a6ff' : '#21262d', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
//                       {['A','B','C','D','E'][i]}
//                     </span>
//                     {opt}
//                   </button>
//                 ))}
//               </div>
//               <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 40 }}>
//                 <button onClick={() => setCurrentIdx(i => Math.max(0, i - 1))} disabled={currentIdx === 0}
//                   style={{ padding: '10px 24px', background: '#21262d', border: 'none', borderRadius: 8, color: '#fff', cursor: 'pointer', opacity: currentIdx === 0 ? 0.4 : 1 }}>
//                   ← Prev
//                 </button>
//                 {currentIdx < mcqQuestions.length - 1 ? (
//                   <button onClick={() => setCurrentIdx(i => i + 1)}
//                     style={{ padding: '10px 24px', background: '#21262d', border: 'none', borderRadius: 8, color: '#fff', cursor: 'pointer' }}>
//                     Next →
//                   </button>
//                 ) : (
//                   <button onClick={proceedToCoding}
//                     style={{ padding: '10px 24px', background: '#3fb950', border: 'none', borderRadius: 8, color: '#fff', fontWeight: 700, cursor: 'pointer' }}>
//                     {codingQuestions.length > 0 ? 'Coding Phase ✓' : 'Submit Exam ✓'}
//                   </button>
//                 )}
//               </div>
//             </>
//           )}
//         </div>

//         {/* Palette sidebar */}
//         <div style={{ width: 260, background: '#161b22', borderLeft: '1px solid #21262d', padding: 16, overflowY: 'auto' }}>
//           <p style={{ fontSize: 11, fontWeight: 700, color: '#8b949e', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.08em' }}>MCQ Palette</p>
//           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6, marginBottom: 20 }}>
//             {mcqQuestions.map((q, i) => {
//               const s = Q_STATUS[getQStatus(q, i)];
//               return (
//                 <button key={q.id} onClick={() => setCurrentIdx(i)}
//                   style={{ aspectRatio: '1', borderRadius: 6, background: s.bg, border: `1px solid ${s.border}`, color: s.color, fontWeight: 700, cursor: 'pointer', fontSize: 12 }}>
//                   {i + 1}
//                 </button>
//               );
//             })}
//           </div>
//           {[
//             { key: 'answered',   label: 'Answered' },
//             { key: 'marked',     label: 'Marked' },
//             { key: 'unanswered', label: 'Not Answered' },
//           ].map(({ key, label }) => (
//             <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
//               <div style={{ width: 12, height: 12, borderRadius: 3, background: Q_STATUS[key].bg, border: `1px solid ${Q_STATUS[key].border}` }} />
//               <span style={{ fontSize: 11, color: '#8b949e' }}>{label}</span>
//             </div>
//           ))}
//           <div style={{ marginTop: 20, padding: '12px', background: 'rgba(88,166,255,0.06)', border: '1px solid rgba(88,166,255,0.15)', borderRadius: 8 }}>
//             <p style={{ fontSize: 11, color: '#8b949e', lineHeight: 1.5 }}>
//               Answered: <strong style={{ color: '#3fb950' }}>{Object.keys(answers).filter(id => mcqQuestions.some(q => q.id === id)).length}</strong> / {mcqQuestions.length}
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Violation modal */}
//       {showViolation && (
//         <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
//           <div style={{ background: '#161b22', border: '2px solid rgba(248,81,73,0.4)', borderRadius: 16, padding: 36, textAlign: 'center', maxWidth: 440 }}>
//             <div style={{ fontSize: 48, marginBottom: 12 }}>🚨</div>
//             <h3 style={{ color: '#f85149', marginBottom: 12 }}>Proctoring Violation</h3>
//             <p style={{ color: '#c9d1d9', lineHeight: 1.6, marginBottom: 8 }}>
//               Fullscreen exit detected. <strong>{violations}/3</strong> violations recorded.
//               At 3 violations your exam is automatically submitted.
//             </p>
//             <button
//               onClick={async () => {
//                 setShowViolation(false);
//                 try { await document.documentElement.requestFullscreen?.(); } catch {}
//               }}
//               style={{ padding: '10px 24px', background: '#58a6ff', border: 'none', borderRadius: 8, color: '#fff', cursor: 'pointer', fontWeight: 700, marginTop: 16 }}
//             >
//               Return to Exam
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
















// // ============================================================
// // src/pages/ExamPage.jsx  —  Mind Code Platform
// //
// // WHAT WAS WRONG (same bugs as old PracticePage):
// //   1. CodingWorkspace textarea editor was not Monaco — poor UX
// //   2. handleRun called executeCode(raw code, stdin) → no wrapper
// //      → "empty output" for Python / NameError for List
// //   3. handleSubmit in CodingWorkspace fell through to raw executeCode
// //      when methodName was missing — no wrapper applied
// //
// // WHAT THIS FILE DOES:
// //   ✅ MCQ phase — full proctoring, palette, mark for review
// //   ✅ Coding phase — Monaco editor (same as PracticePage)
// //      - Run: uses wrapper when methodName exists → correct output
// //      - Submit: uses runWithTestCases → LeetCode-style results
// //   ✅ Proctoring covers BOTH phases (fullscreen + visibility)
// //   ✅ Combined MCQ + Coding score saved on final submit
// //   ✅ Auto-submit on timer end or 3 violations
// // ============================================================

// import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
// import { useParams, useHistory }    from 'react-router-dom';
// import { doc, getDoc }              from 'firebase/firestore';
// import Editor                       from '@monaco-editor/react';
// import { db }                       from '../firebase/config';
// import { useAuth }                  from '../context/AuthContext';
// import {
//   startSubmission, updateSubmission, calculateAndSaveScore,
// } from '../api/examService';
// import {
//   executeCode, runWithTestCases,
// } from '../api/compilerService';

// // ── Language list (same as PracticePage) ─────────────────────
// const LANGUAGES = [
//   { label: 'C++',        value: 'cpp',        monaco: 'cpp'        },
//   { label: 'Python',     value: 'python',     monaco: 'python'     },
//   { label: 'JavaScript', value: 'javascript', monaco: 'javascript' },
//   { label: 'Java',       value: 'java',       monaco: 'java'       },
//   { label: 'C',          value: 'c',          monaco: 'c'          },
// ];

// const FALLBACK_BOILERPLATE = {
//   cpp:        '#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Write your solution here\n};\n',
//   python:     'class Solution:\n    def solution(self):\n        # Write your solution here\n        pass\n',
//   javascript: 'class Solution {\n    solution() {\n        // Write your solution here\n    }\n}\n',
//   java:       'class Solution {\n    public Object solution() {\n        // Write your solution here\n        return null;\n    }\n}\n',
//   c:          '#include <stdio.h>\n\n// Write your solution here\n',
// };

// // ── Palette status colours ────────────────────────────────────
// const Q_STATUS = {
//   unanswered: { bg: '#21262d', border: '#30363d',             color: '#8b949e' },
//   answered:   { bg: 'rgba(63,185,80,0.15)',  border: 'rgba(63,185,80,0.4)',  color: '#3fb950' },
//   marked:     { bg: 'rgba(88,166,255,0.15)', border: 'rgba(88,166,255,0.4)', color: '#58a6ff' },
//   current:    { bg: '#f0883e', border: '#f0883e', color: '#fff' },
// };

// // ── Timer hook ────────────────────────────────────────────────
// function useTimer(totalSecs, onEnd) {
//   const [rem, setRem]  = useState(totalSecs);
//   const startRef       = useRef(Date.now());
//   const firedRef       = useRef(false);
//   useEffect(() => { startRef.current = Date.now(); setRem(totalSecs); firedRef.current = false; }, [totalSecs]);
//   useEffect(() => {
//     const t = setInterval(() => {
//       const left = Math.max(0, totalSecs - Math.floor((Date.now() - startRef.current) / 1000));
//       setRem(left);
//       if (left === 0 && !firedRef.current) { firedRef.current = true; onEnd?.(); }
//     }, 1000);
//     return () => clearInterval(t);
//   }, [totalSecs, onEnd]);
//   return {
//     h: Math.floor(rem / 3600),
//     m: Math.floor((rem % 3600) / 60),
//     s: rem % 60,
//     remaining: rem,
//     urgent:    rem < 300,
//   };
// }

// // ── LeetCode-style test result panel (same as PracticePage) ──
// function TestResultPanel({ tcResult, rawOutput, isEvaluating }) {
//   const [sel, setSel] = useState(0);

//   useEffect(() => {
//     if (tcResult?.results?.length) {
//       const first = tcResult.results.findIndex(r => !r.passed && r.isVisible);
//       setSel(first >= 0 ? first : 0);
//     }
//   }, [tcResult]);

//   if (isEvaluating) return (
//     <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100%', gap:12, color:'#58a6ff' }}>
//       <div style={{ width:32, height:32, border:'3px solid #58a6ff', borderTopColor:'transparent', borderRadius:'50%', animation:'spin .7s linear infinite' }} />
//       <span style={{ fontSize:13, fontWeight:600 }}>Evaluating your solution…</span>
//     </div>
//   );

//   // Plain run output
//   if (rawOutput !== null && !tcResult) return (
//     <div style={{ padding:14, height:'100%', overflowY:'auto' }}>
//       <pre style={{ fontSize:13, color:'#e6edf3', whiteSpace:'pre-wrap', wordBreak:'break-word', lineHeight:1.65, margin:0 }}>
//         {rawOutput || 'Run your code to see output.'}
//       </pre>
//     </div>
//   );

//   if (!tcResult) return (
//     <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100%', gap:8, color:'#484f58' }}>
//       <span style={{ fontSize:32 }}>💻</span>
//       <span style={{ fontSize:13 }}>Submit to evaluate against test cases</span>
//     </div>
//   );

//   const { results: cases, passedCount, totalCount, allPassed, visiblePassed, visibleTotal } = tcResult;
//   const shownCase = cases[sel];

//   return (
//     <div style={{ display:'flex', flexDirection:'column', height:'100%', overflow:'hidden' }}>
//       {/* Summary */}
//       <div style={{ padding:'10px 14px', borderBottom:'1px solid #21262d', flexShrink:0, background: allPassed ? 'rgba(63,185,80,.07)' : 'rgba(248,81,73,.07)' }}>
//         <div style={{ display:'flex', alignItems:'center', gap:10 }}>
//           <span style={{ fontSize:20 }}>{allPassed ? '✅' : '❌'}</span>
//           <div>
//             <div style={{ fontSize:14, fontWeight:800, color: allPassed ? '#3fb950' : '#f85149' }}>
//               {allPassed ? 'All Test Cases Passed!' : `${passedCount} / ${totalCount} Passed`}
//             </div>
//             <div style={{ fontSize:11, color:'#8b949e', marginTop:2, fontFamily:'monospace' }}>
//               Visible: {visiblePassed}/{visibleTotal}
//               {totalCount > visibleTotal && ` · Hidden: ${passedCount - visiblePassed}/${totalCount - visibleTotal}`}
//             </div>
//           </div>
//         </div>
//         {/* Dot selector */}
//         <div style={{ display:'flex', gap:5, marginTop:10, flexWrap:'wrap' }}>
//           {cases.map((c, i) => (
//             <button key={i} onClick={() => setSel(i)}
//               title={`Case ${i+1}: ${c.passed ? 'Passed' : c.statusLabel}`}
//               style={{
//                 width:30, height:30, borderRadius:7, border:'none', cursor:'pointer', fontWeight:700, fontSize:11,
//                 background: sel === i ? (c.passed ? '#3fb950' : '#f85149') : (c.passed ? 'rgba(63,185,80,.15)' : 'rgba(248,81,73,.15)'),
//                 color: sel === i ? '#fff' : (c.passed ? '#3fb950' : '#f85149'),
//                 outline: sel === i ? `2px solid ${c.passed ? '#3fb950' : '#f85149'}` : 'none',
//                 outlineOffset: 1,
//               }}>
//               {c.isVisible ? i + 1 : 'H'}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Detail */}
//       {shownCase && (
//         <div style={{ flex:1, overflowY:'auto', padding:12 }}>
//           <div style={{ display:'flex', justifyContent:'space-between', marginBottom:10 }}>
//             <span style={{ fontSize:12, fontWeight:700, color:'#8b949e' }}>
//               Case {sel + 1} {shownCase.isVisible ? '' : '(Hidden)'}
//             </span>
//             <span style={{ fontSize:11, fontWeight:800, padding:'2px 10px', borderRadius:20,
//               background: shownCase.passed ? 'rgba(63,185,80,.12)' : 'rgba(248,81,73,.12)',
//               color: shownCase.passed ? '#3fb950' : '#f85149',
//               border: `1px solid ${shownCase.passed ? 'rgba(63,185,80,.3)' : 'rgba(248,81,73,.3)'}` }}>
//               {shownCase.statusLabel}
//             </span>
//           </div>
//           {shownCase.isVisible && shownCase.input !== null ? (
//             <>
//               {[['Input', shownCase.input, '#a5d6ff'], ['Expected', shownCase.expectedOutput, '#7ee787'], ['Your Output', shownCase.actualOutput || '(empty)', shownCase.passed ? '#7ee787' : '#f85149']].map(([label, val, color]) => (
//                 <div key={label} style={{ marginBottom:10 }}>
//                   <p style={{ fontSize:11, color:'#8b949e', marginBottom:3, textTransform:'uppercase', letterSpacing:'0.06em' }}>{label}</p>
//                   <pre style={{ background:'#0d1117', padding:'8px 12px', borderRadius:8, fontSize:12, color, fontFamily:'monospace', overflow:'auto', border:'1px solid #21262d', margin:0 }}>{val}</pre>
//                 </div>
//               ))}
//               {shownCase.error && (
//                 <div style={{ marginBottom:10 }}>
//                   <p style={{ fontSize:11, color:'#f85149', marginBottom:3, textTransform:'uppercase', letterSpacing:'0.06em' }}>Error</p>
//                   <pre style={{ background:'#0d1117', padding:'8px 12px', borderRadius:8, fontSize:12, color:'#f85149', fontFamily:'monospace', overflow:'auto', border:'1px solid rgba(248,81,73,.2)', margin:0 }}>{shownCase.error}</pre>
//                 </div>
//               )}
//               {shownCase.time && <p style={{ fontSize:11, color:'#8b949e', fontFamily:'monospace' }}>Runtime: {shownCase.time}s · {shownCase.memory}KB</p>}
//             </>
//           ) : (
//             <div style={{ padding:'14px 16px', background: shownCase.passed ? 'rgba(63,185,80,.06)' : 'rgba(248,81,73,.06)', border:`1px solid ${shownCase.passed ? 'rgba(63,185,80,.2)' : 'rgba(248,81,73,.2)'}`, borderRadius:10 }}>
//               <p style={{ fontSize:13, fontWeight:700, color: shownCase.passed ? '#3fb950' : '#f85149' }}>
//                 {shownCase.passed ? '✓ Hidden test case passed.' : '✗ Hidden test case failed.'}
//               </p>
//               {shownCase.error && <p style={{ fontSize:12, color:'#8b949e', marginTop:6 }}>Error: {shownCase.error}</p>}
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

// // ═══════════════════════════════════════════════════════════════
// // EXAM PAGE
// // ═══════════════════════════════════════════════════════════════
// export default function ExamPage() {
//   const { examId, submissionId: urlSubmissionId } = useParams();
//   const { currentUser } = useAuth();
//   const history         = useHistory();

//   // ── Exam data ─────────────────────────────────────────────────
//   const [exam,         setExam]         = useState(null);
//   const [questions,    setQuestions]    = useState([]);
//   const [loading,      setLoading]      = useState(true);
//   const [error,        setError]        = useState(null);
//   const [submissionId, setSubmissionId] = useState(urlSubmissionId || null);

//   // ── Phase: 'mcq' | 'coding' | 'submitted' ────────────────────
//   const [phase,       setPhase]       = useState('mcq');
//   const [currentIdx,  setCurrentIdx]  = useState(0);

//   // ── MCQ state ─────────────────────────────────────────────────
//   const [answers,  setAnswers]  = useState({});
//   const [marked,   setMarked]   = useState(new Set());

//   // ── Coding state ──────────────────────────────────────────────
//   const [language,     setLanguage]     = useState('cpp');
//   const [codes,        setCodes]        = useState({});   // {`${qId}_${lang}`: code}
//   const [isRunning,    setIsRunning]    = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [tcResult,     setTcResult]     = useState(null); // LeetCode results
//   const [rawOutput,    setRawOutput]    = useState(null); // plain run output
//   const [bottomTab,    setBottomTab]    = useState('result');
//   const [stdin,        setStdin]        = useState('');

//   // ── Proctoring ────────────────────────────────────────────────
//   const [violations,     setViolations]     = useState(0);
//   const [showViolation,  setShowViolation]  = useState(false);
//   const [confirmSubmit,  setConfirmSubmit]  = useState(false);
//   const [showSubmitModal,setShowSubmitModal] = useState(false);

//   // ── Refs ──────────────────────────────────────────────────────
//   const handleFinalSubmitRef = useRef(null);

//   // ── Derived ───────────────────────────────────────────────────
//   const mcqQuestions    = useMemo(() => questions.filter(q => q.type === 'MCQ'), [questions]);
//   const codingQuestions = useMemo(() => questions.filter(q => (q.type || '').toUpperCase() === 'CODING'), [questions]);
//   const currentQ        = phase === 'mcq' ? mcqQuestions[currentIdx] : codingQuestions[currentIdx];
//   const totalDuration   = (exam?.durationMinutes ?? 60) * 60;

//   // Current code for active coding question + language
//   const codeKey     = `${currentQ?.id}_${language}`;
//   const currentCode = codes[codeKey] ?? currentQ?.boilerplates?.[language] ?? FALLBACK_BOILERPLATE[language] ?? '';

//   const timer = useTimer(
//     totalDuration,
//     useCallback(() => handleFinalSubmitRef.current?.(true), []),
//   );

//   // ── Fetch exam ────────────────────────────────────────────────
//   useEffect(() => {
//     const fetch_ = async () => {
//       try {
//         const snap = await getDoc(doc(db, 'exams', examId));
//         if (!snap.exists()) { setError('Exam not found.'); return; }
//         const data = { id: snap.id, ...snap.data() };
//         setExam(data);

//         const qDocs = await Promise.all(
//           (data.questionIds || []).map(qId => getDoc(doc(db, 'questions', qId))),
//         );
//         const qs = qDocs.filter(d => d.exists()).map(d => ({ id: d.id, ...d.data() }));
//         setQuestions(qs);

//         if (!urlSubmissionId && currentUser) {
//           const sid = await startSubmission({
//             examId,
//             examTitle:   data.title,
//             studentId:   currentUser.uid,
//             studentEmail:currentUser.email,
//             studentName: currentUser.displayName || currentUser.email,
//           });
//           setSubmissionId(sid);
//         }

//         // Skip MCQ phase if no MCQ questions
//         if (!qs.some(q => q.type === 'MCQ')) setPhase('coding');
//       } catch (err) {
//         console.error(err);
//         setError('Failed to load exam. Please refresh.');
//       } finally {
//         setLoading(false);
//       }
//     };
//     if (examId) fetch_();
//   }, [examId, currentUser, urlSubmissionId]);

//   // ── Proctoring — applies to BOTH MCQ and Coding phases ───────
//   useEffect(() => {
//     const enterFS = async () => { try { await document.documentElement.requestFullscreen?.(); } catch {} };
//     enterFS();

//     const onFSChange = () => {
//       if (!document.fullscreenElement) {
//         setViolations(v => {
//           const nv = v + 1;
//           if (nv >= 3) handleFinalSubmitRef.current?.(true);
//           return nv;
//         });
//         setShowViolation(true);
//       }
//     };
//     const onVis  = () => { if (document.hidden) setViolations(v => v + 1); };
//     const onKey  = e => {
//       if (e.key === 'F12' || (e.ctrlKey && e.shiftKey) || (e.ctrlKey && e.key === 'u'))
//         e.preventDefault();
//     };
//     const block  = e => e.preventDefault();

//     document.addEventListener('fullscreenchange',  onFSChange);
//     document.addEventListener('visibilitychange',  onVis);
//     document.addEventListener('keydown',           onKey);
//     document.addEventListener('contextmenu',       block);
//     document.addEventListener('copy',              block);
//     return () => {
//       document.removeEventListener('fullscreenchange',  onFSChange);
//       document.removeEventListener('visibilitychange',  onVis);
//       document.removeEventListener('keydown',           onKey);
//       document.removeEventListener('contextmenu',       block);
//       document.removeEventListener('copy',              block);
//     };
//   }, []);

//   // ── Final submit (saves MCQ + coding answers + score) ─────────
//   const handleFinalSubmit = useCallback(async (forced = false) => {
//     if (isSubmitting) return;
//     setConfirmSubmit(false); setShowSubmitModal(false);
//     setIsSubmitting(true);
//     setPhase('submitted');
//     try {
//       if (submissionId) {
//         await updateSubmission(submissionId, {
//           answers:     Object.entries(answers).map(([qId, ans]) => ({ questionId: qId, answer: ans })),
//           submittedAt: new Date(),
//           forcedSubmit: forced,
//           violations,
//         });
//         await calculateAndSaveScore(submissionId, answers, questions);
//       }
//     } catch (err) { console.error('Submit error:', err); }
//     setIsSubmitting(false);
//   }, [isSubmitting, submissionId, answers, violations, questions]);

//   handleFinalSubmitRef.current = handleFinalSubmit;

//   // ── MCQ handlers ──────────────────────────────────────────────
//   const handleMCQAnswer = (qId, option) =>
//     setAnswers(p => ({ ...p, [qId]: option }));

//   const toggleMark = (qId) =>
//     setMarked(prev => { const n = new Set(prev); n.has(qId) ? n.delete(qId) : n.add(qId); return n; });

//   const proceedToCoding = () => {
//     const unanswered = mcqQuestions.filter(q => !answers[q.id]);
//     if (unanswered.length > 0) {
//       if (!window.confirm(`You have ${unanswered.length} unanswered MCQ(s). Proceed?`)) return;
//     }
//     if (codingQuestions.length === 0) { setConfirmSubmit(true); return; }
//     setPhase('coding'); setCurrentIdx(0);
//     setTcResult(null); setRawOutput(null);
//   };

//   const getQStatus = (q, idx) => {
//     if (currentIdx === idx && phase === 'mcq') return 'current';
//     if (marked.has(q.id))  return 'marked';
//     if (answers[q.id])     return 'answered';
//     return 'unanswered';
//   };

//   // ── Coding: language change ───────────────────────────────────
//   const handleLangChange = (lang) => {
//     setLanguage(lang);
//     setTcResult(null); setRawOutput(null);
//   };

//   // ── Coding: Run button ────────────────────────────────────────
//   // Uses wrapper when methodName exists (fixes "empty output" bug)
//   const handleRun = async () => {
//     if (!currentCode.trim() || isRunning) return;
//     setIsRunning(true); setBottomTab('result');
//     setTcResult(null); setRawOutput('⏳ Running…');
//     try {
//       if (currentQ?.methodName && stdin) {
//         // Wrap code + call method with custom stdin as args
//         const fakeQ = { ...currentQ, testCases: [{ input: stdin, expectedOutput: '' }] };
//         const res   = await runWithTestCases(language, currentCode, fakeQ, { visibleCount: 1 });
//         const r     = res.results[0];
//         setRawOutput(r?.error ? `Error:\n${r.error}` : (r?.actualOutput || '(empty output)'));
//       } else {
//         // Raw run with stdin (student must include imports manually if no methodName)
//         const r = await executeCode(language, currentCode, stdin, currentQ?.timeLimitMs || 2000);
//         const out = r.compile_output
//           ? `Compilation Error:\n${r.compile_output}`
//           : r.stderr ? `Runtime Error:\n${r.stderr}`
//           : r.stdout || '(empty output)';
//         setRawOutput(out);
//       }
//     } catch (e) { setRawOutput(`Error: ${e.message}`); }
//     setIsRunning(false);
//   };

//   // ── Coding: Submit (LeetCode-style with wrapper) ──────────────
//   const handleCodingSubmit = async () => {
//     setShowSubmitModal(false);
//     if (!currentQ) return;

//     // Save current code to answers first
//     setAnswers(p => ({ ...p, [currentQ.id]: { code: currentCode, language, passedCount: 0 } }));

//     setIsSubmitting(true); setBottomTab('result');
//     setTcResult(null); setRawOutput(null);

//     const testCases = currentQ.testCases?.filter(tc => tc.input?.trim() && tc.expectedOutput?.trim()) || [];

//     try {
//       let passedCount = 0;

//       if (currentQ.methodName && testCases.length) {
//         // ✅ Full LeetCode-style evaluation with wrapper
//         const res = await runWithTestCases(language, currentCode, currentQ);
//         setTcResult(res);
//         passedCount = res.passedCount;

//         // Update answers with passedCount
//         const newAnswers = {
//           ...answers,
//           [currentQ.id]: { code: currentCode, language, passedCount },
//         };
//         setAnswers(newAnswers);

//         // Persist to Firestore
//         if (submissionId) {
//           await updateSubmission(submissionId, {
//             answers: Object.entries(newAnswers).map(([id, ans]) => ({ questionId: id, answer: ans })),
//           });
//         }

//         // If last coding question → final submit
//         if (currentIdx === codingQuestions.length - 1) {
//           await handleFinalSubmit(false);
//         }
//       } else if (!currentQ.methodName) {
//         // No methodName → raw run, can't auto-evaluate
//         setRawOutput('⚠️ No methodName configured for this question.\nThe code ran but cannot be auto-evaluated.\n\nAsk faculty to set methodName in the question editor.');
//         passedCount = 0;
//         if (currentIdx === codingQuestions.length - 1) {
//           await handleFinalSubmit(false);
//         }
//       } else {
//         // No test cases defined
//         setRawOutput('⚠️ No test cases defined for this question.');
//         if (currentIdx === codingQuestions.length - 1) {
//           await handleFinalSubmit(false);
//         }
//       }
//     } catch (e) {
//       setRawOutput(`Submission Error: ${e.message}`);
//     }
//     setIsSubmitting(false);
//   };

//   // Save & move to next coding question
//   const handleSaveAndNext = async () => {
//     if (!currentQ) return;
//     const newAnswers = { ...answers, [currentQ.id]: { code: currentCode, language, passedCount: tcResult?.passedCount || 0 } };
//     setAnswers(newAnswers);
//     if (submissionId) {
//       await updateSubmission(submissionId, {
//         answers: Object.entries(newAnswers).map(([id, ans]) => ({ questionId: id, answer: ans })),
//       });
//     }
//     setTcResult(null); setRawOutput(null); setBottomTab('result');
//     setCurrentIdx(i => i + 1);
//   };

//   // ── Loading / Error screens ───────────────────────────────────
//   if (loading) return (
//     <div style={{ minHeight:'100vh', background:'#0d1117', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
//       <div style={{ width:40, height:40, border:'3px solid #30363d', borderTopColor:'#58a6ff', borderRadius:'50%', animation:'spin .8s linear infinite' }} />
//       <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
//       <p style={{ color:'#8b949e', marginTop:16, fontSize:14 }}>Loading exam…</p>
//     </div>
//   );

//   if (error) return (
//     <div style={{ minHeight:'100vh', background:'#0d1117', display:'flex', alignItems:'center', justifyContent:'center' }}>
//       <div style={{ background:'#161b22', border:'1px solid rgba(248,81,73,0.3)', borderRadius:12, padding:32, textAlign:'center' }}>
//         <p style={{ color:'#f85149', marginBottom:16 }}>{error}</p>
//         <button onClick={() => history.push('/dashboard')}
//           style={{ padding:'10px 24px', background:'#21262d', border:'none', color:'#fff', borderRadius:8, cursor:'pointer' }}>
//           Return to Dashboard
//         </button>
//       </div>
//     </div>
//   );

//   // ── Submitted screen ──────────────────────────────────────────
//   if (phase === 'submitted') return (
//     <div style={{ minHeight:'100vh', background:'#0d1117', display:'flex', alignItems:'center', justifyContent:'center' }}>
//       <div style={{ background:'#161b22', border:'1px solid #30363d', borderRadius:20, padding:48, textAlign:'center', maxWidth:500 }}>
//         <div style={{ fontSize:48, marginBottom:16 }}>✅</div>
//         <h2 style={{ color:'#3fb950', fontSize:24, marginBottom:12 }}>Exam Submitted!</h2>
//         <p style={{ color:'#8b949e', fontSize:14, lineHeight:1.6, marginBottom:28 }}>
//           Your answers have been recorded and scored. Your faculty will review the results.
//         </p>
//         <button onClick={() => history.push('/dashboard')}
//           style={{ width:'100%', padding:'14px', background:'#58a6ff', border:'none', borderRadius:10, color:'#fff', cursor:'pointer', fontWeight:700, fontSize:15 }}>
//           Exit to Dashboard
//         </button>
//       </div>
//     </div>
//   );

//   // ── Confirm submit (MCQ-only exams) ───────────────────────────
//   if (confirmSubmit) return (
//     <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.85)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:2000 }}>
//       <div style={{ background:'#161b22', border:'1px solid #30363d', borderRadius:16, padding:36, textAlign:'center', maxWidth:440 }}>
//         <h3 style={{ color:'#e6edf3', marginBottom:12 }}>Submit Exam?</h3>
//         <p style={{ color:'#8b949e', marginBottom:24, lineHeight:1.6 }}>
//           You have answered {Object.keys(answers).filter(id => mcqQuestions.some(q => q.id === id)).length} of {mcqQuestions.length} MCQs.
//         </p>
//         <div style={{ display:'flex', gap:12, justifyContent:'center' }}>
//           <button onClick={() => setConfirmSubmit(false)}
//             style={{ padding:'10px 20px', background:'#21262d', border:'1px solid #30363d', borderRadius:8, color:'#8b949e', cursor:'pointer', fontWeight:700 }}>
//             Go Back
//           </button>
//           <button onClick={() => handleFinalSubmit(false)}
//             style={{ padding:'10px 20px', background:'#3fb950', border:'none', borderRadius:8, color:'#fff', cursor:'pointer', fontWeight:700 }}>
//             Submit Exam
//           </button>
//         </div>
//       </div>
//     </div>
//   );

//   // ═══════════════════════════════════════════════════════════════
//   // CODING PHASE
//   // ═══════════════════════════════════════════════════════════════
//   if (phase === 'coding') {
//     const q           = codingQuestions[currentIdx];
//     const isLast      = currentIdx === codingQuestions.length - 1;
//     const langObj     = LANGUAGES.find(l => l.value === language) ?? LANGUAGES[0];
//     const noMethodName= q && !q.methodName;

//     return (
//       <div style={{ display:'flex', flexDirection:'column', height:'100vh', background:'#0d1117', color:'#e6edf3', fontFamily:'system-ui,sans-serif', overflow:'hidden' }}>
//         <style>{`
//           @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&display=swap');
//           *{box-sizing:border-box;margin:0;padding:0;}
//           ::-webkit-scrollbar{width:6px;height:6px;}
//           ::-webkit-scrollbar-track{background:#0d1117;}
//           ::-webkit-scrollbar-thumb{background:#30363d;border-radius:3px;}
//           @keyframes spin{to{transform:rotate(360deg)}}
//         `}</style>

//         {/* Header */}
//         <header style={{ height:52, background:'#161b22', borderBottom:'1px solid #21262d', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 16px', flexShrink:0, gap:12 }}>
//           <div style={{ display:'flex', alignItems:'center', gap:10, minWidth:0 }}>
//             {/* Back to MCQ (if there were MCQ questions) */}
//             {mcqQuestions.length > 0 && (
//               <button onClick={() => { setPhase('mcq'); setCurrentIdx(mcqQuestions.length - 1); }}
//                 style={{ background:'none', border:'1px solid #30363d', color:'#8b949e', cursor:'pointer', fontSize:12, fontWeight:700, padding:'4px 10px', borderRadius:6, flexShrink:0 }}>
//                 ← MCQ
//               </button>
//             )}
//             <span style={{ fontSize:13, fontWeight:700, color:'#e6edf3', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
//               {q?.title || 'Loading…'}
//             </span>
//             {q?.difficulty && (
//               <span style={{ fontSize:11, fontWeight:700, padding:'2px 8px', borderRadius:10,
//                 background: q.difficulty==='Easy'?'rgba(0,185,107,.1)':q.difficulty==='Hard'?'rgba(239,68,68,.1)':'rgba(255,184,0,.1)',
//                 color: q.difficulty==='Easy'?'#00b96b':q.difficulty==='Hard'?'#ef4444':'#ffb800',
//                 flexShrink:0 }}>
//                 {q.difficulty}
//               </span>
//             )}
//             {noMethodName && (
//               <span style={{ fontSize:10, background:'rgba(239,68,68,.1)', color:'#f87171', border:'1px solid rgba(239,68,68,.25)', padding:'2px 8px', borderRadius:6, flexShrink:0 }}>
//                 ⚠ No methodName — submit runs raw
//               </span>
//             )}
//             <span style={{ fontSize:11, color:'#8b949e', flexShrink:0 }}>
//               Q {currentIdx + 1} / {codingQuestions.length}
//             </span>
//           </div>

//           <div style={{ display:'flex', alignItems:'center', gap:8, flexShrink:0 }}>
//             {/* Timer */}
//             <div style={{ fontFamily:'monospace', fontSize:15, fontWeight:800,
//               color: timer.urgent ? '#f85149' : '#58a6ff',
//               padding:'4px 12px', borderRadius:8,
//               background: timer.urgent ? 'rgba(248,81,73,.1)' : 'rgba(88,166,255,.08)',
//               border: `1px solid ${timer.urgent ? 'rgba(248,81,73,.3)' : 'rgba(88,166,255,.2)'}` }}>
//               {String(timer.h).padStart(2,'0')}:{String(timer.m).padStart(2,'0')}:{String(timer.s).padStart(2,'0')}
//             </div>
//             {violations > 0 && (
//               <span style={{ fontSize:11, fontWeight:700, padding:'3px 8px', borderRadius:6, background:'rgba(248,81,73,.15)', color:'#f85149', border:'1px solid rgba(248,81,73,.3)' }}>
//                 ⚠ {violations}/3
//               </span>
//             )}

//             {/* Language selector */}
//             <select value={language} onChange={e => handleLangChange(e.target.value)}
//               style={{ appearance:'none', background:'#21262d', border:'1px solid #30363d', borderRadius:6, padding:'5px 28px 5px 10px', color:'#e6edf3', fontSize:12, fontWeight:700, cursor:'pointer', outline:'none' }}>
//               {LANGUAGES.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
//             </select>

//             {/* Reset boilerplate */}
//             <button onClick={() => setCodes(p => ({ ...p, [codeKey]: q?.boilerplates?.[language] ?? FALLBACK_BOILERPLATE[language] }))}
//               style={{ background:'none', border:'1px solid #30363d', borderRadius:5, padding:'4px 10px', color:'#8b949e', fontSize:12, cursor:'pointer' }}>
//               ↺ Reset
//             </button>

//             {/* Run */}
//             <button onClick={handleRun} disabled={isRunning || isSubmitting}
//               style={{ padding:'6px 16px', borderRadius:6, background:'rgba(35,134,54,.15)', color:'#3fb950', border:'1px solid rgba(35,134,54,.3)', fontSize:13, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', gap:6, opacity:isRunning?0.6:1 }}>
//               {isRunning ? <span style={{ width:12, height:12, border:'2px solid #3fb950', borderTopColor:'transparent', borderRadius:'50%', animation:'spin .7s linear infinite', display:'inline-block' }} /> : '▶'}
//               {isRunning ? 'Running…' : 'Run'}
//             </button>

//             {/* Submit / Save & Next */}
//             {isLast ? (
//               <button onClick={() => setShowSubmitModal(true)} disabled={isSubmitting}
//                 style={{ padding:'6px 20px', borderRadius:6, background:'#f0883e', color:'#fff', border:'none', fontSize:13, fontWeight:800, cursor:'pointer', opacity:isSubmitting?0.7:1 }}>
//                 {isSubmitting ? 'Evaluating…' : 'Submit Exam'}
//               </button>
//             ) : (
//               <>
//                 <button onClick={() => setShowSubmitModal(true)} disabled={isSubmitting}
//                   style={{ padding:'6px 16px', borderRadius:6, background:'rgba(88,166,255,.15)', color:'#58a6ff', border:'1px solid rgba(88,166,255,.3)', fontSize:12, fontWeight:700, cursor:'pointer', opacity:isSubmitting?0.7:1 }}>
//                   {isSubmitting ? 'Evaluating…' : 'Submit & Check'}
//                 </button>
//                 <button onClick={handleSaveAndNext} disabled={isSubmitting}
//                   style={{ padding:'6px 14px', borderRadius:6, background:'#21262d', color:'#8b949e', border:'1px solid #30363d', fontSize:12, fontWeight:700, cursor:'pointer' }}>
//                   Save & Next →
//                 </button>
//               </>
//             )}
//           </div>
//         </header>

//         {/* Body: left panel + editor + result */}
//         <div style={{ flex:1, display:'flex', overflow:'hidden' }}>

//           {/* Left: description */}
//           <div style={{ width:'40%', display:'flex', flexDirection:'column', borderRight:'1px solid #21262d', overflow:'hidden' }}>
//             <div style={{ display:'flex', background:'#161b22', borderBottom:'1px solid #21262d', padding:'0 4px', flexShrink:0 }}>
//               <span style={{ padding:'10px 16px', fontSize:13, fontWeight:700, color:'#e6edf3', borderBottom:'2px solid #f0883e' }}>Description</span>
//             </div>
//             <div style={{ flex:1, overflowY:'auto', padding:'20px 24px' }}>
//               <h2 style={{ fontSize:20, fontWeight:800, color:'#e6edf3', marginBottom:14, lineHeight:1.3 }}>{q?.title}</h2>
//               <div style={{ display:'flex', gap:8, marginBottom:18, flexWrap:'wrap' }}>
//                 {q?.marks && <span style={{ fontSize:12, fontWeight:700, padding:'3px 10px', borderRadius:12, background:'rgba(88,166,255,.1)', color:'#58a6ff', border:'1px solid rgba(88,166,255,.2)' }}>{q.marks} pts</span>}
//                 {q?.testCases?.length > 0 && <span style={{ fontSize:12, fontWeight:700, padding:'3px 10px', borderRadius:12, background:'rgba(63,185,80,.1)', color:'#3fb950', border:'1px solid rgba(63,185,80,.2)' }}>{q.testCases.length} test cases</span>}
//               </div>
//               <div style={{ fontSize:15, lineHeight:1.85, color:'#c9d1d9' }}
//                 dangerouslySetInnerHTML={{ __html: q?.description || q?.question || '<p>No description.</p>' }} />

//               {/* Visible example test cases */}
//               {q?.testCases?.filter(tc => !tc.isHidden).slice(0,3).map((tc, i) => (
//                 <div key={i} style={{ marginTop:20, background:'#161b22', border:'1px solid #21262d', borderRadius:10, overflow:'hidden' }}>
//                   <div style={{ padding:'8px 14px', borderBottom:'1px solid #21262d', fontSize:12, fontWeight:700, color:'#8b949e' }}>Example {i+1}</div>
//                   <div style={{ padding:14 }}>
//                     <p style={{ fontSize:12, color:'#8b949e', marginBottom:4 }}>Input:</p>
//                     <pre style={{ background:'#0d1117', padding:'8px 12px', borderRadius:6, fontSize:12, color:'#a5d6ff', fontFamily:'monospace', marginBottom:10, overflow:'auto' }}>{tc.input}</pre>
//                     <p style={{ fontSize:12, color:'#8b949e', marginBottom:4 }}>Output:</p>
//                     <pre style={{ background:'#0d1117', padding:'8px 12px', borderRadius:6, fontSize:12, color:'#7ee787', fontFamily:'monospace', overflow:'auto' }}>{tc.expectedOutput}</pre>
//                   </div>
//                 </div>
//               ))}
//               {q?.testCases?.filter(tc => tc.isHidden).length > 0 && (
//                 <p style={{ fontSize:12, color:'#8b949e', marginTop:12, fontStyle:'italic' }}>
//                   + {q.testCases.filter(tc => tc.isHidden).length} hidden test cases. Submit to run all.
//                 </p>
//               )}
//             </div>
//           </div>

//           {/* Right: Monaco editor + result panel */}
//           <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
//             {/* Editor header */}
//             <div style={{ height:38, background:'#161b22', borderBottom:'1px solid #21262d', display:'flex', alignItems:'center', padding:'0 14px', gap:10, flexShrink:0 }}>
//               <span style={{ fontSize:12, color:'#8b949e' }}>{langObj.label} · Monaco</span>
//             </div>

//             {/* Monaco editor — same as PracticePage */}
//             <div style={{ flex:'0 0 60%', overflow:'hidden' }}>
//               <Editor
//                 theme="vs-dark"
//                 language={langObj.monaco}
//                 value={currentCode}
//                 onChange={v => setCodes(p => ({ ...p, [codeKey]: v ?? '' }))}
//                 options={{
//                   minimap:              { enabled: false },
//                   fontSize:             14,
//                   lineHeight:           22,
//                   scrollBeyondLastLine: false,
//                   tabSize:              4,
//                   wordWrap:             'on',
//                   automaticLayout:      true,
//                 }}
//               />
//             </div>

//             {/* Result panel */}
//             <div style={{ flex:1, display:'flex', flexDirection:'column', borderTop:'1px solid #21262d', minHeight:0 }}>
//               {/* Tabs */}
//               <div style={{ display:'flex', alignItems:'center', background:'#161b22', borderBottom:'1px solid #21262d', height:38, padding:'0 8px', flexShrink:0 }}>
//                 <button onClick={() => setBottomTab('stdin')}
//                   style={{ padding:'0 14px', height:'100%', background:'none', border:'none', borderBottom:`2px solid ${bottomTab==='stdin'?'#f0883e':'transparent'}`, color:bottomTab==='stdin'?'#e6edf3':'#8b949e', fontSize:12, fontWeight:bottomTab==='stdin'?700:400, cursor:'pointer' }}>
//                   📥 Custom Input
//                 </button>
//                 <button onClick={() => setBottomTab('result')}
//                   style={{ padding:'0 14px', height:'100%', background:'none', border:'none', borderBottom:`2px solid ${bottomTab==='result'?'#f0883e':'transparent'}`, color:bottomTab==='result'?'#e6edf3':'#8b949e', fontSize:12, fontWeight:bottomTab==='result'?700:400, cursor:'pointer', display:'flex', alignItems:'center', gap:6 }}>
//                   📤 Test Results
//                   {tcResult && <span style={{ width:7, height:7, borderRadius:'50%', background: tcResult.allPassed?'#3fb950':'#f85149', display:'inline-block' }} />}
//                 </button>
//               </div>

//               <div style={{ flex:1, overflow:'hidden' }}>
//                 {bottomTab === 'stdin' ? (
//                   <div style={{ height:'100%', padding:12 }}>
//                     <textarea value={stdin} onChange={e => setStdin(e.target.value)}
//                       placeholder={q?.methodName
//                         ? `Custom input args for Run (e.g. [2,7,11,15], 9)\nSubmit always runs all ${q?.testCases?.length || 0} test cases.`
//                         : 'Custom stdin for Run button…'}
//                       style={{ width:'100%', height:'100%', background:'#0d1117', color:'#e6edf3', border:'none', resize:'none', fontFamily:"'Courier New',monospace", fontSize:13, outline:'none', lineHeight:1.65 }} />
//                   </div>
//                 ) : (
//                   <TestResultPanel
//                     tcResult={tcResult}
//                     rawOutput={rawOutput}
//                     isEvaluating={isRunning || isSubmitting}
//                   />
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Submit confirm modal */}
//         {showSubmitModal && (
//           <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.8)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000 }}>
//             <div style={{ background:'#161b22', border:'1px solid #30363d', borderRadius:16, padding:36, maxWidth:440, width:'90%', textAlign:'center' }}>
//               <div style={{ fontSize:42, marginBottom:16 }}>📋</div>
//               <h3 style={{ fontSize:20, fontWeight:800, color:'#e6edf3', marginBottom:10 }}>
//                 {isLast ? 'Submit Exam?' : 'Submit & Check Solution?'}
//               </h3>
//               <p style={{ fontSize:14, color:'#8b949e', lineHeight:1.6, marginBottom:24 }}>
//                 Your code will be evaluated against all test cases including hidden ones.
//                 {isLast && ' This will end your exam.'}
//               </p>
//               <div style={{ display:'flex', gap:12, justifyContent:'center' }}>
//                 <button onClick={() => setShowSubmitModal(false)}
//                   style={{ padding:'10px 24px', borderRadius:8, background:'#21262d', border:'1px solid #30363d', color:'#8b949e', fontSize:14, fontWeight:700, cursor:'pointer' }}>
//                   Cancel
//                 </button>
//                 <button onClick={handleCodingSubmit}
//                   style={{ padding:'10px 24px', borderRadius:8, background:'#f0883e', border:'none', color:'#fff', fontSize:14, fontWeight:800, cursor:'pointer' }}>
//                   {isLast ? 'Submit Exam' : 'Submit & Evaluate'}
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Proctoring violation overlay */}
//         {showViolation && (
//           <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.9)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:2000 }}>
//             <div style={{ background:'#161b22', border:'2px solid rgba(248,81,73,.5)', borderRadius:16, padding:40, maxWidth:460, width:'90%', textAlign:'center' }}>
//               <div style={{ fontSize:50, marginBottom:16 }}>🚨</div>
//               <h3 style={{ fontSize:22, fontWeight:800, color:'#f85149', marginBottom:12 }}>Proctoring Violation!</h3>
//               <p style={{ fontSize:14, color:'#c9d1d9', lineHeight:1.7, marginBottom:24 }}>
//                 Violations: <strong style={{ color:'#f85149' }}>{violations}/3</strong> — At 3 your exam auto-submits.
//               </p>
//               <div style={{ display:'flex', gap:12, justifyContent:'center' }}>
//                 <button onClick={() => handleFinalSubmit(true)}
//                   style={{ padding:'10px 20px', borderRadius:8, background:'#f85149', border:'none', color:'#fff', fontSize:14, fontWeight:700, cursor:'pointer' }}>
//                   Submit Now
//                 </button>
//                 <button onClick={async () => { setShowViolation(false); try { await document.documentElement.requestFullscreen?.(); } catch {} }}
//                   style={{ padding:'10px 20px', borderRadius:8, background:'#21262d', border:'1px solid #388bfd', color:'#58a6ff', fontSize:14, fontWeight:700, cursor:'pointer' }}>
//                   Return to Exam
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   }

//   // ═══════════════════════════════════════════════════════════════
//   // MCQ PHASE
//   // ═══════════════════════════════════════════════════════════════
//   return (
//     <div style={{ minHeight:'100vh', background:'#0d1117', color:'#e6edf3', display:'flex', flexDirection:'column', fontFamily:'system-ui' }}>
//       <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>

//       {/* MCQ Header */}
//       <header style={{ background:'#161b22', borderBottom:'1px solid #21262d', padding:'0 24px', height:56, display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 }}>
//         <div style={{ display:'flex', alignItems:'center', gap:12 }}>
//           <span style={{ fontWeight:800, fontSize:15 }}>{exam?.title}</span>
//           {violations > 0 && (
//             <span style={{ background:'rgba(248,81,73,0.15)', border:'1px solid rgba(248,81,73,0.3)', color:'#f85149', fontSize:11, fontWeight:700, padding:'2px 8px', borderRadius:6 }}>
//               ⚠️ {violations}/3 Violations
//             </span>
//           )}
//         </div>
//         <span style={{ fontFamily:'monospace', fontSize:20, fontWeight:800, color:timer.urgent?'#f85149':'#58a6ff' }}>
//           {String(timer.h).padStart(2,'0')}:{String(timer.m).padStart(2,'0')}:{String(timer.s).padStart(2,'0')}
//         </span>
//         <button onClick={proceedToCoding}
//           style={{ padding:'8px 20px', background:'#f0883e', border:'none', borderRadius:8, color:'#fff', fontWeight:700, cursor:'pointer', fontSize:14 }}>
//           {codingQuestions.length > 0 ? 'Next Phase →' : 'Submit Exam ✓'}
//         </button>
//       </header>

//       {/* MCQ Body */}
//       <div style={{ flex:1, display:'flex', overflow:'hidden' }}>
//         {/* Question area */}
//         <div style={{ flex:1, overflowY:'auto', padding:'32px 40px' }}>
//           {!currentQ ? (
//             <p style={{ color:'#8b949e' }}>No MCQ questions in this exam.</p>
//           ) : (
//             <>
//               <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:28 }}>
//                 <span style={{ fontSize:13, color:'#8b949e' }}>Question {currentIdx+1} of {mcqQuestions.length}</span>
//                 <button onClick={() => toggleMark(currentQ.id)}
//                   style={{ padding:'4px 12px', background:'#21262d', border:'1px solid #30363d', borderRadius:6, color:marked.has(currentQ.id)?'#58a6ff':'#8b949e', cursor:'pointer', fontSize:12 }}>
//                   🔖 {marked.has(currentQ.id)?'Marked':'Mark for Review'}
//                 </button>
//               </div>

//               <div style={{ fontSize:18, lineHeight:1.75, marginBottom:32 }}
//                 dangerouslySetInnerHTML={{ __html: currentQ.description || currentQ.question }} />

//               <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
//                 {(currentQ.options||[]).map((opt, i) => (
//                   <button key={i} onClick={() => handleMCQAnswer(currentQ.id, opt)}
//                     style={{
//                       display:'flex', alignItems:'center', gap:16, padding:'16px 20px',
//                       background: answers[currentQ.id]===opt ? 'rgba(88,166,255,0.1)' : '#161b22',
//                       border: `2px solid ${answers[currentQ.id]===opt ? '#58a6ff' : '#21262d'}`,
//                       borderRadius:12, cursor:'pointer', textAlign:'left', width:'100%',
//                       color:'#e6edf3', fontSize:15, transition:'all 0.15s',
//                     }}>
//                     <span style={{ width:28, height:28, borderRadius:'50%',
//                       background: answers[currentQ.id]===opt ? '#58a6ff' : '#21262d',
//                       display:'flex', alignItems:'center', justifyContent:'center',
//                       fontWeight:700, fontSize:13, flexShrink:0 }}>
//                       {['A','B','C','D','E'][i]}
//                     </span>
//                     {opt}
//                   </button>
//                 ))}
//               </div>

//               <div style={{ display:'flex', justifyContent:'space-between', marginTop:40 }}>
//                 <button onClick={() => setCurrentIdx(i => Math.max(0,i-1))} disabled={currentIdx===0}
//                   style={{ padding:'10px 24px', background:'#21262d', border:'none', borderRadius:8, color:'#fff', cursor:'pointer', opacity:currentIdx===0?0.4:1 }}>
//                   ← Prev
//                 </button>
//                 {currentIdx < mcqQuestions.length-1 ? (
//                   <button onClick={() => setCurrentIdx(i => i+1)}
//                     style={{ padding:'10px 24px', background:'#21262d', border:'none', borderRadius:8, color:'#fff', cursor:'pointer' }}>
//                     Next →
//                   </button>
//                 ) : (
//                   <button onClick={proceedToCoding}
//                     style={{ padding:'10px 24px', background:'#3fb950', border:'none', borderRadius:8, color:'#fff', fontWeight:700, cursor:'pointer' }}>
//                     {codingQuestions.length>0 ? 'Coding Phase ✓' : 'Submit Exam ✓'}
//                   </button>
//                 )}
//               </div>
//             </>
//           )}
//         </div>

//         {/* MCQ Palette */}
//         <div style={{ width:240, background:'#161b22', borderLeft:'1px solid #21262d', padding:16, overflowY:'auto' }}>
//           <p style={{ fontSize:11, fontWeight:700, color:'#8b949e', marginBottom:12, textTransform:'uppercase', letterSpacing:'0.08em' }}>MCQ Palette</p>
//           <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:6, marginBottom:20 }}>
//             {mcqQuestions.map((q, i) => {
//               const s = Q_STATUS[getQStatus(q, i)];
//               return (
//                 <button key={q.id} onClick={() => setCurrentIdx(i)}
//                   style={{ aspectRatio:'1', borderRadius:6, background:s.bg, border:`1px solid ${s.border}`, color:s.color, fontWeight:700, cursor:'pointer', fontSize:12 }}>
//                   {i+1}
//                 </button>
//               );
//             })}
//           </div>
//           {[
//             {key:'answered',   label:'Answered'},
//             {key:'marked',     label:'Marked'},
//             {key:'unanswered', label:'Not Answered'},
//           ].map(({key,label}) => (
//             <div key={key} style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
//               <div style={{ width:12, height:12, borderRadius:3, background:Q_STATUS[key].bg, border:`1px solid ${Q_STATUS[key].border}` }} />
//               <span style={{ fontSize:11, color:'#8b949e' }}>{label}</span>
//             </div>
//           ))}
//           <div style={{ marginTop:20, padding:'12px', background:'rgba(88,166,255,0.06)', border:'1px solid rgba(88,166,255,0.15)', borderRadius:8 }}>
//             <p style={{ fontSize:11, color:'#8b949e', lineHeight:1.5 }}>
//               Answered: <strong style={{ color:'#3fb950' }}>
//                 {Object.keys(answers).filter(id => mcqQuestions.some(q => q.id === id)).length}
//               </strong> / {mcqQuestions.length}
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Proctoring violation overlay */}
//       {showViolation && (
//         <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.85)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:2000 }}>
//           <div style={{ background:'#161b22', border:'2px solid rgba(248,81,73,0.4)', borderRadius:16, padding:36, textAlign:'center', maxWidth:440 }}>
//             <div style={{ fontSize:48, marginBottom:12 }}>🚨</div>
//             <h3 style={{ color:'#f85149', marginBottom:12 }}>Proctoring Violation</h3>
//             <p style={{ color:'#c9d1d9', lineHeight:1.6, marginBottom:8 }}>
//               Fullscreen exit detected. <strong>{violations}/3</strong> violations.
//               At 3 your exam is automatically submitted.
//             </p>
//             <button onClick={async () => { setShowViolation(false); try { await document.documentElement.requestFullscreen?.(); } catch {} }}
//               style={{ padding:'10px 24px', background:'#58a6ff', border:'none', borderRadius:8, color:'#fff', cursor:'pointer', fontWeight:700, marginTop:16 }}>
//               Return to Exam
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
























// // src/pages/ExamPage.jsx — Mind Code Platform
// // Coding phase uses Monaco + runWithTestCases wrapper (same as PracticePage)
// // ✅ Run: wrapper when methodName exists → no NameError, correct output
// // ✅ Submit: runWithTestCases → LeetCode-style test result panel
// // ✅ Proctoring covers both MCQ and Coding phases

// import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
// import { useParams, useHistory }    from 'react-router-dom';
// import { doc, getDoc }              from 'firebase/firestore';
// import Editor                       from '@monaco-editor/react';
// import { db }                       from '../firebase/config';
// import { useAuth }                  from '../context/AuthContext';
// import {
//   startSubmission, updateSubmission, calculateAndSaveScore,
// } from '../api/examService';
// import {
//   executeCode, runWithTestCases,
// } from '../api/compilerService';

// const LANGUAGES = [
//   { label: 'C++',        value: 'cpp',        monaco: 'cpp'        },
//   { label: 'Python',     value: 'python',     monaco: 'python'     },
//   { label: 'JavaScript', value: 'javascript', monaco: 'javascript' },
//   { label: 'Java',       value: 'java',       monaco: 'java'       },
//   { label: 'C',          value: 'c',          monaco: 'c'          },
// ];

// const FALLBACK_BOILERPLATE = {
//   cpp:        '#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Write your solution here\n};\n',
//   python:     'class Solution:\n    def solution(self):\n        # Write your solution here\n        pass\n',
//   javascript: 'class Solution {\n    solution() {\n        // Write your solution here\n    }\n}\n',
//   java:       'class Solution {\n    public Object solution() {\n        // Write your solution here\n        return null;\n    }\n}\n',
//   c:          '#include <stdio.h>\n\n// Write your solution here\n',
// };

// const Q_STATUS = {
//   unanswered: { bg: '#21262d', border: '#30363d',             color: '#8b949e' },
//   answered:   { bg: 'rgba(63,185,80,0.15)',  border: 'rgba(63,185,80,0.4)',  color: '#3fb950' },
//   marked:     { bg: 'rgba(88,166,255,0.15)', border: 'rgba(88,166,255,0.4)', color: '#58a6ff' },
//   current:    { bg: '#f0883e', border: '#f0883e', color: '#fff' },
// };

// function useTimer(totalSecs, onEnd) {
//   const [rem, setRem]  = useState(totalSecs);
//   const startRef       = useRef(Date.now());
//   const firedRef       = useRef(false);
//   useEffect(() => { startRef.current = Date.now(); setRem(totalSecs); firedRef.current = false; }, [totalSecs]);
//   useEffect(() => {
//     const t = setInterval(() => {
//       const left = Math.max(0, totalSecs - Math.floor((Date.now() - startRef.current) / 1000));
//       setRem(left);
//       if (left === 0 && !firedRef.current) { firedRef.current = true; onEnd?.(); }
//     }, 1000);
//     return () => clearInterval(t);
//   }, [totalSecs, onEnd]);
//   return {
//     h: Math.floor(rem / 3600),
//     m: Math.floor((rem % 3600) / 60),
//     s: rem % 60,
//     remaining: rem,
//     urgent:    rem < 300,
//   };
// }

// // LeetCode-style test result panel — identical to PracticePage
// function TestResultPanel({ tcResult, rawOutput, isEvaluating }) {
//   const [sel, setSel] = useState(0);

//   useEffect(() => {
//     if (tcResult?.results?.length) {
//       const first = tcResult.results.findIndex(r => !r.passed && r.isVisible);
//       setSel(first >= 0 ? first : 0);
//     }
//   }, [tcResult]);

//   if (isEvaluating) return (
//     <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100%', gap:12, color:'#58a6ff' }}>
//       <div style={{ width:32, height:32, border:'3px solid #58a6ff', borderTopColor:'transparent', borderRadius:'50%', animation:'spin .7s linear infinite' }} />
//       <span style={{ fontSize:13, fontWeight:600 }}>Evaluating your solution…</span>
//     </div>
//   );

//   if (rawOutput !== null && !tcResult) return (
//     <div style={{ padding:14, height:'100%', overflowY:'auto' }}>
//       <pre style={{ fontSize:13, color:'#e6edf3', whiteSpace:'pre-wrap', wordBreak:'break-word', lineHeight:1.65, margin:0 }}>
//         {rawOutput || 'Run your code to see output.'}
//       </pre>
//     </div>
//   );

//   if (!tcResult) return (
//     <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100%', gap:8, color:'#484f58' }}>
//       <span style={{ fontSize:32 }}>💻</span>
//       <span style={{ fontSize:13 }}>Submit to evaluate against test cases</span>
//     </div>
//   );

//   const { results: cases, passedCount, totalCount, allPassed, visiblePassed, visibleTotal } = tcResult;
//   const shownCase = cases[sel];

//   return (
//     <div style={{ display:'flex', flexDirection:'column', height:'100%', overflow:'hidden' }}>
//       <div style={{ padding:'10px 14px', borderBottom:'1px solid #21262d', flexShrink:0, background: allPassed ? 'rgba(63,185,80,.07)' : 'rgba(248,81,73,.07)' }}>
//         <div style={{ display:'flex', alignItems:'center', gap:10 }}>
//           <span style={{ fontSize:20 }}>{allPassed ? '✅' : '❌'}</span>
//           <div>
//             <div style={{ fontSize:14, fontWeight:800, color: allPassed ? '#3fb950' : '#f85149' }}>
//               {allPassed ? 'All Test Cases Passed!' : `${passedCount} / ${totalCount} Passed`}
//             </div>
//             <div style={{ fontSize:11, color:'#8b949e', marginTop:2, fontFamily:'monospace' }}>
//               Visible: {visiblePassed}/{visibleTotal}
//               {totalCount > visibleTotal && ` · Hidden: ${passedCount - visiblePassed}/${totalCount - visibleTotal}`}
//             </div>
//           </div>
//         </div>
//         <div style={{ display:'flex', gap:5, marginTop:10, flexWrap:'wrap' }}>
//           {cases.map((c, i) => (
//             <button key={i} onClick={() => setSel(i)}
//               title={`Case ${i+1}: ${c.passed ? 'Passed' : c.statusLabel}`}
//               style={{
//                 width:30, height:30, borderRadius:7, border:'none', cursor:'pointer', fontWeight:700, fontSize:11,
//                 background: sel === i ? (c.passed ? '#3fb950' : '#f85149') : (c.passed ? 'rgba(63,185,80,.15)' : 'rgba(248,81,73,.15)'),
//                 color: sel === i ? '#fff' : (c.passed ? '#3fb950' : '#f85149'),
//                 outline: sel === i ? `2px solid ${c.passed ? '#3fb950' : '#f85149'}` : 'none',
//                 outlineOffset: 1,
//               }}>
//               {c.isVisible ? i + 1 : 'H'}
//             </button>
//           ))}
//         </div>
//       </div>

//       {shownCase && (
//         <div style={{ flex:1, overflowY:'auto', padding:12 }}>
//           <div style={{ display:'flex', justifyContent:'space-between', marginBottom:10 }}>
//             <span style={{ fontSize:12, fontWeight:700, color:'#8b949e' }}>
//               Case {sel + 1} {shownCase.isVisible ? '' : '(Hidden)'}
//             </span>
//             <span style={{ fontSize:11, fontWeight:800, padding:'2px 10px', borderRadius:20,
//               background: shownCase.passed ? 'rgba(63,185,80,.12)' : 'rgba(248,81,73,.12)',
//               color: shownCase.passed ? '#3fb950' : '#f85149',
//               border: `1px solid ${shownCase.passed ? 'rgba(63,185,80,.3)' : 'rgba(248,81,73,.3)'}` }}>
//               {shownCase.statusLabel}
//             </span>
//           </div>
//           {shownCase.isVisible && shownCase.input !== null ? (
//             <>
//               {[['Input', shownCase.input, '#a5d6ff'], ['Expected', shownCase.expectedOutput, '#7ee787'], ['Your Output', shownCase.actualOutput || '(empty)', shownCase.passed ? '#7ee787' : '#f85149']].map(([label, val, color]) => (
//                 <div key={label} style={{ marginBottom:10 }}>
//                   <p style={{ fontSize:11, color:'#8b949e', marginBottom:3, textTransform:'uppercase', letterSpacing:'0.06em' }}>{label}</p>
//                   <pre style={{ background:'#0d1117', padding:'8px 12px', borderRadius:8, fontSize:12, color, fontFamily:'monospace', overflow:'auto', border:'1px solid #21262d', margin:0 }}>{val}</pre>
//                 </div>
//               ))}
//               {shownCase.error && (
//                 <div style={{ marginBottom:10 }}>
//                   <p style={{ fontSize:11, color:'#f85149', marginBottom:3, textTransform:'uppercase', letterSpacing:'0.06em' }}>Error</p>
//                   <pre style={{ background:'#0d1117', padding:'8px 12px', borderRadius:8, fontSize:12, color:'#f85149', fontFamily:'monospace', overflow:'auto', border:'1px solid rgba(248,81,73,.2)', margin:0 }}>{shownCase.error}</pre>
//                 </div>
//               )}
//               {shownCase.time && <p style={{ fontSize:11, color:'#8b949e', fontFamily:'monospace' }}>Runtime: {shownCase.time}s · {shownCase.memory}KB</p>}
//             </>
//           ) : (
//             <div style={{ padding:'14px 16px', background: shownCase.passed ? 'rgba(63,185,80,.06)' : 'rgba(248,81,73,.06)', border:`1px solid ${shownCase.passed ? 'rgba(63,185,80,.2)' : 'rgba(248,81,73,.2)'}`, borderRadius:10 }}>
//               <p style={{ fontSize:13, fontWeight:700, color: shownCase.passed ? '#3fb950' : '#f85149' }}>
//                 {shownCase.passed ? '✓ Hidden test case passed.' : '✗ Hidden test case failed.'}
//               </p>
//               {shownCase.error && <p style={{ fontSize:12, color:'#8b949e', marginTop:6 }}>Error: {shownCase.error}</p>}
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

// export default function ExamPage() {
//   const { examId, submissionId: urlSubmissionId } = useParams();
//   const { currentUser } = useAuth();
//   const history         = useHistory();

//   const [exam,         setExam]         = useState(null);
//   const [questions,    setQuestions]    = useState([]);
//   const [loading,      setLoading]      = useState(true);
//   const [error,        setError]        = useState(null);
//   const [submissionId, setSubmissionId] = useState(urlSubmissionId || null);

//   const [phase,       setPhase]       = useState('mcq');
//   const [currentIdx,  setCurrentIdx]  = useState(0);

//   const [answers,  setAnswers]  = useState({});
//   const [marked,   setMarked]   = useState(new Set());

//   const [language,     setLanguage]     = useState('cpp');
//   const [codes,        setCodes]        = useState({});
//   const [isRunning,    setIsRunning]    = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [tcResult,     setTcResult]     = useState(null);
//   const [rawOutput,    setRawOutput]    = useState(null);
//   const [bottomTab,    setBottomTab]    = useState('result');
//   const [stdin,        setStdin]        = useState('');

//   const [violations,      setViolations]      = useState(0);
//   const [showViolation,   setShowViolation]   = useState(false);
//   const [confirmSubmit,   setConfirmSubmit]   = useState(false);
//   const [showSubmitModal, setShowSubmitModal] = useState(false);

//   const handleFinalSubmitRef = useRef(null);

//   const mcqQuestions    = useMemo(() => questions.filter(q => q.type === 'MCQ'), [questions]);
//   const codingQuestions = useMemo(() => questions.filter(q => (q.type || '').toUpperCase() === 'CODING'), [questions]);
//   const currentQ        = phase === 'mcq' ? mcqQuestions[currentIdx] : codingQuestions[currentIdx];
//   const totalDuration   = (exam?.durationMinutes ?? 60) * 60;

//   const codeKey     = `${currentQ?.id}_${language}`;
//   const currentCode = codes[codeKey] ?? currentQ?.boilerplates?.[language] ?? FALLBACK_BOILERPLATE[language] ?? '';

//   const timer = useTimer(
//     totalDuration,
//     useCallback(() => handleFinalSubmitRef.current?.(true), []),
//   );

//   useEffect(() => {
//     const fetch_ = async () => {
//       try {
//         const snap = await getDoc(doc(db, 'exams', examId));
//         if (!snap.exists()) { setError('Exam not found.'); return; }
//         const data = { id: snap.id, ...snap.data() };
//         setExam(data);

//         const qDocs = await Promise.all(
//           (data.questionIds || []).map(qId => getDoc(doc(db, 'questions', qId))),
//         );
//         const qs = qDocs.filter(d => d.exists()).map(d => ({ id: d.id, ...d.data() }));
//         setQuestions(qs);

//         if (!urlSubmissionId && currentUser) {
//           const sid = await startSubmission({
//             examId,
//             examTitle:    data.title,
//             studentId:    currentUser.uid,
//             studentEmail: currentUser.email,
//             studentName:  currentUser.displayName || currentUser.email,
//           });
//           setSubmissionId(sid);
//         }

//         if (!qs.some(q => q.type === 'MCQ')) setPhase('coding');
//       } catch (err) {
//         console.error(err);
//         setError('Failed to load exam. Please refresh.');
//       } finally {
//         setLoading(false);
//       }
//     };
//     if (examId) fetch_();
//   }, [examId, currentUser, urlSubmissionId]);

//   // Proctoring — both phases
//   useEffect(() => {
//     const enterFS = async () => { try { await document.documentElement.requestFullscreen?.(); } catch {} };
//     enterFS();

//     const onFSChange = () => {
//       if (!document.fullscreenElement) {
//         setViolations(v => {
//           const nv = v + 1;
//           if (nv >= 3) handleFinalSubmitRef.current?.(true);
//           return nv;
//         });
//         setShowViolation(true);
//       }
//     };
//     const onVis  = () => { if (document.hidden) setViolations(v => v + 1); };
//     const onKey  = e => {
//       if (e.key === 'F12' || (e.ctrlKey && e.shiftKey) || (e.ctrlKey && e.key === 'u'))
//         e.preventDefault();
//     };
//     const block  = e => e.preventDefault();

//     document.addEventListener('fullscreenchange',  onFSChange);
//     document.addEventListener('visibilitychange',  onVis);
//     document.addEventListener('keydown',           onKey);
//     document.addEventListener('contextmenu',       block);
//     document.addEventListener('copy',              block);
//     return () => {
//       document.removeEventListener('fullscreenchange',  onFSChange);
//       document.removeEventListener('visibilitychange',  onVis);
//       document.removeEventListener('keydown',           onKey);
//       document.removeEventListener('contextmenu',       block);
//       document.removeEventListener('copy',              block);
//     };
//   }, []);

//   const handleFinalSubmit = useCallback(async (forced = false) => {
//     if (isSubmitting) return;
//     setConfirmSubmit(false); setShowSubmitModal(false);
//     setIsSubmitting(true);
//     setPhase('submitted');
//     try {
//       if (submissionId) {
//         await updateSubmission(submissionId, {
//           answers:      Object.entries(answers).map(([qId, ans]) => ({ questionId: qId, answer: ans })),
//           submittedAt:  new Date(),
//           forcedSubmit: forced,
//           violations,
//         });
//         await calculateAndSaveScore(submissionId, answers, questions);
//       }
//     } catch (err) { console.error('Submit error:', err); }
//     setIsSubmitting(false);
//   }, [isSubmitting, submissionId, answers, violations, questions]);

//   handleFinalSubmitRef.current = handleFinalSubmit;

//   const handleMCQAnswer = (qId, option) =>
//     setAnswers(p => ({ ...p, [qId]: option }));

//   const toggleMark = (qId) =>
//     setMarked(prev => { const n = new Set(prev); n.has(qId) ? n.delete(qId) : n.add(qId); return n; });

//   const proceedToCoding = () => {
//     const unanswered = mcqQuestions.filter(q => !answers[q.id]);
//     if (unanswered.length > 0) {
//       if (!window.confirm(`You have ${unanswered.length} unanswered MCQ(s). Proceed?`)) return;
//     }
//     if (codingQuestions.length === 0) { setConfirmSubmit(true); return; }
//     setPhase('coding'); setCurrentIdx(0);
//     setTcResult(null); setRawOutput(null);
//   };

//   const getQStatus = (q, idx) => {
//     if (currentIdx === idx && phase === 'mcq') return 'current';
//     if (marked.has(q.id))  return 'marked';
//     if (answers[q.id])     return 'answered';
//     return 'unanswered';
//   };

//   const handleLangChange = (lang) => {
//     setLanguage(lang);
//     setTcResult(null); setRawOutput(null);
//   };

//   // Run — uses wrapper when methodName exists (fixes NameError: List)
//   const handleRun = async () => {
//     if (!currentCode.trim() || isRunning) return;
//     setIsRunning(true); setBottomTab('result');
//     setTcResult(null); setRawOutput('⏳ Running…');
//     try {
//       if (currentQ?.methodName && stdin) {
//         const fakeQ = { ...currentQ, testCases: [{ input: stdin, expectedOutput: '' }] };
//         const res   = await runWithTestCases(language, currentCode, fakeQ, { visibleCount: 1 });
//         const r     = res.results[0];
//         setRawOutput(r?.error ? `Error:\n${r.error}` : (r?.actualOutput || '(empty output)'));
//       } else {
//         const r = await executeCode(language, currentCode, stdin, currentQ?.timeLimitMs || 2000);
//         const out = r.compile_output
//           ? `Compilation Error:\n${r.compile_output}`
//           : r.stderr ? `Runtime Error:\n${r.stderr}`
//           : r.stdout || '(empty output)';
//         setRawOutput(out);
//       }
//     } catch (e) { setRawOutput(`Error: ${e.message}`); }
//     setIsRunning(false);
//   };

//   // Submit — LeetCode-style with wrapper (same as PracticePage)
//   const handleCodingSubmit = async () => {
//     setShowSubmitModal(false);
//     if (!currentQ) return;

//     setAnswers(p => ({ ...p, [currentQ.id]: { code: currentCode, language, passedCount: 0 } }));
//     setIsSubmitting(true); setBottomTab('result');
//     setTcResult(null); setRawOutput(null);

//     const testCases = currentQ.testCases?.filter(tc => tc.input?.trim() && tc.expectedOutput?.trim()) || [];

//     try {
//       let passedCount = 0;

//       if (currentQ.methodName && testCases.length) {
//         // Full LeetCode-style evaluation with wrapper — no NameError, normalised comparison
//         const res = await runWithTestCases(language, currentCode, currentQ);
//         setTcResult(res);
//         passedCount = res.passedCount;

//         const newAnswers = {
//           ...answers,
//           [currentQ.id]: { code: currentCode, language, passedCount },
//         };
//         setAnswers(newAnswers);

//         if (submissionId) {
//           await updateSubmission(submissionId, {
//             answers: Object.entries(newAnswers).map(([id, ans]) => ({ questionId: id, answer: ans })),
//           });
//         }

//         if (currentIdx === codingQuestions.length - 1) {
//           await handleFinalSubmit(false);
//         }
//       } else if (!currentQ.methodName) {
//         setRawOutput('⚠️ No methodName configured for this question.\nThe code ran but cannot be auto-evaluated.\n\nAsk faculty to set methodName in the question editor.');
//         if (currentIdx === codingQuestions.length - 1) {
//           await handleFinalSubmit(false);
//         }
//       } else {
//         setRawOutput('⚠️ No test cases defined for this question.');
//         if (currentIdx === codingQuestions.length - 1) {
//           await handleFinalSubmit(false);
//         }
//       }
//     } catch (e) {
//       setRawOutput(`Submission Error: ${e.message}`);
//     }
//     setIsSubmitting(false);
//   };

//   const handleSaveAndNext = async () => {
//     if (!currentQ) return;
//     const newAnswers = { ...answers, [currentQ.id]: { code: currentCode, language, passedCount: tcResult?.passedCount || 0 } };
//     setAnswers(newAnswers);
//     if (submissionId) {
//       await updateSubmission(submissionId, {
//         answers: Object.entries(newAnswers).map(([id, ans]) => ({ questionId: id, answer: ans })),
//       });
//     }
//     setTcResult(null); setRawOutput(null); setBottomTab('result');
//     setCurrentIdx(i => i + 1);
//   };

//   if (loading) return (
//     <div style={{ minHeight:'100vh', background:'#0d1117', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
//       <div style={{ width:40, height:40, border:'3px solid #30363d', borderTopColor:'#58a6ff', borderRadius:'50%', animation:'spin .8s linear infinite' }} />
//       <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
//       <p style={{ color:'#8b949e', marginTop:16, fontSize:14 }}>Loading exam…</p>
//     </div>
//   );

//   if (error) return (
//     <div style={{ minHeight:'100vh', background:'#0d1117', display:'flex', alignItems:'center', justifyContent:'center' }}>
//       <div style={{ background:'#161b22', border:'1px solid rgba(248,81,73,0.3)', borderRadius:12, padding:32, textAlign:'center' }}>
//         <p style={{ color:'#f85149', marginBottom:16 }}>{error}</p>
//         <button onClick={() => history.push('/dashboard')}
//           style={{ padding:'10px 24px', background:'#21262d', border:'none', color:'#fff', borderRadius:8, cursor:'pointer' }}>
//           Return to Dashboard
//         </button>
//       </div>
//     </div>
//   );

//   if (phase === 'submitted') return (
//     <div style={{ minHeight:'100vh', background:'#0d1117', display:'flex', alignItems:'center', justifyContent:'center' }}>
//       <div style={{ background:'#161b22', border:'1px solid #30363d', borderRadius:20, padding:48, textAlign:'center', maxWidth:500 }}>
//         <div style={{ fontSize:48, marginBottom:16 }}>✅</div>
//         <h2 style={{ color:'#3fb950', fontSize:24, marginBottom:12 }}>Exam Submitted!</h2>
//         <p style={{ color:'#8b949e', fontSize:14, lineHeight:1.6, marginBottom:28 }}>
//           Your answers have been recorded and scored. Your faculty will review the results.
//         </p>
//         <button onClick={() => history.push('/dashboard')}
//           style={{ width:'100%', padding:'14px', background:'#58a6ff', border:'none', borderRadius:10, color:'#fff', cursor:'pointer', fontWeight:700, fontSize:15 }}>
//           Exit to Dashboard
//         </button>
//       </div>
//     </div>
//   );

//   if (confirmSubmit) return (
//     <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.85)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:2000 }}>
//       <div style={{ background:'#161b22', border:'1px solid #30363d', borderRadius:16, padding:36, textAlign:'center', maxWidth:440 }}>
//         <h3 style={{ color:'#e6edf3', marginBottom:12 }}>Submit Exam?</h3>
//         <p style={{ color:'#8b949e', marginBottom:24, lineHeight:1.6 }}>
//           You have answered {Object.keys(answers).filter(id => mcqQuestions.some(q => q.id === id)).length} of {mcqQuestions.length} MCQs.
//         </p>
//         <div style={{ display:'flex', gap:12, justifyContent:'center' }}>
//           <button onClick={() => setConfirmSubmit(false)}
//             style={{ padding:'10px 20px', background:'#21262d', border:'1px solid #30363d', borderRadius:8, color:'#8b949e', cursor:'pointer', fontWeight:700 }}>
//             Go Back
//           </button>
//           <button onClick={() => handleFinalSubmit(false)}
//             style={{ padding:'10px 20px', background:'#3fb950', border:'none', borderRadius:8, color:'#fff', cursor:'pointer', fontWeight:700 }}>
//             Submit Exam
//           </button>
//         </div>
//       </div>
//     </div>
//   );

//   // ═══════════════════════════════════════════════════════════════
//   // CODING PHASE
//   // ═══════════════════════════════════════════════════════════════
//   if (phase === 'coding') {
//     const q           = codingQuestions[currentIdx];
//     const isLast      = currentIdx === codingQuestions.length - 1;
//     const langObj     = LANGUAGES.find(l => l.value === language) ?? LANGUAGES[0];
//     const noMethodName= q && !q.methodName;

//     return (
//       <div style={{ display:'flex', flexDirection:'column', height:'100vh', background:'#0d1117', color:'#e6edf3', fontFamily:'system-ui,sans-serif', overflow:'hidden' }}>
//         <style>{`
//           @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&display=swap');
//           *{box-sizing:border-box;margin:0;padding:0;}
//           ::-webkit-scrollbar{width:6px;height:6px;}
//           ::-webkit-scrollbar-track{background:#0d1117;}
//           ::-webkit-scrollbar-thumb{background:#30363d;border-radius:3px;}
//           @keyframes spin{to{transform:rotate(360deg)}}
//         `}</style>

//         <header style={{ height:52, background:'#161b22', borderBottom:'1px solid #21262d', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 16px', flexShrink:0, gap:12 }}>
//           <div style={{ display:'flex', alignItems:'center', gap:10, minWidth:0 }}>
//             {mcqQuestions.length > 0 && (
//               <button onClick={() => { setPhase('mcq'); setCurrentIdx(mcqQuestions.length - 1); }}
//                 style={{ background:'none', border:'1px solid #30363d', color:'#8b949e', cursor:'pointer', fontSize:12, fontWeight:700, padding:'4px 10px', borderRadius:6, flexShrink:0 }}>
//                 ← MCQ
//               </button>
//             )}
//             <span style={{ fontSize:13, fontWeight:700, color:'#e6edf3', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
//               {q?.title || 'Loading…'}
//             </span>
//             {q?.difficulty && (
//               <span style={{ fontSize:11, fontWeight:700, padding:'2px 8px', borderRadius:10,
//                 background: q.difficulty==='Easy'?'rgba(0,185,107,.1)':q.difficulty==='Hard'?'rgba(239,68,68,.1)':'rgba(255,184,0,.1)',
//                 color: q.difficulty==='Easy'?'#00b96b':q.difficulty==='Hard'?'#ef4444':'#ffb800',
//                 flexShrink:0 }}>
//                 {q.difficulty}
//               </span>
//             )}
//             {noMethodName && (
//               <span style={{ fontSize:10, background:'rgba(239,68,68,.1)', color:'#f87171', border:'1px solid rgba(239,68,68,.25)', padding:'2px 8px', borderRadius:6, flexShrink:0 }}>
//                 ⚠ No methodName — submit runs raw
//               </span>
//             )}
//             <span style={{ fontSize:11, color:'#8b949e', flexShrink:0 }}>
//               Q {currentIdx + 1} / {codingQuestions.length}
//             </span>
//           </div>

//           <div style={{ display:'flex', alignItems:'center', gap:8, flexShrink:0 }}>
//             <div style={{ fontFamily:'monospace', fontSize:15, fontWeight:800,
//               color: timer.urgent ? '#f85149' : '#58a6ff',
//               padding:'4px 12px', borderRadius:8,
//               background: timer.urgent ? 'rgba(248,81,73,.1)' : 'rgba(88,166,255,.08)',
//               border: `1px solid ${timer.urgent ? 'rgba(248,81,73,.3)' : 'rgba(88,166,255,.2)'}` }}>
//               {String(timer.h).padStart(2,'0')}:{String(timer.m).padStart(2,'0')}:{String(timer.s).padStart(2,'0')}
//             </div>
//             {violations > 0 && (
//               <span style={{ fontSize:11, fontWeight:700, padding:'3px 8px', borderRadius:6, background:'rgba(248,81,73,.15)', color:'#f85149', border:'1px solid rgba(248,81,73,.3)' }}>
//                 ⚠ {violations}/3
//               </span>
//             )}

//             <select value={language} onChange={e => handleLangChange(e.target.value)}
//               style={{ appearance:'none', background:'#21262d', border:'1px solid #30363d', borderRadius:6, padding:'5px 28px 5px 10px', color:'#e6edf3', fontSize:12, fontWeight:700, cursor:'pointer', outline:'none' }}>
//               {LANGUAGES.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
//             </select>

//             <button onClick={() => setCodes(p => ({ ...p, [codeKey]: q?.boilerplates?.[language] ?? FALLBACK_BOILERPLATE[language] }))}
//               style={{ background:'none', border:'1px solid #30363d', borderRadius:5, padding:'4px 10px', color:'#8b949e', fontSize:12, cursor:'pointer' }}>
//               ↺ Reset
//             </button>

//             <button onClick={handleRun} disabled={isRunning || isSubmitting}
//               style={{ padding:'6px 16px', borderRadius:6, background:'rgba(35,134,54,.15)', color:'#3fb950', border:'1px solid rgba(35,134,54,.3)', fontSize:13, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', gap:6, opacity:isRunning?0.6:1 }}>
//               {isRunning ? <span style={{ width:12, height:12, border:'2px solid #3fb950', borderTopColor:'transparent', borderRadius:'50%', animation:'spin .7s linear infinite', display:'inline-block' }} /> : '▶'}
//               {isRunning ? 'Running…' : 'Run'}
//             </button>

//             {isLast ? (
//               <button onClick={() => setShowSubmitModal(true)} disabled={isSubmitting}
//                 style={{ padding:'6px 20px', borderRadius:6, background:'#f0883e', color:'#fff', border:'none', fontSize:13, fontWeight:800, cursor:'pointer', opacity:isSubmitting?0.7:1 }}>
//                 {isSubmitting ? 'Evaluating…' : 'Submit Exam'}
//               </button>
//             ) : (
//               <>
//                 <button onClick={() => setShowSubmitModal(true)} disabled={isSubmitting}
//                   style={{ padding:'6px 16px', borderRadius:6, background:'rgba(88,166,255,.15)', color:'#58a6ff', border:'1px solid rgba(88,166,255,.3)', fontSize:12, fontWeight:700, cursor:'pointer', opacity:isSubmitting?0.7:1 }}>
//                   {isSubmitting ? 'Evaluating…' : 'Submit & Check'}
//                 </button>
//                 <button onClick={handleSaveAndNext} disabled={isSubmitting}
//                   style={{ padding:'6px 14px', borderRadius:6, background:'#21262d', color:'#8b949e', border:'1px solid #30363d', fontSize:12, fontWeight:700, cursor:'pointer' }}>
//                   Save & Next →
//                 </button>
//               </>
//             )}
//           </div>
//         </header>

//         <div style={{ flex:1, display:'flex', overflow:'hidden' }}>
//           {/* Left: description */}
//           <div style={{ width:'40%', display:'flex', flexDirection:'column', borderRight:'1px solid #21262d', overflow:'hidden' }}>
//             <div style={{ display:'flex', background:'#161b22', borderBottom:'1px solid #21262d', padding:'0 4px', flexShrink:0 }}>
//               <span style={{ padding:'10px 16px', fontSize:13, fontWeight:700, color:'#e6edf3', borderBottom:'2px solid #f0883e' }}>Description</span>
//             </div>
//             <div style={{ flex:1, overflowY:'auto', padding:'20px 24px' }}>
//               <h2 style={{ fontSize:20, fontWeight:800, color:'#e6edf3', marginBottom:14, lineHeight:1.3 }}>{q?.title}</h2>
//               <div style={{ display:'flex', gap:8, marginBottom:18, flexWrap:'wrap' }}>
//                 {q?.marks && <span style={{ fontSize:12, fontWeight:700, padding:'3px 10px', borderRadius:12, background:'rgba(88,166,255,.1)', color:'#58a6ff', border:'1px solid rgba(88,166,255,.2)' }}>{q.marks} pts</span>}
//                 {q?.testCases?.length > 0 && <span style={{ fontSize:12, fontWeight:700, padding:'3px 10px', borderRadius:12, background:'rgba(63,185,80,.1)', color:'#3fb950', border:'1px solid rgba(63,185,80,.2)' }}>{q.testCases.length} test cases</span>}
//               </div>
//               <div style={{ fontSize:15, lineHeight:1.85, color:'#c9d1d9' }}
//                 dangerouslySetInnerHTML={{ __html: q?.description || q?.question || '<p>No description.</p>' }} />

//               {q?.testCases?.filter(tc => !tc.isHidden).slice(0,3).map((tc, i) => (
//                 <div key={i} style={{ marginTop:20, background:'#161b22', border:'1px solid #21262d', borderRadius:10, overflow:'hidden' }}>
//                   <div style={{ padding:'8px 14px', borderBottom:'1px solid #21262d', fontSize:12, fontWeight:700, color:'#8b949e' }}>Example {i+1}</div>
//                   <div style={{ padding:14 }}>
//                     <p style={{ fontSize:12, color:'#8b949e', marginBottom:4 }}>Input:</p>
//                     <pre style={{ background:'#0d1117', padding:'8px 12px', borderRadius:6, fontSize:12, color:'#a5d6ff', fontFamily:'monospace', marginBottom:10, overflow:'auto' }}>{tc.input}</pre>
//                     <p style={{ fontSize:12, color:'#8b949e', marginBottom:4 }}>Output:</p>
//                     <pre style={{ background:'#0d1117', padding:'8px 12px', borderRadius:6, fontSize:12, color:'#7ee787', fontFamily:'monospace', overflow:'auto' }}>{tc.expectedOutput}</pre>
//                   </div>
//                 </div>
//               ))}
//               {q?.testCases?.filter(tc => tc.isHidden).length > 0 && (
//                 <p style={{ fontSize:12, color:'#8b949e', marginTop:12, fontStyle:'italic' }}>
//                   + {q.testCases.filter(tc => tc.isHidden).length} hidden test cases. Submit to run all.
//                 </p>
//               )}
//             </div>
//           </div>

//           {/* Right: Monaco + result */}
//           <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
//             <div style={{ height:38, background:'#161b22', borderBottom:'1px solid #21262d', display:'flex', alignItems:'center', padding:'0 14px', gap:10, flexShrink:0 }}>
//               <span style={{ fontSize:12, color:'#8b949e' }}>{langObj.label} · Monaco</span>
//               {q?.methodName && (
//                 <span style={{ fontSize:10, background:'rgba(63,185,80,.1)', color:'#3fb950', border:'1px solid rgba(63,185,80,.2)', padding:'2px 8px', borderRadius:5 }}>
//                   ✓ Auto-wrapped · imports injected
//                 </span>
//               )}
//             </div>

//             <div style={{ flex:'0 0 60%', overflow:'hidden' }}>
//               <Editor
//                 theme="vs-dark"
//                 language={langObj.monaco}
//                 value={currentCode}
//                 onChange={v => setCodes(p => ({ ...p, [codeKey]: v ?? '' }))}
//                 options={{
//                   minimap:              { enabled: false },
//                   fontSize:             14,
//                   lineHeight:           22,
//                   scrollBeyondLastLine: false,
//                   tabSize:              4,
//                   wordWrap:             'on',
//                   automaticLayout:      true,
//                 }}
//               />
//             </div>

//             <div style={{ flex:1, display:'flex', flexDirection:'column', borderTop:'1px solid #21262d', minHeight:0 }}>
//               <div style={{ display:'flex', alignItems:'center', background:'#161b22', borderBottom:'1px solid #21262d', height:38, padding:'0 8px', flexShrink:0 }}>
//                 <button onClick={() => setBottomTab('stdin')}
//                   style={{ padding:'0 14px', height:'100%', background:'none', border:'none', borderBottom:`2px solid ${bottomTab==='stdin'?'#f0883e':'transparent'}`, color:bottomTab==='stdin'?'#e6edf3':'#8b949e', fontSize:12, fontWeight:bottomTab==='stdin'?700:400, cursor:'pointer' }}>
//                   📥 Custom Input
//                 </button>
//                 <button onClick={() => setBottomTab('result')}
//                   style={{ padding:'0 14px', height:'100%', background:'none', border:'none', borderBottom:`2px solid ${bottomTab==='result'?'#f0883e':'transparent'}`, color:bottomTab==='result'?'#e6edf3':'#8b949e', fontSize:12, fontWeight:bottomTab==='result'?700:400, cursor:'pointer', display:'flex', alignItems:'center', gap:6 }}>
//                   📤 Test Results
//                   {tcResult && <span style={{ width:7, height:7, borderRadius:'50%', background: tcResult.allPassed?'#3fb950':'#f85149', display:'inline-block' }} />}
//                 </button>
//               </div>

//               <div style={{ flex:1, overflow:'hidden' }}>
//                 {bottomTab === 'stdin' ? (
//                   <div style={{ height:'100%', padding:12 }}>
//                     <textarea value={stdin} onChange={e => setStdin(e.target.value)}
//                       placeholder={q?.methodName
//                         ? `Custom input args for Run (e.g. [2,7,11,15], 9)\nSubmit always runs all ${q?.testCases?.length || 0} test cases.`
//                         : 'Custom stdin for Run button…'}
//                       style={{ width:'100%', height:'100%', background:'#0d1117', color:'#e6edf3', border:'none', resize:'none', fontFamily:"'Courier New',monospace", fontSize:13, outline:'none', lineHeight:1.65 }} />
//                   </div>
//                 ) : (
//                   <TestResultPanel
//                     tcResult={tcResult}
//                     rawOutput={rawOutput}
//                     isEvaluating={isRunning || isSubmitting}
//                   />
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>

//         {showSubmitModal && (
//           <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.8)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000 }}>
//             <div style={{ background:'#161b22', border:'1px solid #30363d', borderRadius:16, padding:36, maxWidth:440, width:'90%', textAlign:'center' }}>
//               <div style={{ fontSize:42, marginBottom:16 }}>📋</div>
//               <h3 style={{ fontSize:20, fontWeight:800, color:'#e6edf3', marginBottom:10 }}>
//                 {isLast ? 'Submit Exam?' : 'Submit & Check Solution?'}
//               </h3>
//               <p style={{ fontSize:14, color:'#8b949e', lineHeight:1.6, marginBottom:24 }}>
//                 Your code will be evaluated against all test cases including hidden ones.
//                 {isLast && ' This will end your exam.'}
//               </p>
//               <div style={{ display:'flex', gap:12, justifyContent:'center' }}>
//                 <button onClick={() => setShowSubmitModal(false)}
//                   style={{ padding:'10px 24px', borderRadius:8, background:'#21262d', border:'1px solid #30363d', color:'#8b949e', fontSize:14, fontWeight:700, cursor:'pointer' }}>
//                   Cancel
//                 </button>
//                 <button onClick={handleCodingSubmit}
//                   style={{ padding:'10px 24px', borderRadius:8, background:'#f0883e', border:'none', color:'#fff', fontSize:14, fontWeight:800, cursor:'pointer' }}>
//                   {isLast ? 'Submit Exam' : 'Submit & Evaluate'}
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {showViolation && (
//           <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.9)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:2000 }}>
//             <div style={{ background:'#161b22', border:'2px solid rgba(248,81,73,.5)', borderRadius:16, padding:40, maxWidth:460, width:'90%', textAlign:'center' }}>
//               <div style={{ fontSize:50, marginBottom:16 }}>🚨</div>
//               <h3 style={{ fontSize:22, fontWeight:800, color:'#f85149', marginBottom:12 }}>Proctoring Violation!</h3>
//               <p style={{ fontSize:14, color:'#c9d1d9', lineHeight:1.7, marginBottom:24 }}>
//                 Violations: <strong style={{ color:'#f85149' }}>{violations}/3</strong> — At 3 your exam auto-submits.
//               </p>
//               <div style={{ display:'flex', gap:12, justifyContent:'center' }}>
//                 <button onClick={() => handleFinalSubmit(true)}
//                   style={{ padding:'10px 20px', borderRadius:8, background:'#f85149', border:'none', color:'#fff', fontSize:14, fontWeight:700, cursor:'pointer' }}>
//                   Submit Now
//                 </button>
//                 <button onClick={async () => { setShowViolation(false); try { await document.documentElement.requestFullscreen?.(); } catch {} }}
//                   style={{ padding:'10px 20px', borderRadius:8, background:'#21262d', border:'1px solid #388bfd', color:'#58a6ff', fontSize:14, fontWeight:700, cursor:'pointer' }}>
//                   Return to Exam
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   }

//   // ═══════════════════════════════════════════════════════════════
//   // MCQ PHASE
//   // ═══════════════════════════════════════════════════════════════
//   return (
//     <div style={{ minHeight:'100vh', background:'#0d1117', color:'#e6edf3', display:'flex', flexDirection:'column', fontFamily:'system-ui' }}>
//       <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>

//       <header style={{ background:'#161b22', borderBottom:'1px solid #21262d', padding:'0 24px', height:56, display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 }}>
//         <div style={{ display:'flex', alignItems:'center', gap:12 }}>
//           <span style={{ fontWeight:800, fontSize:15 }}>{exam?.title}</span>
//           {violations > 0 && (
//             <span style={{ background:'rgba(248,81,73,0.15)', border:'1px solid rgba(248,81,73,0.3)', color:'#f85149', fontSize:11, fontWeight:700, padding:'2px 8px', borderRadius:6 }}>
//               ⚠️ {violations}/3 Violations
//             </span>
//           )}
//         </div>
//         <span style={{ fontFamily:'monospace', fontSize:20, fontWeight:800, color:timer.urgent?'#f85149':'#58a6ff' }}>
//           {String(timer.h).padStart(2,'0')}:{String(timer.m).padStart(2,'0')}:{String(timer.s).padStart(2,'0')}
//         </span>
//         <button onClick={proceedToCoding}
//           style={{ padding:'8px 20px', background:'#f0883e', border:'none', borderRadius:8, color:'#fff', fontWeight:700, cursor:'pointer', fontSize:14 }}>
//           {codingQuestions.length > 0 ? 'Next Phase →' : 'Submit Exam ✓'}
//         </button>
//       </header>

//       <div style={{ flex:1, display:'flex', overflow:'hidden' }}>
//         <div style={{ flex:1, overflowY:'auto', padding:'32px 40px' }}>
//           {!currentQ ? (
//             <p style={{ color:'#8b949e' }}>No MCQ questions in this exam.</p>
//           ) : (
//             <>
//               <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:28 }}>
//                 <span style={{ fontSize:13, color:'#8b949e' }}>Question {currentIdx+1} of {mcqQuestions.length}</span>
//                 <button onClick={() => toggleMark(currentQ.id)}
//                   style={{ padding:'4px 12px', background:'#21262d', border:'1px solid #30363d', borderRadius:6, color:marked.has(currentQ.id)?'#58a6ff':'#8b949e', cursor:'pointer', fontSize:12 }}>
//                   🔖 {marked.has(currentQ.id)?'Marked':'Mark for Review'}
//                 </button>
//               </div>

//               <div style={{ fontSize:18, lineHeight:1.75, marginBottom:32 }}
//                 dangerouslySetInnerHTML={{ __html: currentQ.description || currentQ.question }} />

//               <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
//                 {(currentQ.options||[]).map((opt, i) => (
//                   <button key={i} onClick={() => handleMCQAnswer(currentQ.id, opt)}
//                     style={{
//                       display:'flex', alignItems:'center', gap:16, padding:'16px 20px',
//                       background: answers[currentQ.id]===opt ? 'rgba(88,166,255,0.1)' : '#161b22',
//                       border: `2px solid ${answers[currentQ.id]===opt ? '#58a6ff' : '#21262d'}`,
//                       borderRadius:12, cursor:'pointer', textAlign:'left', width:'100%',
//                       color:'#e6edf3', fontSize:15, transition:'all 0.15s',
//                     }}>
//                     <span style={{ width:28, height:28, borderRadius:'50%',
//                       background: answers[currentQ.id]===opt ? '#58a6ff' : '#21262d',
//                       display:'flex', alignItems:'center', justifyContent:'center',
//                       fontWeight:700, fontSize:13, flexShrink:0 }}>
//                       {['A','B','C','D','E'][i]}
//                     </span>
//                     {opt}
//                   </button>
//                 ))}
//               </div>

//               <div style={{ display:'flex', justifyContent:'space-between', marginTop:40 }}>
//                 <button onClick={() => setCurrentIdx(i => Math.max(0,i-1))} disabled={currentIdx===0}
//                   style={{ padding:'10px 24px', background:'#21262d', border:'none', borderRadius:8, color:'#fff', cursor:'pointer', opacity:currentIdx===0?0.4:1 }}>
//                   ← Prev
//                 </button>
//                 {currentIdx < mcqQuestions.length-1 ? (
//                   <button onClick={() => setCurrentIdx(i => i+1)}
//                     style={{ padding:'10px 24px', background:'#21262d', border:'none', borderRadius:8, color:'#fff', cursor:'pointer' }}>
//                     Next →
//                   </button>
//                 ) : (
//                   <button onClick={proceedToCoding}
//                     style={{ padding:'10px 24px', background:'#3fb950', border:'none', borderRadius:8, color:'#fff', fontWeight:700, cursor:'pointer' }}>
//                     {codingQuestions.length>0 ? 'Coding Phase ✓' : 'Submit Exam ✓'}
//                   </button>
//                 )}
//               </div>
//             </>
//           )}
//         </div>

//         <div style={{ width:240, background:'#161b22', borderLeft:'1px solid #21262d', padding:16, overflowY:'auto' }}>
//           <p style={{ fontSize:11, fontWeight:700, color:'#8b949e', marginBottom:12, textTransform:'uppercase', letterSpacing:'0.08em' }}>MCQ Palette</p>
//           <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:6, marginBottom:20 }}>
//             {mcqQuestions.map((q, i) => {
//               const s = Q_STATUS[getQStatus(q, i)];
//               return (
//                 <button key={q.id} onClick={() => setCurrentIdx(i)}
//                   style={{ aspectRatio:'1', borderRadius:6, background:s.bg, border:`1px solid ${s.border}`, color:s.color, fontWeight:700, cursor:'pointer', fontSize:12 }}>
//                   {i+1}
//                 </button>
//               );
//             })}
//           </div>
//           {[
//             {key:'answered',   label:'Answered'},
//             {key:'marked',     label:'Marked'},
//             {key:'unanswered', label:'Not Answered'},
//           ].map(({key,label}) => (
//             <div key={key} style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
//               <div style={{ width:12, height:12, borderRadius:3, background:Q_STATUS[key].bg, border:`1px solid ${Q_STATUS[key].border}` }} />
//               <span style={{ fontSize:11, color:'#8b949e' }}>{label}</span>
//             </div>
//           ))}
//           <div style={{ marginTop:20, padding:'12px', background:'rgba(88,166,255,0.06)', border:'1px solid rgba(88,166,255,0.15)', borderRadius:8 }}>
//             <p style={{ fontSize:11, color:'#8b949e', lineHeight:1.5 }}>
//               Answered: <strong style={{ color:'#3fb950' }}>
//                 {Object.keys(answers).filter(id => mcqQuestions.some(q => q.id === id)).length}
//               </strong> / {mcqQuestions.length}
//             </p>
//           </div>
//         </div>
//       </div>

//       {showViolation && (
//         <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.85)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:2000 }}>
//           <div style={{ background:'#161b22', border:'2px solid rgba(248,81,73,0.4)', borderRadius:16, padding:36, textAlign:'center', maxWidth:440 }}>
//             <div style={{ fontSize:48, marginBottom:12 }}>🚨</div>
//             <h3 style={{ color:'#f85149', marginBottom:12 }}>Proctoring Violation</h3>
//             <p style={{ color:'#c9d1d9', lineHeight:1.6, marginBottom:8 }}>
//               Fullscreen exit detected. <strong>{violations}/3</strong> violations.
//               At 3 your exam is automatically submitted.
//             </p>
//             <button onClick={async () => { setShowViolation(false); try { await document.documentElement.requestFullscreen?.(); } catch {} }}
//               style={{ padding:'10px 24px', background:'#58a6ff', border:'none', borderRadius:8, color:'#fff', cursor:'pointer', fontWeight:700, marginTop:16 }}>
//               Return to Exam
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }












// src/pages/ExamPage.jsx
//
// KEY DIFFERENCES FROM PRACTICE PAGE (by design):
//   - Submit = evaluate code only (LeetCode dots). Does NOT end the exam.
//   - Finish Exam = separate button that saves all answers and ends the exam.
//   - No return to MCQ once coding phase starts (← MCQ button removed).
//   - Proctoring (fullscreen + tab visibility) covers both phases.
//
// ROOT CAUSE OF EMPTY OUTPUT / NameError IN RUN:
//   OLD: handleRun uses wrapper only when (methodName && stdin).
//        If stdin is empty → falls back to raw executeCode → no imports → NameError.
//        If code never calls print() → empty output.
//   FIX: When methodName exists and stdin is empty, automatically use the
//        first visible test case input so the wrapper always fires.
//        Student never needs to type stdin manually for Run to work.

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useParams, useHistory }    from 'react-router-dom';
import { doc, getDoc }              from 'firebase/firestore';
import Editor                       from '@monaco-editor/react';
import { db }                       from '../firebase/config';
import { useAuth }                  from '../context/AuthContext';
import {
  startSubmission, updateSubmission, calculateAndSaveScore,
} from '../api/examService';
import {
  executeCode, runWithTestCases,
} from '../api/compilerService';

const LANGUAGES = [
  { label: 'C++',        value: 'cpp',        monaco: 'cpp'        },
  { label: 'Python',     value: 'python',     monaco: 'python'     },
  { label: 'JavaScript', value: 'javascript', monaco: 'javascript' },
  { label: 'Java',       value: 'java',       monaco: 'java'       },
  { label: 'C',          value: 'c',          monaco: 'c'          },
];

const FALLBACK_BOILERPLATE = {
  cpp:        '#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Write your solution here\n};\n',
  python:     'class Solution:\n    def solution(self):\n        # Write your solution here\n        pass\n',
  javascript: 'class Solution {\n    solution() {\n        // Write your solution here\n    }\n}\n',
  java:       'class Solution {\n    public Object solution() {\n        // Write your solution here\n        return null;\n    }\n}\n',
  c:          '#include <stdio.h>\n\n// Write your solution here\n',
};

const Q_STATUS = {
  unanswered: { bg: '#21262d', border: '#30363d',             color: '#8b949e' },
  answered:   { bg: 'rgba(63,185,80,0.15)',  border: 'rgba(63,185,80,0.4)',  color: '#3fb950' },
  marked:     { bg: 'rgba(88,166,255,0.15)', border: 'rgba(88,166,255,0.4)', color: '#58a6ff' },
  current:    { bg: '#f0883e', border: '#f0883e', color: '#fff' },
};

function useTimer(totalSecs, onEnd) {
  const [rem, setRem]  = useState(totalSecs);
  const startRef       = useRef(Date.now());
  const firedRef       = useRef(false);
  useEffect(() => { startRef.current = Date.now(); setRem(totalSecs); firedRef.current = false; }, [totalSecs]);
  useEffect(() => {
    const t = setInterval(() => {
      const left = Math.max(0, totalSecs - Math.floor((Date.now() - startRef.current) / 1000));
      setRem(left);
      if (left === 0 && !firedRef.current) { firedRef.current = true; onEnd?.(); }
    }, 1000);
    return () => clearInterval(t);
  }, [totalSecs, onEnd]);
  return {
    h: Math.floor(rem / 3600),
    m: Math.floor((rem % 3600) / 60),
    s: rem % 60,
    remaining: rem,
    urgent:    rem < 300,
  };
}

// LeetCode-style test result panel — exact copy from PracticePage
function TestResultPanel({ tcResult, rawOutput, isEvaluating }) {
  const [sel, setSel] = useState(0);

  useEffect(() => {
    if (tcResult?.results?.length) {
      const first = tcResult.results.findIndex(r => !r.passed && r.isVisible);
      setSel(first >= 0 ? first : 0);
    }
  }, [tcResult]);

  if (isEvaluating) return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100%', gap:12, color:'#58a6ff' }}>
      <div style={{ width:32, height:32, border:'3px solid #58a6ff', borderTopColor:'transparent', borderRadius:'50%', animation:'spin .7s linear infinite' }} />
      <span style={{ fontSize:13, fontWeight:600 }}>Evaluating your solution…</span>
    </div>
  );

  if (rawOutput !== null && !tcResult) return (
    <div style={{ padding:14, height:'100%', overflowY:'auto' }}>
      <pre style={{ fontSize:13, color:'#e6edf3', whiteSpace:'pre-wrap', wordBreak:'break-word', lineHeight:1.65, margin:0 }}>
        {rawOutput || 'Run your code to see output.'}
      </pre>
    </div>
  );

  if (!tcResult) return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100%', gap:8, color:'#484f58' }}>
      <span style={{ fontSize:32 }}>💻</span>
      <span style={{ fontSize:13 }}>Run or Submit to see results</span>
    </div>
  );

  const { results: cases, passedCount, totalCount, allPassed, visiblePassed, visibleTotal } = tcResult;
  const shownCase = cases[sel];

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%', overflow:'hidden' }}>
      <div style={{ padding:'10px 14px', borderBottom:'1px solid #21262d', flexShrink:0,
        background: allPassed ? 'rgba(63,185,80,.07)' : 'rgba(248,81,73,.07)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <span style={{ fontSize:20 }}>{allPassed ? '✅' : '❌'}</span>
          <div>
            <div style={{ fontSize:14, fontWeight:800, color: allPassed ? '#3fb950' : '#f85149' }}>
              {allPassed ? 'All Test Cases Passed!' : `${passedCount} / ${totalCount} Passed`}
            </div>
            <div style={{ fontSize:11, color:'#8b949e', marginTop:2, fontFamily:'monospace' }}>
              Visible: {visiblePassed}/{visibleTotal}
              {totalCount > visibleTotal && ` · Hidden: ${passedCount - visiblePassed}/${totalCount - visibleTotal}`}
            </div>
          </div>
        </div>
        <div style={{ display:'flex', gap:5, marginTop:10, flexWrap:'wrap' }}>
          {cases.map((c, i) => (
            <button key={i} onClick={() => setSel(i)}
              title={`Case ${i+1}: ${c.passed ? 'Passed' : c.statusLabel}`}
              style={{
                width:30, height:30, borderRadius:7, border:'none', cursor:'pointer', fontWeight:700, fontSize:11,
                background: sel===i ? (c.passed?'#3fb950':'#f85149') : (c.passed?'rgba(63,185,80,.15)':'rgba(248,81,73,.15)'),
                color: sel===i ? '#fff' : (c.passed?'#3fb950':'#f85149'),
                outline: sel===i ? `2px solid ${c.passed?'#3fb950':'#f85149'}` : 'none',
                outlineOffset: 1,
              }}>
              {c.isVisible ? i+1 : 'H'}
            </button>
          ))}
        </div>
      </div>

      {shownCase && (
        <div style={{ flex:1, overflowY:'auto', padding:12 }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:10 }}>
            <span style={{ fontSize:12, fontWeight:700, color:'#8b949e' }}>
              Case {sel+1} {shownCase.isVisible ? '' : '(Hidden)'}
            </span>
            <span style={{ fontSize:11, fontWeight:800, padding:'2px 10px', borderRadius:20,
              background: shownCase.passed ? 'rgba(63,185,80,.12)' : 'rgba(248,81,73,.12)',
              color: shownCase.passed ? '#3fb950' : '#f85149',
              border:`1px solid ${shownCase.passed?'rgba(63,185,80,.3)':'rgba(248,81,73,.3)'}` }}>
              {shownCase.statusLabel}
            </span>
          </div>
          {shownCase.isVisible && shownCase.input !== null ? (
            <>
              {[
                ['Input',       shownCase.input,                                   '#a5d6ff'],
                ['Expected',    shownCase.expectedOutput,                           '#7ee787'],
                ['Your Output', shownCase.actualOutput || '(empty)',               shownCase.passed?'#7ee787':'#f85149'],
              ].map(([label, val, color]) => (
                <div key={label} style={{ marginBottom:10 }}>
                  <p style={{ fontSize:11, color:'#8b949e', marginBottom:3, textTransform:'uppercase', letterSpacing:'0.06em' }}>{label}</p>
                  <pre style={{ background:'#0d1117', padding:'8px 12px', borderRadius:8, fontSize:12, color, fontFamily:'monospace', overflow:'auto', border:'1px solid #21262d', margin:0 }}>{val}</pre>
                </div>
              ))}
              {shownCase.error && (
                <div style={{ marginBottom:10 }}>
                  <p style={{ fontSize:11, color:'#f85149', marginBottom:3, textTransform:'uppercase', letterSpacing:'0.06em' }}>Error</p>
                  <pre style={{ background:'#0d1117', padding:'8px 12px', borderRadius:8, fontSize:12, color:'#f85149', fontFamily:'monospace', overflow:'auto', border:'1px solid rgba(248,81,73,.2)', margin:0 }}>{shownCase.error}</pre>
                </div>
              )}
              {shownCase.time && <p style={{ fontSize:11, color:'#8b949e', fontFamily:'monospace' }}>Runtime: {shownCase.time}s · {shownCase.memory}KB</p>}
            </>
          ) : (
            <div style={{ padding:'14px 16px',
              background: shownCase.passed?'rgba(63,185,80,.06)':'rgba(248,81,73,.06)',
              border:`1px solid ${shownCase.passed?'rgba(63,185,80,.2)':'rgba(248,81,73,.2)'}`, borderRadius:10 }}>
              <p style={{ fontSize:13, fontWeight:700, color:shownCase.passed?'#3fb950':'#f85149' }}>
                {shownCase.passed ? '✓ Hidden test case passed.' : '✗ Hidden test case failed.'}
              </p>
              {shownCase.error && <p style={{ fontSize:12, color:'#8b949e', marginTop:6 }}>Error: {shownCase.error}</p>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN ExamPage
// ═══════════════════════════════════════════════════════════════
export default function ExamPage() {
  const { examId, submissionId: urlSubmissionId } = useParams();
  const { currentUser } = useAuth();
  const history         = useHistory();

  const [exam,         setExam]         = useState(null);
  const [questions,    setQuestions]    = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);
  const [submissionId, setSubmissionId] = useState(urlSubmissionId || null);

  // phase: 'mcq' | 'coding' | 'submitted'
  const [phase,      setPhase]      = useState('mcq');
  const [currentIdx, setCurrentIdx] = useState(0);

  // MCQ
  const [answers, setAnswers] = useState({});
  const [marked,  setMarked]  = useState(new Set());

  // Coding
  const [language,     setLanguage]     = useState('cpp');
  const [codes,        setCodes]        = useState({});
  const [isRunning,    setIsRunning]    = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFinishing,  setIsFinishing]  = useState(false);
  const [tcResult,     setTcResult]     = useState(null);  // LeetCode dots
  const [rawOutput,    setRawOutput]    = useState(null);  // plain run output
  const [bottomTab,    setBottomTab]    = useState('result');
  const [stdin,        setStdin]        = useState('');

  // Proctoring
  const [violations,       setViolations]       = useState(0);
  const [showViolation,    setShowViolation]     = useState(false);

  // Modals
  const [showFinishModal,  setShowFinishModal]   = useState(false); // Finish Exam confirm
  const [confirmMCQSubmit, setConfirmMCQSubmit]  = useState(false); // MCQ-only exams

  const handleFinalSubmitRef = useRef(null);

  const mcqQuestions    = useMemo(() => questions.filter(q => q.type === 'MCQ'),    [questions]);
  const codingQuestions = useMemo(() => questions.filter(q => (q.type||'').toUpperCase() === 'CODING'), [questions]);
  const currentQ        = phase === 'mcq' ? mcqQuestions[currentIdx] : codingQuestions[currentIdx];
  const totalDuration   = (exam?.durationMinutes ?? 60) * 60;

  const codeKey     = `${currentQ?.id}_${language}`;
  const currentCode = codes[codeKey] ?? currentQ?.boilerplates?.[language] ?? FALLBACK_BOILERPLATE[language] ?? '';

  // Count how many coding questions have been evaluated
  const evaluatedCount = codingQuestions.filter(q => answers[q.id]?.passedCount !== undefined).length;

  const timer = useTimer(
    totalDuration,
    useCallback(() => handleFinalSubmitRef.current?.(true), []),
  );

  // Load exam
  useEffect(() => {
    const fetch_ = async () => {
      try {
        const snap = await getDoc(doc(db, 'exams', examId));
        if (!snap.exists()) { setError('Exam not found.'); return; }
        const data = { id: snap.id, ...snap.data() };
        setExam(data);
        const qDocs = await Promise.all(
          (data.questionIds || []).map(qId => getDoc(doc(db, 'questions', qId))),
        );
        const qs = qDocs.filter(d => d.exists()).map(d => ({ id: d.id, ...d.data() }));
        setQuestions(qs);
        if (!urlSubmissionId && currentUser) {
          const sid = await startSubmission({
            examId,
            examTitle:    data.title,
            studentId:    currentUser.uid,
            studentEmail: currentUser.email,
            studentName:  currentUser.displayName || currentUser.email,
          });
          setSubmissionId(sid);
        }
        if (!qs.some(q => q.type === 'MCQ')) setPhase('coding');
      } catch (err) {
        console.error(err);
        setError('Failed to load exam. Please refresh.');
      } finally {
        setLoading(false);
      }
    };
    if (examId) fetch_();
  }, [examId, currentUser, urlSubmissionId]);

  // Proctoring — both phases
  useEffect(() => {
    const enterFS = async () => { try { await document.documentElement.requestFullscreen?.(); } catch {} };
    enterFS();
    const onFSChange = () => {
      if (!document.fullscreenElement) {
        setViolations(v => { const nv = v + 1; if (nv >= 3) handleFinalSubmitRef.current?.(true); return nv; });
        setShowViolation(true);
      }
    };
    const onVis  = () => { if (document.hidden) setViolations(v => v + 1); };
    const onKey  = e => { if (e.key==='F12'||(e.ctrlKey&&e.shiftKey)||(e.ctrlKey&&e.key==='u')) e.preventDefault(); };
    const block  = e => e.preventDefault();
    document.addEventListener('fullscreenchange', onFSChange);
    document.addEventListener('visibilitychange', onVis);
    document.addEventListener('keydown',          onKey);
    document.addEventListener('contextmenu',      block);
    document.addEventListener('copy',             block);
    return () => {
      document.removeEventListener('fullscreenchange', onFSChange);
      document.removeEventListener('visibilitychange', onVis);
      document.removeEventListener('keydown',          onKey);
      document.removeEventListener('contextmenu',      block);
      document.removeEventListener('copy',             block);
    };
  }, []);

  // Final submit — saves everything and marks exam complete
  const handleFinalSubmit = useCallback(async (forced = false) => {
    if (isFinishing) return;
    setShowFinishModal(false); setConfirmMCQSubmit(false);
    setIsFinishing(true);
    setPhase('submitted');
    try {
      if (submissionId) {
        await updateSubmission(submissionId, {
          answers:      Object.entries(answers).map(([qId, ans]) => ({ questionId: qId, answer: ans })),
          submittedAt:  new Date(),
          forcedSubmit: forced,
          violations,
        });
        await calculateAndSaveScore(submissionId, answers, questions);
      }
    } catch (err) { console.error('Submit error:', err); }
    setIsFinishing(false);
  }, [isFinishing, submissionId, answers, violations, questions]);

  handleFinalSubmitRef.current = handleFinalSubmit;

  // MCQ handlers
  const handleMCQAnswer = (qId, option) => setAnswers(p => ({ ...p, [qId]: option }));
  const toggleMark = (qId) =>
    setMarked(prev => { const n = new Set(prev); n.has(qId) ? n.delete(qId) : n.add(qId); return n; });

  const proceedToCoding = () => {
    const unanswered = mcqQuestions.filter(q => !answers[q.id]);
    if (unanswered.length > 0) {
      if (!window.confirm(`You have ${unanswered.length} unanswered MCQ(s). Proceed to coding?`)) return;
    }
    if (codingQuestions.length === 0) { setConfirmMCQSubmit(true); return; }
    setPhase('coding'); setCurrentIdx(0);
    setTcResult(null); setRawOutput(null);
  };

  const getQStatus = (q, idx) => {
    if (currentIdx === idx && phase === 'mcq') return 'current';
    if (marked.has(q.id))  return 'marked';
    if (answers[q.id])     return 'answered';
    return 'unanswered';
  };

  const handleLangChange = (lang) => {
    setLanguage(lang); setTcResult(null); setRawOutput(null);
  };

  // ── RUN ──────────────────────────────────────────────────────
  // FIX: When methodName exists, always use the wrapper.
  // If stdin is empty, automatically use the first visible test case input.
  // This fixes: "empty output" when student hasn't typed custom input,
  // and "NameError: List" when wrapper wasn't triggered due to empty stdin.
  const handleRun = async () => {
    if (!currentCode.trim() || isRunning) return;
    setIsRunning(true); setBottomTab('result');
    setTcResult(null); setRawOutput('⏳ Running…');
    try {
      if (currentQ?.methodName) {
        // Always use wrapper when methodName exists — stdin or first test case
        const inputArgs = stdin.trim() ||
          currentQ?.testCases?.find(tc => !tc.isHidden)?.input ||
          currentQ?.testCases?.[0]?.input ||
          '';
        const fakeQ = { ...currentQ, testCases: [{ input: inputArgs, expectedOutput: '' }] };
        const res   = await runWithTestCases(language, currentCode, fakeQ, { visibleCount: 1 });
        const r     = res.results?.[0];
        setRawOutput(r?.error ? `Error:\n${r.error}` : (r?.actualOutput || '(empty output)'));
      } else {
        // No methodName — raw execute (student must include imports + print)
        const r = await executeCode(language, currentCode, stdin, currentQ?.timeLimitMs || 2000);
        setRawOutput(
          r.compile_output ? `Compilation Error:\n${r.compile_output}` :
          r.stderr         ? `Runtime Error:\n${r.stderr}` :
          r.stdout         || '(empty output)'
        );
      }
    } catch (e) { setRawOutput(`Error: ${e.message}`); }
    setIsRunning(false);
  };

  // ── SUBMIT (evaluate only, does NOT end exam) ─────────────────
  // Runs all test cases with the wrapper → shows LeetCode dots.
  // Saves the passedCount to answers state.
  // Does NOT call handleFinalSubmit — student must click Finish Exam.
  const handleCodingSubmit = async () => {
    if (!currentQ) return;
    setIsSubmitting(true); setBottomTab('result');
    setTcResult(null); setRawOutput(null);

    const testCases = currentQ.testCases?.filter(tc => tc.input?.trim() && tc.expectedOutput?.trim()) || [];

    try {
      if (currentQ.methodName && testCases.length) {
        // Full LeetCode-style: wrapper + normalised comparison
        const res = await runWithTestCases(language, currentCode, currentQ);
        setTcResult(res);

        // Save code + passedCount to answers (for scoring when Finish is clicked)
        const newAnswers = {
          ...answers,
          [currentQ.id]: { code: currentCode, language, passedCount: res.passedCount },
        };
        setAnswers(newAnswers);

        // Persist to Firestore as a checkpoint (not final submission)
        if (submissionId) {
          await updateSubmission(submissionId, {
            answers: Object.entries(newAnswers).map(([id, ans]) => ({ questionId: id, answer: ans })),
          });
        }
      } else if (!currentQ.methodName) {
        setRawOutput('⚠️ No methodName configured for this question.\nCode cannot be auto-evaluated.\nAsk faculty to set methodName in the question editor.');
        // Still save the code so Finish Exam doesn't lose it
        setAnswers(p => ({ ...p, [currentQ.id]: { code: currentCode, language, passedCount: 0 } }));
      } else {
        setRawOutput('⚠️ No test cases defined for this question.');
        setAnswers(p => ({ ...p, [currentQ.id]: { code: currentCode, language, passedCount: 0 } }));
      }
    } catch (e) {
      setRawOutput(`Submission Error: ${e.message}`);
    }
    setIsSubmitting(false);
  };

  // Navigate between coding questions (no return to MCQ)
  const handleCodingNav = (newIdx) => {
    if (newIdx < 0 || newIdx >= codingQuestions.length) return;
    // Save current code before navigating
    if (currentQ) {
      const existing = answers[currentQ.id];
      setAnswers(p => ({
        ...p,
        [currentQ.id]: { code: currentCode, language, passedCount: existing?.passedCount || 0 },
      }));
    }
    setCurrentIdx(newIdx);
    setTcResult(null); setRawOutput(null); setBottomTab('result');
  };

  // ── Loading / Error screens ───────────────────────────────────
  if (loading) return (
    <div style={{ minHeight:'100vh', background:'#0d1117', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
      <div style={{ width:40, height:40, border:'3px solid #30363d', borderTopColor:'#58a6ff', borderRadius:'50%', animation:'spin .8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <p style={{ color:'#8b949e', marginTop:16, fontSize:14 }}>Loading exam…</p>
    </div>
  );

  if (error) return (
    <div style={{ minHeight:'100vh', background:'#0d1117', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ background:'#161b22', border:'1px solid rgba(248,81,73,0.3)', borderRadius:12, padding:32, textAlign:'center' }}>
        <p style={{ color:'#f85149', marginBottom:16 }}>{error}</p>
        <button onClick={() => history.push('/dashboard')}
          style={{ padding:'10px 24px', background:'#21262d', border:'none', color:'#fff', borderRadius:8, cursor:'pointer' }}>
          Return to Dashboard
        </button>
      </div>
    </div>
  );

  // ── Submitted screen ──────────────────────────────────────────
  if (phase === 'submitted') return (
    <div style={{ minHeight:'100vh', background:'#0d1117', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ background:'#161b22', border:'1px solid #30363d', borderRadius:20, padding:48, textAlign:'center', maxWidth:500 }}>
        <div style={{ fontSize:48, marginBottom:16 }}>✅</div>
        <h2 style={{ color:'#3fb950', fontSize:24, marginBottom:12 }}>Exam Submitted!</h2>
        <p style={{ color:'#8b949e', fontSize:14, lineHeight:1.6, marginBottom:28 }}>
          Your answers have been recorded and scored. Your faculty will review the results.
        </p>
        <button onClick={() => history.push('/dashboard')}
          style={{ width:'100%', padding:'14px', background:'#58a6ff', border:'none', borderRadius:10, color:'#fff', cursor:'pointer', fontWeight:700, fontSize:15 }}>
          Exit to Dashboard
        </button>
      </div>
    </div>
  );

  // MCQ-only exam confirm modal
  if (confirmMCQSubmit) return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.85)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:2000 }}>
      <div style={{ background:'#161b22', border:'1px solid #30363d', borderRadius:16, padding:36, textAlign:'center', maxWidth:440 }}>
        <h3 style={{ color:'#e6edf3', marginBottom:12 }}>Submit Exam?</h3>
        <p style={{ color:'#8b949e', marginBottom:24, lineHeight:1.6 }}>
          Answered {Object.keys(answers).filter(id => mcqQuestions.some(q => q.id === id)).length} of {mcqQuestions.length} MCQs.
        </p>
        <div style={{ display:'flex', gap:12, justifyContent:'center' }}>
          <button onClick={() => setConfirmMCQSubmit(false)}
            style={{ padding:'10px 20px', background:'#21262d', border:'1px solid #30363d', borderRadius:8, color:'#8b949e', cursor:'pointer', fontWeight:700 }}>
            Go Back
          </button>
          <button onClick={() => handleFinalSubmit(false)}
            style={{ padding:'10px 20px', background:'#3fb950', border:'none', borderRadius:8, color:'#fff', cursor:'pointer', fontWeight:700 }}>
            Submit Exam
          </button>
        </div>
      </div>
    </div>
  );

  // ═══════════════════════════════════════════════════════════════
  // CODING PHASE
  // ═══════════════════════════════════════════════════════════════
  if (phase === 'coding') {
    const q       = codingQuestions[currentIdx];
    const langObj = LANGUAGES.find(l => l.value === language) ?? LANGUAGES[0];
    const isFirst = currentIdx === 0;
    const isLast  = currentIdx === codingQuestions.length - 1;

    return (
      <div style={{ display:'flex', flexDirection:'column', height:'100vh', background:'#0d1117', color:'#e6edf3', fontFamily:'system-ui,sans-serif', overflow:'hidden' }}>
        <style>{`
          *{box-sizing:border-box;margin:0;padding:0;}
          ::-webkit-scrollbar{width:6px;height:6px;}
          ::-webkit-scrollbar-track{background:#0d1117;}
          ::-webkit-scrollbar-thumb{background:#30363d;border-radius:3px;}
          @keyframes spin{to{transform:rotate(360deg)}}
        `}</style>

        {/* Header */}
        <header style={{ height:52, background:'#161b22', borderBottom:'1px solid #21262d', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 16px', flexShrink:0, gap:12 }}>
          {/* Left: title + question nav */}
          <div style={{ display:'flex', alignItems:'center', gap:8, minWidth:0 }}>
            {/* Prev/Next coding question — NO return to MCQ */}
            <button onClick={() => handleCodingNav(currentIdx - 1)} disabled={isFirst}
              style={{ background:'none', border:'1px solid #30363d', borderRadius:5, padding:'3px 8px', color:isFirst?'#484f58':'#8b949e', cursor:isFirst?'not-allowed':'pointer', fontSize:14, opacity:isFirst?0.4:1 }}>◀</button>
            <button onClick={() => handleCodingNav(currentIdx + 1)} disabled={isLast}
              style={{ background:'none', border:'1px solid #30363d', borderRadius:5, padding:'3px 8px', color:isLast?'#484f58':'#8b949e', cursor:isLast?'not-allowed':'pointer', fontSize:14, opacity:isLast?0.4:1 }}>▶</button>
            <span style={{ fontSize:11, color:'#8b949e', whiteSpace:'nowrap' }}>Q {currentIdx+1}/{codingQuestions.length}</span>

            <span style={{ fontSize:13, fontWeight:700, color:'#e6edf3', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:260 }}>
              {q?.title || 'Loading…'}
            </span>
            {q?.difficulty && (
              <span style={{ fontSize:11, fontWeight:700, padding:'2px 8px', borderRadius:10, flexShrink:0,
                background: q.difficulty==='Easy'?'rgba(0,185,107,.1)':q.difficulty==='Hard'?'rgba(239,68,68,.1)':'rgba(255,184,0,.1)',
                color: q.difficulty==='Easy'?'#00b96b':q.difficulty==='Hard'?'#ef4444':'#ffb800' }}>
                {q.difficulty}
              </span>
            )}
            {/* Coding question dots */}
            <div style={{ display:'flex', gap:3, flexShrink:0 }}>
              {codingQuestions.map((cq, i) => {
                const done = answers[cq.id]?.passedCount !== undefined;
                const isCur = i === currentIdx;
                return (
                  <button key={cq.id} onClick={() => handleCodingNav(i)} title={cq.title}
                    style={{ width:22, height:22, borderRadius:5, border:'none', cursor:'pointer', fontWeight:700, fontSize:10,
                      background: isCur ? '#f0883e' : done ? 'rgba(63,185,80,.2)' : '#21262d',
                      color: isCur ? '#fff' : done ? '#3fb950' : '#8b949e' }}>
                    {i+1}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: timer, violations, lang, controls */}
          <div style={{ display:'flex', alignItems:'center', gap:8, flexShrink:0 }}>
            <div style={{ fontFamily:'monospace', fontSize:15, fontWeight:800,
              color: timer.urgent ? '#f85149' : '#58a6ff',
              padding:'4px 12px', borderRadius:8,
              background: timer.urgent ? 'rgba(248,81,73,.1)' : 'rgba(88,166,255,.08)',
              border:`1px solid ${timer.urgent?'rgba(248,81,73,.3)':'rgba(88,166,255,.2)'}` }}>
              {String(timer.h).padStart(2,'0')}:{String(timer.m).padStart(2,'0')}:{String(timer.s).padStart(2,'0')}
            </div>
            {violations > 0 && (
              <span style={{ fontSize:11, fontWeight:700, padding:'3px 8px', borderRadius:6, background:'rgba(248,81,73,.15)', color:'#f85149', border:'1px solid rgba(248,81,73,.3)' }}>
                ⚠ {violations}/3
              </span>
            )}

            <select value={language} onChange={e => handleLangChange(e.target.value)}
              style={{ appearance:'none', background:'#21262d', border:'1px solid #30363d', borderRadius:6, padding:'5px 10px', color:'#e6edf3', fontSize:12, fontWeight:700, cursor:'pointer', outline:'none' }}>
              {LANGUAGES.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
            </select>

            <button onClick={() => setCodes(p => ({ ...p, [codeKey]: q?.boilerplates?.[language] ?? FALLBACK_BOILERPLATE[language] }))}
              style={{ background:'none', border:'1px solid #30363d', borderRadius:5, padding:'4px 10px', color:'#8b949e', fontSize:12, cursor:'pointer' }}>
              ↺ Reset
            </button>

            {/* Run — always uses wrapper when methodName exists */}
            <button onClick={handleRun} disabled={isRunning || isSubmitting}
              style={{ padding:'6px 16px', borderRadius:6, background:'rgba(35,134,54,.15)', color:'#3fb950', border:'1px solid rgba(35,134,54,.3)', fontSize:13, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', gap:6, opacity:(isRunning||isSubmitting)?0.6:1 }}>
              {isRunning ? <span style={{ width:12, height:12, border:'2px solid #3fb950', borderTopColor:'transparent', borderRadius:'50%', animation:'spin .7s linear infinite', display:'inline-block' }} /> : '▶'}
              {isRunning ? 'Running…' : 'Run'}
            </button>

            {/* Submit = evaluate only. Does NOT end exam. */}
            <button onClick={handleCodingSubmit} disabled={isRunning || isSubmitting}
              style={{ padding:'6px 16px', borderRadius:6, background:'rgba(88,166,255,.15)', color:'#58a6ff', border:'1px solid rgba(88,166,255,.3)', fontSize:13, fontWeight:700, cursor:'pointer', opacity:(isRunning||isSubmitting)?0.7:1 }}>
              {isSubmitting ? 'Evaluating…' : '✓ Submit'}
            </button>

            {/* Finish Exam — only this ends the exam */}
            <button onClick={() => setShowFinishModal(true)} disabled={isFinishing}
              style={{ padding:'6px 20px', borderRadius:6, background:'#f0883e', color:'#fff', border:'none', fontSize:13, fontWeight:800, cursor:'pointer', opacity:isFinishing?0.7:1 }}>
              {isFinishing ? 'Finishing…' : 'Finish Exam'}
            </button>
          </div>
        </header>

        {/* Body */}
        <div style={{ flex:1, display:'flex', overflow:'hidden' }}>
          {/* Left: description */}
          <div style={{ width:'40%', display:'flex', flexDirection:'column', borderRight:'1px solid #21262d', overflow:'hidden' }}>
            <div style={{ display:'flex', background:'#161b22', borderBottom:'1px solid #21262d', padding:'0 4px', flexShrink:0 }}>
              <span style={{ padding:'10px 16px', fontSize:13, fontWeight:700, color:'#e6edf3', borderBottom:'2px solid #f0883e' }}>Description</span>
            </div>
            <div style={{ flex:1, overflowY:'auto', padding:'20px 24px' }}>
              <h2 style={{ fontSize:20, fontWeight:800, color:'#e6edf3', marginBottom:14, lineHeight:1.3 }}>{q?.title}</h2>
              <div style={{ display:'flex', gap:8, marginBottom:18, flexWrap:'wrap' }}>
                {q?.marks && <span style={{ fontSize:12, fontWeight:700, padding:'3px 10px', borderRadius:12, background:'rgba(88,166,255,.1)', color:'#58a6ff', border:'1px solid rgba(88,166,255,.2)' }}>{q.marks} pts</span>}
                {q?.testCases?.length > 0 && <span style={{ fontSize:12, fontWeight:700, padding:'3px 10px', borderRadius:12, background:'rgba(63,185,80,.1)', color:'#3fb950', border:'1px solid rgba(63,185,80,.2)' }}>{q.testCases.length} test cases</span>}
                {q?.methodName && <span style={{ fontSize:11, padding:'3px 10px', borderRadius:12, background:'rgba(63,185,80,.08)', color:'#3fb950', border:'1px solid rgba(63,185,80,.15)' }}>✓ Auto-wrapped</span>}
              </div>
              <div style={{ fontSize:15, lineHeight:1.85, color:'#c9d1d9' }}
                dangerouslySetInnerHTML={{ __html: q?.description || q?.question || '<p>No description.</p>' }} />

              {q?.testCases?.filter(tc => !tc.isHidden).slice(0,3).map((tc, i) => (
                <div key={i} style={{ marginTop:20, background:'#161b22', border:'1px solid #21262d', borderRadius:10, overflow:'hidden' }}>
                  <div style={{ padding:'8px 14px', borderBottom:'1px solid #21262d', fontSize:12, fontWeight:700, color:'#8b949e' }}>Example {i+1}</div>
                  <div style={{ padding:14 }}>
                    <p style={{ fontSize:12, color:'#8b949e', marginBottom:4 }}>Input:</p>
                    <pre style={{ background:'#0d1117', padding:'8px 12px', borderRadius:6, fontSize:12, color:'#a5d6ff', fontFamily:'monospace', marginBottom:10, overflow:'auto' }}>{tc.input}</pre>
                    <p style={{ fontSize:12, color:'#8b949e', marginBottom:4 }}>Output:</p>
                    <pre style={{ background:'#0d1117', padding:'8px 12px', borderRadius:6, fontSize:12, color:'#7ee787', fontFamily:'monospace', overflow:'auto' }}>{tc.expectedOutput}</pre>
                  </div>
                </div>
              ))}
              {q?.testCases?.filter(tc => tc.isHidden).length > 0 && (
                <p style={{ fontSize:12, color:'#8b949e', marginTop:12, fontStyle:'italic' }}>
                  + {q.testCases.filter(tc => tc.isHidden).length} hidden test cases. Submit to run all.
                </p>
              )}
            </div>
          </div>

          {/* Right: Monaco + result panel */}
          <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
            <div style={{ height:38, background:'#161b22', borderBottom:'1px solid #21262d', display:'flex', alignItems:'center', padding:'0 14px', gap:10, flexShrink:0 }}>
              <span style={{ fontSize:12, color:'#8b949e' }}>{langObj.label} · Monaco</span>
              {q?.methodName
                ? <span style={{ fontSize:10, background:'rgba(63,185,80,.1)', color:'#3fb950', border:'1px solid rgba(63,185,80,.2)', padding:'2px 8px', borderRadius:5 }}>✓ Auto-wrapped · imports injected</span>
                : <span style={{ fontSize:10, background:'rgba(239,68,68,.1)', color:'#f87171', border:'1px solid rgba(239,68,68,.2)', padding:'2px 8px', borderRadius:5 }}>⚠ No methodName</span>
              }
              {/* Progress indicator */}
              <span style={{ marginLeft:'auto', fontSize:11, color:'#8b949e' }}>
                Evaluated: {evaluatedCount}/{codingQuestions.length}
              </span>
            </div>

            <div style={{ flex:'0 0 60%', overflow:'hidden' }}>
              <Editor
                theme="vs-dark"
                language={langObj.monaco}
                value={currentCode}
                onChange={v => setCodes(p => ({ ...p, [codeKey]: v ?? '' }))}
                options={{ minimap:{enabled:false}, fontSize:14, lineHeight:22, scrollBeyondLastLine:false, tabSize:4, wordWrap:'on', automaticLayout:true }}
              />
            </div>

            <div style={{ flex:1, display:'flex', flexDirection:'column', borderTop:'1px solid #21262d', minHeight:0 }}>
              <div style={{ display:'flex', alignItems:'center', background:'#161b22', borderBottom:'1px solid #21262d', height:38, padding:'0 8px', flexShrink:0 }}>
                <button onClick={() => setBottomTab('stdin')}
                  style={{ padding:'0 14px', height:'100%', background:'none', border:'none', borderBottom:`2px solid ${bottomTab==='stdin'?'#f0883e':'transparent'}`, color:bottomTab==='stdin'?'#e6edf3':'#8b949e', fontSize:12, fontWeight:bottomTab==='stdin'?700:400, cursor:'pointer' }}>
                  📥 Custom Input
                </button>
                <button onClick={() => setBottomTab('result')}
                  style={{ padding:'0 14px', height:'100%', background:'none', border:'none', borderBottom:`2px solid ${bottomTab==='result'?'#f0883e':'transparent'}`, color:bottomTab==='result'?'#e6edf3':'#8b949e', fontSize:12, fontWeight:bottomTab==='result'?700:400, cursor:'pointer', display:'flex', alignItems:'center', gap:6 }}>
                  📤 Test Results
                  {tcResult && <span style={{ width:7, height:7, borderRadius:'50%', background:tcResult.allPassed?'#3fb950':'#f85149', display:'inline-block' }} />}
                </button>
                {/* Show current question's score if evaluated */}
                {answers[currentQ?.id]?.passedCount !== undefined && (
                  <span style={{ marginLeft:'auto', marginRight:8, fontSize:11, fontWeight:700,
                    color: answers[currentQ.id].passedCount === (currentQ?.testCases?.length || 0) ? '#3fb950' : '#f0883e' }}>
                    {answers[currentQ.id].passedCount}/{currentQ?.testCases?.length || '?'} passed
                  </span>
                )}
              </div>

              <div style={{ flex:1, overflow:'hidden' }}>
                {bottomTab === 'stdin' ? (
                  <div style={{ height:'100%', padding:12 }}>
                    <p style={{ fontSize:11, color:'#484f58', marginBottom:6 }}>
                      {q?.methodName
                        ? 'Optional: override Run input (e.g. [3,2,4], 6). Leave empty to use Example 1 automatically.'
                        : 'Custom stdin for Run (no wrapper — include imports + print in your code).'}
                    </p>
                    <textarea value={stdin} onChange={e => setStdin(e.target.value)}
                      placeholder={q?.methodName
                        ? `e.g. [2,7,11,15], 9\n(Leave empty → uses Example 1 input for Run)`
                        : 'Custom stdin…'}
                      style={{ width:'100%', height:'calc(100% - 30px)', background:'#0d1117', color:'#e6edf3', border:'none', resize:'none', fontFamily:"'Courier New',monospace", fontSize:13, outline:'none', lineHeight:1.65 }} />
                  </div>
                ) : (
                  <TestResultPanel tcResult={tcResult} rawOutput={rawOutput} isEvaluating={isRunning || isSubmitting} />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Finish Exam modal */}
        {showFinishModal && (
          <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.85)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000 }}>
            <div style={{ background:'#161b22', border:'1px solid #30363d', borderRadius:16, padding:36, maxWidth:460, width:'90%', textAlign:'center' }}>
              <div style={{ fontSize:42, marginBottom:16 }}>🏁</div>
              <h3 style={{ fontSize:20, fontWeight:800, color:'#e6edf3', marginBottom:10 }}>Finish Exam?</h3>
              <p style={{ fontSize:14, color:'#8b949e', lineHeight:1.6, marginBottom:8 }}>
                This will submit all your answers and end the exam. You cannot go back.
              </p>
              <div style={{ background:'#0d1117', borderRadius:10, padding:'12px 16px', marginBottom:24, textAlign:'left' }}>
                <p style={{ fontSize:12, color:'#8b949e', marginBottom:6 }}>Summary:</p>
                <p style={{ fontSize:13, color:'#e6edf3' }}>
                  MCQ: <strong style={{ color:'#3fb950' }}>{Object.keys(answers).filter(id => mcqQuestions.some(q => q.id === id)).length}</strong>/{mcqQuestions.length} answered
                </p>
                <p style={{ fontSize:13, color:'#e6edf3', marginTop:4 }}>
                  Coding: <strong style={{ color:'#3fb950' }}>{evaluatedCount}</strong>/{codingQuestions.length} evaluated
                </p>
                {evaluatedCount < codingQuestions.length && (
                  <p style={{ fontSize:12, color:'#f0883e', marginTop:6 }}>
                    ⚠ {codingQuestions.length - evaluatedCount} coding question(s) not yet submitted. Unevaluated questions score 0.
                  </p>
                )}
              </div>
              <div style={{ display:'flex', gap:12, justifyContent:'center' }}>
                <button onClick={() => setShowFinishModal(false)}
                  style={{ padding:'10px 24px', borderRadius:8, background:'#21262d', border:'1px solid #30363d', color:'#8b949e', fontSize:14, fontWeight:700, cursor:'pointer' }}>
                  Cancel
                </button>
                <button onClick={() => handleFinalSubmit(false)}
                  style={{ padding:'10px 24px', borderRadius:8, background:'#f0883e', border:'none', color:'#fff', fontSize:14, fontWeight:800, cursor:'pointer' }}>
                  Finish &amp; Submit
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Proctoring violation overlay */}
        {showViolation && (
          <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.9)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:2000 }}>
            <div style={{ background:'#161b22', border:'2px solid rgba(248,81,73,.5)', borderRadius:16, padding:40, maxWidth:460, width:'90%', textAlign:'center' }}>
              <div style={{ fontSize:50, marginBottom:16 }}>🚨</div>
              <h3 style={{ fontSize:22, fontWeight:800, color:'#f85149', marginBottom:12 }}>Proctoring Violation!</h3>
              <p style={{ fontSize:14, color:'#c9d1d9', lineHeight:1.7, marginBottom:24 }}>
                Violations: <strong style={{ color:'#f85149' }}>{violations}/3</strong> — At 3 your exam auto-submits.
              </p>
              <div style={{ display:'flex', gap:12, justifyContent:'center' }}>
                <button onClick={() => handleFinalSubmit(true)}
                  style={{ padding:'10px 20px', borderRadius:8, background:'#f85149', border:'none', color:'#fff', fontSize:14, fontWeight:700, cursor:'pointer' }}>
                  Submit Now
                </button>
                <button onClick={async () => { setShowViolation(false); try { await document.documentElement.requestFullscreen?.(); } catch {} }}
                  style={{ padding:'10px 20px', borderRadius:8, background:'#21262d', border:'1px solid #388bfd', color:'#58a6ff', fontSize:14, fontWeight:700, cursor:'pointer' }}>
                  Return to Exam
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // MCQ PHASE
  // ═══════════════════════════════════════════════════════════════
  return (
    <div style={{ minHeight:'100vh', background:'#0d1117', color:'#e6edf3', display:'flex', flexDirection:'column', fontFamily:'system-ui' }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>

      <header style={{ background:'#161b22', borderBottom:'1px solid #21262d', padding:'0 24px', height:56, display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <span style={{ fontWeight:800, fontSize:15 }}>{exam?.title}</span>
          {violations > 0 && (
            <span style={{ background:'rgba(248,81,73,0.15)', border:'1px solid rgba(248,81,73,0.3)', color:'#f85149', fontSize:11, fontWeight:700, padding:'2px 8px', borderRadius:6 }}>
              ⚠️ {violations}/3 Violations
            </span>
          )}
        </div>
        <span style={{ fontFamily:'monospace', fontSize:20, fontWeight:800, color:timer.urgent?'#f85149':'#58a6ff' }}>
          {String(timer.h).padStart(2,'0')}:{String(timer.m).padStart(2,'0')}:{String(timer.s).padStart(2,'0')}
        </span>
        <button onClick={proceedToCoding}
          style={{ padding:'8px 20px', background:'#f0883e', border:'none', borderRadius:8, color:'#fff', fontWeight:700, cursor:'pointer', fontSize:14 }}>
          {codingQuestions.length > 0 ? 'Next: Coding Phase →' : 'Submit Exam ✓'}
        </button>
      </header>

      <div style={{ flex:1, display:'flex', overflow:'hidden' }}>
        <div style={{ flex:1, overflowY:'auto', padding:'32px 40px' }}>
          {!currentQ ? (
            <p style={{ color:'#8b949e' }}>No MCQ questions in this exam.</p>
          ) : (
            <>
              <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:28 }}>
                <span style={{ fontSize:13, color:'#8b949e' }}>Question {currentIdx+1} of {mcqQuestions.length}</span>
                <button onClick={() => toggleMark(currentQ.id)}
                  style={{ padding:'4px 12px', background:'#21262d', border:'1px solid #30363d', borderRadius:6, color:marked.has(currentQ.id)?'#58a6ff':'#8b949e', cursor:'pointer', fontSize:12 }}>
                  🔖 {marked.has(currentQ.id)?'Marked':'Mark for Review'}
                </button>
              </div>

              <div style={{ fontSize:18, lineHeight:1.75, marginBottom:32 }}
                dangerouslySetInnerHTML={{ __html: currentQ.description || currentQ.question }} />

              <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                {(currentQ.options||[]).map((opt, i) => (
                  <button key={i} onClick={() => handleMCQAnswer(currentQ.id, opt)}
                    style={{ display:'flex', alignItems:'center', gap:16, padding:'16px 20px',
                      background: answers[currentQ.id]===opt ? 'rgba(88,166,255,0.1)' : '#161b22',
                      border:`2px solid ${answers[currentQ.id]===opt?'#58a6ff':'#21262d'}`,
                      borderRadius:12, cursor:'pointer', textAlign:'left', width:'100%',
                      color:'#e6edf3', fontSize:15, transition:'all 0.15s' }}>
                    <span style={{ width:28, height:28, borderRadius:'50%',
                      background: answers[currentQ.id]===opt ? '#58a6ff' : '#21262d',
                      display:'flex', alignItems:'center', justifyContent:'center',
                      fontWeight:700, fontSize:13, flexShrink:0 }}>
                      {['A','B','C','D','E'][i]}
                    </span>
                    {opt}
                  </button>
                ))}
              </div>

              <div style={{ display:'flex', justifyContent:'space-between', marginTop:40 }}>
                <button onClick={() => setCurrentIdx(i => Math.max(0,i-1))} disabled={currentIdx===0}
                  style={{ padding:'10px 24px', background:'#21262d', border:'none', borderRadius:8, color:'#fff', cursor:'pointer', opacity:currentIdx===0?0.4:1 }}>
                  ← Prev
                </button>
                {currentIdx < mcqQuestions.length-1 ? (
                  <button onClick={() => setCurrentIdx(i => i+1)}
                    style={{ padding:'10px 24px', background:'#21262d', border:'none', borderRadius:8, color:'#fff', cursor:'pointer' }}>
                    Next →
                  </button>
                ) : (
                  <button onClick={proceedToCoding}
                    style={{ padding:'10px 24px', background:'#3fb950', border:'none', borderRadius:8, color:'#fff', fontWeight:700, cursor:'pointer' }}>
                    {codingQuestions.length>0 ? 'Coding Phase →' : 'Submit Exam ✓'}
                  </button>
                )}
              </div>
            </>
          )}
        </div>

        {/* MCQ Palette */}
        <div style={{ width:240, background:'#161b22', borderLeft:'1px solid #21262d', padding:16, overflowY:'auto' }}>
          <p style={{ fontSize:11, fontWeight:700, color:'#8b949e', marginBottom:12, textTransform:'uppercase', letterSpacing:'0.08em' }}>MCQ Palette</p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:6, marginBottom:20 }}>
            {mcqQuestions.map((q, i) => {
              const s = Q_STATUS[getQStatus(q, i)];
              return (
                <button key={q.id} onClick={() => setCurrentIdx(i)}
                  style={{ aspectRatio:'1', borderRadius:6, background:s.bg, border:`1px solid ${s.border}`, color:s.color, fontWeight:700, cursor:'pointer', fontSize:12 }}>
                  {i+1}
                </button>
              );
            })}
          </div>
          {[{key:'answered',label:'Answered'},{key:'marked',label:'Marked'},{key:'unanswered',label:'Not Answered'}].map(({key,label}) => (
            <div key={key} style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
              <div style={{ width:12, height:12, borderRadius:3, background:Q_STATUS[key].bg, border:`1px solid ${Q_STATUS[key].border}` }} />
              <span style={{ fontSize:11, color:'#8b949e' }}>{label}</span>
            </div>
          ))}
          <div style={{ marginTop:20, padding:12, background:'rgba(88,166,255,0.06)', border:'1px solid rgba(88,166,255,0.15)', borderRadius:8 }}>
            <p style={{ fontSize:11, color:'#8b949e', lineHeight:1.5 }}>
              Answered: <strong style={{ color:'#3fb950' }}>
                {Object.keys(answers).filter(id => mcqQuestions.some(q => q.id === id)).length}
              </strong> / {mcqQuestions.length}
            </p>
          </div>
        </div>
      </div>

      {/* Proctoring violation overlay */}
      {showViolation && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.85)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:2000 }}>
          <div style={{ background:'#161b22', border:'2px solid rgba(248,81,73,0.4)', borderRadius:16, padding:36, textAlign:'center', maxWidth:440 }}>
            <div style={{ fontSize:48, marginBottom:12 }}>🚨</div>
            <h3 style={{ color:'#f85149', marginBottom:12 }}>Proctoring Violation</h3>
            <p style={{ color:'#c9d1d9', lineHeight:1.6, marginBottom:8 }}>
              Fullscreen exit detected. <strong>{violations}/3</strong> violations.
            </p>
            <button onClick={async () => { setShowViolation(false); try { await document.documentElement.requestFullscreen?.(); } catch {} }}
              style={{ padding:'10px 24px', background:'#58a6ff', border:'none', borderRadius:8, color:'#fff', cursor:'pointer', fontWeight:700, marginTop:16 }}>
              Return to Exam
            </button>
          </div>
        </div>
      )}
    </div>
  );
}