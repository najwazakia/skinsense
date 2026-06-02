import type { Metadata } from 'next';
import { Zain, Nunito } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const zain = Zain({
  subsets: ['latin'],
  weight: ['300', '400', '700', '800', '900'],
  variable: '--font-zain',
});

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-nunito',
});

export const metadata: Metadata = {
  title: 'SkinSense — Deteksi Penyakit Kulit Berbasis AI',
  description:
    'Platform deteksi penyakit kulit menggunakan kecerdasan buatan, lengkap dengan rekomendasi penanganan dan forum komunitas.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${zain.variable} ${nunito.variable}`}>
      <body className="min-h-screen flex flex-col bg-stone-50 font-nunito text-stone-800">
        <AuthProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}