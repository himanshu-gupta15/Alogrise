

import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axiosClient from '../utils/axiosClient';
import {
  CheckCircle2,
  Zap,
  Terminal,
  Search,
  LayoutList,
  Building2,
  Sparkles,
  X
} from 'lucide-react';

/* ================= COMPONENT ================= */

function ProblemPractice() {
  // Accessing user data from Redux state
  const { user } = useSelector((state) => state.auth);

  const [problems, setProblems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  const [filters, setFilters] = useState({
    difficulty: 'all',
    tag: 'all',
    status: 'all'
  });

  const [activePack, setActivePack] = useState(() => {
    const saved = localStorage.getItem('activePack');
    try {
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [purchaseNotice, setPurchaseNotice] = useState(null);

  const formatTags = (tags) => (Array.isArray(tags) ? tags.join(', ') : String(tags || ''));

  const hasTagMatch = (tags, query) => {
    if (!query || query === 'all') return true;
    if (Array.isArray(tags)) {
      return tags.some((tag) => String(tag).toLowerCase().includes(query.toLowerCase()));
    }
    return String(tags || '').toLowerCase().includes(query.toLowerCase());
  };

  // On mount, check for Stripe redirect params and confirm purchase with backend
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const success = params.get('checkout_success');
    const sessionId = params.get('session_id');
    const pack = params.get('pack');

    if (success && sessionId) {
      (async () => {
        try {
          setPurchaseNotice({ type: 'info', message: 'Verifying purchase...' });
          const { data } = await axiosClient.post('/payment/confirm', { sessionId });
          if (data?.purchase) {
            setPurchaseNotice({ type: 'success', message: 'Purchase successful. Pack unlocked.' });
            if (pack) {
              try {
                const { data: packsList } = await axiosClient.get('/interview/packs');
                const matchedPack = packsList.find(p => p.packId === pack);
                if (matchedPack) {
                  const active = { id: matchedPack.packId, company: matchedPack.company, role: matchedPack.role, problems: matchedPack.problems || [] };
                  localStorage.setItem('activePack', JSON.stringify(active));
                  setActivePack(active);
                }
              } catch (err) {
                console.error('Failed to auto-start purchased pack', err);
              }
            }
          } else {
            setPurchaseNotice({ type: 'error', message: data?.error || 'Purchase could not be confirmed.' });
          }
        } catch (err) {
          setPurchaseNotice({ type: 'error', message: err?.response?.data?.error || 'Purchase confirmation failed.' });
        } finally {
          // remove query params to keep UI clean
          try {
            const url = new URL(window.location.href);
            url.searchParams.delete('checkout_success');
            url.searchParams.delete('session_id');
            url.searchParams.delete('pack');
            window.history.replaceState({}, document.title, url.toString());
          } catch (e) {
            // ignore
          }
        }
      })();
    }
  }, []);

  /* ================= DATA FETCHING ================= */

  useEffect(() => {
    const fetchProblems = async () => {
      setLoading(true);
      try {
        // Fetching problems which now include the 'isSolved' boolean from the controller
        const { data } = await axiosClient.get('/problem/getAllProblem');
        setProblems(data);
      } catch (error) {
        console.error('Error fetching problems:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, [user]);

  /* ================= FILTERING LOGIC ================= */

  const filteredProblems = problems.filter((problem) => {
    if (activePack) {
      const packProblems = Array.isArray(activePack.problems) ? activePack.problems : [];
      if (packProblems.length > 0) {
        if (!packProblems.includes(problem._id)) return false;
      } else if (activePack.company) {
        // Fallback for legacy packs
        const pCompanies = Array.isArray(problem.companies) ? problem.companies : [];
        const hasCompany = pCompanies.some(c => c.toLowerCase() === activePack.company.toLowerCase());
        if (!hasCompany) return false;
      }
    }

    // 1. Difficulty Match
    const difficultyMatch =
      filters.difficulty === 'all' ||
      problem.difficulty.toLowerCase() === filters.difficulty.toLowerCase();

    // 2. Tag Match
    const tagMatch = hasTagMatch(problem.tags, filters.tag);

    // 3. Search Match
    const searchMatch = problem.title.toLowerCase().includes(searchTerm.toLowerCase());

    // 4. Status Match (Directly using isSolved from your updated controller)
    const statusMatch =
      filters.status === 'all' ||
      (filters.status === 'solved' ? problem.isSolved : !problem.isSolved);

    return difficultyMatch && tagMatch && statusMatch && searchMatch;
  });

  // Pagination derived values
  const totalProblems = filteredProblems.length;
  const totalPages = Math.max(1, Math.ceil(totalProblems / pageSize));

  // Keep current page valid when filters/search change
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
    if (currentPage < 1) setCurrentPage(1);
  }, [currentPage, totalPages]);

  const paginatedProblems = filteredProblems.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  /* ================= DYNAMIC STYLES ================= */

  const getDifficultyStyles = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
      case 'medium':
        return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
      case 'hard':
        return 'text-rose-400 border-rose-500/30 bg-rose-500/10';
      default:
        return 'text-slate-400 border-white/10 bg-white/5';
    }
  };

  /* ================= LOADING STATE ================= */

  if (loading) {
    return (
      <div className="h-screen bg-black flex flex-col justify-center items-center">
        <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
        <p className="mt-4 font-mono text-cyan-500 tracking-[0.28em] text-[10px] animate-pulse uppercase">Loading problems...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden pb-24 text-white selection:bg-cyan-500/30">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 h-200 w-200 rounded-full bg-cyan-500/5 blur-[150px] pointer-events-none animate-pulse"></div>

      <div className="container relative z-10 mx-auto px-6 pt-20">
        
        <div className="mb-16 animate-in fade-in slide-in-from-left duration-700">
          <div className="mb-4 flex items-center gap-2 font-mono text-sm tracking-[0.28em] text-cyan-400 uppercase">
             <LayoutList size={14} /> Problem Library
          </div>
          <h1 className="text-5xl font-black tracking-tight md:text-6xl">
            Practice with <span className="brand-gradient">clarity and focus</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base text-slate-400 md:text-lg">
            {user ? `${user.firstName}, choose a problem and improve one step at a time.` : 'Select a problem and start coding.'}
          </p>
        </div>

        {purchaseNotice && (
          <div className={`mb-6 rounded-2xl border px-4 py-3 text-sm ${purchaseNotice.type === 'success' ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200' : purchaseNotice.type === 'info' ? 'border-cyan-400/30 bg-cyan-500/8 text-cyan-200' : 'border-rose-500/30 bg-rose-500/10 text-rose-200'}`}>
            {purchaseNotice.message}
          </div>
        )}

        {activePack && (
          <div className="mb-8 p-6 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-pink-500/10 backdrop-blur-2xl rounded-4xl border border-amber-500/30 shadow-2xl relative overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-amber-500/5 blur-3xl pointer-events-none"></div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
              <div className="flex items-center gap-4">
                <div className="rounded-2xl bg-amber-500/20 border border-amber-400/30 p-3 text-amber-300">
                  <Building2 size={24} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-black uppercase tracking-[0.2em] text-amber-400">Mock Assessment Mode</span>
                    <span className="flex items-center gap-1 rounded-full bg-amber-500/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-300 border border-amber-500/30 animate-pulse">
                      <Sparkles size={10} /> Active
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-white mt-1 uppercase tracking-tight">
                    {activePack.company} <span className="text-slate-400 text-lg font-medium tracking-normal lowercase first-letter:uppercase">({activePack.role})</span>
                  </h3>
                  <p className="text-sm text-slate-400 mt-1">
                    Showing problems for <strong className="text-amber-300">{activePack.company}</strong> ({activePack.role}).
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  localStorage.removeItem('activePack');
                  setActivePack(null);
                }}
                className="inline-flex items-center gap-2 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-5 py-3 text-sm font-black uppercase tracking-widest text-rose-200 transition hover:bg-rose-500/20 hover:border-rose-400/50"
              >
                <X size={15} /> Exit Mode
              </button>
            </div>
          </div>
        )}

        {/* Search & Filter Toolbar */}
        <div className="flex flex-col xl:flex-row gap-6 mb-12 p-6 bg-white/3 backdrop-blur-2xl rounded-4xl border border-white/5 shadow-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" size={22} />
            <input 
              type="text" 
              placeholder="Search problem title..." 
              className="w-full bg-black/40 border border-white/10 rounded-2xl py-5 pl-16 pr-6 focus:border-cyan-500/50 outline-none text-xl font-medium transition-all placeholder:text-slate-700"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-4">
            {[
              { key: 'status', options: ['ALL', 'SOLVED', 'UNSOLVED'], label: 'STATUS' },
              { key: 'difficulty', options: ['ALL', 'EASY', 'MEDIUM', 'HARD'], label: 'RANK' },
              { key: 'tag', options: ['ALL', 'ARRAY', 'GRAPH', 'DP'], label: 'TAG' }
            ].map((f) => (
              <select
                key={f.key}
                value={filters[f.key]}
                onChange={(e) => setFilters({ ...filters, [f.key]: e.target.value.toLowerCase() })}
                className="bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-xl font-black uppercase tracking-widest outline-none focus:border-cyan-500 appearance-none cursor-pointer min-w-45 hover:bg-white/5 transition-colors"
              >
                {f.options.map(opt => <option key={opt} value={opt.toLowerCase()}>{f.label}: {opt}</option>)}
              </select>
            ))}
          </div>
        </div>

        {/* Problems List - Single Row Format */}
        <div className="space-y-4">
          {paginatedProblems.map((problem, idx) => {
            const index = (currentPage - 1) * pageSize + idx;
            return (
              <NavLink
                key={problem._id}
                to={`/problem/${problem._id}`}
                className="group flex items-center justify-between bg-white/2 border border-white/5 p-8 rounded-4xl hover:bg-white/5 hover:border-cyan-500/30 transition-all duration-500 animate-in fade-in slide-in-from-bottom-4"
                style={{ animationDelay: `${index * 40}ms` }}
              >
                {/* Left Side: Index & Problem Info */}
                <div className="flex items-center gap-10">
                  <span className="text-lg md:text-xl font-mono text-slate-500 w-10">{(index + 1).toString().padStart(2, '0')}</span>
                  
                  <div>
                    <h2 className="text-xl md:text-2xl font-black text-white group-hover:text-cyan-400 transition-colors uppercase tracking-tight mb-2">
                      {problem.title}
                    </h2>
                    <div className="flex items-center gap-6">
                       <span className={`px-4 py-1 text-[15px] font-black uppercase tracking-[0.2em] border rounded-full ${getDifficultyStyles(problem.difficulty)}`}>
                        {problem.difficulty}
                      </span>
                      <div className="flex items-center text-slate-500 text-[15px] font-black uppercase tracking-widest">
                        <Terminal size={14} className="mr-2 text-cyan-500/50" />
                        {formatTags(problem.tags)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side: Dynamic Status Tag */}
                <div className="flex items-center gap-8">
                  {problem.isSolved ? (
                    <div className="flex items-center gap-3 px-6 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                       <CheckCircle2 className="text-emerald-400" size={16} />
                       <span className="text-[15px] font-black text-emerald-400 uppercase tracking-widest">Solved</span>
                    </div>
                  ) : (
                    <div className="px-6 py-2 bg-white/5 border border-white/10 rounded-xl group-hover:border-cyan-500/30 transition-all">
                       <span className="text-[15px] font-black text-slate-500 group-hover:text-white uppercase tracking-widest">Solve</span>
                    </div>
                  )}
                  <Zap className="text-slate-800 group-hover:text-cyan-400 group-hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.5)] transition-all" size={28} />
                </div>
              </NavLink>
            );
          })}

          {paginatedProblems.length === 0 && (
            <div className="text-center py-32 bg-white/1 border border-dashed border-white/10 rounded-[3rem]">
              <p className="text-slate-500 font-mono text-sm uppercase tracking-[0.28em] animate-pulse">No problems found for selected filters</p>
            </div>
          )}

          {/* Pagination Controls */}
          {totalProblems > 0 && (
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-slate-400">Showing {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, totalProblems)} of {totalProblems}</div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 rounded-md bg-black/40 border border-white/10 text-sm disabled:opacity-40"
                >Prev</button>

                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-2 rounded-md text-sm ${currentPage === i + 1 ? 'bg-cyan-600 text-white' : 'bg-black/40 border border-white/10 text-slate-300'}`}
                  >{i + 1}</button>
                ))}

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 rounded-md bg-black/40 border border-white/10 text-sm disabled:opacity-40"
                >Next</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProblemPractice;