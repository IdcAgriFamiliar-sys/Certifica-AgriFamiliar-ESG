import React from 'react';
// CORREÇÃO TS6133: ArrowUpRight e ArrowDownRight removidos, pois não eram usados no código.
import { DollarSign, Search, Plus } from 'lucide-react'; 
import { Transaction } from '../../types';

// Assumindo que a interface Transaction está em '../../types'.
// type Transaction = {
//     id: string;
//     description: string;
//     amount: number;
//     type: 'Income' | 'Expense';
//     date: number;
// };

const mockTransactions: Transaction[] = [
    { id: 'T-001', description: 'Pagamento Certificação Sítio Esperança', amount: 5000, type: 'Income', date: Date.now() - 86400000 * 5 },
    { id: 'T-002', description: 'Compra Materiais', amount: -350.5, type: 'Expense', date: Date.now() - 86400000 * 12 },
];

const formatCurrency = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

const FinancesView: React.FC = () => {
    const income = mockTransactions.filter(t => t.type === 'Income').reduce((s, t) => s + Math.abs(t.amount), 0);
    const expense = mockTransactions.filter(t => t.type === 'Expense').reduce((s, t) => s + Math.abs(t.amount), 0);
    const balance = income - expense;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold flex items-center gap-3"><DollarSign size={28} className="text-lime-600" /> Gestão Financeira</h3>
                <button className="flex items-center gap-2 px-4 py-2 bg-lime-600 text-white rounded hover:bg-lime-700"><Plus size={16} /> Nova Transação</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded shadow">
                    <div className="text-sm text-gray-500">Receita</div>
                    <div className="text-2xl font-bold text-green-600">{formatCurrency(income)}</div>
                </div>
                <div className="bg-white p-4 rounded shadow">
                    <div className="text-sm text-gray-500">Despesa</div>
                    <div className="text-2xl font-bold text-red-600">{formatCurrency(expense)}</div>
                </div>
                <div className="bg-white p-4 rounded shadow">
                    <div className="text-sm text-gray-500">Saldo</div>
                    <div className="text-2xl font-bold">{formatCurrency(balance)}</div>
                </div>
            </div>

            <div className="bg-white p-6 rounded shadow">
                <div className="relative max-w-md mb-4">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input className="w-full pl-10 pr-3 py-2 border rounded" placeholder="Buscar por descrição..." />
                </div>

                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-2 text-left text-xs text-gray-500">Data</th>
                            <th className="px-4 py-2 text-left text-xs text-gray-500">Descrição</th>
                            <th className="px-4 py-2 text-right text-xs text-gray-500">Valor</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {mockTransactions.map(t => (
                            <tr key={t.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 text-sm text-gray-500">{new Date(t.date).toLocaleDateString('pt-BR')}</td>
                                <td className="px-4 py-3 text-sm font-medium">{t.description}</td>
                                <td className="px-4 py-3 text-right text-sm font-bold" style={{ color: t.type === 'Income' ? 'rgb(16,185,129)' : 'rgb(239,68,68)' }}>{formatCurrency(t.amount)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default FinancesView;
