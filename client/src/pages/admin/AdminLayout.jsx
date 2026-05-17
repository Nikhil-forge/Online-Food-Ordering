import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Store, Utensils, History, Users, Activity } from 'lucide-react';

export default function AdminLayout() {
  const navItems = [
    { to: '/admin', icon: <LayoutDashboard size={20} />, label: 'Dashboard', exact: true },
    { to: '/admin/restaurants', icon: <Store size={20} />, label: 'Restaurants' },
    { to: '/admin/foods', icon: <Utensils size={20} />, label: 'Food Items' },
    { to: '/admin/orders', icon: <History size={20} />, label: 'Orders' },
    { to: '/admin/users', icon: <Users size={20} />, label: 'Users' },
    { to: '/admin/reports', icon: <Activity size={20} />, label: 'Nutrition Reports' },
  ];

  return (
    <div className="flex min-h-[calc(100vh-140px)] mx-auto max-w-7xl px-4 py-8 gap-8">
      <aside className="w-64 shrink-0 hidden md:block">
        <div className="panel p-4 sticky top-24 space-y-2">
          <h2 className="px-4 text-xs font-black uppercase tracking-widest text-stone-400 mb-4">Admin Controls</h2>
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              end={item.exact}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
                  isActive ? 'bg-ink text-white shadow-md' : 'text-stone-600 hover:bg-stone-100 hover:text-ink'
                }`
              }
            >
              {item.icon} {item.label}
            </NavLink>
          ))}
        </div>
      </aside>
      
      <main className="flex-1 w-full min-w-0">
        <Outlet />
      </main>
    </div>
  );
}
