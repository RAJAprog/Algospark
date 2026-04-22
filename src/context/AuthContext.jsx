// import React, { createContext, useState, useEffect, useMemo, useCallback, useContext } from 'react';
// import {
//   onAuthStateChanged,
//   signInWithEmailAndPassword,
//   createUserWithEmailAndPassword,
//   sendPasswordResetEmail,
//   signOut,
//   GoogleAuthProvider,
//   signInWithPopup
// } from 'firebase/auth';
// import { auth } from '../firebase/config';
// import { getUserData } from '../api/userService';

// export const AuthContext = createContext();

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) throw new Error("useAuth must be used within an AuthProvider");
//   return context;
// };

// export const AuthProvider = ({ children }) => {
//   const [currentUser, setCurrentUser] = useState(null);
//   const [userRole, setUserRole] = useState(null);
//   const [authLoading, setAuthLoading] = useState(true);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (user) => {
//       setAuthLoading(true);
//       if (user) {
//         try {
//           const userData = await getUserData(user.uid);
//           setCurrentUser(user);
//           setUserRole(userData?.role || 'student');
//         } catch (error) {
//           setCurrentUser(user);
//           setUserRole('student');
//         }
//       } else {
//         setCurrentUser(null);
//         setUserRole(null);
//       }
//       setAuthLoading(false);
//     });
//     return () => unsubscribe();
//   }, []);

//   // NEW: Unified College Login using Registration Number
//   const collegeLogin = useCallback((regNo, password) => {
//     // Standardizing regNo to email format for Firebase
//     const email = `${regNo.toLowerCase()}@college.edu`;
//     return signInWithEmailAndPassword(auth, email, password);
//   }, []);

//   const studentEmailLogin = useCallback((email, password) => {
//     return signInWithEmailAndPassword(auth, email, password);
//   }, []);

//   const studentEmailSignup = useCallback((email, password) => {
//     return createUserWithEmailAndPassword(auth, email, password);
//   }, []);

//   const studentGoogleLogin = useCallback(() => {
//     const provider = new GoogleAuthProvider();
//     return signInWithPopup(auth, provider);
//   }, []);

//   const appSignOut = useCallback(() => {
//     return signOut(auth);
//   }, []);

//   const value = useMemo(() => ({
//     currentUser,
//     userRole,
//     authLoading,
//     collegeLogin, // Added to value object
//     studentEmailLogin,
//     studentEmailSignup,
//     studentGoogleLogin,
//     appSignOut,
//   }), [currentUser, userRole, authLoading, collegeLogin, studentEmailLogin, studentEmailSignup, studentGoogleLogin, appSignOut]);

//   return (
//     <AuthContext.Provider value={value}>
//       {!authLoading && children}
//     </AuthContext.Provider>
//   );
// };







// import React, { createContext, useState, useEffect, useMemo, useCallback, useContext } from 'react';
// import {
//   onAuthStateChanged,
//   signInWithEmailAndPassword,
//   createUserWithEmailAndPassword,
//   signOut,
//   GoogleAuthProvider,
//   signInWithPopup
// } from 'firebase/auth';
// import { auth, db } from '../firebase/config';
// import { getUserData } from '../api/userService';
// import { doc, getDoc } from 'firebase/firestore';

// export const AuthContext = createContext();

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) throw new Error("useAuth must be used within an AuthProvider");
//   return context;
// };

// export const AuthProvider = ({ children }) => {
//   const [currentUser, setCurrentUser] = useState(null);
//   const [userRole, setUserRole] = useState(null); // 'student' | 'faculty' | 'admin'
//   const [userType, setUserType] = useState(null); // 'college' | 'general'
//   const [collegeId, setCollegeId] = useState(null); // e.g., 'VFSTR', 'SRM'
//   const [authLoading, setAuthLoading] = useState(true);

//   // Sync Auth State with Firestore Metadata
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (user) => {
//       setAuthLoading(true);
//       if (user) {
//         try {
//           const userData = await getUserData(user.uid);
//           setCurrentUser(user);
//           setUserRole(userData?.role || 'student');
          
//           // Identify if they are a College User or General User
//           // College users will have a collegeId associated with their profile
//           if (userData?.collegeId) {
//             setUserType('college');
//             setCollegeId(userData.collegeId);
//           } else {
//             setUserType('general');
//             setCollegeId(null);
//           }
//         } catch (error) {
//           console.error("Auth sync error:", error);
//           setCurrentUser(user);
//           setUserRole('student');
//           setUserType('general');
//         }
//       } else {
//         setCurrentUser(null);
//         setUserRole(null);
//         setUserType(null);
//         setCollegeId(null);
//       }
//       setAuthLoading(false);
//     });
//     return () => unsubscribe();
//   }, []);

//   /**
//    * COLLEGE LOGIN
//    * Logic: Accesses institutional modules. Uses regNo-based email pattern.
//    */
//   const collegeLogin = useCallback((regNo, password) => {
//     const email = `${regNo.toLowerCase()}@college.edu`;
//     return signInWithEmailAndPassword(auth, email, password);
//   }, []);

//   /**
//    * GENERAL LOGIN (Gmail/Email)
//    * Logic: Accesses global practice modules only.
//    */
//   const studentEmailLogin = useCallback((email, password) => {
//     return signInWithEmailAndPassword(auth, email, password);
//   }, []);

//   const studentGoogleLogin = useCallback(async () => {
//     const provider = new GoogleAuthProvider();
//     return signInWithPopup(auth, provider);
//   }, []);

//   const studentEmailSignup = useCallback((email, password) => {
//     return createUserWithEmailAndPassword(auth, email, password);
//   }, []);

//   const facultyLogin = useCallback((email, password) => {
//     return signInWithEmailAndPassword(auth, email, password);
//   }, []);

//   const appSignOut = useCallback(() => {
//     return signOut(auth);
//   }, []);

//   const value = useMemo(() => ({
//     currentUser,
//     userRole,
//     userType,     // Added: 'college' or 'general'
//     collegeId,    // Added: Specific college identifier
//     authLoading,
//     collegeLogin,
//     studentEmailLogin,
//     studentEmailSignup,
//     studentGoogleLogin,
//     facultyLogin,
//     appSignOut,
//   }), [
//     currentUser, 
//     userRole, 
//     userType, 
//     collegeId, 
//     authLoading, 
//     collegeLogin, 
//     studentEmailLogin, 
//     studentEmailSignup, 
//     studentGoogleLogin, 
//     facultyLogin, 
//     appSignOut
//   ]);

//   return (
//     <AuthContext.Provider value={value}>
//       {!authLoading && children}
//     </AuthContext.Provider>
//   );
// };







import React, { createContext, useState, useEffect, useMemo, useCallback, useContext } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth, db } from '../firebase/config';
import { getUserData } from '../api/userService';
import { doc, getDoc } from 'firebase/firestore';

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null); 
  const [userType, setUserType] = useState(null); // 'college' | 'general'
  const [collegeId, setCollegeId] = useState(null); 
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setAuthLoading(true);
      if (user) {
        try {
          const userData = await getUserData(user.uid);
          setCurrentUser(user);
          setUserRole(userData?.role || 'student');
          
          if (userData?.collegeId) {
            setUserType('college');
            setCollegeId(userData.collegeId);
          } else {
            setUserType('general');
            setCollegeId(null);
          }
        } catch (error) {
          console.error("Auth sync error:", error);
          setCurrentUser(user);
          setUserRole('student');
          setUserType('general');
          setCollegeId(null);
        }
      } else {
        setCurrentUser(null);
        setUserRole(null);
        setUserType(null);
        setCollegeId(null);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const collegeLogin = useCallback((regNo, password) => {
    // Logic: Use the internal @mindcode.com domain
    const internalEmail = `${regNo.toLowerCase()}@mindcode.com`;
    return signInWithEmailAndPassword(auth, internalEmail, password);
  }, []);

  const studentEmailLogin = useCallback((email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  }, []);

  const studentGoogleLogin = useCallback(async () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  }, []);

  const studentEmailSignup = useCallback((email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  }, []);

  const facultyLogin = useCallback((email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  }, []);

  const resetPassword = useCallback((email) => {
    return sendPasswordResetEmail(auth, email);
  }, []);

  const appSignOut = useCallback(() => {
    return signOut(auth);
  }, []);

  const value = useMemo(() => ({
    currentUser,
    userRole,
    userType,
    collegeId,
    authLoading,
    collegeLogin,
    studentEmailLogin,
    studentEmailSignup,
    studentGoogleLogin,
    facultyLogin,
    resetPassword,
    appSignOut,
  }), [
    currentUser, 
    userRole, 
    userType, 
    collegeId, 
    authLoading, 
    collegeLogin, 
    studentEmailLogin, 
    studentEmailSignup, 
    studentGoogleLogin, 
    facultyLogin, 
    resetPassword,
    appSignOut
  ]);

  return (
    <AuthContext.Provider value={value}>
      {!authLoading && children}
    </AuthContext.Provider>
  );
};