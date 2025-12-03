import React, { useState } from 'react';
import { UserRole } from '../App';
import { ChevronDown, ChevronUp, Users, ClipboardCheck, DollarSign, Package, BarChart2, Settings, FileText } from 'lucide-react';

// =========================================================================
// CORREÇÃO: Todos os caminhos de importação estão agora em minúsculo: './painel/'
// =========================================================================
import CertificationsView from './painel/CertificationsView'; 
import FarmersView from './painel/FarmersView';
import AuditorsView from './painel/AuditorsView';
import AuditsView from './painel/AuditsView';
import FinancesView from './painel/FinancesView';
import BatchesView from './painel/BatchesView';
import ReportsView from './painel/ReportsView';
import SettingsView from './painel/SettingsView';
// =========================================================================

interface DashboardProps {
  userRole: UserRole;
  onLogout: () => void;
  setUserRole: React.Dispatch<React.SetStateAction<UserRole>>;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  roles: UserRole[];
  component: React.FC;
}

const navItems: NavItem[] = [
  { id: 'certifications', label: 'Certificações', icon: <ClipboardCheck size={20} />, roles: ['admin', 'coordinator'], component: CertificationsView },
  { id: 'farmers', label: 'Agricultores', icon: <Users size={20} />, roles: ['admin', 'coordinator'], component: FarmersView },
  { id: 'auditors', label: 'Auditores', icon: <FileText size={20} />, roles: ['admin', 'coordinator'], component: AuditorsView },
  { id: 'audits', label: 'Auditorias', icon: <ClipboardCheck size={20} />, roles: ['auditor', 'admin', 'coordinator'], component: AuditsView },
  { id: 'batches', label: 'Lotes', icon: <Package size={20} />, roles: ['farmer', 'admin', 'coordinator'], component: BatchesView },
  { id: 'finances', label: 'Finanças', icon: <DollarSign size={20} />, roles: ['admin', 'coordinator'], component: FinancesView },
  { id: 'reports', label: 'Relatórios', icon: <BarChart2 size={20} />, roles: ['admin', 'coordinator'], component: ReportsView },
  { id: 'settings', label: 'Configurações', icon: <Settings size={20} />, roles: ['admin', 'coordinator', 'auditor', 'farmer'], component: SettingsView },
];

const Dashboard: React.FC<DashboardProps> = ({ userRole, onLogout, setUserRole }) => {
  const [activeTab, setActiveTab] = useState<string>(navItems.find(item => item.roles.includes(userRole))?.id || 'certifications');
  const [showRoleSelector, setShowRoleSelector] = useState(false);

  // Filtra os itens de navegação baseados no perfil do usuário
  const filteredNavItems = navItems.filter(item => item.roles.includes(userRole));
  
  // Encontra o componente ativo para renderização
  const ActiveComponent = filteredNavItems.find(item => item.id === activeTab)?.component || CertificationsView;

  return (
    <div className="flex h-screen bg-gray-50">
      
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 flex flex-col justify-between">
        <div className="p-4">
          <h1 className="text-2xl font-bold text-green-400 mb-6">AgriFamiliar ESG</h1>
          
          {/* Seletor de Perfil (Simulação) */}
          <div className="mb-6">
            <button
              onClick={() => setShowRoleSelector(!showRoleSelector)}
              className="w-full bg-gray-800 text-white p-3 rounded-lg flex justify-between items-center hover:bg-gray-700 transition"
            >
              Perfil: <span className="capitalize font-semibold text-indigo-300">{userRole}</span>
              {showRoleSelector ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {showRoleSelector && (
              <div className="mt-2 bg-gray-800 rounded-lg shadow-xl overflow-hidden">
                {(['admin', 'coordinator', 'auditor', 'farmer'] as UserRole[]).map(role => (
                  <button
                    key={role}
                    onClick={() => {
                      setUserRole(role);
                      setShowRoleSelector(false);
                      // Resetar a aba ativa para o primeiro item disponível no novo perfil
                      setActiveTab(navItems.find(item => item.roles.includes(role))?.id || 'certifications');
                    }}
                    className={`w-full text-left p-3 hover:bg-green-700 transition capitalize ${userRole === role ? 'bg-green-600 font-bold' : 'text-gray-300'}`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Navegação */}
          <nav>
            {filteredNavItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full text-left flex items-center p-3 my-1 rounded-lg transition duration-200 
                  ${activeTab === item.id 
                    ? 'bg-green-600 text-white font-semibold shadow-md' 
                    : 'text-gray-300 hover:bg-gray-700'
                  }`}
              >
                {item.icon}
                <span className="ml-3">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
        
        {/* Rodapé da Sidebar / Logout */}
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={onLogout}
            className="w-full bg-red-600 text-white p-3 rounded-lg font-semibold hover:bg-red-700 transition shadow-lg"
          >
            Sair
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-7xl mx-auto">
          {/* Título da View Atual */}
          <h2 className="text-3xl font-extrabold text-gray-900 mb-6">
            {navItems.find(item => item.id === activeTab)?.label}
          </h2>

          {/* Renderiza o Componente Ativo */}
          <div className="bg-white p-6 rounded-xl shadow-lg min-h-[70vh]">
            <ActiveComponent />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
