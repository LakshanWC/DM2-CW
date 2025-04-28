import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState({
        id: 'SUP001',
        name: 'Supplier 1',
        type: 'supplier' // 'admin', 'supplier', or 'customer'
    });

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
}