
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import * as XLSX from 'xlsx';
import {
  collection, getDocs, addDoc, updateDoc, doc, setDoc, deleteDoc,
  serverTimestamp, arrayUnion, arrayRemove, query, where
} from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { db, auth, storage } from "../../firebase/config";

const TenantManager = () => {
  const history = useHistory();
  const [tenants, setTenants] = useState([]);
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [newCollegeName, setNewCollegeName] = useState("");
  const [newStudentId, setNewStudentId] = useState("");
  const [newStudentName, setNewStudentName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isAddingStudent, setIsAddingStudent] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploadingLogoId, setUploadingLogoId] = useState(null);
  const [isUploadingExcel, setIsUploadingExcel] = useState(false);

  // ─── FETCH ALL COLLEGES ───────────────────────────────────────────────────
  const fetchTenants = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, "colleges"));
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setTenants(list);
      if (selectedTenant) {
        const updated = list.find((t) => t.id === selectedTenant.id);
        setSelectedTenant(updated || null);
      }
    } catch (err) {
      console.error("Error fetching colleges:", err);
    }
    setLoading(false);
  };

  useEffect(() => { fetchTenants(); }, []);

  // ─── PASSWORD GENERATOR ───────────────────────────────────────────────────
  const generateDefaultPassword = (name) => {
    if (!name) return "Mindcode@123";
    return `${name.trim().toUpperCase().replace(/\s+/g, "")}@123`;
  };

  // ─── CREATE COLLEGE ───────────────────────────────────────────────────────
  const handleCreateTenant = async () => {
    if (!newCollegeName.trim()) return;
    setIsCreating(true);
    try {
      const autoPass = generateDefaultPassword(newCollegeName);
      await addDoc(collection(db, "colleges"), {
        name: newCollegeName.trim(),
        defaultPassword: autoPass,
        studentIds: [],
        students: [],           // NEW: array of { id, name } objects
        createdAt: serverTimestamp(),
        logoUrl: null,
        logoPath: null,
      });
      setNewCollegeName("");
      await fetchTenants();
    } catch (err) {
      alert("Failed to create college.");
    }
    setIsCreating(false);
  };

  // ─── DELETE COLLEGE + ALL STUDENTS ───────────────────────────────────────
  const handleDeleteTenant = async (tenant) => {
    if (!window.confirm(`Are you sure you want to completely delete "${tenant.name}" and ALL its students? This cannot be undone.`)) return;
    try {
      if (tenant.logoPath) {
        const fileRef = ref(storage, tenant.logoPath);
        await deleteObject(fileRef).catch(e => console.warn("Logo missing in storage", e));
      }
      const q = query(collection(db, "users"), where("collegeId", "==", tenant.name));
      const querySnapshot = await getDocs(q);
      const deletePromises = [];
      querySnapshot.forEach((document) => {
        deletePromises.push(deleteDoc(doc(db, "users", document.id)));
      });
      await Promise.all(deletePromises);
      await deleteDoc(doc(db, "colleges", tenant.id));
      if (selectedTenant?.id === tenant.id) setSelectedTenant(null);
      await fetchTenants();
    } catch (error) {
      console.error("Deletion failed", error);
      alert("Failed to delete college.");
    }
  };

  // ─── ADD SINGLE STUDENT ───────────────────────────────────────────────────
  const handleAddStudent = async () => {
    if (!newStudentId.trim() || !selectedTenant) {
      alert("Please enter a Student ID and select a college.");
      return;
    }
    const regNo = newStudentId.trim().toUpperCase();
    const studentName = newStudentName.trim() || "";

    if (selectedTenant.studentIds?.includes(regNo)) {
      alert("Student ID already exists in this college.");
      return;
    }
    setIsAddingStudent(true);
    try {
      const internalEmail = `${regNo.toLowerCase()}@mindcode.com`;
      const autoPassword = generateDefaultPassword(selectedTenant.name);

      // Check if user already exists in Firestore
      const existingUserQuery = query(collection(db, "users"), where("regNo", "==", regNo));
      const existingUserSnap = await getDocs(existingUserQuery);

      if (!existingUserSnap.empty) {
        // User exists in Firestore — update name if provided and add to college studentIds
        if (studentName) {
          existingUserSnap.forEach(async (d) => {
            await updateDoc(doc(db, "users", d.id), { name: studentName });
          });
        }
        await updateDoc(doc(db, "colleges", selectedTenant.id), {
          studentIds: arrayUnion(regNo),
          students: arrayUnion({ id: regNo, name: studentName }),
        });
      } else {
        // Try to create new auth user
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, internalEmail, autoPassword);
          await setDoc(doc(db, "users", userCredential.user.uid), {
            regNo,
            name: studentName,
            email: internalEmail,
            collegeId: selectedTenant.name,
            role: 'student',
            userType: 'college',
            createdAt: serverTimestamp()
          });
        } catch (authErr) {
          if (authErr.code === 'auth/email-already-in-use') {
            console.warn(`Auth user exists for ${regNo}, adding to college list`);
          } else {
            throw authErr;
          }
        }
        await updateDoc(doc(db, "colleges", selectedTenant.id), {
          studentIds: arrayUnion(regNo),
          students: arrayUnion({ id: regNo, name: studentName }),
        });
      }

      setNewStudentId("");
      setNewStudentName("");
      await fetchTenants();
      alert(`✅ Student ${regNo}${studentName ? ` (${studentName})` : ""} registered!\nPassword: ${autoPassword}`);
    } catch (err) {
      console.error(err);
      alert("Registration failed: " + err.message);
    }
    setIsAddingStudent(false);
  };

  // ─── BULK EXCEL UPLOAD ────────────────────────────────────────────────────
  const handleBulkUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !selectedTenant) {
      alert("Please select a college first.");
      return;
    }
    setIsUploadingExcel(true);
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

      console.log("Excel columns found:", jsonData.length > 0 ? Object.keys(jsonData[0]) : "No rows");
      console.log("First row sample:", jsonData[0]);

      // ── Flexible column detection for ID ──
      const getStudentId = (row) =>
        row['Student ID'] ||
        row['StudentID'] ||
        row['student_id'] ||
        row['STUDENT ID'] ||
        row['Student Id'] ||
        row['studentId'] ||
        row['Reg No'] ||
        row['RegNo'] ||
        row['reg_no'] ||
        row['REG NO'] ||
        row['Registration No'] ||
        row['registration_no'] ||
        Object.values(row)[0];

      // ── Flexible column detection for Name ──
      const getStudentName = (row) =>
        row['Student Name'] ||
        row['StudentName'] ||
        row['student_name'] ||
        row['STUDENT NAME'] ||
        row['Name'] ||
        row['name'] ||
        row['Full Name'] ||
        row['full_name'] ||
        row['FULL NAME'] ||
        "";

      const studentEntries = jsonData
        .map(row => ({
          id: getStudentId(row),
          name: String(getStudentName(row) || "").trim(),
        }))
        .filter(entry => entry.id)
        .map(entry => ({
          id: String(entry.id).trim().toUpperCase(),
          name: entry.name,
        }))
        .filter(entry => entry.id.length > 0);

      if (studentEntries.length === 0) {
        alert("No valid Student IDs found.\n\nMake sure your Excel has a column named:\n• Student ID\n• StudentID\n• Reg No\n• RegNo\n\nAnd optionally:\n• Student Name\n• Name\n\nOr place IDs in the first column.");
        setIsUploadingExcel(false);
        return;
      }

      const autoPassword = generateDefaultPassword(selectedTenant.name);
      let successCount = 0;
      let alreadyExistsCount = 0;
      let failCount = 0;

      for (const { id: regNo, name: studentName } of studentEntries) {
        // Skip if already in this college's list
        if (selectedTenant.studentIds?.includes(regNo)) {
          alreadyExistsCount++;
          // Update name if provided and not already set
          if (studentName) {
            const existingStudents = selectedTenant.students || [];
            const existing = existingStudents.find(s => s.id === regNo);
            if (existing && !existing.name) {
              const updatedStudents = existingStudents.map(s =>
                s.id === regNo ? { ...s, name: studentName } : s
              );
              await updateDoc(doc(db, "colleges", selectedTenant.id), { students: updatedStudents });
            }
          }
          continue;
        }

        try {
          const internalEmail = `${regNo.toLowerCase()}@mindcode.com`;

          // Check Firestore first
          const existingQ = query(collection(db, "users"), where("regNo", "==", regNo));
          const existingSnap = await getDocs(existingQ);

          if (existingSnap.empty) {
            try {
              const userCredential = await createUserWithEmailAndPassword(auth, internalEmail, autoPassword);
              await setDoc(doc(db, "users", userCredential.user.uid), {
                regNo,
                name: studentName,
                email: internalEmail,
                collegeId: selectedTenant.name,
                role: 'student',
                userType: 'college',
                createdAt: serverTimestamp()
              });
            } catch (authErr) {
              if (authErr.code === 'auth/email-already-in-use') {
                console.warn(`Auth exists for ${regNo} but no Firestore doc`);
              } else {
                throw authErr;
              }
            }
          } else if (studentName) {
            existingSnap.forEach(async (d) => {
              await updateDoc(doc(db, "users", d.id), { name: studentName });
            });
          }

          // Always add to college studentIds and students
          await updateDoc(doc(db, "colleges", selectedTenant.id), {
            studentIds: arrayUnion(regNo),
            students: arrayUnion({ id: regNo, name: studentName }),
          });
          successCount++;

        } catch (error) {
          console.error(`Failed to register ${regNo}:`, error);
          failCount++;
        }
      }

      await fetchTenants();
      alert(
        `✅ Bulk Upload Complete!\n\n` +
        `Registered: ${successCount}\n` +
        `Already in college: ${alreadyExistsCount}\n` +
        `Failed: ${failCount}\n\n` +
        `Password: ${autoPassword}`
      );
    } catch (error) {
      console.error("Bulk upload error:", error);
      alert("Failed to process Excel file: " + error.message);
    } finally {
      setIsUploadingExcel(false);
      e.target.value = null;
    }
  };

  // ─── DELETE ALL STUDENTS ──────────────────────────────────────────────────
  const handleDeleteAllStudents = async () => {
    if (!selectedTenant || !selectedTenant.studentIds?.length) {
      alert("No students to delete.");
      return;
    }
    if (!window.confirm(`Delete ALL ${selectedTenant.studentIds.length} students from "${selectedTenant.name}"? This cannot be undone!`)) return;
    try {
      const q = query(collection(db, "users"), where("collegeId", "==", selectedTenant.name));
      const querySnapshot = await getDocs(q);
      const deletePromises = [];
      querySnapshot.forEach((document) => {
        deletePromises.push(deleteDoc(doc(db, "users", document.id)));
      });
      await Promise.all(deletePromises);
      await updateDoc(doc(db, "colleges", selectedTenant.id), { studentIds: [], students: [] });
      await fetchTenants();
      alert("All students deleted successfully.");
    } catch (error) {
      console.error("Failed to delete all students:", error);
      alert("Failed to delete students.");
    }
  };

  // ─── REMOVE SINGLE STUDENT ────────────────────────────────────────────────
  const handleRemoveStudent = async (studentId) => {
    if (!selectedTenant) return;
    if (!window.confirm(`Delete student ${studentId} from the database?`)) return;
    try {
      // Remove from studentIds (legacy)
      await updateDoc(doc(db, "colleges", selectedTenant.id), { studentIds: arrayRemove(studentId) });

      // Remove from students array — filter and rewrite since arrayRemove needs exact object match
      const updatedStudents = (selectedTenant.students || []).filter(s => s.id !== studentId);
      await updateDoc(doc(db, "colleges", selectedTenant.id), { students: updatedStudents });

      const q = query(
        collection(db, "users"),
        where("regNo", "==", studentId),
        where("collegeId", "==", selectedTenant.name)
      );
      const snap = await getDocs(q);
      snap.forEach(async (d) => await deleteDoc(doc(db, "users", d.id)));
      await fetchTenants();
    } catch (err) {
      console.error("Failed to remove student:", err);
      alert("Failed to remove student.");
    }
  };

  // ─── UPLOAD LOGO ──────────────────────────────────────────────────────────
  const handleUploadLogo = async (e, tenant) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingLogoId(tenant.id);
    try {
      const fileRef = ref(storage, `collegeLogos/${tenant.id}_${Date.now()}_${file.name}`);
      await uploadBytes(fileRef, file);
      const url = await getDownloadURL(fileRef);
      await updateDoc(doc(db, "colleges", tenant.id), { logoUrl: url, logoPath: fileRef.fullPath });
      await fetchTenants();
    } catch (error) {
      console.error("Logo upload failed", error);
      alert("Failed to upload logo.");
    } finally {
      setUploadingLogoId(null);
      e.target.value = null;
    }
  };

  // ─── DELETE LOGO ──────────────────────────────────────────────────────────
  const handleDeleteLogo = async (tenant) => {
    if (!window.confirm(`Remove the logo for "${tenant.name}"?`)) return;
    try {
      if (tenant.logoPath) {
        const fileRef = ref(storage, tenant.logoPath);
        await deleteObject(fileRef).catch(e => console.warn("File missing in storage", e));
      }
      await updateDoc(doc(db, "colleges", tenant.id), { logoUrl: null, logoPath: null });
      await fetchTenants();
    } catch (error) {
      console.error("Logo delete failed", error);
      alert("Failed to delete logo.");
    }
  };

  // ─── HELPER: get student name from students array ─────────────────────────
  const getStudentName = (sid) => {
    const students = selectedTenant?.students || [];
    const found = students.find(s => s.id === sid);
    return found?.name || "";
  };

  // ─── RENDER ───────────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 bg-gray-900 text-white flex flex-col overflow-hidden">

      {/* ── HEADER ── */}
      <header className="flex-shrink-0 flex items-center gap-6 px-8 py-4 bg-gray-950 border-b border-gray-800 shadow-xl z-10">
        <button
          onClick={() => history.push("/faculty-dashboard")}
          className="font-bold text-pink-400 border-2 border-pink-500 px-6 py-2.5 rounded-xl bg-gray-900 hover:bg-pink-500 hover:text-white transition-all duration-200 text-sm tracking-wide shadow-[0_0_15px_rgba(236,72,153,0.15)]"
        >
          ← Back
        </button>
        <div>
          <h2 className="text-xl font-black tracking-tight">🏢 Tenant Management</h2>
          <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mt-0.5">Admin Control Center</p>
        </div>
      </header>

      {/* ── ADD COLLEGE BAR ── */}
      <section className="flex-shrink-0 px-8 py-5 bg-gray-800/50 border-b border-gray-700">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Add New College / Tenant</p>
        <div className="flex gap-4">
          <input
            value={newCollegeName}
            onChange={(e) => setNewCollegeName(e.target.value)}
            placeholder="Enter college name (e.g. VVIT, SRM, VFSTR)"
            onKeyDown={(e) => e.key === "Enter" && handleCreateTenant()}
            className="flex-1 bg-gray-950 border border-gray-700 rounded-xl px-5 py-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
          />
          <button
            onClick={handleCreateTenant}
            disabled={isCreating}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-sm transition-all disabled:opacity-50 whitespace-nowrap shadow-lg shadow-blue-900/30"
          >
            {isCreating ? "Creating..." : "+ Create College"}
          </button>
        </div>
      </section>

      {/* ── MAIN SPLIT VIEW ── */}
      <main className="flex-1 flex overflow-hidden">

        {/* ── LEFT: COLLEGES LIST ── */}
        <aside className="w-1/2 border-r border-gray-800 flex flex-col bg-gray-900/50">
          <div className="flex-shrink-0 px-6 py-4 border-b border-gray-800 flex justify-between items-center">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Active Colleges</h3>
            <span className="bg-gray-800 border border-gray-700 px-3 py-1 rounded-lg text-xs font-mono text-gray-300">
              {tenants.length} Total
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {loading ? (
              <div className="text-center py-20 text-gray-600 animate-pulse text-sm">Loading database...</div>
            ) : tenants.length === 0 ? (
              <div className="text-center py-20 text-gray-600 text-sm">No colleges added yet.</div>
            ) : (
              tenants.map((t) => (
                <div
                  key={t.id}
                  onClick={() => setSelectedTenant(t)}
                  className={`group p-5 rounded-2xl border-2 transition-all cursor-pointer ${
                    selectedTenant?.id === t.id
                      ? 'border-blue-500 bg-blue-600/10 shadow-[0_0_20px_rgba(59,130,246,0.1)]'
                      : 'border-gray-800 bg-gray-800/40 hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-start gap-4 mb-4">
                    {t.logoUrl ? (
                      <img src={t.logoUrl} alt="logo" className="w-12 h-12 rounded-lg object-contain bg-white p-1 flex-shrink-0" />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-gray-700 flex items-center justify-center text-xs text-gray-500 font-bold flex-shrink-0">
                        N/A
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-base group-hover:text-blue-400 transition-colors truncate">{t.name}</h4>
                      <p className="text-xs text-gray-500 font-mono mt-1">
                        PWD: <span className="text-yellow-400">{t.defaultPassword}</span>
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-blue-400 font-black text-2xl leading-none">{t.studentIds?.length || 0}</div>
                      <div className="text-[10px] text-gray-500 uppercase font-bold">Students</div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2" onClick={(e) => e.stopPropagation()}>
                    {t.logoUrl ? (
                      <button
                        onClick={() => handleDeleteLogo(t)}
                        className="w-full py-2.5 text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                      >
                        🗑 Remove Logo
                      </button>
                    ) : (
                      <>
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/jpg"
                          id={`logo-${t.id}`}
                          className="hidden"
                          onChange={(e) => handleUploadLogo(e, t)}
                        />
                        <label
                          htmlFor={`logo-${t.id}`}
                          className="w-full py-2.5 text-xs font-bold text-center bg-gray-700 hover:bg-gray-600 text-white rounded-lg cursor-pointer transition-all block"
                        >
                          {uploadingLogoId === t.id ? "Uploading..." : "📷 Upload Logo"}
                        </label>
                      </>
                    )}

                    <button
                      onClick={() => handleDeleteTenant(t)}
                      className="w-full py-2.5 text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                    >
                      🗑 Delete College
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </aside>

        {/* ── RIGHT: STUDENT MANAGEMENT ── */}
        <section className="w-1/2 flex flex-col bg-gray-950/30">
          {!selectedTenant ? (
            <div className="flex-1 flex items-center justify-center flex-col gap-3 text-gray-600">
              <span className="text-5xl">👈</span>
              <p className="font-bold uppercase tracking-widest text-sm">Select a college to manage students</p>
            </div>
          ) : (
            <>
              <div className="flex-shrink-0 px-6 py-4 border-b border-gray-800 bg-gray-900/40">
                <h3 className="text-lg font-black text-blue-400">{selectedTenant.name}</h3>
                <p className="text-xs text-gray-500 mt-0.5 font-mono">ID: {selectedTenant.id}</p>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">

                <div className="bg-yellow-900/10 border border-yellow-500/30 rounded-xl p-4">
                  <p className="text-xs text-yellow-500 font-bold uppercase tracking-wider mb-1">Auto-Generated Password</p>
                  <p className="text-xl font-mono font-black text-yellow-400">{generateDefaultPassword(selectedTenant.name)}</p>
                  <p className="text-xs text-yellow-700 mt-1">Format: REGNO@mindcode.com</p>
                </div>

                {/* ── Individual Registration ── */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Individual Registration</h4>
                  <input
                    value={newStudentId}
                    onChange={(e) => setNewStudentId(e.target.value)}
                    placeholder="Enter Student Reg. No. *"
                    onKeyDown={(e) => e.key === "Enter" && handleAddStudent()}
                    className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none transition-all"
                  />
                  <input
                    value={newStudentName}
                    onChange={(e) => setNewStudentName(e.target.value)}
                    placeholder="Enter Student Name (optional)"
                    onKeyDown={(e) => e.key === "Enter" && handleAddStudent()}
                    className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none transition-all"
                  />
                  <button
                    onClick={handleAddStudent}
                    disabled={isAddingStudent}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-sm transition-all disabled:opacity-50"
                  >
                    {isAddingStudent ? "Registering..." : "+ Register Student"}
                  </button>
                </div>

                {/* ── Bulk Actions ── */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Bulk Actions</h4>
                  <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-3 space-y-1">
                    <p className="text-xs text-gray-400 font-semibold mb-2">Excel Column Names:</p>
                    <p className="text-xs text-gray-500">
                      ID column: <span className="text-green-400 font-mono">"Student ID"</span> / <span className="text-green-400 font-mono">"Reg No"</span> — or first column
                    </p>
                    <p className="text-xs text-gray-500">
                      Name column: <span className="text-blue-400 font-mono">"Student Name"</span> / <span className="text-blue-400 font-mono">"Name"</span> (optional)
                    </p>
                  </div>

                  <input
                    type="file"
                    accept=".xlsx,.xls"
                    id="excel-upload"
                    className="hidden"
                    onChange={handleBulkUpload}
                  />
                  <label
                    htmlFor="excel-upload"
                    className="w-full flex items-center justify-center gap-2 py-3 bg-green-600/10 border border-green-500/30 text-green-400 rounded-xl font-bold text-sm cursor-pointer hover:bg-green-600 hover:text-white transition-all"
                  >
                    <span>📊</span>
                    <span>{isUploadingExcel ? "Processing..." : "Upload Excel File"}</span>
                  </label>

                  <button
                    onClick={handleDeleteAllStudents}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl font-bold text-sm hover:bg-red-500 hover:text-white transition-all"
                  >
                    <span>🗑</span>
                    <span>Delete All Students ({selectedTenant.studentIds?.length || 0})</span>
                  </button>
                </div>

                {/* ── Student Registry ── */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex justify-between">
                    <span>Student Registry</span>
                    <span>{selectedTenant.studentIds?.length || 0} Entries</span>
                  </h4>

                  {!selectedTenant.studentIds?.length ? (
                    <div className="text-center py-8 text-gray-600 text-sm bg-gray-900/50 rounded-xl border border-gray-800">
                      No students registered yet.
                    </div>
                  ) : (
                    <div className="bg-gray-900/50 rounded-2xl border border-gray-800 divide-y divide-gray-800 overflow-hidden">
                      {/* Header row */}
                      <div className="flex items-center px-5 py-2.5 bg-gray-800/70 gap-4">
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest w-36 flex-shrink-0">Reg. No.</span>
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex-1">Name</span>
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex-shrink-0 w-16 text-right">Action</span>
                      </div>

                      {selectedTenant.studentIds.map((sid) => {
                        const name = getStudentName(sid);
                        return (
                          <div
                            key={sid}
                            className="flex items-center px-5 py-3.5 hover:bg-gray-800/50 transition-colors gap-4"
                          >
                            <span className="font-mono text-sm tracking-widest text-gray-300 w-36 flex-shrink-0 truncate">{sid}</span>
                            <span className="text-sm text-gray-400 flex-1 min-w-0 truncate">
                              {name ? name : <span className="text-gray-600 italic text-xs">No name</span>}
                            </span>
                            <button
                              onClick={() => handleRemoveStudent(sid)}
                              className="flex-shrink-0 text-xs font-bold text-red-400 border border-red-500/30 bg-red-500/10 px-3 py-1.5 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                            >
                              Remove
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
};

export default TenantManager;