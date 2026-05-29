import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Trophy, Zap, Target, Medal, Crown } from 'lucide-react';
import axiosClient from '../utils/axiosClient';

const Leaderboard = () => {
  const { user: currentUser } = useSelector((state) => state.auth);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const { data } = await axiosClient.get('/user/getleaderboard');
        setLeaderboard(data);
      } catch (err) {
        console.error("Failed to fetch leaderboard:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  const getRankStyle = (index) => {
    switch (index) {
      case 0: return { border: 'border-amber-500/50', bg: 'bg-amber-500/10', text: 'text-amber-500', icon: <Crown size={16} /> };
      case 1: return { border: 'border-slate-300/50', bg: 'bg-slate-300/10', text: 'text-slate-300', icon: <Medal size={16} /> };
      case 2: return { border: 'border-orange-500/50', bg: 'bg-orange-500/10', text: 'text-orange-500', icon: <Medal size={16} /> };
      default: return { border: 'border-white/5', bg: 'bg-white/[0.02]', text: 'text-slate-500', icon: null };
    }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-cyan-500/20 border-t-cyan-500"></div>
    </div>
  );

  return (
    <div className="relative min-h-screen overflow-hidden px-6 pb-20 pt-24 text-white">
      {/* Visual background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-200 h-100 bg-purple-600/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-4xl mx-auto">
        <div className="mb-16 text-center">
          <h1 className="mb-4 text-5xl font-black tracking-tight">Global Leaderboard</h1>
          <p className="text-xs font-mono uppercase tracking-[0.24em] text-slate-500">Ranking based on solved consistency and XP</p>
        </div>

        <div className="space-y-4">
          {leaderboard.map((player, index) => {
            const isMe = player._id === currentUser?._id;
            const style = getRankStyle(index);

            return (
              <div 
                key={player._id}
                className={`relative flex items-center justify-between p-6 rounded-3xl border transition-all hover:scale-[1.01] ${style.border} ${style.bg} ${isMe ? 'ring-2 ring-cyan-500/50' : ''}`}
              >
                <div className="flex items-center gap-6">
                  {/* Rank Number */}
                  <div className={`w-10 text-xl font-black ${style.text}`}>
                    #{index + 1}
                  </div>

                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full bg-black border border-white/10 flex items-center justify-center font-black text-sm text-white overflow-hidden">
                    {player.firstName?.charAt(0)}
                  </div>

                  {/* Identity */}
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-black uppercase tracking-tight text-white">{player.firstName} {player.lastName}</p>
                      {style.icon}
                      {isMe && <span className="bg-cyan-500 text-black text-[8px] font-black px-2 py-0.5 rounded uppercase">You</span>}
                    </div>
                    <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Architect_{player._id.slice(-4)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-10">
                  <div className="text-right hidden sm:block">
                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1 flex items-center justify-end gap-1">
                      <Zap size={10} className="text-amber-500" /> Streak
                    </p>
                    <p className="text-sm font-black text-white">{player.streak || 0} Days</p>
                  </div>
                  <div className="text-right min-w-20">
                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1 flex items-center justify-end gap-1">
                      <Target size={10} className="text-cyan-500" /> Score
                    </p>
                    <p className="text-xl font-black text-cyan-400">{player.xp || 0}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;