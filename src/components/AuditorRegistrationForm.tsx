// src/components/AuditorRegistrationForm.tsx

import React, { useState } from "react";
import FileUploadZone from "./FileUploadZone";

const AuditorRegistrationForm: React.FC = () => {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    cpf: "",
    registroProfissional: "",
    endereco: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    alert("Cadastro enviado para análise! Você será contactado pelo administrador.");
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Credenciamento de Auditor(a)
      </h2>

      <form className="space-y-6" onSubmit={handleSubmit}>

        {/* Dados Pessoais */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">Dados Pessoais</h3>

          <input
            type="text"
            name="nome"
            placeholder="Nome completo"
            value={formData.nome}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="E-mail"
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
            placeholder="CPF"
            value={formData.cpf}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
            required
          />

          <input
            type="text"
            name="registroProfissional"
            placeholder="Registro Profissional (CREA/CRBio/CRQ/Outro)"
            value={formData.registroProfissional}
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

        {/* Documentos Obrigatórios */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">Documentos Obrigatórios</h3>

          <FileUploadZone label="Documento de Identidade (RG)" />
          <FileUploadZone label="Cadastro de Pessoa Física (CPF)" />
          <FileUploadZone label="Certidões Negativas (Municipal, Estadual, Federal)" />
          <FileUploadZone label="CND Trabalhista e FGTS" />
          <FileUploadZone label="Diploma ou Comprovação de Formação" />
          <FileUploadZone label="Currículo (PDF)" />
          <FileUploadZone label="Comprovante de Endereço" />
        </div>

        {/* Botão */}
        <button
          type="submit"
          className="w-full bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-lg font-medium shadow-md transition"
        >
          Enviar Credenciamento
        </button>
      </form>
    </div>
  );
};

export default AuditorRegistrationForm;
