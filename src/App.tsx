import React, { useState } from 'react';
import { ShieldCheck, UserPlus, SlidersHorizontal, LogIn, Leaf, FileCheck, Search, Home, ChevronRight, AlertCircle, XCircle, Clock, Edit, Trash2, Send, Upload, Download, Settings, DollarSign, ShoppingCart, Package, BarChart3, FileText, Plus, Calendar, TrendingUp, TrendingDown, Award, Users, Eye } from 'lucide-react';

// ============================================================================
// IMPORTAÇÕES DOS COMPONENTES MODULARES (Chave da Modularização!)
// ============================================================================
import CustomModal from './components/CustomModal'; 
import FarmerRegistrationForm from './components/FarmerRegistrationForm'; 
import AuditorCredentialForm from './components/AuditorCredentialForm'; 
// OBS: Você precisará importar todos os outros componentes que criar aqui (Header, Dashboard, etc.)
// Para esta correção, estou mantendo as importações básicas da etapa anterior.

// ============================================================================
// TIPOS DE DADOS E INTERFACES (Mantenha aqui por enquanto, ou em 'src/types/index.ts')
// ============================================================================
interface DiagnosticAnswers {
  q1: boolean;
  q2: string;
  // Adicione todos os seus tipos de dados complexos que não são do componente aqui
}

interface Certification {
  id: string;
  farmerId: string;
  auditorId: string;
  date: number;
  status: 'Pendente' | 'Emitido' | 'Expirado';
}

// ============================================================================
// COMPONENTE PRINCIPAL (App)
// ============================================================================
const App: React.FC = () => {
  // O estado (state) é o que define qual componente/página está visível
  const [activeView, setActiveView] = useState<'landing' | 'farmer-register' | 'auditor-credential' | 'login' | 'dashboard'>('landing');
  
  // Estados do Modal (para exibir feedback global)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', message: '', type: 'success' as const });

  // Funções de manipulação/simulação de envio de dados
  const handleFarmerSubmit = (data: any) => {
    console.log('Dados do Agricultor Enviados:', data);
    setModalContent({ 
      title: 'Cadastro Enviado!', 
      message: 'Seu cadastro de agricultor foi enviado com sucesso e está sob análise.', 
      type: 'success' 
    });
    setIsModalOpen(true);
    setActiveView('landing');
  };

  const handleAuditorSubmit = (data: any) => {
    console.log('Dados do Auditor Enviados:', data);
    setModalContent({ 
      title: 'Credenciamento Enviado!', 
      message: 'Seu pedido de credenciamento de auditor foi enviado para revisão.', 
      type: 'success' 
    });
    setIsModalOpen(true);
    setActiveView('landing');
  };
  
  const handleVerifyCertificate = (id: string) => {
    console.log('Verificando certificado:', id);
    // Lógica real de busca de certificado
    setModalContent({
        title: 'Certificado Não Encontrado',
        message: `O ID do certificado "${id}" não foi encontrado ou está inválido.`,
        type: 'warning'
    });
    setIsModalOpen(true);
  };

  // --------------------------------------------------------------------------
  // LAYOUT E ROTEAMENTO
  // --------------------------------------------------------------------------
  
  return (
    <div className="min-h-screen font-sans">
      
      {/* CABEÇALHO (Em breve será o componente Header.tsx) */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-green-600 cursor-pointer" onClick={() => setActiveView('landing')}>
            Certifica AgriFamiliar ESG
          </h1>
          <nav className="flex space-x-4">
            <button 
              onClick={() => setActiveView('farmer-register')}
              className="flex items-center gap-1 text-gray-700 hover:text-indigo-600 transition"
            >
              <UserPlus size={18} /> Cadastro
            </button>
            <button 
              onClick={() => setActiveView('auditor-credential')}
              className="flex items-center gap-1 text-gray-700 hover:text-indigo-600 transition"
            >
              <ShieldCheck size={18} /> Auditor
            </button>
            <button 
              onClick={() => setActiveView('login')}
              className="flex items-center gap-1 text-white bg-indigo-600 px-3 py-1 rounded-lg hover:bg-indigo-700 transition"
            >
              <LogIn size={18} /> Login
            </button>
          </nav>
        </div>
      </header>
      
      {/* CONTEÚDO PRINCIPAL (Rotas) */}
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        
        {/* VIEW: LANDING PAGE */}
        {activeView === 'landing' && (
          <div className="text-center py-20 bg-white rounded-xl shadow-lg">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Bem-vindo à Plataforma de Certificação</h2>
            <p className="text-xl text-gray-600 mb-8">Gestão e Sustentabilidade para a Agricultura Familiar.</p>
            <div className="flex justify-center gap-6">
              <button 
                onClick={() => setActiveView('farmer-register')}
                className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition"
              >
                Cadastrar Agricultor(a)
              </button>
              <button 
                onClick={() => setActiveView('auditor-credential')}
                className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition"
              >
                Credenciar Auditor(a)
              </button>
            </div>
          </div>
        )}
        
        {/* VIEW: DASHBOARD (Simulação de Acesso ao Painel) */}
        {activeView === 'dashboard' && (
            <div className="text-center py-20 bg-white rounded-xl shadow-lg">
                <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Painel de Gestão (Dashboard)</h2>
                <p className="text-xl text-gray-600 mb-8">Conteúdo do painel virá aqui...</p>
                <button onClick={() => setActiveView('landing')} className="text-indigo-600 hover:underline">Voltar</button>
            </div>
        )}

      </main>

      {/* RENDERIZAÇÃO CONDICIONAL DOS FORMULÁRIOS (Como Modals ou Telas Fixas) */}
      
      {activeView === 'farmer-register' && (
        <FarmerRegistrationForm
          onClose={() => setActiveView('landing')}
          onSubmit={handleFarmerSubmit}
        />
      )}
      
      {activeView === 'auditor-credential' && (
        <AuditorCredentialForm
          onClose={() => setActiveView('landing')}
          onSubmit={handleAuditorSubmit}
        />
      )}
      
      {/* LOGIN VIEW (A ser implementada) */}
      {activeView === 'login' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-sm w-full">
            <h3 className="text-2xl font-bold mb-4">Login</h3>
            <p className="mb-6 text-gray-600">Formulário de login simples...</p>
            <button onClick={() => setActiveView('landing')} className="text-indigo-600 hover:underline">Voltar</button>
          </div>
        </div>
      )}

      {/* USO DO MODAL (Última camada da aplicação) */}
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

export default App;
