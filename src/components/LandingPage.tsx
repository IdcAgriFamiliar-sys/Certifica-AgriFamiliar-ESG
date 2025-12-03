// src/componentes/LandingPage.tsx

import React from 'react';
import { Leaf, Award, FileText, ArrowRight } from 'lucide-react';

import logoDespertarCidadania from '../assets/LogoDespertarCidadania.png';
import seloESGAgriFamiliar from '../assets/SeloESGAgriFamiliar.png';

const FeatureCard: React.FC<{ icon: React.ElementType, title: string, description: string }> = ({ icon: Icon, title, description }) => (
  <div className="bg-white p-6 rounded-lg shadow-lg text-center transition-transform transform hover:scale-105">
    <Icon className="w-10 h-10 text-green-600 mx-auto mb-4" />
    <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header/Hero Section */}
      <header className="bg-green-700 text-white shadow-md">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <img src={seloESGAgriFamiliar} alt="Selo ESG" className="h-10 mr-3" />
            <span className="text-2xl font-bold">Certificação ESG Agrifamiliar</span>
          </div>
          <a href="/login" className="bg-white text-green-700 py-2 px-4 rounded-full font-semibold hover:bg-gray-100 transition duration-300">
            Acessar Plataforma
          </a>
        </div>
      </header>

      <section className="py-20 bg-green-50">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl font-extrabold text-gray-800 mb-4">
            Sustentabilidade, Responsabilidade e Governança na Agricultura Familiar
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Impulsione sua produção com o selo ESG que valoriza o meio ambiente, o social e a transparência.
          </p>
          <a href="/register" className="inline-flex items-center bg-green-600 text-white py-3 px-8 rounded-full text-lg font-bold hover:bg-green-700 transition duration-300 shadow-xl">
            Comece Sua Certificação Agora <ArrowRight className="ml-2 w-5 h-5" />
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">O que o Selo ESG Garante?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={Leaf}
              title="Ambiental (E)"
              description="Compromisso com o uso sustentável dos recursos naturais, redução de resíduos e proteção da biodiversidade."
            />
            <FeatureCard
              icon={Award}
              title="Social (S)"
              description="Foco em relações de trabalho justas, bem-estar da comunidade, diversidade e inclusão no campo."
            />
            <FeatureCard
              icon={FileText}
              title="Governança (G)"
              description="Transparência, prestação de contas e ética na gestão, fortalecendo a confiança dos parceiros e consumidores."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-6 text-center">
          <p className="mb-4">Uma iniciativa:</p>
          <img src={logoDespertarCidadania} alt="Logo Despertar Cidadania" className="h-12 mx-auto mb-4" />
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Sistema de Certificação ESG da Agricultura Familiar. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
