import React, { useState } from "react";
import FileUploadZone from "./FileUploadZone";
import { Sprout, CheckCircle } from "lucide-react";
import Button from "./Button";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../services/firebase";
import { signInAnonymously } from "firebase/auth";
import { uploadFiles } from "../services/storage";

const FarmerRegistrationForm: React.FC = () => {
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

  const validate = () => {
    if (!formData.nome.trim()) return "Nome é obrigatório.";
    if (!formData.nomePropriedade.trim()) return "Nome da Propriedade é obrigatório.";
    if (!formData.email.trim()) return "E-mail é obrigatório.";
    if (!formData.cpf.trim()) return "CPF é obrigatório.";
    if (!formData.caf.trim()) return "Número do CAF é obrigatório.";

    if (!isTestMode) {
      if (rgCpfFiles.length === 0) return "Anexe RG/CPF (arquivo).";
      if (cafFiles.length === 0) return "Anexe o CAF (arquivo).";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) return alert(err);

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
        setLoadingMessage("Enviando arquivos (pode demorar um pouco)...");
        const basePath = `farmers/${formData.email}`;

        try {
          console.log("Starting file uploads...");
          rgCpfUrls = await uploadFiles(rgCpfFiles, `${basePath}/docs`);
          console.log("RG/CPF uploaded");
          cafUrls = await uploadFiles(cafFiles, `${basePath}/docs`);
          console.log("CAF uploaded");
          enderecoUrls = await uploadFiles(enderecoFiles, `${basePath}/docs`);
          console.log("Address uploaded");
        } catch (uploadError: any) {
          console.error("File upload failed:", uploadError);
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

      // Create a timeout promise (Increased to 60s)
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Tempo limite de conexão excedido (60s). Verifique sua internet.")), 60000)
      );

      // Race between addDoc and timeout
      try {
        await Promise.race([
          addDoc(collection(db, "farmers"), farmerData),
          timeoutPromise
        ]);
        console.log("Firestore save successful");
      } catch (firestoreError: any) {
        console.error("Firestore save failed:", firestoreError);
        throw firestoreError; // Re-throw to be caught by outer catch
      }

      setSubmitted(true);
    } catch (error: any) {
      console.error("Error registering farmer:", error);

      let errorMessage = "Erro ao enviar cadastro. Tente novamente.";

      if (error.code === 'auth/admin-restricted-operation') {
        errorMessage = "Erro de Configuração: O Login Anônimo não está ativado no Firebase Console. Ative-o em Authentication > Sign-in method.";
      } else if (error.code === 'unavailable' || error.message.includes('offline')) {
        errorMessage = "Erro de Conexão: Verifique sua internet. O sistema tentará salvar quando estiver online.";
      } else if (error.message) {
        errorMessage = `Erro: ${error.message}`;
      }

      alert(errorMessage);
    } finally {
      setLoading(false);
      setLoadingMessage("");
    }
  };



  if (submitted) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-lg w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-stone-900 mb-2">Cadastro Recebido!</h2>
          <p className="text-stone-500 mb-8">
            Obrigado por se cadastrar. Nossa equipe analisará seus documentos e entrará em contato pelo email <strong>{formData.email}</strong> em até 48 horas.
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
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-3xl shadow-xl shadow-stone-200/50 overflow-hidden border border-stone-100">
        <div className="bg-green-600 p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 opacity-10 transform translate-x-10 -translate-y-10">
            <Sprout className="w-64 h-64" />
          </div>
          <div className="relative z-10 flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-bold mb-2">Cadastro de Agricultor(a)</h2>
              <p className="text-green-100">Junte-se a milhares de produtores certificados e valorize sua produção.</p>
            </div>
            <button
              type="button"
              onClick={fillTestData}
              className="bg-white/20 hover:bg-white/30 text-white text-xs px-3 py-1 rounded-lg backdrop-blur-sm transition-colors"
            >
              Preencher Teste
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-8">
          {/* Dados Pessoais */}
          <section>
            <h3 className="text-lg font-bold text-stone-800 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-green-700 text-sm">1</span>
              Dados Pessoais
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-stone-700 mb-1">Nome Completo</label>
                <input
                  name="nome"
                  placeholder="Ex: João da Silva"
                  value={formData.nome}
                  onChange={handleChange}
                  className="w-full p-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-stone-700 mb-1">Nome da Propriedade</label>
                <input
                  name="nomePropriedade"
                  placeholder="Ex: Sítio Recanto Verde"
                  value={formData.nomePropriedade}
                  onChange={handleChange}
                  className="w-full p-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">E-mail</label>
                <input
                  name="email"
                  type="email"
                  placeholder="Ex: joao@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Telefone / WhatsApp</label>
                <input
                  name="telefone"
                  placeholder="(00) 00000-0000"
                  value={formData.telefone}
                  onChange={handleChange}
                  className="w-full p-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">CPF</label>
                <input
                  name="cpf"
                  placeholder="000.000.000-00"
                  value={formData.cpf}
                  onChange={handleChange}
                  className="w-full p-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Número do CAF</label>
                <input
                  name="caf"
                  placeholder="Registro CAF"
                  value={formData.caf}
                  onChange={handleChange}
                  className="w-full p-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-stone-700 mb-1">Endereço da Propriedade</label>
                <input
                  name="endereco"
                  placeholder="Rua, Número, Bairro, Cidade - UF"
                  value={formData.endereco}
                  onChange={handleChange}
                  className="w-full p-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>
          </section>

          <hr className="border-stone-100" />

          {/* Diagnóstico Inicial */}
          <section>
            <h3 className="text-lg font-bold text-stone-800 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-700 text-sm">2</span>
              Diagnóstico Inicial da Propriedade
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Área Total (hectares)</label>
                <input
                  name="areaTotal"
                  type="number"
                  placeholder="Ex: 5"
                  value={formData.areaTotal}
                  onChange={handleChange}
                  className="w-full p-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Principais Culturas</label>
                <input
                  name="culturasPrincipais"
                  placeholder="Ex: Milho, Feijão, Mandioca"
                  value={formData.culturasPrincipais}
                  onChange={handleChange}
                  className="w-full p-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Utiliza Mão de Obra Familiar?</label>
                <select
                  name="maoDeObraFamiliar"
                  value={formData.maoDeObraFamiliar}
                  onChange={handleChange}
                  className="w-full p-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white"
                >
                  <option value="sim">Sim</option>
                  <option value="nao">Não</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Possui Área de Preservação?</label>
                <select
                  name="areaPreservacao"
                  value={formData.areaPreservacao}
                  onChange={handleChange}
                  className="w-full p-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white"
                >
                  <option value="sim">Sim</option>
                  <option value="nao">Não</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-stone-700 mb-1">Utiliza Agrotóxicos Químicos?</label>
                <select
                  name="usoAgrotoxicos"
                  value={formData.usoAgrotoxicos}
                  onChange={handleChange}
                  className="w-full p-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white"
                >
                  <option value="nao">Não, produção orgânica/agroecológica</option>
                  <option value="sim_pouco">Sim, em pequena quantidade</option>
                  <option value="sim_muito">Sim, uso regular</option>
                </select>
              </div>
            </div>
          </section>

          <hr className="border-stone-100" />

          {/* Documentação */}
          <section>
            <h3 className="text-lg font-bold text-stone-800 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-green-700 text-sm">3</span>
              Documentação
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <FileUploadZone
                label="RG ou CNH (Frente e Verso) *"
                accept=".pdf,.jpg,.png"
                multiple
                onFilesSelected={setRgCpfFiles}
              />
              <FileUploadZone
                label="Cópia do CAF *"
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
          </section>

          <div className="flex gap-4 justify-end pt-4">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={loading}
              rightIcon={!loading ? <CheckCircle className="w-5 h-5" /> : undefined}
            >
              {loading ? loadingMessage : "Enviar Cadastro"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FarmerRegistrationForm;
