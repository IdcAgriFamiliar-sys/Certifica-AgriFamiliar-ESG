import React, { useState } from "react";
import Cabeçalho from "./Cabeçalho";
import type { UserRole } from "../App";

// Import placeholders, caso os Painéis não existam
let CertificationsView: any, FarmersView: any, AuditorsView: any, AuditsView: any, FinancesView: any, BatchesView: any, ReportsView: any, SettingsView: any;
try {
  CertificationsView = require("./Painel/CertificationsView").default;
  FarmersView = require("./Painel/FarmersView").default;
  AuditorsView = require("./Painel/AuditorsView").default;
  AuditsView = require("./Painel/AuditsView").default;
  FinancesView = require("./Painel/FinancesView").default;
  BatchesView = require("./Painel/BatchesView").default;
  ReportsView = require("./Painel/ReportsView").default;
  SettingsView = require("./Painel/SettingsView").default;
} catch (e) {}

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
  ],
};

const Dashboard: React.FC<Props> = ({ userRole, onLogout }) => {
  const [selected, setSelected] = useState<string>("cert");

  const renderPanel = () => {
    switch (selected) {
      case "cert":
        return <CertificationsView />;
      case "farmers":
        return <FarmersView />;
      case "auditors":
        return <AuditorsView />;
      case "audits":
        return <AuditsView />;
      case "finances":
        return <FinancesView />;
      case "batches":
        return <BatchesView />;
      case "reports":
        return <ReportsView />;
      case "settings":
        return <SettingsView />;
      default:
        return <div>Selecione um painel</div>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Cabeçalho userRole={userRole} onLogout={onLogout} />

      <div className="flex flex-1">
        <nav className="w-64 bg-gray-100 p-4 border-r">
          {navByRole[userRole].map((item) => (
            <button
              key={item.id}
              onClick={() => setSelected(item.id)}
              className={`w-full text-left px-4 py-2 rounded mb-2 ${
                selected === item.id ? "bg-green-700 text-white" : "hover:bg-gray-200"
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
