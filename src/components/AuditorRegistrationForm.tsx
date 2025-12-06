import React, { useState } from "react";
import FileUploadZone from "./FileUploadZone";
import { ArrowRight, ArrowLeft, CheckCircle, Shield, AlertCircle } from "lucide-react";
import Button from "./Button";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../services/firebase";
import { signInAnonymously } from "firebase/auth";
import { uploadFiles } from "../services/storage";
import StepIndicator from "./StepIndicator";
import FarmBg from "../assets/farm-background.png";

const steps = [
  { id: 1, label: "Identificação" },
  { id: 2, label: "Formação" },
  { id: 3, label: "Documentos" },
];

const AuditorRegistrationForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    cpf: "",
    conselhoClasse: "",
    numeroRegistro: "",
    graduacao: "",
    posGraduacao: "",
    mestradoDoutorado: "",
    experiencia: "",
  });

  const [rgCpfFiles, setRgCpfFiles] = useState<File[]>([]);
  const [conselhoFiles, setConselhoFiles] = useState<File[]>([]);
  const [diplomaFiles, setDiplomaFiles] = useState<File[]>([]);
  const [cvFiles, setCvFiles] = useState<File[]>([]);

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateStep = (step: number) => {
    if (step === 1) {
      if (!formData.nome.trim()) return "Nome é obrigatório.";
      if (!formData.email.trim()) return "E-mail é obrigatório.";
      if (!formData.cpf.trim()) return "CPF é obrigatório.";
    }
    if (step === 2) {
      if (!formData.conselhoClasse.trim()) return "Conselho de Classe é obrigatório.";
      if (!formData.numeroRegistro.trim()) return "Número de Registro é obrigatório.";
      if (!formData.graduacao.trim()) return "Graduação é obrigatório.";
    }
    return null;
  };

  const nextStep = () => {
    const error = validateStep(currentStep);
    if (error) return alert(error);
    setCurrentStep(prev => Math.min(prev + 1, steps.length));
    window.scrollTo(0, 0);
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Final Validations for Docs
    if (rgCpfFiles.length === 0) return alert("Anexe RG/CPF (arquivo).");
    if (conselhoFiles.length === 0) return alert("Anexe a Carteira do Conselho (arquivo).");
    if (diplomaFiles.length === 0) return alert("Anexe o Diploma de Graduação (arquivo).");

    setLoading(true);
    setLoadingMessage("Iniciando...");

    try {
      if (!auth.currentUser) {
        setLoadingMessage("Autenticando...");
        await signInAnonymously(auth);
      }

      // 1. Upload Files
      setLoadingMessage("Enviando arquivos...");
      const basePath = `auditors/${formData.email}`;
      const rgCpfUrls = await uploadFiles(rgCpfFiles, `${basePath}/docs`);
      const conselhoUrls = await uploadFiles(conselhoFiles, `${basePath}/docs`);
      const diplomaUrls = await uploadFiles(diplomaFiles, `${basePath}/docs`);
      const cvUrls = await uploadFiles(cvFiles, `${basePath}/docs`);

      // 2. Prepare Data
      setLoadingMessage("Salvando dados...");
      const auditorData = {
        ...formData,
        documents: {
          rgCpf: rgCpfUrls,
          conselho: conselhoUrls,
          diploma: diplomaUrls,
          cv: cvUrls,
        },
        status: "Pendente",
        createdAt: serverTimestamp(),
      };

      // 3. Save to Firestore
      await addDoc(collection(db, "auditors"), auditorData);

      setSubmitted(true);
    } catch (error: any) {
      console.error("Error registering auditor:", error);
      alert(`Erro ao enviar solicitação: ${error.message || "Tente novamente."}`);
    } finally {
      setLoading(false);
      setLoadingMessage("");
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-5 animate-fade-in-up">
            <div className="grid md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-1 block">Nome Completo</label>
                <input
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  className="w-full p-4 bg-stone-50 border-2 border-stone-100 rounded-xl focus:border-purple-500 focus:bg-white outline-none transition-all font-medium text-stone-700"
                  placeholder="Ex: Dra. Ana Souza"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-1 block">CPF</label>
                <input
                  name="cpf"
                  value={formData.cpf}
                  onChange={handleChange}
                  className="w-full p-4 bg-stone-50 border-2 border-stone-100 rounded-xl focus:border-purple-500 focus:bg-white outline-none transition-all font-medium text-stone-700"
                  placeholder="000.000.000-00"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-1 block">E-mail</label>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-4 bg-stone-50 border-2 border-stone-100 rounded-xl focus:border-purple-500 focus:bg-white outline-none transition-all font-medium text-stone-700"
                  placeholder="ana@email.com"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-1 block">Telefone / WhatsApp</label>
                <input
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleChange}
                  className="w-full p-4 bg-stone-50 border-2 border-stone-100 rounded-xl focus:border-purple-500 focus:bg-white outline-none transition-all font-medium text-stone-700"
                  placeholder="(00) 00000-0000"
                />
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-5 animate-fade-in-up">
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-1 block">Conselho de Classe</label>
                <input
                  name="conselhoClasse"
                  value={formData.conselhoClasse}
                  onChange={handleChange}
                  className="w-full p-4 bg-stone-50 border-2 border-stone-100 rounded-xl focus:border-purple-500 focus:bg-white outline-none transition-all font-medium text-stone-700"
                  placeholder="Ex: CREA"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-1 block">Número de Registro</label>
                <input
                  name="numeroRegistro"
                  value={formData.numeroRegistro}
                  onChange={handleChange}
                  className="w-full p-4 bg-stone-50 border-2 border-stone-100 rounded-xl focus:border-purple-500 focus:bg-white outline-none transition-all font-medium text-stone-700"
                  placeholder="12345/D"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-1 block">Graduação</label>
                <input
                  name="graduacao"
                  value={formData.graduacao}
                  onChange={handleChange}
                  className="w-full p-4 bg-stone-50 border-2 border-stone-100 rounded-xl focus:border-purple-500 focus:bg-white outline-none transition-all font-medium text-stone-700"
                  placeholder="Ex: Engenharia Agronômica"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-1 block">Resumo da Experiência</label>
                <textarea
                  name="experiencia"
                  rows={3}
                  value={formData.experiencia}
                  onChange={handleChange}
                  className="w-full p-4 bg-stone-50 border-2 border-stone-100 rounded-xl focus:border-purple-500 focus:bg-white outline-none transition-all font-medium text-stone-700 h-24 resize-none"
                  placeholder="Breve resumo..."
                />
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6 animate-fade-in-up">
            <div className="bg-purple-50 border border-purple-200 p-4 rounded-xl flex gap-3 text-purple-800 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p>Para auditores, o envio de todos os documentos é obrigatório para análise do conselho.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <FileUploadZone
                label="RG ou CNH"
                accept=".pdf,.jpg,.png"
                multiple
                onFilesSelected={setRgCpfFiles}
              />
              <FileUploadZone
                label="Carteira do Conselho"
                accept=".pdf,.jpg,.png"
                onFilesSelected={setConselhoFiles}
              />
              <FileUploadZone
                label="Diploma de Graduação"
                accept=".pdf"
                onFilesSelected={setDiplomaFiles}
              />
              <FileUploadZone
                label="Curriculum Vitae"
                accept=".pdf"
                onFilesSelected={setCvFiles}
              />
            </div>
          </div>
        );
      default: return null;
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
        <div className="bg-white p-10 rounded-3xl shadow-2xl max-w-lg w-full text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-400 to-indigo-600"></div>
          <div className="w-24 h-24 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce-slow">
            <CheckCircle className="w-12 h-12 text-purple-600" />
          </div>
          <h2 className="text-3xl font-bold text-stone-900 mb-3">Solicitação Enviada!</h2>
          <p className="text-stone-500 mb-8 text-lg">
            Agradecemos seu interesse. O comitê técnico analisará suas credenciais e entrará em contato em breve.
          </p>
          <Button
            variant="dark"
            fullWidth
            onClick={() => window.location.reload()}
          >
            Voltar ao Início
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-white font-sans selection:bg-purple-100">
      {/* Left Panel */}
      <div className="hidden lg:block w-5/12 relative overflow-hidden bg-stone-900">
        <div className="absolute inset-0 bg-black/40 z-10 mix-blend-multiply"></div>
        <img
          src={FarmBg}
          alt="Background"
          className="w-full h-full object-cover opacity-80 scale-105 hover:scale-110 transition-transform duration-[20s] grayscale-[30%]"
        />
        <div className="absolute bottom-0 left-0 right-0 p-12 z-20 text-white bg-gradient-to-t from-black/90 to-transparent">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-purple-600 p-2 rounded-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">Certifica ESG</span>
          </div>
          <blockquote className="text-2xl font-light leading-relaxed mb-4">
            "Garantindo a integridade e a confiança do selo que transforma vidas."
          </blockquote>
          <p className="text-white/60 text-sm font-medium uppercase tracking-widest">Área de Credenciamento</p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <div className="px-8 py-6 border-b border-stone-100 flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-30">
          <div className="lg:hidden flex items-center gap-2">
            <div className="bg-purple-600 p-1.5 rounded-lg">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-stone-800">Certifica ESG</span>
          </div>

          <div className="hidden lg:block">
            <h2 className="text-xl font-bold text-stone-800">Credenciamento de Auditor</h2>
            <p className="text-sm text-stone-400">Junte-se ao nosso corpo técnico</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-2xl mx-auto px-6 py-8">
            <StepIndicator steps={steps} currentStep={currentStep} />

            <form onSubmit={handleSubmit} className="mt-8">
              <div className="min-h-[300px]">
                {renderStepContent()}
              </div>

              <div className="flex items-center justify-between pt-10 border-t border-stone-100 mt-10">
                <div className="w-32">
                  {currentStep > 1 && (
                    <button
                      type="button"
                      onClick={prevStep}
                      className="flex items-center gap-2 text-stone-500 font-bold hover:text-stone-800 transition-colors"
                    >
                      <ArrowLeft className="w-5 h-5" /> Voltar
                    </button>
                  )}
                </div>
                <div className="w-40">
                  {currentStep < steps.length ? (
                    <Button type="button" onClick={nextStep} fullWidth rightIcon={<ArrowRight className="w-5 h-5" />}>
                      Próximo
                    </Button>
                  ) : (
                    <Button type="submit" variant="dark" isLoading={loading} fullWidth rightIcon={<CheckCircle className="w-5 h-5" />}>
                      {loading ? loadingMessage : "Finalizar"}
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditorRegistrationForm;
