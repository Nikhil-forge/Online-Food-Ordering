import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from './Loader';

export default function ProtectedRoute({ admin = false, children }) {
  const { user, authLoading } = useAuth();
  
  if (authLoading) return <Loader />;
  
  if (!user) return <Navigate to="/login" replace />;
  if (admin && user.role !== 'admin') return <Navigate to="/" replace />;
  
  return children;
}
