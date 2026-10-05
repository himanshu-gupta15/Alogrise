import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axiosClient from '../utils/axiosClient';
import { Avatar, PageLoader } from './ui';
import { formatNumber } from '../utils/format';

const fullName = (u) => `${u.firstName || ''} ${u.lastName || ''}`.trim() || 'Anonymous';

const neutralAvatar = { background: 'var(--color-neutral-800)', color: 'var(--color-neutral-100)' };

const Leaderboard = () => {
  const { user: currentUser } = useSelector((state) => state.auth);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    axiosClient
      .get('/user/getleaderboard')
      .then(({ data }) => setRows(Array.isArray(data) ? data : []))
      .catch(() => setError('Could not load the leaderboard.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoader label="Loading leaderboard…" />;

  const ranked = rows.map((u, i) => ({ ...u, rank: i + 1, me: u._id === currentUser?._id }));
  const podium = ranked.slice(0, 3);
  const rest = ranked.slice(3);

  return (
    <div className="page fade-in">
      <h1 className="page-title">Leaderboard</h1>
      <p className="page-sub">10 XP for every problem you solve.</p>

      {error && <p className="mt-8" style={{ color: 'var(--color-err)' }}>{error}</p>}
      {!error && ranked.length === 0 && <p className="mt-8 text-neutral-400">No one has solved a problem yet. Be the first.</p>}

      {podium.length > 0 && (
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {podium.map((p) => (
            <Link
              key={p._id}
              to={`/profile/${p._id}`}
              className="panel flex items-center gap-3 p-4 text-text hover:shadow-[inset_0_0_0_1px_var(--color-accent-700)]"
              style={p.me ? { boxShadow: 'inset 0 0 0 1px var(--color-accent-700)' } : undefined}
            >
              <span className="tnum w-7 text-[14px] text-accent">#{p.rank}</span>
              <Avatar user={p} size={36} style={neutralAvatar} />
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2">
                  <span className="truncate text-[15px]">{fullName(p)}</span>
                  {p.me && <span className="tag tag-accent">You</span>}
                </span>
                <span className="mt-0.5 block text-[12.5px] text-neutral-500">
                  {p.problemSolvedCount || 0} solved · {p.streak || 0}d streak
                </span>
              </span>
              <span className="tnum text-[17px] font-medium">{formatNumber(p.xp)}</span>
            </Link>
          ))}
        </div>
      )}

      {rest.length > 0 && (
        <div className="mt-6 overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: 64 }}>Rank</th>
                <th>Coder</th>
                <th style={{ width: 110, textAlign: 'right' }}>Solved</th>
                <th style={{ width: 110, textAlign: 'right' }}>Streak</th>
                <th style={{ width: 110, textAlign: 'right' }}>XP</th>
              </tr>
            </thead>
            <tbody>
              {rest.map((r) => (
                <tr key={r._id} style={r.me ? { backgroundColor: 'color-mix(in srgb, var(--color-accent-900) 55%, transparent)' } : undefined}>
                  <td className="tnum text-neutral-400" style={{ padding: '13px 8px' }}>{r.rank}</td>
                  <td style={{ padding: '13px 8px' }}>
                    <span className="flex items-center gap-3">
                      <Avatar user={r} size={28} style={neutralAvatar} />
                      <Link to={`/profile/${r._id}`} className="truncate text-text hover:text-accent">
                        {fullName(r)}
                      </Link>
                      {r.me && <span className="tag tag-accent">You</span>}
                    </span>
                  </td>
                  <td className="tnum text-right" style={{ padding: '13px 8px' }}>{r.problemSolvedCount || 0}</td>
                  <td className="tnum text-right text-neutral-300" style={{ padding: '13px 8px' }}>{r.streak || 0}d</td>
                  <td className="tnum text-right text-accent-300" style={{ padding: '13px 8px' }}>{formatNumber(r.xp)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
