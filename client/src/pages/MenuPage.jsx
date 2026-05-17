import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Search, Store } from 'lucide-react';
import { api } from '../services/api';
import Loader from '../components/Loader';
import FoodGrid from '../components/FoodGrid';

export default function MenuPage() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/restaurants/${id}`).then((res) => {
      setRestaurant(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  const foods = useMemo(() => {
    return (restaurant?.menu || []).filter((item) => 
      item.food_name.toLowerCase().includes(search.toLowerCase()) || 
      item.category.toLowerCase().includes(search.toLowerCase())
    );
  }, [restaurant, search]);

  if (loading) return <Loader />;

  return (
    <main className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-stone-100 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-stone-600">
            <Store size={14} /> Restaurant Menu
          </div>
          <h1 className="text-5xl font-extrabold">{restaurant?.restaurant_name || 'Menu'}</h1>
          <p className="mt-2 text-lg text-stone-500">{restaurant?.address}</p>
        </div>
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-4 top-3.5 h-5 w-5 text-stone-400" />
          <input 
            className="field pl-12 py-4" 
            placeholder="Search favorites or categories..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
          />
        </div>
      </div>

      <div className="mb-8 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {['All', 'Main Course', 'Appetizer', 'Dessert', 'Beverages'].map(cat => (
          <button key={cat} onClick={() => setSearch(cat === 'All' ? '' : cat)} className={`btn-ghost rounded-full whitespace-nowrap ${search === cat ? 'bg-tomato text-white hover:bg-tomato hover:text-white' : ''}`}>
            {cat}
          </button>
        ))}
      </div>

      <FoodGrid foods={foods} />
    </main>
  );
}
