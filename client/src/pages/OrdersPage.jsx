import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { History, Activity, Clock, CheckCircle, Package } from 'lucide-react';
import { api } from '../services/api';
import Loader from '../components/Loader';
import Badge from '../components/Badge';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { 
    api.get('/orders').then((res) => {
      setOrders(res.data);
      setLoading(false);
    }).catch(() => setLoading(false)); 
  }, []);

  if (loading) return <Loader />;

  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <div className="mb-10 flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-ink text-white">
          <History size={24} />
        </div>
        <div>
          <h1 className="text-4xl font-extrabold text-ink">Order History</h1>
          <p className="text-stone-500">Track your past meals and nutrition.</p>
        </div>
      </div>
      
      {orders.length === 0 ? (
        <div className="panel flex flex-col items-center justify-center py-24 text-center">
          <div className="mb-6 rounded-full bg-stone-50 p-6 text-stone-300"><Package size={64} /></div>
          <h2 className="text-2xl font-bold text-ink">No orders found</h2>
          <p className="mb-8 text-stone-500 mt-2">You haven't placed any orders yet. Start exploring healthy options!</p>
          <Link to="/restaurants" className="btn-primary px-8">Browse Restaurants</Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.order_id} className="panel p-6">
              <div className="flex flex-wrap items-center justify-between border-b border-stone-100 pb-4 mb-4 gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-stone-50 flex items-center justify-center font-bold text-stone-400">#{order.order_id}</div>
                  <div>
                    <p className="font-bold text-lg text-ink">Order #{order.order_id}</p>
                    <p className="text-xs text-stone-500 flex items-center gap-1"><Clock size={12}/> {new Date(order.created_at).toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-xs text-stone-400 font-bold uppercase tracking-widest">Total</p>
                    <p className="font-black text-xl text-ink">₹{Number(order.total_amount).toFixed(0)}</p>
                  </div>
                  <Badge variant={order.order_status === 'Delivered' ? 'success' : order.order_status === 'Preparing' ? 'info' : 'warning'}>
                    <span className="flex items-center gap-1">
                      {order.order_status === 'Delivered' && <CheckCircle size={14}/>}
                      {order.order_status}
                    </span>
                  </Badge>
                </div>
              </div>
              
              <div className="bg-stone-50/50 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <Activity size={16} className="text-tomato" />
                  <span className="font-bold text-stone-600">Nutritional Impact:</span>
                  <span className="font-black text-tomato">{Number(order.total_calories).toFixed(0)} kcal</span>
                  <span className="text-stone-400 mx-2">|</span>
                  <span className="font-bold text-leaf">{Number(order.total_protein).toFixed(1)}g Protein</span>
                </div>
                <button className="text-sm font-bold text-tomato hover:underline">View Details</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
