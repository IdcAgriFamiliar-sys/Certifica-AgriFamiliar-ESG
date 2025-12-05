import React, { useState, useEffect } from "react";
import { Sprout, Plus, Calendar, FileDown } from "lucide-react";
import Button from "../Button";
import Modal from "../Modal";
import { collection, addDoc, query, where, getDocs, orderBy, serverTimestamp } from "firebase/firestore";
import { db } from "../../services/firebase";
import { useAuth } from "../../contexts/AuthContext";
import { generateReport } from "../../utils/reportGenerator";

const ProductionView: React.FC = () => {
    const { user } = useAuth();
    const [production, setProduction] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        activity: "Plantio", // Plantio, Colheita, Manejo
        culture: "",
        area: "", // em hectares ou m2
        quantity: "", // se colheita
        notes: ""
    });

    const fetchProduction = async () => {
        if (!user) return;
        const q = query(
            collection(db, "production"),
            where("userId", "==", user.uid),
            orderBy("date", "desc")
        );
        const snapshot = await getDocs(q);
        setProduction(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    };

    useEffect(() => {
        fetchProduction();
    }, [user]);

    const handleDownloadReport = () => {
        const data = production.map(p => ({
            date: new Date(p.date).toLocaleDateString('pt-BR'),
            activity: p.activity,
            culture: p.culture,
            details: `${p.area || '-'} / ${p.quantity || '-'}`
        }));
        generateReport("Relatório de Produção", data, ["Data", "Atividade", "Cultura", "Área/Qtd"]);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        if (!formData.culture.trim()) {
            alert("Por favor, informe a cultura.");
            return;
        }

        setLoading(true);
        try {
            await addDoc(collection(db, "production"), {
                ...formData,
                userId: user.uid,
                createdAt: serverTimestamp(),
            });
            setIsModalOpen(false);
            fetchProduction();
            setFormData({
                date: new Date().toISOString().split('T')[0],
                activity: "Plantio",
                culture: "",
                area: "",
                quantity: "",
                notes: ""
            });
            alert("Atividade registrada com sucesso!");
        } catch (error) {
            console.error("Error adding production log:", error);
            alert("Erro ao registrar atividade. Tente novamente.");
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
                    <Button
                        variant="outline"
                        onClick={handleDownloadReport}
                        leftIcon={<FileDown className="w-5 h-5" />}
                        disabled={production.length === 0}
                    >
                        Baixar Relatório
                    </Button>
                    <Button onClick={() => setIsModalOpen(true)} leftIcon={<Plus className="w-5 h-5" />}>
                        Nova Atividade
                    </Button>
                </div>
            </div>

            {/* Production Timeline/Table */}
            <div className="space-y-4">
                {production.length === 0 ? (
                    <div className="text-center py-12 bg-stone-50 rounded-2xl border border-stone-100 text-stone-500 border-dashed">
                        <Sprout className="w-12 h-12 mx-auto mb-3 text-stone-300" />
                        <p>Nenhuma atividade registrada no caderno de campo.</p>
                    </div>
                ) : (
                    production.map((item) => (
                        <div key={item.id} className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 flex flex-col md:flex-row gap-4 hover:shadow-md transition-shadow">
                            <div className="flex items-start gap-4 flex-1">
                                <div className={`p-3 rounded-xl shrink-0 ${item.activity === 'Plantio' ? 'bg-green-100 text-green-600' :
                                    item.activity === 'Colheita' ? 'bg-amber-100 text-amber-600' :
                                        'bg-blue-100 text-blue-600'
                                    }`}>
                                    <Sprout className="w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex flex-wrap justify-between items-start gap-2 mb-1">
                                        <h4 className="font-bold text-stone-900 text-lg">{item.activity} - {item.culture}</h4>
                                        <span className="text-xs font-medium px-2.5 py-1 bg-stone-100 text-stone-600 rounded-lg flex items-center gap-1">
                                            <Calendar size={12} />
                                            {new Date(item.date).toLocaleDateString('pt-BR')}
                                        </span>
                                    </div>
                                    <p className="text-stone-600 mb-3">
                                        {item.notes || "Sem observações."}
                                    </p>
                                    <div className="flex flex-wrap gap-4 text-sm text-stone-500 bg-stone-50 p-3 rounded-xl border border-stone-100">
                                        {item.area && <span><strong>Área:</strong> {item.area}</span>}
                                        {item.quantity && <span><strong>Quantidade:</strong> {item.quantity}</span>}
                                        {!item.area && !item.quantity && <span className="italic">Sem detalhes adicionais.</span>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Registrar Atividade">
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
                            <label className="block text-sm font-medium text-stone-700 mb-1.5">Atividade *</label>
                            <select
                                value={formData.activity}
                                onChange={(e) => setFormData({ ...formData, activity: e.target.value })}
                                className="w-full px-4 py-2.5 border border-stone-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none bg-white transition-all"
                            >
                                <option value="Plantio">Plantio</option>
                                <option value="Manejo">Manejo / Tratos Culturais</option>
                                <option value="Colheita">Colheita</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1.5">Cultura (O que foi plantado/colhido?) *</label>
                        <input
                            placeholder="Ex: Milho, Feijão, Alface"
                            required
                            value={formData.culture}
                            onChange={(e) => setFormData({ ...formData, culture: e.target.value })}
                            className="w-full px-4 py-2.5 border border-stone-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all"
                        />
                    </div>

                    <div className="grid md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-1.5">Área (ha ou m²)</label>
                            <input
                                placeholder="Ex: 2 ha"
                                value={formData.area}
                                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                                className="w-full px-4 py-2.5 border border-stone-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-1.5">Quantidade (se colheita)</label>
                            <input
                                placeholder="Ex: 50 sacas"
                                value={formData.quantity}
                                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                className="w-full px-4 py-2.5 border border-stone-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1.5">Observações</label>
                        <textarea
                            placeholder="Detalhes sobre adubação, clima, problemas encontrados, etc."
                            rows={3}
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            className="w-full px-4 py-2.5 border border-stone-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all"
                        />
                    </div>

                    <div className="pt-4 flex justify-end gap-3 border-t border-stone-100 mt-6">
                        <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                        <Button type="submit" isLoading={loading}>Salvar Registro</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default ProductionView;
