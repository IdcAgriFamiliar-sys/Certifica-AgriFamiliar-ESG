import React, { useState, useEffect } from "react";
import { Plus, Package, TrendingUp, Download, Trash2, DollarSign } from "lucide-react";
import Button from "../Button";
import Modal from "../Modal";
import { collection, addDoc, query, where, orderBy, serverTimestamp, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { db } from "../../services/firebase";
import { useAuth } from "../../contexts/AuthContext";

const SalesView: React.FC = () => {
    const { user } = useAuth();
    const [sales, setSales] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        product: "",
        quantity: "",
        unit: "kg",
        value: "",
        buyer: ""
    });

    useEffect(() => {
        if (!user) return;
        // REMOVED orderBy
        const q = query(
            collection(db, "sales"),
            where("userId", "==", user.uid)
        );
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
            data.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
            setSales(data);
        });
        return () => unsubscribe();
    }, [user]);

    const handleExport = () => {
        const headers = ["Data", "Produto", "Quantidade", "Comprador", "Valor"];
        const rows = sales.map(s => [
            new Date(s.date).toLocaleDateString('pt-BR'),
            s.product,
            `${s.quantity} ${s.unit}`,
            s.buyer || '-',
            `R$ ${parseFloat(s.value).toFixed(2)}`
        ]);

        const csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "vendas_export.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Tem certeza que deseja excluir esta venda?")) {
            try {
                await deleteDoc(doc(db, "sales", id));
            } catch (error) {
                console.error("Error deleting sale:", error);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        if (!formData.product || !formData.value) { alert("Preencha produto e valor."); return; }

        setLoading(true);
        try {
            await addDoc(collection(db, "sales"), {
                ...formData,
                userId: user.uid,
                createdAt: serverTimestamp(),
                value: parseFloat(formData.value) || 0,
                quantity: parseFloat(formData.quantity) || 0
            });
            setIsModalOpen(false);
            setFormData({ date: new Date().toISOString().split('T')[0], product: "", quantity: "", unit: "kg", value: "", buyer: "" });
        } catch (error) {
            console.error("Error:", error);
            alert("Erro ao salvar: " + (error as any).message);
        } finally {
            setLoading(false);
        }
    };

    const totalSales = sales.reduce((acc, curr) => acc + (parseFloat(curr.value) || 0), 0);

    return (
        <div className="space-y-8 animate-fade-in-up">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h3 className="text-2xl font-bold text-stone-800">Minhas Vendas</h3>
                    <p className="text-stone-500">Registre suas vendas diárias ou semanais.</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2.5 border border-stone-200 rounded-xl text-stone-600 hover:bg-stone-50 transition-colors font-medium bg-white">
                        <Download size={18} /> Exportar
                    </button>
                    <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors shadow-lg shadow-green-200 font-medium">
                        <Plus size={18} /> Nova Venda
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 bg-green-100 rounded-xl text-green-600">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                        <span className="text-stone-500 font-medium">Total Vendido</span>
                    </div>
                    <h4 className="text-3xl font-bold text-stone-900">
                        R$ {totalSales.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </h4>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-stone-100">
                        <thead className="bg-stone-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-stone-500 uppercase tracking-wider">Data</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-stone-500 uppercase tracking-wider">Produto</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-stone-500 uppercase tracking-wider">Quantidade</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-stone-500 uppercase tracking-wider">Comprador</th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-stone-500 uppercase tracking-wider">Valor (R$)</th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-stone-500 uppercase tracking-wider">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                            {sales.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-stone-500">
                                        <Package className="w-12 h-12 mx-auto mb-3 text-stone-300" />
                                        Nenhuma venda registrada ainda.
                                    </td>
                                </tr>
                            ) : (
                                sales.map((sale) => (
                                    <tr key={sale.id} className="hover:bg-stone-50 transition-colors group">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-600">
                                            {new Date(sale.date).toLocaleDateString('pt-BR')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap font-medium text-stone-800">
                                            {sale.product}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-600">
                                            {sale.quantity} {sale.unit}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-600">
                                            {sale.buyer || "-"}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600 text-right">
                                            R$ {parseFloat(sale.value).toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <button
                                                onClick={() => handleDelete(sale.id)}
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

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Registrar Venda">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Form Content ... Same as before */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-1.5">Data</label>
                            <input type="date" required value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="w-full px-4 py-2.5 border border-stone-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-1.5 flex items-center gap-2"><Package size={16} className="text-green-600" /> Produto</label>
                            <input placeholder="Ex: Milho Verde" required value={formData.product} onChange={(e) => setFormData({ ...formData, product: e.target.value })} className="w-full px-4 py-2.5 border border-stone-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-1.5">Quantidade</label>
                            <div className="flex gap-2">
                                <input type="number" step="0.01" required value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: e.target.value })} className="w-full px-4 py-2.5 border border-stone-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none" />
                                <select value={formData.unit} onChange={(e) => setFormData({ ...formData, unit: e.target.value })} className="w-24 px-2 py-2.5 border border-stone-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none bg-white">
                                    <option value="kg">Kg</option>
                                    <option value="sc">Saca</option>
                                    <option value="un">Un</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-1.5 flex items-center gap-2"><DollarSign size={16} className="text-green-600" /> Valor Total (R$)</label>
                            <input type="number" step="0.01" required value={formData.value} onChange={(e) => setFormData({ ...formData, value: e.target.value })} className="w-full px-4 py-2.5 border border-stone-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none" />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-stone-700 mb-1.5">Comprador (Opcional)</label>
                            <input placeholder="Ex: Cooperativa" value={formData.buyer} onChange={(e) => setFormData({ ...formData, buyer: e.target.value })} className="w-full px-4 py-2.5 border border-stone-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none" />
                        </div>
                    </div>
                    <div className="pt-6 flex justify-end gap-3 border-t border-stone-100">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-stone-600 hover:bg-stone-50 rounded-xl transition-colors font-medium">Cancelar</button>
                        <button type="submit" className="px-6 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors shadow-lg shadow-green-200 font-medium flex items-center gap-2">
                            <Plus size={18} /> Salvar Venda
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default SalesView;
