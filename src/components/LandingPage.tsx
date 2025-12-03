import React from 'react';
import { Leaf, ShieldCheck, TrendingUp, BarChart2, UserPlus, FileText, LogIn } from 'lucide-react';
import { UserRole } from '../App'; 

// ============================================================================
// IMPORTAÇÃO DAS LOGOS - AJUSTADO PARA NOMES SEM ESPAÇOS E PÚBLICOS
// Por favor, garanta que os arquivos no seu repositório foram renomeados para:
// LogoDespertarCidadania.png
// SeloESGAgriFamiliar.png
// ============================================================================
import idcLogo from '../assets/LogoDespertarCidadania.png'; 
import seloEsg from '../assets/SeloESGAgriFamiliar.png';   
// ============================================================================

interface LandingPageProps {
  onLogin: (role: UserRole) => void;
}

const FeatureCard: React.FC<{ icon: React.ReactNode, title: string, description: string }> = ({ icon, title, description }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-green-500 transition-transform duration-300 hover:scale-[1.02]">
    <div className="text-green-600 mb-3">{icon}</div>
    <h3 className="text-xl font-semibold mb-2 text-gray-800">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-md p-4 sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            {/* Nome do Projeto */}
            <div className="flex items-center text-2xl font-bold text-green-700 mr-4">
              <Leaf size={30} className="mr-2" />
              Certifica AgriFamiliar ESG
            </div>
            {/* Logo da Instituição Criadora (IDC) */}
            <img src={idcLogo} alt="Logo IDC - Instituto Despertar da Cidadania" className="h-8" />
          </div>
          
          {/* Botão Único de Login para Usuários Ativos (Gestores, Coordenadores, etc.) */}
          <button
            onClick={() => onLogin('admin')} // Simula a entrada na tela de LOGIN (Gestor, Coordenador, etc.)
            className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition duration-300 shadow-md flex items-center gap-2"
          >
            <LogIn size={20} />
            Entrar no Sistema
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow">
        <section className="py-24 bg-gray-100 text-center">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
            A Certificação ESG que Transforma a Agricultura Familiar.
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-4xl mx-auto">
            Impulsione sua produção com padrões de Sustentabilidade, Governança e Impacto Social, abrindo portas para mercados de valor.
          </p>
          
          {/* TRÊS CAMINHOS CLAROS: Login, Cadastro e Credenciamento */}
          <div className="flex justify-center gap-6 mt-10">
            {/* 1. Cadastro de Agricultor */}
            <div className="flex flex-col items-center justify-center p-8 w-64 bg-white rounded-xl shadow-2xl border-t-4 border-green-500">
                <UserPlus size={36} className="text-green-600 mb-3" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">Sou Agricultor(a)</h3>
                <p className="text-sm text-gray-500 mb-4">Inicie seu processo de certificação e gestão de dados ESG.</p>
                <button
                    onClick={() => alert("Simulando formulário de Cadastro de Agricultor(a)!")}
                    className="w-full px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
                >
                    Quero me Cadastrar
                </button>
            </div>

            {/* 2. Credenciamento de Auditor */}
            <div className="flex flex-col items-center justify-center p-8 w-64 bg-white rounded-xl shadow-2xl border-t-4 border-purple-500">
                <FileText size={36} className="text-purple-600 mb-3" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">Sou Auditor(a)</h3>
                <p className="text-sm text-gray-500 mb-4">Envie sua documentação para ser credenciado na rede do IDC.</p>
                <button
                    onClick={() => alert("Simulando formulário de Credenciamento de Auditor(a)!")}
                    className="w-full px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition"
                >
                    Quero me Credenciar
                </button>
            </div>
            
            {/* 3. Acesso Rápido para Logado (Link que simula login na Home) */}
            <div className="flex flex-col items-center justify-center p-8 w-64 bg-white rounded-xl shadow-2xl border-t-4 border-indigo-500">
                <LogIn size={36} className="text-indigo-600 mb-3" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">Já Tenho Acesso</h3>
                <p className="text-sm text-gray-500 mb-4">Acesse o painel de gestão da sua propriedade ou de auditoria.</p>
                <button
                    onClick={() => onLogin('farmer')} // Simula um login ativo (pode ser qualquer um, usamos farmer)
                    className="w-full px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
                >
                    Acessar
                </button>
            </div>
          </div>
        </section>
        
        {/* NOVA SEÇÃO: Apresentação do IDC e Selo */}
        <section className="py-16 bg-white border-b border-gray-200">
            <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center justify-between gap-10">
                <div className="lg:w-2/3">
                    <h2 className="text-3xl font-bold text-green-700 mb-4">Sobre o Instituto Despertar da Cidadania (IDC)</h2>
                    <p className="text-gray-600 text-lg mb-4">
                        O **IDC** é a instituição idealizadora e promotora do projeto Certifica AgriFamiliar ESG. Nossa missão é fomentar o desenvolvimento sustentável e a inclusão social no campo, garantindo que a agricultura familiar atenda aos mais altos padrões ambientais, sociais e de governança.
                    </p>
                    <p className="text-gray-600">
                        Através da certificação, o IDC busca valorizar o trabalho do agricultor, conectando-o a um mercado que reconhece e recompensa práticas responsáveis.
                    </p>
                </div>
                {/* O Selo ESG como distintivo */}
                <div className="lg:w-1/3 flex flex-col items-center p-6 bg-gray-50 rounded-xl shadow-inner">
                    <img src={seloEsg} alt="Selo AgriFamiliar ESG" className="w-40 h-auto mb-3" />
                    <p className="text-sm font-semibold text-gray-700 text-center">Distintivo de Conformidade ESG</p>
                </div>
            </div>
        </section>

        {/* Features Section */}
        <section className="py-20 container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">O que o sistema oferece?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<ShieldCheck size={40} />}
              title="Rastreabilidade Completa"
              description="Do plantio à venda, cada lote é rastreado para garantir transparência e autenticidade ESG."
            />
            <FeatureCard
              icon={<TrendingUp size={40} />}
              title="Acesso a Mercados"
              description="Use o selo para abrir portas para compradores e investidores focados em sustentabilidade."
            />
            <FeatureCard
              icon={<BarChart2 size={40} />}
              title="Avaliação Detalhada"
              description="Tenha uma visão clara do seu desempenho nas áreas Ambiental, Social e de Governança."
            />
            <FeatureCard
              icon={<Leaf size={40} />}
              title="Gestão Simplificada"
              description="Ferramentas fáceis para registrar dados de plantio, finanças e documentos fiscais."
            />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white p-6">
        <div className="container mx-auto text-center text-sm">
          &copy; {new Date().getFullYear()} Certifica AgriFamiliar ESG. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
