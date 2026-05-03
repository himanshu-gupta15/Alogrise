import React, { useEffect, useMemo, useState } from "react";
import { CalendarDays, Timer, Users, Flag } from "lucide-react";
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
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [joiningId, setJoiningId] = useState("");
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const { data } = await axiosClient.get("/contest/all");
        setContests(data || []);
      } catch (error) {
        console.error("Failed to fetch contests", error);
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
    if (activeFilter === "all") return contests;
    return contests.filter((contest) => contest.status === activeFilter);
  }, [activeFilter, contests]);

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
    } catch (error) {
      console.error("Unable to join contest", error);
    } finally {
      setJoiningId("");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-cyan-500/20 border-t-cyan-500"></div>
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

        <div className="mb-8 flex flex-wrap gap-2">
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
              {item}
            </button>
          ))}
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

              return (
              <div key={contest._id} className="glass-panel relative rounded-3xl p-6">
                {targetTime && diff !== null && diff > 0 && (
                  <div className="absolute right-4 top-4 flex items-center gap-2 rounded-full bg-black/40 border border-white/10 px-3 py-1 text-xs font-bold text-white">
                    <Timer size={14} />
                    <span>{formatRemaining(diff)}</span>
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

                <h3 className="mb-2 text-xl font-black">{contest.title}</h3>
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
                    <p className="flex items-center gap-2 text-slate-300">
                      <Users size={15} className="text-emerald-300" />
                      {contest.participantCount}/{contest.maxParticipants} participants
                    </p>
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
