import { CheckCircle, Microscope, TrendingUp } from 'lucide-react';
import type { DetectionResult as DetectionResultType } from '@/types';

interface Props {
  result: DetectionResultType;
}

export default function DetectionResult({ result }: Props) {
  const confidenceColor =
    result.confidence >= 80
      ? 'text-green-600 bg-green-50'
      : result.confidence >= 60
      ? 'text-yellow-600 bg-yellow-50'
      : 'text-red-600 bg-red-50';

  return (
    <div className="bg-white rounded-2xl border border-green-100 p-6 shadow-sm space-y-4">
      <div className="flex items-center gap-2 text-green-700">
        <Microscope className="w-5 h-5" />
        <h3 className="font-zain text-xl font-bold">Hasil Deteksi</h3>
      </div>

      <div className="flex items-start gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-xs font-semibold text-stone-400 uppercase tracking-wide">
              Kondisi Terdeteksi
            </span>
          </div>
          <p className="font-zain text-3xl font-extrabold text-stone-800">{result.label}</p>
        </div>

        <div className={`flex items-center gap-2 px-4 py-3 rounded-xl font-bold ${confidenceColor}`}>
          <TrendingUp className="w-4 h-4" />
          <span className="text-2xl font-zain">{result.confidence}%</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-stone-400">
          <span>Tingkat Kepercayaan</span>
          <span>{result.confidence}%</span>
        </div>
        <div className="w-full bg-stone-100 rounded-full h-2">
          <div
            className="bg-linear-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-700"
            style={{ width: `${Math.min(result.confidence, 100)}%` }}
          />
        </div>
      </div>

      <p className="text-xs text-stone-400 italic">
        * Hasil ini bukan pengganti diagnosis dokter. Konsultasikan dengan dermatologis untuk penanganan yang tepat.
      </p>
    </div>
  );
}