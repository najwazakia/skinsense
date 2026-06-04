import { Sparkles, BookOpen, Pill, ShieldAlert, Stethoscope } from 'lucide-react';
import type { AIRecommendation as AIRecommendationType } from '@/types';

interface Props {
  recommendation: AIRecommendationType;
}

const sections = [
  {
    key: 'deskripsi' as const,
    label: 'Deskripsi',
    icon: BookOpen,
    color: 'bg-blue-50 border-blue-100',
    iconColor: 'text-blue-600',
  },
  {
    key: 'penanganan' as const,
    label: 'Penanganan',
    icon: Stethoscope,
    color: 'bg-green-50 border-green-100',
    iconColor: 'text-green-600',
  },
  {
    key: 'obat_bebas' as const,
    label: 'Obat Bebas',
    icon: Pill,
    color: 'bg-emerald-50 border-emerald-100',
    iconColor: 'text-emerald-600',
  },
  {
    key: 'peringatan' as const,
    label: 'Peringatan',
    icon: ShieldAlert,
    color: 'bg-amber-50 border-amber-100',
    iconColor: 'text-amber-600',
  },
];

export default function AIRecommendation({ recommendation }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-green-100 p-6 shadow-sm space-y-4">
      <div className="flex items-center gap-2 text-green-700">
        <Sparkles className="w-5 h-5" />
        <h3 className="font-zain text-xl font-bold">Rekomendasi AI</h3>
        <span className="ml-auto text-xs px-2 py-0.5 bg-green-100 text-green-600 rounded-full font-semibold">
          Gemini 3.5 Flash
        </span>
      </div>

      <div className="grid gap-3">
        {sections.map(({ key, label, icon: Icon, color, iconColor }) => (
          <div key={key} className={`rounded-xl border p-4 ${color}`}>
            <div className="flex items-center gap-2 mb-2">
              <Icon className={`w-4 h-4 ${iconColor}`} />
              <span className={`text-xs font-bold uppercase tracking-wide ${iconColor}`}>{label}</span>
            </div>
            <p className="text-sm text-stone-700 leading-relaxed">{recommendation[key]}</p>
          </div>
        ))}
      </div>
    </div>
  );
}