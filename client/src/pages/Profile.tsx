import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Loader2, User, Trash2 } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { useAuthStore } from '../store/auth.store';
import { api } from '../lib/axios';

const schema = z.object({
  name: z.string().min(2, 'At least 2 characters'),
});

export default function Profile() {
  const { user, setUser } = useAuthStore();
  const [deletingResume, setDeletingResume] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema), defaultValues: { name: user?.name ?? '' } });

  const onSubmit = async (data: { name: string }) => {
    try {
      const res = await api.patch<{ user: typeof user }>('/users/me', data);
      if (res.data.user) setUser(res.data.user as typeof user & NonNullable<typeof user>);
      toast.success('Profile updated');
    } catch {
      toast.error('Update failed');
    }
  };

  const handleDeleteResume = async () => {
    setDeletingResume(true);
    try {
      await api.delete('/users/me/resume');
      toast.success('Resume removed');
    } catch {
      toast.error('Failed to remove resume');
    } finally {
      setDeletingResume(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: '#07070B' }}>
      <Navbar />
      <main className="max-w-xl mx-auto px-6 pt-28 pb-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-4 mb-10">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #8B5CF6, #22D3EE)' }}>
              <User size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-[#F5F5F7]">{user?.name}</h1>
              <p className="text-[#9A9AA8] text-sm">{user?.email}</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass-card p-6">
              <h2 className="font-semibold text-[#F5F5F7] mb-5">Edit profile</h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm text-[#9A9AA8] mb-1.5">Full name</label>
                  <input
                    {...register('name')}
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: `1px solid ${errors.name ? '#F43F5E' : 'rgba(255,255,255,0.1)'}`,
                      color: '#F5F5F7',
                    }}
                  />
                  {errors.name && <p className="text-[#F43F5E] text-xs mt-1">{errors.name.message}</p>}
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl text-sm font-medium text-white flex items-center gap-2 disabled:opacity-60"
                  style={{ background: 'linear-gradient(135deg, #8B5CF6, #22D3EE)' }}
                >
                  {isSubmitting && <Loader2 size={14} className="animate-spin" />}
                  Save changes
                </button>
              </form>
            </div>

            {user?.resumeText && (
              <div className="glass-card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-semibold text-[#F5F5F7] mb-1">Resume</h2>
                    <p className="text-xs text-[#9A9AA8]">Uploaded — ARIA will use this in sessions</p>
                  </div>
                  <button
                    onClick={handleDeleteResume}
                    disabled={deletingResume}
                    className="flex items-center gap-2 text-xs text-[#F43F5E] hover:text-red-400 transition-colors disabled:opacity-60"
                  >
                    {deletingResume ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
