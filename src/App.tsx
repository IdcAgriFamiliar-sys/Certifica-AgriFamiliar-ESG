// src/App.tsx

import React, { useState } from 'react';
import LandingPage from './componentes/LandingPage';
import Login from './componentes/Login'; // CORREÇÃO: Usando componentes/
import Dashboard from './componentes/Dashboard'; // CORREÇÃO: Usando componentes/

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
    content = <Dashboard userRole={userRole} onLogout={handleLogout} setUserRole={setUserRole} />;
  } else if (userRole === 'guest' && window.location.pathname === '/login') {
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
