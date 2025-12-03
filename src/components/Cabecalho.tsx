// src/components/Cabeçalho.tsx
import React from "react";
import { LogOut } from "lucide-react";
import type { UserRole } from "../App";

interface Props {
  activeViewName?: string;
  userRole: UserRole;
  onLogout: () => void;
}

const Cabeçalho: React.FC<Props> = ({ activeViewName = "Dashboard", userRole, onLogout }) => {
  return (
    <header className="bg-white shadow p-4 flex justify-between items-center">
      <div>
        <h1 className="text-lg font-semibold text-gray-800">{activeViewName}</h1>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600 capitalize">Logado como: {userRole}</span>
        <button onClick={onLogout} className="flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded">
          <LogOut className="w-4 h-4" />
          Sair
        </button>
      </div>
    </header>
  );
};

export default Cabeçalho;
