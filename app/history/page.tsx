'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Scan, ChevronRight, AlertCircle, Lock } from 'lucide-react';
import { getDetectionHistory } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import type { DetectionResult } from '@/types';
import DetectionSkeleton from '@/components/history/DetectionSkeleton';
import DetectionCard from '@/components/history/DetectionCard';

export default function HistoryPage() {
    const { user, loading: authLoading, isAnonymous } = useAuth();
    const [detections, setDetections] = useState<DetectionResult[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (authLoading) return;

        if (isAnonymous || !user) {
            setLoading(false);
            return;
        }

        getDetectionHistory()
            .then(setDetections)
            .catch((err: unknown) => {
                const errorMessage =
                    (err as { response?: { data?: { message?: string } } })?.response?.data?.message
                    ?? (err instanceof Error ? err.message : 'Gagal menampilkan riwayat deteksi');
                setError(errorMessage);
            })
            .finally(() => setLoading(false));
    }, [authLoading, user, isAnonymous]);

    if (authLoading) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
                <div className="h-9 bg-stone-100 rounded w-48 animate-pulse" />
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((item, index) => <DetectionSkeleton key={index} />)}
                </div>
            </div>
        );
    }

    if (isAnonymous || !user) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-5">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <Lock className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="font-zain text-3xl font-extrabold text-stone-800">
                    Riwayat Deteksi untuk User
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
                        Deteksi yuk!
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
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

            {error && (
                <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-xl text-red-700">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <div>
                        <p className="font-semibold text-sm">Gagal menampilkan riwayat</p>
                        <p className="text-sm mt-0.5">{error}</p>
                    </div>
                </div>
            )}

            {loading && (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((item, index) => <DetectionSkeleton key={index} />)}
                </div>
            )}

            {/* jika tidak ada riwayat deteksi */}
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
                            Mulai deteksi pertamamu dan hasilnya akan tersimpan di sini.
                        </p>
                    </div>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold text-sm transition-all shadow-md"
                    >
                        <Scan className="w-4 h-4" />
                        Deteksi yuk!
                    </Link>
                </div>
            )}

            {/* list riawayat deteksi */}
            {!loading && detections.length > 0 && (
                <>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {detections.map((detection) => (
                            <DetectionCard key={detection.id} detection={detection} />
                        ))}
                    </div>

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