import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, MapPin, Phone, CreditCard, Activity, CheckCircle } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { updateCartCount } = useAuth();
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState(null);

  useEffect(() => {
    api.get('/cart').then((res) => {
      setCart(res.data);
    });
  }, []);

  async function placeOrder() {
    if (!address || !phone) return alert('Please enter delivery address and phone number');
    setLoading(true);
    try {
      await api.post('/orders', { deliveryAddress: address, phone, paymentMethod });
      updateCartCount();
      navigate('/orders');
    } catch {
      alert('Order placement failed.');
    } finally {
      setLoading(false);
    }
  }

  if (!cart) return <Loader />;

  const totalCalories = cart.items.reduce((acc, item) => acc + (item.calories * item.quantity), 0);

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-4xl items-start gap-8 px-4 py-12 flex-col md:flex-row">
      <section className="panel w-full p-8 space-y-8 flex-1">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-tomato/10 text-tomato">
            <MapPin size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-ink">Checkout Details</h1>
            <p className="text-stone-500 text-sm">Provide your delivery information</p>
          </div>
        </div>
        
        <div className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-stone-400">Complete Address</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-4 h-5 w-5 text-stone-400" />
              <textarea 
                className="field pl-12 min-h-[120px] resize-none" 
                placeholder="House No, Building, Street, Landmark, City..." 
                value={address} 
                onChange={(e) => setAddress(e.target.value)} 
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-stone-400">Contact Number</label>
            <div className="relative">
              <Phone className="absolute left-4 top-3.5 h-5 w-5 text-stone-400" />
              <input 
                type="text"
                className="field pl-12" 
                placeholder="+91 98765 43210" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
              />
            </div>
          </div>

          <div className="space-y-2 pt-4">
            <label className="text-xs font-black uppercase tracking-widest text-stone-400">Payment Method</label>
            <div className="grid grid-cols-3 gap-4">
              {['cod', 'upi', 'card'].map((method) => (
                <label key={method} className={`panel p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${paymentMethod === method ? 'border-tomato ring-2 ring-red-50 bg-red-50/20' : 'hover:border-stone-300'}`}>
                  <input type="radio" name="payment" value={method} checked={paymentMethod === method} onChange={() => setPaymentMethod(method)} className="sr-only" />
                  {method === 'cod' && <ShoppingCart size={24} className={paymentMethod === method ? 'text-tomato' : 'text-stone-400'}/>}
                  {method === 'upi' && <Activity size={24} className={paymentMethod === method ? 'text-tomato' : 'text-stone-400'}/>}
                  {method === 'card' && <CreditCard size={24} className={paymentMethod === method ? 'text-tomato' : 'text-stone-400'}/>}
                  <span className={`text-sm font-bold uppercase ${paymentMethod === method ? 'text-tomato' : 'text-stone-500'}`}>
                    {method === 'cod' ? 'Cash' : method === 'upi' ? 'UPI' : 'Card'}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="w-full md:w-80 space-y-6">
        <div className="panel p-6 bg-ink text-white">
          <h3 className="mb-4 text-lg font-bold">Order Summary</h3>
          <div className="space-y-3 border-b border-white/10 pb-4 text-sm text-stone-300">
            <div className="flex justify-between"><span>Items ({cart.items.length})</span><span>₹{cart.total}</span></div>
            <div className="flex justify-between"><span>Taxes</span><span>₹35</span></div>
          </div>
          <div className="mt-4 flex justify-between text-xl font-black">
            <span>Pay</span>
            <span className="text-tomato">₹{Number(cart.total) + 35}</span>
          </div>
          <button className="btn-primary w-full py-4 mt-6 text-base" onClick={placeOrder} disabled={loading}>
            {loading ? 'Processing...' : 'Confirm & Pay'}
          </button>
        </div>

        <div className="panel p-5 border-leaf/20 bg-green-50/50">
          <div className="flex items-center gap-3 mb-2 text-leaf font-bold">
            <CheckCircle size={18} /> Smart Choice
          </div>
          <p className="text-sm text-stone-600">This meal contains approximately <strong className="text-ink">{totalCalories} kcal</strong>. Track it in your profile.</p>
        </div>
      </section>
    </main>
  );
}
