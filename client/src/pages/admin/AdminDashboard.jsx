import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import Loader from '../../components/Loader';
import MetricCard from '../../components/MetricCard';
import { Users, Store, Utensils, History, DollarSign } from 'lucide-react';

export default function AdminDashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/summary').then((res) => {
      setSummary(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-extrabold text-ink">Dashboard Overview</h1>
        <p className="text-stone-500 mt-1">Platform statistics and insights.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <MetricCard label="Total Users" value={summary?.users ?? 0} icon={<Users className="text-blue-500" size={24} />} />
        <MetricCard label="Restaurants" value={summary?.restaurants ?? 0} icon={<Store className="text-leaf" size={24} />} />
        <MetricCard label="Food Items" value={summary?.foods ?? 0} icon={<Utensils className="text-tomato" size={24} />} />
        <MetricCard label="Total Orders" value={summary?.orders ?? 0} icon={<History className="text-amber-500" size={24} />} />
        <MetricCard label="Total Revenue" value={`₹${Number(summary?.revenue || 0).toFixed(0)}`} icon={<DollarSign className="text-purple-500" size={24} />} />
      </div>

      <div className="panel p-0 overflow-hidden">
        <div className="border-b border-stone-100 bg-stone-50 px-6 py-4">
          <h2 className="text-lg font-bold">Quick Actions</h2>
        </div>
        <div className="p-6 flex flex-wrap gap-4">
           <button className="btn-primary">Add New Restaurant</button>
           <button className="btn-secondary">Review Nutrition Reports</button>
        </div>
      </div>
    </div>
  );
}
