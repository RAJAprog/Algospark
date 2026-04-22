// src/pages/FacultyForgotPasswordPage.jsx

import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const FacultyForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { sendFacultyPasswordReset } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setMessage('');

        try {
            await sendFacultyPasswordReset(email);
            setMessage('Success! A password reset link has been sent to your email address.');
        } catch (err) {
            setError('Failed to send reset email. Please ensure the email address is correct.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
            <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-lg shadow-lg">
                <div>
                    <h2 className="text-center text-3xl font-extrabold text-white">
                        Reset Faculty Password
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-400">
                        Enter your email to receive a reset link.
                    </p>
                </div>
                
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email-address" className="block text-sm font-medium text-gray-300">
                            Email address
                        </label>
                        <input
                            id="email-address"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-blue-500"
                            placeholder="your.email@college.edu"
                        />
                    </div>
                    
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500"
                    >
                        {isLoading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                </form>

                {error && <p className="mt-4 text-center text-sm text-red-400">{error}</p>}
                {message && <p className="mt-4 text-center text-sm text-green-400">{message}</p>}
                
                <p className="mt-2 text-center text-sm text-gray-500">
                    Remembered your password?{' '}
                    <Link to="/faculty-login" className="font-medium text-blue-400 hover:text-blue-300">
                        Back to Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default FacultyForgotPasswordPage;