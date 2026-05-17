import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, ShoppingCart, Info } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function FoodGrid({ foods }) {
  const { updateCartCount } = useAuth();

  async function addToCart(foodId) {
    try {
      await api.post('/cart/add', { foodId, quantity: 1 });
      alert('Added to cart successfully!');
      updateCartCount();
    } catch {
      alert('Failed to add item to cart. Please try again.');
    }
  }

  if (foods.length === 0) return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-4 rounded-full bg-stone-100 p-6 text-stone-300"><Info size={48} /></div>
      <h3 className="text-xl font-bold">No results found</h3>
      <p className="text-stone-500">Try searching for something else or browse different categories.</p>
    </div>
  );

  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
      {foods.map((food, idx) => (
        <article key={food.food_id} className={`panel card-hover flex flex-col p-0 overflow-hidden delay-${(idx % 3) + 1} animate-fade-in`}>
          <div className="relative h-48">
            <img className="h-full w-full object-cover transition-transform duration-500 hover:scale-105" src={food.image_url} alt={food.food_name} />
            <div className="absolute right-3 top-3 glass rounded-full px-3 py-1 text-xs font-black text-ink">
              ₹{Number(food.price).toFixed(0)}
            </div>
            {food.calories < 300 && <div className="absolute left-3 top-3 bg-leaf text-white text-[10px] font-black uppercase px-2 py-1 rounded-md tracking-widest">Low Calorie</div>}
            {food.protein > 20 && <div className="absolute left-3 top-10 bg-blue-500 text-white text-[10px] font-black uppercase px-2 py-1 rounded-md tracking-widest">High Protein</div>}
          </div>
          <div className="flex flex-1 flex-col p-5">
            <div className="mb-2 flex items-start justify-between">
              <h3 className="font-bold text-lg leading-tight">{food.food_name}</h3>
              <Link to={`/nutrition/${food.food_id}`} title="View Nutrition Details" className="shrink-0 text-tomato hover:scale-110 transition-transform">
                <Activity size={20} />
              </Link>
            </div>
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-stone-400">{food.category}</p>
            
            <div className="mt-auto grid grid-cols-2 gap-2 mb-5">
              <div className="rounded-xl bg-stone-50 p-2 text-center">
                <p className="text-[10px] font-bold text-stone-400 uppercase">Energy</p>
                <p className="text-sm font-black">{food.calories} kcal</p>
              </div>
              <div className="rounded-xl bg-stone-50 p-2 text-center">
                <p className="text-[10px] font-bold text-stone-400 uppercase">Protein</p>
                <p className="text-sm font-black">{food.protein}g</p>
              </div>
            </div>

            <button className="btn-primary w-full" onClick={() => addToCart(food.food_id)}>
              <ShoppingCart size={18} /> Add to Cart
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
