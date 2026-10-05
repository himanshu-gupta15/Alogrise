import { Link } from 'react-router-dom';
import { ArrowRight, BriefcaseBusiness, ChartLine, CirclePlay, Sparkles, Sunrise, Trophy, UsersRound } from 'lucide-react';

/* ================= PRODUCT PREVIEW ================= */

const SAMPLE = `    vector<vector<int>> merge(vector<vector<int>>& intervals) {
        sort(intervals.begin(), intervals.end());
        vector<vector<int>> merged;
        for (auto& cur : intervals) {
            // start a new block, or stretch the last one
            if (merged.empty() || merged.back()[1] < cur[0]) {
                merged.push_back(cur);
            } else {
                merged.back()[1] = max(merged.back()[1], cur[1]);
            }`;

const KEYWORDS = 'class|public|vector|int|return|for|if|else|auto|const|let|while|in|new|of';
const TOKEN_RE = new RegExp(`(//.*$|\\b(?:${KEYWORDS})\\b|\\b\\d+\\b)`, 'g');

// Minimal highlighter: comments muted, keywords and numbers in accent tints
const tokenize = (line) => {
  const out = [];
  let last = 0;
  line.replace(TOKEN_RE, (match, _g, offset) => {
    if (offset > last) out.push({ t: line.slice(last, offset), c: 'var(--color-neutral-200)' });
    out.push({ t: match, c: match.startsWith('//') ? 'var(--color-neutral-500)' : /^\d/.test(match) ? 'var(--color-accent-200)' : 'var(--color-accent-300)' });
    last = offset + match.length;
    return match;
  });
  if (last < line.length) out.push({ t: line.slice(last), c: 'var(--color-neutral-200)' });
  return out.length ? out : [{ t: ' ', c: 'inherit' }];
};

const Preview = () => (
  <div className="overflow-hidden rounded-xl bg-surface elev-md">
    <div className="relative flex items-center gap-1.5 px-3.5 py-2.5" style={{ boxShadow: 'inset 0 -1px 0 var(--color-neutral-800)' }}>
      {[0, 1, 2].map((i) => (
        <span key={i} className="h-2 w-2 rounded-full bg-neutral-700" />
      ))}
      <span className="absolute left-1/2 hidden -translate-x-1/2 text-xs text-neutral-500 sm:block">algorise · Merge Intervals</span>
    </div>
    <div className="grid md:grid-cols-2">
      <div className="p-5 md:p-6" style={{ boxShadow: 'inset -1px 0 0 var(--color-neutral-800)' }}>
        <div className="flex items-baseline gap-2">
          <span className="text-[16px] font-medium">56. Merge Intervals</span>
          <span className="text-xs" style={{ color: 'var(--color-medium)' }}>Medium</span>
        </div>
        <p className="mt-2.5 text-[13.5px] leading-relaxed text-neutral-300">
          Given an array of intervals, merge all overlapping intervals and return the non-overlapping intervals that cover every input.
        </p>
        <div className="code-surface mt-3.5 rounded-lg px-3 py-2.5 font-mono text-xs text-neutral-200">[[1,3],[2,6],[8,10]] → [[1,6],[8,10]]</div>
        <div className="mt-3 flex items-start gap-2.5 rounded-lg px-3 py-2.5 text-[13px] text-neutral-200" style={{ boxShadow: 'inset 0 0 0 1px var(--color-neutral-800)' }}>
          <Sparkles size={15} className="mt-0.5 flex-none text-accent" />
          Sort by start first — then you only compare each interval with the last merged one.
        </div>
      </div>
      <div className="code-surface hidden overflow-hidden py-4 font-mono text-[12.5px] leading-5.25 md:block">
        {SAMPLE.split('\n').map((line, i) => (
          <div key={i} className="flex whitespace-pre">
            <span className="w-10 flex-none pr-3.5 text-right text-neutral-700">{i + 3}</span>
            {tokenize(line).map((seg, j) => (
              <span key={j} style={{ color: seg.c }}>
                {seg.t}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  </div>
);

/* ================= CONTENT ================= */

const LOOP = [
  { n: '01', icon: Sunrise, title: 'Practice daily', desc: 'A daily challenge and topic filters that order problems so each one builds on the last.' },
  { n: '02', icon: Trophy, title: 'Compete weekly', desc: 'Timed contests put your speed under a clock — or run any past contest virtually.' },
  { n: '03', icon: BriefcaseBusiness, title: 'Interview ready', desc: 'Mock online assessments, phone screens and onsite loops built from real company patterns.' },
];

const FEATURES = [
  { icon: Sparkles, title: 'A coach, not a cheat sheet', desc: 'Ask for a hint, edge cases or a code review. It nudges toward the idea without handing over the answer.' },
  { icon: CirclePlay, title: 'Editorials with video', desc: 'Video walkthroughs for problems, right next to the editor.' },
  { icon: ChartLine, title: 'Progress you can read', desc: 'Streaks, solve history and difficulty breakdowns show where you’re strong and where to spend time.' },
  { icon: UsersRound, title: 'Community problems', desc: 'Write your own problem with tests and a reference solution. Reviewers approve it before it goes live.' },
];

const Landing = () => (
  <div className="page-ground-deep">
    {/* Hero */}
    <section className="px-4 pt-14 sm:px-10 lg:px-14 lg:pt-24">
      <span className="inline-flex items-center gap-2 rounded-full py-1 pl-1 pr-3 text-[13px] text-neutral-200" style={{ boxShadow: 'inset 0 0 0 1px var(--color-neutral-800)' }}>
        <span className="tag tag-accent">New</span> AI coach that hints instead of spoiling
      </span>
      <h1 className="mt-6 text-[48px] leading-[1.05] tracking-[-0.03em] sm:text-[72px]">
        Practice that
        <br />
        compounds.
      </h1>
      <p className="mt-5 max-w-[56ch] text-[17px] leading-relaxed text-neutral-300">
        Algorise turns scattered problem-solving into a routine: a daily challenge, topic filters, timed contests and mock interviews — in one focused workspace.
      </p>
      <div className="mt-7 flex flex-wrap gap-2.5">
        <Link to="/signup" className="btn btn-primary btn-lg">
          Start practicing free <ArrowRight size={16} />
        </Link>
        <Link to="/signin" className="btn btn-secondary btn-lg">
          I have an account
        </Link>
      </div>
      <div className="mt-14">
        <Preview />
      </div>
    </section>

    {/* How it works */}
    <section className="px-4 pt-24 sm:px-10 lg:px-14">
      <div className="eyebrow eyebrow-accent text-xs">How it works</div>
      <h2 className="mt-2.5 max-w-[20ch] text-[34px] font-medium tracking-[-0.02em]">A loop that turns practice into results.</h2>
      <div className="mt-10 grid gap-10 md:grid-cols-3">
        {LOOP.map((step) => {
          const Icon = step.icon;
          return (
            <div key={step.n}>
              <div className="flex items-center gap-3 text-[13px] text-accent">
                {step.n}
                <span className="h-px flex-1" style={{ background: 'linear-gradient(to right, var(--color-neutral-800), transparent)' }} />
              </div>
              <div className="mt-4 flex items-center gap-2.5 text-[18px] font-medium">
                <Icon size={18} className="text-accent" /> {step.title}
              </div>
              <p className="mt-2 text-[14.5px] leading-relaxed text-neutral-400">{step.desc}</p>
            </div>
          );
        })}
      </div>
    </section>

    {/* Features */}
    <section className="px-4 pt-20 sm:px-10 lg:px-14">
      <div className="grid overflow-hidden rounded-xl sm:grid-cols-2 lg:grid-cols-4" style={{ boxShadow: 'inset 0 0 0 1px var(--color-neutral-800)' }}>
        {FEATURES.map((f, i) => {
          const Icon = f.icon;
          return (
            <div key={f.title} className="p-6" style={{ boxShadow: i ? 'inset 1px 0 0 var(--color-neutral-800)' : 'none' }}>
              <Icon size={18} className="text-accent-300" />
              <div className="mt-5 text-[16px] font-medium">{f.title}</div>
              <p className="mt-2 text-[14px] leading-relaxed text-neutral-400">{f.desc}</p>
            </div>
          );
        })}
      </div>
    </section>

    {/* CTA */}
    <section className="mt-24 px-4 py-18 sm:px-10 lg:px-14" style={{ boxShadow: 'inset 0 1px 0 var(--color-neutral-900)' }}>
      <div className="flex flex-wrap items-center justify-between gap-6">
        <div>
          <h3 className="text-[30px] font-medium tracking-[-0.015em]">Your first problem takes two minutes.</h3>
          <p className="mt-2 text-[15px] text-neutral-400">Free to start. No card required.</p>
        </div>
        <Link to="/signup" className="btn btn-primary btn-lg">
          Create free account
        </Link>
      </div>
    </section>
  </div>
);

export default Landing;
