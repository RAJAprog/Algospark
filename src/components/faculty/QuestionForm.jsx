

// ============================================================
// src/components/faculty/QuestionForm.jsx
//
// KEY CHANGES vs original:
//   1. Added "Method Name" field for CODING questions.
//      This is auto-generated from the title (camelCase) but
//      faculty can override it manually.
//   2. Added "Visible / Hidden" toggle per test case.
//      First 3 are visible by default, rest hidden like LeetCode.
//   3. Boilerplates are AUTO-GENERATED from methodName —
//      faculty no longer manually types them. They can still
//      edit them if needed.
//   4. On save, ALL required fields (methodName, boilerplates,
//      testCases with isHidden flags) are persisted to Firestore.
//   5. onSubmit receives the complete question object ready for
//      Firestore — no manual schema updates ever needed again.
// ============================================================

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase/config';

// ── Language config ───────────────────────────────────────────
const LANGUAGES = [
  { id: "python",     label: "Python",     judge0Id: 71 },
  { id: "javascript", label: "JavaScript", judge0Id: 93 },
  { id: "java",       label: "Java",       judge0Id: 62 },
  { id: "c",          label: "C",          judge0Id: 50 },
  { id: "cpp",        label: "C++",        judge0Id: 54 },
];

const MODULE_TYPE_CONFIG = {
  "Coding":        { color: "#3b82f6", icon: "💻" },
  "Tech MCQs":     { color: "#10b981", icon: "🔬" },
  "Non-Tech MCQs": { color: "#f59e0b", icon: "📚" },
};

// ── Auto-generate camelCase methodName from title ─────────────
function titleToMethodName(title) {
  if (!title) return '';
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
    .split(/\s+/)
    .map((word, i) => i === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

// ── Auto-generate boilerplates from methodName ────────────────
function generateBoilerplates(methodName) {
  const m = methodName || 'solution';
  return {
    python: `class Solution:
    def ${m}(self, nums: list, target: int):
        # Write your solution here
        pass`,

    javascript: `class Solution {
    ${m}(nums, target) {
        // Write your solution here
    }
}`,

    java: `class Solution {
    public Object ${m}(int[] nums, int target) {
        // Write your solution here
        return null;
    }
}`,

    cpp: `class Solution {
public:
    auto ${m}(std::vector<int>& nums, int target) {
        // Write your solution here
    }
};`,

    c: `// Write your solution here
// Function signature depends on the problem
int* ${m}(int* nums, int numsSize, int target, int* returnSize) {
    *returnSize = 0;
    return NULL;
}`,
  };
}

// ── Quill config ──────────────────────────────────────────────
const quillModules = {
  toolbar: [
    ['bold', 'italic', 'underline', 'code'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['code-block'],
    ['image'],
  ],
};

const inp = "mt-1 w-full bg-gray-700 border border-gray-600 rounded-lg py-2.5 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm";
const typeBtn = (active, color = '#3b82f6') => ({
  padding: '0.5rem 1.2rem', borderRadius: '0.6rem', fontWeight: 800, fontSize: '0.8rem',
  border: `1px solid ${active ? color : '#334155'}`,
  background: active ? `${color}18` : 'transparent',
  color: active ? color : '#64748b', cursor: 'pointer', transition: 'all .15s',
});

// ── Boilerplate editor ────────────────────────────────────────
function BoilerplateEditor({ boilerplates, onChange, timeLimitMs, onTimeLimitChange, methodName }) {
  const [activeLang, setActiveLang] = useState('python');

  // Auto-regenerate when methodName changes (only if not manually edited)
  const handleRegenerate = () => {
    onChange(generateBoilerplates(methodName));
  };

  return (
    <div style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid #334155', borderRadius: '0.875rem', overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', borderBottom: '1px solid #1e293b', background: 'rgba(30,41,59,.5)' }}>
        <div>
          <p style={{ fontSize: '0.7rem', fontWeight: 900, color: '#60a5fa', letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0 }}>
            ⚙️ Starter Code (Boilerplate)
          </p>
          <p style={{ fontSize: '0.62rem', color: '#475569', margin: '0.15rem 0 0' }}>
            Auto-generated from Method Name. Students see this pre-loaded in the editor.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>⏱ Time Limit (ms)</span>
            <input
              type="number" min={500} max={30000} step={500} value={timeLimitMs}
              onChange={e => onTimeLimitChange(Number(e.target.value))}
              style={{ width: 72, background: '#0f172a', border: '1px solid #334155', borderRadius: '0.4rem', padding: '0.25rem 0.4rem', color: '#f1f5f9', fontSize: '0.8rem', textAlign: 'center', outline: 'none' }}
            />
          </div>
          {[1000, 2000, 5000].map(ms => (
            <button key={ms} type="button" onClick={() => onTimeLimitChange(ms)}
              style={{ padding: '0.2rem 0.55rem', borderRadius: '0.35rem', fontSize: '0.65rem', fontWeight: 800, border: 'none', cursor: 'pointer', background: timeLimitMs === ms ? '#3b82f6' : '#1e293b', color: timeLimitMs === ms ? '#fff' : '#64748b' }}>
              {ms / 1000}s
            </button>
          ))}
          <button type="button" onClick={handleRegenerate}
            style={{ padding: '0.3rem 0.8rem', borderRadius: '0.4rem', fontSize: '0.65rem', fontWeight: 800, border: '1px solid #334155', cursor: 'pointer', background: 'transparent', color: '#f97316' }}>
            ↺ Regenerate
          </button>
        </div>
      </div>

      {/* Lang tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid #1e293b', background: 'rgba(15,23,42,.4)' }}>
        {LANGUAGES.map(l => (
          <button key={l.id} type="button" onClick={() => setActiveLang(l.id)}
            style={{ padding: '0.5rem 0.875rem', fontSize: '0.72rem', fontWeight: 800, border: 'none', cursor: 'pointer', transition: 'all .15s', background: activeLang === l.id ? 'rgba(59,130,246,.12)' : 'transparent', color: activeLang === l.id ? '#60a5fa' : '#64748b', borderBottom: `2px solid ${activeLang === l.id ? '#3b82f6' : 'transparent'}` }}>
            {l.label}
          </button>
        ))}
      </div>

      <textarea
        value={boilerplates[activeLang] || ''}
        onChange={e => onChange({ ...boilerplates, [activeLang]: e.target.value })}
        rows={10} spellCheck={false}
        placeholder={`Boilerplate for ${activeLang}...`}
        style={{ width: '100%', background: '#0f172a', border: 'none', padding: '0.875rem', color: '#e2e8f0', fontFamily: "'Fira Code', 'Cascadia Code', monospace", fontSize: '0.8rem', lineHeight: 1.6, resize: 'vertical', outline: 'none', boxSizing: 'border-box' }}
      />
    </div>
  );
}

// ── Test Case Row ─────────────────────────────────────────────
function TestCaseRow({ tc, index, onChange, onRemove, isLast }) {
  const isHidden = tc.isHidden || false;
  return (
    <div style={{
      background: isHidden ? 'rgba(239,68,68,.04)' : 'rgba(15,23,42,.4)',
      border: `1px solid ${isHidden ? 'rgba(239,68,68,.2)' : '#334155'}`,
      borderRadius: '0.75rem', padding: '0.875rem', marginBottom: '0.6rem',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{ fontSize: '0.7rem', fontWeight: 900, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Case {index + 1}
          </span>
          <button type="button"
            onClick={() => onChange(index, 'isHidden', !isHidden)}
            style={{
              padding: '0.2rem 0.7rem', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 800,
              border: `1px solid ${isHidden ? 'rgba(239,68,68,.4)' : 'rgba(63,185,80,.4)'}`,
              background: isHidden ? 'rgba(239,68,68,.1)' : 'rgba(63,185,80,.1)',
              color: isHidden ? '#f87171' : '#4ade80', cursor: 'pointer',
            }}>
            {isHidden ? '🔒 Hidden' : '👁 Visible'}
          </button>
          {index < 3 && !isHidden && (
            <span style={{ fontSize: '0.6rem', color: '#64748b', fontStyle: 'italic' }}>shown to student</span>
          )}
        </div>
        {!isLast && (
          <button type="button" onClick={() => onRemove(index)}
            style={{ background: 'rgba(239,68,68,.1)', border: '1px solid rgba(239,68,68,.25)', color: '#f87171', borderRadius: '0.4rem', padding: '0.2rem 0.6rem', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>
            ✕
          </button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
        <div>
          <label style={{ fontSize: '0.62rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '0.3rem' }}>
            Input (function arguments)
          </label>
          <textarea
            value={tc.input || ''}
            onChange={e => onChange(index, 'input', e.target.value)}
            rows={2} placeholder='e.g. [2,7,11,15], 9'
            style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '0.5rem', padding: '0.5rem 0.75rem', color: '#e2e8f0', fontFamily: 'monospace', fontSize: '0.8rem', resize: 'none', outline: 'none', boxSizing: 'border-box' }}
          />
          <p style={{ fontSize: '0.6rem', color: '#475569', margin: '0.2rem 0 0' }}>
            Exactly as passed to the function: args separated by commas
          </p>
        </div>
        <div>
          <label style={{ fontSize: '0.62rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '0.3rem' }}>
            Expected Output
          </label>
          <textarea
            value={tc.expectedOutput || ''}
            onChange={e => onChange(index, 'expectedOutput', e.target.value)}
            rows={2} placeholder='e.g. [0,1]'
            style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '0.5rem', padding: '0.5rem 0.75rem', color: '#e2e8f0', fontFamily: 'monospace', fontSize: '0.8rem', resize: 'none', outline: 'none', boxSizing: 'border-box' }}
          />
          <p style={{ fontSize: '0.6rem', color: '#475569', margin: '0.2rem 0 0' }}>
            Compact format: [0,1] not [0, 1] — normalised automatically
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Main QuestionForm ─────────────────────────────────────────
const QuestionForm = ({ onSubmit, categories = [], initialData = {} }) => {
  const [selectedModuleType, setSelectedModuleType] = useState('');
  const [category,     setCategory]     = useState(initialData.category || '');
  const [title,        setTitle]        = useState(initialData.title || '');
  const [methodName,   setMethodName]   = useState(initialData.methodName || '');
  const [methodEdited, setMethodEdited] = useState(false); // track if user manually changed it
  const [description,  setDescription]  = useState(initialData.description || '');
  const [type,         setType]         = useState(initialData.type || 'CODING');
  const [marks,        setMarks]        = useState(initialData.marks || 100);
  const [options,      setOptions]      = useState(initialData.options || ['', '', '', '']);
  const [correctAnswer,setCorrectAnswer]= useState(initialData.correctAnswer || '');
  const [testCases,    setTestCases]    = useState(
    initialData.testCases || [
      { input: '', expectedOutput: '', isHidden: false },
      { input: '', expectedOutput: '', isHidden: false },
      { input: '', expectedOutput: '', isHidden: false },
      { input: '', expectedOutput: '', isHidden: true  },
      { input: '', expectedOutput: '', isHidden: true  },
    ]
  );
  const [timeLimitMs,  setTimeLimitMs]  = useState(initialData.timeLimitMs || 2000);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const quillRef = useRef();

  // Auto-generate boilerplates from methodName
  const [boilerplates, setBoilerplates] = useState(
    initialData.boilerplates || generateBoilerplates(initialData.methodName || 'solution')
  );

  // When title changes, auto-update methodName (unless manually edited)
  useEffect(() => {
    if (!methodEdited && title) {
      const generated = titleToMethodName(title);
      setMethodName(generated);
      setBoilerplates(generateBoilerplates(generated));
    }
  }, [title, methodEdited]);

  // When methodName is manually changed, regenerate boilerplates
  const handleMethodNameChange = (val) => {
    setMethodName(val);
    setMethodEdited(true);
    setBoilerplates(generateBoilerplates(val));
  };

  const existingModuleTypes = useMemo(
    () => [...new Set(categories.map(c => c.moduleType).filter(mt => mt && mt !== 'Learning Module'))],
    [categories]
  );
  const filteredModules = useMemo(
    () => categories.filter(c => c.moduleType === selectedModuleType),
    [categories, selectedModuleType]
  );

  const handleModuleTypeSelect = (mt) => {
    setSelectedModuleType(mt);
    setCategory('');
    setType(mt === 'Coding' ? 'CODING' : 'MCQ');
  };

  const handleTestCaseChange = (idx, field, value) => {
    const n = [...testCases];
    n[idx] = { ...n[idx], [field]: value };
    setTestCases(n);
  };
  const addTestCase    = () => setTestCases([...testCases, { input: '', expectedOutput: '', isHidden: testCases.length >= 3 }]);
  const removeTestCase = (i) => setTestCases(testCases.filter((_, idx) => idx !== i));

  // Image upload handler for Quill
  const imageHandler = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file'; input.accept = 'image/*';
    input.click();
    input.onchange = async () => {
      const file = input.files[0];
      if (!file) return;
      const storageRef = ref(storage, `question-images/${Date.now()}_${file.name}`);
      const task = uploadBytesResumable(storageRef, file);
      task.on('state_changed',
        snap => setUploadProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100)),
        err  => console.error(err),
        async () => {
          const url = await getDownloadURL(task.snapshot.ref);
          const editor = quillRef.current?.getEditor();
          if (editor) {
            const range = editor.getSelection(true);
            editor.insertEmbed(range.index, 'image', url);
          }
          setUploadProgress(0);
        }
      );
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!category) { alert('Select a module.'); return; }
    if (!title.trim()) { alert('Enter a title.'); return; }
    if (type === 'CODING' && !methodName.trim()) { alert('Method name is required for coding questions.'); return; }
    if (type === 'CODING') {
      const filledCases = testCases.filter(tc => tc.input.trim() && tc.expectedOutput.trim());
      if (!filledCases.length) { alert('Add at least one test case with input and expected output.'); return; }
    }

    setIsSubmitting(true);
    try {
      const payload = {
        title:       title.trim(),
        description,
        category,
        type,
        marks:       Number(marks),
        // CODING-specific
        ...(type === 'CODING' && {
          methodName:   methodName.trim(),
          testCases:    testCases.filter(tc => tc.input.trim() && tc.expectedOutput.trim()),
          boilerplates,
          timeLimitMs,
        }),
        // MCQ-specific
        ...(type === 'MCQ' && {
          options,
          correctAnswer,
        }),
      };
      await onSubmit(payload);
    } catch (err) {
      alert('Save failed: ' + err.message);
    }
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-7 text-white max-w-4xl mx-auto p-6">
      <div>
        <h2 className="text-2xl font-black text-white uppercase tracking-tight">Create Question</h2>
        <p className="text-gray-500 text-sm mt-1">All fields are auto-synced — no manual Firestore edits needed.</p>
      </div>

      {/* Step 1: Module Type */}
      <div>
        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Step 1 — Module Type</p>
        {existingModuleTypes.length === 0 ? (
          <div style={{ padding: '0.875rem', background: 'rgba(239,68,68,.08)', border: '1px solid rgba(239,68,68,.2)', borderRadius: '0.75rem' }}>
            <p style={{ color: '#f87171', fontSize: '0.8rem' }}>No modules found. Create modules in <strong>Manage Modules</strong> first.</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-3">
            {existingModuleTypes.map(mt => {
              const cfg = MODULE_TYPE_CONFIG[mt] || { icon: '📦', color: '#64748b' };
              return (
                <button key={mt} type="button" onClick={() => handleModuleTypeSelect(mt)}
                  style={typeBtn(selectedModuleType === mt, cfg.color)}>
                  {cfg.icon} {mt}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Step 2: Module */}
      {selectedModuleType && (
        <div>
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Step 2 — Select Module</p>
          {filteredModules.length === 0
            ? <p style={{ color: '#6b7280', fontSize: '0.8rem' }}>No modules under {selectedModuleType} yet.</p>
            : (
              <div className="flex flex-wrap gap-2">
                {filteredModules.map(mod => (
                  <button key={mod.id} type="button" onClick={() => setCategory(mod.name)}
                    style={typeBtn(category === mod.name, '#6366f1')}>
                    {category === mod.name ? '✓ ' : ''}{mod.name}
                  </button>
                ))}
              </div>
            )}
        </div>
      )}

      {/* Step 3: Question details */}
      {category && (
        <>
          {/* Title */}
          <div>
            <label className="text-sm font-semibold text-gray-300">Question Title *</label>
            <input type="text" value={title} required onChange={e => setTitle(e.target.value)}
              placeholder="e.g., Two Sum" className={inp} />
          </div>

          {/* Method Name (CODING only) */}
          {selectedModuleType === 'Coding' && type === 'CODING' && (
            <div>
              <label className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                Method Name *
                <span style={{ fontSize: '0.65rem', background: 'rgba(59,130,246,.15)', color: '#60a5fa', padding: '1px 8px', borderRadius: '4px', fontWeight: 700 }}>
                  auto-generated from title
                </span>
              </label>
              <input type="text" value={methodName} required onChange={e => handleMethodNameChange(e.target.value)}
                placeholder="e.g. twoSum" className={inp}
                style={{ fontFamily: 'monospace' }} />
              <p style={{ fontSize: '0.65rem', color: '#64748b', marginTop: '0.25rem' }}>
                Must match the function/method name inside the Solution class exactly.
                Changing this title auto-regenerates this field and the boilerplates.
              </p>
            </div>
          )}

          {/* Description */}
          <div>
            <label className="text-sm font-semibold text-gray-300 mb-2 block">
              {selectedModuleType === 'Coding' ? 'Problem Description' : 'Question'}
            </label>
            {uploadProgress > 0 && (
              <div className="w-full bg-gray-600 h-1 mb-2 rounded">
                <div className="bg-blue-500 h-1 rounded" style={{ width: `${uploadProgress}%` }} />
              </div>
            )}
            <div className="bg-white rounded">
              <ReactQuill ref={quillRef} theme="snow" value={description} onChange={setDescription}
                modules={{ ...quillModules, toolbar: { ...quillModules.toolbar, handlers: { image: imageHandler } } }}
                className="text-black" />
            </div>
          </div>

          {/* Type + Marks */}
          <div className="flex gap-4">
            {selectedModuleType === 'Coding' && (
              <div className="flex-1">
                <label className="text-sm font-semibold text-gray-300">Type</label>
                <select value={type} onChange={e => setType(e.target.value)} className={inp}>
                  <option value="CODING">Coding</option>
                  <option value="MCQ">MCQ</option>
                </select>
              </div>
            )}
            <div className="flex-1">
              <label className="text-sm font-semibold text-gray-300">Marks</label>
              <input type="number" value={marks} min={1} onChange={e => setMarks(e.target.value)} className={inp} />
            </div>
          </div>

          {/* MCQ Options */}
          {type === 'MCQ' && (
            <div className="space-y-3 p-4 border border-gray-700 rounded-xl bg-gray-900/40">
              <h3 className="text-white font-bold text-sm uppercase tracking-widest">Answer Options</h3>
              {options.map((opt, i) => (
                <input key={i} value={opt} required onChange={e => { const n = [...options]; n[i] = e.target.value; setOptions(n); }}
                  placeholder={`Option ${i + 1}`} className={inp} />
              ))}
              <select value={correctAnswer} required onChange={e => setCorrectAnswer(e.target.value)} className={inp}>
                <option value="">Select Correct Answer</option>
                {options.map((o, i) => <option key={i} value={o}>{o || `Option ${i + 1}`}</option>)}
              </select>
            </div>
          )}

          {/* CODING: Test Cases + Boilerplates */}
          {type === 'CODING' && (
            <>
              {/* Test Cases */}
              <div style={{ background: 'rgba(15,23,42,.6)', border: '1px solid #334155', borderRadius: '1rem', padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div>
                    <h3 className="text-white font-bold text-sm uppercase tracking-widest">Test Cases</h3>
                    <p style={{ fontSize: '0.65rem', color: '#64748b', marginTop: '0.2rem' }}>
                      First 3 visible to students · toggle to hide · hidden = graded but not shown
                    </p>
                  </div>
                  <button type="button" onClick={addTestCase}
                    style={{ padding: '0.4rem 1rem', borderRadius: '0.5rem', fontSize: '0.75rem', fontWeight: 800, border: '1px solid rgba(59,130,246,.4)', background: 'rgba(59,130,246,.1)', color: '#60a5fa', cursor: 'pointer' }}>
                    + Add Case
                  </button>
                </div>

                {testCases.map((tc, i) => (
                  <TestCaseRow key={i} tc={tc} index={i} onChange={handleTestCaseChange}
                    onRemove={removeTestCase} isLast={testCases.length === 1} />
                ))}

                {/* Summary */}
                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem', padding: '0.75rem 1rem', background: 'rgba(59,130,246,.06)', border: '1px solid rgba(59,130,246,.15)', borderRadius: '0.75rem' }}>
                  {[
                    { label: 'Total Cases', val: testCases.filter(tc => tc.input.trim()).length, color: '#60a5fa' },
                    { label: 'Visible', val: testCases.filter(tc => !tc.isHidden && tc.input.trim()).length, color: '#4ade80' },
                    { label: 'Hidden', val: testCases.filter(tc => tc.isHidden && tc.input.trim()).length, color: '#f87171' },
                    { label: 'Time Limit', val: `${timeLimitMs >= 1000 ? timeLimitMs / 1000 + 's' : timeLimitMs + 'ms'}`, color: '#f97316' },
                  ].map(({ label, val, color }) => (
                    <div key={label} style={{ flex: 1, textAlign: 'center' }}>
                      <div style={{ fontFamily: 'monospace', fontWeight: 900, fontSize: '1.1rem', color }}>{val}</div>
                      <div style={{ fontSize: '0.62rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.07em', marginTop: '0.1rem' }}>{label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Boilerplates */}
              <BoilerplateEditor
                boilerplates={boilerplates}
                onChange={setBoilerplates}
                timeLimitMs={timeLimitMs}
                onTimeLimitChange={setTimeLimitMs}
                methodName={methodName}
              />
            </>
          )}

          <button type="submit" disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black py-4 rounded-xl shadow-lg disabled:opacity-50 transition-all active:scale-95 text-sm uppercase tracking-widest">
            {isSubmitting ? 'Saving…' : 'Save Question to Firestore'}
          </button>
        </>
      )}
    </form>
  );
};

export default QuestionForm;