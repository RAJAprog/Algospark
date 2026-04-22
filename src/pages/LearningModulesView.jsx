
// // import React, { useState, useEffect, useRef } from 'react';
// // import {
// //   collection, getDocs, addDoc, updateDoc, deleteDoc,
// //   doc, serverTimestamp, query, orderBy
// // } from 'firebase/firestore';
// // import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
// // import { db, storage } from '../firebase/config';
// // import DeleteButton from '../components/ui/Deletebutton'; // Adjust path if needed
// // import QuestionForm from '../components/faculty/QuestionForm'; // ── NEW: IMPORT THE FULL QUESTION FORM ──

// // const CONTENT_TYPES = [
// //   { key: 'lesson', label: 'Intro Lesson',    icon: '📖', color: '#3b82f6', tag: 'Learning' },
// //   { key: 'mcq',    label: 'MCQ Practice',    icon: '📋', color: '#f59e0b', tag: 'Practice' },
// //   { key: 'coding', label: 'Coding Question', icon: '💻', color: '#10b981', tag: 'Coding'   },
// //   { key: 'ppt',    label: 'PPT Slides',      icon: '📊', color: '#8b5cf6', tag: 'Slides'   },
// // ];

// // const LANG_ICONS = {
// //   Python: '🐍', Java: '☕', JavaScript: '🟨',
// //   C: '⚙️', 'C++': '⚡', SQL: '🗄️', default: '📘'
// // };

// // const iStyle = {
// //   flex: 1, background: '#0f172a', border: '1px solid #334155',
// //   borderRadius: '0.6rem', padding: '0.55rem 0.875rem',
// //   color: '#f1f5f9', fontSize: '0.82rem', outline: 'none'
// // };
// // const bStyle = (color = '#3b82f6', extra = {}) => ({
// //   padding: '0.5rem 1.1rem', borderRadius: '0.6rem', background: color,
// //   color: '#fff', fontWeight: 800, fontSize: '0.75rem',
// //   border: 'none', cursor: 'pointer', whiteSpace: 'nowrap', ...extra
// // });
// // const cardS = (border = '#1e293b') => ({
// //   background: 'rgba(15,23,42,0.6)', border: `1px solid ${border}`,
// //   borderRadius: '0.875rem', overflow: 'hidden', transition: 'border-color 0.2s'
// // });
// // const pillS = (color) => ({
// //   fontSize: '0.6rem', fontWeight: 800, padding: '0.15rem 0.55rem',
// //   borderRadius: '999px', background: `${color}22`, color,
// //   letterSpacing: '0.06em', flexShrink: 0
// // });

// // /* ─────────────────────────────────────────────────────────────────────────────
// //    PPT UPLOADER
// // ───────────────────────────────────────────────────────────────────────────── */
// // function PPTUploader({ langId, topicIdx, onUploaded }) {
// //   const fileRef = useRef();
// //   const [uploading, setUploading] = useState(false);
// //   const [progress, setProgress]   = useState(0);
// //   const [pptTitle, setPptTitle]   = useState('');
// //   const [file, setFile]           = useState(null);
// //   const [err, setErr]             = useState('');

// //   const pick = (e) => {
// //     const f = e.target.files[0];
// //     if (!f) return;
// //     setErr(''); setFile(f);
// //     if (!pptTitle) setPptTitle(f.name.replace(/\.[^/.]+$/, ''));
// //   };

// //   const upload = () => {
// //     if (!file)         { setErr('Choose a file first.'); return; }
// //     if (!pptTitle.trim()) { setErr('Enter a title.'); return; }
// //     setUploading(true); setErr('');
// //     const sRef = ref(storage, `learning_ppts/${langId}/topic_${topicIdx}/${Date.now()}_${file.name}`);
// //     const task = uploadBytesResumable(sRef, file);
// //     task.on(
// //       'state_changed',
// //       s => setProgress(Math.round((s.bytesTransferred / s.totalBytes) * 100)),
// //       e => { setErr('Upload failed.'); setUploading(false); console.error(e); },
// //       () => getDownloadURL(task.snapshot.ref).then(url => {
// //         onUploaded({
// //           type: 'ppt', title: pptTitle.trim(), fileName: file.name,
// //           fileSize: (file.size / 1024 / 1024).toFixed(2) + ' MB',
// //           downloadUrl: url, storagePath: task.snapshot.ref.fullPath
// //         });
// //         setPptTitle(''); setFile(null); setProgress(0); setUploading(false);
// //         if (fileRef.current) fileRef.current.value = '';
// //       })
// //     );
// //   };

// //   return (
// //     <div style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: '0.75rem', padding: '0.875rem', marginTop: '0.5rem' }}>
// //       <p style={{ fontSize: '0.6rem', fontWeight: 900, color: '#a78bfa', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.6rem' }}>📊 Upload File (PPT / PDF / DOC / Video / Image)</p>
// //       <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.6rem', flexWrap: 'wrap' }}>
// //         <input ref={fileRef} type="file" accept="*/*" onChange={pick} style={{ display: 'none' }} id={`ppt-${langId}-${topicIdx}`} />
// //         <label htmlFor={`ppt-${langId}-${topicIdx}`} style={bStyle('rgba(139,92,246,0.2)', { border: '1px solid rgba(139,92,246,0.4)', color: '#a78bfa', cursor: 'pointer' })}>
// //           📎 Choose File
// //         </label>
// //         {file && <span style={{ fontSize: '0.75rem', color: '#94a3b8', alignSelf: 'center', fontFamily: 'monospace' }}>{file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</span>}
// //       </div>
// //       <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.6rem' }}>
// //         <input value={pptTitle} onChange={e => setPptTitle(e.target.value)} placeholder="File title" style={{ ...iStyle, fontSize: '0.78rem' }} />
// //         <button onClick={upload} disabled={uploading || !file} style={bStyle('#8b5cf6', { opacity: uploading || !file ? 0.5 : 1 })}>
// //           {uploading ? `${progress}%` : '⬆ Upload'}
// //         </button>
// //       </div>
// //       {uploading && (
// //         <div style={{ background: '#1e293b', borderRadius: '999px', height: '6px', overflow: 'hidden' }}>
// //           <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg,#8b5cf6,#6366f1)', transition: 'width 0.3s', borderRadius: '999px' }} />
// //         </div>
// //       )}
// //       {err && <p style={{ fontSize: '0.72rem', color: '#f87171', marginTop: '0.4rem' }}>{err}</p>}
// //     </div>
// //   );
// // }

// // /* ─────────────────────────────────────────────────────────────────────────────
// //    MAIN COMPONENT
// // ───────────────────────────────────────────────────────────────────────────── */
// // export default function LearningModules({ moduleData }) {
// //   const [languages, setLanguages]       = useState([]);
// //   const [expandedLang, setExpandedLang] = useState(null);
// //   const [expandedTopic, setExpandedTopic] = useState(null);

// //   // Which sub-panel is open per topic: null | 'coding' | 'mcq' | 'ppt' | 'lesson'
// //   const [activePanel, setActivePanel]   = useState({});

// //   const [loading, setLoading]           = useState(true);
// //   const [newLang, setNewLang]           = useState('');
// //   const [newTopics, setNewTopics]       = useState({});
// //   const [newSubtopics, setNewSubtopics] = useState({});
// //   const [creatingLang, setCreatingLang] = useState(false);

// //   /* ── fetch ── */
// //   const fetchAll = async () => {
// //     setLoading(true);
// //     try {
// //       const snap = await getDocs(query(collection(db, 'learningLanguages'), orderBy('createdAt')));
// //       setLanguages(snap.docs.map(d => ({ id: d.id, ...d.data() })));
// //     } catch (e) { console.error(e); }
// //     setLoading(false);
// //   };
// //   useEffect(() => { fetchAll(); }, []);

// //   /* ── delete language ── */
// //   const deleteLang = async (lang) => {
// //     await deleteDoc(doc(db, 'learningLanguages', lang.id));
// //     if (expandedLang === lang.id) setExpandedLang(null);
// //     await fetchAll();
// //   };

// //   /* ── delete topic ── */
// //   const deleteTopic = async (lang, topicIdx) => {
// //     const topics = lang.topics.filter((_, i) => i !== topicIdx);
// //     await updateDoc(doc(db, 'learningLanguages', lang.id), { topics });
// //     const key = `${lang.id}-${topicIdx}`;
// //     if (expandedTopic === key) setExpandedTopic(null);
// //     await fetchAll();
// //   };

// //   /* ── delete subtopic ── */
// //   const deleteSubtopic = async (lang, topicIdx, subIdx) => {
// //     const topics = lang.topics.map((t, i) =>
// //       i === topicIdx ? { ...t, subtopics: t.subtopics.filter((_, si) => si !== subIdx) } : t
// //     );
// //     await updateDoc(doc(db, 'learningLanguages', lang.id), { topics });
// //     await fetchAll();
// //   };

// //   /* ── delete content item ── */
// //   const deleteContent = async (lang, topicIdx, contentIdx) => {
// //     const item = lang.topics[topicIdx].content[contentIdx];
// //     if (item.type === 'ppt' && item.storagePath) {
// //       try { await deleteObject(ref(storage, item.storagePath)); } catch {}
// //     }
// //     const topics = lang.topics.map((t, i) =>
// //       i === topicIdx ? { ...t, content: t.content.filter((_, ci) => ci !== contentIdx) } : t
// //     );
// //     await updateDoc(doc(db, 'learningLanguages', lang.id), { topics });
// //     await fetchAll();
// //   };

// //   /* ── create language ── */
// //   const createLang = async () => {
// //     if (!newLang.trim()) return;
// //     setCreatingLang(true);
// //     try {
// //       await addDoc(collection(db, 'learningLanguages'), {
// //         name: newLang.trim(), topics: [], createdAt: serverTimestamp()
// //       });
// //       setNewLang(''); await fetchAll();
// //     } catch { alert('Failed to create language.'); }
// //     setCreatingLang(false);
// //   };

// //   /* ── add topic ── */
// //   const addTopic = async (lang) => {
// //     const name = (newTopics[lang.id] || '').trim();
// //     if (!name) return;
// //     const newTopic = { id: name.toLowerCase().replace(/\s+/g, '-'), name, subtopics: [], content: [] };
// //     await updateDoc(doc(db, 'learningLanguages', lang.id), { topics: [...(lang.topics || []), newTopic] });
// //     setNewTopics(p => ({ ...p, [lang.id]: '' }));
// //     await fetchAll();
// //   };

// //   /* ── add subtopic ── */
// //   const addSubtopic = async (lang, topicIdx) => {
// //     const key  = `${lang.id}-${topicIdx}`;
// //     const name = (newSubtopics[key] || '').trim();
// //     if (!name) return;
// //     const topics = lang.topics.map((t, i) =>
// //       i === topicIdx ? { ...t, subtopics: [...(t.subtopics || []), name] } : t
// //     );
// //     await updateDoc(doc(db, 'learningLanguages', lang.id), { topics });
// //     setNewSubtopics(p => ({ ...p, [key]: '' }));
// //     await fetchAll();
// //   };

// //   /* ── add content item (lesson / mcq / coding / ppt) ── */
// //   const addContentItem = async (lang, topicIdx, item) => {
// //     const topics = lang.topics.map((t, i) =>
// //       i === topicIdx
// //         ? { ...t, content: [...(t.content || []), { ...item, createdAt: new Date().toISOString() }] }
// //         : t
// //     );
// //     await updateDoc(doc(db, 'learningLanguages', lang.id), { topics });
// //     await fetchAll();
// //   };

// //   /* ── toggle sub-panel ── */
// //   const togglePanel = (topicKey, panelKey) => {
// //     setActivePanel(prev => ({
// //       ...prev,
// //       [topicKey]: prev[topicKey] === panelKey ? null : panelKey
// //     }));
// //   };

// //   const langIcon    = (name) => LANG_ICONS[name] || LANG_ICONS.default;
// //   const contentCfg  = (type) => CONTENT_TYPES.find(c => c.key === type) || CONTENT_TYPES[0];

// //   /* ────────────────────────────────────────────────────────────────────────── */
// //   return (
// //     <div>
// //       {/* ── Create language ── */}
// //       <div style={{ ...cardS('#1e3a5f'), padding: '1.25rem', marginBottom: '1.5rem' }}>
// //         <p style={{ fontSize: '0.6rem', fontWeight: 900, color: '#64748b', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
// //           + Create Language
// //         </p>
// //         <div style={{ display: 'flex', gap: '0.75rem' }}>
// //           <input value={newLang} onChange={e => setNewLang(e.target.value)}
// //             onKeyDown={e => e.key === 'Enter' && createLang()}
// //             placeholder="e.g., Python, Java, SQL" style={iStyle} />
// //           <button onClick={createLang} disabled={creatingLang} style={bStyle()}>
// //             {creatingLang ? '...' : 'Create'}
// //           </button>
// //         </div>
// //       </div>

// //       {/* ── Language list ── */}
// //       {loading ? (
// //         <div style={{ textAlign: 'center', padding: '3rem', color: '#475569' }}>Loading...</div>
// //       ) : languages.length === 0 ? (
// //         <div style={{ textAlign: 'center', padding: '4rem', color: '#334155' }}>
// //           <p style={{ fontSize: '2.5rem' }}>📘</p>
// //           <p style={{ fontWeight: 700, color: '#64748b', marginTop: '0.5rem' }}>No languages yet. Create one above.</p>
// //         </div>
// //       ) : (
// //         <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
// //           {languages.map(lang => {
// //             const isLangOpen = expandedLang === lang.id;

// //             return (
// //               <div key={lang.id} style={cardS(isLangOpen ? '#3b82f6' : '#1e293b')}>

// //                 {/* ── Language header ── */}
// //                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.25rem' }}>
// //                   <div onClick={() => setExpandedLang(isLangOpen ? null : lang.id)}
// //                     style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, cursor: 'pointer' }}>
// //                     <span style={{ fontSize: '1.5rem' }}>{langIcon(lang.name)}</span>
// //                     <div>
// //                       <p style={{ fontWeight: 900, fontSize: '1rem', color: '#f1f5f9', margin: 0 }}>{lang.name}</p>
// //                       <p style={{ fontSize: '0.65rem', color: '#64748b', margin: 0 }}>{lang.topics?.length || 0} topics</p>
// //                     </div>
// //                     {/* Topic pills */}
// //                     <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginLeft: '0.5rem' }}>
// //                       {lang.topics?.slice(0, 3).map((t, i) => (
// //                         <span key={i} style={{ fontSize: '0.62rem', padding: '0.15rem 0.55rem', borderRadius: '999px', background: 'rgba(59,130,246,0.12)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.25)', fontWeight: 700 }}>{t.name}</span>
// //                       ))}
// //                       {lang.topics?.length > 3 && <span style={{ fontSize: '0.62rem', color: '#475569' }}>+{lang.topics.length - 3}</span>}
// //                     </div>
// //                   </div>
// //                   <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
// //                     <span onClick={() => setExpandedLang(isLangOpen ? null : lang.id)}
// //                       style={{ color: '#475569', fontSize: '0.8rem', display: 'inline-block', transform: isLangOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s', cursor: 'pointer' }}>▼</span>
// //                     <DeleteButton itemName={`language "${lang.name}" and all its topics`} onConfirm={() => deleteLang(lang)} />
// //                   </div>
// //                 </div>

// //                 {/* ── Language body ── */}
// //                 {isLangOpen && (
// //                   <div style={{ borderTop: '1px solid #1e293b', padding: '1.25rem' }}>

// //                     {/* Topics */}
// //                     <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
// //                       {!lang.topics?.length ? (
// //                         <p style={{ color: '#475569', fontSize: '0.8rem' }}>No topics yet. Add one below.</p>
// //                       ) : lang.topics.map((topic, topicIdx) => {
// //                         const topicKey    = `${lang.id}-${topicIdx}`;
// //                         const isTopicOpen = expandedTopic === topicKey;
// //                         const pptCount    = topic.content?.filter(c => c.type === 'ppt').length || 0;
// //                         const mcqCount    = topic.content?.filter(c => c.type === 'mcq').length || 0;
// //                         const codingCount = topic.content?.filter(c => c.type === 'coding').length || 0;
// //                         const curPanel    = activePanel[topicKey] || null;

// //                         return (
// //                           <div key={topicIdx} style={{ background: 'rgba(30,41,59,0.6)', border: '1px solid #334155', borderRadius: '0.75rem', overflow: 'hidden' }}>

// //                             {/* Topic header */}
// //                             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem' }}>
// //                               <div onClick={() => setExpandedTopic(isTopicOpen ? null : topicKey)}
// //                                 style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flex: 1, cursor: 'pointer' }}>
// //                                 {/* completion dot */}
// //                                 <div style={{ width: '1.4rem', height: '1.4rem', borderRadius: '50%', background: topic.content?.length ? '#10b981' : '#1e293b', border: `2px solid ${topic.content?.length ? '#10b981' : '#334155'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
// //                                   {topic.content?.length ? <span style={{ fontSize: '0.55rem', color: '#fff' }}>✓</span> : null}
// //                                 </div>
// //                                 <div>
// //                                   <p style={{ fontWeight: 800, fontSize: '0.875rem', color: '#e2e8f0', margin: 0 }}>
// //                                     <span style={{ fontSize: '0.58rem', color: '#64748b', marginRight: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>TOPIC</span>
// //                                     {topic.name}
// //                                   </p>
// //                                   <p style={{ fontSize: '0.62rem', color: '#64748b', margin: 0 }}>
// //                                     {topic.subtopics?.length || 0} subtopics · {topic.content?.length || 0} items
// //                                     {codingCount > 0 && <span style={{ marginLeft: '0.35rem', color: '#10b981' }}>· 💻 {codingCount}</span>}
// //                                     {mcqCount > 0    && <span style={{ marginLeft: '0.35rem', color: '#f59e0b' }}>· 🧠 {mcqCount}</span>}
// //                                     {pptCount > 0    && <span style={{ marginLeft: '0.35rem', color: '#a78bfa' }}>· 📊 {pptCount}</span>}
// //                                   </p>
// //                                 </div>
// //                               </div>
// //                               <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}>
// //                                 <span onClick={() => setExpandedTopic(isTopicOpen ? null : topicKey)}
// //                                   style={{ color: '#475569', fontSize: '0.75rem', transform: isTopicOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s', cursor: 'pointer', display: 'inline-block' }}>▼</span>
// //                                 <DeleteButton itemName={`topic "${topic.name}"`} onConfirm={() => deleteTopic(lang, topicIdx)} />
// //                               </div>
// //                             </div>

// //                             {/* Topic body */}
// //                             {isTopicOpen && (
// //                               <div style={{ borderTop: '1px solid #1e293b', padding: '1rem' }}>

// //                                 {/* ── 3 BIG ACTION BUTTONS ── */}
// //                                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
// //                                   {[
// //                                     { key: 'coding', icon: '💻', label: 'Coding Questions', color: '#10b981', count: codingCount },
// //                                     { key: 'mcq',    icon: '🧠', label: 'MCQ Practice',     color: '#f59e0b', count: mcqCount    },
// //                                     { key: 'ppt',    icon: '📊', label: 'PPT / Files',      color: '#8b5cf6', count: pptCount    },
// //                                   ].map(btn => (
// //                                     <button key={btn.key}
// //                                       onClick={() => togglePanel(topicKey, btn.key)}
// //                                       style={{
// //                                         padding: '1rem 0.75rem', borderRadius: '0.75rem', cursor: 'pointer', textAlign: 'center',
// //                                         border: `1px solid ${curPanel === btn.key ? btn.color : '#334155'}`,
// //                                         background: curPanel === btn.key ? `${btn.color}18` : 'rgba(15,23,42,0.5)',
// //                                         transition: 'all 0.2s',
// //                                       }}>
// //                                       <div style={{ fontSize: '1.5rem', marginBottom: '0.3rem' }}>{btn.icon}</div>
// //                                       <div style={{ fontSize: '0.72rem', fontWeight: 800, color: curPanel === btn.key ? btn.color : '#94a3b8' }}>{btn.label}</div>
// //                                       <div style={{ fontSize: '0.6rem', color: '#475569', margin: '0.2rem 0' }}>{btn.count} items</div>
// //                                     </button>
// //                                   ))}
// //                                 </div>

// //                                 {/* ── CODING PANEL ── */}
// //                                 {curPanel === 'coding' && (
// //                                   <div style={{ marginBottom: '1rem' }}>
// //                                     <p style={{ fontSize: '0.6rem', fontWeight: 900, color: '#34d399', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.6rem' }}>💻 Coding Questions</p>
// //                                     <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '0.5rem' }}>
// //                                       {topic.content?.filter(c => c.type === 'coding').map((item, ci) => {
// //                                         const realIdx = topic.content.indexOf(item);
// //                                         const diffC   = item.difficulty === 'Easy' ? '#10b981' : item.difficulty === 'Medium' ? '#f59e0b' : '#ef4444';
// //                                         return (
// //                                           <div key={ci} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0.875rem', background: 'rgba(15,23,42,0.7)', borderRadius: '0.6rem', border: '1px solid #1e293b' }}>
// //                                             <span style={{ fontSize: '1rem' }}>💻</span>
// //                                             <div style={{ flex: 1, minWidth: 0 }}>
// //                                               <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#e2e8f0', margin: 0 }}>{item.title}</p>
// //                                             </div>
// //                                             <DeleteButton itemName={`"${item.title}"`} onConfirm={() => deleteContent(lang, topicIdx, realIdx)} />
// //                                           </div>
// //                                         );
// //                                       })}
// //                                       {!topic.content?.some(c => c.type === 'coding') && (
// //                                         <p style={{ fontSize: '0.75rem', color: '#475569', marginBottom: '0.5rem' }}>No coding questions yet.</p>
// //                                       )}
// //                                     </div>
                                    
// //                                     {/* ── NEW: FULL QUESTION FORM FOR CODING ── */}
// //                                     <QuestionForm 
// //                                       isInline={true} 
// //                                       defaultType="CODING" 
// //                                       targetModuleId={`${lang.name} - ${topic.name}`}
// //                                       onSubmit={(data) => addContentItem(lang, topicIdx, { ...data, type: 'coding' })} 
// //                                     />
// //                                   </div>
// //                                 )}

// //                                 {/* ── MCQ PANEL ── */}
// //                                 {curPanel === 'mcq' && (
// //                                   <div style={{ marginBottom: '1rem' }}>
// //                                     <p style={{ fontSize: '0.6rem', fontWeight: 900, color: '#fbbf24', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.6rem' }}>🧠 MCQ Questions</p>
// //                                     <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.5rem' }}>
// //                                       {topic.content?.filter(c => c.type === 'mcq').map((item, ci) => {
// //                                         const realIdx = topic.content.indexOf(item);
// //                                         return (
// //                                           <div key={ci} style={{ padding: '0.75rem', background: 'rgba(15,23,42,0.7)', borderRadius: '0.6rem', border: '1px solid #1e293b' }}>
// //                                             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.5rem' }}>
// //                                               <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#e2e8f0', margin: 0, flex: 1 }}>Q{ci + 1}. {item.title}</p>
// //                                               <DeleteButton itemName={`"${item.title}"`} onConfirm={() => deleteContent(lang, topicIdx, realIdx)} />
// //                                             </div>
// //                                             {item.options && (
// //                                               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.3rem' }}>
// //                                                 {item.options.map((opt, oi) => {
// //                                                     const isCorrect = item.correctAnswer ? (opt === item.correctAnswer) : (oi === item.correctIndex);
// //                                                     return (
// //                                                       <div key={oi} style={{ padding: '0.3rem 0.6rem', borderRadius: '0.4rem', border: `1px solid ${isCorrect ? '#10b981' : '#1e293b'}`, background: isCorrect ? 'rgba(16,185,129,0.1)' : 'rgba(15,23,42,0.5)', fontSize: '0.72rem', color: isCorrect ? '#34d399' : '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
// //                                                         <span style={{ fontWeight: 800, fontSize: '0.6rem' }}>{String.fromCharCode(65 + oi)}.</span> {opt}
// //                                                         {isCorrect && <span style={{ marginLeft: 'auto', fontSize: '0.6rem', color: '#10b981' }}>✓</span>}
// //                                                       </div>
// //                                                     )
// //                                                 })}
// //                                               </div>
// //                                             )}
// //                                           </div>
// //                                         );
// //                                       })}
// //                                       {!topic.content?.some(c => c.type === 'mcq') && (
// //                                         <p style={{ fontSize: '0.75rem', color: '#475569', marginBottom: '0.5rem' }}>No MCQs yet.</p>
// //                                       )}
// //                                     </div>
                                    
// //                                     {/* ── NEW: FULL QUESTION FORM FOR MCQ ── */}
// //                                     <QuestionForm 
// //                                       isInline={true} 
// //                                       defaultType="MCQ" 
// //                                       targetModuleId={`${lang.name} - ${topic.name}`}
// //                                       onSubmit={(data) => addContentItem(lang, topicIdx, { ...data, type: 'mcq' })} 
// //                                     />
// //                                   </div>
// //                                 )}

// //                                 {/* ── PPT / FILES PANEL ── */}
// //                                 {curPanel === 'ppt' && (
// //                                   <div style={{ marginBottom: '1rem' }}>
// //                                     <p style={{ fontSize: '0.6rem', fontWeight: 900, color: '#a78bfa', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.6rem' }}>📊 Files & Slides</p>
// //                                     <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '0.5rem' }}>
// //                                       {topic.content?.filter(c => c.type === 'ppt').map((item, ci) => {
// //                                         const realIdx = topic.content.indexOf(item);
// //                                         return (
// //                                           <div key={ci} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0.875rem', background: 'rgba(15,23,42,0.7)', borderRadius: '0.6rem', border: '1px solid #1e293b' }}>
// //                                             <span style={{ fontSize: '1rem' }}>📊</span>
// //                                             <div style={{ flex: 1, minWidth: 0 }}>
// //                                               <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#e2e8f0', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</p>
// //                                               <p style={{ fontSize: '0.62rem', color: '#64748b', margin: 0 }}>{item.fileSize || ''}</p>
// //                                             </div>
// //                                             <span style={pillS('#8b5cf6')}>Slides</span>
// //                                             {item.downloadUrl && (
// //                                               <a href={item.downloadUrl} target="_blank" rel="noreferrer"
// //                                                 style={{ fontSize: '0.62rem', fontWeight: 800, padding: '0.2rem 0.55rem', borderRadius: '0.4rem', background: 'rgba(139,92,246,0.15)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.3)', textDecoration: 'none', flexShrink: 0 }}>⬇</a>
// //                                             )}
// //                                             <DeleteButton itemName={`"${item.title}"`} onConfirm={() => deleteContent(lang, topicIdx, realIdx)} />
// //                                           </div>
// //                                         );
// //                                       })}
// //                                       {!topic.content?.some(c => c.type === 'ppt') && (
// //                                         <p style={{ fontSize: '0.75rem', color: '#475569' }}>No files uploaded yet.</p>
// //                                       )}
// //                                     </div>
// //                                     <PPTUploader langId={lang.id} topicIdx={topicIdx}
// //                                       onUploaded={item => addContentItem(lang, topicIdx, item)} />
// //                                   </div>
// //                                 )}

// //                                 {/* ── Subtopics ── */}
// //                                 <div style={{ marginBottom: '1rem' }}>
// //                                   <p style={{ fontSize: '0.6rem', fontWeight: 900, color: '#475569', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.6rem' }}>Subtopics</p>
// //                                   <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.6rem' }}>
// //                                     {!topic.subtopics?.length ? (
// //                                       <span style={{ fontSize: '0.75rem', color: '#475569' }}>No subtopics yet.</span>
// //                                     ) : topic.subtopics.map((sub, si) => (
// //                                       <div key={si} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.2rem 0.3rem 0.2rem 0.65rem', borderRadius: '0.4rem', background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)' }}>
// //                                         <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#818cf8' }}>{sub}</span>
// //                                         <button onClick={() => { if (window.confirm(`Delete subtopic "${sub}"?`)) deleteSubtopic(lang, topicIdx, si); }}
// //                                           style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '0.7rem', padding: '0 0.1rem', fontWeight: 900 }}
// //                                           onMouseEnter={e => e.currentTarget.style.color = '#f87171'}
// //                                           onMouseLeave={e => e.currentTarget.style.color = '#64748b'}>✕</button>
// //                                       </div>
// //                                     ))}
// //                                   </div>
// //                                   <div style={{ display: 'flex', gap: '0.5rem' }}>
// //                                     <input value={newSubtopics[topicKey] || ''} onChange={e => setNewSubtopics(p => ({ ...p, [topicKey]: e.target.value }))}
// //                                       onKeyDown={e => e.key === 'Enter' && addSubtopic(lang, topicIdx)}
// //                                       placeholder={`Add subtopic to ${topic.name}`} style={{ ...iStyle, fontSize: '0.78rem' }} />
// //                                     <button onClick={() => addSubtopic(lang, topicIdx)} style={{ ...bStyle('#6366f1'), padding: '0.45rem 0.875rem', fontSize: '0.7rem' }}>+ Subtopic</button>
// //                                   </div>
// //                                 </div>

// //                               </div>
// //                             )}
// //                           </div>
// //                         );
// //                       })}
// //                     </div>

// //                     {/* Add topic */}
// //                     <div>
// //                       <p style={{ fontSize: '0.6rem', fontWeight: 900, color: '#475569', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
// //                         + Add Topic to {lang.name}
// //                       </p>
// //                       <div style={{ display: 'flex', gap: '0.6rem' }}>
// //                         <input value={newTopics[lang.id] || ''} onChange={e => setNewTopics(p => ({ ...p, [lang.id]: e.target.value }))}
// //                           onKeyDown={e => e.key === 'Enter' && addTopic(lang)}
// //                           placeholder="e.g., I/O Basics, Arrays, OOP" style={iStyle} />
// //                         <button onClick={() => addTopic(lang)} style={bStyle()}>+ Add Topic</button>
// //                       </div>
// //                     </div>

// //                   </div>
// //                 )}
// //               </div>
// //             );
// //           })}
// //         </div>
// //       )}
// //     </div>
// //   );
// // } 


// import React, { useState, useEffect } from "react";
// import { collection, getDocs, query, orderBy, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
// import { db } from "../firebase/config";
// import { useAuth } from "../context/AuthContext";

// // ── Circular progress ring (like the reference images)
// function CircleProgress({ percent = 0, size = 38, stroke = 3.5, color = "#22c55e", trackColor }) {
//   const r = (size - stroke * 2) / 2;
//   const circ = 2 * Math.PI * r;
//   const offset = circ - (percent / 100) * circ;
//   const track = trackColor || "rgba(0,0,0,0.08)";
//   return (
//     <svg width={size} height={size} style={{ transform: "rotate(-90deg)", flexShrink: 0 }}>
//       <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
//       <circle
//         cx={size / 2} cy={size / 2} r={r} fill="none"
//         stroke={percent >= 100 ? color : percent > 0 ? color : "transparent"}
//         strokeWidth={stroke} strokeDasharray={circ} strokeDashoffset={offset}
//         strokeLinecap="round" style={{ transition: "stroke-dashoffset 0.6s ease" }}
//       />
//     </svg>
//   );
// }

// // ── Checkmark icon (completed)
// function CheckIcon({ size = 38, color = "#22c55e" }) {
//   return (
//     <div style={{
//       width: size, height: size, borderRadius: "50%",
//       background: color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
//     }}>
//       <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 12 10" fill="none">
//         <polyline points="1,5 4.5,8.5 11,1" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//       </svg>
//     </div>
//   );
// }

// // ── Content type icons
// function ContentTypeIcon({ type }) {
//   if (type === "ppt")    return <span style={{ fontSize: "0.95rem" }}>📊</span>;
//   if (type === "coding") return <span style={{ fontSize: "0.95rem" }}>💻</span>;
//   if (type === "mcq")    return <span style={{ fontSize: "0.95rem" }}>📋</span>;
//   return <span style={{ fontSize: "0.95rem" }}>📖</span>;
// }

// // ── Tag label colours
// const TAG_COLORS = {
//   ppt:    { bg: "rgba(139,92,246,0.10)", color: "#8b5cf6", label: "Slides"   },
//   coding: { bg: "rgba(16,185,129,0.10)", color: "#10b981", label: "Coding"   },
//   mcq:    { bg: "rgba(245,158,11,0.10)", color: "#f59e0b", label: "Practice" },
//   lesson: { bg: "rgba(59,130,246,0.10)", color: "#3b82f6", label: "Learning" },
// };

// // ── Estimated minutes per content type
// const EST_MINS = { ppt: 15, coding: 30, mcq: 20, lesson: 45 };

// export default function LearningModulesView({ collegeId, T }) {
//   const { currentUser } = useAuth();
//   const [languages, setLanguages]         = useState([]);
//   const [loading, setLoading]             = useState(true);
//   const [expandedLang, setExpandedLang]   = useState(null);
//   const [expandedTopic, setExpandedTopic] = useState(null);
//   // progress: { [langId_topicIdx_contentIdx]: true }
//   const [progress, setProgress]           = useState({});
//   const [savingKey, setSavingKey]         = useState(null);

//   // ── Fetch languages from Firestore
//   useEffect(() => {
//     const fetchLangs = async () => {
//       setLoading(true);
//       try {
//         const snap = await getDocs(query(collection(db, "learningLanguages"), orderBy("createdAt")));
//         setLanguages(snap.docs.map(d => ({ id: d.id, ...d.data() })));
//       } catch (e) { console.error(e); }
//       setLoading(false);
//     };
//     fetchLangs();
//   }, []);

//   // ── Fetch student progress
//   useEffect(() => {
//     if (!currentUser) return;
//     const fetchProgress = async () => {
//       try {
//         const snap = await getDoc(doc(db, "learningProgress", currentUser.uid));
//         if (snap.exists()) setProgress(snap.data() || {});
//       } catch (e) { console.error(e); }
//     };
//     fetchProgress();
//   }, [currentUser]);

//   // ── Toggle a content item as done/undone
//   const toggleItem = async (key) => {
//     if (!currentUser) return;
//     setSavingKey(key);
//     const updated = { ...progress, [key]: !progress[key] };
//     // remove false entries to keep doc clean
//     Object.keys(updated).forEach(k => { if (!updated[k]) delete updated[k]; });
//     setProgress(updated);
//     try {
//       await setDoc(doc(db, "learningProgress", currentUser.uid), updated, { merge: true });
//     } catch (e) { console.error(e); }
//     setSavingKey(null);
//   };

//   // ── Compute % complete for a topic
//   const topicProgress = (langId, topicIdx, topic) => {
//     const items = topic.content || [];
//     if (!items.length) return 0;
//     const done = items.filter((_, ci) => progress[`${langId}_${topicIdx}_${ci}`]).length;
//     return Math.round((done / items.length) * 100);
//   };

//   // ── Compute overall language progress
//   const langProgress = (lang) => {
//     const topics = lang.topics || [];
//     if (!topics.length) return 0;
//     const pcts = topics.map((t, ti) => topicProgress(lang.id, ti, t));
//     return Math.round(pcts.reduce((a, b) => a + b, 0) / pcts.length);
//   };

//   const isDark = T.bg === "#0d1117" || T.bg?.includes("0d");

//   if (loading) {
//     return (
//       <div className="section-enter" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "40vh", gap: "1rem" }}>
//         <div style={{ width: 36, height: 36, border: "3px solid #d1fae5", borderTop: "3px solid #22c55e", borderRadius: "50%", animation: "spin .8s linear infinite" }} />
//         <span style={{ fontSize: "0.85rem", color: T.textFaint }}>Loading learning modules…</span>
//       </div>
//     );
//   }

//   if (!languages.length) {
//     return (
//       <div className="section-enter" style={{ textAlign: "center", padding: "5rem 2rem" }}>
//         <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📚</div>
//         <div style={{ fontWeight: 800, fontSize: "1.2rem", color: T.text, marginBottom: "0.5rem" }}>No Learning Modules Yet</div>
//         <div style={{ color: T.textFaint, fontSize: "0.88rem" }}>Your instructor hasn't published any learning content yet. Check back soon!</div>
//       </div>
//     );
//   }

//   return (
//     <div className="section-enter">
//       {/* ── Header */}
//       <div style={{ marginBottom: "1.75rem" }}>
//         <h2 style={{ fontWeight: 800, fontSize: "1.75rem", color: T.text }}>📚 Learning Modules</h2>
//         <p style={{ fontSize: "0.85rem", color: T.textFaint, marginTop: "0.35rem" }}>
//           {languages.length} language{languages.length !== 1 ? "s" : ""} · Track your topic-by-topic progress
//         </p>
//       </div>

//       {/* ── Language list */}
//       <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
//         {languages.map((lang) => {
//           const isLangOpen = expandedLang === lang.id;
//           const lPct       = langProgress(lang);
//           const lDone      = lPct === 100;
//           const topics     = lang.topics || [];

//           return (
//             <div key={lang.id} style={{
//               background: T.bgCard, border: `1px solid ${isLangOpen ? "#22c55e60" : T.border}`,
//               borderRadius: "14px", overflow: "hidden",
//               boxShadow: isLangOpen ? "0 0 0 3px rgba(34,197,94,0.10)" : "none",
//               transition: "all .2s",
//             }}>
//               {/* Language header */}
//               <button
//                 onClick={() => setExpandedLang(isLangOpen ? null : lang.id)}
//                 style={{
//                   width: "100%", display: "flex", alignItems: "center", gap: "1rem",
//                   padding: "1.125rem 1.5rem", background: "transparent", border: "none",
//                   cursor: "pointer", textAlign: "left",
//                 }}
//               >
//                 {/* Circle or check */}
//                 <div style={{ position: "relative", flexShrink: 0 }}>
//                   {lDone
//                     ? <CheckIcon size={44} color="#22c55e" />
//                     : (
//                       <div style={{ position: "relative", width: 44, height: 44 }}>
//                         <CircleProgress percent={lPct} size={44} stroke={4} color="#22c55e" trackColor={isDark ? "#21262d" : "#e5e7eb"} />
//                         <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" }}>
//                           {lang.name === "Python" ? "🐍" : lang.name === "Java" ? "☕" : lang.name === "JavaScript" ? "🟨" : lang.name === "SQL" ? "🗄️" : "📘"}
//                         </div>
//                       </div>
//                     )}
//                 </div>

//                 <div style={{ flex: 1 }}>
//                   <div style={{ fontWeight: 800, fontSize: "1.05rem", color: T.text }}>{lang.name}</div>
//                   <div style={{ fontSize: "0.75rem", color: T.textFaint, marginTop: "0.2rem" }}>
//                     {topics.length} topic{topics.length !== 1 ? "s" : ""}
//                     {lPct > 0 && <span style={{ marginLeft: "0.5rem", color: "#22c55e", fontWeight: 700 }}>· {lPct}% complete</span>}
//                   </div>
//                 </div>

//                 {/* Overall progress bar */}
//                 <div style={{ width: 100, flexShrink: 0 }}>
//                   <div style={{ height: 6, borderRadius: 99, background: isDark ? "#21262d" : "#e5e7eb", overflow: "hidden" }}>
//                     <div style={{ height: "100%", width: `${lPct}%`, background: "#22c55e", borderRadius: 99, transition: "width .8s ease" }} />
//                   </div>
//                   <div style={{ fontSize: "0.65rem", color: T.textFaint, textAlign: "right", marginTop: "0.25rem" }}>{lPct}%</div>
//                 </div>

//                 <div style={{
//                   width: 26, height: 26, borderRadius: "6px", flexShrink: 0,
//                   background: isLangOpen ? "rgba(34,197,94,0.12)" : T.bgHover,
//                   border: `1px solid ${isLangOpen ? "#22c55e40" : T.border}`,
//                   display: "flex", alignItems: "center", justifyContent: "center",
//                   color: isLangOpen ? "#22c55e" : T.textFaint,
//                   transform: isLangOpen ? "rotate(180deg)" : "none", transition: "all .2s", fontSize: "0.7rem",
//                 }}>▼</div>
//               </button>

//               {/* Topics list */}
//               {isLangOpen && (
//                 <div style={{ borderTop: `1px solid ${T.border}` }}>
//                   {topics.length === 0 ? (
//                     <div style={{ padding: "2rem", textAlign: "center", color: T.textFaint, fontSize: "0.85rem" }}>No topics added yet.</div>
//                   ) : topics.map((topic, topicIdx) => {
//                     const topicKey  = `${lang.id}-${topicIdx}`;
//                     const isOpen    = expandedTopic === topicKey;
//                     const pct       = topicProgress(lang.id, topicIdx, topic);
//                     const isDone    = pct === 100;
//                     const hasContent = (topic.content || []).length > 0;

//                     return (
//                       <div key={topicIdx} style={{ borderBottom: topicIdx < topics.length - 1 ? `1px solid ${T.border}` : "none" }}>
//                         {/* Topic row */}
//                         <button
//                           onClick={() => setExpandedTopic(isOpen ? null : topicKey)}
//                           style={{
//                             width: "100%", display: "flex", alignItems: "center", gap: "1rem",
//                             padding: "0.9rem 1.5rem 0.9rem 2rem", background: "transparent",
//                             border: "none", cursor: "pointer", textAlign: "left",
//                             transition: "background .15s",
//                           }}
//                           onMouseEnter={e => e.currentTarget.style.background = T.bgHover}
//                           onMouseLeave={e => e.currentTarget.style.background = "transparent"}
//                         >
//                           {/* Topic progress circle */}
//                           {isDone
//                             ? <CheckIcon size={34} color="#22c55e" />
//                             : (
//                               <div style={{ position: "relative", width: 34, height: 34 }}>
//                                 <CircleProgress percent={pct} size={34} stroke={3} color="#22c55e" trackColor={isDark ? "#21262d" : "#e5e7eb"} />
//                                 {pct === 0 && (
//                                   <div style={{
//                                     position: "absolute", inset: 0,
//                                     border: `3px solid ${isDark ? "#21262d" : "#e5e7eb"}`,
//                                     borderRadius: "50%",
//                                   }} />
//                                 )}
//                               </div>
//                             )}

//                           <div style={{ flex: 1 }}>
//                             <div style={{ fontSize: "0.6rem", color: T.textFaint, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "0.15rem" }}>TOPIC</div>
//                             <div style={{ fontWeight: 700, fontSize: "0.92rem", color: T.text }}>{topic.name}</div>
//                           </div>

//                           {hasContent && (
//                             <div style={{ fontSize: "0.72rem", color: T.textFaint, textAlign: "right", flexShrink: 0 }}>
//                               {(topic.content || []).filter((_, ci) => progress[`${lang.id}_${topicIdx}_${ci}`]).length} / {topic.content.length} done
//                             </div>
//                           )}

//                           <span style={{ color: T.textFaint, fontSize: "0.75rem", flexShrink: 0 }}>›</span>
//                         </button>

//                         {/* Topic content items */}
//                         {isOpen && (
//                           <div style={{ background: isDark ? "rgba(22,27,34,0.6)" : "#f9fafb", borderTop: `1px solid ${T.border}` }}>
//                             {/* Subtopics pills */}
//                             {topic.subtopics?.length > 0 && (
//                               <div style={{ padding: "0.75rem 2rem 0.5rem", display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
//                                 {topic.subtopics.map((sub, si) => (
//                                   <span key={si} style={{
//                                     fontSize: "0.7rem", fontWeight: 600, padding: "0.2rem 0.65rem",
//                                     borderRadius: "99px", background: isDark ? "rgba(99,102,241,0.12)" : "#ede9fe",
//                                     color: "#818cf8", border: "1px solid rgba(99,102,241,0.2)",
//                                   }}>{sub}</span>
//                                 ))}
//                               </div>
//                             )}

//                             {/* Content items */}
//                             {!hasContent ? (
//                               <div style={{ padding: "1.25rem 2rem", color: T.textFaint, fontSize: "0.82rem" }}>No content yet for this topic.</div>
//                             ) : (
//                               <div style={{ display: "flex", flexDirection: "column" }}>
//                                 {(topic.content || []).map((item, ci) => {
//                                   const progressKey = `${lang.id}_${topicIdx}_${ci}`;
//                                   const done        = !!progress[progressKey];
//                                   const saving      = savingKey === progressKey;
//                                   const tag         = TAG_COLORS[item.type] || TAG_COLORS.lesson;
//                                   const mins        = EST_MINS[item.type] || 20;

//                                   return (
//                                     <div key={ci} style={{
//                                       display: "flex", alignItems: "center", gap: "1rem",
//                                       padding: "0.875rem 1.5rem 0.875rem 2rem",
//                                       borderTop: ci > 0 ? `1px solid ${T.border}` : "none",
//                                       background: done ? (isDark ? "rgba(34,197,94,0.04)" : "rgba(34,197,94,0.03)") : "transparent",
//                                       transition: "background .2s",
//                                     }}>
//                                       {/* Done circle */}
//                                       <div style={{
//                                         width: 26, height: 26, borderRadius: "50%", flexShrink: 0,
//                                         border: `2px solid ${done ? "#22c55e" : isDark ? "#30363d" : "#d1d5db"}`,
//                                         background: done ? "#22c55e" : "transparent",
//                                         display: "flex", alignItems: "center", justifyContent: "center",
//                                         transition: "all .2s",
//                                       }}>
//                                         {done && (
//                                           <svg width="11" height="9" viewBox="0 0 12 10" fill="none">
//                                             <polyline points="1,5 4.5,8.5 11,1" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//                                           </svg>
//                                         )}
//                                       </div>

//                                       {/* Type icon */}
//                                       <ContentTypeIcon type={item.type} />

//                                       {/* Title + meta */}
//                                       <div style={{ flex: 1, minWidth: 0 }}>
//                                         <div style={{
//                                           fontSize: "0.88rem", fontWeight: 600,
//                                           color: done ? T.textFaint : T.text,
//                                           textDecoration: done ? "line-through" : "none",
//                                           whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
//                                         }}>
//                                           {item.title || item.question || "Untitled"}
//                                         </div>
//                                         <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.2rem" }}>
//                                           <span style={{ fontSize: "0.7rem", color: T.textFaint }}>{mins} Mins</span>
//                                           <span style={{ fontSize: "0.65rem", fontWeight: 700, padding: "0.1rem 0.5rem", borderRadius: "99px", background: tag.bg, color: tag.color }}>{tag.label}</span>
//                                           {item.type === "mcq" && item.options?.length > 0 && (
//                                             <span style={{ fontSize: "0.65rem", color: T.textFaint }}>· {item.options.length} options</span>
//                                           )}
//                                         </div>
//                                       </div>

//                                       {/* PPT download link */}
//                                       {item.type === "ppt" && item.downloadUrl && (
//                                         <a href={item.downloadUrl} target="_blank" rel="noreferrer"
//                                           style={{
//                                             fontSize: "0.7rem", fontWeight: 700, padding: "0.3rem 0.75rem",
//                                             borderRadius: "6px", background: "rgba(139,92,246,0.12)",
//                                             color: "#8b5cf6", border: "1px solid rgba(139,92,246,0.25)",
//                                             textDecoration: "none", flexShrink: 0,
//                                           }}>⬇ View</a>
//                                       )}

//                                       {/* Mark done button */}
//                                       <button
//                                         onClick={() => toggleItem(progressKey)}
//                                         disabled={saving}
//                                         style={{
//                                           fontSize: "0.72rem", fontWeight: 700, padding: "0.35rem 0.875rem",
//                                           borderRadius: "7px", flexShrink: 0, cursor: "pointer",
//                                           border: done ? "1px solid rgba(34,197,94,0.3)" : `1px solid ${T.border}`,
//                                           background: done ? "rgba(34,197,94,0.10)" : T.bgHover,
//                                           color: done ? "#22c55e" : T.textMuted,
//                                           opacity: saving ? 0.6 : 1,
//                                           transition: "all .15s",
//                                         }}
//                                         onMouseEnter={e => { if (!done) { e.currentTarget.style.borderColor = "#22c55e40"; e.currentTarget.style.color = "#22c55e"; } }}
//                                         onMouseLeave={e => { if (!done) { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textMuted; } }}
//                                       >
//                                         {saving ? "…" : done ? "✓ Done" : "Mark done"}
//                                       </button>
//                                     </div>
//                                   );
//                                 })}
//                               </div>
//                             )}
//                           </div>
//                         )}
//                       </div>
//                     );
//                   })}
//                 </div>
//               )}
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );



// import React, { useState, useEffect } from "react";
// import { collection, getDocs, doc, getDoc, setDoc } from "firebase/firestore";
// import { db } from "../firebase/config";
// import { useAuth } from "../context/AuthContext";

// function CircleProgress({ percent = 0, size = 38, stroke = 3.5, color = "#22c55e", trackColor }) {
//   const r = (size - stroke * 2) / 2;
//   const circ = 2 * Math.PI * r;
//   const offset = circ - (percent / 100) * circ;
//   const track = trackColor || "rgba(0,0,0,0.08)";
//   return (
//     <svg width={size} height={size} style={{ transform: "rotate(-90deg)", flexShrink: 0 }}>
//       <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
//       <circle
//         cx={size / 2} cy={size / 2} r={r} fill="none"
//         stroke={percent >= 100 ? color : percent > 0 ? color : "transparent"}
//         strokeWidth={stroke} strokeDasharray={circ} strokeDashoffset={offset}
//         strokeLinecap="round" style={{ transition: "stroke-dashoffset 0.6s ease" }}
//       />
//     </svg>
//   );
// }

// function CheckIcon({ size = 38, color = "#22c55e" }) {
//   return (
//     <div style={{ width: size, height: size, borderRadius: "50%", background: color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
//       <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 12 10" fill="none">
//         <polyline points="1,5 4.5,8.5 11,1" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//       </svg>
//     </div>
//   );
// }

// function ContentTypeIcon({ type }) {
//   if (type === "ppt")    return <span style={{ fontSize: "0.95rem" }}>📊</span>;
//   if (type === "coding") return <span style={{ fontSize: "0.95rem" }}>💻</span>;
//   if (type === "mcq")    return <span style={{ fontSize: "0.95rem" }}>📋</span>;
//   return <span style={{ fontSize: "0.95rem" }}>📖</span>;
// }

// const TAG_COLORS = {
//   ppt:    { bg: "rgba(139,92,246,0.10)", color: "#8b5cf6", label: "Slides"   },
//   coding: { bg: "rgba(16,185,129,0.10)", color: "#10b981", label: "Coding"   },
//   mcq:    { bg: "rgba(245,158,11,0.10)", color: "#f59e0b", label: "Practice" },
//   lesson: { bg: "rgba(59,130,246,0.10)", color: "#3b82f6", label: "Learning" },
// };
// const EST_MINS = { ppt: 15, coding: 30, mcq: 20, lesson: 45 };

// // ── Inline MCQ widget (auto-marks done on answer)
// function MCQWidget({ item, done, onDone }) {
//   const [selected, setSelected] = useState(null);
//   const [submitted, setSubmitted] = useState(done);
//   const [result, setResult] = useState(null);

//   const submit = (idx) => {
//     if (submitted) return;
//     setSelected(idx);
//     setSubmitted(true);
//     const correct = idx === item.correctIndex;
//     setResult(correct);
//     if (!done) onDone(); // auto-mark done
//   };

//   return (
//     <div style={{ marginTop: "0.75rem", padding: "0.75rem", background: "rgba(245,158,11,0.06)", borderRadius: "0.6rem", border: "1px solid rgba(245,158,11,0.2)" }}>
//       <p style={{ fontSize: "0.8rem", fontWeight: 700, color: "#f59e0b", marginBottom: "0.5rem" }}>{item.title}</p>
//       <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
//         {(item.options || []).map((opt, i) => {
//           let bg = "rgba(30,41,59,0.5)";
//           let border = "#334155";
//           let color = "#cbd5e1";
//           if (submitted) {
//             if (i === item.correctIndex) { bg = "rgba(16,185,129,0.15)"; border = "#10b981"; color = "#10b981"; }
//             else if (i === selected && !result) { bg = "rgba(239,68,68,0.12)"; border = "#ef4444"; color = "#f87171"; }
//           }
//           return (
//             <button key={i} onClick={() => submit(i)} disabled={submitted}
//               style={{ padding: "0.45rem 0.75rem", borderRadius: "0.45rem", background: bg, border: `1px solid ${border}`, color, fontSize: "0.78rem", textAlign: "left", cursor: submitted ? "default" : "pointer", transition: "all .15s" }}>
//               {opt}
//             </button>
//           );
//         })}
//       </div>
//       {submitted && (
//         <p style={{ fontSize: "0.72rem", marginTop: "0.5rem", color: result ? "#10b981" : "#f87171", fontWeight: 700 }}>
//           {result ? "✓ Correct!" : `✗ Correct answer: ${item.options?.[item.correctIndex]}`}
//         </p>
//       )}
//     </div>
//   );
// }

// // ── Inline Coding widget (auto-marks done on run/submit)
// function CodingWidget({ item, done, onDone }) {
//   const [code, setCode] = useState(item.boilerplates?.python || item.boilerplates?.javascript || "// Write your solution here");
//   const [submitted, setSubmitted] = useState(done);
//   const [output, setOutput] = useState("");

//   const handleSubmit = () => {
//     if (submitted) return;
//     setSubmitted(true);
//     setOutput("✓ Submitted! Your instructor will review your solution.");
//     if (!done) onDone(); // auto-mark done
//   };

//   return (
//     <div style={{ marginTop: "0.75rem", padding: "0.75rem", background: "rgba(16,185,129,0.06)", borderRadius: "0.6rem", border: "1px solid rgba(16,185,129,0.2)" }}>
//       <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "#34d399", marginBottom: "0.5rem" }}>💻 {item.title}</p>
//       {item.description && (
//         <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginBottom: "0.5rem" }}
//           dangerouslySetInnerHTML={{ __html: item.description }} />
//       )}
//       <textarea
//         value={code}
//         onChange={e => setCode(e.target.value)}
//         disabled={submitted}
//         rows={8}
//         style={{ width: "100%", background: "#0f172a", color: "#e2e8f0", fontFamily: "monospace", fontSize: "0.75rem", padding: "0.6rem", borderRadius: "0.4rem", border: "1px solid #334155", outline: "none", resize: "vertical", boxSizing: "border-box" }}
//       />
//       {!submitted ? (
//         <button onClick={handleSubmit}
//           style={{ marginTop: "0.5rem", padding: "0.4rem 1rem", background: "#10b981", color: "#fff", border: "none", borderRadius: "0.4rem", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer" }}>
//           Submit Solution
//         </button>
//       ) : (
//         <p style={{ fontSize: "0.72rem", color: "#10b981", marginTop: "0.4rem", fontWeight: 700 }}>{output}</p>
//       )}
//     </div>
//   );
// }

// const LANG_ICON = (name = "") => {
//   const n = name.toLowerCase();
//   if (n.includes("python")) return "🐍";
//   if (n.includes("java")) return "☕";
//   if (n.includes("javascript") || n.includes("js")) return "🟨";
//   if (n.includes("sql")) return "🗄️";
//   if (n.includes("c++") || n.includes("cpp")) return "⚡";
//   if (n.includes(" c ") || n === "c") return "⚙️";
//   return "📘";
// };

// export default function LearningModulesView({ collegeId, T }) {
//   const { currentUser } = useAuth();
//   const [languages, setLanguages]         = useState([]);
//   const [loading, setLoading]             = useState(true);
//   const [expandedLang, setExpandedLang]   = useState(null);
//   const [expandedTopic, setExpandedTopic] = useState(null);
//   const [expandedItem, setExpandedItem]   = useState(null); // for MCQ/Coding expand
//   const [progress, setProgress]           = useState({});

//   // ── FIX: Fetch from 'categories' filtered by moduleType === "Learning Module"
//   useEffect(() => {
//     const fetchLangs = async () => {
//       setLoading(true);
//       try {
//         const snap = await getDocs(collection(db, "categories"));
//         const modules = snap.docs
//           .map(d => ({ id: d.id, ...d.data() }))
//           .filter(m => m.moduleType === "Learning Module");
//         setLanguages(modules);
//       } catch (e) { console.error(e); }
//       setLoading(false);
//     };
//     fetchLangs();
//   }, []);

//   // ── Fetch student progress
//   useEffect(() => {
//     if (!currentUser) return;
//     const fetchProgress = async () => {
//       try {
//         const snap = await getDoc(doc(db, "learningProgress", currentUser.uid));
//         if (snap.exists()) setProgress(snap.data() || {});
//       } catch (e) { console.error(e); }
//     };
//     fetchProgress();
//   }, [currentUser]);

//   // ── Mark a single item as done (called automatically)
//   const markDone = async (key) => {
//     if (!currentUser || progress[key]) return; // already done
//     const updated = { ...progress, [key]: true };
//     setProgress(updated);
//     try {
//       await setDoc(doc(db, "learningProgress", currentUser.uid), updated, { merge: true });
//     } catch (e) { console.error(e); }
//   };

//   const topicProgress = (langId, topicIdx, topic) => {
//     const items = topic.content || [];
//     if (!items.length) return 0;
//     const done = items.filter((_, ci) => progress[`${langId}_${topicIdx}_${ci}`]).length;
//     return Math.round((done / items.length) * 100);
//   };

//   const langProgress = (lang) => {
//     const topics = lang.topics || [];
//     if (!topics.length) return 0;
//     const pcts = topics.map((t, ti) => topicProgress(lang.id, ti, t));
//     return Math.round(pcts.reduce((a, b) => a + b, 0) / pcts.length);
//   };

//   const isDark = T.bg === "#0d1117" || T.bg?.includes("0d");

//   if (loading) {
//     return (
//       <div className="section-enter" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "40vh", gap: "1rem" }}>
//         <div style={{ width: 36, height: 36, border: "3px solid #d1fae5", borderTop: "3px solid #22c55e", borderRadius: "50%", animation: "spin .8s linear infinite" }} />
//         <span style={{ fontSize: "0.85rem", color: T.textFaint }}>Loading learning modules…</span>
//       </div>
//     );
//   }

//   if (!languages.length) {
//     return (
//       <div className="section-enter" style={{ textAlign: "center", padding: "5rem 2rem" }}>
//         <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📚</div>
//         <div style={{ fontWeight: 800, fontSize: "1.2rem", color: T.text, marginBottom: "0.5rem" }}>No Learning Modules Yet</div>
//         <div style={{ color: T.textFaint, fontSize: "0.88rem" }}>Your instructor hasn't published any learning content yet. Check back soon!</div>
//       </div>
//     );
//   }

//   return (
//     <div className="section-enter">
//       <div style={{ marginBottom: "1.75rem" }}>
//         <h2 style={{ fontWeight: 800, fontSize: "1.75rem", color: T.text }}>📚 Learning Modules</h2>
//         <p style={{ fontSize: "0.85rem", color: T.textFaint, marginTop: "0.35rem" }}>
//           {languages.length} module{languages.length !== 1 ? "s" : ""} · Track your topic-by-topic progress
//         </p>
//       </div>

//       <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
//         {languages.map((lang) => {
//           const isLangOpen = expandedLang === lang.id;
//           const lPct       = langProgress(lang);
//           const lDone      = lPct === 100;
//           const topics     = lang.topics || [];

//           return (
//             <div key={lang.id} style={{
//               background: T.bgCard, border: `1px solid ${isLangOpen ? "#22c55e60" : T.border}`,
//               borderRadius: "14px", overflow: "hidden",
//               boxShadow: isLangOpen ? "0 0 0 3px rgba(34,197,94,0.10)" : "none",
//               transition: "all .2s",
//             }}>
//               {/* Module header */}
//               <button
//                 onClick={() => setExpandedLang(isLangOpen ? null : lang.id)}
//                 style={{ width: "100%", display: "flex", alignItems: "center", gap: "1rem", padding: "1.125rem 1.5rem", background: "transparent", border: "none", cursor: "pointer", textAlign: "left" }}
//               >
//                 <div style={{ position: "relative", flexShrink: 0 }}>
//                   {lDone ? <CheckIcon size={44} color="#22c55e" /> : (
//                     <div style={{ position: "relative", width: 44, height: 44 }}>
//                       <CircleProgress percent={lPct} size={44} stroke={4} color="#22c55e" trackColor={isDark ? "#21262d" : "#e5e7eb"} />
//                       <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" }}>
//                         {LANG_ICON(lang.name)}
//                       </div>
//                     </div>
//                   )}
//                 </div>

//                 <div style={{ flex: 1 }}>
//                   <div style={{ fontWeight: 800, fontSize: "1.05rem", color: T.text }}>{lang.name}</div>
//                   <div style={{ fontSize: "0.75rem", color: T.textFaint, marginTop: "0.2rem" }}>
//                     {topics.length} topic{topics.length !== 1 ? "s" : ""}
//                     {lPct > 0 && <span style={{ marginLeft: "0.5rem", color: "#22c55e", fontWeight: 700 }}>· {lPct}% complete</span>}
//                   </div>
//                 </div>

//                 <div style={{ width: 100, flexShrink: 0 }}>
//                   <div style={{ height: 6, borderRadius: 99, background: isDark ? "#21262d" : "#e5e7eb", overflow: "hidden" }}>
//                     <div style={{ height: "100%", width: `${lPct}%`, background: "#22c55e", borderRadius: 99, transition: "width .8s ease" }} />
//                   </div>
//                   <div style={{ fontSize: "0.65rem", color: T.textFaint, textAlign: "right", marginTop: "0.25rem" }}>{lPct}%</div>
//                 </div>

//                 <div style={{
//                   width: 26, height: 26, borderRadius: "6px", flexShrink: 0,
//                   background: isLangOpen ? "rgba(34,197,94,0.12)" : T.bgHover,
//                   border: `1px solid ${isLangOpen ? "#22c55e40" : T.border}`,
//                   display: "flex", alignItems: "center", justifyContent: "center",
//                   color: isLangOpen ? "#22c55e" : T.textFaint,
//                   transform: isLangOpen ? "rotate(180deg)" : "none", transition: "all .2s", fontSize: "0.7rem",
//                 }}>▼</div>
//               </button>

//               {/* Topics list */}
//               {isLangOpen && (
//                 <div style={{ borderTop: `1px solid ${T.border}` }}>
//                   {topics.length === 0 ? (
//                     <div style={{ padding: "2rem", textAlign: "center", color: T.textFaint, fontSize: "0.85rem" }}>No topics added yet.</div>
//                   ) : topics.map((topic, topicIdx) => {
//                     const topicKey  = `${lang.id}-${topicIdx}`;
//                     const isOpen    = expandedTopic === topicKey;
//                     const pct       = topicProgress(lang.id, topicIdx, topic);
//                     const isDone    = pct === 100;
//                     const hasContent = (topic.content || []).length > 0;

//                     return (
//                       <div key={topicIdx} style={{ borderBottom: topicIdx < topics.length - 1 ? `1px solid ${T.border}` : "none" }}>
//                         <button
//                           onClick={() => setExpandedTopic(isOpen ? null : topicKey)}
//                           style={{ width: "100%", display: "flex", alignItems: "center", gap: "1rem", padding: "0.9rem 1.5rem 0.9rem 2rem", background: "transparent", border: "none", cursor: "pointer", textAlign: "left", transition: "background .15s" }}
//                           onMouseEnter={e => e.currentTarget.style.background = T.bgHover}
//                           onMouseLeave={e => e.currentTarget.style.background = "transparent"}
//                         >
//                           {isDone ? <CheckIcon size={34} color="#22c55e" /> : (
//                             <div style={{ position: "relative", width: 34, height: 34 }}>
//                               <CircleProgress percent={pct} size={34} stroke={3} color="#22c55e" trackColor={isDark ? "#21262d" : "#e5e7eb"} />
//                             </div>
//                           )}
//                           <div style={{ flex: 1 }}>
//                             <div style={{ fontSize: "0.6rem", color: T.textFaint, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "0.15rem" }}>TOPIC</div>
//                             <div style={{ fontWeight: 700, fontSize: "0.92rem", color: T.text }}>{topic.name}</div>
//                           </div>
//                           {hasContent && (
//                             <div style={{ fontSize: "0.72rem", color: T.textFaint, textAlign: "right", flexShrink: 0 }}>
//                               {(topic.content || []).filter((_, ci) => progress[`${lang.id}_${topicIdx}_${ci}`]).length} / {topic.content.length} done
//                             </div>
//                           )}
//                           <span style={{ color: T.textFaint, fontSize: "0.75rem", flexShrink: 0 }}>›</span>
//                         </button>

//                         {isOpen && (
//                           <div style={{ background: isDark ? "rgba(22,27,34,0.6)" : "#f9fafb", borderTop: `1px solid ${T.border}` }}>
//                             {!hasContent ? (
//                               <div style={{ padding: "1.25rem 2rem", color: T.textFaint, fontSize: "0.82rem" }}>No content yet for this topic.</div>
//                             ) : (
//                               <div style={{ display: "flex", flexDirection: "column" }}>
//                                 {(topic.content || []).map((item, ci) => {
//                                   const progressKey = `${lang.id}_${topicIdx}_${ci}`;
//                                   const done        = !!progress[progressKey];
//                                   const tag         = TAG_COLORS[item.type] || TAG_COLORS.lesson;
//                                   const mins        = EST_MINS[item.type] || 20;
//                                   const itemKey     = `${lang.id}-${topicIdx}-${ci}`;
//                                   const isItemOpen  = expandedItem === itemKey;

//                                   return (
//                                     <div key={ci} style={{
//                                       padding: "0.875rem 1.5rem 0.875rem 2rem",
//                                       borderTop: ci > 0 ? `1px solid ${T.border}` : "none",
//                                       background: done ? (isDark ? "rgba(34,197,94,0.04)" : "rgba(34,197,94,0.03)") : "transparent",
//                                       transition: "background .2s",
//                                     }}>
//                                       {/* Item header row */}
//                                       <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
//                                         {/* Done circle */}
//                                         <div style={{
//                                           width: 26, height: 26, borderRadius: "50%", flexShrink: 0,
//                                           border: `2px solid ${done ? "#22c55e" : isDark ? "#30363d" : "#d1d5db"}`,
//                                           background: done ? "#22c55e" : "transparent",
//                                           display: "flex", alignItems: "center", justifyContent: "center", transition: "all .2s",
//                                         }}>
//                                           {done && (
//                                             <svg width="11" height="9" viewBox="0 0 12 10" fill="none">
//                                               <polyline points="1,5 4.5,8.5 11,1" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//                                             </svg>
//                                           )}
//                                         </div>

//                                         <ContentTypeIcon type={item.type} />

//                                         <div style={{ flex: 1, minWidth: 0 }}>
//                                           <div style={{ fontSize: "0.88rem", fontWeight: 600, color: done ? T.textFaint : T.text, textDecoration: done ? "line-through" : "none", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
//                                             {item.title || item.question || "Untitled"}
//                                           </div>
//                                           <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.2rem" }}>
//                                             <span style={{ fontSize: "0.7rem", color: T.textFaint }}>{mins} Mins</span>
//                                             <span style={{ fontSize: "0.65rem", fontWeight: 700, padding: "0.1rem 0.5rem", borderRadius: "99px", background: tag.bg, color: tag.color }}>{tag.label}</span>
//                                           </div>
//                                         </div>

//                                         {/* Action button — type-specific, auto-marks done */}
//                                         {item.type === "ppt" && item.downloadUrl && (
//                                           // PPT: open link → auto mark done
//                                           <a
//                                             href={item.downloadUrl}
//                                             target="_blank"
//                                             rel="noreferrer"
//                                             onClick={() => markDone(progressKey)}
//                                             style={{ fontSize: "0.7rem", fontWeight: 700, padding: "0.3rem 0.75rem", borderRadius: "6px", background: done ? "rgba(34,197,94,0.12)" : "rgba(139,92,246,0.12)", color: done ? "#22c55e" : "#8b5cf6", border: `1px solid ${done ? "rgba(34,197,94,0.3)" : "rgba(139,92,246,0.25)"}`, textDecoration: "none", flexShrink: 0 }}
//                                           >
//                                             {done ? "✓ Viewed" : "⬇ View"}
//                                           </a>
//                                         )}

//                                         {(item.type === "mcq" || item.type === "coding") && (
//                                           // MCQ / Coding: expand inline widget
//                                           <button
//                                             onClick={() => setExpandedItem(isItemOpen ? null : itemKey)}
//                                             style={{ fontSize: "0.7rem", fontWeight: 700, padding: "0.3rem 0.75rem", borderRadius: "6px", background: done ? "rgba(34,197,94,0.12)" : (isDark ? "rgba(30,41,59,0.8)" : "#f1f5f9"), color: done ? "#22c55e" : T.textMuted, border: `1px solid ${done ? "rgba(34,197,94,0.3)" : T.border}`, cursor: "pointer", flexShrink: 0 }}
//                                           >
//                                             {done ? "✓ Done" : isItemOpen ? "Close ▲" : (item.type === "mcq" ? "Answer ▼" : "Solve ▼")}
//                                           </button>
//                                         )}
//                                       </div>

//                                       {/* Inline expanded widget */}
//                                       {isItemOpen && item.type === "mcq" && (
//                                         <MCQWidget item={item} done={done} onDone={() => markDone(progressKey)} />
//                                       )}
//                                       {isItemOpen && item.type === "coding" && (
//                                         <CodingWidget item={item} done={done} onDone={() => markDone(progressKey)} />
//                                       )}
//                                     </div>
//                                   );
//                                 })}
//                               </div>
//                             )}
//                           </div>
//                         )}
//                       </div>
//                     );
//                   })}
//                 </div>
//               )}
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// } 

// import React, { useState, useEffect, useCallback } from "react";
// import { collection, getDocs, doc, getDoc, setDoc, addDoc, serverTimestamp } from "firebase/firestore";
// import { db } from "../firebase/config";
// import { useAuth } from "../context/AuthContext";
// import Editor from "@monaco-editor/react";
// import { executeCode, runWithTestCases } from "../api/compilerService";

// // ── Constants & Helpers ──────────────────────────────────────────────
// const LANGUAGES = [
//   { label: "C++",        value: "cpp",        monaco: "cpp"        },
//   { label: "Python",     value: "python",     monaco: "python"     },
//   { label: "JavaScript", value: "javascript", monaco: "javascript" },
//   { label: "Java",       value: "java",       monaco: "java"       },
//   { label: "C",          value: "c",          monaco: "c"          },
// ];

// const FALLBACK_BOILERPLATE = {
//   cpp:        "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Write your solution here\n};\n",
//   python:     "class Solution:\n    def solution(self):\n        # Write your solution here\n        pass\n",
//   javascript: "class Solution {\n    solution() {\n        // Write your solution here\n    }\n}\n",
//   java:       "class Solution {\n    public Object solution() {\n        // Write your solution here\n        return null;\n    }\n}\n",
//   c:          "#include <stdio.h>\n\n// Write your solution here\n",
// };

// const TAG_COLORS = {
//   ppt:    { bg: "rgba(139,92,246,0.10)", color: "#8b5cf6", label: "Slides"   },
//   coding: { bg: "rgba(16,185,129,0.10)", color: "#10b981", label: "Coding"   },
//   mcq:    { bg: "rgba(245,158,11,0.10)", color: "#f59e0b", label: "Practice" },
//   lesson: { bg: "rgba(59,130,246,0.10)", color: "#3b82f6", label: "Learning" },
// };
// const EST_MINS = { ppt: 15, coding: 30, mcq: 20, lesson: 45 };

// function CircleProgress({ percent = 0, size = 38, stroke = 3.5, color = "#22c55e", trackColor }) {
//   const r = (size - stroke * 2) / 2;
//   const circ = 2 * Math.PI * r;
//   const offset = circ - (percent / 100) * circ;
//   const track = trackColor || "rgba(0,0,0,0.08)";
//   return (
//     <svg width={size} height={size} style={{ transform: "rotate(-90deg)", flexShrink: 0 }}>
//       <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
//       <circle
//         cx={size / 2} cy={size / 2} r={r} fill="none"
//         stroke={percent >= 100 ? color : percent > 0 ? color : "transparent"}
//         strokeWidth={stroke} strokeDasharray={circ} strokeDashoffset={offset}
//         strokeLinecap="round" style={{ transition: "stroke-dashoffset 0.6s ease" }}
//       />
//     </svg>
//   );
// }

// function CheckIcon({ size = 38, color = "#22c55e" }) {
//   return (
//     <div style={{ width: size, height: size, borderRadius: "50%", background: color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
//       <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 12 10" fill="none">
//         <polyline points="1,5 4.5,8.5 11,1" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//       </svg>
//     </div>
//   );
// }

// function ContentTypeIcon({ type }) {
//   if (type === "ppt")    return <span style={{ fontSize: "0.95rem" }}>📊</span>;
//   if (type === "coding") return <span style={{ fontSize: "0.95rem" }}>💻</span>;
//   if (type === "mcq")    return <span style={{ fontSize: "0.95rem" }}>📋</span>;
//   return <span style={{ fontSize: "0.95rem" }}>📖</span>;
// }

// const LANG_ICON = (name = "") => {
//   const n = name.toLowerCase();
//   if (n.includes("python")) return "🐍";
//   if (n.includes("java")) return "☕";
//   if (n.includes("javascript") || n.includes("js")) return "🟨";
//   if (n.includes("sql")) return "🗄️";
//   if (n.includes("c++") || n.includes("cpp")) return "⚡";
//   if (n.includes(" c ") || n === "c") return "⚙️";
//   return "📘";
// };

// // ── Reusable LeetCode Test Result Panel ─────────────────────────────
// function TestResultPanel({ tcResult, output, verdict, isSubmitting }) {
//   const [selectedCase, setSelectedCase] = useState(0);

//   if (tcResult && tcResult.results?.length > 0) {
//     const { results, passedCount, totalCount, allPassed, visiblePassed, visibleTotal } = tcResult;
//     const shownCase = results[selectedCase];

//     return (
//       <div style={{ height:"100%", display:"flex", flexDirection:"column", overflow:"hidden" }}>
//         <div style={{ padding:"10px 14px", borderBottom:`1px solid #21262d`, flexShrink:0, background: allPassed ? "rgba(52,211,153,.08)" : "rgba(248,113,113,.08)" }}>
//           <div style={{ display:"flex", alignItems:"center", gap:10 }}>
//             <span style={{ fontSize:18 }}>{allPassed ? "✅" : "❌"}</span>
//             <div>
//               <div style={{ fontSize:14, fontWeight:800, color: allPassed ? "#34d399" : "#f87171" }}>
//                 {allPassed ? "All Test Cases Passed!" : `${passedCount} / ${totalCount} Passed`}
//               </div>
//               <div style={{ fontSize:11, color:"#8b949e", marginTop:2, fontFamily:"monospace" }}>
//                 Visible: {visiblePassed}/{visibleTotal}
//                 {totalCount > visibleTotal && ` · Hidden: ${passedCount - visiblePassed}/${totalCount - visibleTotal}`}
//               </div>
//             </div>
//           </div>
//           <div style={{ display:"flex", gap:5, marginTop:10, flexWrap:"wrap" }}>
//             {results.map((c, i) => (
//               <button key={i} onClick={() => setSelectedCase(i)}
//                 title={`Case ${i+1}: ${c.passed ? "Passed" : c.statusLabel}`}
//                 style={{
//                   width:30, height:30, borderRadius:7, border:"none", cursor:"pointer", fontWeight:700, fontSize:11,
//                   background: selectedCase===i ? (c.passed ? "#34d399" : "#f87171") : (c.passed ? "rgba(52,211,153,.2)" : "rgba(248,113,113,.2)"),
//                   color: selectedCase===i ? "#fff" : (c.passed ? "#34d399" : "#f87171"),
//                   outline: selectedCase===i ? `2px solid ${c.passed?"#34d399":"#f87171"}` : "none", outlineOffset: 1,
//                 }}>
//                 {c.isVisible ? i+1 : "H"}
//               </button>
//             ))}
//           </div>
//         </div>

//         {shownCase && (
//           <div style={{ flex:1, overflowY:"auto", padding:14 }}>
//             <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
//               <span style={{ fontSize:12, fontWeight:700, color:"#8b949e" }}>
//                 Case {selectedCase+1} {shownCase.isVisible ? "" : "(Hidden)"}
//               </span>
//               <span style={{ fontSize:11, fontWeight:800, padding:"2px 10px", borderRadius:20, background: shownCase.passed ? "rgba(52,211,153,.12)" : "rgba(248,113,113,.12)", color: shownCase.passed ? "#34d399" : "#f87171", border:`1px solid ${shownCase.passed?"rgba(52,211,153,.3)":"rgba(248,113,113,.3)"}` }}>
//                 {shownCase.statusLabel}
//               </span>
//             </div>

//             {shownCase.isVisible && shownCase.input !== null ? (
//               <>
//                 <p style={{ fontSize:11, color:"#8b949e", marginBottom:3, textTransform:"uppercase", letterSpacing:"0.06em" }}>Input</p>
//                 <pre style={{ background:"#0d1117", padding:"8px 12px", borderRadius:8, fontSize:12, color:"#a5d6ff", fontFamily:"monospace", marginBottom:10, overflow:"auto", border:`1px solid #21262d`, margin:"0 0 10px 0" }}>{shownCase.input}</pre>

//                 <p style={{ fontSize:11, color:"#8b949e", marginBottom:3, textTransform:"uppercase", letterSpacing:"0.06em" }}>Expected Output</p>
//                 <pre style={{ background:"#0d1117", padding:"8px 12px", borderRadius:8, fontSize:12, color:"#7ee787", fontFamily:"monospace", marginBottom:10, overflow:"auto", border:`1px solid #21262d`, margin:"0 0 10px 0" }}>{shownCase.expectedOutput}</pre>

//                 <p style={{ fontSize:11, color:"#8b949e", marginBottom:3, textTransform:"uppercase", letterSpacing:"0.06em" }}>Your Output</p>
//                 <pre style={{ background:"#0d1117", padding:"8px 12px", borderRadius:8, fontSize:12, color: shownCase.passed ? "#7ee787" : "#f87171", fontFamily:"monospace", marginBottom: shownCase.error ? 10 : 0, overflow:"auto", border:`1px solid ${shownCase.passed?"rgba(52,211,153,.25)":"rgba(248,113,113,.25)"}`, margin:"0 0 10px 0" }}>
//                   {shownCase.actualOutput || "(empty)"}
//                 </pre>

//                 {shownCase.error && (
//                   <>
//                     <p style={{ fontSize:11, color:"#f87171", marginBottom:3, textTransform:"uppercase", letterSpacing:"0.06em" }}>Error</p>
//                     <pre style={{ background:"#0d1117", padding:"8px 12px", borderRadius:8, fontSize:12, color:"#f87171", fontFamily:"monospace", overflow:"auto", border:`1px solid rgba(248,113,113,.25)`, margin:0 }}>{shownCase.error}</pre>
//                   </>
//                 )}
//               </>
//             ) : (
//               <div style={{ padding:"14px 16px", background: shownCase.passed ? "rgba(52,211,153,.06)" : "rgba(248,113,113,.06)", border:`1px solid ${shownCase.passed?"rgba(52,211,153,.2)":"rgba(248,113,113,.2)"}`, borderRadius:10 }}>
//                 <p style={{ fontSize:13, color: shownCase.passed ? "#34d399" : "#f87171", fontWeight:700 }}>
//                   {shownCase.passed ? "✓ Hidden test case passed." : "✗ Hidden test case failed."}
//                 </p>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     );
//   }

//   const textColor = verdict === "accepted" ? "#34d399" : verdict === "wrong" ? "#f87171" : "#e6edf3";
//   return (
//     <div style={{ flex:1, padding:12, overflowY:"auto", background: "#0d1117" }}>
//       <pre style={{ color:textColor, fontSize:13, margin:0, whiteSpace:"pre-wrap", wordBreak:"break-word", lineHeight:1.65 }}>
//         {output || (isSubmitting ? "⏳ Evaluating…" : "Run or submit to see output here.")}
//       </pre>
//     </div>
//   );
// }

// // ── Inline Coding Workspace (Terminal Environment) ──────────────
// function InlineCodingWorkspace({ item, done, onDone, activeUser, onClose }) {
//   const getInitialCode = useCallback((q, lang) => q?.boilerplates?.[lang] || q?.boilerplate || FALLBACK_BOILERPLATE[lang] || "", []);
  
//   const [language, setLanguage]         = useState("cpp");
//   const [code, setCode]                 = useState(getInitialCode(item, "cpp"));
//   const [activeTab, setActiveTab]       = useState("testcase");
//   const [stdin, setStdin]               = useState(item?.testCases?.[0]?.input || "");
//   const [output, setOutput]             = useState("");
//   const [isRunning, setIsRunning]       = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [verdict, setVerdict]           = useState(null);
//   const [tcResult, setTcResult]         = useState(null);

//   const langObj = LANGUAGES.find(l => l.value === language) ?? LANGUAGES[0];

//   const handleLang = (lang) => {
//     setLanguage(lang);
//     setCode(getInitialCode(item, lang));
//   };

//   const handleRun = async () => {
//     if (!code.trim()) return;
//     setIsRunning(true); setActiveTab("result");
//     setOutput("⏳ Running..."); setVerdict(null); setTcResult(null);
//     try {
//       if (item?.methodName && stdin) {
//         const singleCase = [{ input: stdin, expectedOutput: "" }];
//         const fakeQ = { ...item, testCases: singleCase };
//         const res = await runWithTestCases(language, code, fakeQ, { visibleCount: 1 });
//         const r = res.results[0];
//         if (r.error) setOutput(`Error:\n${r.error}`);
//         else setOutput(r.actualOutput || "(empty output)");
//       } else {
//         const r = await executeCode(language, code, stdin, item?.timeLimitMs || 2000);
//         let txt = "";
//         if (r.compile_output) txt = `Compilation Error:\n${r.compile_output}`;
//         else if (r.stderr)    txt = `Runtime Error:\n${r.stderr}`;
//         else                  txt = r.stdout || "(empty output)";
//         setOutput(txt);
//         if (r.status?.id === 3) {
//           const matched = item?.testCases?.find(t => t.input === stdin);
//           if (matched && r.stdout?.trim() === matched.expectedOutput?.trim()) setVerdict("accepted");
//         }
//       }
//     } catch (e) { setOutput("Execution Error: " + e.message); }
//     setIsRunning(false);
//   };

//   const handleSubmitCoding = async () => {
//     if (!item) return;
//     setIsSubmitting(true); setActiveTab("result");
//     setOutput(""); setVerdict(null); setTcResult(null);

//     const testCases = item.testCases?.filter(tc => tc.input?.trim() && tc.expectedOutput?.trim()) || [];
//     if (!testCases.length) {
//       setOutput("⚠️ No test cases defined for this question.\n\nAsk your faculty to add test cases in the question editor.");
//       setIsSubmitting(false); return;
//     }

//     if (!item.methodName) {
//       setOutput(`⚠️ This question doesn't have a method name configured.\n\nRunning with raw stdin mode.\n\nRunning ${testCases.length} test case(s)...`);
//       let passed = 0; let logs = "";
//       try {
//         for (let i = 0; i < testCases.length; i++) {
//           const r  = await executeCode(language, code, testCases[i].input, item.timeLimitMs || 2000);
//           const ok = r.status?.id === 3 && r.stdout?.trim() === testCases[i].expectedOutput?.trim();
//           if (ok) passed++;
//           logs += `Test ${i+1}: ${ok ? "✅ Passed" : "❌ Failed"}\n`;
//         }
//         const all = passed === testCases.length;
//         setVerdict(all ? "accepted" : "wrong");
//         setOutput(all ? `✅ All ${testCases.length} test cases passed!` : `❌ ${passed}/${testCases.length} passed\n\n${logs}`);
//         if (all && !done) onDone(); // Only marks done if all pass
//       } catch (e) { setOutput("Submission Error: " + e.message); }
//       setIsSubmitting(false); return;
//     }

//     try {
//       const res = await runWithTestCases(language, code, item);
//       setTcResult(res); 
//       setVerdict(res.allPassed ? "accepted" : "wrong");
//       setOutput(""); 
      
//       if (res.allPassed && !done) onDone(); // Only marks done if all pass

//       if (activeUser) {
//         try {
//           await addDoc(collection(db, "submissions"), {
//             studentId:    activeUser.uid,
//             questionId:   item.id || item.title,
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

//   return (
//     <div style={{ marginTop: "1rem", borderRadius: "10px", overflow: "hidden", border: "1px solid #334155", background: "#0d1117" }}>
//       {/* Question Description */}
//       {item.description && (
//         <div style={{ padding: "16px 20px", background: "#161b22", borderBottom: "1px solid #30363d", color: "#e2e8f0", fontSize: "0.85rem", lineHeight: 1.6 }}
//           dangerouslySetInnerHTML={{ __html: item.description }} />
//       )}

//       {/* Workspace Toolbar */}
//       <div style={{ height: 46, display: "flex", alignItems: "center", padding: "0 16px", borderBottom: "1px solid #30363d", gap: 12, background: "#161b22" }}>
//         <select value={language} onChange={e=>handleLang(e.target.value)}
//           style={{ background: "#0d1117", color: "#e2e8f0", border: "1px solid #30363d", borderRadius: 6, padding: "5px 10px", fontSize: 12, cursor: "pointer", fontWeight: 700, outline: "none" }}>
//           {LANGUAGES.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
//         </select>
        
//         <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
//           <button onClick={onClose} 
//             style={{ padding: "6px 12px", borderRadius: 6, fontSize: 12, fontWeight: 700, background: "transparent", border: "1px solid #30363d", color: "#8b949e", cursor: "pointer" }}>
//             Close ✖
//           </button>
//           <button onClick={handleRun} disabled={isRunning||isSubmitting}
//             style={{ padding: "6px 16px", borderRadius: 6, fontSize: 12, fontWeight: 700, background: "#21262d", border: "1px solid #30363d", color: "#e2e8f0", cursor: isRunning||isSubmitting?"not-allowed":"pointer", opacity: isRunning||isSubmitting?0.6:1 }}>
//             {isRunning ? "⏳ Running…" : "▶ Run"}
//           </button>
//           <button onClick={handleSubmitCoding} disabled={isRunning||isSubmitting}
//             style={{ padding: "6px 16px", borderRadius: 6, fontSize: 12, fontWeight: 700, background: isSubmitting?"#22863a":"#2ea043", color: "#fff", border: "none", cursor: isRunning||isSubmitting?"not-allowed":"pointer", opacity: isRunning||isSubmitting?0.6:1 }}>
//             {isSubmitting ? "⏳ Evaluating…" : "Submit"}
//           </button>
//         </div>
//       </div>

//       {/* Editor & Terminal Split */}
//       <div style={{ display: "flex", flexDirection: "column", height: 500 }}>
//         {/* Editor Container */}
//         <div style={{ flex: 3, borderBottom: "2px solid #30363d", paddingTop: "10px" }}>
//           <Editor
//             theme="vs-dark"
//             language={langObj.monaco}
//             value={code}
//             onChange={v => setCode(v??"")}
//             options={{ minimap:{enabled:false}, fontSize:14, lineHeight:22, scrollBeyondLastLine:false, tabSize:4 }}
//           />
//         </div>

//         {/* Terminal Area */}
//         <div style={{ flex: 2, display: "flex", flexDirection: "column", background: "#0d1117" }}>
//           <div style={{ display: "flex", borderBottom: "1px solid #30363d", height: 40, alignItems: "center", padding: "0 6px", flexShrink: 0 }}>
//             {["testcase","result"].map(tab => (
//               <button key={tab} onClick={() => setActiveTab(tab)}
//                 style={{ padding: "0 16px", height: "100%", background: "none", border: "none", borderBottom: activeTab===tab?"2px solid #ffa116":"2px solid transparent", color: activeTab===tab?"#fff":"#8b949e", fontSize: 12, fontWeight: activeTab===tab?700:400, cursor: "pointer" }}>
//                 {tab==="testcase"?"📥 Input":"📤 Output"}
//               </button>
//             ))}
//             {verdict && activeTab==="result" && (
//               <span style={{ marginLeft: "auto", marginRight: 8, fontSize: 11, fontWeight: 700, color: verdict==="accepted"?"#34d399":"#f87171" }}>
//                 {verdict==="accepted"?"✅ AC":"❌ WA"}
//               </span>
//             )}
//           </div>

//           <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
//             {activeTab==="testcase" ? (
//               <div style={{ flex:1, padding:12 }}>
//                 <textarea value={stdin} onChange={e=>setStdin(e.target.value)}
//                   placeholder={item?.methodName ? `Custom input args for Run button (e.g. [2,7,11,15], 9)\nSubmit always runs all ${item?.testCases?.length||0} test cases automatically.` : "Custom input (stdin) for Run button..."}
//                   style={{ width: "100%", height: "100%", background: "#0d1117", color: "#e6edf3", border: "none", resize: "none", fontFamily: "'Courier New',monospace", fontSize: 13, outline: "none", lineHeight: 1.65 }} />
//               </div>
//             ) : (
//               tcResult ? (
//                 <TestResultPanel tcResult={tcResult} output={output} verdict={verdict} isSubmitting={isSubmitting} />
//               ) : (
//                 <div style={{ flex:1, padding:12, overflowY:"auto" }}>
//                   <pre style={{ color:"#e6edf3", fontSize:13, margin:0, whiteSpace:"pre-wrap", wordBreak:"break-word", lineHeight:1.65 }}>
//                     {output || (isSubmitting?"⏳ Evaluating…":"Run or submit to see output here.")}
//                   </pre>
//                 </div>
//               )
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ── Widget For MCQ ──────────────────────────────────────────────────
// function MCQWidget({ item, done, onDone, activeUser, onClose }) {
//   const [selected, setSelected] = useState(null);
//   const [submitted, setSubmitted] = useState(done);
//   const [result, setResult] = useState(null);

//   const submit = async (idx) => {
//     if (submitted) return;
//     setSelected(idx);
//     setSubmitted(true);
//     const correct = idx === item.correctIndex;
//     setResult(correct);
//     if (!done && correct) onDone(); // Only marks done if correct!

//     if (activeUser) {
//       try {
//         await addDoc(collection(db, "submissions"), {
//           studentId: activeUser.uid, questionId: item.id || item.title,
//           answer: item.options?.[idx], type: "practice_mcq",
//           status: correct ? "accepted" : "wrong_answer",
//           submittedAt: serverTimestamp(),
//         });
//       } catch (e) { console.error(e); }
//     }
//   };

//   return (
//     <div style={{ marginTop: "0.75rem", padding: "1rem", background: "rgba(245,158,11,0.06)", borderRadius: "0.6rem", border: "1px solid rgba(245,158,11,0.2)", position: "relative" }}>
//       <button onClick={onClose} style={{ position: "absolute", top: "0.85rem", right: "1rem", background: "none", border: "none", color: "#94a3b8", fontSize: "1.2rem", cursor: "pointer", lineHeight: 1 }}>&times;</button>
//       <p style={{ fontSize: "0.85rem", fontWeight: 700, color: "#f59e0b", marginBottom: "0.75rem", paddingRight: "1.5rem" }}>{item.title}</p>
      
//       <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
//         {(item.options || []).map((opt, i) => {
//           let bg = "rgba(30,41,59,0.5)", border = "#334155", color = "#cbd5e1";
//           if (submitted) {
//             if (i === item.correctIndex) { bg = "rgba(16,185,129,0.15)"; border = "#10b981"; color = "#10b981"; }
//             else if (i === selected && !result) { bg = "rgba(239,68,68,0.12)"; border = "#ef4444"; color = "#f87171"; }
//           }
//           return (
//             <button key={i} onClick={() => submit(i)} disabled={submitted}
//               style={{ padding: "0.6rem 1rem", borderRadius: "0.45rem", background: bg, border: `1px solid ${border}`, color, fontSize: "0.8rem", textAlign: "left", cursor: submitted ? "default" : "pointer", transition: "all .15s" }}>
//               {opt}
//             </button>
//           );
//         })}
//       </div>
//       {submitted && (
//         <p style={{ fontSize: "0.75rem", marginTop: "0.75rem", color: result ? "#10b981" : "#f87171", fontWeight: 700 }}>
//           {result ? "✓ Correct!" : `✗ Correct answer: ${item.options?.[item.correctIndex]}`}
//         </p>
//       )}
//     </div>
//   );
// }

// // ── Main View Component ──────────────────────────────────────────────
// export default function LearningModulesView({ collegeId, T }) {
//   const { currentUser } = useAuth();
//   const [languages, setLanguages]         = useState([]);
//   const [loading, setLoading]             = useState(true);
//   const [expandedLang, setExpandedLang]   = useState(null);
//   const [expandedTopic, setExpandedTopic] = useState(null);
//   const [expandedItem, setExpandedItem]   = useState(null); 
//   const [progress, setProgress]           = useState({});

//   useEffect(() => {
//     const fetchLangs = async () => {
//       setLoading(true);
//       try {
//         const snap = await getDocs(collection(db, "categories"));
//         const modules = snap.docs
//           .map(d => ({ id: d.id, ...d.data() }))
//           .filter(m => m.moduleType === "Learning Module");
//         setLanguages(modules);
//       } catch (e) { console.error(e); }
//       setLoading(false);
//     };
//     fetchLangs();
//   }, []);

//   useEffect(() => {
//     if (!currentUser) return;
//     const fetchProgress = async () => {
//       try {
//         const snap = await getDoc(doc(db, "learningProgress", currentUser.uid));
//         if (snap.exists()) setProgress(snap.data() || {});
//       } catch (e) { console.error(e); }
//     };
//     fetchProgress();
//   }, [currentUser]);

//   const markDone = async (key) => {
//     if (!currentUser || progress[key]) return; 
//     const updated = { ...progress, [key]: true };
//     setProgress(updated);
//     try {
//       await setDoc(doc(db, "learningProgress", currentUser.uid), updated, { merge: true });
//     } catch (e) { console.error(e); }
//   };

//   const topicProgress = (langId, topicIdx, topic) => {
//     const items = topic.content || [];
//     if (!items.length) return 0;
//     const done = items.filter((_, ci) => progress[`${langId}_${topicIdx}_${ci}`]).length;
//     return Math.round((done / items.length) * 100);
//   };

//   const langProgress = (lang) => {
//     const topics = lang.topics || [];
//     if (!topics.length) return 0;
//     const pcts = topics.map((t, ti) => topicProgress(lang.id, ti, t));
//     return Math.round(pcts.reduce((a, b) => a + b, 0) / pcts.length);
//   };

//   const isDark = T.bg === "#0d1117" || T.bg?.includes("0d");

//   if (loading) {
//     return (
//       <div className="section-enter" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "40vh", gap: "1rem" }}>
//         <div style={{ width: 36, height: 36, border: "3px solid #d1fae5", borderTop: "3px solid #22c55e", borderRadius: "50%", animation: "spin .8s linear infinite" }} />
//         <span style={{ fontSize: "0.85rem", color: T.textFaint }}>Loading learning modules…</span>
//       </div>
//     );
//   }

//   if (!languages.length) {
//     return (
//       <div className="section-enter" style={{ textAlign: "center", padding: "5rem 2rem" }}>
//         <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📚</div>
//         <div style={{ fontWeight: 800, fontSize: "1.2rem", color: T.text, marginBottom: "0.5rem" }}>No Learning Modules Yet</div>
//         <div style={{ color: T.textFaint, fontSize: "0.88rem" }}>Your instructor hasn't published any learning content yet. Check back soon!</div>
//       </div>
//     );
//   }

//   return (
//     <div className="section-enter">
//       <div style={{ marginBottom: "1.75rem" }}>
//         <h2 style={{ fontWeight: 800, fontSize: "1.75rem", color: T.text }}>📚 Learning Modules</h2>
//         <p style={{ fontSize: "0.85rem", color: T.textFaint, marginTop: "0.35rem" }}>
//           {languages.length} module{languages.length !== 1 ? "s" : ""} · Track your topic-by-topic progress
//         </p>
//       </div>

//       <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
//         {languages.map((lang) => {
//           const isLangOpen = expandedLang === lang.id;
//           const lPct       = langProgress(lang);
//           const lDone      = lPct === 100;
//           const topics     = lang.topics || [];

//           return (
//             <div key={lang.id} style={{
//               background: T.bgCard, border: `1px solid ${isLangOpen ? "#22c55e60" : T.border}`,
//               borderRadius: "14px", overflow: "hidden",
//               boxShadow: isLangOpen ? "0 0 0 3px rgba(34,197,94,0.10)" : "none",
//               transition: "all .2s",
//             }}>
//               <button
//                 onClick={() => setExpandedLang(isLangOpen ? null : lang.id)}
//                 style={{ width: "100%", display: "flex", alignItems: "center", gap: "1rem", padding: "1.125rem 1.5rem", background: "transparent", border: "none", cursor: "pointer", textAlign: "left" }}
//               >
//                 <div style={{ position: "relative", flexShrink: 0 }}>
//                   {lDone ? <CheckIcon size={44} color="#22c55e" /> : (
//                     <div style={{ position: "relative", width: 44, height: 44 }}>
//                       <CircleProgress percent={lPct} size={44} stroke={4} color="#22c55e" trackColor={isDark ? "#21262d" : "#e5e7eb"} />
//                       <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" }}>
//                         {LANG_ICON(lang.name)}
//                       </div>
//                     </div>
//                   )}
//                 </div>

//                 <div style={{ flex: 1 }}>
//                   <div style={{ fontWeight: 800, fontSize: "1.05rem", color: T.text }}>{lang.name}</div>
//                   <div style={{ fontSize: "0.75rem", color: T.textFaint, marginTop: "0.2rem" }}>
//                     {topics.length} topic{topics.length !== 1 ? "s" : ""}
//                     {lPct > 0 && <span style={{ marginLeft: "0.5rem", color: "#22c55e", fontWeight: 700 }}>· {lPct}% complete</span>}
//                   </div>
//                 </div>

//                 <div style={{ width: 100, flexShrink: 0 }}>
//                   <div style={{ height: 6, borderRadius: 99, background: isDark ? "#21262d" : "#e5e7eb", overflow: "hidden" }}>
//                     <div style={{ height: "100%", width: `${lPct}%`, background: "#22c55e", borderRadius: 99, transition: "width .8s ease" }} />
//                   </div>
//                   <div style={{ fontSize: "0.65rem", color: T.textFaint, textAlign: "right", marginTop: "0.25rem" }}>{lPct}%</div>
//                 </div>

//                 <div style={{
//                   width: 26, height: 26, borderRadius: "6px", flexShrink: 0,
//                   background: isLangOpen ? "rgba(34,197,94,0.12)" : T.bgHover,
//                   border: `1px solid ${isLangOpen ? "#22c55e40" : T.border}`,
//                   display: "flex", alignItems: "center", justifyContent: "center",
//                   color: isLangOpen ? "#22c55e" : T.textFaint,
//                   transform: isLangOpen ? "rotate(180deg)" : "none", transition: "all .2s", fontSize: "0.7rem",
//                 }}>▼</div>
//               </button>

//               {isLangOpen && (
//                 <div style={{ borderTop: `1px solid ${T.border}` }}>
//                   {topics.length === 0 ? (
//                     <div style={{ padding: "2rem", textAlign: "center", color: T.textFaint, fontSize: "0.85rem" }}>No topics added yet.</div>
//                   ) : topics.map((topic, topicIdx) => {
//                     const topicKey  = `${lang.id}-${topicIdx}`;
//                     const isOpen    = expandedTopic === topicKey;
//                     const pct       = topicProgress(lang.id, topicIdx, topic);
//                     const isDone    = pct === 100;

//                     const sortedContent = (topic.content || [])
//                       .map((item, originalIndex) => ({ item, originalIndex }))
//                       .sort((a, b) => {
//                         const TYPE_ORDER = { ppt: 1, mcq: 2, coding: 3 };
//                         const orderA = TYPE_ORDER[a.item.type] || 99;
//                         const orderB = TYPE_ORDER[b.item.type] || 99;
//                         return orderA - orderB;
//                       });

//                     const hasContent = sortedContent.length > 0;

//                     return (
//                       <div key={topicIdx} style={{ borderBottom: topicIdx < topics.length - 1 ? `1px solid ${T.border}` : "none" }}>
//                         <button
//                           onClick={() => setExpandedTopic(isOpen ? null : topicKey)}
//                           style={{ width: "100%", display: "flex", alignItems: "center", gap: "1rem", padding: "0.9rem 1.5rem 0.9rem 2rem", background: "transparent", border: "none", cursor: "pointer", textAlign: "left", transition: "background .15s" }}
//                           onMouseEnter={e => e.currentTarget.style.background = T.bgHover}
//                           onMouseLeave={e => e.currentTarget.style.background = "transparent"}
//                         >
//                           {isDone ? <CheckIcon size={34} color="#22c55e" /> : (
//                             <div style={{ position: "relative", width: 34, height: 34 }}>
//                               <CircleProgress percent={pct} size={34} stroke={3} color="#22c55e" trackColor={isDark ? "#21262d" : "#e5e7eb"} />
//                             </div>
//                           )}
//                           <div style={{ flex: 1 }}>
//                             <div style={{ fontSize: "0.6rem", color: T.textFaint, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "0.15rem" }}>TOPIC</div>
//                             <div style={{ fontWeight: 700, fontSize: "0.92rem", color: T.text }}>{topic.name}</div>
//                           </div>
//                           {hasContent && (
//                             <div style={{ fontSize: "0.72rem", color: T.textFaint, textAlign: "right", flexShrink: 0 }}>
//                               {(topic.content || []).filter((_, ci) => progress[`${lang.id}_${topicIdx}_${ci}`]).length} / {topic.content.length} done
//                             </div>
//                           )}
//                           <span style={{ color: T.textFaint, fontSize: "0.75rem", flexShrink: 0 }}>›</span>
//                         </button>

//                         {isOpen && (
//                           <div style={{ background: isDark ? "rgba(22,27,34,0.6)" : "#f9fafb", borderTop: `1px solid ${T.border}` }}>
//                             {!hasContent ? (
//                               <div style={{ padding: "1.25rem 2rem", color: T.textFaint, fontSize: "0.82rem" }}>No content yet for this topic.</div>
//                             ) : (
//                               <div style={{ display: "flex", flexDirection: "column" }}>
//                                 {sortedContent.map(({ item, originalIndex }, arrayIndex) => {
//                                   const progressKey = `${lang.id}_${topicIdx}_${originalIndex}`;
//                                   const done        = !!progress[progressKey];
//                                   const tag         = TAG_COLORS[item.type] || TAG_COLORS.lesson;
//                                   const mins        = EST_MINS[item.type] || 20;
//                                   const itemKey     = `${lang.id}-${topicIdx}-${originalIndex}`;
//                                   const isItemOpen  = expandedItem === itemKey;

//                                   return (
//                                     <div key={originalIndex} style={{
//                                       padding: "0.875rem 1.5rem 0.875rem 2rem",
//                                       borderTop: arrayIndex > 0 ? `1px solid ${T.border}` : "none",
//                                       background: done ? (isDark ? "rgba(34,197,94,0.04)" : "rgba(34,197,94,0.03)") : "transparent",
//                                       transition: "background .2s",
//                                     }}>
//                                       <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
//                                         <div style={{
//                                           width: 26, height: 26, borderRadius: "50%", flexShrink: 0,
//                                           border: `2px solid ${done ? "#22c55e" : isDark ? "#30363d" : "#d1d5db"}`,
//                                           background: done ? "#22c55e" : "transparent",
//                                           display: "flex", alignItems: "center", justifyContent: "center", transition: "all .2s",
//                                         }}>
//                                           {done && (
//                                             <svg width="11" height="9" viewBox="0 0 12 10" fill="none">
//                                               <polyline points="1,5 4.5,8.5 11,1" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//                                             </svg>
//                                           )}
//                                         </div>

//                                         <ContentTypeIcon type={item.type} />

//                                         <div style={{ flex: 1, minWidth: 0 }}>
//                                           <div style={{ fontSize: "0.88rem", fontWeight: 600, color: done ? T.textFaint : T.text, textDecoration: done ? "line-through" : "none", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
//                                             {item.title || item.question || "Untitled"}
//                                           </div>
//                                           <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.2rem" }}>
//                                             <span style={{ fontSize: "0.7rem", color: T.textFaint }}>{mins} Mins</span>
//                                             <span style={{ fontSize: "0.65rem", fontWeight: 700, padding: "0.1rem 0.5rem", borderRadius: "99px", background: tag.bg, color: tag.color }}>{tag.label}</span>
//                                           </div>
//                                         </div>

//                                         {/* Action Buttons */}
//                                         {item.type === "ppt" ? (
//                                           <button
//                                             onClick={(e) => {
//                                               e.preventDefault();
//                                               // Immediately mark as done when viewed
//                                               if (!done) markDone(progressKey);
//                                               // Open in new tab
//                                               window.open(item.downloadUrl, "_blank", "noopener,noreferrer");
//                                             }}
//                                             style={{ 
//                                               fontSize: "0.7rem", fontWeight: 700, padding: "0.3rem 0.75rem", borderRadius: "6px", 
//                                               background: done ? "rgba(34,197,94,0.12)" : (isDark ? "rgba(30,41,59,0.8)" : "#f1f5f9"), 
//                                               color: done ? "#22c55e" : T.textMuted, border: `1px solid ${done ? "rgba(34,197,94,0.3)" : T.border}`, 
//                                               cursor: "pointer", flexShrink: 0 
//                                             }}
//                                           >
//                                             {done ? "✓ Viewed" : "View ↗"}
//                                           </button>
//                                         ) : item.type === "mcq" ? (
//                                           <button
//                                             onClick={() => {
//                                               setExpandedItem(isItemOpen ? null : itemKey);
//                                             }}
//                                             style={{ 
//                                               fontSize: "0.7rem", fontWeight: 700, padding: "0.3rem 0.75rem", borderRadius: "6px", 
//                                               background: done ? "rgba(34,197,94,0.12)" : "rgba(245,158,11,0.1)", 
//                                               color: done ? "#22c55e" : "#f59e0b", border: `1px solid ${done ? "rgba(34,197,94,0.3)" : "rgba(245,158,11,0.3)"}`, 
//                                               cursor: "pointer", flexShrink: 0 
//                                             }}
//                                           >
//                                             {done ? "✓ Review" : isItemOpen ? "Close ▲" : "Answer ▼"}
//                                           </button>
//                                         ) : item.type === "coding" && (
//                                           <button
//                                             onClick={() => {
//                                               setExpandedItem(isItemOpen ? null : itemKey);
//                                             }}
//                                             style={{ 
//                                               fontSize: "0.7rem", fontWeight: 700, padding: "0.3rem 0.75rem", borderRadius: "6px", 
//                                               background: done ? "rgba(34,197,94,0.12)" : "rgba(16,185,129,0.1)", 
//                                               color: done ? "#22c55e" : "#10b981", border: `1px solid ${done ? "rgba(34,197,94,0.3)" : "rgba(16,185,129,0.3)"}`, 
//                                               cursor: "pointer", flexShrink: 0 
//                                             }}
//                                           >
//                                             {done ? "✓ Review" : isItemOpen ? "Close ▲" : "Solve 💻"}
//                                           </button>
//                                         )}
//                                       </div>

//                                       {/* Expanded Inline Widgets (Only for MCQ/Coding) */}
//                                       {isItemOpen && item.type === "mcq" && (
//                                         <MCQWidget item={item} done={done} onDone={() => markDone(progressKey)} activeUser={currentUser} onClose={() => setExpandedItem(null)} />
//                                       )}
//                                       {isItemOpen && item.type === "coding" && (
//                                         <InlineCodingWorkspace item={item} done={done} onDone={() => markDone(progressKey)} activeUser={currentUser} onClose={() => setExpandedItem(null)} />
//                                       )}
//                                     </div>
//                                   );
//                                 })}
//                               </div>
//                             )}
//                           </div>
//                         )}
//                       </div>
//                     );
//                   })}
//                 </div>
//               )}
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// } 




import React, { useState, useEffect, useCallback, useRef } from "react";
import { collection, getDocs, doc, getDoc, setDoc, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuth } from "../context/AuthContext";
import Editor from "@monaco-editor/react";
import { executeCode, runWithTestCases } from "../api/compilerService";

// ── Constants & Helpers ──────────────────────────────────────────────
const LANGUAGES = [
  { label: "C++",        value: "cpp",        monaco: "cpp"        },
  { label: "Python",     value: "python",     monaco: "python"     },
  { label: "JavaScript", value: "javascript", monaco: "javascript" },
  { label: "Java",       value: "java",       monaco: "java"       },
  { label: "C",          value: "c",          monaco: "c"          },
];

const FALLBACK_BOILERPLATE = {
  cpp:        "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Write your solution here\n};\n",
  python:     "class Solution:\n    def solution(self):\n        # Write your solution here\n        pass\n",
  javascript: "class Solution {\n    solution() {\n        // Write your solution here\n    }\n}\n",
  java:       "class Solution {\n    public Object solution() {\n        // Write your solution here\n        return null;\n    }\n}\n",
  c:          "#include <stdio.h>\n\n// Write your solution here\n",
};

const TAG_COLORS = {
  ppt:    { bg: "rgba(139,92,246,0.10)", color: "#8b5cf6", label: "Slides"   },
  coding: { bg: "rgba(16,185,129,0.10)", color: "#10b981", label: "Coding"   },
  mcq:    { bg: "rgba(245,158,11,0.10)", color: "#f59e0b", label: "Practice" },
  lesson: { bg: "rgba(59,130,246,0.10)", color: "#3b82f6", label: "Learning" },
};
const EST_MINS = { ppt: 15, coding: 30, mcq: 20, lesson: 45 };

function CircleProgress({ percent = 0, size = 38, stroke = 3.5, color = "#22c55e", trackColor }) {
  const r = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (percent / 100) * circ;
  const track = trackColor || "rgba(0,0,0,0.08)";
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)", flexShrink: 0 }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={percent >= 100 ? color : percent > 0 ? color : "transparent"}
        strokeWidth={stroke} strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round" style={{ transition: "stroke-dashoffset 0.6s ease" }}
      />
    </svg>
  );
}

function CheckIcon({ size = 38, color = "#22c55e" }) {
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 12 10" fill="none">
        <polyline points="1,5 4.5,8.5 11,1" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

function ContentTypeIcon({ type }) {
  if (type === "ppt")    return <span style={{ fontSize: "0.95rem" }}>📊</span>;
  if (type === "coding") return <span style={{ fontSize: "0.95rem" }}>💻</span>;
  if (type === "mcq")    return <span style={{ fontSize: "0.95rem" }}>📋</span>;
  return <span style={{ fontSize: "0.95rem" }}>📖</span>;
}

const LANG_ICON = (name = "") => {
  const n = name.toLowerCase();
  if (n.includes("python")) return "🐍";
  if (n.includes("java")) return "☕";
  if (n.includes("javascript") || n.includes("js")) return "🟨";
  if (n.includes("sql")) return "🗄️";
  if (n.includes("c++") || n.includes("cpp")) return "⚡";
  if (n.includes(" c ") || n === "c") return "⚙️";
  return "📘";
};

// ── PPT Viewer Modal (View Only — no download, no new tab) ───────────
function PPTViewerModal({ url, onClose }) {
  const iframeRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [useOffice, setUseOffice] = useState(true);

  // Office Online viewer — works best for .pptx files hosted on public URLs
  const officeUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`;
  // Google Docs viewer — fallback
  const googleUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;

  const viewerUrl = useOffice ? officeUrl : googleUrl;

  // Block Ctrl+S / Ctrl+P / Ctrl+U
  useEffect(() => {
    const blockKeys = (e) => {
      if ((e.ctrlKey || e.metaKey) && ["s", "p", "u"].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", blockKeys);
    return () => window.removeEventListener("keydown", blockKeys);
  }, []);

  // Reset loaded state when viewer switches
  useEffect(() => { setLoaded(false); }, [viewerUrl]);

  const scrollIframe = (direction) => {
    try {
      iframeRef.current?.contentWindow?.scrollBy({ top: direction * 700, behavior: "smooth" });
    } catch (_) {}
  };

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(0,0,0,0.92)",
        display: "flex", flexDirection: "column",
      }}
      onContextMenu={e => e.preventDefault()}
    >
      {/* ── Top Toolbar ── */}
      <div style={{
        height: 52, background: "#161b22",
        borderBottom: "1px solid #30363d",
        display: "flex", alignItems: "center",
        padding: "0 20px", gap: 12, flexShrink: 0,
        userSelect: "none",
      }}>
        <span style={{ fontSize: 18 }}>📊</span>
        <span style={{ color: "#e2e8f0", fontWeight: 700, fontSize: 14, flex: 1 }}>
          Presentation Viewer
        </span>

        {/* Toggle viewer if one shows blank */}
        <button
          onClick={() => { setUseOffice(v => !v); setLoaded(false); }}
          style={{
            padding: "5px 14px", borderRadius: 6, fontSize: 11, fontWeight: 600,
            background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.3)",
            color: "#a5b4fc", cursor: "pointer",
          }}
          title="Switch viewer if slides are not loading"
        >
          {useOffice ? "Switch to Google Viewer" : "Switch to Office Viewer"}
        </button>

        <button
          onClick={onClose}
          style={{
            padding: "6px 18px", borderRadius: 6, fontSize: 12, fontWeight: 700,
            background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)",
            color: "#f87171", cursor: "pointer",
          }}
        >
          ✖ Close
        </button>
      </div>

      {/* ── iFrame Area ── */}
      <div style={{ flex: 1, position: "relative", overflow: "hidden", background: "#1e1e2e" }}>

        {/* Loading spinner — shown until iframe fires onLoad */}
        {!loaded && (
          <div style={{
            position: "absolute", inset: 0, zIndex: 5,
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", gap: 14,
            background: "#1e1e2e",
          }}>
            <div style={{
              width: 40, height: 40,
              border: "3px solid #30363d",
              borderTop: "3px solid #8b5cf6",
              borderRadius: "50%",
              animation: "spin .8s linear infinite",
            }} />
            <span style={{ color: "#8b949e", fontSize: 13 }}>Loading presentation…</span>
          </div>
        )}

        {/* Overlay to block Office Online's top toolbar (download/print area) */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0,
          height: 46, zIndex: 10,
          background: "#161b22",
          pointerEvents: "all",
        }} />

        <iframe
          key={viewerUrl}
          ref={iframeRef}
          src={viewerUrl}
          title="PPT Viewer"
          onLoad={() => setLoaded(true)}
          style={{
            width: "100%", height: "100%",
            border: "none", background: "#fff",
            opacity: loaded ? 1 : 0,
            transition: "opacity 0.3s ease",
          }}
          sandbox="allow-scripts allow-same-origin allow-forms"
          onContextMenu={e => e.preventDefault()}
        />
      </div>

      {/* ── Bottom Nav Bar ── */}
      <div style={{
        height: 52, background: "#161b22",
        borderTop: "1px solid #30363d",
        display: "flex", alignItems: "center",
        justifyContent: "center", gap: 20, flexShrink: 0,
        userSelect: "none",
      }}>
        <button
          onClick={() => scrollIframe(-1)}
          style={{
            padding: "7px 28px", borderRadius: 7, fontSize: 13, fontWeight: 700,
            background: "#21262d", border: "1px solid #30363d",
            color: "#e2e8f0", cursor: "pointer",
          }}
        >
          ▲ Page Up
        </button>
        <button
          onClick={() => scrollIframe(1)}
          style={{
            padding: "7px 28px", borderRadius: 7, fontSize: 13, fontWeight: 700,
            background: "#21262d", border: "1px solid #30363d",
            color: "#e2e8f0", cursor: "pointer",
          }}
        >
          ▼ Page Down
        </button>
      </div>
    </div>
  );
}

// ── Reusable LeetCode Test Result Panel ─────────────────────────────
function TestResultPanel({ tcResult, output, verdict, isSubmitting }) {
  const [selectedCase, setSelectedCase] = useState(0);

  if (tcResult && tcResult.results?.length > 0) {
    const { results, passedCount, totalCount, allPassed, visiblePassed, visibleTotal } = tcResult;
    const shownCase = results[selectedCase];

    return (
      <div style={{ height:"100%", display:"flex", flexDirection:"column", overflow:"hidden" }}>
        <div style={{ padding:"10px 14px", borderBottom:`1px solid #21262d`, flexShrink:0, background: allPassed ? "rgba(52,211,153,.08)" : "rgba(248,113,113,.08)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <span style={{ fontSize:18 }}>{allPassed ? "✅" : "❌"}</span>
            <div>
              <div style={{ fontSize:14, fontWeight:800, color: allPassed ? "#34d399" : "#f87171" }}>
                {allPassed ? "All Test Cases Passed!" : `${passedCount} / ${totalCount} Passed`}
              </div>
              <div style={{ fontSize:11, color:"#8b949e", marginTop:2, fontFamily:"monospace" }}>
                Visible: {visiblePassed}/{visibleTotal}
                {totalCount > visibleTotal && ` · Hidden: ${passedCount - visiblePassed}/${totalCount - visibleTotal}`}
              </div>
            </div>
          </div>
          <div style={{ display:"flex", gap:5, marginTop:10, flexWrap:"wrap" }}>
            {results.map((c, i) => (
              <button key={i} onClick={() => setSelectedCase(i)}
                title={`Case ${i+1}: ${c.passed ? "Passed" : c.statusLabel}`}
                style={{
                  width:30, height:30, borderRadius:7, border:"none", cursor:"pointer", fontWeight:700, fontSize:11,
                  background: selectedCase===i ? (c.passed ? "#34d399" : "#f87171") : (c.passed ? "rgba(52,211,153,.2)" : "rgba(248,113,113,.2)"),
                  color: selectedCase===i ? "#fff" : (c.passed ? "#34d399" : "#f87171"),
                  outline: selectedCase===i ? `2px solid ${c.passed?"#34d399":"#f87171"}` : "none", outlineOffset: 1,
                }}>
                {c.isVisible ? i+1 : "H"}
              </button>
            ))}
          </div>
        </div>

        {shownCase && (
          <div style={{ flex:1, overflowY:"auto", padding:14 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
              <span style={{ fontSize:12, fontWeight:700, color:"#8b949e" }}>
                Case {selectedCase+1} {shownCase.isVisible ? "" : "(Hidden)"}
              </span>
              <span style={{ fontSize:11, fontWeight:800, padding:"2px 10px", borderRadius:20, background: shownCase.passed ? "rgba(52,211,153,.12)" : "rgba(248,113,113,.12)", color: shownCase.passed ? "#34d399" : "#f87171", border:`1px solid ${shownCase.passed?"rgba(52,211,153,.3)":"rgba(248,113,113,.3)"}` }}>
                {shownCase.statusLabel}
              </span>
            </div>

            {shownCase.isVisible && shownCase.input !== null ? (
              <>
                <p style={{ fontSize:11, color:"#8b949e", marginBottom:3, textTransform:"uppercase", letterSpacing:"0.06em" }}>Input</p>
                <pre style={{ background:"#0d1117", padding:"8px 12px", borderRadius:8, fontSize:12, color:"#a5d6ff", fontFamily:"monospace", marginBottom:10, overflow:"auto", border:`1px solid #21262d`, margin:"0 0 10px 0" }}>{shownCase.input}</pre>

                <p style={{ fontSize:11, color:"#8b949e", marginBottom:3, textTransform:"uppercase", letterSpacing:"0.06em" }}>Expected Output</p>
                <pre style={{ background:"#0d1117", padding:"8px 12px", borderRadius:8, fontSize:12, color:"#7ee787", fontFamily:"monospace", marginBottom:10, overflow:"auto", border:`1px solid #21262d`, margin:"0 0 10px 0" }}>{shownCase.expectedOutput}</pre>

                <p style={{ fontSize:11, color:"#8b949e", marginBottom:3, textTransform:"uppercase", letterSpacing:"0.06em" }}>Your Output</p>
                <pre style={{ background:"#0d1117", padding:"8px 12px", borderRadius:8, fontSize:12, color: shownCase.passed ? "#7ee787" : "#f87171", fontFamily:"monospace", marginBottom: shownCase.error ? 10 : 0, overflow:"auto", border:`1px solid ${shownCase.passed?"rgba(52,211,153,.25)":"rgba(248,113,113,.25)"}`, margin:"0 0 10px 0" }}>
                  {shownCase.actualOutput || "(empty)"}
                </pre>

                {shownCase.error && (
                  <>
                    <p style={{ fontSize:11, color:"#f87171", marginBottom:3, textTransform:"uppercase", letterSpacing:"0.06em" }}>Error</p>
                    <pre style={{ background:"#0d1117", padding:"8px 12px", borderRadius:8, fontSize:12, color:"#f87171", fontFamily:"monospace", overflow:"auto", border:`1px solid rgba(248,113,113,.25)`, margin:0 }}>{shownCase.error}</pre>
                  </>
                )}
              </>
            ) : (
              <div style={{ padding:"14px 16px", background: shownCase.passed ? "rgba(52,211,153,.06)" : "rgba(248,113,113,.06)", border:`1px solid ${shownCase.passed?"rgba(52,211,153,.2)":"rgba(248,113,113,.2)"}`, borderRadius:10 }}>
                <p style={{ fontSize:13, color: shownCase.passed ? "#34d399" : "#f87171", fontWeight:700 }}>
                  {shownCase.passed ? "✓ Hidden test case passed." : "✗ Hidden test case failed."}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  const textColor = verdict === "accepted" ? "#34d399" : verdict === "wrong" ? "#f87171" : "#e6edf3";
  return (
    <div style={{ flex:1, padding:12, overflowY:"auto", background: "#0d1117" }}>
      <pre style={{ color:textColor, fontSize:13, margin:0, whiteSpace:"pre-wrap", wordBreak:"break-word", lineHeight:1.65 }}>
        {output || (isSubmitting ? "⏳ Evaluating…" : "Run or submit to see output here.")}
      </pre>
    </div>
  );
}

// ── Inline Coding Workspace (Terminal Environment) ──────────────
function InlineCodingWorkspace({ item, done, onDone, activeUser, onClose }) {
  const getInitialCode = useCallback((q, lang) => q?.boilerplates?.[lang] || q?.boilerplate || FALLBACK_BOILERPLATE[lang] || "", []);
  
  const [language, setLanguage]         = useState("cpp");
  const [code, setCode]                 = useState(getInitialCode(item, "cpp"));
  const [activeTab, setActiveTab]       = useState("testcase");
  const [stdin, setStdin]               = useState(item?.testCases?.[0]?.input || "");
  const [output, setOutput]             = useState("");
  const [isRunning, setIsRunning]       = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verdict, setVerdict]           = useState(null);
  const [tcResult, setTcResult]         = useState(null);

  const langObj = LANGUAGES.find(l => l.value === language) ?? LANGUAGES[0];

  const handleLang = (lang) => {
    setLanguage(lang);
    setCode(getInitialCode(item, lang));
  };

  const handleRun = async () => {
    if (!code.trim()) return;
    setIsRunning(true); setActiveTab("result");
    setOutput("⏳ Running..."); setVerdict(null); setTcResult(null);
    try {
      if (item?.methodName && stdin) {
        const singleCase = [{ input: stdin, expectedOutput: "" }];
        const fakeQ = { ...item, testCases: singleCase };
        const res = await runWithTestCases(language, code, fakeQ, { visibleCount: 1 });
        const r = res.results[0];
        if (r.error) setOutput(`Error:\n${r.error}`);
        else setOutput(r.actualOutput || "(empty output)");
      } else {
        const r = await executeCode(language, code, stdin, item?.timeLimitMs || 2000);
        let txt = "";
        if (r.compile_output) txt = `Compilation Error:\n${r.compile_output}`;
        else if (r.stderr)    txt = `Runtime Error:\n${r.stderr}`;
        else                  txt = r.stdout || "(empty output)";
        setOutput(txt);
        if (r.status?.id === 3) {
          const matched = item?.testCases?.find(t => t.input === stdin);
          if (matched && r.stdout?.trim() === matched.expectedOutput?.trim()) setVerdict("accepted");
        }
      }
    } catch (e) { setOutput("Execution Error: " + e.message); }
    setIsRunning(false);
  };

  const handleSubmitCoding = async () => {
    if (!item) return;
    setIsSubmitting(true); setActiveTab("result");
    setOutput(""); setVerdict(null); setTcResult(null);

    const testCases = item.testCases?.filter(tc => tc.input?.trim() && tc.expectedOutput?.trim()) || [];
    if (!testCases.length) {
      setOutput("⚠️ No test cases defined for this question.\n\nAsk your faculty to add test cases in the question editor.");
      setIsSubmitting(false); return;
    }

    if (!item.methodName) {
      setOutput(`⚠️ This question doesn't have a method name configured.\n\nRunning with raw stdin mode.\n\nRunning ${testCases.length} test case(s)...`);
      let passed = 0; let logs = "";
      try {
        for (let i = 0; i < testCases.length; i++) {
          const r  = await executeCode(language, code, testCases[i].input, item.timeLimitMs || 2000);
          const ok = r.status?.id === 3 && r.stdout?.trim() === testCases[i].expectedOutput?.trim();
          if (ok) passed++;
          logs += `Test ${i+1}: ${ok ? "✅ Passed" : "❌ Failed"}\n`;
        }
        const all = passed === testCases.length;
        setVerdict(all ? "accepted" : "wrong");
        setOutput(all ? `✅ All ${testCases.length} test cases passed!` : `❌ ${passed}/${testCases.length} passed\n\n${logs}`);
        if (all && !done) onDone();
      } catch (e) { setOutput("Submission Error: " + e.message); }
      setIsSubmitting(false); return;
    }

    try {
      const res = await runWithTestCases(language, code, item);
      setTcResult(res); 
      setVerdict(res.allPassed ? "accepted" : "wrong");
      setOutput(""); 
      
      if (res.allPassed && !done) onDone();

      if (activeUser) {
        try {
          await addDoc(collection(db, "submissions"), {
            studentId:    activeUser.uid,
            questionId:   item.id || item.title,
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

  return (
    <div style={{ marginTop: "1rem", borderRadius: "10px", overflow: "hidden", border: "1px solid #334155", background: "#0d1117" }}>
      {item.description && (
        <div style={{ padding: "16px 20px", background: "#161b22", borderBottom: "1px solid #30363d", color: "#e2e8f0", fontSize: "0.85rem", lineHeight: 1.6 }}
          dangerouslySetInnerHTML={{ __html: item.description }} />
      )}

      <div style={{ height: 46, display: "flex", alignItems: "center", padding: "0 16px", borderBottom: "1px solid #30363d", gap: 12, background: "#161b22" }}>
        <select value={language} onChange={e=>handleLang(e.target.value)}
          style={{ background: "#0d1117", color: "#e2e8f0", border: "1px solid #30363d", borderRadius: 6, padding: "5px 10px", fontSize: 12, cursor: "pointer", fontWeight: 700, outline: "none" }}>
          {LANGUAGES.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
        </select>
        
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <button onClick={onClose} 
            style={{ padding: "6px 12px", borderRadius: 6, fontSize: 12, fontWeight: 700, background: "transparent", border: "1px solid #30363d", color: "#8b949e", cursor: "pointer" }}>
            Close ✖
          </button>
          <button onClick={handleRun} disabled={isRunning||isSubmitting}
            style={{ padding: "6px 16px", borderRadius: 6, fontSize: 12, fontWeight: 700, background: "#21262d", border: "1px solid #30363d", color: "#e2e8f0", cursor: isRunning||isSubmitting?"not-allowed":"pointer", opacity: isRunning||isSubmitting?0.6:1 }}>
            {isRunning ? "⏳ Running…" : "▶ Run"}
          </button>
          <button onClick={handleSubmitCoding} disabled={isRunning||isSubmitting}
            style={{ padding: "6px 16px", borderRadius: 6, fontSize: 12, fontWeight: 700, background: isSubmitting?"#22863a":"#2ea043", color: "#fff", border: "none", cursor: isRunning||isSubmitting?"not-allowed":"pointer", opacity: isRunning||isSubmitting?0.6:1 }}>
            {isSubmitting ? "⏳ Evaluating…" : "Submit"}
          </button>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", height: 500 }}>
        <div style={{ flex: 3, borderBottom: "2px solid #30363d", paddingTop: "10px" }}>
          <Editor
            theme="vs-dark"
            language={langObj.monaco}
            value={code}
            onChange={v => setCode(v??"")}
            options={{ minimap:{enabled:false}, fontSize:14, lineHeight:22, scrollBeyondLastLine:false, tabSize:4 }}
          />
        </div>

        <div style={{ flex: 2, display: "flex", flexDirection: "column", background: "#0d1117" }}>
          <div style={{ display: "flex", borderBottom: "1px solid #30363d", height: 40, alignItems: "center", padding: "0 6px", flexShrink: 0 }}>
            {["testcase","result"].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                style={{ padding: "0 16px", height: "100%", background: "none", border: "none", borderBottom: activeTab===tab?"2px solid #ffa116":"2px solid transparent", color: activeTab===tab?"#fff":"#8b949e", fontSize: 12, fontWeight: activeTab===tab?700:400, cursor: "pointer" }}>
                {tab==="testcase"?"📥 Input":"📤 Output"}
              </button>
            ))}
            {verdict && activeTab==="result" && (
              <span style={{ marginLeft: "auto", marginRight: 8, fontSize: 11, fontWeight: 700, color: verdict==="accepted"?"#34d399":"#f87171" }}>
                {verdict==="accepted"?"✅ AC":"❌ WA"}
              </span>
            )}
          </div>

          <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
            {activeTab==="testcase" ? (
              <div style={{ flex:1, padding:12 }}>
                <textarea value={stdin} onChange={e=>setStdin(e.target.value)}
                  placeholder={item?.methodName ? `Custom input args for Run button (e.g. [2,7,11,15], 9)\nSubmit always runs all ${item?.testCases?.length||0} test cases automatically.` : "Custom input (stdin) for Run button..."}
                  style={{ width: "100%", height: "100%", background: "#0d1117", color: "#e6edf3", border: "none", resize: "none", fontFamily: "'Courier New',monospace", fontSize: 13, outline: "none", lineHeight: 1.65 }} />
              </div>
            ) : (
              tcResult ? (
                <TestResultPanel tcResult={tcResult} output={output} verdict={verdict} isSubmitting={isSubmitting} />
              ) : (
                <div style={{ flex:1, padding:12, overflowY:"auto" }}>
                  <pre style={{ color:"#e6edf3", fontSize:13, margin:0, whiteSpace:"pre-wrap", wordBreak:"break-word", lineHeight:1.65 }}>
                    {output || (isSubmitting?"⏳ Evaluating…":"Run or submit to see output here.")}
                  </pre>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Widget For MCQ ──────────────────────────────────────────────────
function MCQWidget({ item, done, onDone, activeUser, onClose }) {
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(done);
  const [result, setResult] = useState(null);

  const submit = async (idx) => {
    if (submitted) return;
    setSelected(idx);
    setSubmitted(true);
    const correct = idx === item.correctIndex;
    setResult(correct);
    if (!done && correct) onDone();

    if (activeUser) {
      try {
        await addDoc(collection(db, "submissions"), {
          studentId: activeUser.uid, questionId: item.id || item.title,
          answer: item.options?.[idx], type: "practice_mcq",
          status: correct ? "accepted" : "wrong_answer",
          submittedAt: serverTimestamp(),
        });
      } catch (e) { console.error(e); }
    }
  };

  return (
    <div style={{ marginTop: "0.75rem", padding: "1rem", background: "rgba(245,158,11,0.06)", borderRadius: "0.6rem", border: "1px solid rgba(245,158,11,0.2)", position: "relative" }}>
      <button onClick={onClose} style={{ position: "absolute", top: "0.85rem", right: "1rem", background: "none", border: "none", color: "#94a3b8", fontSize: "1.2rem", cursor: "pointer", lineHeight: 1 }}>&times;</button>
      <p style={{ fontSize: "0.85rem", fontWeight: 700, color: "#f59e0b", marginBottom: "0.75rem", paddingRight: "1.5rem" }}>{item.title}</p>
      
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {(item.options || []).map((opt, i) => {
          let bg = "rgba(30,41,59,0.5)", border = "#334155", color = "#cbd5e1";
          if (submitted) {
            if (i === item.correctIndex) { bg = "rgba(16,185,129,0.15)"; border = "#10b981"; color = "#10b981"; }
            else if (i === selected && !result) { bg = "rgba(239,68,68,0.12)"; border = "#ef4444"; color = "#f87171"; }
          }
          return (
            <button key={i} onClick={() => submit(i)} disabled={submitted}
              style={{ padding: "0.6rem 1rem", borderRadius: "0.45rem", background: bg, border: `1px solid ${border}`, color, fontSize: "0.8rem", textAlign: "left", cursor: submitted ? "default" : "pointer", transition: "all .15s" }}>
              {opt}
            </button>
          );
        })}
      </div>
      {submitted && (
        <p style={{ fontSize: "0.75rem", marginTop: "0.75rem", color: result ? "#10b981" : "#f87171", fontWeight: 700 }}>
          {result ? "✓ Correct!" : `✗ Correct answer: ${item.options?.[item.correctIndex]}`}
        </p>
      )}
    </div>
  );
}

// ── Main View Component ──────────────────────────────────────────────
export default function LearningModulesView({ collegeId, T }) {
  const { currentUser } = useAuth();
  const [languages, setLanguages]         = useState([]);
  const [loading, setLoading]             = useState(true);
  const [expandedLang, setExpandedLang]   = useState(null);
  const [expandedTopic, setExpandedTopic] = useState(null);
  const [expandedItem, setExpandedItem]   = useState(null);
  const [progress, setProgress]           = useState({});

  // PPT viewer state — tracks which URL is open (null = closed)
  const [pptViewerUrl, setPptViewerUrl]   = useState(null);

  useEffect(() => {
    const fetchLangs = async () => {
      setLoading(true);
      try {
        const snap = await getDocs(collection(db, "categories"));
        const modules = snap.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .filter(m => m.moduleType === "Learning Module");
        setLanguages(modules);
      } catch (e) { console.error(e); }
      setLoading(false);
    };
    fetchLangs();
  }, []);

  useEffect(() => {
    if (!currentUser) return;
    const fetchProgress = async () => {
      try {
        const snap = await getDoc(doc(db, "learningProgress", currentUser.uid));
        if (snap.exists()) setProgress(snap.data() || {});
      } catch (e) { console.error(e); }
    };
    fetchProgress();
  }, [currentUser]);

  const markDone = async (key) => {
    if (!currentUser || progress[key]) return;
    const updated = { ...progress, [key]: true };
    setProgress(updated);
    try {
      await setDoc(doc(db, "learningProgress", currentUser.uid), updated, { merge: true });
    } catch (e) { console.error(e); }
  };

  const topicProgress = (langId, topicIdx, topic) => {
    const items = topic.content || [];
    if (!items.length) return 0;
    const done = items.filter((_, ci) => progress[`${langId}_${topicIdx}_${ci}`]).length;
    return Math.round((done / items.length) * 100);
  };

  const langProgress = (lang) => {
    const topics = lang.topics || [];
    if (!topics.length) return 0;
    const pcts = topics.map((t, ti) => topicProgress(lang.id, ti, t));
    return Math.round(pcts.reduce((a, b) => a + b, 0) / pcts.length);
  };

  const isDark = T.bg === "#0d1117" || T.bg?.includes("0d");

  if (loading) {
    return (
      <div className="section-enter" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "40vh", gap: "1rem" }}>
        <div style={{ width: 36, height: 36, border: "3px solid #d1fae5", borderTop: "3px solid #22c55e", borderRadius: "50%", animation: "spin .8s linear infinite" }} />
        <span style={{ fontSize: "0.85rem", color: T.textFaint }}>Loading learning modules…</span>
      </div>
    );
  }

  if (!languages.length) {
    return (
      <div className="section-enter" style={{ textAlign: "center", padding: "5rem 2rem" }}>
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📚</div>
        <div style={{ fontWeight: 800, fontSize: "1.2rem", color: T.text, marginBottom: "0.5rem" }}>No Learning Modules Yet</div>
        <div style={{ color: T.textFaint, fontSize: "0.88rem" }}>Your instructor hasn't published any learning content yet. Check back soon!</div>
      </div>
    );
  }

  return (
    <div className="section-enter">
      {/* PPT Viewer Modal — rendered at root level so it covers full screen */}
      {pptViewerUrl && (
        <PPTViewerModal url={pptViewerUrl} onClose={() => setPptViewerUrl(null)} />
      )}

      <div style={{ marginBottom: "1.75rem" }}>
        <h2 style={{ fontWeight: 800, fontSize: "1.75rem", color: T.text }}>📚 Learning Modules</h2>
        <p style={{ fontSize: "0.85rem", color: T.textFaint, marginTop: "0.35rem" }}>
          {languages.length} module{languages.length !== 1 ? "s" : ""} · Track your topic-by-topic progress
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {languages.map((lang) => {
          const isLangOpen = expandedLang === lang.id;
          const lPct       = langProgress(lang);
          const lDone      = lPct === 100;
          const topics     = lang.topics || [];

          return (
            <div key={lang.id} style={{
              background: T.bgCard, border: `1px solid ${isLangOpen ? "#22c55e60" : T.border}`,
              borderRadius: "14px", overflow: "hidden",
              boxShadow: isLangOpen ? "0 0 0 3px rgba(34,197,94,0.10)" : "none",
              transition: "all .2s",
            }}>
              <button
                onClick={() => setExpandedLang(isLangOpen ? null : lang.id)}
                style={{ width: "100%", display: "flex", alignItems: "center", gap: "1rem", padding: "1.125rem 1.5rem", background: "transparent", border: "none", cursor: "pointer", textAlign: "left" }}
              >
                <div style={{ position: "relative", flexShrink: 0 }}>
                  {lDone ? <CheckIcon size={44} color="#22c55e" /> : (
                    <div style={{ position: "relative", width: 44, height: 44 }}>
                      <CircleProgress percent={lPct} size={44} stroke={4} color="#22c55e" trackColor={isDark ? "#21262d" : "#e5e7eb"} />
                      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" }}>
                        {LANG_ICON(lang.name)}
                      </div>
                    </div>
                  )}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, fontSize: "1.05rem", color: T.text }}>{lang.name}</div>
                  <div style={{ fontSize: "0.75rem", color: T.textFaint, marginTop: "0.2rem" }}>
                    {topics.length} topic{topics.length !== 1 ? "s" : ""}
                    {lPct > 0 && <span style={{ marginLeft: "0.5rem", color: "#22c55e", fontWeight: 700 }}>· {lPct}% complete</span>}
                  </div>
                </div>

                <div style={{ width: 100, flexShrink: 0 }}>
                  <div style={{ height: 6, borderRadius: 99, background: isDark ? "#21262d" : "#e5e7eb", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${lPct}%`, background: "#22c55e", borderRadius: 99, transition: "width .8s ease" }} />
                  </div>
                  <div style={{ fontSize: "0.65rem", color: T.textFaint, textAlign: "right", marginTop: "0.25rem" }}>{lPct}%</div>
                </div>

                <div style={{
                  width: 26, height: 26, borderRadius: "6px", flexShrink: 0,
                  background: isLangOpen ? "rgba(34,197,94,0.12)" : T.bgHover,
                  border: `1px solid ${isLangOpen ? "#22c55e40" : T.border}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: isLangOpen ? "#22c55e" : T.textFaint,
                  transform: isLangOpen ? "rotate(180deg)" : "none", transition: "all .2s", fontSize: "0.7rem",
                }}>▼</div>
              </button>

              {isLangOpen && (
                <div style={{ borderTop: `1px solid ${T.border}` }}>
                  {topics.length === 0 ? (
                    <div style={{ padding: "2rem", textAlign: "center", color: T.textFaint, fontSize: "0.85rem" }}>No topics added yet.</div>
                  ) : topics.map((topic, topicIdx) => {
                    const topicKey  = `${lang.id}-${topicIdx}`;
                    const isOpen    = expandedTopic === topicKey;
                    const pct       = topicProgress(lang.id, topicIdx, topic);
                    const isDone    = pct === 100;

                    const sortedContent = (topic.content || [])
                      .map((item, originalIndex) => ({ item, originalIndex }))
                      .sort((a, b) => {
                        const TYPE_ORDER = { ppt: 1, mcq: 2, coding: 3 };
                        const orderA = TYPE_ORDER[a.item.type] || 99;
                        const orderB = TYPE_ORDER[b.item.type] || 99;
                        return orderA - orderB;
                      });

                    const hasContent = sortedContent.length > 0;

                    return (
                      <div key={topicIdx} style={{ borderBottom: topicIdx < topics.length - 1 ? `1px solid ${T.border}` : "none" }}>
                        <button
                          onClick={() => setExpandedTopic(isOpen ? null : topicKey)}
                          style={{ width: "100%", display: "flex", alignItems: "center", gap: "1rem", padding: "0.9rem 1.5rem 0.9rem 2rem", background: "transparent", border: "none", cursor: "pointer", textAlign: "left", transition: "background .15s" }}
                          onMouseEnter={e => e.currentTarget.style.background = T.bgHover}
                          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                        >
                          {isDone ? <CheckIcon size={34} color="#22c55e" /> : (
                            <div style={{ position: "relative", width: 34, height: 34 }}>
                              <CircleProgress percent={pct} size={34} stroke={3} color="#22c55e" trackColor={isDark ? "#21262d" : "#e5e7eb"} />
                            </div>
                          )}
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: "0.6rem", color: T.textFaint, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "0.15rem" }}>TOPIC</div>
                            <div style={{ fontWeight: 700, fontSize: "0.92rem", color: T.text }}>{topic.name}</div>
                          </div>
                          {hasContent && (
                            <div style={{ fontSize: "0.72rem", color: T.textFaint, textAlign: "right", flexShrink: 0 }}>
                              {(topic.content || []).filter((_, ci) => progress[`${lang.id}_${topicIdx}_${ci}`]).length} / {topic.content.length} done
                            </div>
                          )}
                          <span style={{ color: T.textFaint, fontSize: "0.75rem", flexShrink: 0 }}>›</span>
                        </button>

                        {isOpen && (
                          <div style={{ background: isDark ? "rgba(22,27,34,0.6)" : "#f9fafb", borderTop: `1px solid ${T.border}` }}>
                            {!hasContent ? (
                              <div style={{ padding: "1.25rem 2rem", color: T.textFaint, fontSize: "0.82rem" }}>No content yet for this topic.</div>
                            ) : (
                              <div style={{ display: "flex", flexDirection: "column" }}>
                                {sortedContent.map(({ item, originalIndex }, arrayIndex) => {
                                  const progressKey = `${lang.id}_${topicIdx}_${originalIndex}`;
                                  const done        = !!progress[progressKey];
                                  const tag         = TAG_COLORS[item.type] || TAG_COLORS.lesson;
                                  const mins        = EST_MINS[item.type] || 20;
                                  const itemKey     = `${lang.id}-${topicIdx}-${originalIndex}`;
                                  const isItemOpen  = expandedItem === itemKey;

                                  return (
                                    <div key={originalIndex} style={{
                                      padding: "0.875rem 1.5rem 0.875rem 2rem",
                                      borderTop: arrayIndex > 0 ? `1px solid ${T.border}` : "none",
                                      background: done ? (isDark ? "rgba(34,197,94,0.04)" : "rgba(34,197,94,0.03)") : "transparent",
                                      transition: "background .2s",
                                    }}>
                                      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                                        <div style={{
                                          width: 26, height: 26, borderRadius: "50%", flexShrink: 0,
                                          border: `2px solid ${done ? "#22c55e" : isDark ? "#30363d" : "#d1d5db"}`,
                                          background: done ? "#22c55e" : "transparent",
                                          display: "flex", alignItems: "center", justifyContent: "center", transition: "all .2s",
                                        }}>
                                          {done && (
                                            <svg width="11" height="9" viewBox="0 0 12 10" fill="none">
                                              <polyline points="1,5 4.5,8.5 11,1" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                          )}
                                        </div>

                                        <ContentTypeIcon type={item.type} />

                                        <div style={{ flex: 1, minWidth: 0 }}>
                                          <div style={{ fontSize: "0.88rem", fontWeight: 600, color: done ? T.textFaint : T.text, textDecoration: done ? "line-through" : "none", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                            {item.title || item.question || "Untitled"}
                                          </div>
                                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.2rem" }}>
                                            <span style={{ fontSize: "0.7rem", color: T.textFaint }}>{mins} Mins</span>
                                            <span style={{ fontSize: "0.65rem", fontWeight: 700, padding: "0.1rem 0.5rem", borderRadius: "99px", background: tag.bg, color: tag.color }}>{tag.label}</span>
                                          </div>
                                        </div>

                                        {/* ── Action Buttons ── */}
                                        {item.type === "ppt" ? (
                                          // ── PPT: open in-app viewer modal (no new tab, no download) ──
                                          <button
                                            onClick={() => {
                                              if (!done) markDone(progressKey);
                                              setPptViewerUrl(item.downloadUrl);
                                            }}
                                            style={{
                                              fontSize: "0.7rem", fontWeight: 700, padding: "0.3rem 0.75rem", borderRadius: "6px",
                                              background: done ? "rgba(34,197,94,0.12)" : (isDark ? "rgba(30,41,59,0.8)" : "#f1f5f9"),
                                              color: done ? "#22c55e" : T.textMuted,
                                              border: `1px solid ${done ? "rgba(34,197,94,0.3)" : T.border}`,
                                              cursor: "pointer", flexShrink: 0,
                                            }}
                                          >
                                            {done ? "✓ Viewed" : "View 📊"}
                                          </button>
                                        ) : item.type === "mcq" ? (
                                          <button
                                            onClick={() => setExpandedItem(isItemOpen ? null : itemKey)}
                                            style={{
                                              fontSize: "0.7rem", fontWeight: 700, padding: "0.3rem 0.75rem", borderRadius: "6px",
                                              background: done ? "rgba(34,197,94,0.12)" : "rgba(245,158,11,0.1)",
                                              color: done ? "#22c55e" : "#f59e0b",
                                              border: `1px solid ${done ? "rgba(34,197,94,0.3)" : "rgba(245,158,11,0.3)"}`,
                                              cursor: "pointer", flexShrink: 0,
                                            }}
                                          >
                                            {done ? "✓ Review" : isItemOpen ? "Close ▲" : "Answer ▼"}
                                          </button>
                                        ) : item.type === "coding" && (
                                          <button
                                            onClick={() => setExpandedItem(isItemOpen ? null : itemKey)}
                                            style={{
                                              fontSize: "0.7rem", fontWeight: 700, padding: "0.3rem 0.75rem", borderRadius: "6px",
                                              background: done ? "rgba(34,197,94,0.12)" : "rgba(16,185,129,0.1)",
                                              color: done ? "#22c55e" : "#10b981",
                                              border: `1px solid ${done ? "rgba(34,197,94,0.3)" : "rgba(16,185,129,0.3)"}`,
                                              cursor: "pointer", flexShrink: 0,
                                            }}
                                          >
                                            {done ? "✓ Review" : isItemOpen ? "Close ▲" : "Solve 💻"}
                                          </button>
                                        )}
                                      </div>

                                      {/* Expanded Inline Widgets (MCQ / Coding only) */}
                                      {isItemOpen && item.type === "mcq" && (
                                        <MCQWidget item={item} done={done} onDone={() => markDone(progressKey)} activeUser={currentUser} onClose={() => setExpandedItem(null)} />
                                      )}
                                      {isItemOpen && item.type === "coding" && (
                                        <InlineCodingWorkspace item={item} done={done} onDone={() => markDone(progressKey)} activeUser={currentUser} onClose={() => setExpandedItem(null)} />
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}