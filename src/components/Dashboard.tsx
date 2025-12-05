import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Users,
  FileCheck,
  ClipboardCheck,
  DollarSign,
  Package,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Leaf,
  Eye,
  TrendingDown,
  Sprout,
  ChevronDown
} from "lucide-react";

import CertificationsView from "./Dashboard/CertificationsView";
import FarmersView from "./Dashboard/FarmersView";
import AuditorsView from "./Dashboard/AuditorsView"; // List of auditors
import AuditsView from "./Dashboard/AuditsView"; // Audit execution
import FinancesView from "./Dashboard/FinancesView";
import BatchesView from "./Dashboard/BatchesView";
import ReportsView from "./Dashboard/ReportsView";
import SettingsView from "./Dashboard/SettingsView";
import SalesView from "./Dashboard/SalesView";
import ExpensesView from "./Dashboard/ExpensesView";
import ProductionView from "./Dashboard/ProductionView";

import type { UserRole, DashboardView } from "../types";
import { useAuth } from "../contexts/AuthContext";

interface Props {
  userRole?: UserRole; // Optional because we use AuthContext
  onLogout?: () => void;
}

const navItems: Record<string, { label: string; icon: React.ReactNode }> = {
  certificacoes: { label: "Certificações", icon: <FileCheck className="w-5 h-5" /> },
  agricultores: { label: "Agricultores", icon: <Users className="w-5 h-5" /> },
  auditores: { label: "Auditores", icon: <ClipboardCheck className="w-5 h-5" /> },
  auditorias: { label: "Auditorias", icon: <LayoutDashboard className="w-5 h-5" /> },
  lotes: { label: "Lotes", icon: <Package className="w-5 h-5" /> },
  financas: { label: "Finanças", icon: <DollarSign className="w-5 h-5" /> },
  relatorios: { label: "Relatórios", icon: <BarChart3 className="w-5 h-5" /> },
  configuracoes: { label: "Configurações", icon: <Settings className="w-5 h-5" /> },
  // New Farmer Items
  vendas: { label: "Vendas", icon: <DollarSign className="w-5 h-5" /> },
  gastos: { label: "Gastos", icon: <TrendingDown className="w-5 h-5" /> },
  producao: { label: "Produção", icon: <Sprout className="w-5 h-5" /> },
};

const navByRole: Record<UserRole, DashboardView[]> = {
  admin: [
    "certificacoes",
    "agricultores",
    "auditores",
    "auditorias",
    "lotes",
    "financas",
    "relatorios",
    "configuracoes",
  ],
  gestor: ["certificacoes", "agricultores", "auditorias", "relatorios"],
  coordenador: [
    "certificacoes",
    "agricultores",
    "auditores",
    "auditorias",
    "lotes",
    "financas",
    "relatorios",
    "configuracoes",
  ],
  auditor: ["auditorias", "configuracoes"],
  agricultor: ["certificacoes", "producao", "vendas", "gastos", "relatorios"],
  guest: [],
};

const Dashboard: React.FC<Props> = () => {
  const { user, logout } = useAuth();
  const userRole = user?.role || "agricultor";

  // State for "View As" functionality
  const [currentViewRole, setCurrentViewRole] = useState<UserRole>(userRole);
  const [selected, setSelected] = useState<DashboardView>(navByRole[currentViewRole][0] || "certificacoes");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Update view when role changes (real or simulated)
  useEffect(() => {
    if (user) setCurrentViewRole(user.role);
  }, [user]);

  useEffect(() => {
    // Reset selection when view role changes to ensure valid tab
    const availableViews = navByRole[currentViewRole];
    if (!availableViews.includes(selected)) {
      setSelected(availableViews[0] || "certificacoes");
    }
  }, [currentViewRole]);


  const renderPanel = () => {
    switch (selected) {
      case "certificacoes": return <CertificationsView />;
      case "agricultores": return <FarmersView />;
      case "auditores": return <AuditorsView />; // This is the list of auditors
      case "auditorias": return <AuditsView />; // This is the audit execution view
      case "financas": return <FinancesView />;
      case "lotes": return <BatchesView />;
      case "relatorios": return <ReportsView />;
      case "configuracoes": return <SettingsView />;
      case "vendas": return <SalesView />;
      case "gastos": return <ExpensesView />;
      case "producao": return <ProductionView />;
      default: return <div className="p-8 text-center text-stone-500">Selecione um painel</div>;
    }
  };

  const menuItems = navByRole[currentViewRole].map((id) => ({
    id,
    ...navItems[id],
  }));

  return (
    <div className="min-h-screen bg-stone-50 flex font-sans">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-72 bg-stone-900 text-stone-300 fixed h-full z-20 transition-all duration-300 shadow-2xl shadow-stone-900/50">
        <div className="p-6 flex items-center gap-3 border-b border-stone-800/50">
          <div className="bg-gradient-to-br from-green-600 to-emerald-700 p-2 rounded-xl shadow-lg shadow-green-900/20">
            <Leaf className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-white text-lg leading-none tracking-tight">Certifica ESG</h1>
            <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest">AgriFamiliar</span>
          </div>
        </div>

        {/* View As Toggle for Admin */}
        {userRole === "admin" && (
          <div className="px-4 pt-6 pb-2">
            <div className="bg-stone-800/50 p-4 rounded-2xl border border-stone-700/50 backdrop-blur-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-16 h-16 bg-green-500/5 rounded-full blur-xl -mr-8 -mt-8 pointer-events-none"></div>

              <div className="flex items-center gap-2 mb-3 text-xs font-bold text-stone-400 uppercase tracking-wider">
                <Eye className="w-3 h-3 text-green-500" />
                <span>Modo de Visualização</span>
              </div>

              <div className="relative">
                <select
                  value={currentViewRole}
                  onChange={(e) => setCurrentViewRole(e.target.value as UserRole)}
                  className="w-full bg-stone-900 text-white text-sm font-medium rounded-xl p-3 border border-stone-700 focus:ring-2 focus:ring-green-500/50 focus:border-green-500 outline-none appearance-none cursor-pointer hover:bg-stone-800 transition-colors shadow-inner"
                >
                  <option value="admin">Administrador</option>
                  <option value="coordenador">Coordenador</option>
                  <option value="auditor">Auditor</option>
                  <option value="agricultor">Agricultor</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-stone-500">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        )}

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1.5 scrollbar-thin scrollbar-thumb-stone-800 scrollbar-track-transparent">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelected(item.id as DashboardView)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group relative overflow-hidden ${selected === item.id
                ? "bg-green-600 text-white shadow-lg shadow-green-900/20"
                : "hover:bg-stone-800 hover:text-white text-stone-400"
                }`}
            >
              <span className={`relative z-10 transition-colors ${selected === item.id ? "text-white" : "text-stone-500 group-hover:text-white"}`}>
                {item.icon}
              </span>
              <span className="font-medium relative z-10">{item.label}</span>
              {selected === item.id && (
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent pointer-events-none"></div>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-stone-800/50 bg-stone-900/50 backdrop-blur-md">
          <div className="bg-stone-800 rounded-xl p-3 mb-3 flex items-center gap-3 border border-stone-700/50">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-stone-700 to-stone-600 flex items-center justify-center text-white font-bold shadow-inner border border-stone-600">
              {currentViewRole.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-white truncate capitalize">{currentViewRole}</p>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <p className="text-xs text-stone-400 truncate">Online</p>
              </div>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all text-sm font-bold border border-transparent hover:border-red-500/20"
          >
            <LogOut className="w-4 h-4" />
            Sair da Conta
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-stone-900 text-white z-30 px-4 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2">
          <div className="bg-green-600 p-1.5 rounded-lg">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold">Certifica ESG</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2">
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-20 bg-stone-900/95 backdrop-blur-sm pt-20 px-6">
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setSelected(item.id as DashboardView);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-4 rounded-xl transition-all ${selected === item.id
                  ? "bg-green-600 text-white"
                  : "text-stone-400 hover:bg-stone-800 hover:text-white"
                  }`}
              >
                {item.icon}
                <span className="font-medium text-lg">{item.label}</span>
              </button>
            ))}
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-4 rounded-xl text-red-400 hover:bg-red-500/10 mt-8 border-t border-stone-800"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium text-lg">Sair</span>
            </button>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 lg:ml-72 pt-16 lg:pt-0 min-h-screen transition-all bg-stone-50/50">
        <header className="bg-white/80 backdrop-blur-md border-b border-stone-200 sticky top-0 z-10 px-8 py-5 hidden lg:flex justify-between items-center shadow-sm">
          <h2 className="text-2xl font-bold text-stone-800">
            {navItems[selected]?.label || "Painel"}
          </h2>
          <div className="flex items-center gap-4">
            {userRole === "admin" && currentViewRole !== "admin" && (
              <span className="bg-amber-50 text-amber-700 text-xs font-bold px-3 py-1.5 rounded-full border border-amber-200 flex items-center gap-2 animate-pulse">
                <Eye className="w-3 h-3" />
                Visualizando como {currentViewRole}
              </span>
            )}
            <span className="text-sm text-stone-500 font-medium">Último acesso: Hoje, 14:30</span>
          </div>
        </header>

        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto overflow-x-hidden">
          {renderPanel()}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
