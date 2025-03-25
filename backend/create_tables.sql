CREATE DATABASE IF NOT EXISTS aluMarketplace;
USE aluMarketplace;

-- Users Table DONE
CREATE TABLE IF NOT EXISTS users (
    id INT UNSIGNED AUTO_INCREMENT NOT NULL,  -- Added AUTO_INCREMENT
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    telephone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

-- User Address Table
CREATE TABLE IF NOT EXISTS user_address (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,  -- Ensure it matches users.id
    address TEXT NOT NULL,
    city VARCHAR(100),
    telephone VARCHAR(20)
);
-- User Payment Table
CREATE TABLE IF NOT EXISTS user_payment (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED,
    payment_type VARCHAR(50),
    provider VARCHAR(100),
    account_number VARCHAR(50)
);

-- Admin Type Table DONE
CREATE TABLE IF NOT EXISTS admin_type (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    admin_type VARCHAR(100) NOT NULL,
    permissions TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Admin User Table
CREATE TABLE IF NOT EXISTS admin_user (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    type_id INT UNSIGNED,
    last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Product Category Table DONE
CREATE TABLE IF NOT EXISTS product_category (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

-- Product Inventory Table DONE
CREATE TABLE IF NOT EXISTS product_inventory (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    quantity INT NOT NULL CHECK (quantity >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

-- Product Table
CREATE TABLE IF NOT EXISTS product (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    SKU VARCHAR(50) UNIQUE,
    category_id INT UNSIGNED,
    inventory_id INT UNSIGNED,
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

-- Shopping Session Table
CREATE TABLE IF NOT EXISTS shopping_session (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED,
    total DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Cart Item Table
CREATE TABLE IF NOT EXISTS cart_item (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    session_id INT UNSIGNED,
    product_id INT UNSIGNED,
    quantity INT NOT NULL CHECK (quantity > 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
-- Order Details Table
CREATE TABLE IF NOT EXISTS order_details (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED,
    total DECIMAL(10,2) NOT NULL CHECK (total >= 0),
    payment_id INT UNSIGNED NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_id INT UNSIGNED,
    product_id INT UNSIGNED,
    quantity INT NOT NULL CHECK (quantity > 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Payment Details Table
CREATE TABLE IF NOT EXISTS payment_details (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_id INT UNSIGNED,
    amount DECIMAL(10,2) NOT NULL CHECK (amount >= 0),
    provider VARCHAR(100),
    status VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
--  foreign keys to user_address
ALTER TABLE user_address 
ADD CONSTRAINT fk_user_address_user
FOREIGN KEY (user_id) REFERENCES users(id)
ON DELETE CASCADE;

-- foreign keys to user_payment
ALTER TABLE user_payment
ADD CONSTRAINT fk_user_payment_user
FOREIGN KEY (user_id) REFERENCES users(id)
ON DELETE CASCADE;

-- foreign keys to admin_user
ALTER TABLE admin_user
ADD CONSTRAINT fk_admin_user_type
FOREIGN KEY (type_id) REFERENCES admin_type(id)
ON DELETE SET NULL;

-- foreign keys to product
ALTER TABLE product
ADD CONSTRAINT fk_product_category
FOREIGN KEY (category_id) REFERENCES product_category(id)
ON DELETE SET NULL,
ADD CONSTRAINT fk_product_inventory
FOREIGN KEY (inventory_id) REFERENCES product_inventory(id)
ON DELETE SET NULL;

--  foreign keys to shopping_session
ALTER TABLE shopping_session
ADD CONSTRAINT fk_shopping_session_user
FOREIGN KEY (user_id) REFERENCES users(id)
ON DELETE CASCADE;

-- foreign keys to cart_item
ALTER TABLE cart_item
ADD CONSTRAINT fk_cart_item_session
FOREIGN KEY (session_id) REFERENCES shopping_session(id)
ON DELETE CASCADE,
ADD CONSTRAINT fk_cart_item_product
FOREIGN KEY (product_id) REFERENCES product(id)
ON DELETE CASCADE;

--  foreign keys to order_details
ALTER TABLE order_details
ADD CONSTRAINT fk_order_details_user
FOREIGN KEY (user_id) REFERENCES users(id)
ON DELETE SET NULL,
ADD CONSTRAINT fk_order_details_payment
FOREIGN KEY (payment_id) REFERENCES payment_details(id)
ON DELETE RESTRICT;

-- foreign keys to order_items
ALTER TABLE order_items
ADD CONSTRAINT fk_order_items_order
FOREIGN KEY (order_id) REFERENCES order_details(id)
ON DELETE CASCADE,
ADD CONSTRAINT fk_order_items_product
FOREIGN KEY (product_id) REFERENCES product(id)
ON DELETE SET NULL;

--  foreign keys to payment_details
ALTER TABLE payment_details
ADD CONSTRAINT fk_payment_details_order
FOREIGN KEY (order_id) REFERENCES order_details(id)
ON DELETE CASCADE;