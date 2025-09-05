const { sequelize } = require("../config/database");
const User = require("../models/User");
const Product = require("../models/Product");
const CommunityPost = require("../models/CommunityPost");
const Comment = require("../models/Comment");

const seedUsers = [
  {
    email: "admin@vintage-market.com",
    password: "admin123",
    name: "관리자",
    phone: "010-0000-0000",
    address: "서울시 강남구 테헤란로 123",
    role: "admin",
    creditCard: "1234-5678-9012-3456",
    socialSecurityNumber: "123456-1234567",
  },
  {
    email: "user1@test.com",
    password: "password123",
    name: "김철수",
    phone: "010-1111-1111",
    address: "서울시 서초구 서초대로 456",
    role: "user",
    mannerScore: 42.5,
    creditCard: "9876-5432-1098-7654",
    socialSecurityNumber: "987654-9876543",
  },
  {
    email: "user2@test.com",
    password: "test123",
    name: "이영희",
    phone: "010-2222-2222",
    address: "부산시 해운대구 해운대로 789",
    role: "user",
    mannerScore: 38.2,
    creditCard: "5555-4444-3333-2222",
    socialSecurityNumber: "555444-5554444",
  },
  {
    email: "seller@marketplace.com",
    password: "seller123",
    name: "박상인",
    phone: "010-3333-3333",
    address: "대구시 중구 중앙대로 321",
    role: "user",
    mannerScore: 45.8,
    creditCard: "1111-2222-3333-4444",
    socialSecurityNumber: "111222-1112222",
  },
  {
    email: "buyer@shop.com",
    password: "buyer123",
    name: "최구매",
    phone: "010-4444-4444",
    address: "인천시 연수구 송도대로 654",
    role: "user",
    mannerScore: 40.1,
    creditCard: "7777-8888-9999-0000",
    socialSecurityNumber: "777888-7778888",
  },
];

const seedProducts = [
  {
    userId: 2, // 김철수
    title: "아이폰 14 Pro 128GB - 거의 새것",
    description:
      "작년에 구입한 아이폰 14 Pro입니다. 케이스 끼고 사용해서 스크래치 거의 없어요. 박스, 충전기 모두 포함됩니다.",
    price: 950000,
    category: "디지털/가전",
    condition: "like_new",
    location: "서울시 서초구",
    status: "available",
    negotiable: true,
    images: ["/uploads/phone1.jpg", "/uploads/phone2.jpg"],
    sellerPhone: "010-1111-1111",
    sellerEmail: "user1@test.com",
  },
  {
    userId: 3, // 이영희
    title: "북유럽 원목 식탁 4인용",
    description:
      "이사로 인해 판매합니다. 사용한지 1년 정도 되었고 상태 양호합니다. 의자는 포함되지 않습니다.",
    price: 150000,
    category: "가구/인테리어",
    condition: "good",
    location: "부산시 해운대구",
    status: "available",
    negotiable: true,
    images: ["/uploads/table1.jpg"],
    sellerPhone: "010-2222-2222",
    sellerEmail: "user2@test.com",
  },
  {
    userId: 4, // 박상인
    title: "삼성 갤럭시 탭 S8 256GB WiFi",
    description:
      "업무용으로 사용하던 태블릿입니다. 화면 보호필름 부착되어 있고, S펜도 같이 드립니다.",
    price: 450000,
    category: "디지털/가전",
    condition: "good",
    location: "대구시 중구",
    status: "available",
    negotiable: false,
    images: ["/uploads/tablet1.jpg", "/uploads/tablet2.jpg"],
    sellerPhone: "010-3333-3333",
    sellerEmail: "seller@marketplace.com",
  },
  {
    userId: 2, // 김철수
    title: "나이키 에어포스1 화이트 280mm",
    description:
      "몇 번 신지 않은 운동화입니다. 사이즈가 맞지 않아 판매해요. 정품 인증서 있습니다.",
    price: 80000,
    category: "패션/의류",
    condition: "like_new",
    location: "서울시 서초구",
    status: "reserved",
    negotiable: true,
    images: ["/uploads/shoes1.jpg"],
    sellerPhone: "010-1111-1111",
    sellerEmail: "user1@test.com",
  },
  {
    userId: 5, // 최구매
    title: "다이슨 V11 무선청소기",
    description:
      "2년 사용한 다이슨 청소기입니다. 동작 이상 없고 필터 교체했습니다. 모든 헤드 포함됩니다.",
    price: 300000,
    category: "생활가전",
    condition: "good",
    location: "인천시 연수구",
    status: "sold",
    negotiable: true,
    images: ["/uploads/vacuum1.jpg"],
    sellerPhone: "010-4444-4444",
    sellerEmail: "buyer@shop.com",
  },
  {
    userId: 3, // 이영희
    title: "루이비통 스피디 30 정품",
    description:
      "10년 전에 구입한 루이비통 가방입니다. 사용감은 있지만 정품이고 상태는 괜찮습니다.",
    price: 800000,
    category: "패션/의류",
    condition: "fair",
    location: "부산시 해운대구",
    status: "available",
    negotiable: true,
    images: ["/uploads/bag1.jpg", "/uploads/bag2.jpg"],
    sellerPhone: "010-2222-2222",
    sellerEmail: "user2@test.com",
  },
  {
    userId: 4, // 박상인
    title: "맥북 에어 M1 8GB 256GB",
    description:
      "재택근무용으로 사용하던 맥북입니다. 충전 사이클 300회 미만이고 박스 포함입니다.",
    price: 950000,
    category: "디지털/가전",
    condition: "good",
    location: "대구시 중구",
    status: "available",
    negotiable: true,
    images: ["/uploads/macbook1.jpg"],
    sellerPhone: "010-3333-3333",
    sellerEmail: "seller@marketplace.com",
  },
];

const seedCommunityPosts = [
  {
    user_id: 2, // 김철수
    title: "우리 동네 맛집 추천해주세요!",
    content: "안녕하세요! 최근에 이사를 와서 동네 맛집을 잘 모르겠어요.\n\n특히 한식당이나 카페 추천 부탁드립니다. 가족끼리 가기 좋은 곳이면 더욱 좋겠어요.\n\n집 근처 반경 2km 이내로 찾고 있습니다. 주차 가능한 곳이면 금상첨화!\n\n미리 감사드려요~ 🍽️",
    category: "맛집/가게",
    views: 124,
    likes: 8,
    comments_count: 15,
    location: "서울시 강남구",
    images: []
  },
  {
    user_id: 3, // 이영희
    title: "중고거래 사기 예방 팁 공유합니다!",
    content: "최근 중고거래 사기가 많아지는 것 같아 몇 가지 팁을 공유합니다.\n\n1. 직거래 시에는 반드시 안전한 장소에서\n2. 고액 거래 시에는 더치트 등 사기 조회 서비스 이용\n3. 판매자의 과거 거래 내역 확인\n\n모두 안전한 거래하세요!",
    category: "정보공유",
    views: 250,
    likes: 20,
    comments_count: 5,
    location: "부산시 해운대구",
    images: []
  },
  {
    user_id: 4, // 박상인
    title: "이사 후 남은 가구 무료 나눔합니다",
    content: "이사하고 남은 가구들 무료로 나눔합니다. 상태는 사용감 있지만 깨끗합니다.\n\n- 3인용 소파 (패브릭, 베이지색)\n- 원목 책상 (120cm)\n- 작은 책장\n\n필요하신 분은 댓글 남겨주세요. 직접 가져가셔야 합니다.",
    category: "나눔",
    views: 80,
    likes: 5,
    comments_count: 10,
    location: "대구시 중구",
    images: []
  },
  {
    user_id: 2, // 김철수
    title: "강남역 근처 맛있는 일식집 추천해주세요",
    content: "회사 회식으로 갈 만한 곳을 찾고 있습니다. 15명 정도 들어갈 수 있는 곳이면 좋겠어요. 예산은 1인당 3-4만원 정도입니다.",
    location: "서초구 서초동",
    category: "동네질문",
    views: 100,
    likes: 5,
    comments_count: 8,
    images: []
  },
  {
    user_id: 3, // 이영희
    title: "검은색 골든리트리버 찾습니다",
    content: "어제 저녁 산책 중 목줄이 빠져서 도망갔습니다. 이름은 \"콩이\"이고 매우 순한 성격입니다. 목에 파란색 목걸이를 하고 있어요.",
    location: "강남구 역삼동",
    category: "분실/실종",
    views: 150,
    likes: 25,
    comments_count: 12,
    images: []
  },
  {
    user_id: 4, // 박상인
    title: "주말에 한강공원에서 플리마켓 열려요",
    content: "이번 주말 토요일 오후 2시부터 6시까지 반포한강공원에서 플리마켓이 열립니다. 핸드메이드 제품, 빈티지 의류, 수제 디저트 등 다양한 물건들이 나와요!",
    location: "서초구 반포동",
    category: "동네소식",
    views: 200,
    likes: 40,
    comments_count: 15,
    images: []
  },
  {
    user_id: 5, // 최구매
    title: "신논현역 새로 생긴 베이커리 완전 맛있어요!",
    content: "어제 신논현역 8번출구 쪽에 새로 생긴 베이커리 가봤는데 크루아상이 정말 바삭하고 맛있더라구요. 커피도 괜찮고 사장님도 친절하세요.",
    location: "강남구 논현동",
    category: "맛집/가게",
    views: 90,
    likes: 10,
    comments_count: 6,
    images: []
  }
];

// 각 게시글의 comments_count에 맞게 더미 댓글 생성
function generateCommentsForPosts(posts) {
  const comments = [];
  const commentTemplates = [
    "정말 좋은 정보네요! 감사합니다.",
    "저도 궁금했는데 도움이 되었어요.",
    "이런 정보가 정말 필요했어요!",
    "추천해주셔서 감사합니다.",
    "한번 가보고 싶네요.",
    "정말 유용한 팁이에요!",
    "저도 비슷한 경험이 있어요.",
    "도움이 되었습니다. 감사해요!",
    "정말 좋은 아이디어네요!",
    "이런 게시글을 기다리고 있었어요.",
    "정말 감사합니다!",
    "한번 시도해보겠어요.",
    "정말 유용한 정보예요!",
    "저도 추천하고 싶은 곳이 있어요.",
    "정말 좋은 소식이네요!",
    "언제 가볼까요?",
    "정말 맛있나요?",
    "가격은 어때요?",
    "분위기도 좋나요?",
    "주차는 가능한가요?"
  ];

  posts.forEach((post, index) => {
    const commentCount = post.comments_count || 0;
    
    for (let i = 0; i < commentCount; i++) {
      const randomUser = Math.floor(Math.random() * 5) + 1; // user_id 1-5
      const randomComment = commentTemplates[Math.floor(Math.random() * commentTemplates.length)];
      
      comments.push({
        post_id: post.id,
        user_id: randomUser,
        content: randomComment
      });
    }
  });

  return comments;
}

async function seedDatabase() {
  try {
    console.log("🌱 Starting database seeding...");

    // Connect to database
    await sequelize.authenticate();
    console.log("✅ Database connection established.");

    // Sync models
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0'); // Disable foreign key checks
    await sequelize.sync({ force: true }); // This will drop and recreate tables
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1'); // Enable foreign key checks
    console.log("📊 Database tables synchronized.");

    // Create users
    console.log("👥 Creating users...");
    const users = await User.bulkCreate(seedUsers, {
      individualHooks: true, // This ensures password hashing works
    });
    console.log(`✅ Created ${users.length} users.`);

    // Create products
    console.log("📦 Creating products...");
    const products = await Product.bulkCreate(seedProducts);
    console.log(`✅ Created ${products.length} products.`);

    // Create community posts
    console.log("✍️ Creating community posts...");
    const communityPosts = await CommunityPost.bulkCreate(seedCommunityPosts);
    console.log(`✅ Created ${communityPosts.length} community posts.`);

    // Generate comments based on each post's comments_count
    console.log("💬 Generating community comments...");
    const generatedComments = generateCommentsForPosts(communityPosts);
    console.log(`📝 Generated ${generatedComments.length} comments for ${communityPosts.length} posts.`);
    
    // Show comment count for each post
    communityPosts.forEach(post => {
      const commentCount = post.comments_count || 0;
      console.log(`📝 Post ${post.id} (${post.title.substring(0, 20)}...): ${commentCount} comments`);
    });

    // Create community comments
    console.log("💬 Creating community comments...");
    const communityComments = await Comment.bulkCreate(generatedComments);
    console.log(`✅ Created ${communityComments.length} community comments.`);

    // Update comment counts to match actual count
    console.log("📊 Updating comment counts...");
    for (const post of communityPosts) {
      const actualCommentCount = await Comment.count({ where: { post_id: post.id } });
      await post.update({ comments_count: actualCommentCount });
      console.log(`📝 Post ${post.id}: ${actualCommentCount} comments (updated from ${post.comments_count})`);
    }
    console.log("✅ Comment counts updated.");

    console.log("🎉 Database seeding completed successfully!");
    console.log("\n📋 Test Accounts:");
    console.log("- Admin: admin@vintage-market.com / admin123");
    console.log("- User1: user1@test.com / password123");
    console.log("- User2: user2@test.com / test123");
    console.log("- Seller: seller@marketplace.com / seller123");
    console.log("- Buyer: buyer@shop.com / buyer123");
  } catch (error) {
    console.error("❌ Database seeding failed:", error);
    throw error;
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log("✅ Seeding process completed.");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Seeding process failed:", error);
      process.exit(1);
    });
}

module.exports = { seedDatabase };

