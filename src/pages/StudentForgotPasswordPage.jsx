import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const StudentForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { resetPassword } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setMessage('');

        try {
            await resetPassword(email);
            setMessage('Success! A password reset link has been sent to your email address.');
        } catch (err) {
            setError('Failed to send reset email. Please ensure the email address is correct.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vh] bg-blue-900/40 rounded-full filter blur-3xl opacity-60 pointer-events-none"></div>
            
            <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-lg shadow-xl border border-gray-700 z-10">
                <div>
                    <h2 className="text-center text-3xl font-extrabold text-white">
                        Reset Password
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
                            placeholder="student@college.edu"
                        />
                    </div>
                    
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 transition-colors"
                    >
                        {isLoading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                </form>

                {error && <p className="mt-4 text-center text-sm text-red-400">{error}</p>}
                {message && <p className="mt-4 text-center text-sm text-green-400">{message}</p>}
                
                <p className="mt-6 text-center text-sm text-gray-500">
                    Remembered your password?{' '}
                    <Link to="/login" className="font-medium text-blue-400 hover:text-blue-300">
                        Back to Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default StudentForgotPasswordPage;