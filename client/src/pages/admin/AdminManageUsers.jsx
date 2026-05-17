import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import Loader from '../../components/Loader';
import Badge from '../../components/Badge';
import { User } from 'lucide-react';

export default function AdminManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/users').then((res) => {
      setUsers(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-extrabold text-ink">User Management</h1>
        <p className="text-stone-500 mt-1">View registered customers and admins.</p>
      </div>

      <section className="panel p-0 overflow-hidden border-stone-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="border-b border-stone-100 bg-stone-50">
                <th className="px-6 py-4 font-black uppercase tracking-widest text-stone-400">User Details</th>
                <th className="px-6 py-4 font-black uppercase tracking-widest text-stone-400">Email Address</th>
                <th className="px-6 py-4 font-black uppercase tracking-widest text-stone-400">Role</th>
                <th className="px-6 py-4 font-black uppercase tracking-widest text-stone-400">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 bg-white">
              {users.map((user) => (
                <tr key={user.user_id} className="hover:bg-stone-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-100 text-stone-400">
                        <User size={18} />
                      </div>
                      <span className="font-bold text-ink">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-stone-600">{user.email}</td>
                  <td className="px-6 py-4">
                    <Badge variant={user.role === 'admin' ? 'danger' : 'info'}>
                      {user.role}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-stone-500">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
