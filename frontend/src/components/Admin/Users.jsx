
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { User, Mail, Shield, Calendar, Search, RefreshCw } from 'lucide-react';
import { getAuthHeaders } from '../../utils/authHeader';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const Backend_url = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${Backend_url}/api/v1/auth/users`, getAuthHeaders());
      if (data.success) {
        setUsers(data.users);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">User Management</h2>
          <p className="text-[var(--text-secondary)] text-sm mt-1">Total Registered Users: {users.length}</p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Search users..."
            className="input w-full pl-9 pr-4 py-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="loader mx-auto"></div>
        </div>
      ) : (
        <div className="card shadow-sm border-[var(--border)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[var(--bg-tertiary)] border-b border-[var(--border)] text-[var(--text-secondary)] text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-semibold">User</th>
                  <th className="px-6 py-4 font-semibold">Role</th>
                  <th className="px-6 py-4 font-semibold">Details</th>
                  <th className="px-6 py-4 font-semibold">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-[var(--bg-tertiary)] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[var(--accent)] flex items-center justify-center text-black font-bold shadow-sm">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-[var(--text-primary)]">{user.name}</p>
                            <p className="text-xs text-[var(--text-muted)]">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border
                          ${user.role === 'admin' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                            user.role === 'student' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                              'bg-[var(--bg-tertiary)] text-[var(--text-muted)] border-[var(--border)]'}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {user.role === 'student' && (
                          <div className="flex flex-col text-xs">
                            <span className="font-medium">{user.college || 'N/A'}</span>
                            <span className="text-[var(--text-muted)]">{user.department} • Year {user.year}</span>
                          </div>
                        )}
                        {user.role !== 'student' && <span className="text-[var(--text-muted)]">-</span>}
                      </td>
                      <td className="px-6 py-4 text-xs text-[var(--text-secondary)]">
                        {new Date(user.createdAt || Date.now()).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-[var(--text-muted)]">
                      <User className="w-12 h-12 mx-auto mb-2 opacity-30" />
                      <p>No users found matching your search.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
