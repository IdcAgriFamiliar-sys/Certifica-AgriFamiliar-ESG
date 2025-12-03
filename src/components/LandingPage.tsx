import React from 'react';
import { useNavigate } from 'react-router-dom';

import logoDespertar from '../assets/LogoDespertarCidadania.png';
import seloESG from '../assets/SeloESGAgriFamiliar.png';

const LandingPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center p-6">

            {/* LOGO PRINCIPAL */}
            <img
                src={logoDespertar}
                alt="Despertar Cidadania"
                className="w-40 mb-4 drop-shadow-lg"
            />

            {/* TÍTULO */}
            <h1 className="text-3xl font-bold text-green-800 text-center">
                Certificação ESG para Agricultores Familiares
            </h1>

            {/* SUBTÍTULO */}
            <p className="text-lg text-gray-700 mt-3 text-center max-w-lg">
                Plataforma exclusiva para emissão, auditoria e gestão de certificações
                socioambientais voltadas à agricultura familiar.
            </p>

            {/* SELO ESG */}
            <img
                src={seloESG}
