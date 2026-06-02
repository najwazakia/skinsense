'use client';

import { LogIn, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface Props {
  onClose: () => void;
}

export default function LoginModal({ onClose }: Props) {
  const { signInWithGoogle } = useAuth();

  const handleLogin = async () => {
    await signInWithGoogle();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center space-y-5">
        <div className="flex justify-end">
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <LogIn className="w-8 h-8 text-green-600" />
        </div>
        <div>
          <h3 className="font-zain text-2xl font-extrabold text-stone-800">Bergabung dengan Forum</h3>
          <p className="text-sm text-stone-500 mt-2">
            Login dengan akun Google untuk membuat postingan, berkomentar, dan berinteraksi dengan komunitas SkinSense.
          </p>
        </div>
        <button
          onClick={handleLogin}
          className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-lg"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Masuk dengan Google
        </button>
      </div>
    </div>
  );
}