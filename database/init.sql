CREATE DATABASE IF NOT EXISTS vintagemarket CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 기존 사용자 삭제 (있다면)
DROP USER IF EXISTS 'vintage_user'@'localhost';
DROP USER IF EXISTS 'vintage_user'@'%';

-- 사용자 생성 및 권한 설정 (모든 호스트에서 접근 허용)
CREATE USER 'vintage_user'@'%' IDENTIFIED BY 'vintage_password';
GRANT ALL PRIVILEGES ON vintagemarket.* TO 'vintage_user'@'%';
GRANT ALL PRIVILEGES ON vintagemarket.* TO 'vintage_user'@'localhost';
FLUSH PRIVILEGES;