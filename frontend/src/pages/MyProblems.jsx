import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import axiosClient from '../utils/axiosClient';
import { PageLoader } from '../component/ui';
import { capitalize, difficultyColor, timeAgo } from '../utils/format';

const STATUS_TAG = {
  approved: { label: 'Approved', cls: 'tag-accent', note: 'Live on Problems' },
  pending: { label: 'Pending', cls: 'tag-neutral', note: 'Waiting for review' },
  rejected: { label: 'Rejected', cls: 'tag-outline', note: 'Not accepted' },
};

export default function MyProblems() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    axiosClient
      .get('/problem/myProblems')
      .then(({ data }) => setProblems(Array.isArray(data) ? data : []))
      .catch(() => setError('Could not load your problems.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoader label="Loading your problems…" />;

  return (
    <div className="page fade-in">
      <div className="flex flex-wrap items-end gap-4">
        <div>
          <h1 className="page-title">My problems</h1>
          <p className="page-sub">Problems you've contributed and where they are in review.</p>
        </div>
        <span className="flex-1" />
        <Link to="/create-problem" className="btn btn-primary">
          <Plus size={16} /> Contribute a problem
        </Link>
      </div>

      {error && <p className="mt-8" style={{ color: 'var(--color-hard)' }}>{error}</p>}

      <div className="mt-8 max-w-4xl">
        {!error && problems.length === 0 && <p className="py-6 text-neutral-400">You haven't contributed a problem yet.</p>}
        {problems.map((p) => {
          const tag = STATUS_TAG[p.status] || STATUS_TAG.approved;
          const live = tag === STATUS_TAG.approved;
          return (
            <div key={p._id} className="row-rule flex items-center gap-4 py-4">
              <span className="min-w-0 flex-1">
                {live ? (
                  <Link to={`/problem/${p._id}`} className="block text-[16px] text-text hover:text-accent">
                    {p.title}
                  </Link>
                ) : (
                  <span className="block text-[16px]">{p.title}</span>
                )}
                <span className="mt-1 block text-[13px] text-neutral-400">
                  <span style={{ color: difficultyColor(p.difficulty) }}>{capitalize(p.difficulty)}</span>
                  {p.tags?.length ? <span className="capitalize"> · {p.tags.join(' · ')}</span> : null}
                  {p.createdAt ? ` · submitted ${timeAgo(p.createdAt)}` : ''}
                </span>
              </span>
              <span className="hidden text-[13px] text-neutral-500 sm:inline">{tag.note}</span>
              <span className={`tag ${tag.cls}`}>{tag.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
