import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer
      className="border-t py-12 mt-20"
      style={{ borderColor: 'rgba(255,255,255,0.06)', background: '#07070B' }}
    >
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #8B5CF6, #22D3EE)' }}>
            <span className="text-white font-bold text-xs">A</span>
          </div>
          <span className="font-medium text-white text-sm">ARIA</span>
        </div>
        <p className="text-xs text-[#9A9AA8]">
          © {new Date().getFullYear()} ARIA Interview. Built for engineers who take growth seriously.
        </p>
        <div className="flex gap-6">
          <Link to="/login" className="text-xs text-[#9A9AA8] hover:text-white transition-colors">Login</Link>
          <Link to="/register" className="text-xs text-[#9A9AA8] hover:text-white transition-colors">Register</Link>
        </div>
      </div>
    </footer>
  );
}
