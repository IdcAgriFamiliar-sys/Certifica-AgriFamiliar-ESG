import React, { useState, useEffect } from "react";
import { Plus, Package, TrendingUp, FileDown } from "lucide-react";
import Button from "../Button";
import Modal from "../Modal";
import { collection, addDoc, query, where, getDocs, orderBy, serverTimestamp } from "firebase/firestore";
import { db } from "../../services/firebase";
import { useAuth } from "../../contexts/AuthContext";
import { generateReport } from "../../utils/reportGenerator";

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

    const fetchSales = async () => {
        if (!user) return;
        const q = query(
            collection(db, "sales"),
            where("userId", "==", user.uid),
            orderBy("date", "desc")
        );
        const snapshot = await getDocs(q);
        setSales(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    };

    useEffect(() => {
        fetchSales();
    }, [user]);

    const handleDownloadReport = () => {
        const data = sales.map(s => ({
            date: new Date(s.date).toLocaleDateString('pt-BR'),
            product: s.product,
            quantity: `${s.quantity} ${s.unit}`,
            buyer: s.buyer || '-',
            value: `R$ ${parseFloat(s.value).toFixed(2)}`
        }));
        generateReport("Relatório de Vendas", data, ["Data", "Produto", "Qtd", "Comprador", "Valor"]);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        if (!formData.product.trim() || !formData.quantity || !formData.value) {
            alert("Preencha todos os campos obrigatórios.");
            return;
        }

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
            fetchSales();
            setFormData({
                date: new Date().toISOString().split('T')[0],
                product: "",
                quantity: "",
                unit: "kg",
                value: "",
                buyer: ""
            });
            alert("Venda registrada com sucesso!");
        } catch (error) {
            console.error("Error adding sale:", error);
            alert("Erro ao registrar venda. Verifique os dados e tente novamente.");
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
                    <Button
                        variant="outline"
                        onClick={handleDownloadReport}
                        leftIcon={<FileDown className="w-5 h-5" />}
                        disabled={sales.length === 0}
                    >
                        Baixar Relatório
                    </Button>
                    <Button onClick={() => setIsModalOpen(true)} leftIcon={<Plus className="w-5 h-5" />}>
                        Nova Venda
                    </Button>
                </div>
            </div>

            {/* Summary Cards */}
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

            {/* Sales Table */}
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
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                            {sales.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-stone-500">
                                        <Package className="w-12 h-12 mx-auto mb-3 text-stone-300" />
                                        Nenhuma venda registrada ainda.
                                    </td>
                                </tr>
                            ) : (
                                sales.map((sale) => (
                                    <tr key={sale.id} className="hover:bg-stone-50 transition-colors">
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
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Registrar Venda">
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
                            <label className="block text-sm font-medium text-stone-700 mb-1.5">Produto *</label>
                            <input
                                placeholder="Ex: Milho Verde"
                                required
                                value={formData.product}
                                onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                                className="w-full px-4 py-2.5 border border-stone-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-1.5">Quantidade *</label>
                            <div className="flex gap-2">
                                <input
                                    type="number"
                                    step="0.01"
                                    required
                                    value={formData.quantity}
                                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-stone-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all"
                                />
                                <select
                                    value={formData.unit}
                                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                                    className="w-24 px-2 py-2.5 border border-stone-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none bg-white transition-all"
                                >
                                    <option value="kg">Kg</option>
                                    <option value="sc">Saca</option>
                                    <option value="cx">Caixa</option>
                                    <option value="un">Un</option>
                                    <option value="ton">Ton</option>
                                </select>
                            </div>
                        </div>
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
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1.5">Comprador (Opcional)</label>
                        <input
                            placeholder="Ex: Cooperativa XYZ"
                            value={formData.buyer}
                            onChange={(e) => setFormData({ ...formData, buyer: e.target.value })}
                            className="w-full px-4 py-2.5 border border-stone-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all"
                        />
                    </div>

                    <div className="pt-4 flex justify-end gap-3 border-t border-stone-100 mt-6">
                        <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                        <Button type="submit" isLoading={loading}>Salvar Venda</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default SalesView;
