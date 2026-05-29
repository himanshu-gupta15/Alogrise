// import { useParams } from 'react-router';
// import React, { useState } from 'react';
// import { useForm } from 'react-hook-form';
// import axios from 'axios';
// import axiosClient from '../utils/axiosClient';
// import { CloudUpload, FileVideo, CheckCircle, AlertCircle, Loader2, Gauge } from 'lucide-react';

// function AdminUpload() {
//   const { problemId } = useParams();
//   const [uploading, setUploading] = useState(false);
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [uploadedVideo, setUploadedVideo] = useState(null);

//   const { register, handleSubmit, watch, formState: { errors }, reset, setError, clearErrors } = useForm();
//   const selectedFile = watch('videoFile')?.[0];

//   const onSubmit = async (data) => {
//     const file = data.videoFile[0];
//     setUploading(true);
//     setUploadProgress(0);
//     clearErrors();

//     try {
//       const signatureResponse = await axiosClient.get(`/video/create/${problemId}`);
//       const { signature, timestamp, public_id, api_key, cloud_name, upload_url } = signatureResponse.data;
//      console.log(signatureResponse.data)
//       // const formData = new FormData();
//       // formData.append('file', file);
//       // formData.append('signature', signature);
//       // formData.append('timestamp', timestamp);
//       // formData.append('public_id', public_id);
//       // formData.append('api_key', api_key);

// //   const formData = new FormData();
// // formData.append("file", file);
// // formData.append("api_key", api_key); // Use the key from the response
// // formData.append("timestamp", timestamp);
// // formData.append("signature", signature);
// // formData.append("public_id", public_id); 

// const formData = new FormData();
// formData.append("file", file);
// formData.append("api_key", api_key);
// formData.append("timestamp", timestamp); 
// formData.append("public_id", public_id); 
// formData.append("signature", signature);

// // IMPORTANT: Do NOT manually append 'resource_type' here if it's already 
// // included in the upload_url (which it is in your code: .../video/upload).
// // Cloudinary automatically infers resource_type from the URL.
// // console.log it one last time before the axios call
// console.log("FRONTEND SENDING:", { timestamp, public_id, signature });

// // Note: We do NOT append resource_type to formData 
// // because it's already in the URL (.../video/upload)


//       const uploadResponse = await axios.post(upload_url, formData, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//         onUploadProgress: (progressEvent) => {
//           const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
//           setUploadProgress(progress);
//         },
//       });

//       const cloudinaryResult = uploadResponse.data;

//       const metadataResponse = await axiosClient.post('/video/save', {
//         problemId: problemId,
//         cloudinaryPublicId: cloudinaryResult.public_id,
//         secureUrl: cloudinaryResult.secure_url,
//         duration: cloudinaryResult.duration,
//       });

//       setUploadedVideo(metadataResponse.data.videoSolution);
//       reset();
//     } catch (err) {
//       setError('root', { type: 'manual', message: err.response?.data?.message || 'Transmission failed.' });
//     } finally {
//       setUploading(false);
//       setUploadProgress(0);
//     }
//   };



//   const formatFileSize = (bytes) => {
//     if (bytes === 0) return '0 Bytes';
//     const k = 1024;
//     const sizes = ['Bytes', 'KB', 'MB', 'GB'];
//     const i = Math.floor(Math.log(bytes) / Math.log(k));
//     return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
//   };

//   return (
//     <div className="min-h-screen bg-[#020202] text-white flex items-center justify-center p-6 relative overflow-hidden">
//       {/* Background Decor */}
//       <div className="absolute top-1/4 -left-20 w-96 h-96 bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none"></div>
//       <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>

//       <div className="relative w-full max-w-xl z-10">
//         <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
        
//         <div className="relative bg-slate-900/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-10 shadow-2xl">
//           <div className="text-center mb-10">
//             <div className="inline-flex p-3 bg-cyan-500/10 rounded-2xl mb-4 border border-cyan-500/20">
//               <CloudUpload className="text-cyan-400" size={32} />
//             </div>
//             <h2 className="text-3xl font-black tracking-tighter uppercase italic">Asset <span className="text-cyan-400">Uploader</span></h2>
//             <p className="text-slate-500 text-xs mt-2 uppercase tracking-[0.2em] font-mono">Problem ID: {problemId}</p>
//           </div>

//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
//             {/* Custom Styled File Input */}
//             <div className="group relative">
//               <label className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-3xl cursor-pointer transition-all duration-300
//                 ${errors.videoFile ? 'border-rose-500/50 bg-rose-500/5' : 'border-white/10 bg-white/5 hover:border-cyan-500/50 hover:bg-white/[0.08]'}`}>
                
//                 <div className="flex flex-col items-center justify-center pt-5 pb-6">
//                   <FileVideo className={`mb-3 ${errors.videoFile ? 'text-rose-400' : 'text-slate-400 group-hover:text-cyan-400'}`} size={32} />
//                   <p className="text-sm font-bold tracking-tight text-slate-300 uppercase">
//                     {selectedFile ? selectedFile.name : "Select Media Node"}
//                   </p>
//                   <p className="text-[10px] text-slate-500 mt-2 uppercase tracking-widest font-mono">Max Payload: 100MB</p>
//                 </div>
//                 <input
//                   type="file"
//                   accept="video/*"
//                   className="hidden"
//                   {...register('videoFile', {
//                     required: 'Asset selection required',
//                     validate: {
//                       isVideo: (files) => files[0]?.type.startsWith('video/') || 'Invalid file type',
//                       fileSize: (files) => files[0]?.size <= 100 * 1024 * 1024 || 'Size limit exceeded'
//                     }
//                   })}
//                   disabled={uploading}
//                 />
//               </label>
//               {errors.videoFile && <p className="text-rose-500 text-[10px] font-black uppercase mt-3 text-center tracking-widest">{errors.videoFile.message}</p>}
//             </div>

//             {/* Upload Progress Terminal */}
//             {uploading && (
//               <div className="bg-black/40 border border-white/5 rounded-2xl p-6 space-y-4 animate-in zoom-in-95">
//                 <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
//                   <span className="text-cyan-400 flex items-center gap-2">
//                     <Loader2 size={12} className="animate-spin" /> Transmitting Data...
//                   </span>
//                   <span className="text-white">{uploadProgress}%</span>
//                 </div>
//                 <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
//                   <div 
//                     className="h-full bg-gradient-to-r from-cyan-500 to-purple-600 shadow-[0_0_15px_rgba(6,182,212,0.5)] transition-all duration-300" 
//                     style={{ width: `${uploadProgress}%` }}
//                   ></div>
//                 </div>
//               </div>
//             )}

//             {/* Feedback Messages */}
//             {errors.root && (
//               <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3 text-rose-400">
//                 <AlertCircle size={18} />
//                 <span className="text-xs font-bold uppercase">{errors.root.message}</span>
//               </div>
//             )}

//             {uploadedVideo && (
//               <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl animate-in fade-in">
//                 <div className="flex items-center gap-4 mb-4">
//                   <CheckCircle className="text-emerald-400" size={24} />
//                   <div>
//                     <h3 className="text-xs font-black text-white uppercase tracking-widest">Transmission Successful</h3>
//                     <p className="text-[10px] text-emerald-400/70 font-mono mt-1 uppercase">Node Synced at {new Date(uploadedVideo.uploadedAt).toLocaleTimeString()}</p>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Action Button */}
//             <button
//               type="submit"
//               disabled={uploading}
//               className={`w-full py-5 rounded-2xl text-xs font-black uppercase tracking-[0.3em] transition-all relative overflow-hidden group
//                 ${uploading ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-cyan-600 text-white hover:bg-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.3)]'}`}
//             >
//               <span className="relative z-10">{uploading ? 'UPLOADING...' : 'INITIALIZE UPLOAD'}</span>
//               {!uploading && (
//                 <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
//               )}
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default AdminUpload;

// import { useParams } from 'react-router';
// import React, { useState } from 'react';
// import { useForm } from 'react-hook-form';
// import axios from 'axios';
// import axiosClient from '../utils/axiosClient'

// function AdminUpload(){
    
//     const {problemId}  = useParams();
    
//     const [uploading, setUploading] = useState(false);
//     const [uploadProgress, setUploadProgress] = useState(0);
//     const [uploadedVideo, setUploadedVideo] = useState(null);
    
//       const {
//         register,
//         handleSubmit,
//         watch,
//         formState: { errors },
//         reset,
//         setError,
//         clearErrors
//       } = useForm();
    
//       const selectedFile = watch('videoFile')?.[0];
    
//       // Upload video to Cloudinary
//       const onSubmit = async (data) => {
//         const file = data.videoFile[0];
        
//         setUploading(true);
//         setUploadProgress(0);
//         clearErrors();
    
//         try {
//           // Step 1: Get upload signature from backend
//           const signatureResponse = await axiosClient.get(`/video/create/${problemId}`);
//           const { signature, timestamp, public_id, api_key, cloud_name, upload_url } = signatureResponse.data;
    
//           // Step 2: Create FormData for Cloudinary upload
//           const formData = new FormData();
//           formData.append('file', file);
//           formData.append('signature', signature);
//           formData.append('timestamp', timestamp);
//           formData.append('public_id', public_id);
//           formData.append('api_key', api_key);
    
//           // Step 3: Upload directly to Cloudinary
//           const uploadResponse = await axios.post(upload_url, formData, {
//             headers: {
//               'Content-Type': 'multipart/form-data',
//             },
//             onUploadProgress: (progressEvent) => {
//               const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
//               setUploadProgress(progress);
//             },
//           });
    
//           const cloudinaryResult = uploadResponse.data;
    
//           // Step 4: Save video metadata to backend
//           const metadataResponse = await axiosClient.post('/video/save', {
//             problemId:problemId,
//             cloudinaryPublicId: cloudinaryResult.public_id,
//             secureUrl: cloudinaryResult.secure_url,
//             duration: cloudinaryResult.duration,
//           });
    
//           setUploadedVideo(metadataResponse.data.videoSolution);
//           reset(); // Reset form after successful upload
          
//         } catch (err) {
//           console.error('Upload error:', err);
//           setError('root', {
//             type: 'manual',
//             message: err.response?.data?.message || 'Upload failed. Please try again.'
//           });
//         } finally {
//           setUploading(false);
//           setUploadProgress(0);
//         }
//       };
    
//       // Format file size
//       const formatFileSize = (bytes) => {
//         if (bytes === 0) return '0 Bytes';
//         const k = 1024;
//         const sizes = ['Bytes', 'KB', 'MB', 'GB'];
//         const i = Math.floor(Math.log(bytes) / Math.log(k));
//         return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
//       };
    
//       // Format duration
//       const formatDuration = (seconds) => {
//         const mins = Math.floor(seconds / 60);
//         const secs = Math.floor(seconds % 60);
//         return `${mins}:${secs.toString().padStart(2, '0')}`;
//       };
    
//       return (
//         <div className="max-w-md mx-auto p-6">
//           <div className="card bg-base-100 shadow-xl">
//             <div className="card-body">
//               <h2 className="card-title">Upload Video</h2>
              
//               <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//                 {/* File Input */}
//                 <div className="form-control w-full">
//                   <label className="label">
//                     <span className="label-text">Choose video file</span>
//                   </label>
//                   <input
//                     type="file"
//                     accept="video/*"
//                     {...register('videoFile', {
//                       required: 'Please select a video file',
//                       validate: {
//                         isVideo: (files) => {
//                           if (!files || !files[0]) return 'Please select a video file';
//                           const file = files[0];
//                           return file.type.startsWith('video/') || 'Please select a valid video file';
//                         },
//                         fileSize: (files) => {
//                           if (!files || !files[0]) return true;
//                           const file = files[0];
//                           const maxSize = 100 * 1024 * 1024; // 100MB
//                           return file.size <= maxSize || 'File size must be less than 100MB';
//                         }
//                       }
//                     })}
//                     className={`file-input file-input-bordered w-full ${errors.videoFile ? 'file-input-error' : ''}`}
//                     disabled={uploading}
//                   />
//                   {errors.videoFile && (
//                     <label className="label">
//                       <span className="label-text-alt text-error">{errors.videoFile.message}</span>
//                     </label>
//                   )}
//                 </div>
    
//                 {/* Selected File Info */}
//                 {selectedFile && (
//                   <div className="alert alert-info">
//                     <div>
//                       <h3 className="font-bold">Selected File:</h3>
//                       <p className="text-sm">{selectedFile.name}</p>
//                       <p className="text-sm">Size: {formatFileSize(selectedFile.size)}</p>
//                     </div>
//                   </div>
//                 )}
    
//                 {/* Upload Progress */}
//                 {uploading && (
//                   <div className="space-y-2">
//                     <div className="flex justify-between text-sm">
//                       <span>Uploading...</span>
//                       <span>{uploadProgress}%</span>
//                     </div>
//                     <progress 
//                       className="progress progress-primary w-full" 
//                       value={uploadProgress} 
//                       max="100"
//                     ></progress>
//                   </div>
//                 )}
    
//                 {/* Error Message */}
//                 {errors.root && (
//                   <div className="alert alert-error">
//                     <span>{errors.root.message}</span>
//                   </div>
//                 )}
    
//                 {/* Success Message */}
//                 {uploadedVideo && (
//                   <div className="alert alert-success">
//                     <div>
//                       <h3 className="font-bold">Upload Successful!</h3>
//                       <p className="text-sm">Duration: {formatDuration(uploadedVideo.duration)}</p>
//                       <p className="text-sm">Uploaded: {new Date(uploadedVideo.uploadedAt).toLocaleString()}</p>
//                     </div>
//                   </div>
//                 )}
    
//                 {/* Upload Button */}
//                 <div className="card-actions justify-end bg-red-100">
//                   <button
//                     type="submit"
//                     disabled={uploading}
//                     className={`btn btn-primary ${uploading ? 'loading' : ''}`}
//                   >
//                     {uploading ? 'Uploading...' : 'Upload Video'}
//                   </button>
//                 </div>
//               </form>
            
//             </div>
//           </div>
//         </div>
//     );
// }


// export default AdminUpload;


import { useParams } from 'react-router';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import axiosClient from '../utils/axiosClient';
import { CloudUpload, FileVideo, CheckCircle2, AlertCircle, Loader2, Gauge } from 'lucide-react';

function AdminUpload() {
  const { problemId } = useParams();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedVideo, setUploadedVideo] = useState(null);

  const { register, handleSubmit, watch, formState: { errors }, reset, setError, clearErrors } = useForm();
  const selectedFile = watch('videoFile')?.[0];

  const onSubmit = async (data) => {
    const file = data.videoFile[0];
    setUploading(true);
    setUploadProgress(0);
    clearErrors();

    try {
      const signatureResponse = await axiosClient.get(`/video/create/${problemId}`);
      const { signature, timestamp, public_id, api_key, cloud_name, upload_url } = signatureResponse.data;

      const formData = new FormData();
      formData.append('file', file);
      formData.append('signature', signature);
      formData.append('timestamp', timestamp);
      formData.append('public_id', public_id);
      formData.append('api_key', api_key);

      const uploadResponse = await axios.post(upload_url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        },
      });

      const cloudinaryResult = uploadResponse.data;

      const metadataResponse = await axiosClient.post('/video/save', {
        problemId: problemId,
        cloudinaryPublicId: cloudinaryResult.public_id,
        secureUrl: cloudinaryResult.secure_url,
        duration: cloudinaryResult.duration,
      });

      setUploadedVideo(metadataResponse.data.videoSolution);
      reset();
    } catch (err) {
      setError('root', { 
        type: 'manual', 
        message: err.response?.data?.message || 'Transmission failed. Signal lost.' 
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-[#020202] text-white flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative w-full max-w-xl z-10">
        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-3xl blur opacity-20 transition duration-1000"></div>
        
        <div className="relative bg-slate-900/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-10 shadow-2xl">
          <div className="text-center mb-10">
            <div className="inline-flex p-4 bg-cyan-500/10 rounded-2xl mb-4 border border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
              <CloudUpload className="text-cyan-400" size={32} />
            </div>
            <h2 className="text-3xl font-black tracking-tighter uppercase">Media <span className="text-cyan-400">Uplink</span></h2>
            <p className="text-slate-500 text-[10px] mt-2 uppercase tracking-[0.3em] font-mono">Channel ID: {problemId}</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* File Dropzone Style Input */}
            <div className="group relative">
              <label className={`flex flex-col items-center justify-center w-full h-44 border-2 border-dashed rounded-3xl cursor-pointer transition-all duration-300
                ${errors.videoFile ? 'border-rose-500/50 bg-rose-500/5' : 'border-white/10 bg-white/5 hover:border-cyan-500/50 hover:bg-white/[0.08]'}`}>
                
                <div className="flex flex-col items-center justify-center text-center px-4">
                  <FileVideo className={`mb-3 ${errors.videoFile ? 'text-rose-400' : 'text-slate-400 group-hover:text-cyan-400'}`} size={36} />
                  <p className="text-sm font-bold tracking-tight text-slate-300 uppercase">
                    {selectedFile ? selectedFile.name : "Select Asset for Transmission"}
                  </p>
                  {selectedFile && <p className="text-[10px] text-cyan-500 mt-2 font-mono uppercase">{formatFileSize(selectedFile.size)}</p>}
                  {!selectedFile && <p className="text-[10px] text-slate-500 mt-2 uppercase tracking-widest font-mono">MAX PAYLOAD: 100MB</p>}
                </div>
                
                <input
                  type="file"
                  accept="video/*"
                  className="hidden"
                  {...register('videoFile', {
                    required: 'Asset selection required',
                    validate: {
                      isVideo: (files) => files[0]?.type.startsWith('video/') || 'Invalid file type',
                      fileSize: (files) => files[0]?.size <= 100 * 1024 * 1024 || 'Size limit exceeded'
                    }
                  })}
                  disabled={uploading}
                />
              </label>
              {errors.videoFile && <p className="text-rose-500 text-[10px] font-black uppercase mt-3 text-center tracking-widest animate-pulse">{errors.videoFile.message}</p>}
            </div>

            {/* Upload Progress UI */}
            {uploading && (
              <div className="bg-black/40 border border-white/5 rounded-2xl p-6 space-y-4 animate-in zoom-in-95">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em]">
                  <span className="text-cyan-400 flex items-center gap-2">
                    <Loader2 size={12} className="animate-spin" /> Stream Active
                  </span>
                  <span className="text-white">{uploadProgress}%</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-500 to-purple-600 shadow-[0_0_15px_rgba(6,182,212,0.6)] transition-all duration-300" 
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {errors.root && (
              <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3 text-rose-400 animate-in slide-in-from-top-2">
                <AlertCircle size={18} />
                <span className="text-[10px] font-black uppercase tracking-widest">{errors.root.message}</span>
              </div>
            )}

            {/* Success Message */}
            {uploadedVideo && (
              <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl animate-in fade-in zoom-in-95">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-emerald-500/20 rounded-lg">
                    <CheckCircle2 className="text-emerald-400" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-white uppercase tracking-widest">Protocol Success</h3>
                    <p className="text-[9px] text-emerald-400/70 font-mono mt-1 uppercase">Duration: {formatDuration(uploadedVideo.duration)} // Sync Complete</p>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={uploading}
              className={`w-full py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] transition-all relative overflow-hidden group
                ${uploading ? 'bg-slate-800 text-slate-500 cursor-wait' : 'bg-cyan-600 text-white hover:bg-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)]'}`}
            >
              <span className="relative z-10">{uploading ? 'TRANSMITTING...' : 'START UPLINK'}</span>
              {!uploading && (
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminUpload;