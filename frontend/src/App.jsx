// // import React from 'react';
// // import { Routes, Route ,Navigate} from 'react-router-dom'; // Remove 'BrowserRouter' from here
// // import Navbar from './component/nav';
// // import HomePage from './pages/home';
// // import Registration from './pages/RegistrationForm';
// // import Footer from './component/footer';
// // import Signin from './pages/SignIn';
// // import { useDispatch,useSelector } from 'react-redux';
// // import { useEffect } from 'react';
// // import { checkAuth } from './authSlice';
// // import Admin from './pages/Admin';
// // import UserManagement from './component/UserManagement';
// // import AdminPanel from './component/AdminPanel';
// // import AdminDelete from './component/AdminDelete';
// // import ProblemPage from './pages/ProblemPage';
// // import AdminVideo from './component/AdminVideo';
// // import AdminUpload from './component/AdminUpload';

// // function App() {
// //   const dispatch=useDispatch();
// //   const {isAuthenticated,user,loading}=useSelector((state)=>state.auth);
// //   console.log("isAuthenticated:",isAuthenticated)
// //   console.log("user role:",user.role)
// //   useEffect(()=>{
// //     dispatch(checkAuth());
// //   },[dispatch])

// //    if (loading) {
// //     return <div className="min-h-screen flex items-center justify-center">
// //       <span className="loading loading-spinner loading-lg"></span>
// //     </div>;
// //   }
// //   return (
// //     <div className="bg-black min-h-screen selection:bg-cyan-500/30">
// //       <Navbar />
      
// //       <Routes>
// //         <Route path="/" element={isAuthenticated?<HomePage />:<Navigate to="/signup"/>} />
// //         <Route path="/signup" element={isAuthenticated?<Navigate to="/"/>:<Registration />} />
// //         <Route path="/signin"  element={isAuthenticated?<Navigate to="/"/>:<Signin/>} />

        
// //         {/* Placeholder routes */}
// //         <Route path="/aboutus" element={<div className="text-white p-20">About Us Page Coming Soon</div>} />
// //         <Route path="/practice" element={<div className="text-white p-20">Practice Page Coming Soon</div>} />
// //         <Route path="/admin"element={<Admin/>}/>
// //         <Route   path="/admin/create" element={isAuthenticated && user?.role==='admin'?<AdminPanel/>:<Navigate to="/"/>}/>
// //         <Route   path="/admin/delete" element={isAuthenticated && user?.role==='admin'?<AdminDelete/>:<Navigate to="/"/>}/>
// //         <Route path="/admin/user-management"element={isAuthenticated&&user?.role==='admin'?<UserManagement/>:<Navigate to="/"/>}/>
// //         <Route path="/admin/video" element={isAuthenticated &&user?.role==='admin'?<AdminVideo/>:<Navigate to='/'/>}/>
// //         <Route path="/admin/upload/:problemId" element={isAuthenticated && user?.role==='admin'?<AdminUpload/>:<Navigate to="/"/>}/>
// //         <Route path="/problem?:problemId" element={<ProblemPage/>}/>
// //       </Routes>

// //       <Footer />
// //     </div>
// //   );
// // }

// // export default App;


// import React, { useEffect } from "react";
// import { Routes, Route, Navigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";

// import Navbar from "./component/nav";
// import Footer from "./component/footer";

// import HomePage from "./pages/home";
// import Registration from "./pages/RegistrationForm";
// import Signin from "./pages/SignIn";
// import Admin from "./pages/Admin";
// import ProblemPage from "./pages/ProblemPage";

// import UserManagement from "./component/UserManagement";
// import AdminPanel from "./component/AdminPanel";
// import AdminDelete from "./component/AdminDelete";
// import AdminVideo from "./component/AdminVideo";
// import AdminUpload from "./component/AdminUpload";

// import { checkAuth } from "./authSlice";
// import ProblemPractice from "./component/ProblemPractice";

// function App() {
//   const dispatch = useDispatch();
//   const { isAuthenticated, user, loading } = useSelector(
//     (state) => state.auth
//   );

//   useEffect(() => {
//     dispatch(checkAuth());
//   }, [dispatch]);

//   /* ================= ROUTE GUARDS ================= */

//   const ProtectedRoute = ({ children }) => {
//     if (loading) return null;
//     if (!isAuthenticated) return <Navigate to="/signin" replace />;
//     return children;
//   };

//   const AdminRoute = ({ children }) => {
//     if (loading) return null;
//     if (!isAuthenticated) return <Navigate to="/signin" replace />;
//     if (user?.role !== "admin") return <Navigate to="/" replace />;
//     return children;
//   };

//   /* ================= LOADING SCREEN ================= */

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <span className="loading loading-spinner loading-lg"></span>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-black min-h-screen selection:bg-cyan-500/30">
//       <Navbar />

//       <Routes>
//         {/* ================= PUBLIC ROUTES ================= */}
//         <Route path="/" element={<HomePage />} />

//         <Route
//           path="/signup"
//           element={
//             isAuthenticated ? <Navigate to="/" replace /> : <Registration />
//           }
//         />

//         <Route
//           path="/signin"
//           element={
//             isAuthenticated ? <Navigate to="/" replace /> : <Signin />
//           }
//         />

//         {/* ================= USER ROUTES ================= */}
//          <Route
//           path="/Practice"
//           element={
//             <ProtectedRoute>
//               <ProblemPractice />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/problem/:problemId"
//           element={
//             <ProtectedRoute>
//               <ProblemPage />
//             </ProtectedRoute>
//           }
//         />

//         {/* ================= ADMIN ROUTES ================= */}
//         <Route
//           path="/admin"
//           element={
//             <AdminRoute>
//               <Admin />
//             </AdminRoute>
//           }
//         />

//         <Route
//           path="/admin/create"
//           element={
//             <AdminRoute>
//               <AdminPanel />
//             </AdminRoute>
//           }
//         />

//         <Route
//           path="/admin/delete"
//           element={
//             <AdminRoute>
//               <AdminDelete />
//             </AdminRoute>
//           }
//         />

//         <Route
//           path="/admin/user-management"
//           element={
//             <AdminRoute>
//               <UserManagement />
//             </AdminRoute>
//           }
//         />

//         <Route
//           path="/admin/video"
//           element={
//             <AdminRoute>
//               <AdminVideo />
//             </AdminRoute>
//           }
//         />

//         <Route
//           path="/admin/upload/:problemId"
//           element={
//             <AdminRoute>
//               <AdminUpload />
//             </AdminRoute>
//           }
//         />

//         {/* ================= FALLBACK ================= */}
//         <Route path="*" element={<Navigate to="/" replace />} />
//       </Routes>

//       <Footer />
//     </div>
//   );
// }

// export default App;

import React, { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// User Components
import Navbar from "./component/nav";
import Footer from "./component/footer";
import HomePage from "./pages/home";
import Registration from "./pages/RegistrationForm";
import Signin from "./pages/SignIn";
import ProblemPage from "./pages/ProblemPage";
import ProblemPractice from "./component/ProblemPractice";

// Admin Components
import Admin from "./pages/Admin";
import AdminNavbar from "./component/AdminNavbar";
    
import UserManagement from "./component/UserManagement";
import AdminPanel from "./component/AdminPanel";
import AdminDelete from "./component/AdminDelete";
import AdminVideo from "./component/AdminVideo";
import AdminUpload from "./component/AdminUpload";

import { checkAuth } from "./authSlice";
import AboutUs from "./component/Aboutus";
import AdminUpdate_problem from "./component/AdminUpdate_problem";
import Profile from "./component/Profile";
import Leaderboard from "./component/Leaderboard";
import Contest from "./component/Contest";
import AdminContest from "./component/AdminContest";

function App() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  /* ================= ROUTE GUARDS ================= */

  const ProtectedRoute = ({ children }) => {
    if (loading) return null;
    if (!isAuthenticated) return <Navigate to="/signin" replace />;
    return children;
  };

  const AdminRoute = ({ children }) => {
    if (loading) return null;
    if (!isAuthenticated) return <Navigate to="/signin" replace />;
    if (user?.role !== "admin") return <Navigate to="/" replace />;
    return children;
  };

  /**
   * Logic to show HomePage only to regular users.
   * Redirects Guests to signup/signin and Admins to the admin dashboard.
   */
  const HomeGuard = () => {
    if (loading) return null;
    if (!isAuthenticated) return <Navigate to="/signin" replace />;
    if (user?.role === "admin") return <Navigate to="/admin" replace />;
    return <HomePage />;
  };

  // Determine if we should show Admin Navbar
  const isAdminPath = location.pathname.startsWith('/admin');

  /* ================= LOADING SCREEN ================= */

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <span className="loading loading-spinner loading-lg text-cyan-500"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent selection:bg-cyan-500/30">
      {/* DYNAMIC NAVBAR SWITCHING */}
      {isAuthenticated && user?.role === "admin" && isAdminPath ? (
        <AdminNavbar />
      ) : (
        <Navbar />
      )}

      <Routes>
        {/* ================= USER-ONLY HOME ROUTE ================= */}
        <Route path="/" element={<HomeGuard />} />
          <Route path="/aboutus" element={<AboutUs />} />

        {/* ================= PUBLIC ROUTES ================= */}
        <Route path="/signup" element={isAuthenticated ? <Navigate to="/" replace /> : <Registration />} />
        <Route path="/signin" element={isAuthenticated ? <Navigate to="/" replace /> : <Signin />} />

        {/* ================= USER ROUTES ================= */}
         <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/practice" element={<ProtectedRoute><ProblemPractice /></ProtectedRoute>} />
        <Route path="/contest" element={<ProtectedRoute><Contest /></ProtectedRoute>} />
        <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
        <Route path="/problem/:problemId" element={<ProtectedRoute><ProblemPage /></ProtectedRoute>} />

        {/* ================= ADMIN ROUTES ================= */}
        <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
        <Route path="/admin/create" element={<AdminRoute><AdminPanel /></AdminRoute>} />
        <Route path="/admin/contest" element={<AdminRoute><AdminContest /></AdminRoute>} />
        <Route path="/admin/delete" element={<AdminRoute><AdminDelete /></AdminRoute>} />
       <Route path="/admin/update/:id" element={<AdminRoute><AdminUpdate_problem /></AdminRoute>} />
        <Route path="/admin/user-management" element={<AdminRoute><UserManagement /></AdminRoute>} />
        <Route path="/admin/video" element={<AdminRoute><AdminVideo /></AdminRoute>} />

        <Route path="/admin/upload/:problemId" element={<AdminRoute><AdminUpload /></AdminRoute>} />

        {/* ================= FALLBACK ================= */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;