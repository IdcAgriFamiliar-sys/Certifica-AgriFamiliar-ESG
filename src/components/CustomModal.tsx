// src/components/CustomModal.tsx
import React from "react";

export type ModalType = "info" | "warning" | "error" | "success" | "confirm";

const CustomModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title: string;
  message: string;
  type?: ModalType;
}> = ({ isOpen, onClose, onConfirm, title, message, type = "info" }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow max-w-md w-full p-6">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-gray-700 mb-4">{message}</p>
        <div className="flex justify-end gap-2">
          {onConfirm ? (
            <>
              <button onClick={onClose} className="px-4 py-2 border rounded">Cancelar</button>
              <button onClick={() => { onConfirm(); onClose(); }} className="px-4 py-2 bg-indigo-600 text-white rounded">Confirmar</button>
            </>
          ) : (
            <button onClick={onClose} className="px-4 py-2 bg-indigo-600 text-white rounded">Fechar</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomModal;
