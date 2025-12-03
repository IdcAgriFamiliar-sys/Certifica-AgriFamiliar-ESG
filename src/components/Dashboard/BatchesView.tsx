import React from 'react';
// CORREÇÃO TS6133: 'Filter' removido pois não estava sendo usado.
import { Package, Truck, Factory, Plus, Search } from 'lucide-react'; 
// Assumindo que a interface Batch está definida em outro lugar,
// Vamos recriá-la aqui temporariamente se ela não estiver em '../../types'.
// Se o '../../types' já tiver sido corrigido, pode ignorar este bloco.
// Caso contrário, o build falhará em 'import { Batch } from '../../types';'
// ASSUMIR QUE '../../types' EXISTE E ESTÁ CORRETO para não introduzir código a mais.
import { Batch } from '../../types'; 

// Caso a importação do tipo 'Batch' falhe, use esta definição temporária
// type Batch = {
//     id: string;
//     produto: string;
//     agricultor: string;
//     dataColheita: number;
//     statusRastreio: 'Pronto Venda' | 'Em Processamento' | 'Em Campo';
//     certificacaoID: string;
// };


const mockBatches: Batch[] = [
    { id: 'LT-001', produto: 'Café Especial', agricultor: 'Sítio Esperança', dataColheita: Date.now() - 86400000 * 10, statusRastreio: 'Pronto Venda', certificacaoID: 'CERT-001' },
    { id: 'LT-002', produto: 'Mandioca Orgânica', agricultor: 'Fazenda União', dataColheita: Date.now() - 86400000 * 4, statusRastreio: 'Em Processamento', certificacaoID: 'CERT-002' },
];

const getStatusColor = (status: Batch['statusRastreio']) => {
    switch (status) {
        case 'Pronto Venda': return 'bg-green-100 text-green-800';
        case 'Em Processamento': return 'bg-yellow-100 text-yellow-800';
        case 'Em Campo': return 'bg-blue-100 text-blue-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

const getStatusIcon = (status: Batch['statusRastreio']) => {
    switch (status) {
        case 'Pronto Venda': return <Truck size={16} />;
        case 'Em Processamento': return <Factory size={16} />;
        case 'Em Campo': return <Package size={16} />;
        default: return null;
    }
};

const BatchesView: React.FC = () => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold flex items-center gap-3"><Package size={28} className="text-orange-600" /> Rastreabilidade de Lotes</h3>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input className="pl-10 pr-3 py-2 border rounded w-72" placeholder="Buscar por lote, produto ou agricultor..." />
                    </div>
                    <button className="flex items-center gap-2 px-3 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"><Plus size={16}/> Novo Lote</button>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-2 text-left text-xs text-gray-500">Lote / Produto</th>
                            <th className="px-4 py-2 text-left text-xs text-gray-500">Agricultor</th>
                            <th className="px-4 py-2 text-left text-xs text-gray-500">Data Colheita</th>
                            <th className="px-4 py-2 text-left text-xs text-gray-500">Status</th>
                            <th className="px-4 py-2 text-left text-xs text-gray-500">Certificação</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {mockBatches.map(b => (
                            <tr key={b.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3">
                                    <div className="font-medium">{b.id}</div>
                                    <div className="text-xs text-gray-500">{b.produto}</div>
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-700">{b.agricultor}</td>
                                <td className="px-4 py-3 text-sm text-gray-500">{new Date(b.dataColheita).toLocaleDateString('pt-BR')}</td>
                                <td className="px-4 py-3">
                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(b.statusRastreio)}`}>
                                        {getStatusIcon(b.statusRastreio)} <span className="ml-2">{b.statusRastreio}</span>
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-sm text-blue-600 font-medium">{b.certificacaoID}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BatchesView;
