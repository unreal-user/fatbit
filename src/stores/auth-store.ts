import { create } from 'zustand';

interface AuthState {
  fitbitToken: string | null;
  googleToken: string | null;
  isLoading: boolean;
  setFitbitToken: (token: string | null) => void;
  setGoogleToken: (token: string | null) => void;
  clearTokens: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  fitbitToken: null,
  googleToken: null,
  isLoading: true,
  setFitbitToken: (token) => set({ fitbitToken: token }),
  setGoogleToken: (token) => set({ googleToken: token }),
  clearTokens: () => set({ fitbitToken: null, googleToken: null }),
  setLoading: (loading) => set({ isLoading: loading }),
}));
