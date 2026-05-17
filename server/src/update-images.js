import { pool } from './config/db.js';

async function updateImages() {
  try {
    console.log('Updating image for Acai Protein Smoothie...');
    await pool.query(
      `UPDATE food_items SET image_url = '/images/acai_smoothie.png' WHERE food_name = 'Acai Protein Smoothie'`
    );
    console.log('Updated Acai Protein Smoothie.');

    console.log('Updating image for Butter Chicken...');
    await pool.query(
      `UPDATE food_items SET image_url = '/images/butter_chicken.png' WHERE food_name = 'Butter Chicken'`
    );
    console.log('Updated Butter Chicken.');

    process.exit(0);
  } catch (error) {
    console.error('Error updating images:', error);
    process.exit(1);
  }
}

updateImages();
