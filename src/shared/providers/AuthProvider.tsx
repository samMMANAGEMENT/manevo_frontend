import React, { createContext, useContext, useEffect, useState } from 'react';
import authService from '../../modules/auth/services/authService';

interface User {
    id: number;
    email: string;
    entity_id?: number;
    operator: {
        name: string;
        type_document: string;
        document: string;
        mobile: string | null;
    } | null;
    permissions: string[];
    roles: string[];
    password_changed_at: string | null;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    loading: boolean;
    login: (user: User, token: string) => void;
    logout: () => void;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    const login = (newUser: User, newToken: string) => {
        setUser(newUser);
        setToken(newToken);
        localStorage.setItem('user', JSON.stringify(newUser));
        localStorage.setItem('token', newToken);
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };

    const refreshUser = async () => {
        try {
            const userData = await authService.me();
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
        } catch (error) {
            console.error('Error refreshing user:', error);
            // If /api/me fails, it might mean the token is invalid
            logout();
        }
    };

    useEffect(() => {
        const initAuth = async () => {
            if (token) {
                await refreshUser();
            }
            setLoading(false);
        };

        initAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ user, token, loading, login, logout, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
