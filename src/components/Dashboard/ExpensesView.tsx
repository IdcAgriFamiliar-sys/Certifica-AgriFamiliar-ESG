import React, { useState, useEffect } from "react";
import { TrendingDown, Plus, Tag, FileDown } from "lucide-react";
import Button from "../Button";
import Modal from "../Modal";
import { collection, addDoc, query, where, getDocs, orderBy, serverTimestamp } from "firebase/firestore";
import { db } from "../../services/firebase";
import { useAuth } from "../../contexts/AuthContext";
import { generateReport } from "../../utils/reportGenerator";

const ExpensesView: React.FC = () => {
    const { user } = useAuth();
    const [expenses, setExpenses] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        type: "Insumos",
        description: "",
        value: "",
        details: "" // For planting/harvest details
    });

    const fetchExpenses = async () => {
        if (!user) return;
        const q = query(
            collection(db, "expenses"),
            where("userId", "==", user.uid),
            orderBy("date", "desc")
        );
        const snapshot = await getDocs(q);
        setExpenses(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    };

    useEffect(() => {
        fetchExpenses();
    }, [user]);

    const handleDownloadReport = () => {
        const data = expenses.map(e => ({
            date: new Date(e.date).toLocaleDateString('pt-BR'),
            type: e.type,
            description: e.description,
            details: e.details || '-',
            value: `R$ ${parseFloat(e.value).toFixed(2)}`
        }));
        generateReport("Relatório de Gastos", data, ["Data", "Tipo", "Descrição", "Detalhes", "Valor"]);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        if (!formData.description.trim() || !formData.value) {
            alert("Preencha a descrição e o valor.");
            return;
        }

        setLoading(true);
        try {
            await addDoc(collection(db, "expenses"), {
                ...formData,
                userId: user.uid,
                createdAt: serverTimestamp(),
                value: parseFloat(formData.value) || 0
            });
            setIsModalOpen(false);
            fetchExpenses();
            setFormData({
                date: new Date().toISOString().split('T')[0],
                type: "Insumos",
                description: "",
                value: "",
                details: ""
            });
            alert("Gasto registrado com sucesso!");
        } catch (error) {
            console.error("Error adding expense:", error);
            alert("Erro ao registrar gasto. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    const totalExpenses = expenses.reduce((acc, curr) => acc + (parseFloat(curr.value) || 0), 0);

    return (
        <div className="space-y-8 animate-fade-in-up">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h3 className="text-2xl font-bold text-stone-800">Meus Gastos</h3>
                    <p className="text-stone-500">Controle seus custos de produção e investimentos.</p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={handleDownloadReport}
                        leftIcon={<FileDown className="w-5 h-5" />}
                        disabled={expenses.length === 0}
                    >
                        Baixar Relatório
                    </Button>
                    <Button onClick={() => setIsModalOpen(true)} leftIcon={<Plus className="w-5 h-5" />}>
                        Novo Gasto
                    </Button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 bg-red-100 rounded-xl text-red-600">
                            <TrendingDown className="w-6 h-6" />
                        </div>
                        <span className="text-stone-500 font-medium">Total de Gastos</span>
                    </div>
                    <h4 className="text-3xl font-bold text-stone-900">
                        R$ {totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </h4>
                </div>
            </div>

            {/* Expenses Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-stone-100">
                        <thead className="bg-stone-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-stone-500 uppercase tracking-wider">Data</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-stone-500 uppercase tracking-wider">Tipo</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-stone-500 uppercase tracking-wider">Descrição</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-stone-500 uppercase tracking-wider">Detalhes</th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-stone-500 uppercase tracking-wider">Valor (R$)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                            {expenses.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-stone-500">
                                        <Tag className="w-12 h-12 mx-auto mb-3 text-stone-300" />
                                        Nenhum gasto registrado ainda.
                                    </td>
                                </tr>
                            ) : (
                                expenses.map((expense) => (
                                    <tr key={expense.id} className="hover:bg-stone-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-600">
                                            {new Date(expense.date).toLocaleDateString('pt-BR')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-stone-100 text-stone-800">
                                                {expense.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap font-medium text-stone-800">
                                            {expense.description}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500">
                                            {expense.details || "-"}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-red-600 text-right">
                                            - R$ {parseFloat(expense.value).toFixed(2)}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Registrar Gasto">
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-1.5">Data *</label>
                            <input
                                type="date"
                                required
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                className="w-full px-4 py-2.5 border border-stone-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-1.5">Tipo de Gasto *</label>
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                className="w-full px-4 py-2.5 border border-stone-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none bg-white transition-all"
                            >
                                <option value="Insumos">Insumos (Sementes, Adubo)</option>
                                <option value="Mão de Obra">Mão de Obra</option>
                                <option value="Maquinário">Maquinário / Combustível</option>
                                <option value="Manutenção">Manutenção</option>
                                <option value="Outros">Outros</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1.5">Descrição *</label>
                        <input
                            placeholder="Ex: Compra de Adubo Orgânico"
                            required
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-4 py-2.5 border border-stone-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all"
                        />
                    </div>

                    <div className="grid md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-1.5">Valor Total (R$) *</label>
                            <input
                                type="number"
                                step="0.01"
                                required
                                value={formData.value}
                                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                                className="w-full px-4 py-2.5 border border-stone-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-1.5">Detalhes (Opcional)</label>
                            <input
                                placeholder="Ex: Marca X, 50kg"
                                value={formData.details}
                                onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                                className="w-full px-4 py-2.5 border border-stone-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-3 border-t border-stone-100 mt-6">
                        <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                        <Button type="submit" isLoading={loading}>Salvar Gasto</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default ExpensesView;
