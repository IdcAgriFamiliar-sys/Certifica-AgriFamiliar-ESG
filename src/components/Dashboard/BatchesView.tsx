import React, { useState, useEffect } from 'react';
import { Package, Truck, Factory, Plus, Search, Trash2, Download, UserPlus } from 'lucide-react';
import { Batch } from '../../types';
import Modal from '../Modal';
import { db } from '../../services/firebase';
import { collection, onSnapshot, addDoc, query, orderBy, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';

const getStatusColor = (status: string) => {
    switch (status) {
        case 'Pronto Venda': return 'bg-green-100 text-green-800';
        case 'Em Processamento': return 'bg-yellow-100 text-yellow-800';
        case 'Em Campo': return 'bg-blue-100 text-blue-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

const getStatusIcon = (status: string) => {
    switch (status) {
        case 'Pronto Venda': return <Truck size={16} />;
        case 'Em Processamento': return <Factory size={16} />;
        case 'Em Campo': return <Package size={16} />;
        default: return null;
    }
};

const BatchesView: React.FC = () => {
    const [batches, setBatches] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form State
    const [newBatchProduct, setNewBatchProduct] = useState("");
    const [newBatchFarmer, setNewBatchFarmer] = useState("");
    const [newBatchStatus, setNewBatchStatus] = useState("Em Campo");

    useEffect(() => {
        const q = query(collection(db, "batches"), orderBy("dataColheita", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setBatches(data);
        });
        return () => unsubscribe();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, "batches"), {
                produto: newBatchProduct,
                agricultor: newBatchFarmer,
                statusRastreio: newBatchStatus,
                dataColheita: Date.now(),
                certificacaoID: "PENDENTE",
                createdAt: serverTimestamp()
            });
            setIsModalOpen(false);
            setNewBatchProduct("");
            setNewBatchFarmer("");
            setNewBatchStatus("Em Campo");
        } catch (error) {
            console.error("Error creating batch:", error);
            alert("Erro ao criar lote.");
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Tem certeza que deseja excluir este lote?")) {
            try {
                await deleteDoc(doc(db, "batches", id));
            } catch (error) {
                console.error("Error deleting batch:", error);
                alert("Erro ao excluir lote.");
            }
        }
    };

    const handleExport = () => {
        const headers = ["ID", "Produto", "Agricultor", "Data Colheita", "Status"];
        const rows = batches.map(b => [
            b.id,
            b.produto,
            b.agricultor,
            new Date(b.dataColheita).toLocaleDateString('pt-BR'),
            b.statusRastreio
        ]);

        const csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "lotes_export.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold flex items-center gap-3"><Package size={28} className="text-orange-600" /> Rastreabilidade de Lotes</h3>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input className="pl-10 pr-3 py-2 border rounded-xl w-72 focus:ring-2 focus:ring-orange-500 outline-none" placeholder="Buscar por lote, produto ou agricultor..." />
                    </div>
                    <button
                        onClick={handleExport}
                        className="flex items-center gap-2 px-3 py-2 border border-stone-200 rounded-xl text-stone-600 hover:bg-stone-50 transition-colors font-medium bg-white"
                    >
                        <Download size={16} />
                        Exportar
                    </button>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 px-3 py-2 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors shadow-lg shadow-orange-200"
                    >
                        <Plus size={16} /> Novo Lote
                    </button>
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Lote / Produto</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Agricultor</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Data Colheita</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Status</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Certificação</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {batches.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-8 text-center text-stone-500">
                                    Nenhum lote registrado.
                                </td>
                            </tr>
                        )}
                        {batches.map(b => (
                            <tr key={b.id} className="hover:bg-gray-50 transition-colors group">
                                <td className="px-4 py-3">
                                    <div className="font-medium text-stone-800">{b.id}</div>
                                    <div className="text-xs text-stone-500">{b.produto}</div>
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-700">{b.agricultor}</td>
                                <td className="px-4 py-3 text-sm text-gray-500">{new Date(b.dataColheita).toLocaleDateString('pt-BR')}</td>
                                <td className="px-4 py-3">
                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold ${getStatusColor(b.statusRastreio)}`}>
                                        {getStatusIcon(b.statusRastreio)} <span className="ml-2">{b.statusRastreio}</span>
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-sm text-blue-600 font-medium">{b.certificacaoID || '-'}</td>
                                <td className="px-4 py-3 text-right">
                                    <button
                                        onClick={() => handleDelete(b.id)}
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

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Novo Lote">
                <form onSubmit={handleSave} className="space-y-6">
                    <div className="bg-stone-50 p-4 rounded-xl border border-stone-100 mb-6">
                        <p className="text-sm text-stone-500 mb-4">Dados do lote e rastreamento inicial.</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="col-span-2">
                                <label className="block text-sm font-bold text-stone-700 mb-2 flex items-center gap-2">
                                    <Package size={16} className="text-orange-600" /> Produto
                                </label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all font-medium text-stone-800 placeholder:text-stone-400"
                                    placeholder="Ex: Café Arábica"
                                    value={newBatchProduct}
                                    onChange={(e) => setNewBatchProduct(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="col-span-2 md:col-span-1">
                                <label className="block text-sm font-bold text-stone-700 mb-2 flex items-center gap-2">
                                    <UserPlus size={16} className="text-orange-600" /> Agricultor
                                </label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all font-medium text-stone-800 placeholder:text-stone-400"
                                    placeholder="Nome do Agricultor"
                                    value={newBatchFarmer}
                                    onChange={(e) => setNewBatchFarmer(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="col-span-2 md:col-span-1">
                                <label className="block text-sm font-bold text-stone-700 mb-2 flex items-center gap-2">
                                    <Truck size={16} className="text-orange-600" /> Status Inicial
                                </label>
                                <div className="relative">
                                    <select
                                        className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all font-medium text-stone-800 appearance-none cursor-pointer"
                                        value={newBatchStatus}
                                        onChange={(e) => setNewBatchStatus(e.target.value)}
                                    >
                                        <option value="Em Campo">Em Campo</option>
                                        <option value="Em Processamento">Em Processamento</option>
                                        <option value="Pronto Venda">Pronto Venda</option>
                                    </select>
                                </div>
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
                            className="px-8 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 hover:shadow-lg hover:shadow-orange-700/20 active:scale-95 transition-all font-bold text-sm flex items-center gap-2"
                        >
                            <Plus size={18} />
                            Criar Lote
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default BatchesView;
