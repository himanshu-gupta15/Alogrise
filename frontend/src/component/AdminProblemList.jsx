import { useCallback, useEffect, useMemo, useState } from 'react';
import { RotateCcw, Search } from 'lucide-react';
import axiosClient from '../utils/axiosClient';
import { Notice, PageLoader } from './ui';
import { capitalize, difficultyColor } from '../utils/format';

const DIFFICULTIES = ['All', 'Easy', 'Medium', 'Hard'];

/* Confirmation dialog in the design system, replacing window.confirm */
export const ConfirmDialog = ({ title, body, confirmLabel = 'Confirm', danger = false, busy = false, onConfirm, onCancel }) => (
  <div className="dialog-backdrop" onClick={onCancel}>
    <div className="dialog" role="alertdialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
      <div className="text-[20px]">{title}</div>
      <div className="text-sm text-neutral-300">{body}</div>
      <div className="mt-2 flex justify-end gap-2">
        <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={busy}>
          Cancel
        </button>
        <button type="button" className={`btn ${danger ? 'btn-danger' : 'btn-primary'}`} onClick={onConfirm} disabled={busy}>
          {busy ? 'Working…' : confirmLabel}
        </button>
      </div>
    </div>
  </div>
);

/**
 * Shared admin table of all problems with search + difficulty filter.
 * `renderActions(problem, { setNotice, removeRow })` returns the row's buttons.
 */
const AdminProblemList = ({ title, subtitle, renderActions }) => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState(null);
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState('All');

  const fetchProblems = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axiosClient.get('/problem/getAllProblem');
      setProblems(Array.isArray(data) ? data : []);
    } catch {
      setNotice({ type: 'error', message: 'Could not load problems.' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProblems();
  }, [fetchProblems]);

  const removeRow = useCallback((id) => setProblems((prev) => prev.filter((p) => p._id !== id)), []);

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return problems.filter(
      (p) => (difficulty === 'All' || p.difficulty?.toLowerCase() === difficulty.toLowerCase()) && (!q || p.title?.toLowerCase().includes(q))
    );
  }, [problems, search, difficulty]);

  if (loading && problems.length === 0) return <PageLoader label="Loading problems…" />;

  return (
    <div className="page fade-in">
      <h1 className="page-title">{title}</h1>
      {subtitle && <p className="page-sub">{subtitle}</p>}

      {notice && (
        <div className="mt-6">
          <Notice type={notice.type} onClose={() => setNotice(null)}>
            {notice.message}
          </Notice>
        </div>
      )}

      <div className="mt-8 flex flex-wrap items-center gap-2.5">
        {DIFFICULTIES.map((d) => (
          <button key={d} type="button" className="pill" aria-pressed={difficulty === d} onClick={() => setDifficulty(d)}>
            {d}
          </button>
        ))}
        <div className="flex-1" />
        <div className="relative w-full sm:w-70">
          <Search size={15} className="absolute left-2.5 top-2.75 text-neutral-500" />
          <input className="input pl-8" placeholder="Search by title" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <button type="button" className="btn btn-icon btn-secondary" onClick={fetchProblems} aria-label="Refresh" title="Refresh">
          <RotateCcw size={15} />
        </button>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th style={{ width: 56 }}>#</th>
              <th>Title</th>
              <th>Topics</th>
              <th style={{ width: 110 }}>Difficulty</th>
              <th style={{ width: 110 }}>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p._id}>
                <td className="tnum text-neutral-500">{problems.indexOf(p) + 1}</td>
                <td>{p.title}</td>
                <td className="text-sm capitalize text-neutral-400">{(Array.isArray(p.tags) ? p.tags : []).join(' · ')}</td>
                <td className="text-sm" style={{ color: difficultyColor(p.difficulty) }}>
                  {capitalize(p.difficulty)}
                </td>
                <td className="text-sm text-neutral-400">{capitalize(p.status || 'approved')}</td>
                <td>
                  <div className="flex justify-end gap-2">{renderActions(p, { setNotice, removeRow })}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && <p className="px-2 py-10 text-neutral-400">No problems match that filter.</p>}
      </div>
    </div>
  );
};

export default AdminProblemList;
