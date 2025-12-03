// src/componentes/Dashboard.tsx

import React, { useState, Dispatch, SetStateAction } from 'react';
import { Users, BarChart2, BookOpen, DollarSign, Package, Settings, ClipboardList } from 'lucide-react';
import { UserRole } from '../App';

// CORREÇÃO: Importando Cabeçalho.tsx
import Cabeçalho from './Cabeçalho'; 
import Sidebar from './Sidebar'; // Assumindo que o nome do arquivo seja Sidebar.tsx

// Correções de caminho (case-sensitive) para Painel/
import CertificationsView from './Painel/CertificationsView';
import FarmersView from './Painel/FarmersView';
import AuditorsView from './Painel/AuditorsView';
import AuditsView from './Painel/AuditsView';
import FinancesView from './Painel/FinancesView';
import BatchesView from './Painel/BatchesView';
import ReportsView from './Painel/ReportsView';
import SettingsView from './Painel/SettingsView';

interface DashboardProps {
  userRole: UserRole;
  onLogout: () => void;
  setUserRole: Dispatch<SetStateAction<UserRole>>;
}

interface NavItem {
  id: string;
  name: string;
  icon: React.ElementType;
  component: React.ElementType;
}

const navItems: NavItem[] = [
  { id: 'certifications', name: 'Certificações', icon: BookOpen, component: CertificationsView },
  { id: 'farmers', name: 'Agricultores', icon: Users, component: FarmersView },
  { id: 'auditors', name: 'Auditores', icon: ClipboardList, component: AuditorsView },
  { id: 'audits', name: 'Auditorias', icon: BarChart2, component: AuditsView },
  { id: 'batches', name: 'Lotes', icon: Package, component: BatchesView },
  { id: 'finances', name: 'Finanças', icon: DollarSign, component: FinancesView },
  { id: 'reports', name: 'Relatórios', icon: BarChart2, component: ReportsView },
  { id: 'settings', name: 'Configurações', icon: Settings, component: SettingsView },
];


const Dashboard: React.FC<DashboardProps> = ({ userRole, onLogout }) => {
  const [activeView, setActiveView] = useState<string>(navItems[0].id);

  const ActiveComponent = navItems.find(item => item.id === activeView)?.component || CertificationsView;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Assumindo que Sidebar.tsx tenha as props corretas */}
      <Sidebar navItems={navItems} activeView={activeView} setActiveView={setActiveView} userRole={userRole} onLogout={onLogout} />
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Usando Cabeçalho.tsx e assumindo que ele tem as props corretas */}
        <Cabeçalho activeViewName={navItems.find(item => item.id === activeView)?.name || 'Dashboard'} userRole={userRole} onLogout={onLogout} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <ActiveComponent />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
