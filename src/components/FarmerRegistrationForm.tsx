import React, { useState } from "react";
import CustomModal from "./CustomModal";

const FarmerRegistrationForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    cpf: "",
    community: "",
    state: "",
    phone: "",
  });

  const [modalOpen, setModalOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setModalOpen(true);
  };

  return (
    <div className="w-full max-w-xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Cadastro de Agricultor Familiar
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          placeholder="Nome Completo"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <input
          name="cpf"
          placeholder="CPF"
          value={formData.cpf}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <input
          name="community"
          placeholder="Comunidade"
          value={formData.community}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <input
          name="state"
          placeholder="Estado"
          value={formData.state}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <input
          name="phone"
          placeholder="Telefone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
        >
          Enviar Cadastro
        </button>
      </form>

      {modalOpen && (
        <CustomModal
          title="Cadastro enviado!"
          message="Seu cadastro foi registrado com sucesso."
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
};

export default FarmerRegistrationForm;
