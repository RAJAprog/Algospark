// import React, { useState, useEffect, useCallback, useRef } from "react";
// import {
//   collection, getDocs, addDoc, deleteDoc, doc, query, orderBy, serverTimestamp
// } from "firebase/firestore";
// import { ref as storageRef, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
// import { db, storage } from "../../../firebase/config";

// const FILE_TYPES = {
//   "application/vnd.ms-powerpoint": { label: "PPT", color: "bg-orange-500/10 text-orange-400 border-orange-500/30", icon: "📊" },
//   "application/vnd.openxmlformats-officedocument.presentationml.presentation": { label: "PPTX", color: "bg-orange-500/10 text-orange-400 border-orange-500/30", icon: "📊" },
//   "application/pdf": { label: "PDF", color: "bg-red-500/10 text-red-400 border-red-500/30", icon: "📄" },
//   "application/msword": { label: "DOC", color: "bg-blue-500/10 text-blue-400 border-blue-500/30", icon: "📝" },
//   "application/vnd.openxmlformats-officedocument.wordprocessingml.document": { label: "DOCX", color: "bg-blue-500/10 text-blue-400 border-blue-500/30", icon: "📝" },
//   "application/vnd.ms-excel": { label: "XLS", color: "bg-green-500/10 text-green-400 border-green-500/30", icon: "📊" },
//   "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": { label: "XLSX", color: "bg-green-500/10 text-green-400 border-green-500/30", icon: "📊" },
//   "video/mp4":  { label: "VIDEO", color: "bg-purple-500/10 text-purple-400 border-purple-500/30", icon: "🎬" },
//   "video/webm": { label: "VIDEO", color: "bg-purple-500/10 text-purple-400 border-purple-500/30", icon: "🎬" },
//   "image/png":  { label: "IMAGE", color: "bg-teal-500/10 text-teal-400 border-teal-500/30", icon: "🖼" },
//   "image/jpeg": { label: "IMAGE", color: "bg-teal-500/10 text-teal-400 border-teal-500/30", icon: "🖼" },
//   "image/gif":  { label: "IMAGE", color: "bg-teal-500/10 text-teal-400 border-teal-500/30", icon: "🖼" },
// };

// const getFileMeta = (mimeType) =>
//   FILE_TYPES[mimeType] || { label: "FILE", color: "bg-gray-500/10 text-gray-400 border-gray-500/30", icon: "📎" };

// const formatSize = (bytes) => {
//   if (bytes < 1024) return bytes + " B";
//   if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
//   return (bytes / (1024 * 1024)).toFixed(1) + " MB";
// };

// const FilesPanel = ({ language, topic, currentUser, onBack }) => {
//   const [files, setFiles]           = useState([]);
//   const [isLoading, setIsLoading]   = useState(true);
//   const [uploads, setUploads]       = useState({}); // { tempId: { name, progress, error } }
//   const [isDragging, setIsDragging] = useState(false);
//   const inputRef                    = useRef();

//   const collPath = `categories/${language.id}/topics/${topic.id}/files`;

//   const fetchFiles = useCallback(async () => {
//     setIsLoading(true);
//     try {
//       const snap = await getDocs(query(collection(db, collPath), orderBy("uploadedAt", "desc")));
//       setFiles(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
//     } catch (e) { console.error(e); }
//     setIsLoading(false);
//   }, [collPath]);

//   useEffect(() => { fetchFiles(); }, [fetchFiles]);

//   const uploadFile = async (file) => {
//     const tempId = `${Date.now()}-${file.name}`;
//     setUploads((prev) => ({ ...prev, [tempId]: { name: file.name, progress: 0, error: null } }));

//     try {
//       const path = `lessonFiles/${language.id}/${topic.id}/${Date.now()}_${file.name}`;
//       const sRef = storageRef(storage, path);
//       const task = uploadBytesResumable(sRef, file);

//       task.on(
//         "state_changed",
//         (snapshot) => {
//           const pct = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
//           setUploads((prev) => ({ ...prev, [tempId]: { ...prev[tempId], progress: pct } }));
//         },
//         (error) => {
//           setUploads((prev) => ({ ...prev, [tempId]: { ...prev[tempId], error: error.message } }));
//         },
//         async () => {
//           const url = await getDownloadURL(task.snapshot.ref);
//           await addDoc(collection(db, collPath), {
//             name: file.name,
//             url,
//             storagePath: path,
//             mimeType: file.type,
//             size: file.size,
//             uploadedAt: serverTimestamp(),
//             uploadedBy: currentUser?.uid,
//           });
//           setUploads((prev) => { const n = { ...prev }; delete n[tempId]; return n; });
//           fetchFiles();
//         }
//       );
//     } catch (e) {
//       setUploads((prev) => ({ ...prev, [tempId]: { ...prev[tempId], error: e.message } }));
//     }
//   };

//   const handleFiles = (fileList) => {
//     Array.from(fileList).forEach(uploadFile);
//   };

//   const handleDelete = async (file) => {
//     if (!window.confirm(`Delete "${file.name}"?`)) return;
//     try {
//       // Delete from storage
//       if (file.storagePath) {
//         try { await deleteObject(storageRef(storage, file.storagePath)); } catch {}
//       }
//       await deleteDoc(doc(db, collPath, file.id));
//       fetchFiles();
//     } catch (e) { alert("Delete failed"); }
//   };

//   return (
//     <div className="space-y-5 animate-in fade-in duration-300">
//       {/* Header */}
//       <div className="flex items-center gap-3">
//         <button onClick={onBack} className="text-xs font-bold text-pink-400 border border-pink-500/40 px-3 py-1.5 rounded-lg bg-pink-500/10 hover:bg-pink-500/20 transition-all">
//           ← Back
//         </button>
//         <div>
//           <h2 className="text-xl font-black">📊 PPT / Files</h2>
//           <p className="text-xs text-gray-500">{language?.name} → {topic?.name}</p>
//         </div>
//         <button onClick={() => inputRef.current?.click()} className="ml-auto bg-green-600 hover:bg-green-500 px-5 py-2 rounded-xl text-xs font-black transition-all active:scale-95">
//           + Upload Files
//         </button>
//       </div>

//       {/* Hidden file input */}
//       <input
//         ref={inputRef}
//         type="file"
//         multiple
//         accept=".ppt,.pptx,.pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.gif,.mp4,.webm,*"
//         className="hidden"
//         onChange={(e) => handleFiles(e.target.files)}
//       />

//       {/* Drop Zone */}
//       <div
//         onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
//         onDragLeave={() => setIsDragging(false)}
//         onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFiles(e.dataTransfer.files); }}
//         onClick={() => inputRef.current?.click()}
//         className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${isDragging ? "border-blue-500 bg-blue-500/10" : "border-gray-700 hover:border-gray-500 hover:bg-gray-800/50"}`}
//       >
//         <div className="text-4xl mb-3">📎</div>
//         <div className="text-base font-black text-white mb-1">Click or drag files here</div>
//         <div className="text-xs text-gray-500">PPT · PPTX · PDF · DOC · Excel · Images · Videos · Any file</div>
//         <div className="text-xs text-gray-600 mt-2">Supports multiple files at once</div>
//       </div>

//       {/* Active Uploads */}
//       {Object.entries(uploads).length > 0 && (
//         <div className="space-y-2">
//           {Object.entries(uploads).map(([id, u]) => (
//             <div key={id} className="bg-gray-800 border border-gray-700 rounded-xl p-4">
//               <div className="flex justify-between text-xs mb-2">
//                 <span className="font-bold text-white truncate max-w-[300px]">{u.name}</span>
//                 {u.error ? (
//                   <span className="text-red-400">{u.error}</span>
//                 ) : (
//                   <span className="text-blue-400 font-black">{u.progress}%</span>
//                 )}
//               </div>
//               {!u.error && (
//                 <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
//                   <div
//                     className="h-full bg-blue-500 rounded-full transition-all"
//                     style={{ width: `${u.progress}%` }}
//                   />
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       )}

//       {/* File List */}
//       {isLoading ? (
//         <div className="flex justify-center py-10">
//           <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
//         </div>
//       ) : files.length === 0 && Object.entries(uploads).length === 0 ? (
//         <div className="text-center text-gray-500 py-6 text-sm">No files uploaded yet.</div>
//       ) : (
//         <div className="space-y-3">
//           {files.map((file) => {
//             const meta = getFileMeta(file.mimeType);
//             return (
//               <div key={file.id} className="bg-gray-800 border border-gray-700 rounded-2xl p-4 flex items-center justify-between gap-4 hover:border-gray-600 transition-all">
//                 <div className="flex items-center gap-3">
//                   <span className="text-2xl">{meta.icon}</span>
//                   <div>
//                     <div className="text-sm font-bold text-white">{file.name}</div>
//                     <div className="text-xs text-gray-500 mt-0.5">
//                       {formatSize(file.size || 0)} · {file.uploadedAt?.toDate?.().toLocaleDateString?.() || ""}
//                     </div>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <span className={`text-[10px] font-black px-2 py-0.5 rounded border ${meta.color}`}>
//                     {meta.label}
//                   </span>
//                   <a
//                     href={file.url}
//                     target="_blank"
//                     rel="noreferrer"
//                     className="text-xs bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 px-3 py-1.5 rounded-lg font-bold transition-all"
//                   >
//                     View
//                   </a>
//                   <button
//                     onClick={() => handleDelete(file)}
//                     className="text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1.5 rounded-lg font-bold transition-all"
//                   >
//                     Del
//                   </button>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// };

// export default FilesPanel;
///

import React, { useState, useEffect, useCallback, useRef } from "react";
import { collection, getDocs, addDoc, deleteDoc, doc, query, orderBy, serverTimestamp } from "firebase/firestore";
import { ref as storageRef, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";

// FIXED FIREBASE IMPORT PATH
import { db, storage } from "../../../firebase/config";

const FILE_TYPES = {
  "application/vnd.ms-powerpoint": { label: "PPT", color: "bg-orange-500/10 text-orange-400 border-orange-500/30", icon: "📊" },
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": { label: "PPTX", color: "bg-orange-500/10 text-orange-400 border-orange-500/30", icon: "📊" },
  "application/pdf": { label: "PDF", color: "bg-red-500/10 text-red-400 border-red-500/30", icon: "📄" },
  "application/msword": { label: "DOC", color: "bg-blue-500/10 text-blue-400 border-blue-500/30", icon: "📝" },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": { label: "DOCX", color: "bg-blue-500/10 text-blue-400 border-blue-500/30", icon: "📝" },
  "application/vnd.ms-excel": { label: "XLS", color: "bg-green-500/10 text-green-400 border-green-500/30", icon: "📊" },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": { label: "XLSX", color: "bg-green-500/10 text-green-400 border-green-500/30", icon: "📊" },
  "video/mp4":  { label: "VIDEO", color: "bg-purple-500/10 text-purple-400 border-purple-500/30", icon: "🎬" },
  "video/webm": { label: "VIDEO", color: "bg-purple-500/10 text-purple-400 border-purple-500/30", icon: "🎬" },
  "image/png":  { label: "IMAGE", color: "bg-teal-500/10 text-teal-400 border-teal-500/30", icon: "🖼" },
  "image/jpeg": { label: "IMAGE", color: "bg-teal-500/10 text-teal-400 border-teal-500/30", icon: "🖼" },
  "image/gif":  { label: "IMAGE", color: "bg-teal-500/10 text-teal-400 border-teal-500/30", icon: "🖼" },
};

const getFileMeta = (mimeType) => FILE_TYPES[mimeType] || { label: "FILE", color: "bg-gray-500/10 text-gray-400 border-gray-500/30", icon: "📎" };
const formatSize = (bytes) => {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
};

const FilesPanel = ({ language, topic, currentUser, onBack }) => {
  const [files, setFiles]           = useState([]);
  const [isLoading, setIsLoading]   = useState(true);
  const [uploads, setUploads]       = useState({});
  const [isDragging, setIsDragging] = useState(false);
  const inputRef                    = useRef();

  const collPath = `categories/${language.id}/topics/${topic.id}/files`;

  const fetchFiles = useCallback(async () => {
    setIsLoading(true);
    try {
      const snap = await getDocs(query(collection(db, collPath), orderBy("uploadedAt", "desc")));
      setFiles(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (e) { console.error(e); }
    setIsLoading(false);
  }, [collPath]);

  useEffect(() => { fetchFiles(); }, [fetchFiles]);

  const uploadFile = async (file) => {
    const tempId = `${Date.now()}-${file.name}`;
    setUploads((prev) => ({ ...prev, [tempId]: { name: file.name, progress: 0, error: null } }));
    try {
      const path = `lessonFiles/${language.id}/${topic.id}/${Date.now()}_${file.name}`;
      const sRef = storageRef(storage, path);
      const task = uploadBytesResumable(sRef, file);
      task.on("state_changed",
        (snapshot) => { setUploads((prev) => ({ ...prev, [tempId]: { ...prev[tempId], progress: Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100) } })); },
        (error) => { setUploads((prev) => ({ ...prev, [tempId]: { ...prev[tempId], error: error.message } })); },
        async () => {
          const url = await getDownloadURL(task.snapshot.ref);
          await addDoc(collection(db, collPath), { name: file.name, url, storagePath: path, mimeType: file.type, size: file.size, uploadedAt: serverTimestamp(), uploadedBy: currentUser?.uid });
          setUploads((prev) => { const n = { ...prev }; delete n[tempId]; return n; });
          fetchFiles();
        }
      );
    } catch (e) { setUploads((prev) => ({ ...prev, [tempId]: { ...prev[tempId], error: e.message } })); }
  };

  const handleFiles = (fileList) => { Array.from(fileList).forEach(uploadFile); };
  const handleDelete = async (file) => {
    if (!window.confirm(`Delete "${file.name}"?`)) return;
    try { if (file.storagePath) { try { await deleteObject(storageRef(storage, file.storagePath)); } catch {} }
      await deleteDoc(doc(db, collPath, file.id)); fetchFiles();
    } catch (e) { alert("Delete failed"); }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="text-xs font-bold text-pink-400 border border-pink-500/40 px-3 py-1.5 rounded-lg bg-pink-500/10 hover:bg-pink-500/20 transition-all">← Back</button>
        <div><h2 className="text-xl font-black">📊 PPT / Files</h2><p className="text-xs text-gray-500">{language?.name} → {topic?.name}</p></div>
        <button onClick={() => inputRef.current?.click()} className="ml-auto bg-green-600 hover:bg-green-500 px-5 py-2 rounded-xl text-xs font-black transition-all active:scale-95">+ Upload Files</button>
      </div>
      <input ref={inputRef} type="file" multiple accept=".ppt,.pptx,.pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.gif,.mp4,.webm,*" className="hidden" onChange={(e) => handleFiles(e.target.files)} />
      <div onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }} onDragLeave={() => setIsDragging(false)} onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFiles(e.dataTransfer.files); }} onClick={() => inputRef.current?.click()} className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${isDragging ? "border-blue-500 bg-blue-500/10" : "border-gray-700 hover:border-gray-500 hover:bg-gray-800/50"}`}>
        <div className="text-4xl mb-3">📎</div><div className="text-base font-black text-white mb-1">Click or drag files here</div>
        <div className="text-xs text-gray-500">PPT · PPTX · PDF · DOC · Excel · Images · Videos · Any file</div><div className="text-xs text-gray-600 mt-2">Supports multiple files at once</div>
      </div>
      {Object.entries(uploads).length > 0 && (
        <div className="space-y-2">{Object.entries(uploads).map(([id, u]) => (
          <div key={id} className="bg-gray-800 border border-gray-700 rounded-xl p-4">
            <div className="flex justify-between text-xs mb-2"><span className="font-bold text-white truncate max-w-[300px]">{u.name}</span>{u.error ? <span className="text-red-400">{u.error}</span> : <span className="text-blue-400 font-black">{u.progress}%</span>}</div>
            {!u.error && <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden"><div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${u.progress}%` }} /></div>}
          </div>
        ))}</div>
      )}
      {isLoading ? <div className="flex justify-center py-10"><div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" /></div> : files.length === 0 && Object.entries(uploads).length === 0 ? <div className="text-center text-gray-500 py-6 text-sm">No files uploaded yet.</div> : (
        <div className="space-y-3">
          {files.map((file) => {
            const meta = getFileMeta(file.mimeType);
            return (
              <div key={file.id} className="bg-gray-800 border border-gray-700 rounded-2xl p-4 flex items-center justify-between gap-4 hover:border-gray-600 transition-all">
                <div className="flex items-center gap-3"><span className="text-2xl">{meta.icon}</span><div><div className="text-sm font-bold text-white">{file.name}</div><div className="text-xs text-gray-500 mt-0.5">{formatSize(file.size || 0)} · {file.uploadedAt?.toDate?.().toLocaleDateString?.() || ""}</div></div></div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded border ${meta.color}`}>{meta.label}</span>
                  <a href={file.url} target="_blank" rel="noreferrer" className="text-xs bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 px-3 py-1.5 rounded-lg font-bold transition-all">View</a>
                  <button onClick={() => handleDelete(file)} className="text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1.5 rounded-lg font-bold transition-all">Del</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
export default FilesPanel;