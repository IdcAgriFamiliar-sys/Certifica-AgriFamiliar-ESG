import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react';
import Button from '../Button';
import { uploadFile } from '../../services/storage';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useAuth } from '../../contexts/AuthContext';

const PendingDocumentsView: React.FC = () => {
    const { user } = useAuth();
    const [files, setFiles] = useState<{
        rg: File | null;
        caf: File | null;
    }>({ rg: null, caf: null });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleFileChange = (type: 'rg' | 'caf', file: File) => {
        setFiles(prev => ({ ...prev, [type]: file }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!files.rg || !files.caf) {
            alert("Por favor, selecione ambos os documentos.");
            return;
        }

        setLoading(true);
        try {
            // Upload files
            const rgUrl = await uploadFile(files.rg, `documents/${user?.uid}/rg`);
            const cafUrl = await uploadFile(files.caf, `documents/${user?.uid}/caf`);

            // Update user/farmer record in Firestore
            if (user?.uid) {
                await setDoc(doc(db, "farmer_documents", user.uid), {
                    userId: user.uid,
                    rgUrl,
                    cafUrl,
                    status: "Enviado",
                    updatedAt: new Date().toISOString(),
                    farmerName: user.displayName || "Unknown",
                    farmerEmail: user.email
                });
            }

            setSuccess(true);
        } catch (error) {
            console.error("Error uploading documents:", error);
            alert("Erro ao enviar documentos. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center animate-fade-in-up">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-stone-800 mb-2">Documentos Enviados!</h3>
                <p className="text-stone-500 max-w-md mb-8">
                    Recebemos seus documentos com sucesso. Nossa equipe irá analisá-los e atualizar o status da sua certificação em breve.
                </p>
                <Button onClick={() => window.location.reload()}>Voltar ao Painel</Button>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in-up max-w-4xl mx-auto">
            <div>
                <h3 className="text-2xl font-bold text-stone-800">Envio de Documentação</h3>
                <p className="text-stone-500">Para regularizar seu cadastro, precisamos que envie os documentos abaixo.</p>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex gap-4">
                <div className="bg-amber-100 p-3 rounded-xl h-fit">
                    <AlertTriangle className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                    <h4 className="font-bold text-amber-900 text-lg mb-1">Atenção Necessária</h4>
                    <p className="text-amber-800/80 leading-relaxed">
                        Sua certificação está pausada aguardando estes documentos. O envio é obrigatório para a emissão do selo ESG.
                        Certifique-se que as fotos estejam legíveis.
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-8">
                {/* RG/CPF Upload */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 flex flex-col">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="bg-blue-50 p-2.5 rounded-lg text-blue-600">
                            <FileText size={24} />
                        </div>
                        <h4 className="font-bold text-stone-800 text-lg">RG ou CNH</h4>
                    </div>
                    <p className="text-sm text-stone-500 mb-6">Documento de identificação oficial com foto (frente e verso).</p>

                    <div className="mt-auto">
                        <label className="block w-full border-2 border-dashed border-stone-200 rounded-xl p-8 text-center hover:border-green-500 hover:bg-green-50/50 transition-all cursor-pointer group">
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*,.pdf"
                                onChange={(e) => e.target.files && handleFileChange('rg', e.target.files[0])}
                            />
                            <div className="flex flex-col items-center gap-3">
                                {files.rg ? (
                                    <>
                                        <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                                            <CheckCircle size={24} />
                                        </div>
                                        <span className="font-medium text-green-700 truncate max-w-full px-4">{files.rg.name}</span>
                                        <span className="text-xs text-green-600 font-bold">Clique para alterar</span>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-12 h-12 bg-stone-100 text-stone-400 group-hover:text-green-600 group-hover:bg-green-100 rounded-full flex items-center justify-center transition-colors">
                                            <Upload size={24} />
                                        </div>
                                        <span className="font-medium text-stone-600 group-hover:text-green-700">Clique para selecionar</span>
                                        <span className="text-xs text-stone-400">PDF, JPG ou PNG</span>
                                    </>
                                )}
                            </div>
                        </label>
                    </div>
                </div>

                {/* CAF Upload */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 flex flex-col">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="bg-green-50 p-2.5 rounded-lg text-green-600">
                            <FileText size={24} />
                        </div>
                        <h4 className="font-bold text-stone-800 text-lg">CAF Ativo</h4>
                    </div>
                    <p className="text-sm text-stone-500 mb-6">Cadastro Nacional da Agricultura Familiar válido.</p>

                    <div className="mt-auto">
                        <label className="block w-full border-2 border-dashed border-stone-200 rounded-xl p-8 text-center hover:border-green-500 hover:bg-green-50/50 transition-all cursor-pointer group">
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*,.pdf"
                                onChange={(e) => e.target.files && handleFileChange('caf', e.target.files[0])}
                            />
                            <div className="flex flex-col items-center gap-3">
                                {files.caf ? (
                                    <>
                                        <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                                            <CheckCircle size={24} />
                                        </div>
                                        <span className="font-medium text-green-700 truncate max-w-full px-4">{files.caf.name}</span>
                                        <span className="text-xs text-green-600 font-bold">Clique para alterar</span>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-12 h-12 bg-stone-100 text-stone-400 group-hover:text-green-600 group-hover:bg-green-100 rounded-full flex items-center justify-center transition-colors">
                                            <Upload size={24} />
                                        </div>
                                        <span className="font-medium text-stone-600 group-hover:text-green-700">Clique para selecionar</span>
                                        <span className="text-xs text-stone-400">PDF, JPG ou PNG</span>
                                    </>
                                )}
                            </div>
                        </label>
                    </div>
                </div>

                <div className="md:col-span-2 pt-4 flex justify-end">
                    <Button
                        type="submit"
                        isLoading={loading}
                        size="lg"
                        className="w-full md:w-auto"
                        rightIcon={<ArrowRight size={20} />}
                    >
                        Enviar Documentação
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default PendingDocumentsView;
