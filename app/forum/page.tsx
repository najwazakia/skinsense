'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Loader2, Lock } from 'lucide-react';
import { getAllPosts } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import PostCard from '@/components/forum/PostCard';
import CreatePostModal from '@/components/forum/CreatePostModal';
import LoginModal from '@/components/ui/LoginModal';
import type { Post } from '@/types';

export default function ForumPage() {
  const { user, loading: authLoading } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const fetchPosts = useCallback(async (q?: string) => {
    setLoading(true);
    const data = await getAllPosts(q ? { title: q } : undefined);
    setPosts(data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPosts(search);
  };

  // Guard: perlu login untuk akses forum
  if (!authLoading && !user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <Lock className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="font-zain text-3xl font-extrabold text-stone-800">Forum Hanya untuk Anggota</h2>
        <p className="text-stone-500">
          Login dengan akun Google kamu untuk mengakses forum diskusi komunitas SkinSense.
        </p>
        <button
          onClick={() => setShowLoginModal(true)}
          className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-all shadow-md"
        >
          Masuk Sekarang
        </button>
        {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-zain text-3xl font-extrabold text-stone-800">Forum Diskusi</h1>
          <p className="text-stone-500 text-sm mt-1">
            Diskusikan kondisi kulit dan berbagi pengalaman bersama komunitas.
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-semibold transition-all shadow-sm hover:shadow-md shrink-0"
        >
          <Plus className="w-4 h-4" />
          Post Baru
        </button>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari diskusi..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 text-sm"
          />
        </div>
        <button type="submit"
          className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-sm font-semibold transition-colors">
          Cari
        </button>
      </form>

      {/* Posts */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-green-500" />
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-16 space-y-3">
          <p className="text-stone-400">Belum ada diskusi ditemukan.</p>
          <button onClick={() => setShowCreateModal(true)}
            className="text-green-600 font-semibold text-sm hover:underline">
            Mulai diskusi pertama →
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}

      {/* Modals */}
      {showCreateModal && (
        <CreatePostModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => { setShowCreateModal(false); fetchPosts(); }}
        />
      )}
    </div>
  );
}