import React, { useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import LoginOnAuth from "./components/LoginOnAuth";
import Dashboard from "./components/Dashboard";
import FarmerRegistrationForm from "./components/FarmerRegistrationForm";
import AuditorRegistrationForm from "./components/AuditorRegistrationForm";
import ConnectivityTest from "./components/ConnectivityTest";
import Button from "./components/Button";
import { ArrowLeft } from "lucide-react";

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
          element={<LoginOnAuth onLogin={() => handleLogin("auditor")} onBack={() => go("landing")} />}
        />

        <Route
          path="/farmer-register"
          element={
            <div className="relative">
              <div className="absolute top-4 left-4 z-50 lg:hidden">
                <Button
                  onClick={() => go("landing")}
                  variant="ghost"
                  size="sm"
                  leftIcon={<ArrowLeft className="w-4 h-4" />}
                  className="bg-white/80 backdrop-blur-md shadow-sm border border-stone-200"
                >
                  Voltar
                </Button>
              </div>
              <FarmerRegistrationForm />
            </div>
          }
        />

        <Route
          path="/auditor-register"
          element={
            <div className="relative">
              <div className="absolute top-4 left-4 z-50 lg:hidden">
                <Button
                  onClick={() => go("landing")}
                  variant="ghost"
                  size="sm"
                  leftIcon={<ArrowLeft className="w-4 h-4" />}
                  className="bg-white/80 backdrop-blur-md shadow-sm border border-stone-200"
                >
                  Voltar
                </Button>
              </div>
              <AuditorRegistrationForm />
            </div>
          }
        />

        <Route
          path="/test-connection"
          element={<ConnectivityTest />}
        />

        <Route
          path="/dashboard"
          element={
            isLoggedIn ? (
              <Dashboard
                userRole={userRole}
                onLogout={handleLogout}
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
