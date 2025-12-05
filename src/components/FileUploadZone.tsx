// src/components/FileUploadZone.tsx
import React, { useState, useRef } from "react";
import { UploadCloud, File as FileIcon, X } from "lucide-react";

interface FileUploadZoneProps {
  label: string;
  // Use globalThis.File to explicitly reference the DOM File type and avoid
  // collision with the imported `File` icon from lucide-react.
  onFilesSelected: (files: globalThis.File[]) => void;
  accept?: string;
  multiple?: boolean;
}

const FileUploadZone: React.FC<FileUploadZoneProps> = ({
  label,
  onFilesSelected,
  accept = "*",
  multiple = false,
}) => {
  const [selectedFiles, setSelectedFiles] = useState<globalThis.File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync internal state with parent callback whenever it changes
  // Ideally we would control this from parent, but for now we just emit changes
  const updateFiles = (newFiles: globalThis.File[]) => {
    setSelectedFiles(newFiles);
    onFilesSelected(newFiles);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files) as globalThis.File[];
      if (multiple) {
        updateFiles([...selectedFiles, ...newFiles]);
      } else {
        updateFiles(newFiles);
      }
      // Reset input so same file can be selected again if needed
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files) as globalThis.File[];
      if (multiple) {
        updateFiles([...selectedFiles, ...newFiles]);
      } else {
        updateFiles(newFiles);
      }
    }
  };

  const removeFile = (index: number) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    updateFiles(newFiles);
  };

  return (
    <div className="w-full mb-6">
      <label className="block text-sm font-medium text-stone-700 mb-2">
        {label}
      </label>

      <div
        className={`relative border-2 border-dashed rounded-xl p-6 transition-all text-center cursor-pointer group ${
          isDragging
            ? "border-green-500 bg-green-50"
            : "border-stone-300 hover:border-green-400 hover:bg-stone-50"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          accept={accept}
          multiple={multiple}
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center gap-2">
          <div
            className={`p-3 rounded-full ${
              isDragging
                ? "bg-green-100"
                : "bg-stone-100 group-hover:bg-green-50"
            } transition-colors`}
          >
            <UploadCloud
              className={`w-6 h-6 ${
                isDragging
                  ? "text-green-600"
                  : "text-stone-400 group-hover:text-green-500"
              }`}
            />
          </div>
          <div className="text-sm text-stone-600">
            <span className="font-semibold text-green-600">
              Clique para enviar
            </span>{" "}
            ou arraste e solte
          </div>
          <p className="text-xs text-stone-400">
            Formatos:{" "}
            {accept === "*"
              ? "Todos"
              : accept.replace(/\./g, " ").toUpperCase()}
          </p>
        </div>
      </div>

      {selectedFiles.length > 0 && (
        <div className="mt-3 space-y-2">
          {selectedFiles.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-stone-50 rounded-lg border border-stone-100"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="p-2 bg-white rounded-lg border border-stone-100">
                  <FileIcon className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-medium text-stone-700 truncate">
                    {file.name}
                  </span>
                  <span className="text-xs text-stone-400">
                    {(file.size / 1024).toFixed(1)} KB
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(index);
                }}
                className="p-1 hover:bg-red-50 text-stone-400 hover:text-red-500 rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUploadZone;
