import React from 'react';
import { Briefcase, CheckCircle, Clock, XCircle, Search, ChevronRight, Filter } from 'lucide-react';
// Importação dos tipos globais
import { Audit } from '../../types'; 

// Simulação de dados usando a interface Audit importada
const mockAudits: Audit[] = [
  { id: 'AUDIT-2024-001', certificacao: 'ESG Nível Ouro', agricultor: 'Sítio Esperança', auditor: 'Dr. Lucas Ribeiro', dataAgendada: Date.now() - 86400000 * 10, status: 'Concluída' },
  { id: 'AUDIT-2024-002', certificacao: 'Sustentabilidade Básica', agricultor: 'Fazenda União', auditor: 'Dra. Camila Mendes', dataAgendada: Date.now() + 86400000 * 5, status: 'Em Andamento' },
  { id: 'AUDIT-2024-003', certificacao: 'Qualidade do Solo', agricultor: 'Recanto Verde', auditor: 'Eng. Rafael Rocha', dataAgendada: Date.now() - 86400000 * 20, status: 'Concluída' },
  { id: 'AUDIT-2024-004', certificacao: 'Gestão de Resíduos', agricultor: 'Chácara Sol Nascente', auditor: 'Biol. Fernanda Lima', dataAgendada: Date.now() - 86400000 * 2, status: 'Cancelada' },
];

const getStatusColor = (status: Audit['status']) => {
  switch (status) {
    case 'Concluída':
      return 'bg-green-100 text-green-800';
    case 'Em Andamento':
      return 'bg-yellow-100 text-yellow-800';
    case 'Cancelada':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusIcon = (status: Audit['status']) => {
  switch (status) {
    case 'Concluída':
      return <CheckCircle size={16} />;
    case 'Em Andamento':
      return <Clock size={16} />;
    case 'Cancelada':
      return <XCircle size={16} />;
    default:
      return <Briefcase size={16} />;
  }
};

const AuditsView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <Briefcase size={32} className="text-cyan-600" />
          Agenda de Auditorias
        </h3>
        <button className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition shadow-md">
          <Clock size={20} />
          Agendar Nova Auditoria
        </button>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="relative w-full max-w-lg">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por ID, Agricultor ou Auditor..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-cyan-500 focus:border-cyan-500"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">
          <Filter size={20} />
          Filtrar
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID / Certificação</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agricultor / Auditor</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data Agendada</th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mockAudits.map((audit) => (
              <tr key={audit.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{audit.id}</div>
                  <div className="text-xs text-gray-500">{audit.certificacao}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">Agricultor: {audit.agricultor}</div>
                  <div className="text-xs text-gray-500">Auditor: {audit.auditor}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {new Date(audit.dataAgendada).toLocaleDateString('pt-BR')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(audit.status)}`}>
                    {getStatusIcon(audit.status)}
                    <span className="ml-1">{audit.status}</span>
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-cyan-600 hover:text-cyan-900 flex items-center gap-1">
                    Visualizar <ChevronRight size={16} />
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

export default AuditsView;
