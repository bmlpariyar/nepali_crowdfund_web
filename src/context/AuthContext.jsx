import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser, fetchUserProfile } from '../services/apiService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('jwtToken'));
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const checkUserStatus = useCallback(async () => {
        const storedToken = localStorage.getItem('jwtToken');
        if (storedToken) {
            setToken(storedToken);
            try {
                const response = await fetchUserProfile();
                setUser(response.data.user);
            } catch (error) {
                localStorage.removeItem('jwtToken');
                setToken(null);
                setUser(null);
            }
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        checkUserStatus();
    }, [checkUserStatus]);

    const login = async (credentials) => {
        try {
            setIsLoading(true);
            const response = await loginUser(credentials);
            const { user: loggedInUser, jwt } = response.data;
            localStorage.setItem('jwtToken', jwt);
            setToken(jwt);
            setUser(loggedInUser);
            navigate('/');
        } catch (error) {
            console.error("Login context failed:", error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (userData) => {
        try {
            setIsLoading(true);
            const response = await registerUser(userData);
            const { user: registeredUser, jwt } = response.data;
            localStorage.setItem('jwtToken', jwt);
            setToken(jwt);
            setUser(registeredUser);
            navigate('/setup-profile/step1')
        } catch (error) {
            console.error("Register context failed:", error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('jwtToken');
        setToken(null);
        setUser(null);
        navigate('/login');
    };

    const updateUserProfileLocally = (updatedProfileData) => {
        setUser(prevUser => {
            if (!prevUser) return null; // Should not happen if user is logged in
            return {
                ...prevUser,
                user_profile: { // Assuming user_profile is always an object on prevUser
                    ...(prevUser.user_profile || {}), // Merge with existing profile fields
                    ...updatedProfileData // Apply updates
                }
            };
        });
    };

    const value = { user, token, isLoading, login, register, logout, updateUserProfileLocally };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    if (context === null && !window.checkedAuthProvider) {

        console.warn('Auth context value is null - Check if AuthProvider wraps the component tree correctly in index.js/main.jsx');
        window.checkedAuthProvider = true;
    }
    return context;
};