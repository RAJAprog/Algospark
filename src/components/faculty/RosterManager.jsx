import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';

const RosterManager = ({ exam, onSave, tenants }) => {
    const [roster, setRoster] = useState([]);
    const [selectedColleges, setSelectedColleges] = useState([]);
    const [newStudentId, setNewStudentId] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        setRoster(exam?.registeredStudents || []);
        setSelectedColleges(exam?.assignedColleges || []);
    }, [exam]);

    // --- College Selection Logic ---
    const handleCollegeToggle = async (college) => {
        const isAlreadySelected = selectedColleges.includes(college.name);
        let updatedColleges;
        let updatedRoster = [...roster];

        if (isAlreadySelected) {
            // Remove college and its students
            updatedColleges = selectedColleges.filter(c => c !== college.name);
            updatedRoster = updatedRoster.filter(id => !college.studentIds.includes(id));
        } else {
            // Add college and its students
            updatedColleges = [...selectedColleges, college.name];
            const newStudents = college.studentIds || [];
            // Merge without duplicates
            updatedRoster = Array.from(new Set([...updatedRoster, ...newStudents]));
        }

        setSelectedColleges(updatedColleges);
        setRoster(updatedRoster);
    };

    // --- Manual Entry Logic ---
    const handleAddStudent = () => {
        const id = newStudentId.trim().toUpperCase();
        if (id && !roster.includes(id)) {
            setRoster([...roster, id]);
            setNewStudentId('');
        } else {
            alert("ID is empty or already in the roster.");
        }
    };

    // --- XLSX Parsing Logic ---
    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsUploading(true);
        const reader = new FileReader();

        reader.onload = (evt) => {
            try {
                const bstr = evt.target.result;
                const wb = XLSX.read(bstr, { type: 'binary' });
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                const data = XLSX.utils.sheet_to_json(ws);

                const extractedIds = data
                    .map(row => (row.regNo || row.id || row.studentId || row.ID)?.toString().trim().toUpperCase())
                    .filter(id => id);

                if (extractedIds.length === 0) {
                    alert("No valid IDs found. Ensure column header is 'regNo' or 'id'.");
                } else {
                    const uniqueRoster = Array.from(new Set([...roster, ...extractedIds]));
                    setRoster(uniqueRoster);
                    alert(`Imported ${extractedIds.length} students!`);
                }
            } catch (err) {
                alert("Failed to parse Excel file.");
            } finally {
                setIsUploading(false);
                e.target.value = null;
            }
        };
        reader.readAsBinaryString(file);
    };

    const handleRemoveStudent = (idToRemove) => {
        setRoster(roster.filter(id => id !== idToRemove));
    };

    const handleSaveRoster = async () => {
        setIsSaving(true);
        try {
            // We pass the updated student list AND the assigned college list
            await onSave(exam.id, {
                registeredStudents: roster,
                assignedColleges: selectedColleges
            });
            alert("Roster and College permissions updated!");
        } catch (error) {
            alert("Error updating roster.");
        } finally {
            setIsSaving(false);
        }
    };

    if (!exam) return <div className="text-gray-400 p-8 text-center border border-dashed border-gray-700 rounded-xl">Select an exam to manage.</div>;

    return (
        <div className="bg-[#0f172a] p-6 rounded-xl border border-slate-800 shadow-2xl font-serif">
            <div className="mb-6">
                <h2 className="text-xl font-black text-white uppercase tracking-tight">Roster Manager</h2>
                <p className="text-slate-500 text-sm">{exam.title}</p>
            </div>

            {/* --- College Selection Dropdown/Checkboxes --- */}
            <div className="mb-6 p-4 bg-slate-900/50 border border-slate-800 rounded-lg">
                <label className="text-[10px] font-black text-slate-500 uppercase mb-3 block tracking-widest">Assign Entire Colleges</label>
                <div className="flex flex-wrap gap-3">
                    {tenants && tenants.map(college => (
                        <label key={college.id} className={`flex items-center gap-2 px-3 py-2 rounded-md border transition-all cursor-pointer ${selectedColleges.includes(college.name) ? 'bg-blue-600/20 border-blue-500 text-blue-400' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>
                            <input 
                                type="checkbox" 
                                className="hidden"
                                checked={selectedColleges.includes(college.name)}
                                onChange={() => handleCollegeToggle(college)}
                            />
                            <span className="text-xs font-bold">{college.name}</span>
                            <span className="text-[10px] opacity-60">({college.studentIds?.length || 0})</span>
                        </label>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left: Input Methods */}
                <div>
                    <div className="mb-4">
                        <label className="text-[10px] font-black text-slate-500 uppercase mb-2 block">Manual Add (Reg. No)</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newStudentId}
                                onChange={(e) => setNewStudentId(e.target.value)}
                                placeholder="221FA..."
                                className="flex-grow bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-white text-sm outline-none focus:border-blue-500"
                            />
                            <button onClick={handleAddStudent} className="bg-slate-700 text-white px-4 rounded-md font-bold text-xs">Add</button>
                        </div>
                    </div>

                    <div className="p-4 border-2 border-dashed border-slate-800 rounded-lg text-center bg-slate-900/30">
                        <p className="text-xs text-slate-400 mb-2">Bulk upload students via XLSX</p>
                        <input type="file" id="bulk-id" className="hidden" accept=".xlsx,.xls" onChange={handleFileUpload} />
                        <label htmlFor="bulk-id" className="inline-block bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black px-4 py-2 rounded cursor-pointer uppercase">
                            {isUploading ? 'Uploading...' : 'Choose File'}
                        </label>
                    </div>
                </div>

                {/* Right: Roster Preview */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-lg flex flex-col">
                    <div className="p-3 border-bottom border-slate-800 flex justify-between items-center">
                        <span className="text-[10px] font-black text-slate-500 uppercase">Final Whitelist</span>
                        <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">{roster.length} Total</span>
                    </div>
                    <div className="flex-grow max-h-48 overflow-y-auto p-2">
                        {roster.length > 0 ? roster.map(id => (
                            <div key={id} className="flex justify-between items-center bg-slate-800/40 p-2 rounded mb-1 border border-slate-800/50">
                                <span className="text-xs font-mono text-slate-300">{id}</span>
                                <button onClick={() => handleRemoveStudent(id)} className="text-slate-600 hover:text-red-500 text-xs">✕</button>
                            </div>
                        )) : <p className="text-center text-slate-600 text-xs py-8">Roster is empty</p>}
                    </div>
                </div>
            </div>

            <button
                onClick={handleSaveRoster}
                disabled={isSaving}
                className="w-full mt-6 bg-blue-600 hover:bg-blue-500 text-white font-black py-3 rounded-lg text-sm uppercase tracking-widest shadow-lg transition-all disabled:bg-slate-700"
            >
                {isSaving ? 'Updating Registry...' : 'Save & Grant Access'}
            </button>
        </div>
    );
};

export default RosterManager;