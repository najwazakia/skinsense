'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogIn, LogOut, Loader2, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Header() {
  const { user, loading, signInWithGoogle, logout } = useAuth();
  const pathname = usePathname();

  const navLinks = [
    { href: '/',       label: 'Deteksi' },
    { href: '/result', label: 'Hasil' },
    { href: '/forum',  label: 'Forum' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-green-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image
            src="/skinsense.png"
            alt="SkinSense"
            width={36}
            height={36}
            className="rounded-lg"
          />
          <span className="font-zain font-800 text-2xl font-extrabold text-green-700 tracking-tight">
            SkinSense
          </span>
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  active
                    ? 'bg-green-100 text-green-700'
                    : 'text-stone-600 hover:bg-green-50 hover:text-green-700'
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Auth */}
        <div className="flex items-center gap-3">
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin text-green-500" />
          ) : user ? (
            <div className="flex items-center gap-2">
              {user.photoURL ? (
                <Image
                  src={user.photoURL}
                  alt={user.displayName}
                  width={32}
                  height={32}
                  className="rounded-full border-2 border-green-200"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-green-200 flex items-center justify-center">
                  <User className="w-4 h-4 text-green-700" />
                </div>
              )}
              <span className="hidden md:block text-sm font-semibold text-stone-700">
                {user.displayName}
              </span>
              <button
                onClick={logout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold text-stone-500 hover:bg-red-50 hover:text-red-600 transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden md:inline">Keluar</span>
              </button>
            </div>
          ) : (
            <button
              onClick={signInWithGoogle}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-full text-sm font-semibold transition-all shadow-sm hover:shadow-md"
            >
              <LogIn className="w-4 h-4" />
              Masuk dengan Google
            </button>
          )}
        </div>

      </div>

      {/* Mobile nav */}
      <nav className="md:hidden flex border-t border-green-50">
        {navLinks.map(({ href, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex-1 text-center py-2.5 text-xs font-semibold transition-all ${
                active ? 'text-green-700 bg-green-50' : 'text-stone-500'
              }`}
            >
              {label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}