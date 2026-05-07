


// import React from 'react';
// import { useForm, useFieldArray } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';
// import axiosClient from '../utils/axiosClient';
// import { useNavigate } from 'react-router';
// import { Code2, Beaker, FileText, Plus, Trash2, ShieldCheck, EyeOff } from 'lucide-react';

// // ... (Keep the problemSchema and defaultValues the same)
// const problemSchema = z.object({
//   title: z.string().min(1, 'Title is required'),
//   description: z.string().min(1, 'Description is required'),
//   difficulty: z.enum(['easy', 'medium', 'hard']),
//   tags: z.enum(['array', 'linkedList', 'graph', 'dp']),
//   visibleTestCases: z.array(
//     z.object({
//       input: z.string().min(1, 'Input is required'),
//       output: z.string().min(1, 'Output is required'),
//       explanation: z.string().min(1, 'Explanation is required')
//     })
//   ).min(1, 'At least one visible test case required'),
//   hiddenTestCases: z.array(
//     z.object({
//       input: z.string().min(1, 'Input is required'),
//       output: z.string().min(1, 'Output is required')
//     })
//   ).min(1, 'At least one hidden test case required'),
//   startCode: z.array(
//     z.object({
//       language: z.enum(['C++', 'Java', 'JavaScript']),
//       initialCode: z.string().min(1, 'Initial code is required')
//     })
//   ).length(3),
//   referenceSolution: z.array(
//     z.object({
//       language: z.enum(['C++', 'Java', 'JavaScript']),
//       completeCode: z.string().min(1, 'Complete code is required')
//     })
//   ).length(3)
// });
// function AdminPanel() {
//   const navigate = useNavigate();
//   const { register, control, handleSubmit, formState: { errors } } = useForm({
//     resolver: zodResolver(problemSchema),
//     defaultValues: {
//       startCode: [
//         { language: 'C++', initialCode: '' },
//         { language: 'Java', initialCode: '' },
//         { language: 'JavaScript', initialCode: '' }
//       ],
//       referenceSolution: [
//         { language: 'C++', completeCode: '' },
//         { language: 'Java', completeCode: '' },
//         { language: 'JavaScript', completeCode: '' }
//       ]
//     }
//   });

//   const { fields: visibleFields, append: appendVisible, remove: removeVisible } = useFieldArray({ control, name: 'visibleTestCases' });
//   const { fields: hiddenFields, append: appendHidden, remove: removeHidden } = useFieldArray({ control, name: 'hiddenTestCases' });

//   // ... (Keep the onSubmit the same)
//   // const onSubmit = async (data) => {
//   //   try {
//   //     await axiosClient.post('/problem/create', data);
//   //     alert('Problem initialized in database!');
//   //     navigate('/');
//   //   } catch (error) {
//   //     alert(`Error: ${error.response?.data?.message || error.message}`);
//   //   }
//   // };

//   const onSubmit = async (data) => {
//   console.log("Submitting Data:", data); // Check this in Browser Console
//   try {
//     const response = await axiosClient.post('/problem/create', data);
//     alert('Problem initialized!');
//     navigate('/');
//   } catch (error) {
//     // Improved error logging
//     console.error("Server Error Response:", error.response?.data);
//     alert(`Error: ${error.response?.data?.message || error.response?.data || error.message}`);
//   }
// };

//   return (
//     <div className="min-h-screen bg-black text-white pb-20 relative overflow-hidden">
//       {/* Background Atmosphere */}
//       <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none"></div>
//       <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-500/5 blur-[120px] rounded-full pointer-events-none"></div>

//       <div className="container mx-auto px-6 pt-12 relative z-10">
//         {/* Header */}
//         <div className="mb-12 border-l-4 border-cyan-500 pl-6">
//           <h2 className="text-cyan-400 font-mono text-xs tracking-[0.4em] uppercase mb-2">Editor Mode / Admin</h2>
//           <h1 className="text-5xl font-black tracking-tighter">Forge New <span className="text-slate-500">Problem</span></h1>
//         </div>

//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-10 max-w-5xl">
          
//           {/* Section: Basic Info */}
//           <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
//             <div className="flex items-center gap-3 mb-8 text-cyan-400">
//               <FileText size={20} />
//               <h3 className="font-bold uppercase tracking-widest text-sm text-white">Metadata</h3>
//             </div>
            
//             <div className="grid grid-cols-1 gap-6">
//               <div className="space-y-2">
//                 <label className="text-xs font-bold text-slate-500 uppercase ml-1">Problem Title</label>
//                 <input {...register('title')} placeholder="e.g. Invert Binary Tree" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:border-cyan-500 outline-none transition-all" />
//                 {errors.title && <p className="text-rose-500 text-xs mt-1">{errors.title.message}</p>}
//               </div>

//               <div className="space-y-2">
//                 <label className="text-xs font-bold text-slate-500 uppercase ml-1">Problem Description</label>
//                 <textarea {...register('description')} rows={5} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:border-cyan-500 outline-none transition-all resize-none font-mono text-sm" />
//               </div>

//               <div className="grid grid-cols-2 gap-6">
//                 <div className="space-y-2">
//                     <label className="text-xs font-bold text-slate-500 uppercase ml-1">Difficulty</label>
//                     <select {...register('difficulty')} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:border-cyan-500 outline-none appearance-none cursor-pointer">
//                         <option value="easy">Easy</option>
//                         <option value="medium">Medium</option>
//                         <option value="hard">Hard</option>
//                     </select>
//                 </div>
//                 <div className="space-y-2">
//                     <label className="text-xs font-bold text-slate-500 uppercase ml-1">Tags</label>
//                     <select {...register('tags')} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:border-cyan-500 outline-none appearance-none">
//                         <option value="array">Array</option>
//                         <option value="linkedList">Linked List</option>
//                         <option value="graph">Graph</option>
//                         <option value="dp">Dynamic Programming</option>
//                     </select>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Section: Validation Suite (Test Cases) */}
//           <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
//             <div className="flex items-center gap-3 mb-8 text-purple-400">
//                 <Beaker size={20} />
//                 <h3 className="font-bold uppercase tracking-widest text-sm text-white">Validation Suite</h3>
//             </div>

//             {/* Visible Test Cases */}
//             <div className="space-y-6 mb-12">
//                 <div className="flex items-center justify-between">
//                     <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Public Test Cases</h4>
//                     <button type="button" onClick={() => appendVisible({ input: '', output: '', explanation: '' })} className="flex items-center gap-2 px-4 py-2 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-lg text-xs font-bold hover:bg-cyan-500 hover:text-black transition-all">
//                         <Plus size={14} /> Add Public Case
//                     </button>
//                 </div>
//                 <div className="space-y-4">
//                     {visibleFields.map((field, index) => (
//                         <div key={field.id} className="relative bg-black/40 border border-white/5 p-6 rounded-2xl group">
//                             <button type="button" onClick={() => removeVisible(index)} className="absolute top-4 right-4 text-slate-600 hover:text-rose-500 transition-colors">
//                                 <Trash2 size={16} />
//                             </button>
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                 <input {...register(`visibleTestCases.${index}.input`)} placeholder="Input" className="bg-black/40 border border-white/10 rounded-lg p-3 text-sm focus:border-purple-500 outline-none" />
//                                 <input {...register(`visibleTestCases.${index}.output`)} placeholder="Expected Output" className="bg-black/40 border border-white/10 rounded-lg p-3 text-sm focus:border-purple-500 outline-none" />
//                                 <textarea {...register(`visibleTestCases.${index}.explanation`)} placeholder="Explanation for user" className="md:col-span-2 bg-black/40 border border-white/10 rounded-lg p-3 text-sm focus:border-purple-500 outline-none" />
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </div>

//             <div className="h-px bg-white/5 mb-12"></div>

//             {/* Hidden Test Cases */}
//             <div className="space-y-6">
//                 <div className="flex items-center justify-between">
//                     <div className="flex items-center gap-2">
//                         <EyeOff size={16} className="text-rose-500/50" />
//                         <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Hidden Test Cases</h4>
//                     </div>
//                     <button type="button" onClick={() => appendHidden({ input: '', output: '' })} className="flex items-center gap-2 px-4 py-2 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-lg text-xs font-bold hover:bg-rose-500 hover:text-white transition-all">
//                         <Plus size={14} /> Add Hidden Case
//                     </button>
//                 </div>
                
//                 <div className="space-y-4">
//                     {hiddenFields.map((field, index) => (
//                         <div key={field.id} className="relative bg-black/40 border border-white/5 p-6 rounded-2xl group border-l-2 border-l-rose-500/20">
//                             <button type="button" onClick={() => removeHidden(index)} className="absolute top-4 right-4 text-slate-600 hover:text-rose-500 transition-colors">
//                                 <Trash2 size={16} />
//                             </button>
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                 <input {...register(`hiddenTestCases.${index}.input`)} placeholder="Secret Input" className="bg-black/40 border border-white/10 rounded-lg p-3 text-sm focus:border-rose-500 outline-none" />
//                                 <input {...register(`hiddenTestCases.${index}.output`)} placeholder="Secret Output" className="bg-black/40 border border-white/10 rounded-lg p-3 text-sm focus:border-rose-500 outline-none" />
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//           </div>

//           {/* ... (Keep the Code Templates and Submit Button the same) */}

//           {/* Section: Code Templates */}
//           <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
//             <div className="flex items-center gap-3 mb-8 text-emerald-400">
//               <Code2 size={20} />
//               <h3 className="font-bold uppercase tracking-widest text-sm text-white">Implementation Templates</h3>
//             </div>

//             <div className="space-y-12">
//                 {['C++', 'Java', 'JavaScript'].map((lang, idx) => (
//                     <div key={lang} className="space-y-4">
//                         <div className="flex items-center gap-2">
//                             <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></span>
//                             <span className="text-sm font-black text-slate-300 uppercase tracking-widest">{lang}</span>
//                         </div>
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                             <div className="space-y-2">
//                                 <p className="text-[10px] font-bold text-slate-500 uppercase ml-1">Initial Boilerplate</p>
//                                 <textarea {...register(`startCode.${idx}.initialCode`)} className="w-full h-48 bg-black border border-white/5 rounded-xl p-4 font-mono text-xs text-cyan-400 focus:border-cyan-500 outline-none" />
//                             </div>
//                             <div className="space-y-2">
//                                 <p className="text-[10px] font-bold text-slate-500 uppercase ml-1">Reference Solution</p>
//                                 <textarea {...register(`referenceSolution.${idx}.completeCode`)} className="w-full h-48 bg-black border border-white/5 rounded-xl p-4 font-mono text-xs text-emerald-400 focus:border-emerald-500 outline-none" />
//                             </div>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//           </div>

//           <button type="submit" className="group relative w-full py-5 rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(6,182,212,0.3)] hover:shadow-[0_0_40px_rgba(6,182,212,0.5)] transition-all">
//              <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-purple-600 group-hover:scale-105 transition-transform"></div>
//              <span className="relative z-10 flex items-center justify-center gap-3 text-white font-black tracking-[0.3em] uppercase">
//                 <ShieldCheck size={20} /> Push to Production
//              </span>
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default AdminPanel;




import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axiosClient from '../utils/axiosClient';
import { useNavigate } from 'react-router';
import { Code2, Beaker, FileText, Plus, Trash2, ShieldCheck, EyeOff, Sparkles, Layers } from 'lucide-react';

// ... (Keep the problemSchema and defaultValues the same as your provided code)
 const problemSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  tagsCsv: z.string().min(1, 'At least one topic is required'),
  companiesCsv: z.string().optional(),
  visibleTestCases: z.array(
    z.object({
      input: z.string().min(1, 'Input is required'),
      output: z.string().min(1, 'Output is required'),
      explanation: z.string().min(1, 'Explanation is required')
    })
  ).min(1, 'At least one visible test case required'),
  hiddenTestCases: z.array(
    z.object({
      input: z.string().min(1, 'Input is required'),
      output: z.string().min(1, 'Output is required')
    })
  ).min(1, 'At least one hidden test case required'),
  startCode: z.array(
    z.object({
      language: z.enum(['C++', 'Java', 'JavaScript']),
      initialCode: z.string().min(1, 'Initial code is required')
    })
  ).length(3),
  referenceSolution: z.array(
    z.object({
      language: z.enum(['C++', 'Java', 'JavaScript']),
      completeCode: z.string().min(1, 'Complete code is required')
    })
  ).length(3)
});

function AdminPanel() {
  const navigate = useNavigate();
  const { register, control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      visibleTestCases: [
        { input: '', output: '', explanation: '' }
      ],
      hiddenTestCases: [
        { input: '', output: '' }
      ],
      startCode: [
        { language: 'C++', initialCode: '' },
        { language: 'Java', initialCode: '' },
        { language: 'JavaScript', initialCode: '' }
      ],
      referenceSolution: [
        { language: 'C++', completeCode: '' },
        { language: 'Java', completeCode: '' },
        { language: 'JavaScript', completeCode: '' }
      ]
    }
  });

  const { fields: visibleFields, append: appendVisible, remove: removeVisible } = useFieldArray({ control, name: 'visibleTestCases' });
  const { fields: hiddenFields, append: appendHidden, remove: removeHidden } = useFieldArray({ control, name: 'hiddenTestCases' });

  const normalizeMultilineText = (value) => {
    if (typeof value !== 'string') return value;
    return value.replace(/\\n/g, '\n');
  };

  const normalizeProblemPayload = (data) => {
    const { companiesCsv, tagsCsv, ...rest } = data;

    return {
      ...rest,
      tags: (tagsCsv || '')
        .split(/[,\n]/)
        .map((tag) => tag.trim().toLowerCase())
        .filter(Boolean),
      companies: (companiesCsv || '')
        .split(/[,\n]/)
        .map((company) => company.trim())
        .filter(Boolean),
      visibleTestCases: data.visibleTestCases?.map((testCase) => ({
      ...testCase,
      input: normalizeMultilineText(testCase.input),
      output: normalizeMultilineText(testCase.output),
      explanation: normalizeMultilineText(testCase.explanation)
    })) ?? [],
    hiddenTestCases: data.hiddenTestCases?.map((testCase) => ({
      ...testCase,
      input: normalizeMultilineText(testCase.input),
      output: normalizeMultilineText(testCase.output)
    })) ?? [],
    startCode: data.startCode?.map((codeBlock) => ({
      ...codeBlock,
      initialCode: normalizeMultilineText(codeBlock.initialCode)
    })) ?? [],
    referenceSolution: data.referenceSolution?.map((codeBlock) => ({
      ...codeBlock,
      completeCode: normalizeMultilineText(codeBlock.completeCode)
    })) ?? []
    };
  };

  const onSubmit = async (data) => {
    try {
      console.log("Submitting Data:", data); // Debug log
      const payload = { ...normalizeProblemPayload(data), skipJudge: true };
      const resp = await axiosClient.post('/problem/create', payload);
      console.log('Server response:', resp);
      alert('RECON_SYNC: Problem successfully initialized in the grid.');
      navigate('/');
    } catch (error) {
      console.error('Submit error response:', error.response || error);
      const status = error.response?.status;
      const data = error.response?.data;
      alert(`SYNC_FAILURE: ${status || ''} ${typeof data === 'string' ? data : JSON.stringify(data) || error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#05070a] text-white pb-24 relative overflow-hidden selection:bg-cyan-500/30">
      {/* Enhanced Atmospheric Glows */}
      <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-cyan-600/10 blur-[150px] rounded-full pointer-events-none animate-pulse"></div>
      <div className="fixed bottom-0 left-0 w-[800px] h-[800px] bg-purple-600/10 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="container mx-auto px-6 pt-20 relative z-10 perspective-1000">
        
        {/* Animated Header */}
        <div className="mb-16 border-l-4 border-cyan-500 pl-8 animate-in slide-in-from-left duration-700">
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-[10px] tracking-[0.5em] uppercase mb-2">
             <Layers size={14} /> System Architect / Forge_01
          </div>
          <h1 className="text-6xl font-black tracking-tighter uppercase italic leading-none">
            New <span className="text-slate-600">Problem</span> <br /> 
            Deployment
          </h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit, (errs) => { console.log('Validation errors:', errs); alert('Validation error: please check required fields.'); })} className="space-y-16 max-w-5xl">
          {Object.keys(errors).length > 0 && (
            <div className="bg-rose-900/20 border border-rose-500/30 text-rose-200 p-4 rounded-lg">
              <strong className="uppercase text-xs">Validation Errors</strong>
              <pre className="text-xs mt-2 max-h-40 overflow-auto">{JSON.stringify(errors, null, 2)}</pre>
            </div>
          )}
          
          {/* SECTION: METADATA - 3D Card */}
          <div className="group bg-slate-900/30 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-10 shadow-2xl transition-all duration-500 hover:[transform:rotateX(2deg)_rotateY(-1deg)] hover:border-cyan-500/30 hover:bg-slate-900/50">
            <div className="flex items-center gap-3 mb-10 text-cyan-400">
              <div className="p-3 bg-cyan-500/10 rounded-2xl"><FileText size={24} /></div>
              <h3 className="font-black uppercase tracking-[0.2em] text-l text-white">Grid Metadata</h3>
            </div>
            
            <div className="grid grid-cols-1 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Problem Title</label>
                <input {...register('title')} placeholder="e.g. Reverse Linked List II" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-xl font-bold focus:border-cyan-500 outline-none transition-all placeholder:text-slate-700 focus:bg-white/10" />
                {errors.title && <p className="text-rose-500 text-[10px] font-bold uppercase tracking-widest mt-2">{errors.title.message}</p>}
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Logic brief (Description)</label>
                <textarea {...register('description')} rows={6} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 font-mono text-sm leading-relaxed focus:border-cyan-500 outline-none transition-all resize-none" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3 group/select">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Difficulty_Rank</label>
                    <select {...register('difficulty')} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-xs font-black uppercase tracking-widest outline-none appearance-none cursor-pointer focus:border-cyan-500">
                        <option value="easy">Easy_Mode</option>
                        <option value="medium">Medium_Tier</option>
                        <option value="hard">Hard_Core</option>
                    </select>
                </div>
                <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Topics (Multiple)</label>
                      <textarea
                        {...register('tagsCsv')}
                        rows={3}
                        placeholder="array, two pointers, sliding window"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 font-mono text-sm leading-relaxed focus:border-cyan-500 outline-none transition-all resize-none placeholder:text-slate-700"
                      />
                      {errors.tagsCsv && <p className="text-rose-500 text-[10px] font-bold uppercase tracking-widest mt-2">{errors.tagsCsv.message}</p>}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Company Names (Multiple)</label>
                <textarea
                  {...register('companiesCsv')}
                  rows={3}
                  placeholder="Google, Amazon, Microsoft"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 font-mono text-sm leading-relaxed focus:border-cyan-500 outline-none transition-all resize-none placeholder:text-slate-700"
                />
                <p className="text-[10px] text-slate-500 uppercase tracking-widest ml-1">Use comma or new line to add multiple companies</p>
              </div>
            </div>
          </div>

          {/* SECTION: VALIDATION SUITE */}
          <div className="group bg-slate-900/30 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-10 shadow-2xl transition-all duration-500 hover:[transform:rotateX(2deg)_rotateY(1deg)] hover:border-purple-500/30">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div className="flex items-center gap-3 text-purple-400">
                    <div className="p-3 bg-purple-500/10 rounded-2xl"><Beaker size={24} /></div>
                    <h3 className="font-black uppercase tracking-[0.2em] text-xl text-white">Validation Protocol</h3>
                </div>
                <div className="flex gap-4">
                  <button type="button" onClick={() => appendVisible({ input: '', output: '', explanation: '' })} className="flex items-center gap-2 px-6 py-3 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-cyan-500 hover:text-black transition-all">
                      <Plus size={14} /> Add Public
                  </button>
                  <button type="button" onClick={() => appendHidden({ input: '', output: '' })} className="flex items-center gap-2 px-6 py-3 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all">
                      <EyeOff size={14} /> Add Hidden
                  </button>
                </div>
            </div>

            {/* Test Case Cards */}
            <div className="space-y-8">
                {visibleFields.map((field, index) => (
                    <div key={field.id} className="relative bg-black/40 border border-white/5 p-8 rounded-[1.5rem] transition-all group/case hover:bg-white/[0.02]">
                        <div className="absolute -top-3 -left-3 bg-cyan-500 text-black font-black px-4 py-1 rounded-lg text-[9px] uppercase">Public_{index + 1}</div>
                        <button type="button" onClick={() => removeVisible(index)} className="absolute top-4 right-4 text-slate-700 hover:text-rose-500 transition-colors">
                            <Trash2 size={16} />
                        </button>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                            <input {...register(`visibleTestCases.${index}.input`)} placeholder="Standard Input" className="bg-black/60 border border-white/5 rounded-xl p-4 text-sm focus:border-cyan-500 outline-none font-mono" />
                            <input {...register(`visibleTestCases.${index}.output`)} placeholder="Expected Output" className="bg-black/60 border border-white/5 rounded-xl p-4 text-sm focus:border-cyan-500 outline-none font-mono" />
                            <textarea {...register(`visibleTestCases.${index}.explanation`)} placeholder="Why is this the output? (Visible to user)" className="md:col-span-2 bg-black/60 border border-white/5 rounded-xl p-4 text-sm focus:border-cyan-500 outline-none h-24" />
                        </div>
                    </div>
                ))}

                {hiddenFields.map((field, index) => (
                    <div key={field.id} className="relative bg-black/40 border-l-4 border-l-rose-500/30 border-white/5 p-8 rounded-r-[1.5rem] transition-all group/case hover:bg-rose-500/[0.02]">
                        <div className="absolute -top-3 -left-3 bg-rose-500 text-white font-black px-4 py-1 rounded-lg text-[9px] uppercase tracking-widest shadow-[0_0_15px_rgba(244,63,94,0.4)]">Hidden_{index + 1}</div>
                        <button type="button" onClick={() => removeHidden(index)} className="absolute top-4 right-4 text-slate-700 hover:text-rose-500 transition-colors">
                            <Trash2 size={16} />
                        </button>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                            <input {...register(`hiddenTestCases.${index}.input`)} placeholder="Edge Case Input" className="bg-black/60 border border-white/5 rounded-xl p-4 text-sm focus:border-rose-500 outline-none font-mono text-rose-200" />
                            <input {...register(`hiddenTestCases.${index}.output`)} placeholder="Edge Case Output" className="bg-black/60 border border-white/5 rounded-xl p-4 text-sm focus:border-rose-500 outline-none font-mono text-rose-200" />
                        </div>
                    </div>
                ))}
            </div>
          </div>

          {/* SECTION: BOILERPLATES - 3D Card */}
          <div className="group bg-slate-900/30 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-10 shadow-2xl transition-all duration-500 hover:[transform:rotateX(-1deg)_rotateY(1deg)] hover:border-emerald-500/30">
            <div className="flex items-center gap-3 mb-12 text-emerald-400">
              <div className="p-3 bg-emerald-500/10 rounded-2xl"><Code2 size={24} /></div>
              <h3 className="font-black uppercase tracking-[0.2em] text-xl text-white">System Boilerplates</h3>
            </div>

            <div className="space-y-16">
                {['C++', 'Java', 'JavaScript'].map((lang, idx) => (
                    <div key={lang} className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-1.5 h-6 bg-emerald-500 rounded-full shadow-[0_0_10px_#10b981]"></div>
                            <span className="text-xs font-black text-slate-300 uppercase tracking-[0.3em]">{lang} Configuration</span>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Initial Environment</p>
                                <textarea
                                  {...register(`startCode.${idx}.initialCode`)}
                                  rows={16}
                                  spellCheck={false}
                                  wrap="soft"
                                  placeholder={`Paste ${lang} starter code here...`}
                                  className="w-full min-h-[18rem] bg-black/60 border border-white/5 rounded-2xl p-6 font-mono text-sm leading-7 tracking-wide text-cyan-300 focus:border-cyan-500 outline-none transition-all resize-y overflow-auto scrollbar-hide"
                                />
                                <p className="text-[10px] text-slate-500 font-medium uppercase tracking-widest px-1">
                                  Multi-line code is supported. New lines will be preserved.
                                </p>
                            </div>
                            <div className="space-y-3">
                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Reference Kernel (Solution)</p>
                                <textarea
                                  {...register(`referenceSolution.${idx}.completeCode`)}
                                  rows={16}
                                  spellCheck={false}
                                  wrap="soft"
                                  placeholder={`Paste ${lang} reference solution here...`}
                                  className="w-full min-h-[18rem] bg-black/60 border border-white/5 rounded-2xl p-6 font-mono text-sm leading-7 tracking-wide text-emerald-300 focus:border-emerald-500 outline-none transition-all resize-y overflow-auto scrollbar-hide"
                                />
                                <p className="text-[10px] text-slate-500 font-medium uppercase tracking-widest px-1">
                                  Keep the solution readable with one statement per line.
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
          </div>

          {/* Final Submit Button */}
          <div className="relative group/btn pt-10">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-3xl blur-xl opacity-20 group-hover/btn:opacity-60 transition duration-1000 pointer-events-none"></div>
            <button type="submit" className="relative z-10 w-full py-8 bg-black rounded-[2rem] border border-white/10 flex items-center justify-center gap-4 transition-all active:scale-[0.98] group-hover/btn:border-white/20">
              <ShieldCheck size={28} className="text-emerald-400" />
              <span className="text-xl font-black tracking-[0.4em] uppercase italic text-white">Initialize Deployment</span>
              <Sparkles size={20} className="text-purple-400 animate-pulse" />
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default AdminPanel;