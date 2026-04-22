import { db } from '../firebase/config';
import { 
    collection, 
    getDocs, 
    addDoc, 
    serverTimestamp, 
    query, 
    orderBy 
} from 'firebase/firestore';

// Fetch all registered colleges for the faculty dropdown
export const getAllTenants = async () => {
    try {
        const collegesCol = collection(db, 'colleges');
        const q = query(collegesCol, orderBy('name', 'asc'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error("Error fetching tenants:", error);
        return [];
    }
};

// Add a new college/tenant (Admin function)
export const createTenant = async (collegeName) => {
    try {
        const collegesCol = collection(db, 'colleges');
        const docRef = await addDoc(collegesCol, {
            name: collegeName,
            createdAt: serverTimestamp()
        });
        return docRef.id;
    } catch (error) {
        console.error("Error creating tenant:", error);
        throw error;
    }
};