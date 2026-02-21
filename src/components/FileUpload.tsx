import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileImage, X } from 'lucide-react';
import { cn } from '../lib/utils';

interface FileUploadProps {
  onFilesSelected: (files: string[]) => void;
  files: string[];
  onRemoveFile: (index: number) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFilesSelected, files, onRemoveFile }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const promises = acceptedFiles.map(file => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(promises).then(base64Files => {
      onFilesSelected(base64Files);
    });
  }, [onFilesSelected]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    multiple: true
  });

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div
        {...getRootProps()}
        className={cn(
          "relative border-2 border-dashed rounded-3xl p-12 transition-all duration-200 cursor-pointer flex flex-col items-center justify-center text-center",
          isDragActive ? "border-zinc-900 bg-zinc-50" : "border-zinc-200 hover:border-zinc-400 bg-white"
        )}
      >
        <input {...getInputProps()} />
        <div className="w-16 h-16 bg-zinc-100 rounded-2xl flex items-center justify-center mb-4">
          <Upload className="text-zinc-500" />
        </div>
        <h3 className="text-lg font-semibold text-zinc-900 mb-1">
          Upload Study Materials
        </h3>
        <p className="text-zinc-500 text-sm max-w-xs">
          Drag and drop photos of your notes, workbooks, or textbooks here
        </p>
      </div>

      {files.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {files.map((file, index) => (
            <div key={index} className="relative group aspect-square rounded-2xl overflow-hidden border border-zinc-200 bg-zinc-100">
              <img src={file} alt={`Upload ${index}`} className="w-full h-full object-cover" />
              <button
                onClick={() => onRemoveFile(index)}
                className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur-sm rounded-full text-zinc-900 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
