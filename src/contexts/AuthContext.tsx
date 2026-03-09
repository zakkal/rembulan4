import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
  login: (email: string, password: string, role: UserRole) => boolean;
  register: (data: RegisterData) => boolean;
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
      setUser(JSON.parse(saved));
    }
    setIsLoading(false);
  }, []);

  const login = (email: string, password: string, role: UserRole): boolean => {
    const allUsers = JSON.parse(localStorage.getItem('rembulan_all_users') || JSON.stringify(DEMO_USERS));
    const found = allUsers.find((u: any) => u.email === email && u.password === password && u.role === role);
    if (found) {
      const { password: _, ...userData } = found;
      setUser(userData);
      localStorage.setItem('rembulan_user', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const register = (data: RegisterData): boolean => {
    const allUsers = JSON.parse(localStorage.getItem('rembulan_all_users') || JSON.stringify(DEMO_USERS));
    const exists = allUsers.find((u: any) => u.email === data.email);
    if (exists) return false;
    const newUser = {
      id: data.role === 'mentor' ? `m${Date.now()}` : `w${Date.now()}`,
      name: data.name,
      email: data.email,
      whatsapp: data.whatsapp,
      role: data.role,
      password: data.password,
      muridId: data.muridId,
    };
    allUsers.push(newUser);
    localStorage.setItem('rembulan_all_users', JSON.stringify(allUsers));
    const { password: _, ...userData } = newUser;
    setUser(userData);
    localStorage.setItem('rembulan_user', JSON.stringify(userData));
    return true;
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
