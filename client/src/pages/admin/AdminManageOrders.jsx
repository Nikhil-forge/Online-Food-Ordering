import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import Loader from '../../components/Loader';
import Badge from '../../components/Badge';

export default function AdminManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const res = await api.get('/orders');
      setOrders(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  async function setStatus(orderId, status) {
    await api.patch(`/orders/${orderId}/status`, { status });
    load();
  }

  if (loading) return <Loader />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-extrabold text-ink">Order Management</h1>
        <p className="text-stone-500 mt-1">Track and update customer orders.</p>
      </div>

      <section className="panel p-0 overflow-hidden border-stone-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="border-b border-stone-100 bg-stone-50">
                <th className="px-6 py-4 font-black uppercase tracking-widest text-stone-400">Order ID</th>
                <th className="px-6 py-4 font-black uppercase tracking-widest text-stone-400">Customer</th>
                <th className="px-6 py-4 font-black uppercase tracking-widest text-stone-400">Total</th>
                <th className="px-6 py-4 font-black uppercase tracking-widest text-stone-400">Status</th>
                <th className="px-6 py-4 font-black uppercase tracking-widest text-stone-400">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 bg-white">
              {orders.map((order) => (
                <tr key={order.order_id} className="hover:bg-stone-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-ink">#{order.order_id}</td>
                  <td className="px-6 py-4 font-medium text-stone-600">{order.customer_name || 'Guest'}</td>
                  <td className="px-6 py-4 font-black text-ink">₹{Number(order.total_amount).toFixed(0)}</td>
                  <td className="px-6 py-4">
                    <Badge variant={order.order_status === 'Delivered' ? 'success' : order.order_status === 'Preparing' ? 'info' : 'warning'}>
                      {order.order_status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <select 
                      className="field py-1.5 px-3 text-xs font-bold" 
                      value={order.order_status} 
                      onChange={(e) => setStatus(order.order_id, e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Preparing">Preparing</option>
                      <option value="Delivered">Delivered</option>
                    </select>
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
