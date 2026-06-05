import { parseFirestoreDate } from "@/lib/date";
import { DetectionResult } from "@/types";
import { id as localeId } from 'date-fns/locale';
import { formatDistanceToNow } from "date-fns";
import { Clock, Scan } from "lucide-react";
import Image from "next/image";
import ConfidenceBadge from "./ConfidenceBadge";

export default function DetectionCard({ detection }: { detection: DetectionResult }) {
    const confidence = Number(detection.confidence);
    const date = parseFirestoreDate(detection.createdAt);
    const time = date
        ? formatDistanceToNow(date, { addSuffix: true, locale: localeId })
        : 'Beberapa saat yang lalu';

    const barColor =
        confidence >= 80 ? 'bg-green-500'
            : confidence >= 60 ? 'bg-yellow-400'
                : 'bg-red-400';

    return (
        <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden hover:border-green-200 hover:shadow-md transition-all group">
            <div className="relative h-44 bg-stone-50 overflow-hidden">
                {detection.image_URL ? (
                    <Image
                        src={detection.image_URL}
                        alt={detection.label}
                        fill
                        className="object-cover group-hover:scale-[1.03] transition-transform duration-300"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-green-50">
                        <Scan className="w-12 h-12 text-green-200" />
                    </div>
                )}
                {/* Badge persenan confidence di gambar */}
                <div className="absolute top-2.5 right-2.5">
                    <ConfidenceBadge value={confidence} />
                </div>
            </div>

            <div className="p-4 space-y-2.5">
                <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide">
                    Kondisi terdeteksi
                </p>
                <p className="font-zain text-xl font-extrabold text-stone-800 leading-tight">
                    {detection.label}
                </p>

                {/* Progress bar */}
                <div className="space-y-1">
                    <div className="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
                        <div
                            className={`${barColor} h-1.5 rounded-full transition-all duration-700`}
                            style={{ width: `${Math.min(confidence, 100)}%` }}
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between text-xs text-stone-400 pt-0.5">
                    <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {time}
                    </span>
                    <span className="font-semibold">{confidence.toFixed(1)}% yakin</span>
                </div>
            </div>
        </div>
    );
}