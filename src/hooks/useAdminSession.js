import { useState, useEffect, useCallback } from 'react';

export function useAdminSession() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [attemptCount, setAttemptCount] = useState(0);
    const [lockoutTime, setLockoutTime] = useState(null);

    // Verify existing session cookie on mount
    const verifySession = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/admin/auth', {
                method: 'GET',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' }
            });

            if (res.ok) {
                const data = await res.json();
                setIsAuthenticated(data.authenticated === true);
            } else {
                setIsAuthenticated(false);
            }
        } catch (err) {
            setIsAuthenticated(false);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        verifySession();
    }, [verifySession]);

    // Handle Login
    const login = async (password) => {
        if (lockoutTime && Date.now() < lockoutTime) {
            const secondsLeft = Math.ceil((lockoutTime - Date.now()) / 1000);
            throw new Error(`Too many failed attempts. Please wait ${secondsLeft}s before retrying.`);
        }

        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch('/api/admin/auth', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                const newAttempts = attemptCount + 1;
                setAttemptCount(newAttempts);

                if (newAttempts >= 5) {
                    const lockUntil = Date.now() + 60000; // 60s lockout
                    setLockoutTime(lockUntil);
                    throw new Error('Too many failed attempts. Account locked for 60 seconds.');
                }

                throw new Error(data.error || 'Invalid admin passcode');
            }

            // Success
            setAttemptCount(0);
            setLockoutTime(null);
            setIsAuthenticated(true);
            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    // Handle Logout
    const logout = async () => {
        setIsLoading(true);
        try {
            await fetch('/api/admin/logout', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' }
            });
            setIsAuthenticated(false);
        } catch (err) {
            console.error('Logout error:', err);
            setIsAuthenticated(false);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isAuthenticated,
        isLoading,
        error,
        login,
        logout,
        refreshSession: verifySession
    };
}
