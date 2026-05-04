import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, ChartColumnIncreasing, CheckCircle2, Clock3, Code2, Flame, Globe2, Rocket, ShieldCheck, Sparkles, Target, Users } from 'lucide-react';

const AboutUs = () => {
  const navigate = useNavigate();

  const pillars = [
    {
      title: 'Structured Learning Paths',
      desc: 'Topic-wise progression so learners always know what to solve next.',
      icon: BookOpen,
    },
    {
      title: 'Interview-Centric Practice',
      desc: 'Problems and explanations focused on real company interview patterns.',
      icon: Target,
    },
    {
      title: 'Reliable Performance Insights',
      desc: 'Track acceptance, activity, streak, and growth with clarity.',
      icon: ChartColumnIncreasing,
    },
  ];

  const stats = [
    { value: '500+', label: 'Problems Curated', icon: Code2 },
    { value: '10k+', label: 'Active Learners', icon: Users },
    { value: '43 min', label: 'Avg Session Time', icon: Clock3 },
    { value: '30+', label: 'Learning Tracks', icon: Flame },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden pb-20 text-white">
      <div className="pointer-events-none absolute -top-16 right-0 h-112 w-md rounded-full bg-cyan-500/10 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-112 w-md rounded-full bg-purple-500/10 blur-[120px]" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pt-16 lg:px-8">
        <section className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-cyan-300">About ALGORISE</p>
            <h1 className="mt-4 text-4xl font-black leading-tight md:text-6xl">
              A professional platform for
              <span className="brand-gradient"> coding interview mastery</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 md:text-lg">
              ALGORISE helps students and professionals build strong DSA fundamentals with guided practice,
              practical editorial support, and clear performance tracking.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button onClick={() => navigate('/practice')} className="btn-primary px-7 py-3">
                Start Practicing
              </button>
              <button onClick={() => navigate('/contest')} className="btn-secondary px-7 py-3">
                Explore Contests
              </button>
            </div>
          </div>

          <div className="glass-panel rounded-3xl p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">Platform highlights</p>
            <div className="mt-4 space-y-3">
              {[
                { icon: ShieldCheck, text: 'Secure compiler execution pipeline' },
                { icon: Globe2, text: 'Global ranking and performance visibility' },
                { icon: Sparkles, text: 'AI-assisted hint workflow for faster learning' },
                { icon: Rocket, text: 'Progressive difficulty for consistent growth' },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-3 rounded-xl border border-white/10 bg-slate-900/50 px-4 py-3">
                  <item.icon size={17} className="text-cyan-300" />
                  <p className="text-sm text-slate-300">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-14 grid gap-5 md:grid-cols-3">
          {pillars.map((item) => (
            <div key={item.title} className="glass-panel rounded-2xl p-6">
              <div className="inline-flex rounded-xl border border-cyan-400/20 bg-cyan-500/10 p-3 text-cyan-300">
                <item.icon size={20} />
              </div>
              <h3 className="mt-4 text-xl font-bold text-white">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">{item.desc}</p>
            </div>
          ))}
        </section>

        <section className="mt-14 rounded-3xl border border-white/10 bg-linear-to-r from-cyan-500/8 via-transparent to-purple-500/8 p-6 md:p-10">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">Impact</p>
              <h2 className="mt-2 text-3xl font-black">Performance-driven outcomes</h2>
            </div>
            <p className="max-w-xl text-sm text-slate-400">Designed to increase consistency, confidence, and interview readiness through disciplined practice.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((item) => (
              <div key={item.label} className="rounded-2xl border border-white/10 bg-slate-900/50 p-5">
                <div className="inline-flex rounded-lg border border-white/10 bg-white/5 p-2 text-cyan-300">
                  <item.icon size={18} />
                </div>
                <p className="mt-4 text-3xl font-black text-white">{item.value}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.14em] text-slate-400">{item.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-14 grid gap-6 lg:grid-cols-2">
          <div className="glass-panel rounded-3xl p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">Our Mission</p>
            <h3 className="mt-3 text-3xl font-black">Make quality preparation accessible</h3>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              We aim to provide a focused environment where learners can practice intentionally,
              understand patterns deeply, and prepare for interviews with confidence.
            </p>
          </div>

          <div className="glass-panel rounded-3xl p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">What You Get</p>
            <div className="mt-4 space-y-3">
              {[
                'Curated problem sets with progressive difficulty',
                'Editorial support and clear conceptual guidance',
                'Practical analytics to track real improvement',
                'Contest-style pressure for interview readiness',
              ].map((line) => (
                <div key={line} className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                  <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-emerald-300" />
                  <p className="text-sm text-slate-300">{line}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutUs;