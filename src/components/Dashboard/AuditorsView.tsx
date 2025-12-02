import React from 'react';
import { Shield, UserPlus, FileText, Search, ChevronRight, CheckCircle, Clock, XCircle } from 'lucide-react';
// Importação dos tipos globais
import { Auditor } from '../../types'; 

const mockAuditors: Auditor[] = [
  { id: 'AUD-001', nome: 'Dr. Lucas Ribeiro', registro: 'C-10293', especialidade: 'Sustentabilidade', status: 'Aprovado', lastAudit: Date.now() - 86400000 * 5 },
  { id: 'AUD-002', nome: 'Dra. Camila Mendes', registro: 'C-10294', especialidade: 'Qualidade do Solo', status: 'Pendente', lastAudit: Date.now() - 86400000 * 30 },
  { id: 'AUD-003', nome: 'Eng. Rafael Rocha', registro: 'C-10295', especialidade: 'Gestão de Resíduos', status: 'Aprovado', lastAudit: Date.now() - 86400000 * 90 },
  { id: 'AUD-004', nome: 'Biol. Fernanda Lima', registro: 'C-10296', especialidade: 'ESG', status: 'Rejeitado', lastAudit: Date.now() - 86400000 * 180 },
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
      return null;
  }
};

const AuditorsView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <Shield size={32} className="text-purple-600" />
          Credenciamento de Auditores
        </h3>
        <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition shadow-md">
          <UserPlus size={20} />
          Cadastrar Novo Auditor
        </button>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="relative w-full max-w-md">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por Nome ou Registro..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
          />
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg overflow-x-auto">
        <h4 className="text-lg font-semibold mb-4 text-gray-800">Lista de Credenciados</h4>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome / Registro</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Especialidade</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Última Auditoria</th>
              <th scope="col" className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mockAuditors.map((auditor) => (
              <tr key={auditor.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{auditor.nome}</div>
                  <div className="text-xs text-gray-500">Reg: {auditor.registro}</div>
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
                  <button className="text-purple-600 hover:text-purple-900 flex items-center gap-1">
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
