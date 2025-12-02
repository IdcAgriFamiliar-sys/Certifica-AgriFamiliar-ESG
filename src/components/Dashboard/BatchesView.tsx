import React from 'react';
import { Package, MapPin, CheckCircle, Clock, XCircle, Plus, Search, ChevronRight } from 'lucide-react';

interface Batch {
  id: string;
  produto: string;
  agricultor: string;
  dataColheita: number;
  statusRastreio: 'Pronto Venda' | 'Em Processamento' | 'Em Campo';
  certificacaoID: string;
}

const mockBatches: Batch[] = [
  { id: 'LOTE-1021', produto: 'Café Orgânico (Arábica)', agricultor: 'Sítio Esperança', dataColheita: Date.now() - 86400000 * 3, statusRastreio: 'Pronto Venda', certificacaoID: 'CERT-001' },
  { id: 'LOTE-1022', produto: 'Feijão Carioca', agricultor: 'Fazenda União', dataColheita: Date.now() - 86400000 * 10, statusRastreio: 'Em Processamento', certificacaoID: 'CERT-002' },
  { id: 'LOTE-1023', produto: 'Mandioca', agricultor: 'Recanto Verde', dataColheita: Date.now() - 86400000 * 1, statusRastreio: 'Em Campo', certificacaoID: 'N/A' },
  { id: 'LOTE-1024', produto: 'Banana Prata', agricultor: 'Chácara Sol Nascente', dataColheita: Date.now() - 86400000 * 5, statusRastreio: 'Pronto Venda', certificacaoID: 'CERT-004' },
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
      return <CheckCircle size={16} />;
    case 'Em Processamento':
      return <Clock size={16} />;
    default:
      return <MapPin size={16} />;
  }
};

const BatchesView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <Package size={32} className="text-orange-600" />
          Rastreabilidade e Lotes de Produção
        </h3>
        <button className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition shadow-md">
          <Plus size={20} />
          Novo Lote
        </button>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="relative w-full max-w-md">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por Lote ID ou Produto..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
          />
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lote ID</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produto / Agricultor</th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Data Colheita</th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status Rastreio</th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Certificação</th>
              <th scope="col" className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mockBatches.map((batch) => (
              <tr key={batch.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{batch.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{batch.produto}</div>
                  <div className="text-xs text-gray-500">Produtor: {batch.agricultor}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center">
                  {new Date(batch.dataColheita).toLocaleDateString('pt-BR')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(batch.statusRastreio)}`}>
                    {getStatusIcon(batch.statusRastreio)}
                    <span className="ml-1">{batch.statusRastreio}</span>
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                  <span className={batch.certificacaoID !== 'N/A' ? 'text-indigo-600 font-semibold' : 'text-gray-500'}>
                    {batch.certificacaoID}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-orange-600 hover:text-orange-900 flex items-center gap-1">
                    Rastrear <ChevronRight size={16} />
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

export default BatchesView;
