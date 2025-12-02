import React from 'react';
import { DollarSign, BarChart2, TrendingUp, TrendingDown, Clock, Shield, Users } from 'lucide-react';

interface FinanceCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  color: string;
  trend: 'up' | 'down' | 'neutral';
}

// ============================================================================
// COMPONENTE CARD (para métricas financeiras)
// ============================================================================
const FinanceCard: React.FC<FinanceCardProps> = ({ icon, title, value, color, trend }) => {
  const trendColor = trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-500';
  const trendIcon = trend === 'up' ? <TrendingUp size={20} /> : trend === 'down' ? <TrendingDown size={20} /> : <Clock size={20} />;
  
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border-b-4" style={{ borderColor: color }}>
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-500">{title}</h4>
        <div className={`text-xl font-bold ${color}`}>{icon}</div>
      </div>
      <div className="mt-1 flex items-end justify-between">
        <span className="text-3xl font-bold text-gray-900">{value}</span>
        <div className={`flex items-center text-sm font-semibold ${trendColor}`}>
          {trendIcon}
          <span className="ml-1">8.5%</span> {/* Simulação de % */}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// COMPONENTE PRINCIPAL (FinancesView)
// ============================================================================
const FinancesView: React.FC = () => {
  return (
    <div className="space-y-6">
      <h3 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
        <DollarSign size={32} className="text-teal-600" />
        Gestão Financeira
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <FinanceCard 
          icon={<BarChart2 size={24} />} 
          title="Receita Total (Mês)" 
          value="R$ 45.100" 
          color="rgb(5, 150, 105)" // Teal-600
          trend="up" 
        />
        <FinanceCard 
          icon={<Users size={24} />} 
          title="Pagamentos Auditores (Mês)" 
          value="R$ 12.500" 
          color="rgb(99, 102, 241)" // Indigo-500
          trend="neutral" 
        />
        <FinanceCard 
          icon={<Shield size={24} />} 
          title="Custo Certificação (Médio)" 
          value="R$ 350.00" 
          color="rgb(234, 179, 8)" // Yellow-500
          trend="down" 
        />
        <FinanceCard 
          icon={<DollarSign size={24} />} 
          title="Balanço Anual" 
          value="R$ 185K" 
          color="rgb(22, 163, 74)" // Green-600
          trend="up" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Transações Recentes */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg">
          <h4 className="text-lg font-semibold mb-4 text-gray-800">Transações Recentes</h4>
          <div className="h-64 flex items-center justify-center text-gray-500 border border-dashed rounded-lg">
            [Tabela de Transações - Em Breve]
          </div>
        </div>

        {/* Resumo de Despesas */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h4 className="text-lg font-semibold mb-4 text-gray-800">Resumo de Despesas</h4>
          <div className="h-64 flex items-center justify-center text-gray-500 border border-dashed rounded-lg">
            [Gráfico de Pizza - Em Breve]
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancesView;
