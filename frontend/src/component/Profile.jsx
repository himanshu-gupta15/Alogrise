import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Check, CircleAlert, CircleCheck, CircleX, Github, Link2, Linkedin, Pencil, Upload, UserCheck, UserPlus, X } from 'lucide-react';
import axiosClient from '../utils/axiosClient';
import { setUser as setAuthUser } from '../authSlice';
import { Avatar, Notice, PageLoader } from './ui';
import { capitalize, formatNumber, timeAgo } from '../utils/format';

const STATUS = {
  accepted: { label: 'Accepted', color: 'var(--color-ok)', icon: CircleCheck },
  wrong: { label: 'Wrong answer', color: 'var(--color-err)', icon: CircleX },
  error: { label: 'Error', color: 'var(--color-warn)', icon: CircleAlert },
  pending: { label: 'Pending', color: 'var(--color-neutral-400)', icon: CircleAlert },
};

const CONTRIBUTION_TAG = {
  approved: { label: 'Approved', cls: 'tag-accent' },
  pending: { label: 'Pending', cls: 'tag-neutral' },
  rejected: { label: 'Rejected', cls: 'tag-outline' },
};

const dayKey = (value) => {
  const d = new Date(value);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
};

const heatColor = (count) => {
  if (count >= 6) return 'var(--color-accent-400)';
  if (count >= 3) return 'var(--color-accent-600)';
  if (count >= 1) return 'var(--color-accent-800)';
  return 'var(--color-neutral-900)';
};

const handleOf = (user) => user?.emailId?.split('@')?.[0] || [user?.firstName, user?.lastName].filter(Boolean).join('').toLowerCase() || 'user';

const emptyForm = (u) => ({
  firstName: u?.firstName || '',
  lastName: u?.lastName || '',
  bio: u?.bio || '',
  githubLink: u?.githubLink || '',
  linkedinLink: u?.linkedinLink || '',
  profilePicture: u?.profilePicture || '',
});

/* ================= EDIT DIALOG ================= */

const EditProfileDialog = ({ initial, onClose, onSaved }) => {
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setError('Image too large. Please use one under 2 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setForm((f) => ({ ...f, profilePicture: reader.result || '' }));
    reader.readAsDataURL(file);
  };

  const save = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const { data } = await axiosClient.put('/user/profile', form);
      onSaved(data?.user);
    } catch (err) {
      setError(err?.response?.data?.message || err?.response?.data?.error || 'Unable to save profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="dialog-backdrop" onClick={onClose}>
      <form className="dialog w-[min(520px,100%)]" onClick={(e) => e.stopPropagation()} onSubmit={save}>
        <div className="flex items-center">
          <div className="text-[20px]">Edit profile</div>
          <span className="flex-1" />
          <button type="button" className="btn btn-icon" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="flex items-center gap-4">
          <Avatar user={form} size={56} />
          <label className="btn btn-secondary cursor-pointer">
            <Upload size={15} /> Upload photo
            <input type="file" accept="image/*" className="hidden" onChange={handleImage} />
          </label>
          {form.profilePicture && (
            <button type="button" className="btn btn-ghost" onClick={() => setForm((f) => ({ ...f, profilePicture: '' }))}>
              Remove
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="field">
            <label>First name</label>
            <input className="input" value={form.firstName} onChange={set('firstName')} required minLength={3} />
          </div>
          <div className="field">
            <label>Last name</label>
            <input className="input" value={form.lastName} onChange={set('lastName')} />
          </div>
        </div>
        <div className="field">
          <label>Bio</label>
          <textarea className="input" rows={3} value={form.bio} onChange={set('bio')} placeholder="What are you working towards?" />
        </div>
        <div className="field">
          <label>GitHub</label>
          <input className="input" value={form.githubLink} onChange={set('githubLink')} placeholder="https://github.com/you" />
        </div>
        <div className="field">
          <label>LinkedIn</label>
          <input className="input" value={form.linkedinLink} onChange={set('linkedinLink')} placeholder="https://linkedin.com/in/you" />
        </div>

        {error && <p className="field-error">{error}</p>}

        <div className="mt-1 flex justify-end gap-2">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

/* ================= PEOPLE LIST ================= */

const PeopleList = ({ title, people }) => (
  <div>
    <div className="eyebrow">
      {title} · {people.length}
    </div>
    <div className="mt-2">
      {people.length === 0 && <p className="py-3 text-sm text-neutral-400">No one yet.</p>}
      {people.slice(0, 8).map((p) => (
        <Link key={p._id} to={`/profile/${p._id}`} className="row-rule flex items-center gap-3 py-3 text-text hover:text-accent">
          <Avatar user={p} size={28} />
          <span className="text-[15px]">
            {p.firstName} {p.lastName}
          </span>
        </Link>
      ))}
    </div>
  </div>
);

/* ================= PAGE ================= */

const Profile = () => {
  const dispatch = useDispatch();
  const { userId } = useParams();
  const { user: authUser } = useSelector((state) => state.auth);

  const profileId = userId || authUser?._id;
  const isOwnProfile = !userId || userId === authUser?._id;

  const [profileUser, setProfileUser] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editOpen, setEditOpen] = useState(false);
  const [followBusy, setFollowBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const [tab, setTab] = useState('');

  useEffect(() => {
    if (!profileId) return undefined;
    let active = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        const [profileRes, subsRes, mineRes] = await Promise.all([
          axiosClient.get(`/user/profile/${profileId}`),
          // Submissions and contributions are private to their owner
          isOwnProfile ? axiosClient.get('/problem/mySubmissions').catch(() => ({ data: [] })) : Promise.resolve({ data: [] }),
          isOwnProfile ? axiosClient.get('/problem/myProblems').catch(() => ({ data: [] })) : Promise.resolve({ data: [] }),
        ]);
        if (!active) return;
        setProfileUser(profileRes.data?.user || null);
        setSubmissions(Array.isArray(subsRes.data) ? subsRes.data : []);
        setContributions(Array.isArray(mineRes.data) ? mineRes.data : []);
        setError('');
      } catch {
        if (active) setError('Unable to load this profile right now.');
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchData();
    return () => {
      active = false;
    };
  }, [profileId, isOwnProfile]);

  // 53 weeks × 7 days ending this week, columns are weeks (Sunday first)
  const heatmap = useMemo(() => {
    const counts = new Map();
    submissions.forEach((s) => counts.set(dayKey(s.createdAt), (counts.get(dayKey(s.createdAt)) || 0) + 1));
    const today = new Date();
    const start = new Date(today);
    start.setDate(today.getDate() - today.getDay() - 52 * 7);
    const cells = [];
    for (let i = 0; i < 53 * 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      cells.push({ date: d, future: d > today, count: counts.get(dayKey(d)) || 0 });
    }
    return cells;
  }, [submissions]);

  const handleFollow = async () => {
    try {
      setFollowBusy(true);
      const { data } = await axiosClient.post(`/user/follow/${profileUser._id}`);
      if (data?.user) setProfileUser(data.user);
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to update follow state.');
    } finally {
      setFollowBusy(false);
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/profile/${profileUser?._id || ''}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setError('Unable to copy the profile link.');
    }
  };

  if (loading) return <PageLoader label="Loading profile…" />;

  if (!profileUser) {
    return <div className="page text-neutral-400">{error || 'Profile not found.'}</div>;
  }

  const name = [profileUser.firstName, profileUser.lastName].filter(Boolean).join(' ') || 'User';
  const joined = profileUser.createdAt ? new Date(profileUser.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : null;
  const tabs = isOwnProfile ? ['Submissions', 'Contributions', 'Network'] : ['Followers', 'Following'];
  const activeTab = tabs.includes(tab) ? tab : tabs[0];

  const stats = [
    ['Solved', formatNumber(profileUser.problemSolvedCount)],
    ['XP', formatNumber(profileUser.xp)],
    ['Streak', `${profileUser.streak || 0} day${profileUser.streak === 1 ? '' : 's'}`],
    ['Global rank', profileUser.globalRank > 0 ? `#${formatNumber(profileUser.globalRank)}` : '—'],
  ];

  return (
    <div className="page fade-in">
      {error && (
        <div className="mb-6">
          <Notice type="error" onClose={() => setError('')}>
            {error}
          </Notice>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-wrap items-center gap-5">
        <Avatar user={profileUser} size={64} />
        <div className="min-w-0 flex-1">
          <h1 className="page-title">{name}</h1>
          <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-neutral-400">
            <span>@{handleOf(profileUser)}</span>
            {joined && <span>Joined {joined}</span>}
            <span>
              {profileUser.followersCount} followers · {profileUser.followingCount} following
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <button type="button" className="btn btn-ghost" onClick={copyLink}>
            {copied ? <Check size={15} /> : <Link2 size={15} />} {copied ? 'Copied' : 'Share'}
          </button>
          {isOwnProfile ? (
            <button type="button" className="btn btn-secondary" onClick={() => setEditOpen(true)}>
              <Pencil size={15} /> Edit profile
            </button>
          ) : (
            <button type="button" className={`btn ${profileUser.isFollowing ? 'btn-secondary' : 'btn-primary'}`} onClick={handleFollow} disabled={followBusy}>
              {profileUser.isFollowing ? <UserCheck size={15} /> : <UserPlus size={15} />}
              {profileUser.isFollowing ? 'Following' : 'Follow'}
            </button>
          )}
        </div>
      </div>

      {(profileUser.bio || profileUser.githubLink || profileUser.linkedinLink) && (
        <div className="mt-4 flex max-w-3xl flex-wrap items-center gap-x-5 gap-y-2 text-[14px] text-neutral-300">
          {profileUser.bio && <p className="m-0 w-full">{profileUser.bio}</p>}
          {profileUser.githubLink && (
            <a href={profileUser.githubLink} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-[13px]">
              <Github size={14} /> GitHub
            </a>
          )}
          {profileUser.linkedinLink && (
            <a href={profileUser.linkedinLink} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-[13px]">
              <Linkedin size={14} /> LinkedIn
            </a>
          )}
        </div>
      )}

      {/* Stats */}
      <div className="stat-grid mt-6 grid-cols-2 md:grid-cols-4">
        {stats.map(([label, value]) => (
          <div key={label}>
            <div className="text-[12.5px] text-neutral-400">{label}</div>
            <div className="tnum mt-1.5 text-[22px] font-medium leading-none">{value}</div>
          </div>
        ))}
      </div>

      {/* Heatmap (own profile only: submissions are private) */}
      {isOwnProfile && (
        <div className="mt-7">
          <div className="flex flex-wrap items-center gap-2 text-[13px]">
            <span className="font-medium">
              {formatNumber(submissions.length)} submission{submissions.length === 1 ? '' : 's'} in the last year
            </span>
            <span className="flex-1" />
            <span className="flex items-center gap-1 text-xs text-neutral-500">
              Less
              {[0, 1, 3, 6].map((n) => (
                <span key={n} className="h-2.5 w-2.5 rounded-xs" style={{ background: heatColor(n) }} />
              ))}
              More
            </span>
          </div>
          <div className="mt-3 overflow-x-auto pb-1">
            <div className="grid grid-flow-col gap-0.75" style={{ gridTemplateRows: 'repeat(7, 12px)', gridAutoColumns: '12px' }}>
              {heatmap.map((c, i) => (
                <div
                  key={i}
                  className="rounded-xs"
                  style={{ background: c.future ? 'transparent' : heatColor(c.count) }}
                  title={c.future ? '' : `${c.count} submission${c.count === 1 ? '' : 's'} · ${c.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="mt-8 flex gap-5" role="tablist" style={{ boxShadow: 'inset 0 -1px 0 var(--color-neutral-900)' }}>
        {tabs.map((t) => (
          <button key={t} type="button" role="tab" aria-selected={activeTab === t} className="tab" onClick={() => setTab(t)}>
            {t}
          </button>
        ))}
      </div>

      {activeTab === 'Submissions' && (
        <div>
          {submissions.length === 0 && (
            <p className="py-6 text-sm text-neutral-400">
              Nothing yet. <Link to="/practice">Pick a problem</Link> to get started.
            </p>
          )}
          {submissions.slice(0, 12).map((s) => {
            const st = STATUS[s.status] || { label: capitalize(s.status), color: 'var(--color-neutral-300)', icon: CircleAlert };
            const Icon = st.icon;
            return (
              <div key={s._id} className="row-rule flex items-center gap-3 py-3">
                <Icon size={16} style={{ color: st.color }} className="flex-none" />
                <span className="min-w-0 flex-1">
                  {s.problemId?._id ? (
                    <Link to={`/problem/${s.problemId._id}`} className="block truncate text-[15px] text-text hover:text-accent">
                      {s.problemId.title}
                    </Link>
                  ) : (
                    <span className="block text-[15px] text-neutral-500">Deleted problem</span>
                  )}
                  <span className="mt-0.5 block text-[12.5px] text-neutral-500">
                    <span className="capitalize">{s.language}</span> · {timeAgo(s.createdAt)}
                  </span>
                </span>
                <span className="pill-status" style={{ '--pill': st.color }}>{st.label}</span>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'Contributions' && (
        <div>
          <div className="flex items-center pt-3">
            <span className="text-[13px] text-neutral-400">Problems you've submitted for review</span>
            <span className="flex-1" />
            <Link to="/create-problem" className="text-[13px]">Submit new</Link>
          </div>
          {contributions.length === 0 && <p className="py-4 text-sm text-neutral-400">You haven't contributed a problem yet.</p>}
          {contributions.map((m) => {
            const tag = CONTRIBUTION_TAG[m.status] || CONTRIBUTION_TAG.approved;
            return (
              <div key={m._id} className="row-rule flex items-center gap-3 py-3">
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[15px]">{m.title}</span>
                  <span className="mt-0.5 block text-[12.5px] text-neutral-500">
                    {capitalize(m.difficulty)} · submitted {timeAgo(m.createdAt)}
                  </span>
                </span>
                <span className={`tag ${tag.cls}`}>{tag.label}</span>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'Network' && (
        <div className="grid gap-10 pt-4 md:grid-cols-2">
          <PeopleList title="Followers" people={profileUser.followers || []} />
          <PeopleList title="Following" people={profileUser.following || []} />
        </div>
      )}
      {activeTab === 'Followers' && <div className="pt-4"><PeopleList title="Followers" people={profileUser.followers || []} /></div>}
      {activeTab === 'Following' && <div className="pt-4"><PeopleList title="Following" people={profileUser.following || []} /></div>}

      {editOpen && (
        <EditProfileDialog
          initial={emptyForm(profileUser)}
          onClose={() => setEditOpen(false)}
          onSaved={(updated) => {
            if (updated) {
              setProfileUser((prev) => ({ ...prev, ...updated }));
              dispatch(setAuthUser({ ...authUser, ...updated }));
            }
            setEditOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default Profile;
