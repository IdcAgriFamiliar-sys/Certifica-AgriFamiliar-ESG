// src/components/FarmerRegistrationForm.tsx

import React, { useState } from 'react';
import { UserPlus, FileText, XCircle } from 'lucide-react';
import CustomModal from './CustomModal'; // Importação do modal
import FileUploadZone from './FileUploadZone'; // Importação do uploader

// TIPOS NECESSÁRIOS (Você precisará garantir que todos os tipos (interface) 
// como FarmerRegistration, UploadedDocument, e generateId estejam acessíveis. 
// Para simplificar agora, vamos colocá-los temporariamente aqui.)

interface UploadedDocument {
  id: string;
  name: string;
  type: string;
  uploadedAt: number;
  uploadedBy: string;
}

interface FarmerRegistration {
  id: string;
  nome: string;
  cpf: string;
  cnpjMEI?: string;
  endereco: string;
  dapCaf: string;
  nomePropriedade: string;
  tamanhoHectares: number;
  whatsapp: string;
  email: string;
  documents: UploadedDocument[];
  status: 'Pendente' | 'Aprovado' | 'Rejeitado';
  createdAt: number;
}

const generateId = (): string => {
  return 'id-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
};


// ============================================================================
// FORMULÁRIO DE CADASTRO DE AGRICULTOR
// ============================================================================
const FarmerRegistrationForm: React.FC<{
  onClose: () => void;
  onSubmit: (data: FarmerRegistration) => void;
}> = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    cnpjMEI: '',
    endereco: '',
    dapCaf: '',
    nomePropriedade: '',
    tamanhoHectares: '',
    whatsapp: '',
    email: ''
  });
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', message: '', type: 'error' as const });

  const handleFilesSelected = (files: File[]) => {
    const newDocs: UploadedDocument[] = files.map(file => ({
      id: generateId(),
      name: file.name,
      type: file.type,
      uploadedAt: Date.now(),
      uploadedBy: 'farmer'
    }));
    setDocuments([...documents, ...newDocs]);
  };

  const handleSubmit = () => {
    // 1. Validação com CustomModal
    if (!formData.nome || !formData.cpf || !formData.email) {
      setModalContent({
        title: 'Campos Obrigatórios',
        message: 'Por favor, preencha todos os campos obrigatórios (Nome Completo, CPF e E-mail) antes de enviar o cadastro.',
        type: 'error'
      });
      setIsModalOpen(true);
      return;
    }

    const registration: FarmerRegistration = {
      id: generateId(),
      nome: formData.nome,
      cpf: formData.cpf,
      cnpjMEI: formData.cnpjMEI,
      endereco: formData.endereco,
      dapCaf: formData.dapCaf,
      nomePropriedade: formData.nomePropriedade,
      tamanhoHectares: parseFloat(formData.tamanhoHectares) || 0,
      whatsapp: formData.whatsapp,
      email: formData.email,
      documents,
      status: 'Pendente',
      createdAt: Date.now()
    };

    onSubmit(registration);
    onClose(); 
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full my-8">
        {/* CABEÇALHO DO FORMULÁRIO */}
        <div className="bg-gradient-to-r from-green-600 to-indigo-600 text-white p-6 rounded-t-lg">
          <h2 className="flex items-center gap-3 text-2xl font-bold">
            <UserPlus size={32} />
            Cadastro de Agricultor(a)
          </h2>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto">
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {/* Campos do formulário... (código omitido por brevidade, use o código que estava no seu App.tsx) */}
            
            {/* ...Nome, CPF, CNPJ, Endereço, etc. ... */}
            
            <div>
              <label className="block text-gray-700 mb-2 font-medium">Nome Completo *</label>
              <input type="text" value={formData.nome} onChange={(e) => setFormData({ ...formData, nome: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-green-500 focus:outline-none transition" />
            </div>
             <div>
              <label className="block text-gray-700 mb-2 font-medium">CPF *</label>
              <input type="text" value={formData.cpf} onChange={(e) => setFormData({ ...formData, cpf: e.target.value })} placeholder="000.000.000-00" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-green-500 focus:outline-none transition" />
            </div>
             <div>
              <label className="block text-gray-700 mb-2 font-medium">CNPJ MEI (se tiver)</label>
              <input type="text" value={formData.cnpjMEI} onChange={(e) => setFormData({ ...formData, cnpjMEI: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-green-500 focus:outline-none transition" />
            </div>
             <div>
              <label className="block text-gray-700 mb-2 font-medium">DAP ou CAF</label>
              <input type="text" value={formData.dapCaf} onChange={(e) => setFormData({ ...formData, dapCaf: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-green-500 focus:outline-none transition" />
            </div>
             <div className="md:col-span-2">
              <label className="block text-gray-700 mb-2 font-medium">Endereço Completo</label>
              <input type="text" value={formData.endereco} onChange={(e) => setFormData({ ...formData, endereco: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-green-500 focus:outline-none transition" />
            </div>
             <div>
              <label className="block text-gray-700 mb-2 font-medium">Nome da Propriedade</label>
              <input type="text" value={formData.nomePropriedade} onChange={(e) => setFormData({ ...formData, nomePropriedade: e.target.value })} placeholder="Ex: Sítio Esperança" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-green-500 focus:outline-none transition" />
            </div>
             <div>
              <label className="block text-gray-700 mb-2 font-medium">Tamanho da Propriedade (hectares)</label>
              <input type="number" step="0.01" value={formData.tamanhoHectares} onChange={(e) => setFormData({ ...formData, tamanhoHectares: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-green-500 focus:outline-none transition" />
            </div>
             <div>
              <label className="block text-gray-700 mb-2 font-medium">WhatsApp *</label>
              <input type="tel" value={formData.whatsapp} onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })} placeholder="(00) 00000-0000" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-green-500 focus:outline-none transition" />
            </div>
             <div>
              <label className="block text-gray-700 mb-2 font-medium">E-mail *</label>
              <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-green-500 focus:outline-none transition" />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-3 font-medium">Documentos (CPF, RG, CAF/DAP)</label>
            {/* USO DO COMPONENTE DE UPLOAD */}
            <FileUploadZone onFilesSelected={handleFilesSelected} /> 
            {documents.length > 0 && (
              <div className="mt-3 space-y-2">
                {documents.map(doc => (
                  <div key={doc.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <span className="text-sm text-gray-700 flex items-center gap-2"><FileText size={16} />{doc.name}</span>
                    <button
                      onClick={() => setDocuments(documents.filter(d => d.id !== doc.id))}
                      className="text-red-600 hover:text-red-800 transition"
                    >
                      <XCircle size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* BOTÕES DE AÇÃO */}
        <div className="bg-gray-50 px-6 py-4 flex gap-3 justify-end rounded-b-lg">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors shadow-sm"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md"
          >
            Enviar Cadastro
          </button>
        </div>
      </div>
      
      {/* USO DO COMPONENTE MODAL */}
      <CustomModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalContent.title}
        message={modalContent.message}
        type={modalContent.type}
      />
    </div>
  );
};

export default FarmerRegistrationForm;
