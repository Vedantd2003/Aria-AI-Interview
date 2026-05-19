import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import axios from 'axios';

const schema = z.object({
  email: z.string().email('Invalid email').transform((s) => s.toLowerCase().trim()),
  password: z.string().min(1, 'Password required'),
});

type FormValues = z.infer<typeof schema>;

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const redirect = params.get('redirect') || '/dashboard';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormValues) => {
    try {
      await login(data.email, data.password);
      navigate(redirect, { replace: true });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || 'Login failed');
      } else {
        toast.error('Something went wrong');
      }
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: '#07070B' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #8B5CF6, #22D3EE)' }}>
              <span className="text-white font-bold">A</span>
            </div>
          </Link>
          <h1 className="text-2xl font-semibold text-[#F5F5F7] mb-2">Welcome back</h1>
          <p className="text-[#9A9AA8] text-sm">Sign in to continue to ARIA</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#9A9AA8] mb-1.5">Email</label>
            <input
              {...register('email')}
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: `1px solid ${errors.email ? '#F43F5E' : 'rgba(255,255,255,0.1)'}`,
                color: '#F5F5F7',
              }}
            />
            {errors.email && (
              <p className="text-[#F43F5E] text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#9A9AA8] mb-1.5">Password</label>
            <input
              {...register('password')}
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: `1px solid ${errors.password ? '#F43F5E' : 'rgba(255,255,255,0.1)'}`,
                color: '#F5F5F7',
              }}
            />
            {errors.password && (
              <p className="text-[#F43F5E] text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl font-medium text-sm text-white flex items-center justify-center gap-2 disabled:opacity-60 transition-all"
            style={{ background: 'linear-gradient(135deg, #8B5CF6, #22D3EE)' }}
          >
            {isSubmitting && <Loader2 size={16} className="animate-spin" />}
            Sign in
          </button>
        </form>

        <p className="text-center text-sm text-[#9A9AA8] mt-6">
          No account?{' '}
          <Link to="/register" className="text-[#8B5CF6] hover:underline">
            Create one
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
