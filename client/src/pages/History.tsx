import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Navbar } from '../components/layout/Navbar';
import { api } from '../lib/axios';
import { Interview } from '../types';
import { formatDate } from '../lib/utils';
import { ChevronRight } from 'lucide-react';

export default function History() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    api.get<{ interviews: Interview[]; pagination: { pages: number } }>(
      `/interviews?page=${page}&limit=10`
    )
      .then((r) => {
        setInterviews(r.data.interviews);
        setTotalPages(r.data.pagination.pages);
      })
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <div className="min-h-screen" style={{ background: '#07070B' }}>
      <Navbar />
      <main className="max-w-3xl mx-auto px-6 pt-28 pb-20">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-semibold text-[#F5F5F7] mb-8"
        >
          Interview history
        </motion.h1>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="glass-card p-5 animate-pulse h-16" />
            ))}
          </div>
        ) : interviews.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <p className="text-[#9A9AA8]">No interviews yet.</p>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {interviews.map((iv, i) => (
                <motion.div
                  key={iv._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="glass-card p-5 flex items-center justify-between"
                >
                  <div>
                    <p className="text-[#F5F5F7] font-medium text-sm">{iv.role}</p>
                    <p className="text-xs text-[#9A9AA8] mt-0.5">
                      {iv.difficulty} · {iv.duration}m · {formatDate(iv.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className="text-xs px-2 py-1 rounded-full capitalize"
                      style={{
                        background: iv.status === 'completed' ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.05)',
                        color: iv.status === 'completed' ? '#10B981' : '#9A9AA8',
                      }}
                    >
                      {iv.status}
                    </span>
                    {iv.status === 'completed' && (
                      <Link
                        to={`/feedback/${iv._id}`}
                        className="flex items-center gap-1 text-xs text-[#8B5CF6] hover:underline"
                      >
                        Report <ChevronRight size={12} />
                      </Link>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className="w-8 h-8 rounded-lg text-sm transition-all"
                    style={{
                      background: page === i + 1 ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.04)',
                      color: page === i + 1 ? '#8B5CF6' : '#9A9AA8',
                      border: `1px solid ${page === i + 1 ? 'rgba(139,92,246,0.4)' : 'rgba(255,255,255,0.06)'}`,
                    }}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
