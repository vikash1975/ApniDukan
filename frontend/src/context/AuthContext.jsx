import React, { createContext, useState, useCallback, useEffect } from 'react';
import { userSignup, userLogin, adminSignup, adminLogin } from '../services/api';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize from localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const userData = localStorage.getItem('user');
    
    if (token && role) {
      setUser({
        token,
        role,
        ...JSON.parse(userData || '{}'),
      });
    }
  }, []);

  const signup = useCallback(async (name, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await userSignup({ name, email, password });
      const { token, user: userData } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('role', 'user');
      localStorage.setItem('user', JSON.stringify(userData));
      
      setUser({
        token,
        role: 'user',
        ...userData,
      });
      
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Signup failed';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await userLogin({ email, password });
      const { token } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('role', 'user');
      localStorage.setItem('user', JSON.stringify({ email }));
      
      setUser({
        token,
        role: 'user',
        email,
      });
      
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Login failed';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const adminSignUpFunc = useCallback(async (name, email, password, adminSecret) => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminSignup({ name, email, password, adminSecret });
      const { token } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('role', 'admin');
      localStorage.setItem('user', JSON.stringify({ email, name }));
      
      setUser({
        token,
        role: 'admin',
        email,
        name,
      });
      
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Admin signup failed';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const adminLoginFunc = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminLogin({ email, password });
      const { token } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('role', 'admin');
      localStorage.setItem('user', JSON.stringify({ email }));
      
      setUser({
        token,
        role: 'admin',
        email,
      });
      
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Admin login failed';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    setUser(null);
    setError(null);
  }, []);

  const isAuthenticated = !!user && !!localStorage.getItem('token');
  const isAdmin = user?.role === 'admin';
  const isUserRole = user?.role === 'user';

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        signup,
        login,
        adminSignUp: adminSignUpFunc,
        adminLogin: adminLoginFunc,
        logout,
        isAuthenticated,
        isAdmin,
        isUserRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
