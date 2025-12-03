// src/App.tsx

import React, { useState, useEffect } from "react";

// Importações corrigidas
import LandingPage from "./components/LandingPage";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";

export type UserRole = "agricultor" | "auditor" | "admin" | "guest";

const App: React.FC = () => {
  const [userRole, setUserRole] = useState<UserRole>("guest");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Controle simples de navegação (sem React Router)
  const [currentPage, setCurrentPage] = useState<string>("landing");

  const handleLogin = (role: UserRole) => {
    setUserRole(role);
    setIsLoggedIn(true);
    setCurrentPage("dashboard");
  };

  const handleLogout = () => {
    setUserRole("guest");
    setIsLoggedIn(false);
    setCurrentPage("landing");
  };

  // Caso o usuário tente acessar /login digitando direto na URL
  useEffect(() => {
    if (window.location.pathname === "/login") {
      setCurrentPage("login");
    }
  }, []);

  // Renderização baseada na página atual
  const renderPage = () => {
    if (isLoggedIn && userRole !== "guest") {
      return (
        <Dashboard
          userRole={userRole}
          onLogout={handleLogout}
          setUserRole={setUserRole}
        />
      );
    }

    if (currentPage === "login") {
      return <Login onLogin={handleLogin} />;
    }

    return (
      <LandingPage
        goToLogin={() => setCurrentPage("login")}
        goToRegisterFarmer={() => setCurrentPage("login")}
        goToRegisterAuditor={() => setCurrentPage("login")}
      />
    );
  };

  return <div className="App">{renderPage()}</div>;
};

export default App;
