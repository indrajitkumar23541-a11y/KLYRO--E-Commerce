-- Add coupons table for marketing and promotions
CREATE TABLE IF NOT EXISTS coupons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    discount_type ENUM('percentage', 'fixed') NOT NULL,
    discount_value DECIMAL(10, 2) NOT NULL,
    min_purchase DECIMAL(10, 2) DEFAULT 0.00,
    max_discount DECIMAL(10, 2) NULL,
    expiry_date DATE NOT NULL,
    seller_id INT NOT NULL,
    usage_limit INT DEFAULT NULL,
    usage_count INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX(code),
    INDEX(seller_id)
);

-- Add coupon_id to orders table for tracking
ALTER TABLE orders ADD COLUMN coupon_id INT NULL AFTER total_price;
ALTER TABLE orders ADD FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE SET NULL;
