import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { CircleCheck, CloudUpload, FileVideo } from 'lucide-react';
import axiosClient from '../utils/axiosClient';
import { Notice } from './ui';
import { capitalize, difficultyColor } from '../utils/format';

const MAX_BYTES = 100 * 1024 * 1024; // Cloudinary's default video upload limit

const formatFileSize = (bytes) => {
  if (!bytes) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)));
  return `${(bytes / 1024 ** i).toFixed(i ? 1 : 0)} ${units[i]}`;
};

const formatDuration = (seconds) => {
  const s = Math.round(Number(seconds) || 0);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};

function AdminUpload() {
  const { problemId } = useParams();
  const inputRef = useRef(null);
  const [problem, setProblem] = useState(null);
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploaded, setUploaded] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    axiosClient
      .get(`/problem/problemById/${problemId}`)
      .then(({ data }) => setProblem(data))
      .catch(() => setProblem(null));
  }, [problemId]);

  const pick = (candidate) => {
    setError('');
    setUploaded(null);
    if (!candidate) return;
    if (!candidate.type.startsWith('video/')) {
      setError('Choose a video file.');
      return;
    }
    if (candidate.size > MAX_BYTES) {
      setError(`That file is ${formatFileSize(candidate.size)}. The limit is ${formatFileSize(MAX_BYTES)}.`);
      return;
    }
    setFile(candidate);
  };

  const upload = async () => {
    if (!file) return;
    setUploading(true);
    setProgress(0);
    setError('');
    try {
      // 1. Signed upload parameters from our server
      const { data: sig } = await axiosClient.get(`/video/create/${problemId}`);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('signature', sig.signature);
      formData.append('timestamp', sig.timestamp);
      formData.append('public_id', sig.public_id);
      formData.append('api_key', sig.api_key);

      // 2. Upload straight to Cloudinary
      const { data: cloud } = await axios.post(sig.upload_url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => e.total && setProgress(Math.round((e.loaded * 100) / e.total)),
      });

      // 3. Save the video against the problem
      const { data: saved } = await axiosClient.post('/video/save', {
        problemId,
        cloudinaryPublicId: cloud.public_id,
        secureUrl: cloud.secure_url,
        duration: cloud.duration,
      });
      setUploaded(saved.videoSolution);
      setFile(null);
    } catch (err) {
      setError(err?.response?.data?.error || err?.response?.data?.message || err?.response?.data?.error?.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="page fade-in">
      <Link to="/admin/video" className="text-sm text-neutral-400 hover:text-accent">
        ← Video solutions
      </Link>
      <h1 className="page-title mt-3">Upload walkthrough</h1>
      {problem ? (
        <p className="mt-2 text-[15px] text-neutral-300">
          For <span className="text-text">{problem.title}</span>{' '}
          <span style={{ color: difficultyColor(problem.difficulty) }}>· {capitalize(problem.difficulty)}</span>
          {problem.secureUrl && <span className="text-neutral-400"> · already has a video; a new upload replaces what users see</span>}
        </p>
      ) : (
        <p className="page-sub">Loading problem…</p>
      )}

      <div className="mt-10 max-w-2xl">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            pick(e.dataTransfer.files?.[0]);
          }}
          disabled={uploading}
          className="flex w-full flex-col items-center gap-3 rounded-[14px] px-6 py-14 text-center transition-colors"
          style={{
            border: `1px dashed ${dragging ? 'var(--color-accent)' : 'var(--color-divider)'}`,
            background: dragging ? 'color-mix(in srgb, var(--color-accent) 8%, transparent)' : 'var(--color-surface)',
          }}
        >
          {file ? <FileVideo size={36} className="text-accent" strokeWidth={1.5} /> : <CloudUpload size={36} className="text-neutral-500" strokeWidth={1.5} />}
          {file ? (
            <>
              <span className="text-[16px]">{file.name}</span>
              <span className="text-sm text-neutral-400">{formatFileSize(file.size)} · click to choose a different file</span>
            </>
          ) : (
            <>
              <span className="text-[16px]">Drop a video here, or click to choose</span>
              <span className="text-sm text-neutral-400">MP4, MOV or WebM · up to {formatFileSize(MAX_BYTES)}</span>
            </>
          )}
        </button>
        <input ref={inputRef} type="file" accept="video/*" className="hidden" onChange={(e) => pick(e.target.files?.[0])} />

        {uploading && (
          <div className="mt-6">
            <div className="flex text-sm">
              <span className="text-neutral-300">{progress < 100 ? 'Uploading…' : 'Processing…'}</span>
              <span className="flex-1" />
              <span className="tnum text-neutral-400">{progress}%</span>
            </div>
            <div className="mt-2 h-1 rounded-sm bg-neutral-800">
              <div className="h-1 rounded-sm bg-accent transition-[width]" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        {error && (
          <div className="mt-6">
            <Notice type="error" onClose={() => setError('')}>
              {error}
            </Notice>
          </div>
        )}

        {uploaded && (
          <div className="mt-6 flex items-center gap-4 rounded-md p-4" style={{ boxShadow: 'inset 0 0 0 1px var(--color-accent)' }}>
            {uploaded.thumbnailUrl && <img src={uploaded.thumbnailUrl} alt="" className="h-16 w-28 rounded-sm object-cover" />}
            <span className="flex-1">
              <span className="flex items-center gap-2 text-accent-200">
                <CircleCheck size={16} className="text-accent" /> Uploaded
              </span>
              <span className="mt-1 block text-sm text-neutral-400">
                {formatDuration(uploaded.duration)} · now showing in the Editorial tab
              </span>
            </span>
            <Link to={`/problem/${problemId}`} className="btn btn-secondary">
              View problem
            </Link>
          </div>
        )}

        <div className="mt-8">
          <button type="button" className="btn btn-primary btn-lg" onClick={upload} disabled={!file || uploading}>
            <CloudUpload size={16} /> {uploading ? 'Uploading…' : 'Upload video'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminUpload;
