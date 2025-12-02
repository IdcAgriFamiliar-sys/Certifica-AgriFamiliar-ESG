import React, { useState, useEffect } from 'react';
import { 
  Leaf, 
  FileCheck, 
  Users, 
  Shield, 
  Award, 
  TrendingUp, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle,
  Eye,
  Edit,
  Trash2,
  Send,
  ChevronRight,
  Search,
  Home,
  UserPlus,
  Upload,
  Download,
  Settings,
  DollarSign,
  ShoppingCart,
  Package,
  BarChart3,
  FileText,
  Plus,
  Calendar,
  TrendingDown
} from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================
interface DiagnosticAnswers {
  q1_waste: boolean;
  q2_energy: boolean;
  q3_safety: boolean;
  q4_remuneration: boolean;
  q5_community: boolean;
  q6_conduct: boolean;
  q7_traceability: boolean;
}

interface Certification {
  id: string;
  name: string;
  ownerId: string;
  submittedBy: string;
  status: 'Rascunho' | 'Pendente Auditoria' | 'Pendente Coordenador' | 'Pendente Certificado' | 'Aprovado' | 'Rejeitado';
  esg_score: number;
  batchId?: string;
  answers: DiagnosticAnswers;
  validation_logs: string[];
  certificate_url?: string;
  certificate_qr_code?: string;
  createdAt: number;
  documents?: UploadedDocument[];
}

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

interface AuditorCredential {
  id: string;
  nome: string;
  cpf: string;
  numeroConselho: string;
  tipoConselho: string;
  endereco: string;
  habilitacao: 'A' | 'B' | 'Ambas';
  whatsapp: string;
  email: string;
  documents: UploadedDocument[];
  status: 'Pendente' | 'Aprovado' | 'Rejeitado';
  createdAt: number;
  accessGranted: boolean;
}

interface Sale {
  id: string;
  farmerId: string;
  tipo: 'Porta a Porta' | 'Unidade de Produção' | 'Mercado' | 'Outro';
  produto: string;
  quantidade: number;
  unidade: string;
  valor: number;
  data: string;
  createdAt: number;
}

interface Expense {
  id: string;
  farmerId: string;
  categoria: 'Adubo' | 'Mão de Obra' | 'Transporte' | 'Combustível' | 'Materiais' | 'Equipamentos' | 'Outro';
  descricao: string;
  valor: number;
  data: string;
  createdAt: number;
}

interface ProductBatch {
  id: string;
  farmerId: string;
  produto: string;
  dataPlantio: string;
  tecnicasAgricolas: string[];
  quantidadePlantada: number;
  unidade: string;
  dataColheita?: string;
  quantidadeColhida?: number;
  status: 'Plantado' | 'Em Crescimento' | 'Colhido';
  createdAt: number;
}

type UserRole = 'Agricultor' | 'Auditor' | 'Coordenador' | 'Admin';
type ViewAs = UserRole | null;

// ============================================================================
// CUSTOM MODAL COMPONENT
// ============================================================================
const CustomModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title: string;
  message: string;
  type?: 'info' | 'warning' | 'error' | 'success' | 'confirm';
}> = ({ isOpen, onClose, onConfirm, title, message, type = 'info' }) => {
  if (!isOpen) return null;

  const typeColors = {
    info: 'bg-blue-50 border-blue-200',
    warning: 'bg-yellow-50 border-yellow-200',
    error: 'bg-red-50 border-red-200',
    success: 'bg-green-50 border-green-200',
    confirm: 'bg-indigo-50 border-indigo-200'
  };

  const typeIcons = {
    info: <AlertCircle className="text-blue-600" size={24} />,
    warning: <AlertCircle className="text-yellow-600" size={24} />,
    error: <XCircle className="text-red-600" size={24} />,
    success: <CheckCircle className="text-green-600" size={24} />,
    confirm: <AlertCircle className="text-indigo-600" size={24} />
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`bg-white rounded-lg shadow-xl max-w-md w-full border-2 ${typeColors[type]}`}>
        <div className="p-6">
          <div className="flex items-start gap-4">
            {typeIcons[type]}
            <div className="flex-1">
              <h3 className="mb-2">{title}</h3>
              <p className="text-gray-700">{message}</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-6 py-4 flex gap-3 justify-end rounded-b-lg">
          {onConfirm ? (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Confirmar
              </button>
            </>
          ) : (
            <button
              onClick={onClose}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Fechar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// FILE UPLOAD COMPONENT
// ============================================================================
const FileUploadZone: React.FC<{
  onFilesSelected: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
}> = ({ onFilesSelected, accept = ".pdf,.png,.jpg,.jpeg", multiple = true }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onFilesSelected(Array.from(e.target.files));
    }
  };

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-500 transition-colors">
      <Upload className="mx-auto mb-3 text-gray-400" size={40} />
      <p className="text-gray-600 mb-2">Arraste arquivos ou clique para selecionar</p>
      <p className="text-gray-500 text-sm mb-3">PDF, PNG ou JPG (máx. 10MB)</p>
      <input
        type="file"
        onChange={handleFileChange}
        accept={accept}
        multiple={multiple}
        className="hidden"
        id="file-upload"
      />
      <label
        htmlFor="file-upload"
        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer inline-block"
      >
        Selecionar Arquivos
      </label>
    </div>
  );
};

// ============================================================================
// DIAGNOSTIC QUESTIONS
// ============================================================================
const diagnosticQuestions = [
  { key: 'q1_waste', category: 'Ambiental (E)', question: 'Implementa Gestão de Resíduos e Reciclagem?' },
  { key: 'q2_energy', category: 'Ambiental (E)', question: 'Utiliza fontes de Energias Renováveis (e.g., solar, biomassa)?' },
  { key: 'q3_safety', category: 'Social (S)', question: 'Oferece Treinamento de Segurança do Trabalho regular?' },
  { key: 'q4_remuneration', category: 'Social (S)', question: 'A Remuneração está acima do salário mínimo regional?' },
  { key: 'q5_community', category: 'Social (S)', question: 'Possui programas de Apoio Comunitário Local?' },
  { key: 'q6_conduct', category: 'Governança (G)', question: 'Existe um Código de Conduta Formalizado e comunicado?' },
  { key: 'q7_traceability', category: 'Governança (G)', question: 'Mantém Rastreabilidade completa de Insumos e Produtos?' }
];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
const calculateScore = (answers: DiagnosticAnswers): number => {
  const yesCount = Object.values(answers).filter(v => v === true).length;
  return Math.round((yesCount / 7) * 100 * 100) / 100;
};

const generateBatchId = (): string => {
  return 'LOTE-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
};

const formatTimestamp = (): string => {
  return new Date().toLocaleString('pt-BR');
};

const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    'Rascunho': 'bg-gray-100 text-gray-800',
    'Pendente Auditoria': 'bg-yellow-100 text-yellow-800',
    'Pendente Coordenador': 'bg-blue-100 text-blue-800',
    'Pendente Certificado': 'bg-purple-100 text-purple-800',
    'Aprovado': 'bg-green-100 text-green-800',
    'Rejeitado': 'bg-red-100 text-red-800',
    'Pendente': 'bg-yellow-100 text-yellow-800'
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

const getStatusIcon = (status: string) => {
  const icons: Record<string, JSX.Element> = {
    'Rascunho': <Edit size={16} />,
    'Pendente Auditoria': <Clock size={16} />,
    'Pendente Coordenador': <Clock size={16} />,
    'Pendente Certificado': <Clock size={16} />,
    'Aprovado': <CheckCircle size={16} />,
    'Rejeitado': <XCircle size={16} />,
    'Pendente': <Clock size={16} />
  };
  return icons[status] || <Clock size={16} />;
};

const generateId = (): string => {
  return 'id-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
};

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

// ============================================================================
// FARMER REGISTRATION FORM
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
    if (!formData.nome || !formData.cpf || !formData.email) {
      alert('Preencha os campos obrigatórios!');
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
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full my-8">
        <div className="bg-gradient-to-r from-green-600 to-indigo-600 text-white p-6 rounded-t-lg">
          <h2 className="flex items-center gap-3">
            <UserPlus size={32} />
            Cadastro de Agricultor(a)
          </h2>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto">
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-gray-700 mb-2">Nome Completo *</label>
              <input
                type="text"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">CPF *</label>
              <input
                type="text"
                value={formData.cpf}
                onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                placeholder="000.000.000-00"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">CNPJ MEI (se tiver)</label>
              <input
                type="text"
                value={formData.cnpjMEI}
                onChange={(e) => setFormData({ ...formData, cnpjMEI: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">DAP ou CAF</label>
              <input
                type="text"
                value={formData.dapCaf}
                onChange={(e) => setFormData({ ...formData, dapCaf: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-gray-700 mb-2">Endereço Completo</label>
              <input
                type="text"
                value={formData.endereco}
                onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Nome da Propriedade</label>
              <input
                type="text"
                value={formData.nomePropriedade}
                onChange={(e) => setFormData({ ...formData, nomePropriedade: e.target.value })}
                placeholder="Ex: Sítio Esperança"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Tamanho da Propriedade (hectares)</label>
              <input
                type="number"
                step="0.01"
                value={formData.tamanhoHectares}
                onChange={(e) => setFormData({ ...formData, tamanhoHectares: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">WhatsApp *</label>
              <input
                type="tel"
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                placeholder="(00) 00000-0000"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">E-mail *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-3">Documentos (CPF, RG, CAF/DAP)</label>
            <FileUploadZone onFilesSelected={handleFilesSelected} />
            {documents.length > 0 && (
              <div className="mt-3 space-y-2">
                {documents.map(doc => (
                  <div key={doc.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <span className="text-sm text-gray-700">{doc.name}</span>
                    <button
                      onClick={() => setDocuments(documents.filter(d => d.id !== doc.id))}
                      className="text-red-600 hover:text-red-800"
                    >
                      <XCircle size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 flex gap-3 justify-end rounded-b-lg">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Enviar Cadastro
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// AUDITOR CREDENTIAL FORM
// ============================================================================
const AuditorCredentialForm: React.FC<{
  onClose: () => void;
  onSubmit: (data: AuditorCredential) => void;
}> = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    numeroConselho: '',
    tipoConselho: '',
    endereco: '',
    habilitacao: 'A' as 'A' | 'B' | 'Ambas',
    whatsapp: '',
    email: ''
  });
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);

  const handleFilesSelected = (files: File[]) => {
    const newDocs: UploadedDocument[] = files.map(file => ({
      id: generateId(),
      name: file.name,
      type: file.type,
      uploadedAt: Date.now(),
      uploadedBy: 'auditor'
    }));
    setDocuments([...documents, ...newDocs]);
  };

  const handleSubmit = () => {
    if (!formData.nome || !formData.cpf || !formData.email) {
      alert('Preencha os campos obrigatórios!');
      return;
    }

    const credential: AuditorCredential = {
      id: generateId(),
      nome: formData.nome,
      cpf: formData.cpf,
      numeroConselho: formData.numeroConselho,
      tipoConselho: formData.tipoConselho,
      endereco: formData.endereco,
      habilitacao: formData.habilitacao,
      whatsapp: formData.whatsapp,
      email: formData.email,
      documents,
      status: 'Pendente',
      createdAt: Date.now(),
      accessGranted: false
    };

    onSubmit(credential);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full my-8">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-lg">
          <h2 className="flex items-center gap-3">
            <Shield size={32} />
            Credenciamento de Auditor(a)
          </h2>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto">
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-gray-700 mb-2">Nome Completo *</label>
              <input
                type="text"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">CPF *</label>
              <input
                type="text"
                value={formData.cpf}
                onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                placeholder="000.000.000-00"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Tipo de Conselho de Classe</label>
              <input
                type="text"
                value={formData.tipoConselho}
                onChange={(e) => setFormData({ ...formData, tipoConselho: e.target.value })}
                placeholder="Ex: CREA, CRA, etc."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Número do Conselho</label>
              <input
                type="text"
                value={formData.numeroConselho}
                onChange={(e) => setFormData({ ...formData, numeroConselho: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-gray-700 mb-2">Endereço Completo</label>
              <input
                type="text"
                value={formData.endereco}
                onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Habilitação</label>
              <select
                value={formData.habilitacao}
                onChange={(e) => setFormData({ ...formData, habilitacao: e.target.value as 'A' | 'B' | 'Ambas' })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              >
                <option value="A">Tipo A</option>
                <option value="B">Tipo B</option>
                <option value="Ambas">Ambas (A e B)</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 mb-2">WhatsApp *</label>
              <input
                type="tel"
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                placeholder="(00) 00000-0000"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">E-mail *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-3">Documentos (Carteira do Conselho, Currículo, Diplomas)</label>
            <FileUploadZone onFilesSelected={handleFilesSelected} />
            {documents.length > 0 && (
              <div className="mt-3 space-y-2">
                {documents.map(doc => (
                  <div key={doc.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <span className="text-sm text-gray-700">{doc.name}</span>
                    <button
                      onClick={() => setDocuments(documents.filter(d => d.id !== doc.id))}
                      className="text-red-600 hover:text-red-800"
                    >
                      <XCircle size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 flex gap-3 justify-end rounded-b-lg">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Enviar Credenciamento
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// LANDING PAGE VIEW
// ============================================================================
const LandingPageView: React.FC<{
  onAccessPanel: () => void;
  onVerifyCertificate: (id: string) => void;
  onFarmerRegistration: () => void;
  onAuditorCredential: () => void;
}> = ({ onAccessPanel, onVerifyCertificate, onFarmerRegistration, onAuditorCredential }) => {
  const [searchId, setSearchId] = useState('');

  const handleSearch = () => {
    if (searchId.trim()) {
      onVerifyCertificate(searchId.trim());
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Leaf className="text-green-600" size={48} />
            <h1 className="text-green-700">
              Certifica AgriFamiliar ESG
            </h1>
          </div>
          <p className="text-gray-600 max-w-3xl mx-auto mb-8">
            Rastreabilidade e Transparência na Cadeia de Valor Familiar
          </p>
          <p className="text-gray-700 max-w-4xl mx-auto leading-relaxed">
            O <strong>Certifica AgriFamiliar ESG</strong> é uma plataforma inovadora que promove a 
            certificação ESG (Ambiental, Social e Governança) para Empreendimentos de Agricultor Familiar. 
            Nossa missão é valorizar a agricultura familiar sustentável, garantindo transparência total, 
            rastreabilidade completa e acesso a mercados diferenciados que reconhecem práticas responsáveis.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-lg shadow-xl p-8 border-t-4 border-green-500">
            <TrendingUp className="text-green-600 mb-4" size={40} />
            <h3 className="mb-3 text-gray-800">Acesso a Mercados</h3>
            <p className="text-gray-600">
              Certificação reconhecida que abre portas para mercados nacionais e internacionais 
              que valorizam práticas sustentáveis e socialmente responsáveis.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-xl p-8 border-t-4 border-indigo-500">
            <Award className="text-indigo-600 mb-4" size={40} />
            <h3 className="mb-3 text-gray-800">Valorização Sustentável</h3>
            <p className="text-gray-600">
              Reconhecimento formal das boas práticas ESG implementadas na Unidade de Produção, 
              agregando valor à marca e aos produtos da agricultura familiar.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-xl p-8 border-t-4 border-blue-500">
            <Shield className="text-blue-600 mb-4" size={40} />
            <h3 className="mb-3 text-gray-800">Transparência Total</h3>
            <p className="text-gray-600">
              Sistema completo de rastreabilidade com logs detalhados de todas as etapas, 
              desde o diagnóstico inicial até a emissão do certificado final.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-xl p-6">
            <h2 className="mb-4 text-gray-800 flex items-center gap-2">
              <UserPlus className="text-green-600" size={28} />
              Cadastro de Agricultor(a)
            </h2>
            <p className="text-gray-600 mb-6">
              Faça seu cadastro como Agricultor Familiar e tenha acesso completo à plataforma 
              para gestão da sua Unidade de Produção, vendas, gastos e certificações ESG.
            </p>
            <button
              onClick={onFarmerRegistration}
              className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
            >
              <UserPlus size={20} />
              Cadastrar como Agricultor(a)
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-xl p-6">
            <h2 className="mb-4 text-gray-800 flex items-center gap-2">
              <Shield className="text-blue-600" size={28} />
              Credenciamento de Auditor(a)
            </h2>
            <p className="text-gray-600 mb-6">
              Solicite credenciamento como Auditor(a) ESG e contribua para a certificação 
              de práticas sustentáveis na agricultura familiar brasileira.
            </p>
            <button
              onClick={onAuditorCredential}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <Shield size={20} />
              Solicitar Credenciamento
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-8 mb-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex flex-col justify-center">
              <h2 className="mb-4 text-gray-800">Acesse o Painel de Gestão</h2>
              <p className="text-gray-600 mb-6">
                Entre no sistema para criar diagnósticos, gerenciar certificações, 
                realizar auditorias ou coordenar processos de validação.
              </p>
              <button
                onClick={onAccessPanel}
                className="bg-gradient-to-r from-green-600 to-indigo-600 text-white px-8 py-4 rounded-lg hover:from-green-700 hover:to-indigo-700 transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <FileCheck size={24} />
                Acessar Painel de Gestão
                <ChevronRight size={20} />
              </button>
            </div>

            <div className="flex flex-col justify-center">
              <h2 className="mb-4 text-gray-800">Verificar Certificado</h2>
              <p className="text-gray-600 mb-6">
                Digite o ID de um certificado para verificar sua autenticidade 
                e visualizar os detalhes da certificação ESG AgriFamiliar.
              </p>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Digite o ID do Certificado"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                />
                <button
                  onClick={handleSearch}
                  className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                >
                  <Search size={20} />
                  Buscar
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center text-gray-600">
          <p>
            <strong>Agricultura Familiar Sustentável</strong> • ESG na Prática • Transparência e Rastreabilidade
          </p>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// PUBLIC CERTIFICATE VIEW
// ============================================================================
const PublicCertificateView: React.FC<{
  certification: Certification;
  onClose: () => void;
}> = ({ certification, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full my-8">
        <div className="bg-gradient-to-r from-green-600 to-indigo-600 text-white p-8 rounded-t-lg">
          <div className="text-center">
            <Award className="mx-auto mb-4" size={64} />
            <h1 className="mb-2">Certifica AgriFamiliar ESG</h1>
            <p className="text-green-100">Certificação de Sustentabilidade</p>
          </div>
        </div>

        <div className="p-8 bg-gradient-to-br from-green-50 to-indigo-50">
          <div className="bg-white border-4 border-green-600 rounded-lg p-8 shadow-inner">
            <div className="text-center mb-8">
              <p className="text-gray-700 mb-4">Certificamos que</p>
              <h2 className="text-indigo-700 mb-2">{certification.name}</h2>
              <p className="text-gray-600">Empreendimento Familiar</p>
            </div>

            <div className="border-t-2 border-b-2 border-green-200 py-6 my-6">
              <div className="text-center">
                <p className="text-gray-600 mb-2">Pontuação ESG Final</p>
                <div className="text-green-600 mb-2">
                  <span style={{ fontSize: '3rem', fontWeight: '700' }}>{certification.esg_score}</span>
                  <span className="text-2xl">/100</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-green-700">
                  <CheckCircle size={24} />
                  <span>Certificado Aprovado</span>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <p className="text-gray-600 mb-1"><strong>ID de Verificação:</strong></p>
                <p className="text-gray-800 break-all">{certification.id}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1"><strong>Agricultor Familiar:</strong></p>
                <p className="text-gray-800">{certification.submittedBy}</p>
              </div>
            </div>

            <div className="bg-gray-100 rounded-lg p-6 mb-6 text-center">
              <div className="w-32 h-32 bg-white border-2 border-gray-300 mx-auto mb-3 flex items-center justify-center">
                <p className="text-gray-500 text-xs">QR Code</p>
              </div>
              <p className="text-gray-600 text-sm">
                {certification.certificate_qr_code || 'https://certifica.agrifamiliar.esg/verify/' + certification.id}
              </p>
            </div>

            <div className="bg-indigo-50 rounded-lg p-6 border-2 border-indigo-200">
              <h3 className="text-indigo-800 mb-4 flex items-center gap-2">
                <Shield size={20} />
                Rastreabilidade Completa
              </h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {certification.validation_logs.map((log, index) => (
                  <div key={index} className="bg-white p-3 rounded border border-indigo-100 text-sm text-gray-700">
                    {log}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-8 py-4 flex justify-between items-center rounded-b-lg">
          <p className="text-gray-600 text-sm">
            Este certificado é válido e verificável através do ID acima.
          </p>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// DIAGNOSTIC FORM
// ============================================================================
const DiagnosticForm: React.FC<{
  answers: DiagnosticAnswers;
  onChange: (answers: DiagnosticAnswers) => void;
  readonly?: boolean;
}> = ({ answers, onChange, readonly = false }) => {
  const handleChange = (key: keyof DiagnosticAnswers, value: boolean) => {
    if (!readonly) {
      onChange({ ...answers, [key]: value });
    }
  };

  return (
    <div className="space-y-4">
      {diagnosticQuestions.map((q) => (
        <div key={q.key} className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <p className="text-indigo-600 text-sm mb-1">{q.category}</p>
              <p className="text-gray-800">{q.question}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleChange(q.key as keyof DiagnosticAnswers, true)}
                disabled={readonly}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  answers[q.key as keyof DiagnosticAnswers]
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                } ${readonly ? 'cursor-not-allowed opacity-60' : ''}`}
              >
                Sim
              </button>
              <button
                onClick={() => handleChange(q.key as keyof DiagnosticAnswers, false)}
                disabled={readonly}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  !answers[q.key as keyof DiagnosticAnswers]
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                } ${readonly ? 'cursor-not-allowed opacity-60' : ''}`}
              >
                Não
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// ============================================================================
// MAIN APP COMPONENT
// ============================================================================
export default function App() {
  const [userId] = useState<string>('user-' + Math.random().toString(36).substr(2, 9));
  const [currentRole, setCurrentRole] = useState<UserRole>('Admin');
  const [viewAs, setViewAs] = useState<ViewAs>(null);
  const [currentView, setCurrentView] = useState<'landing' | 'panel'>('landing');
  const [showFarmerForm, setShowFarmerForm] = useState(false);
  const [showAuditorForm, setShowAuditorForm] = useState(false);
  
  // Data states
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [farmerRegistrations, setFarmerRegistrations] = useState<FarmerRegistration[]>([]);
  const [auditorCredentials, setAuditorCredentials] = useState<AuditorCredential[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [productBatches, setProductBatches] = useState<ProductBatch[]>([]);
  
  const [viewingCertificate, setViewingCertificate] = useState<Certification | null>(null);
  const [modal, setModal] = useState<{ isOpen: boolean; title: string; message: string; type: any }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  });

  const handleVerifyCertificate = (id: string) => {
    const cert = certifications.find(c => c.id === id);
    if (cert && cert.status === 'Aprovado') {
      setViewingCertificate(cert);
    } else {
      setModal({
        isOpen: true,
        title: 'Certificado Não Encontrado',
        message: 'O ID informado não corresponde a um certificado aprovado ou não foi encontrado no sistema.',
        type: 'error'
      });
    }
  };

  const handleFarmerRegistration = (data: FarmerRegistration) => {
    setFarmerRegistrations([...farmerRegistrations, data]);
    setShowFarmerForm(false);
    setModal({
      isOpen: true,
      title: 'Cadastro Enviado',
      message: 'Seu cadastro foi enviado com sucesso! Aguarde a análise da equipe.',
      type: 'success'
    });
  };

  const handleAuditorCredential = (data: AuditorCredential) => {
    setAuditorCredentials([...auditorCredentials, data]);
    setShowAuditorForm(false);
    setModal({
      isOpen: true,
      title: 'Credenciamento Enviado',
      message: 'Sua solicitação de credenciamento foi enviada com sucesso! Aguarde a análise.',
      type: 'success'
    });
  };

  const effectiveRole = viewAs || currentRole;

  return (
    <div className="min-h-screen bg-gray-50">
      <CustomModal
        isOpen={modal.isOpen}
        onClose={() => setModal({ ...modal, isOpen: false })}
        title={modal.title}
        message={modal.message}
        type={modal.type}
      />

      {viewingCertificate && (
        <PublicCertificateView
          certification={viewingCertificate}
          onClose={() => setViewingCertificate(null)}
        />
      )}

      {showFarmerForm && (
        <FarmerRegistrationForm
          onClose={() => setShowFarmerForm(false)}
          onSubmit={handleFarmerRegistration}
        />
      )}

      {showAuditorForm && (
        <AuditorCredentialForm
          onClose={() => setShowAuditorForm(false)}
          onSubmit={handleAuditorCredential}
        />
      )}

      {currentView === 'landing' ? (
        <LandingPageView
          onAccessPanel={() => setCurrentView('panel')}
          onVerifyCertificate={handleVerifyCertificate}
          onFarmerRegistration={() => setShowFarmerForm(true)}
          onAuditorCredential={() => setShowAuditorForm(true)}
        />
      ) : (
        <>
          <div className="bg-white shadow-lg border-b-4 border-green-600">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <Leaf className="text-green-600" size={32} />
                  <div>
                    <h1 className="text-green-700">Certifica AgriFamiliar ESG</h1>
                    <p className="text-gray-600 text-sm">Sistema de Certificação e Rastreabilidade</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 flex-wrap">
                  <button
                    onClick={() => setCurrentView('landing')}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                  >
                    <Home size={20} />
                    Início
                  </button>

                  {currentRole === 'Admin' && (
                    <button
                      className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors flex items-center gap-2"
                    >
                      <Settings size={20} />
                      Configurações
                    </button>
                  )}

                  {(currentRole === 'Admin' || currentRole === 'Coordenador' || currentRole === 'Auditor') && (
                    <select
                      value={viewAs || ''}
                      onChange={(e) => setViewAs(e.target.value as ViewAs || null)}
                      className="px-4 py-2 border-2 border-purple-500 rounded-lg focus:outline-none focus:border-purple-600"
                    >
                      <option value="">Ver como: {currentRole}</option>
                      {currentRole === 'Admin' && (
                        <>
                          <option value="Coordenador">Ver como Coordenador</option>
                          <option value="Auditor">Ver como Auditor</option>
                          <option value="Agricultor">Ver como Agricultor</option>
                        </>
                      )}
                      {currentRole === 'Coordenador' && (
                        <>
                          <option value="Auditor">Ver como Auditor</option>
                          <option value="Agricultor">Ver como Agricultor</option>
                        </>
                      )}
                      {currentRole === 'Auditor' && (
                        <option value="Agricultor">Ver como Agricultor</option>
                      )}
                    </select>
                  )}
                  
                  <select
                    value={currentRole}
                    onChange={(e) => {
                      setCurrentRole(e.target.value as UserRole);
                      setViewAs(null);
                    }}
                    className="px-4 py-2 border-2 border-indigo-500 rounded-lg focus:outline-none focus:border-indigo-600"
                  >
                    <option value="Agricultor">Agricultor Familiar</option>
                    <option value="Auditor">Auditor</option>
                    <option value="Coordenador">Coordenador</option>
                    <option value="Admin">Admin/Gestor</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-xl p-8 text-center">
              <h2 className="text-gray-800 mb-4">
                Painel {effectiveRole === currentRole ? 'do ' : 'do '}{effectiveRole}
                {viewAs && <span className="text-indigo-600"> (Visualizando como {viewAs})</span>}
              </h2>
              <p className="text-gray-600 mb-4">
                Implementação completa dos painéis em desenvolvimento...
              </p>
              <div className="grid md:grid-cols-3 gap-4 mt-8">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <Users className="text-green-600 mx-auto mb-2" size={32} />
                  <p className="text-gray-700">Cadastros de Agricultores: {farmerRegistrations.length}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <Shield className="text-blue-600 mx-auto mb-2" size={32} />
                  <p className="text-gray-700">Solicitações de Auditores: {auditorCredentials.length}</p>
                </div>
                <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                  <Award className="text-indigo-600 mx-auto mb-2" size={32} />
                  <p className="text-gray-700">Certificações: {certifications.length}</p>
                </div>
              </div>

              {currentRole === 'Coordenador' && (
                <div className="mt-6 bg-purple-50 p-6 rounded-lg border border-purple-200">
                  <h3 className="text-purple-800 mb-3">Solicitações de Credenciamento</h3>
                  <p className="text-gray-600">
                    Aqui você poderá analisar, aprovar ou desaprovar solicitações de credenciamento de auditores
                    e gerar acessos para auditores e coordenadores.
                  </p>
                </div>
              )}

              {effectiveRole === 'Agricultor' && (
                <div className="mt-6 grid md:grid-cols-3 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <DollarSign className="text-green-600 mx-auto mb-2" size={32} />
                    <p className="text-gray-700">Gestão de Vendas</p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <TrendingDown className="text-red-600 mx-auto mb-2" size={32} />
                    <p className="text-gray-700">Registro de Gastos</p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <Package className="text-yellow-600 mx-auto mb-2" size={32} />
                    <p className="text-gray-700">Lotes de Produtos</p>
                  </div>
                </div>
              )}

              {effectiveRole === 'Auditor' && (
                <div className="mt-6 bg-blue-50 p-6 rounded-lg border border-blue-200">
                  <h3 className="text-blue-800 mb-3">Diagnósticos e Auditorias</h3>
                  <p className="text-gray-600">
                    Acesso para preencher e editar diagnósticos, fazer upload e download de documentos,
                    e baixar relatórios de auditorias concluídas e em andamento.
                  </p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
