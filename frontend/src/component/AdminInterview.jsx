import React, { useEffect, useState, useMemo } from "react";
import { Plus, Save, Trash2, Edit3, ShieldCheck, Search } from "lucide-react";
import axiosClient from "../utils/axiosClient";

const defaultForm = {
  packId: "",
  company: "",
  role: "",
  type: "online",
  problems: [],
  attempted: 0,
  successRate: 0,
  isPremium: false,
  priceInCents: 0,
  currency: "usd",
  isActive: true,
  description: "",
};

function AdminInterview() {
  const [packs, setPacks] = useState([]);
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingProblems, setLoadingProblems] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState("");
  const [form, setForm] = useState(defaultForm);
  const [problemQuery, setProblemQuery] = useState("");

  const loadPacks = async () => {
    try {
      const { data } = await axiosClient.get("/interview/admin/packs");
      setPacks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load interview packs", error);
    } finally {
      setLoading(false);
    }
  };

  const loadProblems = async () => {
    try {
      const { data } = await axiosClient.get("/problem/getAllProblem");
      setProblems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load problems", error);
    } finally {
      setLoadingProblems(false);
    }
  };

  useEffect(() => {
    loadPacks();
    loadProblems();
  }, []);

  const filteredProblems = useMemo(() => {
    const needle = problemQuery.trim().toLowerCase();
    if (!needle) return problems;
    return problems.filter((problem) =>
      problem.title.toLowerCase().includes(needle) ||
      (problem.difficulty && problem.difficulty.toLowerCase().includes(needle))
    );
  }, [problems, problemQuery]);

  const resetForm = () => {
    setForm(defaultForm);
    setEditingId("");
    setProblemQuery("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.problems.length === 0) {
      alert("Please select at least one problem for the interview pack.");
      return;
    }
    try {
      setSaving(true);
      const payload = {
        ...form,
        sets: form.problems.length,
        attempted: Number(form.attempted) || 0,
        successRate: Number(form.successRate) || 0,
        priceInCents: form.isPremium ? Number(form.priceInCents) || 0 : 0,
      };

      if (editingId) {
        await axiosClient.put(`/interview/admin/packs/${editingId}`, payload);
      } else {
        await axiosClient.post("/interview/admin/packs", payload);
      }

      await loadPacks();
      resetForm();
    } catch (error) {
      console.error("Failed to save interview pack", error);
      alert(error?.response?.data?.error || "Failed to save interview pack");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (pack) => {
    setEditingId(pack._id);
    setForm({
      packId: pack.packId || "",
      company: pack.company || "",
      role: pack.role || "",
      type: pack.type || "online",
      problems: pack.problems || [],
      attempted: pack.attempted || 0,
      successRate: pack.successRate || 0,
      isPremium: Boolean(pack.isPremium),
      priceInCents: pack.priceInCents || 0,
      currency: pack.currency || "usd",
      isActive: Boolean(pack.isActive),
      description: pack.description || "",
    });
  };

  const handleDelete = async (id) => {
    const ok = window.confirm("Delete this interview pack?");
    if (!ok) return;

    try {
      await axiosClient.delete(`/interview/admin/packs/${id}`);
      await loadPacks();
      if (editingId === id) resetForm();
    } catch (error) {
      console.error("Failed to delete interview pack", error);
      alert(error?.response?.data?.error || "Failed to delete interview pack");
    }
  };

  return (
    <div className="min-h-screen bg-[#06080c] px-6 py-16 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 border-l-4 border-cyan-500 pl-5">
          <p className="mb-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.35em] text-cyan-300">
            <ShieldCheck size={14} /> Admin / Interview Control
          </p>
          <h1 className="text-4xl font-black uppercase tracking-tight">Interview Mock Assessment Control</h1>
          <p className="mt-2 text-sm text-slate-400">Create and manage free/premium interview packs shown on the user Interview page.</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
          <form onSubmit={handleSubmit} className="rounded-3xl border border-white/10 bg-slate-900/40 p-6">
            <h2 className="mb-5 text-sm font-black uppercase tracking-[0.2em] text-cyan-300">
              {editingId ? "Edit Pack" : "Create Pack"}
            </h2>

            <div className="space-y-4">
              <input value={form.packId} onChange={(e) => setForm((p) => ({ ...p, packId: e.target.value }))} placeholder="packId (e.g. amazon-oa)" className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-cyan-500" />
              <input value={form.company} onChange={(e) => setForm((p) => ({ ...p, company: e.target.value }))} placeholder="Company" className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-cyan-500" />
              <input value={form.role} onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))} placeholder="Role / Round" className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-cyan-500" />

              <div className="w-full">
                <select value={form.type} onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))} className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-cyan-500">
                  <option value="online">Online</option>
                  <option value="phone">Phone</option>
                  <option value="onsite">Onsite</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <input type="number" min="0" value={form.attempted} onChange={(e) => setForm((p) => ({ ...p, attempted: e.target.value }))} placeholder="Attempted" className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-cyan-500" />
                <input type="number" min="0" max="100" step="0.01" value={form.successRate} onChange={(e) => setForm((p) => ({ ...p, successRate: e.target.value }))} placeholder="Success Rate %" className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-cyan-500" />
              </div>

              <textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} placeholder="Description" rows={3} className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-cyan-500" />

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Select Problems</label>
                <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/40 px-3 py-2">
                  <Search size={14} className="text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search problems..."
                    value={problemQuery}
                    onChange={(e) => setProblemQuery(e.target.value)}
                    className="w-full bg-transparent text-sm outline-none placeholder:text-slate-600 focus:ring-0"
                  />
                </div>
                <div className="max-h-40 overflow-y-auto space-y-1 rounded-xl border border-white/10 bg-black/20 p-2">
                  {loadingProblems ? (
                    <p className="text-xs text-slate-500 p-1">Loading problems...</p>
                  ) : filteredProblems.length === 0 ? (
                    <p className="text-xs text-slate-500 p-1">No problems found</p>
                  ) : (
                    filteredProblems.map((problem) => {
                      const isSelected = form.problems.includes(problem._id);
                      return (
                        <button
                          key={problem._id}
                          type="button"
                          onClick={() => {
                            setForm((p) => {
                              const newProblems = p.problems.includes(problem._id)
                                ? p.problems.filter((id) => id !== problem._id)
                                : [...p.problems, problem._id];
                              return { ...p, problems: newProblems };
                            });
                          }}
                          className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs transition ${
                            isSelected
                              ? "bg-cyan-500/10 text-cyan-300 border border-cyan-500/20"
                              : "hover:bg-white/5 border border-transparent text-slate-300"
                          }`}
                        >
                          <span>{problem.title}</span>
                          <span className="text-[9px] uppercase tracking-widest text-slate-500">
                            {problem.difficulty}
                          </span>
                        </button>
                      );
                    })
                  )}
                </div>
                <p className="text-[10px] text-slate-400">
                  Selected: <span className="font-bold text-cyan-300">{form.problems.length}</span> problem(s)
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <label className="flex items-center gap-2 text-sm text-slate-300">
                  <input type="checkbox" checked={form.isPremium} onChange={(e) => setForm((p) => ({ ...p, isPremium: e.target.checked }))} /> Premium
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-300">
                  <input type="checkbox" checked={form.isActive} onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))} /> Active
                </label>
              </div>

              {form.isPremium && (
                <div className="grid grid-cols-2 gap-3">
                  <input type="number" min="0" value={form.priceInCents} onChange={(e) => setForm((p) => ({ ...p, priceInCents: e.target.value }))} placeholder="Price (in cents)" className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-cyan-500" />
                  <input value={form.currency} onChange={(e) => setForm((p) => ({ ...p, currency: e.target.value }))} placeholder="Currency (usd)" className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-cyan-500" />
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 text-sm font-black uppercase tracking-widest text-black transition hover:bg-cyan-400 disabled:opacity-60">
                  {editingId ? <Save size={15} /> : <Plus size={15} />} {saving ? "Saving..." : editingId ? "Update" : "Create"}
                </button>
                {editingId && (
                  <button type="button" onClick={resetForm} className="rounded-xl border border-white/15 px-5 py-3 text-sm font-black uppercase tracking-widest text-slate-300 transition hover:border-cyan-400/40">
                    Cancel Edit
                  </button>
                )}
              </div>
            </div>
          </form>

          <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-6">
            <h2 className="mb-5 text-sm font-black uppercase tracking-[0.2em] text-purple-300">Existing Packs</h2>
            {loading ? (
              <p className="text-slate-400">Loading packs...</p>
            ) : packs.length === 0 ? (
              <p className="text-slate-400">No interview packs found.</p>
            ) : (
              <div className="max-h-[70vh] space-y-3 overflow-y-auto pr-1">
                {packs.map((pack) => (
                  <div key={pack._id} className="rounded-2xl border border-white/10 bg-black/30 p-4">
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-black">{pack.company} • {pack.role}</h3>
                        <p className="text-xs uppercase tracking-widest text-slate-500">{pack.packId} • {pack.type}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`rounded-full px-2 py-1 text-[10px] font-black uppercase tracking-widest ${pack.isPremium ? "bg-amber-500/15 text-amber-200" : "bg-emerald-500/15 text-emerald-200"}`}>
                          {pack.isPremium ? "Premium" : "Free"}
                        </span>
                        <span className={`rounded-full px-2 py-1 text-[10px] font-black uppercase tracking-widest ${pack.isActive ? "bg-cyan-500/15 text-cyan-200" : "bg-slate-500/20 text-slate-300"}`}>
                          {pack.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>

                    <p className="mb-3 text-sm text-slate-400">{pack.description || "No description"}</p>
                    <div className="mb-4 grid grid-cols-2 gap-2 text-xs text-slate-400">
                      <p>Sets: <span className="text-slate-200">{pack.sets}</span></p>
                      <p>Attempted: <span className="text-slate-200">{pack.attempted}</span></p>
                      <p>Success: <span className="text-slate-200">{pack.successRate}%</span></p>
                      <p>Price: <span className="text-slate-200">{pack.isPremium ? `${(pack.priceInCents / 100).toFixed(2)} ${pack.currency}` : "Free"}</span></p>
                    </div>

                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(pack)} className="inline-flex items-center gap-1 rounded-lg border border-cyan-400/30 bg-cyan-500/10 px-3 py-2 text-xs font-black uppercase tracking-wider text-cyan-200">
                        <Edit3 size={13} /> Edit
                      </button>
                      <button onClick={() => handleDelete(pack._id)} className="inline-flex items-center gap-1 rounded-lg border border-rose-400/30 bg-rose-500/10 px-3 py-2 text-xs font-black uppercase tracking-wider text-rose-200">
                        <Trash2 size={13} /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminInterview;
