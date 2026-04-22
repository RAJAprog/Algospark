// src/core/useAuth.js

import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext'; // Make sure this path is correct

export const useAuth = () => {
  // This hook is a clean shortcut to use the AuthContext
  return useContext(AuthContext);
};