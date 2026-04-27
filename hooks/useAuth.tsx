import React, { createContext, useState, useContext } from 'react';

type UserRole = 'user' | 'admin';

interface AuthContextType {
  isLoggedIn: boolean;
  role: UserRole | null;
  username: string;
  login: (username: string, role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<UserRole | null>(null);
  const [username, setUsername] = useState('');

  const login = (name: string, userRole: UserRole) => {
    setUsername(name);
    setRole(userRole);
    setIsLoggedIn(true);
  };

  const logout = () => {
    setUsername('');
    setRole(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, role, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
