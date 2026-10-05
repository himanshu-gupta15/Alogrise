// Formatting helpers shared across the redesigned screens.

const DIFFICULTY_COLORS = {
  easy: 'var(--color-easy)',
  medium: 'var(--color-medium)',
  hard: 'var(--color-hard)',
};

export const difficultyColor = (difficulty) =>
  DIFFICULTY_COLORS[String(difficulty || '').toLowerCase()] || 'var(--color-neutral-300)';

export const capitalize = (value) => {
  const text = String(value || '');
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export const initialsOf = (user) => {
  const first = user?.firstName?.trim()?.[0] || '';
  const last = user?.lastName?.trim()?.[0] || '';
  return (first + last).toUpperCase() || 'U';
};

export const timeAgo = (date) => {
  if (!date) return '';
  const seconds = Math.max(0, Math.floor((Date.now() - new Date(date).getTime()) / 1000));
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Yesterday';
  if (days < 30) return `${days} days ago`;
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export const pad2 = (n) => String(n).padStart(2, '0');

export const formatNumber = (n) => Number(n || 0).toLocaleString('en-US');
