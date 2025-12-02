import React from 'react';
import { BarChart3, FileText, Download, TrendingUp, DollarSign, Users, Shield } from 'lucide-react';

interface ReportCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

const ReportCard: React.FC<ReportCardProps> = ({ icon, title, description, color }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 hover:shadow-xl transition-shadow cursor-pointer" style={{ borderColor: color }}>
      <div className="flex items-center gap-3 mb-2 text-gray-600">
        <div className={`p-2 rounded-full`} style={{ backgroundColor: color, color: 'white' }}>
            {icon}
        </div>
        <h4 className="text-xl font-semibold text-gray-800">{title}</h4>
      </div>
      <p className="text-gray-500 text-sm mb-4">{description}</p>
      <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg text-white hover:opacity-90 transition shadow-md" style={{ backgroundColor: color }}>
        <Download size={18} />
        Gerar Relatório
      </button>
    </div>
  );
};

const ReportsView: React.FC = () => {
  const reports = [
    { icon: <TrendingUp size={20} />, title: 'Relatório de ESG Score', description: 'Visão detalhada do desempenho ESG de todos os agricultores ao longo do tempo.', color: 'rgb(59, 130, 246)' }, // blue-500
    { icon: <DollarSign size={20} />, title: 'Análise Financeira de Receitas', description: 'Geração de demonstrativos de receita por tipo de certificação e período.', color: 'rgb(22, 163, 74)' }, // green-600
    { icon: <Users size={20} />, title: 'Inventário de Agricultores', description: 'Lista completa de agricultores, status de certificação e localização geográfica.', color: 'rgb(124, 58, 237)' }, // violet-600
    { icon: <Shield size={20} />, title: 'Auditorias e Conformidade', description: 'Histórico de auditorias, pendências e índices de conformidade por auditor.', color: 'rgb(249, 115, 22)' }, // orange-500
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
        <BarChart3 size={32} className="text-red-600" />
        Geração de Relatórios Analíticos
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
        {reports.map((report, index) => (
          <ReportCard 
            key={index} 
            icon={report.icon} 
            title={report.title} 
            description={report.description} 
            color={report.color} 
          />
        ))}
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h4 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
            <FileText size={20} />
            Relatórios Personalizados
        </h4>
        <p className="text-gray-600 mb-4">Crie um relatório customizado selecionando fontes de dados, filtros e visualizações.</p>
        <button className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition shadow-md">
          Abrir Construtor de Relatórios
        </button>
      </div>
    </div>
  );
};

export default ReportsView;
