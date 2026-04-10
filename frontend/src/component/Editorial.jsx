// import { useState, useRef, useEffect } from 'react';
// import { Pause, Play, Volume2, Maximize, Film } from 'lucide-react';

// const Editorial = ({ secureUrl, thumbnailUrl, duration }) => {
//   const videoRef = useRef(null);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [currentTime, setCurrentTime] = useState(0);
//   const [isHovering, setIsHovering] = useState(false);

//   const formatTime = (seconds) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = Math.floor(seconds % 60);
//     return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
//   };

//   const togglePlayPause = () => {
//     if (videoRef.current) {
//       if (isPlaying) {
//         videoRef.current.pause();
//       } else {
//         videoRef.current.play();
//       }
//       setIsPlaying(!isPlaying);
//     }
//   };

//   useEffect(() => {
//     const video = videoRef.current;
//     const handleTimeUpdate = () => {
//       if (video) setCurrentTime(video.currentTime);
//     };
//     if (video) {
//       video.addEventListener('timeupdate', handleTimeUpdate);
//       return () => video.removeEventListener('timeupdate', handleTimeUpdate);
//     }
//   }, []);

//   return (
//     <div 
//       className="relative w-full max-w-4xl mx-auto group"
//       onMouseEnter={() => setIsHovering(true)}
//       onMouseLeave={() => setIsHovering(false)}
//     >
//       {/* Outer Glow Border */}
//       <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>

//       <div className="relative bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10">
        
//         {/* Header Overlay (Briefing Info) */}
//         <div className={`absolute top-0 left-0 right-0 p-6 z-20 transition-opacity duration-500 bg-gradient-to-b from-black/80 to-transparent ${
//           isHovering || !isPlaying ? 'opacity-100' : 'opacity-0'
//         }`}>
//           <div className="flex items-center gap-3">
//             <div className="p-2 bg-cyan-500/20 rounded-lg">
//               <Film size={18} className="text-cyan-400" />
//             </div>
//             <div>
//               <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400">Solution Briefing</h3>
//               <p className="text-xs text-slate-400 font-mono">ENCRYPTED_FEED_01.MP4</p>
//             </div>
//           </div>
//         </div>

//         {/* Video Element */}
//         <video
//           ref={videoRef}
//           src={secureUrl}
//           poster={thumbnailUrl}
//           onClick={togglePlayPause}
//           className="w-full aspect-video bg-black cursor-pointer object-cover"
//         />
        
//         {/* Central Play Button (Only visible when paused) */}
//         {!isPlaying && (
//           <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] pointer-events-none transition-all">
//              <div className="w-20 h-20 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center animate-pulse">
//                 <Play size={40} className="text-cyan-400 fill-cyan-400 translate-x-1" />
//              </div>
//           </div>
//         )}

//         {/* Custom Video Controls */}
//         <div 
//           className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent px-6 py-8 transition-opacity duration-500 z-20 ${
//             isHovering || !isPlaying ? 'opacity-100' : 'opacity-0'
//           }`}
//         >
//           {/* Progress Slider */}
//           <div className="relative w-full h-1.5 bg-white/10 rounded-full mb-6 group/range overflow-hidden">
//             <div 
//               className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-500 to-purple-500 z-10 shadow-[0_0_10px_rgba(6,182,212,0.8)]"
//               style={{ width: `${(currentTime / duration) * 100}%` }}
//             ></div>
//             <input
//               type="range"
//               min="0"
//               max={duration}
//               value={currentTime}
//               onChange={(e) => {
//                 if (videoRef.current) videoRef.current.currentTime = Number(e.target.value);
//               }}
//               className="absolute inset-0 w-full opacity-0 cursor-pointer z-20"
//             />
//           </div>

//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-6">
//               <button
//                 onClick={togglePlayPause}
//                 className="text-white hover:text-cyan-400 transition-colors transform active:scale-90"
//               >
//                 {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
//               </button>
              
//               <div className="flex items-center gap-2">
//                 <Volume2 size={18} className="text-slate-400" />
//                 <div className="w-16 h-1 bg-white/10 rounded-full overflow-hidden">
//                     <div className="h-full bg-white/40 w-3/4"></div>
//                 </div>
//               </div>

//               <div className="text-[10px] font-mono tracking-widest text-slate-400">
//                 <span className="text-white font-bold">{formatTime(currentTime)}</span>
//                 <span className="mx-2">/</span>
//                 <span>{formatTime(duration)}</span>
//               </div>
//             </div>

//             <button className="text-slate-400 hover:text-white transition-colors">
//               <Maximize size={20} />
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Footer System Log */}
//       <div className="mt-4 flex justify-between items-center px-2">
//         <p className="text-[9px] font-bold text-slate-600 uppercase tracking-[0.2em] flex items-center gap-2">
//           <div className="w-1 h-1 bg-emerald-500 rounded-full shadow-[0_0_5px_#10b981]"></div>
//           Streaming from Secure Node
//         </p>
//         <p className="text-[9px] font-mono text-slate-700 uppercase tracking-widest">
//           Bitrate: 4500kbps // 1080p
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Editorial;

import { useState, useRef, useEffect } from 'react';
import { Pause, Play, Volume2, VolumeX, Maximize, Film } from 'lucide-react';

const Editorial = ({ secureUrl, thumbnailUrl, duration }) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null); // Ref for fullscreen
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [volume, setVolume] = useState(1); // Volume state (0 to 1)
  const [isMuted, setIsMuted] = useState(false);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Logic for Volume change
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      videoRef.current.muted = newVolume === 0;
      setIsMuted(newVolume === 0);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const newMutedState = !isMuted;
      videoRef.current.muted = newMutedState;
      setIsMuted(newMutedState);
      if (newMutedState) {
        setVolume(0);
      } else {
        setVolume(1);
        videoRef.current.volume = 1;
      }
    }
  };

  // Logic for Fullscreen
  const handleMaximize = () => {
    if (containerRef.current) {
      if (!document.fullscreenElement) {
        containerRef.current.requestFullscreen().catch((err) => {
          alert(`Error attempting to enable full-screen mode: ${err.message}`);
        });
      } else {
        document.exitFullscreen();
      }
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    const handleTimeUpdate = () => {
      if (video) setCurrentTime(video.currentTime);
    };
    if (video) {
      video.addEventListener('timeupdate', handleTimeUpdate);
      return () => video.removeEventListener('timeupdate', handleTimeUpdate);
    }
  }, []);

  return (
    <div 
      ref={containerRef} // Added ref here
      className="relative w-full max-w-4xl mx-auto group bg-black"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>

      <div className="relative bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10">
        
        {/* Header Overlay */}
        <div className={`absolute top-0 left-0 right-0 p-6 z-20 transition-opacity duration-500 bg-gradient-to-b from-black/80 to-transparent ${
          isHovering || !isPlaying ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-500/20 rounded-lg">
              <Film size={18} className="text-cyan-400" />
            </div>
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400">Solution Briefing</h3>
              <p className="text-xs text-slate-400 font-mono">ENCRYPTED_FEED_01.MP4</p>
            </div>
          </div>
        </div>

        <video
          ref={videoRef}
          src={secureUrl}
          poster={thumbnailUrl}
          onClick={togglePlayPause}
          className="w-full aspect-video bg-black cursor-pointer object-cover"
        />
        
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] pointer-events-none transition-all">
             <div className="w-20 h-20 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center animate-pulse">
                <Play size={40} className="text-cyan-400 fill-cyan-400 translate-x-1" />
             </div>
          </div>
        )}

        {/* Custom Video Controls */}
        <div 
          className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent px-6 py-8 transition-opacity duration-500 z-20 ${
            isHovering || !isPlaying ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Progress Slider */}
          <div className="relative w-full h-1.5 bg-white/10 rounded-full mb-6 group/range overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-500 to-purple-500 z-10 shadow-[0_0_10px_rgba(6,182,212,0.8)]"
              style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
            ></div>
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={(e) => {
                if (videoRef.current) videoRef.current.currentTime = Number(e.target.value);
              }}
              className="absolute inset-0 w-full opacity-0 cursor-pointer z-20"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <button onClick={togglePlayPause} className="text-white hover:text-cyan-400 transition-colors">
                {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
              </button>
              
              {/* Functional Volume Control */}
              <div className="flex items-center gap-2 group/volume">
                <button onClick={toggleMute} className="text-slate-400 hover:text-white transition-colors">
                    {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-16 h-1 bg-white/10 rounded-full accent-cyan-400 cursor-pointer"
                />
              </div>

              <div className="text-[10px] font-mono tracking-widest text-slate-400">
                <span className="text-white font-bold">{formatTime(currentTime)}</span>
                <span className="mx-2">/</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Functional Maximize Button */}
            <button 
                onClick={handleMaximize}
                className="text-slate-400 hover:text-white transition-colors"
            >
              <Maximize size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-between items-center px-2">
        <p className="text-[9px] font-bold text-slate-600 uppercase tracking-[0.2em] flex items-center gap-2">
          <div className="w-1 h-1 bg-emerald-500 rounded-full shadow-[0_0_5px_#10b981]"></div>
          Streaming from Secure Node
        </p>
        <p className="text-[9px] font-mono text-slate-700 uppercase tracking-widest">
          Bitrate: 4500kbps // 1080p
        </p>
      </div>
    </div>
  );
};

export default Editorial;