import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { dataStore } from '@/lib/data';

export type UserRole = 'mentor' | 'wali';

export interface User {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  role: UserRole;
  muridId?: string; // for wali murid
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

interface RegisterData {
  name: string;
  email: string;
  whatsapp: string;
  password: string;
  role: UserRole;
  muridId?: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Demo data
const DEMO_USERS: (User & { password: string })[] = [
  { id: 'm1', name: 'Ahmad', email: 'ahmad@mail.com', whatsapp: '08123456789', role: 'mentor', password: '123456' },
  { id: 'm2', name: 'Yusuf', email: 'yusuf@mail.com', whatsapp: '08234567890', role: 'mentor', password: '123456' },
  { id: 'w1', name: 'Budi (Wali)', email: 'budi@mail.com', whatsapp: '08345678901', role: 'wali', password: '123456', muridId: 's1' },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('rembulan_user');
    if (saved) {
      const parsedUser = JSON.parse(saved);
      setUser(parsedUser);
      dataStore.fetchFromBackend();
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, role: UserRole): Promise<boolean> => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        localStorage.setItem('rembulan_user', JSON.stringify(userData));
        dataStore.fetchFromBackend();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        localStorage.setItem('rembulan_user', JSON.stringify(userData));
        dataStore.fetchFromBackend();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('rembulan_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
