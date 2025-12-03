import React from 'react';
import { Shield, UserPlus, Search, ChevronRight } from 'lucide-react';
import { Auditor } from '../../types';

const mockAuditors: Auditor[] = [
  { id: 'AUD-001', nome: 'Dr. Lucas Ribeiro', registro: 'C-10293', especialidade: 'Sustentabilidade', status: 'Aprovado', lastAudit: Date.now() - 86400000 * 5 },
  { id: 'AUD-002', nome: 'Dra. Camila Mendes', registro: 'C-10294', especialidade: 'Solo', status: 'Pendente', lastAudit: Date.now() - 86400000 * 30 },
  { id: 'AUD-003', nome: 'Eng. Rafael Rocha', registro: 'C-10295', especialidade: 'Resíduos', status: 'Aprovado', lastAudit: Date.now() - 86400000 * 90 },
];

const getStatusColor = (status: Auditor['status']) => {
  switch (status) {
    case 'Aprovado': return 'bg-green-100 text-green-800';
    case 'Pendente': return 'bg-yellow-100 text-yellow-800';
    case 'Rejeitado': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const AuditorsView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold flex items-center gap-3">
          <Shield size={28} className="text-purple-600" />
          Credenciamento de Auditores
        </h3>
        <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">
          <UserPlus size={18} /> Cadastrar Auditor
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center gap-4 mb-4">
          <div className="relative w-full max-w-md">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input className="w-full pl-10 pr-3 py-2 border rounded" placeholder="Buscar por nome ou registro..." />
          </div>
        </div>

        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Nome / Registro</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Especialidade</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Status</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Última Auditoria</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mockAuditors.map(a => (
              <tr key={a.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="font-medium text-sm text-gray-900">{a.nome}</div>
                  <div className="text-xs text-gray-500">Reg: {a.registro}</div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">{a.especialidade}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(a.status)}`}>
                    {a.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">{new Date(a.lastAudit).toLocaleDateString('pt-BR')}</td>
                <td className="px-4 py-3 text-right">
                  <button className="text-purple-600 hover:underline flex items-center gap-1">
                    Ver Perfil <ChevronRight size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuditorsView;
