import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUser, setSession, clearSession } from '../services/api';
import { api } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getUser() || { name: 'Demo User', email: 'user@demo.com', role: 'user' });
  const [cartCount, setCartCount] = useState(0);
  const [authLoading, setAuthLoading] = useState(false);

  const updateCartCount = async () => {
    if (user) {
      try {
        const res = await api.get('/cart');
        setCartCount(res.data.items?.length || 0);
      } catch (err) {
        console.error('Failed to fetch cart count');
      }
    } else {
      setCartCount(0);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        let currentUser = getUser();
        if (!currentUser) {
          console.log('Auto-logging in demo user...');
          const res = await api.post('/auth/login', {
            email: 'user@demo.com',
            password: 'password123'
          });
          setSession(res.data.token, res.data.user);
          currentUser = res.data.user;
          setUser(currentUser);
        }
        
        // Fetch initial cart count
        if (currentUser) {
          const res = await api.get('/cart');
          setCartCount(res.data.items?.length || 0);
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        setAuthLoading(false);
      }
    };
    
    initializeAuth();
  }, []);

  useEffect(() => {
    if (user) {
      updateCartCount();
    }
  }, [user]);

  const login = (token, userData) => {
    setSession(token, userData);
    setUser(userData);
  };

  const logout = () => {
    clearSession();
    setUser(null);
    setCartCount(0);
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, cartCount, updateCartCount, authLoading }}>
      {!authLoading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
