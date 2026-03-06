CREATE DATABASE IF NOT EXISTS securepay;

USE securepay;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE transfers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  from_user INT,
  to_user INT,
  amount DECIMAL(10,2),
  FOREIGN KEY (from_user) REFERENCES users(id),
  FOREIGN KEY (to_user) REFERENCES users(id)
);