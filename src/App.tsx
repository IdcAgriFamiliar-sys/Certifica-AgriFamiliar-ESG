// src/App.tsx
import React, { useState, useEffect } from "react";
import LandingPage from "./componentes/LandingPage";
import Login from "./componentes/Login";
import Dashboard from "./componentes/Dashboard";
import FarmerRegistrationForm from "./componentes/FarmerRegistrationForm";
import AuditorRegistrationForm from "./componentes/AuditorRegistrationForm";

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
    // If user navigates directly to a path (netlify), support common paths:
    const p = window.location.pathname;
    if (p === "/login") setPage("login");
    if (p === "/farmer-register") setPage("farmer-register");
    if (p === "/auditor-register") setPage("auditor-register");
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
    // update browser URL for shareability (no router)
    const mapping: Record<Page, string> = {
      landing: "/",
      login: "/lo
