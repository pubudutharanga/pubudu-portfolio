import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaLock, FaKey, FaShieldAlt, FaArrowRight, FaSpinner } from 'react-icons/fa';

export default function AuthGate({ onLogin, isLoading, error }) {
    const [password, setPassword] = useState('');
    const [localError, setLocalError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLocalError('');

        if (!password.trim()) {
            setLocalError('Please enter the admin passcode.');
            return;
        }

        try {
            await onLogin(password);
        } catch (err) {
            setLocalError(err.message || 'Authentication failed');
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200/80 dark:border-gray-800/80 rounded-3xl p-8 shadow-2xl relative overflow-hidden"
            >
                {/* Background Glow Accents */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 text-center mb-8">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/25">
                        <FaShieldAlt size={28} />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Control Center</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                        Enter your secure passcode to manage & publish blogs
                    </p>
                </div>

                {(error || localError) && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm flex items-center gap-3"
                    >
                        <FaLock className="shrink-0" />
                        <span>{localError || error}</span>
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-2">
                            Admin Passcode
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                <FaKey size={14} />
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter admin passcode"
                                autoFocus
                                disabled={isLoading}
                                className="w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                    >
                        {isLoading ? (
                            <>
                                <FaSpinner className="animate-spin" />
                                <span>Verifying...</span>
                            </>
                        ) : (
                            <>
                                <span>Unlock Dashboard</span>
                                <FaArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 text-center">
                    <span className="inline-flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
                        <FaLock size={10} /> 256-Bit Encrypted Admin Session
                    </span>
                </div>
            </motion.div>
        </div>
    );
}
