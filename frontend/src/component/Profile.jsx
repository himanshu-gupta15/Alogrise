import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Award,
  Check,
  ChevronRight,
  ClipboardCopy,
  Clock3,
  Code2,
  ExternalLink,
  Flame,
  Github,
  Linkedin,
  Pencil,
  Save,
  Sparkles,
  Target,
  Trophy,
  Upload,
  UserCheck,
  UserPlus,
} from 'lucide-react';
import axiosClient from '../utils/axiosClient';
import { setUser as setAuthUser } from '../authSlice';

const colorByDifficulty = {
  easy: '#22c55e',
  medium: '#f59e0b',
  hard: '#ef4444',
};

const formatDate = (value) => {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const formatCompact = (value) => new Intl.NumberFormat('en-US').format(value || 0);

const toDateKey = (value) => {
  const date = new Date(value);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

const addDays = (date, days) => {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
};

const avatarFallback = (name = 'U') => {
  const parts = name.trim().split(' ').filter(Boolean);
  if (parts.length === 0) return 'U';
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
};

const handleFromUser = (user) => {
  const emailHandle = user?.emailId?.split('@')?.[0]?.trim();
  if (emailHandle) return emailHandle;
  const fromName = [user?.firstName, user?.lastName].filter(Boolean).join('').toLowerCase();
  return fromName || 'user';
};

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userId } = useParams();
  const { user: authUser } = useSelector((state) => state.auth);

  const [profileUser, setProfileUser] = useState(null);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [allProblems, setAllProblems] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [followingBusyId, setFollowingBusyId] = useState('');
  const [error, setError] = useState('');
  const [editOpen, setEditOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [hoveredDay, setHoveredDay] = useState(null);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    bio: '',
    githubLink: '',
    linkedinLink: '',
    profilePicture: '',
  });

  const profileId = userId || authUser?._id;
  const isOwnProfile = !userId || userId === authUser?._id;

  useEffect(() => {
    let active = true;

    const fetchData = async () => {
      try {
        setLoading(true);

        const profileRequest = axiosClient.get(`/user/profile/${profileId}`);
        const allProblemsRequest = axiosClient.get('/problem/getAllProblem');
        const solvedRequest = isOwnProfile ? axiosClient.get('/problem/problemSolvedByUser') : Promise.resolve({ data: [] });
        const leaderboardRequest = isOwnProfile ? axiosClient.get('/user/getleaderboard') : Promise.resolve({ data: [] });

        const [profileResponse, allProblemsResponse, solvedResponse, leaderboardResponse] = await Promise.all([
          profileRequest,
          allProblemsRequest,
          solvedRequest,
          leaderboardRequest,
        ]);

        if (!active) return;

        const nextProfile = profileResponse.data?.user || null;
        const nextAllProblems = Array.isArray(allProblemsResponse.data) ? allProblemsResponse.data : [];
        const nextSolvedProblems = Array.isArray(solvedResponse.data) ? solvedResponse.data : [];
        const nextLeaderboard = Array.isArray(leaderboardResponse.data) ? leaderboardResponse.data : [];

        setProfileUser(nextProfile);
        setAllProblems(nextAllProblems);
        setSolvedProblems(nextSolvedProblems);
        setLeaderboard(nextLeaderboard);

        if (isOwnProfile && nextSolvedProblems.length > 0) {
          const submissionLists = await Promise.all(
            nextSolvedProblems.map(async (problem) => {
              try {
                const { data } = await axiosClient.get(`/problem/submittedProblem/${problem._id}`);
                if (!Array.isArray(data)) return [];

                return data.map((submission) => ({
                  ...submission,
                  problemTitle: problem.title,
                  problemDifficulty: problem.difficulty,
                }));
              } catch {
                return [];
              }
            })
          );

          if (active) setSubmissions(submissionLists.flat());
        } else {
          setSubmissions([]);
        }

        setForm({
          firstName: nextProfile?.firstName || '',
          lastName: nextProfile?.lastName || '',
          bio: nextProfile?.bio || '',
          githubLink: nextProfile?.githubLink || '',
          linkedinLink: nextProfile?.linkedinLink || '',
          profilePicture: nextProfile?.profilePicture || '',
        });

        setError('');
      } catch {
        if (!active) return;
        setError('Unable to load profile right now.');
      } finally {
        if (active) setLoading(false);
      }
    };

    if (profileId) {
      fetchData();
    }

    return () => {
      active = false;
    };
  }, [profileId, isOwnProfile]);

  const computed = useMemo(() => {
    const solvedCount = solvedProblems.length;
    const acceptedSubmissions = submissions.filter((submission) => submission.status === 'accepted');
    const totalSubmissions = submissions.length;
    const acceptedRate = totalSubmissions > 0 ? Math.round((acceptedSubmissions.length / totalSubmissions) * 100) : 0;

    const difficultySummary = ['easy', 'medium', 'hard'].map((difficulty) => {
      const solved = solvedProblems.filter((problem) => (problem.difficulty || '').toLowerCase() === difficulty).length;
      const total = allProblems.filter((problem) => (problem.difficulty || '').toLowerCase() === difficulty).length;

      return {
        key: difficulty,
        name: difficulty === 'medium' ? 'Med.' : difficulty.charAt(0).toUpperCase() + difficulty.slice(1),
        solved,
        total,
        color: colorByDifficulty[difficulty],
      };
    });

    const totalProblemCount = difficultySummary.reduce((sum, item) => sum + item.total, 0);
    const ringTotal = Math.max(totalProblemCount, 1);
    const ringRadius = 84;
    const ringCircumference = 2 * Math.PI * ringRadius;

    let runningOffset = 0;
    const ringSegments = difficultySummary.map((item) => {
      const segmentLength = (item.total / ringTotal) * ringCircumference;
      const visibleLength = Math.max(segmentLength - 8, 0);

      const segment = {
        ...item,
        solvedPercent: item.total > 0 ? Math.round((item.solved / item.total) * 100) : 0,
        dashArray: `${visibleLength} ${ringCircumference}`,
        dashOffset: -runningOffset,
      };

      runningOffset += segmentLength;
      return segment;
    });

    const monthlyActivity = Array.from({ length: 12 }, (_, index) => {
      const monthDate = new Date();
      monthDate.setMonth(monthDate.getMonth() - (11 - index));

      const monthCount = acceptedSubmissions.filter((submission) => {
        const submissionDate = new Date(submission.createdAt);
        return submissionDate.getFullYear() === monthDate.getFullYear() && submissionDate.getMonth() === monthDate.getMonth();
      }).length;

      return { label: monthDate.toLocaleDateString('en-US', { month: 'short' }), value: monthCount };
    });

    const submissionCountsByDay = submissions.reduce((accumulator, submission) => {
      const key = toDateKey(submission.createdAt);
      accumulator.set(key, (accumulator.get(key) || 0) + 1);
      return accumulator;
    }, new Map());

    const startDate = addDays(new Date(), -363);
    const heatmapDays = Array.from({ length: 364 }, (_, index) => {
      const currentDate = addDays(startDate, index);
      return {
        date: currentDate,
        count: submissionCountsByDay.get(toDateKey(currentDate)) || 0,
      };
    });

    let streak = 0;
    let maxStreak = 0;
    for (const day of heatmapDays) {
      if (day.count > 0) {
        streak += 1;
        maxStreak = Math.max(maxStreak, streak);
      } else {
        streak = 0;
      }
    }

    const languageCounts = submissions.reduce((accumulator, submission) => {
      const language = submission.language || 'unknown';
      accumulator.set(language, (accumulator.get(language) || 0) + 1);
      return accumulator;
    }, new Map());

    const preferredLanguages = Array.from(languageCounts.entries())
      .sort((left, right) => right[1] - left[1])
      .slice(0, 4)
      .map(([language, count]) => ({ language, count }));

    const recentActivity = [...submissions]
      .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt))
      .slice(0, 6);

    const topLeaderboardUser = leaderboard.find((entry) => entry._id === authUser?._id);
    const rankFromLeaderboard = topLeaderboardUser ? leaderboard.findIndex((entry) => entry._id === authUser?._id) + 1 : (profileUser?.globalRank || 0);
    const totalUsers = leaderboard.length || 1;
    const topPercent = rankFromLeaderboard ? ((rankFromLeaderboard / totalUsers) * 100).toFixed(2) : '0.00';

    return {
      solvedCount,
      acceptedRate,
      totalSubmissions,
      difficultySummary,
      totalProblemCount,
      ringSegments,
      ringRadius,
      monthlyActivity,
      heatmapDays,
      preferredLanguages,
      recentActivity,
      topPercent,
      maxStreak,
      activeDays: new Set(submissions.map((submission) => toDateKey(submission.createdAt))).size,
    };
  }, [allProblems, authUser?._id, leaderboard, profileUser, solvedProblems, submissions]);

  const handleCopyProfileLink = async () => {
    const shareUrl = `${window.location.origin}/profile/${profileUser?._id || ''}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setError('Unable to copy profile link.');
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const maxFileSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxFileSize) {
      setError('Image too large. Please upload an image smaller than 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setForm((current) => ({ ...current, profilePicture: reader.result || '' }));
      setError('');
    };
    reader.readAsDataURL(file);
  };

  const handleProfileSave = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      const { data } = await axiosClient.put('/user/profile', form);
      const updatedUser = data?.user || null;

      setProfileUser(updatedUser);
      setForm({
        firstName: updatedUser?.firstName || '',
        lastName: updatedUser?.lastName || '',
        bio: updatedUser?.bio || '',
        githubLink: updatedUser?.githubLink || '',
        linkedinLink: updatedUser?.linkedinLink || '',
        profilePicture: updatedUser?.profilePicture || '',
      });

      dispatch(setAuthUser({ ...authUser, ...updatedUser }));
      setEditOpen(false);
      setError('');
    } catch (saveError) {
      const backendMessage =
        saveError?.response?.data?.message ||
        saveError?.response?.data?.error ||
        saveError?.message;
      setError(backendMessage || 'Unable to save profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleFollow = async (targetUserId) => {
    try {
      setFollowingBusyId(targetUserId);
      const { data } = await axiosClient.post(`/user/follow/${targetUserId}`);
      const updatedTarget = data?.user || null;

      if (updatedTarget && updatedTarget._id === profileUser?._id) {
        setProfileUser(updatedTarget);
      }

      setLeaderboard((current) => {
        const next = [...current];
        const index = next.findIndex((entry) => entry._id === targetUserId);
        if (index >= 0 && updatedTarget) {
          next[index] = { ...next[index], followersCount: updatedTarget.followersCount, followingCount: updatedTarget.followingCount };
        }
        return next;
      });
    } catch (followError) {
      setError(followError?.response?.data?.message || 'Unable to update follow state.');
    } finally {
      setFollowingBusyId('');
    }
  };

  const profileImage = profileUser?.profilePicture || '';
  const displayName = [profileUser?.firstName, profileUser?.lastName].filter(Boolean).join(' ').trim() || 'User';
  const handleName = handleFromUser(profileUser);
  const githubUrl = profileUser?.githubLink || '';
  const linkedinUrl = profileUser?.linkedinLink || '';

  const bgCard = 'rounded-4xl border border-white/10 bg-white/3 shadow-2xl shadow-black/20 backdrop-blur-xl';

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#080808] text-white">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-cyan-500/20 border-t-cyan-400" />
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6 text-center text-slate-300">
        <div>
          <p className="text-2xl font-black text-white">Profile unavailable</p>
          <button onClick={() => navigate('/')} className="mt-4 rounded-2xl bg-cyan-500 px-4 py-2 font-semibold text-black">
            Go home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden px-4 pb-16 pt-24 text-white sm:px-6">
      <div className="pointer-events-none absolute right-0 top-0 h-112 w-md rounded-full bg-cyan-500/10 blur-[120px]" />
      <div className="pointer-events-none absolute left-0 top-1/3 h-72 w-72 rounded-full bg-purple-600/10 blur-[120px]" />

      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        {error ? <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</div> : null}

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[0.95fr_1.55fr]">
          <section className={`${bgCard} p-6 sm:p-8`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="relative">
                  <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-3xl border border-cyan-400/25 bg-linear-to-br from-cyan-400 via-emerald-400 to-purple-500 p-0.5">
                    {profileImage ? (
                      <img src={profileImage} alt={displayName} className="h-full w-full rounded-[1.35rem] object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center rounded-[1.35rem] bg-[#0b0b0b] text-3xl font-black tracking-tight text-white">
                        {avatarFallback(displayName)}
                      </div>
                    )}
                  </div>
                  <div className="absolute -bottom-2 -right-2 rounded-full border border-emerald-400/30 bg-emerald-400/15 p-2 text-emerald-300">
                    <Sparkles size={16} />
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.35em] text-slate-500">{profileUser?.role || 'member'} profile</p>
                  <h1 className="mt-2 text-3xl font-black tracking-tight text-white">{displayName}</h1>
                  <p className="mt-1 text-2xl font-semibold text-slate-300">{handleName}</p>
                  <p className="mt-4 text-4xl font-black tracking-tight text-white">{profileUser?.globalRank ? `Rank ${formatCompact(profileUser.globalRank)}` : 'Unranked'}</p>
                  <div className="mt-4 flex items-center gap-3 text-2xl text-slate-300">
                    <span>{formatCompact(profileUser?.followingCount || 0)} Following</span>
                    <span className="text-slate-600">|</span>
                    <span>{formatCompact(profileUser?.followersCount || 0)} Followers</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                {isOwnProfile ? (
                  <button onClick={() => setEditOpen(true)} className="rounded-2xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-emerald-400">
                    <Pencil size={16} className="inline-block" /> Edit Profile
                  </button>
                ) : (
                  <button
                    disabled={followingBusyId === profileUser?._id}
                    onClick={() => handleToggleFollow(profileUser._id)}
                    className="rounded-2xl bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {followingBusyId === profileUser?._id
                      ? 'Updating...'
                      : (
                          <>
                            {profileUser?.isFollowing ? <UserCheck size={16} className="inline-block" /> : <UserPlus size={16} className="inline-block" />} {profileUser?.isFollowing ? 'Following' : 'Follow'}
                          </>
                        )}
                  </button>
                )}
                <button onClick={handleCopyProfileLink} className="rounded-2xl border border-white/10 bg-black/20 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-cyan-400/30 hover:text-cyan-300">
                  <ClipboardCopy size={16} className="inline-block" /> {copied ? 'Copied' : 'Profile Link'}
                </button>
              </div>
            </div>

            <p className="mt-5 max-w-xl text-sm leading-6 text-slate-400">
              {profileUser?.bio || 'Add a short bio, GitHub, and LinkedIn to make your profile easier to share and follow.'}
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: 'Solved', value: computed.solvedCount, icon: Code2 },
                { label: 'Accepted', value: `${computed.acceptedRate}%`, icon: Check },
                { label: 'Streak', value: `${profileUser?.streak || 0}d`, icon: Flame },
                { label: 'XP', value: formatCompact(profileUser?.xp || 0), icon: Award },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <item.icon size={16} className="text-cyan-300" />
                  <p className="mt-3 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">{item.label}</p>
                  <p className="mt-2 text-2xl font-black text-white">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              {githubUrl ? (
                <a href={githubUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-black/20 px-4 py-2 text-sm text-slate-200 transition hover:border-cyan-400/30 hover:text-cyan-300">
                  <Github size={16} /> GitHub <ExternalLink size={14} />
                </a>
              ) : null}
              {linkedinUrl ? (
                <a href={linkedinUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-black/20 px-4 py-2 text-sm text-slate-200 transition hover:border-cyan-400/30 hover:text-cyan-300">
                  <Linkedin size={16} /> LinkedIn <ExternalLink size={14} />
                </a>
              ) : null}
            </div>

          </section>

          <section className={`${bgCard} p-6 sm:p-8`}>
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.35em] text-slate-500">Performance</p>
                <h2 className="mt-2 text-2xl font-black text-white">Contest-style profile stats</h2>
              </div>
              <button onClick={() => navigate('/leaderboard')} className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-xs text-slate-300 transition hover:border-cyan-400/30 hover:text-cyan-300">
                Leaderboard <ChevronRight size={14} className="inline-block" />
              </button>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
              {[
                { label: 'Contest Rating', value: profileUser?.xp || 0, icon: Trophy, color: 'text-cyan-300' },
                { label: 'Global Rank', value: profileUser?.globalRank ? `#${profileUser.globalRank}` : 'N/A', icon: Target, color: 'text-fuchsia-300' },
                { label: 'Accepted', value: computed.acceptedRate ? `${computed.acceptedRate}%` : '0%', icon: Check, color: 'text-emerald-300' },
                { label: 'Solved', value: computed.solvedCount, icon: Code2, color: 'text-amber-300' },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <item.icon size={18} className={item.color} />
                  <p className="mt-3 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">{item.label}</p>
                  <p className="mt-2 text-3xl font-black text-white">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 grid gap-6">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.35em] text-slate-500">Difficulty breakdown</p>
                    <h3 className="mt-2 text-lg font-black text-white">Solved problems by level</h3>
                  </div>
                  <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">{computed.solvedCount}/{computed.totalProblemCount || 0}</div>
                </div>

                <div className="grid items-center gap-5 md:grid-cols-[1fr_0.82fr]">
                  <div className="relative mx-auto mt-2 flex h-64 w-64 items-center justify-center">
                    <svg viewBox="0 0 220 220" className="h-full w-full -rotate-90">
                      <circle cx="110" cy="110" r={computed.ringRadius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="18" />
                      {computed.ringSegments.map((segment) => (
                        <circle
                          key={segment.key}
                          cx="110"
                          cy="110"
                          r={computed.ringRadius}
                          fill="none"
                          stroke={segment.color}
                          strokeWidth="18"
                          strokeLinecap="round"
                          strokeDasharray={segment.dashArray}
                          strokeDashoffset={segment.dashOffset}
                        />
                      ))}
                    </svg>

                    <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
                      <p className="text-5xl font-black leading-none text-white">{computed.solvedCount}</p>
                      <p className="mt-1 text-sm text-slate-300">/ {computed.totalProblemCount || 0}</p>
                      <p className="mt-2 text-[11px] font-black uppercase tracking-[0.25em] text-emerald-300">Solved</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {computed.difficultySummary.map((item) => (
                      <div key={item.key} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                        <p className="text-3xl font-black leading-none" style={{ color: item.color }}>{item.name}</p>
                        <p className="mt-2 text-2xl font-black text-white">{item.solved}/{item.total}</p>
                        <p className="mt-1 text-xs text-slate-400">{item.solvedPercent}% solved</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl border border-white/10 bg-white/5 p-2 text-cyan-300">
                      <Clock3 size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.35em] text-slate-500">Contribution graph</p>
                      <h3 className="mt-1 text-lg font-black text-white">{formatCompact(computed.totalSubmissions)} submissions in the past one year</h3>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-5 text-sm text-slate-300">
                    <p>Total active days: <span className="font-black text-white">{computed.activeDays}</span></p>
                    <p>Max streak: <span className="font-black text-white">{computed.maxStreak}</span></p>
                  </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-black/30 p-3 sm:p-4">
                  <div className="grid grid-cols-52 grid-rows-7 gap-1">
                    {computed.heatmapDays.map((day) => {
                      const palette = ['bg-white/5', 'bg-emerald-500/20', 'bg-emerald-500/40', 'bg-emerald-500/70', 'bg-emerald-300'];
                      const intensity = day.count === 0 ? 0 : day.count === 1 ? 1 : day.count === 2 ? 2 : day.count === 3 ? 3 : 4;

                      return (
                        <div
                          key={day.date.toISOString()}
                          title={`${formatDate(day.date)}: ${day.count} submissions`}
                          onMouseEnter={() => setHoveredDay(day)}
                          onMouseLeave={() => setHoveredDay(null)}
                          className={`aspect-square w-full rounded-sm border border-white/5 ${palette[intensity]}`}
                        />
                      );
                    })}
                  </div>

                  <div className="mt-3 grid grid-cols-12 text-center text-xs text-slate-500 sm:text-sm">
                    {computed.monthlyActivity.map((month) => (
                      <span key={month.label}>{month.label}</span>
                    ))}
                  </div>

                  <div className="mt-3 rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-xs text-slate-300 sm:text-sm">
                    {hoveredDay
                      ? `${formatDate(hoveredDay.date)}: ${hoveredDay.count} submissions`
                      : 'Hover a square to see submissions for that day.'}
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                  <span>Less</span>
                  {['bg-white/5', 'bg-emerald-500/20', 'bg-emerald-500/40', 'bg-emerald-500/70', 'bg-emerald-300'].map((shade) => (
                    <span key={shade} className={`h-3 w-3 rounded-sm border border-white/5 ${shade}`} />
                  ))}
                  <span>More</span>
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-4">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Streak</p>
                <p className="mt-2 text-2xl font-black text-white">{profileUser?.streak || 0}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Top %</p>
                <p className="mt-2 text-2xl font-black text-white">{computed.topPercent}%</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Active Days</p>
                <p className="mt-2 text-2xl font-black text-white">{computed.activeDays}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Joined</p>
                <p className="mt-2 text-sm font-semibold text-white">{formatDate(profileUser?.createdAt)}</p>
              </div>
            </div>
          </section>
        </div>

        {isOwnProfile && (
          <section className={`${bgCard} p-6 sm:p-8`}>
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.35em] text-slate-500">Recent activity</p>
                <h2 className="mt-2 text-2xl font-black text-white">Latest submissions</h2>
              </div>
              <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">{computed.preferredLanguages[0]?.language || 'No language data'}</div>
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              {computed.recentActivity.length > 0 ? computed.recentActivity.map((submission) => (
                <div key={submission._id} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">{submission.problemTitle}</p>
                      <h3 className="mt-2 text-lg font-black text-white">{submission.problemDifficulty || 'problem'}</h3>
                      <p className="mt-2 text-xs text-slate-500">{formatDate(submission.createdAt)}</p>
                    </div>
                    <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.24em] text-emerald-300">
                      {submission.status}
                    </span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2 text-[10px] text-slate-400">
                    <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1">{submission.language || 'unknown'}</span>
                    <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1">{submission.testCasesPassed || 0}/{submission.testCasesTotal || 0}</span>
                    <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1">{submission.runtime || 0}s</span>
                    <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1">{submission.memory || 0}kB</span>
                  </div>
                </div>
              )) : (
                <div className="rounded-2xl border border-dashed border-white/10 bg-black/20 p-8 text-sm text-slate-500">No recent submissions yet.</div>
              )}
            </div>
          </section>
        )}
      </div>

      {editOpen && isOwnProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-4xl border border-white/10 bg-[#0b0b0b] p-6 shadow-2xl shadow-black/40 sm:p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.35em] text-slate-500">Edit profile</p>
                <h2 className="mt-2 text-2xl font-black text-white">Update your details</h2>
              </div>
              <button onClick={() => setEditOpen(false)} className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-300 transition hover:text-white">
                Close
              </button>
            </div>

            <form onSubmit={handleProfileSave} className="mt-6 grid gap-4 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-xs font-black uppercase tracking-[0.24em] text-slate-500">First name</span>
                <input value={form.firstName} onChange={(event) => setForm((current) => ({ ...current, firstName: event.target.value }))} className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-cyan-400" />
              </label>

              <label className="space-y-2">
                <span className="text-xs font-black uppercase tracking-[0.24em] text-slate-500">Last name</span>
                <input value={form.lastName} onChange={(event) => setForm((current) => ({ ...current, lastName: event.target.value }))} className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-cyan-400" />
              </label>

              <label className="space-y-2 md:col-span-2">
                <span className="text-xs font-black uppercase tracking-[0.24em] text-slate-500">Bio</span>
                <textarea rows="3" value={form.bio} onChange={(event) => setForm((current) => ({ ...current, bio: event.target.value }))} className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-cyan-400" />
              </label>

              <label className="space-y-2 md:col-span-2">
                <span className="text-xs font-black uppercase tracking-[0.24em] text-slate-500">Profile picture</span>
                <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-black/40 p-4">
                  <input value={form.profilePicture} onChange={(event) => setForm((current) => ({ ...current, profilePicture: event.target.value }))} placeholder="Image URL or uploaded image data" className="w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-white outline-none focus:border-cyan-400" />
                  <div className="flex items-center gap-3">
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10">
                      <Upload size={16} /> Upload image
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                    </label>
                    {form.profilePicture ? <button type="button" onClick={() => setForm((current) => ({ ...current, profilePicture: '' }))} className="rounded-2xl border border-white/10 px-4 py-2 text-sm text-slate-300 transition hover:border-rose-500/30 hover:text-rose-300">Clear</button> : null}
                  </div>
                </div>
              </label>

              <label className="space-y-2 md:col-span-2">
                <span className="text-xs font-black uppercase tracking-[0.24em] text-slate-500">GitHub link</span>
                <input value={form.githubLink} onChange={(event) => setForm((current) => ({ ...current, githubLink: event.target.value }))} placeholder="https://github.com/yourname" className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-cyan-400" />
              </label>

              <label className="space-y-2 md:col-span-2">
                <span className="text-xs font-black uppercase tracking-[0.24em] text-slate-500">LinkedIn link</span>
                <input value={form.linkedinLink} onChange={(event) => setForm((current) => ({ ...current, linkedinLink: event.target.value }))} placeholder="https://linkedin.com/in/yourname" className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-cyan-400" />
              </label>

              <div className="md:col-span-2 mt-2 flex items-center justify-end gap-3">
                <button type="button" onClick={() => setEditOpen(false)} className="rounded-2xl border border-white/10 px-4 py-3 text-sm text-slate-300 transition hover:border-white/20 hover:text-white">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="rounded-2xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-black transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60">
                  <Save size={16} className="inline-block" /> {saving ? 'Saving...' : 'Save changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
