import { useEffect, useState } from 'react';
import axiosClient from '../utils/axiosClient';
import { NavLink } from 'react-router-dom'; // Ensure correct router import
import { Video, Upload, Trash2, Film, Search, AlertCircle, Loader2 } from 'lucide-react';

const AdminVideo = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const formatTags = (tags) => (Array.isArray(tags) ? tags.join(', ') : String(tags || ''));

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const { data } = await axiosClient.get('/problem/getAllProblem');
      setProblems(data);
    } catch (err) {
      setError('RECON_FAILURE: Could not sync with media servers');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('PROTOCOL_WARNING: This will permanently purge video assets. Continue?')) return;
    try {
      await axiosClient.delete(`/video/delete/${id}`);
      setProblems(problems.filter(problem => problem._id !== id));
      alert("Asset deleted successfully.");
    } catch (err) {
      const msg = err.response?.data?.error || "TERMINATION_FAILED";
      alert(`Error: ${msg}`);
    }
  };

  const filtered = problems.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()));

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col justify-center items-center">
        <Loader2 className="w-12 h-12 text-cyan-500 animate-spin" />
        <p className="mt-4 font-mono text-[10px] text-cyan-500 tracking-[0.5em] uppercase">Loading Archives...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020202] text-white pb-24 relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="container mx-auto px-6 lg:px-12 pt-16 relative z-10">
        
        {/* --- Header Section --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="border-l-4 border-cyan-500 pl-6">
            <div className="flex items-center gap-3 mb-2">
              <Film className="text-cyan-400" size={20} />
              <h2 className="text-cyan-400 font-mono text-xs tracking-[0.4em] uppercase">Asset Manager v1.0</h2>
            </div>
            <h1 className="text-5xl font-black tracking-tighter uppercase italic">
              Video <span className="text-slate-600">Repository</span>
            </h1>
          </div>

          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Filter by problem title..." 
              className="bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-6 w-full md:w-80 focus:outline-none focus:border-cyan-500/50 transition-all"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-3 text-rose-400">
            <AlertCircle size={20} />
            <span className="text-xs font-bold uppercase tracking-widest">{error}</span>
          </div>
        )}

        {/* --- Media Grid --- */}
        <div className="grid grid-cols-1 gap-4">
          {filtered.map((problem, index) => (
            <div 
              key={problem._id} 
              className="group bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-2xl p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 transition-all hover:bg-slate-900/60 hover:border-white/10"
            >
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-cyan-500/30 transition-all">
                  <Video size={24} className="text-slate-500 group-hover:text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">{problem.title}</h3>
                  <div className="flex gap-3 mt-2">
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded border uppercase tracking-widest ${
                      problem.difficulty === 'Easy' ? 'border-emerald-500/30 text-emerald-400' : 
                      problem.difficulty === 'Medium' ? 'border-amber-500/30 text-amber-400' : 'border-rose-500/30 text-rose-400'
                    }`}>
                      {problem.difficulty}
                    </span>
                    <span className="text-[9px] font-mono text-slate-500 uppercase tracking-tighter">{formatTags(problem.tags)}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 border-t lg:border-t-0 pt-4 lg:pt-0 border-white/5">
                <NavLink 
                  to={`/admin/upload/${problem._id}`}
                  className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]"
                >
                  <Upload size={14} /> Upload
                </NavLink>
                
                <button 
                  onClick={() => handleDelete(problem._id)}
                  className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-white/5 hover:bg-rose-600 border border-white/10 rounded-xl text-xs font-black uppercase tracking-widest transition-all"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-20 bg-white/[0.02] border border-dashed border-white/5 rounded-3xl">
              <p className="text-slate-500 font-mono text-xs uppercase tracking-[0.2em]">No matches found in visual registry</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminVideo;