import React, { useState, useContext } from 'react';
import { useHistory, useLocation, Redirect } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { linkFacultyAccount } from '../api/userService';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

const FacultySetupPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { setupFacultyPassword } = useContext(AuthContext);
    const history = useHistory();
    const location = useLocation();

    const facultyData = location.state?.facultyData;

    if (!facultyData) {
        return <Redirect to="/faculty-login" />;
    }

    const handleFinalSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) return setError("Passwords do not match.");
        setIsLoading(true);
        setError('');

        try {
            const userCredential = await setupFacultyPassword(email, password);
            const newUser = userCredential.user;

            const userRef = doc(db, 'users', newUser.uid);
            await setDoc(userRef, {
                uid: newUser.uid,
                email: email,
                name: facultyData.name,
                role: 'faculty',
                createdAt: new Date(),
            });

            await linkFacultyAccount(facultyData.id, newUser.uid);
            history.push('/faculty-dashboard');
        } catch (err) {
            setError('Failed to create account. This email may already be in use.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
            <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-lg">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-white">Faculty Account Setup</h2>
                    <p className="mt-2 text-gray-400">Welcome, <span className="font-bold text-white">{facultyData.name}</span>.</p>
                    <p className="text-sm text-gray-300 mt-2">Link your official email and create a password.</p>
                </div>

                <form className="space-y-4" onSubmit={handleFinalSubmit}>
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Email Address</label>
                        <input 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                            className="mt-1 w-full bg-gray-700 border-gray-600 rounded-md py-2 px-3 text-white" 
                            placeholder="your.email@college.edu" 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300">New Password</label>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                            className="mt-1 w-full bg-gray-700 border-gray-600 rounded-md py-2 px-3 text-white" 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Confirm Password</label>
                        <input 
                            type="password" 
                            value={confirmPassword} 
                            onChange={(e) => setConfirmPassword(e.target.value)} 
                            required 
                            className="mt-1 w-full bg-gray-700 border-gray-600 rounded-md py-2 px-3 text-white" 
                        />
                    </div>
                    <button 
                        type="submit" 
                        disabled={isLoading} 
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md disabled:bg-gray-500"
                    >
                        {isLoading ? 'Creating Account...' : 'Create Account & Login'}
                    </button>
                </form>

                {error && <p className="mt-4 text-center text-sm text-red-400">{error}</p>}
            </div>
        </div>
    );
};

export default FacultySetupPage;