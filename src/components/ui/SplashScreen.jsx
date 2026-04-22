import React from 'react';
import { Link } from 'react-router-dom';

const SplashScreen = ({ show, onClose }) => {
  if (!show) return null;

  return (
    <div className="absolute inset-0 bg-black bg-opacity-80 z-50 flex flex-col items-center justify-center text-center p-4">
      <div className="bg-gray-800 p-8 rounded-xl shadow-2xl border border-blue-500/50">
        <h2 className="text-3xl font-bold text-white mb-3">Enjoying V-CodeX?</h2>
        <p className="text-gray-300 mb-6">
          Sign in to save your projects, collaborate with teams, and unlock all features.
        </p>
        <Link
          to="/login"
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform transform hover:scale-105"
        >
          Login or Sign Up
        </Link>
        <button onClick={onClose} className="block mx-auto mt-4 text-sm text-gray-500 hover:text-white">
          Continue as Guest
        </button>
      </div>
    </div>
  );
};

export default SplashScreen;