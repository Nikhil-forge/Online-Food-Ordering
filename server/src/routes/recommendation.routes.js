import express from 'express';
import { query } from '../config/db.js';
import { buildRecommendation } from '../utils/recommendation.js';

const router = express.Router();

router.get('/:foodId', async (req, res, next) => {
  try {
    const foods = await query('SELECT * FROM food_items WHERE food_id = ?', [req.params.foodId]);
    if (!foods.length) return res.status(404).json({ message: 'Food item not found.' });

    const food = foods[0];
    const alternatives = await query(
      `SELECT * FROM food_items
       WHERE food_id <> ? AND calories <= ? AND fats <= ? AND protein >= ?
       ORDER BY calories ASC, protein DESC
       LIMIT 3`,
      [food.food_id, food.calories, food.fats, Math.max(0, food.protein - 8)]
    );

    res.json(buildRecommendation(food, alternatives));
  } catch (error) {
    next(error);
  }
});

export default router;
