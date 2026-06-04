'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Scan, Clock, ChevronRight, AlertCircle, Lock, TrendingUp } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { getDetectionHistory } from '@/lib/api';
import { parseFirestoreDate } from '@/lib/date';
import { useAuth } from '@/context/AuthContext';
import type { DetectionResult } from '@/types';

// ─── Skeleton ────────────────────────────────────────────────
function DetectionSkeleton() {
    return (
        <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden animate-pulse">
            <div className="h-44 bg-stone-100" />
            <div className="p-4 space-y-2.5">
                <div className="h-3.5 bg-stone-100 rounded w-1/3" />
                <div className="h-6 bg-stone-100 rounded w-1/2" />
                <div className="h-1.5 bg-stone-100 rounded-full w-full" />
                <div className="flex justify-between">
                    <div className="h-3 bg-stone-100 rounded w-1/3" />
                    <div className="h-3 bg-stone-100 rounded w-1/4" />
                </div>
            </div>
        </div>
    );
}

// ─── Confidence badge ─────────────────────────────────────────
function ConfidenceBadge({ value }: { value: number }) {
    const cls =
        value >= 80 ? 'bg-green-100 text-green-700'
            : value >= 60 ? 'bg-yellow-100 text-yellow-700'
                : 'bg-red-100 text-red-700';
    return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${cls}`}>
            <TrendingUp className="w-2.5 h-2.5" />
            {value.toFixed(1)}%
        </span>
    );
}

// ─── Kartu deteksi ────────────────────────────────────────────
function DetectionCard({ det }: { det: DetectionResult }) {
    const confidence = Number(det.confidence);
    const date = parseFirestoreDate(det.createdAt);
    const timeAgo = date
        ? formatDistanceToNow(date, { addSuffix: true, locale: localeId })
        : 'Beberapa saat yang lalu';

    const barColor =
        confidence >= 80 ? 'bg-green-500'
            : confidence >= 60 ? 'bg-yellow-400'
                : 'bg-red-400';

    return (
        <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden hover:border-green-200 hover:shadow-md transition-all group">
            {/* Gambar */}
            <div className="relative h-44 bg-stone-50 overflow-hidden">
                {det.image_URL ? (
                    <Image
                        src={det.image_URL}
                        alt={det.label}
                        fill
                        className="object-cover group-hover:scale-[1.03] transition-transform duration-300"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-green-50">
                        <Scan className="w-12 h-12 text-green-200" />
                    </div>
                )}
                {/* Badge di atas gambar */}
                <div className="absolute top-2.5 right-2.5">
                    <ConfidenceBadge value={confidence} />
                </div>
            </div>

            {/* Info */}
            <div className="p-4 space-y-2.5">
                <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide">
                    Kondisi terdeteksi
                </p>
                <p className="font-zain text-xl font-extrabold text-stone-800 leading-tight">
                    {det.label}
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

                {/* Footer */}
                <div className="flex items-center justify-between text-xs text-stone-400 pt-0.5">
                    <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {timeAgo}
                    </span>
                    <span className="font-semibold">{confidence.toFixed(1)}% yakin</span>
                </div>
            </div>
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────
export default function HistoryPage() {
    const { user, loading: authLoading, isAnonymous } = useAuth();
    const [detections, setDetections] = useState<DetectionResult[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (authLoading) return;

        // Hanya ambil data untuk Google user
        if (isAnonymous || !user) {
            setLoading(false);
            return;
        }

        getDetectionHistory()
            .then(setDetections)
            .catch((err: unknown) => {
                const msg =
                    (err as { response?: { data?: { message?: string } } })?.response?.data?.message
                    ?? (err instanceof Error ? err.message : 'Gagal memuat riwayat');
                setError(msg);
            })
            .finally(() => setLoading(false));
    }, [authLoading, user, isAnonymous]);

    // ── Auth loading ──
    if (authLoading) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
                <div className="h-9 bg-stone-100 rounded w-48 animate-pulse" />
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => <DetectionSkeleton key={i} />)}
                </div>
            </div>
        );
    }

    // ── Guard: hanya Google user ──
    if (isAnonymous || !user) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-5">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <Lock className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="font-zain text-3xl font-extrabold text-stone-800">
                    Riwayat Tersimpan untuk Anggota
                </h2>
                <p className="text-stone-500 max-w-sm mx-auto">
                    Login dengan akun Google agar setiap hasil deteksi kulitmu tersimpan dan bisa dilihat kapan saja.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold text-sm transition-all shadow-md"
                    >
                        <Scan className="w-4 h-4" />
                        Coba Deteksi Dulu
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
            {/* Header */}
            <div className="flex items-end justify-between gap-4">
                <div>
                    <h1 className="font-zain text-3xl font-extrabold text-stone-800">Riwayat Deteksi</h1>
                    <p className="text-stone-500 text-sm mt-1">
                        Semua analisis kulit yang pernah kamu lakukan tersimpan di sini.
                    </p>
                </div>
                {!loading && detections.length > 0 && (
                    <span className="text-sm text-stone-400 shrink-0">
                        {detections.length} deteksi
                    </span>
                )}
            </div>

            {/* Error */}
            {error && (
                <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-xl text-red-700">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <div>
                        <p className="font-semibold text-sm">Gagal memuat riwayat</p>
                        <p className="text-sm mt-0.5">{error}</p>
                    </div>
                </div>
            )}

            {/* Loading skeleton */}
            {loading && (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => <DetectionSkeleton key={i} />)}
                </div>
            )}

            {/* Empty state */}
            {!loading && !error && detections.length === 0 && (
                <div className="text-center py-20 space-y-4">
                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto border-2 border-dashed border-green-200">
                        <Scan className="w-10 h-10 text-green-300" />
                    </div>
                    <div>
                        <p className="font-zain text-xl font-bold text-stone-600">
                            Belum Ada Riwayat Deteksi
                        </p>
                        <p className="text-stone-400 text-sm mt-1.5 max-w-xs mx-auto">
                            Mulai deteksi pertamamu dan hasilnya akan tersimpan otomatis di sini.
                        </p>
                    </div>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold text-sm transition-all shadow-md"
                    >
                        <Scan className="w-4 h-4" />
                        Mulai Deteksi
                    </Link>
                </div>
            )}

            {/* Grid deteksi */}
            {!loading && detections.length > 0 && (
                <>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {detections.map((det) => (
                            <DetectionCard key={det.id} det={det} />
                        ))}
                    </div>

                    {/* CTA bawah */}
                    <div className="flex justify-center pt-2">
                        <Link
                            href="/"
                            className="flex items-center gap-2 text-sm text-green-600 hover:text-green-800 font-semibold transition-colors"
                        >
                            Lakukan Deteksi Baru
                            <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>
                </>
            )}
        </div>
    );
}