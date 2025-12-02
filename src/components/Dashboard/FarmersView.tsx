import React from 'react';
import { Users, FileCheck, MapPin, Search, ChevronRight, Plus, AlertCircle } from 'lucide-react';

interface Farmer {
  id: string;
  nomePropriedade: string;
  proprietario: string;
  localizacao: string;
  statusCertificacao: 'Certificado' | 'Em Avaliação' | 'Rejeitado';
  lastActivity: number;
}

const mockFarmers: Farmer[] = [
  { id: 'AGR-001', nomePropriedade: 'Sítio Esperança', proprietario: 'José da Silva', localizacao: 'Minas Gerais', statusCertificacao: 'Certificado', lastActivity: Date.now() - 86400000 * 2 },
  { id: 'AGR-002', nomePropriedade: 'Fazenda União', proprietario: 'Maria Oliveira', localizacao: 'São Paulo', statusCertificacao: 'Em Avaliação', lastActivity: Date.now() - 86400000 * 7 },
  { id: 'AGR-003', nomePropriedade: 'Recanto Verde', proprietario: 'João Santos', localizacao: 'Bahia', statusCertificacao: 'Certificado', lastActivity: Date.now() - 86400000 * 14 },
  { id: 'AGR-004', nomePropriedade: 'Chácara Sol Nascente', proprietario: 'Ana Costa', localizacao: 'Paraná', statusCertificacao: 'Rejeitado', lastActivity: Date.now() - 86400000 * 30 },
];

const getStatusColor = (status: Farmer['statusCertificacao']) => {
  switch (status) {
    case 'Certificado':
      return 'bg-green-100 text-green-800';
    case 'Em Avaliação':
      return 'bg-yellow-100 text-yellow-800';
    case 'Rejeitado':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusIcon = (status: Farmer['statusCertificacao']) => {
  switch (status) {
    case 'Certificado':
      return <FileCheck size={16} />;
    case 'Rejeitado':
      return <AlertCircle size={16} />;
    default:
      return <MapPin size={16} />;
  }
};

const FarmersView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <Users size={32} className="text-indigo-600" />
          Agricultores Cadastrados
        </h3>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-md">
          <Plus size={20} />
          Novo Cadastro
        </button>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="relative w-full max-w-md">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por Nome do Agricultor ou Propriedade..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Propriedade / Proprietário</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Localização</th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status Certificação</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Última Atividade</th>
              <th scope="col" className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mockFarmers.map((farmer) => (
              <tr key={farmer.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{farmer.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{farmer.nomePropriedade}</div>
                  <div className="text-xs text-gray-500">{farmer.proprietario}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{farmer.localizacao}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(farmer.statusCertificacao)}`}>
                    {getStatusIcon(farmer.statusCertificacao)}
                    <span className="ml-1">{farmer.statusCertificacao}</span>
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(farmer.lastActivity).toLocaleDateString('pt-BR')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-indigo-600 hover:text-indigo-900 flex items-center gap-1">
                    Detalhes <ChevronRight size={16} />
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

export default FarmersView;
