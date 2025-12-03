import React, { useState } from "react";
// CORREÇÃO TS2307: Adicionando a extensão .tsx
import Header from "./Header.tsx"; 

// Importação direta dos painéis, substitua pelos seus componentes reais
// CORREÇÃO TS2307: Adicionando a extensão .tsx para os imports de componentes locais.
import CertificationsView from "./Dashboard/CertificationsView.tsx";
import FarmersView from "./Dashboard/FarmersView.tsx";
import AuditorsView from "./Dashboard/AuditorsView.tsx";
import AuditsView from "./Dashboard/AuditsView.tsx";
import FinancesView from "./Dashboard/FinancesView.tsx";
import BatchesView from "./Dashboard/BatchesView.tsx";
import ReportsView from "./Dashboard/ReportsView.tsx";
import SettingsView from "./Dashboard/SettingsView.tsx";

type UserRole = "admin" | "gestor" | "coordenador";

interface Props {
  userRole: UserRole;
  onLogout: () => void;
}

const navByRole: Record<UserRole, Array<{ id: string; label: string }>> = {
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
      <Header userRole={userRole} onLogout={onLogout} />
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

// CORREÇÃO TS2304: Substituindo "expo" pelo export padrão
export default Dashboard;
