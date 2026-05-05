import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Linkedin, Twitter } from 'lucide-react';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-20 overflow-hidden border-t border-white/10 bg-slate-950/80 pb-8 pt-14">
      <div className="absolute -top-32 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-cyan-500/10 blur-3xl"></div>

      <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-10 px-6 md:grid-cols-4 lg:px-8">
        <div className="space-y-4 md:col-span-2 lg:col-span-1">
          <Link to="/" className="flex items-center gap-3">
            <div className="h-9 w-9 overflow-hidden rounded-full border border-white/20">
              <img src="/logo.png" alt="ALGORISE" className="h-full w-full object-cover" />
            </div>
            <span className="brand-gradient text-lg font-black">ALGORISE</span>
          </Link>
          <p className="text-sm leading-relaxed text-slate-400">
            Professional coding practice platform focused on consistency, mentorship, and measurable growth.
          </p>
          <div className="flex items-center gap-2">
            {[Twitter, Github, Linkedin].map((Icon, idx) => (
              <a
                key={idx}
                href="#"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-slate-900/80 text-slate-300 transition hover:border-cyan-400/50 hover:text-cyan-300"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Platform</h4>
          <ul className="space-y-2 text-sm text-slate-300">
            <li><Link to="/practice" className="hover:text-cyan-300">Problem Set</Link></li>
            <li><Link to="/contest" className="hover:text-cyan-300">Contests</Link></li>
            <li><Link to="/leaderboard" className="hover:text-cyan-300">Leaderboard</Link></li>
            <li><Link to="/profile" className="hover:text-cyan-300">Profile</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Company</h4>
          <ul className="space-y-2 text-sm text-slate-300">
            <li><Link to="/interview" className="hover:text-cyan-300">Interview</Link></li>
            <li><a href="#" className="hover:text-cyan-300">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-cyan-300">Terms of Service</a></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Newsletter</h4>
          <p className="mb-3 text-sm text-slate-400">Get product and contest updates.</p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Email address"
              className="w-full rounded-lg border border-white/10 bg-slate-900/80 px-3 py-2 text-sm text-slate-200 outline-none ring-cyan-500/60 transition focus:ring"
            />
            <button className="btn-primary px-4 py-2 text-sm">Join</button>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 flex w-full max-w-7xl flex-col items-center justify-between gap-2 border-t border-white/10 px-6 pt-6 text-xs text-slate-500 md:flex-row lg:px-8">
        <p>© {year} ALGORISE. All rights reserved.</p>
        <p className="inline-flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
          Platform operational
        </p>
      </div>
    </footer>
  );
};

export default Footer;