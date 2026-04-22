import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../hooks/useAuth';

const ExamDashboardPage = () => {
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const { currentUser, userType, collegeId } = useAuth();
    const history = useHistory();

    useEffect(() => {
        const fetchExams = async () => {
            if (!currentUser) return;
            setLoading(true);
            try {
                let examsList = [];
                
                // 1. Logic: Fetch exams based on User Type
                // If user is 'college', fetch exams where assignedCollegeId matches their ID
                if (userType === 'college' && collegeId) {
                    const q = query(
                        collection(db, 'exams'),
                        where('assignedCollegeId', '==', collegeId),
                        orderBy('createdAt', 'desc')
                    );
                    const snap = await getDocs(q);
                    examsList = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                } 
                
                // 2. Also fetch Public/Global exams for everyone
                const publicQ = query(
                    collection(db, 'exams'),
                    where('isPublic', '==', true),
                    orderBy('createdAt', 'desc')
                );
                const publicSnap = await getDocs(publicQ);
                const publicExams = publicSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                // Merge and remove duplicates
                const combined = [...examsList, ...publicExams];
                const uniqueExams = combined.filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);
                
                setExams(uniqueExams);
            } catch (error) {
                console.error("Error fetching exams:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchExams();
    }, [currentUser, userType, collegeId]);

    const handleStartExam = (exam) => {
        history.push(`/exam/${exam.id}`);
    };

    if (loading) return <div style={centerStyle}>Loading your assessments...</div>;

    return (
        <div style={containerStyle}>
            <header style={headerStyle}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Assigned Exams</h1>
                <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                    {userType === 'college' ? `Institutional Portal: ${collegeId}` : 'General Access Portal'}
                </p>
            </header>

            <div style={gridStyle}>
                {exams.length > 0 ? (
                    exams.map((exam) => (
                        <div key={exam.id} style={cardStyle}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <span style={badgeStyle(exam.isPublic ? 'Public' : 'Institutional')}>
                                    {exam.isPublic ? 'Global' : 'Exclusive'}
                                </span>
                                <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                                    {exam.durationMinutes} Mins
                                </span>
                            </div>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>{exam.title}</h3>
                            <p style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '1.5rem', lineHeight: '1.4' }}>
                                {exam.description?.substring(0, 100)}...
                            </p>
                            <button 
                                onClick={() => handleStartExam(exam)}
                                style={buttonStyle}
                            >
                                Start Assessment
                            </button>
                        </div>
                    ))
                ) : (
                    <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>
                        No exams assigned to you at this time.
                    </div>
                )}
            </div>
        </div>
    );
};

/* ── STYLES ── */
const containerStyle = { padding: '2rem', maxWidth: '1200px', margin: '0 auto', fontFamily: "'Times New Roman', Times, serif" };
const headerStyle = { marginBottom: '2.5rem', borderBottom: '1px solid #f3f4f6', paddingBottom: '1.5rem' };
const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' };
const cardStyle = { background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' };
const badgeStyle = (type) => ({ fontSize: '0.65rem', fontWeight: 700, padding: '2px 8px', borderRadius: '99px', background: type === 'Public' ? '#f3f4f6' : '#fff4f0', color: type === 'Public' ? '#6b7280' : '#ff6b35', border: `1px solid ${type === 'Public' ? '#e5e7eb' : '#ffd5c2'}` });
const buttonStyle = { width: '100%', background: '#ff6b35', color: '#fff', border: 'none', borderRadius: '8px', padding: '0.6rem', fontWeight: 700, cursor: 'pointer', transition: 'background 0.2s' };
const centerStyle = { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#6b7280' };

export default ExamDashboardPage;