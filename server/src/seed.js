import bcrypt from 'bcrypt';
import { query, pool } from './config/db.js';

async function seedDatabase() {
  console.log('Starting database seeding...');

  try {
    // Check if demo user exists
    const [userExists] = await query('SELECT user_id FROM users WHERE email = ?', ['user@demo.com']);
    if (!userExists) {
      const userHash = await bcrypt.hash('password123', 10);
      await query(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        ['Demo User', 'user@demo.com', userHash, 'user']
      );
      console.log('✅ Created Demo User (user@demo.com)');
    } else {
      console.log('ℹ️ Demo User already exists.');
    }

    // Check if admin user exists
    const [adminExists] = await query('SELECT user_id FROM users WHERE email = ?', ['admin@demo.com']);
    if (!adminExists) {
      const adminHash = await bcrypt.hash('adminpassword', 10);
      await query(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        ['Demo Admin', 'admin@demo.com', adminHash, 'admin']
      );
      console.log('✅ Created Demo Admin (admin@demo.com)');
    } else {
      console.log('ℹ️ Demo Admin already exists.');
    }

    // Insert a dummy restaurant if none exist
    const restaurants = await query('SELECT restaurant_id FROM restaurants');
    if (restaurants.length === 0) {
      const result = await query(
        'INSERT INTO restaurants (restaurant_name, address, contact, cuisine, rating, image_url) VALUES (?, ?, ?, ?, ?, ?)',
        ['Green Bowl Cafe', '123 Health Ave, Diet City', '+91 9876543210', 'Healthy', 4.8, 'https://images.unsplash.com/photo-1490818387583-1b0ba6873562?auto=format&fit=crop&w=800&q=80']
      );
      
      const restaurantId = result.insertId;
      console.log('✅ Created Dummy Restaurant');

      // Insert dummy foods
      await query(
        `INSERT INTO food_items (restaurant_id, food_name, category, price, image_url, calories, protein, carbohydrates, fats, fiber, sugar) VALUES 
        (?, 'Grilled Chicken Salad', 'Main Course', 250, 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=500&q=80', 350, 35, 12, 18, 5, 2),
        (?, 'Quinoa Protein Bowl', 'Main Course', 300, 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80', 420, 22, 45, 15, 8, 4),
        (?, 'Fruit & Nut Smoothie', 'Beverages', 180, 'https://images.unsplash.com/photo-1553530666-ba11a7ddc2ed?auto=format&fit=crop&w=500&q=80', 250, 8, 30, 10, 6, 15)`,
        [restaurantId, restaurantId, restaurantId]
      );
      console.log('✅ Created Dummy Foods');
    }

    console.log('🎉 Seeding Complete!');
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
  } finally {
    pool.end();
  }
}

seedDatabase();
