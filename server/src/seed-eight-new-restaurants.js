import { query, pool } from './config/db.js';

async function seedEightNewRestaurants() {
  try {
    console.log('🌱 Starting seed for 8 new modern restaurants...');

    const newRestaurants = [
      {
        name: 'Spice Villa',
        address: '102 Royal Residency, Heritage Road, Foodville',
        contact: '+91 9876543201',
        cuisine: 'Indian',
        rating: 4.5,
        image_url: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80',
        menu: [
          { name: 'Butter Chicken', category: 'Main Course', price: 380, image_url: 'https://images.unsplash.com/photo-1603894584373-5ac82b6ae39c?auto=format&fit=crop&w=500&q=80', calories: 650, protein: 35, carbohydrates: 20, fats: 45 },
          { name: 'Paneer Tikka Masala', category: 'Main Course', price: 320, image_url: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=500&q=80', calories: 520, protein: 18, carbohydrates: 15, fats: 38 },
          { name: 'Garlic Naan', category: 'Bread', price: 80, image_url: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=500&q=80', calories: 220, protein: 6, carbohydrates: 40, fats: 5 }
        ]
      },
      {
        name: 'Dragon Wok',
        address: '88 Chinatown Arcade, Lantern Street, Foodville',
        contact: '+91 9876543202',
        cuisine: 'Chinese',
        rating: 4.3,
        image_url: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80',
        menu: [
          { name: 'Kung Pao Chicken', category: 'Main Course', price: 350, image_url: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=500&q=80', calories: 480, protein: 28, carbohydrates: 22, fats: 18 },
          { name: 'Veg Hakka Noodles', category: 'Main Course', price: 280, image_url: 'https://images.unsplash.com/photo-1612966608967-312ba5979940?auto=format&fit=crop&w=500&q=80', calories: 420, protein: 8, carbohydrates: 65, fats: 12 },
          { name: 'Chili Paneer Dry', category: 'Appetizer', price: 300, image_url: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=500&q=80', calories: 390, protein: 14, carbohydrates: 18, fats: 22 }
        ]
      },
      {
        name: 'Pasta Palace',
        address: '404 Italian Plaza, Venice Way, Foodville',
        contact: '+91 9876543203',
        cuisine: 'Italian',
        rating: 4.6,
        image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80',
        menu: [
          { name: 'Penne Alfredo', category: 'Main Course', price: 390, image_url: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=500&q=80', calories: 580, protein: 15, carbohydrates: 60, fats: 28 },
          { name: 'Lasagna Classica', category: 'Main Course', price: 450, image_url: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?auto=format&fit=crop&w=500&q=80', calories: 720, protein: 25, carbohydrates: 55, fats: 32 },
          { name: 'Garlic Bread with Cheese', category: 'Appetizer', price: 180, image_url: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=500&q=80', calories: 310, protein: 8, carbohydrates: 35, fats: 14 }
        ]
      },
      {
        name: 'Burger Hub',
        address: '12 Street Food Lane, Gourmet Square, Foodville',
        contact: '+91 9876543204',
        cuisine: 'Fast Food',
        rating: 4.2,
        image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
        menu: [
          { name: 'Gourmet Cheeseburger', category: 'Main Course', price: 260, image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=80', calories: 560, protein: 30, carbohydrates: 42, fats: 26 },
          { name: 'Crispy Chicken Zinger', category: 'Main Course', price: 280, image_url: 'https://images.unsplash.com/photo-1513185158878-8d8c2a2a3ad3?auto=format&fit=crop&w=500&q=80', calories: 610, protein: 34, carbohydrates: 48, fats: 28 },
          { name: 'Loaded Fries', category: 'Sides', price: 190, image_url: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=500&q=80', calories: 450, protein: 10, carbohydrates: 52, fats: 22 }
        ]
      },
      {
        name: 'Dosa Kingdom',
        address: '55 Coconut Grove, Sambhar Lane, Foodville',
        contact: '+91 9876543205',
        cuisine: 'South Indian',
        rating: 4.7,
        image_url: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=800&q=80',
        menu: [
          { name: 'Masala Dosa', category: 'Main Course', price: 150, image_url: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=500&q=80', calories: 340, protein: 6, carbohydrates: 58, fats: 8 },
          { name: 'Idli Sambar (2 Pcs)', category: 'Main Course', price: 100, image_url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=500&q=80', calories: 180, protein: 5, carbohydrates: 38, fats: 1 },
          { name: 'Rava Onion Dosa', category: 'Main Course', price: 180, image_url: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=500&q=80', calories: 390, protein: 7, carbohydrates: 62, fats: 10 }
        ]
      },
      {
        name: 'Smoke House BBQ',
        address: '77 Pitmaster Boulevard, Hickory Drive, Foodville',
        contact: '+91 9876543206',
        cuisine: 'Grill & BBQ',
        rating: 4.4,
        image_url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
        menu: [
          { name: 'Smoked BBQ Chicken', category: 'Main Course', price: 420, image_url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=500&q=80', calories: 650, protein: 45, carbohydrates: 15, fats: 32 },
          { name: 'Grilled Paneer Skewers', category: 'Main Course', price: 340, image_url: 'https://images.unsplash.com/photo-1594002684730-5f15ca7c1e65?auto=format&fit=crop&w=500&q=80', calories: 410, protein: 22, carbohydrates: 8, fats: 25 },
          { name: 'BBQ Pulled Chicken Slider', category: 'Appetizer', price: 290, image_url: 'https://images.unsplash.com/photo-1525059696034-4967a8e1dca2?auto=format&fit=crop&w=500&q=80', calories: 480, protein: 28, carbohydrates: 35, fats: 18 }
        ]
      },
      {
        name: 'Sweet Cravings',
        address: '9 Chocolatier Arcade, Sweet Street, Foodville',
        contact: '+91 9876543207',
        cuisine: 'Desserts',
        rating: 4.8,
        image_url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
        menu: [
          { name: 'Death by Chocolate Cake', category: 'Dessert', price: 220, image_url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=500&q=80', calories: 480, protein: 6, carbohydrates: 68, fats: 22 },
          { name: 'Red Velvet Pastry', category: 'Dessert', price: 180, image_url: 'https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?auto=format&fit=crop&w=500&q=80', calories: 390, protein: 4, carbohydrates: 52, fats: 18 },
          { name: 'Classic NY Cheesecake', category: 'Dessert', price: 250, image_url: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=500&q=80', calories: 450, protein: 8, carbohydrates: 42, fats: 28 }
        ]
      },
      {
        name: 'Green Bowl',
        address: '32 Organic Plaza, Garden Road, Foodville',
        contact: '+91 9876543208',
        cuisine: 'Healthy Food',
        rating: 4.5,
        image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
        menu: [
          { name: 'Avocado Quinoa Salad', category: 'Main Course', price: 340, image_url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=500&q=80', calories: 310, protein: 8, carbohydrates: 28, fats: 18 },
          { name: 'Tofu Teriyaki Bowl', category: 'Main Course', price: 380, image_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80', calories: 420, protein: 18, carbohydrates: 52, fats: 12 },
          { name: 'Acai Protein Smoothie', category: 'Beverages', price: 240, image_url: 'https://images.unsplash.com/photo-1553530666-ba11a7ddc2ed?auto=format&fit=crop&w=500&q=80', calories: 220, protein: 12, carbohydrates: 32, fats: 4 }
        ]
      }
    ];

    for (const rData of newRestaurants) {
      console.log(`Processing restaurant: ${rData.name}...`);
      const exists = await query('SELECT restaurant_id FROM restaurants WHERE restaurant_name = ?', [rData.name]);
      
      let restaurantId;
      if (exists.length === 0) {
        const result = await query(
          'INSERT INTO restaurants (restaurant_name, address, contact, cuisine, rating, image_url) VALUES (?, ?, ?, ?, ?, ?)',
          [rData.name, rData.address, rData.contact, rData.cuisine, rData.rating, rData.image_url]
        );
        restaurantId = result.insertId;
        console.log(`  ✅ Inserted ${rData.name} with ID: ${restaurantId}`);
      } else {
        restaurantId = exists[0].restaurant_id;
        console.log(`  ℹ️ ${rData.name} already exists with ID: ${restaurantId}. Re-seeding food items...`);
        // Let's delete existing food items for this restaurant to avoid duplicates during re-seeding
        await query('DELETE FROM food_items WHERE restaurant_id = ?', [restaurantId]);
      }

      // Seed food items
      for (const item of rData.menu) {
        await query(
          `INSERT INTO food_items (restaurant_id, food_name, category, price, image_url, calories, protein, carbohydrates, fats) VALUES 
          (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [restaurantId, item.name, item.category, item.price, item.image_url, item.calories, item.protein, item.carbohydrates, item.fats]
        );
      }
      console.log(`  ✅ Seeded ${rData.menu.length} menu items for ${rData.name}.`);
    }

    console.log('🎉 Seeding successfully completed for all 8 restaurants!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    pool.end();
  }
}

seedEightNewRestaurants();
