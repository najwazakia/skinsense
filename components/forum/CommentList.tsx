'use client';

import { useState, useEffect, useCallback } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { getComments, createComment } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import CommentItem from './CommentItem';
import type { Comment } from '@/types';

interface Props {
  postId: string;
}

export default function CommentList({ postId }: Props) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchComments = useCallback(async () => {
    setLoading(true);
    const data = await getComments(postId);
    setComments(data);
    setLoading(false);
  }, [postId]);

  useEffect(() => { fetchComments(); }, [fetchComments]);

  const handleSubmit = async () => {
    if (!text.trim()) return;
    setSubmitting(true);
    await createComment(postId, text.trim());
    setText('');
    setSubmitting(false);
    fetchComments();
  };

  return (
    <div className="space-y-4">
      <h4 className="font-zain text-lg font-bold text-stone-700">
        Komentar ({comments.length})
      </h4>

      {/* Input */}
      {user && (
        <div className="flex gap-3">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Tulis komentar..."
            rows={2}
            className="flex-1 px-4 py-3 text-sm rounded-xl border border-stone-200 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 resize-none"
          />
          <button
            onClick={handleSubmit}
            disabled={submitting || !text.trim()}
            className="self-end px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-colors disabled:opacity-50"
          >
            {submitting
              ? <Loader2 className="w-4 h-4 animate-spin" />
              : <Send className="w-4 h-4" />
            }
          </button>
        </div>
      )}

      {/* Comments */}
      {loading ? (
        <div className="flex justify-center py-6">
          <Loader2 className="w-6 h-6 animate-spin text-green-500" />
        </div>
      ) : comments.length === 0 ? (
        <p className="text-center text-sm text-stone-400 py-8">Belum ada komentar. Jadilah yang pertama!</p>
      ) : (
        <div>
          {comments.map((c) => (
            <CommentItem key={c.id} postId={postId} comment={c} onRefresh={fetchComments} />
          ))}
        </div>
      )}
    </div>
  );
}