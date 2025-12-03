// src/componentes/AuditorRegistrationForm.tsx
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
