'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  ReactNode,
} from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  signInAnonymously,
  type User as FirebaseUser,
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { loginWithGoogle } from '@/lib/api';
import type { User } from '@/types';

// ─── Tipe konteks ────────────────────────────────────────────────────────────

interface AuthContextType {
  firebaseUser: FirebaseUser | null;
  /** Data user dari backend — hanya ada untuk Google user */
  user: User | null;
  loading: boolean;
  /** true jika user saat ini adalah Firebase Anonymous (guest) */
  isAnonymous: boolean;
  /**
   * true jika Firebase Anonymous Auth belum diaktifkan di Firebase Console.
   *
   * Cara mengaktifkan:
   *   Firebase Console → Authentication → Sign-in method → Anonymous → Enable
   *
   * Selama flag ini true, fitur yang membutuhkan optionalAuth (deteksi,
   * forum) hanya bisa diakses setelah login dengan Google.
   */
  anonAuthDisabled: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─── Provider ────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [anonAuthDisabled, setAnonAuthDisabled] = useState(false);

  /**
   * Flag untuk mencegah double-call signInAnonymously.
   *
   * Skenario tanpa flag: signOut() → onAuthStateChanged(null) dipanggil
   * → signInAnonymously() dipanggil → onAuthStateChanged(null) mungkin
   * terpanggil lagi sebelum anonymous selesai → double call.
   *
   * Dengan useRef: flag persist lintas render tanpa memicu re-render.
   */
  const isAnonymousLoginProcess = useRef(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      // ── Tidak ada user ──────────────────────────────────────────────────
      if (!fbUser) {
        if (isAnonymousLoginProcess.current) return; // Sedang dalam proses, lewati
        isAnonymousLoginProcess.current = true;

        try {
          /**
           * Otomatis login sebagai Anonymous agar semua endpoint optionalAuth
           * selalu memiliki Bearer token yang valid.
           *
           * Jika gagal dengan auth/operation-not-allowed, berarti Anonymous Auth
           * belum diaktifkan di Firebase Console. Aktifkan lewat:
           *   Firebase Console → Authentication → Sign-in method → Anonymous → Enable
           */
          await signInAnonymously(auth);
          // onAuthStateChanged akan dipanggil lagi dengan fbUser anonymous
        } catch (err: unknown) {
          const code = (err as { code?: string }).code;
          if (code === 'auth/operation-not-allowed') {
            // Anonymous Auth belum diaktifkan — app masih bisa berjalan
            // tapi hanya user Google yang bisa mengakses fitur proteksi
            setAnonAuthDisabled(true);
            console.warn(
              '[SkinSense] Firebase Anonymous Auth belum diaktifkan.\n' +
              'Aktifkan di: Firebase Console → Authentication → Sign-in method → Anonymous\n' +
              'Tanpa ini, fitur Deteksi dan Forum tidak dapat diakses oleh guest user.',
            );
          }
          setFirebaseUser(null);
          setUser(null);
          setLoading(false);
        } finally {
          isAnonymousLoginProcess.current = false;
        }
        return;
      }

      // ── Ada user ────────────────────────────────────────────────────────
      setFirebaseUser(fbUser);

      if (fbUser.isAnonymous) {
        // Guest — tidak butuh data dari backend
        setUser(null);
      } else {
        // Google user — sync dengan backend
        try {
          const userData = await loginWithGoogle();
          setUser(userData);
        } catch {
          setUser(null);
        }
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // ─── Actions ─────────────────────────────────────────────────────────────

  const handleSignInWithGoogle = async () => {
    await signInWithPopup(auth, googleProvider);
    // onAuthStateChanged menangani sisanya secara otomatis
  };

  const logout = async () => {
    // Reset state segera agar UI langsung responsif sebelum Firebase selesai
    setUser(null);
    // signOut() → onAuthStateChanged(null) → signInAnonymously() otomatis
    await signOut(auth);
  };

  // ─── Derived state ───────────────────────────────────────────────────────

  // Jika firebaseUser null (anon disabled), anggap anonymous = true
  // agar semua guard "login required" tetap aktif
  const isAnonymous = firebaseUser?.isAnonymous ?? true;

  return (
    <AuthContext.Provider
      value={{
        firebaseUser,
        user,
        loading,
        isAnonymous,
        anonAuthDisabled,
        signInWithGoogle: handleSignInWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth harus digunakan di dalam AuthProvider');
  return context;
}