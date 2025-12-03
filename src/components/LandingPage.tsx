// src/components/LandingPage.tsx

import React from "react";

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* Seção do topo */}
      <header className="bg-green-700 text-white py-6 shadow-md">
        <div className="max-w-5xl mx-auto px-4">
          <h1 className="text-3xl font-bold">Certifica AgriFamiliar ESG</h1>
          <p className="text-lg opacity-90">
            Plataforma de certificação socioambiental para agricultura familiar
          </p>
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className="flex-1 max-w-5xl mx-auto px-4 py-10 space-y-16">

        {/* Apresentação */}
        <section className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">
            Bem-vindo ao Sistema de Certificação AgriFamiliar ESG
          </h2>
          <p className="text-gray-600 mt-4 leading-relaxed text-lg">
            Aqui agricultores(as) familiares podem se cadastrar gratuitamente para iniciar o processo
            de certificação socioambiental. Auditores(as) profissionais também podem solicitar
            credenciamento para atuar na plataforma.
          </p>
        </section>

        {/* Cartões de ação */}
        <section className="grid md:grid-cols-2 gap-10">

          {/* Agricultores */}
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Para Agricultores(as)</h3>
            <p className="text-gray-600 mb-6">
              Agricultores familiares podem solicitar gratuitamente o cadastro no sistema
              para receber orientações e iniciar o processo de certificação.
            </p>

            <button
              onClick={() => (window.location.href = "/farmer-register")}
              className="w-full bg-green-700 hover:bg-green-800 text-white py-3 rounded-lg font-medium shadow-md transition"
            >
              Cadastro de Agricultores(as)
            </button>
          </div>

          {/* Auditores */}
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Para Auditores(as)</h3>
            <p className="text-gray-600 mb-6">
              Profissionais qualificados podem solicitar credenciamento para atuar como auditores
              ESG na certificação da agricultura familiar.
            </p>

            <button
              onClick={() => (window.location.href = "/auditor-register")}
              className="w-full bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-lg font-medium shadow-md transition"
            >
              Credenciar Auditor(a)
            </button>
          </div>
        </section>

      </main>

      {/* Rodapé */}
      <footer className="bg-gray-100 py-6 text-center text-gray-600 text-sm border-t">
        © {new Date().getFullYear()} Certifica AgriFamiliar ESG — Plataforma de Certificação
      </footer>
    </div>
  );
};

export default LandingPage;
