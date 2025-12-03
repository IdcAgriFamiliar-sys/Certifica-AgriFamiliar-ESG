import React from "react";
import { Link } from "react-router-dom";

const LandingPage: React.FC = () => {
  return (
    <div className="w-full min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">

      <div className="max-w-2xl text-center">
        <h1 className="text-4xl font-bold mb-4 text-green-700">
          Certificação AgriFamiliar ESG
        </h1>

        <p className="text-lg mb-6">
          Plataforma para gestão sustentável, emissão de certificados e
          valorização da agricultura familiar.
        </p>

        <div className="flex flex-col gap-4">
          <Link
            to="/dashboard"
            className="bg-green-600 text-white py-2 px-6 rounded hover:bg-green-700"
          >
            Acessar Dashboard
          </Link>

          <Link
            to="/register"
            className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700"
          >
            Cadastro de Agricultores
          </Link>
        </div>
      </div>

    </div>
  );
};

export default LandingPage;
