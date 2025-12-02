import React, { useState } from 'react';
import { FileCheck, Users, Shield, TrendingUp, Search, Plus, XCircle, Clock, CheckCircle } from 'lucide-react';
// Importação dos tipos globais
import { Certification } from '../../types'; 

interface CertificationCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  color: string;
}

// Simulação de dados usando a interface Certification importada
const mockCertifications: Certification[] = [
  { id: 'CERT-001', nome: 'Sustentabilidade Básica', nivel: 'Bronze', agricultor: 'Sítio Esperança', auditor: 'Dr. Lucas', status: 'Ativo', validade: Date.now() + 86400000 * 30 },
  { id: 'CERT-002', nome: 'ESG Nível Ouro', nivel: 'Ouro', agricultor: 'Fazenda União', auditor: 'Dra. Camila', status: 'Pendente', validade: Date.now() + 86400000 * 180 },
  { id: 'CERT-003', nome: 'Qualidade do Solo', nivel: 'Prata', agricultor: 'Recanto Verde', auditor: 'Eng. Rafael', status: 'Vencido', validade: Date.now() - 86400000 * 5 },
];

const getStatusColor = (status: Certification['status']) => {
  switch (status) {
    case 'Ativo':
      return 'bg-green-100 text-green-800';
    case 'Pendente':
      return 'bg-yellow-100 text-yellow-800';
    case 'Vencido':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusIcon = (status: Certification['status']) => {
  switch (status) {
    case 'Ativo':
      return <CheckCircle size={16} />;
    case 'Pendente':
      return <Clock size={16} />;
    case 'Vencido':
      return <XCircle size={16} />;
    default:
      return null;
  }
};

const CertificationCard: React.FC<CertificationCardProps> = ({ icon, title, value, color }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border-b-4" style={{ borderColor: color }}>
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-500">{title}</h4>
        <div className="text-xl font-bold" style={{ color: color }}>{icon}</div>
      </div>
      <div className="mt-1">
        <span className="text-3xl font-bold text-gray-900">{value}</span>
      </div>
    </div>
  );
};

const CertificationsView: React.FC = () => {
  const [filter, setFilter] = useState('');

  const filteredCertifications = mockCertifications.filter(cert =>
    cert.nome.toLowerCase().includes(filter.toLowerCase()) ||
    cert.agricultor.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <FileCheck size={32} className="text-green-600" />
          Gestão de Certificações ESG
        </h3>
        <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-md">
          <Plus size={20} />
          Nova Certificação
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <CertificationCard 
          icon={<FileCheck size={24} />} 
          title="Total Ativas" 
          value="87" 
          color="rgb(22, 163, 74)" // green-600
        />
        <CertificationCard 
          icon={<Clock size={24} />} 
          title="Pendentes/A Vencer" 
          value="12" 
          color="rgb(234, 179, 8)" // yellow-500
        />
        <CertificationCard 
          icon={<Users size={24} />} 
          title="Ouro (Nível Máximo)" 
          value="25" 
          color="rgb(59, 130, 246)" // blue-500
        />
        <CertificationCard 
          icon={<Shield size={24} />} 
          title="Média Score ESG" 
          value="78.2" 
          color="rgb(124, 58, 237)" // violet-600
        />
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h4 className="text-lg font-semibold mb-4 text-gray-800">Lista Detalhada de Certificações</h4>
        <div className="relative w-full max-w-lg mb-4">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por Nome da Certificação ou Agricultor..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID / Nome</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nível</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agricultor / Auditor</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Validade</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCertifications.map((cert) => (
                <tr key={cert.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{cert.id}</div>
                    <div className="text-xs text-gray-500">{cert.nome}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      cert.nivel === 'Ouro' ? 'bg-yellow-100 text-yellow-800' : 
                      cert.nivel === 'Prata' ? 'bg-gray-100 text-gray-800' : 
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {cert.nivel}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{cert.agricultor}</div>
                    <div className="text-xs text-gray-500">Auditor: {cert.auditor}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(cert.status)}`}>
                      {getStatusIcon(cert.status)}
                      <span className="ml-1">{cert.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(cert.validade).toLocaleDateString('pt-BR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CertificationsView;
