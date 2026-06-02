'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import DetectionResult from '@/components/detection/DetectionResult';
import AIRecommendation from '@/components/detection/AIRecommendation';
import type { DetectionResult as DetectionResultType, AIRecommendation as AIRecommendationType } from '@/types';

export default function ResultPage() {
  const router = useRouter();
  const [detectionResult, setDetectionResult] = useState<DetectionResultType | null>(null);
  const [recommendation, setRecommendation] = useState<AIRecommendationType | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    const dr = sessionStorage.getItem('detectionResult');
    const rec = sessionStorage.getItem('recommendation');
    const prev = sessionStorage.getItem('previewUrl');

    if (!dr || !rec) {
      router.replace('/');
      return;
    }

    setDetectionResult(JSON.parse(dr));
    setRecommendation(JSON.parse(rec));
    setPreviewUrl(prev || null);
  }, [router]);

  if (!detectionResult || !recommendation) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
      {/* Back */}
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-sm text-stone-500 hover:text-green-700 font-semibold transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </Link>
        <Link href="/"
          className="flex items-center gap-2 text-sm text-green-600 hover:text-green-800 font-semibold transition-colors">
          <RotateCcw className="w-4 h-4" />
          Deteksi Baru
        </Link>
      </div>

      <h1 className="font-zain text-3xl font-extrabold text-stone-800">Hasil Analisis</h1>

      {/* Preview gambar */}
      {previewUrl && (
        <div className="rounded-2xl overflow-hidden border border-green-100 shadow-sm">
          <Image
            src={previewUrl}
            alt="Gambar yang dideteksi"
            width={600}
            height={300}
            className="w-full h-52 object-cover"
          />
        </div>
      )}

      {/* Section 1: Hasil deteksi */}
      <DetectionResult result={detectionResult} />

      {/* Section 2: Rekomendasi AI */}
      <AIRecommendation recommendation={recommendation} />

      {/* CTA Forum */}
      <div className="bg-linear-to-br from-green-600 to-green-800 rounded-2xl p-6 text-white text-center space-y-3">
        <h3 className="font-zain text-2xl font-extrabold">Punya Pertanyaan Lebih Lanjut?</h3>
        <p className="text-green-100 text-sm">
          Diskusikan kondisi kulitmu bersama komunitas SkinSense di forum kami.
        </p>
        <Link href="/forum"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-white text-green-700 rounded-xl font-semibold text-sm hover:bg-green-50 transition-colors shadow-md">
          Buka Forum Diskusi
        </Link>
      </div>
    </div>
  );
}