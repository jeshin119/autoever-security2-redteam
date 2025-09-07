-- MySQL 초기화 스크립트
-- 데이터베이스 생성
CREATE DATABASE IF NOT EXISTS vintagemarket CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 기존 사용자 정리 (안전하게)
DROP USER IF EXISTS 'vintage_user'@'localhost';
DROP USER IF EXISTS 'vintage_user'@'%';

-- 사용자 생성 (모든 호스트에서 접근 허용)
CREATE USER 'vintage_user'@'%' IDENTIFIED BY 'vintage_password';

-- 권한 부여
GRANT ALL PRIVILEGES ON vintagemarket.* TO 'vintage_user'@'%';
GRANT ALL PRIVILEGES ON vintagemarket.* TO 'vintage_user'@'localhost';

-- 권한 적용
FLUSH PRIVILEGES;

-- 사용자 생성 확인
SELECT User, Host FROM mysql.user WHERE User='vintage_user';