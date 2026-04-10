import React, { useEffect, useState } from 'react';
import { UserCog, Trash2, Search, Shield } from 'lucide-react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { setAllUsers, updateUserRole,} from '../authSlice'; 
import BASE_URL from '../config/baseUrl';

const UserManagement = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                // Calling your "getAllUsers" controller endpoint
                const response = await axios.get(`${BASE_URL}/user/admin/users`, { 
                    withCredentials: true 
                });
                
                // --- THIS IS WHERE YOU SET setAllUsers ---
                if (response.data.users) {
                    dispatch(setAllUsers(response.data.users));
                }
            } catch (err) {
                console.error("Failed to fetch users:", err);
            }
        };

        fetchUsers();
    }, [dispatch]);
    // Accessing all users globally from Redux state
    const allUsers = useSelector(state => state.auth.allUsers) || [];
    const [searchTerm, setSearchTerm] = useState('');
  console.log(allUsers)
    // Filter logic for the search bar
    const filteredUsers = allUsers.filter(user => 
        user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.emailId?.toLowerCase().includes(searchTerm.toLowerCase())
    );

 const handlePromote = async (user) => {
    const url = `${BASE_URL}/user/admin/promote/${user._id}`;
  console.log("Attempting POST to:", url);
  try {
    const response = await axios.post(
      `${BASE_URL}/user/admin/promote/${user._id}`,
      {},
      { withCredentials: true }
    );

    if (response.data.success) {
      dispatch(updateUserRole({
        _id: user._id,
        role: "admin"
      }));

      alert(`${user.firstName} promoted to admin 🚀`);
    }
  } catch (err) {
    console.error("Promotion failed", err);
    alert(err.response?.data?.message || "Promotion failed");
  }
};



    return (
        <div className="min-h-screen bg-black text-white p-6 lg:p-12 relative overflow-hidden">
            <div className="max-w-6xl mx-auto relative z-10">
                {/* Header & Search */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <h1 className="text-4xl font-black tracking-tighter flex items-center gap-3">
                        <UserCog className="text-cyan-400" /> User <span className="text-slate-500">Registry</span>
                    </h1>
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search users..." 
                            className="bg-slate-900/50 border border-white/10 rounded-full py-3 pl-12 pr-6 w-full md:w-80 focus:border-cyan-500 transition-all outline-none"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
                    <table className="w-full text-left">
                        <thead className="bg-white/[0.02] border-b border-white/5">
                            <tr>
                                <th className="p-6 text-xs font-black uppercase text-slate-500">User</th>
                                <th className="p-6 text-xs font-black uppercase text-slate-500">Role</th>
                                <th className="p-6 text-xs font-black uppercase text-slate-500 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredUsers.map((user) => (
                                <tr key={user._id} className="hover:bg-white/[0.01] transition-colors">
                                    <td className="p-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center font-bold text-cyan-400 uppercase">
                                                {user.firstName ? user.firstName[0] : '?'}
                                            </div>
                                            <div>
                                                <p className="font-bold">{user.firstName}</p>
                                                <p className="text-xs text-slate-500">{user.emailId}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${
                                            user.role === 'admin' ? 'border-purple-500/30 text-purple-400' : 'border-cyan-500/30 text-cyan-400'
                                        }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="p-6 text-right">
                                        {user.role !== 'admin' && (
                                            <button onClick={() => handlePromote(user)} className="px-4 py-2 bg-white/5 hover:bg-cyan-500 hover:text-black rounded-xl text-xs font-bold transition-all border border-white/5">
                                                Promote
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UserManagement;