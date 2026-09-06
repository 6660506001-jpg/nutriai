-- NutriAI — schema สำหรับ MySQL บน cloud (Railway / PlanetScale ฯลฯ)
-- รันใน MySQL client หรือ Railway Query tab หลังสร้าง database

CREATE DATABASE IF NOT EXISTS nutrition_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE nutrition_db;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(64) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  gender VARCHAR(16) NOT NULL,
  age INT NOT NULL,
  weight DECIMAL(6, 2) NOT NULL,
  height DECIMAL(6, 2) NOT NULL,
  activity_level VARCHAR(32) DEFAULT 'Sedentary',
  bmr DECIMAL(8, 2) NULL,
  tdee DECIMAL(8, 2) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS foods (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  calories DECIMAL(8, 2) DEFAULT 0,
  protein DECIMAL(8, 2) DEFAULT 0,
  carbs DECIMAL(8, 2) DEFAULT 0,
  fat DECIMAL(8, 2) DEFAULT 0,
  gi_index INT DEFAULT 50,
  INDEX idx_foods_name (name)
);

CREATE TABLE IF NOT EXISTS activities (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  calories DECIMAL(8, 2) DEFAULT 0,
  INDEX idx_activities_name (name)
);

-- ข้อมูลกิจกรรมตัวอย่าง (ถ้า DB ว่าง แอปยังมี fallback ใน backend)
INSERT IGNORE INTO activities (id, name, calories) VALUES
  (1, 'วิ่ง', 300),
  (2, 'เดิน', 120),
  (3, 'ว่ายน้ำ', 260),
  (4, 'ปั่นจักรยาน', 220),
  (5, 'โยคะ', 100),
  (6, 'ยกน้ำหนัก', 180);
