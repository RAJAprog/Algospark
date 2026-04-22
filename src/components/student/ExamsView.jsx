// // // FILE PATH: src/components/student/ExamsView.jsx
// // // This is the standalone ExamsView component — import this in StudentDashboard.jsx
// // // replacing the inline ExamsView function there.
// // //
// // // FIXES:
// // // 1. ONE-ATTEMPT: completed submissions show locked card (no re-entry)
// // // 2. IN-PROGRESS: shows Resume button
// // // 3. Beautiful card UI matching practice page aesthetic
// // // 4. Countdown timer per exam

// // import { useState, useEffect, useCallback } from "react";
// // import { collection, query, where, getDocs } from "firebase/firestore";
// // import { db } from "../../firebase/config";

// // // ── Helpers ───────────────────────────────────────────────────────────────────
// // function getWindowStatus(exam) {
// //   if (exam.status === "completed") return "completed";
// //   const start = exam.scheduledStartTime?.toDate?.() ?? new Date(exam.scheduledStartTime);
// //   const end   = new Date(start.getTime() + (exam.durationMinutes ?? 60) * 60 * 1000);
// //   const now   = new Date();
// //   if (now >= start && now <= end) return "live";
// //   if (now < start)               return "upcoming";
// //   return "missed";
// // }
// // function fmtDate(val) {
// //   const d = val?.toDate ? val.toDate() : new Date(val);
// //   return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
// // }
// // function fmtTime(val) {
// //   const d = val?.toDate ? val.toDate() : new Date(val);
// //   return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
// // }
// // function endTime(exam) {
// //   const s = exam.scheduledStartTime?.toDate?.() ?? new Date(exam.scheduledStartTime);
// //   return new Date(s.getTime() + (exam.durationMinutes ?? 60) * 60 * 1000);
// // }
// // function durationLabel(mins) {
// //   const h = Math.floor(mins / 60), m = mins % 60;
// //   return h > 0 ? `${h}h ${m > 0 ? m + "m" : ""}`.trim() : `${m}m`;
// // }

// // // ── Countdown hook ─────────────────────────────────────────────────────────────
// // function useCountdown(target) {
// //   const calc = useCallback(() => {
// //     if (!target) return null;
// //     const diff = (target instanceof Date ? target : new Date(target)) - new Date();
// //     if (diff <= 0) return null;
// //     return { h: Math.floor(diff / 3600000), m: Math.floor((diff % 3600000) / 60000), s: Math.floor((diff % 60000) / 1000) };
// //   }, [target]);
// //   const [cd, setCd] = useState(calc);
// //   useEffect(() => { const t = setInterval(() => setCd(calc()), 1000); return () => clearInterval(t); }, [calc]);
// //   return cd;
// // }

// // function CountdownBadge({ exam, ws }) {
// //   const end   = endTime(exam);
// //   const start = exam.scheduledStartTime?.toDate?.() ?? new Date(exam.scheduledStartTime);
// //   const cd    = useCountdown(ws === "live" ? end : start);
// //   if (!cd || (ws !== "live" && ws !== "upcoming")) return null;
// //   const color = ws === "live" ? "#10b981" : "#f97316";
// //   return (
// //     <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
// //       <span style={{ fontSize: 11, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.07em", fontFamily: "system-ui" }}>
// //         {ws === "live" ? "Ends in" : "Starts in"}
// //       </span>
// //       {[{ v: cd.h, u: "h" }, { v: cd.m, u: "m" }, { v: cd.s, u: "s" }].map(({ v, u }, i) => (
// //         <span key={i} style={{
// //           fontFamily: "'JetBrains Mono', 'Courier New', monospace", fontWeight: 800, fontSize: 13,
// //           background: `${color}15`, border: `1px solid ${color}35`, borderRadius: 7,
// //           padding: "3px 8px", color, minWidth: 34, textAlign: "center", letterSpacing: "0.02em",
// //           display: "inline-block",
// //         }}>
// //           {String(v).padStart(2, "0")}{u}
// //         </span>
// //       ))}
// //     </div>
// //   );
// // }

// // // ── Status config ─────────────────────────────────────────────────────────────
// // const STATUS_CFG = {
// //   live:      { color: "#10b981", bg: "#f0fdf4", border: "#bbf7d0", darkBg: "rgba(16,185,129,.1)",  darkBorder: "rgba(16,185,129,.25)", label: "Live Now",  dot: true  },
// //   upcoming:  { color: "#f97316", bg: "#fff7ed", border: "#fed7aa", darkBg: "rgba(249,115,22,.1)",  darkBorder: "rgba(249,115,22,.25)", label: "Upcoming",  dot: false },
// //   completed: { color: "#6b7280", bg: "#f9fafb", border: "#e5e7eb", darkBg: "rgba(107,114,128,.1)", darkBorder: "rgba(107,114,128,.2)", label: "Completed", dot: false },
// //   missed:    { color: "#ef4444", bg: "#fef2f2", border: "#fecaca", darkBg: "rgba(239,68,68,.1)",   darkBorder: "rgba(239,68,68,.2)",   label: "Missed",    dot: false },
// // };

// // // ── Single Exam Card ──────────────────────────────────────────────────────────
// // function ExamCard({ exam, submissionMap, onStartExam, dark }) {
// //   const ws        = getWindowStatus(exam);
// //   const cfg       = STATUS_CFG[ws] || STATUS_CFG.upcoming;
// //   const start     = exam.scheduledStartTime?.toDate?.() ?? new Date(exam.scheduledStartTime);
// //   const end_      = endTime(exam);
// //   const totalMins = exam.durationMinutes ?? 60;
// //   const qCount    = exam.questionIds?.length ?? 0;

// //   const sub          = submissionMap[exam.id];
// //   const isAttempted  = sub?.status === "completed";
// //   const isInProgress = sub && sub.status !== "completed";

// //   const borderColor = ws === "live" && !isAttempted
// //     ? (dark ? cfg.darkBorder : cfg.border)
// //     : (dark ? "#21262d" : "#e5e7eb");

// //   const bg = dark
// //     ? (ws === "live" && !isAttempted ? cfg.darkBg : "#161b22")
// //     : (ws === "live" && !isAttempted ? cfg.bg : "#ffffff");

// //   return (
// //     <div style={{
// //       background: bg, border: `1.5px solid ${borderColor}`, borderRadius: 16,
// //       overflow: "hidden", transition: "all .2s ease",
// //       boxShadow: ws === "live" && !isAttempted ? `0 0 0 3px ${cfg.color}18` : "none",
// //     }}>
// //       {ws === "live" && !isAttempted && (
// //         <div style={{ height: 3, background: `linear-gradient(90deg, ${cfg.color}, #3b82f6)` }} />
// //       )}
// //       <div style={{ padding: "20px 24px" }}>
// //         {/* Row 1: title + status badge */}
// //         <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 14 }}>
// //           <div style={{ flex: 1 }}>
// //             <h3 style={{ fontSize: 16, fontWeight: 800, color: dark ? "#e6edf3" : "#111827", fontFamily: "'Trebuchet MS', system-ui, sans-serif", lineHeight: 1.3, marginBottom: 6 }}>
// //               {exam.title}
// //             </h3>
// //             {exam.description && (
// //               <p style={{ fontSize: 13, color: dark ? "#8b949e" : "#6b7280", lineHeight: 1.5 }}>
// //                 {exam.description.substring(0, 90)}{exam.description.length > 90 ? "…" : ""}
// //               </p>
// //             )}
// //           </div>
// //           <div style={{ flexShrink: 0 }}>
// //             {isAttempted ? (
// //               <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 800, padding: "4px 10px", borderRadius: 20, background: "rgba(107,114,128,.1)", color: "#6b7280", border: "1px solid rgba(107,114,128,.2)", textTransform: "uppercase", letterSpacing: "0.07em" }}>
// //                 ✓ Submitted
// //               </span>
// //             ) : (
// //               <span style={{
// //                 display: "flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 800,
// //                 padding: "4px 10px", borderRadius: 20,
// //                 background: dark ? cfg.darkBg : cfg.bg, color: cfg.color,
// //                 border: `1px solid ${dark ? cfg.darkBorder : cfg.border}`,
// //                 textTransform: "uppercase", letterSpacing: "0.07em",
// //                 animation: ws === "live" ? "livePulse 2s infinite" : "none",
// //               }}>
// //                 {cfg.dot && <span style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.color, flexShrink: 0 }} />}
// //                 {cfg.label}
// //               </span>
// //             )}
// //           </div>
// //         </div>

// //         {/* Row 2: meta pills */}
// //         <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
// //           {[
// //             exam.scheduledStartTime && { icon: "📅", val: fmtDate(start) },
// //             exam.scheduledStartTime && { icon: "🕗", val: `${fmtTime(start)} – ${fmtTime(end_)}` },
// //             { icon: "⏱", val: durationLabel(totalMins) },
// //             { icon: "❓", val: `${qCount} Q` },
// //           ].filter(Boolean).map(({ icon, val }, i) => (
// //             <span key={i} style={{
// //               display: "flex", alignItems: "center", gap: 4, fontSize: 12,
// //               color: dark ? "#8b949e" : "#6b7280",
// //               background: dark ? "#21262d" : "#f3f4f6",
// //               border: `1px solid ${dark ? "#30363d" : "#e5e7eb"}`,
// //               borderRadius: 8, padding: "3px 10px", fontFamily: "system-ui",
// //             }}>
// //               {icon} <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>{val}</span>
// //             </span>
// //           ))}
// //         </div>

// //         {/* Row 3: countdown + CTA */}
// //         <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
// //           <CountdownBadge exam={exam} ws={ws} />
// //           <div style={{ marginLeft: "auto" }}>
// //             {isAttempted ? (
// //               <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
// //                 {sub.totalScore != null && (
// //                   <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: 15, color: dark ? "#e6edf3" : "#111827" }}>
// //                     Score: <span style={{ color: "#10b981" }}>{sub.totalScore}</span>
// //                   </span>
// //                 )}
// //                 <button disabled style={{ background: dark ? "#21262d" : "#f3f4f6", border: `1px solid ${dark ? "#30363d" : "#e5e7eb"}`, borderRadius: 10, padding: "8px 18px", color: dark ? "#8b949e" : "#6b7280", fontSize: 13, fontWeight: 700, cursor: "not-allowed", fontFamily: "system-ui" }}>
// //                   🔒 Already Submitted
// //                 </button>
// //               </div>
// //             ) : isInProgress ? (
// //               <button onClick={() => onStartExam(exam.id, sub.id)}
// //                 style={{ background: "#f97316", border: "none", borderRadius: 10, padding: "9px 22px", color: "#fff", fontSize: 13, fontWeight: 800, cursor: "pointer", fontFamily: "system-ui", display: "flex", alignItems: "center", gap: 8, boxShadow: "0 4px 12px rgba(249,115,22,.3)" }}>
// //                 ▶ Resume Exam
// //               </button>
// //             ) : ws === "live" ? (
// //               <button onClick={() => onStartExam(exam.id, null)}
// //                 style={{ background: `linear-gradient(135deg, ${cfg.color}, #3b82f6)`, border: "none", borderRadius: 10, padding: "9px 22px", color: "#fff", fontSize: 13, fontWeight: 800, cursor: "pointer", fontFamily: "system-ui", display: "flex", alignItems: "center", gap: 8, boxShadow: `0 4px 14px ${cfg.color}40` }}>
// //                 ▶ Start Exam
// //               </button>
// //             ) : ws === "upcoming" ? (
// //               <button disabled style={{ background: dark ? "#21262d" : "#f3f4f6", border: `1px solid ${dark ? "#30363d" : "#e5e7eb"}`, borderRadius: 10, padding: "9px 22px", color: dark ? "#6b7280" : "#9ca3af", fontSize: 13, fontWeight: 700, cursor: "not-allowed", fontFamily: "system-ui" }}>
// //                 🔒 Not Yet Open
// //               </button>
// //             ) : (
// //               <span style={{ fontSize: 13, color: dark ? "#6b7280" : "#9ca3af", fontWeight: 600 }}>
// //                 {ws === "missed" ? "⛔ Window Closed" : "✓ Ended"}
// //               </span>
// //             )}
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // // ── Main ExamsView ─────────────────────────────────────────────────────────────
// // export default function ExamsView({ exams, currentUser, onStartExam, T }) {
// //   const [filter,       setFilter]      = useState("all");
// //   const [submissionMap,setSubMap]      = useState({});
// //   const [loadingSubs,  setLoadingSubs] = useState(true);

// //   const dark = T?.bg === "#0d1117" || (T?.bg || "").startsWith("#0");

// //   // Fetch existing submissions for this student
// //   useEffect(() => {
// //     if (!currentUser?.uid) { setLoadingSubs(false); return; }
// //     const fetchSubs = async () => {
// //       setLoadingSubs(true);
// //       try {
// //         const q    = query(collection(db, "submissions"), where("studentId", "==", currentUser.uid));
// //         const snap = await getDocs(q);
// //         const map  = {};
// //         snap.docs.forEach(d => {
// //           const data = d.data();
// //           if (!data.examId) return;
// //           const existing = map[data.examId];
// //           // Prefer completed over in-progress
// //           if (!existing || data.status === "completed" || !existing.status) {
// //             map[data.examId] = { id: d.id, ...data };
// //           }
// //         });
// //         setSubMap(map);
// //       } catch (e) { console.error("Submission check:", e); }
// //       setLoadingSubs(false);
// //     };
// //     fetchSubs();
// //   }, [currentUser?.uid]);

// //   const withStatus = exams.map(e => ({ ...e, ws: getWindowStatus(e) }));
// //   const counts = {
// //     all:       withStatus.length,
// //     live:      withStatus.filter(e => e.ws === "live").length,
// //     upcoming:  withStatus.filter(e => e.ws === "upcoming").length,
// //     completed: withStatus.filter(e => e.ws === "completed" || e.ws === "missed").length,
// //   };
// //   const displayed = filter === "all" ? withStatus : filter === "completed"
// //     ? withStatus.filter(e => e.ws === "completed" || e.ws === "missed")
// //     : withStatus.filter(e => e.ws === filter);

// //   const liveExams = withStatus.filter(e => e.ws === "live" && !submissionMap[e.id]);

// //   // Guard: block re-entry for completed submissions
// //   const handleStart = async (examId, existingSubId) => {
// //     const sub = submissionMap[examId];
// //     if (sub?.status === "completed") {
// //       alert("You have already submitted this exam. Re-entry is not allowed.");
// //       return;
// //     }
// //     onStartExam(examId, existingSubId || sub?.id || null);
// //   };

// //   return (
// //     <div style={{ fontFamily: "system-ui, sans-serif" }} className="section-enter">
// //       <style>{`
// //         @keyframes livePulse { 0%,100%{opacity:1} 50%{opacity:.65} }
// //         @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
// //         .exam-card-enter { animation: fadeUp .3s ease both; }
// //       `}</style>

// //       {/* Header */}
// //       <div style={{ marginBottom: 24 }}>
// //         <h2 style={{ fontFamily: "'Trebuchet MS', system-ui", fontWeight: 900, fontSize: "1.75rem", color: T?.text || "#111827", letterSpacing: "-0.02em" }}>
// //           Examination Portal
// //         </h2>
// //         <p style={{ fontSize: 14, color: T?.textFaint || "#9ca3af", marginTop: 4 }}>
// //           Full-screen proctored mode · MCQ + Coding · One attempt per exam
// //         </p>
// //       </div>

// //       {/* Live alert */}
// //       {liveExams.length > 0 && (
// //         <div style={{
// //           background: dark ? "rgba(16,185,129,.08)" : "#f0fdf4",
// //           border: "1.5px solid rgba(16,185,129,.3)", borderRadius: 14,
// //           padding: "14px 20px", marginBottom: 20,
// //           display: "flex", alignItems: "center", gap: 14,
// //           animation: "fadeUp .3s ease",
// //         }}>
// //           <span style={{ fontSize: 22, animation: "livePulse 1.5s infinite" }}>🟢</span>
// //           <div>
// //             <div style={{ fontSize: 15, fontWeight: 800, color: "#10b981" }}>
// //               {liveExams.length} exam{liveExams.length > 1 ? "s are" : " is"} live right now!
// //             </div>
// //             <div style={{ fontSize: 13, color: T?.textFaint || "#6b7280", marginTop: 2 }}>
// //               Start immediately — the window is open.
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       {/* Filter tabs */}
// //       <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
// //         {["all", "live", "upcoming", "completed"].map(f => {
// //           const active = filter === f;
// //           const color  = f === "live" ? "#10b981" : f === "upcoming" ? "#f97316" : f === "completed" ? "#6b7280" : (dark ? "#8b949e" : "#374151");
// //           return (
// //             <button key={f} onClick={() => setFilter(f)}
// //               style={{
// //                 background: active ? (dark ? `${color}15` : `${color}12`) : (dark ? "#21262d" : "#f3f4f6"),
// //                 border: `1.5px solid ${active ? `${color}40` : (dark ? "#30363d" : "#e5e7eb")}`,
// //                 borderRadius: 10, padding: "7px 16px",
// //                 color: active ? color : (dark ? "#8b949e" : "#6b7280"),
// //                 fontSize: 13, fontWeight: active ? 800 : 500, cursor: "pointer",
// //                 fontFamily: "system-ui", transition: "all .15s",
// //               }}>
// //               {f === "live" && "● "}
// //               {f.charAt(0).toUpperCase() + f.slice(1)}
// //               <span style={{
// //                 marginLeft: 6, background: dark ? "#30363d" : "#e5e7eb",
// //                 color: dark ? "#8b949e" : "#6b7280",
// //                 padding: "1px 7px", borderRadius: 20, fontSize: 11,
// //                 fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
// //               }}>
// //                 {counts[f] ?? 0}
// //               </span>
// //             </button>
// //           );
// //         })}
// //       </div>

// //       {/* Cards */}
// //       {loadingSubs ? (
// //         <div style={{ textAlign: "center", padding: "3rem", color: T?.textFaint || "#9ca3af" }}>
// //           <div style={{ width: 32, height: 32, border: "3px solid #10b981", borderTopColor: "transparent", borderRadius: "50%", animation: "spin .8s linear infinite", margin: "0 auto 12px" }} />
// //           <style>{"@keyframes spin{to{transform:rotate(360deg)}}"}</style>
// //           Checking your submissions…
// //         </div>
// //       ) : displayed.length === 0 ? (
// //         <div style={{ textAlign: "center", padding: "3rem 2rem", border: `1.5px dashed ${dark ? "#30363d" : "#e5e7eb"}`, borderRadius: 16, color: T?.textFaint || "#9ca3af", fontSize: 15 }}>
// //           No {filter === "all" ? "" : filter} exams found.
// //         </div>
// //       ) : (
// //         <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
// //           {displayed.map((exam, i) => (
// //             <div key={exam.id} className="exam-card-enter" style={{ animationDelay: `${i * 60}ms` }}>
// //               <ExamCard
// //                 exam={exam}
// //                 submissionMap={submissionMap}
// //                 onStartExam={handleStart}
// //                 dark={dark}
// //               />
// //             </div>
// //           ))}
// //         </div>
// //       )}
// //     </div>
// //   );
// // } 


// // FILE PATH: src/components/student/ExamsView.jsx
// // CHANGES:
// // 1. Exam-type filter tabs: DAILY / WEEKLY / EXAM (plus "All")
// // 2. Status sub-tabs: all / live / upcoming / completed
// // 3. Details modal is triggered for EVERY exam start (no bypassing)
// // 4. One-attempt guard still enforced

// // import { useState, useEffect, useCallback } from "react";
// // import { collection, query, where, getDocs } from "firebase/firestore";
// // import { db } from "../../firebase/config";

// // // ── Helpers ───────────────────────────────────────────────────────────────────
// // function getWindowStatus(exam) {
// //   if (exam.status === "completed") return "completed";
// //   const start = exam.scheduledStartTime?.toDate?.() ?? new Date(exam.scheduledStartTime);
// //   const end   = new Date(start.getTime() + (exam.durationMinutes ?? 60) * 60 * 1000);
// //   const now   = new Date();
// //   if (now >= start && now <= end) return "live";
// //   if (now < start)               return "upcoming";
// //   return "missed";
// // }
// // function fmtDate(val) {
// //   const d = val?.toDate ? val.toDate() : new Date(val);
// //   return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
// // }
// // function fmtTime(val) {
// //   const d = val?.toDate ? val.toDate() : new Date(val);
// //   return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
// // }
// // function endTime(exam) {
// //   const s = exam.scheduledStartTime?.toDate?.() ?? new Date(exam.scheduledStartTime);
// //   return new Date(s.getTime() + (exam.durationMinutes ?? 60) * 60 * 1000);
// // }
// // function durationLabel(mins) {
// //   const h = Math.floor(mins / 60), m = mins % 60;
// //   return h > 0 ? `${h}h ${m > 0 ? m + "m" : ""}`.trim() : `${m}m`;
// // }

// // // ── Countdown hook ─────────────────────────────────────────────────────────────
// // function useCountdown(target) {
// //   const calc = useCallback(() => {
// //     if (!target) return null;
// //     const diff = (target instanceof Date ? target : new Date(target)) - new Date();
// //     if (diff <= 0) return null;
// //     return { h: Math.floor(diff / 3600000), m: Math.floor((diff % 3600000) / 60000), s: Math.floor((diff % 60000) / 1000) };
// //   }, [target]);
// //   const [cd, setCd] = useState(calc);
// //   useEffect(() => { const t = setInterval(() => setCd(calc()), 1000); return () => clearInterval(t); }, [calc]);
// //   return cd;
// // }

// // function CountdownBadge({ exam, ws }) {
// //   const end   = endTime(exam);
// //   const start = exam.scheduledStartTime?.toDate?.() ?? new Date(exam.scheduledStartTime);
// //   const cd    = useCountdown(ws === "live" ? end : start);
// //   if (!cd || (ws !== "live" && ws !== "upcoming")) return null;
// //   const color = ws === "live" ? "#10b981" : "#f97316";
// //   return (
// //     <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
// //       <span style={{ fontSize: 11, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.07em", fontFamily: "system-ui" }}>
// //         {ws === "live" ? "Ends in" : "Starts in"}
// //       </span>
// //       {[{ v: cd.h, u: "h" }, { v: cd.m, u: "m" }, { v: cd.s, u: "s" }].map(({ v, u }, i) => (
// //         <span key={i} style={{
// //           fontFamily: "'JetBrains Mono', 'Courier New', monospace", fontWeight: 800, fontSize: 13,
// //           background: `${color}15`, border: `1px solid ${color}35`, borderRadius: 7,
// //           padding: "3px 8px", color, minWidth: 34, textAlign: "center", letterSpacing: "0.02em",
// //           display: "inline-block",
// //         }}>
// //           {String(v).padStart(2, "0")}{u}
// //         </span>
// //       ))}
// //     </div>
// //   );
// // }

// // // ── Status config ─────────────────────────────────────────────────────────────
// // const STATUS_CFG = {
// //   live:      { color: "#10b981", bg: "#f0fdf4", border: "#bbf7d0", darkBg: "rgba(16,185,129,.1)",  darkBorder: "rgba(16,185,129,.25)", label: "Live Now",  dot: true  },
// //   upcoming:  { color: "#f97316", bg: "#fff7ed", border: "#fed7aa", darkBg: "rgba(249,115,22,.1)",  darkBorder: "rgba(249,115,22,.25)", label: "Upcoming",  dot: false },
// //   completed: { color: "#6b7280", bg: "#f9fafb", border: "#e5e7eb", darkBg: "rgba(107,114,128,.1)", darkBorder: "rgba(107,114,128,.2)", label: "Completed", dot: false },
// //   missed:    { color: "#ef4444", bg: "#fef2f2", border: "#fecaca", darkBg: "rgba(239,68,68,.1)",   darkBorder: "rgba(239,68,68,.2)",   label: "Missed",    dot: false },
// // };

// // // ── Exam-type config ──────────────────────────────────────────────────────────
// // const EXAM_TYPE_CFG = {
// //   ALL:    { label: "All Exams",    icon: "📋", color: "#6b7280" },
// //   DAILY:  { label: "Daily",        icon: "📅", color: "#10b981" },
// //   WEEKLY: { label: "Weekly",       icon: "📊", color: "#3b82f6" },
// //   EXAM:   { label: "Main Exam",    icon: "🎓", color: "#f97316" },
// // };

// // // ── Single Exam Card ──────────────────────────────────────────────────────────
// // function ExamCard({ exam, submissionMap, onStartExam, dark }) {
// //   const ws        = getWindowStatus(exam);
// //   const cfg       = STATUS_CFG[ws] || STATUS_CFG.upcoming;
// //   const start     = exam.scheduledStartTime?.toDate?.() ?? new Date(exam.scheduledStartTime);
// //   const end_      = endTime(exam);
// //   const totalMins = exam.durationMinutes ?? 60;
// //   const qCount    = exam.questionIds?.length ?? 0;

// //   const sub          = submissionMap[exam.id];
// //   const isAttempted  = sub?.status === "completed";
// //   const isInProgress = sub && sub.status !== "completed";

// //   // exam type badge
// //   const examType = exam.examType || "EXAM";
// //   const typeCfg  = EXAM_TYPE_CFG[examType] || EXAM_TYPE_CFG.EXAM;

// //   const borderColor = ws === "live" && !isAttempted
// //     ? (dark ? cfg.darkBorder : cfg.border)
// //     : (dark ? "#21262d" : "#e5e7eb");

// //   const bg = dark
// //     ? (ws === "live" && !isAttempted ? cfg.darkBg : "#161b22")
// //     : (ws === "live" && !isAttempted ? cfg.bg : "#ffffff");

// //   return (
// //     <div style={{
// //       background: bg, border: `1.5px solid ${borderColor}`, borderRadius: 16,
// //       overflow: "hidden", transition: "all .2s ease",
// //       boxShadow: ws === "live" && !isAttempted ? `0 0 0 3px ${cfg.color}18` : "none",
// //     }}>
// //       {ws === "live" && !isAttempted && (
// //         <div style={{ height: 3, background: `linear-gradient(90deg, ${cfg.color}, #3b82f6)` }} />
// //       )}
// //       <div style={{ padding: "20px 24px" }}>
// //         {/* Row 1: title + badges */}
// //         <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 14 }}>
// //           <div style={{ flex: 1 }}>
// //             <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
// //               <h3 style={{ fontSize: 16, fontWeight: 800, color: dark ? "#e6edf3" : "#111827", fontFamily: "'Trebuchet MS', system-ui, sans-serif", lineHeight: 1.3, margin: 0 }}>
// //                 {exam.title}
// //               </h3>
// //               {/* Exam type pill */}
// //               <span style={{
// //                 fontSize: 10, fontWeight: 800, padding: "2px 8px", borderRadius: 20,
// //                 background: `${typeCfg.color}18`, color: typeCfg.color,
// //                 border: `1px solid ${typeCfg.color}35`,
// //                 textTransform: "uppercase", letterSpacing: "0.07em", flexShrink: 0,
// //               }}>
// //                 {typeCfg.icon} {examType}
// //               </span>
// //             </div>
// //             {exam.description && (
// //               <p style={{ fontSize: 13, color: dark ? "#8b949e" : "#6b7280", lineHeight: 1.5, margin: 0 }}>
// //                 {exam.description.substring(0, 90)}{exam.description.length > 90 ? "…" : ""}
// //               </p>
// //             )}
// //           </div>
// //           <div style={{ flexShrink: 0 }}>
// //             {isAttempted ? (
// //               <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 800, padding: "4px 10px", borderRadius: 20, background: "rgba(107,114,128,.1)", color: "#6b7280", border: "1px solid rgba(107,114,128,.2)", textTransform: "uppercase", letterSpacing: "0.07em" }}>
// //                 ✓ Submitted
// //               </span>
// //             ) : (
// //               <span style={{
// //                 display: "flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 800,
// //                 padding: "4px 10px", borderRadius: 20,
// //                 background: dark ? cfg.darkBg : cfg.bg, color: cfg.color,
// //                 border: `1px solid ${dark ? cfg.darkBorder : cfg.border}`,
// //                 textTransform: "uppercase", letterSpacing: "0.07em",
// //                 animation: ws === "live" ? "livePulse 2s infinite" : "none",
// //               }}>
// //                 {cfg.dot && <span style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.color, flexShrink: 0 }} />}
// //                 {cfg.label}
// //               </span>
// //             )}
// //           </div>
// //         </div>

// //         {/* Row 2: meta pills */}
// //         <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
// //           {[
// //             exam.scheduledStartTime && { icon: "📅", val: fmtDate(start) },
// //             exam.scheduledStartTime && { icon: "🕗", val: `${fmtTime(start)} – ${fmtTime(end_)}` },
// //             { icon: "⏱", val: durationLabel(totalMins) },
// //             { icon: "❓", val: `${qCount} Q` },
// //           ].filter(Boolean).map(({ icon, val }, i) => (
// //             <span key={i} style={{
// //               display: "flex", alignItems: "center", gap: 4, fontSize: 12,
// //               color: dark ? "#8b949e" : "#6b7280",
// //               background: dark ? "#21262d" : "#f3f4f6",
// //               border: `1px solid ${dark ? "#30363d" : "#e5e7eb"}`,
// //               borderRadius: 8, padding: "3px 10px", fontFamily: "system-ui",
// //             }}>
// //               {icon} <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>{val}</span>
// //             </span>
// //           ))}
// //         </div>

// //         {/* Row 3: countdown + CTA */}
// //         <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
// //           <CountdownBadge exam={exam} ws={ws} />
// //           <div style={{ marginLeft: "auto" }}>
// //             {isAttempted ? (
// //               <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
// //                 {sub.totalScore != null && (
// //                   <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: 15, color: dark ? "#e6edf3" : "#111827" }}>
// //                     Score: <span style={{ color: "#10b981" }}>{sub.totalScore}</span>
// //                   </span>
// //                 )}
// //                 <button disabled style={{ background: dark ? "#21262d" : "#f3f4f6", border: `1px solid ${dark ? "#30363d" : "#e5e7eb"}`, borderRadius: 10, padding: "8px 18px", color: dark ? "#8b949e" : "#6b7280", fontSize: 13, fontWeight: 700, cursor: "not-allowed", fontFamily: "system-ui" }}>
// //                   🔒 Already Submitted
// //                 </button>
// //               </div>
// //             ) : isInProgress ? (
// //               <button onClick={() => onStartExam(exam.id, sub.id)}
// //                 style={{ background: "#f97316", border: "none", borderRadius: 10, padding: "9px 22px", color: "#fff", fontSize: 13, fontWeight: 800, cursor: "pointer", fontFamily: "system-ui", display: "flex", alignItems: "center", gap: 8, boxShadow: "0 4px 12px rgba(249,115,22,.3)" }}>
// //                 ▶ Resume Exam
// //               </button>
// //             ) : ws === "live" ? (
// //               <button onClick={() => onStartExam(exam.id, null)}
// //                 style={{ background: `linear-gradient(135deg, ${cfg.color}, #3b82f6)`, border: "none", borderRadius: 10, padding: "9px 22px", color: "#fff", fontSize: 13, fontWeight: 800, cursor: "pointer", fontFamily: "system-ui", display: "flex", alignItems: "center", gap: 8, boxShadow: `0 4px 14px ${cfg.color}40` }}>
// //                 ▶ Start Exam
// //               </button>
// //             ) : ws === "upcoming" ? (
// //               <button disabled style={{ background: dark ? "#21262d" : "#f3f4f6", border: `1px solid ${dark ? "#30363d" : "#e5e7eb"}`, borderRadius: 10, padding: "9px 22px", color: dark ? "#6b7280" : "#9ca3af", fontSize: 13, fontWeight: 700, cursor: "not-allowed", fontFamily: "system-ui" }}>
// //                 🔒 Not Yet Open
// //               </button>
// //             ) : (
// //               <span style={{ fontSize: 13, color: dark ? "#6b7280" : "#9ca3af", fontWeight: 600 }}>
// //                 {ws === "missed" ? "⛔ Window Closed" : "✓ Ended"}
// //               </span>
// //             )}
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // // ── Main ExamsView ─────────────────────────────────────────────────────────────
// // export default function ExamsView({ exams, currentUser, onStartExam, T }) {
// //   const [examTypeFilter, setExamTypeFilter] = useState("ALL");
// //   const [statusFilter,   setStatusFilter]   = useState("all");
// //   const [submissionMap,  setSubMap]         = useState({});
// //   const [loadingSubs,    setLoadingSubs]     = useState(true);

// //   const dark = T?.bg === "#0d1117" || (T?.bg || "").startsWith("#0");

// //   // Fetch existing submissions for this student
// //   useEffect(() => {
// //     if (!currentUser?.uid) { setLoadingSubs(false); return; }
// //     const fetchSubs = async () => {
// //       setLoadingSubs(true);
// //       try {
// //         const q    = query(collection(db, "submissions"), where("studentId", "==", currentUser.uid));
// //         const snap = await getDocs(q);
// //         const map  = {};
// //         snap.docs.forEach(d => {
// //           const data = d.data();
// //           if (!data.examId) return;
// //           const existing = map[data.examId];
// //           if (!existing || data.status === "completed" || !existing.status) {
// //             map[data.examId] = { id: d.id, ...data };
// //           }
// //         });
// //         setSubMap(map);
// //       } catch (e) { console.error("Submission check:", e); }
// //       setLoadingSubs(false);
// //     };
// //     fetchSubs();
// //   }, [currentUser?.uid]);

// //   // ── Step 1: filter by exam type ───────────────────────────────────────────
// //   const typeFiltered = examTypeFilter === "ALL"
// //     ? exams
// //     : exams.filter(e => (e.examType || "EXAM") === examTypeFilter);

// //   // ── Step 2: enrich with window status ────────────────────────────────────
// //   const withStatus = typeFiltered.map(e => ({ ...e, ws: getWindowStatus(e) }));

// //   // ── Step 3: counts for status sub-tabs ───────────────────────────────────
// //   const counts = {
// //     all:       withStatus.length,
// //     live:      withStatus.filter(e => e.ws === "live").length,
// //     upcoming:  withStatus.filter(e => e.ws === "upcoming").length,
// //     completed: withStatus.filter(e => e.ws === "completed" || e.ws === "missed").length,
// //   };

// //   // ── Step 4: filter by status ──────────────────────────────────────────────
// //   const displayed = statusFilter === "all" ? withStatus
// //     : statusFilter === "completed"
// //       ? withStatus.filter(e => e.ws === "completed" || e.ws === "missed")
// //       : withStatus.filter(e => e.ws === statusFilter);

// //   const liveExams = withStatus.filter(e => e.ws === "live" && !submissionMap[e.id]);

// //   // ── Exam type tab counts ──────────────────────────────────────────────────
// //   const typeCounts = {
// //     ALL:    exams.length,
// //     DAILY:  exams.filter(e => (e.examType || "EXAM") === "DAILY").length,
// //     WEEKLY: exams.filter(e => (e.examType || "EXAM") === "WEEKLY").length,
// //     EXAM:   exams.filter(e => (e.examType || "EXAM") === "EXAM").length,
// //   };

// //   // Guard: block re-entry for completed, always call onStartExam
// //   // (the parent StudentDashboard will show the ExamDetailsForm modal)
// //   const handleStart = (examId, existingSubId) => {
// //     const sub = submissionMap[examId];
// //     if (sub?.status === "completed") {
// //       alert("You have already submitted this exam. Re-entry is not allowed.");
// //       return;
// //     }
// //     // Always pass through — dashboard will show details modal for new starts
// //     onStartExam(examId, existingSubId || sub?.id || null);
// //   };

// //   return (
// //     <div style={{ fontFamily: "system-ui, sans-serif" }} className="section-enter">
// //       <style>{`
// //         @keyframes livePulse { 0%,100%{opacity:1} 50%{opacity:.65} }
// //         @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
// //         .exam-card-enter { animation: fadeUp .3s ease both; }
// //       `}</style>

// //       {/* ── Header ── */}
// //       <div style={{ marginBottom: 24 }}>
// //         <h2 style={{ fontFamily: "'Trebuchet MS', system-ui", fontWeight: 900, fontSize: "1.75rem", color: T?.text || "#111827", letterSpacing: "-0.02em" }}>
// //           Examination Portal
// //         </h2>
// //         <p style={{ fontSize: 14, color: T?.textFaint || "#9ca3af", marginTop: 4 }}>
// //           Full-screen proctored mode · MCQ + Coding · One attempt per exam
// //         </p>
// //       </div>

// //       {/* ── Live alert ── */}
// //       {liveExams.length > 0 && (
// //         <div style={{
// //           background: dark ? "rgba(16,185,129,.08)" : "#f0fdf4",
// //           border: "1.5px solid rgba(16,185,129,.3)", borderRadius: 14,
// //           padding: "14px 20px", marginBottom: 20,
// //           display: "flex", alignItems: "center", gap: 14,
// //           animation: "fadeUp .3s ease",
// //         }}>
// //           <span style={{ fontSize: 22, animation: "livePulse 1.5s infinite" }}>🟢</span>
// //           <div>
// //             <div style={{ fontSize: 15, fontWeight: 800, color: "#10b981" }}>
// //               {liveExams.length} exam{liveExams.length > 1 ? "s are" : " is"} live right now!
// //             </div>
// //             <div style={{ fontSize: 13, color: T?.textFaint || "#6b7280", marginTop: 2 }}>
// //               Start immediately — the window is open.
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       {/* ── Exam Type Filter (primary tabs) ── */}
// //       <div style={{ marginBottom: 16 }}>
// //         <p style={{ fontSize: 11, fontWeight: 700, color: T?.textFaint || "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
// //           Category
// //         </p>
// //         <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
// //           {Object.entries(EXAM_TYPE_CFG).map(([key, cfg]) => {
// //             const active = examTypeFilter === key;
// //             return (
// //               <button
// //                 key={key}
// //                 onClick={() => { setExamTypeFilter(key); setStatusFilter("all"); }}
// //                 style={{
// //                   display: "flex", alignItems: "center", gap: 6,
// //                   background: active
// //                     ? (key === "ALL" ? (dark ? "#30363d" : "#374151") : `${cfg.color}18`)
// //                     : (dark ? "#21262d" : "#f3f4f6"),
// //                   border: `1.5px solid ${active
// //                     ? (key === "ALL" ? (dark ? "#555" : "#374151") : `${cfg.color}45`)
// //                     : (dark ? "#30363d" : "#e5e7eb")}`,
// //                   borderRadius: 10, padding: "8px 16px",
// //                   color: active
// //                     ? (key === "ALL" ? "#fff" : cfg.color)
// //                     : (dark ? "#8b949e" : "#6b7280"),
// //                   fontSize: 13, fontWeight: active ? 800 : 500, cursor: "pointer",
// //                   fontFamily: "system-ui", transition: "all .15s",
// //                 }}
// //               >
// //                 <span>{cfg.icon}</span>
// //                 <span>{cfg.label}</span>
// //                 <span style={{
// //                   background: dark ? "#30363d" : "#e5e7eb",
// //                   color: dark ? "#8b949e" : "#6b7280",
// //                   padding: "1px 7px", borderRadius: 20, fontSize: 11,
// //                   fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
// //                 }}>
// //                   {typeCounts[key]}
// //                 </span>
// //               </button>
// //             );
// //           })}
// //         </div>
// //       </div>

// //       {/* ── Status Sub-tabs ── */}
// //       <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
// //         {["all", "live", "upcoming", "completed"].map(f => {
// //           const active = statusFilter === f;
// //           const color  = f === "live" ? "#10b981" : f === "upcoming" ? "#f97316" : f === "completed" ? "#6b7280" : (dark ? "#8b949e" : "#374151");
// //           return (
// //             <button key={f} onClick={() => setStatusFilter(f)}
// //               style={{
// //                 background: active ? (dark ? `${color}15` : `${color}12`) : (dark ? "#21262d" : "#f3f4f6"),
// //                 border: `1.5px solid ${active ? `${color}40` : (dark ? "#30363d" : "#e5e7eb")}`,
// //                 borderRadius: 10, padding: "6px 14px",
// //                 color: active ? color : (dark ? "#8b949e" : "#6b7280"),
// //                 fontSize: 12, fontWeight: active ? 800 : 500, cursor: "pointer",
// //                 fontFamily: "system-ui", transition: "all .15s",
// //               }}>
// //               {f === "live" && "● "}
// //               {f.charAt(0).toUpperCase() + f.slice(1)}
// //               <span style={{
// //                 marginLeft: 6, background: dark ? "#30363d" : "#e5e7eb",
// //                 color: dark ? "#8b949e" : "#6b7280",
// //                 padding: "1px 7px", borderRadius: 20, fontSize: 11,
// //                 fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
// //               }}>
// //                 {counts[f] ?? 0}
// //               </span>
// //             </button>
// //           );
// //         })}
// //       </div>

// //       {/* ── Cards ── */}
// //       {loadingSubs ? (
// //         <div style={{ textAlign: "center", padding: "3rem", color: T?.textFaint || "#9ca3af" }}>
// //           <div style={{ width: 32, height: 32, border: "3px solid #10b981", borderTopColor: "transparent", borderRadius: "50%", animation: "spin .8s linear infinite", margin: "0 auto 12px" }} />
// //           <style>{"@keyframes spin{to{transform:rotate(360deg)}}"}</style>
// //           Checking your submissions…
// //         </div>
// //       ) : displayed.length === 0 ? (
// //         <div style={{ textAlign: "center", padding: "3rem 2rem", border: `1.5px dashed ${dark ? "#30363d" : "#e5e7eb"}`, borderRadius: 16, color: T?.textFaint || "#9ca3af", fontSize: 15 }}>
// //           No {examTypeFilter !== "ALL" ? EXAM_TYPE_CFG[examTypeFilter].label + " " : ""}
// //           {statusFilter === "all" ? "" : statusFilter + " "}exams found.
// //         </div>
// //       ) : (
// //         <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
// //           {displayed.map((exam, i) => (
// //             <div key={exam.id} className="exam-card-enter" style={{ animationDelay: `${i * 60}ms` }}>
// //               <ExamCard
// //                 exam={exam}
// //                 submissionMap={submissionMap}
// //                 onStartExam={handleStart}
// //                 dark={dark}
// //               />
// //             </div>
// //           ))}
// //         </div>
// //       )}
// //     </div>
// //   );
// // } 


// // import { useState, useEffect, useCallback } from "react";
// // import { collection, query, where, getDocs } from "firebase/firestore";
// // import { db } from "../../firebase/config";

// // function getWindowStatus(exam) {
// //   if (exam.status === "completed") return "completed";
// //   const start = exam.scheduledStartTime?.toDate?.() ?? new Date(exam.scheduledStartTime);
// //   const end   = new Date(start.getTime() + (exam.durationMinutes ?? 60) * 60 * 1000);
// //   const now   = new Date();
// //   if (now >= start && now <= end) return "live";
// //   if (now < start)               return "upcoming";
// //   return "missed";
// // }
// // function fmtDate(val) {
// //   const d = val?.toDate ? val.toDate() : new Date(val);
// //   return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
// // }
// // function fmtTime(val) {
// //   const d = val?.toDate ? val.toDate() : new Date(val);
// //   return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
// // }
// // function endTime(exam) {
// //   const s = exam.scheduledStartTime?.toDate?.() ?? new Date(exam.scheduledStartTime);
// //   return new Date(s.getTime() + (exam.durationMinutes ?? 60) * 60 * 1000);
// // }
// // function durationLabel(mins) {
// //   const h = Math.floor(mins / 60), m = mins % 60;
// //   return h > 0 ? `${h}h ${m > 0 ? m + "m" : ""}`.trim() : `${m}m`;
// // }

// // function useCountdown(target) {
// //   const calc = useCallback(() => {
// //     if (!target) return null;
// //     const diff = (target instanceof Date ? target : new Date(target)) - new Date();
// //     if (diff <= 0) return null;
// //     return { h: Math.floor(diff / 3600000), m: Math.floor((diff % 3600000) / 60000), s: Math.floor((diff % 60000) / 1000) };
// //   }, [target]);
// //   const [cd, setCd] = useState(calc);
// //   useEffect(() => { const t = setInterval(() => setCd(calc()), 1000); return () => clearInterval(t); }, [calc]);
// //   return cd;
// // }

// // function CountdownBadge({ exam, ws }) {
// //   const end_  = endTime(exam);
// //   const start = exam.scheduledStartTime?.toDate?.() ?? new Date(exam.scheduledStartTime);
// //   const cd    = useCountdown(ws === "live" ? end_ : start);
// //   if (!cd || (ws !== "live" && ws !== "upcoming")) return null;
// //   const color = ws === "live" ? "#10b981" : "#f97316";
// //   return (
// //     <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
// //       <span style={{ fontSize: 11, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.07em", fontFamily: "system-ui" }}>
// //         {ws === "live" ? "Ends in" : "Starts in"}
// //       </span>
// //       {[{ v: cd.h, u: "h" }, { v: cd.m, u: "m" }, { v: cd.s, u: "s" }].map(({ v, u }, i) => (
// //         <span key={i} style={{
// //           fontFamily: "'JetBrains Mono', 'Courier New', monospace", fontWeight: 800, fontSize: 13,
// //           background: `${color}15`, border: `1px solid ${color}35`, borderRadius: 7,
// //           padding: "3px 8px", color, minWidth: 34, textAlign: "center", letterSpacing: "0.02em",
// //           display: "inline-block",
// //         }}>
// //           {String(v).padStart(2, "0")}{u}
// //         </span>
// //       ))}
// //     </div>
// //   );
// // }

// // // ── Animated Score Card ────────────────────────────────────────────────────────
// // function ScoreCard({ sub, dark }) {
// //   const score    = sub.totalScore ?? sub.score ?? 0;
// //   const total    = sub.totalQuestions ?? sub.questionCount ?? null;
// //   const pct      = total ? Math.round((score / total) * 100) : null;
// //   const color    = pct === null ? "#10b981" : pct >= 75 ? "#10b981" : pct >= 50 ? "#f97316" : "#ef4444";
// //   const dashVal  = pct ?? 75;
// //   const circumference = 2 * Math.PI * 15.9;

// //   return (
// //     <div style={{
// //       display: "flex", alignItems: "center", gap: 14,
// //       background: dark ? `${color}10` : `${color}08`,
// //       border: `1.5px solid ${color}30`, borderRadius: 14,
// //       padding: "12px 18px",
// //       animation: "scoreReveal 0.55s cubic-bezier(0.34,1.56,0.64,1) both",
// //     }}>
// //       {/* Ring */}
// //       <div style={{ position: "relative", width: 52, height: 52, flexShrink: 0 }}>
// //         <svg viewBox="0 0 36 36" style={{ width: 52, height: 52, transform: "rotate(-90deg)" }}>
// //           <circle cx="18" cy="18" r="15.9" fill="none"
// //             stroke={dark ? "#30363d" : "#e5e7eb"} strokeWidth="2.5" />
// //           <circle cx="18" cy="18" r="15.9" fill="none"
// //             stroke={color} strokeWidth="2.5"
// //             strokeDasharray={`${(dashVal / 100) * circumference} ${circumference}`}
// //             strokeLinecap="round"
// //             style={{ animation: "dashDraw 1.1s cubic-bezier(0.4,0,0.2,1) both 0.25s", transition: "stroke-dasharray 1s ease" }}
// //           />
// //         </svg>
// //         <div style={{
// //           position: "absolute", inset: 0,
// //           display: "flex", alignItems: "center", justifyContent: "center",
// //           flexDirection: "column",
// //         }}>
// //           {pct !== null ? (
// //             <span style={{ fontSize: 10, fontWeight: 900, color, fontFamily: "'JetBrains Mono', monospace", lineHeight: 1 }}>{pct}%</span>
// //           ) : (
// //             <span style={{ fontSize: 14, fontWeight: 900, color, fontFamily: "'JetBrains Mono', monospace" }}>✓</span>
// //           )}
// //         </div>
// //       </div>

// //       {/* Score text */}
// //       <div style={{ animation: "scoreTextIn 0.4s ease both 0.15s" }}>
// //         <div style={{ fontSize: 11, fontWeight: 700, color: dark ? "#6b7280" : "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 3 }}>
// //           Your Score
// //         </div>
// //         <div style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 900, fontSize: 22, color, lineHeight: 1 }}>
// //           {score}
// //           {total && <span style={{ fontSize: 13, fontWeight: 500, color: dark ? "#6b7280" : "#9ca3af" }}> / {total}</span>}
// //         </div>
// //         <div style={{ fontSize: 11, color: dark ? "#6b7280" : "#9ca3af", marginTop: 3, fontWeight: 500 }}>
// //           {pct !== null
// //             ? pct >= 75 ? "🎉 Excellent!" : pct >= 50 ? "👍 Good work" : "📚 Keep going"
// //             : "✅ Submitted"}
// //         </div>
// //       </div>

// //       {/* Submitted badge */}
// //       <div style={{ marginLeft: "auto" }}>
// //         <button disabled style={{
// //           background: dark ? "#21262d" : "#f3f4f6",
// //           border: `1px solid ${dark ? "#30363d" : "#e5e7eb"}`,
// //           borderRadius: 10, padding: "7px 13px",
// //           color: dark ? "#8b949e" : "#6b7280",
// //           fontSize: 12, fontWeight: 700, cursor: "not-allowed", fontFamily: "system-ui",
// //           display: "flex", alignItems: "center", gap: 5,
// //         }}>
// //           🔒 Submitted
// //         </button>
// //       </div>
// //     </div>
// //   );
// // }

// // const STATUS_CFG = {
// //   live:      { color: "#10b981", bg: "#f0fdf4", border: "#bbf7d0", darkBg: "rgba(16,185,129,.1)",  darkBorder: "rgba(16,185,129,.25)", label: "Live Now",  dot: true  },
// //   upcoming:  { color: "#f97316", bg: "#fff7ed", border: "#fed7aa", darkBg: "rgba(249,115,22,.1)",  darkBorder: "rgba(249,115,22,.25)", label: "Upcoming",  dot: false },
// //   completed: { color: "#6b7280", bg: "#f9fafb", border: "#e5e7eb", darkBg: "rgba(107,114,128,.1)", darkBorder: "rgba(107,114,128,.2)", label: "Completed", dot: false },
// //   missed:    { color: "#ef4444", bg: "#fef2f2", border: "#fecaca", darkBg: "rgba(239,68,68,.1)",   darkBorder: "rgba(239,68,68,.2)",   label: "Missed",    dot: false },
// // };

// // const EXAM_TYPE_CFG = {
// //   ALL:    { label: "All Exams",  icon: "📋", color: "#6b7280" },
// //   DAILY:  { label: "Daily",      icon: "📅", color: "#10b981" },
// //   WEEKLY: { label: "Weekly",     icon: "📊", color: "#3b82f6" },
// //   EXAM:   { label: "Main Exam",  icon: "🎓", color: "#f97316" },
// // };

// // function ExamCard({ exam, submissionMap, onStartExam, dark }) {
// //   const ws        = getWindowStatus(exam);
// //   const cfg       = STATUS_CFG[ws] || STATUS_CFG.upcoming;
// //   const start     = exam.scheduledStartTime?.toDate?.() ?? new Date(exam.scheduledStartTime);
// //   const end_      = endTime(exam);
// //   const totalMins = exam.durationMinutes ?? 60;
// //   const qCount    = exam.questionIds?.length ?? 0;

// //   const sub          = submissionMap[exam.id];
// //   const isAttempted  = sub?.status === "completed";
// //   const isInProgress = sub && sub.status !== "completed";

// //   const examType = exam.examType || "EXAM";
// //   const typeCfg  = EXAM_TYPE_CFG[examType] || EXAM_TYPE_CFG.EXAM;

// //   const borderColor = ws === "live" && !isAttempted
// //     ? (dark ? cfg.darkBorder : cfg.border)
// //     : (dark ? "#21262d" : "#e5e7eb");

// //   const bg = dark
// //     ? (ws === "live" && !isAttempted ? cfg.darkBg : "#161b22")
// //     : (ws === "live" && !isAttempted ? cfg.bg : "#ffffff");

// //   return (
// //     <div style={{
// //       background: bg, border: `1.5px solid ${borderColor}`, borderRadius: 16,
// //       overflow: "hidden", transition: "all .2s ease",
// //       boxShadow: ws === "live" && !isAttempted ? `0 0 0 3px ${cfg.color}18` : "none",
// //     }}>
// //       {ws === "live" && !isAttempted && (
// //         <div style={{ height: 3, background: `linear-gradient(90deg, ${cfg.color}, #3b82f6)` }} />
// //       )}
// //       <div style={{ padding: "20px 24px" }}>

// //         {/* Row 1: title + badges */}
// //         <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 14 }}>
// //           <div style={{ flex: 1 }}>
// //             <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
// //               <h3 style={{ fontSize: 16, fontWeight: 800, color: dark ? "#e6edf3" : "#111827", fontFamily: "'Trebuchet MS', system-ui, sans-serif", lineHeight: 1.3, margin: 0 }}>
// //                 {exam.title}
// //               </h3>
// //               <span style={{
// //                 fontSize: 10, fontWeight: 800, padding: "2px 8px", borderRadius: 20,
// //                 background: `${typeCfg.color}18`, color: typeCfg.color,
// //                 border: `1px solid ${typeCfg.color}35`,
// //                 textTransform: "uppercase", letterSpacing: "0.07em", flexShrink: 0,
// //               }}>
// //                 {typeCfg.icon} {examType}
// //               </span>
// //             </div>
// //             {exam.description && (
// //               <p style={{ fontSize: 13, color: dark ? "#8b949e" : "#6b7280", lineHeight: 1.5, margin: 0 }}>
// //                 {exam.description.substring(0, 90)}{exam.description.length > 90 ? "…" : ""}
// //               </p>
// //             )}
// //           </div>
// //           <div style={{ flexShrink: 0 }}>
// //             {isAttempted ? (
// //               <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 800, padding: "4px 10px", borderRadius: 20, background: "rgba(107,114,128,.1)", color: "#6b7280", border: "1px solid rgba(107,114,128,.2)", textTransform: "uppercase", letterSpacing: "0.07em" }}>
// //                 ✓ Submitted
// //               </span>
// //             ) : (
// //               <span style={{
// //                 display: "flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 800,
// //                 padding: "4px 10px", borderRadius: 20,
// //                 background: dark ? cfg.darkBg : cfg.bg, color: cfg.color,
// //                 border: `1px solid ${dark ? cfg.darkBorder : cfg.border}`,
// //                 textTransform: "uppercase", letterSpacing: "0.07em",
// //                 animation: ws === "live" ? "livePulse 2s infinite" : "none",
// //               }}>
// //                 {cfg.dot && <span style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.color, flexShrink: 0 }} />}
// //                 {cfg.label}
// //               </span>
// //             )}
// //           </div>
// //         </div>

// //         {/* Row 2: meta pills */}
// //         <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
// //           {[
// //             exam.scheduledStartTime && { icon: "📅", val: fmtDate(start) },
// //             exam.scheduledStartTime && { icon: "🕗", val: `${fmtTime(start)} – ${fmtTime(end_)}` },
// //             { icon: "⏱", val: durationLabel(totalMins) },
// //             { icon: "❓", val: `${qCount} Q` },
// //           ].filter(Boolean).map(({ icon, val }, i) => (
// //             <span key={i} style={{
// //               display: "flex", alignItems: "center", gap: 4, fontSize: 12,
// //               color: dark ? "#8b949e" : "#6b7280",
// //               background: dark ? "#21262d" : "#f3f4f6",
// //               border: `1px solid ${dark ? "#30363d" : "#e5e7eb"}`,
// //               borderRadius: 8, padding: "3px 10px", fontFamily: "system-ui",
// //             }}>
// //               {icon} <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>{val}</span>
// //             </span>
// //           ))}
// //         </div>

// //         {/* Row 3: score card OR countdown + CTA */}
// //         {isAttempted ? (
// //           <ScoreCard sub={sub} dark={dark} />
// //         ) : (
// //           <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
// //             <CountdownBadge exam={exam} ws={ws} />
// //             <div style={{ marginLeft: "auto" }}>
// //               {isInProgress ? (
// //                 <button onClick={() => onStartExam(exam.id, sub.id)}
// //                   style={{ background: "#f97316", border: "none", borderRadius: 10, padding: "9px 22px", color: "#fff", fontSize: 13, fontWeight: 800, cursor: "pointer", fontFamily: "system-ui", display: "flex", alignItems: "center", gap: 8, boxShadow: "0 4px 12px rgba(249,115,22,.3)" }}>
// //                   ▶ Resume Exam
// //                 </button>
// //               ) : ws === "live" ? (
// //                 <button onClick={() => onStartExam(exam.id, null)}
// //                   style={{ background: `linear-gradient(135deg, ${cfg.color}, #3b82f6)`, border: "none", borderRadius: 10, padding: "9px 22px", color: "#fff", fontSize: 13, fontWeight: 800, cursor: "pointer", fontFamily: "system-ui", display: "flex", alignItems: "center", gap: 8, boxShadow: `0 4px 14px ${cfg.color}40` }}>
// //                   ▶ Start Exam
// //                 </button>
// //               ) : ws === "upcoming" ? (
// //                 <button disabled style={{ background: dark ? "#21262d" : "#f3f4f6", border: `1px solid ${dark ? "#30363d" : "#e5e7eb"}`, borderRadius: 10, padding: "9px 22px", color: dark ? "#6b7280" : "#9ca3af", fontSize: 13, fontWeight: 700, cursor: "not-allowed", fontFamily: "system-ui" }}>
// //                   🔒 Not Yet Open
// //                 </button>
// //               ) : (
// //                 <span style={{ fontSize: 13, color: dark ? "#6b7280" : "#9ca3af", fontWeight: 600 }}>
// //                   {ws === "missed" ? "⛔ Window Closed" : "✓ Ended"}
// //                 </span>
// //               )}
// //             </div>
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }

// // export default function ExamsView({ exams, currentUser, onStartExam, T }) {
// //   const [examTypeFilter, setExamTypeFilter] = useState("ALL");
// //   const [statusFilter,   setStatusFilter]   = useState("all");
// //   const [submissionMap,  setSubMap]         = useState({});
// //   const [loadingSubs,    setLoadingSubs]     = useState(true);

// //   const dark = T?.bg === "#0d1117" || (T?.bg || "").startsWith("#0");

// //   useEffect(() => {
// //     if (!currentUser?.uid) { setLoadingSubs(false); return; }
// //     const fetchSubs = async () => {
// //       setLoadingSubs(true);
// //       try {
// //         const q    = query(collection(db, "submissions"), where("studentId", "==", currentUser.uid));
// //         const snap = await getDocs(q);
// //         const map  = {};
// //         snap.docs.forEach(d => {
// //           const data = d.data();
// //           if (!data.examId) return;
// //           const existing = map[data.examId];
// //           if (!existing || data.status === "completed" || !existing.status) {
// //             map[data.examId] = { id: d.id, ...data };
// //           }
// //         });
// //         setSubMap(map);
// //       } catch (e) { console.error("Submission check:", e); }
// //       setLoadingSubs(false);
// //     };
// //     fetchSubs();
// //   }, [currentUser?.uid]);

// //   const typeFiltered = examTypeFilter === "ALL"
// //     ? exams
// //     : exams.filter(e => (e.examType || "EXAM") === examTypeFilter);

// //   const withStatus = typeFiltered.map(e => ({ ...e, ws: getWindowStatus(e) }));

// //   const counts = {
// //     all:       withStatus.length,
// //     live:      withStatus.filter(e => e.ws === "live").length,
// //     upcoming:  withStatus.filter(e => e.ws === "upcoming").length,
// //     completed: withStatus.filter(e => e.ws === "completed" || e.ws === "missed").length,
// //   };

// //   const displayed = statusFilter === "all" ? withStatus
// //     : statusFilter === "completed"
// //       ? withStatus.filter(e => e.ws === "completed" || e.ws === "missed")
// //       : withStatus.filter(e => e.ws === statusFilter);

// //   const liveExams = withStatus.filter(e => e.ws === "live" && !submissionMap[e.id]);

// //   const typeCounts = {
// //     ALL:    exams.length,
// //     DAILY:  exams.filter(e => (e.examType || "EXAM") === "DAILY").length,
// //     WEEKLY: exams.filter(e => (e.examType || "EXAM") === "WEEKLY").length,
// //     EXAM:   exams.filter(e => (e.examType || "EXAM") === "EXAM").length,
// //   };

// //   const handleStart = (examId, existingSubId) => {
// //     const sub = submissionMap[examId];
// //     if (sub?.status === "completed") {
// //       alert("You have already submitted this exam. Re-entry is not allowed.");
// //       return;
// //     }
// //     onStartExam(examId, existingSubId || sub?.id || null);
// //   };

// //   return (
// //     <div style={{ fontFamily: "system-ui, sans-serif" }} className="section-enter">
// //       <style>{`
// //         @keyframes livePulse    { 0%,100%{opacity:1} 50%{opacity:.65} }
// //         @keyframes fadeUp       { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
// //         @keyframes spin         { to{transform:rotate(360deg)} }
// //         @keyframes scoreReveal  { from{opacity:0;transform:scale(0.88) translateY(8px)} to{opacity:1;transform:scale(1) translateY(0)} }
// //         @keyframes dashDraw     { from{stroke-dasharray:0 100} }
// //         @keyframes scoreTextIn  { from{opacity:0;transform:translateX(-8px)} to{opacity:1;transform:translateX(0)} }
// //         .exam-card-enter        { animation: fadeUp .3s ease both; }
// //       `}</style>

// //       {/* Header */}
// //       <div style={{ marginBottom: 24 }}>
// //         <h2 style={{ fontFamily: "'Trebuchet MS', system-ui", fontWeight: 900, fontSize: "1.75rem", color: T?.text || "#111827", letterSpacing: "-0.02em" }}>
// //           Examination Portal
// //         </h2>
// //         <p style={{ fontSize: 14, color: T?.textFaint || "#9ca3af", marginTop: 4 }}>
// //           Full-screen proctored mode · MCQ + Coding · One attempt per exam
// //         </p>
// //       </div>

// //       {/* Live alert */}
// //       {liveExams.length > 0 && (
// //         <div style={{
// //           background: dark ? "rgba(16,185,129,.08)" : "#f0fdf4",
// //           border: "1.5px solid rgba(16,185,129,.3)", borderRadius: 14,
// //           padding: "14px 20px", marginBottom: 20,
// //           display: "flex", alignItems: "center", gap: 14,
// //           animation: "fadeUp .3s ease",
// //         }}>
// //           <span style={{ fontSize: 22, animation: "livePulse 1.5s infinite" }}>🟢</span>
// //           <div>
// //             <div style={{ fontSize: 15, fontWeight: 800, color: "#10b981" }}>
// //               {liveExams.length} exam{liveExams.length > 1 ? "s are" : " is"} live right now!
// //             </div>
// //             <div style={{ fontSize: 13, color: T?.textFaint || "#6b7280", marginTop: 2 }}>
// //               Start immediately — the window is open.
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       {/* Exam Type Filter */}
// //       <div style={{ marginBottom: 16 }}>
// //         <p style={{ fontSize: 11, fontWeight: 700, color: T?.textFaint || "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
// //           Category
// //         </p>
// //         <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
// //           {Object.entries(EXAM_TYPE_CFG).map(([key, cfg]) => {
// //             const active = examTypeFilter === key;
// //             return (
// //               <button key={key} onClick={() => { setExamTypeFilter(key); setStatusFilter("all"); }}
// //                 style={{
// //                   display: "flex", alignItems: "center", gap: 6,
// //                   background: active
// //                     ? (key === "ALL" ? (dark ? "#30363d" : "#374151") : `${cfg.color}18`)
// //                     : (dark ? "#21262d" : "#f3f4f6"),
// //                   border: `1.5px solid ${active
// //                     ? (key === "ALL" ? (dark ? "#555" : "#374151") : `${cfg.color}45`)
// //                     : (dark ? "#30363d" : "#e5e7eb")}`,
// //                   borderRadius: 10, padding: "8px 16px",
// //                   color: active ? (key === "ALL" ? "#fff" : cfg.color) : (dark ? "#8b949e" : "#6b7280"),
// //                   fontSize: 13, fontWeight: active ? 800 : 500, cursor: "pointer",
// //                   fontFamily: "system-ui", transition: "all .15s",
// //                 }}>
// //                 <span>{cfg.icon}</span>
// //                 <span>{cfg.label}</span>
// //                 <span style={{ background: dark ? "#30363d" : "#e5e7eb", color: dark ? "#8b949e" : "#6b7280", padding: "1px 7px", borderRadius: 20, fontSize: 11, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>
// //                   {typeCounts[key]}
// //                 </span>
// //               </button>
// //             );
// //           })}
// //         </div>
// //       </div>

// //       {/* Status Sub-tabs */}
// //       <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
// //         {["all", "live", "upcoming", "completed"].map(f => {
// //           const active = statusFilter === f;
// //           const color  = f === "live" ? "#10b981" : f === "upcoming" ? "#f97316" : f === "completed" ? "#6b7280" : (dark ? "#8b949e" : "#374151");
// //           return (
// //             <button key={f} onClick={() => setStatusFilter(f)}
// //               style={{
// //                 background: active ? (dark ? `${color}15` : `${color}12`) : (dark ? "#21262d" : "#f3f4f6"),
// //                 border: `1.5px solid ${active ? `${color}40` : (dark ? "#30363d" : "#e5e7eb")}`,
// //                 borderRadius: 10, padding: "6px 14px",
// //                 color: active ? color : (dark ? "#8b949e" : "#6b7280"),
// //                 fontSize: 12, fontWeight: active ? 800 : 500, cursor: "pointer",
// //                 fontFamily: "system-ui", transition: "all .15s",
// //               }}>
// //               {f === "live" && "● "}
// //               {f.charAt(0).toUpperCase() + f.slice(1)}
// //               <span style={{ marginLeft: 6, background: dark ? "#30363d" : "#e5e7eb", color: dark ? "#8b949e" : "#6b7280", padding: "1px 7px", borderRadius: 20, fontSize: 11, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>
// //                 {counts[f] ?? 0}
// //               </span>
// //             </button>
// //           );
// //         })}
// //       </div>

// //       {/* Cards */}
// //       {loadingSubs ? (
// //         <div style={{ textAlign: "center", padding: "3rem", color: T?.textFaint || "#9ca3af" }}>
// //           <div style={{ width: 32, height: 32, border: "3px solid #10b981", borderTopColor: "transparent", borderRadius: "50%", animation: "spin .8s linear infinite", margin: "0 auto 12px" }} />
// //           Checking your submissions…
// //         </div>
// //       ) : displayed.length === 0 ? (
// //         <div style={{ textAlign: "center", padding: "3rem 2rem", border: `1.5px dashed ${dark ? "#30363d" : "#e5e7eb"}`, borderRadius: 16, color: T?.textFaint || "#9ca3af", fontSize: 15 }}>
// //           No {examTypeFilter !== "ALL" ? EXAM_TYPE_CFG[examTypeFilter].label + " " : ""}
// //           {statusFilter === "all" ? "" : statusFilter + " "}exams found.
// //         </div>
// //       ) : (
// //         <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
// //           {displayed.map((exam, i) => (
// //             <div key={exam.id} className="exam-card-enter" style={{ animationDelay: `${i * 60}ms` }}>
// //               <ExamCard exam={exam} submissionMap={submissionMap} onStartExam={handleStart} dark={dark} />
// //             </div>
// //           ))}
// //         </div>
// //       )}
// //     </div>
// //   );
// // } 
// import { useState, useEffect, useCallback } from "react";
// import { collection, query, where, getDocs } from "firebase/firestore";
// import { db } from "../../firebase/config";

// function getWindowStatus(exam) {
//   if (exam.status === "completed") return "completed";
//   const start = exam.scheduledStartTime?.toDate?.() ?? new Date(exam.scheduledStartTime);
//   const end   = new Date(start.getTime() + (exam.durationMinutes ?? 60) * 60 * 1000);
//   const now   = new Date();
//   if (now >= start && now <= end) return "live";
//   if (now < start)               return "upcoming";
//   return "missed";
// }
// function fmtDate(val) {
//   const d = val?.toDate ? val.toDate() : new Date(val);
//   return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
// }
// function fmtTime(val) {
//   const d = val?.toDate ? val.toDate() : new Date(val);
//   return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
// }
// function endTime(exam) {
//   const s = exam.scheduledStartTime?.toDate?.() ?? new Date(exam.scheduledStartTime);
//   return new Date(s.getTime() + (exam.durationMinutes ?? 60) * 60 * 1000);
// }
// function durationLabel(mins) {
//   const h = Math.floor(mins / 60), m = mins % 60;
//   return h > 0 ? `${h}h ${m > 0 ? m + "m" : ""}`.trim() : `${m}m`;
// }

// function useCountdown(target) {
//   const calc = useCallback(() => {
//     if (!target) return null;
//     const diff = (target instanceof Date ? target : new Date(target)) - new Date();
//     if (diff <= 0) return null;
//     return { h: Math.floor(diff / 3600000), m: Math.floor((diff % 3600000) / 60000), s: Math.floor((diff % 60000) / 1000) };
//   }, [target]);
//   const [cd, setCd] = useState(calc);
//   useEffect(() => { const t = setInterval(() => setCd(calc()), 1000); return () => clearInterval(t); }, [calc]);
//   return cd;
// }

// function CountdownBadge({ exam, ws }) {
//   const end_  = endTime(exam);
//   const start = exam.scheduledStartTime?.toDate?.() ?? new Date(exam.scheduledStartTime);
//   const cd    = useCountdown(ws === "live" ? end_ : start);
//   if (!cd || (ws !== "live" && ws !== "upcoming")) return null;
//   const color = ws === "live" ? "#10b981" : "#f97316";
//   return (
//     <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
//       <span style={{ fontSize: 11, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.07em", fontFamily: "system-ui" }}>
//         {ws === "live" ? "Ends in" : "Starts in"}
//       </span>
//       {[{ v: cd.h, u: "h" }, { v: cd.m, u: "m" }, { v: cd.s, u: "s" }].map(({ v, u }, i) => (
//         <span key={i} style={{
//           fontFamily: "'JetBrains Mono', 'Courier New', monospace", fontWeight: 800, fontSize: 13,
//           background: `${color}15`, border: `1px solid ${color}35`, borderRadius: 7,
//           padding: "3px 8px", color, minWidth: 34, textAlign: "center", letterSpacing: "0.02em",
//           display: "inline-block",
//         }}>
//           {String(v).padStart(2, "0")}{u}
//         </span>
//       ))}
//     </div>
//   );
// }

// // ── Score Details Modal ────────────────────────────────────────────────────────
// function ScoreDetailsModal({ sub, dark, onClose }) {
//   const score       = sub.totalScore ?? sub.score ?? 0;
//   const total       = sub.totalQuestions ?? sub.questionCount ?? null;
//   const pct         = total ? Math.round((score / total) * 100) : null;
//   const color       = pct === null ? "#10b981" : pct >= 75 ? "#10b981" : pct >= 50 ? "#f97316" : "#ef4444";
//   const mcqScore    = sub.mcqScore    ?? null;
//   const codingScore = sub.codingScore ?? null;
//   const mcqTotal    = sub.mcqTotal    ?? sub.mcqCount    ?? null;
//   const codingTotal = sub.codingTotal ?? sub.codingCount ?? null;
//   const answers     = sub.answers || sub.studentAnswers || {};
//   const attempted   = Object.keys(answers).length;
//   const violations  = sub.violations ?? 0;
//   const submittedAt = sub.submittedAt?.toDate?.() ?? (sub.submittedAt ? new Date(sub.submittedAt) : null);

//   const circumference = 2 * Math.PI * 42;
//   const dashVal = pct ?? 100;

//   return (
//     <div
//       style={{
//         position: "fixed", inset: 0,
//         background: "rgba(0,0,0,0.80)",
//         zIndex: 9999, display: "flex",
//         alignItems: "center", justifyContent: "center",
//         padding: 20,
//         animation: "fadeUp .2s ease",
//       }}
//       onClick={onClose}
//     >
//       <div
//         style={{
//           background: dark ? "#161b22" : "#ffffff",
//           border: `1.5px solid ${dark ? "#30363d" : "#e5e7eb"}`,
//           borderRadius: 20, padding: "32px 36px",
//           maxWidth: 540, width: "100%",
//           maxHeight: "88vh", overflowY: "auto",
//           boxShadow: "0 32px 80px rgba(0,0,0,0.5)",
//         }}
//         onClick={e => e.stopPropagation()}
//       >
//         {/* Header */}
//         <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
//           <div>
//             <h3 style={{ fontSize: 19, fontWeight: 900, color: dark ? "#e6edf3" : "#111827", margin: 0, letterSpacing: "-0.02em" }}>
//               📊 Score Breakdown
//             </h3>
//             <p style={{ fontSize: 13, color: dark ? "#8b949e" : "#6b7280", marginTop: 5 }}>
//               {sub.studentName || "Your"}{sub.branch ? ` · ${sub.branch}` : ""}{sub.section ? ` · Sec ${sub.section}` : ""}
//             </p>
//           </div>
//           <button
//             onClick={onClose}
//             style={{
//               background: dark ? "#21262d" : "#f3f4f6",
//               border: `1px solid ${dark ? "#30363d" : "#e5e7eb"}`,
//               borderRadius: 8, width: 32, height: 32,
//               cursor: "pointer", color: dark ? "#8b949e" : "#6b7280",
//               fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center",
//               flexShrink: 0,
//             }}
//           >
//             ×
//           </button>
//         </div>

//         {/* Big ring + score center */}
//         <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
//           <div style={{ position: "relative", width: 130, height: 130 }}>
//             <svg viewBox="0 0 100 100" style={{ width: 130, height: 130, transform: "rotate(-90deg)" }}>
//               <circle cx="50" cy="50" r="42" fill="none"
//                 stroke={dark ? "#21262d" : "#f3f4f6"} strokeWidth="7" />
//               <circle cx="50" cy="50" r="42" fill="none"
//                 stroke={color} strokeWidth="7"
//                 strokeDasharray={`${(dashVal / 100) * circumference} ${circumference}`}
//                 strokeLinecap="round"
//                 style={{ transition: "stroke-dasharray 1.2s cubic-bezier(0.4,0,0.2,1)" }}
//               />
//             </svg>
//             <div style={{
//               position: "absolute", inset: 0,
//               display: "flex", flexDirection: "column",
//               alignItems: "center", justifyContent: "center",
//             }}>
//               <span style={{
//                 fontFamily: "'JetBrains Mono', monospace",
//                 fontWeight: 900, fontSize: 26, color, lineHeight: 1,
//               }}>
//                 {score}
//               </span>
//               {total && (
//                 <span style={{ fontSize: 12, color: dark ? "#6b7280" : "#9ca3af", marginTop: 3, fontWeight: 600 }}>
//                   / {total}
//                 </span>
//               )}
//               {pct !== null && (
//                 <span style={{ fontSize: 11, color, fontWeight: 800, marginTop: 2 }}>
//                   {pct}%
//                 </span>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Performance banner */}
//         <div style={{
//           textAlign: "center", padding: "11px 16px",
//           background: dark ? `${color}12` : `${color}08`,
//           border: `1.5px solid ${color}30`, borderRadius: 12,
//           fontSize: 14, fontWeight: 800, color,
//           marginBottom: 22,
//         }}>
//           {pct !== null
//             ? pct >= 75 ? "🎉 Excellent performance! Keep it up."
//             : pct >= 50 ? "👍 Good work! A little more and you'll ace it."
//             : "📚 Keep practicing — you'll get there!"
//             : "✅ Exam submitted successfully."}
//         </div>

//         {/* Stat grid */}
//         <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 22 }}>
//           {[
//             { label: "Questions Answered", val: attempted,                        color: "#3b82f6", icon: "✍️" },
//             { label: "Total Questions",    val: total ?? "—",                     color: "#8b5cf6", icon: "❓" },
//             { label: "Total Score",        val: score,                            color: color,     icon: "🏆" },
//             { label: "Percentage",         val: pct !== null ? `${pct}%` : "—",  color: color,     icon: "📈" },
//             ...(mcqScore    !== null ? [{ label: "MCQ Score",    val: mcqTotal    !== null ? `${mcqScore} / ${mcqTotal}`    : mcqScore,    color: "#f97316", icon: "📝" }] : []),
//             ...(codingScore !== null ? [{ label: "Coding Score", val: codingTotal !== null ? `${codingScore} / ${codingTotal}` : codingScore, color: "#10b981", icon: "💻" }] : []),
//             ...(violations > 0 ? [{ label: "Violations", val: violations, color: "#ef4444", icon: "⚠️" }] : []),
//             ...(submittedAt ? [{ label: "Submitted At", val: submittedAt.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }), color: dark ? "#8b949e" : "#6b7280", icon: "🕐" }] : []),
//           ].map(({ label, val, color: c, icon }) => (
//             <div key={label} style={{
//               background: dark ? "#0d1117" : "#f8fafc",
//               border: `1px solid ${dark ? "#21262d" : "#e5e7eb"}`,
//               borderRadius: 11, padding: "13px 15px",
//             }}>
//               <div style={{
//                 fontSize: 11, color: dark ? "#6b7280" : "#9ca3af",
//                 marginBottom: 6, fontWeight: 700,
//                 textTransform: "uppercase", letterSpacing: "0.06em",
//                 display: "flex", alignItems: "center", gap: 4,
//               }}>
//                 <span>{icon}</span> {label}
//               </div>
//               <div style={{
//                 fontSize: 20, fontWeight: 900, color: c,
//                 fontFamily: "'JetBrains Mono', monospace", lineHeight: 1,
//               }}>
//                 {val}
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Score progress bar */}
//         {pct !== null && (
//           <div style={{ marginBottom: 22 }}>
//             <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
//               <span style={{ fontSize: 12, color: dark ? "#8b949e" : "#6b7280", fontWeight: 700 }}>Score Progress</span>
//               <span style={{ fontSize: 12, fontWeight: 900, color }}>{pct}%</span>
//             </div>
//             <div style={{ height: 10, background: dark ? "#21262d" : "#f3f4f6", borderRadius: 99, overflow: "hidden" }}>
//               <div style={{
//                 height: "100%", width: `${pct}%`,
//                 background: `linear-gradient(90deg, ${color}, ${pct >= 75 ? "#3b82f6" : pct >= 50 ? "#fbbf24" : "#ef4444"})`,
//                 borderRadius: 99, transition: "width 1.2s cubic-bezier(0.4,0,0.2,1)",
//               }} />
//             </div>
//             <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5, fontSize: 10, color: dark ? "#6b7280" : "#9ca3af", fontWeight: 600 }}>
//               <span>0%</span>
//               <span style={{ color: "#f97316" }}>40% Pass</span>
//               <span style={{ color: "#10b981" }}>75% Excellent</span>
//               <span>100%</span>
//             </div>
//           </div>
//         )}

//         {/* MCQ vs Coding breakdown (if both present) */}
//         {mcqScore !== null && codingScore !== null && (
//           <div style={{
//             background: dark ? "#0d1117" : "#f8fafc",
//             border: `1px solid ${dark ? "#21262d" : "#e5e7eb"}`,
//             borderRadius: 12, padding: "16px 18px", marginBottom: 22,
//           }}>
//             <div style={{ fontSize: 12, fontWeight: 800, color: dark ? "#8b949e" : "#6b7280", marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.06em" }}>
//               📋 Score Split
//             </div>
//             <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
//               {[
//                 {
//                   label: "MCQ",
//                   val: mcqScore,
//                   outOf: mcqTotal ?? score,
//                   totalQ: sub.mcqCount ?? null,
//                   color: "#f97316",
//                   icon: "📝",
//                 },
//                 {
//                   label: "Coding",
//                   val: codingScore,
//                   outOf: codingTotal ?? score,
//                   totalQ: sub.codingCount ?? null,
//                   color: "#10b981",
//                   icon: "💻",
//                 },
//               ].map(({ label, val, outOf, totalQ, color: c, icon }) => {
//                 const p = outOf > 0 ? Math.min(100, Math.round((val / outOf) * 100)) : 0;
//                 return (
//                   <div key={label}>
//                     <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
//                       <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
//                         <span>{icon}</span>
//                         <span style={{ fontSize: 13, color: c, fontWeight: 800 }}>{label}</span>
//                         {totalQ !== null && (
//                           <span style={{
//                             fontSize: 10, color: dark ? "#6b7280" : "#9ca3af",
//                             background: dark ? "#21262d" : "#f3f4f6",
//                             border: `1px solid ${dark ? "#30363d" : "#e5e7eb"}`,
//                             borderRadius: 5, padding: "1px 6px", fontWeight: 600,
//                           }}>
//                             {totalQ} Q
//                           </span>
//                         )}
//                       </div>
//                       <span style={{
//                         fontSize: 14, fontWeight: 900, color: c,
//                         fontFamily: "'JetBrains Mono', monospace",
//                       }}>
//                         {val}{outOf !== score ? ` / ${outOf}` : ""}
//                         <span style={{ fontSize: 10, fontWeight: 600, color: dark ? "#6b7280" : "#9ca3af", marginLeft: 4 }}>
//                           ({p}%)
//                         </span>
//                       </span>
//                     </div>
//                     <div style={{ height: 8, background: dark ? "#21262d" : "#e5e7eb", borderRadius: 99, overflow: "hidden" }}>
//                       <div style={{
//                         height: "100%", width: `${p}%`,
//                         background: `linear-gradient(90deg, ${c}, ${c}99)`,
//                         borderRadius: 99, transition: "width 1.1s ease",
//                       }} />
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         )}

//         {/* Only MCQ or only Coding — single section bar */}
//         {(mcqScore !== null) !== (codingScore !== null) && (
//           <div style={{
//             background: dark ? "#0d1117" : "#f8fafc",
//             border: `1px solid ${dark ? "#21262d" : "#e5e7eb"}`,
//             borderRadius: 12, padding: "16px 18px", marginBottom: 22,
//           }}>
//             <div style={{ fontSize: 12, fontWeight: 800, color: dark ? "#8b949e" : "#6b7280", marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.06em" }}>
//               📋 Score Split
//             </div>
//             {(() => {
//               const isMcq = mcqScore !== null;
//               const val   = isMcq ? mcqScore : codingScore;
//               const outOf = isMcq ? (mcqTotal ?? score) : (codingTotal ?? score);
//               const c     = isMcq ? "#f97316" : "#10b981";
//               const icon  = isMcq ? "📝" : "💻";
//               const label = isMcq ? "MCQ" : "Coding";
//               const p     = outOf > 0 ? Math.min(100, Math.round((val / outOf) * 100)) : 0;
//               return (
//                 <div>
//                   <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
//                     <span style={{ fontSize: 13, color: c, fontWeight: 800 }}>{icon} {label}</span>
//                     <span style={{ fontSize: 14, fontWeight: 900, color: c, fontFamily: "'JetBrains Mono', monospace" }}>
//                       {val} / {outOf}
//                       <span style={{ fontSize: 10, fontWeight: 600, color: dark ? "#6b7280" : "#9ca3af", marginLeft: 4 }}>({p}%)</span>
//                     </span>
//                   </div>
//                   <div style={{ height: 8, background: dark ? "#21262d" : "#e5e7eb", borderRadius: 99, overflow: "hidden" }}>
//                     <div style={{ height: "100%", width: `${p}%`, background: c, borderRadius: 99, transition: "width 1.1s ease" }} />
//                   </div>
//                 </div>
//               );
//             })()}
//           </div>
//         )}

//         {/* Close button */}
//         <button
//           onClick={onClose}
//           style={{
//             display: "block", width: "100%",
//             padding: "11px", borderRadius: 10,
//             background: dark ? "#21262d" : "#f3f4f6",
//             border: `1px solid ${dark ? "#30363d" : "#e5e7eb"}`,
//             color: dark ? "#8b949e" : "#6b7280",
//             fontSize: 13, fontWeight: 700, cursor: "pointer",
//             transition: "all .15s",
//           }}
//           onMouseEnter={e => { e.currentTarget.style.background = dark ? "#30363d" : "#e5e7eb"; }}
//           onMouseLeave={e => { e.currentTarget.style.background = dark ? "#21262d" : "#f3f4f6"; }}
//         >
//           Close
//         </button>
//       </div>
//     </div>
//   );
// }

// // ── Score Card (shown inline on exam card) ─────────────────────────────────────
// function ScoreCard({ sub, dark }) {
//   const [showDetails, setShowDetails] = useState(false);

//   const score = sub.totalScore ?? sub.score ?? 0;
//   const total = sub.totalQuestions ?? sub.questionCount ?? null;
//   const pct   = total ? Math.round((score / total) * 100) : null;
//   const color = pct === null ? "#10b981" : pct >= 75 ? "#10b981" : pct >= 50 ? "#f97316" : "#ef4444";
//   const dashVal = pct ?? 75;
//   const circumference = 2 * Math.PI * 15.9;

//   return (
//     <>
//       <div style={{
//         display: "flex", alignItems: "center", gap: 14,
//         background: dark ? `${color}10` : `${color}08`,
//         border: `1.5px solid ${color}30`, borderRadius: 14,
//         padding: "12px 18px",
//         animation: "scoreReveal 0.55s cubic-bezier(0.34,1.56,0.64,1) both",
//       }}>
//         {/* Ring */}
//         <div style={{ position: "relative", width: 52, height: 52, flexShrink: 0 }}>
//           <svg viewBox="0 0 36 36" style={{ width: 52, height: 52, transform: "rotate(-90deg)" }}>
//             <circle cx="18" cy="18" r="15.9" fill="none"
//               stroke={dark ? "#30363d" : "#e5e7eb"} strokeWidth="2.5" />
//             <circle cx="18" cy="18" r="15.9" fill="none"
//               stroke={color} strokeWidth="2.5"
//               strokeDasharray={`${(dashVal / 100) * circumference} ${circumference}`}
//               strokeLinecap="round"
//               style={{ transition: "stroke-dasharray 1s ease" }}
//             />
//           </svg>
//           <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
//             {pct !== null
//               ? <span style={{ fontSize: 10, fontWeight: 900, color, fontFamily: "'JetBrains Mono', monospace", lineHeight: 1 }}>{pct}%</span>
//               : <span style={{ fontSize: 14, fontWeight: 900, color }}>✓</span>
//             }
//           </div>
//         </div>

//         {/* Score text */}
//         <div style={{ animation: "scoreTextIn 0.4s ease both 0.15s" }}>
//           <div style={{ fontSize: 11, fontWeight: 700, color: dark ? "#6b7280" : "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 3 }}>
//             Your Score
//           </div>
//           <div style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 900, fontSize: 22, color, lineHeight: 1 }}>
//             {score}
//             {total && <span style={{ fontSize: 13, fontWeight: 500, color: dark ? "#6b7280" : "#9ca3af" }}> / {total}</span>}
//           </div>
//           <div style={{ fontSize: 11, color: dark ? "#6b7280" : "#9ca3af", marginTop: 3, fontWeight: 500 }}>
//             {pct !== null
//               ? pct >= 75 ? "🎉 Excellent!" : pct >= 50 ? "👍 Good work" : "📚 Keep going"
//               : "✅ Submitted"}
//           </div>
//         </div>

//         {/* Single 📊 Score button */}
//         <div style={{ marginLeft: "auto" }}>
//           <button
//             onClick={() => setShowDetails(true)}
//             style={{
//               background: `linear-gradient(135deg, ${color}22, ${color}12)`,
//               border: `1.5px solid ${color}50`,
//               borderRadius: 10, padding: "10px 18px",
//               color: color, fontSize: 13, fontWeight: 800,
//               cursor: "pointer", fontFamily: "system-ui",
//               display: "flex", alignItems: "center", gap: 6,
//               transition: "all .18s",
//               whiteSpace: "nowrap",
//               boxShadow: `0 2px 8px ${color}20`,
//             }}
//             onMouseEnter={e => {
//               e.currentTarget.style.background = `${color}30`;
//               e.currentTarget.style.transform = "translateY(-1px)";
//               e.currentTarget.style.boxShadow = `0 4px 14px ${color}35`;
//             }}
//             onMouseLeave={e => {
//               e.currentTarget.style.background = `linear-gradient(135deg, ${color}22, ${color}12)`;
//               e.currentTarget.style.transform = "";
//               e.currentTarget.style.boxShadow = `0 2px 8px ${color}20`;
//             }}
//           >
//             📊 Score
//           </button>
//         </div>
//       </div>

//       {/* Detailed Score Modal */}
//       {showDetails && (
//         <ScoreDetailsModal sub={sub} dark={dark} onClose={() => setShowDetails(false)} />
//       )}
//     </>
//   );
// }

// // ── Status / exam-type config ──────────────────────────────────────────────────
// const STATUS_CFG = {
//   live:      { color: "#10b981", bg: "#f0fdf4", border: "#bbf7d0", darkBg: "rgba(16,185,129,.1)",  darkBorder: "rgba(16,185,129,.25)", label: "Live Now",  dot: true  },
//   upcoming:  { color: "#f97316", bg: "#fff7ed", border: "#fed7aa", darkBg: "rgba(249,115,22,.1)",  darkBorder: "rgba(249,115,22,.25)", label: "Upcoming",  dot: false },
//   completed: { color: "#6b7280", bg: "#f9fafb", border: "#e5e7eb", darkBg: "rgba(107,114,128,.1)", darkBorder: "rgba(107,114,128,.2)", label: "Completed", dot: false },
//   missed:    { color: "#ef4444", bg: "#fef2f2", border: "#fecaca", darkBg: "rgba(239,68,68,.1)",   darkBorder: "rgba(239,68,68,.2)",   label: "Missed",    dot: false },
// };

// const EXAM_TYPE_CFG = {
//   ALL:    { label: "All Exams",  icon: "📋", color: "#6b7280" },
//   DAILY:  { label: "Daily",      icon: "📅", color: "#10b981" },
//   WEEKLY: { label: "Weekly",     icon: "📊", color: "#3b82f6" },
//   EXAM:   { label: "Main Exam",  icon: "🎓", color: "#f97316" },
// };

// // ── Exam Card ──────────────────────────────────────────────────────────────────
// function ExamCard({ exam, submissionMap, onStartExam, dark }) {
//   const ws        = getWindowStatus(exam);
//   const cfg       = STATUS_CFG[ws] || STATUS_CFG.upcoming;
//   const start     = exam.scheduledStartTime?.toDate?.() ?? new Date(exam.scheduledStartTime);
//   const end_      = endTime(exam);
//   const totalMins = exam.durationMinutes ?? 60;
//   const qCount    = exam.questionIds?.length ?? 0;

//   const sub          = submissionMap[exam.id];
//   const isAttempted  = sub?.status === "completed";
//   const isInProgress = sub && sub.status !== "completed";

//   const examType = exam.examType || "EXAM";
//   const typeCfg  = EXAM_TYPE_CFG[examType] || EXAM_TYPE_CFG.EXAM;

//   const borderColor = ws === "live" && !isAttempted
//     ? (dark ? cfg.darkBorder : cfg.border)
//     : (dark ? "#21262d" : "#e5e7eb");

//   const bg = dark
//     ? (ws === "live" && !isAttempted ? cfg.darkBg : "#161b22")
//     : (ws === "live" && !isAttempted ? cfg.bg : "#ffffff");

//   return (
//     <div style={{
//       background: bg, border: `1.5px solid ${borderColor}`, borderRadius: 16,
//       overflow: "hidden", transition: "all .2s ease",
//       boxShadow: ws === "live" && !isAttempted ? `0 0 0 3px ${cfg.color}18` : "none",
//     }}>
//       {ws === "live" && !isAttempted && (
//         <div style={{ height: 3, background: `linear-gradient(90deg, ${cfg.color}, #3b82f6)` }} />
//       )}
//       <div style={{ padding: "20px 24px" }}>

//         {/* Row 1: title + badges */}
//         <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 14 }}>
//           <div style={{ flex: 1 }}>
//             <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
//               <h3 style={{ fontSize: 16, fontWeight: 800, color: dark ? "#e6edf3" : "#111827", fontFamily: "'Trebuchet MS', system-ui, sans-serif", lineHeight: 1.3, margin: 0 }}>
//                 {exam.title}
//               </h3>
//               <span style={{
//                 fontSize: 10, fontWeight: 800, padding: "2px 8px", borderRadius: 20,
//                 background: `${typeCfg.color}18`, color: typeCfg.color,
//                 border: `1px solid ${typeCfg.color}35`,
//                 textTransform: "uppercase", letterSpacing: "0.07em", flexShrink: 0,
//               }}>
//                 {typeCfg.icon} {examType}
//               </span>
//             </div>
//             {exam.description && (
//               <p style={{ fontSize: 13, color: dark ? "#8b949e" : "#6b7280", lineHeight: 1.5, margin: 0 }}>
//                 {exam.description.substring(0, 90)}{exam.description.length > 90 ? "…" : ""}
//               </p>
//             )}
//           </div>
//           <div style={{ flexShrink: 0 }}>
//             {isAttempted ? (
//               <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 800, padding: "4px 10px", borderRadius: 20, background: "rgba(107,114,128,.1)", color: "#6b7280", border: "1px solid rgba(107,114,128,.2)", textTransform: "uppercase", letterSpacing: "0.07em" }}>
//                 ✓ Submitted
//               </span>
//             ) : (
//               <span style={{
//                 display: "flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 800,
//                 padding: "4px 10px", borderRadius: 20,
//                 background: dark ? cfg.darkBg : cfg.bg, color: cfg.color,
//                 border: `1px solid ${dark ? cfg.darkBorder : cfg.border}`,
//                 textTransform: "uppercase", letterSpacing: "0.07em",
//                 animation: ws === "live" ? "livePulse 2s infinite" : "none",
//               }}>
//                 {cfg.dot && <span style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.color, flexShrink: 0 }} />}
//                 {cfg.label}
//               </span>
//             )}
//           </div>
//         </div>

//         {/* Row 2: meta pills */}
//         <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
//           {[
//             exam.scheduledStartTime && { icon: "📅", val: fmtDate(start) },
//             exam.scheduledStartTime && { icon: "🕗", val: `${fmtTime(start)} – ${fmtTime(end_)}` },
//             { icon: "⏱", val: durationLabel(totalMins) },
//             { icon: "❓", val: `${qCount} Q` },
//           ].filter(Boolean).map(({ icon, val }, i) => (
//             <span key={i} style={{
//               display: "flex", alignItems: "center", gap: 4, fontSize: 12,
//               color: dark ? "#8b949e" : "#6b7280",
//               background: dark ? "#21262d" : "#f3f4f6",
//               border: `1px solid ${dark ? "#30363d" : "#e5e7eb"}`,
//               borderRadius: 8, padding: "3px 10px", fontFamily: "system-ui",
//             }}>
//               {icon} <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>{val}</span>
//             </span>
//           ))}
//         </div>

//         {/* Row 3: score card OR countdown + CTA */}
//         {isAttempted ? (
//           <ScoreCard sub={sub} dark={dark} />
//         ) : (
//           <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
//             <CountdownBadge exam={exam} ws={ws} />
//             <div style={{ marginLeft: "auto" }}>
//               {isInProgress ? (
//                 <button onClick={() => onStartExam(exam.id, sub.id)}
//                   style={{ background: "#f97316", border: "none", borderRadius: 10, padding: "9px 22px", color: "#fff", fontSize: 13, fontWeight: 800, cursor: "pointer", fontFamily: "system-ui", display: "flex", alignItems: "center", gap: 8, boxShadow: "0 4px 12px rgba(249,115,22,.3)" }}>
//                   ▶ Resume Exam
//                 </button>
//               ) : ws === "live" ? (
//                 <button onClick={() => onStartExam(exam.id, null)}
//                   style={{ background: `linear-gradient(135deg, ${cfg.color}, #3b82f6)`, border: "none", borderRadius: 10, padding: "9px 22px", color: "#fff", fontSize: 13, fontWeight: 800, cursor: "pointer", fontFamily: "system-ui", display: "flex", alignItems: "center", gap: 8, boxShadow: `0 4px 14px ${cfg.color}40` }}>
//                   ▶ Start Exam
//                 </button>
//               ) : ws === "upcoming" ? (
//                 <button disabled style={{ background: dark ? "#21262d" : "#f3f4f6", border: `1px solid ${dark ? "#30363d" : "#e5e7eb"}`, borderRadius: 10, padding: "9px 22px", color: dark ? "#6b7280" : "#9ca3af", fontSize: 13, fontWeight: 700, cursor: "not-allowed", fontFamily: "system-ui" }}>
//                   🔒 Not Yet Open
//                 </button>
//               ) : (
//                 <span style={{ fontSize: 13, color: dark ? "#6b7280" : "#9ca3af", fontWeight: 600 }}>
//                   {ws === "missed" ? "⛔ Window Closed" : "✓ Ended"}
//                 </span>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// // ── Main ExamsView ─────────────────────────────────────────────────────────────
// export default function ExamsView({ exams, currentUser, onStartExam, T }) {
//   const [examTypeFilter, setExamTypeFilter] = useState("ALL");
//   const [statusFilter,   setStatusFilter]   = useState("all");
//   const [submissionMap,  setSubMap]         = useState({});
//   const [loadingSubs,    setLoadingSubs]     = useState(true);

//   const dark = T?.bg === "#0d1117" || (T?.bg || "").startsWith("#0");

//   useEffect(() => {
//     if (!currentUser?.uid) { setLoadingSubs(false); return; }
//     const fetchSubs = async () => {
//       setLoadingSubs(true);
//       try {
//         const q    = query(collection(db, "submissions"), where("studentId", "==", currentUser.uid));
//         const snap = await getDocs(q);
//         const map  = {};
//         snap.docs.forEach(d => {
//           const data = d.data();
//           if (!data.examId) return;
//           const existing = map[data.examId];
//           if (!existing || data.status === "completed" || !existing.status) {
//             map[data.examId] = { id: d.id, ...data };
//           }
//         });
//         setSubMap(map);
//       } catch (e) { console.error("Submission check:", e); }
//       setLoadingSubs(false);
//     };
//     fetchSubs();
//   }, [currentUser?.uid]);

//   const typeFiltered = examTypeFilter === "ALL"
//     ? exams
//     : exams.filter(e => (e.examType || "EXAM") === examTypeFilter);

//   const withStatus = typeFiltered.map(e => ({ ...e, ws: getWindowStatus(e) }));

//   const counts = {
//     all:       withStatus.length,
//     live:      withStatus.filter(e => e.ws === "live").length,
//     upcoming:  withStatus.filter(e => e.ws === "upcoming").length,
//     completed: withStatus.filter(e => e.ws === "completed" || e.ws === "missed").length,
//   };

//   const displayed = statusFilter === "all" ? withStatus
//     : statusFilter === "completed"
//       ? withStatus.filter(e => e.ws === "completed" || e.ws === "missed")
//       : withStatus.filter(e => e.ws === statusFilter);

//   const liveExams = withStatus.filter(e => e.ws === "live" && !submissionMap[e.id]);

//   const typeCounts = {
//     ALL:    exams.length,
//     DAILY:  exams.filter(e => (e.examType || "EXAM") === "DAILY").length,
//     WEEKLY: exams.filter(e => (e.examType || "EXAM") === "WEEKLY").length,
//     EXAM:   exams.filter(e => (e.examType || "EXAM") === "EXAM").length,
//   };

//   const handleStart = (examId, existingSubId) => {
//     const sub = submissionMap[examId];
//     if (sub?.status === "completed") {
//       alert("You have already submitted this exam. Re-entry is not allowed.");
//       return;
//     }
//     onStartExam(examId, existingSubId || sub?.id || null);
//   };

//   return (
//     <div style={{ fontFamily: "system-ui, sans-serif" }} className="section-enter">
//       <style>{`
//         @keyframes livePulse    { 0%,100%{opacity:1} 50%{opacity:.65} }
//         @keyframes fadeUp       { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
//         @keyframes spin         { to{transform:rotate(360deg)} }
//         @keyframes scoreReveal  { from{opacity:0;transform:scale(0.88) translateY(8px)} to{opacity:1;transform:scale(1) translateY(0)} }
//         @keyframes dashDraw     { from{stroke-dasharray:0 100} }
//         @keyframes scoreTextIn  { from{opacity:0;transform:translateX(-8px)} to{opacity:1;transform:translateX(0)} }
//         .exam-card-enter        { animation: fadeUp .3s ease both; }
//       `}</style>

//       {/* Header */}
//       <div style={{ marginBottom: 24 }}>
//         <h2 style={{ fontFamily: "'Trebuchet MS', system-ui", fontWeight: 900, fontSize: "1.75rem", color: T?.text || "#111827", letterSpacing: "-0.02em" }}>
//           Examination Portal
//         </h2>
//         <p style={{ fontSize: 14, color: T?.textFaint || "#9ca3af", marginTop: 4 }}>
//           Full-screen proctored mode · MCQ + Coding · One attempt per exam
//         </p>
//       </div>

//       {/* Live alert */}
//       {liveExams.length > 0 && (
//         <div style={{
//           background: dark ? "rgba(16,185,129,.08)" : "#f0fdf4",
//           border: "1.5px solid rgba(16,185,129,.3)", borderRadius: 14,
//           padding: "14px 20px", marginBottom: 20,
//           display: "flex", alignItems: "center", gap: 14,
//           animation: "fadeUp .3s ease",
//         }}>
//           <span style={{ fontSize: 22, animation: "livePulse 1.5s infinite" }}>🟢</span>
//           <div>
//             <div style={{ fontSize: 15, fontWeight: 800, color: "#10b981" }}>
//               {liveExams.length} exam{liveExams.length > 1 ? "s are" : " is"} live right now!
//             </div>
//             <div style={{ fontSize: 13, color: T?.textFaint || "#6b7280", marginTop: 2 }}>
//               Start immediately — the window is open.
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Exam Type Filter */}
//       <div style={{ marginBottom: 16 }}>
//         <p style={{ fontSize: 11, fontWeight: 700, color: T?.textFaint || "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
//           Category
//         </p>
//         <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
//           {Object.entries(EXAM_TYPE_CFG).map(([key, cfg]) => {
//             const active = examTypeFilter === key;
//             return (
//               <button key={key} onClick={() => { setExamTypeFilter(key); setStatusFilter("all"); }}
//                 style={{
//                   display: "flex", alignItems: "center", gap: 6,
//                   background: active
//                     ? (key === "ALL" ? (dark ? "#30363d" : "#374151") : `${cfg.color}18`)
//                     : (dark ? "#21262d" : "#f3f4f6"),
//                   border: `1.5px solid ${active
//                     ? (key === "ALL" ? (dark ? "#555" : "#374151") : `${cfg.color}45`)
//                     : (dark ? "#30363d" : "#e5e7eb")}`,
//                   borderRadius: 10, padding: "8px 16px",
//                   color: active ? (key === "ALL" ? "#fff" : cfg.color) : (dark ? "#8b949e" : "#6b7280"),
//                   fontSize: 13, fontWeight: active ? 800 : 500, cursor: "pointer",
//                   fontFamily: "system-ui", transition: "all .15s",
//                 }}>
//                 <span>{cfg.icon}</span>
//                 <span>{cfg.label}</span>
//                 <span style={{ background: dark ? "#30363d" : "#e5e7eb", color: dark ? "#8b949e" : "#6b7280", padding: "1px 7px", borderRadius: 20, fontSize: 11, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>
//                   {typeCounts[key]}
//                 </span>
//               </button>
//             );
//           })}
//         </div>
//       </div>

//       {/* Status Sub-tabs */}
//       <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
//         {["all", "live", "upcoming", "completed"].map(f => {
//           const active = statusFilter === f;
//           const color  = f === "live" ? "#10b981" : f === "upcoming" ? "#f97316" : f === "completed" ? "#6b7280" : (dark ? "#8b949e" : "#374151");
//           return (
//             <button key={f} onClick={() => setStatusFilter(f)}
//               style={{
//                 background: active ? (dark ? `${color}15` : `${color}12`) : (dark ? "#21262d" : "#f3f4f6"),
//                 border: `1.5px solid ${active ? `${color}40` : (dark ? "#30363d" : "#e5e7eb")}`,
//                 borderRadius: 10, padding: "6px 14px",
//                 color: active ? color : (dark ? "#8b949e" : "#6b7280"),
//                 fontSize: 12, fontWeight: active ? 800 : 500, cursor: "pointer",
//                 fontFamily: "system-ui", transition: "all .15s",
//               }}>
//               {f === "live" && "● "}
//               {f.charAt(0).toUpperCase() + f.slice(1)}
//               <span style={{ marginLeft: 6, background: dark ? "#30363d" : "#e5e7eb", color: dark ? "#8b949e" : "#6b7280", padding: "1px 7px", borderRadius: 20, fontSize: 11, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>
//                 {counts[f] ?? 0}
//               </span>
//             </button>
//           );
//         })}
//       </div>

//       {/* Cards */}
//       {loadingSubs ? (
//         <div style={{ textAlign: "center", padding: "3rem", color: T?.textFaint || "#9ca3af" }}>
//           <div style={{ width: 32, height: 32, border: "3px solid #10b981", borderTopColor: "transparent", borderRadius: "50%", animation: "spin .8s linear infinite", margin: "0 auto 12px" }} />
//           Checking your submissions…
//         </div>
//       ) : displayed.length === 0 ? (
//         <div style={{ textAlign: "center", padding: "3rem 2rem", border: `1.5px dashed ${dark ? "#30363d" : "#e5e7eb"}`, borderRadius: 16, color: T?.textFaint || "#9ca3af", fontSize: 15 }}>
//           No {examTypeFilter !== "ALL" ? EXAM_TYPE_CFG[examTypeFilter].label + " " : ""}
//           {statusFilter === "all" ? "" : statusFilter + " "}exams found.
//         </div>
//       ) : (
//         <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
//           {displayed.map((exam, i) => (
//             <div key={exam.id} className="exam-card-enter" style={{ animationDelay: `${i * 60}ms` }}>
//               <ExamCard exam={exam} submissionMap={submissionMap} onStartExam={handleStart} dark={dark} />
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// } 



import { useState, useEffect, useCallback } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase/config";

function getWindowStatus(exam) {
  if (exam.status === "completed") return "completed";
  const start = exam.scheduledStartTime?.toDate?.() ?? new Date(exam.scheduledStartTime);
  const end   = new Date(start.getTime() + (exam.durationMinutes ?? 60) * 60 * 1000);
  const now   = new Date();
  if (now >= start && now <= end) return "live";
  if (now < start)               return "upcoming";
  return "missed";
}
function fmtDate(val) {
  const d = val?.toDate ? val.toDate() : new Date(val);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}
function fmtTime(val) {
  const d = val?.toDate ? val.toDate() : new Date(val);
  return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
}
function endTime(exam) {
  const s = exam.scheduledStartTime?.toDate?.() ?? new Date(exam.scheduledStartTime);
  return new Date(s.getTime() + (exam.durationMinutes ?? 60) * 60 * 1000);
}
function durationLabel(mins) {
  const h = Math.floor(mins / 60), m = mins % 60;
  return h > 0 ? `${h}h ${m > 0 ? m + "m" : ""}`.trim() : `${m}m`;
}

function useCountdown(target) {
  const calc = useCallback(() => {
    if (!target) return null;
    const diff = (target instanceof Date ? target : new Date(target)) - new Date();
    if (diff <= 0) return null;
    return { h: Math.floor(diff / 3600000), m: Math.floor((diff % 3600000) / 60000), s: Math.floor((diff % 60000) / 1000) };
  }, [target]);
  const [cd, setCd] = useState(calc);
  useEffect(() => { const t = setInterval(() => setCd(calc()), 1000); return () => clearInterval(t); }, [calc]);
  return cd;
}

function CountdownBadge({ exam, ws }) {
  const end_  = endTime(exam);
  const start = exam.scheduledStartTime?.toDate?.() ?? new Date(exam.scheduledStartTime);
  const cd    = useCountdown(ws === "live" ? end_ : start);
  if (!cd || (ws !== "live" && ws !== "upcoming")) return null;
  const color = ws === "live" ? "#10b981" : "#f97316";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
      <span style={{ fontSize: 11, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.07em", fontFamily: "system-ui" }}>
        {ws === "live" ? "Ends in" : "Starts in"}
      </span>
      {[{ v: cd.h, u: "h" }, { v: cd.m, u: "m" }, { v: cd.s, u: "s" }].map(({ v, u }, i) => (
        <span key={i} style={{
          fontFamily: "'JetBrains Mono', 'Courier New', monospace", fontWeight: 800, fontSize: 13,
          background: `${color}15`, border: `1px solid ${color}35`, borderRadius: 7,
          padding: "3px 8px", color, minWidth: 34, textAlign: "center", letterSpacing: "0.02em",
          display: "inline-block",
        }}>
          {String(v).padStart(2, "0")}{u}
        </span>
      ))}
    </div>
  );
}

// ── Score Icon Button (shown inline on the exam card after submission) ─────────
function ScoreIconButton({ sub, examType, dark, onClick }) {
  const score   = sub.totalScore ?? sub.score ?? 0;
  const total   = sub.totalQuestions ?? sub.questionCount ?? null;
  const correct = sub.correctCount ?? sub.correctAnswers ?? null;
  const pct     = total ? Math.round((score / total) * 100) : null;
  const color   = pct === null ? "#10b981" : pct >= 75 ? "#10b981" : pct >= 50 ? "#f97316" : "#ef4444";
  const emoji   = pct === null ? "✅" : pct >= 75 ? "🏆" : pct >= 50 ? "📊" : "📚";

  // Only show for DAILY and WEEKLY
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, animation: "scoreReveal 0.5s cubic-bezier(0.34,1.56,0.64,1) both" }}>
      {/* Submitted badge always shown */}
      <span style={{
        display: "flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 800,
        padding: "4px 10px", borderRadius: 20, background: "rgba(107,114,128,.1)", color: "#6b7280",
        border: "1px solid rgba(107,114,128,.2)", textTransform: "uppercase", letterSpacing: "0.07em",
      }}>
        ✓ Submitted
      </span>

      {/* Score icon — shown for ALL exam types */}
      <button onClick={onClick} title="View Score Details" style={{
          position: "relative", width: 48, height: 48, borderRadius: "50%",
          background: `${color}15`, border: `2px solid ${color}40`,
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          flexDirection: "column", gap: 1, transition: "all .2s ease",
          boxShadow: `0 0 0 0 ${color}40`,
          animation: "scorePulseRing 2.5s infinite",
        }}
          onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.12)"; e.currentTarget.style.boxShadow = `0 4px 16px ${color}50`; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = `0 0 0 0 ${color}40`; }}
        >
          <span style={{ fontSize: 16, lineHeight: 1 }}>{emoji}</span>
          {pct !== null && (
            <span style={{
              fontSize: 8, fontWeight: 900, color,
              fontFamily: "'JetBrains Mono', monospace", lineHeight: 1,
            }}>{pct}%</span>
          )}
          {/* Ripple ring */}
          <span style={{
            position: "absolute", inset: -4, borderRadius: "50%",
            border: `2px solid ${color}`, opacity: 0,
            animation: "rippleOut 2.5s infinite",
            pointerEvents: "none",
     }} />
        </button>
    </div>
  );
}

// ── Animated Score Popup Modal ─────────────────────────────────────────────────
function ScorePopup({ sub, exam, dark, onClose }) {
  const score   = sub.totalScore ?? sub.score ?? 0;
  const total   = sub.totalQuestions ?? sub.questionCount ?? null;
  const correct = sub.correctCount   ?? sub.correctAnswers ?? null;
  const wrong   = (total != null && correct != null) ? (total - correct) : null;
  const pct     = total ? Math.round((score / total) * 100) : null;

  const tier =
    pct === null       ? { label: "Submitted!",        emoji: "✅", color: "#10b981", bg: "#f0fdf4", msg: "Your response was recorded." } :
    pct >= 90          ? { label: "Outstanding! 🎉",   emoji: "🏆", color: "#f0a500", bg: "#fffbeb", msg: "Phenomenal performance!" } :
    pct >= 75          ? { label: "Excellent!",         emoji: "🌟", color: "#10b981", bg: "#f0fdf4", msg: "Great job, keep it up!" } :
    pct >= 50          ? { label: "Good Work",          emoji: "👍", color: "#3b82f6", bg: "#eff6ff", msg: "You're on the right track." } :
    pct >= 30          ? { label: "Keep Trying",        emoji: "💪", color: "#f97316", bg: "#fff7ed", msg: "Practice more to improve!" } :
                         { label: "Needs More Effort",  emoji: "📚", color: "#ef4444", bg: "#fef2f2", msg: "Don't give up — review and retry!" };

  const circumference = 2 * Math.PI * 40;
  const progress = pct ?? 75;

  // Particles for high score
  const particles = pct !== null && pct >= 75
    ? Array.from({ length: 12 }, (_, i) => ({
        angle: (i / 12) * 360,
        color: ["#f0a500","#10b981","#3b82f6","#f97316","#8b5cf6"][i % 5],
        delay: i * 0.08,
      }))
    : [];

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        animation: "overlayIn 0.25s ease",
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        width: 380, maxWidth: "90vw",
        background: dark ? "#161b22" : "#ffffff",
        borderRadius: 24, overflow: "hidden",
        border: `1.5px solid ${tier.color}40`,
        boxShadow: `0 24px 60px rgba(0,0,0,0.3), 0 0 0 1px ${tier.color}20`,
        animation: "popupBounce 0.5s cubic-bezier(0.34,1.56,0.64,1) both",
        position: "relative",
      }}>
        {/* Top accent bar */}
        <div style={{ height: 4, background: `linear-gradient(90deg, ${tier.color}, ${tier.color}88, transparent)` }} />

        {/* Confetti particles for high score */}
        {particles.map((p, i) => (
          <div key={i} style={{
            position: "absolute", top: "30%", left: "50%",
            width: 8, height: 8, borderRadius: "50%",
            background: p.color, pointerEvents: "none",
            animation: `confetti${i % 4} 1.2s ${p.delay}s ease-out both`,
            transform: `rotate(${p.angle}deg)`,
            zIndex: 0,
          }} />
        ))}

        {/* Header */}
        <div style={{
          padding: "28px 28px 0",
          textAlign: "center", position: "relative", zIndex: 1,
        }}>
          {/* Big emoji bounce */}
          <div style={{
            fontSize: 52, lineHeight: 1, marginBottom: 8,
            animation: "emojiBounce 0.6s cubic-bezier(0.34,1.56,0.64,1) both 0.15s",
            display: "inline-block",
          }}>
            {tier.emoji}
          </div>
          <div style={{
            fontSize: 20, fontWeight: 900, color: tier.color,
            fontFamily: "system-ui", marginBottom: 4,
            animation: "fadeSlideUp 0.4s ease both 0.3s",
          }}>
            {tier.label}
          </div>
          <div style={{
            fontSize: 13, color: dark ? "#6b7280" : "#9ca3af", fontWeight: 500,
            animation: "fadeSlideUp 0.4s ease both 0.4s",
          }}>
            {tier.msg}
          </div>
        </div>

        {/* Ring + score */}
        <div style={{
          display: "flex", justifyContent: "center", padding: "24px 28px 0",
          animation: "fadeSlideUp 0.4s ease both 0.35s",
          position: "relative", zIndex: 1,
        }}>
          <div style={{ position: "relative", width: 120, height: 120 }}>
            <svg viewBox="0 0 100 100" style={{ width: 120, height: 120, transform: "rotate(-90deg)" }}>
              {/* Track */}
              <circle cx="50" cy="50" r="40" fill="none"
                stroke={dark ? "#21262d" : "#f0f0f0"} strokeWidth="8" />
              {/* Progress */}
              <circle cx="50" cy="50" r="40" fill="none"
                stroke={tier.color} strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${(progress / 100) * circumference} ${circumference}`}
                style={{ animation: "ringDraw 1.2s cubic-bezier(0.4,0,0.2,1) both 0.5s", transition: "stroke-dasharray 1.2s ease" }}
              />
            </svg>
            <div style={{
              position: "absolute", inset: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexDirection: "column",
            }}>
              <span style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 900, fontSize: 22, color: tier.color, lineHeight: 1,
                animation: "countUp 1s ease both 0.6s",
              }}>
                {pct !== null ? `${pct}%` : "✓"}
              </span>
              {pct !== null && (
                <span style={{ fontSize: 10, color: dark ? "#6b7280" : "#9ca3af", marginTop: 2 }}>score</span>
              )}
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: total !== null ? "1fr 1fr 1fr" : "1fr 1fr",
          gap: 10, padding: "20px 28px",
          animation: "fadeSlideUp 0.4s ease both 0.5s",
          position: "relative", zIndex: 1,
        }}>
          {/* Score */}
          <div style={{
            background: dark ? "#0d1117" : tier.bg,
            border: `1.5px solid ${tier.color}30`,
            borderRadius: 14, padding: "14px 8px", textAlign: "center",
          }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 900, fontSize: 24, color: tier.color, lineHeight: 1 }}>
              {score}
            </div>
            <div style={{ fontSize: 11, color: dark ? "#6b7280" : "#9ca3af", marginTop: 4, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Score
            </div>
          </div>

          {/* Total / Max */}
          {total !== null && (
            <div style={{
              background: dark ? "#0d1117" : "#f9fafb",
              border: `1.5px solid ${dark ? "#21262d" : "#e5e7eb"}`,
              borderRadius: 14, padding: "14px 8px", textAlign: "center",
            }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 900, fontSize: 24, color: dark ? "#e6edf3" : "#374151", lineHeight: 1 }}>
                {total}
              </div>
              <div style={{ fontSize: 11, color: dark ? "#6b7280" : "#9ca3af", marginTop: 4, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Total Qs
              </div>
            </div>
          )}

          {/* Correct */}
          {correct !== null ? (
            <div style={{
              background: dark ? "#0d1117" : "#f0fdf4",
              border: "1.5px solid #10b98130",
              borderRadius: 14, padding: "14px 8px", textAlign: "center",
            }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 900, fontSize: 24, color: "#10b981", lineHeight: 1 }}>
                {correct}
              </div>
              <div style={{ fontSize: 11, color: dark ? "#6b7280" : "#9ca3af", marginTop: 4, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Correct
              </div>
            </div>
          ) : total !== null ? (
            <div style={{
              background: dark ? "#0d1117" : "#f9fafb",
              border: `1.5px solid ${dark ? "#21262d" : "#e5e7eb"}`,
              borderRadius: 14, padding: "14px 8px", textAlign: "center",
            }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 900, fontSize: 24, color: tier.color, lineHeight: 1 }}>
                {pct}%
              </div>
              <div style={{ fontSize: 11, color: dark ? "#6b7280" : "#9ca3af", marginTop: 4, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Accuracy
              </div>
            </div>
          ) : null}
        </div>

        {/* Exam info row */}
        <div style={{
          margin: "0 28px 20px",
          padding: "12px 16px",
          background: dark ? "#0d1117" : "#f9fafb",
          border: `1px solid ${dark ? "#21262d" : "#e5e7eb"}`,
          borderRadius: 12,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          animation: "fadeSlideUp 0.4s ease both 0.55s",
          position: "relative", zIndex: 1,
        }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: dark ? "#e6edf3" : "#111827" }}>
              {exam?.title || "Exam"}
            </div>
            <div style={{ fontSize: 11, color: dark ? "#6b7280" : "#9ca3af", marginTop: 2 }}>
              {exam?.examType || "EXAM"} · {exam?.durationMinutes ?? 60} min
            </div>
          </div>
          <div style={{
            fontSize: 10, fontWeight: 800, padding: "3px 10px", borderRadius: 20,
            background: tier.color + "18", color: tier.color,
            border: `1px solid ${tier.color}35`,
            textTransform: "uppercase", letterSpacing: "0.07em",
          }}>
            {pct !== null
              ? pct >= 75 ? "🎉 Excellent" : pct >= 50 ? "👍 Good" : "📚 Review"
              : "✅ Done"}
          </div>
        </div>

        {/* Close button */}
        <div style={{ padding: "0 28px 24px", position: "relative", zIndex: 1 }}>
          <button onClick={onClose} style={{
            width: "100%", padding: "12px",
            background: `linear-gradient(135deg, ${tier.color}, ${tier.color}cc)`,
            border: "none", borderRadius: 14,
            color: "#fff", fontSize: 14, fontWeight: 800,
            cursor: "pointer", fontFamily: "system-ui",
            boxShadow: `0 4px 16px ${tier.color}40`,
            transition: "all .15s",
          }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

const STATUS_CFG = {
  live:      { color: "#10b981", bg: "#f0fdf4", border: "#bbf7d0", darkBg: "rgba(16,185,129,.1)",  darkBorder: "rgba(16,185,129,.25)", label: "Live Now",  dot: true  },
  upcoming:  { color: "#f97316", bg: "#fff7ed", border: "#fed7aa", darkBg: "rgba(249,115,22,.1)",  darkBorder: "rgba(249,115,22,.25)", label: "Upcoming",  dot: false },
  completed: { color: "#6b7280", bg: "#f9fafb", border: "#e5e7eb", darkBg: "rgba(107,114,128,.1)", darkBorder: "rgba(107,114,128,.2)", label: "Completed", dot: false },
  missed:    { color: "#ef4444", bg: "#fef2f2", border: "#fecaca", darkBg: "rgba(239,68,68,.1)",   darkBorder: "rgba(239,68,68,.2)",   label: "Missed",    dot: false },
};

const EXAM_TYPE_CFG = {
  ALL:    { label: "All Exams",  icon: "📋", color: "#6b7280" },
  DAILY:  { label: "Daily",     icon: "📅", color: "#10b981" },
  WEEKLY: { label: "Weekly",    icon: "📊", color: "#3b82f6" },
  EXAM:   { label: "Main Exam", icon: "🎓", color: "#f97316" },
};

function ExamCard({ exam, submissionMap, onStartExam, dark }) {
  const [showScore, setShowScore] = useState(false);

  const ws        = getWindowStatus(exam);
  const cfg       = STATUS_CFG[ws] || STATUS_CFG.upcoming;
  const start     = exam.scheduledStartTime?.toDate?.() ?? new Date(exam.scheduledStartTime);
  const end_      = endTime(exam);
  const totalMins = exam.durationMinutes ?? 60;
  const qCount    = exam.questionIds?.length ?? 0;

  const sub          = submissionMap[exam.id];
  const isAttempted  = sub?.status === "completed";
  const isInProgress = sub && sub.status !== "completed";

  const examType = exam.examType || "EXAM";
  const typeCfg  = EXAM_TYPE_CFG[examType] || EXAM_TYPE_CFG.EXAM;

  const borderColor = ws === "live" && !isAttempted
    ? (dark ? cfg.darkBorder : cfg.border)
    : (dark ? "#21262d" : "#e5e7eb");

  const bg = dark
    ? (ws === "live" && !isAttempted ? cfg.darkBg : "#161b22")
    : (ws === "live" && !isAttempted ? cfg.bg : "#ffffff");

  return (
    <>
      <div style={{
        background: bg, border: `1.5px solid ${borderColor}`, borderRadius: 16,
        overflow: "hidden", transition: "all .2s ease",
        boxShadow: ws === "live" && !isAttempted ? `0 0 0 3px ${cfg.color}18` : "none",
      }}>
        {ws === "live" && !isAttempted && (
          <div style={{ height: 3, background: `linear-gradient(90deg, ${cfg.color}, #3b82f6)` }} />
        )}
        <div style={{ padding: "20px 24px" }}>

          {/* Row 1: title + badges */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 14 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: dark ? "#e6edf3" : "#111827", fontFamily: "'Trebuchet MS', system-ui, sans-serif", lineHeight: 1.3, margin: 0 }}>
                  {exam.title}
                </h3>
                <span style={{
                  fontSize: 10, fontWeight: 800, padding: "2px 8px", borderRadius: 20,
                  background: `${typeCfg.color}18`, color: typeCfg.color,
                  border: `1px solid ${typeCfg.color}35`,
                  textTransform: "uppercase", letterSpacing: "0.07em", flexShrink: 0,
                }}>
                  {typeCfg.icon} {examType}
                </span>
              </div>
              {exam.description && (
                <p style={{ fontSize: 13, color: dark ? "#8b949e" : "#6b7280", lineHeight: 1.5, margin: 0 }}>
                  {exam.description.substring(0, 90)}{exam.description.length > 90 ? "..." : ""}
                </p>
              )}
            </div>
            <div style={{ flexShrink: 0 }}>
              {!isAttempted && (
                <span style={{
                  display: "flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 800,
                  padding: "4px 10px", borderRadius: 20,
                  background: dark ? cfg.darkBg : cfg.bg, color: cfg.color,
                  border: `1px solid ${dark ? cfg.darkBorder : cfg.border}`,
                  textTransform: "uppercase", letterSpacing: "0.07em",
                  animation: ws === "live" ? "livePulse 2s infinite" : "none",
                }}>
                  {cfg.dot && <span style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.color, flexShrink: 0 }} />}
                  {cfg.label}
                </span>
              )}
            </div>
          </div>

          {/* Row 2: meta pills */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
            {[
              exam.scheduledStartTime && { icon: "📅", val: fmtDate(start) },
              exam.scheduledStartTime && { icon: "🕗", val: `${fmtTime(start)} – ${fmtTime(end_)}` },
              { icon: "⏱", val: durationLabel(totalMins) },
              { icon: "❓", val: `${qCount} Q` },
            ].filter(Boolean).map(({ icon, val }, i) => (
              <span key={i} style={{
                display: "flex", alignItems: "center", gap: 4, fontSize: 12,
                color: dark ? "#8b949e" : "#6b7280",
                background: dark ? "#21262d" : "#f3f4f6",
                border: `1px solid ${dark ? "#30363d" : "#e5e7eb"}`,
                borderRadius: 8, padding: "3px 10px", fontFamily: "system-ui",
              }}>
                {icon} <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>{val}</span>
              </span>
            ))}
          </div>

          {/* Row 3: score icon OR countdown + CTA */}
          {isAttempted ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
              <ScoreIconButton
                sub={sub}
                examType={examType}
                dark={dark}
                onClick={() => setShowScore(true)}
              />
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
              <CountdownBadge exam={exam} ws={ws} />
              <div style={{ marginLeft: "auto" }}>
                {isInProgress ? (
                  <button onClick={() => onStartExam(exam.id, sub.id)}
                    style={{ background: "#f97316", border: "none", borderRadius: 10, padding: "9px 22px", color: "#fff", fontSize: 13, fontWeight: 800, cursor: "pointer", fontFamily: "system-ui", display: "flex", alignItems: "center", gap: 8, boxShadow: "0 4px 12px rgba(249,115,22,.3)" }}>
                    ▶ Resume Exam
                  </button>
                ) : ws === "live" ? (
                  <button onClick={() => onStartExam(exam.id, null)}
                    style={{ background: `linear-gradient(135deg, ${cfg.color}, #3b82f6)`, border: "none", borderRadius: 10, padding: "9px 22px", color: "#fff", fontSize: 13, fontWeight: 800, cursor: "pointer", fontFamily: "system-ui", display: "flex", alignItems: "center", gap: 8, boxShadow: `0 4px 14px ${cfg.color}40` }}>
                    ▶ Start Exam
                  </button>
                ) : ws === "upcoming" ? (
                  <button disabled style={{ background: dark ? "#21262d" : "#f3f4f6", border: `1px solid ${dark ? "#30363d" : "#e5e7eb"}`, borderRadius: 10, padding: "9px 22px", color: dark ? "#6b7280" : "#9ca3af", fontSize: 13, fontWeight: 700, cursor: "not-allowed", fontFamily: "system-ui" }}>
                    🔒 Not Yet Open
                  </button>
                ) : (
                  <span style={{ fontSize: 13, color: dark ? "#6b7280" : "#9ca3af", fontWeight: 600 }}>
                    {ws === "missed" ? "⛔ Window Closed" : "✓ Ended"}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Score Popup */}
      {showScore && (
        <ScorePopup
          sub={sub}
          exam={exam}
          dark={dark}
          onClose={() => setShowScore(false)}
        />
      )}
    </>
  );
}

export default function ExamsView({ exams, currentUser, onStartExam, T }) {
  const [examTypeFilter, setExamTypeFilter] = useState("ALL");
  const [statusFilter,   setStatusFilter]   = useState("all");
  const [submissionMap,  setSubMap]         = useState({});
  const [loadingSubs,    setLoadingSubs]     = useState(true);

  const dark = T?.bg === "#0d1117" || (T?.bg || "").startsWith("#0");

  useEffect(() => {
    if (!currentUser?.uid) { setLoadingSubs(false); return; }
    const fetchSubs = async () => {
      setLoadingSubs(true);
      try {
        const q    = query(collection(db, "submissions"), where("studentId", "==", currentUser.uid));
        const snap = await getDocs(q);
        const map  = {};
        snap.docs.forEach(d => {
          const data = d.data();
          if (!data.examId) return;
          const existing = map[data.examId];
          if (!existing || data.status === "completed" || !existing.status) {
            map[data.examId] = { id: d.id, ...data };
          }
        });
        setSubMap(map);
      } catch (e) { console.error("Submission check:", e); }
      setLoadingSubs(false);
    };
    fetchSubs();
  }, [currentUser?.uid]);

  const typeFiltered = examTypeFilter === "ALL"
    ? exams
    : exams.filter(e => (e.examType || "EXAM") === examTypeFilter);

  const withStatus = typeFiltered.map(e => ({ ...e, ws: getWindowStatus(e) }));

  const counts = {
    all:       withStatus.length,
    live:      withStatus.filter(e => e.ws === "live").length,
    upcoming:  withStatus.filter(e => e.ws === "upcoming").length,
    completed: withStatus.filter(e => e.ws === "completed" || e.ws === "missed").length,
  };

  const displayed = statusFilter === "all" ? withStatus
    : statusFilter === "completed"
      ? withStatus.filter(e => e.ws === "completed" || e.ws === "missed")
      : withStatus.filter(e => e.ws === statusFilter);

  const liveExams = withStatus.filter(e => e.ws === "live" && !submissionMap[e.id]);

  const typeCounts = {
    ALL:    exams.length,
    DAILY:  exams.filter(e => (e.examType || "EXAM") === "DAILY").length,
    WEEKLY: exams.filter(e => (e.examType || "EXAM") === "WEEKLY").length,
    EXAM:   exams.filter(e => (e.examType || "EXAM") === "EXAM").length,
  };

  const handleStart = (examId, existingSubId) => {
    const sub = submissionMap[examId];
    if (sub?.status === "completed") {
      alert("You have already submitted this exam. Re-entry is not allowed.");
      return;
    }
    onStartExam(examId, existingSubId || sub?.id || null);
  };

  return (
    <div style={{ fontFamily: "system-ui, sans-serif" }} className="section-enter">
      <style>{`
        @keyframes livePulse    { 0%,100%{opacity:1} 50%{opacity:.65} }
        @keyframes fadeUp       { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin         { to{transform:rotate(360deg)} }
        @keyframes scoreReveal  { from{opacity:0;transform:scale(0.88) translateY(8px)} to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes ringDraw     { from{stroke-dasharray:0 251.2} }
        @keyframes overlayIn    { from{opacity:0} to{opacity:1} }
        @keyframes popupBounce  { from{opacity:0;transform:scale(0.7) translateY(40px)} to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes emojiBounce  { from{opacity:0;transform:scale(0.3) rotate(-20deg)} to{opacity:1;transform:scale(1) rotate(0deg)} }
        @keyframes fadeSlideUp  { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes scorePulseRing { 0%,100%{box-shadow:0 0 0 0 rgba(16,185,129,0.4)} 50%{box-shadow:0 0 0 6px rgba(16,185,129,0)} }
        @keyframes rippleOut    { 0%{opacity:0.7;transform:scale(1)} 100%{opacity:0;transform:scale(1.8)} }
        @keyframes confetti0    { 0%{opacity:1;transform:rotate(0deg) translateX(0)} 100%{opacity:0;transform:rotate(0deg) translateX(80px) translateY(-60px)} }
        @keyframes confetti1    { 0%{opacity:1;transform:rotate(90deg) translateX(0)} 100%{opacity:0;transform:rotate(90deg) translateX(70px) translateY(-70px)} }
        @keyframes confetti2    { 0%{opacity:1;transform:rotate(180deg) translateX(0)} 100%{opacity:0;transform:rotate(180deg) translateX(80px) translateY(-50px)} }
        @keyframes confetti3    { 0%{opacity:1;transform:rotate(270deg) translateX(0)} 100%{opacity:0;transform:rotate(270deg) translateX(60px) translateY(-80px)} }
        .exam-card-enter        { animation: fadeUp .3s ease both; }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontFamily: "'Trebuchet MS', system-ui", fontWeight: 900, fontSize: "1.75rem", color: T?.text || "#111827", letterSpacing: "-0.02em" }}>
          Examination Portal
        </h2>
        <p style={{ fontSize: 14, color: T?.textFaint || "#9ca3af", marginTop: 4 }}>
          Full-screen proctored mode · MCQ + Coding · One attempt per exam
        </p>
      </div>

      {/* Live alert */}
      {liveExams.length > 0 && (
        <div style={{
          background: dark ? "rgba(16,185,129,.08)" : "#f0fdf4",
          border: "1.5px solid rgba(16,185,129,.3)", borderRadius: 14,
          padding: "14px 20px", marginBottom: 20,
          display: "flex", alignItems: "center", gap: 14,
          animation: "fadeUp .3s ease",
        }}>
          <span style={{ fontSize: 22, animation: "livePulse 1.5s infinite" }}>🟢</span>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: "#10b981" }}>
              {liveExams.length} exam{liveExams.length > 1 ? "s are" : " is"} live right now!
            </div>
            <div style={{ fontSize: 13, color: T?.textFaint || "#6b7280", marginTop: 2 }}>
              Start immediately — the window is open.
            </div>
          </div>
        </div>
      )}

      {/* Exam Type Filter */}
      <div style={{ marginBottom: 16 }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: T?.textFaint || "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
          Category
        </p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {Object.entries(EXAM_TYPE_CFG).map(([key, cfg]) => {
            const active = examTypeFilter === key;
            return (
              <button key={key} onClick={() => { setExamTypeFilter(key); setStatusFilter("all"); }}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  background: active
                    ? (key === "ALL" ? (dark ? "#30363d" : "#374151") : `${cfg.color}18`)
                    : (dark ? "#21262d" : "#f3f4f6"),
                  border: `1.5px solid ${active
                    ? (key === "ALL" ? (dark ? "#555" : "#374151") : `${cfg.color}45`)
                    : (dark ? "#30363d" : "#e5e7eb")}`,
                  borderRadius: 10, padding: "8px 16px",
                  color: active ? (key === "ALL" ? "#fff" : cfg.color) : (dark ? "#8b949e" : "#6b7280"),
                  fontSize: 13, fontWeight: active ? 800 : 500, cursor: "pointer",
                  fontFamily: "system-ui", transition: "all .15s",
                }}>
                <span>{cfg.icon}</span>
                <span>{cfg.label}</span>
                <span style={{ background: dark ? "#30363d" : "#e5e7eb", color: dark ? "#8b949e" : "#6b7280", padding: "1px 7px", borderRadius: 20, fontSize: 11, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>
                  {typeCounts[key]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Status Sub-tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
        {["all", "live", "upcoming", "completed"].map(f => {
          const active = statusFilter === f;
          const color  = f === "live" ? "#10b981" : f === "upcoming" ? "#f97316" : f === "completed" ? "#6b7280" : (dark ? "#8b949e" : "#374151");
          return (
            <button key={f} onClick={() => setStatusFilter(f)}
              style={{
                background: active ? (dark ? `${color}15` : `${color}12`) : (dark ? "#21262d" : "#f3f4f6"),
                border: `1.5px solid ${active ? `${color}40` : (dark ? "#30363d" : "#e5e7eb")}`,
                borderRadius: 10, padding: "6px 14px",
                color: active ? color : (dark ? "#8b949e" : "#6b7280"),
                fontSize: 12, fontWeight: active ? 800 : 500, cursor: "pointer",
                fontFamily: "system-ui", transition: "all .15s",
              }}>
              {f === "live" && "● "}
              {f.charAt(0).toUpperCase() + f.slice(1)}
              <span style={{ marginLeft: 6, background: dark ? "#30363d" : "#e5e7eb", color: dark ? "#8b949e" : "#6b7280", padding: "1px 7px", borderRadius: 20, fontSize: 11, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>
                {counts[f] ?? 0}
              </span>
            </button>
          );
        })}
      </div>

      {/* Cards */}
      {loadingSubs ? (
        <div style={{ textAlign: "center", padding: "3rem", color: T?.textFaint || "#9ca3af" }}>
          <div style={{ width: 32, height: 32, border: "3px solid #10b981", borderTopColor: "transparent", borderRadius: "50%", animation: "spin .8s linear infinite", margin: "0 auto 12px" }} />
          Checking your submissions...
        </div>
      ) : displayed.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3rem 2rem", border: `1.5px dashed ${dark ? "#30363d" : "#e5e7eb"}`, borderRadius: 16, color: T?.textFaint || "#9ca3af", fontSize: 15 }}>
          No {examTypeFilter !== "ALL" ? EXAM_TYPE_CFG[examTypeFilter].label + " " : ""}
          {statusFilter === "all" ? "" : statusFilter + " "}exams found.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {displayed.map((exam, i) => (
            <div key={exam.id} className="exam-card-enter" style={{ animationDelay: `${i * 60}ms` }}>
              <ExamCard exam={exam} submissionMap={submissionMap} onStartExam={handleStart} dark={dark} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}