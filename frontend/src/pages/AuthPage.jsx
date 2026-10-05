import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CircleAlert, Eye, EyeOff, Flame, ListChecks, LoaderCircle, Sunrise, Trophy } from 'lucide-react';
import { clearError, googleAuthUser, loginUser, registerUser } from '../authSlice';
import { BrandMark, GoogleIcon } from '../component/ui';

const loginSchema = z.object({
  emailId: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const signupSchema = z.object({
  // One "Full name" field, split into first/last for the API (first name needs 3+ characters)
  fullName: z
    .string()
    .trim()
    .min(1, 'Enter your name')
    .refine((v) => v.split(/\s+/)[0].length >= 3, 'First name must be at least 3 characters')
    .refine((v) => v.split(/\s+/)[0].length <= 20, 'First name must be 20 characters or fewer'),
  emailId: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const COPY = {
  in: { title: 'Sign in to Algorise', sub: 'Welcome back. Your streak is waiting.', cta: 'Sign in', foot: 'New here?', switchLabel: 'Create an account', switchTo: '/signup' },
  up: { title: 'Create your account', sub: 'Free forever for practice. Takes a minute.', cta: 'Create account', foot: 'Already have an account?', switchLabel: 'Sign in', switchTo: '/signin' },
};

const splitName = (fullName) => {
  const [firstName, ...rest] = fullName.trim().split(/\s+/);
  return { firstName, lastName: rest.join(' ') };
};

const FieldErr = ({ error }) =>
  error?.message ? (
    <div className="mt-1.5 flex items-center gap-1.5 text-xs" style={{ color: 'var(--color-err)' }}>
      <CircleAlert size={13} /> {error.message}
    </div>
  ) : null;

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const GOOGLE_POPUP_ERRORS = {
  popup_closed: 'Google sign-in was closed before it finished.',
  popup_failed_to_open: 'Your browser blocked the Google popup. Allow popups for this site and try again.',
  access_denied: 'Google sign-in was cancelled.',
};

/* Google OAuth token client, created once the GSI script has loaded */
const useGoogleSignIn = (onToken, onError) => {
  const clientRef = useRef(null);
  const handlers = useRef({ onToken, onError });
  useEffect(() => {
    handlers.current = { onToken, onError };
  });

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return undefined;
    const init = () => {
      if (clientRef.current || !window.google?.accounts?.oauth2) return;
      clientRef.current = window.google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: 'openid email profile',
        callback: (response) => {
          if (response?.error) handlers.current.onError(GOOGLE_POPUP_ERRORS[response.error] || 'Google sign-in failed. Please try again.');
          else if (response?.access_token) handlers.current.onToken(response.access_token);
        },
        error_callback: (err) => handlers.current.onError(GOOGLE_POPUP_ERRORS[err?.type] || 'Google sign-in failed. Please try again.'),
      });
    };

    if (window.google?.accounts?.oauth2) {
      init();
      return undefined;
    }
    const script = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
    script?.addEventListener('load', init);
    return () => script?.removeEventListener('load', init);
  }, []);

  return () => {
    if (!GOOGLE_CLIENT_ID) {
      handlers.current.onError('Google sign-in is not configured.');
    } else if (!clientRef.current) {
      handlers.current.onError('Google sign-in is still loading. Try again in a moment.');
    } else {
      clientRef.current.requestAccessToken();
    }
  };
};

const AuthForm = ({ mode }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [googleNotice, setGoogleNotice] = useState('');
  const isSignUp = mode === 'up';
  const copy = COPY[mode];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(isSignUp ? signupSchema : loginSchema), mode: 'onBlur' });

  const onSubmit = ({ fullName, ...data }) => dispatch(isSignUp ? registerUser({ ...data, ...splitName(fullName) }) : loginUser(data));

  const handleGoogle = useGoogleSignIn(
    (token) => {
      setGoogleNotice('');
      dispatch(googleAuthUser(token));
    },
    (message) => setGoogleNotice(message)
  );

  const errorText = typeof error === 'string' ? error.replace(/^Error:\s*/, '') : error ? 'Something went wrong' : '';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex w-full max-w-90 flex-col" noValidate>
      <h1 className="text-[26px] font-medium tracking-[-0.015em]">{copy.title}</h1>
      <p className="mt-1 text-sm text-neutral-400">{copy.sub}</p>

      <button
        type="button"
        onClick={() => {
          setGoogleNotice('');
          dispatch(clearError());
          handleGoogle();
        }}
        disabled={loading}
        className="btn btn-secondary mt-6 w-full py-2.25"
      >
        <GoogleIcon /> Continue with Google
      </button>
      {googleNotice && <p className="mt-2 text-[13px] text-neutral-400">{googleNotice}</p>}

      <div className="my-5 flex items-center gap-3 text-xs text-neutral-500">
        <div className="h-px flex-1 bg-neutral-800" />
        or
        <div className="h-px flex-1 bg-neutral-800" />
      </div>

      <div className="flex flex-col gap-4">
        {isSignUp && (
          <div className="field">
            <label htmlFor="fullName">Full name</label>
            <input id="fullName" autoComplete="name" className="input" placeholder="Riya Sharma" {...register('fullName')} />
            <FieldErr error={errors.fullName} />
          </div>
        )}

        <div className="field">
          <label htmlFor="emailId">Email</label>
          <input id="emailId" type="email" autoComplete="email" className="input" placeholder="you@college.edu" {...register('emailId')} />
          <FieldErr error={errors.emailId} />
        </div>

        <div className="field">
          <label htmlFor="password">Password</label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete={isSignUp ? 'new-password' : 'current-password'}
              className="input pr-10"
              placeholder="At least 8 characters"
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-text"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <FieldErr error={errors.password} />
          {isSignUp && !errors.password && <p className="mt-1.5 text-xs text-neutral-500">Use upper and lower case letters, a number and a symbol.</p>}
        </div>

        {errorText && (
          <div className="flex items-start gap-1.5 text-[13px]" style={{ color: 'var(--color-err)' }}>
            <CircleAlert size={14} className="mt-0.5 flex-none" /> {errorText}
          </div>
        )}

        <button type="submit" disabled={loading} className="btn btn-primary btn-block mt-1 py-2.5">
          {loading && <LoaderCircle size={15} className="animate-spin" />}
          {copy.cta}
        </button>
      </div>

      <p className="mt-5 text-[13px] text-neutral-400">
        {copy.foot}{' '}
        <Link to={copy.switchTo} className="text-accent hover:text-accent-300">
          {copy.switchLabel}
        </Link>
      </p>
    </form>
  );
};

const WAITING = [
  { icon: Sunrise, label: 'Daily challenge', meta: 'New every day' },
  { icon: Flame, label: 'Your streak & solve history', meta: 'Kept for you' },
  { icon: ListChecks, label: 'Topic progress', meta: 'Easy → Hard' },
  { icon: Trophy, label: 'Contests & virtual runs', meta: 'Any time' },
];

const AuthPage = ({ mode = 'in' }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) navigate('/');
  }, [isAuthenticated, navigate]);

  // Don't carry a sign-in error over to the sign-up form (or back)
  useEffect(() => {
    dispatch(clearError());
  }, [mode, dispatch]);

  return (
    <div className="grid min-h-screen bg-bg lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
      <div className="flex flex-col px-5 py-6 sm:px-12 sm:py-10">
        <Link to="/" className="flex items-center gap-2.5 text-[17px] font-medium text-text">
          <BrandMark size={26} /> Algorise
        </Link>
        <div className="flex flex-1 items-center justify-center py-10">
          <AuthForm key={mode} mode={mode} />
        </div>
        <div className="text-xs text-neutral-600">By continuing you agree to the Terms and Privacy Policy.</div>
      </div>

      <div
        className="hidden flex-col justify-center p-16 lg:flex"
        style={{
          background:
            'radial-gradient(700px 500px at 80% 0%, color-mix(in srgb, var(--color-accent-900) 60%, transparent), transparent 65%), color-mix(in srgb, black 16%, var(--color-bg))',
          boxShadow: 'inset 1px 0 0 var(--color-neutral-900)',
        }}
      >
        <div className="max-w-110">
          <div className="eyebrow eyebrow-accent text-xs">Waiting for you</div>
          <div className="mt-3 text-[30px] font-medium leading-[1.2] tracking-[-0.015em]">
            Your streak, progress and today's challenge pick up exactly where you left them.
          </div>
          <div className="mt-8 overflow-hidden rounded-xl" style={{ boxShadow: 'inset 0 0 0 1px var(--color-neutral-800)' }}>
            {WAITING.map((w, i) => {
              const Icon = w.icon;
              return (
                <div key={w.label} className="flex items-center gap-3 bg-surface/60 px-4 py-3.5 text-[14px]" style={{ boxShadow: i ? 'inset 0 1px 0 var(--color-neutral-800)' : 'none' }}>
                  <Icon size={16} className="text-accent" />
                  <span className="flex-1">{w.label}</span>
                  <span className="text-xs text-neutral-500">{w.meta}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
