import React, { useState, useEffect } from "react";
import { TrendingDown, Plus, Tag, FileDown, Trash2, Download } from "lucide-react";
import Button from "../Button";
import Modal from "../Modal";
import { collection, addDoc, query, where, orderBy, serverTimestamp, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { db } from "../../services/firebase";
import { useAuth } from "../../contexts/AuthContext";

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
        details: ""
    });

    useEffect(() => {
        if (!user) return;
        // REMOVED orderBy
        const q = query(
            collection(db, "expenses"),
            where("userId", "==", user.uid)
        );
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
            data.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
            setExpenses(data);
        });
        return () => unsubscribe();
    }, [user]);

    const handleExport = () => {
        const headers = ["Data", "Tipo", "Descrição", "Detalhes", "Valor"];
        const rows = expenses.map(e => [
            new Date(e.date).toLocaleDateString('pt-BR'),
            e.type,
            e.description,
            e.details || '-',
            `R$ ${parseFloat(e.value).toFixed(2)}`
        ]);

        const csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "gastos_export.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Tem certeza que deseja excluir este gasto?")) {
            try {
                await deleteDoc(doc(db, "expenses", id));
            } catch (error) {
                console.error("Error deleting expense:", error);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        if (!formData.description || !formData.value) { alert("Preencha descrição e valor."); return; }

        setLoading(true);
        try {
            await addDoc(collection(db, "expenses"), {
                ...formData,
                userId: user.uid,
                createdAt: serverTimestamp(),
                value: parseFloat(formData.value) || 0
            });
            setIsModalOpen(false);
            setFormData({ date: new Date().toISOString().split('T')[0], type: "Insumos", description: "", value: "", details: "" });
        } catch (error) {
            console.error("Error:", error);
            alert("Erro ao salvar: " + (error as any).message);
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
                    <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2.5 border border-stone-200 rounded-xl text-stone-600 hover:bg-stone-50 transition-colors font-medium bg-white">
                        <Download size={18} /> Exportar
                    </button>
                    <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-200 font-medium">
                        <Plus size={18} /> Novo Gasto
                    </button>
                </div>
            </div>

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
                                <th className="px-6 py-4 text-right text-xs font-bold text-stone-500 uppercase tracking-wider">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                            {expenses.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-stone-500">
                                        <Tag className="w-12 h-12 mx-auto mb-3 text-stone-300" />
                                        Nenhum gasto registrado ainda.
                                    </td>
                                </tr>
                            ) : (
                                expenses.map((expense) => (
                                    <tr key={expense.id} className="hover:bg-stone-50 transition-colors group">
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
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <button
                                                onClick={() => handleDelete(expense.id)}
                                                className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                                title="Excluir"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Registrar Gasto">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Form ... */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-1.5">Data</label>
                            <input type="date" required value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="w-full px-4 py-2.5 border border-stone-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-1.5">Tipo</label>
                            <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="w-full px-4 py-2.5 border border-stone-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none bg-white">
                                <option value="Insumos">Insumos</option>
                                <option value="Mão de Obra">Mão de Obra</option>
                                <option value="Maquinário">Maquinário</option>
                                <option value="Manutenção">Manutenção</option>
                                <option value="Outros">Outros</option>
                            </select>
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-stone-700 mb-1.5 flex items-center gap-2"><Tag size={16} className="text-red-600" /> Descrição</label>
                            <input placeholder="Ex: Adubo Orgânico" required value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-2.5 border border-stone-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-1.5">Valor (R$)</label>
                            <input type="number" step="0.01" required value={formData.value} onChange={(e) => setFormData({ ...formData, value: e.target.value })} className="w-full px-4 py-2.5 border border-stone-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-1.5">Detalhes</label>
                            <input placeholder="Ex: 50kg, Marca X" value={formData.details} onChange={(e) => setFormData({ ...formData, details: e.target.value })} className="w-full px-4 py-2.5 border border-stone-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none" />
                        </div>
                    </div>
                    <div className="pt-6 flex justify-end gap-3 border-t border-stone-100">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-stone-600 hover:bg-stone-50 rounded-xl transition-colors font-medium">Cancelar</button>
                        <button type="submit" className="px-6 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-200 font-medium flex items-center gap-2">
                            <Plus size={18} /> Salvar Gasto
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default ExpensesView;
