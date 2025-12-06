import React, { useState, useEffect } from "react";
import { Sprout, Plus, Calendar, FileDown, Trash2, Download } from "lucide-react";
import Button from "../Button";
import Modal from "../Modal";
import { collection, addDoc, query, where, getDocs, orderBy, serverTimestamp, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { db } from "../../services/firebase";
import { useAuth } from "../../contexts/AuthContext";

const ProductionView: React.FC = () => {
    const { user } = useAuth();
    const [production, setProduction] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        activity: "Plantio",
        culture: "",
        area: "",
        quantity: "",
        notes: ""
    });

    useEffect(() => {
        if (!user) return;
        // REMOVED orderBy to avoid "Missing Index" error
        const q = query(
            collection(db, "production"),
            where("userId", "==", user.uid)
        );
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
            // Client-side sorting
            data.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
            setProduction(data);
        });
        return () => unsubscribe();
    }, [user]);

    const handleExport = () => {
        const headers = ["Data", "Atividade", "Cultura", "Área", "Quantidade", "Observações"];
        const rows = production.map(p => [
            new Date(p.date).toLocaleDateString('pt-BR'),
            p.activity,
            p.culture,
            p.area || '-',
            p.quantity || '-',
            p.notes || '-'
        ]);

        const csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "producao_export.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Tem certeza que deseja excluir este registro?")) {
            try {
                await deleteDoc(doc(db, "production", id));
            } catch (error) {
                console.error("Error deleting production:", error);
                alert("Erro ao excluir registro.");
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        if (!formData.culture.trim()) { alert("Informe a cultura."); return; }

        setLoading(true);
        try {
            await addDoc(collection(db, "production"), {
                ...formData,
                userId: user.uid,
                createdAt: serverTimestamp(),
            });
            setIsModalOpen(false);
            setFormData({ date: new Date().toISOString().split('T')[0], activity: "Plantio", culture: "", area: "", quantity: "", notes: "" });
        } catch (error) {
            console.error("Error:", error);
            alert("Erro ao salvar: " + (error as any).message); // added error message to alert
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-fade-in-up">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h3 className="text-2xl font-bold text-stone-800">Caderno de Campo</h3>
                    <p className="text-stone-500">Registre atividades de plantio, manejo e colheita.</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2.5 border border-stone-200 rounded-xl text-stone-600 hover:bg-stone-50 transition-colors font-medium bg-white">
                        <Download size={18} /> Exportar
                    </button>
                    <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors shadow-lg shadow-green-200 font-medium">
                        <Plus size={18} /> Nova Atividade
                    </button>
                </div>
            </div>

            <div className="space-y-4">
                {production.length === 0 ? (
                    <div className="text-center py-12 bg-stone-50 rounded-2xl border border-stone-100 text-stone-500 border-dashed">
                        <Sprout className="w-12 h-12 mx-auto mb-3 text-stone-300" />
                        <p>Nenhuma atividade registrada no caderno de campo.</p>
                    </div>
                ) : (
                    production.map((item) => (
                        <div key={item.id} className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 flex flex-col md:flex-row gap-4 hover:shadow-md transition-shadow group relative">
                            <button
                                onClick={() => handleDelete(item.id)}
                                className="absolute top-4 right-4 p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                title="Excluir"
                            >
                                <Trash2 size={18} />
                            </button>
                            <div className="flex items-start gap-4 flex-1">
                                <div className={`p-3 rounded-xl shrink-0 ${item.activity === 'Plantio' ? 'bg-green-100 text-green-600' : item.activity === 'Colheita' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>
                                    <Sprout className="w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex flex-wrap justify-between items-start gap-2 mb-1">
                                        <h4 className="font-bold text-stone-900 text-lg">{item.activity} - {item.culture}</h4>
                                        <span className="text-xs font-medium px-2.5 py-1 bg-stone-100 text-stone-600 rounded-lg flex items-center gap-1">
                                            <Calendar size={12} /> {new Date(item.date).toLocaleDateString('pt-BR')}
                                        </span>
                                    </div>
                                    <p className="text-stone-600 mb-3">{item.notes || "Sem observações."}</p>
                                    <div className="flex flex-wrap gap-4 text-sm text-stone-500 bg-stone-50 p-3 rounded-xl border border-stone-100">
                                        {item.area && <span><strong>Área:</strong> {item.area}</span>}
                                        {item.quantity && <span><strong>Quantidade:</strong> {item.quantity}</span>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Registrar Atividade">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-1.5">Data *</label>
                            <input type="date" required value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="w-full px-4 py-2.5 border border-stone-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-1.5">Atividade *</label>
                            <select value={formData.activity} onChange={(e) => setFormData({ ...formData, activity: e.target.value })} className="w-full px-4 py-2.5 border border-stone-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none bg-white">
                                <option value="Plantio">Plantio</option>
                                <option value="Manejo">Manejo</option>
                                <option value="Colheita">Colheita</option>
                            </select>
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-stone-700 mb-1.5">Cultura *</label>
                            <input placeholder="Ex: Milho, Feijão" required value={formData.culture} onChange={(e) => setFormData({ ...formData, culture: e.target.value })} className="w-full px-4 py-2.5 border border-stone-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-1.5">Área (ha/m²)</label>
                            <input placeholder="Ex: 2 ha" value={formData.area} onChange={(e) => setFormData({ ...formData, area: e.target.value })} className="w-full px-4 py-2.5 border border-stone-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-1.5">Quantidade</label>
                            <input placeholder="Ex: 50 sacas" value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: e.target.value })} className="w-full px-4 py-2.5 border border-stone-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none" />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-stone-700 mb-1.5">Observações</label>
                            <textarea placeholder="Detalhes..." rows={3} value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} className="w-full px-4 py-2.5 border border-stone-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none" />
                        </div>
                    </div>
                    <div className="pt-6 flex justify-end gap-3 border-t border-stone-100">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-stone-600 hover:bg-stone-50 rounded-xl transition-colors font-medium">Cancelar</button>
                        <button type="submit" className="px-6 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors shadow-lg shadow-green-200 font-medium flex items-center gap-2">
                            <Plus size={18} /> Salvar Registro
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default ProductionView;
