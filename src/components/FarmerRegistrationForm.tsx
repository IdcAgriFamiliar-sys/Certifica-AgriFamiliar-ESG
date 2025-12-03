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

  const [rgCpfFiles, setRgCpfFiles] = useState<FileList | null>(null);
  const [cafFiles, setCafFiles] = useState<FileList | null>(null);
  const [enderecoFiles, setEnderecoFiles] = useState<FileList | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (!formData.nome.trim()) return "Nome é obrigatório.";
    if (!formData.email.trim()) return "E-mail é obrigatório.";
    if (!formData.cpf.trim()) return "CPF é obrigatório.";
    if (!formData.caf.trim()) return "Número do CAF é obrigatório.";
    if (!rgCpfFiles || rgCpfFiles.length === 0) return "Anexe RG/CPF (arquivo).";
    if (!cafFiles || cafFiles.length === 0) return "Anexe o CAF (arquivo).";
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) return alert(err);

    const preview = {
      ...formData,
      rgCpfFiles: rgCpfFiles ? Array.from(rgCpfFiles).map((f) => f.name) : [],
      cafFiles: cafFiles ? Array.from(cafFiles).map((f) => f.name) : [],
      enderecoFiles: enderecoFiles ? Array.from(enderecoFiles).map((f) => f.name) : [],
    };

    console.log("Cadastro agricultor (preview):", preview);
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
      <h2 className="text-2xl font-semibold mb-4">Cadastro de Agricultor(a)</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="nome" placeholder="Nome completo" value={formData.nome} onChange={handleChange} className="w-full p-3 border rounded" required />
        <input name="email" type="email" placeholder="E-mail" value={formData.email} onChange={handleChange} className="w-full p-3 border rounded" required />
        <input name="telefone" placeholder="Telefone" value={formData.telefone} onChange={handleChange} className="w-full p-3 border rounded" />
        <input name="cpf" placeholder="CPF" value={formData.cpf} onChange={handleChange} className="w-full p-3 border rounded" required />
        <input name="caf" placeholder="Número do CAF" value={formData.caf} onChange={handleChange} className="w-full p-3 border rounded" required />
        <input name="endereco" placeholder="Endereço" value={formData.endereco} onChange={handleChange} className="w-full p-3 border rounded" />

        <FileUploadZone label="RG/CPF (arquivo) *" accept=".pdf,.jpg,.png" multiple onFilesSelected={setRgCpfFiles} />
        <FileUploadZone label="CAF (arquivo) *" accept=".pdf" onFilesSelected={setCafFiles} />
        <FileUploadZone label="Comprovante de Endereço" accept=".pdf,.jpg,.png" onFilesSelected={setEnderecoFiles} />

        <div className="flex gap-3 justify-end">
          <button type="submit" className="px-6 py-2 bg-green-700 text-white rounded">Enviar cadastro</button>
        </div>
      </form>
    </div>
  );
};

export default FarmerRegistrationForm;
