import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ArrowRight, Building2, ChevronRight, CircleCheck, Contrast, Plus, Search, Sunrise, X } from 'lucide-react';
import axiosClient from '../utils/axiosClient';
import { getDailyChallenge } from '../utils/DailyChallenge';
import { Dropdown, Notice, PageLoader } from './ui';
import { capitalize, difficultyColor, pad2 } from '../utils/format';

const PAGE_SIZE = 20;

const DIFFICULTY_OPTIONS = [
  { value: 'All', label: 'All' },
  { value: 'easy', label: 'Easy', dot: 'var(--color-easy)' },
  { value: 'medium', label: 'Medium', dot: 'var(--color-medium)' },
  { value: 'hard', label: 'Hard', dot: 'var(--color-hard)' },
];

const STATUS_OPTIONS = [
  { value: 'All', label: 'All' },
  { value: 'solved', label: 'Solved', dot: 'var(--color-ok)' },
  { value: 'attempted', label: 'Attempted', dot: 'var(--color-warn)' },
  { value: 'todo', label: 'Not started', dot: 'var(--color-neutral-600)' },
];

const asList = (value) =>
  Array.isArray(value) ? value.map((v) => String(v)).filter(Boolean) : String(value || '').split(',').map((v) => v.trim()).filter(Boolean);

// The daily challenge is picked from the UTC date, so it resets at UTC midnight
const msUntilUtcMidnight = (now) => {
  const d = new Date(now);
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + 1) - now;
};

const formatLeft = (ms) => {
  const mins = Math.max(0, Math.floor(ms / 60000));
  return `${Math.floor(mins / 60)}h ${pad2(mins % 60)}m`;
};

const StatusIcon = ({ status }) => {
  if (status === 'solved') return <CircleCheck size={16} style={{ color: 'var(--color-ok)' }} aria-label="Solved" />;
  if (status === 'attempted') return <Contrast size={16} style={{ color: 'var(--color-warn)' }} aria-label="Attempted" />;
  return <span className="block h-3.75 w-3.75 rounded-full border border-neutral-700" aria-label="Not started" />;
};

function ProblemPractice() {
  const navigate = useNavigate();
  const { user } = useSelector((state: any) => state.auth);

  const [problems, setProblems] = useState<any[]>([]);
  const [attempted, setAttempted] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(Date.now());

  const [difficulty, setDifficulty] = useState('All');
  const [status, setStatus] = useState('All');
  const [topic, setTopic] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [limit, setLimit] = useState(PAGE_SIZE);

  const [activePack, setActivePack] = useState<any>(() => {
    try {
      const saved = localStorage.getItem('activePack');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [purchaseNotice, setPurchaseNotice] = useState<{ type: string; message: string } | null>(null);

  /* ================= STRIPE REDIRECT ================= */

  // After checkout, Stripe sends the user back here; confirm the purchase with the backend
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const success = params.get('checkout_success');
    const sessionId = params.get('session_id');
    const pack = params.get('pack');
    if (!success || !sessionId) return;

    (async () => {
      try {
        setPurchaseNotice({ type: 'info', message: 'Verifying purchase…' });
        const { data } = await axiosClient.post('/payment/confirm', { sessionId });
        if (data?.purchase?.paid) {
          setPurchaseNotice({ type: 'success', message: 'Purchase successful. Pack unlocked.' });
          if (pack) {
            try {
              const { data: packsList } = await axiosClient.get('/interview/packs');
              const matchedPack = packsList.find((p: any) => p.packId === pack);
              if (matchedPack) {
                const active = { id: matchedPack.packId, company: matchedPack.company, role: matchedPack.role, problems: matchedPack.problems || [] };
                localStorage.setItem('activePack', JSON.stringify(active));
                setActivePack(active);
              }
            } catch (err) {
              console.error('Failed to auto-start purchased pack', err);
            }
          }
        } else {
          setPurchaseNotice({ type: 'error', message: data?.error || 'Purchase could not be confirmed.' });
        }
      } catch (err: any) {
        setPurchaseNotice({ type: 'error', message: err?.response?.data?.error || 'Purchase confirmation failed.' });
      } finally {
        try {
          const url = new URL(window.location.href);
          ['checkout_success', 'session_id', 'pack'].forEach((k) => url.searchParams.delete(k));
          window.history.replaceState({}, document.title, url.toString());
        } catch {
          // ignore
        }
      }
    })();
  }, []);

  /* ================= DATA ================= */

  useEffect(() => {
    const fetchProblems = async () => {
      setLoading(true);
      try {
        const [{ data }, subs] = await Promise.all([
          axiosClient.get('/problem/getAllProblem'),
          axiosClient.get('/problem/mySubmissions').catch(() => ({ data: [] })),
        ]);
        setProblems(Array.isArray(data) ? data : []);
        // Anything submitted but not solved counts as "attempted"
        setAttempted(new Set((Array.isArray(subs.data) ? subs.data : []).map((s: any) => s.problemId?._id).filter(Boolean)));
      } catch (error) {
        console.error('Error fetching problems:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProblems();
  }, [user?._id]);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(t);
  }, []);

  /* ================= DERIVED ================= */

  const statusOf = (p: any) => (p.isSolved ? 'solved' : attempted.has(p._id) ? 'attempted' : 'todo');

  // Problems in scope: everything, or only the active interview pack's problems
  const scoped = useMemo(() => {
    if (!activePack) return problems;
    const packProblems = Array.isArray(activePack.problems) ? activePack.problems : [];
    if (packProblems.length > 0) return problems.filter((p) => packProblems.includes(p._id));
    if (activePack.company) {
      const company = activePack.company.toLowerCase();
      return problems.filter((p) => asList(p.companies).some((c) => c.toLowerCase() === company));
    }
    return problems;
  }, [problems, activePack]);

  const topTopics = useMemo(() => {
    const counts = new Map<string, number>();
    scoped.forEach((p) => asList(p.tags).forEach((t) => counts.set(t.toLowerCase(), (counts.get(t.toLowerCase()) || 0) + 1)));
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8).map(([t]) => t);
  }, [scoped]);

  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return scoped.filter((p) => {
      if (difficulty !== 'All' && p.difficulty?.toLowerCase() !== difficulty) return false;
      if (status !== 'All' && statusOf(p) !== status) return false;
      if (topic && !asList(p.tags).some((t) => t.toLowerCase() === topic)) return false;
      return !q || p.title?.toLowerCase().includes(q);
    });
    // statusOf depends on attempted
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scoped, difficulty, status, topic, searchTerm, attempted]);

  useEffect(() => setLimit(PAGE_SIZE), [difficulty, status, topic, searchTerm, activePack]);

  const rows = filtered.slice(0, limit);
  const numberOf = useMemo(() => new Map(problems.map((p, i) => [p._id, i + 1])), [problems]);
  const daily = useMemo(() => getDailyChallenge(problems), [problems]);

  const progress = useMemo(() => {
    const bars = ['easy', 'medium', 'hard'].map((key) => {
      const ofLevel = problems.filter((p) => p.difficulty?.toLowerCase() === key);
      const solved = ofLevel.filter((p) => p.isSolved).length;
      return { key, label: capitalize(key), solved, total: ofLevel.length, pct: ofLevel.length ? (solved / ofLevel.length) * 100 : 0 };
    });
    return { solved: problems.filter((p) => p.isSolved).length, total: problems.length, bars };
  }, [problems]);

  const clearFilters = () => {
    setDifficulty('All');
    setStatus('All');
    setTopic('');
    setSearchTerm('');
  };

  if (loading) return <PageLoader label="Loading problems…" />;

  return (
    <div className="page fade-in">
      <div className="flex flex-wrap items-start gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="page-title">Problems</h1>
          <p className="page-sub">
            {problems.length} curated problem{problems.length === 1 ? '' : 's'}. Filter by difficulty, topic or status.
          </p>
        </div>
        <Link to={user?.role === 'admin' ? '/admin/create' : '/create-problem'} className="btn btn-secondary">
          <Plus size={16} /> Contribute
        </Link>
      </div>

      {purchaseNotice && (
        <div className="mt-6">
          <Notice type={purchaseNotice.type} onClose={() => setPurchaseNotice(null)}>
            {purchaseNotice.message}
          </Notice>
        </div>
      )}

      {/* Daily challenge / pack + progress */}
      <div className="mt-6 grid gap-3 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)]">
        {activePack ? (
          <div className="panel flex items-center gap-4 p-4">
            <span className="grid h-10 w-10 flex-none place-items-center rounded-[10px] bg-accent-900 text-accent-200">
              <Building2 size={20} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-[12.5px] text-neutral-400">Mock assessment</div>
              <div className="mt-0.5 truncate text-[16px] font-medium">
                {activePack.company} <span className="text-sm font-normal text-neutral-400">· {activePack.role}</span>
              </div>
            </div>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => {
                localStorage.removeItem('activePack');
                setActivePack(null);
              }}
            >
              <X size={15} /> Exit
            </button>
          </div>
        ) : daily ? (
          <Link to={`/problem/${daily._id}`} className="panel flex items-center gap-4 p-4 text-text hover:shadow-[inset_0_0_0_1px_var(--color-accent-700)]">
            <span className="grid h-10 w-10 flex-none place-items-center rounded-[10px] bg-accent-900 text-accent-200">
              <Sunrise size={20} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-[12.5px] text-neutral-400">Daily challenge · resets in {formatLeft(msUntilUtcMidnight(now))}</div>
              <div className="mt-0.5 truncate text-[16px] font-medium">{daily.title}</div>
            </div>
            <span className="flex items-center gap-1 text-[13px]" style={{ color: daily.isSolved ? 'var(--color-ok)' : 'var(--color-accent)' }}>
              {daily.isSolved ? '✓ Solved' : <>Solve <ArrowRight size={14} /></>}
            </span>
          </Link>
        ) : (
          <div className="panel p-4 text-sm text-neutral-400">No problems published yet.</div>
        )}

        <div className="panel flex items-center gap-5 p-4">
          <div className="flex-none">
            <div className="tnum text-[22px] font-medium leading-none">
              {progress.solved} <span className="text-[13px] font-normal text-neutral-500">/ {progress.total}</span>
            </div>
            <div className="mt-1.5 text-[12.5px] text-neutral-400">Solved</div>
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-1.5">
            {progress.bars.map((b) => (
              <div key={b.key} className="grid grid-cols-[56px_minmax(0,1fr)_52px] items-center gap-3 text-[12.5px]">
                <span style={{ color: difficultyColor(b.key) }}>{b.label}</span>
                <span className="h-1 rounded-sm bg-neutral-800">
                  <span className="block h-1 rounded-sm" style={{ width: `${b.pct}%`, background: difficultyColor(b.key) }} />
                </span>
                <span className="tnum text-right text-neutral-400">
                  {b.solved}/{b.total}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-6 flex flex-wrap items-center gap-2">
        <div className="relative w-full sm:w-80">
          <Search size={15} className="absolute left-2.5 top-2.75 text-neutral-500" />
          <input className="input pl-8" placeholder="Search problems" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <Dropdown label="Difficulty" value={difficulty} options={DIFFICULTY_OPTIONS} onChange={setDifficulty} />
        <Dropdown label="Status" value={status} options={STATUS_OPTIONS} onChange={setStatus} />
      </div>
      {topTopics.length > 0 && (
        <div className="mt-3 flex gap-1.5 overflow-x-auto pb-1">
          <button type="button" className="chip" aria-pressed={!topic} onClick={() => setTopic('')}>
            All topics
          </button>
          {topTopics.map((t) => (
            <button key={t} type="button" className="chip capitalize" aria-pressed={topic === t} onClick={() => setTopic(topic === t ? '' : t)}>
              {t}
            </button>
          ))}
        </div>
      )}

      {/* Results */}
      {rows.length === 0 ? (
        <div className="panel-quiet mt-4 flex flex-col items-center px-5 py-14 text-center">
          <Search size={28} className="text-neutral-600" />
          <div className="mt-3 text-[15px] font-medium">No problems match these filters</div>
          <div className="mt-1 text-[13px] text-neutral-400">Try a different topic or clear the filters.</div>
          <button type="button" className="btn btn-secondary mt-4" onClick={clearFilters}>
            Clear filters
          </button>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="mt-3 hidden md:block">
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: 36 }} />
                <th>Title</th>
                <th>Topics</th>
                <th style={{ width: 110 }}>Difficulty</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p._id} className="cursor-pointer" onClick={() => navigate(`/problem/${p._id}`)}>
                  <td style={{ padding: '12px 8px' }}>
                    <StatusIcon status={statusOf(p)} />
                  </td>
                  <td style={{ padding: '12px 8px' }}>
                    <Link to={`/problem/${p._id}`} className="text-text hover:text-accent" onClick={(e) => e.stopPropagation()}>
                      {numberOf.get(p._id)}. {p.title}
                    </Link>
                  </td>
                  <td style={{ padding: '12px 8px' }}>
                    <span className="flex flex-wrap gap-1.5">
                      {asList(p.tags).slice(0, 2).map((t) => (
                        <span key={t} className="tag tag-neutral capitalize">
                          {t}
                        </span>
                      ))}
                    </span>
                  </td>
                  <td className="text-sm" style={{ padding: '12px 8px', color: difficultyColor(p.difficulty) }}>
                    {capitalize(p.difficulty)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>

          {/* Mobile list */}
          <div className="mt-3 md:hidden">
            {rows.map((p) => (
              <Link key={p._id} to={`/problem/${p._id}`} className="row-rule flex items-center gap-3 py-3.5 text-text">
                <StatusIcon status={statusOf(p)} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[15px]">{p.title}</span>
                  <span className="mt-0.5 block truncate text-[12.5px] capitalize text-neutral-500">
                    <span style={{ color: difficultyColor(p.difficulty) }}>{capitalize(p.difficulty)}</span>
                    {asList(p.tags).length ? ` · ${asList(p.tags).slice(0, 2).join(' · ')}` : ''}
                  </span>
                </span>
                <ChevronRight size={16} className="text-neutral-600" />
              </Link>
            ))}
          </div>

          <div className="mt-4 flex items-center gap-3 text-[13px] text-neutral-500">
            <span className="tnum">
              Showing {rows.length} of {filtered.length}
            </span>
            <span className="flex-1" />
            {rows.length < filtered.length && (
              <button type="button" className="btn btn-secondary" onClick={() => setLimit((l) => l + PAGE_SIZE)}>
                Load more
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default ProblemPractice;
