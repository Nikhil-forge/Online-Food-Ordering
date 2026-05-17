import React from 'react';

export default function MetricCard({ label, value, unit, icon }) {
  return (
    <div className="rounded-2xl border border-stone-100 bg-stone-50/50 p-4 transition-colors hover:bg-white hover:shadow-md">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">{label}</p>
        {icon}
      </div>
      <p className="text-2xl font-extrabold">{value}<span className="ml-1 text-xs font-bold text-stone-400">{unit}</span></p>
    </div>
  );
}
