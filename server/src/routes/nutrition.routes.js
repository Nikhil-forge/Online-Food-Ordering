import express from 'express';
import { query } from '../config/db.js';

const router = express.Router();

router.get('/:foodId', async (req, res, next) => {
  try {
    const foods = await query('SELECT * FROM food_items WHERE food_id = ?', [req.params.foodId]);
    if (!foods.length) return res.status(404).json({ message: 'Food item not found.' });
    res.json(foods[0]);
  } catch (error) {
    next(error);
  }
});

export default router;
