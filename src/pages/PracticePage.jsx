

// // import React, { useEffect, useState, useRef, useCallback } from "react";
// // import { useParams, useHistory } from "react-router-dom";
// // import Editor from "@monaco-editor/react";
// // import {
// //   collection, query, where, getDocs, addDoc, serverTimestamp,
// // } from "firebase/firestore";
// // import { db } from "../firebase/config";
// // import { useAuth } from "../hooks/useAuth";
// // import { executeCode } from "../api/compilerService";

// // const LANGUAGES = [
// //   { label: "C++",        value: "cpp",        monaco: "cpp"        },
// //   { label: "Python",     value: "python",     monaco: "python"     },
// //   { label: "JavaScript", value: "javascript", monaco: "javascript" },
// //   { label: "Java",       value: "java",       monaco: "java"       },
// //   { label: "C",          value: "c",          monaco: "c"          },
// // ];
// // const BOILERPLATE = {
// //   cpp:        "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    // Write your solution here\n    return 0;\n}\n",
// //   python:     "# Write your solution here\ndef solution():\n    pass\n",
// //   javascript: "// Write your solution here\nfunction solution() {\n\n}\n",
// //   java:       "public class Solution {\n    public static void main(String[] args) {\n        // Write your solution here\n    }\n}\n",
// //   c:          "#include <stdio.h>\n\nint main() {\n    // Write your solution here\n    return 0;\n}\n",
// // };
// // const DIFF_COLOR = {
// //   dark:  { Easy:"#34d399", Medium:"#fbbf24", Hard:"#f87171" },
// //   light: { Easy:"#16a34a", Medium:"#d97706", Hard:"#dc2626" },
// // };

// // function usePanelDrag(onMove) {
// //   return useCallback((e) => {
// //     e.preventDefault();
// //     const ox = e.clientX, oy = e.clientY;
// //     const mv = (ev) => onMove(ev.clientX - ox, ev.clientY - oy);
// //     const up = () => { window.removeEventListener("mousemove", mv); window.removeEventListener("mouseup", up); };
// //     window.addEventListener("mousemove", mv);
// //     window.addEventListener("mouseup", up);
// //   }, [onMove]);
// // }

// // /**
// //  * PracticePage
// //  *
// //  * Two usage modes:
// //  *  1. Standalone route  — <Route path="/practice/:topicId" component={PracticePage} />
// //  *     Uses useParams() to fetch questions by category from Firestore.
// //  *
// //  *  2. Embedded inside StudentDashboard — pass props directly:
// //  *     <PracticePage
// //  *       embeddedQuestions={[...]}   // array of question objects already fetched
// //  *       initialIndex={2}            // which question to open first (default 0)
// //  *       onBack={() => ...}          // callback when user clicks "Problem List"
// //  *     />
// //  */
// // export default function PracticePage({ embeddedQuestions, initialIndex = 0, onBack }) {
// //   /* ── routing (only used in standalone mode) ── */
// //   const params  = useParams?.() ?? {};
// //   const history = useHistory?.();
// //   const topicId = params.topicId;

// //   const { user } = useAuth();

// //   /* ── question state ── */
// //   const [questions,  setQuestions]  = useState(embeddedQuestions ?? []);
// //   const [currentIdx, setCurrentIdx] = useState(initialIndex);
// //   const [loading,    setLoading]    = useState(!embeddedQuestions);

// //   /* ── editor / run state ── */
// //   const [language,     setLanguage]     = useState("cpp");
// //   const [code,         setCode]         = useState(BOILERPLATE.cpp);
// //   const [activeTab,    setActiveTab]    = useState("testcase");
// //   const [stdin,        setStdin]        = useState("");
// //   const [output,       setOutput]       = useState("");
// //   const [isRunning,    setIsRunning]    = useState(false);
// //   const [isSubmitting, setIsSubmitting] = useState(false);
// //   const [verdict,      setVerdict]      = useState(null);
// //   const [dark,         setDark]         = useState(true);

// //   const containerRef = useRef(null);
// //   const [leftPct,   setLeftPct]   = useState(42);
// //   const [editorPct, setEditorPct] = useState(63);

// //   /* ── theme tokens ── */
// //   const D = dark;
// //   const pageBg      = D ? "#0d1117" : "#f0f2f5";
// //   const navBg       = D ? "#161b22" : "#ffffff";
// //   const navBorder   = D ? "#21262d" : "#e2e8f0";
// //   const navText     = D ? "#e2e8f0" : "#1e293b";
// //   const navMuted    = D ? "#6b7280" : "#94a3b8";
// //   const panelBg     = D ? "#161b22" : "#ffffff";
// //   const panelBorder = D ? "#21262d" : "#e2e8f0";
// //   const heading     = D ? "#f1f5f9" : "#0f172a";
// //   const bodyText    = D ? "#cbd5e1" : "#334155";
// //   const mutedText   = D ? "#6b7280" : "#64748b";
// //   const codeBg      = D ? "#0d1117" : "#f1f5f9";
// //   const termBg      = D ? "#0d1117" : "#ffffff";
// //   const termText    = D ? "#e6edf3" : "#1f2937";
// //   const termBorder  = D ? "#21262d" : "#e5e7eb";
// //   const termEmpty   = D ? "#4b5563" : "#9ca3af";
// //   const termInput   = D ? "#0d1117" : "#f9fafb";
// //   const selectBg    = D ? "#161b22" : "#ffffff";
// //   const selectText  = D ? "#e2e8f0" : "#1e293b";
// //   const dragBg      = D ? "#21262d" : "#cbd5e1";
// //   const tabInactive = D ? "#6b7280" : "#64748b";
// //   const tabActive   = D ? "#ffffff" : "#0f172a";
// //   const diffColor   = (d) => (D ? DIFF_COLOR.dark : DIFF_COLOR.light)[d] || "#fbbf24";
// //   const btnRunBg    = D ? "#21262d" : "#f1f5f9";
// //   const btnRunBd    = D ? "#30363d" : "#cbd5e1";
// //   const btnRunTx    = D ? "#e2e8f0" : "#1e293b";
// //   const codeBlockBd = D ? "#21262d" : "#e2e8f0";
// //   const pillBg      = D ? "#21262d" : "#f1f5f9";
// //   const pillBd      = D ? "#30363d" : "#e2e8f0";

// //   /* ── Standalone mode: fetch questions by topicId ── */
// //   const categoryVariants = topicId ? (() => {
// //     const raw = topicId.replace(/-/g, " ");
// //     return [...new Set([raw, raw.replace(/\b\w/g, c => c.toUpperCase()), raw.toUpperCase(), topicId])];
// //   })() : [];

// //   useEffect(() => {
// //     if (embeddedQuestions) return; // embedded mode — questions already provided
// //     if (!topicId || !categoryVariants.length) return;
// //     (async () => {
// //       try {
// //         let docs = [];
// //         for (const v of categoryVariants) {
// //           const snap = await getDocs(query(collection(db, "questions"), where("category", "==", v)));
// //           docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
// //           if (docs.length) break;
// //         }
// //         const coding = docs.filter(d => !d.type || d.type === "CODING");
// //         setQuestions(coding.length ? coding : docs);
// //         if (docs[0]?.boilerplate) setCode(docs[0].boilerplate);
// //       } finally { setLoading(false); }
// //     })();
// //   }, [topicId]);

// //   /* ── sync when embeddedQuestions prop changes ── */
// //   useEffect(() => {
// //     if (!embeddedQuestions) return;
// //     setQuestions(embeddedQuestions);
// //     setCurrentIdx(initialIndex);
// //     const q = embeddedQuestions[initialIndex];
// //     setCode(q?.boilerplate ?? BOILERPLATE[language]);
// //     setOutput(""); setVerdict(null); setActiveTab("testcase");
// //   }, [embeddedQuestions, initialIndex]);

// //   /* ── navigation helpers ── */
// //   const goTo = (idx) => {
// //     setCurrentIdx(idx);
// //     setCode(questions[idx]?.boilerplate ?? BOILERPLATE[language]);
// //     setOutput(""); setActiveTab("testcase"); setVerdict(null);
// //   };
// //   const handleLang = (lang) => {
// //     setLanguage(lang);
// //     setCode(questions[currentIdx]?.boilerplate ?? BOILERPLATE[lang]);
// //   };
// //   const handleBack = () => {
// //     if (onBack) { onBack(); return; }
// //     if (history) history.push("/dashboard");
// //   };

// //   /* ── run / submit ── */
// //   const handleRun = async () => {
// //     if (!code.trim()) return;
// //     setIsRunning(true); setActiveTab("result"); setOutput("");
// //     try {
// //       const r = await executeCode(language, code, stdin);
// //       setOutput(r.compile_output ? "Compilation Error:\n" + r.compile_output
// //         : r.stderr ? "Runtime Error:\n" + r.stderr
// //         : r.stdout || "// No output");
// //     } catch (e) { setOutput("Error: " + e.message); }
// //     finally { setIsRunning(false); }
// //   };

// //   const handleSubmit = async () => {
// //     if (!user || !questions[currentIdx]) return;
// //     setIsSubmitting(true); setActiveTab("result"); setOutput("Evaluating…");
// //     try {
// //       const r   = await executeCode(language, code, stdin);
// //       const out = r.stdout?.trim() ?? "";
// //       const exp = questions[currentIdx]?.correctAnswer?.trim() ?? "";
// //       const ok  = out === exp || !exp;
// //       setVerdict(ok ? "accepted" : "wrong");
// //       setOutput(ok
// //         ? `✅  Accepted\n\nOutput:\n${out}`
// //         : `❌  Wrong Answer\n\nExpected:\n${exp}\n\nYour Output:\n${out}`);
// //       await addDoc(collection(db, "submissions"), {
// //         studentId: user.uid, questionId: questions[currentIdx].id,
// //         code, language, type: "practice",
// //         status: ok ? "accepted" : "wrong_answer", submittedAt: serverTimestamp(),
// //       });
// //     } catch (e) { setOutput("Error: " + e.message); }
// //     finally { setIsSubmitting(false); }
// //   };

// //   /* ── panel drag ── */
// //   const horizDrag = usePanelDrag(useCallback((dx) => {
// //     if (!containerRef.current) return;
// //     setLeftPct(p => Math.min(72, Math.max(22, p + (dx / containerRef.current.offsetWidth) * 100)));
// //   }, []));
// //   const vertDrag = usePanelDrag(useCallback((_, dy) => {
// //     if (!containerRef.current) return;
// //     setEditorPct(p => Math.min(85, Math.max(25, p + (dy / containerRef.current.offsetHeight) * 100)));
// //   }, []));

// //   /* ── loading / empty states ── */
// //   if (loading) return (
// //     <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100%", minHeight:400, background: pageBg }}>
// //       <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:12 }}>
// //         <div style={{ width:28, height:28, border:"2.5px solid #ffa116", borderTopColor:"transparent", borderRadius:"50%", animation:"spin 0.8s linear infinite" }} />
// //         <span style={{ color:"#6b7280", fontSize:14 }}>Loading…</span>
// //       </div>
// //     </div>
// //   );
// //   if (!questions.length) return (
// //     <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:"100%", minHeight:400, background: pageBg, color: mutedText, fontSize:14, gap:16 }}>
// //       <span>No questions found{topicId ? ` for "${topicId}"` : ""}.</span>
// //       <button onClick={handleBack} style={{ background:"#ffa116", border:"none", borderRadius:6, padding:"6px 16px", fontSize:12, fontWeight:600, color:"#000", cursor:"pointer" }}>← Go Back</button>
// //     </div>
// //   );

// //   const q       = questions[currentIdx];
// //   const langObj = LANGUAGES.find(l => l.value === language) ?? LANGUAGES[0];

// //   /* ── render ── */
// //   return (
// //     <div style={{ display:"flex", flexDirection:"column", height:"100%", minHeight:0, overflow:"hidden", background: pageBg, fontFamily:"'Segoe UI',system-ui,sans-serif", transition:"background 0.25s" }}>
// //       <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>

// //       {/* ── NAV BAR ── */}
// //       <nav style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 12px", height:44, flexShrink:0, background: navBg, borderBottom:`1px solid ${navBorder}`, transition:"background 0.25s,border-color 0.25s" }}>

// //         {/* left */}
// //         <div style={{ display:"flex", alignItems:"center", gap:8 }}>
// //           <button onClick={handleBack}
// //             style={{ display:"flex", alignItems:"center", gap:6, background:"none", border:"none", color: navMuted, cursor:"pointer", fontSize:12, fontFamily:"inherit" }}
// //             onMouseEnter={e => e.currentTarget.style.color = navText}
// //             onMouseLeave={e => e.currentTarget.style.color = navMuted}>
// //             <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
// //               <path d="M2 3h7M2 6h5M2 9h6M2 12h4"/><path d="M11 8l3 3-3 3"/><line x1="14" y1="11" x2="8" y2="11"/>
// //             </svg>
// //             <span style={{ fontWeight:500 }}>Problem List</span>
// //           </button>
// //           <div style={{ width:1, height:16, background: navBorder }} />
// //           <div style={{ display:"flex", alignItems:"center", gap:2 }}>
// //             {[
// //               { dis: currentIdx===0,                  go: ()=>goTo(currentIdx-1), d:"M15 19l-7-7 7-7" },
// //               { dis: currentIdx===questions.length-1, go: ()=>goTo(currentIdx+1), d:"M9 5l7 7-7 7"    },
// //             ].map((b,i) => (
// //               <button key={i} disabled={b.dis} onClick={b.go}
// //                 style={{ background:"none", border:"none", borderRadius:6, padding:6, color: navMuted, cursor: b.dis?"not-allowed":"pointer", opacity: b.dis?0.3:1, fontFamily:"inherit" }}
// //                 onMouseEnter={e => { if(!b.dis) e.currentTarget.style.background=navBorder; }}
// //                 onMouseLeave={e => e.currentTarget.style.background="none"}>
// //                 <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={b.d}/>
// //                 </svg>
// //               </button>
// //             ))}
// //           </div>
// //         </div>

// //         {/* center */}
// //         <div style={{ display:"flex", alignItems:"center", gap:8 }}>
// //           <button onClick={handleRun} disabled={isRunning||isSubmitting}
// //             style={{ display:"flex", alignItems:"center", gap:6, padding:"6px 12px", borderRadius:6, fontSize:12, fontWeight:600, cursor:(isRunning||isSubmitting)?"not-allowed":"pointer", opacity:(isRunning||isSubmitting)?0.5:1, background: btnRunBg, border:`1px solid ${btnRunBd}`, color: btnRunTx, transition:"all 0.15s", fontFamily:"inherit" }}>
// //             {isRunning
// //               ? <span style={{ width:12, height:12, border:`1px solid ${navMuted}`, borderTopColor:"transparent", borderRadius:"50%", animation:"spin 0.8s linear infinite", display:"inline-block" }}/>
// //               : <svg width="14" height="14" fill="#3fb950" viewBox="0 0 20 20"><path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/></svg>
// //             }
// //             Run
// //           </button>
// //           <button onClick={handleSubmit} disabled={isRunning||isSubmitting}
// //             style={{ display:"flex", alignItems:"center", gap:6, padding:"6px 16px", borderRadius:6, fontSize:12, fontWeight:600, cursor:(isRunning||isSubmitting)?"not-allowed":"pointer", opacity:(isRunning||isSubmitting)?0.5:1, background:"#ffa116", border:"none", color:"#000", transition:"background 0.15s", fontFamily:"inherit" }}
// //             onMouseEnter={e => { if(!isRunning&&!isSubmitting) e.currentTarget.style.background="#e6911f"; }}
// //             onMouseLeave={e => e.currentTarget.style.background="#ffa116"}>
// //             {isSubmitting
// //               ? <span style={{ width:12, height:12, border:"2px solid #000", borderTopColor:"transparent", borderRadius:"50%", animation:"spin 0.8s linear infinite", display:"inline-block" }}/>
// //               : <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
// //             }
// //             Submit
// //           </button>
// //         </div>

// //         {/* right */}
// //         <div style={{ display:"flex", alignItems:"center", gap:12 }}>
// //           <span style={{ fontSize:12, color: navMuted, background: pillBg, border:`1px solid ${pillBd}`, padding:"2px 8px", borderRadius:99 }}>
// //             {currentIdx+1} / {questions.length}
// //           </span>
// //           <button onClick={() => setDark(p => !p)} title={D?"Light mode":"Dark mode"}
// //             style={{ display:"flex", alignItems:"center", gap:6, padding:"4px 10px", borderRadius:20, cursor:"pointer", border: D?"1px solid rgba(255,255,255,0.1)":"1px solid rgba(0,0,0,0.12)", background: D?"rgba(255,255,255,0.06)":"rgba(0,0,0,0.05)", transition:"all 0.25s", fontFamily:"inherit" }}>
// //             <div style={{ position:"relative", width:30, height:16, borderRadius:8, background: D?"#0ea5e9":"#cbd5e1", transition:"background 0.25s", flexShrink:0 }}>
// //               <div style={{ position:"absolute", top:2, left: D?15:2, width:12, height:12, borderRadius:"50%", background:"#fff", transition:"left 0.25s", display:"flex", alignItems:"center", justifyContent:"center", fontSize:8, boxShadow:"0 1px 4px rgba(0,0,0,0.3)" }}>
// //                 {D ? "🌙" : "☀️"}
// //               </div>
// //             </div>
// //             <span style={{ fontSize:10, fontWeight:700, userSelect:"none", color: D?"#64748b":"#94a3b8", letterSpacing:"0.04em" }}>
// //               {D ? "Dark" : "Light"}
// //             </span>
// //           </button>
// //         </div>
// //       </nav>
// //       {/* end nav */}

// //       {/* ── PANELS WRAPPER ── */}
// //       <div ref={containerRef} style={{ display:"flex", flex:1, overflow:"hidden", gap:4, padding:4, background: pageBg, transition:"background 0.25s", minHeight:0 }}>

// //         {/* LEFT PANEL */}
// //         <div style={{ width:`${leftPct}%`, display:"flex", flexDirection:"column", height:"100%", flexShrink:0, overflow:"hidden", background: panelBg, border:`1px solid ${panelBorder}`, borderRadius:10, transition:"background 0.25s,border-color 0.25s" }}>

// //           {/* left tabs */}
// //           <div style={{ display:"flex", alignItems:"center", padding:"0 16px", flexShrink:0, borderBottom:`1px solid ${panelBorder}`, background: panelBg, transition:"all 0.25s" }}>
// //             {["Description","Solutions","Submissions"].map((t,i) => (
// //               <button key={t} style={{ padding:"10px 4px", marginRight:16, fontSize:12, fontWeight:500, background:"none", border:"none", borderBottom: i===0?"2px solid #ffa116":"2px solid transparent", color: i===0?tabActive:tabInactive, cursor:"pointer", fontFamily:"inherit" }}>
// //                 {t}
// //               </button>
// //             ))}
// //           </div>

// //           {/* left content */}
// //           <div style={{ flex:1, overflowY:"auto", padding:20, userSelect:"text" }}>
// //             <h1 style={{ color: heading, fontSize:17, fontWeight:600, marginBottom:8, fontFamily:"'Times New Roman',Times,serif", transition:"color 0.25s" }}>
// //               {currentIdx+1}. {q?.title}
// //             </h1>
// //             <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:20 }}>
// //               <span style={{ fontSize:12, fontWeight:500, color: diffColor(q?.difficulty) }}>
// //                 {q?.difficulty ?? "Medium"}
// //               </span>
// //               {q?.marks && (
// //                 <span style={{ fontSize:11, color: mutedText, background: pillBg, border:`1px solid ${panelBorder}`, padding:"2px 8px", borderRadius:99 }}>
// //                   {q.marks} pts
// //                 </span>
// //               )}
// //             </div>
// //             <div style={{ color: bodyText, fontSize:13.5, lineHeight:1.8, marginBottom:20, whiteSpace:"pre-wrap", fontFamily:"'Times New Roman',Times,serif", transition:"color 0.25s" }}
// //               dangerouslySetInnerHTML={{ __html: q?.description ?? q?.question ?? q?.title ?? "" }}
// //             />
// //             {Array.isArray(q?.examples) && q.examples.map((ex,i) => (
// //               <div key={i} style={{ marginBottom:20 }}>
// //                 <p style={{ color: bodyText, fontSize:11, fontWeight:600, marginBottom:8 }}>Example {i+1}:</p>
// //                 <div style={{ background: codeBg, border:`1px solid ${codeBlockBd}`, borderRadius:8, padding:12, fontSize:11, fontFamily:"monospace", color: bodyText, transition:"all 0.25s" }}>
// //                   {ex.input       && <p><strong>Input:&nbsp;</strong>{ex.input}</p>}
// //                   {ex.output      && <p><strong>Output:&nbsp;</strong>{ex.output}</p>}
// //                   {ex.explanation && <p style={{ color: mutedText, paddingTop:4 }}>Explanation: {ex.explanation}</p>}
// //                 </div>
// //               </div>
// //             ))}
// //             {Array.isArray(q?.constraints) && q.constraints.length > 0 && (
// //               <div>
// //                 <p style={{ color: bodyText, fontSize:11, fontWeight:600, marginBottom:8 }}>Constraints:</p>
// //                 <ul style={{ listStyle:"none", padding:0, display:"flex", flexDirection:"column", gap:6 }}>
// //                   {q.constraints.map((c,i) => (
// //                     <li key={i} style={{ display:"flex", alignItems:"center", gap:8, fontSize:11, color: mutedText }}>
// //                       <span style={{ width:5, height:5, borderRadius:"50%", background: mutedText, flexShrink:0 }}/>
// //                       <code style={{ background: pillBg, border:`1px solid ${codeBlockBd}`, padding:"2px 6px", borderRadius:4, color: bodyText }}>{c}</code>
// //                     </li>
// //                   ))}
// //                 </ul>
// //               </div>
// //             )}
// //           </div>
// //         </div>
// //         {/* END LEFT PANEL */}

// //         {/* HORIZ DRAG */}
// //         <div onMouseDown={horizDrag}
// //           style={{ width:4, borderRadius:99, flexShrink:0, margin:"0 2px", cursor:"col-resize", background: dragBg, transition:"background 0.15s" }}
// //           onMouseEnter={e => e.currentTarget.style.background="#ffa116"}
// //           onMouseLeave={e => e.currentTarget.style.background= dragBg}
// //         />

// //         {/* RIGHT COLUMN */}
// //         <div style={{ display:"flex", flexDirection:"column", flex:1, overflow:"hidden", gap:4, minHeight:0 }}>

// //           {/* EDITOR PANEL */}
// //           <div style={{ height:`${editorPct}%`, display:"flex", flexDirection:"column", flexShrink:0, overflow:"hidden", borderRadius:10, background: panelBg, border:`1px solid ${panelBorder}`, transition:"background 0.25s,border-color 0.25s" }}>

// //             {/* editor toolbar */}
// //             <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 12px", height:36, flexShrink:0, background: panelBg, borderBottom:`1px solid ${panelBorder}`, transition:"all 0.25s" }}>
// //               <div style={{ display:"flex", alignItems:"center", gap:8 }}>
// //                 <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#ffa116">
// //                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
// //                 </svg>
// //                 <select value={language} onChange={e => handleLang(e.target.value)}
// //                   style={{ background: selectBg, color: selectText, border:"none", fontSize:12, fontWeight:500, cursor:"pointer", outline:"none", transition:"all 0.25s", fontFamily:"inherit" }}>
// //                   {LANGUAGES.map(l => (
// //                     <option key={l.value} value={l.value} style={{ background: selectBg }}>{l.label}</option>
// //                   ))}
// //                 </select>
// //               </div>
// //               <button onClick={() => setCode(BOILERPLATE[language])} title="Reset code"
// //                 style={{ background:"none", border:"none", cursor:"pointer", color: mutedText, fontFamily:"inherit" }}
// //                 onMouseEnter={e => e.currentTarget.style.color = bodyText}
// //                 onMouseLeave={e => e.currentTarget.style.color = mutedText}>
// //                 <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
// //                 </svg>
// //               </button>
// //             </div>

// //             {/* monaco editor */}
// //             <div style={{ flex:1, overflow:"hidden", minHeight:0 }}>
// //               <Editor
// //                 height="100%"
// //                 language={langObj.monaco}
// //                 value={code}
// //                 onChange={v => setCode(v ?? "")}
// //                 theme={D ? "vs-dark" : "light"}
// //                 options={{
// //                   fontSize:14,
// //                   fontFamily:"'JetBrains Mono','Fira Code',Consolas,monospace",
// //                   fontLigatures:true,
// //                   minimap:{enabled:false},
// //                   scrollBeyondLastLine:false,
// //                   padding:{top:12,bottom:12},
// //                   tabSize:4,
// //                   wordWrap:"on",
// //                   smoothScrolling:true,
// //                   cursorBlinking:"smooth",
// //                   lineNumbers:"on",
// //                   renderLineHighlight:"all",
// //                   bracketPairColorization:{enabled:true},
// //                 }}
// //               />
// //             </div>
// //           </div>
// //           {/* END EDITOR PANEL */}

// //           {/* VERT DRAG */}
// //           <div onMouseDown={vertDrag}
// //             style={{ height:4, borderRadius:99, flexShrink:0, cursor:"row-resize", background: dragBg, transition:"background 0.15s" }}
// //             onMouseEnter={e => e.currentTarget.style.background="#ffa116"}
// //             onMouseLeave={e => e.currentTarget.style.background= dragBg}
// //           />

// //           {/* BOTTOM PANEL */}
// //           <div style={{ display:"flex", flexDirection:"column", flex:1, overflow:"hidden", borderRadius:10, background: termBg, border:`1px solid ${termBorder}`, minHeight:0, transition:"background 0.25s,border-color 0.25s" }}>

// //             {/* bottom tabs */}
// //             <div style={{ display:"flex", alignItems:"center", padding:"0 12px", flexShrink:0, borderBottom:`1px solid ${termBorder}`, minHeight:38, transition:"border-color 0.25s" }}>
// //               {[
// //                 { key:"testcase", label:"Testcase"   },
// //                 { key:"result",   label: isRunning ? "Running…" : "Test Result" },
// //               ].map(({ key, label }) => (
// //                 <button key={key} onClick={() => setActiveTab(key)}
// //                   style={{ padding:"8px 4px", marginRight:16, fontSize:12, fontWeight:500, background:"none", border:"none", cursor:"pointer", borderBottom: activeTab===key?"2px solid #ffa116":"2px solid transparent", color: activeTab===key ? tabActive : tabInactive, transition:"color 0.15s", fontFamily:"inherit" }}>
// //                   {label}
// //                 </button>
// //               ))}
// //               {verdict && (
// //                 <span style={{ fontSize:11, fontWeight:600, padding:"2px 10px", borderRadius:99, marginLeft:8, background: verdict==="accepted"?"rgba(52,211,153,0.12)":"rgba(248,113,113,0.12)", color: verdict==="accepted"?"#34d399":"#f87171", border:`1px solid ${verdict==="accepted"?"rgba(52,211,153,0.25)":"rgba(248,113,113,0.25)"}` }}>
// //                   {verdict==="accepted" ? "✓ Accepted" : "✗ Wrong Answer"}
// //                 </span>
// //               )}
// //             </div>

// //             {/* bottom content */}
// //             <div style={{ flex:1, overflow:"auto", padding:12 }}>
// //               {activeTab === "testcase" ? (
// //                 <div style={{ height:"100%", display:"flex", flexDirection:"column", gap:8 }}>
// //                   <p style={{ fontSize:11, fontWeight:500, color: termEmpty, margin:0 }}>Custom stdin</p>
// //                   <textarea value={stdin} onChange={e => setStdin(e.target.value)}
// //                     placeholder="Type test input here…" spellCheck={false}
// //                     style={{ flex:1, background: termInput, color: termText, border:`1px solid ${termBorder}`, borderRadius:8, padding:12, fontSize:13, fontFamily:"'JetBrains Mono','Fira Code',monospace", resize:"none", outline:"none", userSelect:"text", transition:"all 0.25s" }}
// //                   />
// //                 </div>
// //               ) : (
// //                 <div style={{ height:"100%" }}>
// //                   {isRunning
// //                     ? <div style={{ display:"flex", alignItems:"center", gap:8, fontSize:13, color: termEmpty }}>
// //                         <span style={{ width:16, height:16, border:`1px solid ${termEmpty}`, borderTopColor:"transparent", borderRadius:"50%", animation:"spin 0.8s linear infinite", display:"inline-block" }}/>
// //                         Executing your code…
// //                       </div>
// //                     : output
// //                     ? <pre style={{ fontSize:13, fontFamily:"'JetBrains Mono',monospace", color: termText, whiteSpace:"pre-wrap", lineHeight:1.7, userSelect:"text", margin:0, transition:"color 0.25s" }}>{output}</pre>
// //                     : <div style={{ height:"100%", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:8, color: termEmpty }}>
// //                         <svg width="36" height="36" style={{ opacity:0.2 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
// //                         </svg>
// //                         <span style={{ fontSize:11 }}>Run your code to see output here</span>
// //                       </div>
// //                   }
// //                 </div>
// //               )}
// //             </div>
// //           </div>
// //           {/* END BOTTOM PANEL */}

// //         </div>
// //         {/* END RIGHT COLUMN */}

// //       </div>
// //       {/* END PANELS WRAPPER */}

// //     </div>
// //   );
// // }




// import React, { useEffect, useState, useRef, useCallback } from "react";
// import { useParams, useHistory } from "react-router-dom";
// import Editor from "@monaco-editor/react";
// import {
//   collection, query, where, getDocs, addDoc, serverTimestamp,
// } from "firebase/firestore";
// import { db } from "../firebase/config";
// import { useAuth } from "../hooks/useAuth";
// import { executeCode } from "../api/compilerService";

// const LANGUAGES = [
//   { label: "C++",        value: "cpp",        monaco: "cpp"        },
//   { label: "Python",     value: "python",     monaco: "python"     },
//   { label: "JavaScript", value: "javascript", monaco: "javascript" },
//   { label: "Java",       value: "java",       monaco: "java"       },
//   { label: "C",          value: "c",          monaco: "c"          },
// ];

// const BOILERPLATE = {
//   cpp: "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    // Write your solution here\n    return 0;\n}\n",
//   python: "# Write your solution here\ndef solution():\n    pass\n",
//   javascript: "// Write your solution here\nfunction solution() {\n\n}\n",
//   java: "public class Solution {\n    public static void main(String[] args) {\n        // Write your solution here\n    }\n}\n",
//   c: "#include <stdio.h>\n\nint main() {\n    // Write your solution here\n    return 0;\n}\n",
// };

// const DIFF_COLOR = {
//   dark:  { Easy:"#34d399", Medium:"#fbbf24", Hard:"#f87171" },
//   light: { Easy:"#16a34a", Medium:"#d97706", Hard:"#dc2626" },
// };

// function usePanelDrag(onMove) {
//   return useCallback((e) => {
//     e.preventDefault();
//     const ox = e.clientX, oy = e.clientY;
//     const mv = (ev) => onMove(ev.clientX - ox, ev.clientY - oy);
//     const up = () => { window.removeEventListener("mousemove", mv); window.removeEventListener("mouseup", up); };
//     window.addEventListener("mousemove", mv);
//     window.addEventListener("mouseup", up);
//   }, [onMove]);
// }

// export default function PracticePage({ embeddedQuestions, initialIndex = 0, onBack }) {
//   const params  = useParams?.() ?? {};
//   const history = useHistory?.();
//   const topicId = params.topicId;
//   const { user } = useAuth();

//   const [questions,  setQuestions]  = useState(embeddedQuestions ?? []);
//   const [currentIdx, setCurrentIdx] = useState(initialIndex);
//   const [loading,    setLoading]    = useState(!embeddedQuestions);

//   const [language,     setLanguage]     = useState("cpp");
//   const [code,         setCode]         = useState("");
//   const [activeTab,    setActiveTab]    = useState("testcase");
//   const [stdin,        setStdin]        = useState("");
//   const [output,       setOutput]       = useState("");
//   const [isRunning,    setIsRunning]    = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [verdict,      setVerdict]      = useState(null);
//   const [dark,         setDark]         = useState(true);

//   const containerRef = useRef(null);
//   const [leftPct,   setLeftPct]   = useState(42);
//   const [editorPct, setEditorPct] = useState(63);

//   // Helper to load the correct code based on faculty settings or fallback
//   const getInitialCode = useCallback((q, lang) => {
//     if (!q) return BOILERPLATE[lang];
//     // Try faculty specific boilerplate first, then global q.boilerplate, then default
//     return q.boilerplates?.[lang] || q.boilerplate || BOILERPLATE[lang];
//   }, []);

//   /* ── Fetching Logic ── */
//   useEffect(() => {
//     if (embeddedQuestions) return;
//     if (!topicId) return;
//     (async () => {
//       try {
//         const snap = await getDocs(query(collection(db, "questions"), where("category", "==", topicId)));
//         const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
//         setQuestions(docs);
//         if (docs.length > 0) {
//             setCode(getInitialCode(docs[0], language));
//             // Auto-fill stdin with first testcase input if exists
//             if (docs[0].testCases?.[0]) setStdin(docs[0].testCases[0].input);
//         }
//       } finally { setLoading(false); }
//     })();
//   }, [topicId, embeddedQuestions, language, getInitialCode]);

//   /* ── Navigation ── */
//   const goTo = (idx) => {
//     const q = questions[idx];
//     setCurrentIdx(idx);
//     setCode(getInitialCode(q, language));
//     setStdin(q?.testCases?.[0]?.input || "");
//     setOutput(""); setActiveTab("testcase"); setVerdict(null);
//   };

//   const handleLang = (langValue) => {
//     setLanguage(langValue);
//     setCode(getInitialCode(questions[currentIdx], langValue));
//   };

//   const handleBack = () => {
//     if (onBack) { onBack(); return; }
//     if (history) history.push("/dashboard");
//   };

//   /* ── REAL EXECUTION PIPELINE ── */
  
//   // RUN: Checks only the visible stdin (Sample Test Case)
//   const handleRun = async () => {
//     if (!code.trim()) return;
//     setIsRunning(true); setActiveTab("result"); setOutput("");
//     const q = questions[currentIdx];
    
//     try {
//       // Pass the faculty time limit dynamically
//       const r = await executeCode(language, code, stdin, q?.timeLimitMs || 2000);
      
//       let resText = "";
//       if (r.compile_output) resText = `Compilation Error:\n${r.compile_output}`;
//       else if (r.stderr) resText = `Runtime Error:\n${r.stderr}`;
//       else resText = r.stdout || "// No output";
      
//       setOutput(resText);

//       // Status check for visual feedback
//       if (r.status?.id === 3) { // 3 = Accepted
//         const expected = q?.testCases?.find(t => t.input === stdin)?.expectedOutput;
//         if (expected && r.stdout?.trim() === expected.trim()) {
//             setVerdict("accepted");
//         }
//       }
//     } catch (e) { setOutput("Execution Error: " + e.message); }
//     finally { setIsRunning(false); }
//   };

//   // SUBMIT: Loops through ALL Faculty Test Cases
//   const handleSubmit = async () => {
//     if (!user || !questions[currentIdx]) return;
//     setIsSubmitting(true); setActiveTab("result"); setOutput("Running all test cases...");
    
//     const q = questions[currentIdx];
//     const testCases = q.testCases || [];
//     let passedCount = 0;
//     let totalLogs = "";

//     try {
//       for (let i = 0; i < testCases.length; i++) {
//         const test = testCases[i];
//         const r = await executeCode(language, code, test.input, q.timeLimitMs || 2000);
        
//         const actual = r.stdout?.trim();
//         const expected = test.expectedOutput?.trim();
//         const isCorrect = r.status?.id === 3 && actual === expected;

//         if (isCorrect) passedCount++;
        
//         totalLogs += `Test Case ${i + 1}: ${isCorrect ? "✅ Passed" : "❌ Failed"}\n`;
//         if (!isCorrect && r.stderr) totalLogs += `   Error: ${r.stderr}\n`;
//       }

//       const allPassed = passedCount === testCases.length && testCases.length > 0;
//       setVerdict(allPassed ? "accepted" : "wrong");
      
//       const finalMsg = allPassed 
//         ? `✅ Accepted\nPassed all ${testCases.length} test cases.` 
//         : `❌ Wrong Answer\nPassed ${passedCount}/${testCases.length} test cases.\n\n${totalLogs}`;
      
//       setOutput(finalMsg);

//       // Save to Firebase with detailed score
//       await addDoc(collection(db, "submissions"), {
//         studentId: user.uid,
//         questionId: q.id,
//         code,
//         language,
//         type: "practice",
//         score: passedCount,
//         totalTests: testCases.length,
//         status: allPassed ? "accepted" : "wrong_answer",
//         submittedAt: serverTimestamp(),
//       });

//     } catch (e) { setOutput("Submission Error: " + e.message); }
//     finally { setIsSubmitting(false); }
//   };

//   /* ── Theme & UI Helpers ── */
//   const D = dark;
//   const pageBg = D ? "#0d1117" : "#f0f2f5";
//   const navBg = D ? "#161b22" : "#ffffff";
//   const navBorder = D ? "#21262d" : "#e2e8f0";
//   const navText = D ? "#e2e8f0" : "#1e293b";
//   const navMuted = D ? "#6b7280" : "#94a3b8";
//   const panelBg = D ? "#161b22" : "#ffffff";
//   const panelBorder = D ? "#21262d" : "#e2e8f0";
//   const heading = D ? "#f1f5f9" : "#0f172a";
//   const bodyText = D ? "#cbd5e1" : "#334155";
//   const mutedText = D ? "#6b7280" : "#64748b";
//   const codeBg = D ? "#0d1117" : "#f1f5f9";
//   const termBg = D ? "#0d1117" : "#ffffff";
//   const termText = D ? "#e6edf3" : "#1f2937";
//   const termBorder = D ? "#21262d" : "#e5e7eb";
//   const termEmpty = D ? "#4b5563" : "#9ca3af";
//   const termInput = D ? "#0d1117" : "#f9fafb";
//   const selectBg = D ? "#161b22" : "#ffffff";
//   const selectText = D ? "#e2e8f0" : "#1e293b";
//   const dragBg = D ? "#21262d" : "#cbd5e1";
//   const tabInactive = D ? "#6b7280" : "#64748b";
//   const tabActive = D ? "#ffffff" : "#0f172a";
//   const btnRunBg = D ? "#21262d" : "#f1f5f9";
//   const btnRunBd = D ? "#30363d" : "#cbd5e1";
//   const btnRunTx = D ? "#e2e8f0" : "#1e293b";
//   const pillBg = D ? "#21262d" : "#f1f5f9";
//   const pillBd = D ? "#30363d" : "#e2e8f0";

//   const horizDrag = usePanelDrag(useCallback((dx) => {
//     if (!containerRef.current) return;
//     setLeftPct(p => Math.min(72, Math.max(22, p + (dx / containerRef.current.offsetWidth) * 100)));
//   }, []));
//   const vertDrag = usePanelDrag(useCallback((_, dy) => {
//     if (!containerRef.current) return;
//     setEditorPct(p => Math.min(85, Math.max(25, p + (dy / containerRef.current.offsetHeight) * 100)));
//   }, []));

//   if (loading) return (
//     <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100vh", background: pageBg }}>
//        <div style={{ width:30, height:30, border:"3px solid #ffa116", borderTopColor:"transparent", borderRadius:"50%", animation:"spin 0.8s linear infinite" }} />
//        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
//     </div>
//   );

//   const q = questions[currentIdx];
//   const langObj = LANGUAGES.find(l => l.value === language) ?? LANGUAGES[0];

//   return (
//     <div style={{ display:"flex", flexDirection:"column", height:"100vh", background: pageBg, transition:"all 0.25s" }}>
      
//       {/* ── NAV BAR ── */}
//       <nav style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 12px", height:48, background: navBg, borderBottom:`1px solid ${navBorder}` }}>
//         <div style={{ display:"flex", alignItems:"center", gap:12 }}>
//           <button onClick={handleBack} style={{ background:"none", border:"none", color: navMuted, cursor:"pointer", fontSize:13 }}>
//              ← Back
//           </button>
//           <div style={{ display:"flex", gap:4 }}>
//             <button disabled={currentIdx === 0} onClick={() => goTo(currentIdx-1)} style={{ padding:6, opacity: currentIdx===0?0.3:1 }}>◀</button>
//             <button disabled={currentIdx === questions.length-1} onClick={() => goTo(currentIdx+1)} style={{ padding:6, opacity: currentIdx===questions.length-1?0.3:1 }}>▶</button>
//           </div>
//         </div>

//         <div style={{ display:"flex", gap:10 }}>
//           <button onClick={handleRun} disabled={isRunning || isSubmitting}
//             style={{ padding:"6px 16px", borderRadius:6, fontSize:12, fontWeight:600, background: btnRunBg, border:`1px solid ${btnRunBd}`, color: btnRunTx }}>
//             {isRunning ? "Running..." : "Run"}
//           </button>
//           <button onClick={handleSubmit} disabled={isRunning || isSubmitting}
//             style={{ padding:"6px 16px", borderRadius:6, fontSize:12, fontWeight:600, background:"#ffa116", border:"none", color:"#000" }}>
//             {isSubmitting ? "Submitting..." : "Submit"}
//           </button>
//         </div>

//         <div style={{ display:"flex", alignItems:"center", gap:12 }}>
//            <button onClick={() => setDark(!dark)} style={{ background: pillBg, border:`1px solid ${pillBd}`, padding:"4px 8px", borderRadius:12, fontSize:12 }}>
//              {dark ? "🌙 Dark" : "☀️ Light"}
//            </button>
//         </div>
//       </nav>

//       {/* ── MAIN CONTENT ── */}
//       <div ref={containerRef} style={{ display:"flex", flex:1, overflow:"hidden", gap:4, padding:4 }}>
        
//         {/* LEFT: Description */}
//         <div style={{ width:`${leftPct}%`, background: panelBg, border:`1px solid ${panelBorder}`, borderRadius:8, display:"flex", flexDirection:"column", overflow:"hidden" }}>
//           <div style={{ padding:20, flex:1, overflowY:"auto" }}>
//             <h1 style={{ color: heading, fontSize:20, marginBottom:10 }}>{currentIdx+1}. {q?.title}</h1>
//             <div style={{ display:"flex", gap:10, marginBottom:20 }}>
//                <span style={{ color: (DIFF_COLOR[dark?'dark':'light'])[q?.difficulty] || "#fbbf24", fontWeight:600 }}>{q?.difficulty}</span>
//                <span style={{ color: mutedText }}>{q?.marks} points</span>
//             </div>
//             <div style={{ color: bodyText, lineHeight:1.6, fontSize:14 }} dangerouslySetInnerHTML={{ __html: q?.description || q?.question }} />
            
//             {/* Examples */}
//             {q?.testCases?.slice(0, 2).map((tc, i) => (
//               <div key={i} style={{ marginTop:20 }}>
//                 <p style={{ fontWeight:600, fontSize:12, color: bodyText }}>Example {i+1}:</p>
//                 <pre style={{ background: codeBg, padding:10, borderRadius:6, fontSize:12, color: bodyText }}>
//                   Input: {tc.input} {"\n"}
//                   Output: {tc.expectedOutput}
//                 </pre>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div onMouseDown={horizDrag} style={{ width:4, cursor:"col-resize", background: dragBg }} />

//         {/* RIGHT: Editor & Result */}
//         <div style={{ flex:1, display:"flex", flexDirection:"column", gap:4 }}>
          
//           {/* Editor */}
//           <div style={{ height:`${editorPct}%`, background: panelBg, border:`1px solid ${panelBorder}`, borderRadius:8, display:"flex", flexDirection:"column", overflow:"hidden" }}>
//              <div style={{ height:36, display:"flex", alignItems:"center", padding:"0 10px", borderBottom:`1px solid ${panelBorder}` }}>
//                 <select value={language} onChange={e => handleLang(e.target.value)} style={{ background:"none", color: selectText, border:"none", fontSize:12 }}>
//                   {LANGUAGES.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
//                 </select>
//              </div>
//              <div style={{ flex:1 }}>
//                 <Editor 
//                   theme={dark ? "vs-dark" : "light"}
//                   language={langObj.monaco}
//                   value={code}
//                   onChange={v => setCode(v)}
//                   options={{ minimap: { enabled: false }, fontSize: 14 }}
//                 />
//              </div>
//           </div>

//           <div onMouseDown={vertDrag} style={{ height:4, cursor:"row-resize", background: dragBg }} />

//           {/* Terminal / Results */}
//           <div style={{ flex:1, background: termBg, border:`1px solid ${termBorder}`, borderRadius:8, display:"flex", flexDirection:"column", overflow:"hidden" }}>
//              <div style={{ display:"flex", gap:15, padding:"0 15px", borderBottom:`1px solid ${termBorder}`, height:38, alignItems:"center" }}>
//                 <button onClick={() => setActiveTab("testcase")} style={{ color: activeTab==="testcase"?tabActive:tabInactive, fontSize:12 }}>Testcase</button>
//                 <button onClick={() => setActiveTab("result")} style={{ color: activeTab==="result"?tabActive:tabInactive, fontSize:12 }}>Result</button>
//              </div>
//              <div style={{ flex:1, padding:15, overflowY:"auto" }}>
//                 {activeTab === "testcase" ? (
//                   <textarea 
//                     value={stdin} 
//                     onChange={e => setStdin(e.target.value)}
//                     style={{ width:"100%", height:"100%", background: termInput, color: termText, border:"none", resize:"none", fontFamily:"monospace" }}
//                   />
//                 ) : (
//                   <pre style={{ color: termText, fontSize:13 }}>{output || "Run code to see results..."}</pre>
//                 )}
//              </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// } 

// import React, { useEffect, useState, useRef, useCallback } from "react";
// import { useParams, useHistory } from "react-router-dom";
// import Editor from "@monaco-editor/react";
// import {
//   collection, query, where, getDocs, addDoc, serverTimestamp,
// } from "firebase/firestore";
// import { db } from "../firebase/config";
// import { useAuth } from "../hooks/useAuth";
// import { executeCode } from "../api/compilerService";

// const LANGUAGES = [
//   { label: "C++",        value: "cpp",        monaco: "cpp"        },
//   { label: "Python",     value: "python",     monaco: "python"     },
//   { label: "JavaScript", value: "javascript", monaco: "javascript" },
//   { label: "Java",       value: "java",       monaco: "java"       },
//   { label: "C",          value: "c",          monaco: "c"          },
// ];

// const BOILERPLATE = {
//   cpp:        "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    // Write your solution here\n    return 0;\n}\n",
//   python:     "# Write your solution here\ndef solution():\n    pass\n",
//   javascript: "// Write your solution here\nfunction solution() {\n\n}\n",
//   java:       "public class Solution {\n    public static void main(String[] args) {\n        // Write your solution here\n    }\n}\n",
//   c:          "#include <stdio.h>\n\nint main() {\n    // Write your solution here\n    return 0;\n}\n",
// };

// const DIFF_COLOR = {
//   dark:  { Easy: "#34d399", Medium: "#fbbf24", Hard: "#f87171" },
//   light: { Easy: "#16a34a", Medium: "#d97706", Hard: "#dc2626" },
// };

// /* ── Drag helper ── */
// function usePanelDrag(onMove) {
//   return useCallback((e) => {
//     e.preventDefault();
//     const ox = e.clientX, oy = e.clientY;
//     const mv = (ev) => onMove(ev.clientX - ox, ev.clientY - oy);
//     const up = () => {
//       window.removeEventListener("mousemove", mv);
//       window.removeEventListener("mouseup", up);
//     };
//     window.addEventListener("mousemove", mv);
//     window.addEventListener("mouseup", up);
//   }, [onMove]);
// }

// export default function PracticePage({ embeddedQuestions, initialIndex = 0, onBack }) {
//   const params  = useParams?.() ?? {};
//   const history = useHistory?.();
//   const topicId = params.topicId;
//   const { user } = useAuth();

//   const [questions,  setQuestions]  = useState(embeddedQuestions ?? []);
//   const [currentIdx, setCurrentIdx] = useState(initialIndex);
//   const [loading,    setLoading]    = useState(!embeddedQuestions);

//   const [language,     setLanguage]     = useState("cpp");
//   const [code,         setCode]         = useState("");
//   const [activeTab,    setActiveTab]    = useState("testcase");
//   const [stdin,        setStdin]        = useState("");
//   const [output,       setOutput]       = useState("");
//   const [isRunning,    setIsRunning]    = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [verdict,      setVerdict]      = useState(null);
//   const [dark,         setDark]         = useState(true);

//   const containerRef = useRef(null);
//   const [leftPct,   setLeftPct]   = useState(42);
//   const [editorPct, setEditorPct] = useState(63);

//   /* ── FIX: stable getInitialCode via useCallback ── */
//   const getInitialCode = useCallback((q, lang) => {
//     if (!q) return BOILERPLATE[lang];
//     return q.boilerplates?.[lang] || q.boilerplate || BOILERPLATE[lang];
//   }, []);

//   /* ── Fetch questions (only when not using embeddedQuestions) ── */
//   useEffect(() => {
//     if (embeddedQuestions) return;
//     if (!topicId) return;
//     (async () => {
//       try {
//         const snap = await getDocs(
//           query(collection(db, "questions"), where("category", "==", topicId))
//         );
//         const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
//         setQuestions(docs);
//         if (docs.length > 0) {
//           setCode(getInitialCode(docs[0], language));
//           if (docs[0].testCases?.[0]) setStdin(docs[0].testCases[0].input);
//         }
//       } finally {
//         setLoading(false);
//       }
//     })();
//     // language intentionally excluded — only re-fetch when topic changes
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [topicId, embeddedQuestions, getInitialCode]);

//   /* ── Navigate between questions ── */
//   const goTo = useCallback((idx) => {
//     const q = questions[idx];
//     setCurrentIdx(idx);
//     setCode(getInitialCode(q, language));
//     setStdin(q?.testCases?.[0]?.input || "");
//     setOutput("");
//     setActiveTab("testcase");
//     setVerdict(null);
//   }, [questions, language, getInitialCode]);

//   /* ── Language change ── */
//   const handleLang = (langValue) => {
//     setLanguage(langValue);
//     setCode(getInitialCode(questions[currentIdx], langValue));
//   };

//   const handleBack = () => {
//     if (onBack) { onBack(); return; }
//     if (history) history.push("/dashboard");
//   };

//   /* ── RUN: executes visible stdin only ── */
//   const handleRun = async () => {
//     if (!code.trim()) return;
//     setIsRunning(true);
//     setActiveTab("result");
//     setOutput("");
//     setVerdict(null);

//     const q = questions[currentIdx];
//     try {
//       const r = await executeCode(language, code, stdin, q?.timeLimitMs || 2000);

//       let resText = "";
//       if (r.compile_output)      resText = `Compilation Error:\n${r.compile_output}`;
//       else if (r.stderr)         resText = `Runtime Error:\n${r.stderr}`;
//       else                       resText = r.stdout || "// No output";

//       setOutput(resText);

//       // Optional: mark accepted if output matches a known test case
//       if (r.status?.id === 3) {
//         const matched = q?.testCases?.find(t => t.input === stdin);
//         if (matched && r.stdout?.trim() === matched.expectedOutput?.trim()) {
//           setVerdict("accepted");
//         }
//       }
//     } catch (e) {
//       setOutput("Execution Error: " + e.message);
//     } finally {
//       setIsRunning(false);
//     }
//   };

//   /* ── SUBMIT: runs ALL faculty test cases ── */
//   const handleSubmit = async () => {
//     if (!user || !questions[currentIdx]) return;
//     setIsSubmitting(true);
//     setActiveTab("result");
//     setOutput("Running all test cases...");
//     setVerdict(null);

//     const q = questions[currentIdx];
//     const testCases = q.testCases || [];
//     let passedCount = 0;
//     let totalLogs = "";

//     try {
//       for (let i = 0; i < testCases.length; i++) {
//         const test = testCases[i];
//         const r = await executeCode(language, code, test.input, q.timeLimitMs || 2000);

//         const actual   = r.stdout?.trim();
//         const expected = test.expectedOutput?.trim();
//         const isCorrect = r.status?.id === 3 && actual === expected;

//         if (isCorrect) passedCount++;
//         totalLogs += `Test Case ${i + 1}: ${isCorrect ? "✅ Passed" : "❌ Failed"}\n`;
//         if (!isCorrect && r.stderr) totalLogs += `   Error: ${r.stderr}\n`;
//       }

//       const allPassed = passedCount === testCases.length && testCases.length > 0;
//       setVerdict(allPassed ? "accepted" : "wrong");

//       const finalMsg = allPassed
//         ? `✅ Accepted\nPassed all ${testCases.length} test cases.`
//         : `❌ Wrong Answer\nPassed ${passedCount}/${testCases.length} test cases.\n\n${totalLogs}`;

//       setOutput(finalMsg);

//       await addDoc(collection(db, "submissions"), {
//         studentId:   user.uid,
//         questionId:  q.id,
//         code,
//         language,
//         type:        "practice",
//         score:       passedCount,
//         totalTests:  testCases.length,
//         status:      allPassed ? "accepted" : "wrong_answer",
//         submittedAt: serverTimestamp(),
//       });
//     } catch (e) {
//       setOutput("Submission Error: " + e.message);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   /* ── Theme tokens ── */
//   const D = dark;
//   const pageBg     = D ? "#0d1117" : "#f0f2f5";
//   const navBg      = D ? "#161b22" : "#ffffff";
//   const navBorder  = D ? "#21262d" : "#e2e8f0";
//   const navMuted   = D ? "#6b7280" : "#94a3b8";
//   const panelBg    = D ? "#161b22" : "#ffffff";
//   const panelBorder= D ? "#21262d" : "#e2e8f0";
//   const heading    = D ? "#f1f5f9" : "#0f172a";
//   const bodyText   = D ? "#cbd5e1" : "#334155";
//   const mutedText  = D ? "#6b7280" : "#64748b";
//   const codeBg     = D ? "#0d1117" : "#f1f5f9";
//   const termBg     = D ? "#0d1117" : "#ffffff";
//   const termText   = D ? "#e6edf3" : "#1f2937";
//   const termBorder = D ? "#21262d" : "#e5e7eb";
//   const termInput  = D ? "#0d1117" : "#f9fafb";
//   const selectText = D ? "#e2e8f0" : "#1e293b";
//   const dragBg     = D ? "#21262d" : "#cbd5e1";
//   const tabInactive= D ? "#6b7280" : "#64748b";
//   const tabActive  = D ? "#ffffff" : "#0f172a";
//   const btnRunBg   = D ? "#21262d" : "#f1f5f9";
//   const btnRunBd   = D ? "#30363d" : "#cbd5e1";
//   const btnRunTx   = D ? "#e2e8f0" : "#1e293b";
//   const pillBg     = D ? "#21262d" : "#f1f5f9";
//   const pillBd     = D ? "#30363d" : "#e2e8f0";

//   /* ── Drag handlers ── */
//   const horizDrag = usePanelDrag(useCallback((dx) => {
//     if (!containerRef.current) return;
//     setLeftPct(p => Math.min(72, Math.max(22, p + (dx / containerRef.current.offsetWidth) * 100)));
//   }, []));

//   const vertDrag = usePanelDrag(useCallback((_, dy) => {
//     if (!containerRef.current) return;
//     setEditorPct(p => Math.min(85, Math.max(25, p + (dy / containerRef.current.offsetHeight) * 100)));
//   }, []));

//   /* ── Loading state ── */
//   if (loading) return (
//     <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: pageBg }}>
//       <div style={{ width: 30, height: 30, border: "3px solid #ffa116", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
//       <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
//     </div>
//   );

//   /* ── No questions guard ── */
//   if (!questions.length) return (
//     <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: pageBg }}>
//       <p style={{ color: mutedText, fontSize: 15 }}>No questions found for this topic.</p>
//     </div>
//   );

//   const q = questions[currentIdx];
//   const langObj = LANGUAGES.find(l => l.value === language) ?? LANGUAGES[0];

//   return (
//     <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: pageBg, transition: "all 0.25s" }}>

//       {/* ── NAV BAR ── */}
//       <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 12px", height: 48, background: navBg, borderBottom: `1px solid ${navBorder}`, flexShrink: 0 }}>
//         {/* Left: Back + prev/next arrows */}
//         <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
//           <button
//             onClick={handleBack}
//             style={{ background: "none", border: "none", color: navMuted, cursor: "pointer", fontSize: 13, padding: "4px 8px" }}>
//             ← Back
//           </button>
//           <div style={{ display: "flex", gap: 4 }}>
//             <button
//               disabled={currentIdx === 0}
//               onClick={() => goTo(currentIdx - 1)}
//               style={{ padding: 6, background: "none", border: "none", cursor: currentIdx === 0 ? "not-allowed" : "pointer", opacity: currentIdx === 0 ? 0.3 : 1, color: navMuted, fontSize: 14 }}>
//               ◀
//             </button>
//             <button
//               disabled={currentIdx === questions.length - 1}
//               onClick={() => goTo(currentIdx + 1)}
//               style={{ padding: 6, background: "none", border: "none", cursor: currentIdx === questions.length - 1 ? "not-allowed" : "pointer", opacity: currentIdx === questions.length - 1 ? 0.3 : 1, color: navMuted, fontSize: 14 }}>
//               ▶
//             </button>
//           </div>
//           <span style={{ fontSize: 12, color: navMuted }}>{currentIdx + 1} / {questions.length}</span>
//         </div>

//         {/* Center: Run + Submit */}
//         <div style={{ display: "flex", gap: 10 }}>
//           <button
//             onClick={handleRun}
//             disabled={isRunning || isSubmitting}
//             style={{ padding: "6px 16px", borderRadius: 6, fontSize: 12, fontWeight: 600, background: btnRunBg, border: `1px solid ${btnRunBd}`, color: btnRunTx, cursor: isRunning || isSubmitting ? "not-allowed" : "pointer", opacity: isRunning || isSubmitting ? 0.6 : 1 }}>
//             {isRunning ? "Running..." : "▶  Run"}
//           </button>
//           <button
//             onClick={handleSubmit}
//             disabled={isRunning || isSubmitting}
//             style={{ padding: "6px 16px", borderRadius: 6, fontSize: 12, fontWeight: 600, background: "#ffa116", border: "none", color: "#000", cursor: isRunning || isSubmitting ? "not-allowed" : "pointer", opacity: isRunning || isSubmitting ? 0.6 : 1 }}>
//             {isSubmitting ? "Submitting..." : "Submit"}
//           </button>
//         </div>

//         {/* Right: Theme toggle */}
//         <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
//           <button
//             onClick={() => setDark(!dark)}
//             style={{ background: pillBg, border: `1px solid ${pillBd}`, padding: "4px 10px", borderRadius: 12, fontSize: 12, color: navMuted, cursor: "pointer" }}>
//             {dark ? "🌙 Dark" : "☀️ Light"}
//           </button>
//         </div>
//       </nav>

//       {/* ── MAIN CONTENT ── */}
//       <div ref={containerRef} style={{ display: "flex", flex: 1, overflow: "hidden", gap: 4, padding: 4 }}>

//         {/* LEFT: Problem description */}
//         <div style={{ width: `${leftPct}%`, background: panelBg, border: `1px solid ${panelBorder}`, borderRadius: 8, display: "flex", flexDirection: "column", overflow: "hidden" }}>
//           <div style={{ padding: 20, flex: 1, overflowY: "auto" }}>

//             {/* Title + meta */}
//             <h1 style={{ color: heading, fontSize: 20, fontWeight: 700, marginBottom: 10, lineHeight: 1.4 }}>
//               {currentIdx + 1}. {q?.title}
//             </h1>
//             <div style={{ display: "flex", gap: 12, marginBottom: 20, alignItems: "center" }}>
//               <span style={{ color: (DIFF_COLOR[dark ? "dark" : "light"])[q?.difficulty] || "#fbbf24", fontWeight: 600, fontSize: 13 }}>
//                 {q?.difficulty}
//               </span>
//               {q?.marks != null && (
//                 <span style={{ color: mutedText, fontSize: 13 }}>{q.marks} pts</span>
//               )}
//               {q?.timeLimitMs != null && (
//                 <span style={{ color: mutedText, fontSize: 13 }}>⏱ {q.timeLimitMs / 1000}s</span>
//               )}
//             </div>

//             {/* Description */}
//             <div
//               style={{ color: bodyText, lineHeight: 1.7, fontSize: 14 }}
//               dangerouslySetInnerHTML={{ __html: q?.description || q?.question }}
//             />

//             {/* Sample test cases (first 2 only) */}
//             {q?.testCases?.slice(0, 2).map((tc, i) => (
//               <div key={i} style={{ marginTop: 20 }}>
//                 <p style={{ fontWeight: 700, fontSize: 12, color: bodyText, marginBottom: 6 }}>Example {i + 1}:</p>
//                 <pre style={{ background: codeBg, padding: 12, borderRadius: 6, fontSize: 12, color: bodyText, margin: 0, overflowX: "auto" }}>
//                   {"Input:  "}{tc.input}{"\n"}{"Output: "}{tc.expectedOutput}
//                 </pre>
//               </div>
//             ))}

//             {/* Verdict banner */}
//             {verdict && (
//               <div style={{ marginTop: 24, padding: "12px 16px", borderRadius: 8, background: verdict === "accepted" ? "rgba(52,211,153,0.1)" : "rgba(248,113,113,0.1)", border: `1px solid ${verdict === "accepted" ? "rgba(52,211,153,0.4)" : "rgba(248,113,113,0.4)"}` }}>
//                 <span style={{ fontWeight: 700, fontSize: 14, color: verdict === "accepted" ? "#34d399" : "#f87171" }}>
//                   {verdict === "accepted" ? "✅ Accepted" : "❌ Wrong Answer"}
//                 </span>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Horizontal drag handle */}
//         <div onMouseDown={horizDrag} style={{ width: 4, cursor: "col-resize", background: dragBg, borderRadius: 2, flexShrink: 0 }} />

//         {/* RIGHT: Editor + Terminal stack */}
//         <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4, minWidth: 0 }}>

//           {/* Editor panel */}
//           <div style={{ height: `${editorPct}%`, background: panelBg, border: `1px solid ${panelBorder}`, borderRadius: 8, display: "flex", flexDirection: "column", overflow: "hidden" }}>
//             {/* Editor toolbar */}
//             <div style={{ height: 36, display: "flex", alignItems: "center", padding: "0 12px", borderBottom: `1px solid ${panelBorder}`, flexShrink: 0, gap: 8 }}>
//               <select
//                 value={language}
//                 onChange={e => handleLang(e.target.value)}
//                 style={{ background: "none", color: selectText, border: "none", fontSize: 12, cursor: "pointer", fontWeight: 600 }}>
//                 {LANGUAGES.map(l => (
//                   <option key={l.value} value={l.value}>{l.label}</option>
//                 ))}
//               </select>
//             </div>

//             {/* Monaco editor */}
//             <div style={{ flex: 1, overflow: "hidden" }}>
//               <Editor
//                 theme={dark ? "vs-dark" : "light"}
//                 language={langObj.monaco}
//                 value={code}
//                 onChange={v => setCode(v ?? "")}
//                 options={{
//                   minimap:         { enabled: false },
//                   fontSize:        14,
//                   lineHeight:      22,
//                   scrollBeyondLastLine: false,
//                   tabSize:         4,
//                   wordWrap:        "on",
//                 }}
//               />
//             </div>
//           </div>

//           {/* Vertical drag handle */}
//           <div onMouseDown={vertDrag} style={{ height: 4, cursor: "row-resize", background: dragBg, borderRadius: 2, flexShrink: 0 }} />

//           {/* Terminal / Results panel */}
//           <div style={{ flex: 1, background: termBg, border: `1px solid ${termBorder}`, borderRadius: 8, display: "flex", flexDirection: "column", overflow: "hidden", minHeight: 80 }}>
//             {/* Tabs */}
//             <div style={{ display: "flex", gap: 0, borderBottom: `1px solid ${termBorder}`, height: 38, alignItems: "center", padding: "0 4px", flexShrink: 0 }}>
//               {["testcase", "result"].map(tab => (
//                 <button
//                   key={tab}
//                   onClick={() => setActiveTab(tab)}
//                   style={{ padding: "0 14px", height: "100%", background: "none", border: "none", borderBottom: activeTab === tab ? "2px solid #ffa116" : "2px solid transparent", color: activeTab === tab ? tabActive : tabInactive, fontSize: 12, fontWeight: activeTab === tab ? 600 : 400, cursor: "pointer", textTransform: "capitalize" }}>
//                   {tab === "testcase" ? "Test case" : "Result"}
//                 </button>
//               ))}
//             </div>

//             {/* Tab content */}
//             <div style={{ flex: 1, padding: 12, overflowY: "auto" }}>
//               {activeTab === "testcase" ? (
//                 <textarea
//                   value={stdin}
//                   onChange={e => setStdin(e.target.value)}
//                   placeholder="Enter custom input here..."
//                   style={{ width: "100%", height: "100%", background: termInput, color: termText, border: "none", resize: "none", fontFamily: "monospace", fontSize: 13, outline: "none", lineHeight: 1.6 }}
//                 />
//               ) : (
//                 <pre style={{ color: termText, fontSize: 13, margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-word", lineHeight: 1.6 }}>
//                   {output || "Run or submit your code to see results here."}
//                 </pre>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
















// import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
// import { useParams, useHistory } from "react-router-dom";
// import Editor from "@monaco-editor/react";
// import {
//   collection, query, where, getDocs, addDoc, serverTimestamp,
// } from "firebase/firestore";
// import { db } from "../firebase/config";
// import { useAuth } from "../hooks/useAuth";
// import { executeCode } from "../api/compilerService";

// const LANGUAGES = [
//   { label: "C++",        value: "cpp",        monaco: "cpp"        },
//   { label: "Python",     value: "python",     monaco: "python"     },
//   { label: "JavaScript", value: "javascript", monaco: "javascript" },
//   { label: "Java",       value: "java",       monaco: "java"       },
//   { label: "C",          value: "c",          monaco: "c"          },
// ];

// const BOILERPLATE = {
//   cpp:        "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    // Write your solution here\n    return 0;\n}\n",
//   python:     "# Write your solution here\ndef solution():\n    pass\n",
//   javascript: "// Write your solution here\nfunction solution() {\n\n}\n",
//   java:       "public class Solution {\n    public static void main(String[] args) {\n        // Write your solution here\n    }\n}\n",
//   c:          "#include <stdio.h>\n\nint main() {\n    // Write your solution here\n    return 0;\n}\n",
// };

// const DIFF_COLOR = {
//   dark:  { Easy: "#34d399", Medium: "#fbbf24", Hard: "#f87171" },
//   light: { Easy: "#16a34a", Medium: "#d97706", Hard: "#dc2626" },
// };

// /* ── Drag helper ── */
// function usePanelDrag(onMove) {
//   return useCallback((e) => {
//     e.preventDefault();
//     const ox = e.clientX, oy = e.clientY;
//     const mv = (ev) => onMove(ev.clientX - ox, ev.clientY - oy);
//     const up = () => {
//       window.removeEventListener("mousemove", mv);
//       window.removeEventListener("mouseup", up);
//     };
//     window.addEventListener("mousemove", mv);
//     window.addEventListener("mouseup", up);
//   }, [onMove]);
// }

// export default function PracticePage({ embeddedQuestions, initialIndex = 0, onBack }) {
//   const params  = useParams?.() ?? {};
//   const history = useHistory?.();
//   const topicId = params.topicId;
//   const { user } = useAuth();

//   const [questions,  setQuestions]  = useState(embeddedQuestions ?? []);
//   const [currentIdx, setCurrentIdx] = useState(initialIndex);
//   const [loading,    setLoading]    = useState(!embeddedQuestions);

//   const [language,     setLanguage]     = useState("cpp");
//   const [code,         setCode]         = useState("");
//   const [activeTab,    setActiveTab]    = useState("testcase");
//   const [stdin,        setStdin]        = useState("");
//   const [output,       setOutput]       = useState("");
//   const [isRunning,    setIsRunning]    = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [verdict,      setVerdict]      = useState(null);
//   const [dark,         setDark]         = useState(true);
  
//   // MCQ Specific State
//   const [mcqSelection, setMcqSelection] = useState(null);

//   const containerRef = useRef(null);
//   const [leftPct,   setLeftPct]   = useState(42);
//   const [editorPct, setEditorPct] = useState(63);

//   const getInitialCode = useCallback((q, lang) => {
//     if (!q) return BOILERPLATE[lang];
//     return q.boilerplates?.[lang] || q.boilerplate || BOILERPLATE[lang];
//   }, []);

//   useEffect(() => {
//     if (embeddedQuestions) return;
//     if (!topicId) return;
//     (async () => {
//       try {
//         const snap = await getDocs(
//           query(collection(db, "questions"), where("category", "==", topicId))
//         );
//         const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
//         setQuestions(docs);
//         if (docs.length > 0) {
//           const firstQ = docs[initialIndex];
//           setCode(getInitialCode(firstQ, language));
//           if (firstQ.testCases?.[0]) setStdin(firstQ.testCases[0].input);
//         }
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, [topicId, embeddedQuestions, initialIndex, getInitialCode, language]);

//   /* ── Tag-Based Condition: Logic to decide view ── */
//   const q = questions[currentIdx];
//   const isCodingQuestion = useMemo(() => {
//     if (!q) return true;
//     return q.type === 'CODING' || q.type === 'Coding' || (q.tags && q.tags.includes('coding'));
//   }, [q]);

//   const goTo = (idx) => {
//     const targetQ = questions[idx];
//     setCurrentIdx(idx);
//     setMcqSelection(null);
//     setVerdict(null);
//     setOutput("");
//     if (targetQ.type !== 'MCQ') {
//       setCode(getInitialCode(targetQ, language));
//       setStdin(targetQ?.testCases?.[0]?.input || "");
//     }
//   };

//   const handleLang = (langValue) => {
//     setLanguage(langValue);
//     setCode(getInitialCode(questions[currentIdx], langValue));
//   };

//   const handleBack = () => {
//     if (onBack) { onBack(); return; }
//     if (history) history.push("/dashboard");
//   };

//   const handleRun = async () => {
//     if (!code.trim()) return;
//     setIsRunning(true);
//     setActiveTab("result");
//     setOutput("");
//     setVerdict(null);
//     try {
//       const r = await executeCode(language, code, stdin, q?.timeLimitMs || 2000);
//       let resText = r.compile_output ? `Compilation Error:\n${r.compile_output}` 
//                     : r.stderr ? `Runtime Error:\n${r.stderr}` 
//                     : r.stdout || "// No output";
//       setOutput(resText);
//       if (r.status?.id === 3) {
//         const matched = q?.testCases?.find(t => t.input === stdin);
//         if (matched && r.stdout?.trim() === matched.expectedOutput?.trim()) setVerdict("accepted");
//       }
//     } catch (e) { setOutput("Error: " + e.message); }
//     finally { setIsRunning(false); }
//   };

//   const handleSubmitMcq = async () => {
//     if (!user || !mcqSelection) return;
//     setIsSubmitting(true);
//     const isCorrect = mcqSelection === q.correctAnswer;
//     setVerdict(isCorrect ? "accepted" : "wrong");
    
//     try {
//       await addDoc(collection(db, "submissions"), {
//         studentId: user.uid,
//         questionId: q.id,
//         answer: mcqSelection,
//         type: "practice_mcq",
//         status: isCorrect ? "accepted" : "wrong_answer",
//         submittedAt: serverTimestamp(),
//       });
//     } catch (e) { console.error(e); }
//     finally { setIsSubmitting(false); }
//   };

//   const handleSubmitCoding = async () => {
//     if (!user) return;
//     setIsSubmitting(true);
//     setActiveTab("result");
//     setOutput("Running all test cases...");
//     const testCases = q.testCases || [];
//     let passedCount = 0;
//     try {
//       for (let i = 0; i < testCases.length; i++) {
//         const r = await executeCode(language, code, testCases[i].input, q.timeLimitMs || 2000);
//         if (r.status?.id === 3 && r.stdout?.trim() === testCases[i].expectedOutput?.trim()) passedCount++;
//       }
//       const allPassed = passedCount === testCases.length && testCases.length > 0;
//       setVerdict(allPassed ? "accepted" : "wrong");
//       setOutput(allPassed ? `✅ Accepted\nPassed ${passedCount} cases.` : `❌ Wrong Answer\nPassed ${passedCount}/${testCases.length} cases.`);
//       await addDoc(collection(db, "submissions"), {
//         studentId: user.uid,
//         questionId: q.id,
//         code, language,
//         type: "practice_coding",
//         status: allPassed ? "accepted" : "wrong_answer",
//         submittedAt: serverTimestamp(),
//       });
//     } catch (e) { setOutput("Error: " + e.message); }
//     finally { setIsSubmitting(false); }
//   };

//   /* ── Drag handlers ── */
//   const horizDrag = usePanelDrag(useCallback((dx) => {
//     if (!containerRef.current) return;
//     setLeftPct(p => Math.min(72, Math.max(22, p + (dx / containerRef.current.offsetWidth) * 100)));
//   }, []));

//   const vertDrag = usePanelDrag(useCallback((_, dy) => {
//     if (!containerRef.current) return;
//     setEditorPct(p => Math.min(85, Math.max(25, p + (dy / containerRef.current.offsetHeight) * 100)));
//   }, []));

//   // Theme Config
//   const D = dark;
//   const colors = {
//     bg: D ? "#0d1117" : "#f8fafc",
//     panel: D ? "#161b22" : "#ffffff",
//     border: D ? "#30363d" : "#e2e8f0",
//     text: D ? "#c9d1d9" : "#1e293b",
//     heading: D ? "#f0f6fc" : "#0f172a",
//     muted: D ? "#8b949e" : "#64748b"
//   };

//   if (loading) return <div style={{height:'100vh', background:colors.bg, display:'flex', alignItems:'center', justifyContent:'center', color:colors.text}}>Loading...</div>;

//   return (
//     <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: colors.bg, transition: "all 0.2s" }}>
//       {/* Navbar */}
//       <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", height: 50, background: colors.panel, borderBottom: `1px solid ${colors.border}`, flexShrink: 0 }}>
//         <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
//           <button onClick={handleBack} style={{ background: "none", border: "none", color: colors.muted, cursor: "pointer", fontSize: 13 }}>← Back</button>
//           <div style={{display:'flex', gap:8}}>
//             <button disabled={currentIdx === 0} onClick={() => goTo(currentIdx - 1)} style={{background:'none', border:'none', color:colors.text, cursor:'pointer', opacity:currentIdx===0?0.3:1}}>◀</button>
//             <button disabled={currentIdx === questions.length - 1} onClick={() => goTo(currentIdx + 1)} style={{background:'none', border:'none', color:colors.text, cursor:'pointer', opacity:currentIdx===questions.length-1?0.3:1}}>▶</button>
//           </div>
//           <span style={{fontSize:12, color:colors.muted}}>Question {currentIdx + 1} of {questions.length}</span>
//         </div>
        
//         <div style={{display:'flex', gap:10}}>
//            {isCodingQuestion ? (
//              <>
//                <button onClick={handleRun} disabled={isRunning || isSubmitting} style={{padding:'6px 15px', borderRadius:6, background:D?'#21262d':'#f1f5f9', border:`1px solid ${colors.border}`, color:colors.text, cursor:'pointer'}}>Run</button>
//                <button onClick={handleSubmitCoding} disabled={isSubmitting} style={{padding:'6px 15px', borderRadius:6, background:'#ffa116', border:'none', color:'#000', fontWeight:600, cursor:'pointer'}}>Submit</button>
//              </>
//            ) : (
//              <button onClick={handleSubmitMcq} disabled={!mcqSelection || isSubmitting} style={{padding:'6px 15px', borderRadius:6, background:'#ffa116', border:'none', color:'#000', fontWeight:600, cursor:'pointer'}}>Submit Answer</button>
//            )}
//         </div>

//         <button onClick={() => setDark(!dark)} style={{ background: "none", border: `1px solid ${colors.border}`, padding: "4px 10px", borderRadius: 12, fontSize: 12, color: colors.muted, cursor: "pointer" }}>
//           {dark ? "🌙" : "☀️"}
//         </button>
//       </nav>

//       {/* Workspace */}
//       <div ref={containerRef} style={{ display: "flex", flex: 1, overflow: "hidden", padding: 8, gap: 8 }}>
        
//         {/* Description Panel */}
//         <div style={{ width: `${leftPct}%`, background: colors.panel, border: `1px solid ${colors.border}`, borderRadius: 10, display: "flex", flexDirection: "column", overflow: "hidden" }}>
//           <div style={{ padding: 24, flex: 1, overflowY: "auto" }}>
//             <h1 style={{ color: colors.heading, fontSize: 22, fontWeight: 700, marginBottom: 12 }}>{q?.title}</h1>
//             <div style={{ marginBottom: 20 }}>
//                <span style={{ color: DIFF_COLOR[dark ? "dark" : "light"][q?.difficulty], fontWeight: 700, fontSize: 14 }}>{q?.difficulty}</span>
//             </div>
//             <div style={{ color: colors.text, lineHeight: 1.7, fontSize: 15 }} dangerouslySetInnerHTML={{ __html: q?.description || q?.question }} />
            
//             {/* Show Test Cases for Coding only */}
//             {isCodingQuestion && q?.testCases?.slice(0, 2).map((tc, i) => (
//               <div key={i} style={{ marginTop: 25, background: D?'#0d1117':'#f1f5f9', padding: 15, borderRadius: 8 }}>
//                 <p style={{ fontWeight: 700, fontSize: 12, marginBottom: 8, color: colors.muted }}>Example {i + 1}:</p>
//                 <code style={{ fontSize: 13, color: colors.text }}>Input: {tc.input}<br/>Output: {tc.expectedOutput}</code>
//               </div>
//             ))}

//             {verdict && (
//               <div style={{ marginTop: 20, padding: 12, borderRadius: 8, background: verdict === "accepted" ? "#15803d33" : "#b91c1c33", border: `1px solid ${verdict === "accepted" ? "#22c55e" : "#ef4444"}` }}>
//                 <span style={{ color: verdict === "accepted" ? "#4ade80" : "#f87171", fontWeight: 700 }}>{verdict === "accepted" ? "Accepted" : "Wrong Answer"}</span>
//               </div>
//             )}
//           </div>
//         </div>

//         <div onMouseDown={horizDrag} style={{ width: 4, cursor: "col-resize", background: colors.border, borderRadius: 2 }} />

//         {/* Action Panel */}
//         <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
//           {isCodingQuestion ? (
//             /* Coding View */
//             <>
//               <div style={{ height: `${editorPct}%`, background: colors.panel, border: `1px solid ${colors.border}`, borderRadius: 10, overflow: "hidden", display:'flex', flexDirection:'column' }}>
//                 <div style={{padding:'8px 16px', borderBottom:`1px solid ${colors.border}`, fontSize:12, color:colors.muted}}>Code Editor</div>
//                 <div style={{flex:1}}>
//                   <Editor theme={D ? "vs-dark" : "light"} language={LANGUAGES.find(l => l.value === language)?.monaco} value={code} onChange={v => setCode(v ?? "")} options={{ fontSize: 14, minimap: { enabled: false } }} />
//                 </div>
//               </div>
//               <div onMouseDown={vertDrag} style={{ height: 4, cursor: "row-resize", background: colors.border, borderRadius: 2 }} />
//               <div style={{ flex: 1, background: colors.panel, border: `1px solid ${colors.border}`, borderRadius: 10, display: "flex", flexDirection: "column" }}>
//                 <div style={{ display: "flex", gap: 15, padding: "8px 16px", borderBottom: `1px solid ${colors.border}` }}>
//                    <button onClick={() => setActiveTab('testcase')} style={{background:'none', border:'none', color: activeTab==='testcase'?colors.heading:colors.muted, cursor:'pointer', fontWeight:600}}>Input</button>
//                    <button onClick={() => setActiveTab('result')} style={{background:'none', border:'none', color: activeTab==='result'?colors.heading:colors.muted, cursor:'pointer', fontWeight:600}}>Output</button>
//                 </div>
//                 <div style={{ flex: 1, padding: 16, overflowY: "auto" }}>
//                   {activeTab === 'testcase' ? (
//                     <textarea value={stdin} onChange={e => setStdin(e.target.value)} style={{ width: "100%", height: "100%", background: "none", color: colors.text, border: "none", resize: "none", outline: "none", fontFamily: "monospace" }} placeholder="Standard Input..." />
//                   ) : (
//                     <pre style={{ color: colors.text, margin: 0, fontSize: 13, whiteSpace: 'pre-wrap' }}>{output || "Run code to see output..."}</pre>
//                   )}
//                 </div>
//               </div>
//             </>
//           ) : (
//             /* MCQ View */
//             <div style={{ flex: 1, background: colors.panel, border: `1px solid ${colors.border}`, borderRadius: 10, padding: 30 }}>
//                <h3 style={{ color: colors.heading, marginBottom: 25, fontSize: 18 }}>Select your answer:</h3>
//                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
//                  {q?.options?.map((opt, i) => (
//                    <button 
//                      key={i} 
//                      onClick={() => setMcqSelection(opt)}
//                      style={{ 
//                        textAlign: "left", 
//                        padding: "16px 20px", 
//                        borderRadius: 10, 
//                        border: `2px solid ${mcqSelection === opt ? "#ffa116" : colors.border}`, 
//                        background: mcqSelection === opt ? (D?"#ffa11622":"#ffa11611") : "none", 
//                        color: colors.text, 
//                        cursor: "pointer",
//                        fontSize: 15,
//                        transition: "all 0.1s"
//                      }}
//                    >
//                      {opt}
//                    </button>
//                  ))}
//                </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }















// import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
// import { useParams, useHistory } from "react-router-dom";
// import Editor from "@monaco-editor/react";
// import {
//   collection, query, where, getDocs, addDoc, serverTimestamp,
// } from "firebase/firestore";
// import { db } from "../firebase/config";
// import { useAuth } from "../hooks/useAuth";
// import { executeCode } from "../api/compilerService";

// /* ── Language Config (from commented/original code) ── */
// const LANGUAGES = [
//   { label: "C++",        value: "cpp",        monaco: "cpp"        },
//   { label: "Python",     value: "python",     monaco: "python"     },
//   { label: "JavaScript", value: "javascript", monaco: "javascript" },
//   { label: "Java",       value: "java",       monaco: "java"       },
//   { label: "C",          value: "c",          monaco: "c"          },
// ];

// const BOILERPLATE = {
//   cpp:        "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    // Write your solution here\n    return 0;\n}\n",
//   python:     "# Write your solution here\ndef solution():\n    pass\n",
//   javascript: "// Write your solution here\nfunction solution() {\n\n}\n",
//   java:       "public class Solution {\n    public static void main(String[] args) {\n        // Write your solution here\n    }\n}\n",
//   c:          "#include <stdio.h>\n\nint main() {\n    // Write your solution here\n    return 0;\n}\n",
// };

// const DIFF_COLOR = {
//   dark:  { Easy: "#34d399", Medium: "#fbbf24", Hard: "#f87171" },
//   light: { Easy: "#16a34a", Medium: "#d97706", Hard: "#dc2626" },
// };

// /* ── Drag helper ── */
// function usePanelDrag(onMove) {
//   return useCallback((e) => {
//     e.preventDefault();
//     const ox = e.clientX, oy = e.clientY;
//     const mv = (ev) => onMove(ev.clientX - ox, ev.clientY - oy);
//     const up = () => {
//       window.removeEventListener("mousemove", mv);
//       window.removeEventListener("mouseup", up);
//     };
//     window.addEventListener("mousemove", mv);
//     window.addEventListener("mouseup", up);
//   }, [onMove]);
// }

// export default function PracticePage({ embeddedQuestions, initialIndex = 0, onBack }) {
//   const params  = useParams?.() ?? {};
//   const history = useHistory?.();
//   const topicId = params.topicId;
//   const { user } = useAuth();

//   const [questions,    setQuestions]    = useState(embeddedQuestions ?? []);
//   const [currentIdx,   setCurrentIdx]   = useState(initialIndex);
//   const [loading,      setLoading]      = useState(!embeddedQuestions);

//   /* ── Editor state ── */
//   const [language,     setLanguage]     = useState("cpp");
//   const [code,         setCode]         = useState("");
//   const [activeTab,    setActiveTab]    = useState("testcase");
//   const [stdin,        setStdin]        = useState("");
//   const [output,       setOutput]       = useState("");
//   const [isRunning,    setIsRunning]    = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [verdict,      setVerdict]      = useState(null);
//   const [dark,         setDark]         = useState(true);

//   /* ── MCQ state ── */
//   const [mcqSelection,   setMcqSelection]   = useState(null);
//   const [mcqSubmitted,   setMcqSubmitted]   = useState(false);

//   /* ── Panel resize ── */
//   const containerRef = useRef(null);
//   const [leftPct,   setLeftPct]   = useState(42);
//   const [editorPct, setEditorPct] = useState(63);

//   /* ── Stable boilerplate getter ── */
//   const getInitialCode = useCallback((q, lang) => {
//     if (!q) return BOILERPLATE[lang] ?? "";
//     return q.boilerplates?.[lang] || q.boilerplate || BOILERPLATE[lang] || "";
//   }, []);

//   /* ── Fetch questions when routed via /practice/:topicId ── */
//   useEffect(() => {
//     if (embeddedQuestions) return;
//     if (!topicId) return;
//     (async () => {
//       try {
//         const snap = await getDocs(
//           query(collection(db, "questions"), where("category", "==", topicId))
//         );
//         const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
//         setQuestions(docs);
//         if (docs.length > 0) {
//           const first = docs[initialIndex] ?? docs[0];
//           if (first.type !== "MCQ") {
//             setCode(getInitialCode(first, language));
//             if (first.testCases?.[0]) setStdin(first.testCases[0].input);
//           }
//         }
//       } finally {
//         setLoading(false);
//       }
//     })();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [topicId, embeddedQuestions, initialIndex, getInitialCode]);

//   /* ── Current question and type ── */
//   const q = questions[currentIdx];

//   const isCodingQuestion = useMemo(() => {
//     if (!q) return true;
//     const t = (q.type || "").toUpperCase();
//     return t === "CODING" || t === "" || !q.type;
//   }, [q]);

//   /* ── Navigate between questions ── */
//   const goTo = useCallback((idx) => {
//     const targetQ = questions[idx];
//     setCurrentIdx(idx);
//     setMcqSelection(null);
//     setMcqSubmitted(false);
//     setVerdict(null);
//     setOutput("");
//     setActiveTab("testcase");
//     if (targetQ && (targetQ.type || "").toUpperCase() !== "MCQ") {
//       setCode(getInitialCode(targetQ, language));
//       setStdin(targetQ?.testCases?.[0]?.input || "");
//     }
//   }, [questions, language, getInitialCode]);

//   /* ── Language change ── */
//   const handleLang = (langValue) => {
//     setLanguage(langValue);
//     if (q && (q.type || "").toUpperCase() !== "MCQ") {
//       setCode(getInitialCode(q, langValue));
//     }
//   };

//   /* ── Back button ── */
//   const handleBack = () => {
//     if (onBack) { onBack(); return; }
//     if (history) history.push("/dashboard");
//   };

//   /* ── RUN: executes visible stdin only ── */
//   const handleRun = async () => {
//     if (!code.trim()) return;
//     setIsRunning(true);
//     setActiveTab("result");
//     setOutput("");
//     setVerdict(null);
//     try {
//       const r = await executeCode(language, code, stdin, q?.timeLimitMs || 2000);
//       let resText = "";
//       if (r.compile_output)   resText = `Compilation Error:\n${r.compile_output}`;
//       else if (r.stderr)       resText = `Runtime Error:\n${r.stderr}`;
//       else                     resText = r.stdout || "// No output";
//       setOutput(resText);
//       if (r.status?.id === 3) {
//         const matched = q?.testCases?.find(t => t.input === stdin);
//         if (matched && r.stdout?.trim() === matched.expectedOutput?.trim()) {
//           setVerdict("accepted");
//         }
//       }
//     } catch (e) {
//       setOutput("Execution Error: " + e.message);
//     } finally {
//       setIsRunning(false);
//     }
//   };

//   /* ── SUBMIT MCQ ── */
//   const handleSubmitMcq = async () => {
//     if (!mcqSelection) return;
//     setIsSubmitting(true);
//     const isCorrect = mcqSelection === q.correctAnswer;
//     setVerdict(isCorrect ? "accepted" : "wrong");
//     setMcqSubmitted(true);
//     try {
//       if (user) {
//         await addDoc(collection(db, "submissions"), {
//           studentId:   user.uid,
//           questionId:  q.id,
//           answer:      mcqSelection,
//           type:        "practice_mcq",
//           status:      isCorrect ? "accepted" : "wrong_answer",
//           submittedAt: serverTimestamp(),
//         });
//       }
//     } catch (e) { console.error(e); }
//     finally { setIsSubmitting(false); }
//   };

//   /* ── SUBMIT CODING: runs ALL test cases ── */
//   const handleSubmitCoding = async () => {
//     if (!user || !q) return;
//     setIsSubmitting(true);
//     setActiveTab("result");
//     setOutput("Running all test cases...");
//     setVerdict(null);
//     const testCases = q.testCases || [];
//     let passedCount = 0;
//     let logs = "";
//     try {
//       for (let i = 0; i < testCases.length; i++) {
//         const r = await executeCode(language, code, testCases[i].input, q.timeLimitMs || 2000);
//         const actual   = r.stdout?.trim();
//         const expected = testCases[i].expectedOutput?.trim();
//         const ok       = r.status?.id === 3 && actual === expected;
//         if (ok) passedCount++;
//         logs += `Test ${i + 1}: ${ok ? "✅ Passed" : "❌ Failed"}\n`;
//         if (!ok && r.stderr) logs += `   Error: ${r.stderr}\n`;
//       }
//       const allPassed = passedCount === testCases.length && testCases.length > 0;
//       setVerdict(allPassed ? "accepted" : "wrong");
//       setOutput(
//         allPassed
//           ? `✅ Accepted\nPassed all ${testCases.length} test cases.`
//           : `❌ Wrong Answer\nPassed ${passedCount}/${testCases.length} test cases.\n\n${logs}`
//       );
//       await addDoc(collection(db, "submissions"), {
//         studentId:   user.uid,
//         questionId:  q.id,
//         code,
//         language,
//         type:        "practice_coding",
//         score:       passedCount,
//         totalTests:  testCases.length,
//         status:      allPassed ? "accepted" : "wrong_answer",
//         submittedAt: serverTimestamp(),
//       });
//     } catch (e) {
//       setOutput("Submission Error: " + e.message);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   /* ── Drag handlers ── */
//   const horizDrag = usePanelDrag(useCallback((dx) => {
//     if (!containerRef.current) return;
//     setLeftPct(p => Math.min(72, Math.max(22, p + (dx / containerRef.current.offsetWidth) * 100)));
//   }, []));

//   const vertDrag = usePanelDrag(useCallback((_, dy) => {
//     if (!containerRef.current) return;
//     setEditorPct(p => Math.min(85, Math.max(25, p + (dy / containerRef.current.offsetHeight) * 100)));
//   }, []));

//   /* ── Theme tokens ── */
//   const D = dark;
//   const pageBg      = D ? "#0d1117" : "#f0f2f5";
//   const navBg       = D ? "#161b22" : "#ffffff";
//   const navBorder   = D ? "#21262d" : "#e2e8f0";
//   const navMuted    = D ? "#6b7280" : "#94a3b8";
//   const panelBg     = D ? "#161b22" : "#ffffff";
//   const panelBorder = D ? "#21262d" : "#e2e8f0";
//   const heading     = D ? "#f1f5f9" : "#0f172a";
//   const bodyText    = D ? "#cbd5e1" : "#334155";
//   const mutedText   = D ? "#6b7280" : "#64748b";
//   const codeBg      = D ? "#0d1117" : "#f1f5f9";
//   const termBg      = D ? "#0d1117" : "#ffffff";
//   const termText    = D ? "#e6edf3" : "#1f2937";
//   const termBorder  = D ? "#21262d" : "#e5e7eb";
//   const termInput   = D ? "#0d1117" : "#f9fafb";
//   const selectText  = D ? "#e2e8f0" : "#1e293b";
//   const selectBg    = D ? "#161b22" : "#ffffff";
//   const dragBg      = D ? "#21262d" : "#cbd5e1";
//   const tabActive   = D ? "#ffffff" : "#0f172a";
//   const tabInactive = D ? "#6b7280" : "#64748b";
//   const btnRunBg    = D ? "#21262d" : "#f1f5f9";
//   const btnRunBd    = D ? "#30363d" : "#cbd5e1";
//   const btnRunTx    = D ? "#e2e8f0" : "#1e293b";
//   const pillBg      = D ? "#21262d" : "#f1f5f9";
//   const pillBd      = D ? "#30363d" : "#e2e8f0";

//   const langObj = LANGUAGES.find(l => l.value === language) ?? LANGUAGES[0];

//   /* ── Loading ── */
//   if (loading) return (
//     <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100vh", background: pageBg }}>
//       <div style={{ width:32, height:32, border:"3px solid #ffa116", borderTopColor:"transparent", borderRadius:"50%", animation:"spin .8s linear infinite" }} />
//       <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
//     </div>
//   );

//   if (!questions.length) return (
//     <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100vh", background: pageBg }}>
//       <p style={{ color: mutedText, fontSize:15 }}>No questions found for this topic.</p>
//     </div>
//   );

//   /* ── MCQ option styling helper ── */
//   const optStyle = (opt) => {
//     if (!mcqSubmitted) {
//       const sel = mcqSelection === opt;
//       return {
//         background: sel ? (D ? "rgba(255,161,22,0.15)" : "#fffbeb") : panelBg,
//         border: `2px solid ${sel ? "#ffa116" : panelBorder}`,
//         color: bodyText,
//       };
//     }
//     // after submit: show correct/wrong
//     const isCorrectOpt  = opt === q.correctAnswer;
//     const isSelectedOpt = mcqSelection === opt;
//     if (isCorrectOpt)                    return { background:"rgba(52,211,153,0.12)", border:"2px solid #34d399", color: D?"#34d399":"#16a34a" };
//     if (isSelectedOpt && !isCorrectOpt)  return { background:"rgba(248,113,113,0.12)", border:"2px solid #f87171", color: D?"#f87171":"#dc2626" };
//     return { background: panelBg, border:`2px solid ${panelBorder}`, color: mutedText };
//   };

//   /* ════════════════════════════════════════════════
//      RENDER
//   ════════════════════════════════════════════════ */
//   return (
//     <div style={{ display:"flex", flexDirection:"column", height:"100vh", background: pageBg, transition:"all .25s" }}>
//       <style>{`
//         *{box-sizing:border-box;}
//         @keyframes spin{to{transform:rotate(360deg)}}
//         .opt-btn:hover{opacity:.9;cursor:pointer;}
//         .nav-q-btn:hover{background:rgba(255,161,22,.1)!important;color:#ffa116!important;}
//       `}</style>

//       {/* ── TOP NAVBAR ── */}
//       <nav style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 16px", height:50, background: navBg, borderBottom:`1px solid ${navBorder}`, flexShrink:0 }}>
//         {/* Left */}
//         <div style={{ display:"flex", alignItems:"center", gap:14 }}>
//           <button onClick={handleBack} style={{ background:"none", border:"none", color: navMuted, cursor:"pointer", fontSize:14, padding:"4px 8px" }}>
//             ← Back
//           </button>
//           <div style={{ display:"flex", gap:4 }}>
//             <button disabled={currentIdx === 0} onClick={() => goTo(currentIdx - 1)}
//               style={{ padding:"6px 10px", background:"none", border:"none", cursor: currentIdx===0?"not-allowed":"pointer", opacity: currentIdx===0?0.3:1, color: navMuted, fontSize:15 }}>◀</button>
//             <button disabled={currentIdx === questions.length - 1} onClick={() => goTo(currentIdx + 1)}
//               style={{ padding:"6px 10px", background:"none", border:"none", cursor: currentIdx===questions.length-1?"not-allowed":"pointer", opacity: currentIdx===questions.length-1?0.3:1, color: navMuted, fontSize:15 }}>▶</button>
//           </div>
//           <span style={{ fontSize:13, color: navMuted }}>{currentIdx + 1} / {questions.length}</span>
//           {/* Question type badge */}
//           <span style={{ fontSize:11, fontWeight:700, padding:"3px 8px", borderRadius:5, background: isCodingQuestion ? "rgba(88,166,255,.15)" : "rgba(255,161,22,.15)", color: isCodingQuestion ? "#58a6ff" : "#ffa116", letterSpacing:"0.06em" }}>
//             {isCodingQuestion ? "💻 CODING" : "📝 MCQ"}
//           </span>
//         </div>

//         {/* Center actions */}
//         <div style={{ display:"flex", gap:10, alignItems:"center" }}>
//           {isCodingQuestion ? (
//             <>
//               {/* Language selector — from original commented code */}
//               <select value={language} onChange={e => handleLang(e.target.value)}
//                 style={{ background: selectBg, color: selectText, border:`1px solid ${navBorder}`, borderRadius:6, padding:"5px 10px", fontSize:13, cursor:"pointer", fontWeight:600, outline:"none" }}>
//                 {LANGUAGES.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
//               </select>
//               <button onClick={handleRun} disabled={isRunning || isSubmitting}
//                 style={{ padding:"6px 18px", borderRadius:6, fontSize:13, fontWeight:600, background: btnRunBg, border:`1px solid ${btnRunBd}`, color: btnRunTx, cursor: isRunning||isSubmitting?"not-allowed":"pointer", opacity: isRunning||isSubmitting?0.6:1 }}>
//                 {isRunning ? "Running…" : "▶  Run"}
//               </button>
//               <button onClick={handleSubmitCoding} disabled={isRunning || isSubmitting}
//                 style={{ padding:"6px 18px", borderRadius:6, fontSize:13, fontWeight:600, background:"#ffa116", border:"none", color:"#000", cursor: isRunning||isSubmitting?"not-allowed":"pointer", opacity: isRunning||isSubmitting?0.6:1 }}>
//                 {isSubmitting ? "Submitting…" : "Submit"}
//               </button>
//             </>
//           ) : (
//             <button onClick={handleSubmitMcq} disabled={!mcqSelection || isSubmitting || mcqSubmitted}
//               style={{ padding:"6px 18px", borderRadius:6, fontSize:13, fontWeight:600, background: mcqSubmitted?"#21262d":"#ffa116", border:"none", color: mcqSubmitted?"#6b7280":"#000", cursor: (!mcqSelection||isSubmitting||mcqSubmitted)?"not-allowed":"pointer" }}>
//               {mcqSubmitted ? "Submitted ✓" : isSubmitting ? "Submitting…" : "Submit Answer"}
//             </button>
//           )}
//         </div>

//         {/* Right — theme */}
//         <button onClick={() => setDark(!dark)}
//           style={{ background: pillBg, border:`1px solid ${pillBd}`, padding:"5px 12px", borderRadius:12, fontSize:13, color: navMuted, cursor:"pointer" }}>
//           {dark ? "🌙 Dark" : "☀️ Light"}
//         </button>
//       </nav>

//       {/* ── MAIN WORKSPACE ── */}
//       <div ref={containerRef} style={{ display:"flex", flex:1, overflow:"hidden", gap:6, padding:6 }}>

//         {/* LEFT: Problem Description */}
//         <div style={{ width:`${leftPct}%`, background: panelBg, border:`1px solid ${panelBorder}`, borderRadius:10, display:"flex", flexDirection:"column", overflow:"hidden" }}>
//           <div style={{ padding:24, flex:1, overflowY:"auto" }}>

//             {/* Title */}
//             <h1 style={{ color: heading, fontSize:21, fontWeight:700, marginBottom:12, lineHeight:1.4 }}>
//               {currentIdx + 1}. {q?.title}
//             </h1>

//             {/* Meta */}
//             <div style={{ display:"flex", gap:14, marginBottom:20, alignItems:"center", flexWrap:"wrap" }}>
//               <span style={{ color:(DIFF_COLOR[dark?"dark":"light"])[q?.difficulty]||"#fbbf24", fontWeight:700, fontSize:14 }}>
//                 {q?.difficulty}
//               </span>
//               {q?.marks != null && <span style={{ color: mutedText, fontSize:13 }}>{q.marks} pts</span>}
//               {q?.timeLimitMs != null && <span style={{ color: mutedText, fontSize:13 }}>⏱ {q.timeLimitMs/1000}s</span>}
//               <span style={{ fontSize:11, fontWeight:700, padding:"2px 8px", borderRadius:4, background: isCodingQuestion?"rgba(88,166,255,.12)":"rgba(255,161,22,.12)", color: isCodingQuestion?"#58a6ff":"#ffa116" }}>
//                 {isCodingQuestion ? "Coding" : "MCQ"}
//               </span>
//             </div>

//             {/* Description */}
//             <div style={{ color: bodyText, lineHeight:1.75, fontSize:15 }}
//               dangerouslySetInnerHTML={{ __html: q?.description || q?.question }} />

//             {/* Sample test cases — coding only */}
//             {isCodingQuestion && q?.testCases?.slice(0, 2).map((tc, i) => (
//               <div key={i} style={{ marginTop:22 }}>
//                 <p style={{ fontWeight:700, fontSize:13, color: bodyText, marginBottom:8 }}>Example {i+1}:</p>
//                 <pre style={{ background: codeBg, padding:14, borderRadius:8, fontSize:13, color: bodyText, margin:0, overflowX:"auto", lineHeight:1.6 }}>
//                   {"Input:  "}{tc.input}{"\n"}{"Output: "}{tc.expectedOutput}
//                 </pre>
//               </div>
//             ))}

//             {/* Verdict banner */}
//             {verdict && (
//               <div style={{ marginTop:24, padding:"14px 18px", borderRadius:10, background: verdict==="accepted"?"rgba(52,211,153,0.1)":"rgba(248,113,113,0.1)", border:`1px solid ${verdict==="accepted"?"rgba(52,211,153,0.4)":"rgba(248,113,113,0.4)"}` }}>
//                 <span style={{ fontWeight:700, fontSize:15, color: verdict==="accepted"?(D?"#34d399":"#16a34a"):(D?"#f87171":"#dc2626") }}>
//                   {verdict==="accepted" ? "✅ Accepted" : "❌ Wrong Answer"}
//                 </span>
//                 {!isCodingQuestion && mcqSubmitted && q?.correctAnswer && (
//                   <p style={{ marginTop:8, fontSize:13, color: D?"#8b949e":"#64748b" }}>
//                     Correct answer: <strong style={{ color: D?"#34d399":"#16a34a" }}>{q.correctAnswer}</strong>
//                   </p>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Horizontal drag */}
//         <div onMouseDown={horizDrag} style={{ width:5, cursor:"col-resize", background: dragBg, borderRadius:3, flexShrink:0 }} />

//         {/* RIGHT panel — depends on question type */}
//         <div style={{ flex:1, display:"flex", flexDirection:"column", gap:6, minWidth:0 }}>

//           {isCodingQuestion ? (
//             /* ── CODING VIEW ── */
//             <>
//               {/* Editor panel */}
//               <div style={{ height:`${editorPct}%`, background: panelBg, border:`1px solid ${panelBorder}`, borderRadius:10, display:"flex", flexDirection:"column", overflow:"hidden" }}>
//                 {/* Editor toolbar */}
//                 <div style={{ height:38, display:"flex", alignItems:"center", padding:"0 14px", borderBottom:`1px solid ${panelBorder}`, flexShrink:0, gap:10 }}>
//                   {/* Language selector in editor toolbar too */}
//                   <select value={language} onChange={e => handleLang(e.target.value)}
//                     style={{ background:"none", color: selectText, border:"none", fontSize:13, cursor:"pointer", fontWeight:700, outline:"none" }}>
//                     {LANGUAGES.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
//                   </select>
//                   <span style={{ fontSize:11, color: mutedText, marginLeft:"auto" }}>
//                     {langObj.label} · Monaco Editor
//                   </span>
//                 </div>
//                 {/* Monaco */}
//                 <div style={{ flex:1, overflow:"hidden" }}>
//                   <Editor
//                     theme={dark ? "vs-dark" : "light"}
//                     language={langObj.monaco}
//                     value={code}
//                     onChange={v => setCode(v ?? "")}
//                     options={{
//                       minimap:              { enabled: false },
//                       fontSize:             14,
//                       lineHeight:           22,
//                       scrollBeyondLastLine: false,
//                       tabSize:              4,
//                       wordWrap:             "on",
//                     }}
//                   />
//                 </div>
//               </div>

//               {/* Vertical drag */}
//               <div onMouseDown={vertDrag} style={{ height:5, cursor:"row-resize", background: dragBg, borderRadius:3, flexShrink:0 }} />

//               {/* Terminal / Results */}
//               <div style={{ flex:1, background: termBg, border:`1px solid ${termBorder}`, borderRadius:10, display:"flex", flexDirection:"column", overflow:"hidden", minHeight:80 }}>
//                 {/* Tabs */}
//                 <div style={{ display:"flex", borderBottom:`1px solid ${termBorder}`, height:40, alignItems:"center", padding:"0 6px", flexShrink:0 }}>
//                   {["testcase","result"].map(tab => (
//                     <button key={tab} onClick={() => setActiveTab(tab)}
//                       style={{ padding:"0 16px", height:"100%", background:"none", border:"none", borderBottom: activeTab===tab?"2px solid #ffa116":"2px solid transparent", color: activeTab===tab?tabActive:tabInactive, fontSize:13, fontWeight: activeTab===tab?700:400, cursor:"pointer", textTransform:"capitalize" }}>
//                       {tab === "testcase" ? "Test Input" : "Output"}
//                     </button>
//                   ))}
//                 </div>
//                 {/* Content */}
//                 <div style={{ flex:1, padding:14, overflowY:"auto" }}>
//                   {activeTab === "testcase" ? (
//                     <textarea value={stdin} onChange={e => setStdin(e.target.value)}
//                       placeholder="Enter custom input here..."
//                       style={{ width:"100%", height:"100%", background: termInput, color: termText, border:"none", resize:"none", fontFamily:"'Courier New',monospace", fontSize:13, outline:"none", lineHeight:1.65 }} />
//                   ) : (
//                     <pre style={{ color: termText, fontSize:13, margin:0, whiteSpace:"pre-wrap", wordBreak:"break-word", lineHeight:1.65 }}>
//                       {output || "Run or submit your code to see results here."}
//                     </pre>
//                   )}
//                 </div>
//               </div>
//             </>
//           ) : (
//             /* ── MCQ VIEW ── */
//             <div style={{ flex:1, background: panelBg, border:`1px solid ${panelBorder}`, borderRadius:10, overflow:"hidden", display:"flex", flexDirection:"column" }}>
//               <div style={{ padding:"20px 30px", borderBottom:`1px solid ${panelBorder}`, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
//                 <span style={{ fontSize:14, fontWeight:700, color: heading }}>Select your answer</span>
//                 {mcqSubmitted && (
//                   <span style={{ fontSize:12, color: verdict==="accepted"?(D?"#34d399":"#16a34a"):(D?"#f87171":"#dc2626"), fontWeight:700 }}>
//                     {verdict==="accepted" ? "✅ Correct!" : "❌ Incorrect"}
//                   </span>
//                 )}
//               </div>
//               <div style={{ flex:1, padding:24, overflowY:"auto" }}>
//                 <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
//                   {(q?.options || []).map((opt, i) => {
//                     const letter = ["A","B","C","D","E"][i];
//                     const st = optStyle(opt);
//                     return (
//                       <button key={i} className="opt-btn"
//                         onClick={() => !mcqSubmitted && setMcqSelection(opt)}
//                         style={{ display:"flex", alignItems:"center", gap:16, padding:"16px 22px", borderRadius:12, textAlign:"left", fontFamily:"inherit", transition:"all .15s", width:"100%", ...st }}>
//                         <span style={{ width:34, height:34, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:800, flexShrink:0,
//                           background: mcqSubmitted
//                             ? (opt===q.correctAnswer ? "#34d399" : mcqSelection===opt ? "#f87171" : D?"#21262d":"#f1f5f9")
//                             : (mcqSelection===opt ? "#ffa116" : D?"#21262d":"#f1f5f9"),
//                           color: mcqSubmitted
//                             ? (opt===q.correctAnswer||mcqSelection===opt ? "#fff" : mutedText)
//                             : (mcqSelection===opt ? "#000" : mutedText) }}>
//                           {mcqSubmitted && opt===q.correctAnswer ? "✓" : mcqSubmitted && mcqSelection===opt && opt!==q.correctAnswer ? "✗" : letter}
//                         </span>
//                         <span style={{ fontSize:15, lineHeight:1.5 }}>{opt}</span>
//                       </button>
//                     );
//                   })}
//                 </div>

//                 {/* MCQ navigation footer */}
//                 <div style={{ display:"flex", justifyContent:"space-between", marginTop:32, paddingTop:20, borderTop:`1px solid ${panelBorder}` }}>
//                   <button onClick={() => goTo(currentIdx - 1)} disabled={currentIdx===0}
//                     style={{ padding:"10px 22px", background: btnRunBg, border:`1px solid ${btnRunBd}`, borderRadius:8, color: currentIdx===0?mutedText:bodyText, fontSize:14, fontWeight:600, cursor: currentIdx===0?"not-allowed":"pointer", opacity: currentIdx===0?0.4:1 }}>
//                     ← Previous
//                   </button>
//                   {mcqSubmitted && currentIdx < questions.length - 1 && (
//                     <button onClick={() => goTo(currentIdx + 1)}
//                       style={{ padding:"10px 22px", background:"#ffa116", border:"none", borderRadius:8, color:"#000", fontSize:14, fontWeight:700, cursor:"pointer" }}>
//                       Next Question →
//                     </button>
//                   )}
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }











// import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
// import { useParams, useHistory } from "react-router-dom";
// import Editor from "@monaco-editor/react";
// import {
//   collection, query, where, getDocs, addDoc, serverTimestamp, or,
// } from "firebase/firestore";
// import { db } from "../firebase/config";
// import { useAuth } from "../hooks/useAuth";
// import { executeCode } from "../api/compilerService";

// /* ── Languages ── */
// const LANGUAGES = [
//   { label: "C++",        value: "cpp",        monaco: "cpp"        },
//   { label: "Python",     value: "python",     monaco: "python"     },
//   { label: "JavaScript", value: "javascript", monaco: "javascript" },
//   { label: "Java",       value: "java",       monaco: "java"       },
//   { label: "C",          value: "c",          monaco: "c"          },
// ];

// const BOILERPLATE = {
//   cpp:        "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    // Write your solution here\n    return 0;\n}\n",
//   python:     "# Write your solution here\ndef solution():\n    pass\n",
//   javascript: "// Write your solution here\nfunction solution() {\n\n}\n",
//   java:       "public class Solution {\n    public static void main(String[] args) {\n        // Write your solution here\n    }\n}\n",
//   c:          "#include <stdio.h>\n\nint main() {\n    // Write your solution here\n    return 0;\n}\n",
// };

// const DIFF_DARK  = { Easy:"#34d399", Medium:"#fbbf24", Hard:"#f87171" };
// const DIFF_LIGHT = { Easy:"#16a34a", Medium:"#d97706", Hard:"#dc2626" };

// /* ── Convert URL slug → possible category names ──────────────────────
//    /practice/aptitude        → ["aptitude","Aptitude","APTITUDE"]
//    /practice/io-basics       → ["io-basics","I/O Basics","io basics"]
// ─────────────────────────────────────────────────────────────────────── */
// function slugToVariants(slug) {
//   if (!slug) return [];
//   const base  = slug.trim();
//   // un-hyphenate
//   const space = base.replace(/-/g, " ");
//   // Title Case
//   const title = space.replace(/\b\w/g, c => c.toUpperCase());
//   // ALL CAPS
//   const upper = title.toUpperCase();
//   // original mixed (e.g. "I/O Basics" stored as-is)
//   const slash = space.replace(/\b(i o|i\/o)\b/gi, "I/O");
//   return [...new Set([base, space, title, upper, slash])];
// }

// /* ── Drag helper ── */
// function usePanelDrag(onMove) {
//   return useCallback((e) => {
//     e.preventDefault();
//     const ox = e.clientX, oy = e.clientY;
//     const mv = (ev) => onMove(ev.clientX - ox, ev.clientY - oy);
//     const up = () => { window.removeEventListener("mousemove", mv); window.removeEventListener("mouseup", up); };
//     window.addEventListener("mousemove", mv);
//     window.addEventListener("mouseup", up);
//   }, [onMove]);
// }

// export default function PracticePage({ embeddedQuestions, initialIndex = 0, onBack }) {
//   const params   = useParams?.() ?? {};
//   const history  = useHistory?.();
//   const { currentUser, user } = useAuth();
//   const activeUser = currentUser || user;

//   // topicId is the URL slug: e.g. "aptitude", "io-basics", "array"
//   const topicSlug = params.topicId;

//   const [questions,    setQuestions]    = useState(embeddedQuestions ?? []);
//   const [currentIdx,   setCurrentIdx]   = useState(initialIndex);
//   const [loading,      setLoading]      = useState(!embeddedQuestions);
//   const [fetchError,   setFetchError]   = useState(null);

//   /* ── Editor ── */
//   const [language,     setLanguage]     = useState("cpp");
//   const [code,         setCode]         = useState(BOILERPLATE.cpp);
//   const [activeTab,    setActiveTab]    = useState("testcase");
//   const [stdin,        setStdin]        = useState("");
//   const [output,       setOutput]       = useState("");
//   const [isRunning,    setIsRunning]    = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [verdict,      setVerdict]      = useState(null);
//   const [dark,         setDark]         = useState(true);

//   /* ── MCQ ── */
//   const [mcqSelection, setMcqSelection] = useState(null);
//   const [mcqSubmitted, setMcqSubmitted] = useState(false);

//   /* ── Panel resize ── */
//   const containerRef = useRef(null);
//   const [leftPct,   setLeftPct]   = useState(42);
//   const [editorPct, setEditorPct] = useState(63);

//   const getInitialCode = useCallback((q, lang) =>
//     q?.boilerplates?.[lang] || q?.boilerplate || BOILERPLATE[lang] || "", []);

//   /* ════════════════════════════════════════════════════════
//      FETCH — tries multiple strategies to find questions
//   ════════════════════════════════════════════════════════ */
//   useEffect(() => {
//     if (embeddedQuestions) return;
//     if (!topicSlug) { setLoading(false); return; }

//     const fetchQuestions = async () => {
//       setLoading(true);
//       setFetchError(null);
//       let found = [];

//       try {
//         const variants = slugToVariants(topicSlug);
//         console.log("PracticePage: searching for slug variants:", variants);

//         // ── Strategy 1: category field matches any variant ──
//         for (const v of variants) {
//           if (found.length > 0) break;
//           try {
//             const snap = await getDocs(
//               query(collection(db, "questions"), where("category", "==", v))
//             );
//             if (!snap.empty) {
//               found = snap.docs.map(d => ({ id: d.id, ...d.data() }));
//               console.log(`Found ${found.length} questions with category="${v}"`);
//             }
//           } catch (e) { /* index may not exist for this value, continue */ }
//         }

//         // ── Strategy 2: topicName field matches any variant ──
//         if (found.length === 0) {
//           for (const v of variants) {
//             if (found.length > 0) break;
//             try {
//               const snap = await getDocs(
//                 query(collection(db, "questions"), where("topicName", "==", v))
//               );
//               if (!snap.empty) {
//                 found = snap.docs.map(d => ({ id: d.id, ...d.data() }));
//                 console.log(`Found ${found.length} questions with topicName="${v}"`);
//               }
//             } catch (e) { /* continue */ }
//           }
//         }

//         // ── Strategy 3: scan ALL questions and match loosely ──
//         if (found.length === 0) {
//           console.warn("Falling back to full scan for slug:", topicSlug);
//           const allSnap = await getDocs(collection(db, "questions"));
//           const allQs   = allSnap.docs.map(d => ({ id: d.id, ...d.data() }));

//           const normalize = (s = "") =>
//             s.toLowerCase().replace(/[^a-z0-9]/g, "");
//           const targetNorm = normalize(topicSlug);

//           found = allQs.filter(q => {
//             const catNorm   = normalize(q.category || "");
//             const topicNorm = normalize(q.topicName || "");
//             const titleNorm = normalize(q.title || q.question || "");
//             return catNorm === targetNorm ||
//                    topicNorm === targetNorm ||
//                    catNorm.includes(targetNorm) ||
//                    targetNorm.includes(catNorm);
//           });
//           console.log(`Scan found ${found.length} questions for "${topicSlug}"`);
//         }

//         // ── Separate: Coding first, then MCQs ──
//         const coding = found.filter(q => {
//           const t = (q.type || "").toUpperCase();
//           return t === "CODING" || t === "" || !q.type;
//         });
//         const mcqs = found.filter(q => (q.type || "").toUpperCase() === "MCQ");
//         const sorted = [...coding, ...mcqs];

//         setQuestions(sorted);

//         if (sorted.length > 0) {
//           const first = sorted[initialIndex] ?? sorted[0];
//           const isFirstCoding = (first.type || "").toUpperCase() !== "MCQ";
//           if (isFirstCoding) {
//             setCode(getInitialCode(first, language));
//             if (first.testCases?.[0]) setStdin(first.testCases[0].input);
//           }
//         }
//       } catch (err) {
//         console.error("fetchQuestions error:", err);
//         setFetchError(err.message);
//       }

//       setLoading(false);
//     };

//     fetchQuestions();
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [topicSlug, embeddedQuestions, initialIndex]);

//   /* ── Current question ── */
//   const q = questions[currentIdx];
//   const isCodingQuestion = useMemo(() => {
//     if (!q) return true;
//     const t = (q.type || "").toUpperCase();
//     return t === "CODING" || t === "" || !q.type;
//   }, [q]);

//   /* ── Navigate ── */
//   const goTo = useCallback((idx) => {
//     const target = questions[idx];
//     setCurrentIdx(idx);
//     setMcqSelection(null);
//     setMcqSubmitted(false);
//     setVerdict(null);
//     setOutput("");
//     setActiveTab("testcase");
//     if (target && (target.type || "").toUpperCase() !== "MCQ") {
//       setCode(getInitialCode(target, language));
//       setStdin(target?.testCases?.[0]?.input || "");
//     }
//   }, [questions, language, getInitialCode]);

//   /* ── Language change ── */
//   const handleLang = (lang) => {
//     setLanguage(lang);
//     if (q && (q.type || "").toUpperCase() !== "MCQ") {
//       setCode(getInitialCode(q, lang));
//     }
//   };

//   const handleBack = () => {
//     if (onBack) { onBack(); return; }
//     if (history) history.goBack();
//   };

//   /* ── RUN ── */
//   const handleRun = async () => {
//     if (!code.trim()) return;
//     setIsRunning(true);
//     setActiveTab("result");
//     setOutput("⏳ Running...");
//     setVerdict(null);
//     try {
//       const r = await executeCode(language, code, stdin, q?.timeLimitMs || 2000);
//       let txt = "";
//       if      (r.compile_output) txt = `Compilation Error:\n${r.compile_output}`;
//       else if (r.stderr)          txt = `Runtime Error:\n${r.stderr}`;
//       else                        txt = r.stdout || "// No output";
//       setOutput(txt);
//       if (r.status?.id === 3) {
//         const matched = q?.testCases?.find(t => t.input === stdin);
//         if (matched && r.stdout?.trim() === matched.expectedOutput?.trim()) setVerdict("accepted");
//       }
//     } catch (e) { setOutput("Execution Error: " + e.message); }
//     setIsRunning(false);
//   };

//   /* ── SUBMIT MCQ ── */
//   const handleSubmitMcq = async () => {
//     if (!mcqSelection) return;
//     setIsSubmitting(true);
//     // Support both correctAnswer (string) and correctIndex (number)
//     const isCorrect = q.correctAnswer
//       ? mcqSelection === q.correctAnswer
//       : mcqSelection === q.options?.[q.correctIndex];
//     setVerdict(isCorrect ? "accepted" : "wrong");
//     setMcqSubmitted(true);
//     try {
//       if (activeUser) {
//         await addDoc(collection(db, "submissions"), {
//           studentId:   activeUser.uid,
//           questionId:  q.id,
//           answer:      mcqSelection,
//           type:        "practice_mcq",
//           status:      isCorrect ? "accepted" : "wrong_answer",
//           submittedAt: serverTimestamp(),
//         });
//       }
//     } catch (e) { console.error(e); }
//     setIsSubmitting(false);
//   };

//   /* ── SUBMIT CODING ── */
//   const handleSubmitCoding = async () => {
//     if (!activeUser || !q) return;
//     setIsSubmitting(true);
//     setActiveTab("result");
//     const testCases = q.testCases || [];
//     if (testCases.length === 0) {
//       setOutput("No test cases defined for this question.");
//       setIsSubmitting(false);
//       return;
//     }
//     setOutput(`Running ${testCases.length} test cases...`);
//     setVerdict(null);
//     let passed = 0; let logs = "";
//     try {
//       for (let i = 0; i < testCases.length; i++) {
//         const r  = await executeCode(language, code, testCases[i].input, q.timeLimitMs || 2000);
//         const ok = r.status?.id === 3 && r.stdout?.trim() === testCases[i].expectedOutput?.trim();
//         if (ok) passed++;
//         logs += `Test ${i+1}: ${ok ? "✅ Passed" : "❌ Failed"}\n`;
//         if (!ok && r.stderr) logs += `   Error: ${r.stderr}\n`;
//       }
//       const all = passed === testCases.length;
//       setVerdict(all ? "accepted" : "wrong");
//       setOutput(all
//         ? `✅ All ${testCases.length} test cases passed!`
//         : `❌ ${passed}/${testCases.length} passed\n\n${logs}`);
//       await addDoc(collection(db, "submissions"), {
//         studentId:  activeUser.uid, questionId: q.id, code, language,
//         type: "practice_coding", score: passed, totalTests: testCases.length,
//         status: all ? "accepted" : "wrong_answer", submittedAt: serverTimestamp(),
//       });
//     } catch (e) { setOutput("Submission Error: " + e.message); }
//     setIsSubmitting(false);
//   };

//   /* ── Drag ── */
//   const horizDrag = usePanelDrag(useCallback((dx) => {
//     if (!containerRef.current) return;
//     setLeftPct(p => Math.min(72, Math.max(22, p + (dx / containerRef.current.offsetWidth) * 100)));
//   }, []));
//   const vertDrag = usePanelDrag(useCallback((_, dy) => {
//     if (!containerRef.current) return;
//     setEditorPct(p => Math.min(85, Math.max(25, p + (dy / containerRef.current.offsetHeight) * 100)));
//   }, []));

//   /* ── Theme ── */
//   const D           = dark;
//   const pageBg      = D ? "#0d1117" : "#f0f2f5";
//   const navBg       = D ? "#161b22" : "#ffffff";
//   const navBorder   = D ? "#21262d" : "#e2e8f0";
//   const navMuted    = D ? "#6b7280" : "#94a3b8";
//   const panelBg     = D ? "#161b22" : "#ffffff";
//   const panelBorder = D ? "#21262d" : "#e2e8f0";
//   const heading     = D ? "#f1f5f9" : "#0f172a";
//   const bodyText    = D ? "#cbd5e1" : "#334155";
//   const mutedText   = D ? "#6b7280" : "#64748b";
//   const codeBg      = D ? "#0d1117" : "#f1f5f9";
//   const termBg      = D ? "#0d1117" : "#ffffff";
//   const termText    = D ? "#e6edf3" : "#1f2937";
//   const termBorder  = D ? "#21262d" : "#e5e7eb";
//   const termInput   = D ? "#0d1117" : "#f9fafb";
//   const selectText  = D ? "#e2e8f0" : "#1e293b";
//   const selectBg    = D ? "#161b22" : "#ffffff";
//   const dragBg      = D ? "#21262d" : "#cbd5e1";
//   const tabActive   = D ? "#ffffff" : "#0f172a";
//   const tabInactive = D ? "#6b7280" : "#64748b";
//   const btnRunBg    = D ? "#21262d" : "#f1f5f9";
//   const btnRunBd    = D ? "#30363d" : "#cbd5e1";
//   const btnRunTx    = D ? "#e2e8f0" : "#1e293b";
//   const pillBg      = D ? "#21262d" : "#f1f5f9";
//   const pillBd      = D ? "#30363d" : "#e2e8f0";

//   const diffColors  = D ? DIFF_DARK : DIFF_LIGHT;
//   const langObj     = LANGUAGES.find(l => l.value === language) ?? LANGUAGES[0];

//   /* ── Loading ── */
//   if (loading) return (
//     <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:"100vh", background:pageBg, gap:16 }}>
//       <div style={{ width:36, height:36, border:"3px solid #ffa116", borderTopColor:"transparent", borderRadius:"50%", animation:"spin .8s linear infinite" }}/>
//       <span style={{ color:mutedText, fontSize:14 }}>Loading questions for "{topicSlug}"…</span>
//       <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
//     </div>
//   );

//   /* ── Empty state ── */
//   if (!questions.length) return (
//     <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:"100vh", background:pageBg, gap:16 }}>
//       <div style={{ fontSize:48 }}>📭</div>
//       <p style={{ color:heading, fontSize:18, fontWeight:700 }}>No questions found</p>
//       <p style={{ color:mutedText, fontSize:14, textAlign:"center", maxWidth:400 }}>
//         No questions found for topic: <strong style={{ color:"#ffa116" }}>{topicSlug}</strong>
//         <br/>Make sure questions are saved with <code>category</code> matching this topic name.
//       </p>
//       {fetchError && <p style={{ color:"#f87171", fontSize:13 }}>Error: {fetchError}</p>}
//       <button onClick={handleBack}
//         style={{ marginTop:8, padding:"10px 24px", background:"#ffa116", border:"none", borderRadius:8, color:"#000", fontWeight:700, fontSize:14, cursor:"pointer" }}>
//         ← Go Back
//       </button>
//       <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
//     </div>
//   );

//   /* ── MCQ correct answer helper ── */
//   const correctOpt = q?.correctAnswer || q?.options?.[q?.correctIndex];

//   const optStyle = (opt) => {
//     if (!mcqSubmitted) {
//       const sel = mcqSelection === opt;
//       return { background: sel ? (D?"rgba(255,161,22,0.15)":"#fffbeb") : panelBg, border:`2px solid ${sel?"#ffa116":panelBorder}`, color:bodyText };
//     }
//     const isCorrectOpt  = opt === correctOpt;
//     const isSelectedOpt = mcqSelection === opt;
//     if (isCorrectOpt)                    return { background:"rgba(52,211,153,0.12)", border:"2px solid #34d399", color:D?"#34d399":"#16a34a" };
//     if (isSelectedOpt && !isCorrectOpt)  return { background:"rgba(248,113,113,0.12)", border:"2px solid #f87171", color:D?"#f87171":"#dc2626" };
//     return { background:panelBg, border:`2px solid ${panelBorder}`, color:mutedText };
//   };

//   /* ── Counts for nav bar ── */
//   const codingCount = questions.filter(q => (q.type||"").toUpperCase() !== "MCQ").length;
//   const mcqCount    = questions.filter(q => (q.type||"").toUpperCase() === "MCQ").length;

//   /* ════════════════════════════════════════════════════════ */
//   return (
//     <div style={{ display:"flex", flexDirection:"column", height:"100vh", background:pageBg, transition:"all .25s" }}>
//       <style>{`
//         *{box-sizing:border-box;}
//         @keyframes spin{to{transform:rotate(360deg)}}
//         .opt-btn:hover{opacity:.88;cursor:pointer;}
//       `}</style>

//       {/* ── TOP NAV ── */}
//       <nav style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 16px", height:50, background:navBg, borderBottom:`1px solid ${navBorder}`, flexShrink:0, gap:12 }}>

//         {/* Left */}
//         <div style={{ display:"flex", alignItems:"center", gap:10, flexShrink:0 }}>
//           <button onClick={handleBack}
//             style={{ background:"none", border:"none", color:navMuted, cursor:"pointer", fontSize:13, padding:"4px 8px" }}>
//             ← Back
//           </button>
//           <button disabled={currentIdx===0} onClick={() => goTo(currentIdx-1)}
//             style={{ padding:"5px 9px", background:"none", border:"none", cursor:currentIdx===0?"not-allowed":"pointer", opacity:currentIdx===0?0.3:1, color:navMuted, fontSize:15 }}>◀</button>
//           <button disabled={currentIdx===questions.length-1} onClick={() => goTo(currentIdx+1)}
//             style={{ padding:"5px 9px", background:"none", border:"none", cursor:currentIdx===questions.length-1?"not-allowed":"pointer", opacity:currentIdx===questions.length-1?0.3:1, color:navMuted, fontSize:15 }}>▶</button>
//           <span style={{ fontSize:12, color:navMuted, whiteSpace:"nowrap" }}>
//             {currentIdx+1} / {questions.length}
//           </span>
//           <span style={{ fontSize:10, fontWeight:700, padding:"3px 7px", borderRadius:5, background:isCodingQuestion?"rgba(88,166,255,.15)":"rgba(255,161,22,.15)", color:isCodingQuestion?"#58a6ff":"#ffa116", letterSpacing:"0.06em", whiteSpace:"nowrap" }}>
//             {isCodingQuestion ? "💻 CODING" : "📝 MCQ"}
//           </span>
//         </div>

//         {/* Question pills */}
//         <div style={{ display:"flex", gap:4, overflowX:"auto", maxWidth:360 }}>
//           {questions.map((qItem, i) => {
//             const isMCQ = (qItem.type||"").toUpperCase() === "MCQ";
//             const isActive = i === currentIdx;
//             return (
//               <button key={qItem.id || i} onClick={() => goTo(i)}
//                 style={{
//                   width:28, height:28, borderRadius:6, border:`1px solid ${isActive?"#ffa116":navBorder}`,
//                   background:isActive?"#ffa116":(isMCQ?"rgba(255,161,22,.08)":"rgba(88,166,255,.08)"),
//                   color:isActive?"#000":(isMCQ?"#ffa116":"#58a6ff"),
//                   fontSize:11, fontWeight:700, cursor:"pointer", flexShrink:0
//                 }}>
//                 {i+1}
//               </button>
//             );
//           })}
//         </div>

//         {/* Center actions */}
//         <div style={{ display:"flex", gap:8, alignItems:"center", flexShrink:0 }}>
//           {isCodingQuestion ? (
//             <>
//               <select value={language} onChange={e=>handleLang(e.target.value)}
//                 style={{ background:selectBg, color:selectText, border:`1px solid ${navBorder}`, borderRadius:6, padding:"5px 8px", fontSize:12, cursor:"pointer", fontWeight:600, outline:"none" }}>
//                 {LANGUAGES.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
//               </select>
//               <button onClick={handleRun} disabled={isRunning||isSubmitting}
//                 style={{ padding:"5px 14px", borderRadius:6, fontSize:12, fontWeight:600, background:btnRunBg, border:`1px solid ${btnRunBd}`, color:btnRunTx, cursor:isRunning||isSubmitting?"not-allowed":"pointer", opacity:isRunning||isSubmitting?0.6:1 }}>
//                 {isRunning ? "⏳ Running…" : "▶ Run"}
//               </button>
//               <button onClick={handleSubmitCoding} disabled={isRunning||isSubmitting}
//                 style={{ padding:"5px 14px", borderRadius:6, fontSize:12, fontWeight:600, background:"#ffa116", border:"none", color:"#000", cursor:isRunning||isSubmitting?"not-allowed":"pointer", opacity:isRunning||isSubmitting?0.6:1 }}>
//                 {isSubmitting ? "⏳ Submitting…" : "Submit"}
//               </button>
//             </>
//           ) : (
//             <button onClick={handleSubmitMcq} disabled={!mcqSelection||isSubmitting||mcqSubmitted}
//               style={{ padding:"5px 14px", borderRadius:6, fontSize:12, fontWeight:600, background:mcqSubmitted?"#21262d":"#ffa116", border:"none", color:mcqSubmitted?"#6b7280":"#000", cursor:(!mcqSelection||isSubmitting||mcqSubmitted)?"not-allowed":"pointer" }}>
//               {mcqSubmitted ? "✓ Submitted" : isSubmitting ? "⏳…" : "Submit Answer"}
//             </button>
//           )}
//         </div>

//         {/* Right — theme + stats */}
//         <div style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
//           <span style={{ fontSize:11, color:navMuted }}>💻{codingCount} 📝{mcqCount}</span>
//           <button onClick={() => setDark(!dark)}
//             style={{ background:pillBg, border:`1px solid ${pillBd}`, padding:"4px 10px", borderRadius:10, fontSize:12, color:navMuted, cursor:"pointer" }}>
//             {dark ? "🌙" : "☀️"}
//           </button>
//         </div>
//       </nav>

//       {/* ── WORKSPACE ── */}
//       <div ref={containerRef} style={{ display:"flex", flex:1, overflow:"hidden", gap:6, padding:6 }}>

//         {/* LEFT — Problem */}
//         <div style={{ width:`${leftPct}%`, background:panelBg, border:`1px solid ${panelBorder}`, borderRadius:10, display:"flex", flexDirection:"column", overflow:"hidden" }}>
//           <div style={{ padding:24, flex:1, overflowY:"auto" }}>

//             {/* Title */}
//             <h1 style={{ color:heading, fontSize:20, fontWeight:700, marginBottom:10, lineHeight:1.4 }}>
//               {currentIdx+1}. {q?.title || q?.question}
//             </h1>

//             {/* Meta */}
//             <div style={{ display:"flex", gap:12, marginBottom:18, alignItems:"center", flexWrap:"wrap" }}>
//               {q?.difficulty && (
//                 <span style={{ color:diffColors[q.difficulty]||"#fbbf24", fontWeight:700, fontSize:13 }}>
//                   {q.difficulty}
//                 </span>
//               )}
//               {q?.marks != null && <span style={{ color:mutedText, fontSize:12 }}>{q.marks} pts</span>}
//               {q?.timeLimitMs != null && <span style={{ color:mutedText, fontSize:12 }}>⏱ {q.timeLimitMs/1000}s</span>}
//               <span style={{ fontSize:10, fontWeight:700, padding:"2px 7px", borderRadius:4, background:isCodingQuestion?"rgba(88,166,255,.12)":"rgba(255,161,22,.12)", color:isCodingQuestion?"#58a6ff":"#ffa116" }}>
//                 {isCodingQuestion ? "Coding" : "MCQ"}
//               </span>
//               {q?.tags && <span style={{ fontSize:10, color:mutedText }}>🏷 {q.tags}</span>}
//             </div>

//             {/* Description — coding questions */}
//             {isCodingQuestion && (
//               <div style={{ color:bodyText, lineHeight:1.75, fontSize:14 }}
//                 dangerouslySetInnerHTML={{ __html: q?.description || "" }} />
//             )}

//             {/* MCQ question text (larger) */}
//             {!isCodingQuestion && (
//               <div style={{ color:bodyText, lineHeight:1.75, fontSize:15, marginBottom:8,
//                 padding:"14px 16px", background:D?"rgba(255,161,22,0.06)":"#fffbeb",
//                 borderRadius:8, border:`1px solid ${D?"rgba(255,161,22,0.2)":"#fde68a"}` }}>
//                 {q?.question || q?.title}
//               </div>
//             )}

//             {/* Sample I/O — coding */}
//             {isCodingQuestion && q?.testCases?.slice(0,2).map((tc,i) => (
//               <div key={i} style={{ marginTop:18 }}>
//                 <p style={{ fontWeight:700, fontSize:12, color:bodyText, marginBottom:6 }}>Example {i+1}:</p>
//                 <pre style={{ background:codeBg, padding:12, borderRadius:8, fontSize:12, color:bodyText, margin:0, overflowX:"auto", lineHeight:1.6 }}>
//                   Input:  {tc.input}{"\n"}Output: {tc.expectedOutput}
//                 </pre>
//               </div>
//             ))}

//             {/* Verdict */}
//             {verdict && (
//               <div style={{ marginTop:20, padding:"12px 16px", borderRadius:10,
//                 background:verdict==="accepted"?"rgba(52,211,153,0.1)":"rgba(248,113,113,0.1)",
//                 border:`1px solid ${verdict==="accepted"?"rgba(52,211,153,0.4)":"rgba(248,113,113,0.4)"}` }}>
//                 <span style={{ fontWeight:700, fontSize:14, color:verdict==="accepted"?(D?"#34d399":"#16a34a"):(D?"#f87171":"#dc2626") }}>
//                   {verdict==="accepted" ? "✅ Accepted!" : "❌ Wrong Answer"}
//                 </span>
//                 {!isCodingQuestion && mcqSubmitted && correctOpt && (
//                   <p style={{ marginTop:6, fontSize:12, color:D?"#8b949e":"#64748b" }}>
//                     Correct answer: <strong style={{ color:D?"#34d399":"#16a34a" }}>{correctOpt}</strong>
//                   </p>
//                 )}
//                 {!isCodingQuestion && q?.explanation && (
//                   <p style={{ marginTop:6, fontSize:12, color:bodyText }}>{q.explanation}</p>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Horizontal drag */}
//         <div onMouseDown={horizDrag} style={{ width:5, cursor:"col-resize", background:dragBg, borderRadius:3, flexShrink:0 }} />

//         {/* RIGHT */}
//         <div style={{ flex:1, display:"flex", flexDirection:"column", gap:6, minWidth:0 }}>

//           {isCodingQuestion ? (
//             /* ── CODING ── */
//             <>
//               {/* Editor */}
//               <div style={{ height:`${editorPct}%`, background:panelBg, border:`1px solid ${panelBorder}`, borderRadius:10, display:"flex", flexDirection:"column", overflow:"hidden" }}>
//                 <div style={{ height:38, display:"flex", alignItems:"center", padding:"0 14px", borderBottom:`1px solid ${panelBorder}`, flexShrink:0, gap:10 }}>
//                   <select value={language} onChange={e=>handleLang(e.target.value)}
//                     style={{ background:"none", color:selectText, border:"none", fontSize:12, cursor:"pointer", fontWeight:700, outline:"none" }}>
//                     {LANGUAGES.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
//                   </select>
//                   <span style={{ fontSize:11, color:mutedText, marginLeft:"auto" }}>{langObj.label} · Monaco</span>
//                 </div>
//                 <div style={{ flex:1, overflow:"hidden" }}>
//                   <Editor
//                     theme={dark?"vs-dark":"light"}
//                     language={langObj.monaco}
//                     value={code}
//                     onChange={v => setCode(v??"")}
//                     options={{ minimap:{enabled:false}, fontSize:14, lineHeight:22, scrollBeyondLastLine:false, tabSize:4, wordWrap:"on" }}
//                   />
//                 </div>
//               </div>

//               {/* Vertical drag */}
//               <div onMouseDown={vertDrag} style={{ height:5, cursor:"row-resize", background:dragBg, borderRadius:3, flexShrink:0 }} />

//               {/* Terminal */}
//               <div style={{ flex:1, background:termBg, border:`1px solid ${termBorder}`, borderRadius:10, display:"flex", flexDirection:"column", overflow:"hidden", minHeight:80 }}>
//                 <div style={{ display:"flex", borderBottom:`1px solid ${termBorder}`, height:40, alignItems:"center", padding:"0 6px", flexShrink:0 }}>
//                   {["testcase","result"].map(tab => (
//                     <button key={tab} onClick={() => setActiveTab(tab)}
//                       style={{ padding:"0 16px", height:"100%", background:"none", border:"none", borderBottom:activeTab===tab?"2px solid #ffa116":"2px solid transparent", color:activeTab===tab?tabActive:tabInactive, fontSize:12, fontWeight:activeTab===tab?700:400, cursor:"pointer" }}>
//                       {tab==="testcase"?"📥 Input":"📤 Output"}
//                     </button>
//                   ))}
//                   {output && activeTab==="result" && verdict && (
//                     <span style={{ marginLeft:"auto", marginRight:8, fontSize:11, fontWeight:700, color:verdict==="accepted"?"#34d399":"#f87171" }}>
//                       {verdict==="accepted"?"✅ AC":"❌ WA"}
//                     </span>
//                   )}
//                 </div>
//                 <div style={{ flex:1, padding:12, overflowY:"auto" }}>
//                   {activeTab==="testcase" ? (
//                     <textarea value={stdin} onChange={e=>setStdin(e.target.value)}
//                       placeholder="Custom input (stdin)..."
//                       style={{ width:"100%", height:"100%", background:termInput, color:termText, border:"none", resize:"none", fontFamily:"'Courier New',monospace", fontSize:13, outline:"none", lineHeight:1.65 }} />
//                   ) : (
//                     <pre style={{ color:termText, fontSize:13, margin:0, whiteSpace:"pre-wrap", wordBreak:"break-word", lineHeight:1.65 }}>
//                       {output || "Run or submit to see output here."}
//                     </pre>
//                   )}
//                 </div>
//               </div>
//             </>
//           ) : (
//             /* ── MCQ ── */
//             <div style={{ flex:1, background:panelBg, border:`1px solid ${panelBorder}`, borderRadius:10, overflow:"hidden", display:"flex", flexDirection:"column" }}>
//               <div style={{ padding:"16px 24px", borderBottom:`1px solid ${panelBorder}`, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
//                 <span style={{ fontSize:13, fontWeight:700, color:heading }}>
//                   📝 Choose your answer
//                 </span>
//                 {mcqSubmitted && (
//                   <span style={{ fontSize:12, color:verdict==="accepted"?(D?"#34d399":"#16a34a"):(D?"#f87171":"#dc2626"), fontWeight:700 }}>
//                     {verdict==="accepted" ? "✅ Correct!" : "❌ Incorrect"}
//                   </span>
//                 )}
//               </div>
//               <div style={{ flex:1, padding:20, overflowY:"auto" }}>
//                 <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
//                   {(q?.options || []).map((opt,i) => {
//                     const letter = ["A","B","C","D","E"][i];
//                     const st = optStyle(opt);
//                     return (
//                       <div key={i} className="opt-btn"
//                         onClick={() => !mcqSubmitted && setMcqSelection(opt)}
//                         style={{ display:"flex", alignItems:"center", gap:14, padding:"14px 18px", borderRadius:10, cursor:mcqSubmitted?"default":"pointer", transition:"all .15s", ...st }}>
//                         <span style={{ width:32, height:32, borderRadius:7, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:800, flexShrink:0,
//                           background: mcqSubmitted
//                             ? (opt===correctOpt?"#34d399":mcqSelection===opt?"#f87171":D?"#21262d":"#f1f5f9")
//                             : (mcqSelection===opt?"#ffa116":D?"#21262d":"#f1f5f9"),
//                           color: mcqSubmitted
//                             ? (opt===correctOpt||mcqSelection===opt?"#fff":mutedText)
//                             : (mcqSelection===opt?"#000":mutedText) }}>
//                           {mcqSubmitted && opt===correctOpt ? "✓" : mcqSubmitted && mcqSelection===opt && opt!==correctOpt ? "✗" : letter}
//                         </span>
//                         <span style={{ fontSize:14, lineHeight:1.5 }}>{opt}</span>
//                       </div>
//                     );
//                   })}
//                 </div>

//                 {/* Nav footer */}
//                 <div style={{ display:"flex", justifyContent:"space-between", marginTop:24, paddingTop:16, borderTop:`1px solid ${panelBorder}` }}>
//                   <button onClick={() => goTo(currentIdx-1)} disabled={currentIdx===0}
//                     style={{ padding:"9px 20px", background:btnRunBg, border:`1px solid ${btnRunBd}`, borderRadius:7, color:currentIdx===0?mutedText:bodyText, fontSize:13, fontWeight:600, cursor:currentIdx===0?"not-allowed":"pointer", opacity:currentIdx===0?0.4:1 }}>
//                     ← Prev
//                   </button>
//                   {mcqSubmitted && currentIdx < questions.length-1 && (
//                     <button onClick={() => goTo(currentIdx+1)}
//                       style={{ padding:"9px 20px", background:"#ffa116", border:"none", borderRadius:7, color:"#000", fontSize:13, fontWeight:700, cursor:"pointer" }}>
//                       Next →
//                     </button>
//                   )}
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }






















// ============================================================
// src/pages/PracticePage.jsx  —  FIXED
//
// ROOT CAUSES OF ALL 3 BUGS:
//
// BUG 1 — "NameError: name 'List' is not defined" (Image 3)
//   OLD: handleRun → executeCode(language, code, stdin, ...)
//        Sends raw student code to Judge0 with NO imports.
//        Python's List, Dict etc. are not available → NameError.
//   FIX: handleRun → uses the WRAPPER to add all imports + driver,
//        then passes the wrapped code to Judge0.
//        Student writes only the class body. The wrapper adds
//        "from typing import List..." automatically.
//
// BUG 2 — "// No output" on Run button (Image 2)
//   OLD: executeCode sends code + stdin="[2,7,11,15], 9"
//        Python gets the string on stdin, but twoSum never reads stdin.
//        return [i, j] sends nothing to stdout → empty output.
//   FIX: The wrapper injects the call directly:
//        _sol.twoSum([2,7,11,15], 9)
//        and wraps it in print() so Judge0 captures the output.
//
// BUG 3 — "0/3 passed" even with correct code (Image 1)
//   OLD: handleSubmitCoding → executeCode(language, code, tc.input, ...)
//        Same issues: no imports, no driver, comparison is strict
//        (r.stdout?.trim() === tc.expectedOutput?.trim()).
//        "[0, 1]" !== "[0,1]" → FAIL even if logic is correct.
//   FIX: handleSubmitCoding → runWithTestCases(language, code, q)
//        - Uses wrapper for each test case
//        - normalise() strips spaces so [0, 1] == [0,1]
//        - Shows LeetCode-style per-case pass/fail with details
//
// ⚠️  IMPORTANT: This fix requires question.methodName in Firestore.
//     If methodName is missing, code falls back to raw stdin mode.
//     Add methodName to questions using the updated QuestionForm.
// ============================================================

// import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
// import { useParams, useHistory } from "react-router-dom";
// import Editor from "@monaco-editor/react";
// import {
//   collection, query, where, getDocs, addDoc, serverTimestamp,
// } from "firebase/firestore";
// import { db } from "../firebase/config";
// import { useAuth } from "../hooks/useAuth";
// import { executeCode, runWithTestCases } from "../api/compilerService";

// const LANGUAGES = [
//   { label: "C++",        value: "cpp",        monaco: "cpp"        },
//   { label: "Python",     value: "python",     monaco: "python"     },
//   { label: "JavaScript", value: "javascript", monaco: "javascript" },
//   { label: "Java",       value: "java",       monaco: "java"       },
//   { label: "C",          value: "c",          monaco: "c"          },
// ];

// // Fallback boilerplate when question has no boilerplates stored
// const FALLBACK_BOILERPLATE = {
//   cpp:        "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Write your solution here\n};\n",
//   python:     "class Solution:\n    def solution(self):\n        # Write your solution here\n        pass\n",
//   javascript: "class Solution {\n    solution() {\n        // Write your solution here\n    }\n}\n",
//   java:       "class Solution {\n    public Object solution() {\n        // Write your solution here\n        return null;\n    }\n}\n",
//   c:          "#include <stdio.h>\n\n// Write your solution here\n",
// };

// const DIFF_DARK  = { Easy:"#34d399", Medium:"#fbbf24", Hard:"#f87171" };
// const DIFF_LIGHT = { Easy:"#16a34a", Medium:"#d97706", Hard:"#dc2626" };

// function slugToVariants(slug) {
//   if (!slug) return [];
//   const base  = slug.trim();
//   const space = base.replace(/-/g, " ");
//   const title = space.replace(/\b\w/g, c => c.toUpperCase());
//   const upper = title.toUpperCase();
//   return [...new Set([base, space, title, upper])];
// }

// function usePanelDrag(onMove) {
//   return useCallback((e) => {
//     e.preventDefault();
//     const ox = e.clientX, oy = e.clientY;
//     const mv = (ev) => onMove(ev.clientX - ox, ev.clientY - oy);
//     const up = () => { window.removeEventListener("mousemove", mv); window.removeEventListener("mouseup", up); };
//     window.addEventListener("mousemove", mv);
//     window.addEventListener("mouseup", up);
//   }, [onMove]);
// }

// // ── LeetCode-style test result panel ─────────────────────────
// function TestResultPanel({ tcResult, output, verdict, isSubmitting, dark }) {
//   const [selectedCase, setSelectedCase] = useState(0);
//   const D = dark;

//   // If we have wrapped test case results, show LeetCode UI
//   if (tcResult && tcResult.results?.length > 0) {
//     const { results, passedCount, totalCount, allPassed, visiblePassed, visibleTotal } = tcResult;
//     const shownCase = results[selectedCase];

//     return (
//       <div style={{ height:"100%", display:"flex", flexDirection:"column", overflow:"hidden" }}>
//         {/* Summary */}
//         <div style={{ padding:"10px 14px", borderBottom:`1px solid ${D?"#21262d":"#e2e8f0"}`, flexShrink:0, background: allPassed ? (D?"rgba(52,211,153,.08)":"#f0fdf4") : (D?"rgba(248,113,113,.08)":"#fef2f2") }}>
//           <div style={{ display:"flex", alignItems:"center", gap:10 }}>
//             <span style={{ fontSize:18 }}>{allPassed ? "✅" : "❌"}</span>
//             <div>
//               <div style={{ fontSize:14, fontWeight:800, color: allPassed ? (D?"#34d399":"#16a34a") : (D?"#f87171":"#dc2626") }}>
//                 {allPassed ? "All Test Cases Passed!" : `${passedCount} / ${totalCount} Passed`}
//               </div>
//               <div style={{ fontSize:11, color:D?"#8b949e":"#64748b", marginTop:2, fontFamily:"monospace" }}>
//                 Visible: {visiblePassed}/{visibleTotal}
//                 {totalCount > visibleTotal && ` · Hidden: ${passedCount - visiblePassed}/${totalCount - visibleTotal}`}
//               </div>
//             </div>
//           </div>

//           {/* Case selector dots */}
//           <div style={{ display:"flex", gap:5, marginTop:10, flexWrap:"wrap" }}>
//             {results.map((c, i) => (
//               <button key={i} onClick={() => setSelectedCase(i)}
//                 title={`Case ${i+1}: ${c.passed ? "Passed" : c.statusLabel}`}
//                 style={{
//                   width:30, height:30, borderRadius:7, border:"none", cursor:"pointer", fontWeight:700, fontSize:11,
//                   background: selectedCase===i
//                     ? (c.passed ? "#34d399" : "#f87171")
//                     : (c.passed ? (D?"rgba(52,211,153,.2)":"rgba(52,211,153,.15)") : (D?"rgba(248,113,113,.2)":"rgba(248,113,113,.15)")),
//                   color: selectedCase===i ? "#fff" : (c.passed ? (D?"#34d399":"#16a34a") : (D?"#f87171":"#dc2626")),
//                   outline: selectedCase===i ? `2px solid ${c.passed?"#34d399":"#f87171"}` : "none",
//                   outlineOffset: 1,
//                 }}>
//                 {c.isVisible ? i+1 : "H"}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Detail */}
//         {shownCase && (
//           <div style={{ flex:1, overflowY:"auto", padding:14 }}>
//             <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
//               <span style={{ fontSize:12, fontWeight:700, color:D?"#8b949e":"#64748b" }}>
//                 Case {selectedCase+1} {shownCase.isVisible ? "" : "(Hidden)"}
//               </span>
//               <span style={{ fontSize:11, fontWeight:800, padding:"2px 10px", borderRadius:20,
//                 background: shownCase.passed ? (D?"rgba(52,211,153,.12)":"rgba(52,211,153,.1)") : (D?"rgba(248,113,113,.12)":"rgba(248,113,113,.1)"),
//                 color: shownCase.passed ? (D?"#34d399":"#16a34a") : (D?"#f87171":"#dc2626"),
//                 border:`1px solid ${shownCase.passed?(D?"rgba(52,211,153,.3)":"rgba(52,211,153,.3)"):(D?"rgba(248,113,113,.3)":"rgba(248,113,113,.3)")}` }}>
//                 {shownCase.statusLabel}
//               </span>
//             </div>

//             {shownCase.isVisible && shownCase.input !== null ? (
//               <>
//                 <p style={{ fontSize:11, color:D?"#8b949e":"#64748b", marginBottom:3, textTransform:"uppercase", letterSpacing:"0.06em" }}>Input</p>
//                 <pre style={{ background:D?"#0d1117":"#f1f5f9", padding:"8px 12px", borderRadius:8, fontSize:12, color:D?"#a5d6ff":"#1e40af", fontFamily:"monospace", marginBottom:10, overflow:"auto", border:`1px solid ${D?"#21262d":"#e2e8f0"}`, margin:"0 0 10px 0" }}>{shownCase.input}</pre>

//                 <p style={{ fontSize:11, color:D?"#8b949e":"#64748b", marginBottom:3, textTransform:"uppercase", letterSpacing:"0.06em" }}>Expected Output</p>
//                 <pre style={{ background:D?"#0d1117":"#f1f5f9", padding:"8px 12px", borderRadius:8, fontSize:12, color:D?"#7ee787":"#16a34a", fontFamily:"monospace", marginBottom:10, overflow:"auto", border:`1px solid ${D?"#21262d":"#e2e8f0"}`, margin:"0 0 10px 0" }}>{shownCase.expectedOutput}</pre>

//                 <p style={{ fontSize:11, color:D?"#8b949e":"#64748b", marginBottom:3, textTransform:"uppercase", letterSpacing:"0.06em" }}>Your Output</p>
//                 <pre style={{ background:D?"#0d1117":"#f1f5f9", padding:"8px 12px", borderRadius:8, fontSize:12,
//                   color: shownCase.passed ? (D?"#7ee787":"#16a34a") : (D?"#f87171":"#dc2626"),
//                   fontFamily:"monospace", marginBottom: shownCase.error ? 10 : 0, overflow:"auto",
//                   border:`1px solid ${shownCase.passed?(D?"rgba(52,211,153,.25)":"rgba(52,211,153,.25)"):(D?"rgba(248,113,113,.25)":"rgba(248,113,113,.25)")}`,
//                   margin:"0 0 10px 0" }}>
//                   {shownCase.actualOutput || "(empty)"}
//                 </pre>

//                 {shownCase.error && (
//                   <>
//                     <p style={{ fontSize:11, color:D?"#f87171":"#dc2626", marginBottom:3, textTransform:"uppercase", letterSpacing:"0.06em" }}>Error</p>
//                     <pre style={{ background:D?"#0d1117":"#fef2f2", padding:"8px 12px", borderRadius:8, fontSize:12, color:D?"#f87171":"#dc2626", fontFamily:"monospace", overflow:"auto", border:`1px solid ${D?"rgba(248,113,113,.25)":"rgba(248,113,113,.25)"}`, margin:0 }}>{shownCase.error}</pre>
//                   </>
//                 )}
//                 {shownCase.time && (
//                   <p style={{ fontSize:11, color:D?"#8b949e":"#64748b", marginTop:10, fontFamily:"monospace" }}>
//                     Runtime: {shownCase.time}s · Memory: {shownCase.memory}KB
//                   </p>
//                 )}
//               </>
//             ) : (
//               <div style={{ padding:"14px 16px", background: shownCase.passed ? (D?"rgba(52,211,153,.06)":"rgba(52,211,153,.06)") : (D?"rgba(248,113,113,.06)":"rgba(248,113,113,.06)"), border:`1px solid ${shownCase.passed?(D?"rgba(52,211,153,.2)":"rgba(52,211,153,.2)"):(D?"rgba(248,113,113,.2)":"rgba(248,113,113,.2)")}`, borderRadius:10 }}>
//                 <p style={{ fontSize:13, color: shownCase.passed ? (D?"#34d399":"#16a34a") : (D?"#f87171":"#dc2626"), fontWeight:700 }}>
//                   {shownCase.passed ? "✓ Hidden test case passed." : "✗ Hidden test case failed."}
//                 </p>
//                 <p style={{ fontSize:12, color:D?"#8b949e":"#64748b", marginTop:6 }}>
//                   {shownCase.error ? `Error: ${shownCase.error}` : "Input/expected hidden. Ensure your solution is correct for all edge cases."}
//                 </p>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     );
//   }

//   // Fallback: plain text output (Run button or no test cases)
//   const textColor = verdict === "accepted"
//     ? (D?"#34d399":"#16a34a")
//     : verdict === "wrong" ? (D?"#f87171":"#dc2626")
//     : (D?"#e6edf3":"#1f2937");

//   return (
//     <div style={{ flex:1, padding:12, overflowY:"auto" }}>
//       <pre style={{ color:textColor, fontSize:13, margin:0, whiteSpace:"pre-wrap", wordBreak:"break-word", lineHeight:1.65 }}>
//         {output || (isSubmitting ? "⏳ Evaluating…" : "Run or submit to see output here.")}
//       </pre>
//     </div>
//   );
// }

// // ── Main PracticePage ─────────────────────────────────────────
// export default function PracticePage({ embeddedQuestions, initialIndex = 0, onBack }) {
//   const params   = useParams?.() ?? {};
//   const history  = useHistory?.();
//   const { currentUser, user } = useAuth();
//   const activeUser = currentUser || user;
//   const topicSlug  = params.topicId;

//   const [questions,    setQuestions]    = useState(embeddedQuestions ?? []);
//   const [currentIdx,   setCurrentIdx]   = useState(initialIndex);
//   const [loading,      setLoading]      = useState(!embeddedQuestions);
//   const [fetchError,   setFetchError]   = useState(null);
//   const [language,     setLanguage]     = useState("cpp");
//   const [code,         setCode]         = useState(FALLBACK_BOILERPLATE.cpp);
//   const [activeTab,    setActiveTab]    = useState("testcase");
//   const [stdin,        setStdin]        = useState("");
//   const [output,       setOutput]       = useState("");
//   const [isRunning,    setIsRunning]    = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [verdict,      setVerdict]      = useState(null);
//   const [tcResult,     setTcResult]     = useState(null);   // LeetCode-style results
//   const [dark,         setDark]         = useState(true);
//   const [mcqSelection, setMcqSelection] = useState(null);
//   // const [mcqSubmitted, setMcqSubmitted] = useState(false);
//   const [mcqSubmitted, setMcqSubmitted] = useState(false);
// const [lastSubmissionCode, setLastSubmissionCode] = useState(null);
// const [lastSubmissionLang, setLastSubmissionLang] = useState(null);
//   const containerRef = useRef(null);
//   const [leftPct,   setLeftPct]   = useState(42);
//   const [editorPct, setEditorPct] = useState(63);

//   const getInitialCode = useCallback((q, lang) =>
//     q?.boilerplates?.[lang] || q?.boilerplate || FALLBACK_BOILERPLATE[lang] || "", []);

//   // Fetch questions by topic slug
//   useEffect(() => {
//     if (embeddedQuestions) return;
//     if (!topicSlug) { setLoading(false); return; }
//     const fetchQuestions = async () => {
//       setLoading(true); setFetchError(null);
//       let found = [];
//       try {
//         const variants = slugToVariants(topicSlug);
//         for (const v of variants) {
//           if (found.length > 0) break;
//           try {
//             const snap = await getDocs(query(collection(db, "questions"), where("category", "==", v)));
//             if (!snap.empty) found = snap.docs.map(d => ({ id: d.id, ...d.data() }));
//           } catch {}
//         }
//         if (found.length === 0) {
//           const allSnap = await getDocs(collection(db, "questions"));
//           const allQs   = allSnap.docs.map(d => ({ id: d.id, ...d.data() }));
//           const norm    = (s="") => s.toLowerCase().replace(/[^a-z0-9]/g, "");
//           const target  = norm(topicSlug);
//           found = allQs.filter(q => {
//             const c = norm(q.category || "");
//             return c === target || c.includes(target) || target.includes(c);
//           });
//         }
//         const coding = found.filter(q => (q.type||"").toUpperCase() !== "MCQ");
//         const mcqs   = found.filter(q => (q.type||"").toUpperCase() === "MCQ");
//         const sorted = [...coding, ...mcqs];
//         setQuestions(sorted);
//         if (sorted.length > 0) {
//           const first = sorted[initialIndex] ?? sorted[0];
//           if ((first.type||"").toUpperCase() !== "MCQ") {
//             setCode(getInitialCode(first, language));
//             if (first.testCases?.[0]) setStdin(first.testCases[0].input || "");
//           }
//         }
//       } catch (err) { setFetchError(err.message); }
//       setLoading(false);
//     };
//     fetchQuestions();
//   }, [topicSlug, embeddedQuestions, initialIndex]);

//   const q = questions[currentIdx];
//   const isCodingQuestion = useMemo(() => {
//     if (!q) return true;
//     const t = (q.type || "").toUpperCase();
//     return t === "CODING" || t === "" || !q.type;
//   }, [q]);

//   const goTo = useCallback((idx) => {
//     const target = questions[idx];
//     setCurrentIdx(idx); setMcqSelection(null); setMcqSubmitted(false);
//     setVerdict(null); setOutput(""); setTcResult(null); setActiveTab("testcase");
//     if (target && (target.type||"").toUpperCase() !== "MCQ") {
//       setCode(getInitialCode(target, language));
//       setStdin(target?.testCases?.[0]?.input || "");
//     }
//   }, [questions, language, getInitialCode]);

//   const handleLang = (lang) => {
//     setLanguage(lang);
//     if (q && (q.type||"").toUpperCase() !== "MCQ") setCode(getInitialCode(q, lang));
//   };

//   const handleBack = () => { if (onBack) { onBack(); return; } if (history) history.goBack(); };

//   // ── RUN BUTTON — uses wrapper if methodName exists ──────────
//   // This fixes the "No output" and "NameError: List" for Run too.
//   const handleRun = async () => {
//     if (!code.trim()) return;
//     setIsRunning(true); setActiveTab("result");
//     setOutput("⏳ Running..."); setVerdict(null); setTcResult(null);
//     try {
//       if (q?.methodName && stdin) {
//         // Wrap the code with method call using custom stdin as inputArgs
//         // (student typed their own input in the testcase tab)
//         const singleCase = [{ input: stdin, expectedOutput: "" }];
//         const fakeQ = { ...q, testCases: singleCase };
//         const res = await runWithTestCases(language, code, fakeQ, { visibleCount: 1 });
//         const r = res.results[0];
//         if (r.error) {
//           setOutput(`Error:\n${r.error}`);
//         } else {
//           setOutput(r.actualOutput || "(empty output)");
//         }
//         setActiveTab("result");
//       } else {
//         // Fallback: raw execution with stdin (no wrapper)
//         // Student must manually include imports and print()
//         const r = await executeCode(language, code, stdin, q?.timeLimitMs || 2000);
//         let txt = "";
//         if      (r.compile_output) txt = `Compilation Error:\n${r.compile_output}`;
//         else if (r.stderr)          txt = `Runtime Error:\n${r.stderr}`;
//         else                        txt = r.stdout || "(empty output)";
//         setOutput(txt);
//         if (r.status?.id === 3) {
//           const matched = q?.testCases?.find(t => t.input === stdin);
//           if (matched && r.stdout?.trim() === matched.expectedOutput?.trim()) setVerdict("accepted");
//         }
//       }
//     } catch (e) { setOutput("Execution Error: " + e.message); }
//     setIsRunning(false);
//   };

//   // ── SUBMIT BUTTON — LeetCode-style wrapped execution ────────
//   // This fixes all 3 bugs: imports, driver, normalised comparison.
//   const handleSubmitCoding = async () => {
//     if (!activeUser || !q) return;
//     setIsSubmitting(true); setActiveTab("result");
//     setOutput(""); setVerdict(null); setTcResult(null);

//     const testCases = q.testCases?.filter(tc => tc.input?.trim() && tc.expectedOutput?.trim()) || [];

//     if (!testCases.length) {
//       setOutput("⚠️ No test cases defined for this question.\n\nAsk your faculty to add test cases in the question editor.");
//       setIsSubmitting(false); return;
//     }

//     // Check if methodName exists — needed for wrapper
//     if (!q.methodName) {
//       // OLD behaviour: raw stdin-based execution (no wrapper)
//       // Student must write complete code with imports and print
//       setOutput(`⚠️ This question doesn't have a method name configured.\n\nRunning with raw stdin mode — you must include imports and print() in your code.\n\nRunning ${testCases.length} test case(s)...`);
//       let passed = 0; let logs = "";
//       try {
//         for (let i = 0; i < testCases.length; i++) {
//           const r  = await executeCode(language, code, testCases[i].input, q.timeLimitMs || 2000);
//           const ok = r.status?.id === 3 && r.stdout?.trim() === testCases[i].expectedOutput?.trim();
//           if (ok) passed++;
//           logs += `Test ${i+1}: ${ok ? "✅ Passed" : "❌ Failed"}\n`;
//           if (!ok && r.compile_output) logs += `   Compile Error: ${r.compile_output}\n`;
//           if (!ok && r.stderr) logs += `   Runtime Error: ${r.stderr}\n`;
//         }
//         const all = passed === testCases.length;
//         setVerdict(all ? "accepted" : "wrong");
//         setOutput(all
//           ? `✅ All ${testCases.length} test cases passed!\n\n(Tip: add methodName to this question for LeetCode-style results)`
//           : `❌ ${passed}/${testCases.length} passed\n\n${logs}`);
//       } catch (e) { setOutput("Submission Error: " + e.message); }
//       setIsSubmitting(false); return;
//     }

//     // ✅ PROPER PATH: methodName exists → use runWithTestCases (LeetCode-style)
//     try {
//       const res = await runWithTestCases(language, code, q);

//       // setTcResult(res);           // triggers LeetCode UI
//       // setVerdict(res.allPassed ? "accepted" : "wrong");
//       // setOutput("");              // output shown by TestResultPanel
//       setTcResult(res);           // triggers LeetCode UI
//       setVerdict(res.allPassed ? "accepted" : "wrong");
//       setOutput("");              // output shown by TestResultPanel
//       setLastSubmissionCode(code);
//       setLastSubmissionLang(language);

//       // Save to Firestore
//       if (activeUser) {
//         try {
//           await addDoc(collection(db, "submissions"), {
//             studentId:    activeUser.uid,
//             questionId:   q.id,
//             code,
//             language,
//             type:         "practice_coding",
//             score:        res.passedCount,
//             totalTests:   res.totalCount,
//             status:       res.allPassed ? "accepted" : "wrong_answer",
//             submittedAt:  serverTimestamp(),
//           });
//         } catch (e) { console.error("Submission save failed:", e); }
//       }
//     } catch (e) { setOutput("Submission Error: " + e.message); }
//     setIsSubmitting(false);
//   };

//   // MCQ submit (unchanged)
//   const handleSubmitMcq = async () => {
//     if (!mcqSelection) return;
//     setIsSubmitting(true);
//     const isCorrect = q.correctAnswer
//       ? mcqSelection === q.correctAnswer
//       : mcqSelection === q.options?.[q.correctIndex];
//     setVerdict(isCorrect ? "accepted" : "wrong");
//     setMcqSubmitted(true);
//     try {
//       if (activeUser) {
//         await addDoc(collection(db, "submissions"), {
//           studentId: activeUser.uid, questionId: q.id,
//           answer: mcqSelection, type: "practice_mcq",
//           status: isCorrect ? "accepted" : "wrong_answer",
//           submittedAt: serverTimestamp(),
//         });
//       }
//     } catch (e) { console.error(e); }
//     setIsSubmitting(false);
//   };

//   const horizDrag = usePanelDrag(useCallback((dx) => {
//     if (!containerRef.current) return;
//     setLeftPct(p => Math.min(72, Math.max(22, p + (dx / containerRef.current.offsetWidth) * 100)));
//   }, []));
//   const vertDrag = usePanelDrag(useCallback((_, dy) => {
//     if (!containerRef.current) return;
//     setEditorPct(p => Math.min(85, Math.max(25, p + (dy / containerRef.current.offsetHeight) * 100)));
//   }, []));

//   // ── Colours ───────────────────────────────────────────────────
//   const D           = dark;
//   const pageBg      = D ? "#0d1117" : "#f0f2f5";
//   const navBg       = D ? "#161b22" : "#ffffff";
//   const navBorder   = D ? "#21262d" : "#e2e8f0";
//   const navMuted    = D ? "#6b7280" : "#94a3b8";
//   const panelBg     = D ? "#161b22" : "#ffffff";
//   const panelBorder = D ? "#21262d" : "#e2e8f0";
//   const heading     = D ? "#f1f5f9" : "#0f172a";
//   const bodyText    = D ? "#cbd5e1" : "#334155";
//   const mutedText   = D ? "#6b7280" : "#64748b";
//   const codeBg      = D ? "#0d1117" : "#f1f5f9";
//   const termBg      = D ? "#0d1117" : "#ffffff";
//   const termText    = D ? "#e6edf3" : "#1f2937";
//   const termBorder  = D ? "#21262d" : "#e5e7eb";
//   const termInput   = D ? "#0d1117" : "#f9fafb";
//   const selectText  = D ? "#e2e8f0" : "#1e293b";
//   const selectBg    = D ? "#161b22" : "#ffffff";
//   const dragBg      = D ? "#21262d" : "#cbd5e1";
//   const tabActive   = D ? "#ffffff" : "#0f172a";
//   const tabInactive = D ? "#6b7280" : "#64748b";
//   const btnRunBg    = D ? "#21262d" : "#f1f5f9";
//   const btnRunBd    = D ? "#30363d" : "#cbd5e1";
//   const btnRunTx    = D ? "#e2e8f0" : "#1e293b";
//   const diffColors  = D ? DIFF_DARK : DIFF_LIGHT;
//   const langObj     = LANGUAGES.find(l => l.value === language) ?? LANGUAGES[0];

//   if (loading) return (
//     <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:"100vh", background:pageBg, gap:16 }}>
//       <div style={{ width:36, height:36, border:"3px solid #ffa116", borderTopColor:"transparent", borderRadius:"50%", animation:"spin .8s linear infinite" }}/>
//       <span style={{ color:mutedText, fontSize:14 }}>Loading questions…</span>
//       <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
//     </div>
//   );

//   if (!questions.length) return (
//     <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:"100vh", background:pageBg, gap:16 }}>
//       <div style={{ fontSize:48 }}>📭</div>
//       <p style={{ color:heading, fontSize:18, fontWeight:700 }}>No questions found</p>
//       <p style={{ color:mutedText, fontSize:14, textAlign:"center", maxWidth:400 }}>
//         No questions for: <strong style={{ color:"#ffa116" }}>{topicSlug}</strong><br/>
//         Check that questions are saved with a matching <code>category</code>.
//       </p>
//       {fetchError && <p style={{ color:"#f87171", fontSize:13 }}>Error: {fetchError}</p>}
//       <button onClick={handleBack} style={{ padding:"10px 24px", background:"#ffa116", border:"none", borderRadius:8, color:"#000", fontWeight:700, fontSize:14, cursor:"pointer" }}>← Go Back</button>
//     </div>
//   );

//   const correctOpt = q?.correctAnswer || q?.options?.[q?.correctIndex];
//   const optStyle   = (opt) => {
//     if (!mcqSubmitted) {
//       const sel = mcqSelection === opt;
//       return { background: sel?(D?"rgba(255,161,22,.15)":"#fffbeb"):panelBg, border:`2px solid ${sel?"#ffa116":panelBorder}`, color:bodyText };
//     }
//     if (opt === correctOpt)                     return { background:"rgba(52,211,153,.12)", border:"2px solid #34d399", color:D?"#34d399":"#16a34a" };
//     if (mcqSelection === opt && opt!==correctOpt) return { background:"rgba(248,113,113,.12)", border:"2px solid #f87171", color:D?"#f87171":"#dc2626" };
//     return { background:panelBg, border:`2px solid ${panelBorder}`, color:mutedText };
//   };

//   return (
//     <div style={{ display:"flex", flexDirection:"column", height:"100vh", background:pageBg, transition:"all .25s" }}>
//       <style>{`
//         *{box-sizing:border-box;}
//         @keyframes spin{to{transform:rotate(360deg)}}
//         .opt-btn:hover{opacity:.88;cursor:pointer;}
//       `}</style>

//       {/* Nav */}
//       <nav style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 16px", height:50, background:navBg, borderBottom:`1px solid ${navBorder}`, flexShrink:0, gap:12 }}>
//         <div style={{ display:"flex", alignItems:"center", gap:10, flexShrink:0 }}>
//           <button onClick={handleBack} style={{ background:"none", border:"none", color:navMuted, cursor:"pointer", fontSize:13, padding:"4px 8px" }}>← Back</button>
//           <button disabled={currentIdx===0} onClick={() => goTo(currentIdx-1)}
//             style={{ padding:"5px 9px", background:"none", border:"none", cursor:currentIdx===0?"not-allowed":"pointer", opacity:currentIdx===0?0.3:1, color:navMuted, fontSize:15 }}>◀</button>
//           <button disabled={currentIdx===questions.length-1} onClick={() => goTo(currentIdx+1)}
//             style={{ padding:"5px 9px", background:"none", border:"none", cursor:currentIdx===questions.length-1?"not-allowed":"pointer", opacity:currentIdx===questions.length-1?0.3:1, color:navMuted, fontSize:15 }}>▶</button>
//           <span style={{ fontSize:12, color:navMuted, whiteSpace:"nowrap" }}>{currentIdx+1} / {questions.length}</span>
//           <span style={{ fontSize:10, fontWeight:700, padding:"3px 7px", borderRadius:5, background:isCodingQuestion?"rgba(88,166,255,.15)":"rgba(255,161,22,.15)", color:isCodingQuestion?"#58a6ff":"#ffa116", letterSpacing:"0.06em", whiteSpace:"nowrap" }}>
//             {isCodingQuestion ? "💻 CODING" : "📝 MCQ"}
//           </span>
//           {/* methodName indicator */}
//           {isCodingQuestion && q?.methodName && (
//             <span style={{ fontSize:10, fontWeight:700, padding:"3px 7px", borderRadius:5, background:"rgba(52,211,153,.12)", color:D?"#34d399":"#16a34a", letterSpacing:"0.05em" }}>
//               ✓ Auto-wrapped
//             </span>
//           )}
//           {isCodingQuestion && !q?.methodName && (
//             <span style={{ fontSize:10, padding:"3px 7px", borderRadius:5, background:"rgba(248,113,113,.08)", color:D?"#f87171":"#dc2626", letterSpacing:"0.05em" }}>
//               ⚠ No methodName
//             </span>
//           )}
//         </div>

//         {/* Question number dots */}
//         <div style={{ display:"flex", gap:4, overflowX:"auto", maxWidth:360 }}>
//           {questions.map((qItem, i) => {
//             const isMCQ  = (qItem.type||"").toUpperCase() === "MCQ";
//             const isActive = i === currentIdx;
//             return (
//               <button key={qItem.id||i} onClick={() => goTo(i)}
//                 style={{ width:28, height:28, borderRadius:6, border:`1px solid ${isActive?"#ffa116":navBorder}`, background:isActive?"#ffa116":(isMCQ?"rgba(255,161,22,.08)":"rgba(88,166,255,.08)"), color:isActive?"#000":(isMCQ?"#ffa116":"#58a6ff"), fontSize:11, fontWeight:700, cursor:"pointer", flexShrink:0 }}>
//                 {i+1}
//               </button>
//             );
//           })}
//         </div>

//         {/* Right controls */}
//         <div style={{ display:"flex", gap:8, alignItems:"center", flexShrink:0 }}>
//           {isCodingQuestion ? (
//             <>
//               <select value={language} onChange={e=>handleLang(e.target.value)}
//                 style={{ background:selectBg, color:selectText, border:`1px solid ${navBorder}`, borderRadius:6, padding:"5px 8px", fontSize:12, cursor:"pointer", fontWeight:600, outline:"none" }}>
//                 {LANGUAGES.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
//               </select>
//               <button onClick={handleRun} disabled={isRunning||isSubmitting}
//                 style={{ padding:"5px 14px", borderRadius:6, fontSize:12, fontWeight:600, background:btnRunBg, border:`1px solid ${btnRunBd}`, color:btnRunTx, cursor:isRunning||isSubmitting?"not-allowed":"pointer", opacity:isRunning||isSubmitting?0.6:1 }}>
//                 {isRunning ? "⏳ Running…" : "▶ Run"}
//               </button>
//               <button onClick={handleSubmitCoding} disabled={isRunning||isSubmitting}
//                 style={{ padding:"5px 14px", borderRadius:6, fontSize:12, fontWeight:700, background: isSubmitting?"#22863a":"#2ea043", color:"#fff", border:"none", cursor:isRunning||isSubmitting?"not-allowed":"pointer", opacity:isRunning||isSubmitting?0.6:1 }}>
//                 {isSubmitting ? "⏳ Evaluating…" : "Submit"}
//               </button>
//             </>
//           ) : (
//             q && !mcqSubmitted && (
//               <button onClick={handleSubmitMcq} disabled={!mcqSelection||isSubmitting}
//                 style={{ padding:"5px 14px", borderRadius:6, fontSize:12, fontWeight:700, background:"#ffa116", color:"#000", border:"none", cursor:!mcqSelection||isSubmitting?"not-allowed":"pointer", opacity:!mcqSelection?0.5:1 }}>
//                 {isSubmitting ? "⏳" : "Submit Answer"}
//               </button>
//             )
//           )}
//           <button onClick={()=>setDark(d=>!d)} style={{ padding:"5px 10px", borderRadius:6, fontSize:13, background:"none", border:`1px solid ${navBorder}`, color:navMuted, cursor:"pointer" }}>
//             {dark?"☀️":"🌙"}
//           </button>
//         </div>
//       </nav>

//       {/* Body */}
//       <div ref={containerRef} style={{ flex:1, display:"flex", overflow:"hidden", padding:"10px 12px", gap:6 }}>
//         {/* Left: description */}
//         <div style={{ width:`${leftPct}%`, background:panelBg, border:`1px solid ${panelBorder}`, borderRadius:10, display:"flex", flexDirection:"column", overflow:"hidden" }}>
//           <div style={{ padding:"14px 20px 10px", borderBottom:`1px solid ${panelBorder}`, flexShrink:0 }}>
//             <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap", marginBottom:6 }}>
//               {q?.difficulty && (
//                 <span style={{ fontSize:12, fontWeight:700, color:diffColors[q.difficulty]||diffColors.Medium }}>
//                   {q.difficulty}
//                 </span>
//               )}
//               {q?.marks && (
//                 <span style={{ fontSize:11, color:mutedText }}>{q.marks} pts</span>
//               )}
//               {isCodingQuestion && q?.testCases?.length > 0 && (
//                 <span style={{ fontSize:11, color:mutedText }}>
//                   {q.testCases.filter(t=>!t.isHidden).length} visible + {q.testCases.filter(t=>t.isHidden).length} hidden test cases
//                 </span>
//               )}
//             </div>
//             <h2 style={{ fontSize:18, fontWeight:800, color:heading, margin:0, lineHeight:1.35 }}>
//               {q?.title || q?.question}
//             </h2>
//           </div>

//           <div style={{ flex:1, overflowY:"auto", padding:"16px 20px" }}>
//             {/* Description */}
//             {isCodingQuestion && (
//               <div style={{ color:bodyText, lineHeight:1.75, fontSize:14 }}
//                 dangerouslySetInnerHTML={{ __html: q?.description || "" }} />
//             )}
//             {!isCodingQuestion && (
//               <div style={{ color:bodyText, lineHeight:1.75, fontSize:15, padding:"14px 16px",
//                 background:D?"rgba(255,161,22,.06)":"#fffbeb", borderRadius:8, border:`1px solid ${D?"rgba(255,161,22,.2)":"#fde68a"}` }}>
//                 {q?.question || q?.title}
//               </div>
//             )}

//             {/* Visible test case examples */}
//             {isCodingQuestion && q?.testCases?.filter(t=>!t.isHidden).slice(0,3).map((tc,i) => (
//               <div key={i} style={{ marginTop:18 }}>
//                 <p style={{ fontWeight:700, fontSize:12, color:mutedText, marginBottom:6 }}>Example {i+1}:</p>
//                 <pre style={{ background:codeBg, padding:12, borderRadius:8, fontSize:12, color:bodyText, margin:0, overflowX:"auto", lineHeight:1.6, border:`1px solid ${panelBorder}` }}>
//                   Input:  {tc.input}{"\n"}Output: {tc.expectedOutput}
//                 </pre>
//               </div>
//             ))}
//             {isCodingQuestion && q?.testCases?.filter(t=>t.isHidden).length > 0 && (
//               <p style={{ fontSize:12, color:mutedText, marginTop:12, fontStyle:"italic" }}>
//                 + {q.testCases.filter(t=>t.isHidden).length} hidden test cases. Submit to run against all.
//               </p>
//             )}
//           </div>
//         </div>

//         {/* Drag handle */}
//         <div onMouseDown={horizDrag} style={{ width:5, cursor:"col-resize", background:dragBg, borderRadius:3, flexShrink:0 }} />

//         {/* Right: editor + terminal */}
//         <div style={{ flex:1, display:"flex", flexDirection:"column", gap:6, minWidth:0 }}>
//           {isCodingQuestion ? (
//             <>
//               <div style={{ height:`${editorPct}%`, background:panelBg, border:`1px solid ${panelBorder}`, borderRadius:10, display:"flex", flexDirection:"column", overflow:"hidden" }}>
//                 <div style={{ height:38, display:"flex", alignItems:"center", padding:"0 14px", borderBottom:`1px solid ${panelBorder}`, flexShrink:0, gap:10 }}>
//                   <select value={language} onChange={e=>handleLang(e.target.value)}
//                     style={{ background:"none", color:selectText, border:"none", fontSize:12, cursor:"pointer", fontWeight:700, outline:"none" }}>
//                     {LANGUAGES.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
//                   </select>
//                   <span style={{ fontSize:11, color:mutedText, marginLeft:"auto" }}>{langObj.label} · Monaco</span>
//                 </div>
//                 <div style={{ flex:1, overflow:"hidden" }}>
//                   <Editor
//                     theme={dark?"vs-dark":"light"}
//                     language={langObj.monaco}
//                     value={code}
//                     onChange={v => setCode(v??"")}
//                     options={{ minimap:{enabled:false}, fontSize:14, lineHeight:22, scrollBeyondLastLine:false, tabSize:4, wordWrap:"on" }}
//                   />
//                 </div>
//               </div>

//               <div onMouseDown={vertDrag} style={{ height:5, cursor:"row-resize", background:dragBg, borderRadius:3, flexShrink:0 }} />

//               {/* Terminal / Results */}
//               <div style={{ flex:1, background:termBg, border:`1px solid ${termBorder}`, borderRadius:10, display:"flex", flexDirection:"column", overflow:"hidden", minHeight:80 }}>
//                 <div style={{ display:"flex", borderBottom:`1px solid ${termBorder}`, height:40, alignItems:"center", padding:"0 6px", flexShrink:0 }}>
//                   {/* {["testcase","result"].map(tab => (
//                     <button key={tab} onClick={() => setActiveTab(tab)}
//                       style={{ padding:"0 16px", height:"100%", background:"none", border:"none", borderBottom:activeTab===tab?"2px solid #ffa116":"2px solid transparent", color:activeTab===tab?tabActive:tabInactive, fontSize:12, fontWeight:activeTab===tab?700:400, cursor:"pointer" }}>
//                       {tab==="testcase"?"📥 Input":"📤 Output"}
//                     </button>
//                   ))} */} 

//                   {["testcase","result","lastsub"].map(tab => (
//                     <button key={tab} onClick={() => setActiveTab(tab)}
//                       style={{ padding:"0 16px", height:"100%", background:"none", border:"none", borderBottom:activeTab===tab?"2px solid #ffa116":"2px solid transparent", color:activeTab===tab?tabActive:tabInactive, fontSize:12, fontWeight:activeTab===tab?700:400, cursor:"pointer" }}>
//                       {tab==="testcase"?"📥 Input":tab==="result"?"📤 Output":"🕓 Last Sub"}
//                     </button>
//                   ))}
//                   {/* Verdict badge in tab bar */}
//                   {verdict && activeTab==="result" && (
//                     <span style={{ marginLeft:"auto", marginRight:8, fontSize:11, fontWeight:700, color:verdict==="accepted"?(D?"#34d399":"#16a34a"):(D?"#f87171":"#dc2626") }}>
//                       {verdict==="accepted"?"✅ AC":"❌ WA"}
//                     </span>
//                   )}
//                 </div>

//                 {/* <div style={{ flex:1, overflow:"hidden", display:"flex", flexDirection:"column" }}>
//                   {activeTab==="testcase" ? (
//                     <div style={{ flex:1, padding:12 }}>
//                       <textarea value={stdin} onChange={e=>setStdin(e.target.value)}
//                         placeholder={q?.methodName
//                           ? `Custom input args for Run button (e.g. [2,7,11,15], 9)\nSubmit always runs all ${q?.testCases?.length||0} test cases automatically.`
//                           : "Custom input (stdin) for Run button..."}
//                         style={{ width:"100%", height:"100%", background:termInput, color:termText, border:"none", resize:"none", fontFamily:"'Courier New',monospace", fontSize:13, outline:"none", lineHeight:1.65 }} />
//                     </div>
//                   ) : (
//                     // LeetCode result panel OR plain output
//                     tcResult ? (
//                       <TestResultPanel tcResult={tcResult} output={output} verdict={verdict} isSubmitting={isSubmitting} dark={dark} />
//                     ) : (
//                       <div style={{ flex:1, padding:12, overflowY:"auto" }}>
//                         <pre style={{ color:termText, fontSize:13, margin:0, whiteSpace:"pre-wrap", wordBreak:"break-word", lineHeight:1.65 }}>
//                           {output || (isSubmitting?"⏳ Evaluating…":"Run or submit to see output here.")}
//                         </pre>
//                       </div>
//                     )
//                   )}
//                 </div> */}

//                 <div style={{ flex:1, overflow:"hidden", display:"flex", flexDirection:"column" }}>
//                   {activeTab==="testcase" ? (
//                     <div style={{ flex:1, padding:12 }}>
//                       <textarea value={stdin} onChange={e=>setStdin(e.target.value)}
//                         placeholder={q?.methodName
//                           ? `Custom input args for Run button (e.g. [2,7,11,15], 9)\nSubmit always runs all ${q?.testCases?.length||0} test cases automatically.`
//                           : "Custom input (stdin) for Run button..."}
//                         style={{ width:"100%", height:"100%", background:termInput, color:termText, border:"none", resize:"none", fontFamily:"'Courier New',monospace", fontSize:13, outline:"none", lineHeight:1.65 }} />
//                     </div>
//                   ) : activeTab==="lastsub" ? (
//                     <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
//                       {lastSubmissionCode ? (
//                         <>
//                           <div style={{ padding:"8px 14px", borderBottom:`1px solid ${termBorder}`, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
//                             <div style={{ display:"flex", alignItems:"center", gap:8 }}>
//                               <span style={{ fontSize:11, color:mutedText }}>Language:</span>
//                               <span style={{ fontSize:11, fontWeight:700, padding:"2px 8px", borderRadius:4, background:D?"#21262d":"#f1f5f9", color:termText }}>
//                                 {LANGUAGES.find(l=>l.value===lastSubmissionLang)?.label || lastSubmissionLang}
//                               </span>
//                             </div>
//                             <span style={{ fontSize:11, color:mutedText, fontStyle:"italic" }}>Read-only</span>
//                           </div>
//                           <div style={{ flex:1, overflowY:"auto", padding:"14px 16px" }}>
//                             <pre style={{
//                               margin:0,
//                               fontSize:13,
//                               lineHeight:1.75,
//                               fontFamily:"'Courier New', Consolas, monospace",
//                               color:termText,
//                               whiteSpace:"pre-wrap",
//                               wordBreak:"break-word",
//                               background:"transparent",
//                               userSelect:"text",
//                             }}>
//                               {lastSubmissionCode}
//                             </pre>
//                           </div>
//                         </>
//                       ) : (
//                         <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", color:mutedText, fontSize:13 }}>
//                           No submission yet. Submit your code to see it here.
//                         </div>
//                       )}
//                     </div>
//                   ) : (
//                     // LeetCode result panel OR plain output
//                     tcResult ? (
//                       <TestResultPanel tcResult={tcResult} output={output} verdict={verdict} isSubmitting={isSubmitting} dark={dark} />
//                     ) : (
//                       <div style={{ flex:1, padding:12, overflowY:"auto" }}>
//                         <pre style={{ color:termText, fontSize:13, margin:0, whiteSpace:"pre-wrap", wordBreak:"break-word", lineHeight:1.65 }}>
//                           {output || (isSubmitting?"⏳ Evaluating…":"Run or submit to see output here.")}
//                         </pre>
//                       </div>
//                     )
//                   )}
//                 </div>
//               </div>
//             </>
//           ) : (
//             /* MCQ right panel */
//             <div style={{ flex:1, background:panelBg, border:`1px solid ${panelBorder}`, borderRadius:10, overflow:"hidden", display:"flex", flexDirection:"column" }}>
//               <div style={{ padding:"16px 24px", borderBottom:`1px solid ${panelBorder}`, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
//                 <span style={{ fontSize:13, fontWeight:700, color:heading }}>📝 Choose your answer</span>
//                 {mcqSubmitted && (
//                   <span style={{ fontSize:12, color:verdict==="accepted"?(D?"#34d399":"#16a34a"):(D?"#f87171":"#dc2626"), fontWeight:700 }}>
//                     {verdict==="accepted"?"✅ Correct!":"❌ Incorrect"}
//                   </span>
//                 )}
//               </div>
//               <div style={{ flex:1, padding:20, overflowY:"auto" }}>
//                 <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
//                   {(q?.options||[]).map((opt,i) => {
//                     const letter = ["A","B","C","D","E"][i];
//                     const st     = optStyle(opt);
//                     return (
//                       <div key={i} className="opt-btn" onClick={() => !mcqSubmitted && setMcqSelection(opt)}
//                         style={{ display:"flex", alignItems:"center", gap:14, padding:"14px 18px", borderRadius:10, cursor:mcqSubmitted?"default":"pointer", transition:"all .15s", ...st }}>
//                         <span style={{ width:32, height:32, borderRadius:7, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:800, flexShrink:0,
//                           background: mcqSubmitted?(opt===correctOpt?"#34d399":mcqSelection===opt?"#f87171":D?"#21262d":"#f1f5f9"):(mcqSelection===opt?"#ffa116":D?"#21262d":"#f1f5f9"),
//                           color: mcqSubmitted?(opt===correctOpt?"#fff":mcqSelection===opt?"#fff":mutedText):(mcqSelection===opt?"#000":mutedText) }}>
//                           {letter}
//                         </span>
//                         <span style={{ fontSize:15, lineHeight:1.5 }}>{opt}</span>
//                         {mcqSubmitted && opt===correctOpt && <span style={{ marginLeft:"auto", color:"#34d399" }}>✓</span>}
//                         {mcqSubmitted && mcqSelection===opt && opt!==correctOpt && <span style={{ marginLeft:"auto", color:"#f87171" }}>✗</span>}
//                       </div>
//                     );
//                   })}
//                 </div>
//                 {mcqSubmitted && (
//                   <div style={{ marginTop:20, padding:"12px 16px", borderRadius:10,
//                     background:verdict==="accepted"?"rgba(52,211,153,.1)":"rgba(248,113,113,.1)",
//                     border:`1px solid ${verdict==="accepted"?"rgba(52,211,153,.4)":"rgba(248,113,113,.4)"}` }}>
//                     <p style={{ fontWeight:700, fontSize:13, color:verdict==="accepted"?(D?"#34d399":"#16a34a"):(D?"#f87171":"#dc2626"), margin:"0 0 4px 0" }}>
//                       {verdict==="accepted"?"✅ Correct!":"❌ Incorrect"}
//                     </p>
//                     {correctOpt && <p style={{ fontSize:12, color:D?"#8b949e":"#64748b", margin:0 }}>Correct: <strong style={{ color:D?"#34d399":"#16a34a" }}>{correctOpt}</strong></p>}
//                     {q?.explanation && <p style={{ fontSize:12, color:bodyText, marginTop:6 }}>{q.explanation}</p>}
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// } 



import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useParams, useHistory } from "react-router-dom";
import Editor from "@monaco-editor/react";
import {
  collection, query, where, getDocs, addDoc, serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuth } from "../hooks/useAuth";
import { executeCode, runWithTestCases } from "../api/compilerService";

const LANGUAGES = [
  { label: "C++",        value: "cpp",        monaco: "cpp"        },
  { label: "Python",     value: "python",     monaco: "python"     },
  { label: "JavaScript", value: "javascript", monaco: "javascript" },
  { label: "Java",       value: "java",       monaco: "java"       },
  { label: "C",          value: "c",          monaco: "c"          },
];

// Fallback boilerplate when question has no boilerplates stored
const FALLBACK_BOILERPLATE = {
  cpp:        "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Write your solution here\n};\n",
  python:     "class Solution:\n    def solution(self):\n        # Write your solution here\n        pass\n",
  javascript: "class Solution {\n    solution() {\n        // Write your solution here\n    }\n}\n",
  java:       "class Solution {\n    public Object solution() {\n        // Write your solution here\n        return null;\n    }\n}\n",
  c:          "#include <stdio.h>\n\n// Write your solution here\n",
};

const DIFF_DARK  = { Easy:"#34d399", Medium:"#fbbf24", Hard:"#f87171" };
const DIFF_LIGHT = { Easy:"#16a34a", Medium:"#d97706", Hard:"#dc2626" };

// Question palette status colours — mirrors ExamPage exactly
const Q_STATUS = {
  unanswered: { bg: '#21262d',                   border: '#30363d',                   color: '#8b949e' },
  answered:   { bg: 'rgba(63,185,80,0.15)',       border: 'rgba(63,185,80,0.4)',       color: '#3fb950' },
  marked:     { bg: 'rgba(88,166,255,0.15)',      border: 'rgba(88,166,255,0.4)',      color: '#58a6ff' },
  current:    { bg: '#f0883e',                    border: '#f0883e',                   color: '#fff'    },
};

function slugToVariants(slug) {
  if (!slug) return [];
  const base  = slug.trim();
  const space = base.replace(/-/g, " ");
  const title = space.replace(/\b\w/g, c => c.toUpperCase());
  const upper = title.toUpperCase();
  return [...new Set([base, space, title, upper])];
}

function usePanelDrag(onMove) {
  return useCallback((e) => {
    e.preventDefault();
    const ox = e.clientX, oy = e.clientY;
    const mv = (ev) => onMove(ev.clientX - ox, ev.clientY - oy);
    const up = () => { window.removeEventListener("mousemove", mv); window.removeEventListener("mouseup", up); };
    window.addEventListener("mousemove", mv);
    window.addEventListener("mouseup", up);
  }, [onMove]);
}

// ── LeetCode-style test result panel ─────────────────────────
function TestResultPanel({ tcResult, output, verdict, isSubmitting, dark }) {
  const [selectedCase, setSelectedCase] = useState(0);
  const D = dark;

  // If we have wrapped test case results, show LeetCode UI
  if (tcResult && tcResult.results?.length > 0) {
    const { results, passedCount, totalCount, allPassed, visiblePassed, visibleTotal } = tcResult;
    const shownCase = results[selectedCase];

    return (
      <div style={{ height:"100%", display:"flex", flexDirection:"column", overflow:"hidden" }}>
        {/* Summary */}
        <div style={{ padding:"10px 14px", borderBottom:`1px solid ${D?"#21262d":"#e2e8f0"}`, flexShrink:0, background: allPassed ? (D?"rgba(52,211,153,.08)":"#f0fdf4") : (D?"rgba(248,113,113,.08)":"#fef2f2") }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <span style={{ fontSize:18 }}>{allPassed ? "✅" : "❌"}</span>
            <div>
              <div style={{ fontSize:14, fontWeight:800, color: allPassed ? (D?"#34d399":"#16a34a") : (D?"#f87171":"#dc2626") }}>
                {allPassed ? "All Test Cases Passed!" : `${passedCount} / ${totalCount} Passed`}
              </div>
              <div style={{ fontSize:11, color:D?"#8b949e":"#64748b", marginTop:2, fontFamily:"monospace" }}>
                Visible: {visiblePassed}/{visibleTotal}
                {totalCount > visibleTotal && ` · Hidden: ${passedCount - visiblePassed}/${totalCount - visibleTotal}`}
              </div>
            </div>
          </div>

          {/* Case selector dots */}
          <div style={{ display:"flex", gap:5, marginTop:10, flexWrap:"wrap" }}>
            {results.map((c, i) => (
              <button key={i} onClick={() => setSelectedCase(i)}
                title={`Case ${i+1}: ${c.passed ? "Passed" : c.statusLabel}`}
                style={{
                  width:30, height:30, borderRadius:7, border:"none", cursor:"pointer", fontWeight:700, fontSize:11,
                  background: selectedCase===i
                    ? (c.passed ? "#34d399" : "#f87171")
                    : (c.passed ? (D?"rgba(52,211,153,.2)":"rgba(52,211,153,.15)") : (D?"rgba(248,113,113,.2)":"rgba(248,113,113,.15)")),
                  color: selectedCase===i ? "#fff" : (c.passed ? (D?"#34d399":"#16a34a") : (D?"#f87171":"#dc2626")),
                  outline: selectedCase===i ? `2px solid ${c.passed?"#34d399":"#f87171"}` : "none",
                  outlineOffset: 1,
                }}>
                {c.isVisible ? i+1 : "H"}
              </button>
            ))}
          </div>
        </div>

        {/* Detail */}
        {shownCase && (
          <div style={{ flex:1, overflowY:"auto", padding:14 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
              <span style={{ fontSize:12, fontWeight:700, color:D?"#8b949e":"#64748b" }}>
                Case {selectedCase+1} {shownCase.isVisible ? "" : "(Hidden)"}
              </span>
              <span style={{ fontSize:11, fontWeight:800, padding:"2px 10px", borderRadius:20,
                background: shownCase.passed ? (D?"rgba(52,211,153,.12)":"rgba(52,211,153,.1)") : (D?"rgba(248,113,113,.12)":"rgba(248,113,113,.1)"),
                color: shownCase.passed ? (D?"#34d399":"#16a34a") : (D?"#f87171":"#dc2626"),
                border:`1px solid ${shownCase.passed?(D?"rgba(52,211,153,.3)":"rgba(52,211,153,.3)"):(D?"rgba(248,113,113,.3)":"rgba(248,113,113,.3)")}` }}>
                {shownCase.statusLabel}
              </span>
            </div>

            {shownCase.isVisible && shownCase.input !== null ? (
              <>
                <p style={{ fontSize:11, color:D?"#8b949e":"#64748b", marginBottom:3, textTransform:"uppercase", letterSpacing:"0.06em" }}>Input</p>
                <pre style={{ background:D?"#0d1117":"#f1f5f9", padding:"8px 12px", borderRadius:8, fontSize:12, color:D?"#a5d6ff":"#1e40af", fontFamily:"monospace", marginBottom:10, overflow:"auto", border:`1px solid ${D?"#21262d":"#e2e8f0"}`, margin:"0 0 10px 0" }}>{shownCase.input}</pre>

                <p style={{ fontSize:11, color:D?"#8b949e":"#64748b", marginBottom:3, textTransform:"uppercase", letterSpacing:"0.06em" }}>Expected Output</p>
                <pre style={{ background:D?"#0d1117":"#f1f5f9", padding:"8px 12px", borderRadius:8, fontSize:12, color:D?"#7ee787":"#16a34a", fontFamily:"monospace", marginBottom:10, overflow:"auto", border:`1px solid ${D?"#21262d":"#e2e8f0"}`, margin:"0 0 10px 0" }}>{shownCase.expectedOutput}</pre>

                <p style={{ fontSize:11, color:D?"#8b949e":"#64748b", marginBottom:3, textTransform:"uppercase", letterSpacing:"0.06em" }}>Your Output</p>
                <pre style={{ background:D?"#0d1117":"#f1f5f9", padding:"8px 12px", borderRadius:8, fontSize:12,
                  color: shownCase.passed ? (D?"#7ee787":"#16a34a") : (D?"#f87171":"#dc2626"),
                  fontFamily:"monospace", marginBottom: shownCase.error ? 10 : 0, overflow:"auto",
                  border:`1px solid ${shownCase.passed?(D?"rgba(52,211,153,.25)":"rgba(52,211,153,.25)"):(D?"rgba(248,113,113,.25)":"rgba(248,113,113,.25)")}`,
                  margin:"0 0 10px 0" }}>
                  {shownCase.actualOutput || "(empty)"}
                </pre>

                {shownCase.error && (
                  <>
                    <p style={{ fontSize:11, color:D?"#f87171":"#dc2626", marginBottom:3, textTransform:"uppercase", letterSpacing:"0.06em" }}>Error</p>
                    <pre style={{ background:D?"#0d1117":"#fef2f2", padding:"8px 12px", borderRadius:8, fontSize:12, color:D?"#f87171":"#dc2626", fontFamily:"monospace", overflow:"auto", border:`1px solid ${D?"rgba(248,113,113,.25)":"rgba(248,113,113,.25)"}`, margin:0 }}>{shownCase.error}</pre>
                  </>
                )}
                {shownCase.time && (
                  <p style={{ fontSize:11, color:D?"#8b949e":"#64748b", marginTop:10, fontFamily:"monospace" }}>
                    Runtime: {shownCase.time}s · Memory: {shownCase.memory}KB
                  </p>
                )}
              </>
            ) : (
              <div style={{ padding:"14px 16px", background: shownCase.passed ? (D?"rgba(52,211,153,.06)":"rgba(52,211,153,.06)") : (D?"rgba(248,113,113,.06)":"rgba(248,113,113,.06)"), border:`1px solid ${shownCase.passed?(D?"rgba(52,211,153,.2)":"rgba(52,211,153,.2)"):(D?"rgba(248,113,113,.2)":"rgba(248,113,113,.2)")}`, borderRadius:10 }}>
                <p style={{ fontSize:13, color: shownCase.passed ? (D?"#34d399":"#16a34a") : (D?"#f87171":"#dc2626"), fontWeight:700 }}>
                  {shownCase.passed ? "✓ Hidden test case passed." : "✗ Hidden test case failed."}
                </p>
                <p style={{ fontSize:12, color:D?"#8b949e":"#64748b", marginTop:6 }}>
                  {shownCase.error ? `Error: ${shownCase.error}` : "Input/expected hidden. Ensure your solution is correct for all edge cases."}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // Fallback: plain text output (Run button or no test cases)
  const textColor = verdict === "accepted"
    ? (D?"#34d399":"#16a34a")
    : verdict === "wrong" ? (D?"#f87171":"#dc2626")
    : (D?"#e6edf3":"#1f2937");

  return (
    <div style={{ flex:1, padding:12, overflowY:"auto" }}>
      <pre style={{ color:textColor, fontSize:13, margin:0, whiteSpace:"pre-wrap", wordBreak:"break-word", lineHeight:1.65 }}>
        {output || (isSubmitting ? "⏳ Evaluating…" : "Run or submit to see output here.")}
      </pre>
    </div>
  );
}

// ── Main PracticePage ─────────────────────────────────────────
export default function PracticePage({ embeddedQuestions, initialIndex = 0, onBack }) {
  const params   = useParams?.() ?? {};
  const history  = useHistory?.();
  const { currentUser, user } = useAuth();
  const activeUser = currentUser || user;
  const topicSlug  = params.topicId;

  const [questions,    setQuestions]    = useState(embeddedQuestions ?? []);
  const [currentIdx,   setCurrentIdx]   = useState(initialIndex);
  const [loading,      setLoading]      = useState(!embeddedQuestions);
  const [fetchError,   setFetchError]   = useState(null);
  const [language,     setLanguage]     = useState("cpp");
  const [code,         setCode]         = useState(FALLBACK_BOILERPLATE.cpp);
  const [activeTab,    setActiveTab]    = useState("testcase");
  const [stdin,        setStdin]        = useState("");
  const [output,       setOutput]       = useState("");
  const [isRunning,    setIsRunning]    = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verdict,      setVerdict]      = useState(null);
  const [tcResult,     setTcResult]     = useState(null);
  const [dark,         setDark]         = useState(true);

  // ── v1 exclusive: last submission tab ────────────────────────
  const [lastSubmissionCode, setLastSubmissionCode] = useState(null);
  const [lastSubmissionLang, setLastSubmissionLang] = useState(null);

  // ── v2 MCQ state (per-question, mirrors ExamPage) ─────────────
  const [mcqAnswers,   setMcqAnswers]   = useState({});        // { [qId]: selectedOption }
  const [mcqSubmitted, setMcqSubmitted] = useState({});        // { [qId]: true }
  const [mcqMarked,    setMcqMarked]    = useState(new Set());

  const containerRef = useRef(null);
  const [leftPct,   setLeftPct]   = useState(42);
  const [editorPct, setEditorPct] = useState(63);

  const getInitialCode = useCallback((q, lang) =>
    q?.boilerplates?.[lang] || q?.boilerplate || FALLBACK_BOILERPLATE[lang] || "", []);

  // Derived MCQ questions list
  const mcqQuestions = useMemo(
    () => questions.filter(q => (q.type || "").toUpperCase() === "MCQ"),
    [questions],
  );

  // Fetch questions by topic slug
  useEffect(() => {
    if (embeddedQuestions) return;
    if (!topicSlug) { setLoading(false); return; }
    const fetchQuestions = async () => {
      setLoading(true); setFetchError(null);
      let found = [];
      try {
        const variants = slugToVariants(topicSlug);
        for (const v of variants) {
          if (found.length > 0) break;
          try {
            const snap = await getDocs(query(collection(db, "questions"), where("category", "==", v)));
            if (!snap.empty) found = snap.docs.map(d => ({ id: d.id, ...d.data() }));
          } catch {}
        }
        if (found.length === 0) {
          const allSnap = await getDocs(collection(db, "questions"));
          const allQs   = allSnap.docs.map(d => ({ id: d.id, ...d.data() }));
          const norm    = (s="") => s.toLowerCase().replace(/[^a-z0-9]/g, "");
          const target  = norm(topicSlug);
          found = allQs.filter(q => {
            const c = norm(q.category || "");
            return c === target || c.includes(target) || target.includes(c);
          });
        }
        const coding = found.filter(q => (q.type||"").toUpperCase() !== "MCQ");
        const mcqs   = found.filter(q => (q.type||"").toUpperCase() === "MCQ");
        const sorted = [...coding, ...mcqs];
        setQuestions(sorted);
        if (sorted.length > 0) {
          const first = sorted[initialIndex] ?? sorted[0];
          if ((first.type||"").toUpperCase() !== "MCQ") {
            setCode(getInitialCode(first, language));
            if (first.testCases?.[0]) setStdin(first.testCases[0].input || "");
          }
        }
      } catch (err) { setFetchError(err.message); }
      setLoading(false);
    };
    fetchQuestions();
  }, [topicSlug, embeddedQuestions, initialIndex]);

  const q = questions[currentIdx];
  const isCodingQuestion = useMemo(() => {
    if (!q) return true;
    const t = (q.type || "").toUpperCase();
    return t === "CODING" || t === "" || !q.type;
  }, [q]);

  // ── Derived MCQ values for current question ───────────────────
  const currentMcqAnswer    = q ? mcqAnswers[q.id]    : null;
  const currentMcqSubmitted = q ? !!mcqSubmitted[q.id] : false;
  const correctOpt          = q?.correctAnswer || q?.options?.[q?.correctIndex];
  const currentMcqVerdict   = currentMcqSubmitted
    ? (currentMcqAnswer === correctOpt ? "accepted" : "wrong")
    : null;

  const goTo = useCallback((idx) => {
    const target = questions[idx];
    setCurrentIdx(idx);
    // Reset coding state only — MCQ state is preserved per-question
    setVerdict(null); setOutput(""); setTcResult(null); setActiveTab("testcase");
    if (target && (target.type||"").toUpperCase() !== "MCQ") {
      setCode(getInitialCode(target, language));
      setStdin(target?.testCases?.[0]?.input || "");
    }
  }, [questions, language, getInitialCode]);

  const handleLang = (lang) => {
    setLanguage(lang);
    if (q && (q.type||"").toUpperCase() !== "MCQ") setCode(getInitialCode(q, lang));
  };

  const handleBack = () => { if (onBack) { onBack(); return; } if (history) history.goBack(); };

  // ── MCQ handlers (v2 logic) ───────────────────────────────────
  const handleMcqAnswer = (qId, option) => {
    if (mcqSubmitted[qId]) return; // lock after submit
    setMcqAnswers(prev => ({ ...prev, [qId]: option }));
  };

  const toggleMark = (qId) =>
    setMcqMarked(prev => { const n = new Set(prev); n.has(qId) ? n.delete(qId) : n.add(qId); return n; });

  const getMcqStatus = (mq) => {
    const globalIdx = questions.indexOf(mq);
    if (currentIdx === globalIdx && !isCodingQuestion) return 'current';
    if (mcqMarked.has(mq.id))    return 'marked';
    if (mcqAnswers[mq.id])       return 'answered';
    return 'unanswered';
  };

  const handleSubmitMcq = async () => {
    if (!currentMcqAnswer || !q) return;
    setIsSubmitting(true);
    const isCorrect = currentMcqAnswer === correctOpt;
    setMcqSubmitted(prev => ({ ...prev, [q.id]: true }));
    setMcqMarked(prev => { const n = new Set(prev); n.delete(q.id); return n; });
    try {
      if (activeUser) {
        await addDoc(collection(db, "submissions"), {
          studentId: activeUser.uid, questionId: q.id,
          answer: currentMcqAnswer, type: "practice_mcq",
          status: isCorrect ? "accepted" : "wrong_answer",
          submittedAt: serverTimestamp(),
        });
      }
    } catch (e) { console.error(e); }
    setIsSubmitting(false);
  };

  // ── RUN BUTTON ────────────────────────────────────────────────
  const handleRun = async () => {
    if (!code.trim()) return;
    setIsRunning(true); setActiveTab("result");
    setOutput("⏳ Running..."); setVerdict(null); setTcResult(null);
    try {
      if (q?.methodName && stdin) {
        const singleCase = [{ input: stdin, expectedOutput: "" }];
        const fakeQ = { ...q, testCases: singleCase };
        const res = await runWithTestCases(language, code, fakeQ, { visibleCount: 1 });
        const r = res.results[0];
        if (r.error) {
          setOutput(`Error:\n${r.error}`);
        } else {
          setOutput(r.actualOutput || "(empty output)");
        }
        setActiveTab("result");
      } else {
        const r = await executeCode(language, code, stdin, q?.timeLimitMs || 2000);
        let txt = "";
        if      (r.compile_output) txt = `Compilation Error:\n${r.compile_output}`;
        else if (r.stderr)          txt = `Runtime Error:\n${r.stderr}`;
        else                        txt = r.stdout || "(empty output)";
        setOutput(txt);
        if (r.status?.id === 3) {
          const matched = q?.testCases?.find(t => t.input === stdin);
          if (matched && r.stdout?.trim() === matched.expectedOutput?.trim()) setVerdict("accepted");
        }
      }
    } catch (e) { setOutput("Execution Error: " + e.message); }
    setIsRunning(false);
  };

  // ── SUBMIT BUTTON ─────────────────────────────────────────────
  const handleSubmitCoding = async () => {
    if (!activeUser || !q) return;
    setIsSubmitting(true); setActiveTab("result");
    setOutput(""); setVerdict(null); setTcResult(null);

    const testCases = q.testCases?.filter(tc => tc.input?.trim() && tc.expectedOutput?.trim()) || [];

    if (!testCases.length) {
      setOutput("⚠️ No test cases defined for this question.\n\nAsk your faculty to add test cases in the question editor.");
      setIsSubmitting(false); return;
    }

    if (!q.methodName) {
      setOutput(`⚠️ This question doesn't have a method name configured.\n\nRunning with raw stdin mode — you must include imports and print() in your code.\n\nRunning ${testCases.length} test case(s)...`);
      let passed = 0; let logs = "";
      try {
        for (let i = 0; i < testCases.length; i++) {
          const r  = await executeCode(language, code, testCases[i].input, q.timeLimitMs || 2000);
          const ok = r.status?.id === 3 && r.stdout?.trim() === testCases[i].expectedOutput?.trim();
          if (ok) passed++;
          logs += `Test ${i+1}: ${ok ? "✅ Passed" : "❌ Failed"}\n`;
          if (!ok && r.compile_output) logs += `   Compile Error: ${r.compile_output}\n`;
          if (!ok && r.stderr) logs += `   Runtime Error: ${r.stderr}\n`;
        }
        const all = passed === testCases.length;
        setVerdict(all ? "accepted" : "wrong");
        setOutput(all
          ? `✅ All ${testCases.length} test cases passed!\n\n(Tip: add methodName to this question for LeetCode-style results)`
          : `❌ ${passed}/${testCases.length} passed\n\n${logs}`);
      } catch (e) { setOutput("Submission Error: " + e.message); }
      setIsSubmitting(false); return;
    }

    // ✅ PROPER PATH: methodName exists → use runWithTestCases (LeetCode-style)
    try {
      const res = await runWithTestCases(language, code, q);
      setTcResult(res);
      setVerdict(res.allPassed ? "accepted" : "wrong");
      setOutput("");
      // v1 exclusive: save last submission for the "Last Sub" tab
      setLastSubmissionCode(code);
      setLastSubmissionLang(language);

      if (activeUser) {
        try {
          await addDoc(collection(db, "submissions"), {
            studentId:    activeUser.uid,
            questionId:   q.id,
            code,
            language,
            type:         "practice_coding",
            score:        res.passedCount,
            totalTests:   res.totalCount,
            status:       res.allPassed ? "accepted" : "wrong_answer",
            submittedAt:  serverTimestamp(),
          });
        } catch (e) { console.error("Submission save failed:", e); }
      }
    } catch (e) { setOutput("Submission Error: " + e.message); }
    setIsSubmitting(false);
  };

  const horizDrag = usePanelDrag(useCallback((dx) => {
    if (!containerRef.current) return;
    setLeftPct(p => Math.min(72, Math.max(22, p + (dx / containerRef.current.offsetWidth) * 100)));
  }, []));
  const vertDrag = usePanelDrag(useCallback((_, dy) => {
    if (!containerRef.current) return;
    setEditorPct(p => Math.min(85, Math.max(25, p + (dy / containerRef.current.offsetHeight) * 100)));
  }, []));

  // ── Colours ───────────────────────────────────────────────────
  const D           = dark;
  const pageBg      = D ? "#0d1117" : "#f0f2f5";
  const navBg       = D ? "#161b22" : "#ffffff";
  const navBorder   = D ? "#21262d" : "#e2e8f0";
  const navMuted    = D ? "#6b7280" : "#94a3b8";
  const panelBg     = D ? "#161b22" : "#ffffff";
  const panelBorder = D ? "#21262d" : "#e2e8f0";
  const heading     = D ? "#f1f5f9" : "#0f172a";
  const bodyText    = D ? "#cbd5e1" : "#334155";
  const mutedText   = D ? "#6b7280" : "#64748b";
  const codeBg      = D ? "#0d1117" : "#f1f5f9";
  const termBg      = D ? "#0d1117" : "#ffffff";
  const termText    = D ? "#e6edf3" : "#1f2937";
  const termBorder  = D ? "#21262d" : "#e5e7eb";
  const termInput   = D ? "#0d1117" : "#f9fafb";
  const selectText  = D ? "#e2e8f0" : "#1e293b";
  const selectBg    = D ? "#161b22" : "#ffffff";
  const dragBg      = D ? "#21262d" : "#cbd5e1";
  const tabActive   = D ? "#ffffff" : "#0f172a";
  const tabInactive = D ? "#6b7280" : "#64748b";
  const btnRunBg    = D ? "#21262d" : "#f1f5f9";
  const btnRunBd    = D ? "#30363d" : "#cbd5e1";
  const btnRunTx    = D ? "#e2e8f0" : "#1e293b";
  const diffColors  = D ? DIFF_DARK : DIFF_LIGHT;
  const langObj     = LANGUAGES.find(l => l.value === language) ?? LANGUAGES[0];

  if (loading) return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:"100vh", background:pageBg, gap:16 }}>
      <div style={{ width:36, height:36, border:"3px solid #ffa116", borderTopColor:"transparent", borderRadius:"50%", animation:"spin .8s linear infinite" }}/>
      <span style={{ color:mutedText, fontSize:14 }}>Loading questions…</span>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (!questions.length) return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:"100vh", background:pageBg, gap:16 }}>
      <div style={{ fontSize:48 }}>📭</div>
      <p style={{ color:heading, fontSize:18, fontWeight:700 }}>No questions found</p>
      <p style={{ color:mutedText, fontSize:14, textAlign:"center", maxWidth:400 }}>
        No questions for: <strong style={{ color:"#ffa116" }}>{topicSlug}</strong><br/>
        Check that questions are saved with a matching <code>category</code>.
      </p>
      {fetchError && <p style={{ color:"#f87171", fontSize:13 }}>Error: {fetchError}</p>}
      <button onClick={handleBack} style={{ padding:"10px 24px", background:"#ffa116", border:"none", borderRadius:8, color:"#000", fontWeight:700, fontSize:14, cursor:"pointer" }}>← Go Back</button>
    </div>
  );

  // ═══════════════════════════════════════════════════════════════
  // MCQ PHASE — full-page layout from v2 (palette sidebar, per-question state)
  // ═══════════════════════════════════════════════════════════════
  if (!isCodingQuestion) {
    return (
      <div style={{ minHeight:"100vh", background: D ? "#0d1117" : "#f0f2f5", color: D ? "#e6edf3" : "#1f2937", display:"flex", flexDirection:"column", fontFamily:"system-ui, sans-serif" }}>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}} *{box-sizing:border-box;margin:0;padding:0;}`}</style>

        {/* Header */}
        <header style={{ background: D ? "#161b22" : "#ffffff", borderBottom:`1px solid ${D?"#21262d":"#e2e8f0"}`, padding:"0 24px", height:56, display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <button onClick={handleBack}
              style={{ background:"none", border:"none", color: D ? "#6b7280" : "#94a3b8", cursor:"pointer", fontSize:13, padding:"4px 8px" }}>
              ← Back
            </button>
            <span style={{ fontWeight:800, fontSize:15, color: D ? "#f1f5f9" : "#0f172a" }}>
              {topicSlug ? topicSlug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase()) : "Practice"} — MCQ
            </span>
          </div>

          {/* Question nav dots in header */}
          <div style={{ display:"flex", gap:4, overflowX:"auto", maxWidth:400 }}>
            {questions.map((qItem, i) => {
              const isMCQ    = (qItem.type||"").toUpperCase() === "MCQ";
              const isActive = i === currentIdx;
              return (
                <button key={qItem.id||i} onClick={() => goTo(i)}
                  style={{ width:28, height:28, borderRadius:6,
                    border:`1px solid ${isActive?"#f0883e": D ? "#30363d" : "#e2e8f0"}`,
                    background: isActive ? "#f0883e" : (isMCQ ? (D?"rgba(255,161,22,.08)":"rgba(255,161,22,.05)") : (D?"rgba(88,166,255,.08)":"rgba(88,166,255,.05)")),
                    color: isActive ? "#fff" : (isMCQ ? "#ffa116" : "#58a6ff"),
                    fontSize:11, fontWeight:700, cursor:"pointer", flexShrink:0 }}>
                  {i+1}
                </button>
              );
            })}
          </div>

          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <button onClick={() => setDark(d => !d)}
              style={{ padding:"5px 10px", borderRadius:6, fontSize:13, background:"none", border:`1px solid ${D?"#30363d":"#e2e8f0"}`, color: D ? "#6b7280" : "#94a3b8", cursor:"pointer" }}>
              {dark ? "☀️" : "🌙"}
            </button>
          </div>
        </header>

        {/* Body: question area + palette sidebar */}
        <div style={{ flex:1, display:"flex", overflow:"hidden" }}>

          {/* Main question area */}
          <div style={{ flex:1, overflowY:"auto", padding:"32px 40px" }}>
            {!q ? (
              <p style={{ color: D ? "#8b949e" : "#64748b" }}>No MCQ questions available.</p>
            ) : (
              <>
                {/* Question meta row */}
                <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:28 }}>
                  <span style={{ fontSize:13, color: D ? "#8b949e" : "#64748b" }}>
                    Question {currentIdx + 1} of {questions.length}
                    {mcqQuestions.length < questions.length && ` (MCQ ${mcqQuestions.indexOf(q) + 1} of ${mcqQuestions.length})`}
                  </span>
                  {/* Mark for review — only on unsubmitted questions */}
                  {!currentMcqSubmitted && (
                    <button onClick={() => toggleMark(q.id)}
                      style={{ padding:"4px 12px", background: D ? "#21262d" : "#f1f5f9",
                        border:`1px solid ${mcqMarked.has(q.id) ? "#58a6ff" : (D?"#30363d":"#e2e8f0")}`,
                        borderRadius:6, color: mcqMarked.has(q.id) ? "#58a6ff" : (D ? "#8b949e" : "#64748b"),
                        cursor:"pointer", fontSize:12 }}>
                      🔖 {mcqMarked.has(q.id) ? "Marked for Review" : "Mark for Review"}
                    </button>
                  )}
                  {q.difficulty && (
                    <span style={{ fontSize:12, fontWeight:700, color: (D ? DIFF_DARK : DIFF_LIGHT)[q.difficulty] || "#fbbf24" }}>
                      {q.difficulty}
                    </span>
                  )}
                  {q.marks && (
                    <span style={{ fontSize:12, color: D ? "#8b949e" : "#64748b" }}>{q.marks} pts</span>
                  )}
                </div>

                {/* Question text */}
                <div style={{ fontSize:18, lineHeight:1.75, marginBottom:32, color: D ? "#e6edf3" : "#1f2937" }}
                  dangerouslySetInnerHTML={{ __html: q.description || q.question }} />

                {/* Options */}
                <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                  {(q.options || []).map((opt, i) => {
                    const letter  = ["A","B","C","D","E"][i];
                    const isSelected = currentMcqAnswer === opt;
                    const isCorrect  = currentMcqSubmitted && opt === correctOpt;
                    const isWrong    = currentMcqSubmitted && isSelected && opt !== correctOpt;

                    let bg, border, color, circBg, circColor;
                    if (currentMcqSubmitted) {
                      if (isCorrect) {
                        bg = "rgba(63,185,80,0.10)"; border = "2px solid #3fb950"; color = D ? "#e6edf3" : "#1f2937";
                        circBg = "#3fb950"; circColor = "#fff";
                      } else if (isWrong) {
                        bg = "rgba(248,81,73,0.10)"; border = "2px solid #f85149"; color = D ? "#e6edf3" : "#1f2937";
                        circBg = "#f85149"; circColor = "#fff";
                      } else {
                        bg = D ? "#161b22" : "#f8fafc"; border = `2px solid ${D?"#21262d":"#e2e8f0"}`; color = D ? "#8b949e" : "#94a3b8";
                        circBg = D ? "#21262d" : "#e2e8f0"; circColor = D ? "#8b949e" : "#94a3b8";
                      }
                    } else {
                      if (isSelected) {
                        bg = "rgba(88,166,255,0.10)"; border = "2px solid #58a6ff"; color = D ? "#e6edf3" : "#1f2937";
                        circBg = "#58a6ff"; circColor = "#fff";
                      } else {
                        bg = D ? "#161b22" : "#ffffff"; border = `2px solid ${D?"#21262d":"#e2e8f0"}`; color = D ? "#e6edf3" : "#1f2937";
                        circBg = D ? "#21262d" : "#f1f5f9"; circColor = D ? "#8b949e" : "#64748b";
                      }
                    }

                    return (
                      <button key={i}
                        onClick={() => handleMcqAnswer(q.id, opt)}
                        disabled={currentMcqSubmitted}
                        style={{ display:"flex", alignItems:"center", gap:16, padding:"16px 20px",
                          background: bg, border, borderRadius:12,
                          cursor: currentMcqSubmitted ? "default" : "pointer",
                          textAlign:"left", width:"100%", color, fontSize:15,
                          transition:"all 0.15s" }}>
                        <span style={{ width:28, height:28, borderRadius:"50%",
                          background: circBg, color: circColor,
                          display:"flex", alignItems:"center", justifyContent:"center",
                          fontWeight:700, fontSize:13, flexShrink:0 }}>
                          {letter}
                        </span>
                        <span style={{ flex:1 }}>{opt}</span>
                        {isCorrect && <span style={{ fontSize:16, color:"#3fb950" }}>✓</span>}
                        {isWrong   && <span style={{ fontSize:16, color:"#f85149" }}>✗</span>}
                      </button>
                    );
                  })}
                </div>

                {/* Post-submit verdict + explanation */}
                {currentMcqSubmitted && (
                  <div style={{ marginTop:24, padding:"16px 20px", borderRadius:12,
                    background: currentMcqVerdict === "accepted" ? "rgba(63,185,80,0.08)" : "rgba(248,81,73,0.08)",
                    border:`1px solid ${currentMcqVerdict==="accepted" ? "rgba(63,185,80,0.35)" : "rgba(248,81,73,0.35)"}` }}>
                    <p style={{ fontWeight:800, fontSize:15, marginBottom: q.explanation ? 8 : 0,
                      color: currentMcqVerdict === "accepted" ? "#3fb950" : "#f85149" }}>
                      {currentMcqVerdict === "accepted" ? "✅ Correct!" : "❌ Incorrect"}
                    </p>
                    {correctOpt && currentMcqVerdict !== "accepted" && (
                      <p style={{ fontSize:13, color: D ? "#8b949e" : "#64748b", marginBottom: q.explanation ? 6 : 0 }}>
                        Correct answer: <strong style={{ color:"#3fb950" }}>{correctOpt}</strong>
                      </p>
                    )}
                    {q.explanation && (
                      <p style={{ fontSize:13, color: D ? "#c9d1d9" : "#334155", lineHeight:1.6 }}>{q.explanation}</p>
                    )}
                  </div>
                )}

                {/* Prev / Next / Submit row */}
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:40 }}>
                  <button onClick={() => goTo(currentIdx - 1)} disabled={currentIdx === 0}
                    style={{ padding:"10px 24px", background: D ? "#21262d" : "#f1f5f9",
                      border:"none", borderRadius:8, color: D ? "#fff" : "#1f2937",
                      cursor:"pointer", opacity: currentIdx === 0 ? 0.4 : 1, fontWeight:600 }}>
                    ← Prev
                  </button>

                  {!currentMcqSubmitted && (
                    <button onClick={handleSubmitMcq}
                      disabled={!currentMcqAnswer || isSubmitting}
                      style={{ padding:"10px 28px", background: currentMcqAnswer ? "#f0883e" : (D?"#21262d":"#e2e8f0"),
                        border:"none", borderRadius:8,
                        color: currentMcqAnswer ? "#fff" : (D?"#484f58":"#94a3b8"),
                        cursor: currentMcqAnswer ? "pointer" : "not-allowed",
                        fontWeight:800, fontSize:14, opacity: isSubmitting ? 0.7 : 1 }}>
                      {isSubmitting ? "Submitting…" : "Submit Answer ✓"}
                    </button>
                  )}

                  {currentIdx < questions.length - 1 ? (
                    <button onClick={() => goTo(currentIdx + 1)}
                      style={{ padding:"10px 24px", background: D ? "#21262d" : "#f1f5f9",
                        border:"none", borderRadius:8, color: D ? "#fff" : "#1f2937",
                        cursor:"pointer", fontWeight:600 }}>
                      Next →
                    </button>
                  ) : (
                    <div style={{ width:110 }} />
                  )}
                </div>
              </>
            )}
          </div>

          {/* MCQ Palette sidebar */}
          <div style={{ width:240, background: D ? "#161b22" : "#ffffff",
            borderLeft:`1px solid ${D?"#21262d":"#e2e8f0"}`, padding:16, overflowY:"auto", flexShrink:0 }}>
            <p style={{ fontSize:11, fontWeight:700, color: D?"#8b949e":"#64748b",
              marginBottom:12, textTransform:"uppercase", letterSpacing:"0.08em" }}>
              Question Palette
            </p>

            <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:6, marginBottom:20 }}>
              {mcqQuestions.map((mq) => {
                const globalIdx = questions.indexOf(mq);
                const status = getMcqStatus(mq);
                const s = Q_STATUS[status];
                return (
                  <button key={mq.id} onClick={() => goTo(globalIdx)}
                    style={{ aspectRatio:"1", borderRadius:6,
                      background: s.bg, border:`1px solid ${s.border}`,
                      color: s.color, fontWeight:700, cursor:"pointer", fontSize:12 }}>
                    {mcqQuestions.indexOf(mq) + 1}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            {[
              { key:"answered",   label:"Answered"    },
              { key:"marked",     label:"Marked"      },
              { key:"unanswered", label:"Not Answered" },
            ].map(({ key, label }) => (
              <div key={key} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                <div style={{ width:12, height:12, borderRadius:3,
                  background: Q_STATUS[key].bg, border:`1px solid ${Q_STATUS[key].border}` }} />
                <span style={{ fontSize:11, color: D ? "#8b949e" : "#64748b" }}>{label}</span>
              </div>
            ))}

            {/* Score summary */}
            <div style={{ marginTop:20, padding:12,
              background: D ? "rgba(88,166,255,0.06)" : "rgba(88,166,255,0.04)",
              border:`1px solid ${D?"rgba(88,166,255,0.15)":"rgba(88,166,255,0.2)"}`,
              borderRadius:8 }}>
              <p style={{ fontSize:11, color: D ? "#8b949e" : "#64748b", lineHeight:1.6 }}>
                Answered:{" "}
                <strong style={{ color:"#3fb950" }}>
                  {Object.keys(mcqAnswers).filter(id => mcqQuestions.some(mq => mq.id === id)).length}
                </strong>{" "}
                / {mcqQuestions.length}
              </p>
              {Object.keys(mcqSubmitted).length > 0 && (
                <p style={{ fontSize:11, color: D ? "#8b949e" : "#64748b", lineHeight:1.6, marginTop:4 }}>
                  Correct:{" "}
                  <strong style={{ color:"#3fb950" }}>
                    {mcqQuestions.filter(mq => {
                      const co = mq.correctAnswer || mq.options?.[mq.correctIndex];
                      return mcqSubmitted[mq.id] && mcqAnswers[mq.id] === co;
                    }).length}
                  </strong>{" "}
                  / {Object.keys(mcqSubmitted).length} submitted
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // CODING PHASE — v1 layout preserved (including "Last Sub" tab)
  // ═══════════════════════════════════════════════════════════════
  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100vh", background:pageBg, transition:"all .25s" }}>
      <style>{`
        *{box-sizing:border-box;}
        @keyframes spin{to{transform:rotate(360deg)}}
        .opt-btn:hover{opacity:.88;cursor:pointer;}
      `}</style>

      {/* Nav */}
      <nav style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 16px", height:50, background:navBg, borderBottom:`1px solid ${navBorder}`, flexShrink:0, gap:12 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, flexShrink:0 }}>
          <button onClick={handleBack} style={{ background:"none", border:"none", color:navMuted, cursor:"pointer", fontSize:13, padding:"4px 8px" }}>← Back</button>
          <button disabled={currentIdx===0} onClick={() => goTo(currentIdx-1)}
            style={{ padding:"5px 9px", background:"none", border:"none", cursor:currentIdx===0?"not-allowed":"pointer", opacity:currentIdx===0?0.3:1, color:navMuted, fontSize:15 }}>◀</button>
          <button disabled={currentIdx===questions.length-1} onClick={() => goTo(currentIdx+1)}
            style={{ padding:"5px 9px", background:"none", border:"none", cursor:currentIdx===questions.length-1?"not-allowed":"pointer", opacity:currentIdx===questions.length-1?0.3:1, color:navMuted, fontSize:15 }}>▶</button>
          <span style={{ fontSize:12, color:navMuted, whiteSpace:"nowrap" }}>{currentIdx+1} / {questions.length}</span>
          <span style={{ fontSize:10, fontWeight:700, padding:"3px 7px", borderRadius:5, background:"rgba(88,166,255,.15)", color:"#58a6ff", letterSpacing:"0.06em", whiteSpace:"nowrap" }}>
            💻 CODING
          </span>
          {q?.methodName ? (
            <span style={{ fontSize:10, fontWeight:700, padding:"3px 7px", borderRadius:5, background:"rgba(52,211,153,.12)", color:D?"#34d399":"#16a34a", letterSpacing:"0.05em" }}>
              ✓ Auto-wrapped
            </span>
          ) : (
            <span style={{ fontSize:10, padding:"3px 7px", borderRadius:5, background:"rgba(248,113,113,.08)", color:D?"#f87171":"#dc2626", letterSpacing:"0.05em" }}>
              ⚠ No methodName
            </span>
          )}
        </div>

        {/* Question number dots */}
        <div style={{ display:"flex", gap:4, overflowX:"auto", maxWidth:360 }}>
          {questions.map((qItem, i) => {
            const isMCQ  = (qItem.type||"").toUpperCase() === "MCQ";
            const isActive = i === currentIdx;
            return (
              <button key={qItem.id||i} onClick={() => goTo(i)}
                style={{ width:28, height:28, borderRadius:6, border:`1px solid ${isActive?"#ffa116":navBorder}`, background:isActive?"#ffa116":(isMCQ?"rgba(255,161,22,.08)":"rgba(88,166,255,.08)"), color:isActive?"#000":(isMCQ?"#ffa116":"#58a6ff"), fontSize:11, fontWeight:700, cursor:"pointer", flexShrink:0 }}>
                {i+1}
              </button>
            );
          })}
        </div>

        {/* Right controls */}
        <div style={{ display:"flex", gap:8, alignItems:"center", flexShrink:0 }}>
          <select value={language} onChange={e=>handleLang(e.target.value)}
            style={{ background:selectBg, color:selectText, border:`1px solid ${navBorder}`, borderRadius:6, padding:"5px 8px", fontSize:12, cursor:"pointer", fontWeight:600, outline:"none" }}>
            {LANGUAGES.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
          </select>
          <button onClick={handleRun} disabled={isRunning||isSubmitting}
            style={{ padding:"5px 14px", borderRadius:6, fontSize:12, fontWeight:600, background:btnRunBg, border:`1px solid ${btnRunBd}`, color:btnRunTx, cursor:isRunning||isSubmitting?"not-allowed":"pointer", opacity:isRunning||isSubmitting?0.6:1 }}>
            {isRunning ? "⏳ Running…" : "▶ Run"}
          </button>
          <button onClick={handleSubmitCoding} disabled={isRunning||isSubmitting}
            style={{ padding:"5px 14px", borderRadius:6, fontSize:12, fontWeight:700, background: isSubmitting?"#22863a":"#2ea043", color:"#fff", border:"none", cursor:isRunning||isSubmitting?"not-allowed":"pointer", opacity:isRunning||isSubmitting?0.6:1 }}>
            {isSubmitting ? "⏳ Evaluating…" : "Submit"}
          </button>
          <button onClick={()=>setDark(d=>!d)} style={{ padding:"5px 10px", borderRadius:6, fontSize:13, background:"none", border:`1px solid ${navBorder}`, color:navMuted, cursor:"pointer" }}>
            {dark?"☀️":"🌙"}
          </button>
        </div>
      </nav>

      {/* Body */}
      <div ref={containerRef} style={{ flex:1, display:"flex", overflow:"hidden", padding:"10px 12px", gap:6 }}>
        {/* Left: description */}
        <div style={{ width:`${leftPct}%`, background:panelBg, border:`1px solid ${panelBorder}`, borderRadius:10, display:"flex", flexDirection:"column", overflow:"hidden" }}>
          <div style={{ padding:"14px 20px 10px", borderBottom:`1px solid ${panelBorder}`, flexShrink:0 }}>
            <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap", marginBottom:6 }}>
              {q?.difficulty && (
                <span style={{ fontSize:12, fontWeight:700, color:diffColors[q.difficulty]||diffColors.Medium }}>
                  {q.difficulty}
                </span>
              )}
              {q?.marks && (
                <span style={{ fontSize:11, color:mutedText }}>{q.marks} pts</span>
              )}
              {q?.testCases?.length > 0 && (
                <span style={{ fontSize:11, color:mutedText }}>
                  {q.testCases.filter(t=>!t.isHidden).length} visible + {q.testCases.filter(t=>t.isHidden).length} hidden test cases
                </span>
              )}
            </div>
            <h2 style={{ fontSize:18, fontWeight:800, color:heading, margin:0, lineHeight:1.35 }}>
              {q?.title || q?.question}
            </h2>
          </div>

          <div style={{ flex:1, overflowY:"auto", padding:"16px 20px" }}>
            <div style={{ color:bodyText, lineHeight:1.75, fontSize:14 }}
              dangerouslySetInnerHTML={{ __html: q?.description || "" }} />

            {/* Visible test case examples */}
            {q?.testCases?.filter(t=>!t.isHidden).slice(0,3).map((tc,i) => (
              <div key={i} style={{ marginTop:18 }}>
                <p style={{ fontWeight:700, fontSize:12, color:mutedText, marginBottom:6 }}>Example {i+1}:</p>
                <pre style={{ background:codeBg, padding:12, borderRadius:8, fontSize:12, color:bodyText, margin:0, overflowX:"auto", lineHeight:1.6, border:`1px solid ${panelBorder}` }}>
                  Input:  {tc.input}{"\n"}Output: {tc.expectedOutput}
                </pre>
              </div>
            ))}
            {q?.testCases?.filter(t=>t.isHidden).length > 0 && (
              <p style={{ fontSize:12, color:mutedText, marginTop:12, fontStyle:"italic" }}>
                + {q.testCases.filter(t=>t.isHidden).length} hidden test cases. Submit to run against all.
              </p>
            )}
          </div>
        </div>

        {/* Drag handle */}
        <div onMouseDown={horizDrag} style={{ width:5, cursor:"col-resize", background:dragBg, borderRadius:3, flexShrink:0 }} />

        {/* Right: editor + terminal */}
        <div style={{ flex:1, display:"flex", flexDirection:"column", gap:6, minWidth:0 }}>
          <div style={{ height:`${editorPct}%`, background:panelBg, border:`1px solid ${panelBorder}`, borderRadius:10, display:"flex", flexDirection:"column", overflow:"hidden" }}>
            <div style={{ height:38, display:"flex", alignItems:"center", padding:"0 14px", borderBottom:`1px solid ${panelBorder}`, flexShrink:0, gap:10 }}>
              <select value={language} onChange={e=>handleLang(e.target.value)}
                style={{ background:"none", color:selectText, border:"none", fontSize:12, cursor:"pointer", fontWeight:700, outline:"none" }}>
                {LANGUAGES.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
              </select>
              <span style={{ fontSize:11, color:mutedText, marginLeft:"auto" }}>{langObj.label} · Monaco</span>
            </div>
            <div style={{ flex:1, overflow:"hidden" }}>
              <Editor
                theme={dark?"vs-dark":"light"}
                language={langObj.monaco}
                value={code}
                onChange={v => setCode(v??"")}
                options={{ minimap:{enabled:false}, fontSize:14, lineHeight:22, scrollBeyondLastLine:false, tabSize:4, wordWrap:"on" }}
              />
            </div>
          </div>

          <div onMouseDown={vertDrag} style={{ height:5, cursor:"row-resize", background:dragBg, borderRadius:3, flexShrink:0 }} />

          {/* Terminal / Results — v1's 3-tab layout preserved */}
          <div style={{ flex:1, background:termBg, border:`1px solid ${termBorder}`, borderRadius:10, display:"flex", flexDirection:"column", overflow:"hidden", minHeight:80 }}>
            <div style={{ display:"flex", borderBottom:`1px solid ${termBorder}`, height:40, alignItems:"center", padding:"0 6px", flexShrink:0 }}>
              {["testcase","result","lastsub"].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  style={{ padding:"0 16px", height:"100%", background:"none", border:"none", borderBottom:activeTab===tab?"2px solid #ffa116":"2px solid transparent", color:activeTab===tab?tabActive:tabInactive, fontSize:12, fontWeight:activeTab===tab?700:400, cursor:"pointer" }}>
                  {tab==="testcase" ? "📥 Input" : tab==="result" ? "📤 Output" : "🕓 Last Sub"}
                </button>
              ))}
              {/* Verdict badge in tab bar */}
              {verdict && activeTab==="result" && (
                <span style={{ marginLeft:"auto", marginRight:8, fontSize:11, fontWeight:700, color:verdict==="accepted"?(D?"#34d399":"#16a34a"):(D?"#f87171":"#dc2626") }}>
                  {verdict==="accepted"?"✅ AC":"❌ WA"}
                </span>
              )}
            </div>

            <div style={{ flex:1, overflow:"hidden", display:"flex", flexDirection:"column" }}>
              {activeTab==="testcase" ? (
                <div style={{ flex:1, padding:12 }}>
                  <textarea value={stdin} onChange={e=>setStdin(e.target.value)}
                    placeholder={q?.methodName
                      ? `Custom input args for Run button (e.g. [2,7,11,15], 9)\nSubmit always runs all ${q?.testCases?.length||0} test cases automatically.`
                      : "Custom input (stdin) for Run button..."}
                    style={{ width:"100%", height:"100%", background:termInput, color:termText, border:"none", resize:"none", fontFamily:"'Courier New',monospace", fontSize:13, outline:"none", lineHeight:1.65 }} />
                </div>
              ) : activeTab==="lastsub" ? (
                /* v1 exclusive: Last Submission tab */
                <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
                  {lastSubmissionCode ? (
                    <>
                      <div style={{ padding:"8px 14px", borderBottom:`1px solid ${termBorder}`, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                          <span style={{ fontSize:11, color:mutedText }}>Language:</span>
                          <span style={{ fontSize:11, fontWeight:700, padding:"2px 8px", borderRadius:4, background:D?"#21262d":"#f1f5f9", color:termText }}>
                            {LANGUAGES.find(l=>l.value===lastSubmissionLang)?.label || lastSubmissionLang}
                          </span>
                        </div>
                        <span style={{ fontSize:11, color:mutedText, fontStyle:"italic" }}>Read-only</span>
                      </div>
                      <div style={{ flex:1, overflowY:"auto", padding:"14px 16px" }}>
                        <pre style={{
                          margin:0, fontSize:13, lineHeight:1.75,
                          fontFamily:"'Courier New', Consolas, monospace",
                          color:termText, whiteSpace:"pre-wrap", wordBreak:"break-word",
                          background:"transparent", userSelect:"text",
                        }}>
                          {lastSubmissionCode}
                        </pre>
                      </div>
                    </>
                  ) : (
                    <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", color:mutedText, fontSize:13 }}>
                      No submission yet. Submit your code to see it here.
                    </div>
                  )}
                </div>
              ) : (
                /* Output tab */
                tcResult ? (
                  <TestResultPanel tcResult={tcResult} output={output} verdict={verdict} isSubmitting={isSubmitting} dark={dark} />
                ) : (
                  <div style={{ flex:1, padding:12, overflowY:"auto" }}>
                    <pre style={{ color:termText, fontSize:13, margin:0, whiteSpace:"pre-wrap", wordBreak:"break-word", lineHeight:1.65 }}>
                      {output || (isSubmitting?"⏳ Evaluating…":"Run or submit to see output here.")}
                    </pre>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}