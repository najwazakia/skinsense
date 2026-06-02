'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft, ThumbsUp, ThumbsDown, Tag,
  Loader2, Pencil, Trash2, User
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { getPostById, votePost, deletePost } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import CommentList from '@/components/forum/CommentList';
import type { Post } from '@/types';

export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [voteLoading, setVoteLoading] = useState(false);

  useEffect(() => {
    getPostById(id).then((data) => {
      setPost(data);
      setLoading(false);
    });
  }, [id]);

  const handleVote = async (type: 'upvote' | 'downvote') => {
    if (!user) return;
    setVoteLoading(true);
    await votePost(id, type);
    const updated = await getPostById(id);
    setPost(updated);
    setVoteLoading(false);
  };

  const handleDelete = async () => {
    if (!confirm('Hapus postingan ini?')) return;
    await deletePost(id);
    router.push('/forum');
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-10 h-10 animate-spin text-green-500" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-stone-500">Postingan tidak ditemukan.</p>
        <Link href="/forum" className="text-green-600 font-semibold mt-4 block">← Kembali ke Forum</Link>
      </div>
    );
  }

  const netVote = post.upvoteCount - post.downvoteCount;

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
      {/* Back */}
      <Link href="/forum" className="flex items-center gap-2 text-sm text-stone-500 hover:text-green-700 font-semibold transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Forum
      </Link>

      {/* Post */}
      <article className="bg-white rounded-2xl border border-stone-100 p-6 shadow-sm space-y-5">
        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <span key={tag}
                className="flex items-center gap-1 text-xs px-2.5 py-1 bg-green-50 text-green-700 rounded-full font-semibold">
                <Tag className="w-2.5 h-2.5" />
                {tag}
              </span>
            ))}
          </div>
        )}

        <h1 className="font-zain text-3xl font-extrabold text-stone-800">{post.title}</h1>

        {/* Author */}
        {post.author && (
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {post.author.photo_URL ? (
                <Image
                  src={post.author.photo_URL}
                  alt={post.author.name}
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
                  {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: localeId })}
                </p>
              </div>
            </div>

            {post.is_author && (
              <div className="flex items-center gap-1">
                <button className="p-1.5 rounded-lg text-stone-400 hover:text-green-600 hover:bg-green-50 transition-colors">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={handleDelete}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Image */}
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

        {/* Content */}
        <p className="text-stone-700 leading-relaxed whitespace-pre-wrap">{post.content}</p>

        {/* Votes */}
        <div className="flex items-center gap-3 pt-2 border-t border-stone-50">
          <button
            onClick={() => handleVote('upvote')}
            disabled={!user || voteLoading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-stone-200 hover:border-green-300 hover:bg-green-50 hover:text-green-700 disabled:opacity-40 transition-all text-sm font-semibold text-stone-600"
          >
            <ThumbsUp className="w-4 h-4" />
            {post.upvoteCount}
          </button>
          <button
            onClick={() => handleVote('downvote')}
            disabled={!user || voteLoading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-stone-200 hover:border-red-300 hover:bg-red-50 hover:text-red-600 disabled:opacity-40 transition-all text-sm font-semibold text-stone-600"
          >
            <ThumbsDown className="w-4 h-4" />
            {post.downvoteCount}
          </button>
          <span className={`text-sm font-bold ml-2 ${netVote > 0 ? 'text-green-600' : netVote < 0 ? 'text-red-500' : 'text-stone-400'}`}>
            {netVote > 0 ? `+${netVote}` : netVote} poin
          </span>
          {voteLoading && <Loader2 className="w-4 h-4 animate-spin text-green-500 ml-auto" />}
        </div>
      </article>

      {/* Comments */}
      <div className="bg-white rounded-2xl border border-stone-100 p-6 shadow-sm">
        <CommentList postId={id} />
      </div>
    </div>
  );
}