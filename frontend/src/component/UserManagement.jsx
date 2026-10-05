import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Search, ShieldCheck } from 'lucide-react';
import axiosClient from '../utils/axiosClient';
import { setAllUsers, updateUserRole } from '../authSlice';
import { Avatar, Notice, PageLoader } from './ui';
import { ConfirmDialog } from './AdminProblemList';
import { formatNumber, timeAgo } from '../utils/format';

const ROLES = ['All', 'User', 'Admin'];

const UserManagement = () => {
  const dispatch = useDispatch();
  const allUsers = useSelector((state) => state.auth.allUsers) || [];
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('All');
  const [notice, setNotice] = useState(null);
  const [pending, setPending] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    axiosClient
      .get('/user/admin/users')
      .then(({ data }) => dispatch(setAllUsers(Array.isArray(data?.users) ? data.users : [])))
      .catch(() => setNotice({ type: 'error', message: 'Could not load users.' }))
      .finally(() => setLoading(false));
  }, [dispatch]);

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return allUsers.filter((u) => {
      const roleOk = role === 'All' || u.role === role.toLowerCase();
      const text = `${u.firstName || ''} ${u.lastName || ''} ${u.emailId || ''}`.toLowerCase();
      return roleOk && (!q || text.includes(q));
    });
  }, [allUsers, search, role]);

  const promote = async () => {
    const user = pending;
    try {
      setBusy(true);
      const { data } = await axiosClient.post(`/user/admin/promote/${user._id}`);
      if (data?.success) {
        dispatch(updateUserRole({ userId: user._id, newRole: 'admin' }));
        setNotice({ type: 'success', message: `${user.firstName} is now an admin.` });
      }
    } catch (err) {
      setNotice({ type: 'error', message: err?.response?.data?.message || 'Promotion failed.' });
    } finally {
      setBusy(false);
      setPending(null);
    }
  };

  if (loading) return <PageLoader label="Loading users…" />;

  const adminCount = allUsers.filter((u) => u.role === 'admin').length;

  return (
    <div className="page fade-in">
      <h1 className="page-title">User management</h1>
      <p className="page-sub">
        {formatNumber(allUsers.length)} users · {adminCount} admin{adminCount === 1 ? '' : 's'}
      </p>

      {notice && (
        <div className="mt-6">
          <Notice type={notice.type} onClose={() => setNotice(null)}>
            {notice.message}
          </Notice>
        </div>
      )}

      <div className="mt-8 flex flex-wrap items-center gap-2.5">
        {ROLES.map((r) => (
          <button key={r} type="button" className="pill" aria-pressed={role === r} onClick={() => setRole(r)}>
            {r}
          </button>
        ))}
        <div className="flex-1" />
        <div className="relative w-full sm:w-80">
          <Search size={15} className="absolute left-2.5 top-2.75 text-neutral-500" />
          <input className="input pl-8" placeholder="Search name or email" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>User</th>
              <th style={{ width: 110 }}>Role</th>
              <th style={{ width: 110, textAlign: 'right' }}>Solved</th>
              <th style={{ width: 110, textAlign: 'right' }}>XP</th>
              <th style={{ width: 140 }}>Joined</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((u) => (
              <tr key={u._id}>
                <td>
                  <span className="flex items-center gap-3">
                    <Avatar user={u} size={32} />
                    <span className="min-w-0">
                      <Link to={`/profile/${u._id}`} className="block truncate text-text hover:text-accent">
                        {[u.firstName, u.lastName].filter(Boolean).join(' ') || 'Unnamed'}
                      </Link>
                      <span className="block truncate text-[13px] text-neutral-400">{u.emailId}</span>
                    </span>
                  </span>
                </td>
                <td>
                  <span className={`tag ${u.role === 'admin' ? 'tag-accent' : 'tag-neutral'}`}>{u.role === 'admin' ? 'Admin' : 'User'}</span>
                </td>
                <td className="tnum text-right">{u.problemSolved?.length || 0}</td>
                <td className="tnum text-right text-accent-300">{formatNumber(u.xp)}</td>
                <td className="text-sm text-neutral-400">{u.createdAt ? timeAgo(u.createdAt) : '—'}</td>
                <td className="text-right">
                  {u.role !== 'admin' && (
                    <button type="button" className="btn btn-secondary" onClick={() => setPending(u)}>
                      <ShieldCheck size={15} /> Make admin
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && <p className="px-2 py-10 text-neutral-400">No users match that filter.</p>}
      </div>

      {pending && (
        <ConfirmDialog
          title="Make this user an admin?"
          body={
            <>
              {pending.firstName} ({pending.emailId}) will be able to create, edit and delete problems, manage contests and promote other users.
            </>
          }
          confirmLabel="Make admin"
          busy={busy}
          onConfirm={promote}
          onCancel={() => setPending(null)}
        />
      )}
    </div>
  );
};

export default UserManagement;
