import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole } from '@/types';
import { EstudianteRepository } from '@/datos/repository/estudianteRepository';
import { Estudiante } from '@/datos/model/estudianteModel';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Instancia del repositorio de estudiantes
const estudianteRepo = new EstudianteRepository();

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = async (email: string, password: string): Promise<boolean> => {
    // Autenticación de estudiante
    const estudiante: Estudiante | undefined = estudianteRepo.authenticate(email, password);
    if (estudiante) {
      const estudianteUser: User = {
        id: estudiante.id,
        name: estudiante.nombre,
        email: estudiante.correo,
        role: 'estudiante',
      };
      setUser(estudianteUser);
      localStorage.setItem('user', JSON.stringify(estudianteUser));
      return true;
    }

    // Autenticación genérica para técnico y admin
    const genericUsers: Array<{ email: string; password: string; user: User }> = [
      {
        email: 'tecnico@espe.edu.ec',
        password: '123456',
        user: {
          id: '2',
          name: 'María García López',
          email: 'tecnico@espe.edu.ec',
          role: 'tecnico',
        },
      },
      {
        email: 'admin@espe.edu.ec',
        password: '123456',
        user: {
          id: '3',
          name: 'Juan Pérez Martínez',
          email: 'admin@espe.edu.ec',
          role: 'admin',
        },
      },
    ];

    const found = genericUsers.find(u => u.email === email && u.password === password);
    if (found) {
      setUser(found.user);
      localStorage.setItem('user', JSON.stringify(found.user));
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
