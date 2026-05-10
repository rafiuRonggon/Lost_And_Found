-- Lost & Found University Portal Database Setup
-- Run this SQL script to create the database and tables

CREATE DATABASE IF NOT EXISTS lost_and_found;
USE lost_and_found;

-- Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    join_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_admin BOOLEAN DEFAULT FALSE
);

-- Items table
CREATE TABLE items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255) NOT NULL,
    status ENUM('lost', 'found', 'claimed') NOT NULL DEFAULT 'lost',
    posted_by INT NOT NULL,
    date_posted DATETIME DEFAULT CURRENT_TIMESTAMP,
    image_emoji VARCHAR(10) DEFAULT '📦',
    FOREIGN KEY (posted_by) REFERENCES users(id) ON DELETE CASCADE
);

-- Claims table
CREATE TABLE claims (
    claim_id INT AUTO_INCREMENT PRIMARY KEY,
    claimer_id INT NOT NULL,
    item_id INT NOT NULL,
    claim_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (claimer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE,
    UNIQUE KEY unique_claim (claimer_id, item_id) -- Prevent duplicate claims
);

-- Notifications table (optional, but useful)
CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert demo data
INSERT INTO users (name, email, password, is_admin) VALUES
('Admin User', 'admin@uni.edu', '$2y$10$hashedpassword', TRUE),
('Sarah Lee', 'sarah@uni.edu', '$2y$10$hashedpassword', FALSE),
('Rahul Kumar', 'rahul@uni.edu', '$2y$10$hashedpassword', FALSE);

-- Note: Passwords should be hashed. Use password_hash() in PHP.
-- For demo, use pre-hashed 'password' with bcrypt.