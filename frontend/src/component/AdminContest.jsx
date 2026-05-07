import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarDays, Flag, Plus, Save, Search, ShieldCheck, Timer, Trash2, Users } from 'lucide-react';
import axiosClient from '../utils/axiosClient';

const AdminContest = () => {
  const navigate = useNavigate();
  const [problems, setProblems] = useState([]);
  const [loadingProblems, setLoadingProblems] = useState(true);
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedProblemIds, setSelectedProblemIds] = useState([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    maxParticipants: 500,
  });

  const formatTags = (tags) => (Array.isArray(tags) ? tags.join(', ') : String(tags || ''));

  useEffect(() => {
    const loadProblems = async () => {
      try {
        const { data } = await axiosClient.get('/problem/getAllProblem');
        setProblems(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to load problems for contest creation', error);
      } finally {
        setLoadingProblems(false);
      }
    };

    loadProblems();
  }, []);

  const filteredProblems = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return problems;
    return problems.filter((problem) => {
      return [problem.title, problem.difficulty, formatTags(problem.tags)]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(needle));
    });
  }, [problems, query]);

  const toggleProblem = (problemId) => {
    setSelectedProblemIds((prev) =>
      prev.includes(problemId)
        ? prev.filter((id) => id !== problemId)
        : [...prev, problemId]
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (selectedProblemIds.length === 0) {
      alert('Please select at least one problem for the contest.');
      return;
    }

    try {
      setSaving(true);
      await axiosClient.post('/contest/create', {
        ...form,
        maxParticipants: Number(form.maxParticipants) || 500,
        problems: selectedProblemIds,
      });
      alert('Contest created successfully.');
      navigate('/contest');
    } catch (error) {
      console.error('Contest create failed', error.response || error);
      alert(`Failed to create contest: ${error.response?.data || error.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#05070a] px-6 py-16 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 border-l-4 border-cyan-500 pl-6">
          <div className="mb-2 flex items-center gap-2 text-cyan-400 text-[10px] font-mono uppercase tracking-[0.5em]">
            <ShieldCheck size={14} /> Admin / Contest Builder
          </div>
          <h1 className="text-5xl font-black tracking-tighter uppercase italic">Create Contest</h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-400">
            Build a timed contest, attach problems, and publish it to the contest arena.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-8">
            <div className="rounded-4xl border border-white/10 bg-slate-900/30 p-8 backdrop-blur-2xl">
              <div className="mb-8 flex items-center gap-3 text-cyan-400">
                <CalendarDays size={20} />
                <h2 className="text-sm font-black uppercase tracking-[0.2em] text-white">Contest Details</h2>
              </div>

              <div className="space-y-5">
                <input
                  value={form.title}
                  onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Contest title"
                  className="w-full rounded-2xl border border-white/10 bg-black/50 px-5 py-4 outline-none placeholder:text-slate-700 focus:border-cyan-500"
                />
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Contest description"
                  rows={5}
                  className="w-full resize-none rounded-2xl border border-white/10 bg-black/50 px-5 py-4 outline-none placeholder:text-slate-700 focus:border-cyan-500"
                />

                <div className="grid gap-4 md:grid-cols-2">
                  <label className="space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Start Time</span>
                    <input
                      type="datetime-local"
                      value={form.startTime}
                      onChange={(e) => setForm((prev) => ({ ...prev, startTime: e.target.value }))}
                      className="w-full rounded-2xl border border-white/10 bg-black/50 px-5 py-4 outline-none focus:border-cyan-500"
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">End Time</span>
                    <input
                      type="datetime-local"
                      value={form.endTime}
                      onChange={(e) => setForm((prev) => ({ ...prev, endTime: e.target.value }))}
                      className="w-full rounded-2xl border border-white/10 bg-black/50 px-5 py-4 outline-none focus:border-cyan-500"
                    />
                  </label>
                </div>

                <label className="space-y-2 block">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Max Participants</span>
                  <input
                    type="number"
                    min="1"
                    value={form.maxParticipants}
                    onChange={(e) => setForm((prev) => ({ ...prev, maxParticipants: e.target.value }))}
                    className="w-full rounded-2xl border border-white/10 bg-black/50 px-5 py-4 outline-none focus:border-cyan-500"
                  />
                </label>
              </div>
            </div>

            <div className="rounded-4xl border border-white/10 bg-slate-900/30 p-8 backdrop-blur-2xl">
              <div className="mb-6 flex items-center gap-3 text-emerald-400">
                <Flag size={20} />
                <h2 className="text-sm font-black uppercase tracking-[0.2em] text-white">Selected Problems</h2>
              </div>

              {selectedProblemIds.length === 0 ? (
                <p className="text-sm text-slate-400">Pick at least one problem from the list to enable contest creation.</p>
              ) : (
                <div className="flex flex-wrap gap-3">
                  {selectedProblemIds.map((problemId) => {
                    const problem = problems.find((item) => item._id === problemId);
                    return (
                      <button
                        type="button"
                        key={problemId}
                        onClick={() => toggleProblem(problemId)}
                        className="flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-4 py-2 text-xs font-black uppercase tracking-widest text-emerald-200"
                      >
                        {problem?.title || 'Problem'}
                        <Trash2 size={12} />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="rounded-4xl border border-white/10 bg-slate-900/30 p-8 backdrop-blur-2xl">
            <div className="mb-6 flex items-center gap-3 text-purple-400">
              <Timer size={20} />
              <h2 className="text-sm font-black uppercase tracking-[0.2em] text-white">Problem Picker</h2>
            </div>

            <div className="mb-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-black/40 px-4 py-3">
              <Search size={16} className="text-slate-500" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search problems..."
                className="w-full bg-transparent outline-none placeholder:text-slate-700"
              />
            </div>

            {loadingProblems ? (
              <p className="text-sm text-slate-400">Loading problems...</p>
            ) : (
              <div className="max-h-130 space-y-3 overflow-y-auto pr-1">
                {filteredProblems.map((problem) => {
                  const checked = selectedProblemIds.includes(problem._id);
                  return (
                    <button
                      key={problem._id}
                      type="button"
                      onClick={() => toggleProblem(problem._id)}
                      className={`w-full rounded-2xl border p-4 text-left transition ${
                        checked
                          ? 'border-cyan-400/50 bg-cyan-500/10'
                          : 'border-white/10 bg-black/30 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <h3 className="font-black">{problem.title}</h3>
                          <p className="text-xs uppercase tracking-widest text-slate-500">
                            {problem.difficulty} • {formatTags(problem.tags)}
                          </p>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                          {checked ? 'Selected' : 'Add'}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            <button
              type="submit"
              disabled={saving}
              className="mt-6 flex w-full items-center justify-center gap-3 rounded-2xl border border-white/10 bg-black px-5 py-4 font-black uppercase tracking-[0.3em] transition hover:border-cyan-500/40 disabled:opacity-60"
            >
              {saving ? 'Creating...' : <><Save size={18} /> Create Contest</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminContest;