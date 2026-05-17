import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from './Loader';

export default function PublicRoute({ children }) {
  const { user, authLoading } = useAuth();
  
  if (authLoading) return <Loader />;
  if (user) return <Navigate to="/home" replace />;
  
  return children;
}
