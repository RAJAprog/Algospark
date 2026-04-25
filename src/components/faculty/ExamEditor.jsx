
// import React, { useState, useEffect, useMemo } from "react";
// import { getAllQuestions } from "../../api/examService";

// const TABS = [
//   { id: "Coding",       label: "Coding" },
//   { id: "Tech MCQs",    label: "MCQs" },
//   { id: "Non-Tech MCQs",label: "Non-Tech MCQs" }
// ];

// function buildDateTime(date, hour, minute, ampm) {
//   if (!date) return null;
//   let h = parseInt(hour);
//   if (ampm === "PM" && h !== 12) h += 12;
//   if (ampm === "AM" && h === 12) h = 0;
//   const [y, m, d] = date.split("-").map(Number);
//   return new Date(y, m - 1, d, h, parseInt(minute), 0);
// }

// function DateTimePicker({ label, date, setDate, hour, setHour, minute, setMinute, ampm, setAmpm }) {
//   const hours   = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"));
//   const minutes = ["00","05","10","15","20","25","30","35","40","45","50","55"];
//   const inp = {
//     background: "#0d1117", border: "1px solid #30363d", borderRadius: 8,
//     padding: "8px 12px", color: "#e6edf3", fontSize: 13, outline: "none", cursor: "pointer",
//   };
//   return (
//     <div>
//       <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#8b949e", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>
//         {label}
//       </label>
//       <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
//         <input type="date" value={date} onChange={e => setDate(e.target.value)} style={{ ...inp, flex: "1 1 140px" }} />
//         <select value={hour} onChange={e => setHour(e.target.value)} style={{ ...inp, minWidth: 60 }}>
//           {hours.map(h => <option key={h} value={h}>{h}</option>)}
//         </select>
//         <select value={minute} onChange={e => setMinute(e.target.value)} style={{ ...inp, minWidth: 60 }}>
//           {minutes.map(m => <option key={m} value={m}>{m}</option>)}
//         </select>
//         <select value={ampm} onChange={e => setAmpm(e.target.value)} style={{ ...inp, minWidth: 70 }}>
//           <option value="AM">AM</option>
//           <option value="PM">PM</option>
//         </select>
//       </div>
//     </div>
//   );
// }

// const ExamEditor = ({ onSubmit, categories = [], initialData = {} }) => {
//   const [title,               setTitle]               = useState(initialData.title || "");
//   const [durationInMinutes,   setDurationInMinutes]   = useState(initialData.durationInMinutes || 90);
//   const [allQuestions,        setAllQuestions]        = useState([]);
//   const [isLoading,           setIsLoading]           = useState(true);
//   const [isSubmitting,        setIsSubmitting]        = useState(false);
//   const [activeTab,           setActiveTab]           = useState(TABS[0].id);
//   const [selectedQuestionIds, setSelectedIds]         = useState(initialData.questionIds || []);

//   // NEW: Exam type state
//   const [examType, setExamType] = useState(initialData.examType || "EXAM");

//   // NEW: Topic selection states
//   const [selectedTopic, setSelectedTopic] = useState(null);
//   const [topics, setTopics] = useState([]);

//   const [startDate,   setStartDate]   = useState("");
//   const [startHour,   setStartHour]   = useState("09");
//   const [startMin,    setStartMin]    = useState("00");
//   const [startAmpm,   setStartAmpm]   = useState("AM");
//   const [endDate,     setEndDate]     = useState("");
//   const [endHour,     setEndHour]     = useState("10");
//   const [endMin,      setEndMin]      = useState("00");
//   const [endAmpm,     setEndAmpm]     = useState("AM");

//   useEffect(() => {
//     if (initialData.scheduledStartTime) {
//       const d = initialData.scheduledStartTime?.toDate?.() ?? new Date(initialData.scheduledStartTime);
//       const y = d.getFullYear(), mo = String(d.getMonth()+1).padStart(2,"0"), day = String(d.getDate()).padStart(2,"0");
//       setStartDate(`${y}-${mo}-${day}`);
//       let h = d.getHours();
//       const a = h >= 12 ? "PM" : "AM";
//       h = h % 12 || 12;
//       setStartHour(String(h).padStart(2,"0"));
//       setStartMin(String(d.getMinutes()).padStart(2,"0"));
//       setStartAmpm(a);
//     }
//     if (initialData.scheduledEndTime) {
//       const d = initialData.scheduledEndTime?.toDate?.() ?? new Date(initialData.scheduledEndTime);
//       const y = d.getFullYear(), mo = String(d.getMonth()+1).padStart(2,"0"), day = String(d.getDate()).padStart(2,"0");
//       setEndDate(`${y}-${mo}-${day}`);
//       let h = d.getHours();
//       const a = h >= 12 ? "PM" : "AM";
//       h = h % 12 || 12;
//       setEndHour(String(h).padStart(2,"0"));
//       setEndMin(String(d.getMinutes()).padStart(2,"0"));
//       setEndAmpm(a);
//     }
//   }, []);

//   useEffect(() => {
//     getAllQuestions()
//       .then(q => setAllQuestions(q || []))
//       .catch(() => alert("Could not load questions."))
//       .finally(() => setIsLoading(false));
//   }, []);

//   // Extract topics when tab changes
//   useEffect(() => {
//     const filtered = allQuestions.filter(q => {
//       const cat = q.moduleType || (q.type === "CODING" || q.type === "Coding" ? "Coding" : "Tech MCQs");
//       return cat === activeTab;
//     });
//     const uniqueTopics = [...new Set(filtered.map(q => q.category || "Uncategorized").filter(Boolean))];
//     setTopics(uniqueTopics.sort());
//     setSelectedTopic(null);
//   }, [activeTab, allQuestions]);

//   const handleQuestionSelect = (id) =>
//     setSelectedIds(prev => prev.includes(id) ? prev.filter(q => q !== id) : [...prev, id]);

//   const handleBackToTopics = () => setSelectedTopic(null);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!selectedQuestionIds.length) return alert("Select at least one question.");
//     const sdt = buildDateTime(startDate, startHour, startMin, startAmpm);
//     const edt = buildDateTime(endDate,   endHour,   endMin,   endAmpm);
//     if (!sdt) return alert("Please set a valid start date/time.");
//     if (!edt) return alert("Please set a valid end date/time.");
//     if (sdt >= edt) return alert("Start time must be before end time.");

//     setIsSubmitting(true);
//     await onSubmit({
//       title,
//       durationInMinutes,
//       scheduledStartTime: sdt,
//       scheduledEndTime:   edt,
//       questionIds:        selectedQuestionIds,
//       examType,
//     });
//     setIsSubmitting(false);
//   };

//   const selectionSummary = useMemo(() => {
//     const s = { Coding: 0, "Tech MCQs": 0, "Non-Tech MCQs": 0 };
//     selectedQuestionIds.forEach(id => {
//       const q = allQuestions.find(q => q.id === id);
//       if (q) {
//         const cat = q.moduleType || (q.type === "CODING" || q.type === "Coding" ? "Coding" : "Tech MCQs");
//         s[cat] !== undefined ? s[cat]++ : s["Tech MCQs"]++;
//       }
//     });
//     return s;
//   }, [selectedQuestionIds, allQuestions]);

//   const visibleQuestions = useMemo(() => {
//     if (!selectedTopic) return [];
//     return allQuestions.filter(q => {
//       const cat = q.moduleType || (q.type === "CODING" || q.type === "Coding" ? "Coding" : "Tech MCQs");
//       const topic = q.category || "Uncategorized";
//       return cat === activeTab && topic === selectedTopic;
//     });
//   }, [allQuestions, activeTab, selectedTopic]);

//   const inp = {
//     width: "100%", background: "#0d1117", border: "1px solid #30363d", borderRadius: 8,
//     padding: "9px 14px", color: "#e6edf3", fontSize: 13, outline: "none",
//   };
//   const labelStyle = {
//     display: "block", fontSize: 12, fontWeight: 700, color: "#8b949e",
//     marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em"
//   };

//   return (
//     <form onSubmit={handleSubmit} style={{ background: "#161b22", padding: 32, borderRadius: 16, border: "1px solid #21262d" }}>
//       <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
//       <h2 style={{ fontSize: 20, fontWeight: 800, color: "#e6edf3", marginBottom: 24 }}>
//         🗒️ Configure Examination
//       </h2>

//       {/* Basic Info */}
//       <div style={{ display: "grid", gridTemplateColumns: "1fr 180px", gap: 16, marginBottom: 20 }}>
//         <div>
//           <label style={labelStyle}>Exam Title</label>
//           <input style={inp} type="text" value={title} onChange={e => setTitle(e.target.value)} required placeholder="e.g., Python Mid-Term 2026" />
//         </div>
//         <div>
//           <label style={labelStyle}>Duration (Minutes)</label>
//           <input style={inp} type="number" value={durationInMinutes} onChange={e => setDurationInMinutes(Number(e.target.value))} required min={5} max={480} />
//         </div>
//       </div>

//       {/* Time pickers */}
//       <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
//         <DateTimePicker label="Scheduled Start" date={startDate} setDate={setStartDate} hour={startHour} setHour={setStartHour} minute={startMin} setMinute={setStartMin} ampm={startAmpm} setAmpm={setStartAmpm} />
//         <DateTimePicker label="Window Closes At" date={endDate} setDate={setEndDate} hour={endHour} setHour={setEndHour} minute={endMin} setMinute={setEndMin} ampm={endAmpm} setAmpm={setEndAmpm} />
//       </div>

//       {/* NEW: Exam Category Selection — replaces Assign to Colleges + Public toggle */}
//       <div style={{ marginBottom: 24 }}>
//         <label style={labelStyle}>Exam Category</label>
//         <div style={{
//           display: "flex", gap: 12, background: "#0d1117",
//           padding: 6, borderRadius: 10, border: "1px solid #21262d", width: "fit-content"
//         }}>
//           {['DAILY', 'WEEKLY', 'EXAM'].map(type => (
//             <button
//               key={type}
//               type="button"
//               onClick={() => setExamType(type)}
//               style={{
//                 padding: "10px 24px", borderRadius: 8, border: "none", cursor: "pointer",
//                 fontSize: 13, fontWeight: 800, letterSpacing: "0.04em",
//                 background: examType === type
//                   ? type === 'DAILY'
//                     ? "linear-gradient(135deg, #3fb950, #10b981)"
//                     : type === 'WEEKLY'
//                       ? "linear-gradient(135deg, #58a6ff, #2196f3)"
//                       : "linear-gradient(135deg, #f0883e, #f97316)"
//                   : "transparent",
//                 color: examType === type ? "#fff" : "#8b949e",
//                 transition: "all .2s",
//               }}
//             >
//               {type === 'DAILY' && '📅 '}{type === 'WEEKLY' && '📊 '}{type === 'EXAM' && '🎓 '}{type}
//             </button>
//           ))}
//         </div>
//         <p style={{ fontSize: 11, color: "#8b949e", marginTop: 8, fontStyle: "italic" }}>
//           {examType === 'DAILY' && 'Daily practice assessments for students'}
//           {examType === 'WEEKLY' && 'Weekly assessments with detailed tracking'}
//           {examType === 'EXAM' && 'Main examination mode'}
//         </p>
//       </div>

//       {/* Question Bank */}
//       <div style={{ borderTop: "1px solid #21262d", paddingTop: 24 }}>
//         <h3 style={{ fontSize: 16, fontWeight: 700, color: "#e6edf3", marginBottom: 16 }}>Question Bank Selection</h3>

//         {/* Tabs */}
//         <div style={{ display: "flex", gap: 6, marginBottom: 16, background: "#0d1117", padding: 4, borderRadius: 8, width: "fit-content", border: "1px solid #21262d" }}>
//           {TABS.map(tab => (
//             <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)}
//               style={{ padding: "6px 16px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 700, background: activeTab === tab.id ? "#58a6ff" : "transparent", color: activeTab === tab.id ? "#fff" : "#8b949e", transition: "all .15s" }}>
//               {tab.label}
//             </button>
//           ))}
//         </div>

//         {/* Topic Selection or Question List */}
//         <div style={{ background: "#0d1117", border: "1px solid #21262d", borderRadius: 10, height: 320, overflowY: "auto", padding: 8 }}>
//           {isLoading ? (
//             <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", gap: 12, color: "#58a6ff" }}>
//               <div style={{ width: 24, height: 24, border: "3px solid #58a6ff", borderTopColor: "transparent", borderRadius: "50%", animation: "spin .8s linear infinite" }} />
//               Loading Question Bank...
//             </div>
//           ) : !selectedTopic ? (
//             topics.length === 0 ? (
//               <div style={{ textAlign: "center", padding: "3rem", color: "#8b949e", fontSize: 13 }}>No topics in this category.</div>
//             ) : (
//               <div>
//                 <div style={{ marginBottom: 12, padding: "8px 12px", background: "#161b22", borderRadius: 8, border: "1px solid #21262d" }}>
//                   <p style={{ fontSize: 11, fontWeight: 700, color: "#8b949e", margin: 0, letterSpacing: "0.08em", textTransform: "uppercase" }}>
//                     Select a Topic
//                   </p>
//                 </div>
//                 <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
//                   {topics.map(topic => {
//                     const topicQuestions = allQuestions.filter(q => {
//                       const cat = q.moduleType || (q.type === "CODING" || q.type === "Coding" ? "Coding" : "Tech MCQs");
//                       return cat === activeTab && (q.category || "Uncategorized") === topic;
//                     });
//                     const selectedInTopic = topicQuestions.filter(q => selectedQuestionIds.includes(q.id)).length;
//                     return (
//                       <div key={topic} onClick={() => setSelectedTopic(topic)}
//                         style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", borderRadius: 8, border: "1px solid #21262d", background: "#161b22", cursor: "pointer", transition: "all .1s" }}
//                         onMouseEnter={e => e.currentTarget.style.borderColor = "#58a6ff"}
//                         onMouseLeave={e => e.currentTarget.style.borderColor = "#21262d"}>
//                         <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
//                           <span style={{ fontSize: 18 }}>📁</span>
//                           <div>
//                             <span style={{ fontSize: 14, fontWeight: 600, color: "#e6edf3", display: "block" }}>{topic}</span>
//                             <span style={{ fontSize: 11, color: "#8b949e" }}>{topicQuestions.length} questions</span>
//                           </div>
//                         </div>
//                         {selectedInTopic > 0 && (
//                           <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 4, background: "rgba(88,166,255,.15)", color: "#58a6ff", border: "1px solid rgba(88,166,255,.3)" }}>
//                             {selectedInTopic} selected
//                           </span>
//                         )}
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>
//             )
//           ) : (
//             <div>
//               <div style={{ marginBottom: 12, padding: "8px 12px", background: "#161b22", borderRadius: 8, border: "1px solid #21262d", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//                 <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
//                   <button type="button" onClick={handleBackToTopics}
//                     style={{ padding: "4px 12px", borderRadius: 6, fontSize: 11, fontWeight: 700, border: "none", cursor: "pointer", background: "#58a6ff", color: "#fff" }}>
//                     ← Back
//                   </button>
//                   <p style={{ fontSize: 11, fontWeight: 700, color: "#e6edf3", margin: 0 }}>{selectedTopic}</p>
//                 </div>
//                 <p style={{ fontSize: 11, color: "#8b949e", margin: 0 }}>{visibleQuestions.length} questions</p>
//               </div>
//               {visibleQuestions.length === 0 ? (
//                 <div style={{ textAlign: "center", padding: "3rem", color: "#8b949e", fontSize: 13 }}>No questions in this topic.</div>
//               ) : (
//                 <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
//                   {visibleQuestions.map(q => {
//                     const isSelected = selectedQuestionIds.includes(q.id);
//                     return (
//                       <div key={q.id} onClick={() => handleQuestionSelect(q.id)}
//                         style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 14px", borderRadius: 8, border: `1px solid ${isSelected ? "rgba(88,166,255,0.4)" : "#21262d"}`, background: isSelected ? "rgba(88,166,255,0.06)" : "#161b22", cursor: "pointer", transition: "all .1s" }}>
//                         <input type="checkbox" checked={isSelected} onChange={() => {}}
//                           style={{ width: 16, height: 16, marginTop: 2, flexShrink: 0, cursor: "pointer", accentColor: "#58a6ff" }} />
//                         <div style={{ flex: 1 }}>
//                           <span style={{ fontSize: 14, fontWeight: 600, color: isSelected ? "#58a6ff" : "#e6edf3", display: "block", marginBottom: 6 }}>
//                             {q.title || q.question || "Untitled Question"}
//                           </span>
//                           <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
//                             {q.type && (
//                               <span style={{ fontSize: 10, fontWeight: 700, padding: "1px 6px", borderRadius: 4, background: q.type === "MCQ" ? "rgba(255,161,22,.15)" : "rgba(88,166,255,.15)", color: q.type === "MCQ" ? "#ffa116" : "#58a6ff", border: q.type === "MCQ" ? "1px solid rgba(255,161,22,.3)" : "1px solid rgba(88,166,255,.3)" }}>
//                                 {q.type}
//                               </span>
//                             )}
//                             {q.difficulty && (
//                               <span style={{ fontSize: 10, fontWeight: 700, padding: "1px 6px", borderRadius: 4, background: q.difficulty === "Easy" ? "rgba(63,185,80,.1)" : q.difficulty === "Hard" ? "rgba(248,81,73,.1)" : "rgba(240,136,62,.1)", color: q.difficulty === "Easy" ? "#3fb950" : q.difficulty === "Hard" ? "#f85149" : "#f0883e" }}>
//                                 {q.difficulty}
//                               </span>
//                             )}
//                             {q.marks && <span style={{ fontSize: 10, color: "#8b949e", padding: "1px 6px", borderRadius: 4, background: "#21262d" }}>{q.marks} pts</span>}
//                           </div>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               )}
//             </div>
//           )}
//         </div>

//         {/* Summary */}
//         <div style={{ marginTop: 16, background: "#0d1117", border: "1px solid #21262d", borderRadius: 12, padding: 20 }}>
//           <p style={{ fontSize: 11, fontWeight: 700, color: "#8b949e", marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.08em" }}>Selection Summary</p>
//           <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
//             {[
//               { label: "Coding",    val: selectionSummary["Coding"],        color: "#58a6ff" },
//               { label: "Tech MCQs", val: selectionSummary["Tech MCQs"],     color: "#3fb950" },
//               { label: "Non-Tech",  val: selectionSummary["Non-Tech MCQs"], color: "#f0883e" },
//             ].map(({ label, val, color }) => (
//               <div key={label} style={{ background: "#161b22", border: "1px solid #21262d", borderRadius: 8, padding: "14px", textAlign: "center" }}>
//                 <div style={{ fontSize: 28, fontWeight: 800, color }}>{val}</div>
//                 <div style={{ fontSize: 10, color: "#8b949e", marginTop: 4, textTransform: "uppercase", fontWeight: 700 }}>{label}</div>
//               </div>
//             ))}
//           </div>
//           <div style={{ marginTop: 12, fontSize: 13, color: "#8b949e", textAlign: "center" }}>
//             Total selected: <strong style={{ color: "#e6edf3" }}>{selectedQuestionIds.length}</strong> questions
//           </div>
//         </div>
//       </div>

//       <button type="submit" disabled={isSubmitting || isLoading || !selectedQuestionIds.length}
//         style={{ width: "100%", marginTop: 24, padding: "14px", borderRadius: 10, border: "none", background: selectedQuestionIds.length ? "linear-gradient(135deg, #58a6ff, #7c3aed)" : "#21262d", color: selectedQuestionIds.length ? "#fff" : "#8b949e", fontSize: 14, fontWeight: 800, cursor: selectedQuestionIds.length ? "pointer" : "not-allowed", opacity: isSubmitting ? 0.7 : 1, letterSpacing: "0.04em" }}>
//         {isSubmitting ? "⏳ Publishing..." : `🚀 Publish Exam (${selectedQuestionIds.length} questions)`}
//       </button>
//     </form>
//   );
// };

// export default ExamEditor;
























import React, { useState, useEffect, useMemo } from "react";
import { getAllQuestions } from "../../api/examService";

const TABS = [
  { id: "Coding",       label: "Coding" },
  { id: "Tech MCQs",    label: "MCQs" },
  { id: "Non-Tech MCQs",label: "Non-Tech MCQs" }
];

function buildDateTime(date, hour, minute, ampm) {
  if (!date) return null;
  let h = parseInt(hour);
  if (ampm === "PM" && h !== 12) h += 12;
  if (ampm === "AM" && h === 12) h = 0;
  const [y, m, d] = date.split("-").map(Number);
  return new Date(y, m - 1, d, h, parseInt(minute), 0);
}

function DateTimePicker({ label, date, setDate, hour, setHour, minute, setMinute, ampm, setAmpm }) {
  const hours   = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"));
  const minutes = ["00","05","10","15","20","25","30","35","40","45","50","55"];
  const inp = {
    background: "#0d1117", border: "1px solid #30363d", borderRadius: 8,
    padding: "8px 12px", color: "#e6edf3", fontSize: 13, outline: "none", cursor: "pointer",
  };
  return (
    <div>
      <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#8b949e", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>
        {label}
      </label>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} style={{ ...inp, flex: "1 1 140px" }} />
        <select value={hour} onChange={e => setHour(e.target.value)} style={{ ...inp, minWidth: 60 }}>
          {hours.map(h => <option key={h} value={h}>{h}</option>)}
        </select>
        <select value={minute} onChange={e => setMinute(e.target.value)} style={{ ...inp, minWidth: 60 }}>
          {minutes.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
        <select value={ampm} onChange={e => setAmpm(e.target.value)} style={{ ...inp, minWidth: 70 }}>
          <option value="AM">AM</option>
          <option value="PM">PM</option>
        </select>
      </div>
    </div>
  );
}

const ExamEditor = ({ onSubmit, categories = [], initialData = {} }) => {
  const [title,               setTitle]               = useState(initialData.title || "");
  // ── FIX: read initialData.durationMinutes first, fall back to durationInMinutes for old docs ──
  const [durationInMinutes,   setDurationInMinutes]   = useState(
    initialData.durationMinutes ?? initialData.durationInMinutes ?? 90
  );
  const [allQuestions,        setAllQuestions]        = useState([]);
  const [isLoading,           setIsLoading]           = useState(true);
  const [isSubmitting,        setIsSubmitting]        = useState(false);
  const [activeTab,           setActiveTab]           = useState(TABS[0].id);
  const [selectedQuestionIds, setSelectedIds]         = useState(initialData.questionIds || []);

  const [examType, setExamType] = useState(initialData.examType || "EXAM");

  const [selectedTopic, setSelectedTopic] = useState(null);
  const [topics, setTopics] = useState([]);

  const [startDate,   setStartDate]   = useState("");
  const [startHour,   setStartHour]   = useState("09");
  const [startMin,    setStartMin]    = useState("00");
  const [startAmpm,   setStartAmpm]   = useState("AM");
  const [endDate,     setEndDate]     = useState("");
  const [endHour,     setEndHour]     = useState("10");
  const [endMin,      setEndMin]      = useState("00");
  const [endAmpm,     setEndAmpm]     = useState("AM");

  useEffect(() => {
    if (initialData.scheduledStartTime) {
      const d = initialData.scheduledStartTime?.toDate?.() ?? new Date(initialData.scheduledStartTime);
      const y = d.getFullYear(), mo = String(d.getMonth()+1).padStart(2,"0"), day = String(d.getDate()).padStart(2,"0");
      setStartDate(`${y}-${mo}-${day}`);
      let h = d.getHours();
      const a = h >= 12 ? "PM" : "AM";
      h = h % 12 || 12;
      setStartHour(String(h).padStart(2,"0"));
      setStartMin(String(d.getMinutes()).padStart(2,"0"));
      setStartAmpm(a);
    }
    if (initialData.scheduledEndTime) {
      const d = initialData.scheduledEndTime?.toDate?.() ?? new Date(initialData.scheduledEndTime);
      const y = d.getFullYear(), mo = String(d.getMonth()+1).padStart(2,"0"), day = String(d.getDate()).padStart(2,"0");
      setEndDate(`${y}-${mo}-${day}`);
      let h = d.getHours();
      const a = h >= 12 ? "PM" : "AM";
      h = h % 12 || 12;
      setEndHour(String(h).padStart(2,"0"));
      setEndMin(String(d.getMinutes()).padStart(2,"0"));
      setEndAmpm(a);
    }
  }, []);

  useEffect(() => {
    getAllQuestions()
      .then(q => setAllQuestions(q || []))
      .catch(() => alert("Could not load questions."))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    const filtered = allQuestions.filter(q => {
      const cat = q.moduleType || (q.type === "CODING" || q.type === "Coding" ? "Coding" : "Tech MCQs");
      return cat === activeTab;
    });
    const uniqueTopics = [...new Set(filtered.map(q => q.category || "Uncategorized").filter(Boolean))];
    setTopics(uniqueTopics.sort());
    setSelectedTopic(null);
  }, [activeTab, allQuestions]);

  const handleQuestionSelect = (id) =>
    setSelectedIds(prev => prev.includes(id) ? prev.filter(q => q !== id) : [...prev, id]);

  const handleBackToTopics = () => setSelectedTopic(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedQuestionIds.length) return alert("Select at least one question.");
    const sdt = buildDateTime(startDate, startHour, startMin, startAmpm);
    const edt = buildDateTime(endDate,   endHour,   endMin,   endAmpm);
    if (!sdt) return alert("Please set a valid start date/time.");
    if (!edt) return alert("Please set a valid end date/time.");
    if (sdt >= edt) return alert("Start time must be before end time.");

    setIsSubmitting(true);
    await onSubmit({
      title,
      // ── FIX: key is now "durationMinutes" to match what ExamPage reads ──
      durationMinutes:      Number(durationInMinutes),
      scheduledStartTime:   sdt,
      scheduledEndTime:     edt,
      questionIds:          selectedQuestionIds,
      examType,
    });
    setIsSubmitting(false);
  };

  const selectionSummary = useMemo(() => {
    const s = { Coding: 0, "Tech MCQs": 0, "Non-Tech MCQs": 0 };
    selectedQuestionIds.forEach(id => {
      const q = allQuestions.find(q => q.id === id);
      if (q) {
        const cat = q.moduleType || (q.type === "CODING" || q.type === "Coding" ? "Coding" : "Tech MCQs");
        s[cat] !== undefined ? s[cat]++ : s["Tech MCQs"]++;
      }
    });
    return s;
  }, [selectedQuestionIds, allQuestions]);

  const visibleQuestions = useMemo(() => {
    if (!selectedTopic) return [];
    return allQuestions.filter(q => {
      const cat = q.moduleType || (q.type === "CODING" || q.type === "Coding" ? "Coding" : "Tech MCQs");
      const topic = q.category || "Uncategorized";
      return cat === activeTab && topic === selectedTopic;
    });
  }, [allQuestions, activeTab, selectedTopic]);

  const inp = {
    width: "100%", background: "#0d1117", border: "1px solid #30363d", borderRadius: 8,
    padding: "9px 14px", color: "#e6edf3", fontSize: 13, outline: "none",
  };
  const labelStyle = {
    display: "block", fontSize: 12, fontWeight: 700, color: "#8b949e",
    marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em"
  };

  return (
    <form onSubmit={handleSubmit} style={{ background: "#161b22", padding: 32, borderRadius: 16, border: "1px solid #21262d" }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <h2 style={{ fontSize: 20, fontWeight: 800, color: "#e6edf3", marginBottom: 24 }}>
        🗒️ Configure Examination
      </h2>

      {/* Basic Info */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 180px", gap: 16, marginBottom: 20 }}>
        <div>
          <label style={labelStyle}>Exam Title</label>
          <input style={inp} type="text" value={title} onChange={e => setTitle(e.target.value)} required placeholder="e.g., Python Mid-Term 2026" />
        </div>
        <div>
          <label style={labelStyle}>Duration (Minutes)</label>
          <input style={inp} type="number" value={durationInMinutes} onChange={e => setDurationInMinutes(Number(e.target.value))} required min={5} max={480} />
        </div>
      </div>

      {/* Time pickers */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
        <DateTimePicker label="Scheduled Start" date={startDate} setDate={setStartDate} hour={startHour} setHour={setStartHour} minute={startMin} setMinute={setStartMin} ampm={startAmpm} setAmpm={setStartAmpm} />
        <DateTimePicker label="Window Closes At" date={endDate} setDate={setEndDate} hour={endHour} setHour={setEndHour} minute={endMin} setMinute={setEndMin} ampm={endAmpm} setAmpm={setEndAmpm} />
      </div>

      {/* Exam Category */}
      <div style={{ marginBottom: 24 }}>
        <label style={labelStyle}>Exam Category</label>
        <div style={{
          display: "flex", gap: 12, background: "#0d1117",
          padding: 6, borderRadius: 10, border: "1px solid #21262d", width: "fit-content"
        }}>
          {['DAILY', 'WEEKLY', 'EXAM'].map(type => (
            <button
              key={type}
              type="button"
              onClick={() => setExamType(type)}
              style={{
                padding: "10px 24px", borderRadius: 8, border: "none", cursor: "pointer",
                fontSize: 13, fontWeight: 800, letterSpacing: "0.04em",
                background: examType === type
                  ? type === 'DAILY'
                    ? "linear-gradient(135deg, #3fb950, #10b981)"
                    : type === 'WEEKLY'
                      ? "linear-gradient(135deg, #58a6ff, #2196f3)"
                      : "linear-gradient(135deg, #f0883e, #f97316)"
                  : "transparent",
                color: examType === type ? "#fff" : "#8b949e",
                transition: "all .2s",
              }}
            >
              {type === 'DAILY' && '📅 '}{type === 'WEEKLY' && '📊 '}{type === 'EXAM' && '🎓 '}{type}
            </button>
          ))}
        </div>
        <p style={{ fontSize: 11, color: "#8b949e", marginTop: 8, fontStyle: "italic" }}>
          {examType === 'DAILY' && 'Daily practice assessments for students'}
          {examType === 'WEEKLY' && 'Weekly assessments with detailed tracking'}
          {examType === 'EXAM' && 'Main examination mode'}
        </p>
      </div>

      {/* Question Bank */}
      <div style={{ borderTop: "1px solid #21262d", paddingTop: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: "#e6edf3", marginBottom: 16 }}>Question Bank Selection</h3>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 6, marginBottom: 16, background: "#0d1117", padding: 4, borderRadius: 8, width: "fit-content", border: "1px solid #21262d" }}>
          {TABS.map(tab => (
            <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)}
              style={{ padding: "6px 16px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 700, background: activeTab === tab.id ? "#58a6ff" : "transparent", color: activeTab === tab.id ? "#fff" : "#8b949e", transition: "all .15s" }}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Topic Selection or Question List */}
        <div style={{ background: "#0d1117", border: "1px solid #21262d", borderRadius: 10, height: 320, overflowY: "auto", padding: 8 }}>
          {isLoading ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", gap: 12, color: "#58a6ff" }}>
              <div style={{ width: 24, height: 24, border: "3px solid #58a6ff", borderTopColor: "transparent", borderRadius: "50%", animation: "spin .8s linear infinite" }} />
              Loading Question Bank...
            </div>
          ) : !selectedTopic ? (
            topics.length === 0 ? (
              <div style={{ textAlign: "center", padding: "3rem", color: "#8b949e", fontSize: 13 }}>No topics in this category.</div>
            ) : (
              <div>
                <div style={{ marginBottom: 12, padding: "8px 12px", background: "#161b22", borderRadius: 8, border: "1px solid #21262d" }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: "#8b949e", margin: 0, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    Select a Topic
                  </p>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {topics.map(topic => {
                    const topicQuestions = allQuestions.filter(q => {
                      const cat = q.moduleType || (q.type === "CODING" || q.type === "Coding" ? "Coding" : "Tech MCQs");
                      return cat === activeTab && (q.category || "Uncategorized") === topic;
                    });
                    const selectedInTopic = topicQuestions.filter(q => selectedQuestionIds.includes(q.id)).length;
                    return (
                      <div key={topic} onClick={() => setSelectedTopic(topic)}
                        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", borderRadius: 8, border: "1px solid #21262d", background: "#161b22", cursor: "pointer", transition: "all .1s" }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = "#58a6ff"}
                        onMouseLeave={e => e.currentTarget.style.borderColor = "#21262d"}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <span style={{ fontSize: 18 }}>📁</span>
                          <div>
                            <span style={{ fontSize: 14, fontWeight: 600, color: "#e6edf3", display: "block" }}>{topic}</span>
                            <span style={{ fontSize: 11, color: "#8b949e" }}>{topicQuestions.length} questions</span>
                          </div>
                        </div>
                        {selectedInTopic > 0 && (
                          <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 4, background: "rgba(88,166,255,.15)", color: "#58a6ff", border: "1px solid rgba(88,166,255,.3)" }}>
                            {selectedInTopic} selected
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )
          ) : (
            <div>
              <div style={{ marginBottom: 12, padding: "8px 12px", background: "#161b22", borderRadius: 8, border: "1px solid #21262d", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <button type="button" onClick={handleBackToTopics}
                    style={{ padding: "4px 12px", borderRadius: 6, fontSize: 11, fontWeight: 700, border: "none", cursor: "pointer", background: "#58a6ff", color: "#fff" }}>
                    ← Back
                  </button>
                  <p style={{ fontSize: 11, fontWeight: 700, color: "#e6edf3", margin: 0 }}>{selectedTopic}</p>
                </div>
                <p style={{ fontSize: 11, color: "#8b949e", margin: 0 }}>{visibleQuestions.length} questions</p>
              </div>
              {visibleQuestions.length === 0 ? (
                <div style={{ textAlign: "center", padding: "3rem", color: "#8b949e", fontSize: 13 }}>No questions in this topic.</div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {visibleQuestions.map(q => {
                    const isSelected = selectedQuestionIds.includes(q.id);
                    return (
                      <div key={q.id} onClick={() => handleQuestionSelect(q.id)}
                        style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 14px", borderRadius: 8, border: `1px solid ${isSelected ? "rgba(88,166,255,0.4)" : "#21262d"}`, background: isSelected ? "rgba(88,166,255,0.06)" : "#161b22", cursor: "pointer", transition: "all .1s" }}>
                        <input type="checkbox" checked={isSelected} onChange={() => {}}
                          style={{ width: 16, height: 16, marginTop: 2, flexShrink: 0, cursor: "pointer", accentColor: "#58a6ff" }} />
                        <div style={{ flex: 1 }}>
                          <span style={{ fontSize: 14, fontWeight: 600, color: isSelected ? "#58a6ff" : "#e6edf3", display: "block", marginBottom: 6 }}>
                            {q.title || q.question || "Untitled Question"}
                          </span>
                          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                            {q.type && (
                              <span style={{ fontSize: 10, fontWeight: 700, padding: "1px 6px", borderRadius: 4, background: q.type === "MCQ" ? "rgba(255,161,22,.15)" : "rgba(88,166,255,.15)", color: q.type === "MCQ" ? "#ffa116" : "#58a6ff", border: q.type === "MCQ" ? "1px solid rgba(255,161,22,.3)" : "1px solid rgba(88,166,255,.3)" }}>
                                {q.type}
                              </span>
                            )}
                            {q.difficulty && (
                              <span style={{ fontSize: 10, fontWeight: 700, padding: "1px 6px", borderRadius: 4, background: q.difficulty === "Easy" ? "rgba(63,185,80,.1)" : q.difficulty === "Hard" ? "rgba(248,81,73,.1)" : "rgba(240,136,62,.1)", color: q.difficulty === "Easy" ? "#3fb950" : q.difficulty === "Hard" ? "#f85149" : "#f0883e" }}>
                                {q.difficulty}
                              </span>
                            )}
                            {q.marks && <span style={{ fontSize: 10, color: "#8b949e", padding: "1px 6px", borderRadius: 4, background: "#21262d" }}>{q.marks} pts</span>}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Summary */}
        <div style={{ marginTop: 16, background: "#0d1117", border: "1px solid #21262d", borderRadius: 12, padding: 20 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#8b949e", marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.08em" }}>Selection Summary</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            {[
              { label: "Coding",    val: selectionSummary["Coding"],        color: "#58a6ff" },
              { label: "Tech MCQs", val: selectionSummary["Tech MCQs"],     color: "#3fb950" },
              { label: "Non-Tech",  val: selectionSummary["Non-Tech MCQs"], color: "#f0883e" },
            ].map(({ label, val, color }) => (
              <div key={label} style={{ background: "#161b22", border: "1px solid #21262d", borderRadius: 8, padding: "14px", textAlign: "center" }}>
                <div style={{ fontSize: 28, fontWeight: 800, color }}>{val}</div>
                <div style={{ fontSize: 10, color: "#8b949e", marginTop: 4, textTransform: "uppercase", fontWeight: 700 }}>{label}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 12, fontSize: 13, color: "#8b949e", textAlign: "center" }}>
            Total selected: <strong style={{ color: "#e6edf3" }}>{selectedQuestionIds.length}</strong> questions
          </div>
        </div>
      </div>

      <button type="submit" disabled={isSubmitting || isLoading || !selectedQuestionIds.length}
        style={{ width: "100%", marginTop: 24, padding: "14px", borderRadius: 10, border: "none", background: selectedQuestionIds.length ? "linear-gradient(135deg, #58a6ff, #7c3aed)" : "#21262d", color: selectedQuestionIds.length ? "#fff" : "#8b949e", fontSize: 14, fontWeight: 800, cursor: selectedQuestionIds.length ? "pointer" : "not-allowed", opacity: isSubmitting ? 0.7 : 1, letterSpacing: "0.04em" }}>
        {isSubmitting ? "⏳ Publishing..." : `🚀 Publish Exam (${selectedQuestionIds.length} questions)`}
      </button>
    </form>
  );
};

export default ExamEditor;
