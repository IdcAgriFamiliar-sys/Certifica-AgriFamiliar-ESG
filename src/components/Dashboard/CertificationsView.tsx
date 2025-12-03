import React, { useState } from 'react';
import { FileCheck, Users, Clock, Plus, Search } from 'lucide-react';
import { Certification } from '../../types';

const mockCerts: Certification[] = [
  { id: 'CERT-001', nome: 'Sustentabilidade Básica', nivel: 'Bronze', agricultor: 'Sítio Esperança', auditor: 'Dr. Lucas', status: 'Ativo', validade: Date.now() + 86400000 * 30 },
  { id: 'CERT-002', nome: 'ESG Ouro', nivel: 'Ouro', agricultor: 'Fazenda União', auditor: 'Dra. Camila', status: 'Pendente', validade: Date.now() + 86400000 * 180 },
];

const getStatusColor = (status: Certification['status']) => {
  switch (status) {
    case 'Ativo': return 'bg-green-100 text-green-800';
    case 'Pendente': return 'bg-yellow-100 text-yellow-800';
    case 'Vencido': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const CertificationsView: React.FC = () => {
  const [filter, setFilter] = useState('');

  const filtered = mockCerts.filter(c =>
    c.nome.toLowerCase().includes(filter.toLowerCase()) ||
    c.agricultor.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold flex items-center gap-3"><FileCheck size={28} className="text-green-600" /> Gestão de Certificações</h3>
        <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"><Plus size={16} /> Nova Certificação</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <div className="text-sm text-gray-500">Ativas</div>
          <div className="text-2xl font-bold"> {mockCerts.filter(c => c.status === 'Ativo').length} </div>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <div className="text-sm text-gray-500">Pendentes</div>
          <div className="text-2xl font-bold"> {mockCerts.filter(c => c.status === 'Pendente').length} </div>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <div className="text-sm text-gray-500">Vencidas</div>
          <div className="text-2xl font-bold"> {mockCerts.filter(c => c.status === 'Vencido').length} </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded shadow">
        <div className="relative mb-4 max-w-lg">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={filter} onChange={(e) => setFilter(e.target.value)} className="w-full pl-10 pr-3 py-2 border rounded" placeholder="Buscar por nome ou agricultor..." />
        </div>

        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs text-gray-500">ID / Nome</th>
              <th className="px-4 py-2 text-left text-xs text-gray-500">Nível</th>
              <th className="px-4 py-2 text-left text-xs text-gray-500">Agricultor / Auditor</th>
              <th className="px-4 py-2 text-left text-xs text-gray-500">Status</th>
              <th className="px-4 py-2 text-left text-xs text-gray-500">Validade</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filtered.map(c => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="font-medium">{c.id}</div>
                  <div className="text-xs text-gray-500">{c.nome}</div>
                </td>
                <td className="px-4 py-3 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${c.nivel === 'Ouro' ? 'bg-yellow-100 text-yellow-800' : c.nivel === 'Prata' ? 'bg-gray-100 text-gray-800' : 'bg-orange-100 text-orange-800'}`}>
                    {c.nivel}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm">
                  <div>{c.agricultor}</div>
                  <div className="text-xs text-gray-500">Auditor: {c.auditor}</div>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(c.status)}`}>{c.status}</span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">{new Date(c.validade).toLocaleDateString('pt-BR')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CertificationsView;
