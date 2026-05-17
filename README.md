# AI-Based Online Food Ordering System with Calorie & Nutrition Analyzer

Full-stack mini project using React, Tailwind CSS, Node.js, Express.js, and MySQL.

## Features

- User registration and login with bcrypt + JWT
- Restaurant and menu browsing
- Search/filter food items
- Cart, checkout, order history, and order status
- Nutrition analysis with calories, protein, carbs, fats, fiber, and sugar
- Health recommendation logic
- Admin APIs and admin dashboard UI for restaurants, foods, and orders

## Setup

1. Create a MySQL database:

```sql
CREATE DATABASE food_nutrition_system;
```

2. Import the schema and sample data:

```bash
mysql -u root -p food_nutrition_system < database/schema.sql
mysql -u root -p food_nutrition_system < database/seed.sql
```

3. Configure backend environment:

```bash
copy server\.env.example server\.env
```

Update `server/.env` with your MySQL username/password.

4. Install dependencies:

```bash
npm.cmd install --prefix server
npm.cmd install --prefix client
```

5. Run the project:

```bash
npm.cmd run dev:server
npm.cmd run dev:client
```

Frontend: `http://localhost:5173`
Backend: `http://localhost:5000`

## Demo Accounts

- User: `student@example.com` / `password123`
- Admin: `admin@example.com` / `admin123`

## Note

Nutrition recommendations are rule-based and educational. They are not medical advice.
