// src/App.tsx
import React, { useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import LandingPage from "./components/LandingPage.tsx";
import LoginOnAuth from "./components/LoginOnAuth.tsx";
import Dashboard from "./components/Dashboard.tsx";
import FarmerRegistrationForm from "./components/FarmerRegistrationForm.tsx";
import AuditorRegistrationForm from "./components/AuditorRegistrationForm.tsx";

import type { UserRole, Page } from "./types";

const App: React.FC = () => {
  const [userRole, setUserRole] = useState<UserRole>("guest");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (role: UserRole) => {
    setUserRole(role);
    setIsLoggedIn(true);
    navigate("/dashboard");
  };

  const handleLogout = () => {
    setUserRole("guest");
    setIsLoggedIn(false);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  const go = (to: Page) => {
    const mapping: Record<Page, string> = {
      landing: "/",
      login: "/login",
      dashboard: "/dashboard",
      "farmer-register": "/farmer-register",
      "auditor-register": "/auditor-register",
    };
    navigate(mapping[to]);
  };

  return (
    <div className="App min-h-screen bg-gray-50">
      <Routes>
        <Route
          path="/"
          element={
            <LandingPage
              onOpenLogin={() => go("login")}
              onOpenFarmerRegister={() => go("farmer-register")}
              onOpenAuditorRegister={() => go("auditor-register")}
            />
          }
        />

        <Route
          path="/login"
          element={<LoginOnAuth onLogin={handleLogin} onBack={() => go("landing")} />}
        />

        <Route
          path="/farmer-register"
          element={
            <div className="p-6">
              <button onClick={() => go("landing")} className="mb-4 text-sm text-blue-600">
                ← Voltar
              </button>
              <FarmerRegistrationForm />
            </div>
          }
        />

        <Route
          path="/auditor-register"
          element={
            <div className="p-6">
              <button onClick={() => go("landing")} className="mb-4 text-sm text-blue-600">
                ← Voltar
              </button>
              <AuditorRegistrationForm />
            </div>
          }
        />

        <Route
          path="/dashboard"
          element={
            isLoggedIn && userRole !== "guest" ? (
              <Dashboard
                userRole={userRole}
                onLogout={handleLogout}
                setUserRole={setUserRole}
                go={go}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </div>
  );
};

export default App;
