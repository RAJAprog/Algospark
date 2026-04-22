import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { collection, query, where, getDocs } from 'firebase/firestore';

const ProgressTracker = ({ currentUser, collegeId }) => {
    const [stats, setStats] = useState({
        completed: 0,
        total: 0,
        percentage: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProgress = async () => {
            if (!currentUser) return;
            setLoading(true);

            try {
                // 1. Fetch Total Available Questions (Global + Student's College)
                const questionsSnap = await getDocs(collection(db, 'questions'));
                const allQuestions = questionsSnap.docs.map(doc => doc.data());
                
                // Fetch Categories to check permissions
                const categoriesSnap = await getDocs(collection(db, 'categories'));
                const categories = categoriesSnap.docs.reduce((acc, doc) => {
                    acc[doc.id] = doc.data();
                    return acc;
                }, {});

                const accessibleQuestions = allQuestions.filter(q => {
                    const cat = categories[q.categoryId];
                    if (!cat) return true; // Default to global if no category found
                    return cat.accessType === 'global' || (collegeId && cat.allowedColleges?.includes(collegeId));
                });

                // 2. Fetch Student's Successful Submissions
                // We assume 'status: "passed"' means they solved the problem
                const submissionsRef = collection(db, 'submissions');
                const q = query(
                    submissionsRef, 
                    where("studentId", "==", currentUser.uid),
                    where("status", "==", "passed")
                );
                const solvedSnap = await getDocs(q);
                
                // Get unique question IDs solved
                const solvedIds = new Set(solvedSnap.docs.map(doc => doc.data().questionId));

                const completedCount = solvedIds.size;
                const totalCount = accessibleQuestions.length;
                const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

                setStats({
                    completed: completedCount,
                    total: totalCount,
                    percentage: percent
                });
            } catch (error) {
                console.error("Error calculating progress:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProgress();
    }, [currentUser, collegeId]);

    if (loading) return <div className="animate-pulse bg-gray-800 h-32 rounded-xl border border-gray-700"></div>;

    return (
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg relative overflow-hidden group">
            {/* Background Decorative Glow */}
            <div className="absolute top-0 right-0 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-blue-600/10 rounded-full filter blur-2xl group-hover:bg-blue-600/20 transition-all"></div>

            <div className="flex justify-between items-end mb-4">
                <div>
                    <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Learning Progress</h2>
                    <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-black text-white">{stats.percentage}%</span>
                        <span className="text-gray-500 text-sm font-medium">Mastered</span>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-xs text-gray-500 font-mono">
                        <span className="text-blue-400 font-bold">{stats.completed}</span> / {stats.total} Tasks
                    </p>
                </div>
            </div>

            {/* Progress Bar Container */}
            <div className="w-full bg-gray-900 h-3 rounded-full overflow-hidden border border-gray-700">
                <div 
                    className="h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(37,99,235,0.4)]"
                    style={{ width: `${stats.percentage}%` }}
                ></div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-700/50">
                    <p className="text-[10px] text-gray-500 uppercase font-bold">Solved</p>
                    <p className="text-lg font-bold text-green-400">{stats.completed}</p>
                </div>
                <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-700/50">
                    <p className="text-[10px] text-gray-500 uppercase font-bold">Remaining</p>
                    <p className="text-lg font-bold text-gray-300">{stats.total - stats.completed}</p>
                </div>
            </div>
        </div>
    );
};

export default ProgressTracker;