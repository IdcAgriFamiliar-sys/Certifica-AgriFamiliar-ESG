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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    alert("Cadastro enviado! A equipe entrará em contato.");
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Cadastro de Agricultor(a)
      </h2>

      <form className="space-y-6" onSubmit={handleSubmit}>

        {/* Dados pessoais */}
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
            name="caf"
            placeholder="Número do CAF"
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

        {/* Documentos */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">Documentos Necessários</h3>

          <FileUploadZone label="Identidade (RG)" />
          <FileUploadZone label="CPF" />
          <FileUploadZone label="CAF PDF" />
          <FileUploadZone label="Comprovante de Endereço" />
        </div>

        <button
          type="submit"
          className="w-full bg-green-700 hover:bg-green-800 text-white py-3 rounded-lg font-medium shadow-md transition"
        >
          Enviar Cadastro
        </button>
      </form>
    </div>
  );
};

export default FarmerRegistrationForm;
