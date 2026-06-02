export interface User {
  id: string;
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  gender: string | null;
  dateBirth: string | null;
  bio: string | null;
  is_anonymous: boolean;
  totalDetections: number;
  totalPosts: number;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface DetectionResult {
  id: string;
  label: string;
  confidence: number;
  image_URL: string;
  is_anonymous: boolean;
  createdAt: string | null;
}

export interface AIRecommendation {
  deskripsi: string;
  penanganan: string;
  obat_bebas: string;
  peringatan: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  image_URL: string | null;
  tags: string[];
  upvoteCount: number;
  downvoteCount: number;
  commentsCount: number;
  is_author?: boolean;
  author?: {
    name: string;
    photo_URL: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  text: string;
  is_author: boolean;
  author: {
    name: string;
    photo_URL: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  code: number;
  status: 'success' | 'failed';
  message: string;
  data: T;
}