import { useEffect } from 'react';
import axios from 'axios';
import { Toaster } from 'sonner';
import { api } from '../lib/axios';
import { useAuthStore } from '../store/auth.store';
import { User } from '../types';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const { setAuth, clearAuth, setLoading, accessToken } = useAuthStore();

  useEffect(() => {
    api
      .get<{ user: User }>('/auth/me')
      .then(({ data }) => {
        setAuth(data.user, useAuthStore.getState().accessToken ?? '');
      })
      .catch((err) => {
        const status = axios.isAxiosError(err) ? err.response?.status : null;
        // Only clear auth on an actual 401 — never on 429 (rate limit) or network errors
        if (status === 401) {
          clearAuth();
        } else {
          // For 429, 5xx, or network failures: keep whatever auth state we have
          setLoading(false);
        }
      })
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {children}
      <Toaster
        theme="dark"
        position="top-right"
        toastOptions={{
          style: {
            background: '#0E0E14',
            border: '1px solid rgba(255,255,255,0.08)',
            color: '#F5F5F7',
          },
        }}
      />
    </>
  );
}
