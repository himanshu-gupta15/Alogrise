// import React, { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom'; // Added Link for smoother navigation

// const Navbar = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const navigate = useNavigate();

//   // Helper to handle link paths
//   const getPath = (item) => item.toLowerCase() === 'home' ? '/' : `/${item.toLowerCase().replace(' ', '')}`;

//   return (
//     <nav className="sticky top-0 z-50 w-full bg-black/80 backdrop-blur-xl border-b border-white/10 transition-all duration-500">
//       <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
      
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between h-20">
          
//           {/* LEFT SIDE: LOGO & NAV LINKS */}
//           <div className="flex items-center gap-10">
//             <Link to="/" className="flex items-center gap-3 group cursor-pointer">
//               <div className="relative">
//                 <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full blur opacity-40 group-hover:opacity-100 transition duration-500"></div>
//                 <div className="relative w-10 h-10 rounded-full border border-white/20 overflow-hidden bg-black">
//                   <img src="/logo.png" alt="ALGORISE" className="w-full h-full object-cover transform group-hover:scale-110 transition duration-500" />
//                 </div>
//               </div>
//               <span className="text-2xl font-black tracking-tighter bg-gradient-to-r from-white via-slate-200 to-slate-500 bg-clip-text text-transparent group-hover:from-cyan-400 group-hover:to-purple-500 transition-all duration-500">
//                 ALGORISE
//               </span>
//             </Link>

//             <div className="hidden md:flex items-center gap-8">
//               {['Home', 'About Us', 'Practice'].map((item) => (
//                 <Link key={item} to={getPath(item)} className="group relative">
//                   <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-slate-100 via-slate-300 to-slate-500 bg-clip-text text-transparent group-hover:from-cyan-400 group-hover:to-purple-500 transition-all duration-500">
//                     {item}
//                   </span>
//                 </Link>
//               ))}
//             </div>
//           </div>

//           {/* RIGHT SIDE: AUTH BUTTONS */}
//           <div className="hidden md:flex items-center gap-8">
//             <button 
//               onClick={() => navigate('/signin')} 
//               className="group relative transition-all duration-300"
//             >
//               <span className="text-lg font-black tracking-widest bg-gradient-to-r from-slate-400 via-slate-500 to-slate-600 bg-clip-text text-transparent group-hover:from-cyan-400 group-hover:to-purple-500 transition-all duration-500" onClick={() => navigate('/sigin')} >
//                 SIGN IN
//               </span>
//             </button>
            
//             <button 
//               onClick={() => navigate('/signup')} 
//               className="group relative px-7 py-2.5"
//             >
//               <div className="absolute inset-0 bg-gradient-to-r from-[#FF00FF] to-[#00FFFF] rounded-full blur-md opacity-40 group-hover:opacity-80 transition duration-500"></div>
//               <div className="relative flex items-center justify-center bg-black rounded-full px-7 py-2.5 border border-white/10 group-hover:border-white/0 transition-all">
//                 <span className="bg-gradient-to-r from-[#FF00FF] to-[#00FFFF] bg-clip-text text-transparent font-bold text-lg tracking-wide group-hover:text-white transition duration-200">
//                   Create Account
//                 </span>
//               </div>
//             </button>
//           </div>

//           {/* Mobile Menu Icon */}
//           <div className="md:hidden flex items-center">
//             <button onClick={() => setIsOpen(!isOpen)} className="text-white p-2 focus:outline-none">
//               <div className="w-6 h-5 flex flex-col justify-between">
//                 <span className={`h-0.5 w-full bg-white transition-all duration-300 transform origin-left ${isOpen ? 'rotate-[42deg]' : ''}`}></span>
//                 <span className={`h-0.5 w-full bg-white transition-all duration-300 ${isOpen ? 'opacity-0' : 'opacity-100'}`}></span>
//                 <span className={`h-0.5 w-full bg-white transition-all duration-300 transform origin-left ${isOpen ? '-rotate-[42deg]' : ''}`}></span>
//               </div>
//             </button>
//           </div> 
//         </div>
//       </div>

//       {/* --- MOBILE MENU OVERLAY --- */}
//       <div 
//         className={`md:hidden fixed top-20 left-0 w-full bg-black/95 backdrop-blur-2xl border-b border-white/10 transition-all duration-500 ease-in-out ${
//           isOpen ? 'translate-y-0 opacity-100 visible h-[calc(100vh-80px)]' : '-translate-y-10 opacity-0 invisible h-0 overflow-hidden'
//         }`}
//       >
//         <div className="flex flex-col items-center gap-8 pt-12">
//           {['Home', 'About Us', 'Practice'].map((item) => (
//             <Link 
//               key={item} 
//               to={getPath(item)}
//               onClick={() => setIsOpen(false)}
//               className="text-2xl font-bold text-white hover:text-cyan-400 transition-colors"
//             >
//               {item}
//             </Link>
//           ))}
//           <div className="w-4/5 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent my-4"></div>
//           <button onClick={() => { navigate('/signin'); setIsOpen(false); }} className="text-xl font-black text-slate-400 hover:text-white transition-colors">SIGN IN</button>
//           <button 
//             className="relative px-10 py-4 group"
//             onClick={() => { navigate('/registration'); setIsOpen(false); }}
//           >
//              <div className="absolute inset-0 bg-gradient-to-r from-[#FF00FF] to-[#00FFFF] rounded-full blur-md opacity-60"></div>
//              <div className="relative bg-black rounded-full px-10 py-3 border border-white/20">
//                <span className="bg-gradient-to-r from-[#FF00FF] to-[#00FFFF] bg-clip-text text-transparent font-bold" onClick={() => navigate('/signup')} >Create Account</span>
//              </div>
//           </button>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;


import React, { useEffect, useState } from 'react';
import { useNavigate, NavLink, Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Menu, X, ChevronDown, Search } from 'lucide-react';
import { logoutUser } from '../authSlice';
import axiosClient from '../utils/axiosClient';

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'Interview', path: '/interview' },
  { label: 'Practice', path: '/practice' },
  { label: 'Contest', path: '/contest' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [allUsers, setAllUsers] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    setIsOpen(false);
    setShowProfileMenu(false);
    setShowSearchResults(false);
  }, [location.pathname]);

  const fetchUsersForSearch = async () => {
    if (!isAuthenticated || allUsers.length > 0) return;

    try {
      setSearchLoading(true);
      const { data } = await axiosClient.get('/user/getleaderboard');
      const users = Array.isArray(data) ? data : [];
      setAllUsers(users);
    } catch {
      setAllUsers([]);
    } finally {
      setSearchLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;

    const trimmed = searchTerm.trim().toLowerCase();
    if (!trimmed) {
      setSearchResults([]);
      return;
    }

    const nextResults = allUsers
      .filter((entry) => entry?._id && entry._id !== user?._id)
      .filter((entry) => {
        const fullName = `${entry?.firstName || ''} ${entry?.lastName || ''}`.trim().toLowerCase();
        const email = (entry?.emailId || '').toLowerCase();
        return fullName.includes(trimmed) || email.includes(trimmed);
      })
      .slice(0, 6);

    setSearchResults(nextResults);
  }, [allUsers, isAuthenticated, searchTerm, user?._id]);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/signin');
  };

  const navClass = ({ isActive }) =>
    `text-sm font-semibold tracking-wide transition-colors ${
      isActive ? 'text-cyan-300' : 'text-slate-300 hover:text-cyan-200'
    }`;

  const handleSearchSelect = (targetUserId) => {
    setShowSearchResults(false);
    setSearchTerm('');
    navigate(`/profile/${targetUserId}`);
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-18 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="group flex items-center gap-3">
          <div className="relative h-10 w-10 overflow-hidden rounded-full border border-white/20 bg-slate-900">
            <img src="/logo.png" alt="ALGORISE" className="h-full w-full object-cover transition duration-300 group-hover:scale-110" />
          </div>
          <span className="brand-gradient text-xl font-black tracking-tight">ALGORISE</span>
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          {navItems.map((item) => (
            <NavLink key={item.path} to={item.path} className={navClass} end={item.path === '/'}>
              {item.label}
            </NavLink>
          ))}
          {isAuthenticated && (
            <NavLink to="/leaderboard" className={navClass}>
              Leaderboard
            </NavLink>
          )}
        </div>

        {isAuthenticated && (
          <div className="relative hidden w-full max-w-xs md:block">
            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-900/80 px-3 py-2">
              <Search size={16} className="text-slate-400" />
              <input
                value={searchTerm}
                onFocus={() => {
                  fetchUsersForSearch();
                  setShowSearchResults(true);
                }}
                onChange={(event) => {
                  setSearchTerm(event.target.value);
                  setShowSearchResults(true);
                }}
                placeholder="Search users"
                className="w-full bg-transparent text-sm text-slate-200 outline-none placeholder:text-slate-500"
              />
            </div>

            {showSearchResults && (searchTerm.trim() || searchLoading) && (
              <div className="glass-panel absolute left-0 right-0 z-30 mt-2 max-h-72 overflow-y-auto rounded-xl p-2">
                {searchLoading ? (
                  <p className="px-3 py-2 text-sm text-slate-400">Loading users...</p>
                ) : searchResults.length > 0 ? (
                  searchResults.map((entry) => (
                    <button
                      key={entry._id}
                      onClick={() => handleSearchSelect(entry._id)}
                      className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition hover:bg-white/5"
                    >
                      <div>
                        <p className="text-sm font-semibold text-white">{entry.firstName} {entry.lastName}</p>
                        <p className="text-xs text-slate-400">{entry.emailId}</p>
                      </div>
                      <p className="text-xs text-cyan-300">#{entry.globalRank || 'N/A'}</p>
                    </button>
                  ))
                ) : (
                  <p className="px-3 py-2 text-sm text-slate-400">No users found</p>
                )}
              </div>
            )}
          </div>
        )}

        <div className="hidden items-center gap-3 md:flex">
          {!isAuthenticated ? (
            <>
              <button onClick={() => navigate('/signin')} className="btn-secondary">
                Sign In
              </button>
              <button onClick={() => navigate('/signup')} className="btn-primary">
                Create Account
              </button>
            </>
          ) : (
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu((prev) => !prev)}
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-900/80 px-3 py-2 text-left transition hover:border-cyan-400/50"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-r from-cyan-500 to-purple-500 text-sm font-black text-white">
                  {user?.firstName?.charAt(0) || 'U'}
                </div>
                <div className="hidden lg:block">
                  <p className="text-xs font-semibold text-white">{user?.firstName || 'User'}</p>
                  <p className="text-[10px] uppercase tracking-wider text-slate-400">{user?.role || 'member'}</p>
                </div>
                <ChevronDown size={16} className="text-slate-400" />
              </button>

              {showProfileMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowProfileMenu(false)}></div>
                  <div className="glass-panel absolute right-0 z-20 mt-2 w-56 rounded-xl p-2">
                    <div className="border-b border-white/10 px-3 py-2">
                      <p className="truncate text-sm font-semibold text-slate-200">{user?.emailId}</p>
                    </div>
                    <button
                      onClick={() => navigate('/profile')}
                      className="mt-1 block w-full rounded-lg px-3 py-2 text-left text-sm text-slate-300 transition hover:bg-white/5 hover:text-cyan-300"
                    >
                      View Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="block w-full rounded-lg px-3 py-2 text-left text-sm text-red-400 transition hover:bg-red-500/10"
                    >
                      Log Out
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        <button
          className="inline-flex rounded-lg border border-white/10 p-2 text-slate-200 md:hidden"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {isOpen && (
        <div className="border-t border-white/10 bg-slate-950/95 px-4 py-4 backdrop-blur-xl md:hidden">
          <div className="flex flex-col gap-3">
            {isAuthenticated && (
              <div className="mb-2">
                <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-900/80 px-3 py-2">
                  <Search size={16} className="text-slate-400" />
                  <input
                    value={searchTerm}
                    onFocus={() => fetchUsersForSearch()}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search users"
                    className="w-full bg-transparent text-sm text-slate-200 outline-none placeholder:text-slate-500"
                  />
                </div>

                {searchTerm.trim() && (
                  <div className="mt-2 rounded-xl border border-white/10 bg-slate-900/90 p-2">
                    {searchResults.length > 0 ? (
                      searchResults.map((entry) => (
                        <button
                          key={entry._id}
                          onClick={() => {
                            setIsOpen(false);
                            handleSearchSelect(entry._id);
                          }}
                          className="block w-full rounded-lg px-3 py-2 text-left text-sm text-slate-200 hover:bg-white/5"
                        >
                          {entry.firstName} {entry.lastName}
                        </button>
                      ))
                    ) : (
                      <p className="px-3 py-2 text-sm text-slate-400">No users found</p>
                    )}
                  </div>
                )}
              </div>
            )}

            {navItems.map((item) => (
              <NavLink key={item.path} to={item.path} className={navClass} end={item.path === '/'}>
                {item.label}
              </NavLink>
            ))}
            {isAuthenticated && (
              <>
                <NavLink to="/leaderboard" className={navClass}>
                  Leaderboard
                </NavLink>
                <NavLink to="/profile" className={navClass}>
                  Profile
                </NavLink>
                <button onClick={handleLogout} className="mt-2 w-fit rounded-lg px-3 py-2 text-sm font-semibold text-red-400 hover:bg-red-500/10">
                  Log Out
                </button>
              </>
            )}
            {!isAuthenticated && (
              <div className="mt-2 flex items-center gap-2">
                <button onClick={() => navigate('/signin')} className="btn-secondary">
                  Sign In
                </button>
                <button onClick={() => navigate('/signup')} className="btn-primary">
                  Join Now
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;