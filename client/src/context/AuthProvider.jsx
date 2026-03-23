/* eslint-disable react-refresh/only-export-components */
import { useState, useEffect, createContext } from 'react';
import { fetchUser } from '../services/authServices';

export const UserContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Initialize auth from localStorage and verify with backend
    useEffect(() => {
        const initializeAuth = async () => {
            try {
                // Try to load from localStorage first (instant UI load)
                const cachedUser = localStorage.getItem('user');
                if (cachedUser) {
                    try {
                        setUser(JSON.parse(cachedUser));
                    } catch (e) {
                        localStorage.removeItem('user');
                    }
                }

                // Verify token with backend
                const response = await fetchUser();
                if (response && typeof response === 'object' && response.id) {
                    setUser(response);
                    // Update cache with latest data from backend
                    localStorage.setItem('user', JSON.stringify(response));
                } else {
                    // No valid session
                    setUser(null);
                    localStorage.removeItem('user');
                }
            } catch (error) {
                console.error('Error initializing auth:', error);
                setUser(null);
                localStorage.removeItem('user');
            } finally {
                setLoading(false);
            }
        };
        initializeAuth();
    }, []);

    // Enhanced setUser to persist to localStorage
    const handleSetUser = (newUser) => {
        setUser(newUser);
        if (newUser) {
            localStorage.setItem('user', JSON.stringify(newUser));
        } else {
            localStorage.removeItem('user');
        }
    };

    return (
        <UserContext.Provider value={{ user, setUser: handleSetUser, isAuthenticated: !!user, loading }}>
            {children}
        </UserContext.Provider>
    );
}
