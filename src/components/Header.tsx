import React from 'react';
import { UserPlus, ShieldCheck, LogIn, Leaf } from 'lucide-react';

interface HeaderProps {
  setActiveView: (view: 'landing' | 'farmer-register' | 'auditor-credential' | 'login' | 'dashboard') => void;
}

const Header: React.FC<HeaderProps> = ({ setActiveView }) => {
  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-green-600 cursor-pointer flex items-center gap-2" onClick={() => setActiveView('landing')}>
          <Leaf size={24} />
          Certifica AgriFamiliar ESG
        </h1>
        <nav className="flex space-x-4">
          <button 
            onClick={() => setActiveView('farmer-register')}
            className="flex items-center gap-1 text-gray-700 hover:text-indigo-600 transition"
          >
            <UserPlus size={18} /> Cadastro
          </button>
          <button 
            onClick={() => setActiveView('auditor-credential')}
            className="flex items-center gap-1 text-gray-700 hover:text-indigo-600 transition"
          >
            <ShieldCheck size={18} /> Auditor
          </button>
          <button 
            onClick={() => setActiveView('login')}
            className="flex items-center gap-1 text-white bg-indigo-600 px-3 py-1 rounded-lg hover:bg-indigo-700 transition"
          >
            <LogIn size={18} /> Login
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
