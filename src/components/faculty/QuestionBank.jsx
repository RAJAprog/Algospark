
import React, { useState, useEffect, useCallback, useMemo } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  collection, getDocs, addDoc, doc, updateDoc, deleteDoc,
  query, orderBy, serverTimestamp
} from "firebase/firestore";
import { db } from "../../firebase/config";

const DIFFICULTIES = ["Easy", "Medium", "Hard"];
const diffColor = {
  Easy:   "bg-green-500/10 text-green-400 border-green-500/30",
  Medium: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
  Hard:   "bg-red-500/10 text-red-400 border-red-500/30",
};

const EMPTY_CQ  = { 
  title: "", 
  difficulty: "Easy", 
  tags: "", 
  description: "",
  marks: 100,
  timeLimitMs: 2000, 
  memoryLimitKb: 128000,
  testCases: [{ input: "", expectedOutput: "", isHidden: false }],
  codeSetup: {
    python: { visibleCode: "def solve(args):\n    pass\n", hiddenDriverCode: "import sys\n# Hidden execution logic" },
    java: { visibleCode: "class Solution {\n    public void solve() {\n    }\n}", hiddenDriverCode: "public class Main {\n    public static void main(String[] args) {\n        // Hidden logic\n    }\n}" },
    javascript: { visibleCode: "function solve(args) {\n\n}", hiddenDriverCode: "const fs = require('fs');\n// Hidden logic" },
    cpp: { visibleCode: "void solve() {\n\n}", hiddenDriverCode: "int main() {\n    // Hidden logic\n    return 0;\n}" },
    c: { visibleCode: "void solve() {\n\n}", hiddenDriverCode: "int main() {\n    // Hidden logic\n    return 0;\n}" }
  }
};

const EMPTY_MCQ = { 
  question: "", 
  options: ["", "", "", ""], 
  correctIndex: 0, 
  explanation: "",
  marks: 100
};

const quillModules = {
  toolbar: [
    ['bold', 'italic', 'underline', 'code'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['code-block'],
    ['image'],
  ],
};

export const QuestionBank = ({ onClose }) => {
  const [activeTab, setActiveTab]     = useState("Coding Questions");
  const [questions, setQuestions]     = useState([]);
  const [isLoading, setIsLoading]     = useState(false);
  const [search, setSearch]           = useState("");
  const [diffFilter, setDiffFilter]   = useState("All");

  const [showCQForm, setShowCQForm]   = useState(false);
  const [showMCQForm, setShowMCQForm] = useState(false);
  const [editCQ, setEditCQ]           = useState(null);
  const [editMCQ, setEditMCQ]         = useState(null);
  const [cqForm, setCqForm]           = useState(EMPTY_CQ);
  const [mcqForm, setMcqForm]         = useState(EMPTY_MCQ);

  // NEW: Topic folder state
  const [selectedTopic, setSelectedTopic] = useState(null);

  const fetchAll = useCallback(async () => {
    setIsLoading(true);
    try {
      const snap = await getDocs(query(collection(db, "questions"), orderBy("createdAt", "desc")));
      setQuestions(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (e) { console.error(e); }
    setIsLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // Reset selected topic when tab changes
  useEffect(() => { setSelectedTopic(null); }, [activeTab]);

  const saveCQ = async () => {
    if (!cqForm.title.trim()) { alert("Title required"); return; }
    if (cqForm.testCases.length === 0 || !cqForm.testCases[0].input) { alert("At least one test case required."); return; }
    try {
      const payload = { ...cqForm, type: "CODING", moduleType: "Coding" };
      if (editCQ) {
        await updateDoc(doc(db, "questions", editCQ.id), { ...payload, updatedAt: serverTimestamp() });
      } else {
        await addDoc(collection(db, "questions"), { ...payload, createdAt: serverTimestamp() });
      }
      setShowCQForm(false); setEditCQ(null); fetchAll();
    } catch (e) { alert("Save failed: " + e.message); }
  };

  const deleteItem = async (id, title) => {
    if (!window.confirm(`Are you sure you want to completely delete "${title}" from the database? This action cannot be undone.`)) return;
    try {
      await deleteDoc(doc(db, "questions", id)); 
      fetchAll(); 
    } catch (error) { 
      console.error("Failed to completely delete question:", error);
      alert("Delete failed."); 
    }
  };

  const saveMCQ = async () => {
    if (!mcqForm.question.trim()) { alert("Question required"); return; }
    if (mcqForm.options.some((o) => !o.trim())) { alert("All 4 options required"); return; }
    try {
      const payload = { ...mcqForm, type: "MCQ", moduleType: activeTab === "Non-Tech MCQs" ? "Non-Tech MCQs" : "Tech MCQs" };
      if (editMCQ) {
        await updateDoc(doc(db, "questions", editMCQ.id), { ...payload, updatedAt: serverTimestamp() });
      } else {
        await addDoc(collection(db, "questions"), { ...payload, createdAt: serverTimestamp() });
      }
      setShowMCQForm(false); setEditMCQ(null); fetchAll();
    } catch (e) { alert("Save failed: " + e.message); }
  };

  const setMcqOption = (i, val) => {
    const opts = [...mcqForm.options]; opts[i] = val;
    setMcqForm({ ...mcqForm, options: opts });
  };

  // All questions filtered by tab only (no topic filter here)
  const tabFilteredQs = questions.filter((q) => {
    if (q.scope === "learning_module") return false;
    if (activeTab === "Coding Questions") return q.type === "CODING" || q.moduleType === "Coding";
    if (activeTab === "MCQs")            return q.type === "MCQ" && q.moduleType !== "Non-Tech MCQs";
    if (activeTab === "Non-Tech MCQs")   return q.type === "MCQ" && q.moduleType === "Non-Tech MCQs";
    return false;
  });

  // NEW: Extract unique topics from tab-filtered questions
  const topics = useMemo(() => {
    const topicSet = [...new Set(tabFilteredQs.map(q => q.category || "Uncategorized"))];
    return topicSet.sort();
  }, [tabFilteredQs]);

  // Questions inside selected topic, with search + diff filter applied
  const visibleQs = useMemo(() => {
    if (!selectedTopic) return [];
    return tabFilteredQs.filter((q) => {
      const topic = q.category || "Uncategorized";
      if (topic !== selectedTopic) return false;
      const m = (q.title || q.question || "").toLowerCase().includes(search.toLowerCase()) || (q.tags || "").toLowerCase().includes(search.toLowerCase());
      const d = diffFilter === "All" || q.difficulty === diffFilter;
      return m && d;
    });
  }, [tabFilteredQs, selectedTopic, search, diffFilter]);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="space-y-5 animate-in fade-in duration-300">

          {/* Header */}
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="text-xs font-bold text-pink-400 border border-pink-500/40 px-3 py-1.5 rounded-lg bg-pink-500/10 hover:bg-pink-500/20">
              ← Back
            </button>
            <div>
              <h2 className="text-xl font-black">📦 Question Bank</h2>
              <p className="text-xs text-gray-500">Global question repository — coding and MCQs</p>
            </div>
          </div>

          {/* Tab Switcher */}
          <div className="flex bg-gray-800 p-1 rounded-2xl border border-gray-700 w-fit">
            {["Coding Questions", "MCQs", "Non-Tech MCQs"].map(tab => (
              <button key={tab} onClick={() => { setActiveTab(tab); setShowCQForm(false); setShowMCQForm(false); }}
                className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${activeTab === tab ? "bg-blue-600 text-white" : "text-gray-500 hover:text-white"}`}>
                {tab === "Coding Questions" ? "💻 " : tab === "MCQs" ? "🧠 " : "📚 "}{tab}
              </button>
            ))}
          </div>

          {/* Search + Filter + Add — only show when inside a topic */}
          {selectedTopic && (
            <div className="flex gap-3">
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search questions or tags..." 
                className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500" />
              
              {activeTab === "Coding Questions" && (
                <div className="flex bg-gray-800 p-1 rounded-xl border border-gray-700">
                  {["All", ...DIFFICULTIES].map((d) => (
                    <button key={d} onClick={() => setDiffFilter(d)} 
                      className={`px-3 py-1.5 text-[10px] font-black rounded-lg transition-all ${diffFilter === d ? "bg-blue-600 text-white" : "text-gray-500 hover:text-white"}`}>
                      {d}
                    </button>
                  ))}
                </div>
              )}

              <button onClick={() => {
                  if (activeTab === "Coding Questions") { setCqForm(EMPTY_CQ); setEditCQ(null); setShowCQForm(true); setShowMCQForm(false); }
                  else { setMcqForm(EMPTY_MCQ); setEditMCQ(null); setShowMCQForm(true); setShowCQForm(false); }
                }}
                className={`px-5 py-2 rounded-xl text-xs font-black transition-all active:scale-95 ${activeTab === "Coding Questions" ? "bg-green-600 hover:bg-green-500" : "bg-purple-600 hover:bg-purple-500"}`}>
                + Add Question
              </button>
            </div>
          )}

          {/* Add button on folder view */}
          {!selectedTopic && (
            <div className="flex justify-end">
              <button onClick={() => {
                  if (activeTab === "Coding Questions") { setCqForm(EMPTY_CQ); setEditCQ(null); setShowCQForm(true); setShowMCQForm(false); }
                  else { setMcqForm(EMPTY_MCQ); setEditMCQ(null); setShowMCQForm(true); setShowCQForm(false); }
                }}
                className={`px-5 py-2 rounded-xl text-xs font-black transition-all active:scale-95 ${activeTab === "Coding Questions" ? "bg-green-600 hover:bg-green-500" : "bg-purple-600 hover:bg-purple-500"}`}>
                + Add Question
              </button>
            </div>
          )}

          {/* Forms */}
          {showCQForm && activeTab === "Coding Questions" && <CQForm form={cqForm} setForm={setCqForm} isEdit={!!editCQ} onSave={saveCQ} onCancel={() => setShowCQForm(false)} />}
          {showMCQForm && activeTab !== "Coding Questions" && <MCQForm form={mcqForm} setForm={setMcqForm} setOption={setMcqOption} isEdit={!!editMCQ} onSave={saveMCQ} onCancel={() => setShowMCQForm(false)} />}

          {/* TOPIC FOLDER VIEW */}
          {!selectedTopic && !showCQForm && !showMCQForm && (
            isLoading ? (
              <div className="flex justify-center py-10">
                <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : topics.length === 0 ? (
              <div className="text-center text-gray-500 py-10 text-sm">No questions found in {activeTab}.</div>
            ) : (
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
                  {topics.length} Topic{topics.length !== 1 ? "s" : ""} — click to open
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {topics.map(topic => {
                    const topicQs = tabFilteredQs.filter(q => (q.category || "Uncategorized") === topic);
                    const easyCount   = topicQs.filter(q => q.difficulty === "Easy").length;
                    const mediumCount = topicQs.filter(q => q.difficulty === "Medium").length;
                    const hardCount   = topicQs.filter(q => q.difficulty === "Hard").length;

                    return (
                      <div
                        key={topic}
                        onClick={() => setSelectedTopic(topic)}
                        className="bg-gray-800 border border-gray-700 hover:border-blue-500 rounded-2xl p-5 cursor-pointer transition-all hover:bg-gray-800/80 group"
                      >
                        <div className="flex items-start gap-4">
                          <div className="text-3xl group-hover:scale-110 transition-transform">📁</div>
                          <div className="flex-1 min-w-0">
                            <p className="font-black text-white text-base truncate group-hover:text-blue-400 transition-colors">{topic}</p>
                            <p className="text-xs text-gray-500 mt-1">{topicQs.length} question{topicQs.length !== 1 ? "s" : ""}</p>
                            {/* Difficulty breakdown */}
                            <div className="flex gap-2 mt-3 flex-wrap">
                              {easyCount > 0 && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded border bg-green-500/10 text-green-400 border-green-500/30">
                                  {easyCount} Easy
                                </span>
                              )}
                              {mediumCount > 0 && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded border bg-yellow-500/10 text-yellow-400 border-yellow-500/30">
                                  {mediumCount} Medium
                                </span>
                              )}
                              {hardCount > 0 && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded border bg-red-500/10 text-red-400 border-red-500/30">
                                  {hardCount} Hard
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )
          )}

          {/* QUESTIONS INSIDE TOPIC */}
          {selectedTopic && !showCQForm && !showMCQForm && (
            <div className="space-y-3">
              {/* Breadcrumb / back to folders */}
              <div className="flex items-center gap-3 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3">
                <button
                  onClick={() => { setSelectedTopic(null); setSearch(""); setDiffFilter("All"); }}
                  className="text-xs font-bold text-blue-400 border border-blue-500/40 px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 transition-all"
                >
                  ← All Topics
                </button>
                <span className="text-gray-600">›</span>
                <div className="flex items-center gap-2">
                  <span className="text-base">📂</span>
                  <span className="text-sm font-black text-white">{selectedTopic}</span>
                  <span className="text-xs text-gray-500 ml-1">({visibleQs.length} questions)</span>
                </div>
              </div>

              {isLoading ? (
                <div className="flex justify-center py-10">
                  <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : visibleQs.length === 0 ? (
                <div className="text-center text-gray-500 py-10 text-sm">No questions found in "{selectedTopic}".</div>
              ) : (
                visibleQs.map((q, i) => (
                  <div key={q.id} className="bg-gray-800 border border-gray-700 rounded-2xl p-4 flex items-start justify-between gap-4 hover:border-gray-600 transition-all">
                    <div className="flex items-start gap-3 flex-1">
                      <span className="text-xs font-black text-gray-600 mt-1 min-w-[20px]">#{i + 1}</span>
                      <div className="flex-1">
                        <div className="text-sm font-bold text-white">{q.title || q.question}</div>
                        <div className="flex gap-2 mt-2 flex-wrap items-center">
                          {q.difficulty && <span className={`text-[10px] font-black px-2 py-0.5 rounded border ${diffColor[q.difficulty]}`}>{q.difficulty}</span>}
                          {q.marks && <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/30 font-bold">{q.marks} pts</span>}
                          {q.tags && q.tags.split(",").map((t) => <span key={t} className="text-[10px] bg-gray-700 text-gray-400 px-2 py-0.5 rounded">{t.trim()}</span>)}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button onClick={() => { 
                        if (activeTab === "Coding Questions") { 
                          setCqForm({ ...EMPTY_CQ, ...q }); 
                          setEditCQ(q); 
                          setShowCQForm(true); 
                          setShowMCQForm(false); 
                        } else { 
                          setMcqForm({ ...EMPTY_MCQ, ...q }); 
                          setEditMCQ(q); 
                          setShowMCQForm(true); 
                          setShowCQForm(false); 
                        }
                      }} className="text-xs bg-gray-700 hover:bg-gray-600 px-3 py-1.5 rounded-lg font-bold">
                        Edit
                      </button>
                      <button onClick={() => deleteItem(q.id, q.title || q.question)} 
                        className="text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1.5 rounded-lg font-bold">
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

/* ── CODING QUESTION FORM ── */
const CQForm = ({ form, setForm, isEdit, onSave, onCancel }) => {
  const [innerTab, setInnerTab] = useState("basic");
  const [activeLang, setActiveLang] = useState("python");

  const handleTestCaseChange = (index, field, value) => {
    const newTests = [...form.testCases];
    newTests[index][field] = value;
    setForm({ ...form, testCases: newTests });
  };

  const handleCodeChange = (lang, field, value) => {
    setForm({
      ...form, 
      codeSetup: { ...form.codeSetup, [lang]: { ...form.codeSetup[lang], [field]: value } }
    });
  };

  return (
    <div className="bg-gray-800 border border-blue-500/40 rounded-2xl p-5 space-y-4 shadow-xl">
      <div className="flex justify-between items-center border-b border-gray-700 pb-3">
        <div className="text-sm font-black text-blue-400 uppercase tracking-widest">{isEdit ? "Edit Question" : "New Coding Question"}</div>
        <div className="flex gap-2">
          {["basic", "tests", "code"].map(t => (
            <button key={t} onClick={() => setInnerTab(t)} 
              className={`px-3 py-1 text-xs font-bold rounded-lg ${innerTab === t ? "bg-blue-600 text-white" : "bg-gray-900 text-gray-400 hover:bg-gray-700"}`}>
              {t === "basic" ? "1. Details" : t === "tests" ? "2. Test Cases" : "3. Boilerplate"}
            </button>
          ))}
        </div>
      </div>

      {innerTab === "basic" && (
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="text-[10px] text-gray-500 uppercase font-bold mb-1 block">Title *</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} 
              placeholder="e.g. Two Sum" 
              className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500" />
          </div>

          <div className="col-span-2">
            <label className="text-[10px] text-gray-500 uppercase font-bold mb-1 block">Topic / Category</label>
            <input value={form.category || ""} onChange={(e) => setForm({ ...form, category: e.target.value })} 
              placeholder="e.g. Arrays, Dynamic Programming, Trees" 
              className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500" />
          </div>

          <div>
            <label className="text-[10px] text-gray-500 uppercase font-bold mb-1 block">Marks *</label>
            <input type="number" value={form.marks || 100} onChange={(e) => setForm({ ...form, marks: parseInt(e.target.value) })} 
              min="1" className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500" />
          </div>

          <div>
            <label className="text-[10px] text-gray-500 uppercase font-bold mb-1 block">Difficulty</label>
            <div className="flex gap-2">
              {["Easy", "Medium", "Hard"].map((d) => (
                <button key={d} onClick={() => setForm({ ...form, difficulty: d })} 
                  className={`flex-1 py-2 rounded-xl text-xs font-black border transition-all ${form.difficulty === d ? diffColor[d] + " border" : "bg-gray-900 border-gray-700 text-gray-500"}`}>
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div className="col-span-2">
            <label className="text-[10px] text-gray-500 uppercase font-bold mb-1 block">Tags (comma separated)</label>
            <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} 
              placeholder="arrays, loops, dp" 
              className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500" />
          </div>

          <div className="col-span-2">
            <label className="text-[10px] text-gray-500 uppercase font-bold mb-2 block">Problem Description *</label>
            <div className="bg-white rounded">
              <ReactQuill 
                theme="snow" 
                value={form.description} 
                onChange={(value) => setForm({ ...form, description: value })}
                modules={quillModules}
                className="text-black"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] text-gray-500 uppercase font-bold mb-1 block">Time Limit (ms)</label>
            <input type="number" value={form.timeLimitMs} onChange={(e) => setForm({ ...form, timeLimitMs: parseInt(e.target.value) })} 
              className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2 text-sm outline-none focus:border-blue-500" />
          </div>
        </div>
      )}

      {innerTab === "tests" && (
        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
          <p className="text-xs text-gray-400">Add test cases. Hidden test cases are used for final scoring during exams.</p>
          {form.testCases.map((tc, i) => (
            <div key={i} className="bg-gray-900 p-4 rounded-xl border border-gray-700 relative">
              <div className="absolute top-2 right-2 flex items-center gap-3">
                <label className="text-xs text-gray-400 flex items-center gap-1 cursor-pointer">
                  <input type="checkbox" checked={tc.isHidden} onChange={(e) => handleTestCaseChange(i, "isHidden", e.target.checked)} /> 
                  Hidden from student
                </label>
                <button onClick={() => setForm({ ...form, testCases: form.testCases.filter((_, idx) => idx !== i) })} 
                  className="text-red-400 hover:text-red-300 text-xs font-bold">✕ Remove</button>
              </div>
              <p className="text-[10px] font-black text-gray-500 uppercase mb-2">Test Case {i + 1}</p>
              <div className="grid grid-cols-2 gap-3 mt-4">
                <textarea value={tc.input} onChange={e => handleTestCaseChange(i, "input", e.target.value)} 
                  placeholder="Input data (e.g. 2\n3)" rows={3} 
                  className="bg-gray-800 border border-gray-600 rounded-lg p-2 text-xs font-mono text-gray-300 outline-none focus:border-blue-500 resize-y" />
                <textarea value={tc.expectedOutput} onChange={e => handleTestCaseChange(i, "expectedOutput", e.target.value)} 
                  placeholder="Expected Output (e.g. 5)" rows={3} 
                  className="bg-gray-800 border border-gray-600 rounded-lg p-2 text-xs font-mono text-gray-300 outline-none focus:border-blue-500 resize-y" />
              </div>
            </div>
          ))}
          <button onClick={() => setForm({ ...form, testCases: [...form.testCases, { input: "", expectedOutput: "", isHidden: true }] })} 
            className="w-full py-2 border-2 border-dashed border-gray-600 text-gray-400 rounded-xl hover:border-blue-500 hover:text-blue-400 font-bold text-xs transition-colors">
            + Add Another Test Case
          </button>
        </div>
      )}

      {innerTab === "code" && (
        <div className="space-y-4">
          <p className="text-xs text-gray-400">Setup the function signatures and hidden driver code to evaluate the test cases securely.</p>
          <div className="flex gap-2">
            {["python", "java", "cpp", "javascript", "c"].map(lang => (
              <button key={lang} onClick={() => setActiveLang(lang)} 
                className={`px-3 py-1.5 text-xs font-bold rounded-lg border ${activeLang === lang ? "bg-blue-600 border-blue-500 text-white" : "bg-gray-900 border-gray-700 text-gray-400"}`}>
                {lang.toUpperCase()}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] text-green-400 uppercase font-bold mb-1 block flex items-center justify-between">
                Visible Code (Student sees this)
                <span className="text-gray-500 font-normal lowercase">What they edit</span>
              </label>
              <textarea 
                value={form.codeSetup[activeLang].visibleCode} 
                onChange={(e) => handleCodeChange(activeLang, "visibleCode", e.target.value)} 
                rows={10} 
                className="w-full bg-[#0d1117] border border-gray-600 rounded-xl p-3 text-xs font-mono text-gray-200 outline-none focus:border-green-500" 
              />
            </div>
            <div>
              <label className="text-[10px] text-red-400 uppercase font-bold mb-1 block flex items-center justify-between">
                Hidden Driver Code (Execution logic)
                <span className="text-gray-500 font-normal lowercase">Appended at runtime</span>
              </label>
              <textarea 
                value={form.codeSetup[activeLang].hiddenDriverCode} 
                onChange={(e) => handleCodeChange(activeLang, "hiddenDriverCode", e.target.value)} 
                rows={10} 
                className="w-full bg-[#0d1117] border border-gray-600 rounded-xl p-3 text-xs font-mono text-gray-200 outline-none focus:border-red-500" 
              />
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-3 justify-end pt-4 border-t border-gray-700">
        <button onClick={onCancel} className="px-5 py-2 rounded-xl text-xs font-black bg-gray-700 hover:bg-gray-600 transition-all">
          Cancel
        </button>
        <button onClick={onSave} className="px-6 py-2 rounded-xl text-xs font-black bg-blue-600 hover:bg-blue-500 transition-all">
          {isEdit ? "Save Changes" : "Create Question"}
        </button>
      </div>
    </div>
  );
};

/* ── MCQ FORM ── */
const MCQForm = ({ form, setForm, setOption, isEdit, onSave, onCancel }) => (
  <div className="bg-gray-800 border border-purple-500/40 rounded-2xl p-5 space-y-4 shadow-xl">
    <div className="text-sm font-black text-purple-400 uppercase tracking-widest">{isEdit ? "Edit MCQ" : "New MCQ"}</div>
    
    <div>
      <label className="text-[10px] text-gray-500 uppercase font-bold mb-1 block">Topic / Category</label>
      <input value={form.category || ""} onChange={(e) => setForm({ ...form, category: e.target.value })} 
        placeholder="e.g. OOPS, Aptitude, Verbal" 
        className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-purple-500" />
    </div>

    <div>
      <label className="text-[10px] text-gray-500 uppercase font-bold mb-2 block">Question *</label>
      <div className="bg-white rounded">
        <ReactQuill 
          theme="snow" 
          value={form.question} 
          onChange={(value) => setForm({ ...form, question: value })}
          modules={quillModules}
          className="text-black"
        />
      </div>
    </div>

    <div>
      <label className="text-[10px] text-gray-500 uppercase font-bold mb-1 block">Marks *</label>
      <input type="number" value={form.marks || 100} onChange={(e) => setForm({ ...form, marks: parseInt(e.target.value) })} 
        min="1" className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-purple-500" />
    </div>

    <div>
      <label className="text-[10px] text-gray-500 uppercase font-bold mb-2 block">Options — click radio to mark correct answer</label>
      <div className="space-y-2">
        {form.options.map((opt, i) => (
          <div key={i} className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all ${form.correctIndex === i ? "border-green-500/50 bg-green-500/5" : "border-gray-700"}`}>
            <button type="button" onClick={() => setForm({ ...form, correctIndex: i })} 
              className={`w-5 h-5 rounded-full border-2 flex-shrink-0 transition-all ${form.correctIndex === i ? "border-green-500 bg-green-500" : "border-gray-500"}`} />
            <input value={opt} onChange={(e) => setOption(i, e.target.value)} 
              placeholder={`Option ${String.fromCharCode(65 + i)}`} 
              className="flex-1 bg-transparent outline-none text-sm" />
          </div>
        ))}
      </div>
    </div>

    <div>
      <label className="text-[10px] text-gray-500 uppercase font-bold mb-1 block">Explanation (Optional)</label>
      <textarea value={form.explanation} onChange={(e) => setForm({ ...form, explanation: e.target.value })} 
        rows={2} className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-purple-500 resize-none" />
    </div>

    <div className="flex gap-3 justify-end pt-2">
      <button onClick={onCancel} className="px-5 py-2 rounded-xl text-xs font-black bg-gray-700 hover:bg-gray-600 transition-all">
        Cancel
      </button>
      <button onClick={onSave} className="px-6 py-2 rounded-xl text-xs font-black bg-purple-600 hover:bg-purple-500 transition-all">
        {isEdit ? "Save Changes" : "Add MCQ"}
      </button>
    </div>
  </div>
);