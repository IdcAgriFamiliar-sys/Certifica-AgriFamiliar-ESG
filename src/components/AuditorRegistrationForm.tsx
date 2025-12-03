// src/components/AuditorRegistrationForm.tsx

import React, { useState } from "react";
import FileUploadZone from "./FileUploadZone";
import CustomModal from "./CustomModal";

interface UploadedFiles {
  rg?: File | null;
  cpf?: File | null;
  certidaoMunicipal?: File | null;
  certidaoEstadual?: File | null;
  certidaoFederal?: File | null;
  cndt?: File | null;
  fgts?: File | null;
  diploma?: File | null;
  registroProfissional?: File | null;
  comprovanteEndereco?: File | null;
  curriculo?: File | null;
}

const AuditorRegistrationForm: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [uploaded, setUploaded] = useState<UploadedFiles>({});
  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    conselho: "",
    numeroRegistro: ""
  });

  const updateFile = (key: keyof UploadedFiles, file: File | null) => {
    setUploaded((prev) => ({ ...prev, [key]: file }));
  };

  const handleSubmit = () => {
    setModalOpen(true);

    console.log("DADOS ENVIADOS:", {
      ...form,
      documentos: uploaded,
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Credenciamento de Auditor(a)
      </h1>

      {/* ========================= ETAPA 1 ========================= */}
      {step === 1 && (
        <>
          <h2 className="text-xl font-semibold mb-4">Dados Pessoais</h2>

          <label className="block mb-3">
            <span className="text-gray-700">Nome Completo</span>
            <input
              type="text"
              className="w-full mt-1 p-2 border rounded-md"
              value={form.nome}
              onChange={(e) =>
                setForm({ ...form, nome: e.target.value })
              }
            />
          </label>

          <label className="block mb-3">
            <span className="text-gray-700">E-mail</span>
            <input
              type="email"
              className="w-full mt-1 p-2 border rounded-md"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />
          </label>

          <label className="block mb-3">
            <span className="text-gray-700">Telefone</span>
            <input
              type="text"
              className="w-full mt-1 p-2 border rounded-md"
              value={form.telefone}
              onChange={(e) =>
                setForm({ ...form, telefone: e.target.value })
              }
            />
          </label>

          <label className="block mb-3">
            <span className="text-gray-700">Conselho Profissional</span>
            <input
              type="text"
              className="w-full mt-1 p-2 border rounded-md"
              placeholder="CREA, CRBio, CRMV..."
              value={form.conselho}
              onChange={(e) =>
                setForm({ ...form, conselho: e.target.value })
              }
            />
          </label>

          <label className="block mb-6">
            <span className="text-gray-700">Número de Registro</span>
            <input
              type="text"
              className="w-full mt-1 p-2 border rounded-md"
              value={form.numeroRegistro}
              onChange={(e) =>
                setForm({ ...form, numeroRegistro: e.target.value })
              }
            />
          </label>

          <button
            onClick={() => setStep(2)}
            className="w-full py-2 mt-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
          >
            Avançar para Envio de Documentos
          </button>
        </>
      )}

      {/* ========================= ETAPA 2 ========================= */}
      {step === 2 && (
        <>
          <h2 className="text-xl font-semibold mb-4">
            Envio de Documentos Obrigatórios
          </h2>

          <div className="space-y-4">
            <FileUploadZone label="RG" onFileSelect={(file) => updateFile("rg", file)} />
            <FileUploadZone label="CPF" onFileSelect={(file) => updateFile("cpf", file)} />
            <FileUploadZone label="Certidão Negativa Municipal" onFileSelect={(file) => updateFile("certidaoMunicipal", file)} />
            <FileUploadZone label="Certidão Negativa Estadual" onFileSelect={(file) => updateFile("certidaoEstadual", file)} />
            <FileUploadZone label="Certidão Negativa Federal" onFileSelect={(file) => updateFile("certidaoFederal", file)} />
            <FileUploadZone label="CNDT Trabalhista" onFileSelect={(file) => updateFile("cndt", file)} />
            <FileUploadZone label="Regularidade FGTS (CRF)" onFileSelect={(file) => updateFile("fgts", file)} />
            <FileUploadZone label="Diploma" onFileSelect={(file) => updateFile("diploma", file)} />
            <FileUploadZone label="Registro Profissional" onFileSelect={(file) => updateFile("registroProfissional", file)} />
            <FileUploadZone label="Comprovante de Endereço" onFileSelect={(file) => updateFile("comprovanteEndereco", file)} />
            <FileUploadZone label="Currículo" onFileSelect={(file) => updateFile("curriculo", file)} />
          </div>

          <div className="flex justify-between mt-6">
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Voltar
            </button>

            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Enviar Credenciamento
            </button>
          </div>
        </>
      )}

      <CustomModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        type="success"
        title="Credenciamento Enviado!"
        message="Sua solicitação foi enviada e será analisada pela equipe do Certifica AgriFamiliar ESG."
      />
    </div>
  );
};

export default AuditorRegistrationForm;
