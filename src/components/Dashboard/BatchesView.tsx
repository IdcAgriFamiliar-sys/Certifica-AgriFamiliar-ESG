import React from 'react';
import { Package, Truck, Search, Plus, Filter, Factory, CheckCircle, Clock } from 'lucide-react';
// Importação dos tipos globais
import { Batch } from '../../types'; 

// Simulação de dados usando a interface Batch importada
const mockBatches: Batch[] = [
  { id: 'LT-001A', produto: 'Café Especial', agricultor: 'Sítio Esperança', dataColheita: Date.now() - 86400000 * 15, statusRastreio: 'Pronto Venda', certificacaoID: 'CERT-001' },
  { id: 'LT-002B', produto: 'Mandioca Orgânica', agricultor: 'Fazenda União', dataColheita: Date.now() - 86400000 * 5, statusRastreio: 'Em Processamento', certificacaoID: 'CERT-002' },
  { id: 'LT-003C', produto: 'Milho Não-OGM', agricultor: 'Recanto Verde', dataColheita: Date.now() - 86400000 * 30, statusRastreio: 'Em Campo', certificacaoID: 'CERT-003' },
];

const getStatusColor = (status: Batch['statusRastreio']) => {
  switch (status) {
    case 'Pronto Venda':
      return 'bg-green-100 text-green-800';
    case 'Em Processamento':
      return 'bg-yellow-100 text-yellow-800';
    case 'Em Campo':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusIcon = (status: Batch['statusRastreio']) => {
  switch (status) {
    case 'Pronto Venda':
      return <Truck size={16} />;
    case 'Em Processamento':
      return <Factory size={16} />;
    case 'Em Campo':
      return <Clock size={16} />;
    default:
      return null;
  }
};

const BatchesView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <Package size={32} className="text-orange-600" />
          Rastreabilidade de Lotes de Produção
        </h3>
        <button className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition shadow-md">
          <Plus size={20} />
          Registrar Novo Lote
        </button>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="relative w-full max-w-lg">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por ID, Produto ou Agricultor..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
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
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lote / Produto</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agricultor</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data Colheita</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status Rastreio</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Certificação ID</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mockBatches.map((batch) => (
              <tr key={batch.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{batch.id}</div>
                  <div className="text-xs text-gray-500">{batch.produto}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{batch.agricultor}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(batch.dataColheita).toLocaleDateString('pt-BR')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(batch.statusRastreio)}`}>
                    {getStatusIcon(batch.statusRastreio)}
                    <span className="ml-1">{batch.statusRastreio}</span>
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-medium">
                  {batch.certificacaoID}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BatchesView;
