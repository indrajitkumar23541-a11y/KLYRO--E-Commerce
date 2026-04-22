-- Expand products table for Amazon-Style Suite (Robust)
SET @dbname = DATABASE();
SET @tablename = "products";

-- Add stock_quantity if not exists
SET @columnname = "stock_quantity";
SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND COLUMN_NAME = @columnname) > 0,
  "SELECT 1",
  "ALTER TABLE products ADD COLUMN stock_quantity INT DEFAULT 0 AFTER price"
));
PREPARE stmt FROM @preparedStatement;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add discount_price if not exists
SET @columnname = "discount_price";
SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND COLUMN_NAME = @columnname) > 0,
  "SELECT 2",
  "ALTER TABLE products ADD COLUMN discount_price DECIMAL(10, 2) NULL AFTER price"
));
PREPARE stmt FROM @preparedStatement;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add status if not exists
SET @columnname = "status";
SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND COLUMN_NAME = @columnname) > 0,
  "SELECT 3",
  "ALTER TABLE products ADD COLUMN status ENUM('active', 'inactive', 'draft') DEFAULT 'active' AFTER description"
));
PREPARE stmt FROM @preparedStatement;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Update existing products with dummy SKUs and stock if null/zero
UPDATE products SET sku = CONCAT('SKU-', id) WHERE sku IS NULL;
UPDATE products SET stock_quantity = 50 WHERE stock_quantity = 0;

-- Create product_variants table if not exists
CREATE TABLE IF NOT EXISTS product_variants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    variant_type ENUM('size', 'color', 'material', 'style') NOT NULL,
    variant_value VARCHAR(100) NOT NULL,
    additional_price DECIMAL(10, 2) DEFAULT 0.00,
    stock_quantity INT DEFAULT 0,
    sku VARCHAR(100) UNIQUE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);
