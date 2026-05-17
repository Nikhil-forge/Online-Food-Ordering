import express from 'express';
import { query } from '../config/db.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticate, requireAdmin);

router.get('/summary', async (_req, res, next) => {
  try {
    const [users] = await query('SELECT COUNT(*) AS count FROM users');
    const [restaurants] = await query('SELECT COUNT(*) AS count FROM restaurants');
    const [foods] = await query('SELECT COUNT(*) AS count FROM food_items');
    const [orders] = await query('SELECT COUNT(*) AS count, COALESCE(SUM(total_amount), 0) AS revenue FROM orders');
    res.json({
      users: users.count,
      restaurants: restaurants.count,
      foods: foods.count,
      orders: orders.count,
      revenue: orders.revenue
    });
  } catch (error) {
    next(error);
  }
});

router.get('/users', async (_req, res, next) => {
  try {
    const users = await query('SELECT user_id, name, email, role, created_at FROM users ORDER BY created_at DESC');
    res.json(users);
  } catch (error) {
    next(error);
  }
});

router.post('/restaurants', async (req, res, next) => {
  try {
    const { restaurant_name, address, contact, cuisine = 'Multi Cuisine', rating = 4.0 } = req.body;
    if (!restaurant_name || !address || !contact) return res.status(400).json({ message: 'Restaurant name, address, and contact are required.' });
    const result = await query(
      'INSERT INTO restaurants (restaurant_name, address, contact, cuisine, rating) VALUES (?, ?, ?, ?, ?)',
      [restaurant_name, address, contact, cuisine, rating]
    );
    res.status(201).json({ message: 'Restaurant added.', restaurantId: result.insertId });
  } catch (error) {
    next(error);
  }
});

export default router;
