import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/axios';
import { useAuthStore } from '../store/auth.store';
import { User } from '../types';

export function useAuth() {
  const { user, isAuthenticated, isLoading, setAuth, clearAuth } = useAuthStore();
  const navigate = useNavigate();

  const login = useCallback(
    async (email: string, password: string) => {
      const { data } = await api.post<{
        success: boolean;
        accessToken: string;
        user: User;
      }>('/auth/login', { email, password });
      setAuth(data.user, data.accessToken);
      return data.user;
    },
    [setAuth]
  );

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const { data } = await api.post<{
        success: boolean;
        accessToken: string;
        user: User;
      }>('/auth/register', { name, email, password });
      setAuth(data.user, data.accessToken);
      return data.user;
    },
    [setAuth]
  );

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      clearAuth();
      navigate('/login');
    }
  }, [clearAuth, navigate]);

  return { user, isAuthenticated, isLoading, login, register, logout };
}
