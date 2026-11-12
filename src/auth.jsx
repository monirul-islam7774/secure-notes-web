import { createContext, useContext, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { loadAuth, saveAuth } from './storage.js';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(loadAuth);
  const value = {
    token: auth.token,
    user: auth.user,
    login(token, user) {
      const next = { token, user };
      saveAuth(next);
      setAuth(next);
    },
    setUser(user) {
      const next = { token: auth.token, user };
      saveAuth(next);
      setAuth(next);
    },
    logout() {
      saveAuth(null);
      setAuth({ token: null, user: null });
    },
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// UI-level guards only; the backend enforces roles.
export function ProtectedRoute({ children }) {
  const { token } = useAuth();
  const location = useLocation();
  if (!token) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return children;
}

export function AdminRoute({ children }) {
  const { user } = useAuth();
  if (user?.role !== 'admin') return <p className="error">Admins only.</p>;
  return children;
}
