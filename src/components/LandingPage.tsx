import React, { useEffect, useState } from "react";
import {
  Leaf,
  Shield,
  Users,
  ArrowRight,
  CheckCircle,
  BarChart3,
  Globe,
  Building2,
  LogIn,
  Sprout,
  Star
} from "lucide-react";
import Button from "./Button";

import IDCLogo from "../assets/LogoDespertarCidadania.png";

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
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-stone-50 text-stone-900 selection:bg-green-100 selection:text-green-900">
      {/* Navbar */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? "bg-white/90 backdrop-blur-xl border-b border-stone-100 shadow-sm py-2" : "bg-transparent py-4"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="bg-gradient-to-br from-green-600 to-emerald-700 p-3 rounded-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg shadow-green-900/20">
                <Leaf className="w-8 h-8 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-2xl tracking-tight text-stone-800 leading-none">
                  Certifica <span className="text-green-600">ESG</span>
                </span>
                <span className="text-sm font-medium text-stone-500 tracking-widest uppercase group-hover:text-green-600 transition-colors duration-300">
                  AgriFamiliar
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={onOpenLogin}
                leftIcon={<LogIn className="w-4 h-4" />}
                className="hidden sm:flex hover:bg-white/50"
              >
                Entrar
              </Button>
              <Button
                variant="dark"
                onClick={onOpenFarmerRegister}
                className="shadow-xl shadow-stone-900/20 hover:shadow-stone-900/30 transition-all"
              >
                Começar Agora
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
          <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-green-400/10 rounded-full blur-[100px] mix-blend-multiply animate-blob" />
          <div className="absolute top-40 -left-20 w-[500px] h-[500px] bg-amber-300/10 rounded-full blur-[100px] mix-blend-multiply animate-blob animation-delay-2000" />
          <div className="absolute bottom-0 left-1/3 w-[600px] h-[600px] bg-emerald-400/10 rounded-full blur-[100px] mix-blend-multiply animate-blob animation-delay-4000" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-5xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-green-100 text-green-700 text-sm font-bold mb-8 animate-fade-in-up shadow-sm hover:shadow-md transition-shadow cursor-default">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
              </span>
              Certificação Digital para Agricultura Familiar
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-stone-900 mb-8 leading-[1.1] animate-fade-in-up animation-delay-100">
              Sustentabilidade que <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-emerald-500 to-green-600 animate-gradient-x">
                valoriza sua terra
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-stone-500 mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in-up animation-delay-200 font-medium">
              Conectamos pequenos produtores a certificações ESG globais.
              Aumente sua renda, proteja o meio ambiente e acesse novos mercados.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up animation-delay-300">
              <Button
                variant="primary"
                size="lg"
                onClick={onOpenFarmerRegister}
                rightIcon={<ArrowRight className="w-5 h-5" />}
                className="text-lg px-8 py-4 shadow-xl shadow-green-900/20 hover:shadow-green-900/30 hover:-translate-y-1 transition-all duration-300"
              >
                Certificar Minha Propriedade
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  const element = document.getElementById("como-funciona");
                  element?.scrollIntoView({ behavior: "smooth" });
                }}
                className="text-lg px-8 py-4 bg-white hover:bg-stone-50 border-stone-200"
              >
                Como Funciona
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-white border-y border-stone-100 py-12 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: "Hectares Preservados", value: "12.5k+", icon: <Leaf className="w-5 h-5 text-green-500" /> },
              { label: "Famílias Beneficiadas", value: "2.400+", icon: <Users className="w-5 h-5 text-blue-500" /> },
              { label: "Auditores Credenciados", value: "150+", icon: <Shield className="w-5 h-5 text-amber-500" /> },
              { label: "Municípios Atendidos", value: "48", icon: <Globe className="w-5 h-5 text-purple-500" /> },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center gap-2 group">
                <div className="flex items-center gap-2 text-stone-400 mb-1 group-hover:text-stone-600 transition-colors">
                  {stat.icon}
                  <span className="text-sm font-medium uppercase tracking-wider">{stat.label}</span>
                </div>
                <span className="text-4xl font-bold text-stone-900">{stat.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Partners / Trusted By */}
      <div className="py-12 bg-stone-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-stone-400 text-sm font-semibold uppercase tracking-widest mb-8">Apoiado por organizações líderes</p>
          <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            {/* Placeholder Logos using text for now */}
            {["Embrapa", "Sebrae", "Ministério da Agricultura", "Banco do Brasil", "CNA"].map((partner, i) => (
              <span key={i} className="text-xl font-bold text-stone-800 flex items-center gap-2">
                <Building2 className="w-6 h-6" /> {partner}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Actions */}
      <main className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-30"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Agricultor Card */}
            <div className="bg-gradient-to-b from-stone-50 to-white rounded-[2rem] p-10 border border-stone-100 shadow-xl shadow-stone-200/50 hover:shadow-2xl hover:shadow-green-900/10 hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none group-hover:bg-green-500/10 transition-colors duration-500"></div>

              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-inner">
                <Sprout className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-4xl font-bold text-stone-900 mb-4 tracking-tight">Sou Agricultor(a)</h2>
              <p className="text-stone-500 mb-10 font-medium text-lg leading-relaxed">
                Cadastre sua propriedade, registre sua produção e obtenha certificações que valorizam seu produto no mercado.
              </p>
              <ul className="space-y-4 mb-10">
                {[
                  "Acesso a crédito rural facilitado",
                  "Valorização de até 30% no produto",
                  "Conexão direta com compradores"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-stone-600">
                    <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button
                variant="primary"
                fullWidth
                size="lg"
                onClick={onOpenFarmerRegister}
                rightIcon={<ArrowRight className="w-5 h-5" />}
                className="shadow-lg shadow-green-900/10"
              >
                Fazer Cadastro Gratuito
              </Button>
            </div>

            {/* Auditor Card */}
            <div className="bg-gradient-to-b from-stone-50 to-white rounded-[2rem] p-10 border border-stone-100 shadow-xl shadow-stone-200/50 hover:shadow-2xl hover:shadow-stone-900/10 hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-stone-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none group-hover:bg-stone-500/10 transition-colors duration-500"></div>

              <div className="w-16 h-16 bg-stone-200 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500 shadow-inner">
                <Shield className="w-8 h-8 text-stone-700" />
              </div>
              <h2 className="text-4xl font-bold text-stone-900 mb-4 tracking-tight">Sou Auditor(a)</h2>
              <p className="text-stone-500 mb-10 font-medium text-lg leading-relaxed">
                Solicite seu credenciamento, realize vistorias técnicas e ajude a transformar a agricultura familiar.
              </p>
              <ul className="space-y-4 mb-10">
                {[
                  "Renda extra com vistorias",
                  "Flexibilidade de horário",
                  "Capacitação técnica gratuita"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-stone-600">
                    <CheckCircle className="w-5 h-5 text-stone-500 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button
                variant="dark"
                fullWidth
                size="lg"
                onClick={onOpenAuditorRegister}
                rightIcon={<ArrowRight className="w-5 h-5" />}
                className="shadow-lg shadow-stone-900/10"
              >
                Solicitar Credenciamento
              </Button>
            </div>
          </div>

          {/* IDC Section - Improved */}
          <div className="mt-32 mb-0">
            <div className="bg-white rounded-[2.5rem] p-12 lg:p-20 border border-stone-100 shadow-2xl shadow-stone-200/50 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-50 rounded-full blur-3xl opacity-50 -mr-20 -mt-20"></div>

              <div className="max-w-7xl mx-auto relative z-10">
                <div className="grid md:grid-cols-2 gap-16 items-center">
                  <div className="order-2 md:order-1">
                    <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-1.5 rounded-full mb-8 font-bold text-xs uppercase tracking-widest border border-green-100">
                      <Building2 className="w-4 h-4" />
                      Instituto Despertar da Cidadania
                    </div>
                    <h3 className="text-4xl md:text-5xl font-bold text-stone-900 mb-6 leading-tight">
                      A autoridade por trás do seu <span className="text-green-600">selo de qualidade</span>.
                    </h3>
                    <p className="text-stone-500 text-lg mb-10 leading-relaxed">
                      O IDC (Instituto Despertar da Cidadania) é a entidade certificadora oficial, garantindo que cada selo emitido represente conformidade real com os padrões internacionais de ESG.
                    </p>
                    <ul className="space-y-4 mb-10">
                      {[
                        "Reconhecimento Nacional",
                        "Auditorias Padronizadas",
                        "Suporte ao Produtor Rural",
                      ].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-stone-700 font-medium text-lg">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={() => window.open("https://idc.org.br", "_blank")}
                      rightIcon={<Globe className="w-5 h-5" />}
                    >
                      Acessar Site do IDC
                    </Button>
                  </div>

                  <div className="order-1 md:order-2 flex justify-center">
                    <div className="relative group">
                      <div className="absolute inset-0 bg-green-200 blur-[60px] opacity-20 group-hover:opacity-30 transition-opacity"></div>
                      <div className="bg-white rounded-[3rem] p-12 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border-8 border-stone-50 relative z-10 w-80 h-80 flex items-center justify-center transform group-hover:scale-105 transition-transform duration-500">
                        {/* Logo Container - Clean and Centered */}
                        <img
                          src={IDCLogo}
                          alt="Logo IDC"
                          className="w-full h-auto max-w-[200px] object-contain drop-shadow-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section id="como-funciona" className="py-32 bg-stone-50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl font-bold text-stone-900 mb-6 tracking-tight">Como funciona o processo?</h2>
            <p className="text-stone-500 text-xl leading-relaxed">
              Simplificamos a certificação em 3 passos claros, do cadastro à emissão do selo, para que você foque no que importa: produzir.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                icon: <Users className="w-8 h-8 text-green-600" />,
                title: "1. Cadastro Simples",
                desc: "Crie sua conta e registre os dados da sua propriedade rural em poucos minutos.",
              },
              {
                icon: <Shield className="w-8 h-8 text-green-600" />,
                title: "2. Auditoria Técnica",
                desc: "Receba a visita de um auditor credenciado para validar suas práticas sustentáveis.",
              },
              {
                icon: <BarChart3 className="w-8 h-8 text-green-600" />,
                title: "3. Certificação & Gestão",
                desc: "Obtenha o selo ESG e acesse o painel completo para gerenciar sua produção.",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="bg-white p-10 rounded-[2rem] shadow-sm border border-stone-100 hover:shadow-2xl hover:shadow-stone-200/50 hover:-translate-y-2 transition-all duration-300 group"
              >
                <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-stone-900 mb-4">{feature.title}</h3>
                <p className="text-stone-500 leading-relaxed text-lg">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-stone-900 mb-6 tracking-tight">O que dizem nossos produtores</h2>
              <p className="text-stone-500 text-lg leading-relaxed mb-8">
                Histórias reais de quem já transformou sua produção com a certificação ESG.
              </p>
              <div className="flex gap-4">
                <Button variant="outline">Ver mais histórias</Button>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-green-100 rounded-full blur-3xl opacity-50"></div>
              <div className="bg-stone-50 p-8 rounded-[2rem] border border-stone-100 relative">
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-5 h-5 text-amber-400 fill-amber-400" />)}
                </div>
                <p className="text-stone-700 text-lg italic mb-6">
                  "Depois da certificação, consegui vender meu café por um preço 30% maior para exportação. O processo foi muito mais simples do que eu imaginava."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-stone-200 rounded-full overflow-hidden">
                    {/* Placeholder Avatar */}
                    <div className="w-full h-full bg-stone-300 flex items-center justify-center text-stone-500 font-bold">AS</div>
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-900">Antônio Silva</h4>
                    <p className="text-sm text-stone-500">Produtor de Café - MG</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400 py-16 border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-stone-800 p-2.5 rounded-xl border border-stone-700">
                  <Leaf className="w-6 h-6 text-green-500" />
                </div>
                <span className="font-bold text-white text-xl tracking-tight">Certifica ESG</span>
              </div>
              <p className="text-stone-500 max-w-sm">
                Plataforma líder em certificação digital para agricultura familiar. Conectando o campo ao futuro sustentável.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Plataforma</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-green-400 transition-colors">Para Agricultores</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Para Auditores</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Como Funciona</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Preços</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-green-400 transition-colors">Termos de Uso</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Privacidade</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Contato</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-stone-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-medium text-stone-600">
            <div>© 2024 Certifica ESG AgriFamiliar. Todos os direitos reservados.</div>
            <div className="flex gap-6">
              <a href="#" className="hover:text-stone-400">Instagram</a>
              <a href="#" className="hover:text-stone-400">LinkedIn</a>
              <a href="#" className="hover:text-stone-400">Facebook</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
