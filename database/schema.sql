CREATE DATABASE IF NOT EXISTS onlineorder;
use onlineorder;
CREATE TABLE IF NOT EXISTS users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS restaurants (
  restaurant_id INT AUTO_INCREMENT PRIMARY KEY,
  restaurant_name VARCHAR(150) NOT NULL,
  address VARCHAR(255) NOT NULL,
  contact VARCHAR(30) NOT NULL,
  cuisine VARCHAR(80) DEFAULT 'Multi Cuisine',
  rating DECIMAL(2,1) DEFAULT 4.0,
  image_url VARCHAR(500)
);

CREATE TABLE IF NOT EXISTS food_items (
  food_id INT AUTO_INCREMENT PRIMARY KEY,
  restaurant_id INT NOT NULL,
  food_name VARCHAR(150) NOT NULL,
  category VARCHAR(80) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  image_url VARCHAR(500),
  calories INT NOT NULL,
  protein FLOAT NOT NULL,
  carbohydrates FLOAT NOT NULL,
  fats FLOAT NOT NULL,
  fiber FLOAT DEFAULT 0,
  sugar FLOAT DEFAULT 0,
  vitamins VARCHAR(255),
  minerals VARCHAR(255),
  is_available BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(restaurant_id) ON DELETE CASCADE,
  UNIQUE KEY unique_restaurant_food (restaurant_id, food_name),
  INDEX idx_food_search (food_name, category),
  INDEX idx_food_restaurant (restaurant_id)
);

CREATE TABLE IF NOT EXISTS cart (
  cart_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  food_id INT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_user_food (user_id, food_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (food_id) REFERENCES food_items(food_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS orders (
  order_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  order_status ENUM('Pending', 'Preparing', 'Delivered') NOT NULL DEFAULT 'Pending',
  payment_status ENUM('Pending', 'Paid') NOT NULL DEFAULT 'Pending',
  delivery_address VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  INDEX idx_orders_user (user_id),
  INDEX idx_orders_status (order_status)
);

CREATE TABLE IF NOT EXISTS order_items (
  order_item_id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  food_id INT NOT NULL,
  quantity INT NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  calories INT NOT NULL,
  protein FLOAT NOT NULL,
  carbohydrates FLOAT NOT NULL,
  fats FLOAT NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
  FOREIGN KEY (food_id) REFERENCES food_items(food_id)
);
