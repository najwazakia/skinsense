'use client';

import { useState, FormEvent } from 'react';
import { X, Tag, Loader2, ImagePlus } from 'lucide-react';
import { createPost } from '@/lib/api';
import { uploadToCloudinary } from '@/lib/cloudinary';

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreatePostModal({ onClose, onSuccess }: Props) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && tags.length < 5 && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => setTags(tags.filter((t) => t !== tag));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      let image_URL: string | undefined;
      let cloudinary_public_id: string | undefined;

      if (image) {
        const uploaded = await uploadToCloudinary(image);
        image_URL = uploaded.image_URL;
        cloudinary_public_id = uploaded.cloudinary_public_id;
      }

      await createPost({ title, content, tags, image_URL, cloudinary_public_id });
      onSuccess();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Gagal membuat postingan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-stone-100">
          <h2 className="font-zain text-2xl font-extrabold text-stone-800">Buat Postingan</h2>
          <button onClick={onClose}><X className="w-5 h-5 text-stone-400" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>
          )}

          <div>
            <label className="block text-sm font-semibold text-stone-600 mb-1">Judul *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              minLength={5}
              maxLength={100}
              required
              placeholder="Apa yang ingin kamu diskusikan?"
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-stone-600 mb-1">Konten *</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              minLength={10}
              required
              rows={5}
              placeholder="Ceritakan lebih lengkap..."
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 text-sm resize-none"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-semibold text-stone-600 mb-1">
              Tag (maks. 5)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                placeholder="Contoh: Acne"
                className="flex-1 px-4 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 text-sm"
              />
              <button type="button" onClick={addTag}
                className="px-3 py-2.5 bg-green-100 text-green-700 rounded-xl hover:bg-green-200 transition-colors">
                <Tag className="w-4 h-4" />
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {tags.map((tag) => (
                  <span key={tag}
                    className="flex items-center gap-1 text-xs px-2.5 py-1 bg-green-50 text-green-700 rounded-full font-semibold">
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Image upload */}
          <div>
            <label className="block text-sm font-semibold text-stone-600 mb-1">
              Gambar (opsional)
            </label>
            <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-stone-200 hover:border-green-300 cursor-pointer text-sm text-stone-500 transition-colors">
              <ImagePlus className="w-4 h-4 text-green-500" />
              {image ? image.name : 'Pilih gambar...'}
              <input type="file" accept="image/*" className="hidden"
                onChange={(e) => setImage(e.target.files?.[0] || null)} />
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
              {loading ? 'Memposting...' : 'Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}