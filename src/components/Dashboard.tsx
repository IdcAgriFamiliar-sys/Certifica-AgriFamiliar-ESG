import React, { useState } from 'react';
import { Home, FileCheck, Users, Shield, TrendingUp, DollarSign, Package, BarChart3, FileText, Settings, UserPlus, LogOut } from 'lucide-react';

// Define a estrutura de dados (TYPES) necessária para simular o painel
interface DashboardCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  trend: 'up' | 'down' | 'neutral';
}

// Define as opções de sub-visualização (abas) do Dashboard
type DashboardView = 'visao-geral' | 'certificacoes' | 'agricultores' | 'auditores' | 'financas' | 'lotes' | 'relatorios' | 'configuracoes';

// ============================================================================
// COMPONENTE SIDEBAR
// ============================================================================
const Sidebar: React.FC<{ activeView: DashboardView, setActiveView: (view: DashboardView) => void }> = ({ activeView, setActiveView }) => {
  const navItems = [
    { name: 'Visão Geral', icon: <Home size={20} />, view: 'visao-geral' as const },
    { name: 'Certificações', icon: <FileCheck size={20} />, view: 'certificacoes' as const },
    { name: 'Agricultores', icon: <Users size={20} />, view: 'agricultores' as const },
    { name: 'Auditores', icon: <Shield size={20} />, view: 'auditores' as const },
    { name: 'Finanças', icon: <DollarSign size={20} />, view: 'financas' as const },
    { name: 'Lotes de Produção', icon: <Package size={20} />, view: 'lotes' as const },
    { name: 'Relatórios', icon: <BarChart3 size={20} />, view: 'relatorios' as const },
    { name: 'Configurações', icon: <Settings size={20} />, view: 'configuracoes' as const },
  ];

  return (
    <div className="w-64 bg-gray-800 text-white flex flex-col p-4 shadow-2xl">
      <div className="flex items-center mb-6 border-b border-gray-700 pb-4">
        <span className="text-xl font-bold text-green-400">Painel de Gestão</span>
      </div>
      <nav className="flex-grow space-y-2">
        {navItems.map(item => (
          <button
            key={item.view}
            onClick={() => setActiveView(item.view)}
            className={`flex items-center w-full px-3 py-2 rounded-lg transition-colors ${
              activeView === item.view ? 'bg-indigo-600 text-white font-semibold shadow-md' : 'hover:bg-gray-700 text-gray-300'
            }`}
          >
            {item.icon}
            <span className="ml-3">{item.name}</span>
          </button>
        ))}
      </nav>
      <div className="mt-auto pt-4 border-t border-gray-700">
        <div className="text-sm mb-2 px-3 text-gray-400">Usuário: Coordenador(a)</div>
        <button
          onClick={() => alert('Simulando Logout')} // Esta função será substituída no App.tsx
          className="flex items-center w-full px-3 py-2 text-red-400 hover:bg-gray-700 rounded-lg transition-colors"
        >
          <LogOut size={20} />
          <span className="ml-3">Sair</span>
        </button>
      </div>
    </div>
  );
};

// ============================================================================
// COMPONENTE CARD (para métricas)
// ============================================================================
const DashboardCard: React.FC<DashboardCardProps> = ({ icon, title, value, trend }) => {
  const trendColor = trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-gray-500';
  const trendIcon = trend === 'up' ? '▲' : trend === 'down' ? '▼' : '▬';
  
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-indigo-500">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-500">{title}</h4>
        <div className="text-indigo-600">{icon}</div>
      </div>
      <div className="mt-1 flex items-end justify-between">
        <span className="text-3xl font-bold text-gray-900">{value}</span>
        <div className={`flex items-center text-sm font-semibold ${trendColor}`}>
          {trendIcon}
          <span className="ml-1">4.5%</span> {/* Simulação de % */}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// COMPONENTE VISÃO GERAL (O conteúdo da primeira aba)
// ============================================================================
const OverviewView: React.FC = () => {
  return (
    <div className="space-y-6">
      <h3 className="text-3xl font-bold text-gray-800">Visão Geral</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard 
          icon={<Users size={24} />} 
          title="Agricultores Cadastrados" 
          value="1.245" 
          trend="up" 
        />
        <DashboardCard 
          icon={<FileCheck size={24} />} 
          title="Certificações Ativas" 
          value="87" 
          trend="up" 
        />
        <DashboardCard 
          icon={<Shield size={24} />} 
          title="Auditores Credenciados" 
          value="14" 
          trend="neutral" 
        />
        <DashboardCard 
          icon={<TrendingUp size={24} />} 
          title="Média ESG Score" 
          value="78.2" 
          trend="up" 
        />
      </div>
      
      {/* Gráfico Simulado */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h4 className="text-lg font-semibold mb-4 text-gray-800">Progresso Anual de Certificações</h4>
        <div className="h-64 flex items-center justify-center text-gray-500">
          
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// COMPONENTE PRINCIPAL DO DASHBOARD
// ============================================================================
const Dashboard: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const [activeView, setActiveView] = useState<DashboardView>('visao-geral');

  // Mapeia a view ativa para o componente de conteúdo
  const renderViewContent = () => {
    switch (activeView) {
      case 'visao-geral':
        return <OverviewView />;
      case 'certificacoes':
        return <div className="text-center p-10 bg-white rounded-xl shadow-lg">Gestão de Certificações (em breve)</div>;
      case 'agricultores':
        return <div className="text-center p-10 bg-white rounded-xl shadow-lg">Lista de Agricultores (em breve)</div>;
      case 'auditores':
        return <div className="text-center p-10 bg-white rounded-xl shadow-lg">Lista de Auditores (em breve)</div>;
      case 'financas':
        return <div className="text-center p-10 bg-white rounded-xl shadow-lg">Módulo de Finanças (em breve)</div>;
      case 'lotes':
        return <div className="text-center p-10 bg-white rounded-xl shadow-lg">Rastreabilidade de Lotes (em breve)</div>;
      case 'relatorios':
        return <div className="text-center p-10 bg-white rounded-xl shadow-lg">Geração de Relatórios (em breve)</div>;
      case 'configuracoes':
        return <div className="text-center p-10 bg-white rounded-xl shadow-lg">Configurações do Sistema (em breve)</div>;
      default:
        return <OverviewView />;
    }
  };

  // Funções de logout
  const handleLogout = () => {
    if (window.confirm('Tem certeza que deseja sair?')) {
      onLogout();
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar activeView={activeView} setActiveView={setActiveView} />

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-8">
        {renderViewContent()}
      </div>
    </div>
  );
};

export default Dashboard;
