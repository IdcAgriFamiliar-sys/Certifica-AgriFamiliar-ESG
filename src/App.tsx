// src/App.tsx

import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

// Definição do tipo para Papel do Usuário
export type UserRole = 'agricultor' | 'auditor' | 'admin' | 'guest';

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

  if (isLoggedIn && userRole !== 'guest') {
    // CORREÇÃO: Passando as props userRole, onLogout, e setUserRole para Dashboard
    content = <Dashboard userRole={userRole} onLogout={handleLogout} setUserRole={setUserRole} />;
  } else if (userRole === 'guest' && window.location.pathname === '/login') {
    // CORREÇÃO: Passando a prop onLogin para Login
    content = <Login onLogin={handleLogin} />;
  } else {
    content = <LandingPage />;
  }

  return (
    <div className="App">
      {content}
    </div>
  );
};

export default App;
