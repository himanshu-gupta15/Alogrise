import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Clock, Puzzle, Users, X } from 'lucide-react';
import axiosClient from '../utils/axiosClient';
import { Notice, PageLoader, Spinner } from './ui';
import { capitalize, difficultyColor, formatNumber, pad2 } from '../utils/format';

const TABS = ['Upcoming', 'Live', 'Past'];

const formatWhen = (value) =>
  new Intl.DateTimeFormat('en-IN', { weekday: 'short', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' }).format(new Date(value));

const durationMinutes = (c) => Math.max(0, Math.round((new Date(c.endTime) - new Date(c.startTime)) / 60000));

const formatDuration = (minutes) => (minutes >= 120 && minutes % 60 === 0 ? `${minutes / 60} hours` : `${minutes} minutes`);

const splitCountdown = (ms) => {
  const s = Math.max(0, Math.floor(ms / 1000));
  return [
    { v: pad2(Math.floor(s / 86400)), l: 'Days' },
    { v: pad2(Math.floor(s / 3600) % 24), l: 'Hours' },
    { v: pad2(Math.floor(s / 60) % 60), l: 'Minutes' },
    { v: pad2(s % 60), l: 'Seconds' },
  ];
};

const shortCountdown = (ms) => {
  const s = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(s / 3600);
  const m = Math.floor(s / 60) % 60;
  return h > 0 ? `${h}h ${pad2(m)}m` : `${m}m ${pad2(s % 60)}s`;
};

const statusAt = (c, now) => {
  const start = new Date(c.startTime).getTime();
  const end = new Date(c.endTime).getTime();
  return now < start ? 'upcoming' : now > end ? 'ended' : 'live';
};

const VIRTUAL_KEY = (id) => `virtualContest:${id}`;

// A started virtual run is kept in the browser until its clock runs out
const readVirtual = (id) => {
  try {
    const saved = JSON.parse(localStorage.getItem(VIRTUAL_KEY(id)) || 'null');
    return saved && new Date(saved.virtualEndTime).getTime() > Date.now() ? saved : null;
  } catch {
    return null;
  }
};

/* Contest room: the contest's problems with its clock (live or virtual) */
const ContestRoom = ({ room, now, onClose }) => {
  const remaining = new Date(room.endsAt).getTime() - now;
  return (
    <div className="dialog-backdrop" onClick={onClose}>
      <div className="dialog w-[min(640px,100%)]" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <div className="eyebrow eyebrow-accent text-xs">{room.virtual ? 'Virtual contest' : 'Live contest'}</div>
            <div className="mt-1 text-[22px]">{room.title}</div>
          </div>
          <button type="button" className="btn btn-icon" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <div className="tnum text-sm text-neutral-300">
          {remaining > 0 ? (
            <>
              Ends in <span className="text-accent">{shortCountdown(remaining)}</span>
            </>
          ) : (
            'Time is up — you can still practice these problems.'
          )}
        </div>
        {room.loading ? (
          <div className="flex items-center gap-2 py-4 text-sm text-neutral-400">
            <Spinner size={16} /> Loading problems…
          </div>
        ) : (
          <div>
            {(room.problems || []).map((p, i) => (
              <Link key={p._id} to={`/problem/${p._id}`} className="row-rule flex items-center gap-4 py-3.5 text-text hover:text-accent">
                <span className="tnum w-6 text-accent">{String.fromCharCode(65 + i)}</span>
                <span className="flex-1">{p.title}</span>
                <span className="text-sm" style={{ color: difficultyColor(p.difficulty) }}>
                  {capitalize(p.difficulty)}
                </span>
                <ArrowRight size={15} className="text-neutral-500" />
              </Link>
            ))}
            {!room.problems?.length && <p className="py-4 text-sm text-neutral-400">This contest has no problems.</p>}
          </div>
        )}
      </div>
    </div>
  );
};

const Contest = () => {
  const [contestData, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('Upcoming');
  const [busyId, setBusyId] = useState('');
  const [notice, setNotice] = useState(null);
  const [room, setRoom] = useState(null);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const { data } = await axiosClient.get('/contest/all');
        setContests(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to fetch contests', error);
        setNotice({ type: 'error', message: 'Could not load contests. Please refresh.' });
      } finally {
        setLoading(false);
      }
    };
    fetchContests();
  }, []);

  // Tick every second so countdowns and statuses update without a refresh
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const contests = useMemo(
    () =>
      contestData.map((c) => {
        const status = statusAt(c, now);
        return { ...c, status, canStartVirtual: status === 'ended' && !c.joined };
      }),
    [contestData, now]
  );

  // Featured: the live contest if there is one, else the next upcoming one
  const featured = useMemo(() => {
    const live = contests.filter((c) => c.status === 'live').sort((a, b) => new Date(a.endTime) - new Date(b.endTime))[0];
    if (live) return live;
    return contests.filter((c) => c.status === 'upcoming').sort((a, b) => new Date(a.startTime) - new Date(b.startTime))[0] || null;
  }, [contests]);

  const rows = useMemo(() => {
    const key = { Upcoming: 'upcoming', Live: 'live', Past: 'ended' }[tab];
    const list = contests.filter((c) => c.status === key);
    return key === 'ended'
      ? list.sort((a, b) => new Date(b.startTime) - new Date(a.startTime))
      : list.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
  }, [contests, tab]);

  const record = useMemo(
    () => ({
      joined: contests.filter((c) => c.joined).length,
      virtual: contests.filter((c) => c.canStartVirtual).length,
      upcoming: contests.filter((c) => c.status === 'upcoming').length,
    }),
    [contests]
  );

  const openRoom = async (contest, { virtual = false, endsAt }) => {
    setRoom({ id: contest._id, title: contest.title, virtual, endsAt, loading: true, problems: [] });
    try {
      const { data } = await axiosClient.get(`/contest/${contest._id}`);
      setRoom((prev) => (prev?.id === contest._id ? { ...prev, loading: false, problems: data?.problems || [] } : prev));
    } catch {
      setRoom((prev) => (prev?.id === contest._id ? { ...prev, loading: false } : prev));
      setNotice({ type: 'error', message: 'Could not load the contest problems.' });
    }
  };

  const errorText = (error, fallback) => (typeof error?.response?.data === 'string' ? error.response.data : fallback);

  const handleJoin = async (contest) => {
    try {
      setBusyId(contest._id);
      await axiosClient.post(`/contest/join/${contest._id}`);
      setContests((prev) =>
        prev.map((c) => (c._id === contest._id ? { ...c, joined: true, participantCount: (c.participantCount || 0) + (c.joined ? 0 : 1) } : c))
      );
      openRoom(contest, { endsAt: contest.endTime });
    } catch (error) {
      setNotice({ type: 'error', message: errorText(error, 'Unable to join this contest right now.') });
    } finally {
      setBusyId('');
    }
  };

  const handleVirtual = async (contest) => {
    const saved = readVirtual(contest._id);
    if (saved) {
      openRoom(contest, { virtual: true, endsAt: saved.virtualEndTime });
      return;
    }
    try {
      setBusyId(contest._id);
      const { data } = await axiosClient.post(`/contest/virtual/${contest._id}`);
      if (data?.virtualContest) {
        localStorage.setItem(VIRTUAL_KEY(contest._id), JSON.stringify(data.virtualContest));
        openRoom(contest, { virtual: true, endsAt: data.virtualContest.virtualEndTime });
      }
    } catch (error) {
      setNotice({ type: 'error', message: errorText(error, 'Unable to start a virtual contest right now.') });
    } finally {
      setBusyId('');
    }
  };

  const actionFor = (c) => {
    const busy = busyId === c._id;
    if (c.status === 'live') {
      return c.joined
        ? { label: 'Enter', cls: 'btn-primary', onClick: () => openRoom(c, { endsAt: c.endTime }) }
        : { label: busy ? 'Joining…' : 'Join', cls: 'btn-primary', onClick: () => handleJoin(c), disabled: busy };
    }
    if (c.status === 'upcoming') return { label: 'Opens at start', cls: 'btn-secondary', disabled: true };
    if (c.canStartVirtual) {
      const resumable = !!readVirtual(c._id);
      return { label: busy ? 'Starting…' : resumable ? 'Resume virtual' : 'Virtual run', cls: 'btn-secondary', onClick: () => handleVirtual(c), disabled: busy };
    }
    return { label: 'View problems', cls: 'btn-secondary', onClick: () => openRoom(c, { endsAt: c.endTime }) };
  };

  if (loading) return <PageLoader label="Loading contests…" />;

  const featuredTarget = featured ? new Date(featured.status === 'live' ? featured.endTime : featured.startTime).getTime() : 0;
  const featuredAction = featured ? actionFor(featured) : null;
  const liveCount = contests.filter((c) => c.status === 'live').length;
  const countdownLabels = ['Days', 'Hrs', 'Min', 'Sec'];

  return (
    <div className="page fade-in">
      <h1 className="page-title">Contests</h1>
      <p className="page-sub">Timed rounds with a shared clock. Missed one? Run it virtually any time after it ends.</p>

      {notice && (
        <div className="mt-6">
          <Notice type={notice.type} onClose={() => setNotice(null)}>
            {notice.message}
          </Notice>
        </div>
      )}

      {featured ? (
        <section
          className="panel mt-6 grid items-center gap-6 p-6 lg:grid-cols-[minmax(0,1fr)_auto_auto]"
          style={{ background: 'radial-gradient(600px 220px at 85% 0%, color-mix(in srgb, var(--color-accent-900) 70%, transparent), transparent 70%), color-mix(in srgb, var(--color-surface) 70%, transparent)' }}
        >
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-[12.5px] text-neutral-400">
              <span className="tag tag-accent">{featured.status === 'live' ? 'Live now' : 'Next contest'}</span>
              <span className="flex items-center gap-1.5"><Calendar size={13} />{formatWhen(featured.startTime)}</span>
            </div>
            <div className="mt-2.5 truncate text-[24px] font-medium tracking-[-0.01em]">{featured.title}</div>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-neutral-300">
              <span className="flex items-center gap-1.5"><Clock size={14} />{formatDuration(durationMinutes(featured))}</span>
              <span className="flex items-center gap-1.5"><Puzzle size={14} />{featured.problemCount || 0} problems</span>
              <span className="flex items-center gap-1.5"><Users size={14} />{formatNumber(featured.participantCount)} joined</span>
            </div>
          </div>
          <div className="tnum flex gap-5" aria-label={featured.status === 'live' ? 'Time left' : 'Starts in'}>
            {splitCountdown(featuredTarget - now).map((c, i) => (
              <div key={c.l} className="text-center">
                <div className="text-[30px] font-medium leading-none">{c.v}</div>
                <div className="mt-1.5 text-[10.5px] uppercase tracking-[0.08em] text-neutral-500">{countdownLabels[i]}</div>
              </div>
            ))}
          </div>
          <button type="button" className={`btn ${featuredAction.cls} btn-lg`} onClick={featuredAction.onClick} disabled={featuredAction.disabled}>
            {featuredAction.label}
          </button>
        </section>
      ) : (
        <div className="panel-quiet mt-6 px-6 py-10 text-center">
          <div className="text-[15px] font-medium">No contest scheduled yet</div>
          <div className="mt-1 text-[13px] text-neutral-400">Past contests are still open for virtual runs below.</div>
        </div>
      )}

      <section className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_260px]">
        <div className="min-w-0">
          <div className="flex gap-5" role="tablist" style={{ boxShadow: 'inset 0 -1px 0 var(--color-neutral-900)' }}>
            {TABS.map((t) => (
              <button key={t} type="button" role="tab" aria-selected={tab === t} className="tab flex items-center gap-1.5" onClick={() => setTab(t)}>
                {t}
                {t === 'Live' && liveCount > 0 && <span className="h-1.5 w-1.5 rounded-full" style={{ background: 'var(--color-err)' }} />}
              </button>
            ))}
          </div>
          {rows.map((c) => {
            const action = actionFor(c);
            return (
              <div key={c._id} className="row-rule grid items-center gap-3 py-4 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:gap-5">
                <div className="min-w-0">
                  <div className="truncate text-[15px] font-medium">{c.title}</div>
                  <div className="mt-0.5 text-[13px] text-neutral-400">
                    {c.problemCount || 0} problems · {durationMinutes(c)} min · {formatNumber(c.participantCount)} joined
                    {c.joined && c.status === 'ended' ? ' · you took part' : ''}
                  </div>
                </div>
                <div className="tnum text-[13px] text-neutral-300">
                  {c.status === 'live' ? `Ends in ${shortCountdown(new Date(c.endTime) - now)}` : formatWhen(c.startTime)}
                </div>
                <button type="button" className={`btn ${action.cls} sm:justify-self-end`} onClick={action.onClick} disabled={action.disabled}>
                  {action.label}
                </button>
              </div>
            );
          })}
          {rows.length === 0 && <p className="py-10 text-sm text-neutral-400">No {tab.toLowerCase()} contests.</p>}
        </div>

        <aside>
          <div className="eyebrow text-xs">Your contests</div>
          <div className="mt-3 flex items-baseline gap-2.5">
            <span className="tnum text-[36px] font-medium leading-none">{record.joined}</span>
            <span className="text-sm text-neutral-400">joined</span>
          </div>
          <div className="mt-5 flex flex-col gap-2.5 text-[13px]">
            <div className="flex">
              <span className="text-neutral-400">Upcoming</span>
              <span className="flex-1" />
              <span className="tnum">{record.upcoming}</span>
            </div>
            <div className="flex">
              <span className="text-neutral-400">Open for a virtual run</span>
              <span className="flex-1" />
              <span className="tnum">{record.virtual}</span>
            </div>
          </div>
        </aside>
      </section>

      {room && <ContestRoom room={room} now={now} onClose={() => setRoom(null)} />}
    </div>
  );
};

export default Contest;
