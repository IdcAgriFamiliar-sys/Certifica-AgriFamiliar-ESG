import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import type { UserRole } from "../types";

interface Props {
  children: React.ReactNode;
  roles?: UserRole[] | UserRole;
}

const ProtectedRoute: React.FC<Props> = ({ children, roles }) => {
  const { user, isAllowed } = useAuth();

  if (!user) return <Navigate to="/login" />;
  if (roles && !isAllowed(roles)) return <Navigate to="/dashboard" />;

  return <>{children}</>;
};

export default ProtectedRoute;
