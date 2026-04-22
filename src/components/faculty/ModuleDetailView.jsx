// // // // // // // // // // import React, { useState } from 'react';
// // // // // // // // // // import React from "react";
// // // // // // // // // // import { doc, updateDoc, arrayRemove, arrayUnion } from 'firebase/firestore';
// // // // // // // // // // import { db } from '../../firebase/config';
// // // // // // // // // // import QuestionForm from './QuestionForm';
// // // // // // // // // // import { createQuestion } from '../../api/examService';

// // // // // // // // // // const ModuleDetailView = ({ module, questions, onBack, onRefresh, currentUser }) => {
// // // // // // // // // //     const [isAddingNew, setIsAddingNew] = useState(false);

// // // // // // // // // //     // Unlink a question from the module without deleting it from the global bank
// // // // // // // // // //     const handleUnlinkQuestion = async (qId) => {
// // // // // // // // // //         if (!window.confirm("Unlink this question from the module? (It will remain in the global bank)")) return;
// // // // // // // // // //         try {
// // // // // // // // // //             const modRef = doc(db, 'categories', module.id);
// // // // // // // // // //             await updateDoc(modRef, {
// // // // // // // // // //                 questionIds: arrayRemove(qId)
// // // // // // // // // //             });
// // // // // // // // // //             onRefresh();
// // // // // // // // // //         } catch (e) { alert("Failed to unlink."); }
// // // // // // // // // //     };

// // // // // // // // // //     // Create a NEW question specifically for this module
// // // // // // // // // //     const handleCreateInModule = async (questionData) => {
// // // // // // // // // //         try {
// // // // // // // // // //             // 1. Create the question globally
// // // // // // // // // //             const qId = await createQuestion({ 
// // // // // // // // // //                 ...questionData, 
// // // // // // // // // //                 createdBy: currentUser.uid,
// // // // // // // // // //                 categoryId: module.id // Tag it
// // // // // // // // // //             });

// // // // // // // // // //             // 2. Automatically link it to this module's array
// // // // // // // // // //             const modRef = doc(db, 'categories', module.id);
// // // // // // // // // //             await updateDoc(modRef, {
// // // // // // // // // //                 questionIds: arrayUnion(qId)
// // // // // // // // // //             });

// // // // // // // // // //             setIsAddingNew(false);
// // // // // // // // // //             onRefresh();
// // // // // // // // // //             alert("Question created and added to module!");
// // // // // // // // // //         } catch (e) { alert("Creation failed."); }
// // // // // // // // // //     };

// // // // // // // // // //     const moduleQuestions = questions.filter(q => module.questionIds?.includes(q.id));

// // // // // // // // // //     return (
// // // // // // // // // //         <div className="space-y-6 animate-in fade-in zoom-in duration-300">
// // // // // // // // // //             {/* Header Area */}
// // // // // // // // // //             <div className="flex justify-between items-center bg-gray-800 p-6 rounded-2xl border border-gray-700">
// // // // // // // // // //                 <div>
// // // // // // // // // //                     <button onClick={onBack} className="text-blue-400 text-xs font-bold mb-2 block hover:underline">← Back to Modules</button>
// // // // // // // // // //                     <h2 className="text-3xl font-black text-white uppercase tracking-tight">{module.name}</h2>
// // // // // // // // // //                     <p className="text-gray-500 text-xs mt-1">
// // // // // // // // // //                         {module.accessType === 'global' ? '🌍 Global Learning Path' : `🔐 Selective Access: ${module.allowedColleges?.length} Colleges`}
// // // // // // // // // //                     </p>
// // // // // // // // // //                 </div>
// // // // // // // // // //                 <div className="flex gap-3">
// // // // // // // // // //                     <button 
// // // // // // // // // //                         onClick={() => setIsAddingNew(!isAddingNew)} 
// // // // // // // // // //                         className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2 rounded-lg text-sm font-black transition-all"
// // // // // // // // // //                     >
// // // // // // // // // //                         {isAddingNew ? 'Cancel' : '+ New Question'}
// // // // // // // // // //                     </button>
// // // // // // // // // //                 </div>
// // // // // // // // // //             </div>

// // // // // // // // // //             {isAddingNew ? (
// // // // // // // // // //                 <div className="bg-gray-800 p-8 rounded-2xl border border-purple-500/30">
// // // // // // // // // //                     <h3 className="text-white font-bold mb-6">Create Question for {module.name}</h3>
// // // // // // // // // //                     <QuestionForm onSubmit={handleCreateInModule} />
// // // // // // // // // //                 </div>
// // // // // // // // // //             ) : (
// // // // // // // // // //                 <div className="grid grid-cols-1 gap-4">
// // // // // // // // // //                     {moduleQuestions.length > 0 ? (
// // // // // // // // // //                         moduleQuestions.map((q, idx) => (
// // // // // // // // // //                             <div key={q.id} className="bg-gray-800 p-5 rounded-xl border border-gray-700 flex justify-between items-center hover:border-gray-600 transition-all group">
// // // // // // // // // //                                 <div className="flex items-center gap-4">
// // // // // // // // // //                                     <span className="text-gray-600 font-mono text-xs">0{idx + 1}</span>
// // // // // // // // // //                                     <div>
// // // // // // // // // //                                         <h4 className="font-bold text-gray-200">{q.title}</h4>
// // // // // // // // // //                                         <div className="flex gap-2 mt-1">
// // // // // // // // // //                                             <span className="text-[9px] bg-gray-900 px-2 py-0.5 rounded text-gray-500 uppercase font-bold">{q.type}</span>
// // // // // // // // // //                                             <span className="text-[9px] bg-blue-900/20 px-2 py-0.5 rounded text-blue-400 uppercase font-bold">{q.difficulty || 'Medium'}</span>
// // // // // // // // // //                                         </div>
// // // // // // // // // //                                     </div>
// // // // // // // // // //                                 </div>
// // // // // // // // // //                                 <div className="flex items-center gap-4">
// // // // // // // // // //                                     <button 
// // // // // // // // // //                                         onClick={() => window.open(`/practice/${q.id}`, '_blank')}
// // // // // // // // // //                                         className="opacity-0 group-hover:opacity-100 text-xs text-green-400 font-bold hover:underline transition-all"
// // // // // // // // // //                                     >
// // // // // // // // // //                                         Run Test
// // // // // // // // // //                                     </button>
// // // // // // // // // //                                     <button 
// // // // // // // // // //                                         onClick={() => handleUnlinkQuestion(q.id)}
// // // // // // // // // //                                         className="text-gray-500 hover:text-red-500 transition-colors"
// // // // // // // // // //                                     >
// // // // // // // // // //                                         <span className="text-xl">🗑️</span>
// // // // // // // // // //                                     </button>
// // // // // // // // // //                                 </div>
// // // // // // // // // //                             </div>
// // // // // // // // // //                         ))
// // // // // // // // // //                     ) : (
// // // // // // // // // //                         <div className="bg-gray-800/50 border-2 border-dashed border-gray-700 p-20 rounded-3xl text-center">
// // // // // // // // // //                             <p className="text-gray-500 italic">No questions in this track yet. Click "New Question" to start building.</p>
// // // // // // // // // //                         </div>
// // // // // // // // // //                     )}
// // // // // // // // // //                 </div>
// // // // // // // // // //             )}
// // // // // // // // // //         </div>
// // // // // // // // // //     );
// // // // // // // // // // };

// // // // // // // // // // export default ModuleDetailView;

















// // // // // // // // // import React, { useState } from 'react';
// // // // // // // // // import { doc, updateDoc, arrayRemove, arrayUnion } from 'firebase/firestore';
// // // // // // // // // import { db } from '../../firebase/config';
// // // // // // // // // import QuestionForm from './QuestionForm';
// // // // // // // // // import { createQuestion } from '../../api/examService';

// // // // // // // // // // Notice the "export const" here instead of export default at the bottom
// // // // // // // // // export const ModuleDetailView = ({ module, questions, onBack, onRefresh, currentUser }) => {
// // // // // // // // //     const [isAddingNew, setIsAddingNew] = useState(false);

// // // // // // // // //     const handleUnlinkQuestion = async (qId) => {
// // // // // // // // //         if (!window.confirm("Unlink this question from the module? (It will remain in the global bank)")) return;
// // // // // // // // //         try {
// // // // // // // // //             const modRef = doc(db, 'categories', module.id);
// // // // // // // // //             await updateDoc(modRef, {
// // // // // // // // //                 questionIds: arrayRemove(qId)
// // // // // // // // //             });
// // // // // // // // //             onRefresh();
// // // // // // // // //         } catch (e) { alert("Failed to unlink."); }
// // // // // // // // //     };

// // // // // // // // //     const handleCreateInModule = async (questionData) => {
// // // // // // // // //         try {
// // // // // // // // //             const qId = await createQuestion({ 
// // // // // // // // //                 ...questionData, 
// // // // // // // // //                 createdBy: currentUser.uid,
// // // // // // // // //                 categoryId: module.id 
// // // // // // // // //             });

// // // // // // // // //             const modRef = doc(db, 'categories', module.id);
// // // // // // // // //             await updateDoc(modRef, {
// // // // // // // // //                 questionIds: arrayUnion(qId)
// // // // // // // // //             });

// // // // // // // // //             setIsAddingNew(false);
// // // // // // // // //             onRefresh();
// // // // // // // // //             alert("Question created and added to module!");
// // // // // // // // //         } catch (e) { alert("Creation failed."); }
// // // // // // // // //     };

// // // // // // // // //     const moduleQuestions = questions.filter(q => module.questionIds?.includes(q.id));

// // // // // // // // //     return (
// // // // // // // // //         <div className="space-y-6 animate-in fade-in zoom-in duration-300">
// // // // // // // // //             <div className="flex justify-between items-center bg-gray-800 p-6 rounded-2xl border border-gray-700">
// // // // // // // // //                 <div>
// // // // // // // // //                     <button onClick={onBack} className="text-blue-400 text-xs font-bold mb-2 block hover:underline">← Back to Modules</button>
// // // // // // // // //                     <h2 className="text-3xl font-black text-white uppercase tracking-tight">{module.name}</h2>
// // // // // // // // //                     <p className="text-gray-500 text-xs mt-1">
// // // // // // // // //                         {module.accessType === 'global' ? '🌍 Global Learning Path' : `🔐 Selective Access: ${module.allowedColleges?.length} Colleges`}
// // // // // // // // //                     </p>
// // // // // // // // //                 </div>
// // // // // // // // //                 <div className="flex gap-3">
// // // // // // // // //                     <button 
// // // // // // // // //                         onClick={() => setIsAddingNew(!isAddingNew)} 
// // // // // // // // //                         className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2 rounded-lg text-sm font-black transition-all"
// // // // // // // // //                     >
// // // // // // // // //                         {isAddingNew ? 'Cancel' : '+ New Question'}
// // // // // // // // //                     </button>
// // // // // // // // //                 </div>
// // // // // // // // //             </div>

// // // // // // // // //             {isAddingNew ? (
// // // // // // // // //                 <div className="bg-gray-800 p-8 rounded-2xl border border-purple-500/30">
// // // // // // // // //                     <h3 className="text-white font-bold mb-6">Create Question for {module.name}</h3>
// // // // // // // // //                     <QuestionForm onSubmit={handleCreateInModule} />
// // // // // // // // //                 </div>
// // // // // // // // //             ) : (
// // // // // // // // //                 <div className="grid grid-cols-1 gap-4">
// // // // // // // // //                     {moduleQuestions.length > 0 ? (
// // // // // // // // //                         moduleQuestions.map((q, idx) => (
// // // // // // // // //                             <div key={q.id} className="bg-gray-800 p-5 rounded-xl border border-gray-700 flex justify-between items-center hover:border-gray-600 transition-all group">
// // // // // // // // //                                 <div className="flex items-center gap-4">
// // // // // // // // //                                     <span className="text-gray-600 font-mono text-xs">0{idx + 1}</span>
// // // // // // // // //                                     <div>
// // // // // // // // //                                         <h4 className="font-bold text-gray-200">{q.title}</h4>
// // // // // // // // //                                         <div className="flex gap-2 mt-1">
// // // // // // // // //                                             <span className="text-[9px] bg-gray-900 px-2 py-0.5 rounded text-gray-500 uppercase font-bold">{q.type}</span>
// // // // // // // // //                                             <span className="text-[9px] bg-blue-900/20 px-2 py-0.5 rounded text-blue-400 uppercase font-bold">{q.difficulty || 'Medium'}</span>
// // // // // // // // //                                         </div>
// // // // // // // // //                                     </div>
// // // // // // // // //                                 </div>
// // // // // // // // //                                 <div className="flex items-center gap-4">
// // // // // // // // //                                     <button 
// // // // // // // // //                                         onClick={() => window.open(`/practice/${q.id}`, '_blank')}
// // // // // // // // //                                         className="opacity-0 group-hover:opacity-100 text-xs text-green-400 font-bold hover:underline transition-all"
// // // // // // // // //                                     >
// // // // // // // // //                                         Run Test
// // // // // // // // //                                     </button>
// // // // // // // // //                                     <button 
// // // // // // // // //                                         onClick={() => handleUnlinkQuestion(q.id)}
// // // // // // // // //                                         className="text-gray-500 hover:text-red-500 transition-colors"
// // // // // // // // //                                     >
// // // // // // // // //                                         <span className="text-xl">🗑️</span>
// // // // // // // // //                                     </button>
// // // // // // // // //                                 </div>
// // // // // // // // //                             </div>
// // // // // // // // //                         ))
// // // // // // // // //                     ) : (
// // // // // // // // //                         <div className="bg-gray-800/50 border-2 border-dashed border-gray-700 p-20 rounded-3xl text-center">
// // // // // // // // //                             <p className="text-gray-500 italic">No questions in this track yet. Click "New Question" to start building.</p>
// // // // // // // // //                         </div>
// // // // // // // // //                     )}
// // // // // // // // //                 </div>
// // // // // // // // //             )}
// // // // // // // // //         </div>
// // // // // // // // //     );
// // // // // // // // // };


// // // // // // // // ////

// // // // // // // // import React, { useState } from 'react';
// // // // // // // // import { doc, updateDoc, arrayRemove, arrayUnion } from 'firebase/firestore';
// // // // // // // // import { db } from '../../firebase/config';
// // // // // // // // import QuestionForm from './QuestionForm';
// // // // // // // // import { createQuestion } from '../../api/examService';

// // // // // // // // export const ModuleDetailView = ({ module, questions, onBack, onRefresh, currentUser }) => {
// // // // // // // //     const [isAddingNew, setIsAddingNew] = useState(false);

// // // // // // // //     const handleUnlinkQuestion = async (qId) => {
// // // // // // // //         if (!window.confirm("Unlink this question from the module? (It will remain in the global bank)")) return;
// // // // // // // //         try {
// // // // // // // //             const modRef = doc(db, 'categories', module.id);
// // // // // // // //             await updateDoc(modRef, {
// // // // // // // //                 questionIds: arrayRemove(qId)
// // // // // // // //             });
// // // // // // // //             onRefresh();
// // // // // // // //         } catch (e) { alert("Failed to unlink."); }
// // // // // // // //     };

// // // // // // // //     const handleCreateInModule = async (questionData) => {
// // // // // // // //         try {
// // // // // // // //             const qId = await createQuestion({ 
// // // // // // // //                 ...questionData, 
// // // // // // // //                 createdBy: currentUser.uid,
// // // // // // // //                 categoryId: module.id 
// // // // // // // //             });

// // // // // // // //             const modRef = doc(db, 'categories', module.id);
// // // // // // // //             await updateDoc(modRef, {
// // // // // // // //                 questionIds: arrayUnion(qId)
// // // // // // // //             });

// // // // // // // //             setIsAddingNew(false);
// // // // // // // //             onRefresh();
// // // // // // // //             alert("Question created and added to module!");
// // // // // // // //         } catch (e) { alert("Creation failed."); }
// // // // // // // //     };

// // // // // // // //     // Correctly filters ALL questions passed down using the module's linked IDs
// // // // // // // //     const moduleQuestions = questions.filter(q => (module.questionIds || []).includes(q.id));

// // // // // // // //     return (
// // // // // // // //         <div className="space-y-6 animate-in fade-in zoom-in duration-300">
// // // // // // // //             <div className="flex justify-between items-center bg-gray-800 p-6 rounded-2xl border border-gray-700">
// // // // // // // //                 <div>
// // // // // // // //                     <button onClick={onBack} className="text-blue-400 text-xs font-bold mb-2 block hover:underline">← Back to Modules</button>
// // // // // // // //                     <h2 className="text-3xl font-black text-white uppercase tracking-tight">{module.name}</h2>
// // // // // // // //                     <p className="text-gray-500 text-xs mt-1">
// // // // // // // //                         {module.accessType === 'global' ? '🌍 Global Learning Path' : `🔐 Selective Access: ${module.allowedColleges?.length} Colleges`}
// // // // // // // //                     </p>
// // // // // // // //                 </div>
// // // // // // // //                 <div className="flex gap-3">
// // // // // // // //                     <button 
// // // // // // // //                         onClick={() => setIsAddingNew(!isAddingNew)} 
// // // // // // // //                         className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2 rounded-lg text-sm font-black transition-all"
// // // // // // // //                     >
// // // // // // // //                         {isAddingNew ? 'Cancel' : '+ New Question'}
// // // // // // // //                     </button>
// // // // // // // //                 </div>
// // // // // // // //             </div>

// // // // // // // //             {isAddingNew ? (
// // // // // // // //                 <div className="bg-gray-800 p-8 rounded-2xl border border-purple-500/30">
// // // // // // // //                     <h3 className="text-white font-bold mb-6">Create Question for {module.name}</h3>
// // // // // // // //                     <QuestionForm onSubmit={handleCreateInModule} />
// // // // // // // //                 </div>
// // // // // // // //             ) : (
// // // // // // // //                 <div className="grid grid-cols-1 gap-4">
// // // // // // // //                     {moduleQuestions.length > 0 ? (
// // // // // // // //                         moduleQuestions.map((q, idx) => (
// // // // // // // //                             <div key={q.id} className="bg-gray-800 p-5 rounded-xl border border-gray-700 flex justify-between items-center hover:border-gray-600 transition-all group">
// // // // // // // //                                 <div className="flex items-center gap-4">
// // // // // // // //                                     <span className="text-gray-600 font-mono text-xs">0{idx + 1}</span>
// // // // // // // //                                     <div>
// // // // // // // //                                         {/* FIXED: Handles both Coding (q.title) and MCQs (q.question) properly */}
// // // // // // // //                                         <h4 className="font-bold text-gray-200">{q.title || q.question || "Untitled"}</h4>
// // // // // // // //                                         <div className="flex gap-2 mt-1">
// // // // // // // //                                             <span className="text-[9px] bg-gray-900 px-2 py-0.5 rounded text-gray-500 uppercase font-bold">{q.type}</span>
// // // // // // // //                                             {q.difficulty && <span className="text-[9px] bg-blue-900/20 px-2 py-0.5 rounded text-blue-400 uppercase font-bold">{q.difficulty}</span>}
// // // // // // // //                                         </div>
// // // // // // // //                                     </div>
// // // // // // // //                                 </div>
// // // // // // // //                                 <div className="flex items-center gap-4">
// // // // // // // //                                     <button 
// // // // // // // //                                         onClick={() => window.open(`/practice/${q.id}`, '_blank')}
// // // // // // // //                                         className="opacity-0 group-hover:opacity-100 text-xs text-green-400 font-bold hover:underline transition-all"
// // // // // // // //                                     >
// // // // // // // //                                         Run Test
// // // // // // // //                                     </button>
// // // // // // // //                                     <button 
// // // // // // // //                                         onClick={() => handleUnlinkQuestion(q.id)}
// // // // // // // //                                         className="text-gray-500 hover:text-red-500 transition-colors"
// // // // // // // //                                     >
// // // // // // // //                                         <span className="text-xl">🗑️</span>
// // // // // // // //                                     </button>
// // // // // // // //                                 </div>
// // // // // // // //                             </div>
// // // // // // // //                         ))
// // // // // // // //                     ) : (
// // // // // // // //                         <div className="bg-gray-800/50 border-2 border-dashed border-gray-700 p-20 rounded-3xl text-center">
// // // // // // // //                             <p className="text-gray-500 italic">No questions in this track yet. Add from the Quick Add menu on the dashboard or click "New Question".</p>
// // // // // // // //                         </div>
// // // // // // // //                     )}
// // // // // // // //                 </div>
// // // // // // // //             )}
// // // // // // // //         </div>
// // // // // // // //     );
// // // // // // // // };

// // // // // // // ////


// // // // // // // import React, { useState, useEffect, useCallback } from "react";
// // // // // // // import {
// // // // // // //   collection, getDocs, addDoc, doc, updateDoc, deleteDoc,
// // // // // // //   query, where, serverTimestamp, arrayUnion, arrayRemove, getDoc
// // // // // // // } from "firebase/firestore";
// // // // // // // import { db } from "../../firebase/config";
// // // // // // // import LearningModules from "./LearningModules";

// // // // // // // // ─── Difficulty colors ───────────────────────────────────────────
// // // // // // // const diffBg  = { Easy:"rgba(16,185,129,.15)",  Medium:"rgba(245,158,11,.15)",  Hard:"rgba(239,68,68,.15)"  };
// // // // // // // const diffCol = { Easy:"#34d399",               Medium:"#fbbf24",               Hard:"#f87171"              };
// // // // // // // const DIFFS   = ["Easy","Medium","Hard"];

// // // // // // // // ─── Shared styles ───────────────────────────────────────────────
// // // // // // // const S = {
// // // // // // //   card:  (b="#334155") => ({ background:"rgba(30,41,59,0.7)", border:`1px solid ${b}`, borderRadius:"1.25rem", padding:"1.5rem" }),
// // // // // // //   badge: (bg,col)      => ({ fontSize:"0.6rem", fontWeight:800, padding:"0.15rem 0.5rem", borderRadius:"0.3rem", background:bg, color:col }),
// // // // // // //   btn:   (bg,col,bdr)  => ({ padding:"0.35rem 0.8rem", borderRadius:"0.6rem", background:bg, border:`1px solid ${bdr}`, color:col, fontWeight:800, fontSize:"0.7rem", cursor:"pointer" }),
// // // // // // //   input: { background:"#0f172a", border:"1px solid #334155", borderRadius:"0.6rem", padding:"0.5rem 0.875rem", color:"#f1f5f9", fontSize:"0.82rem", outline:"none", width:"100%" },
// // // // // // //   label: { fontSize:"0.6rem", fontWeight:900, color:"#475569", letterSpacing:"0.12em", textTransform:"uppercase", display:"block", marginBottom:"0.4rem" },
// // // // // // // };

// // // // // // // // ════════════════════════════════════════════════════════════════
// // // // // // // //  TOPIC ROW — expandable, fetches + shows questions
// // // // // // // // ════════════════════════════════════════════════════════════════
// // // // // // // const TopicRow = ({ topic, topicIdx, moduleId, moduleName, moduleType, onRefresh }) => {
// // // // // // //   const [open, setOpen]             = useState(false);
// // // // // // //   const [questions, setQuestions]   = useState([]);
// // // // // // //   const [loadingQs, setLoadingQs]   = useState(false);
// // // // // // //   const [showForm, setShowForm]     = useState(false);
// // // // // // //   const [saving, setSaving]         = useState(false);

// // // // // // //   // Form state
// // // // // // //   const [qTitle,   setQTitle]   = useState("");
// // // // // // //   const [qType,    setQType]    = useState(moduleType==="Tech MCQs"||moduleType==="Non-Tech MCQs"?"MCQ":"CODING");
// // // // // // //   const [qDiff,    setQDiff]    = useState("Easy");
// // // // // // //   const [qTags,    setQTags]    = useState("");
// // // // // // //   const [qDesc,    setQDesc]    = useState("");
// // // // // // //   const [qOptions, setQOptions] = useState(["","","",""]);
// // // // // // //   const [qCorrect, setQCorrect] = useState(0);
// // // // // // //   const [qExp,     setQExp]     = useState("");

// // // // // // //   // ── Fetch questions for this topic ──────────────────────────
// // // // // // //   const fetchQs = useCallback(async () => {
// // // // // // //     setLoadingQs(true);
// // // // // // //     let found = [];
// // // // // // //     try {
// // // // // // //       // 1. By questionIds stored on topic
// // // // // // //       const ids = topic.questionIds || [];
// // // // // // //       if (ids.length > 0) {
// // // // // // //         const snaps = await Promise.all(ids.map(id => getDoc(doc(db, "questions", id))));
// // // // // // //         found = snaps.filter(d => d.exists()).map(d => ({ id: d.id, ...d.data() }));
// // // // // // //       }

// // // // // // //       // 2. By category + topicName field
// // // // // // //       const s2 = await getDocs(query(collection(db, "questions"),
// // // // // // //         where("category", "==", moduleName),
// // // // // // //         where("topicName", "==", topic.name)
// // // // // // //       ));
// // // // // // //       s2.forEach(d => { if (!found.find(q => q.id===d.id)) found.push({ id:d.id, ...d.data() }); });

// // // // // // //       // 3. Fallback — by category only (catches old data with no topicName)
// // // // // // //       if (found.length === 0) {
// // // // // // //         const s3 = await getDocs(query(collection(db, "questions"), where("category", "==", moduleName)));
// // // // // // //         s3.forEach(d => { if (!found.find(q => q.id===d.id)) found.push({ id:d.id, ...d.data() }); });
// // // // // // //       }
// // // // // // //     } catch(e) { console.error("fetchQs:", e); }
// // // // // // //     setQuestions(found);
// // // // // // //     setLoadingQs(false);
// // // // // // //   }, [topic, moduleName]);

// // // // // // //   useEffect(() => { if (open) fetchQs(); }, [open, fetchQs]);

// // // // // // //   // ── Save new question ────────────────────────────────────────
// // // // // // //   const handleSave = async () => {
// // // // // // //     if (!qTitle.trim()) { alert("Title required"); return; }
// // // // // // //     if (qType==="MCQ" && qOptions.some(o=>!o.trim())) { alert("All 4 options required"); return; }
// // // // // // //     setSaving(true);
// // // // // // //     try {
// // // // // // //       const payload = {
// // // // // // //         title:      qType==="CODING" ? qTitle.trim() : "",
// // // // // // //         question:   qType==="MCQ"    ? qTitle.trim() : "",
// // // // // // //         type: qType, moduleType, category: moduleName,
// // // // // // //         topicName: topic.name, topicIdx,
// // // // // // //         difficulty: qDiff, tags: qTags.trim(), description: qDesc.trim(),
// // // // // // //         ...(qType==="MCQ" && { options:qOptions, correctIndex:qCorrect, explanation:qExp.trim() }),
// // // // // // //         createdAt: serverTimestamp(),
// // // // // // //       };
// // // // // // //       const ref = await addDoc(collection(db, "questions"), payload);

// // // // // // //       // Link ID to topic in module doc
// // // // // // //       const modSnap = await getDoc(doc(db, "categories", moduleId));
// // // // // // //       if (modSnap.exists()) {
// // // // // // //         const data = modSnap.data();
// // // // // // //         const ts   = data.topics || data.topicList || [];
// // // // // // //         if (ts.length > 0) {
// // // // // // //           const updated = ts.map((t,i) => i===topicIdx ? { ...t, questionIds:[...(t.questionIds||[]),ref.id] } : t);
// // // // // // //           await updateDoc(doc(db, "categories", moduleId), { topics:updated });
// // // // // // //         } else {
// // // // // // //           await updateDoc(doc(db, "categories", moduleId), { questionIds: arrayUnion(ref.id) });
// // // // // // //         }
// // // // // // //       }

// // // // // // //       setQTitle(""); setQTags(""); setQDesc(""); setQOptions(["","","",""]); setQCorrect(0); setQExp("");
// // // // // // //       setShowForm(false);
// // // // // // //       fetchQs();
// // // // // // //       onRefresh && onRefresh();
// // // // // // //     } catch(e) { alert("Save failed: "+e.message); }
// // // // // // //     setSaving(false);
// // // // // // //   };

// // // // // // //   // ── Delete question ──────────────────────────────────────────
// // // // // // //   const handleDel = async (q) => {
// // // // // // //     if (!window.confirm(`Delete "${q.title||q.question}"?`)) return;
// // // // // // //     try {
// // // // // // //       await deleteDoc(doc(db, "questions", q.id));
// // // // // // //       try { await updateDoc(doc(db, "categories", moduleId), { questionIds: arrayRemove(q.id) }); } catch {}
// // // // // // //       fetchQs();
// // // // // // //       onRefresh && onRefresh();
// // // // // // //     } catch(e) { alert("Delete failed"); }
// // // // // // //   };

// // // // // // //   const setOpt = (i,v) => { const a=[...qOptions]; a[i]=v; setQOptions(a); };
// // // // // // //   const mcqC   = questions.filter(q=>q.type==="MCQ").length;
// // // // // // //   const codC   = questions.filter(q=>q.type==="CODING").length;

// // // // // // //   return (
// // // // // // //     <div style={{ background:"rgba(30,41,59,0.6)", border:`1px solid ${open?"#3b82f6":"#334155"}`, borderRadius:"0.875rem", overflow:"hidden", transition:"border-color .2s" }}>

// // // // // // //       {/* header */}
// // // // // // //       <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"0.85rem 1.1rem", cursor:"pointer" }} onClick={()=>setOpen(o=>!o)}>
// // // // // // //         <div style={{ display:"flex", alignItems:"center", gap:"0.75rem" }}>
// // // // // // //           <div style={{ width:"1.25rem", height:"1.25rem", borderRadius:"50%", background:(topic.questionIds?.length||0)>0?"#10b981":"#1e293b", border:`2px solid ${(topic.questionIds?.length||0)>0?"#10b981":"#334155"}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
// // // // // // //             {(topic.questionIds?.length||0)>0 && <span style={{ fontSize:"0.5rem", color:"#fff" }}>✓</span>}
// // // // // // //           </div>
// // // // // // //           <div>
// // // // // // //             <p style={{ fontWeight:800, fontSize:"0.875rem", color:"#e2e8f0", margin:0 }}>
// // // // // // //               <span style={{ fontSize:"0.58rem", color:"#64748b", marginRight:"0.35rem", textTransform:"uppercase", letterSpacing:"0.08em" }}>TOPIC</span>
// // // // // // //               {topic.name}
// // // // // // //             </p>
// // // // // // //             <p style={{ fontSize:"0.62rem", color:"#64748b", margin:0 }}>
// // // // // // //               {topic.subtopics?.length||0} subtopics · {topic.questionIds?.length||0} questions
// // // // // // //               {codC>0 && <span style={{ marginLeft:"0.35rem", color:"#10b981" }}>· 💻 {codC}</span>}
// // // // // // //               {mcqC>0 && <span style={{ marginLeft:"0.35rem", color:"#f59e0b" }}>· 🧠 {mcqC}</span>}
// // // // // // //             </p>
// // // // // // //           </div>
// // // // // // //         </div>
// // // // // // //         <span style={{ color:"#475569", fontSize:"0.75rem", transform:open?"rotate(180deg)":"rotate(0)", transition:"transform .2s", display:"inline-block" }}>▼</span>
// // // // // // //       </div>

// // // // // // //       {/* body */}
// // // // // // //       {open && (
// // // // // // //         <div style={{ borderTop:"1px solid #1e293b", padding:"1rem" }}>

// // // // // // //           {/* toolbar */}
// // // // // // //           <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"0.75rem" }}>
// // // // // // //             <span style={{ fontSize:"0.6rem", fontWeight:900, color:"#475569", textTransform:"uppercase", letterSpacing:"0.1em" }}>
// // // // // // //               Questions ({questions.length})
// // // // // // //             </span>
// // // // // // //             <button onClick={e=>{e.stopPropagation();setShowForm(f=>!f);}}
// // // // // // //               style={S.btn("rgba(59,130,246,.15)","#60a5fa","rgba(59,130,246,.35)")}>
// // // // // // //               {showForm ? "✕ Cancel" : "+ New Question"}
// // // // // // //             </button>
// // // // // // //           </div>

// // // // // // //           {/* add form */}
// // // // // // //           {showForm && (
// // // // // // //             <div style={{ background:"rgba(15,23,42,0.7)", border:"1px solid #334155", borderRadius:"0.75rem", padding:"1rem", marginBottom:"0.75rem" }}>
// // // // // // //               <p style={{ ...S.label, color:"#60a5fa", marginBottom:"0.75rem" }}>New Question — {topic.name}</p>

// // // // // // //               {/* type toggle */}
// // // // // // //               <div style={{ display:"flex", gap:"0.4rem", marginBottom:"0.75rem" }}>
// // // // // // //                 {(moduleType==="Coding"?["CODING"]:moduleType==="Tech MCQs"||moduleType==="Non-Tech MCQs"?["MCQ"]:["CODING","MCQ"]).map(t=>(
// // // // // // //                   <button key={t} type="button" onClick={()=>setQType(t)}
// // // // // // //                     style={{ padding:"0.3rem 0.8rem", borderRadius:"0.5rem", fontWeight:800, fontSize:"0.65rem", border:"none", cursor:"pointer",
// // // // // // //                       background:qType===t?(t==="MCQ"?"#f59e0b":"#10b981"):"rgba(255,255,255,0.05)",
// // // // // // //                       color:qType===t?"#fff":"#64748b" }}>
// // // // // // //                     {t==="MCQ"?"🧠 MCQ":"💻 Coding"}
// // // // // // //                   </button>
// // // // // // //                 ))}
// // // // // // //               </div>

// // // // // // //               {/* title */}
// // // // // // //               <div style={{ marginBottom:"0.6rem" }}>
// // // // // // //                 <label style={S.label}>{qType==="MCQ"?"Question *":"Title *"}</label>
// // // // // // //                 <input value={qTitle} onChange={e=>setQTitle(e.target.value)}
// // // // // // //                   placeholder={qType==="MCQ"?"What is an array?":"Two Sum"} style={S.input} />
// // // // // // //               </div>

// // // // // // //               {/* coding fields */}
// // // // // // //               {qType==="CODING" && (
// // // // // // //                 <>
// // // // // // //                   <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.5rem", marginBottom:"0.6rem" }}>
// // // // // // //                     <div>
// // // // // // //                       <label style={S.label}>Difficulty</label>
// // // // // // //                       <div style={{ display:"flex", gap:"0.25rem" }}>
// // // // // // //                         {DIFFS.map(d=>(
// // // // // // //                           <button key={d} type="button" onClick={()=>setQDiff(d)}
// // // // // // //                             style={{ flex:1, padding:"0.3rem 0", borderRadius:"0.4rem", fontWeight:800, fontSize:"0.62rem", border:`1px solid ${qDiff===d?diffCol[d]:"#334155"}`, background:qDiff===d?diffBg[d]:"transparent", color:qDiff===d?diffCol[d]:"#64748b", cursor:"pointer" }}>
// // // // // // //                             {d}
// // // // // // //                           </button>
// // // // // // //                         ))}
// // // // // // //                       </div>
// // // // // // //                     </div>
// // // // // // //                     <div>
// // // // // // //                       <label style={S.label}>Tags</label>
// // // // // // //                       <input value={qTags} onChange={e=>setQTags(e.target.value)} placeholder="arrays, loops" style={S.input} />
// // // // // // //                     </div>
// // // // // // //                   </div>
// // // // // // //                   <div style={{ marginBottom:"0.6rem" }}>
// // // // // // //                     <label style={S.label}>Description</label>
// // // // // // //                     <textarea value={qDesc} onChange={e=>setQDesc(e.target.value)} rows={2} placeholder="Problem statement..." style={{ ...S.input, resize:"none" }} />
// // // // // // //                   </div>
// // // // // // //                 </>
// // // // // // //               )}

// // // // // // //               {/* mcq fields */}
// // // // // // //               {qType==="MCQ" && (
// // // // // // //                 <>
// // // // // // //                   <div style={{ marginBottom:"0.6rem" }}>
// // // // // // //                     <label style={S.label}>Options — click circle to mark correct</label>
// // // // // // //                     {qOptions.map((opt,i)=>(
// // // // // // //                       <div key={i} style={{ display:"flex", alignItems:"center", gap:"0.5rem", marginBottom:"0.35rem", padding:"0.3rem 0.5rem", borderRadius:"0.5rem", border:`1px solid ${qCorrect===i?"#10b981":"#334155"}`, background:qCorrect===i?"rgba(16,185,129,0.06)":"transparent" }}>
// // // // // // //                         <button type="button" onClick={()=>setQCorrect(i)} style={{ width:"1rem", height:"1rem", borderRadius:"50%", border:`2px solid ${qCorrect===i?"#10b981":"#475569"}`, background:qCorrect===i?"#10b981":"transparent", cursor:"pointer", flexShrink:0 }} />
// // // // // // //                         <span style={{ fontSize:"0.62rem", color:"#64748b", fontWeight:800, width:"14px" }}>{String.fromCharCode(65+i)}.</span>
// // // // // // //                         <input value={opt} onChange={e=>setOpt(i,e.target.value)} placeholder={`Option ${String.fromCharCode(65+i)}`} style={{ ...S.input, padding:"0.25rem 0.4rem", fontSize:"0.75rem" }} />
// // // // // // //                         {qCorrect===i && <span style={{ fontSize:"0.58rem", color:"#10b981", fontWeight:900, whiteSpace:"nowrap" }}>✓</span>}
// // // // // // //                       </div>
// // // // // // //                     ))}
// // // // // // //                   </div>
// // // // // // //                   <div style={{ marginBottom:"0.6rem" }}>
// // // // // // //                     <label style={S.label}>Explanation (optional)</label>
// // // // // // //                     <textarea value={qExp} onChange={e=>setQExp(e.target.value)} rows={2} placeholder="Why is this correct?" style={{ ...S.input, resize:"none" }} />
// // // // // // //                   </div>
// // // // // // //                 </>
// // // // // // //               )}

// // // // // // //               <button onClick={handleSave} disabled={saving}
// // // // // // //                 style={{ padding:"0.5rem 1.25rem", borderRadius:"0.6rem", background:"#3b82f6", color:"#fff", fontWeight:800, fontSize:"0.75rem", border:"none", cursor:"pointer", opacity:saving?0.6:1 }}>
// // // // // // //                 {saving?"Saving...":"Save Question"}
// // // // // // //               </button>
// // // // // // //             </div>
// // // // // // //           )}

// // // // // // //           {/* questions list */}
// // // // // // //           {loadingQs ? (
// // // // // // //             <p style={{ textAlign:"center", color:"#475569", padding:"1rem", fontSize:"0.8rem" }}>Loading questions...</p>
// // // // // // //           ) : questions.length===0 ? (
// // // // // // //             <div style={{ textAlign:"center", padding:"1.5rem", color:"#334155", border:"1px dashed #1e293b", borderRadius:"0.75rem" }}>
// // // // // // //               <p style={{ fontSize:"1.5rem", margin:"0 0 0.4rem" }}>📭</p>
// // // // // // //               <p style={{ fontSize:"0.75rem", color:"#475569" }}>No questions yet. Click "+ New Question" above.</p>
// // // // // // //             </div>
// // // // // // //           ) : (
// // // // // // //             <div style={{ display:"flex", flexDirection:"column", gap:"0.4rem" }}>
// // // // // // //               {questions.map((q,i)=>(
// // // // // // //                 <div key={q.id} style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", padding:"0.7rem 0.875rem", background:"rgba(15,23,42,0.7)", borderRadius:"0.6rem", border:"1px solid #1e293b", gap:"0.75rem" }}>
// // // // // // //                   <div style={{ flex:1, minWidth:0 }}>
// // // // // // //                     <div style={{ display:"flex", alignItems:"center", gap:"0.4rem", marginBottom:"0.2rem", flexWrap:"wrap" }}>
// // // // // // //                       <span style={{ fontSize:"0.6rem", color:"#475569", fontWeight:900 }}>#{i+1}</span>
// // // // // // //                       <span>{q.type==="MCQ"?"🧠":"💻"}</span>
// // // // // // //                       <span style={{ fontWeight:700, fontSize:"0.8rem", color:"#e2e8f0", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{q.title||q.question}</span>
// // // // // // //                     </div>
// // // // // // //                     <div style={{ display:"flex", gap:"0.3rem", flexWrap:"wrap" }}>
// // // // // // //                       {q.difficulty && <span style={S.badge(diffBg[q.difficulty],diffCol[q.difficulty])}>{q.difficulty}</span>}
// // // // // // //                       {q.tags && q.tags.split(",").map(t=>(<span key={t} style={{ fontSize:"0.58rem", background:"rgba(99,102,241,0.12)", color:"#818cf8", padding:"0.1rem 0.35rem", borderRadius:"0.25rem" }}>{t.trim()}</span>))}
// // // // // // //                       {q.type==="MCQ"&&q.options&&<span style={{ fontSize:"0.58rem", color:"#64748b" }}>✓ {q.options[q.correctIndex]}</span>}
// // // // // // //                     </div>
// // // // // // //                   </div>
// // // // // // //                   <button onClick={()=>handleDel(q)} style={S.btn("rgba(239,68,68,.08)","#f87171","rgba(239,68,68,.25)")}>Del</button>
// // // // // // //                 </div>
// // // // // // //               ))}
// // // // // // //             </div>
// // // // // // //           )}
// // // // // // //         </div>
// // // // // // //       )}
// // // // // // //     </div>
// // // // // // //   );
// // // // // // // };

// // // // // // // // ════════════════════════════════════════════════════════════════
// // // // // // // //  MODULE WITH TOPICS — handles topic list + CRUD
// // // // // // // // ════════════════════════════════════════════════════════════════
// // // // // // // const ModuleWithTopics = ({ module, passedQuestions, onBack, onRefresh }) => {
// // // // // // //   const [topics,       setTopics]       = useState([]);
// // // // // // //   const [loading,      setLoading]      = useState(true);
// // // // // // //   const [newTopic,     setNewTopic]     = useState("");
// // // // // // //   const [addingTopic,  setAddingTopic]  = useState(false);

// // // // // // //   const mtColor = { Coding:"#3b82f6", "Tech MCQs":"#10b981", "Non-Tech MCQs":"#f59e0b" };
// // // // // // //   const color   = mtColor[module.moduleType] || "#8b5cf6";

// // // // // // //   const fetchTopics = useCallback(async () => {
// // // // // // //     setLoading(true);
// // // // // // //     try {
// // // // // // //       const snap = await getDoc(doc(db, "categories", module.id));
// // // // // // //       if (snap.exists()) {
// // // // // // //         const data = snap.data();
// // // // // // //         setTopics(data.topics || data.topicList || []);
// // // // // // //       }
// // // // // // //     } catch(e) { console.error(e); }
// // // // // // //     setLoading(false);
// // // // // // //   }, [module.id]);

// // // // // // //   useEffect(() => { fetchTopics(); }, [fetchTopics]);

// // // // // // //   const addTopic = async () => {
// // // // // // //     if (!newTopic.trim()) return;
// // // // // // //     setAddingTopic(true);
// // // // // // //     try {
// // // // // // //       const snap = await getDoc(doc(db, "categories", module.id));
// // // // // // //       const existing = snap.exists() ? (snap.data().topics || snap.data().topicList || []) : [];
// // // // // // //       await updateDoc(doc(db, "categories", module.id), {
// // // // // // //         topics: [...existing, { name: newTopic.trim(), subtopics:[], questionIds:[], content:[] }]
// // // // // // //       });
// // // // // // //       setNewTopic("");
// // // // // // //       fetchTopics();
// // // // // // //     } catch(e) { alert("Failed: "+e.message); }
// // // // // // //     setAddingTopic(false);
// // // // // // //   };

// // // // // // //   const delTopic = async (idx) => {
// // // // // // //     if (!window.confirm("Delete this topic?")) return;
// // // // // // //     try {
// // // // // // //       const snap = await getDoc(doc(db, "categories", module.id));
// // // // // // //       const ts   = snap.data().topics || snap.data().topicList || [];
// // // // // // //       await updateDoc(doc(db, "categories", module.id), { topics: ts.filter((_,i)=>i!==idx) });
// // // // // // //       fetchTopics();
// // // // // // //     } catch(e) { alert("Delete failed"); }
// // // // // // //   };

// // // // // // //   return (
// // // // // // //     <div style={{ display:"flex", flexDirection:"column", gap:"1.5rem" }}>

// // // // // // //       {/* header */}
// // // // // // //       <div style={{ display:"flex", alignItems:"center", gap:"1rem", padding:"1.25rem", background:"rgba(30,41,59,0.7)", border:"1px solid #334155", borderRadius:"1.25rem" }}>
// // // // // // //         <button onClick={onBack} style={S.btn("rgba(59,130,246,.1)","#60a5fa","rgba(59,130,246,.25)")}>← Back to Modules</button>
// // // // // // //         <div style={{ flex:1 }}>
// // // // // // //           <h2 style={{ fontSize:"1.25rem", fontWeight:900, color:"#f1f5f9", textTransform:"uppercase", margin:0 }}>{module.name}</h2>
// // // // // // //           <div style={{ display:"flex", gap:"0.4rem", marginTop:"0.35rem" }}>
// // // // // // //             {module.moduleType && <span style={S.badge(`${color}22`,color)}>{module.moduleType}</span>}
// // // // // // //             <span style={S.badge(module.accessType==="global"?"rgba(59,130,246,.15)":"rgba(139,92,246,.15)", module.accessType==="global"?"#60a5fa":"#a78bfa")}>{module.accessType}</span>
// // // // // // //             <span style={S.badge("rgba(99,102,241,.12)","#818cf8")}>{topics.length} topics</span>
// // // // // // //           </div>
// // // // // // //         </div>
// // // // // // //       </div>

// // // // // // //       {/* add topic */}
// // // // // // //       <div style={S.card()}>
// // // // // // //         <label style={S.label}>+ Add Topic to {module.name}</label>
// // // // // // //         <div style={{ display:"flex", gap:"0.6rem" }}>
// // // // // // //           <input value={newTopic} onChange={e=>setNewTopic(e.target.value)}
// // // // // // //             onKeyDown={e=>e.key==="Enter"&&addTopic()}
// // // // // // //             placeholder="e.g., Aptitude, Arrays, SQL Joins"
// // // // // // //             style={{ ...S.input, flex:1 }} />
// // // // // // //           <button onClick={addTopic} disabled={addingTopic}
// // // // // // //             style={{ padding:"0.5rem 1.25rem", borderRadius:"0.6rem", background:color, color:"#fff", fontWeight:800, fontSize:"0.75rem", border:"none", cursor:"pointer", opacity:addingTopic?0.6:1, whiteSpace:"nowrap" }}>
// // // // // // //             {addingTopic?"...":"+ Add Topic"}
// // // // // // //           </button>
// // // // // // //         </div>
// // // // // // //       </div>

// // // // // // //       {/* topics */}
// // // // // // //       {loading ? (
// // // // // // //         <p style={{ textAlign:"center", padding:"3rem", color:"#475569" }}>Loading topics...</p>
// // // // // // //       ) : topics.length===0 ? (
// // // // // // //         <div style={{ ...S.card(), textAlign:"center" }}>
// // // // // // //           <p style={{ fontSize:"2rem", margin:"0 0 0.5rem" }}>📂</p>
// // // // // // //           <p style={{ color:"#475569", fontSize:"0.85rem" }}>No topics yet — add one above.</p>
// // // // // // //           {passedQuestions?.length > 0 && (
// // // // // // //             <p style={{ color:"#334155", fontSize:"0.75rem", marginTop:"0.35rem" }}>
// // // // // // //               You have {passedQuestions.length} question(s) linked to this module. Add a topic to organise them.
// // // // // // //             </p>
// // // // // // //           )}
// // // // // // //         </div>
// // // // // // //       ) : (
// // // // // // //         <div style={{ display:"flex", flexDirection:"column", gap:"0.75rem" }}>
// // // // // // //           {topics.map((topic,idx)=>(
// // // // // // //             <div key={idx} style={{ position:"relative" }}>
// // // // // // //               <TopicRow
// // // // // // //                 topic={topic} topicIdx={idx}
// // // // // // //                 moduleId={module.id} moduleName={module.name} moduleType={module.moduleType}
// // // // // // //                 onRefresh={()=>{ fetchTopics(); onRefresh&&onRefresh(); }}
// // // // // // //               />
// // // // // // //               <button onClick={()=>delTopic(idx)}
// // // // // // //                 style={{ position:"absolute", top:"0.55rem", right:"2.75rem", ...S.btn("rgba(239,68,68,.08)","#f87171","rgba(239,68,68,.2)"), fontSize:"0.6rem", padding:"0.2rem 0.55rem" }}>
// // // // // // //                 🗑
// // // // // // //               </button>
// // // // // // //             </div>
// // // // // // //           ))}
// // // // // // //         </div>
// // // // // // //       )}

// // // // // // //       {/* fallback — show all questions when no topics */}
// // // // // // //       {!loading && topics.length===0 && passedQuestions?.length > 0 && (
// // // // // // //         <div style={S.card()}>
// // // // // // //           <p style={{ ...S.label, marginBottom:"0.75rem" }}>All Questions ({passedQuestions.length})</p>
// // // // // // //           {passedQuestions.map((q,i)=>(
// // // // // // //             <div key={q.id} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0.6rem 0.875rem", background:"rgba(15,23,42,0.5)", border:"1px solid #1e293b", borderRadius:"0.6rem", marginBottom:"0.4rem" }}>
// // // // // // //               <div style={{ display:"flex", alignItems:"center", gap:"0.6rem" }}>
// // // // // // //                 <span style={{ fontSize:"0.6rem", fontWeight:900, color:"#475569" }}>#{i+1}</span>
// // // // // // //                 <span style={{ fontSize:"0.75rem", color:"#94a3b8" }}>{q.type==="MCQ"?"🧠":"💻"} {q.title||q.question}</span>
// // // // // // //               </div>
// // // // // // //               {q.difficulty && <span style={S.badge(diffBg[q.difficulty],diffCol[q.difficulty])}>{q.difficulty}</span>}
// // // // // // //             </div>
// // // // // // //           ))}
// // // // // // //         </div>
// // // // // // //       )}
// // // // // // //     </div>
// // // // // // //   );
// // // // // // // };

// // // // // // // // ════════════════════════════════════════════════════════════════
// // // // // // // //  ROOT EXPORT
// // // // // // // // ════════════════════════════════════════════════════════════════
// // // // // // // const ModuleDetailView = ({ module, questions, currentUser, onBack, onRefresh }) => {
// // // // // // //   if (!module) return null;

// // // // // // //   if (module.moduleType === "Learning Module") {
// // // // // // //     return (
// // // // // // //       <div style={{ display:"flex", flexDirection:"column", gap:"1.5rem" }}>
// // // // // // //         <div style={{ display:"flex", alignItems:"center", gap:"1rem", padding:"1.25rem", background:"rgba(30,41,59,0.7)", border:"1px solid #334155", borderRadius:"1.25rem" }}>
// // // // // // //           <button onClick={onBack} style={S.btn("rgba(236,72,153,.1)","#f472b6","rgba(236,72,153,.25)")}>← Back to Modules</button>
// // // // // // //           <div>
// // // // // // //             <h2 style={{ fontSize:"1.25rem", fontWeight:900, color:"#f1f5f9", textTransform:"uppercase", margin:0 }}>{module.name}</h2>
// // // // // // //             <div style={{ display:"flex", gap:"0.4rem", marginTop:"0.35rem" }}>
// // // // // // //               <span style={S.badge("rgba(236,72,153,.15)","#f472b6")}>Learning Module</span>
// // // // // // //               <span style={S.badge(module.accessType==="global"?"rgba(59,130,246,.15)":"rgba(139,92,246,.15)", module.accessType==="global"?"#60a5fa":"#a78bfa")}>
// // // // // // //                 {module.accessType==="global"?"Global Access":"Selective Access"}
// // // // // // //               </span>
// // // // // // //             </div>
// // // // // // //           </div>
// // // // // // //         </div>
// // // // // // //         <LearningModules moduleData={module} />
// // // // // // //       </div>
// // // // // // //     );
// // // // // // //   }

// // // // // // //   return (
// // // // // // //     <ModuleWithTopics
// // // // // // //       module={module}
// // // // // // //       passedQuestions={questions}
// // // // // // //       onBack={onBack}
// // // // // // //       onRefresh={onRefresh}
// // // // // // //     />
// // // // // // //   );
// // // // // // // };

// // // // // // // export default ModuleDetailView;
// // // // // // ////

// // // // // // import React from 'react';
// // // // // // import { doc, updateDoc, arrayRemove } from 'firebase/firestore';
// // // // // // import { db } from '../../firebase/config';

// // // // // // export const ModuleDetailView = ({ module, questions, onBack, onRefresh }) => {

// // // // // //     const handleUnlinkQuestion = async (qId) => {
// // // // // //         if (!window.confirm("Remove this question from the module?")) return;
// // // // // //         try {
// // // // // //             const modRef = doc(db, 'categories', module.id);
// // // // // //             await updateDoc(modRef, {
// // // // // //                 questionIds: arrayRemove(qId)
// // // // // //             });
// // // // // //             onRefresh();
// // // // // //         } catch (e) { alert("Failed to remove."); }
// // // // // //     };

// // // // // //     return (
// // // // // //         <div className="space-y-6 animate-in fade-in zoom-in duration-300">
// // // // // //             {/* Clean Header Area */}
// // // // // //             <div className="flex justify-between items-center bg-gray-800 p-6 rounded-2xl border border-gray-700">
// // // // // //                 <div>
// // // // // //                     <button onClick={onBack} className="text-blue-400 text-xs font-bold mb-2 block hover:underline">← Back to Modules</button>
// // // // // //                     <h2 className="text-3xl font-black text-white uppercase tracking-tight">{module.name}</h2>
// // // // // //                     <p className="text-gray-500 text-xs mt-1">
// // // // // //                         {module.accessType === 'global' ? '🌍 Global Learning Path' : `🔐 Selective Access`}
// // // // // //                     </p>
// // // // // //                 </div>
// // // // // //             </div>

// // // // // //             {/* Questions List */}
// // // // // //             <div className="grid grid-cols-1 gap-4">
// // // // // //                 {questions.length > 0 ? (
// // // // // //                     questions.map((q, idx) => (
// // // // // //                         <div key={q.id} className="bg-gray-800 p-5 rounded-xl border border-gray-700 flex justify-between items-center hover:border-gray-600 transition-all group">
// // // // // //                             <div className="flex items-center gap-4">
// // // // // //                                 <span className="text-gray-600 font-mono text-xs">0{idx + 1}</span>
// // // // // //                                 <div>
// // // // // //                                     <h4 className="font-bold text-gray-200">{q.title || q.question || "Untitled"}</h4>
// // // // // //                                     <div className="flex gap-2 mt-1">
// // // // // //                                         <span className="text-[9px] bg-gray-900 px-2 py-0.5 rounded text-gray-500 uppercase font-bold">{q.type}</span>
// // // // // //                                         {q.difficulty && <span className="text-[9px] bg-blue-900/20 px-2 py-0.5 rounded text-blue-400 uppercase font-bold">{q.difficulty}</span>}
// // // // // //                                     </div>
// // // // // //                                 </div>
// // // // // //                             </div>
                            
// // // // // //                             {/* Delete Button */}
// // // // // //                             <div className="flex items-center gap-4">
// // // // // //                                 <button 
// // // // // //                                     onClick={() => handleUnlinkQuestion(q.id)}
// // // // // //                                     className="text-xs bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30 px-4 py-2 rounded-lg font-bold transition-colors"
// // // // // //                                 >
// // // // // //                                     🗑️ Delete
// // // // // //                                 </button>
// // // // // //                             </div>
// // // // // //                         </div>
// // // // // //                     ))
// // // // // //                 ) : (
// // // // // //                     <p className="text-gray-500 text-sm ml-2">No questions linked to this module yet. Add them from the dashboard.</p>
// // // // // //                 )}
// // // // // //             </div>
// // // // // //         </div>
// // // // // //     );
// // // // // // };

// // // // // /////


// // // // // import React, { useState } from 'react';
// // // // // import { doc, updateDoc, arrayRemove } from 'firebase/firestore';
// // // // // import { db } from '../../firebase/config';

// // // // // export const ModuleDetailView = ({ module, questions, onBack, onRefresh }) => {
// // // // //     const [activePracticeQ, setActivePracticeQ] = useState(null);

// // // // //     const handleUnlinkQuestion = async (qId) => {
// // // // //         if (!window.confirm("Remove this question from the module?")) return;
// // // // //         try {
// // // // //             const modRef = doc(db, 'categories', module.id);
// // // // //             await updateDoc(modRef, {
// // // // //                 questionIds: arrayRemove(qId)
// // // // //             });
// // // // //             onRefresh();
// // // // //             if (activePracticeQ && activePracticeQ.id === qId) {
// // // // //                 setActivePracticeQ(null);
// // // // //             }
// // // // //         } catch (e) { alert("Failed to remove."); }
// // // // //     };

// // // // //     // Grab only the questions linked to this specific module
// // // // //     const moduleQuestions = questions.filter(q => (module.questionIds || []).includes(q.id));

// // // // //     // ─── PRACTICE MODE VIEW (IDE LAYOUT) ───────────────────────────────────────
// // // // //     if (activePracticeQ) {
// // // // //         return (
// // // // //             <div className="space-y-4 animate-in fade-in duration-300">
// // // // //                 <div className="flex items-center justify-between bg-gray-800 border border-gray-700 p-4 rounded-2xl shadow-lg">
// // // // //                     <div className="flex items-center gap-4">
// // // // //                         <button onClick={() => setActivePracticeQ(null)} className="text-xs font-bold text-gray-400 border border-gray-600 px-4 py-2 rounded-lg hover:bg-gray-700 hover:text-white transition-all">
// // // // //                             ← Back to Questions
// // // // //                         </button>
// // // // //                         <h2 className="text-lg font-black text-indigo-400">
// // // // //                             <span className="text-gray-500 mr-2">Practicing:</span> 
// // // // //                             {activePracticeQ.title || activePracticeQ.question || "Untitled"}
// // // // //                         </h2>
// // // // //                     </div>
// // // // //                 </div>

// // // // //                 <div className="flex gap-4 h-[650px]">
// // // // //                     {/* Left Pane: Problem Description */}
// // // // //                     <div className="w-[40%] bg-gray-800 border border-gray-700 rounded-2xl p-6 overflow-y-auto flex flex-col gap-6 custom-scrollbar shadow-lg">
// // // // //                         <div className="border-b border-gray-700 pb-4">
// // // // //                             <h3 className="text-2xl font-black text-white">{activePracticeQ.title || activePracticeQ.question}</h3>
// // // // //                             <div className="flex gap-2 mt-3">
// // // // //                                 {activePracticeQ.difficulty && (
// // // // //                                     <span className={`text-xs font-black px-3 py-1 rounded-md border tracking-wider uppercase ${
// // // // //                                         activePracticeQ.difficulty === 'Easy' ? 'bg-green-900/20 border-green-500/30 text-green-400' :
// // // // //                                         activePracticeQ.difficulty === 'Hard' ? 'bg-red-900/20 border-red-500/30 text-red-400' :
// // // // //                                         'bg-yellow-900/20 border-yellow-500/30 text-yellow-400'
// // // // //                                     }`}>
// // // // //                                         {activePracticeQ.difficulty}
// // // // //                                     </span>
// // // // //                                 )}
// // // // //                                 {activePracticeQ.type && (
// // // // //                                     <span className="text-xs font-black px-3 py-1 rounded-md border bg-purple-900/20 border-purple-500/30 text-purple-400 uppercase tracking-wider">
// // // // //                                         {activePracticeQ.type}
// // // // //                                     </span>
// // // // //                                 )}
// // // // //                             </div>
// // // // //                         </div>
                        
// // // // //                         <div>
// // // // //                             <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-3">Description</h4>
// // // // //                             <div className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">
// // // // //                                 {activePracticeQ.description || activePracticeQ.question || "No description provided."}
// // // // //                             </div>
// // // // //                         </div>

// // // // //                         {activePracticeQ.constraints && (
// // // // //                             <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700/50">
// // // // //                                 <h4 className="text-xs font-black text-yellow-500/70 uppercase tracking-widest mb-2 flex items-center gap-2">
// // // // //                                     <span>⚠️</span> Constraints
// // // // //                                 </h4>
// // // // //                                 <div className="text-xs font-mono text-gray-400 whitespace-pre-wrap">
// // // // //                                     {activePracticeQ.constraints}
// // // // //                                 </div>
// // // // //                             </div>
// // // // //                         )}

// // // // //                         {activePracticeQ.type === "MCQ" && activePracticeQ.options && (
// // // // //                             <div className="mt-4">
// // // // //                                 <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-3">Options</h4>
// // // // //                                 <div className="space-y-2">
// // // // //                                     {activePracticeQ.options.map((opt, i) => (
// // // // //                                         <div key={i} className="p-3 bg-gray-900 border border-gray-700 rounded-lg text-sm text-gray-300">
// // // // //                                             <span className="font-bold text-gray-500 mr-2">{String.fromCharCode(65 + i)}.</span> {opt}
// // // // //                                         </div>
// // // // //                                     ))}
// // // // //                                 </div>
// // // // //                             </div>
// // // // //                         )}
// // // // //                     </div>

// // // // //                     {/* Right Pane: Code Editor & Terminal */}
// // // // //                     <div className="w-[60%] flex flex-col gap-4">
// // // // //                         <div className="bg-[#0d1117] border border-gray-700 rounded-2xl p-4 flex-1 flex flex-col relative shadow-lg">
// // // // //                             <div className="flex justify-between items-center mb-3 border-b border-gray-800 pb-3">
// // // // //                                 <div className="flex gap-2">
// // // // //                                    <span className="bg-gray-800/80 text-blue-400 text-xs px-4 py-1.5 rounded-lg font-mono border border-gray-700 font-bold">
// // // // //                                        solution.code
// // // // //                                    </span>
// // // // //                                 </div>
// // // // //                                 <div className="flex gap-3">
// // // // //                                     <button className="px-4 py-1.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-xs font-bold transition-all text-gray-300">
// // // // //                                         ↺ Reset
// // // // //                                     </button>
// // // // //                                     <button className="px-6 py-1.5 bg-green-600 hover:bg-green-500 rounded-lg text-xs font-black text-white transition-all shadow-lg shadow-green-600/20 active:scale-95 flex items-center gap-2">
// // // // //                                         <span>▶</span> Run Code
// // // // //                                     </button>
// // // // //                                 </div>
// // // // //                             </div>
                            
// // // // //                             <textarea 
// // // // //                                 className="flex-1 w-full bg-transparent text-sm font-mono text-gray-300 outline-none resize-none p-2 custom-scrollbar" 
// // // // //                                 defaultValue={activePracticeQ.type === "MCQ" ? "// MCQ Practice: Review the options on the left.\n// Select the correct option mentally and click 'Run Code' to test your knowledge.\n" : `// Write your solution for ${activePracticeQ.title || "the problem"} here...\n\nfunction solve() {\n    // TODO: Implement logic\n    \n}\n`} 
// // // // //                                 spellCheck={false}
// // // // //                             />
// // // // //                         </div>

// // // // //                         {/* Terminal / Output Console */}
// // // // //                         <div className="bg-black border border-gray-700 rounded-2xl h-56 p-5 flex flex-col relative shadow-lg">
// // // // //                             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gray-800 via-gray-600 to-gray-800"></div>
// // // // //                             <div className="flex justify-between items-center mb-3">
// // // // //                                 <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
// // // // //                                     <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Output Console
// // // // //                                 </h3>
// // // // //                                 <span className="text-[10px] font-mono text-gray-600">Terminal Ready</span>
// // // // //                             </div>
// // // // //                             <div className="flex-1 text-xs font-mono text-gray-400 overflow-y-auto bg-gray-900/30 rounded-lg p-3 border border-gray-800">
// // // // //                                 <div className="text-blue-400 mb-1">$ awaiting_execution...</div>
// // // // //                                 <div className="text-gray-500">System ready to compile and run test cases. Integration pending.</div>
// // // // //                             </div>
// // // // //                         </div>
// // // // //                     </div>
// // // // //                 </div>
// // // // //             </div>
// // // // //         );
// // // // //     }

// // // // //     // ─── LIST VIEW ─────────────────────────────────────────────────────────
// // // // //     return (
// // // // //         <div className="space-y-6 animate-in fade-in zoom-in duration-300">
// // // // //             {/* Clean Header Area */}
// // // // //             <div className="flex justify-between items-center bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-sm">
// // // // //                 <div>
// // // // //                     <button onClick={onBack} className="text-blue-400 text-xs font-bold mb-2 block hover:underline">← Back to Modules</button>
// // // // //                     <h2 className="text-3xl font-black text-white uppercase tracking-tight">{module.name}</h2>
// // // // //                     <p className="text-gray-500 text-xs mt-1">
// // // // //                         {module.accessType === 'global' ? '🌍 Global Module' : `🔐 Selective Module`}
// // // // //                     </p>
// // // // //                 </div>
// // // // //             </div>

// // // // //             {/* Questions List */}
// // // // //             <div className="grid grid-cols-1 gap-4">
// // // // //                 {moduleQuestions.length > 0 ? (
// // // // //                     moduleQuestions.map((q, idx) => (
// // // // //                         <div key={q.id} className="bg-gray-800 p-5 rounded-xl border border-gray-700 flex justify-between items-center hover:border-gray-500 transition-all group shadow-sm">
// // // // //                             <div className="flex items-center gap-4">
// // // // //                                 <span className="text-gray-600 font-mono text-sm font-bold">{(idx + 1).toString().padStart(2, '0')}</span>
// // // // //                                 <div>
// // // // //                                     <h4 className="font-bold text-gray-200 text-lg group-hover:text-blue-400 transition-colors">{q.title || q.question || "Untitled"}</h4>
// // // // //                                     <div className="flex gap-2 mt-2">
// // // // //                                         <span className="text-[9px] bg-gray-900 px-2.5 py-0.5 rounded border border-gray-700 text-gray-400 uppercase font-bold tracking-wider">{q.type}</span>
// // // // //                                         {q.difficulty && <span className={`text-[9px] px-2.5 py-0.5 rounded border uppercase font-bold tracking-wider ${
// // // // //                                             q.difficulty === 'Easy' ? 'bg-green-900/20 text-green-400 border-green-500/30' :
// // // // //                                             q.difficulty === 'Hard' ? 'bg-red-900/20 text-red-400 border-red-500/30' :
// // // // //                                             'bg-yellow-900/20 text-yellow-400 border-yellow-500/30'
// // // // //                                         }`}>{q.difficulty}</span>}
// // // // //                                     </div>
// // // // //                                 </div>
// // // // //                             </div>
                            
// // // // //                             {/* Hover Action Buttons (Practice & Delete) */}
// // // // //                             <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
// // // // //                                 <button 
// // // // //                                     onClick={() => setActivePracticeQ(q)}
// // // // //                                     className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-lg font-bold transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-2"
// // // // //                                 >
// // // // //                                     <span>👨‍💻</span> Practice
// // // // //                                 </button>
// // // // //                                 <button 
// // // // //                                     onClick={() => handleUnlinkQuestion(q.id)}
// // // // //                                     className="text-xs bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30 px-4 py-2 rounded-lg font-bold transition-colors flex items-center gap-1"
// // // // //                                 >
// // // // //                                     <span>🗑️</span> Remove
// // // // //                                 </button>
// // // // //                             </div>
// // // // //                         </div>
// // // // //                     ))
// // // // //                 ) : (
// // // // //                     <div className="text-center py-12 text-gray-500 text-sm border-2 border-dashed border-gray-700 rounded-2xl">
// // // // //                         <p>No questions linked to this module yet.</p>
// // // // //                         <p className="mt-1 text-xs">Add them using the "Quick add from bank" dropdown on the dashboard.</p>
// // // // //                     </div>
// // // // //                 )}
// // // // //             </div>
// // // // //         </div>
// // // // //     );
// // // // // };


// // // // import React, { useState } from 'react';
// // // // import { doc, updateDoc, arrayRemove } from 'firebase/firestore';
// // // // import { db } from '../../firebase/config';

// // // // export const ModuleDetailView = ({ module, questions, onBack, onRefresh }) => {
// // // //     const [activePracticeQ, setActivePracticeQ] = useState(null);

// // // //     const handleUnlinkQuestion = async (qId) => {
// // // //         if (!window.confirm("Remove this question from the module?")) return;
// // // //         try {
// // // //             const modRef = doc(db, 'categories', module.id);
// // // //             await updateDoc(modRef, {
// // // //                 questionIds: arrayRemove(qId)
// // // //             });
// // // //             onRefresh();
// // // //             if (activePracticeQ && activePracticeQ.id === qId) {
// // // //                 setActivePracticeQ(null);
// // // //             }
// // // //         } catch (e) { alert("Failed to remove."); }
// // // //     };

// // // //     // Grab only the questions linked to this specific module
// // // //     const moduleQuestions = questions.filter(q => (module.questionIds || []).includes(q.id));

// // // //     // ─── PRACTICE MODE VIEW (IDE LAYOUT) ───────────────────────────────────────
// // // //     if (activePracticeQ) {
// // // //         return (
// // // //             <div className="space-y-4 animate-in fade-in duration-300">
// // // //                 <div className="flex items-center justify-between bg-gray-800 border border-gray-700 p-4 rounded-2xl shadow-lg">
// // // //                     <div className="flex items-center gap-4">
// // // //                         <button onClick={() => setActivePracticeQ(null)} className="text-xs font-bold text-gray-400 border border-gray-600 px-4 py-2 rounded-lg hover:bg-gray-700 hover:text-white transition-all">
// // // //                             ← Back to Questions
// // // //                         </button>
// // // //                         <h2 className="text-lg font-black text-indigo-400">
// // // //                             <span className="text-gray-500 mr-2">Practicing:</span> 
// // // //                             {activePracticeQ.title || activePracticeQ.question || "Untitled"}
// // // //                         </h2>
// // // //                     </div>
// // // //                 </div>

// // // //                 <div className="flex gap-4 h-[650px]">
// // // //                     {/* Left Pane: Problem Description */}
// // // //                     <div className="w-[40%] bg-gray-800 border border-gray-700 rounded-2xl p-6 overflow-y-auto flex flex-col gap-6 custom-scrollbar shadow-lg">
// // // //                         <div className="border-b border-gray-700 pb-4">
// // // //                             <h3 className="text-2xl font-black text-white">{activePracticeQ.title || activePracticeQ.question}</h3>
// // // //                             <div className="flex gap-2 mt-3">
// // // //                                 {activePracticeQ.difficulty && (
// // // //                                     <span className={`text-xs font-black px-3 py-1 rounded-md border tracking-wider uppercase ${
// // // //                                         activePracticeQ.difficulty === 'Easy' ? 'bg-green-900/20 border-green-500/30 text-green-400' :
// // // //                                         activePracticeQ.difficulty === 'Hard' ? 'bg-red-900/20 border-red-500/30 text-red-400' :
// // // //                                         'bg-yellow-900/20 border-yellow-500/30 text-yellow-400'
// // // //                                     }`}>
// // // //                                         {activePracticeQ.difficulty}
// // // //                                     </span>
// // // //                                 )}
// // // //                                 {activePracticeQ.type && (
// // // //                                     <span className="text-xs font-black px-3 py-1 rounded-md border bg-purple-900/20 border-purple-500/30 text-purple-400 uppercase tracking-wider">
// // // //                                         {activePracticeQ.type}
// // // //                                     </span>
// // // //                                 )}
// // // //                             </div>
// // // //                         </div>
                        
// // // //                         <div>
// // // //                             <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-3">Description</h4>
// // // //                             <div className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">
// // // //                                 {activePracticeQ.description || activePracticeQ.question || "No description provided."}
// // // //                             </div>
// // // //                         </div>

// // // //                         {activePracticeQ.constraints && (
// // // //                             <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700/50">
// // // //                                 <h4 className="text-xs font-black text-yellow-500/70 uppercase tracking-widest mb-2 flex items-center gap-2">
// // // //                                     <span>⚠️</span> Constraints
// // // //                                 </h4>
// // // //                                 <div className="text-xs font-mono text-gray-400 whitespace-pre-wrap">
// // // //                                     {activePracticeQ.constraints}
// // // //                                 </div>
// // // //                             </div>
// // // //                         )}

// // // //                         {activePracticeQ.type === "MCQ" && activePracticeQ.options && (
// // // //                             <div className="mt-4">
// // // //                                 <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-3">Options</h4>
// // // //                                 <div className="space-y-2">
// // // //                                     {activePracticeQ.options.map((opt, i) => (
// // // //                                         <div key={i} className="p-3 bg-gray-900 border border-gray-700 rounded-lg text-sm text-gray-300">
// // // //                                             <span className="font-bold text-gray-500 mr-2">{String.fromCharCode(65 + i)}.</span> {opt}
// // // //                                         </div>
// // // //                                     ))}
// // // //                                 </div>
// // // //                             </div>
// // // //                         )}
// // // //                     </div>

// // // //                     {/* Right Pane: Code Editor & Terminal */}
// // // //                     <div className="w-[60%] flex flex-col gap-4">
// // // //                         <div className="bg-[#0d1117] border border-gray-700 rounded-2xl p-4 flex-1 flex flex-col relative shadow-lg">
// // // //                             <div className="flex justify-between items-center mb-3 border-b border-gray-800 pb-3">
// // // //                                 <div className="flex gap-2">
// // // //                                    <span className="bg-gray-800/80 text-blue-400 text-xs px-4 py-1.5 rounded-lg font-mono border border-gray-700 font-bold">
// // // //                                        solution.code
// // // //                                    </span>
// // // //                                 </div>
// // // //                                 <div className="flex gap-3">
// // // //                                     <button className="px-4 py-1.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-xs font-bold transition-all text-gray-300">
// // // //                                         ↺ Reset
// // // //                                     </button>
// // // //                                     <button className="px-6 py-1.5 bg-green-600 hover:bg-green-500 rounded-lg text-xs font-black text-white transition-all shadow-lg shadow-green-600/20 active:scale-95 flex items-center gap-2">
// // // //                                         <span>▶</span> Run Code
// // // //                                     </button>
// // // //                                 </div>
// // // //                             </div>
                            
// // // //                             <textarea 
// // // //                                 className="flex-1 w-full bg-transparent text-sm font-mono text-gray-300 outline-none resize-none p-2 custom-scrollbar" 
// // // //                                 defaultValue={activePracticeQ.type === "MCQ" ? "// MCQ Practice: Review the options on the left.\n// Select the correct option mentally and click 'Run Code' to test your knowledge.\n" : `// Write your solution for ${activePracticeQ.title || "the problem"} here...\n\nfunction solve() {\n    // TODO: Implement logic\n    \n}\n`} 
// // // //                                 spellCheck={false}
// // // //                             />
// // // //                         </div>

// // // //                         {/* Terminal / Output Console */}
// // // //                         <div className="bg-black border border-gray-700 rounded-2xl h-56 p-5 flex flex-col relative shadow-lg">
// // // //                             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gray-800 via-gray-600 to-gray-800"></div>
// // // //                             <div className="flex justify-between items-center mb-3">
// // // //                                 <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
// // // //                                     <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Output Console
// // // //                                 </h3>
// // // //                                 <span className="text-[10px] font-mono text-gray-600">Terminal Ready</span>
// // // //                             </div>
// // // //                             <div className="flex-1 text-xs font-mono text-gray-400 overflow-y-auto bg-gray-900/30 rounded-lg p-3 border border-gray-800">
// // // //                                 <div className="text-blue-400 mb-1">$ awaiting_execution...</div>
// // // //                                 <div className="text-gray-500">System ready to compile and run test cases. Integration pending.</div>
// // // //                             </div>
// // // //                         </div>
// // // //                     </div>
// // // //                 </div>
// // // //             </div>
// // // //         );
// // // //     }

// // // //     // ─── LIST VIEW ─────────────────────────────────────────────────────────
// // // //     return (
// // // //         <div className="space-y-6 animate-in fade-in zoom-in duration-300">
// // // //             {/* Clean Header Area */}
// // // //             <div className="flex justify-between items-center bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-sm">
// // // //                 <div>
// // // //                     <button onClick={onBack} className="text-blue-400 text-xs font-bold mb-2 block hover:underline">← Back to Modules</button>
// // // //                     <h2 className="text-3xl font-black text-white uppercase tracking-tight">{module.name}</h2>
// // // //                     <p className="text-gray-500 text-xs mt-1">
// // // //                         {module.accessType === 'global' ? '🌍 Global Module' : `🔐 Selective Module`}
// // // //                     </p>
// // // //                 </div>
// // // //             </div>

// // // //             {/* Questions List */}
// // // //             <div className="grid grid-cols-1 gap-4">
// // // //                 {moduleQuestions.length > 0 ? (
// // // //                     moduleQuestions.map((q, idx) => (
// // // //                         <div key={q.id} className="bg-gray-800 p-5 rounded-xl border border-gray-700 flex justify-between items-center hover:border-gray-500 transition-all group shadow-sm">
// // // //                             <div className="flex items-center gap-4">
// // // //                                 <span className="text-gray-600 font-mono text-sm font-bold">{(idx + 1).toString().padStart(2, '0')}</span>
// // // //                                 <div>
// // // //                                     <h4 className="font-bold text-gray-200 text-lg group-hover:text-blue-400 transition-colors">{q.title || q.question || "Untitled"}</h4>
// // // //                                     <div className="flex gap-2 mt-2">
// // // //                                         <span className="text-[9px] bg-gray-900 px-2.5 py-0.5 rounded border border-gray-700 text-gray-400 uppercase font-bold tracking-wider">{q.type}</span>
// // // //                                         {q.difficulty && <span className={`text-[9px] px-2.5 py-0.5 rounded border uppercase font-bold tracking-wider ${
// // // //                                             q.difficulty === 'Easy' ? 'bg-green-900/20 text-green-400 border-green-500/30' :
// // // //                                             q.difficulty === 'Hard' ? 'bg-red-900/20 text-red-400 border-red-500/30' :
// // // //                                             'bg-yellow-900/20 text-yellow-400 border-yellow-500/30'
// // // //                                         }`}>{q.difficulty}</span>}
// // // //                                     </div>
// // // //                                 </div>
// // // //                             </div>
                            
// // // //                             {/* Hover Action Buttons (Practice & Delete) */}
// // // //                             <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
// // // //                                 <button 
// // // //                                     onClick={() => setActivePracticeQ(q)}
// // // //                                     className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-lg font-bold transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-2"
// // // //                                 >
// // // //                                     <span>👨‍💻</span> Practice
// // // //                                 </button>
// // // //                                 <button 
// // // //                                     onClick={() => handleUnlinkQuestion(q.id)}
// // // //                                     className="text-xs bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30 px-4 py-2 rounded-lg font-bold transition-colors flex items-center gap-1"
// // // //                                 >
// // // //                                     <span>🗑️</span> Remove
// // // //                                 </button>
// // // //                             </div>
// // // //                         </div>
// // // //                     ))
// // // //                 ) : (
// // // //                     <div className="text-center py-12 text-gray-500 text-sm border-2 border-dashed border-gray-700 rounded-2xl">
// // // //                         <p>No questions linked to this module yet.</p>
// // // //                         <p className="mt-1 text-xs">Add them using the "Quick add from bank" dropdown on the dashboard.</p>
// // // //                     </div>
// // // //                 )}
// // // //             </div>
// // // //         </div>
// // // //     );
// // // // };

// // // import React, { useState } from 'react';
// // // import { doc, updateDoc, arrayRemove } from 'firebase/firestore';
// // // import { db } from '../../firebase/config';

// // // export const ModuleDetailView = ({ module, questions, onBack, onRefresh }) => {
// // //     const [activePracticeQ, setActivePracticeQ] = useState(null);

// // //     const handleUnlinkQuestion = async (qId) => {
// // //         if (!window.confirm("Remove this question from the module?")) return;
// // //         try {
// // //             const modRef = doc(db, 'categories', module.id);
// // //             await updateDoc(modRef, {
// // //                 questionIds: arrayRemove(qId)
// // //             });
// // //             onRefresh();
// // //             if (activePracticeQ && activePracticeQ.id === qId) {
// // //                 setActivePracticeQ(null);
// // //             }
// // //         } catch (e) { alert("Failed to remove."); }
// // //     };

// // //     // Grab only the questions linked to this specific module
// // //     const moduleQuestions = questions.filter(q => (module.questionIds || []).includes(q.id));

// // //     // ─── PRACTICE MODE VIEW (IDE LAYOUT) ───────────────────────────────────────
// // //     if (activePracticeQ) {
// // //         return (
// // //             <div className="space-y-4 animate-in fade-in duration-300">
// // //                 <div className="flex items-center justify-between bg-gray-800 border border-gray-700 p-4 rounded-2xl shadow-lg">
// // //                     <div className="flex items-center gap-4">
// // //                         <button onClick={() => setActivePracticeQ(null)} className="text-xs font-bold text-gray-400 border border-gray-600 px-4 py-2 rounded-lg hover:bg-gray-700 hover:text-white transition-all">
// // //                             ← Back to Questions
// // //                         </button>
// // //                         <h2 className="text-lg font-black text-indigo-400">
// // //                             <span className="text-gray-500 mr-2">Practicing:</span> 
// // //                             {activePracticeQ.title || activePracticeQ.question || "Untitled"}
// // //                         </h2>
// // //                     </div>
// // //                 </div>

// // //                 <div className="flex gap-4 h-[650px]">
// // //                     {/* Left Pane: Problem Description */}
// // //                     <div className="w-[40%] bg-gray-800 border border-gray-700 rounded-2xl p-6 overflow-y-auto flex flex-col gap-6 custom-scrollbar shadow-lg">
// // //                         <div className="border-b border-gray-700 pb-4">
// // //                             <h3 className="text-2xl font-black text-white">{activePracticeQ.title || activePracticeQ.question}</h3>
// // //                             <div className="flex gap-2 mt-3">
// // //                                 {activePracticeQ.difficulty && (
// // //                                     <span className={`text-xs font-black px-3 py-1 rounded-md border tracking-wider uppercase ${
// // //                                         activePracticeQ.difficulty === 'Easy' ? 'bg-green-900/20 border-green-500/30 text-green-400' :
// // //                                         activePracticeQ.difficulty === 'Hard' ? 'bg-red-900/20 border-red-500/30 text-red-400' :
// // //                                         'bg-yellow-900/20 border-yellow-500/30 text-yellow-400'
// // //                                     }`}>
// // //                                         {activePracticeQ.difficulty}
// // //                                     </span>
// // //                                 )}
// // //                                 {activePracticeQ.type && (
// // //                                     <span className="text-xs font-black px-3 py-1 rounded-md border bg-purple-900/20 border-purple-500/30 text-purple-400 uppercase tracking-wider">
// // //                                         {activePracticeQ.type}
// // //                                     </span>
// // //                                 )}
// // //                             </div>
// // //                         </div>
                        
// // //                         <div>
// // //                             <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-3">Description</h4>
// // //                             <div className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">
// // //                                 {activePracticeQ.description || activePracticeQ.question || "No description provided."}
// // //                             </div>
// // //                         </div>

// // //                         {activePracticeQ.constraints && (
// // //                             <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700/50">
// // //                                 <h4 className="text-xs font-black text-yellow-500/70 uppercase tracking-widest mb-2 flex items-center gap-2">
// // //                                     <span>⚠️</span> Constraints
// // //                                 </h4>
// // //                                 <div className="text-xs font-mono text-gray-400 whitespace-pre-wrap">
// // //                                     {activePracticeQ.constraints}
// // //                                 </div>
// // //                             </div>
// // //                         )}

// // //                         {activePracticeQ.type === "MCQ" && activePracticeQ.options && (
// // //                             <div className="mt-4">
// // //                                 <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-3">Options</h4>
// // //                                 <div className="space-y-2">
// // //                                     {activePracticeQ.options.map((opt, i) => (
// // //                                         <div key={i} className="p-3 bg-gray-900 border border-gray-700 rounded-lg text-sm text-gray-300">
// // //                                             <span className="font-bold text-gray-500 mr-2">{String.fromCharCode(65 + i)}.</span> {opt}
// // //                                         </div>
// // //                                     ))}
// // //                                 </div>
// // //                             </div>
// // //                         )}
// // //                     </div>

// // //                     {/* Right Pane: Code Editor & Terminal */}
// // //                     <div className="w-[60%] flex flex-col gap-4">
// // //                         <div className="bg-[#0d1117] border border-gray-700 rounded-2xl p-4 flex-1 flex flex-col relative shadow-lg">
// // //                             <div className="flex justify-between items-center mb-3 border-b border-gray-800 pb-3">
// // //                                 <div className="flex gap-2">
// // //                                    <span className="bg-gray-800/80 text-blue-400 text-xs px-4 py-1.5 rounded-lg font-mono border border-gray-700 font-bold">
// // //                                        solution.code
// // //                                    </span>
// // //                                 </div>
// // //                                 <div className="flex gap-3">
// // //                                     <button className="px-4 py-1.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-xs font-bold transition-all text-gray-300">
// // //                                         ↺ Reset
// // //                                     </button>
// // //                                     <button className="px-6 py-1.5 bg-green-600 hover:bg-green-500 rounded-lg text-xs font-black text-white transition-all shadow-lg shadow-green-600/20 active:scale-95 flex items-center gap-2">
// // //                                         <span>▶</span> Run Code
// // //                                     </button>
// // //                                 </div>
// // //                             </div>
                            
// // //                             <textarea 
// // //                                 className="flex-1 w-full bg-transparent text-sm font-mono text-gray-300 outline-none resize-none p-2 custom-scrollbar" 
// // //                                 defaultValue={activePracticeQ.type === "MCQ" ? "// MCQ Practice: Review the options on the left.\n// Select the correct option mentally and click 'Run Code' to test your knowledge.\n" : `// Write your solution for ${activePracticeQ.title || "the problem"} here...\n\nfunction solve() {\n    // TODO: Implement logic\n    \n}\n`} 
// // //                                 spellCheck={false}
// // //                             />
// // //                         </div>

// // //                         {/* Terminal / Output Console */}
// // //                         <div className="bg-black border border-gray-700 rounded-2xl h-56 p-5 flex flex-col relative shadow-lg">
// // //                             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gray-800 via-gray-600 to-gray-800"></div>
// // //                             <div className="flex justify-between items-center mb-3">
// // //                                 <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
// // //                                     <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Output Console
// // //                                 </h3>
// // //                                 <span className="text-[10px] font-mono text-gray-600">Terminal Ready</span>
// // //                             </div>
// // //                             <div className="flex-1 text-xs font-mono text-gray-400 overflow-y-auto bg-gray-900/30 rounded-lg p-3 border border-gray-800">
// // //                                 <div className="text-blue-400 mb-1">$ awaiting_execution...</div>
// // //                                 <div className="text-gray-500">System ready to compile and run test cases. Integration pending.</div>
// // //                             </div>
// // //                         </div>
// // //                     </div>
// // //                 </div>
// // //             </div>
// // //         );
// // //     }

// // //     // ─── LIST VIEW ─────────────────────────────────────────────────────────
// // //     return (
// // //         <div className="space-y-6 animate-in fade-in zoom-in duration-300">
// // //             {/* Clean Header Area */}
// // //             <div className="flex justify-between items-center bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-sm">
// // //                 <div>
// // //                     <button onClick={onBack} className="text-blue-400 text-xs font-bold mb-2 block hover:underline">← Back to Modules</button>
// // //                     <h2 className="text-3xl font-black text-white uppercase tracking-tight">{module.name}</h2>
// // //                     <p className="text-gray-500 text-xs mt-1">
// // //                         {module.accessType === 'global' ? '🌍 Global Module' : `🔐 Selective Module`}
// // //                     </p>
// // //                 </div>
// // //             </div>

// // //             {/* Questions List */}
// // //             <div className="grid grid-cols-1 gap-4">
// // //                 {moduleQuestions.length > 0 ? (
// // //                     moduleQuestions.map((q, idx) => (
// // //                         <div key={q.id} className="bg-gray-800 p-5 rounded-xl border border-gray-700 flex justify-between items-center hover:border-gray-500 transition-all group shadow-sm">
// // //                             <div className="flex items-center gap-4">
// // //                                 <span className="text-gray-600 font-mono text-sm font-bold">{(idx + 1).toString().padStart(2, '0')}</span>
// // //                                 <div>
// // //                                     <h4 className="font-bold text-gray-200 text-lg group-hover:text-blue-400 transition-colors">{q.title || q.question || "Untitled"}</h4>
// // //                                     <div className="flex gap-2 mt-2">
// // //                                         <span className="text-[9px] bg-gray-900 px-2.5 py-0.5 rounded border border-gray-700 text-gray-400 uppercase font-bold tracking-wider">{q.type}</span>
// // //                                         {q.difficulty && <span className={`text-[9px] px-2.5 py-0.5 rounded border uppercase font-bold tracking-wider ${
// // //                                             q.difficulty === 'Easy' ? 'bg-green-900/20 text-green-400 border-green-500/30' :
// // //                                             q.difficulty === 'Hard' ? 'bg-red-900/20 text-red-400 border-red-500/30' :
// // //                                             'bg-yellow-900/20 text-yellow-400 border-yellow-500/30'
// // //                                         }`}>{q.difficulty}</span>}
// // //                                     </div>
// // //                                 </div>
// // //                             </div>
                            
// // //                             {/* Hover Action Buttons (Practice & Delete) */}
// // //                             <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
// // //                                 <button 
// // //                                     onClick={() => setActivePracticeQ(q)}
// // //                                     className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-lg font-bold transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-2"
// // //                                 >
// // //                                     <span>👨‍💻</span> Practice
// // //                                 </button>
// // //                                 <button 
// // //                                     onClick={() => handleUnlinkQuestion(q.id)}
// // //                                     className="text-xs bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30 px-4 py-2 rounded-lg font-bold transition-colors flex items-center gap-1"
// // //                                 >
// // //                                     <span>🗑️</span> Remove
// // //                                 </button>
// // //                             </div>
// // //                         </div>
// // //                     ))
// // //                 ) : (
// // //                     <div className="text-center py-12 text-gray-500 text-sm border-2 border-dashed border-gray-700 rounded-2xl">
// // //                         <p>No questions linked to this module yet.</p>
// // //                         <p className="mt-1 text-xs">Add them using the "Quick add from bank" dropdown on the dashboard.</p>
// // //                     </div>
// // //                 )}
// // //             </div>
// // //         </div>
// // //     );
// // // };

// // ////

// // import React, { useState, useEffect } from 'react';
// // import { doc, updateDoc, arrayRemove } from 'firebase/firestore';
// // import { db } from '../../firebase/config';

// // export const ModuleDetailView = ({ module, questions, onBack, onRefresh }) => {
// //     const [activePracticeQ, setActivePracticeQ] = useState(null);
    
// //     // ─── NEW: EDITOR & TERMINAL STATE ──────────────────────────────────────
// //     const [code, setCode] = useState("");
// //     const [outputLogs, setOutputLogs] = useState([]);
// //     const [isExecuting, setIsExecuting] = useState(false);

// //     // Initialize the code editor and terminal when a problem is selected
// //     useEffect(() => {
// //         if (activePracticeQ) {
// //             const template = activePracticeQ.type === "MCQ" 
// //                 ? "// MCQ Practice: Review the options on the left.\n// Mentally select your answer, then click 'Run Code' to check.\n" 
// //                 : `// Solve: ${activePracticeQ.title || "Untitled"}\n\nfunction solve() {\n    // TODO: Write your logic here\n    \n}\n`;
            
// //             setCode(template);
// //             setOutputLogs([
// //                 { type: 'system', text: '$ awaiting_execution...' },
// //                 { type: 'info', text: 'System ready to compile and run test cases.' }
// //             ]);
// //         }
// //     }, [activePracticeQ]);

// //     const handleUnlinkQuestion = async (qId) => {
// //         if (!window.confirm("Remove this question from the module?")) return;
// //         try {
// //             const modRef = doc(db, 'categories', module.id);
// //             await updateDoc(modRef, {
// //                 questionIds: arrayRemove(qId)
// //             });
// //             onRefresh();
// //             if (activePracticeQ && activePracticeQ.id === qId) {
// //                 setActivePracticeQ(null);
// //             }
// //         } catch (e) { alert("Failed to remove."); }
// //     };

// //     // ─── TERMINAL EXECUTION LOGIC ──────────────────────────────────────────
// //     const handleRunCode = async () => {
// //         if (isExecuting) return;
// //         setIsExecuting(true);
        
// //         // Show compiling status
// //         setOutputLogs([
// //             { type: 'system', text: '$ compiling and executing code...' },
// //             { type: 'info', text: 'Connecting to compiler engine...' }
// //         ]);

// //         // SIMULATED API DELAY (1.5 seconds)
// //         await new Promise(resolve => setTimeout(resolve, 1500));

// //         try {
// //             // ===============================================================
// //             // 🚀 BACKEND INTEGRATION POINT:
// //             // When your backend is ready, replace this block with your API call
// //             // const response = await fetch('YOUR_BACKEND_EXECUTE_URL', {
// //             //     method: 'POST',
// //             //     body: JSON.stringify({ 
// //             //         sourceCode: code, 
// //             //         hiddenDriver: activePracticeQ.hiddenDriverCode,
// //             //         testCases: activePracticeQ.testCases 
// //             //     })
// //             // });
// //             // const result = await response.json();
// //             // ===============================================================

// //             // SIMULATED RESULTS based on code length (just for UI testing)
// //             const isSuccess = code.length > 80; 

// //             if (isSuccess) {
// //                 setOutputLogs([
// //                     { type: 'system', text: '$ execution finished in 0.8s' },
// //                     { type: 'success', text: '✅ All Test Cases Passed!' },
// //                     { type: 'info', text: 'Output: [ 1, 4, 9, 16 ]' },
// //                     { type: 'info', text: 'Memory: 32MB | CPU: 12ms' }
// //                 ]);
// //             } else {
// //                 setOutputLogs([
// //                     { type: 'system', text: '$ execution finished with errors' },
// //                     { type: 'error', text: '❌ Test Case 1 Failed' },
// //                     { type: 'error', text: 'Expected: 5 | Actual: undefined' },
// //                     { type: 'info', text: 'Hint: Did you forget to return a value?' }
// //                 ]);
// //             }
// //         } catch (error) {
// //             setOutputLogs([
// //                 { type: 'error', text: '🚨 Server Error: Could not reach compiler API.' }
// //             ]);
// //         }
// //         setIsExecuting(false);
// //     };

// //     const handleReset = () => {
// //         if (window.confirm("Reset your code to the default template?")) {
// //             setCode(`// Solve: ${activePracticeQ.title || "Untitled"}\n\nfunction solve() {\n    // TODO: Write your logic here\n    \n}\n`);
// //             setOutputLogs([
// //                 { type: 'system', text: '$ code_reset' },
// //                 { type: 'info', text: 'Editor restored to default state.' }
// //             ]);
// //         }
// //     };

// //     // Grab ALL questions linked to this module
// //     const moduleQuestions = questions.filter(q => 
// //         (module.questionIds || []).includes(q.id) || q.category === module.name
// //     );

// //     // ─── PRACTICE MODE VIEW (IDE LAYOUT) ───────────────────────────────────────
// //     if (activePracticeQ) {
// //         return (
// //             <div className="space-y-4 animate-in fade-in duration-300">
// //                 <div className="flex items-center justify-between bg-gray-800 border border-gray-700 p-4 rounded-2xl shadow-lg">
// //                     <div className="flex items-center gap-4">
// //                         <button onClick={() => setActivePracticeQ(null)} className="text-xs font-bold text-gray-400 border border-gray-600 px-4 py-2 rounded-lg hover:bg-gray-700 hover:text-white transition-all">
// //                             ← Back to Questions
// //                         </button>
// //                         <h2 className="text-lg font-black text-indigo-400">
// //                             <span className="text-gray-500 mr-2">Practicing:</span> 
// //                             {activePracticeQ.title || "Untitled"}
// //                         </h2>
// //                     </div>
// //                 </div>

// //                 <div className="flex gap-4 h-[650px]">
// //                     {/* Left Pane: Problem Description */}
// //                     <div className="w-[40%] bg-gray-800 border border-gray-700 rounded-2xl p-6 overflow-y-auto flex flex-col gap-6 custom-scrollbar shadow-lg">
// //                         <div className="border-b border-gray-700 pb-4">
// //                             <h3 className="text-2xl font-black text-white">{activePracticeQ.title}</h3>
// //                             <div className="flex gap-2 mt-3">
// //                                 {activePracticeQ.difficulty && (
// //                                     <span className={`text-xs font-black px-3 py-1 rounded-md border tracking-wider uppercase ${
// //                                         activePracticeQ.difficulty === 'Easy' ? 'bg-green-900/20 border-green-500/30 text-green-400' :
// //                                         activePracticeQ.difficulty === 'Hard' ? 'bg-red-900/20 border-red-500/30 text-red-400' :
// //                                         'bg-yellow-900/20 border-yellow-500/30 text-yellow-400'
// //                                     }`}>
// //                                         {activePracticeQ.difficulty}
// //                                     </span>
// //                                 )}
// //                                 <span className="text-xs font-black px-3 py-1 rounded-md border bg-blue-900/20 border-blue-500/30 text-blue-400 uppercase tracking-wider">
// //                                     CODING
// //                                 </span>
// //                             </div>
// //                         </div>
                        
// //                         <div>
// //                             <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-3">Description</h4>
// //                             <div className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">
// //                                 {activePracticeQ.description || "No description provided."}
// //                             </div>
// //                         </div>

// //                         {activePracticeQ.constraints && (
// //                             <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700/50">
// //                                 <h4 className="text-xs font-black text-yellow-500/70 uppercase tracking-widest mb-2 flex items-center gap-2">
// //                                     <span>⚠️</span> Constraints
// //                                 </h4>
// //                                 <div className="text-xs font-mono text-gray-400 whitespace-pre-wrap">
// //                                     {activePracticeQ.constraints}
// //                                 </div>
// //                             </div>
// //                         )}
// //                     </div>

// //                     {/* Right Pane: Code Editor & Terminal */}
// //                     <div className="w-[60%] flex flex-col gap-4">
// //                         {/* Editor Section */}
// //                         <div className="bg-[#0d1117] border border-gray-700 rounded-2xl p-4 flex-1 flex flex-col relative shadow-lg">
// //                             <div className="flex justify-between items-center mb-3 border-b border-gray-800 pb-3">
// //                                 <div className="flex gap-2">
// //                                    <span className="bg-gray-800/80 text-blue-400 text-xs px-4 py-1.5 rounded-lg font-mono border border-gray-700 font-bold">
// //                                        solution.code
// //                                    </span>
// //                                 </div>
// //                                 <div className="flex gap-3">
// //                                     <button 
// //                                         onClick={handleReset}
// //                                         disabled={isExecuting}
// //                                         className="px-4 py-1.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-xs font-bold transition-all text-gray-300 disabled:opacity-50"
// //                                     >
// //                                         ↺ Reset
// //                                     </button>
// //                                     <button 
// //                                         onClick={handleRunCode}
// //                                         disabled={isExecuting}
// //                                         className="px-6 py-1.5 bg-green-600 hover:bg-green-500 rounded-lg text-xs font-black text-white transition-all shadow-lg shadow-green-600/20 active:scale-95 flex items-center gap-2 disabled:opacity-50 disabled:bg-green-800"
// //                                     >
// //                                         {isExecuting ? (
// //                                             <><span className="animate-spin text-lg leading-none">⚙️</span> Running...</>
// //                                         ) : (
// //                                             <><span>▶</span> Run Code</>
// //                                         )}
// //                                     </button>
// //                                 </div>
// //                             </div>
                            
// //                             <textarea 
// //                                 value={code}
// //                                 onChange={(e) => setCode(e.target.value)}
// //                                 className="flex-1 w-full bg-transparent text-sm font-mono text-gray-300 outline-none resize-none p-2 custom-scrollbar" 
// //                                 spellCheck={false}
// //                             />
// //                         </div>

// //                         {/* Terminal / Output Console */}
// //                         <div className="bg-black border border-gray-700 rounded-2xl h-56 p-5 flex flex-col relative shadow-lg">
// //                             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gray-800 via-gray-600 to-gray-800"></div>
// //                             <div className="flex justify-between items-center mb-3">
// //                                 <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
// //                                     <span className={`w-2 h-2 rounded-full ${isExecuting ? 'bg-yellow-400 animate-ping' : 'bg-green-500'}`}></span> Output Console
// //                                 </h3>
// //                                 <span className="text-[10px] font-mono text-gray-600">Terminal Ready</span>
// //                             </div>
// //                             <div className="flex-1 text-xs font-mono overflow-y-auto bg-gray-900/30 rounded-lg p-3 border border-gray-800 space-y-1">
// //                                 {outputLogs.map((log, i) => (
// //                                     <div key={i} className={`
// //                                         ${log.type === 'system' ? 'text-blue-400' : ''}
// //                                         ${log.type === 'info' ? 'text-gray-400' : ''}
// //                                         ${log.type === 'success' ? 'text-green-400 font-bold' : ''}
// //                                         ${log.type === 'error' ? 'text-red-400 font-bold' : ''}
// //                                     `}>
// //                                         {log.text}
// //                                     </div>
// //                                 ))}
// //                             </div>
// //                         </div>
// //                     </div>
// //                 </div>
// //             </div>
// //         );
// //     }

// //     // ─── LIST VIEW (ALL QUESTIONS) ─────────────────────────────────────────
// //     return (
// //         <div className="space-y-6 animate-in fade-in zoom-in duration-300">
// //             {/* Clean Header Area */}
// //             <div className="flex justify-between items-center bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-sm">
// //                 <div>
// //                     <button onClick={onBack} className="text-blue-400 text-xs font-bold mb-2 block hover:underline">← Back to Modules</button>
// //                     <h2 className="text-3xl font-black text-white uppercase tracking-tight">{module.name}</h2>
// //                     <p className="text-gray-500 text-xs mt-1">
// //                         {module.accessType === 'global' ? '🌍 Global Module' : `🔐 Selective Module`}
// //                     </p>
// //                 </div>
// //             </div>

// //             {/* Questions List */}
// //             <div className="grid grid-cols-1 gap-4">
// //                 {moduleQuestions.length > 0 ? (
// //                     moduleQuestions.map((q, idx) => {
// //                         // Check if it's a coding question to determine if we show the Practice button
// //                         const isCoding = q.type === 'CODING' || q.type === 'Coding' || q.moduleType === 'Coding';

// //                         return (
// //                             <div key={q.id} className="bg-gray-800 p-5 rounded-xl border border-gray-700 flex justify-between items-center hover:border-gray-500 transition-all group shadow-sm">
// //                                 <div className="flex items-center gap-4">
// //                                     <span className="text-gray-600 font-mono text-sm font-bold">{(idx + 1).toString().padStart(2, '0')}</span>
// //                                     <div>
// //                                         <h4 className="font-bold text-gray-200 text-lg group-hover:text-blue-400 transition-colors">
// //                                             {q.title || q.question || "Untitled"}
// //                                         </h4>
// //                                         <div className="flex gap-2 mt-2">
// //                                             <span className="text-[9px] bg-gray-900 px-2.5 py-0.5 rounded border border-gray-700 text-gray-400 uppercase font-bold tracking-wider">
// //                                                 {q.type || "QUESTION"}
// //                                             </span>
// //                                             {q.difficulty && (
// //                                                 <span className={`text-[9px] px-2.5 py-0.5 rounded border uppercase font-bold tracking-wider ${
// //                                                     q.difficulty === 'Easy' ? 'bg-green-900/20 text-green-400 border-green-500/30' :
// //                                                     q.difficulty === 'Hard' ? 'bg-red-900/20 text-red-400 border-red-500/30' :
// //                                                     'bg-yellow-900/20 text-yellow-400 border-yellow-500/30'
// //                                                 }`}>
// //                                                     {q.difficulty}
// //                                                 </span>
// //                                             )}
// //                                         </div>
// //                                     </div>
// //                                 </div>
                                
// //                                 {/* Action Buttons */}
// //                                 <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
// //                                     {isCoding && (
// //                                         <button 
// //                                             onClick={() => setActivePracticeQ(q)}
// //                                             className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-lg font-bold transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-2"
// //                                         >
// //                                             <span>👨‍💻</span> Practice
// //                                         </button>
// //                                     )}
// //                                     <button 
// //                                         onClick={() => handleUnlinkQuestion(q.id)}
// //                                         className="text-xs bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30 px-4 py-2 rounded-lg font-bold transition-colors flex items-center gap-1"
// //                                     >
// //                                         <span>🗑️</span> Remove
// //                                     </button>
// //                                 </div>
// //                             </div>
// //                         );
// //                     })
// //                 ) : (
// //                     <div className="text-center py-12 text-gray-500 text-sm border-2 border-dashed border-gray-700 rounded-2xl">
// //                         <p>No questions linked to this module yet.</p>
// //                         <p className="mt-1 text-xs">Add them using the "Quick add from bank" dropdown on the dashboard.</p>
// //                     </div>
// //                 )}
// //             </div>
// //         </div>
// //     );
// // };
// import React, { useState, useEffect } from 'react';
// import { doc, updateDoc, arrayRemove } from 'firebase/firestore';
// import { db } from '../../firebase/config';

// export const ModuleDetailView = ({ module, questions, onBack, onRefresh, onPractice }) => {
//     const [activePracticeQ, setActivePracticeQ] = useState(null);
    
//     const [code, setCode] = useState("");
//     const [outputLogs, setOutputLogs] = useState([]);
//     const [isExecuting, setIsExecuting] = useState(false);

//     useEffect(() => {
//         if (activePracticeQ) {
//             const template = activePracticeQ.type === "MCQ" 
//                 ? "// MCQ Practice: Review the options on the left.\n// Mentally select your answer, then click 'Run Code' to check.\n" 
//                 : `// Solve: ${activePracticeQ.title || "Untitled"}\n\nfunction solve() {\n    // TODO: Write your logic here\n    \n}\n`;
            
//             setCode(template);
//             setOutputLogs([
//                 { type: 'system', text: '$ awaiting_execution...' },
//                 { type: 'info', text: 'System ready to compile and run test cases.' }
//             ]);
//         }
//     }, [activePracticeQ]);

//     const handleUnlinkQuestion = async (qId) => {
//         if (!window.confirm("Remove this question from the module?")) return;
//         try {
//             const modRef = doc(db, 'categories', module.id);
//             await updateDoc(modRef, {
//                 questionIds: arrayRemove(qId)
//             });
//             onRefresh();
//             if (activePracticeQ && activePracticeQ.id === qId) {
//                 setActivePracticeQ(null);
//             }
//         } catch (e) { alert("Failed to remove."); }
//     };

//     const handleRunCode = async () => {
//         if (isExecuting) return;
//         setIsExecuting(true);
        
//         setOutputLogs([
//             { type: 'system', text: '$ compiling and executing code...' },
//             { type: 'info', text: 'Connecting to compiler engine...' }
//         ]);

//         await new Promise(resolve => setTimeout(resolve, 1500));

//         try {
//             const isSuccess = code.length > 80; 

//             if (isSuccess) {
//                 setOutputLogs([
//                     { type: 'system', text: '$ execution finished in 0.8s' },
//                     { type: 'success', text: '✅ All Test Cases Passed!' },
//                     { type: 'info', text: 'Output: [ 1, 4, 9, 16 ]' },
//                     { type: 'info', text: 'Memory: 32MB | CPU: 12ms' }
//                 ]);
//             } else {
//                 setOutputLogs([
//                     { type: 'system', text: '$ execution finished with errors' },
//                     { type: 'error', text: '❌ Test Case 1 Failed' },
//                     { type: 'error', text: 'Expected: 5 | Actual: undefined' },
//                     { type: 'info', text: 'Hint: Did you forget to return a value?' }
//                 ]);
//             }
//         } catch (error) {
//             setOutputLogs([
//                 { type: 'error', text: '🚨 Server Error: Could not reach compiler API.' }
//             ]);
//         }
//         setIsExecuting(false);
//     };

//     const handleReset = () => {
//         if (window.confirm("Reset your code to the default template?")) {
//             setCode(`// Solve: ${activePracticeQ.title || "Untitled"}\n\nfunction solve() {\n    // TODO: Write your logic here\n    \n}\n`);
//             setOutputLogs([
//                 { type: 'system', text: '$ code_reset' },
//                 { type: 'info', text: 'Editor restored to default state.' }
//             ]);
//         }
//     };

//     const moduleQuestions = questions.filter(q => 
//         (module.questionIds || []).includes(q.id) || q.category === module.name
//     );

//     if (activePracticeQ) {
//         return (
//             <div className="space-y-4 animate-in fade-in duration-300">
//                 <div className="flex items-center justify-between bg-gray-800 border border-gray-700 p-4 rounded-2xl shadow-lg">
//                     <div className="flex items-center gap-4">
//                         <button onClick={() => setActivePracticeQ(null)} className="text-xs font-bold text-gray-400 border border-gray-600 px-4 py-2 rounded-lg hover:bg-gray-700 hover:text-white transition-all">
//                             ← Back to Questions
//                         </button>
//                         <h2 className="text-lg font-black text-indigo-400">
//                             <span className="text-gray-500 mr-2">Practicing:</span> 
//                             {activePracticeQ.title || activePracticeQ.question || "Untitled"}
//                         </h2>
//                     </div>
//                 </div>

//                 <div className="flex gap-4 h-[650px]">
//                     {/* Left Pane: Problem Description */}
//                     <div className="w-[40%] bg-gray-800 border border-gray-700 rounded-2xl p-6 overflow-y-auto flex flex-col gap-6 custom-scrollbar shadow-lg">
//                         <div className="border-b border-gray-700 pb-4">
//                             <h3 className="text-2xl font-black text-white">{activePracticeQ.title || activePracticeQ.question}</h3>
//                             <div className="flex gap-2 mt-3">
//                                 {activePracticeQ.difficulty && (
//                                     <span className={`text-xs font-black px-3 py-1 rounded-md border tracking-wider uppercase ${
//                                         activePracticeQ.difficulty === 'Easy' ? 'bg-green-900/20 border-green-500/30 text-green-400' :
//                                         activePracticeQ.difficulty === 'Hard' ? 'bg-red-900/20 border-red-500/30 text-red-400' :
//                                         'bg-yellow-900/20 border-yellow-500/30 text-yellow-400'
//                                     }`}>
//                                         {activePracticeQ.difficulty}
//                                     </span>
//                                 )}
//                                 {activePracticeQ.type && (
//                                     <span className="text-xs font-black px-3 py-1 rounded-md border bg-purple-900/20 border-purple-500/30 text-purple-400 uppercase tracking-wider">
//                                         {activePracticeQ.type}
//                                     </span>
//                                 )}
//                             </div>
//                         </div>
                        
//                         <div>
//                             <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-3">Description</h4>
//                             <div className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">
//                                 {activePracticeQ.description || activePracticeQ.question || "No description provided."}
//                             </div>
//                         </div>

//                         {activePracticeQ.constraints && (
//                             <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700/50">
//                                 <h4 className="text-xs font-black text-yellow-500/70 uppercase tracking-widest mb-2 flex items-center gap-2">
//                                     <span>⚠️</span> Constraints
//                                 </h4>
//                                 <div className="text-xs font-mono text-gray-400 whitespace-pre-wrap">
//                                     {activePracticeQ.constraints}
//                                 </div>
//                             </div>
//                         )}

//                         {activePracticeQ.type === "MCQ" && activePracticeQ.options && (
//                             <div className="mt-4">
//                                 <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-3">Options</h4>
//                                 <div className="space-y-2">
//                                     {activePracticeQ.options.map((opt, i) => (
//                                         <div key={i} className="p-3 bg-gray-900 border border-gray-700 rounded-lg text-sm text-gray-300">
//                                             <span className="font-bold text-gray-500 mr-2">{String.fromCharCode(65 + i)}.</span> {opt}
//                                         </div>
//                                     ))}
//                                 </div>
//                             </div>
//                         )}
//                     </div>

//                     {/* Right Pane: Code Editor & Terminal */}
//                     <div className="w-[60%] flex flex-col gap-4">
//                         <div className="bg-[#0d1117] border border-gray-700 rounded-2xl p-4 flex-1 flex flex-col relative shadow-lg">
//                             <div className="flex justify-between items-center mb-3 border-b border-gray-800 pb-3">
//                                 <div className="flex gap-2">
//                                    <span className="bg-gray-800/80 text-blue-400 text-xs px-4 py-1.5 rounded-lg font-mono border border-gray-700 font-bold">
//                                        solution.code
//                                    </span>
//                                 </div>
//                                 <div className="flex gap-3">
//                                     <button 
//                                         onClick={handleReset}
//                                         disabled={isExecuting}
//                                         className="px-4 py-1.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-xs font-bold transition-all text-gray-300 disabled:opacity-50"
//                                     >
//                                         ↺ Reset
//                                     </button>
//                                     <button 
//                                         onClick={handleRunCode}
//                                         disabled={isExecuting}
//                                         className="px-6 py-1.5 bg-green-600 hover:bg-green-500 rounded-lg text-xs font-black text-white transition-all shadow-lg shadow-green-600/20 active:scale-95 flex items-center gap-2 disabled:opacity-50 disabled:bg-green-800"
//                                     >
//                                         {isExecuting ? (
//                                             <><span className="animate-spin text-lg leading-none">⚙️</span> Running...</>
//                                         ) : (
//                                             <><span>▶</span> Run Code</>
//                                         )}
//                                     </button>
//                                 </div>
//                             </div>
                            
//                             <textarea 
//                                 value={code}
//                                 onChange={(e) => setCode(e.target.value)}
//                                 className="flex-1 w-full bg-transparent text-sm font-mono text-gray-300 outline-none resize-none p-2 custom-scrollbar" 
//                                 spellCheck={false}
//                             />
//                         </div>

//                         {/* Terminal / Output Console */}
//                         <div className="bg-black border border-gray-700 rounded-2xl h-56 p-5 flex flex-col relative shadow-lg">
//                             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gray-800 via-gray-600 to-gray-800"></div>
//                             <div className="flex justify-between items-center mb-3">
//                                 <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
//                                     <span className={`w-2 h-2 rounded-full ${isExecuting ? 'bg-yellow-400 animate-ping' : 'bg-green-500'}`}></span> Output Console
//                                 </h3>
//                                 <span className="text-[10px] font-mono text-gray-600">Terminal Ready</span>
//                             </div>
//                             <div className="flex-1 text-xs font-mono overflow-y-auto bg-gray-900/30 rounded-lg p-3 border border-gray-800 space-y-1">
//                                 {outputLogs.map((log, i) => (
//                                     <div key={i} className={`
//                                         ${log.type === 'system' ? 'text-blue-400' : ''}
//                                         ${log.type === 'info' ? 'text-gray-400' : ''}
//                                         ${log.type === 'success' ? 'text-green-400 font-bold' : ''}
//                                         ${log.type === 'error' ? 'text-red-400 font-bold' : ''}
//                                     `}>
//                                         {log.text}
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         );
//     }

//     // ─── LIST VIEW ─────────────────────────────────────────────────────────
//     return (
//         <div className="space-y-6 animate-in fade-in zoom-in duration-300">
//             {/* Clean Header Area */}
//             <div className="flex justify-between items-center bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-sm">
//                 <div>
//                     <button onClick={onBack} className="text-blue-400 text-xs font-bold mb-2 block hover:underline">← Back to Modules</button>
//                     <h2 className="text-3xl font-black text-white uppercase tracking-tight">{module.name}</h2>
//                     <p className="text-gray-500 text-xs mt-1">
//                         {module.accessType === 'global' ? '🌍 Global Module' : `🔐 Selective Module`}
//                     </p>
//                 </div>
//             </div>

//             {/* Questions List */}
//             <div className="grid grid-cols-1 gap-4">
//                 {moduleQuestions.length > 0 ? (
//                     moduleQuestions.map((q, idx) => {
//                         const isCoding = q.type === 'CODING' || q.type === 'Coding' || q.moduleType === 'Coding';

//                         return (
//                             <div key={q.id} className="bg-gray-800 p-5 rounded-xl border border-gray-700 flex justify-between items-center hover:border-gray-500 transition-all group shadow-sm">
//                                 <div className="flex items-center gap-4">
//                                     <span className="text-gray-600 font-mono text-sm font-bold">{(idx + 1).toString().padStart(2, '0')}</span>
//                                     <div>
//                                         <h4 className="font-bold text-gray-200 text-lg group-hover:text-blue-400 transition-colors">
//                                             {q.title || q.question || "Untitled"}
//                                         </h4>
//                                         <div className="flex gap-2 mt-2">
//                                             <span className="text-[9px] bg-gray-900 px-2.5 py-0.5 rounded border border-gray-700 text-gray-400 uppercase font-bold tracking-wider">
//                                                 {q.type || "QUESTION"}
//                                             </span>
//                                             {q.difficulty && (
//                                                 <span className={`text-[9px] px-2.5 py-0.5 rounded border uppercase font-bold tracking-wider ${
//                                                     q.difficulty === 'Easy' ? 'bg-green-900/20 text-green-400 border-green-500/30' :
//                                                     q.difficulty === 'Hard' ? 'bg-red-900/20 text-red-400 border-red-500/30' :
//                                                     'bg-yellow-900/20 text-yellow-400 border-yellow-500/30'
//                                                 }`}>
//                                                     {q.difficulty}
//                                                 </span>
//                                             )}
//                                         </div>
//                                     </div>
//                                 </div>
                                
//                                 {/* Action Buttons */}
//                                 <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
//                                     {isCoding && (
//                                         <button onClick={() => onPractice(idx)}
//                                             className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-lg font-bold transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-2"
//                                         >
//                                             <span>👨‍💻</span> Practice
//                                         </button>
//                                     )}
//                                     <button 
//                                         onClick={() => handleUnlinkQuestion(q.id)}
//                                         className="text-xs bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30 px-4 py-2 rounded-lg font-bold transition-colors flex items-center gap-1"
//                                     >
//                                         <span>🗑️</span> Remove
//                                     </button>
//                                 </div>
//                             </div>
//                         );
//                     })
//                 ) : (
//                     <div className="text-center py-12 text-gray-500 text-sm border-2 border-dashed border-gray-700 rounded-2xl">
//                         <p>No questions linked to this module yet.</p>
//                         <p className="mt-1 text-xs">Add them using the "Quick add from bank" dropdown on the dashboard.</p>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

////

import React from 'react';
import { doc, updateDoc, arrayRemove } from 'firebase/firestore';
import { db } from '../../firebase/config';

export const ModuleDetailView = ({ module, questions, onBack, onRefresh, onPractice }) => {

    // Removes a question from this specific module
    const handleUnlinkQuestion = async (qId) => {
        if (!window.confirm("Remove this question from the module?")) return;
        try {
            const modRef = doc(db, 'categories', module.id);
            await updateDoc(modRef, {
                questionIds: arrayRemove(qId)
            });
            onRefresh();
        } catch (e) { alert("Failed to remove."); }
    };

    // Filter questions that belong to this module
    const moduleQuestions = questions.filter(q => 
        (module.questionIds || []).includes(q.id) || q.category === module.name
    );

    return (
        <div className="space-y-6 animate-in fade-in zoom-in duration-300">
            {/* Clean Header Area */}
            <div className="flex justify-between items-center bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-sm">
                <div>
                    <button onClick={onBack} className="text-blue-400 text-xs font-bold mb-2 block hover:underline">← Back to Modules</button>
                    <h2 className="text-3xl font-black text-white uppercase tracking-tight">{module.name}</h2>
                    <p className="text-gray-500 text-xs mt-1">
                        {module.accessType === 'global' ? '🌍 Global Module' : `🔐 Selective Module`}
                    </p>
                </div>
            </div>

            {/* Questions List */}
            <div className="grid grid-cols-1 gap-4">
                {moduleQuestions.length > 0 ? (
                    moduleQuestions.map((q, idx) => {
                        const isCoding = q.type === 'CODING' || q.type === 'Coding' || q.moduleType === 'Coding';

                        return (
                            <div key={q.id} className="bg-gray-800 p-5 rounded-xl border border-gray-700 flex justify-between items-center hover:border-gray-500 transition-all group shadow-sm">
                                <div className="flex items-center gap-4">
                                    <span className="text-gray-600 font-mono text-sm font-bold">{(idx + 1).toString().padStart(2, '0')}</span>
                                    <div>
                                        <h4 className="font-bold text-gray-200 text-lg group-hover:text-blue-400 transition-colors">
                                            {q.title || q.question || "Untitled"}
                                        </h4>
                                        <div className="flex gap-2 mt-2">
                                            <span className="text-[9px] bg-gray-900 px-2.5 py-0.5 rounded border border-gray-700 text-gray-400 uppercase font-bold tracking-wider">
                                                {q.type || "QUESTION"}
                                            </span>
                                            {q.difficulty && (
                                                <span className={`text-[9px] px-2.5 py-0.5 rounded border uppercase font-bold tracking-wider ${
                                                    q.difficulty === 'Easy' ? 'bg-green-900/20 text-green-400 border-green-500/30' :
                                                    q.difficulty === 'Hard' ? 'bg-red-900/20 text-red-400 border-red-500/30' :
                                                    'bg-yellow-900/20 text-yellow-400 border-yellow-500/30'
                                                }`}>
                                                    {q.difficulty}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Action Buttons */}
                                <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    
                                    {/* ── UPDATED: ALWAYS SHOW PRACTICE BUTTON ── */}
                                    <button onClick={() => onPractice(idx)}
                                        className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-lg font-bold transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-2"
                                    >
                                        <span>{isCoding ? "👨‍💻" : "📝"}</span> Practice
                                    </button>

                                    <button 
                                        onClick={() => handleUnlinkQuestion(q.id)}
                                        className="text-xs bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30 px-4 py-2 rounded-lg font-bold transition-colors flex items-center gap-1"
                                    >
                                        <span>🗑️</span> Remove
                                    </button>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="text-center py-12 text-gray-500 text-sm border-2 border-dashed border-gray-700 rounded-2xl">
                        <p>No questions linked to this module yet.</p>
                        <p className="mt-1 text-xs">Add them using the "Quick add from bank" dropdown on the dashboard.</p>
                    </div>
                )}
            </div>
        </div>
    );
};