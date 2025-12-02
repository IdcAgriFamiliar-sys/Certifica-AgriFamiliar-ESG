import React from 'react';
import { DollarSign, ArrowUpRight, ArrowDownRight, Search, Plus, TrendingUp } from 'lucide-react';
// Importação dos tipos globais
import { Transaction } from '../../types'; 

// Simulação de dados usando a interface Transaction importada
const mockTransactions: Transaction[] = [
  { id: 'T-001', description: 'Pagamento Certificação Sítio Esperança', amount: 5000.00, type: 'Income', date: Date.now() - 86400000 * 5 },
  { id: 'T-002', description: 'Despesa - Salário Auditor Lucas', amount: -2500.00, type: 'Expense', date: Date.now() - 86400000 * 5 },
  { id: 'T-003', description: 'Pagamento Certificação Fazenda União', amount: 7500.00, type: 'Income', date: Date.now() - 86400000 * 15 },
  { id: 'T-004', description: 'Despesa - Material de Escritório', amount: -350.50, type: 'Expense', date: Date.now() - 86400000 * 20 },
];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(amount);
};

const getTransactionColor = (type: Transaction['type']) => {
  return type === 'Income' ? 'text-green-600' : 'text-red-600';
};

const getTransactionIcon = (type: Transaction['type']) => {
  return type === 'Income' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />;
};

const FinancesView: React.FC = () => {
  const totalIncome = mockTransactions.filter(t => t.type === 'Income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = mockTransactions.filter(t => t.type === 'Expense').reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const netBalance = totalIncome - totalExpense;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <DollarSign size={32} className="text-lime-600" />
          Gestão Financeira
        </h3>
        <button className="flex items-center gap-2 px-4 py-2 bg-lime-600 text-white rounded-lg hover:bg-lime-700 transition shadow-md">
          <Plus size={20} />
          Registrar Transação
        </button>
      </div>

      {/* Cartões de Resumo Financeiro */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-500">
          <h4 className="text-sm font-medium text-gray-500">Receita Total (Mês)</h4>
          <span className="text-3xl font-bold text-green-600">{formatCurrency(totalIncome)}</span>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-red-500">
          <h4 className="text-sm font-medium text-gray-500">Despesa Total (Mês)</h4>
          <span className="text-3xl font-bold text-red-600">{formatCurrency(totalExpense)}</span>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg border-l-4" style={{ borderColor: netBalance >= 0 ? 'rgb(59, 130, 246)' : 'rgb(249, 115, 22)' }}>
          <h4 className="text-sm font-medium text-gray-500">Saldo Líquido</h4>
          <span className="text-3xl font-bold" style={{ color: netBalance >= 0 ? 'rgb(59, 130, 246)' : 'rgb(249, 115, 22)' }}>
            {formatCurrency(netBalance)}
          </span>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h4 className="text-lg font-semibold mb-4 text-gray-800">Transações Recentes</h4>
        <div className="relative w-full max-w-md mb-4">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por descrição..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-lime-500 focus:border-lime-500"
          />
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(transaction.date).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {transaction.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getTransactionColor(transaction.type)} bg-opacity-10`}>
                      {getTransactionIcon(transaction.type)}
                      <span className="ml-1">{transaction.type === 'Income' ? 'Receita' : 'Despesa'}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold" style={{ color: getTransactionColor(transaction.type) }}>
                    {formatCurrency(transaction.amount)}
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

export default FinancesView;
