import React from 'react';
import { BarChart3, FileText, Download, Filter, Calendar, Users, Shield, Package } from 'lucide-react';

interface ReportOptionProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel: string;
}

// ============================================================================
// COMPONENTE CARD DE OPÇÃO DE RELATÓRIO
// ============================================================================
const ReportOptionCard: React.FC<ReportOptionProps> = ({ icon, title, description, actionLabel }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-purple-500 flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center gap-3 mb-3 text-purple-600">
          {icon}
          <h4 className="text-xl font-semibold text-gray-800">{title}</h4>
        </div>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
      <button className="mt-4 flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition shadow-md w-full">
        <Download size={20} />
        {actionLabel}
      </button>
    </div>
  );
};

// ============================================================================
// COMPONENTE PRINCIPAL (ReportsView)
// ============================================================================
const ReportsView: React.FC = () => {
  return (
    <div className="space-y-6">
      <h3 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
        <BarChart3 size={32} className="text-purple-600" />
        Geração de Relatórios
      </h3>

      {/* Área de Filtros (Simulação) */}
      <div className="bg-white p-4 rounded-xl shadow-md flex items-center gap-4 flex-wrap">
        <Filter size={20} className="text-gray-500" />
        <span className="font-medium text-gray-700">Filtros Rápidos:</span>
        <button className="flex items-center gap-1 px-3 py-1 text-sm border border-gray-300 rounded-full hover:bg-gray-100 transition">
          <Calendar size={16} /> Últimos 30 dias
        </button>
        <button className="flex items-center gap-1 px-3 py-1 text-sm border border-gray-300 rounded-full hover:bg-gray-100 transition">
          <Users size={16} /> Apenas Aprovados
        </button>
        <button className="flex items-center gap-1 px-3 py-1 text-sm border border-gray-300 rounded-full hover:bg-gray-100 transition">
          <Shield size={16} /> Por Auditor
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ReportOptionCard
          icon={<FileText size={24} />}
          title="Relatório Detalhado de Certificações"
          description="Gere um documento completo com todos os dados de certificações, incluindo scores ESG e status de auditoria."
          actionLabel="Exportar Certificações (.XLSX)"
        />
        <ReportOptionCard
          icon={<Users size={24} />}
          title="Lista de Cadastro de Agricultores"
          description="Exporte a lista completa de todos os agricultores e suas propriedades, com status de credenciamento."
          actionLabel="Exportar Agricultores (.CSV)"
        />
        <ReportOptionCard
          icon={<Shield size={24} />}
          title="Desempenho de Auditores"
          description="Analise o volume de auditorias concluídas e a média de tempo de processamento por auditor credenciado."
          actionLabel="Exportar Desempenho (.PDF)"
        />
        <ReportOptionCard
          icon={<Package size={24} />}
          title="Rastreabilidade de Lotes"
          description="Relatório de rastreio de produtos, incluindo datas de colheita e status atual de cada lote no sistema."
          actionLabel="Exportar Lotes (.CSV)"
        />
      </div>
    </div>
  );
};

export default ReportsView;
