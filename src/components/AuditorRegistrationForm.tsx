import React, { useState } from "react";
import FileUploadZone from "./FileUploadZone";

const AuditorRegistrationForm: React.FC = () => {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    registroProfissional: "",
  });

  const [rgCpfFiles, setRgCpfFiles] = useState<FileList | null>(null);
  const [registroFiles, setRegistroFiles] = useState<FileList | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (!formData.nome.trim()) return "Nome é obrigatório.";
    if (!formData.email.trim()) return "E-mail é obrigatório.";
    if (!formData.registroProfissional.trim())
      return "Registro profissional é obrigatório.";
    if (!rgCpfFiles || rgCpfFiles.length === 0) return "Anexe RG/CPF (arquivo).";
    if (!registroFiles || registroFiles.length === 0)
      return "Anexe registro profissional (arquivo).";
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) return alert(err);

    const preview = {
      ...formData,
      rgCpfFiles: rgCpfFiles ? Array.from(rgCpfFiles).map((f) => f.name) : [],
      registroFiles: registroFiles ? Array.from(registroFiles).map((f) => f.name) : [],
    };

    console.log("Cadastro auditor (preview):", preview);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-bold text-green-700">Cadastro enviado!</h2>
        <p className="text-gray-600 mt-2">A equipe analisará e entrará em contato.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Credenciamento de Auditor(a)</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="nome"
          placeholder="Nome completo"
          value={formData.nome}
          onChange={handleChange}
          className="w-full p-3 border rounded"
          required
        />
        <input
          name="email"
          type="email"
          placeholder="E-mail"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-3 border rounded"
          required
        />
        <input
          name="telefone"
          placeholder="Telefone"
          value={formData.telefone}
          onChange={handleChange}
          className="w-full p-3 border rounded"
        />
        <input
          name="registroProfissional"
          placeholder="Registro Profissional"
          value={formData.registroProfissional}
          onChange={handleChange}
          className="w-full p-3 border rounded"
          required
        />

        <FileUploadZone
          label="RG/CPF (arquivo) *"
          accept=".pdf,.jpg,.png"
          multiple
          onFilesSelected={setRgCpfFiles}
        />
        <FileUploadZone
          label="Registro profissional *"
          accept=".pdf"
          onFilesSelected={setRegistroFiles}
        />

        <div className="flex gap-3 justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-700 text-white rounded"
          >
            Enviar cadastro
          </button>
        </div>
      </form>
    </div>
  );
};

export default AuditorRegistrationForm;
