import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import axiosClient from '../utils/axiosClient';
import { Spinner } from './ui';
import { timeAgo } from '../utils/format';

const SUBMISSION_STATUS = {
  accepted: { label: 'Accepted', color: 'var(--color-accent-300)' },
  wrong: { label: 'Wrong answer', color: 'var(--color-hard)' },
  error: { label: 'Error', color: 'var(--color-medium)' },
  pending: { label: 'Pending', color: 'var(--color-neutral-400)' },
};

const statusOf = (status) => SUBMISSION_STATUS[status] || { label: status, color: 'var(--color-neutral-300)' };

const SubmissionHistory = ({ problemId, refreshKey }) => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    let active = true;
    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await axiosClient.get(`/problem/submittedProblem/${problemId}`);
        // The API returns a string when there are no submissions
        const list = Array.isArray(data) ? [...data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) : [];
        if (active) setSubmissions(list);
      } catch {
        if (active) setError('Could not load your submissions.');
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchSubmissions();
    return () => {
      active = false;
    };
  }, [problemId, refreshKey]);

  if (loading) {
    return (
      <div className="flex items-center gap-2.5 py-6 text-sm text-neutral-400">
        <Spinner size={16} /> Loading submissions…
      </div>
    );
  }

  if (error) return <p className="py-6 text-sm" style={{ color: 'var(--color-hard)' }}>{error}</p>;

  if (submissions.length === 0) {
    return <p className="py-6 text-sm text-neutral-400">No submissions yet. Submit your code to see it here.</p>;
  }

  return (
    <>
      <table className="table text-sm">
        <thead>
          <tr>
            <th>Status</th>
            <th>Language</th>
            <th>Runtime</th>
            <th>When</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((sub) => {
            const s = statusOf(sub.status);
            return (
              <tr key={sub._id} className="cursor-pointer" onClick={() => setSelected(sub)}>
                <td style={{ color: s.color, padding: '10px 8px' }}>{s.label}</td>
                <td className="capitalize" style={{ padding: '10px 8px' }}>{sub.language}</td>
                <td className="tnum" style={{ padding: '10px 8px' }}>
                  {sub.status === 'accepted' ? `${Math.round((sub.runtime || 0) * 1000)} ms` : '—'}
                </td>
                <td className="text-neutral-400" style={{ padding: '10px 8px' }}>{timeAgo(sub.createdAt)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {selected && (
        <div className="dialog-backdrop" onClick={() => setSelected(null)}>
          <div className="dialog max-h-[85vh] w-[min(860px,100%)]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3">
              <span className="text-[20px]" style={{ color: statusOf(selected.status).color }}>
                {statusOf(selected.status).label}
              </span>
              <span className="tnum text-sm text-neutral-400">
                {selected.testCasesPassed} / {selected.testCasesTotal} tests · <span className="capitalize">{selected.language}</span> · {timeAgo(selected.createdAt)}
              </span>
              <span className="flex-1" />
              <button type="button" className="btn btn-icon" onClick={() => setSelected(null)} aria-label="Close">
                <X size={18} />
              </button>
            </div>
            {selected.status === 'accepted' && (
              <div className="tnum flex gap-8 text-sm">
                <span><span className="text-neutral-400">Runtime </span>{Math.round((selected.runtime || 0) * 1000)} ms</span>
                <span><span className="text-neutral-400">Memory </span>{((selected.memory || 0) / 1024).toFixed(1)} MB</span>
              </div>
            )}
            <pre className="code-surface min-h-0 flex-1 overflow-auto rounded-md p-4 font-mono text-[13px] leading-[1.7] text-neutral-200 elev-sm">
              <code>{selected.code}</code>
            </pre>
            {selected.errorMessage && (
              <pre className="overflow-auto whitespace-pre-wrap rounded-md p-3 font-mono text-xs" style={{ color: 'var(--color-hard)', boxShadow: 'inset 0 0 0 1px color-mix(in srgb, var(--color-hard) 40%, transparent)' }}>
                {selected.errorMessage}
              </pre>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default SubmissionHistory;
