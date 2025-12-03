// src/components/ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import type { UserRole } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allow?: UserRole[] | UserRole; // roles permitidos
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allow = [], redirectTo = '/login' }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to={redirectTo} replace />;

  const allowed = Array.isArray(allow) ? allow : [allow];
  if (allowed.length === 0) return <>{children}</>; // se não passou roles, qualquer usuário autenticado pode acessar

  if (!allowed.includes(user.role)) {
    // pode redirecionar para dashboard do próprio usuário
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
