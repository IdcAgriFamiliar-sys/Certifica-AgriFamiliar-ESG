// src/components/Dashboard.tsx
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
    { id: "farmers", label: "Agricultores" },
  ],
  auditor: [
    { id: "audits", label: "Auditorias" },
    { id: "reports", label: "Relatórios" },
  ],
  agricultor: [
    { id: "mycert", label: "Minhas Certificações" },
    { id: "myaudits", label: "Minhas Auditorias" },
  ],
};

const Dashboard: React.FC<Props> = ({ userRole, onLogout }) => {
  const [active, setActive] = useState<string>(navByRole[userRole]?.[0]?.id || "cert");

  const renderActive = () => {
    switch (active) {
      case "cert":
      case "mycert":
        return CertificationsView ? <CertificationsView /> : <div className="p-6">(Certifications View)</div>;
      case "farmers":
        return FarmersView ? <FarmersView /> : <div className="p-6">(Farmers View)</div>;
      case "auditors":
        return AuditorsView ? <AuditorsView /> : <div className="p-6">(Auditors View)</div>;
      case "audits":
      case "myaudits":
        return AuditsView ? <AuditsView /> : <div className="p-6">(Audits View)</div>;
      case "batches":
        return BatchesView ? <BatchesView /> : <div className="p-6">(Batches View)</div>;
      case "finances":
        return FinancesView ? <FinancesView /> : <div className="p-6">(Finances View)</div>;
      case "reports":
        return ReportsView ? <ReportsView /> : <div className="p-6">(Reports View)</div>;
      case "settings":
        return SettingsView ? <SettingsView /> : <div className="p-6">(Settings View)</div>;
      default:
        return <div className="p-6">Bem-vindo ao Painel</div>;
    }
  };

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-white border-r p-4">
        <div className="mb-6">
          <h2 className="text-lg font-semibold">Menu</h2>
        </div>

        <nav className="space-y-2">
          {(navByRole[userRole] || []).map((item) => (
            <button key={item.id} onClick={() => setActive(item.id)} className={`block w-full text-left px-3 py-2 rounded ${active === item.id ? "bg-gray-100" : "hover:bg-gray-50"}`}>
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col">
        <Cabeçalho activeViewName={navByRole[userRole]?.find(i=>i.id===active)?.label || "Dashboard"} userRole={userRole} onLogout={onLogout} />
        <main className="p-6 bg-gray-50 flex-1 overflow-auto">
          {renderActive()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
