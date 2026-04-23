
// import React, { useState, useEffect } from "react";
// import { useHistory } from "react-router-dom";
// import * as XLSX from 'xlsx';
// import {
//   collection, getDocs, addDoc, updateDoc, doc, setDoc, deleteDoc,
//   serverTimestamp, arrayUnion, arrayRemove, query, where
// } from "firebase/firestore";
// import { createUserWithEmailAndPassword } from "firebase/auth";
// import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
// import { db, auth, storage } from "../../firebase/config";

// const TenantManager = () => {
//   const history = useHistory();
//   const [tenants, setTenants] = useState([]);
//   const [selectedTenant, setSelectedTenant] = useState(null);
//   const [newCollegeName, setNewCollegeName] = useState("");
//   const [newStudentId, setNewStudentId] = useState("");
//   const [newStudentName, setNewStudentName] = useState("");
//   const [isCreating, setIsCreating] = useState(false);
//   const [isAddingStudent, setIsAddingStudent] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [uploadingLogoId, setUploadingLogoId] = useState(null);
//   const [isUploadingExcel, setIsUploadingExcel] = useState(false);

//   // ─── FETCH ALL COLLEGES ───────────────────────────────────────────────────
//   const fetchTenants = async () => {
//     setLoading(true);
//     try {
//       const snap = await getDocs(collection(db, "colleges"));
//       const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
//       setTenants(list);
//       if (selectedTenant) {
//         const updated = list.find((t) => t.id === selectedTenant.id);
//         setSelectedTenant(updated || null);
//       }
//     } catch (err) {
//       console.error("Error fetching colleges:", err);
//     }
//     setLoading(false);
//   };

//   useEffect(() => { fetchTenants(); }, []);

//   // ─── PASSWORD GENERATOR ───────────────────────────────────────────────────
//   const generateDefaultPassword = (name) => {
//     if (!name) return "Mindcode@123";
//     return `${name.trim().toUpperCase().replace(/\s+/g, "")}@123`;
//   };

//   // ─── CREATE COLLEGE ───────────────────────────────────────────────────────
//   const handleCreateTenant = async () => {
//     if (!newCollegeName.trim()) return;
//     setIsCreating(true);
//     try {
//       const autoPass = generateDefaultPassword(newCollegeName);
//       await addDoc(collection(db, "colleges"), {
//         name: newCollegeName.trim(),
//         defaultPassword: autoPass,
//         studentIds: [],
//         students: [],           // NEW: array of { id, name } objects
//         createdAt: serverTimestamp(),
//         logoUrl: null,
//         logoPath: null,
//       });
//       setNewCollegeName("");
//       await fetchTenants();
//     } catch (err) {
//       alert("Failed to create college.");
//     }
//     setIsCreating(false);
//   };

//   // ─── DELETE COLLEGE + ALL STUDENTS ───────────────────────────────────────
//   const handleDeleteTenant = async (tenant) => {
//     if (!window.confirm(`Are you sure you want to completely delete "${tenant.name}" and ALL its students? This cannot be undone.`)) return;
//     try {
//       if (tenant.logoPath) {
//         const fileRef = ref(storage, tenant.logoPath);
//         await deleteObject(fileRef).catch(e => console.warn("Logo missing in storage", e));
//       }
//       const q = query(collection(db, "users"), where("collegeId", "==", tenant.name));
//       const querySnapshot = await getDocs(q);
//       const deletePromises = [];
//       querySnapshot.forEach((document) => {
//         deletePromises.push(deleteDoc(doc(db, "users", document.id)));
//       });
//       await Promise.all(deletePromises);
//       await deleteDoc(doc(db, "colleges", tenant.id));
//       if (selectedTenant?.id === tenant.id) setSelectedTenant(null);
//       await fetchTenants();
//     } catch (error) {
//       console.error("Deletion failed", error);
//       alert("Failed to delete college.");
//     }
//   };

//   // ─── ADD SINGLE STUDENT ───────────────────────────────────────────────────
//   const handleAddStudent = async () => {
//     if (!newStudentId.trim() || !selectedTenant) {
//       alert("Please enter a Student ID and select a college.");
//       return;
//     }
//     const regNo = newStudentId.trim().toUpperCase();
//     const studentName = newStudentName.trim() || "";

//     if (selectedTenant.studentIds?.includes(regNo)) {
//       alert("Student ID already exists in this college.");
//       return;
//     }
//     setIsAddingStudent(true);
//     try {
//       const internalEmail = `${regNo.toLowerCase()}@mindcode.com`;
//       const autoPassword = generateDefaultPassword(selectedTenant.name);

//       // Check if user already exists in Firestore
//       const existingUserQuery = query(collection(db, "users"), where("regNo", "==", regNo));
//       const existingUserSnap = await getDocs(existingUserQuery);

//       if (!existingUserSnap.empty) {
//         // User exists in Firestore — update name if provided and add to college studentIds
//         if (studentName) {
//           existingUserSnap.forEach(async (d) => {
//             await updateDoc(doc(db, "users", d.id), { name: studentName });
//           });
//         }
//         await updateDoc(doc(db, "colleges", selectedTenant.id), {
//           studentIds: arrayUnion(regNo),
//           students: arrayUnion({ id: regNo, name: studentName }),
//         });
//       } else {
//         // Try to create new auth user
//         try {
//           const userCredential = await createUserWithEmailAndPassword(auth, internalEmail, autoPassword);
//           await setDoc(doc(db, "users", userCredential.user.uid), {
//             regNo,
//             name: studentName,
//             email: internalEmail,
//             collegeId: selectedTenant.name,
//             role: 'student',
//             userType: 'college',
//             createdAt: serverTimestamp()
//           });
//         } catch (authErr) {
//           if (authErr.code === 'auth/email-already-in-use') {
//             console.warn(`Auth user exists for ${regNo}, adding to college list`);
//           } else {
//             throw authErr;
//           }
//         }
//         await updateDoc(doc(db, "colleges", selectedTenant.id), {
//           studentIds: arrayUnion(regNo),
//           students: arrayUnion({ id: regNo, name: studentName }),
//         });
//       }

//       setNewStudentId("");
//       setNewStudentName("");
//       await fetchTenants();
//       alert(`✅ Student ${regNo}${studentName ? ` (${studentName})` : ""} registered!\nPassword: ${autoPassword}`);
//     } catch (err) {
//       console.error(err);
//       alert("Registration failed: " + err.message);
//     }
//     setIsAddingStudent(false);
//   };

//   // ─── BULK EXCEL UPLOAD ────────────────────────────────────────────────────
//   const handleBulkUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file || !selectedTenant) {
//       alert("Please select a college first.");
//       return;
//     }
//     setIsUploadingExcel(true);
//     try {
//       const data = await file.arrayBuffer();
//       const workbook = XLSX.read(data);
//       const worksheet = workbook.Sheets[workbook.SheetNames[0]];
//       const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

//       console.log("Excel columns found:", jsonData.length > 0 ? Object.keys(jsonData[0]) : "No rows");
//       console.log("First row sample:", jsonData[0]);

//       // ── Flexible column detection for ID ──
//       const getStudentId = (row) =>
//         row['Student ID'] ||
//         row['StudentID'] ||
//         row['student_id'] ||
//         row['STUDENT ID'] ||
//         row['Student Id'] ||
//         row['studentId'] ||
//         row['Reg No'] ||
//         row['RegNo'] ||
//         row['reg_no'] ||
//         row['REG NO'] ||
//         row['Registration No'] ||
//         row['registration_no'] ||
//         Object.values(row)[0];

//       // ── Flexible column detection for Name ──
//       const getStudentName = (row) =>
//         row['Student Name'] ||
//         row['StudentName'] ||
//         row['student_name'] ||
//         row['STUDENT NAME'] ||
//         row['Name'] ||
//         row['name'] ||
//         row['Full Name'] ||
//         row['full_name'] ||
//         row['FULL NAME'] ||
//         "";

//       const studentEntries = jsonData
//         .map(row => ({
//           id: getStudentId(row),
//           name: String(getStudentName(row) || "").trim(),
//         }))
//         .filter(entry => entry.id)
//         .map(entry => ({
//           id: String(entry.id).trim().toUpperCase(),
//           name: entry.name,
//         }))
//         .filter(entry => entry.id.length > 0);

//       if (studentEntries.length === 0) {
//         alert("No valid Student IDs found.\n\nMake sure your Excel has a column named:\n• Student ID\n• StudentID\n• Reg No\n• RegNo\n\nAnd optionally:\n• Student Name\n• Name\n\nOr place IDs in the first column.");
//         setIsUploadingExcel(false);
//         return;
//       }

//       const autoPassword = generateDefaultPassword(selectedTenant.name);
//       let successCount = 0;
//       let alreadyExistsCount = 0;
//       let failCount = 0;

//       for (const { id: regNo, name: studentName } of studentEntries) {
//         // Skip if already in this college's list
//         if (selectedTenant.studentIds?.includes(regNo)) {
//           alreadyExistsCount++;
//           // Update name if provided and not already set
//           if (studentName) {
//             const existingStudents = selectedTenant.students || [];
//             const existing = existingStudents.find(s => s.id === regNo);
//             if (existing && !existing.name) {
//               const updatedStudents = existingStudents.map(s =>
//                 s.id === regNo ? { ...s, name: studentName } : s
//               );
//               await updateDoc(doc(db, "colleges", selectedTenant.id), { students: updatedStudents });
//             }
//           }
//           continue;
//         }

//         try {
//           const internalEmail = `${regNo.toLowerCase()}@mindcode.com`;

//           // Check Firestore first
//           const existingQ = query(collection(db, "users"), where("regNo", "==", regNo));
//           const existingSnap = await getDocs(existingQ);

//           if (existingSnap.empty) {
//             try {
//               const userCredential = await createUserWithEmailAndPassword(auth, internalEmail, autoPassword);
//               await setDoc(doc(db, "users", userCredential.user.uid), {
//                 regNo,
//                 name: studentName,
//                 email: internalEmail,
//                 collegeId: selectedTenant.name,
//                 role: 'student',
//                 userType: 'college',
//                 createdAt: serverTimestamp()
//               });
//             } catch (authErr) {
//               if (authErr.code === 'auth/email-already-in-use') {
//                 console.warn(`Auth exists for ${regNo} but no Firestore doc`);
//               } else {
//                 throw authErr;
//               }
//             }
//           } else if (studentName) {
//             existingSnap.forEach(async (d) => {
//               await updateDoc(doc(db, "users", d.id), { name: studentName });
//             });
//           }

//           // Always add to college studentIds and students
//           await updateDoc(doc(db, "colleges", selectedTenant.id), {
//             studentIds: arrayUnion(regNo),
//             students: arrayUnion({ id: regNo, name: studentName }),
//           });
//           successCount++;

//         } catch (error) {
//           console.error(`Failed to register ${regNo}:`, error);
//           failCount++;
//         }
//       }

//       await fetchTenants();
//       alert(
//         `✅ Bulk Upload Complete!\n\n` +
//         `Registered: ${successCount}\n` +
//         `Already in college: ${alreadyExistsCount}\n` +
//         `Failed: ${failCount}\n\n` +
//         `Password: ${autoPassword}`
//       );
//     } catch (error) {
//       console.error("Bulk upload error:", error);
//       alert("Failed to process Excel file: " + error.message);
//     } finally {
//       setIsUploadingExcel(false);
//       e.target.value = null;
//     }
//   };

//   // ─── DELETE ALL STUDENTS ──────────────────────────────────────────────────
//   const handleDeleteAllStudents = async () => {
//     if (!selectedTenant || !selectedTenant.studentIds?.length) {
//       alert("No students to delete.");
//       return;
//     }
//     if (!window.confirm(`Delete ALL ${selectedTenant.studentIds.length} students from "${selectedTenant.name}"? This cannot be undone!`)) return;
//     try {
//       const q = query(collection(db, "users"), where("collegeId", "==", selectedTenant.name));
//       const querySnapshot = await getDocs(q);
//       const deletePromises = [];
//       querySnapshot.forEach((document) => {
//         deletePromises.push(deleteDoc(doc(db, "users", document.id)));
//       });
//       await Promise.all(deletePromises);
//       await updateDoc(doc(db, "colleges", selectedTenant.id), { studentIds: [], students: [] });
//       await fetchTenants();
//       alert("All students deleted successfully.");
//     } catch (error) {
//       console.error("Failed to delete all students:", error);
//       alert("Failed to delete students.");
//     }
//   };

//   // ─── REMOVE SINGLE STUDENT ────────────────────────────────────────────────
//   const handleRemoveStudent = async (studentId) => {
//     if (!selectedTenant) return;
//     if (!window.confirm(`Delete student ${studentId} from the database?`)) return;
//     try {
//       // Remove from studentIds (legacy)
//       await updateDoc(doc(db, "colleges", selectedTenant.id), { studentIds: arrayRemove(studentId) });

//       // Remove from students array — filter and rewrite since arrayRemove needs exact object match
//       const updatedStudents = (selectedTenant.students || []).filter(s => s.id !== studentId);
//       await updateDoc(doc(db, "colleges", selectedTenant.id), { students: updatedStudents });

//       const q = query(
//         collection(db, "users"),
//         where("regNo", "==", studentId),
//         where("collegeId", "==", selectedTenant.name)
//       );
//       const snap = await getDocs(q);
//       snap.forEach(async (d) => await deleteDoc(doc(db, "users", d.id)));
//       await fetchTenants();
//     } catch (err) {
//       console.error("Failed to remove student:", err);
//       alert("Failed to remove student.");
//     }
//   };

//   // ─── UPLOAD LOGO ──────────────────────────────────────────────────────────
//   const handleUploadLogo = async (e, tenant) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     setUploadingLogoId(tenant.id);
//     try {
//       const fileRef = ref(storage, `collegeLogos/${tenant.id}_${Date.now()}_${file.name}`);
//       await uploadBytes(fileRef, file);
//       const url = await getDownloadURL(fileRef);
//       await updateDoc(doc(db, "colleges", tenant.id), { logoUrl: url, logoPath: fileRef.fullPath });
//       await fetchTenants();
//     } catch (error) {
//       console.error("Logo upload failed", error);
//       alert("Failed to upload logo.");
//     } finally {
//       setUploadingLogoId(null);
//       e.target.value = null;
//     }
//   };

//   // ─── DELETE LOGO ──────────────────────────────────────────────────────────
//   const handleDeleteLogo = async (tenant) => {
//     if (!window.confirm(`Remove the logo for "${tenant.name}"?`)) return;
//     try {
//       if (tenant.logoPath) {
//         const fileRef = ref(storage, tenant.logoPath);
//         await deleteObject(fileRef).catch(e => console.warn("File missing in storage", e));
//       }
//       await updateDoc(doc(db, "colleges", tenant.id), { logoUrl: null, logoPath: null });
//       await fetchTenants();
//     } catch (error) {
//       console.error("Logo delete failed", error);
//       alert("Failed to delete logo.");
//     }
//   };

//   // ─── HELPER: get student name from students array ─────────────────────────
//   const getStudentName = (sid) => {
//     const students = selectedTenant?.students || [];
//     const found = students.find(s => s.id === sid);
//     return found?.name || "";
//   };

//   // ─── RENDER ───────────────────────────────────────────────────────────────
//   return (
//     <div className="fixed inset-0 bg-gray-900 text-white flex flex-col overflow-hidden">

//       {/* ── HEADER ── */}
//       <header className="flex-shrink-0 flex items-center gap-6 px-8 py-4 bg-gray-950 border-b border-gray-800 shadow-xl z-10">
//         <button
//           onClick={() => history.push("/faculty-dashboard")}
//           className="font-bold text-pink-400 border-2 border-pink-500 px-6 py-2.5 rounded-xl bg-gray-900 hover:bg-pink-500 hover:text-white transition-all duration-200 text-sm tracking-wide shadow-[0_0_15px_rgba(236,72,153,0.15)]"
//         >
//           ← Back
//         </button>
//         <div>
//           <h2 className="text-xl font-black tracking-tight">🏢 Tenant Management</h2>
//           <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mt-0.5">Admin Control Center</p>
//         </div>
//       </header>

//       {/* ── ADD COLLEGE BAR ── */}
//       <section className="flex-shrink-0 px-8 py-5 bg-gray-800/50 border-b border-gray-700">
//         <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Add New College / Tenant</p>
//         <div className="flex gap-4">
//           <input
//             value={newCollegeName}
//             onChange={(e) => setNewCollegeName(e.target.value)}
//             placeholder="Enter college name (e.g. VVIT, SRM, VFSTR)"
//             onKeyDown={(e) => e.key === "Enter" && handleCreateTenant()}
//             className="flex-1 bg-gray-950 border border-gray-700 rounded-xl px-5 py-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
//           />
//           <button
//             onClick={handleCreateTenant}
//             disabled={isCreating}
//             className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-sm transition-all disabled:opacity-50 whitespace-nowrap shadow-lg shadow-blue-900/30"
//           >
//             {isCreating ? "Creating..." : "+ Create College"}
//           </button>
//         </div>
//       </section>

//       {/* ── MAIN SPLIT VIEW ── */}
//       <main className="flex-1 flex overflow-hidden">

//         {/* ── LEFT: COLLEGES LIST ── */}
//         <aside className="w-1/2 border-r border-gray-800 flex flex-col bg-gray-900/50">
//           <div className="flex-shrink-0 px-6 py-4 border-b border-gray-800 flex justify-between items-center">
//             <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Active Colleges</h3>
//             <span className="bg-gray-800 border border-gray-700 px-3 py-1 rounded-lg text-xs font-mono text-gray-300">
//               {tenants.length} Total
//             </span>
//           </div>

//           <div className="flex-1 overflow-y-auto p-6 space-y-4">
//             {loading ? (
//               <div className="text-center py-20 text-gray-600 animate-pulse text-sm">Loading database...</div>
//             ) : tenants.length === 0 ? (
//               <div className="text-center py-20 text-gray-600 text-sm">No colleges added yet.</div>
//             ) : (
//               tenants.map((t) => (
//                 <div
//                   key={t.id}
//                   onClick={() => setSelectedTenant(t)}
//                   className={`group p-5 rounded-2xl border-2 transition-all cursor-pointer ${
//                     selectedTenant?.id === t.id
//                       ? 'border-blue-500 bg-blue-600/10 shadow-[0_0_20px_rgba(59,130,246,0.1)]'
//                       : 'border-gray-800 bg-gray-800/40 hover:border-gray-600'
//                   }`}
//                 >
//                   <div className="flex items-start gap-4 mb-4">
//                     {t.logoUrl ? (
//                       <img src={t.logoUrl} alt="logo" className="w-12 h-12 rounded-lg object-contain bg-white p-1 flex-shrink-0" />
//                     ) : (
//                       <div className="w-12 h-12 rounded-lg bg-gray-700 flex items-center justify-center text-xs text-gray-500 font-bold flex-shrink-0">
//                         N/A
//                       </div>
//                     )}
//                     <div className="flex-1 min-w-0">
//                       <h4 className="font-bold text-base group-hover:text-blue-400 transition-colors truncate">{t.name}</h4>
//                       <p className="text-xs text-gray-500 font-mono mt-1">
//                         PWD: <span className="text-yellow-400">{t.defaultPassword}</span>
//                       </p>
//                     </div>
//                     <div className="text-right flex-shrink-0">
//                       <div className="text-blue-400 font-black text-2xl leading-none">{t.studentIds?.length || 0}</div>
//                       <div className="text-[10px] text-gray-500 uppercase font-bold">Students</div>
//                     </div>
//                   </div>

//                   <div className="flex flex-col gap-2" onClick={(e) => e.stopPropagation()}>
//                     {t.logoUrl ? (
//                       <button
//                         onClick={() => handleDeleteLogo(t)}
//                         className="w-full py-2.5 text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500 hover:text-white transition-all"
//                       >
//                         🗑 Remove Logo
//                       </button>
//                     ) : (
//                       <>
//                         <input
//                           type="file"
//                           accept="image/png,image/jpeg,image/jpg"
//                           id={`logo-${t.id}`}
//                           className="hidden"
//                           onChange={(e) => handleUploadLogo(e, t)}
//                         />
//                         <label
//                           htmlFor={`logo-${t.id}`}
//                           className="w-full py-2.5 text-xs font-bold text-center bg-gray-700 hover:bg-gray-600 text-white rounded-lg cursor-pointer transition-all block"
//                         >
//                           {uploadingLogoId === t.id ? "Uploading..." : "📷 Upload Logo"}
//                         </label>
//                       </>
//                     )}

//                     <button
//                       onClick={() => handleDeleteTenant(t)}
//                       className="w-full py-2.5 text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500 hover:text-white transition-all"
//                     >
//                       🗑 Delete College
//                     </button>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
//         </aside>

//         {/* ── RIGHT: STUDENT MANAGEMENT ── */}
//         <section className="w-1/2 flex flex-col bg-gray-950/30">
//           {!selectedTenant ? (
//             <div className="flex-1 flex items-center justify-center flex-col gap-3 text-gray-600">
//               <span className="text-5xl">👈</span>
//               <p className="font-bold uppercase tracking-widest text-sm">Select a college to manage students</p>
//             </div>
//           ) : (
//             <>
//               <div className="flex-shrink-0 px-6 py-4 border-b border-gray-800 bg-gray-900/40">
//                 <h3 className="text-lg font-black text-blue-400">{selectedTenant.name}</h3>
//                 <p className="text-xs text-gray-500 mt-0.5 font-mono">ID: {selectedTenant.id}</p>
//               </div>

//               <div className="flex-1 overflow-y-auto p-6 space-y-6">

//                 <div className="bg-yellow-900/10 border border-yellow-500/30 rounded-xl p-4">
//                   <p className="text-xs text-yellow-500 font-bold uppercase tracking-wider mb-1">Auto-Generated Password</p>
//                   <p className="text-xl font-mono font-black text-yellow-400">{generateDefaultPassword(selectedTenant.name)}</p>
//                   <p className="text-xs text-yellow-700 mt-1">Format: REGNO@mindcode.com</p>
//                 </div>

//                 {/* ── Individual Registration ── */}
//                 <div className="space-y-3">
//                   <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Individual Registration</h4>
//                   <input
//                     value={newStudentId}
//                     onChange={(e) => setNewStudentId(e.target.value)}
//                     placeholder="Enter Student Reg. No. *"
//                     onKeyDown={(e) => e.key === "Enter" && handleAddStudent()}
//                     className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none transition-all"
//                   />
//                   <input
//                     value={newStudentName}
//                     onChange={(e) => setNewStudentName(e.target.value)}
//                     placeholder="Enter Student Name (optional)"
//                     onKeyDown={(e) => e.key === "Enter" && handleAddStudent()}
//                     className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none transition-all"
//                   />
//                   <button
//                     onClick={handleAddStudent}
//                     disabled={isAddingStudent}
//                     className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-sm transition-all disabled:opacity-50"
//                   >
//                     {isAddingStudent ? "Registering..." : "+ Register Student"}
//                   </button>
//                 </div>

//                 {/* ── Bulk Actions ── */}
//                 <div className="space-y-3">
//                   <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Bulk Actions</h4>
//                   <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-3 space-y-1">
//                     <p className="text-xs text-gray-400 font-semibold mb-2">Excel Column Names:</p>
//                     <p className="text-xs text-gray-500">
//                       ID column: <span className="text-green-400 font-mono">"Student ID"</span> / <span className="text-green-400 font-mono">"Reg No"</span> — or first column
//                     </p>
//                     <p className="text-xs text-gray-500">
//                       Name column: <span className="text-blue-400 font-mono">"Student Name"</span> / <span className="text-blue-400 font-mono">"Name"</span> (optional)
//                     </p>
//                   </div>

//                   <input
//                     type="file"
//                     accept=".xlsx,.xls"
//                     id="excel-upload"
//                     className="hidden"
//                     onChange={handleBulkUpload}
//                   />
//                   <label
//                     htmlFor="excel-upload"
//                     className="w-full flex items-center justify-center gap-2 py-3 bg-green-600/10 border border-green-500/30 text-green-400 rounded-xl font-bold text-sm cursor-pointer hover:bg-green-600 hover:text-white transition-all"
//                   >
//                     <span>📊</span>
//                     <span>{isUploadingExcel ? "Processing..." : "Upload Excel File"}</span>
//                   </label>

//                   <button
//                     onClick={handleDeleteAllStudents}
//                     className="w-full flex items-center justify-center gap-2 py-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl font-bold text-sm hover:bg-red-500 hover:text-white transition-all"
//                   >
//                     <span>🗑</span>
//                     <span>Delete All Students ({selectedTenant.studentIds?.length || 0})</span>
//                   </button>
//                 </div>

//                 {/* ── Student Registry ── */}
//                 <div className="space-y-3">
//                   <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex justify-between">
//                     <span>Student Registry</span>
//                     <span>{selectedTenant.studentIds?.length || 0} Entries</span>
//                   </h4>

//                   {!selectedTenant.studentIds?.length ? (
//                     <div className="text-center py-8 text-gray-600 text-sm bg-gray-900/50 rounded-xl border border-gray-800">
//                       No students registered yet.
//                     </div>
//                   ) : (
//                     <div className="bg-gray-900/50 rounded-2xl border border-gray-800 divide-y divide-gray-800 overflow-hidden">
//                       {/* Header row */}
//                       <div className="flex items-center px-5 py-2.5 bg-gray-800/70 gap-4">
//                         <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest w-36 flex-shrink-0">Reg. No.</span>
//                         <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex-1">Name</span>
//                         <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex-shrink-0 w-16 text-right">Action</span>
//                       </div>

//                       {selectedTenant.studentIds.map((sid) => {
//                         const name = getStudentName(sid);
//                         return (
//                           <div
//                             key={sid}
//                             className="flex items-center px-5 py-3.5 hover:bg-gray-800/50 transition-colors gap-4"
//                           >
//                             <span className="font-mono text-sm tracking-widest text-gray-300 w-36 flex-shrink-0 truncate">{sid}</span>
//                             <span className="text-sm text-gray-400 flex-1 min-w-0 truncate">
//                               {name ? name : <span className="text-gray-600 italic text-xs">No name</span>}
//                             </span>
//                             <button
//                               onClick={() => handleRemoveStudent(sid)}
//                               className="flex-shrink-0 text-xs font-bold text-red-400 border border-red-500/30 bg-red-500/10 px-3 py-1.5 rounded-lg hover:bg-red-500 hover:text-white transition-all"
//                             >
//                               Remove
//                             </button>
//                           </div>
//                         );
//                       })}
//                     </div>
//                   )}
//                 </div>

//               </div>
//             </>
//           )}
//         </section>
//       </main>
//     </div>
//   );
// };

// export default TenantManager; 








import React, { useState, useEffect, useCallback } from "react";
import * as XLSX from "xlsx";
import {
  collection, getDocs, addDoc, updateDoc, doc, setDoc, deleteDoc,
  serverTimestamp, arrayRemove, query, where, getDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { db, storage } from "../../firebase/config";

// ─────────────────────────────────────────────────────────────────────────────
// BUG FIX #1 (CRITICAL): Using createUserWithEmailAndPassword on the MAIN auth
// instance automatically signs OUT the faculty and signs IN the new student.
// Fix: Use a SECONDARY Firebase app so student accounts are created without
// touching the faculty session at all.
// ─────────────────────────────────────────────────────────────────────────────
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const getSecondaryAuth = () => {
  const NAME = "SecondaryApp";
  const existing = getApps().find((a) => a.name === NAME);
  const app = existing || initializeApp(getApp().options, NAME);
  return getAuth(app);
};

// ─────────────────────────────────────────────────────────────────────────────
// BUG FIX #2: TenantManager is now a self-contained PAGE (not a Modal).
// Pass `onBack` prop from FacultyDashboardPage instead of using history.push.
//
// In FacultyDashboardPage.jsx, REMOVE the <Modal> wrapper and instead render:
//   {view === "tenant_manager" && <TenantManager onBack={() => setView("dashboard")} />}
// And change the "Manage Tenants" button to: onClick={() => setView("tenant_manager")}
// ─────────────────────────────────────────────────────────────────────────────

const TenantManager = ({ onBack }) => {
  const [tenants, setTenants]                   = useState([]);
  const [selectedTenant, setSelectedTenant]     = useState(null);
  const [newCollegeName, setNewCollegeName]     = useState("");
  const [newStudentId, setNewStudentId]         = useState("");
  const [newStudentName, setNewStudentName]     = useState("");
  const [isCreating, setIsCreating]             = useState(false);
  const [isAddingStudent, setIsAddingStudent]   = useState(false);
  const [loading, setLoading]                   = useState(true);
  const [uploadingLogoId, setUploadingLogoId]   = useState(null);
  const [isUploadingExcel, setIsUploadingExcel] = useState(false);
  const [bulkProgress, setBulkProgress]         = useState(null);
  const [searchQuery, setSearchQuery]           = useState("");

  // ── FETCH COLLEGES ───────────────────────────────────────────────────────
  const fetchTenants = useCallback(async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, "colleges"));
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setTenants(list);
      setSelectedTenant((prev) => prev ? (list.find((t) => t.id === prev.id) || null) : null);
    } catch (err) {
      console.error("fetchTenants error:", err);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchTenants(); }, [fetchTenants]);

  // ── PASSWORD ─────────────────────────────────────────────────────────────
  const makePassword = (name) =>
    name ? `${name.trim().toUpperCase().replace(/\s+/g, "")}@123` : "Mindcode@123";

  // ── REGISTER STUDENT ACCOUNT (secondary auth — faculty session safe) ─────
  const registerStudentAccount = async (regNo, studentName, collegeName, password) => {
    const email = `${regNo.toLowerCase()}@mindcode.com`;
    // Check Firestore first
    const snap = await getDocs(query(collection(db, "users"), where("regNo", "==", regNo)));
    if (!snap.empty) {
      if (studentName) {
        for (const d of snap.docs) await updateDoc(doc(db, "users", d.id), { name: studentName });
      }
      return; // Already exists
    }
    try {
      const secAuth = getSecondaryAuth();
      const cred    = await createUserWithEmailAndPassword(secAuth, email, password);
      await secAuth.signOut(); // immediately sign out from secondary
      await setDoc(doc(db, "users", cred.user.uid), {
        regNo, name: studentName, email,
        collegeId: collegeName, role: "student", userType: "college",
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      if (err.code !== "auth/email-already-in-use") throw err;
    }
  };

  // ── CREATE COLLEGE ───────────────────────────────────────────────────────
  const handleCreateTenant = async () => {
    if (!newCollegeName.trim()) return;
    setIsCreating(true);
    try {
      await addDoc(collection(db, "colleges"), {
        name: newCollegeName.trim(), defaultPassword: makePassword(newCollegeName),
        studentIds: [], students: [], createdAt: serverTimestamp(), logoUrl: null, logoPath: null,
      });
      setNewCollegeName("");
      await fetchTenants();
    } catch (err) { alert("Failed to create college: " + err.message); }
    setIsCreating(false);
  };

  // ── DELETE COLLEGE ───────────────────────────────────────────────────────
  const handleDeleteTenant = async (tenant) => {
    if (!window.confirm(`Delete "${tenant.name}" and ALL its students? Cannot be undone.`)) return;
    try {
      if (tenant.logoPath) await deleteObject(ref(storage, tenant.logoPath)).catch(() => {});
      const snap = await getDocs(query(collection(db, "users"), where("collegeId", "==", tenant.name)));
      await Promise.all(snap.docs.map((d) => deleteDoc(doc(db, "users", d.id))));
      await deleteDoc(doc(db, "colleges", tenant.id));
      if (selectedTenant?.id === tenant.id) setSelectedTenant(null);
      await fetchTenants();
    } catch (err) { alert("Failed: " + err.message); }
  };

  // ── ADD SINGLE STUDENT ───────────────────────────────────────────────────
  const handleAddStudent = async () => {
    if (!newStudentId.trim() || !selectedTenant) { alert("Enter a Student ID and select a college."); return; }
    const regNo    = newStudentId.trim().toUpperCase();
    const name     = newStudentName.trim();
    const password = makePassword(selectedTenant.name);
    const existing = (selectedTenant.students || []);
    const found    = existing.find((s) => s.id === regNo);

    if (found) {
      if (name && !found.name) {
        await updateDoc(doc(db, "colleges", selectedTenant.id), {
          students: existing.map((s) => s.id === regNo ? { ...s, name } : s),
        });
        await fetchTenants();
        alert(`Student ${regNo} already existed — name updated to "${name}".`);
      } else {
        alert(`Student ${regNo} already exists in this college.`);
      }
      return;
    }
    setIsAddingStudent(true);
    try {
      await registerStudentAccount(regNo, name, selectedTenant.name, password);
      await updateDoc(doc(db, "colleges", selectedTenant.id), {
        students:   [...existing, { id: regNo, name }],
        studentIds: [...(selectedTenant.studentIds || []), regNo],
      });
      setNewStudentId(""); setNewStudentName("");
      await fetchTenants();
      alert(`✅ ${regNo}${name ? ` (${name})` : ""} registered!\nPassword: ${password}`);
    } catch (err) { alert("Registration failed: " + err.message); }
    setIsAddingStudent(false);
  };

  // ── BULK EXCEL UPLOAD ────────────────────────────────────────────────────
  const handleBulkUpload = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = null; // reset input immediately — prevents navigation issues
    if (!file || !selectedTenant) { alert("Select a college first."); return; }

    setIsUploadingExcel(true);
    setBulkProgress(null);
    try {
      const wb  = XLSX.read(await file.arrayBuffer());
      const ws  = wb.Sheets[wb.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(ws, { defval: "" });

      const getId = (r) =>
        r["Student ID"] || r["StudentID"] || r["student_id"] || r["STUDENT ID"] ||
        r["Student Id"] || r["Reg No"]    || r["RegNo"]      || r["reg_no"]     ||
        r["REG NO"]     || r["Registration No"] || Object.values(r)[0];

      const getName = (r) =>
        r["Student Name"] || r["StudentName"] || r["student_name"] || r["STUDENT NAME"] ||
        r["Name"]         || r["name"]        || r["Full Name"]    || r["FULL NAME"]    || "";

      const entries = rows
        .map((r) => ({ id: String(getId(r) || "").trim().toUpperCase(), name: String(getName(r) || "").trim() }))
        .filter((e) => e.id.length > 0);

      if (!entries.length) {
        alert("No valid Student IDs found.\n\nExpected columns: 'Student ID', 'Reg No', or first column.\nOptional: 'Student Name' or 'Name'.");
        setIsUploadingExcel(false); return;
      }

      // Fetch fresh college doc
      const latestData = (await getDoc(doc(db, "colleges", selectedTenant.id))).data() || {};
      const existingStudents   = latestData.students   || [];
      const existingStudentIds = latestData.studentIds || [];
      const existingSet = new Set([...existingStudents.map((s) => s.id), ...existingStudentIds]);

      const toAdd    = [];
      const toUpdate = [];
      const skipped  = [];

      for (const entry of entries) {
        if (existingSet.has(entry.id)) {
          const rec = existingStudents.find((s) => s.id === entry.id);
          if (entry.name && rec && !rec.name) toUpdate.push(entry);
          else skipped.push(entry.id);
        } else {
          toAdd.push(entry);
        }
      }

      // Update missing names in one write
      if (toUpdate.length) {
        let updated = [...existingStudents];
        for (const e of toUpdate) updated = updated.map((s) => s.id === e.id ? { ...s, name: e.name } : s);
        await updateDoc(doc(db, "colleges", selectedTenant.id), { students: updated });
      }

      const password = makePassword(selectedTenant.name);
      let success = 0, fail = 0;
      setBulkProgress({ done: 0, total: toAdd.length });

      for (let i = 0; i < toAdd.length; i++) {
        const { id: regNo, name } = toAdd[i];
        setBulkProgress({ done: i + 1, total: toAdd.length });
        try {
          await registerStudentAccount(regNo, name, selectedTenant.name, password);
          // Re-read each time to avoid overwrite race
          const fresh = (await getDoc(doc(db, "colleges", selectedTenant.id))).data() || {};
          const fs    = fresh.students   || [];
          const fids  = fresh.studentIds || [];
          if (!fs.some((s) => s.id === regNo) && !fids.includes(regNo)) {
            await updateDoc(doc(db, "colleges", selectedTenant.id), {
              students:   [...fs, { id: regNo, name }],
              studentIds: [...fids, regNo],
            });
          }
          success++;
        } catch (err) { console.error(`Failed ${regNo}:`, err); fail++; }
      }

      await fetchTenants();
      setBulkProgress(null);
      alert(
        `✅ Bulk Upload Complete!\n\n` +
        `✅ Newly registered : ${success}\n` +
        `📝 Names updated   : ${toUpdate.length}\n` +
        `⏭ Already existed  : ${skipped.length}\n` +
        `❌ Failed           : ${fail}\n\n` +
        `Password: ${password}`
      );
    } catch (err) {
      console.error("Bulk upload error:", err);
      alert("Failed to process file: " + err.message);
      setBulkProgress(null);
    } finally { setIsUploadingExcel(false); }
  };

  // ── DELETE ALL STUDENTS ──────────────────────────────────────────────────
  const handleDeleteAllStudents = async () => {
    if (!selectedTenant?.studentIds?.length) { alert("No students to delete."); return; }
    if (!window.confirm(`Delete ALL ${selectedTenant.studentIds.length} students from "${selectedTenant.name}"?`)) return;
    try {
      const snap = await getDocs(query(collection(db, "users"), where("collegeId", "==", selectedTenant.name)));
      await Promise.all(snap.docs.map((d) => deleteDoc(doc(db, "users", d.id))));
      await updateDoc(doc(db, "colleges", selectedTenant.id), { studentIds: [], students: [] });
      await fetchTenants();
    } catch (err) { alert("Failed: " + err.message); }
  };

  // ── REMOVE SINGLE STUDENT ────────────────────────────────────────────────
  const handleRemoveStudent = async (sid) => {
    if (!selectedTenant || !window.confirm(`Remove student ${sid}?`)) return;
    try {
      await updateDoc(doc(db, "colleges", selectedTenant.id), {
        studentIds: arrayRemove(sid),
        students:   (selectedTenant.students || []).filter((s) => s.id !== sid),
      });
      const snap = await getDocs(query(collection(db, "users"), where("regNo", "==", sid), where("collegeId", "==", selectedTenant.name)));
      await Promise.all(snap.docs.map((d) => deleteDoc(doc(db, "users", d.id))));
      await fetchTenants();
    } catch (err) { alert("Failed: " + err.message); }
  };

  // ── LOGO ─────────────────────────────────────────────────────────────────
  const handleUploadLogo = async (e, tenant) => {
    const file = e.target.files?.[0]; e.target.value = null;
    if (!file) return;
    setUploadingLogoId(tenant.id);
    try {
      const r   = ref(storage, `collegeLogos/${tenant.id}_${Date.now()}_${file.name}`);
      await uploadBytes(r, file);
      const url = await getDownloadURL(r);
      await updateDoc(doc(db, "colleges", tenant.id), { logoUrl: url, logoPath: r.fullPath });
      await fetchTenants();
    } catch (err) { alert("Upload failed: " + err.message); }
    setUploadingLogoId(null);
  };

  const handleDeleteLogo = async (tenant) => {
    if (!window.confirm(`Remove logo for "${tenant.name}"?`)) return;
    try {
      if (tenant.logoPath) await deleteObject(ref(storage, tenant.logoPath)).catch(() => {});
      await updateDoc(doc(db, "colleges", tenant.id), { logoUrl: null, logoPath: null });
      await fetchTenants();
    } catch (err) { alert("Failed: " + err.message); }
  };

  // ── HELPERS ──────────────────────────────────────────────────────────────
  const getStudentName = (sid) =>
    (selectedTenant?.students || []).find((s) => s.id === sid)?.name || "";

  const filteredIds = (selectedTenant?.studentIds || []).filter((sid) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return sid.toLowerCase().includes(q) || getStudentName(sid).toLowerCase().includes(q);
  });

  // ── RENDER ────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "#0f172a", color: "#f1f5f9", fontFamily: "system-ui,sans-serif", display: "flex", flexDirection: "column" }}>

      {/* HEADER */}
      <header style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: "1.5rem", padding: "1rem 2rem", background: "#020617", borderBottom: "1px solid #1e293b", position: "sticky", top: 0, zIndex: 50 }}>
        <button onClick={onBack} style={{ fontWeight: 800, fontSize: "0.78rem", padding: "0.55rem 1.25rem", borderRadius: "0.7rem", border: "2px solid rgba(236,72,153,0.4)", background: "rgba(236,72,153,0.08)", color: "#f472b6", cursor: "pointer" }}>
          ← Back to Dashboard
        </button>
        <div>
          <h2 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 900 }}>🏢 Tenant Management</h2>
          <p style={{ margin: 0, fontSize: "0.6rem", color: "#475569", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 700 }}>Admin Control Center</p>
        </div>
        <div style={{ marginLeft: "auto", fontSize: "0.7rem", color: "#475569", fontWeight: 700 }}>
          {tenants.length} colleges · {tenants.reduce((s, t) => s + (t.studentIds?.length || 0), 0)} students
        </div>
      </header>

      {/* ADD COLLEGE */}
      <section style={{ flexShrink: 0, padding: "1rem 2rem", background: "rgba(30,41,59,0.4)", borderBottom: "1px solid #1e293b" }}>
        <p style={S.sectionLabel}>Add New College / Tenant</p>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <input value={newCollegeName} onChange={(e) => setNewCollegeName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleCreateTenant()} placeholder="College name (e.g. VVIT, SRM, VFSTR)" style={S.input} />
          <button onClick={handleCreateTenant} disabled={isCreating} style={{ ...S.primaryBtn, padding: "0.65rem 1.75rem", whiteSpace: "nowrap", opacity: isCreating ? 0.6 : 1 }}>
            {isCreating ? "Creating…" : "+ Create College"}
          </button>
        </div>
      </section>

      {/* SPLIT */}
      <main style={{ flex: 1, display: "flex", overflow: "hidden", minHeight: 0 }}>

        {/* LEFT — colleges */}
        <aside style={{ width: "42%", minWidth: "300px", borderRight: "1px solid #1e293b", display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ flexShrink: 0, padding: "0.75rem 1.25rem", borderBottom: "1px solid #1e293b", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={S.sectionLabel}>Active Colleges</span>
            <span style={{ background: "#1e293b", border: "1px solid #334155", padding: "0.15rem 0.5rem", borderRadius: "0.4rem", fontSize: "0.7rem", fontWeight: 700, color: "#94a3b8" }}>{tenants.length}</span>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "0.875rem", display: "flex", flexDirection: "column", gap: "0.625rem" }}>
            {loading
              ? <p style={{ textAlign: "center", color: "#475569", paddingTop: "3rem" }}>Loading…</p>
              : tenants.length === 0
                ? <p style={{ textAlign: "center", color: "#475569", paddingTop: "3rem" }}>No colleges yet.</p>
                : tenants.map((t) => {
                  const active = selectedTenant?.id === t.id;
                  return (
                    <div key={t.id} onClick={() => { setSelectedTenant(t); setSearchQuery(""); }} style={{ padding: "0.875rem 1rem", borderRadius: "0.875rem", border: `2px solid ${active ? "#3b82f6" : "#1e293b"}`, background: active ? "rgba(59,130,246,0.07)" : "rgba(30,41,59,0.35)", cursor: "pointer", transition: "border-color .15s" }}>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", marginBottom: "0.75rem" }}>
                        {t.logoUrl
                          ? <img src={t.logoUrl} alt="logo" style={{ width: "2.5rem", height: "2.5rem", borderRadius: "0.5rem", objectFit: "contain", background: "#fff", padding: "2px", flexShrink: 0 }} />
                          : <div style={{ width: "2.5rem", height: "2.5rem", borderRadius: "0.5rem", background: "#1e293b", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.55rem", color: "#475569", fontWeight: 800, flexShrink: 0 }}>N/A</div>
                        }
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ margin: 0, fontWeight: 800, fontSize: "0.875rem", color: active ? "#60a5fa" : "#f1f5f9", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.name}</p>
                          <p style={{ margin: "0.2rem 0 0", fontSize: "0.62rem", color: "#475569", fontFamily: "monospace" }}>PWD: <span style={{ color: "#fbbf24" }}>{t.defaultPassword}</span></p>
                        </div>
                        <div style={{ textAlign: "right", flexShrink: 0 }}>
                          <div style={{ fontSize: "1.4rem", fontWeight: 900, color: "#3b82f6", lineHeight: 1 }}>{t.studentIds?.length || 0}</div>
                          <div style={{ fontSize: "0.55rem", color: "#475569", textTransform: "uppercase", fontWeight: 700 }}>students</div>
                        </div>
                      </div>
                      <div onClick={(e) => e.stopPropagation()} style={{ display: "flex", gap: "0.4rem" }}>
                        {t.logoUrl
                          ? <button onClick={() => handleDeleteLogo(t)} style={S.dangerBtn}>🗑 Remove Logo</button>
                          : (<>
                              <input type="file" accept="image/*" id={`logo-${t.id}`} style={{ display: "none" }} onChange={(e) => handleUploadLogo(e, t)} />
                              <label htmlFor={`logo-${t.id}`} style={{ ...S.ghostBtn, cursor: "pointer", textAlign: "center" }}>
                                {uploadingLogoId === t.id ? "Uploading…" : "📷 Upload Logo"}
                              </label>
                            </>)
                        }
                        <button onClick={() => handleDeleteTenant(t)} style={S.dangerBtn}>🗑 Delete College</button>
                      </div>
                    </div>
                  );
                })
            }
          </div>
        </aside>

        {/* RIGHT — students */}
        <section style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: "rgba(2,6,23,0.3)" }}>
          {!selectedTenant
            ? (
              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#334155", gap: "0.75rem" }}>
                <span style={{ fontSize: "3.5rem" }}>👈</span>
                <p style={{ fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", fontSize: "0.8rem" }}>Select a college to manage students</p>
              </div>
            )
            : (<>
                <div style={{ flexShrink: 0, padding: "0.875rem 1.5rem", borderBottom: "1px solid #1e293b", background: "rgba(15,23,42,0.5)" }}>
                  <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 900, color: "#60a5fa" }}>{selectedTenant.name}</h3>
                  <p style={{ margin: "0.2rem 0 0", fontSize: "0.62rem", color: "#475569", fontFamily: "monospace" }}>ID: {selectedTenant.id}</p>
                </div>

                <div style={{ flex: 1, overflowY: "auto", padding: "1.25rem 1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>

                  {/* Password */}
                  <div style={{ background: "rgba(251,191,36,0.05)", border: "1px solid rgba(251,191,36,0.2)", borderRadius: "0.875rem", padding: "0.875rem 1rem" }}>
                    <p style={{ margin: "0 0 0.3rem", fontSize: "0.6rem", color: "#d97706", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.12em" }}>Auto-Generated Password</p>
                    <p style={{ margin: 0, fontSize: "1.2rem", fontWeight: 900, fontFamily: "monospace", color: "#fbbf24" }}>{makePassword(selectedTenant.name)}</p>
                    <p style={{ margin: "0.2rem 0 0", fontSize: "0.62rem", color: "#92400e" }}>All students in this college share this password</p>
                  </div>

                  {/* Individual */}
                  <div>
                    <p style={S.sectionLabel}>Individual Registration</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                      <input value={newStudentId} onChange={(e) => setNewStudentId(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleAddStudent()} placeholder="Student Reg. No. *" style={S.input} />
                      <input value={newStudentName} onChange={(e) => setNewStudentName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleAddStudent()} placeholder="Student Name (optional)" style={S.input} />
                      <button onClick={handleAddStudent} disabled={isAddingStudent} style={S.primaryBtn}>
                        {isAddingStudent ? "Registering…" : "+ Register Student"}
                      </button>
                    </div>
                  </div>

                  {/* Bulk */}
                  <div>
                    <p style={S.sectionLabel}>Bulk Excel Upload</p>
                    <div style={{ background: "rgba(30,41,59,0.5)", border: "1px solid #1e293b", borderRadius: "0.75rem", padding: "0.75rem", marginBottom: "0.5rem" }}>
                      <p style={{ margin: "0 0 0.3rem", fontSize: "0.65rem", fontWeight: 700, color: "#64748b" }}>Excel column names accepted:</p>
                      <p style={{ margin: "0.1rem 0", fontSize: "0.63rem", color: "#64748b" }}>ID → <span style={{ color: "#4ade80", fontFamily: "monospace" }}>"Student ID" / "Reg No"</span> / first column</p>
                      <p style={{ margin: "0.1rem 0", fontSize: "0.63rem", color: "#64748b" }}>Name → <span style={{ color: "#60a5fa", fontFamily: "monospace" }}>"Student Name" / "Name"</span> (optional)</p>
                    </div>

                    {bulkProgress && (
                      <div style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: "0.75rem", padding: "0.75rem", marginBottom: "0.5rem" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", color: "#94a3b8", fontWeight: 700, marginBottom: "0.4rem" }}>
                          <span>Registering students…</span><span>{bulkProgress.done} / {bulkProgress.total}</span>
                        </div>
                        <div style={{ background: "#334155", borderRadius: "999px", height: "5px" }}>
                          <div style={{ background: "#3b82f6", height: "5px", borderRadius: "999px", width: `${Math.round((bulkProgress.done / bulkProgress.total) * 100)}%`, transition: "width 0.3s" }} />
                        </div>
                      </div>
                    )}

                    <input type="file" accept=".xlsx,.xls" id="excel-upload" style={{ display: "none" }} onChange={handleBulkUpload} />
                    <label htmlFor="excel-upload" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", padding: "0.7rem", borderRadius: "0.65rem", fontWeight: 800, fontSize: "0.78rem", background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.3)", color: "#4ade80", cursor: isUploadingExcel ? "not-allowed" : "pointer", opacity: isUploadingExcel ? 0.6 : 1, marginBottom: "0.5rem", pointerEvents: isUploadingExcel ? "none" : "auto" }}>
                      📊 {isUploadingExcel ? "Processing…" : "Upload Excel File"}
                    </label>

                    <button onClick={handleDeleteAllStudents} style={{ width: "100%", padding: "0.7rem", borderRadius: "0.65rem", fontWeight: 800, fontSize: "0.78rem", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171", cursor: "pointer" }}>
                      🗑 Delete All Students ({selectedTenant.studentIds?.length || 0})
                    </button>
                  </div>

                  {/* Registry */}
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                      <p style={{ ...S.sectionLabel, margin: 0 }}>Student Registry</p>
                      <span style={{ fontSize: "0.62rem", color: "#475569", fontWeight: 700 }}>{filteredIds.length} / {selectedTenant.studentIds?.length || 0}</span>
                    </div>
                    <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search by Reg No or Name…" style={{ ...S.input, marginBottom: "0.5rem", fontSize: "0.78rem" }} />

                    {!(selectedTenant.studentIds?.length)
                      ? <div style={{ textAlign: "center", padding: "2rem", color: "#334155", fontSize: "0.82rem", background: "rgba(15,23,42,0.4)", borderRadius: "0.75rem", border: "1px solid #1e293b" }}>No students registered yet.</div>
                      : (
                        <div style={{ background: "rgba(15,23,42,0.5)", borderRadius: "0.875rem", border: "1px solid #1e293b", overflow: "hidden" }}>
                          {/* header row */}
                          <div style={{ display: "flex", gap: "1rem", padding: "0.5rem 0.875rem", background: "rgba(30,41,59,0.7)", borderBottom: "1px solid #1e293b" }}>
                            <span style={{ ...S.colH, width: "9rem", flexShrink: 0 }}># Reg. No.</span>
                            <span style={{ ...S.colH, flex: 1 }}>Name</span>
                            <span style={{ ...S.colH, width: "4.5rem", textAlign: "right" }}>Action</span>
                          </div>
                          {filteredIds.map((sid, i) => {
                            const name = getStudentName(sid);
                            return (
                              <div key={sid} style={{ display: "flex", gap: "1rem", alignItems: "center", padding: "0.6rem 0.875rem", borderBottom: "1px solid #0f172a", background: i % 2 === 0 ? "transparent" : "rgba(30,41,59,0.2)" }}>
                                <span style={{ width: "9rem", flexShrink: 0, fontSize: "0.75rem", fontFamily: "monospace", color: "#cbd5e1" }}>
                                  {String(i + 1).padStart(2, "0")}. {sid}
                                </span>
                                <span style={{ flex: 1, fontSize: "0.8rem", color: name ? "#94a3b8" : "#334155", fontStyle: name ? "normal" : "italic" }}>
                                  {name || "No name"}
                                </span>
                                <button onClick={() => handleRemoveStudent(sid)} style={{ flexShrink: 0, width: "4.5rem", padding: "0.28rem 0", fontSize: "0.63rem", fontWeight: 800, borderRadius: "0.4rem", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171", cursor: "pointer", textAlign: "center" }}>
                                  Remove
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )
                    }
                  </div>
                </div>
              </>)
          }
        </section>
      </main>
    </div>
  );
};

// ── Shared styles ────────────────────────────────────────────────────────────
const S = {
  input:       { width: "100%", boxSizing: "border-box", background: "#020617", border: "1px solid #334155", borderRadius: "0.65rem", padding: "0.6rem 0.875rem", color: "#f1f5f9", fontSize: "0.85rem", outline: "none" },
  primaryBtn:  { width: "100%", padding: "0.7rem", borderRadius: "0.65rem", background: "#2563eb", color: "#fff", fontWeight: 800, fontSize: "0.82rem", border: "none", cursor: "pointer" },
  ghostBtn:    { flex: 1, padding: "0.45rem 0.75rem", borderRadius: "0.45rem", fontSize: "0.63rem", fontWeight: 800, background: "#1e293b", border: "1px solid #334155", color: "#94a3b8" },
  dangerBtn:   { flex: 1, padding: "0.45rem 0.75rem", borderRadius: "0.45rem", fontSize: "0.63rem", fontWeight: 800, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171", cursor: "pointer" },
  sectionLabel: { margin: "0 0 0.5rem", fontSize: "0.58rem", fontWeight: 900, color: "#475569", textTransform: "uppercase", letterSpacing: "0.15em" },
  colH:         { fontSize: "0.55rem", fontWeight: 900, color: "#475569", textTransform: "uppercase", letterSpacing: "0.1em" },
};

export default TenantManager;
