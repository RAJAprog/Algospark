// import { db } from '../firebase/config';
// import {
//     collection,
//     doc,
//     getDoc,
//     getDocs,
//     addDoc,
//     updateDoc,
//     query,
//     where,
//     serverTimestamp
// } from 'firebase/firestore';

// /* =========================================================
//    FACULTY FUNCTIONS
//    ========================================================= */

// // Create a question
// export const createQuestion = async (questionData) => {
//     const questionsCollection = collection(db, 'questions');

//     const docRef = await addDoc(questionsCollection, {
//         ...questionData,
//         createdAt: serverTimestamp(),
//     });

//     return docRef.id;
// };


// // Get all questions
// export const getAllQuestions = async () => {
//     const questionsCollection = collection(db, 'questions');
//     const snapshot = await getDocs(questionsCollection);

//     return snapshot.docs.map(doc => ({
//         id: doc.id,
//         ...doc.data()
//     }));
// };


// // Create exam (with scheduled timing)
// export const createExam = async (examData) => {
//     const examsCollection = collection(db, 'exams');

//     const docRef = await addDoc(examsCollection, {
//         ...examData,
//         scheduledStartTime: examData.scheduledStartTime, // Date
//         scheduledEndTime: examData.scheduledEndTime,     // Date
//         registeredStudents: examData.registeredStudents || [],
//         createdAt: serverTimestamp()
//     });

//     return docRef.id;
// };


// // Get exams created by faculty
// export const getExamsByFaculty = async (facultyId) => {
//     const examsCollection = collection(db, 'exams');

//     const q = query(
//         examsCollection,
//         where("createdBy", "==", facultyId)
//     );

//     const snapshot = await getDocs(q);

//     return snapshot.docs.map(doc => ({
//         id: doc.id,
//         ...doc.data()
//     }));
// };



// /* =========================================================
//    STUDENT MODULE ACCESS SYSTEM
//    ========================================================= */

// // Fetch modules based on Global or College access
// export const getAccessibleModules = async (collegeId = null) => {
//     const categoriesCollection = collection(db, 'categories');
//     const snapshot = await getDocs(categoriesCollection);

//     const modules = snapshot.docs.map(doc => ({
//         id: doc.id,
//         ...doc.data()
//     }));

//     return modules.filter(mod =>
//         mod.accessType === "global" ||
//         (collegeId && mod.allowedColleges?.includes(collegeId))
//     );
// };



// /* =========================================================
//    STUDENT EXAM FUNCTIONS
//    ========================================================= */

// // Get exams where student's Gmail is registered
// export const getEligibleExams = async (studentEmail) => {

//     if (!studentEmail) return [];

//     const examsCollection = collection(db, 'exams');

//     const q = query(
//         examsCollection,
//         where("registeredStudents", "array-contains", studentEmail)
//     );

//     const snapshot = await getDocs(q);

//     return snapshot.docs.map(doc => ({
//         id: doc.id,
//         ...doc.data()
//     }));
// };



// /* =========================================================
//    SUBMISSION FUNCTIONS
//    ========================================================= */

// // Get all submissions of a student
// export const getStudentSubmissions = async (studentId) => {

//     const submissionsCollection = collection(db, 'submissions');

//     const q = query(
//         submissionsCollection,
//         where("studentId", "==", studentId)
//     );

//     const snapshot = await getDocs(q);

//     return snapshot.docs.map(doc => ({
//         id: doc.id,
//         ...doc.data()
//     }));
// };


// // Get exam details with questions
// export const getExamDetails = async (examId) => {

//     const examRef = doc(db, 'exams', examId);
//     const examSnap = await getDoc(examRef);

//     if (!examSnap.exists()) {
//         console.error("Exam not found");
//         return null;
//     }

//     const examData = examSnap.data();
//     const questions = [];

//     if (examData.questionIds && examData.questionIds.length > 0) {

//         for (const questionId of examData.questionIds) {

//             const questionRef = doc(db, 'questions', questionId);
//             const questionSnap = await getDoc(questionRef);

//             if (questionSnap.exists()) {
//                 questions.push({
//                     id: questionSnap.id,
//                     ...questionSnap.data()
//                 });
//             }
//         }
//     }

//     return {
//         id: examSnap.id,
//         ...examData,
//         questions
//     };
// };


// // Start exam submission
// export const startSubmission = async (submissionData) => {

//     const submissionsCollection = collection(db, 'submissions');

//     const docRef = await addDoc(submissionsCollection, {
//         ...submissionData,
//         status: "started",
//         startTime: serverTimestamp(),
//         answers: []
//     });

//     return docRef.id;
// };


// // Update submission
// export const updateSubmission = async (submissionId, dataToUpdate) => {

//     const submissionRef = doc(db, 'submissions', submissionId);

//     await updateDoc(submissionRef, {
//         ...dataToUpdate,
//         lastUpdated: serverTimestamp()
//     });
// };

















// ============================================================
// examService.js  –  Mind Code Platform
// KEY FIXES:
//   1. calculateAndSaveScore()  –  combines MCQ + Coding scores
//      and writes totalScore back to the submission document.
//   2. getSubmissionsForExam()  –  used by ResultsTable + PDF reports.
//   3. All existing functions preserved unchanged.
// ============================================================

import { db } from '../firebase/config';
import {
  collection, doc, getDoc, getDocs,
  addDoc, updateDoc,
  query, where, serverTimestamp,
} from 'firebase/firestore';

// ── Create a single question ──────────────────────────────────
export const createQuestion = async (questionData) => {
  const ref = await addDoc(collection(db, 'questions'), {
    ...questionData,
    createdAt: serverTimestamp(),
  });
  return ref.id;
};

// ── Get all questions ────────────────────────────────────────
export const getAllQuestions = async () => {
  const snap = await getDocs(collection(db, 'questions'));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

// ── Create an exam ───────────────────────────────────────────
export const createExam = async (examData) => {
  const ref = await addDoc(collection(db, 'exams'), {
    ...examData,
    scheduledStartTime:  examData.scheduledStartTime,
    scheduledEndTime:    examData.scheduledEndTime,
    registeredStudents:  examData.registeredStudents || [],
    createdAt:           serverTimestamp(),
  });
  return ref.id;
};

// ── Get exams by faculty ─────────────────────────────────────
export const getExamsByFaculty = async (facultyId) => {
  const q    = query(collection(db, 'exams'), where('createdBy', '==', facultyId));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

// ── Get accessible modules ───────────────────────────────────
export const getAccessibleModules = async (collegeId = null) => {
  const snap    = await getDocs(collection(db, 'categories'));
  const modules = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  return modules.filter(m =>
    m.accessType === 'global' ||
    (collegeId && m.allowedColleges?.includes(collegeId))
  );
};

// ── Get eligible exams for a student (by email) ──────────────
export const getEligibleExams = async (studentEmail) => {
  if (!studentEmail) return [];
  const q    = query(collection(db, 'exams'), where('registeredStudents', 'array-contains', studentEmail));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

// ── Get student's own submissions ────────────────────────────
export const getStudentSubmissions = async (studentId) => {
  const q    = query(collection(db, 'submissions'), where('studentId', '==', studentId));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

// ── Get full exam details (with questions) ───────────────────
export const getExamDetails = async (examId) => {
  const examSnap = await getDoc(doc(db, 'exams', examId));
  if (!examSnap.exists()) return null;

  const examData  = examSnap.data();
  const questions = [];

  for (const qId of (examData.questionIds || [])) {
    const qSnap = await getDoc(doc(db, 'questions', qId));
    if (qSnap.exists()) questions.push({ id: qSnap.id, ...qSnap.data() });
  }

  return { id: examSnap.id, ...examData, questions };
};

// ── Start a new submission ───────────────────────────────────
export const startSubmission = async (submissionData) => {
  const ref = await addDoc(collection(db, 'submissions'), {
    ...submissionData,
    status:    'started',
    startTime: serverTimestamp(),
    answers:   [],
    totalScore: 0,
  });
  return ref.id;
};

// ── Update an existing submission ────────────────────────────
export const updateSubmission = async (submissionId, dataToUpdate) => {
  await updateDoc(doc(db, 'submissions', submissionId), {
    ...dataToUpdate,
    lastUpdated: serverTimestamp(),
  });
};

// ──────────────────────────────────────────────────────────────
// NEW: Calculate + persist combined MCQ + Coding score
//
// Call this when the student completes their exam.
//
// answers structure (from ExamPage state):
//   MCQ:    { [questionId]: "selected option string" }
//   Coding: { [questionId]: { code, language, passedCount } }
//
// questions: full question objects fetched at exam load time
//   Each MCQ question has { correctAnswer, marks }
//   Each Coding question has { marks, testCases }
// ──────────────────────────────────────────────────────────────
export const calculateAndSaveScore = async (submissionId, answers, questions) => {
  if (!submissionId || !questions?.length) return 0;

  let totalScore   = 0;
  let mcqScore     = 0;
  let codingScore  = 0;
  const breakdown  = [];

  for (const q of questions) {
    const ans = answers[q.id];
    if (!ans) {
      breakdown.push({ questionId: q.id, type: q.type, score: 0, maxScore: q.marks || 0 });
      continue;
    }

    if (q.type === 'MCQ') {
      // MCQ: full marks if option matches correctAnswer
      const isCorrect = ans === q.correctAnswer;
      const earned    = isCorrect ? (q.marks || 1) : 0;
      mcqScore       += earned;
      totalScore     += earned;
      breakdown.push({ questionId: q.id, type: 'MCQ', score: earned, maxScore: q.marks || 1, correct: isCorrect });

    } else if ((q.type || '').toUpperCase() === 'CODING') {
      // Coding: partial marks proportional to passed test cases
      const totalCases  = q.testCases?.length || 0;
      const passedCount = ans.passedCount ?? 0;
      const earned      = totalCases > 0
        ? Math.round(((passedCount / totalCases) * (q.marks || 100)) * 10) / 10
        : 0;
      codingScore  += earned;
      totalScore   += earned;
      breakdown.push({ questionId: q.id, type: 'CODING', score: earned, maxScore: q.marks || 100, passedCount, totalCases });
    }
  }

  await updateSubmission(submissionId, {
    totalScore:   Math.round(totalScore * 10) / 10,
    mcqScore:     Math.round(mcqScore  * 10) / 10,
    codingScore:  Math.round(codingScore * 10) / 10,
    scoreBreakdown: breakdown,
    status:       'completed',
  });

  return totalScore;
};

// ──────────────────────────────────────────────────────────────
// NEW: Get all submissions for an exam (used by ResultsTable)
// ──────────────────────────────────────────────────────────────
export const getSubmissionsForExam = async (examId) => {
  if (!examId) return [];
  const q    = query(collection(db, 'submissions'), where('examId', '==', examId));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};