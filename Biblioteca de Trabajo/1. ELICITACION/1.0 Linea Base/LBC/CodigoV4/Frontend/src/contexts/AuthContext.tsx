import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole } from '@/types';
import { EstudianteRepository } from '@/datos/repository/estudianteRepository';
import { Estudiante } from '@/datos/model/estudianteModel';
import { api } from '@/services/api';
import { jwtDecode } from "jwt-decode";
import { toast } from "@/hooks/use-toast";

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
    try {
      const response = await api.login(email, password);
      const { token } = response.content;

      localStorage.setItem('token', token);

      // Decode user from token
      const decoded: any = jwtDecode(token);

      // Adapt decoded payload to User interface
      const user: User = {
        id: decoded.id,
        name: decoded.name || decoded.email, // fallback
        email: decoded.email,
        role: (decoded.role?.toLowerCase() || 'estudiante') as UserRole,
      };

      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));

      toast({ title: "Bienvenido", description: `Hola ${user.name}` });
      return true;
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Error de autenticación",
        description: error.message || "No se pudo iniciar sesión",
        variant: "destructive"
      });
      return false;
    }
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
