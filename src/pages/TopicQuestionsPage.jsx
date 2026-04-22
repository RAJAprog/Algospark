import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';

const TopicQuestionsPage = () => {
    const { topicId } = useParams();
    const history = useHistory();
    const [module, setModule] = useState(null);
    const [questions, setQuestions] = useState([]);

    useEffect(() => {
        const fetchContent = async () => {
            const modSnap = await getDoc(doc(db, 'categories', topicId));
            if (modSnap.exists()) {
                setModule(modSnap.data());
                const qSnap = await getDocs(collection(db, 'questions'));
                const filtered = qSnap.docs
                    .map(d => ({id: d.id, ...d.data()}))
                    .filter(q => modSnap.data().questionIds?.includes(q.id));
                setQuestions(filtered);
            }
        };
        fetchContent();
    }, [topicId]);

    return (
        <div className="min-h-screen bg-gray-900 text-white p-10">
            <button onClick={() => history.goBack()} className="text-blue-400 font-bold mb-4">← Back to Dashboard</button>
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-8 uppercase tracking-tighter">
                {module?.name}
            </h1>

            <div className="grid grid-cols-1 gap-3 max-w-4xl">
                {questions.map((q, idx) => (
                    <div 
                        key={q.id}
                        onClick={() => history.push(`/practice/${q.id}`)}
                        className="bg-gray-800 border border-gray-700 p-5 rounded-xl flex items-center justify-between hover:bg-gray-750 transition-all cursor-pointer group"
                    >
                        <div className="flex items-center gap-6">
                            <span className="text-gray-600 font-black text-xl">{idx + 1}</span>
                            <div>
                                <h3 className="font-bold text-lg group-hover:text-blue-400">{q.title}</h3>
                                <span className="text-[10px] text-gray-500 font-mono">{q.type} | {q.difficulty || 'Beginner'}</span>
                            </div>
                        </div>
                        <span className="text-blue-500 font-black">SOLVE →</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TopicQuestionsPage;