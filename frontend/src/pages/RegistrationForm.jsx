// import React from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import {useNavigate} from "react-router"
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';
// import { useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { useEffect } from 'react';
// import { registerUser } from '../authSlice';
// const signupSchema = z.object({
//   firstName: z.string().min(3, "Minimum character should be 3"),
//   emailId: z.string().email("Invalid Email"),
//   password: z.string().min(8, "Password is too weak")
// });
// const Registration = () => {
//    const [showPassword, setShowPassword] = useState(false); 
//     const dispatch = useDispatch();
//     const navigate = useNavigate() ;
//      const { isAuthenticated, loading } = useSelector((state) => state.auth);

//      const {
//       register,
//       handleSubmit,
//       formState:{errors},

//      }=useForm({resolver:zodResolver(signupSchema)});

//      useEffect(()=>{
//       if(isAuthenticated){
//         navigate('/')
//       }
//      },[isAuthenticated,navigate])

//      const onSubmit=(data)=>{
//       dispatch(registerUser(data))
//      }
//   return (
//     <div className="min-h-[calc(100vh-80px)] bg-black flex items-center justify-center px-6 py-12 relative overflow-hidden">
      
//       {/* Background Decorative Glows */}
//       <div className="absolute top-1/4 -left-20 w-96 h-96 bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none"></div>
//       <div className="absolute bottom-0 -right-20 w-80 h-80 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>

//       {/* Registration Card */}
//       <div className="relative w-full max-w-md z-10">
//         <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl blur opacity-20"></div>
        
//         <div className="relative bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
//           <div className="text-center mb-8">
//             <h2 className="text-3xl font-black tracking-tighter text-white mb-2">Create Account</h2>
//             <p className="text-slate-400 text-sm">Join the ALGORISE community today.</p>
//           </div>

//           {/* Google Sign Up Button */}
//           <button className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-100 text-black font-bold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-95 mb-6">
//             <img src="google.svg" alt="Google" className="w-5 h-5" />
//             Sign up with Google
//           </button>

//           <div className="relative flex items-center gap-4 mb-6">
//             <div className="flex-grow h-[1px] bg-white/10"></div>
//             <span className="text-xs text-slate-500 uppercase tracking-widest">or email</span>
//             <div className="flex-grow h-[1px] bg-white/10"></div>
//           </div>

//           {/* Form Fields */}
//           <form  onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//             <div>
//               <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Username</label>
//               <input 
//                 type="text" 
//                 placeholder="coder_pro"
//                 className={`w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors ${errors.firstName ? 'input-error' : ''}`}
//               />
//                {errors.firstName && (
//                 <span className="text-error text-sm mt-1">{errors.firstName.message}</span>
//               )}
//             </div>

//             <div>
//               <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Email Address</label>
//               <input 
//                 type="email" 
//                 placeholder="you@example.com"
//                 className={`w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors ${errors.emailId ? 'input-error' : ''}
//               `} {...register('emailId')}/>

//                {errors.emailId && (
//                 <span className="text-error text-sm mt-1">{errors.emailId.message}</span>
//               )}
//             </div>

//             <div className="relative">
//   <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">
//     Password
//   </label>

//   <input
//     type={showPassword ? "text" : "password"}
//     placeholder="••••••••"
//     className={`w-full bg-black/50 border border-white/10 rounded-xl px-4 pr-12 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors ${errors.password ? 'input-error' : ''}
//   `}  {...register('password')}/>

//  <button
//   type="button"
//   className="absolute  top-2/3 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700"
//   onClick={() => setShowPassword(!showPassword)}
//   aria-label={showPassword ? "Hide password" : "Show password"}
// >
//   {!showPassword ? (
//     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
//     </svg>
//   ) : (
//     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//     </svg>
//   )}
// </button>
// {errors.password && (
//                 <span className="text-error text-sm mt-1">{errors.password.message}</span>
//               )}
// </div>


//             <div className="pt-4">
//               <button type='sumbit' className={`group relative w-full py-4 rounded-xl overflow-hidden shadow-[0_0_20px_rgba(6,182,212,0.3)] ${loading ? 'loading' : ''} `} disabled={loading}>
//                 <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-purple-600 transition-all group-hover:scale-105"></div>
//                 <span className="relative z-10 text-white font-black tracking-widest text-sm uppercase">Sign Up</span>
//               </button>
//             </div>
//           </form>

//           <p className="text-center text-slate-500 text-xs mt-8">
//             Already have an account? <a href="#" className="text-cyan-400 hover:underline font-bold">Sign In</a>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Registration;



import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { registerUser } from '../authSlice';

const signupSchema = z.object({
  firstName: z.string().min(3, "Minimum character should be 3"),
  emailId: z.string().email("Invalid Email"),
  password: z.string().min(8, "Password is too weak")
});

const Registration = () => {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ 
    resolver: zodResolver(signupSchema),
    mode: "onBlur" // Validates when user leaves the field
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = (data) => {
    dispatch(registerUser(data));
  };

  return (
    <div className="relative flex min-h-[calc(100vh-80px)] items-center justify-center overflow-hidden px-6 py-12">
      
      {/* Background Decorative Glows */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 -right-20 w-80 h-80 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-md">
        <div className="absolute -inset-1 bg-linear-to-r from-cyan-500 to-purple-600 rounded-2xl blur opacity-20"></div>
        
        <div className="glass-panel relative rounded-2xl p-8">
          <div className="text-center mb-8">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">Get started</p>
            <h2 className="mb-2 text-3xl font-black tracking-tight text-white">Create your account</h2>
            <p className="text-sm text-slate-400">Start practicing with curated coding problems.</p>
          </div>

          <button type="button" className="mb-6 flex w-full items-center justify-center gap-3 rounded-xl bg-white px-4 py-3 font-semibold text-black transition hover:bg-slate-100 active:scale-[0.99]">
            <img src="google.svg" alt="" className="w-5 h-5" />
            Sign up with Google
          </button>

          <div className="relative flex items-center gap-4 mb-6">
            <div className="grow h-px bg-white/10"></div>
            <span className="text-xs text-slate-500 uppercase tracking-widest">or email</span>
            <div className="grow h-px bg-white/10"></div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Username/FirstName Field */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Username</label>
              <input 
                {...register('firstName')}
                type="text" 
                placeholder="coder_pro"
                className={`w-full rounded-xl border bg-black/40 px-4 py-3 text-white outline-none transition focus:border-cyan-500 ${errors.firstName ? 'border-red-500' : 'border-white/10'}`}
              />
              {errors.firstName && (
                <span className="text-red-500 text-xs mt-1 block">{errors.firstName.message}</span>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Email Address</label>
              <input 
                {...register('emailId')}
                type="email" 
                placeholder="you@example.com"
                className={`w-full rounded-xl border bg-black/40 px-4 py-3 text-white outline-none transition focus:border-cyan-500 ${errors.emailId ? 'border-red-500' : 'border-white/10'}`}
              />
              {errors.emailId && (
                <span className="text-red-500 text-xs mt-1 block">{errors.emailId.message}</span>
              )}
            </div>

            {/* Password Field */}
            <div className="relative">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Password</label>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`w-full rounded-xl border bg-black/40 px-4 py-3 pr-12 text-white outline-none transition focus:border-cyan-500 ${errors.password ? 'border-red-500' : 'border-white/10'}`}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <span className="text-red-500 text-xs mt-1 block">{errors.password.message}</span>
              )}
            </div>

            <div className="pt-4">
              <button 
                type="submit" 
                className="btn-primary w-full py-3 disabled:opacity-70" 
                disabled={loading}
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </div>
          </form>

          <p className="mt-8 text-center text-xs text-slate-500">
            Already have an account? <a href="/signin" className="font-semibold text-cyan-300 hover:text-cyan-200">Sign In</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Registration;