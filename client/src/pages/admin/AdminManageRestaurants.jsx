import React, { useState, useEffect } from 'react';
import { Store, Plus } from 'lucide-react';
import { api } from '../../services/api';
import Badge from '../../components/Badge';
import Loader from '../../components/Loader';

export default function AdminManageRestaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ restaurant_name: '', address: '', contact: '', cuisine: 'Multi Cuisine' });

  const load = async () => {
    try {
      const res = await api.get('/restaurants');
      setRestaurants(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  async function save(e) {
    e.preventDefault();
    try {
      await api.post('/restaurants', form);
      setShowModal(false);
      setForm({ restaurant_name: '', address: '', contact: '', cuisine: 'Multi Cuisine' });
      load();
    } catch (err) {
      alert('Failed to save restaurant');
    }
  }

  async function remove(id) {
    if (confirm('Delete this restaurant?')) {
      await api.delete(`/restaurants/${id}`);
      load();
    }
  }

  if (loading) return <Loader />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-ink">Restaurants</h1>
          <p className="text-stone-500 mt-1">Manage partner restaurants.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary"><Plus size={20} /> Add Restaurant</button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {restaurants.map(r => (
          <div key={r.restaurant_id} className="panel flex gap-4 card-hover">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-stone-100 text-stone-400 shrink-0">
              <Store size={28} />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg text-ink leading-tight">{r.restaurant_name}</h3>
                  <p className="text-sm font-bold text-stone-400 uppercase tracking-widest mt-1">{r.cuisine}</p>
                </div>
                <Badge variant="success">{r.rating} ★</Badge>
              </div>
              <p className="mt-3 text-sm text-stone-500">{r.address}</p>
              <p className="text-sm text-stone-500">{r.contact}</p>
              <div className="mt-4 pt-4 border-t border-stone-100 flex justify-end">
                 <button onClick={() => remove(r.restaurant_id)} className="text-xs font-bold text-tomato hover:underline">Delete Restaurant</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/60 backdrop-blur-sm p-4">
          <div className="panel w-full max-w-md space-y-6 shadow-2xl">
            <h2 className="text-2xl font-bold">Register Restaurant</h2>
            <form onSubmit={save} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-stone-400">Restaurant Name</label>
                <input className="field mt-1" required value={form.restaurant_name} onChange={e => setForm({...form, restaurant_name: e.target.value})} />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-stone-400">Address</label>
                <input className="field mt-1" required value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-stone-400">Contact Number</label>
                <input className="field mt-1" required value={form.contact} onChange={e => setForm({...form, contact: e.target.value})} />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-stone-400">Cuisine</label>
                <input className="field mt-1" value={form.cuisine} onChange={e => setForm({...form, cuisine: e.target.value})} />
              </div>
              <div className="flex justify-end gap-3 pt-6 border-t border-stone-100">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
