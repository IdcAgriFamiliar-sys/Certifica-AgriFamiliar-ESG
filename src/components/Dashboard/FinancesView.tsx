import React, { useState } from 'react';
import { Search, Plus, TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { Transaction } from '../../types';
import Modal from '../Modal';

const mockTransactions: Transaction[] = [
    { id: 'T-001', description: 'Pagamento Certificação Sítio Esperança', amount: 5000, type: 'Income', date: Date.now() - 86400000 * 5 },
    { id: 'T-002', description: 'Compra Materiais', amount: -350.5, type: 'Expense', date: Date.now() - 86400000 * 12 },
    { id: 'T-003', description: 'Taxa de Auditoria', amount: -1200, type: 'Expense', date: Date.now() - 86400000 * 15 },
    { id: 'T-004', description: 'Subsídio Governamental', amount: 15000, type: 'Income', date: Date.now() - 86400000 * 20 },
];

const formatCurrency = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

const FinancesView: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const income = mockTransactions.filter(t => t.type === 'Income').reduce((s, t) => s + Math.abs(t.amount), 0);
    const expense = mockTransactions.filter(t => t.type === 'Expense').reduce((s, t) => s + Math.abs(t.amount), 0);
    const balance = income - expense;

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setIsModalOpen(false);
        alert("Transação registrada com sucesso! (Simulação)");
    };

    return (
        <div className="space-y-8 animate-fade-in-up">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h3 className="text-2xl font-bold text-stone-800">Gestão Financeira</h3>
                    <p className="text-stone-500">Controle de receitas, despesas e fluxo de caixa.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors shadow-lg shadow-green-200 font-medium"
                >
                    <Plus size={18} />
                    Nova Transação
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-green-50 rounded-xl">
                            <TrendingUp className="w-6 h-6 text-green-600" />
                        </div>
                        <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">+15%</span>
                    </div>
                    <div className="text-3xl font-bold text-stone-800 mb-1">{formatCurrency(income)}</div>
                    <div className="text-sm text-stone-500 font-medium">Receita Total</div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-red-50 rounded-xl">
                            <TrendingDown className="w-6 h-6 text-red-600" />
                        </div>
                        <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-lg">-2%</span>
                    </div>
                    <div className="text-3xl font-bold text-stone-800 mb-1">{formatCurrency(expense)}</div>
                    <div className="text-sm text-stone-500 font-medium">Despesas Totais</div>
                </div>
                <div className="bg-stone-900 p-6 rounded-2xl shadow-lg shadow-stone-200">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-stone-800 rounded-xl">
                            <Wallet className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xs font-bold text-white bg-stone-800 px-2 py-1 rounded-lg">Atual</span>
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">{formatCurrency(balance)}</div>
                    <div className="text-sm text-stone-400 font-medium">Saldo Disponível</div>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
                <div className="p-6 border-b border-stone-100 flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full md:w-96">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                        <input
                            className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-sm"
                            placeholder="Buscar por descrição..."
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-stone-100">
                        <thead className="bg-stone-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-stone-500 uppercase tracking-wider">Data</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-stone-500 uppercase tracking-wider">Descrição</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-stone-500 uppercase tracking-wider">Tipo</th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-stone-500 uppercase tracking-wider">Valor</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-stone-100">
                            {mockTransactions.map(t => (
                                <tr key={t.id} className="hover:bg-stone-50/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-600">
                                        {new Date(t.date).toLocaleDateString('pt-BR')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="font-medium text-stone-800">{t.description}</div>
                                        <div className="text-xs text-stone-400">{t.id}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${t.type === 'Income' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                                            {t.type === 'Income' ? 'Receita' : 'Despesa'}
                                        </span>
                                    </td>
                                    <td className={`px-6 py-4 whitespace-nowrap text-right text-sm font-bold ${t.type === 'Income' ? 'text-green-600' : 'text-red-600'}`}>
                                        {t.type === 'Income' ? '+' : '-'}{formatCurrency(Math.abs(t.amount))}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nova Transação">
                <form onSubmit={handleSave} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1">Descrição</label>
                        <input type="text" className="w-full px-4 py-2 border border-stone-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none" placeholder="Ex: Venda de Safra" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1">Tipo</label>
                        <select className="w-full px-4 py-2 border border-stone-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none">
                            <option value="Income">Receita</option>
                            <option value="Expense">Despesa</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1">Valor (R$)</label>
                        <input type="number" step="0.01" className="w-full px-4 py-2 border border-stone-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none" required />
                    </div>
                    <div className="pt-4 flex justify-end gap-3">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-xl transition-colors">Cancelar</button>
                        <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors shadow-lg shadow-green-200">Salvar Transação</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default FinancesView;
