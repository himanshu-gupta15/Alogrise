import { useEffect, useState } from 'react';
import axiosClient from '../utils/axiosClient';
import { Trash2, AlertTriangle, ShieldAlert, Search, RefreshCcw } from 'lucide-react';

const AdminDelete = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const { data } = await axiosClient.get('/problem/getAllProblem');
      setProblems(data);
    } catch (err) {
      setError('Failed to synchronize with database');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('WARNING: This action is irreversible. Delete problem?')) return;
    
    try {
      await axiosClient.delete(`/problem/delete/${id}`);
      setProblems(problems.filter(problem => problem._id !== id));
    } catch (err) {
      setError('Critical failure: Unable to delete resource');
      console.error(err);
    }
  };

  const filteredProblems = problems.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col justify-center items-center">
        <div className="w-16 h-16 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin shadow-[0_0_15px_rgba(6,182,212,0.5)]"></div>
        <p className="mt-4 font-mono text-cyan-400 tracking-[0.3em] uppercase text-xs animate-pulse">Scanning Registry...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020202] text-white pb-24 relative overflow-hidden">
      {/* Dynamic Background Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-rose-500/5 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="container mx-auto px-6 lg:px-12 pt-16 relative z-10">
        
        {/* --- HEADER SECTION --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="border-l-4 border-rose-600 pl-6">
            <div className="flex items-center gap-3 mb-2">
              <ShieldAlert className="text-rose-500 animate-pulse" size={20} />
              <h2 className="text-rose-500 font-mono text-xs tracking-[0.4em] uppercase">Security Level: Admin</h2>
            </div>
            <h1 className="text-6xl font-black tracking-tighter uppercase italic">
              Purge <span className="text-slate-600">Database</span>
            </h1>
          </div>

          <div className="flex gap-4">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search resources..." 
                className="bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-6 w-full md:w-80 focus:outline-none focus:border-rose-500/50 transition-all font-medium"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button onClick={fetchProblems} className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all">
              <RefreshCcw size={20} className="text-slate-400" />
            </button>
          </div>
        </div>

        {/* --- ERROR ALERT --- */}
        {error && (
          <div className="mb-8 flex items-center gap-4 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 animate-in fade-in slide-in-from-top-4">
            <AlertTriangle size={20} />
            <p className="text-sm font-bold uppercase tracking-wider">{error}</p>
          </div>
        )}

        {/* --- DATA GRID --- */}
        <div className="grid grid-cols-1 gap-4">
          <div className="hidden lg:grid grid-cols-12 px-8 mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
            <div className="col-span-1">#ID</div>
            <div className="col-span-5">Resource Title</div>
            <div className="col-span-2">Difficulty</div>
            <div className="col-span-2">Classification</div>
            <div className="col-span-2 text-right">Termination</div>
          </div>

          {filteredProblems.map((problem, index) => (
            <div 
              key={problem._id} 
              className="group relative bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-2xl p-6 lg:px-8 lg:py-4 transition-all hover:bg-slate-900/60 hover:border-rose-500/30 grid grid-cols-1 lg:grid-cols-12 items-center gap-4 lg:gap-0"
            >
              {/* Row Decorator */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-rose-600 transition-all group-hover:h-3/5 rounded-r-full"></div>

              <div className="col-span-1 font-mono text-xs text-slate-600">
                {(index + 1).toString().padStart(2, '0')}
              </div>
              
              <div className="col-span-5 text-lg font-black tracking-tight text-white group-hover:text-rose-400 transition-colors">
                {problem.title}
              </div>

              <div className="col-span-2">
                <span className={`text-[10px] font-black px-3 py-1 rounded-full border uppercase tracking-widest ${
                  problem.difficulty === 'Easy' 
                    ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5' 
                    : problem.difficulty === 'Medium' 
                      ? 'border-amber-500/30 text-amber-400 bg-amber-500/5' 
                      : 'border-rose-500/30 text-rose-400 bg-rose-500/5'
                }`}>
                  {problem.difficulty}
                </span>
              </div>

              <div className="col-span-2">
                <span className="text-[10px] font-mono text-slate-500 bg-white/5 px-2 py-1 rounded">
                  {problem.tags}
                </span>
              </div>

              <div className="col-span-2 text-right">
                <button 
                  onClick={() => handleDelete(problem._id)}
                  className="inline-flex items-center gap-2 bg-rose-600/10 text-rose-500 border border-rose-600/20 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all active:scale-95"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          ))}

          {filteredProblems.length === 0 && (
            <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-3xl">
              <p className="text-slate-600 italic font-mono uppercase tracking-widest">No matching resources found in registry</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDelete;