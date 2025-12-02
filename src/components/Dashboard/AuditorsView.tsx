import React from 'react';
import { Shield, CheckCircle, Clock, XCircle, Eye, ChevronRight, Plus, Search } from 'lucide-react';

interface Auditor {
  id: string;
  nome: string;
  registro: string;
  especialidade: string;
  status: 'Aprovado' | 'Pendente' | 'Rejeitado';
  lastAudit: number;
}

const mockAuditors: Auditor[] = [
  { id: 'AUD-001', nome: 'Dr. Lucas Ribeiro', registro: 'CNA-12345', especialidade: 'Sustentabilidade', status: 'Aprovado', lastAudit: Date.now() - 86400000 * 5 },
  { id: 'AUD-002', nome: 'Dra. Camila Mendes', registro: 'CNA-67890', especialidade: 'Gestão de Resíduos', status: 'Pendente', lastAudit: Date.now() - 86400000 * 15 },
  { id: 'AUD-003', nome: 'Eng. Rafael Rocha', registro: 'CNA-11223', especialidade: 'Qualidade do Solo', status: 'Aprovado', lastAudit: Date.now() - 86400000 * 30 },
  { id: 'AUD-004', nome: 'Biol. Fernanda Lima', registro: 'CNA-44556', especialidade: 'Conservação Hídrica', status: 'Rejeitado', lastAudit: Date.now() - 86400000 * 60 },
];

const getStatusColor = (status: Auditor['status']) => {
  switch (status) {
    case 'Aprovado':
      return 'bg-green-100 text-green-800';
    case 'Pendente':
      return 'bg-yellow-100 text-yellow-800';
    case 'Rejeitado':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusIcon = (status: Auditor['status']) => {
  switch (status) {
    case 'Aprovado':
      return <CheckCircle size={16} />;
    case 'Pendente':
      return <Clock size={16} />;
    case 'Rejeitado':
      return <XCircle size={16} />;
    default:
      return <Shield size={16} />;
  }
};

const AuditorsView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <Shield size={32} className="text-indigo-600" />
          Auditores Credenciados
        </h3>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-md">
          <Plus size={20} />
          Novo Credenciamento
        </button>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="relative w-full max-w-md">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por Nome ou Registro..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome / Registro</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Especialidade</th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Última Auditoria</th>
              <th scope="col" className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mockAuditors.map((auditor) => (
              <tr key={auditor.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{auditor.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{auditor.nome}</div>
                  <div className="text-xs text-gray-500">{auditor.registro}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{auditor.especialidade}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(auditor.status)}`}>
                    {getStatusIcon(auditor.status)}
                    <span className="ml-1">{auditor.status}</span>
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(auditor.lastAudit).toLocaleDateString('pt-BR')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-indigo-600 hover:text-indigo-900 flex items-center gap-1">
                    <Eye size={18} /> Detalhes <ChevronRight size={16} />
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
