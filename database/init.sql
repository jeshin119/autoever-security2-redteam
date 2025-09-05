-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- 호스트: database:3306
-- 생성 시간: 25-09-05 04:45
-- 서버 버전: 8.0.43
-- PHP 버전: 8.4.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- 데이터베이스: `vintage_market`
--

-- --------------------------------------------------------

--
-- 테이블 구조 `admin_logs`
--

CREATE TABLE `admin_logs` (
  `id` int NOT NULL,
  `admin_id` int NOT NULL,
  `action` varchar(100) NOT NULL,
  `target_type` varchar(50) DEFAULT NULL,
  `target_id` int DEFAULT NULL,
  `details` text,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- 테이블 구조 `chat_messages`
--

CREATE TABLE `chat_messages` (
  `id` int NOT NULL,
  `sender_id` int NOT NULL,
  `receiver_id` int NOT NULL,
  `product_id` int DEFAULT NULL,
  `message` text NOT NULL,
  `is_read` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `message_type` enum('text','image','file') DEFAULT 'text'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- 테이블 구조 `comments`
--

CREATE TABLE `comments` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `product_id` int NOT NULL,
  `content` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_html` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- 테이블 구조 `community_comments`
--

CREATE TABLE `community_comments` (
  `id` int NOT NULL,
  `post_id` int NOT NULL,
  `user_id` int NOT NULL,
  `content` text NOT NULL,
  `parent_id` int DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- 테이블의 덤프 데이터 `community_comments`
--

INSERT INTO `community_comments` (`id`, `post_id`, `user_id`, `content`, `parent_id`, `created_at`, `updated_at`) VALUES
(1, 1, 5, '정말 유용한 팁이에요!', NULL, '2025-09-05 04:44:33', '2025-09-05 04:44:33'),
(2, 1, 2, '추천해주셔서 감사합니다.', NULL, '2025-09-05 04:44:33', '2025-09-05 04:44:33'),
(3, 1, 4, '정말 감사합니다!', NULL, '2025-09-05 04:44:33', '2025-09-05 04:44:33'),
(4, 1, 1, '도움이 되었습니다. 감사해요!', NULL, '2025-09-05 04:44:33', '2025-09-05 04:44:33'),
(5, 1, 1, '정말 유용한 팁이에요!', NULL, '2025-09-05 04:44:33', '2025-09-05 04:44:33'),
(6, 1, 4, '한번 가보고 싶네요.', NULL, '2025-09-05 04:44:33', '2025-09-05 04:44:33'),
(7, 1, 4, '정말 맛있나요?', NULL, '2025-09-05 04:44:33', '2025-09-05 04:44:33'),
(8, 1, 1, '가격은 어때요?', NULL, '2025-09-05 04:44:33', '2025-09-05 04:44:33'),
(9, 1, 4, '이런 정보가 정말 필요했어요!', NULL, '2025-09-05 04:44:33', '2025-09-05 04:44:33'),
(10, 1, 4, '정말 유용한 팁이에요!', NULL, '2025-09-05 04:44:33', '2025-09-05 04:44:33'),
(11, 1, 1, '정말 맛있나요?', NULL, '2025-09-05 04:44:33', '2025-09-05 04:44:33'),
(12, 1, 4, '언제 가볼까요?', NULL, '2025-09-05 04:44:33', '2025-09-05 04:44:33'),
(13, 1, 2, '한번 가보고 싶네요.', NULL, '2025-09-05 04:44:33', '2025-09-05 04:44:33'),
(14, 1, 3, '도움이 되었습니다. 감사해요!', NULL, '2025-09-05 04:44:33', '2025-09-05 04:44:33'),
(15, 1, 4, '이런 정보가 정말 필요했어요!', NULL, '2025-09-05 04:44:33', '2025-09-05 04:44:33'),
(16, 2, 5, '정말 좋은 소식이네요!', NULL, '2025-09-05 04:44:33', '2025-09-05 04:44:33'),
(17, 2, 4, '정말 좋은 아이디어네요!', NULL, '2025-09-05 04:44:33', '2025-09-05 04:44:33'),
(18, 2, 5, '정말 감사합니다!', NULL, '2025-09-05 04:44:33', '2025-09-05 04:44:33'),
(19, 2, 5, '가격은 어때요?', NULL, '2025-09-05 04:44:33', '2025-09-05 04:44:33'),
(20, 2, 5, '분위기도 좋나요?', NULL, '2025-09-05 04:44:33', '2025-09-05 04:44:33'),
(21, 3, 3, '저도 비슷한 경험이 있어요.', NULL, '2025-09-05 04:44:33', '2025-09-05 04:44:33'),
(22, 3, 3, '도움이 되었습니다. 감사해요!', NULL, '2025-09-05 04:44:33', '2025-09-05 04:44:33'),
(23, 3, 3, '정말 맛있나요?', NULL, '2025-09-05 04:44:33', '2025-09-05 04:44:33'),
(24, 3, 1, '한번 가보고 싶네요.', NULL, '2025-09-05 04:44:33', '2025-09-05 04:44:33'),
(25, 3, 3, '이런 정보가 정말 필요했어요!', NULL, '2025-09-05 04:44:33', '2025-09-05 04:44:33'),
(26, 3, 3, '정말 좋은 정보네요! 감사합니다.', NULL, '2025-09-05 04:44:33', '2025-09-05 04:44:33'),
(27, 3, 3, '저도 비슷한 경험이 있어요.', NULL, '2025-09-05 04:44:33', '2025-09-05 04:44:33'),
(28, 3, 4, '주차는 가능한가요?', NULL, '2025-09-05 04:44:33', '2025-09-05 04:44:33'),
(29, 3, 3, '한번 가보고 싶네요.', NULL, '2025-09-05 04:44:33', '2025-09-05 04:44:33'),
(30, 3, 3, '분위기도 좋나요?', NULL, '2025-09-05 04:44:33', '2025-09-05 04:44:33'),
(31, 4, 5, '정말 유용한 정보예요!', NULL, '2025-09-05 04:44:33', '2025-09-05 04:44:33'),
(32, 4, 5, '정말 좋은 아이디어네요!', NULL, '2025-09-05 04:44:33', '2025-09-05 04:44:33'),
(33, 4, 2, '정말 맛있나요?', NULL, '2025-09-05 04:44:33', '2025-09-05 04:44:33'),
(34, 4, 3, '추천해주셔서 감사합니다.', NULL, '2025-09-05 04:44:33', '2025-09-05 04:44:33'),
(35, 4, 4, '추천해주셔서 감사합니다.', NULL, '2025-09-05 04:44:33', '2025-09-05 04:44:33'),
(36, 4, 5, '언제 가볼까요?', NULL, '2025-09-05 04:44:33', '2025-09-05 04:44:33'),
(37, 4, 5, '정말 좋은 정보네요! 감사합니다.', NULL, '2025-09-05 04:44:33', '2025-09-05 04:44:33'),
(38, 4, 2, '저도 추천하고 싶은 곳이 있어요.', NULL, '2025-09-05 04:44:33', '2025-09-05 04:44:33'),
(39, 5, 5, '이런 게시글을 기다리고 있었어요.', NULL, '2025-09-05 04:44:33', '2025-09-05 04:44:33'),
(40, 5, 3, '정말 유용한 정보예요!', NULL, '2025-09-05 04:44:33', '2025-09-05 04:44:33'),
(41, 5, 4, '도움이 되었습니다. 감사해요!', NULL, '2025-09-05 04:44:33', '2025-09-05 04:44:33'),
(42, 5, 2, '저도 추천하고 싶은 곳이 있어요.', NULL, '2025-09-05 04:44:33', '2025-09-05 04:44:33'),
(43, 5, 2, '이런 정보가 정말 필요했어요!', NULL, '2025-09-05 04:44:33', '2025-09-05 04:44:33'),
(44, 5, 5, '정말 좋은 아이디어네요!', NULL, '2025-09-05 04:44:33', '2025-09-05 04:44:33'),
(45, 5, 2, '이런 게시글을 기다리고 있었어요.', NULL, '2025-09-05 04:44:33', '2025-09-05 04:44:33'),
(46, 5, 1, '정말 감사합니다!', NULL, '2025-09-05 04:44:33', '2025-09-05 04:44:33'),
(47, 5, 5, '추천해주셔서 감사합니다.', NULL, '2025-09-05 04:44:33', '2025-09-05 04:44:33'),
(48, 5, 1, '주차는 가능한가요?', NULL, '2025-09-05 04:44:33', '2025-09-05 04:44:33'),
(49, 5, 4, '정말 유용한 팁이에요!', NULL, '2025-09-05 04:44:33', '2025-09-05 04:44:33'),
(50, 5, 3, '정말 맛있나요?', NULL, '2025-09-05 04:44:33', '2025-09-05 04:44:33'),
(51, 6, 5, '도움이 되었습니다. 감사해요!', NULL, '2025-09-05 04:44:33', '2025-09-05 04:44:33'),
(52, 6, 1, '한번 시도해보겠어요.', NULL, '2025-09-05 04:44:33', '2025-09-05 04:44:33'),
(53, 6, 2, '도움이 되었습니다. 감사해요!', NULL, '2025-09-05 04:44:33', '2025-09-05 04:44:33'),
(54, 6, 1, '저도 궁금했는데 도움이 되었어요.', NULL, '2025-09-05 04:44:33', '2025-09-05 04:44:33'),
(55, 6, 1, '저도 추천하고 싶은 곳이 있어요.', NULL, '2025-09-05 04:44:33', '2025-09-05 04:44:33'),
(56, 6, 5, '한번 시도해보겠어요.', NULL, '2025-09-05 04:44:33', '2025-09-05 04:44:33'),
(57, 6, 4, '분위기도 좋나요?', NULL, '2025-09-05 04:44:33', '2025-09-05 04:44:33'),
(58, 6, 2, '한번 가보고 싶네요.', NULL, '2025-09-05 04:44:33', '2025-09-05 04:44:33'),
(59, 6, 3, '저도 비슷한 경험이 있어요.', NULL, '2025-09-05 04:44:33', '2025-09-05 04:44:33'),
(60, 6, 3, '한번 시도해보겠어요.', NULL, '2025-09-05 04:44:33', '2025-09-05 04:44:33'),
(61, 6, 2, '저도 비슷한 경험이 있어요.', NULL, '2025-09-05 04:44:33', '2025-09-05 04:44:33'),
(62, 6, 4, '이런 정보가 정말 필요했어요!', NULL, '2025-09-05 04:44:33', '2025-09-05 04:44:33'),
(63, 6, 5, '이런 게시글을 기다리고 있었어요.', NULL, '2025-09-05 04:44:33', '2025-09-05 04:44:33'),
(64, 6, 2, '정말 유용한 팁이에요!', NULL, '2025-09-05 04:44:33', '2025-09-05 04:44:33'),
(65, 6, 3, '분위기도 좋나요?', NULL, '2025-09-05 04:44:33', '2025-09-05 04:44:33'),
(66, 7, 4, '한번 가보고 싶네요.', NULL, '2025-09-05 04:44:33', '2025-09-05 04:44:33'),
(67, 7, 2, '가격은 어때요?', NULL, '2025-09-05 04:44:33', '2025-09-05 04:44:33'),
(68, 7, 2, '이런 게시글을 기다리고 있었어요.', NULL, '2025-09-05 04:44:33', '2025-09-05 04:44:33'),
(69, 7, 4, '도움이 되었습니다. 감사해요!', NULL, '2025-09-05 04:44:33', '2025-09-05 04:44:33'),
(70, 7, 1, '정말 유용한 팁이에요!', NULL, '2025-09-05 04:44:33', '2025-09-05 04:44:33'),
(71, 7, 4, '이런 정보가 정말 필요했어요!', NULL, '2025-09-05 04:44:33', '2025-09-05 04:44:33');

-- --------------------------------------------------------

--
-- 테이블 구조 `community_posts`
--

CREATE TABLE `community_posts` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `category` varchar(255) DEFAULT '자유게시판',
  `views` int DEFAULT '0',
  `likes` int DEFAULT '0',
  `comments_count` int DEFAULT '0',
  `images` json DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- 테이블의 덤프 데이터 `community_posts`
--

INSERT INTO `community_posts` (`id`, `user_id`, `title`, `content`, `category`, `views`, `likes`, `comments_count`, `images`, `location`, `created_at`, `updated_at`) VALUES
(1, 2, '우리 동네 맛집 추천해주세요!', '안녕하세요! 최근에 이사를 와서 동네 맛집을 잘 모르겠어요.\n\n특히 한식당이나 카페 추천 부탁드립니다. 가족끼리 가기 좋은 곳이면 더욱 좋겠어요.\n\n집 근처 반경 2km 이내로 찾고 있습니다. 주차 가능한 곳이면 금상첨화!\n\n미리 감사드려요~ 🍽️', '맛집/가게', 124, 8, 15, '[]', '서울시 강남구', '2025-09-05 04:44:33', '2025-09-05 04:44:33'),
(2, 3, '중고거래 사기 예방 팁 공유합니다!', '최근 중고거래 사기가 많아지는 것 같아 몇 가지 팁을 공유합니다.\n\n1. 직거래 시에는 반드시 안전한 장소에서\n2. 고액 거래 시에는 더치트 등 사기 조회 서비스 이용\n3. 판매자의 과거 거래 내역 확인\n\n모두 안전한 거래하세요!', '정보공유', 250, 20, 5, '[]', '부산시 해운대구', '2025-09-05 04:44:33', '2025-09-05 04:44:33'),
(3, 4, '이사 후 남은 가구 무료 나눔합니다', '이사하고 남은 가구들 무료로 나눔합니다. 상태는 사용감 있지만 깨끗합니다.\n\n- 3인용 소파 (패브릭, 베이지색)\n- 원목 책상 (120cm)\n- 작은 책장\n\n필요하신 분은 댓글 남겨주세요. 직접 가져가셔야 합니다.', '나눔', 80, 5, 10, '[]', '대구시 중구', '2025-09-05 04:44:33', '2025-09-05 04:44:33'),
(4, 2, '강남역 근처 맛있는 일식집 추천해주세요', '회사 회식으로 갈 만한 곳을 찾고 있습니다. 15명 정도 들어갈 수 있는 곳이면 좋겠어요. 예산은 1인당 3-4만원 정도입니다.', '동네질문', 100, 5, 8, '[]', '서초구 서초동', '2025-09-05 04:44:33', '2025-09-05 04:44:33'),
(5, 3, '검은색 골든리트리버 찾습니다', '어제 저녁 산책 중 목줄이 빠져서 도망갔습니다. 이름은 \"콩이\"이고 매우 순한 성격입니다. 목에 파란색 목걸이를 하고 있어요.', '분실/실종', 150, 25, 12, '[]', '강남구 역삼동', '2025-09-05 04:44:33', '2025-09-05 04:44:33'),
(6, 4, '주말에 한강공원에서 플리마켓 열려요', '이번 주말 토요일 오후 2시부터 6시까지 반포한강공원에서 플리마켓이 열립니다. 핸드메이드 제품, 빈티지 의류, 수제 디저트 등 다양한 물건들이 나와요!', '동네소식', 200, 40, 15, '[]', '서초구 반포동', '2025-09-05 04:44:33', '2025-09-05 04:44:33'),
(7, 5, '신논현역 새로 생긴 베이커리 완전 맛있어요!', '어제 신논현역 8번출구 쪽에 새로 생긴 베이커리 가봤는데 크루아상이 정말 바삭하고 맛있더라구요. 커피도 괜찮고 사장님도 친절하세요.', '맛집/가게', 90, 10, 6, '[]', '강남구 논현동', '2025-09-05 04:44:33', '2025-09-05 04:44:33');

-- --------------------------------------------------------

--
-- 테이블 구조 `community_post_likes`
--

CREATE TABLE `community_post_likes` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `post_id` int NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- 테이블 구조 `coupons`
--

CREATE TABLE `coupons` (
  `id` int NOT NULL,
  `code` varchar(50) NOT NULL,
  `expires_at` datetime DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` datetime DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `type` enum('percentage','fixed','delivery') NOT NULL,
  `value` decimal(10,2) NOT NULL,
  `min_order_amount` decimal(10,2) DEFAULT '0.00',
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- 테이블의 덤프 데이터 `coupons`
--

INSERT INTO `coupons` (`id`, `code`, `expires_at`, `is_active`, `created_at`, `name`, `type`, `value`, `min_order_amount`, `updated_at`) VALUES
(1, 'WELCOME10', NULL, 1, '2025-09-05 01:30:39', '', 'percentage', 0.00, 0.00, NULL),
(2, 'SAVE50', NULL, 1, '2025-09-05 01:30:39', '', 'percentage', 0.00, 0.00, NULL),
(3, 'ADMIN100', NULL, 1, '2025-09-05 01:30:39', '', 'percentage', 0.00, 0.00, NULL);

-- --------------------------------------------------------

--
-- 테이블 구조 `file_uploads`
--

CREATE TABLE `file_uploads` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `original_name` varchar(255) NOT NULL,
  `file_path` varchar(500) NOT NULL,
  `file_size` bigint NOT NULL,
  `mime_type` varchar(100) DEFAULT NULL,
  `upload_type` enum('profile','product','chat','other') DEFAULT 'other',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `is_verified` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- 테이블 구조 `products`
--

CREATE TABLE `products` (
  `id` int NOT NULL,
  `seller_id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text,
  `price` decimal(10,2) NOT NULL,
  `category` varchar(255) DEFAULT NULL,
  `condition_status` enum('new','like_new','good','fair','poor') DEFAULT 'good',
  `images` text,
  `location` varchar(255) DEFAULT NULL,
  `is_sold` tinyint(1) DEFAULT '0',
  `buyer_id` int DEFAULT NULL,
  `sold_at` datetime DEFAULT NULL,
  `views` int DEFAULT '0',
  `likes` int DEFAULT '0',
  `negotiable` tinyint(1) DEFAULT '1',
  `seller_phone` varchar(255) DEFAULT NULL,
  `seller_email` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- 테이블의 덤프 데이터 `products`
--

INSERT INTO `products` (`id`, `seller_id`, `title`, `description`, `price`, `category`, `condition_status`, `images`, `location`, `is_sold`, `buyer_id`, `sold_at`, `views`, `likes`, `negotiable`, `seller_phone`, `seller_email`, `created_at`, `updated_at`) VALUES
(1, 2, '아이폰 14 Pro 128GB - 거의 새것', '작년에 구입한 아이폰 14 Pro입니다. 케이스 끼고 사용해서 스크래치 거의 없어요. 박스, 충전기 모두 포함됩니다.', 950000.00, '디지털/가전', 'like_new', '[\"/uploads/phone1.jpg\",\"/uploads/phone2.jpg\"]', '서울시 서초구', 0, NULL, NULL, 0, 0, 1, '010-1111-1111', 'user1@test.com', '2025-09-05 04:44:33', '2025-09-05 04:44:33'),
(2, 3, '북유럽 원목 식탁 4인용', '이사로 인해 판매합니다. 사용한지 1년 정도 되었고 상태 양호합니다. 의자는 포함되지 않습니다.', 150000.00, '가구/인테리어', 'good', '[\"/uploads/table1.jpg\"]', '부산시 해운대구', 0, NULL, NULL, 0, 0, 1, '010-2222-2222', 'user2@test.com', '2025-09-05 04:44:33', '2025-09-05 04:44:33'),
(3, 4, '삼성 갤럭시 탭 S8 256GB WiFi', '업무용으로 사용하던 태블릿입니다. 화면 보호필름 부착되어 있고, S펜도 같이 드립니다.', 450000.00, '디지털/가전', 'good', '[\"/uploads/tablet1.jpg\",\"/uploads/tablet2.jpg\"]', '대구시 중구', 0, NULL, NULL, 0, 0, 0, '010-3333-3333', 'seller@marketplace.com', '2025-09-05 04:44:33', '2025-09-05 04:44:33'),
(4, 2, '나이키 에어포스1 화이트 280mm', '몇 번 신지 않은 운동화입니다. 사이즈가 맞지 않아 판매해요. 정품 인증서 있습니다.', 80000.00, '패션/의류', 'like_new', '[\"/uploads/shoes1.jpg\"]', '서울시 서초구', 0, NULL, NULL, 0, 0, 1, '010-1111-1111', 'user1@test.com', '2025-09-05 04:44:33', '2025-09-05 04:44:33'),
(5, 5, '다이슨 V11 무선청소기', '2년 사용한 다이슨 청소기입니다. 동작 이상 없고 필터 교체했습니다. 모든 헤드 포함됩니다.', 300000.00, '생활가전', 'good', '[\"/uploads/vacuum1.jpg\"]', '인천시 연수구', 0, NULL, NULL, 0, 0, 1, '010-4444-4444', 'buyer@shop.com', '2025-09-05 04:44:33', '2025-09-05 04:44:33'),
(6, 3, '루이비통 스피디 30 정품', '10년 전에 구입한 루이비통 가방입니다. 사용감은 있지만 정품이고 상태는 괜찮습니다.', 800000.00, '패션/의류', 'fair', '[\"/uploads/bag1.jpg\",\"/uploads/bag2.jpg\"]', '부산시 해운대구', 0, NULL, NULL, 0, 0, 1, '010-2222-2222', 'user2@test.com', '2025-09-05 04:44:33', '2025-09-05 04:44:33'),
(7, 4, '맥북 에어 M1 8GB 256GB', '재택근무용으로 사용하던 맥북입니다. 충전 사이클 300회 미만이고 박스 포함입니다.', 950000.00, '디지털/가전', 'good', '[\"/uploads/macbook1.jpg\"]', '대구시 중구', 0, NULL, NULL, 0, 0, 1, '010-3333-3333', 'seller@marketplace.com', '2025-09-05 04:44:33', '2025-09-05 04:44:33');

-- --------------------------------------------------------

--
-- 테이블 구조 `transactions`
--

CREATE TABLE `transactions` (
  `id` int NOT NULL,
  `buyer_id` int NOT NULL,
  `seller_id` int NOT NULL,
  `product_id` int NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `status` enum('pending','completed','cancelled','refunded') DEFAULT 'pending',
  `payment_method` varchar(255) DEFAULT 'credits',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `payment_data` text,
  `transaction_id` varchar(255) DEFAULT NULL,
  `notes` text,
  `refund_reason` text,
  `refund_amount` decimal(10,2) DEFAULT NULL,
  `completed_at` datetime DEFAULT NULL,
  `cancelled_at` datetime DEFAULT NULL,
  `refunded_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- 테이블의 덤프 데이터 `transactions`
--

INSERT INTO `transactions` (`id`, `buyer_id`, `seller_id`, `product_id`, `amount`, `status`, `payment_method`, `created_at`, `updated_at`, `payment_data`, `transaction_id`, `notes`, `refund_reason`, `refund_amount`, `completed_at`, `cancelled_at`, `refunded_at`) VALUES
(1, 6, 2, 4, 80000.00, 'completed', 'credits', '2025-09-05 01:38:24', '2025-09-05 01:38:24', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(2, 6, 3, 2, 150000.00, 'completed', 'credits', '2025-09-05 01:58:51', '2025-09-05 01:58:51', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- 테이블 구조 `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `address` text,
  `profile_image` varchar(255) DEFAULT NULL,
  `role` enum('user','admin') DEFAULT 'user',
  `is_active` tinyint(1) DEFAULT '1',
  `last_login` datetime DEFAULT NULL,
  `login_attempts` int DEFAULT '0',
  `reset_token` varchar(255) DEFAULT NULL,
  `manner_score` float DEFAULT '36.5',
  `credits` decimal(10,2) NOT NULL DEFAULT '0.00',
  `credit_card` varchar(255) DEFAULT NULL,
  `social_security_number` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- 테이블의 덤프 데이터 `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `name`, `phone`, `address`, `profile_image`, `role`, `is_active`, `last_login`, `login_attempts`, `reset_token`, `manner_score`, `credits`, `credit_card`, `social_security_number`, `created_at`, `updated_at`) VALUES
(1, 'admin@vintage-market.com', '0192023a7bbd73250516f069df18b500', '관리자', '010-0000-0000', '서울시 강남구 테헤란로 123', NULL, 'admin', 1, NULL, 0, NULL, 36.5, 0.00, '1234-5678-9012-3456', '123456-1234567', '2025-09-05 04:44:33', '2025-09-05 04:44:33'),
(2, 'user1@test.com', '482c811da5d5b4bc6d497ffa98491e38', '김철수', '010-1111-1111', '서울시 서초구 서초대로 456', NULL, 'user', 1, NULL, 0, NULL, 42.5, 0.00, '9876-5432-1098-7654', '987654-9876543', '2025-09-05 04:44:33', '2025-09-05 04:44:33'),
(3, 'user2@test.com', 'cc03e747a6afbbcbf8be7668acfebee5', '이영희', '010-2222-2222', '부산시 해운대구 해운대로 789', NULL, 'user', 1, NULL, 0, NULL, 38.2, 0.00, '5555-4444-3333-2222', '555444-5554444', '2025-09-05 04:44:33', '2025-09-05 04:44:33'),
(4, 'seller@marketplace.com', '1e4970ada8c054474cda889490de3421', '박상인', '010-3333-3333', '대구시 중구 중앙대로 321', NULL, 'user', 1, NULL, 0, NULL, 45.8, 0.00, '1111-2222-3333-4444', '111222-1112222', '2025-09-05 04:44:33', '2025-09-05 04:44:33'),
(5, 'buyer@shop.com', '40e868c2d8064888a2a3365a63a84d58', '최구매', '010-4444-4444', '인천시 연수구 송도대로 654', NULL, 'user', 1, NULL, 0, NULL, 40.1, 0.00, '7777-8888-9999-0000', '777888-7778888', '2025-09-05 04:44:33', '2025-09-05 04:44:33');

-- --------------------------------------------------------

--
-- 테이블 구조 `user_coupons`
--

CREATE TABLE `user_coupons` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `coupon_id` int NOT NULL,
  `is_used` tinyint(1) DEFAULT '0',
  `used_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- 테이블 구조 `user_likes`
--

CREATE TABLE `user_likes` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `product_id` int NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- 테이블 구조 `user_sessions`
--

CREATE TABLE `user_sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` int NOT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `expires_at` timestamp NULL DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `session_data` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- 덤프된 테이블의 인덱스
--

--
-- 테이블의 인덱스 `admin_logs`
--
ALTER TABLE `admin_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `admin_id` (`admin_id`);

--
-- 테이블의 인덱스 `chat_messages`
--
ALTER TABLE `chat_messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `idx_chat_messages_sender` (`sender_id`),
  ADD KEY `idx_chat_messages_receiver` (`receiver_id`);

--
-- 테이블의 인덱스 `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `idx_comments_product` (`product_id`);

--
-- 테이블의 인덱스 `community_comments`
--
ALTER TABLE `community_comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `post_id` (`post_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `parent_id` (`parent_id`);

--
-- 테이블의 인덱스 `community_posts`
--
ALTER TABLE `community_posts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- 테이블의 인덱스 `community_post_likes`
--
ALTER TABLE `community_post_likes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `community_post_likes_user_id_post_id` (`user_id`,`post_id`),
  ADD KEY `post_id` (`post_id`);

--
-- 테이블의 인덱스 `coupons`
--
ALTER TABLE `coupons`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`),
  ADD UNIQUE KEY `code_2` (`code`);

--
-- 테이블의 인덱스 `file_uploads`
--
ALTER TABLE `file_uploads`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- 테이블의 인덱스 `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- 테이블의 인덱스 `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_transactions_buyer` (`buyer_id`),
  ADD KEY `idx_transactions_seller` (`seller_id`),
  ADD KEY `product_id` (`product_id`);

--
-- 테이블의 인덱스 `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- 테이블의 인덱스 `user_coupons`
--
ALTER TABLE `user_coupons`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `coupon_id` (`coupon_id`);

--
-- 테이블의 인덱스 `user_likes`
--
ALTER TABLE `user_likes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_product` (`user_id`,`product_id`),
  ADD KEY `idx_user_likes_user` (`user_id`),
  ADD KEY `idx_user_likes_product` (`product_id`);

--
-- 테이블의 인덱스 `user_sessions`
--
ALTER TABLE `user_sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- 덤프된 테이블의 AUTO_INCREMENT
--

--
-- 테이블의 AUTO_INCREMENT `admin_logs`
--
ALTER TABLE `admin_logs`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- 테이블의 AUTO_INCREMENT `chat_messages`
--
ALTER TABLE `chat_messages`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- 테이블의 AUTO_INCREMENT `comments`
--
ALTER TABLE `comments`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- 테이블의 AUTO_INCREMENT `community_comments`
--
ALTER TABLE `community_comments`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=72;

--
-- 테이블의 AUTO_INCREMENT `community_posts`
--
ALTER TABLE `community_posts`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- 테이블의 AUTO_INCREMENT `community_post_likes`
--
ALTER TABLE `community_post_likes`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- 테이블의 AUTO_INCREMENT `coupons`
--
ALTER TABLE `coupons`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- 테이블의 AUTO_INCREMENT `file_uploads`
--
ALTER TABLE `file_uploads`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- 테이블의 AUTO_INCREMENT `products`
--
ALTER TABLE `products`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- 테이블의 AUTO_INCREMENT `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- 테이블의 AUTO_INCREMENT `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- 테이블의 AUTO_INCREMENT `user_coupons`
--
ALTER TABLE `user_coupons`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- 테이블의 AUTO_INCREMENT `user_likes`
--
ALTER TABLE `user_likes`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- 덤프된 테이블의 제약사항
--

--
-- 테이블의 제약사항 `admin_logs`
--
ALTER TABLE `admin_logs`
  ADD CONSTRAINT `admin_logs_ibfk_1` FOREIGN KEY (`admin_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- 테이블의 제약사항 `chat_messages`
--
ALTER TABLE `chat_messages`
  ADD CONSTRAINT `chat_messages_ibfk_1` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `chat_messages_ibfk_2` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `chat_messages_ibfk_3` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE SET NULL;

--
-- 테이블의 제약사항 `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- 테이블의 제약사항 `community_comments`
--
ALTER TABLE `community_comments`
  ADD CONSTRAINT `community_comments_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `community_posts` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `community_comments_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `community_comments_ibfk_3` FOREIGN KEY (`parent_id`) REFERENCES `community_comments` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- 테이블의 제약사항 `community_posts`
--
ALTER TABLE `community_posts`
  ADD CONSTRAINT `community_posts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE;

--
-- 테이블의 제약사항 `community_post_likes`
--
ALTER TABLE `community_post_likes`
  ADD CONSTRAINT `community_post_likes_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `community_post_likes_ibfk_4` FOREIGN KEY (`post_id`) REFERENCES `community_posts` (`id`) ON UPDATE CASCADE;

--
-- 테이블의 제약사항 `file_uploads`
--
ALTER TABLE `file_uploads`
  ADD CONSTRAINT `file_uploads_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- 테이블의 제약사항 `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `transactions_ibfk_4` FOREIGN KEY (`buyer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `transactions_ibfk_5` FOREIGN KEY (`seller_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `transactions_ibfk_6` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- 테이블의 제약사항 `user_coupons`
--
ALTER TABLE `user_coupons`
  ADD CONSTRAINT `user_coupons_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `user_coupons_ibfk_4` FOREIGN KEY (`coupon_id`) REFERENCES `coupons` (`id`);

--
-- 테이블의 제약사항 `user_likes`
--
ALTER TABLE `user_likes`
  ADD CONSTRAINT `user_likes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_likes_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- 테이블의 제약사항 `user_sessions`
--
ALTER TABLE `user_sessions`
  ADD CONSTRAINT `user_sessions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
