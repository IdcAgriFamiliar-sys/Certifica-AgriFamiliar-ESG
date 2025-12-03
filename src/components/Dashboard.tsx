// src/componentes/Dashboard.tsx
import React, { useState } from "react";
import Cabeçalho from "./Cabeçalho";
import type { UserRole } from "../App";

// Try to import your Painel views — if not present, show placeholders
let CertificationsView: any, FarmersView: any, AuditorsView: any, AuditsView: any, FinancesView: any, BatchesView: any, ReportsView: any, SettingsView: any;
try {
  // @ts-ignore
  CertificationsView = require("./Painel/CertificationsView").default;
  // @ts-ignore
  FarmersView = require("./Painel/FarmersView").default;
  // @ts-ignore
  AuditorsView = require("./Painel/AuditorsView").default;
  // @ts-ignore
  AuditsView = require("./Painel/AuditsView").default;
  // @ts-ignore
  FinancesView = require("./Painel/FinancesView").default;
  // @ts-ignore
  BatchesView = require("./Painel/BatchesView").default;
  // @ts-ignore
  ReportsView = require("./Painel/ReportsView").default;
  // @ts-ignore
  SettingsView = require("./Painel/SettingsView").default;
} catch (e) {
  // ignore — show placeholders below
}

interface Props {
  userRole: UserRole;
  onLogout: () => void;
  setUserRole: (r: UserRole) => void;
  go?: (page: any) => void;
}

const navByRole: Record<string, Array<{ id: string; label: string }>> = {
  admin: [
    { id: "cert", label: "Certificações" },
    { id: "farmers", label: "Agricultores" },
    { id: "auditors", label: "Auditores" },
    { id: "audits", label: "Auditorias" },
    { id: "batches", label: "Lotes" },
    { id: "finances", label: "Finanças" },
    { id: "reports", label: "Relatórios" },
    { id: "settings", label: "Configurações" },
  ],
  gestor: [
    { id: "cert", label: "Certificações" },
    { id: "farmers", label: "Agricultores" },
    { id: "audits", label: "Auditorias" },
    { id: "reports", label: "Relatórios" },
  ],
  coordenador: [
    { id: "audits", label: "Auditorias" },
    { id: "reports", label: "Relatórios" },
    { id:
