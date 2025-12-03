import React from 'react';
import { LogOut } from 'lucide-react';
import { UserRole } from '../App';

interface CabecalhoProps {
  activeViewName: string;
  userRole: UserRole;
  onLogout: () => void;
}

const Cabecalho: React.FC<CabecalhoProps> = ({ activeViewName, userRole, onLogout }) => {
  return (
    <header className="bg-white shadow-md p-4 flex justify-between items-center">
      <h1 className="text-2xl font-semibold text-gray-800">{activeViewName}</h1>

      <div className="flex items-center space-x-4">
        <span className="text-gray-600 font-medium capitalize">
          Logado como: {userRole}
        </span>

        <button
          onClick={onLogout}
          className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-300"
        >
          <LogOut className="w-5 h-5 mr-2" />
          Sair
        </button>
      </div>
    </header>
  );
};

export default Cabecalho;
