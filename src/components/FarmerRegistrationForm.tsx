// src/components/FarmerRegistrationForm.tsx
import React, { useState } from "react";
import FileUploadZone from "./FileUploadZone";

const FarmerRegistrationForm: React.FC = () => {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    cpf: "",
    caf: "",
    endereco: "",
  });

  // arquivos separados por tipo
  const [rgFiles, setRgFiles] = useState<File[]>([]);
  const [cpfFiles, setCpfFiles] = useState<File[]>([]);
  const [cafFiles, setCafFiles] = useState<File[]>([]);
  const [enderecoFiles, setEnderecoFiles] = useState<File[]>([]);

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (!formData.nome.trim()) return "Preencha o nome completo.";
    if (!formData.email.trim()) return "Preencha o e-mail.";
    if (!formData.cpf.trim()) return "Preencha o CPF.";
    if (!formData.caf.trim()) return "Preencha o número do CAF (obrigatório).";
    // validar uploads mínimos
    if (rgFiles.length === 0) return "Anexe o RG.";
    if (cpfFiles.length === 0) return "Anexe o CPF (arquivo).";
    if (cafFiles.length === 0) return "Anexe o CAF em PDF.";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      alert(err);
      return;
    }

    setSubmitting(true);
    try {
      // montar FormData para envio real ao backend
      const payload = new FormData();
      payload.append("nome", formData.nome);
      payload.append("email", formData.email);
      payload.append("telefone", formData.telefone);
      payload.append("cpf", formData.cpf);
      payload.append("caf", formData.caf);
      payload.append("endereco", formData.endereco);

      rgFiles.forEach((f, i) => payload.append(`rg_${i}`, f));
      cpfFiles.forEach((f, i) => payload.append(`cpf_${i}`, f));
      cafFiles.forEach((f, i) => payload.append(`caf_${i}`, f));
      enderecoFiles.forEach((f, i) => payload.append(`endereco_${i}`, f));

      // Exemplo: envio para /api/farmers (ajuste para seu backend)
      // const res = await fetch(import.meta.env.VITE_API_BASE + '/farmers', {
      //   method: 'POST',
      //   body: payload,
      // });
      // if (!res.ok) throw new Error('Erro ao enviar cadastro');

      // temporário: apenas log para desenvolvimento
      console.log("FormData enviado (preview):", {
        ...formData,
        rgFiles: rgFiles.map(f => f.name),
        cpfFiles: cpfFiles.map(f => f.name),
        cafFiles: cafFiles.map(f => f.name),
        enderecoFiles: enderecoFiles.map(f => f.name),
      });

      alert("Cadastro enviado com sucesso! A equipe fará a análise.");
      // opcional: limpar form
      setFormData({ nome: "", email: "", telefone: "", cpf: "", caf: "", endereco: "" });
      setRgFiles([]);
      setCpfFiles([]);
      setCafFiles([]);
      setEnderecoFiles([]);
    } catch (error: any) {
      console.error(error);
      alert(error?.message || "Erro ao enviar cadastro");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Cadastro de Agricultor(a)</h2>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Dados pessoais */}
        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="text"
            name="nome"
            placeholder="Nome completo *"
            value={formData.nome}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="E-mail *"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
            required
          />
          <input
            type="text"
            name="telefone"
            placeholder="Telefone"
            value={formData.telefone}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
          />
          <input
            type="text"
            name="cpf"
            placeholder="CPF *"
            value={formData.cpf}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
            required
          />
          <input
            type="text"
            name="caf"
            placeholder="Número do CAF *"
            value={formData.caf}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
            required
          />
          <input
            type="text"
            name="endereco"
            placeholder="Endereço completo"
            value={formData.endereco}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
          />
        </div>

        {/* Uploads de documentos usando o FileUploadZone revisado */}
        <div className="space-y-4">
          <FileUploadZone label="Identidade (RG) *" files={rgFiles} onFilesChange={setRgFiles} multiple={true} />
          <FileUploadZone label="CPF (arquivo) *" files={cpfFiles} onFilesChange={setCpfFiles} multiple={true} />
          <FileUploadZone label="CAF (PDF) *" files={cafFiles} onFilesChange={setCafFiles} multiple={false} />
          <FileUploadZone label="Comprovante de Endereço" files={enderecoFiles} onFilesChange={setEnderecoFiles} multiple={true} />
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => {
              // limpar
              setFormData({ nome: "", email: "", telefone: "", cpf: "", caf: "", endereco: "" });
              setRgFiles([]);
              setCpfFiles([]);
              setCafFiles([]);
              setEnderecoFiles([]);
            }}
            className="px-5 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
            disabled={submitting}
          >
            Limpar
          </button>

          <button
            type="submit"
            className="px-6 py-2 bg-green-700 text-white rounded-md hover:bg-green-800"
            disabled={submitting}
          >
            {submitting ? "Enviando..." : "Enviar Cadastro"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FarmerRegistrationForm;
