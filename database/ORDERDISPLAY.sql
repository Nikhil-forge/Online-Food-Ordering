USE onlineorder;

SELECT 
    o.order_id,
    u.name AS customer_name,
    r.restaurant_name,
    f.food_name,
    oi.quantity,
    oi.subtotal,
    o.total_amount,
    o.order_status,
    o.payment_status,
    o.created_at
FROM orders o
JOIN users u 
    ON u.user_id = o.user_id
JOIN order_items oi 
    ON oi.order_id = o.order_id
JOIN food_items f 
    ON f.food_id = oi.food_id
JOIN restaurants r 
    ON r.restaurant_id = f.restaurant_id
ORDER BY o.created_at DESC;