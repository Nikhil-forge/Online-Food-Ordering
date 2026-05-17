import { query, pool } from './config/db.js';

async function addEvenMoreRestaurants() {
  try {
    console.log('Inserting Spice Symphony...');
    const exists1 = await query('SELECT restaurant_id FROM restaurants WHERE restaurant_name = ?', ['Spice Symphony']);
    if (exists1.length === 0) {
      const res = await query(
        'INSERT INTO restaurants (restaurant_name, address, contact, cuisine, rating, image_url) VALUES (?, ?, ?, ?, ?, ?)',
        ['Spice Symphony', '101 Curry Lane, Spice City', '+91 9876543216', 'Indian', 4.8, 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80']
      );
      const rId = res.insertId;
      await query(
        `INSERT INTO food_items (restaurant_id, food_name, category, price, image_url, calories, protein, carbohydrates, fats, fiber, sugar) VALUES 
        (?, 'Butter Chicken', 'Main Course', 400, 'https://images.unsplash.com/photo-1603894584373-5ac82b6ae39c?auto=format&fit=crop&w=500&q=80', 650, 35, 20, 45, 3, 5),
        (?, 'Garlic Naan', 'Sides', 80, 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=500&q=80', 200, 5, 35, 5, 2, 1)`,
        [rId, rId]
      );
      console.log('✅ Spice Symphony inserted.');
    } else {
      console.log('ℹ️ Spice Symphony already exists.');
    }

    console.log('Inserting Dragon Wok...');
    const exists2 = await query('SELECT restaurant_id FROM restaurants WHERE restaurant_name = ?', ['Dragon Wok']);
    if (exists2.length === 0) {
      const res = await query(
        'INSERT INTO restaurants (restaurant_name, address, contact, cuisine, rating, image_url) VALUES (?, ?, ?, ?, ?, ?)',
        ['Dragon Wok', '88 Neon Street, Chinatown', '+91 9876543217', 'Chinese', 4.4, 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80']
      );
      const rId = res.insertId;
      await query(
        `INSERT INTO food_items (restaurant_id, food_name, category, price, image_url, calories, protein, carbohydrates, fats, fiber, sugar) VALUES 
        (?, 'Kung Pao Chicken', 'Main Course', 380, 'https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=500&q=80', 500, 30, 25, 20, 4, 8),
        (?, 'Spring Rolls', 'Appetizer', 200, 'https://images.unsplash.com/photo-1544025162-811114215b49?auto=format&fit=crop&w=500&q=80', 350, 8, 45, 15, 3, 2)`,
        [rId, rId]
      );
      console.log('✅ Dragon Wok inserted.');
    } else {
      console.log('ℹ️ Dragon Wok already exists.');
    }

    console.log('Inserting Sweet Tooth Bakery...');
    const exists3 = await query('SELECT restaurant_id FROM restaurants WHERE restaurant_name = ?', ['Sweet Tooth Bakery']);
    if (exists3.length === 0) {
      const res = await query(
        'INSERT INTO restaurants (restaurant_name, address, contact, cuisine, rating, image_url) VALUES (?, ?, ?, ?, ?, ?)',
        ['Sweet Tooth Bakery', '12 Sugar Avenue, Dessert Town', '+91 9876543218', 'Bakery', 4.7, 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80']
      );
      const rId = res.insertId;
      await query(
        `INSERT INTO food_items (restaurant_id, food_name, category, price, image_url, calories, protein, carbohydrates, fats, fiber, sugar) VALUES 
        (?, 'Chocolate Truffle Cake', 'Dessert', 550, 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=500&q=80', 800, 10, 90, 45, 5, 60),
        (?, 'Blueberry Muffin', 'Dessert', 150, 'https://images.unsplash.com/photo-1605197136365-c33580436816?auto=format&fit=crop&w=500&q=80', 350, 5, 55, 12, 2, 25)`,
        [rId, rId]
      );
      console.log('✅ Sweet Tooth Bakery inserted.');
    } else {
      console.log('ℹ️ Sweet Tooth Bakery already exists.');
    }

    console.log('🎉 Added 3 more restaurants successfully!');
  } catch (error) {
    console.error('❌ Failed to add restaurants:', error);
  } finally {
    pool.end();
  }
}

addEvenMoreRestaurants();
