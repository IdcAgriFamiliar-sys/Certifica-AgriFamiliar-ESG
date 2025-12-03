// src/componentes/FarmerRegistrationForm.tsx
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

  const validate = (): string | null => {
    if (!formData.nome.trim()) return "Nome é obrigatório.";
    if (!formData.email.trim()) return "E-mail é obrigatório.";
    if (!formData.cpf.trim()) return "CPF é obrigatório.";
    if (!formData.caf.trim()) return "Número do CAF é obrigatório.";
    if (!rgCpfFiles || rgCpfFiles.length === 0) return "Anexe RG/CPF (arquivo).";
    if (!cafFiles || cafFiles.length === 0) return "Anexe o CAF (arquivo).";
    return null;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      alert(err);
      return;
    }

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
