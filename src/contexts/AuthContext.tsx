import React, { createContext, useState, useCallback, useMemo, useContext } from 'react';
import { useNavigation } from '@react-navigation/native';

interface IUser {
  _id: string;
  email: string;
  name: string;
  role: 'customer' | 'merchant';
  points: number; // Added points to user interface
}

interface IAuthContext {
  isAuthenticated: boolean;
  token: string | null;
  user: IUser | null;
  merchantSecret: string | null;
  signIn: (token: string, userData: IUser) => void;
  signOut: () => void;
  setToken: (token: string | null) => void;
  setMerchantSecret: (secret: string | null) => void;
}

export const AuthContext = createContext<IAuthContext | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<IUser | null>(null);
  const [merchantSecret, setMerchantSecret] = useState<string | null>(null);

  const signIn = useCallback((newToken: string, userData: IUser) => {
    setToken(newToken);
    setUser(userData);
    setIsAuthenticated(true);
    console.log('User signed in:', userData);
  }, []);

  const signOut = useCallback(() => {
    setToken(null);
    setUser(null);
    setMerchantSecret(null);
    setIsAuthenticated(false);
    console.log('User signed out');
  }, []);

  const authContextValue = useMemo(() => ({
    isAuthenticated,
    token,
    user,
    merchantSecret,
    signIn,
    signOut,
    setToken,
    setMerchantSecret,
  }), [isAuthenticated, token, user, merchantSecret, signIn, signOut]);

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
} 