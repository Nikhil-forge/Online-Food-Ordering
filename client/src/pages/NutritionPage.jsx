import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Apple, Activity, Beef, Info, AlertCircle, Filter } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { api } from '../services/api';
import Loader from '../components/Loader';
import Badge from '../components/Badge';
import MetricCard from '../components/MetricCard';

export default function NutritionPage() {
  const { foodId } = useParams();
  const [food, setFood] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get(`/nutrition/${foodId}`),
      api.get(`/recommendation/${foodId}`)
    ]).then(([resFood, resRec]) => {
      setFood(resFood.data);
      setRecommendation(resRec.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [foodId]);

  if (loading) return <Loader />;
  if (!food) return <div className="p-20 text-center text-xl text-stone-500">Food not found</div>;

  const data = [
    { name: 'Protein', value: food.protein, color: '#227a4d' },
    { name: 'Carbs', value: food.carbohydrates, color: '#e23d28' },
    { name: 'Fats', value: food.fats, color: '#f59e0b' },
    { name: 'Fiber', value: food.fiber, color: '#0ea5e9' },
    { name: 'Sugar', value: food.sugar, color: '#a855f7' }
  ];

  const totalMacros = food.protein + food.carbohydrates + food.fats;
  let score = 100;
  if (food.fats > 20) score -= 20;
  if (food.sugar > 10) score -= 15;
  if (food.calories > 600) score -= 15;
  if (food.protein > 15) score += 10;
  if (score > 100) score = 100;

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-10 flex items-center gap-4">
        <Link to="/restaurants" className="btn-ghost rounded-full p-2"><ChevronRight size={24} className="rotate-180" /></Link>
        <h1 className="text-4xl font-extrabold text-ink">AI Nutrition Dashboard</h1>
      </div>

      <div className="grid gap-10 lg:grid-cols-5">
        <section className="lg:col-span-2 space-y-8">
          <div className="panel p-0 overflow-hidden">
            <img className="h-72 w-full object-cover" src={food.image_url} alt={food.food_name} />
            <div className="p-8">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-ink">{food.food_name}</h2>
                <Badge variant={recommendation?.level === 'Balanced' || recommendation?.level === 'Protein Rich' ? 'success' : 'warning'}>
                  {recommendation?.level}
                </Badge>
              </div>
              <p className="mt-4 text-stone-600 leading-relaxed text-sm">
                <span className="font-bold text-ink block mb-1">AI Recommendation:</span> 
                {recommendation?.message}
              </p>
            </div>
          </div>

          <div className="panel space-y-4 bg-gradient-to-br from-stone-50 to-white">
            <h3 className="text-xl font-bold flex items-center gap-2 text-leaf"><Apple size={20} /> Health Score</h3>
            <div className="flex items-center justify-between">
              <div className="w-full bg-stone-200 rounded-full h-4 mr-4">
                <div className={`h-4 rounded-full ${score > 70 ? 'bg-leaf' : score > 40 ? 'bg-amber-500' : 'bg-tomato'}`} style={{ width: `${score}%` }}></div>
              </div>
              <span className="font-bold text-lg">{score}/100</span>
            </div>
            <p className="text-xs text-stone-500">Based on macronutrient balance, caloric density, and sugar content.</p>
          </div>
        </section>

        <section className="lg:col-span-3 space-y-8">
          <div className="panel p-8">
            <h2 className="mb-8 text-2xl font-bold text-ink">Macronutrient Distribution</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="h-64 flex justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                      {data.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}g`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-4">
                {data.map(item => (
                  <div key={item.name} className="flex justify-between items-center text-sm font-bold">
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></span>
                      {item.name}
                    </span>
                    <span className="text-stone-500">{item.value}g ({totalMacros > 0 ? Math.round((item.value / totalMacros) * 100) : 0}%)</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-10 h-64 border-t border-stone-100 pt-8">
               <h3 className="mb-4 font-bold text-stone-500 text-sm uppercase tracking-widest text-center">Relative Breakdown</h3>
               <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#a8a29e', fontSize: 12}} />
                  <YAxis hide />
                  <Tooltip cursor={{fill: '#f5f5f4'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {data.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3">
              <MetricCard label="Calories" value={food.calories} unit="kcal" icon={<Activity className="text-tomato" size={16} />} />
              <MetricCard label="Protein" value={food.protein} unit="g" icon={<Beef className="text-leaf" size={16} />} />
              <MetricCard label="Carbs" value={food.carbohydrates} unit="g" icon={<Info className="text-blue-500" size={16} />} />
              <MetricCard label="Fats" value={food.fats} unit="g" icon={<AlertCircle className="text-amber-500" size={16} />} />
              <MetricCard label="Fiber" value={food.fiber} unit="g" icon={<Filter className="text-green-600" size={16} />} />
              <MetricCard label="Sugar" value={food.sugar} unit="g" icon={<AlertCircle className="text-purple-500" size={16} />} />
            </div>
          </div>

          {recommendation?.alternative && (
            <div className="panel border-leaf/20 bg-green-50/50">
              <h3 className="mb-4 text-xl font-bold text-leaf">Healthier Alternative Found</h3>
              <div className="flex items-center gap-6 bg-white p-4 rounded-2xl shadow-sm">
                <img src={recommendation.alternative.image_url} className="h-20 w-20 rounded-xl object-cover shadow-sm" alt={recommendation.alternative.food_name} />
                <div className="flex-1">
                  <h4 className="font-bold text-lg text-ink">{recommendation.alternative.food_name}</h4>
                  <p className="text-sm text-stone-500 mt-1">Only {recommendation.alternative.calories} kcal · {recommendation.alternative.protein}g protein</p>
                  <Link to={`/nutrition/${recommendation.alternative.food_id}`} className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-leaf hover:underline bg-green-50 px-3 py-1 rounded-full">
                    View analysis <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
