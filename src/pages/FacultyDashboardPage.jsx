
// import React, { useState, useEffect, useCallback } from "react";
// import { useHistory } from "react-router-dom";
// import { useAuth } from "../hooks/useAuth";
// import { createQuestion, createExam, getExamsByFaculty } from "../api/examService";
// import { getAllTenants } from "../api/tenantService";
// import {
//   doc, updateDoc, deleteDoc, collection, getDocs,
//   setDoc, serverTimestamp, arrayUnion, arrayRemove
// } from "firebase/firestore";
// import { db } from "../firebase/config";

// import QuestionForm     from "../components/faculty/QuestionForm";
// import ExamEditor       from "../components/faculty/ExamEditor";
// import RosterManager    from "../components/faculty/RosterManager";
// import ResultsTable     from "../components/faculty/ResultsTable";
// import TenantManager   from "../components/faculty/TenantManager";
// import LearningModules  from "../components/faculty/LearningModules";
// import { ModuleDetailView } from "../components/faculty/ModuleDetailView.jsx";
// import { QuestionBank } from "../components/faculty/QuestionBank.jsx";
// import LessonActionPanel from "../components/faculty/LessonActionPanel";
// import MultiSelectDropdown from "../components/ui/MultiSelectDropdown";
// import Modal            from "../components/ui/Modal";
// import DeleteButton     from "../components/ui/Deletebutton.jsx";

// // ── NEW: IMPORT PRACTICE PAGE ──
// import PracticePage     from "./PracticePage.jsx"; // Adjust this path if PracticePage is in a different folder

// const isExamActive = (exam) => {
//   if (!exam.scheduledStartTime) return true;
//   const start = exam.scheduledStartTime?.toDate?.() ?? new Date(exam.scheduledStartTime);
//   return new Date() < new Date(start.getTime() + (exam.durationMinutes ?? 60) * 60000);
// };

// const FILTER_TYPES = [
//   { key: "Coding",          icon: "💻", color: "#3b82f6" },
//   { key: "Tech MCQs",       icon: "🔬", color: "#10b981" },
//   { key: "Learning Module", icon: "🎓", color: "#ec4899" },
//   { key: "Non-Tech MCQs",   icon: "📚", color: "#f59e0b" },
// ];
// const CREATE_MODULE_TYPES = [...FILTER_TYPES];

// const DARK  = { bg:"#0f172a", surface:"rgba(30,41,59,0.7)", border:"#334155", text:"#f1f5f9", sub:"#94a3b8", muted:"#475569", nav:"rgba(15,23,42,0.9)" };
// const LIGHT = { bg:"#f8fafc", surface:"#ffffff", border:"#e2e8f0", text:"#0f172a", sub:"#475569", muted:"#94a3b8", nav:"rgba(248,250,252,0.95)" };

// export default function FacultyDashboardPage() {
//   const { currentUser, appSignOut } = useAuth();
//   const history = useHistory();
//   const [isDark, setIsDark] = useState(true);
//   const T = isDark ? DARK : LIGHT;

//   const [view, setView]                             = useState("dashboard");
//   const [activeModule, setActiveModule]             = useState(null);
//   const [activeFilterType, setActiveFilterType]     = useState(null);
//   const [activeCreateType, setActiveCreateType]     = useState(null);
//   const [exams, setExams]                           = useState([]);
//   const [categories, setCategories]                 = useState([]);
//   const [allQuestions, setAllQuestions]             = useState([]);
//   const [tenants, setTenants]                       = useState([]);
//   const [selectedExam, setSelectedExam]             = useState(null);
//   const [isLoading, setIsLoading]                   = useState(true);
//   const [examPanelOpen, setExamPanelOpen]           = useState(false);
//   const [examTab, setExamTab]                       = useState(null);
//   const [newCatName, setNewCatName]                 = useState("");
//   const [accessType, setAccessType]                 = useState("global");
//   const [selectedColleges, setSelectedColleges]     = useState([]);
//   const [isCreatingCat, setIsCreatingCat]           = useState(false);
//   const [isTenantOpen, setIsTenantOpen]             = useState(false);
  
//   // ── NEW STATE: PRACTICE DATA ──
//   const [practiceData, setPracticeData]             = useState(null);

//   const fetchData = useCallback(async () => {
//     if (!currentUser) return;
//     setIsLoading(true);
//     try {
//       const [facultyExams, catSnap, qSnap, colleges] = await Promise.all([
//         getExamsByFaculty(currentUser.uid),
//         getDocs(collection(db, "categories")),
//         getDocs(collection(db, "questions")),
//         getAllTenants(),
//       ]);
//       setExams(facultyExams);
//       const catList = catSnap.docs.map(d => ({ id: d.id, ...d.data() }));
//       setCategories(catList);
//       setActiveModule(prev => prev ? (catList.find(c => c.id === prev.id) ?? null) : null);
//       setAllQuestions(qSnap.docs.map(d => ({ id: d.id, ...d.data() })));
//       setTenants(colleges);
//     } catch(e) { console.error("fetchData error:", e); }
//     setIsLoading(false);
//   }, [currentUser]);

//   useEffect(() => { fetchData(); }, [currentUser]);

//   const handleLogout = async () => { await appSignOut(); history.push("/faculty-login"); };

//   const deleteExam = async (id) => {
//     await deleteDoc(doc(db, "exams", id));
//     setExams(p => p.filter(e => e.id !== id));
//   };

//   const deleteModule = async (mod) => {
//     await deleteDoc(doc(db, "categories", mod.id));
//     if (activeModule?.id === mod.id) setActiveModule(null);
//     fetchData();
//   };

//   const deleteQuestion = async (qId, modId) => {
//     await deleteDoc(doc(db, "questions", qId));
//     if (modId) { try { await updateDoc(doc(db, "categories", modId), { questionIds: arrayRemove(qId) }); } catch {} }
//     fetchData();
//   };

//   const handleCreateCategory = async () => {
//     if (!newCatName.trim()) return;
//     if (!activeCreateType) { alert("Select a module type first."); return; }
//     if (accessType === "selective" && !selectedColleges.length) { alert("Select at least one college."); return; }
//     setIsCreatingCat(true);
//     try {
//       const id = `${activeCreateType}-${newCatName}`.toLowerCase().replace(/\s+/g, "-");
//       const newMod = { name: newCatName.trim(), moduleType: activeCreateType, accessType, allowedColleges: accessType === "global" ? [] : selectedColleges, createdAt: serverTimestamp(), createdBy: currentUser.uid, questionIds: [] };
//       await setDoc(doc(db, "categories", id), newMod);
//       setNewCatName(""); setSelectedColleges([]);
//       if (activeCreateType === "Learning Module") { setActiveModule({ id, ...newMod }); setView("manage_modules"); }
//       fetchData();
//     } catch { alert("Error creating module."); }
//     setIsCreatingCat(false);
//   };

//   const getModuleQuestions = (mod) => allQuestions.filter(q => q.category === mod.name);
//   const handleAddQuestionToModule = async (qId, mId) => { if (!qId) return; try { await updateDoc(doc(db, "categories", mId), { questionIds: arrayUnion(qId) }); fetchData(); } catch { alert("Link failed."); } };
//   const handleQuestionSubmit = async (data) => { try { await createQuestion({ ...data, createdBy: currentUser.uid }); alert("Question saved!"); setView("manage_modules"); fetchData(); } catch { alert("Creation failed."); } };
//   const handleExamSubmit = async (data) => { try { await createExam({ ...data, createdBy: currentUser.uid }); alert("Exam Published!"); setView("dashboard"); fetchData(); } catch { alert("Exam failed."); } };
//   const handleSaveRoster = async (examId, rosterData) => { try { await updateDoc(doc(db, "exams", examId), { registeredStudents: rosterData.registeredStudents || [], assignedColleges: rosterData.assignedColleges || [] }); alert("Roster Saved!"); setView("dashboard"); fetchData(); } catch { alert("Save failed."); } };

//   const card   = (x={}) => ({ background: T.surface, border: `1px solid ${T.border}`, borderRadius: "1.25rem", ...x });
//   const navBtn = (a)    => ({ padding: "0.45rem 1rem", borderRadius: "0.7rem", fontWeight: 900, fontSize: "0.65rem", letterSpacing: "0.08em", border: "none", cursor: "pointer", transition: "all .2s", background: a ? "#3b82f6" : "transparent", color: a ? "#fff" : T.muted });


//   // ── NEW: FULL SCREEN TAKEOVER FOR PRACTICE VIEW ──
//   if (view === "practice" && practiceData) {
//     return (
//       <PracticePage 
//         embeddedQuestions={practiceData.questions} 
//         initialIndex={practiceData.index}
//         onBack={() => {
//           setView("manage_modules");
//           setPracticeData(null);
//         }}
//       />
//     );
//   }

//   const ExamPanel = () => {
//     const active = exams.filter(isExamActive), completed = exams.filter(e => !isExamActive(e));
//     const displayed = examTab === "active" ? active : examTab === "completed" ? completed : [];
//     return (
//       <div style={{ ...card({ marginTop: "1.5rem", overflow: "hidden" }) }}>
//         <div style={{ display: "flex", borderBottom: `1px solid ${T.border}` }}>
//           {[{ key:"active",label:"⚡ Active",count:active.length,color:"#3b82f6" },{ key:"completed",label:"✅ Completed",count:completed.length,color:"#8b5cf6" }].map(({key,label,count,color}) => (
//             <button key={key} onClick={() => setExamTab(examTab===key?null:key)} style={{ flex:1,padding:"0.875rem",display:"flex",alignItems:"center",justifyContent:"center",gap:"0.5rem",fontSize:"0.7rem",fontWeight:900,letterSpacing:"0.1em",textTransform:"uppercase",cursor:"pointer",border:"none",background:examTab===key?`${color}18`:"transparent",color:examTab===key?color:T.muted,borderBottom:`2px solid ${examTab===key?color:"transparent"}`,transition:"all .2s" }}>
//               {label}<span style={{ background:examTab===key?color:isDark?"#374151":"#e5e7eb",color:examTab===key?"#fff":T.muted,padding:"0.1rem 0.4rem",borderRadius:"999px",fontSize:"0.6rem" }}>{count}</span>
//             </button>
//           ))}
//         </div>
//         {examTab && <div style={{ padding:"1rem" }}>{displayed.length===0?<p style={{ textAlign:"center",color:T.muted,padding:"1.5rem 0",fontSize:"0.8rem" }}>No {examTab} exams.</p>:displayed.map(exam=>{const start=exam.scheduledStartTime?.toDate?.();return(<div key={exam.id} style={{ ...card({padding:"0.875rem 1.1rem",display:"flex",justifyContent:"space-between",alignItems:"center",gap:"1rem",marginBottom:"0.5rem"}) }}><div><p style={{ fontWeight:800,fontSize:"0.875rem",color:T.text,marginBottom:"0.15rem" }}>{exam.title}</p><p style={{ fontSize:"0.7rem",color:T.muted }}>{exam.questionIds?.length??0} Qs{start?` · ${start.toLocaleString([],{dateStyle:"short",timeStyle:"short"})}`:""}{examTab==="completed"&&<span style={{ marginLeft:"0.4rem",background:"rgba(139,92,246,.15)",color:"#a78bfa",padding:"0.1rem 0.4rem",borderRadius:"0.3rem",fontSize:"0.6rem",fontWeight:800 }}>ENDED</span>}</p></div><div style={{ display:"flex",gap:"0.4rem",flexShrink:0 }}><button onClick={()=>{setSelectedExam(exam);setView("manage_roster");}} style={{ fontSize:"0.65rem",fontWeight:800,padding:"0.35rem 0.7rem",borderRadius:"0.45rem",border:"none",cursor:"pointer",background:isDark?"#1e293b":"#f1f5f9",color:T.sub,textTransform:"uppercase" }}>Roster</button><button onClick={()=>{setSelectedExam(exam);setView("view_results");}} style={{ fontSize:"0.65rem",fontWeight:800,padding:"0.35rem 0.7rem",borderRadius:"0.45rem",border:"none",cursor:"pointer",background:"#2563eb",color:"#fff",textTransform:"uppercase" }}>Results</button><DeleteButton itemName={`exam "${exam.title}"`} onConfirm={()=>deleteExam(exam.id)} /></div></div>);})}</div>}
//       </div>
//     );
//   };

//   const renderDashboard = () => (
//     <div>
//       <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 280px",gap:"1.5rem" }}>
//         <button onClick={()=>{setExamPanelOpen(p=>!p);if(examPanelOpen)setExamTab(null);}} style={{ ...card({padding:"2.5rem",textAlign:"center",cursor:"pointer",border:`1px solid ${examPanelOpen?"#3b82f6":T.border}`,boxShadow:examPanelOpen?"0 0 24px rgba(59,130,246,.15)":"none"}),transition:"all .25s" }}>
//           <h2 style={{ fontSize:"3rem",fontWeight:900,color:T.text,lineHeight:1 }}>{exams.length}</h2>
//           <p style={{ color:"#60a5fa",fontSize:"0.65rem",fontWeight:900,letterSpacing:"0.15em",textTransform:"uppercase",margin:"0.5rem 0" }}>Total Exams</p>
//           <p style={{ color:"#3b82f6",fontSize:"0.6rem",opacity:.7 }}>{examPanelOpen?"▲ collapse":"▼ expand"}</p>
//         </button>
//         <div style={{ ...card({padding:"2.5rem",textAlign:"center"}) }}>
//           <h2 style={{ fontSize:"3rem",fontWeight:900,color:T.text,lineHeight:1 }}>{categories.length}</h2>
//           <p style={{ color:"#a78bfa",fontSize:"0.65rem",fontWeight:900,letterSpacing:"0.15em",textTransform:"uppercase",margin:"0.5rem 0" }}>Total Modules</p>
//           <p style={{ color:"#8b5cf6",fontSize:"0.6rem",opacity:.7 }}>{categories.filter(c=>c.accessType==="global").length} global · {categories.filter(c=>c.accessType!=="global").length} selective</p>
//         </div>
//         <div style={{ ...card({padding:"1.5rem",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}) }}>
//           <div style={{ width:"3rem",height:"3rem",borderRadius:"50%",background:isDark?"#0f172a":"#f1f5f9",border:`1px solid ${T.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.3rem",marginBottom:"0.75rem" }}>👤</div>
//           <p style={{ fontWeight:800,fontSize:"0.875rem",color:T.text,margin:0 }}>{currentUser?.displayName||currentUser?.email?.split("@")[0]}</p>
//           <p style={{ fontSize:"0.68rem",color:T.muted,marginBottom:"1rem" }}>{currentUser?.email}</p>
//           <button onClick={()=>setIsTenantOpen(true)} style={{ width:"100%",padding:"0.55rem",borderRadius:"0.6rem",background:isDark?"#1e293b":"#f1f5f9",border:`1px solid ${T.border}`,color:T.text,fontWeight:700,cursor:"pointer",fontSize:"0.78rem",marginBottom:"0.4rem" }}>🏢 Manage Tenants</button>
//           <button onClick={()=>setView("question_bank")} style={{ width:"100%",padding:"0.55rem",borderRadius:"0.6rem",background:"rgba(59,130,246,.1)",border:"1px solid rgba(59,130,246,.25)",color:"#3b82f6",fontWeight:700,cursor:"pointer",fontSize:"0.78rem" }}>📝 Question Bank</button>
//         </div>
//       </div>
//       {examPanelOpen && <ExamPanel />}
//       {categories.length > 0 && (
//         <div style={{ ...card({marginTop:"1.5rem",padding:"1.25rem 1.5rem"}) }}>
//           <p style={{ fontSize:"0.6rem",fontWeight:900,color:"#a78bfa",letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:"0.75rem" }}>📦 All Modules</p>
//           <div style={{ display:"flex",flexWrap:"wrap",gap:"0.5rem" }}>
//             {categories.map(mod=>(
//               <div key={mod.id} onClick={()=>{setView("manage_modules");setActiveModule(mod);}} style={{ ...card({padding:"0.6rem 0.9rem",display:"flex",alignItems:"center",gap:"0.6rem",cursor:"pointer",flex:"1 1 150px",minWidth:"150px"}),transition:"border-color .2s" }}>
//                 <span style={{ fontSize:"1rem" }}>📦</span>
//                 <div><p style={{ fontWeight:800,fontSize:"0.75rem",color:T.text,margin:0 }}>{mod.name}</p><p style={{ fontSize:"0.6rem",color:T.muted,margin:0 }}>{mod.questionIds?.length??0} questions</p></div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );

//   const ModuleTypeBar = () => (
//     <div style={{ ...card({padding:"1rem 1.25rem"}) }}>
//       <p style={{ fontSize:"0.6rem",fontWeight:900,color:T.muted,letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:"0.75rem" }}>Module Type</p>
//       <div style={{ display:"flex",gap:"0.5rem",flexWrap:"wrap" }}>
//         <button onClick={()=>setActiveFilterType(null)} style={{ padding:"0.45rem 1rem",borderRadius:"0.6rem",fontWeight:800,fontSize:"0.72rem",border:`1px solid ${!activeFilterType?"#6366f1":T.border}`,background:!activeFilterType?"rgba(99,102,241,.15)":"transparent",color:!activeFilterType?"#818cf8":T.muted,cursor:"pointer" }}>All</button>
//         {FILTER_TYPES.map(({key,icon,color})=>{const a=activeFilterType===key;return(<button key={key} onClick={()=>setActiveFilterType(a?null:key)} style={{ padding:"0.45rem 1rem",borderRadius:"0.6rem",fontWeight:800,fontSize:"0.72rem",border:`1px solid ${a?color:T.border}`,background:a?`${color}22`:"transparent",color:a?color:T.muted,cursor:"pointer" }}>{icon} {key}</button>);})}
//       </div>
//     </div>
//   );

//   const renderModules = () => {
//     const filteredCats = activeFilterType ? categories.filter(c=>c.moduleType===activeFilterType) : categories;
//     return (
//       <div style={{ display:"flex",flexDirection:"column",gap:"1.5rem" }}>
//         <ModuleTypeBar />
//         <div style={{ ...card({padding:"1.5rem"}) }}>
//           <p style={{ fontSize:"0.6rem",fontWeight:900,color:T.muted,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:"1rem" }}>Create New Module</p>
//           <div style={{ display:"flex",flexWrap:"wrap",gap:"0.75rem",alignItems:"center" }}>
//             <input value={newCatName} onChange={e=>setNewCatName(e.target.value)} placeholder="Module Name (e.g., Python Basics)" style={{ flex:1,minWidth:"180px",background:isDark?"#0f172a":"#f8fafc",border:`1px solid ${T.border}`,borderRadius:"0.6rem",padding:"0.55rem 0.9rem",color:T.text,fontSize:"0.85rem",outline:"none" }} />
//             <div style={{ display:"flex",gap:"0.25rem",background:isDark?"#0f172a":"#f1f5f9",padding:"0.25rem",borderRadius:"0.6rem",border:`1px solid ${T.border}` }}>
//               {CREATE_MODULE_TYPES.map(({key,color})=>(<button key={key} type="button" onClick={()=>setActiveCreateType(key)} style={{ padding:"0.3rem 0.7rem",borderRadius:"0.4rem",fontWeight:800,fontSize:"0.65rem",border:"none",cursor:"pointer",background:activeCreateType===key?color:"transparent",color:activeCreateType===key?"#fff":T.muted,whiteSpace:"nowrap" }}>{key}</button>))}
//             </div>
//             <div style={{ display:"flex",gap:"0.25rem",background:isDark?"#0f172a":"#f1f5f9",padding:"0.25rem",borderRadius:"0.6rem",border:`1px solid ${T.border}` }}>
//               {["global","selective"].map(a=>(<button key={a} type="button" onClick={()=>setAccessType(a)} style={{ padding:"0.3rem 0.7rem",borderRadius:"0.4rem",fontWeight:800,fontSize:"0.65rem",border:"none",cursor:"pointer",background:accessType===a?(a==="global"?"#3b82f6":"#8b5cf6"):"transparent",color:accessType===a?"#fff":T.muted,textTransform:"uppercase" }}>{a}</button>))}
//             </div>
//             {accessType==="selective" && <div style={{ width:"210px" }}><MultiSelectDropdown options={tenants} selectedValues={selectedColleges} onChange={setSelectedColleges} placeholder="Target Colleges" /></div>}
//             <button onClick={handleCreateCategory} disabled={isCreatingCat} style={{ padding:"0.55rem 1.4rem",borderRadius:"0.6rem",background:activeCreateType==="Learning Module"?"#ec4899":"#3b82f6",color:"#fff",fontWeight:800,fontSize:"0.75rem",border:"none",cursor:"pointer" }}>{isCreatingCat?"...":"CREATE MODULE"}</button>
//           </div>
//         </div>
//         <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1.25rem" }}>
//           {filteredCats.length===0?(
//             <div style={{ gridColumn:"1/-1",textAlign:"center",padding:"4rem",color:T.muted }}><p style={{ fontSize:"2.5rem" }}>📦</p><p style={{ fontWeight:700,marginTop:"0.5rem" }}>No modules yet{activeFilterType?` in ${activeFilterType}`:""}</p></div>
//           ):filteredCats.map(mod=>{
//             const mtCfg=CREATE_MODULE_TYPES.find(m=>m.key===mod.moduleType)||{color:"#8b5cf6"};
//             const moduleQs=getModuleQuestions(mod);
//             return(
//               <div key={mod.id} style={{ ...card({padding:"1.5rem"}),transition:"border-color .2s" }}>
//                 <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"1rem" }}>
//                   <div>
//                     <h3 style={{ fontSize:"1rem",fontWeight:900,textTransform:"uppercase",color:T.text,margin:0 }}>{mod.name}</h3>
//                     <div style={{ display:"flex",gap:"0.3rem",marginTop:"0.35rem",flexWrap:"wrap" }}>
//                       {mod.moduleType&&<span style={{ fontSize:"0.6rem",fontWeight:800,padding:"0.15rem 0.5rem",borderRadius:"0.3rem",background:`${mtCfg.color}22`,color:mtCfg.color }}>{mod.moduleType}</span>}
//                       <span style={{ fontSize:"0.6rem",fontWeight:800,padding:"0.15rem 0.5rem",borderRadius:"0.3rem",background:mod.accessType==="global"?"rgba(59,130,246,.15)":"rgba(139,92,246,.15)",color:mod.accessType==="global"?"#60a5fa":"#a78bfa" }}>{mod.accessType}</span>
//                     </div>
//                   </div>
//                   <div style={{ display:"flex",gap:"0.4rem",alignItems:"center",flexShrink:0 }}>
//                     <button onClick={()=>setActiveModule(mod)} style={{ padding:"0.35rem 0.8rem",borderRadius:"0.6rem",background:isDark?"#1e293b":"#f1f5f9",border:`1px solid ${T.border}`,color:T.sub,fontWeight:700,fontSize:"0.7rem",cursor:"pointer" }}>Open</button>
//                     <DeleteButton itemName={`module "${mod.name}"`} onConfirm={()=>deleteModule(mod)} />
//                   </div>
//                 </div>
//                 <div style={{ display:"flex",justifyContent:"space-between",fontSize:"0.65rem",fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:"0.6rem" }}>
//                   <span>Questions / Items</span><span style={{ color:moduleQs.length>0?"#10b981":T.muted }}>{moduleQs.length} total</span>
//                 </div>
//                 {moduleQs.length>0&&<div style={{ marginBottom:"0.6rem",maxHeight:"120px",overflowY:"auto" }}>{moduleQs.map(q=>(<div key={q.id} style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0.35rem 0.5rem",borderRadius:"0.45rem",background:isDark?"rgba(15,23,42,0.5)":"#f8fafc",marginBottom:"0.3rem",gap:"0.5rem" }}><span style={{ fontSize:"0.72rem",color:T.sub,flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{q.type==="MCQ"?"📋":"💻"} {q.title}</span><DeleteButton itemName={`question "${q.title}"`} onConfirm={()=>deleteQuestion(q.id,mod.id)} /></div>))}</div>}
//                 {mod.moduleType!=="Learning Module"&&<select onChange={e=>handleAddQuestionToModule(e.target.value,mod.id)} style={{ width:"100%",background:isDark?"#0f172a":"#f8fafc",border:`1px solid ${T.border}`,padding:"0.5rem 0.75rem",borderRadius:"0.6rem",fontSize:"0.75rem",color:T.sub,outline:"none" }}><option value="">Quick add from bank...</option>{allQuestions.filter(q=>q.category===mod.name&&!mod.questionIds?.includes(q.id)).map(q=>(<option key={q.id} value={q.id}>{q.title}</option>))}</select>}
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div style={{ minHeight:"100vh",background:T.bg,color:T.text,fontFamily:"system-ui, sans-serif",transition:"background .3s, color .3s" }}>
//       <Modal isOpen={isTenantOpen} onClose={()=>setIsTenantOpen(false)} title="Manage Tenants / Colleges">
//         <TenantManager onClose={()=>setIsTenantOpen(false)} />
//       </Modal>

//       <nav style={{ background:T.nav,backdropFilter:"blur(12px)",borderBottom:`1px solid ${T.border}`,padding:"0.875rem 2rem",position:"sticky",top:0,zIndex:50 }}>
//         <div style={{ maxWidth:"1280px",margin:"0 auto",display:"flex",justifyContent:"space-between",alignItems:"center" }}>
//           <button onClick={()=>{setView("dashboard");setActiveModule(null);setExamPanelOpen(false);setExamTab(null);setActiveCreateType(null);setActiveFilterType(null);}} style={{ background:"none",border:"none",cursor:"pointer",padding:0 }}>
//             <span style={{ fontSize:"1.35rem",fontWeight:900,letterSpacing:"-0.04em",background:"linear-gradient(135deg,#3b82f6,#8b5cf6)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>MIND CODE</span>
//           </button>
//           <div style={{ display:"flex",alignItems:"center",gap:"0.5rem" }}>
//             <div style={{ display:"flex",gap:"0.25rem",background:isDark?"#0f172a":"#f1f5f9",padding:"0.25rem",borderRadius:"1rem",border:`1px solid ${T.border}` }}>
//               {[{key:"create_exam",label:"CREATE EXAM"},{key:"create_question",label:"CREATE QUESTION"},{key:"manage_modules",label:"MANAGE MODULES"}].map(({key,label})=>(
//                 <button key={key} onClick={()=>{setView(key);if(key==="manage_modules"){setActiveModule(null);setActiveCreateType(null);}}} style={navBtn(view===key)}>{label}</button>
//               ))}
//             </div>
//             <button onClick={()=>setIsDark(p=>!p)} style={{ padding:"0.45rem 0.7rem",borderRadius:"0.7rem",fontWeight:800,fontSize:"0.8rem",border:`1px solid ${T.border}`,background:isDark?"#1e293b":"#f1f5f9",color:T.text,cursor:"pointer" }}>{isDark?"☀️":"🌙"}</button>
//             <button onClick={handleLogout} style={{ padding:"0.45rem 0.9rem",borderRadius:"0.7rem",fontWeight:800,fontSize:"0.65rem",letterSpacing:"0.08em",border:"1px solid rgba(239,68,68,.3)",background:"rgba(239,68,68,.08)",color:"#f87171",cursor:"pointer",textTransform:"uppercase" }} onMouseEnter={e=>e.currentTarget.style.background="rgba(239,68,68,.2)"} onMouseLeave={e=>e.currentTarget.style.background="rgba(239,68,68,.08)"}>Logout</button>
//           </div>
//         </div>
//       </nav>

//       <main style={{ maxWidth:"1280px",margin:"0 auto",padding:"2rem" }}>
//         {isLoading ? (
//           <div style={{ display:"flex",justifyContent:"center",paddingTop:"5rem" }}>
//             <div style={{ width:"2.5rem",height:"2.5rem",border:"4px solid #3b82f6",borderTopColor:"transparent",borderRadius:"50%",animation:"spin 1s linear infinite" }} />
//             <style>{"@keyframes spin{to{transform:rotate(360deg)}}"}</style>
//           </div>
//         ) : (
//           <>
//             {view==="dashboard"       && renderDashboard()}
//             {view==="create_question" && <QuestionForm onSubmit={handleQuestionSubmit} categories={categories} />}
//             {view==="create_exam"     && <ExamEditor   onSubmit={handleExamSubmit}     categories={categories} />}
//             {view==="manage_modules"  && (
//               activeModule ? (
//                 activeModule.moduleType === "Learning Module" ? (
//                   <div style={{ display:"flex",flexDirection:"column",gap:"1.5rem" }}>
//                     <div style={{ display:"flex",alignItems:"center",gap:"1rem",padding:"1.25rem",background:T.surface,border:`1px solid ${T.border}`,borderRadius:"1.25rem" }}>
//                       <button onClick={()=>setActiveModule(null)} style={{ fontSize:"0.72rem",fontWeight:800,padding:"0.45rem 1rem",borderRadius:"0.7rem",background:"rgba(236,72,153,.1)",border:"1px solid rgba(236,72,153,.25)",color:"#f472b6",cursor:"pointer" }}>← Back to Modules</button>
//                       <div>
//                         <h2 style={{ fontSize:"1.25rem",fontWeight:900,color:T.text,textTransform:"uppercase",margin:0 }}>{activeModule.name}</h2>
//                         <div style={{ display:"flex",gap:"0.4rem",marginTop:"0.35rem" }}>
//                           <span style={{ fontSize:"0.6rem",fontWeight:800,padding:"0.15rem 0.5rem",borderRadius:"0.3rem",background:"rgba(236,72,153,.15)",color:"#f472b6" }}>Learning Module</span>
//                           <span style={{ fontSize:"0.6rem",fontWeight:800,padding:"0.15rem 0.5rem",borderRadius:"0.3rem",background:activeModule.accessType==="global"?"rgba(59,130,246,.15)":"rgba(139,92,246,.15)",color:activeModule.accessType==="global"?"#60a5fa":"#a78bfa" }}>{activeModule.accessType==="global"?"Global Access":"Selective Access"}</span>
//                         </div>
//                       </div>
//                     </div>
//                     <LearningModules moduleData={activeModule} />
//                   </div>
//                 ) : (
//                   // ── NEW: PASSED onPractice EVENT DOWN TO ModuleDetailView ──
//                   <ModuleDetailView 
//                     module={activeModule} 
//                     questions={getModuleQuestions(activeModule)} 
//                     currentUser={currentUser} 
//                     onBack={()=>setActiveModule(null)} 
//                     onRefresh={fetchData} 
//                     onPractice={(index) => {
//                       setPracticeData({ questions: getModuleQuestions(activeModule), index });
//                       setView("practice");
//                     }}
//                   />
//                 )
//               ) : renderModules()
//             )}
//             {view==="manage_roster" && <RosterManager exam={selectedExam} tenants={tenants} onSave={handleSaveRoster} />}
//             {view === "view_results" && selectedExam && (
//   <div>
//     <button onClick={() => { setView("dashboard"); setSelectedExam(null); }}
//       style={{ marginBottom: 20, padding: "8px 18px", background: isDark ? "#1e293b" : "#f1f5f9",
//         border: `1px solid ${T.border}`, borderRadius: 8, color: T.text, fontWeight: 700, cursor: "pointer" }}>
//       ← Back to Dashboard
//     </button>
//     <ResultsTable
//       examTitle={selectedExam.title}
//       examId={selectedExam.id}
//       exam={selectedExam}
//       collegeName={selectedExam.assignedColleges?.[0] || ""}
//     />
//   </div>
// )}
//             {view==="question_bank" && <QuestionBank  onClose={()=>setView("dashboard")} />}
//           </>
//         )}
//       </main>
//     </div>
//   );
// } 








import React, { useState, useEffect, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { createQuestion, createExam, getExamsByFaculty } from "../api/examService";
import { getAllTenants } from "../api/tenantService";
import {
  doc, updateDoc, deleteDoc, collection, getDocs,
  setDoc, serverTimestamp, arrayUnion, arrayRemove
} from "firebase/firestore";
import { db } from "../firebase/config";

import QuestionForm     from "../components/faculty/QuestionForm";
import ExamEditor       from "../components/faculty/ExamEditor";
import RosterManager    from "../components/faculty/RosterManager";
import ResultsTable     from "../components/faculty/ResultsTable";
import TenantManager   from "../components/faculty/TenantManager";
import LearningModules  from "../components/faculty/LearningModules";
import { ModuleDetailView } from "../components/faculty/ModuleDetailView.jsx";
import { QuestionBank } from "../components/faculty/QuestionBank.jsx";
import LessonActionPanel from "../components/faculty/LessonActionPanel";
import MultiSelectDropdown from "../components/ui/MultiSelectDropdown";
// ── CHANGE 1: Modal import REMOVED ──
import DeleteButton     from "../components/ui/Deletebutton.jsx";

// ── NEW: IMPORT PRACTICE PAGE ──
import PracticePage     from "./PracticePage.jsx"; // Adjust this path if PracticePage is in a different folder

const isExamActive = (exam) => {
  if (!exam.scheduledStartTime) return true;
  const start = exam.scheduledStartTime?.toDate?.() ?? new Date(exam.scheduledStartTime);
  return new Date() < new Date(start.getTime() + (exam.durationMinutes ?? 60) * 60000);
};

const FILTER_TYPES = [
  { key: "Coding",          icon: "💻", color: "#3b82f6" },
  { key: "Tech MCQs",       icon: "🔬", color: "#10b981" },
  { key: "Learning Module", icon: "🎓", color: "#ec4899" },
  { key: "Non-Tech MCQs",   icon: "📚", color: "#f59e0b" },
];
const CREATE_MODULE_TYPES = [...FILTER_TYPES];

const DARK  = { bg:"#0f172a", surface:"rgba(30,41,59,0.7)", border:"#334155", text:"#f1f5f9", sub:"#94a3b8", muted:"#475569", nav:"rgba(15,23,42,0.9)" };
const LIGHT = { bg:"#f8fafc", surface:"#ffffff", border:"#e2e8f0", text:"#0f172a", sub:"#475569", muted:"#94a3b8", nav:"rgba(248,250,252,0.95)" };

export default function FacultyDashboardPage() {
  const { currentUser, appSignOut } = useAuth();
  const history = useHistory();
  const [isDark, setIsDark] = useState(true);
  const T = isDark ? DARK : LIGHT;

  const [view, setView]                             = useState("dashboard");
  const [activeModule, setActiveModule]             = useState(null);
  const [activeFilterType, setActiveFilterType]     = useState(null);
  const [activeCreateType, setActiveCreateType]     = useState(null);
  const [exams, setExams]                           = useState([]);
  const [categories, setCategories]                 = useState([]);
  const [allQuestions, setAllQuestions]             = useState([]);
  const [tenants, setTenants]                       = useState([]);
  const [selectedExam, setSelectedExam]             = useState(null);
  const [isLoading, setIsLoading]                   = useState(true);
  const [examPanelOpen, setExamPanelOpen]           = useState(false);
  const [examTab, setExamTab]                       = useState(null);
  const [newCatName, setNewCatName]                 = useState("");
  const [accessType, setAccessType]                 = useState("global");
  const [selectedColleges, setSelectedColleges]     = useState([]);
  const [isCreatingCat, setIsCreatingCat]           = useState(false);
  // ── CHANGE 2: isTenantOpen state REMOVED ──
  
  // ── NEW STATE: PRACTICE DATA ──
  const [practiceData, setPracticeData]             = useState(null);

  const fetchData = useCallback(async () => {
    if (!currentUser) return;
    setIsLoading(true);
    try {
      const [facultyExams, catSnap, qSnap, colleges] = await Promise.all([
        getExamsByFaculty(currentUser.uid),
        getDocs(collection(db, "categories")),
        getDocs(collection(db, "questions")),
        getAllTenants(),
      ]);
      setExams(facultyExams);
      const catList = catSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      setCategories(catList);
      setActiveModule(prev => prev ? (catList.find(c => c.id === prev.id) ?? null) : null);
      setAllQuestions(qSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      setTenants(colleges);
    } catch(e) { console.error("fetchData error:", e); }
    setIsLoading(false);
  }, [currentUser]);

  useEffect(() => { fetchData(); }, [currentUser]);

  const handleLogout = async () => { await appSignOut(); history.push("/faculty-login"); };

  const deleteExam = async (id) => {
    await deleteDoc(doc(db, "exams", id));
    setExams(p => p.filter(e => e.id !== id));
  };

  const deleteModule = async (mod) => {
    await deleteDoc(doc(db, "categories", mod.id));
    if (activeModule?.id === mod.id) setActiveModule(null);
    fetchData();
  };

  const deleteQuestion = async (qId, modId) => {
    await deleteDoc(doc(db, "questions", qId));
    if (modId) { try { await updateDoc(doc(db, "categories", modId), { questionIds: arrayRemove(qId) }); } catch {} }
    fetchData();
  };

  const handleCreateCategory = async () => {
    if (!newCatName.trim()) return;
    if (!activeCreateType) { alert("Select a module type first."); return; }
    if (accessType === "selective" && !selectedColleges.length) { alert("Select at least one college."); return; }
    setIsCreatingCat(true);
    try {
      const id = `${activeCreateType}-${newCatName}`.toLowerCase().replace(/\s+/g, "-");
      const newMod = { name: newCatName.trim(), moduleType: activeCreateType, accessType, allowedColleges: accessType === "global" ? [] : selectedColleges, createdAt: serverTimestamp(), createdBy: currentUser.uid, questionIds: [] };
      await setDoc(doc(db, "categories", id), newMod);
      setNewCatName(""); setSelectedColleges([]);
      if (activeCreateType === "Learning Module") { setActiveModule({ id, ...newMod }); setView("manage_modules"); }
      fetchData();
    } catch { alert("Error creating module."); }
    setIsCreatingCat(false);
  };

  const getModuleQuestions = (mod) => allQuestions.filter(q => q.category === mod.name);
  const handleAddQuestionToModule = async (qId, mId) => { if (!qId) return; try { await updateDoc(doc(db, "categories", mId), { questionIds: arrayUnion(qId) }); fetchData(); } catch { alert("Link failed."); } };
  const handleQuestionSubmit = async (data) => { try { await createQuestion({ ...data, createdBy: currentUser.uid }); alert("Question saved!"); setView("manage_modules"); fetchData(); } catch { alert("Creation failed."); } };
  const handleExamSubmit = async (data) => { try { await createExam({ ...data, createdBy: currentUser.uid }); alert("Exam Published!"); setView("dashboard"); fetchData(); } catch { alert("Exam failed."); } };
  const handleSaveRoster = async (examId, rosterData) => { try { await updateDoc(doc(db, "exams", examId), { registeredStudents: rosterData.registeredStudents || [], assignedColleges: rosterData.assignedColleges || [] }); alert("Roster Saved!"); setView("dashboard"); fetchData(); } catch { alert("Save failed."); } };

  const card   = (x={}) => ({ background: T.surface, border: `1px solid ${T.border}`, borderRadius: "1.25rem", ...x });
  const navBtn = (a)    => ({ padding: "0.45rem 1rem", borderRadius: "0.7rem", fontWeight: 900, fontSize: "0.65rem", letterSpacing: "0.08em", border: "none", cursor: "pointer", transition: "all .2s", background: a ? "#3b82f6" : "transparent", color: a ? "#fff" : T.muted });

  // ── CHANGE 5: EARLY EXIT — full screen tenant manager ──
  if (view === "tenant_manager") {
    return <TenantManager onBack={() => setView("dashboard")} />;
  }

  // ── NEW: FULL SCREEN TAKEOVER FOR PRACTICE VIEW ──
  if (view === "practice" && practiceData) {
    return (
      <PracticePage 
        embeddedQuestions={practiceData.questions} 
        initialIndex={practiceData.index}
        onBack={() => {
          setView("manage_modules");
          setPracticeData(null);
        }}
      />
    );
  }

  const ExamPanel = () => {
    const active = exams.filter(isExamActive), completed = exams.filter(e => !isExamActive(e));
    const displayed = examTab === "active" ? active : examTab === "completed" ? completed : [];
    return (
      <div style={{ ...card({ marginTop: "1.5rem", overflow: "hidden" }) }}>
        <div style={{ display: "flex", borderBottom: `1px solid ${T.border}` }}>
          {[{ key:"active",label:"⚡ Active",count:active.length,color:"#3b82f6" },{ key:"completed",label:"✅ Completed",count:completed.length,color:"#8b5cf6" }].map(({key,label,count,color}) => (
            <button key={key} onClick={() => setExamTab(examTab===key?null:key)} style={{ flex:1,padding:"0.875rem",display:"flex",alignItems:"center",justifyContent:"center",gap:"0.5rem",fontSize:"0.7rem",fontWeight:900,letterSpacing:"0.1em",textTransform:"uppercase",cursor:"pointer",border:"none",background:examTab===key?`${color}18`:"transparent",color:examTab===key?color:T.muted,borderBottom:`2px solid ${examTab===key?color:"transparent"}`,transition:"all .2s" }}>
              {label}<span style={{ background:examTab===key?color:isDark?"#374151":"#e5e7eb",color:examTab===key?"#fff":T.muted,padding:"0.1rem 0.4rem",borderRadius:"999px",fontSize:"0.6rem" }}>{count}</span>
            </button>
          ))}
        </div>
        {examTab && <div style={{ padding:"1rem" }}>{displayed.length===0?<p style={{ textAlign:"center",color:T.muted,padding:"1.5rem 0",fontSize:"0.8rem" }}>No {examTab} exams.</p>:displayed.map(exam=>{const start=exam.scheduledStartTime?.toDate?.();return(<div key={exam.id} style={{ ...card({padding:"0.875rem 1.1rem",display:"flex",justifyContent:"space-between",alignItems:"center",gap:"1rem",marginBottom:"0.5rem"}) }}><div><p style={{ fontWeight:800,fontSize:"0.875rem",color:T.text,marginBottom:"0.15rem" }}>{exam.title}</p><p style={{ fontSize:"0.7rem",color:T.muted }}>{exam.questionIds?.length??0} Qs{start?` · ${start.toLocaleString([],{dateStyle:"short",timeStyle:"short"})}`:""}{examTab==="completed"&&<span style={{ marginLeft:"0.4rem",background:"rgba(139,92,246,.15)",color:"#a78bfa",padding:"0.1rem 0.4rem",borderRadius:"0.3rem",fontSize:"0.6rem",fontWeight:800 }}>ENDED</span>}</p></div><div style={{ display:"flex",gap:"0.4rem",flexShrink:0 }}><button onClick={()=>{setSelectedExam(exam);setView("manage_roster");}} style={{ fontSize:"0.65rem",fontWeight:800,padding:"0.35rem 0.7rem",borderRadius:"0.45rem",border:"none",cursor:"pointer",background:isDark?"#1e293b":"#f1f5f9",color:T.sub,textTransform:"uppercase" }}>Roster</button><button onClick={()=>{setSelectedExam(exam);setView("view_results");}} style={{ fontSize:"0.65rem",fontWeight:800,padding:"0.35rem 0.7rem",borderRadius:"0.45rem",border:"none",cursor:"pointer",background:"#2563eb",color:"#fff",textTransform:"uppercase" }}>Results</button><DeleteButton itemName={`exam "${exam.title}"`} onConfirm={()=>deleteExam(exam.id)} /></div></div>);})}</div>}
      </div>
    );
  };

  const renderDashboard = () => (
    <div>
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 280px",gap:"1.5rem" }}>
        <button onClick={()=>{setExamPanelOpen(p=>!p);if(examPanelOpen)setExamTab(null);}} style={{ ...card({padding:"2.5rem",textAlign:"center",cursor:"pointer",border:`1px solid ${examPanelOpen?"#3b82f6":T.border}`,boxShadow:examPanelOpen?"0 0 24px rgba(59,130,246,.15)":"none"}),transition:"all .25s" }}>
          <h2 style={{ fontSize:"3rem",fontWeight:900,color:T.text,lineHeight:1 }}>{exams.length}</h2>
          <p style={{ color:"#60a5fa",fontSize:"0.65rem",fontWeight:900,letterSpacing:"0.15em",textTransform:"uppercase",margin:"0.5rem 0" }}>Total Exams</p>
          <p style={{ color:"#3b82f6",fontSize:"0.6rem",opacity:.7 }}>{examPanelOpen?"▲ collapse":"▼ expand"}</p>
        </button>
        <div style={{ ...card({padding:"2.5rem",textAlign:"center"}) }}>
          <h2 style={{ fontSize:"3rem",fontWeight:900,color:T.text,lineHeight:1 }}>{categories.length}</h2>
          <p style={{ color:"#a78bfa",fontSize:"0.65rem",fontWeight:900,letterSpacing:"0.15em",textTransform:"uppercase",margin:"0.5rem 0" }}>Total Modules</p>
          <p style={{ color:"#8b5cf6",fontSize:"0.6rem",opacity:.7 }}>{categories.filter(c=>c.accessType==="global").length} global · {categories.filter(c=>c.accessType!=="global").length} selective</p>
        </div>
        <div style={{ ...card({padding:"1.5rem",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}) }}>
          <div style={{ width:"3rem",height:"3rem",borderRadius:"50%",background:isDark?"#0f172a":"#f1f5f9",border:`1px solid ${T.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.3rem",marginBottom:"0.75rem" }}>👤</div>
          <p style={{ fontWeight:800,fontSize:"0.875rem",color:T.text,margin:0 }}>{currentUser?.displayName||currentUser?.email?.split("@")[0]}</p>
          <p style={{ fontSize:"0.68rem",color:T.muted,marginBottom:"1rem" }}>{currentUser?.email}</p>
          {/* ── CHANGE 4: onClick now navigates to "tenant_manager" view instead of opening modal ── */}
          <button onClick={()=>setView("tenant_manager")} style={{ width:"100%",padding:"0.55rem",borderRadius:"0.6rem",background:isDark?"#1e293b":"#f1f5f9",border:`1px solid ${T.border}`,color:T.text,fontWeight:700,cursor:"pointer",fontSize:"0.78rem",marginBottom:"0.4rem" }}>🏢 Manage Tenants</button>
          <button onClick={()=>setView("question_bank")} style={{ width:"100%",padding:"0.55rem",borderRadius:"0.6rem",background:"rgba(59,130,246,.1)",border:"1px solid rgba(59,130,246,.25)",color:"#3b82f6",fontWeight:700,cursor:"pointer",fontSize:"0.78rem" }}>📝 Question Bank</button>
        </div>
      </div>
      {examPanelOpen && <ExamPanel />}
      {categories.length > 0 && (
        <div style={{ ...card({marginTop:"1.5rem",padding:"1.25rem 1.5rem"}) }}>
          <p style={{ fontSize:"0.6rem",fontWeight:900,color:"#a78bfa",letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:"0.75rem" }}>📦 All Modules</p>
          <div style={{ display:"flex",flexWrap:"wrap",gap:"0.5rem" }}>
            {categories.map(mod=>(
              <div key={mod.id} onClick={()=>{setView("manage_modules");setActiveModule(mod);}} style={{ ...card({padding:"0.6rem 0.9rem",display:"flex",alignItems:"center",gap:"0.6rem",cursor:"pointer",flex:"1 1 150px",minWidth:"150px"}),transition:"border-color .2s" }}>
                <span style={{ fontSize:"1rem" }}>📦</span>
                <div><p style={{ fontWeight:800,fontSize:"0.75rem",color:T.text,margin:0 }}>{mod.name}</p><p style={{ fontSize:"0.6rem",color:T.muted,margin:0 }}>{mod.questionIds?.length??0} questions</p></div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const ModuleTypeBar = () => (
    <div style={{ ...card({padding:"1rem 1.25rem"}) }}>
      <p style={{ fontSize:"0.6rem",fontWeight:900,color:T.muted,letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:"0.75rem" }}>Module Type</p>
      <div style={{ display:"flex",gap:"0.5rem",flexWrap:"wrap" }}>
        <button onClick={()=>setActiveFilterType(null)} style={{ padding:"0.45rem 1rem",borderRadius:"0.6rem",fontWeight:800,fontSize:"0.72rem",border:`1px solid ${!activeFilterType?"#6366f1":T.border}`,background:!activeFilterType?"rgba(99,102,241,.15)":"transparent",color:!activeFilterType?"#818cf8":T.muted,cursor:"pointer" }}>All</button>
        {FILTER_TYPES.map(({key,icon,color})=>{const a=activeFilterType===key;return(<button key={key} onClick={()=>setActiveFilterType(a?null:key)} style={{ padding:"0.45rem 1rem",borderRadius:"0.6rem",fontWeight:800,fontSize:"0.72rem",border:`1px solid ${a?color:T.border}`,background:a?`${color}22`:"transparent",color:a?color:T.muted,cursor:"pointer" }}>{icon} {key}</button>);})}
      </div>
    </div>
  );

  const renderModules = () => {
    const filteredCats = activeFilterType ? categories.filter(c=>c.moduleType===activeFilterType) : categories;
    return (
      <div style={{ display:"flex",flexDirection:"column",gap:"1.5rem" }}>
        <ModuleTypeBar />
        <div style={{ ...card({padding:"1.5rem"}) }}>
          <p style={{ fontSize:"0.6rem",fontWeight:900,color:T.muted,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:"1rem" }}>Create New Module</p>
          <div style={{ display:"flex",flexWrap:"wrap",gap:"0.75rem",alignItems:"center" }}>
            <input value={newCatName} onChange={e=>setNewCatName(e.target.value)} placeholder="Module Name (e.g., Python Basics)" style={{ flex:1,minWidth:"180px",background:isDark?"#0f172a":"#f8fafc",border:`1px solid ${T.border}`,borderRadius:"0.6rem",padding:"0.55rem 0.9rem",color:T.text,fontSize:"0.85rem",outline:"none" }} />
            <div style={{ display:"flex",gap:"0.25rem",background:isDark?"#0f172a":"#f1f5f9",padding:"0.25rem",borderRadius:"0.6rem",border:`1px solid ${T.border}` }}>
              {CREATE_MODULE_TYPES.map(({key,color})=>(<button key={key} type="button" onClick={()=>setActiveCreateType(key)} style={{ padding:"0.3rem 0.7rem",borderRadius:"0.4rem",fontWeight:800,fontSize:"0.65rem",border:"none",cursor:"pointer",background:activeCreateType===key?color:"transparent",color:activeCreateType===key?"#fff":T.muted,whiteSpace:"nowrap" }}>{key}</button>))}
            </div>
            <div style={{ display:"flex",gap:"0.25rem",background:isDark?"#0f172a":"#f1f5f9",padding:"0.25rem",borderRadius:"0.6rem",border:`1px solid ${T.border}` }}>
              {["global","selective"].map(a=>(<button key={a} type="button" onClick={()=>setAccessType(a)} style={{ padding:"0.3rem 0.7rem",borderRadius:"0.4rem",fontWeight:800,fontSize:"0.65rem",border:"none",cursor:"pointer",background:accessType===a?(a==="global"?"#3b82f6":"#8b5cf6"):"transparent",color:accessType===a?"#fff":T.muted,textTransform:"uppercase" }}>{a}</button>))}
            </div>
            {accessType==="selective" && <div style={{ width:"210px" }}><MultiSelectDropdown options={tenants} selectedValues={selectedColleges} onChange={setSelectedColleges} placeholder="Target Colleges" /></div>}
            <button onClick={handleCreateCategory} disabled={isCreatingCat} style={{ padding:"0.55rem 1.4rem",borderRadius:"0.6rem",background:activeCreateType==="Learning Module"?"#ec4899":"#3b82f6",color:"#fff",fontWeight:800,fontSize:"0.75rem",border:"none",cursor:"pointer" }}>{isCreatingCat?"...":"CREATE MODULE"}</button>
          </div>
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1.25rem" }}>
          {filteredCats.length===0?(
            <div style={{ gridColumn:"1/-1",textAlign:"center",padding:"4rem",color:T.muted }}><p style={{ fontSize:"2.5rem" }}>📦</p><p style={{ fontWeight:700,marginTop:"0.5rem" }}>No modules yet{activeFilterType?` in ${activeFilterType}`:""}</p></div>
          ):filteredCats.map(mod=>{
            const mtCfg=CREATE_MODULE_TYPES.find(m=>m.key===mod.moduleType)||{color:"#8b5cf6"};
            const moduleQs=getModuleQuestions(mod);
            return(
              <div key={mod.id} style={{ ...card({padding:"1.5rem"}),transition:"border-color .2s" }}>
                <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"1rem" }}>
                  <div>
                    <h3 style={{ fontSize:"1rem",fontWeight:900,textTransform:"uppercase",color:T.text,margin:0 }}>{mod.name}</h3>
                    <div style={{ display:"flex",gap:"0.3rem",marginTop:"0.35rem",flexWrap:"wrap" }}>
                      {mod.moduleType&&<span style={{ fontSize:"0.6rem",fontWeight:800,padding:"0.15rem 0.5rem",borderRadius:"0.3rem",background:`${mtCfg.color}22`,color:mtCfg.color }}>{mod.moduleType}</span>}
                      <span style={{ fontSize:"0.6rem",fontWeight:800,padding:"0.15rem 0.5rem",borderRadius:"0.3rem",background:mod.accessType==="global"?"rgba(59,130,246,.15)":"rgba(139,92,246,.15)",color:mod.accessType==="global"?"#60a5fa":"#a78bfa" }}>{mod.accessType}</span>
                    </div>
                  </div>
                  <div style={{ display:"flex",gap:"0.4rem",alignItems:"center",flexShrink:0 }}>
                    <button onClick={()=>setActiveModule(mod)} style={{ padding:"0.35rem 0.8rem",borderRadius:"0.6rem",background:isDark?"#1e293b":"#f1f5f9",border:`1px solid ${T.border}`,color:T.sub,fontWeight:700,fontSize:"0.7rem",cursor:"pointer" }}>Open</button>
                    <DeleteButton itemName={`module "${mod.name}"`} onConfirm={()=>deleteModule(mod)} />
                  </div>
                </div>
                <div style={{ display:"flex",justifyContent:"space-between",fontSize:"0.65rem",fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:"0.6rem" }}>
                  <span>Questions / Items</span><span style={{ color:moduleQs.length>0?"#10b981":T.muted }}>{moduleQs.length} total</span>
                </div>
                {moduleQs.length>0&&<div style={{ marginBottom:"0.6rem",maxHeight:"120px",overflowY:"auto" }}>{moduleQs.map(q=>(<div key={q.id} style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0.35rem 0.5rem",borderRadius:"0.45rem",background:isDark?"rgba(15,23,42,0.5)":"#f8fafc",marginBottom:"0.3rem",gap:"0.5rem" }}><span style={{ fontSize:"0.72rem",color:T.sub,flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{q.type==="MCQ"?"📋":"💻"} {q.title}</span><DeleteButton itemName={`question "${q.title}"`} onConfirm={()=>deleteQuestion(q.id,mod.id)} /></div>))}</div>}
                {mod.moduleType!=="Learning Module"&&<select onChange={e=>handleAddQuestionToModule(e.target.value,mod.id)} style={{ width:"100%",background:isDark?"#0f172a":"#f8fafc",border:`1px solid ${T.border}`,padding:"0.5rem 0.75rem",borderRadius:"0.6rem",fontSize:"0.75rem",color:T.sub,outline:"none" }}><option value="">Quick add from bank...</option>{allQuestions.filter(q=>q.category===mod.name&&!mod.questionIds?.includes(q.id)).map(q=>(<option key={q.id} value={q.id}>{q.title}</option>))}</select>}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // ── CHANGE 3: Modal block REMOVED — TenantManager now renders via early-return above ──
  return (
    <div style={{ minHeight:"100vh",background:T.bg,color:T.text,fontFamily:"system-ui, sans-serif",transition:"background .3s, color .3s" }}>
      <nav style={{ background:T.nav,backdropFilter:"blur(12px)",borderBottom:`1px solid ${T.border}`,padding:"0.875rem 2rem",position:"sticky",top:0,zIndex:50 }}>
        <div style={{ maxWidth:"1280px",margin:"0 auto",display:"flex",justifyContent:"space-between",alignItems:"center" }}>
          <button onClick={()=>{setView("dashboard");setActiveModule(null);setExamPanelOpen(false);setExamTab(null);setActiveCreateType(null);setActiveFilterType(null);}} style={{ background:"none",border:"none",cursor:"pointer",padding:0 }}>
            <span style={{ fontSize:"1.35rem",fontWeight:900,letterSpacing:"-0.04em",background:"linear-gradient(135deg,#3b82f6,#8b5cf6)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>MIND CODE</span>
          </button>
          <div style={{ display:"flex",alignItems:"center",gap:"0.5rem" }}>
            <div style={{ display:"flex",gap:"0.25rem",background:isDark?"#0f172a":"#f1f5f9",padding:"0.25rem",borderRadius:"1rem",border:`1px solid ${T.border}` }}>
              {[{key:"create_exam",label:"CREATE EXAM"},{key:"create_question",label:"CREATE QUESTION"},{key:"manage_modules",label:"MANAGE MODULES"}].map(({key,label})=>(
                <button key={key} onClick={()=>{setView(key);if(key==="manage_modules"){setActiveModule(null);setActiveCreateType(null);}}} style={navBtn(view===key)}>{label}</button>
              ))}
            </div>
            <button onClick={()=>setIsDark(p=>!p)} style={{ padding:"0.45rem 0.7rem",borderRadius:"0.7rem",fontWeight:800,fontSize:"0.8rem",border:`1px solid ${T.border}`,background:isDark?"#1e293b":"#f1f5f9",color:T.text,cursor:"pointer" }}>{isDark?"☀️":"🌙"}</button>
            <button onClick={handleLogout} style={{ padding:"0.45rem 0.9rem",borderRadius:"0.7rem",fontWeight:800,fontSize:"0.65rem",letterSpacing:"0.08em",border:"1px solid rgba(239,68,68,.3)",background:"rgba(239,68,68,.08)",color:"#f87171",cursor:"pointer",textTransform:"uppercase" }} onMouseEnter={e=>e.currentTarget.style.background="rgba(239,68,68,.2)"} onMouseLeave={e=>e.currentTarget.style.background="rgba(239,68,68,.08)"}>Logout</button>
          </div>
        </div>
      </nav>

      <main style={{ maxWidth:"1280px",margin:"0 auto",padding:"2rem" }}>
        {isLoading ? (
          <div style={{ display:"flex",justifyContent:"center",paddingTop:"5rem" }}>
            <div style={{ width:"2.5rem",height:"2.5rem",border:"4px solid #3b82f6",borderTopColor:"transparent",borderRadius:"50%",animation:"spin 1s linear infinite" }} />
            <style>{"@keyframes spin{to{transform:rotate(360deg)}}"}</style>
          </div>
        ) : (
          <>
            {view==="dashboard"       && renderDashboard()}
            {view==="create_question" && <QuestionForm onSubmit={handleQuestionSubmit} categories={categories} />}
            {view==="create_exam"     && <ExamEditor   onSubmit={handleExamSubmit}     categories={categories} />}
            {view==="manage_modules"  && (
              activeModule ? (
                activeModule.moduleType === "Learning Module" ? (
                  <div style={{ display:"flex",flexDirection:"column",gap:"1.5rem" }}>
                    <div style={{ display:"flex",alignItems:"center",gap:"1rem",padding:"1.25rem",background:T.surface,border:`1px solid ${T.border}`,borderRadius:"1.25rem" }}>
                      <button onClick={()=>setActiveModule(null)} style={{ fontSize:"0.72rem",fontWeight:800,padding:"0.45rem 1rem",borderRadius:"0.7rem",background:"rgba(236,72,153,.1)",border:"1px solid rgba(236,72,153,.25)",color:"#f472b6",cursor:"pointer" }}>← Back to Modules</button>
                      <div>
                        <h2 style={{ fontSize:"1.25rem",fontWeight:900,color:T.text,textTransform:"uppercase",margin:0 }}>{activeModule.name}</h2>
                        <div style={{ display:"flex",gap:"0.4rem",marginTop:"0.35rem" }}>
                          <span style={{ fontSize:"0.6rem",fontWeight:800,padding:"0.15rem 0.5rem",borderRadius:"0.3rem",background:"rgba(236,72,153,.15)",color:"#f472b6" }}>Learning Module</span>
                          <span style={{ fontSize:"0.6rem",fontWeight:800,padding:"0.15rem 0.5rem",borderRadius:"0.3rem",background:activeModule.accessType==="global"?"rgba(59,130,246,.15)":"rgba(139,92,246,.15)",color:activeModule.accessType==="global"?"#60a5fa":"#a78bfa" }}>{activeModule.accessType==="global"?"Global Access":"Selective Access"}</span>
                        </div>
                      </div>
                    </div>
                    <LearningModules moduleData={activeModule} />
                  </div>
                ) : (
                  // ── NEW: PASSED onPractice EVENT DOWN TO ModuleDetailView ──
                  <ModuleDetailView 
                    module={activeModule} 
                    questions={getModuleQuestions(activeModule)} 
                    currentUser={currentUser} 
                    onBack={()=>setActiveModule(null)} 
                    onRefresh={fetchData} 
                    onPractice={(index) => {
                      setPracticeData({ questions: getModuleQuestions(activeModule), index });
                      setView("practice");
                    }}
                  />
                )
              ) : renderModules()
            )}
            {view==="manage_roster" && <RosterManager exam={selectedExam} tenants={tenants} onSave={handleSaveRoster} />}
            {view === "view_results" && selectedExam && (
  <div>
    <button onClick={() => { setView("dashboard"); setSelectedExam(null); }}
      style={{ marginBottom: 20, padding: "8px 18px", background: isDark ? "#1e293b" : "#f1f5f9",
        border: `1px solid ${T.border}`, borderRadius: 8, color: T.text, fontWeight: 700, cursor: "pointer" }}>
      ← Back to Dashboard
    </button>
    <ResultsTable
      examTitle={selectedExam.title}
      examId={selectedExam.id}
      exam={selectedExam}
      collegeName={selectedExam.assignedColleges?.[0] || ""}
    />
  </div>
)}
            {view==="question_bank" && <QuestionBank  onClose={()=>setView("dashboard")} />}
          </>
        )}
      </main>
    </div>
  );
}
