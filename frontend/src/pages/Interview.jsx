import React, { useEffect, useMemo, useState } from "react";
import { Building2, CircleDot, ClipboardList, Search, ShieldCheck, Sparkles, Users, Lock } from "lucide-react";
import axiosClient from "../utils/axiosClient";

const mockTracks = [
  {
    id: "oa",
    type: "online",
    title: "Online Assessment",
    description: "Random question set from a collection of real company patterns.",
    attempted: 1773801,
    successRate: 36.61,
    sets: 20,
  },
  {
    id: "phone",
    type: "phone",
    title: "Phone Interview",
    description: "Timed interview simulation with medium to hard coding rounds.",
    attempted: 628607,
    successRate: 43.11,
    sets: 18,
  },
  {
    id: "onsite",
    type: "onsite",
    title: "Onsite Interview",
    description: "Comprehensive rounds with strong DSA and communication pressure.",
    attempted: 423406,
    successRate: 29.73,
    sets: 16,
  },
];

const formatNum = (value) =>
  new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(value || 0);

const tabs = [
  { label: "All", value: "all" },
  { label: "Online", value: "online" },
  { label: "Phone", value: "phone" },
  { label: "Onsite", value: "onsite" },
];

function Interview() {
  const [activeTab, setActiveTab] = useState("all");
  const [query, setQuery] = useState("");
  const [checkoutLoading, setCheckoutLoading] = useState("");
  const [companyTracks, setCompanyTracks] = useState([]);
  const [loadingPacks, setLoadingPacks] = useState(true);

  useEffect(() => {
    const fetchPacks = async () => {
      try {
        const { data } = await axiosClient.get("/interview/packs");
        setCompanyTracks(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to load interview packs", error);
      } finally {
        setLoadingPacks(false);
      }
    };

    fetchPacks();
  }, []);

  const filteredCompanies = useMemo(() => {
    const q = query.trim().toLowerCase();
    return companyTracks.filter((item) => {
      const tabOk = activeTab === "all" || item.type === activeTab;
      const searchOk =
        !q ||
        item.company.toLowerCase().includes(q) ||
        item.role.toLowerCase().includes(q);
      return tabOk && searchOk;
    });
  }, [activeTab, query]);

  const dynamicMockTracks = useMemo(() => {
    if (!companyTracks.length) return mockTracks;

    const groups = {
      online: { id: "oa", type: "online", title: "Online Assessment", description: "Random question set from a collection of real company patterns.", attempted: 0, successRate: 0, sets: 0, _count: 0 },
      phone: { id: "phone", type: "phone", title: "Phone Interview", description: "Timed interview simulation with medium to hard coding rounds.", attempted: 0, successRate: 0, sets: 0, _count: 0 },
      onsite: { id: "onsite", type: "onsite", title: "Onsite Interview", description: "Comprehensive rounds with strong DSA and communication pressure.", attempted: 0, successRate: 0, sets: 0, _count: 0 },
    };

    companyTracks.forEach((pack) => {
      const bucket = groups[pack.type];
      if (!bucket) return;
      bucket.attempted += Number(pack.attempted || 0);
      bucket.successRate += Number(pack.successRate || 0);
      bucket.sets += Number(pack.sets || 0);
      bucket._count += 1;
    });

    return Object.values(groups).map((item) => ({
      ...item,
      successRate: item._count ? Number((item.successRate / item._count).toFixed(2)) : 0,
    }));
  }, [companyTracks]);

  const totalAttempts = useMemo(
    () => dynamicMockTracks.reduce((acc, item) => acc + Number(item.attempted || 0), 0),
    [dynamicMockTracks]
  );

  return (
    <div className="relative min-h-screen overflow-hidden pb-20 text-white">
      <div className="pointer-events-none absolute -top-16 left-1/3 h-96 w-96 rounded-full bg-cyan-500/10 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-20 right-0 h-96 w-96 rounded-full bg-purple-500/10 blur-[120px]" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pt-16 lg:px-8">
        <div className="mb-10">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">Interview Prep</p>
          <h1 className="text-4xl font-black md:text-5xl">Mock Assessment</h1>
          <p className="mt-4 max-w-3xl text-base text-slate-400 md:text-lg">
            Prepare yourself with structured interview simulations. Practice online assessment,
            phone rounds, and onsite sets inspired by real company interviews.
          </p>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-cyan-400/20 bg-cyan-500/10 p-4">
            <p className="text-xs uppercase tracking-widest text-cyan-300">Total Attempts</p>
            <p className="mt-2 text-2xl font-black">{formatNum(totalAttempts)}</p>
          </div>
          <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4">
            <p className="text-xs uppercase tracking-widest text-emerald-300">Interview Tracks</p>
            <p className="mt-2 text-2xl font-black">{dynamicMockTracks.length}</p>
          </div>
          <div className="rounded-2xl border border-purple-400/20 bg-purple-500/10 p-4">
            <p className="text-xs uppercase tracking-widest text-purple-300">Company Packs</p>
            <p className="mt-2 text-2xl font-black">{companyTracks.length}</p>
          </div>
        </div>

        <div className="mb-10 grid gap-5 lg:grid-cols-3">
          {dynamicMockTracks.map((track) => (
            <div key={track.id} className="glass-panel rounded-2xl border border-white/10 p-6 transition hover:border-cyan-400/30">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">{track.title}</p>
              <h3 className="mt-3 text-3xl font-black text-white">{track.sets} Sets</h3>
              <p className="mt-3 min-h-14 text-sm text-slate-400">{track.description}</p>

              <div className="mt-5 space-y-1 text-sm text-slate-300">
                <p className="flex items-center gap-2"><Users size={14} className="text-cyan-300" /> Attempted: {formatNum(track.attempted)} times</p>
                <p className="flex items-center gap-2"><ShieldCheck size={14} className="text-emerald-300" /> Success rate: {track.successRate}%</p>
              </div>

              <button className="mt-6 rounded-xl border border-amber-300/40 bg-amber-300/10 px-6 py-2 text-sm font-bold text-amber-200 transition hover:bg-amber-300/20">
                Start
              </button>
            </div>
          ))}
        </div>

        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`rounded-full border px-4 py-2 text-xs font-black uppercase tracking-widest transition ${
                  activeTab === tab.value
                    ? "border-cyan-400/70 bg-cyan-500/15 text-cyan-200"
                    : "border-white/10 bg-white/5 text-slate-300 hover:border-cyan-500/40"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-80">
            <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search company or round"
              className="w-full rounded-xl border border-white/10 bg-black/30 py-2.5 pl-9 pr-3 text-sm text-white outline-none transition focus:border-cyan-400/60"
            />
          </div>
        </div>

        {loadingPacks ? (
          <div className="glass-panel rounded-2xl p-8 text-center text-slate-400">
            Loading interview packs...
          </div>
        ) : filteredCompanies.length === 0 ? (
          <div className="glass-panel rounded-2xl p-8 text-center text-slate-400">
            No interview packs found for current filter.
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredCompanies.map((item) => (
              <div key={item.packId} className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 transition hover:border-cyan-400/30 hover:-translate-y-0.5">
                <div className="mb-4 flex items-center justify-between">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
                    <Building2 size={13} className="text-cyan-300" />
                    {item.company}
                  </div>
                    {item.isPremium ? (
                      <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-200">
                        Premium
                      </span>
                    ) : (
                      <span className="rounded-full border border-emerald-400/20 bg-emerald-500/8 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                        Free
                      </span>
                    )}
                </div>

                <h3 className="text-2xl font-black">{item.company}</h3>
                <p className="mt-1 text-slate-400">{item.role}</p>

                <div className="mt-5 space-y-2 text-sm text-slate-300">
                  <p className="flex items-center gap-2">
                    <ClipboardList size={14} className="text-cyan-300" /> Problem sets: {item.sets}
                  </p>
                  <p className="flex items-center gap-2">
                    <CircleDot size={14} className="text-purple-300" /> Attempted: {formatNum(item.attempted)} times
                  </p>
                  <p className="flex items-center gap-2">
                    <Sparkles size={14} className="text-emerald-300" /> Success rate: {item.successRate}%
                  </p>
                </div>

                {item.isPremium ? (
                  <button
                    disabled={checkoutLoading === item.packId}
                    onClick={async () => {
                      try {
                        setCheckoutLoading(item.packId);
                        const { data } = await axiosClient.post('/payment/create-checkout', { packId: item.packId });
                        if (data?.url) {
                          window.location.href = data.url;
                        }
                      } catch (err) {
                        console.error('Checkout error', err);
                        alert(err?.response?.data?.error || 'Unable to start payment flow');
                      } finally {
                        setCheckoutLoading("");
                      }
                    }}
                    className="mt-6 w-full rounded-xl border border-amber-300/40 bg-amber-300/10 px-4 py-2.5 text-sm font-black uppercase tracking-wider text-amber-200 transition hover:bg-amber-300/20 disabled:opacity-60"
                  >
                    {checkoutLoading === item.packId ? 'Processing...' : (
                      <>
                        <Lock size={14} className="inline-block mr-2" /> Buy & Start
                        <span className="ml-2 text-xs text-slate-300">${((item.priceInCents || 0) / 100).toFixed(2)}</span>
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      // free pack -> direct start (store pack and navigate)
                      localStorage.setItem('activePack', JSON.stringify({ id: item.packId, company: item.company, role: item.role }));
                      window.location.href = '/practice';
                    }}
                    className="mt-6 w-full rounded-xl bg-cyan-500 px-4 py-2.5 text-sm font-black uppercase tracking-wider text-black transition hover:bg-cyan-400"
                  >
                    Start Assessment
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Interview;
