// src/App.tsx
import React, { useState } from 'react';

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

  return (
    <div className="App">
      {!isLoggedIn && <LandingPage />}

      {!isLoggedIn && <Login onLogin={handleLogin} />}

      {isLoggedIn && userRole !== 'guest' && (
        <Dashboard
          userRole={userRole}
          onLogout={handleLogout}
          setUserRole={setUserRole}
        />
      )}
    </div>
  );
};

export default App;
