import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth } from '../firebase/config';
import { getUserData } from '../api/userService';
import { AuthContext } from './AuthContext';

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        const userData = await getUserData(user.uid);
        setUserRole(userData?.role || 'student');
      } else {
        setUserRole(null);
      }
      setAuthLoading(false);
    });

    return unsubscribe;
  }, []);

  const facultyLogin = useCallback((email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  }, []);

  const setupFacultyPassword = useCallback((email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  }, []);

  const studentEmailLogin = useCallback((email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  }, []);

  const studentEmailSignup = useCallback((email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  }, []);

  const studentGoogleLogin = useCallback(() => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
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
    authLoading,
    facultyLogin,
    setupFacultyPassword,
    studentEmailLogin,
    studentEmailSignup,
    studentGoogleLogin,
    resetPassword,
    appSignOut,
  }), [
    currentUser,
    userRole,
    authLoading,
    facultyLogin,
    setupFacultyPassword,
    studentEmailLogin,
    studentEmailSignup,
    studentGoogleLogin,
    resetPassword,
    appSignOut
  ]);

  return (
    <AuthContext.Provider value={value}>
      {!authLoading && children}
    </AuthContext.Provider>
  );
};