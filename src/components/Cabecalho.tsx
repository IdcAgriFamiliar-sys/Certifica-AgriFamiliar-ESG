import React from "react";
import { LogOut } from "lucide-react";
import type { UserRole, DashboardView } from "../types";

interface Props {
  activeViewName?: string;
  userRole: UserRole;
  onLogout: () => void;
  onSelectView?: (v: DashboardView) => void;
}

const Cabecalho: React.FC<Props> = ({
  activeViewName = "Dashboard",
  userRole,
  onLogout,
  onSelectView,
}) => {
  return (
    <header className="bg-white shadow p-4 flex justify-between items-center">
      <div>
        <h1 className="text-lg font-semibold text-gray-800">{activeViewName}</h1>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600 capitalize">Logado como: {userRole}</span>

        {onSelectView && (
          <select
            onChange={(e) => onSelectView(e.target.value as DashboardView)}
            className="border px-2 py-1 rounded">
            <option value="certificacoes">Certificações</option>
            <option value="agricultores">Agricultores</option>
            <option value="auditores">Auditores</option>
            <option value="auditorias">Auditorias</option>
            <option value="lotes">Lotes</option>
            <option value="financas">Finanças</option>
            <option value="relatorios">Relatórios</option>
            <option value="configuracoes">Configurações</option>
          </select>
        )}

        <button
          onClick={onLogout}
          className="flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded"
        >
          <LogOut className="w-4 h-4" />
          Sair
        </button>
      </div>
    </header>
  );
};

export default Cabecalho;
