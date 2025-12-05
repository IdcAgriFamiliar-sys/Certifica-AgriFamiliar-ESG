import React, { useState, useEffect } from 'react';
import { FileCheck, Plus, Search, Filter, MoreVertical, Download, FileText } from 'lucide-react';
// import { Certification } from '../../types';
import Modal from '../Modal';
import { db } from '../../services/firebase';
import { collection, onSnapshot, addDoc, query, orderBy, doc, getDoc } from 'firebase/firestore';
import { jsPDF } from "jspdf";

const getStatusColor = (status: string) => {
    switch (status) {
        case 'Ativo': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
        case 'Pendente': return 'bg-amber-100 text-amber-800 border-amber-200';
        case 'Vencido': return 'bg-red-100 text-red-800 border-red-200';
        default: return 'bg-stone-100 text-stone-800 border-stone-200';
    }
};

const getNivelBadge = (nivel: string) => {
    switch (nivel) {
        case 'Ouro': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case 'Prata': return 'bg-stone-100 text-stone-600 border-stone-200';
        case 'Bronze': return 'bg-orange-100 text-orange-800 border-orange-200';
        default: return 'bg-stone-50 text-stone-600 border-stone-200';
    }
};

const CertificationsView: React.FC = () => {
    const [filter, setFilter] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [certifications, setCertifications] = useState<any[]>([]);
    const [appConfig, setAppConfig] = useState<any>(null);

    // Form State
    const [newCertName, setNewCertName] = useState("");
    const [newCertFarmer, setNewCertFarmer] = useState("");
    const [newCertLevel, setNewCertLevel] = useState("Bronze");

    useEffect(() => {
        const q = query(collection(db, "certifications"), orderBy("validade", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setCertifications(data);
        });

        // Fetch App Config for Logos
        const fetchConfig = async () => {
            const docRef = doc(db, "settings", "appConfig");
            const snap = await getDoc(docRef);
            if (snap.exists()) {
                setAppConfig(snap.data());
            }
        };
        fetchConfig();

        return () => unsubscribe();
    }, []);

    const filtered = certifications.filter(c =>
        c.nome.toLowerCase().includes(filter.toLowerCase()) ||
        c.agricultor.toLowerCase().includes(filter.toLowerCase())
    );

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, "certifications"), {
                nome: newCertName,
                agricultor: newCertFarmer,
                nivel: newCertLevel,
                auditor: "Sistema", // Default or select auditor
                status: "Ativo",
                validade: Date.now() + 86400000 * 365, // 1 year
                createdAt: Date.now()
            });
            setIsModalOpen(false);
            setNewCertName("");
            setNewCertFarmer("");
            alert("Certificação criada com sucesso!");
        } catch (error) {
            console.error("Error creating certification:", error);
            alert("Erro ao criar certificação.");
        }
    };

    const generateCertificatePDF = (cert: any) => {
        const doc = new jsPDF({
            orientation: "landscape",
            unit: "mm",
            format: "a4"
        });

        // Background / Border
        doc.setLineWidth(2);
        doc.setDrawColor(21, 128, 61); // Green-700
        doc.rect(10, 10, 277, 190);

        doc.setLineWidth(0.5);
        doc.setDrawColor(22, 163, 74); // Green-600
        doc.rect(15, 15, 267, 180);

        // Logos
        if (appConfig?.logos?.idc) {
            try {
                doc.addImage(appConfig.logos.idc, "PNG", 25, 25, 40, 40, undefined, 'FAST');
            } catch (e) { console.error("Error adding IDC logo", e); }
        }

        if (appConfig?.logos?.seal) {
            try {
                doc.addImage(appConfig.logos.seal, "PNG", 230, 25, 40, 40, undefined, 'FAST');
            } catch (e) { console.error("Error adding Seal logo", e); }
        }

        // Title
        doc.setFont("helvetica", "bold");
        doc.setFontSize(32);
        doc.setTextColor(28, 25, 23); // Stone-900
        doc.text("CERTIFICADO", 148.5, 50, { align: "center" });

        doc.setFontSize(16);
        doc.setTextColor(22, 163, 74); // Green-600
        doc.text("DE CONFORMIDADE ESG", 148.5, 60, { align: "center" });

        // Body Text
        doc.setFont("times", "normal");
        doc.setFontSize(14);
        doc.setTextColor(60, 60, 60);

        const textY = 90;
        doc.text("Certificamos que a propriedade agrícola", 148.5, textY, { align: "center" });

        doc.setFont("times", "bold");
        doc.setFontSize(24);
        doc.text(cert.agricultor || "Nome do Agricultor", 148.5, textY + 15, { align: "center" });

        doc.setFont("times", "normal");
        doc.setFontSize(14);
        doc.text("cumpriu rigorosamente todos os requisitos e padrões de sustentabilidade,", 148.5, textY + 30, { align: "center" });
        doc.text("responsabilidade social e governança estabelecidos pelo Instituto.", 148.5, textY + 40, { align: "center" });

        // Level Badge
        doc.setFillColor(250, 204, 21); // Yellow-400 (Goldish)
        if (cert.nivel === 'Prata') doc.setFillColor(168, 162, 158); // Stone-400
        if (cert.nivel === 'Bronze') doc.setFillColor(217, 119, 6); // Amber-600

        doc.setDrawColor(0);
        // doc.circle(148.5, textY + 65, 15, 'F'); // Simple badge circle

        doc.setFont("helvetica", "bold");
        doc.setFontSize(18);
        doc.setTextColor(0, 0, 0);
        doc.text(`NÍVEL ${cert.nivel.toUpperCase()}`, 148.5, textY + 60, { align: "center" });

        // Date and Validity
        doc.setFont("times", "italic");
        doc.setFontSize(12);
        doc.text(`Emitido em: ${new Date(cert.createdAt || Date.now()).toLocaleDateString('pt-BR')}`, 148.5, textY + 80, { align: "center" });
        doc.text(`Válido até: ${new Date(cert.validade).toLocaleDateString('pt-BR')}`, 148.5, textY + 88, { align: "center" });

        // Signatures
        const sigY = 170;
        doc.setLineWidth(0.5);
        doc.setDrawColor(0);

        doc.line(60, sigY, 120, sigY);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.text("Diretor de Certificação", 90, sigY + 5, { align: "center" });

        doc.line(177, sigY, 237, sigY);
        doc.text("Auditor Responsável", 207, sigY + 5, { align: "center" });

        // Footer
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(`ID do Certificado: ${cert.id}`, 148.5, 195, { align: "center" });

        doc.save(`certificado_${cert.id}.pdf`);
    };

    return (
        <div className="space-y-8 animate-fade-in-up">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h3 className="text-2xl font-bold text-stone-800">Gestão de Certificações</h3>
                    <p className="text-stone-500">Gerencie e monitore as certificações emitidas.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors shadow-lg shadow-green-200 font-medium"
                >
                    <Plus size={18} />
                    Nova Certificação
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-green-50 rounded-xl">
                            <FileCheck className="w-6 h-6 text-green-600" />
                        </div>
                        <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">+12%</span>
                    </div>
                    <div className="text-3xl font-bold text-stone-800 mb-1">{certifications.filter(c => c.status === 'Ativo').length}</div>
                    <div className="text-sm text-stone-500 font-medium">Certificações Ativas</div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-amber-50 rounded-xl">
                            <FileCheck className="w-6 h-6 text-amber-600" />
                        </div>
                        <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-lg">Atenção</span>
                    </div>
                    <div className="text-3xl font-bold text-stone-800 mb-1">{certifications.filter(c => c.status === 'Pendente').length}</div>
                    <div className="text-sm text-stone-500 font-medium">Pendentes de Revisão</div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-red-50 rounded-xl">
                            <FileCheck className="w-6 h-6 text-red-600" />
                        </div>
                        <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-lg">Ação Necessária</span>
                    </div>
                    <div className="text-3xl font-bold text-stone-800 mb-1">{certifications.filter(c => c.status === 'Vencido').length}</div>
                    <div className="text-sm text-stone-500 font-medium">Certificações Vencidas</div>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
                <div className="p-6 border-b border-stone-100 flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full md:w-96">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                        <input
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-sm"
                            placeholder="Buscar por certificação ou agricultor..."
                        />
                    </div>
                    <div className="flex gap-3 w-full md:w-auto">
                        <button className="flex items-center gap-2 px-4 py-2.5 border border-stone-200 rounded-xl text-stone-600 hover:bg-stone-50 transition-colors text-sm font-medium">
                            <Filter size={16} />
                            Filtrar
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2.5 border border-stone-200 rounded-xl text-stone-600 hover:bg-stone-50 transition-colors text-sm font-medium">
                            <Download size={16} />
                            Exportar
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-stone-100">
                        <thead className="bg-stone-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-stone-500 uppercase tracking-wider">Certificação</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-stone-500 uppercase tracking-wider">Nível</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-stone-500 uppercase tracking-wider">Agricultor / Auditor</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-stone-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-stone-500 uppercase tracking-wider">Validade</th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-stone-500 uppercase tracking-wider">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-stone-100">
                            {certifications.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-stone-500">
                                        Nenhuma certificação encontrada.
                                    </td>
                                </tr>
                            )}
                            {filtered.map(c => (
                                <tr key={c.id} className="hover:bg-stone-50/50 transition-colors group">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-stone-100 rounded-lg group-hover:bg-white transition-colors border border-stone-100">
                                                <FileCheck className="w-5 h-5 text-stone-500" />
                                            </div>
                                            <div>
                                                <div className="font-semibold text-stone-800">{c.nome}</div>
                                                <div className="text-xs text-stone-500 font-mono">{c.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${getNivelBadge(c.nivel)}`}>
                                            {c.nivel}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-stone-800">{c.agricultor}</div>
                                        <div className="text-xs text-stone-500">Auditor: {c.auditor}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusColor(c.status)}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${c.status === 'Ativo' ? 'bg-emerald-500' : c.status === 'Pendente' ? 'bg-amber-500' : 'bg-red-500'}`}></span>
                                            {c.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-600">
                                        {new Date(c.validade).toLocaleDateString('pt-BR')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => generateCertificatePDF(c)}
                                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                title="Baixar Certificado"
                                            >
                                                <FileText size={18} />
                                            </button>
                                            <div className="relative group/menu">
                                                <button className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-lg transition-colors">
                                                    <MoreVertical size={18} />
                                                </button>
                                                <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-lg border border-stone-100 py-1 hidden group-hover/menu:block z-10">
                                                    <button
                                                        onClick={() => {
                                                            if (window.confirm('Tem certeza que deseja excluir esta certificação?')) {
                                                                // In a real app, delete from Firestore
                                                                alert('Funcionalidade de exclusão simulada.');
                                                            }
                                                        }}
                                                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                                    >
                                                        Excluir Certificação
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-4 border-t border-stone-100 bg-stone-50 flex justify-between items-center text-sm text-stone-500">
                    <span>Mostrando {filtered.length} de {certifications.length} resultados</span>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 border border-stone-200 rounded-lg bg-white disabled:opacity-50" disabled>Anterior</button>
                        <button className="px-3 py-1 border border-stone-200 rounded-lg bg-white hover:bg-stone-50">Próximo</button>
                    </div>
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nova Certificação">
                <form onSubmit={handleSave} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1">Nome da Certificação</label>
                        <input
                            type="text"
                            value={newCertName}
                            onChange={e => setNewCertName(e.target.value)}
                            className="w-full px-4 py-2 border border-stone-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                            placeholder="Ex: Sustentabilidade Ouro"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1">Agricultor</label>
                        <input
                            type="text"
                            value={newCertFarmer}
                            onChange={e => setNewCertFarmer(e.target.value)}
                            className="w-full px-4 py-2 border border-stone-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                            placeholder="Nome do Agricultor"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1">Nível</label>
                        <select
                            value={newCertLevel}
                            onChange={e => setNewCertLevel(e.target.value)}
                            className="w-full px-4 py-2 border border-stone-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                        >
                            <option value="Bronze">Bronze</option>
                            <option value="Prata">Prata</option>
                            <option value="Ouro">Ouro</option>
                        </select>
                    </div>
                    <div className="pt-4 flex justify-end gap-3">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-xl transition-colors">Cancelar</button>
                        <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors shadow-lg shadow-green-200">Criar Certificação</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default CertificationsView;
