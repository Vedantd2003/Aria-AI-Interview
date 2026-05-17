import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut, User, BarChart3 } from 'lucide-react';
import { useAuthStore } from '../../store/auth.store';
import { api } from '../../lib/axios';
import { toast } from 'sonner';

export function Navbar() {
  const { user, isAuthenticated, clearAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      clearAuth();
      navigate('/login');
    }
  };

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: 'rgba(7,7,11,0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #8B5CF6, #22D3EE)' }}>
            <span className="text-white font-bold text-sm">A</span>
          </div>
          <span className="font-semibold text-white tracking-tight">ARIA</span>
        </Link>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                className="flex items-center gap-2 text-sm text-[#9A9AA8] hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/5"
              >
                <BarChart3 size={16} />
                Dashboard
              </Link>
              <Link
                to="/profile"
                className="flex items-center gap-2 text-sm text-[#9A9AA8] hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/5"
              >
                <User size={16} />
                {user?.name?.split(' ')[0]}
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm text-[#9A9AA8] hover:text-[#F43F5E] transition-colors px-3 py-2 rounded-lg hover:bg-white/5"
              >
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm text-[#9A9AA8] hover:text-white transition-colors px-4 py-2"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="text-sm font-medium px-4 py-2 rounded-xl text-white transition-all"
                style={{ background: 'linear-gradient(135deg, #8B5CF6, #22D3EE)' }}
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
