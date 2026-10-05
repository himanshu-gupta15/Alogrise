import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Search } from 'lucide-react';
import axiosClient from '../utils/axiosClient';
import { Notice, PageLoader } from './ui';
import { capitalize, difficultyColor } from '../utils/format';

const EMPTY = { title: '', description: '', startTime: '', endTime: '', maxParticipants: 500 };

// datetime-local values have no timezone; convert in the browser so the server stores the admin's intended moment
const toIso = (local) => (local ? new Date(local).toISOString() : '');

const durationLabel = (start, end) => {
  if (!start || !end) return '';
  const mins = Math.round((new Date(end) - new Date(start)) / 60000);
  if (mins <= 0) return 'End must be after start';
  return mins >= 60 ? `${Math.floor(mins / 60)}h ${mins % 60 ? `${mins % 60}m` : ''}`.trim() : `${mins} minutes`;
};

const AdminContest = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [notice, setNotice] = useState(null);
  const [created, setCreated] = useState(null);

  useEffect(() => {
    axiosClient
      .get('/problem/getAllProblem')
      .then(({ data }) => setProblems(Array.isArray(data) ? data.filter((p) => p.status === 'approved' || p.status == null) : []))
      .catch(() => setNotice({ type: 'error', message: 'Could not load problems.' }))
      .finally(() => setLoading(false));
  }, []);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return problems;
    return problems.filter((p) => `${p.title} ${p.difficulty} ${(p.tags || []).join(' ')}`.toLowerCase().includes(q));
  }, [problems, query]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const toggle = (id) => setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const duration = durationLabel(form.startTime, form.endTime);
  const invalidTimes = duration === 'End must be after start';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selected.length === 0) {
      setNotice({ type: 'error', message: 'Pick at least one problem for the contest.' });
      return;
    }
    if (invalidTimes) {
      setNotice({ type: 'error', message: 'The contest has to end after it starts.' });
      return;
    }
    try {
      setSaving(true);
      setNotice(null);
      await axiosClient.post('/contest/create', {
        ...form,
        startTime: toIso(form.startTime),
        endTime: toIso(form.endTime),
        maxParticipants: Number(form.maxParticipants) || 500,
        problems: selected,
      });
      setCreated(form.title);
      setForm(EMPTY);
      setSelected([]);
    } catch (error) {
      const msg = error?.response?.data;
      setNotice({ type: 'error', message: typeof msg === 'string' ? msg : 'Could not create the contest.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <PageLoader label="Loading problems…" />;

  return (
    <div className="page fade-in">
      <h1 className="page-title">Contest builder</h1>
      <p className="page-sub">Schedule a timed contest and choose its problems. It appears on Contests right away.</p>

      {created && (
        <div className="mt-6">
          <Notice type="success" onClose={() => setCreated(null)}>
            “{created}” is scheduled. <Link to="/contest">View contests</Link>
          </Notice>
        </div>
      )}
      {notice && (
        <div className="mt-6">
          <Notice type={notice.type} onClose={() => setNotice(null)}>
            {notice.message}
          </Notice>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-10 grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <div className="flex flex-col gap-5">
          <div className="field">
            <label htmlFor="c-title">Title</label>
            <input id="c-title" className="input" required value={form.title} onChange={set('title')} placeholder="Weekly Contest 49" />
          </div>
          <div className="field">
            <label htmlFor="c-desc">Description</label>
            <textarea id="c-desc" className="input" rows={4} required value={form.description} onChange={set('description')} placeholder="4 problems · 90 minutes · rated" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="field">
              <label htmlFor="c-start">Starts</label>
              <input id="c-start" type="datetime-local" className="input" required value={form.startTime} onChange={set('startTime')} />
            </div>
            <div className="field">
              <label htmlFor="c-end">Ends</label>
              <input id="c-end" type="datetime-local" className="input" required value={form.endTime} onChange={set('endTime')} />
            </div>
          </div>
          {duration && (
            <p className="-mt-2 text-[13px]" style={{ color: invalidTimes ? 'var(--color-hard)' : 'var(--color-neutral-400)' }}>
              {invalidTimes ? duration : `Runs for ${duration} · times are in your local timezone`}
            </p>
          )}
          <div className="field max-w-50">
            <label htmlFor="c-max">Max participants</label>
            <input id="c-max" type="number" min={1} className="input" value={form.maxParticipants} onChange={set('maxParticipants')} />
          </div>

          <div className="row-rule pb-3 pt-2 text-sm text-neutral-300">
            {selected.length} problem{selected.length === 1 ? '' : 's'} selected
            {selected.length > 0 && (
              <span className="text-neutral-500"> · {selected.map((id) => problems.find((p) => p._id === id)?.title).filter(Boolean).join(', ')}</span>
            )}
          </div>
          <div>
            <button type="submit" className="btn btn-primary btn-lg" disabled={saving}>
              {saving ? 'Scheduling…' : 'Schedule contest'}
            </button>
          </div>
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <span className="eyebrow">Problems</span>
            <span className="flex-1" />
            <div className="relative w-full sm:w-64">
              <Search size={15} className="absolute left-2.5 top-2.75 text-neutral-500" />
              <input className="input pl-8" placeholder="Search title or topic" value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
          </div>
          <div className="mt-3 max-h-[560px] overflow-y-auto pr-1">
            {visible.map((p) => {
              const on = selected.includes(p._id);
              return (
                <button
                  key={p._id}
                  type="button"
                  onClick={() => toggle(p._id)}
                  aria-pressed={on}
                  className="row-rule flex w-full items-center gap-3 py-3 text-left hover:bg-white/3"
                >
                  <span
                    className="grid h-5 w-5 flex-none place-items-center rounded-sm"
                    style={{ border: `1px solid ${on ? 'var(--color-accent)' : 'var(--color-divider)'}`, background: on ? 'var(--color-accent-800)' : 'transparent' }}
                  >
                    {on && <Check size={13} className="text-accent-100" />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[15px]">{p.title}</span>
                    <span className="block truncate text-[13px] capitalize text-neutral-400">{(p.tags || []).join(' · ')}</span>
                  </span>
                  <span className="text-sm" style={{ color: difficultyColor(p.difficulty) }}>
                    {capitalize(p.difficulty)}
                  </span>
                </button>
              );
            })}
            {visible.length === 0 && <p className="py-6 text-sm text-neutral-400">No problems match.</p>}
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminContest;
