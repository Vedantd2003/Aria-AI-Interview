import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Upload, X, FileText, Loader2 } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { api } from '../lib/axios';
import { useInterviewStore } from '../store/interview.store';
import { InterviewRole, InterviewDifficulty } from '../types';

const ROLES: InterviewRole[] = [
  'Frontend', 'Backend', 'Full-Stack', 'System Design', 'Behavioral', 'DSA',
];
const DIFFICULTIES: { value: InterviewDifficulty; label: string; desc: string }[] = [
  { value: 'easy', label: 'Easy', desc: 'Fundamentals & basics' },
  { value: 'medium', label: 'Medium', desc: 'Mid-level concepts' },
  { value: 'hard', label: 'Hard', desc: 'Senior-level depth' },
];
const DURATIONS = [10, 15, 20, 30];

export default function InterviewSetup() {
  const navigate = useNavigate();
  const store = useInterviewStore();
  const fileRef = useRef<HTMLInputElement>(null);

  const [role, setRole] = useState<InterviewRole>('Frontend');
  const [difficulty, setDifficulty] = useState<InterviewDifficulty>('medium');
  const [duration, setDuration] = useState(15);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [creating, setCreating] = useState(false);

  const handleResumeUpload = async (file: File) => {
    setResumeFile(file);
    setUploading(true);
    const form = new FormData();
    form.append('resume', file);
    try {
      await api.post('/users/me/resume', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Resume uploaded — ARIA will reference it');
    } catch {
      toast.error('Resume upload failed');
      setResumeFile(null);
    } finally {
      setUploading(false);
    }
  };

  const handleStart = async () => {
    setCreating(true);
    try {
      const { data } = await api.post<{
        interview: { id: string };
        vapiConfig: Record<string, unknown>;
      }>('/interviews', { role, difficulty, duration });

      store.reset();
      store.setInterviewId(data.interview.id);

      navigate(`/interview/${data.interview.id}`, {
        state: { vapiConfig: data.vapiConfig },
      });
    } catch {
      toast.error('Failed to create interview. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: '#07070B' }}>
      <Navbar />
      <main className="max-w-2xl mx-auto px-6 pt-28 pb-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-semibold text-[#F5F5F7] mb-2">Set up your interview</h1>
          <p className="text-[#9A9AA8] mb-10">Choose your role, difficulty, and duration.</p>

          <div className="space-y-8">
            {/* Role */}
            <section>
              <h2 className="text-sm font-medium text-[#9A9AA8] uppercase tracking-widest mb-3">Role</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {ROLES.map((r) => (
                  <button
                    key={r}
                    onClick={() => setRole(r)}
                    className="px-4 py-3 rounded-xl text-sm font-medium text-left transition-all"
                    style={{
                      background: role === r ? 'rgba(139,92,246,0.15)' : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${role === r ? 'rgba(139,92,246,0.5)' : 'rgba(255,255,255,0.08)'}`,
                      color: role === r ? '#8B5CF6' : '#9A9AA8',
                    }}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </section>

            {/* Difficulty */}
            <section>
              <h2 className="text-sm font-medium text-[#9A9AA8] uppercase tracking-widest mb-3">Difficulty</h2>
              <div className="grid grid-cols-3 gap-2">
                {DIFFICULTIES.map((d) => (
                  <button
                    key={d.value}
                    onClick={() => setDifficulty(d.value)}
                    className="px-4 py-3 rounded-xl text-sm text-left transition-all"
                    style={{
                      background: difficulty === d.value ? 'rgba(139,92,246,0.15)' : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${difficulty === d.value ? 'rgba(139,92,246,0.5)' : 'rgba(255,255,255,0.08)'}`,
                    }}
                  >
                    <p className="font-medium" style={{ color: difficulty === d.value ? '#8B5CF6' : '#F5F5F7' }}>
                      {d.label}
                    </p>
                    <p className="text-xs text-[#9A9AA8] mt-0.5">{d.desc}</p>
                  </button>
                ))}
              </div>
            </section>

            {/* Duration */}
            <section>
              <h2 className="text-sm font-medium text-[#9A9AA8] uppercase tracking-widest mb-3">Duration</h2>
              <div className="flex gap-2">
                {DURATIONS.map((d) => (
                  <button
                    key={d}
                    onClick={() => setDuration(d)}
                    className="flex-1 py-3 rounded-xl text-sm font-medium transition-all"
                    style={{
                      background: duration === d ? 'rgba(139,92,246,0.15)' : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${duration === d ? 'rgba(139,92,246,0.5)' : 'rgba(255,255,255,0.08)'}`,
                      color: duration === d ? '#8B5CF6' : '#9A9AA8',
                    }}
                  >
                    {d}m
                  </button>
                ))}
              </div>
            </section>

            {/* Resume */}
            <section>
              <h2 className="text-sm font-medium text-[#9A9AA8] uppercase tracking-widest mb-3">
                Resume <span className="normal-case font-normal">(optional)</span>
              </h2>
              <input
                ref={fileRef}
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleResumeUpload(f);
                }}
              />
              {resumeFile ? (
                <div className="flex items-center gap-3 p-4 rounded-xl" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)' }}>
                  <FileText size={18} className="text-[#10B981]" />
                  <span className="text-sm text-[#F5F5F7] flex-1 truncate">{resumeFile.name}</span>
                  {uploading ? (
                    <Loader2 size={16} className="text-[#10B981] animate-spin" />
                  ) : (
                    <button onClick={() => setResumeFile(null)}>
                      <X size={16} className="text-[#9A9AA8] hover:text-white" />
                    </button>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => fileRef.current?.click()}
                  className="w-full py-4 rounded-xl flex items-center justify-center gap-2 text-sm text-[#9A9AA8] transition-all hover:text-white"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.1)' }}
                >
                  <Upload size={16} />
                  Upload PDF resume
                </button>
              )}
            </section>

            {/* Start */}
            <button
              onClick={handleStart}
              disabled={creating}
              className="w-full py-4 rounded-xl font-medium text-white flex items-center justify-center gap-2 disabled:opacity-60 text-sm"
              style={{ background: 'linear-gradient(135deg, #8B5CF6, #22D3EE)' }}
            >
              {creating && <Loader2 size={16} className="animate-spin" />}
              {creating ? 'Setting up ARIA...' : `Start ${role} Interview`}
            </button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
