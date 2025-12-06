import React, { useState, useEffect } from 'react';
import { Search, Plus, TrendingUp, TrendingDown, Wallet, Trash2, Download, FileText, Tag, DollarSign } from 'lucide-react';
import Modal from '../Modal';
import { db } from '../../services/firebase';
import { collection, onSnapshot, addDoc, query, orderBy, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';

const formatCurrency = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

const FinancesView: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [transactions, setTransactions] = useState<any[]>([]);

    // Form State
    const [desc, setDesc] = useState("");
    const [type, setType] = useState("Income");
    const [amount, setAmount] = useState("");

    useEffect(() => {
        const q = query(collection(db, "finances"), orderBy("date", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setTransactions(data);
        });
        return () => unsubscribe();
    }, []);

    const income = transactions.filter(t => t.type === 'Income').reduce((s, t) => s + Math.abs(t.amount), 0);
    const expense = transactions.filter(t => t.type === 'Expense').reduce((s, t) => s + Math.abs(t.amount), 0);
    const balance = income - expense;

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const val = parseFloat(amount);
            await addDoc(collection(db, "finances"), {
                description: desc,
                type: type,
                amount: val,
                date: Date.now(),
                createdAt: serverTimestamp()
            });
            setIsModalOpen(false);
            setDesc("");
            setAmount("");
            setType("Income");
        } catch (error) {
            console.error("Error adding transaction:", error);
            alert("Erro ao salvar transação.");
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Tem certeza que deseja excluir esta transação?")) {
            try {
                await deleteDoc(doc(db, "finances", id));
            } catch (error) {
                console.error("Error deleting transaction:", error);
                alert("Erro ao excluir transação.");
            }
        }
    };

    const handleExport = () => {
        const headers = ["Data", "Descrição", "Tipo", "Valor"];
        const rows = transactions.map(t => [
            new Date(t.date).toLocaleDateString('pt-BR'),
            t.description,
            t.type === 'Income' ? 'Receita' : 'Despesa',
            t.amount.toString()
        ]);

        const csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "financas_export.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-8 animate-fade-in-up">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h3 className="text-2xl font-bold text-stone-800">Gestão Financeira</h3>
                    <p className="text-stone-500">Controle de receitas, despesas e fluxo de caixa.</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleExport}
                        className="flex items-center gap-2 px-4 py-2.5 border border-stone-200 rounded-xl text-stone-600 hover:bg-stone-50 transition-colors font-medium bg-white"
                    >
                        <Download size={18} />
                        Exportar
                    </button>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors shadow-lg shadow-green-200 font-medium"
                    >
                        <Plus size={18} />
                        Nova Transação
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-green-50 rounded-xl">
                            <TrendingUp className="w-6 h-6 text-green-600" />
                        </div>

                    </div>
                    <div className="text-3xl font-bold text-stone-800 mb-1">{formatCurrency(income)}</div>
                    <div className="text-sm text-stone-500 font-medium">Receita Total</div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-red-50 rounded-xl">
                            <TrendingDown className="w-6 h-6 text-red-600" />
                        </div>
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
                                <th className="px-6 py-4 text-right text-xs font-bold text-stone-500 uppercase tracking-wider">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-stone-100">
                            {transactions.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-stone-500">
                                        Nenhuma transação registrada.
                                    </td>
                                </tr>
                            )}
                            {transactions.map(t => (
                                <tr key={t.id} className="hover:bg-stone-50/50 transition-colors group">
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
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <button
                                            onClick={() => handleDelete(t.id)}
                                            className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                            title="Excluir"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nova Transação">
                <form onSubmit={handleSave} className="space-y-6">
                    <div className="bg-stone-50 p-4 rounded-xl border border-stone-100 mb-6">
                        <p className="text-sm text-stone-500 mb-4">Registro de receitas e despesas.</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="col-span-2">
                                <label className="block text-sm font-bold text-stone-700 mb-2 flex items-center gap-2">
                                    <FileText size={16} className="text-green-600" /> Descrição
                                </label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all font-medium text-stone-800 placeholder:text-stone-400"
                                    placeholder="Ex: Venda de Safra"
                                    value={desc}
                                    onChange={e => setDesc(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="col-span-2 md:col-span-1">
                                <label className="block text-sm font-bold text-stone-700 mb-2 flex items-center gap-2">
                                    <Tag size={16} className="text-green-600" /> Tipo
                                </label>
                                <div className="relative">
                                    <select
                                        className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all font-medium text-stone-800 appearance-none cursor-pointer"
                                        value={type}
                                        onChange={e => setType(e.target.value)}
                                    >
                                        <option value="Income">Receita</option>
                                        <option value="Expense">Despesa</option>
                                    </select>
                                </div>
                            </div>

                            <div className="col-span-2 md:col-span-1">
                                <label className="block text-sm font-bold text-stone-700 mb-2 flex items-center gap-2">
                                    <DollarSign size={16} className="text-green-600" /> Valor (R$)
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all font-medium text-stone-800 placeholder:text-stone-400"
                                    value={amount}
                                    onChange={e => setAmount(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 flex justify-end gap-3 border-t border-stone-100">
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="px-6 py-3 text-stone-600 hover:bg-stone-100 rounded-xl transition-colors font-bold text-sm"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-8 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 hover:shadow-lg hover:shadow-green-700/20 active:scale-95 transition-all font-bold text-sm flex items-center gap-2"
                        >
                            <Plus size={18} />
                            Salvar Transação
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default FinancesView;
