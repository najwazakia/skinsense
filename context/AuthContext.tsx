'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
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

interface AuthContextType {
  firebaseUser: FirebaseUser | null;
  /** Data user dari backend — hanya terisi untuk Google user, null untuk anonymous/guest */
  user: User | null;
  loading: boolean;
  /** true jika user saat ini adalah Firebase Anonymous (belum login Google) */
  isAnonymous: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    /**
     * onAuthStateChanged menangani 3 skenario:
     *
     * 1. firebaseUser === null  →  belum ada sesi sama sekali
     *    → panggil signInAnonymously() secara otomatis
     *    → Firebase menyimpan sesi anonymous ke IndexedDB
     *    → callback ini akan dipanggil lagi dengan firebaseUser anonymous
     *
     * 2. firebaseUser.isAnonymous === true  →  sesi anonymous aktif
     *    → setUser(null), tidak butuh data backend
     *
     * 3. firebaseUser.isAnonymous === false  →  sesi Google aktif
     *    → sync data user ke backend via /auth/google
     *
     * Firebase mengelola persistensi token di IndexedDB secara otomatis,
     * sehingga refresh/restart browser tetap mengenali sesi tanpa
     * perlu menyimpan apapun di localStorage secara manual.
     */
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        // Tidak ada sesi → buat sesi anonymous baru secara otomatis
        // onAuthStateChanged akan terpanggil lagi setelah berhasil
        await signInAnonymously(auth).catch(() => {
          // Gagal buat anonymous (offline?) → tetap lanjut tanpa sesi
          setFirebaseUser(null);
          setUser(null);
          setLoading(false);
        });
        return; // Jangan panggil setLoading di sini; tunggu callback berikutnya
      }

      setFirebaseUser(firebaseUser);

      if (firebaseUser.isAnonymous) {
        // Guest / anonymous — tidak butuh data dari backend
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

  const signInWithGoogle = async () => {
    // Popup login — onAuthStateChanged otomatis menangani setUser
    await signInWithPopup(auth, googleProvider);
  };

  const logout = async () => {
    // Reset state segera agar UI langsung responsif
    setUser(null);

    // signOut akan memicu onAuthStateChanged(null),
    // yang kemudian otomatis memanggil signInAnonymously(),
    // sehingga user kembali ke sesi anonymous tanpa perlu
    // memanggil signInAnonymously() secara eksplisit di sini.
    await signOut(auth);
  };

  const isAnonymous = firebaseUser?.isAnonymous ?? true;

  return (
    <AuthContext.Provider
      value={{ firebaseUser, user, loading, isAnonymous, signInWithGoogle, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth harus di dalam AuthProvider');
  return context;
}