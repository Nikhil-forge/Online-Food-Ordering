import express from 'express';
import { query } from '../config/db.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const { search = '', category = '', restaurantId = '' } = req.query;
    const params = [];
    const filters = ['f.is_available = TRUE'];

    if (search) {
      filters.push('(f.food_name LIKE ? OR f.category LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
    }
    if (category) {
      filters.push('f.category = ?');
      params.push(category);
    }
    if (restaurantId) {
      filters.push('f.restaurant_id = ?');
      params.push(restaurantId);
    }

    const foods = await query(
      `SELECT f.*, r.restaurant_name FROM food_items f
       JOIN restaurants r ON r.restaurant_id = f.restaurant_id
       WHERE ${filters.join(' AND ')}
       ORDER BY f.food_name ASC`,
      params
    );
    res.json(foods);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const foods = await query(
      `SELECT f.*, r.restaurant_name FROM food_items f
       JOIN restaurants r ON r.restaurant_id = f.restaurant_id
       WHERE f.food_id = ?`,
      [req.params.id]
    );
    if (!foods.length) return res.status(404).json({ message: 'Food item not found.' });
    res.json(foods[0]);
  } catch (error) {
    next(error);
  }
});

router.post('/', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const {
      restaurant_id, food_name, category, price, image_url = '', calories, protein,
      carbohydrates, fats, fiber = 0, sugar = 0, vitamins = '', minerals = ''
    } = req.body;
    if (!restaurant_id || !food_name || !category || Number(price) <= 0) {
      return res.status(400).json({ message: 'Restaurant, food name, category, and positive price are required.' });
    }

    const result = await query(
      `INSERT INTO food_items
       (restaurant_id, food_name, category, price, image_url, calories, protein, carbohydrates, fats, fiber, sugar, vitamins, minerals)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [restaurant_id, food_name, category, price, image_url, calories, protein, carbohydrates, fats, fiber, sugar, vitamins, minerals]
    );
    res.status(201).json({ message: 'Food item added.', foodId: result.insertId });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const fields = ['food_name', 'category', 'price', 'calories', 'protein', 'carbohydrates', 'fats', 'fiber', 'sugar', 'is_available'];
    const updates = fields.filter((field) => req.body[field] !== undefined);
    if (!updates.length) return res.status(400).json({ message: 'No fields provided for update.' });

    await query(
      `UPDATE food_items SET ${updates.map((field) => `${field} = ?`).join(', ')} WHERE food_id = ?`,
      [...updates.map((field) => req.body[field]), req.params.id]
    );
    res.json({ message: 'Food item updated.' });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', authenticate, requireAdmin, async (req, res, next) => {
  try {
    await query('DELETE FROM food_items WHERE food_id = ?', [req.params.id]);
    res.json({ message: 'Food item deleted.' });
  } catch (error) {
    next(error);
  }
});

export default router;
