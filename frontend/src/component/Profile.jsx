import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  User, MapPin, Code2, Trophy, 
  Calendar, Zap, Activity, Target, ChevronRight 
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  Tooltip 
} from 'recharts';
import axiosClient from '../utils/axiosClient';

const Profile = () => {
  const navigate = useNavigate();
  // Accessing user data from Redux state (authSlice)
  const { user } = useSelector((state) => state.auth); 
  const [stats, setStats] = useState({ solved: 0, difficultyDist: [] });
  const [loading, setLoading] = useState(true);

  // User Identity Context
  const profileInfo = {
    name: user?.firstName || "Anshu Gupta", 
    location: "Delhi, India", 
    languages: ["C++", "React", "Next.js", "Java", "Node.js"], 
    joined: user?.createdAt 
      ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) 
      : "Feb 2026" 
  };

  // Logic to fetch solved problems from backend
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const { data } = await axiosClient.get('/problem/problemSolvedByUser');
        
        // Distribution for the Mastery Chart
        const dist = [
          { name: 'Easy', value: data.filter(p => p.difficulty === 'easy').length, color: '#10b981' },
          { name: 'Medium', value: data.filter(p => p.difficulty === 'medium').length, color: '#f59e0b' },
          { name: 'Hard', value: data.filter(p => p.difficulty === 'hard').length, color: '#ef4444' },
        ];
        
        setStats({
          solved: data.length,
          difficultyDist: dist
        });
      } catch (err) {
        console.error("Profile Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, []);

  // Initials generator for the Avatar
  const getInitials = (name) => {
    const parts = name.trim().split(' ');
    return parts.length > 1 ? `${parts[0][0]}${parts[parts.length - 1][0]}` : parts[0][0];
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-cyan-500/20 border-t-cyan-500"></div>
    </div>
  );

  return (
    <div className="relative min-h-screen overflow-hidden px-6 pb-20 pt-24 text-white">
      {/* Background Neon Decor */}
      <div className="absolute top-0 right-0 w-150 h-150 bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: User Card */}
        <div className="lg:col-span-1 space-y-8 animate-in fade-in slide-in-from-left duration-700">
          <div className="bg-white/3 border border-white/10 rounded-[2.5rem] p-10 backdrop-blur-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
               <User size={80} />
            </div>
            
            <div className="w-24 h-24 rounded-3xl bg-linear-to-br from-cyan-500 to-purple-600 p-1 mb-6 shadow-2xl">
              <div className="w-full h-full bg-[#0a0a0a] rounded-[1.4rem] flex items-center justify-center">
                <span className="text-3xl font-black text-white italic uppercase">
                  {getInitials(profileInfo.name)}
                </span>
              </div>
            </div>

            <h1 className="text-3xl font-black tracking-tighter uppercase italic mb-2">{profileInfo.name}</h1>
            <p className="mb-8 text-[10px] font-mono uppercase tracking-[0.24em] text-slate-500">
                {user?.role || "Member"} profile
            </p>
            
            <div className="space-y-4 border-t border-white/5 pt-8">
              <div className="flex items-center gap-3 text-slate-400">
                <MapPin size={16} className="text-cyan-500" />
                <span className="text-sm font-medium">{profileInfo.location}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-400">
                <Calendar size={16} className="text-purple-500" />
                <span className="text-sm font-medium">Joined {profileInfo.joined}</span>
              </div>
            </div>

            <div className="mt-10 flex flex-wrap gap-2">
              {profileInfo.languages.map(lang => (
                <span key={lang} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] font-black uppercase tracking-widest text-slate-400">
                  {lang}
                </span>
              ))}
            </div>
          </div>

          {/* ACTIVITY FEED */}
          <div className="bg-white/3 border border-white/10 rounded-[2.5rem] p-8">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 mb-6 flex items-center gap-2">
              <Activity size={16} className="text-emerald-500" /> System_Logs
            </h3>
            <div className="space-y-4 text-[10px] font-mono">
              <p className="text-slate-400"><span className="text-cyan-500">Solved:</span> Daily Objective</p>
              <p className="text-slate-400"><span className="text-purple-500">Active:</span> Developing Algorise</p>
              <p className="text-slate-400"><span className="text-amber-500">Node:</span> {profileInfo.location}</p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Stats & Charts */}
        <div className="lg:col-span-2 space-y-8 animate-in fade-in slide-in-from-bottom duration-1000">
          
          {/* TOP CARDS: Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Problems Solved */}
            <div className="bg-white/3 border border-white/10 p-8 rounded-4xl hover:bg-white/5 transition-all group">
                <Target size={24} className="text-cyan-400 mb-4 group-hover:scale-110 transition-transform" />
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">Problems Solved</p>
                <p className="text-3xl font-black italic">{stats.solved}</p>
            </div>

            {/* Current Streak */}
            <div className="bg-white/3 border border-white/10 p-8 rounded-4xl hover:bg-white/5 transition-all group">
                <Zap size={24} className="text-amber-400 mb-4 group-hover:scale-110 transition-transform" />
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">Current Streak</p>
                <p className="text-3xl font-black italic">{user?.streak || 0} Days</p>
            </div>

            {/* Global Rank - Navigates to Leaderboard */}
            <button 
              onClick={() => navigate('/leaderboard')}
              className="bg-white/3 border border-white/10 p-8 rounded-4xl hover:bg-white/8 transition-all group text-left relative overflow-hidden"
            >
                <Trophy size={24} className="text-purple-400 mb-4 group-hover:scale-110 transition-transform" />
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">Global Rank</p>
                <div className="flex items-center justify-between">
                    <p className="text-3xl font-black italic">{user?.globalRank ? `#${user.globalRank}` : 'N/A'}</p>
                    <ChevronRight size={20} className="text-slate-700 group-hover:text-purple-400 transition-colors" />
                </div>
                <span className="absolute bottom-3 right-8 text-[8px] font-bold text-slate-700 uppercase tracking-[0.2em] group-hover:text-slate-400 transition-colors">
                    View Leaderboard
                </span>
            </button>
          </div>

          {/* MASTERY DISTRIBUTION */}
          <div className="bg-white/3 border border-white/10 rounded-[2.5rem] p-10 backdrop-blur-sm">
            <h2 className="mb-10 flex items-center gap-3 text-xl font-black tracking-tight">
              <Code2 className="text-cyan-500" /> Difficulty breakdown
            </h2>
            
            <div className="h-75 w-full flex flex-col md:flex-row items-center gap-10">
              <div className="h-full w-full md:w-1/2">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.difficultyDist}
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={8}
                      dataKey="value"
                    >
                      {stats.difficultyDist.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #333', borderRadius: '12px' }} 
                        itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="w-full md:w-1/2 space-y-6">
                {stats.difficultyDist.map((entry) => (
                  <div key={entry.name} className="space-y-2">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                      <span className="text-slate-500">{entry.name} Modules</span>
                      <span>{entry.value} Solved</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className="h-full transition-all duration-1000" 
                        style={{ 
                          width: stats.solved > 0 ? `${(entry.value / stats.solved) * 100}%` : '0%', 
                          backgroundColor: entry.color 
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;