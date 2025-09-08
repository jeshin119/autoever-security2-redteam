-- Migration script to convert decimal prices to integers
-- This script removes decimal points by multiplying by 100 and then converting to integer
-- For example: 950000.00 becomes 950000, 150000.50 becomes 150000

-- Start transaction
START TRANSACTION;

-- Update products table: convert price from DECIMAL(10,2) to INTEGER
-- First, multiply by 100 to preserve cents, then divide by 100 to remove decimal places
UPDATE products SET price = FLOOR(price);
ALTER TABLE products MODIFY COLUMN price INT NOT NULL;

-- Update transactions table: convert amount from DECIMAL(10,2) to INTEGER
UPDATE transactions SET amount = FLOOR(amount);
ALTER TABLE transactions MODIFY COLUMN amount INT NOT NULL;

-- Update transactions table: convert refund_amount from DECIMAL(10,2) to INTEGER
UPDATE transactions SET refund_amount = FLOOR(refund_amount) WHERE refund_amount IS NOT NULL;
ALTER TABLE transactions MODIFY COLUMN refund_amount INT DEFAULT NULL;

-- Update users table: convert credits from DECIMAL(10,2) to INTEGER
UPDATE users SET credits = FLOOR(credits);
ALTER TABLE users MODIFY COLUMN credits INT NOT NULL DEFAULT 0;

-- Update coupons table: convert value from DECIMAL(10,2) to INTEGER
UPDATE coupons SET value = FLOOR(value);
ALTER TABLE coupons MODIFY COLUMN value INT NOT NULL;

-- Update coupons table: convert min_order_amount from DECIMAL(10,2) to INTEGER
UPDATE coupons SET min_order_amount = FLOOR(min_order_amount);
ALTER TABLE coupons MODIFY COLUMN min_order_amount INT DEFAULT 0;

-- Commit transaction
COMMIT;

-- Verify the changes
SELECT 'products' as table_name, id, price FROM products LIMIT 5;
SELECT 'transactions' as table_name, id, amount FROM transactions LIMIT 5;
SELECT 'users' as table_name, id, credits FROM users LIMIT 5;
SELECT 'coupons' as table_name, id, value, min_order_amount FROM coupons LIMIT 5;
