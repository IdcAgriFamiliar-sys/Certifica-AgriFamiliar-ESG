import React, { useState } from "react";
import FileUploadZone from "./FileUploadZone";
import { ArrowLeft, Shield, CheckCircle, AlertCircle, GraduationCap, FileText, Briefcase } from "lucide-react";
import Button from "./Button";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../services/firebase";
import { signInAnonymously } from "firebase/auth";
import { uploadFiles } from "../services/storage";

const AuditorRegistrationForm: React.FC = () => {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (!formData.nome.trim()) return "Nome é obrigatório.";
    if (!formData.email.trim()) return "E-mail é obrigatório.";
    if (!formData.cpf.trim()) return "CPF é obrigatório.";
    if (!formData.conselhoClasse.trim()) return "Conselho de Classe é obrigatório.";
    if (!formData.numeroRegistro.trim()) return "Número de Registro é obrigatório.";
    if (rgCpfFiles.length === 0) return "Anexe RG/CPF (arquivo).";
    if (conselhoFiles.length === 0) return "Anexe a Carteira do Conselho (arquivo).";
    if (diplomaFiles.length === 0) return "Anexe o Diploma de Graduação (arquivo).";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) return alert(err);

    setLoading(true);

    try {
      // Ensure user is authenticated (anonymously) for Firestore write permissions
      if (!auth.currentUser) {
        await signInAnonymously(auth);
      }

      // 1. Upload Files
      const basePath = `auditors/${formData.email}`;
      const rgCpfUrls = await uploadFiles(rgCpfFiles, `${basePath}/docs`);
      const conselhoUrls = await uploadFiles(conselhoFiles, `${basePath}/docs`);
      const diplomaUrls = await uploadFiles(diplomaFiles, `${basePath}/docs`);
      const cvUrls = await uploadFiles(cvFiles, `${basePath}/docs`);

      // 2. Prepare Data
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
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-lg w-full text-center">
          <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-purple-600" />
          </div>
          <h2 className="text-2xl font-bold text-stone-900 mb-2">Solicitação Enviada!</h2>
          <p className="text-stone-500 mb-8">
            Seu pedido de credenciamento foi recebido. O comitê técnico do IDC analisará suas credenciais e entrará em contato pelo email <strong>{formData.email}</strong> em até 5 dias úteis.
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
        <div className="bg-stone-900 p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 opacity-10 transform translate-x-10 -translate-y-10">
            <Shield className="w-64 h-64" />
          </div>
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-2">Credenciamento de Auditor(a)</h2>
            <p className="text-stone-400">Faça parte do corpo técnico do IDC e realize auditorias de certificação ESG.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-8">
          {/* Dados Pessoais */}
          <section>
            <h3 className="text-lg font-bold text-stone-800 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-stone-100 rounded-lg flex items-center justify-center text-stone-700 text-sm">1</span>
              Dados Pessoais
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-stone-700 mb-1">Nome Completo</label>
                <input
                  name="nome"
                  placeholder="Ex: Dra. Ana Souza"
                  value={formData.nome}
                  onChange={handleChange}
                  className="w-full p-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">E-mail</label>
                <input
                  name="email"
                  type="email"
                  placeholder="Ex: ana@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
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
                  className="w-full p-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">CPF</label>
                <input
                  name="cpf"
                  placeholder="000.000.000-00"
                  value={formData.cpf}
                  onChange={handleChange}
                  className="w-full p-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                  required
                />
              </div>
            </div>
          </section>

          <hr className="border-stone-100" />

          {/* Formação e Registro */}
          <section>
            <h3 className="text-lg font-bold text-stone-800 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center text-purple-700 text-sm">2</span>
              Formação e Registro
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Conselho de Classe</label>
                <input
                  name="conselhoClasse"
                  placeholder="Ex: CREA, CRBio"
                  value={formData.conselhoClasse}
                  onChange={handleChange}
                  className="w-full p-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Número de Registro</label>
                <input
                  name="numeroRegistro"
                  placeholder="Ex: 123456/D"
                  value={formData.numeroRegistro}
                  onChange={handleChange}
                  className="w-full p-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-stone-700 mb-1">Graduação</label>
                <input
                  name="graduacao"
                  placeholder="Ex: Engenharia Agronômica"
                  value={formData.graduacao}
                  onChange={handleChange}
                  className="w-full p-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Pós-Graduação (Opcional)</label>
                <input
                  name="posGraduacao"
                  placeholder="Ex: Gestão Ambiental"
                  value={formData.posGraduacao}
                  onChange={handleChange}
                  className="w-full p-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Mestrado/Doutorado (Opcional)</label>
                <input
                  name="mestradoDoutorado"
                  placeholder="Ex: Agroecologia"
                  value={formData.mestradoDoutorado}
                  onChange={handleChange}
                  className="w-full p-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-stone-700 mb-1">Resumo da Experiência Profissional</label>
                <textarea
                  name="experiencia"
                  rows={4}
                  placeholder="Descreva brevemente sua experiência com auditorias, certificações ou trabalho no campo..."
                  value={formData.experiencia}
                  onChange={handleChange}
                  className="w-full p-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>
          </section>

          <hr className="border-stone-100" />

          {/* Documentação */}
          <section>
            <h3 className="text-lg font-bold text-stone-800 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-stone-100 rounded-lg flex items-center justify-center text-stone-700 text-sm">3</span>
              Documentação Comprobatória
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <FileUploadZone
                label="RG ou CNH (Frente e Verso) *"
                accept=".pdf,.jpg,.png"
                multiple
                onFilesSelected={setRgCpfFiles}
              />
              <FileUploadZone
                label="Carteira do Conselho *"
                accept=".pdf,.jpg,.png"
                onFilesSelected={setConselhoFiles}
              />
              <FileUploadZone
                label="Diploma de Graduação *"
                accept=".pdf"
                onFilesSelected={setDiplomaFiles}
              />
              <FileUploadZone
                label="Curriculum Vitae (PDF) *"
                accept=".pdf"
                onFilesSelected={setCvFiles}
              />
            </div>
          </section>

          <div className="flex gap-4 justify-end pt-4">
            <Button
              type="submit"
              variant="dark"
              size="lg"
              isLoading={loading}
              rightIcon={<CheckCircle className="w-5 h-5" />}
            >
              Enviar Solicitação
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuditorRegistrationForm;
