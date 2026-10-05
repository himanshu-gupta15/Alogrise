import { useEffect, useMemo, useState } from 'react';
import { Check, Pencil, Search, Trash2 } from 'lucide-react';
import axiosClient from '../utils/axiosClient';
import { Notice, PageLoader } from './ui';
import { ConfirmDialog } from './AdminProblemList';
import { capitalize, difficultyColor, formatNumber } from '../utils/format';

const TYPES = [
  { value: 'online', label: 'Online assessment' },
  { value: 'phone', label: 'Phone screen' },
  { value: 'onsite', label: 'Onsite' },
];

const EMPTY = {
  packId: '',
  company: '',
  role: '',
  type: 'online',
  problems: [],
  attempted: 0,
  successRate: 0,
  isPremium: false,
  price: '',
  currency: 'usd',
  isActive: true,
  description: '',
};

const priceLabel = (cents, currency = 'usd') => {
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency.toUpperCase() }).format((cents || 0) / 100);
  } catch {
    return `${((cents || 0) / 100).toFixed(2)} ${currency}`;
  }
};

function AdminInterview() {
  const [packs, setPacks] = useState([]);
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState('');
  const [form, setForm] = useState(EMPTY);
  const [query, setQuery] = useState('');
  const [notice, setNotice] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadPacks = () =>
    axiosClient
      .get('/interview/admin/packs')
      .then(({ data }) => setPacks(Array.isArray(data) ? data : []))
      .catch(() => setNotice({ type: 'error', message: 'Could not load interview packs.' }));

  useEffect(() => {
    Promise.all([
      loadPacks(),
      axiosClient
        .get('/problem/getAllProblem')
        .then(({ data }) => setProblems(Array.isArray(data) ? data : []))
        .catch(() => setNotice({ type: 'error', message: 'Could not load problems.' })),
    ]).finally(() => setLoading(false));
  }, []);

  const visibleProblems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return problems;
    return problems.filter((p) => `${p.title} ${p.difficulty}`.toLowerCase().includes(q));
  }, [problems, query]);

  const titleOf = useMemo(() => new Map(problems.map((p) => [p._id, p.title])), [problems]);

  const set = (key) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [key]: value }));
  };

  const toggleProblem = (id) =>
    setForm((f) => ({ ...f, problems: f.problems.includes(id) ? f.problems.filter((x) => x !== id) : [...f.problems, id] }));

  const resetForm = () => {
    setForm(EMPTY);
    setEditingId('');
    setQuery('');
  };

  const startEdit = (pack) => {
    setEditingId(pack._id);
    setForm({
      packId: pack.packId || '',
      company: pack.company || '',
      role: pack.role || '',
      type: pack.type || 'online',
      problems: (pack.problems || []).map(String),
      attempted: pack.attempted || 0,
      successRate: pack.successRate || 0,
      isPremium: Boolean(pack.isPremium),
      price: pack.priceInCents ? (pack.priceInCents / 100).toFixed(2) : '',
      currency: pack.currency || 'usd',
      isActive: pack.isActive !== false,
      description: pack.description || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.problems.length === 0) {
      setNotice({ type: 'error', message: 'Pick at least one problem for the pack.' });
      return;
    }
    const priceInCents = form.isPremium ? Math.round(Number(form.price || 0) * 100) : 0;
    if (form.isPremium && priceInCents <= 0) {
      setNotice({ type: 'error', message: 'Premium packs need a price above zero.' });
      return;
    }
    const payload = {
      ...form,
      price: undefined,
      sets: form.problems.length,
      attempted: Number(form.attempted) || 0,
      successRate: Number(form.successRate) || 0,
      priceInCents,
    };
    try {
      setSaving(true);
      if (editingId) await axiosClient.put(`/interview/admin/packs/${editingId}`, payload);
      else await axiosClient.post('/interview/admin/packs', payload);
      await loadPacks();
      setNotice({ type: 'success', message: editingId ? `Saved “${form.company} · ${form.role}”.` : `Created “${form.company} · ${form.role}”.` });
      resetForm();
    } catch (error) {
      setNotice({ type: 'error', message: error?.response?.data?.error || 'Could not save the pack.' });
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    try {
      setDeleting(true);
      await axiosClient.delete(`/interview/admin/packs/${toDelete._id}`);
      await loadPacks();
      if (editingId === toDelete._id) resetForm();
      setNotice({ type: 'success', message: `Deleted “${toDelete.company} · ${toDelete.role}”.` });
    } catch (error) {
      setNotice({ type: 'error', message: error?.response?.data?.error || 'Could not delete the pack.' });
    } finally {
      setDeleting(false);
      setToDelete(null);
    }
  };

  if (loading) return <PageLoader label="Loading interview packs…" />;

  return (
    <div className="page fade-in">
      <h1 className="page-title">Interview packs</h1>
      <p className="page-sub">Free and premium mock assessments shown on the Interview page.</p>

      {notice && (
        <div className="mt-6">
          <Notice type={notice.type} onClose={() => setNotice(null)}>
            {notice.message}
          </Notice>
        </div>
      )}

      <div className="mt-10 grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex items-center">
            <span className="eyebrow eyebrow-accent">{editingId ? 'Edit pack' : 'New pack'}</span>
            <span className="flex-1" />
            {editingId && (
              <button type="button" className="btn btn-ghost" onClick={resetForm}>
                Cancel edit
              </button>
            )}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="field">
              <label htmlFor="i-company">Company</label>
              <input id="i-company" className="input" required value={form.company} onChange={set('company')} placeholder="Amazon" />
            </div>
            <div className="field">
              <label htmlFor="i-role">Role / round</label>
              <input id="i-role" className="input" required value={form.role} onChange={set('role')} placeholder="SDE II" />
            </div>
            <div className="field">
              <label htmlFor="i-id">Pack ID</label>
              <input id="i-id" className="input input-mono" required value={form.packId} onChange={set('packId')} placeholder="amazon-sde2-oa" />
            </div>
            <div className="field">
              <label>Type</label>
              <div className="seg" role="radiogroup">
                {TYPES.map((t) => (
                  <button key={t.value} type="button" role="radio" aria-checked={form.type === t.value} className="seg-opt" onClick={() => setForm((f) => ({ ...f, type: t.value }))}>
                    {t.label.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="field">
            <label htmlFor="i-desc">Description</label>
            <textarea id="i-desc" className="input" rows={3} maxLength={600} value={form.description} onChange={set('description')} placeholder="What this round covers" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="field">
              <label htmlFor="i-att">Attempts shown</label>
              <input id="i-att" type="number" min={0} className="input" value={form.attempted} onChange={set('attempted')} />
            </div>
            <div className="field">
              <label htmlFor="i-rate">Pass rate %</label>
              <input id="i-rate" type="number" min={0} max={100} step="0.1" className="input" value={form.successRate} onChange={set('successRate')} />
            </div>
          </div>

          <div className="flex flex-wrap items-end gap-6">
            <label className="flex cursor-pointer items-center gap-2.5 text-sm">
              <input type="checkbox" className="accent-accent" checked={form.isPremium} onChange={set('isPremium')} /> Premium
            </label>
            {form.isPremium && (
              <div className="field">
                <label htmlFor="i-price">Price</label>
                <div className="flex gap-2">
                  <input id="i-price" type="number" min={0} step="0.01" className="input w-32" value={form.price} onChange={set('price')} placeholder="19.00" />
                  <select className="input w-24" value={form.currency} onChange={set('currency')} aria-label="Currency">
                    {['usd', 'inr', 'eur', 'gbp'].map((c) => (
                      <option key={c} value={c}>
                        {c.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
            <label className="flex cursor-pointer items-center gap-2.5 text-sm">
              <input type="checkbox" className="accent-accent" checked={form.isActive} onChange={set('isActive')} /> Visible to users
            </label>
          </div>

          <div>
            <div className="flex items-center gap-3">
              <span className="eyebrow">Problems · {form.problems.length} selected</span>
              <span className="flex-1" />
              <div className="relative w-full sm:w-56">
                <Search size={15} className="absolute left-2.5 top-2.75 text-neutral-500" />
                <input className="input pl-8" placeholder="Search problems" value={query} onChange={(e) => setQuery(e.target.value)} />
              </div>
            </div>
            <div className="mt-2 max-h-80 overflow-y-auto pr-1">
              {visibleProblems.map((p) => {
                const on = form.problems.includes(p._id);
                return (
                  <button key={p._id} type="button" onClick={() => toggleProblem(p._id)} aria-pressed={on} className="row-rule flex w-full items-center gap-3 py-2.5 text-left hover:bg-white/3">
                    <span
                      className="grid h-5 w-5 flex-none place-items-center rounded-sm"
                      style={{ border: `1px solid ${on ? 'var(--color-accent)' : 'var(--color-divider)'}`, background: on ? 'var(--color-accent-800)' : 'transparent' }}
                    >
                      {on && <Check size={13} className="text-accent-100" />}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-[15px]">{p.title}</span>
                    <span className="text-sm" style={{ color: difficultyColor(p.difficulty) }}>
                      {capitalize(p.difficulty)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <button type="submit" className="btn btn-primary btn-lg" disabled={saving}>
              {saving ? 'Saving…' : editingId ? 'Save pack' : 'Create pack'}
            </button>
          </div>
        </form>

        {/* Existing packs */}
        <div className="min-w-0">
          <div className="eyebrow">
            Packs · {packs.length}
          </div>
          {packs.length === 0 && <p className="py-6 text-sm text-neutral-400">No packs yet. Create the first one.</p>}
          <div className="mt-2">
            {packs.map((pack) => (
              <div
                key={pack._id}
                className="row-rule flex items-center gap-4 py-4"
                style={editingId === pack._id ? { backgroundColor: 'color-mix(in srgb, var(--color-accent-900) 60%, transparent)' } : undefined}
              >
                <span className="min-w-0 flex-1 pl-2">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="text-[16px]">
                      {pack.company} · {pack.role}
                    </span>
                    <span className={`tag ${pack.isPremium ? 'tag-outline' : 'tag-neutral'}`}>
                      {pack.isPremium ? priceLabel(pack.priceInCents, pack.currency) : 'Free'}
                    </span>
                    {pack.isActive === false && <span className="tag tag-neutral">Hidden</span>}
                  </span>
                  <span className="mt-1 block truncate text-[13px] text-neutral-400">
                    {TYPES.find((t) => t.value === pack.type)?.label || pack.type} · {pack.problems?.length || 0} problems · {formatNumber(pack.attempted)} attempts ·{' '}
                    <span className="font-mono">{pack.packId}</span>
                  </span>
                  {pack.problems?.length > 0 && (
                    <span className="mt-0.5 block truncate text-[13px] text-neutral-500">
                      {pack.problems.map((id) => titleOf.get(String(id)) || 'Removed problem').join(', ')}
                    </span>
                  )}
                </span>
                <button type="button" className="btn btn-icon btn-secondary" onClick={() => startEdit(pack)} aria-label="Edit pack">
                  <Pencil size={15} />
                </button>
                <button type="button" className="btn btn-icon btn-danger" onClick={() => setToDelete(pack)} aria-label="Delete pack">
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {toDelete && (
        <ConfirmDialog
          title="Delete this pack?"
          body={<>“{toDelete.company} · {toDelete.role}” will disappear from the Interview page. People who bought it keep their purchase record.</>}
          confirmLabel="Delete pack"
          danger
          busy={deleting}
          onConfirm={confirmDelete}
          onCancel={() => setToDelete(null)}
        />
      )}
    </div>
  );
}

export default AdminInterview;
