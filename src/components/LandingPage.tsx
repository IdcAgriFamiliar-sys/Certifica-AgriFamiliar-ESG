// src/components/LandingPage.tsx
import React from "react";

interface Props {
  onOpenLogin: () => void;
  onOpenFarmerRegister: () => void;
  onOpenAuditorRegister: () => void;
}

const LandingPage: React.FC<Props> = ({ onOpenLogin, onOpenFarmerRegister, onOpenAuditorRegister }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-green-700 text-white py-6 shadow-md">
        <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Certifica AgriFamiliar ESG</h1>
            <p className="text-sm opacity-90">Selo de sustentabilidade para a agricultura familiar</p>
          </div>
          <div>
            <button onClick={onOpenLogin} className="bg-white text-green-700 px-4 py-2 rounded-full font-medium">
              Acessar
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto px-6 py-12 w-full">
        <section className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900">Sustentabilidade, responsabilidade e governança</h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">Cadastre-se para iniciar a certificação ESG da sua produção familiar — gratuito e orientado por especialistas.</p>
        </section>

        <section className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow p-8 border">
            <h3 className="text-xl font-semibold mb-3">Cadastro de Agricultores(as)</h3>
            <p className="text-gray-600 mb-6">Preencha seus dados e envie o CAF e documentos para análise.</p>
            <button onClick={onOpenFarmerRegister} className="w-full bg-green-700 hover:bg-green-800 text-white py-3 rounded-md">
              Cadastro de Agricultor(a)
            </button>
          </div>

          <div className="bg-white rounded-xl shadow p-8 border">
            <h3 className="text-xl font-semibold mb-3">Credenciar Auditores(as)</h3>
            <p className="text-gray-600 mb-6">Profissionais podem solicitar credenciamento enviando documentos e registro profissional.</p>
            <button onClick={onOpenAuditorRegister} className="w-full bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-md">
              Credenciar Auditor(a)
            </button>
          </div>
        </section>
      </main>

      <footer className="bg-gray-100 py-6 text-center text-gray-600">
        © {new Date().getFullYear()} Certifica AgriFamiliar ESG
      </footer>
    </div>
  );
};

export default LandingPage;
