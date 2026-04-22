


// // ============================================================
// // CodingWorkspace.jsx  —  Mind Code Platform
// //
// // CHANGES vs previous version:
// //   1. Uses runWithTestCases() instead of executeCode() for the
// //      Submit button — LeetCode style with visible + hidden cases
// //   2. Run button still uses executeCode() with custom stdin
// //   3. Result panel shows per-test-case pass/fail badges
// //   4. Proctoring unchanged
// // ============================================================

// import { useState, useEffect, useRef, useCallback } from "react";
// import { executeCode, runWithTestCases, getStatusDetails } from "../../api/compilerService";

// const LANGUAGES = [
//   { id: "cpp",        label: "C++",        judge0Id: 54, icon: "⚡",
//     default: `#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    // write your solution here\n};\n` },
//   { id: "python",     label: "Python",     judge0Id: 71, icon: "🐍",
//     default: `class Solution:\n    def solution(self, nums):\n        # write your solution here\n        pass\n` },
//   { id: "java",       label: "Java",       judge0Id: 62, icon: "☕",
//     default: `class Solution {\n    public Object solution() {\n        // write your solution here\n        return null;\n    }\n}\n` },
//   { id: "javascript", label: "JavaScript", judge0Id: 93, icon: "JS",
//     default: `class Solution {\n    solution(nums) {\n        // write your solution here\n    }\n}\n` },
//   { id: "c",          label: "C",          judge0Id: 50, icon: "C",
//     default: `#include <stdio.h>\n\n// write your solution here\n` },
// ];

// const DIFF_STYLE = {
//   Easy:   { color: "#00b96b", bg: "rgba(0,185,107,.1)",  border: "rgba(0,185,107,.3)" },
//   Medium: { color: "#ffb800", bg: "rgba(255,184,0,.1)",  border: "rgba(255,184,0,.3)" },
//   Hard:   { color: "#ef4444", bg: "rgba(239,68,68,.1)",  border: "rgba(239,68,68,.3)" },
// };

// // ── Syntax highlight (simple) ─────────────────────────────────
// const KW = {
//   cpp: /\b(int|long|double|float|char|bool|void|string|auto|return|if|else|for|while|do|break|continue|include|using|namespace|std|class|struct|public|private|new|delete|const|static|vector|map|set|pair|queue|stack|endl|cin|cout|main|nullptr|true|false|sizeof)\b/g,
//   python: /\b(def|class|return|if|elif|else|for|while|break|continue|import|from|as|pass|None|True|False|in|not|and|or|is|lambda|with|try|except|finally|raise|print|len|range|int|str|float|list|dict|set|tuple|self)\b/g,
//   java: /\b(public|private|protected|static|void|int|long|double|float|char|boolean|String|class|interface|extends|implements|new|return|if|else|for|while|do|break|continue|import|null|true|false|this|super|final|try|catch|finally)\b/g,
//   javascript: /\b(const|let|var|function|return|if|else|for|while|do|break|continue|class|new|this|null|undefined|true|false|import|export|default|from|async|await|try|catch|finally|typeof|console|log)\b/g,
//   c: /\b(int|long|double|float|char|void|return|if|else|for|while|do|break|continue|include|printf|scanf|main|const|static|struct|typedef|sizeof|malloc|free)\b/g,
// };
// function highlight(code, langId) {
//   if (!code) return "";
//   const kwRe = KW[langId] || KW.cpp;
//   const esc  = s => s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
//   return code.split("\n").map(line => {
//     const ci = langId === "python" ? line.indexOf("#") : line.indexOf("//");
//     const codePart    = ci !== -1 ? line.slice(0, ci) : line;
//     const commentPart = ci !== -1 ? line.slice(ci)    : "";
//     let p = esc(codePart)
//       .replace(/"([^"\\]|\\.)*"|'([^'\\]|\\.)*'/g, m => `<span style="color:#a5d6ff">${m}</span>`)
//       .replace(/\b\d+\.?\d*\b/g, n => `<span style="color:#79c0ff">${n}</span>`);
//     p = p.replace(new RegExp(kwRe.source, "g"), k => `<span style="color:#ff7b72;font-weight:600">${k}</span>`);
//     const cmt = commentPart ? `<span style="color:#8b949e;font-style:italic">${esc(commentPart)}</span>` : "";
//     return p + cmt;
//   }).join("\n");
// }

// // ── Timer ─────────────────────────────────────────────────────
// function useCountdown(totalSecs, onEnd) {
//   const [rem, setRem] = useState(totalSecs);
//   const startRef = useRef(Date.now()); const firedRef = useRef(false);
//   useEffect(() => { startRef.current = Date.now(); setRem(totalSecs); firedRef.current = false; }, [totalSecs]);
//   useEffect(() => {
//     const t = setInterval(() => {
//       const left = Math.max(0, totalSecs - Math.floor((Date.now() - startRef.current) / 1000));
//       setRem(left);
//       if (left === 0 && !firedRef.current) { firedRef.current = true; onEnd?.(); }
//     }, 1000);
//     return () => clearInterval(t);
//   }, [totalSecs, onEnd]);
//   return { h: Math.floor(rem/3600), m: Math.floor((rem%3600)/60), s: rem%60, pct: totalSecs>0?(rem/totalSecs)*100:0, urgent: rem<300, remaining: rem };
// }

// // ── Code editor with syntax highlight overlay ─────────────────
// function CodeEditor({ code, onChange, langId }) {
//   const taRef = useRef(null); const preRef = useRef(null);
//   const syncScroll = () => {
//     if (preRef.current && taRef.current) {
//       preRef.current.scrollTop = taRef.current.scrollTop;
//       preRef.current.scrollLeft = taRef.current.scrollLeft;
//     }
//   };
//   const handleKey = e => {
//     if (e.key === "Tab") {
//       e.preventDefault();
//       const s = e.target.selectionStart, end = e.target.selectionEnd;
//       onChange(code.substring(0, s) + "    " + code.substring(end));
//       setTimeout(() => { if (taRef.current) { taRef.current.selectionStart = taRef.current.selectionEnd = s + 4; } }, 0);
//     }
//   };
//   const lines = code.split("\n");
//   return (
//     <div style={{ position:"relative", flex:1, display:"flex", overflow:"hidden", background:"#0d1117", fontFamily:"'JetBrains Mono','Fira Code',monospace", fontSize:14 }}>
//       <div style={{ width:52, background:"#0d1117", color:"#3d444d", textAlign:"right", padding:"14px 10px 14px 0", borderRight:"1px solid #21262d", userSelect:"none", flexShrink:0, lineHeight:"21px", fontSize:13 }}>
//         {lines.map((_,i) => <div key={i} style={{ minHeight:21 }}>{i+1}</div>)}
//       </div>
//       <div style={{ flex:1, position:"relative" }}>
//         <pre ref={preRef} style={{ position:"absolute", inset:0, margin:0, padding:"14px 14px 14px 12px", color:"#e6edf3", pointerEvents:"none", whiteSpace:"pre", lineHeight:"21px", overflow:"hidden", fontSize:14 }}
//           dangerouslySetInnerHTML={{ __html: highlight(code, langId) }} />
//         <textarea ref={taRef} value={code} onChange={e => onChange(e.target.value)}
//           onScroll={syncScroll} onKeyDown={handleKey} spellCheck={false}
//           style={{ position:"absolute", inset:0, width:"100%", height:"100%", background:"transparent", color:"transparent", caretColor:"#58a6ff", border:"none", outline:"none", padding:"14px 14px 14px 12px", fontSize:14, lineHeight:"21px", fontFamily:"inherit", resize:"none", whiteSpace:"pre", overflow:"auto" }} />
//       </div>
//     </div>
//   );
// }

// // ── Test Result Panel (LeetCode-style) ───────────────────────
// function TestResultPanel({ result, isRunning }) {
//   if (isRunning) return (
//     <div style={{ display:"flex", alignItems:"center", gap:10, color:"#58a6ff", fontSize:13, padding:16 }}>
//       <span style={{ width:16, height:16, border:"2px solid #58a6ff", borderTopColor:"transparent", borderRadius:"50%", animation:"spin .7s linear infinite", display:"inline-block" }} />
//       Running test cases...
//     </div>
//   );
//   if (!result) return <p style={{ color:"#8b949e", fontSize:13, fontStyle:"italic", padding:16 }}>Run your code to see results.</p>;

//   // Raw run result (no test cases)
//   if (result.type === "run") {
//     const out = result.compile_output
//       ? `❌ Compilation Error:\n${result.compile_output}`
//       : result.stderr ? `⚠️ Runtime Error:\n${result.stderr}`
//       : result.stdout || "✓ No output";
//     const ok = result.status?.id === 3;
//     return (
//       <div style={{ padding:14 }}>
//         <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
//           <span style={{ fontSize:13, fontWeight:700, color: ok ? "#3fb950" : "#f85149" }}>
//             {ok ? "✅ Executed" : "❌ Error"}
//           </span>
//           {result.time && <span style={{ fontSize:11, color:"#8b949e", fontFamily:"monospace" }}>{result.time}s · {result.memory}KB</span>}
//         </div>
//         <pre style={{ fontSize:13, color:"#e6edf3", fontFamily:"'JetBrains Mono',monospace", whiteSpace:"pre-wrap", lineHeight:1.6, background:"#161b22", padding:12, borderRadius:8, border:"1px solid #21262d" }}>{out}</pre>
//       </div>
//     );
//   }

//   // Test-case results (submit)
//   if (result.type === "testcases") {
//     const { results: cases, passedCount, totalCount, visiblePassed, visibleTotal } = result;
//     const allPassed = passedCount === totalCount;
//     const firstFail = cases.find(c => !c.passed);

//     return (
//       <div style={{ padding:14 }}>
//         {/* Summary header */}
//         <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16, padding:"12px 16px", background: allPassed ? "rgba(63,185,80,.08)" : "rgba(248,81,73,.08)", border:`1px solid ${allPassed ? "rgba(63,185,80,.25)" : "rgba(248,81,73,.25)"}`, borderRadius:10 }}>
//           <span style={{ fontSize:22 }}>{allPassed ? "✅" : "❌"}</span>
//           <div>
//             <div style={{ fontSize:15, fontWeight:800, color: allPassed ? "#3fb950" : "#f85149" }}>
//               {allPassed ? "All Test Cases Passed!" : `${passedCount} / ${totalCount} Test Cases Passed`}
//             </div>
//             <div style={{ fontSize:12, color:"#8b949e", marginTop:2 }}>
//               Visible: {visiblePassed}/{visibleTotal} · Hidden: {passedCount - visiblePassed}/{totalCount - visibleTotal}
//             </div>
//           </div>
//         </div>

//         {/* Case dots (like LeetCode) */}
//         <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:16 }}>
//           {cases.map((c, i) => (
//             <div key={i} title={`Case ${i+1}: ${c.passed ? "Passed" : c.statusLabel}`}
//               style={{ width:28, height:28, borderRadius:6, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700,
//                 background: c.passed ? "rgba(63,185,80,.15)" : "rgba(248,81,73,.15)",
//                 border: `1px solid ${c.passed ? "rgba(63,185,80,.4)" : "rgba(248,81,73,.4)"}`,
//                 color: c.passed ? "#3fb950" : "#f85149" }}>
//               {c.isVisible ? i+1 : "H"}
//             </div>
//           ))}
//         </div>

//         {/* Detail for first failing case (or first visible) */}
//         {(() => {
//           const showCase = firstFail || cases.find(c => c.isVisible) || cases[0];
//           if (!showCase) return null;
//           return (
//             <div style={{ background:"#161b22", border:"1px solid #21262d", borderRadius:10, overflow:"hidden" }}>
//               <div style={{ padding:"8px 14px", borderBottom:"1px solid #21262d", fontSize:12, fontWeight:700, color:"#8b949e", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
//                 <span>Case {showCase.caseIndex + 1} {showCase.isVisible ? "" : "(Hidden)"}</span>
//                 <span style={{ color: showCase.passed ? "#3fb950" : "#f85149", fontWeight:800 }}>
//                   {showCase.statusLabel}
//                 </span>
//               </div>
//               <div style={{ padding:14 }}>
//                 {showCase.isVisible && showCase.input !== null && (
//                   <>
//                     <p style={{ fontSize:12, color:"#8b949e", marginBottom:4 }}>Input:</p>
//                     <pre style={{ background:"#0d1117", padding:"8px 12px", borderRadius:6, fontSize:12, color:"#a5d6ff", fontFamily:"monospace", marginBottom:10, overflow:"auto" }}>{showCase.input}</pre>
//                     <p style={{ fontSize:12, color:"#8b949e", marginBottom:4 }}>Expected Output:</p>
//                     <pre style={{ background:"#0d1117", padding:"8px 12px", borderRadius:6, fontSize:12, color:"#7ee787", fontFamily:"monospace", marginBottom:10, overflow:"auto" }}>{showCase.expectedOutput}</pre>
//                     <p style={{ fontSize:12, color:"#8b949e", marginBottom:4 }}>Your Output:</p>
//                     <pre style={{ background:"#0d1117", padding:"8px 12px", borderRadius:6, fontSize:12, color: showCase.passed ? "#7ee787" : "#f85149", fontFamily:"monospace", marginBottom: showCase.error ? 10 : 0, overflow:"auto" }}>{showCase.actualOutput || "(empty)"}</pre>
//                     {showCase.error && (
//                       <>
//                         <p style={{ fontSize:12, color:"#8b949e", marginBottom:4 }}>Error:</p>
//                         <pre style={{ background:"#0d1117", padding:"8px 12px", borderRadius:6, fontSize:12, color:"#f85149", fontFamily:"monospace", overflow:"auto" }}>{showCase.error}</pre>
//                       </>
//                     )}
//                   </>
//                 )}
//                 {(!showCase.isVisible || showCase.input === null) && (
//                   <p style={{ fontSize:13, color:"#8b949e", fontStyle:"italic" }}>
//                     {showCase.passed ? "✓ Hidden test case passed." : "✗ Hidden test case failed. Check your solution logic."}
//                   </p>
//                 )}
//                 {showCase.time && (
//                   <div style={{ fontSize:11, color:"#8b949e", marginTop:8, fontFamily:"monospace" }}>
//                     Runtime: {showCase.time}s · Memory: {showCase.memory}KB
//                   </div>
//                 )}
//               </div>
//             </div>
//           );
//         })()}
//       </div>
//     );
//   }

//   return null;
// }

// // ── Main component ────────────────────────────────────────────
// export default function CodingWorkspace({
//   mode        = "practice",
//   question,
//   examMeta,
//   onSubmit,
//   onSaveAndNext,
//   isLastQuestion = false,
//   isSaving       = false,
//   violationCount = 0,
//   onBack,
// }) {
//   const [lang, setLang]           = useState(LANGUAGES[0]);
//   const [codes, setCodes]         = useState({});
//   const [bottomTab, setBottomTab] = useState(mode === "exam" ? "result" : "testcase");
//   const [leftTab, setLeftTab]     = useState("description");
//   const [testInput, setTestInput] = useState("");
//   const [runResult, setRunResult] = useState(null);
//   const [isRunning, setIsRunning] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [showSubmitModal, setShowSubmitModal] = useState(false);
//   const [showEscWarning, setShowEscWarning]   = useState(false);
//   const [violations, setViolations]           = useState(violationCount);
//   const [leftW, setLeftW]         = useState(42);
//   const containerRef              = useRef(null);
//   const isDragging                = useRef(false);

//   const timer = useCountdown(examMeta?.duration ?? 3600, examMeta?.onTimerEnd);
//   const codeKey = `${question?.id}_${lang.id}`;
//   const code = codes[codeKey] ?? question?.boilerplates?.[lang.id] ?? lang.default;

//   useEffect(() => {
//     if (question?.testCases?.length > 0) setTestInput(question.testCases[0].input || "");
//     setRunResult(null);
//     setBottomTab(mode === "exam" ? "result" : "testcase");
//   }, [question?.id, mode]);

//   // Exam proctoring
//   useEffect(() => {
//     if (mode !== "exam") return;
//     const enterFS = async () => { try { await document.documentElement.requestFullscreen?.(); } catch {} };
//     enterFS();
//     const onFSChange = () => {
//       if (!document.fullscreenElement) { setViolations(v => v + 1); setShowEscWarning(true); }
//     };
//     const onVis = () => { if (document.visibilityState === "hidden") setViolations(v => v + 1); };
//     const blockKey = e => {
//       if (e.key === "F12" || (e.ctrlKey && e.shiftKey && ["I","J","C"].includes(e.key)) || (e.ctrlKey && e.key === "u"))
//         e.preventDefault();
//       if (e.key === "Escape") setShowEscWarning(true);
//     };
//     const blockCM = e => e.preventDefault();
//     document.addEventListener("fullscreenchange", onFSChange);
//     document.addEventListener("visibilitychange", onVis);
//     document.addEventListener("keydown", blockKey);
//     document.addEventListener("contextmenu", blockCM);
//     document.addEventListener("copy", blockCM);
//     document.addEventListener("cut", blockCM);
//     document.addEventListener("paste", blockCM);
//     return () => {
//       document.removeEventListener("fullscreenchange", onFSChange);
//       document.removeEventListener("visibilitychange", onVis);
//       document.removeEventListener("keydown", blockKey);
//       document.removeEventListener("contextmenu", blockCM);
//       document.removeEventListener("copy", blockCM);
//       document.removeEventListener("cut", blockCM);
//       document.removeEventListener("paste", blockCM);
//     };
//   }, [mode]);

//   useEffect(() => {
//     if (mode === "exam" && violations >= 3) handleForceSubmit();
//   }, [violations, mode]);

//   // Drag resize
//   const startDrag = e => {
//     e.preventDefault(); isDragging.current = true;
//     const onMove = ev => {
//       if (!containerRef.current || !isDragging.current) return;
//       const rect = containerRef.current.getBoundingClientRect();
//       setLeftW(Math.max(25, Math.min(65, ((ev.clientX - rect.left) / rect.width) * 100)));
//     };
//     const onUp = () => { isDragging.current = false; window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
//     window.addEventListener("mousemove", onMove); window.addEventListener("mouseup", onUp);
//   };

//   // ── Run (custom stdin, raw output) ──────────────────────────
//   const handleRun = async () => {
//     if (!code.trim() || isRunning) return;
//     setIsRunning(true); setBottomTab("result");
//     setRunResult({ type: "running" });
//     try {
//       const r = await executeCode(lang.id, code, testInput, question?.timeLimitMs || 2000);
//       setRunResult({ type: "run", ...r });
//     } catch (err) {
//       setRunResult({ type: "run", status: { id: 13 }, stderr: err.message });
//     }
//     setIsRunning(false);
//   };

//   // ── Submit (run all test cases, LeetCode style) ──────────────
//   const handleSubmit = async () => {
//     setShowSubmitModal(false);
//     setIsSubmitting(true); setBottomTab("result");
//     setRunResult({ type: "running" });
//     try {
//       if (question?.testCases?.length && question?.methodName) {
//         // LeetCode-style: wrapped execution against all test cases
//         const tcResult = await runWithTestCases(lang.id, code, question, { visibleCount: 3 });
//         setRunResult({ type: "testcases", ...tcResult });
//         await onSubmit?.(code, lang.id, tcResult.passedCount);
//       } else {
//         // No test cases / no methodName — just run raw
//         const r = await executeCode(lang.id, code, testInput, question?.timeLimitMs || 2000);
//         setRunResult({ type: "run", ...r });
//         const passed = r.status?.id === 3 ? 1 : 0;
//         await onSubmit?.(code, lang.id, passed);
//       }
//     } catch (err) {
//       setRunResult({ type: "run", status: { id: 13 }, stderr: err.message });
//       await onSubmit?.(code, lang.id, 0);
//     }
//     setIsSubmitting(false);
//   };

//   const handleForceSubmit = async () => { setShowEscWarning(false); await onSubmit?.(code, lang.id, 0); };

//   const diff = question?.difficulty || "Medium";
//   const diffStyle = DIFF_STYLE[diff] || DIFF_STYLE.Medium;

//   return (
//     <div style={{ display:"flex", flexDirection:"column", height:"100vh", width:"100%", background:"#0d1117", color:"#e6edf3", fontFamily:"'Söhne','Segoe UI',system-ui,sans-serif", overflow:"hidden" }}>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&display=swap');
//         *{box-sizing:border-box;margin:0;padding:0;}
//         ::-webkit-scrollbar{width:6px;height:6px;}
//         ::-webkit-scrollbar-track{background:#0d1117;}
//         ::-webkit-scrollbar-thumb{background:#30363d;border-radius:3px;}
//         @keyframes spin{to{transform:rotate(360deg)}}
//         @keyframes slideIn{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
//         .run-btn:hover{background:rgba(35,134,54,.3)!important;}
//         .sub-btn:hover{background:#f0883e!important;}
//         textarea{-webkit-text-fill-color:transparent;caret-color:#58a6ff;}
//       `}</style>

//       {/* ── Header ── */}
//       <header style={{ height:50, background:"#161b22", borderBottom:"1px solid #21262d", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 16px", flexShrink:0, zIndex:100 }}>
//         <div style={{ display:"flex", alignItems:"center", gap:12 }}>
//           {mode !== "exam" && (
//             <button className="nav-icon" onClick={onBack}
//               style={{ background:"none", border:"none", color:"#8b949e", cursor:"pointer", display:"flex", alignItems:"center", gap:6, fontSize:13, fontWeight:600, padding:"4px 8px", borderRadius:6 }}>
//               ← Problems
//             </button>
//           )}
//           <span style={{ fontSize:13, fontWeight:600, color:"#e6edf3", maxWidth:280, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
//             {question?.title || "Loading..."}
//           </span>
//           {diff && (
//             <span style={{ fontSize:11, fontWeight:700, padding:"2px 8px", borderRadius:12, background:diffStyle.bg, color:diffStyle.color, border:`1px solid ${diffStyle.border}` }}>{diff}</span>
//           )}
//           {!question?.methodName && question?.testCases?.length > 0 && (
//             <span style={{ fontSize:10, background:"rgba(240,136,62,.15)", color:"#f0883e", border:"1px solid rgba(240,136,62,.3)", padding:"2px 8px", borderRadius:8 }}>
//               ⚠️ Add methodName to question in Firestore for auto-wrapping
//             </span>
//           )}
//         </div>
//         <div style={{ display:"flex", alignItems:"center", gap:8 }}>
//           {mode === "exam" && (
//             <>
//               <div style={{ display:"flex", alignItems:"center", gap:6, background: timer.urgent ? "rgba(239,68,68,.1)" : "rgba(88,166,255,.08)", border:`1px solid ${timer.urgent ? "rgba(239,68,68,.3)" : "rgba(88,166,255,.2)"}`, borderRadius:8, padding:"5px 12px" }}>
//                 <span style={{ fontFamily:"monospace", fontSize:14, fontWeight:700, color: timer.urgent ? "#f85149" : "#58a6ff", animation: timer.urgent ? "spin 1s infinite" : "none" }}>
//                   {String(timer.h).padStart(2,"0")}:{String(timer.m).padStart(2,"0")}:{String(timer.s).padStart(2,"0")}
//                 </span>
//               </div>
//               {violations > 0 && (
//                 <span style={{ fontSize:11, background:"rgba(248,81,73,.15)", color:"#f85149", border:"1px solid rgba(248,81,73,.3)", padding:"3px 8px", borderRadius:6, fontWeight:700 }}>
//                   ⚠️ {violations}/3
//                 </span>
//               )}
//             </>
//           )}
//           {/* Lang selector */}
//           <div style={{ position:"relative" }}>
//             <select value={lang.id} onChange={e => setLang(LANGUAGES.find(l => l.id === e.target.value))}
//               style={{ appearance:"none", background:"#21262d", border:"1px solid #30363d", borderRadius:6, padding:"4px 28px 4px 10px", color:"#e6edf3", fontSize:13, fontWeight:600, cursor:"pointer", outline:"none" }}>
//               {LANGUAGES.map(l => <option key={l.id} value={l.id}>{l.icon} {l.label}</option>)}
//             </select>
//             <span style={{ position:"absolute", right:8, top:"50%", transform:"translateY(-50%)", color:"#8b949e", pointerEvents:"none", fontSize:10 }}>▼</span>
//           </div>
//           <button onClick={() => { const u = {...codes}; u[codeKey] = question?.boilerplates?.[lang.id] ?? lang.default; setCodes(u); }}
//             style={{ background:"none", border:"1px solid #30363d", borderRadius:5, padding:"3px 10px", color:"#8b949e", fontSize:12, cursor:"pointer" }}>
//             ↺ Reset
//           </button>
//           <button className="run-btn" onClick={handleRun} disabled={isRunning || isSubmitting}
//             style={{ padding:"6px 16px", borderRadius:6, background:"rgba(35,134,54,.15)", color:"#3fb950", border:"1px solid rgba(35,134,54,.3)", fontSize:13, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:6, opacity: isRunning ? 0.6 : 1 }}>
//             {isRunning ? <span style={{ width:12, height:12, border:"2px solid #3fb950", borderTopColor:"transparent", borderRadius:"50%", animation:"spin .7s linear infinite", display:"inline-block" }} /> : "▶"}
//             {isRunning ? "Running…" : "Run"}
//           </button>
//           <button className="sub-btn" onClick={() => mode === "exam" ? setShowSubmitModal(true) : handleSubmit()}
//             disabled={isSubmitting}
//             style={{ padding:"6px 18px", borderRadius:6, background:"#f0883e", color:"#fff", border:"none", fontSize:13, fontWeight:700, cursor:"pointer", opacity: isSubmitting ? 0.7 : 1 }}>
//             {isSubmitting ? "Evaluating…" : isLastQuestion ? "Submit Exam" : "Submit"}
//           </button>
//           {!isLastQuestion && mode === "exam" && (
//             <button onClick={() => onSaveAndNext?.(code, lang.id)}
//               style={{ padding:"6px 14px", borderRadius:6, background:"#21262d", color:"#8b949e", border:"1px solid #30363d", fontSize:12, fontWeight:700, cursor:"pointer" }}>
//               Save & Next →
//             </button>
//           )}
//         </div>
//       </header>

//       {/* ── Body ── */}
//       <div ref={containerRef} style={{ flex:1, display:"flex", overflow:"hidden" }}>
//         {/* Left panel */}
//         <div style={{ width:`${leftW}%`, display:"flex", flexDirection:"column", borderRight:"1px solid #21262d", overflow:"hidden" }}>
//           <div style={{ display:"flex", background:"#161b22", borderBottom:"1px solid #21262d", padding:"0 4px", flexShrink:0 }}>
//             {["description","hints"].map(t => (
//               <button key={t} onClick={() => setLeftTab(t)}
//                 style={{ padding:"10px 16px", background:"none", border:"none", borderBottom:`2px solid ${leftTab===t?"#f0883e":"transparent"}`, color:leftTab===t?"#e6edf3":"#8b949e", fontSize:13, fontWeight:leftTab===t?700:400, cursor:"pointer", textTransform:"capitalize" }}>
//                 {t}
//               </button>
//             ))}
//           </div>
//           <div style={{ flex:1, overflowY:"auto", padding:"20px 24px" }}>
//             {leftTab === "description" ? (
//               <div>
//                 <h2 style={{ fontSize:20, fontWeight:700, color:"#e6edf3", marginBottom:12, lineHeight:1.3 }}>{question?.title}</h2>
//                 <div style={{ display:"flex", gap:8, marginBottom:20, flexWrap:"wrap" }}>
//                   <span style={{ fontSize:12, fontWeight:700, padding:"3px 10px", borderRadius:12, background:diffStyle.bg, color:diffStyle.color, border:`1px solid ${diffStyle.border}` }}>{diff}</span>
//                   {question?.marks && <span style={{ fontSize:12, fontWeight:700, padding:"3px 10px", borderRadius:12, background:"rgba(88,166,255,.1)", color:"#58a6ff", border:"1px solid rgba(88,166,255,.2)" }}>{question.marks} pts</span>}
//                   {question?.testCases?.length > 0 && (
//                     <span style={{ fontSize:12, fontWeight:700, padding:"3px 10px", borderRadius:12, background:"rgba(63,185,80,.1)", color:"#3fb950", border:"1px solid rgba(63,185,80,.2)" }}>
//                       {question.testCases.length} test cases
//                     </span>
//                   )}
//                 </div>
//                 <div style={{ fontSize:15, lineHeight:1.8, color:"#c9d1d9" }}
//                   dangerouslySetInnerHTML={{ __html: question?.description || question?.question || "<p>No description.</p>" }} />
//                 {/* Show first 2 test cases as examples */}
//                 {question?.testCases?.slice(0, 2).map((tc, i) => (
//                   <div key={i} style={{ marginTop:24, background:"#161b22", border:"1px solid #21262d", borderRadius:10, overflow:"hidden" }}>
//                     <div style={{ padding:"8px 14px", borderBottom:"1px solid #21262d", fontSize:12, fontWeight:700, color:"#8b949e" }}>Example {i+1}</div>
//                     <div style={{ padding:14 }}>
//                       <p style={{ fontSize:13, color:"#8b949e", marginBottom:4 }}>Input:</p>
//                       <pre style={{ background:"#0d1117", padding:"8px 12px", borderRadius:6, fontSize:13, color:"#a5d6ff", fontFamily:"monospace", marginBottom:10, overflow:"auto" }}>{tc.input}</pre>
//                       <p style={{ fontSize:13, color:"#8b949e", marginBottom:4 }}>Expected Output:</p>
//                       <pre style={{ background:"#0d1117", padding:"8px 12px", borderRadius:6, fontSize:13, color:"#7ee787", fontFamily:"monospace", overflow:"auto" }}>{tc.expectedOutput}</pre>
//                     </div>
//                   </div>
//                 ))}
//                 {question?.testCases?.length > 2 && (
//                   <p style={{ fontSize:12, color:"#8b949e", marginTop:12, fontStyle:"italic" }}>
//                     + {question.testCases.length - 2} more hidden test cases. Submit to run against all.
//                   </p>
//                 )}
//               </div>
//             ) : (
//               <div style={{ color:"#8b949e", fontSize:14, lineHeight:1.7 }}>
//                 <p style={{ color:"#e6edf3", fontWeight:600, marginBottom:12 }}>💡 Hints</p>
//                 {question?.hints ? <p>{question.hints}</p> : <p style={{ fontStyle:"italic" }}>No hints available.</p>}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Drag handle */}
//         <div onMouseDown={startDrag} style={{ width:5, cursor:"col-resize", background:"#21262d", flexShrink:0, transition:"background .15s" }}
//           onMouseEnter={e => e.currentTarget.style.background="#388bfd"}
//           onMouseLeave={e => e.currentTarget.style.background="#21262d"} />

//         {/* Right panel */}
//         <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
//           <CodeEditor code={code} onChange={v => setCodes(p => ({...p, [codeKey]: v}))} langId={lang.id} />

//           {/* Bottom panel */}
//           <div style={{ height:240, display:"flex", flexDirection:"column", borderTop:"1px solid #21262d", flexShrink:0 }}>
//             <div style={{ display:"flex", alignItems:"center", background:"#161b22", borderBottom:"1px solid #21262d", padding:"0 8px", flexShrink:0 }}>
//               {mode !== "exam" && (
//                 <button onClick={() => setBottomTab("testcase")}
//                   style={{ padding:"8px 14px", background:"none", border:"none", borderBottom:`2px solid ${bottomTab==="testcase"?"#f0883e":"transparent"}`, color:bottomTab==="testcase"?"#e6edf3":"#8b949e", fontSize:12, fontWeight:bottomTab==="testcase"?700:400, cursor:"pointer" }}>
//                   Custom Input
//                 </button>
//               )}
//               <button onClick={() => setBottomTab("result")}
//                 style={{ padding:"8px 14px", background:"none", border:"none", borderBottom:`2px solid ${bottomTab==="result"?"#f0883e":"transparent"}`, color:bottomTab==="result"?"#e6edf3":"#8b949e", fontSize:12, fontWeight:bottomTab==="result"?700:400, cursor:"pointer" }}>
//                 Test Results
//                 {runResult?.type === "testcases" && (
//                   <span style={{ marginLeft:6, display:"inline-block", width:6, height:6, borderRadius:"50%", background: runResult.allPassed ? "#3fb950" : "#f85149" }} />
//                 )}
//               </button>
//             </div>
//             <div style={{ flex:1, overflow:"auto" }}>
//               {bottomTab === "testcase" && mode !== "exam" ? (
//                 <div style={{ display:"flex", flexDirection:"column", gap:8, height:"100%", padding:14 }}>
//                   <label style={{ fontSize:12, fontWeight:700, color:"#8b949e", letterSpacing:"0.06em" }}>CUSTOM INPUT (stdin)</label>
//                   <textarea value={testInput} onChange={e => setTestInput(e.target.value)}
//                     style={{ flex:1, background:"#21262d", border:"1px solid #30363d", borderRadius:6, padding:10, color:"#e6edf3", fontSize:13, fontFamily:"monospace", resize:"none", outline:"none" }} />
//                 </div>
//               ) : (
//                 <TestResultPanel result={runResult} isRunning={isRunning || isSubmitting} />
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Submit confirm modal */}
//       {showSubmitModal && (
//         <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.75)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000, animation:"slideIn .2s ease" }}>
//           <div style={{ background:"#161b22", border:"1px solid #30363d", borderRadius:16, padding:32, maxWidth:420, width:"90%", textAlign:"center" }}>
//             <div style={{ fontSize:40, marginBottom:16 }}>📋</div>
//             <h3 style={{ fontSize:20, fontWeight:700, color:"#e6edf3", marginBottom:10 }}>Submit Solution?</h3>
//             <p style={{ fontSize:14, color:"#8b949e", lineHeight:1.6, marginBottom:24 }}>
//               Your code will be evaluated against all test cases including hidden ones.
//               {isLastQuestion && " This will end your exam."}
//             </p>
//             <div style={{ display:"flex", gap:12, justifyContent:"center" }}>
//               <button onClick={() => setShowSubmitModal(false)}
//                 style={{ padding:"10px 24px", borderRadius:8, background:"#21262d", border:"1px solid #30363d", color:"#8b949e", fontSize:14, fontWeight:700, cursor:"pointer" }}>
//                 Cancel
//               </button>
//               <button onClick={handleSubmit}
//                 style={{ padding:"10px 24px", borderRadius:8, background:"#f0883e", border:"none", color:"#fff", fontSize:14, fontWeight:700, cursor:"pointer" }}>
//                 {isLastQuestion ? "Submit Exam" : "Submit"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ESC / violation warning */}
//       {showEscWarning && (
//         <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.85)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:2000, animation:"slideIn .2s ease" }}>
//           <div style={{ background:"#161b22", border:"2px solid rgba(248,81,73,.5)", borderRadius:16, padding:36, maxWidth:460, width:"90%", textAlign:"center" }}>
//             <div style={{ fontSize:50, marginBottom:16 }}>🚨</div>
//             <h3 style={{ fontSize:22, fontWeight:700, color:"#f85149", marginBottom:12 }}>Proctoring Violation</h3>
//             <p style={{ fontSize:14, color:"#c9d1d9", lineHeight:1.7, marginBottom:24 }}>
//               Violations: <strong style={{ color:"#f85149" }}>{violations}/3</strong> — At 3 your exam is auto-submitted.
//             </p>
//             <div style={{ display:"flex", gap:12, justifyContent:"center" }}>
//               <button onClick={handleForceSubmit} style={{ padding:"10px 20px", borderRadius:8, background:"#f85149", border:"none", color:"#fff", fontSize:14, fontWeight:700, cursor:"pointer" }}>Submit Now</button>
//               <button onClick={async () => { setShowEscWarning(false); try { await document.documentElement.requestFullscreen?.(); } catch {} }}
//                 style={{ padding:"10px 20px", borderRadius:8, background:"#21262d", border:"1px solid #388bfd", color:"#58a6ff", fontSize:14, fontWeight:700, cursor:"pointer" }}>
//                 Return to Exam
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }









// ============================================================
// src/components/workspace/CodingWorkspace.jsx
//
// LeetCode-style result panel:
//   • "Run" = custom stdin, shows raw stdout (student debug)
//   • "Submit" = runWithTestCases(), wrapped execution
//     - shows green/red per visible case with I/O
//     - shows hidden cases as pass/fail dots only
//     - top summary: "X / Y Test Cases Passed"
//   • All wiring is dynamic — reads methodName from question
// ============================================================

import { useState, useEffect, useRef, useCallback } from "react";
import { executeCode, runWithTestCases, getStatusDetails } from "../../api/compilerService";

const LANGUAGES = [
  { id: "cpp",        label: "C++",        icon: "⚡", default: `class Solution {\npublic:\n    // write your solution here\n};\n` },
  { id: "python",     label: "Python",     icon: "🐍", default: `class Solution:\n    def solution(self):\n        pass\n` },
  { id: "java",       label: "Java",       icon: "☕", default: `class Solution {\n    public Object solution() {\n        return null;\n    }\n}\n` },
  { id: "javascript", label: "JavaScript", icon: "JS", default: `class Solution {\n    solution() {\n        \n    }\n}\n` },
  { id: "c",          label: "C",          icon: "C",  default: `#include <stdio.h>\n// write your solution here\n` },
];

const DIFF = {
  Easy:   { color: "#00b96b", bg: "rgba(0,185,107,.1)",  border: "rgba(0,185,107,.3)" },
  Medium: { color: "#ffb800", bg: "rgba(255,184,0,.1)",  border: "rgba(255,184,0,.3)" },
  Hard:   { color: "#ef4444", bg: "rgba(239,68,68,.1)",  border: "rgba(239,68,68,.3)" },
};

const KW = {
  cpp: /\b(int|long|double|float|char|bool|void|string|auto|return|if|else|for|while|do|break|continue|include|using|namespace|std|class|struct|public|private|vector|map|set|endl|cin|cout|nullptr|true|false)\b/g,
  python: /\b(def|class|return|if|elif|else|for|while|break|continue|import|from|as|pass|None|True|False|in|not|and|or|is|lambda|with|try|except|finally|raise|print|len|range|int|str|float|list|dict|set|self)\b/g,
  java: /\b(public|private|static|void|int|long|double|float|char|boolean|String|class|new|return|if|else|for|while|import|null|true|false|this|try|catch|finally)\b/g,
  javascript: /\b(const|let|var|function|return|if|else|for|while|class|new|this|null|undefined|true|false|async|await|try|catch|console|log)\b/g,
  c: /\b(int|long|double|float|char|void|return|if|else|for|while|include|printf|scanf|main|const|sizeof|malloc|free)\b/g,
};

function highlight(code, langId) {
  if (!code) return "";
  const kwRe = KW[langId] || KW.cpp;
  const esc  = s => s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  return code.split("\n").map(line => {
    const ci = langId === "python" ? line.indexOf("#") : line.indexOf("//");
    const codePart    = ci !== -1 ? line.slice(0, ci) : line;
    const commentPart = ci !== -1 ? line.slice(ci)    : "";
    let p = esc(codePart)
      .replace(/"([^"\\]|\\.)*"|'([^'\\]|\\.)*'/g, m => `<span style="color:#a5d6ff">${m}</span>`)
      .replace(/\b\d+\.?\d*\b/g, n => `<span style="color:#79c0ff">${n}</span>`);
    p = p.replace(new RegExp(kwRe.source, "g"), k => `<span style="color:#ff7b72;font-weight:600">${k}</span>`);
    const cmt = commentPart ? `<span style="color:#8b949e;font-style:italic">${esc(commentPart)}</span>` : "";
    return p + cmt;
  }).join("\n");
}

function useCountdown(totalSecs, onEnd) {
  const [rem, setRem] = useState(totalSecs);
  const startRef = useRef(Date.now()); const firedRef = useRef(false);
  useEffect(() => { startRef.current = Date.now(); setRem(totalSecs); firedRef.current = false; }, [totalSecs]);
  useEffect(() => {
    const t = setInterval(() => {
      const left = Math.max(0, totalSecs - Math.floor((Date.now() - startRef.current) / 1000));
      setRem(left);
      if (left === 0 && !firedRef.current) { firedRef.current = true; onEnd?.(); }
    }, 1000);
    return () => clearInterval(t);
  }, [totalSecs, onEnd]);
  return { h: Math.floor(rem/3600), m: Math.floor((rem%3600)/60), s: rem%60, pct: totalSecs>0?(rem/totalSecs)*100:0, urgent: rem<300, remaining: rem };
}

function CodeEditor({ code, onChange, langId }) {
  const taRef = useRef(null); const preRef = useRef(null);
  const syncScroll = () => {
    if (preRef.current && taRef.current) {
      preRef.current.scrollTop = taRef.current.scrollTop;
      preRef.current.scrollLeft = taRef.current.scrollLeft;
    }
  };
  const handleKey = e => {
    if (e.key === "Tab") {
      e.preventDefault();
      const s = e.target.selectionStart, end = e.target.selectionEnd;
      onChange(code.substring(0, s) + "    " + code.substring(end));
      setTimeout(() => { if (taRef.current) { taRef.current.selectionStart = taRef.current.selectionEnd = s + 4; } }, 0);
    }
  };
  return (
    <div style={{ position:"relative", flex:1, display:"flex", overflow:"hidden", background:"#0d1117", fontFamily:"'JetBrains Mono','Fira Code',monospace", fontSize:14 }}>
      <div style={{ width:52, background:"#0d1117", color:"#3d444d", textAlign:"right", padding:"14px 10px 14px 0", borderRight:"1px solid #21262d", userSelect:"none", flexShrink:0, lineHeight:"21px", fontSize:13 }}>
        {code.split("\n").map((_,i) => <div key={i} style={{ minHeight:21 }}>{i+1}</div>)}
      </div>
      <div style={{ flex:1, position:"relative" }}>
        <pre ref={preRef} style={{ position:"absolute", inset:0, margin:0, padding:"14px 14px 14px 12px", color:"#e6edf3", pointerEvents:"none", whiteSpace:"pre", lineHeight:"21px", overflow:"hidden", fontSize:14 }}
          dangerouslySetInnerHTML={{ __html: highlight(code, langId) }} />
        <textarea ref={taRef} value={code} onChange={e => onChange(e.target.value)}
          onScroll={syncScroll} onKeyDown={handleKey} spellCheck={false}
          style={{ position:"absolute", inset:0, width:"100%", height:"100%", background:"transparent", color:"transparent", caretColor:"#58a6ff", border:"none", outline:"none", padding:"14px 14px 14px 12px", fontSize:14, lineHeight:"21px", fontFamily:"inherit", resize:"none", whiteSpace:"pre", overflow:"auto" }} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// TestResultPanel — the LeetCode-style results area
// ─────────────────────────────────────────────────────────────
function TestResultPanel({ result, isRunning }) {
  const [selectedCase, setSelectedCase] = useState(0);

  useEffect(() => {
    if (result?.type === "testcases") {
      // Default to first failing visible case, or first case
      const firstFail = result.results?.findIndex(r => !r.passed && r.isVisible);
      setSelectedCase(firstFail >= 0 ? firstFail : 0);
    }
  }, [result]);

  if (isRunning) return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:"100%", gap:14, color:"#58a6ff" }}>
      <div style={{ width:32, height:32, border:"3px solid #58a6ff", borderTopColor:"transparent", borderRadius:"50%", animation:"spin .7s linear infinite" }} />
      <span style={{ fontSize:13, fontWeight:600 }}>Evaluating your solution…</span>
    </div>
  );

  if (!result) return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:"100%", gap:8, color:"#484f58" }}>
      <span style={{ fontSize:32 }}>💻</span>
      <span style={{ fontSize:13 }}>Run your code or Submit to see results</span>
    </div>
  );

  // Raw run result
  if (result.type === "run") {
    const err = result.compile_output || result.stderr;
    const ok  = result.status?.id === 3;
    return (
      <div style={{ padding:16 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12, padding:"10px 14px", background: ok ? "rgba(63,185,80,.08)" : "rgba(248,81,73,.08)", border:`1px solid ${ok ? "rgba(63,185,80,.2)" : "rgba(248,81,73,.2)"}`, borderRadius:10 }}>
          <span style={{ fontSize:18 }}>{ok ? "✅" : "❌"}</span>
          <div>
            <div style={{ fontSize:13, fontWeight:700, color: ok ? "#3fb950" : "#f85149" }}>
              {ok ? "Executed Successfully" : (result.compile_output ? "Compilation Error" : "Runtime Error")}
            </div>
            {result.time && <div style={{ fontSize:11, color:"#8b949e", marginTop:2, fontFamily:"monospace" }}>{result.time}s · {result.memory}KB</div>}
          </div>
        </div>
        {err ? (
          <>
            <p style={{ fontSize:11, color:"#8b949e", marginBottom:6, textTransform:"uppercase", letterSpacing:"0.06em" }}>Error Output</p>
            <pre style={{ fontSize:12, color:"#f85149", background:"#161b22", padding:12, borderRadius:8, border:"1px solid rgba(248,81,73,.2)", whiteSpace:"pre-wrap", overflow:"auto" }}>{err}</pre>
          </>
        ) : (
          <>
            <p style={{ fontSize:11, color:"#8b949e", marginBottom:6, textTransform:"uppercase", letterSpacing:"0.06em" }}>Stdout</p>
            <pre style={{ fontSize:12, color:"#e6edf3", background:"#161b22", padding:12, borderRadius:8, border:"1px solid #21262d", whiteSpace:"pre-wrap", overflow:"auto" }}>{result.stdout || "(empty output)"}</pre>
          </>
        )}
      </div>
    );
  }

  // Test case results
  if (result.type === "testcases") {
    const { results: cases, passedCount, totalCount, allPassed, visiblePassed, visibleTotal, noTestCases } = result;

    if (noTestCases || !totalCount) return (
      <div style={{ padding:16 }}>
        <div style={{ padding:"12px 16px", background:"rgba(240,136,62,.08)", border:"1px solid rgba(240,136,62,.2)", borderRadius:10, fontSize:13, color:"#f0883e" }}>
          ⚠️ No test cases defined for this question yet. Faculty needs to add test cases in the question editor.
        </div>
        {result.rawResult && (
          <div style={{ marginTop:12 }}>
            <p style={{ fontSize:11, color:"#8b949e", marginBottom:6 }}>Raw Output:</p>
            <pre style={{ fontSize:12, color:"#e6edf3", background:"#161b22", padding:12, borderRadius:8, border:"1px solid #21262d", whiteSpace:"pre-wrap" }}>{result.rawResult.stdout || result.rawResult.stderr || "(empty)"}</pre>
          </div>
        )}
      </div>
    );

    const shownCase = cases[selectedCase];

    return (
      <div style={{ display:"flex", flexDirection:"column", height:"100%", overflow:"hidden" }}>
        {/* Summary bar */}
        <div style={{ padding:"12px 16px", borderBottom:"1px solid #21262d", flexShrink:0 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <span style={{ fontSize:20 }}>{allPassed ? "✅" : "❌"}</span>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:14, fontWeight:800, color: allPassed ? "#3fb950" : "#f85149" }}>
                {allPassed ? "All Test Cases Passed!" : `${passedCount} / ${totalCount} Test Cases Passed`}
              </div>
              <div style={{ fontSize:11, color:"#8b949e", marginTop:2, fontFamily:"monospace" }}>
                Visible: {visiblePassed}/{visibleTotal} passed
                {totalCount > visibleTotal && ` · Hidden: ${passedCount - visiblePassed}/${totalCount - visibleTotal} passed`}
              </div>
            </div>
          </div>

          {/* Case selector dots */}
          <div style={{ display:"flex", gap:6, marginTop:10, flexWrap:"wrap" }}>
            {cases.map((c, i) => (
              <button key={i} onClick={() => setSelectedCase(i)}
                title={`Case ${i+1} (${c.isVisible ? 'visible' : 'hidden'}): ${c.passed ? 'Passed' : c.statusLabel}`}
                style={{
                  width:32, height:32, borderRadius:8, border:"none", cursor:"pointer", fontWeight:700, fontSize:12,
                  transition:"all .12s",
                  background: selectedCase === i
                    ? (c.passed ? "#3fb950" : "#f85149")
                    : (c.passed ? "rgba(63,185,80,.15)" : "rgba(248,81,73,.15)"),
                  color: selectedCase === i ? "#fff" : (c.passed ? "#3fb950" : "#f85149"),
                  outline: selectedCase === i ? `2px solid ${c.passed ? "#3fb950" : "#f85149"}` : "none",
                }}>
                {c.isVisible ? i+1 : "H"}
              </button>
            ))}
          </div>
        </div>

        {/* Detail panel for selected case */}
        {shownCase && (
          <div style={{ flex:1, overflowY:"auto", padding:14 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
              <span style={{ fontSize:12, fontWeight:700, color:"#8b949e" }}>
                Case {selectedCase + 1} {shownCase.isVisible ? "" : "(Hidden)"}
              </span>
              <span style={{ fontSize:11, fontWeight:800, padding:"2px 10px", borderRadius:20, background: shownCase.passed ? "rgba(63,185,80,.12)" : "rgba(248,81,73,.12)", color: shownCase.passed ? "#3fb950" : "#f85149", border:`1px solid ${shownCase.passed ? "rgba(63,185,80,.3)" : "rgba(248,81,73,.3)"}` }}>
                {shownCase.statusLabel}
              </span>
            </div>

            {shownCase.isVisible && shownCase.input !== null ? (
              <>
                <div style={{ marginBottom:10 }}>
                  <p style={{ fontSize:11, color:"#8b949e", marginBottom:4, textTransform:"uppercase", letterSpacing:"0.06em" }}>Input</p>
                  <pre style={{ background:"#0d1117", padding:"8px 12px", borderRadius:8, fontSize:12, color:"#a5d6ff", fontFamily:"monospace", overflow:"auto", border:"1px solid #21262d", margin:0 }}>{shownCase.input}</pre>
                </div>
                <div style={{ marginBottom:10 }}>
                  <p style={{ fontSize:11, color:"#8b949e", marginBottom:4, textTransform:"uppercase", letterSpacing:"0.06em" }}>Expected Output</p>
                  <pre style={{ background:"#0d1117", padding:"8px 12px", borderRadius:8, fontSize:12, color:"#7ee787", fontFamily:"monospace", overflow:"auto", border:"1px solid #21262d", margin:0 }}>{shownCase.expectedOutput}</pre>
                </div>
                <div style={{ marginBottom:10 }}>
                  <p style={{ fontSize:11, color:"#8b949e", marginBottom:4, textTransform:"uppercase", letterSpacing:"0.06em" }}>Your Output</p>
                  <pre style={{ background:"#0d1117", padding:"8px 12px", borderRadius:8, fontSize:12, color: shownCase.passed ? "#7ee787" : "#f85149", fontFamily:"monospace", overflow:"auto", border:`1px solid ${shownCase.passed ? "rgba(63,185,80,.2)" : "rgba(248,81,73,.2)"}`, margin:0 }}>
                    {shownCase.actualOutput || "(empty)"}
                  </pre>
                </div>
                {shownCase.error && (
                  <div style={{ marginBottom:10 }}>
                    <p style={{ fontSize:11, color:"#f85149", marginBottom:4, textTransform:"uppercase", letterSpacing:"0.06em" }}>Error</p>
                    <pre style={{ background:"#0d1117", padding:"8px 12px", borderRadius:8, fontSize:12, color:"#f85149", fontFamily:"monospace", overflow:"auto", border:"1px solid rgba(248,81,73,.2)", margin:0 }}>{shownCase.error}</pre>
                  </div>
                )}
                {shownCase.time && (
                  <p style={{ fontSize:11, color:"#8b949e", fontFamily:"monospace" }}>Runtime: {shownCase.time}s · Memory: {shownCase.memory}KB</p>
                )}
              </>
            ) : (
              <div style={{ padding:"16px", background: shownCase.passed ? "rgba(63,185,80,.06)" : "rgba(248,81,73,.06)", border:`1px solid ${shownCase.passed ? "rgba(63,185,80,.2)" : "rgba(248,81,73,.2)"}`, borderRadius:10 }}>
                <p style={{ fontSize:13, color: shownCase.passed ? "#3fb950" : "#f85149", fontWeight:600 }}>
                  {shownCase.passed ? "✓ Hidden test case passed." : "✗ Hidden test case failed."}
                </p>
                <p style={{ fontSize:12, color:"#8b949e", marginTop:6 }}>
                  {shownCase.error ? `Error: ${shownCase.error}` : "Input and expected output are hidden. Focus on correctness, not just visible cases."}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return null;
}

// ─────────────────────────────────────────────────────────────
// Main CodingWorkspace
// ─────────────────────────────────────────────────────────────
export default function CodingWorkspace({
  mode = "practice",
  question,
  examMeta,
  onSubmit,
  onSaveAndNext,
  isLastQuestion = false,
  isSaving       = false,
  violationCount = 0,
  onBack,
}) {
  const [lang, setLang]               = useState(LANGUAGES[0]);
  const [codes, setCodes]             = useState({});
  const [bottomTab, setBottomTab]     = useState(mode === "exam" ? "result" : "testcase");
  const [leftTab, setLeftTab]         = useState("description");
  const [testInput, setTestInput]     = useState("");
  const [runResult, setRunResult]     = useState(null);
  const [isRunning, setIsRunning]     = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showEscWarning, setShowEscWarning]   = useState(false);
  const [violations, setViolations]           = useState(violationCount);
  const [leftW, setLeftW]             = useState(42);
  const containerRef                  = useRef(null);
  const isDragging                    = useRef(false);

  const timer = useCountdown(examMeta?.duration ?? 3600, examMeta?.onTimerEnd);
  const codeKey = `${question?.id}_${lang.id}`;

  // Load boilerplate: from question.boilerplates[lang] → lang.default
  const code = codes[codeKey] ?? question?.boilerplates?.[lang.id] ?? lang.default;

  useEffect(() => {
    if (question?.testCases?.length > 0) setTestInput(question.testCases[0].input || "");
    setRunResult(null);
    setBottomTab(mode === "exam" ? "result" : "testcase");
  }, [question?.id, mode]);

  // Proctoring for exam mode
  useEffect(() => {
    if (mode !== "exam") return;
    const enterFS = async () => { try { await document.documentElement.requestFullscreen?.(); } catch {} };
    enterFS();
    const onFSChange = () => { if (!document.fullscreenElement) { setViolations(v => v+1); setShowEscWarning(true); } };
    const onVis      = () => { if (document.visibilityState === "hidden") setViolations(v => v+1); };
    const blockKey   = e => {
      if (e.key === "F12" || (e.ctrlKey && e.shiftKey && ["I","J","C"].includes(e.key)) || (e.ctrlKey && e.key === "u") || e.key === "Escape") {
        e.preventDefault(); if (e.key === "Escape") setShowEscWarning(true);
      }
    };
    const block = e => e.preventDefault();
    document.addEventListener("fullscreenchange", onFSChange);
    document.addEventListener("visibilitychange", onVis);
    document.addEventListener("keydown", blockKey);
    document.addEventListener("contextmenu", block);
    document.addEventListener("copy", block);
    document.addEventListener("cut", block);
    document.addEventListener("paste", block);
    return () => {
      document.removeEventListener("fullscreenchange", onFSChange);
      document.removeEventListener("visibilitychange", onVis);
      document.removeEventListener("keydown", blockKey);
      document.removeEventListener("contextmenu", block);
      document.removeEventListener("copy", block);
      document.removeEventListener("cut", block);
      document.removeEventListener("paste", block);
    };
  }, [mode]);

  useEffect(() => {
    if (mode === "exam" && violations >= 3) handleForceSubmit();
  }, [violations, mode]);

  const startDrag = e => {
    e.preventDefault(); isDragging.current = true;
    const onMove = ev => {
      if (!containerRef.current || !isDragging.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setLeftW(Math.max(25, Math.min(65, ((ev.clientX - rect.left) / rect.width) * 100)));
    };
    const onUp = () => { isDragging.current = false; window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
    window.addEventListener("mousemove", onMove); window.addEventListener("mouseup", onUp);
  };

  // Run button — raw execution with custom stdin
  const handleRun = async () => {
    if (!code.trim() || isRunning) return;
    setIsRunning(true); setBottomTab("result");
    setRunResult({ type: "run", status: { id: 2 } });
    try {
      const r = await executeCode(lang.id, code, testInput, question?.timeLimitMs || 2000);
      setRunResult({ type: "run", ...r });
    } catch (err) {
      setRunResult({ type: "run", status: { id: 13 }, stderr: err.message });
    }
    setIsRunning(false);
  };

  // Submit button — LeetCode-style wrapped test case execution
  const handleSubmit = async () => {
    setShowSubmitModal(false);
    setIsSubmitting(true); setBottomTab("result");
    setRunResult({ type: "running" });

    try {
      if (question?.methodName && question?.testCases?.length) {
        // Full LeetCode-style evaluation
        const tcResult = await runWithTestCases(lang.id, code, question);
        setRunResult({ type: "testcases", ...tcResult });
        await onSubmit?.(code, lang.id, tcResult.passedCount, tcResult);
      } else {
        // Fallback: raw run (no test cases / no methodName)
        const r = await executeCode(lang.id, code, testInput, question?.timeLimitMs || 2000);
        setRunResult({ type: "run", ...r });
        await onSubmit?.(code, lang.id, r.status?.id === 3 ? 1 : 0, null);
      }
    } catch (err) {
      setRunResult({ type: "run", status: { id: 13 }, stderr: err.message });
      await onSubmit?.(code, lang.id, 0, null);
    }
    setIsSubmitting(false);
  };

  const handleForceSubmit = async () => { setShowEscWarning(false); await onSubmit?.(code, lang.id, 0, null); };

  const diff      = question?.difficulty || "Medium";
  const diffStyle = DIFF[diff] || DIFF.Medium;
  const noMethodName = question?.type === 'CODING' && !question?.methodName;

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100vh", width:"100%", background:"#0d1117", color:"#e6edf3", fontFamily:"system-ui,sans-serif", overflow:"hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:6px;height:6px;}
        ::-webkit-scrollbar-track{background:#0d1117;}
        ::-webkit-scrollbar-thumb{background:#30363d;border-radius:3px;}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes slideIn{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
        textarea{-webkit-text-fill-color:transparent;caret-color:#58a6ff;}
      `}</style>

      {/* Header */}
      <header style={{ height:52, background:"#161b22", borderBottom:"1px solid #21262d", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 16px", flexShrink:0, gap:12 }}>
        <div style={{ display:"flex", alignItems:"center", gap:12, minWidth:0 }}>
          {mode !== "exam" && (
            <button onClick={onBack} style={{ background:"none", border:"1px solid #30363d", color:"#8b949e", cursor:"pointer", display:"flex", alignItems:"center", gap:6, fontSize:12, fontWeight:700, padding:"4px 10px", borderRadius:6, flexShrink:0 }}>
              ← Back
            </button>
          )}
          <span style={{ fontSize:14, fontWeight:700, color:"#e6edf3", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{question?.title || "Loading…"}</span>
          <span style={{ fontSize:11, fontWeight:700, padding:"2px 8px", borderRadius:10, background:diffStyle.bg, color:diffStyle.color, border:`1px solid ${diffStyle.border}`, flexShrink:0 }}>{diff}</span>
          {noMethodName && (
            <span style={{ fontSize:10, background:"rgba(239,68,68,.1)", color:"#f87171", border:"1px solid rgba(239,68,68,.25)", padding:"2px 8px", borderRadius:6, flexShrink:0 }}>
              ⚠ No methodName set — submit runs raw
            </span>
          )}
        </div>

        <div style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
          {mode === "exam" && (
            <>
              <div style={{ fontFamily:"monospace", fontSize:15, fontWeight:800, color: timer.urgent ? "#f85149" : "#58a6ff", padding:"4px 12px", background: timer.urgent ? "rgba(248,81,73,.1)" : "rgba(88,166,255,.08)", border:`1px solid ${timer.urgent ? "rgba(248,81,73,.3)" : "rgba(88,166,255,.2)"}`, borderRadius:8 }}>
                {String(timer.h).padStart(2,"0")}:{String(timer.m).padStart(2,"0")}:{String(timer.s).padStart(2,"0")}
              </div>
              {violations > 0 && (
                <span style={{ fontSize:11, fontWeight:700, padding:"3px 8px", borderRadius:6, background:"rgba(248,81,73,.15)", color:"#f85149", border:"1px solid rgba(248,81,73,.3)" }}>⚠ {violations}/3</span>
              )}
            </>
          )}
          <div style={{ position:"relative" }}>
            <select value={lang.id} onChange={e => setLang(LANGUAGES.find(l => l.id === e.target.value))}
              style={{ appearance:"none", background:"#21262d", border:"1px solid #30363d", borderRadius:6, padding:"5px 28px 5px 10px", color:"#e6edf3", fontSize:13, fontWeight:600, cursor:"pointer", outline:"none" }}>
              {LANGUAGES.map(l => <option key={l.id} value={l.id}>{l.icon} {l.label}</option>)}
            </select>
            <span style={{ position:"absolute", right:8, top:"50%", transform:"translateY(-50%)", color:"#8b949e", pointerEvents:"none", fontSize:10 }}>▼</span>
          </div>
          <button onClick={() => { const u={...codes}; u[codeKey]=question?.boilerplates?.[lang.id]??lang.default; setCodes(u); }}
            style={{ background:"none", border:"1px solid #30363d", borderRadius:5, padding:"4px 10px", color:"#8b949e", fontSize:12, cursor:"pointer" }}>↺ Reset</button>
          <button onClick={handleRun} disabled={isRunning||isSubmitting}
            style={{ padding:"6px 16px", borderRadius:6, background:"rgba(35,134,54,.15)", color:"#3fb950", border:"1px solid rgba(35,134,54,.3)", fontSize:13, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:6, opacity:isRunning?0.6:1 }}>
            {isRunning?<span style={{ width:12, height:12, border:"2px solid #3fb950", borderTopColor:"transparent", borderRadius:"50%", animation:"spin .7s linear infinite", display:"inline-block" }}/>:"▶"}
            {isRunning?"Running…":"Run"}
          </button>
          <button onClick={() => mode==="exam" ? setShowSubmitModal(true) : handleSubmit()} disabled={isSubmitting}
            style={{ padding:"6px 20px", borderRadius:6, background:"#f0883e", color:"#fff", border:"none", fontSize:13, fontWeight:800, cursor:"pointer", opacity:isSubmitting?0.7:1 }}>
            {isSubmitting?"Evaluating…":isLastQuestion?"Submit Exam":"Submit"}
          </button>
          {!isLastQuestion && mode==="exam" && (
            <button onClick={() => onSaveAndNext?.(code, lang.id)}
              style={{ padding:"6px 12px", borderRadius:6, background:"#21262d", color:"#8b949e", border:"1px solid #30363d", fontSize:12, fontWeight:700, cursor:"pointer" }}>
              Save & Next →
            </button>
          )}
        </div>
      </header>

      {/* Body */}
      <div ref={containerRef} style={{ flex:1, display:"flex", overflow:"hidden" }}>
        {/* Left: description */}
        <div style={{ width:`${leftW}%`, display:"flex", flexDirection:"column", borderRight:"1px solid #21262d", overflow:"hidden" }}>
          <div style={{ display:"flex", background:"#161b22", borderBottom:"1px solid #21262d", padding:"0 4px", flexShrink:0 }}>
            {["description","hints"].map(t => (
              <button key={t} onClick={() => setLeftTab(t)}
                style={{ padding:"10px 16px", background:"none", border:"none", borderBottom:`2px solid ${leftTab===t?"#f0883e":"transparent"}`, color:leftTab===t?"#e6edf3":"#8b949e", fontSize:13, fontWeight:leftTab===t?700:400, cursor:"pointer", textTransform:"capitalize" }}>
                {t}
              </button>
            ))}
          </div>
          <div style={{ flex:1, overflowY:"auto", padding:"20px 24px" }}>
            {leftTab === "description" ? (
              <div>
                <h2 style={{ fontSize:20, fontWeight:800, color:"#e6edf3", marginBottom:14, lineHeight:1.3 }}>{question?.title}</h2>
                <div style={{ display:"flex", gap:8, marginBottom:18, flexWrap:"wrap" }}>
                  <span style={{ fontSize:12, fontWeight:700, padding:"3px 10px", borderRadius:12, background:diffStyle.bg, color:diffStyle.color, border:`1px solid ${diffStyle.border}` }}>{diff}</span>
                  {question?.marks && <span style={{ fontSize:12, fontWeight:700, padding:"3px 10px", borderRadius:12, background:"rgba(88,166,255,.1)", color:"#58a6ff", border:"1px solid rgba(88,166,255,.2)" }}>{question.marks} pts</span>}
                  {question?.testCases?.length > 0 && <span style={{ fontSize:12, fontWeight:700, padding:"3px 10px", borderRadius:12, background:"rgba(63,185,80,.1)", color:"#3fb950", border:"1px solid rgba(63,185,80,.2)" }}>{question.testCases.length} test cases</span>}
                </div>
                <div style={{ fontSize:15, lineHeight:1.85, color:"#c9d1d9" }}
                  dangerouslySetInnerHTML={{ __html: question?.description || question?.question || "<p>No description.</p>" }} />
                {/* Show visible examples only */}
                {question?.testCases?.filter(tc => !tc.isHidden).slice(0,3).map((tc, i) => (
                  <div key={i} style={{ marginTop:22, background:"#161b22", border:"1px solid #21262d", borderRadius:10, overflow:"hidden" }}>
                    <div style={{ padding:"8px 14px", borderBottom:"1px solid #21262d", fontSize:12, fontWeight:700, color:"#8b949e" }}>Example {i+1}</div>
                    <div style={{ padding:14 }}>
                      <p style={{ fontSize:12, color:"#8b949e", marginBottom:4 }}>Input:</p>
                      <pre style={{ background:"#0d1117", padding:"8px 12px", borderRadius:6, fontSize:12, color:"#a5d6ff", fontFamily:"monospace", marginBottom:10, overflow:"auto" }}>{tc.input}</pre>
                      <p style={{ fontSize:12, color:"#8b949e", marginBottom:4 }}>Output:</p>
                      <pre style={{ background:"#0d1117", padding:"8px 12px", borderRadius:6, fontSize:12, color:"#7ee787", fontFamily:"monospace", overflow:"auto" }}>{tc.expectedOutput}</pre>
                    </div>
                  </div>
                ))}
                {question?.testCases?.filter(tc => tc.isHidden).length > 0 && (
                  <p style={{ fontSize:12, color:"#8b949e", marginTop:12, fontStyle:"italic" }}>
                    + {question.testCases.filter(tc => tc.isHidden).length} hidden test cases. Submit to run against all.
                  </p>
                )}
              </div>
            ) : (
              <div style={{ color:"#8b949e", fontSize:14, lineHeight:1.7 }}>
                <p style={{ color:"#e6edf3", fontWeight:700, marginBottom:12 }}>💡 Hints</p>
                {question?.hints ? <p>{question.hints}</p> : <p style={{ fontStyle:"italic" }}>No hints for this problem.</p>}
              </div>
            )}
          </div>
        </div>

        {/* Drag handle */}
        <div onMouseDown={startDrag} style={{ width:5, cursor:"col-resize", background:"#21262d", flexShrink:0, transition:"background .15s" }}
          onMouseEnter={e => e.currentTarget.style.background="#388bfd"}
          onMouseLeave={e => e.currentTarget.style.background="#21262d"} />

        {/* Right: editor + bottom panel */}
        <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
          <CodeEditor code={code} onChange={v => setCodes(p => ({...p, [codeKey]: v}))} langId={lang.id} />

          <div style={{ height:260, display:"flex", flexDirection:"column", borderTop:"1px solid #21262d", flexShrink:0 }}>
            <div style={{ display:"flex", alignItems:"center", background:"#161b22", borderBottom:"1px solid #21262d", padding:"0 8px", flexShrink:0 }}>
              {mode !== "exam" && (
                <button onClick={() => setBottomTab("testcase")}
                  style={{ padding:"8px 14px", background:"none", border:"none", borderBottom:`2px solid ${bottomTab==="testcase"?"#f0883e":"transparent"}`, color:bottomTab==="testcase"?"#e6edf3":"#8b949e", fontSize:12, fontWeight:bottomTab==="testcase"?700:400, cursor:"pointer" }}>
                  Custom Input
                </button>
              )}
              <button onClick={() => setBottomTab("result")}
                style={{ padding:"8px 14px", background:"none", border:"none", borderBottom:`2px solid ${bottomTab==="result"?"#f0883e":"transparent"}`, color:bottomTab==="result"?"#e6edf3":"#8b949e", fontSize:12, fontWeight:bottomTab==="result"?700:400, cursor:"pointer", display:"flex", alignItems:"center", gap:6 }}>
                Test Results
                {runResult?.type === "testcases" && (
                  <span style={{ width:7, height:7, borderRadius:"50%", background: runResult.allPassed ? "#3fb950" : "#f85149", display:"inline-block" }} />
                )}
              </button>
            </div>
            <div style={{ flex:1, overflow:"hidden" }}>
              {bottomTab === "testcase" && mode !== "exam" ? (
                <div style={{ display:"flex", flexDirection:"column", gap:8, height:"100%", padding:14 }}>
                  <label style={{ fontSize:12, fontWeight:700, color:"#8b949e", textTransform:"uppercase", letterSpacing:"0.06em" }}>Custom stdin (for Run button only)</label>
                  <textarea value={testInput} onChange={e => setTestInput(e.target.value)}
                    style={{ flex:1, background:"#21262d", border:"1px solid #30363d", borderRadius:6, padding:10, color:"#e6edf3", fontSize:13, fontFamily:"monospace", resize:"none", outline:"none" }} />
                </div>
              ) : (
                <TestResultPanel result={runResult} isRunning={isRunning || isSubmitting} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Submit confirm modal */}
      {showSubmitModal && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.8)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000, animation:"slideIn .2s ease" }}>
          <div style={{ background:"#161b22", border:"1px solid #30363d", borderRadius:16, padding:36, maxWidth:440, width:"90%", textAlign:"center" }}>
            <div style={{ fontSize:42, marginBottom:16 }}>📋</div>
            <h3 style={{ fontSize:20, fontWeight:800, color:"#e6edf3", marginBottom:10 }}>Submit Solution?</h3>
            <p style={{ fontSize:14, color:"#8b949e", lineHeight:1.6, marginBottom:24 }}>
              Your code will be evaluated against all test cases, including hidden ones.{isLastQuestion && " This will end your exam."}
            </p>
            <div style={{ display:"flex", gap:12, justifyContent:"center" }}>
              <button onClick={() => setShowSubmitModal(false)}
                style={{ padding:"10px 24px", borderRadius:8, background:"#21262d", border:"1px solid #30363d", color:"#8b949e", fontSize:14, fontWeight:700, cursor:"pointer" }}>Cancel</button>
              <button onClick={handleSubmit}
                style={{ padding:"10px 24px", borderRadius:8, background:"#f0883e", border:"none", color:"#fff", fontSize:14, fontWeight:800, cursor:"pointer" }}>
                {isLastQuestion ? "Submit Exam" : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Proctoring warning */}
      {showEscWarning && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.9)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:2000 }}>
          <div style={{ background:"#161b22", border:"2px solid rgba(248,81,73,.5)", borderRadius:16, padding:40, maxWidth:460, width:"90%", textAlign:"center" }}>
            <div style={{ fontSize:50, marginBottom:16 }}>🚨</div>
            <h3 style={{ fontSize:22, fontWeight:800, color:"#f85149", marginBottom:12 }}>Proctoring Violation!</h3>
            <p style={{ fontSize:14, color:"#c9d1d9", lineHeight:1.7, marginBottom:24 }}>
              Violations: <strong style={{ color:"#f85149" }}>{violations}/3</strong> — At 3 your exam auto-submits.
            </p>
            <div style={{ display:"flex", gap:12, justifyContent:"center" }}>
              <button onClick={handleForceSubmit} style={{ padding:"10px 20px", borderRadius:8, background:"#f85149", border:"none", color:"#fff", fontSize:14, fontWeight:700, cursor:"pointer" }}>Submit Now</button>
              <button onClick={async () => { setShowEscWarning(false); try { await document.documentElement.requestFullscreen?.(); } catch {} }}
                style={{ padding:"10px 20px", borderRadius:8, background:"#21262d", border:"1px solid #388bfd", color:"#58a6ff", fontSize:14, fontWeight:700, cursor:"pointer" }}>
                Return to Exam
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}