const { sequelize } = require('../config/database');
const User = require('../models/User');
const CommunityPost = require('../models/CommunityPost');
const Comment = require('../models/Comment');

async function setupCommunity() {
  try {
    console.log('Setting up community database...');
    
    // Sync all models with database
    await sequelize.sync({ force: true });
    
    console.log('✅ All tables created successfully!');
    
    // Create sample users
    console.log('Creating sample users...');
    
    const user1 = await User.create({
      name: '김철수',
      email: 'kim@example.com',
      password: 'password123'
    });
    
    const user2 = await User.create({
      name: '이영희',
      email: 'lee@example.com',
      password: 'password123'
    });
    
    const user3 = await User.create({
      name: '박민수',
      email: 'park@example.com',
      password: 'password123'
    });
    
    console.log('✅ Sample users created successfully!');
    
    // Create sample community posts for each category
    console.log('Creating sample community posts...');
    
    const posts = [
      {
        title: '동네 맛집 추천해주세요!',
        content: '새로 이사왔는데 주변에 맛있는 식당이 있을까요? 한식이나 중식 추천 부탁드려요.',
        category: '동네질문',
        location: '강남구',
        userId: user1.id,
        views: 15,
        likes: 3,
        commentsCount: 2
      },
      {
        title: '주말에 같이 운동할 분 구합니다',
        content: '주말 아침에 조깅이나 산책 같이 하실 분 있나요? 건강한 생활 습관 만들어봐요!',
        category: '취미/운동',
        location: '강남구',
        userId: user2.id,
        views: 8,
        likes: 1,
        commentsCount: 1
      },
      {
        title: '강남역 근처 분실물 보관소 위치',
        content: '강남역 근처에 분실물 보관소가 있다고 들었는데 정확한 위치를 아시나요?',
        category: '분실/실종',
        location: '강남구',
        userId: user3.id,
        views: 12,
        likes: 0,
        commentsCount: 0
      },
      {
        title: '동네 소식: 새로운 공원이 생겼어요!',
        content: '우리 동네에 새로운 공원이 생겼어요. 아이들이 놀기 좋고 산책하기도 좋습니다.',
        category: '동네소식',
        location: '강남구',
        userId: user1.id,
        views: 25,
        likes: 5,
        commentsCount: 3
      },
      {
        title: '맛있는 커피집 발견했어요',
        content: '동네에 숨겨진 맛있는 커피집을 발견했어요. 분위기도 좋고 커피도 맛있어요!',
        category: '맛집/가게',
        location: '강남구',
        userId: user2.id,
        views: 18,
        likes: 4,
        commentsCount: 2
      },
      {
        title: '자유게시판: 동네 이야기',
        content: '우리 동네에 대한 다양한 이야기를 나누어보아요. 좋은 점, 개선할 점 등등.',
        category: '자유게시판',
        location: '강남구',
        userId: user3.id,
        views: 10,
        likes: 2,
        commentsCount: 1
      }
    ];
    
    const createdPosts = await CommunityPost.bulkCreate(posts);
    console.log('✅ Sample community posts created successfully!');
    
    // Create sample comments
    console.log('Creating sample comments...');
    
    const comments = [
      {
        content: '강남역 근처에 맛있는 한식집이 있어요! 추천드립니다.',
        post_id: createdPosts[0].id,
        user_id: user2.id
      },
      {
        content: '저도 추천하고 싶은 맛집이 있어요.',
        post_id: createdPosts[0].id,
        user_id: user3.id
      },
      {
        content: '저도 참여하고 싶어요! 어디서 만날까요?',
        post_id: createdPosts[1].id,
        user_id: user1.id
      },
      {
        content: '정말 좋은 소식이네요! 언제 가볼까요?',
        post_id: createdPosts[3].id,
        user_id: user2.id
      },
      {
        content: '저도 그 공원에 가봤어요. 정말 좋았어요!',
        post_id: createdPosts[3].id,
        user_id: user3.id
      },
      {
        content: '어디에 있는지 알려주세요!',
        post_id: createdPosts[3].id,
        user_id: user1.id
      },
      {
        content: '정말 맛있나요? 가격은 어때요?',
        post_id: createdPosts[4].id,
        user_id: user1.id
      },
      {
        content: '저도 가봤는데 정말 좋았어요!',
        post_id: createdPosts[4].id,
        user_id: user3.id
      },
      {
        content: '동네가 정말 좋은 것 같아요.',
        post_id: createdPosts[5].id,
        user_id: user1.id
      }
    ];
    
    await Comment.bulkCreate(comments);
    console.log('✅ Sample comments created successfully!');
    
    // Update comment counts
    for (const post of createdPosts) {
      const commentCount = await Comment.count({ where: { postId: post.id } });
      await post.update({ commentsCount: commentCount });
    }
    
    console.log('✅ Comment counts updated successfully!');
    
    console.log('\n🎉 Community setup completed successfully!');
    console.log(`Created ${createdPosts.length} posts with ${comments.length} comments`);
    
  } catch (error) {
    console.error('❌ Error setting up community:', error);
  } finally {
    await sequelize.close();
  }
}

setupCommunity();
