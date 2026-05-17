import { pool } from './config/db.js';

async function deduplicateFoodItems() {
  try {
    console.log('Checking for duplicate food items...');

    // Find duplicates
    const [duplicates] = await pool.query(`
      SELECT food_name, restaurant_id, COUNT(*) as count
      FROM food_items
      GROUP BY food_name, restaurant_id
      HAVING COUNT(*) > 1
    `);

    if (duplicates.length === 0) {
      console.log('No duplicates found.');
      process.exit(0);
    }

    console.log(`Found ${duplicates.length} duplicate groups. Removing extras...`);

    for (const dup of duplicates) {
      // Keep only the row with the lowest item_id, delete the rest
      await pool.query(`
        DELETE FROM food_items
        WHERE food_name = ? AND restaurant_id = ?
        AND item_id NOT IN (
          SELECT min_id FROM (
            SELECT MIN(item_id) as min_id FROM food_items
            WHERE food_name = ? AND restaurant_id = ?
          ) AS subq
        )
      `, [dup.food_name, dup.restaurant_id, dup.food_name, dup.restaurant_id]);

      console.log(`Deduplicated: "${dup.food_name}" (restaurant_id: ${dup.restaurant_id}) — kept 1, removed ${dup.count - 1}`);
    }

    // Show final count
    const [countResult] = await pool.query(`SELECT COUNT(*) as total FROM food_items`);
    console.log(`\nDone! Total food items remaining: ${countResult[0].total}`);
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

deduplicateFoodItems();
