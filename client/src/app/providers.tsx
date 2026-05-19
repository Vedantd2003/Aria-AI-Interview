import { useEffect, useRef } from 'react';
import axios from 'axios';
import { Toaster } from 'sonner';
import { api } from '../lib/axios';
import { useAuthStore } from '../store/auth.store';
import { User } from '../types';

interface ProvidersProps {
  children: React.ReactNode;
}

async function fetchCurrentUser(retries = 2): Promise<User | null> {
  try {
    const { data } = await api.get<{ user: User }>('/auth/me');
    return data.user;
  } catch (err) {
    const status = axios.isAxiosError(err) ? err.response?.status : null;
    // Retry on 429 (rate limit) — wait 1.5s between attempts
    if (status === 429 && retries > 0) {
      await new Promise((r) => setTimeout(r, 1500));
      return fetchCurrentUser(retries - 1);
    }
    // 401 = genuinely not authenticated (interceptor already tried refresh)
    // Anything else (5xx, network) = don't assume logged out
    if (status === 401) return null;
    throw err; // re-throw 5xx / network so caller can handle
  }
}

async function refreshAccessToken(): Promise<{ user: User; accessToken: string } | null> {
  try {
    const { data } = await axios.post<{ success: boolean; accessToken: string; user: User }>(
      `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/refresh`,
      {},
      { withCredentials: true }
    );
    return { user: data.user, accessToken: data.accessToken };
  } catch {
    return null;
  }
}

export function Providers({ children }: ProvidersProps) {
  const { setAuth, clearAuth, setLoading } = useAuthStore();
  const didInit = useRef(false);

  useEffect(() => {
    // Guard against StrictMode double-invocation remnants and fast remounts
    if (didInit.current) return;
    didInit.current = true;

    // On page load, try to refresh the token first using the refresh cookie
    // This handles the case where the access token is lost on page refresh
    refreshAccessToken()
      .then((result) => {
        if (result) {
          setAuth(result.user, result.accessToken);
        } else {
          // If refresh fails, try to fetch current user (might have valid access token in memory)
          return fetchCurrentUser();
        }
      })
      .then((user) => {
        if (user && typeof user !== 'boolean') {
          // If we got here from refreshAccessToken failure, user might be null
          // Only set auth if we have a valid user and access token
          const currentToken = useAuthStore.getState().accessToken;
          if (currentToken) {
            setAuth(user, currentToken);
          } else {
            clearAuth();
          }
        }
      })
      .catch(() => {
        // Network / 5xx — don't redirect; just stop the loading spinner
        // so the user can see whatever page they're on
        setLoading(false);
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
