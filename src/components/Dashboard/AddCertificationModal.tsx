import React, { useState } from 'react';
import { FileCheck, Plus, Calendar, User, Award, CheckCircle, Filter } from 'lucide-react';
import Modal from '../Modal';
import { db } from '../../services/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface AddCertificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

const AddCertificationModal: React.FC<AddCertificationModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const [name, setName] = useState("");
    const [farmer, setFarmer] = useState("");
    const [level, setLevel] = useState("Bronze");
    const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
    const [status, setStatus] = useState("Ativo");
    const [loading, setLoading] = useState(false);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await addDoc(collection(db, "certifications"), {
                nome: name,
                agricultor: farmer,
                nivel: level,
                auditor: "Admin Sistema",
                status: status,
                validade: new Date(issueDate).getTime() + 86400000 * 365, // 1 year validity
                createdAt: serverTimestamp()
            });

            // Reset form
            setName("");
            setFarmer("");
            setStatus("Ativo");
            setLevel("Bronze");
            setIssueDate(new Date().toISOString().split('T')[0]);

            if (onSuccess) onSuccess();
            onClose();
        } catch (error) {
            console.error("Error creating certification:", error);
            alert("Erro ao criar certificação.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Nova Certificação">
            <form onSubmit={handleSave} className="flex flex-col h-full">
                <div className="p-1">
                    <div className="mb-6 p-4 bg-green-50/50 rounded-xl border border-green-100">
                        <p className="text-stone-600 text-sm flex gap-2">
                            <div className="min-w-1 min-h-full w-1 bg-green-500 rounded-full"></div>
                            Preencha os dados abaixo para emitir uma nova certificação de conformidade ESG.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Nome da Certificação */}
                        <div className="col-span-2 group">
                            <label className="block text-xs font-bold text-stone-500 uppercase tracking-wide mb-2 ml-1 group-focus-within:text-green-600 transition-colors">
                                Nome da Certificação
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Award className="h-5 w-5 text-stone-400 group-focus-within:text-green-500 transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    className="block w-full pl-12 pr-4 py-3.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 outline-none transition-all text-stone-800 placeholder:text-stone-400 font-medium sm:text-sm"
                                    placeholder="Ex: Sustentabilidade Ouro 2024"
                                    required
                                />
                            </div>
                        </div>

                        {/* Agricultor */}
                        <div className="col-span-2 md:col-span-1 group">
                            <label className="block text-xs font-bold text-stone-500 uppercase tracking-wide mb-2 ml-1 group-focus-within:text-green-600 transition-colors">
                                Agricultor Responsável
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-stone-400 group-focus-within:text-green-500 transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    value={farmer}
                                    onChange={e => setFarmer(e.target.value)}
                                    className="block w-full pl-12 pr-4 py-3.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 outline-none transition-all text-stone-800 placeholder:text-stone-400 font-medium sm:text-sm"
                                    placeholder="Nome do Agricultor"
                                    required
                                />
                            </div>
                        </div>

                        {/* Data de Emissão */}
                        <div className="col-span-2 md:col-span-1 group">
                            <label className="block text-xs font-bold text-stone-500 uppercase tracking-wide mb-2 ml-1 group-focus-within:text-green-600 transition-colors">
                                Data de Emissão
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Calendar className="h-5 w-5 text-stone-400 group-focus-within:text-green-500 transition-colors" />
                                </div>
                                <input
                                    type="date"
                                    value={issueDate}
                                    onChange={e => setIssueDate(e.target.value)}
                                    className="block w-full pl-12 pr-4 py-3.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 outline-none transition-all text-stone-800 font-medium sm:text-sm appearance-none"
                                    required
                                />
                            </div>
                        </div>

                        {/* Nível da Certificação */}
                        <div className="col-span-2 md:col-span-1 group">
                            <label className="block text-xs font-bold text-stone-500 uppercase tracking-wide mb-2 ml-1 group-focus-within:text-green-600 transition-colors">
                                Nível
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <CheckCircle className="h-5 w-5 text-stone-400 group-focus-within:text-green-500 transition-colors" />
                                </div>
                                <select
                                    value={level}
                                    onChange={e => setLevel(e.target.value)}
                                    className="block w-full pl-12 pr-10 py-3.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 outline-none transition-all text-stone-800 appearance-none cursor-pointer font-medium sm:text-sm"
                                >
                                    <option value="Bronze">Bronze</option>
                                    <option value="Prata">Prata</option>
                                    <option value="Ouro">Ouro</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-stone-500">
                                    <Filter className="h-4 w-4" />
                                </div>
                            </div>
                        </div>

                        {/* Status Atual */}
                        <div className="col-span-2 md:col-span-1 group">
                            <label className="block text-xs font-bold text-stone-500 uppercase tracking-wide mb-2 ml-1 group-focus-within:text-green-600 transition-colors">
                                Status
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <FileCheck className="h-5 w-5 text-stone-400 group-focus-within:text-green-500 transition-colors" />
                                </div>
                                <select
                                    value={status}
                                    onChange={e => setStatus(e.target.value)}
                                    className="block w-full pl-12 pr-10 py-3.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 outline-none transition-all text-stone-800 appearance-none cursor-pointer font-medium sm:text-sm"
                                >
                                    <option value="Ativo">Ativo</option>
                                    <option value="Pendente">Pendente</option>
                                    <option value="Vencido">Vencido</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-stone-500">
                                    <Filter className="h-4 w-4" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-stone-100 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-3 text-stone-600 hover:bg-stone-50 hover:text-stone-800 bg-white border border-stone-200 rounded-xl transition-all font-semibold text-sm shadow-sm"
                        disabled={loading}
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 hover:shadow-lg hover:shadow-green-200 active:scale-95 transition-all font-semibold text-sm flex items-center gap-2 shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <Plus size={18} />
                        )}
                        Criar Certificação
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default AddCertificationModal;
