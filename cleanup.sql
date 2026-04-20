USE klyro_db;

-- 1. CLEANUP (order of deletion matters)
DELETE FROM order_items;
DELETE FROM orders;
DELETE FROM cart_items;
DELETE FROM cart;
DELETE FROM products;
DELETE FROM categories;

-- 2. RESET AUTO-INCREMENT
ALTER TABLE products AUTO_INCREMENT = 1;
ALTER TABLE categories AUTO_INCREMENT = 1;

-- 3. VERIFICATION
SELECT 'products' as table_name, COUNT(*) as count FROM products
UNION
SELECT 'categories' as table_name, COUNT(*) as count FROM categories
UNION
SELECT 'orders' as table_name, COUNT(*) as count FROM orders
UNION
SELECT 'cart' as table_name, COUNT(*) as count FROM cart;
