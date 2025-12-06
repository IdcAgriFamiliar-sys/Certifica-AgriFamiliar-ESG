import React, { useState } from "react";
import FileUploadZone from "./FileUploadZone";
import { ArrowRight, ArrowLeft, CheckCircle, Sprout, AlertCircle } from "lucide-react";
import Button from "./Button";
import { collection, addDoc, serverTimestamp, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "../services/firebase";
import { signInAnonymously } from "firebase/auth";
import { uploadFiles } from "../services/storage";
import StepIndicator from "./StepIndicator";
import FarmBg from "../assets/farm-background.png";

const steps = [
  { id: 1, label: "Identificação" },
  { id: 2, label: "Propriedade" },
  { id: 3, label: "Diagnóstico" },
  { id: 4, label: "Documentos" },
];

const FarmerRegistrationForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState('next'); // For animation (future)

  const [formData, setFormData] = useState({
    nome: "",
    nomePropriedade: "",
    email: "",
    telefone: "",
    cpf: "",
    caf: "",
    endereco: "",
    // Initial Diagnosis Fields (DSP - Diagnóstico Social e Produtivo)
    areaTotal: "",
    culturasPrincipais: "",
    maoDeObraFamiliar: "sim",
    usoAgrotoxicos: "nao",
    areaPreservacao: "sim",
  });

  const [rgCpfFiles, setRgCpfFiles] = useState<File[]>([]);
  const [cafFiles, setCafFiles] = useState<File[]>([]);
  const [enderecoFiles, setEnderecoFiles] = useState<File[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [isTestMode, setIsTestMode] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const fillTestData = () => {
    setFormData({
      nome: "Agricultor Teste " + Math.floor(Math.random() * 1000),
      nomePropriedade: "Sítio Teste",
      email: `teste${Math.floor(Math.random() * 1000)}@exemplo.com`,
      telefone: "11999999999",
      cpf: "123.456.789-00",
      caf: "CAF123456",
      endereco: "Rua dos Testes, 123, Cidade Teste - TS",
      areaTotal: "10",
      culturasPrincipais: "Milho, Soja",
      maoDeObraFamiliar: "sim",
      usoAgrotoxicos: "nao",
      areaPreservacao: "sim",
    });
    setIsTestMode(true);
  };

  const validateStep = (step: number) => {
    if (step === 1) {
      if (!formData.nome.trim()) return "Nome é obrigatório.";
      if (!formData.email.trim()) return "E-mail é obrigatório.";
      if (!formData.cpf.trim()) return "CPF é obrigatório.";
      if (!formData.caf.trim()) return "CAF é obrigatório.";
    }
    if (step === 2) {
      if (!formData.nomePropriedade.trim()) return "Nome da Propriedade é obrigatório.";
    }
    return null;
  };

  const nextStep = async () => {
    const error = validateStep(currentStep);
    if (error) return alert(error);

    // Email Validation on Step 1
    if (currentStep === 1) {
      setLoading(true); // Reusing loading state for feedback, though strictly it's for submit usually
      try {
        const q = query(collection(db, "farmers"), where("email", "==", formData.email));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          alert("Já existe um processo em andamento com este e-mail.");
          setLoading(false);
          return;
        }
      } catch (err) {
        console.error("Erro ao validar email:", err);
        // Fallback or alert? Let's alert but maybe allow proceed if it's just connectivity? 
        // Safer to block to prevent duplicates, or ask user to try again.
        alert("Erro ao verificar email. Tente novamente.");
        setLoading(false);
        return;
      }
      setLoading(false);
    }

    setDirection('next');
    setCurrentStep(prev => Math.min(prev + 1, steps.length));
    window.scrollTo(0, 0);
  };

  const prevStep = () => {
    setDirection('prev');
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Final Validation?

    setLoading(true);
    setLoadingMessage("Iniciando...");

    try {
      // Ensure user is authenticated (anonymously) for Firestore write permissions
      if (!auth.currentUser) {
        setLoadingMessage("Autenticando...");
        try {
          await signInAnonymously(auth);
        } catch (authError: any) {
          console.error("Anonymous auth failed:", authError);
          throw new Error(`Falha na autenticação anônima: ${authError.message}`);
        }
      }

      // 1. Upload Files
      let rgCpfUrls: string[] = [];
      let cafUrls: string[] = [];
      let enderecoUrls: string[] = [];

      if (isTestMode) {
        setLoadingMessage("Modo Teste: Simulando upload...");
        await new Promise(resolve => setTimeout(resolve, 1000)); // Fake delay
        rgCpfUrls = ["https://via.placeholder.com/150"];
        cafUrls = ["https://via.placeholder.com/150"];
      } else {
        setLoadingMessage("Enviando arquivos...");
        const basePath = `farmers/${formData.email}`;

        try {
          if (rgCpfFiles.length > 0) rgCpfUrls = await uploadFiles(rgCpfFiles, `${basePath}/docs`);
          if (cafFiles.length > 0) cafUrls = await uploadFiles(cafFiles, `${basePath}/docs`);
          if (enderecoFiles.length > 0) enderecoUrls = await uploadFiles(enderecoFiles, `${basePath}/docs`);
        } catch (uploadError: any) {
          console.error("File upload failed:", uploadError);
          // Don't block registration for upload errors if they are optional? 
          // For now, let's warn but proceed? Or block? 
          // Let's block to be safe, but improve error message.
          throw new Error(`Falha no envio de arquivos: ${uploadError.message}. Verifique sua conexão.`);
        }
      }

      // 2. Prepare Data
      setLoadingMessage("Salvando dados...");
      const farmerData = {
        ...formData,
        proprietario: formData.nome, // Map for Dashboard consistency
        localizacao: formData.endereco, // Map for Dashboard consistency
        documents: {
          rgCpf: rgCpfUrls,
          caf: cafUrls,
          endereco: enderecoUrls,
        },
        status: "Pendente", // Initial status
        createdAt: serverTimestamp(),
        // Structure for auto-fill in Audit
        diagnosisData: {
          dsp: {
            areaTotal: formData.areaTotal,
            culturasPrincipais: formData.culturasPrincipais,
            maoDeObraFamiliar: formData.maoDeObraFamiliar,
            usoAgrotoxicos: formData.usoAgrotoxicos,
            areaPreservacao: formData.areaPreservacao
          }
        }
      };

      // 3. Save to Firestore
      console.log("Saving to Firestore...", farmerData);

      // 3. Save to Firestore
      console.log("Saving to Firestore...", farmerData);

      try {
        await addDoc(collection(db, "farmers"), farmerData);
        console.log("Firestore save successful");
      } catch (firestoreError: any) {
        console.error("Firestore save failed:", firestoreError);
        throw firestoreError; // Re-throw only actual errors
      }

      setSubmitted(true);
    } catch (error: any) {
      console.error("Error registering farmer:", error);
      let errorMessage = "Erro ao enviar cadastro. Tente novamente.";
      if (error.code === 'auth/admin-restricted-operation') {
        errorMessage = "Erro de Configuração: O Login Anônimo não está ativado no Firebase Console.";
      } else if (error.message) {
        errorMessage = `Erro: ${error.message}`;
      }
      alert(errorMessage);
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
                  className="w-full p-4 bg-stone-50 border-2 border-stone-100 rounded-xl focus:border-green-500 focus:bg-white outline-none transition-all font-medium text-stone-700"
                  placeholder="Seu nome completo"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-1 block">CPF</label>
                <input
                  name="cpf"
                  value={formData.cpf}
                  onChange={handleChange}
                  className="w-full p-4 bg-stone-50 border-2 border-stone-100 rounded-xl focus:border-green-500 focus:bg-white outline-none transition-all font-medium text-stone-700"
                  placeholder="000.000.000-00"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-1 block">CAF</label>
                <input
                  name="caf"
                  value={formData.caf}
                  onChange={handleChange}
                  className="w-full p-4 bg-stone-50 border-2 border-stone-100 rounded-xl focus:border-green-500 focus:bg-white outline-none transition-all font-medium text-stone-700"
                  placeholder="Número do CAF"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-1 block">E-mail</label>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-4 bg-stone-50 border-2 border-stone-100 rounded-xl focus:border-green-500 focus:bg-white outline-none transition-all font-medium text-stone-700"
                  placeholder="seu@email.com"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-1 block">Telefone / WhatsApp</label>
                <input
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleChange}
                  className="w-full p-4 bg-stone-50 border-2 border-stone-100 rounded-xl focus:border-green-500 focus:bg-white outline-none transition-all font-medium text-stone-700"
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
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-1 block">Nome da Propriedade</label>
                <input
                  name="nomePropriedade"
                  value={formData.nomePropriedade}
                  onChange={handleChange}
                  className="w-full p-4 bg-stone-50 border-2 border-stone-100 rounded-xl focus:border-green-500 focus:bg-white outline-none transition-all font-medium text-stone-700"
                  placeholder="Ex: Sítio Recanto Feliz"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-1 block">Endereço Completo</label>
                <input
                  name="endereco"
                  value={formData.endereco}
                  onChange={handleChange}
                  className="w-full p-4 bg-stone-50 border-2 border-stone-100 rounded-xl focus:border-green-500 focus:bg-white outline-none transition-all font-medium text-stone-700"
                  placeholder="Rua, Número, Bairro, Cidade - UF"
                />
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-5 animate-fade-in-up">
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-1 block">Área Total (Hectares)</label>
                <input
                  name="areaTotal"
                  type="number"
                  value={formData.areaTotal}
                  onChange={handleChange}
                  className="w-full p-4 bg-stone-50 border-2 border-stone-100 rounded-xl focus:border-green-500 focus:bg-white outline-none transition-all font-medium text-stone-700"
                  placeholder="Ex: 10"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-1 block">Mão de Obra Familiar?</label>
                <select
                  name="maoDeObraFamiliar"
                  value={formData.maoDeObraFamiliar}
                  onChange={handleChange}
                  className="w-full p-4 bg-stone-50 border-2 border-stone-100 rounded-xl focus:border-green-500 focus:bg-white outline-none transition-all font-medium text-stone-700 appearance-none bg-white"
                >
                  <option value="sim">Sim</option>
                  <option value="nao">Não</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-1 block">Principais Culturas</label>
                <input
                  name="culturasPrincipais"
                  value={formData.culturasPrincipais}
                  onChange={handleChange}
                  className="w-full p-4 bg-stone-50 border-2 border-stone-100 rounded-xl focus:border-green-500 focus:bg-white outline-none transition-all font-medium text-stone-700"
                  placeholder="Ex: Milho, Café, Hortaliças"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-1 block">Área de Preservação?</label>
                <select
                  name="areaPreservacao"
                  value={formData.areaPreservacao}
                  onChange={handleChange}
                  className="w-full p-4 bg-stone-50 border-2 border-stone-100 rounded-xl focus:border-green-500 focus:bg-white outline-none transition-all font-medium text-stone-700 appearance-none bg-white"
                >
                  <option value="sim">Sim</option>
                  <option value="nao">Não</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-1 block">Uso de Agrotóxicos?</label>
                <select
                  name="usoAgrotoxicos"
                  value={formData.usoAgrotoxicos}
                  onChange={handleChange}
                  className="w-full p-4 bg-stone-50 border-2 border-stone-100 rounded-xl focus:border-green-500 focus:bg-white outline-none transition-all font-medium text-stone-700 appearance-none bg-white"
                >
                  <option value="nao">Não (Orgânico/Agroecológico)</option>
                  <option value="sim_pouco">Sim, pouco</option>
                  <option value="sim_muito">Sim, regular</option>
                </select>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6 animate-fade-in-up">
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex gap-3 text-amber-800 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p>Você pode pular esta etapa e enviar os documentos pelo Painel depois.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <FileUploadZone
                label="RG ou CNH"
                accept=".pdf,.jpg,.png"
                multiple
                onFilesSelected={setRgCpfFiles}
              />
              <FileUploadZone
                label="Documento do CAF"
                accept=".pdf"
                onFilesSelected={setCafFiles}
              />
              <div className="md:col-span-2">
                <FileUploadZone
                  label="Comprovante de Endereço (Opcional)"
                  accept=".pdf,.jpg,.png"
                  onFilesSelected={setEnderecoFiles}
                />
              </div>
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
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-emerald-600"></div>
          <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce-slow">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-stone-900 mb-3">Tudo Pronto!</h2>
          <p className="text-stone-500 mb-8 text-lg">
            Seu cadastro foi recebido com sucesso. <br />
            Vamos analisar e entrar em contato.
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
    <div className="min-h-screen flex bg-white font-sans selection:bg-green-100">
      {/* Left Panel - Image */}
      <div className="hidden lg:block w-5/12 relative overflow-hidden bg-stone-900">
        <div className="absolute inset-0 bg-black/20 z-10"></div>
        <img
          src={FarmBg}
          alt="Fazenda Sustentável"
          className="w-full h-full object-cover opacity-90 scale-105 hover:scale-110 transition-transform duration-[20s]"
        />
        <div className="absolute bottom-0 left-0 right-0 p-12 z-20 text-white bg-gradient-to-t from-black/80 to-transparent">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-green-500 p-2 rounded-lg">
              <Sprout className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">Certifica ESG</span>
          </div>
          <blockquote className="text-2xl font-light leading-relaxed mb-4">
            "A certificação que valoriza quem produz e protege o futuro."
          </blockquote>
          <p className="text-white/60 text-sm font-medium uppercase tracking-widest">Plataforma Oficial AgriFamiliar</p>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <div className="px-8 py-6 border-b border-stone-100 flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-30">
          <div className="lg:hidden flex items-center gap-2">
            <div className="bg-green-600 p-1.5 rounded-lg">
              <Sprout className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-stone-800">Certifica ESG</span>
          </div>

          <div className="hidden lg:block">
            <h2 className="text-xl font-bold text-stone-800">Cadastro de Produtor</h2>
            <p className="text-sm text-stone-400">Junte-se a nossa rede sustentável</p>
          </div>

          <button onClick={fillTestData} className="text-xs font-bold text-stone-300 hover:text-green-600 transition-colors uppercase tracking-wider">
            Auto-Preencher
          </button>
        </div>

        {/* Scrollable Content */}
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
                    <Button type="submit" variant="primary" isLoading={loading} fullWidth rightIcon={<CheckCircle className="w-5 h-5" />}>
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

export default FarmerRegistrationForm;
