import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useHistory } from 'react-router-dom';
import { auth } from '../firebase/config';
import { signOut } from 'firebase/auth';

const ProfilePage = () => {
  const { currentUser } = useAuth();
  const history = useHistory();

  const handleSignOut = async () => {
    await signOut(auth);
    history.push('/');
  };

  if (!currentUser) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-8">Profile & Settings</h1>
      <div className="bg-gray-800 p-6 rounded-lg max-w-md mx-auto">
        <div className="flex items-center space-x-4 mb-6">
          <img src={currentUser.photoURL} alt="Avatar" className="w-16 h-16 rounded-full" />
          <div>
            <h2 className="text-xl font-bold">{currentUser.displayName}</h2>
            <p className="text-gray-400">{currentUser.email}</p>
          </div>
        </div>
        {/* We will add more settings here later */}
        <button onClick={handleSignOut} className="w-full bg-red-600 hover:bg-red-700 font-semibold py-2 px-4 rounded-lg">
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;