// src/components/Dashboard.tsx
import React, { useState } from "react";
import Cabecalho from "./Cabecalho";

import CertificationsView from "./Dashboard/CertificationsView";
import FarmersView from "./Dashboard/FarmersView";
import AuditorsView from "./Dashboard/AuditorsView";
import AuditsView from "./Dashboard/AuditsView";
import FinancesView from "./Dashboard/FinancesView";
import BatchesView from "./Dashboard/BatchesView";
import ReportsView from "./Dashboard/ReportsView";
import SettingsView from "./Dashboard/SettingsView";

import type { UserRole, Page, DashboardView } from "../types";

interface Props {
  userRole: UserRole;
  onLogout: () => void;
  setUserRole?: (role: UserRole) => void;
  go?: (to: Page) => void;
}

const navByRole: Record<UserRole, Array<{ id: DashboardView; label: string }>> = {
  admin: [
    { id: "certificacoes", label: "Certificações" },
    { id: "agricultores", label: "Agricultores" },
    { id: "auditores", label: "Auditores" },
    { id: "auditorias", label: "Auditorias" },
    { id: "lotes", label: "Lotes" },
    { id: "financas", label: "Finanças" },
    { id: "relatorios", label: "Relatórios" },
    { id: "configuracoes", label: "Configurações" },
  ],
  gestor: [
    { id: "certificacoes", label: "Certificações" },
    { id: "agricultores", label: "Agricultores" },
    { id: "auditorias", label: "Auditorias" },
    { id: "relatorios", label: "Relatórios" },
  ],
  coordenador: [
    { id: "auditorias", label: "Auditorias" },
    { id: "relatorios", label: "Relatórios" },
  ],
  auditor: [
    { id: "auditorias", label: "Minhas Auditorias" },
    { id: "configuracoes", label: "Meus Dados" },
  ],
  agricultor: [
    { id: "certificacoes", label: "Minhas Certificações" },
    { id: "lotes", label: "Meus Lotes" },
  ],
  guest: [],
};

const Dashboard: React.FC<Props> = ({ userRole, onLogout }) => {
  const [selected, setSelected] = useState<DashboardView>("certificacoes");

  const renderPanel = () => {
    switch (selected) {
      case "certificacoes":
        return <CertificationsView />;
      case "agricultores":
        return <FarmersView />;
      case "auditores":
        return <AuditorsView />;
      case "auditorias":
        return <AuditsView />;
      case "financas":
        return <FinancesView />;
      case "lotes":
        return <BatchesView />;
      case "relatorios":
        return <ReportsView />;
      case "configuracoes":
        return <SettingsView />;
      default:
        return <div>Selecione um painel</div>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Cabecalho userRole={userRole} onLogout={onLogout} onSelectView={setSelected} activeViewName={selected} />
      <div className="flex flex-1">
        <nav className="w-64 bg-gray-100 p-4 border-r">
          {navByRole[userRole].map((item) => (
            <button
              key={item.id}
              onClick={() => setSelected(item.id)}
              className={`w-full text-left px-4 py-2 rounded mb-2 ${
                selected === item.id
                  ? "bg-green-700 text-white"
                  : "hover:bg-gray-200"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <main className="flex-1 p-6 bg-white">{renderPanel()}</main>
      </div>
    </div>
  );
};

export default Dashboard;
