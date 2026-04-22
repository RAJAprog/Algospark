// // // // import React, { useState, useEffect, useCallback } from "react";
// // // // import {
// // // //   collection, getDocs, doc, addDoc, updateDoc, deleteDoc,
// // // //   query, orderBy, serverTimestamp
// // // // } from "firebase/firestore";
// // // // import { db } from "../../../firebase/config";

// // // // const DIFFICULTIES = ["Easy", "Medium", "Hard"];

// // // // const diffColor = {
// // // //   Easy:   "bg-green-500/10 text-green-400 border-green-500/30",
// // // //   Medium: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
// // // //   Hard:   "bg-red-500/10 text-red-400 border-red-500/30",
// // // // };

// // // // const EMPTY_FORM = {
// // // //   title: "", difficulty: "Easy", tags: "", description: "", constraints: ""
// // // // };

// // // // const CodingQuestionsPanel = ({ language, topic, currentUser, onBack }) => {
// // // //   const [questions, setQuestions] = useState([]);
// // // //   const [isLoading, setIsLoading] = useState(true);
// // // //   const [showForm, setShowForm]   = useState(false);
// // // //   const [editItem, setEditItem]   = useState(null);
// // // //   const [form, setForm]           = useState(EMPTY_FORM);
// // // //   const [search, setSearch]       = useState("");
// // // //   const [diffFilter, setDiffFilter] = useState("All");

// // // //   const collPath = `categories/${language.id}/topics/${topic.id}/codingQuestions`;

// // // //   const fetchQs = useCallback(async () => {
// // // //     setIsLoading(true);
// // // //     try {
// // // //       const snap = await getDocs(query(collection(db, collPath), orderBy("createdAt", "asc")));
// // // //       setQuestions(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
// // // //     } catch (e) { console.error(e); }
// // // //     setIsLoading(false);
// // // //   }, [collPath]);

// // // //   useEffect(() => { fetchQs(); }, [fetchQs]);

// // // //   const openAdd = () => { setForm(EMPTY_FORM); setEditItem(null); setShowForm(true); };
// // // //   const openEdit = (q) => { setForm({ title: q.title, difficulty: q.difficulty, tags: q.tags || "", description: q.description || "", constraints: q.constraints || "" }); setEditItem(q); setShowForm(true); };

// // // //   const handleSave = async () => {
// // // //     if (!form.title.trim()) { alert("Title required"); return; }
// // // //     try {
// // // //       if (editItem) {
// // // //         await updateDoc(doc(db, collPath, editItem.id), { ...form, updatedAt: serverTimestamp() });
// // // //       } else {
// // // //         await addDoc(collection(db, collPath), { ...form, createdBy: currentUser?.uid, createdAt: serverTimestamp() });
// // // //       }
// // // //       setShowForm(false);
// // // //       fetchQs();
// // // //     } catch (e) { alert("Save failed: " + e.message); }
// // // //   };

// // // //   const handleDelete = async (id) => {
// // // //     if (!window.confirm("Delete this question?")) return;
// // // //     try { await deleteDoc(doc(db, collPath, id)); fetchQs(); }
// // // //     catch (e) { alert("Delete failed"); }
// // // //   };

// // // //   const visible = questions.filter((q) => {
// // // //     const matchSearch = q.title.toLowerCase().includes(search.toLowerCase()) ||
// // // //                         (q.tags || "").toLowerCase().includes(search.toLowerCase());
// // // //     const matchDiff   = diffFilter === "All" || q.difficulty === diffFilter;
// // // //     return matchSearch && matchDiff;
// // // //   });

// // // //   return (
// // // //     <div className="space-y-5 animate-in fade-in duration-300">
// // // //       {/* Header */}
// // // //       <div className="flex items-center gap-3">
// // // //         <button onClick={onBack} className="text-xs font-bold text-pink-400 border border-pink-500/40 px-3 py-1.5 rounded-lg bg-pink-500/10 hover:bg-pink-500/20 transition-all">
// // // //           ← Back
// // // //         </button>
// // // //         <div>
// // // //           <h2 className="text-xl font-black">💻 Coding Questions</h2>
// // // //           <p className="text-xs text-gray-500">{language?.name} → {topic?.name}</p>
// // // //         </div>
// // // //         <button onClick={openAdd} className="ml-auto bg-green-600 hover:bg-green-500 px-5 py-2 rounded-xl text-xs font-black transition-all active:scale-95">
// // // //           + Add Question
// // // //         </button>
// // // //       </div>

// // // //       {/* Filters */}
// // // //       <div className="flex gap-3">
// // // //         <input
// // // //           value={search}
// // // //           onChange={(e) => setSearch(e.target.value)}
// // // //           placeholder="Search questions or tags..."
// // // //           className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500"
// // // //         />
// // // //         <div className="flex bg-gray-800 p-1 rounded-xl border border-gray-700">
// // // //           {["All", ...DIFFICULTIES].map((d) => (
// // // //             <button
// // // //               key={d}
// // // //               onClick={() => setDiffFilter(d)}
// // // //               className={`px-3 py-1.5 text-[10px] font-black rounded-lg transition-all ${diffFilter === d ? "bg-blue-600 text-white" : "text-gray-500 hover:text-white"}`}
// // // //             >
// // // //               {d}
// // // //             </button>
// // // //           ))}
// // // //         </div>
// // // //       </div>

// // // //       {/* Add/Edit Form */}
// // // //       {showForm && (
// // // //         <div className="bg-gray-800 border border-blue-500/40 rounded-2xl p-5 space-y-4">
// // // //           <div className="text-sm font-black text-blue-400 uppercase tracking-widest">
// // // //             {editItem ? "Edit Question" : "New Coding Question"}
// // // //           </div>
// // // //           <div className="grid grid-cols-2 gap-4">
// // // //             <div className="col-span-2">
// // // //               <label className="text-[10px] text-gray-500 uppercase font-bold mb-1 block">Title *</label>
// // // //               <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
// // // //                 placeholder="e.g. Two Sum"
// // // //                 className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500"
// // // //               />
// // // //             </div>
// // // //             <div>
// // // //               <label className="text-[10px] text-gray-500 uppercase font-bold mb-1 block">Difficulty</label>
// // // //               <div className="flex gap-2">
// // // //                 {DIFFICULTIES.map((d) => (
// // // //                   <button key={d} onClick={() => setForm({ ...form, difficulty: d })}
// // // //                     className={`flex-1 py-2 rounded-xl text-xs font-black border transition-all ${form.difficulty === d ? diffColor[d] + " border" : "bg-gray-900 border-gray-700 text-gray-500"}`}>
// // // //                     {d}
// // // //                   </button>
// // // //                 ))}
// // // //               </div>
// // // //             </div>
// // // //             <div>
// // // //               <label className="text-[10px] text-gray-500 uppercase font-bold mb-1 block">Tags</label>
// // // //               <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })}
// // // //                 placeholder="arrays, loops, dp"
// // // //                 className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500"
// // // //               />
// // // //             </div>
// // // //             <div className="col-span-2">
// // // //               <label className="text-[10px] text-gray-500 uppercase font-bold mb-1 block">Description</label>
// // // //               <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
// // // //                 rows={3} placeholder="Problem statement..."
// // // //                 className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 resize-none"
// // // //               />
// // // //             </div>
// // // //             <div className="col-span-2">
// // // //               <label className="text-[10px] text-gray-500 uppercase font-bold mb-1 block">Constraints</label>
// // // //               <input value={form.constraints} onChange={(e) => setForm({ ...form, constraints: e.target.value })}
// // // //                 placeholder="1 ≤ n ≤ 10^5"
// // // //                 className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500"
// // // //               />
// // // //             </div>
// // // //           </div>
// // // //           <div className="flex gap-3 justify-end">
// // // //             <button onClick={() => setShowForm(false)} className="px-5 py-2 rounded-xl text-xs font-black bg-gray-700 hover:bg-gray-600 transition-all">Cancel</button>
// // // //             <button onClick={handleSave} className="px-6 py-2 rounded-xl text-xs font-black bg-blue-600 hover:bg-blue-500 transition-all active:scale-95">
// // // //               {editItem ? "Save Changes" : "Add Question"}
// // // //             </button>
// // // //           </div>
// // // //         </div>
// // // //       )}

// // // //       {/* Question List */}
// // // //       {isLoading ? (
// // // //         <div className="flex justify-center py-10">
// // // //           <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
// // // //         </div>
// // // //       ) : visible.length === 0 ? (
// // // //         <div className="text-center text-gray-500 py-10 text-sm">
// // // //           {search || diffFilter !== "All" ? "No questions match your filter." : "No questions yet — add one above."}
// // // //         </div>
// // // //       ) : (
// // // //         <div className="space-y-3">
// // // //           {visible.map((q, i) => (
// // // //             <div key={q.id} className="bg-gray-800 border border-gray-700 rounded-2xl p-4 flex items-start justify-between gap-4 hover:border-gray-600 transition-all">
// // // //               <div className="flex items-start gap-3">
// // // //                 <span className="text-xs font-black text-gray-600 mt-1 min-w-[20px]">#{i + 1}</span>
// // // //                 <div>
// // // //                   <div className="text-sm font-bold text-white">{q.title}</div>
// // // //                   {q.description && (
// // // //                     <div className="text-xs text-gray-500 mt-1 line-clamp-1">{q.description}</div>
// // // //                   )}
// // // //                   <div className="flex gap-2 mt-2 flex-wrap">
// // // //                     <span className={`text-[10px] font-black px-2 py-0.5 rounded border ${diffColor[q.difficulty]}`}>
// // // //                       {q.difficulty}
// // // //                     </span>
// // // //                     {q.tags && q.tags.split(",").map((tag) => (
// // // //                       <span key={tag} className="text-[10px] bg-gray-700 text-gray-400 px-2 py-0.5 rounded">
// // // //                         {tag.trim()}
// // // //                       </span>
// // // //                     ))}
// // // //                   </div>
// // // //                 </div>
// // // //               </div>
// // // //               <div className="flex gap-2 flex-shrink-0">
// // // //                 <button onClick={() => openEdit(q)} className="text-xs bg-gray-700 hover:bg-gray-600 px-3 py-1.5 rounded-lg font-bold transition-all">Edit</button>
// // // //                 <button onClick={() => handleDelete(q.id)} className="text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1.5 rounded-lg font-bold transition-all">Del</button>
// // // //               </div>
// // // //             </div>
// // // //           ))}
// // // //         </div>
// // // //       )}
// // // //     </div>
// // // //   );
// // // // };

// // // // export default CodingQuestionsPanel;
// // // ////



// // // import React, { useState, useEffect, useCallback } from "react";
// // // import { collection, getDocs, doc, addDoc, updateDoc, deleteDoc, query, orderBy, serverTimestamp } from "firebase/firestore";

// // // // FIXED FIREBASE IMPORT PATH
// // // import { db } from "../../firebase/config";

// // // const DIFFICULTIES = ["Easy", "Medium", "Hard"];
// // // const diffColor = { Easy: "bg-green-500/10 text-green-400 border-green-500/30", Medium: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30", Hard: "bg-red-500/10 text-red-400 border-red-500/30" };
// // // const EMPTY_FORM = { title: "", difficulty: "Easy", tags: "", description: "", constraints: "" };

// // // const CodingQuestionsPanel = ({ language, topic, currentUser, onBack }) => {
// // //   const [questions, setQuestions] = useState([]);
// // //   const [isLoading, setIsLoading] = useState(true);
// // //   const [showForm, setShowForm]   = useState(false);
// // //   const [editItem, setEditItem]   = useState(null);
// // //   const [form, setForm]           = useState(EMPTY_FORM);
// // //   const [search, setSearch]       = useState("");
// // //   const [diffFilter, setDiffFilter] = useState("All");

// // //   const collPath = `categories/${language.id}/topics/${topic.id}/codingQuestions`;

// // //   const fetchQs = useCallback(async () => {
// // //     setIsLoading(true);
// // //     try {
// // //       const snap = await getDocs(query(collection(db, collPath), orderBy("createdAt", "asc")));
// // //       setQuestions(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
// // //     } catch (e) { console.error(e); }
// // //     setIsLoading(false);
// // //   }, [collPath]);

// // //   useEffect(() => { fetchQs(); }, [fetchQs]);

// // //   const openAdd = () => { setForm(EMPTY_FORM); setEditItem(null); setShowForm(true); };
// // //   const openEdit = (q) => { setForm({ title: q.title, difficulty: q.difficulty, tags: q.tags || "", description: q.description || "", constraints: q.constraints || "" }); setEditItem(q); setShowForm(true); };

// // //   const handleSave = async () => {
// // //     if (!form.title.trim()) { alert("Title required"); return; }
// // //     try {
// // //       if (editItem) { await updateDoc(doc(db, collPath, editItem.id), { ...form, updatedAt: serverTimestamp() }); } 
// // //       else { await addDoc(collection(db, collPath), { ...form, createdBy: currentUser?.uid, createdAt: serverTimestamp() }); }
// // //       setShowForm(false); fetchQs();
// // //     } catch (e) { alert("Save failed: " + e.message); }
// // //   };

// // //   const handleDelete = async (id) => {
// // //     if (!window.confirm("Delete this question?")) return;
// // //     try { await deleteDoc(doc(db, collPath, id)); fetchQs(); } catch (e) { alert("Delete failed"); }
// // //   };

// // //   const visible = questions.filter((q) => {
// // //     const matchSearch = q.title.toLowerCase().includes(search.toLowerCase()) || (q.tags || "").toLowerCase().includes(search.toLowerCase());
// // //     const matchDiff   = diffFilter === "All" || q.difficulty === diffFilter;
// // //     return matchSearch && matchDiff;
// // //   });

// // //   return (
// // //     <div className="space-y-5 animate-in fade-in duration-300">
// // //       <div className="flex items-center gap-3">
// // //         <button onClick={onBack} className="text-xs font-bold text-pink-400 border border-pink-500/40 px-3 py-1.5 rounded-lg bg-pink-500/10 hover:bg-pink-500/20 transition-all">← Back</button>
// // //         <div>
// // //           <h2 className="text-xl font-black">💻 Coding Questions</h2>
// // //           <p className="text-xs text-gray-500">{language?.name} → {topic?.name}</p>
// // //         </div>
// // //         <button onClick={openAdd} className="ml-auto bg-green-600 hover:bg-green-500 px-5 py-2 rounded-xl text-xs font-black transition-all active:scale-95">+ Add Question</button>
// // //       </div>

// // //       <div className="flex gap-3">
// // //         <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search questions or tags..." className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500" />
// // //         <div className="flex bg-gray-800 p-1 rounded-xl border border-gray-700">
// // //           {["All", ...DIFFICULTIES].map((d) => (
// // //             <button key={d} onClick={() => setDiffFilter(d)} className={`px-3 py-1.5 text-[10px] font-black rounded-lg transition-all ${diffFilter === d ? "bg-blue-600 text-white" : "text-gray-500 hover:text-white"}`}>{d}</button>
// // //           ))}
// // //         </div>
// // //       </div>

// // //       {showForm && (
// // //         <div className="bg-gray-800 border border-blue-500/40 rounded-2xl p-5 space-y-4">
// // //           <div className="text-sm font-black text-blue-400 uppercase tracking-widest">{editItem ? "Edit Question" : "New Coding Question"}</div>
// // //           <div className="grid grid-cols-2 gap-4">
// // //             <div className="col-span-2"><label className="text-[10px] text-gray-500 uppercase font-bold mb-1 block">Title *</label><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Two Sum" className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500" /></div>
// // //             <div>
// // //               <label className="text-[10px] text-gray-500 uppercase font-bold mb-1 block">Difficulty</label>
// // //               <div className="flex gap-2">
// // //                 {DIFFICULTIES.map((d) => <button key={d} onClick={() => setForm({ ...form, difficulty: d })} className={`flex-1 py-2 rounded-xl text-xs font-black border transition-all ${form.difficulty === d ? diffColor[d] + " border" : "bg-gray-900 border-gray-700 text-gray-500"}`}>{d}</button>)}
// // //               </div>
// // //             </div>
// // //             <div><label className="text-[10px] text-gray-500 uppercase font-bold mb-1 block">Tags</label><input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="arrays, loops, dp" className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500" /></div>
// // //             <div className="col-span-2"><label className="text-[10px] text-gray-500 uppercase font-bold mb-1 block">Description</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} placeholder="Problem statement..." className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 resize-none" /></div>
// // //             <div className="col-span-2"><label className="text-[10px] text-gray-500 uppercase font-bold mb-1 block">Constraints</label><input value={form.constraints} onChange={(e) => setForm({ ...form, constraints: e.target.value })} placeholder="1 ≤ n ≤ 10^5" className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500" /></div>
// // //           </div>
// // //           <div className="flex gap-3 justify-end"><button onClick={() => setShowForm(false)} className="px-5 py-2 rounded-xl text-xs font-black bg-gray-700 hover:bg-gray-600 transition-all">Cancel</button><button onClick={handleSave} className="px-6 py-2 rounded-xl text-xs font-black bg-blue-600 hover:bg-blue-500 transition-all active:scale-95">{editItem ? "Save Changes" : "Add Question"}</button></div>
// // //         </div>
// // //       )}

// // //       {isLoading ? <div className="flex justify-center py-10"><div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" /></div> : visible.length === 0 ? <div className="text-center text-gray-500 py-10 text-sm">{search || diffFilter !== "All" ? "No questions match your filter." : "No questions yet — add one above."}</div> : (
// // //         <div className="space-y-3">
// // //           {visible.map((q, i) => (
// // //             <div key={q.id} className="bg-gray-800 border border-gray-700 rounded-2xl p-4 flex items-start justify-between gap-4 hover:border-gray-600 transition-all">
// // //               <div className="flex items-start gap-3">
// // //                 <span className="text-xs font-black text-gray-600 mt-1 min-w-[20px]">#{i + 1}</span>
// // //                 <div>
// // //                   <div className="text-sm font-bold text-white">{q.title}</div>
// // //                   {q.description && <div className="text-xs text-gray-500 mt-1 line-clamp-1">{q.description}</div>}
// // //                   <div className="flex gap-2 mt-2 flex-wrap">
// // //                     <span className={`text-[10px] font-black px-2 py-0.5 rounded border ${diffColor[q.difficulty]}`}>{q.difficulty}</span>
// // //                     {q.tags && q.tags.split(",").map((tag) => <span key={tag} className="text-[10px] bg-gray-700 text-gray-400 px-2 py-0.5 rounded">{tag.trim()}</span>)}
// // //                   </div>
// // //                 </div>
// // //               </div>
// // //               <div className="flex gap-2 flex-shrink-0">
// // //                 <button onClick={() => openEdit(q)} className="text-xs bg-gray-700 hover:bg-gray-600 px-3 py-1.5 rounded-lg font-bold transition-all">Edit</button>
// // //                 <button onClick={() => handleDelete(q.id)} className="text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1.5 rounded-lg font-bold transition-all">Del</button>
// // //               </div>
// // //             </div>
// // //           ))}
// // //         </div>
// // //       )}
// // //     </div>
// // //   );
// // // };
// // // export default CodingQuestionsPanel;


// // ////


// // import React, { useState, useEffect, useCallback } from "react";
// // import { collection, getDocs, doc, addDoc, updateDoc, deleteDoc, query, orderBy, serverTimestamp } from "firebase/firestore";

// // // FIXED FIREBASE IMPORT PATH
// // import { db, storage } from "../../../firebase/config";

// // const DIFFICULTIES = ["Easy", "Medium", "Hard"];
// // const diffColor = { Easy: "bg-green-500/10 text-green-400 border-green-500/30", Medium: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30", Hard: "bg-red-500/10 text-red-400 border-red-500/30" };
// // const EMPTY_FORM = { title: "", difficulty: "Easy", tags: "", description: "", constraints: "" };

// // const CodingQuestionsPanel = ({ language, topic, currentUser, onBack }) => {
// //   const [questions, setQuestions] = useState([]);
// //   const [isLoading, setIsLoading] = useState(true);
// //   const [showForm, setShowForm]   = useState(false);
// //   const [editItem, setEditItem]   = useState(null);
// //   const [form, setForm]           = useState(EMPTY_FORM);
// //   const [search, setSearch]       = useState("");
// //   const [diffFilter, setDiffFilter] = useState("All");

// //   const collPath = `categories/${language.id}/topics/${topic.id}/codingQuestions`;

// //   const fetchQs = useCallback(async () => {
// //     setIsLoading(true);
// //     try {
// //       const snap = await getDocs(query(collection(db, collPath), orderBy("createdAt", "asc")));
// //       setQuestions(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
// //     } catch (e) { console.error(e); }
// //     setIsLoading(false);
// //   }, [collPath]);

// //   useEffect(() => { fetchQs(); }, [fetchQs]);

// //   const openAdd = () => { setForm(EMPTY_FORM); setEditItem(null); setShowForm(true); };
// //   const openEdit = (q) => { setForm({ title: q.title, difficulty: q.difficulty, tags: q.tags || "", description: q.description || "", constraints: q.constraints || "" }); setEditItem(q); setShowForm(true); };

// //   const handleSave = async () => {
// //     if (!form.title.trim()) { alert("Title required"); return; }
// //     try {
// //       if (editItem) { await updateDoc(doc(db, collPath, editItem.id), { ...form, updatedAt: serverTimestamp() }); } 
// //       else { await addDoc(collection(db, collPath), { ...form, createdBy: currentUser?.uid, createdAt: serverTimestamp() }); }
// //       setShowForm(false); fetchQs();
// //     } catch (e) { alert("Save failed: " + e.message); }
// //   };

// //   const handleDelete = async (id) => {
// //     if (!window.confirm("Delete this question?")) return;
// //     try { await deleteDoc(doc(db, collPath, id)); fetchQs(); } catch (e) { alert("Delete failed"); }
// //   };

// //   const visible = questions.filter((q) => {
// //     const matchSearch = q.title.toLowerCase().includes(search.toLowerCase()) || (q.tags || "").toLowerCase().includes(search.toLowerCase());
// //     const matchDiff   = diffFilter === "All" || q.difficulty === diffFilter;
// //     return matchSearch && matchDiff;
// //   });

// //   return (
// //     <div className="space-y-5 animate-in fade-in duration-300">
// //       <div className="flex items-center gap-3">
// //         <button onClick={onBack} className="text-xs font-bold text-pink-400 border border-pink-500/40 px-3 py-1.5 rounded-lg bg-pink-500/10 hover:bg-pink-500/20 transition-all">← Back</button>
// //         <div>
// //           <h2 className="text-xl font-black">💻 Coding Questions</h2>
// //           <p className="text-xs text-gray-500">{language?.name} → {topic?.name}</p>
// //         </div>
// //         <button onClick={openAdd} className="ml-auto bg-green-600 hover:bg-green-500 px-5 py-2 rounded-xl text-xs font-black transition-all active:scale-95">+ Add Question</button>
// //       </div>

// //       <div className="flex gap-3">
// //         <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search questions or tags..." className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500" />
// //         <div className="flex bg-gray-800 p-1 rounded-xl border border-gray-700">
// //           {["All", ...DIFFICULTIES].map((d) => (
// //             <button key={d} onClick={() => setDiffFilter(d)} className={`px-3 py-1.5 text-[10px] font-black rounded-lg transition-all ${diffFilter === d ? "bg-blue-600 text-white" : "text-gray-500 hover:text-white"}`}>{d}</button>
// //           ))}
// //         </div>
// //       </div>

// //       {showForm && (
// //         <div className="bg-gray-800 border border-blue-500/40 rounded-2xl p-5 space-y-4">
// //           <div className="text-sm font-black text-blue-400 uppercase tracking-widest">{editItem ? "Edit Question" : "New Coding Question"}</div>
// //           <div className="grid grid-cols-2 gap-4">
// //             <div className="col-span-2"><label className="text-[10px] text-gray-500 uppercase font-bold mb-1 block">Title *</label><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Two Sum" className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500" /></div>
// //             <div>
// //               <label className="text-[10px] text-gray-500 uppercase font-bold mb-1 block">Difficulty</label>
// //               <div className="flex gap-2">
// //                 {DIFFICULTIES.map((d) => <button key={d} onClick={() => setForm({ ...form, difficulty: d })} className={`flex-1 py-2 rounded-xl text-xs font-black border transition-all ${form.difficulty === d ? diffColor[d] + " border" : "bg-gray-900 border-gray-700 text-gray-500"}`}>{d}</button>)}
// //               </div>
// //             </div>
// //             <div><label className="text-[10px] text-gray-500 uppercase font-bold mb-1 block">Tags</label><input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="arrays, loops, dp" className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500" /></div>
// //             <div className="col-span-2"><label className="text-[10px] text-gray-500 uppercase font-bold mb-1 block">Description</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} placeholder="Problem statement..." className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 resize-none" /></div>
// //             <div className="col-span-2"><label className="text-[10px] text-gray-500 uppercase font-bold mb-1 block">Constraints</label><input value={form.constraints} onChange={(e) => setForm({ ...form, constraints: e.target.value })} placeholder="1 ≤ n ≤ 10^5" className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500" /></div>
// //           </div>
// //           <div className="flex gap-3 justify-end"><button onClick={() => setShowForm(false)} className="px-5 py-2 rounded-xl text-xs font-black bg-gray-700 hover:bg-gray-600 transition-all">Cancel</button><button onClick={handleSave} className="px-6 py-2 rounded-xl text-xs font-black bg-blue-600 hover:bg-blue-500 transition-all active:scale-95">{editItem ? "Save Changes" : "Add Question"}</button></div>
// //         </div>
// //       )}

// //       {isLoading ? <div className="flex justify-center py-10"><div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" /></div> : visible.length === 0 ? <div className="text-center text-gray-500 py-10 text-sm">{search || diffFilter !== "All" ? "No questions match your filter." : "No questions yet — add one above."}</div> : (
// //         <div className="space-y-3">
// //           {visible.map((q, i) => (
// //             <div key={q.id} className="bg-gray-800 border border-gray-700 rounded-2xl p-4 flex items-start justify-between gap-4 hover:border-gray-600 transition-all">
// //               <div className="flex items-start gap-3">
// //                 <span className="text-xs font-black text-gray-600 mt-1 min-w-[20px]">#{i + 1}</span>
// //                 <div>
// //                   <div className="text-sm font-bold text-white">{q.title}</div>
// //                   {q.description && <div className="text-xs text-gray-500 mt-1 line-clamp-1">{q.description}</div>}
// //                   <div className="flex gap-2 mt-2 flex-wrap">
// //                     <span className={`text-[10px] font-black px-2 py-0.5 rounded border ${diffColor[q.difficulty]}`}>{q.difficulty}</span>
// //                     {q.tags && q.tags.split(",").map((tag) => <span key={tag} className="text-[10px] bg-gray-700 text-gray-400 px-2 py-0.5 rounded">{tag.trim()}</span>)}
// //                   </div>
// //                 </div>
// //               </div>
// //               <div className="flex gap-2 flex-shrink-0">
// //                 <button onClick={() => openEdit(q)} className="text-xs bg-gray-700 hover:bg-gray-600 px-3 py-1.5 rounded-lg font-bold transition-all">Edit</button>
// //                 <button onClick={() => handleDelete(q.id)} className="text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1.5 rounded-lg font-bold transition-all">Del</button>
// //               </div>
// //             </div>
// //           ))}
// //         </div>
// //       )}
// //     </div>
// //   );
// // };
// // export default CodingQuestionsPanel;


// ////

import React, { useState, useEffect, useCallback } from "react";
import {
  collection, getDocs, doc, addDoc, updateDoc, deleteDoc,
  query, orderBy, serverTimestamp
} from "firebase/firestore";
import { db } from "../../../firebase/config";

const DIFFICULTIES = ["Easy", "Medium", "Hard"];

const diffColor = {
  Easy:   "bg-green-500/10 text-green-400 border-green-500/30",
  Medium: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
  Hard:   "bg-red-500/10 text-red-400 border-red-500/30",
};

const EMPTY_FORM = {
  title: "", difficulty: "Easy", tags: "", description: "", constraints: ""
};

const CodingQuestionsPanel = ({ language, topic, currentUser, onBack }) => {
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm]   = useState(false);
  const [editItem, setEditItem]   = useState(null);
  const [form, setForm]           = useState(EMPTY_FORM);
  const [search, setSearch]       = useState("");
  const [diffFilter, setDiffFilter] = useState("All");
  
  // Toggle between "manage" (list view) and "practice" (IDE view)
  const [viewMode, setViewMode]   = useState("manage"); 
  const [activePracticeQ, setActivePracticeQ] = useState(null);

  const collPath = `categories/${language.id}/topics/${topic.id}/codingQuestions`;

  const fetchQs = useCallback(async () => {
    setIsLoading(true);
    try {
      const snap = await getDocs(query(collection(db, collPath), orderBy("createdAt", "asc")));
      setQuestions(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (e) { console.error(e); }
    setIsLoading(false);
  }, [collPath]);

  useEffect(() => { fetchQs(); }, [fetchQs]);

  const openAdd = () => { setForm(EMPTY_FORM); setEditItem(null); setShowForm(true); };
  
  const openEdit = (q) => { 
      setForm({ 
          title: q.title, 
          difficulty: q.difficulty, 
          tags: q.tags || "", 
          description: q.description || "", 
          constraints: q.constraints || "" 
      }); 
      setEditItem(q); 
      setShowForm(true); 
  };

  const handleSave = async () => {
    if (!form.title.trim()) { alert("Title required"); return; }
    try {
      if (editItem) {
        await updateDoc(doc(db, collPath, editItem.id), { ...form, updatedAt: serverTimestamp() });
      } else {
        await addDoc(collection(db, collPath), { ...form, createdBy: currentUser?.uid, createdAt: serverTimestamp() });
      }
      setShowForm(false);
      fetchQs();
    } catch (e) { alert("Save failed: " + e.message); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this question completely?")) return;
    try { 
        await deleteDoc(doc(db, collPath, id)); 
        if(activePracticeQ?.id === id) setActivePracticeQ(null);
        fetchQs(); 
    }
    catch (e) { alert("Delete failed"); }
  };

  const visible = questions.filter((q) => {
    const matchSearch = q.title.toLowerCase().includes(search.toLowerCase()) ||
                        (q.tags || "").toLowerCase().includes(search.toLowerCase());
    const matchDiff   = diffFilter === "All" || q.difficulty === diffFilter;
    return matchSearch && matchDiff;
  });

  // ─── PRACTICE MODE VIEW (IDE LAYOUT) ───────────────────────────────────────
  if (viewMode === "practice") {
    return (
      <div className="space-y-4 animate-in fade-in duration-300">
        <div className="flex items-center justify-between bg-gray-800 border border-gray-700 p-4 rounded-2xl">
            <div className="flex items-center gap-4">
                <button onClick={() => setViewMode("manage")} className="text-xs font-bold text-gray-400 border border-gray-600 px-4 py-2 rounded-lg hover:bg-gray-700 hover:text-white transition-all">
                    ← Back to Questions
                </button>
                <h2 className="text-lg font-black text-indigo-400">
                    <span className="text-gray-500 mr-2">Practicing:</span> 
                    {activePracticeQ?.title || "Select a Problem"}
                </h2>
            </div>
            <div className="flex gap-3">
                <span className="text-xs font-bold px-3 py-1.5 bg-gray-900 border border-gray-700 rounded-lg text-gray-400">
                    Language: {language?.name || "Auto"}
                </span>
            </div>
        </div>

        <div className="flex gap-4 h-[650px]">
            {/* Left Pane: Problem Description */}
            <div className="w-[40%] bg-gray-800 border border-gray-700 rounded-2xl p-6 overflow-y-auto flex flex-col gap-6 custom-scrollbar shadow-lg">
               {activePracticeQ ? (
                 <>
                   <div className="border-b border-gray-700 pb-4">
                     <h3 className="text-2xl font-black text-white">{activePracticeQ.title}</h3>
                     <div className="flex gap-2 mt-3">
                       <span className={`text-xs font-black px-3 py-1 rounded-md border ${diffColor[activePracticeQ.difficulty]}`}>
                           {activePracticeQ.difficulty}
                       </span>
                       {activePracticeQ.tags && activePracticeQ.tags.split(',').map(t => (
                           <span key={t} className="text-[10px] bg-gray-900 border border-gray-700 text-gray-400 px-3 py-1 rounded-md font-bold uppercase tracking-wider">
                               {t.trim()}
                           </span>
                       ))}
                     </div>
                   </div>
                   
                   <div>
                       <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-3">Problem Description</h4>
                       <div className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">
                           {activePracticeQ.description || "No description provided."}
                       </div>
                   </div>

                   {activePracticeQ.constraints && (
                     <div className="mt-auto bg-gray-900/50 rounded-xl p-4 border border-gray-700/50">
                       <h4 className="text-xs font-black text-yellow-500/70 uppercase tracking-widest mb-2 flex items-center gap-2">
                           <span>⚠️</span> Constraints
                       </h4>
                       <div className="text-xs font-mono text-gray-400 whitespace-pre-wrap">
                           {activePracticeQ.constraints}
                       </div>
                     </div>
                   )}
                 </>
               ) : (
                 <div className="text-gray-500 text-sm m-auto flex flex-col items-center gap-3">
                     <span className="text-4xl">🫥</span>
                     Select a problem from the previous menu.
                 </div>
               )}
            </div>

            {/* Right Pane: Code Editor & Terminal */}
            <div className="w-[60%] flex flex-col gap-4">
                
                {/* Editor Section */}
                <div className="bg-[#0d1117] border border-gray-700 rounded-2xl p-4 flex-1 flex flex-col relative shadow-lg">
                    <div className="flex justify-between items-center mb-3 border-b border-gray-800 pb-3">
                        <div className="flex gap-2">
                           <span className="bg-gray-800/80 text-blue-400 text-xs px-4 py-1.5 rounded-lg font-mono border border-gray-700 font-bold">
                               solution.code
                           </span>
                        </div>
                        <div className="flex gap-3">
                            <button className="px-4 py-1.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-xs font-bold transition-all text-gray-300">
                                ↺ Reset
                            </button>
                            <button className="px-6 py-1.5 bg-green-600 hover:bg-green-500 rounded-lg text-xs font-black text-white transition-all shadow-lg shadow-green-600/20 active:scale-95 flex items-center gap-2">
                                <span>▶</span> Run Code
                            </button>
                        </div>
                    </div>
                    
                    <textarea 
                        className="flex-1 w-full bg-transparent text-sm font-mono text-gray-300 outline-none resize-none p-2 custom-scrollbar" 
                        defaultValue={`// Write your solution for ${activePracticeQ?.title || "the problem"} here...\n\nfunction solve() {\n    // TODO: Implement logic\n    \n}\n`} 
                        spellCheck={false}
                    />
                </div>

                {/* Terminal / Output Console */}
                <div className="bg-black border border-gray-700 rounded-2xl h-56 p-5 flex flex-col relative shadow-lg">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gray-800 via-gray-600 to-gray-800"></div>
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Output Console
                        </h3>
                        <span className="text-[10px] font-mono text-gray-600">Terminal Ready</span>
                    </div>
                    <div className="flex-1 text-xs font-mono text-gray-400 overflow-y-auto bg-gray-900/30 rounded-lg p-3 border border-gray-800">
                        <div className="text-blue-400 mb-1">$ awaiting_execution...</div>
                        <div className="text-gray-500">System ready to compile and run test cases. Integration pending.</div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    );
  }

  // ─── MANAGE MODE VIEW (LIST LAYOUT) ──────────────────────────────────────
  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="text-xs font-bold text-pink-400 border border-pink-500/40 px-3 py-1.5 rounded-lg bg-pink-500/10 hover:bg-pink-500/20 transition-all">
          ← Back
        </button>
        <div>
          <h2 className="text-xl font-black">💻 Coding Questions</h2>
          <p className="text-xs text-gray-500">{language?.name} → {topic?.name}</p>
        </div>
        <button onClick={openAdd} className="ml-auto bg-green-600 hover:bg-green-500 px-5 py-2 rounded-xl text-xs font-black transition-all active:scale-95 shadow-lg shadow-green-600/20">
          + Add Question
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search questions or tags..."
          className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 shadow-inner"
        />
        <div className="flex bg-gray-800 p-1 rounded-xl border border-gray-700 shadow-inner">
          {["All", ...DIFFICULTIES].map((d) => (
            <button
              key={d}
              onClick={() => setDiffFilter(d)}
              className={`px-3 py-1.5 text-[10px] font-black rounded-lg transition-all ${diffFilter === d ? "bg-blue-600 text-white shadow-md" : "text-gray-500 hover:text-white"}`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-gray-800 border border-blue-500/40 rounded-2xl p-6 space-y-5 shadow-2xl">
          <div className="text-sm font-black text-blue-400 uppercase tracking-widest border-b border-gray-700 pb-3">
            {editItem ? "✏️ Edit Question" : "📝 New Coding Question"}
          </div>
          <div className="grid grid-cols-2 gap-5">
            <div className="col-span-2">
              <label className="text-[10px] text-gray-500 uppercase font-bold mb-1.5 block">Title *</label>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Two Sum"
                className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <div>
              <label className="text-[10px] text-gray-500 uppercase font-bold mb-1.5 block">Difficulty</label>
              <div className="flex gap-2">
                {DIFFICULTIES.map((d) => (
                  <button key={d} onClick={() => setForm({ ...form, difficulty: d })}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-black border transition-all ${form.difficulty === d ? diffColor[d] + " border shadow-md" : "bg-gray-900 border-gray-700 text-gray-500 hover:bg-gray-800"}`}>
                    {d}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-[10px] text-gray-500 uppercase font-bold mb-1.5 block">Tags (comma separated)</label>
              <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })}
                placeholder="arrays, loops, dp"
                className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <div className="col-span-2">
              <label className="text-[10px] text-gray-500 uppercase font-bold mb-1.5 block">Problem Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={4} placeholder="Clearly state the problem logic here..."
                className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 resize-none transition-colors"
              />
            </div>
            <div className="col-span-2">
              <label className="text-[10px] text-gray-500 uppercase font-bold mb-1.5 block">Constraints</label>
              <input value={form.constraints} onChange={(e) => setForm({ ...form, constraints: e.target.value })}
                placeholder="e.g. 1 ≤ n ≤ 10^5"
                className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 font-mono transition-colors"
              />
            </div>
          </div>
          <div className="flex gap-3 justify-end pt-3">
            <button onClick={() => setShowForm(false)} className="px-6 py-2.5 rounded-xl text-xs font-black bg-gray-700 hover:bg-gray-600 transition-all">Cancel</button>
            <button onClick={handleSave} className="px-8 py-2.5 rounded-xl text-xs font-black bg-blue-600 hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/30 active:scale-95">
              {editItem ? "Save Changes" : "Save Question"}
            </button>
          </div>
        </div>
      )}

      {/* Question List */}
      {isLoading ? (
        <div className="flex justify-center py-10">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : visible.length === 0 ? (
        <div className="text-center text-gray-500 py-16 text-sm border-2 border-dashed border-gray-700 rounded-2xl">
          {search || diffFilter !== "All" ? "No questions match your filter." : "No coding questions in this topic yet. Add one to start practicing!"}
        </div>
      ) : (
        <div className="space-y-4">
          {visible.map((q, i) => (
            <div key={q.id} className="bg-gray-800 border border-gray-700 rounded-2xl p-5 flex items-center justify-between gap-4 hover:border-gray-500 transition-all shadow-md group">
              <div className="flex items-start gap-4 flex-1">
                <span className="text-xs font-black text-gray-500 mt-1 min-w-[24px]">#{i + 1}</span>
                <div className="flex-1">
                  <div className="text-base font-bold text-white group-hover:text-blue-400 transition-colors">{q.title}</div>
                  {q.description && (
                    <div className="text-xs text-gray-400 mt-1.5 line-clamp-1">{q.description}</div>
                  )}
                  <div className="flex gap-2 mt-3 flex-wrap">
                    <span className={`text-[10px] font-black px-2.5 py-0.5 rounded border ${diffColor[q.difficulty]}`}>
                      {q.difficulty}
                    </span>
                    {q.tags && q.tags.split(",").map((tag) => (
                      <span key={tag} className="text-[10px] bg-gray-900 border border-gray-700 text-gray-400 px-2.5 py-0.5 rounded uppercase tracking-wider font-bold">
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 flex-shrink-0">
                {/* ── NEW: Solve / Practice Button ── */}
                <button 
                    onClick={() => { setActivePracticeQ(q); setViewMode("practice"); }} 
                    className="text-xs bg-indigo-600 hover:bg-indigo-500 px-5 py-2 rounded-xl font-black text-white transition-all shadow-lg shadow-indigo-600/30 active:scale-95 flex items-center gap-2 mr-2"
                >
                    <span>👨‍💻</span> Solve
                </button>
                
                <button onClick={() => openEdit(q)} className="text-xs bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-xl font-bold transition-all text-gray-300">Edit</button>
                <button onClick={() => handleDelete(q.id)} className="text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 px-4 py-2 rounded-xl font-bold transition-all">Del</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CodingQuestionsPanel;

