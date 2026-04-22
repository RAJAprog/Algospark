// import { db } from '../firebase/config';
// import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';

// /**
//  * ✅ Checks if a faculty ID exists in the 'faculty' collection.
//  * This will work for ID "02921".
//  */
// export const verifyFacultyId = async (facultyId) => {
//     try {
//         // We create a reference to the specific document using its ID
//         const facultyRef = doc(db, 'faculty', String(facultyId).trim());
//         const docSnap = await getDoc(facultyRef);

//         if (docSnap.exists()) {
//             // Return the data plus the document ID
//             return { id: docSnap.id, ...docSnap.data() };
//         } else {
//             console.error("No faculty document found with ID:", facultyId);
//             return null;
//         }
//     } catch (error) {
//         console.error("Error verifying Faculty ID:", error);
//         throw error;
//     }
// };

// /**
//  * ✅ Fetches a user's profile document from the 'users' collection.
//  */
// export const getUserData = async (uid) => {
//     try {
//         const userRef = doc(db, 'users', uid);
//         const docSnap = await getDoc(userRef);

//         if (docSnap.exists()) {
//             return { id: docSnap.id, ...docSnap.data() };
//         } else {
//             return null;
//         }
//     } catch (error) {
//         console.error("Error fetching user data:", error);
//         return null;
//     }
// };

// /**
//  * ✅ Creates the initial document for any new user (Student or Faculty).
//  */
// // export const createUserDocument = async (uid, userData, role = 'student') => {
// //     const userRef = doc(db, 'users', uid);
// //     await setDoc(userRef, {
// //         uid: uid,
// //         email: userData.email,
// //         name: userData.name,
// //         role: role,
// //         totalScore: 0, // Initialized for Leaderboard
// //         createdAt: new Date(),
// //     });
// // };




// // src/api/userService.js

// export const createUserDocument = async (uid, userData, role = 'student') => {
//     const userRef = doc(db, 'users', uid);
//     await setDoc(userRef, {
//         uid: uid,
//         email: userData.email,
//         name: userData.name,
//         facultyId: userData.facultyId || null, // Only for faculty
//         role: role, // 'student' or 'faculty'
//         totalScore: 0,
//         createdAt: new Date(),
//     });
// };



// /**
//  * ✅ Links a pre-approved faculty profile to their authentication UID.
//  */
// export const linkFacultyAccount = async (facultyId, uid) => {
//     const facultyRef = doc(db, 'faculty', String(facultyId).trim());
//     await updateDoc(facultyRef, { vcodex_uid: uid });
// };












import { db } from '../firebase/config';
import {
    doc,
    getDoc,
    updateDoc,
    setDoc,
    collection,
    query,
    where,
    getDocs,
    serverTimestamp
} from 'firebase/firestore';


/* =========================================================
   STUDENT COLLEGE LINKING (XLSX IMPORT SUPPORT)
   ========================================================= */

export const linkStudentToCollege = async (email, collegeId) => {
    try {

        const usersRef = collection(db, 'users');
        const q = query(usersRef, where("email", "==", email));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {

            // Student already registered → update collegeId
            const userDoc = snapshot.docs[0];

            await updateDoc(doc(db, 'users', userDoc.id), {
                collegeId: collegeId
            });

            return true;

        } else {

            // Student not registered yet → store in whitelist
            await setDoc(doc(db, 'whitelistedStudents', email), {
                email: email,
                collegeId: collegeId,
                status: "pending"
            });

            return false;
        }

    } catch (error) {
        console.error("Error linking student:", error);
        throw error;
    }
};


/* =========================================================
   USER PROFILE FUNCTIONS
   ========================================================= */

export const getUserData = async (uid) => {
    try {

        const userRef = doc(db, 'users', uid);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        }

        return null;

    } catch (error) {
        console.error("Error fetching user data:", error);
        return null;
    }
};


/* =========================================================
   USER ACCOUNT CREATION
   ========================================================= */

export const createUserDocument = async (uid, userData, role = 'student') => {

    const userRef = doc(db, 'users', uid);

    try {

        // Check if student email was pre-whitelisted
        const whitelistRef = doc(db, 'whitelistedStudents', userData.email);
        const whitelistSnap = await getDoc(whitelistRef);

        const assignedCollegeId =
            whitelistSnap.exists()
                ? whitelistSnap.data().collegeId
                : null;

        await setDoc(userRef, {

            uid: uid,
            email: userData.email,
            name: userData.name,

            facultyId: userData.facultyId || null,

            collegeId: assignedCollegeId,

            role: role, // student | faculty

            totalScore: 0,

            createdAt: serverTimestamp()

        });

    } catch (error) {
        console.error("Error creating user document:", error);
        throw error;
    }
};


/* =========================================================
   FACULTY VERIFICATION
   ========================================================= */

export const verifyFacultyId = async (facultyId) => {

    try {

        const facultyRef = doc(db, 'faculty', String(facultyId).trim());
        const docSnap = await getDoc(facultyRef);

        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        }

        console.error("No faculty found with ID:", facultyId);
        return null;

    } catch (error) {

        console.error("Error verifying Faculty ID:", error);
        throw error;

    }
};


/* =========================================================
   FACULTY ACCOUNT LINKING
   ========================================================= */

export const linkFacultyAccount = async (facultyId, uid) => {

    try {

        const facultyRef = doc(db, 'faculty', String(facultyId).trim());

        await updateDoc(facultyRef, {
            vcodex_uid: uid
        });

    } catch (error) {

        console.error("Error linking faculty account:", error);
        throw error;

    }
};