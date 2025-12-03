// src/App.tsx

import React, { useState } from 'react';

// Componentes existentes na pasta components
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

// Agora com todas as roles do sistema
export type UserRole =
  | 'admin'
  | 'gestor'
  | 'coordenador'
  | 'auditor'
  | 'agricultor'
  | 'guest';

const App: React.FC = () => {
  const [userRole, setUserRole] = useState<UserRole>('guest');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = (role: UserRole) => {
    setUserRole(role);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setUserRole('guest');
    setIsLoggedIn(false);
  };

  let content;

  // Usuário logado → vai para dashboard
  if (isLoggedIn && userRole !== 'guest') {
    content = (
      <Dashboard
        userRole={userRole}
        onLogout={handleLogout}
        setUserRole={setUserRole}
      />
    );
  }
  // Tela de login
  else if (window.location.pathname === '/login') {
    content = <Login onLogin={handleLogin} />;
  }
  // Tela pública inicial
  else {
    content = <LandingPage />;
  }

  return <div className="App">{content}</div>;
};

export default App;
