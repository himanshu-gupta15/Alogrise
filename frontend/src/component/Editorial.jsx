import { CirclePlay } from 'lucide-react';

const formatDuration = (seconds) => {
  const total = Math.round(Number(seconds) || 0);
  if (!total) return '';
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
};

const Editorial = ({ secureUrl, thumbnailUrl, duration }) => {
  if (!secureUrl) {
    return (
      <div className="grid aspect-video place-items-center rounded-md bg-surface text-neutral-400">
        <span className="flex flex-col items-center gap-2 text-sm">
          <CirclePlay size={40} className="text-neutral-600" strokeWidth={1.25} />
          No video walkthrough for this problem yet
        </span>
      </div>
    );
  }

  return (
    <div>
      <video
        src={secureUrl}
        poster={thumbnailUrl}
        controls
        preload="metadata"
        className="aspect-video w-full rounded-md bg-surface"
      />
      {duration ? <p className="mt-3 text-sm text-neutral-400">Video walkthrough · {formatDuration(duration)}</p> : null}
    </div>
  );
};

export default Editorial;
