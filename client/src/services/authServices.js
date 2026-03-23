import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

// USER REGISTRATION
export const handleRegister = async (formData) => {
    try {
        const response = await axios.post(`${API_URL}/api/user/register`, formData);
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to register account'
        };
    }
};

// LOGIN USER 
export const handleLogin = async (formData) => {
    try {
        const response = await axios.post(`${API_URL}/api/user/login`, formData, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to login account'
        };
    }
};

// LOGOUT USER
export const logoutUser = async () => {
    try {
        const response = await axios.get(`${API_URL}/api/user/logout`, { withCredentials: true });
        return response.data;

    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to logout'
        };
    }
};

// FETCH USER 
export const fetchUser = async () => {
    try {
        const response = await axios.get(`${API_URL}/api/user/fetch`, { withCredentials: true });
        if (response.data && response.data.user) {
            return response.data.user;
        }
        return null;
    } catch (error) {
        console.error('Fetch user error:', error);
        return null;
    }
};
