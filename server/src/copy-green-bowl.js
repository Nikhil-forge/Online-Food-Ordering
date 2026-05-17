import fs from 'fs';
import { pool } from './config/db.js';

const src = "C:/Users/bytef/.gemini/antigravity/brain/0c70fa04-7765-416d-8317-4102f71fb1d7/green_bowl_cafe_1779029481843.png";
const dest = "C:/Users/bytef/OneDrive/Desktop/Food Ordering System/client/public/images/green_bowl_cafe.png";

async function run() {
  try {
    if (!fs.existsSync(src)) {
      console.error('Source file not found:', src);
      process.exit(1);
    }
    fs.copyFileSync(src, dest);
    console.log('Image file copied to:', dest);

    const [result] = await pool.query(
      `UPDATE restaurants SET image_url = '/images/green_bowl_cafe.png' WHERE restaurant_name = 'Green Bowl Cafe'`
    );
    console.log('DB rows updated:', result.affectedRows);
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

run();
