CREATE DATABASE IF NOT EXISTS muslim_daily CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE muslim_daily;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  avatar_url VARCHAR(255),
  city VARCHAR(120) DEFAULT 'Jakarta',
  country VARCHAR(120) DEFAULT 'Indonesia',
  latitude DECIMAL(10, 7) DEFAULT -6.2000000,
  longitude DECIMAL(10, 7) DEFAULT 106.8166660,
  calculation_method INT DEFAULT 20,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS prayer_reminders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  prayer_name VARCHAR(30) NOT NULL,
  enabled BOOLEAN DEFAULT TRUE,
  sound VARCHAR(40) DEFAULT 'Adhan',
  UNIQUE KEY unique_user_prayer (user_id, prayer_name),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS daily_motivations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  quote TEXT NOT NULL,
  source VARCHAR(160) NOT NULL
);

CREATE TABLE IF NOT EXISTS sunnah_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  activity VARCHAR(80) NOT NULL,
  log_date DATE NOT NULL,
  UNIQUE KEY unique_sunnah_log (user_id, activity, log_date),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS quran_progress (
  user_id INT PRIMARY KEY,
  target_pages INT DEFAULT 604,
  pages_read INT DEFAULT 0,
  last_surah VARCHAR(120) DEFAULT 'Al-Fatihah',
  last_ayah INT DEFAULT 1,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS charity_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  note VARCHAR(255),
  log_date DATE NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS ummah_posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

INSERT INTO daily_motivations (quote, source)
SELECT 'Verily, with hardship comes ease.', 'Surah Ash-Sharh 94:5'
WHERE NOT EXISTS (SELECT 1 FROM daily_motivations);

INSERT INTO daily_motivations (quote, source)
SELECT 'The most beloved deeds to Allah are those done consistently, even if small.', 'Sahih Bukhari'
WHERE (SELECT COUNT(*) FROM daily_motivations) < 2;

INSERT INTO users (full_name, email, password_hash)
SELECT 'Ahmad', 'admin@mail.com', '$2b$10$ywk7VxbK.pBHnN4oxJBTRu68ucXtGa4FKNikXxAZyzQN42J/z.jyi'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@mail.com');
