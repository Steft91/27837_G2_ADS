import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole } from '@/types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const mockUsers: Record<string, { password: string; user: User }> = {
  'estudiante@espe.edu.ec': {
    password: '123456',
    user: {
      id: '1',
      name: 'Carlos David Robles Paredes',
      email: 'estudiante@espe.edu.ec',
      role: 'estudiante',
    },
  },
  'tecnico@espe.edu.ec': {
    password: '123456',
    user: {
      id: '2',
      name: 'María García López',
      email: 'tecnico@espe.edu.ec',
      role: 'tecnico',
    },
  },
  'admin@espe.edu.ec': {
    password: '123456',
    user: {
      id: '3',
      name: 'Juan Pérez Martínez',
      email: 'admin@espe.edu.ec',
      role: 'admin',
    },
  },
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = async (email: string, password: string): Promise<boolean> => {
    const mockUser = mockUsers[email];
    if (mockUser && mockUser.password === password) {
      setUser(mockUser.user);
      localStorage.setItem('user', JSON.stringify(mockUser.user));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
