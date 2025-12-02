// src/components/CustomModal.tsx

import React from 'react';
import { AlertCircle, XCircle, CheckCircle } from 'lucide-react';

// Tipos devem ser definidos ou importados de um arquivo de tipos
export type ModalType = 'info' | 'warning' | 'error' | 'success' | 'confirm';

// ============================================================================
// COMPONENTE MODAL PERSONALIZADO
// ============================================================================
const CustomModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title: string;
  message: string;
  type?: ModalType;
}> = ({ isOpen, onClose, onConfirm, title, message, type = 'info' }) => {
  if (!isOpen) return null;

  const typeColors = {
    info: 'bg-blue-50 border-blue-200',
    warning: 'bg-yellow-50 border-yellow-200',
    error: 'bg-red-50 border-red-200',
    success: 'bg-green-50 border-green-200',
    confirm: 'bg-indigo-50 border-indigo-200'
  };

  const typeIcons = {
    info: <AlertCircle className="text-blue-600" size={24} />,
    warning: <AlertCircle className="text-yellow-600" size={24} />,
    error: <XCircle className="text-red-600" size={24} />,
    success: <CheckCircle className="text-green-600" size={24} />,
    confirm: <AlertCircle className="text-indigo-600" size={24} />
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`bg-white rounded-lg shadow-xl max-w-md w-full border-2 ${typeColors[type]}`}>
        <div className="p-6">
          <div className="flex items-start gap-4">
            {typeIcons[type]}
            <div className="flex-1">
              <h3 className="mb-2 text-xl font-semibold text-gray-900">{title}</h3>
              <p className="text-gray-700">{message}</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-6 py-4 flex gap-3 justify-end rounded-b-lg">
          {onConfirm ? (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors shadow-sm"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
              >
                Confirmar
              </button>
            </>
          ) : (
            <button
              onClick={onClose}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
            >
              Fechar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomModal;
