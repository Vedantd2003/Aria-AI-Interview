import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Clock, CheckCircle, XCircle, ChevronRight } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { useAuthStore } from '../store/auth.store';
import { api } from '../lib/axios';
import { Interview } from '../types';
import { formatDate } from '../lib/utils';

const statusConfig = {
  completed: { label: 'Completed', color: '#10B981', icon: CheckCircle },
  in_progress: { label: 'In Progress', color: '#F59E0B', icon: Clock },
  failed: { label: 'Failed', color: '#F43F5E', icon: XCircle },
  pending: { label: 'Pending', color: '#9A9AA8', icon: Clock },
};

function InterviewCard({ interview }: { interview: Interview }) {
  const config = statusConfig[interview.status];
  const StatusIcon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="glass-card p-5 flex items-center justify-between cursor-pointer group"
    >
      <div className="flex items-center gap-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold"
          style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(34,211,238,0.1))' }}
        >
          {interview.role.charAt(0)}
        </div>
        <div>
          <p className="text-[#F5F5F7] font-medium text-sm">{interview.role}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-[#9A9AA8] capitalize">{interview.difficulty}</span>
            <span className="text-[#9A9AA8] text-xs">·</span>
            <span className="text-xs text-[#9A9AA8]">{interview.duration}m</span>
            <span className="text-[#9A9AA8] text-xs">·</span>
            <span className="text-xs text-[#9A9AA8]">{formatDate(interview.createdAt)}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <StatusIcon size={14} style={{ color: config.color }} />
          <span className="text-xs" style={{ color: config.color }}>{config.label}</span>
        </div>
        {interview.status === 'completed' && (
          <Link
            to={`/feedback/${interview._id}`}
            className="text-xs px-3 py-1.5 rounded-lg transition-colors"
            style={{ background: 'rgba(139,92,246,0.1)', color: '#8B5CF6' }}
          >
            View report
          </Link>
        )}
        <ChevronRight size={16} className="text-[#9A9AA8] group-hover:text-white transition-colors" />
      </div>
    </motion.div>
  );
}

function SkeletonCard() {
  return (
    <div className="glass-card p-5 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-white/5" />
        <div className="space-y-2">
          <div className="h-4 w-24 rounded bg-white/5" />
          <div className="h-3 w-40 rounded bg-white/5" />
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuthStore();
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<{ interviews: Interview[] }>('/interviews?limit=10')
      .then((r) => setInterviews(r.data.interviews))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen" style={{ background: '#07070B' }}>
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 pt-28 pb-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-10"
        >
          <div>
            <h1 className="text-3xl font-semibold text-[#F5F5F7]">
              Hey, {user?.name?.split(' ')[0]} 👋
            </h1>
            <p className="text-[#9A9AA8] mt-1">Ready for your next mock interview?</p>
          </div>
          <Link
            to="/interview/setup"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white transition-all"
            style={{ background: 'linear-gradient(135deg, #8B5CF6, #22D3EE)' }}
          >
            <Plus size={16} />
            New interview
          </Link>
        </motion.div>

        {/* Recent interviews */}
        <section>
          <h2 className="text-lg font-semibold text-[#F5F5F7] mb-4">Recent interviews</h2>
          <div className="space-y-3">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
            ) : interviews.length === 0 ? (
              <div className="glass-card p-12 text-center">
                <p className="text-[#9A9AA8] mb-4">No interviews yet.</p>
                <Link
                  to="/interview/setup"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white"
                  style={{ background: 'linear-gradient(135deg, #8B5CF6, #22D3EE)' }}
                >
                  <Plus size={16} />
                  Start your first interview
                </Link>
              </div>
            ) : (
              interviews.map((iv) => <InterviewCard key={iv._id} interview={iv} />)
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
