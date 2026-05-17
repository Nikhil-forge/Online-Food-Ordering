import express from 'express';
import { pool, query } from '../config/db.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticate);

router.post('/', async (req, res, next) => {
  const connection = await pool.getConnection();
  try {
    const { deliveryAddress = '' } = req.body;
    await connection.beginTransaction();

    const [cartItems] = await connection.execute(
      `SELECT c.food_id, c.quantity, f.price, f.calories, f.protein, f.carbohydrates, f.fats
       FROM cart c JOIN food_items f ON f.food_id = c.food_id
       WHERE c.user_id = ?`,
      [req.user.userId]
    );
    if (!cartItems.length) {
      await connection.rollback();
      return res.status(400).json({ message: 'Cart is empty.' });
    }

    const total = cartItems.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
    const [orderResult] = await connection.execute(
      'INSERT INTO orders (user_id, total_amount, delivery_address) VALUES (?, ?, ?)',
      [req.user.userId, total, deliveryAddress]
    );

    for (const item of cartItems) {
      await connection.execute(
        `INSERT INTO order_items
         (order_id, food_id, quantity, subtotal, calories, protein, carbohydrates, fats)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          orderResult.insertId,
          item.food_id,
          item.quantity,
          Number(item.price) * item.quantity,
          item.calories * item.quantity,
          item.protein * item.quantity,
          item.carbohydrates * item.quantity,
          item.fats * item.quantity
        ]
      );
    }

    await connection.execute('DELETE FROM cart WHERE user_id = ?', [req.user.userId]);
    await connection.commit();
    res.status(201).json({ message: 'Order placed successfully.', orderId: orderResult.insertId, total });
  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
});

router.get('/', async (req, res, next) => {
  try {
    const isAdmin = req.user.role === 'admin';
    const orders = await query(
      `SELECT o.*, u.name AS customer_name,
        COALESCE(SUM(oi.calories), 0) AS total_calories,
        COALESCE(SUM(oi.protein), 0) AS total_protein,
        COALESCE(SUM(oi.carbohydrates), 0) AS total_carbohydrates,
        COALESCE(SUM(oi.fats), 0) AS total_fats
       FROM orders o
       JOIN users u ON u.user_id = o.user_id
       LEFT JOIN order_items oi ON oi.order_id = o.order_id
       ${isAdmin ? '' : 'WHERE o.user_id = ?'}
       GROUP BY o.order_id, o.user_id, o.total_amount, o.order_status, o.payment_status, o.delivery_address, o.created_at, u.name
       ORDER BY o.created_at DESC`,
      isAdmin ? [] : [req.user.userId]
    );
    res.json(orders);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const orders = await query(
      `SELECT * FROM orders WHERE order_id = ? ${req.user.role === 'admin' ? '' : 'AND user_id = ?'}`,
      req.user.role === 'admin' ? [req.params.id] : [req.params.id, req.user.userId]
    );
    if (!orders.length) return res.status(404).json({ message: 'Order not found.' });

    const items = await query(
      `SELECT oi.*, f.food_name, f.category FROM order_items oi
       JOIN food_items f ON f.food_id = oi.food_id
       WHERE oi.order_id = ?`,
      [req.params.id]
    );
    res.json({ ...orders[0], items });
  } catch (error) {
    next(error);
  }
});

router.patch('/:id/status', requireAdmin, async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['Pending', 'Preparing', 'Delivered'].includes(status)) {
      return res.status(400).json({ message: 'Status must be Pending, Preparing, or Delivered.' });
    }
    await query('UPDATE orders SET order_status = ? WHERE order_id = ?', [status, req.params.id]);
    res.json({ message: 'Order status updated.' });
  } catch (error) {
    next(error);
  }
});

export default router;
