// // // import React, { useState, useEffect, useRef } from 'react';
// // // import {
// // //   collection, getDocs, addDoc, updateDoc, deleteDoc,
// // //   doc, serverTimestamp, query, orderBy
// // // } from 'firebase/firestore';
// // // import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
// // // import { db, storage } from '../../firebase/config';
// // // import DeleteButton from '../ui/DeleteButton';

// // // const CONTENT_TYPES = [
// // //   { key: 'lesson', label: 'Intro Lesson',   icon: '📖', color: '#3b82f6', tag: 'Learning' },
// // //   { key: 'mcq',    label: 'MCQ Practice',    icon: '📋', color: '#f59e0b', tag: 'Practice' },
// // //   { key: 'coding', label: 'Coding Question', icon: '💻', color: '#10b981', tag: 'Coding'   },
// // //   { key: 'ppt',    label: 'PPT Slides',      icon: '📊', color: '#8b5cf6', tag: 'Slides'   },
// // // ];

// // // const LANG_ICONS = { Python:'🐍', Java:'☕', JavaScript:'🟨', C:'⚙️', 'C++':'⚡', SQL:'🗄️', default:'📘' };

// // // const iStyle = { flex:1, background:'#0f172a', border:'1px solid #334155', borderRadius:'0.6rem', padding:'0.55rem 0.875rem', color:'#f1f5f9', fontSize:'0.82rem', outline:'none' };
// // // const bStyle = (color='#3b82f6', extra={}) => ({ padding:'0.5rem 1.1rem', borderRadius:'0.6rem', background:color, color:'#fff', fontWeight:800, fontSize:'0.75rem', border:'none', cursor:'pointer', whiteSpace:'nowrap', ...extra });
// // // const cardS  = (border='#1e293b') => ({ background:'rgba(15,23,42,0.6)', border:`1px solid ${border}`, borderRadius:'0.875rem', overflow:'hidden', transition:'border-color 0.2s' });
// // // const pillS  = (color) => ({ fontSize:'0.6rem', fontWeight:800, padding:'0.15rem 0.55rem', borderRadius:'999px', background:`${color}22`, color, letterSpacing:'0.06em', flexShrink:0 });

// // // /* ── PPT Uploader ─────────────────────────────────────────────────────────── */
// // // function PPTUploader({ langId, topicIdx, onUploaded }) {
// // //   const fileRef = useRef();
// // //   const [uploading, setUploading] = useState(false);
// // //   const [progress, setProgress]   = useState(0);
// // //   const [pptTitle, setPptTitle]   = useState('');
// // //   const [file, setFile]           = useState(null);
// // //   const [err, setErr]             = useState('');

// // //   const pick = (e) => {
// // //     const f = e.target.files[0];
// // //     if (!f) return;
// // //     if (!f.name.match(/\.(pptx?|ppt)$/i)) { setErr('Only .ppt / .pptx files allowed.'); return; }
// // //     setErr(''); setFile(f);
// // //     if (!pptTitle) setPptTitle(f.name.replace(/\.(pptx?|ppt)$/i, ''));
// // //   };

// // //   const upload = () => {
// // //     if (!file) { setErr('Choose a file first.'); return; }
// // //     if (!pptTitle.trim()) { setErr('Enter a title.'); return; }
// // //     setUploading(true); setErr('');
// // //     const sRef = ref(storage, `learning_ppts/${langId}/topic_${topicIdx}/${Date.now()}_${file.name}`);
// // //     const task = uploadBytesResumable(sRef, file);
// // //     task.on('state_changed',
// // //       s => setProgress(Math.round((s.bytesTransferred / s.totalBytes) * 100)),
// // //       e => { setErr('Upload failed.'); setUploading(false); console.error(e); },
// // //       () => getDownloadURL(task.snapshot.ref).then(url => {
// // //         onUploaded({ type:'ppt', title:pptTitle.trim(), fileName:file.name, fileSize:(file.size/1024/1024).toFixed(2)+' MB', downloadUrl:url, storagePath:task.snapshot.ref.fullPath });
// // //         setPptTitle(''); setFile(null); setProgress(0); setUploading(false);
// // //         if (fileRef.current) fileRef.current.value = '';
// // //       })
// // //     );
// // //   };

// // //   return (
// // //     <div style={{ background:'rgba(139,92,246,0.06)', border:'1px solid rgba(139,92,246,0.2)', borderRadius:'0.75rem', padding:'0.875rem', marginTop:'0.5rem' }}>
// // //       <p style={{ fontSize:'0.6rem', fontWeight:900, color:'#a78bfa', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:'0.6rem' }}>📊 Upload PPT Slides</p>
// // //       <div style={{ display:'flex', gap:'0.5rem', marginBottom:'0.6rem', flexWrap:'wrap' }}>
// // //         <input ref={fileRef} type="file" accept=".ppt,.pptx" onChange={pick} style={{ display:'none' }} id={`ppt-${langId}-${topicIdx}`} />
// // //         <label htmlFor={`ppt-${langId}-${topicIdx}`} style={bStyle('rgba(139,92,246,0.2)', { border:'1px solid rgba(139,92,246,0.4)', color:'#a78bfa', cursor:'pointer' })}>📎 Choose File</label>
// // //         {file && <span style={{ fontSize:'0.75rem', color:'#94a3b8', alignSelf:'center', fontFamily:'monospace' }}>{file.name} ({(file.size/1024/1024).toFixed(2)} MB)</span>}
// // //       </div>
// // //       <div style={{ display:'flex', gap:'0.5rem', marginBottom:'0.6rem' }}>
// // //         <input value={pptTitle} onChange={e => setPptTitle(e.target.value)} placeholder="Presentation title" style={{ ...iStyle, fontSize:'0.78rem' }} />
// // //         <button onClick={upload} disabled={uploading || !file} style={bStyle('#8b5cf6', { opacity: uploading||!file ? 0.5:1 })}>{uploading ? `${progress}%` : '⬆ Upload'}</button>
// // //       </div>
// // //       {uploading && <div style={{ background:'#1e293b', borderRadius:'999px', height:'6px', overflow:'hidden' }}><div style={{ height:'100%', width:`${progress}%`, background:'linear-gradient(90deg,#8b5cf6,#6366f1)', transition:'width 0.3s', borderRadius:'999px' }} /></div>}
// // //       {err && <p style={{ fontSize:'0.72rem', color:'#f87171', marginTop:'0.4rem' }}>{err}</p>}
// // //     </div>
// // //   );
// // // }

// // // /* ── Main ─────────────────────────────────────────────────────────────────── */
// // // export default function LearningModules() {
// // //   const [languages, setLanguages]         = useState([]);
// // //   const [expandedLang, setExpandedLang]   = useState(null);
// // //   const [expandedTopic, setExpandedTopic] = useState(null);
// // //   const [loading, setLoading]             = useState(true);
// // //   const [newLang, setNewLang]             = useState('');
// // //   const [newTopics, setNewTopics]         = useState({});
// // //   const [newSubtopics, setNewSubtopics]   = useState({});
// // //   const [newContent, setNewContent]       = useState({});
// // //   const [creatingLang, setCreatingLang]   = useState(false);
// // //   const [pptKey, setPptKey]               = useState(null);

// // //   const fetch = async () => {
// // //     setLoading(true);
// // //     try {
// // //       const snap = await getDocs(query(collection(db, 'learningLanguages'), orderBy('createdAt')));
// // //       setLanguages(snap.docs.map(d => ({ id: d.id, ...d.data() })));
// // //     } catch(e) { console.error(e); }
// // //     setLoading(false);
// // //   };

// // //   useEffect(() => { fetch(); }, []);

// // //   /* ── Delete language (entire doc) ── */
// // //   const deleteLang = async (lang) => {
// // //     await deleteDoc(doc(db, 'learningLanguages', lang.id));
// // //     if (expandedLang === lang.id) setExpandedLang(null);
// // //     await fetch();
// // //   };

// // //   /* ── Delete topic ── */
// // //   const deleteTopic = async (lang, topicIdx) => {
// // //     const topics = lang.topics.filter((_, i) => i !== topicIdx);
// // //     await updateDoc(doc(db, 'learningLanguages', lang.id), { topics });
// // //     const key = `${lang.id}-${topicIdx}`;
// // //     if (expandedTopic === key) setExpandedTopic(null);
// // //     await fetch();
// // //   };

// // //   /* ── Delete subtopic ── */
// // //   const deleteSubtopic = async (lang, topicIdx, subIdx) => {
// // //     const topics = lang.topics.map((t, i) =>
// // //       i === topicIdx ? { ...t, subtopics: t.subtopics.filter((_, si) => si !== subIdx) } : t
// // //     );
// // //     await updateDoc(doc(db, 'learningLanguages', lang.id), { topics });
// // //     await fetch();
// // //   };

// // //   /* ── Delete content item ── */
// // //   const deleteContent = async (lang, topicIdx, contentIdx) => {
// // //     const item = lang.topics[topicIdx].content[contentIdx];
// // //     // If PPT, also delete from Firebase Storage
// // //     if (item.type === 'ppt' && item.storagePath) {
// // //       try { await deleteObject(ref(storage, item.storagePath)); } catch(e) { console.warn('Storage delete failed:', e); }
// // //     }
// // //     const topics = lang.topics.map((t, i) =>
// // //       i === topicIdx ? { ...t, content: t.content.filter((_, ci) => ci !== contentIdx) } : t
// // //     );
// // //     await updateDoc(doc(db, 'learningLanguages', lang.id), { topics });
// // //     await fetch();
// // //   };

// // //   /* ── Create language ── */
// // //   const createLang = async () => {
// // //     if (!newLang.trim()) return;
// // //     setCreatingLang(true);
// // //     try { await addDoc(collection(db, 'learningLanguages'), { name: newLang.trim(), topics: [], createdAt: serverTimestamp() }); setNewLang(''); await fetch(); }
// // //     catch { alert('Failed to create language.'); }
// // //     setCreatingLang(false);
// // //   };

// // //   /* ── Add topic ── */
// // //   const addTopic = async (lang) => {
// // //     const name = (newTopics[lang.id] || '').trim();
// // //     if (!name) return;
// // //     await updateDoc(doc(db, 'learningLanguages', lang.id), { topics: [...(lang.topics||[]), { name, subtopics:[], content:[] }] });
// // //     setNewTopics(p => ({ ...p, [lang.id]:'' }));
// // //     await fetch();
// // //   };

// // //   /* ── Add subtopic ── */
// // //   const addSubtopic = async (lang, topicIdx) => {
// // //     const key  = `${lang.id}-${topicIdx}`;
// // //     const name = (newSubtopics[key] || '').trim();
// // //     if (!name) return;
// // //     const topics = lang.topics.map((t, i) => i === topicIdx ? { ...t, subtopics: [...(t.subtopics||[]), name] } : t);
// // //     await updateDoc(doc(db, 'learningLanguages', lang.id), { topics });
// // //     setNewSubtopics(p => ({ ...p, [key]:'' }));
// // //     await fetch();
// // //   };

// // //   /* ── Add content item ── */
// // //   const addContent = async (lang, topicIdx) => {
// // //     const key  = `${lang.id}-${topicIdx}`;
// // //     const item = newContent[key];
// // //     if (!item?.title?.trim() || !item?.type) return;
// // //     const topics = lang.topics.map((t, i) => i === topicIdx ? { ...t, content: [...(t.content||[]), { type:item.type, title:item.title.trim(), duration:item.duration||'20 Mins', createdAt:new Date().toISOString() }] } : t);
// // //     await updateDoc(doc(db, 'learningLanguages', lang.id), { topics });
// // //     setNewContent(p => ({ ...p, [key]:{ type:'', title:'', duration:'' } }));
// // //     await fetch();
// // //   };

// // //   /* ── PPT uploaded ── */
// // //   const handlePPTUploaded = async (lang, topicIdx, pptItem) => {
// // //     const topics = lang.topics.map((t, i) => i === topicIdx ? { ...t, content: [...(t.content||[]), { ...pptItem, createdAt:new Date().toISOString() }] } : t);
// // //     await updateDoc(doc(db, 'learningLanguages', lang.id), { topics });
// // //     setPptKey(null);
// // //     await fetch();
// // //   };

// // //   const langIcon = (name) => LANG_ICONS[name] || LANG_ICONS.default;
// // //   const contentCfg = (type) => CONTENT_TYPES.find(c => c.key === type) || CONTENT_TYPES[0];

// // //   /* ── RENDER ─────────────────────────────────────────────────────────────── */
// // //   return (
// // //     <div>
// // //       {/* Header */}
// // //       <div style={{ marginBottom:'1.5rem' }}>
// // //         <h2 style={{ fontSize:'1.25rem', fontWeight:900, color:'#f1f5f9', margin:0 }}>Learning Modules</h2>
// // //         <p style={{ fontSize:'0.75rem', color:'#64748b', marginTop:'0.2rem' }}>Language → Topic → Subtopics · Learn · Practice · Test · 📊 Slides</p>
// // //       </div>

// // //       {/* Create language */}
// // //       <div style={{ ...cardS('#1e3a5f'), padding:'1.25rem', marginBottom:'1.5rem' }}>
// // //         <p style={{ fontSize:'0.6rem', fontWeight:900, color:'#64748b', letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:'0.75rem' }}>+ Create Language</p>
// // //         <div style={{ display:'flex', gap:'0.75rem' }}>
// // //           <input value={newLang} onChange={e => setNewLang(e.target.value)} onKeyDown={e => e.key==='Enter' && createLang()} placeholder="e.g., Python, Java, SQL" style={iStyle} />
// // //           <button onClick={createLang} disabled={creatingLang} style={bStyle()}>{creatingLang ? '...' : 'Create'}</button>
// // //         </div>
// // //       </div>

// // //       {/* Language list */}
// // //       {loading ? (
// // //         <div style={{ textAlign:'center', padding:'3rem', color:'#475569' }}>Loading...</div>
// // //       ) : languages.length === 0 ? (
// // //         <div style={{ textAlign:'center', padding:'4rem', color:'#334155' }}>
// // //           <p style={{ fontSize:'2.5rem' }}>📘</p>
// // //           <p style={{ fontWeight:700, color:'#64748b', marginTop:'0.5rem' }}>No languages yet. Create one above.</p>
// // //         </div>
// // //       ) : (
// // //         <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
// // //           {languages.map(lang => {
// // //             const isLangOpen = expandedLang === lang.id;
// // //             return (
// // //               <div key={lang.id} style={cardS(isLangOpen ? '#3b82f6' : '#1e293b')}>

// // //                 {/* Language header */}
// // //                 <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'1rem 1.25rem' }}>
// // //                   {/* Left — click to expand */}
// // //                   <div onClick={() => setExpandedLang(isLangOpen ? null : lang.id)}
// // //                     style={{ display:'flex', alignItems:'center', gap:'0.75rem', flex:1, cursor:'pointer' }}>
// // //                     <span style={{ fontSize:'1.5rem' }}>{langIcon(lang.name)}</span>
// // //                     <div>
// // //                       <p style={{ fontWeight:900, fontSize:'1rem', color:'#f1f5f9', margin:0 }}>{lang.name}</p>
// // //                       <p style={{ fontSize:'0.65rem', color:'#64748b', margin:0 }}>{lang.topics?.length || 0} topics</p>
// // //                     </div>
// // //                     {/* Topic pills */}
// // //                     <div style={{ display:'flex', gap:'0.35rem', flexWrap:'wrap', marginLeft:'0.5rem' }}>
// // //                       {lang.topics?.slice(0,3).map((t,i) => (
// // //                         <span key={i} style={{ fontSize:'0.62rem', padding:'0.15rem 0.55rem', borderRadius:'999px', background:'rgba(59,130,246,0.12)', color:'#60a5fa', border:'1px solid rgba(59,130,246,0.25)', fontWeight:700 }}>{t.name}</span>
// // //                       ))}
// // //                       {lang.topics?.length > 3 && <span style={{ fontSize:'0.62rem', color:'#475569' }}>+{lang.topics.length-3}</span>}
// // //                     </div>
// // //                   </div>
// // //                   {/* Right — chevron + DELETE language */}
// // //                   <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', flexShrink:0 }}>
// // //                     <span onClick={() => setExpandedLang(isLangOpen ? null : lang.id)}
// // //                       style={{ color:'#475569', fontSize:'0.8rem', display:'inline-block', transform:isLangOpen?'rotate(180deg)':'rotate(0)', transition:'transform 0.2s', cursor:'pointer' }}>▼</span>
// // //                     <DeleteButton
// // //                       itemName={`language "${lang.name}" and all its topics`}
// // //                       onConfirm={() => deleteLang(lang)}
// // //                     />
// // //                   </div>
// // //                 </div>

// // //                 {/* Language body */}
// // //                 {isLangOpen && (
// // //                   <div style={{ borderTop:'1px solid #1e293b', padding:'1.25rem' }}>

// // //                     {/* Topics */}
// // //                     <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem', marginBottom:'1rem' }}>
// // //                       {!lang.topics?.length ? (
// // //                         <p style={{ color:'#475569', fontSize:'0.8rem' }}>No topics yet.</p>
// // //                       ) : lang.topics.map((topic, topicIdx) => {
// // //                         const topicKey   = `${lang.id}-${topicIdx}`;
// // //                         const isTopicOpen = expandedTopic === topicKey;
// // //                         const pptCount   = topic.content?.filter(c => c.type==='ppt').length || 0;

// // //                         return (
// // //                           <div key={topicIdx} style={{ background:'rgba(30,41,59,0.6)', border:'1px solid #334155', borderRadius:'0.75rem', overflow:'hidden' }}>

// // //                             {/* Topic header */}
// // //                             <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'0.75rem 1rem' }}>
// // //                               <div onClick={() => setExpandedTopic(isTopicOpen ? null : topicKey)}
// // //                                 style={{ display:'flex', alignItems:'center', gap:'0.6rem', flex:1, cursor:'pointer' }}>
// // //                                 <div style={{ width:'1.4rem', height:'1.4rem', borderRadius:'50%', background:topic.content?.length?'#10b981':'#1e293b', border:`2px solid ${topic.content?.length?'#10b981':'#334155'}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
// // //                                   {topic.content?.length ? <span style={{ fontSize:'0.55rem', color:'#fff' }}>✓</span> : null}
// // //                                 </div>
// // //                                 <div>
// // //                                   <p style={{ fontWeight:800, fontSize:'0.875rem', color:'#e2e8f0', margin:0 }}>
// // //                                     <span style={{ fontSize:'0.58rem', color:'#64748b', marginRight:'0.35rem', textTransform:'uppercase', letterSpacing:'0.08em' }}>TOPIC</span>
// // //                                     {topic.name}
// // //                                   </p>
// // //                                   <p style={{ fontSize:'0.62rem', color:'#64748b', margin:0 }}>
// // //                                     {topic.subtopics?.length||0} subtopics · {topic.content?.length||0} items
// // //                                     {pptCount>0 && <span style={{ marginLeft:'0.35rem', color:'#a78bfa' }}>· 📊 {pptCount}</span>}
// // //                                   </p>
// // //                                 </div>
// // //                               </div>
// // //                               {/* DELETE topic + chevron */}
// // //                               <div style={{ display:'flex', alignItems:'center', gap:'0.4rem', flexShrink:0 }}>
// // //                                 <span onClick={() => setExpandedTopic(isTopicOpen ? null : topicKey)}
// // //                                   style={{ color:'#475569', fontSize:'0.75rem', transform:isTopicOpen?'rotate(180deg)':'rotate(0)', transition:'transform 0.2s', cursor:'pointer', display:'inline-block' }}>▼</span>
// // //                                 <DeleteButton
// // //                                   itemName={`topic "${topic.name}"`}
// // //                                   onConfirm={() => deleteTopic(lang, topicIdx)}
// // //                                 />
// // //                               </div>
// // //                             </div>

// // //                             {/* Topic body */}
// // //                             {isTopicOpen && (
// // //                               <div style={{ borderTop:'1px solid #1e293b', padding:'1rem' }}>

// // //                                 {/* Subtopics */}
// // //                                 <div style={{ marginBottom:'1.25rem' }}>
// // //                                   <p style={{ fontSize:'0.6rem', fontWeight:900, color:'#475569', letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:'0.6rem' }}>Subtopics</p>
// // //                                   <div style={{ display:'flex', flexWrap:'wrap', gap:'0.4rem', marginBottom:'0.6rem' }}>
// // //                                     {!topic.subtopics?.length ? (
// // //                                       <span style={{ fontSize:'0.75rem', color:'#475569' }}>No subtopics yet.</span>
// // //                                     ) : topic.subtopics.map((sub, si) => (
// // //                                       <div key={si} style={{ display:'inline-flex', alignItems:'center', gap:'0.3rem', padding:'0.2rem 0.3rem 0.2rem 0.65rem', borderRadius:'0.4rem', background:'rgba(99,102,241,0.12)', border:'1px solid rgba(99,102,241,0.25)' }}>
// // //                                         <span style={{ fontSize:'0.72rem', fontWeight:700, color:'#818cf8' }}>{sub}</span>
// // //                                         {/* DELETE subtopic — tiny X */}
// // //                                         <button
// // //                                           onClick={() => {
// // //                                             if (window.confirm(`Delete subtopic "${sub}"?`)) deleteSubtopic(lang, topicIdx, si);
// // //                                           }}
// // //                                           title="Delete subtopic"
// // //                                           style={{ background:'none', border:'none', color:'#64748b', cursor:'pointer', fontSize:'0.7rem', padding:'0 0.1rem', lineHeight:1, fontWeight:900 }}
// // //                                           onMouseEnter={e => e.currentTarget.style.color='#f87171'}
// // //                                           onMouseLeave={e => e.currentTarget.style.color='#64748b'}
// // //                                         >✕</button>
// // //                                       </div>
// // //                                     ))}
// // //                                   </div>
// // //                                   <div style={{ display:'flex', gap:'0.5rem' }}>
// // //                                     <input value={newSubtopics[topicKey]||''} onChange={e => setNewSubtopics(p=>({...p,[topicKey]:e.target.value}))} onKeyDown={e => e.key==='Enter' && addSubtopic(lang,topicIdx)} placeholder={`Add subtopic to ${topic.name}`} style={{ ...iStyle, fontSize:'0.78rem' }} />
// // //                                     <button onClick={() => addSubtopic(lang,topicIdx)} style={{ ...bStyle('#6366f1'), padding:'0.45rem 0.875rem', fontSize:'0.7rem' }}>+ Subtopic</button>
// // //                                   </div>
// // //                                 </div>

// // //                                 {/* Content items */}
// // //                                 <div>
// // //                                   <p style={{ fontSize:'0.6rem', fontWeight:900, color:'#475569', letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:'0.6rem' }}>Content — Learn · Practice · Test · Slides</p>

// // //                                   <div style={{ display:'flex', flexDirection:'column', gap:'0.4rem', marginBottom:'0.75rem' }}>
// // //                                     {!topic.content?.length ? (
// // //                                       <p style={{ fontSize:'0.75rem', color:'#475569' }}>No content yet.</p>
// // //                                     ) : topic.content.map((item, ci) => {
// // //                                       const cfg = contentCfg(item.type);
// // //                                       return (
// // //                                         <div key={ci} style={{ display:'flex', alignItems:'center', gap:'0.75rem', padding:'0.6rem 0.875rem', background:'rgba(15,23,42,0.7)', borderRadius:'0.6rem', border:'1px solid #1e293b' }}>
// // //                                           <span style={{ fontSize:'1rem', flexShrink:0 }}>{cfg.icon}</span>
// // //                                           <div style={{ flex:1, minWidth:0 }}>
// // //                                             <p style={{ fontSize:'0.8rem', fontWeight:700, color:'#e2e8f0', margin:0, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{item.title}</p>
// // //                                             <p style={{ fontSize:'0.62rem', color:'#64748b', margin:0 }}>{item.type==='ppt' ? item.fileSize : item.duration}</p>
// // //                                           </div>
// // //                                           <span style={pillS(cfg.color)}>{cfg.tag}</span>
// // //                                           {item.type==='ppt' && item.downloadUrl && (
// // //                                             <a href={item.downloadUrl} target="_blank" rel="noreferrer"
// // //                                               style={{ fontSize:'0.62rem', fontWeight:800, padding:'0.2rem 0.55rem', borderRadius:'0.4rem', background:'rgba(139,92,246,0.15)', color:'#a78bfa', border:'1px solid rgba(139,92,246,0.3)', textDecoration:'none', flexShrink:0 }}>
// // //                                               ⬇
// // //                                             </a>
// // //                                           )}
// // //                                           {/* DELETE content item */}
// // //                                           <DeleteButton
// // //                                             itemName={`"${item.title}"`}
// // //                                             onConfirm={() => deleteContent(lang, topicIdx, ci)}
// // //                                           />
// // //                                         </div>
// // //                                       );
// // //                                     })}
// // //                                   </div>

// // //                                   {/* Add content form */}
// // //                                   <div style={{ background:'rgba(15,23,42,0.5)', borderRadius:'0.75rem', padding:'0.875rem', border:'1px solid #1e293b' }}>
// // //                                     <p style={{ fontSize:'0.6rem', fontWeight:800, color:'#475569', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:'0.6rem' }}>Add Content</p>
// // //                                     <div style={{ display:'flex', gap:'0.4rem', marginBottom:'0.6rem', flexWrap:'wrap' }}>
// // //                                       {CONTENT_TYPES.map(ct => {
// // //                                         const isActive = newContent[topicKey]?.type === ct.key;
// // //                                         return (
// // //                                           <button key={ct.key} type="button"
// // //                                             onClick={() => {
// // //                                               setNewContent(p => ({ ...p, [topicKey]: { ...p[topicKey], type:ct.key } }));
// // //                                               setPptKey(ct.key==='ppt' ? (pptKey===topicKey ? null : topicKey) : null);
// // //                                             }}
// // //                                             style={{ padding:'0.35rem 0.75rem', borderRadius:'0.45rem', fontWeight:800, fontSize:'0.68rem', border:`1px solid ${isActive?ct.color:'#334155'}`, background:isActive?`${ct.color}22`:'transparent', color:isActive?ct.color:'#64748b', cursor:'pointer', transition:'all 0.15s' }}>
// // //                                             {ct.icon} {ct.label}
// // //                                           </button>
// // //                                         );
// // //                                       })}
// // //                                     </div>
// // //                                     {pptKey === topicKey ? (
// // //                                       <PPTUploader langId={lang.id} topicIdx={topicIdx} onUploaded={item => handlePPTUploaded(lang, topicIdx, item)} />
// // //                                     ) : newContent[topicKey]?.type && newContent[topicKey].type!=='ppt' && (
// // //                                       <div style={{ display:'flex', gap:'0.5rem' }}>
// // //                                         <input value={newContent[topicKey]?.title||''} onChange={e => setNewContent(p=>({...p,[topicKey]:{...p[topicKey],title:e.target.value}}))} onKeyDown={e => e.key==='Enter' && addContent(lang,topicIdx)} placeholder="Content title" style={{ ...iStyle, fontSize:'0.78rem' }} />
// // //                                         <input value={newContent[topicKey]?.duration||''} onChange={e => setNewContent(p=>({...p,[topicKey]:{...p[topicKey],duration:e.target.value}}))} placeholder="Duration (e.g., 45 Mins)" style={{ ...iStyle, width:'130px', flex:'none', fontSize:'0.78rem' }} />
// // //                                         <button onClick={() => addContent(lang,topicIdx)} style={bStyle('#10b981')}>+ Add</button>
// // //                                       </div>
// // //                                     )}
// // //                                   </div>
// // //                                 </div>
// // //                               </div>
// // //                             )}
// // //                           </div>
// // //                         );
// // //                       })}
// // //                     </div>

// // //                     {/* Add topic */}
// // //                     <div>
// // //                       <p style={{ fontSize:'0.6rem', fontWeight:900, color:'#475569', letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:'0.5rem' }}>+ Add Topic to {lang.name}</p>
// // //                       <div style={{ display:'flex', gap:'0.6rem' }}>
// // //                         <input value={newTopics[lang.id]||''} onChange={e => setNewTopics(p=>({...p,[lang.id]:e.target.value}))} onKeyDown={e => e.key==='Enter' && addTopic(lang)} placeholder="e.g., I/O Basics, Arrays, OOP" style={iStyle} />
// // //                         <button onClick={() => addTopic(lang)} style={bStyle()}>+ Add Topic</button>
// // //                       </div>
// // //                     </div>
// // //                   </div>
// // //                 )}
// // //               </div>
// // //             );
// // //           })}
// // //         </div>
// // //       )}
// // //     </div>
// // //   );
// // // }

// // ///


// // import React, { useState, useEffect, useRef } from 'react';
// // import {
// //   collection, getDocs, addDoc, updateDoc, deleteDoc,
// //   doc, serverTimestamp, query, orderBy
// // } from 'firebase/firestore';
// // import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
// // import { db, storage } from '../../firebase/config';
// // import DeleteButton from '../ui/DeleteButton';

// // const CONTENT_TYPES = [
// //   { key: 'lesson', label: 'Intro Lesson',  icon: '📖', color: '#3b82f6', tag: 'Learning' },
// //   { key: 'mcq',    label: 'MCQ Practice',  icon: '📋', color: '#f59e0b', tag: 'Practice' },
// //   { key: 'coding', label: 'Coding Question', icon: '💻', color: '#10b981', tag: 'Coding'   },
// //   { key: 'ppt',    label: 'PPT Slides',      icon: '📊', color: '#8b5cf6', tag: 'Slides'   },
// // ];

// // const LANG_ICONS = { Python:'🐍', Java:'☕', JavaScript:'🟨', C:'⚙️', 'C++':'⚡', SQL:'🗄️', default:'📘' };

// // const iStyle = { flex:1, background:'#0f172a', border:'1px solid #334155', borderRadius:'0.6rem', padding:'0.55rem 0.875rem', color:'#f1f5f9', fontSize:'0.82rem', outline:'none' };
// // const bStyle = (color='#3b82f6', extra={}) => ({ padding:'0.5rem 1.1rem', borderRadius:'0.6rem', background:color, color:'#fff', fontWeight:800, fontSize:'0.75rem', border:'none', cursor:'pointer', whiteSpace:'nowrap', ...extra });
// // const cardS  = (border='#1e293b') => ({ background:'rgba(15,23,42,0.6)', border:`1px solid ${border}`, borderRadius:'0.875rem', overflow:'hidden', transition:'border-color 0.2s' });
// // const pillS  = (color) => ({ fontSize:'0.6rem', fontWeight:800, padding:'0.15rem 0.55rem', borderRadius:'999px', background:`${color}22`, color, letterSpacing:'0.06em', flexShrink:0 });

// // /* ── PPT Uploader ─────────────────────────────────────────────────────────── */
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
// //     if (!f.name.match(/\.(pptx?|ppt)$/i)) { setErr('Only .ppt / .pptx files allowed.'); return; }
// //     setErr(''); setFile(f);
// //     if (!pptTitle) setPptTitle(f.name.replace(/\.(pptx?|ppt)$/i, ''));
// //   };

// //   const upload = () => {
// //     if (!file) { setErr('Choose a file first.'); return; }
// //     if (!pptTitle.trim()) { setErr('Enter a title.'); return; }
// //     setUploading(true); setErr('');
// //     const sRef = ref(storage, `learning_ppts/${langId}/topic_${topicIdx}/${Date.now()}_${file.name}`);
// //     const task = uploadBytesResumable(sRef, file);
// //     task.on('state_changed',
// //       s => setProgress(Math.round((s.bytesTransferred / s.totalBytes) * 100)),
// //       e => { setErr('Upload failed.'); setUploading(false); console.error(e); },
// //       () => getDownloadURL(task.snapshot.ref).then(url => {
// //         onUploaded({ type:'ppt', title:pptTitle.trim(), fileName:file.name, fileSize:(file.size/1024/1024).toFixed(2)+' MB', downloadUrl:url, storagePath:task.snapshot.ref.fullPath });
// //         setPptTitle(''); setFile(null); setProgress(0); setUploading(false);
// //         if (fileRef.current) fileRef.current.value = '';
// //       })
// //     );
// //   };

// //   return (
// //     <div style={{ background:'rgba(139,92,246,0.06)', border:'1px solid rgba(139,92,246,0.2)', borderRadius:'0.75rem', padding:'0.875rem', marginTop:'0.5rem' }}>
// //       <p style={{ fontSize:'0.6rem', fontWeight:900, color:'#a78bfa', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:'0.6rem' }}>📊 Upload PPT Slides</p>
// //       <div style={{ display:'flex', gap:'0.5rem', marginBottom:'0.6rem', flexWrap:'wrap' }}>
// //         <input ref={fileRef} type="file" accept=".ppt,.pptx" onChange={pick} style={{ display:'none' }} id={`ppt-${langId}-${topicIdx}`} />
// //         <label htmlFor={`ppt-${langId}-${topicIdx}`} style={bStyle('rgba(139,92,246,0.2)', { border:'1px solid rgba(139,92,246,0.4)', color:'#a78bfa', cursor:'pointer' })}>📎 Choose File</label>
// //         {file && <span style={{ fontSize:'0.75rem', color:'#94a3b8', alignSelf:'center', fontFamily:'monospace' }}>{file.name} ({(file.size/1024/1024).toFixed(2)} MB)</span>}
// //       </div>
// //       <div style={{ display:'flex', gap:'0.5rem', marginBottom:'0.6rem' }}>
// //         <input value={pptTitle} onChange={e => setPptTitle(e.target.value)} placeholder="Presentation title" style={{ ...iStyle, fontSize:'0.78rem' }} />
// //         <button onClick={upload} disabled={uploading || !file} style={bStyle('#8b5cf6', { opacity: uploading||!file ? 0.5:1 })}>{uploading ? `${progress}%` : '⬆ Upload'}</button>
// //       </div>
// //       {uploading && <div style={{ background:'#1e293b', borderRadius:'999px', height:'6px', overflow:'hidden' }}><div style={{ height:'100%', width:`${progress}%`, background:'linear-gradient(90deg,#8b5cf6,#6366f1)', transition:'width 0.3s', borderRadius:'999px' }} /></div>}
// //       {err && <p style={{ fontSize:'0.72rem', color:'#f87171', marginTop:'0.4rem' }}>{err}</p>}
// //     </div>
// //   );
// // }

// // /* ── Main ─────────────────────────────────────────────────────────────────── */
// // // ADDED onOpenTopic prop
// // export default function LearningModules({ moduleData, onOpenTopic }) {
// //   const [languages, setLanguages]         = useState([]);
// //   const [expandedLang, setExpandedLang]   = useState(null);
// //   const [expandedTopic, setExpandedTopic] = useState(null);
// //   const [loading, setLoading]             = useState(true);
// //   const [newLang, setNewLang]             = useState('');
// //   const [newTopics, setNewTopics]         = useState({});
// //   const [newSubtopics, setNewSubtopics]   = useState({});
// //   const [newContent, setNewContent]       = useState({});
// //   const [creatingLang, setCreatingLang]   = useState(false);
// //   const [pptKey, setPptKey]               = useState(null);

// //   const fetch = async () => {
// //     setLoading(true);
// //     try {
// //       const snap = await getDocs(query(collection(db, 'learningLanguages'), orderBy('createdAt')));
// //       setLanguages(snap.docs.map(d => ({ id: d.id, ...d.data() })));
// //     } catch(e) { console.error(e); }
// //     setLoading(false);
// //   };

// //   useEffect(() => { fetch(); }, []);

// //   /* ── Delete language (entire doc) ── */
// //   const deleteLang = async (lang) => {
// //     await deleteDoc(doc(db, 'learningLanguages', lang.id));
// //     if (expandedLang === lang.id) setExpandedLang(null);
// //     await fetch();
// //   };

// //   /* ── Delete topic ── */
// //   const deleteTopic = async (lang, topicIdx) => {
// //     const topics = lang.topics.filter((_, i) => i !== topicIdx);
// //     await updateDoc(doc(db, 'learningLanguages', lang.id), { topics });
// //     const key = `${lang.id}-${topicIdx}`;
// //     if (expandedTopic === key) setExpandedTopic(null);
// //     await fetch();
// //   };

// //   /* ── Delete subtopic ── */
// //   const deleteSubtopic = async (lang, topicIdx, subIdx) => {
// //     const topics = lang.topics.map((t, i) =>
// //       i === topicIdx ? { ...t, subtopics: t.subtopics.filter((_, si) => si !== subIdx) } : t
// //     );
// //     await updateDoc(doc(db, 'learningLanguages', lang.id), { topics });
// //     await fetch();
// //   };

// //   /* ── Delete content item ── */
// //   const deleteContent = async (lang, topicIdx, contentIdx) => {
// //     const item = lang.topics[topicIdx].content[contentIdx];
// //     // If PPT, also delete from Firebase Storage
// //     if (item.type === 'ppt' && item.storagePath) {
// //       try { await deleteObject(ref(storage, item.storagePath)); } catch(e) { console.warn('Storage delete failed:', e); }
// //     }
// //     const topics = lang.topics.map((t, i) =>
// //       i === topicIdx ? { ...t, content: t.content.filter((_, ci) => ci !== contentIdx) } : t
// //     );
// //     await updateDoc(doc(db, 'learningLanguages', lang.id), { topics });
// //     await fetch();
// //   };

// //   /* ── Create language ── */
// //   const createLang = async () => {
// //     if (!newLang.trim()) return;
// //     setCreatingLang(true);
// //     try { await addDoc(collection(db, 'learningLanguages'), { name: newLang.trim(), topics: [], createdAt: serverTimestamp() }); setNewLang(''); await fetch(); }
// //     catch { alert('Failed to create language.'); }
// //     setCreatingLang(false);
// //   };

// //   /* ── Add topic ── */
// //   const addTopic = async (lang) => {
// //     const name = (newTopics[lang.id] || '').trim();
// //     if (!name) return;
    
// //     // Creating an ID for the topic
// //     const topicId = name.toLowerCase().replace(/\s+/g, '-');
// //     const newTopic = { id: topicId, name, subtopics:[], content:[] };

// //     await updateDoc(doc(db, 'learningLanguages', lang.id), { topics: [...(lang.topics||[]), newTopic] });
// //     setNewTopics(p => ({ ...p, [lang.id]:'' }));
// //     await fetch();
// //   };

// //   /* ── Add subtopic ── */
// //   const addSubtopic = async (lang, topicIdx) => {
// //     const key  = `${lang.id}-${topicIdx}`;
// //     const name = (newSubtopics[key] || '').trim();
// //     if (!name) return;
// //     const topics = lang.topics.map((t, i) => i === topicIdx ? { ...t, subtopics: [...(t.subtopics||[]), name] } : t);
// //     await updateDoc(doc(db, 'learningLanguages', lang.id), { topics });
// //     setNewSubtopics(p => ({ ...p, [key]:'' }));
// //     await fetch();
// //   };

// //   /* ── Add content item ── */
// //   const addContent = async (lang, topicIdx) => {
// //     const key  = `${lang.id}-${topicIdx}`;
// //     const item = newContent[key];
// //     if (!item?.title?.trim() || !item?.type) return;
// //     const topics = lang.topics.map((t, i) => i === topicIdx ? { ...t, content: [...(t.content||[]), { type:item.type, title:item.title.trim(), duration:item.duration||'20 Mins', createdAt:new Date().toISOString() }] } : t);
// //     await updateDoc(doc(db, 'learningLanguages', lang.id), { topics });
// //     setNewContent(p => ({ ...p, [key]:{ type:'', title:'', duration:'' } }));
// //     await fetch();
// //   };

// //   /* ── PPT uploaded ── */
// //   const handlePPTUploaded = async (lang, topicIdx, pptItem) => {
// //     const topics = lang.topics.map((t, i) => i === topicIdx ? { ...t, content: [...(t.content||[]), { ...pptItem, createdAt:new Date().toISOString() }] } : t);
// //     await updateDoc(doc(db, 'learningLanguages', lang.id), { topics });
// //     setPptKey(null);
// //     await fetch();
// //   };

// //   const langIcon = (name) => LANG_ICONS[name] || LANG_ICONS.default;
// //   const contentCfg = (type) => CONTENT_TYPES.find(c => c.key === type) || CONTENT_TYPES[0];

// //   /* ── RENDER ─────────────────────────────────────────────────────────────── */
// //   return (
// //     <div>
// //       {/* Create language */}
// //       <div style={{ ...cardS('#1e3a5f'), padding:'1.25rem', marginBottom:'1.5rem' }}>
// //         <p style={{ fontSize:'0.6rem', fontWeight:900, color:'#64748b', letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:'0.75rem' }}>+ Create Language</p>
// //         <div style={{ display:'flex', gap:'0.75rem' }}>
// //           <input value={newLang} onChange={e => setNewLang(e.target.value)} onKeyDown={e => e.key==='Enter' && createLang()} placeholder="e.g., Python, Java, SQL" style={iStyle} />
// //           <button onClick={createLang} disabled={creatingLang} style={bStyle()}>{creatingLang ? '...' : 'Create'}</button>
// //         </div>
// //       </div>

// //       {/* Language list */}
// //       {loading ? (
// //         <div style={{ textAlign:'center', padding:'3rem', color:'#475569' }}>Loading...</div>
// //       ) : languages.length === 0 ? (
// //         <div style={{ textAlign:'center', padding:'4rem', color:'#334155' }}>
// //           <p style={{ fontSize:'2.5rem' }}>📘</p>
// //           <p style={{ fontWeight:700, color:'#64748b', marginTop:'0.5rem' }}>No languages yet. Create one above.</p>
// //         </div>
// //       ) : (
// //         <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
// //           {languages.map(lang => {
// //             const isLangOpen = expandedLang === lang.id;
// //             return (
// //               <div key={lang.id} style={cardS(isLangOpen ? '#3b82f6' : '#1e293b')}>

// //                 {/* Language header */}
// //                 <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'1rem 1.25rem' }}>
// //                   {/* Left — click to expand */}
// //                   <div onClick={() => setExpandedLang(isLangOpen ? null : lang.id)}
// //                     style={{ display:'flex', alignItems:'center', gap:'0.75rem', flex:1, cursor:'pointer' }}>
// //                     <span style={{ fontSize:'1.5rem' }}>{langIcon(lang.name)}</span>
// //                     <div>
// //                       <p style={{ fontWeight:900, fontSize:'1rem', color:'#f1f5f9', margin:0 }}>{lang.name}</p>
// //                       <p style={{ fontSize:'0.65rem', color:'#64748b', margin:0 }}>{lang.topics?.length || 0} topics</p>
// //                     </div>
// //                     {/* Topic pills */}
// //                     <div style={{ display:'flex', gap:'0.35rem', flexWrap:'wrap', marginLeft:'0.5rem' }}>
// //                       {lang.topics?.slice(0,3).map((t,i) => (
// //                         <span key={i} style={{ fontSize:'0.62rem', padding:'0.15rem 0.55rem', borderRadius:'999px', background:'rgba(59,130,246,0.12)', color:'#60a5fa', border:'1px solid rgba(59,130,246,0.25)', fontWeight:700 }}>{t.name}</span>
// //                       ))}
// //                       {lang.topics?.length > 3 && <span style={{ fontSize:'0.62rem', color:'#475569' }}>+{lang.topics.length-3}</span>}
// //                     </div>
// //                   </div>
// //                   {/* Right — chevron + DELETE language */}
// //                   <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', flexShrink:0 }}>
// //                     <span onClick={() => setExpandedLang(isLangOpen ? null : lang.id)}
// //                       style={{ color:'#475569', fontSize:'0.8rem', display:'inline-block', transform:isLangOpen?'rotate(180deg)':'rotate(0)', transition:'transform 0.2s', cursor:'pointer' }}>▼</span>
// //                     <DeleteButton
// //                       itemName={`language "${lang.name}" and all its topics`}
// //                       onConfirm={() => deleteLang(lang)}
// //                     />
// //                   </div>
// //                 </div>

// //                 {/* Language body */}
// //                 {isLangOpen && (
// //                   <div style={{ borderTop:'1px solid #1e293b', padding:'1.25rem' }}>

// //                     {/* Topics */}
// //                     <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem', marginBottom:'1rem' }}>
// //                       {!lang.topics?.length ? (
// //                         <p style={{ color:'#475569', fontSize:'0.8rem' }}>No topics yet.</p>
// //                       ) : lang.topics.map((topic, topicIdx) => {
// //                         const topicKey   = `${lang.id}-${topicIdx}`;
// //                         const isTopicOpen = expandedTopic === topicKey;
// //                         const pptCount   = topic.content?.filter(c => c.type==='ppt').length || 0;

// //                         return (
// //                           <div key={topicIdx} style={{ background:'rgba(30,41,59,0.6)', border:'1px solid #334155', borderRadius:'0.75rem', overflow:'hidden' }}>

// //                             {/* Topic header */}
// //                             <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'0.75rem 1rem' }}>
// //                               <div onClick={() => setExpandedTopic(isTopicOpen ? null : topicKey)}
// //                                 style={{ display:'flex', alignItems:'center', gap:'0.6rem', flex:1, cursor:'pointer' }}>
// //                                 <div style={{ width:'1.4rem', height:'1.4rem', borderRadius:'50%', background:topic.content?.length?'#10b981':'#1e293b', border:`2px solid ${topic.content?.length?'#10b981':'#334155'}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
// //                                   {topic.content?.length ? <span style={{ fontSize:'0.55rem', color:'#fff' }}>✓</span> : null}
// //                                 </div>
// //                                 <div>
// //                                   <p style={{ fontWeight:800, fontSize:'0.875rem', color:'#e2e8f0', margin:0 }}>
// //                                     {topic.name}
// //                                   </p>
// //                                   <p style={{ fontSize:'0.62rem', color:'#64748b', margin:0 }}>
// //                                     {topic.subtopics?.length||0} subtopics · {topic.content?.length||0} items
// //                                     {pptCount>0 && <span style={{ marginLeft:'0.35rem', color:'#a78bfa' }}>· 📊 {pptCount}</span>}
// //                                   </p>
// //                                 </div>
// //                               </div>
// //                               {/* EDIT TOPIC BUTTON & DELETE topic + chevron */}
// //                               <div style={{ display:'flex', alignItems:'center', gap:'0.4rem', flexShrink:0 }}>
// //                                 {/* THE FIX: Button to Open Lesson Action Panel */}
// //                                 <button 
// //                                   onClick={() => onOpenTopic(lang, topic)}
// //                                   style={{ ...bStyle('#3b82f6'), padding: '0.35rem 0.8rem', fontSize: '0.65rem' }}
// //                                 >
// //                                   Edit Content
// //                                 </button>

// //                                 <span onClick={() => setExpandedTopic(isTopicOpen ? null : topicKey)}
// //                                   style={{ color:'#475569', fontSize:'0.75rem', transform:isTopicOpen?'rotate(180deg)':'rotate(0)', transition:'transform 0.2s', cursor:'pointer', display:'inline-block', marginLeft: '0.5rem' }}>▼</span>
// //                                 <DeleteButton
// //                                   itemName={`topic "${topic.name}"`}
// //                                   onConfirm={() => deleteTopic(lang, topicIdx)}
// //                                 />
// //                               </div>
// //                             </div>

// //                             {/* Topic body */}
// //                             {isTopicOpen && (
// //                               <div style={{ borderTop:'1px solid #1e293b', padding:'1rem' }}>

// //                                 {/* Subtopics */}
// //                                 <div style={{ marginBottom:'1.25rem' }}>
// //                                   <p style={{ fontSize:'0.6rem', fontWeight:900, color:'#475569', letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:'0.6rem' }}>Subtopics</p>
// //                                   <div style={{ display:'flex', flexWrap:'wrap', gap:'0.4rem', marginBottom:'0.6rem' }}>
// //                                     {!topic.subtopics?.length ? (
// //                                       <span style={{ fontSize:'0.75rem', color:'#475569' }}>No subtopics yet.</span>
// //                                     ) : topic.subtopics.map((sub, si) => (
// //                                       <div key={si} style={{ display:'inline-flex', alignItems:'center', gap:'0.3rem', padding:'0.2rem 0.3rem 0.2rem 0.65rem', borderRadius:'0.4rem', background:'rgba(99,102,241,0.12)', border:'1px solid rgba(99,102,241,0.25)' }}>
// //                                         <span style={{ fontSize:'0.72rem', fontWeight:700, color:'#818cf8' }}>{sub}</span>
// //                                         {/* DELETE subtopic — tiny X */}
// //                                         <button
// //                                           onClick={() => {
// //                                             if (window.confirm(`Delete subtopic "${sub}"?`)) deleteSubtopic(lang, topicIdx, si);
// //                                           }}
// //                                           title="Delete subtopic"
// //                                           style={{ background:'none', border:'none', color:'#64748b', cursor:'pointer', fontSize:'0.7rem', padding:'0 0.1rem', lineHeight:1, fontWeight:900 }}
// //                                           onMouseEnter={e => e.currentTarget.style.color='#f87171'}
// //                                           onMouseLeave={e => e.currentTarget.style.color='#64748b'}
// //                                         >✕</button>
// //                                       </div>
// //                                     ))}
// //                                   </div>
// //                                   <div style={{ display:'flex', gap:'0.5rem' }}>
// //                                     <input value={newSubtopics[topicKey]||''} onChange={e => setNewSubtopics(p=>({...p,[topicKey]:e.target.value}))} onKeyDown={e => e.key==='Enter' && addSubtopic(lang,topicIdx)} placeholder={`Add subtopic to ${topic.name}`} style={{ ...iStyle, fontSize:'0.78rem' }} />
// //                                     <button onClick={() => addSubtopic(lang,topicIdx)} style={{ ...bStyle('#6366f1'), padding:'0.45rem 0.875rem', fontSize:'0.7rem' }}>+ Subtopic</button>
// //                                   </div>
// //                                 </div>

// //                                 {/* Content items */}
// //                                 <div>
// //                                   <p style={{ fontSize:'0.6rem', fontWeight:900, color:'#475569', letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:'0.6rem' }}>Content Overview</p>

// //                                   <div style={{ display:'flex', flexDirection:'column', gap:'0.4rem', marginBottom:'0.75rem' }}>
// //                                     {!topic.content?.length ? (
// //                                       <p style={{ fontSize:'0.75rem', color:'#475569' }}>No content yet. Click "Edit Content" above to add.</p>
// //                                     ) : topic.content.map((item, ci) => {
// //                                       const cfg = contentCfg(item.type);
// //                                       return (
// //                                         <div key={ci} style={{ display:'flex', alignItems:'center', gap:'0.75rem', padding:'0.6rem 0.875rem', background:'rgba(15,23,42,0.7)', borderRadius:'0.6rem', border:'1px solid #1e293b' }}>
// //                                           <span style={{ fontSize:'1rem', flexShrink:0 }}>{cfg.icon}</span>
// //                                           <div style={{ flex:1, minWidth:0 }}>
// //                                             <p style={{ fontSize:'0.8rem', fontWeight:700, color:'#e2e8f0', margin:0, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{item.title}</p>
// //                                             <p style={{ fontSize:'0.62rem', color:'#64748b', margin:0 }}>{item.type==='ppt' ? item.fileSize : item.duration}</p>
// //                                           </div>
// //                                           <span style={pillS(cfg.color)}>{cfg.tag}</span>
// //                                           {item.type==='ppt' && item.downloadUrl && (
// //                                             <a href={item.downloadUrl} target="_blank" rel="noreferrer"
// //                                               style={{ fontSize:'0.62rem', fontWeight:800, padding:'0.2rem 0.55rem', borderRadius:'0.4rem', background:'rgba(139,92,246,0.15)', color:'#a78bfa', border:'1px solid rgba(139,92,246,0.3)', textDecoration:'none', flexShrink:0 }}>
// //                                               ⬇
// //                                             </a>
// //                                           )}
// //                                           {/* DELETE content item */}
// //                                           <DeleteButton
// //                                             itemName={`"${item.title}"`}
// //                                             onConfirm={() => deleteContent(lang, topicIdx, ci)}
// //                                           />
// //                                         </div>
// //                                       );
// //                                     })}
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
// //                       <p style={{ fontSize:'0.6rem', fontWeight:900, color:'#475569', letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:'0.5rem' }}>+ Add Topic to {lang.name}</p>
// //                       <div style={{ display:'flex', gap:'0.6rem' }}>
// //                         <input value={newTopics[lang.id]||''} onChange={e => setNewTopics(p=>({...p,[lang.id]:e.target.value}))} onKeyDown={e => e.key==='Enter' && addTopic(lang)} placeholder="e.g., I/O Basics, Arrays, OOP" style={iStyle} />
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



// /////


// // import React, { useState, useEffect, useRef } from 'react';
// // import {
// //   collection, getDocs, addDoc, updateDoc, deleteDoc,
// //   doc, serverTimestamp, query, orderBy
// // } from 'firebase/firestore';
// // import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
// // import { db, storage } from '../../firebase/config';
// // import DeleteButton from '../ui/DeleteButton';

// // const CONTENT_TYPES = [
// //   { key: 'lesson', label: 'Intro Lesson',  icon: '📖', color: '#3b82f6', tag: 'Learning' },
// //   { key: 'mcq',    label: 'MCQ Practice',  icon: '📋', color: '#f59e0b', tag: 'Practice' },
// //   { key: 'coding', label: 'Coding Question', icon: '💻', color: '#10b981', tag: 'Coding'   },
// //   { key: 'ppt',    label: 'PPT Slides',      icon: '📊', color: '#8b5cf6', tag: 'Slides'   },
// // ];

// // const LANG_ICONS = { Python:'🐍', Java:'☕', JavaScript:'🟨', C:'⚙️', 'C++':'⚡', SQL:'🗄️', default:'📘' };

// // const iStyle = { flex:1, background:'#0f172a', border:'1px solid #334155', borderRadius:'0.6rem', padding:'0.55rem 0.875rem', color:'#f1f5f9', fontSize:'0.82rem', outline:'none' };
// // const bStyle = (color='#3b82f6', extra={}) => ({ padding:'0.5rem 1.1rem', borderRadius:'0.6rem', background:color, color:'#fff', fontWeight:800, fontSize:'0.75rem', border:'none', cursor:'pointer', whiteSpace:'nowrap', ...extra });
// // const cardS  = (border='#1e293b') => ({ background:'rgba(15,23,42,0.6)', border:`1px solid ${border}`, borderRadius:'0.875rem', overflow:'hidden', transition:'border-color 0.2s' });
// // const pillS  = (color) => ({ fontSize:'0.6rem', fontWeight:800, padding:'0.15rem 0.55rem', borderRadius:'999px', background:`${color}22`, color, letterSpacing:'0.06em', flexShrink:0 });

// // /* ── PPT Uploader ─────────────────────────────────────────────────────────── */
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
// //     if (!f.name.match(/\.(pptx?|ppt|pdf)$/i)) { setErr('Only PPT/PDF files allowed.'); return; }
// //     setErr(''); setFile(f);
// //     if (!pptTitle) setPptTitle(f.name.replace(/\.(pptx?|ppt|pdf)$/i, ''));
// //   };

// //   const upload = () => {
// //     if (!file) { setErr('Choose a file first.'); return; }
// //     if (!pptTitle.trim()) { setErr('Enter a title.'); return; }
// //     setUploading(true); setErr('');
// //     const sRef = ref(storage, `learning_ppts/${langId}/topic_${topicIdx}/${Date.now()}_${file.name}`);
// //     const task = uploadBytesResumable(sRef, file);
// //     task.on('state_changed',
// //       s => setProgress(Math.round((s.bytesTransferred / s.totalBytes) * 100)),
// //       e => { setErr('Upload failed.'); setUploading(false); console.error(e); },
// //       () => getDownloadURL(task.snapshot.ref).then(url => {
// //         onUploaded({ type:'ppt', title:pptTitle.trim(), fileName:file.name, fileSize:(file.size/1024/1024).toFixed(2)+' MB', downloadUrl:url, storagePath:task.snapshot.ref.fullPath });
// //         setPptTitle(''); setFile(null); setProgress(0); setUploading(false);
// //         if (fileRef.current) fileRef.current.value = '';
// //       })
// //     );
// //   };

// //   return (
// //     <div style={{ background:'rgba(139,92,246,0.06)', border:'1px solid rgba(139,92,246,0.2)', borderRadius:'0.75rem', padding:'0.875rem', marginTop:'0.5rem' }}>
// //       <p style={{ fontSize:'0.6rem', fontWeight:900, color:'#a78bfa', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:'0.6rem' }}>📊 Upload Files</p>
// //       <div style={{ display:'flex', gap:'0.5rem', marginBottom:'0.6rem', flexWrap:'wrap' }}>
// //         <input ref={fileRef} type="file" accept=".ppt,.pptx,.pdf" onChange={pick} style={{ display:'none' }} id={`ppt-${langId}-${topicIdx}`} />
// //         <label htmlFor={`ppt-${langId}-${topicIdx}`} style={bStyle('rgba(139,92,246,0.2)', { border:'1px solid rgba(139,92,246,0.4)', color:'#a78bfa', cursor:'pointer' })}>📎 Choose File</label>
// //         {file && <span style={{ fontSize:'0.75rem', color:'#94a3b8', alignSelf:'center', fontFamily:'monospace' }}>{file.name} ({(file.size/1024/1024).toFixed(2)} MB)</span>}
// //       </div>
// //       <div style={{ display:'flex', gap:'0.5rem', marginBottom:'0.6rem' }}>
// //         <input value={pptTitle} onChange={e => setPptTitle(e.target.value)} placeholder="Presentation title" style={{ ...iStyle, fontSize:'0.78rem' }} />
// //         <button onClick={upload} disabled={uploading || !file} style={bStyle('#8b5cf6', { opacity: uploading||!file ? 0.5:1 })}>{uploading ? `${progress}%` : '⬆ Upload'}</button>
// //       </div>
// //       {uploading && <div style={{ background:'#1e293b', borderRadius:'999px', height:'6px', overflow:'hidden' }}><div style={{ height:'100%', width:`${progress}%`, background:'linear-gradient(90deg,#8b5cf6,#6366f1)', transition:'width 0.3s', borderRadius:'999px' }} /></div>}
// //       {err && <p style={{ fontSize:'0.72rem', color:'#f87171', marginTop:'0.4rem' }}>{err}</p>}
// //     </div>
// //   );
// // }

// // /* ── Main Component ─────────────────────────────────────────────────────────── */
// // export default function LearningModules({ moduleData, onOpenTopic }) {
// //   const [languages, setLanguages]         = useState([]);
// //   const [expandedLang, setExpandedLang]   = useState(null);
// //   const [expandedTopic, setExpandedTopic] = useState(null);
// //   const [loading, setLoading]             = useState(true);
// //   const [newLang, setNewLang]             = useState('');
// //   const [newTopics, setNewTopics]         = useState({});
// //   const [newSubtopics, setNewSubtopics]   = useState({});
// //   const [newContent, setNewContent]       = useState({});
// //   const [creatingLang, setCreatingLang]   = useState(false);
// //   const [pptKey, setPptKey]               = useState(null);

// //   const fetch = async () => {
// //     setLoading(true);
// //     try {
// //       const snap = await getDocs(query(collection(db, 'learningLanguages'), orderBy('createdAt')));
// //       setLanguages(snap.docs.map(d => ({ id: d.id, ...d.data() })));
// //     } catch(e) { console.error(e); }
// //     setLoading(false);
// //   };

// //   useEffect(() => { fetch(); }, []);

// //   /* ── Delete language (entire doc) ── */
// //   const deleteLang = async (lang) => {
// //     if (!window.confirm(`Delete language "${lang.name}" completely?`)) return;
// //     await deleteDoc(doc(db, 'learningLanguages', lang.id));
// //     if (expandedLang === lang.id) setExpandedLang(null);
// //     await fetch();
// //   };

// //   /* ── Delete topic ── */
// //   const deleteTopic = async (lang, topicIdx) => {
// //     const topics = lang.topics.filter((_, i) => i !== topicIdx);
// //     await updateDoc(doc(db, 'learningLanguages', lang.id), { topics });
// //     const key = `${lang.id}-${topicIdx}`;
// //     if (expandedTopic === key) setExpandedTopic(null);
// //     await fetch();
// //   };

// //   /* ── Delete subtopic ── */
// //   const deleteSubtopic = async (lang, topicIdx, subIdx) => {
// //     const topics = lang.topics.map((t, i) =>
// //       i === topicIdx ? { ...t, subtopics: t.subtopics.filter((_, si) => si !== subIdx) } : t
// //     );
// //     await updateDoc(doc(db, 'learningLanguages', lang.id), { topics });
// //     await fetch();
// //   };

// //   /* ── Delete content item ── */
// //   const deleteContent = async (lang, topicIdx, contentIdx) => {
// //     const item = lang.topics[topicIdx].content[contentIdx];
// //     // If PPT, also delete from Firebase Storage
// //     if (item.type === 'ppt' && item.storagePath) {
// //       try { await deleteObject(ref(storage, item.storagePath)); } catch(e) { console.warn('Storage delete failed:', e); }
// //     }
// //     const topics = lang.topics.map((t, i) =>
// //       i === topicIdx ? { ...t, content: t.content.filter((_, ci) => ci !== contentIdx) } : t
// //     );
// //     await updateDoc(doc(db, 'learningLanguages', lang.id), { topics });
// //     await fetch();
// //   };

// //   /* ── Create language ── */
// //   const createLang = async () => {
// //     if (!newLang.trim()) return;
// //     setCreatingLang(true);
// //     try { await addDoc(collection(db, 'learningLanguages'), { name: newLang.trim(), topics: [], createdAt: serverTimestamp() }); setNewLang(''); await fetch(); }
// //     catch { alert('Failed to create language.'); }
// //     setCreatingLang(false);
// //   };

// //   /* ── Add topic ── */
// //   const addTopic = async (lang) => {
// //     const name = (newTopics[lang.id] || '').trim();
// //     if (!name) return;
    
// //     const topicId = name.toLowerCase().replace(/\s+/g, '-');
// //     await updateDoc(doc(db, 'learningLanguages', lang.id), { topics: [...(lang.topics||[]), { id: topicId, name, subtopics:[], content:[] }] });
// //     setNewTopics(p => ({ ...p, [lang.id]:'' }));
// //     await fetch();
// //   };

// //   /* ── Add subtopic ── */
// //   const addSubtopic = async (lang, topicIdx) => {
// //     const key  = `${lang.id}-${topicIdx}`;
// //     const name = (newSubtopics[key] || '').trim();
// //     if (!name) return;
// //     const topics = lang.topics.map((t, i) => i === topicIdx ? { ...t, subtopics: [...(t.subtopics||[]), name] } : t);
// //     await updateDoc(doc(db, 'learningLanguages', lang.id), { topics });
// //     setNewSubtopics(p => ({ ...p, [key]:'' }));
// //     await fetch();
// //   };

// //   /* ── Add content item ── */
// //   const addContent = async (lang, topicIdx) => {
// //     const key  = `${lang.id}-${topicIdx}`;
// //     const item = newContent[key];
// //     if (!item?.title?.trim() || !item?.type) return;
// //     const topics = lang.topics.map((t, i) => i === topicIdx ? { ...t, content: [...(t.content||[]), { type:item.type, title:item.title.trim(), duration:item.duration||'20 Mins', createdAt:new Date().toISOString() }] } : t);
// //     await updateDoc(doc(db, 'learningLanguages', lang.id), { topics });
// //     setNewContent(p => ({ ...p, [key]:{ type:'', title:'', duration:'' } }));
// //     await fetch();
// //   };

// //   /* ── PPT uploaded ── */
// //   const handlePPTUploaded = async (lang, topicIdx, pptItem) => {
// //     const topics = lang.topics.map((t, i) => i === topicIdx ? { ...t, content: [...(t.content||[]), { ...pptItem, createdAt:new Date().toISOString() }] } : t);
// //     await updateDoc(doc(db, 'learningLanguages', lang.id), { topics });
// //     setPptKey(null);
// //     await fetch();
// //   };

// //   const langIcon = (name) => LANG_ICONS[name] || LANG_ICONS.default;
// //   const contentCfg = (type) => CONTENT_TYPES.find(c => c.key === type) || CONTENT_TYPES[0];

// //   /* ── RENDER ─────────────────────────────────────────────────────────────── */
// //   return (
// //     <div>
// //       {/* Header */}
// //       <div style={{ marginBottom:'1.5rem' }}>
// //         <h2 style={{ fontSize:'1.25rem', fontWeight:900, color:'#f1f5f9', margin:0 }}>Learning Modules</h2>
// //         <p style={{ fontSize:'0.75rem', color:'#64748b', marginTop:'0.2rem' }}>Language → Topic → Subtopics · Learn · Practice · Test · 📊 Slides</p>
// //       </div>

// //       {/* Create language */}
// //       <div style={{ ...cardS('#1e3a5f'), padding:'1.25rem', marginBottom:'1.5rem' }}>
// //         <p style={{ fontSize:'0.6rem', fontWeight:900, color:'#64748b', letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:'0.75rem' }}>+ Create Language</p>
// //         <div style={{ display:'flex', gap:'0.75rem' }}>
// //           <input value={newLang} onChange={e => setNewLang(e.target.value)} onKeyDown={e => e.key==='Enter' && createLang()} placeholder="e.g., Python, Java, SQL" style={iStyle} />
// //           <button onClick={createLang} disabled={creatingLang} style={bStyle()}>{creatingLang ? '...' : 'Create'}</button>
// //         </div>
// //       </div>

// //       {/* Language list */}
// //       {loading ? (
// //         <div style={{ textAlign:'center', padding:'3rem', color:'#475569' }}>Loading...</div>
// //       ) : languages.length === 0 ? (
// //         <div style={{ textAlign:'center', padding:'4rem', color:'#334155' }}>
// //           <p style={{ fontSize:'2.5rem' }}>📘</p>
// //           <p style={{ fontWeight:700, color:'#64748b', marginTop:'0.5rem' }}>No languages yet. Create one above.</p>
// //         </div>
// //       ) : (
// //         <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
// //           {languages.map(lang => {
// //             const isLangOpen = expandedLang === lang.id;
// //             return (
// //               <div key={lang.id} style={cardS(isLangOpen ? '#3b82f6' : '#1e293b')}>

// //                 {/* Language header */}
// //                 <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'1rem 1.25rem' }}>
// //                   {/* Left — click to expand */}
// //                   <div onClick={() => setExpandedLang(isLangOpen ? null : lang.id)}
// //                     style={{ display:'flex', alignItems:'center', gap:'0.75rem', flex:1, cursor:'pointer' }}>
// //                     <span style={{ fontSize:'1.5rem' }}>{langIcon(lang.name)}</span>
// //                     <div>
// //                       <p style={{ fontWeight:900, fontSize:'1rem', color:'#f1f5f9', margin:0 }}>{lang.name}</p>
// //                       <p style={{ fontSize:'0.65rem', color:'#64748b', margin:0 }}>{lang.topics?.length || 0} topics</p>
// //                     </div>
// //                     {/* Topic pills */}
// //                     <div style={{ display:'flex', gap:'0.35rem', flexWrap:'wrap', marginLeft:'0.5rem' }}>
// //                       {lang.topics?.slice(0,3).map((t,i) => (
// //                         <span key={i} style={{ fontSize:'0.62rem', padding:'0.15rem 0.55rem', borderRadius:'999px', background:'rgba(59,130,246,0.12)', color:'#60a5fa', border:'1px solid rgba(59,130,246,0.25)', fontWeight:700 }}>{t.name}</span>
// //                       ))}
// //                       {lang.topics?.length > 3 && <span style={{ fontSize:'0.62rem', color:'#475569' }}>+{lang.topics.length-3}</span>}
// //                     </div>
// //                   </div>
// //                   {/* Right — chevron + DELETE language */}
// //                   <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', flexShrink:0 }}>
// //                     <span onClick={() => setExpandedLang(isLangOpen ? null : lang.id)}
// //                       style={{ color:'#475569', fontSize:'0.8rem', display:'inline-block', transform:isLangOpen?'rotate(180deg)':'rotate(0)', transition:'transform 0.2s', cursor:'pointer' }}>▼</span>
// //                     <DeleteButton
// //                       itemName={`language "${lang.name}"`}
// //                       onConfirm={() => deleteLang(lang)}
// //                     />
// //                   </div>
// //                 </div>

// //                 {/* Language body */}
// //                 {isLangOpen && (
// //                   <div style={{ borderTop:'1px solid #1e293b', padding:'1.25rem' }}>

// //                     {/* Topics */}
// //                     <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem', marginBottom:'1rem' }}>
// //                       {!lang.topics?.length ? (
// //                         <p style={{ color:'#475569', fontSize:'0.8rem' }}>No topics yet.</p>
// //                       ) : lang.topics.map((topic, topicIdx) => {
// //                         const topicKey   = `${lang.id}-${topicIdx}`;
// //                         const isTopicOpen = expandedTopic === topicKey;
// //                         const pptCount   = topic.content?.filter(c => c.type==='ppt').length || 0;

// //                         return (
// //                           <div key={topicIdx} style={{ background:'rgba(30,41,59,0.6)', border:'1px solid #334155', borderRadius:'0.75rem', overflow:'hidden' }}>

// //                             {/* Topic header */}
// //                             <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'0.75rem 1rem' }}>
// //                               <div onClick={() => setExpandedTopic(isTopicOpen ? null : topicKey)}
// //                                 style={{ display:'flex', alignItems:'center', gap:'0.6rem', flex:1, cursor:'pointer' }}>
// //                                 <div style={{ width:'1.4rem', height:'1.4rem', borderRadius:'50%', background:topic.content?.length?'#10b981':'#1e293b', border:`2px solid ${topic.content?.length?'#10b981':'#334155'}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
// //                                   {topic.content?.length ? <span style={{ fontSize:'0.55rem', color:'#fff' }}>✓</span> : null}
// //                                 </div>
// //                                 <div>
// //                                   <p style={{ fontWeight:800, fontSize:'0.875rem', color:'#e2e8f0', margin:0 }}>
// //                                     <span style={{ fontSize:'0.58rem', color:'#64748b', marginRight:'0.35rem', textTransform:'uppercase', letterSpacing:'0.08em' }}>TOPIC</span>
// //                                     {topic.name}
// //                                   </p>
// //                                   <p style={{ fontSize:'0.62rem', color:'#64748b', margin:0 }}>
// //                                     {topic.subtopics?.length||0} subtopics · {topic.content?.length||0} items
// //                                     {pptCount>0 && <span style={{ marginLeft:'0.35rem', color:'#a78bfa' }}>· 📊 {pptCount}</span>}
// //                                   </p>
// //                                 </div>
// //                               </div>
// //                               {/* DELETE topic + chevron + Optional Builder Link */}
// //                               <div style={{ display:'flex', alignItems:'center', gap:'0.4rem', flexShrink:0 }}>
// //                                 {onOpenTopic && (
// //                                     <button onClick={() => onOpenTopic(lang, topic)} style={{ ...bStyle('#3b82f6'), padding: '0.35rem 0.8rem', fontSize: '0.65rem' }}>
// //                                         Open Full Builder
// //                                     </button>
// //                                 )}
// //                                 <span onClick={() => setExpandedTopic(isTopicOpen ? null : topicKey)}
// //                                   style={{ color:'#475569', fontSize:'0.75rem', transform:isTopicOpen?'rotate(180deg)':'rotate(0)', transition:'transform 0.2s', cursor:'pointer', display:'inline-block' }}>▼</span>
// //                                 <DeleteButton
// //                                   itemName={`topic "${topic.name}"`}
// //                                   onConfirm={() => deleteTopic(lang, topicIdx)}
// //                                 />
// //                               </div>
// //                             </div>

// //                             {/* Topic body */}
// //                             {isTopicOpen && (
// //                               <div style={{ borderTop:'1px solid #1e293b', padding:'1rem' }}>

// //                                 {/* Subtopics */}
// //                                 <div style={{ marginBottom:'1.25rem' }}>
// //                                   <p style={{ fontSize:'0.6rem', fontWeight:900, color:'#475569', letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:'0.6rem' }}>Subtopics</p>
// //                                   <div style={{ display:'flex', flexWrap:'wrap', gap:'0.4rem', marginBottom:'0.6rem' }}>
// //                                     {!topic.subtopics?.length ? (
// //                                       <span style={{ fontSize:'0.75rem', color:'#475569' }}>No subtopics yet.</span>
// //                                     ) : topic.subtopics.map((sub, si) => (
// //                                       <div key={si} style={{ display:'inline-flex', alignItems:'center', gap:'0.3rem', padding:'0.2rem 0.3rem 0.2rem 0.65rem', borderRadius:'0.4rem', background:'rgba(99,102,241,0.12)', border:'1px solid rgba(99,102,241,0.25)' }}>
// //                                         <span style={{ fontSize:'0.72rem', fontWeight:700, color:'#818cf8' }}>{sub}</span>
// //                                         {/* DELETE subtopic — tiny X */}
// //                                         <button
// //                                           onClick={() => {
// //                                             if (window.confirm(`Delete subtopic "${sub}"?`)) deleteSubtopic(lang, topicIdx, si);
// //                                           }}
// //                                           title="Delete subtopic"
// //                                           style={{ background:'none', border:'none', color:'#64748b', cursor:'pointer', fontSize:'0.7rem', padding:'0 0.1rem', lineHeight:1, fontWeight:900 }}
// //                                           onMouseEnter={e => e.currentTarget.style.color='#f87171'}
// //                                           onMouseLeave={e => e.currentTarget.style.color='#64748b'}
// //                                         >✕</button>
// //                                       </div>
// //                                     ))}
// //                                   </div>
// //                                   <div style={{ display:'flex', gap:'0.5rem' }}>
// //                                     <input value={newSubtopics[topicKey]||''} onChange={e => setNewSubtopics(p=>({...p,[topicKey]:e.target.value}))} onKeyDown={e => e.key==='Enter' && addSubtopic(lang,topicIdx)} placeholder={`Add subtopic to ${topic.name}`} style={{ ...iStyle, fontSize:'0.78rem' }} />
// //                                     <button onClick={() => addSubtopic(lang,topicIdx)} style={{ ...bStyle('#6366f1'), padding:'0.45rem 0.875rem', fontSize:'0.7rem' }}>+ Subtopic</button>
// //                                   </div>
// //                                 </div>

// //                                 {/* Content items */}
// //                                 <div>
// //                                   <p style={{ fontSize:'0.6rem', fontWeight:900, color:'#475569', letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:'0.6rem' }}>Content — Learn · Practice · Test · Slides</p>

// //                                   <div style={{ display:'flex', flexDirection:'column', gap:'0.4rem', marginBottom:'0.75rem' }}>
// //                                     {!topic.content?.length ? (
// //                                       <p style={{ fontSize:'0.75rem', color:'#475569' }}>No content yet.</p>
// //                                     ) : topic.content.map((item, ci) => {
// //                                       const cfg = contentCfg(item.type);
// //                                       return (
// //                                         <div key={ci} style={{ display:'flex', alignItems:'center', gap:'0.75rem', padding:'0.6rem 0.875rem', background:'rgba(15,23,42,0.7)', borderRadius:'0.6rem', border:'1px solid #1e293b' }}>
// //                                           <span style={{ fontSize:'1rem', flexShrink:0 }}>{cfg.icon}</span>
// //                                           <div style={{ flex:1, minWidth:0 }}>
// //                                             <p style={{ fontSize:'0.8rem', fontWeight:700, color:'#e2e8f0', margin:0, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{item.title}</p>
// //                                             <p style={{ fontSize:'0.62rem', color:'#64748b', margin:0 }}>{item.type==='ppt' ? item.fileSize : item.duration}</p>
// //                                           </div>
// //                                           <span style={pillS(cfg.color)}>{cfg.tag}</span>
// //                                           {item.type==='ppt' && item.downloadUrl && (
// //                                             <a href={item.downloadUrl} target="_blank" rel="noreferrer"
// //                                               style={{ fontSize:'0.62rem', fontWeight:800, padding:'0.2rem 0.55rem', borderRadius:'0.4rem', background:'rgba(139,92,246,0.15)', color:'#a78bfa', border:'1px solid rgba(139,92,246,0.3)', textDecoration:'none', flexShrink:0 }}>
// //                                               ⬇
// //                                             </a>
// //                                           )}
// //                                           {/* DELETE content item */}
// //                                           <DeleteButton
// //                                             itemName={`"${item.title}"`}
// //                                             onConfirm={() => deleteContent(lang, topicIdx, ci)}
// //                                           />
// //                                         </div>
// //                                       );
// //                                     })}
// //                                   </div>

// //                                   {/* THE INLINE ADD CONTENT FORM */}
// //                                   <div style={{ background:'rgba(15,23,42,0.5)', borderRadius:'0.75rem', padding:'0.875rem', border:'1px solid #1e293b' }}>
// //                                     <p style={{ fontSize:'0.6rem', fontWeight:800, color:'#475569', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:'0.6rem' }}>Add Content</p>
// //                                     <div style={{ display:'flex', gap:'0.4rem', marginBottom:'0.6rem', flexWrap:'wrap' }}>
// //                                       {CONTENT_TYPES.map(ct => {
// //                                         const isActive = newContent[topicKey]?.type === ct.key;
// //                                         return (
// //                                           <button key={ct.key} type="button"
// //                                             onClick={() => {
// //                                               setNewContent(p => ({ ...p, [topicKey]: { ...p[topicKey], type:ct.key } }));
// //                                               setPptKey(ct.key==='ppt' ? (pptKey===topicKey ? null : topicKey) : null);
// //                                             }}
// //                                             style={{ padding:'0.35rem 0.75rem', borderRadius:'0.45rem', fontWeight:800, fontSize:'0.68rem', border:`1px solid ${isActive?ct.color:'#334155'}`, background:isActive?`${ct.color}22`:'transparent', color:isActive?ct.color:'#64748b', cursor:'pointer', transition:'all 0.15s' }}>
// //                                             {ct.icon} {ct.label}
// //                                           </button>
// //                                         );
// //                                       })}
// //                                     </div>
// //                                     {pptKey === topicKey ? (
// //                                       <PPTUploader langId={lang.id} topicIdx={topicIdx} onUploaded={item => handlePPTUploaded(lang, topicIdx, item)} />
// //                                     ) : newContent[topicKey]?.type && newContent[topicKey].type!=='ppt' && (
// //                                       <div style={{ display:'flex', gap:'0.5rem' }}>
// //                                         <input value={newContent[topicKey]?.title||''} onChange={e => setNewContent(p=>({...p,[topicKey]:{...p[topicKey],title:e.target.value}}))} onKeyDown={e => e.key==='Enter' && addContent(lang,topicIdx)} placeholder="Content title" style={{ ...iStyle, fontSize:'0.78rem' }} />
// //                                         <input value={newContent[topicKey]?.duration||''} onChange={e => setNewContent(p=>({...p,[topicKey]:{...p[topicKey],duration:e.target.value}}))} placeholder="Duration (e.g., 45 Mins)" style={{ ...iStyle, width:'130px', flex:'none', fontSize:'0.78rem' }} />
// //                                         <button onClick={() => addContent(lang,topicIdx)} style={bStyle('#10b981')}>+ Add</button>
// //                                       </div>
// //                                     )}
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
// //                       <p style={{ fontSize:'0.6rem', fontWeight:900, color:'#475569', letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:'0.5rem' }}>+ Add Topic to {lang.name}</p>
// //                       <div style={{ display:'flex', gap:'0.6rem' }}>
// //                         <input value={newTopics[lang.id]||''} onChange={e => setNewTopics(p=>({...p,[lang.id]:e.target.value}))} onKeyDown={e => e.key==='Enter' && addTopic(lang)} placeholder="e.g., I/O Basics, Arrays, OOP" style={iStyle} />
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
























// import React, { useState, useEffect, useRef } from 'react';
// import {
//   collection, getDocs, addDoc, updateDoc, deleteDoc,
//   doc, serverTimestamp, query, orderBy
// } from 'firebase/firestore';
// import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
// import { db, storage } from '../../firebase/config';
// import DeleteButton from '../ui/Deletebutton';

// const CONTENT_TYPES = [
//   { key: 'lesson', label: 'Intro Lesson',    icon: '📖', color: '#3b82f6', tag: 'Learning' },
//   { key: 'mcq',    label: 'MCQ Practice',    icon: '📋', color: '#f59e0b', tag: 'Practice' },
//   { key: 'coding', label: 'Coding Question', icon: '💻', color: '#10b981', tag: 'Coding'   },
//   { key: 'ppt',    label: 'PPT Slides',      icon: '📊', color: '#8b5cf6', tag: 'Slides'   },
// ];

// const LANG_ICONS = {
//   Python: '🐍', Java: '☕', JavaScript: '🟨',
//   C: '⚙️', 'C++': '⚡', SQL: '🗄️', default: '📘'
// };

// const iStyle = {
//   flex: 1, background: '#0f172a', border: '1px solid #334155',
//   borderRadius: '0.6rem', padding: '0.55rem 0.875rem',
//   color: '#f1f5f9', fontSize: '0.82rem', outline: 'none'
// };
// const bStyle = (color = '#3b82f6', extra = {}) => ({
//   padding: '0.5rem 1.1rem', borderRadius: '0.6rem', background: color,
//   color: '#fff', fontWeight: 800, fontSize: '0.75rem',
//   border: 'none', cursor: 'pointer', whiteSpace: 'nowrap', ...extra
// });
// const cardS = (border = '#1e293b') => ({
//   background: 'rgba(15,23,42,0.6)', border: `1px solid ${border}`,
//   borderRadius: '0.875rem', overflow: 'hidden', transition: 'border-color 0.2s'
// });
// const pillS = (color) => ({
//   fontSize: '0.6rem', fontWeight: 800, padding: '0.15rem 0.55rem',
//   borderRadius: '999px', background: `${color}22`, color,
//   letterSpacing: '0.06em', flexShrink: 0
// });

// /* ─────────────────────────────────────────────────────────────────────────────
//    PPT UPLOADER
// ───────────────────────────────────────────────────────────────────────────── */
// function PPTUploader({ langId, topicIdx, onUploaded }) {
//   const fileRef = useRef();
//   const [uploading, setUploading] = useState(false);
//   const [progress, setProgress]   = useState(0);
//   const [pptTitle, setPptTitle]   = useState('');
//   const [file, setFile]           = useState(null);
//   const [err, setErr]             = useState('');

//   const pick = (e) => {
//     const f = e.target.files[0];
//     if (!f) return;
//     setErr(''); setFile(f);
//     if (!pptTitle) setPptTitle(f.name.replace(/\.[^/.]+$/, ''));
//   };

//   const upload = () => {
//     if (!file)         { setErr('Choose a file first.'); return; }
//     if (!pptTitle.trim()) { setErr('Enter a title.'); return; }
//     setUploading(true); setErr('');
//     const sRef = ref(storage, `learning_ppts/${langId}/topic_${topicIdx}/${Date.now()}_${file.name}`);
//     const task = uploadBytesResumable(sRef, file);
//     task.on(
//       'state_changed',
//       s => setProgress(Math.round((s.bytesTransferred / s.totalBytes) * 100)),
//       e => { setErr('Upload failed.'); setUploading(false); console.error(e); },
//       () => getDownloadURL(task.snapshot.ref).then(url => {
//         onUploaded({
//           type: 'ppt', title: pptTitle.trim(), fileName: file.name,
//           fileSize: (file.size / 1024 / 1024).toFixed(2) + ' MB',
//           downloadUrl: url, storagePath: task.snapshot.ref.fullPath
//         });
//         setPptTitle(''); setFile(null); setProgress(0); setUploading(false);
//         if (fileRef.current) fileRef.current.value = '';
//       })
//     );
//   };

//   return (
//     <div style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: '0.75rem', padding: '0.875rem', marginTop: '0.5rem' }}>
//       <p style={{ fontSize: '0.6rem', fontWeight: 900, color: '#a78bfa', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.6rem' }}>📊 Upload File (PPT / PDF / DOC / Video / Image)</p>
//       <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.6rem', flexWrap: 'wrap' }}>
//         <input ref={fileRef} type="file" accept="*/*" onChange={pick} style={{ display: 'none' }} id={`ppt-${langId}-${topicIdx}`} />
//         <label htmlFor={`ppt-${langId}-${topicIdx}`} style={bStyle('rgba(139,92,246,0.2)', { border: '1px solid rgba(139,92,246,0.4)', color: '#a78bfa', cursor: 'pointer' })}>
//           📎 Choose File
//         </label>
//         {file && <span style={{ fontSize: '0.75rem', color: '#94a3b8', alignSelf: 'center', fontFamily: 'monospace' }}>{file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</span>}
//       </div>
//       <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.6rem' }}>
//         <input value={pptTitle} onChange={e => setPptTitle(e.target.value)} placeholder="File title" style={{ ...iStyle, fontSize: '0.78rem' }} />
//         <button onClick={upload} disabled={uploading || !file} style={bStyle('#8b5cf6', { opacity: uploading || !file ? 0.5 : 1 })}>
//           {uploading ? `${progress}%` : '⬆ Upload'}
//         </button>
//       </div>
//       {uploading && (
//         <div style={{ background: '#1e293b', borderRadius: '999px', height: '6px', overflow: 'hidden' }}>
//           <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg,#8b5cf6,#6366f1)', transition: 'width 0.3s', borderRadius: '999px' }} />
//         </div>
//       )}
//       {err && <p style={{ fontSize: '0.72rem', color: '#f87171', marginTop: '0.4rem' }}>{err}</p>}
//     </div>
//   );
// }

// /* ─────────────────────────────────────────────────────────────────────────────
//    MCQ FORM  — add a single MCQ question inline
// ───────────────────────────────────────────────────────────────────────────── */
// function MCQForm({ onAdd }) {
//   const [q, setQ]         = useState('');
//   const [opts, setOpts]   = useState(['', '', '', '']);
//   const [correct, setCorrect] = useState(0);
//   const [exp, setExp]     = useState('');

//   const setOpt = (i, v) => { const a = [...opts]; a[i] = v; setOpts(a); };

//   const submit = () => {
//     if (!q.trim() || opts.some(o => !o.trim())) { alert('Fill question and all 4 options'); return; }
//     onAdd({ type: 'mcq', title: q.trim(), options: opts, correctIndex: correct, explanation: exp.trim(), duration: '20 Mins' });
//     setQ(''); setOpts(['', '', '', '']); setCorrect(0); setExp('');
//   };

//   return (
//     <div style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '0.75rem', padding: '0.875rem', marginTop: '0.5rem' }}>
//       <p style={{ fontSize: '0.6rem', fontWeight: 900, color: '#fbbf24', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.6rem' }}>🧠 Add MCQ Question</p>
//       <textarea value={q} onChange={e => setQ(e.target.value)} placeholder="Enter your question..." rows={2}
//         style={{ ...iStyle, width: '100%', resize: 'none', marginBottom: '0.6rem', boxSizing: 'border-box' }} />
//       <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem', marginBottom: '0.6rem' }}>
//         {opts.map((o, i) => (
//           <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.3rem 0.5rem', borderRadius: '0.5rem', border: `1px solid ${correct === i ? '#10b981' : '#334155'}`, background: correct === i ? 'rgba(16,185,129,0.08)' : 'transparent' }}>
//             <button type="button" onClick={() => setCorrect(i)}
//               style={{ width: '1rem', height: '1rem', borderRadius: '50%', border: `2px solid ${correct === i ? '#10b981' : '#475569'}`, background: correct === i ? '#10b981' : 'transparent', cursor: 'pointer', flexShrink: 0 }} />
//             <span style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 800 }}>{String.fromCharCode(65 + i)}.</span>
//             <input value={o} onChange={e => setOpt(i, e.target.value)} placeholder={`Option ${String.fromCharCode(65 + i)}`}
//               style={{ ...iStyle, padding: '0.25rem 0.4rem', fontSize: '0.75rem' }} />
//           </div>
//         ))}
//       </div>
//       <input value={exp} onChange={e => setExp(e.target.value)} placeholder="Explanation (optional)" style={{ ...iStyle, marginBottom: '0.6rem', width: '100%', boxSizing: 'border-box' }} />
//       <button onClick={submit} style={bStyle('#f59e0b')}>+ Add MCQ</button>
//     </div>
//   );
// }

// /* ─────────────────────────────────────────────────────────────────────────────
//    CODING QUESTION FORM
// ───────────────────────────────────────────────────────────────────────────── */
// function CodingForm({ onAdd }) {
//   const [title, setTitle]   = useState('');
//   const [diff, setDiff]     = useState('Easy');
//   const [tags, setTags]     = useState('');
//   const [desc, setDesc]     = useState('');

//   const submit = () => {
//     if (!title.trim()) { alert('Title required'); return; }
//     onAdd({ type: 'coding', title: title.trim(), difficulty: diff, tags: tags.trim(), description: desc.trim(), duration: '30 Mins' });
//     setTitle(''); setDiff('Easy'); setTags(''); setDesc('');
//   };

//   const DIFFS = [
//     { label: 'Easy',   color: '#10b981' },
//     { label: 'Medium', color: '#f59e0b' },
//     { label: 'Hard',   color: '#ef4444' },
//   ];

//   return (
//     <div style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '0.75rem', padding: '0.875rem', marginTop: '0.5rem' }}>
//       <p style={{ fontSize: '0.6rem', fontWeight: 900, color: '#34d399', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.6rem' }}>💻 Add Coding Question</p>
//       <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.6rem', flexWrap: 'wrap' }}>
//         <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Question title (e.g. Two Sum)"
//           style={{ ...iStyle, flex: 2 }} />
//         <div style={{ display: 'flex', gap: '0.25rem', background: '#0f172a', padding: '0.2rem', borderRadius: '0.5rem', border: '1px solid #334155' }}>
//           {DIFFS.map(d => (
//             <button key={d.label} type="button" onClick={() => setDiff(d.label)}
//               style={{ padding: '0.3rem 0.6rem', borderRadius: '0.35rem', fontWeight: 800, fontSize: '0.65rem', border: 'none', cursor: 'pointer', background: diff === d.label ? d.color : 'transparent', color: diff === d.label ? '#fff' : '#64748b', transition: 'all .15s' }}>
//               {d.label}
//             </button>
//           ))}
//         </div>
//       </div>
//       <input value={tags} onChange={e => setTags(e.target.value)} placeholder="Tags: arrays, loops, dp"
//         style={{ ...iStyle, marginBottom: '0.6rem', width: '100%', boxSizing: 'border-box' }} />
//       <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={2} placeholder="Problem description (optional)"
//         style={{ ...iStyle, width: '100%', resize: 'none', marginBottom: '0.6rem', boxSizing: 'border-box' }} />
//       <button onClick={submit} style={bStyle('#10b981')}>+ Add Question</button>
//     </div>
//   );
// }

// /* ─────────────────────────────────────────────────────────────────────────────
//    MAIN COMPONENT
// ───────────────────────────────────────────────────────────────────────────── */
// export default function LearningModules({ moduleData }) {
//   const [languages, setLanguages]       = useState([]);
//   const [expandedLang, setExpandedLang] = useState(null);
//   const [expandedTopic, setExpandedTopic] = useState(null);

//   // Which sub-panel is open per topic: null | 'coding' | 'mcq' | 'ppt' | 'lesson'
//   const [activePanel, setActivePanel]   = useState({});

//   const [loading, setLoading]           = useState(true);
//   const [newLang, setNewLang]           = useState('');
//   const [newTopics, setNewTopics]       = useState({});
//   const [newSubtopics, setNewSubtopics] = useState({});
//   const [creatingLang, setCreatingLang] = useState(false);

//   /* ── fetch ── */
//   const fetchAll = async () => {
//     setLoading(true);
//     try {
//       const snap = await getDocs(query(collection(db, 'learningLanguages'), orderBy('createdAt')));
//       setLanguages(snap.docs.map(d => ({ id: d.id, ...d.data() })));
//     } catch (e) { console.error(e); }
//     setLoading(false);
//   };
//   useEffect(() => { fetchAll(); }, []);

//   /* ── delete language ── */
//   const deleteLang = async (lang) => {
//     await deleteDoc(doc(db, 'learningLanguages', lang.id));
//     if (expandedLang === lang.id) setExpandedLang(null);
//     await fetchAll();
//   };

//   /* ── delete topic ── */
//   const deleteTopic = async (lang, topicIdx) => {
//     const topics = lang.topics.filter((_, i) => i !== topicIdx);
//     await updateDoc(doc(db, 'learningLanguages', lang.id), { topics });
//     const key = `${lang.id}-${topicIdx}`;
//     if (expandedTopic === key) setExpandedTopic(null);
//     await fetchAll();
//   };

//   /* ── delete subtopic ── */
//   const deleteSubtopic = async (lang, topicIdx, subIdx) => {
//     const topics = lang.topics.map((t, i) =>
//       i === topicIdx ? { ...t, subtopics: t.subtopics.filter((_, si) => si !== subIdx) } : t
//     );
//     await updateDoc(doc(db, 'learningLanguages', lang.id), { topics });
//     await fetchAll();
//   };

//   /* ── delete content item ── */
//   const deleteContent = async (lang, topicIdx, contentIdx) => {
//     const item = lang.topics[topicIdx].content[contentIdx];
//     if (item.type === 'ppt' && item.storagePath) {
//       try { await deleteObject(ref(storage, item.storagePath)); } catch {}
//     }
//     const topics = lang.topics.map((t, i) =>
//       i === topicIdx ? { ...t, content: t.content.filter((_, ci) => ci !== contentIdx) } : t
//     );
//     await updateDoc(doc(db, 'learningLanguages', lang.id), { topics });
//     await fetchAll();
//   };

//   /* ── create language ── */
//   const createLang = async () => {
//     if (!newLang.trim()) return;
//     setCreatingLang(true);
//     try {
//       await addDoc(collection(db, 'learningLanguages'), {
//         name: newLang.trim(), topics: [], createdAt: serverTimestamp()
//       });
//       setNewLang(''); await fetchAll();
//     } catch { alert('Failed to create language.'); }
//     setCreatingLang(false);
//   };

//   /* ── add topic ── */
//   const addTopic = async (lang) => {
//     const name = (newTopics[lang.id] || '').trim();
//     if (!name) return;
//     const newTopic = { id: name.toLowerCase().replace(/\s+/g, '-'), name, subtopics: [], content: [] };
//     await updateDoc(doc(db, 'learningLanguages', lang.id), { topics: [...(lang.topics || []), newTopic] });
//     setNewTopics(p => ({ ...p, [lang.id]: '' }));
//     await fetchAll();
//   };

//   /* ── add subtopic ── */
//   const addSubtopic = async (lang, topicIdx) => {
//     const key  = `${lang.id}-${topicIdx}`;
//     const name = (newSubtopics[key] || '').trim();
//     if (!name) return;
//     const topics = lang.topics.map((t, i) =>
//       i === topicIdx ? { ...t, subtopics: [...(t.subtopics || []), name] } : t
//     );
//     await updateDoc(doc(db, 'learningLanguages', lang.id), { topics });
//     setNewSubtopics(p => ({ ...p, [key]: '' }));
//     await fetchAll();
//   };

//   /* ── add content item (lesson / mcq / coding / ppt) ── */
//   const addContentItem = async (lang, topicIdx, item) => {
//     const topics = lang.topics.map((t, i) =>
//       i === topicIdx
//         ? { ...t, content: [...(t.content || []), { ...item, createdAt: new Date().toISOString() }] }
//         : t
//     );
//     await updateDoc(doc(db, 'learningLanguages', lang.id), { topics });
//     await fetchAll();
//   };

//   /* ── toggle sub-panel ── */
//   const togglePanel = (topicKey, panelKey) => {
//     setActivePanel(prev => ({
//       ...prev,
//       [topicKey]: prev[topicKey] === panelKey ? null : panelKey
//     }));
//   };

//   const langIcon    = (name) => LANG_ICONS[name] || LANG_ICONS.default;
//   const contentCfg  = (type) => CONTENT_TYPES.find(c => c.key === type) || CONTENT_TYPES[0];

//   /* ────────────────────────────────────────────────────────────────────────── */
//   return (
//     <div>
//       {/* ── Create language ── */}
//       <div style={{ ...cardS('#1e3a5f'), padding: '1.25rem', marginBottom: '1.5rem' }}>
//         <p style={{ fontSize: '0.6rem', fontWeight: 900, color: '#64748b', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
//           + Create Language
//         </p>
//         <div style={{ display: 'flex', gap: '0.75rem' }}>
//           <input value={newLang} onChange={e => setNewLang(e.target.value)}
//             onKeyDown={e => e.key === 'Enter' && createLang()}
//             placeholder="e.g., Python, Java, SQL" style={iStyle} />
//           <button onClick={createLang} disabled={creatingLang} style={bStyle()}>
//             {creatingLang ? '...' : 'Create'}
//           </button>
//         </div>
//       </div>

//       {/* ── Language list ── */}
//       {loading ? (
//         <div style={{ textAlign: 'center', padding: '3rem', color: '#475569' }}>Loading...</div>
//       ) : languages.length === 0 ? (
//         <div style={{ textAlign: 'center', padding: '4rem', color: '#334155' }}>
//           <p style={{ fontSize: '2.5rem' }}>📘</p>
//           <p style={{ fontWeight: 700, color: '#64748b', marginTop: '0.5rem' }}>No languages yet. Create one above.</p>
//         </div>
//       ) : (
//         <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
//           {languages.map(lang => {
//             const isLangOpen = expandedLang === lang.id;

//             return (
//               <div key={lang.id} style={cardS(isLangOpen ? '#3b82f6' : '#1e293b')}>

//                 {/* ── Language header ── */}
//                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.25rem' }}>
//                   <div onClick={() => setExpandedLang(isLangOpen ? null : lang.id)}
//                     style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, cursor: 'pointer' }}>
//                     <span style={{ fontSize: '1.5rem' }}>{langIcon(lang.name)}</span>
//                     <div>
//                       <p style={{ fontWeight: 900, fontSize: '1rem', color: '#f1f5f9', margin: 0 }}>{lang.name}</p>
//                       <p style={{ fontSize: '0.65rem', color: '#64748b', margin: 0 }}>{lang.topics?.length || 0} topics</p>
//                     </div>
//                     {/* Topic pills */}
//                     <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginLeft: '0.5rem' }}>
//                       {lang.topics?.slice(0, 3).map((t, i) => (
//                         <span key={i} style={{ fontSize: '0.62rem', padding: '0.15rem 0.55rem', borderRadius: '999px', background: 'rgba(59,130,246,0.12)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.25)', fontWeight: 700 }}>{t.name}</span>
//                       ))}
//                       {lang.topics?.length > 3 && <span style={{ fontSize: '0.62rem', color: '#475569' }}>+{lang.topics.length - 3}</span>}
//                     </div>
//                   </div>
//                   <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
//                     <span onClick={() => setExpandedLang(isLangOpen ? null : lang.id)}
//                       style={{ color: '#475569', fontSize: '0.8rem', display: 'inline-block', transform: isLangOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s', cursor: 'pointer' }}>▼</span>
//                     <DeleteButton itemName={`language "${lang.name}" and all its topics`} onConfirm={() => deleteLang(lang)} />
//                   </div>
//                 </div>

//                 {/* ── Language body ── */}
//                 {isLangOpen && (
//                   <div style={{ borderTop: '1px solid #1e293b', padding: '1.25rem' }}>

//                     {/* Topics */}
//                     <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
//                       {!lang.topics?.length ? (
//                         <p style={{ color: '#475569', fontSize: '0.8rem' }}>No topics yet. Add one below.</p>
//                       ) : lang.topics.map((topic, topicIdx) => {
//                         const topicKey    = `${lang.id}-${topicIdx}`;
//                         const isTopicOpen = expandedTopic === topicKey;
//                         const pptCount    = topic.content?.filter(c => c.type === 'ppt').length || 0;
//                         const mcqCount    = topic.content?.filter(c => c.type === 'mcq').length || 0;
//                         const codingCount = topic.content?.filter(c => c.type === 'coding').length || 0;
//                         const curPanel    = activePanel[topicKey] || null;

//                         return (
//                           <div key={topicIdx} style={{ background: 'rgba(30,41,59,0.6)', border: '1px solid #334155', borderRadius: '0.75rem', overflow: 'hidden' }}>

//                             {/* Topic header */}
//                             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem' }}>
//                               <div onClick={() => setExpandedTopic(isTopicOpen ? null : topicKey)}
//                                 style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flex: 1, cursor: 'pointer' }}>
//                                 {/* completion dot */}
//                                 <div style={{ width: '1.4rem', height: '1.4rem', borderRadius: '50%', background: topic.content?.length ? '#10b981' : '#1e293b', border: `2px solid ${topic.content?.length ? '#10b981' : '#334155'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
//                                   {topic.content?.length ? <span style={{ fontSize: '0.55rem', color: '#fff' }}>✓</span> : null}
//                                 </div>
//                                 <div>
//                                   <p style={{ fontWeight: 800, fontSize: '0.875rem', color: '#e2e8f0', margin: 0 }}>
//                                     <span style={{ fontSize: '0.58rem', color: '#64748b', marginRight: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>TOPIC</span>
//                                     {topic.name}
//                                   </p>
//                                   <p style={{ fontSize: '0.62rem', color: '#64748b', margin: 0 }}>
//                                     {topic.subtopics?.length || 0} subtopics · {topic.content?.length || 0} items
//                                     {codingCount > 0 && <span style={{ marginLeft: '0.35rem', color: '#10b981' }}>· 💻 {codingCount}</span>}
//                                     {mcqCount > 0    && <span style={{ marginLeft: '0.35rem', color: '#f59e0b' }}>· 🧠 {mcqCount}</span>}
//                                     {pptCount > 0    && <span style={{ marginLeft: '0.35rem', color: '#a78bfa' }}>· 📊 {pptCount}</span>}
//                                   </p>
//                                 </div>
//                               </div>
//                               <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}>
//                                 <span onClick={() => setExpandedTopic(isTopicOpen ? null : topicKey)}
//                                   style={{ color: '#475569', fontSize: '0.75rem', transform: isTopicOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s', cursor: 'pointer', display: 'inline-block' }}>▼</span>
//                                 <DeleteButton itemName={`topic "${topic.name}"`} onConfirm={() => deleteTopic(lang, topicIdx)} />
//                               </div>
//                             </div>

//                             {/* Topic body */}
//                             {isTopicOpen && (
//                               <div style={{ borderTop: '1px solid #1e293b', padding: '1rem' }}>

//                                 {/* ── 3 BIG ACTION BUTTONS ── */}
//                                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
//                                   {[
//                                     { key: 'coding', icon: '💻', label: 'Coding Questions', color: '#10b981', count: codingCount },
//                                     { key: 'mcq',    icon: '🧠', label: 'MCQ Practice',     color: '#f59e0b', count: mcqCount    },
//                                     { key: 'ppt',    icon: '📊', label: 'PPT / Files',       color: '#8b5cf6', count: pptCount    },
//                                   ].map(btn => (
//                                     <button key={btn.key}
//                                       onClick={() => togglePanel(topicKey, btn.key)}
//                                       style={{
//                                         padding: '1rem 0.75rem', borderRadius: '0.75rem', cursor: 'pointer', textAlign: 'center',
//                                         border: `1px solid ${curPanel === btn.key ? btn.color : '#334155'}`,
//                                         background: curPanel === btn.key ? `${btn.color}18` : 'rgba(15,23,42,0.5)',
//                                         transition: 'all 0.2s',
//                                       }}>
//                                       <div style={{ fontSize: '1.5rem', marginBottom: '0.3rem' }}>{btn.icon}</div>
//                                       <div style={{ fontSize: '0.72rem', fontWeight: 800, color: curPanel === btn.key ? btn.color : '#94a3b8' }}>{btn.label}</div>
//                                       <div style={{ fontSize: '0.6rem', color: '#475569', marginTop: '0.2rem' }}>{btn.count} items</div>
//                                     </button>
//                                   ))}
//                                 </div>

//                                 {/* ── CODING PANEL ── */}
//                                 {curPanel === 'coding' && (
//                                   <div style={{ marginBottom: '1rem' }}>
//                                     <p style={{ fontSize: '0.6rem', fontWeight: 900, color: '#34d399', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.6rem' }}>💻 Coding Questions</p>
//                                     {/* existing items */}
//                                     <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '0.5rem' }}>
//                                       {topic.content?.filter(c => c.type === 'coding').map((item, ci) => {
//                                         const realIdx = topic.content.indexOf(item);
//                                         const diffC   = item.difficulty === 'Easy' ? '#10b981' : item.difficulty === 'Medium' ? '#f59e0b' : '#ef4444';
//                                         return (
//                                           <div key={ci} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0.875rem', background: 'rgba(15,23,42,0.7)', borderRadius: '0.6rem', border: '1px solid #1e293b' }}>
//                                             <span style={{ fontSize: '1rem' }}>💻</span>
//                                             <div style={{ flex: 1, minWidth: 0 }}>
//                                               <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#e2e8f0', margin: 0 }}>{item.title}</p>
//                                               <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.2rem', flexWrap: 'wrap' }}>
//                                                 {item.difficulty && <span style={{ fontSize: '0.58rem', fontWeight: 800, padding: '0.1rem 0.4rem', borderRadius: '0.3rem', background: `${diffC}22`, color: diffC }}>{item.difficulty}</span>}
//                                                 {item.tags && item.tags.split(',').map(t => <span key={t} style={{ fontSize: '0.58rem', background: 'rgba(99,102,241,0.15)', color: '#818cf8', padding: '0.1rem 0.35rem', borderRadius: '0.25rem' }}>{t.trim()}</span>)}
//                                               </div>
//                                             </div>
//                                             <DeleteButton itemName={`"${item.title}"`} onConfirm={() => deleteContent(lang, topicIdx, realIdx)} />
//                                           </div>
//                                         );
//                                       })}
//                                       {!topic.content?.some(c => c.type === 'coding') && (
//                                         <p style={{ fontSize: '0.75rem', color: '#475569' }}>No coding questions yet.</p>
//                                       )}
//                                     </div>
//                                     <CodingForm onAdd={item => addContentItem(lang, topicIdx, item)} />
//                                   </div>
//                                 )}

//                                 {/* ── MCQ PANEL ── */}
//                                 {curPanel === 'mcq' && (
//                                   <div style={{ marginBottom: '1rem' }}>
//                                     <p style={{ fontSize: '0.6rem', fontWeight: 900, color: '#fbbf24', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.6rem' }}>🧠 MCQ Questions</p>
//                                     <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.5rem' }}>
//                                       {topic.content?.filter(c => c.type === 'mcq').map((item, ci) => {
//                                         const realIdx = topic.content.indexOf(item);
//                                         return (
//                                           <div key={ci} style={{ padding: '0.75rem', background: 'rgba(15,23,42,0.7)', borderRadius: '0.6rem', border: '1px solid #1e293b' }}>
//                                             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.5rem' }}>
//                                               <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#e2e8f0', margin: 0, flex: 1 }}>Q{ci + 1}. {item.title}</p>
//                                               <DeleteButton itemName={`"${item.title}"`} onConfirm={() => deleteContent(lang, topicIdx, realIdx)} />
//                                             </div>
//                                             {item.options && (
//                                               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.3rem' }}>
//                                                 {item.options.map((opt, oi) => (
//                                                   <div key={oi} style={{ padding: '0.3rem 0.6rem', borderRadius: '0.4rem', border: `1px solid ${oi === item.correctIndex ? '#10b981' : '#1e293b'}`, background: oi === item.correctIndex ? 'rgba(16,185,129,0.1)' : 'rgba(15,23,42,0.5)', fontSize: '0.72rem', color: oi === item.correctIndex ? '#34d399' : '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
//                                                     <span style={{ fontWeight: 800, fontSize: '0.6rem' }}>{String.fromCharCode(65 + oi)}.</span> {opt}
//                                                     {oi === item.correctIndex && <span style={{ marginLeft: 'auto', fontSize: '0.6rem', color: '#10b981' }}>✓</span>}
//                                                   </div>
//                                                 ))}
//                                               </div>
//                                             )}
//                                           </div>
//                                         );
//                                       })}
//                                       {!topic.content?.some(c => c.type === 'mcq') && (
//                                         <p style={{ fontSize: '0.75rem', color: '#475569' }}>No MCQs yet.</p>
//                                       )}
//                                     </div>
//                                     <MCQForm onAdd={item => addContentItem(lang, topicIdx, item)} />
//                                   </div>
//                                 )}

//                                 {/* ── PPT / FILES PANEL ── */}
//                                 {curPanel === 'ppt' && (
//                                   <div style={{ marginBottom: '1rem' }}>
//                                     <p style={{ fontSize: '0.6rem', fontWeight: 900, color: '#a78bfa', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.6rem' }}>📊 Files & Slides</p>
//                                     <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '0.5rem' }}>
//                                       {topic.content?.filter(c => c.type === 'ppt').map((item, ci) => {
//                                         const realIdx = topic.content.indexOf(item);
//                                         return (
//                                           <div key={ci} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0.875rem', background: 'rgba(15,23,42,0.7)', borderRadius: '0.6rem', border: '1px solid #1e293b' }}>
//                                             <span style={{ fontSize: '1rem' }}>📊</span>
//                                             <div style={{ flex: 1, minWidth: 0 }}>
//                                               <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#e2e8f0', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</p>
//                                               <p style={{ fontSize: '0.62rem', color: '#64748b', margin: 0 }}>{item.fileSize || ''}</p>
//                                             </div>
//                                             <span style={pillS('#8b5cf6')}>Slides</span>
//                                             {item.downloadUrl && (
//                                               <a href={item.downloadUrl} target="_blank" rel="noreferrer"
//                                                 style={{ fontSize: '0.62rem', fontWeight: 800, padding: '0.2rem 0.55rem', borderRadius: '0.4rem', background: 'rgba(139,92,246,0.15)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.3)', textDecoration: 'none', flexShrink: 0 }}>⬇</a>
//                                             )}
//                                             <DeleteButton itemName={`"${item.title}"`} onConfirm={() => deleteContent(lang, topicIdx, realIdx)} />
//                                           </div>
//                                         );
//                                       })}
//                                       {!topic.content?.some(c => c.type === 'ppt') && (
//                                         <p style={{ fontSize: '0.75rem', color: '#475569' }}>No files uploaded yet.</p>
//                                       )}
//                                     </div>
//                                     <PPTUploader langId={lang.id} topicIdx={topicIdx}
//                                       onUploaded={item => addContentItem(lang, topicIdx, item)} />
//                                   </div>
//                                 )}

//                                 {/* ── Subtopics ── */}
//                                 <div style={{ marginBottom: '1rem' }}>
//                                   <p style={{ fontSize: '0.6rem', fontWeight: 900, color: '#475569', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.6rem' }}>Subtopics</p>
//                                   <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.6rem' }}>
//                                     {!topic.subtopics?.length ? (
//                                       <span style={{ fontSize: '0.75rem', color: '#475569' }}>No subtopics yet.</span>
//                                     ) : topic.subtopics.map((sub, si) => (
//                                       <div key={si} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.2rem 0.3rem 0.2rem 0.65rem', borderRadius: '0.4rem', background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)' }}>
//                                         <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#818cf8' }}>{sub}</span>
//                                         <button onClick={() => { if (window.confirm(`Delete subtopic "${sub}"?`)) deleteSubtopic(lang, topicIdx, si); }}
//                                           style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '0.7rem', padding: '0 0.1rem', fontWeight: 900 }}
//                                           onMouseEnter={e => e.currentTarget.style.color = '#f87171'}
//                                           onMouseLeave={e => e.currentTarget.style.color = '#64748b'}>✕</button>
//                                       </div>
//                                     ))}
//                                   </div>
//                                   <div style={{ display: 'flex', gap: '0.5rem' }}>
//                                     <input value={newSubtopics[topicKey] || ''} onChange={e => setNewSubtopics(p => ({ ...p, [topicKey]: e.target.value }))}
//                                       onKeyDown={e => e.key === 'Enter' && addSubtopic(lang, topicIdx)}
//                                       placeholder={`Add subtopic to ${topic.name}`} style={{ ...iStyle, fontSize: '0.78rem' }} />
//                                     <button onClick={() => addSubtopic(lang, topicIdx)} style={{ ...bStyle('#6366f1'), padding: '0.45rem 0.875rem', fontSize: '0.7rem' }}>+ Subtopic</button>
//                                   </div>
//                                 </div>

//                               </div>
//                             )}
//                           </div>
//                         );
//                       })}
//                     </div>

//                     {/* Add topic */}
//                     <div>
//                       <p style={{ fontSize: '0.6rem', fontWeight: 900, color: '#475569', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
//                         + Add Topic to {lang.name}
//                       </p>
//                       <div style={{ display: 'flex', gap: '0.6rem' }}>
//                         <input value={newTopics[lang.id] || ''} onChange={e => setNewTopics(p => ({ ...p, [lang.id]: e.target.value }))}
//                           onKeyDown={e => e.key === 'Enter' && addTopic(lang)}
//                           placeholder="e.g., I/O Basics, Arrays, OOP" style={iStyle} />
//                         <button onClick={() => addTopic(lang)} style={bStyle()}>+ Add Topic</button>
//                       </div>
//                     </div>

//                   </div>
//                 )}
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
//  }


// import React, { useState, useEffect } from 'react';
// import { doc, updateDoc, onSnapshot } from 'firebase/firestore';
// import { db } from '../../firebase/config';

// const iStyle = { flex: 1, background: '#0f172a', border: '1px solid #334155', borderRadius: '0.6rem', padding: '0.55rem 0.875rem', color: '#f1f5f9', fontSize: '0.82rem', outline: 'none' };
// const bStyle = (color = '#3b82f6') => ({ padding: '0.5rem 1.1rem', borderRadius: '0.6rem', background: color, color: '#fff', fontWeight: 800, fontSize: '0.75rem', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' });

// export default function LearningModules({ moduleData, onOpenTopic }) {
//   const [topics, setTopics] = useState(moduleData?.topics || []);
//   const [newTopic, setNewTopic] = useState('');
//   const [newSubtopics, setNewSubtopics] = useState({});

//   useEffect(() => {
//     if (!moduleData?.id) return;
//     const unsub = onSnapshot(doc(db, 'categories', moduleData.id), (docSnap) => {
//       if (docSnap.exists()) {
//         setTopics(docSnap.data().topics || []);
//       }
//     });
//     return () => unsub();
//   }, [moduleData]);

//   const addTopic = async () => {
//     if (!newTopic.trim()) return;
//     const topicId = newTopic.trim().toLowerCase().replace(/[^a-z0-9]/g, '-');
    
//     // FIXED: Initialize codingQuestionIds and mcqIds arrays
//     const updatedTopics = [...topics, { 
//       id: topicId, 
//       name: newTopic.trim(), 
//       subtopics: [],
//       codingQuestionIds: [],
//       mcqIds: [] 
//     }];
    
//     await updateDoc(doc(db, 'categories', moduleData.id), { topics: updatedTopics });
//     setNewTopic('');
//   };

//   const deleteTopic = async (idx) => {
//     if (!window.confirm("Are you sure you want to delete this topic and all its contents?")) return;
//     const updatedTopics = topics.filter((_, i) => i !== idx);
//     await updateDoc(doc(db, 'categories', moduleData.id), { topics: updatedTopics });
//   };

//   const addSubtopic = async (topicId, idx) => {
//     const val = newSubtopics[topicId];
//     if (!val?.trim()) return;
//     const updatedTopics = topics.map((t, i) => i === idx ? { ...t, subtopics: [...(t.subtopics || []), val.trim()] } : t);
//     await updateDoc(doc(db, 'categories', moduleData.id), { topics: updatedTopics });
//     setNewSubtopics(p => ({ ...p, [topicId]: '' }));
//   };

//   const deleteSubtopic = async (topicIdx, subIdx) => {
//     if (!window.confirm("Remove this subtopic?")) return;
//     const updatedTopics = topics.map((t, i) => i === topicIdx ? { ...t, subtopics: t.subtopics.filter((_, j) => j !== subIdx) } : t);
//     await updateDoc(doc(db, 'categories', moduleData.id), { topics: updatedTopics });
//   };

//   return (
//     <div className="space-y-6">
//       <div style={{ background: 'rgba(30,41,59,0.7)', border: '1px solid #334155', borderRadius: '1rem', padding: '1.25rem' }}>
//         <p style={{ fontSize: '0.6rem', fontWeight: 900, color: '#64748b', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
//           + Add Topic to {moduleData?.name}
//         </p>
//         <div style={{ display: 'flex', gap: '0.75rem' }}>
//           <input 
//             value={newTopic} 
//             onChange={e => setNewTopic(e.target.value)} 
//             onKeyDown={e => e.key === 'Enter' && addTopic()} 
//             placeholder="e.g., I/O Basics, Arrays, OOP Concepts" 
//             style={iStyle} 
//           />
//           <button onClick={addTopic} style={bStyle()}>+ Add Topic</button>
//         </div>
//       </div>

//       {topics.length === 0 ? (
//         <div className="text-center py-12 text-gray-500 text-sm border-2 border-dashed border-gray-700 rounded-2xl">
//           No topics exist in <strong>{moduleData?.name}</strong> yet. <br/>Create a topic above to start adding content.
//         </div>
//       ) : (
//         <div className="space-y-4">
//           {topics.map((topic, idx) => (
//             <div key={topic.id || idx} style={{ background: 'rgba(15,23,42,0.6)', border: '1px solid #1e293b', borderRadius: '1rem', overflow: 'hidden' }}>
//               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.25rem' }}>
//                 <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
//                   <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 font-black text-xs">
//                     {idx + 1}
//                   </div>
//                   <div>
//                     <h3 className="text-base font-black text-white m-0">{topic.name}</h3>
//                     <p className="text-xs text-gray-500 m-0 mt-1">{topic.subtopics?.length || 0} subtopics configured</p>
//                   </div>
//                 </div>
//                 <div style={{ display: 'flex', gap: '0.5rem' }}>
//                   <button onClick={() => onOpenTopic(moduleData, topic)} style={{ ...bStyle('#10b981'), background: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)' }}>
//                     ✏️ Open Topic
//                   </button>
//                   <button onClick={() => deleteTopic(idx)} style={{ ...bStyle('#ef4444'), background: 'rgba(239,68,68,0.15)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)' }}>
//                     🗑 Delete
//                   </button>
//                 </div>
//               </div>
//               <div style={{ borderTop: '1px solid #1e293b', padding: '1rem 1.25rem', background: 'rgba(30,41,59,0.3)' }}>
//                 <div className="flex flex-wrap gap-2 mb-3">
//                   {topic.subtopics?.length > 0 ? topic.subtopics.map((sub, si) => (
//                     <div key={si} className="flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 px-3 py-1 rounded-full text-xs font-bold">
//                       {sub}
//                       <button onClick={() => deleteSubtopic(idx, si)} className="text-indigo-400 hover:text-red-400 ml-1 font-black">✕</button>
//                     </div>
//                   )) : <span className="text-xs text-gray-600">No subtopics defined.</span>}
//                 </div>
//                 <div className="flex gap-2">
//                   <input 
//                     value={newSubtopics[topic.id] || ''} 
//                     onChange={e => setNewSubtopics(p => ({ ...p, [topic.id]: e.target.value }))} 
//                     onKeyDown={e => e.key === 'Enter' && addSubtopic(topic.id, idx)} 
//                     placeholder="Add subtopic name..." 
//                     style={{ ...iStyle, padding: '0.4rem 0.8rem', fontSize: '0.75rem' }} 
//                   />
//                   <button onClick={() => addSubtopic(topic.id, idx)} style={{ ...bStyle('#6366f1'), padding: '0.4rem 1rem', fontSize: '0.7rem' }}>+ Add</button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }


/////


// import React, { useState, useEffect, useRef, useMemo } from 'react';
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";
// import {
//   collection, getDocs, addDoc, updateDoc, deleteDoc,
//   doc, serverTimestamp, query, orderBy
// } from 'firebase/firestore';
// import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
// import { db, storage } from '../../firebase/config';
// import DeleteButton from '../ui/Deletebutton';

// // ── Configuration & Constants ──────────────────────────────────────────────

// const LANGUAGES = [
//   { id: "python", label: "Python", judge0Id: 71, defaultBoilerplate: `# Do not modify the function signature\ndef solution(nums):\n    pass` },
//   { id: "javascript", label: "JavaScript", judge0Id: 93, defaultBoilerplate: `function solution(nums) {\n    \n}` },
//   { id: "java", label: "Java", judge0Id: 62, defaultBoilerplate: `public class Main {\n    public static void solution(int[] nums) {}\n}` },
//   { id: "c", label: "C", judge0Id: 50, defaultBoilerplate: `#include <stdio.h>\nvoid solution(int* nums, int n) {}` },
//   { id: "cpp", label: "C++", judge0Id: 54, defaultBoilerplate: `#include <bits/stdc++.h>\nusing namespace std;\nvoid solution(vector<int>& nums) {}` },
// ];

// const LANG_ICONS = { Python: '🐍', Java: '☕', JavaScript: '🟨', C: '⚙️', 'C++': '⚡', default: '📘' };

// const iStyle = {
//   flex: 1, background: '#0f172a', border: '1px solid #334155',
//   borderRadius: '0.6rem', padding: '0.55rem 0.875rem',
//   color: '#f1f5f9', fontSize: '0.82rem', outline: 'none', width: '100%', boxSizing: 'border-box'
// };

// const bStyle = (color = '#3b82f6', extra = {}) => ({
//   padding: '0.5rem 1.1rem', borderRadius: '0.6rem', background: color,
//   color: '#fff', fontWeight: 800, fontSize: '0.75rem',
//   border: 'none', cursor: 'pointer', whiteSpace: 'nowrap', ...extra
// });

// const cardS = (border = '#1e293b') => ({
//   background: 'rgba(15,23,42,0.6)', border: `1px solid ${border}`,
//   borderRadius: '0.875rem', overflow: 'hidden', transition: 'border-color 0.2s'
// });

// // ── Shared Utility Components ──────────────────────────────────────────────

// function BoilerplateEditor({ boilerplates, onChange, timeLimitMs, onTimeLimitChange }) {
//   const [activeLang, setActiveLang] = useState(LANGUAGES[0].id);
//   const lang = LANGUAGES.find(l => l.id === activeLang);

//   return (
//     <div style={{ background: "rgba(15,23,42,0.7)", border: "1px solid #334155", borderRadius: "1rem", overflow: "hidden", marginTop: '1rem' }}>
//       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.8rem 1rem", borderBottom: "1px solid #1e293b", background: "rgba(30,41,59,0.5)" }}>
//         <p style={{ fontSize: "0.65rem", fontWeight: 900, color: "#60a5fa", letterSpacing: "0.1em", textTransform: "uppercase", margin: 0 }}>⚙️ Boilerplate Code</p>
//         <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
//           <span style={{ fontSize: "0.65rem", color: "#94a3b8" }}>⏱ {timeLimitMs}ms</span>
//           <div style={{ display: "flex", gap: "0.25rem" }}>
//             {[1000, 2000, 5000].map(ms => (
//               <button key={ms} type="button" onClick={() => onTimeLimitChange(ms)} style={{ padding: "0.2rem 0.4rem", borderRadius: "0.3rem", fontSize: "0.6rem", border: "none", background: timeLimitMs === ms ? "#3b82f6" : "#1e293b", color: "#fff" }}>{ms / 1000}s</button>
//             ))}
//           </div>
//         </div>
//       </div>
//       <div style={{ display: "flex", background: "rgba(15,23,42,0.4)" }}>
//         {LANGUAGES.map(l => (
//           <button key={l.id} type="button" onClick={() => setActiveLang(l.id)} style={{ padding: "0.5rem 0.8rem", fontSize: "0.7rem", fontWeight: 700, border: "none", background: activeLang === l.id ? "rgba(59,130,246,0.1)" : "transparent", color: activeLang === l.id ? "#60a5fa" : "#64748b", borderBottom: activeLang === l.id ? "2px solid #3b82f6" : "none" }}>{l.label}</button>
//         ))}
//       </div>
//       <textarea
//         value={boilerplates[activeLang]}
//         onChange={e => onChange({ ...boilerplates, [activeLang]: e.target.value })}
//         rows={10}
//         style={{ width: "100%", background: "#0f172a", border: "none", padding: "0.8rem", color: "#e2e8f0", fontFamily: "monospace", fontSize: "0.75rem", outline: "none", resize: "vertical" }}
//       />
//     </div>
//   );
// }

// // ── Feature Forms ──────────────────────────────────────────────────────────

// /* 1. ADVANCED CODING FORM */
// function CodingForm({ onAdd }) {
//   const [title, setTitle] = useState('');
//   const [diff, setDiff] = useState('Easy');
//   const [desc, setDesc] = useState('');
//   const [marks, setMarks] = useState(100);
//   const [timeLimit, setTimeLimit] = useState(2000);
//   const [testCases, setTestCases] = useState([{ input: "", expectedOutput: "" }]);
  
//   const initialBoilerplates = useMemo(() => {
//     const map = {};
//     LANGUAGES.forEach(l => { map[l.id] = l.defaultBoilerplate; });
//     return map;
//   }, []);
//   const [boilerplates, setBoilerplates] = useState(initialBoilerplates);

//   const submit = () => {
//     if (!title.trim()) { alert('Title required'); return; }
//     onAdd({ type: 'coding', title: title.trim(), difficulty: diff, description: desc, marks, testCases, boilerplates, timeLimitMs: timeLimit, duration: '30 Mins' });
//     setTitle(''); setDesc(''); setTestCases([{ input: "", expectedOutput: "" }]);
//   };

//   return (
//     <div style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '0.8rem', padding: '1.25rem', marginTop: '1rem' }}>
//       <p style={{ fontSize: '0.65rem', fontWeight: 900, color: '#34d399', textTransform: 'uppercase', marginBottom: '0.8rem' }}>💻 New Coding Question</p>
//       <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.8rem' }}>
//         <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Question title" style={{ ...iStyle, flex: 2 }} />
//         <div style={{ display: 'flex', gap: '0.2rem', background: '#0f172a', padding: '0.2rem', borderRadius: '0.5rem', border: '1px solid #334155' }}>
//           {['Easy', 'Medium', 'Hard'].map(d => (
//             <button key={d} onClick={() => setDiff(d)} style={{ padding: '0.3rem 0.6rem', borderRadius: '0.3rem', fontSize: '0.65rem', fontWeight: 800, border: 'none', background: diff === d ? (d === 'Easy' ? '#10b981' : d === 'Medium' ? '#f59e0b' : '#ef4444') : 'transparent', color: diff === d ? '#fff' : '#64748b' }}>{d}</button>
//           ))}
//         </div>
//       </div>
//       <div style={{ marginBottom: '0.8rem' }}>
//         <label style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block', marginBottom: '0.3rem' }}>Description</label>
//         <div style={{ background: 'white', borderRadius: '0.5rem', overflow: 'hidden' }}>
//           <ReactQuill theme="snow" value={desc} onChange={setDesc} style={{ color: 'black', height: '120px', marginBottom: '40px' }} />
//         </div>
//       </div>
//       <div style={{ width: '120px', marginBottom: '0.8rem' }}><label style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Marks</label><input type="number" value={marks} onChange={e => setMarks(Number(e.target.value))} style={iStyle} /></div>
//       <div style={{ background: '#0f172a', padding: '0.8rem', borderRadius: '0.6rem', marginBottom: '0.8rem' }}>
//         <p style={{ fontSize: '0.65rem', fontWeight: 800, color: '#60a5fa', marginBottom: '0.5rem' }}>TEST CASES</p>
//         {testCases.map((tc, i) => (
//           <div key={i} style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.4rem' }}>
//             <textarea placeholder="Input" value={tc.input} onChange={e => { const n = [...testCases]; n[i].input = e.target.value; setTestCases(n); }} style={{ ...iStyle, height: '50px' }} />
//             <textarea placeholder="Output" value={tc.expectedOutput} onChange={e => { const n = [...testCases]; n[i].expectedOutput = e.target.value; setTestCases(n); }} style={{ ...iStyle, height: '50px' }} />
//             <button onClick={() => setTestCases(testCases.filter((_, idx) => idx !== i))} style={{ background: '#ef444422', color: '#ef4444', border: 'none', borderRadius: '0.4rem', padding: '0 0.5rem' }}>✕</button>
//           </div>
//         ))}
//         <button onClick={() => setTestCases([...testCases, { input: "", expectedOutput: "" }])} style={{ background: 'none', border: 'none', color: '#60a5fa', fontSize: '0.7rem', fontWeight: 700 }}>+ Add Test Case</button>
//       </div>
//       <BoilerplateEditor boilerplates={boilerplates} onChange={setBoilerplates} timeLimitMs={timeLimit} onTimeLimitChange={setTimeLimit} />
//       <button onClick={submit} style={{ ...bStyle('#10b981'), width: '100%', marginTop: '1rem', padding: '0.8rem' }}>Save Coding Question</button>
//     </div>
//   );
// }

// /* 2. MCQ FORM */
// function MCQForm({ onAdd }) {
//   const [q, setQ] = useState('');
//   const [opts, setOpts] = useState(['', '', '', '']);
//   const [correct, setCorrect] = useState(0);
//   const submit = () => {
//     if (!q.trim() || opts.some(o => !o.trim())) { alert('Fill all fields'); return; }
//     onAdd({ type: 'mcq', title: q.trim(), options: opts, correctIndex: correct, duration: '20 Mins' });
//     setQ(''); setOpts(['', '', '', '']);
//   };
//   return (
//     <div style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '0.8rem', padding: '1rem', marginTop: '1rem' }}>
//       <p style={{ fontSize: '0.65rem', fontWeight: 900, color: '#fbbf24', textTransform: 'uppercase', marginBottom: '0.6rem' }}>🧠 Add MCQ Question</p>
//       <textarea value={q} onChange={e => setQ(e.target.value)} placeholder="Question text..." rows={2} style={{ ...iStyle, marginBottom: '0.6rem' }} />
//       <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem', marginBottom: '0.6rem' }}>
//         {opts.map((o, i) => (
//           <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem', borderRadius: '0.5rem', border: `1px solid ${correct === i ? '#10b981' : '#334155'}` }}>
//             <input type="radio" checked={correct === i} onChange={() => setCorrect(i)} />
//             <input value={o} onChange={e => { const a = [...opts]; a[i] = e.target.value; setOpts(a); }} placeholder={`Option ${i+1}`} style={{ ...iStyle, padding: '0.2rem' }} />
//           </div>
//         ))}
//       </div>
//       <button onClick={submit} style={bStyle('#f59e0b')}>+ Add MCQ</button>
//     </div>
//   );
// }

// /* 3. PPT UPLOADER */
// function PPTUploader({ langId, topicIdx, onUploaded }) {
//   const [file, setFile] = useState(null);
//   const [title, setTitle] = useState('');
//   const [uploading, setUploading] = useState(false);
//   const upload = () => {
//     if (!file || !title) return;
//     setUploading(true);
//     const sRef = ref(storage, `learning_ppts/${langId}/topic_${topicIdx}/${Date.now()}_${file.name}`);
//     const task = uploadBytesResumable(sRef, file);
//     task.on('state_changed', null, null, () => getDownloadURL(task.snapshot.ref).then(url => {
//       onUploaded({ type: 'ppt', title: title.trim(), downloadUrl: url, storagePath: task.snapshot.ref.fullPath });
//       setFile(null); setTitle(''); setUploading(false);
//     }));
//   };
//   return (
//     <div style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: '0.8rem', padding: '1rem', marginTop: '1rem' }}>
//       <p style={{ fontSize: '0.65rem', fontWeight: 900, color: '#a78bfa', textTransform: 'uppercase', marginBottom: '0.6rem' }}>📊 Upload PPT / Files</p>
//       <input type="file" onChange={e => setFile(e.target.files[0])} style={{ marginBottom: '0.5rem', fontSize: '0.75rem' }} />
//       <div style={{ display: 'flex', gap: '0.5rem' }}>
//         <input value={title} onChange={e => setTitle(e.target.value)} placeholder="File Title" style={iStyle} />
//         <button onClick={upload} disabled={uploading} style={bStyle('#8b5cf6')}>{uploading ? '...' : 'Upload'}</button>
//       </div>
//     </div>
//   );
// }

// // ── Main Page Component ───────────────────────────────────────────────────

// export default function LearningModules() {
//   const [languages, setLanguages] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [expandedLang, setExpandedLang] = useState(null);
//   const [expandedTopic, setExpandedTopic] = useState(null);
//   const [activePanel, setActivePanel] = useState({}); // Stores which panel is open for each topic
//   const [newLang, setNewLang] = useState('');
//   const [newTopics, setNewTopics] = useState({});

//   // const fetchAll = async () => {
//   //   setLoading(true);
//   //   const snap = await getDocs(query(collection(db, 'learningLanguages'), orderBy('createdAt')));
//   //   setLanguages(snap.docs.map(d => ({ id: d.id, ...d.data() })));
//   //   setLoading(false);
//   // };

//   // useEffect(() => { fetchAll(); }, []); 

//   const fetchAll = async () => {
//   setLoading(true);
//   const snap = await getDocs(query(collection(db, 'learningLanguages'), orderBy('createdAt')));
//   setLanguages(snap.docs.map(d => ({ id: d.id, ...d.data() })));
//   setLoading(false);
// };

// const addTopic = async (lang) => {
//   const name = newTopics[lang.id]?.trim();
//   if (!name) return;
//   const updatedTopics = [...(lang.topics || []), { name, content: [] }];
//   await updateDoc(doc(db, 'learningLanguages', lang.id), { topics: updatedTopics });
//   setNewTopics(prev => ({ ...prev, [lang.id]: '' }));
//   fetchAll();
// };

// useEffect(() => { fetchAll(); }, []);

//   const addContentItem = async (lang, topicIdx, item) => {
//     const topics = lang.topics.map((t, i) => i === topicIdx ? { ...t, content: [...(t.content || []), { ...item, createdAt: new Date().toISOString() }] } : t);
//     await updateDoc(doc(db, 'learningLanguages', lang.id), { topics });
//     fetchAll();
//   };

//   const deleteContent = async (lang, topicIdx, contentIdx) => {
//     const item = lang.topics[topicIdx].content[contentIdx];
//     if (item.type === 'ppt' && item.storagePath) { try { await deleteObject(ref(storage, item.storagePath)); } catch {} }
//     const topics = lang.topics.map((t, i) => i === topicIdx ? { ...t, content: t.content.filter((_, ci) => ci !== contentIdx) } : t);
//     await updateDoc(doc(db, 'learningLanguages', lang.id), { topics });
//     fetchAll();
//   };

//   return (
//     <div style={{ padding: '2rem', color: '#f1f5f9', background: '#020617', minHeight: '100vh' }}>
      
//       <div style={{ background: 'rgba(15,23,42,0.6)', border: '1px solid #1e3a5f', padding: '1.25rem', borderRadius: '1rem', marginBottom: '2rem' }}>
//         <p style={{ fontSize: '0.65rem', fontWeight: 900, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.8rem' }}>+ Create Language</p>
//         <div style={{ display: 'flex', gap: '0.8rem' }}>
//           <input value={newLang} onChange={e => setNewLang(e.target.value)} placeholder="e.g. Python" style={iStyle} />
//           <button onClick={() => { if(newLang) addDoc(collection(db, 'learningLanguages'), { name: newLang, topics: [], createdAt: serverTimestamp() }).then(() => {setNewLang(''); fetchAll();})}} style={bStyle()}>Create</button>
//         </div>
//       </div>

//       {loading ? <p>Loading...</p> : languages.map(lang => (
//         <div key={lang.id} style={cardS(expandedLang === lang.id ? '#3b82f6' : '#1e293b')}>
//           <div onClick={() => setExpandedLang(expandedLang === lang.id ? null : lang.id)} style={{ padding: '1rem 1.25rem', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//             <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
//               <span style={{ fontSize: '1.4rem' }}>{LANG_ICONS[lang.name] || '📘'}</span>
//               <p style={{ fontWeight: 900, fontSize: '0.95rem' }}>{lang.name}</p>
//             </div>
//             <span>{expandedLang === lang.id ? '▲' : '▼'}</span>
//           </div>

//           {expandedLang === lang.id && (
//             <div style={{ padding: '1.25rem', borderTop: '1px solid #1e293b' }}>
//               {lang.topics?.map((topic, tIdx) => {
//                 const tKey = `${lang.id}-${tIdx}`;
//                 const curPanel = activePanel[tKey];
//                 const codingCount = topic.content?.filter(c => c.type === 'coding').length || 0;
//                 const mcqCount = topic.content?.filter(c => c.type === 'mcq').length || 0;
//                 const pptCount = topic.content?.filter(c => c.type === 'ppt').length || 0;

//                 return (
//                   <div key={tIdx} style={{ background: 'rgba(30,41,59,0.5)', border: '1px solid #334155', borderRadius: '0.875rem', marginBottom: '1rem', overflow: 'hidden' }}>
//                     <div onClick={() => setExpandedTopic(expandedTopic === tKey ? null : tKey)} style={{ padding: '0.8rem 1rem', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                       <p style={{ fontWeight: 800, fontSize: '0.85rem' }}>{topic.name}</p>
//                       <div style={{ display: 'flex', gap: '0.6rem', fontSize: '0.65rem', color: '#64748b' }}>
//                          <span>💻 {codingCount}</span> <span>🧠 {mcqCount}</span> <span>📊 {pptCount}</span>
//                       </div>
//                     </div>

//                     {expandedTopic === tKey && (
//                       <div style={{ padding: '1rem', borderTop: '1px solid #1e293b' }}>
                        
//                         {/* ── 3 ICON BUTTONS SIDE BY SIDE ── */}
//                         <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
//                           <button onClick={() => setActivePanel({...activePanel, [tKey]: 'coding'})} style={{ padding: '1rem', borderRadius: '0.75rem', border: `1px solid ${curPanel === 'coding' ? '#10b981' : '#334155'}`, background: curPanel === 'coding' ? '#10b98115' : 'transparent', cursor: 'pointer', textAlign: 'center' }}>
//                             <div style={{ fontSize: '1.4rem' }}>💻</div>
//                             <div style={{ fontSize: '0.7rem', fontWeight: 800, color: curPanel === 'coding' ? '#10b981' : '#94a3b8' }}>Coding</div>
//                           </button>
//                           <button onClick={() => setActivePanel({...activePanel, [tKey]: 'mcq'})} style={{ padding: '1rem', borderRadius: '0.75rem', border: `1px solid ${curPanel === 'mcq' ? '#f59e0b' : '#334155'}`, background: curPanel === 'mcq' ? '#f59e0b15' : 'transparent', cursor: 'pointer', textAlign: 'center' }}>
//                             <div style={{ fontSize: '1.4rem' }}>🧠</div>
//                             <div style={{ fontSize: '0.7rem', fontWeight: 800, color: curPanel === 'mcq' ? '#f59e0b' : '#94a3b8' }}>MCQs</div>
//                           </button>
//                           <button onClick={() => setActivePanel({...activePanel, [tKey]: 'ppt'})} style={{ padding: '1rem', borderRadius: '0.75rem', border: `1px solid ${curPanel === 'ppt' ? '#8b5cf6' : '#334155'}`, background: curPanel === 'ppt' ? '#8b5cf615' : 'transparent', cursor: 'pointer', textAlign: 'center' }}>
//                             <div style={{ fontSize: '1.4rem' }}>📊</div>
//                             <div style={{ fontSize: '0.7rem', fontWeight: 800, color: curPanel === 'ppt' ? '#8b5cf6' : '#94a3b8' }}>Files</div>
//                           </button>
//                         </div>

//                         {/* ── FORM DISPLAY ── */}
//                         {curPanel === 'coding' && <CodingForm onAdd={item => addContentItem(lang, tIdx, item)} />}
//                         {curPanel === 'mcq' && <MCQForm onAdd={item => addContentItem(lang, tIdx, item)} />}
//                         {curPanel === 'ppt' && <PPTUploader langId={lang.id} topicIdx={tIdx} onUploaded={item => addContentItem(lang, tIdx, item)} />}

//                         {/* List Items Below */}
//                         <div style={{ marginTop: '1rem' }}>
//                           {topic.content?.map((item, ci) => (
//                             <div key={ci} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0.75rem', background: '#0f172a', borderRadius: '0.5rem', marginBottom: '0.4rem', border: '1px solid #1e293b' }}>
//                               <span style={{ fontSize: '0.75rem' }}>{item.type === 'coding' ? '💻' : item.type === 'mcq' ? '🧠' : '📊'} {item.title}</span>
//                               <DeleteButton itemName={item.title} onConfirm={() => deleteContent(lang, tIdx, ci)} />
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 );
//               })}
//               <div style={{ display: 'flex', gap: '0.6rem', marginTop: '1rem' }}>
//                 <input value={newTopics[lang.id] || ''} onChange={e => setNewTopics({...newTopics, [lang.id]: e.target.value})} placeholder="New Topic Name" style={iStyle} />
//                 <button onClick={() => {if(newTopics[lang.id]) addTopic(lang)}} style={bStyle()}>+ Topic</button>
//               </div>
//             </div>
//           )}
//         </div>
//       ))}
//     </div>
//   );
// }  


// // // import React, { useState, useEffect, useRef } from 'react';
// // // import {
// // //   collection, getDocs, addDoc, updateDoc, deleteDoc,
// // //   doc, serverTimestamp, query, orderBy
// // // } from 'firebase/firestore';
// // // import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
// // // import { db, storage } from '../../firebase/config';
// // // import DeleteButton from '../ui/DeleteButton';

// // // const CONTENT_TYPES = [
// // //   { key: 'lesson', label: 'Intro Lesson',   icon: '📖', color: '#3b82f6', tag: 'Learning' },
// // //   { key: 'mcq',    label: 'MCQ Practice',    icon: '📋', color: '#f59e0b', tag: 'Practice' },
// // //   { key: 'coding', label: 'Coding Question', icon: '💻', color: '#10b981', tag: 'Coding'   },
// // //   { key: 'ppt',    label: 'PPT Slides',      icon: '📊', color: '#8b5cf6', tag: 'Slides'   },
// // // ];

// // // const LANG_ICONS = { Python:'🐍', Java:'☕', JavaScript:'🟨', C:'⚙️', 'C++':'⚡', SQL:'🗄️', default:'📘' };

// // // const iStyle = { flex:1, background:'#0f172a', border:'1px solid #334155', borderRadius:'0.6rem', padding:'0.55rem 0.875rem', color:'#f1f5f9', fontSize:'0.82rem', outline:'none' };
// // // const bStyle = (color='#3b82f6', extra={}) => ({ padding:'0.5rem 1.1rem', borderRadius:'0.6rem', background:color, color:'#fff', fontWeight:800, fontSize:'0.75rem', border:'none', cursor:'pointer', whiteSpace:'nowrap', ...extra });
// // // const cardS  = (border='#1e293b') => ({ background:'rgba(15,23,42,0.6)', border:`1px solid ${border}`, borderRadius:'0.875rem', overflow:'hidden', transition:'border-color 0.2s' });
// // // const pillS  = (color) => ({ fontSize:'0.6rem', fontWeight:800, padding:'0.15rem 0.55rem', borderRadius:'999px', background:`${color}22`, color, letterSpacing:'0.06em', flexShrink:0 });

// // // /* ── PPT Uploader ─────────────────────────────────────────────────────────── */
// // // function PPTUploader({ langId, topicIdx, onUploaded }) {
// // //   const fileRef = useRef();
// // //   const [uploading, setUploading] = useState(false);
// // //   const [progress, setProgress]   = useState(0);
// // //   const [pptTitle, setPptTitle]   = useState('');
// // //   const [file, setFile]           = useState(null);
// // //   const [err, setErr]             = useState('');

// // //   const pick = (e) => {
// // //     const f = e.target.files[0];
// // //     if (!f) return;
// // //     if (!f.name.match(/\.(pptx?|ppt)$/i)) { setErr('Only .ppt / .pptx files allowed.'); return; }
// // //     setErr(''); setFile(f);
// // //     if (!pptTitle) setPptTitle(f.name.replace(/\.(pptx?|ppt)$/i, ''));
// // //   };

// // //   const upload = () => {
// // //     if (!file) { setErr('Choose a file first.'); return; }
// // //     if (!pptTitle.trim()) { setErr('Enter a title.'); return; }
// // //     setUploading(true); setErr('');
// // //     const sRef = ref(storage, `learning_ppts/${langId}/topic_${topicIdx}/${Date.now()}_${file.name}`);
// // //     const task = uploadBytesResumable(sRef, file);
// // //     task.on('state_changed',
// // //       s => setProgress(Math.round((s.bytesTransferred / s.totalBytes) * 100)),
// // //       e => { setErr('Upload failed.'); setUploading(false); console.error(e); },
// // //       () => getDownloadURL(task.snapshot.ref).then(url => {
// // //         onUploaded({ type:'ppt', title:pptTitle.trim(), fileName:file.name, fileSize:(file.size/1024/1024).toFixed(2)+' MB', downloadUrl:url, storagePath:task.snapshot.ref.fullPath });
// // //         setPptTitle(''); setFile(null); setProgress(0); setUploading(false);
// // //         if (fileRef.current) fileRef.current.value = '';
// // //       })
// // //     );
// // //   };

// // //   return (
// // //     <div style={{ background:'rgba(139,92,246,0.06)', border:'1px solid rgba(139,92,246,0.2)', borderRadius:'0.75rem', padding:'0.875rem', marginTop:'0.5rem' }}>
// // //       <p style={{ fontSize:'0.6rem', fontWeight:900, color:'#a78bfa', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:'0.6rem' }}>📊 Upload PPT Slides</p>
// // //       <div style={{ display:'flex', gap:'0.5rem', marginBottom:'0.6rem', flexWrap:'wrap' }}>
// // //         <input ref={fileRef} type="file" accept=".ppt,.pptx" onChange={pick} style={{ display:'none' }} id={`ppt-${langId}-${topicIdx}`} />
// // //         <label htmlFor={`ppt-${langId}-${topicIdx}`} style={bStyle('rgba(139,92,246,0.2)', { border:'1px solid rgba(139,92,246,0.4)', color:'#a78bfa', cursor:'pointer' })}>📎 Choose File</label>
// // //         {file && <span style={{ fontSize:'0.75rem', color:'#94a3b8', alignSelf:'center', fontFamily:'monospace' }}>{file.name} ({(file.size/1024/1024).toFixed(2)} MB)</span>}
// // //       </div>
// // //       <div style={{ display:'flex', gap:'0.5rem', marginBottom:'0.6rem' }}>
// // //         <input value={pptTitle} onChange={e => setPptTitle(e.target.value)} placeholder="Presentation title" style={{ ...iStyle, fontSize:'0.78rem' }} />
// // //         <button onClick={upload} disabled={uploading || !file} style={bStyle('#8b5cf6', { opacity: uploading||!file ? 0.5:1 })}>{uploading ? `${progress}%` : '⬆ Upload'}</button>
// // //       </div>
// // //       {uploading && <div style={{ background:'#1e293b', borderRadius:'999px', height:'6px', overflow:'hidden' }}><div style={{ height:'100%', width:`${progress}%`, background:'linear-gradient(90deg,#8b5cf6,#6366f1)', transition:'width 0.3s', borderRadius:'999px' }} /></div>}
// // //       {err && <p style={{ fontSize:'0.72rem', color:'#f87171', marginTop:'0.4rem' }}>{err}</p>}
// // //     </div>
// // //   );
// // // }

// // // /* ── Main ─────────────────────────────────────────────────────────────────── */
// // // export default function LearningModules() {
// // //   const [languages, setLanguages]         = useState([]);
// // //   const [expandedLang, setExpandedLang]   = useState(null);
// // //   const [expandedTopic, setExpandedTopic] = useState(null);
// // //   const [loading, setLoading]             = useState(true);
// // //   const [newLang, setNewLang]             = useState('');
// // //   const [newTopics, setNewTopics]         = useState({});
// // //   const [newSubtopics, setNewSubtopics]   = useState({});
// // //   const [newContent, setNewContent]       = useState({});
// // //   const [creatingLang, setCreatingLang]   = useState(false);
// // //   const [pptKey, setPptKey]               = useState(null);

// // //   const fetch = async () => {
// // //     setLoading(true);
// // //     try {
// // //       const snap = await getDocs(query(collection(db, 'learningLanguages'), orderBy('createdAt')));
// // //       setLanguages(snap.docs.map(d => ({ id: d.id, ...d.data() })));
// // //     } catch(e) { console.error(e); }
// // //     setLoading(false);
// // //   };

// // //   useEffect(() => { fetch(); }, []);

// // //   /* ── Delete language (entire doc) ── */
// // //   const deleteLang = async (lang) => {
// // //     await deleteDoc(doc(db, 'learningLanguages', lang.id));
// // //     if (expandedLang === lang.id) setExpandedLang(null);
// // //     await fetch();
// // //   };

// // //   /* ── Delete topic ── */
// // //   const deleteTopic = async (lang, topicIdx) => {
// // //     const topics = lang.topics.filter((_, i) => i !== topicIdx);
// // //     await updateDoc(doc(db, 'learningLanguages', lang.id), { topics });
// // //     const key = `${lang.id}-${topicIdx}`;
// // //     if (expandedTopic === key) setExpandedTopic(null);
// // //     await fetch();
// // //   };

// // //   /* ── Delete subtopic ── */
// // //   const deleteSubtopic = async (lang, topicIdx, subIdx) => {
// // //     const topics = lang.topics.map((t, i) =>
// // //       i === topicIdx ? { ...t, subtopics: t.subtopics.filter((_, si) => si !== subIdx) } : t
// // //     );
// // //     await updateDoc(doc(db, 'learningLanguages', lang.id), { topics });
// // //     await fetch();
// // //   };

// // //   /* ── Delete content item ── */
// // //   const deleteContent = async (lang, topicIdx, contentIdx) => {
// // //     const item = lang.topics[topicIdx].content[contentIdx];
// // //     // If PPT, also delete from Firebase Storage
// // //     if (item.type === 'ppt' && item.storagePath) {
// // //       try { await deleteObject(ref(storage, item.storagePath)); } catch(e) { console.warn('Storage delete failed:', e); }
// // //     }
// // //     const topics = lang.topics.map((t, i) =>
// // //       i === topicIdx ? { ...t, content: t.content.filter((_, ci) => ci !== contentIdx) } : t
// // //     );
// // //     await updateDoc(doc(db, 'learningLanguages', lang.id), { topics });
// // //     await fetch();
// // //   };

// // //   /* ── Create language ── */
// // //   const createLang = async () => {
// // //     if (!newLang.trim()) return;
// // //     setCreatingLang(true);
// // //     try { await addDoc(collection(db, 'learningLanguages'), { name: newLang.trim(), topics: [], createdAt: serverTimestamp() }); setNewLang(''); await fetch(); }
// // //     catch { alert('Failed to create language.'); }
// // //     setCreatingLang(false);
// // //   };

// // //   /* ── Add topic ── */
// // //   const addTopic = async (lang) => {
// // //     const name = (newTopics[lang.id] || '').trim();
// // //     if (!name) return;
// // //     await updateDoc(doc(db, 'learningLanguages', lang.id), { topics: [...(lang.topics||[]), { name, subtopics:[], content:[] }] });
// // //     setNewTopics(p => ({ ...p, [lang.id]:'' }));
// // //     await fetch();
// // //   };

// // //   /* ── Add subtopic ── */
// // //   const addSubtopic = async (lang, topicIdx) => {
// // //     const key  = `${lang.id}-${topicIdx}`;
// // //     const name = (newSubtopics[key] || '').trim();
// // //     if (!name) return;
// // //     const topics = lang.topics.map((t, i) => i === topicIdx ? { ...t, subtopics: [...(t.subtopics||[]), name] } : t);
// // //     await updateDoc(doc(db, 'learningLanguages', lang.id), { topics });
// // //     setNewSubtopics(p => ({ ...p, [key]:'' }));
// // //     await fetch();
// // //   };

// // //   /* ── Add content item ── */
// // //   const addContent = async (lang, topicIdx) => {
// // //     const key  = `${lang.id}-${topicIdx}`;
// // //     const item = newContent[key];
// // //     if (!item?.title?.trim() || !item?.type) return;
// // //     const topics = lang.topics.map((t, i) => i === topicIdx ? { ...t, content: [...(t.content||[]), { type:item.type, title:item.title.trim(), duration:item.duration||'20 Mins', createdAt:new Date().toISOString() }] } : t);
// // //     await updateDoc(doc(db, 'learningLanguages', lang.id), { topics });
// // //     setNewContent(p => ({ ...p, [key]:{ type:'', title:'', duration:'' } }));
// // //     await fetch();
// // //   };

// // //   /* ── PPT uploaded ── */
// // //   const handlePPTUploaded = async (lang, topicIdx, pptItem) => {
// // //     const topics = lang.topics.map((t, i) => i === topicIdx ? { ...t, content: [...(t.content||[]), { ...pptItem, createdAt:new Date().toISOString() }] } : t);
// // //     await updateDoc(doc(db, 'learningLanguages', lang.id), { topics });
// // //     setPptKey(null);
// // //     await fetch();
// // //   };

// // //   const langIcon = (name) => LANG_ICONS[name] || LANG_ICONS.default;
// // //   const contentCfg = (type) => CONTENT_TYPES.find(c => c.key === type) || CONTENT_TYPES[0];

// // //   /* ── RENDER ─────────────────────────────────────────────────────────────── */
// // //   return (
// // //     <div>
// // //       {/* Header */}
// // //       <div style={{ marginBottom:'1.5rem' }}>
// // //         <h2 style={{ fontSize:'1.25rem', fontWeight:900, color:'#f1f5f9', margin:0 }}>Learning Modules</h2>
// // //         <p style={{ fontSize:'0.75rem', color:'#64748b', marginTop:'0.2rem' }}>Language → Topic → Subtopics · Learn · Practice · Test · 📊 Slides</p>
// // //       </div>

// // //       {/* Create language */}
// // //       <div style={{ ...cardS('#1e3a5f'), padding:'1.25rem', marginBottom:'1.5rem' }}>
// // //         <p style={{ fontSize:'0.6rem', fontWeight:900, color:'#64748b', letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:'0.75rem' }}>+ Create Language</p>
// // //         <div style={{ display:'flex', gap:'0.75rem' }}>
// // //           <input value={newLang} onChange={e => setNewLang(e.target.value)} onKeyDown={e => e.key==='Enter' && createLang()} placeholder="e.g., Python, Java, SQL" style={iStyle} />
// // //           <button onClick={createLang} disabled={creatingLang} style={bStyle()}>{creatingLang ? '...' : 'Create'}</button>
// // //         </div>
// // //       </div>

// // //       {/* Language list */}
// // //       {loading ? (
// // //         <div style={{ textAlign:'center', padding:'3rem', color:'#475569' }}>Loading...</div>
// // //       ) : languages.length === 0 ? (
// // //         <div style={{ textAlign:'center', padding:'4rem', color:'#334155' }}>
// // //           <p style={{ fontSize:'2.5rem' }}>📘</p>
// // //           <p style={{ fontWeight:700, color:'#64748b', marginTop:'0.5rem' }}>No languages yet. Create one above.</p>
// // //         </div>
// // //       ) : (
// // //         <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
// // //           {languages.map(lang => {
// // //             const isLangOpen = expandedLang === lang.id;
// // //             return (
// // //               <div key={lang.id} style={cardS(isLangOpen ? '#3b82f6' : '#1e293b')}>

// // //                 {/* Language header */}
// // //                 <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'1rem 1.25rem' }}>
// // //                   {/* Left — click to expand */}
// // //                   <div onClick={() => setExpandedLang(isLangOpen ? null : lang.id)}
// // //                     style={{ display:'flex', alignItems:'center', gap:'0.75rem', flex:1, cursor:'pointer' }}>
// // //                     <span style={{ fontSize:'1.5rem' }}>{langIcon(lang.name)}</span>
// // //                     <div>
// // //                       <p style={{ fontWeight:900, fontSize:'1rem', color:'#f1f5f9', margin:0 }}>{lang.name}</p>
// // //                       <p style={{ fontSize:'0.65rem', color:'#64748b', margin:0 }}>{lang.topics?.length || 0} topics</p>
// // //                     </div>
// // //                     {/* Topic pills */}
// // //                     <div style={{ display:'flex', gap:'0.35rem', flexWrap:'wrap', marginLeft:'0.5rem' }}>
// // //                       {lang.topics?.slice(0,3).map((t,i) => (
// // //                         <span key={i} style={{ fontSize:'0.62rem', padding:'0.15rem 0.55rem', borderRadius:'999px', background:'rgba(59,130,246,0.12)', color:'#60a5fa', border:'1px solid rgba(59,130,246,0.25)', fontWeight:700 }}>{t.name}</span>
// // //                       ))}
// // //                       {lang.topics?.length > 3 && <span style={{ fontSize:'0.62rem', color:'#475569' }}>+{lang.topics.length-3}</span>}
// // //                     </div>
// // //                   </div>
// // //                   {/* Right — chevron + DELETE language */}
// // //                   <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', flexShrink:0 }}>
// // //                     <span onClick={() => setExpandedLang(isLangOpen ? null : lang.id)}
// // //                       style={{ color:'#475569', fontSize:'0.8rem', display:'inline-block', transform:isLangOpen?'rotate(180deg)':'rotate(0)', transition:'transform 0.2s', cursor:'pointer' }}>▼</span>
// // //                     <DeleteButton
// // //                       itemName={`language "${lang.name}" and all its topics`}
// // //                       onConfirm={() => deleteLang(lang)}
// // //                     />
// // //                   </div>
// // //                 </div>

// // //                 {/* Language body */}
// // //                 {isLangOpen && (
// // //                   <div style={{ borderTop:'1px solid #1e293b', padding:'1.25rem' }}>

// // //                     {/* Topics */}
// // //                     <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem', marginBottom:'1rem' }}>
// // //                       {!lang.topics?.length ? (
// // //                         <p style={{ color:'#475569', fontSize:'0.8rem' }}>No topics yet.</p>
// // //                       ) : lang.topics.map((topic, topicIdx) => {
// // //                         const topicKey   = `${lang.id}-${topicIdx}`;
// // //                         const isTopicOpen = expandedTopic === topicKey;
// // //                         const pptCount   = topic.content?.filter(c => c.type==='ppt').length || 0;

// // //                         return (
// // //                           <div key={topicIdx} style={{ background:'rgba(30,41,59,0.6)', border:'1px solid #334155', borderRadius:'0.75rem', overflow:'hidden' }}>

// // //                             {/* Topic header */}
// // //                             <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'0.75rem 1rem' }}>
// // //                               <div onClick={() => setExpandedTopic(isTopicOpen ? null : topicKey)}
// // //                                 style={{ display:'flex', alignItems:'center', gap:'0.6rem', flex:1, cursor:'pointer' }}>
// // //                                 <div style={{ width:'1.4rem', height:'1.4rem', borderRadius:'50%', background:topic.content?.length?'#10b981':'#1e293b', border:`2px solid ${topic.content?.length?'#10b981':'#334155'}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
// // //                                   {topic.content?.length ? <span style={{ fontSize:'0.55rem', color:'#fff' }}>✓</span> : null}
// // //                                 </div>
// // //                                 <div>
// // //                                   <p style={{ fontWeight:800, fontSize:'0.875rem', color:'#e2e8f0', margin:0 }}>
// // //                                     <span style={{ fontSize:'0.58rem', color:'#64748b', marginRight:'0.35rem', textTransform:'uppercase', letterSpacing:'0.08em' }}>TOPIC</span>
// // //                                     {topic.name}
// // //                                   </p>
// // //                                   <p style={{ fontSize:'0.62rem', color:'#64748b', margin:0 }}>
// // //                                     {topic.subtopics?.length||0} subtopics · {topic.content?.length||0} items
// // //                                     {pptCount>0 && <span style={{ marginLeft:'0.35rem', color:'#a78bfa' }}>· 📊 {pptCount}</span>}
// // //                                   </p>
// // //                                 </div>
// // //                               </div>
// // //                               {/* DELETE topic + chevron */}
// // //                               <div style={{ display:'flex', alignItems:'center', gap:'0.4rem', flexShrink:0 }}>
// // //                                 <span onClick={() => setExpandedTopic(isTopicOpen ? null : topicKey)}
// // //                                   style={{ color:'#475569', fontSize:'0.75rem', transform:isTopicOpen?'rotate(180deg)':'rotate(0)', transition:'transform 0.2s', cursor:'pointer', display:'inline-block' }}>▼</span>
// // //                                 <DeleteButton
// // //                                   itemName={`topic "${topic.name}"`}
// // //                                   onConfirm={() => deleteTopic(lang, topicIdx)}
// // //                                 />
// // //                               </div>
// // //                             </div>

// // //                             {/* Topic body */}
// // //                             {isTopicOpen && (
// // //                               <div style={{ borderTop:'1px solid #1e293b', padding:'1rem' }}>

// // //                                 {/* Subtopics */}
// // //                                 <div style={{ marginBottom:'1.25rem' }}>
// // //                                   <p style={{ fontSize:'0.6rem', fontWeight:900, color:'#475569', letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:'0.6rem' }}>Subtopics</p>
// // //                                   <div style={{ display:'flex', flexWrap:'wrap', gap:'0.4rem', marginBottom:'0.6rem' }}>
// // //                                     {!topic.subtopics?.length ? (
// // //                                       <span style={{ fontSize:'0.75rem', color:'#475569' }}>No subtopics yet.</span>
// // //                                     ) : topic.subtopics.map((sub, si) => (
// // //                                       <div key={si} style={{ display:'inline-flex', alignItems:'center', gap:'0.3rem', padding:'0.2rem 0.3rem 0.2rem 0.65rem', borderRadius:'0.4rem', background:'rgba(99,102,241,0.12)', border:'1px solid rgba(99,102,241,0.25)' }}>
// // //                                         <span style={{ fontSize:'0.72rem', fontWeight:700, color:'#818cf8' }}>{sub}</span>
// // //                                         {/* DELETE subtopic — tiny X */}
// // //                                         <button
// // //                                           onClick={() => {
// // //                                             if (window.confirm(`Delete subtopic "${sub}"?`)) deleteSubtopic(lang, topicIdx, si);
// // //                                           }}
// // //                                           title="Delete subtopic"
// // //                                           style={{ background:'none', border:'none', color:'#64748b', cursor:'pointer', fontSize:'0.7rem', padding:'0 0.1rem', lineHeight:1, fontWeight:900 }}
// // //                                           onMouseEnter={e => e.currentTarget.style.color='#f87171'}
// // //                                           onMouseLeave={e => e.currentTarget.style.color='#64748b'}
// // //                                         >✕</button>
// // //                                       </div>
// // //                                     ))}
// // //                                   </div>
// // //                                   <div style={{ display:'flex', gap:'0.5rem' }}>
// // //                                     <input value={newSubtopics[topicKey]||''} onChange={e => setNewSubtopics(p=>({...p,[topicKey]:e.target.value}))} onKeyDown={e => e.key==='Enter' && addSubtopic(lang,topicIdx)} placeholder={`Add subtopic to ${topic.name}`} style={{ ...iStyle, fontSize:'0.78rem' }} />
// // //                                     <button onClick={() => addSubtopic(lang,topicIdx)} style={{ ...bStyle('#6366f1'), padding:'0.45rem 0.875rem', fontSize:'0.7rem' }}>+ Subtopic</button>
// // //                                   </div>
// // //                                 </div>

// // //                                 {/* Content items */}
// // //                                 <div>
// // //                                   <p style={{ fontSize:'0.6rem', fontWeight:900, color:'#475569', letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:'0.6rem' }}>Content — Learn · Practice · Test · Slides</p>

// // //                                   <div style={{ display:'flex', flexDirection:'column', gap:'0.4rem', marginBottom:'0.75rem' }}>
// // //                                     {!topic.content?.length ? (
// // //                                       <p style={{ fontSize:'0.75rem', color:'#475569' }}>No content yet.</p>
// // //                                     ) : topic.content.map((item, ci) => {
// // //                                       const cfg = contentCfg(item.type);
// // //                                       return (
// // //                                         <div key={ci} style={{ display:'flex', alignItems:'center', gap:'0.75rem', padding:'0.6rem 0.875rem', background:'rgba(15,23,42,0.7)', borderRadius:'0.6rem', border:'1px solid #1e293b' }}>
// // //                                           <span style={{ fontSize:'1rem', flexShrink:0 }}>{cfg.icon}</span>
// // //                                           <div style={{ flex:1, minWidth:0 }}>
// // //                                             <p style={{ fontSize:'0.8rem', fontWeight:700, color:'#e2e8f0', margin:0, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{item.title}</p>
// // //                                             <p style={{ fontSize:'0.62rem', color:'#64748b', margin:0 }}>{item.type==='ppt' ? item.fileSize : item.duration}</p>
// // //                                           </div>
// // //                                           <span style={pillS(cfg.color)}>{cfg.tag}</span>
// // //                                           {item.type==='ppt' && item.downloadUrl && (
// // //                                             <a href={item.downloadUrl} target="_blank" rel="noreferrer"
// // //                                               style={{ fontSize:'0.62rem', fontWeight:800, padding:'0.2rem 0.55rem', borderRadius:'0.4rem', background:'rgba(139,92,246,0.15)', color:'#a78bfa', border:'1px solid rgba(139,92,246,0.3)', textDecoration:'none', flexShrink:0 }}>
// // //                                               ⬇
// // //                                             </a>
// // //                                           )}
// // //                                           {/* DELETE content item */}
// // //                                           <DeleteButton
// // //                                             itemName={`"${item.title}"`}
// // //                                             onConfirm={() => deleteContent(lang, topicIdx, ci)}
// // //                                           />
// // //                                         </div>
// // //                                       );
// // //                                     })}
// // //                                   </div>

// // //                                   {/* Add content form */}
// // //                                   <div style={{ background:'rgba(15,23,42,0.5)', borderRadius:'0.75rem', padding:'0.875rem', border:'1px solid #1e293b' }}>
// // //                                     <p style={{ fontSize:'0.6rem', fontWeight:800, color:'#475569', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:'0.6rem' }}>Add Content</p>
// // //                                     <div style={{ display:'flex', gap:'0.4rem', marginBottom:'0.6rem', flexWrap:'wrap' }}>
// // //                                       {CONTENT_TYPES.map(ct => {
// // //                                         const isActive = newContent[topicKey]?.type === ct.key;
// // //                                         return (
// // //                                           <button key={ct.key} type="button"
// // //                                             onClick={() => {
// // //                                               setNewContent(p => ({ ...p, [topicKey]: { ...p[topicKey], type:ct.key } }));
// // //                                               setPptKey(ct.key==='ppt' ? (pptKey===topicKey ? null : topicKey) : null);
// // //                                             }}
// // //                                             style={{ padding:'0.35rem 0.75rem', borderRadius:'0.45rem', fontWeight:800, fontSize:'0.68rem', border:`1px solid ${isActive?ct.color:'#334155'}`, background:isActive?`${ct.color}22`:'transparent', color:isActive?ct.color:'#64748b', cursor:'pointer', transition:'all 0.15s' }}>
// // //                                             {ct.icon} {ct.label}
// // //                                           </button>
// // //                                         );
// // //                                       })}
// // //                                     </div>
// // //                                     {pptKey === topicKey ? (
// // //                                       <PPTUploader langId={lang.id} topicIdx={topicIdx} onUploaded={item => handlePPTUploaded(lang, topicIdx, item)} />
// // //                                     ) : newContent[topicKey]?.type && newContent[topicKey].type!=='ppt' && (
// // //                                       <div style={{ display:'flex', gap:'0.5rem' }}>
// // //                                         <input value={newContent[topicKey]?.title||''} onChange={e => setNewContent(p=>({...p,[topicKey]:{...p[topicKey],title:e.target.value}}))} onKeyDown={e => e.key==='Enter' && addContent(lang,topicIdx)} placeholder="Content title" style={{ ...iStyle, fontSize:'0.78rem' }} />
// // //                                         <input value={newContent[topicKey]?.duration||''} onChange={e => setNewContent(p=>({...p,[topicKey]:{...p[topicKey],duration:e.target.value}}))} placeholder="Duration (e.g., 45 Mins)" style={{ ...iStyle, width:'130px', flex:'none', fontSize:'0.78rem' }} />
// // //                                         <button onClick={() => addContent(lang,topicIdx)} style={bStyle('#10b981')}>+ Add</button>
// // //                                       </div>
// // //                                     )}
// // //                                   </div>
// // //                                 </div>
// // //                               </div>
// // //                             )}
// // //                           </div>
// // //                         );
// // //                       })}
// // //                     </div>

// // //                     {/* Add topic */}
// // //                     <div>
// // //                       <p style={{ fontSize:'0.6rem', fontWeight:900, color:'#475569', letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:'0.5rem' }}>+ Add Topic to {lang.name}</p>
// // //                       <div style={{ display:'flex', gap:'0.6rem' }}>
// // //                         <input value={newTopics[lang.id]||''} onChange={e => setNewTopics(p=>({...p,[lang.id]:e.target.value}))} onKeyDown={e => e.key==='Enter' && addTopic(lang)} placeholder="e.g., I/O Basics, Arrays, OOP" style={iStyle} />
// // //                         <button onClick={() => addTopic(lang)} style={bStyle()}>+ Add Topic</button>
// // //                       </div>
// // //                     </div>
// // //                   </div>
// // //                 )}
// // //               </div>
// // //             );
// // //           })}
// // //         </div>
// // //       )}
// // //     </div>
// // //   );
// // // }

// // ///


// // import React, { useState, useEffect, useRef } from 'react';
// // import {
// //   collection, getDocs, addDoc, updateDoc, deleteDoc,
// //   doc, serverTimestamp, query, orderBy
// // } from 'firebase/firestore';
// // import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
// // import { db, storage } from '../../firebase/config';
// // import DeleteButton from '../ui/DeleteButton';

// // const CONTENT_TYPES = [
// //   { key: 'lesson', label: 'Intro Lesson',  icon: '📖', color: '#3b82f6', tag: 'Learning' },
// //   { key: 'mcq',    label: 'MCQ Practice',  icon: '📋', color: '#f59e0b', tag: 'Practice' },
// //   { key: 'coding', label: 'Coding Question', icon: '💻', color: '#10b981', tag: 'Coding'   },
// //   { key: 'ppt',    label: 'PPT Slides',      icon: '📊', color: '#8b5cf6', tag: 'Slides'   },
// // ];

// // const LANG_ICONS = { Python:'🐍', Java:'☕', JavaScript:'🟨', C:'⚙️', 'C++':'⚡', SQL:'🗄️', default:'📘' };

// // const iStyle = { flex:1, background:'#0f172a', border:'1px solid #334155', borderRadius:'0.6rem', padding:'0.55rem 0.875rem', color:'#f1f5f9', fontSize:'0.82rem', outline:'none' };
// // const bStyle = (color='#3b82f6', extra={}) => ({ padding:'0.5rem 1.1rem', borderRadius:'0.6rem', background:color, color:'#fff', fontWeight:800, fontSize:'0.75rem', border:'none', cursor:'pointer', whiteSpace:'nowrap', ...extra });
// // const cardS  = (border='#1e293b') => ({ background:'rgba(15,23,42,0.6)', border:`1px solid ${border}`, borderRadius:'0.875rem', overflow:'hidden', transition:'border-color 0.2s' });
// // const pillS  = (color) => ({ fontSize:'0.6rem', fontWeight:800, padding:'0.15rem 0.55rem', borderRadius:'999px', background:`${color}22`, color, letterSpacing:'0.06em', flexShrink:0 });

// // /* ── PPT Uploader ─────────────────────────────────────────────────────────── */
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
// //     if (!f.name.match(/\.(pptx?|ppt)$/i)) { setErr('Only .ppt / .pptx files allowed.'); return; }
// //     setErr(''); setFile(f);
// //     if (!pptTitle) setPptTitle(f.name.replace(/\.(pptx?|ppt)$/i, ''));
// //   };

// //   const upload = () => {
// //     if (!file) { setErr('Choose a file first.'); return; }
// //     if (!pptTitle.trim()) { setErr('Enter a title.'); return; }
// //     setUploading(true); setErr('');
// //     const sRef = ref(storage, `learning_ppts/${langId}/topic_${topicIdx}/${Date.now()}_${file.name}`);
// //     const task = uploadBytesResumable(sRef, file);
// //     task.on('state_changed',
// //       s => setProgress(Math.round((s.bytesTransferred / s.totalBytes) * 100)),
// //       e => { setErr('Upload failed.'); setUploading(false); console.error(e); },
// //       () => getDownloadURL(task.snapshot.ref).then(url => {
// //         onUploaded({ type:'ppt', title:pptTitle.trim(), fileName:file.name, fileSize:(file.size/1024/1024).toFixed(2)+' MB', downloadUrl:url, storagePath:task.snapshot.ref.fullPath });
// //         setPptTitle(''); setFile(null); setProgress(0); setUploading(false);
// //         if (fileRef.current) fileRef.current.value = '';
// //       })
// //     );
// //   };

// //   return (
// //     <div style={{ background:'rgba(139,92,246,0.06)', border:'1px solid rgba(139,92,246,0.2)', borderRadius:'0.75rem', padding:'0.875rem', marginTop:'0.5rem' }}>
// //       <p style={{ fontSize:'0.6rem', fontWeight:900, color:'#a78bfa', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:'0.6rem' }}>📊 Upload PPT Slides</p>
// //       <div style={{ display:'flex', gap:'0.5rem', marginBottom:'0.6rem', flexWrap:'wrap' }}>
// //         <input ref={fileRef} type="file" accept=".ppt,.pptx" onChange={pick} style={{ display:'none' }} id={`ppt-${langId}-${topicIdx}`} />
// //         <label htmlFor={`ppt-${langId}-${topicIdx}`} style={bStyle('rgba(139,92,246,0.2)', { border:'1px solid rgba(139,92,246,0.4)', color:'#a78bfa', cursor:'pointer' })}>📎 Choose File</label>
// //         {file && <span style={{ fontSize:'0.75rem', color:'#94a3b8', alignSelf:'center', fontFamily:'monospace' }}>{file.name} ({(file.size/1024/1024).toFixed(2)} MB)</span>}
// //       </div>
// //       <div style={{ display:'flex', gap:'0.5rem', marginBottom:'0.6rem' }}>
// //         <input value={pptTitle} onChange={e => setPptTitle(e.target.value)} placeholder="Presentation title" style={{ ...iStyle, fontSize:'0.78rem' }} />
// //         <button onClick={upload} disabled={uploading || !file} style={bStyle('#8b5cf6', { opacity: uploading||!file ? 0.5:1 })}>{uploading ? `${progress}%` : '⬆ Upload'}</button>
// //       </div>
// //       {uploading && <div style={{ background:'#1e293b', borderRadius:'999px', height:'6px', overflow:'hidden' }}><div style={{ height:'100%', width:`${progress}%`, background:'linear-gradient(90deg,#8b5cf6,#6366f1)', transition:'width 0.3s', borderRadius:'999px' }} /></div>}
// //       {err && <p style={{ fontSize:'0.72rem', color:'#f87171', marginTop:'0.4rem' }}>{err}</p>}
// //     </div>
// //   );
// // }

// // /* ── Main ─────────────────────────────────────────────────────────────────── */
// // // ADDED onOpenTopic prop
// // export default function LearningModules({ moduleData, onOpenTopic }) {
// //   const [languages, setLanguages]         = useState([]);
// //   const [expandedLang, setExpandedLang]   = useState(null);
// //   const [expandedTopic, setExpandedTopic] = useState(null);
// //   const [loading, setLoading]             = useState(true);
// //   const [newLang, setNewLang]             = useState('');
// //   const [newTopics, setNewTopics]         = useState({});
// //   const [newSubtopics, setNewSubtopics]   = useState({});
// //   const [newContent, setNewContent]       = useState({});
// //   const [creatingLang, setCreatingLang]   = useState(false);
// //   const [pptKey, setPptKey]               = useState(null);

// //   const fetch = async () => {
// //     setLoading(true);
// //     try {
// //       const snap = await getDocs(query(collection(db, 'learningLanguages'), orderBy('createdAt')));
// //       setLanguages(snap.docs.map(d => ({ id: d.id, ...d.data() })));
// //     } catch(e) { console.error(e); }
// //     setLoading(false);
// //   };

// //   useEffect(() => { fetch(); }, []);

// //   /* ── Delete language (entire doc) ── */
// //   const deleteLang = async (lang) => {
// //     await deleteDoc(doc(db, 'learningLanguages', lang.id));
// //     if (expandedLang === lang.id) setExpandedLang(null);
// //     await fetch();
// //   };

// //   /* ── Delete topic ── */
// //   const deleteTopic = async (lang, topicIdx) => {
// //     const topics = lang.topics.filter((_, i) => i !== topicIdx);
// //     await updateDoc(doc(db, 'learningLanguages', lang.id), { topics });
// //     const key = `${lang.id}-${topicIdx}`;
// //     if (expandedTopic === key) setExpandedTopic(null);
// //     await fetch();
// //   };

// //   /* ── Delete subtopic ── */
// //   const deleteSubtopic = async (lang, topicIdx, subIdx) => {
// //     const topics = lang.topics.map((t, i) =>
// //       i === topicIdx ? { ...t, subtopics: t.subtopics.filter((_, si) => si !== subIdx) } : t
// //     );
// //     await updateDoc(doc(db, 'learningLanguages', lang.id), { topics });
// //     await fetch();
// //   };

// //   /* ── Delete content item ── */
// //   const deleteContent = async (lang, topicIdx, contentIdx) => {
// //     const item = lang.topics[topicIdx].content[contentIdx];
// //     // If PPT, also delete from Firebase Storage
// //     if (item.type === 'ppt' && item.storagePath) {
// //       try { await deleteObject(ref(storage, item.storagePath)); } catch(e) { console.warn('Storage delete failed:', e); }
// //     }
// //     const topics = lang.topics.map((t, i) =>
// //       i === topicIdx ? { ...t, content: t.content.filter((_, ci) => ci !== contentIdx) } : t
// //     );
// //     await updateDoc(doc(db, 'learningLanguages', lang.id), { topics });
// //     await fetch();
// //   };

// //   /* ── Create language ── */
// //   const createLang = async () => {
// //     if (!newLang.trim()) return;
// //     setCreatingLang(true);
// //     try { await addDoc(collection(db, 'learningLanguages'), { name: newLang.trim(), topics: [], createdAt: serverTimestamp() }); setNewLang(''); await fetch(); }
// //     catch { alert('Failed to create language.'); }
// //     setCreatingLang(false);
// //   };

// //   /* ── Add topic ── */
// //   const addTopic = async (lang) => {
// //     const name = (newTopics[lang.id] || '').trim();
// //     if (!name) return;
    
// //     // Creating an ID for the topic
// //     const topicId = name.toLowerCase().replace(/\s+/g, '-');
// //     const newTopic = { id: topicId, name, subtopics:[], content:[] };

// //     await updateDoc(doc(db, 'learningLanguages', lang.id), { topics: [...(lang.topics||[]), newTopic] });
// //     setNewTopics(p => ({ ...p, [lang.id]:'' }));
// //     await fetch();
// //   };

// //   /* ── Add subtopic ── */
// //   const addSubtopic = async (lang, topicIdx) => {
// //     const key  = `${lang.id}-${topicIdx}`;
// //     const name = (newSubtopics[key] || '').trim();
// //     if (!name) return;
// //     const topics = lang.topics.map((t, i) => i === topicIdx ? { ...t, subtopics: [...(t.subtopics||[]), name] } : t);
// //     await updateDoc(doc(db, 'learningLanguages', lang.id), { topics });
// //     setNewSubtopics(p => ({ ...p, [key]:'' }));
// //     await fetch();
// //   };

// //   /* ── Add content item ── */
// //   const addContent = async (lang, topicIdx) => {
// //     const key  = `${lang.id}-${topicIdx}`;
// //     const item = newContent[key];
// //     if (!item?.title?.trim() || !item?.type) return;
// //     const topics = lang.topics.map((t, i) => i === topicIdx ? { ...t, content: [...(t.content||[]), { type:item.type, title:item.title.trim(), duration:item.duration||'20 Mins', createdAt:new Date().toISOString() }] } : t);
// //     await updateDoc(doc(db, 'learningLanguages', lang.id), { topics });
// //     setNewContent(p => ({ ...p, [key]:{ type:'', title:'', duration:'' } }));
// //     await fetch();
// //   };

// //   /* ── PPT uploaded ── */
// //   const handlePPTUploaded = async (lang, topicIdx, pptItem) => {
// //     const topics = lang.topics.map((t, i) => i === topicIdx ? { ...t, content: [...(t.content||[]), { ...pptItem, createdAt:new Date().toISOString() }] } : t);
// //     await updateDoc(doc(db, 'learningLanguages', lang.id), { topics });
// //     setPptKey(null);
// //     await fetch();
// //   };

// //   const langIcon = (name) => LANG_ICONS[name] || LANG_ICONS.default;
// //   const contentCfg = (type) => CONTENT_TYPES.find(c => c.key === type) || CONTENT_TYPES[0];

// //   /* ── RENDER ─────────────────────────────────────────────────────────────── */
// //   return (
// //     <div>
// //       {/* Create language */}
// //       <div style={{ ...cardS('#1e3a5f'), padding:'1.25rem', marginBottom:'1.5rem' }}>
// //         <p style={{ fontSize:'0.6rem', fontWeight:900, color:'#64748b', letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:'0.75rem' }}>+ Create Language</p>
// //         <div style={{ display:'flex', gap:'0.75rem' }}>
// //           <input value={newLang} onChange={e => setNewLang(e.target.value)} onKeyDown={e => e.key==='Enter' && createLang()} placeholder="e.g., Python, Java, SQL" style={iStyle} />
// //           <button onClick={createLang} disabled={creatingLang} style={bStyle()}>{creatingLang ? '...' : 'Create'}</button>
// //         </div>
// //       </div>

// //       {/* Language list */}
// //       {loading ? (
// //         <div style={{ textAlign:'center', padding:'3rem', color:'#475569' }}>Loading...</div>
// //       ) : languages.length === 0 ? (
// //         <div style={{ textAlign:'center', padding:'4rem', color:'#334155' }}>
// //           <p style={{ fontSize:'2.5rem' }}>📘</p>
// //           <p style={{ fontWeight:700, color:'#64748b', marginTop:'0.5rem' }}>No languages yet. Create one above.</p>
// //         </div>
// //       ) : (
// //         <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
// //           {languages.map(lang => {
// //             const isLangOpen = expandedLang === lang.id;
// //             return (
// //               <div key={lang.id} style={cardS(isLangOpen ? '#3b82f6' : '#1e293b')}>

// //                 {/* Language header */}
// //                 <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'1rem 1.25rem' }}>
// //                   {/* Left — click to expand */}
// //                   <div onClick={() => setExpandedLang(isLangOpen ? null : lang.id)}
// //                     style={{ display:'flex', alignItems:'center', gap:'0.75rem', flex:1, cursor:'pointer' }}>
// //                     <span style={{ fontSize:'1.5rem' }}>{langIcon(lang.name)}</span>
// //                     <div>
// //                       <p style={{ fontWeight:900, fontSize:'1rem', color:'#f1f5f9', margin:0 }}>{lang.name}</p>
// //                       <p style={{ fontSize:'0.65rem', color:'#64748b', margin:0 }}>{lang.topics?.length || 0} topics</p>
// //                     </div>
// //                     {/* Topic pills */}
// //                     <div style={{ display:'flex', gap:'0.35rem', flexWrap:'wrap', marginLeft:'0.5rem' }}>
// //                       {lang.topics?.slice(0,3).map((t,i) => (
// //                         <span key={i} style={{ fontSize:'0.62rem', padding:'0.15rem 0.55rem', borderRadius:'999px', background:'rgba(59,130,246,0.12)', color:'#60a5fa', border:'1px solid rgba(59,130,246,0.25)', fontWeight:700 }}>{t.name}</span>
// //                       ))}
// //                       {lang.topics?.length > 3 && <span style={{ fontSize:'0.62rem', color:'#475569' }}>+{lang.topics.length-3}</span>}
// //                     </div>
// //                   </div>
// //                   {/* Right — chevron + DELETE language */}
// //                   <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', flexShrink:0 }}>
// //                     <span onClick={() => setExpandedLang(isLangOpen ? null : lang.id)}
// //                       style={{ color:'#475569', fontSize:'0.8rem', display:'inline-block', transform:isLangOpen?'rotate(180deg)':'rotate(0)', transition:'transform 0.2s', cursor:'pointer' }}>▼</span>
// //                     <DeleteButton
// //                       itemName={`language "${lang.name}" and all its topics`}
// //                       onConfirm={() => deleteLang(lang)}
// //                     />
// //                   </div>
// //                 </div>

// //                 {/* Language body */}
// //                 {isLangOpen && (
// //                   <div style={{ borderTop:'1px solid #1e293b', padding:'1.25rem' }}>

// //                     {/* Topics */}
// //                     <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem', marginBottom:'1rem' }}>
// //                       {!lang.topics?.length ? (
// //                         <p style={{ color:'#475569', fontSize:'0.8rem' }}>No topics yet.</p>
// //                       ) : lang.topics.map((topic, topicIdx) => {
// //                         const topicKey   = `${lang.id}-${topicIdx}`;
// //                         const isTopicOpen = expandedTopic === topicKey;
// //                         const pptCount   = topic.content?.filter(c => c.type==='ppt').length || 0;

// //                         return (
// //                           <div key={topicIdx} style={{ background:'rgba(30,41,59,0.6)', border:'1px solid #334155', borderRadius:'0.75rem', overflow:'hidden' }}>

// //                             {/* Topic header */}
// //                             <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'0.75rem 1rem' }}>
// //                               <div onClick={() => setExpandedTopic(isTopicOpen ? null : topicKey)}
// //                                 style={{ display:'flex', alignItems:'center', gap:'0.6rem', flex:1, cursor:'pointer' }}>
// //                                 <div style={{ width:'1.4rem', height:'1.4rem', borderRadius:'50%', background:topic.content?.length?'#10b981':'#1e293b', border:`2px solid ${topic.content?.length?'#10b981':'#334155'}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
// //                                   {topic.content?.length ? <span style={{ fontSize:'0.55rem', color:'#fff' }}>✓</span> : null}
// //                                 </div>
// //                                 <div>
// //                                   <p style={{ fontWeight:800, fontSize:'0.875rem', color:'#e2e8f0', margin:0 }}>
// //                                     {topic.name}
// //                                   </p>
// //                                   <p style={{ fontSize:'0.62rem', color:'#64748b', margin:0 }}>
// //                                     {topic.subtopics?.length||0} subtopics · {topic.content?.length||0} items
// //                                     {pptCount>0 && <span style={{ marginLeft:'0.35rem', color:'#a78bfa' }}>· 📊 {pptCount}</span>}
// //                                   </p>
// //                                 </div>
// //                               </div>
// //                               {/* EDIT TOPIC BUTTON & DELETE topic + chevron */}
// //                               <div style={{ display:'flex', alignItems:'center', gap:'0.4rem', flexShrink:0 }}>
// //                                 {/* THE FIX: Button to Open Lesson Action Panel */}
// //                                 <button 
// //                                   onClick={() => onOpenTopic(lang, topic)}
// //                                   style={{ ...bStyle('#3b82f6'), padding: '0.35rem 0.8rem', fontSize: '0.65rem' }}
// //                                 >
// //                                   Edit Content
// //                                 </button>

// //                                 <span onClick={() => setExpandedTopic(isTopicOpen ? null : topicKey)}
// //                                   style={{ color:'#475569', fontSize:'0.75rem', transform:isTopicOpen?'rotate(180deg)':'rotate(0)', transition:'transform 0.2s', cursor:'pointer', display:'inline-block', marginLeft: '0.5rem' }}>▼</span>
// //                                 <DeleteButton
// //                                   itemName={`topic "${topic.name}"`}
// //                                   onConfirm={() => deleteTopic(lang, topicIdx)}
// //                                 />
// //                               </div>
// //                             </div>

// //                             {/* Topic body */}
// //                             {isTopicOpen && (
// //                               <div style={{ borderTop:'1px solid #1e293b', padding:'1rem' }}>

// //                                 {/* Subtopics */}
// //                                 <div style={{ marginBottom:'1.25rem' }}>
// //                                   <p style={{ fontSize:'0.6rem', fontWeight:900, color:'#475569', letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:'0.6rem' }}>Subtopics</p>
// //                                   <div style={{ display:'flex', flexWrap:'wrap', gap:'0.4rem', marginBottom:'0.6rem' }}>
// //                                     {!topic.subtopics?.length ? (
// //                                       <span style={{ fontSize:'0.75rem', color:'#475569' }}>No subtopics yet.</span>
// //                                     ) : topic.subtopics.map((sub, si) => (
// //                                       <div key={si} style={{ display:'inline-flex', alignItems:'center', gap:'0.3rem', padding:'0.2rem 0.3rem 0.2rem 0.65rem', borderRadius:'0.4rem', background:'rgba(99,102,241,0.12)', border:'1px solid rgba(99,102,241,0.25)' }}>
// //                                         <span style={{ fontSize:'0.72rem', fontWeight:700, color:'#818cf8' }}>{sub}</span>
// //                                         {/* DELETE subtopic — tiny X */}
// //                                         <button
// //                                           onClick={() => {
// //                                             if (window.confirm(`Delete subtopic "${sub}"?`)) deleteSubtopic(lang, topicIdx, si);
// //                                           }}
// //                                           title="Delete subtopic"
// //                                           style={{ background:'none', border:'none', color:'#64748b', cursor:'pointer', fontSize:'0.7rem', padding:'0 0.1rem', lineHeight:1, fontWeight:900 }}
// //                                           onMouseEnter={e => e.currentTarget.style.color='#f87171'}
// //                                           onMouseLeave={e => e.currentTarget.style.color='#64748b'}
// //                                         >✕</button>
// //                                       </div>
// //                                     ))}
// //                                   </div>
// //                                   <div style={{ display:'flex', gap:'0.5rem' }}>
// //                                     <input value={newSubtopics[topicKey]||''} onChange={e => setNewSubtopics(p=>({...p,[topicKey]:e.target.value}))} onKeyDown={e => e.key==='Enter' && addSubtopic(lang,topicIdx)} placeholder={`Add subtopic to ${topic.name}`} style={{ ...iStyle, fontSize:'0.78rem' }} />
// //                                     <button onClick={() => addSubtopic(lang,topicIdx)} style={{ ...bStyle('#6366f1'), padding:'0.45rem 0.875rem', fontSize:'0.7rem' }}>+ Subtopic</button>
// //                                   </div>
// //                                 </div>

// //                                 {/* Content items */}
// //                                 <div>
// //                                   <p style={{ fontSize:'0.6rem', fontWeight:900, color:'#475569', letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:'0.6rem' }}>Content Overview</p>

// //                                   <div style={{ display:'flex', flexDirection:'column', gap:'0.4rem', marginBottom:'0.75rem' }}>
// //                                     {!topic.content?.length ? (
// //                                       <p style={{ fontSize:'0.75rem', color:'#475569' }}>No content yet. Click "Edit Content" above to add.</p>
// //                                     ) : topic.content.map((item, ci) => {
// //                                       const cfg = contentCfg(item.type);
// //                                       return (
// //                                         <div key={ci} style={{ display:'flex', alignItems:'center', gap:'0.75rem', padding:'0.6rem 0.875rem', background:'rgba(15,23,42,0.7)', borderRadius:'0.6rem', border:'1px solid #1e293b' }}>
// //                                           <span style={{ fontSize:'1rem', flexShrink:0 }}>{cfg.icon}</span>
// //                                           <div style={{ flex:1, minWidth:0 }}>
// //                                             <p style={{ fontSize:'0.8rem', fontWeight:700, color:'#e2e8f0', margin:0, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{item.title}</p>
// //                                             <p style={{ fontSize:'0.62rem', color:'#64748b', margin:0 }}>{item.type==='ppt' ? item.fileSize : item.duration}</p>
// //                                           </div>
// //                                           <span style={pillS(cfg.color)}>{cfg.tag}</span>
// //                                           {item.type==='ppt' && item.downloadUrl && (
// //                                             <a href={item.downloadUrl} target="_blank" rel="noreferrer"
// //                                               style={{ fontSize:'0.62rem', fontWeight:800, padding:'0.2rem 0.55rem', borderRadius:'0.4rem', background:'rgba(139,92,246,0.15)', color:'#a78bfa', border:'1px solid rgba(139,92,246,0.3)', textDecoration:'none', flexShrink:0 }}>
// //                                               ⬇
// //                                             </a>
// //                                           )}
// //                                           {/* DELETE content item */}
// //                                           <DeleteButton
// //                                             itemName={`"${item.title}"`}
// //                                             onConfirm={() => deleteContent(lang, topicIdx, ci)}
// //                                           />
// //                                         </div>
// //                                       );
// //                                     })}
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
// //                       <p style={{ fontSize:'0.6rem', fontWeight:900, color:'#475569', letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:'0.5rem' }}>+ Add Topic to {lang.name}</p>
// //                       <div style={{ display:'flex', gap:'0.6rem' }}>
// //                         <input value={newTopics[lang.id]||''} onChange={e => setNewTopics(p=>({...p,[lang.id]:e.target.value}))} onKeyDown={e => e.key==='Enter' && addTopic(lang)} placeholder="e.g., I/O Basics, Arrays, OOP" style={iStyle} />
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



// /////


// // import React, { useState, useEffect, useRef } from 'react';
// // import {
// //   collection, getDocs, addDoc, updateDoc, deleteDoc,
// //   doc, serverTimestamp, query, orderBy
// // } from 'firebase/firestore';
// // import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
// // import { db, storage } from '../../firebase/config';
// // import DeleteButton from '../ui/DeleteButton';

// // const CONTENT_TYPES = [
// //   { key: 'lesson', label: 'Intro Lesson',  icon: '📖', color: '#3b82f6', tag: 'Learning' },
// //   { key: 'mcq',    label: 'MCQ Practice',  icon: '📋', color: '#f59e0b', tag: 'Practice' },
// //   { key: 'coding', label: 'Coding Question', icon: '💻', color: '#10b981', tag: 'Coding'   },
// //   { key: 'ppt',    label: 'PPT Slides',      icon: '📊', color: '#8b5cf6', tag: 'Slides'   },
// // ];

// // const LANG_ICONS = { Python:'🐍', Java:'☕', JavaScript:'🟨', C:'⚙️', 'C++':'⚡', SQL:'🗄️', default:'📘' };

// // const iStyle = { flex:1, background:'#0f172a', border:'1px solid #334155', borderRadius:'0.6rem', padding:'0.55rem 0.875rem', color:'#f1f5f9', fontSize:'0.82rem', outline:'none' };
// // const bStyle = (color='#3b82f6', extra={}) => ({ padding:'0.5rem 1.1rem', borderRadius:'0.6rem', background:color, color:'#fff', fontWeight:800, fontSize:'0.75rem', border:'none', cursor:'pointer', whiteSpace:'nowrap', ...extra });
// // const cardS  = (border='#1e293b') => ({ background:'rgba(15,23,42,0.6)', border:`1px solid ${border}`, borderRadius:'0.875rem', overflow:'hidden', transition:'border-color 0.2s' });
// // const pillS  = (color) => ({ fontSize:'0.6rem', fontWeight:800, padding:'0.15rem 0.55rem', borderRadius:'999px', background:`${color}22`, color, letterSpacing:'0.06em', flexShrink:0 });

// // /* ── PPT Uploader ─────────────────────────────────────────────────────────── */
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
// //     if (!f.name.match(/\.(pptx?|ppt|pdf)$/i)) { setErr('Only PPT/PDF files allowed.'); return; }
// //     setErr(''); setFile(f);
// //     if (!pptTitle) setPptTitle(f.name.replace(/\.(pptx?|ppt|pdf)$/i, ''));
// //   };

// //   const upload = () => {
// //     if (!file) { setErr('Choose a file first.'); return; }
// //     if (!pptTitle.trim()) { setErr('Enter a title.'); return; }
// //     setUploading(true); setErr('');
// //     const sRef = ref(storage, `learning_ppts/${langId}/topic_${topicIdx}/${Date.now()}_${file.name}`);
// //     const task = uploadBytesResumable(sRef, file);
// //     task.on('state_changed',
// //       s => setProgress(Math.round((s.bytesTransferred / s.totalBytes) * 100)),
// //       e => { setErr('Upload failed.'); setUploading(false); console.error(e); },
// //       () => getDownloadURL(task.snapshot.ref).then(url => {
// //         onUploaded({ type:'ppt', title:pptTitle.trim(), fileName:file.name, fileSize:(file.size/1024/1024).toFixed(2)+' MB', downloadUrl:url, storagePath:task.snapshot.ref.fullPath });
// //         setPptTitle(''); setFile(null); setProgress(0); setUploading(false);
// //         if (fileRef.current) fileRef.current.value = '';
// //       })
// //     );
// //   };

// //   return (
// //     <div style={{ background:'rgba(139,92,246,0.06)', border:'1px solid rgba(139,92,246,0.2)', borderRadius:'0.75rem', padding:'0.875rem', marginTop:'0.5rem' }}>
// //       <p style={{ fontSize:'0.6rem', fontWeight:900, color:'#a78bfa', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:'0.6rem' }}>📊 Upload Files</p>
// //       <div style={{ display:'flex', gap:'0.5rem', marginBottom:'0.6rem', flexWrap:'wrap' }}>
// //         <input ref={fileRef} type="file" accept=".ppt,.pptx,.pdf" onChange={pick} style={{ display:'none' }} id={`ppt-${langId}-${topicIdx}`} />
// //         <label htmlFor={`ppt-${langId}-${topicIdx}`} style={bStyle('rgba(139,92,246,0.2)', { border:'1px solid rgba(139,92,246,0.4)', color:'#a78bfa', cursor:'pointer' })}>📎 Choose File</label>
// //         {file && <span style={{ fontSize:'0.75rem', color:'#94a3b8', alignSelf:'center', fontFamily:'monospace' }}>{file.name} ({(file.size/1024/1024).toFixed(2)} MB)</span>}
// //       </div>
// //       <div style={{ display:'flex', gap:'0.5rem', marginBottom:'0.6rem' }}>
// //         <input value={pptTitle} onChange={e => setPptTitle(e.target.value)} placeholder="Presentation title" style={{ ...iStyle, fontSize:'0.78rem' }} />
// //         <button onClick={upload} disabled={uploading || !file} style={bStyle('#8b5cf6', { opacity: uploading||!file ? 0.5:1 })}>{uploading ? `${progress}%` : '⬆ Upload'}</button>
// //       </div>
// //       {uploading && <div style={{ background:'#1e293b', borderRadius:'999px', height:'6px', overflow:'hidden' }}><div style={{ height:'100%', width:`${progress}%`, background:'linear-gradient(90deg,#8b5cf6,#6366f1)', transition:'width 0.3s', borderRadius:'999px' }} /></div>}
// //       {err && <p style={{ fontSize:'0.72rem', color:'#f87171', marginTop:'0.4rem' }}>{err}</p>}
// //     </div>
// //   );
// // }

// // /* ── Main Component ─────────────────────────────────────────────────────────── */
// // export default function LearningModules({ moduleData, onOpenTopic }) {
// //   const [languages, setLanguages]         = useState([]);
// //   const [expandedLang, setExpandedLang]   = useState(null);
// //   const [expandedTopic, setExpandedTopic] = useState(null);
// //   const [loading, setLoading]             = useState(true);
// //   const [newLang, setNewLang]             = useState('');
// //   const [newTopics, setNewTopics]         = useState({});
// //   const [newSubtopics, setNewSubtopics]   = useState({});
// //   const [newContent, setNewContent]       = useState({});
// //   const [creatingLang, setCreatingLang]   = useState(false);
// //   const [pptKey, setPptKey]               = useState(null);

// //   const fetch = async () => {
// //     setLoading(true);
// //     try {
// //       const snap = await getDocs(query(collection(db, 'learningLanguages'), orderBy('createdAt')));
// //       setLanguages(snap.docs.map(d => ({ id: d.id, ...d.data() })));
// //     } catch(e) { console.error(e); }
// //     setLoading(false);
// //   };

// //   useEffect(() => { fetch(); }, []);

// //   /* ── Delete language (entire doc) ── */
// //   const deleteLang = async (lang) => {
// //     if (!window.confirm(`Delete language "${lang.name}" completely?`)) return;
// //     await deleteDoc(doc(db, 'learningLanguages', lang.id));
// //     if (expandedLang === lang.id) setExpandedLang(null);
// //     await fetch();
// //   };

// //   /* ── Delete topic ── */
// //   const deleteTopic = async (lang, topicIdx) => {
// //     const topics = lang.topics.filter((_, i) => i !== topicIdx);
// //     await updateDoc(doc(db, 'learningLanguages', lang.id), { topics });
// //     const key = `${lang.id}-${topicIdx}`;
// //     if (expandedTopic === key) setExpandedTopic(null);
// //     await fetch();
// //   };

// //   /* ── Delete subtopic ── */
// //   const deleteSubtopic = async (lang, topicIdx, subIdx) => {
// //     const topics = lang.topics.map((t, i) =>
// //       i === topicIdx ? { ...t, subtopics: t.subtopics.filter((_, si) => si !== subIdx) } : t
// //     );
// //     await updateDoc(doc(db, 'learningLanguages', lang.id), { topics });
// //     await fetch();
// //   };

// //   /* ── Delete content item ── */
// //   const deleteContent = async (lang, topicIdx, contentIdx) => {
// //     const item = lang.topics[topicIdx].content[contentIdx];
// //     // If PPT, also delete from Firebase Storage
// //     if (item.type === 'ppt' && item.storagePath) {
// //       try { await deleteObject(ref(storage, item.storagePath)); } catch(e) { console.warn('Storage delete failed:', e); }
// //     }
// //     const topics = lang.topics.map((t, i) =>
// //       i === topicIdx ? { ...t, content: t.content.filter((_, ci) => ci !== contentIdx) } : t
// //     );
// //     await updateDoc(doc(db, 'learningLanguages', lang.id), { topics });
// //     await fetch();
// //   };

// //   /* ── Create language ── */
// //   const createLang = async () => {
// //     if (!newLang.trim()) return;
// //     setCreatingLang(true);
// //     try { await addDoc(collection(db, 'learningLanguages'), { name: newLang.trim(), topics: [], createdAt: serverTimestamp() }); setNewLang(''); await fetch(); }
// //     catch { alert('Failed to create language.'); }
// //     setCreatingLang(false);
// //   };

// //   /* ── Add topic ── */
// //   const addTopic = async (lang) => {
// //     const name = (newTopics[lang.id] || '').trim();
// //     if (!name) return;
    
// //     const topicId = name.toLowerCase().replace(/\s+/g, '-');
// //     await updateDoc(doc(db, 'learningLanguages', lang.id), { topics: [...(lang.topics||[]), { id: topicId, name, subtopics:[], content:[] }] });
// //     setNewTopics(p => ({ ...p, [lang.id]:'' }));
// //     await fetch();
// //   };

// //   /* ── Add subtopic ── */
// //   const addSubtopic = async (lang, topicIdx) => {
// //     const key  = `${lang.id}-${topicIdx}`;
// //     const name = (newSubtopics[key] || '').trim();
// //     if (!name) return;
// //     const topics = lang.topics.map((t, i) => i === topicIdx ? { ...t, subtopics: [...(t.subtopics||[]), name] } : t);
// //     await updateDoc(doc(db, 'learningLanguages', lang.id), { topics });
// //     setNewSubtopics(p => ({ ...p, [key]:'' }));
// //     await fetch();
// //   };

// //   /* ── Add content item ── */
// //   const addContent = async (lang, topicIdx) => {
// //     const key  = `${lang.id}-${topicIdx}`;
// //     const item = newContent[key];
// //     if (!item?.title?.trim() || !item?.type) return;
// //     const topics = lang.topics.map((t, i) => i === topicIdx ? { ...t, content: [...(t.content||[]), { type:item.type, title:item.title.trim(), duration:item.duration||'20 Mins', createdAt:new Date().toISOString() }] } : t);
// //     await updateDoc(doc(db, 'learningLanguages', lang.id), { topics });
// //     setNewContent(p => ({ ...p, [key]:{ type:'', title:'', duration:'' } }));
// //     await fetch();
// //   };

// //   /* ── PPT uploaded ── */
// //   const handlePPTUploaded = async (lang, topicIdx, pptItem) => {
// //     const topics = lang.topics.map((t, i) => i === topicIdx ? { ...t, content: [...(t.content||[]), { ...pptItem, createdAt:new Date().toISOString() }] } : t);
// //     await updateDoc(doc(db, 'learningLanguages', lang.id), { topics });
// //     setPptKey(null);
// //     await fetch();
// //   };

// //   const langIcon = (name) => LANG_ICONS[name] || LANG_ICONS.default;
// //   const contentCfg = (type) => CONTENT_TYPES.find(c => c.key === type) || CONTENT_TYPES[0];

// //   /* ── RENDER ─────────────────────────────────────────────────────────────── */
// //   return (
// //     <div>
// //       {/* Header */}
// //       <div style={{ marginBottom:'1.5rem' }}>
// //         <h2 style={{ fontSize:'1.25rem', fontWeight:900, color:'#f1f5f9', margin:0 }}>Learning Modules</h2>
// //         <p style={{ fontSize:'0.75rem', color:'#64748b', marginTop:'0.2rem' }}>Language → Topic → Subtopics · Learn · Practice · Test · 📊 Slides</p>
// //       </div>

// //       {/* Create language */}
// //       <div style={{ ...cardS('#1e3a5f'), padding:'1.25rem', marginBottom:'1.5rem' }}>
// //         <p style={{ fontSize:'0.6rem', fontWeight:900, color:'#64748b', letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:'0.75rem' }}>+ Create Language</p>
// //         <div style={{ display:'flex', gap:'0.75rem' }}>
// //           <input value={newLang} onChange={e => setNewLang(e.target.value)} onKeyDown={e => e.key==='Enter' && createLang()} placeholder="e.g., Python, Java, SQL" style={iStyle} />
// //           <button onClick={createLang} disabled={creatingLang} style={bStyle()}>{creatingLang ? '...' : 'Create'}</button>
// //         </div>
// //       </div>

// //       {/* Language list */}
// //       {loading ? (
// //         <div style={{ textAlign:'center', padding:'3rem', color:'#475569' }}>Loading...</div>
// //       ) : languages.length === 0 ? (
// //         <div style={{ textAlign:'center', padding:'4rem', color:'#334155' }}>
// //           <p style={{ fontSize:'2.5rem' }}>📘</p>
// //           <p style={{ fontWeight:700, color:'#64748b', marginTop:'0.5rem' }}>No languages yet. Create one above.</p>
// //         </div>
// //       ) : (
// //         <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
// //           {languages.map(lang => {
// //             const isLangOpen = expandedLang === lang.id;
// //             return (
// //               <div key={lang.id} style={cardS(isLangOpen ? '#3b82f6' : '#1e293b')}>

// //                 {/* Language header */}
// //                 <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'1rem 1.25rem' }}>
// //                   {/* Left — click to expand */}
// //                   <div onClick={() => setExpandedLang(isLangOpen ? null : lang.id)}
// //                     style={{ display:'flex', alignItems:'center', gap:'0.75rem', flex:1, cursor:'pointer' }}>
// //                     <span style={{ fontSize:'1.5rem' }}>{langIcon(lang.name)}</span>
// //                     <div>
// //                       <p style={{ fontWeight:900, fontSize:'1rem', color:'#f1f5f9', margin:0 }}>{lang.name}</p>
// //                       <p style={{ fontSize:'0.65rem', color:'#64748b', margin:0 }}>{lang.topics?.length || 0} topics</p>
// //                     </div>
// //                     {/* Topic pills */}
// //                     <div style={{ display:'flex', gap:'0.35rem', flexWrap:'wrap', marginLeft:'0.5rem' }}>
// //                       {lang.topics?.slice(0,3).map((t,i) => (
// //                         <span key={i} style={{ fontSize:'0.62rem', padding:'0.15rem 0.55rem', borderRadius:'999px', background:'rgba(59,130,246,0.12)', color:'#60a5fa', border:'1px solid rgba(59,130,246,0.25)', fontWeight:700 }}>{t.name}</span>
// //                       ))}
// //                       {lang.topics?.length > 3 && <span style={{ fontSize:'0.62rem', color:'#475569' }}>+{lang.topics.length-3}</span>}
// //                     </div>
// //                   </div>
// //                   {/* Right — chevron + DELETE language */}
// //                   <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', flexShrink:0 }}>
// //                     <span onClick={() => setExpandedLang(isLangOpen ? null : lang.id)}
// //                       style={{ color:'#475569', fontSize:'0.8rem', display:'inline-block', transform:isLangOpen?'rotate(180deg)':'rotate(0)', transition:'transform 0.2s', cursor:'pointer' }}>▼</span>
// //                     <DeleteButton
// //                       itemName={`language "${lang.name}"`}
// //                       onConfirm={() => deleteLang(lang)}
// //                     />
// //                   </div>
// //                 </div>

// //                 {/* Language body */}
// //                 {isLangOpen && (
// //                   <div style={{ borderTop:'1px solid #1e293b', padding:'1.25rem' }}>

// //                     {/* Topics */}
// //                     <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem', marginBottom:'1rem' }}>
// //                       {!lang.topics?.length ? (
// //                         <p style={{ color:'#475569', fontSize:'0.8rem' }}>No topics yet.</p>
// //                       ) : lang.topics.map((topic, topicIdx) => {
// //                         const topicKey   = `${lang.id}-${topicIdx}`;
// //                         const isTopicOpen = expandedTopic === topicKey;
// //                         const pptCount   = topic.content?.filter(c => c.type==='ppt').length || 0;

// //                         return (
// //                           <div key={topicIdx} style={{ background:'rgba(30,41,59,0.6)', border:'1px solid #334155', borderRadius:'0.75rem', overflow:'hidden' }}>

// //                             {/* Topic header */}
// //                             <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'0.75rem 1rem' }}>
// //                               <div onClick={() => setExpandedTopic(isTopicOpen ? null : topicKey)}
// //                                 style={{ display:'flex', alignItems:'center', gap:'0.6rem', flex:1, cursor:'pointer' }}>
// //                                 <div style={{ width:'1.4rem', height:'1.4rem', borderRadius:'50%', background:topic.content?.length?'#10b981':'#1e293b', border:`2px solid ${topic.content?.length?'#10b981':'#334155'}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
// //                                   {topic.content?.length ? <span style={{ fontSize:'0.55rem', color:'#fff' }}>✓</span> : null}
// //                                 </div>
// //                                 <div>
// //                                   <p style={{ fontWeight:800, fontSize:'0.875rem', color:'#e2e8f0', margin:0 }}>
// //                                     <span style={{ fontSize:'0.58rem', color:'#64748b', marginRight:'0.35rem', textTransform:'uppercase', letterSpacing:'0.08em' }}>TOPIC</span>
// //                                     {topic.name}
// //                                   </p>
// //                                   <p style={{ fontSize:'0.62rem', color:'#64748b', margin:0 }}>
// //                                     {topic.subtopics?.length||0} subtopics · {topic.content?.length||0} items
// //                                     {pptCount>0 && <span style={{ marginLeft:'0.35rem', color:'#a78bfa' }}>· 📊 {pptCount}</span>}
// //                                   </p>
// //                                 </div>
// //                               </div>
// //                               {/* DELETE topic + chevron + Optional Builder Link */}
// //                               <div style={{ display:'flex', alignItems:'center', gap:'0.4rem', flexShrink:0 }}>
// //                                 {onOpenTopic && (
// //                                     <button onClick={() => onOpenTopic(lang, topic)} style={{ ...bStyle('#3b82f6'), padding: '0.35rem 0.8rem', fontSize: '0.65rem' }}>
// //                                         Open Full Builder
// //                                     </button>
// //                                 )}
// //                                 <span onClick={() => setExpandedTopic(isTopicOpen ? null : topicKey)}
// //                                   style={{ color:'#475569', fontSize:'0.75rem', transform:isTopicOpen?'rotate(180deg)':'rotate(0)', transition:'transform 0.2s', cursor:'pointer', display:'inline-block' }}>▼</span>
// //                                 <DeleteButton
// //                                   itemName={`topic "${topic.name}"`}
// //                                   onConfirm={() => deleteTopic(lang, topicIdx)}
// //                                 />
// //                               </div>
// //                             </div>

// //                             {/* Topic body */}
// //                             {isTopicOpen && (
// //                               <div style={{ borderTop:'1px solid #1e293b', padding:'1rem' }}>

// //                                 {/* Subtopics */}
// //                                 <div style={{ marginBottom:'1.25rem' }}>
// //                                   <p style={{ fontSize:'0.6rem', fontWeight:900, color:'#475569', letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:'0.6rem' }}>Subtopics</p>
// //                                   <div style={{ display:'flex', flexWrap:'wrap', gap:'0.4rem', marginBottom:'0.6rem' }}>
// //                                     {!topic.subtopics?.length ? (
// //                                       <span style={{ fontSize:'0.75rem', color:'#475569' }}>No subtopics yet.</span>
// //                                     ) : topic.subtopics.map((sub, si) => (
// //                                       <div key={si} style={{ display:'inline-flex', alignItems:'center', gap:'0.3rem', padding:'0.2rem 0.3rem 0.2rem 0.65rem', borderRadius:'0.4rem', background:'rgba(99,102,241,0.12)', border:'1px solid rgba(99,102,241,0.25)' }}>
// //                                         <span style={{ fontSize:'0.72rem', fontWeight:700, color:'#818cf8' }}>{sub}</span>
// //                                         {/* DELETE subtopic — tiny X */}
// //                                         <button
// //                                           onClick={() => {
// //                                             if (window.confirm(`Delete subtopic "${sub}"?`)) deleteSubtopic(lang, topicIdx, si);
// //                                           }}
// //                                           title="Delete subtopic"
// //                                           style={{ background:'none', border:'none', color:'#64748b', cursor:'pointer', fontSize:'0.7rem', padding:'0 0.1rem', lineHeight:1, fontWeight:900 }}
// //                                           onMouseEnter={e => e.currentTarget.style.color='#f87171'}
// //                                           onMouseLeave={e => e.currentTarget.style.color='#64748b'}
// //                                         >✕</button>
// //                                       </div>
// //                                     ))}
// //                                   </div>
// //                                   <div style={{ display:'flex', gap:'0.5rem' }}>
// //                                     <input value={newSubtopics[topicKey]||''} onChange={e => setNewSubtopics(p=>({...p,[topicKey]:e.target.value}))} onKeyDown={e => e.key==='Enter' && addSubtopic(lang,topicIdx)} placeholder={`Add subtopic to ${topic.name}`} style={{ ...iStyle, fontSize:'0.78rem' }} />
// //                                     <button onClick={() => addSubtopic(lang,topicIdx)} style={{ ...bStyle('#6366f1'), padding:'0.45rem 0.875rem', fontSize:'0.7rem' }}>+ Subtopic</button>
// //                                   </div>
// //                                 </div>

// //                                 {/* Content items */}
// //                                 <div>
// //                                   <p style={{ fontSize:'0.6rem', fontWeight:900, color:'#475569', letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:'0.6rem' }}>Content — Learn · Practice · Test · Slides</p>

// //                                   <div style={{ display:'flex', flexDirection:'column', gap:'0.4rem', marginBottom:'0.75rem' }}>
// //                                     {!topic.content?.length ? (
// //                                       <p style={{ fontSize:'0.75rem', color:'#475569' }}>No content yet.</p>
// //                                     ) : topic.content.map((item, ci) => {
// //                                       const cfg = contentCfg(item.type);
// //                                       return (
// //                                         <div key={ci} style={{ display:'flex', alignItems:'center', gap:'0.75rem', padding:'0.6rem 0.875rem', background:'rgba(15,23,42,0.7)', borderRadius:'0.6rem', border:'1px solid #1e293b' }}>
// //                                           <span style={{ fontSize:'1rem', flexShrink:0 }}>{cfg.icon}</span>
// //                                           <div style={{ flex:1, minWidth:0 }}>
// //                                             <p style={{ fontSize:'0.8rem', fontWeight:700, color:'#e2e8f0', margin:0, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{item.title}</p>
// //                                             <p style={{ fontSize:'0.62rem', color:'#64748b', margin:0 }}>{item.type==='ppt' ? item.fileSize : item.duration}</p>
// //                                           </div>
// //                                           <span style={pillS(cfg.color)}>{cfg.tag}</span>
// //                                           {item.type==='ppt' && item.downloadUrl && (
// //                                             <a href={item.downloadUrl} target="_blank" rel="noreferrer"
// //                                               style={{ fontSize:'0.62rem', fontWeight:800, padding:'0.2rem 0.55rem', borderRadius:'0.4rem', background:'rgba(139,92,246,0.15)', color:'#a78bfa', border:'1px solid rgba(139,92,246,0.3)', textDecoration:'none', flexShrink:0 }}>
// //                                               ⬇
// //                                             </a>
// //                                           )}
// //                                           {/* DELETE content item */}
// //                                           <DeleteButton
// //                                             itemName={`"${item.title}"`}
// //                                             onConfirm={() => deleteContent(lang, topicIdx, ci)}
// //                                           />
// //                                         </div>
// //                                       );
// //                                     })}
// //                                   </div>

// //                                   {/* THE INLINE ADD CONTENT FORM */}
// //                                   <div style={{ background:'rgba(15,23,42,0.5)', borderRadius:'0.75rem', padding:'0.875rem', border:'1px solid #1e293b' }}>
// //                                     <p style={{ fontSize:'0.6rem', fontWeight:800, color:'#475569', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:'0.6rem' }}>Add Content</p>
// //                                     <div style={{ display:'flex', gap:'0.4rem', marginBottom:'0.6rem', flexWrap:'wrap' }}>
// //                                       {CONTENT_TYPES.map(ct => {
// //                                         const isActive = newContent[topicKey]?.type === ct.key;
// //                                         return (
// //                                           <button key={ct.key} type="button"
// //                                             onClick={() => {
// //                                               setNewContent(p => ({ ...p, [topicKey]: { ...p[topicKey], type:ct.key } }));
// //                                               setPptKey(ct.key==='ppt' ? (pptKey===topicKey ? null : topicKey) : null);
// //                                             }}
// //                                             style={{ padding:'0.35rem 0.75rem', borderRadius:'0.45rem', fontWeight:800, fontSize:'0.68rem', border:`1px solid ${isActive?ct.color:'#334155'}`, background:isActive?`${ct.color}22`:'transparent', color:isActive?ct.color:'#64748b', cursor:'pointer', transition:'all 0.15s' }}>
// //                                             {ct.icon} {ct.label}
// //                                           </button>
// //                                         );
// //                                       })}
// //                                     </div>
// //                                     {pptKey === topicKey ? (
// //                                       <PPTUploader langId={lang.id} topicIdx={topicIdx} onUploaded={item => handlePPTUploaded(lang, topicIdx, item)} />
// //                                     ) : newContent[topicKey]?.type && newContent[topicKey].type!=='ppt' && (
// //                                       <div style={{ display:'flex', gap:'0.5rem' }}>
// //                                         <input value={newContent[topicKey]?.title||''} onChange={e => setNewContent(p=>({...p,[topicKey]:{...p[topicKey],title:e.target.value}}))} onKeyDown={e => e.key==='Enter' && addContent(lang,topicIdx)} placeholder="Content title" style={{ ...iStyle, fontSize:'0.78rem' }} />
// //                                         <input value={newContent[topicKey]?.duration||''} onChange={e => setNewContent(p=>({...p,[topicKey]:{...p[topicKey],duration:e.target.value}}))} placeholder="Duration (e.g., 45 Mins)" style={{ ...iStyle, width:'130px', flex:'none', fontSize:'0.78rem' }} />
// //                                         <button onClick={() => addContent(lang,topicIdx)} style={bStyle('#10b981')}>+ Add</button>
// //                                       </div>
// //                                     )}
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
// //                       <p style={{ fontSize:'0.6rem', fontWeight:900, color:'#475569', letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:'0.5rem' }}>+ Add Topic to {lang.name}</p>
// //                       <div style={{ display:'flex', gap:'0.6rem' }}>
// //                         <input value={newTopics[lang.id]||''} onChange={e => setNewTopics(p=>({...p,[lang.id]:e.target.value}))} onKeyDown={e => e.key==='Enter' && addTopic(lang)} placeholder="e.g., I/O Basics, Arrays, OOP" style={iStyle} />
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
























// import React, { useState, useEffect, useRef } from 'react';
// import {
//   collection, getDocs, addDoc, updateDoc, deleteDoc,
//   doc, serverTimestamp, query, orderBy
// } from 'firebase/firestore';
// import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
// import { db, storage } from '../../firebase/config';
// import DeleteButton from '../ui/Deletebutton';

// const CONTENT_TYPES = [
//   { key: 'lesson', label: 'Intro Lesson',    icon: '📖', color: '#3b82f6', tag: 'Learning' },
//   { key: 'mcq',    label: 'MCQ Practice',    icon: '📋', color: '#f59e0b', tag: 'Practice' },
//   { key: 'coding', label: 'Coding Question', icon: '💻', color: '#10b981', tag: 'Coding'   },
//   { key: 'ppt',    label: 'PPT Slides',      icon: '📊', color: '#8b5cf6', tag: 'Slides'   },
// ];

// const LANG_ICONS = {
//   Python: '🐍', Java: '☕', JavaScript: '🟨',
//   C: '⚙️', 'C++': '⚡', SQL: '🗄️', default: '📘'
// };

// const iStyle = {
//   flex: 1, background: '#0f172a', border: '1px solid #334155',
//   borderRadius: '0.6rem', padding: '0.55rem 0.875rem',
//   color: '#f1f5f9', fontSize: '0.82rem', outline: 'none'
// };
// const bStyle = (color = '#3b82f6', extra = {}) => ({
//   padding: '0.5rem 1.1rem', borderRadius: '0.6rem', background: color,
//   color: '#fff', fontWeight: 800, fontSize: '0.75rem',
//   border: 'none', cursor: 'pointer', whiteSpace: 'nowrap', ...extra
// });
// const cardS = (border = '#1e293b') => ({
//   background: 'rgba(15,23,42,0.6)', border: `1px solid ${border}`,
//   borderRadius: '0.875rem', overflow: 'hidden', transition: 'border-color 0.2s'
// });
// const pillS = (color) => ({
//   fontSize: '0.6rem', fontWeight: 800, padding: '0.15rem 0.55rem',
//   borderRadius: '999px', background: `${color}22`, color,
//   letterSpacing: '0.06em', flexShrink: 0
// });

// /* ─────────────────────────────────────────────────────────────────────────────
//    PPT UPLOADER
// ───────────────────────────────────────────────────────────────────────────── */
// function PPTUploader({ langId, topicIdx, onUploaded }) {
//   const fileRef = useRef();
//   const [uploading, setUploading] = useState(false);
//   const [progress, setProgress]   = useState(0);
//   const [pptTitle, setPptTitle]   = useState('');
//   const [file, setFile]           = useState(null);
//   const [err, setErr]             = useState('');

//   const pick = (e) => {
//     const f = e.target.files[0];
//     if (!f) return;
//     setErr(''); setFile(f);
//     if (!pptTitle) setPptTitle(f.name.replace(/\.[^/.]+$/, ''));
//   };

//   const upload = () => {
//     if (!file)         { setErr('Choose a file first.'); return; }
//     if (!pptTitle.trim()) { setErr('Enter a title.'); return; }
//     setUploading(true); setErr('');
//     const sRef = ref(storage, `learning_ppts/${langId}/topic_${topicIdx}/${Date.now()}_${file.name}`);
//     const task = uploadBytesResumable(sRef, file);
//     task.on(
//       'state_changed',
//       s => setProgress(Math.round((s.bytesTransferred / s.totalBytes) * 100)),
//       e => { setErr('Upload failed.'); setUploading(false); console.error(e); },
//       () => getDownloadURL(task.snapshot.ref).then(url => {
//         onUploaded({
//           type: 'ppt', title: pptTitle.trim(), fileName: file.name,
//           fileSize: (file.size / 1024 / 1024).toFixed(2) + ' MB',
//           downloadUrl: url, storagePath: task.snapshot.ref.fullPath
//         });
//         setPptTitle(''); setFile(null); setProgress(0); setUploading(false);
//         if (fileRef.current) fileRef.current.value = '';
//       })
//     );
//   };

//   return (
//     <div style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: '0.75rem', padding: '0.875rem', marginTop: '0.5rem' }}>
//       <p style={{ fontSize: '0.6rem', fontWeight: 900, color: '#a78bfa', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.6rem' }}>📊 Upload File (PPT / PDF / DOC / Video / Image)</p>
//       <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.6rem', flexWrap: 'wrap' }}>
//         <input ref={fileRef} type="file" accept="*/*" onChange={pick} style={{ display: 'none' }} id={`ppt-${langId}-${topicIdx}`} />
//         <label htmlFor={`ppt-${langId}-${topicIdx}`} style={bStyle('rgba(139,92,246,0.2)', { border: '1px solid rgba(139,92,246,0.4)', color: '#a78bfa', cursor: 'pointer' })}>
//           📎 Choose File
//         </label>
//         {file && <span style={{ fontSize: '0.75rem', color: '#94a3b8', alignSelf: 'center', fontFamily: 'monospace' }}>{file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</span>}
//       </div>
//       <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.6rem' }}>
//         <input value={pptTitle} onChange={e => setPptTitle(e.target.value)} placeholder="File title" style={{ ...iStyle, fontSize: '0.78rem' }} />
//         <button onClick={upload} disabled={uploading || !file} style={bStyle('#8b5cf6', { opacity: uploading || !file ? 0.5 : 1 })}>
//           {uploading ? `${progress}%` : '⬆ Upload'}
//         </button>
//       </div>
//       {uploading && (
//         <div style={{ background: '#1e293b', borderRadius: '999px', height: '6px', overflow: 'hidden' }}>
//           <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg,#8b5cf6,#6366f1)', transition: 'width 0.3s', borderRadius: '999px' }} />
//         </div>
//       )}
//       {err && <p style={{ fontSize: '0.72rem', color: '#f87171', marginTop: '0.4rem' }}>{err}</p>}
//     </div>
//   );
// }

// /* ─────────────────────────────────────────────────────────────────────────────
//    MCQ FORM  — add a single MCQ question inline
// ───────────────────────────────────────────────────────────────────────────── */
// function MCQForm({ onAdd }) {
//   const [q, setQ]         = useState('');
//   const [opts, setOpts]   = useState(['', '', '', '']);
//   const [correct, setCorrect] = useState(0);
//   const [exp, setExp]     = useState('');

//   const setOpt = (i, v) => { const a = [...opts]; a[i] = v; setOpts(a); };

//   const submit = () => {
//     if (!q.trim() || opts.some(o => !o.trim())) { alert('Fill question and all 4 options'); return; }
//     onAdd({ type: 'mcq', title: q.trim(), options: opts, correctIndex: correct, explanation: exp.trim(), duration: '20 Mins' });
//     setQ(''); setOpts(['', '', '', '']); setCorrect(0); setExp('');
//   };

//   return (
//     <div style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '0.75rem', padding: '0.875rem', marginTop: '0.5rem' }}>
//       <p style={{ fontSize: '0.6rem', fontWeight: 900, color: '#fbbf24', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.6rem' }}>🧠 Add MCQ Question</p>
//       <textarea value={q} onChange={e => setQ(e.target.value)} placeholder="Enter your question..." rows={2}
//         style={{ ...iStyle, width: '100%', resize: 'none', marginBottom: '0.6rem', boxSizing: 'border-box' }} />
//       <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem', marginBottom: '0.6rem' }}>
//         {opts.map((o, i) => (
//           <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.3rem 0.5rem', borderRadius: '0.5rem', border: `1px solid ${correct === i ? '#10b981' : '#334155'}`, background: correct === i ? 'rgba(16,185,129,0.08)' : 'transparent' }}>
//             <button type="button" onClick={() => setCorrect(i)}
//               style={{ width: '1rem', height: '1rem', borderRadius: '50%', border: `2px solid ${correct === i ? '#10b981' : '#475569'}`, background: correct === i ? '#10b981' : 'transparent', cursor: 'pointer', flexShrink: 0 }} />
//             <span style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 800 }}>{String.fromCharCode(65 + i)}.</span>
//             <input value={o} onChange={e => setOpt(i, e.target.value)} placeholder={`Option ${String.fromCharCode(65 + i)}`}
//               style={{ ...iStyle, padding: '0.25rem 0.4rem', fontSize: '0.75rem' }} />
//           </div>
//         ))}
//       </div>
//       <input value={exp} onChange={e => setExp(e.target.value)} placeholder="Explanation (optional)" style={{ ...iStyle, marginBottom: '0.6rem', width: '100%', boxSizing: 'border-box' }} />
//       <button onClick={submit} style={bStyle('#f59e0b')}>+ Add MCQ</button>
//     </div>
//   );
// }

// /* ─────────────────────────────────────────────────────────────────────────────
//    CODING QUESTION FORM
// ───────────────────────────────────────────────────────────────────────────── */
// function CodingForm({ onAdd }) {
//   const [title, setTitle]   = useState('');
//   const [diff, setDiff]     = useState('Easy');
//   const [tags, setTags]     = useState('');
//   const [desc, setDesc]     = useState('');

//   const submit = () => {
//     if (!title.trim()) { alert('Title required'); return; }
//     onAdd({ type: 'coding', title: title.trim(), difficulty: diff, tags: tags.trim(), description: desc.trim(), duration: '30 Mins' });
//     setTitle(''); setDiff('Easy'); setTags(''); setDesc('');
//   };

//   const DIFFS = [
//     { label: 'Easy',   color: '#10b981' },
//     { label: 'Medium', color: '#f59e0b' },
//     { label: 'Hard',   color: '#ef4444' },
//   ];

//   return (
//     <div style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '0.75rem', padding: '0.875rem', marginTop: '0.5rem' }}>
//       <p style={{ fontSize: '0.6rem', fontWeight: 900, color: '#34d399', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.6rem' }}>💻 Add Coding Question</p>
//       <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.6rem', flexWrap: 'wrap' }}>
//         <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Question title (e.g. Two Sum)"
//           style={{ ...iStyle, flex: 2 }} />
//         <div style={{ display: 'flex', gap: '0.25rem', background: '#0f172a', padding: '0.2rem', borderRadius: '0.5rem', border: '1px solid #334155' }}>
//           {DIFFS.map(d => (
//             <button key={d.label} type="button" onClick={() => setDiff(d.label)}
//               style={{ padding: '0.3rem 0.6rem', borderRadius: '0.35rem', fontWeight: 800, fontSize: '0.65rem', border: 'none', cursor: 'pointer', background: diff === d.label ? d.color : 'transparent', color: diff === d.label ? '#fff' : '#64748b', transition: 'all .15s' }}>
//               {d.label}
//             </button>
//           ))}
//         </div>
//       </div>
//       <input value={tags} onChange={e => setTags(e.target.value)} placeholder="Tags: arrays, loops, dp"
//         style={{ ...iStyle, marginBottom: '0.6rem', width: '100%', boxSizing: 'border-box' }} />
//       <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={2} placeholder="Problem description (optional)"
//         style={{ ...iStyle, width: '100%', resize: 'none', marginBottom: '0.6rem', boxSizing: 'border-box' }} />
//       <button onClick={submit} style={bStyle('#10b981')}>+ Add Question</button>
//     </div>
//   );
// }

// /* ─────────────────────────────────────────────────────────────────────────────
//    MAIN COMPONENT
// ───────────────────────────────────────────────────────────────────────────── */
// export default function LearningModules({ moduleData }) {
//   const [languages, setLanguages]       = useState([]);
//   const [expandedLang, setExpandedLang] = useState(null);
//   const [expandedTopic, setExpandedTopic] = useState(null);

//   // Which sub-panel is open per topic: null | 'coding' | 'mcq' | 'ppt' | 'lesson'
//   const [activePanel, setActivePanel]   = useState({});

//   const [loading, setLoading]           = useState(true);
//   const [newLang, setNewLang]           = useState('');
//   const [newTopics, setNewTopics]       = useState({});
//   const [newSubtopics, setNewSubtopics] = useState({});
//   const [creatingLang, setCreatingLang] = useState(false);

//   /* ── fetch ── */
//   const fetchAll = async () => {
//     setLoading(true);
//     try {
//       const snap = await getDocs(query(collection(db, 'learningLanguages'), orderBy('createdAt')));
//       setLanguages(snap.docs.map(d => ({ id: d.id, ...d.data() })));
//     } catch (e) { console.error(e); }
//     setLoading(false);
//   };
//   useEffect(() => { fetchAll(); }, []);

//   /* ── delete language ── */
//   const deleteLang = async (lang) => {
//     await deleteDoc(doc(db, 'learningLanguages', lang.id));
//     if (expandedLang === lang.id) setExpandedLang(null);
//     await fetchAll();
//   };

//   /* ── delete topic ── */
//   const deleteTopic = async (lang, topicIdx) => {
//     const topics = lang.topics.filter((_, i) => i !== topicIdx);
//     await updateDoc(doc(db, 'learningLanguages', lang.id), { topics });
//     const key = `${lang.id}-${topicIdx}`;
//     if (expandedTopic === key) setExpandedTopic(null);
//     await fetchAll();
//   };

//   /* ── delete subtopic ── */
//   const deleteSubtopic = async (lang, topicIdx, subIdx) => {
//     const topics = lang.topics.map((t, i) =>
//       i === topicIdx ? { ...t, subtopics: t.subtopics.filter((_, si) => si !== subIdx) } : t
//     );
//     await updateDoc(doc(db, 'learningLanguages', lang.id), { topics });
//     await fetchAll();
//   };

//   /* ── delete content item ── */
//   const deleteContent = async (lang, topicIdx, contentIdx) => {
//     const item = lang.topics[topicIdx].content[contentIdx];
//     if (item.type === 'ppt' && item.storagePath) {
//       try { await deleteObject(ref(storage, item.storagePath)); } catch {}
//     }
//     const topics = lang.topics.map((t, i) =>
//       i === topicIdx ? { ...t, content: t.content.filter((_, ci) => ci !== contentIdx) } : t
//     );
//     await updateDoc(doc(db, 'learningLanguages', lang.id), { topics });
//     await fetchAll();
//   };

//   /* ── create language ── */
//   const createLang = async () => {
//     if (!newLang.trim()) return;
//     setCreatingLang(true);
//     try {
//       await addDoc(collection(db, 'learningLanguages'), {
//         name: newLang.trim(), topics: [], createdAt: serverTimestamp()
//       });
//       setNewLang(''); await fetchAll();
//     } catch { alert('Failed to create language.'); }
//     setCreatingLang(false);
//   };

//   /* ── add topic ── */
//   const addTopic = async (lang) => {
//     const name = (newTopics[lang.id] || '').trim();
//     if (!name) return;
//     const newTopic = { id: name.toLowerCase().replace(/\s+/g, '-'), name, subtopics: [], content: [] };
//     await updateDoc(doc(db, 'learningLanguages', lang.id), { topics: [...(lang.topics || []), newTopic] });
//     setNewTopics(p => ({ ...p, [lang.id]: '' }));
//     await fetchAll();
//   };

//   /* ── add subtopic ── */
//   const addSubtopic = async (lang, topicIdx) => {
//     const key  = `${lang.id}-${topicIdx}`;
//     const name = (newSubtopics[key] || '').trim();
//     if (!name) return;
//     const topics = lang.topics.map((t, i) =>
//       i === topicIdx ? { ...t, subtopics: [...(t.subtopics || []), name] } : t
//     );
//     await updateDoc(doc(db, 'learningLanguages', lang.id), { topics });
//     setNewSubtopics(p => ({ ...p, [key]: '' }));
//     await fetchAll();
//   };

//   /* ── add content item (lesson / mcq / coding / ppt) ── */
//   const addContentItem = async (lang, topicIdx, item) => {
//     const topics = lang.topics.map((t, i) =>
//       i === topicIdx
//         ? { ...t, content: [...(t.content || []), { ...item, createdAt: new Date().toISOString() }] }
//         : t
//     );
//     await updateDoc(doc(db, 'learningLanguages', lang.id), { topics });
//     await fetchAll();
//   };

//   /* ── toggle sub-panel ── */
//   const togglePanel = (topicKey, panelKey) => {
//     setActivePanel(prev => ({
//       ...prev,
//       [topicKey]: prev[topicKey] === panelKey ? null : panelKey
//     }));
//   };

//   const langIcon    = (name) => LANG_ICONS[name] || LANG_ICONS.default;
//   const contentCfg  = (type) => CONTENT_TYPES.find(c => c.key === type) || CONTENT_TYPES[0];

//   /* ────────────────────────────────────────────────────────────────────────── */
//   return (
//     <div>
//       {/* ── Create language ── */}
//       <div style={{ ...cardS('#1e3a5f'), padding: '1.25rem', marginBottom: '1.5rem' }}>
//         <p style={{ fontSize: '0.6rem', fontWeight: 900, color: '#64748b', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
//           + Create Language
//         </p>
//         <div style={{ display: 'flex', gap: '0.75rem' }}>
//           <input value={newLang} onChange={e => setNewLang(e.target.value)}
//             onKeyDown={e => e.key === 'Enter' && createLang()}
//             placeholder="e.g., Python, Java, SQL" style={iStyle} />
//           <button onClick={createLang} disabled={creatingLang} style={bStyle()}>
//             {creatingLang ? '...' : 'Create'}
//           </button>
//         </div>
//       </div>

//       {/* ── Language list ── */}
//       {loading ? (
//         <div style={{ textAlign: 'center', padding: '3rem', color: '#475569' }}>Loading...</div>
//       ) : languages.length === 0 ? (
//         <div style={{ textAlign: 'center', padding: '4rem', color: '#334155' }}>
//           <p style={{ fontSize: '2.5rem' }}>📘</p>
//           <p style={{ fontWeight: 700, color: '#64748b', marginTop: '0.5rem' }}>No languages yet. Create one above.</p>
//         </div>
//       ) : (
//         <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
//           {languages.map(lang => {
//             const isLangOpen = expandedLang === lang.id;

//             return (
//               <div key={lang.id} style={cardS(isLangOpen ? '#3b82f6' : '#1e293b')}>

//                 {/* ── Language header ── */}
//                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.25rem' }}>
//                   <div onClick={() => setExpandedLang(isLangOpen ? null : lang.id)}
//                     style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, cursor: 'pointer' }}>
//                     <span style={{ fontSize: '1.5rem' }}>{langIcon(lang.name)}</span>
//                     <div>
//                       <p style={{ fontWeight: 900, fontSize: '1rem', color: '#f1f5f9', margin: 0 }}>{lang.name}</p>
//                       <p style={{ fontSize: '0.65rem', color: '#64748b', margin: 0 }}>{lang.topics?.length || 0} topics</p>
//                     </div>
//                     {/* Topic pills */}
//                     <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginLeft: '0.5rem' }}>
//                       {lang.topics?.slice(0, 3).map((t, i) => (
//                         <span key={i} style={{ fontSize: '0.62rem', padding: '0.15rem 0.55rem', borderRadius: '999px', background: 'rgba(59,130,246,0.12)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.25)', fontWeight: 700 }}>{t.name}</span>
//                       ))}
//                       {lang.topics?.length > 3 && <span style={{ fontSize: '0.62rem', color: '#475569' }}>+{lang.topics.length - 3}</span>}
//                     </div>
//                   </div>
//                   <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
//                     <span onClick={() => setExpandedLang(isLangOpen ? null : lang.id)}
//                       style={{ color: '#475569', fontSize: '0.8rem', display: 'inline-block', transform: isLangOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s', cursor: 'pointer' }}>▼</span>
//                     <DeleteButton itemName={`language "${lang.name}" and all its topics`} onConfirm={() => deleteLang(lang)} />
//                   </div>
//                 </div>

//                 {/* ── Language body ── */}
//                 {isLangOpen && (
//                   <div style={{ borderTop: '1px solid #1e293b', padding: '1.25rem' }}>

//                     {/* Topics */}
//                     <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
//                       {!lang.topics?.length ? (
//                         <p style={{ color: '#475569', fontSize: '0.8rem' }}>No topics yet. Add one below.</p>
//                       ) : lang.topics.map((topic, topicIdx) => {
//                         const topicKey    = `${lang.id}-${topicIdx}`;
//                         const isTopicOpen = expandedTopic === topicKey;
//                         const pptCount    = topic.content?.filter(c => c.type === 'ppt').length || 0;
//                         const mcqCount    = topic.content?.filter(c => c.type === 'mcq').length || 0;
//                         const codingCount = topic.content?.filter(c => c.type === 'coding').length || 0;
//                         const curPanel    = activePanel[topicKey] || null;

//                         return (
//                           <div key={topicIdx} style={{ background: 'rgba(30,41,59,0.6)', border: '1px solid #334155', borderRadius: '0.75rem', overflow: 'hidden' }}>

//                             {/* Topic header */}
//                             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem' }}>
//                               <div onClick={() => setExpandedTopic(isTopicOpen ? null : topicKey)}
//                                 style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flex: 1, cursor: 'pointer' }}>
//                                 {/* completion dot */}
//                                 <div style={{ width: '1.4rem', height: '1.4rem', borderRadius: '50%', background: topic.content?.length ? '#10b981' : '#1e293b', border: `2px solid ${topic.content?.length ? '#10b981' : '#334155'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
//                                   {topic.content?.length ? <span style={{ fontSize: '0.55rem', color: '#fff' }}>✓</span> : null}
//                                 </div>
//                                 <div>
//                                   <p style={{ fontWeight: 800, fontSize: '0.875rem', color: '#e2e8f0', margin: 0 }}>
//                                     <span style={{ fontSize: '0.58rem', color: '#64748b', marginRight: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>TOPIC</span>
//                                     {topic.name}
//                                   </p>
//                                   <p style={{ fontSize: '0.62rem', color: '#64748b', margin: 0 }}>
//                                     {topic.subtopics?.length || 0} subtopics · {topic.content?.length || 0} items
//                                     {codingCount > 0 && <span style={{ marginLeft: '0.35rem', color: '#10b981' }}>· 💻 {codingCount}</span>}
//                                     {mcqCount > 0    && <span style={{ marginLeft: '0.35rem', color: '#f59e0b' }}>· 🧠 {mcqCount}</span>}
//                                     {pptCount > 0    && <span style={{ marginLeft: '0.35rem', color: '#a78bfa' }}>· 📊 {pptCount}</span>}
//                                   </p>
//                                 </div>
//                               </div>
//                               <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}>
//                                 <span onClick={() => setExpandedTopic(isTopicOpen ? null : topicKey)}
//                                   style={{ color: '#475569', fontSize: '0.75rem', transform: isTopicOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s', cursor: 'pointer', display: 'inline-block' }}>▼</span>
//                                 <DeleteButton itemName={`topic "${topic.name}"`} onConfirm={() => deleteTopic(lang, topicIdx)} />
//                               </div>
//                             </div>

//                             {/* Topic body */}
//                             {isTopicOpen && (
//                               <div style={{ borderTop: '1px solid #1e293b', padding: '1rem' }}>

//                                 {/* ── 3 BIG ACTION BUTTONS ── */}
//                                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
//                                   {[
//                                     { key: 'coding', icon: '💻', label: 'Coding Questions', color: '#10b981', count: codingCount },
//                                     { key: 'mcq',    icon: '🧠', label: 'MCQ Practice',     color: '#f59e0b', count: mcqCount    },
//                                     { key: 'ppt',    icon: '📊', label: 'PPT / Files',       color: '#8b5cf6', count: pptCount    },
//                                   ].map(btn => (
//                                     <button key={btn.key}
//                                       onClick={() => togglePanel(topicKey, btn.key)}
//                                       style={{
//                                         padding: '1rem 0.75rem', borderRadius: '0.75rem', cursor: 'pointer', textAlign: 'center',
//                                         border: `1px solid ${curPanel === btn.key ? btn.color : '#334155'}`,
//                                         background: curPanel === btn.key ? `${btn.color}18` : 'rgba(15,23,42,0.5)',
//                                         transition: 'all 0.2s',
//                                       }}>
//                                       <div style={{ fontSize: '1.5rem', marginBottom: '0.3rem' }}>{btn.icon}</div>
//                                       <div style={{ fontSize: '0.72rem', fontWeight: 800, color: curPanel === btn.key ? btn.color : '#94a3b8' }}>{btn.label}</div>
//                                       <div style={{ fontSize: '0.6rem', color: '#475569', marginTop: '0.2rem' }}>{btn.count} items</div>
//                                     </button>
//                                   ))}
//                                 </div>

//                                 {/* ── CODING PANEL ── */}
//                                 {curPanel === 'coding' && (
//                                   <div style={{ marginBottom: '1rem' }}>
//                                     <p style={{ fontSize: '0.6rem', fontWeight: 900, color: '#34d399', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.6rem' }}>💻 Coding Questions</p>
//                                     {/* existing items */}
//                                     <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '0.5rem' }}>
//                                       {topic.content?.filter(c => c.type === 'coding').map((item, ci) => {
//                                         const realIdx = topic.content.indexOf(item);
//                                         const diffC   = item.difficulty === 'Easy' ? '#10b981' : item.difficulty === 'Medium' ? '#f59e0b' : '#ef4444';
//                                         return (
//                                           <div key={ci} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0.875rem', background: 'rgba(15,23,42,0.7)', borderRadius: '0.6rem', border: '1px solid #1e293b' }}>
//                                             <span style={{ fontSize: '1rem' }}>💻</span>
//                                             <div style={{ flex: 1, minWidth: 0 }}>
//                                               <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#e2e8f0', margin: 0 }}>{item.title}</p>
//                                               <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.2rem', flexWrap: 'wrap' }}>
//                                                 {item.difficulty && <span style={{ fontSize: '0.58rem', fontWeight: 800, padding: '0.1rem 0.4rem', borderRadius: '0.3rem', background: `${diffC}22`, color: diffC }}>{item.difficulty}</span>}
//                                                 {item.tags && item.tags.split(',').map(t => <span key={t} style={{ fontSize: '0.58rem', background: 'rgba(99,102,241,0.15)', color: '#818cf8', padding: '0.1rem 0.35rem', borderRadius: '0.25rem' }}>{t.trim()}</span>)}
//                                               </div>
//                                             </div>
//                                             <DeleteButton itemName={`"${item.title}"`} onConfirm={() => deleteContent(lang, topicIdx, realIdx)} />
//                                           </div>
//                                         );
//                                       })}
//                                       {!topic.content?.some(c => c.type === 'coding') && (
//                                         <p style={{ fontSize: '0.75rem', color: '#475569' }}>No coding questions yet.</p>
//                                       )}
//                                     </div>
//                                     <CodingForm onAdd={item => addContentItem(lang, topicIdx, item)} />
//                                   </div>
//                                 )}

//                                 {/* ── MCQ PANEL ── */}
//                                 {curPanel === 'mcq' && (
//                                   <div style={{ marginBottom: '1rem' }}>
//                                     <p style={{ fontSize: '0.6rem', fontWeight: 900, color: '#fbbf24', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.6rem' }}>🧠 MCQ Questions</p>
//                                     <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.5rem' }}>
//                                       {topic.content?.filter(c => c.type === 'mcq').map((item, ci) => {
//                                         const realIdx = topic.content.indexOf(item);
//                                         return (
//                                           <div key={ci} style={{ padding: '0.75rem', background: 'rgba(15,23,42,0.7)', borderRadius: '0.6rem', border: '1px solid #1e293b' }}>
//                                             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.5rem' }}>
//                                               <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#e2e8f0', margin: 0, flex: 1 }}>Q{ci + 1}. {item.title}</p>
//                                               <DeleteButton itemName={`"${item.title}"`} onConfirm={() => deleteContent(lang, topicIdx, realIdx)} />
//                                             </div>
//                                             {item.options && (
//                                               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.3rem' }}>
//                                                 {item.options.map((opt, oi) => (
//                                                   <div key={oi} style={{ padding: '0.3rem 0.6rem', borderRadius: '0.4rem', border: `1px solid ${oi === item.correctIndex ? '#10b981' : '#1e293b'}`, background: oi === item.correctIndex ? 'rgba(16,185,129,0.1)' : 'rgba(15,23,42,0.5)', fontSize: '0.72rem', color: oi === item.correctIndex ? '#34d399' : '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
//                                                     <span style={{ fontWeight: 800, fontSize: '0.6rem' }}>{String.fromCharCode(65 + oi)}.</span> {opt}
//                                                     {oi === item.correctIndex && <span style={{ marginLeft: 'auto', fontSize: '0.6rem', color: '#10b981' }}>✓</span>}
//                                                   </div>
//                                                 ))}
//                                               </div>
//                                             )}
//                                           </div>
//                                         );
//                                       })}
//                                       {!topic.content?.some(c => c.type === 'mcq') && (
//                                         <p style={{ fontSize: '0.75rem', color: '#475569' }}>No MCQs yet.</p>
//                                       )}
//                                     </div>
//                                     <MCQForm onAdd={item => addContentItem(lang, topicIdx, item)} />
//                                   </div>
//                                 )}

//                                 {/* ── PPT / FILES PANEL ── */}
//                                 {curPanel === 'ppt' && (
//                                   <div style={{ marginBottom: '1rem' }}>
//                                     <p style={{ fontSize: '0.6rem', fontWeight: 900, color: '#a78bfa', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.6rem' }}>📊 Files & Slides</p>
//                                     <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '0.5rem' }}>
//                                       {topic.content?.filter(c => c.type === 'ppt').map((item, ci) => {
//                                         const realIdx = topic.content.indexOf(item);
//                                         return (
//                                           <div key={ci} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0.875rem', background: 'rgba(15,23,42,0.7)', borderRadius: '0.6rem', border: '1px solid #1e293b' }}>
//                                             <span style={{ fontSize: '1rem' }}>📊</span>
//                                             <div style={{ flex: 1, minWidth: 0 }}>
//                                               <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#e2e8f0', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</p>
//                                               <p style={{ fontSize: '0.62rem', color: '#64748b', margin: 0 }}>{item.fileSize || ''}</p>
//                                             </div>
//                                             <span style={pillS('#8b5cf6')}>Slides</span>
//                                             {item.downloadUrl && (
//                                               <a href={item.downloadUrl} target="_blank" rel="noreferrer"
//                                                 style={{ fontSize: '0.62rem', fontWeight: 800, padding: '0.2rem 0.55rem', borderRadius: '0.4rem', background: 'rgba(139,92,246,0.15)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.3)', textDecoration: 'none', flexShrink: 0 }}>⬇</a>
//                                             )}
//                                             <DeleteButton itemName={`"${item.title}"`} onConfirm={() => deleteContent(lang, topicIdx, realIdx)} />
//                                           </div>
//                                         );
//                                       })}
//                                       {!topic.content?.some(c => c.type === 'ppt') && (
//                                         <p style={{ fontSize: '0.75rem', color: '#475569' }}>No files uploaded yet.</p>
//                                       )}
//                                     </div>
//                                     <PPTUploader langId={lang.id} topicIdx={topicIdx}
//                                       onUploaded={item => addContentItem(lang, topicIdx, item)} />
//                                   </div>
//                                 )}

//                                 {/* ── Subtopics ── */}
//                                 <div style={{ marginBottom: '1rem' }}>
//                                   <p style={{ fontSize: '0.6rem', fontWeight: 900, color: '#475569', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.6rem' }}>Subtopics</p>
//                                   <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.6rem' }}>
//                                     {!topic.subtopics?.length ? (
//                                       <span style={{ fontSize: '0.75rem', color: '#475569' }}>No subtopics yet.</span>
//                                     ) : topic.subtopics.map((sub, si) => (
//                                       <div key={si} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.2rem 0.3rem 0.2rem 0.65rem', borderRadius: '0.4rem', background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)' }}>
//                                         <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#818cf8' }}>{sub}</span>
//                                         <button onClick={() => { if (window.confirm(`Delete subtopic "${sub}"?`)) deleteSubtopic(lang, topicIdx, si); }}
//                                           style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '0.7rem', padding: '0 0.1rem', fontWeight: 900 }}
//                                           onMouseEnter={e => e.currentTarget.style.color = '#f87171'}
//                                           onMouseLeave={e => e.currentTarget.style.color = '#64748b'}>✕</button>
//                                       </div>
//                                     ))}
//                                   </div>
//                                   <div style={{ display: 'flex', gap: '0.5rem' }}>
//                                     <input value={newSubtopics[topicKey] || ''} onChange={e => setNewSubtopics(p => ({ ...p, [topicKey]: e.target.value }))}
//                                       onKeyDown={e => e.key === 'Enter' && addSubtopic(lang, topicIdx)}
//                                       placeholder={`Add subtopic to ${topic.name}`} style={{ ...iStyle, fontSize: '0.78rem' }} />
//                                     <button onClick={() => addSubtopic(lang, topicIdx)} style={{ ...bStyle('#6366f1'), padding: '0.45rem 0.875rem', fontSize: '0.7rem' }}>+ Subtopic</button>
//                                   </div>
//                                 </div>

//                               </div>
//                             )}
//                           </div>
//                         );
//                       })}
//                     </div>

//                     {/* Add topic */}
//                     <div>
//                       <p style={{ fontSize: '0.6rem', fontWeight: 900, color: '#475569', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
//                         + Add Topic to {lang.name}
//                       </p>
//                       <div style={{ display: 'flex', gap: '0.6rem' }}>
//                         <input value={newTopics[lang.id] || ''} onChange={e => setNewTopics(p => ({ ...p, [lang.id]: e.target.value }))}
//                           onKeyDown={e => e.key === 'Enter' && addTopic(lang)}
//                           placeholder="e.g., I/O Basics, Arrays, OOP" style={iStyle} />
//                         <button onClick={() => addTopic(lang)} style={bStyle()}>+ Add Topic</button>
//                       </div>
//                     </div>

//                   </div>
//                 )}
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
//  }


// import React, { useState, useEffect } from 'react';
// import { doc, updateDoc, onSnapshot } from 'firebase/firestore';
// import { db } from '../../firebase/config';

// const iStyle = { flex: 1, background: '#0f172a', border: '1px solid #334155', borderRadius: '0.6rem', padding: '0.55rem 0.875rem', color: '#f1f5f9', fontSize: '0.82rem', outline: 'none' };
// const bStyle = (color = '#3b82f6') => ({ padding: '0.5rem 1.1rem', borderRadius: '0.6rem', background: color, color: '#fff', fontWeight: 800, fontSize: '0.75rem', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' });

// export default function LearningModules({ moduleData, onOpenTopic }) {
//   const [topics, setTopics] = useState(moduleData?.topics || []);
//   const [newTopic, setNewTopic] = useState('');
//   const [newSubtopics, setNewSubtopics] = useState({});

//   useEffect(() => {
//     if (!moduleData?.id) return;
//     const unsub = onSnapshot(doc(db, 'categories', moduleData.id), (docSnap) => {
//       if (docSnap.exists()) {
//         setTopics(docSnap.data().topics || []);
//       }
//     });
//     return () => unsub();
//   }, [moduleData]);

//   const addTopic = async () => {
//     if (!newTopic.trim()) return;
//     const topicId = newTopic.trim().toLowerCase().replace(/[^a-z0-9]/g, '-');
    
//     // FIXED: Initialize codingQuestionIds and mcqIds arrays
//     const updatedTopics = [...topics, { 
//       id: topicId, 
//       name: newTopic.trim(), 
//       subtopics: [],
//       codingQuestionIds: [],
//       mcqIds: [] 
//     }];
    
//     await updateDoc(doc(db, 'categories', moduleData.id), { topics: updatedTopics });
//     setNewTopic('');
//   };

//   const deleteTopic = async (idx) => {
//     if (!window.confirm("Are you sure you want to delete this topic and all its contents?")) return;
//     const updatedTopics = topics.filter((_, i) => i !== idx);
//     await updateDoc(doc(db, 'categories', moduleData.id), { topics: updatedTopics });
//   };

//   const addSubtopic = async (topicId, idx) => {
//     const val = newSubtopics[topicId];
//     if (!val?.trim()) return;
//     const updatedTopics = topics.map((t, i) => i === idx ? { ...t, subtopics: [...(t.subtopics || []), val.trim()] } : t);
//     await updateDoc(doc(db, 'categories', moduleData.id), { topics: updatedTopics });
//     setNewSubtopics(p => ({ ...p, [topicId]: '' }));
//   };

//   const deleteSubtopic = async (topicIdx, subIdx) => {
//     if (!window.confirm("Remove this subtopic?")) return;
//     const updatedTopics = topics.map((t, i) => i === topicIdx ? { ...t, subtopics: t.subtopics.filter((_, j) => j !== subIdx) } : t);
//     await updateDoc(doc(db, 'categories', moduleData.id), { topics: updatedTopics });
//   };

//   return (
//     <div className="space-y-6">
//       <div style={{ background: 'rgba(30,41,59,0.7)', border: '1px solid #334155', borderRadius: '1rem', padding: '1.25rem' }}>
//         <p style={{ fontSize: '0.6rem', fontWeight: 900, color: '#64748b', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
//           + Add Topic to {moduleData?.name}
//         </p>
//         <div style={{ display: 'flex', gap: '0.75rem' }}>
//           <input 
//             value={newTopic} 
//             onChange={e => setNewTopic(e.target.value)} 
//             onKeyDown={e => e.key === 'Enter' && addTopic()} 
//             placeholder="e.g., I/O Basics, Arrays, OOP Concepts" 
//             style={iStyle} 
//           />
//           <button onClick={addTopic} style={bStyle()}>+ Add Topic</button>
//         </div>
//       </div>

//       {topics.length === 0 ? (
//         <div className="text-center py-12 text-gray-500 text-sm border-2 border-dashed border-gray-700 rounded-2xl">
//           No topics exist in <strong>{moduleData?.name}</strong> yet. <br/>Create a topic above to start adding content.
//         </div>
//       ) : (
//         <div className="space-y-4">
//           {topics.map((topic, idx) => (
//             <div key={topic.id || idx} style={{ background: 'rgba(15,23,42,0.6)', border: '1px solid #1e293b', borderRadius: '1rem', overflow: 'hidden' }}>
//               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.25rem' }}>
//                 <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
//                   <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 font-black text-xs">
//                     {idx + 1}
//                   </div>
//                   <div>
//                     <h3 className="text-base font-black text-white m-0">{topic.name}</h3>
//                     <p className="text-xs text-gray-500 m-0 mt-1">{topic.subtopics?.length || 0} subtopics configured</p>
//                   </div>
//                 </div>
//                 <div style={{ display: 'flex', gap: '0.5rem' }}>
//                   <button onClick={() => onOpenTopic(moduleData, topic)} style={{ ...bStyle('#10b981'), background: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)' }}>
//                     ✏️ Open Topic
//                   </button>
//                   <button onClick={() => deleteTopic(idx)} style={{ ...bStyle('#ef4444'), background: 'rgba(239,68,68,0.15)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)' }}>
//                     🗑 Delete
//                   </button>
//                 </div>
//               </div>
//               <div style={{ borderTop: '1px solid #1e293b', padding: '1rem 1.25rem', background: 'rgba(30,41,59,0.3)' }}>
//                 <div className="flex flex-wrap gap-2 mb-3">
//                   {topic.subtopics?.length > 0 ? topic.subtopics.map((sub, si) => (
//                     <div key={si} className="flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 px-3 py-1 rounded-full text-xs font-bold">
//                       {sub}
//                       <button onClick={() => deleteSubtopic(idx, si)} className="text-indigo-400 hover:text-red-400 ml-1 font-black">✕</button>
//                     </div>
//                   )) : <span className="text-xs text-gray-600">No subtopics defined.</span>}
//                 </div>
//                 <div className="flex gap-2">
//                   <input 
//                     value={newSubtopics[topic.id] || ''} 
//                     onChange={e => setNewSubtopics(p => ({ ...p, [topic.id]: e.target.value }))} 
//                     onKeyDown={e => e.key === 'Enter' && addSubtopic(topic.id, idx)} 
//                     placeholder="Add subtopic name..." 
//                     style={{ ...iStyle, padding: '0.4rem 0.8rem', fontSize: '0.75rem' }} 
//                   />
//                   <button onClick={() => addSubtopic(topic.id, idx)} style={{ ...bStyle('#6366f1'), padding: '0.4rem 1rem', fontSize: '0.7rem' }}>+ Add</button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }


/////


import React, { useState, useEffect, useRef, useMemo } from 'react';
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  collection, getDocs, addDoc, updateDoc, deleteDoc,
  doc, serverTimestamp, query, orderBy
} from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../../firebase/config';
import DeleteButton from '../ui/Deletebutton';

// ── Configuration & Constants ──────────────────────────────────────────────

const LANGUAGES = [
  { id: "python", label: "Python", judge0Id: 71, defaultBoilerplate: `# Do not modify the function signature\ndef solution(nums):\n    pass` },
  { id: "javascript", label: "JavaScript", judge0Id: 93, defaultBoilerplate: `function solution(nums) {\n    \n}` },
  { id: "java", label: "Java", judge0Id: 62, defaultBoilerplate: `public class Main {\n    public static void solution(int[] nums) {}\n}` },
  { id: "c", label: "C", judge0Id: 50, defaultBoilerplate: `#include <stdio.h>\nvoid solution(int* nums, int n) {}` },
  { id: "cpp", label: "C++", judge0Id: 54, defaultBoilerplate: `#include <bits/stdc++.h>\nusing namespace std;\nvoid solution(vector<int>& nums) {}` },
];

const LANG_ICONS = { Python: '🐍', Java: '☕', JavaScript: '🟨', C: '⚙️', 'C++': '⚡', default: '📘' };

const iStyle = {
  flex: 1, background: '#0f172a', border: '1px solid #334155',
  borderRadius: '0.6rem', padding: '0.55rem 0.875rem',
  color: '#f1f5f9', fontSize: '0.82rem', outline: 'none', width: '100%', boxSizing: 'border-box'
};

const bStyle = (color = '#3b82f6', extra = {}) => ({
  padding: '0.5rem 1.1rem', borderRadius: '0.6rem', background: color,
  color: '#fff', fontWeight: 800, fontSize: '0.75rem',
  border: 'none', cursor: 'pointer', whiteSpace: 'nowrap', ...extra
});

const cardS = (border = '#1e293b') => ({
  background: 'rgba(15,23,42,0.6)', border: `1px solid ${border}`,
  borderRadius: '0.875rem', overflow: 'hidden', transition: 'border-color 0.2s'
});

// ── Shared Utility Components ──────────────────────────────────────────────

function BoilerplateEditor({ boilerplates, onChange, timeLimitMs, onTimeLimitChange }) {
  const [activeLang, setActiveLang] = useState(LANGUAGES[0].id);
  const lang = LANGUAGES.find(l => l.id === activeLang);

  return (
    <div style={{ background: "rgba(15,23,42,0.7)", border: "1px solid #334155", borderRadius: "1rem", overflow: "hidden", marginTop: '1rem' }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.8rem 1rem", borderBottom: "1px solid #1e293b", background: "rgba(30,41,59,0.5)" }}>
        <p style={{ fontSize: "0.65rem", fontWeight: 900, color: "#60a5fa", letterSpacing: "0.1em", textTransform: "uppercase", margin: 0 }}>⚙️ Boilerplate Code</p>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ fontSize: "0.65rem", color: "#94a3b8" }}>⏱ {timeLimitMs}ms</span>
          <div style={{ display: "flex", gap: "0.25rem" }}>
            {[1000, 2000, 5000].map(ms => (
              <button key={ms} type="button" onClick={() => onTimeLimitChange(ms)} style={{ padding: "0.2rem 0.4rem", borderRadius: "0.3rem", fontSize: "0.6rem", border: "none", background: timeLimitMs === ms ? "#3b82f6" : "#1e293b", color: "#fff" }}>{ms / 1000}s</button>
            ))}
          </div>
        </div>
      </div>
      <div style={{ display: "flex", background: "rgba(15,23,42,0.4)" }}>
        {LANGUAGES.map(l => (
          <button key={l.id} type="button" onClick={() => setActiveLang(l.id)} style={{ padding: "0.5rem 0.8rem", fontSize: "0.7rem", fontWeight: 700, border: "none", background: activeLang === l.id ? "rgba(59,130,246,0.1)" : "transparent", color: activeLang === l.id ? "#60a5fa" : "#64748b", borderBottom: activeLang === l.id ? "2px solid #3b82f6" : "none" }}>{l.label}</button>
        ))}
      </div>
      <textarea
        value={boilerplates[activeLang]}
        onChange={e => onChange({ ...boilerplates, [activeLang]: e.target.value })}
        rows={10}
        style={{ width: "100%", background: "#0f172a", border: "none", padding: "0.8rem", color: "#e2e8f0", fontFamily: "monospace", fontSize: "0.75rem", outline: "none", resize: "vertical" }}
      />
    </div>
  );
}

// ── Feature Forms ──────────────────────────────────────────────────────────

/* 1. ADVANCED CODING FORM */
function CodingForm({ onAdd }) {
  const [title, setTitle] = useState('');
  const [diff, setDiff] = useState('Easy');
  const [desc, setDesc] = useState('');
  const [marks, setMarks] = useState(100);
  const [timeLimit, setTimeLimit] = useState(2000);
  const [testCases, setTestCases] = useState([{ input: "", expectedOutput: "" }]);
  
  const initialBoilerplates = useMemo(() => {
    const map = {};
    LANGUAGES.forEach(l => { map[l.id] = l.defaultBoilerplate; });
    return map;
  }, []);
  const [boilerplates, setBoilerplates] = useState(initialBoilerplates);

  const submit = () => {
    if (!title.trim()) { alert('Title required'); return; }
    onAdd({ type: 'coding', title: title.trim(), difficulty: diff, description: desc, marks, testCases, boilerplates, timeLimitMs: timeLimit, duration: '30 Mins' });
    setTitle(''); setDesc(''); setTestCases([{ input: "", expectedOutput: "" }]);
  };

  return (
    <div style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '0.8rem', padding: '1.25rem', marginTop: '1rem' }}>
      <p style={{ fontSize: '0.65rem', fontWeight: 900, color: '#34d399', textTransform: 'uppercase', marginBottom: '0.8rem' }}>💻 New Coding Question</p>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.8rem' }}>
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Question title" style={{ ...iStyle, flex: 2 }} />
        <div style={{ display: 'flex', gap: '0.2rem', background: '#0f172a', padding: '0.2rem', borderRadius: '0.5rem', border: '1px solid #334155' }}>
          {['Easy', 'Medium', 'Hard'].map(d => (
            <button key={d} onClick={() => setDiff(d)} style={{ padding: '0.3rem 0.6rem', borderRadius: '0.3rem', fontSize: '0.65rem', fontWeight: 800, border: 'none', background: diff === d ? (d === 'Easy' ? '#10b981' : d === 'Medium' ? '#f59e0b' : '#ef4444') : 'transparent', color: diff === d ? '#fff' : '#64748b' }}>{d}</button>
          ))}
        </div>
      </div>
      <div style={{ marginBottom: '0.8rem' }}>
        <label style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block', marginBottom: '0.3rem' }}>Description</label>
        <div style={{ background: 'white', borderRadius: '0.5rem', overflow: 'hidden' }}>
          <ReactQuill theme="snow" value={desc} onChange={setDesc} style={{ color: 'black', height: '120px', marginBottom: '40px' }} />
        </div>
      </div>
      <div style={{ width: '120px', marginBottom: '0.8rem' }}><label style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Marks</label><input type="number" value={marks} onChange={e => setMarks(Number(e.target.value))} style={iStyle} /></div>
      <div style={{ background: '#0f172a', padding: '0.8rem', borderRadius: '0.6rem', marginBottom: '0.8rem' }}>
        <p style={{ fontSize: '0.65rem', fontWeight: 800, color: '#60a5fa', marginBottom: '0.5rem' }}>TEST CASES</p>
        {testCases.map((tc, i) => (
          <div key={i} style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.4rem' }}>
            <textarea placeholder="Input" value={tc.input} onChange={e => { const n = [...testCases]; n[i].input = e.target.value; setTestCases(n); }} style={{ ...iStyle, height: '50px' }} />
            <textarea placeholder="Output" value={tc.expectedOutput} onChange={e => { const n = [...testCases]; n[i].expectedOutput = e.target.value; setTestCases(n); }} style={{ ...iStyle, height: '50px' }} />
            <button onClick={() => setTestCases(testCases.filter((_, idx) => idx !== i))} style={{ background: '#ef444422', color: '#ef4444', border: 'none', borderRadius: '0.4rem', padding: '0 0.5rem' }}>✕</button>
          </div>
        ))}
        <button onClick={() => setTestCases([...testCases, { input: "", expectedOutput: "" }])} style={{ background: 'none', border: 'none', color: '#60a5fa', fontSize: '0.7rem', fontWeight: 700 }}>+ Add Test Case</button>
      </div>
      <BoilerplateEditor boilerplates={boilerplates} onChange={setBoilerplates} timeLimitMs={timeLimit} onTimeLimitChange={setTimeLimit} />
      <button onClick={submit} style={{ ...bStyle('#10b981'), width: '100%', marginTop: '1rem', padding: '0.8rem' }}>Save Coding Question</button>
    </div>
  );
}

/* 2. MCQ FORM */
function MCQForm({ onAdd }) {
  const [q, setQ] = useState('');
  const [opts, setOpts] = useState(['', '', '', '']);
  const [correct, setCorrect] = useState(0);
  const submit = () => {
    if (!q.trim() || opts.some(o => !o.trim())) { alert('Fill all fields'); return; }
    onAdd({ type: 'mcq', title: q.trim(), options: opts, correctIndex: correct, duration: '20 Mins' });
    setQ(''); setOpts(['', '', '', '']);
  };
  return (
    <div style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '0.8rem', padding: '1rem', marginTop: '1rem' }}>
      <p style={{ fontSize: '0.65rem', fontWeight: 900, color: '#fbbf24', textTransform: 'uppercase', marginBottom: '0.6rem' }}>🧠 Add MCQ Question</p>
      <textarea value={q} onChange={e => setQ(e.target.value)} placeholder="Question text..." rows={2} style={{ ...iStyle, marginBottom: '0.6rem' }} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem', marginBottom: '0.6rem' }}>
        {opts.map((o, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem', borderRadius: '0.5rem', border: `1px solid ${correct === i ? '#10b981' : '#334155'}` }}>
            <input type="radio" checked={correct === i} onChange={() => setCorrect(i)} />
            <input value={o} onChange={e => { const a = [...opts]; a[i] = e.target.value; setOpts(a); }} placeholder={`Option ${i+1}`} style={{ ...iStyle, padding: '0.2rem' }} />
          </div>
        ))}
      </div>
      <button onClick={submit} style={bStyle('#f59e0b')}>+ Add MCQ</button>
    </div>
  );
}

/* 3. PPT UPLOADER */
function PPTUploader({ langId, topicIdx, onUploaded }) {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [uploading, setUploading] = useState(false);
  const upload = () => {
    if (!file || !title) return;
    setUploading(true);
    const sRef = ref(storage, `learning_ppts/${langId}/topic_${topicIdx}/${Date.now()}_${file.name}`);
    const task = uploadBytesResumable(sRef, file);
    task.on('state_changed', null, null, () => getDownloadURL(task.snapshot.ref).then(url => {
      onUploaded({ type: 'ppt', title: title.trim(), downloadUrl: url, storagePath: task.snapshot.ref.fullPath });
      setFile(null); setTitle(''); setUploading(false);
    }));
  };
  return (
    <div style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: '0.8rem', padding: '1rem', marginTop: '1rem' }}>
      <p style={{ fontSize: '0.65rem', fontWeight: 900, color: '#a78bfa', textTransform: 'uppercase', marginBottom: '0.6rem' }}>📊 Upload PPT / Files</p>
      <input type="file" onChange={e => setFile(e.target.files[0])} style={{ marginBottom: '0.5rem', fontSize: '0.75rem' }} />
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="File Title" style={iStyle} />
        <button onClick={upload} disabled={uploading} style={bStyle('#8b5cf6')}>{uploading ? '...' : 'Upload'}</button>
      </div>
    </div>
  );
}

// ── Main Page Component ───────────────────────────────────────────────────
// Receives `moduleData` prop from FacultyDashboardPage (the already-created module)
// Skips language creation — goes straight to topic management

export default function LearningModules({ moduleData }) {
  const [module, setModule]           = useState(moduleData || null);
  const [loading, setLoading]         = useState(false);
  const [expandedTopic, setExpandedTopic] = useState(null);
  const [activePanel, setActivePanel] = useState({});
  const [newTopicName, setNewTopicName] = useState('');

  // Sync when parent passes a fresh moduleData
  useEffect(() => { if (moduleData) setModule(moduleData); }, [moduleData]);

  const refetch = async () => {
    if (!module) return;
    setLoading(true);
    const snap = await getDocs(query(collection(db, 'learningLanguages'), orderBy('createdAt')));
    // Also check categories collection (module lives in 'categories')
    const { getDoc } = await import('firebase/firestore');
    try {
      const docSnap = await getDoc(doc(db, 'categories', module.id));
      if (docSnap.exists()) setModule({ id: docSnap.id, ...docSnap.data() });
    } catch {}
    setLoading(false);
  };

  // Use 'categories' collection — that's where FacultyDashboardPage stores modules
  const saveTopics = async (updatedTopics) => {
    await updateDoc(doc(db, 'categories', module.id), { topics: updatedTopics });
    setModule(prev => ({ ...prev, topics: updatedTopics }));
  };

  const addTopic = async () => {
    if (!newTopicName.trim() || !module) return;
    const updatedTopics = [...(module.topics || []), { name: newTopicName.trim(), content: [] }];
    await saveTopics(updatedTopics);
    setNewTopicName('');
  };

  const deleteTopic = async (topicIdx) => {
    const updatedTopics = (module.topics || []).filter((_, i) => i !== topicIdx);
    const tKey = `${module.id}-${topicIdx}`;
    if (expandedTopic === tKey) setExpandedTopic(null);
    await saveTopics(updatedTopics);
  };

  const addContentItem = async (topicIdx, item) => {
    const updatedTopics = (module.topics || []).map((t, i) =>
      i === topicIdx
        ? { ...t, content: [...(t.content || []), { ...item, createdAt: new Date().toISOString() }] }
        : t
    );
    await saveTopics(updatedTopics);
  };

  const deleteContent = async (topicIdx, contentIdx) => {
    const item = module.topics[topicIdx].content[contentIdx];
    if (item.type === 'ppt' && item.storagePath) {
      try { await deleteObject(ref(storage, item.storagePath)); } catch {}
    }
    const updatedTopics = (module.topics || []).map((t, i) =>
      i === topicIdx ? { ...t, content: t.content.filter((_, ci) => ci !== contentIdx) } : t
    );
    await saveTopics(updatedTopics);
  };

  if (!module) return <p style={{ color: '#64748b', padding: '2rem' }}>No module selected.</p>;

  const topics = module.topics || [];

  return (
    <div style={{ color: '#f1f5f9' }}>

      {/* ── Add Topic Form ── */}
      <div style={{ background: 'rgba(15,23,42,0.6)', border: '1px solid #1e3a5f', padding: '1.25rem', borderRadius: '1rem', marginBottom: '1.5rem' }}>
        <p style={{ fontSize: '0.65rem', fontWeight: 900, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.8rem' }}>+ Add Topic</p>
        <div style={{ display: 'flex', gap: '0.8rem' }}>
          <input
            value={newTopicName}
            onChange={e => setNewTopicName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addTopic()}
            placeholder="e.g. Loops, Arrays, OOP..."
            style={iStyle}
          />
          <button onClick={addTopic} style={bStyle()}>+ Add Topic</button>
        </div>
      </div>

      {/* ── Topics List ── */}
      {topics.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#475569', background: 'rgba(15,23,42,0.4)', borderRadius: '1rem', border: '1px dashed #334155' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📂</div>
          <p style={{ fontWeight: 700, fontSize: '0.875rem' }}>No topics yet.</p>
          <p style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>Add your first topic above to get started!</p>
        </div>
      ) : (
        topics.map((topic, tIdx) => {
          const tKey       = `${module.id}-${tIdx}`;
          const curPanel   = activePanel[tKey];
          const codingCount = topic.content?.filter(c => c.type === 'coding').length || 0;
          const mcqCount    = topic.content?.filter(c => c.type === 'mcq').length || 0;
          const pptCount    = topic.content?.filter(c => c.type === 'ppt').length || 0;

          return (
            <div key={tIdx} style={{ background: 'rgba(30,41,59,0.5)', border: `1px solid ${expandedTopic === tKey ? '#3b82f6' : '#334155'}`, borderRadius: '0.875rem', marginBottom: '1rem', overflow: 'hidden' }}>

              {/* Topic Header */}
              <div
                onClick={() => setExpandedTopic(expandedTopic === tKey ? null : tKey)}
                style={{ padding: '0.9rem 1rem', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span style={{ fontSize: '1rem' }}>📌</span>
                  <p style={{ fontWeight: 800, fontSize: '0.88rem', margin: 0 }}>{topic.name}</p>
                </div>
                <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                  <span style={{ padding: '0.15rem 0.5rem', background: 'rgba(16,185,129,0.1)', borderRadius: '999px', color: '#10b981', fontSize: '0.65rem' }}>💻 {codingCount}</span>
                  <span style={{ padding: '0.15rem 0.5rem', background: 'rgba(245,158,11,0.1)',  borderRadius: '999px', color: '#f59e0b',  fontSize: '0.65rem' }}>🧠 {mcqCount}</span>
                  <span style={{ padding: '0.15rem 0.5rem', background: 'rgba(139,92,246,0.1)',  borderRadius: '999px', color: '#a78bfa',  fontSize: '0.65rem' }}>📊 {pptCount}</span>
                  <button
                    onClick={e => { e.stopPropagation(); deleteTopic(tIdx); }}
                    style={{ fontSize: '0.65rem', padding: '0.2rem 0.5rem', borderRadius: '0.4rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', cursor: 'pointer' }}
                  >🗑</button>
                  <span style={{ color: '#475569' }}>{expandedTopic === tKey ? '▲' : '▼'}</span>
                </div>
              </div>

              {/* Topic Content */}
              {expandedTopic === tKey && (
                <div style={{ padding: '1rem', borderTop: '1px solid #1e293b' }}>

                  {/* 3 Content Type Buttons */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                    {[
                      { key: 'coding', icon: '💻', label: 'Coding', color: '#10b981' },
                      { key: 'mcq',    icon: '🧠', label: 'MCQs',   color: '#f59e0b' },
                      { key: 'ppt',    icon: '📊', label: 'Files',  color: '#8b5cf6' },
                    ].map(({ key, icon, label, color }) => (
                      <button
                        key={key}
                        onClick={() => setActivePanel(prev => ({ ...prev, [tKey]: prev[tKey] === key ? null : key }))}
                        style={{ padding: '0.85rem', borderRadius: '0.75rem', border: `1px solid ${curPanel === key ? color : '#334155'}`, background: curPanel === key ? `${color}18` : 'transparent', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s' }}
                      >
                        <div style={{ fontSize: '1.4rem' }}>{icon}</div>
                        <div style={{ fontSize: '0.7rem', fontWeight: 800, color: curPanel === key ? color : '#94a3b8', marginTop: '0.25rem' }}>{label}</div>
                      </button>
                    ))}
                  </div>

                  {/* Active Form */}
                  {curPanel === 'coding' && <CodingForm onAdd={item => addContentItem(tIdx, item)} />}
                  {curPanel === 'mcq'    && <MCQForm    onAdd={item => addContentItem(tIdx, item)} />}
                  {curPanel === 'ppt'    && <PPTUploader langId={module.id} topicIdx={tIdx} onUploaded={item => addContentItem(tIdx, item)} />}

                  {/* Added Content List */}
                  {topic.content?.length > 0 && (
                    <div style={{ marginTop: '1rem' }}>
                      <p style={{ fontSize: '0.6rem', fontWeight: 900, color: '#475569', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Added Content</p>
                      {topic.content.map((item, ci) => (
                        <div key={ci} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0.75rem', background: '#0f172a', borderRadius: '0.5rem', marginBottom: '0.4rem', border: '1px solid #1e293b' }}>
                          <span style={{ fontSize: '0.75rem' }}>
                            {item.type === 'coding' ? '💻' : item.type === 'mcq' ? '🧠' : '📊'} {item.title}
                          </span>
                          <DeleteButton itemName={item.title} onConfirm={() => deleteContent(tIdx, ci)} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}