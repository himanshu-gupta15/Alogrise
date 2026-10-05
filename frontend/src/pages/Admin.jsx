import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { BriefcaseBusiness, Check, ChevronRight, CircleCheck, CirclePlus, MonitorPlay, Pencil, Plus, Trash2, Trophy, UsersRound } from 'lucide-react';
import axiosClient from '../utils/axiosClient';
import { Spinner } from '../component/ui';
import { capitalize, difficultyColor, formatNumber, timeAgo } from '../utils/format';

const MODULES = [
  { icon: CirclePlus, title: 'Create problem', desc: 'Publishes immediately', to: '/admin/create' },
  { icon: Pencil, title: 'Edit problems', desc: 'Statements, tests, tags', to: '/admin/update' },
  { icon: Trash2, title: 'Delete problems', desc: 'Remove from the platform', to: '/admin/delete' },
  { icon: MonitorPlay, title: 'Video solutions', desc: 'Upload walkthroughs', to: '/admin/video' },
  { icon: Trophy, title: 'Contest builder', desc: 'Schedule, assign problems', to: '/admin/contest' },
  { icon: BriefcaseBusiness, title: 'Interview packs', desc: 'Sets and pricing', to: '/admin/interview' },
  { icon: UsersRound, title: 'Users & roles', desc: 'Access control', to: '/admin/user-management' },
];

const isLive = (p) => p.status === 'approved' || p.status == null;

const handleOf = (creator) => {
  if (!creator) return null;
  const name = [creator.firstName, creator.lastName].filter(Boolean).join(' ');
  return name || creator.emailId?.split('@')[0] || null;
};

function Admin() {
  const [pending, setPending] = useState([]);
  const [loadingPending, setLoadingPending] = useState(true);
  const [stats, setStats] = useState({ problems: null, users: null, contests: null });
  const [busyId, setBusyId] = useState('');
  const [toast, setToast] = useState('');

  useEffect(() => {
    axiosClient
      .get('/problem/pending')
      .then(({ data }) => setPending(Array.isArray(data) ? data : []))
      .catch(() => setToast('Could not load the review queue.'))
      .finally(() => setLoadingPending(false));

    Promise.all([
      axiosClient.get('/problem/getAllProblem').catch(() => null),
      axiosClient.get('/user/admin/users').catch(() => null),
      axiosClient.get('/contest/all').catch(() => null),
    ]).then(([problems, users, contests]) => {
      setStats({
        problems: Array.isArray(problems?.data) ? problems.data.filter(isLive).length : null,
        users: users?.data?.count ?? null,
        contests: Array.isArray(contests?.data) ? contests.data.length : null,
      });
    });
  }, []);

  // Oldest submissions first, so nothing waits too long
  const queue = useMemo(() => [...pending].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)), [pending]);
  const oldest = queue[0]?.createdAt;

  const review = async (problem, status) => {
    try {
      setBusyId(problem._id);
      await axiosClient.put(`/problem/update/${problem._id}`, { status });
      setPending((prev) => prev.filter((p) => p._id !== problem._id));
      if (status === 'approved') setStats((s) => ({ ...s, problems: s.problems == null ? s.problems : s.problems + 1 }));
      setToast(status === 'approved' ? `Approved “${problem.title}” — now live` : `Rejected “${problem.title}”`);
    } catch {
      setToast(`Could not update “${problem.title}”. Try again.`);
    } finally {
      setBusyId('');
    }
  };

  const show = (v) => (v == null ? '—' : formatNumber(v));

  const cells = [
    ['Live problems', show(stats.problems)],
    ['Registered users', show(stats.users)],
    ['Contests', show(stats.contests)],
    ['Awaiting review', loadingPending ? '—' : pending.length, oldest ? `oldest ${timeAgo(oldest)}` : null],
  ];

  return (
    <div className="page fade-in">
      <div className="flex flex-wrap items-end gap-4">
        <div className="flex-1">
          <div className="eyebrow eyebrow-accent text-xs">Admin</div>
          <h1 className="page-title mt-1">Overview</h1>
        </div>
        <Link to="/admin/create" className="btn btn-primary">
          <Plus size={16} /> Create problem
        </Link>
      </div>

      <div className="stat-grid mt-6 grid-cols-2 md:grid-cols-4">
        {cells.map(([label, value, note], i) => (
          <div key={label}>
            <div className="text-[12.5px] text-neutral-400">{label}</div>
            <div className="mt-1.5 flex items-baseline gap-2">
              <span className="tnum text-[24px] font-medium leading-none" style={i === 3 && pending.length ? { color: 'var(--color-warn)' } : undefined}>
                {value}
              </span>
              {note && <span className="text-xs text-neutral-400">{note}</span>}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[15px] font-medium">Review queue</span>
            <span className="tag tag-neutral tnum">{pending.length}</span>
            <span className="flex-1" />
            {toast ? <span className="text-[13px] text-accent-300">{toast}</span> : <span className="text-xs text-neutral-500">Oldest first</span>}
          </div>

          {loadingPending ? (
            <div className="flex items-center gap-2 py-8 text-sm text-neutral-400">
              <Spinner size={16} /> Loading review queue…
            </div>
          ) : queue.length === 0 ? (
            <div className="flex items-center gap-3 py-10 text-neutral-300">
              <CircleCheck size={20} style={{ color: 'var(--color-ok)' }} /> Queue clear — nothing waiting for review.
            </div>
          ) : (
            queue.map((p) => (
              <div key={p._id} className="row-rule grid items-center gap-3 py-3.5 sm:grid-cols-[minmax(0,1fr)_auto]">
                <div className="min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="truncate text-[15px] font-medium">{p.title}</span>
                    <span className="text-[12.5px]" style={{ color: difficultyColor(p.difficulty) }}>{capitalize(p.difficulty)}</span>
                  </div>
                  <div className="mt-0.5 text-[12.5px] text-neutral-500">
                    <span className="capitalize">{(p.tags || []).join(' · ')}</span>
                    {handleOf(p.problemCreator) ? ` · ${handleOf(p.problemCreator)}` : ''}
                    {p.createdAt ? ` · ${timeAgo(p.createdAt)}` : ''}
                  </div>
                </div>
                <span className="flex gap-1.5">
                  <Link to={`/problem/${p._id}`} className="btn">Preview</Link>
                  <button type="button" className="btn btn-secondary" disabled={busyId === p._id} onClick={() => review(p, 'rejected')}>
                    Reject
                  </button>
                  <button type="button" className="btn btn-primary" disabled={busyId === p._id} onClick={() => review(p, 'approved')}>
                    <Check size={15} /> Approve
                  </button>
                </span>
              </div>
            ))
          )}
        </div>

        <aside>
          <div className="text-[15px] font-medium">Manage</div>
          <div className="mt-2">
            {MODULES.map((m) => {
              const Icon = m.icon;
              return (
                <Link key={m.to} to={m.to} className="flex items-center gap-3 rounded-lg px-2 py-2.5 text-text hover:bg-white/4">
                  <Icon size={17} className="flex-none text-neutral-400" />
                  <span className="flex-1">
                    <span className="block text-[14px]">{m.title}</span>
                    <span className="block text-[12.5px] text-neutral-500">{m.desc}</span>
                  </span>
                  <ChevronRight size={15} className="text-neutral-600" />
                </Link>
              );
            })}
          </div>
        </aside>
      </div>
    </div>
  );
}

export default Admin;
