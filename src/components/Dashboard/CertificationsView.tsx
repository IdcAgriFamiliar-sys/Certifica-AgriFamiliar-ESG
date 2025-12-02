import React from 'react';
import { FileCheck, Clock, CheckCircle, XCircle, Eye, ChevronRight, Plus } from 'lucide-react';

// Tipos de dados (reutilizados do App.tsx, mas idealmente centralizados em 'src/types')
interface Certification {
  id: string;
  farmerName: string;
  status: 'Rascunho' | 'Pendente Auditoria' | 'Aprovado' | 'Rejeitado';
  esgScore: number;
  lastUpdate: number;
}

// Dados simulados
const mockCertifications: Certification[] = [
  { id: 'CERT-001', farmerName: 'Sítio Esperança - João Silva', status: 'Aprovado', esgScore: 85.5, lastUpdate: Date.now() - 86400000 * 5 }, // 5 dias atrás
  { id: 'CERT-002', farmerName: 'Fazenda União - Maria Costa', status: 'Pendente Auditoria', esgScore: 0, lastUpdate: Date.now() - 86400000 * 2 }, // 2 dias atrás
  { id: 'CERT-003', farmerName: 'Recanto Verde - Pedro Souza', status: 'Rejeitado', esgScore: 62.1, lastUpdate: Date.now() - 86400000 * 10 }, // 10 dias atrás
  { id: 'CERT-004', farmerName: 'Chácara Sol Nascente - Ana Lima', status: 'Rascunho', esgScore: 0, lastUpdate: Date.now() - 86400000 }, // 1 dia atrás
  { id: 'CERT-005', farmerName: 'Sítio Esperança - João Silva', status: 'Aprovado', esgScore: 92.0, lastUpdate: Date.now() - 86400000 * 20 }, // 20 dias atrás
];

const getStatusColor = (status: Certification['status']) => {
  switch (status) {
    case 'Aprovado':
      return 'bg-green-100 text-green-800';
    case 'Pendente Auditoria':
      return 'bg-yellow-100 text-yellow-800';
    case 'Rejeitado':
      return 'bg-red-100 text-red-800';
    case 'Rascunho':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusIcon = (status: Certification['status']) => {
  switch (status) {
    case 'Aprovado':
      return <CheckCircle size={16} />;
    case 'Pendente Auditoria':
      return <Clock size={16} />;
    case 'Rejeitado':
      return <XCircle size={16} />;
    default:
      return <FileCheck size={16} />;
  }
};

const CertificationsView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <FileCheck size={32} className="text-indigo-600" />
          Certificações ESG
        </h3>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-md">
          <Plus size={20} />
          Nova Certificação
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agricultor(a)</th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Score ESG</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Última Atualização</th>
              <th scope="col" className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mockCertifications.map((cert) => (
              <tr key={cert.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{cert.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{cert.farmerName}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(cert.status)}`}>
                    {getStatusIcon(cert.status)}
                    <span className="ml-1">{cert.status}</span>
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-bold">
                  {cert.esgScore > 0 ? (
                    <span className={cert.esgScore >= 80 ? 'text-green-600' : cert.esgScore >= 70 ? 'text-yellow-600' : 'text-red-600'}>
                      {cert.esgScore.toFixed(1)}%
                    </span>
                  ) : 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(cert.lastUpdate).toLocaleDateString('pt-BR')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-indigo-600 hover:text-indigo-900 flex items-center gap-1">
                    <Eye size={18} /> Ver Detalhes <ChevronRight size={16} />
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

export default CertificationsView;
