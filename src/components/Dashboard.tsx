// src/components/Dashboard.tsx

import React, { useState } from "react";

import Cabecalho from "./Cabecalho";
import Sidebar from "./Sidebar"; // <-- agora precisamos criar este componente

// IMPORTS CORRETOS DO PAINEL
import CertificationsView from "./Painel/CertificationsView";
import FarmersView from "./Painel/FarmersView";
import AuditorsView from "./Painel/AuditorsView";
import BatchesView from "./Painel/BatchesView";
import FinancesView from "./Painel/FinancesView";
import ReportsView from "./Painel/ReportsView";
import SettingsView from "./Painel/SettingsView";

import { UserRole } from "../App";

interface DashboardProps {
  userRole: UserRole;
  onLogout: () => void;
  setUserRole: (role: UserRole) => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  userRole,
  onLogout,
  setUserRole,
}) => {

  const [activeView, setActiveView] = useState("certifications");

  const renderView = () => {
    switch (activeView) {
      case "certifications": return <CertificationsView />;
      case "farmers": return <FarmersView />;
      case "auditors": return <AuditorsView />;
      case "batches": return <BatchesView />;
      case "finances": return <FinancesView />;
      case "reports": return <ReportsView />;
      case "settings": return <SettingsView />;
      default: return <div>Selecione uma opção no menu.</div>;
    }
  };

  return (
    <div className="flex h-screen w-full">
      <Sidebar userRole={userRole} onSelect={setActiveView} />

      <div className="flex-1 flex flex-col">
        <Cabecalho
          activeViewName={activeView}
          onLogout={onLogout}
          userRole={userRole}
        />

        <main className="p-6 bg-gray-100 flex-1 overflow-auto">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
