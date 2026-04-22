// // src/hooks/useExamSession.js

// import { useState, useCallback } from 'react';
// import { updateSubmission } from '../api/examService';

// /**
//  * Manages the state and logic for an active student exam session.
//  * @param {object} examData - The full exam object, including the questions array.
//  * @param {string} submissionId - The ID of the student's submission document in Firestore.
//  */
// export const useExamSession = (examData, submissionId) => {
//     const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//     const [answers, setAnswers] = useState({});

//     const questions = examData?.questions || [];
//     const currentQuestion = questions[currentQuestionIndex];
//     const isLastQuestion = currentQuestionIndex === questions.length - 1;

//     /**
//      * Saves an answer and persists it to Firestore.
//      * We use useCallback to prevent this function from being recreated on every render.
//      */
//     const saveAnswer = useCallback(async (questionId, answer) => {
//         const newAnswers = { ...answers, [questionId]: answer };
//         setAnswers(newAnswers);

//         try {
//             // Persist the updated answers array to Firestore to prevent data loss.
//             await updateSubmission(submissionId, { 
//                 answers: Object.entries(newAnswers).map(([qId, ans]) => ({
//                     questionId: qId,
//                     answer: ans, // Could be a string for MCQ or code for coding questions
//                 }))
//             });
//         } catch (error) {
//             console.error("Failed to save progress:", error);
//             // Optionally, show an error to the user.
//         }
//     }, [answers, submissionId]);

//     const goToNextQuestion = () => {
//         if (!isLastQuestion) {
//             setCurrentQuestionIndex(prev => prev + 1);
//         }
//     };

//     /**
//      * Finalizes the exam, calculates the score for MCQs, and marks it as completed.
//      */
//     const submitExam = async () => {
//         // Simple scoring logic for MCQs. Coding questions would be scored by the backend.
//         let totalScore = 0;
//         questions.forEach(q => {
//             if (q.type === 'MCQ' && answers[q.id] === q.correctAnswer) {
//                 totalScore += q.marks || 0;
//             }
//         });
        
//         try {
//             await updateSubmission(submissionId, {
//                 status: 'completed',
//                 totalScore: totalScore,
//                 submittedAt: new Date(),
//             });
//             console.log("Exam submitted successfully!");
//         } catch (error) {
//             console.error("Failed to submit exam:", error);
//         }
//     };
    
//     return {
//         currentQuestion,
//         currentQuestionIndex,
//         totalQuestions: questions.length,
//         isLastQuestion,
//         answers,
//         saveAnswer,
//         goToNextQuestion,
//         submitExam,
//     };
// };




// import { useState, useCallback } from 'react';
// import { updateSubmission } from '../api/examService';
// import { db } from '../firebase/config';
// import { doc, updateDoc, increment } from 'firebase/firestore';

// export const useExamSession = (examData, submissionId) => {
//     const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//     const [answers, setAnswers] = useState({});

//     const questions = examData?.questions || [];
//     const currentQuestion = questions[currentQuestionIndex];
//     const isLastQuestion = currentQuestionIndex === questions.length - 1;

//     const saveAnswer = useCallback(async (questionId, answer) => {
//         const newAnswers = { ...answers, [questionId]: answer };
//         setAnswers(newAnswers);

//         try {
//             await updateSubmission(submissionId, { 
//                 answers: Object.entries(newAnswers).map(([qId, ans]) => ({
//                     questionId: qId,
//                     answer: ans,
//                 }))
//             });
//         } catch (error) {
//             console.error("Failed to save progress:", error);
//         }
//     }, [answers, submissionId]);

//     const goToNextQuestion = () => {
//         if (!isLastQuestion) {
//             setCurrentQuestionIndex(prev => prev + 1);
//         }
//     };

//     const submitExam = async () => {
//         let totalScore = 0;
//         questions.forEach(q => {
//             if (q.type === 'MCQ' && answers[q.id] === q.correctAnswer) {
//                 totalScore += q.marks || 0;
//             }
//         });
        
//         try {
//             // 1. Mark submission as completed
//             await updateSubmission(submissionId, {
//                 status: 'completed',
//                 totalScore: totalScore,
//                 submittedAt: new Date(),
//             });

//             // 2. Update Student's permanent Leaderboard Score
//             if (examData?.studentId) {
//                 const userRef = doc(db, 'users', examData.studentId);
//                 await updateDoc(userRef, {
//                     totalScore: increment(totalScore)
//                 });
//             }

//             console.log("Exam submitted and score updated!");
//         } catch (error) {
//             console.error("Failed to submit exam:", error);
//         }
//     };
    
//     return {
//         currentQuestion,
//         currentQuestionIndex,
//         totalQuestions: questions.length,
//         isLastQuestion,
//         answers,
//         saveAnswer,
//         goToNextQuestion,
//         submitExam,
//     };
// };








// import { useState, useCallback } from 'react';
// import { updateSubmission } from '../api/examService';
// import { db } from '../firebase/config';
// import { doc, updateDoc, increment } from 'firebase/firestore';
// import { executeCode } from '../api/compilerService';

// export const useExamSession = (examData, submissionId) => {
//     const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//     const [answers, setAnswers] = useState({});
//     const [isSubmitting, setIsSubmitting] = useState(false);

//     // Ensure we are pulling from the correct questions array
//     const questions = examData?.questions || [];
//     const currentQuestion = questions[currentQuestionIndex];
//     const isLastQuestion = currentQuestionIndex === questions.length - 1;

//     const saveAnswer = useCallback(async (questionId, answer) => {
//         const newAnswers = { ...answers, [questionId]: answer };
//         setAnswers(newAnswers);

//         try {
//             await updateSubmission(submissionId, { 
//                 answers: Object.entries(newAnswers).map(([qId, ans]) => ({
//                     questionId: qId,
//                     answer: ans,
//                 }))
//             });
//         } catch (error) {
//             console.error("Failed to save progress:", error);
//         }
//     }, [answers, submissionId]);

//     const goToNextQuestion = () => {
//         if (!isLastQuestion) {
//             setCurrentQuestionIndex(prev => prev + 1);
//         }
//     };

//     const submitExam = async () => {
//         setIsSubmitting(true);
//         let totalScore = 0;
//         const evaluationResults = [];

//         try {
//             // Loop through all questions for final evaluation
//             for (const q of questions) {
//                 const studentAnswer = answers[q.id];

//                 if (q.type === 'MCQ') {
//                     if (studentAnswer === q.correctAnswer) {
//                         totalScore += Number(q.marks || 0);
//                     }
//                 } 
//                 else if (q.type === 'CODING') {
//                     if (!studentAnswer || !studentAnswer.code) {
//                         evaluationResults.push({ qId: q.id, score: 0, status: "No Submission" });
//                         continue;
//                     }

//                     const testCases = q.testCases || [];
//                     let passedTests = 0;

//                     // Evaluate every test case via Judge0
//                     for (const test of testCases) {
//                         try {
//                             const result = await executeCode(
//                                 studentAnswer.language,
//                                 studentAnswer.code,
//                                 test.input,
//                                 q.timeLimitMs || 2000
//                             );

//                             const actual = result.stdout?.trim();
//                             const expected = test.expectedOutput?.trim();

//                             if (result.status?.id === 3 && actual === expected) {
//                                 passedTests++;
//                             }
//                         } catch (err) {
//                             console.error(`Evaluation failed for Q: ${q.id}`, err);
//                         }
//                     }

//                     // Calculate proportional score: (passed/total) * marks
//                     const qScore = testCases.length > 0 
//                         ? (passedTests / testCases.length) * Number(q.marks || 0) 
//                         : 0;
                    
//                     totalScore += qScore;
//                     evaluationResults.push({
//                         qId: q.id,
//                         passed: passedTests,
//                         total: testCases.length,
//                         score: qScore
//                     });
//                 }
//             }

//             // 1. Finalize submission in Firestore
//             await updateSubmission(submissionId, {
//                 status: 'completed',
//                 totalScore: totalScore,
//                 evaluationResults,
//                 submittedAt: new Date(),
//             });

//             // 2. Increment student's permanent leaderboard score
//             if (examData?.studentId) {
//                 const userRef = doc(db, 'users', examData.studentId);
//                 await updateDoc(userRef, {
//                     totalScore: increment(totalScore)
//                 });
//             }

//             return { success: true, score: totalScore };
//         } catch (error) {
//             console.error("Critical submission error:", error);
//             throw error;
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     return {
//         currentQuestion,
//         currentQuestionIndex,
//         totalQuestions: questions.length,
//         isLastQuestion,
//         answers,
//         isSubmitting,
//         saveAnswer,
//         goToNextQuestion,
//         submitExam,
//     };
// };










import { useState, useCallback, useMemo } from 'react';
import { updateSubmission } from '../api/examService';
import { db } from '../firebase/config';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { executeCode } from '../api/compilerService';

export const useExamSession = (examData, submissionId) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    /**
     * UPDATE: Reorder questions so that all MCQs appear before Coding tasks.
     * We use useMemo to ensure the order is calculated once per exam session.
     */
    const orderedQuestions = useMemo(() => {
        const rawQuestions = examData?.questions || [];
        const mcqs = rawQuestions.filter(q => q.type === 'MCQ');
        const coding = rawQuestions.filter(q => q.type === 'CODING');
        return [...mcqs, ...coding];
    }, [examData?.questions]);

    const currentQuestion = orderedQuestions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === orderedQuestions.length - 1;

    const saveAnswer = useCallback(async (questionId, answer) => {
        const newAnswers = { ...answers, [questionId]: answer };
        setAnswers(newAnswers);

        try {
            await updateSubmission(submissionId, { 
                answers: Object.entries(newAnswers).map(([qId, ans]) => ({
                    questionId: qId,
                    answer: ans,
                }))
            });
        } catch (error) {
            console.error("Failed to save progress:", error);
        }
    }, [answers, submissionId]);

    const goToNextQuestion = () => {
        if (!isLastQuestion) {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };

    const goToQuestion = (index) => {
        if (index >= 0 && index < orderedQuestions.length) {
            setCurrentQuestionIndex(index);
        }
    };

    /**
     * UPDATE: Added 'forced' parameter for timer expiration or violations.
     * UPDATE: Logic refined for combined scoring (MCQ + Proportional Coding).
     */
    const submitExam = async (forced = false) => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        
        let totalScore = 0;
        const evaluationResults = [];

        try {
            for (const q of orderedQuestions) {
                const studentAnswer = answers[q.id];

                if (q.type === 'MCQ') {
                    const isCorrect = studentAnswer === q.correctAnswer;
                    const score = isCorrect ? Number(q.marks || 0) : 0;
                    totalScore += score;
                    evaluationResults.push({ qId: q.id, type: 'MCQ', score, status: isCorrect ? 'Correct' : 'Incorrect' });
                } 
                else if (q.type === 'CODING') {
                    if (!studentAnswer || !studentAnswer.code) {
                        evaluationResults.push({ qId: q.id, type: 'CODING', score: 0, status: "No Submission" });
                        continue;
                    }

                    const testCases = q.testCases || [];
                    let passedTests = 0;

                    for (const test of testCases) {
                        try {
                            const result = await executeCode(
                                studentAnswer.language,
                                studentAnswer.code,
                                test.input,
                                q.timeLimitMs || 2000
                            );

                            const actual = result.stdout?.trim();
                            const expected = test.expectedOutput?.trim();

                            if (result.status?.id === 3 && actual === expected) {
                                passedTests++;
                            }
                        } catch (err) {
                            console.error(`Evaluation failed for Q: ${q.id}`, err);
                        }
                    }

                    const qScore = testCases.length > 0 
                        ? (passedTests / testCases.length) * Number(q.marks || 0) 
                        : 0;
                    
                    totalScore += qScore;
                    evaluationResults.push({
                        qId: q.id,
                        type: 'CODING',
                        passed: passedTests,
                        total: testCases.length,
                        score: qScore
                    });
                }
            }

            // 1. Finalize submission in Firestore
            await updateSubmission(submissionId, {
                status: 'completed',
                totalScore: totalScore,
                evaluationResults,
                submittedAt: new Date(),
                forcedSubmit: forced // Flag for proctoring/timer
            });

            // 2. Update permanent leaderboard score
            if (examData?.studentId) {
                const userRef = doc(db, 'users', examData.studentId);
                await updateDoc(userRef, {
                    totalScore: increment(totalScore)
                });
            }

            return { success: true, score: totalScore };
        } catch (error) {
            console.error("Critical submission error:", error);
            throw error;
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        currentQuestion,
        currentQuestionIndex,
        totalQuestions: orderedQuestions.length,
        isLastQuestion,
        answers,
        isSubmitting,
        saveAnswer,
        goToNextQuestion,
        goToQuestion,
        submitExam,
    };
};