import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { Navbar } from '../components/layout/Navbar';
import { ScoreCard } from '../components/feedback/ScoreCard';
import { RadarChart } from '../components/feedback/RadarChart';
import { InsightsList } from '../components/feedback/InsightsList';
import { api } from '../lib/axios';
import { Feedback as FeedbackType } from '../types';

function Skeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-8 w-48 rounded-xl bg-white/5" />
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-28 rounded-xl bg-white/5" />
        ))}
      </div>
      <div className="h-64 rounded-xl bg-white/5" />
    </div>
  );
}

export default function FeedbackPage() {
  const { interviewId } = useParams<{ interviewId: string }>();
  const [feedback, setFeedback] = useState<FeedbackType | null>(null);
  const [loading, setLoading] = useState(true);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const poll = async () => {
      try {
        const { data } = await api.get<{ feedback: FeedbackType }>(
          `/feedback/${interviewId}`
        );
        if (!cancelled) {
          setFeedback(data.feedback);
          setLoading(false);
        }
      } catch {
        if (attempts < 20 && !cancelled) {
          setTimeout(() => setAttempts((a) => a + 1), 1500);
        } else {
          if (!cancelled) setLoading(false);
        }
      }
    };

    poll();
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interviewId, attempts]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard');
  };

  return (
    <div className="min-h-screen" style={{ background: '#07070B' }}>
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 pt-28 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <Link
            to="/dashboard"
            className="flex items-center gap-2 text-[#9A9AA8] hover:text-white text-sm transition-colors"
          >
            <ArrowLeft size={16} />
            Back to dashboard
          </Link>
          {feedback && (
            <button
              onClick={handleShare}
              className="flex items-center gap-2 text-sm text-[#9A9AA8] hover:text-white transition-colors"
            >
              <Share2 size={16} />
              Share
            </button>
          )}
        </motion.div>

        {loading ? (
          <div>
            <p className="text-[#9A9AA8] text-sm mb-6">
              Generating your feedback report...
            </p>
            <Skeleton />
          </div>
        ) : !feedback ? (
          <div className="glass-card p-12 text-center">
            <p className="text-[#9A9AA8]">Feedback not yet available. Check back in a moment.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6"
            >
              <h2 className="text-xs font-medium text-[#9A9AA8] uppercase tracking-widest mb-3">
                Interview Summary
              </h2>
              <p className="text-[#F5F5F7] leading-relaxed">{feedback.summary}</p>
            </motion.div>

            {/* Score cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {[
                { key: 'overall', label: 'Overall' },
                { key: 'technical', label: 'Technical' },
                { key: 'communication', label: 'Communication' },
                { key: 'confidence', label: 'Confidence' },
                { key: 'problemSolving', label: 'Problem Solving' },
              ].map((item, i) => (
                <ScoreCard
                  key={item.key}
                  label={item.label}
                  score={feedback.scores[item.key as keyof typeof feedback.scores]}
                  delay={i * 0.07}
                />
              ))}
            </div>

            {/* Radar chart */}
            <RadarChart scores={feedback.scores} />

            {/* Insights */}
            <InsightsList
              strengths={feedback.strengths}
              weaknesses={feedback.weaknesses}
              suggestions={feedback.suggestions}
            />

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-center pt-4"
            >
              <Link
                to="/interview/setup"
                className="inline-flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-medium text-white"
                style={{ background: 'linear-gradient(135deg, #8B5CF6, #22D3EE)' }}
              >
                Practice again
              </Link>
            </motion.div>
          </div>
        )}
      </main>
    </div>
  );
}
