import { useState, useEffect } from 'react';
import axiosClient from '../utils/axiosClient';
import { History, Code, CheckCircle2, XCircle, Clock, Database, ChevronRight, X } from 'lucide-react';

const SubmissionHistory = ({ problemId }) => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get(`/problem/submittedProblem/${problemId}`);
        // console.log('Submission History Response:', response.data);
        // setSubmissions(response.data || []);
        const data = response.data;

if (Array.isArray(data)) {
  setSubmissions(data);
} else {
  setSubmissions([]);
}
      } catch (err) {
        setError('LOG_SYNC_FAILURE: Unable to reach registry');
      } finally {
        setLoading(false);
      }
    };
    fetchSubmissions();
  }, [problemId]);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'accepted': return 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5 shadow-[0_0_10px_rgba(16,185,129,0.1)]';
      case 'wrong': return 'text-rose-400 border-rose-500/20 bg-rose-500/5';
      case 'error': return 'text-amber-400 border-amber-500/20 bg-amber-500/5';
      default: return 'text-slate-400 border-white/10 bg-white/5';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-64 space-y-4">
      <div className="w-10 h-10 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-500 animate-pulse">Decrypting History...</p>
    </div>
  );

  return (
    <div className="p-2 lg:p-4">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-purple-500/10 rounded-lg">
          <History size={18} className="text-purple-400" />
        </div>
        <h2 className="text-xs font-black uppercase tracking-[0.3em] text-white">Execution Registry</h2>
      </div>
      
      {submissions.length === 0 ? (
        <div className="bg-white/5 border border-dashed border-white/10 rounded-2xl p-12 text-center">
          <p className="text-slate-500 font-mono text-xs uppercase tracking-widest">No previous executions recorded for this module</p>
        </div>
      ) : (
        <div className="space-y-3">
          {submissions.map((sub, index) => (
            <div 
              key={sub._id}
              onClick={() => setSelectedSubmission(sub)}
              className="group relative bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-xl p-4 flex items-center justify-between cursor-pointer hover:bg-white/[0.05] hover:border-white/10 transition-all duration-300"
            >
              <div className="flex items-center gap-6">
                <span className="text-[10px] font-mono text-slate-600">{(index + 1).toString().padStart(2, '0')}</span>
                
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border ${getStatusStyle(sub.status)}`}>
                      {sub.status}
                    </span>
                    <span className="text-sm font-bold text-white uppercase tracking-tight">{sub.language}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-mono">{formatDate(sub.createdAt)}</p>
                </div>
              </div>

              <div className="flex items-center gap-8">
                <div className="hidden md:flex items-center gap-4">
                  <div className="flex flex-col items-end">
                    <span className="text-[9px] font-black text-slate-600 uppercase tracking-tighter">Runtime</span>
                    <span className="text-xs font-mono text-slate-300">{sub.runtime}s</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[9px] font-black text-slate-600 uppercase tracking-tighter">Passed</span>
                    <span className="text-xs font-mono text-emerald-500/80">{sub.testCasesPassed}/{sub.testCasesTotal}</span>
                  </div>
                </div>
                <ChevronRight size={16} className="text-slate-700 group-hover:text-cyan-400 transition-colors" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Code View Overlay */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-[#0a0a0a] border border-white/10 w-full max-w-5xl rounded-3xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/[0.02]">
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg bg-white/5 border border-white/10`}>
                  <Code size={18} className="text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-widest">Code Archeology</h3>
                  <p className="text-[10px] text-slate-500 font-mono">Timestamp: {formatDate(selectedSubmission.createdAt)}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedSubmission(null)}
                className="p-2 hover:bg-white/5 rounded-full text-slate-500 hover:text-white transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Sub-header (Stats) */}
            <div className="flex flex-wrap gap-4 p-6 bg-black/40 border-b border-white/5">
              {[
                { label: 'Status', val: selectedSubmission.status, icon: CheckCircle2, color: 'text-emerald-400' },
                { label: 'Latency', val: `${selectedSubmission.runtime}s`, icon: Clock, color: 'text-amber-400' },
                { label: 'Heap', val: `${selectedSubmission.memory}kB`, icon: Database, color: 'text-cyan-400' },
                { label: 'Language', val: selectedSubmission.language, icon: Code, color: 'text-purple-400' }
              ].map((stat, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-xl border border-white/5">
                  <stat.icon size={14} className={stat.color} />
                  <span className="text-[10px] font-black uppercase text-slate-500 tracking-tighter">{stat.label}:</span>
                  <span className="text-[10px] font-bold text-slate-200">{stat.val}</span>
                </div>
              ))}
            </div>
            
            {/* Code Body */}
            <div className="flex-1 overflow-auto p-8 bg-[#050505] custom-scrollbar">
              <pre className="font-mono text-xs leading-relaxed text-cyan-100/70">
                <code>{selectedSubmission.code}</code>
              </pre>
            </div>
            
            {/* Error Log Footer */}
            {selectedSubmission.errorMessage && (
              <div className="p-6 bg-rose-500/10 border-t border-rose-500/20">
                <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-2">Debugger Output</p>
                <p className="text-xs font-mono text-rose-300">{selectedSubmission.errorMessage}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmissionHistory;