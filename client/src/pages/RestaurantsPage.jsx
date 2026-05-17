import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, Star, X, Filter } from 'lucide-react';
import { api } from '../services/api';
import Loader from '../components/Loader';
import RestaurantCard from '../components/RestaurantCard';

const CUISINES = [
  'All',
  'Indian',
  'Chinese',
  'Italian',
  'Fast Food',
  'South Indian',
  'Grill & BBQ',
  'Desserts',
  'Healthy Food'
];

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('All');
  const [minRating, setMinRating] = useState(0);
  const [sortOrder, setSortOrder] = useState('desc'); // 'desc' or 'asc' for rating

  useEffect(() => {
    api.get('/restaurants')
      .then((res) => {
        setRestaurants(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching restaurants:', err);
        setLoading(false);
      });
  }, []);

  // Enrich restaurants with delivery time, reviews count, and price details dynamically
  const enrichRestaurant = (r) => {
    let deliveryTime = "25-35 min";
    let priceForTwo = "₹350 for two";
    let reviewsCount = 150;
    
    const name = r.restaurant_name.toLowerCase();
    
    if (name.includes("spice villa") || name.includes("spice symphony")) {
      deliveryTime = "30-40 min";
      priceForTwo = "₹400 for two";
      reviewsCount = 245;
    } else if (name.includes("dragon wok")) {
      deliveryTime = "25-35 min";
      priceForTwo = "₹350 for two";
      reviewsCount = 180;
    } else if (name.includes("pasta palace") || name.includes("pasta fiesta")) {
      deliveryTime = "35-45 min";
      priceForTwo = "₹500 for two";
      reviewsCount = 310;
    } else if (name.includes("burger hub") || name.includes("burger junction")) {
      deliveryTime = "15-25 min";
      priceForTwo = "₹250 for two";
      reviewsCount = 420;
    } else if (name.includes("dosa kingdom")) {
      deliveryTime = "20-30 min";
      priceForTwo = "₹200 for two";
      reviewsCount = 512;
    } else if (name.includes("smoke house bbq")) {
      deliveryTime = "40-50 min";
      priceForTwo = "₹600 for two";
      reviewsCount = 156;
    } else if (name.includes("sweet cravings") || name.includes("sweet tooth")) {
      deliveryTime = "15-25 min";
      priceForTwo = "₹300 for two";
      reviewsCount = 289;
    } else if (name.includes("green bowl") || name.includes("green bowl cafe")) {
      deliveryTime = "20-30 min";
      priceForTwo = "₹450 for two";
      reviewsCount = 198;
    } else if (name.includes("sushi paradise")) {
      deliveryTime = "30-40 min";
      priceForTwo = "₹800 for two";
      reviewsCount = 340;
    } else if (name.includes("taco haven")) {
      deliveryTime = "20-30 min";
      priceForTwo = "₹300 for two";
      reviewsCount = 210;
    } else if (name.includes("vegan delights")) {
      deliveryTime = "25-35 min";
      priceForTwo = "₹400 for two";
      reviewsCount = 175;
    }
    
    return {
      ...r,
      deliveryTime,
      priceForTwo,
      reviewsCount
    };
  };

  const enrichedRestaurants = restaurants.map(enrichRestaurant);

  // Advanced Filtering & Searching
  const filteredRestaurants = enrichedRestaurants
    .filter((r) => {
      // 1. Search Query Match (by name or cuisine)
      const matchesSearch = 
        r.restaurant_name.toLowerCase().includes(search.toLowerCase()) || 
        r.cuisine.toLowerCase().includes(search.toLowerCase());
      
      // 2. Cuisine Match
      let matchesCuisine = true;
      if (selectedCuisine !== 'All') {
        const cuisineTerm = selectedCuisine.toLowerCase();
        // Handle variations in BBQ/Grill and Healthy categories
        if (cuisineTerm.includes('bbq') || cuisineTerm.includes('grill')) {
          matchesCuisine = r.cuisine.toLowerCase().includes('bbq') || r.cuisine.toLowerCase().includes('grill');
        } else if (cuisineTerm.includes('healthy')) {
          matchesCuisine = r.cuisine.toLowerCase().includes('health');
        } else {
          matchesCuisine = r.cuisine.toLowerCase().includes(cuisineTerm);
        }
      }

      // 3. Rating Match
      const matchesRating = r.rating >= minRating;

      return matchesSearch && matchesCuisine && matchesRating;
    })
    // Sorting logic
    .sort((a, b) => {
      return sortOrder === 'desc' ? b.rating - a.rating : a.rating - b.rating;
    });

  // Reset all filters
  const resetFilters = () => {
    setSearch('');
    setSelectedCuisine('All');
    setMinRating(0);
    setSortOrder('desc');
  };

  if (loading) return <Loader />;

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 animate-fade-in">
      {/* Header section with search */}
      <div className="mb-12 flex flex-col lg:flex-row justify-between lg:items-end gap-6 border-b border-stone-100 pb-8">
        <div>
          <span className="text-xs font-bold text-tomato uppercase tracking-widest bg-red-50 px-3 py-1 rounded-full border border-red-100">Premium Kitchens</span>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-ink tracking-tight mt-3">Explore Restaurants</h1>
          <p className="text-stone-500 mt-2">Discover curated, high-quality kitchens and fast home delivery.</p>
        </div>
        
        {/* Search bar & Rating sorting */}
        <div className="flex flex-col sm:flex-row gap-4 items-center w-full lg:w-auto">
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-stone-400" />
            <input 
              className="field pl-12 py-3" 
              placeholder="Search by restaurant name or cuisine..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
            />
            {search && (
              <button 
                onClick={() => setSearch('')}
                className="absolute right-4 top-3.5 text-stone-400 hover:text-ink"
              >
                <X size={18} />
              </button>
            )}
          </div>
          
          <button 
            className="btn-secondary h-[46px] px-5 w-full sm:w-auto flex items-center justify-center gap-2 whitespace-nowrap" 
            onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
            title="Sort by Rating"
          >
            <Filter size={16} className="text-tomato" />
            <span>Sort: {sortOrder === 'desc' ? 'Highest Rated' : 'Lowest Rated'}</span>
          </button>
        </div>
      </div>

      {/* Advanced Filter Panel */}
      <div className="mb-10 bg-stone-50/50 rounded-3xl p-6 border border-stone-100/80">
        <div className="flex items-center gap-2 mb-4">
          <SlidersHorizontal size={18} className="text-tomato" />
          <h2 className="text-sm font-bold text-ink uppercase tracking-wider">Advanced Filters</h2>
          {(selectedCuisine !== 'All' || minRating > 0 || search) && (
            <button 
              onClick={resetFilters} 
              className="ml-auto text-xs text-tomato font-bold hover:underline flex items-center gap-1"
            >
              <X size={12} /> Reset Filters
            </button>
          )}
        </div>

        {/* 1. Cuisine Pills */}
        <div className="mb-6">
          <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-3">Cuisine Category</p>
          <div className="flex flex-wrap gap-2.5">
            {CUISINES.map((cuisine) => {
              const isActive = selectedCuisine === cuisine;
              return (
                <button
                  key={cuisine}
                  onClick={() => setSelectedCuisine(cuisine)}
                  className={`rounded-full px-4 py-2 text-xs font-extrabold transition-all duration-300 ${
                    isActive 
                      ? 'bg-tomato text-white border-tomato shadow-lg shadow-tomato/20 scale-105' 
                      : 'bg-white text-stone-600 border border-stone-200 hover:border-tomato/50 hover:text-tomato hover:bg-red-50/20'
                  }`}
                >
                  {cuisine}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Rating Filters */}
        <div>
          <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-3">Minimum Rating</p>
          <div className="flex gap-3">
            {[
              { label: 'All Ratings', value: 0 },
              { label: '4.5 ★ & Above', value: 4.5 },
              { label: '4.0 ★ & Above', value: 4.0 }
            ].map((ratingOpt) => {
              const isActive = minRating === ratingOpt.value;
              return (
                <button
                  key={ratingOpt.value}
                  onClick={() => setMinRating(ratingOpt.value)}
                  className={`rounded-full px-4 py-2 text-xs font-extrabold transition-all duration-300 flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-ink text-white border-ink shadow-lg shadow-ink/10 scale-105'
                      : 'bg-white text-stone-600 border border-stone-200 hover:border-ink hover:text-ink'
                  }`}
                >
                  {ratingOpt.value > 0 && <Star size={12} fill={isActive ? 'currentColor' : 'none'} className="text-amber-500" />}
                  <span>{ratingOpt.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Grid count summary */}
      <div className="mb-6 flex justify-between items-center text-sm font-medium text-stone-500">
        <p>Showing <span className="text-ink font-bold">{filteredRestaurants.length}</span> kitchens</p>
        {selectedCuisine !== 'All' && (
          <p>Filtered by: <span className="text-tomato font-bold">{selectedCuisine}</span></p>
        )}
      </div>

      {/* Restaurant Grid */}
      {filteredRestaurants.length === 0 ? (
        <div className="text-center py-24 rounded-3xl border-2 border-dashed border-stone-200/60 bg-stone-50/30">
          <p className="text-lg font-bold text-stone-600 mb-2">No kitchens match your filters</p>
          <p className="text-stone-400 text-sm max-w-md mx-auto mb-6">Try broadening your search, resetting your filters, or looking for other delicious cuisines.</p>
          <button onClick={resetFilters} className="btn-primary py-2 px-5 text-xs font-bold">
            Clear Filters & Search
          </button>
        </div>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filteredRestaurants.map((restaurant) => (
            <div key={restaurant.restaurant_id} className="h-full">
              <RestaurantCard restaurant={restaurant} />
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
