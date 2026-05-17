import express from 'express';
import { query } from '../config/db.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticate);

router.get('/', async (req, res, next) => {
  try {
    const items = await query(
      `SELECT c.cart_id, c.quantity, f.*, r.restaurant_name, (c.quantity * f.price) AS subtotal
       FROM cart c
       JOIN food_items f ON f.food_id = c.food_id
       JOIN restaurants r ON r.restaurant_id = f.restaurant_id
       WHERE c.user_id = ?
       ORDER BY c.updated_at DESC`,
      [req.user.userId]
    );
    const total = items.reduce((sum, item) => sum + Number(item.subtotal), 0);
    res.json({ items, total });
  } catch (error) {
    next(error);
  }
});

router.post('/add', async (req, res, next) => {
  try {
    const { foodId, quantity = 1 } = req.body;
    if (!foodId || Number(quantity) <= 0) return res.status(400).json({ message: 'Food item and positive quantity are required.' });

    await query(
      `INSERT INTO cart (user_id, food_id, quantity)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)`,
      [req.user.userId, foodId, quantity]
    );
    res.status(201).json({ message: 'Item added to cart.' });
  } catch (error) {
    next(error);
  }
});

router.patch('/:cartId', async (req, res, next) => {
  try {
    const { quantity } = req.body;
    if (Number(quantity) <= 0) return res.status(400).json({ message: 'Quantity must be greater than 0.' });
    await query('UPDATE cart SET quantity = ? WHERE cart_id = ? AND user_id = ?', [quantity, req.params.cartId, req.user.userId]);
    res.json({ message: 'Cart quantity updated.' });
  } catch (error) {
    next(error);
  }
});

router.delete('/remove/:id', async (req, res, next) => {
  try {
    await query('DELETE FROM cart WHERE cart_id = ? AND user_id = ?', [req.params.id, req.user.userId]);
    res.json({ message: 'Item removed from cart.' });
  } catch (error) {
    next(error);
  }
});

export default router;
