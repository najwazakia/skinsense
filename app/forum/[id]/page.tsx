'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft, ThumbsUp, ThumbsDown, Tag,
  Loader2, Pencil, Trash2, User, AlertCircle,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { parseFirestoreDate } from '@/lib/date';
import { getPostById, votePost, deletePost } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import CommentList from '@/components/forum/CommentList';
import EditPostModal from '@/components/forum/EditPostModal';
import type { Post } from '@/types';

export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [voteLoading, setVoteLoading] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [confirmationDelete, setConfimationDelete] = useState(false);

  const loadPost = async () => {
    try {
      const data = await getPostById(id);
      setPost(data);
    } catch (err: unknown) {
      const axiosMsg = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message;
      setError(axiosMsg ?? 'Gagal memuat postingan');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadPost(); }, [id]);

  const handleVote = async (type: 'upvote' | 'downvote') => {
    if (!user) return;
    setVoteLoading(true);
    try {
      await votePost(id, type);
      const updatedPost = await getPostById(id);
      setPost(updatedPost);
    } catch {
    } finally {
      setVoteLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deletePost(id);
      router.push('/forum');
    } catch (err: unknown) {
      const errorMessage = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message ?? 'Gagal menghapus postingan';
      setError(errorMessage);
      setConfimationDelete(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-10 h-10 animate-spin text-green-500" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8 text-red-400" />
        </div>
        <p className="text-stone-600 font-semibold">{error ?? 'Postingan tidak ditemukan.'}</p>
        <Link href="/forum" className="text-green-600 font-semibold text-sm hover:underline">
          ← Kembali ke Forum
        </Link>
      </div>
    );
  }

  const createdAt = parseFirestoreDate(post.createdAt);

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
      <Link href="/forum" className="flex items-center gap-2 text-sm text-stone-500 hover:text-green-700 font-semibold transition-colors w-fit">
        <ArrowLeft className="w-4 h-4" />
        Forum
      </Link>

      <article className="bg-white rounded-2xl border border-stone-100 p-6 shadow-sm space-y-5">
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <span key={tag} className="flex items-center gap-1 text-xs px-2.5 py-1 bg-green-50 text-green-700 rounded-full font-semibold">
                <Tag className="w-2.5 h-2.5" />
                {tag}
              </span>
            ))}
          </div>
        )}

        <h1 className="font-zain text-3xl font-extrabold text-stone-800 wrap-break-word" >{post.title}</h1>

        {/* Foto profil author dan informasi lain */}
        {post.author && (
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {post.author.photo_URL ? (
                <Image
                  src={post.author.photo_URL}
                  alt={post.author.name ?? 'User'}
                  width={36}
                  height={36}
                  className="rounded-full border border-green-100"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center">
                  <User className="w-4 h-4 text-green-600" />
                </div>
              )}
              <div>
                <p className="text-sm font-semibold text-stone-700">{post.author.name}</p>
                <p className="text-xs text-stone-400">
                  {createdAt
                    ? formatDistanceToNow(createdAt, { addSuffix: true, locale: localeId })
                    : 'Beberapa saat yang lalu'}
                </p>
              </div>
            </div>

            {/* Edit & Hapus Postingan */}
            {post.is_author && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setShowEdit(true)}
                  className="flex cursor-pointer items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-stone-500 hover:text-green-600 hover:bg-green-50 transition-colors text-xs font-semibold"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  Edit
                </button>
                {!confirmationDelete ? (
                  <button
                    onClick={() => setConfimationDelete(true)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-stone-500 hover:text-red-500 hover:bg-red-50 transition-colors text-xs font-semibold"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Hapus
                  </button>
                ) : (
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-stone-500 mr-1">Yakin?</span>
                    <button
                      onClick={handleDelete}
                      className="px-2.5 py-1.5 rounded-lg bg-red-500 text-white text-xs font-semibold hover:bg-red-600 transition-colors cursor-pointer"
                    >
                      Ya, Hapus
                    </button>
                    <button
                      onClick={() => setConfimationDelete(false)}
                      className="px-2.5 py-1.5 rounded-lg bg-stone-100 text-stone-600 text-xs font-semibold hover:bg-stone-200 transition-colors cursor-pointer"
                    >
                      Batal
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Gambar postingan */}
        {post.image_URL && (
          <div className="rounded-xl overflow-hidden border border-stone-100">
            <Image
              src={post.image_URL}
              alt="Post image"
              width={600}
              height={400}
              className="w-full object-cover max-h-80"
            />
          </div>
        )}

        {/* Konten postingan */}
        <p className="text-stone-700 leading-relaxed whitespace-pre-wrap wrap-break-word">{post.content}</p>

        {/* Votes */}
        <div className="flex items-center gap-3 pt-2 border-t border-stone-50">
          <button
            onClick={() => handleVote('upvote')}
            disabled={!user || voteLoading}
            title={!user ? 'Login untuk vote' : ''}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-stone-200 hover:border-green-300 hover:bg-green-50 hover:text-green-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-sm font-semibold text-stone-600 cursor-pointer"
          >
            <ThumbsUp className="w-4 h-4" />
            {post.upvoteCount}
          </button>
          <button
            onClick={() => handleVote('downvote')}
            disabled={!user || voteLoading}
            title={!user ? 'Login untuk vote' : ''}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-stone-200 hover:border-red-300 hover:bg-red-50 hover:text-red-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-sm font-semibold text-stone-600 cursor-pointer"
          >
            <ThumbsDown className="w-4 h-4" />
            {post.downvoteCount}
          </button>
          {voteLoading && <Loader2 className="w-4 h-4 animate-spin text-green-500 ml-auto" />}
          {!user && (
            <span className="text-xs text-stone-400 ml-auto">Login untuk vote</span>
          )}
        </div>
      </article>

      <div className="bg-white rounded-2xl border border-stone-100 p-6 shadow-sm">
        <CommentList postId={id} />
      </div>

      {/* Modal Edit Postingan */}
      {showEdit && (
        <EditPostModal
          post={post}
          onClose={() => setShowEdit(false)}
          onSuccess={async () => {
            setShowEdit(false);
            await loadPost();
          }}
        />
      )}
    </div>
  );
}