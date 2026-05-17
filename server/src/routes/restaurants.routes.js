import express from 'express';
import { query } from '../config/db.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';


const router = express.Router();

router.get('/', async (_req, res, next) => {
  try {
    const restaurants = await query('SELECT * FROM restaurants ORDER BY rating DESC, restaurant_name ASC');
    res.json(restaurants);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const restaurants = await query('SELECT * FROM restaurants WHERE restaurant_id = ?', [req.params.id]);
    if (!restaurants.length) return res.status(404).json({ message: 'Restaurant not found.' });

    const menu = await query('SELECT * FROM food_items WHERE restaurant_id = ? AND is_available = TRUE ORDER BY category, food_name', [req.params.id]);
    res.json({ ...restaurants[0], menu });
  } catch (error) {
    next(error);
  }
});

router.post('/', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const { restaurant_name, address, contact, cuisine = 'Multi Cuisine', image_url } = req.body;
    if (!restaurant_name || !address || !contact) {
      return res.status(400).json({ message: 'Name, address, and contact are required.' });
    }

    const result = await query(
      'INSERT INTO restaurants (restaurant_name, address, contact, cuisine, image_url) VALUES (?, ?, ?, ?, ?)',
      [restaurant_name, address, contact, cuisine, image_url]
    );
    res.status(201).json({ message: 'Restaurant added.', restaurantId: result.insertId });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const fields = ['restaurant_name', 'address', 'contact', 'cuisine', 'rating', 'image_url'];
    const updates = fields.filter((field) => req.body[field] !== undefined);
    if (!updates.length) return res.status(400).json({ message: 'No fields provided for update.' });

    await query(
      `UPDATE restaurants SET ${updates.map((field) => `${field} = ?`).join(', ')} WHERE restaurant_id = ?`,
      [...updates.map((field) => req.body[field]), req.params.id]
    );
    res.json({ message: 'Restaurant updated.' });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', authenticate, requireAdmin, async (req, res, next) => {
  try {
    await query('DELETE FROM restaurants WHERE restaurant_id = ?', [req.params.id]);
    res.json({ message: 'Restaurant deleted.' });
  } catch (error) {
    next(error);
  }
});

export default router;

