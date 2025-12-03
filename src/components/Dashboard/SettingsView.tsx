import React from 'react';
import { Settings, User, Lock, Bell } from 'lucide-react';

const SettingsView: React.FC = () => {
  const options = [
    { icon: <User size={18} />, title: 'Perfil do Usuário', desc: 'Atualize nome, e-mail e contato.' },
    { icon: <Lock size={18} />, title: 'Segurança', desc: 'Alterar senha e 2FA.' },
    { icon: <Bell size={18} />, title: 'Notificações', desc: 'Configurar alertas e lembretes.' },
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold flex items-center gap-3"><Settings size={28} className="text-gray-600" /> Configurações</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {options.map((o, i) => (
          <div key={i} className="bg-white p-4 rounded shadow flex items-start gap-4">
            <div className="text-gray-700">{o.icon}</div>
            <div>
              <h4 className="font-semibold">{o.title}</h4>
              <p className="text-sm text-gray-600">{o.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h4 className="font-semibold mb-2">Opções Avançadas</h4>
        <button className="px-3 py-2 bg-red-600 text-white rounded">Redefinir</button>
      </div>
    </div>
  );
};

export default SettingsView;
