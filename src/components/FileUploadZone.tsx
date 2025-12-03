// src/components/FileUploadZone.tsx
import React from "react";

interface FileUploadZoneProps {
  label: string;
  onFilesSelected: (files: FileList) => void;
  accept?: string;
  multiple?: boolean;
}

const FileUploadZone: React.FC<FileUploadZoneProps> = ({
  label,
  onFilesSelected,
  accept = "*",
  multiple = false,
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) onFilesSelected(e.target.files);
  };

  return (
    <div className="w-full my-3">
      <label className="block text-gray-700 font-medium mb-1">{label}</label>
      <div className="border border-gray-300 rounded-lg p-3 bg-gray-50">
        <input type="file" accept={accept} multiple={multiple} onChange={handleFileChange} className="w-full" />
      </div>
      <p className="text-sm text-gray-500 mt-1">Arquivos aceitos: {accept === "*" ? "qualquer formato" : accept}</p>
    </div>
  );
};

export default FileUploadZone;
