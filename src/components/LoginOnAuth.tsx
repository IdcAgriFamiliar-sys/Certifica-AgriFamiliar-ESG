// src/components/LoginOnAuth.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Login from './Login';
import { useAuth } from '../contexts/AuthContext';

const LoginOnAuth: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (email: string, senha: string) => {
    try {
      await login(email, senha);
      // após login, redireciona para dashboard
      navigate('/dashboard');
    } catch (err: any) {
      alert(err?.message || 'Erro ao logar');
    }
  };

  return <Login onLogin={handleLogin} />;
};

export default LoginOnAuth;
