'use client';

import { useCallback, useState, DragEvent, ChangeEvent } from 'react';
import { UploadCloud, ImageIcon, X } from 'lucide-react';
import Image from 'next/image';

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  previewUrl: string | null;
  onReset: () => void;
  isLoading: boolean;
}

export default function UploadZone({ onFileSelect, previewUrl, onReset, isLoading }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith('image/')) return;
      onFileSelect(file);
    },
    [onFileSelect]
  );

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  if (previewUrl) {
    return (
      <div className="relative rounded-2xl overflow-hidden border-2 border-green-200 bg-green-50">
        <Image
          src={previewUrl}
          alt="Preview"
          width={600}
          height={400}
          className="w-full h-64 object-cover"
        />
        {!isLoading && (
          <button
            onClick={onReset}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-white/80 hover:bg-white text-stone-600 shadow transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={onDrop}
      className={`relative rounded-2xl border-2 border-dashed transition-all cursor-pointer
        ${isDragging
          ? 'border-green-400 bg-green-50 scale-[1.01]'
          : 'border-green-200 bg-white hover:border-green-400 hover:bg-green-50'
        }`}
    >
      <label className="flex flex-col items-center justify-center gap-4 p-12 cursor-pointer">
        <div className={`p-4 rounded-full transition-all ${isDragging ? 'bg-green-200' : 'bg-green-100'}`}>
          {isDragging
            ? <ImageIcon className="w-8 h-8 text-green-600" />
            : <UploadCloud className="w-8 h-8 text-green-500" />
          }
        </div>
        <div className="text-center">
          <p className="font-zain text-lg font-bold text-stone-700">
            {isDragging ? 'Lepaskan gambar di sini' : 'Drag & drop gambar kulit'}
          </p>
          <p className="text-sm text-stone-400 mt-1">atau klik untuk memilih file</p>
          <p className="text-xs text-stone-300 mt-2">JPG atau PNG — Maks. 10 MB</p>
        </div>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onChange}
        />
      </label>
    </div>
  );
}