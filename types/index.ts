import type { FirestoreTimestamp } from '@/lib/date';

export interface User {
  id:               string;
  uid:              string;
  displayName:      string;
  email:            string;
  photoURL:         string | null;
  gender:           string | null;
  dateBirth:        string | null;
  bio:              string | null;
  is_anonymous:     boolean;
  totalDetections:  number;
  totalPosts:       number;
  createdAt:        FirestoreTimestamp;
  updatedAt:        FirestoreTimestamp;
}

export interface DetectionResult {
  id:           string;
  label:        string;
  confidence:   number;
  image_URL:    string;
  is_anonymous: boolean;
  createdAt:    FirestoreTimestamp;
  top_3_result?: Array<{
    class:      string;
    confidence: number;
  }>;
}

export interface AIRecommendation {
  deskripsi:  string;
  penanganan: string;
  obat_bebas: string;
  peringatan: string;
}

export interface Post {
  id:            string;
  title:         string;
  content:       string;
  image_URL:     string | null;
  tags:          string[];
  upvoteCount:   number;
  downvoteCount: number;
  commentsCount: number;
  is_author?:    boolean;
  author?: {
    name:      string | null;
    photo_URL: string | null;
  };
  createdAt: FirestoreTimestamp;
  updatedAt: FirestoreTimestamp;
}

export interface Comment {
  id:        string;
  text:      string;
  is_author: boolean;
  author: {
    name:      string | null;
    photo_URL: string | null;
  };
  createdAt: FirestoreTimestamp;
  updatedAt: FirestoreTimestamp;
}

export interface ApiResponse<T> {
  code:    number;
  status:  'success' | 'failed';
  message: string;
  data:    T;
}