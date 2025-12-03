// src/App.tsx

import React, { useState } from 'react';

// CAMINHOS CORRIGIDOS
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

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
    content = (
      <Dashboard
        userRole={userRole}
        onLogout={handleLogout}
        setUserRole={setUserRole}
      />
    );
  } else if (window.location.pathname === '/login') {
    content = <Login onLogin={handleLogin} />;
  } else {
    content = <LandingPage />;
  }

  return <div className="App">{content}</div>;
};

export default App;
