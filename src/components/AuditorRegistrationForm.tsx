import React, { useState } from "react";
import FileUploadZone from "./FileUploadZone";

interface AuditorFormData {
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  rg: string;
  conselhoClasse: string;
  registroProfissional: string;
  endereco: string;
}

interface AuditorDocuments {
  rgCpf?: FileList;
  certidoes?: FileList;
  diploma?: FileList;
  registroProfissional?: FileList;
  comprovanteEndereco?: FileList;
  curriculo?: FileList;
}

const AuditorRegistrationForm: React.FC = () => {
  const [formData, setFormData] = useState<AuditorFormData>({
    nome: "",
    email: "",
    telefone: "",
    cpf: "",
    rg: "",
    conselhoClasse: "",
    registroProfissional: "",
    endereco: "",
  });

  const [documents, setDocuments] = useState<AuditorDocuments>({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Dados enviados:", formData);
    console.log("Documentos anexados:", documents);

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-bold text-green-700">
          Cadastro enviado com sucesso!
        </h2>
        <p className="text-gray-600 mt-2">
          Aguarde a análise da equipe gestora. Seu acesso será liberado após aprovação.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Credenciamento de Auditor
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          type="text"
          name="nome"
          placeholder="Nome completo"
          className="w-full p-3 border rounded"
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="E-mail"
          className="w-full p-3 border rounded"
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="telefone"
          placeholder="Telefone"
          className="w-full p-3 border rounded"
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="cpf"
          placeholder="CPF"
          className="w-full p-3 border rounded"
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="rg"
          placeholder="RG"
          className="w-full p-3 border rounded"
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="conselhoClasse"
          placeholder="Conselho de Classe (ex: CREA, CRBio etc.)"
          className="w-full p-3 border rounded"
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="registroProfissional"
          placeholder="Registro Profissional (CREA, CRBio etc.)"
          className="w-full p-3 border rounded"
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="endereco"
          placeholder="Endereço Completo"
          className="w-full p-3 border rounded"
          onChange={hand
