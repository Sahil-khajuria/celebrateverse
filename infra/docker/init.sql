-- CelebrateVerse MySQL Database Initialization Script
-- Automatically run by Docker MySQL entrypoint container on first initialization

CREATE DATABASE IF NOT EXISTS celebrateverse CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'cvuser'@'%' IDENTIFIED BY 'cvpassword';
GRANT ALL PRIVILEGES ON celebrateverse.* TO 'cvuser'@'%';

FLUSH PRIVILEGES;
