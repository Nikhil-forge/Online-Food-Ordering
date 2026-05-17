import React from 'react';
import { Activity, Apple, AlertCircle } from 'lucide-react';
import MetricCard from '../../components/MetricCard';

export default function AdminReports() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-extrabold text-ink">Nutrition Analytics</h1>
        <p className="text-stone-500 mt-1">Global nutritional trends across all orders.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <MetricCard label="Avg Calories per Order" value="840" unit="kcal" icon={<Activity className="text-tomato" size={24} />} />
        <MetricCard label="Avg Protein per Order" value="42.5" unit="g" icon={<Apple className="text-leaf" size={24} />} />
        <MetricCard label="High Sugar Alerts" value="15" unit="%" icon={<AlertCircle className="text-amber-500" size={24} />} />
      </div>

      <div className="panel flex flex-col items-center justify-center py-20 text-center">
        <h2 className="text-xl font-bold text-stone-400">Detailed Analytics Coming Soon</h2>
        <p className="text-stone-500 mt-2">More advanced charts and AI analysis will be available in the next release.</p>
      </div>
    </div>
  );
}
