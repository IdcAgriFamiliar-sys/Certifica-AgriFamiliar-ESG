// src/components/FileUploadZone.tsx

import React from 'react';
import { Upload } from 'lucide-react';

// ============================================================================
// COMPONENTE DE UPLOAD DE ARQUIVOS
// ============================================================================
const FileUploadZone: React.FC<{
  onFilesSelected: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
}> = ({ onFilesSelected, accept = ".pdf,.png,.jpg,.jpeg", multiple = true }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onFilesSelected(Array.from(e.target.files));
    }
  };

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-500 transition-colors">
      <Upload className="mx-auto mb-3 text-gray-400" size={40} />
      <p className="text-gray-600 mb-2">Arraste arquivos ou clique para selecionar</p>
      <p className="text-gray-500 text-sm mb-3">PDF, PNG ou JPG (máx. 10MB)</p>
      <input
        type="file"
        onChange={handleFileChange}
        accept={accept}
        multiple={multiple}
        className="hidden"
        id="file-upload"
      />
      <label
        htmlFor="file-upload"
        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer inline-block shadow-md"
      >
        Selecionar Arquivos
      </label>
    </div>
  );
};

export default FileUploadZone;
