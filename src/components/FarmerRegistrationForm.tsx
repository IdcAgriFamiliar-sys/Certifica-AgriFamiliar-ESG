import React, { useState } from "react";
import FileUploadZone from "./FileUploadZone";

interface FarmerFormData {
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  rg: string;
  endereco: string;
  caf: string;
}

interface FarmerDocuments {
  rgCpf?: FileList;
  comprovanteEndereco?: FileList;
  cafDocumento?: FileList;
}

const FarmerRegistrationForm: React.FC = () => {
  const [formData, setFormData] = useState<FarmerFormData>({
    nome: "",
    email: "",
    telefone: "",
    cpf: "",
    rg: "",
    endereco: "",
    caf: "",
  });

  const [documents, setDocuments] = useState<FarmerDocuments>({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Dados agricultor:", formData);
    console.log("Documentos:", documents);

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-bold text-green-700">
          Cadastro enviado com sucesso!
        </h2>
        <p className="text-gray-600 mt-2">
          Nossa equipe analisará seu cadastro e você receberá informações em breve.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Cadastro de Agricultor(a)
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
          name="endereco"
          placeholder="Endereço completo"
          className="w-full p-3 border rounded"
          onChange={handleChange}
          required
        />

        {/* CAF */}
        <input
          type="text"
          name="caf"
          placeholder="Número do CAF"
          className="w-full p-3 border rounded"
          onChange={handleChange}
          required
        />

        {/* DOCUMENTOS */}

        <FileUploadZone
          label="RG/CPF"
          accept=".pdf,.jpg,.png"
          onFilesSelected={(files) =>
            setDocuments((prev) => ({ ...prev, rgCpf: files }))
          }
        />

        <FileUploadZone
          label="Comprovante de Endereço"
          accept=".pdf,.jpg,.png"
          onFilesSelected={(files) =>
            setDocuments((prev) => ({ ...prev, comprovanteEndereco: files }))
          }
        />

        <FileUploadZone
          label="Documento do CAF"
          accept=".pdf,.jpg,.png"
          onFilesSelected={(files) =>
            setDocuments((prev) => ({ ...prev, cafDocumento: files }))
          }
        />

        <button
          type="submit"
          className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium"
        >
          Enviar cadastro
        </button>
      </form>
    </div>
  );
};

export default FarmerRegistrationForm;
