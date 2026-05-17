INSERT INTO users (name, email, password, role) VALUES
('Demo Student', 'student@example.com', '$2b$10$GZPoclAdFQmzLSdFCDZRfejXWmUsZS54PLalzqzEwV7vBMknnNS4i', 'user'),
('Admin User', 'admin@example.com', '$2b$10$XHS63fmm4KOebwEbHZozF.DD9YRq5Cr36J2aUmGCb0HQpDqsqTIyC', 'admin')
ON DUPLICATE KEY UPDATE email = VALUES(email);

INSERT INTO restaurants (restaurant_id, restaurant_name, address, contact, cuisine, rating) VALUES
(1, 'Green Bowl Cafe', '12 College Road', '9876543210', 'Healthy', 4.7),
(2, 'Spice Junction', '45 Market Street', '9876501234', 'Indian', 4.4),
(3, 'Urban Bites', '8 Tech Park Avenue', '9876512345', 'Fast Food', 4.2)
ON DUPLICATE KEY UPDATE restaurant_name = VALUES(restaurant_name);

INSERT INTO food_items
(restaurant_id, food_name, category, price, image_url, calories, protein, carbohydrates, fats, fiber, sugar, vitamins, minerals) VALUES
(1, 'Grilled Paneer Salad', 'Healthy', 160.00, 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=900&q=80', 280, 18, 22, 12, 7, 5, 'A, C, B12', 'Calcium, Iron'),
(1, 'Quinoa Veg Bowl', 'Healthy', 190.00, 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80', 340, 14, 48, 9, 9, 4, 'A, C, K', 'Magnesium, Iron'),
(1, 'Grilled Chicken Sandwich', 'Protein', 210.00, 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=900&q=80', 360, 31, 34, 10, 5, 3, 'B6, B12', 'Zinc, Iron'),
(2, 'Chicken Biryani', 'Rice', 240.00, 'https://images.unsplash.com/photo-1563379091339-03246963d7d9?auto=format&fit=crop&w=900&q=80', 620, 28, 72, 22, 4, 6, 'B6', 'Iron, Potassium'),
(2, 'Paneer Butter Masala', 'Curry', 220.00, 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=900&q=80', 520, 20, 28, 34, 3, 8, 'A, B12', 'Calcium'),
(2, 'Dal Tadka with Rice', 'Combo', 150.00, 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=900&q=80', 430, 17, 66, 10, 8, 3, 'B1, B9', 'Iron, Magnesium'),
(3, 'Chicken Burger', 'Fast Food', 180.00, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80', 450, 25, 40, 18, 4, 7, 'B6', 'Iron'),
(3, 'Cheese Pizza Slice', 'Fast Food', 140.00, 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=900&q=80', 310, 13, 34, 14, 2, 4, 'A, B12', 'Calcium'),
(3, 'Veg Wrap', 'Snack', 130.00, 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=900&q=80', 290, 11, 42, 8, 6, 5, 'A, C', 'Iron')
ON DUPLICATE KEY UPDATE food_name = VALUES(food_name);

USE FoodOrder;

SELECT * FROM orders;
USE FoodOrder;

SELECT 
    o.order_id,
    u.name AS customer_name,
    o.total_amount,
    o.order_status,
    o.payment_status,
    o.delivery_address,
    o.created_at
FROM orders o
JOIN users u ON o.user_id = u.user_id
ORDER BY o.created_at DESC;

select * from users ;
