import React, { useState, useEffect } from "react";
import LandingPage from "./components/LandingPage";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import FarmerRegistrationForm from "./components/FarmerRegistrationForm";
import AuditorRegistrationForm from "./components/AuditorRegistrationForm";

export type UserRole =
  | "admin"
  | "gestor"
  | "coordenador"
  | "auditor"
  | "agricultor"
  | "guest";

type Page =
  | "landing"
  | "login"
  | "dashboard"
  | "farmer-register"
  | "auditor-register";

const App: React.FC = () => {
  const [userRole, setUserRole] = useState<UserRole>("guest");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [page, setPage] = useState<Page>("landing");

  useEffect(() => {
    const p = window.location.pathname;
    if (p === "/login") setPage("login");
    else if (p === "/farmer-register") setPage("farmer-register");
    else if (p === "/auditor-register") setPage("auditor-register");
  }, []);

  const handleLogin = (role: UserRole) => {
    setUserRole(role);
    setIsLoggedIn(true);
    setPage("dashboard");
  };

  const handleLogout = () => {
    setUserRole("guest");
    setIsLoggedIn(false);
    setPage("landing");
  };

  const go = (to: Page) => {
    setPage(to);
    const mapping: Record<Page, string> = {
      landing: "/",
      login: "/login",
      dashboard: "/dashboard",
      "farmer-register": "/farmer-register",
      "auditor-register": "/auditor-register",
    };
    try {
      window.history.replaceState({}, "", mapping[to]);
    } catch {}
  };

  return (
    <div className="App min-h-screen bg-gray-50">
      {page === "landing" && (
        <LandingPage
          onOpenLogin={() => go("login")}
          onOpenFarmerRegister={() => go("farmer-register")}
          onOpenAuditorRegister={() => go("auditor-register")}
        />
      )}

      {page === "login" && (
        <Login onLogin={handleLogin} onBack={() => go("landing")} />
      )}

      {page === "farmer-register" && (
        <div className="p-6">
          <button
            onClick={() => go("landing")}
            className="mb-4 text-sm text-blue-600"
          >
            ← Voltar
          </button>
          <FarmerRegistrationForm />
        </div>
      )}

      {page === "auditor-register" && (
        <div className="p-6">
          <button
            onClick={() => go("landing")}
            className="mb-4 text-sm text-blue-600"
          >
            ← Voltar
          </button>
          <AuditorRegistrationForm />
        </div>
      )}

      {page === "dashboard" && isLoggedIn && userRole !== "guest" && (
        <Dashboard
          userRole={userRole}
          onLogout={handleLogout}
          setUserRole={setUserRole}
          go={go}
        />
      )}
    </div>
  );
};

export default App;
