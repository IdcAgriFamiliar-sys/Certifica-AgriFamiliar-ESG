import React from 'react';
import { Settings, User, Lock, DollarSign, Bell, Globe } from 'lucide-react';

const SettingsView: React.FC = () => {
  const settingsOptions = [
    { icon: <User size={20} />, title: 'Perfil do Usuário', description: 'Gerencie seu nome, e-mail e informações de contato.' },
    { icon: <Lock size={20} />, title: 'Segurança e Senha', description: 'Altere sua senha e configure a autenticação de dois fatores.' },
    { icon: <DollarSign size={20} />, title: 'Configurações de Faturamento', description: 'Gerencie planos de assinatura e métodos de pagamento.' },
    { icon: <Bell size={20} />, title: 'Notificações', description: 'Defina como e quando você deseja receber alertas do sistema.' },
    { icon: <Globe size={20} />, title: 'Localização e Idioma', description: 'Configure o fuso horário, formato de data e idioma.' },
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
        <Settings size={32} className="text-gray-600" />
        Configurações do Sistema
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {settingsOptions.map((option, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-gray-400 hover:shadow-xl transition-shadow cursor-pointer">
            <div className="flex items-center gap-3 mb-2 text-gray-600">
              {option.icon}
              <h4 className="text-xl font-semibold text-gray-800">{option.title}</h4>
            </div>
            <p className="text-gray-500 text-sm">{option.description}</p>
            <button className="mt-3 text-indigo-600 text-sm font-medium hover:underline">
              Gerenciar
            </button>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h4 className="text-lg font-semibold mb-4 text-gray-800">Opções Avançadas (Administrador)</h4>
        <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition shadow-md">
          Redefinir Configurações Padrão
        </button>
      </div>
    </div>
  );
};

export default SettingsView;
