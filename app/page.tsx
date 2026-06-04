'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDetection } from '@/hooks/useDetection';
import UploadZone from '@/components/detection/UploadZone';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Scan, ArrowRight, AlertCircle } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const {
    isUploading,
    isDetecting,
    isLoadingRecommendation,
    detectionResult,
    recommendation,
    error,
    previewUrl,
    detectImage,
    reset,
  } = useDetection();

  const isLoading = isUploading || isDetecting || isLoadingRecommendation;

  const loadingLabel = isUploading
    ? 'Mengupload gambar...'
    : isDetecting
      ? 'Menganalisis kondisi kulit...'
      : 'Mengambil rekomendasi AI...';

  useEffect(() => {
    if (detectionResult && recommendation) {
      sessionStorage.setItem('detectionResult', JSON.stringify(detectionResult));
      sessionStorage.setItem('recommendation', JSON.stringify(recommendation));
      // Simpan Cloudinary URL (bukan blob) agar tetap valid setelah navigasi/refresh
      sessionStorage.setItem('resultImageUrl', detectionResult.image_URL || '');
      // Tetap simpan blob untuk preview sementara jika tersedia
      sessionStorage.setItem('previewUrl', previewUrl || '');
      router.push('/result');
    }
  }, [detectionResult, recommendation, previewUrl, router]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 space-y-8">
      {/* Hero */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
          <Scan className="w-4 h-4" />
          Deteksi Penyakit Kulit
        </div>
        <h1 className="font-zain text-4xl md:text-5xl font-extrabold text-stone-800 leading-tight">
          Kenali Kondisi <span className="text-green-600">Kulitmu</span>
        </h1>
        <p className="text-stone-500 max-w-md mx-auto leading-relaxed">
          Upload foto kondisi kulit kamu, dan biarkan AI kami menganalisis serta memberikan rekomendasi penanganan yang tepat.
        </p>
      </div>

      {/* Upload */}
      <UploadZone
        onFileSelect={detectImage}
        previewUrl={previewUrl}
        onReset={reset}
        isLoading={isLoading}
      />

      {/* Loading */}
      {isLoading && <LoadingSpinner label={loadingLabel} />}

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-xl text-red-700">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-sm">Terjadi Kesalahan</p>
            <p className="text-sm mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Tips */}
      {!previewUrl && !isLoading && (
        <div className="bg-green-50 rounded-2xl p-5 border border-green-100 space-y-2">
          <p className="font-zain font-bold text-green-800">Tips untuk hasil terbaik:</p>
          <ul className="text-sm text-green-700 space-y-1.5">
            {[
              'Pastikan foto jernih dan terang',
              'Fokuskan kamera pada area yang ingin dideteksi',
              'Gunakan cahaya alami jika memungkinkan',
              'Hindari bayangan yang menutupi area kulit',
            ].map((tip, i) => (
              <li key={i} className="flex items-start gap-2">
                <ArrowRight className="w-3.5 h-3.5 mt-0.5 text-green-500 shrink-0" />
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}