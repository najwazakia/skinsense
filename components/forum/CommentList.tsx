'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Send, Loader2, LogIn, AlertCircle } from 'lucide-react';
import { getComments, createComment } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import CommentItem from './CommentItem';
import type { Comment } from '@/types';

interface Props {
  postId: string;
}

export default function CommentList({ postId }: Props) {
  const { user, isAnonymous } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const fetchComments = useCallback(async () => {
    if (isAnonymous || !user) {
      // Endpoint getComments menggunakan requireAuth di server —
      // anonymous user tidak bisa mengakses, jadi tidak perlu fetch.
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await getComments(postId);
      setComments(data);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message
        ?? (err instanceof Error ? err.message : 'Gagal memuat komentar');
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [postId, user, isAnonymous]);

  useEffect(() => { fetchComments(); }, [fetchComments]);
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';

      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [text]);

  const handleSubmit = async () => {
    if (!text.trim() || !user) return;
    setSubmitting(true);
    try {
      await createComment(postId, text.trim());
      setText('');
      await fetchComments();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message ?? 'Gagal mengirim komentar';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="space-y-4">
      <h4 className="font-zain text-lg font-bold text-stone-700">
        Komentar {!loading && !isAnonymous && `(${comments.length})`}
      </h4>

      {/* Input komentar — hanya untuk Google user */}
      {!isAnonymous && user && (
        <div className="flex gap-3 items-center">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Tulis komentar... (Ctrl+Enter untuk kirim)"
            rows={1}
            className="flex-1 px-4 py-3 text-sm rounded-xl border border-stone-200 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 resize-none overflow-hidden"
          />
          <button
            onClick={handleSubmit}
            disabled={submitting || !text.trim()}
            className="self-end px-4 py-3 cursor-pointer bg-green-600 hover:bg-green-700 text-white rounded-xl transition-colors disabled:opacity-50"
          >
            {submitting
              ? <Loader2 className="w-4 h-4 animate-spin" />
              : <Send className="w-4 h-4" />
            }
          </button>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {/* State: anonymous user */}
      {isAnonymous && (
        <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-100 rounded-xl">
          <LogIn className="w-4 h-4 text-green-600 shrink-0" />
          <p className="text-sm text-green-700">
            <span className="font-semibold">Login dengan Google</span> untuk melihat dan
            menulis komentar.
          </p>
        </div>
      )}

      {/* Loading */}
      {loading && !isAnonymous && (
        <div className="flex justify-center py-6">
          <Loader2 className="w-6 h-6 animate-spin text-green-500" />
        </div>
      )}

      {/* Komentar list */}
      {!loading && !isAnonymous && (
        comments.length === 0 ? (
          <p className="text-center text-sm text-stone-400 py-8">
            Belum ada komentar. Jadilah yang pertama!
          </p>
        ) : (
          <div>
            {comments.map((comment) => (
              <CommentItem
                key={comment.id}
                postId={postId}
                comment={comment}
                onRefresh={fetchComments}
              />
            ))}
          </div>
        )
      )}
    </div>
  );
}