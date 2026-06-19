import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser, googleAuthUser } from '../authSlice';
import {z} from 'zod'
import { useForm } from 'react-hook-form';

const loginSchema=z.object({
  emailId:z.string().email("Invalid Email"),
  password:z.string().min(8,"Password is too weak")
})

const Signin = () => {
  const navigate = useNavigate();
   const [showPassword, setShowPassword] = useState(false);
   const dispatch=useDispatch();
   const {isAuthenticated,loading,error}=useSelector((state)=>state.auth);
   const {
    register,
    handleSubmit,
    formState:{errors},

   }=useForm({resolver:zodResolver(loginSchema)});

   useEffect(()=>{
    if(isAuthenticated){
      navigate('/')
    }
   },[isAuthenticated,navigate])

   const onSubmit=(data)=>{
    dispatch(loginUser(data));
   }

   useEffect(() => {
     const initializeGoogleSignIn = () => {
       if (window.google && window.google.accounts && window.google.accounts.oauth2) {
         const tokenClient = window.google.accounts.oauth2.initTokenClient({
           client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
           scope: 'email profile openid',
           callback: (tokenResponse) => {
             if (tokenResponse && tokenResponse.access_token) {
               dispatch(googleAuthUser(tokenResponse.access_token));
             }
           },
         });
         window.googleTokenClient = tokenClient;
       }
     };

     if (window.google) {
       initializeGoogleSignIn();
     } else {
       const script = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
       if (script) {
         script.addEventListener('load', initializeGoogleSignIn);
       }
     }
   }, [dispatch]);

   const handleGoogleLogin = () => {
     if (window.googleTokenClient) {
       window.googleTokenClient.requestAccessToken();
     } else {
       alert("Google Sign-In is initializing. Please try again in a moment.");
     }
   };

  return (
    <div className="relative flex min-h-[calc(100vh-80px)] items-center justify-center overflow-hidden px-6 py-12">
      
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 -left-20 w-80 h-80 bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-md">
        <div className="absolute -inset-1 rounded-2xl bg-linear-to-r from-purple-600 to-cyan-500 opacity-20 blur transition duration-1000"></div>
        
        <div className="glass-panel relative rounded-2xl p-8">
          <div className="text-center mb-8">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">Welcome back</p>
            <h2 className="mb-2 text-3xl font-black tracking-tight text-white">Sign in to your account</h2>
            <p className="text-sm text-slate-400">Continue your coding journey with ALGORISE.</p>
          </div>

          <button 
            type="button" 
            onClick={handleGoogleLogin}
            className="mb-6 flex w-full items-center justify-center gap-3 rounded-xl bg-white px-4 py-3 font-semibold text-black transition hover:bg-slate-100 active:scale-[0.99]"
          >
            <img src="google.svg" alt="Google" className="w-5 h-5" />
            Continue with Google
          </button>

          <div className="relative flex items-center gap-4 mb-6">
            <div className="grow h-px bg-white/10"></div>
            <span className="text-xs text-slate-500 uppercase tracking-widest">or sign in with email</span>
            <div className="grow h-px bg-white/10"></div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Email Address</label>
              <input 
                type="email" 
                placeholder="coder@algorise.com"
                className={`w-full rounded-xl border bg-black/40 px-4 py-3 text-white outline-none transition focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/40 ${errors.emailId ? 'border-red-500' : 'border-white/10'}`}
               {...register('emailId')}/>
                {errors.emailId && (
                <span className="mt-1 block text-xs text-red-400">{errors.emailId.message}</span>
              )}
            </div>

                        <div className="relative">
  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">
    Password
  </label>

  <input
    type={showPassword ? "text" : "password"}
    placeholder="••••••••"
    className={`w-full rounded-xl border bg-black/40 px-4 py-3 pr-12 text-white outline-none transition focus:border-cyan-500 ${errors.password ? 'border-red-500' : 'border-white/10'}`} {...register('password')}
  />

 <button
  type="button"
  className="absolute  top-2/3 right-3 -translate-y-1/2 text-slate-500 hover:text-slate-300"
  onClick={() => setShowPassword(!showPassword)}
  aria-label={showPassword ? "Hide password" : "Show password"}
>
  {!showPassword ? (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  )}
</button>
 {errors.password && (
                <span className="mt-1 block text-xs text-red-400">{errors.password.message}</span>
              )}

</div>
            <div className="pt-4">
              <button disabled={loading} className="btn-primary w-full py-3 disabled:opacity-70">
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </div>
          </form>

          {error && <p className="mt-4 text-center text-xs text-red-400">{error}</p>}

          <p className="mt-8 text-center text-xs text-slate-500">
            New here? <button onClick={() => navigate('/signup')} className="font-semibold text-cyan-300 hover:text-cyan-200">Create account</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signin;