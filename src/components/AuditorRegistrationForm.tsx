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

  // arquivos
  const [rgFiles, setRgFiles] = useState<File[]>([]);
  const [cpfFiles, setCpfFiles] = useState<File[]>([]);
  const [municipalFiles, setMunicipalFiles] = useState<File[]>([]);
  const [estadualFiles, setEstadualFiles] = useState<File[]>([]);
  const [federalFiles, setFederalFiles] = useState<File[]>([]);
  const [cndtFiles, setCndtFiles] = useState<File[]>([]);
  const [fgtsFiles, setFgtsFiles] = useState<File[]>([]);
  const [diplomaFiles, setDiplomaFiles] = useState<File[]>([]);
  const [registroFiles, setRegistroFiles] = useState<File[]>([]);
  const [enderecoFiles, setEnderecoFiles] = useState<File[]>([]);
  const [curriculoFiles, setCurriculoFiles] = useState<File[]>([]);

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // validação simples
  const validate = () => {
    if (!formData.nome.trim()) return "Preencha o nome completo.";
    if (!formData.email.trim()) return "Informe o e-mail.";
    if (!formData.cpf.trim()) return "Informe o CPF.";
    if (!formData.conselho.trim()) return "Informe o Conselho Profissional.";
    if (!formData.registroConselho.trim()) return "Informe o número do registro do conselho.";

    if (rgFiles.length === 0) return "Anexe o RG.";
    if (cpfFiles.length === 0) return "Anexe o CPF.";
    if (municipalFiles.length === 0) return "Anexe a Certidão Negativa Municipal.";
    if (estadualFiles.length === 0) return "Anexe a Certidão Negativa Estadual.";
    if (federalFiles.length === 0) return "Anexe a Certidão Negativa Federal.";
    if (cndtFiles.length === 0) return "Anexe a CNDT.";
    if (fgtsFiles.length === 0) return "Anexe a Regularidade do FGTS.";
    if (diplomaFiles.length === 0) return "Anexe o Diploma.";
    if (registroFiles.length === 0) return "Anexe o Registro Profissional.";
    if (curriculoFiles.length === 0) return "Anexe o Currículo.";

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
      const payload = new FormData();
      Object.entries(formData).forEach(([key, value]) => payload.append(key, value));

      // anexos
      [
        ["rg", rgFiles],
        ["cpf", cpfFiles],
        ["cert_municipal", municipalFiles],
        ["cert_estadual", estadualFiles],
        ["cert_federal", federalFiles],
        ["cndt", cndtFiles],
        ["fgts", fgtsFiles],
        ["diploma", diplomaFiles],
        ["registro_profissional", registroFiles],
        ["endereco", enderecoFiles],
        ["curriculo", curriculoFiles],
      ].forEach(([label, files]) => {
        (files as File[]).forEach((f, i) => payload.append(`${label}_${i}`, f));
      });

      // envio real futuro
      // await fetch(import.meta.env.VITE_API_BASE + "/auditors", { method: "POST", body: payload });

      console.log("📤 ENVIADO (preview):", payload);

      alert("Credenciamento enviado! O administrador analisará seu cadastro.");

      // limpar form
      setFormData({
        nome: "",
        email: "",
        telefone: "",
        cpf: "",
        conselho: "",
        registroConselho: "",
        endereco: "",
      });

      [
        setRgFiles,
        setCpfFiles,
        setMunicipalFiles,
        setEstadualFiles,
        setFederalFiles,
        setCndtFiles,
        setFgtsFiles,
        setDiplomaFiles,
        setRegistroFiles,
        setEnderecoFiles,
        setCurriculoFiles,
      ].forEach(fn => fn([]));

    } catch (error) {
      console.error(error);
      alert("Erro ao enviar credenciamento.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Credenciamento de Auditor(a)</h2>

      <form className="space-y-6" onSubmit={handleSubmit}>
        
        <div className="grid md:grid-cols-2 gap-4">
          <input type="text" name="nome" placeholder="Nome completo *"
            value={formData.nome} onChange={handleChange}
            className="p-3 border rounded-lg" required />

          <input ty
