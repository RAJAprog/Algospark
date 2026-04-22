// // src/components/exam/student/ExamListItem.jsx

// import React from 'react';

// const ExamListItem = ({ exam, onStart }) => {
//     return (
//         <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 flex justify-between items-center">
//             <div>
//                 <h3 className="text-xl font-bold text-white">{exam.title}</h3>
//                 <p className="text-sm text-gray-400 mt-1">{exam.collegeName}</p>
//                 <p className="text-sm text-gray-500 mt-2">Duration: {exam.durationInMinutes} minutes</p>
//             </div>
//             <button
//                 onClick={() => onStart(exam.id)}
//                 className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-6 rounded-lg transition-colors"
//             >
//                 Start Exam
//             </button>
//         </div>
//     );
// };

// export default ExamListItem;






import React, { useState, useEffect } from 'react';

const ExamListItem = ({ exam, onStart }) => {
    const [status, setStatus] = useState('upcoming'); // 'upcoming', 'active', 'expired'
    const [timeLeftToStart, setTimeLeftToStart] = useState('');

    useEffect(() => {
        const updateExamStatus = () => {
            const now = new Date();
            const start = exam.scheduledStartTime?.toDate ? exam.scheduledStartTime.toDate() : new Date(exam.scheduledStartTime);
            const end = exam.scheduledEndTime?.toDate ? exam.scheduledEndTime.toDate() : new Date(exam.scheduledEndTime);

            if (now < start) {
                setStatus('upcoming');
                // Calculate time remaining until start
                const diff = start - now;
                const hours = Math.floor(diff / (1000 * 60 * 60));
                const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                setTimeLeftToStart(`${hours}h ${mins}m`);
            } else if (now >= start && now <= end) {
                setStatus('active');
            } else {
                setStatus('expired');
            }
        };

        updateExamStatus();
        const interval = setInterval(updateExamStatus, 60000); // Re-check every minute
        return () => clearInterval(interval);
    }, [exam]);

    const getStatusStyles = () => {
        switch (status) {
            case 'active': return 'border-green-500/50 bg-green-500/5';
            case 'expired': return 'border-red-500/30 bg-gray-800/50 opacity-75';
            default: return 'border-gray-700 bg-gray-800';
        }
    };

    return (
        <div className={`p-6 rounded-xl border transition-all duration-300 flex flex-col md:flex-row justify-between items-center gap-4 ${getStatusStyles()}`}>
            <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-white tracking-tight">{exam.title}</h3>
                    {status === 'active' && (
                        <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                    )}
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
                    <p className="text-sm text-gray-400 flex items-center gap-2">
                        <span className="text-blue-400">🕒</span> {exam.durationInMinutes} Minutes
                    </p>
                    <p className="text-sm text-gray-400 flex items-center gap-2">
                        <span className="text-purple-400">📅</span> 
                        {exam.scheduledStartTime?.toDate().toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 col-span-2">
                        Window: {exam.scheduledStartTime?.toDate().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} 
                        - {exam.scheduledEndTime?.toDate().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </p>
                </div>
            </div>

            <div className="flex flex-col items-center gap-2 min-w-[140px]">
                {status === 'active' ? (
                    <button
                        onClick={() => onStart(exam.id)}
                        className="w-full bg-green-600 hover:bg-green-500 text-white font-black py-2.5 px-6 rounded-lg shadow-lg shadow-green-900/20 transition-transform active:scale-95"
                    >
                        START NOW
                    </button>
                ) : status === 'upcoming' ? (
                    <div className="text-center">
                        <button
                            disabled
                            className="w-full bg-gray-700 text-gray-400 font-bold py-2.5 px-6 rounded-lg cursor-not-allowed border border-gray-600"
                        >
                            LOCKED
                        </button>
                        <p className="text-[10px] text-blue-400 mt-2 font-mono uppercase tracking-tighter">
                            Opens in {timeLeftToStart}
                        </p>
                    </div>
                ) : (
                    <button
                        disabled
                        className="w-full bg-red-900/20 text-red-500 font-bold py-2.5 px-6 rounded-lg border border-red-900/30 cursor-not-allowed"
                    >
                        EXPIRED
                    </button>
                )}
            </div>
        </div>
    );
};

export default ExamListItem;