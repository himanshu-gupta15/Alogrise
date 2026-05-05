import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarDays, Timer, Users, Flag, Search, Trophy, Sparkles, X } from "lucide-react";
import axiosClient from "../utils/axiosClient";

const filters = ["all", "live", "upcoming", "ended"];

const statusStyle = {
  live: "text-emerald-300 border-emerald-400/40 bg-emerald-500/10",
  upcoming: "text-cyan-300 border-cyan-400/40 bg-cyan-500/10",
  ended: "text-slate-300 border-white/20 bg-white/5",
};

const formatDate = (dateValue) => {
  const date = new Date(dateValue);
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const Contest = () => {
  const navigate = useNavigate();
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("soonest");
  const [joiningId, setJoiningId] = useState("");
  const [startingVirtualId, setStartingVirtualId] = useState("");
  const [notice, setNotice] = useState(null);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const { data } = await axiosClient.get("/contest/all");
        setContests(data || []);
      } catch (error) {
        console.error("Failed to fetch contests", error);
        setNotice({ type: "error", message: "Could not load contests. Please refresh." });
      } finally {
        setLoading(false);
      }
    };

    fetchContests();
  }, []);

  // Tick every second so countdowns update
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(null), 3500);
    return () => clearTimeout(timer);
  }, [notice]);

  const formatRemaining = (ms) => {
    if (ms <= 0) return "00:00:00";
    const totalSeconds = Math.floor(ms / 1000);
    const days = Math.floor(totalSeconds / (24 * 3600));
    const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const two = (v) => String(v).padStart(2, "0");
    if (days > 0) return `${days}d ${two(hours)}:${two(minutes)}:${two(seconds)}`;
    return `${two(hours)}:${two(minutes)}:${two(seconds)}`;
  };

  const visibleContests = useMemo(() => {
    let result = contests;

    if (activeFilter !== "all") {
      result = result.filter((contest) => contest.status === activeFilter);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (contest) =>
          contest.title?.toLowerCase().includes(query) ||
          contest.description?.toLowerCase().includes(query)
      );
    }

    const sorted = [...result].sort((a, b) => {
      if (sortBy === "latest") return new Date(b.startTime) - new Date(a.startTime);
      if (sortBy === "participants") return (b.participantCount || 0) - (a.participantCount || 0);
      if (sortBy === "problems") return (b.problemCount || 0) - (a.problemCount || 0);
      return new Date(a.startTime) - new Date(b.startTime);
    });

    return sorted;
  }, [activeFilter, contests, searchQuery, sortBy]);

  const filterCounts = useMemo(() => {
    return contests.reduce(
      (acc, contest) => {
        acc.all += 1;
        if (contest.status === "live") acc.live += 1;
        if (contest.status === "upcoming") acc.upcoming += 1;
        if (contest.status === "ended") acc.ended += 1;
        return acc;
      },
      { all: 0, live: 0, upcoming: 0, ended: 0 }
    );
  }, [contests]);

  const summary = useMemo(() => {
    const joined = contests.filter((contest) => contest.joined).length;
    const virtualReady = contests.filter((contest) => contest.canStartVirtual).length;
    return {
      joined,
      virtualReady,
      live: filterCounts.live,
      upcoming: filterCounts.upcoming,
    };
  }, [contests, filterCounts]);

  const handleJoin = async (contestId) => {
    try {
      setJoiningId(contestId);
      await axiosClient.post(`/contest/join/${contestId}`);

      setContests((prev) =>
        prev.map((contest) =>
          contest._id === contestId
            ? {
                ...contest,
                joined: true,
                participantCount: (contest.participantCount || 0) + (contest.joined ? 0 : 1),
              }
            : contest
        )
      );

      setNotice({ type: "success", message: "Successfully joined the contest." });
    } catch (error) {
      console.error("Unable to join contest", error);
      setNotice({
        type: "error",
        message: error?.response?.data || "Unable to join this contest right now.",
      });
    } finally {
      setJoiningId("");
    }
  };

  const handleVirtualStart = async (contestId) => {
    try {
      setStartingVirtualId(contestId);
      const { data } = await axiosClient.post(`/contest/virtual/${contestId}`);

      if (data?.virtualContest) {
        localStorage.setItem(
          `virtualContest:${contestId}`,
          JSON.stringify(data.virtualContest)
        );
      }

      setNotice({ type: "success", message: "Virtual contest started. Redirecting to practice..." });

      navigate("/Practice");
    } catch (error) {
      console.error("Unable to start virtual contest", error);
      setNotice({
        type: "error",
        message: error?.response?.data || "Unable to start virtual contest right now.",
      });
    } finally {
      setStartingVirtualId("");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen px-6 pb-20 pt-16 text-white lg:px-8">
        <div className="mx-auto max-w-7xl animate-pulse">
          <div className="mb-8 h-8 w-70 rounded-xl bg-white/10"></div>
          <div className="mb-10 h-5 w-120 max-w-full rounded-xl bg-white/5"></div>
          <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[...Array(4)].map((_, idx) => (
              <div key={idx} className="h-26 rounded-2xl border border-white/10 bg-white/5"></div>
            ))}
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {[...Array(6)].map((_, idx) => (
              <div key={idx} className="h-72 rounded-3xl border border-white/10 bg-white/5"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden px-6 pb-20 pt-16 text-white lg:px-8">
      <div className="pointer-events-none absolute left-1/2 top-0 h-125 w-125 -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[140px]"></div>

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <div className="mb-10">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">Contest Arena</p>
          <h1 className="mb-4 text-4xl font-black md:text-5xl">Compete. Learn. Climb.</h1>
          <p className="max-w-2xl text-slate-400">
            Join timed contests, solve curated problems, and improve your ranking with every challenge.
          </p>
        </div>

        {notice && (
          <div
            className={`mb-6 flex items-center justify-between rounded-2xl border px-4 py-3 text-sm ${
              notice.type === "success"
                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-200"
                : "border-rose-500/40 bg-rose-500/10 text-rose-200"
            }`}
          >
            <span>{notice.message}</span>
            <button onClick={() => setNotice(null)} className="ml-3 rounded-lg p-1 hover:bg-black/20">
              <X size={14} />
            </button>
          </div>
        )}

        <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4">
            <p className="text-xs uppercase tracking-wider text-emerald-300">Live Now</p>
            <p className="mt-2 text-3xl font-black">{summary.live}</p>
          </div>
          <div className="rounded-2xl border border-cyan-400/20 bg-cyan-500/10 p-4">
            <p className="text-xs uppercase tracking-wider text-cyan-300">Upcoming</p>
            <p className="mt-2 text-3xl font-black">{summary.upcoming}</p>
          </div>
          <div className="rounded-2xl border border-purple-400/20 bg-purple-500/10 p-4">
            <p className="text-xs uppercase tracking-wider text-purple-300">Virtual Ready</p>
            <p className="mt-2 text-3xl font-black">{summary.virtualReady}</p>
          </div>
          <div className="rounded-2xl border border-amber-400/20 bg-amber-500/10 p-4">
            <p className="text-xs uppercase tracking-wider text-amber-300">Joined</p>
            <p className="mt-2 text-3xl font-black">{summary.joined}</p>
          </div>
        </div>

        <div className="mb-8 rounded-2xl border border-white/10 bg-slate-900/50 p-4">
          <div className="mb-4 flex flex-wrap gap-2">
            {filters.map((item) => (
              <button
                key={item}
                onClick={() => setActiveFilter(item)}
                className={`rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-widest transition ${
                  activeFilter === item
                    ? "border-cyan-400/70 bg-cyan-500/15 text-cyan-200"
                    : "border-white/10 bg-slate-900/70 text-slate-300 hover:border-cyan-500/40"
                }`}
              >
                {item} <span className="ml-2 rounded-full bg-black/30 px-2 py-0.5">{filterCounts[item]}</span>
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-3 md:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by contest title or description"
                className="w-full rounded-xl border border-white/10 bg-black/30 py-2.5 pl-9 pr-3 text-sm text-white outline-none transition focus:border-cyan-400/60"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-slate-200 outline-none transition focus:border-cyan-400/60"
            >
              <option value="soonest">Sort: Start Time (Soonest)</option>
              <option value="latest">Sort: Start Time (Latest)</option>
              <option value="participants">Sort: Participants</option>
              <option value="problems">Sort: Problem Count</option>
            </select>
          </div>
        </div>

        {visibleContests.length === 0 ? (
          <div className="glass-panel rounded-3xl p-10 text-center">
            <h3 className="text-2xl font-black">No contests in this category</h3>
            <p className="mt-2 text-sm text-slate-400">Check another filter or come back soon for upcoming events.</p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {visibleContests.map((contest) => {
              const targetTime = contest.status === 'upcoming' ? new Date(contest.startTime).getTime() : contest.status === 'live' ? new Date(contest.endTime).getTime() : null;
              const diff = targetTime ? targetTime - now : null;
              const seats = Math.max(0, contest.maxParticipants || 0);
              const participants = Math.max(0, contest.participantCount || 0);
              const seatPercent = seats > 0 ? Math.min(100, Math.round((participants / seats) * 100)) : 0;

              return (
              <div key={contest._id} className="glass-panel group relative rounded-3xl p-6 transition duration-300 hover:-translate-y-1 hover:border-cyan-500/30">
                {targetTime && diff !== null && diff > 0 && (
                  <div className="absolute right-4 top-4 flex items-center gap-2 rounded-full bg-black/40 border border-white/10 px-3 py-1 text-xs font-bold text-white">
                    <Timer size={14} />
                    <span>{contest.status === "upcoming" ? "Starts in" : "Ends in"} {formatRemaining(diff)}</span>
                  </div>
                )}
                <div className="mb-4 flex items-center justify-between gap-3">
                  <span
                    className={`rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${
                      statusStyle[contest.status]
                    }`}
                  >
                    {contest.status}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <Flag size={14} />
                    {contest.problemCount} Problems
                  </div>
                </div>

                <h3 className="mb-2 text-xl font-black group-hover:text-cyan-300 transition">{contest.title}</h3>
                <p className="mb-5 text-sm leading-relaxed text-slate-400">{contest.description}</p>

                <div className="space-y-2 rounded-2xl border border-white/10 bg-slate-900/60 p-4 text-sm">
                  <p className="flex items-center gap-2 text-slate-300">
                    <CalendarDays size={15} className="text-cyan-300" />
                    Starts: {formatDate(contest.startTime)}
                  </p>
                  <p className="flex items-center gap-2 text-slate-300">
                    <Timer size={15} className="text-purple-300" />
                    Ends: {formatDate(contest.endTime)}
                  </p>
                  {contest.participantCount > 0 && contest.maxParticipants > 0 && (
                    <>
                      <p className="flex items-center gap-2 text-slate-300">
                        <Users size={15} className="text-emerald-300" />
                        {contest.participantCount}/{contest.maxParticipants} participants
                      </p>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-emerald-400 transition-all duration-500"
                          style={{ width: `${seatPercent}%` }}
                        ></div>
                      </div>
                    </>
                  )}
                </div>

                <button
                  disabled={contest.joined || contest.status !== "live" || joiningId === contest._id}
                  onClick={() => handleJoin(contest._id)}
                  className={`mt-5 w-full rounded-xl px-4 py-3 text-xs font-black uppercase tracking-widest transition ${
                    contest.joined
                      ? "cursor-not-allowed border border-emerald-400/30 bg-emerald-500/10 text-emerald-300"
                      : contest.status !== "live"
                      ? "cursor-not-allowed border border-white/10 bg-white/5 text-slate-500"
                      : "bg-cyan-500 text-black hover:bg-cyan-400"
                  }`}
                >
                  {contest.joined ? "Joined" : joiningId === contest._id ? "Joining..." : "Join Contest"}
                </button>

                {contest.canStartVirtual && (
                  <button
                    disabled={startingVirtualId === contest._id}
                    onClick={() => handleVirtualStart(contest._id)}
                    className="mt-3 w-full rounded-xl border border-purple-400/30 bg-purple-500/10 px-4 py-3 text-xs font-black uppercase tracking-widest text-purple-200 transition hover:bg-purple-500/20 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {startingVirtualId === contest._id ? "Starting..." : "Start Virtual Contest"}
                  </button>
                )}

                <button
                  onClick={() => navigate("/Practice")}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-black uppercase tracking-widest text-slate-300 transition hover:border-cyan-400/30 hover:text-cyan-200"
                >
                  <Sparkles size={14} /> Practice Problems
                </button>

                {contest.joined && (
                  <div className="mt-3 flex items-center gap-2 text-xs text-emerald-300">
                    <Trophy size={14} /> You are participating in this contest.
                  </div>
                )}
              </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Contest;
