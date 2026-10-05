import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Check, Laptop, Lock, Phone, Play, Search, X } from 'lucide-react';
import axiosClient from '../utils/axiosClient';
import { Notice, PageLoader } from '../component/ui';
import { formatNumber } from '../utils/format';

const TRACKS = [
  { type: 'online', title: 'Online assessment', desc: 'Random sets drawn from real company OA patterns.', icon: Laptop },
  { type: 'phone', title: 'Phone screen', desc: 'Timed medium-to-hard rounds on a live clock.', icon: Phone },
  { type: 'onsite', title: 'Onsite loop', desc: 'Full loops with harder DSA and follow-ups.', icon: Building2 },
];

const compact = (n) => new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 2 }).format(n || 0);

const formatPrice = (cents, currency = 'usd') => {
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency.toUpperCase() }).format((cents || 0) / 100);
  } catch {
    return `$${((cents || 0) / 100).toFixed(2)}`;
  }
};

/* Confirmation before sending the user to Stripe */
const UnlockDialog = ({ pack, busy, onConfirm, onClose }) => (
  <div className="dialog-backdrop" onClick={onClose}>
    <div className="dialog w-[min(440px,100%)]" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 flex-none place-items-center rounded-[10px] bg-neutral-800 text-[15px] font-medium">{pack.company?.[0]}</span>
        <div className="flex-1">
          <div className="text-[18px] font-medium">Unlock {pack.company}</div>
          <div className="text-[13px] text-neutral-400">{pack.role}</div>
        </div>
        <button type="button" className="btn btn-icon" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>
      </div>
      <ul className="m-0 flex list-none flex-col gap-2 p-0 text-sm text-neutral-200">
        {[`${pack.problems?.length || pack.sets || 0} problems from ${pack.company} patterns`, 'Editorials and video solutions where available', 'Yours to keep — practice it any time'].map((line) => (
          <li key={line} className="flex items-start gap-2">
            <Check size={15} className="mt-0.5 flex-none" style={{ color: 'var(--color-ok)' }} /> {line}
          </li>
        ))}
      </ul>
      <div className="mt-2 flex items-center gap-2">
        <span className="tnum text-[20px] font-medium">{formatPrice(pack.priceInCents, pack.currency)}</span>
        <span className="text-xs text-neutral-500">one-time</span>
        <span className="flex-1" />
        <button type="button" className="btn btn-secondary" onClick={onClose} disabled={busy}>
          Cancel
        </button>
        <button type="button" className="btn btn-primary" onClick={onConfirm} disabled={busy}>
          {busy ? 'Opening checkout…' : 'Continue to payment'}
        </button>
      </div>
    </div>
  </div>
);

function Interview() {
  const navigate = useNavigate();
  const [packs, setPacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [track, setTrack] = useState('online');
  const [query, setQuery] = useState('');
  const [unlocking, setUnlocking] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    axiosClient
      .get('/interview/packs')
      .then(({ data }) => setPacks(Array.isArray(data) ? data : []))
      .catch(() => setError('Could not load interview packs.'))
      .finally(() => setLoading(false));
  }, []);

  // Track summaries come from the real packs
  const tracks = useMemo(
    () =>
      TRACKS.map((t) => {
        const ofType = packs.filter((p) => p.type === t.type);
        const attempts = ofType.reduce((sum, p) => sum + Number(p.attempted || 0), 0);
        const rate = ofType.length ? ofType.reduce((sum, p) => sum + Number(p.successRate || 0), 0) / ofType.length : 0;
        return { ...t, count: ofType.length, attempts, rate };
      }),
    [packs]
  );

  const current = tracks.find((t) => t.type === track) || tracks[0];

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return packs.filter((p) => p.type === track && (!q || `${p.company} ${p.role}`.toLowerCase().includes(q)));
  }, [packs, track, query]);

  const startPack = (pack) => {
    localStorage.setItem('activePack', JSON.stringify({ id: pack.packId, company: pack.company, role: pack.role, problems: pack.problems || [] }));
    navigate('/practice');
  };

  const checkout = async () => {
    try {
      setBusy(true);
      const { data } = await axiosClient.post('/payment/create-checkout', { packId: unlocking.packId });
      if (data?.url) window.location.href = data.url;
    } catch (err) {
      setError(err?.response?.data?.error || 'Unable to start checkout.');
      setUnlocking(null);
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <PageLoader label="Loading interview packs…" />;

  return (
    <div className="page fade-in">
      <h1 className="page-title">Interview prep</h1>
      <p className="page-sub max-w-[60ch]">Timed mock assessments built from real company patterns. Pick a round type, then a company pack.</p>

      {error && (
        <div className="mt-6">
          <Notice type="error" onClose={() => setError('')}>
            {error}
          </Notice>
        </div>
      )}

      <div className="mt-6 grid gap-3 md:grid-cols-3">
        {tracks.map((t) => {
          const on = t.type === track;
          const Icon = t.icon;
          return (
            <button
              key={t.type}
              type="button"
              onClick={() => setTrack(t.type)}
              aria-pressed={on}
              className="panel flex flex-col gap-2 p-4 text-left"
              style={on ? { boxShadow: 'inset 0 0 0 1px var(--color-accent-600)', background: 'color-mix(in srgb, var(--color-accent-900) 45%, transparent)' } : undefined}
            >
              <span className="flex items-center gap-2">
                <Icon size={16} className="text-accent" />
                <span className="flex-1 text-[15px] font-medium">{t.title}</span>
                <span className="text-xs text-neutral-500">
                  {t.count} {t.count === 1 ? 'pack' : 'packs'}
                </span>
              </span>
              <span className="text-[13px] text-neutral-300">{t.desc}</span>
              <span className="tnum flex gap-3 text-xs text-neutral-500">
                <span>{compact(t.attempts)} attempts</span>
                <span>{t.rate.toFixed(1)}% pass rate</span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <div className="text-[15px] font-medium">
          {current.title} packs <span className="font-normal text-neutral-500">{visible.length}</span>
        </div>
        <span className="flex-1" />
        <div className="relative w-full sm:w-70">
          <Search size={15} className="absolute left-2.5 top-2.75 text-neutral-500" />
          <input className="input pl-8" placeholder="Search company or role" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="panel-quiet mt-4 flex flex-col items-center px-5 py-12 text-center">
          <Search size={26} className="text-neutral-600" />
          <div className="mt-3 text-[15px] font-medium">{query ? `No packs match “${query}”` : `No ${current.title.toLowerCase()} packs yet`}</div>
          <div className="mt-1 text-[13px] text-neutral-400">{query ? 'Try a different company or role.' : 'Try another round type.'}</div>
          {query && (
            <button type="button" className="btn btn-secondary mt-4" onClick={() => setQuery('')}>
              Clear search
            </button>
          )}
        </div>
      ) : (
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((p) => {
            const locked = p.isPremium && !p.isPurchased;
            return (
              <div key={p._id || p.packId} className="panel flex flex-col gap-3 p-4">
                <div className="flex items-start gap-3">
                  <span className="grid h-9 w-9 flex-none place-items-center rounded-lg bg-neutral-800 text-[14px] font-medium">{p.company?.[0]}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[15px] font-medium">{p.company}</span>
                    <span className="block text-[13px] text-neutral-400">{p.role}</span>
                  </span>
                  {p.isPremium ? (
                    <span className={`tag ${p.isPurchased ? 'tag-accent' : 'tag-outline'}`}>{p.isPurchased ? 'Unlocked' : formatPrice(p.priceInCents, p.currency)}</span>
                  ) : (
                    <span className="tag tag-neutral">Free</span>
                  )}
                </div>
                {p.description && <p className="m-0 text-[13px] text-neutral-400">{p.description}</p>}
                <div className="tnum flex gap-3 text-xs text-neutral-500">
                  <span>{p.problems?.length || p.sets || 0} problems</span>
                  <span>{formatNumber(p.attempted)} attempts</span>
                  <span>{Number(p.successRate || 0).toFixed(0)}% pass</span>
                </div>
                {locked ? (
                  <button type="button" className="btn btn-secondary btn-block" onClick={() => setUnlocking(p)}>
                    <Lock size={14} /> Unlock
                  </button>
                ) : (
                  <button type="button" className="btn btn-primary btn-block" onClick={() => startPack(p)}>
                    <Play size={14} /> Start assessment
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {unlocking && <UnlockDialog pack={unlocking} busy={busy} onConfirm={checkout} onClose={() => !busy && setUnlocking(null)} />}
    </div>
  );
}

export default Interview;
