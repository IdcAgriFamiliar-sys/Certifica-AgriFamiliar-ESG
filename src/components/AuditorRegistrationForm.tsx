// src/components/AuditorRegistrationForm.tsx
import React, { useState } from "react";
import FileUploadZone from "./FileUploadZone";

const AuditorRegistrationForm: React.FC = () => {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    cpf: "",
    conselho: "",
    registroConselho: "",
    endereco: "",
  });

  const [rgFiles, setRgFiles] = useState<FileList | null>(null);
  const [cpfFiles, setCpfFiles] = useState<FileList | null>(null);
  const [municipalFiles, setMunicipalFiles] = useState<FileList | null>(null);
  const [estadualFiles, setEstadualFiles] = useState<FileList | null>(null);
  const [federalFiles, setFederalFiles] = useState<FileList | null>(null);
  const [cndtFiles, setCndtFiles] = useState<FileList | null>(null);
  const [fgtsFiles, setFgtsFiles] = useState<FileList | null>(null);
  const [diplomaFiles, setDiplomaFiles] = useState<FileList | null>(null);
  const [registroFiles, setRegistroFiles] = useState<FileList | null>(null);
  const [enderecoFiles, setEnderecoFiles] = useState<FileList | null>(null);
  const [curriculoFiles, setCurriculoFiles] = useState<FileList | null>(null);

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const validate = () => {
    if (!formData.nome) return "Preencha o nome.";
    if (!formData.email) return "Preencha o e-mail.";
    if (!formData.cpf) return "Preencha o CPF.";
    if (!formData.conselho) return "Informe o conselho.";
    if (!formData.registroConselho) return "Informe o número de registro.";
    if (!rgFiles || rgFiles.length === 0) return "Anexe o RG.";
    if (!cpfFiles || cpfFiles.length === 0) return "Anexe o CPF.";
    if (!municipalFiles || municipalFiles.length === 0) return "Anexe certidão municipal.";
    if (!estadualFiles || estadualFiles.length === 0) return "Anexe certidão estadual.";
    if (!federalFiles || federalFiles.length === 0) return "Anexe certidão federal.";
    if (!cndtFiles || cndtFiles.length === 0) return "Anexe CNDT.";
    if (!fgtsFiles || fgtsFiles.length === 0) return "Anexe FGTS/CRF.";
    if (!diplomaFiles || diplomaFiles.length === 0) return "Anexe diploma.";
    if (!registroFiles || registroFiles.length === 0) return "Anexe registro profissional.";
    if (!curriculoFiles || curriculoFiles.length === 0) return "Anexe currículo.";
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) return alert(err);

    const preview = {
      ...formData,
      rg: rgFiles ? Array.from(rgFiles).map((f) => f.name) : [],
      cpf: cpfFiles ? Array.from(cpfFiles).map((f) => f.name) : [],
      municipal: municipalFiles ? Array.from(municipalFiles).map((f) => f.name) : [],
      estadual: estadualFiles ? Array.from(estadualFiles).map((f) => f.name) : [],
      federal: federalFiles ? Array.from(federalFiles).map((f) => f.name) : [],
      cndt: cndtFiles ? Array.from(cndtFiles).map((f) => f.name) : [],
      fgts: fgtsFiles ? Array.from(fgtsFiles).map((f) => f.name) : [],
      diploma: diplomaFiles ? Array.from(diplomaFiles).map((f) => f.name) : [],
      registro: registroFiles ? Array.from(registroFiles).map((f) => f.name) : [],
      curriculo: curriculoFiles ? Array.from(curriculoFiles).map((f) => f.name) : [],
    };

    console.log("Credenciamento auditor (preview):", preview);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-bold text-green-700">Credenciamento enviado!</h2>
        <p className="text-gray-600">Nossa equipe fará a análise e entrará em contato.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Credenciamento de Auditor(a)</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-3">
          <input name="nome" placeholder="Nome completo" onChange={handleChange} className="p-3 border rounded" required />
          <input name="email" type="email" placeholder="E-mail" onChange={handleChange} className="p-3 border rounded" required />
          <input name="telefone" placeholder="Telefone" onChange={handleChange} className="p-3 border rounded" />
          <input name="cpf" placeholder="CPF" onChange={handleChange} className="p-3 border rounded" required />
          <input name="conselho" placeholder="Conselho de Classe" onChange={handleChange} className="p-3 border rounded" required />
          <input name="registroConselho" placeholder="Nº registro conselho" onChange={handleChange} className="p-3 border rounded" required />
          <input name="endereco" placeholder="Endereço" onChange={handleChange} className="p-3 border rounded" />
        </div>

        <FileUploadZone label="RG (arquivo)" accept=".pdf,.jpg,.png" onFilesSelected={(files) => setRgFiles(files)} multiple />
        <FileUploadZone label="CPF (arquivo)" accept=".pdf,.jpg,.png" onFilesSelected={(files) => setCpfFiles(files)} multiple />
        <FileUploadZone label="Certidão Negativa Municipal" accept=".pdf" onFilesSelected={(files) => setMunicipalFiles(files)} multiple />
        <FileUploadZone label="Certidão Negativa Estadual" accept=".pdf" onFilesSelected={(files) => setEstadualFiles(files)} multiple />
        <FileUploadZone label="Certidão Negativa Federal" accept=".pdf" onFilesSelected={(files) => setFederalFiles(files)} multiple />
        <FileUploadZone label="CNDT (Trabalhista)" accept=".pdf" onFilesSelected={(files) => setCndtFiles(files)} />
        <FileUploadZone label="Regularidade FGTS (CRF)" accept=".pdf" onFilesSelected={(files) => setFgtsFiles(files)} />
        <FileUploadZone label="Diploma" accept=".pdf,.jpg,.png" onFilesSelected={(files) => setDiplomaFiles(files)} />
        <FileUploadZone label="Registro Profissional (Conselho)" accept=".pdf,.jpg,.png" onFilesSelected={(files) => setRegistroFiles(files)} />
        <FileUploadZone label="Comprovante de Endereço" accept=".pdf,.jpg,.png" onFilesSelected={(files) => setEnderecoFiles(files)} />
        <FileUploadZone label="Currículo (PDF)" accept=".pdf" onFilesSelected={(files) => setCurriculoFiles(files)} />

        <div className="text-right">
          <button type="submit" className="px-6 py-2 bg-blue-700 text-white rounded">Enviar credenciamento</button>
        </div>
      </form>
    </div>
  );
};

export default AuditorRegistrationForm;
