// // src/components/exam/student/ExamDetailsForm.jsx

// import React, { useState } from 'react';

// const ExamDetailsForm = ({ onSubmit }) => {
//     const [name, setName] = useState('');
//     const [regdNo, setRegdNo] = useState('');
//     const [branch, setBranch] = useState('');
//     const [section, setSection] = useState('');

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         if (!name || !regdNo || !branch || !section) {
//             alert('Please fill in all details.');
//             return;
//         }
//         onSubmit({
//             student_name: name,
//             regd_no: regdNo,
//             branch: branch,
//             section: section,
//         });
//     };

//     return (
//         <div className="max-w-md mx-auto bg-gray-800 p-8 rounded-lg">
//             <h2 className="text-2xl font-bold text-white mb-6 text-center">Enter Your Details</h2>
//             <form onSubmit={handleSubmit} className="space-y-4">
//                 <div>
//                     <label htmlFor="name" className="block text-sm font-medium text-gray-300">Full Name</label>
//                     <input
//                         type="text"
//                         id="name"
//                         value={name}
//                         onChange={(e) => setName(e.target.value)}
//                         className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                         required
//                     />
//                 </div>
//                 <div>
//                     <label htmlFor="regdNo" className="block text-sm font-medium text-gray-300">Registration No.</label>
//                     <input
//                         type="text"
//                         id="regdNo"
//                         value={regdNo}
//                         onChange={(e) => setRegdNo(e.target.value)}
//                         className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                         required
//                     />
//                 </div>
//                 <div>
//                     <label htmlFor="branch" className="block text-sm font-medium text-gray-300">Branch</label>
//                     <input
//                         type="text"
//                         id="branch"
//                         value={branch}
//                         onChange={(e) => setBranch(e.target.value)}
//                         className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                         required
//                     />
//                 </div>
//                  <div>
//                     <label htmlFor="section" className="block text-sm font-medium text-gray-300">Section</label>
//                     <input
//                         type="text"
//                         id="section"
//                         value={section}
//                         onChange={(e) => setSection(e.target.value)}
//                         className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                         required
//                     />
//                 </div>
//                 <button
//                     type="submit"
//                     className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                 >
//                     Begin Test
//                 </button>
//             </form>
//         </div>
//     );
// };

// export default ExamDetailsForm;




















// // src/components/student/ExamDetailsForm.jsx
// // Shows BEFORE the exam starts to collect branch/section details.
// // RegNo is pre-filled and read-only (from auth).
// // Name is pre-filled from profile but can be corrected.
// // Branch and Section must be typed in.

// import { useState } from 'react';

// export default function ExamDetailsForm({
//   onSubmit,
//   onCancel,
//   prefillRegNo = '',
//   prefillName  = '',
//   examTitle    = '',
//   dark         = true,
// }) {
//   const [name,    setName]    = useState(prefillName);
//   const [branch,  setBranch]  = useState('');
//   const [section, setSection] = useState('');
//   const [error,   setError]   = useState('');

//   const T = dark ? {
//     bg:      '#0d1117',
//     card:    '#161b22',
//     border:  '#30363d',
//     text:    '#e6edf3',
//     muted:   '#8b949e',
//     inputBg: '#0d1117',
//     readBg:  '#0a0e14',
//   } : {
//     bg:      '#f0f2f5',
//     card:    '#ffffff',
//     border:  '#e2e8f0',
//     text:    '#0f172a',
//     muted:   '#64748b',
//     inputBg: '#f8fafc',
//     readBg:  '#f1f5f9',
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!name.trim())    { setError('Please enter your full name.');  return; }
//     if (!branch.trim())  { setError('Please enter your branch.');     return; }
//     if (!section.trim()) { setError('Please enter your section.');    return; }
//     setError('');
//     onSubmit({
//       name:    name.trim(),
//       regNo:   prefillRegNo,
//       branch:  branch.trim().toUpperCase(),
//       section: section.trim().toUpperCase(),
//     });
//   };

//   const inp = {
//     width: '100%', background: T.inputBg, border: `1px solid ${T.border}`,
//     borderRadius: 8, padding: '10px 14px', color: T.text, fontSize: 14,
//     outline: 'none', boxSizing: 'border-box', transition: 'border-color .15s',
//     fontFamily: 'inherit',
//   };

//   const lbl = {
//     display: 'block', fontSize: 12, fontWeight: 700, color: T.muted,
//     textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6,
//   };

//   return (
//     <div style={{
//       position: 'fixed', inset: 0,
//       background: 'rgba(0,0,0,0.8)',
//       display: 'flex', alignItems: 'center', justifyContent: 'center',
//       zIndex: 999, padding: 20,
//     }}>
//       <div style={{
//         background: T.card, border: `1px solid ${T.border}`,
//         borderRadius: 16, padding: '36px 40px',
//         maxWidth: 480, width: '100%',
//         boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
//         maxHeight: '90vh', overflowY: 'auto',
//       }}>
//         {/* Header */}
//         <div style={{ marginBottom: 28, textAlign: 'center' }}>
//           <div style={{ fontSize: 38, marginBottom: 12 }}>📋</div>
//           <h2 style={{ fontSize: 20, fontWeight: 800, color: T.text, marginBottom: 6 }}>
//             Before You Begin
//           </h2>
//           {examTitle && (
//             <p style={{ fontSize: 14, fontWeight: 700, color: '#f0883e', marginBottom: 4 }}>
//               {examTitle}
//             </p>
//           )}
//           <p style={{ fontSize: 13, color: T.muted, lineHeight: 1.5 }}>
//             Please confirm your details — these will appear in the exam report.
//           </p>
//         </div>

//         <form onSubmit={handleSubmit}>
//           <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

//             {/* Reg No — read only */}
//             <div>
//               <label style={lbl}>Registration Number</label>
//               <input
//                 value={prefillRegNo || '—'}
//                 readOnly
//                 style={{
//                   ...inp,
//                   background: T.readBg,
//                   color: T.muted,
//                   cursor: 'not-allowed',
//                 }}
//               />
//               <p style={{ fontSize: 11, color: T.muted, marginTop: 4 }}>
//                 Auto-filled from your account · cannot be changed
//               </p>
//             </div>

//             {/* Full Name */}
//             <div>
//               <label style={lbl}>
//                 Full Name <span style={{ color: '#f85149' }}>*</span>
//               </label>
//               <input
//                 type="text"
//                 value={name}
//                 onChange={e => setName(e.target.value)}
//                 placeholder="e.g. Komalibhavani Karne"
//                 style={inp}
//                 onFocus={e => (e.target.style.borderColor = '#f0883e')}
//                 onBlur={e  => (e.target.style.borderColor = T.border)}
//               />
//             </div>

//             {/* Branch */}
//             <div>
//               <label style={lbl}>
//                 Branch <span style={{ color: '#f85149' }}>*</span>
//               </label>
//               <input
//                 type="text"
//                 value={branch}
//                 onChange={e => setBranch(e.target.value)}
//                 placeholder="e.g. CSE, ECE, IT, MECH"
//                 style={inp}
//                 onFocus={e => (e.target.style.borderColor = '#f0883e')}
//                 onBlur={e  => (e.target.style.borderColor = T.border)}
//               />
//             </div>

//             {/* Section */}
//             <div>
//               <label style={lbl}>
//                 Section <span style={{ color: '#f85149' }}>*</span>
//               </label>
//               <input
//                 type="text"
//                 value={section}
//                 onChange={e => setSection(e.target.value)}
//                 placeholder="e.g. A, B, C1"
//                 style={inp}
//                 onFocus={e => (e.target.style.borderColor = '#f0883e')}
//                 onBlur={e  => (e.target.style.borderColor = T.border)}
//               />
//             </div>

//           </div>

//           {/* Error */}
//           {error && (
//             <div style={{
//               marginTop: 14, padding: '10px 14px',
//               background: 'rgba(248,81,73,0.1)',
//               border: '1px solid rgba(248,81,73,0.3)',
//               borderRadius: 8, color: '#f85149', fontSize: 13,
//             }}>
//               {error}
//             </div>
//           )}

//           {/* Proctoring notice */}
//           <div style={{
//             marginTop: 18, padding: '12px 14px',
//             background: 'rgba(240,136,62,0.08)',
//             border: '1px solid rgba(240,136,62,0.25)',
//             borderRadius: 8,
//           }}>
//             <p style={{ fontSize: 12, fontWeight: 700, color: '#f0883e', marginBottom: 4 }}>
//               ⚠ Proctoring Notice
//             </p>
//             <p style={{ fontSize: 12, color: T.muted, lineHeight: 1.6 }}>
//               This exam requires fullscreen mode. Exiting fullscreen 3 times will auto-submit
//               your exam. Tab switching is monitored and recorded.
//             </p>
//           </div>

//           {/* Buttons */}
//           <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
//             <button
//               type="button"
//               onClick={onCancel}
//               style={{
//                 flex: 1, padding: '11px', borderRadius: 8,
//                 background: 'transparent', border: `1px solid ${T.border}`,
//                 color: T.muted, fontSize: 14, fontWeight: 600,
//                 cursor: 'pointer', fontFamily: 'inherit',
//               }}
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               style={{
//                 flex: 2, padding: '11px', borderRadius: 8,
//                 background: 'linear-gradient(135deg, #f0883e, #e07730)',
//                 border: 'none', color: '#fff',
//                 fontSize: 14, fontWeight: 800,
//                 cursor: 'pointer', fontFamily: 'inherit',
//                 boxShadow: '0 4px 12px rgba(240,136,62,0.35)',
//               }}
//             >
//               Start Exam →
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// } 



import { useState, useEffect } from 'react';

export default function ExamDetailsForm({
  onSubmit,
  onCancel,
  prefillRegNo = '',
  prefillName  = '',
  examTitle    = '',
  dark         = true,
}) {
  const [name,    setName]    = useState(prefillName);
  const [branch,  setBranch]  = useState('');
  const [section, setSection] = useState('');
  const [error,   setError]   = useState('');

  // Sync when prefillName arrives asynchronously
  useEffect(() => {
    if (prefillName) setName(prefillName);
  }, [prefillName]);

  const T = dark ? {
    bg:      '#0d1117',
    card:    '#161b22',
    border:  '#30363d',
    text:    '#e6edf3',
    muted:   '#8b949e',
    inputBg: '#0d1117',
    readBg:  '#0a0e14',
  } : {
    bg:      '#f0f2f5',
    card:    '#ffffff',
    border:  '#e2e8f0',
    text:    '#0f172a',
    muted:   '#64748b',
    inputBg: '#f8fafc',
    readBg:  '#f1f5f9',
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim())    { setError('Please enter your full name.');  return; }
    if (!branch.trim())  { setError('Please enter your branch.');     return; }
    if (!section.trim()) { setError('Please enter your section.');    return; }
    setError('');
    onSubmit({
      name:    name.trim(),
      regNo:   prefillRegNo,
      branch:  branch.trim().toUpperCase(),
      section: section.trim().toUpperCase(),
    });
  };

  const inp = {
    width: '100%', background: T.inputBg, border: `1px solid ${T.border}`,
    borderRadius: 8, padding: '10px 14px', color: T.text, fontSize: 14,
    outline: 'none', boxSizing: 'border-box', transition: 'border-color .15s',
    fontFamily: 'inherit',
  };

  const readOnlyInp = {
    ...inp,
    background: T.readBg,
    color: T.muted,
    cursor: 'not-allowed',
  };

  const lbl = {
    display: 'block', fontSize: 12, fontWeight: 700, color: T.muted,
    textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6,
  };

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.8)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 999, padding: 20,
    }}>
      <div style={{
        background: T.card, border: `1px solid ${T.border}`,
        borderRadius: 16, padding: '36px 40px',
        maxWidth: 480, width: '100%',
        boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
        maxHeight: '90vh', overflowY: 'auto',
      }}>
        {/* Header */}
        <div style={{ marginBottom: 28, textAlign: 'center' }}>
          <div style={{ fontSize: 38, marginBottom: 12 }}>📋</div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: T.text, marginBottom: 6 }}>
            Before You Begin
          </h2>
          {examTitle && (
            <p style={{ fontSize: 14, fontWeight: 700, color: '#f0883e', marginBottom: 4 }}>
              {examTitle}
            </p>
          )}
          <p style={{ fontSize: 13, color: T.muted, lineHeight: 1.5 }}>
            Please confirm your details — these will appear in the exam report.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

            {/* Reg No — read only */}
            <div>
              <label style={lbl}>Registration Number</label>
              <input
                value={prefillRegNo || '—'}
                readOnly
                style={readOnlyInp}
              />
              <p style={{ fontSize: 11, color: T.muted, marginTop: 4 }}>
                Auto-filled from your account · cannot be changed
              </p>
            </div>

            {/* Full Name — auto-filled, read-only if prefilled */}
            <div>
              <label style={lbl}>
                Full Name <span style={{ color: '#f85149' }}>*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={e => !prefillName && setName(e.target.value)}
                readOnly={!!prefillName}
                placeholder="e.g. Komalibhavani Karne"
                style={prefillName ? readOnlyInp : inp}
                onFocus={e => { if (!prefillName) e.target.style.borderColor = '#f0883e'; }}
                onBlur={e  => { e.target.style.borderColor = T.border; }}
              />
              {prefillName && (
                <p style={{ fontSize: 11, color: T.muted, marginTop: 4 }}>
                  Auto-filled from your account · cannot be changed
                </p>
              )}
            </div>

            {/* Branch */}
            <div>
              <label style={lbl}>
                Branch <span style={{ color: '#f85149' }}>*</span>
              </label>
              <input
                type="text"
                value={branch}
                onChange={e => setBranch(e.target.value)}
                placeholder="e.g. CSE, ECE, IT, MECH"
                style={inp}
                onFocus={e => (e.target.style.borderColor = '#f0883e')}
                onBlur={e  => (e.target.style.borderColor = T.border)}
              />
            </div>

            {/* Section */}
            <div>
              <label style={lbl}>
                Section <span style={{ color: '#f85149' }}>*</span>
              </label>
              <input
                type="text"
                value={section}
                onChange={e => setSection(e.target.value)}
                placeholder="e.g. A, B, C1"
                style={inp}
                onFocus={e => (e.target.style.borderColor = '#f0883e')}
                onBlur={e  => (e.target.style.borderColor = T.border)}
              />
            </div>

          </div>

          {/* Error */}
          {error && (
            <div style={{
              marginTop: 14, padding: '10px 14px',
              background: 'rgba(248,81,73,0.1)',
              border: '1px solid rgba(248,81,73,0.3)',
              borderRadius: 8, color: '#f85149', fontSize: 13,
            }}>
              {error}
            </div>
          )}

          {/* Proctoring notice */}
          <div style={{
            marginTop: 18, padding: '12px 14px',
            background: 'rgba(240,136,62,0.08)',
            border: '1px solid rgba(240,136,62,0.25)',
            borderRadius: 8,
          }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: '#f0883e', marginBottom: 4 }}>
              ⚠ Proctoring Notice
            </p>
            <p style={{ fontSize: 12, color: T.muted, lineHeight: 1.6 }}>
              This exam requires fullscreen mode. Exiting fullscreen 3 times will auto-submit
              your exam. Tab switching is monitored and recorded.
            </p>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
            <button
              type="button"
              onClick={onCancel}
              style={{
                flex: 1, padding: '11px', borderRadius: 8,
                background: 'transparent', border: `1px solid ${T.border}`,
                color: T.muted, fontSize: 14, fontWeight: 600,
                cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                flex: 2, padding: '11px', borderRadius: 8,
                background: 'linear-gradient(135deg, #f0883e, #e07730)',
                border: 'none', color: '#fff',
                fontSize: 14, fontWeight: 800,
                cursor: 'pointer', fontFamily: 'inherit',
                boxShadow: '0 4px 12px rgba(240,136,62,0.35)',
              }}
            >
              Start Exam →
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}