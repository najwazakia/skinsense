'use client';

import Link from 'next/link';
import { MessageCircle, ThumbsUp, Tag, ThumbsDown } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { safeFormatDistance } from '@/lib/date';
import type { Post } from '@/types';

interface Props {
  post: Post;
}

export default function PostCard({ post }: Props) {
  const upvoteCounts = post.upvoteCount;
  const downvoteCounts = post.downvoteCount

  const timeAgo = safeFormatDistance(
    post.createdAt,
    (d) => formatDistanceToNow(d, { addSuffix: true, locale: localeId }),
    'baru saja'
  );

  return (
    <Link href={`/forum/${post.id}`}>
      <article className="bg-white rounded-2xl border border-stone-100 p-5 hover:border-green-200 hover:shadow-md transition-all group space-y-3">
        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1 text-xs px-2 py-0.5 bg-green-50 text-green-700 rounded-full font-semibold"
              >
                <Tag className="w-2.5 h-2.5" />
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h3 className="font-zain text-xl font-bold text-stone-800 group-hover:text-green-700 transition-colors line-clamp-2">
          {post.title}
        </h3>

        {/* Content preview */}
        <p className="text-sm text-stone-500 line-clamp-2 leading-relaxed">
          {post.content}
        </p>

        {/* Footer */}
        <div className="flex items-center gap-4 text-sm text-stone-400 pt-1">
          <span className="flex items-center gap-1">
            <ThumbsUp className="w-3.5 h-3.5" />
            <span className={upvoteCounts > 0 ? 'text-green-600 font-semibold' : ''}>
              {upvoteCounts > 0 ? `${upvoteCounts}` : upvoteCounts}
            </span>
            <ThumbsDown className="w-3.5 h-3.5 ml-1" />
            <span className={downvoteCounts > 0 ? 'text-red-600 font-semibold' : ''}>
              {downvoteCounts > 0 ? `${downvoteCounts}` : downvoteCounts}
            </span>
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle className="w-3.5 h-3.5" />
            {post.commentsCount}
          </span>
          <span className="ml-auto text-xs">{timeAgo}</span>
        </div>
      </article>
    </Link>
  );
}