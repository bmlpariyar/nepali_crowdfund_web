// src/components/RegisterPage.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function RegisterPage() {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [error, setError] = useState(null); // Can be string or array
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);
        setLoading(true);

        if (password !== passwordConfirmation) {
            setError("Passwords do not match.");
            return; // Don't set loading true if basic client check fails
        }

        const userData = {
            full_name: fullName,
            email: email,
            password: password,
            password_confirmation: passwordConfirmation,
        };

        try {
            await register(userData);
        } catch (err) {
            console.error("Register error response:", err.response);
            if (err.response && err.response.data && err.response.data.errors) {
                // Handle Rails validation errors (often an object or array)
                let errorMessages = [];
                if (Array.isArray(err.response.data.errors)) {
                    errorMessages = err.response.data.errors;
                } else if (typeof err.response.data.errors === 'object') {
                    // Example: { email: ["has already been taken"], password: ["is too short"] }
                    errorMessages = Object.entries(err.response.data.errors).map(([field, messages]) => `${field.replace('_', ' ')} ${messages.join(', ')}`);
                } else {
                    errorMessages = ['Registration failed due to validation errors.'];
                }
                setError(errorMessages); // Store as an array
            } else if (err.message) {
                setError([err.message]) // Store as array
            }
            else {
                setError(['Registration failed. Please try again.']); // Store as array
            }
            setLoading(false);
        }
        // setLoading(false) // Handled in try/catch or AuthContext finally
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-white to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Create your account
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {/* Error Display */}
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-sm" role="alert">
                            <strong className="font-bold block mb-1">Error:</strong>
                            {/* Render as list if error state holds an array */}
                            {Array.isArray(error) ? (
                                <ul className="list-disc list-inside">
                                    {error.map((e, i) => <li key={i}>{e}</li>)}
                                </ul>
                            ) : (
                                <p>{error}</p> // Fallback for string error
                            )}
                        </div>
                    )}

                    {/* Input Fields Group */}
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
                            <input type="text" id="fullName" name="fullName" required disabled={loading} value={fullName} onChange={(e) => setFullName(e.target.value)}
                                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm disabled:bg-gray-100"
                                placeholder="Your Full Name" />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
                            <input id="email" name="email" type="email" autoComplete="email" required disabled={loading} value={email} onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm disabled:bg-gray-100"
                                placeholder="Email address" />
                        </div>
                        <div>
                            <label htmlFor="password" cclassName="block text-sm font-medium text-gray-700">Password</label>
                            <input id="password" name="password" type="password" autoComplete="new-password" required disabled={loading} value={password} onChange={(e) => setPassword(e.target.value)}
                                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm disabled:bg-gray-100"
                                placeholder="Password" />
                        </div>
                        <div>
                            <label htmlFor="passwordConfirmation" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                            <input id="passwordConfirmation" name="passwordConfirmation" type="password" autoComplete="new-password" required disabled={loading} value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)}
                                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm disabled:bg-gray-100"
                                placeholder="Confirm Password" />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-6 group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Registering...' : 'Register'}
                        </button>
                    </div>
                </form>

                {/* Link to Login */}
                <p className="mt-4 text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                        Login here
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default RegisterPage;