'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Pencil, Trash2, Check, X, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { parseFirestoreDate } from '@/lib/date';
import { updateComment, deleteComment } from '@/lib/api';
import type { Comment } from '@/types';

interface Props {
  postId: string;
  comment: Comment;
  onRefresh: () => void;
}

export default function CommentItem({ postId, comment, onRefresh }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.text);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    if (!editText.trim()) return;
    setLoading(true);
    await updateComment(postId, comment.id, editText);
    setIsEditing(false);
    setLoading(false);
    onRefresh();
  };

  const handleDelete = async () => {
    if (!confirm('Hapus komentar ini?')) return;
    setLoading(true);
    await deleteComment(postId, comment.id);
    setLoading(false);
    onRefresh();
  };

  return (
    <div className="flex gap-3 py-4 border-b border-stone-50 last:border-0">
      <div className="shrink-0">
        {comment.author.photo_URL ? (
          <Image
            src={comment.author.photo_URL}
            alt={comment.author.name ?? 'User'}
            width={36}
            height={36}
            className="rounded-full border border-green-100"
          />
        ) : (
          <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center">
            <User className="w-4 h-4 text-green-600" />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-stone-700">{comment.author.name}</span>
            <span className="text-xs text-stone-400">
              {(() => {
                const parsedDate = parseFirestoreDate(comment.createdAt);
                return parsedDate
                  ? formatDistanceToNow(parsedDate, { addSuffix: true, locale: localeId })
                  : 'Beberapa saat yang lalu';
              })()}
            </span>
          </div>
          {comment.is_author && !isEditing && (
            <div className="flex items-center gap-1">
              <button onClick={() => setIsEditing(true)}
                className="p-1 rounded text-stone-400 hover:text-green-600 hover:bg-green-50 transition-colors">
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button onClick={handleDelete} disabled={loading}
                className="p-1 rounded text-stone-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {isEditing ? (
          <div className="mt-2 space-y-2">
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 text-sm rounded-lg border border-green-200 focus:outline-none focus:border-green-400 resize-none"
            />
            <div className="flex gap-2">
              <button onClick={handleUpdate} disabled={loading}
                className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white text-xs rounded-lg font-semibold">
                <Check className="w-3 h-3" /> Simpan
              </button>
              <button onClick={() => setIsEditing(false)}
                className="flex items-center gap-1 px-3 py-1 bg-stone-100 text-stone-600 text-xs rounded-lg font-semibold">
                <X className="w-3 h-3" /> Batal
              </button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-stone-600 mt-1 leading-relaxed">{comment.text}</p>
        )}
      </div>
    </div>
  );
}