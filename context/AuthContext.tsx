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

interface AuthContextType {
  firebaseUser: FirebaseUser | null;
  user: User | null;
  loading: boolean;
  isAnonymous: boolean;
  anonAuthDisabled: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [anonAuthDisabled, setAnonAuthDisabled] = useState(false);

  const isAnonymousLoginProcess = useRef(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {

      // kalau user logout, onAuthStateChanged mengirimkan null
      if (!fbUser) {
        if (isAnonymousLoginProcess.current) return;
        isAnonymousLoginProcess.current = true;

        try {
          await signInAnonymously(auth);
        } catch (err: unknown) {
          const code = (err as { code?: string }).code;
          if (code === 'auth/operation-not-allowed') {
            setAnonAuthDisabled(true);
            console.warn('Firebase Anonymous Auth belum diaktifkan.');
          }
          setFirebaseUser(null);
          setUser(null);
          setLoading(false);
        } finally {
          isAnonymousLoginProcess.current = false;
        }
        return;
      }

      // saat user login melalui google firebase
      setFirebaseUser(fbUser);

      if (fbUser.isAnonymous) {
        setUser(null);
      } else {
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

  const handleSignInWithGoogle = async () => {
    await signInWithPopup(auth, googleProvider);
  };

  const logout = async () => {
    setUser(null);
    await signOut(auth);
  };

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

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth error, tidak dalam provider');
  return context;
}