import React from "react";
import { ArrowRight, CheckCircle, Leaf, ShieldCheck, UserPlus, Users, BadgeCheck, Sprout, Building2 } from "lucide-react";

interface Props {
  onOpenLogin: () => void;
  onOpenFarmerRegister: () => void;
  onOpenAuditorRegister: () => void;
}

const LandingPage: React.FC<Props> = ({
  onOpenLogin,
  onOpenFarmerRegister,
  onOpenAuditorRegister,
}) => {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-50">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-green-600 to-green-700 p-2 rounded-xl shadow-lg shadow-green-200">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl text-gray-900 tracking-tight leading-none">
                  Certifica ESG
                </span>
                <span className="text-xs font-semibold text-green-600 tracking-wider uppercase">AgriFamiliar</span>
              </div>
            </div>
            <button
              onClick={onOpenLogin}
              className="group flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-6 py-2.5 rounded-full font-medium transition-all transform hover:scale-105 shadow-xl shadow-gray-200"
            >
              <span>Acessar via Google</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-green-100/50 via-transparent to-transparent opacity-70" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-32 relative text-center">

          <div className="inline-flex items-center gap-2 bg-green-50 border border-green-100 rounded-full px-4 py-1.5 mb-8 animate-fade-in-up">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-xs font-semibold text-green-700 uppercase tracking-wide">Inscrições Abertas 2025</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-8 leading-tight">
            O futuro da agricultura é
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">
              Sustentável e Certificado
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Certificação ESG para produtores familiares. Aumente seu valor de mercado, garanta conformidade e acesse linhas de crédito exclusivas.
          </p>

          <div className="inline-flex flex-col sm:flex-row items-center gap-3 bg-yellow-50 border border-yellow-100 rounded-2xl px-6 py-4 mb-12 max-w-lg mx-auto text-yellow-800 shadow-sm">
            <div className="bg-yellow-100 p-2 rounded-full">
              <Users className="w-5 h-5 text-yellow-700" />
            </div>
            <div className="text-left">
              <span className="block font-bold text-sm text-yellow-900">Atenção</span>
              <span className="text-sm font-medium opacity-90">
                Para acessar o sistema com Google, é necessário realizar o <strong>cadastro abaixo</strong> primeiro.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Actions */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 -mt-20 relative z-10">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">

          {/* Agricultor Card */}
          <div className="relative group bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-white p-10 hover:shadow-2xl transition-all duration-300 overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-green-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-50 group-hover:opacity-100 transition-opacity" />

            <div className="relative">
              <div className="h-14 w-14 bg-gradient-to-br from-green-100 to-green-50 rounded-2xl flex items-center justify-center mb-8 border border-green-100 group-hover:scale-110 transition-transform shadow-inner">
                <Sprout className="w-7 h-7 text-green-600" />
              </div>

              <h2 className="text-3xl font-bold text-gray-900 mb-2">Sou Agricultor(a)</h2>
              <p className="text-gray-500 mb-8 font-medium">Valorize sua produção e acesse novos mercados.</p>

              <div className="space-y-5 mb-10">
                <div className="flex items-center gap-3">
                  <div className="p-1 rounded-full bg-green-100/50">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="text-gray-600 font-medium">Obtenção do Selo ESG Oficial</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-1 rounded-full bg-green-100/50">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="text-gray-600 font-medium">Prioridade em Programas de Crédito</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-1 rounded-full bg-green-100/50">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="text-gray-600 font-medium">Diagnóstico Gratuito da Propriedade</span>
                </div>
              </div>

              <button
                onClick={onOpenFarmerRegister}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-4 rounded-xl shadow-lg shadow-green-200 transition-all transform active:scale-95 flex items-center justify-center gap-2 group-hover:shadow-green-300"
              >
                <span>Fazer Cadastro Gratuito</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Auditor Card */}
          <div className="relative group bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-white p-10 hover:shadow-2xl transition-all duration-300 overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-50 group-hover:opacity-100 transition-opacity" />

            <div className="relative">
              <div className="h-14 w-14 bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl flex items-center justify-center mb-8 border border-blue-100 group-hover:scale-110 transition-transform shadow-inner">
                <BadgeCheck className="w-7 h-7 text-blue-600" />
              </div>

              <h2 className="text-3xl font-bold text-gray-900 mb-2">Sou Auditor(a)</h2>
              <p className="text-gray-500 mb-8 font-medium">Expanda sua atuação profissional no campo.</p>

              <div className="space-y-5 mb-10">
                <div className="flex items-center gap-3">
                  <div className="p-1 rounded-full bg-blue-100/50">
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="text-gray-600 font-medium">Plataforma Exclusiva de Gestão</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-1 rounded-full bg-blue-100/50">
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="text-gray-600 font-medium">Demanda Recorrente de Serviços</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-1 rounded-full bg-blue-100/50">
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="text-gray-600 font-medium">Metodologia Padronizada IDC</span>
                </div>
              </div>

              <button
                onClick={onOpenAuditorRegister}
                className="w-full bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-white font-bold py-4 rounded-xl shadow-lg shadow-gray-300 transition-all transform active:scale-95 flex items-center justify-center gap-2 group-hover:shadow-gray-400"
              >
                <span>Solicitar Credenciamento</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* IDC Section */}
        <div className="mt-24 mb-12">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="grid md:grid-cols-12 gap-0">
              <div className="md:col-span-4 bg-gray-50 p-12 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-gray-100 text-center">
                <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border border-gray-100">
                  <Building2 className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-extrabold text-gray-900 uppercase tracking-wide">Instituto Despertar</h3>
                <p className="text-sm text-gray-500 font-semibold uppercase tracking-widest mt-1">da Cidadania</p>
              </div>

              <div className="md:col-span-8 p-10 md:p-14 flex flex-col justify-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <span className="w-8 h-1 bg-green-500 rounded-full"></span>
                  Nossa Missão
                </h3>
                <p className="text-gray-600 leading-relaxed text-lg mb-8">
                  O <strong>Instituto Despertar da Cidadania (IDC)</strong> lidera o projeto Certifica ESG com o compromisso de transformar a realidade da agricultura familiar. Através da educação, tecnologia e certificação, construímos pontes entre o homem do campo e um mercado que valoriza a vida, a terra e o futuro.
                </p>

                <div className="grid grid-cols-3 gap-8 border-t border-gray-100 pt-8">
                  <div>
                    <span className="block text-3xl font-bold text-green-600 mb-1">+1k</span>
                    <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">Famílias</span>
                  </div>
                  <div>
                    <span className="block text-3xl font-bold text-green-600 mb-1">100%</span>
                    <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">Gratuito</span>
                  </div>
                  <div>
                    <span className="block text-3xl font-bold text-green-600 mb-1">ESG</span>
                    <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">Compliance</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <span className="font-bold text-gray-900">Certifica ESG AgriFamiliar</span>
            <p className="text-sm text-gray-500 mt-1">Desenvolvendo sementes de cidadania.</p>
          </div>
          <div className="text-sm text-gray-400">
            © {new Date().getFullYear()} IDC. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
