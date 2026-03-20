import { create } from 'zustand';
import { UserProfile } from '../types';
import { auth, db } from '../api/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

interface AuthState {
  user: UserProfile | null;
  loading: boolean;
  initialized: boolean;
  setUser: (user: UserProfile | null) => void;
  setLoading: (loading: boolean) => void;
  refreshUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: true,
  initialized: false,
  setUser: (user) => set({ user, loading: false, initialized: true }),
  setLoading: (loading) => set({ loading }),
  refreshUser: async () => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      if (userDoc.exists()) {
        set({ user: userDoc.data() as UserProfile });
      }
    }
  },
}));

// Listener for auth state
onAuthStateChanged(auth, async (firebaseUser) => {
  if (firebaseUser) {
    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
    if (userDoc.exists()) {
      useAuthStore.getState().setUser(userDoc.data() as UserProfile);
    } else {
      useAuthStore.getState().setUser(null);
    }
  } else {
    useAuthStore.getState().setUser(null);
  }
});
