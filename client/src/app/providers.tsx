import { useEffect } from 'react';
import { Toaster } from 'sonner';
import { api } from '../lib/axios';
import { useAuthStore } from '../store/auth.store';
import { User } from '../types';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const { setAuth, clearAuth, setLoading } = useAuthStore();

  useEffect(() => {
    api
      .get<{ user: User }>('/auth/me')
      .then(({ data }) => {
        // Access token was valid — but we need to also set it
        // The interceptor already set it if it needed refresh
        setAuth(data.user, useAuthStore.getState().accessToken ?? '');
      })
      .catch(() => {
        clearAuth();
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
