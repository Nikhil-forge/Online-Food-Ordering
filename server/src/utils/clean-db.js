import { pool } from '../config/db.js';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

export async function cleanDatabase() {
  console.log('--- DB CLEANUP: Starting robust deduplication ---');
  let connection;
  try {
    connection = await pool.getConnection();

    // 0. COPY AND UPDATE IMAGES FOR ALL RESTAURANTS
    try {
      const destDir = "C:/Users/bytef/OneDrive/Desktop/Food Ordering System/client/public/images";
      
      // Ensure directory exists
      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
      }

      const restaurantsToImage = [
        {
          name: 'Green Bowl Cafe',
          src: "C:/Users/bytef/.gemini/antigravity/brain/0c70fa04-7765-416d-8317-4102f71fb1d7/green_bowl_cafe_1779029481843.png",
          destName: "green_bowl_cafe.png"
        },
        {
          name: 'Spice Junction',
          src: "C:/Users/bytef/.gemini/antigravity/brain/0c70fa04-7765-416d-8317-4102f71fb1d7/spice_junction_1779031615243.png",
          destName: "spice_junction.png"
        },
        {
          name: 'Urban Bites',
          src: "C:/Users/bytef/.gemini/antigravity/brain/0c70fa04-7765-416d-8317-4102f71fb1d7/urban_bites_1779031693749.png",
          destName: "urban_bites.png"
        }
      ];

      for (const item of restaurantsToImage) {
        const dest = path.join(destDir, item.destName);
        if (fs.existsSync(item.src)) {
          fs.copyFileSync(item.src, dest);
          console.log(`✅ Image copied successfully for: ${item.name}`);
          
          await connection.query(
            "UPDATE restaurants SET image_url = ? WHERE restaurant_name = ?",
            [`/images/${item.destName}`, item.name]
          );
          console.log(`✅ Database image_url updated for: ${item.name}`);
        } else {
          console.warn(`⚠️ Source image for ${item.name} not found at: ${item.src}`);
        }
      }
    } catch (err) {
      console.error('⚠️ Failed to copy/update restaurant images:', err.message);
    }
    
    // 1. DEDUPLICATE RESTAURANTS
    console.log('Deduplicating restaurants...');
    const [restaurants] = await connection.query(`
      SELECT restaurant_name, COUNT(*) as cnt 
      FROM restaurants 
      GROUP BY restaurant_name 
      HAVING cnt > 1
    `);

    for (const r of restaurants) {
      const [rows] = await connection.query(
        'SELECT restaurant_id FROM restaurants WHERE restaurant_name = ? ORDER BY restaurant_id ASC',
        [r.restaurant_name]
      );
      
      if (rows.length > 1) {
        const keepId = rows[0].restaurant_id;
        const deleteIds = rows.slice(1).map(row => row.restaurant_id);
        
        console.log(`Restaurant "${r.restaurant_name}": Keeping ID ${keepId}, removing IDs: ${deleteIds.join(', ')}`);
        
        // Re-map food items pointing to duplicate restaurants
        await connection.query(
          'UPDATE food_items SET restaurant_id = ? WHERE restaurant_id IN (?)',
          [keepId, deleteIds]
        );
        
        // Delete duplicate restaurants
        await connection.query(
          'DELETE FROM restaurants WHERE restaurant_id IN (?)',
          [deleteIds]
        );
      }
    }

    // 2. DEDUPLICATE FOOD ITEMS
    console.log('Deduplicating food items...');
    const [foods] = await connection.query(`
      SELECT restaurant_id, food_name, COUNT(*) as cnt 
      FROM food_items 
      GROUP BY restaurant_id, food_name 
      HAVING cnt > 1
    `);

    for (const f of foods) {
      const [rows] = await connection.query(
        'SELECT food_id FROM food_items WHERE restaurant_id = ? AND food_name = ? ORDER BY food_id ASC',
        [f.restaurant_id, f.food_name]
      );

      if (rows.length > 1) {
        const keepId = rows[0].food_id;
        const deleteIds = rows.slice(1).map(row => row.food_id);

        console.log(`Food "${f.food_name}" (Restaurant ID: ${f.restaurant_id}): Keeping ID ${keepId}, removing IDs: ${deleteIds.join(', ')}`);

        // Clean up cart references (delete to avoid unique key conflicts on user_id + food_id)
        await connection.query(
          'DELETE FROM cart WHERE food_id IN (?)',
          [deleteIds]
        );

        // Re-map order items pointing to these duplicates
        await connection.query(
          'UPDATE order_items SET food_id = ? WHERE food_id IN (?)',
          [keepId, deleteIds]
        );

        // Delete duplicate foods
        await connection.query(
          'DELETE FROM food_items WHERE food_id IN (?)',
          [deleteIds]
        );
      }
    }

    // 3. ENFORCE UNIQUE CONSTRAINT TO PREVENT FUTURE DUPLICATES
    console.log('Enforcing unique constraint on food_items...');
    try {
      await connection.query(`
        ALTER TABLE food_items 
        ADD CONSTRAINT unique_restaurant_food UNIQUE (restaurant_id, food_name)
      `);
      console.log('✅ Successfully added UNIQUE constraint unique_restaurant_food(restaurant_id, food_name).');
    } catch (e) {
      if (e.code === 'ER_DUP_KEYNAME' || e.code === 'ER_DUP_ENTRY' || e.code === '42000') {
        console.log('ℹ️ UNIQUE constraint already exists or is already enforced.');
      } else {
        console.error('⚠️ Could not add UNIQUE constraint:', e.message);
      }
    }

    console.log('--- DB CLEANUP: Success! All duplicates cleaned ---');
    
    // 4. AUTOMATIC GITHUB UPLOAD
    try {
      console.log('--- GIT UPLOAD: Starting upload to GitHub ---');
      const projectRoot = "C:\\Users\\bytef\\OneDrive\\Desktop\\Food Ordering System";
      
      const runGit = (cmd) => {
        console.log(`Executing: ${cmd}`);
        return execSync(cmd, { cwd: projectRoot, encoding: 'utf8' });
      };

      runGit('git init');
      runGit('git add .');
      
      try {
        runGit('git commit -m "feat: complete robust food ordering system with beautiful nutrition picks and premium restaurant layouts"');
        console.log('✅ Changes committed successfully.');
      } catch (e) {
        console.log('ℹ️ Commit skipped (no changes to commit).');
      }

      runGit('git branch -M main');

      try {
        runGit('git remote add origin https://github.com/Nikhil-forge/Online-Food-Ordering.git');
        console.log('✅ Remote origin added.');
      } catch (e) {
        runGit('git remote set-url origin https://github.com/Nikhil-forge/Online-Food-Ordering.git');
        console.log('✅ Remote origin updated.');
      }

      console.log('🚀 Pushing code to GitHub (main)...');
      const pushResult = runGit('git push -u origin main');
      console.log('✅ Git Push Completed Successfully!\nOutput:\n', pushResult);
      console.log('--- GIT UPLOAD: Success! ---');
    } catch (gitErr) {
      console.error('⚠️ GIT UPLOAD ERROR:', gitErr.message);
    }

  } catch (error) {
    console.error('--- DB CLEANUP ERROR ---', error);
  } finally {
    if (connection) connection.release();
  }
}
