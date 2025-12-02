import React, { useState, useEffect } from 'react';
import { LogOut, Home, FileCheck, Users, Shield, Briefcase, DollarSign, Package, BarChart3, Settings, User, Zap } from 'lucide-react';
import CertificationsView from './Painel/CertificationsView';
import FarmersView from './Painel/FarmersView';
import AuditorsView from './Painel/AuditorsView';
import AuditsView from './Painel/AuditsView';
import FinancesView from './Painel/FinancesView';
import BatchesView from './Painel/BatchesView';
import ReportsView from './Painel/ReportsView';
import SettingsView from './Painel/SettingsView';
import { UserRole } from '../App'; 

// Mapeamento de rotas e ícones
interface MenuItem {
  name: string;
  icon: React.ReactNode;
  component: React.FC;
  visibleFor: UserRole[]; 
}

interface DashboardProps {
  onLogout: () => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout, userRole, setUserRole }) => {
  const [activeRoute, setActiveRoute] = useState<string>('home');

  // Garante que a rota ativa é válida para o novo perfil ao mudar o role
  useEffect(() => {
    // Tenta manter a rota, mas volta para a Home se não for visível para o novo perfil
    const currentItem = menuItems.find(item => item.name === activeRoute);
    if (!currentItem || !currentItem.visibleFor.includes(userRole)) {
      setActiveRoute('home'); 
    }
  }, [userRole]);


  // Mapeamento de rotas com base na visibilidade dos perfis (Suas regras de negócio)
  const menuItems: MenuItem[] = [
    // Dashboard Geral: Visão de alto nível
    { name: 'Dashboard Geral', icon: <Home size={20} />, component: ReportsView, visibleFor: ['admin', 'coordinator'] },
    
    // Gestão de Usuários e Cadastros
    { name: 'Agricultores (Gestão)', icon: <Users size={20} />, component: FarmersView, visibleFor: ['admin', 'coordinator'] },
    { name: 'Auditores (Credenc.)', icon: <Shield size={20} />, component: AuditorsView, visibleFor: ['admin', 'coordinator'] },

    // Módulos de Certificação e Auditoria
    { name: 'Certificações', icon: <FileCheck size={20} />, component: CertificationsView, visibleFor: ['admin', 'coordinator', 'auditor'] },
    { name: 'Agenda de Auditorias', icon: <Briefcase size={20} />, component: AuditsView, visibleFor: ['admin', 'coordinator', 'auditor'] },

    // Módulos do Agricultor (Visão de gestão da propriedade)
    { name: 'Minha Propriedade/Dados', icon: <User size={20} />, component: FarmersView, visibleFor: ['farmer'] }, 
    { name: 'Lotes e Rastreabilidade', icon: <Package size={20} />, component: BatchesView, visibleFor: ['farmer', 'admin', 'coordinator'] },
    { name: 'Finanças e Receitas', icon: <DollarSign size={20} />, component: FinancesView, visibleFor: ['farmer', 'admin', 'coordinator'] },
    
    // Relatórios e Ferramentas de Gestão
    { name: 'Relatórios/Analytics', icon: <BarChart3 size={20} />, component: ReportsView, visibleFor: ['admin', 'coordinator'] },
    { name: 'Documentos (Upload/Download)', icon: <Zap size={20} />, component: SettingsView, visibleFor: ['admin', 'coordinator', 'auditor', 'farmer'] }, // Item para simular upload/download
    
    // Configurações
    { name: 'Configurações (Admin)', icon: <Settings size={20} />, component: SettingsView, visibleFor: ['admin'] }, // Exclusivo do Admin
  ];

  // Filtra os itens do menu com base no perfil logado
  const visibleMenuItems = menuItems.filter(item => item.visibleFor.includes(userRole));

  // Tenta encontrar o componente ativo. Se for 'home', usa ReportsView como padrão.
  const ActiveComponent = visibleMenuItems.find(item => item.name === activeRoute)?.component || ReportsView;

  // Renderiza o seletor de perfil (View As)
  const renderRoleSelector = () => {
    // Apenas Admin e Coordenador podem alternar visões
    if (userRole === 'admin' || userRole === 'coordinator') {
      const roles: UserRole[] = ['admin', 'coordinator', 'auditor', 'farmer'];
      const roleNames = {
        'admin': 'Admin/Gestor',
        'coordinator': 'Coordenador',
        'auditor': 'Auditor',
        'farmer': 'Agricultor(a)',
      };
      
      const allowedRoles = userRole === 'admin' ? roles : roles.filter(r => r !== 'admin'); // Coordenador não vê como Admin
      
      return (
        <div className="p-4 border-t border-gray-700">
          <label className="block text-xs font-medium text-gray-400 mb-1">VISUALIZAR COMO:</label>
          <select
            value={userRole}
            onChange={(e) => {
              setUserRole(e.target.value as UserRole);
            }}
            className="w-full p-2 rounded-lg bg-gray-700 border border-gray-600 text-white text-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            {allowedRoles.map(role => (
              <option key={role} value={role}>{roleNames[role]}</option>
            ))}
          </select>
        </div>
      );
    }
    return null;
  };

  const getProfileName = (role: UserRole) => {
    switch(role) {
      case 'admin': return 'Admin/Gestor';
      case 'coordinator': return 'Coordenador';
      case 'auditor': return 'Auditor';
      case 'farmer': return 'Agricultor(a)';
      default: return 'Usuário';
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col justify-between">
        <div>
          <div className="p-4 text-2xl font-bold text-green-400 border-b border-gray-700 flex items-center gap-2">
            <Leaf size={28} />
            AgriESG
          </div>

          {/* Seletor de Perfil (View As) */}
          {renderRoleSelector()}

          {/* Menu de Navegação */}
          <nav className="flex-1 p-4 space-y-2">
            {visibleMenuItems.map((item) => (
              <button
                key={item.name}
                onClick={() => setActiveRoute(item.name)}
                className={`flex items-center w-full p-3 rounded-lg transition duration-150 ${
                  activeRoute === item.name
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                {item.icon}
                <span className="ml-3 text-sm font-medium">{item.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Footer Sidebar */}
        <div className="p-4 border-t border-gray-700">
          <div className="text-sm font-semibold mb-2 text-gray-300">
            Perfil: {getProfileName(userRole)}
          </div>
          <button
            onClick={onLogout}
            className="flex items-center w-full p-3 text-sm text-red-400 bg-gray-700 rounded-lg hover:bg-red-500 hover:text-white transition duration-150"
          >
            <LogOut size={20} />
            <span className="ml-3">Sair do Sistema</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        <header className="mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900">
            {activeRoute === 'home' ? `Dashboard Geral (${getProfileName(userRole)})` : activeRoute}
          </h1>
        </header>
        <div className="bg-white p-6 rounded-xl shadow-xl min-h-[85vh]">
          <ActiveComponent />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
