import { query, pool } from './config/db.js';

async function addMoreRestaurants() {
  try {
    console.log('Inserting Pasta Fiesta...');
    const exists1 = await query('SELECT restaurant_id FROM restaurants WHERE restaurant_name = ?', ['Pasta Fiesta']);
    if (exists1.length === 0) {
      const res = await query(
        'INSERT INTO restaurants (restaurant_name, address, contact, cuisine, rating, image_url) VALUES (?, ?, ?, ?, ?, ?)',
        ['Pasta Fiesta', '120 Vintage Road, Little Italy', '+91 9876543213', 'Italian', 4.7, 'https://images.unsplash.com/photo-1579684947550-22e945225d9a?auto=format&fit=crop&w=800&q=80']
      );
      const rId = res.insertId;
      await query(
        `INSERT INTO food_items (restaurant_id, food_name, category, price, image_url, calories, protein, carbohydrates, fats, fiber, sugar) VALUES 
        (?, 'Spaghetti Carbonara', 'Main Course', 450, 'https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&w=500&q=80', 600, 20, 50, 25, 2, 4),
        (?, 'Margherita Pizza', 'Main Course', 500, 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?auto=format&fit=crop&w=500&q=80', 800, 30, 80, 30, 5, 8)`,
        [rId, rId]
      );
      console.log('✅ Pasta Fiesta inserted.');
    } else {
      console.log('ℹ️ Pasta Fiesta already exists.');
    }

    console.log('Inserting Taco Haven...');
    const exists2 = await query('SELECT restaurant_id FROM restaurants WHERE restaurant_name = ?', ['Taco Haven']);
    if (exists2.length === 0) {
      const res = await query(
        'INSERT INTO restaurants (restaurant_name, address, contact, cuisine, rating, image_url) VALUES (?, ?, ?, ?, ?, ?)',
        ['Taco Haven', '44 Spice Street, Downtown', '+91 9876543214', 'Mexican', 4.6, 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80']
      );
      const rId = res.insertId;
      await query(
        `INSERT INTO food_items (restaurant_id, food_name, category, price, image_url, calories, protein, carbohydrates, fats, fiber, sugar) VALUES 
        (?, 'Spicy Chicken Tacos', 'Main Course', 250, 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=500&q=80', 450, 25, 30, 15, 4, 3),
        (?, 'Nachos Supreme', 'Appetizer', 300, 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&w=500&q=80', 500, 15, 55, 25, 8, 2)`,
        [rId, rId]
      );
      console.log('✅ Taco Haven inserted.');
    } else {
      console.log('ℹ️ Taco Haven already exists.');
    }

    console.log('Inserting Vegan Delights...');
    const exists3 = await query('SELECT restaurant_id FROM restaurants WHERE restaurant_name = ?', ['Vegan Delights']);
    if (exists3.length === 0) {
      const res = await query(
        'INSERT INTO restaurants (restaurant_name, address, contact, cuisine, rating, image_url) VALUES (?, ?, ?, ?, ?, ?)',
        ['Vegan Delights', '77 Green Avenue, Uptown', '+91 9876543215', 'Vegan', 4.9, 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80']
      );
      const rId = res.insertId;
      await query(
        `INSERT INTO food_items (restaurant_id, food_name, category, price, image_url, calories, protein, carbohydrates, fats, fiber, sugar) VALUES 
        (?, 'Buddha Bowl', 'Main Course', 380, 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80', 350, 15, 45, 10, 12, 5),
        (?, 'Vegan Chocolate Cake', 'Dessert', 220, 'https://images.unsplash.com/photo-1571115177098-24c42de1bd0f?auto=format&fit=crop&w=500&q=80', 400, 5, 55, 18, 4, 25)`,
        [rId, rId]
      );
      console.log('✅ Vegan Delights inserted.');
    } else {
      console.log('ℹ️ Vegan Delights already exists.');
    }

    console.log('🎉 Added 3 more restaurants successfully!');
  } catch (error) {
    console.error('❌ Failed to add restaurants:', error);
  } finally {
    pool.end();
  }
}

addMoreRestaurants();
