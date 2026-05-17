import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { query } from '../config/db.js';

const router = express.Router();

router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Name, email, and password are required.' });
    if (!email.includes('@')) return res.status(400).json({ message: 'Enter a valid email address.' });
    if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters.' });

    const existing = await query('SELECT user_id FROM users WHERE email = ?', [email]);
    if (existing.length) return res.status(409).json({ message: 'Email already registered.' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword]);
    res.status(201).json({ message: 'Registration successful.', userId: result.insertId });
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required.' });

    const users = await query('SELECT user_id, name, email, password, role FROM users WHERE email = ?', [email]);
    const user = users[0];
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const payload = { userId: user.user_id, name: user.name, email: user.email, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'dev_secret', { expiresIn: process.env.JWT_EXPIRES_IN || '1d' });
    res.json({ token, user: payload });
  } catch (error) {
    next(error);
  }
});

export default router;
