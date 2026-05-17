import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initDB() {
  console.log('🔄 Initializing Database...');
  
  // 1. Connect without selecting a database
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '1234'
  });

  try {
    // 2. Create the database if it doesn't exist
    const dbName = process.env.DB_NAME || 'food_nutrition_system';
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    console.log(`✅ Database "${dbName}" created or already exists.`);
    
    // 3. Switch to the database
    await connection.query(`USE \`${dbName}\``);
    
    // 4. Read and execute the schema.sql file
    const schemaPath = path.join(__dirname, '../../database/schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    
    // Split the SQL file by semicolons to execute statements one by one
    const statements = schemaSql.split(';').filter(stmt => stmt.trim() !== '');
    
    for (const stmt of statements) {
      await connection.query(stmt);
    }
    console.log('✅ Tables created successfully.');
    
    // 5. Seed the database with demo users and sample data
    console.log('🌱 Seeding sample data...');
    
    // Demo User
    const [userExists] = await connection.query('SELECT user_id FROM users WHERE email = ?', ['user@demo.com']);
    const userHash = await bcrypt.hash('password123', 10);
    if (!userExists.length) {
      await connection.query(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        ['Demo User', 'user@demo.com', userHash, 'user']
      );
      console.log('✅ Created Demo User (user@demo.com)');
    } else {
      await connection.query('UPDATE users SET password = ? WHERE email = ?', [userHash, 'user@demo.com']);
      console.log('✅ Synchronized Demo User password to password123');
    }

    // Demo Admin
    const [adminExists] = await connection.query('SELECT user_id FROM users WHERE email = ?', ['admin@demo.com']);
    const adminHash = await bcrypt.hash('adminpassword', 10);
    if (!adminExists.length) {
      await connection.query(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        ['Demo Admin', 'admin@demo.com', adminHash, 'admin']
      );
      console.log('✅ Created Demo Admin (admin@demo.com)');
    } else {
      await connection.query('UPDATE users SET password = ? WHERE email = ?', [adminHash, 'admin@demo.com']);
      console.log('✅ Synchronized Demo Admin password to adminpassword');
    }


    // Sample Restaurant
    const [restaurants] = await connection.query('SELECT restaurant_id FROM restaurants');
    if (restaurants.length === 0) {
      const [resResult] = await connection.query(
        'INSERT INTO restaurants (restaurant_name, address, contact, cuisine, rating, image_url) VALUES (?, ?, ?, ?, ?, ?)',
        ['Green Bowl Cafe', '123 Health Ave, Diet City', '+91 9876543210', 'Healthy', 4.8, 'https://images.unsplash.com/photo-1490818387583-1b0ba6873562?auto=format&fit=crop&w=800&q=80']
      );
      
      const restaurantId = resResult.insertId;
      console.log('✅ Created Dummy Restaurant');

      // Sample Foods
      await connection.query(
        `INSERT INTO food_items (restaurant_id, food_name, category, price, image_url, calories, protein, carbohydrates, fats, fiber, sugar) VALUES 
        (?, 'Grilled Chicken Salad', 'Main Course', 250, 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=500&q=80', 350, 35, 12, 18, 5, 2),
        (?, 'Quinoa Protein Bowl', 'Main Course', 300, 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80', 420, 22, 45, 15, 8, 4),
        (?, 'Fruit & Nut Smoothie', 'Beverages', 180, 'https://images.unsplash.com/photo-1553530666-ba11a7ddc2ed?auto=format&fit=crop&w=500&q=80', 250, 8, 30, 10, 6, 15)`,
        [restaurantId, restaurantId, restaurantId]
      );
      console.log('✅ Created Dummy Foods');
    }

    console.log('🎉 Setup Complete! You can now log in.');
  } catch (error) {
    console.error('❌ Setup failed:', error);
  } finally {
    await connection.end();
  }
}

initDB();
