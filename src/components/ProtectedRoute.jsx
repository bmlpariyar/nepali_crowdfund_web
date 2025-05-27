// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const auth = useAuth();
    const location = useLocation();
    if (!auth || auth.isLoading) {

        return <div>Loading authentication...</div>;
    }

    const { user } = auth;
    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    return children;
};

export default ProtectedRoute;