import React from 'react';
import { User, MapPin, Heart, Activity } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <div className="mb-10 flex flex-col md:flex-row items-center gap-6 p-8 panel bg-gradient-to-br from-stone-50 to-white">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-tomato text-white text-4xl font-extrabold shadow-lg shadow-tomato/30">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-extrabold text-ink">{user.name}</h1>
          <p className="text-stone-500 mt-1">{user.email}</p>
          <div className="mt-4 inline-flex items-center gap-2 bg-leaf/10 text-leaf px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
            Health-Conscious User
          </div>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <section className="panel md:col-span-2 space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2"><User size={20} className="text-stone-400" /> Personal Information</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-stone-400">Full Name</label>
              <p className="font-medium text-ink mt-1">{user.name}</p>
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-stone-400">Email Address</label>
              <p className="font-medium text-ink mt-1">{user.email}</p>
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-stone-400">Account Type</label>
              <p className="font-medium text-ink mt-1 capitalize">{user.role}</p>
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-stone-400">Member Since</label>
              <p className="font-medium text-ink mt-1">{new Date(user.created_at || Date.now()).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="pt-4 border-t border-stone-100">
            <button className="btn-secondary">Edit Profile</button>
          </div>
        </section>

        <section className="space-y-8">
          <div className="panel space-y-4 bg-ink text-white border-none">
            <h2 className="text-xl font-bold flex items-center gap-2 text-white"><Activity size={20} className="text-tomato" /> Nutrition Goals</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-stone-400">Daily Calorie Target</span>
                <span className="font-bold">2000 kcal</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-stone-400">Protein Target</span>
                <span className="font-bold">120g</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2 mt-2">
                <div className="bg-leaf h-2 rounded-full" style={{ width: '60%' }}></div>
              </div>
              <p className="text-xs text-stone-400 mt-2">You are meeting 60% of your protein goals based on recent orders.</p>
            </div>
          </div>

          <div className="panel space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2"><MapPin size={20} className="text-stone-400" /> Saved Addresses</h2>
            <div className="p-4 rounded-xl border border-stone-200 bg-stone-50">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold uppercase tracking-widest bg-stone-200 px-2 py-1 rounded">Home</span>
                <button className="text-xs text-tomato font-bold hover:underline">Edit</button>
              </div>
              <p className="text-sm text-stone-600">123 Health Avenue, Fitness City, 400001</p>
            </div>
            <button className="text-sm font-bold text-tomato hover:underline w-full text-center">+ Add New Address</button>
          </div>
        </section>
      </div>
    </main>
  );
}
