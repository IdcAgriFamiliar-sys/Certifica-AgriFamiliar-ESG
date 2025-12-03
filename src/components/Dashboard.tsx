// src/components/Dashboard.tsx

import React, { useState, Dispatch, SetStateAction } from 'react';
import { Users, BarChart2, BookOpen, DollarSign, Package, Settings, ClipboardList } from 'lucide-react';
import { UserRole } from '../App';

// Correções de caminho (case-sensitive)
import Header from './Header';
import Sidebar from './Sidebar';

// Correções de caminho (case-sensitive) para Painel/
import CertificationsView from './Painel/CertificationsView';
import FarmersView from './Painel/FarmersView';
import AuditorsView from './Painel/AuditorsView';
import AuditsView from './Painel/AuditsView';
import FinancesView from './Painel/FinancesView';
import BatchesView from './Painel/BatchesView';
import ReportsView from './Painel/ReportsView';
import SettingsView from './Painel/SettingsView';

// Adicionado interfaces placeholder para evitar erro TS2322 (Property 'activeViewName' does not exist on type 'IntrinsicAttributes & HeaderProps')
// Você deve garantir que Header.tsx e Sidebar.tsx implementem as props corretas.

interface HeaderProps {
  activeViewName: string;
  userRole: UserRole;
  onLogout: () => void;
}

interface SidebarProps {
    navItems: NavItem[];
    activeView: string;
    setActiveView: (view: string) => void;
    userRole: UserRole;
    onLogout: () => void;
}

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

// O componente Header e Sidebar são tratados como genéricos aqui, mas precisam existir e ter as props corretas.
const TypedHeader = Header as React.FC<HeaderProps>;
const TypedSidebar = Sidebar as React.FC<SidebarProps>;


const Dashboard: React.FC<DashboardProps> = ({ userRole, onLogout }) => {
  const [activeView, setActiveView] = useState<string>(navItems[0].id);

  const ActiveComponent = navItems.find(item => item.id === activeView)?.component || CertificationsView;

  return (
    <div className="flex h-screen bg-gray-100">
      <TypedSidebar navItems={navItems} activeView={activeView} setActiveView={setActiveView} userRole={userRole} onLogout={onLogout} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TypedHeader activeViewName={navItems.find(item => item.id === activeView)?.name || 'Dashboard'} userRole={userRole} onLogout={onLogout} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <ActiveComponent />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
