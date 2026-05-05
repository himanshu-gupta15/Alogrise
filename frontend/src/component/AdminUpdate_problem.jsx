import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import { FileText, Beaker, ShieldCheck, Plus, Trash2, Loader2, EyeOff, Layers, Sparkles } from 'lucide-react';
import axiosClient from '../utils/axiosClient';

function AdminUpdate_problem() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [companiesCsv, setCompaniesCsv] = useState('');

  const { register, control, handleSubmit, reset, formState: { errors } } = useForm();

  const { fields: visibleFields, append: appendVisible, remove: removeVisible } = useFieldArray({ control, name: 'visibleTestCases' });
  const { fields: hiddenFields, append: appendHidden, remove: removeHidden } = useFieldArray({ control, name: 'hiddenTestCases' });

  // Load existing data into defaultValues
  useEffect(() => {
    const fetchExistingData = async () => {
      try {
        const { data } = await axiosClient.get(`/problem/problemById/${id}`);
        // This pre-populates the entire form, including arrays for TestCases and StartCode
        reset(data); 
        setCompaniesCsv(Array.isArray(data?.companies) ? data.companies.join(', ') : '');
      } catch (err) {
        console.error("Failed to load problem data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchExistingData();
  }, [id, reset]);

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      const payload = {
        ...data,
        companies: companiesCsv
          .split(/[,\n]/)
          .map((company) => company.trim())
          .filter(Boolean),
      };
      await axiosClient.put(`/problem/update/${id}`, payload);
      alert('REVISION_SYNC: Problem successfully updated.');
      navigate('/admin/delete'); 
    } catch (error) {
      alert(`SYNC_FAILURE: ${error.response?.data || error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center">
      <div className="relative">
        <Loader2 className="w-16 h-16 text-cyan-500 animate-spin" />
        <div className="absolute inset-0 w-16 h-16 bg-cyan-500/20 blur-xl rounded-full animate-pulse"></div>
      </div>
      <p className="mt-6 font-mono text-cyan-500 text-[10px] tracking-[0.5em] uppercase">Decrypting Module Archives...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020202] text-white pb-24 relative overflow-hidden selection:bg-cyan-500/30">
      {/* Background Atmosphere */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-600/10 blur-[120px] rounded-full pointer-events-none animate-pulse"></div>

      <div className="container mx-auto px-6 pt-12 relative z-10 max-w-5xl">
        {/* Header with Animation */}
        <div className="mb-12 border-l-4 border-purple-500 pl-6 animate-in slide-in-from-left duration-700">
          <div className="flex items-center gap-2 text-purple-400 font-mono text-[10px] tracking-[0.4em] uppercase mb-2">
            <Layers size={12} /> Revision Interface / {id.slice(-6)}
          </div>
          <h1 className="text-6xl font-black tracking-tighter uppercase italic text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-500">
            Update <span className="text-purple-500">Protocol</span>
          </h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
          
          {/* Metadata Section - Glassmorphism */}
          <div className="group bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[2rem] p-10 transition-all duration-500 hover:border-white/20 hover:bg-white/[0.05] animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center gap-3 mb-10 text-cyan-400">
              <FileText size={20} className="group-hover:rotate-12 transition-transform" />
              <h3 className="font-black uppercase tracking-[0.2em] text-xs text-white">System Metadata</h3>
            </div>
            
            <div className="space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Problem Label</label>
                <input {...register('title')} placeholder="Resource Name..." className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-xl font-bold focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/5 outline-none transition-all placeholder:text-slate-800" />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Logic brief</label>
                <textarea {...register('description')} rows={6} className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 font-mono text-sm leading-relaxed focus:border-cyan-500/50 outline-none transition-all resize-none" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Difficulty level</label>
                  <select {...register('difficulty')} className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-4 text-xs font-black uppercase tracking-widest outline-none focus:border-cyan-500 appearance-none cursor-pointer">
                    <option value="easy">🟩 Easy</option>
                    <option value="medium">🟨 Medium</option>
                    <option value="hard">🟥 Hard</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Category tag</label>
                  <select {...register('tags')} className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-4 text-xs font-black uppercase tracking-widest outline-none focus:border-cyan-500 appearance-none cursor-pointer">
                    <option value="array">ARRAY</option>
                    <option value="linkedList">LINKED_LIST</option>
                    <option value="graph">GRAPH_NET</option>
                    <option value="dp">DYNAMIC_PROG</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Company Names (Multiple)</label>
                <textarea
                  value={companiesCsv}
                  onChange={(e) => setCompaniesCsv(e.target.value)}
                  rows={3}
                  placeholder="Google, Amazon, Microsoft"
                  className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 font-mono text-sm leading-relaxed focus:border-cyan-500/50 outline-none transition-all resize-none placeholder:text-slate-800"
                />
                <p className="text-[10px] text-slate-500 uppercase tracking-widest ml-1">Use comma or new line to add multiple companies</p>
              </div>
            </div>
          </div>

          {/* Validation Suite */}
          <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[2rem] p-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
              <div className="flex items-center gap-3 text-purple-400">
                <Beaker size={20} />
                <h3 className="font-black uppercase tracking-[0.2em] text-xs text-white">Validation Suite</h3>
              </div>
              <div className="flex gap-4">
                <button type="button" onClick={() => appendVisible({ input: '', output: '', explanation: '' })} className="flex items-center gap-2 px-5 py-2.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-cyan-500 hover:text-black transition-all">
                  <Plus size={14} /> Public Case
                </button>
                <button type="button" onClick={() => appendHidden({ input: '', output: '' })} className="flex items-center gap-2 px-5 py-2.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all">
                  <EyeOff size={14} /> Hidden Case
                </button>
              </div>
            </div>

            {/* Public Test Cases Grid */}
            <div className="grid grid-cols-1 gap-6">
              {visibleFields.map((field, index) => (
                <div key={field.id} className="group relative bg-black/40 border border-white/5 p-8 rounded-3xl transition-all hover:bg-black/60 hover:border-purple-500/30">
                  <div className="absolute -top-3 -left-3 bg-purple-500 text-black font-black px-3 py-1 rounded-lg text-[10px]">PUB_{index + 1}</div>
                  <button type="button" onClick={() => removeVisible(index)} className="absolute top-4 right-4 text-slate-600 hover:text-rose-500 transition-colors p-2"><Trash2 size={16} /></button>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div className="space-y-2">
                      <p className="text-[9px] font-black text-slate-600 uppercase ml-1">Input Stream</p>
                      <input {...register(`visibleTestCases.${index}.input`)} className="w-full bg-black/60 border border-white/5 rounded-xl p-4 text-xs font-mono text-cyan-400 focus:border-purple-500 outline-none" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-[9px] font-black text-slate-600 uppercase ml-1">Expected Output</p>
                      <input {...register(`visibleTestCases.${index}.output`)} className="w-full bg-black/60 border border-white/5 rounded-xl p-4 text-xs font-mono text-emerald-400 focus:border-purple-500 outline-none" />
                    </div>
                    <div className="col-span-1 md:col-span-2 space-y-2">
                      <p className="text-[9px] font-black text-slate-600 uppercase ml-1">Logic Explanation</p>
                      <textarea {...register(`visibleTestCases.${index}.explanation`)} rows={2} className="w-full bg-black/60 border border-white/5 rounded-xl p-4 text-xs text-slate-400 focus:border-purple-500 outline-none resize-none" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Action */}
          <div className="relative group pt-6">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-cyan-500 to-purple-600 rounded-2xl blur-lg opacity-25 group-hover:opacity-60 transition duration-1000 animate-gradient-x"></div>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="relative w-full py-6 rounded-2xl bg-black border border-white/10 flex items-center justify-center gap-4 transition-all active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin text-cyan-500" />
              ) : (
                <>
                  <ShieldCheck size={24} className="text-emerald-400" />
                  <span className="text-sm font-black tracking-[0.4em] uppercase italic text-white">Commit Changes to Production</span>
                  <Sparkles size={20} className="text-purple-500" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminUpdate_problem;