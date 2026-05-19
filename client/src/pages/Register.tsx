import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import axios from 'axios';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').trim(),
  email: z.string().email('Invalid email').transform((s) => s.toLowerCase().trim()),
  password: z
    .string()
    .min(8, 'At least 8 characters')
    .regex(/[a-zA-Z]/, 'Must contain a letter')
    .regex(/[0-9]/, 'Must contain a number'),
});

type FormValues = z.infer<typeof schema>;

export default function Register() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const password = watch('password', '');

  const getStrength = (p: string): number => {
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  };

  const strength = getStrength(password);
  const strengthColors = ['#F43F5E', '#F59E0B', '#F59E0B', '#10B981', '#10B981'];
  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'];

  const onSubmit = async (data: FormValues) => {
    try {
      await registerUser(data.name, data.email, data.password);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || 'Registration failed');
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
          <h1 className="text-2xl font-semibold text-[#F5F5F7] mb-2">Create your account</h1>
          <p className="text-[#9A9AA8] text-sm">Start practicing interviews for free</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#9A9AA8] mb-1.5">Full name</label>
            <input
              {...register('name')}
              type="text"
              placeholder="Alex Johnson"
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: `1px solid ${errors.name ? '#F43F5E' : 'rgba(255,255,255,0.1)'}`,
                color: '#F5F5F7',
              }}
            />
            {errors.name && <p className="text-[#F43F5E] text-xs mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#9A9AA8] mb-1.5">Email</label>
            <input
              {...register('email')}
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: `1px solid ${errors.email ? '#F43F5E' : 'rgba(255,255,255,0.1)'}`,
                color: '#F5F5F7',
              }}
            />
            {errors.email && <p className="text-[#F43F5E] text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#9A9AA8] mb-1.5">Password</label>
            <input
              {...register('password')}
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: `1px solid ${errors.password ? '#F43F5E' : 'rgba(255,255,255,0.1)'}`,
                color: '#F5F5F7',
              }}
            />
            {password && (
              <div className="mt-2">
                <div className="flex gap-1 mb-1">
                  {[1, 2, 3, 4].map((n) => (
                    <div
                      key={n}
                      className="h-1 flex-1 rounded-full transition-all duration-300"
                      style={{
                        background: n <= strength ? strengthColors[strength] : 'rgba(255,255,255,0.1)',
                      }}
                    />
                  ))}
                </div>
                <p className="text-xs" style={{ color: strengthColors[strength] }}>
                  {strengthLabels[strength]}
                </p>
              </div>
            )}
            {errors.password && <p className="text-[#F43F5E] text-xs mt-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl font-medium text-sm text-white flex items-center justify-center gap-2 disabled:opacity-60 mt-2"
            style={{ background: 'linear-gradient(135deg, #8B5CF6, #22D3EE)' }}
          >
            {isSubmitting && <Loader2 size={16} className="animate-spin" />}
            Create account
          </button>
        </form>

        <p className="text-center text-sm text-[#9A9AA8] mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-[#8B5CF6] hover:underline">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
