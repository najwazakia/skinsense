'use client';

import { useState, FormEvent, KeyboardEvent } from 'react';
import { X, Tag, Loader2, ImagePlus, CheckCircle2, AlertCircle } from 'lucide-react';
import { updatePost } from '@/lib/api';
import { uploadToCloudinary } from '@/lib/cloudinary';
import type { Post } from '@/types';

interface Props {
    post: Post;
    onClose: () => void;
    onSuccess: () => void;
}

export default function EditPostModal({ post, onClose, onSuccess }: Props) {
    const [title, setTitle] = useState(post.title);
    const [content, setContent] = useState(post.content);
    const [tagInput, setTagInput] = useState('');
    const [tags, setTags] = useState<string[]>(post.tags);
    const [image, setImage] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [tagFeedback, setTagFeedback] = useState<string | null>(null);

    const showTagFeedback = (msg: string) => {
        setTagFeedback(msg);
        setTimeout(() => setTagFeedback(null), 2000);
    };

    const addTag = (value = tagInput) => {
        const trimmed = value.trim();
        if (!trimmed) return;
        if (tags.length >= 5) { showTagFeedback('Maksimal 5 tag'); return; }
        if (tags.map((t) => t.toLowerCase()).includes(trimmed.toLowerCase())) {
            showTagFeedback(`"${trimmed}" sudah ada`);
            setTagInput('');
            return;
        }
        setTags((prev) => [...prev, trimmed]);
        setTagInput('');
        showTagFeedback(`tag "${trimmed}" ditambahkan`);
    };

    const removeTag = (tag: string) => setTags((prev) => prev.filter((t) => t !== tag));

    const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag(); }
        if (e.key === 'Backspace' && !tagInput && tags.length > 0) {
            setTags((prev) => prev.slice(0, -1));
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);

        const finalTags = tagInput.trim()
            ? [...new Set([...tags, tagInput.trim()])]
            : tags;

        if (finalTags.length === 0) {
            setError('Tambahkan minimal 1 tag.');
            return;
        }

        setLoading(true);
        try {
            // Gunakan gambar baru jika ada, atau pertahankan yang lama
            let image_URL = post.image_URL ?? undefined;
            let cloudinary_public_id = undefined as string | undefined;

            if (image) {
                const uploaded = await uploadToCloudinary(image);
                image_URL = uploaded.image_URL;
                cloudinary_public_id = uploaded.cloudinary_public_id;
            }

            await updatePost(post.id, {
                title: title.trim(),
                content: content.trim(),
                tags: finalTags,
                image_URL,
                cloudinary_public_id,
            });
            onSuccess();
        } catch (err: unknown) {
            const axiosMsg = (err as { response?: { data?: { message?: string } } })
                ?.response?.data?.message;
            setError(axiosMsg ?? (err instanceof Error ? err.message : 'Gagal memperbarui postingan'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-5 border-b border-stone-100 sticky top-0 bg-white z-10">
                    <h2 className="font-zain text-2xl font-extrabold text-stone-800">Edit Postingan</h2>
                    <button onClick={onClose} className="p-1 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-50 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                    {error && (
                        <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-100 text-red-700 text-sm rounded-xl">
                            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                            {error}
                        </div>
                    )}

                    {/* Judul */}
                    <div>
                        <label className="block text-sm font-semibold text-stone-600 mb-1">Judul <span className="text-red-400">*</span></label>
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                            minLength={5} maxLength={100} required
                            className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 text-sm" />
                        <p className="text-xs text-stone-400 mt-1 text-right">{title.length}/100</p>
                    </div>

                    {/* Konten */}
                    <div>
                        <label className="block text-sm font-semibold text-stone-600 mb-1">Konten <span className="text-red-400">*</span></label>
                        <textarea value={content} onChange={(e) => setContent(e.target.value)}
                            minLength={10} required rows={5}
                            className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 text-sm resize-none" />
                    </div>

                    {/* Tags */}
                    <div>
                        <label className="block text-sm font-semibold text-stone-600 mb-1">
                            Tag <span className="text-red-400">*</span>
                            <span className="font-normal text-stone-400 ml-1">(maks. 5)</span>
                        </label>
                        {tags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mb-2">
                                {tags.map((tag) => (
                                    <span key={tag} className="flex items-center gap-1 text-xs px-2.5 py-1 bg-green-50 text-green-700 rounded-full font-semibold border border-green-100">
                                        {tag}
                                        <button type="button" onClick={() => removeTag(tag)} className="ml-0.5 hover:text-red-500 transition-colors">
                                            <X className="w-3 h-3" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                        <div className="flex gap-2">
                            <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={handleTagKeyDown} disabled={tags.length >= 5}
                                placeholder={tags.length >= 5 ? 'Maksimal 5 tag' : 'Ketik tag, tekan Enter...'}
                                className="flex-1 px-4 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 text-sm disabled:bg-stone-50 disabled:cursor-not-allowed" />
                            <button type="button" onClick={() => addTag()}
                                disabled={!tagInput.trim() || tags.length >= 5}
                                className="px-3 py-2.5 bg-green-100 text-green-700 rounded-xl hover:bg-green-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                                <Tag className="w-4 h-4" />
                            </button>
                        </div>
                        {tagFeedback && (
                            <p className={`flex items-center gap-1 text-xs mt-1.5 ${tagFeedback.includes('✓') ? 'text-green-600' : 'text-amber-600'}`}>
                                {tagFeedback.includes('✓') ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                                {tagFeedback}
                            </p>
                        )}
                    </div>

                    {/* Gambar */}
                    <div>
                        <label className="block text-sm font-semibold text-stone-600 mb-1">
                            Gambar <span className="font-normal text-stone-400">(opsional — kosongkan untuk pertahankan gambar lama)</span>
                        </label>
                        <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-stone-200 hover:border-green-300 cursor-pointer text-sm text-stone-500 transition-colors">
                            <ImagePlus className="w-4 h-4 text-green-500 shrink-0" />
                            <span className="truncate">{image ? image.name : post.image_URL ? 'Gambar saat ini tersimpan' : 'Pilih gambar baru...'}</span>
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => setImage(e.target.files?.[0] || null)} />
                        </label>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose}
                            className="flex-1 px-4 py-2.5 rounded-xl border border-stone-200 text-stone-600 font-semibold hover:bg-stone-50 transition-colors text-sm">
                            Batal
                        </button>
                        <button type="submit" disabled={loading}
                            className="flex-1 px-4 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-60">
                            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                            {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}