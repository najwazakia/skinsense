import axios from 'axios';
import { auth } from './firebase';
import type {
  ApiResponse, DetectionResult, AIRecommendation,
  Post, Comment, User,
} from '@/types';

/**
 * baseURL = '/api'  →  request dikirim ke /api/* (same-origin)
 * Next.js rewrite di next.config.ts mem-proxy ke http://localhost:5000/*
 * sehingga tidak ada CORS issue dari browser.
 *
 * Anda TIDAK perlu mengubah NEXT_PUBLIC_API_BASE_URL di .env untuk
 * kebutuhan ini. Env var tersebut hanya dibaca oleh next.config.ts
 * sebagai tujuan rewrite.
 */
const api = axios.create({ baseURL: '/api' });

// ─── Token helpers ──────────────────────────────────────────────────────────

/** Token Firebase milik user saat ini (Google atau Anonymous). */
async function getToken(): Promise<string | null> {
  const user = auth.currentUser;
  if (!user) return null;
  return user.getIdToken();
}

/** Header untuk endpoint optionalAuth — menerima token Google maupun Anonymous. */
async function authHeaders(): Promise<Record<string, string>> {
  const token = await getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * Header untuk endpoint requireAuth — hanya menerima token Google.
 * Lempar error lokal jika user belum login atau masih anonymous.
 */
async function requireAuthHeaders(): Promise<Record<string, string>> {
  const user = auth.currentUser;
  if (!user || user.isAnonymous) throw new Error('Login diperlukan');
  const token = await user.getIdToken();
  return { Authorization: `Bearer ${token}` };
}

// ─── Auth ───────────────────────────────────────────────────────────────────

export async function loginWithGoogle(): Promise<User> {
  const headers = await requireAuthHeaders();
  const res = await api.post<ApiResponse<User>>('/auth/google', {}, { headers });
  return res.data.data;
}

// ─── Detection ──────────────────────────────────────────────────────────────

export async function createDetection(
  image_URL: string,
  cloudinary_public_id: string,
): Promise<DetectionResult> {
  const headers = await authHeaders();
  const res = await api.post<ApiResponse<DetectionResult>>(
    '/detection',
    { image_URL, cloudinary_public_id },
    { headers },
  );
  return res.data.data;
}

export async function getDetectionHistory(): Promise<DetectionResult[]> {
  const headers = await authHeaders();
  const res = await api.get<ApiResponse<DetectionResult[]>>('/detection', { headers });
  return res.data.data;
}

export async function getAIRecommendation(
  detections: { label: string; confidence: number }[],
): Promise<AIRecommendation> {
  const headers = await authHeaders();
  const res = await api.post<ApiResponse<AIRecommendation>>(
    '/detection/recommendation',
    { detections },
    { headers },
  );
  return res.data.data;
}

// ─── Forum — Posts ──────────────────────────────────────────────────────────

export async function getAllPosts(params?: { title?: string }): Promise<Post[]> {
  const headers = await authHeaders();
  const endpoint = params?.title ? '/forum/posts/search' : '/forum/posts';
  const res = await api.get<ApiResponse<Post[]>>(endpoint, { headers, params });
  return res.data.data;
}

export async function getPostById(id: string): Promise<Post> {
  const headers = await authHeaders();
  const res = await api.get<ApiResponse<Post>>(`/forum/posts/${id}`, { headers });
  return res.data.data;
}

export async function getMyPosts(): Promise<Post[]> {
  const headers = await requireAuthHeaders();
  const res = await api.get<ApiResponse<Post[]>>('/forum/posts/me', { headers });
  return res.data.data;
}

export async function createPost(data: {
  title: string;
  content: string;
  tags: string[];
  image_URL?: string;
  cloudinary_public_id?: string;
}): Promise<void> {
  const headers = await requireAuthHeaders();
  await api.post('/forum/posts', data, { headers });
}

export async function updatePost(
  id: string,
  data: {
    title: string;
    content: string;
    tags: string[];
    image_URL?: string;
    cloudinary_public_id?: string;
  },
): Promise<void> {
  const headers = await requireAuthHeaders();
  await api.put(`/forum/posts/${id}`, data, { headers });
}

export async function deletePost(id: string): Promise<void> {
  const headers = await requireAuthHeaders();
  await api.delete(`/forum/posts/${id}`, { headers });
}

export async function votePost(postId: string, type: 'upvote' | 'downvote'): Promise<void> {
  const headers = await requireAuthHeaders();
  await api.post(`/forum/posts/${postId}/vote`, { type }, { headers });
}

// ─── Forum — Comments ────────────────────────────────────────────────────────

export async function getComments(postId: string): Promise<Comment[]> {
  const headers = await requireAuthHeaders();
  const res = await api.get<ApiResponse<Comment[]>>(
    `/forum/posts/${postId}/comments`,
    { headers },
  );
  return res.data.data;
}

export async function createComment(postId: string, text: string): Promise<Comment> {
  const headers = await requireAuthHeaders();
  const res = await api.post<ApiResponse<Comment>>(
    `/forum/posts/${postId}/comments`,
    { text },
    { headers },
  );
  return res.data.data;
}

export async function updateComment(
  postId: string,
  commentId: string,
  text: string,
): Promise<void> {
  const headers = await requireAuthHeaders();
  await api.put(`/forum/posts/${postId}/comments/${commentId}`, { text }, { headers });
}

export async function deleteComment(postId: string, commentId: string): Promise<void> {
  const headers = await requireAuthHeaders();
  await api.delete(`/forum/posts/${postId}/comments/${commentId}`, { headers });
}