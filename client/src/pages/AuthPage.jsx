import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, User, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function AuthPage({ mode }) {
  const navigate = useNavigate();
  const { login } = useAuth();
  const isLogin = mode === 'login';
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const calculatePasswordStrength = (pwd) => {
    if (pwd.length === 0) return 0;
    let strength = 0;
    if (pwd.length >= 6) strength += 1;
    if (pwd.length >= 8) strength += 1;
    if (/[A-Z]/.test(pwd)) strength += 1;
    if (/[0-9]/.test(pwd)) strength += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) strength += 1;
    return strength;
  };

  const pwdStrength = calculatePasswordStrength(form.password);

  async function submit(event) {
    event.preventDefault();
    setError('');

    if (!form.email.includes('@')) {
      setError('Invalid email format.');
      return;
    }
    
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (!isLogin && form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        const { data } = await api.post('/auth/login', { email: form.email, password: form.password });
        login(data.token, data.user);
        navigate('/');
      } else {
        await api.post('/auth/register', { name: form.name, email: form.email, password: form.password });
        alert('Registration successful! Please login.');
        navigate('/login');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-[calc(100vh-70px)] w-full flex items-center justify-center p-4">
      <div className="absolute inset-0 z-0">
        <img src="https://images.unsplash.com/photo-1490818387583-1b5ba22977d4?auto=format&fit=crop&w=1920&q=80" alt="Healthy Food Background" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-ink/70 backdrop-blur-[2px]"></div>
      </div>
      
      <main className="relative z-10 w-full max-w-md animate-fade-in">
        <form onSubmit={submit} className="glass p-8 sm:p-10 rounded-[32px] space-y-6 shadow-2xl bg-white/10 text-white border border-white/20">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold tracking-tight">{isLogin ? 'Welcome Back' : 'Join NutriOrder'}</h1>
            <p className="text-stone-300 mt-2 text-sm">{isLogin ? 'Sign in to track your healthy lifestyle' : 'Start your health-conscious journey today'}</p>
          </div>
          
          <div className="space-y-4">
            {!isLogin && (
              <div className="relative">
                <User className="absolute left-4 top-3.5 h-5 w-5 text-white/50" />
                <input className="w-full bg-white/10 border border-white/20 rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-tomato transition-all" placeholder="Full Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
            )}
            <div className="relative">
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-white/50" />
              <input className="w-full bg-white/10 border border-white/20 rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-tomato transition-all" placeholder="Email Address" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="relative">
              <AlertCircle className="absolute left-4 top-3.5 h-5 w-5 text-white/50" />
              <input className="w-full bg-white/10 border border-white/20 rounded-xl pl-12 pr-12 py-3 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-tomato transition-all" placeholder="Password" type={showPassword ? 'text' : 'password'} required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-3.5 text-white/50 hover:text-white transition-colors">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            
            {!isLogin && form.password && (
              <div className="flex gap-1 mt-2">
                {[1, 2, 3, 4].map(level => (
                  <div key={level} className={`h-1 w-full rounded-full transition-colors ${level <= pwdStrength ? (pwdStrength > 2 ? 'bg-leaf' : 'bg-tomato') : 'bg-white/20'}`}></div>
                ))}
              </div>
            )}

            {!isLogin && (
               <div className="relative">
               <AlertCircle className="absolute left-4 top-3.5 h-5 w-5 text-white/50" />
               <input className="w-full bg-white/10 border border-white/20 rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-tomato transition-all" placeholder="Confirm Password" type={showPassword ? 'text' : 'password'} required value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} />
             </div>
            )}
          </div>

          {isLogin && (
            <div className="flex items-center gap-2 text-sm text-stone-300">
              <input type="checkbox" id="remember" className="rounded bg-white/10 border-white/20 text-tomato focus:ring-tomato" />
              <label htmlFor="remember" className="cursor-pointer">Remember me</label>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 rounded-xl bg-red-500/20 border border-red-500/50 p-3 text-sm text-white">
              <AlertCircle size={16} className="shrink-0" /> {error}
            </div>
          )}

          <button className="w-full rounded-xl bg-tomato hover:bg-tomato/90 text-white font-bold py-4 text-base transition-all shadow-lg shadow-tomato/30" disabled={loading}>
            {loading ? 'Authenticating...' : isLogin ? 'Sign In Securely' : 'Create Account'}
          </button>

          {isLogin && (
            <div className="pt-4 border-t border-white/20">
              <p className="text-center text-xs font-bold uppercase tracking-widest text-stone-400 mb-3">Or use demo accounts</p>
              <div className="flex gap-2">
                <button type="button" onClick={() => { setForm({...form, email: 'user@demo.com', password: 'password123'}) }} className="w-full rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 py-2 text-sm font-bold border border-white/10 transition-colors">
                  Demo User
                </button>
                <button type="button" onClick={() => { setForm({...form, email: 'admin@demo.com', password: 'adminpassword'}) }} className="w-full rounded-xl bg-tomato/20 hover:bg-tomato/30 text-tomato py-2 text-sm font-bold border border-tomato/30 transition-colors">
                  Demo Admin
                </button>
              </div>
            </div>
          )}

          <p className="text-center text-sm text-stone-300">
            {isLogin ? "Don't have an account?" : 'Already have an account?'} 
            <Link className="ml-1 font-extrabold text-tomato hover:text-white transition-colors" to={isLogin ? '/register' : '/login'}>
              {isLogin ? 'Register now' : 'Sign in instead'}
            </Link>
          </p>
        </form>
      </main>
    </div>
  );
}
