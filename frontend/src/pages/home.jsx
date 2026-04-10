// import React, { useEffect, useState } from 'react';

// const HomePage = () => {
//   const [isVisible, setIsVisible] = useState(false);

//   useEffect(() => {
//     setIsVisible(true);
//   }, []);

//   return (
//     <div className="min-h-screen bg-black text-white overflow-hidden">
//       {/* Hero Section */}
//       <section className="relative flex flex-col md:flex-row items-center justify-between px-6 lg:px-20 py-10 md:py-24 max-w-7xl mx-auto gap-12">
        
//         {/* LEFT CONTENT: Text & CTA */}
//         <div className={`flex-1 space-y-8 transition-all duration-1000 transform ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'}`}>
//           <div className="space-y-4">
           
//             <h1 className="text-4xl md:text-6xl font-black leading-tight">
//               Master the <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">Algorithm.</span>
//             </h1>
//             <p className="text-lg md:text-xl text-slate-400 max-w-lg leading-relaxed italic border-l-2 border-cyan-500/30 pl-4">
//               "From beginners to competitive programmers, <span className="text-white font-bold">ALGORISE</span> helps you sharpen problem-solving skills."
//             </p>
//           </div>

//           {/* CTA Buttons */}
//           <div className="flex flex-wrap gap-5">
//             <button className="group relative px-8 py-4 overflow-hidden rounded-xl bg-cyan-600 font-bold transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(8,145,178,0.4)]">
//               <span className="relative z-10">Start Coding</span>
//               <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//             </button>
            
//             <button className="px-8 py-4 rounded-xl border border-white/10 font-bold hover:bg-white/5 transition-all">
//               Browse Problems
//             </button>
//           </div>

//           {/* Stats/Social Proof */}
//           <div className="flex gap-10 pt-8 border-t border-white/5">
//             <div>
//               <p className="text-2xl font-bold text-white">500+</p>
//               <p className="text-xs text-slate-500 uppercase tracking-widest">Problems</p>
//             </div>
//             <div>
//               <p className="text-2xl font-bold text-white">10k+</p>
//               <p className="text-xs text-slate-500 uppercase tracking-widest">Coders</p>
//             </div>
//           </div>
//         </div>

//         {/* RIGHT CONTENT: The Image with Glow Effects */}
//         <div className={`flex-1 relative transition-all duration-1000 delay-300 transform ${isVisible ? 'translate-y-0 opacity-100 shadow-[0_0_50px_rgba(6,182,212,0.15)]' : 'translate-y-20 opacity-0'}`}>
//           {/* Decorative Back-glow */}
//           <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-2xl blur-3xl -z-10 animate-pulse"></div>
          
//           <div className="relative rounded-2xl border border-white/10 overflow-hidden group">
//             <img 
//               src="/image.png" 
//               alt="Algorise Coding Environment" 
//               className="w-full h-auto object-cover transform group-hover:scale-105 transition duration-700"
//             />
//             {/* Glass Overlay on Image */}
//             <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
//           </div>
          
//           {/* Floating Element: Achievement Badge */}
//           <div className="absolute -bottom-6 -left-6 bg-slate-900/90 backdrop-blur-md border border-white/10 p-4 rounded-xl shadow-2xl hidden lg:block animate-bounce-slow">
//             <div className="flex items-center gap-3">
//               <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
//                 <span className="text-cyan-400 text-xl">🏆</span>
//               </div>
//               <div>
//                 <p className="text-xs text-slate-400">Daily Challenge</p>
//                 <p className="text-sm font-bold text-white">Graph Theory II</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Subtle Background Elements */}
//       <div className="fixed top-1/4 -right-20 w-80 h-80 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>
//       <div className="fixed bottom-0 -left-20 w-96 h-96 bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none"></div>
//     </div>
//   );
// };

// export default HomePage;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../utils/axiosClient';
import { getDailyChallenge } from '../utils/DailyChallenge';
import { Trophy } from 'lucide-react';

const HomePage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [dailyProblem, setDailyProblem] = useState(null);
  const navigate = useNavigate();

  const learningTracks = [
    { title: 'Beginner DSA', topics: 'Arrays • Strings • Basics', level: 'Easy', progress: '40 lessons' },
    { title: 'Interview Prep', topics: 'Trees • Graphs • DP', level: 'Medium', progress: '80 lessons' },
    { title: 'Contest Mode', topics: 'Greedy • Math • Bitmask', level: 'Hard', progress: '120 lessons' },
  ];

  const highlights = [
    { title: 'Structured Sheets', desc: 'Topic-wise question sheets with difficulty progression.' },
    { title: 'Company Focus', desc: 'Practice based on company patterns and interview trends.' },
    { title: 'Performance Analytics', desc: 'Track streaks, solve speed, and weak areas with clarity.' },
  ];

  const testimonials = [
    {
      name: 'Aarav, Final Year',
      quote: 'ALGORISE made my prep consistent. I moved from random solving to smart solving.',
    },
    {
      name: 'Meera, SDE Intern',
      quote: 'Daily challenge + sheets helped me crack OA rounds with confidence.',
    },
  ];

  useEffect(() => {
    setIsVisible(true);
    
    // Fetch problems to determine today's challenge
    const fetchDaily = async () => {
      try {
        const { data } = await axiosClient.get('/problem/getAllProblem');
        const selected = getDailyChallenge(data);
        setDailyProblem(selected);
      } catch (err) {
        console.error("Failed to sync daily challenge:", err);
      }
    };
    fetchDaily();
  }, []);

  const handleStartCoding = () => navigate('/practice');
  
  const goToDailyChallenge = () => {
    if (dailyProblem) navigate(`/problem/${dailyProblem._id}`);
  };

  return (
    <div className="min-h-screen text-white overflow-hidden selection:bg-cyan-500/30">
      {/* Hero Section */}
      <section className="relative flex flex-col md:flex-row items-center justify-between px-6 lg:px-20 py-10 md:py-24 max-w-7xl mx-auto gap-12">
        
        {/* LEFT CONTENT */}
        <div className={`flex-1 space-y-8 transition-all duration-1000 transform ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'}`}>
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-black leading-tight">
              Build elite <span className="bg-linear-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent italic">problem-solving skills.</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-400 max-w-lg leading-relaxed italic border-l-2 border-cyan-500/30 pl-4">
              "From interview prep to competitive coding, <span className="text-white font-bold">ALGORISE</span> gives you the structure to improve every day."
            </p>
          </div>

          <div className="flex flex-wrap gap-5">
            <button 
              onClick={handleStartCoding}
              className="group relative px-10 py-4 overflow-hidden rounded-xl bg-cyan-600 font-black tracking-widest uppercase text-xs transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(8,145,178,0.4)]"
            >
              <span className="relative z-10">Start Practicing</span>
              <div className="absolute inset-0 bg-linear-to-r from-cyan-400 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
            
            <button onClick={() => navigate('/practice')} className="px-10 py-4 rounded-xl border border-white/10 font-black tracking-widest uppercase text-xs hover:bg-white/5 transition-all">
              Browse Problems
            </button>
          </div>

          <div className="flex gap-10 pt-8 border-t border-white/5 font-mono">
            <div>
              <p className="text-3xl font-black text-white italic">500+</p>
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-[0.3em]">Problems</p>
            </div>
            <div>
              <p className="text-3xl font-black text-white italic">10k+</p>
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-[0.3em]">Active Learners</p>
            </div>
          </div>
        </div>

        {/* RIGHT CONTENT */}
        <div className={`flex-1 relative transition-all duration-1000 delay-300 transform ${isVisible ? 'translate-y-0 opacity-100 shadow-[0_0_50px_rgba(6,182,212,0.15)]' : 'translate-y-20 opacity-0'}`}>
          <div className="absolute -inset-4 bg-linear-to-r from-cyan-500/20 to-purple-500/20 rounded-2xl blur-3xl -z-10 animate-pulse"></div>
          
          <div className="relative rounded-2xl border border-white/10 overflow-hidden group">
            <img 
              src="/image.png" 
              alt="Algorise Coding Environment" 
              className="w-full h-auto object-cover transform group-hover:scale-105 transition duration-700"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
          </div>
          
          {/* DAILY CHALLENGE INTERACTIVE BADGE */}
          <div 
            onClick={goToDailyChallenge}
            className="absolute -bottom-6 -left-6 bg-slate-900/90 backdrop-blur-xl border border-white/10 p-5 rounded-2xl shadow-2xl cursor-pointer group/daily hidden lg:block animate-bounce-slow hover:border-cyan-500/50 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center group-hover/daily:scale-110 transition-transform">
                <Trophy className="text-amber-400" size={24} />
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Daily Challenge</p>
                <p className="text-sm font-black text-white uppercase group-hover/daily:text-cyan-400 transition-colors tracking-tight">
                  {dailyProblem ? dailyProblem.title : "Loading..."}
                </p>
              </div>
              <ArrowRight size={14} className="text-slate-600 group-hover/daily:text-cyan-400 group-hover/daily:translate-x-1 transition-all" />
            </div>
          </div>
        </div>
      </section>

      {/* Learning Tracks */}
      <section className="relative max-w-7xl mx-auto px-6 lg:px-20 pb-10 md:pb-16">
        <div className="mb-8">
          <p className="text-[11px] tracking-[0.3em] uppercase text-cyan-400 font-bold">Learning Paths</p>
          <h2 className="text-2xl md:text-4xl font-black mt-2">Choose your growth track</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {learningTracks.map((track) => (
            <div key={track.title} className="rounded-2xl border border-white/10 bg-white/2 p-6 hover:border-cyan-500/40 transition-all">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-black">{track.title}</h3>
                <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400">{track.level}</span>
              </div>
              <p className="text-sm text-slate-400 mb-3">{track.topics}</p>
              <p className="text-xs text-cyan-300 font-semibold">{track.progress}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Platform Highlights */}
      <section className="relative max-w-7xl mx-auto px-6 lg:px-20 pb-10 md:pb-16">
        <div className="rounded-3xl border border-white/10 bg-linear-to-b from-white/3 to-transparent p-7 md:p-10">
          <div className="grid md:grid-cols-3 gap-6">
            {highlights.map((item) => (
              <div key={item.title}>
                <h3 className="text-lg font-black mb-2">{item.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials + Final CTA */}
      <section className="relative max-w-7xl mx-auto px-6 lg:px-20 pb-16 md:pb-24">
        <div className="grid lg:grid-cols-2 gap-6 items-stretch">
          <div className="space-y-4">
            {testimonials.map((item) => (
              <div key={item.name} className="rounded-2xl border border-white/10 bg-white/2 p-6">
                <p className="text-slate-300 italic">“{item.quote}”</p>
                <p className="text-xs tracking-widest uppercase text-cyan-400 mt-4 font-bold">{item.name}</p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-8 flex flex-col justify-between">
            <div>
              <p className="text-[11px] tracking-[0.3em] uppercase text-cyan-300 font-bold mb-3">Ready to Begin?</p>
              <h3 className="text-2xl md:text-3xl font-black mb-3">Start your daily consistency streak today.</h3>
              <p className="text-slate-300 text-sm leading-relaxed">Solve one problem every day and let ALGORISE guide what to solve next.</p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={handleStartCoding}
                className="px-6 py-3 rounded-xl bg-cyan-500 text-black text-xs font-black tracking-widest uppercase hover:bg-cyan-400 transition-colors"
              >
                Start Now
              </button>
              <button
                onClick={goToDailyChallenge}
                className="px-6 py-3 rounded-xl border border-white/20 text-xs font-black tracking-widest uppercase hover:bg-white/5 transition-colors"
              >
                Open Daily Challenge
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Decorative Glows */}
      <div className="fixed top-1/4 -right-20 w-80 h-80 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="fixed bottom-0 -left-20 w-96 h-96 bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none"></div>
    </div>
  );
};

// Helper for the arrow icon in the daily badge
const ArrowRight = ({ size, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
);

export default HomePage;