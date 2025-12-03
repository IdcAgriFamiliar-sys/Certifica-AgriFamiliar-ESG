import React from 'react';
import { Briefcase, Clock, CheckCircle, XCircle, Search, Filter } from 'lucide-react';
import { Audit } from '../../types';

const mockAudits: Audit[] = [
  { id: 'AUDIT-001', certificacao: 'ESG Ouro', agricultor: 'Sítio Esperança', auditor: 'Dr. Lucas', dataAgendada: Date.now() + 86400000 * 2, status: 'Em Andamento' },
  { id: 'AUDIT-002', certificacao: 'Sustentabilidade', agricultor: 'Fazenda União', auditor: 'Dra. Camila', dataAgendada: Date.now() - 86400000 * 5, status: 'Concluída' },
];

const getStatusColor = (status: Audit['status']) => {
  switch (status) {
    case 'Concluída': return 'bg-green-100 text-green-800';
    case 'Em Andamento': return 'bg-yellow-100 text-yellow-800';
    case 'Cancelada': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getStatusIcon = (status: Audit['status']) => {
  switch (status) {
    case 'Concluída': return <CheckCircle size={16} />;
    case 'Em Andamento': return <Clock size={16} />;
    case 'Cancelada': return <XCircle size={16} />;
    default: return <Briefcase size={16} />;
  }
};

const AuditsView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold flex items-center gap-3"><Briefcase size={28} className="text-cyan-600" /> Agenda de Auditorias</h3>
        <div className="flex items-center gap-3">
          <button className="px-3 py-2 border rounded">Importar</button>
          <button className="px-3 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700">Agendar</button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center gap-4 mb-4">
          <div className="relative w-full max-w-lg">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input className="w-full pl-10 pr-3 py-2 border rounded" placeholder="Buscar por ID, agricultor ou auditor..." />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 border rounded text-gray-700"><Filter size={16} /> Filtrar</button>
        </div>

        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs text-gray-500">ID / Certificação</th>
              <th className="px-4 py-2 text-left text-xs text-gray-500">Agricultor / Auditor</th>
              <th className="px-4 py-2 text-left text-xs text-gray-500">Data</th>
              <th className="px-4 py-2 text-center text-xs text-gray-500">Status</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mockAudits.map(a => (
              <tr key={a.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="font-medium">{a.id}</div>
                  <div className="text-xs text-gray-500">{a.certificacao}</div>
                </td>
                <td className="px-4 py-3 text-sm">
                  <div>Agricultor: {a.agricultor}</div>
                  <div className="text-xs text-gray-500">Auditor: {a.auditor}</div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">{new Date(a.dataAgendada).toLocaleDateString('pt-BR')}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(a.status)}`}>
                    {getStatusIcon(a.status)}
                    <span className="ml-1">{a.status}</span>
                  </span>
                </td>
                <td className="px-4 py-3 text-right"><button className="text-cyan-600 hover:underline">Visualizar</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuditsView;
