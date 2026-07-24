import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

const normalizeUserPayload = (payload) => {
  if (!payload) return null;

  if (payload?.data && typeof payload.data === 'object' && !Array.isArray(payload.data)) {
    return {
      ...payload.data,
      token: payload.data.token || payload.token,
    };
  }

  return payload;
};

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const userInfo = localStorage.getItem('userInfo');
      if (userInfo) {
        const parsed = JSON.parse(userInfo);
        setUser(normalizeUserPayload(parsed));
      }
    } catch (error) {
      console.warn('Unable to restore auth state:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      const normalized = normalizeUserPayload(data);
      setUser(normalized);
      localStorage.setItem('userInfo', JSON.stringify(normalized));
      return normalized;
    } catch (error) {
      throw error.response?.data?.message || 'Login failed';
    }
  };

  const register = async (name, email, password) => {
    try {
      const { data } = await api.post('/auth/register', { name, email, password });
      const normalized = normalizeUserPayload(data);
      setUser(normalized);
      localStorage.setItem('userInfo', JSON.stringify(normalized));
      return normalized;
    } catch (error) {
      throw error.response?.data?.message || 'Registration failed';
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userInfo');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
