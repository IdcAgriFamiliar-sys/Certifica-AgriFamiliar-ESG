import React, { useState } from 'react';
import CustomModal from './CustomModal';
import FileUploadZone from './FileUploadZone';

interface FarmerRegistrationFormProps {
    isOpen: boolean;
    onClose: () => void;
}

const FarmerRegistrationForm: React.FC<FarmerRegistrationFormProps> = ({ isOpen, onClose }) => {
    const [name, setName] = useState('');
    const [cpf, setCpf] = useState('');
    const [address, setAddress] = useState('');
    const [productionType, setProductionType] = useState('');
    const [file, setFile] = useState<File | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const data = {
            name,
            cpf,
            address,
            productionType,
            file,
        };

        console.log("Dados enviados:", data);
        onClose();
    };

    return (
        <CustomModal isOpen={isOpen} onClose={onClose} title="Cadastrar Agricultor Familiar">
            <form className="space-y-4" onSubmit={handleSubmit}>
                
                {/* NOME */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Nome completo</label>
                    <input
                        type="text"
                        className="mt-1 w-full border rounded-lg p-2"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ex: João da Silva"
                        required
                    />
                </div>

                {/* CPF */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">CPF</label>
                    <input
                        type="text"
                        className="mt-1 w-full border rounded-lg p-2"
                        value={cpf}
                        onChange={(e) => setCpf(e.target.value)}
                        placeholder="000.000.000-00"
                        required
                    />
                </div>

                {/* ENDEREÇO */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Endereço</label>
                    <input
                        type="text"
                        className="mt-1 w-full border rounded-lg p-2"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Localidade, Município"
                        required
                    />
                </div>

                {/* TIPO DE PRODUÇÃO */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Tipo de Produção</label>
                    <select
                        className="mt-1 w-full border rounded-lg p-2"
                        value={productionType}
                        onChange={(e) => setProductionType(e.target.value)}
                        required
                    >
                        <option value="">Selecione...</option>
                        <option value="hortalicas">Hortaliças</option>
                        <option value="frutas">Fruticultura</option>
                        <option value="leite">Produção de Leite</option>
                        <option value="agroecologico">Sistema Agroecológico</option>
                    </select>
                </div>

                {/* ARQUIVOS */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Documentos do Agricultor</label>
                    <FileUploadZone onFileSelect={setFile} />
                </div>

                {/* BO*
