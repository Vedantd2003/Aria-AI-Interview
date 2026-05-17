import { create } from 'zustand';
import { User } from '../types';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  setAccessToken: (token: string) => void;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isLoading: true,
  isAuthenticated: false,

  setUser: (user) => set({ user, isAuthenticated: true }),
  setAccessToken: (token) => set({ accessToken: token }),
  setAuth: (user, token) =>
    set({ user, accessToken: token, isAuthenticated: true, isLoading: false }),
  clearAuth: () =>
    set({ user: null, accessToken: null, isAuthenticated: false, isLoading: false }),
  setLoading: (loading) => set({ isLoading: loading }),
}));
