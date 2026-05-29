import React, { useEffect, useState } from 'react';
import axiosClient from '../utils/axiosClient';

export default function MyProblems(){
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(()=>{
    (async ()=>{
      setLoading(true);
      try{
        const { data } = await axiosClient.get('/problem/myProblems');
        setProblems(data || []);
      }catch(err){
        console.error(err);
        alert('Failed to load your problems');
      }finally{setLoading(false)}
    })()
  },[])

  const getStatusClass = (status) => {
    if (status === 'approved') return 'bg-emerald-600';
    if (status === 'rejected') return 'bg-rose-600';
    return 'bg-amber-600';
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">My Problem Submissions</h2>
      {loading ? <p>Loading...</p> : (
        problems.length === 0 ? <p>No submissions yet.</p> : (
          <div className="space-y-3">
            {problems.map(p=> (
              <div key={p._id} className="p-4 bg-white/3 rounded-lg flex items-center justify-between">
                <div>
                  <div className="text-white font-bold">{p.title}</div>
                  <div className="text-slate-400 text-sm">{p.difficulty} • {p.tags?.join(', ')}</div>
                </div>
                <div>
                  <span className={`px-3 py-1 rounded capitalize ${getStatusClass(p.status)}`}>{p.status}</span>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  )
}
