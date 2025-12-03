// src/components/FileUploadZone.tsx

import React, { useRef } from 'react';
import { Upload, X } from 'lucide-react';

interface FileUploadZoneProps {
  label: string;
  files: File[];
  onFilesChange: (files: File[]) => void;
  multiple?: boolean;
}

const FileUploadZone: React.FC<FileUploadZoneProps> = ({
  label,
  files,
  onFilesChange,
  multiple = true,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleSelectFiles = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;

    const selectedFiles = Array.from(event.target.files);
    const updated = multiple ? [...files, ...selectedFiles] : selectedFiles;

    onFilesChange(updated);
  };

  const removeFile = (index: number) => {
    const updated = files.filter((_, i) => i !== index);
    onFilesChange(updated);
  };

  const openFileDialog = () => {
    inputRef.current?.click();
  };

  return (
    <div className="w-full">
      <p className="font-medium text-gray-700 mb-2">{label}</p>

      <div
        className="border-2 border-dashed border-gray-300 p-6 rounded-lg cursor-pointer hover:border-blue-600 transition"
        onClick={openFileDialog}
      >
        <input
          ref={inputRef}
          type="file"
          multiple={multiple}
          className="hidden"
          onChange={handleSelectFiles}
        />

        <div className="flex flex-col items-center text-gray-600">
          <Upload className="w-8 h-8 mb-2" />
          <p className="text-sm text-center">
            Clique para selecionar arquivos<br />
            <span className="text-xs text-gray-500">
              (PDF, JPG, PNG, DOC, etc.)
            </span>
          </p>
        </div>
      </div>

      {/* Lista de arquivos selecionados */}
      {files.length > 0 && (
        <ul className="mt-3 space-y-2">
          {files.map((file, index) => (
            <li
              key={index}
              className="flex justify-between items-center bg-gray-100 p-2 rounded-md"
            >
              <span className="text-sm truncate max-w-[80%]">{file.name}</span>

              <button
                type="button"
                className="text-red-600 hover:text-red-800"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(index);
                }}
              >
                <X className="w-5 h-5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FileUploadZone;
