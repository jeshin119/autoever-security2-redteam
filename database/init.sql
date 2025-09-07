CREATE DATABASE IF NOT EXISTS vintagemarket CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 사용자 생성 및 권한 설정
CREATE USER IF NOT EXISTS 'vintage_user'@'%' IDENTIFIED BY 'vintage_password';
GRANT ALL PRIVILEGES ON vintagemarket.* TO 'vintage_user'@'%';
FLUSH PRIVILEGES;