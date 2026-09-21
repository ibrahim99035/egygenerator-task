import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from 'react';

import type { User, AuthResponse } from '../types/auth.types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: AuthResponse) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function readStoredToken(): string | null {
  return localStorage.getItem('accessToken');
}

function readStoredUser(): User | null {
  const storedUser = localStorage.getItem('user');
  return storedUser ? (JSON.parse(storedUser) as User) : null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  // Read localStorage synchronously on first render (avoids the
  // flash-of-unauthenticated-content and satisfies lint rules that
  // disallow setting state directly inside effects).
  const [user, setUser] = useState<User | null>(readStoredUser);
  const [token, setToken] = useState<string | null>(readStoredToken);
  // localStorage is read synchronously, so there is no async
  // hydration phase; kept for API compatibility with ProtectedRoute.
  const [isLoading] = useState(false);

  const login = (data: AuthResponse) => {
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('user', JSON.stringify(data.user));
    setToken(data.accessToken);
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// The hook must live beside the provider; this rule only guards HMR
// fast-refresh ergonomics, so it is intentionally disabled here.
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}