// src/App.tsx

import React from "react";

import LandingPage from "./components/LandingPage";
import FarmerRegistrationForm from "./components/FarmerRegistrationForm";
import AuditorRegistrationForm from "./components/AuditorRegistrationForm";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";

export type UserRole = "agricultor" | "auditor" | "admin" | "guest";

const App: React.FC = () => {
  const path = window.location.pathname;

  if (path === "/farmer-register") return <FarmerRegistrationForm />;
  if (path === "/auditor-register") return <AuditorRegistrationForm />;
  if (path === "/login") return <Login onLogin={() => {}} />;

  // Painel apenas se usuário logado (implementaremos depois)
  if (path.startsWith("/dashboard")) return <Dashboard />;

  return <LandingPage />;
};

export default App;
