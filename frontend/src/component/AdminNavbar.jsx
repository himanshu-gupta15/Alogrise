// import React from 'react';
// import { NavLink, useNavigate } from 'react-router-dom';
// import { ShieldCheck, LayoutDashboard, LogOut, Terminal } from 'lucide-react';

// const AdminNavbar = () => {
//   const navigate = useNavigate();

//   return (
//     <nav className="sticky top-0 z-50 w-full bg-black/90 backdrop-blur-xl border-b border-cyan-500/20">
//       <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        
//         {/* Logo Section */}
//         <div className="flex items-center gap-4">
//           <div className="flex items-center gap-2 group cursor-pointer" onClick={() => navigate('/admin')}>
//             <ShieldCheck className="text-cyan-500 group-hover:rotate-12 transition-transform" size={24} />
//             <span className="text-xl font-black tracking-tighter text-white">
//               ALGORISE <span className="text-cyan-500 text-xs font-mono ml-1 uppercase">Admin_OS</span>
//             </span>
//           </div>
//         </div>

//         {/* Navigation Links */}
//         <div className="hidden md:flex items-center gap-6">
//           {[
//             { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
//             { name: 'Terminal', path: '/', icon: Terminal },
//           ].map((item) => (
//             <NavLink
//               key={item.name}
//               to={item.path}
//               className={({ isActive }) => `flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all
//                 ${isActive ? 'text-cyan-400' : 'text-slate-500 hover:text-white'}`}
//             >
//               <item.icon size={14} />
//               {item.name}
//             </NavLink>
//           ))}
//         </div>

//         {/* Exit Action */}
//         <button 
//           onClick={() => navigate('/')}
//           className="flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[10px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all"
//         >
//           <LogOut size={14} /> Exit Admin
//         </button>
//       </div>
//     </nav>
//   );
// };

// export default AdminNavbar;


import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../authSlice';
import { ShieldAlert, LayoutDashboard, Terminal, LogOut, User as UserIcon, Menu, X } from 'lucide-react';

const AdminNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logoutUser());
    setShowProfileMenu(false);
    navigate('/signin');
  };

  const navLinks = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Terminal', path: '/', icon: Terminal },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-black/80 backdrop-blur-xl border-b border-white/10 transition-all duration-500">
      {/* Top Neon Accent Line */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* LEFT SIDE: LOGO & ADMIN LINKS */}
          <div className="flex items-center gap-12">
            <Link to="/admin" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full blur opacity-40 group-hover:opacity-100 transition duration-500"></div>
                <div className="relative w-10 h-10 rounded-full border border-white/20 overflow-hidden bg-black flex items-center justify-center">
                  <ShieldAlert className="text-cyan-400" size={20} />
                </div>
              </div>
              <span className="text-2xl font-black tracking-tighter bg-gradient-to-r from-white via-slate-200 to-slate-500 bg-clip-text text-transparent group-hover:from-cyan-400 group-hover:to-purple-500 transition-all duration-500">
                ALGORISE <span className="text-[10px] font-mono ml-1 text-cyan-500 uppercase tracking-[0.2em]">Admin_OS</span>
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((item) => (
                <Link key={item.name} to={item.path} className="group relative flex items-center gap-2">
                  <item.icon size={14} className="text-slate-500 group-hover:text-cyan-400 transition-colors" />
                  <span className="text-sm font-black tracking-widest uppercase bg-gradient-to-r from-slate-100 to-slate-500 bg-clip-text text-transparent group-hover:from-cyan-400 group-hover:to-purple-500 transition-all duration-500">
                    {item.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* RIGHT SIDE: ADMIN PROFILE */}
          <div className="hidden md:flex items-center">
              <div className="relative">
                <button 
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-3 focus:outline-none group bg-white/5 hover:bg-white/10 p-2 pr-4 rounded-full border border-white/10 transition-all"
                >
                  <div className="w-10 h-10 rounded-full p-[2px] bg-gradient-to-r from-cyan-500 to-purple-600">
                    <div className="w-full h-full rounded-full bg-slate-900 border border-black flex items-center justify-center text-white font-black overflow-hidden uppercase">
                      {user?.firstName?.charAt(0) || 'A'}
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-black text-white leading-tight uppercase tracking-tight">{user?.firstName}</p>
                    <p className="text-[9px] font-black text-cyan-500 uppercase tracking-widest">System Admin</p>
                  </div>
                </button>

                {/* Dropdown Menu */}
                {showProfileMenu && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowProfileMenu(false)}></div>
                    <div className="absolute right-0 mt-4 w-64 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl py-3 z-20 backdrop-blur-xl animate-in fade-in slide-in-from-top-2">
                      <div className="px-4 py-3 border-b border-white/5 mb-2">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></div>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Auth_Token: Verified</p>
                        </div>
                        <p className="text-xs font-bold text-white truncate font-mono">{user?.emailId}</p>
                      </div>
                      <Link to="/" onClick={() => setShowProfileMenu(false)} className="flex items-center gap-3 px-4 py-3 text-xs font-black uppercase tracking-widest text-slate-300 hover:text-cyan-400 hover:bg-white/5 transition-all">
                        <Terminal size={14} /> Exit to Terminal
                      </Link>
                      <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-xs font-black uppercase tracking-widest text-rose-500 hover:bg-rose-500/10 transition-all">
                        <LogOut size={14} />LogOut
                      </button>
                    </div>
                  </>
                )}
              </div>
          </div>

          {/* Mobile Menu Icon */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-white p-2">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div> 
        </div>
      </div>

      {/* MOBILE MENU OVERLAY */}
      <div 
        className={`md:hidden fixed top-20 left-0 w-full bg-black/95 backdrop-blur-2xl border-b border-white/10 transition-all duration-500 ease-in-out ${
          isOpen ? 'translate-y-0 opacity-100 visible h-screen' : '-translate-y-10 opacity-0 invisible h-0 overflow-hidden'
        }`}
      >
        <div className="flex flex-col items-center gap-10 pt-16">
          <div className="text-center">
            <p className="text-2xl font-black text-white uppercase">{user?.firstName}</p>
            <p className="text-xs font-mono text-cyan-500 uppercase tracking-[0.3em]">Root_Access</p>
          </div>
          {navLinks.map((item) => (
            <Link key={item.name} to={item.path} onClick={() => setIsOpen(false)} className="text-xl font-black text-slate-400 hover:text-cyan-400 uppercase tracking-[0.2em]">{item.name}</Link>
          ))}
          <button onClick={handleLogout} className="text-sm font-black text-rose-500 tracking-[0.4em] mt-10">LogOut</button>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;