



// import React from "react";
// import { useNavigate } from "react-router-dom";
// import { Plus, Edit, Trash2, Video, ShieldCheck, Activity, Users, FileCode, CheckCircle } from 'lucide-react';

// function Admin() {
//     const navigate = useNavigate();
    
//     // Quick Stats Data
//     const stats = [
//         { label: "Total Problems", value: "542", icon: FileCode, color: "text-cyan-400" },
//         { label: "Active Users", value: "12.8k", icon: Users, color: "text-purple-400" },
//         { label: "Submissions Today", value: "1,204", icon: Activity, color: "text-emerald-400" },
//         { label: "Server Uptime", value: "99.9%", icon: CheckCircle, color: "text-blue-400" },
//     ];

//     const adminOptions = [
//         { id: 'create', title: "Create Problem", description: 'Add a new coding problem to the platform', icon: Plus, color: 'from-emerald-400 to-cyan-500', glow: 'shadow-emerald-500/20', route: '/admin/create' },
//         { id: 'update', title: 'Update Problem', description: 'Edit existing Problem and their details', icon: Edit, color: 'from-amber-400 to-orange-500', glow: 'shadow-orange-500/20', route: '/admin/update/:id' },
//         { id: 'delete', title: 'Delete Problem', description: 'Remove problems from the platform', icon: Trash2, color: 'from-rose-400 to-red-600', glow: 'shadow-red-500/20', route: '/admin/delete' },
//         { id: 'video', title: 'Video Solutions', description: 'Upload and manage video tutorials', icon: Video, color: 'from-purple-400 to-fuchsia-600', glow: 'shadow-fuchsia-500/20', route: '/admin/video' },
//         {
//             id:"user-management",
//       title: "User Management",
//       description: "Assign roles and monitor access",
//       path: "/admin/user-management",
//       icon: Users,
//       color: "from-purple-500 to-fuchsia-600",
//       glow: 'shadow-fuchsia-500/20',
//       route: "/admin/user-management",
//       shadow: "shadow-purple-500/20"
//     },
//     ];

//     return (
//         <div className="min-h-screen bg-black text-white relative overflow-hidden pb-20">
//             {/* Background Glows */}
//             <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none"></div>
//             <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-500/5 blur-[120px] rounded-full pointer-events-none"></div>

//             <div className="container mx-auto px-6 pt-16 relative z-10">
                
//                 {/* 1. Header Section */}
//                 <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
//                     <div>
//                         <div className="flex items-center gap-3 mb-4">
//                             <ShieldCheck className="text-cyan-400" size={24} />
//                             <h2 className="text-cyan-400 font-mono text-xs tracking-[0.4em] uppercase">Root Privileges Active</h2>
//                         </div>
//                         <h1 className="text-5xl font-black tracking-tighter">Command Center</h1>
//                     </div>
//                     <div className="bg-slate-900/50 border border-white/5 px-4 py-2 rounded-lg backdrop-blur-md">
//                         <p className="text-slate-500 text-xs uppercase font-bold tracking-widest">System Status</p>
//                         <p className="text-emerald-400 text-sm font-mono flex items-center gap-2">
//                             <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span> Operational
//                         </p>
//                     </div>
//                 </div>

//                 {/* 2. Quick Stats Grid */}
//                 <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
//                     {stats.map((stat, i) => (
//                         <div key={i} className="bg-slate-900/30 border border-white/5 p-6 rounded-2xl backdrop-blur-sm">
//                             <stat.icon size={20} className={`${stat.color} mb-3`} />
//                             <p className="text-slate-500 text-xs uppercase font-bold tracking-wider">{stat.label}</p>
//                             <p className="text-2xl font-black text-white">{stat.value}</p>
//                         </div>
//                     ))}
//                 </div>

//                 {/* 3. Action Grid */}
//                 <h3 className="text-sm font-bold text-slate-500 uppercase tracking-[0.2em] mb-6 ml-1">Management Modules</h3>
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
//                     {adminOptions.map((option) => (
//                         <div key={option.id} onClick={() => navigate(option.route)} className="group relative cursor-pointer">
//                             <div className="absolute -inset-[1px] bg-white/10 rounded-2xl group-hover:bg-gradient-to-br transition-all duration-500 group-hover:from-white/20 group-hover:to-white/5"></div>
//                             <div className="relative bg-slate-900/40 backdrop-blur-xl p-8 rounded-2xl border border-white/5 flex flex-col items-center text-center transition-all duration-500 group-hover:-translate-y-2 h-full">
//                                 <div className={`p-4 rounded-2xl mb-6 bg-gradient-to-br ${option.color} shadow-lg ${option.glow}`}>
//                                     <option.icon size={28} className="text-black" />
//                                 </div>
//                                 <h2 className="text-lg font-bold text-white mb-2">{option.title}</h2>
//                                 <p className="text-slate-400 text-xs leading-relaxed mb-6">{option.description}</p>
//                                 <div className="mt-auto pt-4 border-t border-white/5 w-full text-[10px] font-black tracking-[0.2em] text-slate-600 group-hover:text-cyan-400 transition-colors uppercase">Execute Module</div>
//                             </div>
//                         </div>
//                     ))}
//                 </div>

//                 {/* 4. Recent Platform Activity (New Section) */}
//                 <div className="bg-slate-900/30 border border-white/5 rounded-2xl p-8 backdrop-blur-sm">
//                     <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
//                         <Activity size={20} className="text-purple-500" /> Recent Activity Log
//                     </h3>
//                     <div className="space-y-6">
//                         {[
//                             { user: "alex_coder", action: "submitted solution for", target: "Two Sum", time: "2 mins ago" },
//                             { user: "admin_master", action: "created new problem", target: "Dijkstra's Path", time: "15 mins ago" },
//                             { user: "sarah_dev", action: "unlocked achievement", target: "DP King", time: "1 hour ago" },
//                         ].map((log, i) => (
//                             <div key={i} className="flex items-center justify-between text-sm border-b border-white/5 pb-4 last:border-0 last:pb-0">
//                                 <div className="flex gap-3">
//                                     <span className="text-cyan-400 font-bold">@{log.user}</span>
//                                     <span className="text-slate-500">{log.action}</span>
//                                     <span className="text-white font-medium">{log.target}</span>
//                                 </div>
//                                 <span className="text-slate-600 font-mono text-xs">{log.time}</span>
//                             </div>
//                         ))}
//                     </div>
//                 </div>

//             </div>
//         </div>
//     );
// }

// export default Admin;

import React from "react";
import { useNavigate } from "react-router-dom";
import { 
    Plus, Edit, Trash2, Video, ShieldCheck, Activity, 
    Users, FileCode, CheckCircle, ArrowUpRight, Trophy, ClipboardList 
} from 'lucide-react';

function Admin() {
    const navigate = useNavigate();
    
    const stats = [
        { label: "Total Problems", value: "542", icon: FileCode, color: "text-cyan-400", glow: "shadow-cyan-500/20" },
        { label: "Active Users", value: "12.8k", icon: Users, color: "text-purple-400", glow: "shadow-purple-500/20" },
        { label: "Submissions Today", value: "1,204", icon: Activity, color: "text-emerald-400", glow: "shadow-emerald-500/20" },
        { label: "Server Uptime", value: "99.9%", icon: CheckCircle, color: "text-blue-400", glow: "shadow-blue-500/20" },
    ];

    const adminOptions = [
        { id: 'create', title: "Create Problem", description: 'Add a new coding problem to the platform', icon: Plus, color: 'from-emerald-400 to-cyan-500', glow: 'shadow-emerald-500/40', route: '/admin/create' },
        { id: 'update', title: 'Update Problem', description: 'Edit existing Problem and their details', icon: Edit, color: 'from-amber-400 to-orange-500', glow: 'shadow-orange-500/40', route: '/admin/update/:id' },
        { id: 'delete', title: 'Delete Problem', description: 'Remove problems from the platform', icon: Trash2, color: 'from-rose-400 to-red-600', glow: 'shadow-red-500/40', route: '/admin/delete' },
        { id: 'video', title: 'Video Solutions', description: 'Upload and manage video tutorials', icon: Video, color: 'from-purple-400 to-fuchsia-600', glow: 'shadow-fuchsia-500/40', route: '/admin/video' },
        { id: 'contest-builder', title: 'Contest Builder', description: 'Create contests and assign problems to them', icon: Trophy, color: 'from-cyan-400 to-blue-500', glow: 'shadow-cyan-500/40', route: '/admin/contest' },
        { id: 'interview-control', title: 'Interview Control', description: 'Manage mock assessment packs and pricing', icon: ClipboardList, color: 'from-amber-300 to-orange-500', glow: 'shadow-amber-500/40', route: '/admin/interview' },
        { id: 'user-management', title: "User Management", description: "Assign roles and monitor access", icon: Users, color: "from-blue-500 to-indigo-600", glow: 'shadow-blue-500/40', route: "/admin/user-management" },
    ];

    return (
        <div className="min-h-screen bg-[#020202] text-white relative overflow-hidden pb-20 selection:bg-cyan-500/30">
            {/* Background Atmosphere */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-cyan-500/5 blur-[150px] rounded-full pointer-events-none animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-purple-500/5 blur-[150px] rounded-full pointer-events-none"></div>

            <div className="container mx-auto px-6 pt-16 relative z-10 perspective-1000">
                
                {/* 1. Header Section */}
                <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8 animate-in fade-in slide-in-from-top duration-700">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <ShieldCheck className="text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.4)]" size={24} />
                            <h2 className="text-cyan-400 font-mono text-[10px] tracking-[0.5em] uppercase">Root Privileges Active</h2>
                        </div>
                        <h1 className="text-6xl font-black tracking-tighter italic uppercase">
                            Command <span className="text-slate-700">Center</span>
                        </h1>
                    </div>
                    <div className="group bg-white/5 border border-white/10 px-6 py-3 rounded-2xl backdrop-blur-xl transform transition-transform hover:scale-105 duration-300">
                        <p className="text-slate-500 text-[9px] uppercase font-black tracking-widest mb-1">Grid Status</p>
                        <p className="text-emerald-400 text-sm font-mono flex items-center gap-2">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span> 
                            <span className="font-bold uppercase tracking-tighter">Operational</span>
                        </p>
                    </div>
                </div>

                {/* 2. Quick Stats Grid - Floating Effect */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    {stats.map((stat, i) => (
                        <div key={i} 
                            style={{ animationDelay: `${i * 100}ms` }}
                            className="bg-white/[0.03] border border-white/10 p-6 rounded-2xl backdrop-blur-md transform transition-all duration-500 hover:bg-white/[0.07] hover:-translate-y-2 hover:shadow-2xl animate-in zoom-in-95"
                        >
                            <div className={`${stat.color} mb-4 p-2 bg-white/5 inline-block rounded-lg shadow-inner`}>
                                <stat.icon size={20} />
                            </div>
                            <p className="text-slate-500 text-[10px] uppercase font-black tracking-widest">{stat.label}</p>
                            <p className="text-3xl font-black text-white mt-1">{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* 3. Action Grid - 3D Perspective Transform */}
                <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] mb-8 ml-1">Management Modules</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-20">
                    {adminOptions.map((option, i) => (
                        <div 
                            key={option.id} 
                            onClick={() => navigate(option.route)} 
                            style={{ animationDelay: `${i * 150}ms` }}
                            className="group relative cursor-pointer preserve-3d transition-all duration-700 hover:[transform:rotateX(10deg)_rotateY(-10deg)]"
                        >
                            {/* Card Glow Background */}
                            <div className="absolute -inset-1 bg-gradient-to-br opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-[2rem] blur-xl bg-white"></div>
                            
                            <div className="relative h-full bg-slate-900/40 backdrop-blur-2xl p-8 rounded-[2rem] border border-white/10 flex flex-col items-center text-center shadow-2xl transition-all duration-500 group-hover:translate-z-10 group-hover:border-white/20">
                                
                                <div className={`p-5 rounded-2xl mb-8 bg-gradient-to-br ${option.color} shadow-2xl ${option.glow} transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6`}>
                                    <option.icon size={32} className="text-black" />
                                </div>

                                <h2 className="text-xl font-black text-white mb-3 tracking-tight uppercase group-hover:text-cyan-400 transition-colors">
                                    {option.title}
                                </h2>
                                <p className="text-slate-500 text-xs leading-relaxed mb-8 px-2 font-medium italic">
                                    {option.description}
                                </p>

                                <div className="mt-auto w-full pt-6 border-t border-white/5 flex items-center justify-center gap-2 text-[9px] font-black tracking-[0.3em] text-slate-600 group-hover:text-cyan-400 transition-all uppercase">
                                    Execute Module <ArrowUpRight size={12} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* 4. Recent Activity Log - Sleek Glassmorphism */}
                <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-10 backdrop-blur-3xl animate-in fade-in slide-in-from-bottom duration-1000 shadow-inner">
                    <div className="flex items-center justify-between mb-10">
                        <h3 className="text-sm font-black text-white uppercase tracking-[0.3em] flex items-center gap-4">
                            <Activity size={18} className="text-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]" /> Real-time System Log
                        </h3>
                        <div className="flex gap-2">
                            <div className="w-2 h-2 rounded-full bg-slate-800"></div>
                            <div className="w-2 h-2 rounded-full bg-slate-800"></div>
                            <div className="w-2 h-2 rounded-full bg-slate-800"></div>
                        </div>
                    </div>

                    <div className="space-y-1">
                        {[
                            { user: "alex_coder", action: "DEPLOYED_SOLUTION", target: "Invert Binary Tree", time: "02:14:05" },
                            { user: "admin_master", action: "MOD_CREATED", target: "Dijkstra_Optimized", time: "02:10:55" },
                            { user: "sarah_dev", action: "BADGE_EARNED", target: "DP_EXPERT", time: "01:55:20" },
                        ].map((log, i) => (
                            <div key={i} className="group flex items-center justify-between py-4 px-4 rounded-xl hover:bg-white/5 transition-all duration-300">
                                <div className="flex items-center gap-6">
                                    <span className="text-[10px] font-mono text-slate-600 tracking-tighter">{log.time}</span>
                                    <div className="flex gap-2 text-xs font-mono">
                                        <span className="text-cyan-500 font-black">@{log.user}</span>
                                        <span className="text-slate-500 font-bold uppercase tracking-tighter">[{log.action}]</span>
                                        <span className="text-slate-200 font-medium">"{log.target}"</span>
                                    </div>
                                </div>
                                <div className="h-1 w-12 bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-cyan-500 w-1/2 group-hover:w-full transition-all duration-700"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Admin;