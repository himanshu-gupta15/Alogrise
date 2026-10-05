import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Flame, LogOut, Menu, Search, Undo2, User, FilePlus2, FileStack, X } from 'lucide-react';
import { logoutUser } from '../authSlice';
import axiosClient from '../utils/axiosClient';
import { Avatar, BrandMark } from './ui';
import { capitalize, difficultyColor } from '../utils/format';

const USER_LINKS = [
  { label: 'Problems', to: '/', match: ['/', '/practice'] },
  { label: 'Contests', to: '/contest' },
  { label: 'Interview', to: '/interview' },
  { label: 'Leaderboard', to: '/leaderboard' },
];

const GUEST_LINKS = [
  { label: 'Problems', to: '/signin' },
  { label: 'Contests', to: '/signin' },
  { label: 'Interview prep', to: '/signin' },
];

const ADMIN_LINKS = [
  { label: 'Overview', to: '/admin', end: true },
  { label: 'Create problem', to: '/admin/create' },
  { label: 'Contests', to: '/admin/contest' },
  { label: 'Interview packs', to: '/admin/interview' },
];

/* Global search: problems and people, loaded lazily on first focus */
const NavSearch = ({ onNavigate }) => {
  const navigate = useNavigate();
  const [term, setTerm] = useState('');
  const [open, setOpen] = useState(false);
  const [data, setData] = useState(null);
  const inputRef = useRef(null);
  const { user } = useSelector((state) => state.auth);

  const load = async () => {
    if (data) return;
    try {
      const [problems, people] = await Promise.all([
        axiosClient.get('/problem/getAllProblem').catch(() => ({ data: [] })),
        axiosClient.get('/user/getleaderboard').catch(() => ({ data: [] })),
      ]);
      setData({
        problems: Array.isArray(problems.data) ? problems.data : [],
        people: Array.isArray(people.data) ? people.data : [],
      });
    } catch {
      setData({ problems: [], people: [] });
    }
  };

  // "/" focuses search, like the design's keyboard hint
  useEffect(() => {
    const onKey = (e) => {
      const tag = document.activeElement?.tagName;
      if (e.key === '/' && tag !== 'INPUT' && tag !== 'TEXTAREA' && !document.activeElement?.isContentEditable) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const results = useMemo(() => {
    const q = term.trim().toLowerCase();
    if (!q || !data) return { problems: [], people: [] };
    return {
      problems: data.problems.filter((p) => p.title?.toLowerCase().includes(q)).slice(0, 5),
      people: data.people
        .filter((p) => p._id !== user?._id)
        .filter((p) => `${p.firstName || ''} ${p.lastName || ''}`.toLowerCase().includes(q))
        .slice(0, 5),
    };
  }, [term, data, user?._id]);

  const go = (path) => {
    setTerm('');
    setOpen(false);
    inputRef.current?.blur();
    onNavigate?.();
    navigate(path);
  };

  const hasResults = results.problems.length + results.people.length > 0;

  return (
    <div className="relative w-full lg:w-60">
      <div className="flex items-center gap-2 rounded-md border border-divider px-2.5 py-[7px] text-[13px] text-neutral-500 focus-within:border-accent">
        <Search size={14} />
        <input
          ref={inputRef}
          value={term}
          onFocus={() => {
            load();
            setOpen(true);
          }}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          onChange={(e) => {
            setTerm(e.target.value);
            setOpen(true);
          }}
          placeholder="Search problems, people"
          className="min-w-0 flex-1 bg-transparent text-text outline-none placeholder:text-neutral-500"
          style={{ outline: 'none' }}
        />
        <span className="rounded border border-divider px-[5px] text-[11px]">/</span>
      </div>

      {open && term.trim() && (
        <div className="absolute left-0 right-0 z-50 mt-2 max-h-80 overflow-y-auto rounded-lg bg-surface p-1.5 elev-lg">
          {!data ? (
            <p className="px-3 py-2 text-sm text-neutral-400">Searching…</p>
          ) : !hasResults ? (
            <p className="px-3 py-2 text-sm text-neutral-400">No matches</p>
          ) : (
            <>
              {results.problems.length > 0 && <div className="eyebrow px-3 pb-1 pt-2 text-[11px]">Problems</div>}
              {results.problems.map((p) => (
                <button
                  key={p._id}
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => go(`/problem/${p._id}`)}
                  className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm hover:bg-white/5"
                >
                  <span className="flex-1 truncate">{p.title}</span>
                  <span className="text-xs" style={{ color: difficultyColor(p.difficulty) }}>
                    {capitalize(p.difficulty)}
                  </span>
                </button>
              ))}
              {results.people.length > 0 && <div className="eyebrow px-3 pb-1 pt-2 text-[11px]">People</div>}
              {results.people.map((p) => (
                <button
                  key={p._id}
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => go(`/profile/${p._id}`)}
                  className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm hover:bg-white/5"
                >
                  <Avatar user={p} size={22} />
                  <span className="flex-1 truncate">
                    {p.firstName} {p.lastName}
                  </span>
                  <span className="tnum text-xs text-neutral-400">{(p.xp || 0).toLocaleString()} XP</span>
                </button>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
};

const Navbar = ({ admin = false }) => {
  // Menus remember the page they were opened on, so navigating closes them
  const [mobileOpenOn, setMobileOpenOn] = useState(null);
  const [menuOpenOn, setMenuOpenOn] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const mobileOpen = mobileOpenOn === location.pathname;
  const menuOpen = menuOpenOn === location.pathname;
  const setMobileOpen = (next) => setMobileOpenOn((prev) => ((typeof next === 'function' ? next(prev === location.pathname) : next) ? location.pathname : null));
  const setMenuOpen = (next) => setMenuOpenOn((prev) => ((typeof next === 'function' ? next(prev === location.pathname) : next) ? location.pathname : null));

  const links = admin ? ADMIN_LINKS : isAuthenticated ? USER_LINKS : GUEST_LINKS;

  const isActive = (link) =>
    !isAuthenticated && !admin
      ? false
      : link.match ? link.match.includes(location.pathname) : link.end ? location.pathname === link.to : location.pathname.startsWith(link.to);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/signin');
  };

  const linkClass = (link) => `text-sm transition-colors hover:text-accent ${isActive(link) ? 'text-accent' : 'text-neutral-300'}`;

  const menuItems = admin
    ? [{ label: 'Back to app', icon: Undo2, to: '/practice' }]
    : [
        { label: 'Profile', icon: User, to: '/profile' },
        { label: 'Contribute a problem', icon: FilePlus2, to: '/create-problem' },
        { label: 'My problems', icon: FileStack, to: '/my-problems' },
      ];

  return (
    <nav className="sticky top-0 z-50 bg-bg/85 backdrop-blur-md">
      <div className="relative flex items-center gap-7 px-4 py-3.5 sm:px-8">
        <Link to={admin ? '/admin' : '/'} className="mr-3 flex items-center gap-2.5 text-[17px] font-medium text-text">
          <BrandMark />
          <span>Algorise</span>
          {admin && <span className="tag tag-accent ml-1">Admin</span>}
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          {links.map((link) =>
            link.match ? (
              <Link key={link.label} to={link.to} className={linkClass(link)}>
                {link.label}
              </Link>
            ) : (
              <NavLink key={link.label} to={link.to} end={link.end} className={() => linkClass(link)}>
                {link.label}
              </NavLink>
            )
          )}
        </div>

        <div className="flex-1" />

        {isAuthenticated ? (
          <>
            {!admin && (
              <div className="hidden items-center gap-7 lg:flex">
                <NavSearch />
                <span className="flex items-center gap-1.5 text-[13px] text-neutral-300" title="Current streak">
                  <Flame size={15} className="text-accent" />
                  <span className="tnum">{user?.streak || 0}</span>
                </span>
              </div>
            )}
            {admin && (
              <Link to="/practice" className="hidden items-center gap-1.5 text-[13px] text-neutral-300 hover:text-accent md:flex">
                <Undo2 size={15} /> Back to app
              </Link>
            )}

            <div className="relative hidden md:block">
              <button type="button" onClick={() => setMenuOpen((v) => !v)} className="block rounded-full" aria-label="Account menu">
                <Avatar user={user} size={32} />
              </button>
              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                  <div className="absolute right-0 z-20 mt-2 w-60 rounded-lg bg-surface p-1.5 elev-lg">
                    <div className="px-3 py-2">
                      <div className="truncate text-sm">
                        {user?.firstName} {user?.lastName}
                      </div>
                      <div className="truncate text-xs text-neutral-400">{user?.emailId}</div>
                    </div>
                    <div className="rule my-1" />
                    {menuItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.label}
                          type="button"
                          onClick={() => navigate(item.to)}
                          className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm text-neutral-200 hover:bg-white/5"
                        >
                          <Icon size={15} className="text-neutral-400" /> {item.label}
                        </button>
                      );
                    })}
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm hover:bg-white/5"
                      style={{ color: 'var(--color-hard)' }}
                    >
                      <LogOut size={15} /> Log out
                    </button>
                  </div>
                </>
              )}
            </div>
          </>
        ) : (
          <div className="hidden items-center gap-7 md:flex">
            <Link to="/signin" className="text-sm text-neutral-300 hover:text-accent">
              Sign in
            </Link>
            <Link to="/signup" className="btn btn-primary">
              Get started
            </Link>
          </div>
        )}

        <button
          type="button"
          className="btn btn-icon btn-secondary md:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>

        <div className="rule absolute bottom-0 left-0 right-0" />
      </div>

      {mobileOpen && (
        <div className="flex flex-col gap-1 bg-bg px-4 pb-5 pt-3 md:hidden">
          {isAuthenticated && !admin && (
            <div className="mb-3">
              <NavSearch onNavigate={() => setMobileOpen(false)} />
            </div>
          )}
          {links.map((link) => (
            <Link key={link.label} to={link.to} className={`py-2 ${linkClass(link)}`}>
              {link.label}
            </Link>
          ))}
          {isAuthenticated ? (
            <>
              <div className="rule my-2" />
              {menuItems.map(({ label, to }) => (
                <Link key={label} to={to} className="py-2 text-sm text-neutral-300">
                  {label}
                </Link>
              ))}
              <button type="button" onClick={handleLogout} className="py-2 text-left text-sm" style={{ color: 'var(--color-hard)' }}>
                Log out
              </button>
            </>
          ) : (
            <div className="mt-3 flex gap-3">
              <Link to="/signin" className="btn btn-secondary">
                Sign in
              </Link>
              <Link to="/signup" className="btn btn-primary">
                Create account
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
