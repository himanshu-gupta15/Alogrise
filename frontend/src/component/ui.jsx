// Shared building blocks for the Nocturne redesign.
import { useEffect, useRef, useState } from 'react';
import { ChevronDown, ChevronsUp, LoaderCircle } from 'lucide-react';
import { capitalize, difficultyColor, initialsOf } from '../utils/format';

export const Difficulty = ({ value, className = '' }) => (
  <span className={className} style={{ color: difficultyColor(value) }}>
    {capitalize(value)}
  </span>
);

/* ================= BRAND ================= */

export const BrandMark = ({ size = 24 }) => (
  <span className="brand-mark" style={{ width: size, height: size }}>
    <ChevronsUp size={Math.round(size * 0.58)} strokeWidth={1.75} />
  </span>
);

/* ================= AVATAR ================= */

export const Avatar = ({ user, size = 32, className = '', style }) => (
  <span
    className={`avatar ${className}`}
    style={{ width: size, height: size, fontSize: Math.round(size * 0.4), ...style }}
  >
    {user?.profilePicture ? (
      <img src={user.profilePicture} alt="" className="h-full w-full object-cover" />
    ) : (
      initialsOf(user)
    )}
  </span>
);

/* ================= FEEDBACK ================= */

export const Spinner = ({ size = 18, className = '' }) => (
  <LoaderCircle size={size} className={`animate-spin text-accent ${className}`} />
);

export const PageLoader = ({ label = 'Loading…' }) => (
  <div className="flex min-h-[70vh] items-center justify-center gap-3 text-neutral-400">
    <Spinner />
    <span className="text-sm">{label}</span>
  </div>
);

export const Notice = ({ type = 'info', children, onClose }) => {
  const color =
    type === 'error' ? 'var(--color-hard)' : type === 'success' ? 'var(--color-accent)' : 'var(--color-neutral-400)';
  return (
    <div
      className="flex items-center gap-3 rounded-md px-4 py-3 text-sm"
      style={{ boxShadow: `inset 0 0 0 1px ${color}`, color: type === 'info' ? 'var(--color-neutral-200)' : color }}
    >
      <span className="flex-1">{children}</span>
      {onClose && (
        <button type="button" onClick={onClose} className="text-neutral-400 hover:text-text" aria-label="Dismiss">
          ×
        </button>
      )}
    </div>
  );
};

/* ================= STAT ================= */

export const Stat = ({ value, label, suffix, accent = false, size = 44 }) => (
  <div>
    <div className="tnum font-medium leading-none" style={{ fontSize: size, color: accent ? 'var(--color-accent)' : undefined }}>
      {value}
      {suffix && <span className="text-[18px] text-neutral-400">{suffix}</span>}
    </div>
    <div className="eyebrow mt-2.5">{label}</div>
  </div>
);

/* ================= ICONS ================= */

export const GoogleIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
    <path fill="currentColor" d="M21.35 11.1H12v2.9h5.35c-.23 1.4-1.6 4.1-5.35 4.1-3.22 0-5.85-2.67-5.85-5.95S8.78 6.2 12 6.2c1.83 0 3.06.78 3.76 1.45l2.57-2.47C16.68 3.65 14.55 2.7 12 2.7 6.92 2.7 2.8 6.82 2.8 11.9s4.12 9.2 9.2 9.2c5.31 0 8.83-3.73 8.83-8.98 0-.6-.07-1.06-.15-1.52z" />
  </svg>
);

/* ================= DROPDOWN ================= */

// "Label  Value ▾" trigger with a small menu, as in the design's filter bar
export const Dropdown = ({ label, value, options, onChange, align = 'left', bare = false }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const close = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false);
    };
    const esc = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', esc);
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('keydown', esc);
    };
  }, [open]);

  const current = options.find((o) => o.value === value) || options[0];

  return (
    <div ref={ref} className="relative">
      <button type="button" className={`dropdown-trigger ${bare ? 'border-transparent! px-1.5' : ''}`} aria-haspopup="listbox" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
        {label} <strong>{current?.label}</strong>
        <ChevronDown size={14} />
      </button>
      {open && (
        <div className={`menu top-[calc(100%+6px)] ${align === 'right' ? 'right-0' : 'left-0'}`} role="listbox">
          {options.map((o) => (
            <button
              key={o.value}
              type="button"
              role="option"
              aria-selected={o.value === value}
              className="menu-item"
              onClick={() => {
                onChange(o.value);
                setOpen(false);
              }}
            >
              {o.dot && <span className="h-2 w-2 rounded-full" style={{ background: o.dot }} />}
              <span className="flex-1">{o.label}</span>
              {o.value === value && <span className="text-accent">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
