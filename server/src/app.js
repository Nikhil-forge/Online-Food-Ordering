import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import restaurantRoutes from './routes/restaurants.routes.js';
import foodRoutes from './routes/foods.routes.js';
import cartRoutes from './routes/cart.routes.js';
import orderRoutes from './routes/orders.routes.js';
import nutritionRoutes from './routes/nutrition.routes.js';
import recommendationRoutes from './routes/recommendation.routes.js';
import adminRoutes from './routes/admin.routes.js';
import { cleanDatabase } from './utils/clean-db.js';

dotenv.config();

// Run DB cleanup immediately on startup to fix any duplicates
cleanDatabase();

const app = express();

const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:5180'
].filter(Boolean);

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

app.get('/api/health', (_req, res) => res.json({ status: 'ok', service: 'food-nutrition-api' }));
app.use('/api/auth', authRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/foods', foodRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/nutrition', nutritionRoutes);
app.use('/api/recommendation', recommendationRoutes);
app.use('/api/admin', adminRoutes);

app.use((req, res) => res.status(404).json({ message: 'API route not found.' }));
app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ message: 'Server error.', detail: process.env.NODE_ENV === 'production' ? undefined : error.message });
});

export default app;
