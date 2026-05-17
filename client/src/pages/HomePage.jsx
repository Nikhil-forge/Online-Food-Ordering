import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Activity, ArrowRight, ChevronRight } from 'lucide-react';
import { api } from '../services/api';
import Badge from '../components/Badge';
import Loader from '../components/Loader';
import FoodGrid from '../components/FoodGrid';

export default function HomePage() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/foods').then((res) => {
      setFoods(res.data.slice(0, 4));
      setLoading(false);
    }).catch(() => {
      setFoods([]);
      setLoading(false);
    });
  }, []);

  return (
    <div>
      <section className="relative overflow-hidden bg-[#fffcf5] py-16 md:py-24">
        <div className="absolute right-0 top-0 h-64 w-64 -translate-y-1/2 translate-x-1/2 rounded-full bg-tomato/5 blur-3xl"></div>
        <div className="absolute left-0 bottom-0 h-96 w-96 translate-y-1/2 -translate-x-1/2 rounded-full bg-leaf/5 blur-3xl"></div>
        
        <div className="mx-auto grid max-w-7xl gap-12 px-4 md:grid-cols-2 md:items-center">
          <div className="relative z-10 space-y-6">
            
            <h1 className="text-5xl font-extrabold leading-tight text-ink md:text-7xl">
              Smart Food Ordering with <br />
              <span className="text-tomato">AI Nutrition Analysis</span>
            </h1>
            <p className="max-w-lg text-lg text-stone-600 leading-relaxed">
              Order delicious food while tracking calories, protein, carbs, and fats instantly. Make health-conscious decisions without compromising on taste.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link to="/restaurants" className="btn-primary px-8 py-4 text-base">Order Now <ArrowRight size={20} /></Link>
              <Link to="/nutrition/1" className="btn-secondary px-8 py-4 text-base">Explore Healthy Foods</Link>
            </div>
            
            <div className="flex items-center gap-8 pt-8">
              <div><p className="text-3xl font-bold">100%</p><p className="text-xs text-stone-500 uppercase font-bold tracking-widest">Nutrition Aware</p></div>
              <div className="h-10 w-px bg-stone-200"></div>
              <div><p className="text-3xl font-bold">50+</p><p className="text-xs text-stone-500 uppercase font-bold tracking-widest">Curated Menus</p></div>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-tomato/20 to-leaf/20 blur-2xl"></div>
            <img className="relative h-[400px] w-full rounded-[40px] object-cover shadow-2xl transition-transform hover:scale-[1.02] duration-700" src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80" alt="Healthy Food" />
            <div className="absolute -bottom-6 -left-6 glass rounded-2xl p-4 shadow-xl animate-bounce duration-[3000ms]">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-leaf p-2 text-white"><Activity size={20} /></div>
                <div>
                  <p className="text-xs font-bold text-stone-500">Live AI Scan</p>
                  <p className="font-bold text-ink">Healthy Choice: Detected</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-extrabold text-ink">Popular Nutrition-Dense Picks</h2>
            <p className="text-stone-500">Top rated items with optimal protein and fiber.</p>
          </div>
          <Link className="group flex items-center gap-2 font-bold text-tomato" to="/restaurants">
            View all <ChevronRight size={20} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        
        {loading ? <Loader /> : <FoodGrid foods={foods} />}
      </section>
    </div>
  );
}
