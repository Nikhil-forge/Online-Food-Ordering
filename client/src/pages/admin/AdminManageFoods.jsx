import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit } from 'lucide-react';
import { api } from '../../services/api';
import Loader from '../../components/Loader';

export default function AdminManageFoods() {
  const [foods, setFoods] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ 
    restaurant_id: '', food_name: '', category: 'Main Course', price: '', image_url: '', 
    calories: 0, protein: 0, carbohydrates: 0, fats: 0, fiber: 0, sugar: 0 
  });

  const loadData = async () => {
    try {
      const [resF, resR] = await Promise.all([api.get('/foods'), api.get('/restaurants')]);
      setFoods(resF.data);
      setRestaurants(resR.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  async function save(e) {
    e.preventDefault();
    try {
      await api.post('/foods', form);
      setShowModal(false);
      setForm({ 
        restaurant_id: '', food_name: '', category: 'Main Course', price: '', image_url: '', 
        calories: 0, protein: 0, carbohydrates: 0, fats: 0, fiber: 0, sugar: 0 
      });
      loadData();
    } catch (err) {
      alert('Failed to add food');
    }
  }

  async function remove(id) {
    if (confirm('Delete this food item?')) {
      await api.delete(`/foods/${id}`);
      loadData();
    }
  }

  if (loading) return <Loader />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-ink">Food Items</h1>
          <p className="text-stone-500 mt-1">Manage global food catalog and nutrition.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary"><Plus size={20} /> Add Food Item</button>
      </div>

      <div className="panel p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-stone-50 border-b border-stone-100">
              <tr>
                <th className="px-6 py-4 font-black uppercase text-stone-400">Food Name</th>
                <th className="px-6 py-4 font-black uppercase text-stone-400">Restaurant</th>
                <th className="px-6 py-4 font-black uppercase text-stone-400">Price</th>
                <th className="px-6 py-4 font-black uppercase text-stone-400">Macros</th>
                <th className="px-6 py-4 font-black uppercase text-stone-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {foods.map(food => (
                <tr key={food.food_id} className="hover:bg-stone-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold">
                    <div className="flex items-center gap-3">
                      <img src={food.image_url} alt="" className="w-10 h-10 rounded-lg object-cover" />
                      <div>
                        {food.food_name}
                        <p className="text-xs font-normal text-stone-400 mt-0.5">{food.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-stone-500 font-medium">{food.restaurant_name}</td>
                  <td className="px-6 py-4 font-black text-ink">₹{food.price}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2 text-[10px] font-bold uppercase">
                      <span className="bg-stone-100 text-stone-600 px-2 py-1 rounded">{food.calories} kcal</span>
                      <span className="bg-leaf/10 text-leaf px-2 py-1 rounded">{food.protein}g P</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button onClick={() => remove(food.food_id)} className="p-2 text-stone-400 hover:text-tomato hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/60 backdrop-blur-sm p-4">
          <div className="panel w-full max-w-2xl max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl">
            <h2 className="text-2xl font-bold">New Food Item</h2>
            <form onSubmit={save} className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-1">
                <label className="text-xs font-bold uppercase tracking-widest text-stone-400">Restaurant</label>
                <select className="field" required value={form.restaurant_id} onChange={e => setForm({...form, restaurant_id: e.target.value})}>
                  <option value="">Select Restaurant</option>
                  {restaurants.map(r => <option key={r.restaurant_id} value={r.restaurant_id}>{r.restaurant_name}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-widest text-stone-400">Name</label>
                <input className="field" required placeholder="e.g. Quinoa Salad" value={form.food_name} onChange={e => setForm({...form, food_name: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-widest text-stone-400">Category</label>
                <select className="field" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                  <option>Main Course</option><option>Appetizer</option><option>Dessert</option><option>Beverages</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-widest text-stone-400">Price (₹)</label>
                <input className="field" type="number" required value={form.price} onChange={e => setForm({...form, price: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-widest text-stone-400">Image URL</label>
                <input className="field" placeholder="https://..." value={form.image_url} onChange={e => setForm({...form, image_url: e.target.value})} />
              </div>
              <div className="col-span-2 grid grid-cols-3 gap-3 pt-4 border-t border-stone-100 mt-2">
                {['calories', 'protein', 'carbohydrates', 'fats', 'fiber', 'sugar'].map(nutri => (
                  <div key={nutri} className="space-y-1 bg-stone-50 p-2 rounded-xl border border-stone-100">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-stone-500 capitalize">{nutri}</label>
                    <input className="w-full bg-transparent outline-none font-bold text-ink" type="number" value={form[nutri]} onChange={e => setForm({...form, [nutri]: Number(e.target.value)})} />
                  </div>
                ))}
              </div>
              <div className="col-span-2 flex justify-end gap-3 pt-6 border-t border-stone-100 mt-2">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Add Item</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
