// import React, { useState, useEffect, useRef } from 'react';
// import { useForm } from 'react-hook-form';
// import Editor from '@monaco-editor/react';
// import { useParams } from 'react-router';
// import axiosClient from "../utils/axiosClient"
// import SubmissionHistory from '../component/SubmissionHistory';
// import ChatAi from '../component/ChatAi';
// import Editorial from '../component/Editorial';
// import { Code2, Terminal, Info, Cpu, Play, Send, Zap, MessageSquare, History, BookOpen } from 'lucide-react';

// const langMap = { cpp: 'C++', java: 'Java', javascript: 'JavaScript' };

// const ProblemPage = () => {
//   const [problem, setProblem] = useState(null);
//   const [selectedLanguage, setSelectedLanguage] = useState('javascript');
//   const [code, setCode] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [runResult, setRunResult] = useState(null);
//   const [submitResult, setSubmitResult] = useState(null);
//   const [activeLeftTab, setActiveLeftTab] = useState('description');
//   const [activeRightTab, setActiveRightTab] = useState('code');
//   const editorRef = useRef(null);
//   let { problemId } = useParams();

//   useEffect(() => {
//     const fetchProblem = async () => {
//       setLoading(true);
//       try {
//         const response = await axiosClient.get(`/problem/problemById/${problemId}`);
//         const initialCode = response.data.startCode.find(sc => sc.language === langMap[selectedLanguage]).initialCode;
//         // console.log('Fetched problem:', response.data);
//         setProblem(response.data);
//         setCode(initialCode);
//       } catch (error) {
//         console.error('Error fetching problem:', error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProblem();
//   }, [problemId]);

//   useEffect(() => {
//     if (problem) {
//       const initialCode = problem.startCode.find(sc => sc.language === langMap[selectedLanguage]).initialCode;
//       setCode(initialCode);
//     }
//   }, [selectedLanguage, problem]);

//   const handleRun = async () => {
//     setLoading(true);
//     setRunResult(null);
//     try {
//       const response = await axiosClient.post(`/submission/run/${problemId}`, { code, language: selectedLanguage });
//       console.log('Run response:', response.data);
//       setRunResult(response.data);
//       setActiveRightTab('testcase');
//     } catch (error) {
//       setRunResult({ success: false, error: 'Internal server error' });
//       setActiveRightTab('testcase');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmitCode = async () => {
//     setLoading(true);
//     setSubmitResult(null);
//     try {
//       const response = await axiosClient.post(`/submission/submit/${problemId}`, { code, language: selectedLanguage });
//       console.log('Submit response:', response.data);
//       setSubmitResult(response.data);
//       setActiveRightTab('result');
//     } catch (error) {
//       setActiveRightTab('result');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getDifficultyColor = (diff) => {
//     switch (diff) {
//       case 'easy': return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
//       case 'medium': return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
//       case 'hard': return 'text-rose-400 border-rose-500/30 bg-rose-500/10';
//       default: return 'text-slate-400';
//     }
//   };

//   if (loading && !problem) {
//     return (
//       <div className="h-screen bg-black flex flex-col justify-center items-center">
//         <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
//         <p className="mt-4 font-mono text-cyan-500 tracking-widest text-xs animate-pulse uppercase">Initializing Environment...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="h-[calc(100vh-80px)] flex bg-[#050505] text-slate-300 overflow-hidden">
      
//       {/* LEFT PANEL: DESCRIPTION & DOCS */}
//       <div className="w-1/2 flex flex-col border-r border-white/5 bg-[#0a0a0a]">
//         {/* Modern Tabs */}
//         <div className="flex bg-black/40 border-b border-white/5">
//           {[
//             { id: 'description', label: 'Description', icon: Info },
//             { id: 'editorial', label: 'Editorial', icon: BookOpen },
//             { id: 'solutions', label: 'Solutions', icon: Zap },
//             { id: 'submissions', label: 'History', icon: History },
//             { id: 'chatAI', label: 'AI Tutor', icon: MessageSquare }
//           ].map((tab) => (
//             <button 
//               key={tab.id}
//               onClick={() => setActiveLeftTab(tab.id)}
//               className={`flex items-center gap-2 px-6 py-4 text-[10px] font-black uppercase tracking-widest transition-all relative
//                 ${activeLeftTab === tab.id ? 'text-cyan-400' : 'text-slate-500 hover:text-slate-300'}`}
//             >
//               <tab.icon size={14} />
//               {tab.label}
//               {activeLeftTab === tab.id && (
//                 <div className="absolute bottom-0 left-0 w-full h-[2px] bg-cyan-500 shadow-[0_0_8px_#06b6d4]"></div>
//               )}
//             </button>
//           ))}
//         </div>

//         {/* Content Area */}
//         <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
//           {problem && (
//             <div className="max-w-3xl">
//               {activeLeftTab === 'description' && (
//                 <div className="animate-in fade-in slide-in-from-left-4 duration-500">
//                   <div className="flex items-center gap-4 mb-8">
//                     <h1 className="text-3xl font-black tracking-tighter text-white uppercase italic">
//                       {problem.title}
//                     </h1>
//                     <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getDifficultyColor(problem.difficulty)}`}>
//                       {problem.difficulty}
//                     </span>
//                   </div>

//                   <div className="text-slate-400 leading-relaxed font-medium mb-10 border-l-2 border-white/10 pl-6 py-2 italic">
//                     {problem.description}
//                   </div>

//                   <div className="space-y-8">
//                     <h3 className="text-xs font-black uppercase tracking-widest text-white flex items-center gap-2">
//                       <Terminal size={16} className="text-cyan-500" /> Reference Cases
//                     </h3>
//                     {problem.visibleTestCases.map((example, index) => (
//                       <div key={index} className="bg-white/5 border border-white/5 rounded-2xl p-6 hover:bg-white/[0.07] transition-all">
//                         <h4 className="text-[10px] font-black text-slate-500 uppercase mb-4 tracking-tighter">Example {index + 1}</h4>
//                         <div className="space-y-3 font-mono text-sm">
//                           <div className="flex gap-2 text-cyan-400/80"><span className="text-slate-600 font-bold w-16">Input:</span> {example.input}</div>
//                           <div className="flex gap-2 text-emerald-400/80"><span className="text-slate-600 font-bold w-16">Output:</span> {example.output}</div>
//                           <div className="text-slate-500 text-xs mt-4 leading-relaxed bg-black/30 p-3 rounded-lg border border-white/5">
//                             <span className="font-bold uppercase text-[9px] block mb-1">Logic:</span> {example.explanation}
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//               {/* Other tabs follow similar styling... */}
//               {activeLeftTab === 'chatAI' && <ChatAi problem={problem} />}
//               {activeLeftTab === 'editorial' && <Editorial secureUrl={problem.secureUrl} />}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* RIGHT PANEL: CODE & CONSOLE */}
//       <div className="w-1/2 flex flex-col bg-black">
//         {/* Right Tab Bar */}
//         <div className="flex justify-between items-center bg-[#0a0a0a] border-b border-white/5 pr-4">
//           <div className="flex">
//             {['code', 'testcase', 'result'].map((tab) => (
//               <button 
//                 key={tab}
//                 onClick={() => setActiveRightTab(tab)}
//                 className={`px-8 py-4 text-[10px] font-black uppercase tracking-widest relative
//                   ${activeRightTab === tab ? 'text-purple-400' : 'text-slate-500'}`}
//               >
//                 {tab}
//                 {activeRightTab === tab && (
//                   <div className="absolute bottom-0 left-0 w-full h-[2px] bg-purple-500 shadow-[0_0_8px_#a855f7]"></div>
//                 )}
//               </button>
//             ))}
//           </div>
          
//           {/* Language Picker */}
//           <div className="flex gap-2">
//             {['cpp', 'java', 'javascript'].map((lang) => (
//               <button
//                 key={lang}
//                 onClick={() => setSelectedLanguage(lang)}
//                 className={`px-3 py-1 text-[10px] font-bold rounded-md border transition-all
//                   ${selectedLanguage === lang ? 'border-cyan-500/50 bg-cyan-500/10 text-cyan-400' : 'border-white/5 text-slate-600 hover:text-slate-400'}`}
//               >
//                 {lang === 'cpp' ? 'C++' : lang.toUpperCase()}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Editor Area */}
//         <div className="flex-1 relative">
//           {activeRightTab === 'code' ? (
//             <div className="h-full">
//               <Editor
//                 height="100%"
//                 language={selectedLanguage === 'cpp' ? 'cpp' : selectedLanguage}
//                 value={code}
//                 onChange={(val) => setCode(val)}
//                 theme="vs-dark"
//                 options={{
//                   fontSize: 14,
//                   fontFamily: 'JetBrains Mono, Menlo, monospace',
//                   minimap: { enabled: false },
//                   automaticLayout: true,
//                   padding: { top: 20 },
//                   lineNumbersMinChars: 4
//                 }}
//               />
//             </div>
//           ) : (
//             <div className="p-8 h-full bg-[#050505] overflow-y-auto">
//               {activeRightTab === 'testcase' && (
//                 <div className="animate-in zoom-in-95 duration-300">
//                   <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-6 flex items-center gap-2">
//                     <Terminal size={14} /> System Console
//                   </h3>
//                   {runResult ? (
//                     <div className="space-y-4">
//                       {runResult.testCase.map((tc, i) => (
//                         <div key={i} className="bg-slate-900/50 border border-white/5 rounded-xl p-6">
//                           <div className="flex justify-between items-center mb-4">
//                             <span className="text-[10px] font-bold text-slate-600">CASE #{i+1}</span>
//                             <span className={tc.status_id === 3 ? 'text-emerald-400' : 'text-rose-400'}>
//                               {tc.status_id === 3 ? '✓ PASSED' : '✗ FAILED'}
//                             </span>
//                           </div>
//                           <div className="grid grid-cols-2 gap-4 font-mono text-xs">
//                             <div className="p-3 bg-black/40 rounded border border-white/5">
//                               <p className="text-slate-600 mb-1">STDIN</p>
//                               <p>{tc.stdin}</p>
//                             </div>
//                             <div className="p-3 bg-black/40 rounded border border-white/5">
//                               <p className="text-slate-600 mb-1">STDOUT</p>
//                               <p>{tc.stdout || "No output"}</p>
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   ) : (
//                     <p className="text-slate-700 italic text-sm">Waiting for execution...</p>
//                   )}
//                 </div>
//               )}
//             </div>
//           )}
//         </div>

//         {/* Action Footer */}
//         <div className="p-4 bg-[#0a0a0a] border-t border-white/5 flex justify-between items-center">
//             <button className="text-[10px] font-bold text-slate-600 hover:text-white transition-colors tracking-widest uppercase">
//                 Reset to Default
//             </button>
//             <div className="flex gap-4">
//                 <button
//                     onClick={handleRun}
//                     disabled={loading}
//                     className="flex items-center gap-2 px-6 py-2 bg-white/5 border border-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
//                 >
//                     <Play size={14} fill="currentColor" /> {loading ? 'Running...' : 'Run'}
//                 </button>
//                 <button
//                     onClick={handleSubmitCode}
//                     disabled={loading}
//                     className="flex items-center gap-2 px-8 py-2 bg-cyan-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-cyan-500 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all"
//                 >
//                     <Send size={14} /> Submit
//                 </button>
//             </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProblemPage;

// import React, { useState, useEffect, useRef } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import Editor from '@monaco-editor/react';
// import axiosClient from "../utils/axiosClient";
// import confetti from 'canvas-confetti';

// // Component Imports
// import SubmissionHistory from '../component/SubmissionHistory';
// import ChatAi from '../component/ChatAi';
// import Editorial from '../component/Editorial';

// // UI Icons
// import { 
//   Terminal, Info, Play, Send, Zap, 
//   MessageSquare, History, BookOpen, CheckCircle2, 
//   Trophy, ArrowRight, Star, Layers, RefreshCcw
// } from 'lucide-react';

// const langMap = { cpp: 'C++', java: 'Java', javascript: 'JavaScript' };

// const ProblemPage = () => {
//   const navigate = useNavigate();
//   const { problemId } = useParams();
  
//   // Logic State
//   const [problem, setProblem] = useState(null);
//   const [selectedLanguage, setSelectedLanguage] = useState('javascript');
//   const [code, setCode] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [runResult, setRunResult] = useState(null);
//   const [showSuccess, setShowSuccess] = useState(false);
  
//   // Navigation State
//   const [activeLeftTab, setActiveLeftTab] = useState('description');
//   const [activeRightTab, setActiveRightTab] = useState('code');

//   // Fetch Problem Data
//   useEffect(() => {
//     const fetchProblem = async () => {
//       setLoading(true);
//       try {
//         const response = await axiosClient.get(`/problem/problemById/${problemId}`);
//         const initialCode = response.data.startCode.find(sc => sc.language === langMap[selectedLanguage]).initialCode;
//         setProblem(response.data);
//         setCode(initialCode);
//       } catch (error) {
//         console.error('Error fetching problem:', error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProblem();
//   }, [problemId]);

//   // Sync code editor when language changes
//   useEffect(() => {
//     if (problem) {
//       const langData = problem.startCode.find(sc => sc.language === langMap[selectedLanguage]);
//       setCode(langData ? langData.initialCode : "// No boilerplate available");
//     }
//   }, [selectedLanguage, problem]);

//   // Celebration Animation Logic
//   const triggerCelebration = () => {
//     setShowSuccess(true);
//     const duration = 4 * 1000;
//     const end = Date.now() + duration;

//     (function frame() {
//       confetti({
//         particleCount: 4,
//         angle: 60,
//         spread: 55,
//         origin: { x: 0, y: 0.6 },
//         colors: ['#06b6d4', '#8b5cf6']
//       });
//       confetti({
//         particleCount: 4,
//         angle: 120,
//         spread: 55,
//         origin: { x: 1, y: 0.6 },
//         colors: ['#10b981', '#ffffff']
//       });
//       if (Date.now() < end) requestAnimationFrame(frame);
//     }());
//   };

//   const handleRun = async () => {
//     setLoading(true);
//     setRunResult(null);
//     try {
//       const response = await axiosClient.post(`/submission/run/${problemId}`, { code, language: selectedLanguage });
//       setRunResult(response.data);
//       setActiveRightTab('testcase');
//     } catch (error) {
//       console.error('Execution Error:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmitCode = async () => {
//     setLoading(true);
//     try {
//       const response = await axiosClient.post(`/submission/submit/${problemId}`, { code, language: selectedLanguage });
//       console.log('Submit response:', response.data);
//       if (response.data.accepted === true || response.data.allPassed) {
//         triggerCelebration();
//       }
//       setActiveRightTab('testcase');
//     } catch (error) {
//       console.error('Submission Error:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getDifficultyColor = (diff) => {
//     switch (diff?.toLowerCase()) {
//       case 'easy': return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
//       case 'medium': return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
//       case 'hard': return 'text-rose-400 border-rose-500/30 bg-rose-500/10';
//       default: return 'text-slate-400';
//     }
//   };

//   if (loading && !problem) {
//     return (
//       <div className="h-screen bg-black flex flex-col justify-center items-center">
//         <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin shadow-[0_0_15px_rgba(6,182,212,0.3)]"></div>
//         <p className="mt-4 font-mono text-cyan-500 tracking-[0.4em] text-[10px] animate-pulse uppercase">Syncing Neural Link...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="h-[calc(100vh-80px)] flex bg-[#050505] text-slate-300 overflow-hidden relative">
      
//       {/* SUCCESS MODAL OVERLAY */}
//       {showSuccess && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-500">
//           <div className="relative bg-[#0a0a0a] border border-emerald-500/20 w-full max-w-md rounded-[2.5rem] p-10 text-center shadow-2xl scale-in-center">
//             <div className="relative inline-flex mb-8">
//               <div className="absolute -inset-4 bg-emerald-500/20 rounded-full blur-xl animate-ping"></div>
//               <div className="relative bg-emerald-500/10 p-5 rounded-full border border-emerald-500/30">
//                 <CheckCircle2 size={60} className="text-emerald-400" />
//               </div>
//             </div>
//             <h2 className="text-3xl font-black tracking-tighter uppercase italic text-white mb-2">Accepted</h2>
//             <p className="text-slate-400 font-mono text-[10px] tracking-widest uppercase mb-8 italic">Solution Synchronized with Grid</p>
//             <div className="space-y-3">
//               <button 
//                 onClick={() => navigate('/')}
//                 className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 group shadow-[0_0_20px_rgba(16,185,129,0.3)]"
//               >
//                 Next Challenge <ArrowRight size={14} />
//               </button>
//               <button onClick={() => setShowSuccess(false)} className="w-full py-4 bg-white/5 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white rounded-2xl border border-white/5 transition-all">Review Code</button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* LEFT PANEL: CONTENT HUB */}
//       <div className="w-1/2 flex flex-col border-r border-white/5 bg-[#0a0a0a]">
//         <div className="flex bg-black/40 border-b border-white/5">
//           {[
//             { id: 'description', label: 'Brief', icon: Info },
//             { id: 'editorial', label: 'Editorial', icon: BookOpen },
//             { id: 'submissions', label: 'History', icon: History },
//             { id: 'chatAI', label: 'AI Tutor', icon: MessageSquare }
//           ].map((tab) => (
//             <button 
//               key={tab.id}
//               onClick={() => setActiveLeftTab(tab.id)}
//               className={`flex items-center gap-2 px-6 py-4 text-[10px] font-black uppercase tracking-widest transition-all relative
//                 ${activeLeftTab === tab.id ? 'text-cyan-400' : 'text-slate-500 hover:text-slate-300'}`}
//             >
//               <tab.icon size={14} />
//               {tab.label}
//               {activeLeftTab === tab.id && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-cyan-500 shadow-[0_0_10px_#06b6d4]"></div>}
//             </button>
//           ))}
//         </div>

//         <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
//           {problem && (
//             <div className="max-w-3xl">
//               {activeLeftTab === 'description' && (
//                 <div className="animate-in fade-in slide-in-from-left-4 duration-500">
//                   <div className="flex items-center gap-4 mb-8">
//                     <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic">{problem.title}</h1>
//                     <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getDifficultyColor(problem.difficulty)}`}>
//                       {problem.difficulty}
//                     </span>
//                   </div>
//                   <div className="text-slate-400 leading-relaxed font-medium mb-12 border-l-2 border-white/10 pl-6 py-2 italic text-lg">{problem.description}</div>
//                   <div className="space-y-8">
//                     {problem.visibleTestCases.map((example, index) => (
//                       <div key={index} className="bg-white/[0.03] border border-white/5 rounded-3xl p-8 hover:bg-white/[0.06] transition-all">
//                         <h4 className="text-[10px] font-black text-slate-600 uppercase mb-4 tracking-widest">Example Case_{index + 1}</h4>
//                         <div className="font-mono text-sm space-y-3">
//                           <p><span className="text-cyan-500/50 font-black mr-4">INPUT:</span> {example.input}</p>
//                           <p><span className="text-emerald-500/50 font-black mr-4">OUTPUT:</span> {example.output}</p>
//                           <div className="mt-4 p-4 bg-black/40 rounded-xl border border-white/5 text-xs text-slate-500 leading-relaxed italic">
//                              <span className="text-[9px] font-black uppercase block mb-1">Logic Detail:</span> {example.explanation}
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//               {activeLeftTab === 'chatAI' && <ChatAi problem={problem} />}
//               {activeLeftTab === 'editorial' && <Editorial secureUrl={problem.secureUrl} thumbnailUrl={problem.thumbnailUrl} duration={problem.duration} />}
//               {activeLeftTab === 'submissions' && <SubmissionHistory problemId={problemId} />}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* RIGHT PANEL: EXECUTION UNIT */}
//       <div className="w-1/2 flex flex-col bg-black">
//         <div className="flex justify-between items-center bg-[#0a0a0a] border-b border-white/5 px-4 h-14">
//           <div className="flex h-full">
//             {['code', 'testcase'].map((tab) => (
//               <button 
//                 key={tab}
//                 onClick={() => setActiveRightTab(tab)}
//                 className={`px-8 h-full text-[10px] font-black uppercase tracking-[0.2em] relative transition-colors
//                   ${activeRightTab === tab ? 'text-purple-400' : 'text-slate-600 hover:text-slate-400'}`}
//               >
//                 {tab}
//                 {activeRightTab === tab && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-purple-500 shadow-[0_0_10px_#a855f7]"></div>}
//               </button>
//             ))}
//           </div>
          
//           <div className="flex gap-2">
//             {['cpp', 'java', 'javascript'].map((lang) => (
//               <button
//                 key={lang}
//                 onClick={() => setSelectedLanguage(lang)}
//                 className={`px-3 py-1 text-[9px] font-black rounded border transition-all uppercase tracking-tighter
//                   ${selectedLanguage === lang ? 'border-cyan-500/50 bg-cyan-500/10 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.2)]' : 'border-white/5 text-slate-700 hover:text-slate-400'}`}
//               >
//                 {lang === 'cpp' ? 'C++' : lang}
//               </button>
//             ))}
//           </div>
//         </div>

//         <div className="flex-1 relative bg-[#050505]">
//           {activeRightTab === 'code' ? (
//             <Editor
//                 height="100%"
//                 language={selectedLanguage === 'cpp' ? 'cpp' : selectedLanguage}
//                 value={code}
//                 theme="vs-dark"
//                 onChange={(val) => setCode(val)}
//                 options={{ 
//                     fontSize: 14, 
//                     fontFamily: 'JetBrains Mono, Menlo, monospace',
//                     minimap: { enabled: false }, 
//                     automaticLayout: true, 
//                     padding: { top: 24 },
//                     lineNumbersMinChars: 4,
//                     scrollBeyondLastLine: false,
//                     cursorSmoothCaretAnimation: true
//                 }}
//             />
//           ) : (
//             <div className="p-8 h-full bg-[#050505] overflow-y-auto custom-scrollbar">
//               <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600 mb-8 flex items-center gap-2">
//                 <Terminal size={14} /> Execution Registry
//               </h3>
//               {runResult ? (
//                 <div className="space-y-6">
//                   {runResult.testCase.map((tc, i) => (
//                     <div key={i} className="group bg-white/[0.02] border border-white/5 rounded-2xl p-6 transition-all hover:bg-white/[0.04]">
//                       <div className="flex justify-between items-center mb-6">
//                         <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Test_Module_{i+1}</span>
//                         <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border shadow-sm ${tc.status_id === 3 ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5' : 'text-rose-400 border-rose-500/20 bg-rose-500/5'}`}>
//                           {tc.status_id === 3 ? 'ACCEPTED' : 'FAILURE'}
//                         </div>
//                       </div>
//                       <div className="grid grid-cols-2 gap-6 font-mono text-[11px]">
//                         <div className="space-y-2">
//                           <p className="text-[9px] text-slate-600 uppercase font-black tracking-tighter italic">Stdin</p>
//                           <div className="p-4 bg-black/40 rounded-xl border border-white/5 text-cyan-500/70">{tc.stdin}</div>
//                         </div>
//                         <div className="space-y-2">
//                           <p className="text-[9px] text-slate-600 uppercase font-black tracking-tighter italic">Stdout</p>
//                           <div className="p-4 bg-black/40 rounded-xl border border-white/5 text-emerald-500/70">{tc.stdout || "NULL"}</div>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="flex flex-col items-center justify-center h-64 text-slate-700">
//                     <Layers size={40} className="mb-4 opacity-20" />
//                     <p className="text-xs font-mono uppercase tracking-[0.2em] italic">Waiting for Input Transmission...</p>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>

//         <div className="p-4 bg-[#0a0a0a] border-t border-white/5 flex justify-between items-center px-8 h-20">
//             <button 
//                 onClick={() => setCode(problem?.startCode.find(sc => sc.language === langMap[selectedLanguage]).initialCode)}
//                 className="text-[9px] font-black text-slate-600 hover:text-white transition-colors tracking-[0.3em] uppercase italic flex items-center gap-2"
//             >
//                 <RefreshCcw size={12} /> Reset Buffer
//             </button>
//             <div className="flex gap-4">
//                 <button
//                     onClick={handleRun}
//                     disabled={loading}
//                     className="flex items-center gap-2 px-8 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/10 transition-all active:scale-95 disabled:opacity-50"
//                 >
//                     <Play size={14} fill="currentColor" /> {loading ? 'Running...' : 'Run'}
//                 </button>
//                 <button
//                     onClick={handleSubmitCode}
//                     disabled={loading}
//                     className="flex items-center gap-2 px-10 py-3 bg-cyan-600 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-cyan-500 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all active:scale-95 disabled:opacity-50"
//                 >
//                     <Send size={14} /> {loading ? 'Encrypting...' : 'Submit'}
//                 </button>
//             </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProblemPage;


// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import Editor from '@monaco-editor/react';
// import axiosClient from "../utils/axiosClient";
// import confetti from 'canvas-confetti';

// // Component Imports
// import SubmissionHistory from '../component/SubmissionHistory';
// import ChatAi from '../component/ChatAi';
// import Editorial from '../component/Editorial';

// // UI Icons
// import { 
//   Terminal, Info, Play, Send, Zap, 
//   MessageSquare, History, BookOpen, CheckCircle2, 
//   ArrowRight, Layers, RefreshCcw
// } from 'lucide-react';

// const langMap = { cpp: 'C++', java: 'Java', javascript: 'JavaScript' };

// const ProblemPage = () => {
//   const navigate = useNavigate();
//   const { problemId } = useParams();
  
//   // Logic State
//   const [problem, setProblem] = useState(null);
//   const [selectedLanguage, setSelectedLanguage] = useState('javascript');
//   const [code, setCode] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [runResult, setRunResult] = useState(null);
//   const [showSuccess, setShowSuccess] = useState(false);
  
//   // Navigation State
//   const [activeLeftTab, setActiveLeftTab] = useState('description');
//   const [activeRightTab, setActiveRightTab] = useState('code');

//   // Fetch Problem Data
//   useEffect(() => {
//     const fetchProblem = async () => {
//       setLoading(true);
//       try {
//         const response = await axiosClient.get(`/problem/problemById/${problemId}`);
//         const langData = response.data.startCode.find(sc => sc.language === langMap[selectedLanguage]);
//         setProblem(response.data);
//         setCode(langData ? langData.initialCode : "");
//       } catch (error) {
//         console.error('Error fetching problem:', error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProblem();
//   }, [problemId]);

//   // Sync code editor when language changes
//   useEffect(() => {
//     if (problem) {
//       const langData = problem.startCode.find(sc => sc.language === langMap[selectedLanguage]);
//       setCode(langData ? langData.initialCode : "// No boilerplate available");
//     }
//   }, [selectedLanguage, problem]);

//   // Celebration Animation Logic
//   const triggerCelebration = () => {
//     setShowSuccess(true);
//     const duration = 4 * 1000;
//     const end = Date.now() + duration;

//     (function frame() {
//       confetti({
//         particleCount: 4,
//         angle: 60,
//         spread: 55,
//         origin: { x: 0, y: 0.6 },
//         colors: ['#06b6d4', '#8b5cf6']
//       });
//       confetti({
//         particleCount: 4,
//         angle: 120,
//         spread: 55,
//         origin: { x: 1, y: 0.6 },
//         colors: ['#10b981', '#ffffff']
//       });
//       if (Date.now() < end) requestAnimationFrame(frame);
//     }());
//   };

//   const handleRun = async () => {
//     setLoading(true);
//     setRunResult(null);
//     try {
//       const response = await axiosClient.post(`/submission/run/${problemId}`, { code, language: selectedLanguage });
//       setRunResult(response.data);
//       setActiveRightTab('testcase');
//     } catch (error) {
//       console.error('Execution Error:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmitCode = async () => {
//     setLoading(true);
//     try {
//       const response = await axiosClient.post(`/submission/submit/${problemId}`, { code, language: selectedLanguage });
//       if (response.data.accepted === true || response.data.allPassed) {
//         triggerCelebration();
//       }
//       setRunResult(response.data); // Showing submission results in the console
//       setActiveRightTab('testcase');
//     } catch (error) {
//       console.error('Submission Error:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleNextChallenge = async () => {
//     try {
//       setLoading(true);
//       const { data: allProblems } = await axiosClient.get('/problem/getAllProblem');
//       const currentIndex = allProblems.findIndex(p => p._id === problemId);
//       const nextIndex = (currentIndex + 1) % allProblems.length;
//       const nextProblemId = allProblems[nextIndex]._id;

//       // Reset State for New Problem
//       setShowSuccess(false);
//       setRunResult(null);
//       navigate(`/problem/${nextProblemId}`);
//     } catch (error) {
//       console.error("Navigation failed:", error);
//       navigate('/');
//     }
//   };

//   const getDifficultyColor = (diff) => {
//     switch (diff?.toLowerCase()) {
//       case 'easy': return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
//       case 'medium': return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
//       case 'hard': return 'text-rose-400 border-rose-500/30 bg-rose-500/10';
//       default: return 'text-slate-400';
//     }
//   };

//   if (loading && !problem) {
//     return (
//       <div className="h-screen bg-black flex flex-col justify-center items-center">
//         <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
//         <p className="mt-4 font-mono text-cyan-500 tracking-[0.4em] text-[10px] animate-pulse uppercase">Syncing Neural Link...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="h-[calc(100vh-80px)] flex bg-[#050505] text-slate-300 overflow-hidden relative">
      
//       {/* SUCCESS MODAL OVERLAY */}
//       {showSuccess && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-500">
//           <div className="relative bg-[#0a0a0a] border border-emerald-500/20 w-full max-w-md rounded-[2.5rem] p-10 text-center shadow-2xl">
//             <div className="relative inline-flex mb-8">
//               <div className="absolute -inset-4 bg-emerald-500/20 rounded-full blur-xl animate-ping"></div>
//               <div className="relative bg-emerald-500/10 p-5 rounded-full border border-emerald-500/30 text-emerald-400">
//                 <CheckCircle2 size={60} />
//               </div>
//             </div>
//             <h2 className="text-3xl font-black tracking-tighter uppercase italic text-white mb-2">Accepted</h2>
//             <p className="text-slate-400 font-mono text-[10px] tracking-widest uppercase mb-8 italic">Solution Synchronized with Grid</p>
//             <div className="space-y-3">
//               <button 
//                 onClick={handleNextChallenge}
//                 className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 group shadow-[0_0_20px_rgba(16,185,129,0.3)]"
//               >
//                 Next Challenge <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
//               </button>
//               <button onClick={() => setShowSuccess(false)} className="w-full py-4 bg-white/5 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white rounded-2xl border border-white/5 transition-all">Review Code</button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* LEFT PANEL */}
//       <div className="w-1/2 flex flex-col border-r border-white/5 bg-[#0a0a0a]">
//         <div className="flex bg-black/40 border-b border-white/5 overflow-x-auto no-scrollbar">
//           {[
//             { id: 'description', label: 'Description', icon: Info },
//             { id: 'editorial', label: 'Editorial', icon: BookOpen },
//             { id: 'submissions', label: 'History', icon: History },
//             { id: 'chatAI', label: 'AI Tutor', icon: MessageSquare }
//           ].map((tab) => (
//             <button 
//               key={tab.id}
//               onClick={() => setActiveLeftTab(tab.id)}
//               className={`flex items-center gap-2 px-6 py-4 text-[10px] font-black uppercase tracking-widest transition-all relative whitespace-nowrap
//                 ${activeLeftTab === tab.id ? 'text-cyan-400' : 'text-slate-500 hover:text-slate-300'}`}
//             >
//               <tab.icon size={14} />
//               {tab.label}
//               {activeLeftTab === tab.id && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-cyan-500 shadow-[0_0_10px_#06b6d4]"></div>}
//             </button>
//           ))}
//         </div>

//         <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
//           {problem && (
//             <div className="max-w-3xl mx-auto">
//               {activeLeftTab === 'description' && (
//                 <div className="animate-in fade-in slide-in-from-left-4 duration-500">
//                   <div className="flex items-center gap-4 mb-8">
//                     <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic">{problem.title}</h1>
//                     <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getDifficultyColor(problem.difficulty)}`}>
//                       {problem.difficulty}
//                     </span>
//                   </div>
//                   <div className="text-slate-400 leading-relaxed font-medium mb-12 border-l-2 border-white/10 pl-6 py-2 italic text-lg">{problem.description}</div>
//                   <div className="space-y-8">
//                     {problem.visibleTestCases.map((example, index) => (
//                       <div key={index} className="bg-white/[0.03] border border-white/5 rounded-3xl p-8 hover:bg-white/[0.06] transition-all">
//                         <h4 className="text-[10px] font-black text-slate-600 uppercase mb-4 tracking-widest">Example Case_{index + 1}</h4>
//                         <div className="font-mono text-sm space-y-3">
//                           <p><span className="text-cyan-500/50 font-black mr-4 uppercase">Input:</span> {example.input}</p>
//                           <p><span className="text-emerald-500/50 font-black mr-4 uppercase">Output:</span> {example.output}</p>
//                           <div className="mt-4 p-4 bg-black/40 rounded-xl border border-white/5 text-xs text-slate-500 leading-relaxed italic">
//                              <span className="text-[9px] font-black uppercase block mb-1">Logic Detail:</span> {example.explanation}
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//               {activeLeftTab === 'chatAI' && <ChatAi problem={problem} />}
//               {activeLeftTab === 'editorial' && <Editorial secureUrl={problem.secureUrl} thumbnailUrl={problem.thumbnailUrl} duration={problem.duration} />}
//               {activeLeftTab === 'submissions' && <SubmissionHistory problemId={problemId} />}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* RIGHT PANEL */}
//       <div className="w-1/2 flex flex-col bg-black">
//         <div className="flex justify-between items-center bg-[#0a0a0a] border-b border-white/5 px-4 h-14">
//           <div className="flex h-full">
//             {['code', 'testcase'].map((tab) => (
//               <button 
//                 key={tab}
//                 onClick={() => setActiveRightTab(tab)}
//                 className={`px-8 h-full text-[10px] font-black uppercase tracking-[0.2em] relative transition-colors
//                   ${activeRightTab === tab ? 'text-purple-400' : 'text-slate-600 hover:text-slate-400'}`}
//               >
//                 {tab}
//                 {activeRightTab === tab && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-purple-500 shadow-[0_0_10px_#a855f7]"></div>}
//               </button>
//             ))}
//           </div>
          
//           <div className="flex gap-2">
//             {['cpp', 'java', 'javascript'].map((lang) => (
//               <button
//                 key={lang}
//                 onClick={() => setSelectedLanguage(lang)}
//                 className={`px-3 py-1 text-[9px] font-black rounded border transition-all uppercase tracking-tighter
//                   ${selectedLanguage === lang ? 'border-cyan-500/50 bg-cyan-500/10 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.2)]' : 'border-white/5 text-slate-700 hover:text-slate-400'}`}
//               >
//                 {lang === 'cpp' ? 'C++' : lang}
//               </button>
//             ))}
//           </div>
//         </div>

//         <div className="flex-1 relative bg-[#050505]">
//           {activeRightTab === 'code' ? (
//             <Editor
//                 height="100%"
//                 language={selectedLanguage === 'cpp' ? 'cpp' : selectedLanguage}
//                 value={code}
//                 theme="vs-dark"
//                 onChange={(val) => setCode(val)}
//                 options={{ 
//                     fontSize: 14, 
//                     fontFamily: 'JetBrains Mono, Menlo, monospace',
//                     minimap: { enabled: false }, 
//                     automaticLayout: true, 
//                     padding: { top: 24 },
//                     lineNumbersMinChars: 4,
//                     scrollBeyondLastLine: false,
//                     cursorSmoothCaretAnimation: true
//                 }}
//             />
//           ) : (
//             <div className="p-8 h-full bg-[#050505] overflow-y-auto custom-scrollbar">
//               <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600 mb-8 flex items-center gap-2">
//                 <Terminal size={14} /> Execution Registry
//               </h3>
//               {runResult ? (
//                 <div className="space-y-6 animate-in fade-in duration-300">
//                   {runResult.testCase?.map((tc, i) => (
//                     <div key={i} className="group bg-white/[0.02] border border-white/5 rounded-2xl p-6 transition-all hover:bg-white/[0.04]">
//                       <div className="flex justify-between items-center mb-6">
//                         <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Case_{i+1}</span>
//                         <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border shadow-sm ${tc.status_id === 3 ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5' : 'text-rose-400 border-rose-500/20 bg-rose-500/5'}`}>
//                           {tc.status_id === 3 ? 'ACCEPTED' : 'FAILURE'}
//                         </div>
//                       </div>
//                       <div className="grid grid-cols-2 gap-6 font-mono text-[11px]">
//                         <div className="space-y-2">
//                           <p className="text-[9px] text-slate-600 uppercase font-black tracking-tighter italic">Stdin</p>
//                           <div className="p-4 bg-black/40 rounded-xl border border-white/5 text-cyan-500/70 overflow-x-auto">{tc.stdin}</div>
//                         </div>
//                         <div className="space-y-2">
//                           <p className="text-[9px] text-slate-600 uppercase font-black tracking-tighter italic">Stdout</p>
//                           <div className="p-4 bg-black/40 rounded-xl border border-white/5 text-emerald-500/70 overflow-x-auto">{tc.stdout || "NULL"}</div>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                   {runResult.errorMessage && (
//                     <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs font-mono">
//                        {runResult.errorMessage}
//                     </div>
//                   )}
//                 </div>
//               ) : (
//                 <div className="flex flex-col items-center justify-center h-64 text-slate-700">
//                     <Layers size={40} className="mb-4 opacity-20" />
//                     <p className="text-xs font-mono uppercase tracking-[0.2em] italic">Waiting for Transmission...</p>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>

//         <div className="p-4 bg-[#0a0a0a] border-t border-white/5 flex justify-between items-center px-8 h-20">
//             <button 
//                 onClick={() => setCode(problem?.startCode.find(sc => sc.language === langMap[selectedLanguage]).initialCode)}
//                 className="text-[9px] font-black text-slate-600 hover:text-white transition-colors tracking-[0.3em] uppercase italic flex items-center gap-2"
//             >
//                 <RefreshCcw size={12} /> Reset Buffer
//             </button>
//             <div className="flex gap-4">
//                 <button
//                     onClick={handleRun}
//                     disabled={loading}
//                     className="flex items-center gap-2 px-8 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/10 transition-all active:scale-95 disabled:opacity-50"
//                 >
//                     <Play size={14} fill="currentColor" /> {loading ? 'Running...' : 'Run'}
//                 </button>
//                 <button
//                     onClick={handleSubmitCode}
//                     disabled={loading}
//                     className="flex items-center gap-2 px-10 py-3 bg-cyan-600 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-cyan-500 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all active:scale-95 disabled:opacity-50"
//                 >
//                     <Send size={14} /> {loading ? 'Encrypting...' : 'Submit'}
//                 </button>
//             </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProblemPage;



import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux'; // Hook to trigger state changes
import Editor from '@monaco-editor/react';
import axiosClient from "../utils/axiosClient";
import confetti from 'canvas-confetti';
import { updateUserStats } from '../authSlice'; // Action to update gamification stats

// Component Imports
import SubmissionHistory from '../component/SubmissionHistory';
import ChatAi from '../component/ChatAi';
import Editorial from '../component/Editorial';

// UI Icons
import { 
  Terminal, Info, Play, Send, Zap, 
  MessageSquare, History, BookOpen, CheckCircle2, 
  ArrowRight, Layers, RefreshCcw
} from 'lucide-react';

const langMap = { cpp: 'C++', java: 'Java', javascript: 'JavaScript' };

const normalizeCodeText = (value) => {
  if (typeof value !== 'string') return '';
  return value.replace(/\\n/g, '\n');
};

const ProblemPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Initialize dispatch
  const { problemId } = useParams();
  
  // Logic State
  const [problem, setProblem] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [runResult, setRunResult] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Navigation State
  const [activeLeftTab, setActiveLeftTab] = useState('description');
  const [activeRightTab, setActiveRightTab] = useState('code');

  // Fetch Problem Data
  useEffect(() => {
    const fetchProblem = async () => {
      setLoading(true);
      try {
        const response = await axiosClient.get(`/problem/problemById/${problemId}`);
        const langData = response.data.startCode.find(sc => sc.language === langMap[selectedLanguage]);
        setProblem(response.data);
        setCode(normalizeCodeText(langData?.initialCode));
      } catch (error) {
        console.error('Error fetching problem:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProblem();
  }, [problemId]);

  // Sync code editor when language changes
  useEffect(() => {
    if (problem) {
      const langData = problem.startCode.find(sc => sc.language === langMap[selectedLanguage]);
      setCode(normalizeCodeText(langData?.initialCode || "// No boilerplate available"));
    }
  }, [selectedLanguage, problem]);

  // Celebration Animation Logic
  const triggerCelebration = () => {
    setShowSuccess(true);
    const duration = 4 * 1000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.6 },
        colors: ['#06b6d4', '#8b5cf6']
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.6 },
        colors: ['#10b981', '#ffffff']
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    }());
  };

  const handleRun = async () => {
    setLoading(true);
    setRunResult(null);
    try {
      const response = await axiosClient.post(`/submission/run/${problemId}`, { code, language: selectedLanguage });
      setRunResult(response.data);
      setActiveRightTab('testcase');
    } catch (error) {
      console.error('Execution Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitCode = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.post(`/submission/submit/${problemId}`, { code, language: selectedLanguage });
      
      // Update global user stats if the submission is accepted
      if (response.data.accepted === true) {
        triggerCelebration();

        /* ================= DISPATCH TO UPDATE STREAK & RANK ================= */
        if (response.data.streak !== undefined) {
          dispatch(updateUserStats({
            streak: response.data.streak,
            globalRank: response.data.globalRank,
            xp: response.data.xp
          }));
        }
        /* ==================================================================== */
      }
      
      setRunResult(response.data); 
      setActiveRightTab('testcase');
    } catch (error) {
      console.error('Submission Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNextChallenge = async () => {
    try {
      setLoading(true);
      const { data: allProblems } = await axiosClient.get('/problem/getAllProblem');
      const currentIndex = allProblems.findIndex(p => p._id === problemId);
      const nextIndex = (currentIndex + 1) % allProblems.length;
      const nextProblemId = allProblems[nextIndex]._id;

      setShowSuccess(false);
      setRunResult(null);
      navigate(`/problem/${nextProblemId}`);
    } catch (error) {
      console.error("Navigation failed:", error);
      navigate('/');
    }
  };

  const getDifficultyColor = (diff) => {
    switch (diff?.toLowerCase()) {
      case 'easy': return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
      case 'medium': return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
      case 'hard': return 'text-rose-400 border-rose-500/30 bg-rose-500/10';
      default: return 'text-slate-400';
    }
  };

  if (loading && !problem) {
    return (
      <div className="h-screen bg-black flex flex-col justify-center items-center">
        <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
        <p className="mt-4 font-mono text-cyan-500 tracking-[0.4em] text-[10px] animate-pulse uppercase">Syncing Neural Link...</p>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-80px)] flex bg-[#050505] text-slate-300 overflow-hidden relative">
      
      {/* SUCCESS MODAL OVERLAY */}
      {showSuccess && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 p-6 backdrop-blur-md animate-in fade-in duration-500">
          <div className="relative bg-[#0a0a0a] border border-emerald-500/20 w-full max-w-md rounded-[2.5rem] p-10 text-center shadow-2xl">
            <div className="relative inline-flex mb-8">
              <div className="absolute -inset-4 bg-emerald-500/20 rounded-full blur-xl animate-ping"></div>
              <div className="relative bg-emerald-500/10 p-5 rounded-full border border-emerald-500/30 text-emerald-400">
                <CheckCircle2 size={60} />
              </div>
            </div>
            <h2 className="text-3xl font-black tracking-tighter uppercase italic text-white mb-2">Accepted</h2>
            <p className="text-slate-400 font-mono text-[10px] tracking-widest uppercase mb-8 italic">Solution Synchronized with Grid</p>
            <div className="space-y-3">
              <button 
                onClick={handleNextChallenge}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 group shadow-[0_0_20px_rgba(16,185,129,0.3)]"
              >
                Next Challenge <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button onClick={() => setShowSuccess(false)} className="w-full py-4 bg-white/5 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white rounded-2xl border border-white/5 transition-all">Review Code</button>
            </div>
          </div>
        </div>
      )}

      {/* LEFT PANEL */}
      <div className="w-1/2 flex flex-col border-r border-white/5 bg-[#0a0a0a]">
        <div className="flex bg-black/40 border-b border-white/5 overflow-x-auto no-scrollbar">
          {[
            { id: 'description', label: 'Description', icon: Info },
            { id: 'editorial', label: 'Editorial', icon: BookOpen },
            { id: 'submissions', label: 'History', icon: History },
            { id: 'chatAI', label: 'AI Tutor', icon: MessageSquare }
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveLeftTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 text-[10px] font-black uppercase tracking-widest transition-all relative whitespace-nowrap
                ${activeLeftTab === tab.id ? 'text-cyan-400' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <tab.icon size={14} />
              {tab.label}
              {activeLeftTab === tab.id && <div className="absolute bottom-0 left-0 h-0.5 w-full bg-cyan-500 shadow-[0_0_10px_#06b6d4]"></div>}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
          {problem && (
            <div className="max-w-3xl mx-auto">
              {activeLeftTab === 'description' && (
                <div className="animate-in fade-in slide-in-from-left-4 duration-500">
                  <div className="flex items-center gap-4 mb-8">
                    <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-white md:text-5xl">{problem.title}</h1>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getDifficultyColor(problem.difficulty)}`}>
                      {problem.difficulty}
                    </span>
                  </div>

                  <div className="mb-12 border-l-2 border-white/10 pl-6 py-2 text-xl leading-9 text-slate-300 md:text-2xl md:leading-10">
                    {problem.description}
                  </div>

                  <div className="space-y-8">
                    {problem.visibleTestCases.map((example, index) => (
                      <div key={index} className="bg-white/3 border border-white/5 rounded-3xl p-8 transition-all hover:bg-white/6">
                        <h4 className="text-[10px] font-black text-slate-600 uppercase mb-4 tracking-widest">Example Case {index + 1}</h4>
                        <div className="space-y-3 text-base text-slate-200">
                          <p>
                            <span className="mr-3 text-xs font-black uppercase tracking-[0.18em] text-cyan-400/80">Input:</span>
                            <span className="whitespace-pre-wrap font-mono"> {example.input?.replace(/\\n/g, '\n')}</span>
                          </p>
                          <p>
                            <span className="mr-3 text-xs font-black uppercase tracking-[0.18em] text-emerald-400/80">Output:</span>
                            <span className="whitespace-pre-wrap font-mono"> {example.output?.replace(/\\n/g, '\n')}</span>
                          </p>
                          <div className="mt-4 rounded-xl border border-white/5 bg-black/40 p-4 text-sm leading-relaxed text-slate-400">
                             <span className="mb-1 block text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">Logic Detail:</span> {example.explanation}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {activeLeftTab === 'chatAI' && <ChatAi problem={problem} />}
              {activeLeftTab === 'editorial' && <Editorial secureUrl={problem.secureUrl} thumbnailUrl={problem.thumbnailUrl} duration={problem.duration} />}
              {activeLeftTab === 'submissions' && <SubmissionHistory problemId={problemId} />}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-1/2 flex flex-col bg-black">
        <div className="flex justify-between items-center bg-[#0a0a0a] border-b border-white/5 px-4 h-14">
          <div className="flex h-full">
            {['code', 'testcase'].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveRightTab(tab)}
                className={`px-8 h-full text-[10px] font-black uppercase tracking-[0.2em] relative transition-colors
                  ${activeRightTab === tab ? 'text-purple-400' : 'text-slate-600 hover:text-slate-400'}`}
              >
                {tab}
                {activeRightTab === tab && <div className="absolute bottom-0 left-0 h-0.5 w-full bg-purple-500 shadow-[0_0_10px_#a855f7]"></div>}
              </button>
            ))}
          </div>
          
          <div className="flex gap-2">
            {['cpp', 'java', 'javascript'].map((lang) => (
              <button
                key={lang}
                onClick={() => setSelectedLanguage(lang)}
                className={`px-3 py-1 text-[9px] font-black rounded border transition-all uppercase tracking-tighter
                  ${selectedLanguage === lang ? 'border-cyan-500/50 bg-cyan-500/10 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.2)]' : 'border-white/5 text-slate-700 hover:text-slate-400'}`}
              >
                {lang === 'cpp' ? 'C++' : lang}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 relative bg-[#050505]">
          {activeRightTab === 'code' ? (
            <Editor
                height="100%"
                language={selectedLanguage === 'cpp' ? 'cpp' : selectedLanguage}
                value={code}
                theme="vs-dark"
                onChange={(val) => setCode(val)}
                options={{ 
                    fontSize: 14, 
                    fontFamily: 'JetBrains Mono, Menlo, monospace',
                    minimap: { enabled: false }, 
                    automaticLayout: true, 
                    padding: { top: 24 },
                    lineNumbersMinChars: 4,
                    scrollBeyondLastLine: false,
                  wordWrap: 'on',
                  wrappingIndent: 'same',
                    cursorSmoothCaretAnimation: true
                }}
            />
          ) : (
            <div className="p-8 h-full bg-[#050505] overflow-y-auto custom-scrollbar">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600 mb-8 flex items-center gap-2">
                <Terminal size={14} /> Execution Registry
              </h3>
              {runResult ? (
                <div className="space-y-6 animate-in fade-in duration-300">
                  {runResult.testCase?.map((tc, i) => (
                    <div key={i} className="group rounded-2xl border border-white/5 bg-white/2 p-6 transition-all hover:bg-white/4">
                      <div className="flex justify-between items-center mb-6">
                        <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Case_{i+1}</span>
                        <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border shadow-sm ${tc.status_id === 3 ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5' : 'text-rose-400 border-rose-500/20 bg-rose-500/5'}`}>
                          {tc.status_id === 3 ? 'ACCEPTED' : 'FAILURE'}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-6 font-mono text-[11px]">
                        <div className="space-y-2">
                          <p className="text-[9px] text-slate-600 uppercase font-black tracking-tighter italic">Stdin</p>
                          <div className="p-4 bg-black/40 rounded-xl border border-white/5 text-cyan-500/70 overflow-x-auto">{tc.stdin}</div>
                        </div>
                        <div className="space-y-2">
                          <p className="text-[9px] text-slate-600 uppercase font-black tracking-tighter italic">Stdout</p>
                          <div className="p-4 bg-black/40 rounded-xl border border-white/5 text-emerald-500/70 overflow-x-auto">{tc.stdout || "NULL"}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {runResult.errorMessage && (
                    <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs font-mono">
                       {runResult.errorMessage}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-slate-700">
                    <Layers size={40} className="mb-4 opacity-20" />
                    <p className="text-xs font-mono uppercase tracking-[0.2em] italic">Waiting for Transmission...</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="p-4 bg-[#0a0a0a] border-t border-white/5 flex justify-between items-center px-8 h-20">
            <button 
                onClick={() => setCode(problem?.startCode.find(sc => sc.language === langMap[selectedLanguage]).initialCode)}
                className="text-[9px] font-black text-slate-600 hover:text-white transition-colors tracking-[0.3em] uppercase italic flex items-center gap-2"
            >
                <RefreshCcw size={12} /> Reset Buffer
            </button>
            <div className="flex gap-4">
                <button
                    onClick={handleRun}
                    disabled={loading}
                    className="flex items-center gap-2 px-8 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/10 transition-all active:scale-95 disabled:opacity-50"
                >
                    <Play size={14} fill="currentColor" /> {loading ? 'Running...' : 'Run'}
                </button>
                <button
                    onClick={handleSubmitCode}
                    disabled={loading}
                    className="flex items-center gap-2 px-10 py-3 bg-cyan-600 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-cyan-500 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all active:scale-95 disabled:opacity-50"
                >
                    <Send size={14} /> {loading ? 'Encrypting...' : 'Submit'}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemPage;