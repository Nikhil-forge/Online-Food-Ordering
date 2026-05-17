import { query, pool } from './config/db.js';

async function updateDB() {
  try {
    console.log('Adding image_url column to restaurants table if it does not exist...');
    try {
      await query('ALTER TABLE restaurants ADD COLUMN image_url VARCHAR(500)');
      console.log('✅ Column image_url added.');
    } catch (e) {
      if (e.code === 'ER_DUP_FIELDNAME') {
        console.log('ℹ️ Column image_url already exists.');
      } else {
        throw e;
      }
    }

    console.log('Updating existing restaurant with an image...');
    await query('UPDATE restaurants SET image_url = ? WHERE restaurant_name = ?', [
      'https://images.unsplash.com/photo-1490818387583-1b0ba6873562?auto=format&fit=crop&w=800&q=80',
      'Green Bowl Cafe'
    ]);

    console.log('Inserting Burger Junction...');
    const burgerExists = await query('SELECT restaurant_id FROM restaurants WHERE restaurant_name = ?', ['Burger Junction']);
    if (burgerExists.length === 0) {
      const result1 = await query(
        'INSERT INTO restaurants (restaurant_name, address, contact, cuisine, rating, image_url) VALUES (?, ?, ?, ?, ?, ?)',
        ['Burger Junction', '45 Main Street, Foodville', '+91 9876543211', 'American', 4.5, 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80']
      );
      const rId1 = result1.insertId;
      await query(
        `INSERT INTO food_items (restaurant_id, food_name, category, price, image_url, calories, protein, carbohydrates, fats, fiber, sugar) VALUES 
        (?, 'Classic Cheeseburger', 'Main Course', 350, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=80', 550, 30, 45, 25, 3, 8),
        (?, 'Crispy Fries', 'Sides', 150, 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=500&q=80', 380, 4, 48, 18, 4, 1)`,
        [rId1, rId1]
      );
      console.log('✅ Burger Junction inserted.');
    } else {
      console.log('ℹ️ Burger Junction already exists.');
    }

    console.log('Inserting Sushi Paradise...');
    const sushiExists = await query('SELECT restaurant_id FROM restaurants WHERE restaurant_name = ?', ['Sushi Paradise']);
    if (sushiExists.length === 0) {
      const result2 = await query(
        'INSERT INTO restaurants (restaurant_name, address, contact, cuisine, rating, image_url) VALUES (?, ?, ?, ?, ?, ?)',
        ['Sushi Paradise', '88 Sakura Lane, Zen City', '+91 9876543212', 'Japanese', 4.9, 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=800&q=80']
      );
      const rId2 = result2.insertId;
      await query(
        `INSERT INTO food_items (restaurant_id, food_name, category, price, image_url, calories, protein, carbohydrates, fats, fiber, sugar) VALUES 
        (?, 'Salmon Nigiri', 'Main Course', 450, 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?auto=format&fit=crop&w=500&q=80', 200, 15, 25, 4, 1, 2),
        (?, 'Spicy Tuna Roll', 'Main Course', 380, 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=500&q=80', 320, 18, 40, 8, 2, 4)`,
        [rId2, rId2]
      );
      console.log('✅ Sushi Paradise inserted.');
    } else {
      console.log('ℹ️ Sushi Paradise already exists.');
    }

    console.log('🎉 Database update complete.');
  } catch (error) {
    console.error('❌ Update failed:', error);
  } finally {
    pool.end();
  }
}

updateDB();
