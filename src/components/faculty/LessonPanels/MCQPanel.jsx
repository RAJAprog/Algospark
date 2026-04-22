// // import React, { useState, useEffect, useCallback } from "react";
// // import {
// //   collection, getDocs, addDoc, doc, updateDoc, deleteDoc,
// //   query, orderBy, serverTimestamp
// // } from "firebase/firestore";
// // import { db } from "../../../firebase/config";

// // const EMPTY_FORM = {
// //   question: "",
// //   options: ["", "", "", ""],
// //   correctIndex: 0,
// //   explanation: "",
// // };

// // const MCQPanel = ({ language, topic, currentUser, onBack }) => {
// //   const [mcqs, setMcqs]       = useState([]);
// //   const [isLoading, setIsLoading] = useState(true);
// //   const [showForm, setShowForm]   = useState(false);
// //   const [editItem, setEditItem]   = useState(null);
// //   const [form, setForm]           = useState(EMPTY_FORM);
// //   const [previewId, setPreviewId] = useState(null);
// //   const [selectedAnswer, setSelectedAnswer] = useState(null);

// //   const collPath = `categories/${language.id}/topics/${topic.id}/mcqs`;

// //   const fetchMcqs = useCallback(async () => {
// //     setIsLoading(true);
// //     try {
// //       const snap = await getDocs(query(collection(db, collPath), orderBy("createdAt", "asc")));
// //       setMcqs(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
// //     } catch (e) { console.error(e); }
// //     setIsLoading(false);
// //   }, [collPath]);

// //   useEffect(() => { fetchMcqs(); }, [fetchMcqs]);

// //   const openAdd  = () => { setForm(EMPTY_FORM); setEditItem(null); setShowForm(true); };
// //   const openEdit = (q) => {
// //     setForm({
// //       question: q.question,
// //       options: [...q.options],
// //       correctIndex: q.correctIndex,
// //       explanation: q.explanation || "",
// //     });
// //     setEditItem(q);
// //     setShowForm(true);
// //   };

// //   const handleSave = async () => {
// //     if (!form.question.trim()) { alert("Question required"); return; }
// //     if (form.options.some((o) => !o.trim())) { alert("All 4 options required"); return; }
// //     try {
// //       if (editItem) {
// //         await updateDoc(doc(db, collPath, editItem.id), { ...form, updatedAt: serverTimestamp() });
// //       } else {
// //         await addDoc(collection(db, collPath), { ...form, createdBy: currentUser?.uid, createdAt: serverTimestamp() });
// //       }
// //       setShowForm(false);
// //       fetchMcqs();
// //     } catch (e) { alert("Save failed: " + e.message); }
// //   };

// //   const handleDelete = async (id) => {
// //     if (!window.confirm("Delete this MCQ?")) return;
// //     try { await deleteDoc(doc(db, collPath, id)); fetchMcqs(); }
// //     catch (e) { alert("Delete failed"); }
// //   };

// //   const setOption = (i, val) => {
// //     const opts = [...form.options];
// //     opts[i] = val;
// //     setForm({ ...form, options: opts });
// //   };

// //   return (
// //     <div className="space-y-5 animate-in fade-in duration-300">
// //       {/* Header */}
// //       <div className="flex items-center gap-3">
// //         <button onClick={onBack} className="text-xs font-bold text-pink-400 border border-pink-500/40 px-3 py-1.5 rounded-lg bg-pink-500/10 hover:bg-pink-500/20 transition-all">
// //           ← Back
// //         </button>
// //         <div>
// //           <h2 className="text-xl font-black">🧠 MCQ Practice</h2>
// //           <p className="text-xs text-gray-500">{language?.name} → {topic?.name}</p>
// //         </div>
// //         <button onClick={openAdd} className="ml-auto bg-purple-600 hover:bg-purple-500 px-5 py-2 rounded-xl text-xs font-black transition-all active:scale-95">
// //           + Add MCQ
// //         </button>
// //       </div>

// //       {/* Add/Edit Form */}
// //       {showForm && (
// //         <div className="bg-gray-800 border border-purple-500/40 rounded-2xl p-5 space-y-4">
// //           <div className="text-sm font-black text-purple-400 uppercase tracking-widest">
// //             {editItem ? "Edit MCQ" : "New MCQ"}
// //           </div>

// //           <div>
// //             <label className="text-[10px] text-gray-500 uppercase font-bold mb-1 block">Question *</label>
// //             <textarea
// //               value={form.question}
// //               onChange={(e) => setForm({ ...form, question: e.target.value })}
// //               rows={2}
// //               placeholder="Enter your question..."
// //               className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-purple-500 resize-none"
// //             />
// //           </div>

// //           <div>
// //             <label className="text-[10px] text-gray-500 uppercase font-bold mb-2 block">
// //               Options — click the radio to mark correct answer
// //             </label>
// //             <div className="space-y-2">
// //               {form.options.map((opt, i) => (
// //                 <div key={i} className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all ${form.correctIndex === i ? "border-green-500/50 bg-green-500/5" : "border-gray-700"}`}>
// //                   <button
// //                     type="button"
// //                     onClick={() => setForm({ ...form, correctIndex: i })}
// //                     className={`w-5 h-5 rounded-full border-2 flex-shrink-0 transition-all ${form.correctIndex === i ? "border-green-500 bg-green-500" : "border-gray-500"}`}
// //                   >
// //                     {form.correctIndex === i && (
// //                       <svg width="8" height="8" viewBox="0 0 8 8" className="mx-auto mt-0.5" fill="none">
// //                         <circle cx="4" cy="4" r="2" fill="white"/>
// //                       </svg>
// //                     )}
// //                   </button>
// //                   <span className="text-xs text-gray-500 font-bold w-4">
// //                     {String.fromCharCode(65 + i)}.
// //                   </span>
// //                   <input
// //                     value={opt}
// //                     onChange={(e) => setOption(i, e.target.value)}
// //                     placeholder={`Option ${String.fromCharCode(65 + i)}`}
// //                     className="flex-1 bg-transparent outline-none text-sm"
// //                   />
// //                   {form.correctIndex === i && (
// //                     <span className="text-[10px] text-green-400 font-black">✓ Correct</span>
// //                   )}
// //                 </div>
// //               ))}
// //             </div>
// //           </div>

// //           <div>
// //             <label className="text-[10px] text-gray-500 uppercase font-bold mb-1 block">Explanation (optional)</label>
// //             <textarea
// //               value={form.explanation}
// //               onChange={(e) => setForm({ ...form, explanation: e.target.value })}
// //               rows={2}
// //               placeholder="Why is this the correct answer?"
// //               className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-purple-500 resize-none"
// //             />
// //           </div>

// //           <div className="flex gap-3 justify-end">
// //             <button onClick={() => setShowForm(false)} className="px-5 py-2 rounded-xl text-xs font-black bg-gray-700 hover:bg-gray-600 transition-all">Cancel</button>
// //             <button onClick={handleSave} className="px-6 py-2 rounded-xl text-xs font-black bg-purple-600 hover:bg-purple-500 transition-all active:scale-95">
// //               {editItem ? "Save Changes" : "Add MCQ"}
// //             </button>
// //           </div>
// //         </div>
// //       )}

// //       {/* MCQ List */}
// //       {isLoading ? (
// //         <div className="flex justify-center py-10">
// //           <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
// //         </div>
// //       ) : mcqs.length === 0 ? (
// //         <div className="text-center text-gray-500 py-10 text-sm">No MCQs yet — add one above.</div>
// //       ) : (
// //         <div className="space-y-4">
// //           {mcqs.map((q, i) => (
// //             <MCQCard
// //               key={q.id}
// //               q={q}
// //               index={i}
// //               isPreview={previewId === q.id}
// //               selectedAnswer={previewId === q.id ? selectedAnswer : null}
// //               onTogglePreview={() => {
// //                 setPreviewId(previewId === q.id ? null : q.id);
// //                 setSelectedAnswer(null);
// //               }}
// //               onSelectAnswer={setSelectedAnswer}
// //               onEdit={() => openEdit(q)}
// //               onDelete={() => handleDelete(q.id)}
// //             />
// //           ))}
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // /* ─── Single MCQ Card ─────────────────────────────── */
// // const MCQCard = ({ q, index, isPreview, selectedAnswer, onTogglePreview, onSelectAnswer, onEdit, onDelete }) => {
// //   const getOptionStyle = (i) => {
// //     if (!isPreview || selectedAnswer === null) {
// //       return "border-gray-700 bg-gray-800/50";
// //     }
// //     if (i === q.correctIndex) return "border-green-500/50 bg-green-500/10";
// //     if (i === selectedAnswer && i !== q.correctIndex) return "border-red-500/50 bg-red-500/10";
// //     return "border-gray-700 bg-gray-800/50 opacity-50";
// //   };

// //   const getOptionIcon = (i) => {
// //     if (!isPreview || selectedAnswer === null) return null;
// //     if (i === q.correctIndex) return <span className="text-green-400 text-sm">✓</span>;
// //     if (i === selectedAnswer && i !== q.correctIndex) return <span className="text-red-400 text-sm">✗</span>;
// //     return null;
// //   };

// //   return (
// //     <div className="bg-gray-800 border border-gray-700 rounded-2xl p-5 hover:border-gray-600 transition-all">
// //       <div className="flex items-start justify-between gap-4 mb-4">
// //         <div className="flex items-start gap-3">
// //           <span className="text-xs font-black text-gray-600 mt-1 min-w-[20px]">Q{index + 1}</span>
// //           <p className="text-sm font-bold text-white leading-relaxed">{q.question}</p>
// //         </div>
// //         <div className="flex gap-2 flex-shrink-0">
// //           <button onClick={onTogglePreview} className="text-xs bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/30 px-3 py-1.5 rounded-lg font-bold transition-all">
// //             {isPreview ? "Close" : "Preview"}
// //           </button>
// //           <button onClick={onEdit} className="text-xs bg-gray-700 hover:bg-gray-600 px-3 py-1.5 rounded-lg font-bold transition-all">Edit</button>
// //           <button onClick={onDelete} className="text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1.5 rounded-lg font-bold transition-all">Del</button>
// //         </div>
// //       </div>

// //       {/* Options */}
// //       <div className="space-y-2 ml-8">
// //         {q.options.map((opt, i) => (
// //           <button
// //             key={i}
// //             onClick={() => isPreview && onSelectAnswer(i)}
// //             className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${getOptionStyle(i)} ${isPreview ? "cursor-pointer hover:opacity-90" : "cursor-default"}`}
// //           >
// //             <span className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center text-[10px] font-black
// //               ${!isPreview && i === q.correctIndex ? "border-green-500 bg-green-500/20 text-green-400" : "border-gray-600 text-gray-500"}`}>
// //               {String.fromCharCode(65 + i)}
// //             </span>
// //             <span className="text-sm flex-1">{opt}</span>
// //             {getOptionIcon(i)}
// //           </button>
// //         ))}
// //       </div>

// //       {/* Show explanation after answer */}
// //       {isPreview && selectedAnswer !== null && q.explanation && (
// //         <div className="mt-3 ml-8 bg-blue-500/10 border border-blue-500/30 rounded-xl p-3">
// //           <div className="text-[10px] font-black text-blue-400 uppercase mb-1">Explanation</div>
// //           <p className="text-xs text-gray-300">{q.explanation}</p>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default MCQPanel;
// ////



// import React, { useState, useEffect, useCallback } from "react";
// import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, query, orderBy, serverTimestamp } from "firebase/firestore";

// // FIXED FIREBASE IMPORT PATH
// import { db, storage } from "../../../firebase/config";

// const EMPTY_FORM = { question: "", options: ["", "", "", ""], correctIndex: 0, explanation: "" };

// const MCQPanel = ({ language, topic, currentUser, onBack }) => {
//   const [mcqs, setMcqs]       = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [showForm, setShowForm]   = useState(false);
//   const [editItem, setEditItem]   = useState(null);
//   const [form, setForm]           = useState(EMPTY_FORM);
//   const [previewId, setPreviewId] = useState(null);
//   const [selectedAnswer, setSelectedAnswer] = useState(null);

//   const collPath = `categories/${language.id}/topics/${topic.id}/mcqs`;

//   const fetchMcqs = useCallback(async () => {
//     setIsLoading(true);
//     try {
//       const snap = await getDocs(query(collection(db, collPath), orderBy("createdAt", "asc")));
//       setMcqs(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
//     } catch (e) { console.error(e); }
//     setIsLoading(false);
//   }, [collPath]);

//   useEffect(() => { fetchMcqs(); }, [fetchMcqs]);

//   const openAdd  = () => { setForm(EMPTY_FORM); setEditItem(null); setShowForm(true); };
//   const openEdit = (q) => { setForm({ question: q.question, options: [...q.options], correctIndex: q.correctIndex, explanation: q.explanation || "" }); setEditItem(q); setShowForm(true); };

//   const handleSave = async () => {
//     if (!form.question.trim()) { alert("Question required"); return; }
//     if (form.options.some((o) => !o.trim())) { alert("All 4 options required"); return; }
//     try {
//       if (editItem) { await updateDoc(doc(db, collPath, editItem.id), { ...form, updatedAt: serverTimestamp() }); } 
//       else { await addDoc(collection(db, collPath), { ...form, createdBy: currentUser?.uid, createdAt: serverTimestamp() }); }
//       setShowForm(false); fetchMcqs();
//     } catch (e) { alert("Save failed: " + e.message); }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Delete this MCQ?")) return;
//     try { await deleteDoc(doc(db, collPath, id)); fetchMcqs(); } catch (e) { alert("Delete failed"); }
//   };

//   const setOption = (i, val) => { const opts = [...form.options]; opts[i] = val; setForm({ ...form, options: opts }); };

//   return (
//     <div className="space-y-5 animate-in fade-in duration-300">
//       <div className="flex items-center gap-3">
//         <button onClick={onBack} className="text-xs font-bold text-pink-400 border border-pink-500/40 px-3 py-1.5 rounded-lg bg-pink-500/10 hover:bg-pink-500/20 transition-all">← Back</button>
//         <div><h2 className="text-xl font-black">🧠 MCQ Practice</h2><p className="text-xs text-gray-500">{language?.name} → {topic?.name}</p></div>
//         <button onClick={openAdd} className="ml-auto bg-purple-600 hover:bg-purple-500 px-5 py-2 rounded-xl text-xs font-black transition-all active:scale-95">+ Add MCQ</button>
//       </div>

//       {showForm && (
//         <div className="bg-gray-800 border border-purple-500/40 rounded-2xl p-5 space-y-4">
//           <div className="text-sm font-black text-purple-400 uppercase tracking-widest">{editItem ? "Edit MCQ" : "New MCQ"}</div>
//           <div><label className="text-[10px] text-gray-500 uppercase font-bold mb-1 block">Question *</label><textarea value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} rows={2} placeholder="Enter your question..." className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-purple-500 resize-none" /></div>
//           <div>
//             <label className="text-[10px] text-gray-500 uppercase font-bold mb-2 block">Options — click the radio to mark correct answer</label>
//             <div className="space-y-2">
//               {form.options.map((opt, i) => (
//                 <div key={i} className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all ${form.correctIndex === i ? "border-green-500/50 bg-green-500/5" : "border-gray-700"}`}>
//                   <button type="button" onClick={() => setForm({ ...form, correctIndex: i })} className={`w-5 h-5 rounded-full border-2 flex-shrink-0 transition-all ${form.correctIndex === i ? "border-green-500 bg-green-500" : "border-gray-500"}`}>{form.correctIndex === i && <svg width="8" height="8" viewBox="0 0 8 8" className="mx-auto mt-0.5" fill="none"><circle cx="4" cy="4" r="2" fill="white"/></svg>}</button>
//                   <span className="text-xs text-gray-500 font-bold w-4">{String.fromCharCode(65 + i)}.</span>
//                   <input value={opt} onChange={(e) => setOption(i, e.target.value)} placeholder={`Option ${String.fromCharCode(65 + i)}`} className="flex-1 bg-transparent outline-none text-sm" />
//                   {form.correctIndex === i && <span className="text-[10px] text-green-400 font-black">✓ Correct</span>}
//                 </div>
//               ))}
//             </div>
//           </div>
//           <div><label className="text-[10px] text-gray-500 uppercase font-bold mb-1 block">Explanation (optional)</label><textarea value={form.explanation} onChange={(e) => setForm({ ...form, explanation: e.target.value })} rows={2} placeholder="Why is this the correct answer?" className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-purple-500 resize-none" /></div>
//           <div className="flex gap-3 justify-end"><button onClick={() => setShowForm(false)} className="px-5 py-2 rounded-xl text-xs font-black bg-gray-700 hover:bg-gray-600 transition-all">Cancel</button><button onClick={handleSave} className="px-6 py-2 rounded-xl text-xs font-black bg-purple-600 hover:bg-purple-500 transition-all active:scale-95">{editItem ? "Save Changes" : "Add MCQ"}</button></div>
//         </div>
//       )}

//       {isLoading ? <div className="flex justify-center py-10"><div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" /></div> : mcqs.length === 0 ? <div className="text-center text-gray-500 py-10 text-sm">No MCQs yet — add one above.</div> : (
//         <div className="space-y-4">
//           {mcqs.map((q, i) => (
//             <MCQCard key={q.id} q={q} index={i} isPreview={previewId === q.id} selectedAnswer={previewId === q.id ? selectedAnswer : null} onTogglePreview={() => { setPreviewId(previewId === q.id ? null : q.id); setSelectedAnswer(null); }} onSelectAnswer={setSelectedAnswer} onEdit={() => openEdit(q)} onDelete={() => handleDelete(q.id)} />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// const MCQCard = ({ q, index, isPreview, selectedAnswer, onTogglePreview, onSelectAnswer, onEdit, onDelete }) => {
//   const getOptionStyle = (i) => {
//     if (!isPreview || selectedAnswer === null) return "border-gray-700 bg-gray-800/50";
//     if (i === q.correctIndex) return "border-green-500/50 bg-green-500/10";
//     if (i === selectedAnswer && i !== q.correctIndex) return "border-red-500/50 bg-red-500/10";
//     return "border-gray-700 bg-gray-800/50 opacity-50";
//   };
//   const getOptionIcon = (i) => {
//     if (!isPreview || selectedAnswer === null) return null;
//     if (i === q.correctIndex) return <span className="text-green-400 text-sm">✓</span>;
//     if (i === selectedAnswer && i !== q.correctIndex) return <span className="text-red-400 text-sm">✗</span>;
//     return null;
//   };

//   return (
//     <div className="bg-gray-800 border border-gray-700 rounded-2xl p-5 hover:border-gray-600 transition-all">
//       <div className="flex items-start justify-between gap-4 mb-4">
//         <div className="flex items-start gap-3"><span className="text-xs font-black text-gray-600 mt-1 min-w-[20px]">Q{index + 1}</span><p className="text-sm font-bold text-white leading-relaxed">{q.question}</p></div>
//         <div className="flex gap-2 flex-shrink-0">
//           <button onClick={onTogglePreview} className="text-xs bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/30 px-3 py-1.5 rounded-lg font-bold transition-all">{isPreview ? "Close" : "Preview"}</button>
//           <button onClick={onEdit} className="text-xs bg-gray-700 hover:bg-gray-600 px-3 py-1.5 rounded-lg font-bold transition-all">Edit</button>
//           <button onClick={onDelete} className="text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1.5 rounded-lg font-bold transition-all">Del</button>
//         </div>
//       </div>
//       <div className="space-y-2 ml-8">
//         {q.options.map((opt, i) => (
//           <button key={i} onClick={() => isPreview && onSelectAnswer(i)} className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${getOptionStyle(i)} ${isPreview ? "cursor-pointer hover:opacity-90" : "cursor-default"}`}>
//             <span className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center text-[10px] font-black ${!isPreview && i === q.correctIndex ? "border-green-500 bg-green-500/20 text-green-400" : "border-gray-600 text-gray-500"}`}>{String.fromCharCode(65 + i)}</span>
//             <span className="text-sm flex-1">{opt}</span>{getOptionIcon(i)}
//           </button>
//         ))}
//       </div>
//       {isPreview && selectedAnswer !== null && q.explanation && (
//         <div className="mt-3 ml-8 bg-blue-500/10 border border-blue-500/30 rounded-xl p-3"><div className="text-[10px] font-black text-blue-400 uppercase mb-1">Explanation</div><p className="text-xs text-gray-300">{q.explanation}</p></div>
//       )}
//     </div>
//   );
// };
// export default MCQPanel;

import React, { useState } from "react";
import { collection, doc, addDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../../firebase/config";

const EMPTY_FORM = { question: "", options: ["", "", "", ""], correctIndex: 0, explanation: "" };

const MCQPanel = ({ language, topic, currentUser, allQuestions, onRefresh, onBack }) => {
  const [showForm, setShowForm]   = useState(false);
  const [editItem, setEditItem]   = useState(null);
  const [form, setForm]           = useState(EMPTY_FORM);
  const [previewId, setPreviewId] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  // FIXED: Pull questions linked to this topic from the global bank
  const topicMcqIds = topic?.mcqIds || [];
  const mcqs = allQuestions.filter(q => topicMcqIds.includes(q.id));

  const openAdd  = () => { setForm(EMPTY_FORM); setEditItem(null); setShowForm(true); };
  const openEdit = (q) => { setForm({ question: q.question, options: [...q.options], correctIndex: q.correctIndex, explanation: q.explanation || "" }); setEditItem(q); setShowForm(true); };

  const handleSave = async () => {
    if (!form.question.trim()) { alert("Question required"); return; }
    try {
      if (editItem) {
        await updateDoc(doc(db, "questions", editItem.id), { ...form, updatedAt: serverTimestamp() });
      } else {
        const res = await addDoc(collection(db, "questions"), { ...form, type: "MCQ", moduleType: "Tech MCQs", createdBy: currentUser?.uid, createdAt: serverTimestamp() });
        const updatedTopics = language.topics.map(t => t.id === topic.id ? { ...t, mcqIds: [...(t.mcqIds||[]), res.id] } : t);
        await updateDoc(doc(db, "categories", language.id), { topics: updatedTopics });
      }
      setShowForm(false);
      onRefresh();
    } catch (e) { alert("Save failed: " + e.message); }
  };

  const handleLink = async (qId) => {
    if (!qId) return;
    try {
        const updatedTopics = language.topics.map(t => t.id === topic.id ? { ...t, mcqIds: [...(t.mcqIds||[]), qId] } : t);
        await updateDoc(doc(db, "categories", language.id), { topics: updatedTopics });
        onRefresh();
    } catch (e) { alert("Link failed."); }
  };

  const handleUnlink = async (qId) => {
    if (!window.confirm("Remove this MCQ from topic? (Stays in bank)")) return;
    try { 
        const updatedTopics = language.topics.map(t => t.id === topic.id ? { ...t, mcqIds: (t.mcqIds||[]).filter(id => id !== qId) } : t);
        await updateDoc(doc(db, "categories", language.id), { topics: updatedTopics });
        onRefresh(); 
    } catch (e) { alert("Remove failed"); }
  };

  const setOption = (i, val) => {
    const opts = [...form.options];
    opts[i] = val;
    setForm({ ...form, options: opts });
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="text-xs font-bold text-pink-400 border border-pink-500/40 px-3 py-1.5 rounded-lg bg-pink-500/10 hover:bg-pink-500/20 transition-all">← Back</button>
        <div>
          <h2 className="text-xl font-black">🧠 MCQ Practice</h2>
          <p className="text-xs text-gray-500">{language?.name} → {topic?.name}</p>
        </div>
        
        {/* Link from Global Bank */}
        <select value="" onChange={e => handleLink(e.target.value)} className="ml-auto bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-sm outline-none focus:border-purple-500 text-gray-300 w-48">
            <option value="">Link from bank...</option>
            {allQuestions.filter(q => (q.type === 'MCQ' || q.moduleType?.includes('MCQ')) && !topicMcqIds.includes(q.id)).map(q => (
                <option key={q.id} value={q.id}>{q.question || "Untitled"}</option>
            ))}
        </select>
        
        <button onClick={openAdd} className="bg-purple-600 hover:bg-purple-500 px-5 py-2 rounded-xl text-xs font-black transition-all active:scale-95">+ Add MCQ</button>
      </div>

      {showForm && (
        <div className="bg-gray-800 border border-purple-500/40 rounded-2xl p-5 space-y-4">
          <div className="text-sm font-black text-purple-400 uppercase tracking-widest">{editItem ? "Edit MCQ" : "New MCQ"}</div>
          <div>
            <label className="text-[10px] text-gray-500 uppercase font-bold mb-1 block">Question *</label>
            <textarea value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} rows={2} className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-purple-500 resize-none" />
          </div>
          <div>
            <label className="text-[10px] text-gray-500 uppercase font-bold mb-2 block">Options — click radio to mark correct answer</label>
            <div className="space-y-2">
              {form.options.map((opt, i) => (
                <div key={i} className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all ${form.correctIndex === i ? "border-green-500/50 bg-green-500/5" : "border-gray-700"}`}>
                  <button type="button" onClick={() => setForm({ ...form, correctIndex: i })} className={`w-5 h-5 rounded-full border-2 flex-shrink-0 transition-all ${form.correctIndex === i ? "border-green-500 bg-green-500" : "border-gray-500"}`} />
                  <input value={opt} onChange={(e) => setOption(i, e.target.value)} className="flex-1 bg-transparent outline-none text-sm" />
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-3 justify-end">
            <button onClick={() => setShowForm(false)} className="px-5 py-2 rounded-xl text-xs font-black bg-gray-700 hover:bg-gray-600 transition-all">Cancel</button>
            <button onClick={handleSave} className="px-6 py-2 rounded-xl text-xs font-black bg-purple-600 hover:bg-purple-500 transition-all active:scale-95">{editItem ? "Save Changes" : "Add MCQ"}</button>
          </div>
        </div>
      )}

      {mcqs.length === 0 ? <div className="text-center text-gray-500 py-10 text-sm">No MCQs in this topic yet. Add one above or link from the bank.</div> : (
        <div className="space-y-4">
          {mcqs.map((q, i) => (
            <MCQCard key={q.id} q={q} index={i} isPreview={previewId === q.id} selectedAnswer={previewId === q.id ? selectedAnswer : null} onTogglePreview={() => { setPreviewId(previewId === q.id ? null : q.id); setSelectedAnswer(null); }} onSelectAnswer={setSelectedAnswer} onEdit={() => openEdit(q)} onDelete={() => handleUnlink(q.id)} />
          ))}
        </div>
      )}
    </div>
  );
};

const MCQCard = ({ q, index, isPreview, selectedAnswer, onTogglePreview, onSelectAnswer, onEdit, onDelete }) => {
  const getOptionStyle = (i) => {
    if (!isPreview || selectedAnswer === null) return "border-gray-700 bg-gray-800/50";
    if (i === q.correctIndex) return "border-green-500/50 bg-green-500/10";
    if (i === selectedAnswer && i !== q.correctIndex) return "border-red-500/50 bg-red-500/10";
    return "border-gray-700 bg-gray-800/50 opacity-50";
  };
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-2xl p-5 hover:border-gray-600 transition-all">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-start gap-3">
          <span className="text-xs font-black text-gray-600 mt-1 min-w-[20px]">Q{index + 1}</span>
          <p className="text-sm font-bold text-white leading-relaxed">{q.question}</p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button onClick={onTogglePreview} className="text-xs bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/30 px-3 py-1.5 rounded-lg font-bold transition-all">{isPreview ? "Close" : "Preview"}</button>
          <button onClick={onEdit} className="text-xs bg-gray-700 hover:bg-gray-600 px-3 py-1.5 rounded-lg font-bold transition-all">Edit</button>
          <button onClick={onDelete} className="text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1.5 rounded-lg font-bold transition-all">Remove</button>
        </div>
      </div>
      <div className="space-y-2 ml-8">
        {q.options.map((opt, i) => (
          <button key={i} onClick={() => isPreview && onSelectAnswer(i)} className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${getOptionStyle(i)} ${isPreview ? "cursor-pointer hover:opacity-90" : "cursor-default"}`}>
            <span className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center text-[10px] font-black ${!isPreview && i === q.correctIndex ? "border-green-500 bg-green-500/20 text-green-400" : "border-gray-600 text-gray-500"}`}>{String.fromCharCode(65 + i)}</span>
            <span className="text-sm flex-1">{opt}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
export default MCQPanel;