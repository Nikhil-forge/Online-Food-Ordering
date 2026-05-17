import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, ArrowRight, MapPin } from 'lucide-react';
import Badge from './Badge';

export default function RestaurantCard({ restaurant }) {
  const {
    restaurant_id,
    restaurant_name,
    address,
    cuisine,
    rating,
    image_url,
    deliveryTime = '25-35 min',
    priceForTwo = '₹350 for two',
    reviewsCount = 150
  } = restaurant;

  return (
    <Link 
      to={`/restaurants/${restaurant_id}`} 
      className="panel card-hover group p-0 overflow-hidden flex flex-col h-full bg-white/80 backdrop-blur-sm border border-stone-100 hover:border-tomato/30 animate-fade-in"
    >
      <div className="relative h-52 overflow-hidden shrink-0">
        {/* HD food image with lazy loading */}
        <img 
          src={image_url || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80'} 
          alt={restaurant_name} 
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" 
        />
        
        {/* Elegant Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
        
        {/* Floating rating badge */}
        <div className="absolute top-4 left-4">
          <Badge variant={rating >= 4.5 ? 'success' : 'warning'}>
            <span className="flex items-center gap-1">
              <Star size={12} fill="currentColor" />
              {rating}
            </span>
          </Badge>
        </div>
        
        {/* Floating info on image */}
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-white">
          <span className="rounded-full bg-white/20 backdrop-blur-md px-3 py-1 text-xs font-bold uppercase tracking-wider border border-white/10">
            {cuisine}
          </span>
          <span className="text-xs font-semibold text-stone-200">
            {reviewsCount} reviews
          </span>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-grow justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-ink group-hover:text-tomato transition-colors line-clamp-1">
            {restaurant_name}
          </h2>
          
          <div className="mt-2 flex items-center gap-1.5 text-stone-500">
            <MapPin size={15} className="shrink-0 text-stone-400" />
            <p className="text-xs font-medium line-clamp-1">{address}</p>
          </div>

          <div className="mt-4 flex items-center justify-between text-stone-600 text-xs font-bold uppercase tracking-wider">
            <div className="flex items-center gap-1.5 bg-stone-50 rounded-lg px-2.5 py-1.5 border border-stone-100">
              <Clock size={14} className="text-tomato" />
              <span>{deliveryTime}</span>
            </div>
            <div className="bg-stone-50 rounded-lg px-2.5 py-1.5 border border-stone-100">
              <span>{priceForTwo}</span>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between">
          <span className="text-xs text-stone-400 font-medium">Menu available</span>
          <button className="btn-primary py-2 px-4 text-xs font-extrabold flex items-center gap-2 group-hover:bg-red-600 transition-colors shadow-sm">
            <span>Order Now</span>
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </Link>
  );
}
