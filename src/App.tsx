import React, { useState } from 'react';
import { ShieldCheck, UserPlus, LogIn } from 'lucide-react';

import CustomModal from './components/CustomModal'; 
import FarmerRegistrationForm from './components/FarmerRegistrationForm'; 
import AuditorCredentialForm from './components/AuditorCredentialForm'; 
import Header from './components/Header'; 

interface DiagnosticAnswers {
  q1: boolean;
  q2: string;
}

interface Certification {
  id: string;
  farmerId: string;
  auditorId: string;
  date: number;
  status: 'Pendente' | 'Emitido' | 'Expirado';
}

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<'landing' | 'farmer-register' | 'auditor-credential' | 'login' | 'dashboard'>('landing');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', message: '', type: 'success' as const });

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
    setModalContent({
        title: 'Certificado Não Encontrado',
        message: `O ID do certificado "${id}" não foi encontrado ou está inválido.`,
        type: 'warning'
    });
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen font-sans">
      
      <Header setActiveView={setActiveView} />
      
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        
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
        
        {activeView === 'dashboard' && (
            <div className="text-center py-20 bg-white rounded-xl shadow-lg">
                <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Painel de Gestão (Dashboard)</h2>
                <p className="text-xl text-gray-600 mb-8">Conteúdo do painel virá aqui...</p>
                <button onClick={() => setActiveView('landing')} className="text-indigo-600 hover:underline">Voltar</button>
            </div>
        )}

      </main>

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
      
      {activeView === 'login' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-sm w-full">
            <h3 className="text-2xl font-bold mb-4">Login</h3>
            <p className="mb-6 text-gray-600">Formulário de login simples...</p>
            <button onClick={() => setActiveView('landing')} className="text-indigo-600 hover:underline">Voltar</button>
          </div>
        </div>
      )}

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
