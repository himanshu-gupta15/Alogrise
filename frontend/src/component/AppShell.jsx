import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  BriefcaseBusiness,
  ChartColumn,
  ChevronsUpDown,
  CirclePlus,
  Code,
  FileStack,
  Flame,
  ListChecks,
  LogOut,
  Search,
  ShieldCheck,
  Trophy,
  User,
} from 'lucide-react';
import { logoutUser } from '../authSlice';
import axiosClient from '../utils/axiosClient';
import { getDailyChallenge } from '../utils/DailyChallenge';
import { capitalize, difficultyColor, pad2 } from '../utils/format';
import { Avatar, BrandMark } from './ui';

/* ================= NAV MODEL ================= */

const isProblemsPath = (p) => p === '/' || p === '/practice';

const navGroupsFor = ({ isAdmin, contestBadge, pendingCount }) => {
  const groups = [
    {
      label: 'Practice',
      items: [
        { to: '/practice', label: 'Problems', icon: ListChecks, match: isProblemsPath },
        { to: '/contest', label: 'Contests', icon: Trophy, badge: contestBadge },
        { to: '/interview', label: 'Interview prep', icon: BriefcaseBusiness },
        { to: '/leaderboard', label: 'Leaderboard', icon: ChartColumn },
      ],
    },
    {
      label: 'You',
      items: [
        { to: '/profile', label: 'Profile', icon: User, match: (p) => p === '/profile' },
        isAdmin
          ? { to: '/admin/create', label: 'Create problem', icon: CirclePlus }
          : { to: '/create-problem', label: 'Contribute', icon: CirclePlus },
      ],
    },
  ];
  if (isAdmin) {
    groups.push({
      label: 'Admin',
      items: [{ to: '/admin', label: 'Overview', icon: ShieldCheck, badge: pendingCount ? String(pendingCount) : '', match: (p) => p === '/admin' }],
    });
  }
  return groups;
};

const TAB_BAR = [
  { to: '/practice', label: 'Problems', icon: ListChecks, match: isProblemsPath },
  { to: '/contest', label: 'Contests', icon: Trophy },
  { to: '/interview', label: 'Interview', icon: BriefcaseBusiness },
  { to: '/leaderboard', label: 'Ranks', icon: ChartColumn },
  { to: '/profile', label: 'Me', icon: User, match: (p) => p.startsWith('/profile') || p === '/my-problems' },
];

const TITLES = [
  [isProblemsPath, 'Problems'],
  [(p) => p.startsWith('/contest'), 'Contests'],
  [(p) => p.startsWith('/interview'), 'Interview prep'],
  [(p) => p.startsWith('/leaderboard'), 'Leaderboard'],
  [(p) => p.startsWith('/profile'), 'Profile'],
  [(p) => p === '/my-problems', 'My problems'],
  [(p) => p === '/create-problem' || p === '/admin/create', 'Create problem'],
  [(p) => p.startsWith('/admin'), 'Admin'],
];

const PALETTE_PAGES = [
  { label: 'Problems', to: '/practice', icon: ListChecks },
  { label: 'Contests', to: '/contest', icon: Trophy },
  { label: 'Interview prep', to: '/interview', icon: BriefcaseBusiness },
  { label: 'Leaderboard', to: '/leaderboard', icon: ChartColumn },
  { label: 'Profile', to: '/profile', icon: User },
  { label: 'My problems', to: '/my-problems', icon: FileStack },
  { label: 'Contribute a problem', to: '/create-problem', icon: CirclePlus },
];

const isActive = (item, pathname) => (item.match ? item.match(pathname) : pathname.startsWith(item.to));

const WEEKDAY = new Intl.DateTimeFormat('en-US', { weekday: 'short' });

/* ================= SHARED DATA ================= */

// Problems + contests for the sidebar (daily challenge, contest badge) and the palette
const useShellData = (isAdmin, userId) => {
  const [problems, setProblems] = useState([]);
  const [contests, setContests] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    if (!userId) return;
    axiosClient.get('/problem/getAllProblem').then(({ data }) => setProblems(Array.isArray(data) ? data : [])).catch(() => {});
    axiosClient.get('/contest/all').then(({ data }) => setContests(Array.isArray(data) ? data : [])).catch(() => {});
    if (isAdmin) {
      axiosClient.get('/problem/pending').then(({ data }) => setPendingCount(Array.isArray(data) ? data.length : 0)).catch(() => {});
    }
  }, [isAdmin, userId]);

  return { problems, contests, pendingCount };
};

/* ================= COMMAND PALETTE ================= */

let peopleCache = null;

const CommandPalette = ({ onClose, problems, isAdmin }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [people, setPeople] = useState(peopleCache);
  const [active, setActive] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
    if (peopleCache) return;
    axiosClient
      .get('/user/getleaderboard')
      .then(({ data }) => {
        peopleCache = Array.isArray(data) ? data : [];
        setPeople(peopleCache);
      })
      .catch(() => setPeople([]));
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const pages = (isAdmin ? [...PALETTE_PAGES, { label: 'Admin overview', to: '/admin', icon: ShieldCheck }] : PALETTE_PAGES).map((p) => ({ ...p, meta: 'Page' }));
    const probs = problems.map((p) => ({ label: p.title, to: `/problem/${p._id}`, icon: Code, meta: capitalize(p.difficulty), metaColor: difficultyColor(p.difficulty) }));
    const ppl = (people || []).map((p) => ({ label: `${p.firstName || ''} ${p.lastName || ''}`.trim(), to: `/profile/${p._id}`, icon: User, meta: 'Person' }));
    const all = q ? [...pages, ...probs, ...ppl] : [...pages, ...probs.slice(0, 4)];
    return all.filter((r) => !q || r.label.toLowerCase().includes(q)).slice(0, 9);
  }, [query, problems, people, isAdmin]);

  const go = (r) => {
    onClose();
    navigate(r.to);
  };

  return (
    <div className="dialog-backdrop items-start pt-[12vh]" onClick={onClose}>
      <div className="w-[min(560px,100%)] overflow-hidden rounded-xl bg-surface elev-lg" style={{ animation: 'al-pop 140ms ease-out' }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-2.5 px-4 py-3" style={{ boxShadow: 'inset 0 -1px 0 var(--color-neutral-800)' }}>
          <Search size={16} className="text-neutral-500" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') {
                e.preventDefault();
                setActive((a) => Math.min(results.length - 1, a + 1));
              } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setActive((a) => Math.max(0, a - 1));
              } else if (e.key === 'Enter' && results[active]) {
                go(results[active]);
              } else if (e.key === 'Escape') {
                onClose();
              }
            }}
            placeholder="Search problems, pages, people"
            className="min-w-0 flex-1 bg-transparent text-[15px] text-text outline-none placeholder:text-neutral-500"
            style={{ outline: 'none' }}
          />
          <span className="rounded border border-neutral-800 px-1.5 text-[11px] text-neutral-500">Esc</span>
        </div>
        <div className="max-h-90 overflow-y-auto p-1.5">
          {results.length === 0 && <p className="px-3 py-6 text-center text-sm text-neutral-400">No results for “{query}”</p>}
          {results.map((r, i) => {
            const Icon = r.icon;
            return (
              <button
                key={`${r.to}-${i}`}
                type="button"
                onMouseEnter={() => setActive(i)}
                onClick={() => go(r)}
                className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm"
                style={{ background: i === active ? 'color-mix(in srgb, var(--color-text) 7%, transparent)' : 'transparent' }}
              >
                <Icon size={16} className="flex-none text-neutral-400" />
                <span className="min-w-0 flex-1 truncate">{r.label}</span>
                <span className="text-xs" style={{ color: r.metaColor || 'var(--color-neutral-500)' }}>
                  {r.meta}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/* ================= SIDEBAR ================= */

const Sidebar = ({ collapsed, groups, daily, dailyLeft, onSearch }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { user } = useSelector((state) => state.auth);
  const [menuOpen, setMenuOpen] = useState(false);
  const [tip, setTip] = useState(null);

  const logout = async () => {
    await dispatch(logoutUser());
    navigate('/');
  };

  return (
    <aside
      className="sticky top-0 z-20 hidden h-screen flex-none flex-col gap-5 px-2.5 py-4 lg:flex"
      style={{ width: collapsed ? 60 : 236, background: 'var(--color-chrome)', boxShadow: 'inset -1px 0 0 var(--color-neutral-900)', transition: 'width 160ms ease' }}
    >
      <Link to="/practice" className="flex items-center gap-2.5 px-2 py-1 text-[16px] font-medium text-text">
        <BrandMark size={26} />
        {!collapsed && <span>Algorise</span>}
      </Link>

      {!collapsed && (
        <button
          type="button"
          onClick={onSearch}
          className="mx-0.5 flex items-center gap-2 rounded-md border border-neutral-800 px-2.5 py-1.75 text-[13px] text-neutral-500 hover:border-neutral-700"
        >
          <Search size={14} />
          <span className="flex-1 text-left">Search</span>
          <span className="rounded border border-neutral-800 px-1.25 text-[11px]">⌘K</span>
        </button>
      )}

      <nav className="flex flex-col gap-4.5">
        {groups.map((g) => (
          <div key={g.label} className="flex flex-col gap-px">
            {!collapsed && <div className="px-2.5 pb-1.5 text-[11px] uppercase tracking-[0.06em] text-neutral-600">{g.label}</div>}
            {g.items.map((it) => {
              const on = isActive(it, pathname);
              const Icon = it.icon;
              return (
                <div key={it.to} className="relative" onMouseEnter={() => collapsed && setTip(it.to)} onMouseLeave={() => setTip(null)}>
                  <Link
                    to={it.to}
                    className="flex items-center gap-2.5 rounded-[7px] px-2.5 py-1.75 text-[14px] transition-colors hover:text-text"
                    style={{ background: on ? 'color-mix(in srgb, var(--color-text) 8%, transparent)' : 'transparent', color: on ? 'var(--color-text)' : 'var(--color-neutral-400)' }}
                    aria-label={it.label}
                  >
                    <Icon size={17} className="flex-none" />
                    {!collapsed && (
                      <>
                        <span className="flex-1 whitespace-nowrap">{it.label}</span>
                        {it.badge && <span className="tnum text-xs text-neutral-500">{it.badge}</span>}
                      </>
                    )}
                  </Link>
                  {collapsed && tip === it.to && (
                    <div
                      className="pointer-events-none absolute left-[calc(100%+10px)] top-1/2 z-30 -translate-y-1/2 whitespace-nowrap rounded-md bg-neutral-800 px-2.25 py-1 text-xs elev-md"
                      style={{ animation: 'al-fade 120ms ease-out' }}
                    >
                      {it.label}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="flex-1" />

      {!collapsed && daily && (
        <Link to={`/problem/${daily._id}`} className="mx-0.5 rounded-[10px] border border-neutral-800 p-3 text-text hover:border-accent-700">
          <div className="flex items-center gap-1.5 text-xs text-neutral-400">
            <Flame size={13} className="text-accent" />
            {user?.streak || 0}-day streak
          </div>
          <div className="mt-1 truncate text-[13px]">Today: {daily.title}</div>
          <div className="mt-0.5 text-xs" style={{ color: daily.isSolved ? 'var(--color-ok)' : 'var(--color-neutral-500)' }}>
            {daily.isSolved ? '✓ Solved today' : `Resets in ${dailyLeft}`}
          </div>
        </Link>
      )}

      <div className="relative">
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          className="flex w-full items-center gap-2.5 rounded-lg p-1.5 text-left text-text hover:bg-white/5"
          aria-label="Account menu"
        >
          <Avatar user={user} size={30} />
          {!collapsed && (
            <>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13px]">
                  {user?.firstName} {user?.lastName}
                </span>
                <span className="block text-xs text-neutral-500">{user?.role === 'admin' ? 'Admin' : 'Member'}</span>
              </span>
              <ChevronsUpDown size={14} className="text-neutral-500" />
            </>
          )}
        </button>
        {menuOpen && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => setMenuOpen(false)} />
            <div className="menu bottom-[calc(100%+6px)] left-0 w-56" onClick={() => setMenuOpen(false)}>
              <div className="px-2.5 py-1.5 text-xs text-neutral-500">{user?.emailId}</div>
              <Link to="/profile" className="menu-item"><User size={15} /> Profile</Link>
              <Link to="/my-problems" className="menu-item"><FileStack size={15} /> My problems</Link>
              <button type="button" className="menu-item" onClick={logout} style={{ color: 'var(--color-err)' }}>
                <LogOut size={15} /> Log out
              </button>
            </div>
          </>
        )}
      </div>
    </aside>
  );
};

/* ================= SHELL ================= */

const AppShell = ({ children }) => {
  const { pathname } = useLocation();
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.role === 'admin';
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [now, setNow] = useState(Date.now());
  const { problems, contests, pendingCount } = useShellData(isAdmin, user?._id);

  const onProblem = pathname.startsWith('/problem/');

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(t);
  }, []);

  // ⌘K / Ctrl+K anywhere, "/" when not typing
  useEffect(() => {
    const onKey = (e) => {
      const typing = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName) || document.activeElement?.isContentEditable;
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      } else if (e.key === '/' && !typing && !onProblem) {
        e.preventDefault();
        setPaletteOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onProblem]);

  const daily = useMemo(() => getDailyChallenge(problems), [problems]);
  const dailyLeft = useMemo(() => {
    const d = new Date(now);
    const ms = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + 1) - now;
    const mins = Math.max(0, Math.floor(ms / 60000));
    return `${Math.floor(mins / 60)}h ${pad2(mins % 60)}m`;
  }, [now]);

  const contestBadge = useMemo(() => {
    const live = contests.some((c) => new Date(c.startTime) <= now && new Date(c.endTime) > now);
    if (live) return 'Live';
    const next = contests.filter((c) => new Date(c.startTime) > now).sort((a, b) => new Date(a.startTime) - new Date(b.startTime))[0];
    return next ? WEEKDAY.format(new Date(next.startTime)) : '';
  }, [contests, now]);

  const groups = navGroupsFor({ isAdmin, contestBadge, pendingCount });
  const title = TITLES.find(([test]) => test(pathname))?.[1] || 'Algorise';

  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar collapsed={onProblem} groups={groups} daily={daily} dailyLeft={dailyLeft} onSearch={() => setPaletteOpen(true)} />

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile top bar (the problem page brings its own) */}
        {!onProblem && (
          <header className="sticky top-0 z-30 flex items-center gap-3 px-4 py-3 lg:hidden" style={{ background: 'var(--color-chrome)', boxShadow: 'inset 0 -1px 0 var(--color-neutral-900)' }}>
            <Link to="/practice" aria-label="Home">
              <BrandMark size={26} />
            </Link>
            <span className="flex-1 text-[16px] font-medium">{title}</span>
            <button type="button" className="btn btn-icon text-neutral-300" onClick={() => setPaletteOpen(true)} aria-label="Search">
              <Search size={18} />
            </button>
            <Link to="/profile" aria-label="Your profile">
              <Avatar user={user} size={32} />
            </Link>
          </header>
        )}

        <main className="min-w-0 flex-1">{children}</main>

        {/* Mobile tab bar */}
        {!onProblem && (
          <nav
            className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 lg:hidden"
            style={{ background: 'var(--color-chrome)', boxShadow: 'inset 0 1px 0 var(--color-neutral-900)', paddingBottom: 'env(safe-area-inset-bottom)' }}
          >
            {TAB_BAR.map((t) => {
              const on = isActive(t, pathname);
              const Icon = t.icon;
              return (
                <Link key={t.to} to={t.to} className="flex flex-col items-center gap-1 py-2.5 text-[11px]" style={{ color: on ? 'var(--color-accent)' : 'var(--color-neutral-500)' }}>
                  <Icon size={20} />
                  {t.label}
                </Link>
              );
            })}
          </nav>
        )}
      </div>

      {paletteOpen && <CommandPalette onClose={() => setPaletteOpen(false)} problems={problems} isAdmin={isAdmin} />}
    </div>
  );
};

export default AppShell;
