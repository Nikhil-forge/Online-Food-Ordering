import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Activity, Trash2, ArrowRight, CheckCircle, Plus, Minus } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';

export default function CartPage() {
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const { updateCartCount } = useAuth();
  const navigate = useNavigate();

  const loadCart = () => {
    api.get('/cart').then((res) => {
      setCart(res.data);
      updateCartCount();
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { loadCart(); }, []);

  async function updateQuantity(cartId, quantity) {
    if (quantity < 1) return;
    await api.patch(`/cart/${cartId}`, { quantity });
    loadCart();
  }

  async function remove(cartId) {
    await api.delete(`/cart/remove/${cartId}`);
    loadCart();
  }

  if (loading) return <Loader />;

  const totalCalories = cart.items.reduce((acc, item) => acc + (item.calories * item.quantity), 0);
  const totalProtein = cart.items.reduce((acc, item) => acc + (item.protein * item.quantity), 0);
  const totalCarbs = cart.items.reduce((acc, item) => acc + (item.carbohydrates * item.quantity), 0);
  const totalFats = cart.items.reduce((acc, item) => acc + (item.fats * item.quantity), 0);

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="mb-10 text-4xl font-extrabold text-ink">My Cart</h1>
      
      {cart.items.length === 0 ? (
        <div className="panel flex flex-col items-center justify-center py-24 text-center">
          <div className="mb-6 rounded-full bg-stone-50 p-6 text-stone-300"><ShoppingCart size={64} /></div>
          <h2 className="text-2xl font-bold text-ink">Your cart is empty</h2>
          <p className="mb-8 text-stone-500 mt-2">Looks like you haven't added any healthy meals yet.</p>
          <Link to="/restaurants" className="btn-primary px-8">Explore Menu</Link>
        </div>
      ) : (
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <div key={item.cart_id} className="panel flex flex-col gap-6 p-4 sm:flex-row sm:items-center">
                <img className="h-24 w-24 rounded-2xl object-cover shadow-sm" src={item.image_url} alt={item.food_name} />
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-ink">{item.food_name}</h2>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs font-bold text-stone-500">
                    <span className="flex items-center gap-1 text-tomato bg-red-50 px-2 py-1 rounded"><Activity size={14} /> {item.calories * item.quantity} kcal</span>
                    <span className="bg-green-50 text-leaf px-2 py-1 rounded">{item.protein * item.quantity}g P</span>
                    <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded">{item.carbohydrates * item.quantity}g C</span>
                    <span className="bg-amber-50 text-amber-600 px-2 py-1 rounded">{item.fats * item.quantity}g F</span>
                  </div>
                  <p className="mt-2 text-sm text-stone-400">₹{item.price} per item</p>
                </div>
                <div className="flex flex-col items-end gap-4">
                  <p className="text-xl font-black text-ink">₹{Number(item.subtotal).toFixed(0)}</p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center rounded-xl bg-stone-100 p-1">
                      <button onClick={() => updateQuantity(item.cart_id, item.quantity - 1)} className="flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-sm text-stone-600 hover:text-tomato"><Minus size={14}/></button>
                      <span className="w-10 text-center font-bold">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.cart_id, item.quantity + 1)} className="flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-sm text-stone-600 hover:text-leaf"><Plus size={14}/></button>
                    </div>
                    <button className="rounded-xl p-2 text-stone-400 hover:bg-red-50 hover:text-tomato transition-colors" onClick={() => remove(item.cart_id)}>
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-6">
            <div className="panel bg-ink text-white p-8 border-none">
              <h3 className="mb-6 text-xl font-bold">Order Summary</h3>
              <div className="space-y-4 border-b border-white/10 pb-6 text-sm">
                <div className="flex justify-between text-stone-300"><span>Item Total</span><span className="font-bold text-white">₹{cart.total}</span></div>
                <div className="flex justify-between text-stone-300"><span>Delivery Fee</span><span className="font-bold text-leaf">FREE</span></div>
                <div className="flex justify-between text-stone-300"><span>Taxes & Charges</span><span className="font-bold text-white">₹35</span></div>
              </div>
              <div className="mt-6 flex justify-between text-2xl font-black">
                <span>To Pay</span>
                <span className="text-tomato">₹{Number(cart.total) + 35}</span>
              </div>
              <button onClick={() => navigate('/checkout')} className="btn-primary mt-8 w-full py-4 text-base bg-white text-ink hover:bg-stone-100">
                Proceed to Checkout <ArrowRight size={20} />
              </button>
            </div>
            
            <div className="panel p-6 border-leaf/20 bg-green-50/50">
               <h4 className="font-bold text-leaf flex items-center gap-2 mb-4"><Activity size={18} /> Nutrition Summary</h4>
               <div className="grid grid-cols-2 gap-4 text-sm font-bold">
                 <div><p className="text-xs text-stone-500 uppercase">Calories</p><p className="text-tomato">{totalCalories} kcal</p></div>
                 <div><p className="text-xs text-stone-500 uppercase">Protein</p><p className="text-leaf">{totalProtein.toFixed(1)}g</p></div>
                 <div><p className="text-xs text-stone-500 uppercase">Carbs</p><p className="text-blue-600">{totalCarbs.toFixed(1)}g</p></div>
                 <div><p className="text-xs text-stone-500 uppercase">Fats</p><p className="text-amber-600">{totalFats.toFixed(1)}g</p></div>
               </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
