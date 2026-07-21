'use client';

import { useEffect, useState } from 'react';
import { Users as UsersIcon, Search, Trash2, Shield } from 'lucide-react';
import { adminApi } from '@/lib/api';

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetch = async () => {
    setLoading(true);
    try {
      const params: any = { limit: 50 };
      if (search) params.search = search;
      const res = await adminApi.getUsers(params);
      if (res.data.success) setUsers(res.data.data);
    } catch { /* ignore */ }
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const handleRoleChange = async (id: string, role: string) => {
    try {
      await adminApi.updateUserRole(id, role);
      fetch();
    } catch { /* ignore */ }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this user?')) return;
    try {
      await adminApi.deleteUser(id);
      fetch();
    } catch { /* ignore */ }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><UsersIcon className="w-6 h-6" /> Manage Users</h1>
          <p className="text-slate-500 text-sm mt-1">View, update roles, and manage users</p>
        </div>
      </div>

      <div className="relative max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input type="text" placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-10" onKeyDown={(e) => e.key === 'Enter' && fetch()} />
      </div>

      <div className="card overflow-hidden">
        {loading ? <div className="p-8 text-center text-slate-500">Loading...</div> : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                <th className="text-left py-3 px-4 font-medium text-slate-500">User</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500">Email</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500">Role</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500">Credits</th>
                <th className="text-right py-3 px-4 font-medium text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u: any) => (
                <tr key={u._id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center text-xs font-medium text-primary-600">{u.name?.charAt(0)}</div>
                      <span className="font-medium">{u.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-500">{u.email}</td>
                  <td className="py-3 px-4">
                    <select value={u.role} onChange={(e) => handleRoleChange(u._id, e.target.value)} className="text-xs bg-slate-100 dark:bg-slate-800 rounded-lg px-2 py-1 border-0 cursor-pointer capitalize">
                      <option value="supporter">Supporter</option>
                      <option value="creator">Creator</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="py-3 px-4">{u.credits}</td>
                  <td className="py-3 px-4 text-right">
                    <button onClick={() => handleDelete(u._id)} className="btn-ghost p-1.5 text-red-500 hover:text-red-600" title="Remove user">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
