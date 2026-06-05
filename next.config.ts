import type { NextConfig } from 'next';

const API_BASE_SERVER = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:5000';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
    ],
  },

  // hapus /api di alamat req ke server - belum tambah /api di server
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${API_BASE_SERVER}/:path*`,
      },
    ];
  },
};

export default nextConfig;