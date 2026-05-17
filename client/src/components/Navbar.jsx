import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Store, ShoppingCart, LayoutDashboard, History, LogOut, Utensils } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function NavLink({ to, icon, label }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link 
      to={to} 
      className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition-all ${
        isActive ? 'bg-tomato text-white shadow-lg shadow-tomato/30' : 'text-stone-600 hover:bg-stone-100 hover:text-ink'
      }`}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </Link>
  );
}

export default function Navbar() {
  const { user, cartCount, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 glass border-b border-stone-100">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link to="/" className="group flex items-center gap-2 text-2xl font-extrabold tracking-tight text-ink">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-tomato text-white transition-transform group-hover:rotate-12">
            <Utensils size={24} />
          </div>
          <span>Nutri<span className="text-tomato">Order</span></span>
        </Link>

        <nav className="flex items-center gap-1">
          {user ? (
            <>
              <NavLink to="/home" icon={<Home size={18} />} label="Home" />
              <NavLink to="/restaurants" icon={<Store size={18} />} label="Restaurants" />
              <NavLink to="/cart" icon={
                <div className="relative">
                  <ShoppingCart size={18} />
                  {cartCount > 0 && <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-tomato text-[10px] text-white">{cartCount}</span>}
                </div>
              } label="Cart" />
              
              <div className="ml-2 flex items-center gap-2 border-l border-stone-200 pl-2">
                {user.role === 'admin' && (
                  <Link to="/admin" className="btn-ghost" title="Admin Panel">
                    <LayoutDashboard size={20} className="text-leaf" />
                  </Link>
                )}
                <div className="group relative">
                  <button className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-100 font-bold text-stone-600 hover:bg-stone-200 transition-colors">
                    {user.name.charAt(0).toUpperCase()}
                  </button>
                  <div className="invisible absolute right-0 mt-2 w-48 scale-95 opacity-0 transition-all group-hover:visible group-hover:scale-100 group-hover:opacity-100">
                    <div className="panel p-2 shadow-2xl">
                      <div className="px-3 py-2 border-b border-stone-100">
                        <p className="text-xs text-stone-500">Logged in as</p>
                        <p className="font-bold text-sm truncate">{user.name}</p>
                      </div>
                      <Link to="/profile" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-stone-600 hover:bg-stone-50">
                        <History size={16} /> My Profile
                      </Link>
                      <Link to="/orders" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-stone-600 hover:bg-stone-50">
                        <History size={16} /> Order History
                      </Link>
                      <button onClick={logout} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-tomato hover:bg-red-50">
                        <LogOut size={16} /> Logout
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="btn-ghost">Login</Link>
              <Link to="/register" className="btn-primary">Register</Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
