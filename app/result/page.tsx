'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import DetectionResult from '@/components/detection/DetectionResult';
import AIRecommendation from '@/components/detection/AIRecommendation';
import type {
  DetectionResult as DetectionResultType,
  AIRecommendation as AIRecommendationType,
} from '@/types';

function readSession<Session>(key: string): Session | null {
  if (typeof window === 'undefined') return null;
  const sessionData = sessionStorage.getItem(key);
  if (!sessionData) return null;
  try { return JSON.parse(sessionData) as Session; } catch { return null; }
}

export default function ResultPage() {
  const router = useRouter();

  const [detectionResult] = useState<DetectionResultType | null>(() =>
    readSession<DetectionResultType>('detectionResult'),
  );

  const [recommendation] = useState<AIRecommendationType | null>(() =>
    readSession<AIRecommendationType>('recommendation'),
  );

  const [imageUrl] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    return (
      sessionStorage.getItem('resultImageUrl') ||
      sessionStorage.getItem('previewUrl') ||
      null
    );
  });

  useEffect(() => {
    if (!detectionResult || !recommendation) {
      router.replace('/');
    }
  }, [detectionResult, recommendation, router]);

  if (!detectionResult || !recommendation) return null;

  const isCloudinaryImage = imageUrl && !imageUrl.startsWith('blob:');

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-stone-500 hover:text-green-700 font-semibold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </Link>
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-green-600 hover:text-green-800 font-semibold transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Deteksi Baru
        </Link>
      </div>

      <h1 className="font-zain text-3xl font-extrabold text-stone-800">Hasil Analisis</h1>

      {/* Render gambar */}
      {imageUrl && (
        <div className="rounded-2xl overflow-hidden border border-green-100 shadow-sm">
          {isCloudinaryImage ? (
            <Image
              src={imageUrl}
              alt="Gambar deteksi"
              width={600}
              height={300}
              className="w-full h-52 object-cover"
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt="Gambar deteksi"
              className="w-full h-52 object-cover"
            />
          )}
        </div>
      )}

      <DetectionResult result={detectionResult} />
      <AIRecommendation recommendation={recommendation} />

      <div className="bg-linear-to-br from-green-600 to-green-800 rounded-2xl p-6 text-white text-center space-y-3">
        <h3 className="font-zain text-2xl font-extrabold">Punya Pertanyaan Lebih Lanjut?</h3>
        <p className="text-green-100 text-sm">
          Diskusikan kondisi kulitmu bersama komunitas SkinSense di forum kami.
        </p>
        <Link
          href="/forum"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-white text-green-700 rounded-xl font-semibold text-sm hover:bg-green-50 transition-colors shadow-md"
        >
          Buka Forum Diskusi
        </Link>
      </div>
    </div>
  );
}