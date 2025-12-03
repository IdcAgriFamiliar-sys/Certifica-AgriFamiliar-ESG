import React from 'react';
import { Users, UserPlus, Search, ChevronRight, AlertCircle } from 'lucide-react';
import { Farmer } from '../../types';

const mockFarmers: Farmer[] = [
  { id: 'AGR-001', nomePropriedade: 'Sítio Esperança', proprietario: 'José Silva', localizacao: 'Ceará', statusCertificacao: 'Certificado', lastActivity: Date.now() - 86400000 * 2 },
  { id: 'AGR-002', nomePropriedade: 'Fazenda União', proprietario: 'Maria Oliveira', localizacao: 'Pernambuco', statusCertificacao: 'Em Avaliação', lastActivity: Date.now() - 86400000 * 7 },
];

const getStatusColor = (status: Farmer['statusCertificacao']) => {
  switch (status) {
    case 'Certificado': return 'bg-green-100 text-green-800';
    case 'Em Avaliação': return 'bg-yellow-100 text-yellow-800';
    case 'Rejeitado': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getStatusIcon = (status: Farmer['statusCertificacao']) => {
  switch (status) {
    case 'Certificado': return null;
    case 'Rejeitado': return <AlertCircle size={14} />;
    default: return null;
  }
};

const FarmersView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold flex items-center gap-3"><Users size={28} className="text-indigo-600" /> Agricultores</h3>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"><UserPlus size={16} /> Novo Cadastro</button>
      </div>

      <div className="bg-white p-6 rounded shadow">
        <div className="relative max-w-md mb-4">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input className="w-full pl-10 pr-3 py-2 border rounded" placeholder="Buscar por nome da propriedade ou proprietário..." />
        </div>

        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs text-gray-500">ID</th>
              <th className="px-4 py-2 text-left text-xs text-gray-500">Propriedade / Proprietário</th>
              <th className="px-4 py-2 text-left text-xs text-gray-500">Localização</th>
              <th className="px-4 py-2 text-left text-xs text-gray-500">Status</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mockFarmers.map(f => (
              <tr key={f.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium">{f.id}</td>
                <td className="px-4 py-3">
                  <div className="font-medium">{f.nomePropriedade}</div>
                  <div className="text-xs text-gray-500">{f.proprietario}</div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">{f.localizacao}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(f.statusCertificacao)}`}>
                    {getStatusIcon(f.statusCertificacao)}
                    <span className="ml-1">{f.statusCertificacao}</span>
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button className="text-indigo-600 hover:underline flex items-center gap-1">Detalhes <ChevronRight size={14} /></button>
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
