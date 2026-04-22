// // import React, { useState, useEffect, useCallback } from "react";
// // import {
// //   collection, getDocs, doc, setDoc, updateDoc, deleteDoc,
// //   query, orderBy, serverTimestamp, arrayUnion
// // } from "firebase/firestore";
// // import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
// // import { db } from "../../firebase/config";

// // import CodingQuestionsPanel from "./LessonPanels/CodingQuestionsPanel";
// // import MCQPanel             from "./LessonPanels/MCQPanel";
// // import FilesPanel           from "./LessonPanels/FilesPanel";

// // const TABS = [
// //   { id: "coding", icon: "💻", label: "Coding Questions" },
// //   { id: "mcq",    icon: "🧠", label: "MCQ Practice"     },
// //   { id: "files",  icon: "📊", label: "PPT / Files"      },
// // ];

// // const LessonActionPanel = ({ language, topic, currentUser, onBack }) => {
// //   const [activeTab, setActiveTab] = useState(null); // null = landing, or "coding"/"mcq"/"files"

// //   if (!activeTab) {
// //     return (
// //       <div className="space-y-6 animate-in fade-in duration-300">
// //         {/* Breadcrumb header */}
// //         <div className="flex items-center gap-3">
// //           <button
// //             onClick={onBack}
// //             className="text-xs font-bold text-pink-400 border border-pink-500/40 px-3 py-1.5 rounded-lg bg-pink-500/10 hover:bg-pink-500/20 transition-all"
// //           >
// //             ← Back to Modules
// //           </button>
// //           <span className="text-gray-600 text-sm">Learning Module Builder</span>
// //         </div>

// //         <div>
// //           <h2 className="text-2xl font-black tracking-tight">{language?.name}</h2>
// //           <p className="text-gray-500 text-sm mt-1">
// //             {language?.name} → <span className="text-white font-bold">{topic?.name}</span>
// //           </p>
// //         </div>

// //         {/* 3 Big Action Buttons */}
// //         <div className="grid grid-cols-3 gap-5 mt-4">
// //           {TABS.map((tab) => (
// //             <button
// //               key={tab.id}
// //               onClick={() => setActiveTab(tab.id)}
// //               className="group bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-blue-500/50 rounded-2xl p-8 text-center transition-all duration-200 active:scale-95"
// //             >
// //               <div className="text-4xl mb-4">{tab.icon}</div>
// //               <div className="text-base font-black text-white">{tab.label}</div>
// //               <div className="text-xs text-gray-500 mt-2 group-hover:text-gray-400">
// //                 {tab.id === "coding" && "Add & manage coding problems"}
// //                 {tab.id === "mcq"    && "Multiple choice questions"}
// //                 {tab.id === "files"  && "Upload PPT, PDF, Videos"}
// //               </div>
// //             </button>
// //           ))}
// //         </div>

// //         {/* Topic info */}
// //         <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-5">
// //           <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">
// //             Topic Info
// //           </div>
// //           <div className="grid grid-cols-3 gap-4 text-center">
// //             <Stat label="Subtopics"        value={topic?.subtopics?.length || 0}          />
// //             <Stat label="Coding Questions" value={topic?.codingQuestionIds?.length || 0}  />
// //             <Stat label="MCQs"             value={topic?.mcqIds?.length || 0}             />
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   }

// //   const shared = { language, topic, currentUser, onBack: () => setActiveTab(null) };

// //   return (
// //     <>
// //       {activeTab === "coding" && <CodingQuestionsPanel {...shared} />}
// //       {activeTab === "mcq"    && <MCQPanel             {...shared} />}
// //       {activeTab === "files"  && <FilesPanel           {...shared} />}
// //     </>
// //   );
// // };

// // const Stat = ({ label, value }) => (
// //   <div>
// //     <div className="text-2xl font-black text-white">{value}</div>
// //     <div className="text-xs text-gray-500 mt-1">{label}</div>
// //   </div>
// // );

// // export default LessonActionPanel;
// ////


// import React, { useState } from "react";

// // FIXED IMPORTS: Now looking in the same folder instead of ./LessonPanels/
// import CodingQuestionsPanel from "./LessonPanels/CodingQuestionsPanel";
// import MCQPanel             from "./LessonPanels/MCQPanel";
// import FilesPanel           from "./LessonPanels/FilesPanel";

// const TABS = [
//   { id: "coding", icon: "💻", label: "Coding Questions" },
//   { id: "mcq",    icon: "🧠", label: "MCQ Practice"     },
//   { id: "files",  icon: "📊", label: "PPT / Files"      },
// ];

// const LessonActionPanel = ({ language, topic, currentUser, onBack }) => {
//   const [activeTab, setActiveTab] = useState(null);

//   if (!activeTab) {
//     return (
//       <div className="space-y-6 animate-in fade-in duration-300">
//         <div className="flex items-center gap-3">
//           <button onClick={onBack} className="text-xs font-bold text-pink-400 border border-pink-500/40 px-3 py-1.5 rounded-lg bg-pink-500/10 hover:bg-pink-500/20 transition-all">
//             ← Back to Modules
//           </button>
//           <span className="text-gray-600 text-sm">Learning Module Builder</span>
//         </div>

//         <div>
//           <h2 className="text-2xl font-black tracking-tight">{language?.name}</h2>
//           <p className="text-gray-500 text-sm mt-1">
//             {language?.name} → <span className="text-white font-bold">{topic?.name}</span>
//           </p>
//         </div>

//         <div className="grid grid-cols-3 gap-5 mt-4">
//           {TABS.map((tab) => (
//             <button key={tab.id} onClick={() => setActiveTab(tab.id)} className="group bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-blue-500/50 rounded-2xl p-8 text-center transition-all duration-200 active:scale-95">
//               <div className="text-4xl mb-4">{tab.icon}</div>
//               <div className="text-base font-black text-white">{tab.label}</div>
//               <div className="text-xs text-gray-500 mt-2 group-hover:text-gray-400">
//                 {tab.id === "coding" && "Add & manage coding problems"}
//                 {tab.id === "mcq"    && "Multiple choice questions"}
//                 {tab.id === "files"  && "Upload PPT, PDF, Videos"}
//               </div>
//             </button>
//           ))}
//         </div>

//         <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-5">
//           <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Topic Info</div>
//           <div className="grid grid-cols-3 gap-4 text-center">
//             <Stat label="Subtopics"        value={topic?.subtopics?.length || 0}          />
//             <Stat label="Coding Questions" value={topic?.codingQuestionIds?.length || 0}  />
//             <Stat label="MCQs"             value={topic?.mcqIds?.length || 0}             />
//           </div>
//         </div>
//       </div>
//     );
//   }

//   const shared = { language, topic, currentUser, onBack: () => setActiveTab(null) };

//   return (
//     <>
//       {activeTab === "coding" && <CodingQuestionsPanel {...shared} />}
//       {activeTab === "mcq"    && <MCQPanel             {...shared} />}
//       {activeTab === "files"  && <FilesPanel           {...shared} />}
//     </>
//   );
// };

// const Stat = ({ label, value }) => (
//   <div>
//     <div className="text-2xl font-black text-white">{value}</div>
//     <div className="text-xs text-gray-500 mt-1">{label}</div>
//   </div>
// );

// export default LessonActionPanel;

import React, { useState } from "react";
import CodingQuestionsPanel from "./LessonPanels/CodingQuestionsPanel";
import MCQPanel             from "./LessonPanels/MCQPanel";
import FilesPanel           from "./LessonPanels/FilesPanel";

const TABS = [
  { id: "coding", icon: "💻", label: "Coding Questions" },
  { id: "mcq",    icon: "🧠", label: "MCQ Practice"     },
  { id: "files",  icon: "📊", label: "PPT / Files"      },
];

const LessonActionPanel = ({ language, topic, currentUser, allQuestions, onRefresh, onBack }) => {
  const [activeTab, setActiveTab] = useState(null); 

  if (!activeTab) {
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="text-xs font-bold text-pink-400 border border-pink-500/40 px-3 py-1.5 rounded-lg bg-pink-500/10 hover:bg-pink-500/20 transition-all">
            ← Back to Topics
          </button>
          <span className="text-gray-600 text-sm">Learning Module Builder</span>
        </div>

        <div>
          <h2 className="text-2xl font-black tracking-tight">{language?.name}</h2>
          <p className="text-gray-500 text-sm mt-1">
            {language?.name} → <span className="text-white font-bold">{topic?.name}</span>
          </p>
        </div>

        <div className="grid grid-cols-3 gap-5 mt-4">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="group bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-blue-500/50 rounded-2xl p-8 text-center transition-all duration-200 active:scale-95"
            >
              <div className="text-4xl mb-4">{tab.icon}</div>
              <div className="text-base font-black text-white">{tab.label}</div>
              <div className="text-xs text-gray-500 mt-2 group-hover:text-gray-400">
                {tab.id === "coding" && "Add & manage coding problems"}
                {tab.id === "mcq"    && "Multiple choice questions"}
                {tab.id === "files"  && "Upload PPT, PDF, Videos"}
              </div>
            </button>
          ))}
        </div>

        <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-5">
          <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Topic Info</div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <Stat label="Subtopics"        value={topic?.subtopics?.length || 0}          />
            <Stat label="Coding Questions" value={topic?.codingQuestionIds?.length || 0}  />
            <Stat label="MCQs"             value={topic?.mcqIds?.length || 0}             />
          </div>
        </div>
      </div>
    );
  }

  // Pass all the props down to the specific panels
  const shared = { language, topic, currentUser, allQuestions, onRefresh, onBack: () => setActiveTab(null) };

  return (
    <>
      {activeTab === "coding" && <CodingQuestionsPanel {...shared} />}
      {activeTab === "mcq"    && <MCQPanel             {...shared} />}
      {activeTab === "files"  && <FilesPanel           {...shared} />}
    </>
  );
};

const Stat = ({ label, value }) => (
  <div>
    <div className="text-2xl font-black text-white">{value}</div>
    <div className="text-xs text-gray-500 mt-1">{label}</div>
  </div>
);

export default LessonActionPanel;