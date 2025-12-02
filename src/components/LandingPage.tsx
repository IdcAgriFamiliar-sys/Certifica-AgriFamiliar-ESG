import React from 'react';
import { Leaf, ShieldCheck, TrendingUp, BarChart2 } from 'lucide-react';

interface LandingPageProps {
  onLogin: () => void;
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
          <div className="flex items-center text-2xl font-bold text-green-700">
            <Leaf size={30} className="mr-2" />
            AgriESG
          </div>
          <button
            onClick={onLogin}
            className="px-6 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition duration-300 shadow-md"
          >
            Entrar no Sistema
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow">
        <section className="py-24 bg-gray-100 text-center">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
            Certificação ESG para Agricultura Familiar
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Impulsione sua produção com sustentabilidade, governança e impacto social verificável.
          </p>
          <button
            onClick={onLogin}
            className="px-10 py-4 bg-indigo-600 text-white text-lg font-semibold rounded-full shadow-lg hover:bg-indigo-700 transition duration-300 transform hover:scale-105"
          >
            Começar Agora
          </button>
        </section>

        {/* Features Section */}
        <section className="py-20 container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Nossas Vantagens</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<ShieldCheck size={40} />}
              title="Transparência Total"
              description="Rastreabilidade completa da origem do alimento até o consumidor final via QR Code."
            />
            <FeatureCard
              icon={<TrendingUp size={40} />}
              title="Acesso a Mercados Premium"
              description="Abra portas para novos mercados que exigem padrões ambientais e sociais rigorosos."
            />
            <FeatureCard
              icon={<BarChart2 size={40} />}
              title="Score ESG Detalhado"
              description="Avaliações periódicas para medir e melhorar seu desempenho em Sustentabilidade, Social e Governança."
            />
            <FeatureCard
              icon={<Leaf size={40} />}
              title="Apoio Técnico Certificado"
              description="Conectamos você a uma rede de auditores especializados na agricultura familiar."
            />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white p-6">
        <div className="container mx-auto text-center text-sm">
          &copy; {new Date().getFullYear()} AgriESG. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
