import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ userType, allowedRoles, children }) {
    if (!allowedRoles.includes(userType)) {
        return <Navigate to="/unauthorized" replace />;
    }
    return children;
}