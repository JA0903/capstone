/* eslint-disable react-refresh/only-export-components */

import { useState, useEffect, createContext } from 'react';
import { fetchAdmin } from '../services/authServices';

export const UserContext = createContext();

export function AuthProvider({ children }) {
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);

    // Initialize auth from localStorage and verify with backend
    useEffect(() => {
        const initializeAuth = async () => {
            try {
                // Try to load from localStorage first (instant UI load)
                const cachedAdmin = localStorage.getItem('admin');
                if (cachedAdmin) {
                    try {
                        setAdmin(JSON.parse(cachedAdmin));
                    } catch (e) {
                        localStorage.removeItem('admin');
                    }
                }

                // Verify token with backend
                const response = await fetchAdmin();
                if (response && response.id) {
                    setAdmin(response);
                    // Update cache with latest data from backend
                    localStorage.setItem('admin', JSON.stringify(response));
                } else {
                    // No valid session
                    setAdmin(null);
                    localStorage.removeItem('admin');
                }
            } catch (error) {
                setAdmin(null);
                localStorage.removeItem('admin');
            } finally {
                setLoading(false);
            }
        };
        initializeAuth();
    }, []);

    // Enhanced setAdmin to persist to localStorage
    const handleSetAdmin = (newAdmin) => {
        setAdmin(newAdmin);
        if (newAdmin) {
            localStorage.setItem('admin', JSON.stringify(newAdmin));
        } else {
            localStorage.removeItem('admin');
        }
    };

    return (
        <UserContext.Provider value={{ admin, setAdmin: handleSetAdmin, isAuthenticated: !!admin, loading }}>
            {children}
        </UserContext.Provider>
    );
}
