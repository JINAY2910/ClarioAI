import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { User } from '../types';

interface AuthContextType {
    user: User | null;
    login: (userData?: Partial<User>) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    const login = (userData?: Partial<User>) => {
        // Mock login with provided data or default
        setUser({
            id: '1',
            name: userData?.name || 'Jinay Shah',
            email: userData?.email || 'jinay@example.com',
            avatar: userData?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData?.name || 'Jinay Shah')}&background=4ade80&color=0a0a0a`
        });
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
