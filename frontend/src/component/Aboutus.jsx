import React from 'react';
import { Target, Zap, Shield, Cpu, Globe, Terminal, ChartColumnIncreasing, Flame, Clock3, CheckCircle2, Rocket, Brain, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AboutUs = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: 'Adaptive Learning',
      desc: 'Personalized practice recommendations and AI hints based on your current performance.',
      icon: Cpu,
      color: 'text-cyan-400',
    },
    {
      title: 'Fast Execution Sandbox',
      desc: 'Secure code execution for C++, Java, and JavaScript with low-latency feedback.',
      icon: Terminal,
      color: 'text-purple-400',
    },
    {
      title: 'Clear Visual Explanations',
      desc: 'Editorial videos and walkthroughs that simplify advanced algorithmic patterns.',
      icon: Zap,
      color: 'text-emerald-400',
    },
  ];

  const impactStats = [
    { label: 'Problems Curated', value: '500+', icon: BookOpen },
    { label: 'Daily Active Learners', value: '10k+', icon: Flame },
    { label: 'Avg. Session Time', value: '43 min', icon: Clock3 },
    { label: 'Interview-Focused Tracks', value: '30+', icon: ChartColumnIncreasing },
  ];

  const roadmap = [
    {
      title: 'Assess Your Level',
      desc: 'Start with a guided diagnostic set to map strengths and weak areas.',
      icon: Brain,
    },
    {
      title: 'Follow Smart Sheets',
      desc: 'Move through structured topic sheets with progressive difficulty.',
      icon: BookOpen,
    },
    {
      title: 'Practice Under Time',
      desc: 'Use timed sessions and challenge mode to simulate real tests and rounds.',
      icon: Clock3,
    },
    {
      title: 'Track + Iterate',
      desc: 'Analyze attempts, revise patterns, and improve consistency week over week.',
      icon: Rocket,
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden pb-20 text-white">
      <div className="pointer-events-none absolute right-0 top-0 h-125 w-125 rounded-full bg-cyan-500/10 blur-[140px]"></div>
      <div className="pointer-events-none absolute bottom-0 left-0 h-125 w-125 rounded-full bg-purple-500/10 blur-[140px]"></div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pt-16 lg:px-8">
        <div className="mb-16 max-w-4xl border-l-2 border-cyan-400/70 pl-6">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">About ALGORISE</p>
          <h1 className="mb-5 text-5xl font-black leading-tight md:text-6xl">
            Train with purpose. <span className="brand-gradient">Ship with confidence.</span>
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-slate-300">
            ALGORISE is a focused coding practice platform built for students, interview candidates, and competitive programmers who want structured growth.
          </p>
        </div>

        <div className="mb-20 grid grid-cols-1 gap-6 md:grid-cols-3">
          {features.map((item) => (
            <div key={item.title} className="glass-panel rounded-3xl p-8 transition hover:-translate-y-1 hover:border-cyan-400/40">
              <div className={`mb-5 inline-flex rounded-xl border border-white/10 bg-white/5 p-3 ${item.color}`}>
                <item.icon size={24} />
              </div>
              <h3 className="mb-3 text-xl font-bold text-white">{item.title}</h3>
              <p className="text-sm leading-relaxed text-slate-400">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="mb-20 grid items-center gap-10 lg:grid-cols-2">
          <div className="glass-panel rounded-3xl p-5">
            <img src="/dashboard-preview.png" alt="ALGORISE dashboard preview" className="w-full rounded-2xl border border-white/10" />
          </div>

          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">Why teams choose us</p>
            <h2 className="mb-7 text-3xl font-black md:text-4xl">Built for measurable improvement</h2>
            <div className="space-y-5">
              {[
                { t: 'Global Benchmarking', d: 'Track progress against peers with transparent ranking and streak systems.', i: Globe },
                { t: 'Reliable Solutions', d: 'Reference solutions optimized for readability, complexity, and interview relevance.', i: Shield },
                { t: 'AI Assisted Guidance', d: 'Receive practical hints that teach approach and reasoning, not just answers.', i: Target },
              ].map((item) => (
                <div key={item.t} className="flex items-start gap-4 rounded-xl border border-white/10 bg-slate-900/40 p-4">
                  <div className="rounded-lg border border-cyan-400/30 bg-cyan-500/10 p-2 text-cyan-300">
                    <item.i size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">{item.t}</h3>
                    <p className="mt-1 text-sm text-slate-400">{item.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-20 rounded-3xl border border-white/10 bg-linear-to-r from-cyan-500/8 via-transparent to-purple-500/8 p-8 md:p-10">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">Impact at a glance</p>
              <h2 className="text-3xl font-black md:text-4xl">Built for real outcomes</h2>
            </div>
            <p className="max-w-lg text-sm text-slate-400">Every feature is designed to improve solving confidence, speed, and interview readiness.</p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {impactStats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-white/10 bg-slate-900/45 p-5">
                <div className="mb-4 inline-flex rounded-xl border border-white/10 bg-white/5 p-2 text-cyan-300">
                  <stat.icon size={18} />
                </div>
                <p className="text-2xl font-black text-white">{stat.value}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-20 grid gap-10 lg:grid-cols-2">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">How growth happens</p>
            <h2 className="mb-6 text-3xl font-black md:text-4xl">A clear learning journey</h2>
            <p className="mb-8 max-w-xl text-slate-400">ALGORISE removes randomness from preparation. You always know what to solve next and why.</p>

            <div className="space-y-4">
              {roadmap.map((step, idx) => (
                <div key={step.title} className="flex gap-4 rounded-2xl border border-white/10 bg-slate-900/40 p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-400/30 bg-cyan-500/10 text-cyan-300">
                    <step.icon size={18} />
                  </div>
                  <div>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Step {idx + 1}</p>
                    <h3 className="text-sm font-semibold text-white">{step.title}</h3>
                    <p className="mt-1 text-sm text-slate-400">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel rounded-3xl p-7 md:p-8">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">What users report</p>
            <h3 className="mb-6 text-2xl font-black">Consistency that compounds</h3>

            <div className="space-y-4">
              {[
                'Clear next-step recommendations after every session.',
                'Topic mastery improves with revision-oriented practice loops.',
                'Timed solving builds confidence for OAs and interviews.',
                'Daily challenge habit improves momentum and discipline.',
              ].map((point) => (
                <div key={point} className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/3 p-4">
                  <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-300" />
                  <p className="text-sm leading-relaxed text-slate-300">{point}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="glass-panel rounded-4xl p-10 text-center md:p-14">
          <h2 className="mx-auto mb-4 max-w-2xl text-3xl font-black md:text-4xl">Ready to improve your consistency?</h2>
          <p className="mx-auto mb-8 max-w-xl text-slate-400">Start solving curated problems with guided learning paths and detailed feedback.</p>
          <button onClick={() => navigate('/practice')} className="btn-primary px-8 py-3">
            Start Practicing
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;